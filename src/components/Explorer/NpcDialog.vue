<template>
  <div class="npc-dialog-overlay" @click.self="closeDialog">
    <div class="npc-dialog-container">
      <!-- Cadre décoratif avec coins ornementés -->
      <div class="dialog-frame">
        <div class="frame-corner corner-tl">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-tl">✧</div>
        </div>
        <div class="frame-corner corner-tr">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-tr">✧</div>
        </div>
        <div class="frame-corner corner-bl">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-bl">✧</div>
        </div>
        <div class="frame-corner corner-br">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-br">✧</div>
        </div>
      </div>
      
      <!-- Affichage de l'introduction de la région -->
      <div v-if="showIntro" class="region-intro">
        <h3>{{ regionData.name || 'Region inconnue' }}</h3>
        <p>{{ regionData.description || defaultRegionDescription }}</p>
        
        <div class="region-progress" v-if="regionData.progress !== undefined">
          <div class="progress-label">Progression: {{ regionData.progress }}%</div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${regionData.progress}%` }">
              <!-- Particules animées dans la barre de progression -->
              <div class="particle particle-5"></div>
              <div class="particle particle-10"></div>
              <div class="particle particle-15"></div>
              <div class="particle particle-20"></div>
              <div class="particle particle-25"></div>
              <div class="particle particle-30"></div>
              <div class="particle particle-35"></div>
              <div class="particle particle-40"></div>
              <div class="particle particle-45"></div>
              <div class="particle particle-50"></div>
              <div class="particle particle-55"></div>
              <div class="particle particle-70"></div>
              <div class="particle particle-75"></div>
              <div class="particle particle-80"></div>
              <div class="particle particle-85"></div>
              <div class="particle particle-90"></div>
              <div class="particle particle-95"></div>
            </div>
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
              <span v-if="showEnergyCost" class="energy-cost">
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
      // Priorité pour trouver le coût d'énergie:
      // 1. Si c'est un boss (is_boss), alors coût = 0
      if (this.regionData && this.regionData.is_boss) {
        return 0;
      }
      
      // 2. Si la région a un coût défini dans ses propriétés
      if (this.regionData && this.regionData.energyCost !== undefined) {
        return this.regionData.energyCost;
      }
      
      // 3. Si un coût a été passé en prop
      if (this.energyCost !== null) {
        return this.energyCost;
      }
      
      // 4. Valeur par défaut
      return this.getDefaultNpcConfig().energyCost;
    },
    showEnergyCost() {
      // Ne pas afficher le coût d'énergie pour les boss ou si c'est 0
      return this.effectiveEnergyCost > 0;
    },
    canStartChallenge() {
      // Si le coût est 0 (par exemple pour un boss), on peut toujours commencer
      if (this.effectiveEnergyCost === 0) return true;
      
      // Sinon, vérifier qu'on a assez d'énergie
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
@import '@/assets/ComponentsStyle/ExplorerStyle/NpcDialogStyle.css';
</style>