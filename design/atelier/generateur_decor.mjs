// Le générateur du décor iso, pour le jeu et pour l'outil (generer.mjs) : build_bundle.js en fait un module ESM, publié
// dans la bibliothèque (generateur/decor.mjs). Les créations d'île, les lieux remarquables, les gisements des climats,
// les annexes des bâtiments, les enseignes, les îlots et les bateaux. decor(categorie, nom, n) rend { svg, cadre,
// ms_par_image } : le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute un saut de
// ligne ; verif_generateurs.mjs le vérifie). preview_decor.mjs écrit la bibliothèque avec cette même fonction.
// L'inventaire (decor_liste.mjs) se dessine en entier au premier appel, puis reste en mémoire.
import { inventaire } from './decor_liste.mjs';

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

// Tout ce que la famille sait dessiner, avec le fichier de la bibliothèque qui lui correspond (sous svg/)
export function liste() {
  return tout().flatMap(it => it.frames.map((_, k) => ({ fichier: fichier(it, k + 1), fonction: 'decor', args: [it.cat, it.base, k + 1] })));
}
