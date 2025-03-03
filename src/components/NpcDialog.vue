<template>
  <div class="npc-dialog-overlay" @click.self="closeDialog">
    <div class="npc-dialog-container">
      <!-- Affichage de l'introduction de la région -->
      <div v-if="showIntro" class="region-intro">
        <h3>{{ regionData.name || 'Region inconnue' }}</h3>
        <p>{{ regionData.description || defaultRegionDescription }}</p>
        
        <div class="region-progress" v-if="regionData.progress !== undefined">
          <div class="progress-label">Progression: {{ regionData.progress }}%</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${regionData.progress}%` }"></div>
          </div>
        </div>

        <div class="region-actions">
          <button class="explore-btn" @click="startExploring">
            {{ dynamicExploreButtonText }}
          </button>
          <button @click="closeDialog" class="close-btn">
            {{ dynamicCloseButtonText }}
          </button>
        </div>
      </div>

      <!-- Affichage du dialogue -->
      <div v-else class="npc-content">
        <!-- Mode interaction (plusieurs NPC) -->
        <div v-if="isInteractionMode" class="interaction-container" :class="{'reverse-layout': currentInteraction.position === 'right'}">
          <div class="npc-image-container">
            <img :src="resolveNpcImage(currentInteraction.npcImage)" alt="NPC" class="npc-image" />
          </div>
          <div class="dialog-content">
            <div class="dialog-bubble">
              <div class="speaker-indicator">
                {{ getSpeakerIndicator(currentInteraction.position) }}
              </div>
              <p>{{ currentInteraction.text }}</p>
            </div>
          </div>
        </div>
        
        <!-- Mode dialogue classique (un seul NPC) -->
        <div v-else class="standard-dialog-container" :class="effectiveNpcPosition === 'right' ? 'reverse-layout' : ''">
          <div class="npc-image-container" :class="{ 'right-aligned': effectiveNpcPosition === 'right' }">
            <img :src="resolveNpcImage(effectiveNpcImage)" alt="NPC" class="npc-image" />
          </div>
          <div class="dialog-content">
            <div class="dialog-bubble">
              <p v-if="dialogStep < effectiveDialogContent.length">
                {{ effectiveDialogContent[dialogStep] }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Boutons de navigation et action -->
        <div class="dialog-buttons-container">
          <div class="dialog-buttons-center">
            <button 
              v-if="(isInteractionMode && interactionStep < regionData.interactions.length - 1) ||
                     (!isInteractionMode && dialogStep < effectiveDialogContent.length - 1)"
              @click="isInteractionMode ? nextInteractionStep() : nextStep()"
              class="next-btn"
            >
              {{ dynamicNextButtonText }}
            </button>
            <button 
              v-else 
              @click="handleAction" 
              class="action-btn"
              :disabled="!canStartChallenge"
            >
              {{ effectiveActionButtonText }} 
              <span v-if="effectiveEnergyCost > 0" class="energy-cost">
                ⚡ {{ effectiveEnergyCost }}
              </span>
            </button>
            <button @click="closeDialog" class="close-btn">
              {{ dynamicCloseButtonText }}
            </button>
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
    npcImage: { type: String, default: null },
    npcPosition: { type: String, default: null },
    dialogContent: { type: Array, default: () => [] },
    regionData: { type: Object, default: () => ({}) },
    actionButtonText: { type: String, default: null },
    energyCost: { type: Number, default: null },
    currentEnergy: { type: Number, default: 0 }
  },
  computed: {
    // Ces computed renvoient d'abord les données de regionData, sinon les props,
    // et enfin les valeurs par défaut dynamiques
    effectiveNpcImage() {
      return (this.regionData && this.regionData.npcImage) || this.npcImage || this.getDefaultNpcConfig().npcImage;
    },
    effectiveNpcPosition() {
      return (this.regionData && this.regionData.npcPosition) || this.npcPosition || this.getDefaultNpcConfig().npcPosition;
    },
    effectiveDialogContent() {
      return (this.regionData && this.regionData.dialog && this.regionData.dialog.length > 0)
        ? this.regionData.dialog
        : (this.dialogContent.length ? this.dialogContent : this.getDefaultNpcConfig().dialogContent);
    },
    effectiveActionButtonText() {
      return (this.regionData && this.regionData.actionText) || this.actionButtonText || this.getDefaultNpcConfig().actionButtonText;
    },
    effectiveEnergyCost() {
      return (this.regionData && this.regionData.energyCost !== undefined)
        ? this.regionData.energyCost
        : (this.energyCost !== null ? this.energyCost : this.getDefaultNpcConfig().energyCost);
    },
    canStartChallenge() {
      // Si le coût est 0, c'est un boss par exemple, et on peut toujours commencer
      if (this.effectiveEnergyCost === 0) return true;
      return this.currentEnergy >= this.effectiveEnergyCost;
    },
    isInteractionMode() {
      return this.regionData.interactions && this.regionData.interactions.length > 0;
    },
    currentInteraction() {
      if (this.isInteractionMode) {
        return this.regionData.interactions[this.interactionStep] || {};
      }
      return {};
    },
    dynamicExploreButtonText() {
      return this.regionData.exploreButtonText || 'Explorer';
    },
    dynamicCloseButtonText() {
      return this.regionData.closeButtonText || 'Fermer';
    },
    dynamicNextButtonText() {
      return this.regionData.nextButtonText || 'Suivant';
    },
    defaultRegionDescription() {
      return this.regionData.defaultDescription || "Une région mystérieuse à explorer...";
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
    getDefaultNpcConfig() {
      // Cette configuration pourrait être remplacée par un appel à un service de configuration
      return {
        npcImage: 'npc1.png',
        npcPosition: 'left',
        dialogContent: ['Bienvenue, explorateur ! Bienvenue dans cette région.'],
        actionButtonText: 'Commencer à crafter',
        energyCost: 2
      };
    },
    resolveNpcImage(imageName) {
      if (!imageName) return '';
      // Choix de dossier dynamique selon le préfixe de l'image
      if (imageName.startsWith('boss-')) {
        return require(`@/assets/explorer-boss/${imageName}`);
      } else {
        return require(`@/assets/npcs/${imageName}`);
      }
    },
    getSpeakerIndicator(position) {
      // On peut ici récupérer dynamiquement le nom du speaker depuis regionData ou un service de config
      if (position === 'left') {
        return this.regionData.leftSpeakerName || 'Sage de la forêt:';
      } else {
        return this.regionData.rightSpeakerName || 'Apprenti de la rivière:';
      }
    },
    startExploring() {
      this.showIntro = false;
      this.hasExploredOnce = true;
      this.dialogStep = 0;
      this.interactionStep = 0;
    },
    nextStep() {
      if (this.dialogStep < this.effectiveDialogContent.length - 1) {
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
        // Message d'erreur dynamique : peut être remplacé par un message provenant d'un service de config
        alert(this.regionData.insufficientEnergyMessage || 'Énergie insuffisante ! Attendez que votre énergie se régénère ou achetez-en plus.');
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
