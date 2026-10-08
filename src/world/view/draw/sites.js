// Ce qui se pose sur l'île : bâtiments (chantier, élévation, articles, enseigne), panneaux des quartiers à acheter,
// noms des lieux, lieux remarquables, gisements et leurs balises, créations, annexes. Méthodes de WorldView.vue (this :
// le composant), réunies par draw.js.

import { glow } from '@/world/scene';
import { drawSprite, imageOf } from '@/world/spriteCache';
import { BUILDINGS } from '@/world/sprites';
import { glyph } from '@/book/painter';
import { lookAt, boatOffset, boatOf } from '@/world/looks';
import { buildingArt, chantierArt } from '@/world/buildingArt';
import { P } from '@/world/iso';
import { itemLayers } from '@/world/shopSprites';
import { objectLayers } from '@/world/objectArt';
import { SIGN } from '@/world/nature';
import { isletArtLayer } from '@/world/decorArt';
import { nameSignLayers, paintName } from '@/world/nameSigns';
import { landmarksWaiting } from '@/world/landmarks';
import { annexLayers } from '@/world/annexSprites';
import { landmarkScale, landmarkLayers, landmarkTop } from '@/world/landmarkSprites';
import { craftLayers } from '@/world/craftSprites';
import { depositWait } from '@/world/finds';
import { depositLayer } from '@/world/depositSprites';
import { campLayer } from '@/world/campArt';
import { TW, TH, DEPOSIT_SCALE, NAME_SIGN_ALONG, NAME_SIGN_INSET, NAME_SIGN_SCALE } from '../constants';

// Construction ou amélioration : le chantier tremble dans la poussière, puis le bâtiment s'élève (ms)
const RAISE_MS = 2400;

