import path from 'node:path';
import { cp, rm, readFile, writeFile } from 'node:fs/promises';

const dir = process.cwd();

const CHROME_DIR = path.resolve(dir, './extension/chrome');
const FIREFOX_DIR = path.resolve(dir, './extension/firefox');

const copy = async () => {
  await rm(FIREFOX_DIR, { recursive: true, force: true });
  await cp(CHROME_DIR, FIREFOX_DIR, { recursive: true });
};

const fixup = async () => {
  const manifestString = await readFile(path.join(CHROME_DIR, 'manifest.json'), 'utf-8');
  const { browser_specific_settings: _drop, ...manifestUpdated } = JSON.parse(manifestString);
  
  await writeFile(path.join(CHROME_DIR, 'manifest.json'), JSON.stringify(manifestUpdated, null, 2));
}

await copy();
await fixup();