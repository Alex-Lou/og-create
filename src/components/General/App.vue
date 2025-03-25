<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    <DataLoading
  ref="dataLoading"
  :isTimerMode="isTimerActive"
  @data-loaded="handleDataLoaded"
  @achievements-loaded="handleAchievementsLoaded"
  @achievement-unlocked="handleAchievementUnlocked"
  @timer-questions-loaded="handleTimerQuestionsLoaded"
/>
    <GameAchievementsContent 
      :achievements="achievements" 
      :forceReload="shouldForceReload" 
      @achievements-loaded="handleAchievementsLoaded" 
    />
    <header style="position: relative;">
  <!-- Ajouts décoratifs minimaux qui ne perturbent pas la structure -->
  <div class="header-decoration"></div>
  
  <!-- Structure originale préservée exactement comme avant -->
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
      @show-level-selection="showLevelSelection"
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
      :active="isExplorerActive"
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
mounted() {
  // CODE DE DÉBOGAGE - DÉTECTION DE [object Promise]
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function(node) {
    if (node && node.nodeType === Node.TEXT_NODE && 
        node.textContent && node.textContent.includes('[object Promise]')) {
      console.error("=== DÉTECTION DE [object Promise] ===");
      console.error("Élément parent:", this);
      console.error("Texte complet:", node.textContent);
      console.error("Chemin DOM:", this.tagName + (this.id ? `#${this.id}` : '') + 
                    (this.className ? `.${this.className.replace(/\s+/g, '.')}` : ''));
      console.trace("Trace d'appel:");
    }
    return originalAppendChild.call(this, node);
  };
  
  // Ajouter les écouteurs d'événements globaux
  window.addEventListener('app-reloaded', this.handleAppReloaded);
  window.addEventListener('achievements-loaded', this.handleGlobalAchievementsLoaded);
  
  // Exposer une méthode pour sauvegarder directement les achievements
  window.saveAchievements = (achievementsData) => {
    if (this.isLoggedIn && achievementsData) {
      console.log("Sauvegarde globale d'achievements:", Object.keys(achievementsData));
      progressService.updateAchievements(achievementsData)
        .then(() => console.log("Sauvegarde directe des achievements réussie"))
        .catch(err => console.error("Erreur de sauvegarde directe:", err));
    }
  };
  
  // Correctif pour intercepter et supprimer les [object Promise] qui pourraient apparaître dans le DOM
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        Array.from(mutation.addedNodes).forEach(node => {
          // Vérifier les nœuds de texte contenant [object Promise]
          if (node.nodeType === Node.TEXT_NODE && node.textContent && 
              node.textContent.includes('[object Promise]')) {
            // Log avant suppression pour débogage
            console.error("=== MUTATION: [object Promise] détecté et nettoyé ===");
            console.error("Parent de la mutation:", mutation.target);
            console.error("Texte problématique:", node.textContent);
            // Supprimer ou vider le texte problématique
            node.textContent = '';
          }
          
          // Vérifier également les éléments HTML qui pourraient contenir du texte problématique
          if (node.nodeType === Node.ELEMENT_NODE && node.innerHTML && 
              node.innerHTML.includes('[object Promise]')) {
            // Log avant nettoyage
            console.error("=== ÉLÉMENT HTML contenant [object Promise] ===");
            console.error("Élément:", node);
            console.error("HTML avant nettoyage:", node.innerHTML);
            // Nettoyer le contenu HTML des éléments
            node.innerHTML = node.innerHTML.replace(/\[object Promise\]/g, '');
          }
        });
      }
      
      // Vérifier aussi les attributs modifiés
      if (mutation.type === 'attributes' && mutation.target && 
          mutation.target.getAttribute && mutation.attributeName) {
        const attrValue = mutation.target.getAttribute(mutation.attributeName);
        if (attrValue && attrValue.includes('[object Promise]')) {
          console.error("=== ATTRIBUT contenant [object Promise] ===");
          console.error("Élément:", mutation.target);
          console.error("Attribut:", mutation.attributeName);
          console.error("Valeur:", attrValue);
          mutation.target.setAttribute(mutation.attributeName, 
                                     attrValue.replace(/\[object Promise\]/g, ''));
        }
      }
    });
  });
  
  // Observer le document entier pour toute modification du DOM
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true
  });
  
  // Conserver une référence à l'observateur pour le nettoyage
  this.promiseCleanupObserver = observer;
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
    showLevelSelection() {
    // Cette méthode va réafficher le menu de sélection de difficulté
    if (this.$refs.timerModeButton) {
      this.$refs.timerModeButton.showLevelSelection();
    }
  },

  handleTimerQuestionsLoaded(data) {
  if (this.$refs.timerQuestions) {
    this.$refs.timerQuestions.setQuestions(data);
  }
},

  beforeUnmount() {
  // Nettoyer les écouteurs d'événements
  window.removeEventListener('app-reloaded', this.handleAppReloaded);
  window.removeEventListener('achievements-loaded', this.handleGlobalAchievementsLoaded);
  
  // Nettoyer l'observateur
  if (this.promiseCleanupObserver) {
    this.promiseCleanupObserver.disconnect();
  }
  
  // Sauvegarde finale avant de quitter
  if (this.isLoggedIn) {
    this.saveGameProgress();
  }
},

