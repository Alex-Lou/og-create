<template>
    <div class="coin-counter">
      <img src="@/assets/Svgs/coin.png" alt="Coins" class="coin-icon" />
      <span class="coin-amount">{{ formattedCoins }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CoinCounter',
    props: {
      coins: {
        type: Number,
        default: 0
      }
    },
    computed: {
      formattedCoins() {
        // Formatage des nombres avec des espaces pour les milliers
        return this.coins.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
      }
    }
  }
  </script>
  
  <style scoped>
  .coin-counter {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-left: 20px;
    margin-right: 20px;
  }
  
  .coin-icon {
    width: 24px;
    height: 24px;
    filter: drop-shadow(0 0 2px rgba(45, 150, 164, 0.3));
    transition: transform 0.3s ease;
  }
  
  .coin-counter:hover .coin-icon {
    transform: scale(1.1) rotate(15deg);
  }
  
  .coin-amount {
    color: #2D96A4;
    font-family: 'BenjaminFranklin', Arial;
    font-size: 18px;
    font-weight: bold;
    text-shadow: 0 0 10px rgba(45, 150, 164, 0.3);
  }
  </style>