import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Le build garde les dossiers de l'ancien build vue-cli (js/, css/, img/, fonts/) : le service worker (public/sw.js) met
// en cache d'abord ce qui est sous ces préfixes, aux noms changeant à chaque version
const folderOf = name => (/\.css$/.test(name) ? 'css' : /\.(woff2?|ttf|otf|eot)$/.test(name) ? 'fonts' : 'img');

export default defineConfig(({ command }) => ({
  plugins: [vue()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    extensions: ['.mjs', '.js', '.json', '.vue']
  },
  // VUE_APP_API_URL (Render, render.yaml) reste lue telle quelle
  envPrefix: ['VITE_', 'VUE_APP_'],
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
  },
  // Même origine qu'en production (cookies de session SameSite=Strict) : /api est relayé au backend local
  server: { port: 8080, proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } } },
  preview: { port: 8080, proxy: { '/api': { target: 'http://localhost:3000', changeOrigin: true } } },
  // Pas de console en production (comme le drop_console de l'ancien build)
  esbuild: command === 'build' ? { drop: ['console'] } : {},
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 4096,
    // Les dessins de la bibliothèque restent des fichiers, lus à la demande (et gardés par le service worker) : intégrés
    // en base64 dans le code, ils l'alourdissaient de plusieurs centaines de Ko au démarrage
    assetsInlineLimit: file => (file.includes('/design/bibliotheque/') ? false : undefined),
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: info => `${folderOf(info.name || '')}/[name].[hash][extname]`
      }
    }
  }
}));
