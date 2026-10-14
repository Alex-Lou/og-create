import { describe, it, expect } from 'vitest';
import { geantAt, GEANT_FOR } from '@/world/faune/geant';

const spot = { x: 50, y: 60 };

describe('Géant des profondeurs', () => {
  it('paraît, puis s\'efface, en nageant droit sur son chemin', () => {
    const debut = geantAt(spot, [1, 0], 0), milieu = geantAt(spot, [1, 0], GEANT_FOR / 2), fin = geantAt(spot, [1, 0], GEANT_FOR);

    expect(debut.vis).toBe(0);
    expect(fin.vis).toBe(0);
    expect(milieu.vis).toBe(1);
    expect(milieu).toMatchObject({ x: 50, y: 60 });
    expect(fin.x - debut.x).toBe(24);
    expect(fin.y).toBe(60);
  });

  it('monte des profondeurs, souffle à mi-chemin, puis replonge', () => {
    const haut = k => geantAt(spot, [0, 1], k * GEANT_FOR).haut;

    expect(haut(0.55)).toBeGreaterThan(0.95);
    expect(haut(0.15)).toBeLessThan(0.45);
    expect(haut(0.9)).toBeLessThan(0.45);
    expect(geantAt(spot, [0, 1], 0.4 * GEANT_FOR).souffle).toBeNull();
    expect(geantAt(spot, [0, 1], 0.55 * GEANT_FOR).souffle).toBeCloseTo(0.5);
  });
});
