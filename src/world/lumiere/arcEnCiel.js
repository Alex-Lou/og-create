// L'arc-en-ciel après l'averse : il enjambe la partie réveillée de l'île (il grandit avec elle), accroché au monde
// (il suit la caméra et le zoom). Il naît en se traçant d'un pied à l'autre, une étoile à la pointe ; puis il vit (un reflet le parcourt, des
// éclats scintillent le long de la bande, il respire) et s'efface. Après une pluie de la météo (sky.js :
// weather.rainbow) ou l'averse de la Pluie écrite (arcApresAverse), de jour seulement.
// Rendu : le spectre fondu de l'arc (rouge dehors, violet dedans) et sa frange pâle, le ciel plus clair au-dedans, un
// second arc pâle aux couleurs inversées et la lueur au-delà (la bande d'Alexandre, entre les deux, paraît plus
// sombre), les pieds fondus dans une petite brume.
import { TW, worldOf } from '../terrain';
import { hash } from '../scene';
import { lueur, etoile } from '@/utils/vfx';
import { clamp, lisse } from '../maths';

export const TRACE_MS = 2500; // l'arc se trace d'un pied à l'autre
const SECOND = [1800, 3500]; // le second arc paraît ensuite (ms depuis la naissance)
const AVERSE = { tient: 24000, part: 8000 }; // après l'averse écrite (ms)
const PIED = 0.07; // les pieds se fondent sur ce bout de l'arc (fraction de tour)
const Q = 2; // le calque est peint à demi-résolution (dégradés doux)
const APLATI = 0.8; // l'arc, vu de biais par la caméra de l'île, est un peu aplati

// Force de l'arc qui suit l'averse écrite, ms après sa fin (0 à 1)
export function arcApresAverse(ms) {
  if (!(ms >= 0)) return 0;
  return ms < AVERSE.tient ? 1 : lisse(1 - (ms - AVERSE.tient) / AVERSE.part);
}

// Force de l'arc (0 à 1) : après la pluie de la météo ou l'averse écrite, de jour seulement
export const arcForce = (phase, apres = 0) => Math.max(phase.weather.rainbow || 0, apres) * lisse(phase.sun.up / 0.05);

// La partie réveillée de l'île : la boîte { x0, y0, x1, y1 } (en cases) de celles qui se voient (awake(x, y)), ou
// null ; n : côté de l'île en cases
export function eveilOf(n, awake) {
  let x0 = n, y0 = n, x1 = -1, y1 = -1;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (!awake(x, y)) continue;
      x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
    }
  }
  return x1 < 0 ? null : { x0, y0, x1, y1 };
}

// Où il se pose : ses pieds aux pointes gauche et droite de la partie réveillée (un peu au large), son centre entre
// les deux
export function arcGeometrie(box) {
  const gauche = worldOf(box.x0, box.y1), droite = worldOf(box.x1, box.y0);
  return { cx: (gauche.x + droite.x) / 2, cy: (gauche.y + droite.y) / 2, r: ((droite.x - gauche.x) / 2 + TW / 2) * 1.08 };
}

// Où en est son tracé (0 à 1), ms après sa naissance (d'un coup en mouvement réduit)
export const traceOf = (ms, reduced = false) => (reduced ? 1 : lisse(ms / TRACE_MS));

// Ce qui se voit de l'arc à la fraction f de tour depuis le pied gauche (0 à 0,5 : de gauche à droite, par le haut) :
// les pieds fondus, et seulement la part déjà tracée (bord adouci)
export function voileArc(f, trace) {
  if (f < 0 || f > 0.5) return 0;
  const pieds = lisse(f / PIED) * lisse((0.5 - f) / PIED);
  return pieds * clamp((trace * 0.5 + 0.015 - f) / 0.015);
}

// Le spectre, du dedans (violet) au dehors (rouge) ; [position, 'r,g,b', alpha]
const SPECTRE = [[0.1, '154,110,214', 0.8], [0.24, '92,124,226', 1], [0.38, '84,178,232', 1], [0.52, '126,204,110', 1], [0.66, '246,214,96', 1], [0.8, '246,150,78', 1], [0.92, '232,84,74', 0.85]];
const FRANGE = [[0.3, '150,220,170', 0.35], [0.7, '230,150,220', 0.3]];
// Ses couleurs seules, du violet au rouge (les flaques s'en irisent : averse.js)
export const IRIS = SPECTRE.map(([, c]) => c);

// Un anneau (moitié haute) de ra à rb, rempli d'un dégradé du dedans au dehors ; stops : [position, 'r,g,b', alpha]
function anneau(g, cx, cy, ra, rb, stops, inverse = false) {
  const grad = g.createRadialGradient(cx, cy, ra, cx, cy, rb);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  for (const [p, c, a] of stops) grad.addColorStop(inverse ? 1 - p : p, `rgba(${c},${a})`);
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.beginPath();
  g.arc(cx, cy, rb, Math.PI, Math.PI * 2);
  g.arc(cx, cy, ra, Math.PI * 2, Math.PI, true);
  g.closePath();
  g.fill();
}
// Une lueur blanche sur un anneau, montant (ou descendant) de ra à rb
function halo(g, cx, cy, ra, rb, a, montant) {
  anneau(g, cx, cy, ra, rb, montant ? [[0.99, '255,255,255', a]] : [[0.01, '255,255,255', a]]);
}

