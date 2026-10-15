// Les enclos de l'île (choix de l'auteur, 15 oct.) : une boucle de clôtures, de murets et de portes, que ferment aussi
// les bâtiments, le camp et l'eau. Sans état : tout se déduit de la carte et de ce qui est posé.
// Un enclos, c'est une poche de terre que les murs (et l'eau) séparent du reste de l'île, et que touchent des clôtures.
// Une case où une porte pourrait aller, entre deux murs bâtis face à face dont une clôture (pas l'eau : le rivage n'est
// pas un trou), compte comme un trou de la boucle : sans porte, l'enclos est « presque fermé » (un sentier le traverse).

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
// Une poche plus grande n'est pas un enclos (c'est l'île, ou une grande part d'elle) ; il en faut au moins tant de
// clôtures autour
const MAX_CELLS = 600;
const MIN_FENCES = 3;

// Dans le mur : un mur de chaque côté, à gauche et à droite, ou en haut et en bas (serveur : crafts.inWall)
export const inWall = (x, y, wall) => (wall(x - 1, y) && wall(x + 1, y)) || (wall(x, y - 1) && wall(x, y + 1));

// size : la carte (size × size) ; land(x, y) ; wall(x, y) : un mur posé ou bâti (création-mur, bâtiment, camp ; l'eau
// en est un d'office) ; fence(x, y) : une création-mur (clôture, muret, porte) ; open(x, y) : une case où une porte
// pourrait aller (libre, sol permis). [{ key, cells, gaps, fences }] : key, la plus petite case (y × size + x) de
// l'enclos, qui le nomme ; cells, son intérieur ; gaps, les trous de sa boucle (où il manque une porte) ; fences, ses
// clôtures et portes
export function enclosuresOf({ size, land, wall, fence, open }) {
  const inside = (x, y) => x >= 0 && y >= 0 && x < size && y < size;
  const blocked = (x, y) => !inside(x, y) || !land(x, y) || wall(x, y);
  const built = (x, y) => inside(x, y) && land(x, y) && wall(x, y);
  const fenced = (x, y) => inside(x, y) && land(x, y) && fence(x, y);
  // (une case entre deux murs bâtis face à face, dont une clôture, où une porte pourrait aller : peut-être un trou)
  const maybe = (x, y) => !blocked(x, y) && open(x, y) && inWall(x, y, built)
    && DIRS.some(([dx, dy]) => fenced(x + dx, y + dy));
  // Les poches de terre, les cases de cut (des trous possibles) faisant barrière : { label (n° de poche par case, -1
  // ailleurs), pockets }
  const pocketsOf = cut => {
    const label = new Int32Array(size * size).fill(-1);
    const pockets = [];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (label[y * size + x] >= 0 || blocked(x, y) || cut(x, y)) continue;
        const id = pockets.length;
        const pocket = { cells: [], gaps: new Map(), fences: new Map(), edge: false };
        pockets.push(pocket);
        label[y * size + x] = id;
        const stack = [[x, y]];
        while (stack.length) {
          const [cx, cy] = stack.pop();
          pocket.cells.push({ x: cx, y: cy });
          for (const [dx, dy] of DIRS) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (!inside(nx, ny)) {
              pocket.edge = true;
              continue;
            }
            const k = ny * size + nx;
            if (blocked(nx, ny)) {
              if (fenced(nx, ny)) pocket.fences.set(k, { x: nx, y: ny });
            } else if (cut(nx, ny)) pocket.gaps.set(k, { x: nx, y: ny });
            else if (label[k] < 0) {
              label[k] = id;
              stack.push([nx, ny]);
            }
          }
        }
      }
    }
    return { label, pockets };
  };
  // (la plus grande poche est le reste de l'île : le dehors)
  const biggestOf = pockets => pockets.reduce((a, b, i) => (a < 0 || b.cells.length > pockets[a].cells.length ? i : a), -1);
  // Un vrai trou relie le dehors à une autre poche ; les autres cases « peut-être » sont de l'intérieur (un enclos fin,
  // pris entre une clôture et un bâtiment) : elles rejoignent leur poche
  const first = pocketsOf(maybe);
  const outside = biggestOf(first.pockets);
  const holes = new Set();
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!maybe(x, y)) continue;
      const near = new Set(DIRS.map(([dx, dy]) => (inside(x + dx, y + dy) ? first.label[(y + dy) * size + x + dx] : -1)).filter(l => l >= 0));
      if (near.has(outside) && near.size > 1) holes.add(y * size + x);
    }
  }
  const { pockets } = pocketsOf((x, y) => holes.has(y * size + x));
  const out = pockets[biggestOf(pockets)];
  return pockets
    .filter(p => p !== out && !p.edge && p.cells.length <= MAX_CELLS && p.fences.size >= MIN_FENCES)
    .map(p => ({ key: Math.min(...p.cells.map(c => c.y * size + c.x)), cells: p.cells, gaps: [...p.gaps.values()], fences: [...p.fences.values()] }));
}
