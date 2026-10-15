// La planche de Léo (world/village/plank.js) : sa dérive
import { describe, it, expect } from 'vitest';
import { plankAt } from '@/world/village/plank';

describe('la planche de Léo', () => {
  it('elle dérive du large jusqu’au sable, puis n’en bouge plus ; déjà échouée, elle est à sa place', () => {
    expect(plankAt({ at: null }, 90, 100, 5)).toEqual({ x: 90, y: 100, z: 0 });
    const start = plankAt({ at: 10 }, 90, 100, 10);
    expect(start.y).toBeCloseTo(103);
    expect(plankAt({ at: 10 }, 90, 100, 12).y).toBeGreaterThan(100);
    expect(plankAt({ at: 10 }, 90, 100, 20)).toEqual({ x: 90, y: 100, z: 0 });
  });
});
