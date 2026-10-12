// Les ponts de la rivière (world/pontRiviere.js) : le sens du passage relie deux rives, un pont de deux rangs n'a de
// garde-corps que sur ses bords, la bosse est symétrique et se raccorde d'une case à l'autre, une lanterne à chaque bout
// qui touche une rive, côté avant.
import { describe, expect, it } from 'vitest';
import { bridgeOf, riseOf, bridgeRise, riverLampsOf } from '@/world/pontRiviere';

// Une petite île : g = rive, w = rivière, k = pont ; chaque ligne est un y
function mapOf(rows) {
  const n = rows.length;
  const ground = (x, y) => (rows[y] && rows[y][x]) || '~';
  return { n, ground, land: (x, y) => ground(x, y) !== '~', surface: () => 2, zone: () => 0 };
}

describe('ponts de la rivière', () => {
  // la rivière coule en y ; un pont d'une case de large la traverse en x (de x = 1 à x = 2)
  const M = mapOf(['gwwg', 'gkkg', 'gwwg']);

  it('le passage relie deux rives, et le pont sait où il commence et finit', () => {
    expect(bridgeOf(M, 1, 1)).toMatchObject({ axis: 'x', start: 1, end: 2, startBank: true, endBank: true, openBack: false, openFront: false });
    expect(bridgeOf(M, 0, 1)).toBeNull();
  });

  it('la bosse est symétrique, au plus haut au milieu, et se raccorde entre deux cases', () => {
    const b = bridgeOf(M, 1, 1);
    expect(riseOf(b, 1.2)).toBeCloseTo(riseOf(b, 1.8));
    expect(riseOf(b, 1.5)).toBeGreaterThan(riseOf(b, 1.2));
    expect(riseOf(b, 0.5)).toBeLessThan(riseOf(b, 1.5));
    expect(bridgeRise(M, 1.5, 1)).toBeCloseTo(riseOf(bridgeOf(M, 2, 1), 1.5));
    expect(bridgeRise(M, 0, 0)).toBe(0);
  });

  it('un pont de deux rangs : un seul tablier, garde-corps sur ses bords seulement', () => {
    const W = mapOf(['gwwg', 'gkkg', 'gkkg', 'gwwg']);
    expect(bridgeOf(W, 1, 1)).toMatchObject({ axis: 'x', openBack: false, openFront: true });
    expect(bridgeOf(W, 1, 2)).toMatchObject({ axis: 'x', openBack: true, openFront: false });
  });

  it('une lanterne à chaque bout qui touche une rive, sur le garde-corps de devant', () => {
    const lamps = riverLampsOf(M);
    expect(lamps).toHaveLength(2);
    expect(lamps.map(l => l.y)).toEqual([1.3, 1.3]);
    expect(lamps.map(l => l.x)).toEqual([0.6, 2.4]);
  });
});
