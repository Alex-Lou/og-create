// Le rivage vivant : la lumière qui danse au fond des eaux peu profondes (caustiques), l'écume en dentelle qui monte
// sur la côte et se retire, le chemin de lumière du soleil ou de la lune sur la mer. Tout se déduit du temps.
import { TW, TH, SEA_Z, worldOf } from './terrain';
import { hash } from './scene';
import { moonOf } from './lumiere/ombres';

const frac = v => v - Math.floor(v);

// Caustiques : un réseau de lignes claires (là où deux cellules d'un pavage aléatoire se touchent), raccordé sur ses
// bords pour se répéter sans couture ; dessiné une fois
const CELL = 256;
let caustic = null;
function causticTexture() {
  if (caustic) return caustic;
  const c = document.createElement('canvas');
  c.width = c.height = CELL;
  const g = c.getContext('2d');
  const img = g.createImageData(CELL, CELL);
  const pts = Array.from({ length: 22 }, (_, i) => [hash(i, 1) * CELL, hash(i, 2) * CELL]);
  for (let y = 0; y < CELL; y++) {
    for (let x = 0; x < CELL; x++) {
      let d1 = 1e9, d2 = 1e9;
      for (const [px, py] of pts) {
        let dx = Math.abs(x - px), dy = Math.abs(y - py);
        dx = Math.min(dx, CELL - dx); dy = Math.min(dy, CELL - dy);
        const d = dx * dx + dy * dy;
        if (d < d1) { d2 = d1; d1 = d; } else if (d < d2) d2 = d;
      }
      const edge = Math.sqrt(d2) - Math.sqrt(d1);
      const a = Math.max(0, 1 - edge / 9) ** 2.2;
      const i = (y * CELL + x) * 4;
      img.data[i] = 235; img.data[i + 1] = 255; img.data[i + 2] = 250; img.data[i + 3] = Math.round(a * 255);
    }
  }
  g.putImageData(img, 0, 0);
  // (adoucies : un léger flou, comme la lumière vue à travers l'eau)
  const soft = document.createElement('canvas');
  soft.width = soft.height = CELL;
  const sg = soft.getContext('2d');
  sg.filter = 'blur(1.3px)';
  for (const dx of [-CELL, 0, CELL]) for (const dy of [-CELL, 0, CELL]) sg.drawImage(c, dx, dy);
  caustic = soft;
  return soft;
}

// Dans les eaux les plus proches de la terre : deux nappes de caustiques qui glissent en sens contraire, plus nettes au
// soleil, presque éteintes la nuit, de moins en moins vers le large
const FADE = [1, 0.55, 0.22];
export function drawCaustics(ctx, shallow, view, t, light) {
  if (light <= 0.02) return;
  shallow.forEach((cells, level) => {
    const path = new Path2D();
    let any = false;
    for (const cell of cells) {
      const c = worldOf(cell.x, cell.y, SEA_Z);
      if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TH || c.y > view.y + view.h + TH) continue;
      path.moveTo(c.x, c.y - TH / 2); path.lineTo(c.x + TW / 2 + 0.5, c.y); path.lineTo(c.x, c.y + TH / 2 + 0.5); path.lineTo(c.x - TW / 2 - 0.5, c.y);
      any = true;
    }
    if (any) fillCaustics(ctx, path, t, light * (FADE[level] || 0));
  });
}
// Les nappes de caustiques posées dans un tracé (des cases d'eau), en remplissage : le motif glisse par sa propre
// transformation (aucune découpe à calculer) ; layers : 2 nappes, ou 1 (plus légère)
const LAYERS = [[0, 9, 4, 0.16, 1.3], [1, -7, 6, 0.1, 1.9]];
export function fillCaustics(ctx, path, t, k, layers = 2) {
  if (k <= 0.005) return;
  const pattern = ctx.createPattern(causticTexture(), 'repeat');
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = pattern;
  for (const [i, sx, sy, a, z] of LAYERS.slice(0, layers)) {
    pattern.setTransform(new DOMMatrix()
      .translate(frac(t * sx / CELL + i * 0.37) * CELL, frac(t * sy / CELL + i * 0.61) * CELL)
      .scale(z, z * 0.5));
    ctx.globalAlpha = Math.min(1, a * k * (layers === 1 ? 1.4 : 1));
    ctx.fill(path);
  }
  ctx.restore();
}

