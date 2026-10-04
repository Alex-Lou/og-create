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
        <span class="app-header__coin" aria-hidden="true"></span>
        <span :key="coins" class="app-header__ecus-value">{{ formattedCoins }}</span>
        <span class="oc-sr-only">écus</span>
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
  padding: 20px 0 14px;
  border-bottom: 1px solid var(--oc-line);
}
.app-header__brand { grid-area: brand; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
.app-header__title {
  margin: 0;
  font-family: var(--oc-font-display);
  font-weight: 700;
  font-size: 30px;
  line-height: 1;
  letter-spacing: 0.01em;
  color: var(--oc-text-strong);
}
.app-header__meta { margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
/* Nouvelle ère : le libellé s'illumine un instant */
.app-header__era { animation: era-glow 2.4s var(--oc-ease-out); }
.app-header__modes { grid-area: modes; }
.app-header__actions { grid-area: actions; display: flex; align-items: center; justify-content: flex-end; gap: 14px; }
/* Écus : pastille de papier, pièce d'or gravée */
.app-header__ecus {
  height: 36px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 12px 0 6px;
  border-radius: var(--r-pill);
  background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400), var(--shadow-1);
}
.app-header__coin {
  position: relative;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff4c8 0 18%, var(--gold-400) 40%, var(--gold-600) 100%);
  box-shadow: inset 0 0 0 2px rgba(140, 94, 24, 0.55), inset 0 -2px 0 rgba(140, 94, 24, 0.35);
}
.app-header__coin::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; border: 1.5px solid rgba(140, 94, 24, 0.5); }
.app-header__ecus-value {
  font-family: var(--oc-font-body);
  font-weight: 900;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
  color: var(--ink-900);
  animation: coin-bump 0.5s var(--oc-ease-spring);
}

@keyframes era-glow {
  0% { color: var(--oc-gold); text-shadow: 0 0 12px rgba(239, 193, 99, 0.8); }
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
