// Les enclos de l'île (world/enclosures.js ; choix de l'auteur, 15 oct.) : une boucle de murs, fermée aussi par un
// bâtiment ou l'eau ; ses trous où il manque une porte ; jamais le reste de l'île
import { describe, it, expect } from 'vitest';
import { enclosuresOf, inWall, loopHintOf } from '@/world/enclosures';

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

  // (le trait en cours : les 'T' de la carte, dans l'ordre donné ; une case libre de terre est permise, pas un sentier)
  const hintOf = (rows, trace) => {
    const map = islandOf(rows.map(r => r.replace(/T/g, '.')));
    const at = (x, y) => (rows[y] && rows[y][x]) || '~';
    return loopHintOf({ ...map, spot: (x, y) => at(x, y) === '.', trace: trace.map(([x, y]) => ({ x, y })), before: new Set(enclosuresOf(map).map(p => p.key)) });
  };

  // (une île assez grande pour que la côte ne ferme rien : le motif, au milieu de terre libre)
  const wideOf = pattern => {
    const w = pattern[0].length + 16;
    const blank = '~' + '.'.repeat(w - 2) + '~';
    return ['~'.repeat(w), ...Array(7).fill(blank), ...pattern.map(r => `~.......${r}.......~`), ...Array(7).fill(blank), '~'.repeat(w)];
  };
  const shift = trace => trace.map(([x, y]) => [x + 8, y + 8]);
  const keys = hint => hint.cells.map(c => `${c.x - 8},${c.y - 8}`).sort();

  it('la boucle suggérée : un U tracé, le côté qui manque', () => {
    const rows = wideOf([
      'T...T',
      'T...T',
      'T...T',
      'TTTTT'
    ]);
    const hint = hintOf(rows, shift([[0, 0], [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [4, 2], [4, 1], [4, 0]]));
    expect(hint.closes).toBe(false);
    expect(keys(hint)).toEqual(['1,0', '2,0', '3,0']);
  });

  it('le trait fermé de lui-même ; un trait droit (rien à fermer près de lui) ; trop court', () => {
    const ring = wideOf(['TTT', 'T.T', 'TTT']);
    expect(hintOf(ring, shift([[0, 0], [1, 0], [2, 0], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1]]))).toEqual({ cells: [], closes: true });
    const line = wideOf(['TTTT']);
    expect(hintOf(line, shift([[0, 0], [1, 0], [2, 0], [3, 0]]))).toBe(null);
    expect(hintOf(line, shift([[0, 0], [1, 0]]))).toBe(null);
  });

  it('la côte proche ferme aussi : deux piquets jusqu’à l’eau', () => {
    const rows = [
      '~~~~~~~~~',
      '~.......~',
      '~.T...T.~',
      '~.TTTTT.~',
      '~.......~',
      '~.......~',
      '~.......~',
      '~~~~~~~~~'
    ];
    const hint = hintOf(rows, [[2, 2], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [6, 2]]);
    // (deux cases suffisent, d'un côté ou de l'autre)
    expect(hint.cells).toHaveLength(2);
    expect(hint.cells.map(c => `${c.x},${c.y}`)).toContain('2,1');
  });

  it('la boucle passe par un bâtiment sans rien coûter', () => {
    const rows = wideOf([
      'TTTTB',
      'T...B',
      'T...B',
      'T....'
    ]);
    const hint = hintOf(rows, shift([[3, 0], [2, 0], [1, 0], [0, 0], [0, 1], [0, 2], [0, 3]]));
    // (d'une case à l'autre par un côté, jamais en diagonale : le coin du bâtiment se rejoint d'une case de plus)
    expect(keys(hint)).toEqual(['1,3', '2,3', '3,3', '4,3']);
  });

  it('un sentier sur la boucle : il reste libre, pour la porte', () => {
    const rows = wideOf([
      'T.p.T',
      'T...T',
      'TTTTT'
    ]);
    const hint = hintOf(rows, shift([[0, 0], [0, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [4, 1], [4, 0]]));
    expect(keys(hint)).toEqual(['1,0', '3,0']);
  });
});
