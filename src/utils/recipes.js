// Moteur de craft partagé : une recette est indexée par ses ingrédients triés ("Air+Eau").
export function recipeKey(elements) {
  return [...elements].sort().join('+');
}

// Résultat de la combinaison, ou null s'il n'y a pas de recette
export function findRecipe(recipes, elements) {
  return recipes[recipeKey(elements)] || null;
}
