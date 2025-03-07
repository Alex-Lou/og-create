<template>
  <div class="energy-timer-container">
    <div class="energy-timer" v-if="nextEnergyIn > 0">
      Recharge dans {{ formatTime(nextEnergyIn) }}
    </div>
    <div class="energy-display">
      <span class="energy-icon">⚡</span>
      <span class="energy-value">{{ energy }}/{{ maxEnergy }}</span>
      <button v-if="showBuyButton" @click="buyEnergy" class="buy-energy-btn" 
              :disabled="userCoins < energyCost || isProcessing || energy >= maxEnergy">
        <span v-if="isProcessing">
          <!-- Ajouter ici un spinner ou autre indicateur de chargement -->
          <i class="fa fa-spinner fa-spin"></i>
        </span>
        <span v-else>+1 ({{ energyCost }} 💰)</span>
      </button>
    </div>
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
      // Vérifications pour éviter les achats inutiles
      if (this.isProcessing) return;
      if (this.energy >= this.maxEnergy) {
        this.$emit('show-alert', `Votre énergie est déjà au maximum.`);
        return;
      }
      if (this.userCoins < this.energyCost) {
        this.$emit('show-alert', `Vous n'avez pas assez de pièces ! ${this.energyCost} pièces sont nécessaires pour acheter 1 point d'énergie.`);
        return;
      }
      
      // Debounce pour éviter les clics multiples
      const now = Date.now();
      if (now - this.lastTransactionTime < 350) {
        console.log("Achat ignoré - trop rapproché du précédent");
        return;
      }
      
      this.lastTransactionTime = now;
      this.isProcessing = true;
      
      try {
        // Mettre à jour optimistiquement les valeurs locales
        this.localEnergy += 1;
        this.localCoins -= this.energyCost;
        
        // Appel au service
        const result = await explorerService.buyEnergy(1);
        
        // Si l'achat est déjà en cours ou trop rapproché
        if (result.alreadyInProgress || result.tooSoon) {
          return; // Simplement ignorer
        }
        
        // Mettre à jour avec les valeurs réelles retournées par le serveur
        this.$emit('energy-updated', result.energy);
        this.$emit('coins-updated', result.coins_remaining);
        this.$emit('show-alert', `Vous avez acheté 1 point d'énergie pour ${this.energyCost} pièces.`);
        
        // Forcer un rafraîchissement complet des données
        await explorerService.refreshAfterPurchase();
      } catch (error) {
        console.error('Erreur lors de l\'achat d\'énergie:', error);
        
        // Restaurer les valeurs initiales en cas d'erreur
        this.localEnergy = this.energy;
        this.localCoins = this.userCoins;
        
        // Afficher l'erreur
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

    @font-face {
    font-family: 'White Storm';
    src: url('@/assets/White Storm.otf') format('opentype');
    font-weight: normal;
    font-style: normal;
    }

    @font-face {
    font-family: 'BenjaminFranklin';
    src: url('@/assets/BenjaminFranklin.ttf') format('opentype');
    font-weight: normal;
    font-style: normal;
    }

  .buy-energy-btn {
    background-color: #4caf50;
    border: none;
    color: white;
    margin-left: 5px;
    padding: 2px 8px;
    border-radius: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
  }
  
  .buy-energy-btn:hover:not(:disabled) {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .buy-energy-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    opacity: 0.7;
  }
  </style>