// La lumière de l'éclair, venue de son côté. Les gros coups (un coup de foudre sur dix : eclairs.js, coupOf(...).gros),
// à la façon des vieux jeux de poche : l'île s'illumine d'un coup, revient une image, se rallume, puis redescend par
// marches nettes, sans fondu. Deux éclats par coup, au plus : sous les trois par seconde des règles d'accessibilité
// sur les flashs (et rien en mouvement réduit : view/draw/loop.js).
import { coupOf, cycleOf, LEADER, impactOf } from './eclairs';

const HAUT = 0.4;
// [fin (secondes après le coup de retour), niveau] : éclat, retour à la scène, éclat, deux marches
const MARCHES = [[0.05, HAUT], [0.1, 0], [0.16, HAUT], [0.26, 0.26], [0.36, 0.14]];
const FIN = MARCHES[MARCHES.length - 1][0];

// L'éclat à l'instant t : { k (niveau, par paliers ; 0 le temps du retour à la scène), x (côté de l'éclair, 0 gauche,
// 1 droite), cycle (le coup : eclairs.js, impactOf) }, ou null hors d'un gros coup
export function eclatAt(t, storm) {
  if (storm < 0.5) return null;
  const coup = coupOf(cycleOf(t));
  if (coup.lointain || !coup.gros) return null;
  const u = t - coup.start - LEADER;
  if (u < 0 || u >= FIN) return null;
  return { k: MARCHES.find(([fin]) => u < fin)[1], x: coup.x, cycle: cycleOf(t) };
}

// La lueur d'un coup ordinaire (eclairs.js : eclairAt) : la même lumière, plus douce, qui suit son flash
export const lueurOf = orage => {
  if (!orage || orage.flash <= 0.02) return null;
  return { k: 0.35 * Math.min(1, orage.flash), x: orage.x, cycle: orage.cycle, lointain: orage.lointain };
};

// La lumière de l'éclat, dans le monde (le tracé de l'éclair se dessine par-dessus) : une exposition (color-dodge) qui
// éclaircit chaque couleur à proportion, les sombres restent sombres et le contraste tient, plutôt qu'un voile blanc
// qui griserait tout. Forte autour du point où frappe la foudre, elle décroît au loin ; un rien froide. view : le
// rectangle du monde à l'écran
export function drawEclat(ctx, view, e) {
  if (!e || e.k <= 0) return;
  const p = impactOf(e.cycle, view, e.lointain);
  const cx = p.x, cy = p.y - view.h * 0.2;
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.hypot(view.w, view.h));
  const tone = f => `rgb(${Math.round(232 * e.k * f)},${Math.round(240 * e.k * f)},${Math.round(255 * e.k * f)})`;
  g.addColorStop(0, tone(1));
  g.addColorStop(0.55, tone(0.55));
  g.addColorStop(1, tone(0.25));
  ctx.save();
  ctx.globalCompositeOperation = 'color-dodge';
  ctx.fillStyle = g;
  ctx.fillRect(view.x, view.y, view.w, view.h);
  ctx.restore();
}
