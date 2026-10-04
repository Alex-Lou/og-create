import { describe, expect, it } from 'vitest';
import { familyIndex, sortFamilies } from '@/utils/eras';

describe('familles', () => {
  const categories = { Matériaux: ['Lave', 'Vapeur'], 'Elements Fondamentaux': ['Eau', 'Feu', 'Terre', 'Air'] };
  it('retrouve la famille de chaque élément', () => {
    expect(familyIndex(categories).Lave).toBe('Matériaux');
    expect(familyIndex(categories).Inconnu).toBeUndefined();
  });
  it('range les familles dans l’ordre du registre', () => {
    expect(Object.keys(sortFamilies(categories))).toEqual(['Elements Fondamentaux', 'Matériaux']);
  });
});
