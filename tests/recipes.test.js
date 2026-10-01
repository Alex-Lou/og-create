import { describe, expect, it } from 'vitest';
import { findRecipe, recipeKey } from '@/utils/recipes';

describe('recettes', () => {
  it('l’ordre des ingrédients ne compte pas', () => {
    expect(recipeKey(['Feu', 'Eau'])).toBe('Eau+Feu');
    expect(findRecipe({ 'Eau+Feu': 'Vapeur' }, ['Feu', 'Eau'])).toBe('Vapeur');
  });
  it('une combinaison inconnue ne donne rien', () => {
    expect(findRecipe({ 'Eau+Feu': 'Vapeur' }, ['Eau', 'Eau'])).toBeNull();
  });
});
