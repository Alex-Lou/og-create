// Le générateur des objets, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié dans
// la bibliothèque (generateur/objets.mjs). Les objets de la boutique (un fichier par calque, par variante et par image)
// et la torche de bois flotté. Chaque fonction rend { svg, cadre, ms_par_image } : le SVG complet, identique à l'octet au
// fichier de la bibliothèque (le fichier y ajoute un saut de ligne ; verif_generateurs.mjs le vérifie). Les cadres des
// objets de la boutique, mesurés à la génération, viennent de l'index de la bibliothèque (batiments.json).
import { SHOP_ITEMS, paliers, calques } from './objets_boutique.mjs';
import T from './torche.js';
import batiments from '../bibliotheque/svg/batiments/batiments.json' with { type: 'json' };

const K = 1.25; // la bibliothèque est à l'échelle du jeu × 1,25
const r2 = n => Math.round(n * 100) / 100;
const svgOf = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(' ')}">${body}</svg>`;
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
const SITE = Object.fromEntries(Object.entries(SHOP_ITEMS).flatMap(([site, ids]) => ids.map(id => [id, site])));

// Les objets de la boutique : id -> { batiment, paliers (I à VII), calques (combien), derriere (par calque) }
export const OBJETS = Object.fromEntries(Object.entries(SITE).map(([id, site]) => {
  const o = batiments.objets[id];
  return [id, { batiment: site, paliers: paliers(site, id).levels, calques: o.calques.length, derriere: o.calques.map(c => c.derriere) }];
}));
// Les états de la torche, et ses images
export const TORCHE = { allumee: 3, eteinte: 1, ms_par_image: 111 };

const cache = new Map();
const calquesDe = id => { if (!SITE[id]) throw new Error(`objet inconnu : ${id} (${Object.keys(SITE).join(', ')})`); if (!cache.has(id)) cache.set(id, calques(SITE[id], id)); return cache.get(id); };

// Un objet de la boutique : son calque (1, 2…), au palier donné (1 à 7), image n (pour un calque animé) ; posé à sa place
// par le jeu (batiments.json, place), derrière le bâtiment si derriere
export function objet(id, calque = 1, palier, image = 1) {
  const cs = calquesDe(id), c = cs[calque - 1];
  if (!c) throw new Error(`${id} : calque ${calque} (de 1 à ${cs.length})`);
  if (!c.levels.includes(+palier)) throw new Error(`${id} : palier ${palier} (${c.levels.map(l => ROMAN[l - 1]).join(', ')})`);
  const vr = c.variante(+palier), i = c.variantes.indexOf(vr);
  if (!(image >= 1 && image <= vr.frames.length)) throw new Error(`${id} : image ${image} (de 1 à ${vr.frames.length})`);
  const cad = batiments.objets[id].calques[calque - 1].cadre, cadre = Array.isArray(cad[0]) ? cad[i] : cad;
  return { svg: svgOf(cadre, `<g transform="scale(${K})">${vr.frames[image - 1]}</g>`), cadre, ms_par_image: c.layer.n ? Math.round(1000 / c.layer.fps) : null };
}

const CADRE_TORCHE = [-50, -115, 100, 140]; // le cadre des créations posées sur une case
// La torche : 'allumee' (image 1 à 3, en boucle) ou 'eteinte' ; torcheIcone : 32 × 32, pour la boutique
export function torche(etat = 'allumee', image = 1) {
  if (etat !== 'allumee' && etat !== 'eteinte') throw new Error(`torche : état ${etat} (allumee ou eteinte)`);
  if (!(image >= 1 && image <= TORCHE[etat])) throw new Error(`torche ${etat} : image ${image} (de 1 à ${TORCHE[etat]})`);
  return { svg: svgOf(CADRE_TORCHE, T.torche(etat, image - 1)), cadre: CADRE_TORCHE, ms_par_image: etat === 'allumee' ? TORCHE.ms_par_image : null };
}
export function torcheIcone() {
  return { svg: svgOf([0, 0, 32, 32], T.torcheIcone()), cadre: [0, 0, 32, 32], ms_par_image: null };
}
// La lumière de nuit de la torche, aux valeurs des créations du jeu : [u, v, z, rayon, couleur]
export const LUMIERE_TORCHE = T.LUMIERE;

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [];
  for (const [id, site] of Object.entries(SITE)) {
    for (const c of calquesDe(id)) for (const vr of c.variantes) vr.frames.forEach((_, f) => out.push({ fichier: `batiments/objets/${site}/${id}/${c.nom(vr, f)}.svg`, fonction: 'objet', args: [id, c.k + 1, vr.from, f + 1] }));
  }
  for (let n = 1; n <= TORCHE.allumee; n++) out.push({ fichier: `decor/defenses/torche_allumee_${n}.svg`, fonction: 'torche', args: ['allumee', n] });
  out.push({ fichier: 'decor/defenses/torche_eteinte.svg', fonction: 'torche', args: ['eteinte', 1] });
  out.push({ fichier: 'decor/defenses/torche_icone.svg', fonction: 'torcheIcone', args: [] });
  return out;
}
