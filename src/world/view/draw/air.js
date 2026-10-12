// Ce qui flotte dans l'air : volutes de brume sur les quartiers à acheter, fumée des cheminées, lumières des fenêtres
// et des feux, lucioles. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.

import { hash, glow, fireflies } from '@/world/scene';
import { worldOf, lampGlowOf } from '@/world/terrain';
import { fogPuffs, drawFog } from '@/world/voile';
import { lookAt } from '@/world/looks';
import { P } from '@/world/iso';
import { itemLight } from '@/world/shopSprites';
import { nameSignLight } from '@/world/nameSigns';
import { rareLights } from '@/world/rareSprites';
import { annexLight } from '@/world/annexSprites';
import { landmarkLight, landmarkScale } from '@/world/landmarkSprites';
import { craftLight } from '@/world/craftSprites';
import { NAME_SIGN_SCALE } from '../constants';

export default {
  // Brume vivante (world/voile.js) : des nappes qui dérivent sur toutes les terres voilées ; refaites quand le voile
  // change. Celles d'un quartier qu'on vient d'acheter s'effacent avec lui (mistOf), au lieu de disparaître d'un coup
  drawWisps(ctx, t, now, view) {
    if (!this.fog || this.fog.state !== this.state || this.fog.veiled !== this.veiled) {
      const zoneOf = (x, y) => (this.state.map.zones[this.M.zone(x, y)] || {}).id;
      const fading = this.fog ? [...this.fog.fading, ...this.fog.puffs].filter(p => this.unveils.has(p.zone)) : [];
      // (le voile d'une case, lu une seule fois : fogPuffs le redemande pour chaque voisine, et veilAt passe par l'état
      // réactif, des secondes de calcul à chaque réponse du serveur sinon)
      const n = this.M.n, veils = new Float32Array(n * n).fill(-1);
      const veilAt = (x, y) => {
        const i = y * n + x;
        if (veils[i] < 0) veils[i] = this.veilAt(x, y);
        return veils[i];
      };
      this.fog = { state: this.state, veiled: this.veiled, puffs: fogPuffs(this.M, veilAt, zoneOf), fading };
    }
    drawFog(ctx, this.fog.puffs, view, t);
    if (!this.fog.fading.length) return;
    const zones = new Map(this.state.map.zones.map(zone => [zone.id, zone]));
    this.fog.fading = this.fog.fading.filter(p => this.unveils.has(p.zone));
    drawFog(ctx, this.fog.fading, view, t, p => this.mistOf(zones.get(p.zone), now));
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
  // la nuit, par temps sec. Avec sink (un tableau), rien n'est dessiné : chaque source y est rangée ({ x, y, r, k,
  // color, pool }) pour la carte de lumière (world/lumiere/carte.js)
  drawLights(ctx, t, phase, view, sink = null) {
    const lit = phase.lit;
    const emit = sink ? (_ctx, x, y, r, k, color = '255,196,110', pool = true, gy = null) => { if (k > 0.01) sink.push({ x, y, r, k, color, pool, gy: gy ?? y + r * 0.5 }); } : glow;
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
        // (la nuit de la veillée, le feu baisse : draw/veillee.js)
        emit(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) * this.fireLeft() : litFor(site.x * 7 + site.y + i)) * flicker, undefined, true, c.y + P(u, v, 0)[1]);
      });
      for (const item of site.shop || []) {
        const light = item.owned && itemLight(item.id, site.level);
        if (!light) continue;
        const [lx, ly] = P(light[0], light[1], light[2]);
        emit(ctx, c.x + lx, c.y + ly, light[3], lit * (0.9 + 0.1 * Math.sin(t * 3 + light[0])), light[4]);
      }
      // Pièce rare portée : lampions, lucioles, lave…
      for (const [x, y, r, color, strength] of rareLights(site.skin, site.level, t)) {
        emit(ctx, c.x + x, c.y + y, r, lit * strength * (0.9 + 0.1 * Math.sin(t * 3 + x)), color);
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
      emit(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(annex.x * 13 + annex.y)) * flicker, color, true, c.y + P(u, v, 0)[1]);
    }
    // Lave : elle luit dans la nuit, en palpitant (seulement à l'écran : il y en a beaucoup sur la grande carte)
    const R = 30;
    for (const c of this.lavaCells || []) {
      if (view && (c.x < view.x - R || c.x > view.x + view.w + R || c.y < view.y - R || c.y > view.y + view.h + R)) continue;
      emit(ctx, c.x, c.y, R, (0.08 + 0.92 * lit) * (0.8 + 0.2 * Math.sin(t * 1.7 + c.x * 0.05) * Math.sin(t * 2.9 + c.y * 0.07)), '255,110,40', false);
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
      emit(ctx, c.x + lx * k, c.y + ly * k, r * k, (fire ? Math.max(0.35, lit) : lit) * flicker, color);
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
      emit(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : litFor(craft.x * 11 + craft.y)) * flicker, color, true, c.y + P(u, v, 0)[1]);
    }
    // Enseignes à lanternes
    for (const site of this.state.sites) {
      if (!site.sign || site.locked) continue;
      const lights = nameSignLight(site.sign);
      if (!lights.length) continue;
      const at = this.nameSignAt(site);
      for (const [dx, dy, r] of lights) emit(ctx, at.x + dx * NAME_SIGN_SCALE, at.y + dy * NAME_SIGN_SCALE, r * NAME_SIGN_SCALE, Math.max(0.3, lit) * (0.85 + 0.15 * Math.sin(t * 11 + dx) * Math.sin(t * 6.1)));
    }
    // Lanternes des habitants qui rentrent le soir, lucioles du Bestiaire (leur rayon, leur couleur et leur éclat : r,
    // color, a)
    for (const l of this.villageLights) {
      const p = this.ground(l.x, l.y);
      emit(ctx, p.x + l.dx, p.y + l.dy, l.r || 14, lit * (l.a ?? 0.9 + 0.1 * Math.sin(t * 5 + l.x)), l.color || '255,214,130');
    }
    // Lanternes du pont de l'Îlot aux Mouettes, lanterne de la barque du passeur
    for (const lamp of this.islets.lamps) {
      const p = lampGlowOf(lamp);
      emit(ctx, p.x, p.y, 16, lit * (0.92 + 0.08 * Math.sin(t * 2 + lamp.x)));
    }
    if (this.ferry) {
      const c = worldOf(this.ferry.x, this.ferry.y, this.ferry.z);
      emit(ctx, c.x + (this.ferry.flip ? 19 : -19), c.y - 18, 16, lit);
    }
    if (phase.night > 0.35 && phase.weather.rain < 0.3) {
      const strength = ((phase.night - 0.35) / 0.65) * (1 - phase.weather.rain / 0.3);
      for (const fly of fireflies(t, this.state.size)) {
        const p = this.ground(fly.x, fly.y);
        if (sink) { if (strength * fly.a > 0.01) sink.push({ x: p.x, y: p.y - fly.z, r: 9, k: strength * fly.a, color: '255,236,140', pool: false, dot: true, gy: p.y }); continue; }
        emit(ctx, p.x, p.y - fly.z, 9, strength * fly.a, '255,236,140', false);
        ctx.fillStyle = `rgba(255,250,200,${(strength * fly.a).toFixed(3)})`;
        ctx.fillRect(p.x - 1, p.y - fly.z - 1, 2, 2);
      }
    }
    ctx.restore();
  }
};
