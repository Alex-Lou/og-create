// Le pré des poules d’Agathe (world/village/farm.js : coopFieldOf) : au pied de leur cage avant leur poulailler (une
// case autour, une de plus si la place manque), autour du poulailler ensuite
import { describe, it, expect } from 'vitest';
import { coopFieldOf } from '@/world/village/farm';

// Des cases praticables autour du logis : toutes celles du carré de rayon r, sauf celles que free refuse
const around = (free = () => true) => r => {
  const cells = [];
  for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (free(x, y)) cells.push({ x, y });
  return cells;
};
const reach = cells => Math.max(...cells.map(c => Math.max(Math.abs(c.x), Math.abs(c.y))));

describe('le pré des poules', () => {
  it('avant le poulailler : au pied de leur cage, à une case', () => {
    expect(reach(coopFieldOf({ cage: true }, around()))).toBe(1);
  });
  it('la place manque au pied de la cage (rochers, eau) : une case de plus, sans jamais dépasser trois', () => {
    expect(reach(coopFieldOf({ cage: true }, around((x, y) => Math.max(Math.abs(x), Math.abs(y)) > 1)))).toBe(2);
    expect(coopFieldOf({ cage: true }, around(() => false))).toEqual([]);
  });
  it('leur poulailler posé : autour de lui, à trois cases', () => {
    expect(reach(coopFieldOf({ cage: false }, around()))).toBe(3);
  });
  it('sans logis : rien', () => {
    expect(coopFieldOf(null, around())).toEqual([]);
  });
});
