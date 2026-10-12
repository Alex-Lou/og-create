// La charte des textes et bulles de l'île (world/charte.js) : ses teintes sont celles des jetons CSS, un nom s'écarte
// de ce qu'il cacherait, une bulle rebondit en apparaissant, la nuit allume les lanternes.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TINT, RGB, warm, softShadow, popScale, POP_MS, labelShift } from '@/world/charte';

const css = readFileSync(fileURLToPath(new URL('../../src/styles/tokens/colors.css', import.meta.url)), 'utf8');
const token = name => (css.match(new RegExp(`${name}\\s*:\\s*([^;]+);`)) || [])[1];

describe('charte des textes de l’île', () => {
  it('ses teintes sont celles des jetons CSS', () => {
    const tints = {
      ink: '--walnut-700', vellum: '--vellum-100', paper: '--vellum-50', gold100: '--gold-100', gold400: '--gold-400',
      gold500: '--gold-500', amber100: '--amber-100', amber500: '--amber-500', amber700: '--amber-700', rim: '--vellum-300'
    };
    expect(Object.keys(tints).sort()).toEqual(Object.keys(TINT).sort());
    for (const [k, name] of Object.entries(tints)) expect(TINT[k], k).toBe(token(name));
    const channels = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ');
    expect(RGB.vellum).toBe(channels(token('--vellum-100')));
    expect(RGB.shade).toBe(token('--shade-rgb'));
    expect(RGB.dusk).toBe(token('--ink-900-rgb'));
    expect(RGB.glow).toBe(token('--gold-400-rgb'));
  });

  it('un nom reste à sa place, sinon s’écarte vers le bas, puis vers le haut ; sans place libre, null', () => {
    const at = (y0, y1) => ({ x0: -10, x1: 10, y0, y1 });
    expect(labelShift(0, 0, 60, 18, [])).toBe(0);
    // Un habitant sur le nom : il descend d'une hauteur et un peu plus
    expect(labelShift(0, 0, 60, 18, [at(-12, 8)])).toBeCloseTo(21.6);
    // À côté, rien ne le gêne
    expect(labelShift(0, 0, 60, 18, [{ x0: 40, x1: 60, y0: -10, y1: 10 }])).toBe(0);
    // Tout le bas est pris : il monte
    expect(labelShift(0, 0, 60, 18, [at(-12, 70)])).toBeCloseTo(-21.6);
    expect(labelShift(0, 0, 60, 18, [at(-80, 80)])).toBe(null);
  });

  it('une bulle rebondit en apparaissant, et de nouveau quand elle revient', () => {
    const seen = new Map();
    expect(popScale(seen, 'a', 1000)).toBeCloseTo(0);
    const mid = [1050, 1100, 1150, 1200, 1250, 1300].map(now => popScale(seen, 'a', now));
    expect(Math.max(...mid)).toBeGreaterThan(1);
    expect(popScale(seen, 'a', 1000 + POP_MS)).toBe(1);
    expect(popScale(seen, 'a', 2000)).toBeCloseTo(0);
  });

  it('la nuit, les fonds se réchauffent et l’ombre devient une lueur dorée', () => {
    expect(warm(TINT.paper, 0)).toBe(TINT.paper);
    expect(warm(TINT.paper, 1)).not.toBe(TINT.paper);
    const day = {}, night = {};
    softShadow(day, 1, 0);
    softShadow(night, 1, 1);
    expect(day.shadowColor).toBe(`rgba(${RGB.dusk}, .3)`);
    expect(night.shadowColor).toContain(RGB.glow);
    expect(night.shadowBlur).toBeGreaterThan(day.shadowBlur);
    expect(night.shadowOffsetY).toBe(0);
  });
});
