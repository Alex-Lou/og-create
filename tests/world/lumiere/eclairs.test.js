import { describe, it, expect } from 'vitest';
import { eclairAt } from '@/world/lumiere/eclairs';

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
});
