// Lot G4 — ce qui reste des Anciens, en iso : maison en ruine, colonnade, pierre à runes (jour et nuit), colonne
// brisée, la clé du phare sous sa pierre et le phare éteint de l'Îlot aux Mouettes. Dessins de ruines.mjs, cadres du
// jeu × 1,25 élargis juste ce qu'il faut (fitFrame). SVG dans lib/decor/ruines/, index ruines.json, planche, page.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { RUINES } from './ruines.mjs';
import { fitFrame, closeFit } from './fit.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, animated, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'ruines');
const PNG = path.join(DIR, 'planches');
const K = 1.25;
const r2 = n => Math.round(n * 100) / 100;
const big = ({ x, y, w, h }) => [x, y, w, h].map(n => r2(n * K));
const up = body => `<g transform="scale(${K})">${body}</g>`;
const svgOf = (frame, body, scale = 1) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(frame[2] * scale)}" height="${r2(frame[3] * scale)}" viewBox="${frame.join(' ')}">${body}</svg>`;

const STEPS = {
  III: 'acte III — Mélisse trouve les premières ruines, Galet lit leurs runes (« Nous aussi, nous étions des naufragés »)',
  VI: 'acte VI — l\'Îlot aux Mouettes et le phare éteint ; la baguette d\'Ondin trouve la clé du phare parmi les ruines'
};
const MS = { pierre_runes: 1200, cle_du_phare: 600, phare_eteint: 700 };
const NOTE = {
  pierre_runes: 'image 1 : le jour (runes gravées) ; image 2 : à la nuit tombée (elles luisent) — à alterner selon l\'heure plutôt qu\'en boucle',
  cle_du_phare: '« J\'ai laissé la clé du phare sous une pierre » (bouteille d\'Héliane) ; image 2 : la clé brille',
  phare_eteint: 'éteint jusqu\'à l\'acte VII : le Phare de Brume (Foyer VII, lib/batiments/) prend sa place ; les mouettes volent (2 images)'
};

const index = {
  _lisez_moi: [
    'Ce qui reste des Anciens, en iso au trait de la troupe, à l\'échelle du jeu × 1,25 (case de 80 × 40). Ancre (0, 0) au centre de l\'emprise : ruines sur 2 × 2 cases (BUILDING_BOX), petits objets sur une case (PROP_BOX), phare sur son îlot (cadre propre). Quand un dessin dépasse un peu, le cadre est élargi, l\'ancre ne bouge pas : prendre le cadre noté ici.',
    'Le Cercle de menhirs existe déjà (lib/decor/lieux/menhirs_*). Les runes reprennent sa spirale et sa lueur turquoise.',
    'etape : quand l\'objet apparaît (proposition tirée de HISTOIRE.md).'
  ],
  etapes: STEPS,
  objets: {}
};
const cells = [];
const anim = [];
let count = 0;

for (const [key, a] of Object.entries(RUINES)) {
  const bodies = Array.from({ length: a.n }, (_, n) => up(a.draw(n)));
  const frame = await fitFrame(big(a.frame), bodies);
  const files = bodies.map((b, n) => { const rel = `${key}_${n + 1}.svg`; write(path.join(LIB, rel), svgOf(frame, b)); count++; return rel; });
  index.objets[key] = { nom: a.label, etape: a.step, cadre: frame, images: a.n, ...(a.n > 1 ? { ms: MS[key] || 500 } : {}), ...(NOTE[key] ? { note: NOTE[key] } : {}), fichiers: files };
  const s = a.frame === RUINES.pierre_runes.frame ? 1.6 : 1.1;
  for (const [n, b] of bodies.entries()) cells.push([svgOf(frame, unique(b), s), `${a.label}${a.n > 1 ? ` (${n + 1})` : ''} · ${a.step}`]);
  if (a.n > 1) anim.push({ label: a.label, frames: bodies.map(b => svgOf(frame, unique(b), s * 1.3)), timings: [MS[key] || 500], w: r2(frame[2] * s * 1.3), h: r2(frame[3] * s * 1.3) });
}

write(path.join(LIB, 'ruines.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'ruines_apercu.html'), animated('Les ruines des Anciens', 'Lot G4 : la pierre à runes (jour, nuit), la clé qui brille, les mouettes du phare éteint.', [['Les ruines', anim]]));
await shoot([[path.join(PNG, 'ruines_anciens.png'), sheet('Les ruines des Anciens', 'Iso du jeu × 1,25, ancre au centre de l\'emprise. Le Cercle de menhirs est déjà dans les lieux remarquables.', [row('', cells)]), 1500]]);
await closeFit();
console.log('ok', count, 'SVG');
