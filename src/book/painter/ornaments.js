// Les ornements d'une page : fleurons, sceaux des chapitres, cadre, folio, filets, en-tête, médaille, vignette.
import { roman } from '@/utils/roman';
import { SIGILS, ORNAMENTS, GOLD } from '../grimoire';
import { IVORY, VELLUM, path2d, rr, starPath } from './paper';
import { FELL, CAPS, NOTE, setFont, fitText, alpha } from './type';

// Un ornement doré (chemin d'ORNAMENTS ou d'un sigle) posé en (x, y) u, tourné de rot, à l'échelle k
function ornament(ctx, u, d, x, y, rot, k, fill, stroke) {
  ctx.save();
  ctx.translate(x * u, y * u);
  ctx.rotate(rot);
  ctx.scale(k * u, k * u);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(path2d(d));
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.22;
    ctx.stroke(path2d(d));
  }
  ctx.restore();
}

// Sigle de planète d'un chapitre, tracé en (cx, cy) u sur size u
function sigil(ctx, u, id, cx, cy, size, color, width = 2) {
  const k = size / 24;
  ctx.save();
  ctx.translate((cx - size / 2) * u, (cy - size / 2) * u);
  ctx.scale(k * u, k * u);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke(path2d(SIGILS[id].d));
  ctx.restore();
}

// Cadre enluminé : filet d'encre, filet d'or, fleurons aux coins et losanges au milieu des bords
function frame(ctx, u, ink) {
  const color = ink || '#4A3426';
  rr(ctx, 7 * u, 3.4 * u, 89.5 * u, 126.5 * u, 3 * u);
  ctx.strokeStyle = alpha(color, 0.32);
  ctx.lineWidth = 0.5 * u;
  ctx.stroke();
  rr(ctx, 8.3 * u, 4.7 * u, 86.9 * u, 123.9 * u, 2.2 * u);
  ctx.strokeStyle = alpha(GOLD.base, 0.6);
  ctx.lineWidth = 0.28 * u;
  ctx.stroke();
  const gold = alpha(GOLD.base, 0.92), edge = alpha(GOLD.edge, 0.55);
  ornament(ctx, u, ORNAMENTS.corner, 9.2, 5.6, 0, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.corner, 94.3, 5.6, Math.PI / 2, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.corner, 94.3, 127.7, Math.PI, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.corner, 9.2, 127.7, -Math.PI / 2, 0.62, gold, edge);
  ornament(ctx, u, ORNAMENTS.diamond, 51.75, 3.4, 0, 1, gold, edge);
  ornament(ctx, u, ORNAMENTS.diamond, 51.75, 129.9, 0, 1, gold, edge);
}

