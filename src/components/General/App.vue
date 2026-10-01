<template>
  <div :class="['oc-app', { 'oc-app--multi': slotCount > 2, 'oc-app--explorer': isExplorerActive, 'oc-app--trial': isTimerActive && timerQuestion?.text }]" id="game-container">
    <LivingBackground ref="background" :era="era" :population="population" :palette="palette" />

    <div class="oc-app__shell">
      <AppHeader :found="discoveredCount" :total="totalElements" :eraLabel="eraLabel" :coins="coins" :timerActive="isTimerActive">
        <template #timer>
          <TimerModeButton
            ref="timerModeButton"
            :showTrigger="false"
            @timer-state-change="handleTimerStateChange"
            @timer-complete="handleTimerComplete"
            @show-question="showCurrentTimerQuestion"
            @force-stop="handleTimerForceStop"
          />
        </template>
        <template #actions>
          <!-- Raccourcis PC ; sur mobile, ils sont dans le menu du sceau -->
          <button type="button" class="g-icon-btn oc-desk-only" aria-label="Codex des succès" @click="showCodex = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 3h11l3 3v15H5z"></path><path d="M9 8h6M9 12h6M9 16h3"></path></svg>
          </button>
          <button type="button" class="g-icon-btn oc-desk-only" aria-label="Écrire aux créateurs" @click="showContact = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 6h18v12H3z"></path><path d="M3 6l9 7 9-7"></path></svg>
          </button>
          <AccountMenu
            ref="accountMenu"
            :isLoggedIn="isLoggedIn"
            :currentUser="currentUser"
            :shares="sigilShares"
            :rings="rings"
            :worn="worn"
            :eraLabel="eraLabel"
            :compact="isTimerActive"
            @open-sceau="showSceau = true"
            @open-cabinet="handleOpenCustomizeModal"
            @open-codex="showCodex = true"
            @open-contact="showContact = true"
            @logout="handleLogout"
          />
        </template>
        <template #modes>
          <ModeSwitcher :current="currentMode" @select="handleModeSelect" />
        </template>
      </AppHeader>

      <main id="main-content" ref="mainContent" class="oc-app__main" v-show="!isExplorerActive">
        <div class="oc-app__inventory">
          <GameInventory
            :categories="categories"
            :discoveredElements="discoveredElements"
            :elementEmojis="elementEmojis"
            :isTimerMode="isTimerActive"
            :freshElement="freshElement"
            :unexplored="unexplored"
            @selectResource="handleResourceSelection"
            @inspect="inspected = $event"
            @hint="useInfiniteHint"
          />
        </div>
        <div class="oc-app__craft">
          <TimerBrief
            v-if="isTimerActive && timerQuestion?.text"
            :question="timerQuestion"
            :inventory="discoveredElements"
            :recipes="craftingRecipes"
            :coins="coins"
            :freeJokers="freeJokers"
            @joker="useJoker"
          />
          <CraftZone
            ref="craftZone"
            :slotCount="slotCount"
            :craftingRecipes="craftingRecipes"
            :elementEmojis="elementEmojis"
            :discoveredElements="discoveredElements"
            @craft-success="handleCraftSuccess"
            @discovery="handleDiscovery"
            @show-alert="showAlert"
            @revealing="isRevealing = $event"
          />
        </div>
      </main>
    </div>
    <GameAchievementsPopup
      v-if="achievementQueue.length && !isRevealing"
      :key="achievementQueue[0].name"
      :achievement="achievementQueue[0]"
      @close="closeAchievementPopup"
      @achievement-popup-opened="handleAchievementPopupOpened"
    />
    <GModal
      v-if="showTimerEndModal"
      eyebrow="Le sablier est vide"
      title="Temps écoulé"
      align="center"
      :width="480"
      @close="handleTimerEndModalClose"
    >
      <div class="timer-end">
        <div class="timer-end__stat"><span class="g-display timer-end__big">{{ timerModeDiscoveries }}</span><span class="g-mono">réussies</span></div>
        <div class="timer-end__stat"><span class="g-display timer-end__big g-gold">{{ timerProgress.bestScores?.[selectedTimerLevel] || 0 }}</span><span class="g-mono">record</span></div>
      </div>
      <p v-if="selectedTimerLevel" class="g-italic">Niveau {{ selectedTimerLevel }}</p>
      <template #actions>
        <button type="button" class="g-btn" @click="handleTimerEndModalClose">Retour au registre</button>
      </template>
    </GModal>
    <ElementSheet
      v-if="inspected"
      :name="inspected"
      :emoji="elementEmojis[inspected]"
      :family="familyOf(inspected)"
      :origins="knownOrigins(craftingRecipes, discoveredElements, inspected)"
      :pending="unexplored[inspected] || 0"
      @close="inspected = null"
      @use="inspected = null; handleResourceSelection($event)"
    />
    <ResetPasswordModal
      v-if="resetToken"
      :token="resetToken"
      @close="resetToken = null"
      @login="resetToken = null; $refs.accountMenu.openSeuil()"
    />
    <ContactModal v-if="showContact" @close="showContact = false" />
    <CodexModal v-if="showCodex" :achievements="achievements" @close="showCodex = false" />
    <SceauModal
      v-if="showSceau"
      :username="currentUser?.username || currentUser?.email || 'Alchimiste'"
      :eraLabel="eraLabel"
      :families="familyShares.filter(f => f.share > 0)"
      :rings="rings"
      :worn="worn"
      :found="discoveredCount"
      :total="totalElements"
      :unlocked="unlockedAchievements"
      :achievementsTotal="achievements.length"
      :bestScores="timerProgress.bestScores || {}"
      @close="showSceau = false"
      @open-codex="showSceau = false; showCodex = true"
      @logout="handleLogout"
    />
    <TimerQuestions 
      v-show="isTimerActive && !isExplorerActive"
      ref="timerQuestions"
      :isLoggedIn="isLoggedIn"
      :discoveredElements="discoveredElements"
      @reset-timer="handleTimerReset"
      @show-level-selection="showLevelSelection"
      @pause-timer="handleTimerPause"
      @resume-timer="handleTimerResume"
      @stop-timer="handleTimerStop"
      @set-initial-inventory="handleSetInitialInventory"
      @reset-craft-zone="handleResetCraftZone"
      @level-selected="handleLevelSelected"
      @coins-earned="handleCoinsEarned"
      @add-recipes="craftingRecipes = { ...craftingRecipes, ...$event }"
      @add-emojis="elementEmojis = { ...$event, ...elementEmojis }"
      @timer-progress-updated="timerProgress = $event"
      @question-changed="timerQuestion = $event"
    />
    <CustomizeModal 
      v-if="isCustomizeModalOpen" 
      :currentFrame="selectedFrame"
      :currentAvatar="selectedAvatar"
      :userCoins="coins"
      :shares="sigilShares"
      :rings="rings"
      @close="handleCloseCustomizeModal" 
      @save="handleSaveCustomization"
      @coins-updated="handleCoinsUpdated" 
    />
    <ExplorerMap
      v-if="isExplorerActive"
      :active="isExplorerActive"
      :userCoins="coins"
      :craftingRecipes="craftingRecipes"
      :elementEmojis="elementEmojis"
      :discoveredElements="discoveredElements"
      @close="deactivateExplorerMode"
      @coins-updated="handleCoinsUpdated"
      @show-alert="showAlert"
    />
  </div>
