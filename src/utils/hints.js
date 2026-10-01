// Indices calculés depuis les recettes ("A+B" -> résultat) et l'inventaire du joueur. Fonctions pures.

// Jokers : quelques-uns offerts à chaque lancement de l'Épreuve, les suivants s'achètent en écus
export const JOKER_PRICE = 50;
export const FREE_JOKERS = 2;
export const JOKER_TIME = 30;

// Tout ce qui est atteignable depuis l'inventaire, avec la recette qui y mène la première fois
function reachableFrom(recipes, inventory) {
  const known = new Set(inventory);
  const via = new Map();
  const entries = Object.entries(recipes).map(([key, result]) => [key.split('+'), result]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const [parts, result] of entries) {
      if (!known.has(result) && parts.every(p => known.has(p))) {
        known.add(result);
        via.set(result, parts);
        grew = true;
      }
    }
  }
  return via;
}

// Prochaine fusion utile vers l'une des cibles : { ingredients, result }, ou null si aucune n'est atteignable
export function nextStep(recipes, inventory, targets) {
  const have = new Set(inventory);
  const via = reachableFrom(recipes, inventory);
  const target = targets.find(t => via.has(t));
  if (!target) return null;
  // Remonte la chaîne jusqu'à une fusion dont tous les ingrédients sont déjà en main
  let result = target;
  for (;;) {
    const parts = via.get(result);
    const missing = parts.find(p => !have.has(p));
    if (!missing) return { ingredients: [...parts], result };
    result = missing;
  }
}

// Éléments encore inconnus qu'une seule fusion de l'inventaire suffit à créer
export function nearbyDiscoveries(recipes, discovered) {
  const have = new Set(discovered);
  const found = new Set();
  for (const [key, result] of Object.entries(recipes)) {
    if (!have.has(result) && key.split('+').every(p => have.has(p))) found.add(result);
  }
  return [...found].sort();
}

// Pour chaque élément découvert : nombre de recettes qui l'utilisent et donnent un élément encore inconnu
export function unexploredUses(recipes, discovered) {
  const have = new Set(discovered);
  const count = {};
  for (const [key, result] of Object.entries(recipes)) {
    if (have.has(result)) continue;
    for (const part of new Set(key.split('+'))) {
      if (have.has(part)) count[part] = (count[part] || 0) + 1;
    }
  }
  return count;
}

// Recettes déjà à la portée du joueur qui donnent cet élément (ingrédients tous découverts)
export function knownOrigins(recipes, discovered, name) {
  const have = new Set(discovered);
  return Object.entries(recipes)
    .filter(([key, result]) => result === name && key.split('+').every(p => have.has(p)))
    .map(([key]) => key.split('+'));
}
