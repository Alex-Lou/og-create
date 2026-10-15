// Créations d'île (lot 8) : comment les montrer et les assembler. Le catalogue, les paliers, les règles de pose et la
// découpe des pièces viennent du serveur (services/crafts.js) ; seul le quart de tour (turn) est recopié ici, à
// l'identique, pour que la disposition envoyée se lise de la même façon des deux côtés.

import { TIER_HINT, KNOW_TEXT } from '@/texts/world/crafts';

export const TIER_LABEL = { start: 'Débuts', I: 'Palier I', II: 'Palier II', III: 'Palier III', climat: 'Climats' };
// Plusieurs pièces d'un coup (choix de l'auteur, 15 oct. : un seul casse-tête ; serveur : crafts.js, BATCH_MAX) : les
// quantités proposées, et le plus grand assemblage
export const BATCH_MAX = 20;
export const BATCHES = [1, 3, 5];
// Combien de pièces le stock paie (c : une création du catalogue ; stock : ressources et trouvailles), BATCH_MAX au plus
export function batchRoom(c, stock) {
  const each = [...Object.entries(c.cost || {}), ...Object.entries(c.finds || {})].map(([k, n]) => Math.floor((stock[k] || 0) / n));
  return Math.min(BATCH_MAX, ...each);
}
// Les quantités à proposer (need : ce que demande la tâche en cours, ou 0), dans l'ordre
export const batchChoices = need => [...new Set([...BATCHES, ...(need > 1 ? [Math.min(need, BATCH_MAX)] : [])])].sort((a, b) => a - b);
// Ce que coûtent count pièces
export const timesBag = (bag, count) => (bag ? Object.fromEntries(Object.entries(bag).map(([k, n]) => [k, n * count])) : bag);
// Ce qui ouvre un palier (en clair). Palier I : des découvertes du Grimoire (stars, bible D7) ou l'Épreuve ; un
// serveur d'avant le lot H1 n'envoie pas stars (le chapitre I fini ouvrait alors le palier). Paliers II et III, en
// cascade (choix de l'auteur, 12 oct.) : ce que dit le serveur (locks : le palier d'avant, ou les découvertes qui
// manquent à leur chapitre)
const count = ({ have, need }) => `${Math.min(have, need)}/${need}`;
export function tierHint(tier, epreuves, stars = null, locks = null) {
  if (tier === 'I' && stars) return TIER_HINT.stars(stars.need, count(stars), epreuves.need, count(epreuves));
  if (tier === 'I') return TIER_HINT.first(epreuves.need, count(epreuves));
  if (locks && locks[tier]) return locks[tier];
  return TIER_HINT.chapter(tier);
}

// Les savoir-faire qui manquent à une création ouverte, quand ce sont eux qui la retiennent (celles d'avant sont
// faites : serveur, crafts.blockOf), avec leurs pages jusqu'au Grimoire : [{ name, pages }]
export function missingKnow(c, catalog) {
  if (!c.open || c.tutorial) return [];
  const made = id => (catalog.find(other => other.id === id) || {}).made;
  if (!c.after.every(made)) return [];
  return c.elements.filter(e => !e.have);
}
// « Lumière : à écrire au Grimoire · 3 pages »
export const knowText = e => KNOW_TEXT(e.name, e.pages);

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

// Une disposition qui remplit exactement le gabarit ([{ piece, rot, x, y }]), ou null : la première case vide (dans
// l'ordre de lecture) est forcément la première case d'une pièce ; on essaie chaque pièce restante, chaque quart de tour
// (au tutoriel, la main montre ainsi chaque pièce et sa case : CraftPuzzle, guided)
export function solve(shape, pieces, layout = []) {
  const filled = new Set(layout.flatMap(s => coverOf(pieces, s)));
  const hole = cellsOf(shape).find(([x, y]) => !filled.has(`${x},${y}`));
  if (!hole) return layout.length === pieces.length ? layout : null;
  for (let piece = 0; piece < pieces.length; piece++) {
    if (layout.some(s => s.piece === piece)) continue;
    for (let rot = 0; rot < 4; rot++) {
      const [fx, fy] = turn(pieces[piece], rot)[0];
      const step = { piece, rot, x: hole[0] - fx, y: hole[1] - fy };
      if (!fits(shape, pieces, layout, step)) continue;
      const done = solve(shape, pieces, [...layout, step]);
      if (done) return done;
    }
  }
  return null;
}

