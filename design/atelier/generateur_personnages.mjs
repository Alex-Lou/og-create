// Le générateur des personnages au grand format (les maîtres, leurs naufragés, les visiteurs, les nouveaux venus de
// l'épilogue), pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié dans la
// bibliothèque (generateur/personnages.mjs). Chaque fonction rend { svg, cadre, ms_par_image } : le SVG complet,
// identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le
// vérifie), son cadre et sa vitesse. Les poses sont nommées comme dans la bibliothèque (<vue>_<pose>[_<variante>] :
// avant_marche, face_pecher, dos_repos_hiver, avant_marche_content, expr_rire, couche, dort…) ; le trois quarts avant
// sort en miroir, comme dans la bibliothèque. Le premier dessin d'un personnage prépare toutes ses poses.
import T from './troupe.js';
import A from '../personnages/avatar.js';
import D from './dormeurs.js';
import Tn from './tenues.js';
import { CAST } from './naufrages.js';
import Q from './troupe_liste.js';
import R from './noms_personnages.js';

const r2 = n => Math.round(n * 100) / 100;
const svgOf = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(vb[2])}" height="${r2(vb[3])}" viewBox="${vb.join(' ')}">${body}</svg>`;
const CURL = [0, 0, 64, 48];
const VUES = new Set(['face', 'avant', 'dos', 'profil']);
const n2 = [0, 1], nR = [...Array(T.IMAGES.repos).keys()], nM = [...Array(T.IMAGES.marche).keys()];

// Les poses d'un maître ou de son naufragé : [nom, cadre, images]
function posesMaitre(base, c, naufrage) {
  const s = Q.slug(base.name);
  const avecLanterne = !naufrage || s === 'aster' || s === 'rivet';
  const don = !(naufrage && c.sansDon);
  const out = Q.poses(c, naufrage
    ? { travail: don, lanterne: avecLanterne, couverture: Q.VOILE, parapluie: '#8E8A80' }
    : { travail: true, lanterne: true, couverture: Q.COUVERTURES[s] }).map(([pose, , vb, images]) => [pose, vb, images]);
  if (don) out.push([base.action[0], Q.STD, n2.map(n => T.frame(c, base.action[1], 'action', n))]);
  for (const x of T.EXPRS) out.push([`expr_${x}`, Q.STD, nR.map(n => T.frame(c, 'front', 'repos', n, x))]);
  out.push(['dort', D.isCurled(c) ? CURL : Q.STD, n2.map(n => D.sleepFrame(c, n))]);
  for (const x of Q.MOODS[base.name]) out.push([`avant_marche_${x}`, Q.STD, nM.map(n => T.frame(c, 'se', 'marche', n, x))]);
  if (!naufrage) {
    for (const [saison, habiller] of [['hiver', Tn.enHiver], ['pluie', Tn.sousLaPluie]]) {
      const h = habiller(base);
      for (const v of ['front', 'se', 'ne']) {
        out.push([`${Q.VUE[v]}_repos_${saison}`, Q.STD, nR.map(n => T.frame(h, v, 'repos', n))]);
        out.push([`${Q.VUE[v]}_marche_${saison}`, Q.STD, nM.map(n => T.frame(h, v, 'marche', n))]);
      }
    }
  }
  return out;
}

// Les personnages : groupe -> clé -> { dossier, prefixe, poses() } (les poses se dessinent à la première demande)
const memo = f => { let v; return () => (v ??= f()); };
const GROUPES = { maitre: {}, naufrage: {}, visiteur: {}, arrivant: {} };
for (const { base, nau } of CAST) {
  const s = Q.slug(base.name);
  GROUPES.maitre[s] = { dossier: `maitres/${s}`, prefixe: s, poses: memo(() => posesMaitre(base, base, false)) };
  GROUPES.naufrage[s] = { dossier: `naufrages/${s}`, prefixe: `${s}-naufrage`, poses: memo(() => posesMaitre(base, nau, true)) };
}
for (const [groupe, liste, dossier] of [['visiteur', Q.VISITEURS, 'visiteurs'], ['arrivant', Q.ARRIVANTS, 'epilogue']]) {
  for (const p of liste) GROUPES[groupe][p.i] = { dossier: `${dossier}/${p.cle}`, prefixe: p.cle, choix: p.choix, poses: memo(() => Q.poses(A.avatar(p.choix, { uid: p.uid }), p.opts).map(([pose, , vb, images]) => [pose, vb, images])) };
}

// Ce qu'on peut demander : les maîtres (par leur nom sans accent), les naufragés, les visiteurs (1 à 12) et les nouveaux
// venus (1 à 8), avec les choix d'avatar de ces derniers ; poses(groupe, qui) donne leurs poses et leurs images
export const PERSONNAGES = Object.fromEntries(Object.entries(GROUPES).map(([g, t]) => [g, Object.fromEntries(Object.entries(t).map(([k, p]) => [k, p.choix ? { choix: p.choix } : {}]))]));
const prendre = (groupe, qui) => {
  const p = GROUPES[groupe][qui];
  if (!p) throw new Error(`${groupe} inconnu : ${qui} (${Object.keys(GROUPES[groupe]).join(', ')})`);
  return p;
};
export function poses(groupe, qui) {
  return Object.fromEntries(prendre(groupe, qui).poses().map(([pose, , images]) => [pose, images.length]));
}

// Un dessin : le fichier rangé, le miroir du trois quarts avant, la vitesse de la pose
function dessin(groupe, qui, pose, n) {
  const p = prendre(groupe, qui);
  const e = p.poses().find(([x]) => x === pose);
  if (!e) throw new Error(`pose inconnue : ${pose} (${p.poses().map(([x]) => x).join(', ')})`);
  const [, vb, images] = e;
  if (!(n >= 1 && n <= images.length)) throw new Error(`image ${n} : de 1 à ${images.length}`);
  const fichier = `personnages/${p.dossier}/${p.prefixe}_${pose}_${n}.svg`;
  let svg = svgOf(vb, images[n - 1]);
  if (R.MIROIR_KIT.test(fichier)) svg = R.miroir(svg);
  const mots = pose.split('_'), laPose = VUES.has(mots[0]) ? mots[1] : mots[0];
  const id = fichier.replace(/_\d+\.svg$/, '');
  return { fichier, svg, cadre: vb, ms_par_image: images.length > 1 ? R.vitessePersonnage(id, laPose) ?? null : null };
}
const sans = ({ fichier, ...r }) => r;

// Un maître (aster, cannelle, rivet, ondin, sylve, galet, melisse), une pose, image n
export const maitre = (nom, pose, n = 1) => sans(dessin('maitre', nom, pose, n));
// Son naufragé (comme il arrive sur l'île)
export const naufrage = (nom, pose, n = 1) => sans(dessin('naufrage', nom, pose, n));
// Un visiteur (1 à 12)
export const visiteur = (numero, pose, n = 1) => sans(dessin('visiteur', numero, pose, n));
// Un nouveau venu de l'épilogue (1 à 8), en habits de voyage
export const arrivant = (numero, pose, n = 1) => sans(dessin('arrivant', numero, pose, n));

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const [g, t] of Object.entries(GROUPES)) for (const [k, p] of Object.entries(t)) {
    const qui = g === 'visiteur' || g === 'arrivant' ? +k : k;
    for (const [pose, , images] of p.poses()) for (let n = 1; n <= images.length; n++) out.push({ fichier: `personnages/${p.dossier}/${p.prefixe}_${pose}_${n}.svg`, fonction: g, args: [qui, pose, n] });
  }
  return out;
}
