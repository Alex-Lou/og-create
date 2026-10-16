// L'averse (world/lumiere/averse.js) : une pluie qui respire par rafales, un sol qui se mouille et sèche, une pluie qui
// s'allège quand l'appareil peine, qui change avec le zoom, et des flaques là où le sol est plat.
import { describe, expect, it } from 'vitest';
import { rainFelt, slantOf, wetnessAt, puddlesOf, flaqueDe, rippleSpotsOf } from '@/world/lumiere/averse';

const H = 3600000;
const at = new Date(2026, 9, 12, 15, 0);

describe('averse', () => {
  it('la pluie ressentie respire par rafales, sans jamais dépasser la pluie ni tomber à rien ; rien sans pluie', () => {
    const felt = Array.from({ length: 200 }, (_, i) => rainFelt(1, i * 0.7));
    expect(Math.max(...felt)).toBeLessThanOrEqual(1);
    expect(Math.min(...felt)).toBeGreaterThan(0.5);
    expect(Math.max(...felt) - Math.min(...felt)).toBeGreaterThan(0.25);
    expect(rainFelt(0, 12)).toBe(0);
    // (le vent penche plus dans une rafale)
    expect(slantOf(0)).toBeGreaterThan(0.15);
  });

  it('le sol se mouille en quelques minutes d’averse et sèche en une heure environ', () => {
    const since = start => d => (d >= start ? 1 : 0);
    expect(wetnessAt(at, () => 0)).toBe(0);
    expect(wetnessAt(at, since(at))).toBeGreaterThan(0.3);
    expect(wetnessAt(at, since(new Date(at - 0.5 * H)))).toBe(1);
    // une pluie finie il y a 20 min, 1 h 30, 3 h
    const until = (end, from = end - 2 * H) => d => (d >= from && d < end ? 1 : 0);
    expect(wetnessAt(at, until(at - (1 / 3) * H))).toBe(1);
    const later = wetnessAt(at, until(at - 1.5 * H));
    expect(later).toBeGreaterThan(0);
    expect(later).toBeLessThan(1);
    expect(wetnessAt(at, until(at - 3.2 * H))).toBe(0);
  });

  it('des flaques sur les chemins et l’herbe à plat seulement', () => {
    const n = 40;
    const ground = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? '~' : x < 20 ? 'p' : y < 20 ? 's' : 'g');
    const height = (x, y) => (x >= 30 && y >= 30 ? (x + y) % 3 : 1);
    const M = { n, ground, height, land: (x, y) => ground(x, y) !== '~', surface: height };
    const list = puddlesOf(M);
    expect(list.length).toBeGreaterThan(10);
    for (const p of list) {
      expect('pg').toContain(ground(p.x, p.y));
      // (pas sur la pente : là, chaque case a une voisine plus haute ou plus basse)
      expect(p.x >= 31 && p.y >= 31).toBe(false);
    }
    // plus de flaques sur les chemins que dans l'herbe, à surface égale
    const paths = list.filter(p => ground(p.x, p.y) === 'p').length;
    expect(paths).toBeGreaterThan(list.length - paths);
  });

  it('les flaques sont celles de la bibliothèque : l’eau calme, ses ronds qui bougent sous la pluie, gelée l’hiver', () => {
    expect(flaqueDe().key).toBe('sol-flaque_grande-0');
    expect(flaqueDe({ gel: true, pluie: true }).key).toBe('sol-flaque_gelee-0');
    // (sous la pluie, 4 images de 220 ms)
    expect(flaqueDe({ pluie: true, t: 0 }).key).toBe('sol-flaque_pluie-0');
    expect(flaqueDe({ pluie: true, t: 0.5 }).key).toBe('sol-flaque_pluie-2');
    expect(flaqueDe({ pluie: true, t: 0 })).toBe(flaqueDe({ pluie: true, t: 0.1 }));
  });

  it('la pluie fait ses ronds sur l’eau douce et la mer proche ; les flaques ont les leurs, dessinés', () => {
    const spots = rippleSpotsOf([{ x: 3, y: 4, z: 1 }], [{ x: 9, y: 2 }]);
    expect(spots).toHaveLength(2);
    expect(spots.some(sp => sp.puddle)).toBe(false);
  });
});
