// Ce qui se pose sur l'île : bâtiments (chantier, élévation, articles, enseigne), panneaux des quartiers à acheter,
// noms des lieux, lieux remarquables, gisements et leurs balises, créations, annexes. Méthodes de WorldView.vue (this :
// le composant), réunies par draw.js.

import { glow } from '@/world/scene';
import { drawSprite, imageOf } from '@/world/spriteCache';
import { glyph } from '@/book/painter';
import { lookAt } from '@/world/looks';
import { buildingArt, chantierArt } from '@/world/buildingArt';
import { P } from '@/world/iso';
import { itemLayers } from '@/world/shopSprites';
import { objectLayers } from '@/world/objectArt';
import { SIGN } from '@/world/nature';
import { isletArtLayer, cultureLayer, cropOf } from '@/world/decorArt';
import { nameSignLayers, paintName } from '@/world/nameSigns';
import { landmarksWaiting } from '@/world/landmarks';
import { annexLayers } from '@/world/annexSprites';
import { landmarkScale, landmarkLayers, landmarkTop } from '@/world/landmarkSprites';
import { craftLayers } from '@/world/craftSprites';
import { depositWait, lockOf } from '@/world/finds';
import { depositLayer } from '@/world/depositSprites';
import { campLayer } from '@/world/campArt';
import { blightLayer, cloudLayer } from '@/world/nightArt';
import { reserveLayer, reserveState } from '@/world/reserveArt';
import { TINT, RGB, font, warm, labelShift } from '@/world/charte';
import { RAISE_END, raiseShape, drawScaffold, drawBuildDust, applyPose, FIND_BURST_MS, POSE_IMPACT_MS } from '@/world/fetes';
import { HUD_ILE } from '@/utils/cadre';
import { TW, TH, DEPOSIT_SCALE, NAME_SIGN_ALONG, NAME_SIGN_INSET, NAME_SIGN_SCALE } from '../constants';

// #rrggbb → « r, g, b »
const hexRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16)).join(', ');
// Le HUD de l'île (utils/cadre.js : HUD_ILE), que les noms des lieux évitent, est relu toutes les HUD_MS (hudObstacles)
const HUD_MS = 500;

// (construction ou amélioration : le chantier tremble dans la poussière, puis le bâtiment s'élève, en RAISE_MS ; sa
// fête suit ce rythme : world/fetes.js)

