// La petite vie de l'air de l'île (choix de l'auteur, 14 oct. : l'île vit même avant qu'on écrive ses bêtes, sans
// leur prendre la place). Le jour, des aigrettes de pissenlit portées par le vent ; la nuit, des braises qui montent
// du feu de camp. Les papillons, abeilles et lucioles, eux, ne viennent qu'écrits dans le Grimoire (bible, Bestiaire).
// Comme les éclats de lumière (ambiance.js) : posé dans le monde, tout se déduit du temps (rien à garder d'une image
// à l'autre), chaque dessin est fait une fois.
import { hash } from '../scene';
import { gustOf } from './averse';

const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const frac = v => v - Math.floor(v);
// Le carré du monde qui porte sa poignée d'aigrettes (unités du monde, comme les éclats)
const TILE = 480;

/* ---------- Les aigrettes de pissenlit (le jour) ---------- */

// Une aigrette : la petite graine brune au bout de son bec, et la houppe de soies blanches qui la porte, dans un halo
// très doux (dessinée une fois, 40 px)
let aigretteImg = null;
function aigrette() {
  if (aigretteImg) return aigretteImg;
  const c = document.createElement('canvas');
  c.width = c.height = 40;
  const g = c.getContext('2d');
  const halo = g.createRadialGradient(20, 15, 0, 20, 15, 16);
  halo.addColorStop(0, 'rgba(255,255,250,.55)');
  halo.addColorStop(1, 'rgba(255,255,250,0)');
  g.fillStyle = halo;
  g.fillRect(0, 0, 40, 40);
  // le bec, puis la graine
  g.strokeStyle = 'rgba(214,200,170,.95)';
  g.lineWidth = 1;
  g.beginPath(); g.moveTo(20, 15); g.lineTo(20, 30); g.stroke();
  g.fillStyle = '#8A6A4A';
  g.beginPath(); g.ellipse(20, 32, 1.4, 2.6, 0, 0, Math.PI * 2); g.fill();
  // la houppe : douze soies en éventail vers le haut, chacune finie d'un point ; d'abord leur ombre bleutée (elles se
  // lisent sur l'herbe claire et le sable), puis le blanc
  const soies = (color, w, dot) => {
    g.strokeStyle = color;
    g.fillStyle = color;
    g.lineWidth = w;
    for (let i = 0; i < 12; i++) {
      const a = Math.PI + (i / 11) * Math.PI, r = 10 + (i % 3) * 1.2;
      const x = 20 + Math.cos(a) * r, y = 15 + Math.sin(a) * r * 0.85;
      g.beginPath(); g.moveTo(20, 15); g.quadraticCurveTo(20 + Math.cos(a) * r * 0.5, 15 + Math.sin(a) * r * 0.3, x, y); g.stroke();
      g.beginPath(); g.arc(x, y, dot, 0, Math.PI * 2); g.fill();
    }
  };
  soies('rgba(96,112,140,.45)', 2, 1.6);
  soies('#FFFFFF', 0.9, 1);
  aigretteImg = c;
  return c;
}

// Combien d'aigrettes par carré : quelques-unes par beau temps, aucune la nuit ni sous la pluie
export function aigrettesOf(phase) {
  const { night, weather } = phase;
  const day = 1 - smooth(0.25, 0.55, night);
  const dry = 1 - smooth(0.05, 0.3, weather.rain);
  return Math.round(6 * day * dry * (1 - 0.4 * weather.cover));
}

// Les aigrettes de la vue (view : rectangle du monde) à l'instant t, au zoom s : [{ x, y, size, a, tilt }] en unités
// du monde. Chacune naît dans son carré, part avec le vent (plus vite dans une rafale) en montant et descendant
// doucement, se balance, puis s'efface et renaît ailleurs. Vue de loin, elles se raréfient
export function aigrettesIn(view, t, phase, s = 1) {
  const count = aigrettesOf(phase);
  const keep = smooth(0.35, 0.8, s);
  if (count <= 0 || keep <= 0.02) return [];
  const out = [];
  const wind = 0.75 + 0.5 * gustOf(t);
  const tx0 = Math.floor(view.x / TILE) - 1, tx1 = Math.floor((view.x + view.w) / TILE) + 1;
  const ty0 = Math.floor(view.y / TILE) - 1, ty1 = Math.floor((view.y + view.h) / TILE) + 1;
  for (let ty = ty0; ty <= ty1; ty++) {
    for (let tx = tx0; tx <= tx1; tx++) {
      for (let i = 0; i < count; i++) {
        const id = i + tx * 173 + ty * 229;
        if (hash(id, 60) > keep) continue;
        const life = 10 + hash(id, 61) * 6;
        const clock = t / life + hash(id, 62);
        const age = frac(clock), round = Math.floor(clock);
        const depth = 0.35 + hash(id, 63) * 0.65;
        const bx = (tx + hash(id * 11 + round, 64)) * TILE, by = (ty + hash(id * 5 + round, 65)) * TILE;
        // le vent la pousse (vers la droite de l'écran, comme la pluie penche) ; elle monte puis redescend en ondulant
        const run = (70 + 60 * depth) * age * wind;
        const bob = -Math.sin(age * Math.PI) * (14 + 12 * depth) + Math.sin(age * Math.PI * 2 * (1.2 + hash(id, 66)) + hash(id, 67) * 6) * 5;
        const x = bx + run, y = by + bob;
        if (x < view.x - 20 || x > view.x + view.w + 20 || y < view.y - 20 || y > view.y + view.h + 20) continue;
        const a = smooth(0, 0.12, age) * (1 - smooth(0.8, 1, age)) * (0.55 + 0.45 * depth) * (0.4 + 0.6 * keep);
        const tilt = 0.35 * Math.sin(t * (1.1 + hash(id, 68)) + i) + 0.25 * (wind - 1);
        if (a > 0.02) out.push({ x, y, size: 11 + 8 * depth, a: Math.min(1, a), tilt });
      }
    }
  }
  return out;
}

