// La mer de nuit et d'orage (world/sea.js) : les moutons ne naissent que sur l'eau, les reflets que la nuit.
import { describe, expect, it } from 'vitest';
import { drawMoutons, drawRefletsMer, agitationOf } from '@/world/sea';
import { WEATHERS } from '@/world/sky';

// Une toile qui compte ce qu'on y trace
const toile = () => {
  const n = { stroke: 0, fillRect: 0 };
  const noop = () => {};
  return { n, ctx: { save: noop, restore: noop, beginPath: noop, moveTo: noop, quadraticCurveTo: noop, stroke: () => n.stroke++, fillRect: () => n.fillRect++ } };
};
const view = { x: 0, y: 0, w: 400, h: 800 };

describe('la mer de nuit et d’orage', () => {
  it('les moutons naissent quand la mer forcit, et seulement sur l’eau', () => {
    const mer = toile(), terre = toile(), calme = toile();
    drawMoutons(mer.ctx, view, 3, 1, () => true);
    drawMoutons(terre.ctx, view, 3, 1, () => false);
    drawMoutons(calme.ctx, view, 3, 0, () => true);
    expect(mer.n.stroke).toBeGreaterThan(5);
    expect(terre.n.stroke).toBe(0);
    expect(calme.n.stroke).toBe(0);
  });

  it('les lumières se reflètent sur la mer la nuit, pas le jour', () => {
    const lights = [{ x: 200, gy: 300, r: 40, k: 0.8, color: '255,200,120', sol: true }];
    const nuit = toile(), jour = toile();
    drawRefletsMer(nuit.ctx, lights, view, 2, 1);
    drawRefletsMer(jour.ctx, lights, view, 2, 0);
    expect(nuit.n.fillRect).toBe(9);
    expect(jour.n.fillRect).toBe(0);
  });

  it('seule une lumière dont le pied est connu se reflète (sinon le reflet partirait de la flamme, en l’air)', () => {
    const enLAir = toile();
    drawRefletsMer(enLAir.ctx, [{ x: 200, gy: 300, r: 40, k: 0.8, color: '255,200,120' }], view, 2, 1);
    expect(enLAir.n.fillRect).toBe(0);
  });

  it('l’état de la mer suit le temps du jeu : d’huile sous la brume, agitée sous la pluie, déchaînée dans l’orage', () => {
    const jour = new Date(2026, 3, 10, 12);
    const de = kind => agitationOf({ ...WEATHERS[kind] }, jour);
    expect(de('brume')).toBeLessThan(de('clair') + 1e-9);
    expect(de('voile')).toBeGreaterThan(de('clair'));
    expect(de('pluie')).toBeGreaterThan(de('voile'));
    expect(de('orage')).toBeGreaterThan(de('pluie'));
    expect(de('orage')).toBeGreaterThan(0.8);
    for (const kind of Object.keys(WEATHERS)) expect(de(kind)).toBeGreaterThanOrEqual(0);
  });

  it('par beau temps, certains jours la mer se lève un peu, d’autres non', () => {
    const jours = Array.from({ length: 30 }, (_, i) => agitationOf(WEATHERS.clair, new Date(2026, 4, 1 + i, 12)));
    expect(Math.max(...jours) - Math.min(...jours)).toBeGreaterThan(0.12);
    expect(Math.max(...jours)).toBeLessThan(0.35);
  });
});
