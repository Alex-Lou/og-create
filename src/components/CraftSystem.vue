<template>
  <div id="crafting-board" ref="craftingBoard">
    <WaveAnimation />
    <div class="animation-container">
      <!-- Feux d'artifice conditionnels -->
      <template v-if="isFireworkActive">
        <FireworkAnimation />
        <FireworkAnimation :delay="0.4" :offsetX="50" />
        <FireworkAnimation :delay="0.8" :offsetX="-200" />
      </template>
    </div>
    <div id="crafting" @dragover.prevent @drop="handleDrop">
      <div class="title-container">
        <h2 class="animated-text">Creation Zone</h2>
        <VoltageAnimation @click="craftItem">
          Craft
        </VoltageAnimation>
      </div>
      <div id="selection">
        <ul id="selected-resources">
          <li
            v-for="(resource, index) in selected"
            :key="index"
            @click="removeResource(index)"
            draggable="true"
            @dragstart="dragStart(resource)"
          >
            {{ elementEmojis[resource] || '' }} {{ resource }}
          </li>
        </ul>
      </div>
      <div id="crafted-result">
        <p id="crafted-item" ref="craftedItemDisplay"></p>
      </div>
      <div
        v-if="craftedElement"
        :style="{ top: craftedElementPosition.top + 'px', left: craftedElementPosition.left + 'px' }"
        draggable="true"
        @dragstart="dragStartCraftedElement"
        @dragend="dragEndCraftedElement"
        @click="removeCraftedElement"
        class="crafted-element"
      >
        <p>{{ elementEmojis[craftedElement] || '' }} {{ craftedElement }}</p>
      </div>
    </div>
    <button
      class="reset-crafting-button"
      style="--content: 'Clean';"
      @click="resetCraftingBoard"
    >
      Clean
    </button>
    <footer>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>

<script>
import WaveAnimation from './WaveAnimation.vue';
import FireworkAnimation from './FireWorkAnimation.vue';
import VoltageAnimation from './VoltageAnimation.vue';

export default {
  name: 'CraftSystem',
  components: {
    WaveAnimation,
    FireworkAnimation,
    VoltageAnimation,
  },
  props: {
    elementEmojis: {
      type: Object,
      required: true,
    },
    craftingRecipes: {
      type: Object,
      required: true,
    },
    isDarkMode: {
      type: Boolean,
      required: true,
    },
    isFireworkActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      discoveredCategories: new Set(),
      alertShown: false,
      craftingInProgress: false,
      craftedElement: null, // Ajout de l'état pour l'élément créé
      craftedElementPosition: { top: 0, left: 0 }, // Position de l'élément créé
    };
  },
  methods: {
    selectResource(resource) {
      if (this.selected.length < 4 && resource && this.elementEmojis[resource]) {
        this.selected.push(resource.trim());
      } else {
        this.$emit('show-alert', 'You can only select up to 3 elements for crafting!');
      }
    },
    resetCraftingBoard() {
      this.resetSelection();
      this.alertShown = false;
      this.craftingInProgress = false;
      this.craftedElement = null; // Réinitialiser l'élément créé
      this.craftedElementPosition = { top: 0, left: 0 }; // Réinitialiser la position
    },
    resetSelection() {
      this.selected = [];
    },
    removeResource(index) {
      this.selected.splice(index, 1);
    },
    removeCraftedElement() {
      this.craftedElement = null; // Réinitialiser l'élément créé
      this.craftedElementPosition = { top: 0, left: 0 }; // Réinitialiser la position
    },
    craftItem() {
      if (this.craftingInProgress) {
        return;
      }

      this.craftingInProgress = true;

      if (this.selected.length < 2) {
        if (!this.alertShown) {
          this.$emit('show-alert', 'Select at least 2 elements to craft!');
          this.alertShown = true;
        }
        this.craftingInProgress = false;
        return;
      }

      const sortedSelected = this.selected.sort().join('+');
      const craftedItem = this.craftingRecipes[sortedSelected];

      if (!craftedItem) {
        this.$emit('show-alert', 'Invalid combination.');
        this.craftingInProgress = false;
        return;
      }

      const category = this.getCraftedItemCategory(craftedItem);
      if (category && !this.discoveredCategories.has(category)) {
        this.discoveredCategories.add(category);
      }

      setTimeout(() => {
        this.$emit('craft-success', craftedItem);
        this.selected = [];
        this.alertShown = false;
        this.craftingInProgress = false;
        this.craftedElement = craftedItem; // Mettre à jour l'élément créé
        this.craftedElementPosition = { top: 200, left: 50 }; // Position initiale
      }, 1);
    },
    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.craftItem();
      }
    },
    getCraftedItemCategory(item) {
      for (const key in this.craftingRecipes) {
        if (this.craftingRecipes[key] === item) {
          return key.split('+')[0];
        }
      }
      return null;
    },
    handleDrop(event) {
      const element = event.dataTransfer.getData('text/plain');
      if (element && this.elementEmojis[element] && !this.selected.includes(element) && element !== this.craftedElement) {
        this.selectResource(element);
      }
    },
    dragStart(resource) {
      event.dataTransfer.setData('text/plain', resource);
    },
    dragStartCraftedElement(event) {
      event.dataTransfer.setData('text/plain', this.craftedElement);
      event.dataTransfer.effectAllowed = 'move';
    },
    dragEndCraftedElement(event) {
      const craftingBoardRect = this.$refs.craftingBoard.getBoundingClientRect();
      const x = event.clientX - craftingBoardRect.left;
      const y = event.clientY - craftingBoardRect.top;
      this.craftedElementPosition = { top: y, left: x };
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyPress);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyPress);
  },
};
</script>

<style scoped>
@import "@/assets/CraftSystemStyle.css";

</style>
