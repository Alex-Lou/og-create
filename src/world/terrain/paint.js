// Les couleurs du sol : teintes de chaque sol, bruit continu d'une case à l'autre, herbe par quartier, jungle, le champ
// lissé de toute l'île (ombres portées, liseré du soleil) et le rang des sols qui se recouvrent.
import { mixHex } from '../iso';
import { thicknessAt } from '../jungleLayout';
import { TW, TH, diamond } from './geo';

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
const JUNGLE_DEEP = '#16855A', JUNGLE_TEAL = '#0E7270', JUNGLE_SUN = '#9EE04A', JUNGLE_SHADE = '#08463C', JUNGLE_FLOOR = 0.66;

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
        // (sous les massifs, leur ombre commune : la mousse s'assombrit où la jungle s'épaissit, jungleLayout.js)
        if (jw > 0) { const floor = rgbOf(mixHex(jungleFloor(cx - 0.5, cy - 0.5), JUNGLE_SHADE, 0.45 * thicknessAt(nx, ny))); for (let c = 0; c < 3; c++) rgb[c] = rgb[c] * (1 - JUNGLE_FLOOR * jw) + floor[c] * JUNGLE_FLOOR * jw; }
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

export { rnd, TOPS, vnoise, paintTop, RANK, familyOf };
