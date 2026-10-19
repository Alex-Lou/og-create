// Le papier du Livre : vélin et ivoire, grain (bruit), chemins réutilisés, coins arrondis, étoiles, le fond d'une page.

/* ---------- Papier ---------- */
// Parchemin : fond des pages, verso des feuilles qui tournent (moteur), ivoire des médaillons et vélin des cases éteintes
export const PAPER = '#F5EAD0';

export const PAPER_BACK = '#EADBBA';

const IVORY = '#FFF8E8';

const VELLUM = '#EEE1C3';

// Hasard reproductible : chaque page garde ses fibres et ses taches d'une peinture à l'autre
function seeded(seed) {
  let a = (seed * 2654435761) >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Chemins SVG des ornements et des sigles, préparés une fois
const paths = new Map();

const path2d = d => {
  if (!paths.has(d)) paths.set(d, new Path2D(d));
  return paths.get(d);
};

let noiseTile = null;

export function paperNoise() {
  if (noiseTile) return noiseTile;
  noiseTile = document.createElement('canvas');
  noiseTile.width = noiseTile.height = 128;
  const g = noiseTile.getContext('2d');
  const img = g.createImageData(128, 128);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 110 + Math.random() * 70;
    img.data[i] = v; img.data[i + 1] = v * 0.9; img.data[i + 2] = v * 0.76; img.data[i + 3] = Math.random() * 16;
  }
  g.putImageData(img, 0, 0);
  return noiseTile;
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function starPath(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rad = i % 2 ? r * 0.46 : r;
    ctx[i ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rad, cy + Math.sin(a) * rad);
  }
  ctx.closePath();
}

// Parchemin vieilli : grain, fibres, piqûres et parfois une auréole (propres à chaque page), bords brunis,
// et l'ombre du pli côté reliure (à gauche d'une page de droite, à droite d'une page de gauche)
function paperBase(ctx, w, h, u, side = 'right', seed = 0) {
  const rand = seeded(seed + 1);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, w, h);
  let g = ctx.createRadialGradient(w * 0.62, h * 0.22, 0, w * 0.62, h * 0.22, w * 1.05);
  g.addColorStop(0, 'rgba(255, 252, 240, .7)');
  g.addColorStop(1, 'rgba(255, 252, 240, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = ctx.createPattern(paperNoise(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  // Fibres
  ctx.lineCap = 'round';
  for (let k = 0; k < 34; k++) {
    const x = rand() * w, y = rand() * h, len = (4 + rand() * 14) * u, a = rand() * Math.PI;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + Math.cos(a) * len * 0.5 + (rand() - 0.5) * 2 * u, y + Math.sin(a) * len * 0.5, x + Math.cos(a) * len, y + Math.sin(a) * len);
    ctx.strokeStyle = `rgba(${rand() < 0.5 ? '140, 104, 60' : '255, 250, 235'}, ${0.07 + rand() * 0.08})`;
    ctx.lineWidth = (0.12 + rand() * 0.18) * u;
    ctx.stroke();
  }
  // Piqûres (rousseurs), plutôt près des bords
  for (let k = 0, n = 4 + Math.floor(rand() * 9); k < n; k++) {
    const edge = rand() < 0.5;
    const x = edge ? (rand() < 0.5 ? rand() * 12 : 88 + rand() * 12) * u : rand() * w;
    const y = edge ? rand() * h : (rand() < 0.5 ? rand() * 14 : 119 + rand() * 14) * u;
    ctx.beginPath();
    ctx.arc(x, y, (0.2 + rand() * 0.6) * u, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(150, 96, 44, ${0.08 + rand() * 0.12})`;
    ctx.fill();
  }
  // Une page sur trois garde l'auréole d'une goutte, très pâle
  if (rand() < 0.34) {
    const x = (18 + rand() * 64) * u, y = (20 + rand() * 94) * u, r = (5 + rand() * 7) * u;
    g = ctx.createRadialGradient(x, y, r * 0.7, x, y, r);
    g.addColorStop(0, 'rgba(150, 100, 50, 0)');
    g.addColorStop(0.85, 'rgba(150, 100, 50, .07)');
    g.addColorStop(1, 'rgba(150, 100, 50, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  // Bords brunis
  g = ctx.createRadialGradient(w / 2, h / 2, w * 0.42, w / 2, h / 2, w * 0.98);
  g.addColorStop(0, 'rgba(120, 78, 36, 0)');
  g.addColorStop(1, 'rgba(120, 78, 36, .2)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const outer = side === 'left' ? 0 : w;
  g = ctx.createLinearGradient(outer, 0, side === 'left' ? 3 * u : w - 3 * u, 0);
  g.addColorStop(0, 'rgba(110, 66, 28, .16)');
  g.addColorStop(1, 'rgba(110, 66, 28, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(side === 'left' ? 0 : w - 3 * u, 0, 3 * u, h);
  // Pli de la reliure
  const spine = side === 'left' ? w : 0;
  g = ctx.createLinearGradient(spine, 0, side === 'left' ? w - 11 * u : 11 * u, 0);
  g.addColorStop(0, 'rgba(74, 46, 26, .3)');
  g.addColorStop(0.35, 'rgba(74, 46, 26, .1)');
  g.addColorStop(1, 'rgba(74, 46, 26, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(side === 'left' ? w - 11 * u : 0, 0, 11 * u, h);
}

export { IVORY, VELLUM, seeded, path2d, rr, starPath, paperBase };
