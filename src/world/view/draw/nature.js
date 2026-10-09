// Le décor fixe d'une case (arbres, fleurs, rochers…) : cuit dans le sol ou dessiné de près, plié au vent. Méthodes de
// WorldView.vue (this : le composant), réunies par draw.js.

import { drawSprite } from '@/world/spriteCache';

// Ce qui plie au vent, et de combien
const SWAY = { tree: 0.04, palm: 0.05, bush: 0.03, tuft: 0.09, flowers: 0.06, birch: 0.05, apple: 0.03, autumn: 0.035, reeds: 0.08, snowpine: 0.02, heather: 0.04 };

export default {
  // Décor fixe d'une case, cuit dans le sol sauf de près (sans le vent ; à demi effacé sous la brume, comme le sol) :
  // vrai si tous ses dessins étaient prêts
  standAt(ctx, x, y) {
    const props = this.propsAt && this.propsAt.get(y * this.state.size + x);
    if (!props) return true;
    const zone = this.zoneAt(x, y);
    ctx.globalAlpha = zone && !zone.owned ? 1 - this.mistFade(0.5, zone) : 1;
    let ready = true;
    for (const prop of props) ready = drawSprite(ctx, prop.key, prop.make, prop.wx, prop.wy) && ready;
    ctx.globalAlpha = 1;
    return ready;
  },
  drawProp(ctx, prop, t, repaint, now, still = false) {
    const c = { x: prop.wx, y: prop.wy };
    const propZone = this.zoneAt(prop.x, prop.y);
    const mist = this.mistOf(propZone, now);
    if (mist) {
      ctx.save();
      ctx.globalAlpha = 1 - this.mistFade(0.5, propZone) * mist;
    }
    this.swayed(ctx, prop.key, prop.make, c.x, c.y, still ? 0 : (SWAY[prop.kind] || 0) * this.windAt(t, prop.x * 0.7 + prop.y), repaint);
    if (mist) ctx.restore();
  }
};