</template>

<script>
import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import achievementsService from '@/services/achievementsService';
import gameDataService from '@/services/gameDataService';
import { findNewlyUnlocked } from '@/utils/achievementChecker';
import { BASE_ELEMENTS, BASE_CATEGORY } from '@/utils/gameConstants';
import timerService from '@/services/timerService';
import customizationService from '@/services/customizationService';
import coinsService from '@/services/coinsService';
import notificationService from '@/services/notificationService';
import ContactModal from '../Header/ContactModal.vue';
import GameAchievementsPopup from '../Achievements/GameAchievementsPopup.vue';
import GameInventory from '../Inventory/GameInventory.vue';
import CodexModal from '../Achievements/CodexModal.vue';
import AccountMenu from '../Account/AccountMenu.vue';
import SceauModal from '../Account/SceauModal.vue';
import GModal from '../ui/GModal.vue';
import { ringsFor } from '@/utils/sigil';
import { roman } from '@/utils/roman';
import TimerModeButton from '../TimerMode/TimerModeButton.vue';
import TimerQuestions from '../TimerMode/TimerQuestions.vue';
import TimerBrief from '../TimerMode/TimerBrief.vue';
import ElementSheet from '../Inventory/ElementSheet.vue';
import ResetPasswordModal from '../Account/ResetPasswordModal.vue';
import { FREE_JOKERS, JOKER_PRICE, JOKER_TIME, knownOrigins, nearbyDiscoveries, unexploredUses } from '@/utils/hints';
import CustomizeModal from '../Header/CustomizeModal.vue';
import ExplorerMap from '../Explorer/ExplorerMap.vue';
import AppHeader from '../Game/AppHeader.vue';
import ModeSwitcher from '../Game/ModeSwitcher.vue';
import CraftZone from '../Game/CraftZone.vue';
import LivingBackground from '../Game/LivingBackground.vue';
import { ERA_NAMES, familyColor, discoveredFamilies, eraOf, slotCountForEra, stageOf, populationFor } from '@/utils/eras';