handleAppReloaded() {
  
  // Forcer le rechargement des achievements
  this.shouldForceReload = true;
  
  // Réinitialiser après un délai
  setTimeout(() => {
    this.shouldForceReload = false;
  }, 500);
},

handleGlobalAchievementsLoaded(event) {  
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
        const existingUnlockedAchievements = this.achievements
          .filter(a => a.unlocked)
          .reduce((acc, achievement) => {
            acc[achievement.name] = {
              unlocked: true,
              unlockedAt: achievement.unlockedAt || new Date().toISOString()
            };
            return acc;
          }, {});


        // Forcer le chargement de toutes les données
        const loadedData = await this.$refs.dataLoading.loadAllData();
        

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
        
        // console.log('🚀 Achievements à mettre à jour:', 
        //   Object.keys(achievementsToUpdate).length
        // );
        
        // Mise à jour immédiate et parallèle
        await Promise.all([
          progressService.updateAchievements(achievementsToUpdate),
          this.updateCategoryProgress()
        ]);
        
        
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
        // S'assurer que les éléments sont uniques
        const uniqueElements = [...new Set(this.discoveredElements)];
        
        // Charger les éléments actuels de la base de données pour comparaison
        const currentProgress = await progressService.loadGameProgress();
        const currentElements = currentProgress.discoveredElements || [];
        
        // Fusionner avec les éléments existants
        const mergedElements = [...new Set([...currentElements, ...uniqueElements])];
        
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
      this.saveGameProgress();
    }
  }, 120000); // 2 minutes
},

