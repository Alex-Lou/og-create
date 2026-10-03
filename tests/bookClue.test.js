import { describe, it, expect } from 'vitest';
import { clueText } from '../src/book/painter';

// Indice d'une page à portée : les familles des ingrédients, jamais l'élément
describe('clueText', () => {
  it('nomme les familles de deux ingrédients', () => {
    expect(clueText(['Elements Fondamentaux', 'Matériaux'])).toBe('Mêle un élément premier et un matériau.');
  });
  it('dit « un autre » quand une famille revient', () => {
    expect(clueText(['Elements Fondamentaux', 'Elements Fondamentaux'])).toBe('Mêle un élément premier et un autre élément premier.');
  });
  it('accepte trois ingrédients et une famille inconnue', () => {
    expect(clueText(['Flore', 'Cosmos', 'Inconnue'])).toBe('Mêle une plante, un astre du cosmos et un élément.');
  });
});
