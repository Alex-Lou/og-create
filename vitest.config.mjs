import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import { libraryInline, libraryUrls } from './vite.library.mjs';

// Tests de la logique pure (src/utils) ; l'alias « @ » et les dessins de la bibliothèque sont ceux de vite.config.mjs
export default defineConfig({
  plugins: [libraryUrls()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: { assetsInlineLimit: libraryInline },
  test: { include: ['tests/**/*.test.js'], setupFiles: ['tests/setup/library.js'] }
});
