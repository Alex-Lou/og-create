// Les bulles au-dessus des bâtiments (production à ramasser) et des habitants (ce qui leur manque). Méthodes de
// WorldView.vue (this : le composant), réunies par draw.js.

import { glyph } from '@/book/painter';
import { GLYPH } from '@/game/resources';
import { missingOf, NEED_GLYPH } from '@/world/needs';
import { TW } from '../constants';

export default {
  // Bulles de production au-dessus des bâtiments : ressource et écus à ramasser, d'un toucher
  drawBubbles(ctx, t, repaint) {
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
      const { w, h } = this.pillAt(ctx, x, y, k, GLYPH[site.produce] || 'ui:spark', `+${amount}`, repaint);
      this.bubbles.push({ site, x, y, w, h });
    }
    this.drawNeedBubbles(ctx, t, repaint);
  },
  // Bulle de production en pastille (ressource et nombre), sa pointe vers le bas : { w, h }
  pillAt(ctx, x, y, k, glyphId, text, repaint) {
    const w = 46 * k;
    const h = 22 * k;
    ctx.save();
    ctx.shadowColor = 'rgba(60, 40, 25, .3)';
    ctx.shadowBlur = 6 * k;
    ctx.shadowOffsetY = 2 * k;
    ctx.fillStyle = '#FFFDF8';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
    else ctx.rect(x - w / 2, y - h / 2, w, h);
    ctx.fill();
    ctx.restore();
    // Pointe vers le bâtiment (ou la bête)
    ctx.fillStyle = '#FFFDF8';
    ctx.beginPath();
    ctx.moveTo(x - 5 * k, y + h / 2 - 1);
    ctx.lineTo(x, y + h / 2 + 6 * k);
    ctx.lineTo(x + 5 * k, y + h / 2 - 1);
    ctx.fill();
    glyph(ctx, glyphId, x - 11 * k, y + 0.5, 14 * k, repaint);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${11 * k}px Nunito, system-ui, sans-serif`;
    ctx.fillStyle = '#4A3426';
    ctx.fillText(text, x + 9 * k, y + 0.5);
    ctx.textBaseline = 'alphabetic';
    return { w, h };
  },
  // Au-dessus d'un habitant à qui il manque quelque chose : une bulle avec ce besoin (la toucher ouvre sa fiche)
  drawNeedBubbles(ctx, t, repaint) {
    this.needBubbles = [];
    if (this.cam.s < 0.55) return;
    for (const h of this.landHits) {
      // Le visiteur : une bulle dorée avec sa demande, tant qu'elle n'est pas comblée
      const guest = h.kind === 'villager' ? this.guestOf(h.who) : null;
      if (guest && !guest.satisfied) {
        const k = 1 / Math.min(1, this.cam.s);
        const r = 11 * k;
        const y = h.y - h.head - r + Math.sin(t * 2.6 + h.x) * 1.5;
        this.bubbleAt(ctx, h.x, y, r, k, '#FFF6D8', '#E2A72E');
        glyph(ctx, guest.request.kind === 'livrer' ? GLYPH[guest.request.resource] : 'ui:spark', h.x, y + 0.5, 14 * k, repaint);
        this.needBubbles.push({ id: guest.id, visitor: true, x: h.x, y, r });
        continue;
      }
      // Une bête de ferme : sa bulle pleine, comme la production d'un bâtiment (on la ramasse d'un toucher), ou sa
      // faim, comme le besoin d'un habitant (sa fiche)
      const beast = this.beastOf(h.who);
      if (beast && (beast.ready || !beast.fed)) {
        const k = 1 / Math.min(1, this.cam.s);
        const r = 10 * k;
        const y = h.y - 8 - r + Math.sin(t * 2.6 + h.x) * 1.5;
        if (beast.ready) {
          const { w } = this.pillAt(ctx, h.x, y, k, GLYPH.food, `+${beast.ready}`, repaint);
          this.needBubbles.push({ beast: beast.id, ready: true, x: h.x, y, r: w / 2 });
        } else {
          this.bubbleAt(ctx, h.x, y, r, k, '#FFF4E5', '#F0A84A');
          glyph(ctx, NEED_GLYPH.manger, h.x, y + 0.5, 13 * k, repaint);
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
      this.bubbleAt(ctx, x, y, r, k, '#FFF4E5', '#F0A84A');
      glyph(ctx, NEED_GLYPH[first.id], x, y + 0.5, 14 * k, repaint);
      this.needBubbles.push({ id: friend.id, need: first.id, x, y, r });
    }
  },
  // Bulle ronde cernée, sa pointe vers le bas (au-dessus d'un habitant)
  bubbleAt(ctx, x, y, r, k, fill, ring) {
    ctx.save();
    ctx.shadowColor = 'rgba(60, 40, 25, .3)';
    ctx.shadowBlur = 5 * k;
    ctx.shadowOffsetY = 2 * k;
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(x - 4 * k, y + r - 2);
    ctx.lineTo(x, y + r + 5 * k);
    ctx.lineTo(x + 4 * k, y + r - 2);
    ctx.fill();
    ctx.strokeStyle = ring;
    ctx.lineWidth = 1.6 * k;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }
};
