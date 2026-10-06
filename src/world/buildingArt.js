// Les bâtiments dessinés dans la bibliothèque (design/bibliotheque/svg/batiments) : chantier et paliers par défaut.
// Chaque image d'un palier y est entière (le bâtiment, son animation, le voilier du Ponton). Pour ne pas garder en
// mémoire une grande image par image d'animation, le jeu la coupe, dans l'ordre du dessin, en une partie fixe (peinte
// une fois), le petit bloc qui bouge (avec ce qui se peint juste après lui : moyeu d'une roue, d'ailes de moulin), et
// le voilier, que le jeu berce. Le bloc et le voilier sont recadrés sur ce qu'ils peignent (mesuré à la lecture). Un bâtiment qui porte un skin garde son dessin par code
// (looks.js) ; ses lumières et ses fumées sont celles du jeu, les mêmes que celles de la bibliothèque.
import DATA from '../../design/bibliotheque/svg/batiments/batiments.json';
import { fitTo, cropTo, paintedBox } from './library';

// Chargés à la demande ; la première image de chaque palier et le chantier servent aussi de vignettes (adresse du fichier)
const FILES = import.meta.glob('/design/bibliotheque/svg/batiments/{paliers,chantier}/**/*.svg', { query: '?raw', import: 'default' });
const URLS = import.meta.glob(['/design/bibliotheque/svg/batiments/paliers/*/*_palier[1-7]{,_1}.svg', '/design/bibliotheque/svg/batiments/chantier/*.svg'], { query: '?url', import: 'default', eager: true });
const ROOT = '/design/bibliotheque/svg/batiments/';
// La bibliothèque est à l'échelle du jeu × 1,25
const SCALE = 1.25;
// Groupe qui porte cette échelle, autour de tout le dessin
const OPEN = '<g transform="scale(1.25)">';
// Mesure des blocs : un pixel par unité de la bibliothèque, la marge de paintedBox couvre le reste
const SCAN = 1;

// Un SVG de la bibliothèque coupé en éléments : son début (jusqu'au groupe d'échelle), ses éléments de premier niveau,
// sa fin. Recollés, ils redonnent le fichier tel quel
export function piecesOf(svg) {
  const from = svg.indexOf(OPEN) + OPEN.length;
  const to = svg.lastIndexOf('</g>');
  const body = svg.slice(from, to);
  const items = [];
  let depth = 0;
  let start = 0;
  for (const m of body.matchAll(/<(\/?)[a-zA-Z][^>]*?(\/?)>/g)) {
    if (depth === 0) start = m.index;
    if (m[1]) depth--;
    else if (!m[2]) depth++;
    if (depth === 0) items.push(body.slice(start, m.index + m[0].length));
  }
  return { head: svg.slice(0, from), items, tail: svg.slice(to) };
}

// Les images d'une animation coupées en ce qui ne bouge pas (avant, après), le bloc qui bouge de chaque image, et le
// voilier (boat : le Ponton). Une image seule : tout est « avant »
export function splitFrames(frames, boat = false) {
  const lists = frames.map(svg => piecesOf(svg).items);
  const sail = boat ? lists[0][lists[0].length - 1] : null;
  if (boat) lists.forEach((items, k) => { if (items.pop() !== sail) throw new Error(`voilier différent à l'image ${k + 1}`); });
  const first = lists[0];
  const n = Math.min(...lists.map(items => items.length));
  let p = 0;
  while (p < n && lists.every(items => items[p] === first[p])) p++;
  let s = 0;
  while (s < n - p && lists.every(items => items[items.length - 1 - s] === first[first.length - 1 - s])) s++;
  return { before: first.slice(0, p), moving: lists.map(items => items.slice(p, items.length - s)), after: first.slice(first.length - s), boat: sail };
}

const boxOf = cadre => ({ x: cadre[0] / SCALE, y: cadre[1] / SCALE, w: cadre[2] / SCALE, h: cadre[3] / SCALE });
const gameBox = box => ({ x: box.x / SCALE, y: box.y / SCALE, w: box.w / SCALE, h: box.h / SCALE });
const union = boxes => {
  const x = Math.min(...boxes.map(b => b.x));
  const y = Math.min(...boxes.map(b => b.y));
  return { x, y, w: Math.max(...boxes.map(b => b.x + b.w)) - x, h: Math.max(...boxes.map(b => b.y + b.h)) - y };
};

