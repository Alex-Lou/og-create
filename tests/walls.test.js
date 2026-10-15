// Les murs raccordés (world/wallSprites.js ; choix de l'auteur, 15 oct. : pas de trous visuels aux angles) et le
// battant des portes (WorldView, walls.js : swingStep)
import { describe, it, expect } from 'vitest';
import { wallMask, wallLayer, leafStrokes, leafInFront, ARMS, ALONE_U } from '@/world/wallSprites';
import { swingStep } from '@/components/World/WorldView/walls';

// Les directions d'un masque, en clair (« 1,0 » : vers +x)
const dirs = mask => ARMS.filter((_, i) => mask & (1 << i)).map(([dx, dy]) => `${dx},${dy}`).sort();
const setOf = cells => {
  const s = new Set(cells.map(([x, y]) => `${x},${y}`));
  return (x, y) => s.has(`${x},${y}`);
};
const none = () => false;

describe('les murs raccordés', () => {
  it('une ligne, un angle, un T, une croix : une demi-travée vers chaque voisin', () => {
    const line = setOf([[0, 0], [1, 0], [2, 0]]);
    expect(dirs(wallMask(1, 0, line, none))).toEqual(['-1,0', '1,0']);
    expect(dirs(wallMask(2, 0, line, none))).toEqual(['-1,0']);
    const corner = setOf([[0, 0], [1, 0], [1, 1]]);
    expect(dirs(wallMask(1, 0, corner, none))).toEqual(['-1,0', '0,1']);
    const tee = setOf([[0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(dirs(wallMask(1, 1, tee, none))).toEqual(['-1,0', '0,1', '1,0']);
    const cross = setOf([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(dirs(wallMask(1, 1, cross, none))).toEqual(['-1,0', '0,-1', '0,1', '1,0']);
  });
  it('en biais : une diagonale seulement quand aucun côté ne les relie déjà', () => {
    expect(dirs(wallMask(0, 0, setOf([[0, 0], [1, 1]]), none))).toEqual(['1,1']);
    expect(dirs(wallMask(0, 0, setOf([[0, 0], [1, 0], [1, 1]]), none))).toEqual(['1,0']);
  });
  it('un bâtiment : la ligne qui y entre s’y accroche ; celle qui le longe, non', () => {
    const house = setOf([[3, 0], [3, 1], [3, 2]]);
    // (de face : la ligne continue en face)
    expect(dirs(wallMask(2, 1, setOf([[0, 1], [1, 1], [2, 1]]), house))).toEqual(['-1,0', '1,0']);
    // (le long : x = 2, de haut en bas, contre le bâtiment)
    const along = setOf([[2, 0], [2, 1], [2, 2]]);
    expect(dirs(wallMask(2, 1, along, house))).toEqual(['0,-1', '0,1']);
    // (une pièce seule contre lui s'y accroche)
    expect(dirs(wallMask(2, 1, setOf([[2, 1]]), house))).toEqual(['1,0']);
  });
  it('une pièce seule, sans voisin : 0 (droite dans son sens) ; chaque calque a sa clé et son dessin', () => {
    expect(wallMask(5, 5, setOf([[5, 5]]), none)).toBe(0);
    const alone = wallLayer('cloture', 0);
    expect(alone.key).toBe(`wall-cloture-${ALONE_U}`);
    expect(alone.make().svg).toContain('<polygon');
    expect(wallLayer('muret', 0b1111).make().svg).toContain('<polygon');
    expect(wallLayer('muret', 1 << 4).make().svg).toContain('<polygon');
    expect(wallLayer('porte', 0).key).toBe('wall-porte-poteaux');
    expect(wallLayer('porte', 0).make().svg).toContain('<polygon');
  });
});

describe('le battant d’une porte', () => {
  it('pivote sur son gond : fermé dans l’axe, ouvert vers nous il passe devant ; verrouillé, son cadenas', () => {
    const tip = open => leafStrokes(false, open).find(s => s.line && s.w === 3.4).line[1];
    // (fermé : le bout du battant est sur l'axe u, à droite ; ouvert vers +v : il descend à l'écran, vers −v : il monte)
    expect(tip(1)[1]).toBeGreaterThan(tip(0)[1]);
    expect(tip(-1)[1]).toBeLessThan(tip(0)[1]);
    expect([leafInFront(1), leafInFront(0), leafInFront(-1)]).toEqual([true, false, false]);
    expect(leafStrokes(true, 0).some(s => s.shackle)).toBe(true);
    expect(leafStrokes(false, 0).some(s => s.shackle)).toBe(false);
    expect(leafStrokes(true, 0.4).every(s => (s.line || s.poly || [s.shackle]).flat().every(Number.isFinite))).toBe(true);
  });
  it('s’ouvre, dépasse à peine, puis se referme et rebondit contre son poteau, sans jamais passer de l’autre côté', () => {
    const s = { a: 0, v: 0 };
    let peak = 0;
    for (let i = 0; i < 60; i++) peak = Math.max(peak, swingStep(s, 1, 1 / 60).a);
    expect(peak).toBeGreaterThan(1);
    expect(peak).toBeLessThan(1.2);
    let low = 1;
    for (let i = 0; i < 120; i++) low = Math.min(low, swingStep(s, 0, 1 / 60).a);
    expect(low).toBeGreaterThanOrEqual(0);
    expect(s.a).toBeLessThan(0.02);
  });
});
