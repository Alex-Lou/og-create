// L'île : la carte, case par case. Ce qui pousse (nature, forêt, plage, rochers), terre et quartiers, brume, rivage,
// vent. Mixin de WorldView.vue : ses méthodes s'ajoutent à celles de l'île.

import { landmarksShown } from '@/world/landmarks';
import { depositsShown } from '@/world/finds';
import { drawSprite } from '@/world/spriteCache';
import { HS } from '@/world/terrain';
import { COLONY_ZONE } from '@/world/islets';
import { spread } from '@/world/sea';
import { hash } from '@/world/scene';
import { plantLook } from '@/world/plants';
import { TW, ALL_NATURE } from '@/world/view/constants';

// Achat d'un quartier : la brume se dissipe (ms)
const UNVEIL_MS = 1600;
const BEACH_MIX = [['palm', 0.1], ['mossy', 0.15], ['shells', 0.2], ['driftwood', 0.23]];
const ROCK_MIX = [['rock', 0.3], ['rocks', 0.55], ['crag', 0.72], ['mossy', 1]];
const GRASS_MIX = [['tuft', 0.1], ['flowers', 0.16], ['bush', 0.185], ['mushrooms', 0.205], ['stump', 0.22], ['birch', 0.235], ['apple', 0.245], ['autumn', 0.255], ['log', 0.265]];
// Forêt : deux arbres par case (sapins en hauteur) ; au bord de l'eau douce, roseaux et nénuphars
const FOREST_LOW = ['tree', 'birch', 'pine', 'autumn'];
const FOREST_HIGH = ['pine', 'pine', 'tree'];

