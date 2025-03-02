<template>
    <div v-if="isVisible" class="map-transition-modal">
      <div class="transition-content">
        <!-- En-tête avec animation de victoire -->
        <div class="transition-header">
          <div class="victory-animation">
            <!-- Remplacé l'image GIF par un effet CSS pour éviter l'erreur de fichier manquant -->
            <div class="victory-effect">
              <span class="victory-star">⭐</span>
              <span class="victory-text">VICTOIRE!</span>
            </div>
          </div>
          <h1 class="transition-title">Nouvelle Région Découverte!</h1>
        </div>
  
        <!-- Corps du message narratif -->
        <div class="transition-message">
          <p class="narrative">
            Félicitations, aventurier! Après avoir vaincu le {{ bossName || 'Gardien des Ténèbres' }}, 
            un nouveau territoire s'ouvre à vous. Cette terre inexplorée regorge de mystères 
            et de défis qui attendent votre expertise en alchimie élémentaire.
          </p>
          
          <!-- Affichage de la nouvelle carte -->
          <div class="new-map-preview">
            <img 
              :src="require(`@/assets/maps/world-map${newMapId}.png`)" 
              alt="Nouvelle carte" 
              class="map-preview-img" 
            />
            <div class="map-name">{{ getMapName() }}</div>
          </div>
          
          <p class="quest-teaser">
            De nouveaux alliés vous attendent, et de nouvelles combinaisons d'éléments 
            seront nécessaires pour surmonter les obstacles qui se dresseront sur votre chemin.
          </p>
        </div>
  
        <!-- Récompenses et bonus spéciaux -->
        <div class="special-rewards">
          <h3>Récompenses Spéciales</h3>
          <div class="rewards-grid">
            <div class="reward-item">
              <span class="reward-icon">💰</span>
              <span class="reward-value">{{ rewards.coins || 500 }} Pièces</span>
            </div>
            <div class="reward-item">
              <span class="reward-icon">✨</span>
              <span class="reward-value">{{ rewards.xp || 1000 }} XP</span>
            </div>
            <div class="reward-item">
              <span class="reward-icon">⚡</span>
              <span class="reward-value">{{ rewards.energy || 10 }} Énergie</span>
            </div>
            <div class="reward-item">
              <span class="reward-icon">🗺️</span>
              <span class="reward-value">Nouvelle région débloquée!</span>
            </div>
          </div>
        </div>
  
        <!-- Bouton pour continuer -->
        <button @click="continueToNewMap" class="continue-btn">
          Explorer la nouvelle région
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MapTransitionModal',
    props: {
      isVisible: {
        type: Boolean,
        default: false
      },
      bossName: {
        type: String,
        default: "Gardien des Ténèbres"
      },
      oldMapId: {
        type: Number,
        default: 1
      },
      newMapId: {
        type: Number,
        default: 2
      },
      rewards: {
        type: Object,
        default: () => ({
          coins: 500,
          xp: 1000,
          energy: 10
        })
      }
    },
    methods: {
      continueToNewMap() {
        this.$emit('continue-to-new-map', this.newMapId);
      },
      getMapName() {
        // Noms des différentes maps
        const mapNames = {
          1: "Forêt Primordiale",
          2: "Désert des Illusions",
          3: "Royaume Céleste"
        };
        return mapNames[this.newMapId] || `Carte ${this.newMapId}`;
      }
    }
  };
  </script>
  
  <style scoped>
  .map-transition-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .transition-content {
    background-color: #2c3e50;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(255, 223, 0, 0.6);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    padding: 30px;
    color: #ecf0f1;
    border: 3px solid #f39c12;
    position: relative;
  }
  
  .transition-header {
    text-align: center;
    margin-bottom: 20px;
    position: relative;
  }
  
  .victory-animation {
    margin: 0 auto 20px;
    text-align: center;
  }
  
  /* Nouveau style pour remplacer l'image GIF */
  .victory-effect {
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: bounce 1s ease infinite alternate;
  }
  
  .victory-star {
    font-size: 48px;
    color: #f1c40f;
    text-shadow: 0 0 15px rgba(241, 196, 15, 0.8);
    margin-bottom: 10px;
    animation: rotate 3s linear infinite;
  }
  
  .victory-text {
    font-size: 32px;
    font-weight: bold;
    color: #f1c40f;
    text-shadow: 0 0 10px rgba(241, 196, 15, 0.8);
    letter-spacing: 2px;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes bounce {
    from { transform: translateY(0); }
    to { transform: translateY(-10px); }
  }
  
  .transition-title {
    font-size: 2.5rem;
    color: #f1c40f;
    text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
    margin: 0;
    animation: pulse 2s infinite;
  }
  
  .transition-message {
    margin: 30px 0;
    font-size: 1.1rem;
    line-height: 1.6;
  }
  
  .narrative {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .new-map-preview {
    position: relative;
    margin: 30px auto;
    text-align: center;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    overflow: hidden;
    max-width: 600px;
  }
  
  .map-preview-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 8px;
    transition: transform 0.5s ease;
  }
  
  .map-preview-img:hover {
    transform: scale(1.03);
  }
  
  .map-name {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
    color: #fff;
    padding: 15px;
    font-size: 1.5rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  }
  
  .quest-teaser {
    text-align: center;
    font-style: italic;
    color: #bdc3c7;
    margin-top: 20px;
  }
  
  .special-rewards {
    background-color: rgba(52, 73, 94, 0.7);
    border-radius: 8px;
    padding: 20px;
    margin: 30px 0;
  }
  
  .special-rewards h3 {
    text-align: center;
    color: #e67e22;
    margin-top: 0;
    font-size: 1.5rem;
  }
  
  .rewards-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 15px;
  }
  
  .reward-item {
    background-color: rgba(44, 62, 80, 0.7);
    border-radius: 8px;
    padding: 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1 0 40%;
    min-width: 180px;
    box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
    transition: transform 0.3s ease;
  }
  
  .reward-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
  }
  
  .reward-icon {
    font-size: 24px;
    min-width: 30px;
    text-align: center;
  }
  
  .reward-value {
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .continue-btn {
    display: block;
    margin: 30px auto 0;
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 30px;
    padding: 15px 30px;
    font-size: 1.2rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
  }
  
  .continue-btn:hover {
    background-color: #c0392b;
    transform: translateY(-3px);
    box-shadow: 0 7px 20px rgba(231, 76, 60, 0.6);
  }
  
  .continue-btn:active {
    transform: translateY(1px);
    box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes pulse {
    0% { text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
    50% { text-shadow: 0 0 20px rgba(241, 196, 15, 0.8), 0 0 30px rgba(241, 196, 15, 0.3); }
    100% { text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
  }
  
  @media (max-width: 768px) {
    .transition-title {
      font-size: 2rem;
    }
    
    .reward-item {
      flex: 1 0 100%;
    }
  }
  </style>