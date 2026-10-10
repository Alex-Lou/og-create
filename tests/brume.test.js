import { describe, expect, it } from 'vitest';
import { floatOf, drawBrume, joyHop, JOY_MS, BRUME_ALT, BRUME_REACH } from '../src/world/brume';

// Contexte de dessin factice : compte les tracés et retient les textes
const fakeCtx = () => {
  const calls = { text: [], fill: 0 };
  const ctx = new Proxy({}, {
    get: (target, key) => {
      if (key === 'calls') return calls;
      if (key === 'createRadialGradient') return () => ({ addColorStop() {} });
      if (key === 'fillText') return text => calls.text.push(text);
      if (key === 'fill') return () => { calls.fill++; };
      return target[key] ?? (() => {});
    },
    set: (target, key, value) => { target[key] = value; return true; }
  });
  return ctx;
};

describe('Brume', () => {
  it('flotte autour de son point, sans s’en éloigner', () => {
    for (let t = 0; t < 60; t += 0.37) {
      const { dx, dy } = floatOf(t);
      expect(Math.abs(dx)).toBeLessThanOrEqual(6);
      expect(Math.abs(dy)).toBeLessThanOrEqual(4);
    }
    expect(BRUME_ALT).toBeGreaterThan(BRUME_REACH);
  });
  it('montre une pastille « ! » seulement quand la récompense attend', () => {
    const idle = fakeCtx();
    drawBrume(idle, 0, -46, { x: 0, y: 0 }, 1.3, false, 1);
    expect(idle.calls.text).toEqual([]);
    const ready = fakeCtx();
    drawBrume(ready, 0, -46, { x: 0, y: 0 }, 1.3, true, 1);
    expect(ready.calls.text).toEqual(['!']);
    expect(ready.calls.fill).toBeGreaterThan(idle.calls.fill);
  });
});

describe('la joie de Brume, une quête réclamée', () => {
  it('trois bonds qui s’amortissent, puis plus rien', () => {
    expect(joyHop(-1)).toBe(0);
    expect(joyHop(0)).toBe(0);
    expect(joyHop(JOY_MS / 6)).toBeGreaterThan(joyHop(JOY_MS / 2));
    expect(joyHop(JOY_MS / 2)).toBeGreaterThan(joyHop((JOY_MS * 5) / 6));
    expect(joyHop(JOY_MS)).toBe(0);
    expect(JOY_MS).toBeGreaterThanOrEqual(1500);
  });
});
