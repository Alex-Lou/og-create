// L'île : les nuits de créatures (HISTOIRE.md § 6.15 ; serveur : services/nights.js). Brume les présente à la fin du
// prologue ; la nuit, les égarés marchent vers leurs bâtiments (un toucher en repousse un) ; au matin, Brume en fait le
// bilan ; un bâtiment embrumé se répare depuis sa fiche. Mixin de WorldView.vue : ses données et méthodes s'ajoutent à
// celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { burst, vibrate } from '@/utils/fx';
import { recapOf } from '@/world/strays';
import { coach } from '@/game/coach';
import { guide } from '@/game/guide';

// Le bilan d'une nuit se dit une fois par appareil (la dernière nuit racontée)
const TOLD_KEY = 'oc_night_told';
const told = () => {
  try { return localStorage.getItem(TOLD_KEY); } catch (e) { return null; }
};

export default {
  data() {
    return {
      // Ce que Brume dit des nuits : { mode: 'intro' } (la présentation) ou { mode: 'recap', id, lines } (le bilan du
      // matin), ou null
      nightSheet: null
    };
  },
  computed: {
    // Le tutoriel parle (une leçon du coach, une réplique en attente) : les nuits attendent qu'il ait fini
    nightsWait() {
      return Boolean(coach.state.lesson || guide.state.queue.length);
    }
  },
  watch: {
    nightsWait(now) {
      if (!now) this.$nextTick(() => this.checkNights());
    },
    // Une annonce refermée (naufrage, coffre) : Brume peut parler des nuits
    wreck(open) {
      if (!open) this.$nextTick(() => this.checkNights());
    },
    reveal(open) {
      if (!open) this.$nextTick(() => this.checkNights());
    },
    haul(open) {
      if (!open) this.$nextTick(() => this.checkNights());
    }
  },
  created() {
    // Égarés repoussés sur cet appareil (leur bouderie se joue) : id → instant (ms) ; bâtiments réparés (leur
    // guérison se joue) : site → instant (performance.now())
    this.repelled = new Map();
    this.heals = new Map();
  },
  methods: {
    // Le bâtiment embrumé (vue du serveur : nights.blight) : { site, since, repair: { resource, amount } } s'il s'agit de
    // celui-ci, sinon null
    blightOf(site) {
      const blight = this.state && this.state.nights && this.state.nights.blight;
      return blight && site && blight.site === site.id ? blight : null;
    },
    // Après chaque vue du serveur : la présentation (le tutoriel fini, premier chemin compris, et les nuits pas encore
    // présentées : choix de l'auteur, 10 oct., Brume parle des créatures quand elles vont vraiment venir, la première
    // nuit après un jour de grâce), sinon le bilan de la dernière nuit (une fois), jamais par-dessus une autre annonce
    checkNights() {
      const nights = this.state && this.state.nights;
      if (!nights || this.nightSheet || this.wreck || this.reveal || this.haul || this.nightsWait) return;
      if (!nights.started) {
        if (this.actsDone.includes('T') && !this.thickMist()) this.nightSheet = { mode: 'intro' };
        return;
      }
      const last = nights.last;
      if (!last || told() === last.id) return;
      const lines = recapOf(last, id => (this.state.sites.find(s => s.id === id) || {}).name || id);
      if (lines.length) this.nightSheet = { mode: 'recap', id: last.id, lines };
    },
    // « Je veillerai » : les nuits commencent (la première, un jour plus tard) ; le bilan : lu
    async closeNightSheet() {
      const sheet = this.nightSheet;
      this.nightSheet = null;
      if (!sheet) return;
      if (sheet.mode === 'recap') {
        try { localStorage.setItem(TOLD_KEY, sheet.id); } catch (e) { /* le confort seulement */ }
        return;
      }
      try {
        this.apply((await playService.nightsStart()).world);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Brume n’a pas pu finir sa phrase. Réessaie plus tard.'));
      }
    },
    // Un toucher sur un égaré, la nuit : il boude et retourne dans la brume (le serveur le compte repoussé)
    async repelStray(stray, at) {
      if (this.repelled.has(stray.id)) return;
      this.repelled.set(stray.id, Date.now());
      vibrate(10);
      if (at && !this.reduced()) burst(at, 10, 40);
      try {
        this.apply((await playService.nightsRepel(stray.id)).world);
      } catch (error) {
        this.repelled.delete(stray.id);
        this.$emit('show-alert', messageOf(error, 'Cet égaré n’a pas pu être repoussé.'));
      }
    },
    // « Réparer » (fiche du bâtiment embrumé) : un peu de pierre ou de bois ; la brume se dissipe
    async repairSite(site) {
      if (this.busy || !this.blightOf(site)) return;
      this.busy = true;
      try {
        const { coins, world } = await playService.worldRepair(site.id);
        this.heals.set(site.id, performance.now());
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([10, 30, 14]);
        this.$emit('show-alert', `« ${site.name} » est réparé : la brume se dissipe.`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le bâtiment n’a pas pu être réparé.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
