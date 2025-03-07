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
  import '@/assets/ComponentsStyle/ExplorerStyle/ExplorerVictoryModalStyle.css';
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
