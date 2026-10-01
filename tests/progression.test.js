import { describe, expect, it } from 'vitest';
import { findNewlyUnlocked, isConditionMet } from '@/utils/achievementChecker';
import { eraOf, populationFor, slotCountForEra, sortFamilies, stageOf } from '@/utils/eras';
import { roman } from '@/utils/roman';

describe('succès', () => {
  it('les clauses && demandent toutes les découvertes', () => {
    const condition = "this.discoveredElements.includes('Acier') && this.discoveredElements.includes('Bronze')";
    expect(isConditionMet(condition, ['Acier'])).toBe(false);
    expect(isConditionMet(condition, ['Acier', 'Bronze'])).toBe(true);
  });
  it('n’annonce que les succès nouveaux et mérités', () => {
    const list = [
      { name: 'A', unlocked: false, condition: 'this.discoveredElements.length >= 2' },
      { name: 'B', unlocked: true, condition: 'this.discoveredElements.length >= 1' },
      { name: 'C', unlocked: false, condition: 'process.exit()' }
    ];
    expect(findNewlyUnlocked(list, ['x', 'y']).map(a => a.name)).toEqual(['A']);
  });
});

describe('ères et Athanor', () => {
  it('les emplacements suivent les familles découvertes', () => {
    expect([1, 2, 3, 4, 9].map(n => slotCountForEra(eraOf(n)))).toEqual([2, 2, 3, 4, 4]);
  });
  it('le fond évolue lentement et sa population reste bornée', () => {
    expect([0, 14, 15, 60, 1000].map(stageOf)).toEqual([1, 1, 2, 3, 5]);
    expect(populationFor(10000)).toBeLessThan(200);
  });
  it('les familles suivent l’ordre du registre', () => {
    expect(Object.keys(sortFamilies({ Légendes: [], 'Elements Fondamentaux': [], Inconnue: [] })))
      .toEqual(['Elements Fondamentaux', 'Légendes', 'Inconnue']);
  });
  it('les chiffres romains', () => {
    expect([1, 4, 9, 14, 39].map(roman)).toEqual(['I', 'IV', 'IX', 'XIV', 'XXXIX']);
  });
});
