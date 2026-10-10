// Le tracé des chemins (le serveur décide : world/paths.js, POST /play/world/paths). Ici, ce que le jeu en montre avant
// d'envoyer : les cases sous le doigt (sans trou, d'un côté à l'autre), celles où un chemin peut passer, et ce que
// coûte le tracé. Mêmes règles que le serveur : sur l'herbe, le sable ou la prairie d'un quartier à soi, hors des
// emprises des bâtiments (la grande, celle du palier IV), des lieux remarquables, des gisements, des annexes, des
// créations et du camp ; une pierre la case, les premières offertes ; une case tracée effacée rend sa pierre (pas
// une case offerte), et sa place redevient offerte.

// Sols où un chemin se trace
export const ROAD_GROUND = 'gsm';
const isPath = g => g === 'p' || g === 'k';

// Les cases d'une case à l'autre, sans diagonale (un chemin se suit côte à côte) : [{ x, y }], from exclue
export function stepCells(from, to) {
  const out = [];
  let { x, y } = from;
  while (x !== to.x || y !== to.y) {
    const dx = to.x - x;
    const dy = to.y - y;
    // (le plus long des deux écarts d'abord : la ligne colle au doigt)
    if (Math.abs(dx) >= Math.abs(dy)) x += Math.sign(dx);
    else y += Math.sign(dy);
    out.push({ x, y });
  }
  return out;
}

// La grande emprise d'un bâtiment (3 × 3, celle du palier IV) : un 2 × 2 en est le coin avant
export const bigOf = site => (site.w >= 3 ? { x: site.x, y: site.y, w: site.w, h: site.h } : { x: site.x - 1, y: site.y - 1, w: 3, h: 3 });

// Ce qui empêche un chemin sur (x, y) (texte), ou null. ctx : { ground(x, y), owned(x, y) (quartier à soi),
// taken: Set des clés « x,y » (bâtiments, lieux, gisements, annexes, créations, camp) }
export function roadBlock(x, y, ctx) {
  if (!ctx.owned(x, y)) return 'Trace tes chemins dans tes quartiers.';
  const g = ctx.ground(x, y);
  if (isPath(g)) return 'Il y a déjà un chemin ici.';
  if (!ROAD_GROUND.includes(g || '-')) return 'Un chemin se trace sur l’herbe, le sable ou la prairie.';
  if (ctx.taken.has(`${x},${y}`)) return 'Cette case est occupée.';
  return null;
}

// Ce que coûte un tracé : lay, erase : listes de cases ; laid : [[x, y, offerte (1/0)]] (les cases déjà tracées) ;
// free : cases encore offertes. { offered, stone (pierres prises), back (pierres rendues) }
export function roadCost(lay, erase, laid, free) {
  const gone = new Set(erase.map(c => `${c.x},${c.y}`));
  const erased = laid.filter(([x, y]) => gone.has(`${x},${y}`));
  const offered = Math.min(lay.length, free + erased.filter(c => c[2]).length);
  return { offered, stone: lay.length - offered, back: erased.filter(c => !c[2]).length };
}

// Deux emprises { x, y, w, h } reliées par un chemin (des cases de chemin qui touchent l'une jusqu'à l'autre) : la
// règle de la quête du premier chemin (serveur : world/paths.js, linked). ground(x, y) : le sol, le tracé compris
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
export function ringOf(f) {
  const out = [];
  for (let x = f.x - 1; x <= f.x + f.w; x++) out.push({ x, y: f.y - 1 }, { x, y: f.y + f.h });
  for (let y = f.y; y < f.y + f.h; y++) out.push({ x: f.x - 1, y }, { x: f.x + f.w, y });
  return out;
}
// Le chemin qui demande le moins de cases nouvelles, case à case (sans diagonale), d'un des départs jusqu'à une case
// but : [{ x, y }] du départ au but (inclus), ou null. cost(x, y) : 0 pour une case où le chemin est déjà (le sentier,
// le tracé en attente), 1 pour une case à tracer, Infinity où rien ne passe ; max : les cases visitées au plus (une
// île de 144 × 144 ne se parcourt pas en entier pour une aide). Parcours « 0-1 » : les cases gratuites d'abord
export function routeTo(starts, isGoal, cost, max = 4000) {
  const dist = new Map();
  const prev = new Map();
  const deque = [];
  for (const s of starts) {
    const c = cost(s.x, s.y);
    const k = `${s.x},${s.y}`;
    if (!Number.isFinite(c) || (dist.has(k) && dist.get(k) <= c)) continue;
    dist.set(k, c);
    prev.set(k, null);
    if (c) deque.push(s);
    else deque.unshift(s);
  }
  const done = new Set();
  for (let seen = 0; deque.length && seen < max; seen++) {
    const c = deque.shift();
    const k = `${c.x},${c.y}`;
    if (done.has(k)) continue;
    done.add(k);
    if (isGoal(c.x, c.y)) {
      const out = [];
      for (let cur = c; cur; cur = prev.get(`${cur.x},${cur.y}`)) out.unshift(cur);
      return out;
    }
    for (const [dx, dy] of DIRS) {
      const n = { x: c.x + dx, y: c.y + dy };
      const nk = `${n.x},${n.y}`;
      const step = cost(n.x, n.y);
      if (done.has(nk) || !Number.isFinite(step)) continue;
      const d = dist.get(k) + step;
      if (dist.has(nk) && dist.get(nk) <= d) continue;
      dist.set(nk, d);
      prev.set(nk, c);
      if (step) deque.push(n);
      else deque.unshift(n);
    }
  }
  return null;
}
// Une case où le chemin est déjà (le sentier, les escaliers) : g, son sol
export const pathGround = isPath;
export function joined(ground, a, b) {
  if (!a || !b) return false;
  const goal = new Set(ringOf(b).filter(c => isPath(ground(c.x, c.y))).map(c => `${c.x},${c.y}`));
  const queue = ringOf(a).filter(c => isPath(ground(c.x, c.y)));
  const seen = new Set(queue.map(c => `${c.x},${c.y}`));
  for (let i = 0; i < queue.length; i++) {
    const c = queue[i];
    if (goal.has(`${c.x},${c.y}`)) return true;
    for (const [dx, dy] of DIRS) {
      const n = { x: c.x + dx, y: c.y + dy };
      const k = `${n.x},${n.y}`;
      if (!seen.has(k) && isPath(ground(n.x, n.y))) {
        seen.add(k);
        queue.push(n);
      }
    }
  }
  return false;
}
