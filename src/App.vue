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
      <div id="inventory" ref="inventory">
        <h2>Inventory</h2>
        <ul id="items" ref="inventoryItems"></ul>
      </div>

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
            <ul id="selected-resources" ref="selectedResources"></ul>
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

    <!-- Popup pour les succès -->
    <XyzTransition appear duration="auto" mode="out-in">
      <div v-if="newAchievement" id="achievement-popup" class="xyz-in"
        xyz="appear-front-5 fade flip-down-50% duration-5 ease-elastic-out-10">
        <div ref="particleContainer" class="gsap-particles-container"></div>
        <div class="popup-content">
          <button class="close-button" @click="closeAchievementPopup">×</button>
          <img v-if="newAchievement?.image" :src="newAchievement.image" :alt="newAchievement.name" class="xyz-nested"
            xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back" />
          <div class="achievement-text xyz-nested" xyz="fade up small-75% delay-3">
            <h3>{{ newAchievement?.name }}</h3>
            <p>{{ newAchievement?.description }}</p>
          </div>
        </div>
      </div>
    </XyzTransition>

    <!-- Pied de page -->
    <footer>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>



<script>
import DarkToggle from "./components/DarkToggle.vue";
import BoardResizing from "./components/BoardResizing.vue";
import './assets/style.css';
import { gsap } from "gsap";

