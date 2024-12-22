<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    <DataLoading
      @data-loaded="handleDataLoaded"
      @achievements-loaded="handleAchievementsLoaded"
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
          @craft-success="handleCraftSuccess"
          @show-alert="showAlert"
          ref="craftSystem"
        />
      </div>
    </main>

    <CraftPopup 
      :craftedElement="craftedElement"
      @reset-crafted-element="resetCraftedElement"
    />

    <GameAchievementsPopup
      v-if="newAchievement"
      :achievement="newAchievement"
      :achievements="achievements"
      @close="closeAchievementPopup"
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
      this.achievements = achievements.map(achievement => ({
        ...achievement,
        condition: achievement.condition.bind(this)
      }));
    },
    handleResourceSelection(resource) {
      this.$refs.craftSystem.selectResource(resource);
    },
    handleCraftSuccess(craftedItem) {
      this.craftedElement = {
        name: craftedItem,
        image: require(`@/assets/creatures/${craftedItem}.png`),
      };
      this.addToCategory(craftedItem);
      this.checkAchievements();
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
    checkAchievements() {
      this.achievements.forEach((achievement) => {
        if (!achievement.unlocked && achievement.condition()) {
          achievement.unlocked = true;
          this.newAchievement = achievement;
        }
      });
    },
    closeAchievementPopup() {
      this.newAchievement = null;
    },
    resetCraftedElement() {
      this.craftedElement = { name: "", image: null };
    },
    showAlert(message) {
      alert(message);
    }
  }
};
</script>
<style scoped>
@import "@/assets/SuccessPopupStyle.css"; /* Chemin vers ton fichier CSS */
</style>


Je vais vous aider à ajouter un effet de particules colorées au centre de votre popup de succès. Je vais créer un composant React complet qui inclut l'animation GSAP pour les particules.


Popup de succès avec particules
Click to open code
J'ai ajouté un système complet de particules avec les fonctionnalités suivantes :

Les particules sont générées depuis le centre du popup
Chaque particule a :
Une couleur aléatoire parmi une palette prédéfinie
Une direction aléatoire (360 degrés)
Une distance aléatoire (entre 100 et 200 pixels)
Une animation de disparition progressive
Gestion appropriée du cycle de vie :
Les particules sont créées quand le popup s'affiche
Nettoyage automatique des particules après l'animation
Cleanup complet lors de la fermeture du popup
Fonctionnalités clés :
Animation fluide avec GSAP
Système optimisé avec will-change et transform: translate3d
Gestion de la mémoire avec suppression automatique des éléments
Container en position absolue pour ne pas interférer avec le contenu
Pour utiliser ce code, assurez-vous d'avoir installé GSAP :

bash

Copy
npm install gsap
Voulez-vous que je modifie certains paramètres comme :

Le nombre de particules
La palette de couleurs
La vitesse ou la distance des particules
L'effet d'animation (timing, easing, etc.) ?
Copy
Retry



L
pas une seule partticule n'apparait et le gsap est bien installé, revise!


Je vais corriger le code pour m'assurer que les particules apparaissent bien.


Popup de succès avec particules - Corrigé
Click to open code
Les principales corrections apportées sont :

Ajout d'un délai d'initialisation avec setTimeout pour s'assurer que le DOM est prêt
Utilisation de getBoundingClientRect() pour obtenir les dimensions réelles
Correction du positionnement initial des particules avec transform: translate(-50%, -50%)
Utilisation de gsap.timeline() pour une meilleure gestion des animations
Ajout de la propriété inset: 0 au conteneur des particules
Réduction de la distance des particules (50-150px au lieu de 100-200px)
Ajustement des durées d'animation pour plus de dynamisme
Gestion correcte du z-index entre les particules et le contenu
Import correct de GSAP avec destructuration : import { gsap } from 'gsap';
Les particules devraient maintenant apparaître correctement au centre du popup et se disperser dans toutes les directions. Voulez-vous que j'ajuste certains paramètres comme :

La vitesse des particules
La taille des particules
Le nombre de particules
Les couleurs ?
Copy
Retry


Claude can make mistakes. Please double-check responses.
