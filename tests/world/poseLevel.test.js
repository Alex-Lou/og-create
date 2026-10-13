import { describe, expect, it } from 'vitest';
import { pickSpot, spotsOnLevel, startLevel } from '@/world/poseLevel';

// Une île à deux niveaux : le plateau (niveau 1) sur x ≥ 5, le sol (0) ailleurs
const levelAt = x => (x >= 5 ? 1 : 0);
const spots = [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 6, y: 1 }, { x: 7, y: 2 }];
// Sous le doigt, de l'avant vers l'arrière : la case du plateau (6, 1) recouvre la case du sol (2, 1) derrière elle
const under = cells => keep => cells.find(c => !keep || keep(c.x, c.y)) || null;

describe('les cases dorées d’une pose, un niveau à la fois', () => {
  it('seules les cases du niveau actif s’allument (toutes s’il n’y en a pas, ou sans niveau)', () => {
    expect(spotsOnLevel(spots, 1, levelAt)).toEqual([{ x: 6, y: 1 }, { x: 7, y: 2 }]);
    expect(spotsOnLevel(spots, 0, levelAt)).toEqual([{ x: 1, y: 1 }, { x: 2, y: 1 }]);
    expect(spotsOnLevel(spots, 3, levelAt)).toBe(spots);
    expect(spotsOnLevel(spots, null, levelAt)).toBe(spots);
  });

  it('part du niveau du bâtiment, ou de celui de la première case dorée', () => {
    expect(startLevel(1, spots, levelAt)).toBe(1);
    expect(startLevel(2, spots, levelAt)).toBe(0);
    expect(startLevel(0, [], levelAt)).toBe(null);
  });

  it('au sol, la case dorée du sol sous le plateau se touche', () => {
    const tileAt = under([{ x: 6, y: 1 }, { x: 2, y: 1 }]);
    expect(pickSpot({ spots, level: 0, levelAt, tileAt })).toEqual({ cell: { x: 2, y: 1 }, level: 0 });
  });

  it('sur le plateau, la même place prend la case du plateau', () => {
    const tileAt = under([{ x: 6, y: 1 }, { x: 2, y: 1 }]);
    expect(pickSpot({ spots, level: 1, levelAt, tileAt })).toEqual({ cell: { x: 6, y: 1 }, level: 1 });
  });

  it('un toucher où le niveau actif n’a rien de doré passe au niveau sous le doigt', () => {
    // au sol, sur le plateau sans case dorée du sol derrière : on passe au plateau, la case dorée est prise
    expect(pickSpot({ spots, level: 0, levelAt, tileAt: under([{ x: 7, y: 2 }, { x: 3, y: 2 }]) })).toEqual({ cell: { x: 7, y: 2 }, level: 1 });
    // sur le plateau, un toucher sur le sol : on passe au sol, rien n'est pris si la case n'est pas dorée
    expect(pickSpot({ spots, level: 1, levelAt, tileAt: under([{ x: 3, y: 3 }]) })).toEqual({ cell: null, level: 0 });
    // la mer : rien ne change
    expect(pickSpot({ spots, level: 1, levelAt, tileAt: under([]) })).toEqual({ cell: null, level: 1 });
  });
});
