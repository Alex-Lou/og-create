<template>
  <div id="inventory" class="inventory-container">
    <!-- Conteneur de fumée -->
    <div class="smoke-container">
      <!-- Fumée épaisse en bas à gauche -->
      <div class="smoke smoke1"></div>
      <div class="smoke smoke2"></div>
      <!-- Nouvelle fumée moins épaisse, partant du haut à gauche -->
      <div class="smoke smoke-top"></div>
    </div>

    <!-- Conteneur d'étoiles scintillantes -->
    <div class="star-field">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>

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
          <div class="progress-bar-fill" :style="{ width: category.progress + '%' }">
            <template v-for="n in Math.floor(category.progress / 10)" :key="`particle-group-${n}`">
              <div 
                :class="`particle particle-${n * 10}`"
              ></div>
            </template>
          </div>
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
import { ref, computed, watch, onMounted } from 'vue';
import '@/assets/GameInventoryStyle.css';
 
export default {
  name: 'GameInventory',
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
  emits: ['selectResource', 'force-reload'],
  setup(props, { emit }) {
    const lastCompletedCategory = ref(null);
    const previousCategoriesState = ref({});

    const filteredCategories = computed(() => {
      if (props.isTimerMode) {
        const currentQuestion = props.$parent?.$refs?.timerQuestions?.getCurrentQuestion();
        
        const possibleElements = [
          ...(props.timerQuestionElements || []),
          ...(currentQuestion?.validAnswers || []),
          ...(currentQuestion?.initialElements?.required || []),
          ...(currentQuestion?.initialElements?.additional || [])
        ];
 
        const timerElements = props.discoveredElements.filter(element => {
          const normalizedElement = normalizeString(element);
          const isElementValid = possibleElements.some(possibleElement => {
            const normalizedPossible = normalizeString(possibleElement);
            return normalizedElement === normalizedPossible || 
              (typeof normalizedPossible === 'string' && 
               (normalizedElement.includes(normalizedPossible) || normalizedPossible.includes(normalizedElement)));
          });
 
          return isElementValid;
        });
 
        const elementsWithEmojis = timerElements.map(element => {
          const elementKey = Object.keys(props.elementEmojis).find(key => 
            normalizeString(key) === normalizeString(element)
          ) || element;
          return elementKey;
        });
 
        return [{
          name: 'Timer Elements',
          progress: 100,
          elements: elementsWithEmojis,
          isComplete: elementsWithEmojis.length === props.timerQuestionElements.length
        }];
      }
 
      return Object.entries(props.categories)
        .map(([name, elements]) => {
          const filteredElements = Array.isArray(elements)
            ? elements.filter((el) => props.discoveredElements.includes(el))
            : [];
          return {
            name: name.replace(/_/g, " "),
            progress: (filteredElements.length / elements.length) * 100,
            elements: filteredElements,
            isComplete: filteredElements.length === elements.length
          };
        })
        .filter((category) => props.discoveredCategories.includes(category.name));
    });

    function normalizeString(str) {
      if (!str) return '';
      return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    function checkNewCompletedCategory(categories) {
      previousCategoriesState.value = categories.reduce((acc, category) => {
        acc[category.name] = {
          isComplete: category.isComplete
        };
        return acc;
      }, {});
    }

    // Méthode pour forcer un rechargement
    function forceReload(data) {
      if (data) {
        emit('force-reload', data);
      }
    }

    onMounted(() => {
      previousCategoriesState.value = filteredCategories.value.reduce((acc, category) => {
        acc[category.name] = {
          isComplete: category.isComplete
        };
        return acc;
      }, {});
    });

    watch(filteredCategories, (newCategories) => {
      checkNewCompletedCategory(newCategories);
    }, { deep: true });

    return {
      filteredCategories,
      lastCompletedCategory,
      previousCategoriesState,
      normalizeString,
      forceReload
    };
  },
  methods: {
    startDrag(event, element) {
      if (element) {
        event.dataTransfer.setData('text/plain', element);
      }
    },
    endDrag(event) {
      event.dataTransfer.clearData();
    }
  }
};
</script>

<style scoped>
@import '@/assets/GameInventoryStyle.css';
</style>

