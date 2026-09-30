<template>
  <header class="app-header">
    <div class="app-header__brand">
      <h1 class="app-header__title">Origins</h1>
      <p class="app-header__meta">
        <span>{{ found }} / {{ total }} découverts</span>
        <span aria-hidden="true"> · </span>
        <span :key="eraName" class="app-header__era">Ère {{ era }} · {{ eraName }}</span>
      </p>
    </div>

    <div class="app-header__actions">
      <slot name="timer"></slot>
      <div class="coins" :title="`${coins} pièces`">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v10M9.5 9.5h4a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3h4"></path></svg>
        <span :key="coins" class="coins__value">{{ formattedCoins }}</span>
        <span class="oc-sr-only">pièces</span>
      </div>
      <slot name="actions"></slot>
    </div>

    <div class="app-header__modes">
      <slot name="modes"></slot>
    </div>
  </header>
</template>

<script>
// En-tête : titre, progression (découvertes, ère), pièces ; modes et compte passés en slots
export default {
  name: 'AppHeader',
  props: {
    found: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    era: { type: Number, default: 1 },
    eraName: { type: String, default: '' },
    coins: { type: Number, default: 0 }
  },
  computed: {
    formattedCoins() {
      return new Intl.NumberFormat('fr-FR').format(this.coins);
    }
  }
};
</script>

<style scoped>
.app-header {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas: "brand actions" "modes modes";
  align-items: center;
  gap: 12px 16px;
  padding: 18px 0 8px;
}
.app-header__brand { grid-area: brand; min-width: 0; }
.app-header__title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-size: 26px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--oc-text-strong);
}
.app-header__meta {
  margin: 2px 0 0;
  font-size: 12px;
  color: var(--oc-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* Nouvelle ère : le libellé s'illumine */
.app-header__era { animation: era-glow 2.4s var(--oc-ease-out); }
.app-header__actions {
  grid-area: actions;
  display: flex;
  align-items: center;
  gap: 8px;
}
.app-header__modes { grid-area: modes; }

.coins {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 12px;
  border-radius: var(--oc-radius-pill);
  background: var(--oc-gold-soft);
  border: 1px solid rgba(250, 204, 21, 0.3);
  color: var(--oc-gold);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.coins__value { animation: coin-bump 0.5s var(--oc-ease-spring); }

@keyframes era-glow {
  0% { color: var(--oc-gold); text-shadow: 0 0 12px rgba(250, 204, 21, 0.8); }
  100% { color: inherit; text-shadow: none; }
}
@keyframes coin-bump {
  0% { transform: scale(1); }
  40% { transform: scale(1.25); color: #fff; }
  100% { transform: scale(1); }
}

/* PC : modes au centre de la ligne */
@media (min-width: 860px) {
  .app-header {
    grid-template-columns: minmax(0, 1fr) minmax(340px, 420px) minmax(0, 1fr);
    grid-template-areas: "brand modes actions";
  }
  .app-header__actions { justify-content: flex-end; }
}
</style>
