<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    <DataLoading
      ref="dataLoading"
      @data-loaded="handleDataLoaded"
      @achievements-loaded="handleAchievementsLoaded"
      @achievement-unlocked="handleAchievementUnlocked"
    />
    <GameAchievementsContent :achievements="achievements" />
    <header>
      <img src="@/assets/Svgs/Logo.png" alt="Logo" class="logo" />
      <h1>Origins Creation</h1>
      <div class="header-controls">
        <DarkToggle :isDarkMode="isDarkMode" @update:darkMode="updateDarkMode" />
        <LoginIcon 
          :isDarkMode="isDarkMode" 
          :isLoggedIn="isLoggedIn"
          :currentUser="currentUser"
          @login-attempt="handleLoginAttempt"
          @register-attempt="handleRegisterAttempt"
          @logout="handleLogout"
        />
      </div>
    </header>
    <main id="main-content" ref="mainContent">
      <div ref="inventory" class="inventory-wrapper">
        <GameInventory
          :categories="categories"
          :discoveredCategories="discoveredCategories"
          :discoveredElements="discoveredElements"
          :elementEmojis="elementEmojis"
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
  </div>
</template>

<script>
import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import DarkToggle from "./components/DarkToggle.vue";
import LoginIcon from "./components/LoginIcon.vue";
import GameAchievementsPopup from "./components/GameAchievementsPopup.vue";
import GameInventory from "./components/GameInventory.vue";
import CraftSystem from "./components/CraftSystem.vue";
import CraftPopup from "./components/CraftPopup.vue";
import GameAchievementsContent from "./components/GameAchievementsContent.vue";
import DataLoading from "./components/DataLoading.vue";
import GameSizer from "./components/GameSizer.vue";
import './assets/style.css';

export default {
  name: 'App',
  components: {
    DarkToggle,
    LoginIcon,
    GameAchievementsPopup,
    GameInventory,
    CraftSystem,
    CraftPopup,
    GameAchievementsContent,
    DataLoading,
    GameSizer
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
      categoryProgress: {} // Pour stocker la progression de chaque catégorie
    };
  },
  created() {
    this.checkAuth();
    if (this.isLoggedIn) {
      this.loadGameProgress();
    }
  },
  methods: {
    async loadGameProgress() {
  if (!this.isLoggedIn) return;

  try {
    const progress = await progressService.loadGameProgress();
    if (progress) {
      // Gestion des éléments découverts
      if (progress.discoveredElements) {
        try {
          // Si c'est une chaîne, on essaie de la parser
          if (typeof progress.discoveredElements === 'string') {
            const parsed = JSON.parse(progress.discoveredElements);
            // Si c'est un tableau d'éléments avec des guillemets doubles supplémentaires
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

      // Gestion des catégories découvertes
      if (progress.discoveredCategories) {
        try {
          // Si c'est une chaîne, on essaie de la parser
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

      // Gestion de la progression des catégories
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

      this.updateCategoryProgress();
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la progression:", error);
    // Valeurs par défaut en cas d'erreur
    this.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
    this.discoveredCategories = ["Elements Fondamentaux"];
    this.categoryProgress = {};
  }
},

async saveGameProgress() {
  if (!this.isLoggedIn) return;

  try {
    // S'assurer que les données sont dans le bon format
    const progressData = {
      discoveredElements: Array.isArray(this.discoveredElements) 
        ? this.discoveredElements 
        : ["Eau", "Feu", "Terre", "Air"],
      discoveredCategories: Array.isArray(this.discoveredCategories)
        ? this.discoveredCategories
        : ["Elements Fondamentaux"],
      categoryProgress: this.categoryProgress || {}
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
      }
    },

    updateDarkMode(newMode) {
      this.isDarkMode = newMode;
      document.body.classList.toggle("light-mode", !this.isDarkMode);
    },

    async handleLoginAttempt(credentials) {
      console.log('Tentative de connexion:', credentials);
      try {
        const response = await AuthService.login(credentials.email, credentials.password);
        this.isLoggedIn = true;
        this.currentUser = response;
        await this.loadGameProgress(); // Charger la progression après connexion
        console.log('Connexion réussie:', response);
        this.showAlert(`Connexion réussie pour ${response.username}`);
      } catch (error) {
        console.error('Erreur lors de la connexion', error);
        this.showAlert(error.response?.data?.message || 'Erreur lors de la connexion');
      }
    },

    async handleRegisterAttempt(credentials) {
      console.log('Tentative d\'inscription:', credentials);
      try {
        const response = await AuthService.register(credentials.email, credentials.password);
        this.isLoggedIn = true;
        this.currentUser = response;
        this.saveGameProgress(); // Sauvegarder la progression initiale
        console.log('Inscription réussie:', response);
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
      this.addToCategory(craftedItem);
      this.$refs.dataLoading.handleCraft(craftedItem);
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
        this.saveGameProgress(); // Sauvegarder après chaque découverte
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
    }
  }
};
</script>

<style>
@import '@/assets/style.css';
</style>