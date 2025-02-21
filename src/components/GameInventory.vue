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
        <div
          v-for="element in category.elements"
          :key="element"
          class="inventory-item"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @dragend="endDrag"
          @click="$emit('selectResource', element)"
        >
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
    isTimerMode: {
      type: Boolean,
      default: false
    },
    timerQuestionElements: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      lastCompletedCategory: null,
      previousCategoriesState: {},
    };
  },
  computed: {
    filteredCategories() {
      if (this.isTimerMode && this.timerQuestionElements.length > 0) {
        return [{
          name: 'Timer Elements',
          progress: 100,
          elements: this.timerQuestionElements,
          isComplete: true
        }];
      }

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
      const newlyCompleted = categories.find(category => {
        const wasCompleteBefore = this.previousCategoriesState[category.name]?.isComplete || false;
        return category.isComplete && !wasCompleteBefore;
      });

      if (newlyCompleted) {
        console.log('Nouvelle catégorie complétée:', newlyCompleted);
      }

      this.previousCategoriesState = categories.reduce((acc, category) => {
        acc[category.name] = {
          isComplete: category.isComplete
        };
        return acc;
      }, {});
    },
    startDrag(event, element) {
      if (element) {
        event.dataTransfer.setData('text/plain', element);
      }
    },
    endDrag(event) {
      event.dataTransfer.clearData();
    }
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