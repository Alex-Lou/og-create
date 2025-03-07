<template>
    <div v-if="showModal">
      <!-- Modal pour victoire de boss -->
      <div v-if="victoryRewards?.isBossReward" class="boss-victory-modal">
        <div class="boss-victory">
          <div class="boss-victory-header">
            <!-- Image/Animation du boss vaincu avec chargement dynamique -->
            <img
              v-if="boss"
              :src="bossDefeatedImage"
              alt="Boss vaincu"
              class="boss-image"
            />
            <h2>Boss Vaincu !</h2>
          </div>
          
          <!-- Message narratif -->
          <p class="victory-message">
            <span v-if="victoryRewards?.alreadyDefeated">
              Vous avez à nouveau triomphé de <strong>{{ boss ? boss.name : 'le boss' }}</strong>. 
              <br><span class="already-defeated-message">Ce boss avait déjà été vaincu, aucune récompense n'est attribuée cette fois-ci.</span>
            </span>
            <span v-else>
              Félicitations ! Vous avez triomphé de <strong>{{ boss ? boss.name : 'le boss' }}</strong> après un combat épique.
            </span>
          </p>
          
          <!-- Récompenses obtenues (uniquement affichées si le boss n'avait pas été vaincu auparavant) -->
          <div class="rewards-container" v-if="!victoryRewards?.alreadyDefeated">
            <h3>Récompenses Obtenues :</h3>
            <div class="reward-item" v-if="victoryRewards?.coins">
              <span class="reward-icon">💰</span>
              <span class="reward-value">{{ victoryRewards.coins }} Pièces</span>
            </div>
            <div class="reward-item" v-if="victoryRewards?.xp">
              <span class="reward-icon">✨</span>
              <span class="reward-value">{{ victoryRewards.xp }} XP</span>
            </div>
            <div class="reward-item" v-if="victoryRewards?.energy">
              <span class="reward-icon">⚡</span>
              <span class="reward-value">{{ victoryRewards.energy }} Énergie</span>
            </div>
            <div class="reward-item" v-if="victoryRewards?.bonus">
              <span class="reward-icon">🎁</span>
              <span class="reward-value">{{ victoryRewards.bonus }}</span>
            </div>
          </div>
          
          <!-- Message pour les nouvelles régions débloquées -->
          <div class="next-steps" v-if="hasUnlockedRegions && !victoryRewards?.alreadyDefeated">
            <p>
              De nouvelles régions ont été débloquées ! Préparez-vous à explorer de nouveaux territoires et relever d'autres défis.
            </p>
          </div>
          
          <!-- Bouton pour continuer -->
          <button class="continue-btn" @click="onClose">Continuer</button>
        </div>
      </div>
      
      <!-- Modal pour victoire normale (régions non-boss) -->
      <div v-else class="victory-modal">
        <div class="victory-content">
          <h2>Victoire !</h2>
          
          <!-- Affichage différent selon que la région a déjà été complétée ou non -->
          <p v-if="victoryRewards?.alreadyCompleted">
            Vous avez réussi le défi de {{ regionName }} une nouvelle fois !
            <br><span class="already-completed-message">Cette région avait déjà été complétée, aucune récompense n'a été attribuée.</span>
          </p>
          <p v-else>
            Félicitations, vous avez complété la quête: {{ regionName }} !
          </p>
          
          <div class="rewards-container" v-if="!victoryRewards?.alreadyCompleted">
            <h3>Récompenses obtenues :</h3>
            <div class="reward-item" v-if="victoryRewards?.coins">
              <span class="reward-icon">💰</span>
              <span class="reward-value">{{ victoryRewards.coins }} Pièces</span>
            </div>
            <div class="reward-item" v-if="victoryRewards?.xp">
              <span class="reward-icon">✨</span>
              <span class="reward-value">{{ victoryRewards.xp }} XP</span>
            </div>
            <div class="reward-item" v-if="victoryRewards?.energy">
              <span class="reward-icon">⚡</span>
              <span class="reward-value">{{ victoryRewards.energy }} Énergie</span>
            </div>
          </div>
          
          <p class="unlock-message" v-if="hasUnlockedRegions && !victoryRewards?.alreadyCompleted">
            Vous avez débloqué de nouvelles régions ! Partez les explorer !
          </p>
          
          <button class="continue-btn" @click="onClose">Continuer</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ExplorerVictoryModal',
    props: {
      showModal: {
        type: Boolean,
        default: false
      },
      victoryRewards: {
        type: Object,
        default: () => ({})
      },
      regionName: {
        type: String,
        default: 'cette région'
      },
      boss: {
        type: Object,
        default: null
      },
      bossDefeatedImage: {
        type: String,
        default: ''
      },
      hasUnlockedRegions: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      onClose() {
        this.$emit('close');
      }
    }
  };
  </script>
  
  <style scoped>
  .boss-victory-modal, .victory-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 1000;
  }
  
  .boss-victory, .victory-content {
    background-color: #2c3e50;
    border: 4px solid #f1c40f;
    border-radius: 12px;
    padding: 25px;
    max-width: 500px;
    width: 100%;
    text-align: center;
    position: relative;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    color: white;
  }
  
  .boss-victory-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .boss-image {
    width: 150px;
    height: 150px;
    object-fit: contain;
    margin-bottom: 10px;
  }
  
  h2 {
    font-size: 2rem;
    margin: 0 0 15px 0;
    color: #f1c40f;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }
  
  .victory-message {
    font-size: 1.1rem;
    margin: 0 0 20px 0;
    line-height: 1.5;
  }
  
  .already-defeated-message, .already-completed-message {
    color: #e74c3c;
    font-size: 0.9rem;
    font-style: italic;
  }
  
  .rewards-container {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 15px;
    margin: 20px 0;
  }
  
  .rewards-container h3 {
    margin-top: 0;
    color: #f1c40f;
  }
  
  .reward-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0;
    font-size: 1.2rem;
  }
  
  .reward-icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
  
  .unlock-message {
    font-size: 1rem;
    color: #2ecc71;
    margin: 15px 0;
  }
  
  .next-steps {
    margin: 20px 0;
    color: #2ecc71;
  }
  
  .continue-btn {
    background-color: #f1c40f;
    border: none;
    color: #2c3e50;
    padding: 10px 25px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 15px;
  }
  
  .continue-btn:hover {
    background-color: #f39c12;
    transform: scale(1.05);
  }
  </style>