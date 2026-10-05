// Créations d'île (lot 8) : comment les montrer et les assembler. Le catalogue, les paliers, les règles de pose et la
// découpe des pièces viennent du serveur (services/crafts.js) ; seul le quart de tour (turn) est recopié ici, à
// l'identique, pour que la disposition envoyée se lise de la même façon des deux côtés.

export const TIER_LABEL = { start: 'Débuts', I: 'Palier I', II: 'Palier II', III: 'Palier III', climat: 'Climats' };
// Ce qui ouvre un palier (en clair). Palier I : des découvertes du Grimoire (stars, bible D7) ou l'Épreuve ; un
// serveur d'avant le lot H1 n'envoie pas stars (le chapitre I fini ouvrait alors le palier)
const count = ({ have, need }) => `${Math.min(have, need)}/${need}`;
export function tierHint(tier, epreuves, stars = null) {
  if (tier === 'I' && stars) return `Inscris ${stars.need} découvertes au Grimoire (${count(stars)}), ou réussis ${epreuves.need} questions de l’Épreuve (${count(epreuves)}).`;
  if (tier === 'I') return `Finis le chapitre I du Grimoire, ou réussis ${epreuves.need} questions de l’Épreuve (${count(epreuves)}).`;
  return `Finis le chapitre ${tier} du Grimoire.`;
}

// Cases d'un gabarit, dans l'ordre de lecture : [[x, y]]
export const cellsOf = shape => shape.flatMap((row, y) => [...row].map((c, x) => (c === 'x' ? [x, y] : null)).filter(Boolean));

// Pièce ramenée à son coin haut-gauche, cases triées (ligne puis colonne)
export function normal(cells) {
  const mx = Math.min(...cells.map(c => c[0]));
  const my = Math.min(...cells.map(c => c[1]));
  return cells.map(([x, y]) => [x - mx, y - my]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
// Quart de tour (sens horaire), k fois
export function turn(cells, k = 0) {
  let out = cells;
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) out = out.map(([x, y]) => [-y, x]);
  return normal(out);
}
// Largeur et hauteur d'une pièce normalisée
export const sizeOf = cells => ({ w: Math.max(...cells.map(c => c[0])) + 1, h: Math.max(...cells.map(c => c[1])) + 1 });

// Cases du gabarit couvertes par une pièce posée ({ piece, rot, x, y }) : clés « x,y »
export const coverOf = (pieces, step) => turn(pieces[step.piece], step.rot).map(([cx, cy]) => `${cx + step.x},${cy + step.y}`);

// La pièce tient-elle là : dans le gabarit, sans chevaucher les autres pièces posées (layout, sauf elle-même)
export function fits(shape, pieces, layout, step) {
  const goal = new Set(cellsOf(shape).map(([x, y]) => `${x},${y}`));
  const taken = new Set(layout.filter(s => s.piece !== step.piece).flatMap(s => coverOf(pieces, s)));
  return coverOf(pieces, step).every(k => goal.has(k) && !taken.has(k));
}

// Le gabarit est-il exactement rempli (toutes les pièces posées, sans trou) : le bouton « Assembler » s'allume
export function covered(shape, pieces, layout) {
  if (layout.length !== pieces.length) return false;
  const filled = new Set(layout.flatMap(s => coverOf(pieces, s)));
  return filled.size === cellsOf(shape).length;
}
