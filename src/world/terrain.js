// Le sol de la très grande île en relief (Canvas 2D, unités du monde) : chaque case a un sol (herbe, sable, prairie,
// forêt, roche, chemin, eau, et ceux des climats : neige, lac gelé, lande, marais, jungle, cendre, lave ; 'u' : terre
// encore inconnue) et une hauteur de 0 à 6 ; ses faces avant (vers +x et +y) descendent jusqu'au voisin, ou jusqu'à
// la mer. Le sol est préparé en carrés alignés sur l'écran, gardés en images (TerrainCache) : seuls les
// carrés visibles sont dessinés, les nouveaux préparés dans un budget de temps par image.
// L'eau douce (reflets, cascades) est animée par-dessus, case par case visible ; la mer vit dans sea.js.

import { pathFile, pathImage, CLEAR_GRASS } from './pathArt';
import { mixHex } from './iso';
import { drawRiverBridge } from './pontRiviere';

export const TW = 64;
export const TH = TW / 2;
// Hauteur d'un palier de relief, et niveau de la mer (en paliers, sous la terre la plus basse)
export const HS = 22;
export const SEA_Z = -1.36;
// Carrés du sol : côté en pixels, marge qui recouvre les voisins, nombre gardé en images (hors de ceux à l'écran,
// toujours gardés), résolution maximale ; vue d'ensemble de toute l'île
const TILE_PX = 512;
const PAD_PX = 2;
const MAX_TILES = 24;
const MAX_RES = 2;
const OVERVIEW_RES = 0.25;
// Sauf de près (l'île en décide à chaque image : draw(…, bake)), le décor fixe (arbres, rochers…) est peint dans les
// carrés du sol, une fois, dans l'ordre du relief : l'île n'a plus à le redessiner à chaque image. Un carré est fait
// avec ou sans décor (clé distincte) ; la vue d'ensemble l'a toujours
// Vue d'ensemble peinte avant que tous les dessins du décor soient prêts : refaite au plus tant de fois
const OVERVIEW_RETRIES = 6;
// Ce qu'un élément du décor dépasse de sa case : vers le haut, sur les côtés (unités du monde, cadre des dessins)
const STAND_ABOVE = 96;
const STAND_SIDE = 10;
// Mer : bande d'eaux peu profondes (en cases depuis la terre), aussi un peu hors de la carte ; « au large »
export const SHALLOW = 3;
export const SEA_PAD = 3;
export const SEA_FAR = 9;
// Ce qu'une case peut couvrir au-dessus de son centre (relief, détails) et au-dessous (faces jusqu'à la mer, piles
// du pont), en unités du monde
const cellAbove = h => TH / 2 + Math.max(0, h) * HS + 8;
// … une case de pont : sa bosse, son garde-corps et ses lanternes dépassent (world/pontRiviere.js)
const BRIDGE_ABOVE = 26;
const aboveOf = (M, x, y) => cellAbove(M.height(x, y)) + (M.ground(x, y) === 'k' ? BRIDGE_ABOVE : 0);
export const CELL_ABOVE_MAX = TH / 2 + 6 * HS + 8;
export const CELL_BELOW = TH / 2 - SEA_Z * HS + 8;

// Île flottante (lot 5e) : sous sa surface, une croûte de terre (CRUST paliers), puis un dessous rocheux en pointes,
// plus profond vers le centre (de UNDER_MIN à UNDER_MAX paliers) ; la mer passe dessous
export const CRUST = 0.5;
const UNDER_MIN = 0.8;
const UNDER_MAX = 2.1;
// Profondeur du dessous rocheux (en paliers, sous la croûte) en un point (en cases) de l'île flottante
export function underAt(float, x, y) {
  const k = 1 - Math.min(1, Math.hypot(x - float.cx, y - float.cy) / float.r);
  return UNDER_MIN + (UNDER_MAX - UNDER_MIN) * k;
}

// Lecture des calques du serveur (state.map) : relief, sol, quartier ; floating : index du quartier qui flotte
// au-dessus de la mer (-1 : aucun)
export function islandOf(map, n, floating = -1) {
  const ground = (x, y) => (x < 0 || y < 0 || x >= n || y >= n ? '~' : map.ground[y][x]);
  const height = (x, y) => {
    const c = x < 0 || y < 0 || x >= n || y >= n ? ' ' : map.height[y][x];
    return c === ' ' ? -1 : Number(c);
  };
  const zone = (x, y) => {
    const c = x < 0 || y < 0 || x >= n || y >= n ? '.' : map.grid[y][x];
    return c === '.' ? -1 : parseInt(c, 36);
  };
  const land = (x, y) => { const g = ground(x, y); return g !== '~' && g !== 'b'; };
  const floats = (x, y) => floating >= 0 && zone(x, y) === floating;
  // L'île flottante : ses cases, son centre et son rayon (en cases) ; null s'il n'y en a pas
  const cells = [];
  if (floating >= 0) for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (floats(x, y)) cells.push({ x, y });
  const cx = cells.reduce((sum, c) => sum + c.x, 0) / (cells.length || 1);
  const cy = cells.reduce((sum, c) => sum + c.y, 0) / (cells.length || 1);
  const float = cells.length ? { cells, cx, cy, r: Math.max(...cells.map(c => Math.hypot(c.x - cx, c.y - cy))) + 0.75 } : null;
  // Hauteur de la surface (en paliers) : l'eau douce est un peu sous ses rives ; la mer (et le pont qui la
  // traverse) au niveau de la mer
  const surface = (x, y) => {
    const g = ground(x, y);
    if (g === '~' || g === 'b') return SEA_Z;
    return g === 'w' ? height(x, y) - 0.25 : height(x, y);
  };
  // Distance de la mer à la terre posée sur l'eau (en cases, 0 sur terre, SEA_FAR au large ; l'île flottante n'en
  // fait pas partie), jusqu'à SEA_PAD cases hors de la carte
  const P = SEA_PAD + 3, m = n + 2 * P;
  const dist = new Uint8Array(m * m).fill(SEA_FAR);
  const queue = [];
  for (let y = -P; y < n + P; y++) {
    for (let x = -P; x < n + P; x++) {
      if (land(x, y) && !floats(x, y)) { dist[(y + P) * m + x + P] = 0; queue.push(x, y); }
    }
  }
  for (let k = 0; k < queue.length; k += 2) {
    const x = queue[k], y = queue[k + 1], d = dist[(y + P) * m + x + P];
    if (d + 1 >= SEA_FAR) continue;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx < -P || ny < -P || nx >= n + P || ny >= n + P) continue;
        const i = (ny + P) * m + nx + P;
        if (dist[i] > d + 1) { dist[i] = d + 1; queue.push(nx, ny); }
      }
    }
  }
  const depth = (x, y) => (x < -P || y < -P || x >= n + P || y >= n + P ? SEA_FAR : dist[(y + P) * m + x + P]);
  return { n, ground, height, zone, land, floats, float, surface, depth };
}

// Centre d'une case (ou d'un point fractionnaire) à une hauteur donnée (en paliers)
export const worldOf = (x, y, z = 0) => ({ x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 - z * HS });

// Hasard fixe par case
const rnd = (x, y, k = 0) => { const v = Math.sin(x * 12.9898 + y * 78.233 + k * 37.719) * 43758.5453; return v - Math.floor(v); };

