<template>
  <div id="inventory" class="inventory-container">
    <!-- Structure du cadre ornemental -->
    <div class="inventory-frame">
      <!-- Coins ornementaux -->
      <div class="frame-corner corner-tl">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-tl">✧</div>
      </div>
      <div class="frame-corner corner-tr">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-tr">✧</div>
      </div>
      <div class="frame-corner corner-bl">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-bl">✧</div>
      </div>
      <div class="frame-corner corner-br">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-br">✧</div>
      </div>
      
      <!-- Ligne de séparation pour le titre -->
      <div class="title-separator"></div>
    </div>
    
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
import '@/assets/ComponentsStyle/InventoryStyle/GameInventoryStyle.css';
import gameDataService from '@/services/gameDataService';
 
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
    const isLoading = ref(false);
    const fundamentalElements = ["Eau", "Feu", "Terre", "Air"];
    const fundamentalCategory = "Elements Fondamentaux";

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
 
      // Créer des copies des tableaux pour éviter de modifier les props
      const localDiscoveredElements = [...props.discoveredElements];
      const localDiscoveredCategories = [...props.discoveredCategories];
      
      // S'assurer que les fondamentaux sont présents dans les éléments découverts
      let hasAddedElements = false;
      fundamentalElements.forEach(element => {
        if (!localDiscoveredElements.includes(element)) {
          localDiscoveredElements.push(element);
          hasAddedElements = true;
          console.log(`Élément fondamental ajouté localement: ${element}`);
        }
      });
      
      // S'assurer que la catégorie fondamentale est présente
      let hasAddedCategory = false;
      if (!localDiscoveredCategories.includes(fundamentalCategory)) {
        localDiscoveredCategories.push(fundamentalCategory);
        hasAddedCategory = true;
        console.log(`Catégorie fondamentale ajoutée localement: ${fundamentalCategory}`);
      }
      
      // Si des éléments ont été ajoutés localement, assurons-nous qu'ils sont également sauvegardés
      if (hasAddedElements || hasAddedCategory) {
        console.log("Éléments ou catégories fondamentaux ajoutés, synchronisation avec le serveur...");
        synchronizeFundamentals(localDiscoveredElements, localDiscoveredCategories);
      }
      
      return Object.entries(props.categories)
        .map(([name, elements]) => {
          let filteredElements = Array.isArray(elements)
            ? elements.filter((el) => localDiscoveredElements.includes(el))
            : [];
          
          // Cas spécial pour "Elements Fondamentaux"
          if (name === "Elements Fondamentaux") {
            // S'assurer que tous les éléments fondamentaux sont présents dans cette catégorie
            fundamentalElements.forEach(element => {
              if (!filteredElements.includes(element) && elements.includes(element)) {
                filteredElements.push(element);
              }
            });
          }
          
          return {
            name: name.replace(/_/g, " "),
            progress: elements.length > 0 ? (filteredElements.length / elements.length) * 100 : 0,
            elements: filteredElements,
            isComplete: filteredElements.length === elements.length
          };
        })
        .filter((category) => localDiscoveredCategories.includes(category.name));
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

    // Synchroniser les éléments et catégories fondamentaux avec le serveur
    async function synchronizeFundamentals(elements, categories) {
      try {
        // Mise à jour des éléments découverts
        const elementsResponse = await fetch('/api/progress/update-discovered-elements', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ discoveredElements: elements }),
        });
        
        if (!elementsResponse.ok) {
          console.error('Erreur lors de la synchronisation des éléments fondamentaux');
        }
        
        // Le backend gère déjà la mise à jour des catégories découvertes, pas besoin de faire une requête séparée
        
        // Informer le composant parent des changements
        emit('force-reload', { 
          discoveredElements: elements,
          discoveredCategories: categories
        });
      } catch (error) {
        console.error('Erreur lors de la synchronisation avec le serveur:', error);
      }
    }

    // Chargement optimisé des emojis via le gameDataService
    async function loadEmojisData() {
      if (isLoading.value) return;
      isLoading.value = true;
      
      try {
        // Utiliser le service pour charger les données
        const data = await gameDataService.loadFile('elements');
        
        // Émettre un événement avec les données
        if (data && data.elements) {
          // Les données sont déjà dans les props, pas besoin de les modifier ici
        }
        
        isLoading.value = false;
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'éléments:', error);
        isLoading.value = false;
      }
    }

    onMounted(() => {
      // Charger les données au montage du composant
      loadEmojisData();
      
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
      forceReload,
      isLoading
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