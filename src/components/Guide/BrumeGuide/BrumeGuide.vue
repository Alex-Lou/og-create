<template>
  <!-- Brume, le feu follet guide : une réplique à la fois (game/guide.js), au-dessus de la barre d'onglets, sans
       bloquer le jeu. À chacune de ses bulles, il naît de la brume (choix de l'auteur, 14 oct.) : des volutes se
       resserrent en flamme, puis ses yeux s'ouvrent ; quand ses répliques s'enchaînent, une naissance courte (un toucher
       passe la naissance). Chacun parle avec sa couleur et son motif (game/speakers.js) ;
       un inconnu en silhouette, sous « ??? » ; un hostile dans une bulle sombre, son portrait à droite ; une didascalie
       (aside : « (Tu ne réponds pas.) »), en italique, sans nom ni visage -->
  <transition name="guide">
    <aside v-if="entry" :key="entry.id" :class="['guide', `is-${speaker.family}`, { 'is-birth': birth === 'full', 'is-reborn': birth === 'short', 'is-top': entry.top, 'is-aside': entry.aside }]" :style="speakerStyle" :aria-label="speaker.name" @click="skip">
      <div v-if="!entry.aside" class="guide__spirit" aria-hidden="true">
        <template v-if="birth === 'full'">
          <i v-for="k in MIST" :key="k" class="guide__mist" :style="mistStyle(k)"></i>
        </template>
        <img v-if="entry.face" :class="['guide__face', { 'is-bust': entry.bust }]" :src="entry.face" alt="" />
        <BrumeWisp v-else class="guide__wisp" :size="46" :waking="birth === 'full'" :stage="stage" />
      </div>
      <div class="guide__bubble" role="status">
        <svg v-if="speaker.motif" class="guide__motif" viewBox="0 0 24 24" aria-hidden="true"><path :d="speaker.motif" /></svg>
        <span v-if="!entry.aside" class="guide__name">{{ speaker.name }}</span>
        <p class="guide__text">{{ text }}</p>
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
import { guide, birthOf } from '@/game/guide';
import { speakerOf } from '@/game/speakers';
import { accord } from '@/game/accord';
import { reducedMotion } from '@/utils/fx';

// Naissance : durée totale (ms), celle de la naissance courte (répliques enchaînées), et nombre de volutes
const BIRTH_MS = 2700;
const SHORT_MS = 600;
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
    // birth : la naissance en cours, 'full', 'short' ou false
    return { MIST, birth: false };
  },
  computed: {
    entry() {
      return guide.current;
    },
    // Qui parle (game/speakers.js) : Brume si personne n'est nommé
    speaker() {
      const entry = this.entry || {};
      return speakerOf(entry.who || 'Brume', { stranger: entry.stranger, hostile: entry.hostile });
    },
    // La réplique, accordée au genre du joueur (« naufragé|naufragée » : game/accord.js)
    text() {
      return accord(this.entry.text);
    },
    speakerStyle() {
      const { color, tint } = this.speaker;
      return color ? { '--speaker': color, '--speaker-tint': tint } : null;
    }
  },
  watch: {
    entry: {
      immediate: true,
      handler(now, before) {
        const kind = birthOf(now, before);
        if (kind) this.beBorn(kind);
      }
    }
  },
  beforeUnmount() {
    clearTimeout(this.birthTimer);
  },
  methods: {
    beBorn(kind) {
      clearTimeout(this.birthTimer);
      if (reducedMotion()) return;
      this.birth = kind;
      this.birthTimer = setTimeout(() => { this.birth = false; }, kind === 'full' ? BIRTH_MS : SHORT_MS);
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
