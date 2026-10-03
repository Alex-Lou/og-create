import { describe, expect, it } from 'vitest';
import { familyIndex, familyMatches, orderRegistry } from '@/utils/registry';

describe('registre en une liste', () => {
  const discovered = ['Eau', 'Feu', 'Terre', 'Air', 'Vapeur', 'Lave'];
  it('met d\'abord ce qui peut encore donner, le plus récent en tête, puis les épuisés', () => {
    const { fertile, spent } = orderRegistry(discovered, { Eau: 3, Feu: 1, Lave: 2, Air: 0 });
    expect(fertile).toEqual(['Lave', 'Feu', 'Eau']);
    expect(spent).toEqual(['Vapeur', 'Air', 'Terre']);
  });
  it('n\'oublie et ne duplique aucun élément', () => {
    const { fertile, spent } = orderRegistry(discovered, { Feu: 4 });
    expect([...fertile, ...spent].sort()).toEqual([...discovered].sort());
  });
  const categories = { 'Elements Fondamentaux': ['Eau', 'Feu', 'Terre', 'Air'], Matériaux: ['Lave', 'Vapeur', 'Verre'] };
  it('retrouve la famille de chaque élément', () => {
    expect(familyIndex(categories).Lave).toBe('Matériaux');
  });
  it('liste une famille quand on tape son nom, sans accent ni majuscule', () => {
    expect(familyMatches(categories, discovered, 'mater')).toEqual(['Vapeur', 'Lave']);
    expect(familyMatches(categories, discovered, 'fondam')).toEqual(['Eau', 'Feu', 'Terre', 'Air']);
    expect(familyMatches(categories, discovered, 'ma')).toEqual([]);
    expect(familyMatches(categories, discovered, 'xyz')).toEqual([]);
  });
});
