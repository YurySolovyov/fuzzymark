import { readFileSync, writeFileSync } from 'node:fs';

const manifestPath = 'public/manifest.json';
const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.version = packageJson.version;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
