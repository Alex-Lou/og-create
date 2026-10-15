// La nuit de la veillée (choix de l'auteur, 12 oct. ; game/prologue.js : VEILLEE) : le feu de camp baisse, la nuit se
// fait magie (bleu-violet, la lune qui se lève au nord-ouest et ses rayons doux, des nappes de brume qui luisent, des lucioles), les égarés viennent
// buter sur la clôture, puis le feu repart et la nuit redevient la nuit. Méthodes de WorldView.vue (this : le
// composant), réunies par draw.js ; this.veillee ({ from, end } en s : demos.js, guideDemo) la mène.

import { hash } from '@/world/scene';
import { tuilesOf, TUILE } from '@/world/tuiles';
import { drawFaisceaux } from '@/world/lumiere';

// Le temps de venir et de s'en aller (s) ; les lucioles, par carreau du monde
const FADE_IN = 2.5;
const FADE_OUT = 2.5;
const LUCIOLES = 6;
// La direction des rayons de lune (à l'écran) : du nord-ouest (en haut à gauche) vers le sud-est
const MOON_ANG = 0.7;

// Une nappe de brume bleutée qui luit : une image douce, dessinée une fois
let nappe = null;
function nappeBleue() {
  if (nappe) return nappe;
  nappe = document.createElement('canvas');
  nappe.width = nappe.height = 128;
  const g = nappe.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(150, 175, 255, 1)');
  grad.addColorStop(1, 'rgba(150, 175, 255, 0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return nappe;
}

export default {
  // Où en est la nuit magique (0 à 1) ; d'un coup en mouvement réduit
  veilleeK() {
    const v = this.veillee;
    if (!v) return 0;
    if (this.reduced()) return v.end ? 0 : 1;
    const now = performance.now() / 1000;
    const k = Math.min(1, (now - v.from) / FADE_IN);
    return v.end ? Math.max(0, Math.min(k, 1 - (now - v.end) / FADE_OUT)) : k;
  },
  // Ce qu'il reste du feu de camp (draw/air.js : drawLights) : il baisse presque jusqu'à s'éteindre
  fireLeft() {
    return 1 - 0.88 * this.veilleeK();
  },
  // Par-dessus la scène, en pixels d'écran (w × h) : la nuit qui vire au bleu-violet (un étalonnage, sans forme). La
  // lune, ses nappes de brume et ses lucioles sont posées sur l'île (drawVeilleeMonde)
  drawVeillee(ctx, w, h) {
    const k = this.veilleeK();
    if (k <= 0) return;
    ctx.save();
    // La nuit vire au bleu-violet
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgba(78, 64, 160, ${0.6 * k})`;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },
  // Dans le monde (sa transformation ; view : le rectangle du monde à l'écran) : la lune se lève au nord-ouest (choix de
  // l'auteur, 15 oct.) ; une lueur douce sur ce bord de l'île, et ses rayons, des faisceaux fondus qui traversent l'air
  // vers le sud-est, discrets ; les nappes de brume qui luisent et dérivent, les lucioles qui montent en scintillant
  // (par carreaux : world/tuiles.js)
  drawVeilleeMonde(ctx, view, t) {
    const k = this.veilleeK();
    if (k <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const b = this.terrain && this.terrain.bounds;
    if (b) {
      const mx = b.x + b.w * 0.12, my = b.y - b.h * 0.04, r = Math.max(b.w, b.h) * 0.45;
      const halo = ctx.createRadialGradient(mx, my, 0, mx, my, r);
      halo.addColorStop(0, `rgba(196, 210, 255, ${(0.22 * k).toFixed(3)})`);
      halo.addColorStop(0.5, `rgba(180, 196, 255, ${(0.07 * k).toFixed(3)})`);
      halo.addColorStop(1, 'rgba(180, 196, 255, 0)');
      ctx.fillStyle = halo;
      ctx.fillRect(view.x, view.y, view.w, view.h);
    }
    drawFaisceaux(ctx, view, t, { ang: MOON_ANG, tone: '186,202,255', force: 0.42 * k });
    ctx.globalCompositeOperation = 'lighter';
    const brume = nappeBleue();
    for (const T of tuilesOf(view, 120)) {
      const rx = 140 + hash(T.n, 5) * 90;
      const x = T.X + ((hash(T.n, 3) * TUILE + t * (12 + hash(T.n, 4) * 10)) % TUILE);
      const y = T.Y + hash(T.n, 6) * TUILE;
      ctx.globalAlpha = 0.16 * k;
      ctx.drawImage(brume, x - rx, y - rx * 0.28, rx * 2, rx * 0.56);
      for (let i = 0; i < LUCIOLES; i++) {
        const lx = T.X + hash(T.n + i, 7) * TUILE + Math.sin(t * 0.6 + i) * 14;
        const ly = T.Y + hash(T.n + i, 8) * TUILE;
        const z = (hash(T.n + i, 11) * 120 + t * (8 + hash(T.n + i, 13) * 14)) % 120;
        const glow = k * (0.45 + 0.55 * Math.max(0, Math.sin(t * 2.4 + i * 2.1 + T.n)));
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(190, 230, 255, ${(0.18 * glow).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(lx, ly - z, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(235, 250, 255, ${(0.9 * glow).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(lx, ly - z, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }
};
