<template>
  <div>
    <!-- Compteur de pièces avec animation au survol -->
    <div class="coin-counter" @click="openPurchaseModal">
      <img src="@/assets/Svgs/coin.png" alt="Coins" class="coin-icon" />
      <span class="coin-amount">{{ formattedCoins }}</span>
    </div>

    <!-- Modal d'achat des pièces -->
    <div v-if="showPurchaseModal" class="purchase-modal">
      <div class="purchase-modal-content">
        <button @click="closePurchaseModal" class="close-modal-btn">&times;</button>
        <h2 class="modal-title">Acheter des pièces</h2>

        <div class="purchase-options">
          <!-- Option 1 -->
          <div class="purchase-option">
            <img src="@/assets/Svgs/coin.png" alt="Coins" class="option-coin-icon" />
            <span class="coin-quantity">100 pièces</span>
            <span class="price">0.50€</span>
            <button @click="handlePurchase(100, 0.50)" class="purchase-btn">Acheter</button>
          </div>

          <!-- Option 2 -->
          <div class="purchase-option">
            <img src="@/assets/Svgs/coin.png" alt="Coins" class="option-coin-icon" />
            <span class="coin-quantity">500 pièces</span>
            <span class="price">2.00€</span>
            <button @click="handlePurchase(500, 2.00)" class="purchase-btn">Acheter</button>
          </div>

          <!-- Option 3 -->
          <div class="purchase-option">
            <img src="@/assets/Svgs/coin.png" alt="Coins" class="option-coin-icon" />
            <span class="coin-quantity">1000 pièces</span>
            <span class="price">4.50€</span>
            <button @click="handlePurchase(1000, 4.50)" class="purchase-btn">Acheter</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import '@/assets/ComponentsStyle/HeaderStyle/CoinCounterStyle.css';

  export default {
    name: 'CoinCounter',
    props: {
      coins: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        showPurchaseModal: false
      }
    },
    computed: {
      formattedCoins() {
        return this.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
    },
    methods: {
      openPurchaseModal() {
        this.showPurchaseModal = true;
      },
      closePurchaseModal() {
        this.showPurchaseModal = false;
      },
      handlePurchase(coins, price) {
        // À implémenter : logique de paiement
        console.log(`Achat de ${coins} pièces pour ${price}€`);
      }
    }
  }
  </script>