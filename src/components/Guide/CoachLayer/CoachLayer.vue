<template>
  <!-- Le coach du tutoriel (game/coach.js) : l'écran s'assombrit sauf la cible, une main la montre, une bulle dit
       pourquoi. Geste forcé (block) : le reste de l'écran ne répond pas, seule la cible se touche ; sinon rien n'est
       bloqué. Rien ne se montre tant que la cible est absente ou recouverte (une fiche, une scène, une bulle).
       Une leçon en plusieurs gestes (toucher Cannelle, « Sa fiche », puis le bouton de sa fiche) : le coach montre le
       plus avancé qui est à l'écran, par-dessus la fiche s'il est dedans ; chaque geste est forcé la première fois -->
  <div v-if="hole" :class="['coach', { 'is-block': blocked }]" :style="high ? { zIndex: 'calc(var(--z-modal) + 5)' } : null" aria-live="polite">
    <svg class="coach__mask" :width="view.w" :height="view.h" aria-hidden="true">
      <defs>
        <mask :id="maskId">
          <rect x="0" y="0" :width="view.w" :height="view.h" fill="#fff" />
          <rect :x="hole.x" :y="hole.y" :width="hole.w" :height="hole.h" :rx="radius" fill="#000" />
        </mask>
      </defs>
      <rect x="0" y="0" :width="view.w" :height="view.h" :class="['coach__dim', { 'is-soft': !blocked }]" :mask="`url(#${maskId})`" />
      <rect :x="hole.x" :y="hole.y" :width="hole.w" :height="hole.h" :rx="radius" class="coach__edge" />
    </svg>
    <!-- Geste forcé : quatre volets autour de la cible arrêtent les autres touchers (ils font sursauter la main) -->
    <template v-if="blocked">
      <div class="coach__wall" :style="wall(0, 0, view.w, hole.y)" @pointerdown.stop.prevent="nudge"></div>
      <div class="coach__wall" :style="wall(0, hole.y + hole.h, view.w, view.h - hole.y - hole.h)" @pointerdown.stop.prevent="nudge"></div>
      <div class="coach__wall" :style="wall(0, hole.y, hole.x, hole.h)" @pointerdown.stop.prevent="nudge"></div>
      <div class="coach__wall" :style="wall(hole.x + hole.w, hole.y, view.w - hole.x - hole.w, hole.h)" @pointerdown.stop.prevent="nudge"></div>
    </template>
    <div :class="['coach__hand', { 'is-nudged': nudged }]" :style="{ left: `${hole.x + hole.w / 2}px`, top: `${hole.y + hole.h / 2}px` }" aria-hidden="true">
      <span class="coach__ring"></span>
      <svg class="coach__finger" viewBox="0 0 32 40">
        <path d="M12 4c0-2 3.6-2 3.6 0v14l1-1c0-2 3.4-2 3.4 0v2l.8-.6c0-2 3.4-2 3.4 0v2l.6-.4c0-2 3.2-2 3.2 .2V30c0 5-4 8-9 8h-2c-3.4 0-5.2-1.4-7-4L4 25c-1.2-1.8 1.2-3.8 2.8-2.2L12 27V4z" fill="#FFF8E8" stroke="#3E2A1E" stroke-width="1.6" stroke-linejoin="round" />
      </svg>
    </div>
    <transition name="coach-say" appear>
      <p v-if="step.text" :key="stepId" class="coach__say" :style="sayStyle" role="status">
        <img v-if="lesson.face" :src="lesson.face" alt="" class="coach__face" />
        <span class="coach__text"><strong v-if="lesson.who" class="coach__who">{{ lesson.who }}</strong>{{ step.text }}</span>
      </p>
    </transition>
  </div>
</template>

<script>
import { coach } from '@/game/coach';
import { reducedMotion, vibrate } from '@/utils/fx';

// Marge autour de la cible (px), hauteur de la bulle (pour la placer au-dessus ou au-dessous)
const PAD = 8;
const SAY_H = 96;
let count = 0;

