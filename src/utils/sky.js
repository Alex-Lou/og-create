// Ciel du registre : chaque famille découverte forme une constellation, chaque élément une étoile.
// Calcul pur et déterministe : la même collection donne toujours le même ciel.

// Écart entre étoiles voisines (spirale de Vogel : r = STEP·√i) et marge autour d'une constellation
const STEP = 92;
const GOLDEN = 2.39996;
const PAD = 150;
const ROW_GAP = 180;

// Rayon occupé par une constellation de `total` étoiles
export function spreadOf(total) {
  return STEP * Math.sqrt(Math.max(1, total));
}

// Place de la i-ème étoile autour du centre (la première au centre)
export function starOffset(i, rot = 0) {
  if (i === 0) return { x: 0, y: 0 };
  const r = STEP * Math.sqrt(i + 0.3);
  const a = rot + i * GOLDEN;
  return { x: Math.round(r * Math.cos(a)), y: Math.round(r * Math.sin(a)) };
}

// families : [{ key, total, found: [noms, dans l'ordre de découverte] }] ; columns : constellations par rangée
// → { width, height, families: [{ key, cx, cy, spread, total, found }], home: { nom: {x, y} }, sockets: [{ key, x, y }] }
export function layoutSky(families, columns = 3) {
  const cells = families.map((f, index) => {
    const total = Math.max(f.total || 0, f.found.length, 1);
    const spread = spreadOf(total);
    return { ...f, total, spread, size: 2 * (spread + PAD), rot: (index * 0.9) % (2 * Math.PI) };
  });
  const rows = [];
  for (let i = 0; i < cells.length; i += columns) rows.push(cells.slice(i, i + columns));
  const width = Math.max(800, ...rows.map(row => row.reduce((sum, c) => sum + c.size, 0)));
  const home = {};
  const sockets = [];
  const placed = [];
  let y = 0;
  rows.forEach(row => {
    const rowHeight = Math.max(...row.map(c => c.size)) + ROW_GAP;
    let x = (width - row.reduce((sum, c) => sum + c.size, 0)) / 2;
    row.forEach(c => {
      const cx = Math.round(x + c.size / 2);
      // Au-dessus de chaque rangée : la place des noms de constellation
      const cy = Math.round(y + ROW_GAP + (rowHeight - ROW_GAP) / 2);
      for (let i = 0; i < c.total; i++) {
        const o = starOffset(i, c.rot);
        const point = { x: cx + o.x, y: cy + o.y };
        if (i < c.found.length) home[c.found[i]] = point;
        else sockets.push({ key: c.key, ...point });
      }
      placed.push({ key: c.key, cx, cy, spread: c.spread, total: c.total, found: c.found });
      x += c.size;
    });
    y += rowHeight;
  });
  return { width, height: y + ROW_GAP, families: placed, home, sockets };
}

// Nom court d'une famille, pour la vue lointaine (sinon : le premier mot)
const SHORT = {
  'Elements Fondamentaux': 'Éléments',
  'Phénomènes Naturels': 'Phénomènes',
  'Formations Naturelles': 'Formations',
  'Vie et Créatures': 'Créatures',
  'Corps et Esprit': 'Esprit',
  'Créations Humaines': 'Créations'
};
export function shortName(family) {
  return SHORT[family] || String(family).split(' ')[0];
}

// Constellations par rangée : le ciel épouse la forme de l'écran (largeur / hauteur)
export function columnsFor(count, aspect) {
  return Math.max(1, Math.min(6, Math.round(Math.sqrt(count * Math.max(0.3, aspect)))));
}

// Fusion du joueur : l'étoile la plus proche d'un point, dans un rayon donné (null sinon)
export function nearestStar(positions, names, x, y, radius, except = null) {
  let best = null;
  let bestD = radius;
  for (const name of names) {
    if (name === except) continue;
    const p = positions[name];
    if (!p) continue;
    const d = Math.hypot(p.x - x, p.y - y);
    if (d < bestD) {
      best = name;
      bestD = d;
    }
  }
  return best;
}