const TOPS = {
  // (l'herbe : un vert vivant, choix de l'auteur, 12 oct. ; plus chaude et plus fraîche par grandes nappes, d'une
  // nuance par quartier, plus claire en hauteur, ombrée au pied des falaises : paintColor, groundField)
  g: [['#8FCB6A', '#9BD476'], ['#88C364', '#94CC6F'], ['#81BA5E', '#8DC368'], ['#99B86A', '#A3C074']],
  m: [['#A1D46C', '#ABDB77']],
  f: [['#68A253', '#71AB5B']],
  r: [['#A9A294', '#B2AB9D']],
  s: [['#EBD49B', '#F0DBA6']],
  p: [['#DCC28B', '#E1C892'], ['#D6BC83', '#DBC28A']],
  w: [['#5FB0DD', '#66B6E1']],
  n: [['#EEF3F8', '#F5F8FB']],
  v: [['#BFE3F2', '#C9E9F5']],
  l: [['#A8889E', '#B192A7'], ['#9E8396', '#A78D9F']],
  x: [['#7E9A62', '#86A169']],
  j: [['#3E8A48', '#46924F']],
  a: [['#6A6461', '#726C68']],
  o: [['#D9532E', '#E2603A']],
  // Terre inconnue : un sol pâle, sauge en bas, pierre grise en hauteur, qu'on devine sous la brume (relief compris)
  u: [['#C9D3C6', '#CFD8CB'], ['#C5CDC3', '#CBD3C9'], ['#C3C9C6', '#C9CFCC'], ['#C8CCD1', '#CDD1D6'], ['#D2D5DA', '#D7DAE0']]
};
// Bruit de valeur lissé, continu d'une case à l'autre (taches de couleur du sol à la place du damier)
const smooth = t => t * t * (3 - 2 * t);
function vnoise(x, y, k) {
  const xi = Math.floor(x), yi = Math.floor(y), u = smooth(x - xi), v = smooth(y - yi);
  const a = rnd(xi, yi, k), b = rnd(xi + 1, yi, k), c = rnd(xi, yi + 1, k), d = rnd(xi + 1, yi + 1, k);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
// Teinte du sol en un point (coins compris) : deux octaves de bruit entre une teinte sombre, la teinte et la claire ;
// l'herbe, en plus, ses grandes nappes chaudes et fraîches
// L'herbe vit par grandes nappes de lumière (choix de l'auteur, 12 oct. : « lumière peinte ») : la teinte suit la
// valeur, comme sous un vrai ciel ; où le soleil s'attarde, plus claire et plus chaude (jaune de blé) ; dans les
// nappes d'ombre, plus sombre et plus froide (bleu-vert). Deux échelles : de grandes plages, et des taches moyennes
const HERB_WARM = '#D6DF7C', HERB_COOL = '#3A8068', HERB_LIGHT = 0.42, HERB_SHADE = 0.46;
// … et chaque quartier a sa nuance de vert (jaune-vert ensoleillé, bleu-vert frais, vert vif, vert tilleul, vert
// profond), tirée une fois pour toutes de son rang ; d'un quartier à l'autre, l'herbe passe en dégradé (groundField)
const ZONE_HUES = ['#C4D865', '#55B488', '#79C94E', '#A9C45A', '#4F9A5A', '#93D27A'];
const ZONE_MIX = 0.4;
const zoneHue = i => (i < 0 ? null : ZONE_HUES[Math.floor(rnd(i, 7, 5) * ZONE_HUES.length)]);
// L'herbe en hauteur prend un peu plus de soleil ; au pied d'une falaise, une ombre douce (couleur de sous-bois)
const HEIGHT_LIGHT = '#F2F6C8', FOOT_SHADE = '#24474A';
// Le sol de la jungle du départ (choix de l'auteur, 18 oct. : l'herbe s'adapte à la jungle ; M.jungle) : une mousse
// émeraude et sarcelle, plus sombre et plus saturée, par grandes nappes, trouée de taches de soleil vert acide ; elle
// prend le dessus sur l'herbe à mesure qu'on entre dans la jungle (la part de jungle des cases autour)
const JUNGLE_DEEP = '#16855A', JUNGLE_TEAL = '#0E7270', JUNGLE_SUN = '#9EE04A', JUNGLE_FLOOR = 0.66;
function jungleFloor(px, py) {
  const n = vnoise(px * 0.2 + 5, py * 0.2 + 9, 301), sun = vnoise(px * 0.12 + 13, py * 0.12 + 2, 302);
  const base = mixHex(JUNGLE_DEEP, JUNGLE_TEAL, n);
  return sun > 0.62 ? mixHex(base, JUNGLE_SUN, Math.min(1, (sun - 0.62) * 3) * 0.7) : base;
}
export function paintColor(g, h, px, py) {
  const key = g === 't' ? 'g' : g === 'd' ? 's' : g === 'k' ? 'w' : g;
  const set = TOPS[key] || TOPS.g;
  const [a, b] = set[Math.min(set.length - 1, Math.max(0, h))];
  const n = vnoise(px * 0.24, py * 0.24, 91) * 0.85 + vnoise(px * 0.7 + 7, py * 0.7 + 3, 92) * 0.15;
  const herb = 'gmf'.includes(key);
  const dark = mixHex(a, '#2E4A2A', herb ? 0.1 : key === 's' ? 0.06 : key === 'n' ? 0.03 : 0.12);
  const col = n < 0.5 ? mixHex(dark, a, n * 2) : mixHex(a, b, (n - 0.5) * 2);
  if (!herb) return col;
  const w = vnoise(px * 0.06 + 31, py * 0.06 + 17, 94) * 0.72 + vnoise(px * 0.17 + 3, py * 0.17 + 9, 96) * 0.28;
  // (contrastée : les plages franches, le passage de l'une à l'autre doux)
  const t = Math.max(-1, Math.min(1, (w - 0.5) * 3));
  return t > 0 ? mixHex(col, HERB_WARM, t * HERB_LIGHT) : mixHex(col, HERB_COOL, -t * HERB_SHADE);
}
// Le sol peint, sans damier : chaque case est un dégradé entre les teintes de ses quatre coins, et deux voisines du même
// sol et de la même hauteur partagent les leurs (aucun losange ne se voit). Les teintes des coins de toute l'île tiennent
// dans une seule petite image (2 pixels par case), faite une fois par carte (la carte d'une île ne change pas) ; chaque
// case y prend ses quatre pixels, étirés sur son losange (le lissage du canevas fait le dégradé). Sous un chemin,
// c'est l'herbe : ses voisines continuent sous lui.
const groundKey = g => (g === 'p' ? 'g' : g);
const smoothable = g => RANK[groundKey(g)] !== undefined && groundKey(g) !== 'w';
const rgbOf = hex => { const v = parseInt(hex.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
const fields = new WeakMap();
const FOOT_RGB = rgbOf(FOOT_SHADE);
// Le soleil vient de la gauche de l'écran (les faces de gauche des falaises sont les claires) : vers lui, dans l'île,
// c'est (SUN_X, SUN_Y). Un palier jette une ombre de CAST_LEN cases, au bord adouci sur CAST_SOFT ; elle est cherchée
// en remontant vers le soleil (CAST_STEPS, en cases). Le bord d'un plateau face au soleil s'éclaire de RIM_LIGHT.
const SUN_X = -0.8, SUN_Y = 0.6;
const CAST_LEN = 1.3, CAST_SOFT = 0.7, CAST_SHADE = 0.34, CAST_STEPS = [0.35, 0.8, 1.3, 1.8, 2.4, 3];
const RIM_LIGHT = 0.22, RIM_RGB = rgbOf('#F4F1BE');
function groundField(M) {
  if (fields.has(M)) return fields.get(M);
  let field = null;
  const canvas = typeof document !== 'undefined' ? document.createElement('canvas') : null;
  const g = canvas && canvas.getContext('2d');
  if (g) {
    const n = M.n;
    canvas.width = canvas.height = 2 * n;
    const img = g.createImageData(2 * n, 2 * n), data = img.data;
    const keyOf = (x, y) => groundKey(M.ground(x, y));
    const own = (x, y) => M.land(x, y) && smoothable(M.ground(x, y));
    // (la teinte de chaque case en chaque coin qu'elle touche, calculée une fois : quatre cases partagent un coin)
    const tint = new Float32Array((n + 1) * (n + 1) * 4 * 3).fill(-1);
    // (la nuance de quartier d'une case : la moyenne de celles des quartiers à deux cases autour, pour qu'elle passe de
    // l'un à l'autre en dégradé ; gardée par case)
    const hues = new Float32Array(n * n * 3).fill(-1);
    const zoneRgb = new Map();
    const rgbOfZone = i => {
      if (!zoneRgb.has(i)) { const hue = zoneHue(i); zoneRgb.set(i, hue ? rgbOf(hue) : null); }
      return zoneRgb.get(i);
    };
    const hueAt = (x, y) => {
      const k = (y * n + x) * 3;
      if (hues[k] < 0) {
        let r = 0, gr = 0, b = 0, count = 0;
        for (let j = -2; j <= 2; j++) {
          for (let i = -2; i <= 2; i++) {
            const rgb = M.land(x + i, y + j) && rgbOfZone(M.zone(x + i, y + j));
            if (!rgb) continue;
            r += rgb[0]; gr += rgb[1]; b += rgb[2]; count++;
          }
        }
        hues.set(count ? [r / count, gr / count, b / count] : [0, 0, 0], k);
        if (!count) hues[k] = -2;
      }
      return hues[k] < -1 ? null : k;
    };
    // (la part de jungle autour d'une case, à deux cases : la mousse gagne en dégradé ; gardée par case)
    const jungles = new Float32Array(n * n).fill(-1);
    const jungleAt = (x, y) => {
      if (!M.jungle) return 0;
      const k = y * n + x;
      if (jungles[k] < 0) {
        let count = 0;
        for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (M.jungle(x + i, y + j)) count++;
        jungles[k] = count / 25;
      }
      return jungles[k];
    };
    const tintAt = (nx, ny, cx, cy) => {
      const k = (((cy * (n + 1) + cx) * 4) + (ny - cy + 1) * 2 + (nx - cx + 1)) * 3;
      if (tint[k] < 0) {
        const key = keyOf(nx, ny), h = M.height(nx, ny);
        let col = paintColor(key, h, cx - 0.5, cy - 0.5);
        if ('gmf'.includes(key)) col = mixHex(col, HEIGHT_LIGHT, Math.min(0.12, 0.035 * Math.max(0, h)));
        const rgb = rgbOf(col), hk = 'gmf'.includes(key) ? hueAt(nx, ny) : null;
        if (hk !== null) for (let c = 0; c < 3; c++) rgb[c] = rgb[c] * (1 - ZONE_MIX) + hues[hk + c] * ZONE_MIX;
        const jw = 'gm'.includes(key) ? jungleAt(nx, ny) : 0;
        if (jw > 0) { const floor = rgbOf(jungleFloor(cx - 0.5, cy - 0.5)); for (let c = 0; c < 3; c++) rgb[c] = rgb[c] * (1 - JUNGLE_FLOOR * jw) + floor[c] * JUNGLE_FLOOR * jw; }
        tint.set(rgb, k);
      }
      return k;
    };
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (!own(x, y)) continue;
        const family = familyOf(keyOf(x, y)), top = M.surface(x, y);
        for (let dy = 0; dy < 2; dy++) {
          for (let dx = 0; dx < 2; dx++) {
            // (un coin : la moyenne des cases qui s'y touchent, du même sol et à la même hauteur ; le coin (cx, cy) est
            // le point (cx − 0,5, cy − 0,5) de l'île)
            const cx = x + dx, cy = y + dy, px = cx - 0.5, py = cy - 0.5;
            let r = 0, gr = 0, b = 0, count = 0, rise = 0;
            for (let j = 0; j < 2; j++) {
              for (let i = 0; i < 2; i++) {
                const nx = cx - 1 + i, ny = cy - 1 + j;
                // (une case plus haute qui touche ce coin : son pied est dans l'ombre)
                if (M.land(nx, ny)) rise = Math.max(rise, M.surface(nx, ny) - top);
                if (!own(nx, ny) || familyOf(keyOf(nx, ny)) !== family || Math.abs(M.surface(nx, ny) - top) > 0.01) continue;
                const k = tintAt(nx, ny, cx, cy);
                r += tint[k]; gr += tint[k + 1]; b += tint[k + 2]; count++;
              }
            }
            // (l'ombre portée : en remontant vers le soleil, une case plus haute que ce coin, et assez proche pour que
            // son ombre l'atteigne)
            let cast = 0;
            for (const t of CAST_STEPS) {
              const sx = Math.round(px + SUN_X * t), sy = Math.round(py + SUN_Y * t);
              if (!M.land(sx, sy)) continue;
              const reach = (M.surface(sx, sy) - top) * CAST_LEN - t;
              if (reach > 0) cast = Math.max(cast, Math.min(1, reach / CAST_SOFT));
            }
            // (le bord d'un plateau tourné vers le soleil : la lumière y accroche)
            const rx = Math.round(px + SUN_X * 0.6), ry = Math.round(py + SUN_Y * 0.6);
            const rim = M.land(rx, ry) ? Math.min(1, Math.max(0, top - M.surface(rx, ry) - 0.4)) * RIM_LIGHT : 0;
            const shade = Math.max(Math.min(1, Math.max(0, rise) / 1.5) * 0.2, cast * CAST_SHADE);
            const k = ((2 * y + dy) * 2 * n + 2 * x + dx) * 4;
            for (let c = 0; c < 3; c++) {
              const lit = [r, gr, b][c] / count;
              data[k + c] = (lit * (1 - rim) + RIM_RGB[c] * rim) * (1 - shade) + FOOT_RGB[c] * shade;
            }
            data[k + 3] = 255;
          }
        }
      }
    }
    g.putImageData(img, 0, 0);
    field = canvas;
  }
  fields.set(M, field);
  return field;
}
// Le sol peint d'une case (c : son centre à l'écran) ; faux sans canevas (le sol est alors peint d'une teinte)
export function paintSmooth(ctx, M, x, y, c) {
  const field = smoothable(M.ground(x, y)) && groundField(M);
  if (!field) return false;
  // Le carré de la case dans l'image, de centre de pixel à centre de pixel : étiré sur l'île, c'est exactement son
  // losange, sans découpe (le dégradé est celui des quatre coins). Un rien plus grand (E) : deux voisines se recouvrent
  // d'un demi-pixel, leur teinte s'y raccorde, et le fil clair que laissait le lissage de leurs bords disparaît
  const E = 0.012;
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.transform(TW / 2, TH / 2, -TW / 2, TH / 2, c.x, c.y - TH);
  ctx.drawImage(field, 2 * x + 0.5 - E, 2 * y + 0.5 - E, 1 + 2 * E, 1 + 2 * E, 0.5 - E, 0.5 - E, 1 + 2 * E, 1 + 2 * E);
  ctx.restore();
  return true;
}
// Le sol peint d'une case, d'une seule teinte (sans canevas pour le dégradé)
function paintTop(ctx, g, h, x, y, c) {
  diamond(ctx, c.x, c.y);
  ctx.fillStyle = paintColor(g, h, x, y);
  ctx.fill();
}
// Qui déborde sur qui, d'un sol à l'autre (l'herbe mange le sable, la roche affleure sous l'herbe…)
const RANK = { w: 0, s: 1, d: 1, n: 1, v: 1, a: 2, r: 2, o: 2, g: 4, t: 4, m: 4, f: 4, x: 4, l: 4, j: 4 };
const familyOf = g => (RANK[g] === 4 ? 'herbe' : g === 'd' ? 's' : g);
// Les quatre bords d'une case : la voisine, et ses deux coins à l'écran (sens de la case vers la voisine)
const EDGES = [[1, 0, 'right', 'bottom'], [-1, 0, 'top', 'left'], [0, 1, 'left', 'bottom'], [0, -1, 'top', 'right']];
const cornerOf = (c, k) => (k === 'top' ? [c.x, c.y - TH / 2] : k === 'right' ? [c.x + TW / 2, c.y] : k === 'bottom' ? [c.x, c.y + TH / 2] : [c.x - TW / 2, c.y]);
// Bord festonné : le sol de la voisine déborde sur la case en vagues irrégulières, avec un liseré d'ombre (léger relief)
function spill(ctx, M, x, y, c, top) {
  const g = M.ground(x, y);
  for (const [dx, dy, ka, kb] of EDGES) {
    const nx = x + dx, ny = y + dy;
    if (!M.land(nx, ny)) continue;
    const ng = M.ground(nx, ny);
    if (RANK[ng] === undefined || RANK[g] === undefined || familyOf(ng) === familyOf(g) || RANK[ng] <= RANK[g]) continue;
    if (Math.abs(M.surface(nx, ny) - top) > 0.01) continue;
    const A = cornerOf(c, ka), B = cornerOf(c, kb);
    const ix = c.x - (A[0] + B[0]) / 2, iy = c.y - (A[1] + B[1]) / 2;
    const L = Math.hypot(ix, iy) || 1;
    const seed = (x + nx) * 31 + (y + ny) * 17;
    const pts = [];
    const N = 9;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const ends = Math.sin(Math.PI * t);
      const depth = (3 + 5 * rnd(seed, i, 3) + 3 * Math.sin(t * Math.PI * 3 + rnd(seed, 0, 4) * 6)) * (0.35 + 0.65 * ends);
      pts.push([A[0] + (B[0] - A[0]) * t + (ix / L) * depth, A[1] + (B[1] - A[1]) * t + (iy / L) * depth]);
    }
    ctx.save();
    diamond(ctx, c.x, c.y);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(...A);
    pts.forEach(p => ctx.lineTo(...p));
    ctx.lineTo(...B);
    ctx.closePath();
    ctx.fillStyle = paintColor(ng, M.height(nx, ny), (x + nx) / 2, (y + ny) / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(...pts[0]);
    pts.slice(1).forEach(p => ctx.lineTo(...p));
    ctx.strokeStyle = RANK[ng] === 4 ? 'rgba(40, 70, 25, .32)' : 'rgba(60, 45, 30, .22)';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();
  }
}
// Teintes des brins d'une herbe (sombre, claire, trèfle, olive), gardées par teinte d'herbe (l'herbe variant d'une case à
// l'autre, la réserve est vidée quand elle déborde)
const blades = new Map();
function bladeColors(base) {
  let out = blades.get(base);
  if (!out) {
    if (blades.size > 4096) blades.clear();
    out = [mixHex(base, '#1F3A18', 0.2), mixHex(base, '#F0F8C8', 0.3), mixHex(base, '#2F6B2A', 0.45), mixHex(base, '#5E5A2E', 0.3)];
    blades.set(base, out);
  }
  return out;
}
// Les fleurs des champs (choix de l'auteur, 12 oct. : « rares, dessinées, en massifs ») : elles ne poussent qu'en
// nappes (un bruit lent, de moyenne ½ : bloom est le seuil ; 0,44 : la prairie fleurit sur la moitié, 0,76 :
// une case d'herbe sur quinze environ), chaque nappe
// d'une espèce, quelques intruses ; chaque fleur dessinée : une ombre, une tige, et sa tête vue de trois quarts.
// Palette retenue : marguerite crème, lavande pâle, bouton d'or éteint. Vrai si la case en porte.
const FLOWERS = [
  // marguerite : cinq pétales crème (les deux du bas un peu ombrés), cœur doré
  (ctx, x, y) => {
    for (let k = 0; k < 5; k++) {
      const a = (k / 5) * Math.PI * 2 - Math.PI / 2;
      ctx.fillStyle = Math.sin(a) > 0.3 ? '#DCD5C0' : '#F4EFDF';
      ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 1.25, y + Math.sin(a) * 0.8, 1.1, 0.75, a, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = '#D6A43E'; ctx.beginPath(); ctx.ellipse(x, y, 0.85, 0.65, 0, 0, Math.PI * 2); ctx.fill();
  },
  // lavande : un épi de trois grains, du plus soutenu au plus pâle
  (ctx, x, y) => {
    [['#9C8CC6', 1.5, 1.05], ['#AE9FD3', 0, 0.95], ['#C2B7E0', -1.4, 0.8]].forEach(([col, dy, r]) => {
      ctx.fillStyle = col; ctx.beginPath(); ctx.ellipse(x, y + dy, r * 0.8, r, 0, 0, Math.PI * 2); ctx.fill();
    });
  },
  // bouton d'or : une coupe, son fond ombré, un reflet
  (ctx, x, y) => {
    ctx.fillStyle = '#B9963A'; ctx.beginPath(); ctx.ellipse(x, y + 0.3, 1.7, 1.25, 0, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#E2C460'; ctx.beginPath(); ctx.ellipse(x, y, 1.7, 0.9, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#F2E19A'; ctx.beginPath(); ctx.ellipse(x - 0.5, y - 0.2, 0.7, 0.4, 0, 0, Math.PI * 2); ctx.fill();
  }
];
function flowerBed(ctx, x, y, c, base, bloom) {
  const d = vnoise(x * 0.21 + 41, y * 0.21 + 23, 97);
  if (d < bloom) return false;
  const rich = Math.min(1, (d - bloom) / 0.15);
  // (la nappe s'éclaircit vers ses bords : des cases sans fleur, puis de petites touffes, plus fournies au cœur)
  if (rnd(x, y, 190) > 0.15 + rich * 0.6) return false;
  const count = 2 + Math.floor(rich * 4 * rnd(x, y, 191) + rich);
  const kind = Math.floor(vnoise(x * 0.09 + 7, y * 0.09 + 61, 98) * 2.999);
  const stem = bladeColors(base)[0];
  // (une touffe par case, serrée autour d'un point ; de l'arrière à l'avant : une fleur devant recouvre celle de derrière)
  const u0 = (rnd(x, y, 192) - 0.5) * 0.5, v0 = (rnd(x, y, 193) - 0.5) * 0.5;
  const spots = [];
  for (let k = 0; k < count; k++) {
    const u = u0 + (rnd(x, y, k + 200) - 0.5) * 0.34, v = v0 + (rnd(x, y, k + 210) - 0.5) * 0.34;
    spots.push([c.x + (u - v) * TW * 0.5, c.y + (u + v) * TH * 0.5, k]);
  }
  spots.sort((a, b) => a[1] - b[1]);
  ctx.lineCap = 'round';
  for (const [px, py, k] of spots) {
    const tall = 3 + rnd(x, y, k + 220) * 2.2, lean = (rnd(x, y, k + 230) - 0.5) * 1.6;
    ctx.fillStyle = 'rgba(28, 58, 40, .2)';
    ctx.beginPath(); ctx.ellipse(px + 0.8, py + 0.2, 1.9, 0.65, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = stem; ctx.lineWidth = 0.85;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px, py - tall * 0.6, px + lean, py - tall); ctx.stroke();
    const own = rnd(x, y, k + 240) < 0.85 ? kind : (kind + 1 + Math.floor(rnd(x, y, k + 250) * 2)) % 3;
    FLOWERS[own](ctx, px + lean, py - tall - 0.6);
  }
  return true;
}
// Semis de l'herbe : touffes à trois brins (vert sombre ou olive, un brin clair), parfois trèfle, fleurettes, caillou ;
// groupées par endroits, et quelques touffes isolées ailleurs
function grassSeed(ctx, x, y, c, base, bloom = 0.76) {
  // (discrètes : des brins à peine plus sombres que l'herbe, de deux tons)
  const dense = vnoise(x * 0.5 + 11, y * 0.5 + 5, 93);
  const count = dense < 0.36 ? (rnd(x, y, 170) < 0.3 ? 1 : 0) : 1 + Math.floor((dense - 0.36) * 7);
  const [deep, light, , olive] = bladeColors(base);
  ctx.lineCap = 'round';
  for (let k = 0; k < count; k++) {
    const u = rnd(x, y, k + 100) - 0.5, v = rnd(x, y, k + 120) - 0.5;
    const px = c.x + (u - v) * TW * 0.42, py = c.y + (u + v) * TH * 0.42;
    const s = 0.6 + rnd(x, y, k + 140) * 0.4;
    ctx.strokeStyle = rnd(x, y, k + 180) < 0.35 ? olive : deep;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(px - 2 * s, py); ctx.quadraticCurveTo(px - 2.5 * s, py - 3 * s, px - 3.5 * s, py - 5 * s);
    ctx.moveTo(px, py); ctx.quadraticCurveTo(px, py - 4 * s, px + 0.5 * s, py - 6.5 * s);
    ctx.moveTo(px + 2 * s, py); ctx.quadraticCurveTo(px + 2.5 * s, py - 3 * s, px + 3.8 * s, py - 4.5 * s);
    ctx.stroke();
    ctx.strokeStyle = light;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(px, py - 3 * s); ctx.quadraticCurveTo(px, py - 5 * s, px + 0.5 * s, py - 6.5 * s);
    ctx.stroke();
  }
  const r = rnd(x, y, 160);
  // (quelques fleurs, seulement là où la prairie fleurit en nappes : flowerBed)
  if (flowerBed(ctx, x, y, c, base, bloom)) return;
  if (r < 0.08) {
    // trèfle : trois petites feuilles rondes
    const px = c.x + (rnd(x, y, 164) - 0.5) * 24, py = c.y + (rnd(x, y, 165) - 0.5) * 9;
    ctx.fillStyle = bladeColors(base)[2];
    [[-1.4, 0], [1.4, 0], [0, -1.6]].forEach(([ox, oy]) => { ctx.beginPath(); ctx.arc(px + ox, py + oy, 1.6, 0, Math.PI * 2); ctx.fill(); });
  } else if (r < 0.24) {
    // caillou : un galet gris, clair dessus
    const px = c.x + (rnd(x, y, 166) - 0.5) * 24, py = c.y + (rnd(x, y, 167) - 0.5) * 9;
    ctx.fillStyle = '#8F887C'; ctx.beginPath(); ctx.ellipse(px, py, 2.6, 1.6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#C9C2B4'; ctx.beginPath(); ctx.ellipse(px - 0.5, py - 0.6, 1.5, 0.8, 0, 0, Math.PI * 2); ctx.fill();
  }
}
// Le semis de la jungle du départ, à la place des brins et des fleurs (choix de l'auteur, 18 oct.) : des feuilles
// tombées (émeraude, sarcelle, vert acide, rarement un pétale magenta), leur nervure claire, parfois un brin de
// fougère, des points de mousse
const LITTER = ['#0B5A46', '#1C9A6A', '#0E6E6C', '#8CCB34', '#0B5A46', '#E2348E'];
function jungleSeed(ctx, x, y, c) {
  const count = 2 + Math.floor(rnd(x, y, 300) * 3);
  for (let k = 0; k < count; k++) {
    const u = rnd(x, y, k + 310) - 0.5, v = rnd(x, y, k + 320) - 0.5;
    const px = c.x + (u - v) * TW * 0.44, py = c.y + (u + v) * TH * 0.44, a = rnd(x, y, k + 330) * Math.PI;
    const tone = LITTER[Math.floor(rnd(x, y, k + 340) * (rnd(x, y, k + 350) < 0.15 ? LITTER.length : LITTER.length - 1))];
    const L = 2.6 + rnd(x, y, k + 360) * 1.6;
    ctx.fillStyle = 'rgba(6, 30, 26, .28)';
    ctx.beginPath(); ctx.ellipse(px + 0.8, py + 0.6, L, L * 0.42, a, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = tone;
    ctx.beginPath(); ctx.ellipse(px, py, L, L * 0.42, a, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = 'rgba(220, 255, 200, .45)';
    ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(px - Math.cos(a) * L * 0.8, py - Math.sin(a) * L * 0.8); ctx.lineTo(px + Math.cos(a) * L * 0.8, py + Math.sin(a) * L * 0.8); ctx.stroke();
  }
  const r = rnd(x, y, 370);
  if (r < 0.3) {
    // un brin de fougère : une nervure, ses folioles
    const px = c.x + (rnd(x, y, 371) - 0.5) * 22, py = c.y + (rnd(x, y, 372) - 0.5) * 8;
    ctx.strokeStyle = '#1FA070';
    ctx.lineWidth = 0.9;
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(px + 1, py - 4, px + 3.5, py - 6.5);
    for (let i = 1; i <= 4; i++) { const qx = px + i * 0.8, qy = py - i * 1.5; ctx.moveTo(qx, qy); ctx.lineTo(qx - 2, qy - 0.8); ctx.moveTo(qx, qy); ctx.lineTo(qx + 1.8, qy + 0.4); }
    ctx.stroke();
  } else if (r < 0.55) {
    // des points de mousse claire
    ctx.fillStyle = 'rgba(170, 240, 120, .55)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 12 + rnd(x, y, k + 380) * 24, c.y - 4 + rnd(x, y, k + 390) * 8, 1.4, 1.4);
  }
}
// Eau douce : claire et turquoise le long des berges (le milieu paraît plus profond), un liseré lumineux au bord
function waterBanks(ctx, M, x, y, c) {
  for (const [dx, dy, ka, kb] of EDGES) {
    const ng = M.ground(x + dx, y + dy);
    if (ng === 'w' || ng === 'k' || ng === '~') continue;
    const A = cornerOf(c, ka), B = cornerOf(c, kb);
    const ix = c.x - (A[0] + B[0]) / 2, iy = c.y - (A[1] + B[1]) / 2;
    const L = Math.hypot(ix, iy) || 1;
    const w = 9;
    const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
    const g = ctx.createLinearGradient(mx, my, mx + (ix / L) * w, my + (iy / L) * w);
    g.addColorStop(0, 'rgba(170, 238, 236, .7)');
    g.addColorStop(1, 'rgba(170, 238, 236, 0)');
    ctx.save();
    diamond(ctx, c.x, c.y);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(...A); ctx.lineTo(...B);
    ctx.lineTo(B[0] + (ix / L) * w, B[1] + (iy / L) * w); ctx.lineTo(A[0] + (ix / L) * w, A[1] + (iy / L) * w);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(A[0] + (ix / L) * 1.2, A[1] + (iy / L) * 1.2); ctx.lineTo(B[0] + (ix / L) * 1.2, B[1] + (iy / L) * 1.2);
    ctx.stroke();
    ctx.restore();
  }
}
// Sable mouillé au bord de la mer : une bande plus sombre et luisante le long des bords qui touchent l'eau
function wetSand(ctx, M, x, y, c) {
  for (const [dx, dy, ka, kb] of EDGES) {
    if (M.land(x + dx, y + dy)) continue;
    if (dx < 0 || dy < 0) continue;
    const A = cornerOf(c, ka), B = cornerOf(c, kb);
    const ix = c.x - (A[0] + B[0]) / 2, iy = c.y - (A[1] + B[1]) / 2;
    const L = Math.hypot(ix, iy) || 1;
    const w = 7;
    const g = ctx.createLinearGradient((A[0] + B[0]) / 2, (A[1] + B[1]) / 2, (A[0] + B[0]) / 2 + (ix / L) * w, (A[1] + B[1]) / 2 + (iy / L) * w);
    g.addColorStop(0, 'rgba(150, 118, 70, .45)');
    g.addColorStop(0.7, 'rgba(170, 140, 90, .18)');
    g.addColorStop(1, 'rgba(170, 140, 90, 0)');
    ctx.save();
    diamond(ctx, c.x, c.y);
    ctx.clip();
    ctx.beginPath();
    ctx.moveTo(...A); ctx.lineTo(...B);
    ctx.lineTo(B[0] + (ix / L) * w, B[1] + (iy / L) * w); ctx.lineTo(A[0] + (ix / L) * w, A[1] + (iy / L) * w);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .45)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(A[0] + (ix / L) * 2.2, A[1] + (iy / L) * 2.2); ctx.lineTo(B[0] + (ix / L) * 2.2, B[1] + (iy / L) * 2.2);
    ctx.stroke();
    ctx.restore();
  }
}
const topColor = (g, h, odd) => {
  const key = g === 't' ? 'g' : g === 'd' ? 's' : g === 'k' ? 'w' : g;
  const set = TOPS[key] || TOPS.g;
  return set[Math.min(set.length - 1, Math.max(0, h))][odd ? 1 : 0];
};
// Faces : terre (sous l'herbe), sable, roche, eau qui tombe, marches de pierre ; [gauche, droite]
const FACES = {
  earth: ['#9C6A3A', '#7E5229'],
  sand: ['#D2B47A', '#BC9C63'],
  rock: ['#8E8578', '#766D61'],
  fall: ['#9AD3F0', '#86C6E8'],
  stairs: ['#9C6A3A', '#7E5229'],
  basalt: ['#4C4744', '#3B3734'],
  // Falaises d'une terre inconnue : assez sombres pour lire le relief sous le voile
  fog: ['#B4BCC0', '#A0A8AF']
};

// grassy : liseré en haut de la face (true : herbe ; ou une couleur [gauche, droite] : neige, bruyère…)
function face(ctx, x0, y0, x1, y1, drop, kind, side, grassy, wet = false) {
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.lineTo(x1, y1 + drop);
  ctx.lineTo(x0, y0 + drop);
  ctx.closePath();
  // Une teinte qui descend du clair au sombre (la face n'est plus un aplat : elle se lit en relief)
  const base = FACES[kind][side];
  const dark = '#' + base.slice(1).match(/../g).map(c => Math.round(parseInt(c, 16) * 0.72).toString(16).padStart(2, '0')).join('');
  const grad = ctx.createLinearGradient(0, Math.min(y0, y1), 0, Math.min(y0, y1) + drop);
  grad.addColorStop(0, base);
  grad.addColorStop(1, dark);
  ctx.fillStyle = grad;
  ctx.fill();
  if (kind === 'fall' || kind === 'fog') return;
  cliffDetail(ctx, x0, y0, x1, y1, drop, kind, side, grassy, wet);
}

// La face d'une falaise travaillée : Strates ondulées, cailloux pris dans la terre (clairs dessus),
// ombre au pied ; au bord de la mer, le bas mouillé (plus sombre, un filet luisant) ; en haut, l'herbe qui pend
function cliffDetail(ctx, x0, y0, x1, y1, drop, kind, side, grassy, wet) {
  const seed = Math.round(x0 * 7 + y0 * 13);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + drop); ctx.lineTo(x0, y0 + drop); ctx.closePath();
  ctx.clip();
  ctx.strokeStyle = kind === 'sand' ? 'rgba(120, 90, 45, .22)' : 'rgba(52, 30, 14, .24)';
  ctx.lineWidth = 1;
  for (let z = HS * 0.35, i = 0; z < drop - 2; z += HS * (0.38 + rnd(seed, i, 1) * 0.14), i++) {
    ctx.beginPath();
    for (let k = 0; k <= 6; k++) {
      const t = k / 6;
      const wob = Math.sin(t * Math.PI * 2 + rnd(seed, i, 2) * 6) * 1.6;
      const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t + z + wob;
      if (k) ctx.lineTo(px, py); else ctx.moveTo(px, py);
    }
    ctx.stroke();
  }
  if (kind !== 'sand') {
    const stones = Math.min(5, Math.floor(drop / 9));
    for (let k = 0; k < stones; k++) {
      const t = 0.12 + rnd(seed, k, 5) * 0.76, z = 5 + rnd(seed, k, 6) * (drop - 9);
      const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t + z, r = 1.8 + rnd(seed, k, 7) * 1.8;
      ctx.fillStyle = kind === 'rock' || kind === 'basalt' ? 'rgba(40, 34, 30, .35)' : 'rgba(150, 140, 125, .9)';
      ctx.beginPath(); ctx.ellipse(px, py, r * 1.3, r, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(255, 250, 235, .35)';
      ctx.beginPath(); ctx.ellipse(px - r * 0.3, py - r * 0.35, r * 0.6, r * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    }
  }
  // ombre au pied
  const foot = ctx.createLinearGradient(0, Math.min(y0, y1) + drop * 0.55, 0, Math.max(y0, y1) + drop);
  foot.addColorStop(0, 'rgba(30, 18, 8, 0)');
  foot.addColorStop(1, 'rgba(30, 18, 8, .22)');
  ctx.fillStyle = foot;
  ctx.fillRect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), drop + Math.abs(y1 - y0));
  if (wet) {
    const wz = Math.min(drop, HS * 0.55);
    ctx.fillStyle = 'rgba(40, 55, 70, .28)';
    ctx.beginPath();
    ctx.moveTo(x0, y0 + drop - wz); ctx.lineTo(x1, y1 + drop - wz); ctx.lineTo(x1, y1 + drop); ctx.lineTo(x0, y0 + drop); ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, .5)';
    ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.moveTo(x0, y0 + drop - wz); ctx.lineTo(x1, y1 + drop - wz); ctx.stroke();
  }
  ctx.restore();
  if (grassy) {
    // liseré d'herbe, et quelques brins qui pendent par-dessus le bord
    const tint = Array.isArray(grassy) ? grassy[side] : side ? '#6B8C55' : '#7A9C62';
    ctx.fillStyle = tint;
    ctx.beginPath();
    ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 + 3.5); ctx.lineTo(x0, y0 + 3.5);
    ctx.closePath();
    ctx.fill();
    if (!Array.isArray(grassy)) {
      for (let k = 0; k < 5; k++) {
        const t = 0.08 + k * 0.2 + rnd(seed, k, 8) * 0.08, len = 3 + rnd(seed, k, 9) * 5;
        const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t + 3;
        ctx.beginPath(); ctx.moveTo(px - 1.6, py); ctx.lineTo(px, py + len); ctx.lineTo(px + 1.6, py); ctx.closePath();
        ctx.fill();
      }
    }
  }
}

// Face avant d'une case de l'île flottante, côté mer : la croûte de terre, puis la roche suspendue jusqu'à un bord
// en pointes (profondeur aux coins ca, cb : continue d'une case à l'autre). Renvoie le contour complet (voile de brume)
const JAG = [0, 0.2, 0.55, 0.25, 0];
function hangingFace(ctx, M, x0, y0, x1, y1, ca, cb, side, grassy, seed) {
  const crust = CRUST * HS;
  face(ctx, x0, y0, x1, y1, crust, 'earth', side, grassy);
  const dA = (CRUST + underAt(M.float, ...ca)) * HS, dB = (CRUST + underAt(M.float, ...cb)) * HS;
  const bottom = JAG.map((jag, k) => {
    const t = k / (JAG.length - 1);
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + dA + (dB - dA) * t + jag * HS * (0.7 + rnd(seed, side, k) * 0.9)];
  });
  ctx.beginPath();
  ctx.moveTo(x0, y0 + crust);
  ctx.lineTo(x1, y1 + crust);
  for (let k = bottom.length - 1; k >= 0; k--) ctx.lineTo(...bottom[k]);
  ctx.closePath();
  ctx.fillStyle = FACES.rock[side];
  ctx.fill();
  // Ombre qui s'épaissit vers les pointes, une fissure
  const shade = ctx.createLinearGradient(0, Math.min(y0, y1) + crust, 0, Math.max(y0 + dA, y1 + dB) + HS * 0.6);
  shade.addColorStop(0, 'rgba(30, 24, 18, 0)');
  shade.addColorStop(1, 'rgba(30, 24, 18, .38)');
  ctx.fillStyle = shade;
  ctx.fill();
  ctx.strokeStyle = 'rgba(40, 32, 25, .3)';
  ctx.lineWidth = 1;
  const k = 0.3 + rnd(seed, side, 9) * 0.4;
  ctx.beginPath();
  ctx.moveTo(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k + crust + 2);
  ctx.lineTo(x0 + (x1 - x0) * (k + 0.06), y0 + (y1 - y0) * k + crust + (dA + dB) * 0.3);
  ctx.stroke();
  return [[x0, y0], [x1, y1], ...bottom.reverse()];
}

function diamond(ctx, cx, cy, w = TW, h = TH) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - h / 2);
  ctx.lineTo(cx + w / 2, cy);
  ctx.lineTo(cx, cy + h / 2);
  ctx.lineTo(cx - w / 2, cy);
  ctx.closePath();
}

