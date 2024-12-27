<template>
  <!-- Le reste du template reste inchangé -->
  <div id="crafting-board" ref="craftingBoard">
    <WaveAnimation />
    <div class="animation-container">
      <FireworkAnimation />
      <FireworkAnimation :delay="0.4" :offsetX="50" />
      <FireworkAnimation :delay="0.8" :offsetX="-200" />
    </div>
    <div id="crafting">
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
          >
            {{ elementEmojis[resource] || '' }} {{ resource }}
          </li>
        </ul>
      </div>
      <div id="crafted-result">
        <p id="crafted-item" ref="craftedItemDisplay"></p>
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
  },
  data() {
    return {
      selected: [],
      isFireworkActive: false,
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
      this.isFireworkActive = false;
    },
    resetSelection() {
      this.selected = [];
    },
    removeResource(index) {
      this.selected.splice(index, 1);
    },
    craftItem() {
      // Vérifier d'abord si on a assez d'éléments
      if (this.selected.length < 2) {
        this.$emit('show-alert', 'Select at least 2 elements to craft!');
        return;
      }

      // Ensuite, vérifier si la combinaison est valide
      const sortedSelected = this.selected.sort().join('+');
      const craftedItem = this.craftingRecipes[sortedSelected];

      // Si la combinaison est invalide
      if (!craftedItem) {
        this.$emit('show-alert', 'Invalid combination.');
        return;
      }

      // Si on arrive ici, on peut faire le craft
      this.isFireworkActive = true;
      setTimeout(() => {
        this.$emit('craft-success', craftedItem);
        this.isFireworkActive = false;
        this.selected = [];  // Vider la sélection après un craft réussi
      }, 2);
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
</style>