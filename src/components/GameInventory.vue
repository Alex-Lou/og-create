<template>
  <div id="inventory">
    <h2>Inventory</h2>
    <div 
      v-for="(category, index) in filteredCategories" 
      :key="`category-${index}`"
      class="category"
    >
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
 /* eslint-disable no-unused-vars */
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
      if (this.isTimerMode) {
        const currentQuestion = this.$parent.$refs.timerQuestions?.getCurrentQuestion();
        
        const possibleElements = [
          ...(this.timerQuestionElements || []),
          ...(currentQuestion?.validAnswers || []),
          ...(currentQuestion?.initialElements?.required || []),
          ...(currentQuestion?.initialElements?.additional || [])
        ];
 
        const timerElements = this.discoveredElements.filter(element => {
          const normalizedElement = this.normalizeString(element);
          const isElementValid = possibleElements.some(possibleElement => {
            const normalizedPossible = this.normalizeString(possibleElement);
            return normalizedElement === normalizedPossible || 
              (typeof normalizedPossible === 'string' && 
               (normalizedElement.includes(normalizedPossible) || normalizedPossible.includes(normalizedElement)));
          });
 
          return isElementValid;
        });
 
        const elementsWithEmojis = timerElements.map(element => {
          const elementKey = Object.keys(this.elementEmojis).find(key => 
            this.normalizeString(key) === this.normalizeString(element)
          ) || element;
          return elementKey;
        });
 
        return [{
          name: 'Timer Elements',
          progress: 100,
          elements: elementsWithEmojis,
          isComplete: elementsWithEmojis.length === this.timerQuestionElements.length
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
  methods: {
    normalizeString(str) {
      if (!str) return '';
      return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    },
    checkNewCompletedCategory(categories) {
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
  watch: {
    filteredCategories: {
      handler(newCategories) {
        this.checkNewCompletedCategory(newCategories);
      },
      deep: true
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