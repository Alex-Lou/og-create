// Les ciels rares (choix de l'auteur, 15 oct.). L'aurore : une nuit claire sur dix environ (un peu plus l'hiver), des
// rideaux de lumière, verts en bas et violets en haut, pendent haut au-dessus des plus hauts sommets de l'île (le relief,
// que le serveur donne même d'un quartier inconnu : l'aurore luit au-dessus de la brume sans rien dévoiler). Ils se
// plissent lentement, des rais plus vifs y courent, et leur lumière verdit la neige et la mer voisine (la carte de
// lumière, pas la liste qui écarte le Voile). Le halo de lune : les nuits de ciel voilé, la lune au moins à moitié
// pleine, un grand anneau pâle, à peine irisé, se pose sur la mer autour du chemin de lune et ondule avec l'eau. Tout se
// déduit de la date et du temps.
import { hash } from '../scene';
import { cielOf } from './filantes';
import { moonOf } from './ombres';

// Pour les essais : ?ciel=aurore (une aurore cette nuit), ?ciel=halo (la lune pleine ; le halo veut aussi un ciel
// voilé : &meteo=voile), comme ?kraken (faune/kraken.js)
const CIEL_FORCE = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('ciel') : null;

const clamp = v => Math.min(1, Math.max(0, v));
const smooth = v => { const k = clamp(v); return k * k * (3 - 2 * k); };

/* ---------- L'aurore ---------- */

// Les sommets qui la portent (la hauteur la plus haute du relief : seules les Cimes l'atteignent)
export const SOMMET = 6;
// Une nuit claire sur dix en moyenne : 7,5 % en été, 12,5 % en hiver
const PART = 0.1;
// La crête, par bandes de cette largeur (unités du monde), et les colonnes des rideaux, à ce pas
const BANDE = 48;
const PAS = 22;
// Le bas des rideaux au-dessus des sommets, leur hauteur, et le rideau de derrière (plus haut, plus loin, plus pâle)
const BAS = 120;
const HAUT = 300;
const DERRIERE = { dy: -110, dz: 70, a: 0.55 };
// Les couleurs (du haut vers le bas) et celle de sa lumière au sol
const VIOLET = '176,112,255';
const VERT = '110,255,170';
const LISERE = '210,255,225';
export const LUMIERE_AURORE = '120,245,180';

// La nuit d'une date : le soir et le petit matin qui suit en font une seule (le jour à midi près)
const nuitDe = date => Math.floor((date.getTime() - date.getTimezoneOffset() * 6e4 - 12 * 36e5) / 864e5);

// Y a-t-il une aurore cette nuit ? (plus souvent autour de l'hiver)
export function auroreCetteNuit(date) {
  if (CIEL_FORCE === 'aurore') return true;
  const n = nuitDe(date);
  const jour = (((n % 365.25) + 365.25) % 365.25);
  const hiver = (1 + Math.cos((2 * Math.PI * (jour - 355)) / 365.25)) / 2;
  return hash(n, 71) < PART * (0.75 + 0.5 * hiver);
}

// Sa force (0 à 1) : une nuit d'aurore, franche et claire (filantes.js : cielOf) ; elle enfle et retombe en vagues de
// quelques minutes, sans jamais s'éteindre tout à fait
export function auroreOf(phase, date) {
  if (!auroreCetteNuit(date)) return 0;
  const ciel = cielOf(phase);
  if (ciel <= 0.02) return 0;
  const m = date.getTime() / 6e4;
  const vague = 0.62 + 0.38 * Math.max(0, Math.sin(m * 0.29 + nuitDe(date)) * 0.7 + Math.sin(m * 0.11) * 0.5);
  return ciel * Math.min(1, vague);
}

// La crête des sommets, une fois par île : points ({ x, y } dans le monde, au sol) rangés en bandes sur la largeur ;
// { x0, ys (le y moyen de chaque bande ; les trous comblés entre voisines) }, ou null sans sommet
export function creteDe(points) {
  if (points.length < 4) return null;
  let x0 = Infinity, x1 = -Infinity;
  for (const p of points) { x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); }
  const n = Math.max(1, Math.ceil((x1 - x0) / BANDE));
  const sum = new Array(n).fill(0), cnt = new Array(n).fill(0);
  for (const p of points) {
    const i = Math.min(n - 1, Math.floor((p.x - x0) / BANDE));
    sum[i] += p.y; cnt[i]++;
  }
  const ys = sum.map((s, i) => (cnt[i] ? s / cnt[i] : null));
  for (let i = 0; i < n; i++) {
    if (ys[i] !== null) continue;
    let a = i - 1, b = i + 1;
    while (b < n && ys[b] === null) b++;
    ys[i] = a < 0 ? ys[b] : b >= n ? ys[a] : ys[a] + ((ys[b] - ys[a]) * (i - a)) / (b - a);
  }
  // (adoucie : la moyenne de trois bandes)
  const doux = ys.map((y, i) => (ys[Math.max(0, i - 1)] + y + ys[Math.min(n - 1, i + 1)]) / 3);
  return { x0, ys: doux };
}

