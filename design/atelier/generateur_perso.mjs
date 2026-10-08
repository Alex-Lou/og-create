// Le générateur de l'interface du joueur, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module
// ESM, publié dans la bibliothèque (generateur/perso.mjs). piece(id) rend { svg, cadre, ms_par_image } : le SVG complet, identique à
// l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le vérifie).
// Le cadre est en pixels d'affichage ; le SVG déclare une taille HD fois plus grande (net sur un canvas).
// preview_perso.mjs écrit la bibliothèque avec cette même fonction.
import H from './perso.js';

// Les pièces : id -> { nom, sert, taille [largeur, hauteur] (affichage), tranche [haut, droite, bas, gauche] ou null,
// zones (où le jeu pose la photo, le nom, les pieds de l'avatar ; en pixels d'affichage) ou null }
export const PIECES = Object.fromEntries(H.PIECES.map(([id, nom, taille, tranche, , sert, zones]) => [id, { nom, sert, taille, tranche, zones: zones || null }]));
export const HD = H.HD;

// Une pièce de l'interface du joueur ; hd : le facteur de la taille déclarée (4 par défaut, celle des fichiers)
export function piece(id, hd = H.HD) {
  const p = H.PIECES.find(x => x[0] === id);
  if (!p) throw new Error(`pièce inconnue : ${id} (${Object.keys(PIECES).join(', ')})`);
  const [w, h] = p[2], cadre = [0, 0, w, h];
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${w * hd}" height="${h * hd}" viewBox="${cadre.join(' ')}">${p[4]()}</svg>`, cadre, ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return H.PIECES.map(([id]) => ({ fichier: `perso/${id}.svg`, fonction: 'piece', args: [id] }));
}
