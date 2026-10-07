// Les cultures par étapes (cultures.mjs) : pour le blé, les carottes et les citrouilles, le bêchage, les sillons, le
// semis, les pousses et la croissance (3 images chacune), dans lib/decor/cultures/<culture>/ avec leur index
// (cultures.json : cadres, vitesses, ordre du spectacle, parts du temps d'une culture qui pousse, le champ mûr qui prend
// le relais) ; une planche. Les fichiers sortent des fonctions du générateur des chantiers (generateur_chantiers.mjs) :
// le jeu dessine les mêmes.
import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { CULTURES, PART_CULTURE, MS_CULTURE, etapeDeCulture } from './generateur_chantiers.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'cultures');
const BIB = path.join(DIR, '..', 'bibliotheque', 'svg');
const PNG = path.join(DIR, 'planches');
const { cultures, etapes, cadre, images } = CULTURES;

const NOM = { ble: 'le blé', carottes: 'les carottes', citrouilles: 'les citrouilles' };
const ETAPE = {
  bechage: 'le bêchage (la terre retournée en mottes, la bêche plantée, un ver de terre)',
  sillons: 'les sillons (tracés, le râteau posé au bord)',
  semis: 'le semis (les graines dans les sillons, le sachet, un moineau qui picore)',
  pousses: 'les pousses',
  croissance: 'la croissance (les plants grandissent, encore verts)'
};
const index = { _lisez_moi: [
  'Les cultures par étapes : une parcelle d\'une case qu\'on bêche, où l\'on trace les sillons, qu\'on sème, puis où les plants poussent et grandissent. À la fin, c\'est le champ mûr de l\'annexe (decor/annexes/champ/champ_<culture>, épouvantail compris) qui prend le relais.',
  'Ancre (0, 0) au centre de la case, échelle du jeu × 1,25, le cadre du champ : toutes les étapes et le champ mûr ont le même cadre, les mêmes piquets et les mêmes rangs, on passe de l\'une à l\'autre sans rien déplacer.',
  'Chaque étape : 3 images en boucle (ms_par_image) ; le ruban du piquet flotte, les plants bougent au vent, le ver ondule, le moineau picore.',
  'spectacle : quand on plante, les étapes défilent dans l\'ordre (ms_par_etape chacune), puis le champ mûr paraît.',
  'pousse_qui_dure : part, de 0 à 1, où chaque étape commence ; à 1, le champ est mûr.'
], spectacle: { ordre: etapes, ms_par_etape: MS_CULTURE.spectacle, puis: 'le champ mûr (decor/annexes/champ/champ_<culture>)' }, pousse_qui_dure: { part: PART_CULTURE }, cultures: {} };

const n1 = Array.from({ length: images }, (_, i) => i + 1);
for (const c of cultures) {
  const entree = { nom: `Culture par étapes : ${NOM[c]}`, cadre, mur: `decor/annexes/champ/champ_${c}`, etapes: {} };
  for (const e of etapes) {
    const fichiers = n1.map(n => { const f = `${c}/culture_${c}_${e}_${n}.svg`; write(path.join(LIB, f), etapeDeCulture(c, e, n).svg); return f; });
    entree.etapes[e] = { nom: `${NOM[c][0].toUpperCase()}${NOM[c].slice(1)} : ${ETAPE[e]}`, cadre, ms_par_image: MS_CULTURE.etape, part: PART_CULTURE[e], fichiers };
  }
  index.cultures[c] = entree;
}
write(path.join(LIB, 'cultures.json'), JSON.stringify(index, null, 1));

// ---- la planche : les étapes, puis le champ mûr de l'annexe ----
const grand = (svg, s) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${cadre[2] * s}" height="${cadre[3] * s}"`);
const mur = c => fs.readFileSync(path.join(BIB, 'decor', 'annexes', 'champ', `champ_${c}_1.svg`), 'utf8');
const cells = cultures.map(c => row(`${NOM[c][0].toUpperCase()}${NOM[c].slice(1)}`, [
  ...etapes.map((e, i) => [grand(unique(etapeDeCulture(c, e, 1).svg), 2), `${i + 1}. ${e}`]),
  [grand(unique(mur(c)), 2), 'le champ mûr']
]));
cells.push(row('Une étape en boucle (les citrouilles qui grandissent)', n1.map(n => [grand(unique(etapeDeCulture('citrouilles', 'croissance', n).svg), 2.4), `image ${n}`])));
await shoot([[path.join(PNG, 'cultures.png'), sheet('Les cultures par étapes', 'Le bêchage, les sillons, le semis, les pousses et la croissance, puis le champ mûr de l\'annexe qui prend le relais dans le même cadre. Échelle du jeu × 1,25.', cells), 1300]]);
console.log('cultures :', cultures.length * etapes.length * images, 'images');