// Lanterne d'un bout du pont : case de pont (x, y), terre en (x + dx, y + dy) ; au bord de la case, côté avant
export const bridgeLamp = (x, y, dx, dy) => ({ x: x + dx * 0.42 + Math.abs(dy) * 0.32, y: y + dy * 0.42 + Math.abs(dx) * 0.32, z: 0.15 });
const LAMP_H = 24;

// Pont de planches sur la mer (vers l'Îlot aux Mouettes), posé au ras de la terre : piles, tablier, rambardes de corde
// sur poteaux des deux côtés, une lanterne à chaque bout (sa lueur de nuit : WorldView)
function seaBridge(ctx, M, x, y) {
  const c = worldOf(x, y, 0.15);
  ctx.fillStyle = '#6B4A2A';
  for (const [dx, dy] of [[-0.35, -0.35], [0.35, 0.35]]) {
    const p = worldOf(x + dx, y + dy, 0.15);
    ctx.fillRect(p.x - 2, p.y, 4, HS * 1.5);
  }
  diamond(ctx, c.x, c.y, TW * 0.92, TH * 0.6);
  ctx.fillStyle = '#A47A4A';
  ctx.fill();
  ctx.strokeStyle = '#7A5530';
  ctx.lineWidth = 1;
  for (let k = -3; k <= 3; k++) {
    ctx.beginPath();
    ctx.moveTo(c.x + k * 6 - 9, c.y + k * 3 - 4.5 + (k * 0.2));
    ctx.lineTo(c.x + k * 6 + 9, c.y + k * 3 + 4.5 - (k * 0.2));
    ctx.stroke();
  }
  const alongX = 'b'.includes(M.ground(x - 1, y)) || 'b'.includes(M.ground(x + 1, y)) || M.land(x - 1, y) || M.land(x + 1, y);
  const post = (u, v, h) => {
    const p = worldOf(u, v, 0.15);
    ctx.fillStyle = '#5C3F24';
    ctx.fillRect(p.x - 1.2, p.y - h, 2.4, h);
    return { x: p.x, y: p.y - h };
  };
  // Rambarde : de l'arrière (-1) puis de l'avant (+1), corde qui pend un peu entre deux poteaux
  for (const side of [-1, 1]) {
    const a = alongX ? post(x - 0.5, y + side * 0.32, 12) : post(x + side * 0.32, y - 0.5, 12);
    const b = alongX ? post(x + 0.5, y + side * 0.32, 12) : post(x + side * 0.32, y + 0.5, 12);
    ctx.strokeStyle = '#D9C08A';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y + 1);
    ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 + 4, b.x, b.y + 1);
    ctx.stroke();
  }
  for (const [dx, dy] of alongX ? [[-1, 0], [1, 0]] : [[0, -1], [0, 1]]) {
    if (!M.land(x + dx, y + dy)) continue;
    const lamp = bridgeLamp(x, y, dx, dy);
    const top = post(lamp.x, lamp.y, LAMP_H);
    ctx.fillStyle = '#3D3A36';
    ctx.fillRect(top.x - 3.4, top.y - 8, 6.8, 2);
    ctx.fillStyle = '#FFE08A';
    ctx.fillRect(top.x - 2.6, top.y - 6, 5.2, 6);
    ctx.strokeStyle = '#3D3A36';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(top.x - 2.6, top.y - 6, 5.2, 6);
  }
}
// Lueur d'une lanterne du pont (unités du monde), pour l'éclairage de nuit
export const lampGlowOf = lamp => { const p = worldOf(lamp.x, lamp.y, lamp.z); return { x: p.x, y: p.y - LAMP_H - 3 }; };

