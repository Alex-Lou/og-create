<template>
  <nav class="tabbar" aria-label="Navigation du jeu">
    <button
      v-for="tab in TABS"
      :key="tab.id"
      type="button"
      :class="['tabbar__item', { 'is-on': current === tab.id }]"
      :aria-current="current === tab.id ? 'page' : null"
      @click="$emit('select', tab.id)"
    >
      <span class="tabbar__medal" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="tab.icon"></path></svg>
      </span>
      <span class="tabbar__label">{{ tab.label }}</span>
      <span v-if="dots.includes(tab.id)" class="tabbar__dot" aria-hidden="true"></span>
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
    dots: { type: Array, default: () => [] }
  },
  emits: ['select'],
  data() {
    return { TABS };
  }
};
</script>

<style scoped>
/* Cuir oxblood, piqûre dorée en haut */
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 25;
  height: var(--oc-tabbar-h);
  padding: 6px 8px env(safe-area-inset-bottom);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: start;
  border-radius: var(--r-lg) var(--r-lg) 0 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(0, 0, 0, 0) 35%),
    radial-gradient(140% 120% at 50% 0%, var(--leather-500) 0%, var(--leather-700) 70%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 -6px 18px rgba(52, 36, 26, 0.22);
}
.tabbar::before {
  content: '';
  position: absolute;
  left: 14px;
  right: 14px;
  top: 5px;
  border-top: 1.5px dashed rgba(239, 193, 99, 0.45);
  pointer-events: none;
}
.tabbar__item {
  appearance: none;
  position: relative;
  min-height: 56px;
  padding: 6px 0 0;
  border: 0;
  background: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  color: rgba(251, 235, 192, 0.72);
  -webkit-tap-highlight-color: transparent;
  transition: color var(--oc-fast);
}
.tabbar__medal {
  width: 40px;
  height: 34px;
  display: grid;
  place-items: center;
  border-radius: var(--r-pill);
  transition: transform var(--oc-medium) var(--oc-ease-spring), background var(--oc-fast), box-shadow var(--oc-fast), color var(--oc-fast);
}
.tabbar__label { font-family: var(--oc-font-body); font-weight: 800; font-size: 11px; letter-spacing: 0.03em; }
.tabbar__item:hover { color: var(--gold-200); }
.tabbar__item:active .tabbar__medal { transform: scale(0.92); }
/* Onglet actif : médaille d'or surélevée */
.tabbar__item.is-on { color: var(--gold-200); }
.tabbar__item.is-on .tabbar__medal {
  width: 52px;
  height: 52px;
  margin-top: -20px;
  border-radius: 50%;
  color: var(--ink-900);
  background: radial-gradient(circle at 35% 30%, var(--gold-200) 0 15%, var(--gold-400) 45%, var(--gold-600) 100%);
  box-shadow: 0 0 0 3px var(--leather-600), 0 0 0 4px rgba(239, 193, 99, 0.6), 0 4px 10px rgba(0, 0, 0, 0.35);
}
.tabbar__dot {
  position: absolute;
  top: 6px;
  left: calc(50% + 10px);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--gold-400);
  box-shadow: 0 0 0 2px var(--leather-600);
}

/* PC : rail vertical à gauche */
@media (min-width: 860px) {
  .tabbar {
    right: auto;
    top: 0;
    width: var(--oc-rail-w);
    height: auto;
    padding: 96px 0 24px;
    grid-template-columns: none;
    grid-auto-rows: max-content;
    gap: 18px;
    border-radius: 0;
    background:
      linear-gradient(90deg, rgba(255, 255, 255, 0.06), rgba(0, 0, 0, 0) 40%),
      radial-gradient(160% 120% at 0% 30%, var(--leather-500) 0%, var(--leather-700) 70%);
    box-shadow: inset -1px 0 0 rgba(255, 255, 255, 0.1), 6px 0 18px rgba(52, 36, 26, 0.18);
  }
  .tabbar::before { left: auto; right: 6px; top: 14px; bottom: 14px; border-top: 0; border-right: 1.5px dashed rgba(239, 193, 99, 0.4); }
  .tabbar__item.is-on .tabbar__medal { margin-top: 0; }
  .tabbar__dot { top: 0; }
}
</style>
