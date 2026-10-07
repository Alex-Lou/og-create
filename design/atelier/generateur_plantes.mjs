// Le générateur des plantes, des rochers et des petits décors d'une case (arbres, buissons, fleurs, herbes, rochers,
// plage, nids, lanternes, bancs, bonshommes de neige), pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en
// fait un module ESM, publié dans la bibliothèque (generateur/plantes.mjs). plante(nom) rend { svg, cadre,
// ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de
// ligne ; verif_generateurs.mjs le vérifie). preview_plantes.mjs écrit la bibliothèque avec cette même fonction.
import D from './deco.js';
import L from './plantes_liste.js';

const CADRE = D.PROP; // le cadre d'un décor d'une case (PROP_BOX × 1,25), ancre au centre de la case
// Les plantes : nom (celui du fichier) -> { libelle, decor (l'id du décor dans le jeu) }
export const PLANTES = Object.fromEntries(L.PLANTES.map(([nom, libelle, decor]) => [nom, { libelle, decor }]));

export function plante(nom) {
  const p = L.PLANTES.find(x => x[0] === nom);
  if (!p) throw new Error(`plante inconnue : ${nom} (${L.PLANTES.length} plantes : voir PLANTES)`);
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${CADRE[2]}" height="${CADRE[3]}" viewBox="${CADRE.join(' ')}">${p[3]()}</svg>`, cadre: CADRE, ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return L.PLANTES.map(([nom]) => ({ fichier: `plantes/${nom}.svg`, fonction: 'plante', args: [nom] }));
}
