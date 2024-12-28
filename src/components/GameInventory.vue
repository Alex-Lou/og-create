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
  </div>
</template>

<script>
import '@/assets/GameInventoryStyle.css';

export default {
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
      lastCompletedCategory: null,
      previousCategoriesState: {},
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
    filteredCategories: {
      handler(newCategories) {
        this.checkNewCompletedCategory(newCategories);
      },
      deep: true
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
        // this.triggerFireworks(); // Supprimé pour éviter le déclenchement de l'animation
      }

      // Mettre à jour l'état précédent
      this.previousCategoriesState = categories.reduce((acc, category) => {
        acc[category.name] = {
          isComplete: category.isComplete
        };
        return acc;
      }, {});
    },
  },
  created() {
    this.previousCategoriesState = this.filteredCategories.reduce((acc, category) => {
      acc[category.name] = {
        isComplete: category.isComplete
      };
      return acc;
    }, {});
  }
};
</script>