// Liseré en haut des faces des sols des climats : [gauche, droite]
const LIPS = { n: ['#F4F7FA', '#E3EAF1'], v: ['#DDEFF7', '#CFE5F0'], l: ['#8E6F86', '#7E6277'] };

// Les dessins de chemin d'une case de chemin (pathArt.js) : [{ file, dx, dy }] (décalage depuis son centre, unités du
// monde) et clip (les peindre dans son losange seulement). Un chemin d'une case : son raccord vers ses voisines. Les
// parties plus larges : un seul chemin, au milieu, posé sur les coins que quatre cases de chemin se partagent (même
// hauteur) ; une case large où arrive un chemin d'une case trace aussi le bout qui les relie. Les gués (k) comptent
// comme chemin pour les raccords
const MASK_DIRS = [[0, -1, 1], [1, 0, 2], [0, 1, 4], [-1, 0, 8]];
export function pathDraws(M, x, y) {
  const isPath = (a, b) => 'pk'.includes(M.ground(a, b));
  const top = M.surface(x, y);
  const corner = (a, b) => [[a, b], [a + 1, b], [a, b + 1], [a + 1, b + 1]].every(([u, v]) => M.ground(u, v) === 'p' && M.surface(u, v) === top);
  const wideAt = (a, b) => corner(a, b) || corner(a - 1, b) || corner(a, b - 1) || corner(a - 1, b - 1);
  const maskOf = is => MASK_DIRS.reduce((m, [dx, dy, bit]) => (is(dx, dy) ? m | bit : m), 0);
  const alt = (a, b) => rnd(a, b, 40) < 0.5;
  // (une case pavée : le pavé pour tous ses dessins ; serve.js, M.isPaved)
  const pave = pavedAt(M, x, y);
  if (!wideAt(x, y)) return { clip: false, draws: [{ file: pathFile(maskOf((dx, dy) => isPath(x + dx, y + dy)), alt(x, y), pave), dx: 0, dy: 0 }] };
  const draws = [];
  // Les coins de cette case où passe le chemin du milieu : centre du coin (x + i − ½, y + j − ½)
  for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
    const a = x + i - 1, b = y + j - 1;
    if (!corner(a, b)) continue;
    const mask = maskOf((dx, dy) => corner(a + dx, b + dy));
    draws.push({ file: pathFile(mask, alt(a, b), pave), dx: ((i - j) * TW) / 2, dy: ((i + j - 1) * TH) / 2 });
  }
  // Un chemin d'une case qui arrive ici : le bout jusqu'au chemin du milieu (vers la voisine large d'à côté)
  const narrow = MASK_DIRS.filter(([dx, dy]) => isPath(x + dx, y + dy) && !wideAt(x + dx, y + dy));
  if (narrow.length) {
    const across = MASK_DIRS.filter(([dx, dy]) => narrow.some(n => n[0] !== dx && n[1] !== dy) && wideAt(x + dx, y + dy)).slice(0, 1);
    const mask = [...narrow, ...across].reduce((m, [, , bit]) => m | bit, 0);
    draws.push({ file: pathFile(mask, alt(x, y), pave), dx: 0, dy: 0 });
  }
  return { clip: true, draws };
}
// Une case de chemin pavée ? (la carte du jeu : serve.js, M.isPaved, d'après state.roads.paved ; le pavé : choix de
// l'auteur, 16 oct.)
export const pavedAt = (M, x, y) => Boolean(M.isPaved && M.isPaved(x, y));
// Le raccord d'une case de chemin vers ses voisines (masque : NE 1, SE 2, SO 4, NO 8), et l'herbe où il est peint
// (le creusement d'un chemin qu'on vient de tracer : roads.js)
export const pathMask = (M, x, y) => MASK_DIRS.reduce((m, [dx, dy, bit]) => ('pk'.includes(M.ground(x + dx, y + dy)) ? m | bit : m), 0);
export const pathGrass = (M, x, y) => topColor('g', M.height(x, y), (x + y) % 2);
// Peint les chemins d'une case dans son herbe (grass) ; faux si une image n'est pas encore prête (rien n'est peint)
function paintPath(ctx, M, x, y, c, grass) {
  const { clip, draws } = pathDraws(M, x, y);
  const imgs = draws.map(d => pathImage(d.file, grass));
  if (imgs.some(img => !img)) return false;
  ctx.save();
  if (clip) {
    diamond(ctx, c.x, c.y);
    ctx.clip();
  }
  draws.forEach((d, i) => ctx.drawImage(imgs[i], c.x + d.dx - TW / 2, c.y + d.dy - TH / 2, TW, TH));
  ctx.restore();
  return true;
}

