// La vie de l'île et de la mer : animaux, poissons, dauphins et baleine, mouettes posées ou en vol, barque du passeur,
// bateau d'un visiteur, bouteille à la mer ; un toucher les effraie. Méthodes de WorldView.vue (this : le composant),
// réunies par draw.js.

import { hash } from '@/world/scene';
import { P } from '@/world/iso';
import { campPerches } from '@/world/campArt';
import { drawSprite, readyImage } from '@/world/spriteCache';
import { lisereOf, graineOf, marquerLisere, BUSTE } from '@/world/lumiere';
import { drawSpout, seaGuests, nearestOpen, spread } from '@/world/sea';
import { FLOATING_ZONE, COLONY_ZONE, ferryPose } from '@/world/islets';
import { SEA_Z, HS, worldOf } from '@/world/terrain';
import { beastSprite, lookOf } from '@/world/beastArt';
import { isletArtLayer, isletFrameAt } from '@/world/decorArt';
import { vibrate } from '@/utils/fx';
import { SEA_SPRITES } from '@/world/seaSprites';
import { GEANT_EVERY, GEANT_FOR, geantAt, BOULE_EVERY, BOULE_FOR, bouleAt, KRAKEN_FOR, KRAKEN_FORCE, krakenNuit, krakenRoute, krakenAt, apercuAt, toucherGeant, toucherKraken } from '@/world/faune';
import { cycleAt, cycleStart, gameDate } from '@/world/gameClock';
import { nearestOpen as eauLibre } from '@/world/sea';
import { KRAKEN_LINES } from '@/texts/world/kraken';
import { guide } from '@/game/guide';
import { bubbleFace, builtOf, NAMES } from '@/world/faces';
import { ISLET_SPRITES } from '@/world/isletSprites';
import { SEA_KINDS } from '../constants';


// Qui nage : de combien son dessin s'enfonce sous l'eau (le maître de la bibliothèque fait 51 de haut : restent la tête
// et les épaules)
const SWIM_SINK = 26;

export const GULL_BACK = 30;

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
    this.henCritters({ t, phase, rain, out, fright, touchable });
    this.shoreCritters({ t, out, hits });
    const { life } = this.villageCritters({ t, phase, out, hits });
    const { glows } = this.strayCritters({ t, out, hits });
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
    // (un habitant, maître ou venu d'ailleurs, reçoit le liseré vivant de la lumière qui domine là où il se tient ;
    // qui nage, non : seule sa tête dépasse de l'eau)
    if (this.liseres && critter.kind === 'villager' && !critter.swim) this.lisereDe(ctx, critter, key, c);
    ctx.restore();
  },
  // Le liseré vivant d'un habitant qu'on vient de dessiner, dans sa transformation (lumiere/lisere.js) ; rien tant que
  // son image n'est pas prête
  lisereDe(ctx, critter, key, c) {
    const ready = readyImage(key);
    if (!ready) return;
    const L = this.liseres;
    const l = lisereOf({ phase: L.phase, lune: L.lune, lumieres: L.lumieres, at: { x: c.x, y: c.y - critter.z - BUSTE }, flip: critter.flip, t: L.t, still: L.still, graine: graineOf(critter.id) });
    if (l) marquerLisere(ctx, ready.img, ready.box, l, L.liste);
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
    this.seaGuestsNow({ t, out, hits, still, guests, center, surface });
    this.seaSchoolsNow({ t, view, phase, out, hits, still, surface });
    this.seaGullsNow({ t, phase, out, hits, still });
    this.seaBoatNow({ t, out, hits, surface });
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
      const spot = nearestOpen(this.waterSeen().open, center.x, center.y, far);
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
      const route = krakenRoute(this.waterSeen().open, pass.cycle);
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
      a = this.passages.apercu = { coup: ap.coup, at: eauLibre(this.waterSeen().open, c.x, c.y, 5) };
    }
    return a.at ? { ap, at: a.at } : null;
  },
  // La boule de sardines (world/faune/bancs.js) : le banc le plus proche de ce qu'on regarde au début de son passage
  // se ramasse en boule ; null entre deux
  bouleOf(t, view) {
    const cycle = Math.floor(t / BOULE_EVERY), τ = t - cycle * BOULE_EVERY;
    const schools = this.waterSeen().schools;
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
