// Le générateur des coffres, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié
// dans la bibliothèque (generateur/coffres.mjs). coffre(rarete, etat, n) et coffreIcone(rarete) rendent { svg, cadre,
// ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de
// ligne ; verif_generateurs.mjs le vérifie). preview_coffres.mjs écrit la bibliothèque avec ces mêmes fonctions.
import { RARITIES, closed, opening, open, glow, icon } from './coffres.mjs';

const CADRE = [0, 0, 120, 100]; // la fenêtre d'ouverture du jeu
// Haute définition : le fichier déclare une taille HD fois plus grande que son cadre (net sur un canvas) ; à afficher à
// la taille du cadre
export const HD = 4;
const svgOf = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre[2] * HD}" height="${cadre[3] * HD}" viewBox="${cadre.join(' ')}">${body}</svg>`;
// Les états d'un coffre et leurs images : fermé (un reflet passe, animé dans le SVG), l'ouverture (une fois), ouvert (les
// scintillements, animés dans le SVG), les rayons (calque facultatif, derrière le coffre ouvert)
const ETATS = { ferme: [2, closed], ouverture: [4, opening], ouvert: [2, open], rayons: [2, glow] };
export const COFFRES = Object.fromEntries(Object.entries(RARITIES).map(([k, r]) => [k, { nom: r.label, couleur: r.glow }]));
export const IMAGES = Object.fromEntries(Object.entries(ETATS).map(([e, [n]]) => [e, n]));

const rarete = k => { if (!RARITIES[k]) throw new Error(`rareté inconnue : ${k} (${Object.keys(RARITIES).join(', ')})`); };
// Un coffre : rareté (commun, rare, epique, legendaire), état (ferme, ouverture, ouvert, rayons), image n
export function coffre(k, etat = 'ferme', n = 1) {
  rarete(k);
  if (!ETATS[etat]) throw new Error(`état inconnu : ${etat} (${Object.keys(ETATS).join(', ')})`);
  const [max, dessin] = ETATS[etat];
  if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`);
  return { svg: svgOf(CADRE, dessin(k, n - 1)), cadre: CADRE, ms_par_image: null };
}
// L'icône d'un coffre, 32 × 32
export function coffreIcone(k) {
  rarete(k);
  return { svg: svgOf([0, 0, 32, 32], icon(k)), cadre: [0, 0, 32, 32], ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const k of Object.keys(RARITIES)) {
    for (const [e, [max]] of Object.entries(ETATS)) for (let n = 1; n <= max; n++) out.push({ fichier: `coffres/${k}/coffre_${k}_${e}_${n}.svg`, fonction: 'coffre', args: [k, e, n] });
    out.push({ fichier: `coffres/${k}/coffre_${k}_icone.svg`, fonction: 'coffreIcone', args: [k] });
  }
  return out;
}
