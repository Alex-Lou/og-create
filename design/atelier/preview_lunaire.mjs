// Le jardin lunaire de Mélisse (lunaire.mjs) : pour la mélisse, la lunaire, la fleur de lune et l'herbe des Anciens, une
// étape par phase de la lune, de la nouvelle lune à la pleine lune (3 images chacune), dans lib/decor/lunaire/<plante>/
// avec leur index (lunaire.json : cadre, vitesses, ordre du spectacle, parts du temps d'une plante qui pousse) ; une
// planche. Les fichiers sortent des fonctions du générateur des chantiers (generateur_chantiers.mjs) : le jeu dessine les
// mêmes.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { LUNAIRE, PART_LUNAIRE, MS_LUNAIRE, etapeLunaire } from './generateur_chantiers.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'decor', 'lunaire');
const PNG = path.join(DIR, 'planches');
const { plantes, etapes, cadre, images } = LUNAIRE;

const NOM = { melisse: 'la mélisse', lunaire: 'la lunaire', fleur_de_lune: 'la fleur de lune', herbe_des_anciens: 'l\'herbe des Anciens' };
const ETAPE = {
  nouvelle_lune: 'nouvelle lune, le semis (les graines dans le carré)',
  croissant: 'premier croissant, les pousses',
  quartier: 'premier quartier, la plante grandit',
  gibbeuse: 'lune gibbeuse, les boutons gonflent (la rosée brille)',
  pleine_lune: 'pleine lune, la floraison lumineuse (Lunette vient la voir)'
};
const majuscule = t => t[0].toUpperCase() + t.slice(1);
const index = { _lisez_moi: [
  'Le jardin lunaire de Mélisse : « Chaque chose en sa lune. » Ses plantes poussent au rythme de la lune (HISTOIRE.md, Mélisse) : une étape par phase, de la nouvelle lune (le semis) à la pleine lune (la floraison lumineuse, et Lunette, son papillon de nuit). La pierre de lune, au fond du carré, montre la phase.',
  'La mélisse (l\'herbe qui porte son nom, pour les potions de Cannelle), la lunaire (ses disques d\'argent), la fleur de lune (elle grimpe et s\'ouvre la nuit), l\'herbe des Anciens (la graine étrange de cette île).',
  'Ancre (0, 0) au centre de la case, échelle du jeu × 1,25, le cadre des cultures : toutes les étapes ont le même cadre.',
  'Chaque étape : 3 images en boucle (ms_par_image) ; les plantes bougent, la rosée et les reflets brillent, les fleurs luisent, Lunette vole.',
  'spectacle : quand Mélisse sème, les phases défilent (ms_par_etape chacune), jusqu\'à la pleine lune.',
  'pousse_qui_dure : part, de 0 à 1, où chaque étape commence ; à 1, la pleine lune. Le jeu peut aussi suivre la vraie lune de l\'île.'
], spectacle: { ordre: etapes, ms_par_etape: MS_LUNAIRE.spectacle }, pousse_qui_dure: { part: PART_LUNAIRE }, plantes: {} };

const n1 = Array.from({ length: images }, (_, i) => i + 1);
for (const p of plantes) {
  const entree = { nom: `Jardin lunaire : ${NOM[p]}`, cadre, etapes: {} };
  for (const e of etapes) {
    const fichiers = n1.map(n => { const f = `${p}/lunaire_${p}_${e}_${n}.svg`; write(path.join(LIB, f), etapeLunaire(p, e, n).svg); return f; });
    entree.etapes[e] = { nom: `${majuscule(NOM[p])} : ${ETAPE[e]}`, cadre, ms_par_image: MS_LUNAIRE.etape, part: PART_LUNAIRE[e], fichiers };
  }
  index.plantes[p] = entree;
}
write(path.join(LIB, 'lunaire.json'), JSON.stringify(index, null, 1));

// ---- la planche ----
const grand = (svg, s) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${cadre[2] * s}" height="${cadre[3] * s}"`);
const cells = plantes.map(p => row(majuscule(NOM[p]), etapes.map((e, i) => [grand(unique(etapeLunaire(p, e, 1).svg), 2), `${i + 1}. ${e.replace('_', ' ')}`])));
cells.push(row('La pleine lune en boucle (l\'herbe des Anciens)', n1.map(n => [grand(unique(etapeLunaire('herbe_des_anciens', 'pleine_lune', n).svg), 2.4), `image ${n}`])));
await shoot([[path.join(PNG, 'lunaire.png'), sheet('Le jardin lunaire de Mélisse', '« Chaque chose en sa lune. » Une étape par phase de la lune, de la nouvelle lune (le semis) à la pleine lune (la floraison) ; la pierre de lune montre la phase. Échelle du jeu × 1,25.', cells), 1300]]);
console.log('jardin lunaire :', plantes.length * etapes.length * images, 'images');
