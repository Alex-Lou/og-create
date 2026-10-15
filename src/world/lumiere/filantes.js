// Les étoiles filantes : par nuit claire, de temps en temps, une étoile file tout en haut du ciel, presque à
// l'horizontale. Elle est posée dans le monde : à son départ, le ciel au-dessus de la vue est figé (cielDe), son chemin
// s'y inscrit et ne suit plus la caméra. Elle passe si haut que, l'île vue d'en haut, on la voit surtout dans l'eau : son reflet file sur la mer, renversé, en ondulant (dessiné avec la mer, la terre le
// cache), plus vif que l'étoile elle-même, à peine visible au bord du ciel. Sa tête s'allume vite, flambe un instant
// avant de mourir ; sa traînée s'effile derrière elle puis s'effiloche en paillettes. Certaines nuits, une pluie
// d'étoiles : plus nombreuses, toutes venues du même point du ciel (le radiant), comme les vraies. Touchée du doigt
// (l'étoile ou son reflet), elle éclate en paillettes colorées qui retombent (view/gestures.js). Tout se déduit du
// temps, sauf ce toucher.
import { hash } from '../scene';
import { lueur, etoile } from '@/utils/vfx';

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

const CYCLE = 7; // secondes : au plus une étoile par cycle
const QUEUE = 0.6; // la traînée s'effiloche ce temps après la mort de la tête (s)
export const FILANTE_TOUCHE = 34; // rayon de toucher de la tête (px de l'écran : le doigt)
const PAILLETTES_MS = 1400;
const COULEURS = ['255,236,170', '190,226,255', '255,190,230', '200,255,220', '255,214,150'];

// Une pluie d'étoiles cette nuit ? (une nuit sur huit environ), et son radiant (fractions de l'écran) : au-delà d'un
// bord, à hauteur du ciel, pour qu'elles filent à l'horizontale
export function pluieOf(date) {
  const jour = Math.floor(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 864e5);
  return hash(jour, 41) < 0.12 ? { x: hash(jour, 43) < 0.5 ? -0.3 : 1.3, y: 0.02 + hash(jour, 45) * 0.06 } : null;
}

// La force du ciel étoilé (0 à 1) : la nuit franche, sans nuages ni pluie
export const cielOf = phase => smooth((phase.night - 0.6) / 0.25) * (1 - phase.weather.cover) ** 2 * (1 - phase.weather.rain);

// L'étoile filante du cycle en cours à l'instant t, ou null : { cycle, k (0 à 1 : la vie de la tête ; au-delà, la
// traînée qui s'effiloche), x0, y0, dx, dy (départ et chemin, fractions de l'écran), ry (la hauteur de son reflet sur
// l'écran), vie (s) }. pluie : pluieOf
export function filanteAt(t, pluie = null) {
  const cycle = Math.floor(t / CYCLE);
  if (hash(cycle, 1) > (pluie ? 0.85 : 0.22)) return null;
  const vie = 0.8 + hash(cycle, 3) * 0.6;
  const start = cycle * CYCLE + hash(cycle, 5) * (CYCLE - vie - QUEUE);
  const u = t - start;
  if (u < 0 || u > vie + QUEUE) return null;
  const x0 = 0.05 + hash(cycle, 7) * 0.9, y0 = 0.02 + hash(cycle, 9) * 0.1;
  // (un jour de pluie d'étoiles, elles fuient toutes le radiant ; sinon, presque à l'horizontale, d'un côté ou de
  // l'autre, en descendant à peine)
  let ax, ay;
  if (pluie) { ax = x0 - pluie.x; ay = y0 - pluie.y; }
  else { ax = hash(cycle, 11) < 0.5 ? -1 : 1; ay = 0.06 + hash(cycle, 15) * 0.14; }
  const n = Math.hypot(ax, ay), len = 0.35 + hash(cycle, 17) * 0.3;
  return { cycle, k: u / vie, x0, y0, dx: (ax / n) * len, dy: (ay / n) * len, ry: 0.32 + hash(cycle, 19) * 0.5, vie };
}

// Son reflet sur l'eau : le même chemin, renversé, plus bas dans son ciel
export const refletOf = f => (f ? { ...f, y0: f.ry, dy: -f.dy * 0.7, reflet: true } : null);

