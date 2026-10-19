// Le sol (draw/loop.js : draw) : le relief en carrés, l'eau douce, la météo au sol, l'écume, la vie de la mer, les
// chantiers, les poses, les chemins et la brume qui se lève. Méthodes de WorldView.vue (this : le composant), réunies
// par draw.js.
import { rainFelt, drawWetGround, puddlesOf, drawPuddles, drawRipples, rippleSpotsOf, neigeAuSol, drawNeigeSol, drawGlace } from '@/world/lumiere';
import { drawLace } from '@/world/rivage';
import { spriteGroup } from '@/world/spriteCache';
import { drawWaves, drawRings, shoreEdges, drawEmbruns } from '@/world/sea';
import { FLOATING_ZONE, drawSpring } from '@/world/islets';
import { drawLive, pavedAt, NEAR_BAKE } from '@/world/terrain';
import { drawFresh } from '@/world/eauDouce';
import { gridWanted } from '@/world/perf';
import { drawTerreBattue } from '@/world/terreBattue';
import { TW, TH, NEAR_SCALE, PAN_SCALE } from '../../constants';
import { SEASON } from '@/world/plants';

export default {
  drawGroundPass({ now, ctx, dpr, s, t, date, phase, flash, view, arc, water, agite, geant, kraken }) {
    // Sol en relief, en carrés gardés en images (les nouveaux dans un budget de 8 ms) ; puis l'eau douce qui bouge,
    // les vagues et l'écume devant l'île, les ronds dans l'eau des dauphins et de la baleine
    // (avec le décor fixe cuit dedans, sauf de près)
    const near = s >= NEAR_SCALE;
    const baked = !near;
    // (le décor cuit dans le sol compte avec le décor, pendant le chargement de l'île)
    spriteGroup('decor');
    // (pendant que la caméra du conseil glisse vers le phare ou en revient, le sol se peint au plus à PAN_SCALE : ses
    // carrés, préparés pendant qu'on lit le conseil, suivent sans à-coups ; WorldView, phare.js)
    const missing = this.terrain.draw(ctx, view, this.flightPan ? Math.min(s * dpr, PAN_SCALE) : s * dpr, 8, baked || NEAR_BAKE);
    if (gridWanted()) this.drawGrid(ctx, view);
    drawLive(ctx, this.M, water.live, view, t);
    // L'eau douce vivante : poissons, lumière au fond, courant, cascades, bonds
    // La météo au sol (le mouillé, la neige, les flaques, la glace) va partout où la terre se voit, même à travers un
    // peu de brume (le Voile léger, le cœur que le tutoriel n'a pas encore levé) ; rien sous la brume épaisse, jusqu'à
    // la découverte du quartier (choix de l'auteur)
    const visible = (x, y) => (this.zoneThick(this.zoneAt(x, y)) ? 0 : 1);
    // (en hiver, les mares sont prises en glace : leur eau, ses poissons et sa lumière au fond disparaissent dessous ;
    // les rivières et la mer coulent toujours)
    const gel = SEASON === 'hiver';
    const prise = c => c.mare && visible(c.x, c.y) > 0;
    const eau = gel ? { ...water.fresh, cells: water.fresh.cells.filter(c => !prise(c)), fish: water.fresh.fish.filter(f => !prise(f)) } : water.fresh;
    drawFresh(ctx, this.M, water.live, eau, view, t, (1 - phase.night * 0.85) * (1 - phase.weather.cover * 0.6), this.reduced());
    const wet = this.wetOf(date);
    if (gel) drawGlace(ctx, this.fresh.cells, view, neigeAuSol(wet, SEASON), visible);
    // L'averse : les flaques du sol mouillé (elles sèchent après la pluie), puis les ronds de la pluie sur l'eau
    // (les flaques se placent une fois par île, les ronds avec les eaux dégagées ; le mouillé se recalcule une fois par
    // minute)
    const rainK = rainFelt(phase.weather.rain, t);
    if (wet > 0.04 || rainK > 0.03) {
      if (!this.rainSpots || this.rainSpots.fresh !== this.fresh) this.rainSpots = { fresh: this.fresh, puddles: puddlesOf(this.M) };
      if (this.rainSpots.water !== water) Object.assign(this.rainSpots, { water, spots: rippleSpotsOf(water.fresh.cells, water.shallow[0]) });
      // le sol mouillé fonce et ses chemins luisent, sous les flaques (lumiere/mouille.js)
      drawWetGround(ctx, this.M, view, wet, t, visible);
      // l'hiver, la neige tombée reste au sol, puis fond case après case ; de près, ses dessins sous le décor
      // (lumiere/saisons.js)
      drawNeigeSol(ctx, this.M, view, neigeAuSol(wet, SEASON), visible, near);
      // (en hiver, les flaques sont gelées et la neige ne fait pas de ronds ; sous la pluie, les flaques ont les leurs)
      // (ni flaque sur le pavé : terrain.js, pavedAt)
      drawPuddles(ctx, this.rainSpots.puddles, view, wet, p => visible(p.x, p.y) > 0 && !pavedAt(this.M, p.x, p.y), { flash, arc }, { gel, pluie: rainK > 0.03, t });
      if (!gel) drawRipples(ctx, this.rainSpots.spots, view, t, rainK, this.fxQ);
    }
    if (this.owns(this.state, FLOATING_ZONE)) drawSpring(ctx, this.islets.spring, view, t);
    drawWaves(ctx, water.live.shore, view, t, true, agite);
    drawLace(ctx, shoreEdges(water.live.shore, view, t), t);
    // Les embruns quand la vague frappe la côte : rares et petits par calme, partout et hauts dans l'orage (pas en
    // mouvement réduit)
    if (!this.reduced()) drawEmbruns(ctx, water.live.shore, view, t, 0.15 + 0.85 * agite);
    const life = this.seaLife(t, view, phase);
    // (le Géant et le Kraken se touchent aussi : ils entrent au Bestiaire)
    if (geant || kraken) this.seaHits.push(...this.legendHits(geant, kraken));
    drawRings(ctx, life.rings);
    // Sol des chantiers : terre battue (bâti) ou chantier, une tache par emprise qui se fond dans le sol autour
    // (terreBattue.js) ; cases libres pendant un déplacement ; case choisie
    for (const site of this.shownSites()) drawTerreBattue(ctx, site, this.centerOf(site), TW, TH);
    // L'intérieur des enclos fermés, d'une lueur chaude (WorldView, enclosures.js)
    this.drawPens(ctx, view, t);
    // Pose d'une annexe ou d'une création : les cases autorisées battent en doré, la case choisie est cerclée. Contour
    // net (un trait sombre sous un trait doré : lisible sur le sable, la neige et la lande) ; un losange clair part du
    // centre de chaque case et s'efface (sauf en mouvement réduit)
    // (un seul niveau à la fois, plateau ou sol : poseLevel.js)
    const golden = this.annexPlacing && this.placingSite ? { spots: this.poseSpots(this.annexSpots), chosen: this.annexConfirm }
      : this.craftPlacing ? { spots: this.poseSpots(this.craftSpots), chosen: this.craftConfirm }
        : this.siteMoving ? { spots: this.poseSpots(this.siteMoving.spots), chosen: this.siteMoveConfirm } : null;
    // (un bâtiment qu'on déplace : sa future emprise, 3 × 3, en blanc doré sous la case choisie)
    for (const cell of this.siteMoveCells()) {
      const c = this.ground(cell.x, cell.y);
      this.diamond(ctx, c.x, c.y, TW, TH);
      ctx.fillStyle = 'rgba(255, 244, 200, .42)';
      ctx.fill();
    }
    if (golden) this.drawGoldenCells(ctx, golden, view, t, s, false);
    // Le tracé d'un chemin (aperçu), les cases qui se creusent (roads.js)
    this.drawRoads(ctx, t, s);
    if (this.craftMenu) {
      const c = this.ground(this.craftMenu.x, this.craftMenu.y);
      this.diamond(ctx, c.x, c.y, TW, TH);
      ctx.strokeStyle = '#F2C04B';
      ctx.lineWidth = 2.5 / s;
      ctx.stroke();
    }
    // Contour des chantiers : pointillés à bâtir, doré quand tout est prêt
    for (const site of this.shownSites()) {
      if (site.locked) continue;
      const c = this.centerOf(site);
      this.diamond(ctx, c.x, c.y, TW * site.w, TH * site.h);
      const ready = this.canBuild(site);
      if (ready || !site.level) {
        ctx.setLineDash(ready ? [] : [6, 5]);
        ctx.strokeStyle = ready ? `rgba(245, 195, 68, ${0.6 + 0.4 * Math.sin(t * 3)})` : 'rgba(90, 60, 30, .55)';
        ctx.lineWidth = ready ? 3 : 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
      if (this.site && this.site.id === site.id) {
        ctx.strokeStyle = '#F2C04B';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }
    }
    // Brume qui se lève sur le quartier qu'on vient d'acheter (la brume des autres est peinte dans le sol)
    for (const id of [...this.unveils.keys()]) {
      const unveiled = this.state.map.zones.find(z => z.id === id);
      const mist = this.mistOf(unveiled, now);
      if (!mist) continue;
      ctx.fillStyle = `rgba(236, 238, 242, ${((this.thickMist() ? 0.9 : 0.62) * mist).toFixed(3)})`;
      for (const [x, y] of this.zoneTiles.get(id) || []) {
        const c = this.ground(x, y);
        this.diamond(ctx, c.x, c.y, TW + 1, TH + 1);
        ctx.fill();
      }
    }
    // Carrés de sol encore à préparer : une image de plus, même sans boucle d'animation (pas sous une scène)
    if (missing && !this.raf && !this.moreRaf && !this.covered) {
      this.moreRaf = requestAnimationFrame(() => {
        this.moreRaf = 0;
        this.draw(performance.now());
      });
    }
    return { near, baked, missing, wet, rainK, life, golden };
  }
};
