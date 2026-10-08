// La vue dégagée (choix de l'auteur, 8 oct. : « une règle fixe qui empêche la perte de vue d'un endroit à cause de la
// végétation ») : vue d'en haut, un arbre cache ce qui est derrière lui, plus haut à l'écran. Devant tout ce qui se
// tient debout (bâtiments, camp, lieux, gisements, annexes, créations), jusqu'à deux cases, aucun arbre ne pousse : il
// pousse un peu plus loin (WorldView/terrain.js, natureOf). Ce qui reste bas (touffes, fleurs, champignons) ne cache
// rien et reste à sa place.

// Les sortes hautes, celles qui cachent
export const TALL = new Set(['tree', 'apple', 'autumn', 'birch', 'pine', 'palm', 'snowpine', 'deadtree', 'crag']);
// Jusqu'où devant (cases)
const FRONT = 2;

// Les cases devant les emprises { x, y, w?, h? } (w, h : 1 par défaut), hors des emprises : Set des clés y * n + x.
// « Devant » : plus au sud ou plus à l'est (plus bas à l'écran), sur deux cases, et une case de côté
export function sightOf(objects, n) {
  const out = new Set();
  for (const o of objects) {
    const w = o.w || 1;
    const h = o.h || 1;
    for (let y = o.y - 1; y <= o.y + h - 1 + FRONT; y++) {
      for (let x = o.x - 1; x <= o.x + w - 1 + FRONT; x++) {
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        const inside = x >= o.x && x < o.x + w && y >= o.y && y < o.y + h;
        if (!inside && (x >= o.x + w || y >= o.y + h)) out.add(y * n + x);
      }
    }
  }
  return out;
}

// Où replanter un arbre chassé de (x, y) : la case libre la plus proche (jusqu'à 3 cases), en s'éloignant de ce qu'il
// cachait si possible ; null s'il n'y en a pas. ok(x, y) : la case peut-elle le recevoir. Fixe pour une île donnée
export function replantOf(x, y, ok, reach = 3) {
  for (let r = 1; r <= reach; r++) {
    // (dans l'ordre : vers le haut de l'écran d'abord, derrière ce qu'il cachait)
    const ring = [];
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (Math.max(Math.abs(dx), Math.abs(dy)) === r) ring.push([dx, dy]);
    ring.sort((a, b) => a[0] + a[1] - (b[0] + b[1]) || a[1] - b[1]);
    for (const [dx, dy] of ring) if (ok(x + dx, y + dy)) return { x: x + dx, y: y + dy };
  }
  return null;
}