export default {
  components: {
    DarkToggle,
    BoardResizing,
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
      achievements: [
        {
          name: "Apprenti Dieu",
          description: "Découvrez 10 éléments.",
          unlocked: false,
          condition: () => this.discoveredElements.length >= 1,
          image: require('@/assets/success/Apprenti Dieu.png'),
        },
        {
          name: "Maître Créateur",
          description: "Découvrez 20 éléments.",
          unlocked: false,
          condition: () => this.discoveredElements.length >= 20,
          image: require('@/assets/success/Maître Créateur.png'),
        },
      ],
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
    onResizeEnd() {
      // Actions nécessaires après le redimensionnement
    },
    closeAchievementPopup() {
      this.newAchievement = null;
    },
    async loadData() {
      try {
        const response = await fetch("./data/elements_data.json");
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

        this.populateInventory();
      } catch (error) {
        console.error("Erreur lors du chargement des données JSON :", error);
      }
    },
    populateInventory() {
      const inventory = this.$refs.inventory;
      inventory.innerHTML = "";

      Object.entries(this.categories).forEach(([category, elements]) => {
        if (!this.discoveredCategories.includes(category)) return;

        const discoveredCount = elements.filter((resource) =>
          this.discoveredElements.includes(resource)
        ).length;
        const progress = Math.floor((discoveredCount / elements.length) * 100);

        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";

        categoryDiv.innerHTML = `
              <div class="category-header">
                <span class="category-title">${category.replace(/_/g, " ")}</span>
                <div class="progress-bar">
                  <div class="progress-bar-fill" style="width: ${progress}%;"></div>
                </div>
              </div>
              <div class="category-content" style="display: none;"></div>
            `;

        const contentDiv = categoryDiv.querySelector(".category-content");

        elements.forEach((resource) => {
          if (!this.discoveredElements.includes(resource)) return;

          const item = document.createElement("div");
          const emoji = this.elementEmojis[resource] || "";
          item.className = "inventory-item";
          item.innerHTML = `${emoji} ${resource}`;
          item.addEventListener("click", () => this.selectResource(resource));
          contentDiv.appendChild(item);
        });

        categoryDiv.addEventListener("mouseenter", () => {
          contentDiv.style.display = "block";
        });
        categoryDiv.addEventListener("mouseleave", () => {
          contentDiv.style.display = "none";
        });

        inventory.appendChild(categoryDiv);
      });
    },
    selectResource(resource) {
      if (this.selected.length < 4) {
        this.selected.push(resource.trim());
        this.updateSelectedResources();
      } else {
        alert("You can only select up to 3 elements for crafting!");
      }
    },
    updateSelectedResources() {
      const selectedResources = this.$refs.selectedResources;
      selectedResources.innerHTML = "";
      this.selected.forEach((resource) => {
        const emoji = this.elementEmojis[resource] || "";
        const item = document.createElement("li");
        item.innerHTML = `${emoji} ${resource}`;
        item.addEventListener("click", () => {
          this.selected.splice(this.selected.indexOf(resource), 1);
          this.updateSelectedResources();
        });
        selectedResources.appendChild(item);
      });
    },
    craftItem() {
      if (this.selected.length >= 2) {
        const sortedSelected = this.selected.sort().join("+");
        const craftedItem = this.craftingRecipes[sortedSelected];

        if (craftedItem) {
          this.playAnimation();
          this.addToCategory(craftedItem);
          this.checkAchievements();

          try {
            const imagePath = require(`@/assets/creatures/${craftedItem}.png`);
            this.showCraftedPopup(craftedItem, imagePath);
          } catch (error) {
            console.warn(`No image found for element: ${craftedItem}`);
            this.showCraftedPopup(craftedItem, null);
          }

          this.$refs.craftedItemDisplay.textContent = `Dernière création: ${craftedItem}`;
        } else {
          this.$refs.craftedItemDisplay.textContent = "Invalid combination.";
        }

        this.selected = [];
        this.updateSelectedResources();
      } else {
        alert("Select at least 2 elements to craft!");
      }
    },
    showCraftedPopup(elementName, imagePath) {
      this.craftedElement = { name: elementName, image: imagePath };

      const popup = this.$refs.craftedPopup;
      popup.classList.add("show");

      setTimeout(() => {
        popup.classList.remove("show");
        this.craftedElement = { name: "", image: null };
      }, 2500);
    },
    playAnimation() {
      const animationFrame = this.$refs.animationFrame;
      animationFrame.classList.add("active");
      setTimeout(() => animationFrame.classList.remove("active"), 1000);
    },
    addToCategory(craftedItem) {
      const targetCategory = Object.keys(this.categories).find((category) =>
        this.categories[category].includes(craftedItem)
      );

      if (targetCategory) {
        if (!this.discoveredCategories.includes(targetCategory)) {
          this.discoveredCategories.push(targetCategory);
        }
        if (!this.discoveredElements.includes(craftedItem)) {
          this.discoveredElements.push(craftedItem);
        }
      }

      this.populateInventory();
    },
    checkAchievements() {
      this.achievements.forEach((achievement) => {
        if (!achievement.unlocked && achievement.condition()) {
          achievement.unlocked = true;
          this.showAchievementPopup(achievement);
        }
      });
    },
    showAchievementPopup(achievement) {
      if (achievement) {
        this.newAchievement = achievement;
      }
    },
    handleKeyPress(event) {
      if (event.key === "Enter") {
        this.craftItem();
      }
    },
    spawnParticles() {
      const container = this.$refs.particleContainer;
      if (!container) return;

      container.innerHTML = '';

      const shapes = ['circle', 'square', 'triangle', 'star'];
      const colors = ['#FF8B8B', '#FFD93D', '#2DCDDF', '#FF6464', '#FFC436'];
      const particleCount = 150;
      const particles = [];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        particle.classList.add(`particle-${shape}`);
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(particle);
        particles.push(particle);

        gsap.set(particle, {
          x: "50%",
          y: "50%",
          scale: 0.1,
          opacity: 1
        });

        const angle = Math.random() * Math.PI * 2;
        const velocity = 120 + Math.random() * 180;
        const rotationSpeed = (Math.random() - 0.5) * 720;

        const tl = gsap.timeline();

        tl.to(particle, {
          duration: 0.8 + Math.random() * 0.4,
          x: `+=${Math.cos(angle) * velocity}%`,
          y: `+=${Math.sin(angle) * velocity}%`,
          scale: 0.6 + Math.random() * 0.8,
          rotation: rotationSpeed,
          ease: "power2.out"
        })
          .to(particle, {
            duration: 1 + Math.random() * 0.5,
            y: "+=100",
            x: `+=${(Math.random() - 0.5) * 50}`,
            scale: 0.2,
            opacity: 0,
            rotation: `+=${rotationSpeed * 0.5}`,
            ease: "power1.in"
          }, "-=0.2");
      }
    },
  },
  mounted() {
    this.loadData();
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener("keydown", this.handleKeyPress);
  },
};
</script>

