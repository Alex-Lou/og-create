<template>
  <div :class="['game-container', { 'dark-mode': isDarkMode }]" id="game-container">
    <!-- Menu déroulant des succès -->
    <div id="achievements-menu">
      <p>Succès</p>
      <div id="achievements-content">
        <ul>
          <li v-for="(achievement, index) in achievements" :key="index" :class="{ unlocked: achievement.unlocked }">
            <img v-if="achievement.image" :src="achievement.image" alt="" class="achievement-icon" />
            {{ achievement.name }} - {{ achievement.description }}
          </li>
        </ul>
      </div>
    </div>

    <!-- En-tête de la page -->
    <header>
      <h1>Origins Creation</h1>
      <DarkToggle :isDarkMode="isDarkMode" @update:darkMode="updateDarkMode" />
    </header>

    <!-- Contenu principal -->
    <main id="main-content">
      <GameInventory
        :categories="categories"
        :discoveredCategories="discoveredCategories"
        :discoveredElements="discoveredElements"
        :elementEmojis="elementEmojis"
        @selectResource="selectResource"
      />

      <BoardResizing
        :initialInventoryWidth="initialInventoryWidth"
        :mainContentWidth="$refs.inventory?.parentElement.offsetWidth || 0"
        @resizeStart="onResizeStart"
        @resizeUpdate="onResizeUpdate"
        @resizeEnd="onResizeEnd"
      />

      <div id="crafting-board" ref="craftingBoard">
        <div id="animation-frame" ref="animationFrame">
          <template v-if="isDarkMode">
            <div class="firefly" v-for="n in 20" :key="n"></div>
          </template>
        </div>

        <div id="crafting">
          <h2>Creation Zone</h2>
          <div id="selection">
            <ul id="selected-resources">
              <li v-for="(resource, index) in selected" :key="index" @click="removeResource(index)">
                {{ elementEmojis[resource] || '' }} {{ resource }}
              </li>
            </ul>
            <button id="craft-button" @click="craftItem">Craft</button>
          </div>
          <div id="crafted-result">
            <p id="crafted-item" ref="craftedItemDisplay"></p>
          </div>
        </div>
      </div>
    </main>

    <!-- Popup unifié pour l'élément créé -->
    <div id="crafted-popup" ref="craftedPopup" :class="{ show: craftedElement.name }">
      <div class="popup-content">
        <img v-if="craftedElement.image" :src="craftedElement.image" :alt="craftedElement.name" />
        <p>{{ craftedElement.name }}</p>
      </div>
    </div>

    <!-- Popup pour succès -->
    <GameAchievementsPopup
      v-if="newAchievement"
      :achievement="newAchievement"
      :achievements="achievements"
      @close="closeAchievementPopup"
    />

    <!-- Pied de page -->
    <footer>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>

<script>
import DarkToggle from "./components/DarkToggle.vue";
import BoardResizing from "./components/BoardResizing.vue";
import GameAchievementsPopup from "./components/GameAchievementsPopup.vue";
import GameInventory from "./components/GameInventory.vue";

import './assets/style.css';

export default {
  components: {
    DarkToggle,
    BoardResizing,
    GameAchievementsPopup,
    GameInventory,
  },
  data() {
    return {
      elementEmojis: {},
      craftingRecipes: {},
      categories: {},
      discoveredCategories: ["Elements Fondamentaux"],
      discoveredElements: ["Eau", "Feu", "Terre", "Air"],
      selected: [],
      initialInventoryWidth: 0,
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
    onResizeStart() {
      this.initialInventoryWidth = this.$refs.inventory.offsetWidth;
    },
    onResizeUpdate(newWidth) {
      const mainContentWidth = this.$refs.inventory.parentElement.offsetWidth;

      const inventoryFlex = newWidth / mainContentWidth;
      const craftingFlex = 1 - inventoryFlex;

      this.$refs.inventory.style.flex = inventoryFlex;
      this.$refs.craftingBoard.style.flex = craftingFlex;
    },


    
    async loadAchievements() {
      try {
        const response = await fetch("/data/achievements.json");
        const data = await response.json();

        this.achievements = data.map((achievement) => ({
          ...achievement,
          image: require(`@/assets/success/${achievement.name}.png`),
          condition: new Function("return " + achievement.condition).bind(this),
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des succès :", error);
      }
    },
    async loadData() {
      try {
        const response = await fetch("/data/elements_data.json");
        const data = await response.json();

        this.elementEmojis = {};
        this.categories = {};

        Object.entries(data.elements).forEach(([category, elements]) => {
          this.categories[category] = [];
          Object.entries(elements).forEach(([name, emoji]) => {
            this.elementEmojis[name.trim()] = emoji;
            this.categories[category].push(name.trim());
          });
        });

        this.craftingRecipes = {};
        Object.entries(data.rules).forEach(([key, value]) => {
          this.craftingRecipes[key.split("+").sort().join("+")] = value;
        });
      } catch (error) {
        console.error("Erreur lors du chargement des données JSON :", error);
      }
    },


    selectResource(resource) {
      if (this.selected.length < 4) {
        this.selected.push(resource.trim());
      } else {
        alert("You can only select up to 3 elements for crafting!");
      }
    },


    removeResource(index) {
      this.selected.splice(index, 1);
    },


    craftItem() {
      if (this.selected.length >= 2) {
        const sortedSelected = this.selected.sort().join("+");
        const craftedItem = this.craftingRecipes[sortedSelected];

        if (craftedItem) {
          this.craftedElement = {
            name: craftedItem,
            image: require(`@/assets/creatures/${craftedItem}.png`),
          };
          this.addToCategory(craftedItem);
          this.checkAchievements();
          this.showCraftedPopup();
        } else {
          alert("Invalid combination.");
        }

        this.selected = [];
      } else {
        alert("Select at least 2 elements to craft!");
      }
    },


    addToCategory(craftedItem) {
      const targetCategory = Object.keys(this.categories).find((category) =>
        this.categories[category].includes(craftedItem)
      );

      if (targetCategory && !this.discoveredElements.includes(craftedItem)) {
        this.discoveredElements.push(craftedItem);
        // Ajouter la catégorie à discoveredCategories si elle n'existe pas déjà
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
    showCraftedPopup() {
      const popup = this.$refs.craftedPopup;
      popup.classList.add("show");

      setTimeout(() => {
        popup.classList.remove("show");
        this.craftedElement = { name: "", image: null }; // Réinitialisation de l'élément après fermeture
      }, 2500); // Assure que le popup reste pendant 2.5 secondes
    },

    // Gestion de la touche "Entrée" pour valider le craft
    handleKeyPress(event) {
      if (event.key === "Enter") {
        this.craftItem();
      }
    },
  },
  async mounted() {
    await this.loadAchievements();
    await this.loadData();
    
    // Ajout de l'écouteur pour la touche "Entrée"
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    // Nettoyage de l'écouteur d'événements pour éviter les fuites mémoire
    window.removeEventListener("keydown", this.handleKeyPress);
  },
};
</script>

