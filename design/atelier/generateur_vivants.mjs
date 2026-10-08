// Le générateur des vivants (Brume, Anya, le cerf blanc, le Passeur), pour le jeu et pour l'outil (generer.mjs) :
// build_bundle.js en fait un module ESM, publié dans la bibliothèque (generateur/vivants.mjs). Chaque fonction rend
// { svg, cadre, ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute
// un saut de ligne ; verif_generateurs.mjs le vérifie), son cadre, et la vitesse de son animation. Le trois quarts
// avant d'Anya et du Passeur est publié en miroir (il regarde vers le bas à droite, comme le jeu) : le générateur aussi.
import Br from './brume.js';
import An from './anya.js';
import Ce from './cerf.js';
import Pa from './passeur.js';
import T from './troupe.js';
import R from './noms_personnages.js';

const cadreDe = svg => svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
// Le dessin rangé : le nom de la bibliothèque, le miroir s'il le faut, la vitesse si l'image fait partie d'une animation
function rendu(lib, svg, pose, images) {
  const rel = R.nomPersonnage(lib);
  if (R.MIROIR_KIT.test(rel)) svg = R.miroir(svg);
  const id = rel.replace(/(_\d+)?\.svg$/, '');
  return { fichier: rel, svg, cadre: cadreDe(svg), ms_par_image: images > 1 ? R.vitessePersonnage(id, pose) ?? null : null };
}
const sans = ({ fichier, ...r }) => r;
const dans = (liste, quoi, x) => { if (!liste.includes(x)) throw new Error(`${quoi} : ${x} (${liste.join(', ')})`); };
const image = (n, max) => { if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`); };
const suffixe = saison => (saison === 'ete' ? '' : `_${saison}`);

// Ce qu'on peut demander
const STADES = Object.keys(Br.STAGES);
const EXPR_BRUME = T.EXPRS.filter(x => x !== 'fache'); // Brume ne gronde jamais
const EXPR_ANYA = T.EXPRS.filter(x => !['fache', 'gene', 'rire', 'endormi'].includes(x)); // Anya est calme
const POSES_PASSEUR = [...T.POSES, [Pa.action[0], Pa.action[1], 'action', 2]];
const CERF = { profil: ['marche', 'repos', 'clignement'], avant: ['marche', 'repos', 'clignement'], dos: ['marche', 'repos'] };
export const VIVANTS = {
  brume: { stades: STADES, images: 4, expressions: EXPR_BRUME, images_expression: 2 },
  anya: { postures: Object.fromEntries(An.POSES_A.map(([nom, , , k]) => [nom, k])), saisons: An.SAISONS_A, expressions: EXPR_ANYA, images_expression: T.IMAGES.repos },
  cerf: { vues: CERF, images_marche: 2 },
  passeur: { postures: Object.fromEntries(POSES_PASSEUR.map(([nom, , , k]) => [nom, k])), expressions: T.EXPRS, images_expression: T.IMAGES.repos }
};

// Brume : un stade (STADES), image n de 1 à 4 (le flottement)
function brume_(stade, n) {
  dans(STADES, 'stade inconnu', stade); image(n, 4);
  return rendu(`vivants/brume/brume_${stade}_${n}.svg`, Br.svgB(Br.brumeFrame(stade, n - 1)), stade, 4);
}
// Une expression de Brume : le calque des yeux seuls, à poser sur un stade, image n de 1 à 2
function brumeExpression_(expr, n) {
  dans(EXPR_BRUME, 'expression inconnue', expr); image(n, 2);
  return rendu(`vivants/brume/brume_expr_${expr}_${n}.svg`, Br.svgB(Br.brumeEyes(n - 1, expr)), 'expr', 2);
}
// Anya : une posture (face_repos, avant_marche, dos_marche, face_benediction, face_eveil), image n, son manteau de saison
function anya_(posture, n, saison = 'ete') {
  const p = An.POSES_A.find(x => x[0] === posture);
  if (!p) throw new Error(`posture inconnue : ${posture} (${An.POSES_A.map(x => x[0]).join(', ')})`);
  const [, view, pose, k] = p;
  dans(An.SAISONS_A, 'saison inconnue', saison); image(n, k);
  return rendu(`vivants/anya/anya_${posture}${suffixe(saison)}_${n}.svg`, An.svgA(An.anyaFrame(view, pose, n - 1, An.EXPR_OF[pose], saison)), posture.split('_')[1], k);
}
// Une expression d'Anya (de face, au repos), image n de 1 à 2, son manteau de saison
function anyaExpression_(expr, n, saison = 'ete') {
  dans(EXPR_ANYA, 'expression inconnue', expr); dans(An.SAISONS_A, 'saison inconnue', saison); image(n, T.IMAGES.repos);
  return rendu(`vivants/anya/anya_expr_${expr}${suffixe(saison)}_${n}.svg`, An.svgA(An.anyaFrame('front', 'repos', n - 1, expr, saison)), 'expr', T.IMAGES.repos);
}
// Le cerf blanc : vue 'profil' | 'avant' | 'dos', pose 'marche' (image n de 1 à 2), 'repos' ou 'clignement' (une image)
function cerf_(vue, pose, n = 1) {
  if (!CERF[vue]) throw new Error(`vue inconnue : ${vue} (${Object.keys(CERF).join(', ')})`);
  dans(CERF[vue], 'pose inconnue', pose);
  const k = pose === 'marche' ? 2 : 1;
  image(n, k);
  const b = pose === 'clignement' ? Ce.cerfFrame('marche', 0, true, vue) : Ce.cerfFrame(pose, n - 1, false, vue);
  const lib = `vivants/cerf/cerf_${vue === 'profil' ? '' : vue + '_'}${pose}${k > 1 ? `_${n}` : ''}.svg`;
  return rendu(lib, Ce.svgC(b), pose, k);
}
// Le Passeur : une posture (face_repos, avant_marche, dos_marche, face_salut, face_lanterne), image n
function passeur_(posture, n) {
  const p = POSES_PASSEUR.find(x => x[0] === posture);
  if (!p) throw new Error(`posture inconnue : ${posture} (${POSES_PASSEUR.map(x => x[0]).join(', ')})`);
  const [, view, pose, k] = p;
  image(n, k);
  return rendu(`vivants/passeur/passeur_${posture}_${n}.svg`, Pa.svgP(T.frame(Pa, view, pose, n - 1)), posture.split('_')[1], k);
}
// Une expression du Passeur (de face, au repos ; ses yeux luisent), image n de 1 à 2
function passeurExpression_(expr, n) {
  dans(T.EXPRS, 'expression inconnue', expr); image(n, T.IMAGES.repos);
  return rendu(`vivants/passeur/passeur_expr_${expr}_${n}.svg`, Pa.svgP(T.frame(Pa, 'front', 'repos', n - 1, expr)), 'expr', T.IMAGES.repos);
}

export const brume = (...a) => sans(brume_(...a));
export const brumeExpression = (...a) => sans(brumeExpression_(...a));
export const anya = (...a) => sans(anya_(...a));
export const anyaExpression = (...a) => sans(anyaExpression_(...a));
export const cerf = (...a) => sans(cerf_(...a));
export const passeur = (...a) => sans(passeur_(...a));
export const passeurExpression = (...a) => sans(passeurExpression_(...a));

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  const ajoute = (fonction, f, args) => out.push({ fichier: f(...args).fichier, fonction, args });
  for (const s of STADES) for (let n = 1; n <= 4; n++) ajoute('brume', brume_, [s, n]);
  for (const x of EXPR_BRUME) for (let n = 1; n <= 2; n++) ajoute('brumeExpression', brumeExpression_, [x, n]);
  for (const saison of An.SAISONS_A) {
    for (const [nom, , , k] of An.POSES_A) for (let n = 1; n <= k; n++) ajoute('anya', anya_, [nom, n, saison]);
    for (const x of EXPR_ANYA) for (let n = 1; n <= T.IMAGES.repos; n++) ajoute('anyaExpression', anyaExpression_, [x, n, saison]);
  }
  for (const [vue, poses] of Object.entries(CERF)) for (const p of poses) for (let n = 1; n <= (p === 'marche' ? 2 : 1); n++) ajoute('cerf', cerf_, [vue, p, n]);
  for (const [nom, , , k] of POSES_PASSEUR) for (let n = 1; n <= k; n++) ajoute('passeur', passeur_, [nom, n]);
  for (const x of T.EXPRS) for (let n = 1; n <= T.IMAGES.repos; n++) ajoute('passeurExpression', passeurExpression_, [x, n]);
  return out;
}
