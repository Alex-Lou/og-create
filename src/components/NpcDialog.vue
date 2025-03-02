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
        <!-- Mode interaction pour plusieurs NPC -->
        <div v-if="isInteractionMode" class="interaction-container" :class="{'reverse-layout': currentInteraction.position === 'right'}">
          <!-- Image du NPC qui parle actuellement -->
          <div class="npc-image-container">
            <img :src="resolveNpcImage(currentInteraction.npcImage)" alt="NPC" class="npc-image" />
          </div>
          
          <!-- Contenu du dialogue -->
          <div class="dialog-content">
            <div class="dialog-bubble">
              <div class="speaker-indicator">
                {{ currentInteraction.position === 'left' ? 'Sage de la forêt:' : 'Apprenti de la rivière:' }}
              </div>
              <p>{{ currentInteraction.text }}</p>
            </div>
          </div>
        </div>
        
        <!-- Mode dialogue classique avec un seul NPC -->
        <div v-else class="standard-dialog-container" :class="npcPosition === 'right' ? 'reverse-layout' : ''">
          <div class="npc-image-container" :class="{ 'right-aligned': npcPosition === 'right' }">
            <img :src="resolveNpcImage(npcImage)" alt="NPC" class="npc-image" />
          </div>
          <div class="dialog-content">
            <div class="dialog-bubble">
              <p v-if="dialogStep < dialogContent.length">{{ dialogContent[dialogStep] }}</p>
            </div>
          </div>
        </div>
        
        <!-- Boutons fixes positionnés dans le conteneur principal -->
        <div class="dialog-buttons-container">
          <div class="dialog-buttons-center">
            <button 
              v-if="(isInteractionMode && interactionStep < regionData.interactions.length - 1) || 
                  (!isInteractionMode && dialogStep < dialogContent.length - 1)" 
              @click="isInteractionMode ? nextInteractionStep() : nextStep()" 
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
              <span v-if="energyCost > 0" class="energy-cost">⚡ {{ energyCost }}</span>
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
    npcPosition: {
      type: String,
      default: 'left'
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
      // Si c'est un boss (energyCost est 0), on peut toujours commencer
      if (this.energyCost === 0) return true;
      // Sinon, vérifier si on a assez d'énergie
      return this.currentEnergy >= this.energyCost;
    },
    isInteractionMode() {
      return this.regionData.interactions && this.regionData.interactions.length > 0;
    },
    currentInteraction() {
      if (this.isInteractionMode && this.regionData.interactions) {
        return this.regionData.interactions[this.interactionStep] || {};
      }
      return {};
    }
  },
  data() {
    return {
      dialogStep: 0,
      interactionStep: 0,
      showIntro: true,
      hasExploredOnce: false
    };
  },
  methods: {
    resolveNpcImage(imageName) {
      if (!imageName) return '';
      
      if (imageName.startsWith('boss-')) {
        return require(`@/assets/explorer-boss/${imageName}`);
      } else {
        return require(`@/assets/npcs/${imageName}`);
      }
    },
    startExploring() {
      this.showIntro = false;
      this.hasExploredOnce = true;
      this.dialogStep = 0;
      this.interactionStep = 0;
    },
    nextStep() {
      if (this.dialogStep < this.dialogContent.length - 1) {
        this.dialogStep++;
      }
    },
    nextInteractionStep() {
      if (this.interactionStep < this.regionData.interactions.length - 1) {
        this.interactionStep++;
      }
    },
    closeDialog() {
      this.dialogStep = 0;
      this.interactionStep = 0;
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
    this.interactionStep = 0;
  }
};
</script>

<style scoped>
@import '@/assets/NpcDialogStyle.css';
</style>