// Lit le jeton de réinitialisation dans l'adresse puis l'efface (historique, partage d'écran)
function takeResetToken() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('reset');
  if (!token) return null;
  url.searchParams.delete('reset');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export default {
  name: 'App',
  components: {
    AppHeader,
    ModeSwitcher,
    CraftZone,
    LivingBackground,
    ContactModal,
    GameAchievementsPopup,
    GameInventory,
    CodexModal,
    AccountMenu,
    SceauModal,
    GModal,
    TimerModeButton,
    TimerQuestions,
    TimerBrief,
    ElementSheet,
    ResetPasswordModal,
    CustomizeModal,
    ExplorerMap
  },
  data() {
    return {
      // Éléments de base affichés tout de suite, avant la réponse du serveur
      elementEmojis: { Eau: '💧', Feu: '🔥', Terre: '🌎', Air: '💨' },
      craftingRecipes: {},
      categories: { [BASE_CATEGORY]: [...BASE_ELEMENTS] },
      discoveredCategories: [BASE_CATEGORY],
      discoveredElements: [...BASE_ELEMENTS],
      achievements: [],
      saveInterval: null,
      explorerEnergy: null,
      explorerLastUpdate: null,
      // Succès débloqués en attente d'affichage (un popup à la fois)
      achievementQueue: [],
      // Dernière découverte, mise en valeur dans l'inventaire
      freshElement: null,
      // Révélation d'une création en cours : les popups de succès attendent
      isRevealing: false,
      isLoggedIn: false,
      currentUser: null,
      categoryProgress: {},
      showCodex: false,
      showContact: false,
      showSceau: false,
      isTimerActive: false,
      isExplorerActive: false,
      showTimerEndModal: false,
      timerModeDiscoveries: 0,
      // Inventaire Infini mis de côté pendant une session Timer (null hors Timer)
      timerSnapshot: null,
      currentTimerElements: [],
      selectedTimerLevel: null,
      coins: parseInt(localStorage.getItem('coins')) || 0,
      // Épreuve : question affichée en consigne, jokers offerts restants
      timerQuestion: null,
      freeJokers: FREE_JOKERS,
      // Élément dont la fiche est ouverte
      inspected: null,
      // Jeton du lien « mot de passe oublié » (?reset=…)
      resetToken: takeResetToken(),
      timerProgress: {
        completedQuestions: {
          Facile: {},
          Moyen: {},
          Difficile: {}
        },
        unlockedCategories: {
          Facile: [],
          Moyen: [],
          Difficile: []
        },
        bestScores: {
          Facile: 0,
          Moyen: 0,
          Difficile: 0
        },
        lastPlayedLevel: null,
        lastPlayedCategory: null
      },
      isCustomizeModalOpen: false,
      selectedFrame: 'basicCadre.png',
      selectedAvatar: 'coin.png'
    };
  },
  async created() {
  this.checkAuth();
  // Le contenu du jeu est public : on joue sans compte (mode invité, sans sauvegarde)
  const progress = this.isLoggedIn ? this.loadGameProgress().catch(() => {}) : null;
  await Promise.all([this.loadGameContent(), progress]);
  await this.loadAchievements();
  // Désormais, un changement d'ère vient d'une découverte (pas du chargement)
  this.progressReady = true;
  if (this.isLoggedIn) {
    this.loadSavedCustomization();
    // Démarrer la sauvegarde périodique
    this.startPeriodicSave();
  }
},
computed: {
  currentMode() {
    if (this.isExplorerActive) return 'explorer';
    return this.isTimerActive ? 'timer' : 'infinite';
  },
  // La progression (ère, fond) suit toujours l'inventaire Infini, même pendant un Timer
  infiniteElements() {
    return this.timerSnapshot ? this.timerSnapshot.elements : this.discoveredElements;
  },
  families() {
    return discoveredFamilies(this.categories, this.infiniteElements);
  },
  // Ère affichée et fond vivant : lente, au fil des découvertes
  era() {
    return stageOf(this.discoveredCount);
  },
  // Recettes encore inexplorées par élément découvert (Registre et fiches)
  unexplored() {
    return this.isTimerActive ? {} : unexploredUses(this.craftingRecipes, this.discoveredElements);
  },
  // Pièces du Cabinet portées sur le sceau
  worn() {
    return { frame: this.selectedFrame, emblem: this.selectedAvatar };
  },
  eraLabel() {
    return `Ère ${roman(this.era)} · ${ERA_NAMES[this.era - 1]}`;
  },
  // Part découverte de chaque famille, dans l'ordre du registre (sceau du joueur)
  familyShares() {
    const found = new Set(this.infiniteElements);
    return Object.entries(this.categories).map(([name, elements]) => ({
      name,
      share: elements.length ? elements.filter(e => found.has(e)).length / elements.length : 0
    }));
  },
  sigilShares() {
    return this.familyShares.map(f => f.share);
  },
  unlockedAchievements() {
    return this.achievements.filter(a => a.unlocked).length;
  },
  rings() {
    return ringsFor(this.unlockedAchievements);
  },
  // Emplacements de fusion : 4 en Timer, sinon débloqués au fil des ères
  slotCount() {
    return this.isTimerActive ? 4 : slotCountForEra(eraOf(this.families.length));
  },
  totalElements() {
    return new Set(Object.values(this.categories).flat()).size;
  },
  discoveredCount() {
    return new Set(this.infiniteElements).size;
  },
  population() {
    return populationFor(this.discoveredCount);
  },
  palette() {
    return this.families.map(familyColor);
  }
},
watch: {
  // Un emplacement de plus : on le dit (hors Timer, où il y en a toujours 4)
  slotCount(next, previous) {
    if (this.progressReady && !this.timerSnapshot && !this.isTimerActive && next > previous) {
      this.showAlert('Nouvel emplacement de fusion débloqué !');
    }
  }
},
beforeUnmount() {
  clearInterval(this.saveInterval);
  
  // Sauvegarde finale avant de quitter
  if (this.isLoggedIn) {
    this.saveGameProgress();
  }
},
  methods: {
    loadSavedCustomization() {
      if (this.isLoggedIn) {
        const savedCustomization = localStorage.getItem('userCustomization');
        if (savedCustomization) {
          try {
            const customization = JSON.parse(savedCustomization);
            this.selectedFrame = customization.frame || 'basicCadre.png';
            this.selectedAvatar = customization.avatar || 'coin.png';
          } catch (error) {
            console.error("Erreur lors du chargement de la personnalisation:", error);
          }
        }
        // Le Cabinet enregistre les pièces portées sur le serveur : elles suivent le compte d'un appareil à l'autre
        customizationService.getUserSelections().then(({ selectedFrame, selectedAvatar } = {}) => {
          if (selectedFrame) this.selectedFrame = selectedFrame;
          if (selectedAvatar) this.selectedAvatar = selectedAvatar;
        }).catch(() => {});
      } else {
        this.selectedFrame = 'basicCadre.png';
        this.selectedAvatar = 'coin.png';
      }
    },
    showLevelSelection() {
    // Cette méthode va réafficher le menu de sélection de difficulté
    if (this.$refs.timerModeButton) {
      this.$refs.timerModeButton.showLevelSelection();
    }
  },

    async activateExplorerMode() {
      // L'Explorer (énergie, régions) est stocké côté serveur : compte requis
      if (!this.isLoggedIn) {
        this.showAlert('Connecte-toi pour jouer au mode Explorer.');
        return;
      }
      try {
        // Désactiver le mode Timer si actif
        if (this.isTimerActive) {
          this.isTimerActive = false;
          if (this.$refs.timerModeButton) {
            this.$refs.timerModeButton.stopTimer();
          }
          if (this.$refs.timerQuestions) {
            this.$refs.timerQuestions.resetQuestions();
          }
        }
        
        // Activer le mode Explorer
        this.isExplorerActive = true;
        
        this.resetCraftBoard();
      } catch (error) {
        console.error("Erreur lors de l'activation du mode Explorer :", error);
      }
    },

    saveDiscoveredElement(element, gameMode = 'infinite') {
  // Vérifier que l'élément n'est pas déjà dans la liste spécifique au mode
  let elementsList;
  
  if (gameMode === 'timer') {
    // Pour le mode Timer, utiliser la liste timerElements
    if (!this.currentTimerElements.includes(element)) {
      this.currentTimerElements.push(element);
      elementsList = this.currentTimerElements;
    } else {
      return; // Déjà dans la liste
    }
  } else if (gameMode === 'explorer') {
    // Pour le mode Explorer
    if (!this.discoveredElements.includes(element)) {
      this.discoveredElements.push(element);
      elementsList = this.discoveredElements;
    } else {
      return; // Déjà dans la liste
    }
  } else {
    // Mode Infinite (par défaut)
    if (!this.discoveredElements.includes(element)) {
      this.discoveredElements.push(element);
      
      // Déterminer la catégorie de l'élément
      const targetCategory = Object.keys(this.categories).find((category) =>
        this.categories[category].includes(element)
      );
      
      // Ajouter la catégorie si elle n'existe pas déjà
      if (targetCategory && !this.discoveredCategories.includes(targetCategory)) {
        console.log(`Ajout de la catégorie: ${targetCategory}`);
        this.discoveredCategories.push(targetCategory);
      }
      
      // Mettre à jour les statistiques de progression des catégories
      this.updateCategoryProgress();
      
      elementsList = this.discoveredElements;
    } else {
      return; // Déjà dans la liste
    }
  }
  
  // Sauvegarder dans localStorage uniquement en mode infinite
  if (gameMode === 'infinite') {
    localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
    localStorage.setItem('discoveredCategories', JSON.stringify(this.discoveredCategories));
    this.checkAchievements();
  }
  
  // Sauvegarder dans la base de données si connecté, en utilisant la bonne API
  if (this.isLoggedIn) {
    progressService.updateDiscoveredElements(elementsList, gameMode)
      .then(() => {
        console.log(`Élément ${element} sauvegardé avec succès (mode: ${gameMode})`);
        
        // Sauvegarder également les catégories uniquement en mode infinite
        if (gameMode === 'infinite') {
          this.saveGameProgress();
        }
        
      })
      .catch(error => {
        console.error(`Erreur lors de la sauvegarde de l'élément ${element}:`, error);
      });
  }
},

    // Méthode pour désactiver le mode Explorer
    deactivateExplorerMode() {
      this.isExplorerActive = false;
    },

    handleCoinsUpdated(newCoins) {
      this.coins = newCoins;
      // Sauvegarder en localStorage aussi
      localStorage.setItem('coins', newCoins.toString());
    },
    handleInfiniteModeActivation() {
      // Arrêter le Timer : handleTimerStateChange(false) restaure l'inventaire Infini
      if (this.isTimerActive && this.$refs.timerModeButton) {
        this.$refs.timerModeButton.confirmStopTimer();
      }
      this.isExplorerActive = false;
      this.resetCraftBoard();
    },
    handleLevelSelected(levelData) {
      this.selectedTimerLevel = levelData.level;
      this.freeJokers = FREE_JOKERS;
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.handleLevelSelected(levelData);
      }
    },

    handleTimerPause() {
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.pauseTimer();
      }
    },

    handleTimerResume() {
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.resumeTimer();
      }
    },

    handleTimerStop() {
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.confirmStopTimer();
      }
    },

    startPeriodicSave() {
  if (this.saveInterval) {
    clearInterval(this.saveInterval);
  }
  
  // Augmenter l'intervalle à 10 minutes au lieu de 2
  this.saveInterval = setInterval(() => {
    if (this.isLoggedIn) {
      // Vérifier s'il y a des changements à sauvegarder
      const currentGameState = JSON.stringify({
        elements: this.discoveredElements,
        categories: this.discoveredCategories,
        coins: this.coins
      });
      
      // Stocker l'état actuel pour comparaison future
      const previousState = localStorage.getItem('previousGameState');
      
      // Ne sauvegarder que si l'état a changé
      if (previousState !== currentGameState) {
        console.log('Changements détectés, sauvegarde périodique...');
        localStorage.setItem('previousGameState', currentGameState);
        this.saveGameProgress();
      } else {
        console.log('Aucun changement, sauvegarde périodique ignorée.');
      }
    }
  }, 600000); // 10 minutes au lieu de 2
},

    handleResetCraftZone() {
      this.resetCraftBoard();
    },
    handleSetInitialInventory(elements) {
  if (!this.isTimerActive) return;
  
  this.resetCraftBoard();
  
  // Réinitialiser à juste les éléments fondamentaux
  this.discoveredElements = [...BASE_ELEMENTS];
  
  if (Array.isArray(elements)) {
    // Ajouter les éléments requis pour cette question à l'inventaire temporaire
    this.currentTimerElements = [...new Set(elements)];
    this.currentTimerElements.forEach(element => {
      if (!this.discoveredElements.includes(element)) {
        this.discoveredElements.push(element);
      }
    });
    
    // Sauvegarde non bloquante des éléments de la question
    if (this.isLoggedIn) {
      timerService.saveTimerElements(this.currentTimerElements)
        .catch(error => console.warn('Erreur non bloquante lors de la sauvegarde des éléments Timer:', error));
    }
  }
  
  this.updateCategoryProgress();
},


