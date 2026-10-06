import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Tests de la logique pure (src/utils) ; l'alias « @ » est celui de vite.config.mjs
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: { include: ['tests/**/*.test.js'] }
});
