// L'île : la cage et les poules de Cannelle. Sa cage, échouée au bout de la plage (au tutoriel, la longue-vue d'Aster la
// voit dériver du large jusqu'au sable), s'ouvre d'un toucher ; Paprika, Brioche et Madame vivent autour d'elle, puis
// autour de leur poulailler. Au tutoriel, sorties de la cage, elles s'échappent : on les attrape une à une (le premier
// toucher, elle s'esquive d'un bond ; le second, elle se laisse prendre), game/stages.js : echappee. Mixin de
// WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { HENS, looksOf } from '@/game/stages';

// Où chaque poule échappée se tient, dans le coin de Cannelle (world/zones.js), puis où elle bondit à son premier toucher
const LOOSE = { 'poule-rousse': [[102, 95], [104, 97]], 'poule-blanche': [[100, 98], [103, 96]], 'poule-noire': [[104, 96], [102, 97]] };
// La course d'une poule qui s'esquive (s ; trois petits bonds : village/farm.js)
const DODGE_S = 1.1;
// La cage qui dérive jusqu'au sable : sa durée (s), d'où elle part (cases vers le large)
const DRIFT_S = 3.2;
const DRIFT_FROM = 3;

export default {
  data() {
    return {
      // Les poules échappées qui se sont déjà esquivées : id → instant du bond (s)
      henDodged: {},
      // L'instant où la cage a commencé à dériver (s), ou null
      cageDrift: null
    };
  },
  computed: {
    // Les poules échappées (au tutoriel) : Map id → { from, to, at, span } (sa place ; d'où et quand elle a bondi)
    looseHens() {
      const out = new Map();
      const hens = this.state && this.state.beasts ? this.state.beasts.list : [];
      for (const id of HENS) {
        if (!looksOf(this.stage, id).loose || !hens.some(b => b.id === id)) continue;
        const [first, second] = LOOSE[id].map(([x, y]) => ({ x, y }));
        const at = this.henDodged[id] || null;
        out.set(id, { from: first, to: at ? second : first, at, span: DODGE_S });
      }
      return out;
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
        if (!this.thickMist()) this.$emit('show-alert', 'Cannelle : « Mes filles ! Elles ont tenu bon ! » Brioche, Paprika et Madame sont sorties.');
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La cage n’a pas pu s’ouvrir.'), 'error');
        this.load();
      } finally {
        this.busy = false;
      }
    },
    // Toucher une poule échappée : la première fois, elle s'esquive d'un bond ; la seconde, elle se laisse prendre et
    // rejoint les autres (App : caught)
    tapHen(id, at = null) {
      if (!this.looseHens.has(id)) return;
      vibrate(8);
      if (!this.henDodged[id]) {
        this.henDodged = { ...this.henDodged, [id]: performance.now() / 1000 };
        return;
      }
      this.sparkleAt('petille', at);
      this.$emit('caught', id);
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