handleTimerForceStop() {
  this.isTimerActive = false;
  this.selectedTimerLevel = null;
  this.exitTimerMode();
  this.timerModeDiscoveries = 0;
  
  if (this.$refs.timerQuestions) {
    this.$refs.timerQuestions.resetQuestions();
  }
},


    showCurrentTimerQuestion() {
      if (this.$refs.timerQuestions) {
        this.$refs.timerQuestions.show();
      }
    },
    loadGameProgress() {
  if (!this.isLoggedIn) return Promise.resolve();

  // Variables pour suivre les chargements
  if (!this._lastLoadTimestamp) {
    this._lastLoadTimestamp = 0;
    this._progressCache = null;
  }

  // Eviter les chargements trop fréquents (pas plus d'une fois toutes les 30 secondes)
  const now = Date.now();
  if (this._progressCache && now - this._lastLoadTimestamp < 30000) {
    console.log('Utilisation du cache pour loadGameProgress');
    return Promise.resolve(this._progressCache);
  }

  try {
    return progressService.loadGameProgress()
      .then(progress => {
        // Mettre à jour le cache
        this._lastLoadTimestamp = now;
        this._progressCache = progress;

        if (progress) {
          if (progress.coins !== undefined) {
            this.coins = parseInt(progress.coins);
            localStorage.setItem('coins', this.coins.toString());
          }

          if (progress.discoveredElements) {
            try {
              let elementsToSet = [];
              
              if (typeof progress.discoveredElements === 'string') {
                const parsed = JSON.parse(progress.discoveredElements);
                elementsToSet = Array.isArray(parsed) 
                  ? parsed.map(element => element.replace(/^"|"$/g, ''))
                  : [...BASE_ELEMENTS];
              } else if (Array.isArray(progress.discoveredElements)) {
                elementsToSet = progress.discoveredElements;
              } else {
                console.warn('DEBUG - Format des éléments découverts invalide');
                elementsToSet = [...BASE_ELEMENTS];
              }

              // Session Timer en cours : la progression chargée va dans l'inventaire mis de côté
              if (this.timerSnapshot) {
                this.timerSnapshot.elements = elementsToSet;
              } else {
                this.discoveredElements = elementsToSet;
              }
              localStorage.setItem('discoveredElements', JSON.stringify(elementsToSet));
            } catch (e) {
              console.error("DEBUG - Erreur parsing discoveredElements:", e);
              this.discoveredElements = [...BASE_ELEMENTS];
            }
          } else {
            console.warn('DEBUG - Aucun élément découvert dans la progression');
            this.discoveredElements = [...BASE_ELEMENTS];
          }

          if (progress.discoveredCategories) {
            try {
              let categoriesToSet = [];
              
              if (typeof progress.discoveredCategories === 'string') {
                const parsed = JSON.parse(progress.discoveredCategories);
                categoriesToSet = Array.isArray(parsed)
                  ? parsed.map(cat => cat.replace(/^"|"$/g, ''))
                  : [BASE_CATEGORY];
              } else if (Array.isArray(progress.discoveredCategories)) {
                categoriesToSet = progress.discoveredCategories;
              } else {
                console.warn('DEBUG - Format des catégories découvertes invalide');
                categoriesToSet = [BASE_CATEGORY];
              }

              if (this.timerSnapshot) {
                this.timerSnapshot.categories = categoriesToSet;
              } else {
                this.discoveredCategories = categoriesToSet;
              }
              localStorage.setItem('discoveredCategories', JSON.stringify(categoriesToSet));
            } catch (e) {
              console.error("DEBUG - Erreur parsing discoveredCategories:", e);
              this.discoveredCategories = [BASE_CATEGORY];
            }
          } else {
            console.warn('DEBUG - Aucune catégorie découverte dans la progression');
            this.discoveredCategories = [BASE_CATEGORY];
          }

          if (progress.categoryProgress) {
            try {
              this.categoryProgress = typeof progress.categoryProgress === 'string'
                ? JSON.parse(progress.categoryProgress)
                : progress.categoryProgress;
            } catch (e) {
              console.error("DEBUG - Erreur parsing categoryProgress:", e);
              this.categoryProgress = {};
            }
          }

          if (progress.timerProgress) {
            this.timerProgress = progress.timerProgress;
          }

          if (progress.customization) {
            this.selectedFrame = progress.customization.frame || 'basicCadre.png';
            this.selectedAvatar = progress.customization.avatar || 'coin.png';
            
            localStorage.setItem('userCustomization', JSON.stringify({
              frame: this.selectedFrame,
              avatar: this.selectedAvatar
            }));
          }

          if (this.categories && Object.keys(this.categories).length > 0) {
            this.repairGameData();
          } else {
            setTimeout(() => {
              if (this.categories && Object.keys(this.categories).length > 0) {
                this.repairGameData();
              }
            }, 2000);
          }

          this.updateCategoryProgress();
        }
        
        return progress;
      })
      .catch(error => {
        console.error("Erreur lors du chargement de la progression:", error);
        
        const localElements = localStorage.getItem('discoveredElements');
        const localCategories = localStorage.getItem('discoveredCategories');
        
        console.log('DEBUG - Fallback sur localStorage:', {
          localElements,
          localCategories
        });
        
        if (localElements) {
          try {
            this.discoveredElements = JSON.parse(localElements);
          } catch (e) {
            console.error('DEBUG - Erreur parsing localStorage elements:', e);
            this.discoveredElements = [...BASE_ELEMENTS];
          }
        } else {
          this.discoveredElements = [...BASE_ELEMENTS];
        }
        
        if (localCategories) {
          try {
            this.discoveredCategories = JSON.parse(localCategories);
          } catch (e) {
            console.error('DEBUG - Erreur parsing localStorage categories:', e);
            this.discoveredCategories = [BASE_CATEGORY];
          }
        } else {
          this.discoveredCategories = [BASE_CATEGORY];
        }

        this.categoryProgress = {};
        this.coins = parseInt(localStorage.getItem('coins')) || 0;
        this.timerProgress = {
          completedQuestions: { Facile: {}, Moyen: {}, Difficile: {} },
          unlockedCategories: {},
          bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
        };
        this.selectedFrame = 'basicCadre.png';
        this.selectedAvatar = 'coin.png';
        
        throw error;
      });
  } catch (error) {
    console.error("Erreur lors du chargement de la progression:", error);
    this.discoveredElements = [...BASE_ELEMENTS];
    this.discoveredCategories = [BASE_CATEGORY];
    this.categoryProgress = {};
    this.coins = 0;
    localStorage.setItem('coins', '0');
    this.timerProgress = {
      completedQuestions: { Facile: {}, Moyen: {}, Difficile: {} },
      unlockedCategories: {},
      bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
    };
    this.selectedFrame = 'basicCadre.png';
    this.selectedAvatar = 'coin.png';
    
    return Promise.reject(error);
  }
},

