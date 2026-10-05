// Noms choisis par le joueur (enseignes, bâtiments, quartiers) : mêmes règles que services/naming.js du serveur.
// Lettres (accents compris) et chiffres, un espace, une apostrophe ou un tiret seulement entre deux d'entre eux ; de 2 à
// max caractères ; espaces en trop retirés.
export const NAME_MAX = 22;
const patterns = new Map();
const patternOf = max => {
  if (!patterns.has(max)) patterns.set(max, new RegExp(`^[\\p{L}\\p{N}](?:[\\p{L}\\p{N}]|[ '’-](?=[\\p{L}\\p{N}])){1,${max - 1}}$`, 'u'));
  return patterns.get(max);
};

// Nom saisi, nettoyé, ou null s'il ne convient pas
export function cleanName(raw, max = NAME_MAX) {
  const name = String(raw ?? '').slice(0, 64).normalize('NFC').trim().replace(/\s+/g, ' ');
  return patternOf(max).test(name) ? name : null;
}
