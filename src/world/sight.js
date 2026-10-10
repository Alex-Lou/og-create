// La vue dégagée (choix de l'auteur, 8 oct. : « une règle fixe qui empêche la perte de vue d'un endroit à cause de la
// végétation ») : vue d'en haut, un arbre dessiné après une chose (plus bas à l'écran) la cache s'il passe devant son
// dessin. Aucun arbre ne pousse là où il cacherait une part de ce qui se tient debout (bâtiments, camp, lieux,
// gisements, annexes, créations) : il pousse un peu plus loin (WorldView/terrain.js, natureOf). Ce qui reste bas
// (touffes, fleurs, champignons, buissons) ne cache rien et reste à sa place.
import { TW, TH } from '@/world/view/constants';

// Les sortes hautes, celles qui cachent
export const TALL = new Set(['tree', 'apple', 'autumn', 'birch', 'pine', 'palm', 'snowpine', 'deadtree', 'crag']);
// Le dessin d'un arbre autour de son pied (monde) : demi-largeur du feuillage, hauteur (palette.js, PROP_BOX)
const TREE_HALF = 28;
const TREE_H = 92;
// Un arbre cache une chose s'il en couvre au moins ce bas (la part de sa hauteur)
const COVER = 0.2;
// Jusqu'où chercher devant (cases)
const REACH = 7;

const world = (x, y) => ({ x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 });

// Les cases où un arbre cacherait une chose : Set des clés y * n + x. objects : [{ x, y, w?, h?, tall }] (emprise en
// cases, w et h : 1 par défaut ; tall : la hauteur de son dessin au-dessus du centre de l'emprise, en unités du monde) ;
// lift(x, y) : la hauteur du sol (le relief), 0 par défaut
export function sightOf(objects, n, lift = () => 0) {
  const out = new Set();
  for (const o of objects) {
    const w = o.w || 1;
    const h = o.h || 1;
    const c = world(o.x + (w - 1) / 2, o.y + (h - 1) / 2);
    const base = c.y - lift(o.x, o.y);
    const top = base - o.tall;
    const bottom = base + (TH * (w + h)) / 4;
    const half = (TW * (w + h)) / 4 * 0.8;
    // (dessiné après la chose : plus en avant qu'elle)
    const front = o.x + o.y + Math.max(w, h);
    for (let b = o.y - REACH; b <= o.y + h + REACH; b++) {
      for (let a = o.x - REACH; a <= o.x + w + REACH; a++) {
        if (a < 0 || b < 0 || a >= n || b >= n || a + b < front) continue;
        if (a >= o.x && a < o.x + w && b >= o.y && b < o.y + h) continue;
        const g = world(a, b);
        const foot = g.y - lift(a, b);
        if (Math.abs(g.x - c.x) >= half + TREE_HALF) continue;
        if (foot - TREE_H < bottom - (bottom - top) * COVER && foot > top) out.add(b * n + a);
      }
    }
  }
  return out;
}

// Où replanter un arbre chassé de (x, y) : la case libre la plus proche (jusqu'à reach cases), derrière d'abord (plus
// haut à l'écran) ; null s'il n'y en a pas. ok(x, y) : la case peut-elle le recevoir. Fixe pour une île donnée
export function replantOf(x, y, ok, reach = 3) {
  for (let r = 1; r <= reach; r++) {
    const ring = [];
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Math.max(Math.abs(dx), Math.abs(dy)) === r) ring.push([dx, dy]);
    ring.sort((p, q) => p[0] + p[1] - (q[0] + q[1]) || p[1] - q[1]);
    for (const [dx, dy] of ring) if (ok(x + dx, y + dy)) return { x: x + dx, y: y + dy };
  }
  return null;
}
