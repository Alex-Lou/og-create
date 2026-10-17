// Le jeu de l'avatar dans une scène en plans (game/scenePlans.js ; choix de l'auteur, 17 oct. : l'avatar joue la
// scène, il n'est plus posé d'une seule pièce) : pendant un temps, sa piste « acteur » enchaîne des clips
// [[t, { anim, dir, expr }], …] — anim : une animation du kit (MOUVEMENTS : repos, marche, course, arret, pose_…),
// dir : une direction (DIRECTIONS : face, bas_gauche, bas_droite, haut_droite, haut_gauche), expr : une expression ;
// t en ms depuis le début du temps. Ses déplacements et ses cadrages sont les pistes du plan « avatar ».
// Son dessin est gravé comme la scène : cerné d'encre, hachuré du côté de l'ombre, teinté par sa lumière.

export const ENCRE = '#1A1410';
// (les animations qui ne bouclent pas : elles finissent sur leur dernière image)
const UNE_FOIS = new Set(['arret']);

// Le clip joué à l'instant t (ms) : son rang, son début, ce qu'il joue
export function clipA(acteur, t) {
  let k = 0;
  for (let i = 1; i < acteur.length; i++) if (acteur[i][0] <= t) k = i;
  return { rang: k, debut: acteur[k][0], clip: acteur[k][1] };
}

// L'image d'une animation, ecoule ms après le début de son clip (anims : MOUVEMENTS du kit, { images, dt en s })
export function imageA(anim, ecoule, anims) {
  const A = anims[anim];
  if (!A) return 0;
  const n = Math.max(0, Math.floor(ecoule / (A.dt * 1000)));
  return UNE_FOIS.has(anim) ? Math.min(n, A.images - 1) : n % A.images;
}

// Dans combien de ms l'image change (l'image suivante du clip, ou le clip suivant)
export function prochain(acteur, t, anims) {
  const { rang, debut, clip } = clipA(acteur, t);
  const A = anims[clip.anim];
  const pas = A ? A.dt * 1000 : Infinity;
  const image = pas - ((t - debut) % pas);
  const suivant = rang + 1 < acteur.length ? acteur[rang + 1][0] - t : Infinity;
  return Math.max(16, Math.min(image, suivant));
}

// Une image du kit (le contenu du cadre 48 × 64), gravée : une silhouette d'encre épaisse derrière elle (son cerne),
// puis elle, puis, découpées à sa forme, la teinte de la lumière de la scène et des hachures du côté de l'ombre
// (lumiere : { teinte, force, cote : 1 l'ombre à droite, -1 à gauche }). Sans filtre : le cerne est son propre dessin,
// tout en encre (une règle de style), et la découpe un masque où il est tout blanc
export function gravee(corps, uid, { teinte = '#2A2448', force = 0.2, cote = 1 } = {}) {
  const hach = Array.from({ length: 34 }, (_, k) => `M${-16 + k * 2},68 l36,-76`).join(' ');
  const [x1, x2] = cote > 0 ? [0, 1] : [1, 0];
  return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="64" viewBox="0 0 48 64">'
    + `<style>.c${uid} *{fill:${ENCRE}!important;stroke:${ENCRE}!important;stroke-width:2.4px!important}.m${uid} *{fill:#fff!important;stroke:#fff!important}</style>`
    + `<defs><mask id="k${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="64"><g class="m${uid}">${corps}</g></mask>`
    + `<linearGradient id="g${uid}" x1="${x1}" y1="0" x2="${x2}" y2="0.3"><stop offset="0.38" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>`
    + `<mask id="h${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="64"><rect width="48" height="64" fill="url(#g${uid})"/></mask></defs>`
    + `<g class="c${uid}">${corps}</g>${corps}`
    + `<g mask="url(#k${uid})"><rect width="48" height="64" fill="${teinte}" opacity="${force}"/><g mask="url(#h${uid})"><path d="${hach}" fill="none" stroke="${ENCRE}" stroke-width="0.45" opacity="0.8"/></g></g></svg>`;
}