export default {
  name: 'CoachLayer',
  props: {
    // La leçon (game/coach.js : state.lesson)
    lesson: { type: Object, required: true }
  },
  data() {
    count += 1;
    return { hole: null, view: { w: 0, h: 0 }, nudged: false, maskId: `coach-mask-${count}`, at: 0, high: false };
  },
  computed: {
    // Le geste montré (lesson.steps[at]) et son identifiant ; forcé tant qu'il n'a jamais été fait
    step() {
      return this.lesson.steps[this.at] || this.lesson.steps[0];
    },
    stepId() {
      return coach.stepId(this.lesson, this.at);
    },
    blocked() {
      return coach.blocks(this.stepId);
    },
    radius() {
      return Math.min(18, this.hole ? Math.min(this.hole.w, this.hole.h) / 2 : 0);
    },
    // La bulle au-dessus de la cible si elle est en bas de l'écran, sinon au-dessous
    sayStyle() {
      const h = this.hole;
      const below = h.y + h.h + PAD + SAY_H < this.view.h - 70;
      return below ? { top: `${h.y + h.h + 14}px` } : { top: `${Math.max(12, h.y - SAY_H - 14)}px` };
    }
  },
  watch: {
    'lesson.id'() {
      this.hole = null;
      this.at = 0;
    }
  },
  mounted() {
    // Le toucher sur la cible elle-même : le geste est fait (il passe à la cible, rien n'est retenu)
    this.onDown = event => {
      const h = this.hole;
      if (h && event.clientX >= h.x && event.clientX <= h.x + h.w && event.clientY >= h.y && event.clientY <= h.y + h.h) coach.done(this.stepId);
    };
    window.addEventListener('pointerdown', this.onDown, true);
    const follow = () => {
      this.view = { w: window.innerWidth, h: window.innerHeight };
      // Le geste le plus avancé dont la cible est à l'écran, rien ne la recouvrant
      const { steps } = this.lesson;
      let r = null;
      let at = steps.length - 1;
      for (; at >= 0; at--) {
        r = coach.rectOf(steps[at].target);
        if (r && this.visible(r)) break;
        r = null;
      }
      if (r && at !== this.at) this.hole = null;
      if (r) this.at = at;
      // Dans une fiche ou une fenêtre : le coach passe par-dessus
      this.high = Boolean(r && r.el && r.el.closest && r.el.closest('.g-modal-backdrop, .world__sheet-backdrop'));
      const next = r ? { x: r.x - PAD, y: r.y - PAD, w: r.w + 2 * PAD, h: r.h + 2 * PAD } : null;
      // (la découpe glisse vers sa cible, sauf en mouvement réduit)
      if (!next || !this.hole || reducedMotion()) this.hole = next;
      else {
        const k = 0.3;
        const step = key => this.hole[key] + (next[key] - this.hole[key]) * k;
        const moved = ['x', 'y', 'w', 'h'].some(key => Math.abs(next[key] - this.hole[key]) > 0.5);
        if (moved) this.hole = { x: step('x'), y: step('y'), w: step('w'), h: step('h') };
      }
      this.raf = requestAnimationFrame(follow);
    };
    follow();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('pointerdown', this.onDown, true);
    clearTimeout(this.nudgeTimer);
  },
  methods: {
    // La cible est à l'écran et rien ne la recouvre (une fiche, une scène, une bulle de Brume : le coach attend)
    visible(r) {
      const cx = r.x + r.w / 2;
      const cy = r.y + r.h / 2;
      if (r.w <= 0 || cx < 0 || cy < 0 || cx > window.innerWidth || cy > window.innerHeight) return false;
      const top = document.elementsFromPoint(cx, cy).find(el => !this.$el || !this.$el.contains || !this.$el.contains(el));
      return Boolean(top && r.el && (r.el === top || r.el.contains(top)));
    },
    wall(x, y, w, h) {
      return { left: `${x}px`, top: `${y}px`, width: `${Math.max(0, w)}px`, height: `${Math.max(0, h)}px` };
    },
    // Un toucher ailleurs pendant un geste forcé : la main sursaute vers la cible
    nudge() {
      vibrate(6);
      this.nudged = false;
      clearTimeout(this.nudgeTimer);
      this.$nextTick(() => {
        this.nudged = true;
        this.nudgeTimer = setTimeout(() => { this.nudged = false; }, 500);
      });
    }
  }
};
</script>

<style scoped src="./CoachLayer.css"></style>
