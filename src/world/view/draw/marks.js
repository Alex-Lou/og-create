// Les indicateurs « ! » du tutoriel (choix de l'auteur, 11 oct.) : au-dessus de ce qu'il faut toucher pour l'étape, au
// lieu de mener la caméra de force. Une liste : plusieurs pourront en porter un plus tard ; au début du tutoriel, une
// seule cible à la fois, celle du coach (game/coach.js). Hors de l'écran, une flèche au bord la montre. Un toucher sur
// le « ! » vaut un toucher sur ce qu'il marque (gestures.js : markHits). Méthodes de WorldView.vue, réunies par draw.js.

import { coach } from '@/game/coach';
import { TINT, font, softShadow } from '@/world/charte';

// Ce qui porte un « ! » (les trouvailles, les cases à toucher et les bulles ont déjà leur repère)
const MARKED = new Set(['habitant', 'site', 'caisse', 'brume', 'cage', 'poule', 'coin']);
// Marge du bord de l'écran pour la flèche (px), sa taille
const EDGE = 34;
const ARROW_R = 15;

export default {
  // Les cibles marquées : la cible sur l'île de la leçon du coach (son premier geste sur l'île), si elle se marque ; sinon
  // la première bouteille échouée, tant qu'on ne l'a pas ouverte (WorldView chests.js : bottleAshore)
  markTargets() {
    const lesson = coach.state.lesson;
    const step = lesson && lesson.steps.find(st => st.target && st.target.startsWith('île:'));
    const name = step && step.target.slice(4);
    if (name) return MARKED.has(name.split(':')[0]) ? [name] : [];
    return this.bottleFirst ? ['bouteille'] : [];
  },
  // Les « ! » (unités du monde, caméra appliquée), puis les flèches de ceux qui sont hors de l'écran (en pixels)
  drawMarks(ctx, t, dpr, now) {
    this.markHits = [];
    const away = [];
    for (const name of this.markTargets()) {
      const at = this.coachWorld(name);
      if (!at) continue;
      const k = 1 / Math.min(1, this.cam.s);
      const r = 11 * k;
      const y = at.y - at.r - r - 4 + Math.sin(t * 2.6) * 1.5;
      const sp = this.toScreen(at.x, y);
      if (sp.x < 0 || sp.y < 0 || sp.x > this.geo.width || sp.y > this.geo.height) {
        away.push(sp);
        continue;
      }
      this.popAt(ctx, `mark:${name}`, at.x, y + r + 5 * k, now);
      this.bubbleAt(ctx, at.x, y, r, k, TINT.amber100, TINT.amber500);
      ctx.fillStyle = TINT.amber700;
      ctx.font = font(900, 14 * k);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', at.x, y + 0.5);
      ctx.restore();
      this.markHits.push({ name, x: at.x, y, r: r + 6 });
    }
    if (away.length) this.drawMarkArrows(ctx, away, t, dpr);
  },
  // Une flèche au bord de l'écran, vers chaque cible hors de vue : une pastille « ! » et sa pointe tournée vers elle
  drawMarkArrows(ctx, points, t, dpr) {
    const { width, height } = this.geo;
    const cx = width / 2, cy = height / 2;
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (const p of points) {
      const angle = Math.atan2(p.y - cy, p.x - cx);
      const x = Math.max(EDGE, Math.min(width - EDGE, p.x));
      const y = Math.max(EDGE + 40, Math.min(height - EDGE - 70, p.y));
      const pulse = 1 + Math.sin(t * 3.2) * 0.06;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(pulse, pulse);
      softShadow(ctx, 1, this.phase ? this.phase.night : 0);
      ctx.fillStyle = TINT.amber100;
      ctx.beginPath();
      ctx.arc(0, 0, ARROW_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = 'transparent';
      // La pointe, sur le cercle, vers la cible
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(ARROW_R + 9, 0);
      ctx.lineTo(ARROW_R - 1, -7);
      ctx.lineTo(ARROW_R - 1, 7);
      ctx.closePath();
      ctx.fill();
      ctx.rotate(-angle);
      ctx.strokeStyle = TINT.amber500;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, ARROW_R, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = TINT.amber700;
      ctx.font = font(900, 17);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', 0, 0.5);
      ctx.restore();
    }
    ctx.restore();
  }
};
