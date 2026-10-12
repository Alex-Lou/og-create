import { describe, it, expect } from 'vitest';
import { onPlan } from '@/world/village/residents';

// Une arrivée : un chemin de trois cases, puis une pause (village/residents.js : introOf)
const plan = { legs: [{ path: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }], walk: 2, pause: 1, act: 'idle', start: 0 }], total: 3, speed: 1, lane: 0, rest: { x: 0, y: 0 }, offset: 0 };

describe('la place sur une tournée', () => {
  it('avant le départ (un familier qui suit son maître tout juste arrivé), au début du chemin, sans planter', () => {
    expect(onPlan(plan, -0.8)).toMatchObject({ x: 0, y: 0, pose: 'walk' });
  });
  it('en route, puis arrivé', () => {
    expect(onPlan(plan, 1.5)).toMatchObject({ x: 1.5, pose: 'walk' });
    expect(onPlan(plan, 2.5)).toMatchObject({ x: 2, pose: 'idle' });
  });
});
