// Le patchwork de l'illustration d'une page (pendu) : 9 pièces, découvertes dans un ordre propre à la page.
export const PATCHES = 9;

// Ordre stable des pièces pour une page : mélange déterministe tiré de son identifiant
export function patchOrder(id, n = PATCHES) {
  let seed = 0;
  for (const char of String(id)) seed = (seed * 31 + char.charCodeAt(0)) >>> 0;
  const order = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) >>> 0;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

// Pièces visibles : aucune avant la première bonne lettre, toutes une fois le mot trouvé,
// sinon à proportion des lettres trouvées (au moins une, jamais toutes)
export function patchCount(hangman, n = PATCHES) {
  if (!hangman || !hangman.emoji) return 0;
  if (hangman.name) return n;
  return Math.min(n - 1, Math.max(1, Math.round(hangman.share * n)));
}

// Indices des pièces visibles (0 à 8, ligne par ligne)
export function shownPatches(id, hangman, n = PATCHES) {
  return new Set(patchOrder(id, n).slice(0, patchCount(hangman, n)));
}
