<template>
  <!-- Brume, le feu follet guide : une réplique à la fois (game/guide.js), au-dessus de la barre d'onglets, sans
       bloquer le jeu. À sa toute première apparition, il naît de la brume : des volutes se resserrent en flamme, puis
       ses yeux s'ouvrent (un toucher passe la naissance) -->
  <transition name="guide">
    <aside v-if="entry" :key="entry.id" :class="['guide', { 'is-birth': birth, 'is-top': entry.top }]" aria-label="Brume" @click="skip">
      <div class="guide__spirit" aria-hidden="true">
        <template v-if="birth">
          <i v-for="k in MIST" :key="k" class="guide__mist" :style="mistStyle(k)"></i>
        </template>
        <img v-if="entry.face" :class="['guide__face', { 'is-bust': entry.bust }]" :src="entry.face" alt="" />
        <BrumeWisp v-else class="guide__wisp" :size="46" :waking="birth" :stage="stage" />
      </div>
      <div class="guide__bubble" role="status">
        <span class="guide__name">{{ entry.who || 'Brume' }}</span>
        <p class="guide__text">{{ entry.text }}</p>
        <div class="guide__actions">
          <button v-if="entry.action" type="button" class="guide__btn" @click.stop="act">{{ entry.action.label }}</button>
          <button type="button" class="guide__btn guide__btn--quiet" @click.stop="dismiss">{{ entry.action ? 'Plus tard' : 'Compris' }}</button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<script>
import BrumeWisp from '@/components/Guide/BrumeWisp/BrumeWisp.vue';
import { guide } from '@/game/guide';
import { reducedMotion } from '@/utils/fx';

// Naissance : durée totale (ms) et nombre de volutes
const BIRTH_MS = 2700;
const MIST = 9;

export default {
  name: 'BrumeGuide',
  components: { BrumeWisp },
  props: {
    // Le stade de Brume (game/opus.js), qui donne sa couleur ; null : la couleur de toujours
    stage: { type: Number, default: null }
  },
  emits: ['go'],
  data() {
    return { MIST, birth: false };
  },
  computed: {
    entry() {
      return guide.current;
    }
  },
  watch: {
    entry: {
      immediate: true,
      handler(now) {
        if (now && !guide.state.born) this.beBorn();
      }
    }
  },
  beforeUnmount() {
    clearTimeout(this.birthTimer);
  },
  methods: {
    beBorn() {
      guide.markBorn();
      if (reducedMotion()) return;
      this.birth = true;
      this.birthTimer = setTimeout(() => { this.birth = false; }, BIRTH_MS);
    },
    // Un toucher pendant la naissance la passe
    skip() {
      if (!this.birth) return;
      clearTimeout(this.birthTimer);
      this.birth = false;
    },
    // Volutes réparties en cercle autour de Brume, qui partent l'une après l'autre et s'enroulent vers lui
    mistStyle(k) {
      return { '--a': `${Math.round((k * 360) / MIST)}deg`, '--d': `${k * 60}ms` };
    },
    dismiss() {
      guide.dismiss();
    },
    act() {
      const { mode, reload } = this.entry.action;
      guide.dismiss();
      // Une nouvelle version du jeu : la page se recharge et arrive dans cette version (App/update.js)
      if (reload) window.location.reload();
      else this.$emit('go', mode);
    }
  }
};
</script>

<style scoped src="./BrumeGuide.css"></style>