async updateAchievements() {
  if (!this.achievements || !Array.isArray(this.achievements) || this.achievements.length === 0) {
    return;
  }
  
  if (!AuthService.isAuthenticated()) {
    return;
  }
  
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
        
    if (Object.keys(achievementsData).length > 0) {
      await progressService.updateAchievements(achievementsData);
    } else {
      console.log("Aucun achievement débloqué à sauvegarder");
    }
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
  
  // Sauvegarder l'inventaire actuel avant de passer en mode Timer
  this.timerModeStartElements = [...this.discoveredElements];
  
  // Réinitialiser à juste les éléments fondamentaux
  this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
  
  if (Array.isArray(elements)) {
    // Ajouter les éléments requis pour cette question à l'inventaire temporaire
    this.currentTimerElements = [...new Set(elements)];
    this.currentTimerElements.forEach(element => {
      if (!this.discoveredElements.includes(element)) {
        this.discoveredElements.push(element);
      }
    });
    
    // Ajoutons un délai avant d'essayer de sauvegarder
    if (this.isLoggedIn) {
      setTimeout(() => {
        try {
          fetch('/api/timer/save-elements', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${AuthService.getCurrentUser()?.token}`
            },
            body: JSON.stringify({
              elements: this.currentTimerElements
            })
          })
          .then(response => {
            if (response.ok) return response.json();
            // Ne pas lancer d'erreur, simplement logger
            console.warn('Avertissement: Impossible de sauvegarder les éléments Timer, continuez quand même');
            return { success: false };
          })
          .then(data => {
            if (data.success !== false) {
              console.log('Éléments pour la question Timer sauvegardés');
            }
          })
          .catch(error => {
            console.warn('Erreur non bloquante lors de la sauvegarde des éléments:', error);
          });
        } catch (error) {
          console.warn('Exception lors de la sauvegarde des éléments Timer, continuez quand même:', error);
        }
      }, 300);
    }
  }
  
  this.updateCategoryProgress();
},


handleTimerForceStop() {
  this.isTimerActive = false;
  this.selectedTimerLevel = null;
  
  // Restaurer l'inventaire précédent
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
              let elementsToSet = [];
              
              if (typeof progress.discoveredElements === 'string') {
                const parsed = JSON.parse(progress.discoveredElements);
                elementsToSet = Array.isArray(parsed) 
                  ? parsed.map(element => element.replace(/^"|"$/g, ''))
                  : ["Eau", "Feu", "Terre", "Air"];
              } else if (Array.isArray(progress.discoveredElements)) {
                elementsToSet = progress.discoveredElements;
              } else {
                console.warn('DEBUG - Format des éléments découverts invalide');
                elementsToSet = ["Eau", "Feu", "Terre", "Air"];
              }

              this.discoveredElements = elementsToSet;
              localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
            } catch (e) {
              console.error("DEBUG - Erreur parsing discoveredElements:", e);
              this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
            }
          } else {
            console.warn('DEBUG - Aucun élément découvert dans la progression');
            this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
          }

          if (progress.discoveredCategories) {
            try {
              let categoriesToSet = [];
              
              if (typeof progress.discoveredCategories === 'string') {
                const parsed = JSON.parse(progress.discoveredCategories);
                categoriesToSet = Array.isArray(parsed)
                  ? parsed.map(cat => cat.replace(/^"|"$/g, ''))
                  : ["Elements Fondamentaux"];
              } else if (Array.isArray(progress.discoveredCategories)) {
                categoriesToSet = progress.discoveredCategories;
              } else {
                console.warn('DEBUG - Format des catégories découvertes invalide');
                categoriesToSet = ["Elements Fondamentaux"];
              }

              this.discoveredCategories = categoriesToSet;
              localStorage.setItem('discoveredCategories', JSON.stringify(this.discoveredCategories));
            } catch (e) {
              console.error("DEBUG - Erreur parsing discoveredCategories:", e);
              this.discoveredCategories = ["Elements Fondamentaux"];
            }
          } else {
            console.warn('DEBUG - Aucune catégorie découverte dans la progression');
            this.discoveredCategories = ["Elements Fondamentaux"];
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
            this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
          }
        } else {
          this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
        }
        
        if (localCategories) {
          try {
            this.discoveredCategories = JSON.parse(localCategories);
          } catch (e) {
            console.error('DEBUG - Erreur parsing localStorage categories:', e);
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
  // Vérifier que l'achievement est un objet valide
  if (!achievement || typeof achievement !== 'object' || achievement instanceof Promise) {
    console.error("Format d'achievement invalide:", achievement);
    return;
  }
  
  // Créer une copie sécurisée avec uniquement les propriétés nécessaires
  this.newAchievement = {
    name: achievement.name,
    description: achievement.description,
    image: achievement.image,
    unlocked: true,
    unlockedAt: achievement.unlockedAt || new Date().toISOString()
  };
  
  // Sauvegarde dans achievements locaux
  const existingIndex = this.achievements.findIndex(a => a.name === achievement.name);
  if (existingIndex >= 0) {
    this.achievements[existingIndex].unlocked = true;
    this.achievements[existingIndex].unlockedAt = new Date().toISOString();
  }
  
  // Sauvegarder immédiatement si connecté
  if (this.isLoggedIn) {
    this.handleAchievementUpdate(this.newAchievement);
  }
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
    
    // Vérifier si la référence dataLoading existe
    if (this.$refs.dataLoading) {
      // Passer false comme second paramètre pour éviter les popups redondants
      // pour les éléments déjà découverts
      this.$refs.dataLoading.handleCraft(craftedItem, false);
    }
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
          const timerService = require('@/services/timerService').default;
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

// Méthode auxiliaire pour obtenir l'image d'un élément
getElementImage(elementName) {
  try {
    return require(`@/assets/elements/${elementName}.png`);
  } catch (e) {
    return null;
  }
},

// Méthode pour sauvegarder la progression des succès
saveAchievementsProgress() {
  const achievementsData = {};
  this.achievements.forEach(achievement => {
    if (achievement.unlocked) {
      achievementsData[achievement.name] = {
        unlocked: true,
        unlockedAt: achievement.unlockedAt || new Date().toISOString()
      };
    }
  });
  
  if (Object.keys(achievementsData).length > 0) {
    // Appel à votre service de sauvegarde des achievements
    this.updateAchievements(achievementsData);
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
        
        this.saveGameProgress();
      }
    },
    async repairGameData() {
      if (!this.isLoggedIn) return;
            
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

  // Restaurer l'inventaire précédent (important!)
  this.discoveredElements = [...this.timerModeStartElements];
  this.updateCategoryProgress();
  
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