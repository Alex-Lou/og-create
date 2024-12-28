<template>
    <div id="inventory">
      <h2>Inventory</h2>
      <div v-for="(category, index) in filteredCategories" :key="index" class="category">
        <div class="category-header">
          <span class="category-title">{{ category.name }}</span>
          <div class="progress">
            <div class="progress-value" :style="{ width: category.progress + '%' }"></div>
            <div class="progress-bar-fill" :style="{ width: category.progress + '%' }"></div>
          </div>
        </div>
        <div class="category-content">
          <div v-for="element in category.elements" :key="element" class="inventory-item"
            @click="$emit('selectResource', element)">
            {{ elementEmojis[element] || '' }} {{ element }}
          </div>
        </div>
      </div>
  
      <!-- Feux d'artifice conditionnels -->
      <FireworkAnimation
        v-if="showFireworks"
        :key="fireworkKey + '-1'"
        :delay="0"
        :offsetX="100"
      />
      <FireworkAnimation
        v-if="showFireworks"
        :key="fireworkKey + '-2'"
        :delay="0.3"
        :offsetX="300"
      />
      <FireworkAnimation
        v-if="showFireworks"
        :key="fireworkKey + '-3'"
        :delay="0.6"
        :offsetX="500"
      />
    </div>
  </template>
  
  <script>
  import '@/assets/GameInventoryStyle.css';
  import FireworkAnimation from './FireWorkAnimation.vue';
  
  export default {
    components: {
      FireworkAnimation
    },
    props: {
      categories: {
        type: Object,
        required: true,
      },
      discoveredCategories: {
        type: Array,
        required: true,
      },
      discoveredElements: {
        type: Array,
        required: true,
      },
      elementEmojis: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        showFireworks: false,
        lastCompletedCategory: null,
        previousCategoriesState: {},
        fireworkKey: 0
      };
    },
    computed: {
      filteredCategories() {
        return Object.entries(this.categories)
          .map(([name, elements]) => {
            const filteredElements = Array.isArray(elements)
              ? elements.filter((el) => this.discoveredElements.includes(el))
              : [];
            return {
              name: name.replace(/_/g, " "),
              progress: (filteredElements.length / elements.length) * 100,
              elements: filteredElements,
              isComplete: filteredElements.length === elements.length
            };
          })
          .filter((category) => this.discoveredCategories.includes(category.name));
      }
    },
    watch: {
      // Surveiller les changements dans filteredCategories
      filteredCategories() {
  return Object.entries(this.categories)
    .map(([name, elements]) => {
      const filteredElements = Array.isArray(elements)
        ? elements.filter((el) => this.discoveredElements.includes(el))
        : [];
      
      // Ajout de logs pour débugger
      console.log(`Catégorie ${name}:`);
      console.log('Total elements:', elements.length);
      console.log('Elements filtrés:', filteredElements.length);
      console.log('Progress:', (filteredElements.length / elements.length) * 100);
      
      return {
        name: name.replace(/_/g, " "),
        progress: (filteredElements.length / elements.length) * 100,
        elements: filteredElements,
        isComplete: filteredElements.length === elements.length
      };
    })
    .filter((category) => this.discoveredCategories.includes(category.name));
}
    },
    methods: {
      checkNewCompletedCategory(categories) {
        // Vérifier si une catégorie vient d'être complétée
        const newlyCompleted = categories.find(category => {
          const wasCompleteBefore = this.previousCategoriesState[category.name]?.isComplete || false;
          return category.isComplete && !wasCompleteBefore;
        });
  
        if (newlyCompleted) {
          this.triggerFireworks();
        }
  
        // Mettre à jour l'état précédent
        this.previousCategoriesState = categories.reduce((acc, category) => {
          acc[category.name] = {
            isComplete: category.isComplete
          };
          return acc;
        }, {});
      },
      triggerFireworks() {
        this.fireworkKey++; // Force le re-render des animations
        this.showFireworks = true;
        setTimeout(() => {
          this.showFireworks = false;
        }, 2000);
      }
    },
    created() {
      // Initialiser l'état précédent des catégories
      this.previousCategoriesState = this.filteredCategories.reduce((acc, category) => {
        acc[category.name] = {
          isComplete: category.isComplete
        };
        return acc;
      }, {});
    }
  };
  </script>
  