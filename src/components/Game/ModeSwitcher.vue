<template>
  <nav class="modes" aria-label="Modes de jeu">
    <button
      v-for="mode in modes"
      :key="mode.id"
      type="button"
      :class="['modes__item', { 'is-on': current === mode.id }]"
      :aria-current="current === mode.id ? 'page' : null"
      @click="$emit('select', mode.id)"
    >
      <span class="g-mono modes__num">{{ mode.num }}</span>
      <span class="modes__label">{{ mode.label }}</span>
      <svg class="modes__ink" width="86" height="8" viewBox="0 0 86 8" aria-hidden="true">
        <path d="M2 5 C 18 2, 34 7, 50 4 S 76 2, 84 5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"></path>
      </svg>
    </button>
  </nav>
</template>

<script>
const MODES = [
  { id: 'infinite', num: 'I', label: 'Le Livre' },
  { id: 'timer', num: 'II', label: 'L’Épreuve' },
  { id: 'world', num: 'III', label: 'Le Monde' }
];

// Onglets des modes ; le mode actif est souligné d'un trait d'encre
export default {
  name: 'ModeSwitcher',
  props: {
    current: { type: String, default: 'infinite' }
  },
  emits: ['select'],
  data() {
    return { modes: MODES };
  }
};
</script>

<style scoped>
.modes {
  display: flex;
  justify-content: center;
  gap: 36px;
}
.modes__item {
  appearance: none;
  min-height: 44px;
  padding: 4px 0 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--oc-text-faint);
  transition: color var(--oc-fast);
}
.modes__num { font-size: 9px; letter-spacing: 0.12em; }
.modes__label {
  font-family: var(--oc-font-display);
  font-weight: 600;
  font-size: 18px;
  white-space: nowrap;
}
.modes__ink {
  color: var(--oc-gold);
  stroke-dasharray: 90;
  stroke-dashoffset: 90;
  transition: stroke-dashoffset var(--oc-slow) var(--oc-ease-out);
}
.modes__item:hover { color: var(--oc-text); }
.modes__item.is-on { color: var(--oc-text-strong); }
.is-on .modes__ink { stroke-dashoffset: 0; }

@media (max-width: 859px) {
  .modes { justify-content: space-between; gap: 8px; }
  .modes__label { font-size: 16px; }
}
</style>
