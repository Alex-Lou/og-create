// Les bâtiments dessinés dans la bibliothèque (design/bibliotheque/svg/batiments) : chantier, paliers, skins dessinés
// et teintes vendues. Chaque image d'un palier y est entière (le bâtiment, son animation, le voilier du Ponton). Pour ne
// pas garder en mémoire une grande image par image d'animation, le jeu la coupe, dans l'ordre du dessin, en une partie
// fixe (peinte une fois), le petit bloc qui bouge (avec ce qui se peint juste après lui : moyeu d'une roue, d'ailes de
// moulin), et le voilier, que le jeu berce. Le bloc et le voilier sont recadrés sur ce qu'ils peignent (mesuré à la
// lecture). Un skin dessiné est une image fixe : sa partie fixe se pose sous le même bloc qui bouge (le kiosque du
// Puits n'a pas de jets d'eau, comme dans le jeu). Une teinte (vendue, ou celle d'une pièce rare) recolore le dessin
// avec l'outil de la bibliothèque (le trait garde sa couleur), le bloc qui bouge seulement là où le jeu teinte
// l'animation ; l'accessoire animé d'une pièce rare reste celui du jeu (rareSprites.js, posé sur la crête du dessin,
// la même). Les lumières et les fumées sont celles du jeu, les mêmes que celles de la bibliothèque.
import { reactive } from 'vue';
import DATA from '../../design/bibliotheque/svg/batiments/batiments.json';
import { tintOf, tintSvg } from '../../design/bibliotheque/svg/batiments/teintes/teinter.mjs';
import { fitTo, cropTo, paintedBox, BLANK } from './library';
import { lookAt } from './looks';

// Chargés à la demande ; la première image de chaque palier, le chantier, les skins et les aperçus des pièces rares
// servent aussi de vignettes (adresse du fichier)
const FILES = import.meta.glob('/design/bibliotheque/svg/batiments/{paliers,chantier,skins}/**/*.svg', { query: '?raw', import: 'default' });
const URLS = import.meta.glob(['/design/bibliotheque/svg/batiments/paliers/*/*_palier[1-7]{,_1}.svg', '/design/bibliotheque/svg/batiments/{chantier,skins,pieces_rares}/**/*.svg'], { query: '?url', import: 'default', eager: true });
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
const svgOf = ({ head, tail }, items) => head + items.join('') + tail;
// Le bloc qui bouge de l'image f, avec ce qui se peint après lui
const blockOf = (split, f) => [...split.moving[f], ...split.after];
const isPonton = key => key.startsWith('ponton_');

// Fichier d'un skin dessiné à un palier ; null si le jeu ne dessine pas ce skin à ce palier (le dessin par défaut vaut)
function skinFile(skin, level) {
  return DATA.skins[skin].fichiers.find(file => file.endsWith(`_palier${level}.svg`)) || null;
}
// Règles du jeu (looks.js) : un skin qui coupe l'animation (kiosque du Puits), une animation que la teinte recolore
const animSkipped = (siteId, level, skin) => lookAt(siteId, level).anims.some(anim => anim.skip && anim.skip(skin));
const animTinted = (siteId, level) => lookAt(siteId, level).anims.some(anim => anim.skinned);