// Les calques (l'arc, son reflet), à la taille de l'écran (demi-résolution), gardés d'une image à l'autre
const calques = {};
function calqueOf(nom, geo) {
  const w = Math.max(1, Math.ceil((geo.width * geo.dpr) / Q)), h = Math.max(1, Math.ceil((geo.height * geo.dpr) / Q));
  if (!calques[nom]) calques[nom] = document.createElement('canvas');
  const c = calques[nom];
  if (c.width !== w || c.height !== h) { c.width = w; c.height = h; }
  return c;
}

// Peint l'arc sur un calque : le ciel plus clair au-dedans, la frange et le spectre, le reflet qui le parcourt, le
// second arc et sa lueur, puis ne garde que la part tracée (pieds fondus). aplati : son écrasement vertical (négatif :
// son miroir, sous ses pieds)
function peindre(c, m, a, ms, t, reduced, aplati) {
  const g = c.getContext('2d');
  const { cx, cy, r } = a;
  const trace = traceOf(ms, reduced);
  const second = reduced ? 1 : lisse((ms - SECOND[0]) / (SECOND[1] - SECOND[0]));
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-over';
  g.globalAlpha = 1;
  g.clearRect(0, 0, c.width, c.height);
  g.setTransform(m.a / Q, m.b / Q, m.c / Q, m.d / Q, m.e / Q, m.f / Q);
  g.translate(cx, cy);
  g.scale(1, aplati);
  g.translate(-cx, -cy);
  // le ciel plus clair au-dedans, l'arc et sa frange pâle
  halo(g, cx, cy, r * 0.5, r * 0.9, 0.2, true);
  anneau(g, cx, cy, r * 0.855, r * 0.905, FRANGE);
  anneau(g, cx, cy, r * 0.9, r, SPECTRE);
  // le reflet qui parcourt l'arc, de gauche à droite, puis repart après une pause
  if (!reduced) {
    const p = (t * 0.07) % 1.6;
    if (p < 1) {
      const f = p * 0.5;
      const sheen = g.createConicGradient(Math.PI, cx, cy);
      sheen.addColorStop(Math.max(0, f - 0.05), 'rgba(255,255,255,0)');
      sheen.addColorStop(f, 'rgba(255,255,255,0.45)');
      sheen.addColorStop(Math.min(1, f + 0.05), 'rgba(255,255,255,0)');
      g.globalCompositeOperation = 'lighter';
      g.fillStyle = sheen;
      g.beginPath();
      g.arc(cx, cy, r * 0.99, Math.PI, Math.PI * 2);
      g.arc(cx, cy, r * 0.91, Math.PI * 2, Math.PI, true);
      g.fill();
      g.globalCompositeOperation = 'source-over';
    }
  }
  // le second arc, pâle et inversé, et la lueur au-delà
  if (second > 0.01) {
    g.globalAlpha = 0.4 * second;
    anneau(g, cx, cy, r * 1.16, r * 1.3, SPECTRE, true);
    g.globalAlpha = second;
    halo(g, cx, cy, r * 1.3, r * 1.5, 0.08, false);
    g.globalAlpha = 1;
  }
  // ce qui se voit : les pieds fondus, la part tracée
  const voile = g.createConicGradient(Math.PI, cx, cy);
  for (let i = 0; i <= 40; i++) voile.addColorStop((i / 40) * 0.5, `rgba(0,0,0,${voileArc((i / 40) * 0.5, trace).toFixed(3)})`);
  voile.addColorStop(0.501, 'rgba(0,0,0,0)');
  g.globalCompositeOperation = 'destination-in';
  g.fillStyle = voile;
  g.fillRect(cx - r * 1.6, cy - r * 1.6, r * 3.2, r * 1.7);
  return trace;
}

// L'arc entier, dans le monde : geo (taille de l'écran), m (transformation du monde à l'écran, pixels de l'appareil),
// a (arcGeometrie), force (arcForce), ms (depuis sa naissance), t (secondes de la scène)
export function drawArcEnCiel(ctx, geo, m, a, force, ms, t, reduced = false) {
  if (force < 0.02) return;
  const c = calqueOf('arc', geo);
  const trace = peindre(c, m, a, ms, t, reduced, APLATI);
  // à l'écran, peint en transparence (en lumière, « screen », les couleurs blanchiraient sur un sol clair)
  const souffle = reduced ? 1 : 1 + 0.05 * Math.sin(t * 0.9);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = Math.min(1, 0.6 * force * souffle);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(c, 0, 0, geo.width * geo.dpr, geo.height * geo.dpr);
  // dans le monde : la brume des pieds, les éclats le long de la bande, l'étoile à la pointe
  ctx.setTransform(m);
  pieds(ctx, a, force, trace, t);
  if (!reduced) eclats(ctx, a, force, trace, t);
  ctx.restore();
}

