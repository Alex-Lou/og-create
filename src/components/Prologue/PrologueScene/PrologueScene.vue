<template>
  <!-- Une scène du tutoriel (game/prologueScenes.js), plein écran : un toucher avance d'une image ; « Passer » termine
       seulement la scène, jamais la progression obligatoire (en revoir les scènes depuis le Sceau n'a pas ce bouton) -->
  <div ref="root" class="ps" role="dialog" aria-modal="true" :aria-label="label" tabindex="-1" @click="advance" @keydown.enter.prevent="advance" @keydown.space.prevent="advance">
    <transition name="ps-art">
      <SceneArt v-if="frame.scene" :key="`${frame.scene}${frame.alone ? '-seul' : ''}${frame.still ? '-fixe' : ''}`" :scene="frame.scene" :look="look" :alone="frame.alone" :pose="frame.avatar || null" :still="frame.still" />
      <PrologueArt v-else :key="frame.art" :art="frame.art" :cast="frame.cast || []" :recipe="frame.recipe || ''" :built="built" />
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
import PrologueArt from '../PrologueArt/PrologueArt.vue';
import SceneArt from '../SceneArt/SceneArt.vue';
import { SCENES } from '@/game/prologueScenes';
import { reducedMotion } from '@/utils/fx';

export default {
  name: 'PrologueScene',
  components: { PrologueArt, SceneArt },
  props: {
    scene: { type: String, required: true },
    // Images données directement (une veillée, game/vigils.js) ; sinon celles de la scène (game/prologueScenes.js)
    frames: { type: Array, default: null },
    // Revoir le prologue (le Sceau) : pas de « Passer »
    skippable: { type: Boolean, default: true },
    skipLabel: { type: String, default: 'Passer le prologue' },
    // Les maîtres dont le bâtiment est fondé (PrologueArt : les autres paraissent en naufragés aux veillées)
    built: { type: Array, default: () => [] },
    // L'avatar du joueur dans les scènes de la bibliothèque (game/sceneArt.js)
    look: { type: [String, Object], default: '' }
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
      return this.scene === 'naufrage' || this.scene === 'arrivee' ? 'Le naufrage de l’Hirondelle' : 'Brumelune';
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

<style scoped src="./PrologueScene.css"></style>
