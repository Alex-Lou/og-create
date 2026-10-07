// Le générateur de la météo, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié
// dans la bibliothèque (generateur/meteo.mjs). Les calques d'écran (tuiles sans couture qui bouclent), le ciel, les
// nuages, les lumières et le sol des saisons, les teintes et la mer des moments, les teintes des climats et des saisons,
// les icônes. Chaque fonction rend { svg, cadre, ms_par_image } : le SVG complet, identique à l'octet au fichier de la
// bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le vérifie). preview_meteo.js écrit la
// bibliothèque avec ces mêmes fonctions.
import M from './meteo.js';

const r2 = n => Math.round(n * 100) / 100;
const svgOf = (vb, body, stretch = false) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2])}" height="${r2(vb[3])}" viewBox="${vb.join(' ')}"${stretch ? ' preserveAspectRatio="none"' : ''}>${body}</svg>`;
const ECRAN = [0, 0, 640, 360]; // les teintes et la mer : à étirer sur tout l'écran
const plein = c => `<rect width="640" height="360" fill="${c}"/>`;

// Le dossier de chaque tuile : le temps de l'île, l'air des climats, le ciel de la nuit, l'air des saisons
export const GROUPES_TUILES = { pluie_jour: 'temps', pluie_nuit: 'temps', brume: 'temps', neige: 'climats', rafales: 'climats', brume_marais: 'climats', chaleur: 'climats', averse: 'climats', cendres: 'climats', etoiles: 'ciel', flocons: 'saisons', feuilles: 'saisons', petales: 'saisons', pollen: 'saisons' };
// Ce qu'on peut demander
export const METEO = {
  tuiles: Object.fromEntries(Object.entries(M.TILES).map(([id, t]) => [id, { groupe: GROUPES_TUILES[id], images: t.n, tuile: [t.w, t.h], ms_par_image: t.ms }])),
  sprites: Object.fromEntries(Object.entries(M.SPR).map(([id, s]) => [id, { groupe: s.group, images: s.n, cadre: s.frame, etirer: !!s.stretch }])),
  moments: M.MOMENTS.map(([id]) => id), climats: Object.keys(M.CLIMATES), saisons: Object.keys(M.SAISONS), icones: M.ICON_GROUPS
};

const verifie = (table, quoi, id) => { if (!table[id]) throw new Error(`${quoi} inconnu : ${id} (${Object.keys(table).join(', ')})`); return table[id]; };
const image = (n, max) => { if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`); };

// Une tuile sans couture (à répéter), image n
export function tuile(id, n = 1) {
  const t = verifie(M.TILES, 'calque', id);
  image(n, t.n);
  return { svg: svgOf([0, 0, t.w, t.h], t.draw(n - 1)), cadre: [0, 0, t.w, t.h], ms_par_image: t.ms };
}
// Un dessin du ciel, un nuage, une lumière, le sol d'une case (image n)
export function sprite(id, n = 1) {
  const s = verifie(M.SPR, 'dessin', id);
  image(n, s.n);
  return { svg: svgOf(s.frame, s.draw(n - 1), s.stretch), cadre: s.frame, ms_par_image: s.n > 1 ? s.ms || 300 : null };
}
// La teinte d'un moment du jour, d'un climat ou d'une saison (à étirer sur tout l'écran, en multiplication)
export function teinte(sorte, id) {
  const couleur = sorte === 'moments' ? (M.MOMENTS.find(m => m[0] === id) || [])[3]?.tint : sorte === 'climats' ? M.CLIMATES[id]?.teinte : sorte === 'saisons' ? M.SAISONS[id]?.teinte : null;
  if (!['moments', 'climats', 'saisons'].includes(sorte)) throw new Error(`teinte : ${sorte} (moments, climats ou saisons)`);
  if (!couleur) throw new Error(`teinte ${sorte} inconnue : ${id} (${METEO[sorte].join(', ')})`);
  return { svg: svgOf(ECRAN, plein(couleur), true), cadre: ECRAN, ms_par_image: null };
}
// La mer d'un moment du jour (un dégradé, à étirer sur tout l'écran)
export function mer(id) {
  const m = M.MOMENTS.find(x => x[0] === id);
  if (!m) throw new Error(`moment inconnu : ${id} (${METEO.moments.join(', ')})`);
  const [haut, bas] = m[3].sea;
  return { svg: svgOf(ECRAN, `<defs><linearGradient id="m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${haut}"/><stop offset="1" stop-color="${bas}"/></linearGradient></defs><rect width="640" height="360" fill="url(#m)"/>`, true), cadre: ECRAN, ms_par_image: null };
}
// Une icône de la météo, 48 × 48 (groupe : temps, moments, climats, saisons)
export function icone(groupe, id) {
  const ids = verifie(M.ICON_GROUPS, 'groupe', groupe);
  if (!ids.includes(id)) throw new Error(`icône inconnue : ${id} (${ids.join(', ')})`);
  return { svg: svgOf([0, 0, 48, 48], M.ICONS[id]()), cadre: [0, 0, 48, 48], ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [], f = rel => `meteo/${rel}`;
  for (const [id, t] of Object.entries(M.TILES)) for (let n = 1; n <= t.n; n++) out.push({ fichier: f(`${GROUPES_TUILES[id]}/${id}_${n}.svg`), fonction: 'tuile', args: [id, n] });
  for (const [id, s] of Object.entries(M.SPR)) for (let n = 1; n <= s.n; n++) out.push({ fichier: f(`${s.group}/${id}${s.n > 1 ? `_${n}` : ''}.svg`), fonction: 'sprite', args: [id, n] });
  for (const [id] of M.MOMENTS) out.push({ fichier: f(`moments/teinte_${id}.svg`), fonction: 'teinte', args: ['moments', id] }, { fichier: f(`moments/mer_${id}.svg`), fonction: 'mer', args: [id] });
  for (const id of Object.keys(M.CLIMATES)) out.push({ fichier: f(`climats/teinte_${id}.svg`), fonction: 'teinte', args: ['climats', id] });
  for (const id of Object.keys(M.SAISONS)) out.push({ fichier: f(`saisons/teinte_${id}.svg`), fonction: 'teinte', args: ['saisons', id] });
  for (const [g, ids] of Object.entries(M.ICON_GROUPS)) for (const id of ids) out.push({ fichier: f(`icones/${g}/${id}.svg`), fonction: 'icone', args: [g, id] });
  return out;
}
