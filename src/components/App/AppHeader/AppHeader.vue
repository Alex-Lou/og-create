<template>
  <header class="hud">
    <button type="button" class="hud__era" :aria-label="`${eraName}, ${found} sur ${total} éléments : ouvrir ton sceau`" @click="$emit('open-sceau')">
      <span :key="era" class="hud__era-mark">{{ eraNumber }}</span>
      <span class="hud__era-text">
        <span class="hud__era-name">{{ eraName }}</span>
        <span class="hud__era-count">{{ found }} / {{ total }}</span>
      </span>
    </button>

    <div class="hud__right">
      <slot name="timer"></slot>
      <button type="button" :class="['hud__pill', { 'is-busy': timerActive }]" :aria-label="`${coins} écus : ouvrir le Cabinet`" @click="$emit('open-shop')">
        <span class="hud__coin" aria-hidden="true"></span>
        <span :key="coins" class="hud__value">{{ formattedCoins }}</span>
      </button>
    </div>
  </header>
</template>

<script>
import { roman } from '@/utils/roman';

// HUD : l'ère et la progression à gauche, le sablier de l'Épreuve et les écus à droite.
// L'ère mène au Sceau (progression), les écus au Cabinet où les dépenser.
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
  emits: ['open-sceau', 'open-shop'],
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

<style scoped src="./AppHeader.css"></style>
