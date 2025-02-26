<template>
    <div class="npc-dialog-overlay" @click.self="closeDialog">
      <div class="npc-dialog-container">
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
              >
                {{ actionButtonText }}
              </button>
              <button @click="closeDialog" class="close-btn">Fermer</button>
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
      }
    },
    data() {
      return {
        dialogStep: 0
      };
    },
    methods: {
      nextStep() {
        if (this.dialogStep < this.dialogContent.length - 1) {
          this.dialogStep++;
        }
      },
      closeDialog() {
        this.dialogStep = 0;
        this.$emit('close');
      },
      handleAction() {
        this.$emit('action', this.regionData);
        this.closeDialog();
      }
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
    display: flex;
    width: 90%;
    max-width: 800px;
    background-color: rgba(30, 30, 30, 0.9);
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
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
  
  .next-btn, .action-btn, .close-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .next-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .action-btn {
    background-color: #2196F3;
    color: white;
  }
  
  .close-btn {
    background-color: #f44336;
    color: white;
  }
  
  @media (max-width: 768px) {
    .npc-dialog-container {
      flex-direction: column;
    }
  
    .npc-image-container, .dialog-content {
      width: 100%;
    }
  }
  </style>