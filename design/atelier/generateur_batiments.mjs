// Le générateur des bâtiments, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié
// dans la bibliothèque (generateur/batiments.mjs). Les 7 bâtiments à leurs 7 paliers (images animées, et les mêmes
// l'hiver), les trois phases du chantier qui attend, les skins, les pièces rares. Chaque fonction rend { svg, cadre,
// ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de
// ligne ; verif_generateurs.mjs le vérifie). Les dessins sont ceux du jeu (port/src/world) ; les cadres, mesurés à la
// génération, viennent de l'index de la bibliothèque (batiments.json). Les objets de la boutique sont dans
// generateur/objets.mjs, le montage dans generateur/chantiers.mjs.
import { lookAt, artMake, boatOf, boatOffset } from './port/src/world/looks.js';
import { BUILDINGS } from './port/src/world/sprites.js';
import { setHiver } from './port/src/world/iso.js';
import B from '../bibliotheque/svg/batiments/batiments.json' with { type: 'json' };

const K = 1.25;
const r2 = n => Math.round(n * 100) / 100;
const up = body => `<g transform="scale(${K})">${body}</g>`;
const inner = s => s.svg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
const svgOf = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(' ')}">${body}</svg>`;
export const SITES = ['foyer', 'carriere', 'bosquet', 'puits', 'potager', 'atelier', 'ponton'];
// Ce qu'on peut demander : les entrées de l'index (paliers, paliers_hiver, chantier, skins, pieces_rares, teintes)
export const BATIMENTS = { paliers: B.paliers, paliers_hiver: B.paliers_hiver, chantier: B.chantier, skins: B.skins, pieces_rares: B.pieces_rares, teintes: B.teintes };

const site = s => { if (!SITES.includes(s)) throw new Error(`bâtiment inconnu : ${s} (${SITES.join(', ')})`); };
const palierOk = lv => { if (!(lv >= 1 && lv <= 7)) throw new Error(`palier ${lv} : de 1 à 7`); };

// Un bâtiment à son palier (1 à 7), image n, l'été ou l'hiver (les toits sous la neige)
export function palier(s, lv, n = 1, hiver = false) {
  site(s); palierOk(lv);
  if (typeof hiver !== 'boolean') throw new Error(`hiver : ${hiver} (true ou false)`);
  const base = `${s}_palier${lv}${hiver ? '_hiver' : ''}`, e = (hiver ? B.paliers_hiver : B.paliers)[base];
  const images = e.fichiers.length;
  if (!(n >= 1 && n <= images)) throw new Error(`${base} : image ${n} (de 1 à ${images})`);
  setHiver(hiver);
  try {
    const look = lookAt(s, lv), b = look.make(undefined);
    let boat = '';
    if (look.boat) { const [dx, dy] = boatOffset(look.boat); boat = `<g transform="translate(${dx} ${dy})">${inner(boatOf(undefined))}</g>`; }
    const body = up(inner(b) + look.anims.map(a => inner(a.frame((n - 1) % a.n))).join('') + boat);
    return { svg: svgOf(e.cadre, body), cadre: e.cadre, ms_par_image: e.ms_par_image ?? null };
  } finally { setHiver(false); }
}
// Le chantier qui attend : phase 1 (plan pas trouvé), 2 (plan trouvé), 3 (prêt à bâtir)
export function chantier(phase) {
  const make = BUILDINGS.chantier[phase - 1];
  if (!make) throw new Error(`chantier : phase ${phase} (1, 2 ou 3)`);
  const cadre = B.chantier.cadres[phase - 1];
  return { svg: svgOf(cadre, up(inner(make()))), cadre, ms_par_image: null };
}
// Un skin à un palier (seulement les paliers où il change le dessin : BATIMENTS.skins[skin].fichiers)
export function skin(id, lv) {
  const e = B.skins[id];
  if (!e) throw new Error(`skin inconnu : ${id} (${Object.keys(B.skins).join(', ')})`);
  const i = e.fichiers.findIndex(f => f.endsWith(`_palier${lv}.svg`));
  if (i < 0) throw new Error(`${id} : palier ${lv} (le skin change le dessin aux paliers ${e.fichiers.map(f => f.match(/palier(\d)/)[1]).join(', ')})`);
  const cadre = e.cadres[i];
  return { svg: svgOf(cadre, up(inner(artMake(e.batiment, lv, id)()))), cadre, ms_par_image: null };
}
// Une pièce rare (le bâtiment teinté et son accessoire, image 1) à un palier
export function pieceRare(id, lv) {
  const e = B.pieces_rares[id];
  if (!e) throw new Error(`pièce rare inconnue : ${id} (${Object.keys(B.pieces_rares).join(', ')})`);
  palierOk(lv);
  const cadre = e.cadres[lv - 1];
  return { svg: svgOf(cadre, up(inner(artMake(e.batiment, lv, id)()))), cadre, ms_par_image: null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  const out = [], f = rel => `batiments/${rel}`;
  for (const hiver of [false, true]) for (const s of SITES) for (let lv = 1; lv <= 7; lv++) {
    const e = (hiver ? B.paliers_hiver : B.paliers)[`${s}_palier${lv}${hiver ? '_hiver' : ''}`];
    e.fichiers.forEach((x, k) => out.push({ fichier: f(x), fonction: 'palier', args: [s, lv, k + 1, hiver] }));
  }
  B.chantier.fichiers.forEach((x, k) => out.push({ fichier: f(x), fonction: 'chantier', args: [k + 1] }));
  for (const [id, e] of Object.entries(B.skins)) e.fichiers.forEach(x => out.push({ fichier: f(x), fonction: 'skin', args: [id, +x.match(/palier(\d)/)[1]] }));
  for (const [id, e] of Object.entries(B.pieces_rares)) e.fichiers.forEach((x, k) => out.push({ fichier: f(x), fonction: 'pieceRare', args: [id, k + 1] }));
  return out;
}
