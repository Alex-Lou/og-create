<template>
  <div class="souffle">
    <div class="souffle__row">
      <span class="g-mono">Souffle</span>
      <span class="g-mono souffle__value">
        {{ Math.max(0, energy) }} / {{ maxEnergy }}<template v-if="nextEnergyIn > 0"> · +1 dans {{ formatTime(nextEnergyIn) }}</template>
      </span>
    </div>
    <!-- Jauge en crans : un cran par point de souffle -->
    <div class="souffle__crans" role="img" :aria-label="`Souffle : ${Math.max(0, energy)} sur ${maxEnergy}`">
      <span v-for="n in maxEnergy" :key="n" :class="{ 'is-full': n <= energy }"></span>
    </div>
    <button
      v-if="showBuyButton"
      type="button"
      class="g-btn g-btn--ghost g-btn--small souffle__buy"
      :disabled="userCoins < energyCost || isProcessing || energy >= maxEnergy"
      :aria-busy="isProcessing ? 'true' : 'false'"
      @click="buyEnergy"
    >
      <span v-if="isProcessing" class="souffle__spin" aria-hidden="true"></span>
      <span v-if="isProcessing" class="oc-sr-only">Achat en cours</span>
      <template v-else>Acheter +1 souffle <span class="g-mono souffle__price">{{ energyCost }} écus</span></template>
    </button>
  </div>
</template>

<script>
import explorerService from '@/services/explorerService';
export default {
  name: 'EnergyDisplayExplorer',
  props: {
    energy: {
      type: Number,
      required: true
    },
    maxEnergy: {
      type: Number,
      default: 20
    },
    nextEnergyIn: {
      type: Number,
      default: 0
    },
    userCoins: {
      type: Number,
      default: 0
    },
    showBuyButton: {
      type: Boolean,
      default: true
    },
    energyCost: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      isProcessing: false,
      lastTransactionTime: 0,
      localEnergy: this.energy,
      localCoins: this.userCoins
    };
  },
  watch: {
    energy(newValue) {
      this.localEnergy = newValue;
    },
    userCoins(newValue) {
      this.localCoins = newValue;
    }
  },
  methods: {
    formatTime(minutes) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
    },
    
    async buyEnergy() {
  // Éviter les clics multiples
  if (this.isProcessing) return;
  
  // Debounce pour éviter les clics trop rapprochés
  const now = Date.now();
  if (now - this.lastTransactionTime < 350) {
    console.log("Achat ignoré - trop rapproché du précédent");
    return;
  }
  
  this.lastTransactionTime = now;
  this.isProcessing = true;
  
  try {
    // Appel au service sans validation côté client
    const result = await explorerService.buyEnergy(1);
    
    // Si l'achat est déjà en cours ou trop rapproché
    if (result.alreadyInProgress || result.tooSoon) {
      return; // Simplement ignorer
    }
    
    // Mettre à jour avec les valeurs retournées par le serveur
    this.$emit('energy-updated', result.energy);
    this.$emit('coins-updated', result.coins_remaining);
    
    // Afficher le message provenant du backend
    this.$emit('show-alert', result.message || `Énergie achetée avec succès`);
    
    // Forcer un rafraîchissement complet des données
    await explorerService.refreshAfterPurchase();
  } catch (error) {
    console.error('Erreur lors de l\'achat d\'énergie:', error);
    
    // Afficher le message d'erreur provenant du backend si disponible
    this.$emit('show-alert', error.response?.data?.message || 'Une erreur est survenue lors de l\'achat d\'énergie');
  } finally {
    // Autoriser un nouvel achat après un court délai
    setTimeout(() => {
      this.isProcessing = false;
    }, 250);
  }
}
  }
};
</script>

<style scoped>
.souffle {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.souffle__row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}
.souffle__value { color: var(--oc-gold); text-align: right; }
.souffle__crans {
  display: flex;
  gap: 4px;
}
.souffle__crans span {
  flex: 1 1 0;
  max-width: 6px;
  height: 18px;
  background: rgba(233, 223, 200, 0.14);
}
.souffle__crans span.is-full { background: var(--oc-gold); }
.souffle__buy {
  align-self: flex-start;
  min-height: 44px;
  gap: 12px;
}
.souffle__price { color: var(--oc-gold); }

/* Indicateur d'attente : un losange au trait qui tourne */
.souffle__spin {
  width: 12px;
  height: 12px;
  border: 1px solid var(--oc-line-strong);
  border-top-color: var(--oc-gold);
  animation: souffle-spin 0.9s linear infinite;
}
@keyframes souffle-spin {
  from { transform: rotate(45deg); }
  to { transform: rotate(405deg); }
}

@media (max-width: 859px) {
  .souffle__crans { gap: 3px; }
  .souffle__crans span { max-width: none; height: 12px; }
  .souffle__buy { align-self: stretch; }
}
</style>
