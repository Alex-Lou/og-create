// Service worker minimal : installation en app (PWA) et démarrage hors ligne.
// - Pages : réseau d'abord (toujours la dernière version en ligne), copie en cache pour le hors-ligne.
// - Fichiers du build (js, css, images, icônes) : cache d'abord ; leurs noms changent à chaque version.
// - Le reste (API, polices externes) n'est jamais intercepté.
// Changer de nom vide l'ancien cache (icônes et fichiers à nom fixe)
const CACHE = 'origins-v2';
const STATIC_PREFIXES = ['/js/', '/css/', '/img/', '/fonts/', '/icons/'];

self.addEventListener('install', () => self.skipWaiting());

// Les fichiers du build changent de nom à chaque version (« /js/index.CF9HPkaY.js ») : sans ménage, le cache
// gardait toutes les versions. Retire ceux qu'une nouvelle page remplace (même nom, autre empreinte) ; un fichier
// qu'elle ne cite pas (chargé à la demande) reste
const nameOf = path => path.replace(/\.[^./]+\.(js|css)$/, '');
function prune(cache, html) {
  const current = new Set(html.match(/\/(?:js|css)\/[^"'\s>]+/g) || []);
  const replaced = new Set([...current].map(nameOf));
  return cache.keys().then(requests => Promise.all(requests.map(request => {
    const { pathname } = new URL(request.url);
    return !current.has(pathname) && replaced.has(nameOf(pathname)) ? cache.delete(request) : null;
  })));
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
            const page = response.clone();
            event.waitUntil(caches.open(CACHE).then(cache => Promise.all([
              cache.put('/', copy),
              page.text().then(html => prune(cache, html))
            ])));
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
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        return response;
      }))
    );
  }
});
