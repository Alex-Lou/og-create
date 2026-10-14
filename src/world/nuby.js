// Nuby, le nuage d'Aster (choix de l'auteur, 14 oct.) : la Pluie écrite, il rentre du large, s'arrête au-dessus du Puits
// d'Ondin et y pleut, puis repart vers l'intérieur quand Aster le dit ; l'arc-en-ciel le suit. Le dessin de la
// bibliothèque (meteo/nuages : nuage1_pluie), ses gouttes et son ombre du code. Calculs purs (showerAt), puis dessin
// Canvas 2D (monde).
import { librarySprite } from './library';
import { drawSprite } from './spriteCache';

const FILES = import.meta.glob('/design/bibliotheque/svg/meteo/nuages/nuage1_pluie.svg', { query: '?raw', import: 'default' });
// (son cadre : celui du dessin, 160 × 66, réduit de moitié : un petit nuage)
export const NUBY_SPRITE = ['nuby', librarySprite(Object.values(FILES)[0], { x: -40, y: -19, w: 80, h: 33 })];

// D'où il arrive (cases vers le large, au sud), où il repart (cases vers l'intérieur, au nord-ouest)
const FROM = 8;
const AWAY = 8;
// Sa hauteur au-dessus du sol (px), la largeur de sa pluie (px), ses gouttes
const ALT = 64;
const SPAN = 48;
const DROPS = 16;

// L'averse (s) : Nuby arrive (in), pleut jusqu'à ce qu'Aster le dise reparti (au plus max), repart (out) ; puis
// l'arc-en-ciel (bow)
export const SHOWER = { in: 3.5, out: 3.5, bow: 8, max: 40 };

const ease = k => k * k * (3 - 2 * k);
// L'averse, s secondes après la Pluie écrite ; leave : quand Aster l'a dit reparti (s depuis le début), ou null :
// { rain, rainbow } (0 à 1) et Nuby ({ dx, dy } en cases depuis la case où il pleut, sa pluie, son opacité ; null une
// fois parti) ; null avant, ou une fois tout passé, arc-en-ciel compris
export function showerAt(s, leave, timing = SHOWER) {
  const { in: come, out, bow, max } = timing;
  const go = Math.max(come, Math.min(leave ?? max, max));
  if (!(s >= 0) || s >= go + out + bow) return null;
  const rainbow = s < go ? 0 : ease(Math.min(1, (s - go) / out, (go + out + bow - s) / 2));
  if (s < come) {
    const k = ease(s / come);
    return { rain: k, rainbow, nuby: { dx: 0, dy: (1 - k) * FROM, rain: k, alpha: Math.min(1, s / 0.6) } };
  }
  if (s < go) return { rain: 1, rainbow, nuby: { dx: Math.sin((s - come) * 0.8) * 0.15, dy: 0, rain: 1, alpha: 1 } };
  if (s >= go + out) return { rain: 0, rainbow, nuby: null };
  const k = ease((s - go) / out);
  return { rain: 1 - k, rainbow, nuby: { dx: -k * AWAY, dy: -k * AWAY * 0.4, rain: 1 - k, alpha: 1 - k } };
}

// Nuby au-dessus du point (x, y) du sol (monde) : son ombre, sa pluie, puis lui (at : showerAt(…).nuby ; t : l'instant,
// en s)
export function drawNuby(ctx, x, y, at, t, onReady) {
  ctx.save();
  ctx.globalAlpha = 0.16 * at.alpha;
  ctx.fillStyle = '#1E2A33';
  ctx.beginPath();
  ctx.ellipse(x, y, SPAN * 0.6, SPAN * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();
  if (at.rain > 0.05) {
    ctx.globalAlpha = 0.8 * at.rain * at.alpha;
    ctx.strokeStyle = '#9CC4EC';
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    for (let i = 0; i < DROPS; i++) {
      const px = x + (((i * 0.618) % 1) - 0.5) * SPAN;
      const k = (t * 1.7 + i * 0.37) % 1;
      const py = y - ALT + 8 + k * (ALT - 8);
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - 1.2, py + 6);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = at.alpha;
  const [key, make] = NUBY_SPRITE;
  drawSprite(ctx, key, make, x, y - ALT, onReady);
  ctx.restore();
}