// Les aigrettes, dans la transformation du monde (caméra appliquée)
export function drawAigrettes(ctx, view, t, phase, s = 1) {
  const list = aigrettesIn(view, t, phase, s);
  if (!list.length) return;
  const img = aigrette();
  for (const g of list) {
    ctx.save();
    ctx.globalAlpha = g.a;
    ctx.translate(g.x, g.y);
    ctx.rotate(g.tilt);
    ctx.drawImage(img, -g.size / 2, -g.size * 0.4, g.size, g.size);
    ctx.restore();
  }
}

/* ---------- Les braises du feu de camp (la nuit) ---------- */

// Une braise : un point chaud au cœur presque blanc dans sa lueur (une fois par teinte, 24 px)
const braiseImgs = new Map();
function braise(tone) {
  let c = braiseImgs.get(tone);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = c.height = 24;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(12, 12, 0, 12, 12, 12);
  grad.addColorStop(0, 'rgba(255,250,220,1)');
  grad.addColorStop(0.18, `rgba(${tone},.95)`);
  grad.addColorStop(0.45, `rgba(${tone},.3)`);
  grad.addColorStop(1, `rgba(${tone},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, 24, 24);
  braiseImgs.set(tone, c);
  return c;
}
const TONS = ['255,196,96', '255,150,64', '255,226,140'];
const PAR_FEU = 14;

// La force des braises : à peine le jour, pleine la nuit ; la pluie les éteint presque ; k : ce qu'il reste du feu
export const braisesFor = (phase, k = 1) => (0.25 + 0.75 * phase.night) * (1 - 0.8 * Math.min(1, phase.weather.rain / 0.6)) * k;

// Les braises de chaque feu (fires : [{ x, y }] en unités du monde, le haut de la flamme) à l'instant t :
// [{ x, y, size, a, tone }]. Chacune jaillit de la flamme, monte en zigzag, penche avec le vent et s'éteint en route
export function braisesIn(fires, t, phase, k = 1) {
  const force = braisesFor(phase, k);
  if (force <= 0.02) return [];
  const out = [];
  const slant = 0.6 + 0.5 * gustOf(t);
  fires.forEach((f, n) => {
    for (let i = 0; i < PAR_FEU; i++) {
      const id = n * 31 + i;
      const life = 1.3 + hash(id, 70) * 1.2;
      const clock = t / life + hash(id, 71);
      const age = frac(clock), round = Math.floor(clock);
      const rise = (40 + 36 * hash(id * 3 + round, 72)) * age;
      const zig = Math.sin(age * Math.PI * (3 + hash(id, 73) * 3) + hash(id * 5 + round, 74) * 6) * (2 + 3 * age);
      const x = f.x + (hash(id * 7 + round, 75) - 0.5) * 8 + zig + rise * 0.25 * slant;
      const y = f.y - rise;
      const a = force * smooth(0, 0.1, age) * (1 - smooth(0.45, 1, age)) * (0.7 + 0.3 * Math.sin(t * 17 + i));
      if (a > 0.02) out.push({ x, y, size: (4.6 - 2 * age) * (0.8 + 0.4 * hash(id, 76)), a: Math.min(1, a), tone: TONS[Math.floor(hash(id, 77) * 3)] });
    }
  });
  return out;
}

// Les braises, dans la transformation du monde, en lumière qui s'ajoute
export function drawBraises(ctx, fires, t, phase, k = 1) {
  const list = braisesIn(fires, t, phase, k);
  if (!list.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const b of list) {
    ctx.globalAlpha = b.a;
    const r = b.size * 2.2;
    ctx.drawImage(braise(b.tone), b.x - r, b.y - r, r * 2, r * 2);
    // le cœur de la braise, un point net par-dessus sa lueur
    ctx.fillStyle = '#FFF2C0';
    ctx.fillRect(b.x - b.size * 0.22, b.y - b.size * 0.22, b.size * 0.44, b.size * 0.44);
  }
  ctx.restore();
}
