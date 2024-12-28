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
    isFireworkActive: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selected: [],
      discoveredCategories: new Set(),
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
      this.selected = [];
    },
    removeResource(index) {
      this.selected.splice(index, 1);
    },
    craftItem() {
      if (this.selected.length < 2) {
        this.$emit('show-alert', 'Select at least 2 elements to craft!');
        return;
      }

      const sortedSelected = this.selected.sort().join('+');
      const craftedItem = this.craftingRecipes[sortedSelected];

      if (!craftedItem) {
        this.$emit('show-alert', 'Invalid combination.');
        return;
      }

      const category = this.getCraftedItemCategory(craftedItem);
      if (category && !this.discoveredCategories.has(category)) {
        this.discoveredCategories.add(category);
      }

      setTimeout(() => {
        this.$emit('craft-success', craftedItem);
        this.selected = [];
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
