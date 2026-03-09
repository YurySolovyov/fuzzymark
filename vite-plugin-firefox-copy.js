import path from 'node:path';
import { cp, rm, readFile, writeFile } from 'node:fs/promises';

export default function firefoxCopyPlugin() {
  const chromeDir = path.resolve('./extension/chrome');
  const firefoxDir = path.resolve('./extension/firefox');

  return {
    name: 'firefox-copy',
    closeBundle: {
      sequential: true,
      async handler() {
        await rm(firefoxDir, { recursive: true, force: true });
        await cp(chromeDir, firefoxDir, { recursive: true });

        // Chrome: remove browser_specific_settings (not supported)
        const chromeManifestPath = path.join(chromeDir, 'manifest.json');
        const chromeManifest = JSON.parse(await readFile(chromeManifestPath, 'utf-8'));
        delete chromeManifest.browser_specific_settings;
        await writeFile(chromeManifestPath, JSON.stringify(chromeManifest, null, 2));

        // Firefox: convert service_worker to background scripts
        const firefoxManifestPath = path.join(firefoxDir, 'manifest.json');
        const firefoxManifest = JSON.parse(await readFile(firefoxManifestPath, 'utf-8'));
        firefoxManifest.background = {
          scripts: [firefoxManifest.background.service_worker],
          type: 'module',
        };
        await writeFile(firefoxManifestPath, JSON.stringify(firefoxManifest, null, 2));
      },
    },
  };
}
