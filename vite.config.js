import { extname } from 'node:path';

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import firefoxCopyPlugin from './vite-plugin-firefox-copy.js';

const inlineFontExtensions = new Set(['.woff', '.woff2', '.ttf', '.otf']);
const sourcemap = process.env.CI === undefined;

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: ['chrome144', 'firefox144'],
    assetsInlineLimit: (filePath) => inlineFontExtensions.has(extname(filePath)),
    outDir: './extension/chrome',
    // TODO: make a release mode
    emptyOutDir: false,
    rolldownOptions: {
      input: {
        main: './src/frontend/main.js',
        background: './src/backend/background.js',
      },
      output: {
        entryFileNames: 'scripts/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    sourcemap,
  },

  plugins: [tailwindcss(), vue(), firefoxCopyPlugin()],

  test: {
    globals: true,
    environment: 'node',
    include: ['test/*-spec.js'],
  },
});
