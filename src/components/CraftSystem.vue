<template>
  <div id="crafting-board" ref="craftingBoard">
    <WaveAnimation />
    <div class="animation-container">
      <!-- Feu d'artifice central -->
      <div class="firework-container">
        <div class="firework"></div>
        <div class="explosion">
          <div class="particle" v-for="n in 12" :key="n" :style="getParticleStyle(n)"></div>
        </div>
      </div>
      <!-- Nouveau feu d'artifice à droite du premier -->
      <div class="firework-container right-offset">
        <div class="firework"></div>
        <div class="explosion">
          <div class="particle" v-for="n in 12" :key="n" :style="getParticleStyle(n)"></div>
        </div>
      </div>
      <!-- Nouveau feu d'artifice à gauche du premier -->
      <div class="firework-container left-offset">
        <div class="firework"></div>
        <div class="explosion">
          <div class="particle" v-for="n in 12" :key="n" :style="getParticleStyle(n)"></div>
        </div>
      </div>
    </div>
    <div id="crafting">
      <h2>Creation Zone</h2>
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
        <button id="craft-button" @click="craftItem">Craft</button>
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
    getParticleStyle(n) {
      const angle = (n * 30) % 360; // 30 degrés entre chaque particule
      const distance = 150; // Distance de dispersion
      const x = Math.cos(angle * Math.PI / 180) * distance;
      const y = Math.sin(angle * Math.PI / 180) * distance;
      const hue = (n * 30) % 360; // Couleur HSL différente pour chaque particule
      return {
        '--x': `${x}px`,
        '--y': `${y}px`,
        '--hue': `${hue}`,
      };
    },
    craftItem() {
      if (this.selected.length >= 2) {
        const sortedSelected = this.selected.sort().join('+');
        const craftedItem = this.craftingRecipes[sortedSelected];

        if (craftedItem) {
          this.isFireworkActive = true;
          setTimeout(() => {
            this.$emit('craft-success', craftedItem);
            this.isFireworkActive = false;
          }, 2);
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
</style>
