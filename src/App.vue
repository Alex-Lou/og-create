<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    
    <!-- CHARGEMENT DATA ET SUCCÈS -->
    <DataLoading
      ref="dataLoading"
      @data-loaded="handleDataLoaded"
      @achievements-loaded="handleAchievementsLoaded"
      @achievement-unlocked="handleAchievementUnlocked"
    />

    <!-- MENU SUCCÈS (Trophée) -->
    <GameAchievementsContent :achievements="achievements" />

    <!-- HEADER -->
    <header>
      <img src="@/assets/Svgs/Logo.png" alt="Logo" class="logo" />
      <h1>Origins Creation</h1>
      <DarkToggle :isDarkMode="isDarkMode" @update:darkMode="updateDarkMode" />
    </header>

    <!-- CONTENU PRINCIPAL -->
    <main id="main-content" ref="mainContent">
      
      <!-- INVENTAIRE -->
      <div ref="inventory" class="inventory-wrapper">
        <GameInventory
          :categories="categories"
          :discoveredCategories="discoveredCategories"
          :discoveredElements="discoveredElements"
          :elementEmojis="elementEmojis"
          @selectResource="handleResourceSelection"
        />
      </div>

      <!-- ESPACE ENTRE (GameSizer) -->
      <GameSizer />

      <!-- ZONE DE CRAFT -->
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

    <!-- POPUP CRAFT (affiche l'élément créé) -->
    <CraftPopup
      :craftedElement="craftedElement"
      :elementEmojis="elementEmojis"
      @reset-crafted-element="resetCraftedElement"
    />

    <!-- POPUP DE SUCCÈS DÉBLOQUÉ -->
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
/* IMPORT DES COMPOSANTS */
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
      /* Données générales du jeu */
      elementEmojis: {},
      craftingRecipes: {},
      categories: {},

      /* Découvertes côté parent (pour affichage inventaire, etc.) */
      discoveredCategories: ["Elements Fondamentaux"],
      discoveredElements: ["Eau", "Feu", "Terre", "Air"],

      /* Mode sombre ? */
      isDarkMode: true,

      /* Pour le popup après craft */
      craftedElement: {
        name: "",
        image: null,
      },

      /* Liste des achievements */
      achievements: [],

      /* Le succès tout juste débloqué (pour afficher la popup) */
      newAchievement: null,

      /* Feux d'artifices ? */
      isFireworkActive: false,
    };
  },
  methods: {
    // =================================
    // GESTION DU MODE SOMBRE
    // =================================
    updateDarkMode(newMode) {
      this.isDarkMode = newMode;
      document.body.classList.toggle("light-mode", !this.isDarkMode);
    },

    // =================================
    // CALLBACK : DONNÉES DU JEU CHARGÉES
    // =================================
    handleDataLoaded(data) {
      /* On récupère ici : elementEmojis, categories, craftingRecipes */
      this.elementEmojis = data.elementEmojis;
      this.categories = data.categories;
      this.craftingRecipes = data.craftingRecipes;
    },

    // =================================
    // CALLBACK : SUCCÈS CHARGÉS
    // =================================
    handleAchievementsLoaded(achievements) {
      this.achievements = achievements;
    },

    // =================================
    // QUAND UN SUCCESS EST DÉBLOQUÉ
    // =================================
    handleAchievementUnlocked(achievement) {
      this.newAchievement = achievement;
    },

    // =================================
    // SÉLECTION D'UNE RESSOURCE (INVENTAIRE)
    // =================================
    handleResourceSelection(resource) {
      this.$refs.craftSystem.selectResource(resource);
    },

    // =================================
    // QUAND UN ÉLÉMENT EST CRAFTÉ
    // =================================
    handleCraftSuccess(craftedItem) {
      // 1) On essaye d'afficher l'image correspondante dans le popup
      try {
        this.craftedElement = {
          name: craftedItem,
          image: require(`@/assets/creatures/${craftedItem}.png`),
        };
      } catch (error) {
        // Si pas d'image dans creatures, on met null
        this.craftedElement = {
          name: craftedItem,
          image: null,
        };
      }

      // 2) L'ajouter à la liste discoveredElements du parent
      //    (pour l'affichage dans l'inventaire)
      this.addToCategory(craftedItem);

      // 3) Informer DataLoading pour qu'il vérifie les succès
      //    On lui envoie le nom de l'élément découvert ("Vie" par ex.)
      this.$refs.dataLoading.handleCraft(craftedItem);
    },

    // =================================
    // AJOUT DE L'ÉLÉMENT DANS LA CATÉGORIE CORRESPONDANTE
    // =================================
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

    // =================================
    // FERMETURE DU POPUP DE SUCCÈS
    // =================================
    closeAchievementPopup() {
      this.newAchievement = null;
    },

    // =================================
    // RÉINITIALISER LE POPUP DE CRAFT
    // =================================
    resetCraftedElement() {
      this.craftedElement = { name: "", image: null };
    },

    // =================================
    // ALERT SIMPLE
    // =================================
    showAlert(message) {
      alert(message);
    },

    // =================================
    // QUAND LE POPUP DE SUCCÈS S'OUVRE, LANCER LES FEUX D'ARTIFICE
    // =================================
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
/* Importez votre style global ou css si besoin */
</style>
