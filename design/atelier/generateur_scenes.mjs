// Le générateur des scènes plein écran du tutoriel, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait
// un module ESM, publié dans la bibliothèque (generateur/scenes.mjs). Chaque fonction rend { svg, cadre, ms_par_image } :
// le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ;
// verif_generateurs.mjs le vérifie), son cadre (le carré 400 × 400) et la vitesse de la scène. L'avatar n'est pas
// dessiné : le jeu pose celui du joueur entre le fond et le devant, à la place que donne SCENES[id].avatar.
import S6 from './scenes6.js';

const r2 = n => Math.round(n * 100) / 100;
const W = S6.W;
const CADRE = [0, 0, W, W];
const svgOf = body => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(W)}" height="${r2(W)}" viewBox="0 0 ${W} ${W}">${body}</svg>`;

// Ce qu'on peut demander : chaque scène, ses étapes, son titre, ses images, sa vitesse, ses calques, la place de l'avatar
export const SCENES = Object.fromEntries(Object.entries(S6.SCENES).map(([id, sc]) => [id, {
  titre: sc.titre, etapes: sc.etapes, images: sc.images, ms_par_image: sc.ms, calques: sc.devant ? ['fond', 'devant'] : ['fond'], avatar: sc.avatar
}]));
export const CADRE_PHOTO = S6.CADRE_PHOTO;

// Un calque d'une scène : 'fond' (derrière l'avatar) ou 'devant' (devant lui, s'il y en a un), image n
export function scene(id, calque, n = 1) {
  const sc = S6.SCENES[id];
  if (!sc) throw new Error(`scène inconnue : ${id} (${Object.keys(S6.SCENES).join(', ')})`);
  if (!SCENES[id].calques.includes(calque)) throw new Error(`calque inconnu : ${calque} (${SCENES[id].calques.join(', ')})`);
  if (!(n >= 1 && n <= sc.images)) throw new Error(`image ${n} : de 1 à ${sc.images}`);
  return { svg: svgOf(sc[calque](n - 1)), cadre: CADRE, ms_par_image: sc.ms };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const [id, sc] of Object.entries(SCENES)) for (const c of sc.calques) for (let n = 1; n <= sc.images; n++) out.push({ fichier: `scenes/tutoriel/${id}/${id}_${c}_${n}.svg`, fonction: 'scene', args: [id, c, n] });
  return out;
}
