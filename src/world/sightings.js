// Les rencontres de chaque créature du Bestiaire sur cet appareil (sa fiche ; choix de l'auteur, 18 oct.) : combien de
// fois, et la dernière. Un toucher ne compte pour une nouvelle rencontre que GAP ms après la précédente (une série de
// touchers n'en fait qu'une). Gardées sur l'appareil seulement : aucun appel au serveur
import * as storage from '@/utils/storage';

const KEY = 'oc_bestiaire_vus';
export const GAP = 10 * 60 * 1000;
// id → [nombre, dernière (ms)], lu une fois
let kept = null;
const all = () => (kept = kept || storage.load(KEY, {}) || {});

export function recordSighting(id, now = Date.now()) {
  const seen = all();
  const [count = 0, last = -Infinity] = seen[id] || [];
  if (now - last < GAP) return;
  seen[id] = [count + 1, now];
  storage.save(KEY, seen);
}

// { count, last (ms, ou null) }
export function sightingOf(id) {
  const [count = 0, last = null] = all()[id] || [];
  return { count, last };
}
