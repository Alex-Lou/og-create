// Le générateur du décor iso, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié
// dans la bibliothèque (generateur/decor.mjs). Les créations d'île, les lieux remarquables, les gisements des climats,
// les annexes des bâtiments, les enseignes, les îlots et les bateaux. decor(categorie, nom, n) rend { svg, cadre,
// ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de
// ligne ; verif_generateurs.mjs le vérifie). preview_decor.mjs écrit la bibliothèque avec cette même fonction.
// L'inventaire (decor_liste.mjs) se dessine en entier au premier appel, puis reste en mémoire. Et aussi : le camp des
// naufragés (camp(objet, n)), les ruines des Anciens (ruine(objet, n)), le lot M (element(nom, n) : le bâtiment embrumé,
// la cage aux poules et l'œuf, les signes d'Anya, l'éclat du souvenir et les sceaux ; crabe(pose)). Leurs cadres, mesurés
// à la génération, viennent des index de la bibliothèque.
import { inventaire } from './decor_liste.mjs';
import { CAMP } from './camp.mjs';
import { RUINES } from './ruines.mjs';
import LM from './lot_m_liste.js';
import N from './noms_betes.js';
import campJson from '../bibliotheque/svg/decor/camp/camp.json' with { type: 'json' };
import ruinesJson from '../bibliotheque/svg/decor/ruines/ruines.json' with { type: 'json' };
import embrumeJson from '../bibliotheque/svg/decor/embrume/embrume.json' with { type: 'json' };
import poulesJson from '../bibliotheque/svg/decor/camp/poules/poules.json' with { type: 'json' };
import signesJson from '../bibliotheque/svg/decor/signes/signes.json' with { type: 'json' };
import souvenirJson from '../bibliotheque/svg/decor/souvenir/souvenir.json' with { type: 'json' };
import crabeJson from '../bibliotheque/svg/animaux/mer/crabe/crabe.json' with { type: 'json' };

const r2 = n => Math.round(n * 100) / 100;
const svgOf = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.map(r2).join(' ')}">${body}</svg>`;
let inv = null;
const tout = () => (inv ??= inventaire());
const fichier = (it, n) => `decor/${it.dir}/${it.frames.length > 1 ? `${it.base}_${n}` : it.base}.svg`;
const vitesse = it => (it.frames.length > 1 && it.ms ? it.ms : null);

// Ce qu'on peut demander : par catégorie, chaque dessin, son nom, ses images, son cadre, sa vitesse, et ce que l'index de
// la bibliothèque dit de plus (lumière, variante du jeu, cadre du nom des enseignes…)
export function decors() {
  const out = {};
  for (const it of tout()) (out[it.cat] ??= {})[it.base] = { nom: it.label, images: it.frames.length, cadre: it.frame.map(r2), ms_par_image: vitesse(it), ...it.meta };
  return out;
}

// Un dessin du décor : catégorie (creations, lieux, gisements, annexes, enseignes, ilots), son nom (decors()), image n
export function decor(categorie, nom, n = 1) {
  const its = tout().filter(i => i.cat === categorie);
  if (!its.length) throw new Error(`catégorie inconnue : ${categorie} (${[...new Set(tout().map(i => i.cat))].join(', ')})`);
  const it = its.find(i => i.base === nom);
  if (!it) throw new Error(`${categorie} : ${nom} inconnu (${its.map(i => i.base).join(', ')})`);
  if (!(n >= 1 && n <= it.frames.length)) throw new Error(`${nom} : image ${n} (de 1 à ${it.frames.length})`);
  const cadre = it.frame.map(r2);
  return { svg: svgOf(it.frame, it.frames[n - 1]), cadre, ms_par_image: vitesse(it) };
}

// ---- le camp des naufragés et les ruines des Anciens : dessins de camp.mjs et ruines.mjs, à l'échelle × 1,25 ----
const K = 1.25;
const isoSvg = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(' ')}"><g transform="scale(${K})">${body}</g></svg>`;
const piece = (table, index, quoi) => (objet, n = 1) => {
  const a = table[objet], e = index.objets[objet];
  if (!a || !e) throw new Error(`${quoi} inconnu : ${objet} (${Object.keys(table).join(', ')})`);
  if (!(n >= 1 && n <= a.n)) throw new Error(`${objet} : image ${n} (de 1 à ${a.n})`);
  return { svg: isoSvg(e.cadre, a.draw(n - 1)), cadre: e.cadre, ms_par_image: a.n > 1 ? e.ms ?? null : null };
};
// Un objet du camp (l'épave, le coin d'un maître dans un état, un objet, la tente, le hamac), image n
export const camp = piece(CAMP, campJson, 'objet du camp');
// Une ruine des Anciens, image n
export const ruine = piece(RUINES, ruinesJson, 'ruine');
export const CAMP_ET_RUINES = { camp: campJson.objets, ruines: ruinesJson.objets };

