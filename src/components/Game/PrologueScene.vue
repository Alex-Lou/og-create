<template>
  <!-- Une scène du tutoriel (game/prologueScenes.js), plein écran : un toucher avance d'une image ; « Passer le
       prologue » arrête tout le tutoriel (en revoir les scènes, depuis le Sceau, n'a pas ce bouton) -->
  <div ref="root" class="ps" role="dialog" aria-modal="true" :aria-label="label" tabindex="-1" @click="advance" @keydown.enter.prevent="advance" @keydown.space.prevent="advance">
    <transition name="ps-art" mode="out-in">
      <PrologueArt :key="frame.art" :art="frame.art" :cast="frame.cast || []" :recipe="frame.recipe || ''" />
    </transition>
    <p v-if="frame.caption" class="ps__caption">{{ frame.caption }}</p>
    <transition name="ps-bubble" mode="out-in">
      <div v-if="frame.text" :key="k" :class="['ps__bubble', { 'is-thought': frame.thought }]">
        <span v-if="frame.who" class="ps__who">{{ frame.who }}</span>
        <p class="ps__text">{{ frame.thought ? `(${frame.text})` : frame.text }}</p>
        <div v-if="frame.choices" class="ps__choices">
          <button v-for="choice in frame.choices" :key="choice" type="button" class="ps__choice" @click.stop="advance">{{ choice }}</button>
        </div>
        <span v-else class="ps__hint">{{ frame.hint || 'Toucher pour continuer' }}</span>
      </div>
    </transition>
    <span v-if="!frame.text" class="ps__hint ps__hint--alone">Toucher pour continuer</span>
    <button v-if="skippable" type="button" class="ps__skip" @click.stop="$emit('skip')">{{ skipLabel }}</button>
  </div>
</template>

<script>
import PrologueArt from './PrologueArt.vue';
import { SCENES } from '@/game/prologueScenes';
import { reducedMotion } from '@/utils/fx';

export default {
  name: 'PrologueScene',
  components: { PrologueArt },
  props: {
    scene: { type: String, required: true },
    // Images données directement (une veillée, game/vigils.js) ; sinon celles de la scène (game/prologueScenes.js)
    frames: { type: Array, default: null },
    // Revoir le prologue (le Sceau) : pas de « Passer »
    skippable: { type: Boolean, default: true },
    skipLabel: { type: String, default: 'Passer le prologue' }
  },
  emits: ['done', 'skip'],
  data() {
    return { k: 0 };
  },
  computed: {
    list() {
      return this.frames || SCENES[this.scene] || [];
    },
    frame() {
      return this.list[this.k] || {};
    },
    label() {
      if (this.scene.startsWith('veillee-')) return `Veillée ${this.scene.slice(8)}`;
      if (this.scene === 'revelation') return 'La Révélation';
      if (this.scene.startsWith('trace-')) return 'Une trace d’Anya';
      return this.scene === 'arrivee' ? 'Le naufrage de l’Hirondelle' : 'La Grève';
    }
  },
  watch: {
    frame: { immediate: true, handler() { this.arm(); } },
    scene() {
      this.k = 0;
    }
  },
  mounted() {
    this.$refs.root.focus();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    // Une image qui avance seule (la tempête) ; avec le mouvement réduit, elle attend un toucher
    arm() {
      clearTimeout(this.timer);
      if (this.frame.auto && !reducedMotion()) this.timer = setTimeout(() => this.advance(), this.frame.auto);
    },
    advance() {
      if (this.k < this.list.length - 1) this.k++;
      else {
        clearTimeout(this.timer);
        this.$emit('done', this.scene);
      }
    }
  }
};
</script>

<style scoped>
.ps {
  position: fixed; inset: 0; z-index: var(--z-prologue); overflow: hidden; cursor: pointer; outline: none;
  background: #05080F; color: var(--oc-night-ink);
  -webkit-tap-highlight-color: transparent; user-select: none;
}
.ps__caption {
  position: absolute; left: 0; right: 0; top: max(70px, calc(env(safe-area-inset-top) + 56px)); margin: 0; padding: 0 16px; text-align: center;
  font-family: var(--font-fell); font-style: italic; font-size: 20px; color: rgba(244, 238, 220, .85);
  text-shadow: 0 2px 8px rgba(0, 0, 0, .8);
}
.ps__bubble {
  position: absolute; left: 50%; bottom: max(28px, calc(env(safe-area-inset-bottom) + 18px)); transform: translateX(-50%);
  width: min(560px, calc(100% - 32px)); padding: 14px 18px 12px; border-radius: var(--r-board);
  background: rgba(250, 244, 228, .96); color: #3E2A1E;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .45), inset 0 0 0 1px rgba(201, 162, 74, .6);
}
.ps__bubble.is-thought { background: rgba(20, 30, 48, .82); color: #E8EEF8; box-shadow: 0 10px 30px rgba(0, 0, 0, .45), inset 0 0 0 1px rgba(200, 220, 240, .25); }
.ps__who { display: block; margin-bottom: 2px; font-family: var(--font-fell-sc); font-size: 15px; letter-spacing: .06em; color: #2F6286; }
.ps__text { margin: 0; font-family: var(--font-fell); font-size: 20px; line-height: 1.3; }
.is-thought .ps__text { font-style: italic; }
.ps__hint { display: block; margin-top: 8px; font-family: var(--font-ui); font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; opacity: .6; }
.ps__hint--alone { position: absolute; left: 0; right: 0; bottom: max(30px, calc(env(safe-area-inset-bottom) + 20px)); text-align: center; color: rgba(244, 238, 220, .7); }
.ps__choices { display: flex; gap: 10px; margin-top: 12px; }
.ps__choice {
  flex: 1; min-height: 44px; border: 0; border-radius: var(--r-pill); cursor: pointer;
  background: rgba(232, 238, 248, .14); color: inherit; box-shadow: inset 0 0 0 1px rgba(232, 238, 248, .35);
  font-family: var(--font-fell); font-size: 18px;
}
.ps__skip {
  position: absolute; top: max(14px, env(safe-area-inset-top)); right: 14px; min-height: 40px; padding: 8px 16px;
  border: 0; border-radius: var(--r-pill); cursor: pointer;
  background: rgba(0, 0, 0, .35); color: rgba(244, 238, 220, .85); box-shadow: inset 0 0 0 1px rgba(244, 238, 220, .3);
  font-family: var(--font-ui); font-size: 13px; font-weight: 800;
}
.ps__skip:focus-visible, .ps__choice:focus-visible { outline: 3px solid #E3A93B; outline-offset: 2px; }
.ps-art-enter-active, .ps-art-leave-active { transition: opacity .5s ease; }
.ps-art-enter-from, .ps-art-leave-to { opacity: 0; }
.ps-bubble-enter-active, .ps-bubble-leave-active { transition: opacity .25s ease, transform .25s ease; }
.ps-bubble-enter-from, .ps-bubble-leave-to { opacity: 0; transform: translate(-50%, 8px); }
@media (prefers-reduced-motion: reduce) {
  .ps-art-enter-active, .ps-art-leave-active, .ps-bubble-enter-active, .ps-bubble-leave-active { transition: none; }
}
</style>
