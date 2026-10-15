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
  T: 'tutoriel — la première veillée : Pierrot voit le phare éteint, la caméra va jusqu\'à lui ; il reste en vue (ecriture/arc_phare.md)',
  III: 'acte III — Mélisse trouve les premières ruines, Galet lit leurs runes (« Nous aussi, nous étions des naufragés »)',
  VI: 'acte VI — l\'Îlot aux Mouettes et le phare éteint ; la baguette d\'Ondin trouve la clé du phare parmi les ruines'
};
const MS = { pierre_runes: 1200, cle_du_phare: 600, phare_eteint: 700, phare_des_anciens: 380, phare_des_anciens_vide: 380, phare_des_anciens_hiver: 380, phare_des_anciens_vide_hiver: 380, phare_des_anciens_mouille: 380, phare_des_anciens_vide_mouille: 380, phare_des_anciens_reflet: 380, phare_des_anciens_vide_reflet: 380 };
// L'ombre portée du phare : celle de l'île (lumiere/ombres.js, drawShadows : un socle hw × hh en cases, prolongé de la
// hauteur h, en pixels du jeu, dans le sens de la lumière du soleil, de la lune ou de l'éclair) ; ses mesures, pour le jeu
const OMBRE = { hw: 0.7, hh: 0.7, h: 424 };
const AVEC_OMBRE = /^phare_des_anciens(_vide)?(_hiver|_mouille)?$/;
const NOTE = {
  phare_des_anciens: 'sur l\'Îlot aux Mouettes, éteint jusqu\'à l\'acte VII (la lentille des Anciens est là, froide) ; 8 images en boucle : les mouettes, l\'écume, un reflet de lune qui glisse sur la lanterne. Ancre au centre de l\'îlot (3 × 3 cases). La brume est celle de l\'île, pas dessinée ici',
  phare_des_anciens_vide: 'après l\'acte VI (Jovin a emporté la lentille) : la lanterne vide, deux vitres brisées ; mêmes images, même ancre',
  phare_des_anciens_hiver: 'l\'hiver (à la place de phare_des_anciens, comme les paliers d\'hiver des bâtiments) : neige sur le dôme, la galerie, les bandeaux, les appuis, le socle et les rochers ; glaçons sous la galerie ; mêmes images, même ancre',
  phare_des_anciens_vide_hiver: 'l\'hiver, sans la lentille (après l\'acte VI) ; mêmes images, même ancre',
  phare_des_anciens_mouille: 'sous l\'averse et tant que l\'île est mouillée (lumiere/averse.js : wetnessAt) : pierre et rochers plus sombres, l\'eau qui ruisselle et goutte de la galerie, des flaques ; mêmes images, même ancre',
  phare_des_anciens_vide_mouille: 'sous l\'averse, sans la lentille (après l\'acte VI) ; mêmes images, même ancre',
  phare_des_anciens_reflet: 'le reflet du phare dans la mer (éteint) : un calque à part, à poser sur la mer, sous l\'îlot, découpé à l\'eau ; même ancre que le phare ; 8 images au pas du phare (son éclat de lune y tremble)',
  phare_des_anciens_vide_reflet: 'le reflet du phare sans sa lentille (après l\'acte VI) ; comme phare_des_anciens_reflet',
  pierre_runes: 'image 1 : le jour (runes gravées) ; image 2 : à la nuit tombée (elles luisent) — à alterner selon l\'heure plutôt qu\'en boucle',
  cle_du_phare: '« J\'ai laissé la clé du phare sous une pierre » (bouteille d\'Héliane) ; image 2 : la clé brille',
  phare_eteint: 'éteint jusqu\'à l\'acte VII : le Phare de Brume (Foyer VII, lib/batiments/) prend sa place ; les mouettes volent (2 images)',
  fanal_des_anciens: 'un fanal de la Route des feux : froid tant qu\'il n\'est pas rallumé, vif ensuite ; sans flamme (le jeu la dessine au-dessus de la vasque, pour qu\'elle penche avec le vent). Ancre au pied ; le centre de la vasque en (0, -36), à peu près 28 de large'
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
  // (des états plutôt qu'une boucle : les fichiers portent le nom de leur état, et pas de ms)
  const files = bodies.map((b, n) => { const rel = a.names ? `${key}_${a.names[n]}.svg` : `${key}_${n + 1}.svg`; write(path.join(LIB, rel), svgOf(frame, b)); count++; return rel; });
  index.objets[key] = { nom: a.label, etape: a.step, cadre: frame, images: a.n, ...(a.n > 1 && !a.etats ? { ms: MS[key] || 500 } : {}), ...(a.etats ? { etats: a.etats } : {}), ...(NOTE[key] ? { note: NOTE[key] } : {}), ...(AVEC_OMBRE.test(key) ? { ombre: OMBRE } : {}), fichiers: files };
  const s = a.frame === RUINES.pierre_runes.frame ? 1.6 : 1.1;
  for (const [n, b] of bodies.entries()) cells.push([svgOf(frame, unique(b), s), `${a.label}${a.n > 1 ? ` (${n + 1})` : ''} · ${a.step}`]);
  if (a.n > 1 && !a.etats) anim.push({ label: a.label, frames: bodies.map(b => svgOf(frame, unique(b), s * 1.3)), timings: [MS[key] || 500], w: r2(frame[2] * s * 1.3), h: r2(frame[3] * s * 1.3) });
}

write(path.join(LIB, 'ruines.json'), JSON.stringify(index, null, 1));
write(path.join(DIR, 'ruines_apercu.html'), animated('Les ruines des Anciens', 'Lot G4 : la pierre à runes (jour, nuit), la clé qui brille, les mouettes du phare éteint.', [['Les ruines', anim]]));
await shoot([[path.join(PNG, 'ruines_anciens.png'), sheet('Les ruines des Anciens', 'Iso du jeu × 1,25, ancre au centre de l\'emprise. Le Cercle de menhirs est déjà dans les lieux remarquables.', [row('', cells)]), 1500]]);
await closeFit();
console.log('ok', count, 'SVG');
