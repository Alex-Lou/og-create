<template>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue'; // Suppression des imports non utilisés
  import gameService from '@/services/gameService';
  
  // Constantes
  const FUNDAMENTAL_ELEMENTS = ["Eau", "Feu", "Terre", "Air"];
  const FUNDAMENTAL_EMOJIS = {
    "Eau": "💧",
    "Feu": "🔥",
    "Terre": "🌎",
    "Air": "💨"
  };
  
  export default {
    name: 'DataLoadingCategories',
    props: {
      filesToLoad: {
        type: Array,
        default: () => [
          "animaux",
          "biologie", 
          "créations_humaines",
          "elements_data",
          "formations_naturelles",
          "geologie",
          "materiaux_elementaires",
          "phénomènes_naturels",
          "magie"
        ]
      },
      existingData: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ['data-loaded', 'error'],
  
    setup(props, { emit }) {
      const error = ref(null);
      const elementEmojis = ref({ ...FUNDAMENTAL_EMOJIS });
      const categories = ref({});
      const craftingRecipes = ref({});
      const isLoading = ref(false);
  
      // Chargement des données du jeu
      const loadGameData = async () => {
        isLoading.value = true;
        error.value = null;
        
        try {
          // Initialiser les éléments emojis avec les fondamentaux
          elementEmojis.value = { ...FUNDAMENTAL_EMOJIS };
          
          // Initialiser les catégories
          categories.value = {};
          
          // Initialiser les recettes de craft
          craftingRecipes.value = {};
  
          // Conserver les catégories existantes si présentes
          if (props.existingData.categories) {
            Object.assign(categories.value, props.existingData.categories);
          }
  
          // S'assurer que les éléments fondamentaux sont toujours présents
          categories.value["Elements Fondamentaux"] = categories.value["Elements Fondamentaux"] || [];
          
          FUNDAMENTAL_ELEMENTS.forEach(element => {
            if (!categories.value["Elements Fondamentaux"].includes(element)) {
              categories.value["Elements Fondamentaux"].push(element);
            }
          });
  
          // Charger tous les fichiers de données
          const loadPromises = props.filesToLoad.map(async (filename) => {
            try {
              let data;
              try {
                data = await gameService.loadFile(filename);
              } catch (apiErr) {
                console.warn(`Impossible de charger ${filename} via l'API`, apiErr);
                return null;
              }
  
              // Traiter les données
              processFileData(data);
              return data;
            } catch (err) {
              console.warn(`Erreur lors du chargement des données ${filename}:`, err);
              return null;
            }
          });
  
          // Attendre que tous les fichiers soient chargés
          await Promise.all(loadPromises);
  
          const loadedData = {
            elementEmojis: elementEmojis.value,
            categories: categories.value,
            craftingRecipes: craftingRecipes.value
          };
  
          emit('data-loaded', loadedData);
          return loadedData;
        } catch (err) {
          error.value = "Erreur lors du chargement des données depuis l'API";
          emit('error', error.value);
          throw err;
        } finally {
          isLoading.value = false;
        }
      };
  
      // Fonction utilitaire pour traiter les données d'un fichier
      const processFileData = (data) => {
        if (!data) return;
  
        // Tableau des clés potentielles pour les emojis
        const emojiSources = ['animaux', 'humains', 'elements', 'items'];
  
        emojiSources.forEach(source => {
          if (data[source]) {
            Object.entries(data[source]).forEach(([category, categoryData]) => {
              categories.value[category] = categories.value[category] || [];
  
              // Support de différents formats de données d'emojis
              Object.entries(categoryData).forEach(([name, emojiOrObject]) => {
                const trimmedName = name.trim();
                const emoji = typeof emojiOrObject === 'object' 
                  ? (emojiOrObject.emoji || emojiOrObject.icon || '❓')
                  : emojiOrObject;
  
                elementEmojis.value[trimmedName] = emoji;
  
                if (!categories.value[category].includes(trimmedName)) {
                  categories.value[category].push(trimmedName);
                }
              });
            });
          }
        });
  
        // Traitement des règles
        if (data.rules) {
          Object.entries(data.rules).forEach(([key, value]) => {
            craftingRecipes.value[key.split("+").sort().join("+")] = value;
            craftingRecipes.value[key] = value;
          });
        }
      };
  
      // Initialisation
      onMounted(() => {
        loadGameData();
      });
  
      // Exposer les méthodes
      return {
        elementEmojis,
        categories,
        craftingRecipes,
        error,
        isLoading,
        loadGameData
      };
    }
  };
  </script>
  
  <style scoped>
  .error-message {
    color: #f44336;
    background-color: #ffebee;
    padding: 8px 16px;
    border-radius: 4px;
    margin-bottom: 16px;
    font-weight: bold;
  }
  </style>