// Les parties d'un palier, lues une fois, en SVG entiers (au cadre du palier) : before (la partie fixe), moving (une par
// image : le bloc qui bouge, puis ce qui se peint après lui), boat (le voilier)
const parts = new Map();
function partsOf(key, art, boat) {
  if (!parts.has(key)) {
    parts.set(key, Promise.all(art.fichiers.map(file => FILES[ROOT + file]())).then(frames => {
      const { head, tail } = piecesOf(frames[0]);
      const svg = items => head + items.join('') + tail;
      const split = splitFrames(frames, boat);
      return {
        before: svg(split.before),
        moving: split.moving.map(items => svg([...items, ...split.after])),
        boat: split.boat ? svg([split.boat]) : null
      };
    }));
  }
  return parts.get(key);
}

// Un bloc recadré sur ce qu'il peint (within : un cadre déjà mesuré, sinon mesuré ici) ; si la mesure n'est pas
// possible, le bloc garde le cadre du palier
function cropped(svg, frame, within) {
  const box = within || paintedBox(svg, SCAN);
  return Promise.resolve(box).then(
    b => (b ? { svg: fitTo(cropTo(svg, b), gameBox(b)), box: gameBox(b) } : { svg: fitTo(svg, frame), box: frame }),
    () => ({ svg: fitTo(svg, frame), box: frame })
  );
}
// Le cadre commun des images du bloc qui bouge (une image vide n'y compte pas), ou null s'il ne se mesure pas
const movingBoxes = new Map();
function movingBoxOf(key, moving) {
  if (!movingBoxes.has(key)) {
    movingBoxes.set(key, Promise.all(moving.map(svg => paintedBox(svg, SCAN).catch(() => null))).then(boxes => {
      const found = boxes.filter(Boolean);
      return found.length ? union(found) : null;
    }));
  }
  return movingBoxes.get(key);
}

const looks = new Map();
// Le dessin d'un palier par défaut (sans skin), pour l'île : { base, anim, boat } ; base, boat et anim.frame(f) sont
// des { key, make } pour le cache des sprites ; anim : { n, ms } (null : pas d'animation), boat : null hors du Ponton ;
// null si la bibliothèque n'a pas ce palier
export function buildingArt(siteId, level) {
  const key = `${siteId}_palier${level}`;
  const art = DATA.paliers[key];
  if (!art || !art.fichiers.every(file => FILES[ROOT + file])) return null;
  if (!looks.has(key)) {
    const frame = boxOf(art.cadre);
    const boat = siteId === 'ponton';
    const n = art.fichiers.length;
    const read = () => partsOf(key, art, boat);
    const layer = (name, load) => ({ key: `lib-${siteId}-${level}-${name}`, make: () => ({ box: frame, load }) });
    const frames = Array.from({ length: n }, (_, f) => layer(`a${f}`, () => read().then(p => movingBoxOf(key, p.moving).then(box => cropped(p.moving[f], frame, box)))));
    looks.set(key, {
      base: layer('base', () => read().then(p => fitTo(p.before, frame))),
      anim: n > 1 ? { n, ms: art.ms_par_image, frame: f => frames[f] } : null,
      boat: boat ? layer('boat', () => read().then(p => cropped(p.boat, frame))) : null
    });
  }
  return looks.get(key);
}

// Le chantier dans sa phase (0, 1, 2), pour l'île : { key, make }, ou null si la bibliothèque ne l'a pas
export function chantierArt(stage) {
  const file = DATA.chantier.fichiers[stage];
  if (!file || !FILES[ROOT + file]) return null;
  const box = boxOf(DATA.chantier.cadres[stage]);
  return { key: `lib-chantier-${stage}`, make: () => ({ box, load: () => FILES[ROOT + file]().then(svg => fitTo(svg, box)) }) };
}

// Vignette d'un bâtiment pour sa fiche : la première image de son palier par défaut (level 0 : le chantier dans sa
// phase), adresse du fichier ; null si la bibliothèque ne l'a pas
export function buildingThumb(siteId, level, stage = 0) {
  const file = level ? DATA.paliers[`${siteId}_palier${level}`]?.fichiers[0] : DATA.chantier.fichiers[stage];
  return (file && URLS[ROOT + file]) || null;
}
