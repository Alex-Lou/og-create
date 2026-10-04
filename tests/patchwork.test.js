import { describe, expect, it } from 'vitest';
import { patchOrder, patchCount, shownPatches, PATCHES } from '../src/book/patchwork';

describe('patchwork du pendu', () => {
  it('un ordre stable, propre à chaque page, qui contient toutes les pièces', () => {
    expect(patchOrder('abc')).toEqual(patchOrder('abc'));
    expect([...patchOrder('abc')].sort()).toEqual([...Array(PATCHES).keys()]);
    expect(patchOrder('abc')).not.toEqual(patchOrder('xyz'));
  });
  it('aucune pièce avant une bonne lettre, toutes une fois le nom trouvé', () => {
    expect(patchCount(null)).toBe(0);
    expect(patchCount({ share: 0.25 })).toBe(0);
    expect(patchCount({ share: 0.01, emoji: '⚡' })).toBe(1);
    expect(patchCount({ share: 0.5, emoji: '⚡' })).toBe(5);
    expect(patchCount({ share: 0.99, emoji: '⚡' })).toBe(8);
    expect(patchCount({ share: 1, emoji: '⚡', name: 'Éclair' })).toBe(9);
    expect(shownPatches('abc', { share: 0.5, emoji: '⚡' }).size).toBe(5);
  });
});
