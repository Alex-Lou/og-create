// Anya et son cerf de lune dans la bibliothèque (vivants/anya, vivants/cerf-blanc). Anya : l'initiale (anya.js), la
// chevelure argentée (choix de l'auteur, 16 oct. : elle remplace sa refonte) ; le cerf : sa refonte (refonte/cerf_lune.js).
// Chaque dessin : son nom dans lib/ et son SVG (le trois quarts avant d'Anya tourné vers le bas à gauche, comme le kit :
// la bibliothèque le publie en miroir ; celui du cerf regarde déjà vers le bas à droite). generateur_vivants.mjs et
// preview_vivants.js dessinent ainsi les mêmes fichiers.
const A = require('./anya');
const { IMAGES } = require('./troupe');
const { bulle, apparitionSur, BULLES } = require('../personnages/refonte/anya_anims');
const CL = require('../personnages/refonte/cerf_lune');
const { enPersonnage } = require('../personnages/couleurs');

const SAISONS = A.SAISONS_A;
const suffixe = saison => (saison === 'ete' ? '' : `_${saison}`);
// la vue du dessin d'Anya pour une vue de la bibliothèque
const VUE = { face: 'front', avant: 'se', dos: 'ne' };
const VUE_CERF = { face: 'front', avant: 'se', dos: 'ne' };
const svgA = body => `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="128" viewBox="0 0 80 128">${body}</svg>`;

// Les poses d'Anya : [nom, ses vues, ses images, son dessin (vue, n, saison)], toutes dans les quatre saisons (son
// manteau vivant). Ses poses d'origine (le repos, la marche, la bénédiction, l'éveil), et ce que l'île lui demande :
// apparaître et disparaître (elle se forme dans ses lucioles, ou s'y défait : refonte/anya_anims.js, apparitionSur) et
// le murmure (une phrase de son écriture de lune dans une bulle, au repos ; murmure1 à 3)
const repos = (vue, n, saison, expr = 'neutre') => A.anyaFrame(VUE[vue], 'repos', n, expr, saison);
const POSES = [
  ['repos', ['face', 'avant', 'dos'], IMAGES.repos, repos],
  ['marche', ['avant', 'dos'], IMAGES.marche, (vue, n, saison) => A.anyaFrame(VUE[vue], 'marche', n, 'neutre', saison)],
  ['benediction', ['face'], IMAGES.salut, (vue, n, saison) => A.anyaFrame(VUE[vue], 'salut', n, 'content', saison)],
  ['eveil', ['face'], IMAGES.action, (vue, n, saison) => A.anyaFrame(VUE[vue], 'action', n, 'content', saison)],
  ['apparaitre', ['face', 'avant', 'dos'], 6, (vue, n, saison) => apparitionSur(() => repos(vue, 0, saison), n)],
  ['disparaitre', ['face', 'avant', 'dos'], 6, (vue, n, saison) => apparitionSur(() => repos(vue, 0, saison), 5 - n)],
  // (elle dit les glyphes l'un après l'autre ; elle ne cligne pas en parlant : les trois premières images du repos)
  ...BULLES.map((g, i) => [`murmure${i + 1}`, ['face', 'avant', 'dos'], 4,
    (vue, n, saison) => repos(vue, [0, 1, 2, 1][n], saison, 'content') + bulle(i, [0, 1, 2, g.length][n], n ? 1 : 0.6)])
];
// Ses expressions (de face, au repos, 4 images : elle respire, cligne à la 4e)
const EXPR = { neutre: 'neutre', content: 'content', surpris: 'surpris', triste: 'triste' };

// Une image d'une pose d'Anya : { lib, svg, images } ; n de 1 à images
function anya(pose, vue, n, saison = 'ete') {
  const p = POSES.find(x => x[0] === pose);
  if (!p) throw new Error(`pose inconnue : ${pose} (${POSES.map(x => x[0]).join(', ')})`);
  if (!p[1].includes(vue)) throw new Error(`vue inconnue pour ${pose} : ${vue} (${p[1].join(', ')})`);
  if (!SAISONS.includes(saison)) throw new Error(`saison inconnue : ${saison} (${SAISONS.join(', ')})`);
  if (!(n >= 1 && n <= p[2])) throw new Error(`image ${n} : de 1 à ${p[2]}`);
  // (elle, et ce qu'elle fait naître autour d'elle, ses lucioles, sa bulle : à l'encre des personnages)
  return { lib: `vivants/anya/anya_${vue}_${pose}${suffixe(saison)}_${n}.svg`, svg: svgA(enPersonnage(p[3](vue, n - 1, saison))), images: p[2] };
}
// Une expression d'Anya, de face, au repos ; { lib, svg, images }
function anyaExpression(expr, n, saison = 'ete') {
  if (!EXPR[expr]) throw new Error(`expression inconnue : ${expr} (${Object.keys(EXPR).join(', ')})`);
  if (!SAISONS.includes(saison)) throw new Error(`saison inconnue : ${saison} (${SAISONS.join(', ')})`);
  if (!(n >= 1 && n <= IMAGES.repos)) throw new Error(`image ${n} : de 1 à ${IMAGES.repos}`);
  return { lib: `vivants/anya/anya_expr_${expr}${suffixe(saison)}_${n}.svg`, svg: svgA(repos('face', n - 1, saison, EXPR[expr])), images: IMAGES.repos };
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
  for (const [pose, vues, k] of POSES) for (const vue of vues) for (const saison of SAISONS) {
    for (let n = 1; n <= k; n++) out.push(['anya', [pose, vue, n, saison]]);
  }
  for (const saison of SAISONS) for (const x of Object.keys(EXPR)) for (let n = 1; n <= IMAGES.repos; n++) out.push(['anyaExpression', [x, n, saison]]);
  for (const vue of VUES_CERF) for (const [pose, k] of Object.entries(CERF)) for (let n = 1; n <= k; n++) out.push(['cerf', [vue, pose, n]]);
  return out;
}

module.exports = { anya, anyaExpression, cerf, liste, POSES, EXPR, CERF, VUES_CERF, SAISONS };
