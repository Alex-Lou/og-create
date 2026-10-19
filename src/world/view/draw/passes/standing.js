// Ce qui se tient debout (draw/loop.js : draw) : le vent sur l'herbe, les ombres portées, puis bâtiments, créations,
// nature, gens et bêtes du plus loin au plus proche, l'air des climats au sol, la poussière des poses, les nuages, la
// petite vie du jour. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.
import { drawCloudShadows } from '@/world/scene';
import { drawSheen, drawShadows, shadowLight, drawAigrettes, drawJungleJour, drawEffetsJour, luneOf, tourbillonsOf, drawTourbillons, tourbillonForce, givreOf, drawGivre, roseeOf, drawRosee, aTourbillons, chaleurOf, drawChaleurEte } from '@/world/lumiere';
import { drawPhareOmbre } from '@/world/phareLumiere';
import { crestOf } from '@/world/rareSprites';
import { spriteGroup } from '@/world/spriteCache';
import { drawGullShadow } from '@/world/sea';
import { climateAt, drawClimatMonde, climatsPresents } from '@/world/climates';
import { shadowOf } from '@/world/fetes';
import { TW, SEA_KINDS } from '../../constants';
import { SEASON } from '@/world/plants';

// Vue de loin (zoom sous FAR_SCALE) : ni masquage par le relief devant ce qui se tient debout (invisible à cette
// taille), ni petits détails du décor ; la très grande île reste fluide
const FAR_SCALE = 0.45;
const SMALL_PROPS = new Set(['tuft', 'flowers', 'shells', 'mushrooms', 'reeds', 'lily', 'stump', 'log', 'driftwood', 'nest', 'caladium', 'fiddlehead', 'orchid']);
const XRAY_ALPHA = 0.2;
// Les sols où l'air tremble aux midis d'été : le sable, les dunes, les chemins (lumiere/saisons.js : drawChaleurEte)
const SABLES = new Set(['s', 'd', 'p']);

