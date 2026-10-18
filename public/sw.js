// Service worker minimal : installation en app (PWA) et démarrage hors ligne.
// - Pages : réseau d'abord (toujours la dernière version en ligne), copie en cache pour le hors-ligne.
// - Fichiers du build (js, css, images, icônes) : cache d'abord ; leurs noms changent à chaque version.
// - Le reste (API, polices externes) n'est jamais intercepté.
// Changer de nom vide l'ancien cache (icônes et fichiers à nom fixe). v3 : vide aussi les pages HTML gardées par erreur
// à la place d'un fichier du build (voir plus bas). v4 : vide les dessins de l'île gardés en fichiers de code (js/), un
// par dessin, que le jeu ne demande plus (il les lit dans img/ : src/world/library.js)
const CACHE = 'origins-v4';
const STATIC_PREFIXES = ['/js/', '/css/', '/img/', '/fonts/', '/icons/'];

self.addEventListener('install', () => self.skipWaiting());

// Les fichiers du build changent de nom à chaque version (« /js/index.CF9HPkaY.js ») : sans ménage, le cache gardait
// toutes les versions. Le build liste les siens (fichiers.json, vite.config.mjs) ; ceux d'une autre version partent,
// dessins et fichiers lus à la demande compris. La liste se relit à chaque ouverture en ligne (le serveur répond « pas
// changé » tant qu'elle ne l'est pas) ; illisible (hors ligne, ou la page du jeu à sa place), rien ne part
const PRUNED = ['/js/', '/css/', '/img/', '/fonts/'];
function prune(cache) {
  return fetch('/fichiers.json', { cache: 'no-cache' })
    .then(response => (response.ok ? response.json() : null))
    .then(files => {
      if (!Array.isArray(files) || !files.length) return null;
      const current = new Set(files);
      return cache.keys().then(requests => Promise.all(requests.map(request => {
        const { pathname } = new URL(request.url);
        return PRUNED.some(prefix => pathname.startsWith(prefix)) && !current.has(pathname) ? cache.delete(request) : null;
      })));
    })
    .catch(() => null);
}

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Une page d'erreur ne remplace pas la copie hors ligne
          if (response.ok) {
            const copy = response.clone();
            event.waitUntil(caches.open(CACHE).then(cache => Promise.all([cache.put('/', copy), prune(cache)])));
          }
          return response;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  if (STATIC_PREFIXES.some(prefix => url.pathname.startsWith(prefix))) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request).then(response => {
        // Un fichier disparu (le jeu mis à jour pendant qu'une page plus ancienne tournait) peut revenir sous la forme de
        // la page de l'application (règle « tout vers index.html » du serveur) : gardé, il casserait ce fichier jusqu'au
        // vidage du cache
        if (response.ok && !(response.headers.get('content-type') || '').includes('text/html')) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
  }
});