saveGameProgress() {
  if (!this.isLoggedIn) return;

  try {
    // En mode Timer, on sauvegarde l'inventaire Infini mis de côté, pas l'inventaire temporaire
    const elements = this.timerSnapshot ? this.timerSnapshot.elements : this.discoveredElements;
    const categories = this.timerSnapshot ? this.timerSnapshot.categories : this.discoveredCategories;
    const progressData = {
      discoveredElements: Array.isArray(elements) 
        ? elements 
        : [...BASE_ELEMENTS],
      discoveredCategories: Array.isArray(categories)
        ? categories
        : [BASE_CATEGORY],
      categoryProgress: this.categoryProgress || {},
      coins: this.coins,
      timerProgress: this.timerProgress,
      customization: {
        frame: this.selectedFrame,
        avatar: this.selectedAvatar
      }
    };

    // Sauvegarder dans localStorage pour récupération rapide
    localStorage.setItem('discoveredElements', JSON.stringify(progressData.discoveredElements));
    localStorage.setItem('discoveredCategories', JSON.stringify(progressData.discoveredCategories));

    // Sauvegarder dans la base de données
    return progressService.saveGameProgress(progressData);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la progression:", error);
    return Promise.reject(error);
  }
},


    updateCategoryProgress() {
      // Pendant une session Timer, la progression reflète l'inventaire Infini (recalculée à la sortie)
      if (this.timerSnapshot) return;
      Object.keys(this.categories).forEach(category => {
        const totalElements = this.categories[category].length;
        const discoveredCount = this.categories[category].filter(element => 
          this.discoveredElements.includes(element)
        ).length;
        this.categoryProgress[category] = (discoveredCount / totalElements) * 100;
      });
    },
    // Dans App.vue, méthode checkAuth()
