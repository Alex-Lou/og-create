// La vie de l'île et de la mer : animaux, poissons, dauphins et baleine, mouettes posées ou en vol, barque du passeur,
// bateau d'un visiteur, bouteille à la mer ; un toucher les effraie. Méthodes de WorldView.vue (this : le composant),
// réunies par draw.js.

import { hash } from '@/world/scene';
import { P } from '@/world/iso';
import { campPerches } from '@/world/campArt';
import { drawSprite } from '@/world/spriteCache';
import { drawSpout, seaGuests, DOLPHIN_EVERY, DOLPHIN_FOR, podAt, WHALE_EVERY, WHALE_FOR, whaleAt, jelliesAt, circling, crossing, nearestOpen, spread } from '@/world/sea';
import { FLOATING_ZONE, COLONY_ZONE, ferryPose } from '@/world/islets';
import { SEA_Z, HS, worldOf } from '@/world/terrain';
import { beastSprite, lookOf } from '@/world/beastArt';
import { isletArtLayer, isletFrameAt } from '@/world/decorArt';
import { vibrate } from '@/utils/fx';
import { FISH_SPECIES, SEA_SPRITES } from '@/world/seaSprites';
import { GEANT_EVERY, GEANT_FOR, geantAt, BOULE_EVERY, BOULE_FOR, FUITE, bouleAt, centreOf, plongeons, KRAKEN_FOR, KRAKEN_FORCE, krakenNuit, krakenRoute, krakenAt, apercuAt, toucherGeant, toucherKraken } from '@/world/faune';
import { cycleAt, cycleStart, gameDate } from '@/world/gameClock';
import { nearestOpen as eauLibre } from '@/world/sea';
import { KRAKEN_LINES } from '@/texts/world/kraken';
import { guide } from '@/game/guide';
import { bubbleFace, builtOf, NAMES } from '@/world/faces';
import { BOTTLE } from '@/world/chest';
import { ISLET_SPRITES } from '@/world/isletSprites';
import { strayAt, nightNow } from '@/world/strays';
import { strayLayer, strayKind } from '@/world/nightArt';
import { SEA_KINDS } from '../constants';

// Ce qui barre un égaré (serveur : services/nights.js, FENCES)
const STRAY_FENCES = new Set(['cloture', 'muret']);

// Qui nage : de combien son dessin s'enfonce sous l'eau (le maître de la bibliothèque fait 51 de haut : restent la tête
// et les épaules)
const SWIM_SINK = 26;

// Arrivée du bateau d'un visiteur (secondes) et distance d'où il vient (cases)
const BOAT_SAIL = 6;
const BOAT_FAR = 7;
// Mouettes posées effrayées : envol (s), puis retour
const FLY_OFF = 2.6;
const GULL_BACK = 30;

// Les petites bêtes et la mer prises dans la bibliothèque : [sorte de beastArt, variante (sinon l'espèce), pose selon
// l'image du jeu]. Le dauphin a ses trois images (il sort de l'eau, au sommet, il replonge) ; la baleine nage (deux
// images) ; un poisson en l'air est la plus haute de ses deux images, celui qui replonge l'autre
const LIBRARY = {
  chicken: ['hen', 'blanche'], gull: ['gull', ''],
  dolphin: ['dolphin', '', frame => ({ pose: 'marche', n: frame + 1 })],
  whale: ['whaleBack', '', frame => ({ pose: 'marche', n: (frame || 0) + 1 })],
  fluke: ['whaleFluke', '', frame => ({ pose: 'marche', n: (frame || 0) + 1 })],
  fish: ['fish', null, frame => ({ pose: 'marche', n: frame === 0 ? 2 : 1 })]
};

