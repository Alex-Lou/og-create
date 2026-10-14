// L'île : ses naufragés au tutoriel. Qui débarque, d'où et quand (de l'épave, à la nage, de la brume, d'une planche
// échouée), où chacun se tient tant que son étape se joue, où dort celui qui dort dans sa forêt, et sa marche à son
// réveil. Mixin de WorldView.vue (folk.js : les habitants une fois là ; game/stages.js : le fil des dévoilements).

import * as storage from '@/utils/storage';
import { TW } from '@/world/view/constants';
import { ARRIVED_KEY } from '@/world/story';
import { looksOf, hiddenOf } from '@/game/stages';
import { BUBBLES } from '@/texts/world/screens/island';

// Le coin de chaque maître au camp (serveur : world/camp.js) : coin → son bâtiment ; la cage des poules, elle-même
// (cachée tant que ce n'est pas son tour : game/stages.js, large)
const CORNERS = { aster: 'ponton', rivet: 'atelier', cannelle: 'foyer', cage: 'cage' };
// Ceux qui, au tutoriel, se tiennent à leur chantier dès leur camp choisi (Hermine, à son Ponton)
const SETTLED = ['ponton'];
// Ceux qui n'arrivent pas de l'épave : Hermine à la nage, au pied de son Ponton ; Jovin de la brume du nord, au pied du
// chemin de son Atelier ; Pierrot de sa planche, échouée un peu plus loin que le Ponton (game/stages.js : nage, lisiere,
// planche)
const ENTRANCES = ['ponton', 'atelier', 'puits'];
// Ceux qui dorment dans leur forêt, pas à leur place (choix de l'auteur, 14 oct. : Freya, à l'orée de la Lisière ; son
// Bosquet, près du Puits) : rôle → le quartier de la forêt, et jusqu'où chercher son orée autour de sa place (cases)
const FOREST_BEDS = { bosquet: 'lisiere' };
const BED_REACH = 14;
// La case de sable où la planche de Pierrot s'échoue (choix de l'auteur, 14 oct. : un peu plus loin que le Ponton, à
// l'ouest, sur la plage du camp d'Hermine, hors de la brume)
const PLANK = { x: 91, y: 98 };
// Le premier débarque un instant après la vue (le temps de souffler), le suivant un peu après (s)
const ARRIVE_DELAY = 0.8;
const ARRIVE_GAP = 6;

