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
  // Chrome does not like extra browser_specific_settings prop
  {
    const manifestString = await readFile(path.join(CHROME_DIR, 'manifest.json'), 'utf-8');
    const { browser_specific_settings: _drop, ...manifestUpdated } = JSON.parse(manifestString);

    await writeFile(path.join(CHROME_DIR, 'manifest.json'), JSON.stringify(manifestUpdated, null, 2));
  }

  // Firefox can't do service workers in extensions, but can do background scripts
  {
    const manifestString = await readFile(path.join(FIREFOX_DIR, 'manifest.json'), 'utf-8');
    const { background, ...manifestUpdated } = JSON.parse(manifestString);

    manifestUpdated.background = {
      scripts: [background.service_worker]
    };

    await writeFile(path.join(FIREFOX_DIR, 'manifest.json'), JSON.stringify(manifestUpdated, null, 2));
  }
}

await copy();
await fixup();