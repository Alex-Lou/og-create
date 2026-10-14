import { describe, it, expect } from 'vitest';
import { gustAt, sheenAt, windStrength, leavesOf, leafTones } from '@/world/lumiere/vent';

// Le vent dans l'île : la rafale qui traverse l'île, sa force selon le temps, les feuilles qu'elle arrache
describe('le vent dans l’île', () => {
  it('passe en rafales, de 0 à 1, là où la lueur de l’herbe passe aussi', () => {
    let max = 0, calm = 0;
    for (let t = 0; t < 20; t += 0.1) {
      const g = gustAt(4, 2, t);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
      max = Math.max(max, g);
      if (g === 0) calm++;
      if (sheenAt(4, 2, t) > 0) expect(g).toBeGreaterThan(0);
    }
    expect(max).toBeGreaterThan(0.3);
    expect(calm).toBeGreaterThan(0);
  });
  it('forcit sous la pluie, plus dans l’orage, jamais plus du double', () => {
    expect(windStrength({ rain: 0, storm: 0 })).toBe(1);
    expect(windStrength({ rain: 1, storm: 0 })).toBeGreaterThan(1);
    expect(windStrength({ rain: 1, storm: 1 })).toBe(2);
    expect(windStrength(undefined)).toBe(1);
  });
  it('arrache des feuilles au passage d’une rafale, aucune entre deux rafales', () => {
    let seen = 0;
    for (let t = 0; t < 30; t += 0.25) {
      for (const l of leavesOf(100, 200, 3, 1, t)) {
        seen++;
        expect(l.a).toBeGreaterThanOrEqual(0);
        expect(l.y).toBeLessThan(200 + 10);
      }
    }
    expect(seen).toBeGreaterThan(0);
  });
  it('donne aux feuilles les couleurs de la saison des arbres, et rien en hiver', () => {
    expect(leafTones('automne')).toHaveLength(2);
    expect(leafTones('ete')).not.toEqual(leafTones('automne'));
    expect(leafTones('hiver')).toBe(null);
  });
});
