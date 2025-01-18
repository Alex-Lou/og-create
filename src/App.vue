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
      <DarkToggle :isDarkMode="isDarkMode" @update:darkMode="updateDarkMode" />
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
    };
  },
  methods: {
    updateDarkMode(newMode) {
      this.isDarkMode = newMode;
      document.body.classList.toggle("light-mode", !this.isDarkMode);
    },
    handleDataLoaded(data) {
      this.elementEmojis = data.elementEmojis;
      this.categories = data.categories;
      this.craftingRecipes = data.craftingRecipes;
    },
    handleAchievementsLoaded(achievements) {
      this.achievements = achievements;
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
      this.$refs.dataLoading.handleCraft();
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
    handleAchievementUnlocked(achievement) {
      this.newAchievement = achievement;
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