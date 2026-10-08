// La boucle d'animation et le dessin d'une image de l'île : le sol, la mer, ce qui se tient debout trié par profondeur,
// le relief qui cache le pied, la case sous un point du monde. Méthodes de WorldView.vue (this : le composant), réunies
// par draw.js.

import { drawSea, drawCloudShadows, drawClouds, drawTint, drawWeather } from '@/world/scene';
import { setSpriteDetail, drawSprite, drawSpriteIn, imageOf, spriteGroup } from '@/world/spriteCache';
import { flyingGull } from '@/world/beastArt';
import { drawSparkles, drawWaves, drawSchools, schoolFish, drawShallows, drawRings, drawGullShadow, drawFlyingGull, drawPlankton, drawJellies } from '@/world/sea';
import { drawFloatBelow, FLOATING_ZONE, drawSpring } from '@/world/islets';
import { drawLive, drawCell, SEA_Z, HS } from '@/world/terrain';
import { mixToward, climateAt, drawClimate } from '@/world/climates';
import { TW, TH, SEA_KINDS } from '../constants';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
// Pendant son chargement (loading.js), l'île, cachée par l'écran de chargement, ne se dessine que pour compter ses
// dessins : quatre fois par seconde, et le fil principal va à la lecture des dessins (redessiner l'île cachée à chaque
// image en prenait près de la moitié sur un téléphone lent)
const LOADING_FRAME_MS = 250;
// Vue de loin (zoom sous FAR_SCALE) : ni masquage par le relief devant ce qui se tient debout (invisible à cette
// taille), ni petits détails du décor ; la très grande île reste fluide
const FAR_SCALE = 0.45;
// De près seulement (zoom dès NEAR_SCALE), le décor fixe se dessine à chaque image et plie au vent ; plus loin, il est
// cuit dans les carrés du sol (sauf près de ce qui se tient debout : il doit pouvoir passer devant)
const NEAR_SCALE = 0.9;
const SMALL_PROPS = new Set(['tuft', 'flowers', 'shells', 'mushrooms', 'reeds', 'lily', 'stump', 'log', 'driftwood', 'nest']);