// ---- le lot M : le cadre et la vitesse de chaque fichier, lus dans les index ----
const meta = new Map();
const lire = (dir, json) => {
  const walk = v => {
    if (!v || typeof v !== 'object') return;
    if (v.cadre && v.fichiers) {
      const f = v.fichiers, ms = v.ms_par_image ?? null;
      if (Array.isArray(f)) f.forEach(x => meta.set(`${dir}/${x}`, { cadre: v.cadre, ms }));
      else for (const [etat, xs] of Object.entries(f)) xs.forEach(x => meta.set(`${dir}/${x}`, { cadre: etat === 'eteint' && v.cadre_eteint ? v.cadre_eteint : v.cadre, ms: etat === 'eteint' ? null : ms }));
    } else Object.values(v).forEach(walk);
  };
  walk(json);
};
lire('decor/embrume', embrumeJson); lire('decor/camp/poules', poulesJson); lire('decor/signes', signesJson); lire('decor/souvenir', souvenirJson); lire('animaux/mer/crabe', crabeJson);
const plat = (cadre, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${r2(cadre[2])}" height="${r2(cadre[3])}" viewBox="${cadre.join(' ')}">${body}</svg>`;
const fichierElement = (g, n) => `${g.dir}/${g.images.length > 1 ? `${g.nom}_${n}` : g.nom}.svg`;
// Un élément du lot M (embrume_2x2, embrume_2x2_guerison, embrume_nuage, reparer_icone, cage_poules_coincee, oeuf,
// fleurs_ouverture, lucioles_rassemblees, eclat, arrivee, sceau_<astre>_allume…), image n
export const ELEMENTS = LM.GROUPES.map(g => g.nom);
export function element(nom, n = 1) {
  const g = LM.GROUPES.find(x => x.nom === nom);
  if (!g) throw new Error(`élément inconnu : ${nom} (${ELEMENTS.join(', ')})`);
  if (!(n >= 1 && n <= g.images.length)) throw new Error(`${nom} : image ${n} (de 1 à ${g.images.length})`);
  const m = meta.get(fichierElement(g, n));
  return { svg: plat(m.cadre, g.images[n - 1]()), cadre: m.cadre, ms_par_image: g.images.length > 1 ? m.ms : null };
}
// Le crabe de la Grève, de profil (pose : marche1, marche2, repos, clignement, joie)
const fichierCrabe = p => N.nomBete(`${LM.CRABE.dir}/crabe_${p}.svg`);
export function crabe(pose) {
  if (!LM.CRABE.poses.includes(pose)) throw new Error(`crabe : pose ${pose} (${LM.CRABE.poses.join(', ')})`);
  const m = meta.get(fichierCrabe(pose));
  return { svg: plat(m.cadre, LM.CRABE.dessin(pose)), cadre: m.cadre, ms_par_image: /\d$/.test(pose) ? N.vitesseBete('animaux/mer/crabe', 'marche') : null };
}

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return [
    ...tout().flatMap(it => it.frames.map((_, k) => ({ fichier: fichier(it, k + 1), fonction: 'decor', args: [it.cat, it.base, k + 1] }))),
    ...Object.entries(campJson.objets).flatMap(([k, e]) => e.fichiers.map((f, i) => ({ fichier: `decor/camp/${f}`, fonction: 'camp', args: [k, i + 1] }))),
    ...Object.entries(ruinesJson.objets).flatMap(([k, e]) => e.fichiers.map((f, i) => ({ fichier: `decor/ruines/${f}`, fonction: 'ruine', args: [k, i + 1] }))),
    ...LM.GROUPES.flatMap(g => g.images.map((_, i) => ({ fichier: fichierElement(g, i + 1), fonction: 'element', args: [g.nom, i + 1] }))),
    ...LM.CRABE.poses.map(p => ({ fichier: fichierCrabe(p), fonction: 'crabe', args: [p] }))
  ];
}
