// Le générateur des chantiers, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM,
// publié dans la bibliothèque (generateur/chantiers.mjs). Chaque fonction rend { svg, cadre, ms_par_image } : le SVG
// complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs
// le vérifie), son cadre et sa vitesse. preview_montage.mjs, preview_cultures.mjs et preview_verger.mjs écrivent la
// bibliothèque avec ces mêmes fonctions.
import { montage, devoilement, echafaudage, ETAPES } from './montage.mjs';
import * as C from './cultures.mjs';
import * as V from './verger.mjs';

const K = 1.25; // la bibliothèque est à l'échelle du jeu × 1,25
const svgOf = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${cadre[2]}" height="${cadre[3]}" viewBox="${cadre.join(' ')}"><g transform="scale(${K})">${body}</g></svg>`;

// Les deux emprises : le cadre du chantier (2 × 2) et celui des grands paliers (3 × 3), × 1,25
export const EMPRISES = { '2x2': { nom: '2 × 2 cases', cadre: [-95, -155, 190, 210] }, '3x3': { nom: '3 × 3 cases', cadre: [-140, -250, 280, 330] } };
export { ETAPES };
// Les parts du temps du chantier qui dure : chaque étape commence à cette part (de 0 à 1) ; à 1, le bâtiment est là
export const PART = { piquets: 0, terrassement: 0.12, fondations: 0.28, charpente: 0.46, murs: 0.64, toit: 0.82 };
// Les vitesses : une étape en boucle, le dévoilement (une fois), une étape du spectacle
export const MS = { etape: 220, devoilement: 110, spectacle: 450 };
export const IMAGES = { etape: 3, devoilement: 4, echafaudage: 3 };

const verifie = (emprise, n, max) => {
  if (!EMPRISES[emprise]) throw new Error(`emprise inconnue : ${emprise} (2x2 ou 3x3)`);
  if (!(n >= 1 && n <= max)) throw new Error(`image ${n} : de 1 à ${max}`);
  return EMPRISES[emprise].cadre;
};

// Une étape du montage : emprise '2x2' | '3x3', étape (ETAPES), image n de 1 à 3
export function etapeDuMontage(emprise, etape, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES.etape);
  if (!ETAPES.includes(etape)) throw new Error(`étape inconnue : ${etape} (${ETAPES.join(', ')})`);
  return { svg: svgOf(cadre, montage(emprise, etape, n - 1)), cadre, ms_par_image: MS.etape };
}
// Le dévoilement du bâtiment fini, image n de 1 à 4 (à jouer une fois, par-dessus le bâtiment)
export function devoilementDuBatiment(emprise, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES.devoilement);
  return { svg: svgOf(cadre, devoilement(emprise, n - 1)), cadre, ms_par_image: MS.devoilement };
}
// L'échafaudage d'évolution : couche 'derriere' (avant le bâtiment) | 'devant' (après lui), image n de 1 à 3
export function echafaudageDEvolution(emprise, couche, n = 1) {
  const cadre = verifie(emprise, +n, IMAGES.echafaudage);
  if (couche !== 'derriere' && couche !== 'devant') throw new Error(`couche inconnue : ${couche} (derriere ou devant)`);
  return { svg: svgOf(cadre, echafaudage(emprise, couche, n - 1)), cadre, ms_par_image: MS.etape };
}

