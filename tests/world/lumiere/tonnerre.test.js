import { describe, it, expect } from 'vitest';
import { eclairAt } from '@/world/lumiere/eclairs';
import { tonnerreAt } from '@/world/lumiere/tonnerre';

const amp = s => Math.hypot(s.x, s.y);
// Premier coup de foudre franc (au pas de 10 ms)
const firstBolt = () => {
  for (let t = 0; t < 120; t += 0.01) {
    const e = eclairAt(t, 1);
    if (e && e.bolt && e.flash > 0.9) return t;
  }
  return null;
};
// La secousse la plus forte sur [a, b]
const peak = (a, b) => {
  let best = 0;
  for (let t = a; t < b; t += 0.005) best = Math.max(best, amp(tonnerreAt(t, 1)));
  return best;
};

describe('tonnerre', () => {
  it('suit le coup de foudre avec du retard, doucement, puis se tait', () => {
    const t = firstBolt();

    expect(t).not.toBeNull();
    expect(peak(t - 0.05, t + 0.3)).toBe(0);
    expect(peak(t + 0.3, t + 2.6)).toBeGreaterThan(0.5);
    expect(peak(t + 0.3, t + 2.6)).toBeLessThan(3);
    expect(amp(tonnerreAt(t + 3.2, 1))).toBe(0);
  });

  it('est déterministe et réservé à l\'orage', () => {
    for (let t = 0; t < 60; t += 0.37) {
      expect(tonnerreAt(t, 1)).toEqual(tonnerreAt(t, 1));
      expect(amp(tonnerreAt(t, 0.3))).toBe(0);
    }
  });
});
