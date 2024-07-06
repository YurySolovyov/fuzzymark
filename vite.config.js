import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: './extension/chrome',
    rollupOptions: {
      input: {
        main: './src/frontend/main.js',
        background: './src/backend/background.js',
      },
      output: {
        entryFileNames: 'scripts/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
    sourcemap: process.env.CI === undefined,
  },

  plugins: [vue()],
});
