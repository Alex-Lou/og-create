import { describe, expect, it } from 'vitest';
import { layoutSky, nearestStar, starOffset } from '@/utils/sky';

const fams = [
  { key: 'A', total: 4, found: ['Eau', 'Feu', 'Terre', 'Air'] },
  { key: 'B', total: 10, found: ['Lave', 'Verre'] },
  { key: 'C', total: 3, found: ['Vie'] },
  { key: 'D', total: 6, found: ['Métal'] }
];

describe('ciel du registre', () => {
  it('chaque élément connu a sa place, chaque élément inconnu une place vide', () => {
    const sky = layoutSky(fams);
    expect(Object.keys(sky.home).sort()).toEqual(['Air', 'Eau', 'Feu', 'Lave', 'Métal', 'Terre', 'Verre', 'Vie']);
    expect(sky.sockets.length).toBe(0 + 8 + 2 + 5);
    expect(sky.families.map(f => f.key)).toEqual(['A', 'B', 'C', 'D']);
  });
  it('est déterministe et ne déplace pas les étoiles déjà placées quand une découverte arrive', () => {
    const before = layoutSky(fams).home;
    const after = layoutSky([fams[0], { ...fams[1], found: ['Lave', 'Verre', 'Obsidienne'] }, fams[2], fams[3]]).home;
    expect(after.Lave).toEqual(before.Lave);
    expect(after.Verre).toEqual(before.Verre);
    expect(after.Obsidienne).toBeDefined();
  });
  it('les étoiles d\'une constellation ne se chevauchent pas', () => {
    const pts = Array.from({ length: 150 }, (_, i) => starOffset(i));
    let min = Infinity;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) min = Math.min(min, Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y));
    expect(min).toBeGreaterThan(84);
  });
  it('les constellations ne se chevauchent pas', () => {
    const sky = layoutSky(fams);
    for (const a of sky.families) for (const b of sky.families) {
      if (a === b) continue;
      expect(Math.hypot(a.cx - b.cx, a.cy - b.cy)).toBeGreaterThan(a.spread + b.spread);
    }
  });
  it('trouve l\'étoile la plus proche dans un rayon', () => {
    const pos = { A: { x: 0, y: 0 }, B: { x: 30, y: 0 }, C: { x: 100, y: 0 } };
    expect(nearestStar(pos, ['A', 'B', 'C'], 25, 0, 40)).toBe('B');
    expect(nearestStar(pos, ['A', 'B', 'C'], 25, 0, 40, 'B')).toBe('A');
    expect(nearestStar(pos, ['A', 'B', 'C'], 60, 0, 10)).toBeNull();
  });
});
