<template>
  <header class="hud">
    <div class="hud__era" :title="`${found} / ${total} éléments consignés`">
      <span :key="era" class="hud__era-mark">{{ eraNumber }}</span>
      <span class="hud__era-text">
        <span class="hud__era-name">{{ eraName }}</span>
        <span class="hud__era-count">{{ found }} / {{ total }}</span>
      </span>
    </div>

    <div class="hud__right">
      <slot name="timer"></slot>
      <span :class="['hud__pill', { 'is-busy': timerActive }]" :title="`${coins} écus`">
        <span class="hud__coin" aria-hidden="true"></span>
        <span :key="coins" class="hud__value">{{ formattedCoins }}</span>
        <span class="oc-sr-only">écus</span>
      </span>
    </div>
  </header>
</template>

<script>
import { roman } from '@/utils/roman';

// HUD : l'ère et la progression à gauche, le sablier de l'Épreuve et les écus à droite
export default {
  name: 'AppHeader',
  props: {
    found: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    era: { type: Number, default: 1 },
    eraName: { type: String, default: '' },
    coins: { type: Number, default: 0 },
    // Épreuve en cours : sur mobile, le sablier prend la place des écus
    timerActive: { type: Boolean, default: false }
  },
  computed: {
    eraNumber() {
      return roman(this.era);
    },
    formattedCoins() {
      return new Intl.NumberFormat('fr-FR').format(this.coins);
    }
  }
};
</script>

<style scoped>
.hud {
  position: relative;
  z-index: 10;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0 8px;
}
/* Puces de papier : ère et progression, écus */
.hud__era,
.hud__pill {
  min-width: 0;
  height: 40px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--r-pill);
  background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px var(--oc-line), 0 2px 0 var(--vellum-400), var(--shadow-1);
}
.hud__era { padding: 0 14px 0 4px; }
.hud__era-mark {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  font-family: var(--oc-font-display);
  font-weight: 700;
  font-size: 13px;
  color: var(--vellum-50);
  background: radial-gradient(circle at 35% 30%, #d9705c 0 20%, var(--wax-500) 55%, var(--wax-700) 100%);
  box-shadow: inset 0 0 0 2px rgba(0, 0, 0, 0.12);
  /* Nouvelle ère : le sceau se pose */
  animation: seal-in 0.6s var(--oc-ease-spring);
}
.hud__era-text { min-width: 0; display: flex; flex-direction: column; line-height: 1.1; }
.hud__era-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: var(--oc-font-display); font-weight: 700; font-size: 15px; color: var(--ink-900); }
.hud__era-count { font-weight: 800; font-size: 11px; font-variant-numeric: tabular-nums; color: var(--ink-500); }
.hud__right { flex-shrink: 0; display: flex; align-items: center; gap: 8px; }
.hud__pill { padding: 0 14px 0 8px; }
.hud__coin {
  position: relative;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff4c8 0 18%, var(--gold-400) 40%, var(--gold-600) 100%);
  box-shadow: inset 0 0 0 2px rgba(140, 94, 24, 0.55), inset 0 -2px 0 rgba(140, 94, 24, 0.35);
}
.hud__coin::after { content: ''; position: absolute; inset: 6px; border-radius: 50%; border: 1.5px solid rgba(140, 94, 24, 0.5); }
.hud__value {
  font-weight: 900;
  font-size: 16px;
  font-variant-numeric: tabular-nums;
  color: var(--ink-900);
  animation: coin-bump 0.5s var(--oc-ease-spring);
}

@keyframes seal-in {
  0% { transform: scale(1.5) rotate(-12deg); opacity: 0; }
  100% { transform: none; opacity: 1; }
}
@keyframes coin-bump {
  40% { transform: scale(1.25); }
}

@media (max-width: 859px) {
  .hud__pill.is-busy { display: none; }
}
</style>
