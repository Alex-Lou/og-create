// Registre en une seule liste : ordre des planches et recherche par famille. Calcul pur, sans état.
import { normalize } from '@/utils/search';

// discovered : noms dans l'ordre de découverte ; unexplored : { nom: découvertes encore possibles }
// → { fertile, spent } : d'abord ce qui peut encore donner (le plus récent en tête), puis les épuisés
export function orderRegistry(discovered, unexplored = {}) {
  const newestFirst = [...discovered].reverse();
  return {
    fertile: newestFirst.filter(name => unexplored[name] > 0),
    spent: newestFirst.filter(name => !(unexplored[name] > 0))
  };
}

// Famille de chaque élément connu
export function familyIndex(categories) {
  const index = {};
  for (const [family, names] of Object.entries(categories)) for (const name of names) index[name] = family;
  return index;
}

// Taper le nom d'une famille (« chimie », « créa ») liste ses éléments découverts, dans l'ordre de découverte
export function familyMatches(categories, discovered, query) {
  const q = normalize(String(query).trim());
  if (q.length < 3) return [];
  const known = new Set(discovered);
  const matching = Object.keys(categories).filter(family =>
    normalize(family.replace(/_/g, ' ')).split(/\s+/).some(word => word.startsWith(q))
  );
  if (!matching.length) return [];
  const wanted = new Set(matching.flatMap(family => categories[family]));
  return discovered.filter(name => wanted.has(name) && known.has(name));
}
