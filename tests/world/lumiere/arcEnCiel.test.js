import { describe, it, expect } from 'vitest';
import { arcApresAverse, arcForce, eveilOf, arcGeometrie, traceOf, voileArc, TRACE_MS } from '@/world/lumiere/arcEnCiel';
import { worldOf, TW } from '@/world/terrain';
import { phase } from './phase';

describe('arc-en-ciel', () => {
  it('suit l\'averse écrite une trentaine de secondes, puis s\'efface', () => {
    expect(arcApresAverse(-1)).toBe(0);
    expect(arcApresAverse(0)).toBe(1);
    expect(arcApresAverse(20000)).toBe(1);
    expect(arcApresAverse(28000)).toBeGreaterThan(0);
    expect(arcApresAverse(28000)).toBeLessThan(1);
    expect(arcApresAverse(40000)).toBe(0);
  });

  it('ne paraît que de jour, après la pluie de la météo ou l\'averse écrite', () => {
    const jour = phase({ sun: { up: 0.6, progress: 0.5 }, weather: { rainbow: 0.7 } });
    const nuit = phase({ sun: { up: 0, progress: 0 }, weather: { rainbow: 0.7 } });
    const sec = phase({ sun: { up: 0.6, progress: 0.5 }, weather: { rainbow: 0 } });

    expect(arcForce(jour)).toBeCloseTo(0.7);
    expect(arcForce(jour, 1)).toBe(1);
    expect(arcForce(nuit, 1)).toBe(0);
    expect(arcForce(sec)).toBe(0);
  });

  it('cerne la partie réveillée de l\'île', () => {
    const awake = (x, y) => x >= 94 && x < 103 && y >= 90 && y < 99;

    expect(eveilOf(144, awake)).toEqual({ x0: 94, y0: 90, x1: 102, y1: 98 });
    expect(eveilOf(144, () => false)).toBeNull();
  });

  it('l\'enjambe d\'une pointe à l\'autre, au-dessus de son sommet', () => {
    const box = { x0: 94, y0: 90, x1: 102, y1: 98 };
    const a = arcGeometrie(box);
    const gauche = worldOf(box.x0, box.y1), droite = worldOf(box.x1, box.y0), haut = worldOf(box.x0, box.y0);

    expect(a.cx - a.r).toBeLessThan(gauche.x - TW / 2);
    expect(a.cx + a.r).toBeGreaterThan(droite.x + TW / 2);
    expect(a.cy).toBe((gauche.y + droite.y) / 2);
    expect(a.cy - a.r).toBeLessThan(haut.y);
  });

  it('se trace d\'un pied à l\'autre, les pieds fondus', () => {
    expect(traceOf(0)).toBe(0);
    expect(traceOf(TRACE_MS)).toBe(1);
    expect(traceOf(0, true)).toBe(1);
    // à mi-tracé : la gauche se voit, la droite pas encore
    expect(voileArc(0.15, 0.5)).toBeGreaterThan(0.9);
    expect(voileArc(0.4, 0.5)).toBe(0);
    // tracé fini : le sommet en plein, les pieds fondus, rien sous l'horizon
    expect(voileArc(0.25, 1)).toBe(1);
    expect(voileArc(0.005, 1)).toBeLessThan(0.1);
    expect(voileArc(0.495, 1)).toBeLessThan(0.1);
    expect(voileArc(0.6, 1)).toBe(0);
  });
});
