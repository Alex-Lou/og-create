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
// La boucle suggérée d'un trait (loopHintOf) : pas avant tant de cases tracées ; cherchée à tant de cases autour du
// trait, et pas plus longue que tant de cases à poser
const LOOP_MIN = 3;
const LOOP_REACH = 10;
const LOOP_MAX = 24;

// Dans le mur : un mur de chaque côté, à gauche et à droite, ou en haut et en bas (serveur : crafts.inWall)
export const inWall = (x, y, wall) => (wall(x - 1, y) && wall(x + 1, y)) || (wall(x, y - 1) && wall(x, y + 1));

// size : la carte (size × size) ; land(x, y) ; wall(x, y) : un mur posé ou bâti (création-mur, bâtiment, camp ; l'eau
// en est un d'office) ; fence(x, y) : une création-mur (clôture, muret, porte) ; open(x, y) : une case où une porte
// pourrait aller (libre, sol permis). [{ key, cells, gaps, fences }] : key, la plus petite case (y × size + x) de
// l'enclos, qui le nomme ; cells, son intérieur ; gaps, les trous de sa boucle (où il manque une porte) ; fences, ses
// clôtures et portes. box ({ x0, y0, x1, y1 }, facultatif) : seulement dans ce cadre (son bord compte comme celui de la
// carte : un enclos qui le touche n'en est pas un ; pour la boucle suggérée, loopHintOf)
export function enclosuresOf({ size, land, wall, fence, open, box = { x0: 0, y0: 0, x1: size - 1, y1: size - 1 } }) {
  const inside = (x, y) => x >= box.x0 && y >= box.y0 && x <= box.x1 && y <= box.y1;
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
    for (let y = box.y0; y <= box.y1; y++) {
      for (let x = box.x0; x <= box.x1; x++) {
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
  for (let y = box.y0; y <= box.y1; y++) {
    for (let x = box.x0; x <= box.x1; x++) {
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

// La boucle qui fermerait un trait en cours (choix de l'auteur, 15 oct. : des pointillés, « encore N pour fermer »).
// map : comme enclosuresOf ; spot(x, y) : une case où le trait peut aller ; trace : le trait ([{ x, y }], dans l'ordre) ;
// before : les clés des enclos d'avant. Le chemin le moins coûteux (en cases à poser), d'une case à l'autre, de son bout
// à son début, dans un cadre autour du trait : un mur bâti et l'eau ne coûtent rien ; une case permise coûte une pièce ;
// un sentier (où ira une porte) coûte, sans se poser. Gardé seulement s'il ferme un enclos nouveau (ou presque : un
// sentier le traverse). { cells, closes } : cells, les cases à poser ; closes, le trait seul en ferme déjà un ; ou null
export function loopHintOf({ size, land, wall, fence, open, spot, trace, before }) {
  if (trace.length < LOOP_MIN) return null;
  const key = (x, y) => y * size + x;
  const traced = new Set(trace.map(c => key(c.x, c.y)));
  // (le cadre : le trait, LOOP_REACH cases autour pour le chemin, et de quoi voir un enclos entier autour de lui)
  const around = d => ({
    x0: Math.max(0, Math.min(...trace.map(c => c.x)) - d),
    y0: Math.max(0, Math.min(...trace.map(c => c.y)) - d),
    x1: Math.min(size - 1, Math.max(...trace.map(c => c.x)) + d),
    y1: Math.min(size - 1, Math.max(...trace.map(c => c.y)) + d)
  });
  const { x0, y0, x1, y1 } = around(LOOP_REACH);
  const box = around(LOOP_REACH + 2);
  const fresh = cells => {
    const add = new Set([...traced, ...cells.map(c => key(c.x, c.y))]);
    const pens = enclosuresOf({
      size,
      box,
      land,
      wall: (x, y) => wall(x, y) || add.has(key(x, y)),
      fence: (x, y) => fence(x, y) || add.has(key(x, y)),
      open: (x, y) => !add.has(key(x, y)) && open(x, y)
    });
    return pens.some(p => !before.has(p.key));
  };
  if (fresh([])) return { cells: [], closes: true };
  const first = trace[0];
  const last = trace[trace.length - 1];
  const goal = key(first.x, first.y);
  // (ce que coûte une case : 0, 1, ou -1 : on n'y passe pas)
  const costOf = (x, y) => {
    const k = key(x, y);
    if (k === goal) return 0;
    if (traced.has(k)) return -1;
    if (!land(x, y) || wall(x, y)) return 0;
    return spot(x, y) || open(x, y) ? 1 : -1;
  };
  // (le plus court chemin, les coûts valant 0 ou 1 : une file à deux bouts)
  const dist = new Map([[key(last.x, last.y), 0]]);
  const prev = new Map();
  const queue = [last];
  let found = false;
  while (queue.length) {
    const c = queue.shift();
    const k = key(c.x, c.y);
    if (k === goal) {
      found = true;
      break;
    }
    const d = dist.get(k);
    if (d > LOOP_MAX) continue;
    for (const [dx, dy] of DIRS) {
      const nx = c.x + dx;
      const ny = c.y + dy;
      if (nx < x0 || nx > x1 || ny < y0 || ny > y1) continue;
      const w = costOf(nx, ny);
      const nk = key(nx, ny);
      if (w < 0 || (dist.has(nk) && dist.get(nk) <= d + w)) continue;
      dist.set(nk, d + w);
      prev.set(nk, k);
      if (w === 0) queue.unshift({ x: nx, y: ny });
      else queue.push({ x: nx, y: ny });
    }
  }
  if (!found) return null;
  const cells = [];
  for (let k = prev.get(goal); k !== undefined && k !== key(last.x, last.y); k = prev.get(k)) {
    const x = k % size;
    const y = Math.floor(k / size);
    if (land(x, y) && !wall(x, y) && spot(x, y)) cells.unshift({ x, y });
  }
  return cells.length <= LOOP_MAX && fresh(cells) ? { cells, closes: false } : null;
}