checkAuth() {
  const loggedInUser = AuthService.getCurrentUser();
  
  if (loggedInUser && loggedInUser.token) {
    this.isLoggedIn = true;
    this.currentUser = loggedInUser;
    this.loadSavedCustomization();
  } else {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('user');
    
    this.coins = 0;
    localStorage.removeItem('coins');
    
    this.selectedFrame = 'basicCadre.png';
    this.selectedAvatar = 'coin.png';
  }
},
    async handleLogout() {
      // Envoyer la progression en attente tant que la session est valide
      await progressService.flush();
      await AuthService.logout();
      this.isLoggedIn = false;
      this.currentUser = null;
      window.location.reload();
    },
    handleDataLoaded(data) {
      // Fusion : conserve les emojis/recettes du Timer arrivés avant le contenu principal
      this.elementEmojis = { ...this.elementEmojis, ...data.elementEmojis };
      this.categories = data.categories;
      this.craftingRecipes = { ...this.craftingRecipes, ...data.craftingRecipes };
      this.updateCategoryProgress();
    },
    async loadGameContent() {
      try {
        this.handleDataLoaded(await gameDataService.loadGameContent());
      } catch (error) {
        console.error('Erreur lors du chargement du contenu du jeu:', error);
      }
    },
    async loadAchievements() {
      try {
        this.achievements = await achievementsService.loadAchievements();
        // Rattrapage : succès déjà mérités mais jamais enregistrés
        this.checkAchievements();
      } catch (error) {
        console.error('Erreur lors du chargement des succès:', error);
      }
    },
    // Seul point de vérification des succès : après une découverte en mode Infini
    checkAchievements() {
      const unlocked = findNewlyUnlocked(this.achievements, this.discoveredElements);
      if (!unlocked.length) return;
      const unlockedAt = new Date().toISOString();
      unlocked.forEach(achievement => {
        achievement.unlocked = true;
        achievement.unlockedAt = unlockedAt;
      });
      this.achievementQueue.push(...unlocked);
      if (this.isLoggedIn) {
        achievementsService.saveUnlocked(unlocked)
          .catch(error => console.error('Erreur lors de la sauvegarde des succès:', error));
      }
    },
    handleResourceSelection(resource, fromRect) {
      this.$refs.craftZone?.add(resource, fromRect);
    },
    // Nouvelle découverte : le fond vivant réagit, la carte s'illumine dans l'inventaire
    handleDiscovery({ name, x, y }) {
      this.$refs.background?.burst(x, y);
      this.freshElement = name;
    },
    handleModeSelect(mode) {
      if (mode === this.currentMode) return;
      if (mode === 'explorer') {
        this.activateExplorerMode();
      } else if (mode === 'timer') {
        this.isExplorerActive = false;
        this.$refs.timerModeButton?.startTimer();
      } else if (this.isTimerActive) {
        // Quitter le Timer perd la question en cours : on confirme d'abord
        this.$refs.timerModeButton?.requestStop();
      } else {
        this.handleInfiniteModeActivation();
      }
    },