export default {
  /* ---------- Boucle et dessin ---------- */
  syncLoop() {
    const run = !document.hidden && !this.reduced() && this.state && !this.guest && !this.run && !this.gameId;
    if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
    if (!run && this.raf) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
  },
  frame(now) {
    this.raf = 0;
    if (now - this.lastFrame >= (this.loadingSince ? LOADING_FRAME_MS : FRAME_MS)) {
      this.lastFrame = now;
      const start = this.perf ? performance.now() : 0;
      this.draw(now);
      if (this.perf) {
        this.perf.frame(now, performance.now() - start);
        const text = this.perf.text(now, this.cam ? this.cam.s : 0);
        if (text) this.perfText = text;
      }
    }
    this.syncLoop();
  },
  // Le doigt bouge (glisser, pincer, zoomer, tracer) : un seul dessin à l'image suivante, quel que soit le nombre
  // d'événements du doigt d'ici là (un écran tactile en envoie plusieurs par image : chacun redessinait toute l'île)
  drawSoon() {
    if (this.soonRaf) return;
    this.soonRaf = requestAnimationFrame(now => {
      this.soonRaf = 0;
      this.lastFrame = now;
      this.draw(now);
    });
  },
  // Un dessin vient d'arriver : l'île sera redessinée à l'image suivante, une seule fois pour tous ceux qui arrivent
  // ensemble, et seulement si la boucle ne tourne pas déjà (mouvement réduit). Un redessin complet par dessin lu, tout
  // de suite, faisait des centaines de dessins de l'île pendant son chargement
  repaintSoon() {
    if (this.raf || this.repaintRaf) return;
    this.repaintRaf = requestAnimationFrame(() => {
      this.repaintRaf = 0;
      this.draw(performance.now());
    });
  },
  diamond(ctx, cx, cy, w, h) {
    ctx.beginPath();
    ctx.moveTo(cx, cy - h / 2);
    ctx.lineTo(cx + w / 2, cy);
    ctx.lineTo(cx, cy + h / 2);
    ctx.lineTo(cx - w / 2, cy);
    ctx.closePath();
  },
  draw(now) {
    const canvas = this.$refs.canvas;
    if (!canvas || !this.geo || !this.state || !this.cam) return;
    const ctx = canvas.getContext('2d');
    const { width, height, dpr, n } = this.geo;
    const { s } = this.cam;
    const t = this.reduced() ? 0 : now / 1000;
    const date = this.skyDate(now);
    const phase = this.skyAt(date);
    this.phase = phase;
    this.itemHits = [];
    this.nameSignHits = [];
    this.syncClock(phase, date, now);
    // Mer, selon l'heure
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawSea(ctx, width, height, t, phase);
    // Monde : unités du monde, caméra appliquée
    const o = this.toScreen(0, 0);
    ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * o.x, dpr * o.y);
    // Vue de loin, les dessins sont recopiés à moindre détail (images réduites une fois pour toutes)
    setSpriteDetail(dpr * s);
    // Monde visible : seuls les carrés de sol et ce qui s'y tient, à l'écran, sont dessinés
    const tl = this.toWorld(0, 0);
    const br = this.toWorld(width, height);
    const view = { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
    // Sous le sol : reflets, vagues qui arrivent derrière l'île, bancs de poissons, puis les eaux peu profondes par-dessus
    // (la terre les recouvre)
    // Reflets du soleil sur l'eau : pas la nuit, ni sous un ciel couvert
    drawSparkles(ctx, view, t, Math.max(phase.night, phase.weather.cover * 0.85), s);
    drawWaves(ctx, this.live.back, view, t, false);
    drawSchools(ctx, schoolFish(this.sea.schools, t), view, phase.night);
    drawShallows(ctx, this.sea.shallow, view, phase.night);
    drawFloatBelow(ctx, this.islets.float, view, t, phase.night);
    // Sol en relief, en carrés gardés en images (les nouveaux dans un budget de 8 ms) ; puis l'eau douce qui bouge,
    // les vagues et l'écume devant l'île, les ronds dans l'eau des dauphins et de la baleine
    // (avec le décor fixe cuit dedans, sauf de près)
    const near = s >= NEAR_SCALE;
    const baked = !near;
    // (le décor cuit dans le sol compte avec le décor, pendant le chargement de l'île)
    spriteGroup('decor');
    const missing = this.terrain.draw(ctx, view, s * dpr, 8, baked);
    drawLive(ctx, this.M, this.live, view, t);
    if (this.owns(this.state, FLOATING_ZONE)) drawSpring(ctx, this.islets.spring, view, t);
    drawWaves(ctx, this.live.shore, view, t, true);
    const life = this.seaLife(t, view, phase);
    drawRings(ctx, life.rings);
    // Sol des chantiers : terre battue (bâti) ou chantier ; cases libres pendant un déplacement ; case choisie
    const plots = new Map();
    for (const site of this.state.sites) {
      for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) plots.set((site.y + dy) * n + site.x + dx, site);
    }
    for (const [k, plot] of plots) {
      const x = k % n, y = Math.floor(k / n);
      const c = this.ground(x, y);
      const shade = (x + y) % 2;
      this.diamond(ctx, c.x, c.y, TW, TH);
      ctx.fillStyle = plot.level ? (shade ? '#D9C49A' : '#E0CCA4') : (shade ? '#B89468' : '#C09C70');
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, .16)';
      ctx.lineWidth = 1 / s;
      ctx.stroke();
    }
    // Pose d'une annexe ou d'une création : les cases autorisées battent en doré, la case choisie est cerclée. Contour
    // net (un trait sombre sous un trait doré : lisible sur le sable, la neige et la lande) ; un losange clair part du
    // centre de chaque case et s'efface (sauf en mouvement réduit)
    const golden = this.annexPlacing && this.placingSite ? { spots: this.placingSite.spots, chosen: this.annexConfirm }
      : this.craftPlacing ? { spots: this.craftSpots, chosen: this.craftConfirm } : null;
    if (golden) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 4);
      const wave = (t * 1.1) % 1;
      const still = this.reduced();
      ctx.lineJoin = 'round';
      for (const spot of golden.spots) {
        const c = this.ground(spot.x, spot.y);
        if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TW || c.y > view.y + view.h + TW) continue;
        const chosen = golden.chosen && golden.chosen.x === spot.x && golden.chosen.y === spot.y;
        this.diamond(ctx, c.x, c.y, TW, TH);
        ctx.fillStyle = chosen ? 'rgba(242, 192, 75, .62)' : `rgba(242, 192, 75, ${(0.24 + 0.2 * pulse).toFixed(3)})`;
        ctx.fill();
        ctx.strokeStyle = 'rgba(92, 56, 12, .78)';
        ctx.lineWidth = (chosen ? 4.6 : 3.4) / s;
        ctx.stroke();
        ctx.strokeStyle = chosen ? '#FFF4C8' : '#FFD45E';
        ctx.lineWidth = (chosen ? 2.4 : 1.7) / s;
        ctx.stroke();
        if (chosen || still) continue;
        this.diamond(ctx, c.x, c.y, TW * (0.2 + 0.7 * wave), TH * (0.2 + 0.7 * wave));
        ctx.strokeStyle = `rgba(255, 246, 210, ${(0.95 * (1 - wave)).toFixed(3)})`;
        ctx.lineWidth = 1.5 / s;
        ctx.stroke();
      }
    }
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
    for (const site of this.state.sites) {
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
      const mist = this.mistOf(this.state.map.zones.find(z => z.id === id), now);
      if (!mist) continue;
      ctx.fillStyle = `rgba(236, 238, 242, ${((this.thickMist() ? 0.9 : 0.62) * mist).toFixed(3)})`;
      for (const [x, y] of this.zoneTiles.get(id) || []) {
        const c = this.ground(x, y);
        this.diamond(ctx, c.x, c.y, TW + 1, TH + 1);
        ctx.fill();
      }
    }
    // Carrés de sol encore à préparer : une image de plus, même sans boucle d'animation
    if (missing && !this.raf && !this.moreRaf) {
      this.moreRaf = requestAnimationFrame(() => {
        this.moreRaf = 0;
        this.draw(performance.now());
      });
    }
    const worldTransform = ctx.getTransform();
    // Ombres des nuages et des mouettes qui glissent sur la mer et le relief
    drawCloudShadows(ctx, this.terrain.bounds, t, phase);
    for (const g of life.gulls) drawGullShadow(ctx, g, s);
    // Ce qui se tient debout (bâtiments, créations, nature), du plus loin au plus proche
    // (seulement ce qui est à l'écran ; un grand sprite dépasse vers le haut de son pied)
    const far = s < FAR_SCALE;
    const seenAt = (wx, wy) => wx > view.x - TW * 2.5 && wx < view.x + view.w + TW * 2.5 && wy > view.y - TW * 0.6 && wy < view.y + view.h + TW * 3.2;
    const seen = (x, y) => { const c = this.ground(x, y); return seenAt(c.x, c.y); };
    const standing = [
      ...this.state.sites.map(site => ({ depth: site.x + site.y + site.w, site })),
      ...this.crafted.filter(craft => seen(craft.x, craft.y)).map(craft => ({ depth: craft.x + craft.y, craft })),
      ...(this.state.annexes || []).filter(annex => seen(annex.x, annex.y)).map(annex => ({ depth: annex.x + annex.y, annex })),
      // Aperçu de la pose en attente de confirmation (miroir, couleur choisis), en transparence sur sa case dorée
      ...[this.craftGhost].filter(Boolean).map(craft => ({ depth: craft.x + craft.y, craft })),
      ...[this.annexGhost].filter(Boolean).map(annex => ({ depth: annex.x + annex.y, annex })),
      // Le camp des naufragés : un élément de 2 × 2 cases se range comme un bâtiment, un objet comme une annexe
      ...(this.state.camp || []).filter(item => seen(item.x, item.y)).map(item => ({ depth: item.x + item.y + (item.w > 1 ? item.w : 0), camp: item })),
      ...this.shownLandmarks.filter(landmark => seen(landmark.x, landmark.y)).map(landmark => ({ depth: landmark.x + landmark.y, landmark })),
      ...this.groundFinds.filter(deposit => seen(deposit.x, deposit.y)).map(deposit => ({ depth: deposit.x + deposit.y, deposit })),
      ...this.state.sites.filter(site => site.level && site.produce && !site.locked).map(site => ({ site, at: this.reserveAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, reserve: site })),
      ...this.state.sites.filter(site => site.sign && !site.locked).map(site => ({ site, at: this.nameSignAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, nameSign: site })),
      ...(baked ? this.liveProps : this.props).filter(prop => seenAt(prop.wx, prop.wy) && !(far && SMALL_PROPS.has(prop.kind))).map(prop => ({ depth: prop.depth, prop })),
      ...[...this.critters(t), ...life.standing].filter(critter => seen(critter.x, critter.y))
        .map(critter => ({ depth: critter.depth ?? critter.x + critter.y, critter })),
      ...this.ferryItems(t),
      ...this.state.map.zones.filter(zone => !zone.owned && this.signShown(zone)).map(zone => ({ zone, at: this.signPlaceOf(zone) }))
        .filter(sign => sign.at && seen(sign.at.x, sign.at.y)).map(sign => ({ depth: sign.at.x + sign.at.y, sign }))
    ].sort((p, q) => p.depth - q.depth);
    this.signs = [];
    const repaint = this.repaintSoon;
    for (const item of standing) {
      // (groupe de ses dessins, pour le chargement de l'île)
      spriteGroup(item.critter || item.ferry ? 'vivants' : item.prop ? 'decor' : 'batiments');
      if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
      else if (item.craft) {
        this.drawCraft(ctx, item.craft, t, now, repaint);
        if (!far) this.occlude(ctx, item.craft.x, item.craft.y, baked);
      } else if (item.annex) {
        this.drawAnnex(ctx, item.annex, t, now, repaint);
        if (!far) this.occlude(ctx, item.annex.x, item.annex.y, baked);
      } else if (item.camp) {
        this.drawCamp(ctx, item.camp, t, repaint);
        if (!far) this.occlude(ctx, item.camp.x + item.camp.w - 1, item.camp.y + item.camp.h - 1, baked);
      } else if (item.landmark) {
        this.drawLandmark(ctx, item.landmark, t, now, repaint);
        if (!far) this.occlude(ctx, item.landmark.x, item.landmark.y, baked);
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
        this.drawCritter(ctx, item.critter, repaint);
        if (!far && !SEA_KINDS.has(item.critter.kind)) {
          this.occlude(ctx, Math.round(item.critter.x), Math.round(item.critter.y), baked);
          if (baked) this.standInFront(ctx, item.critter);
        }
      }
    }
    // Volutes de brume qui dérivent au-dessus des quartiers à acheter
    this.drawWisps(ctx, t, now);
    this.drawSmoke(ctx, t, phase);
    // Ciel : mouettes en vol, nuages haut au-dessus de l'île, puis la teinte de l'heure sur toute la scène
    for (const g of life.gulls) if (!this.drawGullArt(ctx, g, t, s)) drawFlyingGull(ctx, g, t, s);
    drawClouds(ctx, this.terrain.bounds, t, phase, s);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawTint(ctx, width, height, phase);
    drawWeather(ctx, width, height, t, phase);
    const here = this.cellAt(this.cam.x, this.cam.y);
    this.climateMix = mixToward(this.climateMix, climateAt(this.M, this.state.map.zones, here.x, here.y), this.climateT ? Math.min(0.5, t - this.climateT) : 1);
    this.climateT = t;
    drawClimate(ctx, width, height, t, this.climateMix, this.reduced());
    ctx.setTransform(worldTransform);
    this.drawLights(ctx, t, phase, view);
    // La nuit, le plancton s'allume dans l'écume et les méduses luisent
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    drawPlankton(ctx, this.live.shore, view, t, phase.night);
    if (life.jellies) drawJellies(ctx, life.jellies, view, t, phase.night);
    ctx.restore();
    // Brume flotte au-dessus de tout (et luit la nuit)
    this.drawBrume(ctx, t, s);
    // Les noms des lieux passent par-dessus tout : aucune création ne les cache
    if (this.cam.s >= 0.55) this.state.sites.filter(site => !site.locked).forEach(site => this.drawLabel(ctx, site));
    // Étoiles des lieux à découvrir : par-dessus tout, de jour comme de nuit
    this.drawBeacons(ctx, t, seen);
    // Bulles de production à toucher, au-dessus de tout
    this.drawBubbles(ctx, t, repaint);
    // Ce qui est choisi (premier toucher) : un contour doré qui bat
    this.drawPick(ctx, t);
    // Arrivée sur l'île : où en est la première vue
    this.watchLoading(missing, this.terrain.seen || 0);
  },
  // Panneau d'un quartier pas encore à soi : sous la brume épaisse du tutoriel, seul celui que vise la quête
  signShown(zone) {
    if (!this.thickMist()) return true;
    const target = this.state.brume.quest.target;
    return Boolean(target && target.zone === zone.id);
  },
  // Mouette en vol de la bibliothèque (beastArt.flyingGull) : à peu près la taille du dessin par code, grossie de même
  // quand l'île est vue de loin ; tournée vers la gauche quand elle y va (flip). false tant que son image se lit (le
  // dessin par code la remplace)
  drawGullArt(ctx, g, t, s) {
    const art = flyingGull(t, g.phase);
    if (!art) return false;
    const k = 0.55 * Math.max(1, 0.5 / s);
    ctx.save();
    ctx.translate(g.wx, g.wy - g.alt + 13 * k);
    ctx.scale(g.flip ? -k : k, k);
    const drawn = drawSprite(ctx, art.key, art.make, 0, 0, this.repaintSoon);
    ctx.restore();
    return drawn;
  },
  // Ce qui se tient derrière une case plus haute : cette case est repeinte par-dessus (le relief cache le pied)
  occlude(ctx, x, y, baked = false) {
    const M = this.M;
    const h = M.surface(x, y);
    for (const [dx, dy] of [[1, 0], [0, 1], [1, 1]]) {
      const nx = x + dx, ny = y + dy;
      if (!M.land(nx, ny) || M.surface(nx, ny) <= h + 0.01) continue;
      drawCell(ctx, M, nx, ny, this.veilAt(nx, ny));
      // (le décor cuit dans cette case est repeint avec elle)
      if (baked) this.standAt(ctx, nx, ny);
    }
  },
  // Zoom moyen (décor cuit dans le sol) : ce qui marche se dessine par-dessus le sol, donc par-dessus un arbre ou des
  // fleurs cuits devant lui. Le décor cuit des cases devant lui (plus proches) qui le recouvre à l'écran est repeint
  // par-dessus, comme de près où tout se dessine dans l'ordre du relief ; seulement dans sa boîte, pour ne pas doubler
  // ailleurs ce qui est transparent (l'ombre au pied d'un arbre). Sous la brume, le décor à demi effacé reste tel quel
  standInFront(ctx, critter) {
    const [key, make] = this.critterSprite(critter);
    const box = imageOf(key, make).box;
    const c = this.ground(critter.x, critter.y);
    const top = c.y - critter.z + box.y;
    const bottom = top + box.h;
    // (retourné, le dessin passe de l'autre côté de son pied)
    const left = c.x + Math.min(box.x, -box.x - box.w);
    const right = c.x + Math.max(box.x + box.w, -box.x);
    const rect = { x: left, y: top, w: right - left, h: bottom - top };
    const depth = critter.depth ?? critter.x + critter.y;
    const n = this.state.size;
    const x0 = Math.round(critter.x), y0 = Math.round(critter.y);
    for (let y = y0 - 1; y <= y0 + 3; y++) {
      for (let x = x0 - 1; x <= x0 + 3; x++) {
        const props = this.propsAt && this.propsAt.get(y * n + x);
        if (!props) continue;
        const zone = this.zoneAt(x, y);
        if (!zone || !zone.owned) continue;
        for (const prop of props) {
          if (prop.depth <= depth) continue;
          const pb = imageOf(prop.key, prop.make).box;
          if (prop.wx + pb.x >= right || prop.wx + pb.x + pb.w <= left || prop.wy + pb.y >= bottom || prop.wy + pb.y + pb.h <= top) continue;
          drawSpriteIn(ctx, prop.key, prop.make, prop.wx, prop.wy, rect);
        }
      }
    }
  },
  // Case (fractionnaire) sous un point du monde, au niveau de la mer
  cellAt(wx, wy) {
    const a = (2 * (wy + SEA_Z * HS)) / TH, b = (2 * wx) / TW;
    return { x: (a + b) / 2, y: (a - b) / 2 };
  }
};
