// Le verger par étapes (verger.mjs) : pour le pommier, le poirier, le cerisier, le prunier et l'abricotier, le trou, la
// plantation, le jeune arbre, la floraison, les fruits verts et les fruits mûrs (3 images chacune), dans
// lib/decor/verger/<arbre>/ avec leur index (verger.json : cadre, vitesses, ordre du spectacle, parts du temps d'un arbre
// qui pousse) ; une planche. Les fichiers sortent des fonctions du générateur des chantiers (generateur_chantiers.mjs) :
// le jeu dessine les mêmes.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { VERGER, PART_VERGER, MS_VERGER, etapeDuVerger } from './generateur_chantiers.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'verger');
const PNG = path.join(DIR, 'planches');
const { arbres, etapes, cadre, images } = VERGER;

const NOM = { pommier: 'le pommier', poirier: 'le poirier', cerisier: 'le cerisier', prunier: 'le prunier', abricotier: 'l\'abricotier' };
const FRUITS = { pommier: 'les pommes', poirier: 'les poires', cerisier: 'les cerises', prunier: 'les prunes', abricotier: 'les abricots' };
const E = a => (a === 'abricotier' ? 's' : 'es'); // l'accord : les abricots sont mûrs, les pommes mûres
const ETAPE = {
  trou: () => 'le trou (creusé dans l\'herbe, le tas de terre, la bêche)',
  plantation: () => 'la plantation (le scion attaché au tuteur, la cuvette, l\'arrosoir qui goutte)',
  jeune: () => 'le jeune arbre, au tuteur',
  floraison: () => 'la floraison (des pétales tombent, une abeille butine)',
  fruits_verts: a => `${FRUITS[a]} encore vert${E(a)}`,
  mur: a => `${FRUITS[a]} mûr${E(a)} (deux tombé${E(a)} au pied, une abeille)`
};
const majuscule = t => t[0].toUpperCase() + t.slice(1);
const index = { _lisez_moi: [
  'Le verger par étapes : un arbre fruitier sur une case, du trou qu\'on creuse au grand arbre chargé de fruits mûrs. Pommier, poirier, cerisier, prunier, abricotier.',
  'Ancre (0, 0) au centre de la case, à l\'échelle de la troupe (case de 80 × 40), le cadre d\'un décor d\'une case, comme les arbres de la bibliothèque (plantes/) : toutes les étapes ont le même cadre, on passe de l\'une à l\'autre sans rien déplacer.',
  'Chaque étape : 3 images en boucle (ms_par_image) ; la motte roule, l\'arrosoir goutte, le scion bouge, les pétales tombent, l\'abeille butine, les fruits se balancent.',
  'spectacle : quand on plante, les étapes défilent dans l\'ordre (ms_par_etape chacune), jusqu\'à l\'arbre mûr.',
  'pousse_qui_dure : part, de 0 à 1, où chaque étape commence ; à 1, l\'arbre porte ses fruits mûrs (l\'étape mur).'
], spectacle: { ordre: etapes, ms_par_etape: MS_VERGER.spectacle }, pousse_qui_dure: { part: PART_VERGER }, arbres: {} };

const n1 = Array.from({ length: images }, (_, i) => i + 1);
for (const a of arbres) {
  const entree = { nom: `Verger par étapes : ${NOM[a]}`, cadre, etapes: {} };
  for (const e of etapes) {
    const fichiers = n1.map(n => { const f = `${a}/verger_${a}_${e}_${n}.svg`; write(path.join(LIB, f), etapeDuVerger(a, e, n).svg); return f; });
    entree.etapes[e] = { nom: `${majuscule(NOM[a])} : ${ETAPE[e](a)}`, cadre, ms_par_image: MS_VERGER.etape, part: PART_VERGER[e], fichiers };
  }
  index.arbres[a] = entree;
}
write(path.join(LIB, 'verger.json'), JSON.stringify(index, null, 1));

// ---- la planche ----
const grand = (svg, s) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${cadre[2] * s}" height="${cadre[3] * s}"`);
const cells = arbres.map(a => row(majuscule(NOM[a]), etapes.map((e, i) => [grand(unique(etapeDuVerger(a, e, 1).svg), 1.1), `${i + 1}. ${e.replace('_', ' ')}`])));
cells.push(row('Une étape en boucle (le cerisier en fleurs)', n1.map(n => [grand(unique(etapeDuVerger('cerisier', 'floraison', n).svg), 1.3), `image ${n}`])));
await shoot([[path.join(PNG, 'verger.png'), sheet('Le verger par étapes', 'Le trou, la plantation, le jeune arbre, la floraison, les fruits verts, les fruits mûrs : pommier, poirier, cerisier, prunier, abricotier. À l\'échelle de la troupe, le cadre d\'un décor d\'une case.', cells), 1100]]);
console.log('verger :', arbres.length * etapes.length * images, 'images');
