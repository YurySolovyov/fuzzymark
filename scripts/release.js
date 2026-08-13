import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const releaseDir = join(root, 'release');

const run = (command, args, options = {}) => {
  execFileSync(command, args, {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
    ...options,
  });
};

const output = (command, args) =>
  execFileSync(command, args, { cwd: root, encoding: 'utf8' }).trim();

const prepare = (type) => {
  if (!['major', 'minor', 'patch'].includes(type)) {
    throw new Error('Usage: pnpm release:prepare <major|minor|patch>');
  }
  if (output('git', ['status', '--porcelain'])) throw new Error('The worktree must be clean');

  run('pnpm', ['version', type, '--no-git-tag-version']);
  const version = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).version;
  const tag = `v${version}`;
  run('git', ['add', 'package.json', 'public/manifest.json']);
  run('git', ['commit', '-m', `release: ${tag}`]);
  run('git', ['tag', '-a', tag, '-m', `release: ${tag}`]);
  run('git', ['push', '--atomic', 'origin', 'HEAD', tag]);
};

const requireEnv = (names) => {
  for (const name of names) {
    if (!process.env[name]) throw new Error(`${name} is missing from .env`);
  }
};

const perform = () => {
  if (!existsSync(join(root, '.env'))) throw new Error('Create .env from .env.example');

  const tags = output('git', ['ls-remote', '--tags', '--refs', 'origin'])
    .split('\n')
    .map((line) => line.match(/refs\/tags\/(v\d+\.\d+\.\d+)$/)?.[1])
    .filter(Boolean)
    .sort((left, right) =>
      left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' }),
    );
  const tag = tags.at(-1);
  if (!tag) throw new Error('No vX.Y.Z tags found on origin');
  console.log(`Releasing ${tag}`);

  run('git', ['fetch', 'origin', `refs/tags/${tag}:refs/tags/${tag}`]);
  rmSync(releaseDir, { recursive: true, force: true });
  mkdirSync(releaseDir);

  const version = tag.slice(1);
  const sourceArchive = join(releaseDir, `fuzzymark-${version}-source.zip`);
  const sourceDir = join(releaseDir, 'source');
  run('git', ['archive', '--format=zip', `--output=${sourceArchive}`, tag]);
  mkdirSync(sourceDir);
  run('unzip', ['-q', sourceArchive, '-d', sourceDir]);

  const packageJson = JSON.parse(readFileSync(join(sourceDir, 'package.json'), 'utf8'));
  if (packageJson.version !== version) throw new Error(`${tag} does not match package.json`);

  run('pnpm', ['install', '--frozen-lockfile'], { cwd: sourceDir });
  run('pnpm', ['build'], { cwd: sourceDir, env: { ...process.env, CI: 'true' } });
  const chromeDir = join(releaseDir, 'chrome');
  const firefoxDir = join(releaseDir, 'firefox');
  renameSync(join(sourceDir, 'extension/chrome'), chromeDir);
  renameSync(join(sourceDir, 'extension/firefox'), firefoxDir);

  loadEnvFile(join(root, '.env'));
  requireEnv([
    'AMO_JWT_ISSUER',
    'AMO_JWT_SECRET',
    'CHROME_CLIENT_ID',
    'CHROME_CLIENT_SECRET',
    'CHROME_EXTENSION_ID',
    'CHROME_PUBLISHER_ID',
    'CHROME_REFRESH_TOKEN',
  ]);

  run('pnpm', ['exec', 'chrome-webstore-upload', '--source', chromeDir], {
    cwd: sourceDir,
    env: {
      ...process.env,
      CLIENT_ID: process.env.CHROME_CLIENT_ID,
      CLIENT_SECRET: process.env.CHROME_CLIENT_SECRET,
      EXTENSION_ID: process.env.CHROME_EXTENSION_ID,
      PUBLISHER_ID: process.env.CHROME_PUBLISHER_ID,
      REFRESH_TOKEN: process.env.CHROME_REFRESH_TOKEN,
    },
  });

  run(
    'pnpm',
    [
      'exec',
      'web-ext',
      'sign',
      '--source-dir',
      firefoxDir,
      '--channel',
      'listed',
      '--no-input',
      '--upload-source-code',
      sourceArchive,
      '--approval-timeout',
      '0',
    ],
    {
      cwd: sourceDir,
      env: {
        ...process.env,
        WEB_EXT_API_KEY: process.env.AMO_JWT_ISSUER,
        WEB_EXT_API_SECRET: process.env.AMO_JWT_SECRET,
      },
    },
  );
};

const [command, argument] = process.argv.slice(2);

try {
  if (command === 'prepare') prepare(argument);
  else if (command === 'perform' && argument === undefined) perform();
  else throw new Error('Use pnpm release:prepare or pnpm release:perform');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
