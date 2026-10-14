// Le sol mouillé (choix de l'auteur, 14 oct. : « la pluie qui mouille ») : sous l'averse, la terre fonce et les
// chemins luisent ; après, l'île sèche peu à peu (le mouillé : averse.js, wetnessAt, une heure environ). Dessiné dans
// le monde, sur le sol (sous ce qui s'y tient, sous les flaques). L'herbe fonce un peu, la terre nue et le sable un peu
// plus (ils boivent l'eau) ; l'eau douce ne change pas. Le voile des cases : une fois par carte ; une seule passe
// de dessin par image pour tout le sol, plus la lueur des chemins.
import { TW, TH, HS, worldOf } from '../terrain';
import { lueur } from '@/utils/vfx';

// Les sols d'herbe ; l'eau douce (rivière, pont, bassin) ne se mouille pas
const HERB = new Set(['g', 't', 'm', 'f']);
const WATER = new Set(['w', 'k', '~']);
// Les chemins, où l'eau luit
const PATH = 'p';
// La teinte du mouillé : un brun bleuté qui assombrit sans salir
const DARK = '34,42,58';
// Le reflet du ciel sur un chemin mouillé
const GLOSS = '226,236,255';
// Les crans du mouillé au bord de la brume
const STEPS = 4;

// Pour chaque case : 0 rien (mer, eau douce), 1 herbe, 2 terre ou sable, 3 chemin (Uint8Array, une case par octet)
const kinds = new WeakMap();
export function wetKinds(M) {
  let out = kinds.get(M);
  if (out) return out;
  const n = M.n;
  out = new Uint8Array(n * n);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!M.land(x, y)) continue;
      const g = M.ground(x, y);
      if (WATER.has(g)) continue;
      out[y * n + x] = g === PATH ? 3 : HERB.has(g) ? 1 : 2;
    }
  }
  kinds.set(M, out);
  return out;
}

// Combien le sol fonce selon le mouillé (0 à 1) et le sol : l'herbe un peu, la terre et les chemins davantage
export const darkOf = (wet, kind) => (kind === 1 ? 0.13 : kind === 3 ? 0.22 : 0.19) * Math.min(1, Math.max(0, wet));

// Le sol mouillé à l'écran (view : le rectangle du monde) ; wet : le mouillé (0 à 1) ; t : le temps (la lueur des
// chemins glisse doucement) ; shown(x, y) : de 0 (sous la brume) à 1 (découvert) ; par défaut, toute la terre
export function drawWetGround(ctx, M, view, wet, t, shown = () => 1) {
  if (wet < 0.04) return;
  const kind = wetKinds(M), n = M.n;
  const grid = (wx, wy) => [wy / TH + wx / TW, wy / TH - wx / TW];
  const pts = [grid(view.x, view.y), grid(view.x + view.w, view.y), grid(view.x, view.y + view.h + 6 * HS), grid(view.x + view.w, view.y + view.h + 6 * HS)];
  const x0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[0]))) - 1), x1 = Math.min(n - 1, Math.ceil(Math.max(...pts.map(p => p[0]))) + 1);
  const y0 = Math.max(0, Math.floor(Math.min(...pts.map(p => p[1]))) - 1), y1 = Math.min(n - 1, Math.ceil(Math.max(...pts.map(p => p[1]))) + 1);
  // une forme par sorte de sol et par cran de découvert (le losange du dessus de chaque case), remplie d'un coup ;
  // au bord de la brume, le mouillé s'efface par crans (pas de case sombre isolée)
  const shapes = [1, 2, 3].map(() => Array.from({ length: STEPS }, () => new Path2D()));
  const paths = [];
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const k = kind[y * n + x];
      if (!k) continue;
      const level = Math.round(Math.min(1, Math.max(0, shown(x, y))) * STEPS);
      if (!level) continue;
      const c = worldOf(x, y, M.surface(x, y));
      const p = shapes[k - 1][level - 1];
      // (à peine plus grand que la case : pas de jour entre deux losanges)
      p.moveTo(c.x, c.y - TH * 0.505);
      p.lineTo(c.x + TW * 0.505, c.y);
      p.lineTo(c.x, c.y + TH * 0.505);
      p.lineTo(c.x - TW * 0.505, c.y);
      p.closePath();
      if (k === 3 && level === STEPS) paths.push([x, y, c]);
    }
  }
  ctx.save();
  for (const k of [1, 2, 3]) {
    for (let l = 1; l <= STEPS; l++) {
      ctx.fillStyle = `rgba(${DARK},${(darkOf(wet, k) * l / STEPS).toFixed(3)})`;
      ctx.fill(shapes[k - 1][l - 1]);
    }
  }
  // les chemins luisent : un reflet du ciel qui glisse lentement de case en case
  if (paths.length) {
    const img = lueur(GLOSS);
    ctx.globalCompositeOperation = 'lighter';
    for (const [x, y, c] of paths) {
      const a = 0.16 * Math.min(1, wet) * (0.35 + 0.65 * Math.max(0, Math.sin(t * 0.5 + x * 0.9 - y * 0.6)));
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.drawImage(img, c.x - TW * 0.5, c.y - TH * 0.4, TW, TH * 0.8);
    }
  }
  ctx.restore();
}