export default {
  watch: {
    // La longue-vue d'Hermine voit la planche : elle dérive du large jusqu'au sable (game/stages.js : planche)
    'stage.puits'(now, before) {
      if (before === 'vagues' && now === 'planche' && !this.reduced()) this.plank.at = performance.now() / 1000;
    }
  },
  created() {
    // La planche de Pierrot : l'instant (s) où elle a commencé à dériver vers le sable, ou null (village/residents.js la
    // lit à chaque image : le même objet, passé par postsOf)
    this.plank = { at: null };
  },
  beforeUnmount() {
    clearTimeout(this.arrivalTimer);
  },
  methods: {
    // Les naufragés qui débarquent (choix de l'auteur, 8 oct. : un personnage à la fois, qu'on voit arriver) : ceux de
    // la troupe que cet appareil n'a jamais vus arrivent à pied depuis l'épave (village.js, arrivals) ; un dormeur
    // trouvé à sa place ne débarque pas. Le premier passage sur un appareil (rien de retenu) ne rejoue rien. Rend la
    // Map rôle → { from, at } pour villageOf, et la liste des nouveaux dans arrivalNews
    arrivalsOf(state) {
      this.arrivalNews = [];
      // (celui qui n'a pas encore paru n'est pas encore arrivé : il débarquera après sa scène)
      // (qui nage encore, attend au bord de la brume ou dort sur sa planche n'a pas débarqué : il marchera de là, sa scène
      // vue)
      const waiting = id => looksOf(this.stage, id).eau || looksOf(this.stage, id).lisiere || looksOf(this.stage, id).planche;
      const troupe = (state.villagers || []).filter(v => v.seed === undefined && looksOf(this.stage, v.id).arrived && !waiting(v.id));
      const known = storage.load(ARRIVED_KEY, null);
      if (!Array.isArray(known)) {
        storage.save(ARRIVED_KEY, troupe.map(v => v.id));
        return this.arrivals || null;
      }
      const fresh = troupe.filter(v => !known.includes(v.id));
      if (!fresh.length) return this.arrivals || null;
      storage.save(ARRIVED_KEY, [...known, ...fresh.map(v => v.id)]);
      const wreck = (state.camp || []).find(c => c.art === 'hirondelle');
      const walking = fresh.filter(v => !v.asleep);
      if (!wreck || !walking.length || this.reduced()) return this.arrivals || null;
      const arrivals = new Map(this.arrivals || []);
      const now = performance.now() / 1000;
      // (de l'épave : chacun sort de l'eau sur notre plage, là où sa scène l'a montré ; Hermine, au pied de son Ponton)
      const from = { x: wreck.x + (wreck.w || 1), y: wreck.y + (wreck.h || 1) };
      const fromOf = v => (ENTRANCES.includes(v.id) && this.entranceOf(state, v.id)) || from;
      walking.forEach((v, i) => arrivals.set(v.id, { from: fromOf(v), at: now + ARRIVE_DELAY + i * ARRIVE_GAP }));
      this.arrivalNews = walking.map((v, i) => ({ id: v.id, name: v.name, delay: ARRIVE_DELAY + i * ARRIVE_GAP }));
      return arrivals;
    },
    // Ceux qui sortent de l'eau maintenant (ids) : oubliés de ceux que cet appareil a vus arriver, pour que arrivalsOf les
    // fasse marcher depuis l'épave
    landing(ids) {
      const known = storage.load(ARRIVED_KEY, null);
      if (ids.length && Array.isArray(known)) storage.save(ARRIVED_KEY, known.filter(id => !ids.includes(id)));
    },
    // Ce que l'île montre pendant le tutoriel (game/stages.js : stage) : un chantier pas encore bâti d'un personnage qui
    // ne l'a pas encore montré reste caché, comme le coin de qui n'a pas encore paru ou pas encore choisi son camp (sa
    // zone reste sous la brume : terrain.js, veiledOf). La caisse d'Hermine, échouée avec elle, est sur notre plage, près de
    // l'épave, tant qu'elle y est (contre elle, au nord : hors du coin de Marcelle, voilé jusqu'à sa scène, et loin de là
    // où Hermine se tient, au sud, pour qu'on la touche elle et pas Hermine). Le reste, tel que le serveur l'envoie
    unsettledView(state) {
      const noSite = new Set(hiddenOf(this.stage, 'site'));
      const noCoin = new Set(hiddenOf(this.stage, 'coin'));
      if (!state || (!noSite.size && !noCoin.size)) return state;
      const wreck = (state.camp || []).find(c => c.art === 'hirondelle');
      const beached = item => item.art === 'caisses' && ['nage', 'plage'].includes(this.stage.ponton) && wreck;
      return {
        ...state,
        sites: state.sites.map(site => (noSite.has(site.id) && !site.level ? { ...site, hidden: true } : site)),
        camp: (state.camp || []).filter(item => !noCoin.has(CORNERS[item.id]))
          .map(item => (beached(item) ? { ...item, x: wreck.x + (wreck.w || 1), y: wreck.y } : item))
      };
    },
    // Où se tient chacun pendant le tutoriel (village.js : posts) : dans l'eau, au pied de son chantier, tant qu'il nage
    // (swim) ; débarqué, sur le sable à côté (jamais à l'épave : choix de l'auteur, 12 oct.) ; son camp choisi et son
    // chantier pas encore bâti, à ce chantier (sinon le jeu l'envoie au Feu, avec le camp)
    postsOf(state) {
      if (!this.thickMist(state)) return null;
      const posts = new Map();
      for (const v of state.villagers || []) {
        const look = looksOf(this.stage, v.id);
        const site = state.sites.find(s => s.id === v.id);
        if (look.eau && site) posts.set(v.id, { ...this.entranceOf(state, v.id), swim: true });
        else if (look.lisiere && site) posts.set(v.id, this.entranceOf(state, v.id));
        else if (look.planche && site) posts.set(v.id, { ...this.entranceOf(state, v.id), plank: this.plank });
        // (sur le sable devant son chantier, côté mer, du côté opposé à l'épave : on la voit, rien ne la cache)
        else if (look.rive && site) posts.set(v.id, { x: site.x, y: site.y + (site.h || site.w) });
        else if (v.built === false && SETTLED.includes(v.id)) posts.set(v.id, 'site');
      }
      return posts;
    },
    // Où dort, avant qu'on le réveille, celui qui dort dans sa forêt (FOREST_BEDS) : à l'orée, la case d'herbe de son
    // quartier la plus proche de sa place qui a la forêt juste derrière elle (au nord ou à l'ouest : les arbres ne le
    // cachent pas) ; Map rôle → case, ou null
    bedsOf(state) {
      const beds = new Map();
      for (const v of state.villagers || []) {
        const forest = v.asleep && FOREST_BEDS[v.id];
        const site = forest && state.sites.find(s => s.id === v.id);
        const zone = site && state.map.zones.findIndex(z => z.id === forest);
        if (!site || zone < 0) continue;
        const cx = site.x + site.w / 2;
        const cy = site.y + site.h / 2;
        let best = null;
        for (let y = Math.floor(cy - BED_REACH); y <= cy + BED_REACH; y++) {
          for (let x = Math.floor(cx - BED_REACH); x <= cx + BED_REACH; x++) {
            const behind = this.M.ground(x, y - 1) === 'f' || this.M.ground(x - 1, y) === 'f';
            if (this.M.zone(x, y) !== zone || !['g', 'm', 's'].includes(this.M.ground(x, y)) || !behind) continue;
            const d = Math.hypot(x + 0.5 - cx, y + 0.5 - cy);
            if (!best || d < best.d) best = { x, y, d };
          }
        }
        if (best) beds.set(v.id, { x: best.x, y: best.y });
      }
      return beds.size ? beds : null;
    },
    // Un dormeur réveillé loin de sa place (bedsOf, l'état d'avant) : il marche de là jusqu'à elle (village.js, arrivals)
    wakeWalk(state, id) {
      const bed = this.reduced() ? null : (this.bedsOf(this.state) || new Map()).get(id);
      if (!bed) return;
      this.arrivals = new Map(this.arrivals || []);
      this.arrivals.set(id, { from: bed, at: performance.now() / 1000 + ARRIVE_DELAY });
    },
    // D'où arrive un personnage qui n'arrive pas de l'épave : la case d'eau au pied de son chantier (Hermine, sous le bord
    // avant de son Ponton) ; le bord de la brume au pied du chemin de son chantier (Jovin, trois cases au sud de son
    // Atelier : la plage, devant le feu) ; sa planche échouée (Pierrot) ; null pour les autres
    entranceOf(state, id) {
      const site = state.sites.find(s => s.id === id);
      if (!site || !ENTRANCES.includes(id)) return null;
      if (id === 'puits') return { ...PLANK };
      return id === 'atelier' ? { x: site.x, y: site.y + site.w + 3 } : { x: site.x, y: site.y + site.w };
    },
    // Chaque naufragé qui débarque : la caméra glisse vers sa place, une bulle dit qui arrive (après villageOf)
    showArrivals() {
      const news = this.arrivalNews || [];
      clearTimeout(this.arrivalTimer);
      const next = k => {
        const v = news[k];
        if (!v || !this.village) return;
        const r = this.village.residents.find(res => res.role === v.id);
        if (r && this.geo) {
          const g = this.ground(r.work.x, r.work.y);
          this.glideTo({ x: g.x, y: g.y, s: Math.max(this.cam.s, 1.1) });
          const camp = r.camp || r.role === 'foyer';
          this.$nextTick(() => this.showTip(this.geo.width / 2, this.geo.height / 2 - TW, { title: v.name, text: camp ? BUBBLES.landedCamp : BUBBLES.landed }));
        }
        if (news[k + 1]) this.arrivalTimer = setTimeout(() => next(k + 1), (news[k + 1].delay - v.delay) * 1000);
      };
      if (news.length) this.arrivalTimer = setTimeout(() => next(0), news[0].delay * 1000);
    }
  }
};
