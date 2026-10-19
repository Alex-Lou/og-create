// Ce qui vit sur terre, par sujet (draw/life.js : critters les appelle dans l'ordre et réunit ce qu'elles ajoutent) :
// les poules du Foyer, le poisson qui saute, les mouettes posées et la bouteille à la mer, les habitants et les bêtes du
// village, les égarés de la nuit. Méthodes de WorldView.vue (this : le composant), réunies par draw.js.
import { hash } from '@/world/scene';
import { SEA_Z, HS } from '@/world/terrain';
import { isletArtLayer, isletFrameAt } from '@/world/decorArt';
import { FISH_SPECIES } from '@/world/seaSprites';
import { BOTTLE } from '@/world/chest';
import { strayAt, nightNow } from '@/world/strays';
import { strayLayer, strayKind } from '@/world/nightArt';
import { GULL_BACK } from './life';

// Ce qui barre un égaré (serveur : services/nights.js, FENCES)
const STRAY_FENCES = new Set(['cloture', 'muret']);

export default {
  henCritters({ t, phase, rain, out, fright, touchable }) {
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
  },
  shoreCritters({ t, out, hits }) {
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
  },
  villageCritters({ t, phase, out, hits }) {
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
    return { life };
  },
  strayCritters({ t, out, hits }) {
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
    return { glows };
  }
};
