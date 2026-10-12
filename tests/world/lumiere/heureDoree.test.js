// L'heure dorée (world/lumiere/heureDoree.js), les ombres mauves et les halos de la brume : quand, de quel côté, combien.
import { describe, expect, it } from 'vitest';
import { goldenOf, rimOf } from '@/world/lumiere/heureDoree';
import { shadowLight, shadowTint } from '@/world/lumiere/ombres';
import { hazeOf } from '@/world/lumiere/halos';
import { phase } from './phase';

const low = (progress, over = {}) => phase({ sun: { up: 0.1, progress }, ...over });

describe('heure dorée', () => {
  it('au soleil bas par ciel clair ; rien à midi, la nuit, sous les nuages ou la pluie', () => {
    expect(goldenOf(low(0.05)).k).toBeGreaterThan(0.8);
    expect(goldenOf(phase()).k).toBe(0);
    expect(goldenOf(phase({ sun: { up: 0, progress: 0 } })).k).toBe(0);
    expect(goldenOf(low(0.05, { weather: { cover: 1, rain: 0, storm: 0 } })).k).toBe(0);
    expect(goldenOf(low(0.05, { weather: { cover: 0, rain: 1, storm: 0 } })).k).toBe(0);
    // un ciel à demi voilé l'adoucit
    const half = goldenOf(low(0.05, { weather: { cover: 0.5, rain: 0, storm: 0 } })).k;
    expect(half).toBeGreaterThan(0.2);
    expect(half).toBeLessThan(0.5);
  });

  it('le soleil est à droite le matin, à gauche le soir ; le liseré suit', () => {
    expect(goldenOf(low(0.05)).side).toBe(1);
    expect(goldenOf(low(0.95)).side).toBe(-1);
    expect(rimOf(low(0.95))).toMatchObject({ side: -1 });
    expect(rimOf(phase())).toBe(null);
  });

  it('les ombres virent au mauve à l’heure dorée, restent bleu nuit à midi', () => {
    expect(shadowTint(0)).toBe('52,56,96');
    expect(shadowTint(1)).toBe('92,58,118');
    expect(shadowLight(low(0.05), new Date()).golden).toBeGreaterThan(0.8);
    expect(shadowLight(phase(), new Date()).golden).toBe(0);
  });
});

describe('halos de la brume', () => {
  it('l’air chargé : la brume, un ciel voilé ; rien par ciel clair, moins sous la pluie', () => {
    expect(hazeOf(phase())).toBe(0);
    expect(hazeOf(phase({ weather: { cover: 0.35, rain: 0, storm: 0, mist: 1 } }))).toBe(1);
    expect(hazeOf(phase({ weather: { cover: 0.72, rain: 0, storm: 0, mist: 0 } }))).toBeCloseTo(0.324);
    expect(hazeOf(phase({ weather: { cover: 0.92, rain: 1, storm: 0, mist: 0.25 } }))).toBeCloseTo(0.25);
  });
});
