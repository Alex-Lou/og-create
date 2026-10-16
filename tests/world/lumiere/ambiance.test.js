// L'ambiance (world/lumiere/ambiance.js) : ce qui flotte dans l'air de près (faisceaux, et les nappes et lucioles de la
// veillée) s'efface en vue large, où des centaines de traits fins feraient une averse.
import { describe, expect, it } from 'vitest';
import { deLoin } from '@/world/lumiere/ambiance';

describe('ambiance', () => {
  it('de près tout est là, en vue large rien, et entre les deux un fondu sans à-coup', () => {
    expect(deLoin(1)).toBe(1);
    expect(deLoin(0.45)).toBe(1);
    expect(deLoin(0.2)).toBe(0);
    expect(deLoin(0.04)).toBe(0);
    const pas = [0.2, 0.25, 0.3, 0.35, 0.4, 0.45].map(deLoin);
    pas.slice(1).forEach((v, i) => expect(v).toBeGreaterThan(pas[i]));
  });
});