handleCraftSuccess(craftedItem) {
  // Mode normal (ni Timer ni Explorer)
  if (!this.isTimerActive && !this.isExplorerActive) {
    // Sauvegarder l'élément découvert
    this.saveDiscoveredElement(craftedItem);
  }
  
  // Gestion du mode Timer
  if (this.isTimerActive) {
    // Ajouter à l'inventaire local de la session Timer
    if (!this.discoveredElements.includes(craftedItem)) {
      this.discoveredElements.push(craftedItem);
    }
    
    // Vérifier si l'élément fait partie des éléments initiaux de la question
    const currentQuestion = this.$refs.timerQuestions.getCurrentQuestion();
    const initialElements = [];
    
    if (currentQuestion && currentQuestion.initialElements) {
      initialElements.push(...(currentQuestion.initialElements.required || []));
      initialElements.push(...(currentQuestion.initialElements.additional || []));
    }
    
    // Ne sauvegarder dans timer_elements QUE si ce n'est pas un élément initial
    if (!initialElements.includes(craftedItem)) {
      // Ajouter aux éléments créés par l'utilisateur
      if (!this.currentTimerElements.includes(craftedItem)) {
        this.currentTimerElements.push(craftedItem);
        
        // Sauvegarder uniquement ce nouvel élément dans timer_elements
        if (this.isLoggedIn) {
          // Utiliser le service dédié au timer
          timerService.saveTimerElements([craftedItem])
            .then(() => {
              console.log(`Élément Timer ${craftedItem} sauvegardé avec succès`);
            })
            .catch(error => {
              console.error(`Erreur lors de la sauvegarde de l'élément Timer ${craftedItem}:`, error);
            });
        }
      }
    }
    
    if (currentQuestion) {
      const allPossibleElements = [
        ...(currentQuestion.initialElements.required || []),
        ...(currentQuestion.initialElements.additional || []),
        ...(currentQuestion.validAnswers || [])
      ];
      
      if (allPossibleElements.includes(craftedItem)) {
        console.log('L\'élément est dans les éléments possibles');
      }
      
      const validationMode = currentQuestion.initialElements.validationMode || 'any';
      const validAnswers = currentQuestion.validAnswers || [];
      
      if (validationMode === 'any') {
        const isValidAnswer = validAnswers.some(answer => 
          this.discoveredElements.includes(answer)
        );
        
        if (isValidAnswer) {
          this.timerModeDiscoveries++;
          this.$refs.timerQuestions.answerCorrect();
        }
      } else if (validationMode === 'multiple') {
        const requiredCount = currentQuestion.initialElements.requiredCount || 1;
        const discoveredValidAnswers = validAnswers.filter(answer => 
          this.discoveredElements.includes(answer)
        );
        
        if (discoveredValidAnswers.length >= requiredCount) {
          this.timerModeDiscoveries++;
          this.$refs.timerQuestions.answerCorrect();
        }
      } else {
        const isAllAnswersFound = validAnswers.every(answer => 
          this.discoveredElements.includes(answer)
        );
        
        if (isAllAnswersFound) {
          this.timerModeDiscoveries++;
          this.$refs.timerQuestions.answerCorrect();
        }
      }
    }
  }
},

    async repairGameData() {
      if (!this.isLoggedIn) return;
            
      const repairedCategories = [BASE_CATEGORY];
      
      for (const element of this.discoveredElements) {
        for (const category in this.categories) {
          if (this.categories[category] && this.categories[category].includes(element)) {
            if (!repairedCategories.includes(category)) {
              console.log(`Catégorie manquante détectée: ${category} pour l'élément ${element}`);
              repairedCategories.push(category);
            }
          }
        }
      }
      
      const currentCats = [...this.discoveredCategories].sort();
      const repairedCats = [...repairedCategories].sort();
      
      if (JSON.stringify(currentCats) !== JSON.stringify(repairedCats)) {
        
        this.discoveredCategories = repairedCategories;
        
        await this.saveGameProgress();
        console.log('Données réparées et sauvegardées avec succès');
      } else {
        console.log('Aucune réparation nécessaire, les données sont cohérentes');
      }
    },
    closeAchievementPopup() {
      this.achievementQueue.shift();
    },
    showAlert(message) {
      notificationService.info(message);
    },
    // Succès débloqué : une gerbe de particules au centre de l'écran
    handleAchievementPopupOpened() {
      this.$refs.background?.burst(window.innerWidth / 2, window.innerHeight / 2);
    },
    handleTimerStateChange(isActive) {
      // Le bouton Timer peut émettre plusieurs fois "true" : on n'agit que sur les transitions
      const wasActive = this.isTimerActive;
      
      // Désactiver le mode Explorer si on active le mode Timer
      if (isActive && this.isExplorerActive) {
        this.isExplorerActive = false;
      }
      
      this.isTimerActive = isActive;
  
      if (isActive && !wasActive) {
        this.resetCraftBoard();
        this.enterTimerMode();
        this.timerModeDiscoveries = 0;
        this.selectedTimerLevel = null;
        this.currentTimerElements = [];
        if (this.$refs.timerQuestions) {
          this.$refs.timerQuestions.show();
        }
      } else if (!isActive) {
        this.resetCraftBoard();
        // selectedTimerLevel est conservé pour le modal de fin (handleTimerComplete)
        this.exitTimerMode();
        this.currentTimerElements = [];
        if (this.$refs.timerQuestions) {
          this.$refs.timerQuestions.resetQuestions();
        }
      }
    },
    resetCraftBoard() {
      this.$refs.craftZone?.clear();
    },
    // Met de côté l'inventaire Infini au début d'une session Timer
    enterTimerMode() {
      if (this.timerSnapshot) return;
      this.timerSnapshot = {
        elements: [...this.discoveredElements],
        categories: [...this.discoveredCategories]
      };
    },
    // Restaure l'inventaire Infini à la fin d'une session Timer
    exitTimerMode() {
      if (!this.timerSnapshot) return;
      this.discoveredElements = this.timerSnapshot.elements;
      this.discoveredCategories = this.timerSnapshot.categories;
      this.timerSnapshot = null;
      this.updateCategoryProgress();
    },
    knownOrigins,
    familyOf(name) {
      const family = Object.keys(this.categories).find(key => this.categories[key].includes(name));
      return family ? family.replace(/_/g, ' ') : '';
    },
    // Piste de l'Infini (payante) : un élément inconnu qu'une seule fusion suffit à créer, sans sa recette
    async useInfiniteHint() {
      const near = nearbyDiscoveries(this.craftingRecipes, this.discoveredElements);
      if (!near.length) {
        this.showAlert('Aucune piste : il te faut d’abord de nouveaux éléments.');
        return;
      }
      if (this.coins < JOKER_PRICE) {
        this.showAlert(`Une piste coûte ${JOKER_PRICE} écus.`);
        return;
      }
      if (!(await this.changeCoins(-JOKER_PRICE, () => coinsService.spend('piste')))) return;
      const name = near[Math.floor(Math.random() * near.length)];
      this.showAlert(`Une piste : « ${name} » n’est qu’à une fusion de toi.`);
    },
    // Joker de l'Épreuve : un offert s'il en reste, sinon payé en écus (le bouton est désactivé sans les moyens)
    useJoker(kind) {
      if (this.freeJokers > 0) this.freeJokers--;
      else this.changeCoins(-JOKER_PRICE, () => coinsService.spend('joker'));
      if (kind === 'time') this.$refs.timerModeButton?.addTime(JOKER_TIME);
    },
    // Écus : un compte suit le solde du serveur (grand livre, `request` renvoie le nouveau solde) ;
    // un invité garde un solde local. Renvoie faux si le mouvement a été refusé.
    async changeCoins(amount, request) {
      if (!this.isLoggedIn) {
        this.handleCoinsUpdated(Math.max(0, this.coins + amount));
        return true;
      }
      try {
        this.handleCoinsUpdated(await request());
        return true;
      } catch (error) {
        this.showAlert(error.response?.data?.message || 'Les écus n’ont pas pu être mis à jour.');
        return false;
      }
    },
    // Question de l'Épreuve réussie pour la première fois
    handleCoinsEarned({ points, questionId }) {
      // Questions de secours locales (sans identifiant serveur) : rien à réclamer pour un compte
      if (this.isLoggedIn && !Number.isInteger(questionId)) return;
      this.changeCoins(points, () => coinsService.claimTimerQuestion(questionId));
    },
    async handleTimerComplete() {
  const currentScore = this.timerModeDiscoveries;
  
  if (this.selectedTimerLevel && currentScore > this.timerProgress.bestScores[this.selectedTimerLevel]) {
    this.timerProgress.bestScores[this.selectedTimerLevel] = currentScore;
    
    const bonus = currentScore * 5;
    await this.changeCoins(bonus, () => coinsService.claimTimerRecord(this.selectedTimerLevel, currentScore));
    
    if (this.isLoggedIn) {
      try {
        await progressService.updateTimerProgress(this.timerProgress);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du meilleur score:", error);
      }
    }
  }

  // Restaurer l'inventaire précédent (important!)
  this.exitTimerMode();
  
  this.showTimerEndModal = true;
},


    handleTimerEndModalClose() {
      this.showTimerEndModal = false;
      this.exitTimerMode();
      this.selectedTimerLevel = null;
      if (this.$refs.timerQuestions) {
        this.$refs.timerQuestions.resetQuestions();
      }
    },
    handleTimerReset() {
      this.$refs.timerModeButton.resetTimer();
    },
    handleOpenCustomizeModal() {
      this.isCustomizeModalOpen = true;
    },
    handleCloseCustomizeModal() {
      this.isCustomizeModalOpen = false;
    },
    handleSaveCustomization(customizationData) {
      this.selectedFrame = customizationData.frame;
      this.selectedAvatar = customizationData.avatar;
      
      // Sauvegarder dans localStorage
      localStorage.setItem('userCustomization', JSON.stringify({
        frame: this.selectedFrame,
        avatar: this.selectedAvatar
      }));
      
      // Si l'utilisateur est connecté, sauvegarder dans la base de données
      if (this.isLoggedIn) {
        this.saveGameProgress();
      }
      
      this.isCustomizeModalOpen = false;
    }
  }
};
</script>

