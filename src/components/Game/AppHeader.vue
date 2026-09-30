<template>
  <header class="app-header">
    <div class="app-header__brand">
      <h1 class="app-header__title">Origins</h1>
      <p class="g-mono app-header__meta">
        <span :key="eraLabel" class="app-header__era">{{ eraLabel }}</span>
        <span class="app-header__count"> — {{ found }} / {{ total }} consignés</span>
      </p>
    </div>

    <div class="app-header__modes">
      <slot name="modes"></slot>
    </div>

    <div class="app-header__actions">
      <slot name="timer"></slot>
      <span :class="['app-header__ecus', { 'is-busy': timerActive }]" :title="`${coins} écus`">
        <span :key="coins" class="app-header__ecus-value">{{ formattedCoins }}</span>
        <span class="g-mono">écus</span>
      </span>
      <slot name="actions"></slot>
    </div>
  </header>
</template>

<script>
// En-tête : titre, ère et progression, écus ; modes, chrono et compte passés en slots
export default {
  name: 'AppHeader',
  props: {
    found: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    eraLabel: { type: String, default: '' },
    coins: { type: Number, default: 0 },
    // Épreuve en cours : sur mobile, le chrono prend la place des écus
    timerActive: { type: Boolean, default: false }
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
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  grid-template-areas: "brand modes actions";
  align-items: center;
  gap: 16px 24px;
  padding: 24px 0 16px;
  border-bottom: 1px solid var(--oc-line);
}
.app-header__brand { grid-area: brand; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.app-header__title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-weight: 400;
  font-size: 30px;
  line-height: 1;
  letter-spacing: 0.16em;
  color: var(--oc-text-strong);
}
.app-header__meta { margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* Nouvelle ère : le libellé s'illumine un instant */
.app-header__era { animation: era-glow 2.4s var(--oc-ease-out); }
.app-header__modes { grid-area: modes; }
.app-header__actions { grid-area: actions; display: flex; align-items: center; justify-content: flex-end; gap: 14px; }
.app-header__ecus { display: flex; align-items: baseline; gap: 6px; }
.app-header__ecus-value {
  font-family: var(--oc-font-mono);
  font-size: 13px;
  color: var(--oc-gold);
  animation: coin-bump 0.5s var(--oc-ease-spring);
}

@keyframes era-glow {
  0% { color: var(--oc-gold); text-shadow: 0 0 12px rgba(224, 182, 84, 0.8); }
  100% { color: inherit; text-shadow: none; }
}
@keyframes coin-bump {
  40% { transform: scale(1.25); }
}

/* Mobile : marque + actions, puis les modes sur leur propre ligne */
@media (max-width: 859px) {
  .app-header {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: "brand actions" "modes modes";
    padding: 16px 0 10px;
  }
  .app-header__title { font-size: 24px; }
  .app-header__count { display: none; }
  .app-header__actions { gap: 10px; }
  .app-header__ecus.is-busy { display: none; }
}
</style>