// Les images d'un palier lues et coupées, une fois : { head, tail, split }
const splits = new Map();
function splitOf(key) {
  if (!splits.has(key)) {
    const art = DATA.paliers[key];
    splits.set(key, Promise.all(art.fichiers.map(file => FILES[ROOT + file]())).then(frames => ({ ...piecesOf(frames[0]), split: splitFrames(frames, isPonton(key)) })));
  }
  return splits.get(key);
}
// Un skin dessiné lu et coupé, une fois : sa partie fixe (sans le bloc qui bouge de la première image, que le jeu anime
// par-dessus) et son voilier
const skinSplits = new Map();
function skinSplitOf(key, file, animated) {
  if (!skinSplits.has(file)) {
    skinSplits.set(file, Promise.all([FILES[ROOT + file](), splitOf(key)]).then(([svg, read]) => {
      const pieces = piecesOf(svg);
      const items = [...pieces.items];
      const boat = isPonton(key) ? items.pop() : null;
      const block = animated ? blockOf(read.split, 0) : [];
      const ends = block.every((item, i) => items[items.length - block.length + i] === item);
      return { ...pieces, before: ends ? items.slice(0, items.length - block.length) : items, boat };
    }));
  }
  return skinSplits.get(file);
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
function movingBoxOf(key) {
  if (!movingBoxes.has(key)) {
    movingBoxes.set(key, splitOf(key)
      .then(read => Promise.all(read.split.moving.map((_, f) => paintedBox(svgOf(read, blockOf(read.split, f)), SCAN).catch(() => null))))
      .then(boxes => {
        const found = boxes.filter(Boolean);
        return found.length ? union(found) : null;
      }));
  }
  return movingBoxes.get(key);
}

// Les images du bloc qui bouge d'un palier, { key, make } pour le cache des sprites ; recolorées par une teinte (tint)
function framesOf(siteId, level, tint) {
  const key = `${siteId}_palier${level}`;
  const frame = boxOf(DATA.paliers[key].cadre);
  const paint = svg => (tint ? tintSvg(svg, tint) : svg);
  return DATA.paliers[key].fichiers.map((_, f) => ({
    key: `lib-${siteId}-${level}-${tint ? `${tint}-` : ''}a${f}`,
    make: () => ({ box: frame, load: () => Promise.all([splitOf(key), movingBoxOf(key)]).then(([read, box]) => cropped(paint(svgOf(read, blockOf(read.split, f))), frame, box)) })
  }));
}

// Le dessin d'un palier sous un skin (rien, skin dessiné ou teinte)
function artOf(siteId, level, skin, tint, file) {
  const key = `${siteId}_palier${level}`;
  const art = DATA.paliers[key];
  const frame = boxOf(art.cadre);
  const paint = svg => (tint ? tintSvg(svg, tint) : svg);
  // La partie fixe et le voilier : ceux du palier, ou ceux du skin dessiné
  const read = () => (file ? skinSplitOf(key, file, !animSkipped(siteId, level, skin)) : splitOf(key).then(r => ({ ...r, before: r.split.before, boat: r.split.boat })));
  const layer = (part, load) => ({ key: `lib-${siteId}-${level}-${skin ? `${skin}-` : ''}${part}`, make: () => ({ box: frame, load }) });
  const animated = art.fichiers.length > 1 && !animSkipped(siteId, level, skin);
  const frames = animated ? framesOf(siteId, level, tint && animTinted(siteId, level) ? tint : null) : null;
  return {
    base: layer('base', () => read().then(r => fitTo(paint(svgOf(r, r.before)), frame))),
    anim: frames ? { n: frames.length, ms: art.ms_par_image, frame: f => frames[f] } : null,
    boat: isPonton(key) ? layer('boat', () => read().then(r => cropped(paint(svgOf(r, [r.boat])), frame))) : null
  };
}

const looks = new Map();
// Le dessin d'un palier pour l'île, sous un skin (rien, skin dessiné, teinte vendue ou d'une pièce rare) : { base, anim,
// boat } ; base, boat et anim.frame(f) sont des { key, make } pour le cache des sprites ; anim : { n, ms } (null : pas
// d'animation), boat : null hors du Ponton ; null si la bibliothèque n'a pas ce palier ou ce skin
export function buildingArt(siteId, level, skin = '') {
  const key = `${siteId}_palier${level}`;
  const art = DATA.paliers[key];
  if (!art || !art.fichiers.every(file => FILES[ROOT + file])) return null;
  const tint = skin ? tintOf(skin) : null;
  if (skin && !tint && DATA.skins[skin]?.batiment !== siteId) return null;
  const file = skin && !tint ? skinFile(skin, level) : null;
  if (skin && !tint && !file) return buildingArt(siteId, level);
  if (file && !FILES[ROOT + file]) return null;
  const id = `${key}-${skin}`;
  if (!looks.has(id)) looks.set(id, artOf(siteId, level, skin, tint, file));
  return looks.get(id);
}

// Le chantier dans sa phase (0, 1, 2), pour l'île : { key, make }, ou null si la bibliothèque ne l'a pas
export function chantierArt(stage) {
  const file = DATA.chantier.fichiers[stage];
  if (!file || !FILES[ROOT + file]) return null;
  const box = boxOf(DATA.chantier.cadres[stage]);
  return { key: `lib-chantier-${stage}`, make: () => ({ box, load: () => FILES[ROOT + file]().then(svg => fitTo(svg, box)) }) };
}

// Vignette teinte d'un palier : sa première image recolorée comme sur l'île (partie fixe et voilier ; le bloc qui
// bouge si le jeu teinte l'animation), lue une fois ; une image vide pendant ce temps ; null si la lecture échoue
const thumbs = reactive({});
const thumbing = new Set();
function tintedThumb(siteId, level, tint) {
  const key = `${siteId}_palier${level}`;
  const id = `${key}-${tint}`;
  if (!thumbing.has(id)) {
    thumbing.add(id);
    splitOf(key).then(read => {
      const { split } = read;
      const paint = item => tintSvg(item, tint);
      const block = blockOf(split, 0).map(animTinted(siteId, level) ? paint : item => item);
      const items = [...split.before.map(paint), ...block, ...(split.boat ? [paint(split.boat)] : [])];
      thumbs[id] = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgOf(read, items))}`;
    }).catch(() => { thumbs[id] = null; });
  }
  return id in thumbs ? thumbs[id] : BLANK;
}

// Vignette d'un bâtiment (sa fiche, la boutique) : la première image de son palier, sous son skin (level 0 : le
// chantier dans sa phase ; une pièce rare : son aperçu, accessoire compris) ; l'adresse du fichier, ou l'image teinte ;
// null si la bibliothèque ne l'a pas
export function buildingThumb(siteId, level, stage = 0, skin = '') {
  if (!level) {
    const file = DATA.chantier.fichiers[stage];
    return (file && URLS[ROOT + file]) || null;
  }
  const art = DATA.paliers[`${siteId}_palier${level}`];
  if (!art) return null;
  const rare = DATA.pieces_rares[skin];
  if (rare) return (rare.batiment === siteId && URLS[ROOT + rare.fichiers[level - 1]]) || null;
  const tint = skin ? tintOf(skin) : null;
  if (tint) return tintedThumb(siteId, level, tint);
  if (skin && DATA.skins[skin]?.batiment !== siteId) return null;
  const file = (skin && skinFile(skin, level)) || art.fichiers[0];
  return URLS[ROOT + file] || null;
}