// Écume en dentelle : sur chaque bord de côte devant l'île, une rangée de bulles qui suit la vague (elle monte sur le
// sable, s'étale, puis se retire en s'effilochant). edges : bords { x0, y0, x1, y1, nx, ny (vers le large), w : moment
// de la vague, 0 au large → 1 sur la côte } (sea.js : shoreEdges)
export function drawLace(ctx, edges, t) {
  ctx.fillStyle = 'rgba(255, 255, 255, .9)';
  ctx.beginPath();
  for (const [i, e] of edges.entries()) {
    const w = e.w;
    const reach = 1.5 + Math.sin(Math.PI * w) * 7;
    const thin = w > 0.7 ? 1 - (w - 0.7) / 0.3 : 0.6 + 0.4 * w / 0.7;
    for (let k = 0; k < 9; k++) {
      const u = (k + hash(i, k)) / 9;
      const off = reach * (0.5 + hash(k, i) * 0.7) + Math.sin(t * 2 + k + i) * 0.6;
      const r = (1.1 + hash(i + 3, k) * 1.6) * thin;
      if (r < 0.3) continue;
      const x = e.x0 + (e.x1 - e.x0) * u + e.nx * off, y = e.y0 + (e.y1 - e.y0) * u + e.ny * off;
      ctx.moveTo(x + r, y);
      ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2);
    }
  }
  ctx.fill();
}

// Chemin de lumière sur la mer : sa force (0 à 1), sa largeur et sa place à l'écran (fractions de la largeur), sa
// teinte. Le soleil : large à midi, une traînée étroite et dorée quand il est bas ; la lune la nuit, argentée, selon
// sa phase ; rien sous un ciel couvert
export function glitterOf(phase, date) {
  const { sun, weather, night } = phase;
  const clear = 1 - weather.cover;
  if (sun.up > 0.02) {
    return { strength: clear * Math.min(1, sun.up * 3) * 0.9, spread: 0.08 + 0.3 * sun.up, at: 0.15 + 0.7 * sun.progress, color: sun.up < 0.35 ? '255,214,150' : '255,250,235' };
  }
  if (night > 0.5) return { strength: clear * moonOf(date).light * (night - 0.5) * 2 * 0.7, spread: 0.09, at: 0.62, color: '214,226,255' };
  return { strength: 0, spread: 0, at: 0, color: '' };
}
// Le chemin de l'éclair sur la mer, le temps de son flash (lumiere/eclairs.js : eclairAt) : froid, de son côté de
// l'écran ; null sans flash
export function glitterEclair(orage) {
  if (!orage || orage.flash < 0.08) return null;
  return { strength: Math.min(1, orage.flash) * 0.95, spread: 0.12, at: orage.x, color: '226,234,255' };
}
// Les éclats de ce chemin, posés sur la mer (accrochés au monde, comme les reflets de sea.js : ils suivent la caméra
// quand on fait glisser ou zoomer l'île), qui scintillent chacun à son rythme. Le chemin se place sur la largeur de
// l'île (bounds, en unités du monde), celui de l'éclair sur l'écran (view) ; les éclats gardent leur taille à l'écran
// (s : échelle de la caméra) ; la terre, dessinée par-dessus, les cache. Seules les colonnes proches du chemin sont
// parcourues. La teinte se pose une fois, l'opacité de chaque éclat par globalAlpha (arrondie au millième, comme sa
// couleur l'était), l'épaisseur une fois par rangée : des centaines d'éclats par image, chacun relisait une couleur
export function drawGlitter(ctx, view, t, phase, date, s, bounds, orage = null) {
  const e = glitterEclair(orage);
  const g = e || glitterOf(phase, date);
  if (g.strength < 0.03) return;
  const { strength, color } = g;
  const spread = e ? view.w * e.spread : bounds.w * g.spread, x0 = e ? view.x + view.w * e.at : bounds.x + bounds.w * g.at;
  // (la grille des éclats : environ trente colonnes à l'écran, par paliers pour qu'ils ne sautent pas à chaque zoom)
  let L = 8;
  while (view.w / L > 32) L *= 2;
  const i0 = Math.max(Math.floor(view.x / L) - 1, Math.floor((x0 - spread * 2.2) / L));
  const i1 = Math.min(Math.ceil((view.x + view.w) / L) + 1, Math.ceil((x0 + spread * 2.2) / L));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.strokeStyle = `rgb(${color})`;
  const base = ctx.globalAlpha;
  for (let j = Math.floor(view.y / L) - 1; j <= Math.ceil((view.y + view.h) / L) + 1; j++) {
    // (plus loin vers le haut de l'île, des éclats plus courts : un peu de profondeur)
    const depth = 0.4 + 0.6 * Math.min(1, Math.max(0, (j * L - bounds.y) / bounds.h));
    ctx.lineWidth = (1.3 + depth) / s;
    for (let i = i0; i <= i1; i++) {
      const hs = hash(i * 7.1, j * 3.3);
      const x = (i + hs) * L;
      const d = (x - x0) / (spread * depth);
      const p = Math.exp(-d * d) * strength;
      if (hs > p * 1.6) continue;
      const tw = Math.sin(t * (2.5 + hs * 4) + hs * 40);
      if (tw < 0.2) continue;
      const a = p * (tw - 0.2) * 1.1;
      const len = (3 + hs * 7 * depth) / s, y = (j + hash(j, i)) * L;
      ctx.globalAlpha = base * (Math.round(Math.min(0.95, a) * 1000) / 1000);
      ctx.beginPath();
      ctx.moveTo(x - len / 2, y);
      ctx.lineTo(x + len / 2, y);
      ctx.stroke();
    }
  }
  ctx.restore();
}
