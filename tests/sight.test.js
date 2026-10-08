// La vue dégagée (world/sight.js) : là où un arbre cacherait ce qui se tient debout, il n'en pousse pas ; il pousse
// un peu plus loin
import { describe, it, expect } from 'vitest';
import { TALL, sightOf, replantOf } from '@/world/sight';
import { TW } from '@/world/view/constants';

describe('la vue dégagée', () => {
  it('un bâtiment 2 × 2 : les cases devant lui, jusqu’à ce que l’arbre ne le couvre plus ; jamais derrière ni loin de côté', () => {
    const n = 30;
    const sight = sightOf([{ x: 5, y: 5, w: 2, h: 2, tall: TW * 0.875 * 2 }], n);
    const has = (x, y) => sight.has(y * n + x);
    // Devant, droit dessous à l'écran, de biais à gauche et à droite
    expect([has(7, 7), has(8, 8), has(7, 8), has(8, 6), has(6, 8), has(7, 5), has(5, 7)]).toEqual([true, true, true, true, true, true, true]);
    // Ni l'emprise, ni derrière, ni trop loin devant, ni loin de côté
    expect([has(5, 5), has(6, 6), has(4, 4), has(5, 4), has(10, 10), has(10, 5), has(5, 10)]).toEqual([false, false, false, false, false, false, false]);
  });

  it('une petite chose (une case) : l’arbre juste devant la cache, pas celui de côté', () => {
    const n = 20;
    const sight = sightOf([{ x: 5, y: 5, tall: TW * 1.1 }], n);
    expect(sight.has(6 * n + 6) && sight.has(7 * n + 7)).toBe(true);
    expect(sight.has(5 * n + 8) || sight.has(9 * n + 9) || sight.has(5 * n + 5)).toBe(false);
  });

  it('seuls les arbres et les grandes roches cachent', () => {
    expect(['tree', 'apple', 'birch', 'pine', 'palm', 'autumn'].every(k => TALL.has(k))).toBe(true);
    expect(['tuft', 'flowers', 'mushrooms', 'shells', 'bush'].some(k => TALL.has(k))).toBe(false);
  });

  it('replanter : la case libre la plus proche, derrière d’abord, rien au-delà de 3 cases', () => {
    expect(replantOf(5, 5, () => true)).toEqual({ x: 4, y: 4 });
    expect(replantOf(5, 5, (x, y) => x === 7 && y === 5)).toEqual({ x: 7, y: 5 });
    expect(replantOf(5, 5, x => x === 9)).toBe(null);
  });
});
