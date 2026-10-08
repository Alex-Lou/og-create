// Le générateur des icônes de l'interface, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module
// ESM, publié dans la bibliothèque (generateur/interface.mjs). icone(id) rend { svg, cadre, ms_par_image } : le SVG
// complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs
// le vérifie). preview_interface.mjs écrit la bibliothèque avec cette même fonction.
import I from './interface.js';

const CADRE = [0, 0, 32, 32];
// Les icônes : id -> { nom, sert } (où le jeu s'en sert)
export const ICONES = Object.fromEntries(I.ICONES.map(([id, nom, , sert]) => [id, { nom, sert }]));

// Une icône, carré 32 × 32 (à afficher de 16 à 32 px) ; px : sa taille à l'écran (32 par défaut, celle des fichiers)
export function icone(id, px = 32) {
  const i = I.ICONES.find(x => x[0] === id);
  if (!i) throw new Error(`icône inconnue : ${id} (${Object.keys(ICONES).join(', ')})`);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="${CADRE.join(' ')}">${i[2]()}</svg>`, cadre: CADRE, ms_par_image: null };
}

// La taille des icônes en haute définition (interface/hd/) : le même dessin, déclaré 4 fois plus grand, net sur un canvas
export const HD = 128;

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return [...I.ICONES.map(([id]) => ({ fichier: `interface/${id}_icone.svg`, fonction: 'icone', args: [id] })),
    ...I.ICONES.map(([id]) => ({ fichier: `interface/hd/${id}_icone.svg`, fonction: 'icone', args: [id, HD] }))];
}
