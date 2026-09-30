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
      <span class="modes__icon" aria-hidden="true" v-html="mode.icon"></span>
      <span>{{ mode.label }}</span>
    </button>
    <span class="modes__pill" :style="pillStyle" aria-hidden="true"></span>
  </nav>
</template>

<script>
// Icônes statiques (constantes du code, jamais de contenu utilisateur)
const MODES = [
  { id: 'infinite', label: 'Infini', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18.2 8.4c-1.8 0-3.2 1.5-6.2 3.6-3 2.1-4.4 3.6-6.2 3.6a3.6 3.6 0 0 1 0-7.2c1.8 0 3.2 1.5 6.2 3.6 3 2.1 4.4 3.6 6.2 3.6a3.6 3.6 0 0 0 0-7.2z"></path></svg>' },
  { id: 'timer', label: 'Timer', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="13" r="8"></circle><path d="M12 9v4l2.5 2.5M9 2h6"></path></svg>' },
  { id: 'explorer', label: 'Explorer', icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M15.5 8.5l-2 5-5 2 2-5z"></path></svg>' }
];

// Barre segmentée des modes ; la pastille glisse sous le mode actif
export default {
  name: 'ModeSwitcher',
  props: {
    current: { type: String, default: 'infinite' }
  },
  emits: ['select'],
  data() {
    return { modes: MODES };
  },
  computed: {
    pillStyle() {
      const index = Math.max(0, this.modes.findIndex(m => m.id === this.current));
      return { transform: `translateX(${index * 100}%)` };
    }
  }
};
</script>

<style scoped>
.modes {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 4px;
  border-radius: var(--oc-radius);
  background: var(--oc-panel);
  border: 1px solid var(--oc-line);
}
.modes__item {
  appearance: none;
  position: relative;
  z-index: 1;
  height: 40px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: var(--oc-text-muted);
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: color var(--oc-medium) var(--oc-ease-out);
}
.modes__item:hover { color: var(--oc-text); }
.modes__item.is-on { color: var(--oc-text-strong); }
.modes__icon { display: flex; }
.modes__pill {
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc((100% - 8px) / 3);
  border-radius: 12px;
  background: var(--oc-accent-soft);
  box-shadow: inset 0 0 0 1px rgba(167, 139, 250, 0.35);
  transition: transform var(--oc-medium) var(--oc-ease-spring);
}
</style>
