// Le pré des poules d’Agathe (world/village/farm.js : coopFieldOf) : au pied de leur cage avant leur poulailler (une
// case autour, une de plus si la place manque), autour du poulailler ensuite
import { describe, it, expect } from 'vitest';
import { coopFieldOf, emptyCageOf } from '@/world/village/farm';

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

// La cage vide, à démonter (choix de l'auteur, 15 oct.) : ouverte et le poulailler posé ; coincée, ou sans poulailler, non
describe('la cage vide', () => {
  const cage = art => ({ id: 'cage', art, x: 101, y: 98, w: 1, h: 1 });
  const coop = [{ annex: 'poulailler', x: 103, y: 95 }];
  it('ouverte, le poulailler posé : la cage du camp', () => {
    const open = cage('cage_ouverte');
    expect(emptyCageOf({ camp: [open], annexes: coop })).toBe(open);
  });
  it('sans poulailler, coincée, ou déjà démontée : null', () => {
    expect(emptyCageOf({ camp: [cage('cage_ouverte')], annexes: [] })).toBeNull();
    expect(emptyCageOf({ camp: [cage('cage_coincee')], annexes: coop })).toBeNull();
    expect(emptyCageOf({ camp: [], annexes: coop })).toBeNull();
  });
});