export default {
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
      const lib = chantierArt(stage);
      drawSprite(ctx, lib ? lib.key : `chantier-${stage}`, lib ? lib.make : BUILDINGS.chantier[stage], c.x, c.y, repaint, `site:${site.id}`);
      if (stage === 2 && !site.locked) {
        const puff = (t * 0.5) % 1;
        if (puff < 0.4) this.dust(ctx, c.x, c.y + 6, puff / 0.4, 3);
      }
      if (!site.locked && site.next && site.next.planEmoji) glyph(ctx, site.next.planEmoji, c.x, c.y - TW * 1.02 + Math.sin(t * 2) * 2, TW * 0.46, repaint, site.next.planOwned ? 0.95 : 0.4);
      return;
    }
    const look = lookAt(site.id, site.level);
    const skin = site.skin || '';
    // Le dessin de la bibliothèque (partie fixe, bloc qui bouge, voilier), sous un skin dessiné, une teinte ou celle
    // d'une pièce rare (son accessoire animé : drawItems)
    const art = buildingArt(site.id, site.level, skin);
    const body = this.siteBody(site.id, site.level, skin);
    const span = site.w / 2;
    if (k < 1) {
      // 1. L'ancien état tremble dans la poussière ; 2. le nouveau bâtiment s'élève depuis le sol ; 3. petit rebond.
      // (Au palier IV, l'emprise grandit : l'ancien bâtiment, plus petit, est dessiné au centre de la nouvelle.)
      const was = this.siteBody(site.id, raise.from || 0, skin);
      if (k < 0.35) {
        const shake = Math.sin(now / 28) * 1.6 * (1 - k / 0.35);
        drawSprite(ctx, was.key, was.make, c.x + shake, c.y, repaint);
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
        drawSprite(ctx, body.key, body.make, 0, 0, repaint);
        ctx.restore();
      }
      this.dust(ctx, c.x, c.y + 6, k, 9, span);
      return;
    }
    // Articles de la boutique : ceux de derrière avant le bâtiment, les autres après lui
    this.drawItems(ctx, site, c, t, repaint, true);
    this.swayed(ctx, body.key, body.make, c.x, c.y, look.sway * this.windAt(t, site.x + site.y), repaint, `site:${site.id}`);
    // Parties vivantes du palier (flamme, jets d'eau, ailes de moulin, roue…), puis le voilier bercé du Ponton
    if (art && art.anim) {
      const frame = art.anim.frame(Math.floor((t * 1000) / art.anim.ms) % art.anim.n);
      drawSprite(ctx, frame.key, frame.make, c.x, c.y, repaint, `site:${site.id}:anim`);
    }
    if (!art) {
      look.anims.forEach((anim, i) => {
        if (anim.skip && anim.skip(skin)) return;
        const frame = Math.floor(t * anim.fps) % anim.n;
        drawSprite(ctx, `${site.id}-${site.level}-a${i}-${frame}-${anim.skinned ? skin : ''}`, () => anim.frame(frame, skin || undefined), c.x, c.y, repaint, `site:${site.id}:a${i}`);
      });
    }
    if (look.boat) {
      const [bx, by] = P(...look.boat, 0);
      const [ox, oy] = boatOffset(look.boat);
      ctx.save();
      ctx.translate(c.x + bx, c.y + by + Math.sin(t * 1.4) * 1.6);
      ctx.rotate(Math.sin(t * 1.1) * 0.035);
      // Le voilier de la bibliothèque est déjà à sa place autour de l'ancre du bâtiment
      if (art && art.boat) drawSprite(ctx, art.boat.key, art.boat.make, -bx, -by, repaint);
      else drawSprite(ctx, `boat-${skin}`, () => boatOf(skin || undefined), ox - bx, oy - by, repaint);
      ctx.restore();
    }
    this.drawItems(ctx, site, c, t, repaint, false);
  },
  // Corps d'un bâtiment à un palier (0 : le chantier tout prêt), { key, make } pour le cache des sprites : la partie fixe
  // du dessin de la bibliothèque (sous un skin dessiné, une teinte ou celle d'une pièce rare), sinon le dessin du jeu
  siteBody(siteId, level, skin) {
    if (!level) return chantierArt(2) || { key: 'chantier-2', make: BUILDINGS.chantier[2] };
    const art = buildingArt(siteId, level, skin);
    if (art) return art.base;
    return { key: `${siteId}-${level}-${skin}`, make: () => lookAt(siteId, level).make(skin || undefined) };
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
      // Dessin de la bibliothèque, sinon celui du jeu (accessoire d'une pièce rare)
      for (const layer of objectLayers(item.id, site.level, t) || itemLayers(item.id, site.level, t)) {
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
  // Panneau d'un quartier à acheter : prix, ou chapitre du Livre encore fermé ; il se balance un peu
  drawSign(ctx, { zone, at }, t, repaint) {
    const c = this.ground(at.x, at.y);
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(Math.sin(t * 1.3 + at.x) * 0.02);
    // (le panneau de la bibliothèque, sinon celui du code ; le prix s'écrit au même endroit)
    const lib = isletArtLayer('panneau_quartier');
    drawSprite(ctx, lib ? lib.key : 'sign', lib ? lib.make : SIGN, 0, 0, repaint);
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
    landmarkLayers(landmark.id, this.reduced() ? 0 : t, bloom).forEach((layer, i) => drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, `landmark:${landmark.id}:${i}`));
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
  // Création d'île posée : elle surgit à la pose, sautille au toucher, s'efface à demi pendant qu'on la déplace ; en
  // miroir si elle est pivotée ; l'aperçu d'une pose (ghost) en transparence
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
    if (craft.flip) ctx.scale(-1, 1);
    if ((from && from.x === craft.x && from.y === craft.y) || craft.ghost) ctx.globalAlpha = craft.ghost ? 0.7 : 0.45;
    craftLayers(craft.craft, t).forEach((layer, i) => drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, `craft:${craft.x},${craft.y}:${i}`));
    ctx.restore();
  },

  // Un élément du camp des naufragés (épave, coin d'un maître, tente, objet), ancré au centre de son emprise au sol
  drawCamp(ctx, item, t, repaint) {
    const layer = campLayer(item.art, this.reduced() ? 0 : t);
    if (!layer) return;
    const c = item.w > 1 ? this.centerOf(item) : this.ground(item.x, item.y);
    drawSprite(ctx, layer.key, layer.make, c.x, c.y, repaint, `camp:${item.id}`);
  },

  // Annexe posée sur sa case : elle surgit à la pose, sautille au toucher, s'efface à demi pendant qu'on la déplace ; en
  // miroir si elle est pivotée, dans sa couleur ; l'aperçu d'une pose (ghost) en transparence
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
    if (annex.flip) ctx.scale(-1, 1);
    if ((from && from.x === annex.x && from.y === annex.y) || annex.ghost) ctx.globalAlpha = annex.ghost ? 0.7 : 0.45;
    const variant = annex.ghost ? annex.look : this.annexVariants.get(`${annex.x},${annex.y}`) || 0;
    annexLayers(annex.annex, variant, t).forEach((layer, i) => drawSprite(ctx, layer.key, layer.make, 0, 0, repaint, `${key}:${i}`));
    ctx.restore();
  }
};