// Le y de la crête au point x du monde (au-delà des bords, celui du bord)
function creteY(crete, x) {
  const u = Math.min(crete.ys.length - 1, Math.max(0, (x - crete.x0) / BANDE - 0.5));
  const i = Math.floor(u), j = Math.min(crete.ys.length - 1, i + 1);
  return crete.ys[i] + (crete.ys[j] - crete.ys[i]) * (u - i);
}

// Les colonnes des rideaux visibles dans la vue à l'instant t : [{ x, y (le bas du rideau), h, a, r (1 : devant, 2 :
// derrière) }]. Le rideau se plisse (son pied ondule, vu d'en haut), des rais plus vifs y courent, il s'effile aux deux
// bouts
export function colonnesOf(crete, view, t, force) {
  const out = [];
  if (!crete || force <= 0.02) return out;
  const larg = crete.ys.length * BANDE, bout = Math.min(260, larg * 0.3);
  for (const [r, d] of [[1, { dy: 0, dz: 0, a: 1 }], [2, DERRIERE]]) {
    const i0 = Math.max(Math.ceil((crete.x0 - bout * 0.2) / PAS), Math.floor((view.x - PAS) / PAS));
    const i1 = Math.min(Math.floor((crete.x0 + larg + bout * 0.2) / PAS), Math.ceil((view.x + view.w + PAS) / PAS));
    for (let i = i0; i <= i1; i++) {
      const x = i * PAS;
      const pli = 34 * Math.sin(x * 0.0042 + t * 0.07 + r) + 14 * Math.sin(x * 0.011 - t * 0.12 + r * 2);
      const h = HAUT * (0.8 + 0.3 * Math.sin(x * 0.0085 + t * 0.05 + r * 3)) + d.dz;
      const y = creteY(crete, x) + d.dy + pli - BAS - d.dz;
      if (y < view.y || y - h > view.y + view.h) continue;
      // (des rais larges et fondus, qui glissent le long du rideau : pas de bandes nettes)
      const rai = 0.5 + 0.5 * Math.sin(x * 0.019 + t * 0.5 + Math.sin(x * 0.006 + t * 0.15) * 2.5);
      const env = smooth((x - crete.x0 + bout * 0.2) / bout) * smooth((crete.x0 + larg + bout * 0.2 - x) / bout);
      const a = force * d.a * env * (0.45 + 0.55 * rai * rai);
      if (a > 0.01) out.push({ x, y, h, a, r });
    }
  }
  return out;
}

// Sa lumière, sur la neige et la mer voisine (sources de la carte de lumière : lumiere/carte.js) : quelques grandes
// sources douces le long de la crête
export function lumieresAurore(crete, force) {
  if (!crete || force <= 0.02) return [];
  const n = crete.ys.length, out = [];
  for (let k = 0; k < 4; k++) {
    const x = crete.x0 + ((k + 0.5) / 4) * n * BANDE;
    const y = creteY(crete, x);
    out.push({ x, y: y - BAS * 0.5, r: 230, k: 0.3 * force, color: LUMIERE_AURORE, pool: false, gy: y });
  }
  return out;
}

