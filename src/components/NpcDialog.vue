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
        // Réinitialise uniquement si pas encore exploré
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
      // Réinitialise l'état à chaque nouvelle ouverture
      this.showIntro = true;
      this.hasExploredOnce = false;
      this.dialogStep = 0;
    }
  }
  </script>
  
  <style scoped>
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
    color: white;
  }

  .region-intro h3 {
    margin-top: 0;
    margin-bottom: 10px;
  }

  .region-progress {
    margin-top: 10px;
  }

  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #444;
    border-radius: 5px;
    overflow: hidden;
    margin-top: 5px;
  }

  .progress-fill {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
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
  }
  
  .dialog-bubble p {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 20px;
    color: white;
  }
  
  .dialog-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
  
  .next-btn, .action-btn, .close-btn, .explore-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .explore-btn {
    background-color: #2196F3;
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