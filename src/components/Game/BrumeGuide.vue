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
        <img v-if="entry.face" class="guide__face" :src="entry.face" alt="" />
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
import BrumeWisp from '@/components/ui/BrumeWisp.vue';
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
      const { mode } = this.entry.action;
      guide.dismiss();
      this.$emit('go', mode);
    }
  }
};
</script>

<style scoped>
.guide {
  position: fixed; z-index: var(--z-guide);
  left: 12px; right: 12px; bottom: calc(var(--oc-tabbar-h) + 12px + env(safe-area-inset-bottom));
  max-width: 440px;
  display: flex; align-items: flex-end; gap: 10px;
  pointer-events: none;
}
/* En haut de l'écran : la réplique laisse voir le bas (le tutoriel y montre un élément du doigt) */
.guide.is-top { top: calc(env(safe-area-inset-top) + 10px); bottom: auto; }
/* Un autre que Brume parle (le tutoriel) : son portrait à la place du feu follet */
.guide__face { width: 48px; height: 67px; filter: drop-shadow(0 3px 6px rgba(0, 0, 0, .3)); }
.guide__spirit { position: relative; flex: none; width: 56px; height: 64px; display: grid; place-items: end center; pointer-events: auto; }
.guide__wisp { filter: drop-shadow(0 4px 10px rgba(92, 200, 240, .45)); animation: guide-float 3.2s ease-in-out infinite; }
.guide__bubble {
  position: relative; pointer-events: auto;
  padding: 10px 14px 10px; border-radius: 18px 18px 18px 6px;
  background: var(--vellum-50); color: var(--ink-900);
  box-shadow: 0 10px 28px rgba(40, 28, 18, .28), inset 0 0 0 1px var(--oc-line);
}
.guide__name { display: block; font-family: var(--oc-font-mono); font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #3E9BC4; }
.guide__text { margin: 4px 0 8px; font-family: var(--oc-font-display); font-style: italic; font-size: 16px; line-height: 1.4; }
.guide__actions { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.guide__btn {
  appearance: none; border: 0; cursor: pointer; min-height: 36px; padding: 6px 16px; border-radius: var(--r-pill);
  background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 14px;
  touch-action: manipulation;
}
.guide__btn--quiet { background: transparent; color: var(--oc-gold-ink); box-shadow: inset 0 0 0 1.5px currentColor; }
.guide__btn:focus-visible { outline: 3px solid var(--oc-gold); outline-offset: 2px; }

/* Naissance : les volutes se resserrent sur Brume, qui prend forme dans un flou, puis la bulle paraît */
.guide__mist {
  position: absolute; left: 50%; bottom: 12px; width: 64px; height: 42px; margin-left: -32px; border-radius: var(--r-round);
  background: radial-gradient(closest-side, rgba(232, 242, 250, .98), rgba(206, 228, 244, .5) 60%, rgba(206, 228, 244, 0));
  animation: guide-mist 1.6s cubic-bezier(.45, 0, .25, 1) var(--d) both;
}
/* Éclat quand la flamme naît */
.guide.is-birth .guide__spirit::after {
  content: ''; position: absolute; left: 50%; bottom: 18px; width: 60px; height: 60px; margin-left: -30px; border-radius: var(--r-round);
  background: radial-gradient(closest-side, rgba(170, 230, 255, .9), rgba(170, 230, 255, 0));
  animation: guide-bloom .9s ease-out 1.05s both; pointer-events: none;
}
.guide.is-birth .guide__wisp { animation: guide-born 1.3s cubic-bezier(.3, 1.3, .5, 1) .9s both, guide-float 3.2s ease-in-out 2.2s infinite; }
.guide.is-birth .guide__bubble { animation: guide-bubble .4s ease-out 2.1s both; }
@keyframes guide-mist {
  0% { opacity: 0; transform: rotate(var(--a)) translateX(86px) scale(1.5); }
  20% { opacity: .95; }
  100% { opacity: 0; transform: rotate(calc(var(--a) + 170deg)) translateX(0) scale(.2); }
}
@keyframes guide-bloom { 0% { opacity: 0; transform: scale(.2); } 30% { opacity: 1; } 100% { opacity: 0; transform: scale(2.4); } }
@keyframes guide-born {
  0% { opacity: 0; transform: scale(.2); filter: blur(8px); }
  60% { opacity: 1; filter: blur(1px); }
  100% { opacity: 1; transform: scale(1); filter: drop-shadow(0 4px 10px rgba(92, 200, 240, .45)); }
}
@keyframes guide-bubble { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes guide-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

.guide-enter-active, .guide-leave-active { transition: opacity .25s ease, transform .25s ease; }
.guide-enter-from, .guide-leave-to { opacity: 0; transform: translateY(10px); }

@media (min-width: 860px) {
  .guide { left: calc(var(--oc-rail-w) + 16px); right: auto; bottom: 20px; }
}
@media (prefers-reduced-motion: reduce) {
  .guide__wisp, .guide.is-birth .guide__wisp, .guide.is-birth .guide__bubble { animation: none; }
  .guide__mist, .guide.is-birth .guide__spirit::after { display: none; }
}
</style>
