<template>
  <!-- Une scène du tutoriel (texts/tutorial/scenes.js), plein écran : un toucher avance d'une image ; une image à geste
       ciblé (gesture) n'avance que par lui ; « Passer » termine seulement la scène, jamais la progression obligatoire (en
       revoir les scènes depuis le Sceau n'a pas ce bouton) -->
  <div ref="root" class="ps" role="dialog" aria-modal="true" :aria-label="label" tabindex="-1" @click="tap" @keydown.enter.prevent="advance" @keydown.space.prevent="advance">
    <transition name="ps-art" appear appear-active-class="ps-art-appear" appear-from-class="ps-art-from">
      <SceneArt v-if="frame.scene" :key="`${frame.scene}${frame.alone ? '-seul' : ''}${frame.still ? '-fixe' : ''}`" :scene="frame.scene" :look="look" :alone="frame.alone" :pose="frame.avatar || null" :still="frame.still" :meteo="frame.meteo || null" :beat="beat" />
      <PrologueArt v-else :key="frame.art" :art="frame.art" :cast="frame.cast || []" :recipe="frame.recipe || ''" :built="built" />
    </transition>
    <transition name="ps-caption" appear>
      <p v-if="frame.caption" class="ps__caption">{{ frame.caption }}</p>
    </transition>
    <transition name="ps-bubble" mode="out-in" appear appear-active-class="ps-bubble-appear" appear-from-class="ps-bubble-from">
      <div v-if="frame.text" :key="k" :class="['ps__bubble', `is-${speaker.family}`, { 'is-thought': frame.thought, 'has-face': face || wisp }]" :style="speakerStyle">
        <img v-if="face" :class="['ps__face', { 'is-bust': face.bust }]" :src="face.face" alt="" aria-hidden="true" />
        <BrumeWisp v-else-if="wisp" class="ps__face ps__face--wisp" :size="40" />
        <svg v-if="frame.who && speaker.motif" class="ps__motif" viewBox="0 0 24 24" aria-hidden="true"><path :d="speaker.motif" /></svg>
        <span v-if="frame.who && speaker.name" class="ps__who">{{ speaker.name }}</span>
        <p class="ps__text">{{ text }}</p>
        <div v-if="frame.choices" class="ps__choices">
          <button v-for="choice in frame.choices" :key="choice" type="button" class="ps__choice" @click.stop="advance">{{ choice }}</button>
        </div>
        <span v-else-if="!frame.gesture" class="ps__hint">{{ frame.hint || TOUCH_TO_GO_ON }}</span>
      </div>
    </transition>
    <button v-if="frame.gesture" :key="`geste-${k}`" type="button" class="ps__gesture" :style="gestureStyle" @click.stop="advance">{{ frame.gesture.label }}</button>
    <span v-else-if="!frame.text" class="ps__hint ps__hint--alone">{{ TOUCH_TO_GO_ON }}</span>
    <button v-if="skippable && skipShown" type="button" class="ps__skip" @click.stop="$emit('skip')">{{ skipLabel }}</button>
  </div>
</template>

<script>
import PrologueArt from '../PrologueArt/PrologueArt.vue';
import SceneArt from '../SceneArt/SceneArt.vue';
import { SCENES } from '@/texts/tutorial/scenes';
import BrumeWisp from '@/components/Guide/BrumeWisp/BrumeWisp.vue';
import { speakerOf } from '@/game/speakers';
import { player, accord } from '@/game/accord';
import { lineFace } from '@/world/faces';
import { reducedMotion } from '@/utils/fx';
import { TOUCH_TO_GO_ON } from '@/texts/ui/common';

export default {
  name: 'PrologueScene',
  components: { PrologueArt, SceneArt, BrumeWisp },
  props: {
    scene: { type: String, required: true },
    // Images données directement (une veillée, game/vigils.js) ; sinon celles de la scène (texts/tutorial/scenes.js)
    frames: { type: Array, default: null },
    // Revoir le prologue (le Sceau) : pas de « Passer »
    skippable: { type: Boolean, default: true },
    skipLabel: { type: String, default: 'Passer le prologue' },
    // « Passer » n'apparaît qu'après ce délai (ms) : la première scène accroche d'abord (choix de l'auteur, 8 oct.)
    skipDelay: { type: Number, default: 0 },
    // Les maîtres dont le bâtiment est fondé (PrologueArt : les autres paraissent en naufragés aux veillées)
    built: { type: Array, default: () => [] },
    // L'avatar du joueur dans les scènes de la bibliothèque (game/sceneArt.js)
    look: { type: [String, Object], default: '' }
  },
  emits: ['done', 'skip'],
  data() {
    return { TOUCH_TO_GO_ON, k: 0, skipShown: this.skipDelay <= 0 };
  },
  computed: {
    list() {
      return this.frames || SCENES[this.scene] || [];
    },
    frame() {
      return this.list[this.k] || {};
    },
    // Le rang de la bulle dans sa scène (les bulles d'affilée sur la même image) : une scène en plans y joue son temps
    beat() {
      let i = this.k;
      while (i > 0 && this.list[i - 1].scene === this.frame.scene) i--;
      return this.k - i;
    },
    // Qui parle (game/speakers.js) : sa couleur, son motif ; une pensée garde son habit. Le joueur (who : 'joueur')
    // parle sous son nom (game/accord.js), sans couleur
    speaker() {
      const who = this.frame.who === 'joueur' ? player.name : this.frame.who;
      return speakerOf(who, { stranger: this.frame.stranger, hostile: this.frame.hostile });
    },
    // Le texte, accordé au genre du joueur (« arrivé|arrivée » : game/accord.js)
    text() {
      return accord(this.frame.text);
    },
    // Le geste ciblé, là où il faut toucher sur l'image (x, y : en % de l'écran)
    gestureStyle() {
      const { x = 50, y = 60 } = this.frame.gesture || {};
      return { left: `${x}%`, top: `${y}%` };
    },
    speakerStyle() {
      const { color, tint } = this.speaker;
      return color && this.frame.who && !this.frame.thought ? { '--speaker': color, '--speaker-tint': tint } : null;
    },
    // Son portrait au bord de la bulle, celui des bulles de l'île (world/faces.js : lineFace)
    face() {
      return lineFace(this.frame, this.built);
    },
    // Brume parle avec sa flamme
    wisp() {
      return this.frame.who === 'Brume' && !this.frame.thought && !this.frame.face;
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
    if (!this.skipShown) this.skipTimer = setTimeout(() => { this.skipShown = true; }, this.skipDelay);
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    clearTimeout(this.skipTimer);
  },
  methods: {
    // Une image qui avance seule (la tempête) ; avec le mouvement réduit, elle attend un toucher
    arm() {
      clearTimeout(this.timer);
      if (this.frame.auto && !reducedMotion()) this.timer = setTimeout(() => this.advance(), this.frame.auto);
    },
    // Un toucher sur l'image : il avance, sauf quand un geste ciblé l'attend
    tap() {
      if (!this.frame.gesture) this.advance();
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
