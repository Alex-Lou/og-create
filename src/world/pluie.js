// Pluie : trois couches de gouttes en parallaxe (lointaine fine et lente, moyenne, proche longue et rapide), penchées
// par le vent ; des éclaboussures en couronne qui naissent au sol ; la nuit, le sol mouillé reflète chaque lumière en
// une longue traînée qui ondule, et les gouttes qui traversent le halo d'une lanterne ou d'une fenêtre s'y allument.
// Tout se déduit du temps (même pluie pour un même instant), à l'écran.
import { hash } from './scene';

const COUCHES = [
  { n: 90, len: 7, speed: 0.55, a: 0.26, w: 0.8, seed: 1 },
  { n: 110, len: 12, speed: 0.85, a: 0.4, w: 1.1, seed: 2 },
  { n: 34, len: 22, speed: 1.3, a: 0.55, w: 1.5, seed: 3 }
];
const PENTE = 0.24; // le vent penche les gouttes

// rain : 0..1 ; night : 0..1 ; flash : l'éclair (0..1) ; lights : sources à l'écran, au pied de chacune (là où elle
// touche le sol) [{ x, y, r, k, color }]
export function drawPluie(ctx, w, h, t, rain, night, flash, lights) {
  if (rain <= 0.02) return;
  ctx.save();
  const lit = flash > 0.05;
  // (de jour, des gouttes plus sombres que le ciel blanc pour qu'on les voie ; la nuit, claires)
  const base = lit ? '235,240,255' : night > 0.5 ? '205,218,242' : '96,116,148';
  // 1. Gouttes, de la plus lointaine à la plus proche (un tracé par couche)
  ctx.lineCap = 'round';
  for (const c of COUCHES) {
    const count = Math.round(c.n * rain);
    ctx.strokeStyle = `rgba(${base},${Math.min(0.95, c.a * (lit ? 1.7 : 1)).toFixed(3)})`;
    ctx.lineWidth = c.w;
    ctx.beginPath();
    for (let k = 0; k < count; k++) {
      const sp = c.speed * (0.85 + hash(k, c.seed * 7) * 0.3);
      const y = (((hash(k, c.seed * 3) + t * sp) % 1) * (h + 60)) - 30;
      const x = ((hash(k, c.seed * 5) * (w + 80) + y * PENTE) % (w + 80)) - 40;
      const len = c.len * (0.8 + hash(k, c.seed * 11) * 0.4);
      ctx.moveTo(x, y);
      ctx.lineTo(x - len * PENTE, y - len);
    }
    ctx.stroke();
  }
  // 2. Éclaboussures : une couronne qui jaillit et s'efface (0,22 s), en des points qui changent à chaque cycle
  const splash = Math.round(46 * rain);
  ctx.strokeStyle = `rgba(${base},${(lit ? 0.85 : 0.55).toFixed(3)})`;
  ctx.lineWidth = 0.9;
  ctx.beginPath();
  for (let k = 0; k < splash; k++) {
    const period = 0.55 + hash(k, 91) * 0.35;
    const cyc = Math.floor((t + hash(k, 92) * period) / period);
    const age = ((t + hash(k, 92) * period) % period) / 0.22;
    if (age > 1) continue;
    const x = hash(k * 31 + cyc, 93) * w;
    const y = h * 0.18 + hash(k * 17 + cyc, 94) * h * 0.8;
    const r = 1.5 + age * 4.5;
    // anneau qui s'ouvre, deux gouttelettes qui retombent
    ctx.moveTo(x + r, y);
    ctx.ellipse(x, y, r, r * 0.38, 0, 0, Math.PI * 2);
    if (age < 0.6) {
      const up = Math.sin(age * Math.PI) * 4;
      ctx.moveTo(x - 1.5, y - 0.5); ctx.lineTo(x - 3 - age * 2, y - up);
      ctx.moveTo(x + 1.5, y - 0.5); ctx.lineTo(x + 3 + age * 2, y - up);
    }
  }
  ctx.stroke();
  // 3. Sol mouillé : chaque lumière s'y reflète en une traînée verticale qui ondule ; et les gouttes s'allument dans
  // son halo
  if (lights && lights.length && night > 0.2) {
    ctx.globalCompositeOperation = 'lighter';
    for (const [i, l] of lights.entries()) {
      if (l.k < 0.05 || l.x < -40 || l.x > w + 40 || l.y < -40 || l.y > h + 80) continue;
      const len = l.r * 3, wid = Math.max(3, l.r * 0.42);
      const sway = Math.sin(t * 2.3 + i) * wid * 0.25;
      const g = ctx.createLinearGradient(0, l.y, 0, l.y + len);
      g.addColorStop(0, `rgba(${l.color},${(0.62 * l.k * rain).toFixed(3)})`);
      g.addColorStop(0.45, `rgba(${l.color},${(0.22 * l.k * rain).toFixed(3)})`);
      g.addColorStop(1, `rgba(${l.color},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(l.x + sway, l.y + len / 2, wid, len / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // gouttes allumées dans le halo
      ctx.strokeStyle = `rgba(${l.color},${(0.75 * l.k).toFixed(3)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const yy = l.y - l.r * 2.2 + (((hash(k, i * 7 + 1) + t * 0.9) % 1) * l.r * 2);
        const xx = l.x + (hash(k, i * 7 + 2) - 0.5) * l.r * 1.4 + (yy - l.y) * PENTE;
        ctx.moveTo(xx, yy);
        ctx.lineTo(xx - 9 * PENTE, yy - 9);
      }
      ctx.stroke();
    }
  }
  ctx.restore();
}
