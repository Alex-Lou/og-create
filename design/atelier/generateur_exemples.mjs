// Le générateur des exemples d'avatar de la bibliothèque (douze avatars, leur version naufragée) et des icônes des objets
// de l'avatar, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié dans la
// bibliothèque (generateur/exemples.mjs). Chaque fonction rend { svg, cadre, ms_par_image } : le SVG complet, identique
// à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le vérifie), son
// cadre et sa vitesse. Pour composer un avatar à partir de choix, c'est le générateur de l'avatar (avatar.mjs) ; ici, ce
// sont les exemples tels que la bibliothèque les publie. Le trois quarts avant sort en miroir, comme dans la bibliothèque.
import T from './troupe.js';
import A from '../personnages/avatar.js';
import N from './avatar_naufrage.js';
import I from '../personnages/avatar_icones.js';
import X from './avatar_exemples.js';
import R from './noms_personnages.js';

const CADRE = [0, 0, 48, 64];
const grand = body => `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="64" viewBox="0 0 48 64">${body}</svg>`;
const VUES = new Set(['face', 'avant', 'dos']);

// Les exemples publiés : ceux qui ne portent pas de tenue de saison (les deux derniers restent sur les planches)
const PUBLIES = X.EXEMPLES.map((o, i) => ({ o, i })).filter(({ o }) => !Object.values(o.accessoires || {}).some(a => A.ACCESSOIRES[a.id].saison));
const memo = f => { let v; return () => (v ??= f()); };
const KITS = Object.fromEntries(PUBLIES.map(({ o, i }) => [i + 1, {
  choix: A.verifier(o),
  avatar: memo(() => A.avatar(o, { uid: `a${i}` })),
  naufrage: memo(() => N.avatarNaufrage(o, { uid: `a${i}` })),
  expressions: i === 0
}]));

// Ce qu'on peut demander : les exemples (numéro -> choix), leurs poses (nom -> images), les expressions (exemple 1
// seulement, pas en naufragé), les icônes des objets
export const EXEMPLES = Object.fromEntries(Object.entries(KITS).map(([k, e]) => [k, { choix: e.choix }]));
export const POSES = Object.fromEntries(X.POSES.map(([pose, , , k]) => [pose, k]));
export const EXPRESSIONS = T.EXPRS;
export const ICONES = Object.keys(I.ICONES);

function dessin(numero, naufrage, pose, n) {
  const e = KITS[numero];
  if (!e) throw new Error(`exemple inconnu : ${numero} (${Object.keys(KITS).join(', ')})`);
  const c = naufrage ? e.naufrage() : e.avatar();
  let body, images, laPose;
  const m = /^expr_([a-z]+)$/.exec(pose);
  if (m && e.expressions && !naufrage) {
    if (!T.EXPRS.includes(m[1])) throw new Error(`expression inconnue : ${m[1]} (${T.EXPRS.join(', ')})`);
    images = T.IMAGES.repos; laPose = 'expr';
    if (!(n >= 1 && n <= images)) throw new Error(`image ${n} : de 1 à ${images}`);
    body = T.frame(c, 'front', 'repos', n - 1, m[1]);
  } else {
    const p = X.POSES.find(([x]) => x === pose);
    if (!p) throw new Error(`pose inconnue : ${pose} (${X.POSES.map(([x]) => x).join(', ')}${e.expressions && !naufrage ? ', expr_<expression>' : ''})`);
    const [, view, kit, k, geste] = p;
    images = k; laPose = pose.split('_')[1];
    if (!(n >= 1 && n <= images)) throw new Error(`image ${n} : de 1 à ${images}`);
    body = X.dessin(geste ? { ...c, geste } : c, view, kit, n - 1);
  }
  const cle = `${X.nom(numero - 1)}${naufrage ? '-naufrage' : ''}`;
  const fichier = `personnages/avatar/${cle}/${cle}_${pose}_${n}.svg`;
  let svg = grand(body);
  if (R.MIROIR_KIT.test(fichier)) svg = R.miroir(svg);
  return { svg, cadre: CADRE, ms_par_image: images > 1 ? R.vitessePersonnage(fichier.replace(/_\d+\.svg$/, ''), VUES.has(pose.split('_')[0]) ? laPose : 'expr') ?? null : null };
}

// Un exemple d'avatar (1 à 12), une pose (POSES, ou expr_<expression> pour l'exemple 1), image n
export const exemple = (numero, pose, n = 1) => dessin(numero, false, pose, n);
// Sa version naufragée (jusqu'au Campement)
export const exempleNaufrage = (numero, pose, n = 1) => dessin(numero, true, pose, n);
// L'icône d'un objet de l'avatar (bonnet, echarpe, manteau…), 32 × 32
export function objetIcone(id) {
  if (!I.ICONES[id]) throw new Error(`objet inconnu : ${id} (${ICONES.join(', ')})`);
  const svg = I.icone(id);
  return { svg, cadre: svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number), ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const [k, e] of Object.entries(KITS)) for (const naufrage of [false, true]) {
    const cle = `${X.nom(k - 1)}${naufrage ? '-naufrage' : ''}`, fonction = naufrage ? 'exempleNaufrage' : 'exemple';
    for (const [pose, , , images] of X.POSES) for (let n = 1; n <= images; n++) out.push({ fichier: `personnages/avatar/${cle}/${cle}_${pose}_${n}.svg`, fonction, args: [+k, pose, n] });
    if (e.expressions && !naufrage) for (const x of T.EXPRS) for (let n = 1; n <= T.IMAGES.repos; n++) out.push({ fichier: `personnages/avatar/${cle}/${cle}_expr_${x}_${n}.svg`, fonction, args: [+k, `expr_${x}`, n] });
  }
  for (const id of ICONES) out.push({ fichier: `personnages/objets/${id}_icone.svg`, fonction: 'objetIcone', args: [id] });
  return out;
}
