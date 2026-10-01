<template>
  <aside class="brief g-panel" aria-label="Consigne de l'épreuve">
    <div class="brief__goal">
      <span class="g-mono">Consigne</span>
      <p class="brief__text">{{ question.text }}</p>
    </div>

    <transition name="brief-hint">
      <p v-if="hint" :key="hint" class="g-italic brief__hint" role="status">{{ hint }}</p>
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
import { BASE_ELEMENTS } from '@/utils/gameConstants';
import { JOKER_PRICE, JOKER_TIME, nextStep } from '@/utils/hints';

// Consigne toujours visible pendant l'Épreuve, et jokers : une étape, un ingrédient, du temps.
// Le paiement (joker offert ou écus) est fait par le parent à l'événement « joker ».
export default {
  name: 'TimerBrief',
  props: {
    question: { type: Object, required: true },
    inventory: { type: Array, default: () => [] },
    recipes: { type: Object, required: true },
    coins: { type: Number, default: 0 },
    freeJokers: { type: Number, default: 0 }
  },
  emits: ['joker'],
  data() {
    return { price: JOKER_PRICE, revealed: null };
  },
  computed: {
    canPay() {
      return this.freeJokers > 0 || this.coins >= JOKER_PRICE;
    },
    step() {
      return nextStep(this.recipes, this.inventory, this.question.validAnswers || []);
    },
    // Un indice payé reste affiché tant qu'il est utile (jusqu'à la fusion qu'il annonce)
    hint() {
      if (!this.revealed || !this.step || this.revealed.result !== this.step.result) return '';
      if (this.revealed.kind === 'step') return `Essaie ${this.step.ingredients.join(' + ')}.`;
      const parts = this.step.ingredients;
      return `Pense à ${parts.find(p => !BASE_ELEMENTS.includes(p)) || parts[0]}…`;
    },
    jokers() {
      // L'ingrédient peut être complété par l'étape entière, pas l'inverse
      const shown = this.hint ? this.revealed.kind : null;
      return [
        { kind: 'step', label: 'Une étape', short: 'Étape', title: 'Montre la prochaine fusion utile', ready: !!this.step && shown !== 'step' },
        { kind: 'ingredient', label: 'Un ingrédient', short: 'Ingrédient', title: 'Montre un des éléments à combiner', ready: !!this.step && !shown },
        { kind: 'time', label: `+${JOKER_TIME} s`, short: `+${JOKER_TIME} s`, title: `Ajoute ${JOKER_TIME} secondes au sablier`, ready: true }
      ];
    }
  },
  watch: {
    'question.text'() {
      this.revealed = null;
    }
  },
  methods: {
    use(kind) {
      if (!this.canPay) return;
      if (kind !== 'time') this.revealed = { kind, result: this.step.result };
      this.$emit('joker', kind);
    }
  }
};
</script>

<style scoped>
.brief {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  box-shadow: inset 0 0 0 1px var(--oc-accent-line);
}
.brief__goal { display: flex; flex-direction: column; gap: 4px; }
.brief__text { margin: 0; font-family: var(--oc-font-display); font-size: 21px; line-height: 1.2; color: var(--oc-gold); }
.brief__hint { margin: 0; font-size: 17px; color: var(--oc-text-strong); }
.brief__jokers { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.brief__joker { padding: 0 12px; }
.brief__price { margin-left: auto; }
.brief__short { display: none; }
.brief-hint-enter-active { transition: opacity var(--oc-medium) var(--oc-ease-out), transform var(--oc-medium) var(--oc-ease-out); }
.brief-hint-enter-from { opacity: 0; transform: translateY(4px); }

/* Mobile : bandeau compact posé juste au-dessus du dock de l'Athanor */
@media (max-width: 859px) {
  .brief {
    position: fixed;
    left: 0;
    right: 0;
    /* Posée sur le dock, à sa hauteur mesurée (repli : hauteur nominale) */
    bottom: var(--oc-dock-h, calc(var(--oc-dock-height) + env(safe-area-inset-bottom)));
    z-index: 19;
    margin: 0;
    gap: 6px;
    padding: 8px 16px;
    background: #12100c;
    box-shadow: 0 -1px 0 var(--oc-accent-line);
  }
  .brief__goal > .g-mono { display: none; }
  .brief__text { font-size: 17px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .brief__hint { font-size: 15px; }
  .brief__jokers { flex-wrap: nowrap; gap: 6px; }
  .brief__joker { min-height: 34px; padding: 0 10px; font-size: 14px; letter-spacing: 0.02em; }
  .brief__label { display: none; }
  .brief__short { display: inline; }
  .brief__price { font-size: 9px; }
}
</style>
