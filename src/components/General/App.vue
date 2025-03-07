<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    <DataLoading
      ref="dataLoading"
      :isTimerMode="isTimerActive"
      @data-loaded="handleDataLoaded"
      @achievements-loaded="handleAchievementsLoaded"
      @achievement-unlocked="handleAchievementUnlocked"
    />
    <GameAchievementsContent 
      :achievements="achievements" 
      :forceReload="shouldForceReload" 
      @achievements-loaded="handleAchievementsLoaded" 
    />
    <header style="position: relative;">
      <div class="title-area">
        <img src="@/assets/Svgs/Logo.png" alt="Logo" class="logo" />
        <h1>Origins Creation</h1>
        <CoinCounter :coins="coins" />
      </div>
      <div class="header-controls">
        <DarkToggle :isDarkMode="isDarkMode" @update:darkMode="updateDarkMode" />
        <LoginIcon 
          :isDarkMode="isDarkMode" 
          :isLoggedIn="isLoggedIn"
          :currentUser="currentUser"
          :selectedFrame="selectedFrame"
          :selectedAvatar="selectedAvatar"
          @login-attempt="handleLoginAttempt"
          @register-attempt="handleRegisterAttempt"
          @logout="handleLogout"
          @open-customize-modal="handleOpenCustomizeModal"
        />
        <ContactIcon 
          :isDarkMode="isDarkMode"
          @open-contact="handleOpenContact"
        />
      </div>
      <InfiniteModeButton 
        @switch-to-infinite="handleInfiniteModeActivation" 
        :isTimerActive="isTimerActive" 
        :isExplorerActive="isExplorerActive" 
      />
      <ExplorerModeButton @click="activateExplorerMode" :isTimerActive="isTimerActive" :isExplorerActive="isExplorerActive" />
      <TimerModeButton 
        ref="timerModeButton"
        @timer-state-change="handleTimerStateChange"
        @timer-complete="handleTimerComplete"
        @show-question="showCurrentTimerQuestion"
        @force-stop="handleTimerForceStop"
        :isExplorerActive="isExplorerActive"
      />
    </header>
    <main id="main-content" ref="mainContent" v-show="!isExplorerActive">
      <div ref="inventory" class="inventory-wrapper">
        <GameInventory
          :categories="categories"
          :discoveredCategories="discoveredCategories"
          :discoveredElements="discoveredElements"
          :elementEmojis="elementEmojis"
          :isTimerMode="isTimerActive"
          :timerQuestionElements="currentTimerElements"
          @selectResource="handleResourceSelection"
        />
      </div>
      <GameSizer />
      <div ref="craftingBoard" class="crafting-board-wrapper">
        <CraftSystem
          :elementEmojis="elementEmojis"
          :craftingRecipes="craftingRecipes"
          :isDarkMode="isDarkMode"
          :isFireworkActive="isFireworkActive"
          @craft-success="handleCraftSuccess"
          @save-discovered-element="saveDiscoveredElement"
          @show-alert="showAlert"
          ref="craftSystem"
        />
      </div>
    </main>
    <CraftPopup
      v-if="!isExplorerActive && craftedElement.name"
      :craftedElement="craftedElement"
      :elementEmojis="elementEmojis"
      @reset-crafted-element="resetCraftedElement"
    />
    <GameAchievementsPopup
      v-if="newAchievement"
      :achievement="newAchievement"
      :achievements="achievements"
      @close="closeAchievementPopup"
      @achievement-popup-opened="handleAchievementPopupOpened"
    />
    <div v-if="showTimerEndModal" class="timer-end-modal">
      <div class="timer-end-content">
        <h2>Temps écoulé !</h2>
        <p>Vous avez découvert {{ timerModeDiscoveries }} éléments pendant la session.</p>
        <div class="timer-end-stats">
          <p>Éléments découverts : {{ discoveredElements.length - timerModeStartElements.length }}</p>
          <p>Meilleur score : {{ bestTimerScore }}</p>
          <p>Niveau : {{ selectedTimerLevel }}</p>
        </div>
        <button @click="handleTimerEndModalClose" class="timer-end-button">Nouvelle partie</button>
      </div>
    </div>
    <TimerQuestions 
      v-show="isTimerActive && !isExplorerActive"
      ref="timerQuestions"
      @reset-timer="handleTimerReset"
      @pause-timer="handleTimerPause"
      @resume-timer="handleTimerResume"
      @stop-timer="handleTimerStop"
      @set-initial-inventory="handleSetInitialInventory"
      @reset-craft-zone="handleResetCraftZone"
      @level-selected="handleLevelSelected"
      @coins-earned="handleCoinsEarned"
    />
    <CustomizeModal 
      v-if="isCustomizeModalOpen" 
      :currentFrame="selectedFrame"
      :currentAvatar="selectedAvatar"
      :userCoins="coins"
      @close="handleCloseCustomizeModal" 
      @save="handleSaveCustomization"
      @coins-updated="handleCoinsUpdated" 
    />
    <ExplorerMap 
      v-if="isExplorerActive"
      :userCoins="coins"
      @close="deactivateExplorerMode"
      @coins-updated="handleCoinsUpdated"
      @start-craft-challenge="handleStartCraftChallenge"
    />
  </div>
