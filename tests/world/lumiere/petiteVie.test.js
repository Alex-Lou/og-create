import { describe, it, expect } from 'vitest';
import { aigrettesOf, aigrettesIn, braisesFor, braisesIn } from '@/world/lumiere/petiteVie';
import { phase } from './phase';

// La petite vie de l'air de l'île : les aigrettes le jour, les braises du feu de camp la nuit
describe('les aigrettes de pissenlit', () => {
  it('volent par beau temps, jamais la nuit ni sous la pluie', () => {
    expect(aigrettesOf(phase())).toBeGreaterThan(0);
    expect(aigrettesOf(phase({ night: 1 }))).toBe(0);
    expect(aigrettesOf(phase({ weather: { cover: 0.5, rain: 0.6, storm: 0 } }))).toBe(0);
  });
  it('se posent dans le monde, à l’instant donné, et se raréfient de loin', () => {
    const view = { x: 0, y: 0, w: 960, h: 960 };
    const near = aigrettesIn(view, 12, phase(), 1);
    expect(near.length).toBeGreaterThan(0);
    expect(aigrettesIn(view, 12, phase(), 1)).toEqual(near);
    expect(aigrettesIn(view, 12, phase(), 0.2)).toEqual([]);
    for (const g of near) expect(g.a).toBeGreaterThan(0);
  });
});

describe('les braises du feu de camp', () => {
  it('sont plus vives la nuit, presque éteintes sous l’averse, et suivent ce qu’il reste du feu', () => {
    expect(braisesFor(phase({ night: 1 }))).toBeGreaterThan(braisesFor(phase()));
    expect(braisesFor(phase({ night: 1, weather: { cover: 1, rain: 1, storm: 0 } }))).toBeLessThan(0.25);
    expect(braisesFor(phase({ night: 1 }), 0)).toBe(0);
  });
  it('montent au-dessus de la flamme', () => {
    const list = braisesIn([{ x: 100, y: 200 }], 3.3, phase({ night: 1 }));
    expect(list.length).toBeGreaterThan(0);
    for (const b of list) expect(b.y).toBeLessThanOrEqual(200);
    expect(braisesIn([], 3.3, phase({ night: 1 }))).toEqual([]);
  });
});
