import { describe, expect, it } from 'vitest';
import { PHENIX_FOR, phenixHeure, phenixAt, lumierePhenix } from '../src/world/phenix';

const depart = { x: 100, y: 54, g: 100 };
const centre = { x: 400, y: 300 };

describe('le vol du Phénix', () => {
  it('ne vole que du coucher du soleil à l’aube', () => {
    expect(phenixHeure({ id: 'noon', night: 0 })).toBe(false);
    expect(phenixHeure({ id: 'afternoon', night: 0 })).toBe(false);
    expect(phenixHeure({ id: 'sunset', night: 0.05 })).toBe(true);
    expect(phenixHeure({ id: 'dusk', night: 0.3 })).toBe(true);
    expect(phenixHeure({ id: 'night', night: 1 })).toBe(true);
    expect(phenixHeure(null)).toBe(false);
  });
  it('part de la place de Brume et y revient, en petite flamme', () => {
    expect(phenixAt(depart, centre, 300, -1)).toBeNull();
    expect(phenixAt(depart, centre, 300, PHENIX_FOR)).toBeNull();
    const debut = phenixAt(depart, centre, 300, 0);
    const fin = phenixAt(depart, centre, 300, PHENIX_FOR - 1e-3);
    for (const p of [debut, fin]) {
      expect(Math.hypot(p.x - depart.x, p.y - depart.y)).toBeLessThan(1);
      expect(p.forme).toBeLessThan(0.05);
      expect(p.ailes).toBe(0);
    }
  });
  it('fait le tour de ce qu’on regarde, ailes déployées, en semant des braises', () => {
    const angles = [];
    for (let τ = PHENIX_FOR * 0.3; τ < PHENIX_FOR * 0.75; τ += 0.5) {
      const p = phenixAt(depart, centre, 300, τ);
      expect(p.forme).toBe(1);
      expect(p.ailes).toBe(1);
      expect(p.trace.length).toBeGreaterThan(10);
      // (en l'air, au-dessus du sol, et autour du centre)
      expect(p.y).toBeLessThan(p.g - 100);
      expect(Math.abs(p.x - centre.x)).toBeLessThan(330);
      angles.push(Math.atan2((p.g - centre.y) / 0.42, p.x - centre.x));
    }
    // (il passe des deux côtés du centre)
    expect(Math.max(...angles) - Math.min(...angles)).toBeGreaterThan(Math.PI);
  });
  it('éclaire le sol sous lui, plus fort la nuit', () => {
    const p = phenixAt(depart, centre, 300, PHENIX_FOR / 2);
    const nuit = lumierePhenix(p, 1), soir = lumierePhenix(p, 0.1);
    expect(nuit.gy).toBe(p.g);
    expect(nuit.k).toBeGreaterThan(soir.k);
  });
});