</template>

<script>
import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import DarkToggle from '../Header/DarkToggle.vue';
import LoginIcon from '../Header/LoginIcon.vue';
import ContactIcon from '../Header/ContactIcon.vue';
import GameAchievementsPopup from '../Achievements/GameAchievementsPopup.vue';
import GameInventory from '../Inventory/GameInventory.vue';
import CraftSystem from '../CraftSystem/CraftSystem.vue';
import CraftPopup from '../CraftSystem/CraftPopup.vue';
import GameAchievementsContent from '../Achievements/GameAchievementsContent.vue';
import DataLoading from './DataLoading.vue';
import GameSizer from '../Inventory/GameSizer.vue';
import InfiniteModeButton from '../InfiniteMode/InfiniteModeButton.vue';
import ExplorerModeButton from '../Explorer/ExplorerModeButton.vue';
import TimerModeButton from '../TimerMode/TimerModeButton.vue';
import TimerQuestions from '../TimerMode/TimerQuestions.vue';
import CoinCounter from '../Header/CoinCounter.vue';
import CustomizeModal from '../Header/CustomizeModal.vue';
import ExplorerMap from '../Explorer/ExplorerMap.vue';
import '@/assets/ComponentsStyle/GeneralStyle/style.css';

export default {
  name: 'App',
  components: {
    DarkToggle,
    LoginIcon,
    ContactIcon,
    GameAchievementsPopup,
    GameInventory,
    CraftSystem,
    CraftPopup,
    GameAchievementsContent,
    DataLoading,
    GameSizer,
    InfiniteModeButton,
    ExplorerModeButton,
    TimerModeButton,
    TimerQuestions,
    CoinCounter,
    CustomizeModal,
    ExplorerMap
  },
  data() {
    return {
      elementEmojis: {},
      craftingRecipes: {},
      categories: {},
      discoveredCategories: ["Elements Fondamentaux"],
      discoveredElements: ["Eau", "Feu", "Terre", "Air"],
      isDarkMode: true,
      craftedElement: {
        name: "",
        image: null,
      },
      achievements: [],
      saveInterval: null,
      explorerEnergy: null,
      explorerLastUpdate: null,
      newAchievement: null,
      isFireworkActive: false,
      isLoggedIn: false,
      currentUser: null,
      categoryProgress: {},
      showContactForm: false,
      isTimerActive: false,
      isExplorerActive: false,
      shouldForceReload: false,
      isExplorerCraftMode: false,
      currentExplorerChallenge: null,
      showTimerEndModal: false,
      timerModeDiscoveries: 0,
      timerModeStartElements: [],
      currentTimerElements: [],
      bestTimerScore: localStorage.getItem('bestTimerScore') || 0,
      selectedTimerLevel: null,
      coins: parseInt(localStorage.getItem('coins')) || 0,
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
  if (this.isLoggedIn) {
    await this.loadGameProgress();
    this.loadSavedCustomization();
    // Démarrer la sauvegarde périodique
    this.startPeriodicSave();
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
      } else {
        this.selectedFrame = 'basicCadre.png';
        this.selectedAvatar = 'coin.png';
      }
    },

    beforeUnmount() {
  // Nettoyer l'intervalle de sauvegarde périodique
  if (this.saveInterval) {
    clearInterval(this.saveInterval);
  }
  
  // Supprimer les écouteurs d'événements
  window.removeEventListener('app-reloaded', this.handleAppReloaded);
  window.removeEventListener('achievements-loaded', this.handleGlobalAchievementsLoaded);
  
  // Sauvegarde finale avant de quitter
  if (this.isLoggedIn) {
    this.saveGameProgress();
  }
},

handleAppReloaded() {
  console.log('Événement app-reloaded détecté dans App.vue');
  
  // Forcer le rechargement des achievements
  this.shouldForceReload = true;
  
  // Réinitialiser après un délai
  setTimeout(() => {
    this.shouldForceReload = false;
  }, 500);
},

handleGlobalAchievementsLoaded(event) {
  console.log('Événement achievements-loaded reçu dans App.vue', event.detail);
  
  if (event.detail && event.detail.achievements) {
    // Mettre à jour les achievements si nécessaire
    this.achievements = event.detail.achievements;
  }
},


    async activateExplorerMode() {
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
        
        // Réinitialiser la zone de craft (optionnel)
        if (this.$refs.craftSystem) {
          this.$refs.craftSystem.resetCraftingBoard();
        }
      } catch (error) {
        console.error("Erreur lors de l'activation du mode Explorer :", error);
      }
    },

    saveDiscoveredElement(element, gameMode = 'infinite') {
  // Vérifier que l'élément n'est pas déjà dans la liste
  if (!this.discoveredElements.includes(element)) {
    console.log(`Sauvegarde immédiate de l'élément découvert: ${element} (mode: ${gameMode})`);
    
    // Ajouter à la liste locale
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
    
    // Sauvegarder également dans localStorage
    localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
    localStorage.setItem('discoveredCategories', JSON.stringify(this.discoveredCategories));
    
    // Sauvegarder dans la base de données si connecté
    if (this.isLoggedIn) {
      progressService.updateDiscoveredElements(this.discoveredElements, gameMode)
        .then(() => {
          console.log(`Élément ${element} sauvegardé avec succès (mode: ${gameMode})`);
          // Sauvegarder également les catégories
          this.saveGameProgress();
        })
        .catch(error => {
          console.error(`Erreur lors de la sauvegarde de l'élément ${element}:`, error);
        });
    }
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
    handleInfiniteModeActivation(options = {}) {
  const forceReload = options.forceReload || false;
  
  // Réinitialisation des données
  this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
  this.discoveredCategories = ["Elements Fondamentaux"];
  
  // Définir shouldForceReload pour GameAchievementsContent
  this.shouldForceReload = true;
  
  if (forceReload && this.$refs.dataLoading) {
    this.$nextTick(async () => {
      try {
        console.log('🔄 Début du rechargement forcé');
        
        // Charger tous les achievements existants avant le rechargement
        const existingUnlockedAchievements = this.achievements
          .filter(a => a.unlocked)
          .reduce((acc, achievement) => {
            acc[achievement.name] = {
              unlocked: true,
              unlockedAt: achievement.unlockedAt || new Date().toISOString()
            };
            return acc;
          }, {});

        console.log('💾 Achievements existants à préserver:', 
          Object.keys(existingUnlockedAchievements).length
        );

        // Forcer le chargement de toutes les données
        const loadedData = await this.$refs.dataLoading.loadAllData();
        
        console.log('🔍 Données chargées:', {
          achievements: loadedData.achievements?.length,
          categories: Object.keys(loadedData.categories).length
        });

        // Mise à jour des données
        this.elementEmojis = loadedData.elementEmojis || {};
        this.categories = loadedData.categories || {};
        this.craftingRecipes = loadedData.craftingRecipes || {};
        
        // Synchronisation des achievements
        this.achievements = loadedData.achievements.map(achievement => {
          const existingUnlocked = existingUnlockedAchievements[achievement.name];
          
          return {
            ...achievement,
            unlocked: existingUnlocked ? true : false,
            unlockedAt: existingUnlocked?.unlockedAt
          };
        });
        
        // Sauvegarde immédiate
        await this.saveGameProgress();
        
        // Mise à jour explicite des achievements
        const achievementsToUpdate = this.achievements
          .filter(a => a.unlocked)
          .reduce((acc, achievement) => {
            acc[achievement.name] = {
              unlocked: true,
              unlockedAt: achievement.unlockedAt || new Date().toISOString()
            };
            return acc;
          }, {});
        
        console.log('🚀 Achievements à mettre à jour:', 
          Object.keys(achievementsToUpdate).length
        );
        
        // Mise à jour immédiate et parallèle
        await Promise.all([
          progressService.updateAchievements(achievementsToUpdate),
          this.updateCategoryProgress()
        ]);
        
        console.log('✅ Rechargement complet terminé');
        
        // Réinitialiser shouldForceReload après un délai
        setTimeout(() => {
          this.shouldForceReload = false;
        }, 500);
        
      } catch (error) {
        console.error('❌ Erreur de rechargement:', error);
        this.showAlert('Erreur de chargement. Veuillez réessayer.');
        this.shouldForceReload = false;
      }
    });
  }
},
    handleLevelSelected(levelData) {
      this.selectedTimerLevel = levelData.level;
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
        this.$refs.timerModeButton.stopTimer();
      }
    },

    async updateDiscoveredElements() {
      if (!this.isLoggedIn) return;
      
      try {
        console.log("Mise à jour des éléments découverts:", this.discoveredElements.length);
        
        // S'assurer que les éléments sont uniques
        const uniqueElements = [...new Set(this.discoveredElements)];
        
        // Charger les éléments actuels de la base de données pour comparaison
        const currentProgress = await progressService.loadGameProgress();
        const currentElements = currentProgress.discoveredElements || [];
        
        // Fusionner avec les éléments existants
        const mergedElements = [...new Set([...currentElements, ...uniqueElements])];
        console.log(`Éléments: ${currentElements.length} en DB + ${uniqueElements.length} actuels = ${mergedElements.length} après fusion`);
        
        // Sauvegarder les éléments fusionnés
        await progressService.updateDiscoveredElements(mergedElements);
        
        // Sauvegarder également les catégories
        await this.saveGameProgress();
        
        return mergedElements;
      } catch (error) {
        console.error("Erreur lors de la mise à jour des éléments découverts:", error);
        throw error;
      }
    },



    startPeriodicSave() {
  if (this.saveInterval) {
    clearInterval(this.saveInterval);
  }
  
  // Sauvegarder toutes les 2 minutes
  this.saveInterval = setInterval(() => {
    if (this.isLoggedIn) {
      console.log("Sauvegarde périodique de la progression...");
      
      this.saveGameProgress();
    }
  }, 120000); // 2 minutes
},

    async updateAchievements() {
      if (!this.isLoggedIn || !this.achievements) return;
      
      try {
        const achievementsData = {};
        this.achievements.forEach(achievement => {
          if (achievement.unlocked) {
            achievementsData[achievement.name] = {
              unlocked: true,
              unlockedAt: achievement.unlockedAt || new Date().toISOString()
            };
          }
        });
        
        await progressService.updateAchievements(achievementsData);
      } catch (error) {
        console.error("Erreur lors de la mise à jour des achievements:", error);
      }
    },

    handleResetCraftZone() {
      if (this.$refs.craftSystem) {
        this.$refs.craftSystem.resetCraftingBoard();
      }
    },
    handleSetInitialInventory(elements) {
      if (!this.isTimerActive) return;
      
      if (this.$refs.craftSystem) {
        this.$refs.craftSystem.resetCraftingBoard();
        this.$refs.craftSystem.selectedElements = [];
      }
      
      this.timerModeStartElements = [...this.discoveredElements];
      this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
      
      if (Array.isArray(elements)) {
        this.currentTimerElements = [...new Set(elements)];
        this.currentTimerElements.forEach(element => {
          if (!this.discoveredElements.includes(element)) {
            this.discoveredElements.push(element);
          }
        });
      }
      
      this.updateCategoryProgress();
    },
    handleTimerForceStop() {
      this.isTimerActive = false;
      this.selectedTimerLevel = null;
      if (this.timerModeStartElements.length > 0) {
        this.discoveredElements = [...this.timerModeStartElements];
        this.updateCategoryProgress();
      }
      this.timerModeStartElements = [];
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
    handleOpenContact() {
      this.showContactForm = true;
    },
    loadGameProgress() {
  if (!this.isLoggedIn) return;

  try {
    progressService.loadGameProgress()
      .then(progress => {
        if (progress) {
          if (progress.coins !== undefined) {
            this.coins = parseInt(progress.coins);
            localStorage.setItem('coins', this.coins.toString());
          }

          if (progress.discoveredElements) {
            try {
              if (typeof progress.discoveredElements === 'string') {
                const parsed = JSON.parse(progress.discoveredElements);
                this.discoveredElements = Array.isArray(parsed) 
                  ? parsed.map(element => element.replace(/^"|"$/g, ''))
                  : ["Eau", "Feu", "Terre", "Air"];
              } else {
                this.discoveredElements = progress.discoveredElements;
              }
              
              // Sauvegarder dans localStorage
              localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
            } catch (e) {
              console.error("Erreur parsing discoveredElements:", e);
              this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
            }
          }

          if (progress.discoveredCategories) {
            try {
              if (typeof progress.discoveredCategories === 'string') {
                const parsed = JSON.parse(progress.discoveredCategories);
                this.discoveredCategories = Array.isArray(parsed)
                  ? parsed.map(cat => cat.replace(/^"|"$/g, ''))
                  : ["Elements Fondamentaux"];
              } else if (Array.isArray(progress.discoveredCategories)) {
                this.discoveredCategories = progress.discoveredCategories;
              } else {
                this.discoveredCategories = ["Elements Fondamentaux"];
              }
              
              // Sauvegarder dans localStorage
              localStorage.setItem('discoveredCategories', JSON.stringify(this.discoveredCategories));
            } catch (e) {
              console.error("Erreur parsing discoveredCategories:", e);
              this.discoveredCategories = ["Elements Fondamentaux"];
            }
          }

          if (progress.categoryProgress) {
            try {
              this.categoryProgress = typeof progress.categoryProgress === 'string'
                ? JSON.parse(progress.categoryProgress)
                : progress.categoryProgress;
            } catch (e) {
              console.error("Erreur parsing categoryProgress:", e);
              this.categoryProgress = {};
            }
          }

          if (progress.timerProgress) {
            this.timerProgress = progress.timerProgress;
          }

          if (progress.customization) {
            this.selectedFrame = progress.customization.frame || 'basicCadre.png';
            this.selectedAvatar = progress.customization.avatar || 'coin.png';
            
            // Sauvegarder dans localStorage
            localStorage.setItem('userCustomization', JSON.stringify({
              frame: this.selectedFrame,
              avatar: this.selectedAvatar
            }));
          }

          if (this.categories && Object.keys(this.categories).length > 0) {
            this.repairGameData();
          } else {
            console.log('Catégories non encore chargées, réparation programmée');
            setTimeout(() => {
              if (this.categories && Object.keys(this.categories).length > 0) {
                this.repairGameData();
              }
            }, 2000);
          }

          this.updateCategoryProgress();
        }
      })
      .catch(error => {
        console.error("Erreur lors du chargement de la progression:", error);
        
        // Récupérer depuis localStorage si possible
        const localElements = localStorage.getItem('discoveredElements');
        const localCategories = localStorage.getItem('discoveredCategories');
        
        if (localElements) {
          try {
            this.discoveredElements = JSON.parse(localElements);
          } catch (e) {
            this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
          }
        } else {
          this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
        }
        
        if (localCategories) {
          try {
            this.discoveredCategories = JSON.parse(localCategories);
          } catch (e) {
            this.discoveredCategories = ["Elements Fondamentaux"];
          }
        } else {
          this.discoveredCategories = ["Elements Fondamentaux"];
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
      });
  } catch (error) {
    console.error("Erreur lors du chargement de la progression:", error);
    this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
    this.discoveredCategories = ["Elements Fondamentaux"];
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
  }
},





saveGameProgress() {
  if (!this.isLoggedIn) return;

  try {
    const progressData = {
      discoveredElements: Array.isArray(this.discoveredElements) 
        ? this.discoveredElements 
        : ["Eau", "Feu", "Terre", "Air"],
      discoveredCategories: Array.isArray(this.discoveredCategories)
        ? this.discoveredCategories
        : ["Elements Fondamentaux"],
      categoryProgress: this.categoryProgress || {},
      coins: this.coins,
      timerProgress: this.timerProgress,
      customization: {
        frame: this.selectedFrame,
        avatar: this.selectedAvatar
      }
    };

    // Sauvegarder également dans localStorage pour récupération rapide
    localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
    localStorage.setItem('discoveredCategories', JSON.stringify(this.discoveredCategories));

    return progressService.saveGameProgress(progressData);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la progression:", error);
  }
},


    updateCategoryProgress() {
      Object.keys(this.categories).forEach(category => {
        const totalElements = this.categories[category].length;
        const discoveredCount = this.categories[category].filter(element => 
          this.discoveredElements.includes(element)
        ).length;
        this.categoryProgress[category] = (discoveredCount / totalElements) * 100;
      });
    },
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
    updateDarkMode(newMode) {
      this.isDarkMode = newMode;
      document.body.classList.toggle("light-mode", !this.isDarkMode);
    },
    async handleLoginAttempt(credentials) {
      try {
        const response = await AuthService.login(credentials.email, credentials.password);
        this.isLoggedIn = true;
        this.currentUser = response;
        
        await this.loadGameProgress();
        this.loadSavedCustomization();
        
        this.showAlert(`Connexion réussie pour ${response.username}`);
      } catch (error) {
        console.error('Erreur lors de la connexion', error);
        this.showAlert(error.response?.data?.message || 'Erreur lors de la connexion');
      }
    },
    async handleRegisterAttempt(credentials) {
      try {
        const response = await AuthService.register(credentials.email, credentials.password);
        this.isLoggedIn = true;
        this.currentUser = response;
        this.saveGameProgress();
        this.showAlert(`Inscription réussie pour ${response.username}`);
      } catch (error) {
        console.error('Erreur lors de l\'inscription', error);
        this.showAlert(error.response?.data?.message || 'Erreur lors de l\'inscription');
      }
    },
    handleLogout() {
      AuthService.logout();
      this.isLoggedIn = false;
      this.currentUser = null;
      this.showAlert('Déconnexion réussie');
      window.location.reload();
    },
    handleDataLoaded(data) {
      this.elementEmojis = data.elementEmojis;
      this.categories = data.categories;
      this.craftingRecipes = data.craftingRecipes;
      this.updateCategoryProgress();
    },
    handleAchievementsLoaded(achievements) {
      this.achievements = achievements;
    },
    handleAchievementUnlocked(achievement) {
      this.newAchievement = achievement;
      this.handleAchievementUpdate(achievement);
    },
    handleResourceSelection(resource) {
      this.$refs.craftSystem.selectResource(resource);
    },

    handleStartCraftChallenge(challengeData) {
  // Stocker les données du défi
  this.currentExplorerChallenge = challengeData;
  
  // Activer le mode craft tout en gardant le contexte Explorer
  this.isExplorerActive = false;
  this.isExplorerCraftMode = true;
  
  // Préparer l'interface de craft avec les éléments de base
  if (this.$refs.craftSystem) {
    this.$refs.craftSystem.resetCraftingBoard();
    this.$refs.craftSystem.selectedElements = [];
  }
  
  // Afficher un message d'instruction
  this.showAlert(`Défi de craft: Créez ${challengeData.challenge.requiredElements.join(', ')} pour réussir le défi !`);
},


handleCraftSuccess(craftedItem) {
  console.log('DEBUG CRAFT SUCCESS:', {
    craftedItem,
    isTimerActive: this.isTimerActive,
    isExplorerCraftMode: this.isExplorerCraftMode,
    currentTimerElements: this.currentTimerElements,
    discoveredElements: this.discoveredElements.length
  });
  
  try {
    this.craftedElement = {
      name: craftedItem,
      image: require(`@/assets/creatures/${craftedItem}.png`),
    };
  } catch (error) {
    this.craftedElement = {
      name: craftedItem,
      image: null,
    };
  }
  
  // Mode normal (ni Timer ni Explorer)
  if (!this.isTimerActive && !this.isExplorerActive && !this.isExplorerCraftMode) {
    // Sauvegarder l'élément découvert
    this.saveDiscoveredElement(craftedItem);
    this.$refs.dataLoading.handleCraft(craftedItem);
  }
  
  // Gestion du mode Timer
  if (this.isTimerActive) {
    if (!this.discoveredElements.includes(craftedItem)) {
      this.discoveredElements.push(craftedItem);
    }
    
    if (!this.currentTimerElements.includes(craftedItem)) {
      this.currentTimerElements.push(craftedItem);
    }
    
    const currentQuestion = this.$refs.timerQuestions.getCurrentQuestion();
    
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
  
  // Gestion du mode Explorer Craft
  if (this.isExplorerCraftMode && this.currentExplorerChallenge) {
    const requiredElements = this.currentExplorerChallenge.challenge.requiredElements || [];
    
    if (requiredElements.includes(craftedItem)) {
      // Défi réussi !
      this.showAlert(`Félicitations ! Vous avez créé ${craftedItem} et réussi le défi !`);
      
      // Attribuer une récompense en pièces
      this.handleCoinsEarned(50);
      
      // Sauvegarder l'élément de façon permanente
      this.saveDiscoveredElement(craftedItem);
      
      // Revenir au mode Explorer
      this.isExplorerCraftMode = false;
      this.isExplorerActive = true;
      
      // Réinitialiser le défi actuel
      this.currentExplorerChallenge = null;
    }
  }
},


    addToCategory(craftedItem) {
      const targetCategory = Object.keys(this.categories).find((category) =>
        this.categories[category].includes(craftedItem)
      );
      
      if (targetCategory && !this.discoveredElements.includes(craftedItem)) {
        this.discoveredElements.push(craftedItem);
        
        if (!this.discoveredCategories.includes(targetCategory)) {
          console.log(`Ajout de la catégorie: ${targetCategory}`);
          this.discoveredCategories.push(targetCategory);
        }
        
        this.updateCategoryProgress();
        
        console.log('Sauvegarde après ajout de:', craftedItem);
        console.log('Éléments découverts:', this.discoveredElements.length);
        console.log('Catégories découvertes:', this.discoveredCategories);
        
        this.saveGameProgress();
      }
    },
    async repairGameData() {
      if (!this.isLoggedIn) return;
      
      console.log('Début de la réparation des données...');
      
      const repairedCategories = ["Elements Fondamentaux"];
      
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
        console.log('Réparation des catégories nécessaire:');
        console.log('Avant:', this.discoveredCategories);
        console.log('Après:', repairedCategories);
        
        this.discoveredCategories = repairedCategories;
        
        await this.saveGameProgress();
        console.log('Données réparées et sauvegardées avec succès');
      } else {
        console.log('Aucune réparation nécessaire, les données sont cohérentes');
      }
    },
    async handleAchievementUpdate(achievement) {
      if (!this.isLoggedIn) return;
      
      const existingIndex = this.achievements.findIndex(a => a.name === achievement.name);
      if (existingIndex >= 0) {
        this.achievements[existingIndex].unlocked = true;
        this.achievements[existingIndex].unlockedAt = new Date().toISOString();
      }
      
      await this.updateAchievements();
    },
    closeAchievementPopup() {
      this.newAchievement = null;
    },
    resetCraftedElement() {
      this.craftedElement = { name: "", image: null };
    },
    showAlert(message) {
      alert(message);
    },
    handleAchievementPopupOpened() {
      this.isFireworkActive = true;
      setTimeout(() => {
        this.isFireworkActive = false;
      }, 2000);
    },
    handleTimerStateChange(isActive) {
      // Désactiver le mode Explorer si on active le mode Timer
      if (isActive && this.isExplorerActive) {
        this.isExplorerActive = false;
      }
      
      this.isTimerActive = isActive;
      
      if (this.$refs.craftSystem) {
        this.$refs.craftSystem.resetCraftingBoard();
        this.$refs.craftSystem.selectedElements = [];
      }
  
      if (isActive && this.$refs.timerQuestions) {
        this.timerModeDiscoveries = 0;
        this.selectedTimerLevel = null;
        this.currentTimerElements = [];
        this.$refs.timerQuestions.show();
      } else if (!isActive) {
        if (this.timerModeStartElements.length > 0) {
          this.discoveredElements = [...this.timerModeStartElements];
          this.updateCategoryProgress();
        }
        this.currentTimerElements = [];
        this.selectedTimerLevel = null;
        if (this.$refs.timerQuestions) {
          this.$refs.timerQuestions.resetQuestions();
        }
      }
    },
    async handleCoinsEarned(amount) {
      this.coins += amount;
      localStorage.setItem('coins', this.coins.toString());
      
      if (this.isLoggedIn) {
        try {
          await progressService.updateCoins(this.coins);
        } catch (error) {
          console.error("Erreur lors de la mise à jour des pièces:", error);
        }
      }
    },
    async handleTimerComplete() {
      const currentScore = this.discoveredElements.length - this.timerModeStartElements.length;
      
      if (this.selectedTimerLevel && currentScore > this.timerProgress.bestScores[this.selectedTimerLevel]) {
        this.timerProgress.bestScores[this.selectedTimerLevel] = currentScore;
        
        const bonus = currentScore * 5;
        await this.handleCoinsEarned(bonus);
        
        if (this.isLoggedIn) {
          try {
            await progressService.updateTimerProgress(this.timerProgress);
          } catch (error) {
            console.error("Erreur lors de la mise à jour du meilleur score:", error);
          }
        }
      }
  
      this.showTimerEndModal = true;
    },
    handleTimerEndModalClose() {
      this.showTimerEndModal = false;
      this.discoveredElements = [...this.timerModeStartElements];
      this.updateCategoryProgress();
      this.selectedTimerLevel = null;
      if (this.$refs.timerQuestions) {
        this.$refs.timerQuestions.resetQuestions();
      }
    },
    async updateTimerProgress(categoryName, questionId) {
      if (!this.selectedTimerLevel) return;
      
      if (!this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName]) {
        this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName] = [];
      }
      
      if (!this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName].includes(questionId)) {
        this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName].push(questionId);
      }
  
      if (this.isLoggedIn) {
        try {
          await progressService.updateTimerProgress(this.timerProgress);
        } catch (error) {
          console.error("Erreur lors de la mise à jour de la progression du timer:", error);
        }
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
      console.log("Personnalisation sauvegardée:", customizationData);
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