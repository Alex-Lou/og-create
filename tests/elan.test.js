// L'élan de la caméra et ses bords souples (world/view/elan.js).
import { describe, expect, it } from 'vitest';
import { noter, vitesseOf, freiner, arretee, avancer, debordOf, revenir, bornerDebord, DEBORD_PX } from '@/world/view/elan';

describe('l’élan de la caméra', () => {
  it('la vitesse du doigt au lâcher, sur ses derniers instants ; rien s’il s’était arrêté', () => {
    let trace = null;
    for (let i = 0; i <= 10; i++) trace = noter(trace, { x: i * 10, y: 0 }, i * 16);
    const v = vitesseOf(trace, 160);
    expect(v.vx).toBeCloseTo(10 / 16, 2);
    expect(v.vy).toBe(0);
    expect(trace.every(s => 160 - s.at <= 90)).toBe(true);
    // (le doigt immobile depuis 100 ms : pas d'élan)
    expect(vitesseOf(trace, 260)).toEqual({ vx: 0, vy: 0 });
  });

  it('un lancer trop vif est plafonné', () => {
    const trace = noter(noter(null, { x: 0, y: 0 }, 0), { x: 400, y: 0 }, 16);
    expect(Math.hypot(...Object.values(vitesseOf(trace, 16)))).toBeLessThanOrEqual(3.2 + 1e-9);
  });

  it('ralentit en douceur, bien plus vite contre un bord, puis s’arrête', () => {
    expect(freiner(1, 320)).toBeCloseTo(Math.exp(-1), 5);
    expect(freiner(1, 100, true)).toBeLessThan(freiner(1, 100) / 3);
    expect(arretee(0.01, 0.01)).toBe(true);
    expect(arretee(0.5, 0)).toBe(false);
  });
});

describe('les bords souples', () => {
  it('au-delà du bord, la caméra s’arrête au bord et garde ce qui dépasse ; revenir le reprend d’abord', () => {
    expect(avancer(90, 0, 20, 0, 100)).toEqual({ pos: 100, raw: 10 });
    expect(avancer(100, 10, -4, 0, 100)).toEqual({ pos: 100, raw: 6 });
    expect(avancer(100, 10, -15, 0, 100)).toEqual({ pos: 95, raw: 0 });
    expect(avancer(5, 0, -8, 0, 100)).toEqual({ pos: 0, raw: -3 });
    expect(avancer(50, 0, 10, 0, 100)).toEqual({ pos: 60, raw: 0 });
  });

  it('le dépassement résiste et ne passe jamais quelques pixels à l’écran', () => {
    const s = 0.8;
    expect(debordOf(0, s)).toBe(0);
    expect(Math.abs(debordOf(10, s)) * s).toBeLessThan(10 * s);
    expect(debordOf(1e6, s) * s).toBeLessThanOrEqual(DEBORD_PX);
    expect(debordOf(-1e6, s) * s).toBeGreaterThanOrEqual(-DEBORD_PX);
  });

  it('il revient au bord de lui-même, puis disparaît', () => {
    let raw = 40;
    let t = 0;
    while (raw && t < 2000) { raw = revenir(raw, 16, 1); t += 16; }
    expect(raw).toBe(0);
    expect(t).toBeLessThan(800);
  });

  it('ce qui dépasse est gardé à trois fois ce qui se voit, au plus', () => {
    expect(bornerDebord(1000, 1)).toBe(3 * DEBORD_PX);
    expect(bornerDebord(-1000, 0.5)).toBe(-6 * DEBORD_PX);
    expect(bornerDebord(5, 1)).toBe(5);
  });
});
