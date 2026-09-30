<template>
  <GModal
    :width="showIntro ? 600 : 1040"
    :eyebrow="showIntro ? 'Rencontre' : ''"
    :title="showIntro ? (regionData.name || 'Région inconnue') : ''"
    :label="regionData.name || 'Rencontre'"
    @close="closeDialog"
  >
    <!-- Seuil de la région : description et progression -->
    <div v-if="showIntro" class="npc-intro">
      <p class="npc-intro__text">{{ regionData.description || defaultRegionDescription }}</p>
      <div v-if="regionData.progress !== undefined" class="npc-progress">
        <div class="npc-progress__row">
          <span class="g-mono">Progression</span>
          <span class="g-mono npc-progress__value">{{ regionData.progress }} %</span>
        </div>
        <div class="g-bar npc-progress__bar"><span :style="{ width: `${regionData.progress}%` }"></span></div>
      </div>
      <div class="npc-actions">
        <button type="button" class="g-btn g-btn--ghost" @click="closeDialog">{{ dynamicCloseButtonText }}</button>
        <button type="button" class="g-btn" @click="startExploring">{{ dynamicExploreButtonText }}</button>
      </div>
    </div>

    <!-- Rencontre : portrait et paroles -->
    <div v-else class="npc-scene" :class="{ 'npc-scene--reverse': speakerSide === 'right', 'npc-scene--boss': regionData.is_boss }">
      <figure class="npc-portrait">
        <div class="npc-portrait__frame">
          <img
            :src="resolveNpcImage(isInteractionMode ? currentInteraction.npcImage : effectiveNpcImage)"
            :alt="speakerName || 'Personnage'"
            class="npc-portrait__img"
          />
        </div>
        <figcaption v-if="speakerName" class="g-display npc-portrait__name">{{ speakerName }}</figcaption>
      </figure>

      <div class="npc-words">
        <span class="g-mono">
          {{ regionData.name || 'Région inconnue' }}<template v-if="regionData.progress !== undefined"> · progression {{ regionData.progress }} %</template>
        </span>
        <div v-if="regionData.progress !== undefined" class="g-bar npc-progress__bar">
          <span :style="{ width: `${regionData.progress}%` }"></span>
        </div>
        <blockquote class="g-italic npc-words__quote" aria-live="polite">
          <template v-if="isInteractionMode">« {{ currentInteraction.text }} »</template>
          <template v-else-if="dialogStep < effectiveDialogContent.length">« {{ effectiveDialogContent[dialogStep] }} »</template>
        </blockquote>

        <div class="npc-words__foot">
          <span class="g-mono">{{ stepLabel }}</span>
          <div class="npc-actions">
            <button type="button" class="g-btn g-btn--ghost" @click="closeDialog">{{ dynamicCloseButtonText }}</button>
            <button
              v-if="(isInteractionMode && interactionStep < regionData.interactions.length - 1) ||
                    (!isInteractionMode && dialogStep < effectiveDialogContent.length - 1)"
              type="button"
              class="g-btn"
              @click="isInteractionMode ? nextInteractionStep() : nextStep()"
            >
              {{ dynamicNextButtonText }}
            </button>
            <template v-else>
              <span
                v-if="showEnergyCost"
                class="g-mono npc-cost"
                :class="{ 'npc-cost--short': !canStartChallenge }"
              >
                {{ canStartChallenge ? `coûte ${effectiveEnergyCost} de souffle` : `souffle insuffisant · ${effectiveEnergyCost} requis` }}
              </span>
              <button
                type="button"
                class="g-btn"
                :class="{ 'g-btn--danger': regionData.is_boss }"
                :disabled="!canStartChallenge"
                @click="handleAction"
              >
                {{ effectiveActionButtonText }}
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </GModal>
</template>

<script>
import notificationService from '@/services/notificationService';
import GModal from '@/components/ui/GModal.vue';

