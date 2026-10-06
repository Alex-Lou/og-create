<template>
  <aside class="brief g-panel" aria-label="Consigne de l'épreuve">
    <div class="brief__goal">
      <span class="g-mono">Consigne</span>
      <p class="brief__text">{{ frenchSpaces(question.text) }}</p>
    </div>

    <transition name="brief-hint">
      <p v-if="hint" :key="hint.text" class="g-italic brief__hint" role="status">{{ hint.text }}</p>
    </transition>

    <div class="brief__jokers" role="group" aria-label="Jokers">
      <button
        v-for="joker in jokers"
        :key="joker.kind"
        type="button"
        class="g-btn g-btn--ghost g-btn--small brief__joker"
        :disabled="!canPay || !joker.ready"
        :title="joker.title"
        :aria-label="joker.label"
        @click="use(joker.kind)"
      >
        <span class="brief__label">{{ joker.label }}</span><span class="brief__short">{{ joker.short }}</span>
      </button>
      <span class="g-mono brief__price">{{ freeJokers ? `${freeJokers} offert${freeJokers > 1 ? 's' : ''}` : `${price} écus` }}</span>
    </div>
  </aside>
</template>

<script>
import { frenchSpaces } from '@/utils/typo';
import { JOKER_PRICE, JOKER_TIME } from '@/utils/hints';

// Consigne toujours visible pendant l'Épreuve, et jokers : une étape, un ingrédient, du temps.
// Le serveur calcule l'indice et le paie ; le parent le reçoit à l'événement « joker » et le renvoie en `hint`.
export default {
  name: 'TimerBrief',
  props: {
    question: { type: Object, required: true },
    // Indice affiché ({ kind, text }), effacé par le parent à la découverte suivante
    hint: { type: Object, default: null },
    coins: { type: Number, default: 0 },
    freeJokers: { type: Number, default: 0 }
  },
  emits: ['joker'],
  data() {
    return { price: JOKER_PRICE };
  },
  computed: {
    canPay() {
      return this.freeJokers > 0 || this.coins >= JOKER_PRICE;
    },
    jokers() {
      // L'ingrédient peut être complété par l'étape entière, pas l'inverse
      const shown = this.hint?.kind || null;
      return [
        { kind: 'step', label: 'Une étape', short: 'Étape', title: 'Montre la prochaine fusion utile', ready: shown !== 'step' },
        { kind: 'ingredient', label: 'Un ingrédient', short: 'Ingrédient', title: 'Montre un des éléments à combiner', ready: !shown },
        { kind: 'time', label: `+${JOKER_TIME} s`, short: `+${JOKER_TIME} s`, title: `Ajoute ${JOKER_TIME} secondes au sablier`, ready: true }
      ];
    }
  },
  methods: {
    frenchSpaces,
    use(kind) {
      if (this.canPay) this.$emit('joker', kind);
    }
  }
};
</script>

<style scoped src="./TimerBrief.css"></style>
