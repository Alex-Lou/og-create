// Le village (world/village.js) : où l'on marche. La grille des cases praticables, le plus court chemin, la porte
// d'un bâtiment, la case de travail près d'une annexe.

import { pavedAt } from '../terrain';

const WALK = 'gsmdpkb';
const STAIRS = 'pkb';
// Ce que coûte un pas vers une case (le plus court chemin) : une porte ou un chemin 3, l'herbe 6 (le chemin coûte
// moitié moins), le pavé 2 (on le préfère encore : choix de l'auteur, 16 oct.)
const stepCost = (M, x, y, door) => (door ? 3 : pavedAt(M, x, y) ? 2 : STAIRS.includes(M.ground(x, y)) ? 3 : 6);
const BLOCKING = new Set(['tree', 'pine', 'palm', 'bush', 'rock', 'rocks', 'crag', 'apple', 'birch', 'autumn', 'stump', 'log', 'mossy', 'lantern', 'bench', 'nest']);

// Grille où l'on marche : sol praticable des quartiers à soi, ni bâtiment, ni création, ni annexe, ni objet du camp
// des naufragés (camp : ses cases ; l'épave, les caisses… : on n'y marche pas, on ne s'y cache pas), ni arbre ou
// rocher ; d'une case à l'autre à la même hauteur, ou par les marches des chemins. Une porte d'enclos se traverse
// (choix de l'auteur, 15 oct. : les habitants ont la clé, verrou ou pas ; through), sans qu'on s'y arrête
const DOOR = 'porte';
export function gridOf({ n, M, sites, owned, crafts, props, annexes, camp = [] }) {
  const doors = new Set(crafts.filter(c => c.craft === DOOR && c.x >= 0 && c.y >= 0 && c.x < n && c.y < n).map(c => c.y * n + c.x));
  const blocked = new Uint8Array(n * n);
  for (const s of sites) for (let y = s.y; y < s.y + s.h; y++) for (let x = s.x; x < s.x + s.w; x++) if (x >= 0 && y >= 0 && x < n && y < n) blocked[y * n + x] = 1;
  for (const t of [...crafts, ...annexes, ...camp]) if (t.x >= 0 && t.y >= 0 && t.x < n && t.y < n) blocked[t.y * n + t.x] = 1;
  for (const p of props) if (BLOCKING.has(p.kind)) blocked[p.y * n + p.x] = 1;
  const walk = (x, y) => x >= 0 && y >= 0 && x < n && y < n && !blocked[y * n + x] && owned.has(M.zone(x, y)) && WALK.includes(M.ground(x, y));
  // (où l'on passe sans s'arrêter : une porte des quartiers à soi)
  const through = (x, y) => x >= 0 && y >= 0 && x < n && y < n && doors.has(y * n + x) && owned.has(M.zone(x, y));
  const step = (a, b) => {
    const [ga, gb] = [M.ground(a.x, a.y), M.ground(b.x, b.y)];
    const dh = Math.abs(M.height(a.x, a.y) - M.height(b.x, b.y));
    return dh === 0 || (STAIRS.includes(ga) && STAIRS.includes(gb) && dh <= 1) || ga === 'b' || gb === 'b';
  };
  // Case libre (pour les bêtes des climats, qui ne suivent pas les chemins)
  const free = (x, y) => x >= 0 && y >= 0 && x < n && y < n && !blocked[y * n + x];
  // Cases où l'on marche (pour flâner)
  const walkable = [];
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (walk(x, y)) walkable.push({ x, y });
  return { n, M, walk, through, step, free, walkable };
}
// L'empreinte d'une grille (un entier) : les cases où l'on marche, leur sol, leur hauteur, leur pavé, les portes qu'on
// traverse. Deux grilles de même empreinte donnent les mêmes chemins (le village refait garde alors les siens)
export function gridKeyOf(grid) {
  const { n, M, walkable } = grid;
  const pass = grid.through || (() => false);
  let h = 2166136261;
  const mix = v => { h = Math.imul(h ^ v, 16777619); };
  for (const { x, y } of walkable) {
    mix(y * n + x);
    mix(M.ground(x, y).charCodeAt(0));
    mix(M.height(x, y));
    mix(pavedAt(M, x, y) ? 1 : 0);
  }
  for (let i = 0; i < n * n; i++) if (pass(i % n, Math.floor(i / n))) mix(-1 - i);
  return h >>> 0;
}
// Plus court chemin (les chemins coûtent moitié moins que l'herbe, le pavé encore moins : stepCost) : liste de cases,
// ou null. Cherché vers le but (A*) : un pas coûte au moins MIN_STEP, la distance à vol de case ne surestime jamais ce
// qui reste ; le chemin trouvé reste le plus court, en fouillant bien moins de cases. Ses tableaux de travail servent
// d'un chemin à l'autre (aucune mémoire allouée à chaque recherche)
const MIN_STEP = 2;
let work = null;
export function route(grid, from, to) {
  const { n, M, walk, step } = grid;
  const pass = grid.through || (() => false);
  if (!from || !to) return null;
  if (!work || work.n !== n) work = { n, dist: new Float32Array(n * n), prev: new Int32Array(n * n), stamp: new Uint32Array(n * n), run: 0 };
  // (une case n'est à jour que si elle porte le tampon de cette recherche)
  const run = ++work.run;
  const { dist, prev, stamp } = work;
  const g = i => (stamp[i] === run ? dist[i] : Infinity);
  const start = from.y * n + from.x;
  const goal = to.y * n + to.x;
  const h = i => MIN_STEP * (Math.abs((i % n) - to.x) + Math.abs(Math.floor(i / n) - to.y));
  stamp[start] = run;
  dist[start] = 0;
  prev[start] = -1;
  // File à seaux, par coût estimé (fait + reste) : les pas coûtent 2 (pavé), 3 (chemin, porte) ou 6 (herbe)
  const buckets = [];
  buckets[h(start)] = [start];
  let found = false;
  for (let f = h(start); f < buckets.length && !found; f++) {
    const bucket = buckets[f];
    if (!bucket) continue;
    for (let b = 0; b < bucket.length; b++) {
      const i = bucket[b];
      if (g(i) + h(i) !== f) continue;
      if (i === goal) {
        found = true;
        break;
      }
      const x = i % n;
      const y = (i - x) / n;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        const door = pass(nx, ny);
        if (!(walk(nx, ny) || door) || !step({ x, y }, { x: nx, y: ny })) continue;
        const j = ny * n + nx;
        const nd = g(i) + stepCost(M, nx, ny, door);
        if (nd < g(j)) {
          stamp[j] = run;
          dist[j] = nd;
          prev[j] = i;
          const fj = nd + h(j);
          (buckets[fj] = buckets[fj] || []).push(j);
        }
      }
    }
  }
  if (!found) return null;
  const path = [];
  for (let i = goal; i !== -1; i = prev[i]) path.push({ x: i % n, y: Math.floor(i / n) });
  return path.reverse();
}
// Case où l'on travaille à une annexe : une case praticable qui la touche, la plus proche de la porte du bâtiment
export function besideOf(grid, annex, door) {
  const ok = [[1, 0], [0, 1], [-1, 0], [0, -1]].map(([dx, dy]) => ({ x: annex.x + dx, y: annex.y + dy })).filter(c => grid.walk(c.x, c.y));
  if (!ok.length) return null;
  const d = c => (door ? Math.abs(c.x - door.x) + Math.abs(c.y - door.y) : 0);
  return ok.reduce((a, b) => (d(b) < d(a) ? b : a));
}
// La case où l'on marche la plus proche d'une case donnée (elle-même si l'on y marche)
export function nearestWalk(grid, cell) {
  const d = c => Math.hypot(c.x - cell.x, c.y - cell.y);
  return grid.walkable.reduce((best, c) => (!best || d(c) < d(best) ? c : best), null) || cell;
}
// Porte d'un bâtiment : la case praticable autour de son emprise la plus en avant (vers le joueur), un chemin si possible
export function doorOf(grid, site) {
  const ring = [];
  for (let x = site.x - 1; x <= site.x + site.w; x++) for (const y of [site.y - 1, site.y + site.h]) ring.push({ x, y });
  for (let y = site.y; y < site.y + site.h; y++) for (const x of [site.x - 1, site.x + site.w]) ring.push({ x, y });
  const ok = ring.filter(c => grid.walk(c.x, c.y));
  if (!ok.length) return null;
  const score = c => c.x + c.y + (STAIRS.includes(grid.M.ground(c.x, c.y)) ? 0.6 : 0);
  return ok.reduce((a, b) => (score(b) > score(a) ? b : a));
}
