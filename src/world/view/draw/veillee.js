// La nuit de la veillée (choix de l'auteur, 12 oct. ; game/prologue.js : VEILLEE) : le feu de camp baisse, la nuit se
// fait magie (bleu-violet, la lune qui se lève de l'océan et ses rayons, des nappes de brume qui luisent, des lucioles), les égarés viennent
// buter sur la clôture, puis le feu repart et la nuit redevient la nuit. Méthodes de WorldView.vue (this : le
// composant), réunies par draw.js ; this.veillee ({ from, end } en s : demos.js, guideDemo) la mène.

import { hash } from '@/world/scene';
import { tuilesOf, TUILE } from '@/world/tuiles';

// Le temps de venir et de s'en aller (s) ; les lucioles, par carreau du monde
const FADE_IN = 2.5;
const FADE_OUT = 2.5;
const LUCIOLES = 6;

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
  // Par-dessus la scène, en pixels d'écran (w × h) : la nuit qui vire, et la lune, lointaine (sa lumière garde la même
  // direction quand on se déplace) ; t : le temps de l'animation (0 en mouvement réduit). Ses nappes de brume et ses
  // lucioles, elles, sont posées sur l'île (drawVeilleeMonde)
  drawVeillee(ctx, w, h, t) {
    const k = this.veilleeK();
    if (k <= 0) return;
    ctx.save();
    // La nuit vire au bleu-violet
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = `rgba(78, 64, 160, ${0.6 * k})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    // La lune se lève de l'océan, derrière nous (choix de l'auteur, 12 oct. : « la lune doit venir de l'océan, derrière
    // l'écran, vers l'île et ses rivages, pas au-dessus de l'île ») : on ne voit pas son disque, sous le bas de l'écran,
    // mais son halo qui monte de la mer, le chemin d'argent qu'elle trace sur l'eau jusqu'au rivage, et ses rayons qui
    // remontent doucement vers l'île. (Une lumière si lointaine garde la même direction quand on se déplace : elle suit
    // l'écran, comme le soleil bas)
    const mx = w * 0.56, my = h * 1.18, r = Math.min(w, h) * 0.07;
    const reach = Math.hypot(w, h);
    const halo = ctx.createRadialGradient(mx, my, r, mx, my, h * 0.75);
    halo.addColorStop(0, `rgba(196, 210, 255, ${0.5 * k})`);
    halo.addColorStop(0.45, `rgba(180, 196, 255, ${0.14 * k})`);
    halo.addColorStop(1, 'rgba(180, 196, 255, 0)');
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, w, h);
    // le chemin d'argent sur la mer : de la lune (en bas) vers l'île, plus étroit et plus pâle en s'éloignant
    const path = ctx.createLinearGradient(0, h, 0, h * 0.62);
    path.addColorStop(0, `rgba(214, 226, 255, ${0.16 * k})`);
    path.addColorStop(1, 'rgba(214, 226, 255, 0)');
    ctx.fillStyle = path;
    ctx.beginPath();
    ctx.moveTo(mx - w * 0.16, h);
    ctx.quadraticCurveTo(mx - w * 0.04, h * 0.78, mx, h * 0.62);
    ctx.quadraticCurveTo(mx + w * 0.04, h * 0.78, mx + w * 0.16, h);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      // (vers le haut, en éventail autour de la verticale)
      const a = -Math.PI / 2 + (i - 2) * 0.2 + Math.sin(t * 0.15 + i * 1.7) * 0.05;
      const spread = 0.05 + 0.02 * Math.sin(t * 0.3 + i);
      const beam = ctx.createLinearGradient(mx, my, mx + Math.cos(a) * reach, my + Math.sin(a) * reach);
      beam.addColorStop(0, `rgba(170, 190, 255, ${0.12 * k})`);
      beam.addColorStop(1, 'rgba(170, 190, 255, 0)');
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + Math.cos(a - spread) * reach, my + Math.sin(a - spread) * reach);
      ctx.lineTo(mx + Math.cos(a + spread) * reach, my + Math.sin(a + spread) * reach);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  },
  // Les nappes de brume qui luisent et dérivent, et les lucioles qui montent en scintillant, posées dans le monde (par
  // carreaux : world/tuiles.js), dans sa transformation ; view : le rectangle du monde à l'écran
  drawVeilleeMonde(ctx, view, t) {
    const k = this.veilleeK();
    if (k <= 0) return;
    ctx.save();
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
