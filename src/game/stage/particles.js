// Les particules de la scène : éclats, gouttes, feuilles, étoiles, poussière. Une réserve bornée (les plus vieilles
// cèdent la place), mises à jour et dessinées par la scène (stage.js) à chaque image.
import { clamp01, lerp } from './ease';

const MAX = 320;
const TAU = Math.PI * 2;

export function createParticles() {
  const list = [];
  return {
    list,
    // Une gerbe : n particules autour de (x, y). spec : { n, shape, colors, speed: [min, max], angle (centre, rad),
    // spread (rad), size: [min, max], size1 (taille de fin, en part de la taille), life: [min, max] (ms), gravity
    // (px/s²), drag (part de vitesse perdue par seconde), spin, fade }
    burst(x, y, spec, rand = Math.random) {
      const n = spec.n || 8;
      for (let i = 0; i < n; i++) {
        if (list.length >= MAX) list.shift();
        const a = (spec.angle ?? -Math.PI / 2) + (rand() - 0.5) * (spec.spread ?? TAU);
        const v = lerp(...(spec.speed || [60, 160]), rand());
        const size = lerp(...(spec.size || [3, 6]), rand());
        list.push({
          x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
          g: spec.gravity ?? 420, drag: spec.drag ?? 1.2,
          age: 0, life: lerp(...(spec.life || [420, 760]), rand()),
          size, size1: spec.size1 ?? 0.2,
          rot: rand() * TAU, vr: (rand() - 0.5) * (spec.spin ?? 10),
          color: spec.colors[Math.floor(rand() * spec.colors.length)],
          shape: spec.shape || 'circle', fade: spec.fade ?? 0.6
        });
      }
    },
    update(dt) {
      const s = dt / 1000;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.age += dt;
        if (p.age >= p.life) {
          list.splice(i, 1);
          continue;
        }
        const k = Math.max(0, 1 - p.drag * s);
        p.vx *= k;
        p.vy = p.vy * k + p.g * s;
        p.x += p.vx * s;
        p.y += p.vy * s;
        p.rot += p.vr * s;
      }
    },
    draw(ctx) {
      for (const p of list) {
        const t = clamp01(p.age / p.life);
        const size = p.size * lerp(1, p.size1, t);
        ctx.globalAlpha = t < p.fade ? 1 : 1 - (t - p.fade) / (1 - p.fade);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        SHAPES[p.shape](ctx, size);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },
    clear() {
      list.length = 0;
    }
  };
}

// Les formes, centrées sur l'origine, de taille s (rayon)
const SHAPES = {
  circle(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, TAU);
    ctx.fill();
  },
  // une étoile à quatre branches (l'éclat d'or)
  star(ctx, s) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 ? s * 0.32 : s;
      const a = (i * Math.PI) / 4;
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.fill();
  },
  // un éclat de pierre ou de bois
  chip(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(-s, -s * 0.5);
    ctx.lineTo(s * 0.7, -s * 0.8);
    ctx.lineTo(s, s * 0.4);
    ctx.lineTo(-s * 0.4, s * 0.8);
    ctx.fill();
  },
  // une écharde (bois)
  splinter(ctx, s) {
    ctx.fillRect(-s * 1.4, -s * 0.28, s * 2.8, s * 0.56);
  },
  // une goutte, pointe vers le haut (elle tourne avec la particule)
  drop(ctx, s) {
    ctx.beginPath();
    ctx.moveTo(0, -s * 1.5);
    ctx.quadraticCurveTo(s, 0, 0, s);
    ctx.quadraticCurveTo(-s, 0, 0, -s * 1.5);
    ctx.fill();
  },
  leaf(ctx, s) {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.3, s * 0.6, 0, 0, TAU);
    ctx.fill();
  },
  // une bulle : un cercle clair cerné
  bubble(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, TAU);
    ctx.globalAlpha *= 0.35;
    ctx.fill();
    ctx.globalAlpha /= 0.35;
    ctx.lineWidth = Math.max(1, s * 0.25);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
  },
  // un anneau qui s'élargit (l'onde d'un coup)
  ring(ctx, s) {
    ctx.beginPath();
    ctx.arc(0, 0, s, 0, TAU);
    ctx.lineWidth = Math.max(1.5, s * 0.12);
    ctx.strokeStyle = ctx.fillStyle;
    ctx.stroke();
  }
};
