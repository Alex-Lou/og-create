// Progression : les familles découvertes débloquent les emplacements de fusion (eraOf),
// le nombre de découvertes fait évoluer lentement le fond vivant (stageOf).

export const ERA_NAMES = ['Poussière d’étoiles', 'Molécules', 'Réactions', 'Courants', 'Vie'];
export const MAX_ERA = ERA_NAMES.length;

// Couleur de chaque famille (RGB) : cartes, filtres et particules du fond
const FAMILY_COLORS = {
  'Elements Fondamentaux': [196, 181, 253],
  'Matériaux': [251, 191, 36],
  'Phénomènes Naturels': [103, 232, 249],
  'Cosmos': [165, 180, 252],
  'Formations Naturelles': [45, 212, 191],
  'Vie et Créatures': [134, 239, 172],
  'Magie': [244, 114, 182],
  'Créations Humaines': [253, 164, 175]
};
const FALLBACK_COLORS = [[196, 181, 253], [251, 191, 36], [103, 232, 249], [45, 212, 191], [134, 239, 172]];

export function familyColor(name) {
  if (FAMILY_COLORS[name]) return FAMILY_COLORS[name];
  // Famille inconnue : couleur stable dérivée du nom
  let hash = 0;
  for (const char of String(name)) hash = (hash * 31 + char.charCodeAt(0)) | 0;
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export function rgba(color, alpha) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
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
