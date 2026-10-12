// L'ambiance de lumière : rayons du soleil bas (aube, couchant) qui traversent l'air et vignettage qui recentre le
// regard, à l'écran ; éclats de lumière pastel qui flottent dans l'air de l'île et montent doucement (discrets le
// jour, plus nombreux au crépuscule et la nuit), posés dans le monde.
import { hash } from '../scene';

// Un faisceau : fondu en travers (bords doux) et en longueur (fort au départ, éteint au bout), dessiné une fois par
// teinte, puis posé tourné et étiré
const beams = new Map();
function beam(tone) {
  let c = beams.get(tone);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = 512; c.height = 64;
  const g = c.getContext('2d');
  const across = g.createLinearGradient(0, 0, 0, 64);
  across.addColorStop(0, `rgba(${tone},0)`);
  across.addColorStop(0.5, `rgba(${tone},1)`);
  across.addColorStop(1, `rgba(${tone},0)`);
  g.fillStyle = across;
  g.fillRect(0, 0, 512, 64);
  g.globalCompositeOperation = 'destination-in';
  const along = g.createLinearGradient(0, 0, 512, 0);
  along.addColorStop(0, 'rgba(0,0,0,.2)');
  along.addColorStop(0.12, 'rgba(0,0,0,1)');
  along.addColorStop(0.55, 'rgba(0,0,0,.5)');
  along.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = along;
  g.fillRect(0, 0, 512, 64);
  beams.set(tone, c);
  return c;
}

// Force des rayons (0 à 1) : seulement quand le soleil est bas et le ciel clair
export function raysOf(phase) {
  const { sun, weather } = phase;
  if (sun.up <= 0.02 || sun.up > 0.45) return 0;
  return (1 - weather.cover) * Math.min(1, sun.up * 8) * (1 - sun.up / 0.45);
}
// Rayons : quelques faisceaux depuis le côté du soleil, qui plongent en travers de la scène et respirent. Visibles
// sans éblouir ni cacher : peints à part en quart de résolution (ils sont flous), puis effacés aux deux tiers au
// centre de l'écran, là où le joueur regarde ; ils gardent les bords
const Q = 4;
let rays = null;
export function drawRays(ctx, w, h, t, phase) {
  const { sun } = phase;
  const k = raysOf(phase);
  if (k < 0.03) return;
  const rw = Math.max(1, Math.ceil(w / Q)), rh = Math.max(1, Math.ceil(h / Q));
  if (!rays) { rays = document.createElement('canvas'); }
  if (rays.width !== rw || rays.height !== rh) { rays.width = rw; rays.height = rh; }
  const r = rays.getContext('2d');
  r.setTransform(1, 0, 0, 1, 0, 0);
  r.globalCompositeOperation = 'source-over';
  r.globalAlpha = 1;
  r.clearRect(0, 0, rw, rh);
  r.setTransform(1 / Q, 0, 0, 1 / Q, 0, 0);
  const left = sun.progress < 0.5;
  const img = beam(left ? '255,238,196' : '255,204,146');
  const len = Math.hypot(w, h) * 1.1;
  r.globalCompositeOperation = 'lighter';
  r.translate(left ? -w * 0.08 : w * 1.08, -h * 0.06);
  for (let i = 0; i < 6; i++) {
    const ang = (left ? 0.98 : Math.PI - 0.98) + (i - 2.5) * 0.085 * (left ? 1 : -1) + Math.sin(t * 0.05 + i) * 0.012;
    const wid = 22 + hash(i, 3) * 46;
    r.save();
    r.rotate(ang);
    r.globalAlpha = Math.min(1, k * (0.3 + 0.12 * Math.sin(t * 0.3 + i * 1.7)) * (0.5 + hash(i, 5) * 0.6));
    r.drawImage(img, 0, -wid / 2, len, wid);
    r.restore();
  }
  // le centre de l'écran reste net
  r.setTransform(1 / Q, 0, 0, 1 / Q, 0, 0);
  r.globalCompositeOperation = 'destination-out';
  r.globalAlpha = 1;
  const clear = r.createRadialGradient(w / 2, h * 0.52, 0, w / 2, h * 0.52, Math.min(w, h) * 0.6);
  clear.addColorStop(0, 'rgba(0,0,0,.66)');
  clear.addColorStop(0.55, 'rgba(0,0,0,.4)');
  clear.addColorStop(1, 'rgba(0,0,0,0)');
  r.fillStyle = clear;
  r.fillRect(0, 0, w, h);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(rays, 0, 0, w, h);
  ctx.restore();
}

