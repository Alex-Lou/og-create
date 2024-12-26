<template>
  <div id="crafting-board" ref="craftingBoard">
    <WaveAnimation />
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
    <button class="reset-crafting-button" @click="resetCraftingBoard">Reset Crafting</button>
    <footer>
      <p>Created with ❤️ by CybWolf.</p>
    </footer>
  </div>
</template>

<script>
import WaveAnimation from './WaveAnimation.vue';

export default {
  name: 'CraftSystem',
  components: {
    WaveAnimation,
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
  },
  data() {
    return {
      selected: [],
    };
  },
  methods: {
    selectResource(resource) {
      if (this.selected.length < 4) {
        this.selected.push(resource.trim());
      } else {
        this.$emit('show-alert', 'You can only select up to 3 elements for crafting!');
      }
    },
    resetCraftingBoard() {
      this.resetSelection();
    },
    resetSelection() {
      this.selected = []; // Réinitialise la sélection
    },
    removeResource(index) {
      this.selected.splice(index, 1);
    },
    craftItem() {
      if (this.selected.length >= 2) {
        const sortedSelected = this.selected.sort().join('+');
        const craftedItem = this.craftingRecipes[sortedSelected];

        if (craftedItem) {
          this.$emit('craft-success', craftedItem);
        } else {
          this.$emit('show-alert', 'Invalid combination.');
        }

        this.selected = [];
      } else {
        this.$emit('show-alert', 'Select at least 2 elements to craft!');
      }
    },
    handleKeyPress(event) {
      if (event.key === 'Enter') {
        this.craftItem();
      }
    },
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
/* Chemin vers ton fichier CSS */
</style>
