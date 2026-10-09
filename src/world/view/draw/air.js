// Ce qui flotte dans l'air : volutes de brume sur les quartiers à acheter, fumée des cheminées, lumières des fenêtres
// et des feux, lucioles. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.

import { hash, glow, fireflies } from '@/world/scene';
import { worldOf, lampGlowOf } from '@/world/terrain';
import { lookAt } from '@/world/looks';
import { P } from '@/world/iso';
import { itemLight } from '@/world/shopSprites';
import { nameSignLight } from '@/world/nameSigns';
import { rareLights } from '@/world/rareSprites';
import { annexLight } from '@/world/annexSprites';
import { landmarkLight, landmarkScale } from '@/world/landmarkSprites';
import { craftLight } from '@/world/craftSprites';
import { TW, TH, NAME_SIGN_SCALE } from '../constants';

export default {
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
        g.addColorStop(0, `rgba(248, 249, 252, ${((this.zoneThick(zone) ? 0.7 : 0.42) * mist).toFixed(3)})`);
        g.addColorStop(1, 'rgba(248, 249, 252, 0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y - 14, TW * 1.3, TH * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }
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
  drawLights(ctx, t, phase, view) {
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
      const [px, ly] = P(u, v, z);
      // (une annexe pivotée porte sa lumière en miroir)
      const lx = annex.flip ? -px : px;
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + annex.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + annex.y);
      glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(annex.x * 13 + annex.y)) * flicker, color);
    }
    // Lave : elle luit dans la nuit, en palpitant (seulement à l'écran : il y en a beaucoup sur la grande carte)
    const R = 30;
    for (const c of this.lavaCells || []) {
      if (view && (c.x < view.x - R || c.x > view.x + view.w + R || c.y < view.y - R || c.y > view.y + view.h + R)) continue;
      glow(ctx, c.x, c.y, R, (0.08 + 0.92 * lit) * (0.8 + 0.2 * Math.sin(t * 1.7 + c.x * 0.05) * Math.sin(t * 2.9 + c.y * 0.07)), '255,110,40');
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
      const [px, ly] = P(u, v, z);
      const lx = craft.flip ? -px : px;
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
    // Lanternes des habitants qui rentrent le soir, lucioles du Bestiaire (leur rayon, leur couleur et leur éclat : r,
    // color, a)
    for (const l of this.villageLights) {
      const p = this.ground(l.x, l.y);
      glow(ctx, p.x + l.dx, p.y + l.dy, l.r || 14, lit * (l.a ?? 0.9 + 0.1 * Math.sin(t * 5 + l.x)), l.color || '255,214,130');
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
  }
};
