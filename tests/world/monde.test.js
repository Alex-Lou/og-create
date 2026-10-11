import { describe, it, expect } from 'vitest';
import { paintColor, featheredVeil } from '@/world/terrain';
import { fogPuffs } from '@/world/voile';

const lum = hex => [1, 3, 5].reduce((sum, i) => sum + parseInt(hex.slice(i, i + 2), 16), 0);

// Petite île carrée : terre partout, voilée à droite de la colonne 5
const N = 12;
const M = { n: N, land: (x, y) => x >= 0 && y >= 0 && x < N && y < N, surface: () => 0 };
const veil = x => (x > 5 ? 0.62 : 0);

describe('sol peint', () => {
  it('plus de damier : deux cases voisines ne sont pas plus différentes que deux cases de même parité', () => {
    let near = 0, same = 0;
    for (let x = 0; x < 20; x++) {
      near += Math.abs(lum(paintColor('g', 0, x, 3)) - lum(paintColor('g', 0, x + 1, 3)));
      same += Math.abs(lum(paintColor('g', 0, x, 3)) - lum(paintColor('g', 0, x + 2, 3)));
    }
    expect(near).toBeLessThanOrEqual(same);
  });

  it('la teinte est la même pour un même point (les coins partagés se raccordent)', () => {
    expect(paintColor('s', 1, 4.5, 2.5)).toBe(paintColor('s', 1, 4.5, 2.5));
    expect(paintColor('g', 0, 2, 2)).toMatch(/^#[0-9a-f]{6}$/i);
  });
});

describe('brume', () => {
  it('le voile s\'éclaircit sur deux cases au bord d\'une terre dégagée, pas au-delà', () => {
    const v = featheredVeil(M, veil);
    expect(v(5, 4)).toBe(0);
    expect(v(6, 4)).toBeLessThan(v(7, 4));
    expect(v(7, 4)).toBeLessThan(v(9, 4));
    expect(v(9, 4)).toBe(0.62);
  });

  it('les nappes ne se posent que sur les terres voilées, plus petites et plus légères au bord', () => {
    const puffs = fogPuffs(M, veil, x => (x > 5 ? 'est' : 'ouest'));
    expect(puffs.length).toBeGreaterThan(0);
    expect(puffs.every(p => p.zone === 'est')).toBe(true);
    const edge = [...puffs].sort((a, b) => a.a - b.a);
    expect(edge[0].a).toBeLessThan(edge[edge.length - 1].a);
  });
});
