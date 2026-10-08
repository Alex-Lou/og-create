// Le générateur des pièces des mini-jeux, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module
// ESM, publié dans la bibliothèque (generateur/minijeux.mjs). minijeu(jeu, id) rend { svg, cadre, ms_par_image } : le SVG
// complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs
// le vérifie). Le cadre est en unités du dessin (un bloc du Filon : 32 × 32) ; le SVG déclare HD fois plus grand.
// preview_minijeux.mjs écrit la bibliothèque avec cette même fonction.
import filon from './minijeu_filon.js';
import filonPlus from './minijeu_filon_plus.js';
import peche from './minijeu_peche.js';
import cueillette from './minijeu_cueillette.js';
import recolte from './minijeu_recolte.js';

export const HD = 4;
const MODULES = { filon, peche, cueillette, recolte };
// le Filon a deux modules : ses pièces d'origine, puis ses améliorations (paroi, pioches, trouvailles, bilan)
export const JEUX = Object.fromEntries(Object.entries(MODULES).map(([k, m]) => [k, k === 'filon' ? [...m.PIECES, ...filonPlus.PIECES] : m.PIECES]));
// pour chaque jeu : son titre, la couleur du fond de ses planches, ce qu'il faut savoir pour l'intégrer
export const INFOS = Object.fromEntries(Object.entries(MODULES).map(([k, m]) => [k, { titre: m.TITRE, fond: m.FOND, lisez_moi: m.LISEZ_MOI }]));
const svgOf = (c, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${c[2] * HD}" height="${c[3] * HD}" viewBox="${c.join(' ')}">${body}</svg>`;

// Une pièce d'un mini-jeu : jeu (filon, peche, cueillette, recolte), id (le nom du fichier, sans .svg)
export function minijeu(jeu, id) {
  if (!JEUX[jeu]) throw new Error(`mini-jeu inconnu : ${jeu} (${Object.keys(JEUX).join(', ')})`);
  const p = JEUX[jeu].find(x => x.id === id);
  if (!p) throw new Error(`pièce inconnue du ${jeu} : ${id}`);
  return { svg: svgOf(p.cadre, p.dessin()), cadre: p.cadre, ms_par_image: p.ms };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return Object.entries(JEUX).flatMap(([jeu, pieces]) => pieces.map(p => ({ fichier: `minijeux/${jeu}/${p.id}.svg`, fonction: 'minijeu', args: [jeu, p.id] })));
}
