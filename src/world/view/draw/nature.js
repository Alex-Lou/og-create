// Le décor fixe d'une case (arbres, fleurs, rochers…) : cuit dans le sol ou dessiné de près, plié au vent. Méthodes de
// WorldView.vue (this : le composant), réunies par draw.js.

import { drawSprite } from '@/world/spriteCache';
import { leavesOf, leafTones, drawLeaves, LEAFY, drawTapis, aTapis } from '@/world/lumiere';
import { SEASON } from '@/world/plants';

// Ce qui prend le liseré doré de l'heure dorée (les arbres et les buissons ; les petites plantes, non)
const RIMMED = new Set(['tree', 'palm', 'bush', 'birch', 'apple', 'autumn', 'snowpine', 'banana', 'treefern', 'kapok', 'monstera', 'ravenala', 'alocasia']);
// Ce qui plie au vent, et de combien
const SWAY = { tree: 0.04, palm: 0.05, bush: 0.03, tuft: 0.09, flowers: 0.06, birch: 0.05, apple: 0.03, autumn: 0.035, reeds: 0.08, snowpine: 0.02, heather: 0.04,
  banana: 0.05, treefern: 0.04, kapok: 0.025, monstera: 0.03, heliconia: 0.05, croton: 0.04, caladium: 0.05,
  bromelia: 0.02, fiddlehead: 0.07, orchid: 0.08,
  ravenala: 0.03, alocasia: 0.04 };

export default {
  // Décor fixe d'une case, cuit dans le sol sauf de près (sans le vent ; à demi effacé sous la brume, comme le sol) :
  // vrai si tous ses dessins étaient prêts
  standAt(ctx, x, y) {
    const props = this.propsAt && this.propsAt.get(y * this.state.size + x);
    if (!props) return true;
    const zone = this.zoneAt(x, y);
    ctx.globalAlpha = this.hiddenCell(x, y) ? 0.1 : zone && !zone.owned ? 1 - this.mistFade(0.5, zone) : 1;
    let ready = true;
    for (const prop of props) ready = drawSprite(ctx, prop.key, prop.make, prop.wx, prop.wy) && ready;
    ctx.globalAlpha = 1;
    return ready;
  },
  drawProp(ctx, prop, t, repaint, now, still = false) {
    const c = { x: prop.wx, y: prop.wy };
    const propZone = this.zoneAt(prop.x, prop.y);
    // (une case du cœur encore sous la brume : comme sous la brume épaisse)
    const mist = this.hiddenCell(prop.x, prop.y) ? 1 : this.mistOf(propZone, now);
    if (mist) {
      ctx.save();
      ctx.globalAlpha = 1 - (this.hiddenCell(prop.x, prop.y) ? 0.9 : this.mistFade(0.5, propZone)) * mist;
    }
    // (en automne un tapis de feuilles rousses à son pied, au printemps de pétales, dessiné juste avant lui :
    // lumiere/saisons.js)
    if (aTapis(SEASON) && LEAFY.has(prop.kind)) drawTapis(ctx, SEASON, c.x, c.y, prop.x, prop.y);
    this.swayed(ctx, prop.key, prop.make, c.x, c.y, still ? 0 : (SWAY[prop.kind] || 0) * this.windOf(t, prop.x, prop.y), repaint, undefined, RIMMED.has(prop.kind));
    // les feuilles (ou les pétales) qu'une rafale arrache aux feuillus, selon la saison (de près, pas en mouvement
    // réduit, pas sous la brume ; rien en hiver)
    if (!still && !mist && LEAFY.has(prop.kind) && leafTones(SEASON) && !this.reduced()) drawLeaves(ctx, SEASON, leavesOf(c.x, c.y, prop.x, prop.y, t));
    if (mist) ctx.restore();
  },
  // Ce qu'une plante laisse voir d'elle (0 sous la brume d'une case cachée, à demi sous celle d'un quartier pas à soi)
  plantAlpha(prop) {
    if (this.hiddenCell(prop.x, prop.y)) return 0;
    const zone = this.zoneAt(prop.x, prop.y);
    return zone && !zone.owned ? 1 - this.mistFade(0.5, zone) : 1;
  },
  // La nuit, la jungle luit (choix de l'auteur, 18 oct. : les couleurs néon de ses références le soir et la nuit) : les
  // lueurs de chaque plante (ses nervures, ses fleurs), à mesure que la nuit tombe, par-dessus l'obscurité (loop.js, en
  // « lighter ») ; à demi sous la brume comme elle ; pliées au vent comme elle, de près
  drawLueursJungle(ctx, props, t, night, near, repaint) {
    if (night < 0.02) return;
    for (const prop of props) {
      const a = this.plantAlpha(prop);
      if (a < 0.02) continue;
      ctx.globalAlpha = night * a;
      this.swayed(ctx, prop.glow.key, prop.glow.make, prop.wx, prop.wy, near ? (SWAY[prop.kind] || 0) * this.windOf(t, prop.x, prop.y) : 0, repaint);
    }
    ctx.globalAlpha = 1;
  }
};
