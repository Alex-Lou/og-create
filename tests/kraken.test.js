import { describe, expect, it } from 'vitest';
import { KRAKEN_EVERY, KRAKEN_FOR, KRAKEN_DECALE, croiseGeant, krakenAt, GEANT_EVERY, GEANT_FOR } from '../src/world/faune';

const SPOT = { x: 20, y: -6 }, DIR = [1, 0];

describe('le Kraken', () => {
  it('ne croise jamais le Géant des profondeurs, et passe quand même souvent', () => {
    let passe = 0;
    for (let c = 0; c < 200; c++) {
      if (croiseGeant(c)) continue;
      passe++;
      const a = KRAKEN_DECALE + c * KRAKEN_EVERY, b = a + KRAKEN_FOR;
      for (let t = a; t <= b; t += 0.5) expect(t % GEANT_EVERY < GEANT_FOR).toBe(false);
    }
    expect(passe).toBe(200);
  });
  it('il paraît puis s’efface ; ses bras et son œil restent bornés', () => {
    for (const ecrit of [false, true]) {
      expect(krakenAt(SPOT, DIR, 0, ecrit).vis).toBe(0);
      expect(krakenAt(SPOT, DIR, KRAKEN_FOR, ecrit).vis).toBe(0);
      expect(krakenAt(SPOT, DIR, KRAKEN_FOR / 2, ecrit).vis).toBe(1);
      for (let τ = 0; τ <= KRAKEN_FOR; τ += 0.25) {
        const k = krakenAt(SPOT, DIR, τ, ecrit);
        expect(k.oeil).toBeGreaterThanOrEqual(0);
        expect(k.oeil).toBeLessThanOrEqual(1);
        for (const b of k.bras) {
          expect(b.e).toBeGreaterThanOrEqual(0);
          expect(b.e).toBeLessThanOrEqual(1);
          expect(Math.hypot(b.x - k.x, b.y - k.y)).toBeLessThan(2.2);
        }
      }
    }
  });
  it('le présage, pour tous : une seule pointe de tentacule, courte, et l’œil qui s’ouvre une fois', () => {
    const vu = { bras: 0, oeil: 0 };
    let ouvert = false;
    for (let τ = 0; τ <= KRAKEN_FOR; τ += 0.1) {
      const k = krakenAt(SPOT, DIR, τ, false);
      expect(k.bras.length).toBe(1);
      expect(k.bras[0].h).toBeLessThanOrEqual(30);
      if (k.bras[0].e > 0.5) vu.bras++;
      if (k.oeil > 0.1 && !ouvert) vu.oeil++;
      ouvert = k.oeil > 0.1;
    }
    expect(vu.bras).toBeGreaterThan(0);
    expect(vu.oeil).toBe(1);
  });
  it('le spectacle, une fois le Kraken écrit : cinq grands bras dressés ensemble au plus fort, l’œil deux fois', () => {
    const mid = krakenAt(SPOT, DIR, KRAKEN_FOR * 0.55, true);
    expect(mid.bras.length).toBe(5);
    expect(mid.bras.filter(b => b.e > 0.8).length).toBe(5);
    expect(Math.min(...mid.bras.map(b => b.h))).toBeGreaterThan(80);
    expect(krakenAt(SPOT, DIR, 1, true).bras.every(b => b.e === 0)).toBe(true);
    let fois = 0, ouvert = false;
    for (let τ = 0; τ <= KRAKEN_FOR; τ += 0.1) {
      const o = krakenAt(SPOT, DIR, τ, true).oeil > 0.1;
      if (o && !ouvert) fois++;
      ouvert = o;
    }
    expect(fois).toBe(2);
  });
});
