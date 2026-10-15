// Les enclos de l'île (world/enclosures.js ; choix de l'auteur, 15 oct.) : une boucle de murs, fermée aussi par un
// bâtiment ou l'eau ; ses trous où il manque une porte ; jamais le reste de l'île
import { describe, it, expect } from 'vitest';
import { enclosuresOf, inWall } from '@/world/enclosures';

// Une petite île : '~' l'eau, '.' la terre, '#' une clôture, 'B' un bâtiment, 'p' un sentier (une porte peut y aller)
function islandOf(rows) {
  const size = Math.max(rows.length, ...rows.map(r => r.length));
  const at = (x, y) => (rows[y] && rows[y][x]) || '~';
  return {
    size,
    land: (x, y) => at(x, y) !== '~',
    wall: (x, y) => '#B'.includes(at(x, y)),
    fence: (x, y) => at(x, y) === '#',
    open: (x, y) => '.p'.includes(at(x, y))
  };
}

describe('les enclos', () => {
  it('une boucle de clôtures fermée : son intérieur, sans trou', () => {
    const map = islandOf([
      '~~~~~~~~~~',
      '~........~',
      '~.#####..~',
      '~.#...#..~',
      '~.#...#..~',
      '~.#####..~',
      '~........~',
      '~~~~~~~~~~'
    ]);
    const [pen, ...rest] = enclosuresOf(map);
    expect(rest).toEqual([]);
    expect(pen.cells.length).toBe(6);
    expect(pen.gaps).toEqual([]);
    expect(pen.fences.length).toBe(10);
  });

  it('un sentier qui traverse la boucle : presque fermé, il y manque une porte', () => {
    const map = islandOf([
      '~~~~~~~~~~',
      '~...p....~',
      '~.##p##..~',
      '~.#.p.#..~',
      '~.#...#..~',
      '~.#####..~',
      '~........~',
      '~~~~~~~~~~'
    ]);
    const [pen] = enclosuresOf(map);
    expect(pen.gaps).toEqual([{ x: 4, y: 2 }]);
    expect(pen.cells.length).toBe(6);
  });

  it('l’eau et un bâtiment ferment l’enclos comme un mur ; une boucle ouverte n’en est pas un', () => {
    const shore = islandOf([
      '~~~~~~~~',
      '~..B...~',
      '~..#...~',
      '~..#####',
      '~......~',
      '~~~~~~~~'
    ]);
    const [cove] = enclosuresOf(shore);
    expect(cove.cells.map(c => `${c.x},${c.y}`).sort()).toEqual(['4,1', '4,2', '5,1', '5,2', '6,1', '6,2'].sort());
    const open = islandOf([
      '~~~~~~~~~~',
      '~........~',
      '~.###.#..~',
      '~.#...#..~',
      '~.#####..~',
      '~........~',
      '~~~~~~~~~~'
    ]);
    // (le trou en haut n'est pas « dans le mur » : deux cases de large… si, une seule : elle compte comme un trou)
    expect(enclosuresOf(open).map(p => p.gaps)).toEqual([[{ x: 5, y: 2 }]]);
    const wide = islandOf([
      '~~~~~~~~~~',
      '~........~',
      '~.##..#..~',
      '~.#...#..~',
      '~.#####..~',
      '~........~',
      '~~~~~~~~~~'
    ]);
    expect(enclosuresOf(wide)).toEqual([]);
  });

  it('un enclos fin, pris entre une clôture et un bâtiment : son intérieur n’est pas un trou', () => {
    const map = islandOf([
      '~~~~~~~~~',
      '~.......~',
      '~.#####.~',
      '~.#...#.~',
      '~.#BBB#.~',
      '~.#####.~',
      '~.......~',
      '~~~~~~~~~'
    ]);
    const [pen, ...rest] = enclosuresOf(map);
    expect(rest).toEqual([]);
    expect([pen.cells.length, pen.gaps]).toEqual([3, []]);
  });

  it('dans le mur : deux murs face à face', () => {
    const walls = new Set(['1,0', '1,2']);
    expect(inWall(1, 1, (x, y) => walls.has(`${x},${y}`))).toBe(true);
    expect(inWall(2, 1, (x, y) => walls.has(`${x},${y}`))).toBe(false);
  });
});
