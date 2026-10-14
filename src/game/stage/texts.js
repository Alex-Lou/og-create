// Les mots de la scène : onomatopées, paliers d'un combo, gains. Chaque lettre est précuite une fois (relief, trait
// brun épais, dégradé en trois tons, reflet et biseau), puis la scène les anime une à une : elles sautent l'une après
// l'autre, ondulent, et le mot éclate en partant. Derrière une onomatopée, une étoile de bande dessinée ; derrière un
// palier, un halo et des rayons qui tournent.
import { clamp01, outBack, outElastic, outCubic } from './ease';

const INK = '#3C2819';
const LETTER_STEP = 38; // d'une lettre à la suivante, à l'apparition (ms)
const APPEAR_MS = 300; // une lettre qui saute
const LEAVE = 0.8; // le mot éclate à partir de cette part de sa vie

export function createTexts() {
  const list = [];
  return {
    list,
    // spec : { text, x, y, size (px), fill ([clair, couleur]), font ('ui' ou 'display'), life (ms), rise (px),
    // tilt (rad), delay (ms), look ('word' : étoile derrière ; 'label' : halo et rayons ; 'gain' : rien), rays (bool) }
    add(spec) {
      list.push({ age: -(spec.delay || 0), life: 1100, rise: 26, tilt: 0, font: 'ui', look: 'gain', ...spec, letters: null });
    },
    update(dt) {
      for (let i = list.length - 1; i >= 0; i--) {
        list[i].age += dt;
        if (list[i].age >= list[i].life) list.splice(i, 1);
      }
    },
    // (width, height : la taille de la scène ; un mot reste dedans, son étoile ou son halo compris)
    draw(ctx, fonts, dpr, width, height) {
      for (const w of list) {
        if (w.age < 0) continue;
        if (!w.letters) {
          bake(w, fonts, dpr);
          const half = Math.min(width / 2, w.width / 2 + w.size * 0.7);
          w.x = Math.min(Math.max(w.x, half), width - half);
          const tall = Math.min(height / 2, w.size * 0.9);
          w.y = Math.min(Math.max(w.y, tall + w.rise), height - tall);
        }
        drawWord(ctx, w);
      }
      ctx.globalAlpha = 1;
    },
    clear() {
      list.length = 0;
    }
  };
}

/* ---------- Une lettre précuite ---------- */

function bake(w, fonts, dpr) {
  const font = `900 ${w.size}px ${w.font === 'display' ? fonts.display : fonts.ui}`;
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = font;
  const chars = [...w.text];
  const advances = chars.map(ch => measure.measureText(ch).width);
  const total = advances.reduce((a, b) => a + b, 0);
  let x = -total / 2;
  w.width = total;
  w.letters = chars.map((ch, i) => {
    const adv = advances[i];
    const letter = { ch, x: x + adv / 2, art: ch.trim() ? bakeLetter(ch, font, w.size, w.fill, adv, dpr) : null };
    x += adv;
    return letter;
  });
}

function bakeLetter(ch, font, size, fill, adv, dpr) {
  const pad = size * 0.32;
  const depth = size * 0.11;
  const cw = adv + pad * 2, ch2 = size * 1.25 + pad * 2 + depth;
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(cw * dpr);
  canvas.height = Math.ceil(ch2 * dpr);
  const c = canvas.getContext('2d');
  c.scale(dpr, dpr);
  c.font = font;
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.lineJoin = 'round';
  const cx = cw / 2, cy = pad + size * 0.62;
  const [light, color] = Array.isArray(fill) ? fill : [fill, fill];
  const dark = shade(color, 0.55);
  // le relief : la lettre répétée vers le bas, sombre, cernée
  c.lineWidth = size * 0.26;
  c.strokeStyle = INK;
  for (let d = depth; d > 0; d -= depth / 4) {
    c.strokeText(ch, cx, cy + d);
    c.fillStyle = dark;
    c.fillText(ch, cx, cy + d);
  }
  // le trait brun épais, puis la face en dégradé (clair, couleur, couleur foncée)
  c.strokeText(ch, cx, cy);
  const g = c.createLinearGradient(0, cy - size * 0.5, 0, cy + size * 0.45);
  g.addColorStop(0, light);
  g.addColorStop(0.5, color);
  g.addColorStop(1, shade(color, 0.8));
  c.fillStyle = g;
  c.fillText(ch, cx, cy);
  // le reflet sur la moitié haute, et le biseau clair au bord
  c.save();
  c.beginPath();
  c.rect(0, 0, cw, cy - size * 0.04);
  c.clip();
  c.globalAlpha = 0.42;
  c.fillStyle = '#FFFFFF';
  c.fillText(ch, cx, cy);
  c.globalAlpha = 0.7;
  c.lineWidth = Math.max(1, size * 0.04);
  c.strokeStyle = '#FFFFFF';
  c.strokeText(ch, cx, cy);
  c.restore();
  return { canvas, w: cw, h: ch2, ox: cx, oy: cy };
}

