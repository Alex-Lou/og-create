import { readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { libraryInline, libraryUrls } from './vite.library.mjs';

// Le build garde les dossiers de l'ancien build vue-cli (js/, css/, img/, fonts/) : le service worker (public/sw.js) met
// en cache d'abord ce qui est sous ces préfixes, aux noms changeant à chaque version
const folderOf = name => (/\.css$/.test(name) ? 'css' : /\.(woff2?|ttf|otf|eot)$/.test(name) ? 'fonts' : 'img');

// Empreinte de cette version : écrite dans version.json à côté du build, et connue du code (import.meta.env.
// VITE_APP_VERSION). Le jeu en ligne relit version.json : une autre empreinte veut dire qu'une mise à jour l'attend
// (utils/newVersion.js)
const APP_VERSION = Date.now().toString(36);
process.env.VITE_APP_VERSION = APP_VERSION;
const versionFile = {
  name: 'version-file',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ version: APP_VERSION }) });
  }
};

// Les fichiers de cette version sous ces préfixes (fichiers.json, à côté du build : ceux du build et ceux de public/) :
// le service worker retire de son cache ceux qui n'y sont plus (public/sw.js ; les dessins et les fichiers lus à la
// demande d'une version passée y restaient sans fin)
const LISTED = /^(js|css|img|fonts)\//;
const publicDir = fileURLToPath(new URL('./public', import.meta.url));
const filesList = {
  name: 'files-list',
  generateBundle(options, bundle) {
    const own = readdirSync(publicDir, { recursive: true }).filter(file => statSync(`${publicDir}/${file}`).isFile());
    const files = [...Object.keys(bundle), ...own].filter(file => LISTED.test(file)).sort().map(file => `/${file}`);
    this.emitFile({ type: 'asset', fileName: 'fichiers.json', source: JSON.stringify(files) });
  }
};

export default defineConfig(({ command }) => ({
  plugins: [vue(), versionFile, filesList, libraryUrls()],
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
    // (les tailles compressées de plus de 8 000 fichiers ne servent qu'à l'affichage, et leur calcul faisait tuer le build
    // faute de mémoire sur le VPS)
    reportCompressedSize: false,
    // Les dessins de la bibliothèque restent des fichiers, lus à la demande (et gardés par le service worker) : intégrés
    // en base64 dans le code, ils l'alourdissaient de plusieurs centaines de Ko au démarrage
    assetsInlineLimit: libraryInline,
    rollupOptions: {
      output: {
        entryFileNames: 'js/[name].[hash].js',
        chunkFileNames: 'js/[name].[hash].js',
        assetFileNames: info => `${folderOf(info.name || '')}/[name].[hash][extname]`
      }
    }
  }
}));