// Quart de tour (sens horaire), k fois, en gardant l'ordre des cases (turn les trie) : la case j reste la case j, pour
// qu'elle garde son morceau du dessin quand la pièce tourne
export function turnKeep(cells, k = 0) {
  let out = cells;
  for (let i = 0; i < ((k % 4) + 4) % 4; i++) out = out.map(([x, y]) => [-y, x]);
  const mx = Math.min(...out.map(c => c[0]));
  const my = Math.min(...out.map(c => c[1]));
  return out.map(([x, y]) => [x - mx, y - my]);
}

// Où se pose le dessin d'une création sur son gabarit de w × h cases : son corps (body : { x, y, w, h, ratio }, en part
// de l'image, world/artBody.js) le plus grand possible et centré, le reste (le halo d'une flamme, une ombre douce)
// débordant autour ; sans corps mesuré, tout le gabarit (le dessin s'y loge entier : object-fit contain).
// { x, y, w, h } du dessin entier, en cases
export function artFit(body, w, h) {
  if (!body) return { x: 0, y: 0, w, h };
  const iw = Math.min(w / body.w, (h * body.ratio) / body.h);
  const ih = iw / body.ratio;
  return { x: w / 2 - (body.x + body.w / 2) * iw, y: h / 2 - (body.y + body.h / 2) * ih, w: iw, h: ih };
}
// Le même, en style d'une <img> posée en absolu dans un cadre de w × h px (pad : sa marge intérieure, px)
export function artFitStyle(body, w, h, pad = 0) {
  const fit = artFit(body, w - 2 * pad, h - 2 * pad);
  return { left: `${pad + fit.x}px`, top: `${pad + fit.y}px`, width: `${fit.w}px`, height: `${fit.h}px` };
}

// La place de chaque pièce dans une solution du gabarit (CraftPuzzle : chaque case porte le morceau du dessin de la
// création qui est sous elle, là) : [{ rot, cells: [[x, y]] }] (cells dans l'ordre des cases de la pièce), ou null
export function homesOf(shape, pieces) {
  const plan = solve(shape, pieces);
  if (!plan) return null;
  return pieces.map((cells, i) => {
    const { rot, x, y } = plan.find(s => s.piece === i);
    return { rot, cells: turnKeep(cells, rot).map(([cx, cy]) => [cx + x, cy + y]) };
  });
}

// Cases où déplacer une création posée (from) : ses cases dorées, sauf la sienne, à portée de chacune des créations
// qui comptent sur elle (keeps : [{ x, y, reach }], donné par le serveur ; règle « près de »)
export function moveSpots(spots, from, keeps = []) {
  return spots.filter(sp => (sp.x !== from.x || sp.y !== from.y) && keeps.every(k => Math.max(Math.abs(sp.x - k.x), Math.abs(sp.y - k.y)) <= k.reach));
}

// L'aimant d'un trait (choix de l'auteur, 15 oct.) : le doigt qui s'écarte d'une case de la ligne (le long d'un axe de la
// grille) la garde droite ; deux cases, et la ligne tourne, depuis là où elle en est. line : le trait en cours ({ from
// (le début de sa ligne droite), last (sa dernière case), axis ('x', 'y' ou null) }, modifié) ; tile : la case sous le
// doigt ; ok(cell) : une case où le trait peut aller (la case droite refusée et celle du doigt permise : la ligne lâche,
// pour contourner un arbre). La case où va le trait
export const MAGNET = 1;
export function straighten(line, tile, ok = () => true) {
  const off = () => (line.axis === 'x' ? Math.abs(tile.y - line.from.y) : Math.abs(tile.x - line.from.x));
  const snap = () => (line.axis === 'x' ? { x: tile.x, y: line.from.y } : { x: line.from.x, y: tile.y });
  if (line.axis && off() > MAGNET) {
    line.from = line.last;
    line.axis = null;
  }
  if (!line.axis) {
    const dx = tile.x - line.from.x;
    const dy = tile.y - line.from.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 2) return tile;
    line.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    if (off() > MAGNET) return tile;
  }
  const straight = snap();
  if (ok(straight) || !ok(tile)) return straight;
  line.from = tile;
  line.axis = null;
  return tile;
}
