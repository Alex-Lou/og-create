// Le générateur des chemins de l'île, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM,
// publié dans la bibliothèque (generateur/chemins.mjs). chemin(id) rend { svg, cadre, ms_par_image } : le SVG complet,
// identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le
// vérifie). cheminDeMasque, paveDeMasque, etapeDeMasque donnent l'id du raccord (NE 1, SE 2, SO 4, NO 8). preview_chemins.mjs écrit la
// bibliothèque avec ces mêmes fonctions.
import C from './chemins.js';

export const HD = 4;
export const PIECES = C.PIECES.map(({ id, nom, cadre, suite, ms, masque }) => ({ id, nom, cadre, suite, ms, masque }));
const svgOf = (c, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${c[2] * HD}" height="${c[3] * HD}" viewBox="${c.join(' ')}">${body}</svg>`;

// Une pièce des chemins : id (le nom du fichier, sans .svg)
export function chemin(id) {
  const p = C.PIECES.find(x => x.id === id);
  if (!p) throw new Error(`pièce inconnue des chemins : ${id}`);
  return { svg: svgOf(p.cadre, p.dessin()), cadre: p.cadre, ms_par_image: p.ms };
}
// Le raccord d'une case selon ses voisines en chemin (masque NE 1, SE 2, SO 4, NO 8) : le chemin de terre (variante 0
// ou 1), le chemin pavé, une étape du creusement (1 à 5 ; la sixième est le chemin de terre)
export const cheminDeMasque = (masque, variante = 0) => C.fichierDe(masque & 15, variante ? 1 : 0);
export const paveDeMasque = masque => `pave_${C.nomSens(masque & 15)}`;
export const etapeDeMasque = (etape, masque) => {
  if (!(etape >= 1 && etape <= 6)) throw new Error(`étape ${etape} : de 1 à 6`);
  return etape === 6 ? cheminDeMasque(masque) : `etape-${etape}_${C.nomSens(masque & 15)}`;
};

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return C.PIECES.map(p => ({ fichier: `chemins/${p.id}.svg`, fonction: 'chemin', args: [p.id] }));
}
