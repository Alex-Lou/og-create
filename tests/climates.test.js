import { describe, it, expect } from 'vitest';
import { climateAt, mixToward, CLIMATE_NAMES, CLIMATE_TEXT, tuilesOf, TUILE, averseJungle } from '@/world/climates';

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

  it('ce qui flotte est posé dans le monde, par carreaux : ceux qui couvrent la vue, et un peu au-delà vers le bas', () => {
    const view = { x: 100, y: 200, w: 400, h: 800 };
    const tuiles = tuilesOf(view);
    // (chaque point de la vue est dans un carreau ; un carreau garde son numéro, la caméra peut bouger)
    for (const [x, y] of [[100, 200], [500, 1000], [300, 600]]) expect(tuiles.some(T => x >= T.X && x < T.X + TUILE && y >= T.Y && y < T.Y + TUILE)).toBe(true);
    // (un sol jusqu'à 150 sous la vue : ce qui flotte au-dessus de lui s'y voit encore)
    expect(tuiles.some(T => T.Y <= view.y + view.h + 150 && T.Y + TUILE > view.y + view.h + 150)).toBe(true);
    const ailleurs = tuilesOf({ ...view, x: view.x + 7 });
    const meme = ailleurs.find(T => T.X === tuiles[0].X && T.Y === tuiles[0].Y);
    expect(meme.n).toBe(tuiles[0].n);
  });

  it('les averses de la jungle passent : un peu moins de la moitié du temps, pas toujours', () => {
    const n = 4000;
    let wet = 0;
    for (let i = 0; i < n; i++) if (averseJungle(i * 0.9) > 0.5) wet++;
    expect(wet / n).toBeGreaterThan(0.2);
    expect(wet / n).toBeLessThan(0.55);
  });
});
