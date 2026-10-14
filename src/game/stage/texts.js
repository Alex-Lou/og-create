// Les mots de la scène : onomatopées, paliers d'un combo, gains. Ils claquent (un ressort), montent un peu, puis
// s'effacent ; cernés du trait brun de la bibliothèque, pour se lire sur tout.
import { clamp01, outElastic, outBack, lerp } from './ease';

const INK = '#3C2819';

export function createTexts() {
  const list = [];
  return {
    list,
    // spec : { text, x, y, size (px), fill (couleur ou [haut, bas]), font ('ui' ou 'display'), life (ms), rise (px),
    // tilt (rad), pop ('elastic' ou 'back'), delay (ms) }
    add(spec) {
      list.push({ age: -(spec.delay || 0), life: 1100, rise: 26, tilt: 0, pop: 'back', font: 'ui', ...spec });
    },
    update(dt) {
      for (let i = list.length - 1; i >= 0; i--) {
        list[i].age += dt;
        if (list[i].age >= list[i].life) list.splice(i, 1);
      }
    },
    draw(ctx, fonts) {
      for (const w of list) {
        if (w.age < 0) continue;
        const t = clamp01(w.age / w.life);
        const appear = clamp01(w.age / 260);
        const scale = w.pop === 'elastic' ? outElastic(appear) : outBack(appear, 2.4);
        const alpha = t < 0.72 ? 1 : 1 - (t - 0.72) / 0.28;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(w.x, w.y - w.rise * lerp(0, 1, t));
        ctx.rotate(w.tilt);
        ctx.scale(scale, scale);
        ctx.font = `900 ${w.size}px ${w.font === 'display' ? fonts.display : fonts.ui}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        // l'ombre portée, le trait brun, puis la couleur (en dégradé du haut vers le bas)
        ctx.lineWidth = Math.max(3, w.size * 0.2);
        ctx.strokeStyle = 'rgba(60, 40, 25, .35)';
        ctx.strokeText(w.text, 0, w.size * 0.08);
        ctx.strokeStyle = INK;
        ctx.strokeText(w.text, 0, 0);
        const [top, bottom] = Array.isArray(w.fill) ? w.fill : [w.fill, w.fill];
        const g = ctx.createLinearGradient(0, -w.size / 2, 0, w.size / 2);
        g.addColorStop(0, top);
        g.addColorStop(1, bottom);
        ctx.fillStyle = g;
        ctx.fillText(w.text, 0, 0);
        // le reflet en haut des lettres
        ctx.globalAlpha = alpha * 0.35;
        ctx.fillStyle = '#FFFFFF';
        ctx.save();
        ctx.beginPath();
        ctx.rect(-w.size * w.text.length, -w.size, w.size * w.text.length * 2, w.size * 0.62);
        ctx.clip();
        ctx.fillText(w.text, 0, 0);
        ctx.restore();
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    },
    clear() {
      list.length = 0;
    }
  };
}
