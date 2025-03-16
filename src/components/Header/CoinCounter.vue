<template>
  <div>
    <!-- Compteur de pièces avec animation au survol et cadre SVG -->
    <div class="coin-counter-container" @click="openPurchaseModal">
      <div class="coin-counter">
        <!-- Cadre SVG mystique pour le compteur de pièces -->
        <svg class="coin-counter-frame" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" preserveAspectRatio="none">
          <!-- Fond du compteur avec dégradé -->
          <rect x="2" y="2" width="196" height="46" rx="8" fill="url(#coinBtnGradient)" />
          
          <!-- Bordure extérieure avec lueur -->
          <rect x="2" y="2" width="196" height="46" rx="8" fill="none" stroke="url(#coinBrdGradient)" stroke-width="1.5" class="glow-border" />
          
          <!-- Bordure intérieure avec pulsation -->
          <rect x="5" y="5" width="190" height="40" rx="6" fill="none" stroke="url(#coinInnerBrdGradient)" stroke-width="0.8" class="inner-border" />
    
        </svg>
        
        <!-- Contenu du compteur de pièces -->
        <div class="coin-counter-content">
          <img src="@/assets/Svgs/coin.png" alt="Coins" class="coin-icon" />
          <span class="coin-amount">{{ formattedCoins }}</span>
        </div>
      </div>
    </div>

    <!-- Modal d'achat des pièces (inchangé) -->
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