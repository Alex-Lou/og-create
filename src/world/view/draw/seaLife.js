// La vie de la mer, par sujet (draw/life.js : seaLife les appelle dans l'ordre et réunit ce qu'elles ajoutent) : dauphins,
// baleine et méduses de passage, bancs de poissons, mouettes en vol et posées, barque de l'arrivant. Méthodes de
// WorldView.vue (this : le composant), réunies par draw.js.
import { DOLPHIN_EVERY, DOLPHIN_FOR, podAt, WHALE_EVERY, WHALE_FOR, whaleAt, jelliesAt, circling, crossing } from '@/world/sea';
import { COLONY_ZONE } from '@/world/islets';
import { isletArtLayer, isletFrameAt } from '@/world/decorArt';
import { FUITE, centreOf, plongeons } from '@/world/faune';
import { GULL_BACK } from './life';

// Arrivée du bateau d'un visiteur (secondes) et distance d'où il vient (cases)
const BOAT_SAIL = 6;
const BOAT_FAR = 7;
// Mouettes posées effrayées : envol (s), puis retour
const FLY_OFF = 2.6;

export default {
  seaGuestsNow({ t, out, hits, still, guests, center, surface }) {
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
    if (guests.jellies) out.jellies = jelliesAt(this.waterSeen().open, t);
  },
  seaSchoolsNow({ t, view, phase, out, hits, still, surface }) {
    // Les bancs de poissons (faune/bancs.js) : on peut les toucher (ils fusent, des ronds là où ils étaient) ; le jour,
    // les mouettes plongent dans la boule de sardines
    if (!still) {
      const boule = this.bouleOf(t, view);
      this.waterSeen().schools.forEach((sc, k) => {
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
  },
  seaGullsNow({ t, phase, out, hits, still }) {
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
  },
  seaBoatNow({ t, out, hits, surface }) {
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
  }
};
