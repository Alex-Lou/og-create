import { describe, it, expect } from 'vitest';
import { seuilOf, forceOf, allumage, ALLUME_MS, ETEINT_MS } from '@/world/lumiere/allumage';

describe('lumières du soir', () => {
  it('s\'allument en vague depuis le Foyer', () => {
    const pres = Array.from({ length: 20 }, (_, i) => seuilOf(`f${i}`, 0));
    const loin = Array.from({ length: 20 }, (_, i) => seuilOf(`f${i}`, 14 * 64));

    expect(Math.max(...pres)).toBeLessThan(Math.min(...loin));
  });

  it('s\'allument d\'un coup en dépassant un peu, s\'éteignent en fondu', () => {
    const pic = Math.max(...Array.from({ length: 50 }, (_, i) => forceOf(true, (i / 50) * ALLUME_MS)));

    expect(forceOf(true, 0)).toBe(0);
    expect(pic).toBeGreaterThan(1.1);
    expect(forceOf(true, ALLUME_MS)).toBe(1);
    expect(forceOf(false, 0)).toBe(1);
    expect(forceOf(false, ETEINT_MS / 2)).toBeGreaterThan(0);
    expect(forceOf(false, ETEINT_MS)).toBe(0);
  });

  it('sans animation à l\'ouverture, puis une trace à chaque bascule, sans clignoter', () => {
    const memo = new Map(), traces = [];

    expect(allumage(memo, traces, 'a', 1, 2, 0.3, 0.5, 0)).toBe(1);
    expect(traces).toHaveLength(0);
    // le ciel hésite autour du seuil : rien ne bascule
    expect(allumage(memo, traces, 'a', 1, 2, 0.3, 0.29, 100)).toBe(1);
    // il passe franchement dessous : l'extinction commence, avec sa fumée
    expect(allumage(memo, traces, 'a', 1, 2, 0.3, 0.2, 200)).toBe(1);
    expect(traces).toEqual([{ x: 1, y: 2, at: 200, on: false }]);
    expect(allumage(memo, traces, 'a', 1, 2, 0.3, 0.2, 200 + ETEINT_MS)).toBe(0);
  });

  it('se fait d\'un coup en mouvement réduit', () => {
    const memo = new Map(), traces = [];
    allumage(memo, traces, 'a', 0, 0, 0.3, 0.1, 0, true);

    expect(allumage(memo, traces, 'a', 0, 0, 0.3, 0.6, 10, true)).toBe(1);
    expect(traces).toHaveLength(0);
  });
});
