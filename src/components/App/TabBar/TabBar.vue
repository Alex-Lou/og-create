<template>
  <nav class="tabbar" aria-label="Navigation du jeu">
    <button
      v-for="tab in TABS"
      :key="tab.id"
      type="button"
      :class="['tabbar__item', { 'is-on': current === tab.id, 'is-locked': locked.includes(tab.id), 'is-new': fresh.includes(tab.id) }]"
      :data-tab="tab.id"
      :aria-current="current === tab.id ? 'page' : null"
      :disabled="locked.includes(tab.id)"
      :aria-label="locked.includes(tab.id) ? `${tab.label} (s’ouvre pendant le tutoriel)` : null"
      @click="$emit('select', tab.id)"
    >
      <span class="tabbar__medal" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="tab.icon"></path></svg>
      </span>
      <span class="tabbar__label">{{ tab.label }}</span>
      <span v-if="dots.includes(tab.id) && !locked.includes(tab.id)" class="tabbar__dot" aria-hidden="true"></span>
      <svg v-if="locked.includes(tab.id)" class="tabbar__lock" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" /></svg>
    </button>
  </nav>
</template>

<script>
// Les quatre lieux du jeu, toujours à portée du pouce (en bas sur mobile, rail à gauche sur PC)
const TABS = [
  { id: 'infinite', label: 'Grimoire', icon: 'M3 5.5C6 4 9 4 12 6v13c-3-2-6-2-9-.5zM21 5.5C18 4 15 4 12 6v13c3-2 6-2 9-.5z' },
  { id: 'world', label: 'Île', icon: 'M2 19c3-2 7-2 10 0s7 2 10 0M12 17V9M12 9c-2-3-5-3-7-1M12 9c2-3 5-3 7-1M12 9c-1-3-3-4-5-4M12 9c1-3 3-4 5-4' },
  { id: 'timer', label: 'Défis', icon: 'M6 3h12M6 21h12M7 3c0 5 10 6 10 9s-10 4-10 9M17 3c0 5-10 6-10 9s10 4 10 9' },
  { id: 'sceau', label: 'Sceau', icon: 'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18zM12 8v8M8 12h8M9.2 9.2l5.6 5.6M14.8 9.2l-5.6 5.6' }
];

export default {
  name: 'TabBar',
  props: {
    current: { type: String, default: 'infinite' },
    // Onglets qui portent un point (une chose à faire là-bas)
    dots: { type: Array, default: () => [] },
    // Onglets encore fermés (le tutoriel les ouvre un à un) : grisés, un cadenas, ils ne s'ouvrent pas
    locked: { type: Array, default: () => [] }
  },
  emits: ['select'],
  data() {
    // fresh : les onglets tout juste ouverts (un éclat doré quelques secondes)
    return { TABS, fresh: [] };
  },
  watch: {
    locked(now, before) {
      const opened = (before || []).filter(id => !now.includes(id));
      if (!opened.length) return;
      this.fresh = [...this.fresh, ...opened];
      clearTimeout(this.freshTimer);
      this.freshTimer = setTimeout(() => { this.fresh = []; }, 4000);
    }
  },
  beforeUnmount() {
    clearTimeout(this.freshTimer);
  }
};
</script>

<style scoped src="./TabBar.css"></style>
