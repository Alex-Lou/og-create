import { describe, it, expect } from 'vitest';
import { paintColor, featheredVeil, FEATHER } from '@/world/terrain';
import { fogPuffs, clearingOf } from '@/world/voile';

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
  it('le voile s\'épaissit avec la distance à la terre dégagée, sur FEATHER cases', () => {
    const v = featheredVeil(M, veil);
    expect(v(5, 4)).toBe(0);
    expect(v(6, 4)).toBeCloseTo(0.31);
    for (let x = 6; x < N - 1; x++) expect(v(x, 4)).toBeLessThan(v(x + 1, 4));
    expect(v(5 + FEATHER, 4)).toBeLessThan(0.62);
    expect(v(5 + FEATHER, 4)).toBeGreaterThan(0.6);
  });

  it('lu sur un carré, le voile est le même que lu sur toute l\'île', () => {
    const all = featheredVeil(M, veil), part = featheredVeil(M, veil, { x0: 7, y0: 2, x1: 9, y1: 5 });
    for (let x = 7; x <= 9; x++) for (let y = 2; y <= 5; y++) expect(part(x, y)).toBe(all(x, y));
  });

  it('le Voile recule devant les lumières : une nappe s\'efface tout près, pas au loin', () => {
    expect(clearingOf([])).toBe(null);
    const fade = clearingOf([{ x: 0, y: 0, r: 20, k: 1 }]);
    expect(fade({ x: 0, y: 0 })).toBe(0);
    expect(fade({ x: 30, y: 0 })).toBeGreaterThan(0);
    expect(fade({ x: 30, y: 0 })).toBeLessThan(1);
    expect(fade({ x: 200, y: 0 })).toBe(1);
  });

  it('les nappes ne se posent que sur les terres voilées, plus petites et plus légères au bord', () => {
    const puffs = fogPuffs(M, veil, x => (x > 5 ? 'est' : 'ouest'));
    expect(puffs.length).toBeGreaterThan(0);
    expect(puffs.every(p => p.zone === 'est')).toBe(true);
    const edge = [...puffs].sort((a, b) => a.a - b.a);
    expect(edge[0].a).toBeLessThan(edge[edge.length - 1].a);
  });
});