function folio(ctx, u, i) {
  setFont(ctx, u, 4.4, FELL, true);
  ctx.fillStyle = NOTE;
  ctx.textAlign = 'center';
  // Folio en chiffres romains tant qu'ils restent lisibles, puis en chiffres ; un point doré de chaque côté
  const text = i <= 39 ? roman(i).toLowerCase() : String(i);
  ctx.fillText(text, 52 * u, 127.4 * u);
  const half = ctx.measureText(text).width / (2 * u) + 2.6;
  ctx.fillStyle = alpha(GOLD.base, 0.8);
  [-half, half].forEach(dx => {
    ctx.beginPath();
    ctx.arc((52 + dx) * u, 126.1 * u, 0.6 * u, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Filet d'or à la hauteur y, de a à b (u), coupé d'un losange au milieu si diamond
function rule(ctx, u, y, a, b, diamond = false) {
  const mid = (a + b) / 2, gap = diamond ? 3.4 : 0;
  ctx.strokeStyle = alpha(GOLD.base, 0.7);
  ctx.lineWidth = 0.3 * u;
  [[a, mid - gap], [mid + gap, b]].forEach(([x0, x1]) => {
    ctx.beginPath();
    ctx.moveTo(x0 * u, y * u);
    ctx.lineTo(x1 * u, y * u);
    ctx.stroke();
  });
  if (diamond) ornament(ctx, u, ORNAMENTS.diamond, mid, y, 0, 1, alpha(GOLD.base, 0.92), alpha(GOLD.edge, 0.55));
}

// Titre courant : le chapitre en petites capitales sur un filet d'or ; à droite, l'étoile de la page ou un repère
function header(ctx, u, chapter, style, stars, mark = null) {
  ctx.fillStyle = style.ink;
  ctx.textAlign = 'left';
  ctx.fillText(fitText(ctx, u, `${chapter.id} · ${chapter.name}`, mark ? 54 : 70, 4.8, 3.8, CAPS), 13 * u, 11.4 * u);
  if (mark) {
    setFont(ctx, u, 4.4, CAPS);
    ctx.fillStyle = NOTE;
    ctx.textAlign = 'right';
    ctx.fillText(mark, 91 * u, 11.4 * u);
  } else if (stars !== null) {
    starPath(ctx, 89.6 * u, 9.8 * u, 2.5 * u);
    ctx.fillStyle = stars ? '#E3A93B' : 'rgba(179, 160, 138, .6)';
    ctx.fill();
  }
  ctx.strokeStyle = alpha(GOLD.base, 0.5);
  ctx.lineWidth = 0.25 * u;
  ctx.beginPath();
  ctx.moveTo(13 * u, 14.2 * u);
  ctx.lineTo(91 * u, 14.2 * u);
  ctx.stroke();
}

// Médaillon des pages d'élément : centre et rayon (u)
const MEDAL = { x: 52, y: 35, r: 15 };

function vignette(ctx, u, style, mode) {
  const { x: vx, y: vy, r: vr } = MEDAL;
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, (vr + 1.6) * u, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(74, 52, 38, .2)';
  ctx.shadowBlur = 3.4 * u;
  ctx.shadowOffsetY = 1.4 * u;
  ctx.fillStyle = IVORY;
  ctx.fill();
  ctx.restore();
  // Médaillon serti d'or : filet plein et couronne de points
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, (vr + 2.5) * u, 0, Math.PI * 2);
  ctx.strokeStyle = alpha(GOLD.base, 0.75);
  ctx.lineWidth = 0.35 * u;
  ctx.stroke();
  ctx.fillStyle = alpha(GOLD.base, 0.7);
  for (let k = 0; k < 32; k++) {
    const a = (k / 32) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc((vx + Math.cos(a) * (vr + 3.5)) * u, (vy + Math.sin(a) * (vr + 3.5)) * u, 0.3 * u, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.save();
  ctx.beginPath();
  ctx.arc(vx * u, vy * u, vr * u, 0, Math.PI * 2);
  ctx.clip();
  if (mode === 'far') {
    ctx.fillStyle = VELLUM;
    ctx.fillRect((vx - vr) * u, (vy - vr) * u, vr * 2 * u, vr * 2 * u);
    ctx.strokeStyle = 'rgba(189, 170, 148, .45)';
    ctx.lineWidth = 1.2 * u;
    for (let k = -vr * 2; k < vr * 2; k += 4) {
      ctx.beginPath();
      ctx.moveTo((vx + k) * u, (vy - vr) * u);
      ctx.lineTo((vx + k + vr * 2) * u, (vy + vr) * u);
      ctx.stroke();
    }
  } else {
    const g = ctx.createRadialGradient((vx - 5) * u, (vy - 6.5) * u, 0, vx * u, vy * u, vr * u);
    g.addColorStop(0, '#FFFFFF');
    g.addColorStop(1, style.color);
    ctx.fillStyle = g;
    ctx.fillRect((vx - vr) * u, (vy - vr) * u, vr * 2 * u, vr * 2 * u);
  }
  ctx.restore();
  return { id: 'vignette', x: vx - vr, y: vy - vr, w: vr * 2, h: vr * 2 };
}

export { sigil, frame, folio, rule, header, MEDAL, vignette };
