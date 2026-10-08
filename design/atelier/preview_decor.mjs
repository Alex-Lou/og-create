// Lot D — le décor iso : créations d'île, lieux remarquables, gisements, annexes, enseignes, îlots et objets de la mer.
// SVG dans lib/decor/<catégorie>/, index decor.json (cadres, ancres, images/s, lumières, cadre du nom des enseignes),
// une planche PNG par catégorie, page animée decor_apercu.html. Les annexes sont les dessins du jeu, portés au trait
// de la troupe (port/src/world, aides restylées) ; le reste est dessiné ici (crafts.js, landmarks.js, decor2.js).
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { inventaire } from './decor_liste.mjs';
import { decor } from './generateur_decor.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const { SIGN_TEXT } = require('./decor2.js');

const LIB = path.join(DIR, 'lib', 'decor');
const PNG = path.join(DIR, 'planches');
const r2 = n => Math.round(n * 100) / 100;
const CELL = '<polygon points="0,-20 40,0 0,20 -40,0" fill="#BFD99A" stroke="#A8C680" stroke-width="0.6"/>';
const svgOf = (frame, body, scale = 1, cell = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * scale)}" height="${r2(frame[3] * scale)}" viewBox="${frame.map(r2).join(' ')}">${cell ? CELL : ''}${body}</svg>`;

/* ---------- Inventaire : decor_liste.mjs (une seule source pour la bibliothèque et le générateur) ---------- */
const items = inventaire();

/* ---------- Écriture ---------- */
const index = {};
let count = 0;
for (const it of items) {
  const files = it.frames.map((body, k) => {
    const name = it.frames.length > 1 ? `${it.base}_${k + 1}.svg` : `${it.base}.svg`;
    write(path.join(LIB, it.dir, name), decor(it.cat, it.base, k + 1).svg); // le jeu dessine le même
    count++;
    return `${it.dir}/${name}`;
  });
  (index[it.cat] = index[it.cat] || {})[it.base] = { nom: it.label, fichiers: files, cadre: it.frame.map(r2), ...(it.frames.length > 1 && it.ms ? { ms_par_image: it.ms } : {}), ...it.meta };
}
write(path.join(LIB, 'decor.json'), JSON.stringify({
  _lisez_moi: 'Cadres en pixels (x, y, largeur, hauteur) autour de l\'ancre (0, 0) : centre de la case (créations, lieux, gisements, annexes, ponton, pont, panneau), pied (enseignes), ligne de flottaison (bateaux), point d\'échouage (bouteille). Tout est à l\'échelle du jeu × 1,25 (case de 80 × 40). Annexes : ips = images par seconde du jeu. Enseignes : cadre_du_nom = où écrire le nom (centre x, y ; largeur, hauteur max ; corps de police), déjà × 1,25.',
  ...index
}, null, 1));

/* ---------- Planches et page animée ---------- */
const TITLES = { creations: 'Créations d\'île', lieux: 'Lieux remarquables', gisements: 'Gisements des climats', annexes: 'Annexes des bâtiments', enseignes: 'Enseignes au nom du joueur', ilots: 'Îlots, bateaux et objets de la mer' };
const SUBS = {
  creations: 'Une case, ancre au centre (losange montré), cadre PROP_BOX × 1,25.',
  lieux: 'Une case, ancre au centre ; un lieu déborde comme un monument. Le jeu les affiche × 1,35 (la cascade × 1).',
  gisements: 'Prêt (2 images), ramassé, puis deux étapes de repousse (2 images chacune) jusqu\'à prêt. Cadres du jeu × 1,25, ancre au centre de la case.',
  annexes: 'Dessins du jeu au trait de la troupe, toutes leurs images (page animée) ; ici la première image de chaque variante. Cadres du jeu × 1,25.',
  enseignes: 'Le nom n\'est pas dessiné : le jeu l\'écrit dans le cadre pointillé (decor.json). Ancre au pied de l\'enseigne.',
  ilots: 'Ponton et voilier dans le cadre d\'un bâtiment, bateaux ancrés à la ligne de flottaison et tournés vers la droite (miroir pour la gauche). Pont : une case, dans les deux sens.'
};
const shots = [], anim = [];
for (const cat of Object.keys(TITLES)) {
  const list = items.filter(i => i.cat === cat);
  const cells = [];
  const all = cat === 'gisements' || cat === 'enseignes' || cat === 'ilots';
  for (const it of list) {
    const view = it.view || it.frame;
    const s = Math.min(cat === 'annexes' ? 1.5 : 1.6, 190 / Math.max(view[2], view[3]));
    const txt = cat === 'enseignes' ? (() => { const t = SIGN_TEXT[it.base]; return `<rect x="${r2(t.x - t.w / 2)}" y="${r2(t.y - t.h / 2)}" width="${t.w}" height="${t.h}" fill="none" stroke="#E2483A" stroke-width="0.5" stroke-dasharray="1.5 1"/>`; })() : '';
    const frames = all ? it.frames : it.frames.slice(0, 1);
    frames.forEach((body, k) => cells.push([svgOf(view, unique(body) + (k ? '' : txt), s, it.cell),
      `${it.label}${all && it.frames.length > 1 ? ` · ${k + 1}` : ''}${!all && it.frames.length > 1 ? `<br><i>${it.frames.length} images</i>` : ''}`]));
  }
  const rows = [row('', cells)];
  shots.push([path.join(PNG, `decor_${cat}.png`), sheet(`Décor — ${TITLES[cat]}`, SUBS[cat], rows), 1250]);
  const boxes = list.filter(it => it.frames.length > 1).map(it => {
    const view = it.view || it.frame;
    const s = Math.min(1.6, 190 / Math.max(view[2], view[3]));
    return { label: it.label, frames: it.frames.map(body => svgOf(view, unique(body), s, it.cell)), timings: [it.ms || 400], w: r2(view[2] * s), h: r2(view[3] * s) };
  });
  if (boxes.length) anim.push([TITLES[cat], boxes]);
}
write(path.join(DIR, 'decor_apercu.html'), animated('Le décor en mouvement', 'Lot D : créations, lieux, gisements, annexes (vitesse du jeu), enseignes et bateaux.', anim));
await shoot(shots);
console.log('ok', count, 'SVG ;', items.length, 'dessins');
