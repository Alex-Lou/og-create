// Anya et son cerf de lune refondus (design/personnages/refonte : anya_anims.js, cerf_lune.js) dans la bibliothèque
// (choix de l'auteur, 16 oct. : remplacés sur place, dans vivants/anya et vivants/cerf-blanc). Chaque dessin : son nom
// dans lib/ et son SVG (le trois quarts avant d'Anya tourné vers le bas à gauche, comme le kit : la bibliothèque le
// publie en miroir ; celui du cerf regarde déjà vers le bas à droite). generateur_vivants.mjs et preview_vivants.js
// dessinent ainsi les mêmes fichiers.
const AA = require('../personnages/refonte/anya_anims');
const AT = require('../personnages/refonte/anya_tenues');
const AR = require('../personnages/refonte/anya_refonte');
const CL = require('../personnages/refonte/cerf_lune');

const SAISONS = Object.keys(AT.SAISONS);
const suffixe = saison => (saison === 'ete' ? '' : `_${saison}`);
// la direction des animations refondues pour une vue de la bibliothèque (le trois quarts avant, de dos : sans miroir)
const DIR = { face: 'face', avant: 'bas_gauche', dos: 'haut_droite' };
const VUE_CERF = { face: 'front', avant: 'se', dos: 'ne' };
const svgA = body => `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="128" viewBox="0 0 80 128">${body}</svg>`;

// Les poses d'Anya : [nom dans la bibliothèque, animation refondue, ses vues, saisonnière] ; le manteau change avec les
// saisons pour ce qui se voit sur l'île (le repos, flotter, le murmure, apparaître et disparaître) et pour les poses
// qu'elle avait déjà (la bénédiction et l'éveil, de face) ; le reste (la Révélation, ses gestes) en été. La marche est
// devenue « flotter » : elle glisse, des fleurs s'ouvrent sur son chemin. Le murmure, une phrase par pose (murmure1 à 3).
const POSES = [
  ['voile', 'voile', ['face', 'avant', 'dos'], false],
  ['eveil', 'eveil', ['face', 'avant'], ['face']],
  ['repos', 'repos', ['face', 'avant', 'dos'], true],
  ['marche', 'flotter', ['avant', 'dos'], true],
  ['benediction', 'benediction', ['face', 'avant'], ['face']],
  ['creer', 'creer', ['face', 'avant'], false],
  ['parler', 'parler', ['face', 'avant', 'dos'], false],
  ['souffler', 'souffler', ['face', 'avant'], false],
  ...AA.BULLES.map((b, i) => [`murmure${i + 1}`, 'murmure', ['face', 'avant', 'dos'], true, { murmure: i }]),
  ['apparaitre', 'apparaitre', ['face', 'avant', 'dos'], true],
  ['disparaitre', 'disparaitre', ['face', 'avant', 'dos'], true]
];
const saisonnier = (p, vue) => p[3] === true || (Array.isArray(p[3]) && p[3].includes(vue));
// Ses expressions (de face, au repos ; les noms qu'elles avaient) : la refonte la plus proche
const EXPR = { neutre: 'veille', content: 'sourire', surpris: 'parle', triste: 'triste' };

// Une image d'une pose d'Anya : { lib, svg, images } ; n de 1 à images
function anya(pose, vue, n, saison = 'ete') {
  const p = POSES.find(x => x[0] === pose);
  if (!p) throw new Error(`pose inconnue : ${pose} (${POSES.map(x => x[0]).join(', ')})`);
  if (!p[2].includes(vue)) throw new Error(`vue inconnue pour ${pose} : ${vue} (${p[2].join(', ')})`);
  if (!SAISONS.includes(saison)) throw new Error(`saison inconnue : ${saison} (${SAISONS.join(', ')})`);
  if (saison !== 'ete' && !saisonnier(p, vue)) throw new Error(`${vue}_${pose} : en été seulement`);
  const A = AA.ANIMS[p[1]];
  if (!(n >= 1 && n <= A.images)) throw new Error(`image ${n} : de 1 à ${A.images}`);
  const c = { ...AT.habiller(saison, A.etat), uid: 'an', ...(p[4] || {}) };
  return { lib: `vivants/anya/anya_${vue}_${pose}${suffixe(saison)}_${n}.svg`, svg: svgA(AA.dessiner(c, p[1], DIR[vue], n - 1)), images: A.images };
}
// Une expression d'Anya, de face, au repos (4 images : elle respire, flotte, cligne au neutre) ; { lib, svg, images }
function anyaExpression(expr, n, saison = 'ete') {
  if (!EXPR[expr]) throw new Error(`expression inconnue : ${expr} (${Object.keys(EXPR).join(', ')})`);
  if (!SAISONS.includes(saison)) throw new Error(`saison inconnue : ${saison} (${SAISONS.join(', ')})`);
  if (!(n >= 1 && n <= 4)) throw new Error(`image ${n} : de 1 à 4`);
  const c = { ...AT.habiller(saison, 'eveillee'), uid: 'an' };
  const body = AR.anya(c, 'front', { n: n - 1, lev: [2, 2.5, 2.8, 2.5][n - 1], blink: n === 4 && expr === 'neutre', expr: EXPR[expr] });
  return { lib: `vivants/anya/anya_expr_${expr}${suffixe(saison)}_${n}.svg`, svg: svgA(body), images: 4 };
}

// Le cerf de lune : debout (4 images : il respire, une oreille frémit, la queue bat, il cligne à la 4e), marche (8),
// couché (4), salut (4), de face, de trois quarts avant et de dos ; et, comme avant, repos (une image : debout, la 1re)
// et clignement (une image : debout, la 4e). Le cadre 120 × 144, à l'échelle d'Anya.
const CERF = { debout: 4, marche: 8, couche: 4, salut: 4, repos: 1, clignement: 1 };
const VUES_CERF = ['face', 'avant', 'dos'];
function cerf(vue, pose, n = 1) {
  if (!VUES_CERF.includes(vue)) throw new Error(`vue inconnue : ${vue} (${VUES_CERF.join(', ')})`);
  if (!CERF[pose]) throw new Error(`pose inconnue : ${pose} (${Object.keys(CERF).join(', ')})`);
  const k = CERF[pose];
  if (!(n >= 1 && n <= k)) throw new Error(`image ${n} : de 1 à ${k}`);
  const [p, i] = pose === 'repos' ? ['debout', 0] : pose === 'clignement' ? ['debout', 3] : [pose, n - 1];
  return { lib: `vivants/cerf/cerf_${vue}_${pose}${k > 1 ? `_${n}` : ''}.svg`, svg: CL.svgCL(CL.cerfLune(VUE_CERF[vue], p, i, { id: 'cl' })), images: k };
}

// Tout ce qu'on dessine : [fonction, arguments]
function liste() {
  const out = [];
  for (const p of POSES) for (const vue of p[2]) for (const saison of SAISONS.filter(s => s === 'ete' || saisonnier(p, vue))) {
    for (let n = 1; n <= AA.ANIMS[p[1]].images; n++) out.push(['anya', [p[0], vue, n, saison]]);
  }
  for (const saison of SAISONS) for (const x of Object.keys(EXPR)) for (let n = 1; n <= 4; n++) out.push(['anyaExpression', [x, n, saison]]);
  for (const vue of VUES_CERF) for (const [pose, k] of Object.entries(CERF)) for (let n = 1; n <= k; n++) out.push(['cerf', [vue, pose, n]]);
  return out;
}

module.exports = { anya, anyaExpression, cerf, liste, POSES, EXPR, CERF, VUES_CERF, SAISONS };