// Éclats de lumière (l'ambiance magique de l'île) : de petites bulles pastel au cœur clair, et parfois une étoile à
// quatre branches qui scintille. Ils flottent dans l'air de l'île, pas sur la vitre de l'écran : posés dans le monde
// (des carrés de TILE unités, chacun sa poignée d'éclats), ils restent en place quand on glisse et grandissent avec le
// zoom, comme le décor. Chacun naît, monte doucement en ondulant comme une graine de pissenlit, puis s'éteint et renaît
// ailleurs dans son carré : jamais d'apparition brusque. Tout se déduit du temps (rien à garder d'une image à l'autre) ;
// les dessins sont faits une fois par teinte.
const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const frac = v => v - Math.floor(v);

// Bulle : halo doux, cœur presque blanc
const bulles = new Map();
function bulle(tone) {
  let c = bulles.get(tone);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 48;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(24, 24, 0, 24, 24, 24);
  grad.addColorStop(0, 'rgba(255,255,250,1)');
  grad.addColorStop(0.12, `rgba(${tone},.95)`);
  grad.addColorStop(0.35, `rgba(${tone},.35)`);
  grad.addColorStop(0.7, `rgba(${tone},.08)`);
  grad.addColorStop(1, `rgba(${tone},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 48, 48);
  bulles.set(tone, c);
  return c;
}
// Étoile : une bulle plus petite et deux traits croisés qui s'effilent
const etoiles = new Map();
function etoile(tone) {
  let c = etoiles.get(tone);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 48;
  const g = c.getContext('2d');
  g.drawImage(bulle(tone), 12, 12, 24, 24);
  for (const [dx, dy] of [[1, 0], [0, 1]]) {
    const grad = g.createLinearGradient(24 - dx * 22, 24 - dy * 22, 24 + dx * 22, 24 + dy * 22);
    grad.addColorStop(0, `rgba(${tone},0)`);
    grad.addColorStop(0.5, 'rgba(255,255,250,.95)');
    grad.addColorStop(1, `rgba(${tone},0)`);
    g.fillStyle = grad;
    if (dx) g.fillRect(2, 23, 44, 2); else g.fillRect(23, 2, 2, 44);
  }
  etoiles.set(tone, c);
  return c;
}

// Teintes : le jour, pêche, or doux, menthe ; la nuit, menthe, lavande, bleu ciel
const JOUR = ['255,212,170', '255,234,168', '206,252,222'];
const NUIT = ['164,255,222', '206,186,255', '172,214,255'];
// Le carré du monde qui porte sa poignée d'éclats (unités du monde : à peu près un écran de téléphone de près)
const TILE = 480;

// Combien d'éclats par carré : quelques-uns le jour, plus au crépuscule, le plus la nuit ; rares sous la pluie
const duskOf = phase => Math.max(0, 1 - phase.sun.up * 3) * (1 - phase.night);
export function motesOf(phase) {
  const { night, weather } = phase;
  return Math.round((10 + 18 * duskOf(phase) + 36 * night) * (1 - 0.7 * weather.rain) * (1 - 0.35 * weather.cover * (1 - night)));
}

// Les éclats de la vue (view : rectangle du monde) à l'instant t, au zoom s : [{ x, y, size, a, star, tone }] en
// unités du monde. Vue de loin, ils se raréfient (un nuage de points sur toute l'île ne serait plus que du bruit)
export function motesIn(view, t, phase, s = 1) {
  const count = motesOf(phase);
  const keep = smooth(0.3, 0.75, s);
  if (count <= 0 || keep <= 0.02) return [];
  const { night } = phase;
  const dusk = duskOf(phase);
  const out = [];
  const tx0 = Math.floor(view.x / TILE) - 1, tx1 = Math.floor((view.x + view.w) / TILE) + 1;
  const ty0 = Math.floor(view.y / TILE) - 1, ty1 = Math.floor((view.y + view.h) / TILE) + 1;
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      for (let i = 0; i < count; i++) {
        const id = i + tx * 131 + ty * 197;
        if (hash(id, 20) > keep) continue;
        // une vie : sa durée, son âge (0 → 1), sa naissance (renouvelée à chaque vie)
        const life = 6 + hash(id, 21) * 6;
        const clock = t / life + hash(id, 22);
        const age = frac(clock), round = Math.floor(clock);
        const depth = 0.25 + hash(id, 23) * 0.75;
        const bx = (tx + hash(id * 13 + round, 24)) * TILE, by = (ty + hash(id * 7 + round, 25)) * TILE;
        // montée douce (vers le haut de l'écran) et ondulation (deux houles de périodes différentes)
        const rise = (18 + 30 * depth) * age;
        const sway = Math.sin(age * Math.PI * 2 * (0.6 + hash(id, 26) * 0.6) + hash(id, 27) * 6) * (6 + 10 * depth)
          + Math.sin(t * 0.35 + i) * 3 * depth;
        const x = bx + sway, y = by - rise;
        if (x < view.x - 24 || x > view.x + view.w + 24 || y < view.y - 24 || y > view.y + view.h + 24) continue;
        // naissance et fin en fondu, respiration
        const glow = smooth(0, 0.18, age) * (1 - smooth(0.72, 1, age)) * (0.86 + 0.14 * Math.sin(t * 1.3 + i * 2.1));
        const star = hash(id, 28) < 0.25;
        const tone = (night > 0.5 ? NUIT : JOUR)[Math.floor(hash(id, 29) * 3)];
        const size = (star ? 8 : 5) + 6 * depth;
        const twinkle = star ? 0.6 + 0.4 * Math.max(0, Math.sin(t * (2 + hash(id, 31) * 2) + i)) : 1;
        const a = glow * twinkle * (0.5 + 0.5 * depth) * (0.55 + 0.45 * Math.max(night, dusk)) * (0.4 + 0.6 * keep);
        if (a > 0.01) out.push({ x, y, size, a: Math.min(1, a), star, tone });
      }
    }
  }
  return out;
}

// Les éclats, dans la transformation du monde (caméra appliquée)
export function drawMotes(ctx, view, t, phase, s = 1) {
  const motes = motesIn(view, t, phase, s);
  if (!motes.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const m of motes) {
    ctx.globalAlpha = m.a;
    ctx.drawImage(m.star ? etoile(m.tone) : bulle(m.tone), m.x - m.size / 2, m.y - m.size / 2, m.size, m.size);
  }
  ctx.restore();
}

// Vignettage : les bords s'assombrissent doucement (plus la nuit)
let vignette = null;
export function drawVignette(ctx, w, h, phase) {
  const a = 0.18 + 0.2 * phase.night;
  if (!vignette || vignette.w !== w || vignette.h !== h) {
    const g = ctx.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.35, w / 2, h * 0.5, Math.hypot(w, h) * 0.62);
    g.addColorStop(0, 'rgba(12,16,34,0)');
    g.addColorStop(1, 'rgba(12,16,34,1)');
    vignette = { w, h, g };
  }
  ctx.save();
  ctx.globalAlpha = a;
  ctx.fillStyle = vignette.g;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}
