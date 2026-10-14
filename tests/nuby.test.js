// Nuby, le nuage d'Aster (world/nuby.js) et la planche d'Ondin (world/village/plank.js) : leurs trajets
import { describe, it, expect } from 'vitest';
import { showerAt } from '@/world/nuby';
import { plankAt } from '@/world/village/plank';

const SHOWER = { in: 3.5, out: 3.5, bow: 8, max: 40 };

describe('Nuby, le nuage d’Aster', () => {
  it('il rentre du large, s’arrête au-dessus du Puits et y pleut tant qu’Aster ne le dit pas reparti', () => {
    expect(showerAt(-1, null, SHOWER)).toBeNull();
    // (il arrive du sud, de la mer, sans pluie encore)
    expect(showerAt(0, null, SHOWER)).toMatchObject({ rain: 0, rainbow: 0, nuby: { dx: 0, dy: 8, rain: 0, alpha: 0 } });
    const over = showerAt(20, null, SHOWER);
    expect(Math.abs(over.nuby.dx)).toBeLessThan(0.2);
    expect(over).toMatchObject({ rain: 1, rainbow: 0, nuby: { dy: 0, rain: 1, alpha: 1 } });
  });
  it('dit reparti, il s’en va au nord-ouest, la pluie avec lui ; l’arc-en-ciel le suit, puis tout est passé', () => {
    // (Aster le dit reparti à 12 s)
    const away = showerAt(15, 12, SHOWER);
    expect(away.nuby.dx).toBeLessThan(-4);
    expect(away.nuby.dy).toBeLessThan(0);
    expect(away.rain).toBeLessThan(0.3);
    expect(away.rainbow).toBeGreaterThan(0.7);
    expect(showerAt(17, 12, SHOWER)).toMatchObject({ rain: 0, rainbow: 1, nuby: null });
    expect(showerAt(23.6, 12, SHOWER)).toBeNull();
    // (dit reparti avant d'être arrivé : il arrive d'abord)
    expect(showerAt(2, 1, SHOWER).nuby.dx).toBe(0);
    // (jamais dit reparti, l'île quittée : il repart de lui-même)
    expect(showerAt(41, null, SHOWER).nuby.dx).toBeLessThan(0);
    expect(showerAt(52, null, SHOWER)).toBeNull();
  });
});

describe('la planche d’Ondin', () => {
  it('elle dérive du large jusqu’au sable, puis n’en bouge plus ; déjà échouée, elle est à sa place', () => {
    expect(plankAt({ at: null }, 90, 100, 5)).toEqual({ x: 90, y: 100, z: 0 });
    const start = plankAt({ at: 10 }, 90, 100, 10);
    expect(start.y).toBeCloseTo(103);
    expect(plankAt({ at: 10 }, 90, 100, 12).y).toBeGreaterThan(100);
    expect(plankAt({ at: 10 }, 90, 100, 20)).toEqual({ x: 90, y: 100, z: 0 });
  });
});
