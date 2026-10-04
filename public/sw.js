// Service worker minimal : installation en app (PWA) et démarrage hors ligne.
// - Pages : réseau d'abord (toujours la dernière version en ligne), copie en cache pour le hors-ligne.
// - Fichiers du build (js, css, images, icônes) : cache d'abord ; leurs noms changent à chaque version.
// - Le reste (API, polices externes) n'est jamais intercepté.
// Changer de nom vide l'ancien cache (icônes et fichiers à nom fixe)
const CACHE = 'origins-v2';
const STATIC_PREFIXES = ['/js/', '/css/', '/img/', '/fonts/', '/icons/'];

self.addEventListener('install', () => self.skipWaiting());

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
          const copy = response.clone();
          caches.open(CACHE).then(cache => cache.put('/', copy));
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
