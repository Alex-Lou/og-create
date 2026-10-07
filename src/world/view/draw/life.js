// La vie de l'île et de la mer : animaux, poissons, dauphins et baleine, mouettes posées ou en vol, barque du passeur,
// bateau d'un visiteur, bouteille à la mer ; un toucher les effraie. Méthodes de WorldView.vue (this : le composant),
// réunies par draw.js.

import { hash } from '@/world/scene';
import { drawSprite } from '@/world/spriteCache';
import { drawSpout, seaGuests, DOLPHIN_EVERY, DOLPHIN_FOR, podAt, WHALE_EVERY, WHALE_FOR, whaleAt, jelliesAt, circling, crossing, nearestOpen, spread } from '@/world/sea';
import { FLOATING_ZONE, COLONY_ZONE, ferryPose } from '@/world/islets';
import { SEA_Z, HS, worldOf } from '@/world/terrain';
import { CRITTERS } from '@/world/nature';
import { beastSprite, lookOf } from '@/world/beastArt';
import { isletArtLayer, isletFrameAt } from '@/world/decorArt';
import { vibrate } from '@/utils/fx';
import { FISH_SPECIES, SEA_SPRITES } from '@/world/seaSprites';
import { BOTTLE } from '@/world/chest';
import { ISLET_SPRITES } from '@/world/isletSprites';
import { visitorBoat } from '@/world/visitors';
import { SEA_KINDS } from '../constants';

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
  chicken: ['hen', 'blanche'], bee: ['bee', ''], frog: ['frog', ''], gull: ['gull', ''],
  dolphin: ['dolphin', '', frame => ({ pose: 'marche', n: frame + 1 })],
  whale: ['whaleBack', '', frame => ({ pose: 'marche', n: (frame || 0) + 1 })],
  fluke: ['whaleFluke', '', frame => ({ pose: 'marche', n: (frame || 0) + 1 })],
  fish: ['fish', null, frame => ({ pose: 'marche', n: frame === 0 ? 2 : 1 })]
};

export default {
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
      // (dessin de la bibliothèque, à sa cadence, sinon celui du code)
      const lib = isletArtLayer('bouteille', isletFrameAt('bouteille', t));
      out.push({ kind: 'bottle', x: x + 0.5, y: y + 0.5, z: 0, frame, flip: false, sprite: lib ? [lib.key, lib.make] : [`bottle-${frame}`, BOTTLE[frame]] });
      const c = this.ground(x + 0.5, y + 0.5);
      hits.push({ key: 'bottle', kind: 'bottle', bottle: true, x: c.x, y: c.y - 6, r: 14 });
    }
    // Habitants et bêtes du village (on peut les toucher)
    const life = this.village ? this.village.at(t, phase, this.scared) : { list: [], lights: [] };
    for (const who of life.list) {
      out.push(who);
      const c = this.ground(who.x, who.y);
      const person = who.kind === 'villager';
      // Anya est grande (96 de haut) : on la touche au corps, pas seulement aux pieds ; un maître dessiné par la
      // bibliothèque (grand format, 51 de haut) aussi, tête comprise
      const tall = who.species === 'anya';
      const big = person && who.sprite[0].startsWith('lib-');
      // head : du point touché au-dessus de la tête (et de la toile du parapluie), où se pose la bulle d'un besoin
      const head = big ? (who.sprite[0].includes('_parapluie_') ? 41 : 27) : 16;
      hits.push({ key: who.id, kind: person ? 'villager' : who.species, who, x: c.x, y: c.y - who.z - (big ? 24 : person ? 16 : tall ? 44 : 6), r: big ? 20 : person ? 15 : tall ? 34 : 12, head });
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
          // (deux images de nage dans la bibliothèque, 420 ms chacune)
          out.standing.push({ kind: 'whale', x: w.back.x, y: w.back.y, z: 0, e: w.back.e, flip: w.flip, frame: Math.floor(t / 0.42) % 2 });
          w.spouts.forEach(sp => out.standing.push({ kind: 'spout', ...sp, depth: depth + 0.5 }));
          const c = surface(w.back.x, w.back.y);
          hits.push({ key: go.key, kind: 'whale', x: c.x, y: c.y - 6, r: 44, at: { x: w.back.x, y: w.back.y } });
        }
        if (w.fluke) out.standing.push({ kind: 'fluke', x: w.fluke.x, y: w.fluke.y, z: 0, e: w.fluke.e, flip: w.flip, frame: Math.floor(t / 0.42) % 2 });
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
      // (dessin de la bibliothèque, son fanion à sa cadence, sinon celui du code)
      const lib = isletArtLayer('bateau_visiteur', isletFrameAt('bateau_visiteur', t));
      out.standing.push({ kind: 'vboat', x, y, z: Math.sin(t * 1.4) * 1.2, flip: dock.flip, sprite: lib ? [lib.key, lib.make] : [`vboat-${frame}`, () => visitorBoat(frame)] });
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
  }
};
