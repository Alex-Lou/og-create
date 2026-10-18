// Le service worker (public/sw.js) : à chaque ouverture en ligne, la page se garde pour le hors-ligne, et les fichiers
// d'une autre version que celle que liste le build (fichiers.json) quittent le cache ; les icônes, aux noms fixes,
// restent, et rien ne part si la liste ne se lit pas
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const ORIGIN = 'https://brumelune.test';
const source = readFileSync(new URL('../public/sw.js', import.meta.url), 'utf8');

// Le service worker dans un monde à lui : son cache, le réseau (list : ce que répond fichiers.json)
function worker(cached, list) {
  const listeners = {};
  const store = new Map(cached.map(path => [`${ORIGIN}${path}`, 'ancien']));
  const cache = {
    keys: async () => [...store.keys()].map(url => ({ url })),
    put: async (path, value) => { store.set(`${ORIGIN}${path}`, value); },
    delete: async request => store.delete(request.url)
  };
  const network = async (url) => {
    if (url === '/fichiers.json') return list instanceof Error ? Promise.reject(list) : list;
    return { ok: true, clone: () => 'la page' };
  };
  runInNewContext(source, {
    self: { addEventListener: (type, fn) => { listeners[type] = fn; }, skipWaiting() {}, clients: { claim: async () => {} }, location: { origin: ORIGIN } },
    caches: { open: async () => cache, keys: async () => [], delete: async () => true, match: async () => null },
    fetch: network,
    URL,
    Promise
  });
  // Une ouverture du jeu : la page arrive, et ce qu'elle fait attendre (waitUntil) se termine
  const open = async () => {
    const waits = [];
    listeners.fetch({ request: { method: 'GET', url: `${ORIGIN}/`, mode: 'navigate' }, respondWith: p => waits.push(p), waitUntil: p => waits.push(p) });
    await Promise.all(waits);
    await Promise.all(waits);
  };
  return { open, paths: () => [...store.keys()].map(url => url.slice(ORIGIN.length)).sort() };
}
const listed = files => ({ ok: true, json: async () => files });

describe('le service worker', () => {
  const cached = ['/js/index.NEW.js', '/js/index.OLD.js', '/js/marche.OLD.js', '/img/aster.OLD.svg', '/img/aster.NEW.svg', '/css/index.NEW.css', '/icons/icon-192.png'];

  it('garde la page, et retire du cache ce que la version en ligne ne liste plus (pas les icônes)', async () => {
    const sw = worker(cached, listed(['/js/index.NEW.js', '/img/aster.NEW.svg', '/css/index.NEW.css']));
    await sw.open();
    expect(sw.paths()).toEqual(['/', '/css/index.NEW.css', '/icons/icon-192.png', '/img/aster.NEW.svg', '/js/index.NEW.js']);
  });

  it('ne retire rien si la liste ne se lit pas : hors ligne, ou la page du jeu à sa place', async () => {
    for (const list of [new Error('hors ligne'), { ok: false }, { ok: true, json: async () => { throw new SyntaxError('<!doctype html>'); } }, listed([])]) {
      const sw = worker(cached, list);
      await sw.open();
      expect(sw.paths()).toEqual(['/', ...cached].sort());
    }
  });
});
