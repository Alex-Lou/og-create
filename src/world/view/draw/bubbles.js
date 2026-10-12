// Les bulles au-dessus des bâtiments (production à ramasser) et des habitants (ce qui leur manque). Une même famille
// (world/charte.js) : contour, ombre douce (une lueur dorée la nuit), pointe, petit rebond à l'apparition. Méthodes de
// WorldView.vue (this : le composant), réunies par draw.js.

import { glyph } from '@/book/painter';
import { GLYPH } from '@/game/resources';
import { missingOf, NEED_GLYPH } from '@/world/needs';
import { TINT, font, warm, softShadow, popScale } from '@/world/charte';
import { TW } from '../constants';

export default {
  // Bulles de production au-dessus des bâtiments : ressource et écus à ramasser, d'un toucher
  drawBubbles(ctx, t, repaint, now) {
    this.bubbles = [];
    for (const site of this.state.sites) {
      const made = site.pending;
      if (!made || site.locked || this.raises.has(site.id)) continue;
      const amount = made[site.produce] || 0;
      if (!amount && !made.coins) continue;
      const c = this.centerOf(site);
      const k = 1 / Math.min(1, this.cam.s);
      const bob = Math.sin(t * 2.2 + site.x) * 2.5;
      const x = c.x;
      const y = c.y - TW * (1.55 + (site.w - 2) * 0.8) + bob;
      this.popAt(ctx, `prod:${site.id}`, x, y + 17 * k, now);
      const { w, h } = this.pillAt(ctx, x, y, k, GLYPH[site.produce] || 'ui:spark', `+${amount}`, repaint);
      ctx.restore();
      this.bubbles.push({ site, x, y, w, h });
    }
    this.drawNeedBubbles(ctx, t, repaint, now);
  },
  // Une bulle (ou un « ! ») qui apparaît rebondit depuis sa pointe (x, y) : à fermer par ctx.restore() une fois dessinée
  popAt(ctx, key, x, y, now) {
    const s = this.reduced() ? 1 : popScale(this.bubbleSeen, key, now);
    ctx.save();
    if (s === 1) return;
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.translate(-x, -y);
  },
  // Bulle de production en pastille (ressource et nombre), sa pointe vers le bas : { w, h }
  pillAt(ctx, x, y, k, glyphId, text, repaint) {
    const w = 46 * k;
    const h = 22 * k;
    const night = this.phase ? this.phase.night : 0;
    const fill = warm(TINT.paper, night);
    const shape = () => {
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
      else ctx.rect(x - w / 2, y - h / 2, w, h);
    };
    ctx.save();
    softShadow(ctx, k, night);
    ctx.fillStyle = fill;
    shape();
    ctx.fill();
    ctx.restore();
    // Pointe vers le bâtiment (ou la bête), puis le contour
    this.bubbleTip(ctx, x, y + h / 2, k, fill);
    ctx.strokeStyle = TINT.rim;
    ctx.lineWidth = 1.6 * k;
    shape();
    ctx.stroke();
    glyph(ctx, glyphId, x - 11 * k, y + 0.5, 14 * k, repaint);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font(900, 11 * k);
    ctx.fillStyle = TINT.ink;
    ctx.fillText(text, x + 9 * k, y + 0.5);
    ctx.textBaseline = 'alphabetic';
    return { w, h };
  },
  // Au-dessus d'un habitant à qui il manque quelque chose : une bulle avec ce besoin (la toucher ouvre sa fiche)
  drawNeedBubbles(ctx, t, repaint, now) {
    this.needBubbles = [];
    if (this.cam.s < 0.55) return;
    for (const h of this.landHits) {
      // Le visiteur : une bulle dorée avec sa demande, tant qu'elle n'est pas comblée
      const guest = h.kind === 'villager' ? this.guestOf(h.who) : null;
      if (guest && !guest.satisfied) {
        const k = 1 / Math.min(1, this.cam.s);
        const r = 11 * k;
        const y = h.y - h.head - r + Math.sin(t * 2.6 + h.x) * 1.5;
        this.popAt(ctx, `guest:${guest.id}`, h.x, y + r + 5 * k, now);
        this.bubbleAt(ctx, h.x, y, r, k, TINT.gold100, TINT.gold500);
        glyph(ctx, guest.request.kind === 'livrer' ? GLYPH[guest.request.resource] : 'ui:spark', h.x, y + 0.5, 14 * k, repaint);
        ctx.restore();
        this.needBubbles.push({ id: guest.id, visitor: true, x: h.x, y, r });
        continue;
      }
      // Une bête de ferme : sa bulle pleine, comme la production d'un bâtiment (on la ramasse d'un toucher), ou sa
      // faim, comme le besoin d'un habitant (sa fiche)
      const beast = this.beastOf(h.who);
      // (une poule échappée, au tutoriel : on l'attrape d'abord, on la nourrit ensuite)
      if (beast && this.looseHens.has(beast.id)) continue;
      if (beast && (beast.ready || !beast.fed)) {
        const k = 1 / Math.min(1, this.cam.s);
        const r = 10 * k;
        const y = h.y - 8 - r + Math.sin(t * 2.6 + h.x) * 1.5;
        if (beast.ready) {
          this.popAt(ctx, `beast:${beast.id}:pleine`, h.x, y + 17 * k, now);
          const { w } = this.pillAt(ctx, h.x, y, k, GLYPH.food, `+${beast.ready}`, repaint);
          ctx.restore();
          this.needBubbles.push({ beast: beast.id, ready: true, x: h.x, y, r: w / 2 });
        } else {
          this.popAt(ctx, `beast:${beast.id}:faim`, h.x, y + r + 5 * k, now);
          this.bubbleAt(ctx, h.x, y, r, k, TINT.amber100, TINT.amber500);
          glyph(ctx, NEED_GLYPH.manger, h.x, y + 0.5, 13 * k, repaint);
          ctx.restore();
          this.needBubbles.push({ beast: beast.id, ready: false, x: h.x, y, r });
        }
        continue;
      }
      const friend = h.kind === 'villager' ? this.friendOf(h.who) : null;
      const [first] = friend ? missingOf(friend) : [];
      if (!first) continue;
      const k = 1 / Math.min(1, this.cam.s);
      const r = 11 * k;
      const x = h.x;
      // Juste au-dessus de la tête (le point touché est au milieu du corps)
      const y = h.y - h.head - r + Math.sin(t * 2.6 + h.x) * 1.5;
      this.popAt(ctx, `need:${friend.id}:${first.id}`, x, y + r + 5 * k, now);
      this.bubbleAt(ctx, x, y, r, k, TINT.amber100, TINT.amber500);
      glyph(ctx, NEED_GLYPH[first.id], x, y + 0.5, 14 * k, repaint);
      ctx.restore();
      this.needBubbles.push({ id: friend.id, need: first.id, x, y, r });
    }
  },
  // Bulle ronde cernée, sa pointe vers le bas (au-dessus d'un habitant) ; la nuit, son fond se réchauffe
  bubbleAt(ctx, x, y, r, k, fill, ring) {
    const night = this.phase ? this.phase.night : 0;
    const tone = warm(fill, night);
    ctx.save();
    softShadow(ctx, k, night);
    ctx.fillStyle = tone;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    this.bubbleTip(ctx, x, y + r, k, tone);
    ctx.strokeStyle = ring;
    ctx.lineWidth = 1.6 * k;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  },
  // La pointe d'une bulle, sous son bord (x, edge), vers ce qu'elle désigne
  bubbleTip(ctx, x, edge, k, fill) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x - 4.5 * k, edge - 1.5);
    ctx.lineTo(x, edge + 5.5 * k);
    ctx.lineTo(x + 4.5 * k, edge - 1.5);
    ctx.fill();
  }
};