// La bande de couleur d'une colonne, dessinée une fois : violette en haut, verte, un liseré clair au pied ; ses côtés
// fondus (les colonnes se chevauchent et se mêlent : aucun trait)
let bande = null;
function bandeAurore() {
  if (bande) return bande;
  bande = document.createElement('canvas');
  bande.width = 32;
  bande.height = 128;
  const g = bande.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 0, 128);
  grad.addColorStop(0, `rgba(${VIOLET},0)`);
  grad.addColorStop(0.3, `rgba(${VIOLET},0.4)`);
  grad.addColorStop(0.62, `rgba(${VERT},0.7)`);
  grad.addColorStop(0.92, `rgba(${LISERE},0.85)`);
  grad.addColorStop(1, `rgba(${LISERE},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 32, 128);
  g.globalCompositeOperation = 'destination-in';
  const cote = g.createLinearGradient(0, 0, 32, 0);
  cote.addColorStop(0, 'rgba(0,0,0,0)');
  cote.addColorStop(0.5, 'rgba(0,0,0,1)');
  cote.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = cote;
  g.fillRect(0, 0, 32, 128);
  return bande;
}

// Les rideaux, dans le monde (après la carte de lumière : ils luisent d'eux-mêmes). Flous par nature, ils se peignent
// en quart de résolution dans une image à part (comme la carte de lumière : lumiere/carte.js), posée ensuite en une
// fois sur ce qu'ils couvrent : leurs colonnes se chevauchent beaucoup, et sur l'écran entier cela coûterait cher
const Q = 4;
let toile = null, tctx = null;
export function drawAurore(ctx, colonnes) {
  if (!colonnes.length) return;
  const img = bandeAurore();
  const m = ctx.getTransform();
  const W = ctx.canvas.width, H = ctx.canvas.height;
  // (ce qu'ils couvrent, en pixels de l'appareil)
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const c of colonnes) {
    x0 = Math.min(x0, c.x - PAS * 1.5); x1 = Math.max(x1, c.x + PAS * 1.5);
    y0 = Math.min(y0, c.y - c.h); y1 = Math.max(y1, c.y);
  }
  const coins = [[x0, y0], [x1, y0], [x0, y1], [x1, y1]].map(([x, y]) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]);
  const L = Math.max(0, Math.floor(Math.min(...coins.map(p => p[0])) / Q) - 1), T = Math.max(0, Math.floor(Math.min(...coins.map(p => p[1])) / Q) - 1);
  const R = Math.min(Math.ceil(W / Q), Math.ceil(Math.max(...coins.map(p => p[0])) / Q) + 1), B = Math.min(Math.ceil(H / Q), Math.ceil(Math.max(...coins.map(p => p[1])) / Q) + 1);
  if (R <= L || B <= T) return;
  if (!toile) { toile = document.createElement('canvas'); tctx = toile.getContext('2d'); }
  if (toile.width !== Math.ceil(W / Q) || toile.height !== Math.ceil(H / Q)) { toile.width = Math.ceil(W / Q); toile.height = Math.ceil(H / Q); }
  tctx.setTransform(1, 0, 0, 1, 0, 0);
  tctx.clearRect(L, T, R - L, B - T);
  tctx.setTransform(m.a / Q, m.b / Q, m.c / Q, m.d / Q, m.e / Q, m.f / Q);
  tctx.globalCompositeOperation = 'lighter';
  for (const c of colonnes) {
    tctx.globalAlpha = Math.min(1, c.a * 0.28);
    tctx.drawImage(img, c.x - PAS * 1.5, c.y - c.h, PAS * 3, c.h);
  }
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(toile, L, T, R - L, B - T, L * Q, T * Q, (R - L) * Q, (B - T) * Q);
  ctx.restore();
}

/* ---------- Le halo de lune ---------- */

// Sa force (0 à 1) : la nuit franche, un ciel voilé (des nuages hauts et fins), pas de pluie, la lune au moins à moitié
// pleine
export function haloOf(phase, date) {
  const { night, weather } = phase;
  const nuit = smooth((night - 0.6) / 0.25);
  const voile = clamp(1 - Math.abs(weather.cover - 0.72) / 0.22);
  const lune = CIEL_FORCE === 'halo' ? 1 : smooth((moonOf(date).light - 0.45) / 0.25);
  return nuit * voile * lune * clamp(1 - weather.rain * 20);
}

// Où il se pose : sur la mer, au bout du chemin de lune, au large au nord (rivage.js : glitterOf, la lune y est à 0,62
// de la largeur), écrasé par le regard ; { x, y, rx, ry } dans le monde
export const haloPlace = bounds => {
  const rx = bounds.w * 0.085;
  return { x: bounds.x + bounds.w * 0.62, y: bounds.y + bounds.h * 0.04, rx, ry: rx * 0.42 };
};

// L'anneau, dessiné une fois : un trait pâle et large, un rien rouge dedans et bleu dehors ; au centre, le reflet doux
// de la lune
let anneau = null;
function anneauHalo() {
  if (anneau) return anneau;
  anneau = document.createElement('canvas');
  anneau.width = anneau.height = 256;
  const g = anneau.getContext('2d');
  const grad = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(236,242,255,0.7)');
  grad.addColorStop(0.12, 'rgba(220,230,255,0.18)');
  grad.addColorStop(0.3, 'rgba(220,230,255,0)');
  grad.addColorStop(0.66, 'rgba(255,200,180,0)');
  grad.addColorStop(0.75, 'rgba(255,210,190,0.55)');
  grad.addColorStop(0.81, 'rgba(240,245,255,1)');
  grad.addColorStop(0.88, 'rgba(196,214,255,0.45)');
  grad.addColorStop(0.97, 'rgba(196,214,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return anneau;
}

// L'anneau sur la mer (avec la mer : la terre, par-dessus, le cache où elle passe ; la nuit, posée ensuite, l'adoucit).
// Il ondule avec l'eau, plus nerveux quand elle s'agite (agite : sea.js, agitationOf) : deux reflets un peu décalés
// qui se croisent, sans découpe
export function drawHalo(ctx, view, t, force, bounds, agite = 0) {
  if (force <= 0.02) return;
  const p = haloPlace(bounds);
  if (p.x + p.rx < view.x || p.x - p.rx > view.x + view.w || p.y + p.ry < view.y || p.y - p.ry > view.y + view.h) return;
  const img = anneauHalo();
  const v = 1.1 + agite * 1.5, amp = p.rx * (0.006 + 0.016 * agite);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.5 * force;
  for (const k of [0, 1]) {
    const dx = Math.sin(t * v + k * 2.4) * amp, dy = Math.sin(t * v * 0.7 + k * 1.3) * amp * 0.3;
    ctx.drawImage(img, p.x - p.rx + dx, p.y - p.ry + dy, p.rx * 2, p.ry * 2);
  }
  ctx.restore();
}