// Une couleur #RRGGBB assombrie (k < 1)
function shade(hex, k) {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  const ch = s => Math.round(((n >> s) & 255) * k);
  return `rgb(${ch(16)}, ${ch(8)}, ${ch(0)})`;
}

/* ---------- Un mot à l'écran ---------- */

function drawWord(ctx, w) {
  const t = clamp01(w.age / w.life);
  const leaving = t > LEAVE ? (t - LEAVE) / (1 - LEAVE) : 0;
  ctx.save();
  ctx.translate(w.x, w.y - w.rise * outCubic(t));
  ctx.rotate(w.tilt);
  // en partant, le mot gonfle un peu et s'efface
  const out = 1 + leaving * 0.25;
  ctx.scale(out, out);
  ctx.globalAlpha = 1 - leaving;
  if (w.look === 'word') drawBurst(ctx, w);
  if (w.look === 'label') drawHalo(ctx, w);
  w.letters.forEach((l, i) => {
    if (!l.art) return;
    const a = clamp01((w.age - i * LETTER_STEP) / APPEAR_MS);
    if (a <= 0) return;
    const pop = w.look === 'label' ? outElastic(a) : outBack(a, 2.6);
    const lift = (1 - outCubic(a)) * w.size * 0.6;
    const wave = a >= 1 ? Math.sin(w.age / 170 + i * 0.75) * w.size * 0.05 : 0;
    const sway = a >= 1 ? Math.sin(w.age / 230 + i) * 0.05 : (1 - a) * 0.4;
    ctx.save();
    ctx.translate(l.x, lift + wave);
    ctx.rotate(sway);
    ctx.scale(pop, pop);
    const { canvas, w: cw, h, ox, oy } = l.art;
    ctx.drawImage(canvas, -ox, -oy, cw, h);
    ctx.restore();
  });
  ctx.restore();
}

// L'étoile de bande dessinée derrière une onomatopée : crème, cernée, à pointes, qui pulse
function drawBurst(ctx, w) {
  const a = clamp01(w.age / 220);
  const r = (w.width / 2 + w.size * 0.55) * outBack(a, 2) * (1 + Math.sin(w.age / 120) * 0.03);
  const spikes = 12;
  ctx.save();
  ctx.rotate(w.age / 1600);
  ctx.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const rr = i % 2 ? r * 0.72 : r;
    const ang = (i * Math.PI) / spikes;
    ctx.lineTo(Math.cos(ang) * rr, Math.sin(ang) * rr * 0.62);
  }
  ctx.closePath();
  ctx.fillStyle = '#FFF8E6';
  ctx.fill();
  ctx.lineWidth = Math.max(2, w.size * 0.09);
  ctx.lineJoin = 'round';
  ctx.strokeStyle = INK;
  ctx.stroke();
  ctx.restore();
}

// Le halo derrière un palier, et ses rayons qui tournent (les grands paliers)
function drawHalo(ctx, w) {
  const a = clamp01(w.age / 320);
  const r = (w.width / 2 + w.size) * outCubic(a);
  const [light, color] = Array.isArray(w.fill) ? w.fill : [w.fill, w.fill];
  if (w.rays) {
    ctx.save();
    ctx.rotate(w.age / 900);
    ctx.globalAlpha *= 0.22;
    ctx.fillStyle = color;
    const n = 14;
    for (let i = 0; i < n; i++) {
      const a0 = (i * 2 * Math.PI) / n;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a0) * r, Math.sin(a0) * r * 0.6);
      ctx.lineTo(Math.cos(a0 + 0.16) * r, Math.sin(a0 + 0.16) * r * 0.6);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
  g.addColorStop(0, light);
  g.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.save();
  ctx.globalAlpha *= 0.8;
  ctx.scale(1, 0.55);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
