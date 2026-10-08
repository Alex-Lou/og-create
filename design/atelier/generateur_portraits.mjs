// Le générateur des portraits des maîtres, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module
// ESM, publié dans la bibliothèque (generateur/portraits.mjs). portraitMaitre(id, expression) et bullePortrait(clé)
// rendent { svg, cadre, ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y
// ajoute un saut de ligne ; verif_generateurs.mjs le vérifie). Le portrait de l'avatar se compose à partir des choix du
// joueur : generateur/avatar.mjs (portrait). preview_portraits.mjs écrit la bibliothèque avec ces mêmes fonctions.
import P from '../personnages/portraits.js';
import aster from '../personnages/aster.js';
import cannelle from '../personnages/cannelle.js';
import galet from '../personnages/galet.js';
import melisse from '../personnages/melisse.js';
import ondin from '../personnages/ondin.js';
import rivet from '../personnages/rivet.js';
import sylve from '../personnages/sylve.js';

export const MAITRES = { aster, cannelle, galet, melisse, ondin, rivet, sylve };
export const { EXPRESSIONS_PORTRAIT, BULLES_PORTRAIT, TAILLE_PORTRAIT, HD_PORTRAIT } = P;

// Le portrait d'un maître dans une expression (animé en SMIL)
export function portraitMaitre(id, expression = 'neutre') {
  if (!MAITRES[id]) throw new Error(`maître inconnu : ${id} (${Object.keys(MAITRES).join(', ')})`);
  const { svg, cadre } = P.portrait(MAITRES[id], expression);
  return { svg, cadre, ms_par_image: null };
}
// Une bulle d'émotion, à poser par-dessus un portrait (même taille)
export function bullePortrait(cle) {
  const { svg, cadre } = P.bulle(cle);
  return { svg, cadre, ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const id of Object.keys(MAITRES)) for (const e of P.EXPRESSIONS_PORTRAIT) out.push({ fichier: `portraits/${id}/${id}-portrait_${e}.svg`, fonction: 'portraitMaitre', args: [id, e] });
  for (const k of P.BULLES_PORTRAIT) out.push({ fichier: `portraits/bulles/bulle_${k}.svg`, fonction: 'bullePortrait', args: [k] });
  return out;
}
