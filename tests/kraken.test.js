import { describe, expect, it } from 'vitest';
import { KRAKEN_FOR, krakenNuit, krakenRoute, krakenAt, apercuAt, brasDuFond } from '../src/world/faune';

// Une mer d'eau libre (d : la distance à la terre), une île au milieu
const OPEN = [];
for (let y = -30; y <= 30; y++) for (let x = -30; x <= 30; x++) {
  const d = Math.max(Math.abs(x), Math.abs(y)) - 4;
  if (d > 0) OPEN.push({ x, y, d, dirs: [[1, 0]] });
}
const ROUTE = krakenRoute(OPEN, 3);

describe('le Kraken', () => {
  it('vient rarement : une nuit sur deux environ, presque toujours les nuits d’orage, toujours dans la nuit', () => {
    let calme = 0, orage = 0;
    for (let c = 0; c < 400; c++) {
      if (krakenNuit(c).vient) calme++;
      if (krakenNuit(c, true).vient) orage++;
      const { debut } = krakenNuit(c);
      // (dans la nuit du cycle : de la 70e à la 90e minute, passage compris)
      expect(debut).toBeGreaterThanOrEqual(70 * 60000);
      expect(debut + KRAKEN_FOR * 1000).toBeLessThanOrEqual(90 * 60000);
    }
    expect(calme / 400).toBeGreaterThan(0.3);
    expect(calme / 400).toBeLessThan(0.6);
    expect(orage / 400).toBeGreaterThan(0.8);
  });
  it('il vit au large, loin de l’île : son trajet est tiré pour la nuit, le même pour tous, en eau libre', () => {
    expect(ROUTE.pts.length).toBe(5);
    const S = ROUTE.pts[2];
    expect(OPEN.find(o => o.x === S.x && o.y === S.y).d).toBeGreaterThanOrEqual(6);
    expect(krakenRoute(OPEN, 3)).toEqual(ROUTE);
    expect(krakenRoute(OPEN, 4)).not.toEqual(ROUTE);
    const [E, , , , X] = ROUTE.pts;
    expect(Math.hypot(E.x - S.x, E.y - S.y)).toBeGreaterThan(6);
    expect(Math.hypot(X.x - S.x, X.y - S.y)).toBeGreaterThan(6);
    expect(krakenRoute([], 3)).toBe(null);
  });
  it('il bouge : il nage, s’arrête pour surgir, puis repart ; il paraît et s’efface', () => {
    for (const ecrit of [false, true]) {
      expect(krakenAt(ROUTE, 0, ecrit).vis).toBe(0);
      expect(krakenAt(ROUTE, KRAKEN_FOR, ecrit).vis).toBe(0);
      const a = krakenAt(ROUTE, KRAKEN_FOR * 0.2, ecrit), b = krakenAt(ROUTE, KRAKEN_FOR * 0.3, ecrit);
      expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeGreaterThan(1);
      const s1 = krakenAt(ROUTE, KRAKEN_FOR * 0.45, ecrit), s2 = krakenAt(ROUTE, KRAKEN_FOR * 0.65, ecrit);
      expect(Math.hypot(s2.x - s1.x, s2.y - s1.y)).toBeLessThan(1e-6);
      const c = krakenAt(ROUTE, KRAKEN_FOR * 0.85, ecrit);
      expect(Math.hypot(c.x - s2.x, c.y - s2.y)).toBeGreaterThan(1);
      // en nageant, le dos affleure et le sillage suit ; arrêté, ni l'un ni l'autre
      expect(a.sillage.length + b.sillage.length).toBeGreaterThan(0);
      expect(s1.dos).toBe(0);
      expect(s1.sillage.length).toBe(0);
    }
  });
  it('il surgit d’un coup : l’eau éclate en anneau et l’écran tremble, plus fort pour le spectacle', () => {
    const pic = ecrit => Math.max(...Array.from({ length: 800 }, (_, i) => krakenAt(ROUTE, (i / 800) * KRAKEN_FOR, ecrit).secousse));
    expect(pic(true)).toBeGreaterThan(0.9);
    expect(pic(false)).toBeGreaterThan(0.5);
    expect(pic(false)).toBeLessThan(pic(true));
    expect(krakenAt(ROUTE, KRAKEN_FOR * 0.45, false).vague).toBeGreaterThan(0);
    expect(krakenAt(ROUTE, KRAKEN_FOR * 0.2, false).vague).toBe(0);
  });
  it('le présage, pour tous : deux bras qui jaillissent, l’œil une fois ; le spectacle : cinq grands bras ensemble, l’œil deux fois', () => {
    let fois = { false: 0, true: 0 };
    for (const ecrit of [false, true]) {
      let ouvert = false;
      for (let τ = 0; τ <= KRAKEN_FOR; τ += 0.1) {
        const k = krakenAt(ROUTE, τ, ecrit);
        expect(k.oeil).toBeGreaterThanOrEqual(0);
        expect(k.oeil).toBeLessThanOrEqual(1);
        for (const b of k.bras) {
          expect(b.e).toBeGreaterThanOrEqual(0);
          expect(b.e).toBeLessThanOrEqual(1);
          expect(Math.hypot(b.x - k.x, b.y - k.y)).toBeLessThan(2.2);
        }
        if (k.oeil > 0.1 && !ouvert) fois[ecrit]++;
        ouvert = k.oeil > 0.1;
      }
    }
    expect(fois.false).toBe(1);
    expect(fois.true).toBe(2);
    expect(krakenAt(ROUTE, KRAKEN_FOR * 0.5, false).bras.length).toBe(2);
    expect(Math.max(...krakenAt(ROUTE, KRAKEN_FOR * 0.5, false).bras.map(b => b.h))).toBeLessThan(80);
    const mid = krakenAt(ROUTE, KRAKEN_FOR * 0.55, true);
    expect(mid.bras.filter(b => b.e > 0.8).length).toBe(5);
    expect(Math.min(...mid.bras.map(b => b.h))).toBeGreaterThan(80);
  });
  it('ses bras se dessinent du fond vers l’avant, et chacun s’enroule vers l’extérieur', () => {
    const k = krakenAt(ROUTE, KRAKEN_FOR * 0.55, true);
    const fond = brasDuFond(k).map(b => b.x + b.y);
    fond.forEach((d, i) => i && expect(d).toBeGreaterThanOrEqual(fond[i - 1]));
    for (const b of k.bras) expect(b.cote).toBe((b.x - k.x) - (b.y - k.y) < 0 ? -1 : 1);
  });
  it('dans l’orage, à la lueur d’un coup de foudre sur trois environ, un bras entrevu qui replonge aussitôt', () => {
    expect(apercuAt(100, 0)).toBe(null);
    let vus = 0;
    const coups = new Set();
    for (let t = 0; t < 6.4 * 300; t += 0.05) {
      const ap = apercuAt(t, 1);
      if (!ap) continue;
      vus++;
      coups.add(ap.coup);
      expect(ap.e).toBeGreaterThanOrEqual(0);
      expect(ap.e).toBeLessThanOrEqual(1);
    }
    expect(vus).toBeGreaterThan(0);
    expect(coups.size / 300).toBeGreaterThan(0.12);
    expect(coups.size / 300).toBeLessThan(0.4);
  });
});
