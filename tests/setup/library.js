// Les tests lisent les dessins de la bibliothèque comme le jeu (src/world/library.js : textsOf, par fetch), mais sur le
// disque : sous vitest, leurs adresses sont celles du serveur de développement (/design/bibliotheque/…, vite.library.mjs)
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const LIBRARY = '/design/bibliotheque/';
const network = globalThis.fetch;

globalThis.fetch = (url, options) => {
  if (typeof url !== 'string' || !url.startsWith(LIBRARY)) return network(url, options);
  return readFile(ROOT + url.slice(1)).then(
    body => new Response(body, { headers: { 'content-type': 'image/svg+xml' } }),
    () => new Response('', { status: 404 })
  );
};