export default {
  methods: {
    // Cases autour de ce qui se tient debout (bâtiments, camp, créations, annexes, lieux remarquables, gisements), jusqu'à deux cases
    // devant : le décor qui s'y trouve n'est jamais cuit dans le sol (il passe devant eux). Set des clés y * n + x
    liveCellsOf(state) {
      const n = state.size;
      const cells = new Set();
      const around = (x0, y0, w, h) => {
        for (let y = y0 - 1; y <= y0 + h + 1; y++) for (let x = x0 - 1; x <= x0 + w + 1; x++) cells.add(y * n + x);
      };
      [...state.sites, ...(state.camp || [])].forEach(site => around(site.x, site.y, site.w, site.h));
      [...(state.crafts ? state.crafts.placed : []), ...(state.annexes || []), ...landmarksShown(state), ...depositsShown(state)].forEach(o => around(o.x, o.y, 1, 1));
      return cells;
    },
    // Décor naturel, fixe pour une île donnée, selon le sol : arbres des forêts, arbres isolés, rochers, touffes des
    // dunes ; roseaux et nénuphars au bord de l'eau douce ; palmiers et coquillages sur le sable, touffes et fleurs
    // dans l'herbe libre ; dans les climats, pins enneigés, bruyère, cactus et arbres morts. Une création posée le
    // remplace, et il ne gêne aucun toucher.
    natureOf(state) {
      const n = state.size;
      const M = this.M;
      const taken = new Set([...(state.crafts ? state.crafts.placed : []), ...(state.annexes || []), ...landmarksShown(state)].map(t => t.y * n + t.x));
      // Une clairière autour de chaque gisement : rien ne le cache, même au cœur de la jungle
      for (const d of depositsShown(state)) for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) taken.add((d.y + dy) * n + d.x + dx);
      // (les bâtiments et le camp des naufragés : rien ne pousse dessus)
      [...state.sites, ...(state.camp || [])].forEach(site => {
        for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) taken.add((site.y + dy) * n + site.x + dx);
      });
      const props = [];
      const add = (kind, x, y, dx = 0, dy = 0) => {
        const c = this.world(x + dx, y + dy);
        // Son dessin : celui de la bibliothèque (sa variante tirée de sa place), sinon le dessin par code
        const look = plantLook(kind, x + dx, y + dy) || { key: `nature-${kind}`, make: ALL_NATURE[kind] };
        props.push({ kind, x, y, dx, dy, depth: x + y + (dx + dy) * 0.5, wx: c.x, wy: c.y - this.liftAt(x, y), key: look.key, make: look.make });
      };
      const wet = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => M.ground(x + a, y + b) === 'w');
      // Sable des Dunes : des cactus plutôt que des coquillages
      const dunes = (x, y) => (state.map.zones[M.zone(x, y)] || {}).climate === 'dunes';
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (taken.has(y * n + x)) continue;
          const g = M.ground(x, y);
          const roll = hash(x, y);
          if (g === 'f') {
            const kinds = M.height(x, y) >= 2 ? FOREST_HIGH : FOREST_LOW;
            add(kinds[Math.floor(roll * kinds.length)], x, y, -0.2, -0.16);
            add(kinds[Math.floor(hash(y, x) * kinds.length)], x, y, 0.18, 0.22);
          } else if (g === 't') add(roll < 0.55 ? 'tree' : roll < 0.8 ? 'apple' : 'birch', x, y);
          else if (g === 'r') add(ROCK_MIX.find(([, upTo]) => roll < upTo)[0], x, y);
          else if (g === 'd') add('tuft', x, y);
          else if (g === 'j') {
            // Jungle : deux arbres par case, palmiers et feuillus
            add(roll < 0.5 ? 'palm' : 'tree', x, y, -0.2, -0.16);
            add(hash(y, x) < 0.4 ? 'palm' : 'tree', x, y, 0.18, 0.22);
          } else if (g === 'x') { if (roll < 0.6) add(roll < 0.35 ? 'reeds' : roll < 0.48 ? 'lily' : 'stump', x, y); }
          else if (g === 'l') { if (roll < 0.32) add(roll < 0.12 ? 'heather' : roll < 0.2 ? 'bush' : roll < 0.27 ? 'tuft' : 'rocks', x, y); }
          else if (g === 'n') { if (roll < 0.14) add(M.height(x, y) <= 5 && roll < 0.09 ? 'snowpine' : 'crag', x, y); }
          else if (g === 'a') { if (roll < 0.2) add(roll < 0.1 ? 'deadtree' : 'rocks', x, y); }
          else if (g === 's' && dunes(x, y)) { if (roll < 0.12) add(roll < 0.09 ? 'cactus' : 'rocks', x, y); }
          else if ((g === 'g' || g === 'm') && wet(x, y) && roll < 0.45) add(roll < 0.3 ? 'reeds' : 'lily', x, y);
          else if (g === 's' || g === 'g' || g === 'm') {
            const kind = ((g === 's' ? BEACH_MIX : GRASS_MIX).find(([, upTo]) => roll < upTo) || [null])[0];
            if (kind) add(kind, x, y);
          }
        }
      }
      // Îlot aux Mouettes acheté : les nids de la colonie, sur l'herbe libre
      if (this.owns(state, COLONY_ZONE)) {
        const free = this.islets.colony.filter(c => M.ground(c.x, c.y) === 'g' && !taken.has(c.y * n + c.x) && !props.some(p => p.x === c.x && p.y === c.y));
        spread(free, 2, 3).forEach(c => add('nest', c.x, c.y, 0.08, -0.06));
      }
      return props;
    },
    owns(state, zoneId) {
      return Boolean(state.map.zones.find(z => z.id === zoneId && z.owned));
    },
    /* ---------- Carte : terre, plage, quartiers ---------- */
    // Case de terre (calques du serveur : sol, relief, quartier)
    landAt(x, y) {
      return Boolean(this.M) && this.M.land(x, y);
    },
    zoneAt(x, y) {
      return this.M && this.state ? this.state.map.zones[this.M.zone(x, y)] || null : null;
    },
    // Voile de brume d'une case (quartier à acheter), peint dans les carrés du sol
    veilAt(x, y) {
      const zone = this.state && this.state.map.zones[this.M.zone(x, y)];
      return zone && !zone.owned ? (zone.known === false ? 0.35 : 0.62) : 0;
    },
    // Hauteur (unités du monde) du sol d'une case : ce qui s'y tient debout est remonté d'autant
    liftAt(x, y) {
      return this.M ? Math.max(0, this.M.surface(Math.round(x), Math.round(y))) * HS : 0;
    },
    // Point du monde au sol d'une case (ou d'un point fractionnaire), relief compris
    ground(x, y) {
      const c = this.world(x, y);
      c.y -= this.liftAt(x, y);
      return c;
    },
    lockedAt(x, y) {
      const zone = this.zoneAt(x, y);
      return Boolean(zone && !zone.owned);
    },
    // Opacité de la brume d'un quartier : pleine s'il est à acheter, qui s'efface juste après l'achat
    mistOf(zone, now) {
      if (!zone) return 0;
      if (!zone.owned) return 1;
      const start = this.unveils.get(zone.id);
      if (start === undefined) return 0;
      const k = (now - start) / UNVEIL_MS;
      if (k >= 1) {
        this.unveils.delete(zone.id);
        return 0;
      }
      return 1 - k;
    },
    // Cases de mer au bord de la terre (devant elle) : le poisson saute là
    shoreOf(state) {
      const out = [];
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          if (this.M.ground(x, y) === '~' && [[1, 0], [0, 1]].some(([dx, dy]) => this.landAt(x - dx, y - dy))) out.push({ x, y });
        }
      }
      return out;
    },
    // Place du panneau d'un quartier : choisie par le serveur (sol libre, au bord d'un chemin, près du centre)
    signPlaceOf(zone) {
      return zone.anchor || null;
    },
    // Chantier : 0 = plan à trouver, 1 = plan trouvé, 2 = tout est prêt
    stageOf(site) {
      if (!site.next || !site.next.planOwned) return 0;
      return this.affordable(site) ? 2 : 1;
    },
    // Vent : rafales lentes et frémissement, différents d'un point à l'autre de l'île
    windAt(t, x) {
      const gust = 0.55 + 0.45 * Math.sin(t * 0.21);
      return (Math.sin(t * 1.1 + x * 0.35) * 0.65 + Math.sin(t * 2.6 + x) * 0.25) * gust;
    },
    // Dessine un sprite ancré en (x, y) du monde, plié par le vent (cisaillement depuis sa base) ; hold : comme
    // drawSprite
    swayed(ctx, key, make, x, y, skew, repaint, hold) {
      if (!skew) {
        drawSprite(ctx, key, make, x, y, repaint, hold);
        return;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, 0, -skew, 1, 0, 0);
      drawSprite(ctx, key, make, 0, 0, repaint, hold);
      ctx.restore();
    },
    // Bouffées de poussière autour d'une emprise de chantier, k de 0 à 1 ; span : demi-largeur de l'emprise en cases
    dust(ctx, x, y, k, count = 9, span = 1) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + hash(i, 3);
        const d = TW * (0.45 + 0.5 * k) * span;
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d * 0.5 - k * 14;
        const r = 7 + k * 16 * (0.6 + hash(i, 9));
        ctx.fillStyle = `rgba(214,190,150,${(0.55 * (1 - k)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
};