// L'ondulation d'une tranche du reflet, à la profondeur k (0 sous les pieds, 1 au plus loin) et à la hauteur y (px de
// l'écran) : son décalage (px de l'écran, plus fort au loin) et sa force (plus pâle au loin, rayée par les vaguelettes) ;
// immobile en mouvement réduit
export function ondulation(k, t, y, reduced = false) {
  if (reduced) return { dx: 0, alpha: 1 - 0.65 * k };
  const amp = 1.5 + 6 * k;
  const dx = amp * Math.sin(t * 1.7 + y * 0.09) + amp * 0.4 * Math.sin(t * 2.9 - y * 0.21);
  return { dx, alpha: (1 - 0.65 * k) * (0.72 + 0.28 * Math.sin(y * 0.35 - t * 2.4)) };
}

const MIROIR = 0.75; // le reflet, encore plus aplati que l'arc
// Le reflet de l'arc sur la mer, dessiné avec elle (la terre, par-dessus, le cache) : son miroir, plus aplati, découpé
// en tranches qui ondulent (décalées en sinus), plus brisé et plus pâle en s'éloignant des pieds
export function drawRefletArc(ctx, geo, m, a, force, ms, t, reduced = false) {
  if (force < 0.02) return;
  const { width, height, dpr } = geo;
  const c = calqueOf('reflet', geo);
  peindre(c, m, a, ms, t, reduced, -APLATI * MIROIR);
  const W = width * dpr, H = height * dpr;
  const haut = m.d * a.cy + m.f;
  const y0 = Math.max(0, Math.floor(haut)), y1 = Math.min(H, Math.ceil(haut + m.d * a.r * 1.5 * APLATI * MIROIR));
  if (y1 <= y0) return;
  const pas = Math.max(2, Math.round(2 * dpr));
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.imageSmoothingEnabled = true;
  for (let y = y0; y < y1; y += pas) {
    const { dx, alpha } = ondulation((y - haut) / (y1 - haut), t, y / dpr, reduced);
    ctx.globalAlpha = Math.min(1, 0.75 * force * alpha);
    ctx.drawImage(c, 0, y / Q, c.width, pas / Q, dx * dpr, y, W, pas);
  }
  ctx.restore();
}

// Un point de l'arc : fraction f de tour depuis le pied gauche, à la distance d du centre (aplati)
const surArc = (a, f, d) => ({ x: a.cx + Math.cos(Math.PI + f * Math.PI * 2) * d, y: a.cy + Math.sin(Math.PI + f * Math.PI * 2) * d * APLATI });

// La petite brume où l'arc pose ses pieds (le droit, une fois l'arc tracé jusque-là)
function pieds(ctx, a, force, trace, t) {
  ctx.globalCompositeOperation = 'screen';
  const img = lueur('240,244,255');
  [[-1, 1], [1, lisse((trace - 0.9) / 0.1)]].forEach(([side, k]) => {
    if (k < 0.01) return;
    for (let i = 0; i < 3; i++) {
      const s = a.r * (0.2 + 0.07 * i);
      const x = a.cx + side * a.r * 0.96 + Math.sin(t * 0.3 + i * 2.1) * a.r * 0.02 + (i - 1) * a.r * 0.05;
      const y = a.cy - a.r * 0.02 * i;
      ctx.globalAlpha = 0.28 * force * k;
      ctx.drawImage(img, x - s / 2, y - s / 4, s, s / 2);
    }
  });
}

// Des éclats qui scintillent le long de la bande, et l'étoile qui mène le tracé
const ECLATS = 14;
function eclats(ctx, a, force, trace, t) {
  ctx.globalCompositeOperation = 'lighter';
  const img = etoile('255,250,235');
  const taille = a.r * 0.035;
  for (let i = 0; i < ECLATS; i++) {
    const f = 0.06 + hash(i, 71) * 0.38;
    if (f > trace * 0.5) continue;
    const u = (t / (2.2 + hash(i, 73)) + hash(i, 75)) % 1;
    const k = Math.sin(Math.PI * u) ** 2;
    if (k < 0.05) continue;
    const p = surArc(a, f, a.r * (0.91 + hash(i, 77) * 0.08));
    const s = taille * (0.5 + 0.5 * k);
    ctx.globalAlpha = k * force * 0.9;
    ctx.drawImage(img, p.x - s / 2, p.y - s / 2, s, s);
  }
  if (trace < 1) {
    const fin = 1 - lisse((trace - 0.85) / 0.15);
    const tete = surArc(a, trace * 0.5, a.r * 0.95);
    const halo = taille * 5;
    ctx.globalAlpha = force * fin * 0.6;
    ctx.drawImage(lueur('255,248,230'), tete.x - halo / 2, tete.y - halo / 2, halo, halo);
    for (let j = 0; j < 4; j++) {
      const p = surArc(a, Math.max(0, trace * 0.5 - j * 0.012), a.r * 0.95);
      const s = taille * (j ? 1.1 - j * 0.2 : 2);
      ctx.globalAlpha = force * fin * (1 - j * 0.22);
      ctx.drawImage(img, p.x - s / 2, p.y - s / 2, s, s);
    }
  }
}
