import { describe, it, expect } from 'vitest';
import { sheetMesh, curlOf, easeOut, easeBack, gestureOf, commits } from '@/book/curlGeometry';

// La page qui tourne : sa grille, son pli, ses courbes, et les règles du geste (la sensation du Livre au toucher)
describe('la page qui tourne', () => {
  it('la grille de la feuille : des sommets de 0 à 1, deux triangles par case', () => {
    const { verts, idx } = sheetMesh(2, 1);
    expect([...verts]).toEqual([0, 0, 0.5, 0, 1, 0, 0, 1, 0.5, 1, 1, 1]);
    expect([...idx]).toEqual([0, 3, 1, 1, 3, 4, 1, 4, 2, 2, 4, 5]);
  });

  it('le pli : rond quand le doigt part, à plat quand la feuille est retombée, jamais trop penché', () => {
    const w = 1000, P0 = { x: w, y: 500 }, Fend = { x: -w, y: 500 };
    const start = curlOf(P0, { x: w, y: 500 }, Fend, w);
    expect(start).toMatchObject({ progress: 0, r: 100, ux: 1, uy: 0 });
    const end = curlOf(P0, { x: -w, y: 500 }, Fend, w);
    expect(end.progress).toBe(1);
    expect(end.r).toBeCloseTo(2);
    // Un doigt tiré très en biais : l'angle du pli reste sous 0,55 rad au départ
    const steep = curlOf(P0, { x: w - 50, y: 0 }, Fend, w);
    expect(Math.asin(Math.abs(steep.uy))).toBeLessThanOrEqual(0.55 + 1e-9);
  });

  it('les courbes : de 0 à 1 ; la feuille qui revient dépasse un peu avant de se poser', () => {
    expect([easeOut(0), easeOut(1), easeBack(0), easeBack(1)]).toEqual([0, 1, 0, 1]);
    expect(Math.max(...[0.6, 0.7, 0.8, 0.9].map(easeBack))).toBeGreaterThan(1);
  });

  it('le geste : au-delà de 9 px en largeur (même en biais) on tourne, au-delà de 14 px en hauteur on fait défiler', () => {
    expect(gestureOf(10, 0)).toBe('turn');
    expect(gestureOf(-10, 10)).toBe('turn');
    expect(gestureOf(5, 20)).toBe('scroll');
    expect(gestureOf(5, 5)).toBe(null);
    expect(gestureOf(0, 14)).toBe(null);
  });

  it('au lâcher : un geste vif tourne la page ; sinon il en faut plus de 30 %, sauf un geste vif en sens contraire', () => {
    expect(commits(0.5, 0)).toBe(true);
    expect(commits(0, 0.31)).toBe(true);
    expect(commits(-0.5, 0.9)).toBe(false);
    expect(commits(0, 0.2)).toBe(false);
  });
});