export default {
  drawStandingPass({ now, ctx, s, t, date, phase, orage, fetes, view, phare, phareSeen, near, baked, wet, life, golden }) {
    const worldTransform = ctx.getTransform();
    // Le vent sur l'herbe : des vagues de lumière douce (lumiere/vent.js) ; le jour, par beau temps, d'assez près, pas en
    // mouvement réduit, et rien dans un quartier pas encore à soi
    if (s >= 0.45 && !this.reduced()) {
      const k = 0.11 * (1 - phase.night) ** 1.5 * (1 - Math.min(1, phase.weather.rain * 2)) * (1 - phase.weather.cover * 0.5) * Math.min(1, (s - 0.45) / 0.2);
      drawSheen(ctx, this.M, view, t, k, this.lightGate(now));
    }
    // Ombres portées des bâtiments : elles suivent le soleil (et, la nuit, la lune)
    drawShadows(ctx, this.state.sites.filter(site => site.level && !site.locked).map(site => {
      const c = this.centerOf(site);
      const h = Math.max(18, -crestOf(site.id, site.level)[1]);
      // (un bâtiment qui s'élève : son ombre grandit avec lui, depuis celle de son ancien état)
      const raise = this.raises.get(site.id);
      const grow = raise ? shadowOf(now - raise.at, raise.from ? Math.max(18, -crestOf(site.id, raise.from)[1]) / h : 0.35) : 1;
      // (le volume du bâtiment, pas toute son emprise : jardins et chemins n'ont pas d'ombre)
      return { x: c.x, y: c.y, hw: site.w / 2 * 0.48, hh: site.h / 2 * 0.48, h: h * 0.62 * grow };
    }).concat(this.feuxShadows(), this.campShadows()), shadowLight(phase, date, orage));
    // (l'ombre du phare des Anciens, toute sa hauteur, sur son îlot et sur la mer)
    if (phareSeen) drawPhareOmbre(ctx, phare.x, phare.y, shadowLight(phase, date, orage));
    for (const g of life.gulls) drawGullShadow(ctx, g, s);
    // Ce qui se tient debout (bâtiments, créations, nature), du plus loin au plus proche
    // (seulement ce qui est à l'écran ; un grand sprite dépasse vers le haut de son pied)
    const far = s < FAR_SCALE;
    // Le liseré vivant des personnages (lumiere/lisere.js : la lumière qui domine là où chacun se tient, celles de
    // l'image d'avant ; il respire) : de près seulement ; drawCritter le marque, il se pose avant le voile de la nuit
    this.liseres = far ? null : { phase, lune: luneOf(phase, date), lumieres: this.lightSpots || [], t, still: this.reduced(), liste: [] };
    const seenAt = (wx, wy) => wx > view.x - TW * 2.5 && wx < view.x + view.w + TW * 2.5 && wy > view.y - TW * 0.6 && wy < view.y + view.h + TW * 3.2;
    const seen = (x, y) => { const c = this.ground(x, y); return seenAt(c.x, c.y); };
    // (les bâtiments et le camp des personnages ne se montrent pas sous la brume du tutoriel, même à demi : on ne les a
    // pas encore rencontrés, choix de l'auteur, 11 oct. ; le décor, lui, s'y devine)
    const met = (x, y) => !this.hiddenCell(x, y);
    // (qui marche sur l'île : les portes s'ouvrent devant lui, walls.js)
    const crowd = this.critters(t);
    this.swingDoors(t, crowd);
    // (une créature rare ou légendaire sort près de ce qu'on regarde : le petit signe, WorldView, bestiary.js)
    this.signRare(view);
    const standing = [
      ...this.shownSites().filter(site => met(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2)).map(site => ({ depth: site.x + site.y + site.w, site })),
      ...this.crafted.filter(craft => seen(craft.x, craft.y)).map(craft => ({ depth: craft.x + craft.y, craft })),
      ...(this.state.annexes || []).filter(annex => seen(annex.x, annex.y)).map(annex => ({ depth: annex.x + annex.y, annex })),
      // Aperçu de la pose en attente de confirmation (miroir, couleur choisis), en transparence sur sa case dorée
      ...[this.craftGhost, ...this.lineGhosts].filter(Boolean).map(craft => ({ depth: craft.x + craft.y, craft })),
      ...[this.annexGhost].filter(Boolean).map(annex => ({ depth: annex.x + annex.y, annex })),
      // Le camp des naufragés : un élément de 2 × 2 cases se range comme un bâtiment, un objet comme une annexe
      // (la cage d’Agathe qui dérive encore jusqu'au sable : hens.js, driftOf)
      ...(this.state.camp || []).filter(item => seen(item.x, item.y) && met(item.x, item.y)).map(item => this.driftOf(item, t))
        .map(item => ({ depth: item.x + item.y + (item.w > 1 ? item.w : 0), camp: item })),
      ...this.shownLandmarks.filter(landmark => seen(landmark.x, landmark.y)).map(landmark => ({ depth: landmark.x + landmark.y, landmark })),
      // Le fanal de la Route des feux, juste devant son lieu (draw/feux.js)
      ...this.feuxSeen(view).map(feu => ({ depth: feu.x + feu.y + 0.05, feu })),
      ...this.groundFinds.filter(deposit => seen(deposit.x, deposit.y)).map(deposit => ({ depth: deposit.x + deposit.y, deposit })),
      ...this.state.sites.filter(site => site.level && site.produce && !site.locked).map(site => ({ site, at: this.reserveAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, reserve: site })),
      ...this.state.sites.filter(site => site.sign && !site.locked).map(site => ({ site, at: this.nameSignAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, nameSign: site })),
      ...(baked ? this.liveProps : this.nearProps || this.props).filter(prop => seenAt(prop.wx, prop.wy) && !(far && SMALL_PROPS.has(prop.kind))).map(prop => ({ depth: prop.depth, prop })),
      ...[...crowd, ...life.standing].filter(critter => seen(critter.x, critter.y))
        .map(critter => ({ depth: critter.depth ?? critter.x + critter.y, critter })),
      ...this.ferryItems(t),
      // Le phare des Anciens, au milieu de son îlot (3 × 3 cases : rangé derrière ce qui se tient devant lui)
      ...(phareSeen ? [{ depth: phare.gx + phare.gy + 1.5, phare: true }] : []),
      ...this.state.map.zones.filter(zone => !zone.owned && this.signShown(zone)).map(zone => ({ zone, at: this.signPlaceOf(zone) }))
        .filter(sign => sign.at && seen(sign.at.x, sign.at.y)).map(sign => ({ depth: sign.at.x + sign.at.y, sign }))
    ].sort((p, q) => p.depth - q.depth);
    this.signs = [];
    const repaint = this.repaintSoon;
    // Pendant une pose (choix de l'auteur, 15 oct. : on doit voir où l'on pose) : ce qui se tient devant une case dorée
    // ou une case du trait s'efface presque, et ces cases se redessinent par-dessus tout, relief compris (drawGoldenOver)
    const xray = golden && !far ? this.xrayOf([...golden.spots, ...(this.craftTrace ? this.craftTrace.cells : [])]) : null;
    // L'air des climats, dans le monde et sur leur terrain seulement (climates.js) : d'abord ce qui reste au ras du sol
    // (nappes du marais, chaleur des dunes), derrière ce qui se tient debout ; pas en mouvement réduit
    const zones = this.state.map.zones;
    const climatOf = (x, y) => { const c = this.cellAt(x, y); return climateAt(this.M, zones, c.x, c.y); };
    // (rien à chercher tant qu'aucun quartier connu n'a de climat qui remplit l'air)
    const climats = !this.reduced() && climatsPresents(zones);
    if (climats) drawClimatMonde(ctx, 'sol', view, t, climatOf, phase.night, s);
    // En hiver, les nuits claires givrent l'herbe : elle pâlit et des éclats y scintillent, au sol ; le givre fond dans la
    // matinée (lumiere/saisons.js ; l'herbe : celle de la lueur du vent, vent.js)
    // (au printemps, la rosée des matins : ses éclats seulement)
    // (en été, aux heures chaudes, l'air tremble au ras du sable et des chemins ; pas en mouvement réduit)
    const chaleur = this.reduced() ? 0 : chaleurOf(phase, SEASON);
    if (chaleur > 0.02) {
      drawChaleurEte(ctx, view, t, chaleur, (x, y) => {
        const c = this.cellAt(x, y), cx = Math.round(c.x), cy = Math.round(c.y);
        return SABLES.has(this.M.ground(cx, cy)) && !this.hiddenCell(cx, cy);
      });
    }
    const givre = givreOf(phase, SEASON), rosee = roseeOf(phase, SEASON);
    if (givre > 0.02 || rosee > 0.02) {
      const gate = this.lightGate(now), tg = this.reduced() ? 0 : t;
      drawGivre(ctx, this.M, view, tg, givre, gate);
      drawRosee(ctx, this.M, view, tg, rosee, gate);
    }
    for (const item of standing) {
      // (groupe de ses dessins, pour le chargement de l'île)
      spriteGroup(item.critter || item.ferry ? 'vivants' : item.prop ? 'decor' : 'batiments');
      const front = xray && this.frontCellOf(item);
      const faded = Boolean(front && xray(front.x, front.y));
      if (faded) {
        ctx.save();
        ctx.globalAlpha *= XRAY_ALPHA;
      }
      if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
      else if (item.craft) {
        this.drawCraft(ctx, item.craft, t, now, repaint);
        if (!far) this.occlude(ctx, item.craft.x, item.craft.y, baked);
      } else if (item.annex) {
        this.drawAnnex(ctx, item.annex, t, now, repaint);
        if (!far) this.occlude(ctx, item.annex.x, item.annex.y, baked);
      } else if (item.camp) {
        this.drawCamp(ctx, item.camp, t, repaint);
        // (la cage d’Agathe qui dérive est entre deux cases : sa case la plus proche)
        if (!far) this.occlude(ctx, Math.round(item.camp.x + item.camp.w - 1), Math.round(item.camp.y + item.camp.h - 1), baked);
      } else if (item.landmark) {
        this.drawLandmark(ctx, item.landmark, t, now, repaint);
        if (!far) this.occlude(ctx, item.landmark.x, item.landmark.y, baked);
      } else if (item.feu) {
        this.drawFeu(ctx, item.feu, t, now, phase, repaint);
      } else if (item.phare) {
        this.drawPhare(ctx, t, date, wet, repaint);
      } else if (item.deposit) {
        this.drawDeposit(ctx, item.deposit, t, now, repaint);
        if (!far) this.occlude(ctx, item.deposit.x, item.deposit.y, baked);
      } else if (item.prop) {
        this.drawProp(ctx, item.prop, t, repaint, now, !near);
        if (!far) this.occlude(ctx, item.prop.x, item.prop.y, baked);
      } else if (item.nameSign) this.drawNameSign(ctx, item.nameSign, t, repaint);
      else if (item.reserve) this.drawReserve(ctx, item.reserve, t, repaint);
      else if (item.sign) this.drawSign(ctx, item.sign, t, repaint);
      else if (item.ferry) this.drawFerry(ctx, item.ferry, repaint);
      else {
        // (sous les pas de qui marche : sable, poussière, gouttes ; d'assez près, pas en mouvement réduit : draw/pas.js)
        if (!far && s >= 0.6 && !this.reduced()) this.drawPas(ctx, item.critter, t);
        this.drawCritter(ctx, item.critter, repaint);
        if (!far && !SEA_KINDS.has(item.critter.kind)) {
          this.occlude(ctx, Math.round(item.critter.x), Math.round(item.critter.y), baked);
          if (baked) this.standInFront(ctx, item.critter);
        }
      }
      if (faded) ctx.restore();
    }
    if (xray) this.drawGoldenCells(ctx, golden, view, t, s, true);
    // (la boucle suggérée d'un trait, les cases refusées : par-dessus tout)
    if (golden) {
      this.drawLoopHint(ctx, view, t, s);
      this.drawRefused(ctx, view, s);
    }
    // La brume d'une découverte, la poussière d'une pose (world/fetes.js)
    this.drawFetesGround(ctx, fetes, now);
    // Ombres des nuages qui glissent sur l'île, par-dessus le sol et ce qui s'y tient
    drawCloudShadows(ctx, this.terrain.bounds, t, phase);
    // Brume vivante qui dérive au-dessus des terres voilées
    this.drawWisps(ctx, t, now, view);
    this.drawSmoke(ctx, t, phase);
    // Les aigrettes de pissenlit que le vent emporte, le jour (lumiere/petiteVie.js ; pas en mouvement réduit)
    if (!this.reduced()) drawAigrettes(ctx, view, t, phase, s);
    // Les papillons morpho, les libellules et le pollen de la jungle du départ, le jour (lumiere/jungle.js ; pas en
    // mouvement réduit)
    if (!this.reduced()) drawJungleJour(ctx, this.M, view, t, phase, this.lightGate(now));
    // (et les effets de l'arbre du voyageur et de l'alocasia : le reflet sur l'éventail, la rosée)
    const effets = this.reduced() || !this.jungleFx ? [] : this.jungleFx.filter(prop => seenAt(prop.wx, prop.wy));
    if (effets.length) drawEffetsJour(ctx, effets, t, phase, prop => this.plantAlpha(prop));
    // En automne et au printemps, à chaque rafale qui passe sur la terre à soi (là où poussent les arbres ; pas sous la
    // brume d'un quartier), une poignée de feuilles ou de pétales tournoie et file avec le vent (lumiere/saisons.js ; pas
    // en mouvement réduit)
    if (aTourbillons(SEASON) && !this.reduced()) {
      const surTerre = (x, y) => {
        const c = this.cellAt(x, y), cx = Math.round(c.x), cy = Math.round(c.y);
        return this.M.land(cx, cy) && !this.lockedAt(cx, cy) && !this.hiddenCell(cx, cy);
      };
      drawTourbillons(ctx, tourbillonsOf(view, t, tourbillonForce(phase, s), surTerre), SEASON);
    }
    return { worldTransform, seenAt, seen, repaint, climatOf, climats, effets };
  }
};