// Le ciel d'une étoile, dans le monde : le rectangle de la vue (view) au moment où elle part, figé pour toute sa vie
// (elle ne suit pas la caméra) ; { x, y, w, h }
const ciels = new Map();
export function cielDe(cycle, view) {
  let c = ciels.get(cycle);
  if (!c) {
    c = { x: view.x, y: view.y, w: view.w, h: view.h };
    ciels.set(cycle, c);
    if (ciels.size > 6) ciels.delete(ciels.keys().next().value);
  }
  return c;
}

// Où est sa tête dans le monde (ciel : cielDe), à la fraction k de sa vie (elle ralentit un peu en finissant)
export function teteOf(f, ciel, k = f.k) {
  const p = 1 - (1 - Math.min(1, k)) ** 1.4;
  return { x: ciel.x + (f.x0 + f.dx * p) * ciel.w, y: ciel.y + (f.y0 + f.dy * p) * ciel.h };
}
// Son éclat : elle s'allume vite, brille, flambe juste avant de mourir
export const eclatOf = k => (k > 1 ? 0 : smooth(k / 0.12) * (0.75 + 0.25 * Math.sin(k * 9)) * (1 + 0.9 * Math.exp(-(((k - 0.86) / 0.06) ** 2))));

// Un point de l'étoile à la fraction k de sa vie (dans le monde) ; son reflet ondule sur l'eau
function pointOf(f, ciel, k, t) {
  const p = teteOf(f, ciel, k);
  if (f.reflet) p.y += Math.sin(t * 2.2 + p.x * 0.07) * 1.8 + Math.sin(t * 3.1 - p.x * 0.13) * 0.8;
  return p;
}

// L'étoile filante (ou son reflet : refletOf), dans la transformation du monde (ciel : cielDe) : la traînée (un fil effilé, plus pâle vers l'arrière),
// quelques paillettes qui s'en détachent, la tête et sa lueur. force : sa force (cielOf, atténuée au ciel) ; t : le
// temps de la scène (l'ondulation du reflet)
export function drawFilante(ctx, ciel, f, force, t = 0) {
  if (!f || force < 0.02) return;
  const fin = f.k > 1 ? 1 - (f.k - 1) * (f.vie / QUEUE) : 1; // la traînée qui s'efface après la mort de la tête
  if (fin <= 0) return;
  const kt = Math.min(1, f.k), kq = Math.max(0, kt - 0.35);
  const tete = pointOf(f, ciel, kt, t), queue = pointOf(f, ciel, kq, t);
  const teinte = f.reflet ? '150,190,255' : '170,205,255';
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // la traînée, en trois passes de plus en plus fines (lueur bleutée, puis cœur) ; brisée en douze pas (le reflet ondule)
  const g = ctx.createLinearGradient(tete.x, tete.y, queue.x, queue.y);
  g.addColorStop(0, `rgba(235,244,255,${(0.9 * force * fin).toFixed(3)})`);
  g.addColorStop(0.4, `rgba(${teinte},${(0.35 * force * fin).toFixed(3)})`);
  g.addColorStop(1, `rgba(${teinte},0)`);
  ctx.strokeStyle = g;
  const pas = Array.from({ length: 13 }, (_, i) => pointOf(f, ciel, kq + ((kt - kq) * i) / 12, t));
  for (const [lw, a] of [[5, 0.25], [2.4, 0.6], [1.1, 1]]) {
    ctx.globalAlpha = a;
    ctx.lineWidth = lw;
    ctx.beginPath();
    pas.forEach((q, i) => (i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y)));
    ctx.stroke();
  }
  // les paillettes qui se détachent de la traînée et tombent doucement en s'éteignant (montent, dans le reflet)
  const grain = etoile('235,244,255');
  for (let i = 0; i < 7; i++) {
    const at = hash(f.cycle, 30 + i) * kt;
    const age = f.k - at;
    if (age < 0.05) continue;
    const q = pointOf(f, ciel, at, t);
    const a = Math.max(0, 1 - age * 1.6) * fin * force;
    if (a < 0.03) continue;
    const s = 3 + 3 * hash(f.cycle, 40 + i);
    ctx.globalAlpha = a * (0.6 + 0.4 * Math.sin(age * 30 + i));
    ctx.drawImage(grain, q.x - s / 2, q.y + (f.reflet ? -1 : 1) * age * 14 - s / 2, s, s);
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

// L'étoile touchée du doigt : vingt paillettes colorées jaillissent de sa tête, puis retombent en scintillant, dans la
// transformation du monde. pop : { x, y, at } (dans le monde, performance.now()) ; false une fois finie
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
