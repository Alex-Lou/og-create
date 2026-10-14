// La nuit de la veillée (choix de l'auteur, 12 oct. ; game/prologue.js : VEILLEE) : le feu de camp baisse, la nuit se
// fait magie (bleu-violet, la lune qui se lève de l'océan et ses rayons, des nappes de brume qui luisent, des lucioles), les égarés viennent
// buter sur la clôture, puis le feu repart et la nuit redevient la nuit. Méthodes de WorldView.vue (this : le
// composant), réunies par draw.js ; this.veillee ({ from, end } en s : demos.js, guideDemo) la mène.

import { hash } from '@/world/scene';

// Le temps de venir et de s'en aller (s) ; les lucioles
const FADE_IN = 2.5;
const FADE_OUT = 2.5;
const FIREFLIES = 36;

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
  // Par-dessus la scène, en pixels d'écran (w × h) ; t : le temps de l'animation (0 en mouvement réduit)
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
    // Des nappes de brume qui luisent et dérivent
    for (let i = 0; i < 4; i++) {
      const x = ((hash(i, 3) * w + t * (12 + i * 5)) % (w * 1.4)) - w * 0.2;
      const y = h * (0.42 + i * 0.13);
      const rx = w * (0.35 + hash(i, 5) * 0.2);
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(1, 0.28);
      const mist = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
      mist.addColorStop(0, `rgba(150, 175, 255, ${0.16 * k})`);
      mist.addColorStop(1, 'rgba(150, 175, 255, 0)');
      ctx.fillStyle = mist;
      ctx.fillRect(-rx, -rx, rx * 2, rx * 2);
      ctx.restore();
    }
    // Des lucioles qui montent en scintillant
    for (let i = 0; i < FIREFLIES; i++) {
      const x = (hash(i, 7) * w + Math.sin(t * 0.6 + i) * 14) % w;
      const y = h - ((hash(i, 11) * h + t * (8 + hash(i, 13) * 14)) % h);
      const glow = k * (0.45 + 0.55 * Math.max(0, Math.sin(t * 2.4 + i * 2.1)));
      ctx.fillStyle = `rgba(190, 230, 255, ${0.18 * glow})`;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(235, 250, 255, ${0.9 * glow})`;
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
};
