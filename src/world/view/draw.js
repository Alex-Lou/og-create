// La boucle d'animation et le dessin de l'île : sol, mer, ce qui se tient debout, lumières, météo, bulles. Méthodes de
// WorldView.vue (this : le composant), extraites telles quelles (lot santé).
import { drawSea, drawCloudShadows, drawClouds, drawTint, drawWeather, hash, glow, fireflies } from '@/world/scene';
import { setSpriteDetail, drawSprite, imageOf } from '@/world/spriteCache';
import { drawSparkles, drawWaves, drawSchools, schoolFish, drawShallows, drawRings, drawGullShadow, drawFlyingGull, drawPlankton, drawJellies, drawSpout, seaGuests, DOLPHIN_EVERY, DOLPHIN_FOR, podAt, WHALE_EVERY, WHALE_FOR, whaleAt, jelliesAt, circling, crossing, nearestOpen, spread } from '@/world/sea';
import { drawFloatBelow, FLOATING_ZONE, drawSpring, COLONY_ZONE, ferryPose } from '@/world/islets';
import { drawLive, drawCell, SEA_Z, HS, worldOf, lampGlowOf } from '@/world/terrain';
import { mixToward, climateAt, drawClimate } from '@/world/climates';
import { BUILDINGS, NATURE } from '@/world/sprites';
import { glyph } from '@/book/painter';
import { lookAt, boatOffset, boatOf } from '@/world/looks';
import { P } from '@/world/iso';
import { itemLayers, itemLight } from '@/world/shopSprites';
import { SIGN, CRITTERS, NATURE2 } from '@/world/nature';
import { nameSignLayers, paintName, nameSignLight } from '@/world/nameSigns';
import { GLYPH } from '@/game/resources';
import { missingOf, NEED_GLYPH } from '@/world/needs';
import { ring, burst, vibrate } from '@/utils/fx';
import { FISH_SPECIES, SEA_SPRITES } from '@/world/seaSprites';
import { BOTTLE } from '@/world/chest';
import { ISLET_SPRITES, ISLET_NATURE } from '@/world/isletSprites';
import { visitorBoat } from '@/world/visitors';
import { landmarksShown, landmarksWaiting } from '@/world/landmarks';
import { floatOf, BRUME_ALT, drawBrume, BRUME_REACH } from '@/world/brume';
import { wreckOf, memoryOf } from '@/world/story';
import playService from '@/services/playService';
import { messageOf } from '@/utils/errors';
import { rareLights } from '@/world/rareSprites';
import { annexLight, annexLayers } from '@/world/annexSprites';
import { landmarkLight, landmarkScale, landmarkLayers, landmarkTop } from '@/world/landmarkSprites';
import { craftLight, craftLayers } from '@/world/craftSprites';
import { depositWait } from '@/world/finds';
import { depositLayer } from '@/world/depositSprites';
import { TW, TH, DEPOSIT_SCALE } from './constants';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
// Vue de loin (zoom sous FAR_SCALE) : ni masquage par le relief devant ce qui se tient debout (invisible à cette
// taille), ni petits détails du décor ; la très grande île reste fluide
const FAR_SCALE = 0.45;
// De près seulement (zoom dès NEAR_SCALE), le décor fixe se dessine à chaque image et plie au vent ; plus loin, il est
// cuit dans les carrés du sol (sauf près de ce qui se tient debout : il doit pouvoir passer devant)
const NEAR_SCALE = 0.9;
const SMALL_PROPS = new Set(['tuft', 'flowers', 'shells', 'mushrooms', 'reeds', 'lily', 'stump', 'log', 'driftwood', 'nest']);
// Ce qui vit à la surface de la mer (posé au niveau de l'eau, jamais caché par la terre : eau libre)
const SEA_KINDS = new Set(['fish', 'dolphin', 'whale', 'fluke', 'spout', 'vboat']);
// Arrivée du bateau d'un visiteur (secondes) et distance d'où il vient (cases)
const BOAT_SAIL = 6;
const BOAT_FAR = 7;
// Mouettes posées effrayées : envol (s), puis retour
const FLY_OFF = 2.6;
const GULL_BACK = 30;
// Construction ou amélioration : le chantier tremble dans la poussière, puis le bâtiment s'élève (ms)
const RAISE_MS = 2400;
// Enseigne d'un bâtiment : pied sur le bord avant gauche de son emprise, à tant de cases du coin vers le joueur (le nom
// du bâtiment, sous ce coin, reste dégagé), un peu en retrait du bord ; dessinée un peu plus grande que nature
const NAME_SIGN_ALONG = 1.6;
const NAME_SIGN_INSET = 0.25;
const NAME_SIGN_SCALE = 1.2;
// Ce qui plie au vent, et de combien
const SWAY = { tree: 0.04, palm: 0.05, bush: 0.03, tuft: 0.09, flowers: 0.06, birch: 0.05, apple: 0.03, autumn: 0.035, reeds: 0.08, snowpine: 0.02, heather: 0.04 };
// Tous les décors naturels (planches 1 et 2), et ce qui pousse où, avec sa fréquence cumulée
const ALL_NATURE = { ...NATURE, ...NATURE2, ...ISLET_NATURE };

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
    if (now - this.lastFrame >= FRAME_MS) {
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
      ctx.fillStyle = `rgba(236, 238, 242, ${(0.62 * mist).toFixed(3)})`;
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
      ...this.shownLandmarks.filter(landmark => seen(landmark.x, landmark.y)).map(landmark => ({ depth: landmark.x + landmark.y, landmark })),
      ...this.shownDeposits.filter(deposit => seen(deposit.x, deposit.y)).map(deposit => ({ depth: deposit.x + deposit.y, deposit })),
      ...this.state.sites.filter(site => site.sign && !site.locked).map(site => ({ site, at: this.nameSignAt(site) }))
        .filter(({ at }) => seen(at.gx, at.gy)).map(({ site, at }) => ({ depth: at.gx + at.gy, nameSign: site })),
      ...(baked ? this.liveProps : this.props).filter(prop => seenAt(prop.wx, prop.wy) && !(far && SMALL_PROPS.has(prop.kind))).map(prop => ({ depth: prop.depth, prop })),
      ...[...this.critters(t), ...life.standing].filter(critter => seen(critter.x, critter.y))
        .map(critter => ({ depth: critter.depth ?? critter.x + critter.y, critter })),
      ...this.ferryItems(t),
      ...this.state.map.zones.filter(zone => !zone.owned).map(zone => ({ zone, at: this.signPlaceOf(zone) }))
        .filter(sign => sign.at && seen(sign.at.x, sign.at.y)).map(sign => ({ depth: sign.at.x + sign.at.y, sign }))
    ].sort((p, q) => p.depth - q.depth);
    this.signs = [];
    const repaint = () => this.draw(performance.now());
    for (const item of standing) {
      if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
      else if (item.craft) {
        this.drawCraft(ctx, item.craft, t, now, repaint);
        if (!far) this.occlude(ctx, item.craft.x, item.craft.y, baked);
      } else if (item.annex) {
        this.drawAnnex(ctx, item.annex, t, now, repaint);
        if (!far) this.occlude(ctx, item.annex.x, item.annex.y, baked);
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
      else if (item.sign) this.drawSign(ctx, item.sign, t, repaint);
      else if (item.ferry) this.drawFerry(ctx, item.ferry, repaint);
      else {
        this.drawCritter(ctx, item.critter, repaint);
        if (!far && !SEA_KINDS.has(item.critter.kind)) this.occlude(ctx, Math.round(item.critter.x), Math.round(item.critter.y), baked);
      }
    }
    // Volutes de brume qui dérivent au-dessus des quartiers à acheter
    this.drawWisps(ctx, t, now);
    this.drawSmoke(ctx, t, phase);
    // Ciel : mouettes en vol, nuages haut au-dessus de l'île, puis la teinte de l'heure sur toute la scène
    for (const g of life.gulls) drawFlyingGull(ctx, g, t, s);
    drawClouds(ctx, this.terrain.bounds, t, phase, s);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawTint(ctx, width, height, phase);
    drawWeather(ctx, width, height, t, phase);
    const here = this.cellAt(this.cam.x, this.cam.y);
    this.climateMix = mixToward(this.climateMix, climateAt(this.M, this.state.map.zones, here.x, here.y), this.climateT ? Math.min(0.5, t - this.climateT) : 1);
    this.climateT = t;
    drawClimate(ctx, width, height, t, this.climateMix, this.reduced());
    ctx.setTransform(worldTransform);
    this.drawLights(ctx, t, phase);
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
  drawSite(ctx, site, t, now, repaint) {
    // Sous la brume : à peine visible, comme une promesse
    const mist = this.mistOf(this.zoneAt(site.x, site.y), now);
    if (mist) {
      ctx.save();
      ctx.globalAlpha = 1 - 0.55 * mist;
      this.paintSite(ctx, site, t, now, repaint);
      ctx.restore();
      return;
    }
    this.paintSite(ctx, site, t, now, repaint);
  },
  paintSite(ctx, site, t, now, repaint) {
    const c = this.centerOf(site);
    const raise = this.raises.get(site.id);
    const k = raise ? Math.min(1, (now - raise.at) / RAISE_MS) : 1;
    if (raise && k >= 1) this.raises.delete(site.id);
    if (!site.level) {
      // Chantier, dans sa phase ; tout prêt, un peu de poussière de temps en temps
      const stage = this.stageOf(site);
      drawSprite(ctx, `chantier-${stage}`, BUILDINGS.chantier[stage], c.x, c.y, repaint);
      if (stage === 2 && !site.locked) {
        const puff = (t * 0.5) % 1;
        if (puff < 0.4) this.dust(ctx, c.x, c.y + 6, puff / 0.4, 3);
      }
      if (!site.locked && site.next && site.next.planEmoji) glyph(ctx, site.next.planEmoji, c.x, c.y - TW * 1.02 + Math.sin(t * 2) * 2, TW * 0.46, repaint, site.next.planOwned ? 0.95 : 0.4);
      return;
    }
    const look = lookAt(site.id, site.level);
    const skin = site.skin || '';
    const key = `${site.id}-${site.level}-${skin}`;
    const make = () => look.make(skin || undefined);
    const span = site.w / 2;
    if (k < 1) {
      // 1. L'ancien état tremble dans la poussière ; 2. le nouveau bâtiment s'élève depuis le sol ; 3. petit rebond.
      // (Au palier IV, l'emprise grandit : l'ancien bâtiment, plus petit, est dessiné au centre de la nouvelle.)
      const before = raise.from || 0;
      const beforeKey = before ? `${site.id}-${before}-${skin}` : 'chantier-2';
      const beforeMake = before ? () => lookAt(site.id, before).make(skin || undefined) : BUILDINGS.chantier[2];
      if (k < 0.35) {
        const shake = Math.sin(now / 28) * 1.6 * (1 - k / 0.35);
        drawSprite(ctx, beforeKey, beforeMake, c.x + shake, c.y, repaint);
      } else {
        const r = Math.min(1, (k - 0.35) / 0.5);
        const rise = 1 - Math.pow(1 - r, 3);
        const pop = k > 0.85 ? 1 + Math.sin(((k - 0.85) / 0.15) * Math.PI) * 0.05 : 1;
        ctx.save();
        // Le bâtiment sort de terre : découpé au ras du sol (bas de l'emprise), il monte de 96 px (plus s'il est grand)
        ctx.beginPath();
        ctx.rect(c.x - TW * (span + 0.4), c.y - TW * (2 * span + 1.2), TW * (2 * span + 0.8), TW * (2 * span + 1.2) + TH * (span + 0.05));
        ctx.clip();
        ctx.translate(c.x, c.y + (1 - rise) * 96 * span);
        ctx.scale(pop, pop);
        drawSprite(ctx, key, make, 0, 0, repaint);
        ctx.restore();
      }
      this.dust(ctx, c.x, c.y + 6, k, 9, span);
      return;
    }
    // Articles de la boutique : ceux de derrière avant le bâtiment, les autres après lui
    this.drawItems(ctx, site, c, t, repaint, true);
    this.swayed(ctx, key, make, c.x, c.y, look.sway * this.windAt(t, site.x + site.y), repaint);
    // Parties vivantes du palier (flamme, jets d'eau, ailes de moulin, roue…), puis le voilier bercé du Ponton
    look.anims.forEach((anim, i) => {
      if (anim.skip && anim.skip(skin)) return;
      const frame = Math.floor(t * anim.fps) % anim.n;
      drawSprite(ctx, `${site.id}-${site.level}-a${i}-${frame}-${anim.skinned ? skin : ''}`, () => anim.frame(frame, skin || undefined), c.x, c.y, repaint);
    });
    if (look.boat) {
      const [bx, by] = P(...look.boat, 0);
      const [ox, oy] = boatOffset(look.boat);
      ctx.save();
      ctx.translate(c.x + bx, c.y + by + Math.sin(t * 1.4) * 1.6);
      ctx.rotate(Math.sin(t * 1.1) * 0.035);
      drawSprite(ctx, `boat-${skin}`, () => boatOf(skin || undefined), ox - bx, oy - by, repaint);
      ctx.restore();
    }
    this.drawItems(ctx, site, c, t, repaint, false);
  },
  // Centre de l'emprise d'un bâtiment (2 × 2 ou 3 × 3 cases) dans le monde, à la hauteur de son sol (plat)
  centerOf(site) {
    const c = this.world(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2);
    c.y -= this.liftAt(site.x, site.y);
    return c;
  },
  covers(site, x, y) {
    return x >= site.x && x < site.x + site.w && y >= site.y && y < site.y + site.h;
  },
  // Articles possédés d'un bâtiment (outils, objets, accessoire de la pièce rare portée), dessinés et animés autour de lui
  drawItems(ctx, site, c, t, repaint, back) {
    for (const item of site.shop || []) {
      if (!item.owned || (item.kind === 'skin' && site.skin !== item.id)) continue;
      // Toucher : l'article sautille (0,5 s)
      const tapped = this.scared.get(`item:${site.id}:${item.id}`);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 6 : 0;
      for (const layer of itemLayers(item.id, site.level, t)) {
        if (layer.back !== back) continue;
        const [x, y] = [c.x + layer.offset[0], c.y + layer.offset[1] - hop];
        drawSprite(ctx, layer.key, layer.make, x, y, repaint);
        // Zone de toucher : le cadre de l'image (les pièces rares font partie du bâtiment)
        if (item.kind !== 'skin') {
          const { box } = imageOf(layer.key, layer.make, repaint);
          this.itemHits.push({ item, site, x: x + box.x + box.w / 2, y: y + box.y + box.h / 2, r: Math.max(10, Math.min(box.w, box.h) * 0.5) });
        }
      }
    }
  },
  // Décor fixe d'une case, cuit dans le sol sauf de près (sans le vent ; à demi effacé sous la brume, comme le sol) :
  // vrai si tous ses dessins étaient prêts
  standAt(ctx, x, y) {
    const props = this.propsAt && this.propsAt.get(y * this.state.size + x);
    if (!props) return true;
    const zone = this.zoneAt(x, y);
    ctx.globalAlpha = zone && !zone.owned ? 0.5 : 1;
    let ready = true;
    for (const prop of props) ready = drawSprite(ctx, `nature-${prop.kind}`, ALL_NATURE[prop.kind], prop.wx, prop.wy) && ready;
    ctx.globalAlpha = 1;
    return ready;
  },
  drawProp(ctx, prop, t, repaint, now, still = false) {
    const c = { x: prop.wx, y: prop.wy };
    const mist = this.mistOf(this.zoneAt(prop.x, prop.y), now);
    if (mist) {
      ctx.save();
      ctx.globalAlpha = 1 - 0.5 * mist;
    }
    this.swayed(ctx, `nature-${prop.kind}`, ALL_NATURE[prop.kind], c.x, c.y, still ? 0 : (SWAY[prop.kind] || 0) * this.windAt(t, prop.x * 0.7 + prop.y), repaint);
    if (mist) ctx.restore();
  },
  // Panneau d'un quartier à acheter : prix, ou chapitre du Livre encore fermé ; il se balance un peu
  drawSign(ctx, { zone, at }, t, repaint) {
    const c = this.ground(at.x, at.y);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(Math.sin(t * 1.3 + at.x) * 0.02);
    drawSprite(ctx, 'sign', SIGN, 0, 0, repaint);
    ctx.font = '900 7.5px Nunito, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#4A3426';
    const going = this.state.expedition && this.state.expedition.zone === zone.id;
    ctx.fillText(zone.known === false ? (going ? 'En route' : zone.explorable ? 'Explorer' : '? ? ?') : zone.open ? `${zone.price} écus` : `Chap. ${zone.chapter}`, 0, -31.5);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
    this.signs.push({ zone, x: c.x, y: c.y - 30, r: 20 });
  },
  // Pied de l'enseigne d'un bâtiment (dès le palier V) : sur le bord avant gauche de son emprise
  nameSignAt(site) {
    const gx = site.x + site.w - 0.5 - NAME_SIGN_ALONG;
    const gy = site.y + site.h - 0.5 - NAME_SIGN_INSET;
    return { gx, gy, ...this.ground(gx, gy) };
  },
  // Enseigne d'un bâtiment : son style (dessin animé) et le nom écrit dessus ; un toucher la fait sautiller
  drawNameSign(ctx, site, t, repaint) {
    const at = this.nameSignAt(site);
    const tapped = this.scared.get(`name-sign:${site.id}`);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
    let ready = true;
    ctx.save();
    ctx.translate(at.x, at.y - hop);
    ctx.scale(NAME_SIGN_SCALE, NAME_SIGN_SCALE);
    for (const layer of nameSignLayers(site.sign, t)) ready = drawSprite(ctx, layer.key, layer.make, 0, 0, repaint) && ready;
    if (ready) paintName(ctx, site.sign, this.state.signs.name, t);
    ctx.restore();
    this.nameSignHits.push({ site, x: at.x, y: at.y - 24 * NAME_SIGN_SCALE, r: 22 * NAME_SIGN_SCALE });
  },
  // Volutes de brume (monde) : ellipses claires qui dérivent lentement sur les quartiers à acheter
  drawWisps(ctx, t, now) {
    for (const zone of this.state.map.zones) {
      const mist = this.mistOf(zone, now);
      if (!mist || !zone.anchor) continue;
      for (let k = 0; k < 4; k++) {
        const ax = zone.anchor.x + Math.sin(t * 0.13 + k * 1.9 + zone.anchor.y) * 1.6;
        const ay = zone.anchor.y + Math.cos(t * 0.11 + k * 2.3 + zone.anchor.x) * 1.6;
        const c = this.world(ax, ay);
        c.y -= this.liftAt(zone.anchor.x, zone.anchor.y);
        const g = ctx.createRadialGradient(c.x, c.y - 14, 0, c.x, c.y - 14, TW * 1.3);
        g.addColorStop(0, `rgba(248, 249, 252, ${(0.42 * mist).toFixed(3)})`);
        g.addColorStop(1, 'rgba(248, 249, 252, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y - 14, TW * 1.3, TH * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
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
      // Pointe vers le bâtiment
      ctx.fillStyle = '#FFFDF8';
      ctx.beginPath();
      ctx.moveTo(x - 5 * k, y + h / 2 - 1);
      ctx.lineTo(x, y + h / 2 + 6 * k);
      ctx.lineTo(x + 5 * k, y + h / 2 - 1);
      ctx.fill();
      glyph(ctx, GLYPH[site.produce] || 'ui:spark', x - 11 * k, y + 0.5, 14 * k, repaint);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${11 * k}px Nunito, system-ui, sans-serif`;
      ctx.fillStyle = '#4A3426';
      ctx.fillText(`+${amount}`, x + 9 * k, y + 0.5);
      ctx.textBaseline = 'alphabetic';
      this.bubbles.push({ site, x, y, w, h });
    }
    this.drawNeedBubbles(ctx, t, repaint);
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
        const y = h.y - 16 - r + Math.sin(t * 2.6 + h.x) * 1.5;
        this.bubbleAt(ctx, h.x, y, r, k, '#FFF6D8', '#E2A72E');
        glyph(ctx, guest.request.kind === 'livrer' ? GLYPH[guest.request.resource] : 'ui:spark', h.x, y + 0.5, 14 * k, repaint);
        this.needBubbles.push({ id: guest.id, visitor: true, x: h.x, y, r });
        continue;
      }
      const friend = h.kind === 'villager' ? this.friendOf(h.who) : null;
      const [first] = friend ? missingOf(friend) : [];
      if (!first) continue;
      const k = 1 / Math.min(1, this.cam.s);
      const r = 11 * k;
      const x = h.x;
      // Juste au-dessus de la tête (le point touché est au milieu du corps)
      const y = h.y - 16 - r + Math.sin(t * 2.6 + h.x) * 1.5;
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
  },
  // Petite vie de l'île, déterministe dans le temps : où est chaque animal, dans quelle image, de quel côté il regarde.
  // Poules autour du Foyer, papillons et abeilles sur les fleurs (le jour), grenouille aux nénuphars, poisson près de la côte.
  critters(t) {
    if (!this.state) return [];
    const phase = this.phase || this.skyAt(this.skyDate());
    const rain = phase.weather.rain;
    const out = [];
    const hits = [];
    // Réaction au toucher : k de 0 à 1 pendant span secondes, null sinon
    const fright = (key, span) => {
      const was = this.scared.get(key);
      return was && t - was.at < span ? (t - was.at) / span : null;
    };
    const touchable = (key, kind, x, y, z) => {
      const c = this.ground(x, y);
      hits.push({ key, kind, x: c.x, y: c.y - z - 6, r: 13 });
    };
    const foyer = this.state.sites.find(s => s.id === 'foyer');
    if (foyer) {
      // Poules : elles picorent autour du Foyer ; la nuit elles dorment serrées contre lui, sous la pluie elles s'abritent
      const asleep = phase.night > 0.6;
      const huddle = asleep || rain > 0.5;
      for (let k = 0; k < 2; k++) {
        const a = huddle ? k * 2.4 + 0.6 : t * 0.22 + k * 2.4;
        const r = foyer.w / 2;
        const reach = huddle ? r * 0.6 + 0.3 : r + 0.55;
        const x = foyer.x + r + Math.cos(a) * reach + (huddle ? 0 : Math.sin(t * 0.9 + k) * 0.08);
        const y = foyer.y + r + Math.sin(a * 1.3) * (huddle ? reach : r + 0.35);
        const pecking = !asleep && Math.sin(t * 0.7 + k * 3) > 0.55;
        const jump = fright(`hen:${k}`, 0.7);
        const z = jump === null ? 0 : Math.sin(jump * Math.PI) * 10;
        out.push({ kind: 'chicken', x, y, z, frame: jump !== null || (pecking && Math.sin(t * 9) > 0) ? 1 : 0, flip: Math.sin(a) > 0 });
        touchable(`hen:${k}`, 'chicken', x, y, z);
      }
    }
    // Papillons et abeilles : de jour, par temps sec
    if (phase.night < 0.5 && rain < 0.2) {
      const flowers = this.props.filter(p => p.kind === 'flowers' || p.kind === 'bush').slice(0, 4);
      flowers.forEach((p, k) => {
        const a = t * (0.6 + k * 0.1) + k;
        const kind = k % 2 ? 'bee' : 'butterfly';
        // Touché : il file vers le haut et revient au bout de 1,5 s
        const away = fright(`fly:${k}`, 1.5);
        const lift = away === null ? 0 : Math.sin(away * Math.PI);
        const x = p.x + Math.cos(a) * 0.35 + lift * 0.8;
        const y = p.y + Math.sin(a * 1.4) * 0.3 - lift * 0.4;
        const z = 6 + Math.sin(t * 2 + k) * 3 + lift * 30;
        out.push({ kind, x, y, z, frame: Math.floor(t * (kind === 'bee' ? 20 : 8) + k) % 2, flip: Math.cos(a) < 0 });
        touchable(`fly:${k}`, kind, x, y, z);
      });
    }
    const pond = this.props.find(p => p.kind === 'lily' || p.kind === 'reeds');
    // La grenouille saute plus souvent sous la pluie
    if (pond) {
      const leap = fright('frog', 0.6);
      const z = leap === null ? 0 : Math.sin(leap * Math.PI) * 8;
      out.push({ kind: 'frog', x: pond.x + 0.12, y: pond.y + 0.1, z, frame: leap !== null || (t % (rain > 0.5 ? 1.6 : 4)) < 0.35 ? 1 : 0, flip: false });
      touchable('frog', 'frog', pond.x + 0.12, pond.y + 0.1, z);
    }
    // Poisson : un saut toutes les 7 s, à un endroit différent du rivage (sardine, daurade) ; le poisson volant plane
    // vers le large
    const cycle = Math.floor(t / 7);
    const into = (t % 7) / 7;
    const species = FISH_SPECIES[Math.floor(hash(cycle, 5) * FISH_SPECIES.length)];
    const span = species === 'volant' ? 0.2 : 0.12;
    if (into < span && this.shore.length) {
      const spot = this.shore[Math.floor(hash(cycle, 2) * this.shore.length)];
      if (species === 'volant') {
        const k = into / span, alongX = hash(cycle, 3) < 0.5;
        out.push({ kind: 'fish', species, x: spot.x + 0.2 + (alongX ? k * 1.4 : 0), y: spot.y + 0.2 + (alongX ? 0 : k * 1.4), z: 0, frame: 0, flip: !alongX });
      } else out.push({ kind: 'fish', species, x: spot.x + 0.2, y: spot.y + 0.2, z: 0, frame: into < 0.06 ? 0 : 1, flip: hash(cycle, 3) < 0.5 });
    }
    // Mouettes posées sur les plages (envolées après un toucher, elles reviennent plus tard)
    for (const perch of this.perches) {
      const fled = this.scared.get(`perch:${perch.id}`);
      if (fled && t - fled.at < GULL_BACK) continue;
      for (let i = 0; i < perch.count; i++) {
        out.push({ kind: 'gull', x: perch.x + i * 0.32 - 0.1, y: perch.y + 0.1 - i * 0.18, z: 0, frame: Math.sin(t * 0.7 + i * 2 + perch.x) > 0.75 ? 1 : 0, flip: (i + Math.floor(t / 9 + perch.y)) % 2 === 1 });
      }
    }
    // Bouteille à la mer échouée : la vague la berce ; un toucher l'ouvre
    if (this.bottleSpot) {
      const { x, y } = this.bottleSpot;
      const frame = Math.sin(t * 1.6) > 0.6 ? 1 : 0;
      out.push({ kind: 'bottle', x: x + 0.5, y: y + 0.5, z: 0, frame, flip: false, sprite: [`bottle-${frame}`, BOTTLE[frame]] });
      const c = this.ground(x + 0.5, y + 0.5);
      hits.push({ key: 'bottle', kind: 'bottle', bottle: true, x: c.x, y: c.y - 6, r: 14 });
    }
    // Habitants et bêtes du village (on peut les toucher)
    const life = this.village ? this.village.at(t, phase, this.scared) : { list: [], lights: [] };
    for (const who of life.list) {
      out.push(who);
      const c = this.ground(who.x, who.y);
      const person = who.kind === 'villager';
      // Anya est grande (96 de haut) : on la touche au corps, pas seulement aux pieds
      const tall = who.species === 'anya';
      hits.push({ key: who.id, kind: person ? 'villager' : who.species, who, x: c.x, y: c.y - who.z - (person ? 16 : tall ? 44 : 6), r: person ? 15 : tall ? 34 : 12 });
    }
    this.villageLights = life.lights;
    this.landHits = hits;
    return out;
  },
  drawCritter(ctx, critter, repaint) {
    // À la surface de la mer : poissons, dauphins, baleine ; les autres vivent sur le sol de leur case
    if (critter.kind === 'spout') {
      drawSpout(ctx, critter);
      return;
    }
    const atSea = SEA_KINDS.has(critter.kind);
    const c = atSea ? this.world(critter.x, critter.y) : this.ground(critter.x, critter.y);
    if (atSea) c.y -= SEA_Z * HS;
    ctx.save();
    ctx.translate(c.x, c.y - critter.z);
    if (critter.flip) ctx.scale(-1, 1);
    // Ce qui sort de l'eau peu à peu (dos, queue de la baleine) : e de 0 à 1
    if (critter.e !== undefined) {
      ctx.globalAlpha = critter.e;
      ctx.translate(0, (1 - critter.e) * 8);
    }
    const [key, make] = this.critterSprite(critter);
    drawSprite(ctx, key, make, 0, 0, repaint);
    ctx.restore();
  },
  // Barque du passeur et son ponton (Îlot aux Mouettes à soi) : elle fait la navette une fois l'île flottante à soi
  ferryItems(t) {
    const route = this.islets.route;
    this.ferry = null;
    if (!route || !this.owns(this.state, COLONY_ZONE)) return [];
    const pose = ferryPose(route, t, this.owns(this.state, FLOATING_ZONE));
    this.ferry = pose;
    return [
      { depth: route.dock.x + route.dock.y - 0.05, ferry: { landing: true, ...route.dock } },
      { depth: pose.x + pose.y, ferry: { ...pose, frame: pose.moving ? Math.floor(t * 2) % 2 : 0 } }
    ];
  },
  drawFerry(ctx, item, repaint) {
    const c = worldOf(item.x, item.y, item.z);
    ctx.save();
    ctx.translate(c.x, c.y);
    if (item.landing) drawSprite(ctx, 'islet-landing', ISLET_SPRITES.landing, 0, 0, repaint);
    else {
      if (item.flip) ctx.scale(-1, 1);
      drawSprite(ctx, `islet-ferry-${item.frame}`, ISLET_SPRITES.ferry[item.frame], 0, 0, repaint);
    }
    ctx.restore();
  },
  critterSprite(c) {
    if (c.sprite) return c.sprite;
    if (c.kind === 'fish') return [`fish-${c.species}-${c.frame}`, SEA_SPRITES.fish[c.species][c.frame]];
    if (c.kind === 'dolphin') return [`dolphin-${c.frame}`, SEA_SPRITES.dolphin[c.frame]];
    if (c.kind === 'whale') return ['whale-back', SEA_SPRITES.whaleBack];
    if (c.kind === 'fluke') return ['whale-fluke', SEA_SPRITES.whaleFluke];
    if (c.kind === 'gull') return [`gull-${c.frame}`, SEA_SPRITES.gull[c.frame]];
    return [`${c.kind}-${c.frame}`, CRITTERS[c.kind][c.frame]];
  },
  // La mer à cet instant (lot 5b) : ce qui se montre à la surface (dauphins, baleine), les ronds dans l'eau, les
  // mouettes en vol, les méduses ; et ce qu'on peut toucher (seaHits). Les visiteurs arrivent avec les quartiers
  // achetés ; en mouvement réduit, seuls restent ceux qui ne passent pas
  seaLife(t, view, phase) {
    const out = { standing: [], rings: [], gulls: [], jellies: null };
    const hits = [];
    const still = this.reduced();
    const guests = seaGuests(new Set(this.state.map.zones.filter(z => z.owned).map(z => z.id)));
    const center = this.cellAt(view.x + view.w / 2, view.y + view.h / 2);
    const surface = (x, y) => { const c = this.world(x, y); return { x: c.x, y: c.y - SEA_Z * HS }; };
    if (!still && guests.dolphins) {
      const go = this.passageOf('pod', t, DOLPHIN_EVERY, DOLPHIN_FOR, 3, center);
      const fled = go && this.scared.get(go.key);
      if (go && !fled) {
        const pod = podAt(go.spot, go.dir, go.τ);
        out.rings.push(...pod.rings);
        for (const d of pod.dolphins) {
          out.standing.push({ kind: 'dolphin', ...d });
          const c = surface(d.x, d.y);
          hits.push({ key: go.key, kind: 'pod', x: c.x, y: c.y - d.z - 4, r: 26, where: pod.dolphins.map(p => ({ x: p.x, y: p.y })) });
        }
      } else if (fled && t - fled.at < 1.2) fled.where.forEach(p => out.rings.push({ x: p.x, y: p.y, k: (t - fled.at) / 1.2 }));
    }
    if (!still && guests.whale) {
      const go = this.passageOf('whale', t, WHALE_EVERY, WHALE_FOR, 5, center);
      if (go) {
        const w = whaleAt(go.spot, go.dir, go.τ);
        const tapped = this.scared.get(go.key);
        if (tapped && t - tapped.at < 1.8) w.spouts.push({ x: tapped.x, y: tapped.y, k: (t - tapped.at) / 1.8 });
        out.rings.push(...w.rings);
        if (w.back) {
          const depth = w.back.x + w.back.y;
          out.standing.push({ kind: 'whale', x: w.back.x, y: w.back.y, z: 0, e: w.back.e, flip: w.flip });
          w.spouts.forEach(sp => out.standing.push({ kind: 'spout', ...sp, depth: depth + 0.5 }));
          const c = surface(w.back.x, w.back.y);
          hits.push({ key: go.key, kind: 'whale', x: c.x, y: c.y - 6, r: 44, at: { x: w.back.x, y: w.back.y } });
        }
        if (w.fluke) out.standing.push({ kind: 'fluke', x: w.fluke.x, y: w.fluke.y, z: 0, e: w.fluke.e, flip: w.flip });
      }
    }
    if (guests.jellies && phase.night > 0.3) out.jellies = jelliesAt(this.sea.open, t);
    // Mouettes : un vol tourne au-dessus du ponton (ou de la Grève), un autre traverse l'île de temps en temps ; la nuit,
    // elles dorment
    if (!still && phase.night < 0.6) {
      const harbor = this.state.sites.find(site => site.id === 'ponton' && site.level);
      const greve = this.state.map.zones.find(z => z.id === 'coeur');
      const home = harbor ? this.centerOf(harbor) : greve && greve.anchor ? this.ground(greve.anchor.x, greve.anchor.y) : null;
      if (home) out.gulls.push(...circling(home.x, home.y, t, 1));
      out.gulls.push(...crossing(this.terrain.bounds, t));
      const colony = this.islets.colony;
      if (colony.length && this.owns(this.state, COLONY_ZONE)) {
        const c = this.ground(colony.reduce((sum, p) => sum + p.x, 0) / colony.length, colony.reduce((sum, p) => sum + p.y, 0) / colony.length);
        out.gulls.push(...circling(c.x, c.y, t, 3, 5));
      }
    }
    // Mouettes posées : on peut les toucher ; celles qu'on vient d'effrayer s'envolent vers le large
    for (const perch of this.perches) {
      const key = `perch:${perch.id}`;
      const fled = this.scared.get(key);
      const c = this.ground(perch.x, perch.y);
      if (!fled || t - fled.at >= GULL_BACK) hits.push({ key, kind: 'perch', x: c.x, y: c.y - 8, r: 16 });
      else if (t - fled.at < FLY_OFF) {
        const k = (t - fled.at) / FLY_OFF;
        for (let i = 0; i < perch.count; i++) out.gulls.push({ wx: c.x + (60 + i * 14) * k, wy: c.y + i * 4 - 20 * k, alt: 6 + 90 * k * k, flip: false, phase: i });
      }
    }
    // Bateau du visiteur : il arrive du large (BOAT_SAIL secondes), puis se balance à quai
    const dock = this.visitorDock;
    if (dock && this.state.visitor) {
      const arrival = this.boatArrival && this.boatArrival.id === this.state.visitor.id ? this.boatArrival : null;
      const k = arrival ? Math.min(1, (t - arrival.at) / BOAT_SAIL) : 1;
      const ease = 1 - (1 - k) ** 3;
      const x = dock.x + dock.dx * BOAT_FAR * (1 - ease);
      const y = dock.y + dock.dy * BOAT_FAR * (1 - ease);
      const frame = Math.floor(t * 2) % 2;
      out.standing.push({ kind: 'vboat', x, y, z: Math.sin(t * 1.4) * 1.2, flip: dock.flip, sprite: [`vboat-${frame}`, () => visitorBoat(frame)] });
      if (k < 1) out.rings.push({ x: x - dock.dx * 0.4, y: y - dock.dy * 0.4, k: (t * 1.5) % 1 });
      const c = surface(x, y);
      hits.push({ key: 'vboat', kind: 'vboat', x: c.x, y: c.y - 18, r: 26 });
    }
    // Ronds dans l'eau là où le doigt a touché la mer (1,2 s)
    this.ripples = this.ripples.filter(r => t - r.at < 1.2);
    this.ripples.forEach(r => out.rings.push({ x: r.x, y: r.y, k: (t - r.at) / 1.2 }));
    this.seaHits = hits;
    return out;
  },
  // Passage en cours des dauphins ou de la baleine : où (l'eau libre la plus proche de la caméra au début du
  // passage) et dans quelle direction ; null entre deux passages
  passageOf(name, t, every, length, far, center) {
    const cycle = Math.floor(t / every), τ = t - cycle * every;
    if (τ >= length) return null;
    let p = this.passages[name];
    if (!p || p.cycle !== cycle) {
      const spot = nearestOpen(this.sea.open, center.x, center.y, far);
      if (!spot) return null;
      p = { cycle, spot, dir: spot.dirs[Math.floor(hash(cycle, name.length) * spot.dirs.length)], key: `${name}:${cycle}` };
      this.passages[name] = p;
    }
    return { ...p, τ };
  },
  // Case (fractionnaire) sous un point du monde, au niveau de la mer
  cellAt(wx, wy) {
    const a = (2 * (wy + SEA_Z * HS)) / TH, b = (2 * wx) / TW;
    return { x: (a + b) / 2, y: (a - b) / 2 };
  },
  // Où flotte Brume (point au sol) : à côté du bâtiment ou du panneau du quartier que vise la quête active, sinon près
  // du Foyer
  brumeSpot() {
    const target = this.quest && this.quest.target;
    const zone = target && target.zone && this.state.map.zones.find(z => z.id === target.zone);
    if (zone && zone.anchor) {
      const g = this.ground(zone.anchor.x, zone.anchor.y);
      return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
    }
    const place = target && target.landmark && landmarksShown(this.state).find(l => l.id === target.landmark);
    if (place) {
      const g = this.ground(place.x, place.y);
      return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
    }
    const site = this.state.sites.find(s => s.id === ((target && (target.site || target.villager)) || 'foyer'));
    if (!site) return null;
    const c = this.centerOf(site);
    return { x: c.x - TW * 0.42 * site.w, y: c.y - TH * 0.15 };
  },
  drawBrume(ctx, t, s) {
    const spot = this.brumeSpot();
    if (!spot) {
      this.brumeHit = null;
      return;
    }
    const { dx, dy } = floatOf(t);
    const x = spot.x + dx, y = spot.y - BRUME_ALT + dy;
    drawBrume(ctx, x, y, spot, t, Boolean(this.quest && this.quest.done), s, this.brumeState);
    this.brumeHit = { x, y, r: BRUME_REACH * Math.max(1, 0.6 / s) };
  },
  // La caméra va vers l'objectif de la quête
  showQuestTarget() {
    const spot = this.brumeSpot();
    this.questOpen = false;
    if (!spot) return;
    this.cam.x = spot.x;
    this.cam.y = spot.y;
    this.clampCam();
    this.draw(performance.now());
  },
  // Un toucher sur Brume : réclamer si la récompense attend, sinon mener vers l'objectif ou lancer la Récolte ; sans
  // action possible, sa fiche (l'appui long l'ouvre toujours)
  questAct() {
    const quest = this.quest;
    if (quest && quest.done) this.claimQuest();
    else if (quest && quest.target) {
      this.showQuestTarget();
      this.$emit('show-alert', `Brume : ${quest.label}.`);
    } else if (quest && quest.kind === 'runs' && this.state.charges.count) this.questHarvest();
    else this.questOpen = true;
  },
  // Brume (quête active, actes finis), le nom du peuple et Anya : le tutoriel et les veillées (App.vue) y lisent où en
  // est le joueur. hold : un coffre est ouvert, ou va s'ouvrir (une veillée ou une scène l'attend)
  emitQuest() {
    const state = this.state;
    if (!state) return;
    const hold = Boolean(this.holdWreck || this.reveal || this.haul);
    this.$emit('quest', state.brume ? { ...state.brume, people: state.people || null, anya: state.anya || null, hold } : null);
  },
  // Naufrage à annoncer pour la quête active (déjà vus : retenus sur l'appareil)
  checkWreck() {
    let seen = [];
    try { seen = JSON.parse(localStorage.getItem('oc_wrecks') || '[]'); } catch (e) { seen = []; }
    const wreck = wreckOf(this.quest, Array.isArray(seen) ? seen : []);
    if (!wreck || this.wreck || this.reveal || this.haul || this.holdWreck) return;
    this.wreck = wreck;
    try { localStorage.setItem('oc_wrecks', JSON.stringify([...seen, wreck.id])); } catch (e) { /* le confort seulement */ }
  },
  // Fin de l'annonce : la caméra va vers le quartier où dort le naufragé
  closeWreck() {
    const zone = this.wreck && this.state && this.state.map.zones.find(z => z.id === this.wreck.zone);
    this.wreck = null;
    if (zone && zone.anchor) this.lookAtCell(zone.anchor.x, zone.anchor.y);
  },
  // Le souvenir retrouvé (bible, § 6.2 et § 14) : la caméra va vers le naufragé ; un éclat doré, sa réplique
  showMemory(questId) {
    const memory = memoryOf(questId);
    const resident = memory && this.village && this.village.residents.find(r => r.id === `vil:${memory.villager}`);
    const friend = memory && (this.state.villagers || []).find(v => v.id === memory.villager);
    if (!resident || !friend) return;
    this.lookAtCell(resident.work.x, resident.work.y);
    const g = this.ground(resident.work.x, resident.work.y);
    const sp = this.toScreen(g.x, g.y);
    const at = this.canvasPoint(sp.x, sp.y - 30);
    if (!this.reduced()) {
      ring(at, 110);
      burst(at, 30, 90);
    }
    this.showTip(sp.x, sp.y - 40, { title: `${friend.name} · ${friend.role}`, text: memory.line }, 6000);
  },
  // L'action de la quête active : la fiche de Brume se ferme, puis l'action (Grimoire, fiche, caméra…)
  runQuestAction() {
    const action = this.questAction;
    this.questOpen = false;
    if (action) action.run();
  },
  // La caméra va vers une case de l'île
  lookAtCell(x, y) {
    const g = this.ground(x, y);
    this.cam.x = g.x;
    this.cam.y = g.y;
    this.clampCam();
    this.draw(performance.now());
  },
  // Fiche d'un bâtiment, sur un onglet (s'il existe)
  openSiteSheet(id, tab) {
    const site = this.state && this.state.sites.find(s => s.id === id);
    if (!site) return;
    this.site = site;
    this.siteTab = tab === 'annexes' && site.annexes && site.annexes.length && site.level >= 2 ? 'annexes' : site.level ? 'overview' : 'evolution';
  },
  // Le nom du peuple (quête « peuple ») : enregistré par le serveur, qui renvoie la vue de l'île
  async namePeople() {
    const name = this.peopleName.trim();
    if (this.busy || name.length < 2) return;
    this.busy = true;
    try {
      this.apply(await playService.worldPeople(name));
      this.peopleName = '';
      this.$emit('show-alert', `Le peuple de « ${this.state.people} »`);
    } catch (error) {
      this.$emit('show-alert', messageOf(error, 'Ce nom n’a pas pu être donné.'));
    } finally {
      this.busy = false;
    }
  },
  // La quête demande une Récolte : la fiche se ferme, la Récolte commence
  questHarvest() {
    this.questOpen = false;
    this.startHarvest();
  },
  // Récompense de la quête active : versée par le serveur ; la fiche reste ouverte sur la quête suivante
  async claimQuest() {
    if (!this.quest || this.busy) return;
    // La dernière quête d'un acte donne aussi un coffre : il s'ouvre juste après les écus
    const chest = this.quest.chest ? `quete:${this.quest.id}` : null;
    const questId = this.quest.id;
    // Un coffre va s'ouvrir : le naufrage de la quête suivante l'attendra
    this.holdWreck = Boolean(chest);
    let claimed = false;
    this.busy = true;
    try {
      const hit = this.brumeHit;
      const { gained, coins, world } = await playService.worldQuest(this.quest.id);
      this.apply(world);
      this.$emit('coins-updated', coins);
      if (hit) {
        const sp = this.toScreen(hit.x, hit.y);
        const at = this.canvasPoint(sp.x, sp.y);
        ring(at, 90);
        burst(at, 24, 80);
      }
      vibrate([12, 30, 16]);
      this.$emit('show-alert', `Brume : +${gained} écus\u00a0!`);
      claimed = true;
    } catch (error) {
      this.$emit('show-alert', messageOf(error, 'La récompense n’a pas pu être reçue.'));
    } finally {
      this.busy = false;
    }
    if (claimed && chest) {
      this.questOpen = false;
      await this.openChest(chest);
    }
    this.holdWreck = false;
    this.emitQuest();
    if (claimed && chest) this.checkWreck();
    else if (claimed && memoryOf(questId)) {
      // Un souvenir rendu : la fiche se ferme sur la scène du souvenir retrouvé
      this.questOpen = false;
      this.$nextTick(() => this.showMemory(questId));
    }
  },
  // Un toucher sur un animal : les dauphins plongent, la baleine souffle, les mouettes posées s'envolent
  scare(animal) {
    if (this.reduced()) return;
    const t = performance.now() / 1000;
    for (const [key, was] of this.scared) if (t - was.at > 2 * GULL_BACK) this.scared.delete(key);
    if (animal.kind === 'pod') this.scared.set(animal.key, { at: t, where: animal.where });
    else if (animal.kind === 'whale') this.scared.set(animal.key, { at: t, ...animal.at });
    else this.scared.set(animal.key, { at: t });
    vibrate(6);
    this.draw(performance.now());
  },
  // Mouettes posées : quelques plages au bord de la mer (côté large), dans les quartiers à soi, libres (ni
  // chantier, ni création, ni arbre ou rocher)
  // Cases de sable libres au bord de la mer, dans les quartiers à soi (mouettes posées, bouteille à la mer)
  beachOf(state, owned, busy) {
    const M = this.M;
    const cells = [];
    for (let y = 0; y < state.size; y++) {
      for (let x = 0; x < state.size; x++) {
        if (M.ground(x, y) !== 's' || busy.has(`${x},${y}`)) continue;
        const zone = state.map.zones[M.zone(x, y)];
        if (!zone || !owned.has(zone.id) || state.sites.some(site => this.covers(site, x, y))) continue;
        if ([[1, 0], [0, 1]].some(([dx, dy]) => M.ground(x + dx, y + dy) === '~')) cells.push({ x, y });
      }
    }
    return cells;
  },
  // Bouteille à la mer qui attend : sur une plage libre (pas sous les mouettes), la même pour une même bouteille
  bottleSpotOf(state) {
    const bottle = state.chests && state.chests.bottle;
    if (!bottle || !bottle.available) return null;
    const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
    const busy = new Set([...(state.crafts ? state.crafts.placed : []), ...this.props, ...this.perches].map(c => `${c.x},${c.y}`));
    const cells = this.beachOf(state, owned, busy);
    const h = [...bottle.key].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
    return cells.length ? cells[h % cells.length] : null;
  },
  perchesOf(state) {
    const M = this.M;
    const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
    const busy = new Set([...(state.crafts ? state.crafts.placed : []), ...this.props].map(c => `${c.x},${c.y}`));
    const cells = this.beachOf(state, owned, busy);
    // La colonie de l'Îlot aux Mouettes : trois groupes plus nombreux au bord de l'îlot
    const colony = owned.has(COLONY_ZONE)
      ? this.islets.colony.filter(c => !busy.has(`${c.x},${c.y}`) && [[1, 0], [0, 1], [-1, 0], [0, -1]].some(([dx, dy]) => !M.land(c.x + dx, c.y + dy)))
      : [];
    return [
      ...spread(cells, 5, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 1 + (k % 2) })),
      ...spread(colony, 2, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 2 + (k % 2) }))
    ];
  },
  // Fumée des cheminées : bouffées qui montent, grossissent, s'effacent et partent avec le vent ; plus dense aux heures
  // des repas (on cuisine), plus courte sous la pluie
  drawSmoke(ctx, t, phase) {
    const meal = Math.max(...[7.5, 12.5, 19.5].map(h => 1 - Math.abs(phase.hour - h) / 1.2), 0);
    const thick = 0.55 + 0.45 * meal;
    const rise = 46 * (1 - phase.weather.rain * 0.35);
    for (const site of this.state.sites) {
      if (!site.level || this.raises.has(site.id)) continue;
      const c = this.centerOf(site);
      lookAt(site.id, site.level).smoke.forEach((at, j) => {
        const [sx, sy] = P(...at);
        for (let i = 0; i < 4; i++) {
          const k = (t * 0.32 + i / 4 + j * 0.13) % 1;
          const x = c.x + sx + k * 16 + this.windAt(t, i + j) * 4 * k;
          const y = c.y + sy - k * rise;
          const tone = phase.night > 0.5 ? '170,175,200' : '236,232,224';
          ctx.fillStyle = `rgba(${tone},${(0.5 * thick * (1 - k)).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, y, 3.5 + k * 9, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }
  },
  // Lumières : fenêtres et feux s'allument une à une quand la scène s'assombrit (soir, nuit, gros temps) ; lucioles
  // la nuit, par temps sec
  drawLights(ctx, t, phase) {
    const lit = phase.lit;
    // Chaque fenêtre a son seuil : les lumières s'allument l'une après l'autre
    const litFor = key => Math.min(1, Math.max(0, (lit - hash(key, 17) * 0.4) / 0.3));
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const site of this.state.sites) {
      if (!site.level || this.raises.has(site.id)) continue;
      const look = lookAt(site.id, site.level);
      const lights = look.lights;
      const c = this.centerOf(site);
      const fire = look.fire;
      lights.forEach(([u, v, z, r], i) => {
        const [lx, ly] = P(u, v, z);
        const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + i) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + i);
        glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(site.x * 7 + site.y + i)) * flicker);
      });
      for (const item of site.shop || []) {
        const light = item.owned && itemLight(item.id, site.level);
        if (!light) continue;
        const [lx, ly] = P(light[0], light[1], light[2]);
        glow(ctx, c.x + lx, c.y + ly, light[3], lit * (0.9 + 0.1 * Math.sin(t * 3 + light[0])), light[4]);
      }
      // Pièce rare portée : lampions, lucioles, lave…
      for (const [x, y, r, color, strength] of rareLights(site.skin, site.level, t)) {
        glow(ctx, c.x + x, c.y + y, r, lit * strength * (0.9 + 0.1 * Math.sin(t * 3 + x)), color);
      }
    }
    // Annexes : lanternes, braises, four et haut fourneau (le feu brûle même de jour)
    for (const annex of this.state.annexes || []) {
      const light = annexLight(annex.annex);
      if (!light) continue;
      const [u, v, z, r, color, fire] = light;
      const c = this.ground(annex.x, annex.y);
      const [lx, ly] = P(u, v, z);
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + annex.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + annex.y);
      glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(annex.x * 13 + annex.y)) * flicker, color);
    }
    // Lave : elle luit dans la nuit, en palpitant
    for (const c of this.lavaCells || []) {
      glow(ctx, c.x, c.y, 30, (0.08 + 0.92 * lit) * (0.8 + 0.2 * Math.sin(t * 1.7 + c.x * 0.05) * Math.sin(t * 2.9 + c.y * 0.07)), '255,110,40');
    }
    // Lieux remarquables : bouche de la grotte, gravures des menhirs, lanterne des pilotis, lave (elle luit même de jour)
    for (const landmark of this.shownLandmarks) {
      const light = landmarkLight(landmark.id);
      if (!light) continue;
      const [u, v, z, r, color, fire] = light;
      const c = this.ground(landmark.x, landmark.y);
      const k = landmarkScale(landmark.id);
      const [lx, ly] = P(u, v, z);
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 9 + landmark.x) * Math.sin(t * 5.3) : 0.9 + 0.1 * Math.sin(t * 1.6 + landmark.y);
      glow(ctx, c.x + lx * k, c.y + ly * k, r * k, (fire ? Math.max(0.35, lit) : lit) * flicker, color);
    }
    // Créations d'île : lanterne, brasero (son feu brûle même de jour), fontaine, kiosque
    for (const craft of this.crafted) {
      const light = craftLight(craft.craft);
      if (!light) continue;
      const [u, v, z, r, color, fire] = light;
      const c = this.ground(craft.x, craft.y);
      const [lx, ly] = P(u, v, z);
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + craft.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + craft.y);
      glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(craft.x * 11 + craft.y)) * flicker, color);
    }
    // Enseignes à lanternes
    for (const site of this.state.sites) {
      if (!site.sign || site.locked) continue;
      const lights = nameSignLight(site.sign);
      if (!lights.length) continue;
      const at = this.nameSignAt(site);
      for (const [dx, dy, r] of lights) glow(ctx, at.x + dx * NAME_SIGN_SCALE, at.y + dy * NAME_SIGN_SCALE, r * NAME_SIGN_SCALE, Math.max(0.3, lit) * (0.85 + 0.15 * Math.sin(t * 11 + dx) * Math.sin(t * 6.1)));
    }
    // Lanternes des habitants qui rentrent le soir
    for (const l of this.villageLights) {
      const p = this.ground(l.x, l.y);
      glow(ctx, p.x + l.dx, p.y + l.dy, 14, lit * (0.9 + 0.1 * Math.sin(t * 5 + l.x)), '255,214,130');
    }
    // Lanternes du pont de l'Îlot aux Mouettes, lanterne de la barque du passeur
    for (const lamp of this.islets.lamps) {
      const p = lampGlowOf(lamp);
      glow(ctx, p.x, p.y, 16, lit * (0.92 + 0.08 * Math.sin(t * 2 + lamp.x)));
    }
    if (this.ferry) {
      const c = worldOf(this.ferry.x, this.ferry.y, this.ferry.z);
      glow(ctx, c.x + (this.ferry.flip ? 19 : -19), c.y - 18, 16, lit);
    }
    if (phase.night > 0.35 && phase.weather.rain < 0.3) {
      const strength = ((phase.night - 0.35) / 0.65) * (1 - phase.weather.rain / 0.3);
      for (const fly of fireflies(t, this.state.size)) {
        const p = this.ground(fly.x, fly.y);
        glow(ctx, p.x, p.y - fly.z, 9, strength * fly.a, '255,236,140');
        ctx.fillStyle = `rgba(255,250,200,${(strength * fly.a).toFixed(3)})`;
        ctx.fillRect(p.x - 1, p.y - fly.z - 1, 2, 2);
      }
    }
    ctx.restore();
  },
  // Nom du lieu, lisible dès qu'on est assez près
  drawLabel(ctx, site) {
    const c = this.centerOf(site);
    const k = 1 / Math.min(1, this.cam.s);
    ctx.font = `800 ${12 * k}px Nunito, system-ui, sans-serif`;
    const w = ctx.measureText(site.name).width + 14 * k;
    const h = 18 * k;
    const y = c.y + TH * (0.62 + (site.w - 2) * 0.5);
    // Un habitant passe sous le nom (sa zone de toucher, de la tête aux pieds) : le nom s'efface à demi, pour ne pas lui
    // cacher la tête
    const under = (this.landHits || []).some(hit => hit.kind === 'villager' && Math.abs(hit.x - c.x) < w / 2 + hit.r
      && hit.y - hit.r - 14 < y + h / 2 && hit.y + hit.r > y - h / 2);
    ctx.save();
    if (under) ctx.globalAlpha = 0.3;
    ctx.fillStyle = site.level ? 'rgba(251, 246, 234, .92)' : 'rgba(74, 52, 38, .82)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(c.x - w / 2, y - h / 2, w, h, h / 2);
    else ctx.rect(c.x - w / 2, y - h / 2, w, h);
    ctx.fill();
    ctx.fillStyle = site.level ? '#4A3426' : '#FBF6EA';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(site.name, c.x, y + 0.5);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  },
  // Lieu remarquable, un peu plus grand que sa case (landmarkScale) : il surgit à sa découverte, sautille au toucher ;
  // sous la brume d'un quartier à acheter, à demi effacé
  drawLandmark(ctx, landmark, t, now, repaint) {
    const c = this.ground(landmark.x, landmark.y);
    const key = `landmark:${landmark.id}`;
    const started = this.pops.get(key);
    let scale = landmarkScale(landmark.id);
    if (started) {
      const k = Math.min(1, (now - started) / 600);
      const back = 1.7;
      scale *= 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
      if (k >= 1) this.pops.delete(key);
    }
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 4 : 0;
    const zone = this.zoneAt(landmark.x, landmark.y);
    const mist = this.mistOf(zone, now);
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    ctx.scale(scale, scale);
    if (mist) ctx.globalAlpha = 1 - 0.5 * mist;
    // Le Cercle de menhirs fleurit une fois Anya révélée
    const bloom = landmark.id === 'menhirs' && Boolean(this.state.anya && this.state.anya.revealed);
    for (const layer of landmarkLayers(landmark.id, this.reduced() ? 0 : t, bloom)) drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
    ctx.restore();
  },
  // Gisement de trouvailles, un peu plus grand que sa case : plein (animé) ou ramassé ; prêt dans un quartier à soi,
  // un anneau doré bat au sol sous lui. Il saute au ramassage, sautille au toucher ; sous la brume d'un quartier à
  // acheter, à demi effacé
  drawDeposit(ctx, deposit, t, now, repaint) {
    const ready = !depositWait(deposit, this.clock - this.loadedAt);
    const layer = depositLayer(deposit.find, ready, this.reduced() ? 0 : t);
    if (!layer) return;
    const c = this.ground(deposit.x, deposit.y);
    const zone = this.zoneAt(deposit.x, deposit.y);
    if (ready && zone && zone.owned) {
      const pulse = this.reduced() ? 1 : 0.5 + 0.5 * Math.sin(t * 3 + deposit.x);
      ctx.beginPath();
      ctx.ellipse(c.x, c.y, TW * 0.36, TH * 0.36, 0, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 214, 94, ${(0.16 + 0.14 * pulse).toFixed(3)})`;
      ctx.fill();
      // (un trait sombre sous le trait doré : lisible sur le sable et la neige)
      ctx.strokeStyle = 'rgba(92, 56, 12, .5)';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.strokeStyle = `rgba(255, 214, 94, ${(0.6 + 0.35 * pulse).toFixed(3)})`;
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }
    const key = `deposit:${deposit.id}`;
    const started = this.pops.get(key);
    let scale = DEPOSIT_SCALE;
    if (started) {
      const k = Math.min(1, (now - started) / 450);
      const back = 1.7;
      scale *= 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
      if (k >= 1) this.pops.delete(key);
    }
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 4 : 0;
    const mist = this.mistOf(zone, now);
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    ctx.scale(scale, scale);
    if (mist) ctx.globalAlpha = 1 - 0.5 * mist;
    drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
    ctx.restore();
  },
  // Étoile dorée qui bat au-dessus de chaque lieu d'un quartier à soi encore à découvrir (seen : case à l'écran)
  drawBeacons(ctx, t, seen) {
    const still = this.reduced();
    for (const landmark of landmarksWaiting(this.state)) {
      if (!seen(landmark.x, landmark.y)) continue;
      const c = this.ground(landmark.x, landmark.y);
      const y = c.y + landmarkTop(landmark.id) * landmarkScale(landmark.id) * 0.85 + (still ? 0 : Math.sin(t * 2.4) * 3);
      const pulse = still ? 1 : 0.5 + 0.5 * Math.sin(t * 4);
      glow(ctx, c.x, y, 22, 0.55 + 0.35 * pulse, '255,214,94');
      ctx.save();
      ctx.translate(c.x, y);
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 ? 4 : 10 + pulse * 1.5;
        const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fillStyle = '#FFD45E';
      ctx.strokeStyle = 'rgba(92, 56, 12, .85)';
      ctx.lineWidth = 1.6;
      ctx.lineJoin = 'round';
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  },
  // Création d'île posée : elle surgit à la pose, sautille au toucher, s'efface à demi pendant qu'on la déplace
  drawCraft(ctx, craft, t, now, repaint) {
    const c = this.ground(craft.x, craft.y);
    const key = `craft:${craft.x},${craft.y}`;
    const started = this.pops.get(key);
    let scale = 1;
    if (started) {
      const k = Math.min(1, (now - started) / 450);
      const back = 1.7;
      scale = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
      if (k >= 1) this.pops.delete(key);
    }
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
    const from = this.craftPlacing && this.craftPlacing.from;
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    if (scale !== 1) ctx.scale(scale, scale);
    if (from && from.x === craft.x && from.y === craft.y) ctx.globalAlpha = 0.45;
    for (const layer of craftLayers(craft.craft, t)) drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
    ctx.restore();
  },

  // Annexe posée sur sa case : elle surgit à la pose, sautille au toucher, s'efface à demi pendant qu'on la déplace
  drawAnnex(ctx, annex, t, now, repaint) {
    const c = this.ground(annex.x, annex.y);
    const key = `annex:${annex.x},${annex.y}`;
    const started = this.pops.get(key);
    let scale = 1;
    if (started) {
      const k = Math.min(1, (now - started) / 450);
      const back = 1.7;
      scale = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
      if (k >= 1) this.pops.delete(key);
    }
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
    const from = this.annexPlacing && this.annexPlacing.from;
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    if (scale !== 1) ctx.scale(scale, scale);
    if (from && from.x === annex.x && from.y === annex.y) ctx.globalAlpha = 0.45;
    for (const layer of annexLayers(annex.annex, this.annexVariants.get(`${annex.x},${annex.y}`) || 0, t)) drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
    ctx.restore();
  }
};
