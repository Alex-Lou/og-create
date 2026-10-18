<template>
  <!-- Le mode debug (choix de l'auteur, 18 oct. : temporaire, pour son compte seul ; serveur : DEBUG_ACCOUNTS) : à tout
       instant, en bas à droite au-dessus de l'onglet Sceau (sur l'île, en bas à gauche), « Recommencer l'île » d'un appui long (l'anneau se remplit en
       HOLD_MS), sans menu ni mot à écrire ; le jeu reprend au naufrage (App : islandRestarted) -->
  <button
    type="button"
    :class="['debug-reset', { 'is-left': left, 'is-holding': holding, 'is-busy': busy }]"
    :aria-label="ACCOUNT.restartLabel"
    :title="ACCOUNT.restartLabel"
    :disabled="busy"
    @pointerdown="hold"
    @pointerup="release"
    @pointerleave="release"
    @pointercancel="release"
    @contextmenu.prevent
    @click.stop
  >
    <svg class="debug-reset__ring" viewBox="0 0 40 40" aria-hidden="true">
      <circle class="debug-reset__track" cx="20" cy="20" r="17" />
      <circle class="debug-reset__fill" cx="20" cy="20" r="17" :style="{ animationDuration: `${HOLD_MS}ms` }" />
    </svg>
    <svg class="debug-reset__icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
      <path d="M4 3.5v4.2h4.2" />
    </svg>
  </button>
</template>

<script>
import playService from '@/services/playService';
import { vibrate } from '@/utils/fx';
import { ACCOUNT } from '@/texts/ui/account';

// Le temps de garder le doigt dessus (ms)
const HOLD_MS = 1000;

export default {
  name: 'DebugReset',
  // left : sur l'île, en bas à gauche (à droite, le bouton Récolte le cachait)
  props: { left: { type: Boolean, default: false } },
  emits: ['restarted', 'show-alert'],
  data() {
    return { ACCOUNT, HOLD_MS, holding: false, busy: false };
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    hold(event) {
      if (this.busy) return;
      event.preventDefault();
      this.holding = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this.restart(), HOLD_MS);
    },
    release() {
      clearTimeout(this.timer);
      this.holding = false;
    },
    async restart() {
      this.holding = false;
      this.busy = true;
      vibrate([20, 40, 20]);
      try {
        await playService.worldRestart('RECOMMENCER');
        this.$emit('restarted');
      } catch {
        this.busy = false;
        this.$emit('show-alert', ACCOUNT.restartFailed, 'error');
      }
    }
  }
};
</script>

<style scoped src="./DebugReset.css"></style>
