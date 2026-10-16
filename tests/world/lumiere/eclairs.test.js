import { describe, it, expect } from 'vitest';
import { eclairAt, eclairRimOf, foudreAt } from '@/world/lumiere/eclairs';

// Premier instant (au pas de 10 ms) où un coup de foudre est visible et répond au critère
const firstBolt = (ok = () => true) => {
  for (let t = 0; t < 120; t += 0.01) {
    const e = eclairAt(t, 1);
    if (e && e.bolt && ok(e)) return t;
  }
  return null;
};

describe('éclairs', () => {
  it('sont déterministes et réservés à l\'orage', () => {
    const t = firstBolt();

    expect(t).not.toBeNull();
    expect(eclairAt(t, 1)).toEqual(eclairAt(t, 1));
    expect(eclairAt(t, 0)).toBeNull();
  });

  it('leur flash retombe', () => {
    const t = firstBolt(e => e.flash > 0.9);
    const later = eclairAt(t + 2.5, 1);

    expect(t).not.toBeNull();
    expect(later === null || later.flash < 0.05).toBe(true);
  });

  it('posent un liseré blanc du côté de l\'éclair, le temps du coup', () => {
    const t = firstBolt(e => e.flash > 0.9);
    const e = eclairAt(t, 1);
    const rim = eclairRimOf(e);

    expect(rim.side).toBe(e.x < 0.5 ? -1 : 1);
    expect(rim.alpha).toBeGreaterThan(0.6);
    expect(eclairRimOf(null)).toBeNull();
    expect(eclairRimOf({ ...e, flash: 0.1 })).toBeNull();
  });
  // (la nuit du conseil : deux coups près du phare, WorldView, phare.js)
  it('un coup imposé frappe là où on le vise, le temps d’un coup de foudre, puis s’éteint', () => {
    const at = { x: 1700, y: 2860 };
    expect(foudreAt(-0.1, -101, at, 0.3)).toBeNull();
    const fort = foudreAt(0.1, -101, at, 0.3);
    expect(fort.at).toBe(at);
    expect(fort.flash).toBeCloseTo(1);
    expect(fort.bolt).not.toBeNull();
    expect([fort.x, fort.lointain]).toEqual([0.3, false]);
    expect(foudreAt(3, -101, at, 0.3)).toBeNull();
  });
});
