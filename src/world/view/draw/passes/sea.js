// Sous le sol (draw/loop.js : draw) : reflets, vagues derrière l'île, bancs, eaux peu profondes, chemin du soleil,
// reflets du phare et des feux, le Géant et le Kraken. Méthodes de WorldView.vue (this : le composant), réunies par
// draw.js.
import { drawRefletArc, refletOf, cielDe, drawFilante, haloOf, drawHalo } from '@/world/lumiere';
import { drawCaustics, drawGlitter, glitterOf } from '@/world/rivage';
import { refletDuPhare, drawPhareReflet } from '@/world/phareLumiere';
import { phareRefletImage } from '@/world/decorArt';
import { drawGeant, drawKraken, bancsOf, drawBancs, drawEclatsBancs, drawBoule } from '@/world/faune';
import { drawSparkles, drawWaves, drawShallows, drawRefletsMer, drawMoutons, agitationOf } from '@/world/sea';
import { drawFloatBelow } from '@/world/islets';
import { freshOf } from '@/world/eauDouce';
import { TW } from '../../constants';

export default {
  drawSeaPass({ now, ctx, s, t, date, phase, orage, view, arc, arcGeo, ciel, file }) {
    // Sous le sol : reflets, vagues qui arrivent derrière l'île, bancs de poissons, puis les eaux peu profondes par-dessus
    // (la terre les recouvre)
    // (sous la brume, rien ne vit ni ne bouge dans l'eau : seules les eaux dégagées s'animent, WorldView terrain.js,
    // waterSeen ; le courant de l'eau douce se calcule une fois par île)
    if (!this.fresh || this.fresh.live !== this.live) this.fresh = { live: this.live, ...freshOf(this.M, this.live) };
    const water = this.waterSeen();
    // Reflets du soleil sur l'eau : pas la nuit, ni sous un ciel couvert
    drawSparkles(ctx, view, t, Math.max(phase.night, phase.weather.cover * 0.85), s);
    // (l'état de la mer suit le temps du jeu, et chaque jour sa houle : houle, moutons, embruns, reflets plus brisés :
    // sea.js)
    const agite = agitationOf(phase.weather, date);
    drawWaves(ctx, water.live.back, view, t, false, agite);
    // Les bancs (faune/bancs.js) : ceux qu'on vient de toucher fusent, celui de la boule de sardines se ramasse (pas en
    // mouvement réduit)
    const boule = this.reduced() ? null : this.bouleOf(t, view);
    const bancs = bancsOf(water.schools, t, k => (this.scared.get(`school:${k}`) || {}).at, boule);
    drawBancs(ctx, bancs, view, phase.night);
    drawShallows(ctx, water.shallow, view, phase.night);
    drawEclatsBancs(ctx, bancs, phase.night);
    // La lumière qui danse au fond des eaux peu profondes, puis le chemin du soleil, de la lune ou de l'éclair (posé
    // sur la mer : il suit la caméra, comme les reflets), et le reflet de l'arc-en-ciel qui ondule
    drawCaustics(ctx, water.shallow, view, t, (1 - phase.night * 0.85) * (1 - phase.weather.cover * 0.6));
    drawGlitter(ctx, view, t, phase, date, s, this.terrain.bounds, orage);
    // (les nuits voilées, la lune assez pleine : son halo, un grand anneau pâle sur la mer au bout de son chemin ; immobile
    // en mouvement réduit : lumiere/aurore.js)
    drawHalo(ctx, view, this.reduced() ? 0 : t, haloOf(phase, date), this.terrain.bounds, agite);
    // Les moutons du large quand la mer forcit ; la nuit, les lumières du rivage qui se reflètent sur l'eau (celles de
    // l'image d'avant ; la terre, par-dessus, cache ce qui ne tombe pas sur la mer)
    drawMoutons(ctx, view, t, agite, (x, y) => { const c = this.cellAt(x, y); return !this.M.land(Math.round(c.x), Math.round(c.y)) && water.clear(c); });
    drawRefletsMer(ctx, this.lightSpots, view, t, phase.night, agite);
    if (arcGeo) drawRefletArc(ctx, this.geo, ctx.getTransform(), arcGeo, arc, now - this.arcBorn, t, this.reduced());
    // Le reflet du phare des Anciens sur la mer, sous son îlot (la terre le cache où elle passe), teinté du ciel
    const phare = this.phareSpot();
    const phareSeen = phare && phare.x > view.x - TW * 4 && phare.x < view.x + view.w + TW * 4 && phare.y - TW * 8 < view.y + view.h && phare.y + TW * 7 > view.y;
    if (phareSeen) {
      const img = phareRefletImage(this.phareLook(date, this.wetOf(date)).vide, this.reduced() ? 0 : t, this.repaintSoon);
      if (img) drawPhareReflet(ctx, img, phare.x, phare.y, refletDuPhare(phase, glitterOf(phase, date), orage, this.wetOf(date)), this.reduced() ? 0 : t);
    }
    this.drawCampReflets(ctx, view, phase, date, t, orage);
    // (le reflet de l'étoile filante, sur la mer : dans le monde, son ciel figé à son départ)
    if (file) drawFilante(ctx, cielDe(file.cycle, view), refletOf(file), ciel, t);
    // Le Géant des profondeurs glisse sous la mer (faune/geant.js ; pas en mouvement réduit) ; ses lueurs de nuit et son
    // geyser, après la carte de lumière
    const geant = this.reduced() ? null : this.geantOf(t, view);
    if (geant) drawGeant(ctx, geant, t, phase.night);
    // Le Kraken au large (faune/kraken.js ; pas en mouvement réduit) : son ombre, ses bulles, son œil ; ses bras hors de
    // l'eau, puis ses lueurs de nuit, plus loin
    const kraken = this.reduced() ? null : this.krakenOf(t, view, phase);
    // (dans l'orage, à la lueur d'un éclair, un de ses bras entrevu au large : pas en mouvement réduit)
    const apercu = this.reduced() ? null : this.apercuOf(t, view, phase);
    // Le vol du Phénix (draw/brume.js : phenixOf) ; il se dessine à la place de Brume, et éclaire le sol sous lui
    this.phenix = this.reduced() ? null : this.phenixOf(t, view, phase);
    if (kraken) drawKraken(ctx, kraken, t, phase.night);
    // La boule de sardines bouillonne à la surface
    drawBoule(ctx, boule, t, phase.night);
    drawFloatBelow(ctx, this.islets.float, view, t, phase.night);
    return { water, agite, bancs, phare, phareSeen, geant, kraken, apercu };
  }
};
