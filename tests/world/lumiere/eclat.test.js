import { describe, it, expect } from 'vitest';
import { coupOf, cycleOf } from '@/world/lumiere/eclairs';
import { eclatAt } from '@/world/lumiere/eclat';

const NIVEAUX = [0, 0.21, 0.43, 0.64, 0.85];

describe('éclat des gros coups', () => {
  it('blanchit par paliers nets, jamais en fondu', () => {
    const vus = new Set();
    for (let t = 0; t < 200; t += 0.004) vus.add(eclatAt(t, 1));

    expect([...vus].every(k => NIVEAUX.includes(k))).toBe(true);
    expect(vus.has(0.85)).toBe(true);
  });

  it('ne dépasse jamais trois éclats par seconde', () => {
    const montees = [];
    let avant = 0;
    for (let t = 0; t < 400; t += 0.004) {
      const k = eclatAt(t, 1);
      if (k === 0.85 && avant !== 0.85) montees.push(t);
      avant = k;
    }

    expect(montees.length).toBeGreaterThan(10);
    for (let i = 3; i < montees.length; i++) expect(montees[i] - montees[i - 3]).toBeGreaterThan(1);
  });

  it('touche un coup de foudre sur quatre ou cinq, ni les lointains, ni hors orage', () => {
    const coups = Array.from({ length: 400 }, (_, c) => coupOf(c)).filter(c => !c.lointain);
    const part = coups.filter(c => c.gros).length / coups.length;

    expect(part).toBeGreaterThan(0.14);
    expect(part).toBeLessThan(0.3);
    for (let t = 0; t < 120; t += 0.01) {
      const c = coupOf(cycleOf(t));
      if (c.lointain || !c.gros) expect(eclatAt(t, 1)).toBe(0);
      expect(eclatAt(t, 0.3)).toBe(0);
    }
  });
});
