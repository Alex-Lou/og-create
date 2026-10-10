import { describe, expect, it } from 'vitest';
import { islandOf, liveOf, worldOf, resOf, cellsBox, TerrainCache, HS, SEA_Z, TW, TH } from '../src/world/terrain';

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

const M = islandOf(map, 6);

describe('sol de la grande île', () => {
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
  it('place les cases à leur hauteur', () => {
    expect(worldOf(2, 1, 0)).toEqual({ x: TW / 2, y: (3 * TH) / 2 });
    expect(worldOf(2, 1, 2).y).toBe((3 * TH) / 2 - 2 * HS);
  });
  it('la boîte de cases couvre leur dessus en relief et leurs faces jusqu’à la mer', () => {
    const b = cellsBox(M, [[1, 1], [2, 3]]);
    const top = worldOf(1, 1, 2), foot = worldOf(2, 3, SEA_Z);
    expect(b.x).toBeLessThanOrEqual(worldOf(2, 3, 0).x - TW / 2);
    expect(b.x + b.w).toBeGreaterThanOrEqual(worldOf(1, 1, 0).x + TW / 2);
    expect(b.y).toBeLessThanOrEqual(top.y - TH / 2);
    expect(b.y + b.h).toBeGreaterThanOrEqual(foot.y + TH / 2);
  });
});

describe('carrés du sol', () => {
  it('résolution par paliers de √2 : jamais agrandie, au plus 1,41 fois réduite, bornée', () => {
    for (const scale of [0.3, 0.5, 0.8, 1, 1.2, 1.7]) {
      const res = resOf(scale);
      expect(res).toBeGreaterThanOrEqual(scale - 1e-9);
      expect(res / scale).toBeLessThanOrEqual(Math.SQRT2 + 1e-9);
    }
    expect(resOf(0.05)).toBe(0.25);
    expect(resOf(3.6)).toBe(2);
  });
  it('un carré peint toutes les cases qui le touchent, dans l’ordre du relief, et aucune autre', () => {
    const cells = [];
    const cache = new TerrainCache(M, () => 0);
    const r = { x: -20, y: 10, w: 60, h: 40 };
    const gradient = { addColorStop() {} };
    const ctx = new Proxy({}, {
      get: (_target, property) => property === 'createLinearGradient' ? () => gradient : () => {}
    });
    const painted = [];
    cache.veilOf = (x, y) => { painted.push([x, y]); return 0; };
    cache.paint(ctx, r);
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 6; x++) {
        // La terre, et le pont qui traverse la mer
        if (!M.land(x, y) && M.ground(x, y) !== 'b') continue;
        const b = cellsBox(M, [[x, y]]);
        if (b.x < r.x + r.w && b.x + b.w > r.x && b.y < r.y + r.h && b.y + b.h > r.y) cells.push([x, y]);
      }
    }
    expect(painted.map(String).sort()).toEqual(cells.map(String).sort());
    // Diagonale après diagonale (x + y croissant), de gauche à droite
    painted.forEach((c, k) => { if (k) expect(c[0] + c[1] > painted[k - 1][0] + painted[k - 1][1] || (c[0] + c[1] === painted[k - 1][0] + painted[k - 1][1] && c[0] > painted[k - 1][0])).toBe(true); });
  });
  it('ne jette jamais un carré à l’écran, même quand il y en a plus que la réserve', () => {
    const big = islandOf({ height: Array(48).fill('1'.repeat(48)), ground: Array(48).fill('g'.repeat(48)), grid: Array(48).fill('0'.repeat(48)) }, 48);
    const cache = new TerrainCache(big, () => 0);
    let made = 0;
    cache.render = (tx, ty, res) => { made++; return { canvas: { width: 1, height: 1 }, r: { x: tx * 512 / res, y: ty * 512 / res, w: 512 / res, h: 512 / res } }; };
    const ctx = { drawImage() {}, save() {}, restore() {}, beginPath() {}, rect() {}, clip() {} };
    const view = { x: -1500, y: 0, w: 3000, h: 1600 };
    expect(cache.draw(ctx, view, 2, Infinity)).toBe(0);
    const first = made;
    expect(first).toBeGreaterThan(24);
    // Image suivante, même vue : rien n'est refait
    expect(cache.draw(ctx, view, 2, Infinity)).toBe(0);
    expect(made).toBe(first);
  });
  it('un carré avec le décor cuit est distinct d’un carré sans ; le décor changé ne refait que les premiers', () => {
    const big = islandOf({ height: Array(48).fill('1'.repeat(48)), ground: Array(48).fill('g'.repeat(48)), grid: Array(48).fill('0'.repeat(48)) }, 48);
    const cache = new TerrainCache(big, () => 0, () => true);
    const made = [];
    cache.render = (tx, ty, res, bake) => { made.push(bake); return { canvas: { width: 1, height: 1 }, r: { x: tx * 512 / res, y: ty * 512 / res, w: 512 / res, h: 512 / res }, res, bake }; };
    const ctx = { drawImage() {}, save() {}, restore() {}, beginPath() {}, rect() {}, clip() {} };
    const view = { x: -300, y: 0, w: 600, h: 300 };
    cache.draw(ctx, view, 1, Infinity, false);
    const plain = made.length;
    expect(made.every(b => b === false)).toBe(true);
    cache.draw(ctx, view, 1, Infinity, true);
    expect(made.slice(plain).every(b => b === true)).toBe(true);
    expect(made.length).toBeGreaterThan(plain);
    cache.restand();
    expect([...cache.tiles.values()].filter(tile => tile.stale).every(tile => tile.bake)).toBe(true);
    expect([...cache.tiles.values()].some(tile => tile.stale)).toBe(true);
    // Sans dessin du décor (standOf absent), jamais de carré cuit
    const bare = new TerrainCache(big, () => 0);
    const bakes = [];
    bare.render = (tx, ty, res, bake) => { bakes.push(bake); return { canvas: null, r: { x: 0, y: 0, w: 1, h: 1 }, res, bake }; };
    bare.draw(ctx, view, 1, Infinity, true);
    expect(bakes.every(b => b === false)).toBe(true);
  });
});
