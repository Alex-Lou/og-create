// Progression : les familles découvertes débloquent les emplacements de fusion (eraOf),
// le nombre de découvertes fait évoluer lentement le fond vivant (stageOf).

export const ERA_NAMES = ['Poussière d’étoiles', 'Molécules', 'Réactions', 'Courants', 'Vie'];
const MAX_ERA = ERA_NAMES.length;

// Encre de chaque famille (RGB) pour les particules du fond : os, lueur, vert-de-gris et nuances proches
const BONE = [233, 223, 200];
const GOLD = [224, 182, 84];
const VERDIGRIS = [111, 163, 146];
const FAMILY_COLORS = {
  'Elements Fondamentaux': BONE,
  'Matériaux': [201, 176, 138],
  'Chimie': VERDIGRIS,
  'Physique': [180, 196, 206],
  'Phénomènes Naturels': [196, 208, 214],
  'Cosmos': GOLD,
  'Formations Naturelles': [160, 170, 140],
  'Flore': [134, 170, 120],
  'Biologie': [150, 190, 160],
  'Vie et Créatures': [190, 200, 160],
  'Corps et Esprit': [214, 150, 130],
  'Créations Humaines': [214, 190, 150],
  'Histoire': [200, 160, 110],
  'Technologie': [170, 186, 200],
  'Légendes': [240, 212, 136]
};
const FALLBACK_COLORS = [BONE, GOLD, VERDIGRIS];

// Ordre du registre : du plus élémentaire au plus savant (familles inconnues à la fin)
export const FAMILY_ORDER = Object.keys(FAMILY_COLORS);
export function sortFamilies(categories) {
  const rank = name => {
    const i = FAMILY_ORDER.indexOf(name);
    return i === -1 ? FAMILY_ORDER.length : i;
  };
  return Object.fromEntries(Object.entries(categories).sort(([a], [b]) => rank(a) - rank(b)));
}

export function familyColor(name) {
  if (FAMILY_COLORS[name]) return FAMILY_COLORS[name];
  // Famille inconnue : couleur stable dérivée du nom
  let hash = 0;
  for (const char of String(name)) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

// Familles contenant au moins un élément découvert
export function discoveredFamilies(categories, discoveredElements) {
  const discovered = new Set(discoveredElements);
  return Object.keys(categories).filter(name => categories[name].some(element => discovered.has(element)));
}

export function eraOf(familyCount) {
  return Math.max(1, Math.min(MAX_ERA, familyCount));
}

// Ère du fond vivant : suit le nombre de découvertes sur une échelle lente
// (le jeu vise des milliers de recettes : chaque ère se mérite)
const STAGE_THRESHOLDS = [0, 15, 60, 250, 1000];
export function stageOf(discoveredCount) {
  return STAGE_THRESHOLDS.filter(threshold => discoveredCount >= threshold).length;
}

// Population du fond : croissance logarithmique (vivante au début, jamais saturée)
export function populationFor(discoveredCount) {
  return Math.round(24 + 18 * Math.log(1 + discoveredCount / 6));
}

// 2 emplacements, un 3e à l'ère 3, un 4e à l'ère 4 (le jeu accepte jusqu'à 4 ingrédients)
export function slotCountForEra(era) {
  if (era >= 4) return 4;
  if (era >= 3) return 3;
  return 2;
}