// Une case : faces avant puis dessus, détails du sol, voile de brume (quartier à acheter)
export function drawCell(ctx, M, x, y, veil = 0) {
  const g = M.ground(x, y);
  if (g === '~') return;
  if (g === 'b') { seaBridge(ctx, M, x, y); return; }
  const h = M.height(x, y);
  const top = M.surface(x, y);
  const c = worldOf(x, y, top);
  const odd = (x + y) % 2;
  const grassy = 'gtmfjx'.includes(g) || LIPS[g] || false;
  const kindOf = (nx, ny) => {
    if (g === 'w') return M.ground(nx, ny) === 'w' || M.ground(nx, ny) === 'k' ? 'fall' : 'earth';
    if ((g === 'p' || g === 'k') && 'pk'.includes(M.ground(nx, ny))) return 'stairs';
    if (g === 's' || g === 'd') return 'sand';
    if (g === 'r' || g === 'n' || g === 'v') return 'rock';
    if (g === 'a' || g === 'o') return 'basalt';
    if (g === 'u') return 'fog';
    return h >= 2 && !'gtmfjx'.includes(g) ? 'rock' : 'earth';
  };
  const zl = M.surface(x, y + 1), zr = M.surface(x + 1, y);
  // Île flottante : côté mer, la face est suspendue (croûte et roche en pointes) ; son contour sert au voile
  const hangL = M.floats(x, y) && !M.land(x, y + 1), hangR = M.floats(x, y) && !M.land(x + 1, y);
  let outlineL = null, outlineR = null;
  if (hangL) outlineL = hangingFace(ctx, M, c.x - TW / 2, c.y, c.x, c.y + TH / 2, [x - 0.5, y + 0.5], [x + 0.5, y + 0.5], 0, grassy, x * 61 + y);
  else if (zl < top) face(ctx, c.x - TW / 2, c.y, c.x, c.y + TH / 2, (top - zl) * HS, kindOf(x, y + 1), 0, grassy, !M.land(x, y + 1));
  if (hangR) outlineR = hangingFace(ctx, M, c.x, c.y + TH / 2, c.x + TW / 2, c.y, [x + 0.5, y + 0.5], [x + 0.5, y - 0.5], 1, grassy, x * 61 + y);
  else if (zr < top) face(ctx, c.x, c.y + TH / 2, c.x + TW / 2, c.y, (top - zr) * HS, kindOf(x + 1, y), 1, grassy, !M.land(x + 1, y));
  // (un chemin : celui de la bibliothèque dans l'herbe de la case, sinon, le temps qu'il se lise, l'ancien chemin)
  const grass = g === 'p' ? topColor('g', h, odd) : null;
  // (sols naturels : peints sans damier, avec le débord de leurs voisins ; sous un chemin, l'herbe de ses voisines, que
  // son dessin laisse voir ; eau, terre inconnue : à plat)
  const painted = RANK[g] !== undefined && g !== 'w';
  const smooth = (painted || g === 'p') && paintSmooth(ctx, M, x, y, c);
  if (painted) {
    if (!smooth) paintTop(ctx, g, h, x, y, c);
    spill(ctx, M, x, y, c, top);
  } else if (!smooth) {
    diamond(ctx, c.x, c.y);
    ctx.fillStyle = grass || topColor(g, h, odd);
    ctx.fill();
  }
  if (g === 'w') waterBanks(ctx, M, x, y, c);
  const drawn = grass && paintPath(ctx, M, x, y, c, smooth ? CLEAR_GRASS : grass);
  if (grass && !drawn) {
    diamond(ctx, c.x, c.y);
    ctx.fillStyle = topColor(g, h, odd);
    ctx.fill();
  }
  // Détails : cailloux du chemin, fleurs de la prairie, ondulations du sable, brins d'herbe, fissures de la roche
  // (le chemin de la bibliothèque a déjà ses cailloux)
  if (g === 'p' && !drawn) {
    ctx.fillStyle = 'rgba(120, 90, 50, .28)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k) * 28, c.y - 5 + rnd(x, y, k + 9) * 10, 2, 2);
  } else if ('gmt'.includes(g) && M.jungle && M.jungle(x, y)) {
    jungleSeed(ctx, x, y, c);
  } else if (g === 'm') {
    // la prairie : des brins, et ses fleurs en nappes (plus souvent que dans l'herbe)
    grassSeed(ctx, x, y, c, paintColor(g, h, x, y), 0.44);
  } else if (g === 'g' || g === 't') {
    grassSeed(ctx, x, y, c, paintColor(g, h, x, y));
  } else if (g === 's' || g === 'd') {
    wetSand(ctx, M, x, y, c);
    ctx.strokeStyle = 'rgba(190, 150, 90, .25)';
    ctx.lineWidth = 1;
    const k = rnd(x, y, 2) * 8 - 4;
    ctx.beginPath();
    ctx.moveTo(c.x - 12, c.y + k);
    ctx.quadraticCurveTo(c.x, c.y + k - 3, c.x + 12, c.y + k);
    ctx.stroke();
  } else if (g === 'r') {
    // Roche : une dalle claire, une dalle sombre, une fissure, des cailloux
    for (let k = 0; k < 2; k++) {
      const ox = c.x - 9 + rnd(x, y, k + 30) * 18, oy = c.y - 3 + rnd(x, y, k + 33) * 6, sz = 5 + rnd(x, y, k + 36) * 4;
      ctx.fillStyle = k ? 'rgba(255, 255, 255, .16)' : 'rgba(55, 45, 35, .13)';
      ctx.beginPath();
      ctx.moveTo(ox - sz, oy);
      ctx.lineTo(ox - sz * 0.2, oy - sz * 0.45);
      ctx.lineTo(ox + sz, oy - sz * 0.1);
      ctx.lineTo(ox + sz * 0.3, oy + sz * 0.42);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(70, 60, 50, .3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 10 + rnd(x, y) * 6, c.y - 4);
    ctx.lineTo(c.x + rnd(x, y, 1) * 4, c.y + 1);
    ctx.lineTo(c.x + 8, c.y - 2 + rnd(x, y, 2) * 5);
    ctx.stroke();
    ctx.fillStyle = 'rgba(80, 70, 60, .4)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 13 + rnd(x, y, k + 40) * 26, c.y - 5 + rnd(x, y, k + 44) * 10, 1.8, 1.4);
  } else if (g === 'n' || g === 'v') {
    // Neige : un reflet bleuté, quelques scintillements ; lac gelé : des fêlures claires
    ctx.fillStyle = 'rgba(160, 190, 220, .25)';
    ctx.beginPath();
    ctx.ellipse(c.x - 6 + rnd(x, y, 5) * 12, c.y + 2, 9, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 255, 255, .95)';
    for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k + 50) * 28, c.y - 5 + rnd(x, y, k + 53) * 10, 1.6, 1.6);
    if (g === 'v') {
      ctx.strokeStyle = 'rgba(255, 255, 255, .7)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(c.x - 12, c.y - 2 + rnd(x, y, 6) * 4);
      ctx.lineTo(c.x - 2, c.y + 1);
      ctx.lineTo(c.x + 10, c.y - 3 + rnd(x, y, 7) * 5);
      ctx.stroke();
    }
  } else if (g === 'l') {
    // Lande : touffes de bruyère mauve et d'ajonc doré
    for (let k = 0; k < 6; k++) {
      ctx.fillStyle = k % 3 === 2 ? 'rgba(232, 196, 78, .8)' : 'rgba(150, 92, 160, .55)';
      ctx.beginPath();
      ctx.arc(c.x - 15 + rnd(x, y, k + 60) * 30, c.y - 5 + rnd(x, y, k + 66) * 10, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (g === 'x') {
    // Marais : une flaque d'eau dormante et des brins de joncs
    ctx.fillStyle = 'rgba(70, 120, 120, .45)';
    ctx.beginPath();
    ctx.ellipse(c.x - 4 + rnd(x, y, 8) * 8, c.y + rnd(x, y, 9) * 4 - 2, 8 + rnd(x, y, 10) * 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(40, 80, 30, .45)';
    for (let k = 0; k < 4; k++) ctx.fillRect(c.x - 14 + rnd(x, y, k + 70) * 28, c.y - 6 + rnd(x, y, k + 74) * 10, 1.2, 4);
  } else if (g === 'j') {
    // Jungle : sous-bois sombre, feuilles larges
    for (let k = 0; k < 4; k++) {
      ctx.fillStyle = k % 2 ? 'rgba(20, 70, 30, .4)' : 'rgba(110, 170, 80, .35)';
      ctx.beginPath();
      ctx.ellipse(c.x - 12 + rnd(x, y, k + 80) * 24, c.y - 4 + rnd(x, y, k + 84) * 8, 4, 1.8, rnd(x, y, k + 88) * 3, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (g === 'a' || g === 'o') {
    // Cendre : fissures sombres (la lave, elle, rougeoie dans ses fissures)
    ctx.strokeStyle = g === 'o' ? 'rgba(255, 214, 120, .85)' : 'rgba(30, 26, 24, .45)';
    ctx.lineWidth = g === 'o' ? 1.4 : 1;
    ctx.beginPath();
    ctx.moveTo(c.x - 12 + rnd(x, y, 11) * 5, c.y - 3);
    ctx.lineTo(c.x - 1, c.y + 1 + rnd(x, y, 12) * 2);
    ctx.lineTo(c.x + 11, c.y - 2 + rnd(x, y, 13) * 4);
    ctx.stroke();
    if (g === 'a') {
      ctx.fillStyle = 'rgba(200, 190, 180, .25)';
      for (let k = 0; k < 3; k++) ctx.fillRect(c.x - 13 + rnd(x, y, k + 90) * 26, c.y - 5 + rnd(x, y, k + 93) * 10, 1.6, 1.2);
    }
  } else if (g === 'u') {
    // Terre inconnue : des volutes de brume légère ; on devine le relief dessous, pas ce qu'il cache
    ctx.fillStyle = 'rgba(255, 255, 255, .4)';
    ctx.beginPath();
    ctx.arc(c.x - 7 + rnd(x, y, 14) * 6, c.y - 1, 6 + rnd(x, y, 15) * 3, 0, Math.PI * 2);
    ctx.arc(c.x + 4 + rnd(x, y, 16) * 6, c.y + 1, 5 + rnd(x, y, 17) * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  // Pont de bois sur la rivière : sa tranche de la passerelle (world/pontRiviere.js)
  if (g === 'k') drawRiverBridge(ctx, M, x, y, veil);
  if (veil > 0) {
    const outline = pts => { ctx.beginPath(); ctx.moveTo(...pts[0]); pts.slice(1).forEach(p => ctx.lineTo(...p)); ctx.closePath(); ctx.fill(); };
    const paint = () => {
      diamond(ctx, c.x, c.y, TW + 1, TH + 1);
      ctx.fill();
      if (outlineL) outline(outlineL);
      else if (zl < top) outline([[c.x - TW / 2, c.y], [c.x, c.y + TH / 2], [c.x, c.y + TH / 2 + (top - zl) * HS], [c.x - TW / 2, c.y + (top - zl) * HS]]);
      if (outlineR) outline(outlineR);
      else if (zr < top) outline([[c.x, c.y + TH / 2], [c.x + TW / 2, c.y], [c.x + TW / 2, c.y + (top - zr) * HS], [c.x, c.y + TH / 2 + (top - zr) * HS]]);
    };
    // La brume froide (choix de l'auteur, 15 oct.) : légère et claire au bord de la terre dégagée, plus dense et
    // bleu-gris au loin ; la partie vivante de l'île reste la plus lumineuse de l'écran, et la nuit la brume reste
    // bleue (la brume vivante passe par-dessus, world/voile.js)
    const k = Math.min(1, Math.max(0, (veil - 0.3) / 0.55));
    const mix = (p, q) => Math.round(p + (q - p) * k);
    ctx.fillStyle = `rgba(${mix(232, 150)}, ${mix(238, 166)}, ${mix(246, 192)}, ${(veil * (0.66 + 0.3 * k)).toFixed(3)})`;
    paint();
  }
}

// Sol de l'île en carrés gardés en images, alignés sur l'écran (aucun chevauchement) : un carré fait TILE_PX pixels
// de côté, quelle que soit la résolution, et couvre donc TILE_PX / res unités du monde. Les carrés à l'écran ne
// sont jamais jetés ; au-delà de MAX_TILES, les plus anciens hors de l'écran partent d'abord (sauf ceux d'un trajet
// préparé d'avance : prepare, jusqu'à release). Vue de toute l'île :
// une seule image basse résolution (la vue d'ensemble), qui sert aussi en attendant un carré pas encore prêt.
// veilOf(x, y) : voile de brume d'une case (0 si son quartier est à soi) ; standOf(ctx, x, y) : peint le décor fixe
// d'une case, vrai si tout était prêt (les carrés cuits avant que tous les dessins soient chargés seront refaits)
// Un carré pas encore prêt (une image du décor manque) : refait STALE_TRIES fois au plus, à STALE_GAP_MS d'écart
const STALE_TRIES = 8;
export const STALE_GAP_MS = 300;
// (une image du décor qui ne vient pas ne le fait pas refaire à chaque image, sans fin)
const retryable = (tile, now) => tile.stale && (tile.tries || 0) < STALE_TRIES && now - (tile.at || 0) > STALE_GAP_MS;
// Une peinture par pas (painting, rendering), déroulée d'un trait : son résultat
const finish = steps => {
  let step = steps.next();
  while (!step.done) step = steps.next();
  return step.value;
};

// Le voile s'épaissit avec la distance à la terre dégagée la plus proche, sur FEATHER cases (choix de l'auteur,
// 15 oct. : la brume froide, légère au bord, pleine au loin) ; relu à chaque préparation d'un carré (le voile change
// quand un quartier s'achète). box : { x0, y0, x1, y1 }, les cases à lire (toute l'île sinon). La distance (en cases,
// diagonales comprises) se calcule en deux passes sur ces cases élargies de FEATHER : un coût à la mesure du carré, et
// seulement à la première case voilée (un carré tout dégagé ne la calcule pas)
export const FEATHER = 6;
const DEPTH = [0, 0.5, 0.62, 0.74, 0.85, 0.93, 0.98, 1];
export function featheredVeil(M, veilOf, box = null) {
  const n = M.n, far = FEATHER + 1;
  const x0 = Math.max(0, (box ? box.x0 : 0) - FEATHER), y0 = Math.max(0, (box ? box.y0 : 0) - FEATHER);
  const x1 = Math.min(n - 1, (box ? box.x1 : n - 1) + FEATHER), y1 = Math.min(n - 1, (box ? box.y1 : n - 1) + FEATHER);
  const w = Math.max(0, x1 - x0 + 1), h = Math.max(0, y1 - y0 + 1);
  let dist = null;
  const distances = () => {
    dist = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) dist[y * w + x] = M.land(x0 + x, y0 + y) && veilOf(x0 + x, y0 + y) <= 0 ? 0 : far;
    const at = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? far : dist[y * w + x]);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      dist[y * w + x] = Math.min(dist[y * w + x], at(x - 1, y) + 1, at(x - 1, y - 1) + 1, at(x, y - 1) + 1, at(x + 1, y - 1) + 1);
    }
    for (let y = h - 1; y >= 0; y--) for (let x = w - 1; x >= 0; x--) {
      dist[y * w + x] = Math.min(dist[y * w + x], at(x + 1, y) + 1, at(x + 1, y + 1) + 1, at(x, y + 1) + 1, at(x - 1, y + 1) + 1);
    }
  };
  return (x, y) => {
    const v = veilOf(x, y);
    if (v <= 0) return v;
    if (!dist) distances();
    const d = x >= x0 && x <= x1 && y >= y0 && y <= y1 ? dist[(y - y0) * w + (x - x0)] : far;
    return v * DEPTH[Math.min(far, d)];
  };
}

export class TerrainCache {
  constructor(M, veilOf, standOf = null) {
    this.M = M;
    this.veilOf = veilOf;
    this.standOf = standOf;
    this.tiles = new Map();
    // Les carrés d'un trajet préparé d'avance (prepare : clé → où les repeindre) : gardés au-delà de MAX_TILES jusqu'à
    // release (le vol du conseil en prépare une quarantaine ; jetés dès ses premières images, ils étaient repeints
    // pendant qu'il passait)
    this.kept = new Map();
    // Le carré du trajet en cours de préparation, peint par morceaux ({ key, steps, version }) ; version : comptée à
    // chaque changement du sol ou du décor (un carré peint pendant l'un d'eux se refera)
    this.job = null;
    this.version = 0;
    this.overview = null;
    const n = M.n;
    // Rectangle du monde où il y a du sol (au-delà, la mer)
    this.bounds = { x: (-n * TW) / 2 - TW, y: -CELL_ABOVE_MAX, w: n * TW + 2 * TW, h: n * TH + CELL_ABOVE_MAX + CELL_BELOW };
  }

  // Le décor fixe a changé : les carrés où il est cuit et la vue d'ensemble seront refaits
  restand() {
    this.version++;
    for (const tile of this.tiles.values()) {
      if (!tile.bake) continue;
      tile.stale = true;
      tile.tries = 0;
    }
    if (this.overview) { this.overview.stale = true; this.overview.retries = 0; }
  }

  // Peint les cases qui touchent un rectangle du monde, dans l'ordre du relief (diagonale après diagonale, de gauche
  // à droite) ; le canvas ou la découpe coupe ce qui dépasse. stand : avec le décor fixe de chaque case. Renvoie le
  // nombre de cases peintes (this.ready dit si tout le décor était prêt)
  paint(ctx, r, stand = false) {
    const { count, ready } = finish(this.painting(ctx, r, stand));
    this.ready = ready;
    return count;
  }

  // Les mêmes cases, une diagonale à chaque pas (la préparation d'un trajet s'arrête entre deux : prepare) ; à la fin,
  // { count, ready }
  *painting(ctx, r, stand = false) {
    let ready = true;
    const M = this.M, n = M.n;
    // Centre d'une case : ((x - y) · TW/2, (x + y) · TH/2) ; d = x + y, u = x - y
    // (cases qui touchent le rectangle sur plus qu'un bord ; avec le décor, aussi celles dont un arbre y dépasse)
    const side = TW / 2 + 2 + (stand ? STAND_SIDE : 0), above = stand ? STAND_ABOVE : 0;
    const umin = Math.floor(((r.x - side) * 2) / TW) + 1, umax = Math.ceil(((r.x + r.w + side) * 2) / TW) - 1;
    const dmin = Math.max(0, Math.floor(((r.y - CELL_BELOW) * 2) / TH) + 1), dmax = Math.min(2 * n - 2, Math.ceil(((r.y + r.h + CELL_ABOVE_MAX + above) * 2) / TH) - 1);
    let count = 0;
    // (le voile brut de chaque case, lu une fois pour cette préparation : le bord fondu relit ses voisines ; les cases
    // à lire sont celles des diagonales peintes)
    const raw = new Map();
    const box = { x0: Math.ceil((dmin + umin) / 2), x1: Math.floor((dmax + umax) / 2), y0: Math.ceil((dmin - umax) / 2), y1: Math.floor((dmax - umin) / 2) };
    const veil = featheredVeil(M, (x, y) => {
      const key = y * n + x;
      let v = raw.get(key);
      if (v === undefined) raw.set(key, (v = this.veilOf(x, y)));
      return v;
    }, box);
    for (let d = dmin; d <= dmax; d++) {
      const xa = Math.max(0, d - n + 1, Math.ceil((d + umin) / 2)), xb = Math.min(n - 1, d, Math.floor((d + umax) / 2));
      for (let x = xa; x <= xb; x++) {
        const y = d - x;
        if (!M.land(x, y) && M.ground(x, y) !== 'b') continue;
        if ((d * TH) / 2 - aboveOf(M, x, y) - above >= r.y + r.h || (d * TH) / 2 + CELL_BELOW <= r.y) continue;
        drawCell(ctx, M, x, y, veil(x, y));
        if (stand && !this.standOf(ctx, x, y)) ready = false;
        count++;
      }
      yield;
    }
    return { count, ready };
  }

  // Un carré : sa case de la grille à cette résolution, avec une marge de PAD_PX pixels qui recouvre ses voisins
  // (aucune couture entre deux carrés). Un carré de pleine mer ne garde pas d'image
  render(tx, ty, res, bake = false) {
    return finish(this.rendering(tx, ty, res, bake));
  }

  // Le même carré, une diagonale de cases à chaque pas (prepare)
  *rendering(tx, ty, res, bake = false) {
    const size = TILE_PX / res, pad = PAD_PX / res;
    const r = { x: tx * size - pad, y: ty * size - pad, w: size + 2 * pad, h: size + 2 * pad };
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = TILE_PX + 2 * PAD_PX;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(res, 0, 0, res, -r.x * res, -r.y * res);
    const { count, ready } = yield* this.painting(ctx, r, bake);
    if (count) return { canvas, r, res, bake, stale: bake && !ready };
    canvas.width = canvas.height = 0;
    return { canvas: null, r, res, bake };
  }

  // Toute l'île en basse résolution
  // (avec le décor fixe ; peinte trop tôt, elle est refaite un peu plus tard, OVERVIEW_RETRIES fois au plus)
  overviewOf() {
    const now = performance.now();
    const o = this.overview;
    if (o && !(o.stale && o.retries < OVERVIEW_RETRIES && now - o.at > 400)) return o;
    const b = this.bounds;
    const canvas = o ? o.canvas : document.createElement('canvas');
    canvas.width = Math.ceil(b.w * OVERVIEW_RES);
    canvas.height = Math.ceil(b.h * OVERVIEW_RES);
    const ctx = canvas.getContext('2d');
    ctx.setTransform(OVERVIEW_RES, 0, 0, OVERVIEW_RES, -b.x * OVERVIEW_RES, -b.y * OVERVIEW_RES);
    this.paint(ctx, b, Boolean(this.standOf));
    this.overview = { canvas, ctx, at: now, stale: !this.ready, retries: o ? o.retries + 1 : 0 };
    return this.overview;
  }

  // Dessine le sol visible (view : rectangle du monde, scale : pixels par unité du monde ; bake : avec le décor fixe).
  // Les carrés manquants sont préparés tant qu'il reste du temps (budget en ms, au moins un par image ; tous d'un coup
  // à l'arrivée sur l'île), puis, tout étant prêt, un voisin de l'écran d'avance. Renvoie le nombre de carrés encore à
  // préparer
  draw(ctx, view, scale, budget = 8, bake = false) {
    const res = resOf(scale);
    bake = bake && Boolean(this.standOf);
    const tag = `${res}${bake ? 'b' : ''}`;
    const b = this.bounds;
    if (res <= OVERVIEW_RES) {
      ctx.drawImage(this.overviewOf().canvas, b.x, b.y, b.w, b.h);
      this.seen = 0;
      return 0;
    }
    const size = TILE_PX / res;
    const x0 = Math.floor(Math.max(view.x, b.x) / size), x1 = Math.floor(Math.min(view.x + view.w, b.x + b.w) / size);
    const y0 = Math.floor(Math.max(view.y, b.y) / size), y1 = Math.floor(Math.min(view.y + view.h, b.y + b.h) / size);
    const start = performance.now();
    const all = !this.tiles.size;
    const seen = new Set();
    let rendered = 0, missing = 0;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${tag}:${tx},${ty}`;
        seen.add(key);
        let tile = this.tiles.get(key);
        // (un carré pas encore prêt est refait quelques fois, espacées)
        if ((!tile || retryable(tile, start)) && (all || !rendered || performance.now() - start < budget)) {
          const tries = tile ? (tile.tries || 0) + 1 : 0;
          if (tile && tile.canvas) tile.canvas.width = tile.canvas.height = 0;
          tile = this.render(tx, ty, res, bake);
          tile.tries = tries;
          tile.at = start;
          rendered++;
        }
        if (tile) {
          // Le plus récemment vu passe en dernier : les plus anciens partent d'abord
          this.tiles.delete(key);
          this.tiles.set(key, tile);
          if (tile.stale) missing++;
          if (tile.canvas) ctx.drawImage(tile.canvas, tile.r.x, tile.r.y, tile.r.w, tile.r.h);
        } else {
          missing++;
          this.stand(ctx, { x: tx * size, y: ty * size, w: size, h: size });
        }
      }
    }
    if (!missing && this.tiles.size < MAX_TILES && performance.now() - start < budget) this.ahead(res, bake, x0 - 1, y0 - 1, x1 + 1, y1 + 1);
    for (const [key, tile] of this.tiles) {
      if (this.tiles.size <= MAX_TILES) break;
      if (seen.has(key) || this.kept.has(key)) continue;
      if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
      this.tiles.delete(key);
    }
    // (carrés à l'écran : le chargement de l'île compte ceux qui sont prêts)
    this.seen = seen.size;
    return missing;
  }

  // Un carré manquant d'une vue du monde à cette échelle, préparé d'avance (le vol du conseil : WorldView, phare.js),
  // peint par morceaux jusqu'à until (performance.now(), au moins une diagonale de cases) : true s'il a peint, false
  // quand la vue est toute prête. Le carré commencé se finit d'abord
  prepare(view, scale, bake = false, until = Infinity) {
    if (this.job) return this.advance(until);
    const res = resOf(scale);
    if (res <= OVERVIEW_RES) return false;
    bake = bake && Boolean(this.standOf);
    const size = TILE_PX / res, b = this.bounds;
    const x0 = Math.floor(Math.max(view.x, b.x) / size), x1 = Math.floor(Math.min(view.x + view.w, b.x + b.w) / size);
    const y0 = Math.floor(Math.max(view.y, b.y) / size), y1 = Math.floor(Math.min(view.y + view.h, b.y + b.h) / size);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${res}${bake ? 'b' : ''}:${tx},${ty}`;
        this.kept.set(key, { tx, ty, res, bake });
        if (this.tiles.has(key)) continue;
        this.job = { key, steps: this.rendering(tx, ty, res, bake), version: this.version };
        return this.advance(until);
      }
    }
    return false;
  }

  // Un carré du trajet préparé à refaire (un chemin ou un dessin du décor arrivé depuis), refait à son tour, comme à
  // l'écran, et par morceaux comme prepare : true s'il a peint (repeint pendant le vol, il le faisait saccader)
  retouch(until = Infinity) {
    if (this.job) return this.advance(until);
    const now = performance.now();
    for (const [key, { tx, ty, res, bake }] of this.kept) {
      const tile = this.tiles.get(key);
      if (!tile || !retryable(tile, now)) continue;
      this.job = { key, steps: this.rendering(tx, ty, res, bake), version: this.version };
      return this.advance(until);
    }
    return false;
  }

  // Le carré en cours, peint jusqu'à until (au moins une diagonale) ; fini, il prend sa place : l'image qu'il remplace
  // est libérée, et un carré refait compte ses essais. Toujours true (il y avait à peindre)
  advance(until) {
    const job = this.job;
    let step;
    do step = job.steps.next(); while (!step.done && performance.now() < until);
    if (!step.done) return true;
    this.job = null;
    const tile = step.value;
    // (le sol ou le décor a changé pendant qu'il se peignait : il se refera)
    if (job.version !== this.version) tile.stale = true;
    const old = this.tiles.get(job.key);
    if (old && old.canvas) old.canvas.width = old.canvas.height = 0;
    tile.tries = old ? (old.tries || 0) + 1 : 0;
    tile.at = performance.now();
    this.tiles.set(job.key, tile);
    return true;
  }

  // Le trajet préparé est passé : ses carrés redeviennent des carrés comme les autres
  release() {
    this.kept.clear();
    this.job = null;
  }

  // Un carré pas encore prêt autour de l'écran (sur l'île), préparé d'avance
  ahead(res, bake, x0, y0, x1, y1) {
    const size = TILE_PX / res, b = this.bounds;
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        const key = `${res}${bake ? 'b' : ''}:${tx},${ty}`;
        if (this.tiles.has(key) || (tx + 1) * size < b.x || tx * size > b.x + b.w || (ty + 1) * size < b.y || ty * size > b.y + b.h) continue;
        this.tiles.set(key, this.render(tx, ty, res, bake));
        return;
      }
    }
  }

  // En attendant un carré : la vue d'ensemble si elle existe déjà (vue de toute l'île), puis les carrés d'une autre
  // résolution qui le recouvrent (découpés à sa place)
  stand(ctx, r) {
    const b = this.bounds;
    if (this.overview) {
      const k = OVERVIEW_RES;
      ctx.drawImage(this.overview.canvas, (r.x - b.x) * k, (r.y - b.y) * k, r.w * k, r.h * k, r.x, r.y, r.w, r.h);
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (tile.canvas && t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) ctx.drawImage(tile.canvas, t.x, t.y, t.w, t.h);
    }
    ctx.restore();
  }

  // La brume de ces cases a changé (quartier acheté) : leurs carrés sont refaits au fil des images (l'ancien reste
  // affiché d'ici là), la vue d'ensemble est repeinte à leur place
  // pad : en cases, autour des cases changées (le voile d'un quartier qui change s'épaissit ou s'éclaircit sur FEATHER
  // cases chez ses voisins)
  invalidate(cells, pad = 0) {
    if (!cells.length) return;
    this.version++;
    const box = cellsBox(this.M, cells);
    const r = { x: box.x - pad * TW, y: box.y - pad * TH, w: box.w + 2 * pad * TW, h: box.h + 2 * pad * TH };
    for (const tile of this.tiles.values()) {
      const t = tile.r;
      if (t.x < r.x + r.w && t.x + t.w > r.x && t.y < r.y + r.h && t.y + t.h > r.y) {
        tile.stale = true;
        tile.tries = 0;
      }
    }
    if (this.overview) {
      const { ctx } = this.overview;
      ctx.save();
      ctx.beginPath();
      ctx.rect(r.x, r.y, r.w, r.h);
      ctx.clip();
      ctx.clearRect(r.x, r.y, r.w, r.h);
      this.paint(ctx, r, Boolean(this.standOf));
      ctx.restore();
    }
  }

  // Libère toutes les images (sortie de l'île)
  clear() {
    for (const tile of this.tiles.values()) if (tile.canvas) tile.canvas.width = tile.canvas.height = 0;
    this.tiles.clear();
    this.kept.clear();
    this.job = null;
    if (this.overview) this.overview.canvas.width = this.overview.canvas.height = 0;
    this.overview = null;
  }
}

// Résolution des images du sol pour une échelle d'affichage : par paliers de √2 (une image n'est jamais agrandie,
// et pas plus de 1,41 fois réduite), entre la vue d'ensemble et MAX_RES
export function resOf(scale) {
  return Math.min(MAX_RES, 2 ** (Math.ceil(2 * Math.log2(Math.max(OVERVIEW_RES, scale))) / 2));
}

// Rectangle du monde que couvrent des cases ([x, y]), relief et faces compris
export function cellsBox(M, cells) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of cells) {
    const c = worldOf(x, y, 0);
    x0 = Math.min(x0, c.x - TW / 2 - 2);
    x1 = Math.max(x1, c.x + TW / 2 + 2);
    y0 = Math.min(y0, c.y - aboveOf(M, x, y));
    y1 = Math.max(y1, c.y + CELL_BELOW);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

// Ce qui bouge sur le sol, précalculé une fois par île : cases d'eau douce, faces de cascade, bords de mer devant
// (shore : la mer en +y, côté 0, ou en +x, côté 1) et derrière (back : la mer en −y, côté 0, ou en −x, côté 1) ;
// rien autour de l'île flottante
export function liveOf(M) {
  const water = [], falls = [], shore = [], back = [];
  for (let y = 0; y < M.n; y++) {
    for (let x = 0; x < M.n; x++) {
      const g = M.ground(x, y);
      if (g === 'w') {
        water.push({ x, y });
        const top = M.surface(x, y);
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) {
          const ng = M.ground(x + dx, y + dy);
          if ((ng === 'w' || ng === 'k') && M.surface(x + dx, y + dy) < top - 0.5) falls.push({ x, y, side, drop: (top - M.surface(x + dx, y + dy)) * HS });
        }
      }
      if (M.land(x, y) && !M.floats(x, y)) {
        for (const [dx, dy, side] of [[0, 1, 0], [1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') shore.push({ x, y, side });
        for (const [dx, dy, side] of [[0, -1, 0], [-1, 0, 1]]) if (M.ground(x + dx, y + dy) === '~') back.push({ x, y, side });
      }
    }
  }
  return { water, falls, shore, back };
}

// Traits blancs regroupés : ceux de même teinte et de même épaisseur partent en un seul tracé (de loin, toute la côte et
// toute l'eau douce sont à l'écran : un millier de traits). Teinte au 1/50 et épaisseur au 1/10 près, l'œil n'y voit
// pas de différence. add(alpha, largeur, tracé) : tracé(ctx) ajoute ses segments au chemin ; flush(ctx) dessine tout
export function strokeBatch() {
  const groups = new Map();
  return {
    add(alpha, width, trace) {
      const a = Math.round(alpha * 50) / 50, w = Math.round(width * 10) / 10;
      if (a <= 0) return;
      const key = `${a}|${w}`;
      if (!groups.has(key)) groups.set(key, { a, w, traces: [] });
      groups.get(key).traces.push(trace);
    },
    flush(ctx) {
      for (const { a, w, traces } of groups.values()) {
        ctx.strokeStyle = `rgba(255,255,255,${a})`;
        ctx.lineWidth = w;
        ctx.beginPath();
        for (const trace of traces) trace(ctx);
        ctx.stroke();
      }
      groups.clear();
    }
  };
}

// Animation de l'eau douce sur les cases visibles : reflets qui glissent, cascades qui tombent (la mer : sea.js)
export function drawLive(ctx, M, live, view, t) {
  const seen = c => c.x > view.x - TW && c.x < view.x + view.w + TW && c.y > view.y - TW * 2 && c.y < view.y + view.h + TW;
  ctx.lineCap = 'round';
  const glints = strokeBatch();
  for (const cell of live.water) {
    const c = worldOf(cell.x, cell.y, M.surface(cell.x, cell.y));
    if (!seen(c)) continue;
    const k = (t * 0.35 + rnd(cell.x, cell.y) ) % 1;
    glints.add(0.45 * Math.sin(k * Math.PI), 1.4, x => {
      x.moveTo(c.x - 10 + k * 8, c.y - 3 + k * 4);
      x.quadraticCurveTo(c.x - 2 + k * 8, c.y - 6 + k * 4, c.x + 6 + k * 8, c.y - 3 + k * 4);
    });
  }
  glints.flush(ctx);
  // (les cascades, le courant et les poissons : world/eauDouce.js)
}

