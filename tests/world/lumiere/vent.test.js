import { describe, it, expect } from 'vitest';
import { gustAt, souffleAt, sheenAt, windStrength, leavesOf, leafTones } from '@/world/lumiere/vent';

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
  it('fait vivre les plantes de temps en temps, en douceur : un souffle toutes les 20 à 40 s, rien entre deux, rien au temps 0', () => {
    expect(souffleAt(10, 3, 0)).toBe(0);
    const pas = 0.05, vals = [];
    for (let t = 0; t < 300; t += pas) vals.push(souffleAt(10, 3, t));
    // (presque tout le temps immobile ; le souffle va jusqu'à bien plier ; sans à-coup d'une image à l'autre)
    expect(vals.filter(v => v === 0).length / vals.length).toBeGreaterThan(0.8);
    expect(Math.max(...vals)).toBeGreaterThan(0.6);
    for (let i = 1; i < vals.length; i++) expect(Math.abs(vals[i] - vals[i - 1])).toBeLessThan(0.06);
    // (les souffles : de 6 à 12 en 300 s, chacun de 4 s environ)
    const debuts = vals.filter((v, i) => v > 0 && !vals[i - 1]).length;
    expect(debuts).toBeGreaterThanOrEqual(6);
    expect(debuts).toBeLessThanOrEqual(12);
    // (il traverse l'île vers la droite de l'écran : il arrive plus tard là où x - y est plus grand)
    const premier = (x, y) => { for (let t = 0; t < 60; t += pas) if (souffleAt(x, y, t) > 0) return t; return Infinity; };
    expect(premier(30, 0)).toBeGreaterThan(premier(0, 0));
  });
  it('forcit sous la pluie, plus dans l’orage, jamais plus du double', () => {
    expect(windStrength({ rain: 0, storm: 0 })).toBe(1);
    expect(windStrength({ rain: 1, storm: 0 })).toBeGreaterThan(1);
    expect(windStrength({ rain: 1, storm: 1 })).toBe(2);
    expect(windStrength(undefined)).toBe(1);
  });
  it('arrache des feuilles au passage d’un souffle, aucune entre deux', () => {
    let seen = 0;
    for (let t = 0; t < 60; t += 0.25) {
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
