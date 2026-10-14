// Les étoiles filantes : par nuit claire, de temps en temps, une étoile file dans le ciel au-dessus de l'île (à
// l'écran : c'est le ciel, il ne suit pas la caméra). Sa tête s'allume vite, flambe un instant avant de mourir ; sa
// traînée s'effile derrière elle puis s'effiloche en paillettes. Certaines nuits, une pluie d'étoiles : plus
// nombreuses, toutes venues du même point du ciel (le radiant), comme les vraies. Touchée du doigt, une étoile éclate en
// paillettes colorées qui retombent (view/gestures.js). Tout se déduit du temps, sauf ce toucher.
import { hash } from '../scene';
import { lueur, etoile } from '@/utils/vfx';

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

const CYCLE = 7; // secondes : au plus une étoile par cycle
const QUEUE = 0.6; // la traînée s'effiloche ce temps après la mort de la tête (s)
export const FILANTE_TOUCHE = 34; // rayon de toucher de la tête (px de l'écran)
const PAILLETTES_MS = 1400;
const COULEURS = ['255,236,170', '190,226,255', '255,190,230', '200,255,220', '255,214,150'];

// Une pluie d'étoiles cette nuit ? (une nuit sur huit environ), et son radiant (fractions de l'écran)
export function pluieOf(date) {
  const jour = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 864e5);
  return hash(jour, 41) < 0.12 ? { x: 0.15 + hash(jour, 43) * 0.7, y: -0.1 } : null;
}

// La force du ciel étoilé (0 à 1) : la nuit franche, sans nuages ni pluie
export const cielOf = phase => smooth((phase.night - 0.6) / 0.25) * (1 - phase.weather.cover) ** 2 * (1 - phase.weather.rain);

// L'étoile filante du cycle en cours à l'instant t, ou null : { cycle, k (0 à 1 : la vie de la tête ; au-delà, la
// traînée qui s'effiloche), x0, y0, dx, dy (départ et chemin, fractions de l'écran), vie (s) }. pluie : pluieOf
export function filanteAt(t, pluie = null) {
  const cycle = Math.floor(t / CYCLE);
  if (hash(cycle, 1) > (pluie ? 0.85 : 0.22)) return null;
  const vie = 0.8 + hash(cycle, 3) * 0.6;
  const start = cycle * CYCLE + hash(cycle, 5) * (CYCLE - vie - QUEUE);
  const u = t - start;
  if (u < 0 || u > vie + QUEUE) return null;
  const x0 = 0.1 + hash(cycle, 7) * 0.8, y0 = 0.05 + hash(cycle, 9) * 0.4;
  // (un jour de pluie d'étoiles, elles fuient toutes le radiant ; sinon, en biais vers le bas, d'un côté ou de l'autre)
  let ax, ay;
  if (pluie) { ax = x0 - pluie.x; ay = y0 - pluie.y; }
  else { ax = (hash(cycle, 11) < 0.5 ? -1 : 1) * (1 + hash(cycle, 13)); ay = 0.45 + hash(cycle, 15) * 0.5; }
  const n = Math.hypot(ax, ay), len = 0.3 + hash(cycle, 17) * 0.3;
  return { cycle, k: u / vie, x0, y0, dx: (ax / n) * len, dy: (ay / n) * len, vie };
}

// Où est sa tête (px de l'écran), à la fraction k de sa vie (elle ralentit un peu en finissant)
export function teteOf(f, w, h, k = f.k) {
  const p = 1 - (1 - Math.min(1, k)) ** 1.4;
  return { x: (f.x0 + f.dx * p) * w, y: (f.y0 + f.dy * p) * h };
}
// Son éclat : elle s'allume vite, brille, flambe juste avant de mourir
export const eclatOf = k => (k > 1 ? 0 : smooth(k / 0.12) * (0.75 + 0.25 * Math.sin(k * 9)) * (1 + 0.9 * Math.exp(-(((k - 0.86) / 0.06) ** 2))));

