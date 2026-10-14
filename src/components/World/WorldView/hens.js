// L'île : la cage et les poules de Cannelle. Sa cage, échouée au bout de la plage (au tutoriel, la longue-vue d'Aster la
// voit dériver du large jusqu'au sable), s'ouvre d'un toucher ; Paprika, Brioche et Madame vivent autour d'elle, puis
// autour de leur poulailler. Au tutoriel, sorties de la cage, elles s'échappent : toucher l'une d'elles ouvre la chasse aux
// poules, une scène à part (choix de l'auteur, 13 oct. : HenChase.vue), game/stages.js : echappee. Mixin de WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { HENS, looksOf } from '@/game/stages';
import { builtOf, bubbleFace } from '@/world/faces';
import { guide } from '@/game/guide';
import { coach } from '@/game/coach';
import { HENS_FREED } from '@/texts/village';

// Où chaque poule échappée picore, dans le coin de Cannelle (world/zones.js), en attendant la chasse
const LOOSE = { 'poule-rousse': [102, 95], 'poule-blanche': [100, 98], 'poule-noire': [104, 96] };
// La cage qui dérive jusqu'au sable : sa durée (s), d'où elle part (cases vers le large)
const DRIFT_S = 3.2;
const DRIFT_FROM = 3;

export default {
  data() {
    return {
      // La chasse aux poules ouverte (HenChase.vue) : ses poules, figées à l'ouverture (une prise ne ferme pas la scène),
      // ou null
      henChase: null,
      // L'instant où la cage a commencé à dériver (s), ou null
      cageDrift: null
    };
  },
  computed: {
    // Les poules échappées (au tutoriel) : Map id → { from, to, at, span } (sa place : elle y picore, village/farm.js)
    looseHens() {
      const out = new Map();
      const hens = this.state && this.state.beasts ? this.state.beasts.list : [];
      for (const id of HENS) {
        if (!looksOf(this.stage, id).loose || !hens.some(b => b.id === id)) continue;
        const [x, y] = LOOSE[id];
        out.set(id, { from: { x, y }, to: { x, y }, at: null, span: 0 });
      }
      return out;
    },
    // Celles que la chasse doit rattraper, avec leur nom ({ id, name }) ; les bâtiments fondés (Cannelle naufragée ou non)
    chaseHens() {
      const hens = this.state && this.state.beasts ? this.state.beasts.list : [];
      return hens.filter(b => this.looseHens.has(b.id)).map(b => ({ id: b.id, name: b.name }));
    },
    chaseBuilt() {
      return this.state ? builtOf(this.state.villagers) : [];
    }
  },
  watch: {
    // La longue-vue d'Aster voit la cage : elle dérive du large jusqu'au sable (game/stages.js : large)
    'stage.cage'(now, before) {
      if (before === 'large' && !now && !this.reduced()) this.cageDrift = performance.now() / 1000;
    }
  },
  methods: {
    // Les poules de Cannelle autour de leur poulailler, sinon de leur cage ouverte (le camp, vu du serveur) :
    // { x, y, hens }, ou null
    coopOf(state) {
      const cage = (state.camp || []).find(c => c.id === 'cage' && c.art === 'cage_ouverte');
      const home = (state.annexes || []).find(a => a.annex === 'poulailler') || cage;
      const hens = state.beasts ? state.beasts.list.filter(b => b.species === 'hen') : [];
      return home && hens.length ? { x: home.x, y: home.y, hens: hens.map(b => ({ id: b.id, name: b.name, ready: b.ready })) } : null;
    },
    // Toucher la cage échouée : elle s'ouvre, Paprika, Brioche et Madame sortent (au tutoriel, Cannelle le dit : ses
    // répliques ; ailleurs, une alerte)
    async openCage(at = null) {
      if (this.busy) return;
      this.busy = true;
      try {
        const { world } = await playService.beastsCage();
        this.apply(world);
        this.sparkleAt('eclat', at);
        vibrate([12, 40, 18]);
        // (Cannelle le dit dans sa bulle, soulagée ; on voit ses poules sortir : choix de l'auteur, 13 oct.)
        if (!this.thickMist()) guide.say({ id: 'poules-liberees', text: HENS_FREED, who: 'Cannelle', ...bubbleFace('foyer', { castaway: !builtOf(this.state.villagers).includes('foyer'), mood: 'soulage' }) }, { first: true });
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La cage n’a pas pu s’ouvrir.'), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Toucher une poule échappée : la chasse aux poules s'ouvre
    tapHen(id) {
      if (!this.looseHens.has(id) || this.henChase) return;
      vibrate(8);
      this.henCaught = [];
      this.henChase = this.chaseHens;
      // (l'île, sous la scène, ne se redessine plus : toute la machine est à la chasse, draw/loop.js ; la main du coach,
      // qui cherchait sa poule sur l'île à chaque image, se met en veille)
      this.syncLoop();
      this.chaseLesson = coach.state.lesson;
      if (this.chaseLesson) coach.clear(this.chaseLesson.id);
    },
    // Une poule prise pendant la chasse : retenue jusqu'à la fermeture de la scène (l'île, ses répliques et sa leçon
    // suivante attendent : une chose à la fois)
    onChaseCaught(id) {
      this.henCaught.push(id);
    },
    // La chasse se ferme (finie, ou « Plus tard ») : les prises vont au tutoriel (App : caught)
    closeChase() {
      this.henChase = null;
      this.syncLoop();
      this.drawSoon();
      // (rien de pris, « Plus tard » : la main revient sur les poules ; sinon, le tutoriel pose l'étape suivante)
      if (this.chaseLesson && !(this.henCaught || []).length && !coach.state.lesson) coach.show(this.chaseLesson);
      this.chaseLesson = null;
      (this.henCaught || []).forEach(id => this.$emit('caught', id));
      this.henCaught = [];
    },
    // Le camp tel qu'on le dessine à l'instant t (s) : la cage qui dérive encore, plus au large et bercée par les vagues
    driftOf(item, t) {
      const k = this.cageDrift === null || item.art !== 'cage_coincee' ? 1 : Math.min(1, (t - this.cageDrift) / DRIFT_S);
      if (k >= 1) return item;
      const ease = 1 - (1 - k) ** 3;
      return { ...item, y: item.y + (1 - ease) * DRIFT_FROM, x: item.x + Math.sin(t * 2.4) * 0.08 * (1 - ease) };
    }
  }
};
