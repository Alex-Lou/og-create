import { describe, it, expect } from 'vitest';
import { coupOf, cycleOf } from '@/world/lumiere/eclairs';
import { eclatAt, lueurOf } from '@/world/lumiere/eclat';

const NIVEAUX = [0, 0.14, 0.26, 0.4];
const k = t => (eclatAt(t, 1) || { k: 0 }).k;

describe('éclat des gros coups', () => {
  it('illumine par paliers nets, jamais en fondu, au plus à 40 %', () => {
    const vus = new Set();
    for (let t = 0; t < 800; t += 0.004) { const e = eclatAt(t, 1); if (e) vus.add(e.k); }

    expect([...vus].every(v => NIVEAUX.includes(v))).toBe(true);
    expect(vus.has(0.4)).toBe(true);
  });

  it('vient du côté de l\'éclair', () => {
    for (let t = 0; t < 800; t += 0.01) {
      const e = eclatAt(t, 1);
      if (e) expect(e.x).toBe(coupOf(cycleOf(t)).x);
    }
  });

  it('ne dépasse jamais trois éclats par seconde', () => {
    const montees = [];
    let avant = 0;
    for (let t = 0; t < 1600; t += 0.004) {
      const v = k(t);
      if (v === 0.4 && avant !== 0.4) montees.push(t);
      avant = v;
    }

    expect(montees.length).toBeGreaterThan(10);
    for (let i = 3; i < montees.length; i++) expect(montees[i] - montees[i - 3]).toBeGreaterThan(1);
  });

  it('touche un coup de foudre sur dix environ, ni les lointains, ni hors orage', () => {
    const coups = Array.from({ length: 1000 }, (_, c) => coupOf(c)).filter(c => !c.lointain);
    const part = coups.filter(c => c.gros).length / coups.length;

    expect(part).toBeGreaterThan(0.06);
    expect(part).toBeLessThan(0.15);
    for (let t = 0; t < 400; t += 0.01) {
      const c = coupOf(cycleOf(t));
      if (c.lointain || !c.gros) expect(eclatAt(t, 1)).toBeNull();
      expect(eclatAt(t, 0.3)).toBeNull();
    }
  });

  it('laisse aux coups ordinaires une lueur douce qui suit leur flash', () => {
    expect(lueurOf(null)).toBeNull();
    expect(lueurOf({ flash: 0.01, x: 0.3 })).toBeNull();
    expect(lueurOf({ flash: 1, x: 0.3 })).toEqual({ k: 0.35, x: 0.3 });
  });
});
