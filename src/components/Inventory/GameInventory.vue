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
    
    <!-- Effets visuels d'arrière-plan -->
    <div class="smoke-container">
      <div class="smoke smoke1"></div>
      <div class="smoke smoke2"></div>
      <div class="smoke smoke-top"></div>
    </div>

    <div class="star-field">
      <div v-for="n in 15" :key="`star-${n}`" class="star"></div>
    </div>

    <h2>Inventory</h2>
    
    <!-- Log de débogage - visible uniquement en développement -->
    <div v-if="props.isTimerMode" class="debug-info">
      <p>Mode Timer actif</p>
      <p>Catégories: {{ filteredCategories.length }}</p>
      <p v-if="filteredCategories.length > 0">
        Éléments dans Timer: {{ filteredCategories[0].elements.length }}
      </p>
      <button @click="refreshTimerElements" class="debug-button">Rafraîchir</button>
    </div>
    
    <!-- Catégories d'éléments -->
    <div 
      v-for="(category, index) in filteredCategories" 
      :key="`category-${index}`"
      class="category"
      :class="{ 'timer-category': props.isTimerMode }"
    >
      <div class="category-header" @click="toggleCategory(index)">
        <span class="category-title">{{ category.name }}</span>
        <div class="progress">
          <div class="progress-value" :style="{ width: category.progress + '%' }"></div>
          <div class="progress-bar-fill" :style="{ width: category.progress + '%' }">
            <template v-for="n in Math.min(4, Math.floor(category.progress / 10))" :key="`particle-group-${n}`">
              <div :class="`particle particle-${n * 10}`"></div>
            </template>
          </div>
        </div>
      </div>
      <div 
        class="category-content"
        :style="{ 
          maxHeight: expandedCategories[index] || props.isTimerMode ? '1000px' : '0',
          overflow: 'auto',
          transition: 'max-height 0.5s ease-in-out'
        }"
      >
        <div 
          v-if="category.elements.length === 0" 
          class="empty-category"
        >
          Aucun élément disponible
        </div>
        <div
          v-for="element in category.elements"
          :key="`element-${element}`"
          class="inventory-item"
          draggable="true"
          @dragstart="startDrag($event, element)"
          @dragend="endDrag"
          @click="selectElement(element)"
        >
          {{ getElementEmoji(element) }} {{ element }}
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import '@/assets/ComponentsStyle/InventoryStyle/GameInventoryStyle.css';
import gameDataService from '@/services/gameDataService';
import gameService from '@/services/gameService';
 
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
    // État local
    const lastCompletedCategory = ref(null);
    const previousCategoriesState = ref({});
    const isLoading = ref(false);
    const localElementEmojis = ref({...props.elementEmojis});
    const expandedCategories = ref({});
    
    // Observer les changements des props elementEmojis
    watch(() => props.elementEmojis, (newEmojis) => {
      localElementEmojis.value = {...newEmojis};
    }, { immediate: true });
    
    // Constantes
    const fundamentalElements = ["Eau", "Feu", "Terre", "Air"];
    const fundamentalCategory = "Elements Fondamentaux";

    // Computed properties
    const filteredCategories = computed(() => {
      const result = props.isTimerMode 
        ? getTimerModeCategories() 
        : getNormalModeCategories();
      
      return result;
    });
    
    // Fonction pour basculer l'expansion d'une catégorie
    function toggleCategory(index) {
      console.log('Toggle catégorie', index);
      expandedCategories.value[index] = !expandedCategories.value[index];
    }
    
    // Fonctions utilitaires
    function normalizeString(str) {
      if (!str) return '';
      return str.normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }
    
    function getElementEmoji(elementName) {
      // 1. Vérifier d'abord dans l'objet global window.timerElementEmojis
      if (window.timerElementEmojis && window.timerElementEmojis[elementName]) {
        return window.timerElementEmojis[elementName];
      }
      
      // 2. Sinon, vérifier dans localElementEmojis
      if (localElementEmojis.value && localElementEmojis.value[elementName]) {
        return localElementEmojis.value[elementName];
      }
      
      // 3. Vérifier dans props.elementEmojis
      if (props.elementEmojis && props.elementEmojis[elementName]) {
        return props.elementEmojis[elementName];
      }
      
      // 4. Emojis de secours pour les éléments fondamentaux
      const fallbackEmojis = {
        "Eau": "💧",
        "Feu": "🔥",
        "Terre": "🌎",
        "Air": "💨"
      };
      
      return fallbackEmojis[elementName] || "❓";
    }
    
    // Méthode pour réinitialiser complètement l'affichage des éléments
    function resetTimerElements() {
      console.log('Réinitialisation complète des éléments du timer');
      window.currentTimerElements = [];
      window.timerElements = [];
      window.timerElementEmojis = {};
      
      // Forcer une mise à jour de l'affichage
      emit('force-reload', { timerElementsLoaded: false });
    }
    
    // Méthode pour gérer l'événement de nettoyage
    function handleTimerStopped() {
      console.log('GameInventory: Événement timer-stopped reçu, nettoyage des éléments');
      resetTimerElements();
    }

    // Fonction pour obtenir les catégories en mode Timer
    function getTimerModeCategories() {
      console.log('Génération des catégories pour le mode Timer');
      
      // Si nous ne sommes plus en mode timer mais que la fonction est appelée,
      // réinitialiser explicitement les variables globales
      if (!props.isTimerMode) {
        window.currentTimerElements = [];
        window.timerElements = [];
        window.currentQuestionId = null;
        return [{
          name: 'Timer Elements',
          progress: 100,
          elements: [],
          isComplete: false
        }];
      }
      
      // 1. Tenter de récupérer les éléments de différentes sources
      let timerElements = [];
      
      if (window.currentTimerElements && Array.isArray(window.currentTimerElements) && window.currentTimerElements.length > 0) {
        timerElements = [...window.currentTimerElements];
        console.log('Éléments trouvés dans window.currentTimerElements:', timerElements);
      } 
      else if (Array.isArray(props.timerQuestionElements) && props.timerQuestionElements.length > 0) {
        timerElements = [...props.timerQuestionElements];
        console.log('Éléments trouvés dans props.timerQuestionElements:', timerElements);
      }
      else if (window.timerElements && Array.isArray(window.timerElements) && window.timerElements.length > 0) {
        timerElements = [...window.timerElements];
        console.log('Éléments trouvés dans window.timerElements:', timerElements);
      }
      
      // 2. Si on a toujours 0 éléments et qu'on a un ID de question, essayer de charger depuis le serveur
      if (timerElements.length === 0 && window.currentQuestionId) {
        console.log('Tentative de chargement pour la question:', window.currentQuestionId);
        loadTimerEmojis(window.currentQuestionId).then(elements => {
          if (elements && elements.length > 0) {
            // Stocker pour les futurs rendus
            window.currentTimerElements = elements;
            window.timerElements = elements;
            
            console.log('Éléments chargés avec succès:', elements);
            
            // Forcer le rafraîchissement
            setTimeout(() => {
              emit('force-reload', { timerElementsLoaded: true });
            }, 300);
          }
        });
      }
      
      // 3. S'assurer que la catégorie est développée
      expandedCategories.value[0] = true;
      
      console.log('Éléments filtrés pour le Timer (final):', timerElements);
      
      return [{
        name: 'Timer Elements',
        progress: 100,
        elements: timerElements,
        isComplete: false
      }];
    }
    
    // Fonction pour charger les éléments du timer
    async function loadTimerEmojis(currentQuestionId) {
      try {
        // Obtenir l'ID de la question actuelle si non fourni
        if (!currentQuestionId && window.currentQuestionId) {
          currentQuestionId = window.currentQuestionId;
        }
        
        console.log('Chargement des éléments du timer pour la question:', currentQuestionId);
        
        if (!currentQuestionId) {
          console.warn('Aucun ID de question fourni pour loadTimerEmojis');
          return [];
        }
        
        // Utiliser gameService pour charger les éléments
        const timerElements = await gameService.loadTimerElements(currentQuestionId);
        
        console.log('Éléments du timer après chargement:', timerElements);
        
        // Stocker dans les variables globales pour compatibilité
        if (timerElements && timerElements.length > 0) {
          window.currentTimerElements = timerElements;
          window.timerElements = timerElements;
        }
        
        return timerElements || [];
      } catch (error) {
        console.error('Erreur lors du chargement des emojis du Timer:', error);
        return [];
      }
    }
    
    // Initialisation des éléments du timer
    async function initTimerElements() {
      if (props.isTimerMode) {
        console.log('Initialisation des éléments du timer');
        
        try {
          // Si window.currentQuestionId existe, essayer de charger les éléments
          if (window.currentQuestionId) {
            const elements = await loadTimerEmojis(window.currentQuestionId);
            
            // Forcer une mise à jour des catégories filtrées
            if (elements && elements.length > 0) {
              console.log('Mise à jour des éléments du timer:', elements.length);
              
              // Mise à jour forcée pour rafraîchir l'affichage
              setTimeout(() => {
                // Forcer l'ouverture de la catégorie
                expandedCategories.value[0] = true;
                
                // Forcer une mise à jour
                emit('force-reload', { timerElementsLoaded: true });
              }, 100);
            }
          }
        } catch (error) {
          console.error('Erreur lors de l\'initialisation des éléments du timer:', error);
        }
      }
    }
    
    // Méthode pour rafraîchir manuellement les éléments du timer
    function refreshTimerElements() {
      console.log('Rafraîchissement manuel des éléments du timer');
      
      // Réinitialiser les variables globales
      resetTimerElements();
      
      // Réinitialiser les éléments
      initTimerElements();
    }
    
    // Fonction pour obtenir les catégories en mode normal
    function getNormalModeCategories() {
      // Créer des copies des tableaux pour éviter de modifier les props
      const localDiscoveredElements = [...props.discoveredElements];
      const localDiscoveredCategories = [...props.discoveredCategories];
      
      // S'assurer que les éléments fondamentaux sont présents
      const { hasAddedElements, hasAddedCategory } = ensureFundamentalElementsExist(
        localDiscoveredElements, 
        localDiscoveredCategories
      );
      
      // Si des éléments ont été ajoutés localement, synchroniser avec le serveur
      if (hasAddedElements || hasAddedCategory) {
        console.log("Éléments ou catégories fondamentaux ajoutés, synchronisation avec le serveur...");
        synchronizeFundamentals(localDiscoveredElements, localDiscoveredCategories);
      }
      
      return Object.entries(props.categories)
        .map(([name, elements]) => createCategoryObject(name, elements, localDiscoveredElements))
        .filter(category => localDiscoveredCategories.includes(category.name));
    }
    
    // Fonction utilitaire pour s'assurer que les éléments fondamentaux existent
    function ensureFundamentalElementsExist(elements, categories) {
      let hasAddedElements = false;
      let hasAddedCategory = false;
      
      // Assurer que les éléments fondamentaux sont présents
      fundamentalElements.forEach(element => {
        if (!elements.includes(element)) {
          elements.push(element);
          hasAddedElements = true;
          console.log(`Élément fondamental ajouté localement: ${element}`);
        }
      });
      
      // Assurer que la catégorie fondamentale est présente
      if (!categories.includes(fundamentalCategory)) {
        categories.push(fundamentalCategory);
        hasAddedCategory = true;
        console.log(`Catégorie fondamentale ajoutée localement: ${fundamentalCategory}`);
      }
      
      return { hasAddedElements, hasAddedCategory };
    }
    
    // Fonction utilitaire pour créer un objet de catégorie
    function createCategoryObject(name, elements, discoveredElements) {
      let filteredElements = Array.isArray(elements)
        ? elements.filter(el => discoveredElements.includes(el))
        : [];
      
      // Cas spécial pour "Elements Fondamentaux"
      if (name === "Elements Fondamentaux") {
        fundamentalElements.forEach(element => {
          if (!filteredElements.includes(element) && elements.includes(element)) {
            filteredElements.push(element);
          }
        });
      }
      
      return {
        name: formatCategoryName(name),
        progress: calculateProgress(elements, filteredElements),
        elements: filteredElements,
        isComplete: filteredElements.length === elements.length
      };
    }
    
    // Fonction utilitaire pour formater le nom de la catégorie
    function formatCategoryName(name) {
      return name.replace(/_/g, " ");
    }
    
    // Fonction utilitaire pour calculer la progression
    function calculateProgress(allElements, discoveredElements) {
      return allElements.length > 0 
        ? (discoveredElements.length / allElements.length) * 100 
        : 0;
    }

    // Fonction pour vérifier les nouvelles catégories complétées
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
        await gameDataService.loadFile('elements');
        isLoading.value = false;
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'éléments:', error);
        isLoading.value = false;
      }
    }

    // Lifecycle hooks
    onMounted(async () => {
      // Charger les données au montage du composant
      await loadEmojisData();
      
      // Initialiser les éléments du timer
      if (props.isTimerMode) {
        await initTimerElements();
      }
      
      // Initialiser l'état des catégories
      previousCategoriesState.value = filteredCategories.value.reduce((acc, category) => {
        acc[category.name] = {
          isComplete: category.isComplete
        };
        return acc;
      }, {});
      
      // Écouter l'événement de fin de timer pour nettoyer
      window.addEventListener('timer-stopped', handleTimerStopped);
    });
    
    // Nettoyage à la destruction du composant
    onUnmounted(() => {
      window.removeEventListener('timer-stopped', handleTimerStopped);
    });

    // Watchers
    watch(filteredCategories, (newCategories) => {
      checkNewCompletedCategory(newCategories);
    }, { deep: true });
    
    // Observer les changements de mode
    watch(() => props.isTimerMode, async (isTimerMode, oldValue) => {
      if (isTimerMode) {
        // Réinitialiser et charger les éléments du timer
        window.timerElementEmojisLoaded = false;
        await initTimerElements();
        
        // S'assurer que la catégorie Timer est développée par défaut
        expandedCategories.value[0] = true;
      } else if (oldValue === true) {
        // Si on quitte le mode timer, nettoyer les données
        resetTimerElements();
      }
    });

    return {
      filteredCategories,
      lastCompletedCategory,
      previousCategoriesState,
      normalizeString,
      forceReload,
      isLoading,
      localElementEmojis,
      getElementEmoji,
      expandedCategories,
      toggleCategory,
      refreshTimerElements,
      initTimerElements,
      resetTimerElements,
      handleTimerStopped,
      props
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
    },
    
    selectElement(element) {
      this.$emit('selectResource', element);
    }
  }
};
</script>