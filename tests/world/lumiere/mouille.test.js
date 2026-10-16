import { describe, it, expect } from 'vitest';
import { wetKinds, darkOf } from '@/world/lumiere/mouille';

// Le sol mouillé : ce qui se mouille, et combien il fonce
describe('le sol mouillé', () => {
  // une petite île : herbe, chemin, sable, eau douce, et la mer autour
  const rows = ['~~~~', '~gp~', '~sw~', '~~~~'];
  const M = { n: 4, land: (x, y) => rows[y][x] !== '~', ground: (x, y) => rows[y][x] };
  it('mouille l’herbe, la terre et les chemins, jamais la mer ni l’eau douce', () => {
    const k = wetKinds(M);
    expect([k[5], k[6], k[9], k[10]]).toEqual([1, 3, 2, 0]);
    expect(k[0]).toBe(0);
    expect(wetKinds(M)).toBe(k);
  });
  it('fonce avec le mouillé, l’herbe moins que la terre et les chemins, et rien une fois sec', () => {
    expect(darkOf(0, 1)).toBe(0);
    expect(darkOf(1, 1)).toBeLessThan(darkOf(1, 2));
    expect(darkOf(1, 2)).toBeLessThan(darkOf(1, 3));
    expect(darkOf(0.5, 3)).toBeCloseTo(darkOf(1, 3) / 2);
    expect(darkOf(3, 3)).toBe(darkOf(1, 3));
  });
  // (le pavé : choix de l'auteur, 16 oct. ; il ne boit pas l'eau, il luit)
  it('un chemin pavé est à part : il fonce moins que l’herbe', () => {
    const P = { ...M, isPaved: (x, y) => x === 2 && y === 1 };
    expect(wetKinds(P)[6]).toBe(4);
    expect(darkOf(1, 4)).toBeLessThan(darkOf(1, 1));
    expect(darkOf(1, 4)).toBeGreaterThan(0);
  });
});
