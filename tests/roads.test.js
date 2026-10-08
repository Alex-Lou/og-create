// Le tracé des chemins (game/roads.js) : mêmes règles que le serveur (world/paths.js) pour l'aperçu
import { describe, it, expect } from 'vitest';
import { stepCells, roadBlock, roadCost, bigOf, joined } from '@/game/roads';

describe('le tracé des chemins', () => {
  it('les cases se suivent sous le doigt, côte à côte, sans trou', () => {
    expect(stepCells({ x: 0, y: 0 }, { x: 2, y: 1 })).toEqual([{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 1 }]);
    expect(stepCells({ x: 3, y: 3 }, { x: 3, y: 3 })).toEqual([]);
    expect(stepCells({ x: 2, y: 2 }, { x: 2, y: 0 })).toEqual([{ x: 2, y: 1 }, { x: 2, y: 0 }]);
  });

  it('herbe, sable ou prairie d’un quartier à soi, libre ; ni chemin, ni eau, ni case prise', () => {
    const ground = { '0,0': 'g', '1,0': 's', '2,0': 'm', '3,0': 'p', '4,0': 'w', '5,0': 'g', '6,0': 'g' };
    const ctx = { ground: (x, y) => ground[`${x},${y}`], owned: x => x !== 6, taken: new Set(['5,0']) };
    expect([0, 1, 2].map(x => roadBlock(x, 0, ctx))).toEqual([null, null, null]);
    expect(roadBlock(3, 0, ctx)).toMatch(/déjà un chemin/);
    expect(roadBlock(4, 0, ctx)).toMatch(/herbe/);
    expect(roadBlock(5, 0, ctx)).toMatch(/occupée/);
    expect(roadBlock(6, 0, ctx)).toMatch(/quartiers/);
    // La grande emprise d'un bâtiment (palier IV) : un 2 × 2 en est le coin avant
    expect(bigOf({ x: 5, y: 5, w: 2, h: 2 })).toEqual({ x: 4, y: 4, w: 3, h: 3 });
  });

  it('les cases offertes d’abord, puis une pierre la case ; effacer rend la pierre d’une case payée', () => {
    const lay = n => Array.from({ length: n }, (_, i) => ({ x: i, y: 9 }));
    expect(roadCost(lay(5), [], [], 12)).toEqual({ offered: 5, stone: 0, back: 0 });
    expect(roadCost(lay(5), [], [], 3)).toEqual({ offered: 3, stone: 2, back: 0 });
    // Une case offerte effacée redevient offerte ; une case payée rend sa pierre
    const laid = [[1, 1, 1], [2, 2, 0]];
    expect(roadCost(lay(2), [{ x: 1, y: 1 }, { x: 2, y: 2 }], laid, 0)).toEqual({ offered: 1, stone: 1, back: 1 });
  });

  it('le Puits et le Feu reliés : des cases de chemin de l’un à l’autre', () => {
    const paths = new Set(['3,1', '4,1', '5,1']);
    const ground = (x, y) => (paths.has(`${x},${y}`) ? 'p' : 'g');
    const puits = { x: 1, y: 1, w: 2, h: 2 };
    const feu = { x: 6, y: 0, w: 2, h: 2 };
    expect(joined(ground, puits, feu)).toBe(true);
    paths.delete('4,1');
    expect(joined(ground, puits, feu)).toBe(false);
  });
});
