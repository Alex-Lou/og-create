// La vue dégagée (world/sight.js) : devant ce qui se tient debout, pas d'arbre ; il pousse un peu plus loin
import { describe, it, expect } from 'vitest';
import { TALL, sightOf, replantOf } from '@/world/sight';

describe('la vue dégagée', () => {
  it('les cases devant une emprise (sud et est, deux cases, une de côté), jamais l’emprise ni derrière', () => {
    const n = 20;
    const sight = sightOf([{ x: 5, y: 5, w: 2, h: 2 }], n);
    const has = (x, y) => sight.has(y * n + x);
    // Devant : au sud, à l'est, en diagonale
    expect([has(7, 5), has(8, 6), has(5, 7), has(6, 8), has(8, 8), has(4, 8), has(8, 4)]).toEqual([true, true, true, true, true, true, true]);
    // Ni l'emprise, ni derrière (nord, ouest), ni au-delà de deux cases
    expect([has(5, 5), has(6, 6), has(4, 5), has(5, 4), has(4, 4), has(9, 5), has(5, 9)]).toEqual([false, false, false, false, false, false, false]);
    // Une case seule (un gisement, une création) ; le bord de la carte
    const one = sightOf([{ x: 0, y: 0 }], n);
    expect(one.has(1 * n + 1) && one.has(2 * n + 0) && !one.has(0)).toBe(true);
  });

  it('seuls les arbres et les grandes roches cachent', () => {
    expect(['tree', 'apple', 'birch', 'pine', 'palm', 'autumn'].every(k => TALL.has(k))).toBe(true);
    expect(['tuft', 'flowers', 'mushrooms', 'shells', 'bush'].some(k => TALL.has(k))).toBe(false);
  });

  it('replanter : la case libre la plus proche, derrière d’abord, rien au-delà de 3 cases', () => {
    expect(replantOf(5, 5, () => true)).toEqual({ x: 4, y: 4 });
    expect(replantOf(5, 5, (x, y) => x === 7 && y === 5)).toEqual({ x: 7, y: 5 });
    expect(replantOf(5, 5, x => x === 9)).toBe(null);
    expect(replantOf(5, 5, x => x > 5)).toEqual(replantOf(5, 5, x => x > 5));
  });
});