// L'étoile filante, à l'écran : la traînée (un fil effilé, plus pâle vers l'arrière), quelques paillettes qui s'en
// détachent, la tête et sa lueur. force : cielOf
export function drawFilante(ctx, w, h, f, force) {
  if (!f || force < 0.02) return;
  const tete = teteOf(f, w, h);
  const fin = f.k > 1 ? 1 - (f.k - 1) * (f.vie / QUEUE) : 1; // la traînée qui s'efface après la mort de la tête
  if (fin <= 0) return;
  const queue = teteOf(f, w, h, Math.max(0, Math.min(1, f.k) - 0.35));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  // la traînée, en trois passes de plus en plus fines (lueur bleutée, puis cœur)
  const g = ctx.createLinearGradient(tete.x, tete.y, queue.x, queue.y);
  g.addColorStop(0, `rgba(235,244,255,${(0.9 * force * fin).toFixed(3)})`);
  g.addColorStop(0.4, `rgba(170,205,255,${(0.35 * force * fin).toFixed(3)})`);
  g.addColorStop(1, 'rgba(170,205,255,0)');
  ctx.strokeStyle = g;
  for (const [lw, a] of [[5, 0.25], [2.4, 0.6], [1.1, 1]]) {
    ctx.globalAlpha = a;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(queue.x, queue.y);
    ctx.lineTo(tete.x, tete.y);
    ctx.stroke();
  }
  // les paillettes qui se détachent de la traînée et tombent doucement en s'éteignant
  const grain = etoile('235,244,255');
  for (let i = 0; i < 7; i++) {
    const at = hash(f.cycle, 30 + i) * Math.min(1, f.k);
    const age = f.k - at;
    if (age < 0.05) continue;
    const p = teteOf(f, w, h, at);
    const a = Math.max(0, 1 - age * 1.6) * fin * force;
    if (a < 0.03) continue;
    const s = 3 + 3 * hash(f.cycle, 40 + i);
    ctx.globalAlpha = a * (0.6 + 0.4 * Math.sin(age * 30 + i));
    ctx.drawImage(grain, p.x - s / 2, p.y + age * 14 - s / 2, s, s);
  }
  // la tête et sa lueur
  const e = eclatOf(f.k) * force;
  if (e > 0.02) {
    const r = 14 + 10 * e;
    ctx.globalAlpha = Math.min(1, 0.7 * e);
    ctx.drawImage(lueur('210,228,255'), tete.x - r, tete.y - r, r * 2, r * 2);
    const s = 7 + 6 * e;
    ctx.globalAlpha = Math.min(1, e);
    ctx.drawImage(etoile('255,255,250'), tete.x - s / 2, tete.y - s / 2, s, s);
  }
  ctx.restore();
}

// L'étoile touchée du doigt : vingt paillettes colorées jaillissent de sa tête, puis retombent en scintillant.
// pop : { x, y, at } (px de l'écran, performance.now()) ; false une fois finie
export function drawPaillettes(ctx, pop, now) {
  const ms = now - pop.at;
  if (ms > PAILLETTES_MS) return false;
  const k = ms / PAILLETTES_MS, u = ms / 1000;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 20; i++) {
    const a = hash(i, 51) * Math.PI * 2;
    const v = 60 + hash(i, 53) * 90;
    const x = pop.x + Math.cos(a) * v * u;
    const y = pop.y + Math.sin(a) * v * u * 0.8 + 120 * u * u;
    const s = (8 + 6 * hash(i, 55)) * (1 - k * 0.5);
    ctx.globalAlpha = (1 - k) * (0.65 + 0.35 * Math.sin(u * 24 + i));
    ctx.drawImage(etoile(COULEURS[i % COULEURS.length]), x - s / 2, y - s / 2, s, s);
  }
  ctx.restore();
  return true;
}
