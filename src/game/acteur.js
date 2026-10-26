// Le jeu de l'avatar dans une scène en plans (game/scenePlans.js ; choix de l'auteur, 17 oct. : l'avatar joue la
// scène, il n'est plus posé d'une seule pièce) : pendant un temps, sa piste « acteur » enchaîne des clips
// [[t, { anim, dir, expr }], …] — anim : une animation du kit (MOUVEMENTS : repos, marche, course, arret, pose_…),
// dir : une direction (DIRECTIONS : face, bas_gauche, bas_droite, haut_droite, haut_gauche), expr : une expression ;
// t en ms depuis le début du temps. Ses déplacements et ses cadrages sont les pistes du plan « avatar ».
// Son dessin est gravé comme la scène : cerné d'encre, hachuré du côté de l'ombre, teinté par sa lumière.

export const ENCRE = '#1A1410';
// (les animations qui ne bouclent pas : elles finissent sur leur dernière image)
const UNE_FOIS = new Set(['arret']);

// La clé d'une image d'un figurant (une pièce à plusieurs images, ScenePlans) : son animation, sa direction, son
// expression, son rang ; l'atelier nomme ses images de même (design/atelier/figurants.js)
export const cleImage = ({ anim, dir, expr }, n) => `${anim}|${dir}|${expr || ''}|${n}`;

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
// (lumiere : { teinte, force, cote : 1 l'ombre à droite, -1 à gauche, neon }). Sans filtre : le cerne est son propre
// dessin, tout en encre (une règle de style), et la découpe un masque où il est tout blanc.
// En néon (choix de l'auteur, 18 oct. : tout le jeu en papier néon, l'avatar du joueur aussi, quel qu'il soit ; puis
// « davantage de fondu et d'harmonie entre l'avatar et l'environnement ») : ses propres couleurs ravivées, le cerne
// indigo, et la lumière de la scène posée sur lui comme sur le décor : son côté ombre plonge dans l'ambiance (ambiance),
// son côté éclairé prend la couleur de la source (eclat : le couchant, la lune, Brume, le feu), ses pieds s'enfoncent
// dans l'ambiance ; un liseré de lumière fin (lisere), du côté éclairé ; pas de hachures (force : l'intensité, 1).
// Une lumière juste et égale, sans projecteur (retour de l'auteur, 25 oct. : un liseré épais et son halo d'un côté, le
// corps éteint de l'autre) : une ombre légère, un liseré d'un demi-trait, sans halo
export function gravee(corps, uid, { teinte = '#2A2448', force = 0.2, cote = 1, neon = false, ambiance = '#2A0A5A', eclat = '#FF8AC0', lisere = NEON_LISERE } = {}) {
  if (neon) return graveeNeon(corps, uid, { cote, force, ambiance, eclat, lisere });
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
function graveeNeon(corps, uid, { cote, force, ambiance, eclat, lisere }) {
  const f = Math.max(0, force), dx = -Math.sign(cote || 1) * 0.5;
  // (du côté éclairé au côté ombre, en travers du corps, pas du cadre : sinon la bascule tombait au milieu de lui, une
  // moitié éclairée, l'autre éteinte)
  const [x1, x2] = cote > 0 ? [12, 36] : [36, 12];
  const op = v => Math.min(1, v * f).toFixed(3);
  return '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="64" viewBox="0 0 48 64">'
    + `<style>.c${uid} *{fill:${NEON_ENCRE}!important;stroke:${NEON_ENCRE}!important;stroke-width:2.4px!important}.m${uid} *{fill:#fff!important;stroke:#fff!important}`
    + `.l${uid} *{fill:${lisere}!important;stroke:${lisere}!important;stroke-width:2.4px!important}</style>`
    + `<defs><mask id="k${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="64"><g class="m${uid}">${corps}</g></mask>`
    + `<linearGradient id="t${uid}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="20" x2="${x2}" y2="34"><stop offset="0" stop-color="${eclat}" stop-opacity="${op(0.16)}"/><stop offset="0.5" stop-color="${eclat}" stop-opacity="0"/><stop offset="0.5" stop-color="${ambiance}" stop-opacity="0"/><stop offset="1" stop-color="${ambiance}" stop-opacity="${op(0.26)}"/></linearGradient>`
    + `<linearGradient id="b${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0.7" stop-color="${ambiance}" stop-opacity="0"/><stop offset="1" stop-color="${ambiance}" stop-opacity="${op(0.3)}"/></linearGradient></defs>`
    + `<g class="l${uid}" opacity="0.8" transform="translate(${dx} -0.2)">${corps}</g>`
    + `<g class="c${uid}">${corps}</g>${enNeon(corps)}`
    + `<g mask="url(#k${uid})"><rect width="48" height="64" fill="${ambiance}" opacity="${op(0.08)}"/><rect width="48" height="64" fill="url(#t${uid})"/><rect width="48" height="64" fill="url(#b${uid})"/></g></svg>`;
}

// ——— le néon ———
const NEON_ENCRE = '#0A0418', NEON_LISERE = '#7AF8EE';
const hsl = hex => {
  const n = hex.length === 4 ? [1, 2, 3].map(i => parseInt(hex[i] + hex[i], 16) / 255) : [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = n, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1)), h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, s, l];
};
const versHex = (h, s, l) => {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
};
// une couleur de l'avatar en néon : plus saturée (sans perdre la couleur choisie : +0,25 au plus), les gris teintés de
// violet, les sombres tirés vers l'indigo de la nuit
export function neonCouleur(hex) {
  const [h, s, l] = hsl(hex);
  if (l < 0.16) return versHex(258, 0.55, Math.max(0.06, l));
  if (s < 0.06) return versHex(255, 0.18, l);
  return versHex(h, Math.min(1, s + 0.25, s * 1.4 + 0.08), l);
}
// (les couleurs des attributs et des styles, pas les références url(#…))
const enNeon = corps => corps.replace(/((?:fill|stroke|stop-color|flood-color)\s*[=:]\s*["']?)(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3})(?![0-9a-zA-Z])/g, (m, avant, c) => avant + neonCouleur(c));
