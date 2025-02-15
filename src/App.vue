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
          @login-attempt="handleLoginAttempt"
          @register-attempt="handleRegisterAttempt"
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
    };
  },
  methods: {
    updateDarkMode(newMode) {
      this.isDarkMode = newMode;
      document.body.classList.toggle("light-mode", !this.isDarkMode);
    },
    handleLoginAttempt(credentials) {
      console.log('Tentative de connexion:', credentials);
      // Ici viendra l'appel à votre API de connexion
      this.showAlert(`Tentative de connexion avec: ${credentials.email}`);
    },
    handleRegisterAttempt(credentials) {
      console.log('Tentative d\'inscription:', credentials);
      // Ici viendra l'appel à votre API d'inscription
      this.showAlert(`Tentative d'inscription avec: ${credentials.email}`);
    },
    handleDataLoaded(data) {
      this.elementEmojis = data.elementEmojis;
      this.categories = data.categories;
      this.craftingRecipes = data.craftingRecipes;
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