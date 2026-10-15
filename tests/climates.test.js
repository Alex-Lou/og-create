import { describe, it, expect } from 'vitest';
import { climateAt, mixToward, CLIMATE_NAMES, CLIMATE_TEXT, placeOf, averseJungle } from '@/world/climates';

// Petite carte : deux quartiers, l'un connu (marais), l'autre inconnu
const M = { zone: x => (x < 2 ? 0 : x < 4 ? 1 : -1) };
const zones = [{ id: 'roselieres', known: true, climate: 'marais' }, { id: 'cratere', known: false }];

describe('micro-climats', () => {
  it('lit le climat d’une case, rien pour un quartier inconnu ou la mer', () => {
    expect(climateAt(M, zones, 1, 0)).toBe('marais');
    expect(climateAt(M, zones, 1.4, 0.2)).toBe('marais');
    expect(climateAt(M, zones, 3, 0)).toBe(null);
    expect(climateAt(M, zones, 9, 9)).toBe(null);
  });

  it('fond un climat dans l’autre, et éteint ce qui ne compte plus', () => {
    let mix = mixToward({}, 'marais', 0.2);
    expect(mix.marais).toBeCloseTo(0.3);
    mix = mixToward(mix, 'marais', 10);
    expect(mix).toEqual({ marais: 1 });
    mix = mixToward(mix, 'dunes', 0.2);
    expect(mix.marais).toBeCloseTo(0.7);
    expect(mix.dunes).toBeCloseTo(0.3);
    expect(mixToward(mix, 'tempere', 10)).toEqual({});
    expect(mixToward({}, null, 1)).toEqual({});
  });

  it('nomme et décrit les six climats des terres nouvelles', () => {
    expect(Object.keys(CLIMATE_TEXT).sort()).toEqual(['cimes', 'dunes', 'jungle', 'landes', 'marais', 'volcan']);
    expect(CLIMATE_NAMES.tempere).toBe('Tempéré');
  });

  it('ce qui flotte est attaché au monde : au loin il suit moins la caméra, tout près davantage, et reste à l’écran', () => {
    const w = 400, h = 800;
    const at = (par, o) => placeOf(100, 200, o, par, w, h);
    const loin = at(0.75, { x: 40, y: 0 }).x - at(0.75, { x: 0, y: 0 }).x;
    const pres = at(1.4, { x: 40, y: 0 }).x - at(1.4, { x: 0, y: 0 }).x;
    expect(loin).toBeCloseTo(-30, 5);
    expect(pres).toBeCloseTo(-56, 5);
    for (const o of [{ x: 1e5, y: -3e4 }, { x: -777, y: 12345 }]) {
      const p = placeOf(100, 200, o, 1.4, w, h);
      expect(p.x).toBeGreaterThanOrEqual(-40);
      expect(p.x).toBeLessThan(w + 40);
      expect(p.y).toBeGreaterThanOrEqual(-40);
      expect(p.y).toBeLessThan(h + 40);
    }
  });

  it('les averses de la jungle passent : un peu moins de la moitié du temps, pas toujours', () => {
    const n = 4000;
    let wet = 0;
    for (let i = 0; i < n; i++) if (averseJungle(i * 0.9) > 0.5) wet++;
    expect(wet / n).toBeGreaterThan(0.2);
    expect(wet / n).toBeLessThan(0.55);
  });
});