export default {
  name: 'NpcDialog',
  components: { GModal },
  props: {
    npcImage: { type: String, default: null },
    npcPosition: { type: String, default: null },
    dialogContent: { type: Array, default: () => [] },
    regionData: { type: Object, default: () => ({}) },
    actionButtonText: { type: String, default: null },
    energyCost: { type: Number, default: null },
    currentEnergy: { type: Number, default: 0 }
  },
  emits: ['close', 'action'],
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
      return this.regionData.exploreButtonText || 'Entrer dans la région';
    },
    dynamicCloseButtonText() {
      return this.regionData.closeButtonText || 'Fermer';
    },
    dynamicNextButtonText() {
      return this.regionData.nextButtonText || 'Suivant';
    },
    // Côté du portrait, nom affiché et étape en cours (affichage seul)
    speakerSide() {
      return this.isInteractionMode ? this.currentInteraction.position : this.effectiveNpcPosition;
    },
    speakerName() {
      if (this.isInteractionMode) {
        return this.getSpeakerIndicator(this.currentInteraction.position).replace(/\s*:\s*$/, '');
      }
      return this.regionData.npcName || (this.regionData.is_boss ? 'Le gardien' : '');
    },
    stepLabel() {
      const total = this.isInteractionMode ? this.regionData.interactions.length : this.effectiveDialogContent.length;
      const step = this.isInteractionMode ? this.interactionStep : this.dialogStep;
      return `${Math.min(step + 1, total)} / ${total}`;
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
        actionButtonText: 'Accepter le défi',
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
        notificationService.warning(this.regionData.insufficientEnergyMessage || 'Souffle insuffisant : attends qu\'il revienne ou achètes-en dans le Carnet de route.');
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
.npc-intro { display: flex; flex-direction: column; gap: 20px; }
.npc-intro__text { margin: 0; font-size: 18px; line-height: 1.55; color: var(--oc-text); }

.npc-progress { display: flex; flex-direction: column; gap: 8px; }
.npc-progress__row { display: flex; justify-content: space-between; gap: 12px; }
.npc-progress__value { color: var(--oc-verdigris); }
.npc-progress__bar > span { background: var(--oc-verdigris); }

.npc-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 12px 14px;
}

/* Portrait à gauche (ou à droite selon la position du personnage), paroles à côté */
.npc-scene {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 36px;
}
.npc-scene--reverse { grid-template-columns: minmax(0, 1fr) 240px; }
.npc-scene--reverse .npc-portrait { order: 2; }

.npc-portrait {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.npc-portrait__frame {
  width: 100%;
  height: 280px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
  background: repeating-linear-gradient(135deg, rgba(233, 223, 200, 0.04) 0 2px, transparent 2px 10px);
}
.npc-scene--boss .npc-portrait__frame {
  box-shadow: inset 0 0 0 1px rgba(217, 118, 94, 0.45);
  background: repeating-linear-gradient(135deg, rgba(217, 118, 94, 0.05) 0 2px, transparent 2px 10px);
}
.npc-portrait__img { max-width: 100%; max-height: 100%; object-fit: contain; }
.npc-portrait__name { font-size: 20px; text-align: center; }

.npc-words { display: flex; flex-direction: column; gap: 16px; min-width: 0; }
.npc-words__quote {
  margin: 8px 0 0;
  font-size: 24px;
  line-height: 1.5;
  color: var(--oc-text-strong);
}
.npc-words__foot {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.npc-cost { color: var(--oc-gold); }
.npc-cost--short { color: var(--oc-danger); }

@media (max-width: 859px) {
  .npc-scene,
  .npc-scene--reverse { grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .npc-scene--reverse .npc-portrait { order: 0; }
  .npc-portrait { flex-direction: row; align-items: flex-end; }
  .npc-portrait__frame { width: 120px; height: 140px; flex-shrink: 0; }
  .npc-portrait__name { text-align: left; }
  .npc-words__quote { font-size: 20px; }
  .npc-actions { width: 100%; }
  .npc-actions .g-btn { flex: 1; }
  .npc-cost { width: 100%; text-align: right; }
}
</style>
