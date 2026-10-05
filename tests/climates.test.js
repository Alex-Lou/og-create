import { describe, it, expect } from 'vitest';
import { climateAt, mixToward, CLIMATE_NAMES, CLIMATE_TEXT } from '@/world/climates';

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
});
