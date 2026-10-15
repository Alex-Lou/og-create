// Pluie, dans le monde : chaque goutte a son point de chute sur l'île ou la mer (par carreaux autour de la vue :
// climates.js, tuilesOf), tombe de haut jusqu'à lui, penchée par le vent, et y éclabousse en couronne. Elle grossit
// avec le zoom et reste à sa place quand on glisse ; dessinée avant la lumière de l'heure, elle s'allume d'elle-même
// en traversant le halo d'une lanterne ou d'une fenêtre. La nuit, le sol mouillé reflète chaque lumière en une longue
// traînée qui ondule, posée au pied de la lumière (drawRefletsPluie). Tout se déduit du temps.
import { hash } from '../scene';
import { tuilesOf, TUILE } from '../tuiles';

const frac = v => v - Math.floor(v);
// Trois sortes de gouttes : fines et pâles, moyennes, longues et nettes (longueur, épaisseur, force)
const SORTES = [{ len: 10, w: 0.8, a: 0.3 }, { len: 16, w: 1.1, a: 0.45 }, { len: 26, w: 1.5, a: 0.6 }];
// Gouttes par carreau à pleine pluie, et la hauteur d'où elles tombent (unités du monde)
const PAR_CARREAU = 70;
const HAUT = 300;

// Les gouttes visibles à l'instant t : [{ x, y (le point de chute), z (l'altitude), sorte }], et les éclaboussures
// [{ x, y, age (0 à 1) }]. dens : la densité (la qualité de l'appareil, et le zoom : de loin, moins de gouttes)
export function gouttesOf(view, t, rain, dens = 1) {
  const gouttes = [], eclats = [];
  if (rain <= 0.02) return { gouttes, eclats };
  const n = Math.round(PAR_CARREAU * rain * dens);
  for (const T of tuilesOf(view, HAUT)) {
    for (let k = 0; k < n; k++) {
      const x = T.X + hash(T.n + k, 61) * TUILE, y = T.Y + hash(T.n + k, 62) * TUILE;
      const ph = frac(t / (0.5 + 0.25 * hash(T.n + k, 63)) + hash(T.n + k, 64));
      gouttes.push({ x, y, z: HAUT * (1 - ph), sorte: k % 3 });
      // (une goutte sur trois éclabousse en arrivant : on la voit juste après sa chute)
      if (k % 3 === 0 && ph < 0.14) eclats.push({ x, y, age: ph / 0.14 });
    }
  }
  return { gouttes, eclats };
}

// Les gouttes et leurs éclaboussures, dans la transformation du monde (avant la lumière de l'heure). night : 0 à 1 ;
// flash : l'éclair (0 à 1) ; opts : { slant (la pente du vent), dens (la densité) }
export function drawPluie(ctx, view, t, rain, night, flash, { slant = 0.24, dens = 1 } = {}) {
  if (rain <= 0.02) return;
  const { gouttes, eclats } = gouttesOf(view, t, rain, dens);
  const lit = flash > 0.05;
  // (de jour, des gouttes plus sombres que le ciel pour qu'on les voie ; la nuit, claires : la lumière de l'heure les
  // assombrit ensuite, sauf là où une lumière les prend)
  const base = lit ? '235,240,255' : night > 0.5 ? '226,236,255' : '96,116,148';
  ctx.save();
  ctx.lineCap = 'round';
  SORTES.forEach((sorte, i) => {
    ctx.strokeStyle = `rgba(${base},${Math.min(0.95, sorte.a * (lit ? 1.7 : 1) * (night > 0.5 ? 1.3 : 1)).toFixed(3)})`;
    ctx.lineWidth = sorte.w;
    ctx.beginPath();
    for (const g of gouttes) {
      if (g.sorte !== i) continue;
      const x = g.x + g.z * slant, y = g.y - g.z;
      ctx.moveTo(x, y);
      ctx.lineTo(x + sorte.len * slant, y - sorte.len);
    }
    ctx.stroke();
  });
  // Éclaboussures : une couronne qui s'ouvre au point de chute, deux gouttelettes qui retombent
  ctx.strokeStyle = `rgba(${base},${(lit ? 0.85 : 0.55).toFixed(3)})`;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  for (const e of eclats) {
    const r = 1.5 + e.age * 4.5;
    ctx.moveTo(e.x + r, e.y);
    ctx.ellipse(e.x, e.y, r, r * 0.38, 0, 0, Math.PI * 2);
    if (e.age < 0.6) {
      const up = Math.sin(e.age * Math.PI) * 4;
      ctx.moveTo(e.x - 1.5, e.y - 0.5); ctx.lineTo(e.x - 3 - e.age * 2, e.y - up);
      ctx.moveTo(e.x + 1.5, e.y - 0.5); ctx.lineTo(e.x + 3 + e.age * 2, e.y - up);
    }
  }
  ctx.stroke();
  ctx.restore();
}

// La nuit, sous la pluie : chaque lumière se reflète sur le sol mouillé en une traînée qui ondule, posée à son pied
// (lights : les sources de la carte de lumière, { x, gy, r, k, color, pool }), dans la transformation du monde, après
// la lumière de l'heure
export function drawRefletsPluie(ctx, view, t, rain, night, lights) {
  if (rain <= 0.02 || night <= 0.2 || !lights || !lights.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const [i, l] of lights.entries()) {
    if (l.pool === false || l.k < 0.05) continue;
    const y = l.gy;
    const len = l.r * 3, wid = Math.max(3, l.r * 0.42);
    if (l.x < view.x - wid || l.x > view.x + view.w + wid || y > view.y + view.h || y + len < view.y) continue;
    const sway = Math.sin(t * 2.3 + i) * wid * 0.25;
    const g = ctx.createLinearGradient(0, y, 0, y + len);
    g.addColorStop(0, `rgba(${l.color},${(0.62 * l.k * rain).toFixed(3)})`);
    g.addColorStop(0.45, `rgba(${l.color},${(0.22 * l.k * rain).toFixed(3)})`);
    g.addColorStop(1, `rgba(${l.color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(l.x + sway, y + len / 2, wid, len / 2, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
