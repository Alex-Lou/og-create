// Ce qui flotte dans l'air : volutes de brume sur les quartiers à acheter, fumée des cheminées, lumières des fenêtres
// et des feux, lucioles. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.

import { glow, fireflies } from '@/world/scene';
import { worldOf, lampGlowOf } from '@/world/terrain';
import { fogPuffs, drawFog, clearingOf } from '@/world/voile';
import { lookAt } from '@/world/looks';
import { P } from '@/world/iso';
import { itemLight } from '@/world/shopSprites';
import { nameSignLight } from '@/world/nameSigns';
import { rareLights } from '@/world/rareSprites';
import { annexLight } from '@/world/annexSprites';
import { landmarkLight, landmarkScale } from '@/world/landmarkSprites';
import { craftLight } from '@/world/craftSprites';
import { NAME_SIGN_SCALE, TW } from '../constants';
import { seuilOf, nuitOf, allumage } from '@/world/lumiere';

// Le feu de camp sous la pluie (choix de l'auteur, 14 oct.) : le Foyer l'abrite dès ce palier ; à découvert, sa lumière
// rétrécit de tant (3 cases → 1, serveur : nights.js, RAIN_REACH)
const SHELTER_LEVEL = 2;
const RAIN_SHRINK = 2 / 3;

