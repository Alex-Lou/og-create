// L'île : les nuits de créatures (HISTOIRE.md § 6.15 ; serveur : services/nights.js). Brume les présente à la fin du
// prologue ; la nuit, les égarés marchent vers leurs bâtiments (un toucher en repousse un) ; au matin, Brume en fait le
// bilan ; un bâtiment embrumé se répare depuis sa fiche. Mixin de WorldView.vue : ses données et méthodes s'ajoutent à
// celles de l'île, qui les lit dans son gabarit.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { recapOf, MS_PER_CELL } from '@/world/strays';
import { SOUNDS } from '@/texts/village';
import { coach } from '@/game/coach';
import { guide } from '@/game/guide';
import { FAILED } from '@/texts/world/screens/alerts';
import { NIGHT_REPLY } from '@/texts/world/screens/explore';
import { playerBubble } from '@/world/faces';

// Le bilan d'une nuit se dit une fois par appareil (la dernière nuit racontée)
const TOLD_KEY = 'oc_night_told';
const told = () => {
  try { return localStorage.getItem(TOLD_KEY); } catch (e) { return null; }
};
// Le chant du coq se montre s'il vient de passer (ms), ou s'il viendra dans la nuit
const CROW_LATE_MS = 4000;
const CROW_AHEAD_MS = 10 * 3600 * 1000;

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
  beforeUnmount() {
    clearTimeout(this.crowTimer);
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
      this.scheduleCrow();
      const nights = this.state && this.state.nights;
      if (!nights || this.nightSheet || this.wreck || this.reveal || this.haul || this.nightsWait) return;
      if (!nights.started) {
        if (this.actsDone.includes('T') && !this.thickMist()) this.nightSheet = { mode: 'intro' };
        return;
      }
      const last = nights.last;
      // (l'appareil garde le numéro de la nuit en texte, le serveur l'envoie en nombre : on compare les deux en texte)
      if (!last || told() === String(last.id)) return;
      const lines = recapOf(last, id => (this.state.sites.find(s => s.id === id) || {}).name || id);
      if (lines.length) this.nightSheet = { mode: 'recap', id: last.id, lines };
    },
    // Le coq chante (serveur : la fin « coq » d'un égaré, une fois par nuit) : « Cocorico ! » au-dessus du poulailler, à
    // l'instant où il voit celui qu'il chasse
    scheduleCrow() {
      const nights = this.state && this.state.nights;
      const crow = nights && nights.creatures && nights.creatures.find(c => c.end === 'coq');
      if (!crow || this.crowed === crow.id) return;
      const wait = crow.at + crow.step * (crow.pace || MS_PER_CELL) - Date.now();
      if (wait < -CROW_LATE_MS || wait > CROW_AHEAD_MS) return;
      this.crowed = crow.id;
      clearTimeout(this.crowTimer);
      this.crowTimer = setTimeout(() => {
        const coop = this.state && this.coopOf(this.state);
        if (coop) this.sparkleCell('eclat', coop, [{ text: SOUNDS.rooster }]);
      }, Math.max(0, wait));
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
      // (la présentation refermée : le joueur répond, sur l'île)
      guide.say({ id: 'nuits-joueur', text: NIGHT_REPLY, island: true, ...playerBubble(this.state && this.state.avatar) });
      try {
        this.apply((await playService.nightsStart()).world);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.brumeLines), 'error');
      }
    },
    // Un toucher sur un égaré, la nuit : il boude et retourne dans la brume (le serveur le compte repoussé)
    async repelStray(stray, at) {
      if (this.repelled.has(stray.id)) return;
      this.repelled.set(stray.id, Date.now());
      vibrate(10);
      this.sparkleAt('petille', at);
      try {
        this.apply((await playService.nightsRepel(stray.id)).world);
      } catch (error) {
        this.repelled.delete(stray.id);
        this.$emit('show-alert', messageOf(error, FAILED.stray), 'error');
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
        // (la brume se dissipe sous les yeux, un Éclat sur le bâtiment : pas de notification en double, choix de
        // l'auteur, 13 oct.)
        this.sparkle('eclat', this.siteAt(site));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.repair), 'error');
      } finally {
        this.busy = false;
      }
    }
  }
};
