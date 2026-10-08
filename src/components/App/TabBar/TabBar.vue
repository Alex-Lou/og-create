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
        <img class="tabbar__icon" :src="tab.icon" alt="" width="28" height="28" draggable="false" />
      </span>
      <span class="tabbar__label">{{ tab.label }}</span>
      <span v-if="dots.includes(tab.id) && !locked.includes(tab.id)" class="tabbar__dot" aria-hidden="true"></span>
      <svg v-if="locked.includes(tab.id)" class="tabbar__lock" width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 11V8a5 5 0 0 1 10 0v3M5 11h14v10H5z" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" /></svg>
    </button>
  </nav>
</template>

<script>
import { libraryIcon } from '@/utils/icons';

// Les quatre lieux du jeu, toujours à portée du pouce (en bas sur mobile, rail à gauche sur PC)
// (leurs icônes : celles de la bibliothèque, design/bibliotheque/svg/interface)
const TABS = [
  { id: 'infinite', label: 'Grimoire', icon: libraryIcon('grimoire') },
  { id: 'world', label: 'Île', icon: libraryIcon('ile') },
  { id: 'timer', label: 'Défis', icon: libraryIcon('defis') },
  { id: 'sceau', label: 'Sceau', icon: libraryIcon('sceau') }
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
