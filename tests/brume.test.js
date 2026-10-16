import { describe, expect, it } from 'vitest';
import { floatOf, drawBrume, joyHop, JOY_MS, BRUME_ALT, BRUME_REACH, moodOf, motionOf, glideStep, SURPRISE_S } from '../src/world/brume';

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

  it('son humeur suit ce qu’elle vit : sa joie d’abord, puis l’attente, la surprise, la gêne, la nuit', () => {
    expect(moodOf({ joy: true, ready: true })).toBe('rire');
    expect(moodOf({ ready: true, sinceQuest: 0.5 })).toBe('pret');
    expect(moodOf({ sinceQuest: 1 })).toBe('surpris');
    expect(moodOf({ sinceQuest: SURPRISE_S + 1, short: true, night: true })).toBe('gene');
    expect(moodOf({ night: true })).toBe('endormi');
    expect(moodOf({ t: 0.5 })).toBe('content');
    expect(moodOf({ t: 3 })).toBe('neutre');
  });
  it('chaque humeur bouge sans quitter sa place : sautillement, sursaut, frémissement ; rien au repos ni dans la joie', () => {
    for (let t = 0; t <= 3; t += 0.1) {
      const m = motionOf('pret', t);
      expect(m.dy).toBeLessThanOrEqual(0);
      expect(m.dy).toBeGreaterThanOrEqual(-4);
    }
    expect(motionOf('surpris', 0, 0.25).sy).toBeGreaterThan(1.1);
    expect(motionOf('surpris', 0, 0.5).dy).toBeCloseTo(0, 5);
    expect(Math.abs(motionOf('gene', 1).dx)).toBeLessThanOrEqual(0.8);
    expect(motionOf('endormi', 0).dy).toBeGreaterThan(0);
    expect(motionOf('neutre', 7)).toEqual({ dx: 0, dy: 0, sx: 1, sy: 1 });
    expect(motionOf('rire', 7)).toEqual({ dx: 0, dy: 0, sx: 1, sy: 1 });
  });
  it('glisse vers sa nouvelle place, sans la dépasser, et y arrive', () => {
    let at = { x: 0, y: 0 };
    const to = { x: 100, y: -40 };
    for (let i = 0; i < 40; i++) {
      const next = glideStep(at, to, 0.05);
      expect(next.x).toBeGreaterThan(at.x);
      expect(next.x).toBeLessThanOrEqual(100);
      at = next;
    }
    expect(at.x).toBeGreaterThan(99);
    expect(at.y).toBeLessThan(-39);
    expect(glideStep(at, to, 0)).toEqual(at);
  });
});
