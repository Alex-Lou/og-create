<template>
  <div class="npc-dialog-overlay" @click.self="closeDialog">
    <div class="npc-dialog-container">
      <div v-if="showIntro" class="region-intro">
        <h3>{{ regionData.name }}</h3>
        <p>{{ regionData.description || "Une région mystérieuse à explorer..." }}</p>
        
        <div class="region-progress">
          <div class="progress-label">Progression: {{ regionData.progress || 0 }}%</div>
          <div class="progress-bar">
            <div 
              class="progress-fill" 
              :style="{ width: `${regionData.progress || 0}%` }"
            ></div>
          </div>
        </div>

        <div class="region-actions">
          <button 
            class="explore-btn" 
            @click="startExploring"
          >
            Explorer
          </button>
          <button @click="closeDialog" class="close-btn">Fermer</button>
        </div>
      </div>

      <div v-else class="npc-content">
        <div class="npc-image-container">
            <img :src="require(`@/assets/npcs/${npcImage}`)" alt="NPC" class="npc-image" />
        </div>
        <div class="dialog-content">
          <div class="dialog-bubble">
            <p v-if="dialogStep < dialogContent.length">{{ dialogContent[dialogStep] }}</p>
            <div class="dialog-buttons">
              <button 
                v-if="dialogStep < dialogContent.length - 1" 
                @click="nextStep" 
                class="next-btn"
              >
                Suivant
              </button>
              <button 
                v-else 
                @click="handleAction" 
                class="action-btn"
                :disabled="!canStartChallenge"
              >
                {{ actionButtonText }} 
                <span v-if="energyCost" class="energy-cost">⚡ {{ energyCost }}</span>
              </button>
              <button @click="closeDialog" class="close-btn">Fermer</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NpcDialog',
  props: {
    npcImage: {
      type: String,
      default: 'npc1.png'
    },
    dialogContent: {
      type: Array,
      default: () => ['Bonjour voyageur ! Bienvenue dans cette région.']
    },
    regionData: {
      type: Object,
      default: () => ({})
    },
    actionButtonText: {
      type: String,
      default: 'Commencer à crafter'
    },
    energyCost: {
      type: Number,
      default: 2
    },
    currentEnergy: {
      type: Number,
      default: 0
    }
  },
  computed: {
    canStartChallenge() {
      return this.currentEnergy >= this.energyCost;
    }
  },
  data() {
    return {
      dialogStep: 0,
      showIntro: true,
      hasExploredOnce: false
    };
  },
  methods: {
    startExploring() {
      this.showIntro = false;
      this.hasExploredOnce = true;
    },
    nextStep() {
      if (this.dialogStep < this.dialogContent.length - 1) {
        this.dialogStep++;
      }
    },
    closeDialog() {
      this.dialogStep = 0;
      if (!this.hasExploredOnce) {
        this.showIntro = true;
      }
      this.$emit('close');
    },
    handleAction() {
      if (this.canStartChallenge) {
        this.$emit('action', this.regionData);
        this.closeDialog();
      } else {
        alert('Énergie insuffisante ! Attendez que votre énergie se régénère ou achetez-en plus.');
      }
    }
  },
  mounted() {
    this.showIntro = true;
    this.hasExploredOnce = false;
    this.dialogStep = 0;
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

.npc-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.npc-dialog-container {
  width: 90%;
  max-width: 800px;
  background-color: rgba(30, 30, 30, 0.9);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.region-intro {
  padding: 15px;
  background-color: rgba(20, 20, 20, 0.8);
  color: rgb(190, 190, 190);
  font-size: 16px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
}

.region-intro h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 16px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
}

.region-progress {
  margin-top: 10px;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 15px;
  background-color: #444;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #20394e, #425768);
  transition: width 0.3s ease;
  position: relative;
}

/* Particules flottantes sur la progress bar en #2196F3
   moins transparentes, plus visibles et avec encore plus de particules réparties le long de la barre */
.progress-fill::before,
.progress-fill::after,
.progress-fill .particle {
  content: '';
  position: absolute;
  top: 50%;
  width: 10px;
  height: 10px;
  background: rgba(33, 149, 243, 1); /* Pleine opacité */
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7), 0 0 10px rgba(255, 255, 255, 0.5);
  animation: particleMove 3s infinite linear;
  opacity: 1;
}

/* Définition des particules existantes */
.progress-fill::before {
  left: 10%;
  animation-delay: 0.2s;
}

.progress-fill::after {
  left: 20%;
  animation-delay: 0.4s;
  transform: translateY(-3px);
}

/* Particules supplémentaires pour une répartition plus dense */
.progress-fill .particle-5 {
  left: 5%;
  animation-delay: 0.1s;
}

.progress-fill .particle-10 {
  left: 10%;
  animation-delay: 0.2s;
}

.progress-fill .particle-15 {
  left: 15%;
  animation-delay: 0.3s;
}

.progress-fill .particle-20 { 
  left: 20%; 
  animation-delay: 0.4s; 
}

.progress-fill .particle-25 {
  left: 25%;
  animation-delay: 0.5s;
}

.progress-fill .particle-30 { 
  left: 30%; 
  animation-delay: 0.6s; 
}

.progress-fill .particle-35 {
  left: 35%;
  animation-delay: 0.7s;
}

.progress-fill .particle-40 { 
  left: 40%; 
  animation-delay: 0.8s; 
}

.progress-fill .particle-45 {
  left: 45%;
  animation-delay: 0.9s;
}

.progress-fill .particle-50 { 
  left: 50%; 
  animation-delay: 1s; 
}

.progress-fill .particle-55 {
  left: 55%;
  animation-delay: 1.1s;
}



.progress-fill .particle-70 { 
  left: 70%; 
  animation-delay: 1.4s; 
}

.progress-fill .particle-75 {
  left: 75%;
  animation-delay: 1.5s;
}

.progress-fill .particle-80 { 
  left: 80%; 
  animation-delay: 1.6s; 
}

.progress-fill .particle-85 {
  left: 85%;
  animation-delay: 1.7s;
}

.progress-fill .particle-90 { 
  left: 90%; 
  animation-delay: 1.8s; 
}

.progress-fill .particle-95 {
  left: 95%;
  animation-delay: 1.9s;
}

@keyframes particleMove {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

.region-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.npc-content {
  display: flex;
}

.npc-image-container {
  width: 30%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.npc-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 5px;
}

.dialog-content {
  width: 70%;
  padding: 20px;
}

.dialog-bubble {
  background-color: #2a2a2a;
  border-radius: 10px;
  padding: 15px;
  position: relative;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
}

.dialog-bubble p {
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  color: white;
  font-size: 14px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
  font-size: 14px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
}

.next-btn, .action-btn, .close-btn, .explore-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  font-size: 14px;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
}

.explore-btn {
  background-color: #1c598b;
  color: white;
}

.explore-btn:hover {
  background-color: #1976D2;
}

.next-btn {
  background-color: #4CAF50;
  color: white;
}

.action-btn {
  background-color: #2196F3;
  color: white;
}

.action-btn:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.close-btn {
  background-color: #f44336;
  color: white;
}

.energy-cost {
  font-weight: bold;
  color: yellow;
  margin-left: 5px;
}

@media (max-width: 768px) {
  .npc-content {
    flex-direction: column;
  }
  .npc-image-container, .dialog-content {
    width: 100%;
  }
}
</style>