<style>
/* Mise en page : PC en 2 colonnes (registre | Athanor), mobile en registre plein écran + dock */
.oc-app {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--oc-text);
  font-family: var(--oc-font-body);
}
.oc-app__shell {
  position: relative;
  z-index: 1;
  max-width: 1480px;
  margin: 0 auto;
  padding: 0 var(--oc-gutter) calc(var(--oc-dock-height) + 32px + env(safe-area-inset-bottom));
}
.oc-app__main { display: block; }
.oc-app__inventory { min-width: 0; }

@media (min-width: 860px) {
  .oc-app__shell { padding-bottom: 32px; }
  .oc-app__main {
    display: grid;
    /* La liste prend la place disponible et grandit avec les découvertes ; la zone reste à droite */
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 28px;
    align-items: start;
  }
  /* La zone reste en vue pendant qu'on fait défiler l'inventaire */
  .oc-app__craft { position: sticky; top: 16px; }
}

/* Fin d'épreuve (fenêtre de l'App) */
.timer-end { display: flex; gap: 48px; justify-content: center; }
.timer-end__stat { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.timer-end__big { font-size: 56px; line-height: 1; }

/* Expédition : pas de dock de création, donc pas de marge réservée en bas */
.oc-app--explorer .oc-app__shell { padding-bottom: 0; }

@media (max-width: 859px) {
  .oc-desk-only { display: none; }
  /* Dock sur 2 lignes (3–4 emplacements) : plus haut, la liste garde assez de marge en bas */
  .oc-app--multi { --oc-dock-height: 160px; }
  /* Épreuve : le bandeau de consigne s'ajoute au-dessus du dock */
  .oc-app--trial .oc-app__shell { padding-bottom: calc(var(--oc-dock-height) + 130px + env(safe-area-inset-bottom)); }
}
</style>

