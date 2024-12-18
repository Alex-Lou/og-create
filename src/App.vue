<template>
  <div id="game-container">
    <header>
      <h1>Infinite Craft</h1>
    </header>

    <main id="main-content">
      <div id="inventory" ref="inventory">
        <h2>Inventory</h2>
        <ul id="items" ref="inventoryItems"></ul>
      </div>

      <!-- Barre de séparation -->
      <div id="resizer" @mousedown="startResizing"></div>

      <div id="crafting-board" ref="craftingBoard">
        <div id="animation-frame" ref="animationFrame"></div>
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

    <!-- Popup pour l'élément créé -->
    <div id="crafted-popup" ref="craftedPopup">
      <p id="crafted-popup-content" ref="craftedPopupContent"></p>
    </div>

    <footer>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>

<script>
import './assets/style.css';

export default {
  data() {
    return {
      elementEmojis: {},
      craftingRecipes: {},
      categories: {}, // Toutes les catégories chargées
      discoveredCategories: ["Elements Fondamentaux"], // Catégories visibles au début
      discoveredElements: ["Eau", "Feu", "Terre", "Air"], // Éléments visibles au départ
      selected: [],
      isResizing: false, // Indique si l'utilisateur redimensionne
      startX: 0, // Position initiale de la souris
      initialInventoryWidth: 0 // Largeur initiale de l'inventaire
    };
  },
  methods: {
    async loadData() {
      try {
        const response = await fetch('./data/elements_data.json');
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
          this.craftingRecipes[key.split('+').sort().join('+')] = value;
        });

        this.populateInventory();
      } catch (error) {
        console.error('Erreur lors du chargement des données JSON :', error);
      }
    },
    populateInventory() {
      const inventory = this.$refs.inventory;
      inventory.innerHTML = '';

      Object.entries(this.categories).forEach(([category, elements]) => {
        if (!this.discoveredCategories.includes(category)) return; // Afficher uniquement les catégories débloquées

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'category';
        categoryDiv.innerHTML = `
          <div class="category-title">${category.replace(/_/g, ' ')}</div>
          <div class="category-content" style="display: none;"></div>
        `;

        const contentDiv = categoryDiv.querySelector('.category-content');

        elements.forEach(resource => {
          if (!this.discoveredElements.includes(resource)) return; // Afficher uniquement les éléments débloqués

          const item = document.createElement('div');
          const emoji = this.elementEmojis[resource] || '';
          item.className = 'inventory-item';
          item.innerHTML = `${emoji} ${resource}`;
          item.addEventListener('click', () => this.selectResource(resource));
          contentDiv.appendChild(item);
        });

        categoryDiv.addEventListener('mouseenter', () => {
          contentDiv.style.display = 'block';
        });
        categoryDiv.addEventListener('mouseleave', () => {
          contentDiv.style.display = 'none';
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
      selectedResources.innerHTML = '';
      this.selected.forEach(resource => {
        const emoji = this.elementEmojis[resource] || '';
        const item = document.createElement('li');
        item.innerHTML = `${emoji} ${resource}`;
        item.addEventListener('click', () => {
          this.selected.splice(this.selected.indexOf(resource), 1);
          this.updateSelectedResources();
        });
        selectedResources.appendChild(item);
      });
    },
    craftItem() {
      if (this.selected.length >= 2) {
        const sortedSelected = this.selected.sort().join('+');
        const craftedItem = this.craftingRecipes[sortedSelected];
        const craftedItemDisplay = this.$refs.craftedItemDisplay;

        if (craftedItem) {
          this.playAnimation();
          this.addToCategory(craftedItem);

          // Affiche le popup
          const emoji = this.elementEmojis[craftedItem] || '';
          this.showCraftedPopup(`${emoji} ${craftedItem}`);

          craftedItemDisplay.innerHTML = `Dernière création: ${emoji} ${craftedItem}`;
        } else {
          craftedItemDisplay.textContent = 'Invalid combination.';
        }

        this.selected = [];
        this.updateSelectedResources();
      } else {
        alert('Select at least 2 elements to craft!');
      }
    },
    showCraftedPopup(message) {
      const popup = this.$refs.craftedPopup;
      const popupContent = this.$refs.craftedPopupContent;

      if (popup && popupContent) {
        popupContent.textContent = message;
        popup.classList.add('show');

        // Masque le popup après 2.5 secondes
        setTimeout(() => {
          popup.classList.remove('show');
        }, 2500);
      }
    },
    playAnimation() {
      const animationFrame = this.$refs.animationFrame;
      animationFrame.classList.add('active');
      setTimeout(() => animationFrame.classList.remove('active'), 1000);
    },
    addToCategory(craftedItem) {
      const targetCategory = Object.keys(this.categories).find(category =>
        this.categories[category].includes(craftedItem)
      );

      if (targetCategory) {
        if (!this.discoveredCategories.includes(targetCategory)) {
          this.discoveredCategories.push(targetCategory); // Débloque la catégorie
        }
        if (!this.discoveredElements.includes(craftedItem)) {
          this.discoveredElements.push(craftedItem); // Débloque l'élément
        }
      }

      this.populateInventory();
    },
    handleKeyPress(event) {
      if (event.key === "Enter") {
        this.craftItem();
      }
    },
    startResizing(event) {
      this.isResizing = true;
      this.startX = event.clientX;
      this.initialInventoryWidth = this.$refs.inventory.offsetWidth;

      document.addEventListener("mousemove", this.resize);
      document.addEventListener("mouseup", this.stopResizing);
    },
    resize(event) {
      if (!this.isResizing) return;

      const deltaX = event.clientX - this.startX;
      const inventoryNewWidth = this.initialInventoryWidth + deltaX;
      const mainContentWidth = this.$refs.inventory.parentElement.offsetWidth;

      // Limite les tailles minimales et maximales
      const minInventoryWidth = 100;
      const maxInventoryWidth = mainContentWidth - 200;

      if (
        inventoryNewWidth >= minInventoryWidth &&
        inventoryNewWidth <= maxInventoryWidth
      ) {
        const inventoryFlex = inventoryNewWidth / mainContentWidth;
        const craftingFlex = 1 - inventoryFlex;

        this.$refs.inventory.style.flex = inventoryFlex;
        this.$refs.craftingBoard.style.flex = craftingFlex;
      }
    },
    stopResizing() {
      this.isResizing = false;
      document.removeEventListener("mousemove", this.resize);
      document.removeEventListener("mouseup", this.stopResizing);
    }
  },
  mounted() {
    this.loadData();

    // Écoute des événements clavier
    window.addEventListener("keydown", this.handleKeyPress);
  },
  beforeUnmount() {
    // Nettoyage de l'écoute des événements clavier
    window.removeEventListener("keydown", this.handleKeyPress);
  }
};
</script>
