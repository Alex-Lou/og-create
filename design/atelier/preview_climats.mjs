// Une culture par climat (cultures_climat.mjs) : les myrtilles des cimes, le sarrasin des landes, le riz du marais, les
// pastèques des dunes, les ananas de la jungle, les piments du volcan ; la préparation du terrain, la plantation, les
// pousses, la croissance, la culture mûre (3 images chacune), dans lib/decor/climats/<climat>/ avec leur index
// (climats.json : cadre, vitesses, ordre du spectacle, parts du temps d'une culture qui pousse) ; une planche. Les fichiers
// sortent des fonctions du générateur des chantiers (generateur_chantiers.mjs) : le jeu dessine les mêmes.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { CLIMATS, PART_CLIMAT, MS_CLIMAT, etapeDeClimat } from './generateur_chantiers.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'climats');
const PNG = path.join(DIR, 'planches');
const { climats, culture, etapes, cadre, images } = CLIMATS;

const NOM = {
  cimes: ['les myrtilles des cimes', 'la terrasse de pierres sèches, la terre caillouteuse', 'les baies bleues'],
  landes: ['le sarrasin des landes', 'la tourbe sombre, la bruyère au bord', 'les graines brunes'],
  marais: ['le riz du marais', 'la rizière inondée, la diguette', 'les épis dorés qui s\'inclinent'],
  dunes: ['les pastèques des dunes', 'le sable, la ganivelle contre le vent', 'les grosses pastèques rayées'],
  jungle: ['les ananas de la jungle', 'la terre rouge, les grandes feuilles au bord', 'les ananas dorés'],
  volcan: ['les piments du volcan', 'la cendre noire, les pierres de lave, une fumerolle', 'les piments rouges']
};
const ETAPE = {
  preparation: c => `la préparation (${NOM[c][1]})`,
  plantation: () => 'la plantation',
  pousses: () => 'les pousses',
  croissance: () => 'la croissance',
  mur: c => `mûre (${NOM[c][2]})`
};
const majuscule = t => t[0].toUpperCase() + t.slice(1);
const index = { _lisez_moi: [
  'Une culture par climat, par étapes : sur une case, chaque climat a sa culture, son sol et son aménagement. Les cimes : des myrtilles sur une terrasse de pierres sèches ; les landes : du sarrasin dans la tourbe ; le marais : du riz dans sa rizière ; les dunes : des pastèques derrière la ganivelle ; la jungle : des ananas dans la terre rouge ; le volcan : des piments dans la cendre noire.',
  'Ancre (0, 0) au centre de la case, échelle du jeu × 1,25, le cadre des cultures : toutes les étapes ont le même cadre.',
  'Chaque étape : 3 images en boucle (ms_par_image) ; les plants bougent au vent, l\'eau de la rizière miroite, la bruyère et les feuilles de la jungle remuent, la fumerolle monte.',
  'spectacle : les étapes défilent dans l\'ordre (ms_par_etape chacune), jusqu\'à la culture mûre.',
  'pousse_qui_dure : part, de 0 à 1, où chaque étape commence ; à 1, la culture est mûre.'
], spectacle: { ordre: etapes, ms_par_etape: MS_CLIMAT.spectacle }, pousse_qui_dure: { part: PART_CLIMAT }, climats: {} };

const n1 = Array.from({ length: images }, (_, i) => i + 1);
for (const c of climats) {
  const entree = { nom: `Culture du climat : ${NOM[c][0]}`, culture: culture[c], cadre, etapes: {} };
  for (const e of etapes) {
    const fichiers = n1.map(n => { const f = `${c}/climat_${c}_${e}_${n}.svg`; write(path.join(LIB, f), etapeDeClimat(c, e, n).svg); return f; });
    entree.etapes[e] = { nom: `${majuscule(NOM[c][0])} : ${ETAPE[e](c)}`, cadre, ms_par_image: MS_CLIMAT.etape, part: PART_CLIMAT[e], fichiers };
  }
  index.climats[c] = entree;
}
write(path.join(LIB, 'climats.json'), JSON.stringify(index, null, 1));

// ---- la planche ----
const grand = (svg, s) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${cadre[2] * s}" height="${cadre[3] * s}"`);
const cells = climats.map(c => row(majuscule(NOM[c][0]), etapes.map((e, i) => [grand(unique(etapeDeClimat(c, e, 1).svg), 2), `${i + 1}. ${e}`])));
cells.push(row('Une étape en boucle (la rizière qui miroite)', n1.map(n => [grand(unique(etapeDeClimat('marais', 'croissance', n).svg), 2.4), `image ${n}`])));
await shoot([[path.join(PNG, 'climats_cultures.png'), sheet('Une culture par climat', 'Les myrtilles des cimes, le sarrasin des landes, le riz du marais, les pastèques des dunes, les ananas de la jungle, les piments du volcan : de la préparation du terrain à la culture mûre. Échelle du jeu × 1,25.', cells), 1300]]);
console.log('cultures des climats :', climats.length * etapes.length * images, 'images');