// Les cultures par étapes (cultures.mjs) : une parcelle d'une case, du bêchage à la croissance ; à la fin, pour le blé,
// les carottes et les citrouilles, le champ mûr de l'annexe (decor/annexes/champ/champ_<culture>) prend le relais dans le
// même cadre ; les cultures du potager (laitues, choux, tomates, haricots, fraises, pommes de terre) ont leur étape « mur »
export const CULTURES = { cultures: C.CULTURES, etapes: Object.fromEntries(C.CULTURES.map(c => [c, C.etapesDe(c)])), cadre: C.CADRE.map(v => v * K), images: C.IMAGES };
// Les parts du temps d'une culture qui pousse : chaque étape commence à cette part ; à 1, la culture est mûre (le champ de
// l'annexe, ou l'étape « mur »)
export const PART_CULTURE = { bechage: 0, sillons: 0.15, semis: 0.3, pousses: 0.5, croissance: 0.7, mur: 1 };
export const MS_CULTURE = { etape: 280, spectacle: 450 };
// Une étape d'une culture : culture (CULTURES.cultures), étape (bechage, sillons, semis, pousses, croissance, et mur pour
// les cultures du potager), image n de 1 à 3
export function etapeDeCulture(culture, etape, n = 1) {
  if (!C.CULTURES.includes(culture)) throw new Error(`culture inconnue : ${culture} (${C.CULTURES.join(', ')})`);
  if (!C.etapesDe(culture).includes(etape)) throw new Error(`étape inconnue : ${etape} (${C.etapesDe(culture).join(', ')})`);
  if (!(+n >= 1 && +n <= C.IMAGES)) throw new Error(`image ${n} : de 1 à ${C.IMAGES}`);
  return { svg: svgOf(CULTURES.cadre, C.etape(culture, etape, n - 1)), cadre: CULTURES.cadre, ms_par_image: MS_CULTURE.etape };
}

// Le verger par étapes (verger.mjs) : un arbre fruitier sur une case, du trou au grand arbre chargé de fruits mûrs ; à
// l'échelle de la troupe, dans le cadre d'un décor d'une case (comme les arbres de la bibliothèque)
export const VERGER = { arbres: V.ARBRES, etapes: V.ETAPES, cadre: V.CADRE, images: V.IMAGES };
export const PART_VERGER = { trou: 0, plantation: 0.1, jeune: 0.25, floraison: 0.5, fruits_verts: 0.7, mur: 1 };
export const MS_VERGER = { etape: 300, spectacle: 450 };
// Une étape d'un arbre du verger : arbre (pommier, poirier, cerisier, prunier, abricotier), étape (trou, plantation,
// jeune, floraison, fruits_verts, mur), image n de 1 à 3
export function etapeDuVerger(arbre, etape, n = 1) {
  if (!V.ARBRES.includes(arbre)) throw new Error(`arbre inconnu : ${arbre} (${V.ARBRES.join(', ')})`);
  if (!V.ETAPES.includes(etape)) throw new Error(`étape inconnue : ${etape} (${V.ETAPES.join(', ')})`);
  if (!(+n >= 1 && +n <= V.IMAGES)) throw new Error(`image ${n} : de 1 à ${V.IMAGES}`);
  const c = V.CADRE;
  return { svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${c[2]}" height="${c[3]}" viewBox="${c.join(' ')}">${V.etape(arbre, etape, n - 1)}</svg>`, cadre: c, ms_par_image: MS_VERGER.etape };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const a of V.ARBRES) for (const e of V.ETAPES) for (let n = 1; n <= V.IMAGES; n++) out.push({ fichier: `decor/verger/${a}/verger_${a}_${e}_${n}.svg`, fonction: 'etapeDuVerger', args: [a, e, n] });
  for (const c of C.CULTURES) for (const e of C.etapesDe(c)) for (let n = 1; n <= C.IMAGES; n++) out.push({ fichier: `decor/cultures/${c}/culture_${c}_${e}_${n}.svg`, fonction: 'etapeDeCulture', args: [c, e, n] });
  for (const em of Object.keys(EMPRISES)) {
    const d = `batiments/montage/${em}`;
    for (const e of ETAPES) for (let n = 1; n <= IMAGES.etape; n++) out.push({ fichier: `${d}/montage_${em}_${e}_${n}.svg`, fonction: 'etapeDuMontage', args: [em, e, n] });
    for (let n = 1; n <= IMAGES.devoilement; n++) out.push({ fichier: `${d}/devoilement_${em}_${n}.svg`, fonction: 'devoilementDuBatiment', args: [em, n] });
    for (const c of ['derriere', 'devant']) for (let n = 1; n <= IMAGES.echafaudage; n++) out.push({ fichier: `${d}/echafaudage_${em}_${c}_${n}.svg`, fonction: 'echafaudageDEvolution', args: [em, c, n] });
  }
  return out;
}
