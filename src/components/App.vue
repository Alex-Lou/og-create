<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    <DataLoading
      ref="dataLoading"
      :isTimerMode="isTimerActive"
      @data-loaded="handleDataLoaded"
      @achievements-loaded="handleAchievementsLoaded"
      @achievement-unlocked="handleAchievementUnlocked"
    />
    <GameAchievementsContent :achievements="achievements" />
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
      <InfiniteModeButton @switch-to-infinite="handleInfiniteModeActivation" :isTimerActive="isTimerActive" />
      <ExplorerModeButton />
      <TimerModeButton 
        ref="timerModeButton"
        @timer-state-change="handleTimerStateChange"
        @timer-complete="handleTimerComplete"
        @show-question="showCurrentTimerQuestion"
        @force-stop="handleTimerForceStop"
      />
    </header>
    <main id="main-content" ref="mainContent">
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
          @show-alert="showAlert"
          ref="craftSystem"
        />
      </div>
    </main>
    <CraftPopup
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
      v-show="isTimerActive"
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
      @close="handleCloseCustomizeModal" 
      @save="handleSaveCustomization" 
    />
  </div>
</template>

<script>
import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import DarkToggle from './DarkToggle.vue';
import LoginIcon from './LoginIcon.vue';
import ContactIcon from './ContactIcon.vue';
import GameAchievementsPopup from './GameAchievementsPopup.vue';
import GameInventory from './GameInventory.vue';
import CraftSystem from './CraftSystem.vue';
import CraftPopup from './CraftPopup.vue';
import GameAchievementsContent from './GameAchievementsContent.vue';
import DataLoading from './DataLoading.vue';
import GameSizer from './GameSizer.vue';
import InfiniteModeButton from './InfiniteModeButton.vue';
import ExplorerModeButton from './ExplorerModeButton.vue';
import TimerModeButton from './TimerModeButton.vue';
import TimerQuestions from './TimerQuestions.vue';
import CoinCounter from './CoinCounter.vue';
import CustomizeModal from './CustomizeModal.vue';
import '@/assets/style.css';

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
    CustomizeModal
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
      newAchievement: null,
      isFireworkActive: false,
      isLoggedIn: false,
      currentUser: null,
      categoryProgress: {},
      showContactForm: false,
      isTimerActive: false,
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
      isCustomizeModalOpen: false
    };
  },
  created() {
    this.checkAuth();
    if (this.isLoggedIn) {
      this.loadGameProgress();
    }
  },
  methods: {
    handleInfiniteModeActivation() {
      // Si le mode Timer est actif, on l'arrête
      if (this.isTimerActive) {
        // On désactive le mode Timer
        this.isTimerActive = false;
        
        // Si la référence au TimerModeButton existe, on arrête le timer
        if (this.$refs.timerModeButton) {
          this.$refs.timerModeButton.stopTimer();
        }
        
        // Réinitialiser les questions du timer
        if (this.$refs.timerQuestions) {
          this.$refs.timerQuestions.resetQuestions();
        }
      }
      
      // Réinitialiser les éléments découverts aux 4 éléments de base
      this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
      this.discoveredCategories = ["Elements Fondamentaux"];
      
      // Mettre à jour la progression des catégories
      this.updateCategoryProgress();
      
      // Réinitialiser le CraftSystem : la zone de craft et la sélection d'éléments
      if (this.$refs.craftSystem) {
        this.$refs.craftSystem.resetCraftingBoard();
        this.$refs.craftSystem.selectedElements = [];
      }
      
      // Sauvegarder la progression après le changement de mode
      this.saveGameProgress();
      
      // Ici, vous pouvez également émettre un événement ou modifier un état global
      // si vous avez besoin d'indiquer que le mode Infinite est désormais actif.
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
    async loadGameProgress() {
      if (!this.isLoggedIn) return;
  
      try {
        const progress = await progressService.loadGameProgress();
        if (progress) {
          // Chargement des pièces
          if (progress.coins !== undefined) {
            this.coins = parseInt(progress.coins);
            localStorage.setItem('coins', this.coins.toString());
          }
  
          // Chargement des éléments découverts
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
            } catch (e) {
              console.error("Erreur parsing discoveredElements:", e);
              this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
            }
          }
  
          // Chargement des catégories découvertes
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
            } catch (e) {
              console.error("Erreur parsing discoveredCategories:", e);
              this.discoveredCategories = ["Elements Fondamentaux"];
            }
          }
  
          // Chargement de la progression des catégories
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
  
          // Chargement de la progression du timer
          if (progress.timerProgress) {
            this.timerProgress = progress.timerProgress;
          }
  
          // Mise à jour de la progression des catégories
          this.updateCategoryProgress();
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la progression:", error);
        // Réinitialisation des valeurs par défaut en cas d'erreur
        this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
        this.discoveredCategories = ["Elements Fondamentaux"];
        this.categoryProgress = {};
        this.coins = 0; // Réinitialiser à 0 en cas d'erreur
        localStorage.setItem('coins', '0');
        this.timerProgress = {
          completedQuestions: { Facile: {}, Moyen: {}, Difficile: {} },
          unlockedCategories: {},
          bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
        };
      }
    },
    async saveGameProgress() {
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
          timerProgress: this.timerProgress
        };
  
        await progressService.saveGameProgress(progressData);
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
      } else {
        this.isLoggedIn = false;
        this.currentUser = null;
        localStorage.removeItem('user');
        
        // Réinitialiser les pièces à 0 si non connecté
        this.coins = 0;
        localStorage.removeItem('coins');
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
        
        // Charger la progression APRES la connexion
        await this.loadGameProgress();
        
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
    },
    handleResourceSelection(resource) {
      this.$refs.craftSystem.selectResource(resource);
    },
    handleCraftSuccess(craftedItem) {
      console.error('DEBUG CRAFT SUCCESS:', {
        craftedItem,
        isTimerActive: this.isTimerActive,
        currentTimerElements: this.currentTimerElements,
        discoveredElements: this.discoveredElements
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
      
      // En mode Timer, on ajoute l'élément aux discoveredElements temporaires
      // et aux currentTimerElements
      if (this.isTimerActive) {
        if (!this.discoveredElements.includes(craftedItem)) {
          this.discoveredElements.push(craftedItem);
          console.error('Élément ajouté aux discoveredElements:', craftedItem);
        }
        
        if (!this.currentTimerElements.includes(craftedItem)) {
          this.currentTimerElements.push(craftedItem);
          console.error('Élément ajouté aux currentTimerElements:', craftedItem);
        }
      }
      
      // En mode normal, on gère les succès
      if (!this.isTimerActive) {
        this.addToCategory(craftedItem);
        this.$refs.dataLoading.handleCraft(craftedItem);
      }
      
      // Gestion du mode Timer et vérification des réponses
      if (this.isTimerActive) {
        const currentQuestion = this.$refs.timerQuestions.getCurrentQuestion();
        
        if (currentQuestion) {
          const allPossibleElements = [
            ...(currentQuestion.initialElements.required || []),
            ...(currentQuestion.initialElements.additional || []),
            ...(currentQuestion.validAnswers || [])
          ];
          
          if (allPossibleElements.includes(craftedItem)) {
            console.error('L\'élément est dans les éléments possibles');
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
    addToCategory(craftedItem) {
      const targetCategory = Object.keys(this.categories).find((category) =>
        this.categories[category].includes(craftedItem)
      );
      if (targetCategory && !this.discoveredElements.includes(craftedItem)) {
        this.discoveredElements.push(craftedItem);
        if (!this.discoveredCategories.includes(targetCategory)) {
          this.discoveredCategories.push(targetCategory);
        }
        this.updateCategoryProgress();
        this.saveGameProgress();
      }
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
      this.isTimerActive = isActive;
      
      // S'assurer que le CraftSystem est complètement réinitialisé
      if (this.$refs.craftSystem) {
        this.$refs.craftSystem.resetCraftingBoard();
        // Forcer une réinitialisation complète
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
      
      // Mise à jour du meilleur score pour le niveau actuel
      if (this.selectedTimerLevel && currentScore > this.timerProgress.bestScores[this.selectedTimerLevel]) {
        this.timerProgress.bestScores[this.selectedTimerLevel] = currentScore;
        
        // Bonus de pièces pour nouveau meilleur score
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
      
      // Mise à jour de la progression locale
      if (!this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName]) {
        this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName] = [];
      }
      
      if (!this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName].includes(questionId)) {
        this.timerProgress.completedQuestions[this.selectedTimerLevel][categoryName].push(questionId);
      }
  
      // Sauvegarde si connecté
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
    handleSaveCustomization() {
      console.log("Personnalisation sauvegardée");
      this.isCustomizeModalOpen = false;
    }
  }
};
</script>


<style>
@import '@/assets/style.css';

  .timer-mode-active {
    position: relative;
  }

  .timer-mode-active::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid #2D96A4;
    border-radius: 10px;
    pointer-events: none;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(45, 150, 164, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(45, 150, 164, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(45, 150, 164, 0);
    }
  }

  .timer-end-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .timer-end-content {
    background-color: #1a1d24;
    padding: 2rem;
    border-radius: 15px;
    border: 2px solid #304968;
    text-align: center;
    color: #2D96A4;
    max-width: 400px;
    width: 90%;
  }

  .timer-end-content h2 {
    font-size: 24px;
    margin-bottom: 1rem;
    font-family: 'BenjaminFranklin', Arial;
  }

  .timer-end-stats {
    margin: 1.5rem 0;
    padding: 1rem;
    background-color: rgba(48, 73, 104, 0.2);
    border-radius: 8px;
  }

  .timer-end-stats p {
    margin: 0.5rem 0;
    font-size: 16px;
  }

  .timer-end-button {
    background-color: #2D96A4;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-family: 'BenjaminFranklin', Arial;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .timer-end-button:hover {
    background-color: #1a7c8a;
    transform: scale(1.05);
  }

  .timer-end-button:active {
    transform: scale(0.95);
  }
</style>