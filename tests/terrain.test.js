import { describe, expect, it } from 'vitest';
import { islandOf, liveOf, worldOf, TerrainCache, HS, SEA_Z, TW, TH } from '../src/world/terrain';

// Petite île de 6 × 6 : un plateau de 2 avec un lac qui se déverse vers l'avant, un chemin qui descend, la mer autour
const map = {
  height: [
    '      ',
    ' 2221 ',
    ' 2210 ',
    ' 1110 ',
    ' 0000 ',
    '      '
  ],
  ground: [
    '~~~~~~',
    '~ggwg~',
    '~gwwp~',
    '~gwpp~',
    '~sssb~',
    '~~~~~~'
  ],
  grid: [
    '......',
    '.0001.',
    '.0001.',
    '.0011.',
    '.1111.',
    '......'
  ]
};

describe('sol de la grande île', () => {
  const M = islandOf(map, 6);
  it('lit relief, sol et quartier ; l’eau douce est un peu sous ses rives, la mer au niveau de la mer', () => {
    expect(M.height(1, 1)).toBe(2);
    expect(M.height(0, 0)).toBe(-1);
    expect(M.ground(3, 1)).toBe('w');
    expect(M.zone(4, 1)).toBe(1);
    expect(M.zone(0, 0)).toBe(-1);
    expect(M.surface(3, 1)).toBe(1.75);
    expect(M.surface(0, 0)).toBe(SEA_Z);
    expect(M.land(1, 4)).toBe(true);
    expect(M.land(4, 4)).toBe(false);
    expect(M.ground(-1, 2)).toBe('~');
  });
  it('trouve les cascades (eau qui tombe d’un palier vers l’avant) et les bords de mer', () => {
    const live = liveOf(M);
    expect(live.water.map(c => `${c.x},${c.y}`).sort()).toEqual(['2,2', '2,3', '3,1', '3,2']);
    // Le lac (2,2) à 2 − 0,25 se déverse vers (2,3) à 1 − 0,25 : une cascade d'un palier, face gauche
    expect(live.falls).toContainEqual({ x: 2, y: 2, side: 0, drop: HS });
    // Écume au pied de la terre, côté mer (vers +x ou +y)
    expect(live.shore).toContainEqual({ x: 1, y: 4, side: 0 });
    expect(live.shore.every(s => M.land(s.x, s.y))).toBe(true);
  });
  it('place les cases à leur hauteur, et les blocs couvrent toutes leurs cases', () => {
    expect(worldOf(2, 1, 0)).toEqual({ x: TW / 2, y: (3 * TH) / 2 });
    expect(worldOf(2, 1, 2).y).toBe((3 * TH) / 2 - 2 * HS);
    const cache = new TerrainCache(islandOf({ height: Array(16).fill(' '.repeat(16)), ground: Array(16).fill('~'.repeat(16)), grid: Array(16).fill('.'.repeat(16)) }, 16), () => 0);
    const b = cache.box(1, 0);
    for (let y = 0; y < 8; y++) {
      for (let x = 8; x < 16; x++) {
        const top = worldOf(x, y, 3), foot = worldOf(x, y, SEA_Z);
        expect(top.x - TW / 2).toBeGreaterThanOrEqual(b.x);
        expect(top.x + TW / 2).toBeLessThanOrEqual(b.x + b.w);
        expect(top.y - TH / 2).toBeGreaterThanOrEqual(b.y);
        expect(foot.y + TH / 2).toBeLessThanOrEqual(b.y + b.h);
      }
    }
  });
});