export default {
  // Brume vivante (world/voile.js) : des nappes qui dérivent sur toutes les terres voilées ; refaites quand le voile
  // change. Celles d'un quartier qu'on vient d'acheter s'effacent avec lui (mistOf), au lieu de disparaître d'un coup
  drawWisps(ctx, t, now, view) {
    // (une nouvelle vue du serveur ne change le plus souvent rien au voile : les nappes ne sont refaites que s'il change,
    // sans quoi chaque toucher qui passe par le serveur figeait l'écran le temps de les recalculer)
    if (this.fog && (this.fog.state !== this.state || this.fog.veiled !== this.veiled) && this.fog.M === this.M && this.fog.sig === this.fogSig()) {
      this.fog.state = this.state;
      this.fog.veiled = this.veiled;
    }
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
      this.fog = { state: this.state, veiled: this.veiled, M: this.M, sig: this.fogSig(), puffs: fogPuffs(this.M, veilAt, zoneOf), fading };
    }
    // (le Voile recule devant les lumières de l'image d'avant : les feux, les fenêtres, Brume ; et s'écarte un peu au
    // pied du phare des Anciens, pour que la tour se lise de loin)
    const phare = this.phareSpot();
    const spots = phare ? [...(this.lightSpots || []), { x: phare.x, y: phare.y, r: TW * 0.6, k: 0.75 }] : this.lightSpots;
    drawFog(ctx, this.fog.puffs, view, t, clearingOf(spots));
    if (!this.fog.fading.length) return;
    const zones = new Map(this.state.map.zones.map(zone => [zone.id, zone]));
    this.fog.fading = this.fog.fading.filter(p => this.unveils.has(p.zone));
    drawFog(ctx, this.fog.fading, view, t, p => this.mistOf(zones.get(p.zone), now));
  },
  // Ce dont dépend le voile des cases (terrain.js : veilAt) : chaque quartier (à soi, inconnu, sous la brume épaisse) et
  // les cases du cœur encore voilées
  fogSig() {
    let cells = 0;
    for (const k of this.veiled || []) cells = (cells * 31 + k + 1) % 1000000007;
    return `${this.state.map.zones.map(z => `${z.owned ? 1 : 0}${z.known === false ? 1 : 0}${this.zoneThick(z) ? 1 : 0}`).join('')}|${this.veiled ? this.veiled.size : 0}|${cells}`;
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
  // Ce qui éclaire une case (x, y, fractionnaires) : rien dans un quartier pas encore à soi ni sur une case encore
  // cachée ; un quartier qu'on vient d'acheter s'allume à mesure que sa brume s'efface (mistOf). La mer n'est d'aucun
  // quartier. Rend la règle de l'image : un facteur de 0 à 1, lu une fois par quartier
  lightGate(now) {
    const M = this.M, zones = this.state.map.zones, known = new Map();
    return (x, y) => {
      const gx = Math.round(x), gy = Math.round(y);
      if (this.hiddenCell(gx, gy)) return 0;
      const i = M.zone(gx, gy), zone = zones[i];
      if (!zone) return 1;
      let k = known.get(i);
      if (k === undefined) known.set(i, (k = 1 - this.mistOf(zone, now)));
      return k;
    };
  },
  // Lumières : fenêtres et feux s'allument une à une quand la scène s'assombrit (soir, nuit, gros temps) ; lucioles
  // la nuit, par temps sec. Rien ne brille dans un quartier pas encore à soi (lightGate). Avec sink (un tableau), rien n'est dessiné : chaque source y est rangée ({ x, y, r, k,
  // color, pool }) pour la carte de lumière (world/lumiere/carte.js)
  // Le haut de la flamme de chaque feu allumé de l'île (le feu de camp du Foyer : là où montent les braises), en
  // unités du monde ; rien pour un bâtiment qui s'élève ni hors des terres qu'on voit
  fireSpots() {
    const shown = this.lightGate(performance.now());
    const out = [];
    for (const site of this.state.sites) {
      if (!site.level || this.raises.has(site.id) || !shown(site.x, site.y)) continue;
      const look = lookAt(site.id, site.level);
      if (!look.fire || !look.lights.length) continue;
      const c = this.centerOf(site);
      const [u, v, z] = look.lights[0];
      const [lx, ly] = P(u, v, z);
      out.push({ x: c.x + lx, y: c.y + ly });
    }
    return out;
  },
  drawLights(ctx, t, phase, view, sink = null) {
    const lit = phase.lit;
    const emit = sink ? (_ctx, x, y, r, k, color = '255,196,110', pool = true, gy = null) => { if (k > 0.01) sink.push({ x, y, r, k, color, pool, gy: gy ?? y + r * 0.5 }); } : glow;
    // Fenêtres et lanternes s'allument une à une, en vague depuis le Foyer, chacune d'un coup (lumiere/allumage.js)
    const now = performance.now();
    const foyer = this.state.sites.find(site => site.id === 'foyer');
    const home = foyer ? this.centerOf(foyer) : null;
    const allume = (key, x, y) => {
      const seuil = seuilOf(key, home ? Math.hypot(x - home.x, y - home.y) : 0);
      return allumage(this.allumes, this.allumages, key, x, y, seuil, lit, now, this.reduced()) * nuitOf(lit);
    };
    const shown = this.lightGate(now);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const site of this.state.sites) {
      if (!site.level || this.raises.has(site.id)) continue;
      const on = shown(site.x, site.y);
      if (!on) continue;
      const look = lookAt(site.id, site.level);
      const lights = look.lights;
      const c = this.centerOf(site);
      const fire = look.fire;
      // (sous la pluie, le feu de camp à découvert crachote : il porte trois fois moins loin, comme le serveur le compte
      // la nuit, services/nights.js ; le Foyer à l'Abri le couvre)
      const wet = fire && site.id === 'foyer' && site.level < SHELTER_LEVEL ? (phase.weather && phase.weather.rain) || 0 : 0;
      lights.forEach(([u, v, z, r], i) => {
        const [lx, ly] = P(u, v, z);
        const flicker = fire ? (0.85 + 0.15 * Math.sin(t * 13 + i) * Math.sin(t * 7.3)) * (1 - wet * 0.35 * (0.5 + 0.5 * Math.sin(t * 5.1))) : 0.95 + 0.05 * Math.sin(t * 2 + i);
        // (la nuit de la veillée, le feu baisse : draw/veillee.js)
        emit(ctx, c.x + lx, c.y + ly, r * (1 - wet * RAIN_SHRINK), on * (fire ? Math.max(0.3, lit) * this.fireLeft() : allume(`f${site.id}:${i}`, c.x + lx, c.y + ly)) * flicker, undefined, true, c.y + P(u, v, 0)[1]);
      });
      for (const item of site.shop || []) {
        const light = item.owned && itemLight(item.id, site.level);
        if (!light) continue;
        const [lx, ly] = P(light[0], light[1], light[2]);
        emit(ctx, c.x + lx, c.y + ly, light[3], on * lit * (0.9 + 0.1 * Math.sin(t * 3 + light[0])), light[4]);
      }
      // Pièce rare portée : lampions, lucioles, lave…
      for (const [x, y, r, color, strength] of rareLights(site.skin, site.level, t)) {
        emit(ctx, c.x + x, c.y + y, r, on * lit * strength * (0.9 + 0.1 * Math.sin(t * 3 + x)), color);
      }
    }
    // Annexes : lanternes, braises, four et haut fourneau (le feu brûle même de jour)
    for (const annex of this.state.annexes || []) {
      const light = annexLight(annex.annex);
      const on = light ? shown(annex.x, annex.y) : 0;
      if (!on) continue;
      const [u, v, z, r, color, fire] = light;
      const c = this.ground(annex.x, annex.y);
      const [px, ly] = P(u, v, z);
      // (une annexe pivotée porte sa lumière en miroir)
      const lx = annex.flip ? -px : px;
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + annex.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + annex.y);
      emit(ctx, c.x + lx, c.y + ly, r, on * (fire ? Math.max(0.3, lit) : allume(`a${annex.x},${annex.y}`, c.x + lx, c.y + ly)) * flicker, color, true, c.y + P(u, v, 0)[1]);
    }
    // Lave : elle luit dans la nuit, en palpitant (seulement à l'écran : il y en a beaucoup sur la grande carte)
    const R = 30;
    for (const c of this.lavaCells || []) {
      if (view && (c.x < view.x - R || c.x > view.x + view.w + R || c.y < view.y - R || c.y > view.y + view.h + R)) continue;
      const on = shown(c.gx, c.gy);
      if (on) emit(ctx, c.x, c.y, R, on * (0.08 + 0.92 * lit) * (0.8 + 0.2 * Math.sin(t * 1.7 + c.x * 0.05) * Math.sin(t * 2.9 + c.y * 0.07)), '255,110,40', false);
    }
    // Lieux remarquables : bouche de la grotte, gravures des menhirs, lanterne des pilotis, lave (elle luit même de jour)
    for (const landmark of this.shownLandmarks) {
      const light = landmarkLight(landmark.id);
      const on = light ? shown(landmark.x, landmark.y) : 0;
      if (!on) continue;
      const [u, v, z, r, color, fire] = light;
      const c = this.ground(landmark.x, landmark.y);
      const k = landmarkScale(landmark.id);
      const [lx, ly] = P(u, v, z);
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 9 + landmark.x) * Math.sin(t * 5.3) : 0.9 + 0.1 * Math.sin(t * 1.6 + landmark.y);
      emit(ctx, c.x + lx * k, c.y + ly * k, r * k, on * (fire ? Math.max(0.35, lit) : lit) * flicker, color);
    }
    // Créations d'île : lanterne, brasero (son feu brûle même de jour), fontaine, kiosque
    for (const craft of this.crafted) {
      const light = craftLight(craft.craft);
      const on = light ? shown(craft.x, craft.y) : 0;
      if (!on) continue;
      const [u, v, z, r, color, fire] = light;
      const c = this.ground(craft.x, craft.y);
      const [px, ly] = P(u, v, z);
      const lx = craft.flip ? -px : px;
      const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + craft.x) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + craft.y);
      emit(ctx, c.x + lx, c.y + ly, r, on * (fire ? Math.max(0.3, lit) : allume(`c${craft.x},${craft.y}`, c.x + lx, c.y + ly)) * flicker, color, true, c.y + P(u, v, 0)[1]);
    }
    // Enseignes à lanternes
    for (const site of this.state.sites) {
      if (!site.sign || site.locked) continue;
      const lights = nameSignLight(site.sign);
      const on = lights.length ? shown(site.x, site.y) : 0;
      if (!on) continue;
      const at = this.nameSignAt(site);
      for (const [dx, dy, r] of lights) emit(ctx, at.x + dx * NAME_SIGN_SCALE, at.y + dy * NAME_SIGN_SCALE, r * NAME_SIGN_SCALE, on * Math.max(0.3, lit) * (0.85 + 0.15 * Math.sin(t * 11 + dx) * Math.sin(t * 6.1)));
    }
    // Lanternes des habitants qui rentrent le soir, lucioles du Bestiaire (leur rayon, leur couleur et leur éclat : r,
    // color, a)
    for (const l of this.villageLights) {
      const on = shown(l.x, l.y);
      if (!on) continue;
      const p = this.ground(l.x, l.y);
      emit(ctx, p.x + l.dx, p.y + l.dy, l.r || 14, on * lit * (l.a ?? 0.9 + 0.1 * Math.sin(t * 5 + l.x)), l.color || '255,214,130');
    }
    // Lanternes du pont de l'Îlot aux Mouettes (selon la rive où elles se tiennent : la mer n'est d'aucun quartier) et
    // des ponts de la rivière, lanterne de la barque du passeur (elle ne vogue qu'une fois l'Îlot à soi)
    for (const lamps of [this.islets.lamps, this.riverLamps || []]) {
      for (const lamp of lamps) {
        const at = lamp.land || lamp, on = shown(at.x, at.y);
        if (!on) continue;
        const p = lampGlowOf(lamp);
        emit(ctx, p.x, p.y, 16, on * allume(`l${lamp.x},${lamp.y}`, p.x, p.y) * (0.92 + 0.08 * Math.sin(t * 2 + lamp.x)));
      }
    }
    if (this.ferry) {
      const c = worldOf(this.ferry.x, this.ferry.y, this.ferry.z);
      emit(ctx, c.x + (this.ferry.flip ? 19 : -19), c.y - 18, 16, lit);
    }
    // (les lucioles ne viennent qu'écrites dans le Grimoire : bible, Bestiaire)
    if (phase.night > 0.35 && phase.weather.rain < 0.3 && (this.elements || []).includes('Luciole')) {
      const strength = ((phase.night - 0.35) / 0.65) * (1 - phase.weather.rain / 0.3);
      for (const fly of fireflies(t, this.state.size)) {
        const a = strength * fly.a * shown(fly.x, fly.y);
        if (a <= 0.01) continue;
        const p = this.ground(fly.x, fly.y);
        if (sink) { sink.push({ x: p.x, y: p.y - fly.z, r: 9, k: a, color: '255,236,140', pool: false, dot: true, gy: p.y }); continue; }
        emit(ctx, p.x, p.y - fly.z, 9, a, '255,236,140', false);
        ctx.fillStyle = `rgba(255,250,200,${a.toFixed(3)})`;
        ctx.fillRect(p.x - 1, p.y - fly.z - 1, 2, 2);
      }
    }
    ctx.restore();
  }
};
