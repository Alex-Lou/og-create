// La scène d'un mini-jeu : un canvas dessiné à chaque image (60 images/s) tant que quelque chose bouge, comme dans un
// moteur de jeu 2D. Elle porte les particules, les mots qui claquent, la secousse, l'éclair et le ralenti d'un grand
// coup ; le jeu lui donne sa fonction de dessin (draw). Rien ne bouge : la boucle s'endort (un plateau au repos ne
// coûte rien), et le jeu la réveille (wake) au moindre geste. Elle s'arrête aussi quand la page est cachée.
import { createParticles } from './particles';
import { createTexts } from './texts';

const MAX_DPR = 2; // au-delà, le gain ne se voit plus et le téléphone chauffe
const MAX_DT = 50; // une image en retard ne fait pas sauter la scène

// draw(ctx, stage, dt) : le jeu dessine son plateau, et rend vrai si quelque chose y bouge encore ; la scène dessine
// ensuite particules, mots et éclair par-dessus
export function createStage(canvas, draw, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const styles = getComputedStyle(document.documentElement);
  const stage = {
    canvas, ctx, reduced,
    w: 0, h: 0, dpr: 1,
    // le temps de la scène (ms), qui ralentit pendant un arrêt sur image
    t: 0,
    particles: createParticles(),
    texts: createTexts(),
    fonts: { ui: styles.getPropertyValue('--font-ui').trim() || 'sans-serif', display: styles.getPropertyValue('--font-display').trim() || 'serif' },
    // Secousse (px), éclair ({ color, until, ms }), arrêt sur image (jusqu'à, en temps réel)
    quake: 0, flashing: null, frozenUntil: 0,
    shake(power) {
      if (!reduced) stage.quake = Math.max(stage.quake, power);
      stage.wake();
    },
    flash(color, ms = 260) {
      if (!reduced) stage.flashing = { color, from: stage.t, ms };
      stage.wake();
    },
    // Quelque chose va bouger : la boucle repart (à l'image suivante)
    wake() {
      if (!raf && !document.hidden && !gone) raf = requestAnimationFrame(frame);
    },
    freeze(ms) {
      if (!reduced) stage.frozenUntil = performance.now() + ms;
    },
    resize() {
      const rect = canvas.getBoundingClientRect();
      stage.dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      stage.w = rect.width;
      stage.h = rect.height;
      canvas.width = Math.max(1, Math.round(rect.width * stage.dpr));
      canvas.height = Math.max(1, Math.round(rect.height * stage.dpr));
      stage.wake();
    },
    destroy() {
      gone = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisible);
    }
  };

  let raf = 0;
  let last = 0;
  let gone = false;
  const frame = now => {
    raf = 0;
    let dt = Math.min(MAX_DT, last ? now - last : 16);
    last = now;
    // (un arrêt sur image : le temps de la scène passe à un vingtième)
    if (now < stage.frozenUntil) dt *= 0.05;
    stage.t += dt;
    stage.particles.update(dt);
    stage.texts.update(dt);
    stage.quake = stage.quake < 0.3 ? 0 : stage.quake * Math.exp(-dt / 70);

    ctx.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
    ctx.clearRect(0, 0, stage.w, stage.h);
    if (stage.quake) ctx.translate((Math.random() - 0.5) * 2 * stage.quake, (Math.random() - 0.5) * 2 * stage.quake);
    const busy = draw(ctx, stage, dt);
    stage.particles.draw(ctx);
    stage.texts.draw(ctx, stage.fonts, stage.dpr, stage.w, stage.h);
    const f = stage.flashing;
    if (f) {
      const k = (stage.t - f.from) / f.ms;
      if (k >= 1) stage.flashing = null;
      else {
        ctx.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
        ctx.globalAlpha = (1 - k) * 0.55;
        ctx.fillStyle = f.color;
        ctx.fillRect(0, 0, stage.w, stage.h);
        ctx.globalAlpha = 1;
      }
    }
    // (encore quelque chose qui bouge : l'image suivante ; sinon la boucle s'endort, l'horloge repartira de zéro)
    if (busy || stage.particles.list.length || stage.texts.list.length || stage.quake || stage.flashing || now < stage.frozenUntil) raf = requestAnimationFrame(frame);
    else last = 0;
  };
  const onVisible = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    last = 0;
    stage.wake();
  };
  const observer = new ResizeObserver(() => stage.resize());
  observer.observe(canvas);
  document.addEventListener('visibilitychange', onVisible);
  stage.resize();
  return stage;
}
