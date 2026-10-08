// Les réserves des bâtiments (reserves.mjs, les récoltes) : pour chaque bâtiment, ce qu'il a produit, vide, à moitié ou
// plein, dans lib/batiments/reserves/<bâtiment>/ avec leur index (reserves.json : cadre, ce que contient chaque réserve,
// la vitesse de l'état plein) ; une planche. Les fichiers sortent des fonctions du générateur des chantiers
// (generateur_chantiers.mjs) : le jeu dessine les mêmes.
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { RESERVES, MS_RESERVE, reserveDuBatiment } from './generateur_chantiers.mjs';

const require = createRequire(import.meta.url);
const DIR = path.dirname(fileURLToPath(import.meta.url));
const { unique, row, sheet, write, shoot } = require('./planche.js');
const LIB = path.join(DIR, 'lib', 'batiments', 'reserves');
const PNG = path.join(DIR, 'planches');
const { batiments, etats, images, cadre } = RESERVES;

const CONTENU = {
  foyer: 'la marmite sur son trépied et le panier de miches (Cannelle)',
  ponton: 'la caisse de poissons (Aster)',
  atelier: 'la caisse de rouages et de pièces de laiton (Rivet)',
  puits: 'les seaux d\'eau (Ondin)',
  bosquet: 'la pile de bûches (Sylve)',
  carriere: 'le tas de pierres taillées sur sa palette (Galet)',
  potager: 'les paniers de légumes (Mélisse)'
};
const ETAT = { vide: 'vide', moitie: 'à moitié', plein: 'pleine (elle brille)' };
const index = { _lisez_moi: [
  'Les réserves des bâtiments (les récoltes) : ce que chaque bâtiment a produit, posé sur une case à côté de lui, vide, à moitié ou plein. Le jeu montre l\'état selon ce qui attend d\'être ramassé (rien, un peu, beaucoup), et rend la réserve vide quand le joueur ramasse.',
  'Ancre (0, 0) au centre de la case, échelle du jeu × 1,25, le cadre des cultures. Vide et à moitié : une image ; pleine : 2 images (ms_par_image), elle brille.',
  'D\'après le métier de chaque maître : le foyer (nourriture), le ponton (poissons), l\'atelier (rouages), le puits (eau), le bosquet (bois), la carrière (pierre), le potager (légumes).'
], reserves: {} };

for (const b of batiments) {
  const entree = { nom: `Réserve du bâtiment : ${CONTENU[b]}`, cadre, etats: {} };
  for (const e of etats) {
    const fichiers = Array.from({ length: images[e] }, (_, i) => {
      const f = `${b}/reserve_${b}_${e}${images[e] > 1 ? `_${i + 1}` : ''}.svg`;
      write(path.join(LIB, f), reserveDuBatiment(b, e, i + 1).svg);
      return f;
    });
    entree.etats[e] = { nom: `Réserve ${ETAT[e]} : ${CONTENU[b]}`, cadre, ...(images[e] > 1 ? { ms_par_image: MS_RESERVE } : {}), fichiers };
  }
  index.reserves[b] = entree;
}
write(path.join(LIB, 'reserves.json'), JSON.stringify(index, null, 1));

// ---- la planche ----
const grand = (svg, s) => svg.replace(/width="[^"]+" height="[^"]+"/, `width="${cadre[2] * s}" height="${cadre[3] * s}"`);
const cells = batiments.map(b => row(CONTENU[b].replace(/ \(.*$/, '').replace(/^./, c => c.toUpperCase()), etats.map(e => [grand(unique(reserveDuBatiment(b, e, 1).svg), 2), ETAT[e]])));
await shoot([[path.join(PNG, 'batiments_reserves.png'), sheet('Les réserves des bâtiments', 'Ce que chaque bâtiment a produit, posé à côté de lui : vide, à moitié, pleine (elle brille). Échelle du jeu × 1,25.', cells), 1000]]);
console.log('réserves :', batiments.length * etats.reduce((t, e) => t + images[e], 0), 'images');