export default {
  drawSite(ctx, site, t, now, repaint) {
    // Sous la brume : à peine visible, comme une promesse
    const siteZone = this.zoneAt(site.x, site.y);
    const mist = this.mistOf(siteZone, now);
    if (mist) {
      ctx.save();
      ctx.globalAlpha = 1 - this.mistFade(0.55, siteZone) * mist;
      this.paintSite(ctx, site, t, now, repaint);
      ctx.restore();
      return;
    }
    // Embrumé par un égaré (nuits) : grisé, sous son voile de brume, le petit nuage grognon au-dessus
    if (site.level && this.blightOf(site)) {
      ctx.save();
      ctx.filter = 'grayscale(0.8)';
      this.paintSite(ctx, site, t, now, repaint);
      ctx.restore();
      this.drawBlight(ctx, site, t, null, repaint);
      return;
    }
    this.paintSite(ctx, site, t, now, repaint);
    // Tout juste réparé : la brume se dissipe (une fois)
    const healed = this.heals.get(site.id);
    if (healed !== undefined && !this.drawBlight(ctx, site, t, now - healed, repaint)) this.heals.delete(site.id);
  },
  // La brume d'un bâtiment embrumé, au centre de son emprise, et le nuage grognon au-dessus ; heal : ms depuis sa
  // réparation (sa guérison), sinon null. false : rien à dessiner (guérison finie)
  drawBlight(ctx, site, t, heal, repaint) {
    const c = this.centerOf(site);
    const t0 = this.reduced() ? 0 : t;
    const mist = blightLayer(site.w, t0, heal);
    if (!mist) return false;
    drawSprite(ctx, mist.key, mist.make, c.x, c.y, repaint, `blight:${site.id}`);
    if (heal !== null) return true;
    const cloud = cloudLayer(t0);
    if (cloud) drawSprite(ctx, cloud.key, cloud.make, c.x, c.y - TW * 0.6 * site.w + Math.sin(t0 * 1.8) * 2, repaint, `blight-cloud:${site.id}`);
    return true;
  },
  paintSite(ctx, site, t, now, repaint) {
    const c = this.centerOf(site);
    const raise = this.raises.get(site.id);
    const ms = raise ? now - raise.at : RAISE_END;
    if (raise && ms >= RAISE_END) this.raises.delete(site.id);
    // Tout juste déplacé : il tombe à sa place, avec ses articles (world/fetes.js : poseShape ; pas pendant son élévation)
    const pose = ms < RAISE_END ? null : this.poseOf(`site:${site.id}`, now);
    if (pose) {
      ctx.save();
      ctx.translate(c.x, c.y);
      applyPose(ctx, pose);
      ctx.translate(-c.x, -c.y);
    }
    if (!site.level) {
      // Chantier, dans sa phase ; tout prêt, un peu de poussière de temps en temps
      const stage = this.stageOf(site);
      const lib = chantierArt(stage);
      if (lib) drawSprite(ctx, lib.key, lib.make, c.x, c.y, repaint, `site:${site.id}`);
      if (stage === 2 && !site.locked) {
        const puff = (t * 0.5) % 1;
        if (puff < 0.4) this.dust(ctx, c.x, c.y + 6, puff / 0.4, 3);
      }
      if (!site.locked && site.next && site.next.planEmoji) glyph(ctx, site.next.planEmoji, c.x, c.y - TW * 1.02 + Math.sin(t * 2) * 2, TW * 0.46, repaint, site.next.planOwned ? 0.95 : 0.4);
      if (pose) ctx.restore();
      return;
    }
    const look = lookAt(site.id, site.level);
    const skin = site.skin || '';
    // Le dessin de la bibliothèque (partie fixe, bloc qui bouge, voilier), sous un skin dessiné, une teinte ou celle
    // d'une pièce rare (son accessoire animé : drawItems)
    const art = buildingArt(site.id, site.level, skin);
    const body = this.siteBody(site.id, site.level, skin);
    const span = site.w / 2;
    if (ms < RAISE_END) {
      // Le chantier vivant (world/fetes.js) : l'échafaudage se monte autour de l'ancien état qui tremble et se tasse,
      // le nouveau bâtiment monte derrière un rideau de poussière, s'écrase et rebondit ; éclats et onde à l'impact.
      // (Au palier IV, l'emprise grandit : l'ancien bâtiment, plus petit, est dessiné au centre de la nouvelle.)
      const shape = raiseShape(ms);
      const { hw, hh, top } = this.siteAt(site);
      const seed = site.id.length * 13 + site.level;
      drawScaffold(ctx, c.x, c.y, hw, hh, top, ms, 'back');
      const was = shape.old ? this.siteBody(site.id, raise.from || 0, skin) : null;
      const sprite = shape.old ? was : body;
      if (sprite) {
        ctx.save();
        if (!shape.old) {
          // Le bâtiment sort de terre : découpé au ras du sol (bas de l'emprise), il monte de 96 px (plus s'il est grand)
          ctx.beginPath();
          ctx.rect(c.x - TW * (span + 0.4), c.y - TW * (2 * span + 1.6), TW * (2 * span + 0.8), TW * (2 * span + 1.6) + TH * (span + 0.05));
          ctx.clip();
        }
        ctx.translate(c.x + shape.shake, c.y + shape.lift * 96 * span);
        ctx.scale(shape.sx, shape.sy);
        drawSprite(ctx, sprite.key, sprite.make, 0, 0, repaint);
        ctx.restore();
      }
      drawScaffold(ctx, c.x, c.y, hw, hh, top, ms, 'front');
      drawBuildDust(ctx, c.x, c.y, hw, hh, ms, seed, top > 110 ? 1.25 : 1);
      return;
    }
    // Articles de la boutique : ceux de derrière avant le bâtiment, les autres après lui
    this.drawItems(ctx, site, c, t, now, repaint, true);
    if (body) this.swayed(ctx, body.key, body.make, c.x, c.y, look.sway * this.windOf(t, site.x, site.y), repaint, `site:${site.id}`, true);
    // Parties vivantes du palier (flamme, jets d'eau, ailes de moulin, roue…), puis le voilier bercé du Ponton
    if (art && art.anim) {
      const frame = art.anim.frame(Math.floor((t * 1000) / art.anim.ms) % art.anim.n);
      drawSprite(ctx, frame.key, frame.make, c.x, c.y, repaint, `site:${site.id}:anim`);
    }
    if (look.boat && art && art.boat) {
      const [bx, by] = P(...look.boat, 0);
      ctx.save();
      ctx.translate(c.x + bx, c.y + by + Math.sin(t * 1.4) * 1.6);
      ctx.rotate(Math.sin(t * 1.1) * 0.035);
      // Le voilier de la bibliothèque est déjà à sa place autour de l'ancre du bâtiment
      drawSprite(ctx, art.boat.key, art.boat.make, -bx, -by, repaint);
      ctx.restore();
    }
    this.drawItems(ctx, site, c, t, now, repaint, false);
    if (pose) ctx.restore();
  },
  // Corps d'un bâtiment à un palier (0 : le chantier tout prêt), { key, make } pour le cache des sprites : la partie fixe
  // du dessin de la bibliothèque (sous un skin dessiné, une teinte ou celle d'une pièce rare) ; null si elle ne l'a pas
  siteBody(siteId, level, skin) {
    if (!level) return chantierArt(2);
    const art = buildingArt(siteId, level, skin);
    return art ? art.base : null;
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
  drawItems(ctx, site, c, t, now, repaint, back) {
    for (const item of site.shop || []) {
      if (!item.owned || (item.kind === 'skin' && site.skin !== item.id)) continue;
      // Toucher : l'article sautille (0,5 s) ; tout juste acheté, il tombe à sa place (world/fetes.js : poseShape)
      const key = `item:${site.id}:${item.id}`;
      const tapped = this.scared.get(key);
      const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 6 : 0;
      const pose = this.poseOf(key, now);
      // Dessin de la bibliothèque, sinon celui du jeu (accessoire d'une pièce rare)
      for (const layer of objectLayers(item.id, site.level, t) || itemLayers(item.id, site.level, t)) {
        if (layer.back !== back) continue;
        const [x, y] = [c.x + layer.offset[0], c.y + layer.offset[1] - hop];
        if (pose) {
          ctx.save();
          ctx.translate(x, y);
          applyPose(ctx, pose);
          drawSprite(ctx, layer.key, layer.make, 0, 0, repaint);
          ctx.restore();
        } else drawSprite(ctx, layer.key, layer.make, x, y, repaint);
        // Zone de toucher : le cadre de l'image (les pièces rares font partie du bâtiment)
        if (item.kind !== 'skin') {
          const { box } = imageOf(layer.key, layer.make, repaint);
          this.itemHits.push({ item, site, x: x + box.x + box.w / 2, y: y + box.y + box.h / 2, r: Math.max(10, Math.min(box.w, box.h) * 0.5) });
        }
      }
    }
  },
  // Panneau d'un quartier à acheter : prix, ou chapitre du Livre encore fermé (au tutoriel, La Source : à découvrir) ;
  // il se balance un peu
  drawSign(ctx, { zone, at }, t, repaint) {
    const c = this.ground(at.x, at.y);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(Math.sin(t * 1.3 + at.x) * 0.02);
    // (le panneau de la bibliothèque, sinon celui du code ; le prix s'écrit au même endroit)
    const lib = isletArtLayer('panneau_quartier');
    drawSprite(ctx, lib ? lib.key : 'sign', lib ? lib.make : SIGN, 0, 0, repaint);
    ctx.font = font(900, 7.5);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = TINT.ink;
    const going = this.state.expedition && this.state.expedition.zone === zone.id;
    ctx.fillText(zone.known === false ? (going ? 'En route' : zone.explorable ? 'Explorer' : '? ? ?') : zone.plan ? 'Découvrir' : zone.open ? `${zone.price} écus` : `Chap. ${zone.chapter}`, 0, -31.5);
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
  // La réserve d'un bâtiment qui produit (reserveArt.js) : devant lui, à gauche, vide, à moitié ou pleine (elle brille)
  reserveAt(site) {
    const gx = site.x + 0.5;
    const gy = site.y + site.h + 0.3;
    return { gx, gy, ...this.ground(gx, gy) };
  },
  drawReserve(ctx, site, t, repaint) {
    const layer = reserveLayer(site.id, reserveState(site, this.clock - this.loadedAt), this.reduced() ? 0 : t);
    if (!layer) return;
    const at = this.reserveAt(site);
    drawSprite(ctx, layer.key, layer.make, at.x, at.y, repaint, `reserve:${site.id}`);
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
  // Nom du lieu, lisible dès qu'on est assez près. Un habitant, une bête ou une bulle passe dessous : le nom s'écarte
  // doucement vers le bas pour ne rien cacher (s'il n'a aucune place libre, il s'efface à demi). La nuit, une petite
  // lanterne : ton plus chaud, lueur dorée (world/charte.js)
  drawLabel(ctx, site, now) {
    const c = this.centerOf(site);
    const k = 1 / Math.min(1, this.cam.s);
    const night = this.phase ? this.phase.night : 0;
    ctx.font = font(800, 12 * k);
    const w = ctx.measureText(site.name).width + 14 * k;
    const h = 18 * k;
    const y0 = c.y + TH * (0.62 + (site.w - 2) * 0.5);
    // (de la tête aux pieds ; les bulles de production de l'image d'avant)
    const obstacles = [
      ...(this.landHits || []).map(hit => ({ x0: hit.x - hit.r, x1: hit.x + hit.r, y0: hit.y - (hit.head || hit.r), y1: hit.y + hit.r })),
      ...this.bubbles.map(b => ({ x0: b.x - b.w / 2, x1: b.x + b.w / 2, y0: b.y - b.h / 2, y1: b.y + b.h / 2 + 6 * k }))
    ];
    const hud = this.hudObstacles(now);
    const free = labelShift(c.x, y0, w, h, [...obstacles, ...hud]);
    const dy = this.easeLabel(site.id, free, now);
    const y = y0 + dy;
    // (sans place libre, coincé sous le HUD : il ne se montre pas à demi sous la barre, il attend d'en sortir)
    if (free === null && labelShift(c.x, y, w, h, hud) === null) return;
    ctx.save();
    if (free === null) ctx.globalAlpha = 0.3;
    ctx.shadowColor = `rgba(${RGB.glow}, ${(0.55 * night).toFixed(3)})`;
    ctx.shadowBlur = 10 * k * night;
    ctx.fillStyle = site.level
      ? `rgba(${hexRgb(warm(TINT.vellum, night))}, ${(0.92 - 0.06 * night).toFixed(3)})`
      : `rgba(${RGB.shade}, ${(0.82 - 0.1 * night).toFixed(3)})`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(c.x - w / 2, y - h / 2, w, h, h / 2);
    else ctx.rect(c.x - w / 2, y - h / 2, w, h);
    ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = site.level ? TINT.ink : TINT.vellum;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(site.name, c.x, y + 0.5);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  },
  // Ce que le HUD de l'île couvre (la barre du haut, les colonnes de boutons, le suivi des quêtes, la Récolte), en unités
  // du monde : un nom ne passe pas dessous, il s'écarte comme d'un habitant. Les rectangles de l'écran sont relus
  // toutes les HUD_MS (le HUD bouge rarement : rien n'est mesuré à chaque image), la caméra les ramène au monde
  hudObstacles(now) {
    if (!this.hudRects || now - this.hudRectsAt > HUD_MS) {
      this.hudRectsAt = now;
      const canvas = this.$refs.canvas;
      const base = canvas ? canvas.getBoundingClientRect() : null;
      this.hudRects = base ? [...document.querySelectorAll(HUD_ILE)].map(el => el.getBoundingClientRect()).filter(r => r.width > 0 && r.height > 0)
        .map(r => ({ x0: r.left - base.left, y0: r.top - base.top, x1: r.right - base.left, y1: r.bottom - base.top })) : [];
    }
    return this.hudRects.map(r => {
      const a = this.toWorld(r.x0, r.y0), b = this.toWorld(r.x1, r.y1);
      return { x0: a.x, y0: a.y, x1: b.x, y1: b.y };
    });
  },
  // Décalage d'un nom vers sa place libre (free : décalage voulu, ou null), en glissant ; il ne revient à sa place
  // qu'après un instant sans obstacle (un habitant qui passe ne le fait pas aller et venir)
  easeLabel(id, free, now) {
    const s = this.labelShifts.get(id) || { dy: 0, at: now, keep: 0 };
    let goal = free === null ? s.dy : free;
    if (goal !== 0) s.keep = now + 700;
    else if (now < s.keep) goal = s.dy;
    const dt = Math.min(0.1, Math.max(0, now - s.at) / 1000);
    s.dy = this.reduced() ? goal : s.dy + (goal - s.dy) * Math.min(1, dt * 10);
    s.at = now;
    this.labelShifts.set(id, s);
    return s.dy;
  },
  // Lieu remarquable, un peu plus grand que sa case (landmarkScale) : à sa découverte, il tombe à sa place à l'éclat de
  // sa fête ; il sautille au toucher ; sous la brume d'un quartier à acheter, à demi effacé
  drawLandmark(ctx, landmark, t, now, repaint) {
    const c = this.ground(landmark.x, landmark.y);
    const key = `landmark:${landmark.id}`;
    const pose = this.poseOf(key, now, FIND_BURST_MS - POSE_IMPACT_MS);
    const scale = landmarkScale(landmark.id);
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 4 : 0;
    const zone = this.zoneAt(landmark.x, landmark.y);
    const mist = this.mistOf(zone, now);
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    if (pose) applyPose(ctx, pose);
    ctx.scale(scale, scale);
    // (sous la brume du tutoriel, il se devine à peine, comme le décor)
    if (this.hiddenCell(landmark.x, landmark.y)) ctx.globalAlpha = 0.1;
    else if (mist) ctx.globalAlpha = 1 - this.mistFade(0.5, zone) * mist;
    // Le Cercle de menhirs fleurit une fois Anya révélée
    const bloom = landmark.id === 'menhirs' && Boolean(this.state.anya && this.state.anya.revealed);
    landmarkLayers(landmark.id, this.reduced() ? 0 : t, bloom).forEach((layer, i) => drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, `landmark:${landmark.id}:${i}`));
    ctx.restore();
  },
  // Gisement de trouvailles, un peu plus grand que sa case : plein (animé) ou ramassé ; prêt dans un quartier à soi,
  // un anneau doré bat au sol sous lui. Il saute au ramassage, sautille au toucher ; sous la brume d'un quartier à
  // acheter, à demi effacé
  drawDeposit(ctx, deposit, t, now, repaint) {
    const wait = depositWait(deposit, this.clock - this.loadedAt);
    const ready = !wait;
    const layer = depositLayer(deposit.find, ready, this.reduced() ? 0 : t, wait);
    if (!layer) return;
    const c = this.ground(deposit.x, deposit.y);
    const zone = this.zoneAt(deposit.x, deposit.y);
    if (ready && zone && zone.owned && !lockOf(this.state, deposit)) {
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
    if (mist) ctx.globalAlpha = 1 - this.mistFade(0.5, zone) * mist;
    drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, key);
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
  // Création d'île posée : elle tombe à sa place à la pose (world/fetes.js : poseShape), sautille au toucher, s'efface
  // à demi pendant qu'on la déplace ; en miroir si elle est pivotée ; l'aperçu d'une pose (ghost) en transparence
  drawCraft(ctx, craft, t, now, repaint) {
    const c = this.ground(craft.x, craft.y);
    const key = `craft:${craft.x},${craft.y}`;
    const pose = this.poseOf(key, now);
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
    const from = this.craftPlacing && this.craftPlacing.from;
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    if (pose) applyPose(ctx, pose);
    if (craft.flip) ctx.scale(-1, 1);
    if ((from && from.x === craft.x && from.y === craft.y) || craft.ghost) ctx.globalAlpha = craft.ghost ? 0.7 : 0.45;
    // (une porte à verrou porte son cadenas)
    const look = craft.craft === 'porte' && craft.locked ? 'porte-verrou' : craft.craft;
    craftLayers(look, t).forEach((layer, i) => drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, `craft:${craft.x},${craft.y}:${i}`));
    ctx.restore();
  },

  // Un élément du camp des naufragés (épave, coin d'un maître, tente, objet), ancré au centre de son emprise au sol
  drawCamp(ctx, item, t, repaint) {
    const layer = campLayer(item.art, this.reduced() ? 0 : t);
    if (!layer) return;
    const c = item.w > 1 ? this.centerOf(item) : this.ground(item.x, item.y);
    drawSprite(ctx, layer.key, layer.make, c.x, c.y, repaint, `camp:${item.id}`);
  },

  // Où en est la réserve d'un bâtiment, de 0 (tout juste ramassée) à 1 (pleine)
  growthOf(siteId) {
    const site = this.state.sites.find(s => s.id === siteId);
    if (!site || site.fullIn === null || site.fullIn === undefined || !site.capHours) return 1;
    const left = Math.max(0, site.fullIn - (this.clock - this.loadedAt));
    return 1 - left / (site.capHours * 3600000);
  },
  // Annexe posée sur sa case : elle tombe à sa place à la pose (world/fetes.js : poseShape), sautille au toucher,
  // s'efface à demi pendant qu'on la déplace ; en miroir si elle est pivotée, dans sa couleur ; l'aperçu d'une pose
  // (ghost) en transparence
  drawAnnex(ctx, annex, t, now, repaint) {
    const c = this.ground(annex.x, annex.y);
    const key = `annex:${annex.x},${annex.y}`;
    const pose = this.poseOf(key, now);
    const tapped = this.scared.get(key);
    const hop = tapped && t - tapped.at < 0.5 ? Math.sin(((t - tapped.at) / 0.5) * Math.PI) * 5 : 0;
    const from = this.annexPlacing && this.annexPlacing.from;
    ctx.save();
    ctx.translate(c.x, c.y - hop);
    if (pose) applyPose(ctx, pose);
    if (annex.flip) ctx.scale(-1, 1);
    if ((from && from.x === annex.x && from.y === annex.y) || annex.ghost) ctx.globalAlpha = annex.ghost ? 0.7 : 0.45;
    const variant = annex.ghost ? annex.look : this.annexVariants.get(`${annex.x},${annex.y}`) || 0;
    // Un champ pousse avec la réserve de son bâtiment : bêché juste après le ramassage, mûr quand elle est pleine
    const growing = annex.annex === 'champ' && !annex.ghost && cultureLayer(cropOf(variant), this.growthOf(annex.site), t);
    const layers = growing ? [growing] : annexLayers(annex.annex, variant, t);
    layers.forEach((layer, i) => drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, `${key}:${i}`));
    ctx.restore();
  }
};
