// La météo dans le monde : la pluie tombe sur son point de chute et y éclabousse ; la foudre frappe un point fixe.
import { describe, expect, it } from 'vitest';
import { gouttesOf } from '@/world/lumiere/pluie';
import { impactOf, coupOf } from '@/world/lumiere/eclairs';

const view = { x: 0, y: 0, w: 400, h: 800 };

describe('la pluie, dans le monde', () => {
  it('chaque goutte tombe à la verticale de son point de chute, qui ne bouge pas quand la caméra glisse', () => {
    const a = gouttesOf(view, 3.2, 1).gouttes;
    const b = gouttesOf({ ...view, x: 37 }, 3.2, 1).gouttes;
    expect(a.length).toBeGreaterThan(100);
    expect(a.every(g => g.z >= 0 && g.z <= 300)).toBe(true);
    // (les carreaux communs aux deux vues portent les mêmes gouttes, aux mêmes points)
    const key = g => `${g.x.toFixed(2)},${g.y.toFixed(2)}`;
    const vus = new Set(b.map(key));
    expect(a.filter(g => vus.has(key(g))).length).toBeGreaterThan(a.length * 0.5);
  });

  it('elle éclabousse là où elle tombe ; plus faible pluie, moins de gouttes ; rien sans pluie', () => {
    const { gouttes, eclats } = gouttesOf(view, 5, 1);
    const points = new Set(gouttes.map(g => `${g.x},${g.y}`));
    expect(eclats.length).toBeGreaterThan(0);
    expect(eclats.every(e => points.has(`${e.x},${e.y}`) && e.age >= 0 && e.age <= 1)).toBe(true);
    expect(gouttesOf(view, 5, 0.3).gouttes.length).toBeLessThan(gouttes.length * 0.5);
    expect(gouttesOf(view, 5, 0).gouttes).toEqual([]);
  });
});

describe('la foudre, dans le monde', () => {
  it('frappe un point choisi une fois, du côté de l’éclair, qui ne suit pas la caméra', () => {
    const p = impactOf(123, view);
    expect(p.x).toBeCloseTo(view.x + coupOf(123).x * view.w, 6);
    expect(impactOf(123, { ...view, x: 500, y: 900 })).toEqual(p);
  });
});
