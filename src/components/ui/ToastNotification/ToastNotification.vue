<template>
  <button
    ref="billet"
    type="button"
    :class="['toast', `toast--${type}`, { 'is-dragged': Boolean(drag) }]"
    :style="drag ? { '--toast-drag': `${drag}px` } : null"
    @click="onClick"
    @pointerdown="down"
    @pointermove="move"
    @pointerup="up"
    @pointercancel="up"
  >
    <span class="toast__seal" aria-hidden="true">
      <ElementGlyph v-if="medal" :glyph="medal" />
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round">
        <path v-if="type === 'success'" d="M5 12.5l4.5 4.5L19 7.5" />
        <path v-else d="M12 6v7.5M12 18.2v.1" />
      </svg>
    </span>
    <span class="toast__body">
      <span class="toast__said">{{ said }}</span>
      <span v-if="gains.length" class="toast__gains">
        <span v-for="(g, i) in gains" :key="g.glyph || i" class="toast__gain">{{ shownText(i) }}<ElementGlyph v-if="gains.length > 1 && g.glyph" :glyph="g.glyph" /></span>
      </span>
      <span v-if="message" class="toast__message">{{ message }}</span>
      <span class="toast__said">{{ CLOSE }}</span>
    </span>
  </button>
</template>

<script>
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import { reducedMotion } from '@/utils/fx';
import { TOAST_CLOSE } from '@/texts/ui/common';

// Ce que dit chaque ton aux lecteurs d'écran (le ruban et le sceau le disent aux yeux)
const SAID = {
  info: 'Info :',
  success: 'Réussi :',
  warning: 'Attention :',
  error: 'Oups :',
  gain: 'Gagné :'
};
// Le sceau de chaque ton : une icône du jeu (utils/icons.js), sinon un trait dessiné (coche, point d'exclamation)
const MEDAL = { info: 'ui:spark', gain: 'ui:basket' };
// Les « +N » comptent jusqu'à leur valeur (ms) ; un glissé de plus de FLING px renvoie le billet
const COUNT_MS = 300;
const FLING = 60;

// Une notification (choix de l'auteur, 13 oct.) : un billet de vélin dessiné (design/bibliotheque/svg/hud/billet.svg),
// le ruban de son ton sur le bord gauche, un sceau de cire, ce qu'on gagne puis le message. Il tombe et se pose ; ses
// « +N » comptent ; un même gain qui revient (stamp) les fait monter et rebondir, et il reste le temps d'être lu. Un
// toucher ou un glissé le renvoie.
export default {
  name: 'ToastNotification',
  components: { ElementGlyph },
  props: {
    message: { type: String, default: '' },
    duration: { type: Number, default: 3000 },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error', 'gain'].includes(value)
    },
    // Ce qu'on gagne : [{ glyph, text }] (« +40 » et l'écu) ; mis en avant, en or, avant le message
    gains: { type: Array, default: () => [] },
    // Le même message est revenu (services/notificationService.js) : il compte de nouveau
    stamp: { type: Number, default: 0 }
  },
  emits: ['close'],
  data() {
    return { CLOSE: TOAST_CLOSE, counts: [], drag: 0, from: null, moved: false, closed: false };
  },
  computed: {
    said() {
      return SAID[this.type] || SAID.info;
    },
    // Un seul gain : son icône dans le sceau (l'écu) ; plusieurs : le panier, et chaque icône à côté de son nombre
    medal() {
      if (this.type === 'gain' && this.gains.length === 1 && this.gains[0].glyph) return this.gains[0].glyph;
      return MEDAL[this.type] || null;
    }
  },
  watch: {
    stamp() {
      this.count();
      this.wait();
      // (le billet rebondit, son sceau frappe de nouveau)
      const el = this.$refs.billet;
      if (!el || reducedMotion()) return;
      el.classList.remove('is-bumped');
      void el.offsetWidth;
      el.classList.add('is-bumped');
    }
  },
  mounted() {
    this.count();
    this.wait();
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
    cancelAnimationFrame(this.raf);
  },
  methods: {
    // Le nombre d'un gain, tel qu'il compte (« +N » : son texte, une fois arrivé)
    shownText(i) {
      const n = this.counts[i];
      return n === undefined ? this.gains[i].text : `+${n}`;
    },
    // Les « +N » comptent de là où ils en sont jusqu'à leur valeur (tout de suite en mouvement réduit)
    count() {
      cancelAnimationFrame(this.raf);
      const goal = this.gains.map(g => parseInt(g.text, 10));
      if (reducedMotion() || goal.some(n => !Number.isFinite(n))) {
        this.counts = [];
        return;
      }
      const start = goal.map((n, i) => this.counts[i] || 0);
      const t0 = performance.now();
      const step = () => {
        const k = Math.min(1, (performance.now() - t0) / COUNT_MS);
        const e = 1 - (1 - k) ** 3;
        this.counts = goal.map((n, i) => Math.round(start[i] + (n - start[i]) * e));
        if (k < 1) this.raf = requestAnimationFrame(step);
      };
      this.raf = requestAnimationFrame(step);
    },
    // Il reste duration ms à l'écran (à compter de maintenant)
    wait() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.close, this.duration);
    },
    close() {
      if (this.closed) return;
      this.closed = true;
      clearTimeout(this.timeout);
      this.$emit('close');
    },
    // Un toucher le renvoie, sauf à la fin d'un glissé (qui décide seul)
    onClick() {
      if (this.moved) this.moved = false;
      else this.close();
    },
    down(e) {
      this.from = e.clientX;
      this.moved = false;
    },
    move(e) {
      if (this.from === null) return;
      const dx = e.clientX - this.from;
      if (!this.moved && Math.abs(dx) < 6) return;
      if (!this.moved) e.currentTarget.setPointerCapture?.(e.pointerId);
      this.moved = true;
      this.drag = dx;
    },
    // Lâché loin : il part de ce côté ; sinon il revient à sa place
    up() {
      if (this.from === null) return;
      this.from = null;
      if (Math.abs(this.drag) > FLING) this.close();
      else this.drag = 0;
    }
  }
};
</script>

<style scoped src="./ToastNotification.css"></style>

<style src="./ToastNotification.global.css"></style>