export default {
  // Petite vie de l'île, déterministe dans le temps : où est chaque animal, dans quelle image, de quel côté il regarde.
  // Poules autour du Foyer, poisson près de la côte des quartiers à soi (les bêtes sauvages : world/village/wildLife.js).
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
    // (pendant le tutoriel, pas d'autres poules que celles d’Agathe : celles-ci arrivent à sa fin)
    if (foyer && !this.thickMist()) {
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
    // Poisson : un saut toutes les 7 s, à un endroit différent du rivage des quartiers à soi (sous la brume, rien :
    // serve.js, fishShore ; sardine, daurade) ; le poisson volant plane vers le large
    const cycle = Math.floor(t / 7);
    const into = (t % 7) / 7;
    const species = FISH_SPECIES[Math.floor(hash(cycle, 5) * FISH_SPECIES.length)];
    const span = species === 'volant' ? 0.2 : 0.12;
    if (into < span && this.fishShore.length) {
      const spot = this.fishShore[Math.floor(hash(cycle, 2) * this.fishShore.length)];
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
        const gull = { kind: 'gull', x: perch.x + i * 0.32 - 0.1, y: perch.y + 0.1 - i * 0.18, z: 0, frame: Math.sin(t * 0.7 + i * 2 + perch.x) > 0.75 ? 1 : 0, flip: (i + Math.floor(t / 9 + perch.y)) % 2 === 1 };
        // (perchée sur l'épave : à sa place dans le monde, en hauteur, rangée devant elle)
        out.push(perch.at ? { ...gull, x: perch.x, y: perch.y, at: perch.at, z: perch.z, depth: perch.depth } : gull);
      }
    }
    // Bouteille à la mer échouée : la vague la berce ; un toucher l'ouvre
    if (this.bottleSpot) {
      const { x, y } = this.bottleSpot;
      const frame = Math.sin(t * 1.6) > 0.6 ? 1 : 0;
      // (dessin de la bibliothèque, à sa cadence, sinon celui du code)
      const lib = isletArtLayer('bouteille', isletFrameAt('bouteille', t));
      out.push({ kind: 'bottle', x: x + 0.5, y: y + 0.5, z: 0, frame, flip: false, sprite: lib ? [lib.key, lib.make] : [`bottle-${frame}`, BOTTLE[frame]] });
      const c = this.ground(x + 0.5, y + 0.5);
      hits.push({ key: 'bottle', kind: 'bottle', bottle: true, x: c.x, y: c.y - 6, r: 14 });
    }
    // Habitants et bêtes du village (on peut les toucher)
    const life = this.village ? this.village.at(t, phase, this.scared, this.looseHens) : { list: [], lights: [] };
    // (deux camarades qui se retrouvent, à l'écran : leurs bulles ; WorldView, folk.js)
    if (life.meets && life.meets.length) this.meetNow(life.meets);
    for (const who of life.list) {
      out.push(who);
      // (l'œuf d'une poule : un décor, on ramasse par la bulle de sa poule ; la planche de Léo : on touche Léo)
      if (who.kind === 'egg' || who.kind === 'plank') continue;
      const c = this.ground(who.x, who.y);
      const person = who.kind === 'villager';
      // Anya est grande (environ 100 de haut), son cerf de lune aussi : on les touche au corps, pas seulement aux pieds ;
      // un maître dessiné par la bibliothèque (grand format, 51 de haut) aussi, tête comprise
      const tall = who.species === 'anya' || who.id === 'anya:cerf';
      const big = person && who.sprite[0].startsWith('lib-');
      // head : du point touché au-dessus de la tête (et de la toile du parapluie), où se pose la bulle d'un besoin
      const head = big ? (who.sprite[0].includes('_parapluie_') ? 41 : 27) : 16;
      // Qui nage : on le touche à la tête et aux épaules, seules hors de l'eau (drawCritter : SWIM_SINK)
      if (person && who.swim) {
        hits.push({ key: who.id, kind: 'villager', who, x: c.x, y: c.y - SEA_Z * HS - who.z - 12, r: 18, head: 18 });
        continue;
      }
      // Un dormeur est couché : on le touche sur tout son corps, à ras du sol (son dessin fait 51 × 38, ancré au lit)
      if (person && who.pose === 'sleep') {
        hits.push({ key: who.id, kind: 'villager', who, x: c.x, y: c.y - 3, r: 24, head: 20 });
        continue;
      }
      hits.push({ key: who.id, kind: person ? 'villager' : who.species, who, x: c.x, y: c.y - who.z - (big ? 24 : person ? 16 : tall ? 44 : 6), r: big ? 20 : person ? 15 : tall ? 34 : 12, head });
    }
    // Les égarés de la nuit (serveur : nights) : ils marchent vers leur bâtiment, un toucher en repousse un ; changés en
    // lucioles, ils luisent sur place jusqu'au matin. Au tutoriel, celui que Brume montre buter sur la clôture
    // (tutoStrays : demos.js, strayDemo), à toute heure, et qu'on ne touche pas
    const glows = [];
    const nights = this.state.nights;
    const now = Date.now();
    const shown = [...(nightNow(nights, now) ? nights.creatures || [] : []), ...(this.tutoStrays || [])];
    if (shown.length) {
      // (la Racine passe sous les clôtures et les murets)
      const fences = new Set((this.crafted || []).filter(p => STRAY_FENCES.has(p.craft)).map(p => `${p.x},${p.y}`));
      const under = (x, y) => fences.has(`${x},${y}`);
      for (const c of shown) {
        const s = strayAt(c, now, this.repelled.has(c.id) ? this.repelled.get(c.id) : null, under);
        if (!s) continue;
        if (s.glow) {
          glows.push({ x: s.x, y: s.y, dx: Math.sin(t * 1.3 + s.x) * 4, dy: -12 + Math.sin(t * 2.1 + s.y) * 3, r: 8, color: '210,255,160' });
          continue;
        }
        const zone = this.state.map.zones[this.M.zone(c.path[0].x, c.path[0].y)];
        const art = strayKind(c.kind, zone && zone.climate);
        const layer = strayLayer(art, s.view, s.pose, s.n);
        if (!layer) continue;
        out.push({ id: `stray:${c.id}`, kind: 'stray', x: s.x, y: s.y, z: 0, flip: s.flip, frame: 0, sprite: [layer.key, layer.make] });
        const g = this.ground(s.x, s.y);
        // (art : son dessin, sa page au Bestiaire)
        if (s.pose === 'marche' && !c.demo) hits.push({ key: `stray:${c.id}`, kind: 'stray', stray: c, art, x: g.x, y: g.y - 10, r: 16 });
      }
    }
    this.villageLights = glows.length ? [...life.lights, ...glows] : life.lights;
    this.landHits = hits;
    return out;
  },
  drawCritter(ctx, critter, repaint) {
    // À la surface de la mer : poissons, dauphins, baleine ; les autres vivent sur le sol de leur case
    if (critter.kind === 'spout') {
      drawSpout(ctx, critter);
      return;
    }
    const atSea = SEA_KINDS.has(critter.kind) || critter.swim;
    const c = critter.at ? { ...critter.at } : atSea ? this.world(critter.x, critter.y) : this.ground(critter.x, critter.y);
    if (atSea) c.y -= SEA_Z * HS;
    ctx.save();
    ctx.translate(c.x, c.y - critter.z);
    if (critter.flip) ctx.scale(-1, 1);
    // Qui nage (Lorena qui arrive : game/stages.js, nage) : des ronds autour de lui, et seul ce qui dépasse de l'eau se
    // voit, la tête et les épaules
    if (critter.swim) {
      const t = performance.now() / 1000;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 2; i++) {
        const k = (t * 0.5 + i / 2) % 1;
        ctx.globalAlpha = 1 - k;
        ctx.beginPath();
        ctx.ellipse(0, 0, 9 + k * 12, (9 + k * 12) * 0.4, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.rect(-60, -200, 120, 200);
      ctx.clip();
      ctx.translate(0, SWIM_SINK);
    }
    // Ce qui sort de l'eau peu à peu (dos, queue de la baleine) : e de 0 à 1
    if (critter.e !== undefined) {
      ctx.globalAlpha = critter.e;
      ctx.translate(0, (1 - critter.e) * 8);
    }
    const art = this.critterSprite(critter);
    if (!art) return ctx.restore();
    const [key, make] = art;
    // (sa dernière image le temps que la suivante se lise : son identité, sinon une autre image de son espèce)
    drawSprite(ctx, key, make, 0, 0, repaint, critter.id ?? `${critter.kind}:${critter.species || ''}`);
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
      // (en route, sa voile se gonfle, à la cadence de la bibliothèque)
      { depth: pose.x + pose.y, ferry: { ...pose, frame: pose.moving ? isletFrameAt('barque_volante', t) : 0 } }
    ];
  },
  drawFerry(ctx, item, repaint) {
    const c = worldOf(item.x, item.y, item.z);
    ctx.save();
    ctx.translate(c.x, c.y);
    // (dessins de la bibliothèque, sinon ceux du code)
    if (item.landing) {
      const lib = isletArtLayer('ponton');
      drawSprite(ctx, lib ? lib.key : 'islet-landing', lib ? lib.make : ISLET_SPRITES.landing, 0, 0, repaint);
    } else {
      if (item.flip) ctx.scale(-1, 1);
      const lib = isletArtLayer('barque_volante', item.frame);
      drawSprite(ctx, lib ? lib.key : `islet-ferry-${item.frame}`, lib ? lib.make : ISLET_SPRITES.ferry[item.frame], 0, 0, repaint, 'islet-ferry');
    }
    ctx.restore();
  },
  critterSprite(c) {
    if (c.sprite) return c.sprite;
    // Le dessin de la bibliothèque (beastArt.js) d'abord : les poules, abeilles et grenouilles du Foyer, la mer
    const lib = LIBRARY[c.kind];
    const art = lib && beastSprite(lib[0], lib[1] ?? c.species, lib[2] ? lib[2](c.frame) : lookOf(c.frame));
    if (art) return [art.key, art.make];
    if (c.kind === 'fish') return [`fish-${c.species}-${c.frame}`, SEA_SPRITES.fish[c.species][c.frame]];
    if (c.kind === 'dolphin') return [`dolphin-${c.frame}`, SEA_SPRITES.dolphin[c.frame]];
    if (c.kind === 'whale') return ['whale-back', SEA_SPRITES.whaleBack];
    if (c.kind === 'fluke') return ['whale-fluke', SEA_SPRITES.whaleFluke];
    if (c.kind === 'gull') return [`gull-${c.frame}`, SEA_SPRITES.gull[c.frame]];
    return null;
  },
  // La mer à cet instant (lot 5b) : ce qui se montre à la surface (dauphins, baleine), les ronds dans l'eau, les
  // mouettes en vol, les méduses ; et ce qu'on peut toucher (seaHits). Les visiteurs arrivent avec les quartiers
  // achetés ; en mouvement réduit, seuls restent ceux qui ne passent pas
  seaLife(t, view, phase) {
    const out = { standing: [], rings: [], gulls: [], jellies: null };
    const hits = [];
    const still = this.reduced();
    const guests = seaGuests(new Set(this.state.map.zones.filter(z => z.owned).map(z => z.id)), phase);
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
          // (deux images de nage dans la bibliothèque, 420 ms chacune)
          out.standing.push({ kind: 'whale', x: w.back.x, y: w.back.y, z: 0, e: w.back.e, flip: w.flip, frame: Math.floor(t / 0.42) % 2 });
          w.spouts.forEach(sp => out.standing.push({ kind: 'spout', ...sp, depth: depth + 0.5 }));
          const c = surface(w.back.x, w.back.y);
          hits.push({ key: go.key, kind: 'whale', x: c.x, y: c.y - 6, r: 44, at: { x: w.back.x, y: w.back.y } });
        }
        if (w.fluke) out.standing.push({ kind: 'fluke', x: w.fluke.x, y: w.fluke.y, z: 0, e: w.fluke.e, flip: w.flip, frame: Math.floor(t / 0.42) % 2 });
      }
    }
    if (guests.jellies) out.jellies = jelliesAt(this.sea.open, t);
    // Les bancs de poissons (faune/bancs.js) : on peut les toucher (ils fusent, des ronds là où ils étaient) ; le jour,
    // les mouettes plongent dans la boule de sardines
    if (!still) {
      const boule = this.bouleOf(t, view);
      this.sea.schools.forEach((sc, k) => {
        const key = `school:${k}`, touched = this.scared.get(key);
        // (le banc ramassé en boule se touche là où est la boule)
        const c = boule && boule.k === k && boule.m > 0.5 ? boule : centreOf(sc, k, t);
        if (touched && t - touched.at < FUITE) {
          if (t - touched.at < 1.2) out.rings.push({ x: c.x, y: c.y, k: (t - touched.at) / 1.2 });
        } else {
          const w = surface(c.x, c.y);
          hits.push({ key, kind: 'school', x: w.x, y: w.y, r: 30 });
        }
      });
      if (boule && phase.night < 0.6) {
        const p = plongeons(boule, t);
        out.gulls.push(...p.gulls);
        out.rings.push(...p.rings);
      }
    }
    // Mouettes : un vol tourne au-dessus du ponton (ou de la plage), un autre traverse l'île de temps en temps ; la nuit,
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
      const c = perch.at ? { x: perch.at.x, y: perch.at.y - perch.z } : this.ground(perch.x, perch.y);
      if (!fled || t - fled.at >= GULL_BACK) hits.push({ key, kind: 'perch', x: c.x, y: c.y - 8, r: 16 });
      else if (t - fled.at < FLY_OFF) {
        const k = (t - fled.at) / FLY_OFF;
        for (let i = 0; i < perch.count; i++) out.gulls.push({ wx: c.x + (60 + i * 14) * k, wy: c.y + i * 4 - 20 * k, alt: 6 + 90 * k * k, flip: false, phase: i });
      }
    }
    // La barque de l'arrivant : elle arrive du large (BOAT_SAIL secondes), puis se balance à quai
    const dock = this.visitorDock;
    if (dock && this.state.arrival) {
      const arrival = this.boatArrival && this.boatArrival.id === this.state.arrival.id ? this.boatArrival : null;
      const k = arrival ? Math.min(1, (t - arrival.at) / BOAT_SAIL) : 1;
      const ease = 1 - (1 - k) ** 3;
      const x = dock.x + dock.dx * BOAT_FAR * (1 - ease);
      const y = dock.y + dock.dy * BOAT_FAR * (1 - ease);
      // (dessin de la bibliothèque, son fanion à sa cadence)
      const lib = isletArtLayer('bateau_visiteur', isletFrameAt('bateau_visiteur', t));
      if (lib) out.standing.push({ kind: 'vboat', x, y, z: Math.sin(t * 1.4) * 1.2, flip: dock.flip, sprite: [lib.key, lib.make] });
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
  // Le Géant des profondeurs (world/faune/geant.js) : son passage en eau profonde, près de ce qu'on regarde ; null
  // entre deux passages, et quand le Kraken vient (il s'écarte : krakenOn, de l'image d'avant)
  geantOf(t, view) {
    if (this.krakenOn) return null;
    const go = this.passageOf('geant', t, GEANT_EVERY, GEANT_FOR, 6, this.cellAt(view.x + view.w / 2, view.y + view.h / 2));
    return go && geantAt(go.spot, go.dir, go.τ);
  },
  // Le Géant et le Kraken se touchent, tant qu'on les voit bien (ils entrent au Bestiaire : faune, toucherGeant,
  // toucherKraken) ; à ajouter à ce que la mer donne à toucher (seaHits)
  legendHits(geant, kraken) {
    const hits = [];
    const g = geant && toucherGeant(geant);
    if (g) hits.push({ key: this.passages.geant.key, kind: 'geant', ...g });
    const k = kraken && toucherKraken(kraken);
    if (k) hits.push({ key: this.passages.kraken.key, kind: 'kraken', ...k });
    return hits;
  },
  // Le Kraken (world/faune/kraken.js) : son passage, rare (la nuit, une nuit sur deux environ, presque toujours les
  // nuits d'orage, sur l'horloge du jeu : le même pour tous), quelque part au large : on le croise par hasard, en
  // passant près de lui ; le présage pour tous, le spectacle quand on l'a écrit au Grimoire ; null entre deux passages,
  // et hors de la nuit ou de l'orage de l'île (le tutoriel a son heure à lui). Près de ce qu'on regarde, Lorena (ou
  // Brume) le sent, et l'écran tremble quand il surgit sous nos yeux (krakenShake)
  krakenOf(t, view, phase) {
    const now = Date.now();
    const pass = this.krakenPassage(now);
    const τ = pass ? (now - pass.start) / 1000 : -1;
    this.krakenOn = false;
    this.krakenNear = false;
    if (!pass || τ < 0 || τ >= KRAKEN_FOR || !(phase.night > 0.35 || phase.weather.storm >= 0.5)) return null;
    let p = this.passages.kraken;
    if (!p || p.key !== pass.key) {
      const route = krakenRoute(this.sea.open, pass.cycle);
      if (!route) return null;
      p = this.passages.kraken = { key: pass.key, route, said: false };
    }
    this.krakenOn = true;
    const kr = krakenAt(p.route, τ, (this.elements || []).includes('Kraken'));
    // (près de ce qu'on regarde : à l'écran, ou à une demi-largeur d'écran du bord)
    const c = this.ground(kr.x, kr.y);
    this.krakenNear = c.x > view.x - view.w / 2 && c.x < view.x + view.w * 1.5 && c.y > view.y - view.h / 2 && c.y < view.y + view.h * 1.5;
    if (this.krakenNear && !p.said && kr.vis > 0.3) {
      p.said = true;
      this.sayKraken(pass.key);
    }
    return kr;
  },
  // La nuit du Kraken pour le cycle de l'horloge du jeu en cours : { key, cycle, start (ms) }, ou null s'il ne vient
  // pas ; tirée une fois par cycle (plus sûr les nuits d'orage). En essai (?kraken), un passage 4 s après l'arrivée
  krakenPassage(now) {
    if (KRAKEN_FORCE) {
      if (!this.krakenForced) this.krakenForced = now + 4000;
      return { key: 'kraken:essai', cycle: 7, start: this.krakenForced };
    }
    const cycle = cycleAt(now);
    if (!this.krakenNight || this.krakenNight.cycle !== cycle) {
      const base = cycleStart(cycle);
      const storm = this.skyAt(gameDate(base + krakenNuit(cycle).debut)).weather.storm >= 0.5;
      const { vient, debut } = krakenNuit(cycle, storm);
      this.krakenNight = { cycle, key: `kraken:${cycle}`, start: base + debut, vient };
    }
    return this.krakenNight.vient ? this.krakenNight : null;
  },
  // Lorena le sent venir (Brume, si Lorena n'est pas encore là) : une bulle, une fois par passage
  sayKraken(key) {
    const ponton = this.state && this.state.sites.find(site => site.id === 'ponton' && !site.hidden);
    const id = `kraken-${key}`;
    if (!ponton) {
      guide.say({ id, text: KRAKEN_LINES.brume, island: true });
      return;
    }
    const built = builtOf(this.state.villagers);
    guide.say({ id, text: KRAKEN_LINES.lorena, island: true, who: NAMES.ponton, ...bubbleFace('ponton', { castaway: !built.includes('ponton') }) });
  },
  // Le bras du Kraken entrevu dans l'éclair (world/faune/kraken.js : apercuAt), dans l'eau libre du côté du flash, au
  // loin dans ce qu'on regarde ; { ap, at (la case) }, ou null. La case se tire une fois par coup
  apercuOf(t, view, phase) {
    if (this.krakenOn) return null;
    const ap = apercuAt(t, phase.weather.storm);
    if (!ap) return null;
    let a = this.passages.apercu;
    if (!a || a.coup !== ap.coup) {
      const c = this.cellAt(view.x + view.w * (0.15 + 0.7 * ap.x), view.y + view.h * 0.22);
      a = this.passages.apercu = { coup: ap.coup, at: eauLibre(this.sea.open, c.x, c.y, 5) };
    }
    return a.at ? { ap, at: a.at } : null;
  },
  // La boule de sardines (world/faune/bancs.js) : le banc le plus proche de ce qu'on regarde au début de son passage
  // se ramasse en boule ; null entre deux
  bouleOf(t, view) {
    const cycle = Math.floor(t / BOULE_EVERY), τ = t - cycle * BOULE_EVERY;
    const schools = this.sea.schools;
    if (τ >= BOULE_FOR || !schools.length) return null;
    let p = this.passages.boule;
    if (!p || p.cycle !== cycle) {
      const c = this.cellAt(view.x + view.w / 2, view.y + view.h / 2);
      let k = 0;
      schools.forEach((s, i) => { if (Math.hypot(s.x - c.x, s.y - c.y) < Math.hypot(schools[k].x - c.x, schools[k].y - c.y)) k = i; });
      p = this.passages.boule = { cycle, k };
    }
    return bouleAt(schools, p.k, τ);
  },
  // Un toucher sur un animal : les dauphins plongent, la baleine souffle, les mouettes posées s'envolent, les bancs fusent
  scare(animal) {
    if (this.reduced()) return;
    const t = performance.now() / 1000;
    for (const [key, was] of this.scared) if (t - was.at > 2 * GULL_BACK) this.scared.delete(key);
    if (animal.kind === 'pod') this.scared.set(animal.key, { at: t, where: animal.where });
    else if (animal.kind === 'whale') this.scared.set(animal.key, { at: t, ...animal.at });
    else this.scared.set(animal.key, { at: t });
    vibrate(6);
    this.drawSoon();
  },
  // Mouettes posées : quelques plages au bord de la mer (côté large), dans les quartiers à soi, libres (ni
  // chantier, ni création, ni arbre ou rocher)
  // Cases de sable libres dans les quartiers à soi : au bord de la mer (mouettes posées), ou toutes (edge faux : la
  // bouteille à la mer)
  beachOf(state, owned, busy, edge = true) {
    const M = this.M;
    const cells = [];
    for (let y = 0; y < state.size; y++) {
      for (let x = 0; x < state.size; x++) {
        if (M.ground(x, y) !== 's' || busy.has(`${x},${y}`)) continue;
        const zone = state.map.zones[M.zone(x, y)];
        if (!zone || !owned.has(zone.id) || state.sites.some(site => this.covers(site, x, y))) continue;
        if (!edge || [[1, 0], [0, 1]].some(([dx, dy]) => M.ground(x + dx, y + dy) === '~')) cells.push({ x, y });
      }
    }
    return cells;
  },
  // Bouteille à la mer qui attend (choix de l'auteur, 15 oct.) : sur n'importe quelle case de sable libre des quartiers à
  // soi (jamais en mer ni sous la brume ; pas sous les mouettes), tirée au hasard, la même pour une même bouteille
  bottleSpotOf(state) {
    const bottle = state.chests && state.chests.bottle;
    if (!bottle || !bottle.available) return null;
    const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
    const busy = new Set([...(state.crafts ? state.crafts.placed : []), ...this.props, ...this.perches].map(c => `${c.x},${c.y}`));
    const cells = this.beachOf(state, owned, busy, false);
    const h = [...bottle.key].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
    return cells.length ? cells[h % cells.length] : null;
  },
  perchesOf(state) {
    const M = this.M;
    const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
    const busy = new Set([...(state.crafts ? state.crafts.placed : []), ...this.props].map(c => `${c.x},${c.y}`));
    // (rien sous le camp : pas de mouette posée sous l'épave)
    for (const item of state.camp || []) for (let dy = 0; dy < (item.h || 1); dy++) for (let dx = 0; dx < (item.w || 1); dx++) busy.add(`${item.x + dx},${item.y + dy}`);
    const cells = this.beachOf(state, owned, busy);
    // La colonie de l'Îlot aux Mouettes : trois groupes plus nombreux au bord de l'îlot
    const colony = owned.has(COLONY_ZONE)
      ? this.islets.colony.filter(c => !busy.has(`${c.x},${c.y}`) && [[1, 0], [0, 1], [-1, 0], [0, -1]].some(([dx, dy]) => !M.land(c.x + dx, c.y + dy)))
      : [];
    return [
      ...spread(cells, 5, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 1 + (k % 2) })),
      ...spread(colony, 2, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 2 + (k % 2) })),
      ...this.wreckPerchesOf(state)
    ];
  },
  // Les mouettes posées sur l'épave (camp.json : perchoirs ; choix de l'auteur, 15 oct.) : deux ou trois de ses perchoirs,
  // d'autres chaque jour, une mouette chacun ; à sa place dans le monde (at), en hauteur (z), rangées devant elle
  wreckPerchesOf(state) {
    const day = Math.floor(Date.now() / 86400000);
    const out = [];
    for (const item of state.camp || []) {
      const points = campPerches(item.art);
      if (!points.length || (this.hiddenCell && this.hiddenCell(item.x, item.y))) continue;
      const c = item.w > 1 ? this.centerOf(item) : this.ground(item.x, item.y);
      const cx = item.x + ((item.w || 1) - 1) / 2, cy = item.y + ((item.h || 1) - 1) / 2;
      const picked = points.map((p, i) => ({ p, i, roll: hash(day + i * 7.3, i * 1.7 + 0.5) })).sort((a, b) => a.roll - b.roll).slice(0, 2 + (day % 2));
      for (const { p, i } of picked) {
        const [px, py] = P(p.u, p.v, 0);
        out.push({ id: `${item.id}:${i}`, x: cx + p.u, y: cy + p.v, at: { x: c.x + px, y: c.y + py }, z: p.z, depth: item.x + item.y + (item.w || 1) + 0.5, count: 1 });
      }
    }
    return out;
  }
};
