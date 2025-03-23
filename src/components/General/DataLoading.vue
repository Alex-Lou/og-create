<template>
  <!-- Complètement supprimer l'affichage des erreurs liées aux questions du Timer -->
  <div v-if="error && !error.includes('timerQuestions')" class="error-message">
    {{ error }}
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
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
  name: 'DataLoading',
  props: {
    isTimerMode: {
      type: Boolean,
      default: false
    },
    existingData: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['data-loaded', 'achievements-loaded', 'achievement-unlocked', 'force-reload', 'timer-questions-loaded', 'craft-success'],

  setup(props, { emit }) {
    // États réactifs
    const error = ref(null);
    const achievements = ref([]);
    const discoveredElements = ref([]);
    const shownAchievements = ref(new Set());
    const isLoading = ref({
      gameData: false,
      achievements: false,
      timerQuestions: false
    });
    const previousMode = ref(props.isTimerMode);

    // Fournir une liste de fichiers à charger
    const filesToLoad = computed(() => [
      "animaux",
      "biologie", 
      "créations_humaines",
      "elements_data",
      "formations_naturelles",
      "geologie",
      "materiaux_elementaires",
      "phénomènes_naturels",
      "magie"
    ]);

    // Surveiller les changements de mode pour gérer les erreurs
    watch(() => props.isTimerMode, (newMode, oldMode) => {
      previousMode.value = oldMode;
      
      // Si on passe du mode Timer au mode Infinite, réinitialiser les erreurs
      if (oldMode === true && newMode === false && error.value && error.value.includes('timerQuestions')) {
        error.value = null;
      }
    }, { immediate: true });

    // Fonction utilitaire pour charger des ressources en toute sécurité
    const loadSafely = async (loaderFn, loadingKey) => {
      isLoading.value[loadingKey] = true;
      try {
        return await loaderFn();
      } catch (err) {
        console.error(`Erreur lors du chargement (${loadingKey}):`, err);
        error.value = `Erreur lors du chargement (${loadingKey})`;
        return null;
      } finally {
        isLoading.value[loadingKey] = false;
      }
    };

    // Chargement des achievements
    const loadAchievements = async () => {
      try {
        // Essayer d'abord via l'API
        let data;
        try {
          data = await gameService.loadFile('achievements');
        } catch (apiErr) {
          console.log("API échouée, fallback sur fichier JSON local pour achievements");
          // Fallback sur le fichier JSON local
          const response = await fetch("/data/achievements.json");
          
          if (!response.ok) {
            throw new Error(`Impossible de charger achievements.json: ${response.status}`);
          }
          
          data = await response.json();
        }

        // Traiter les achievements pour inclure les images
        const processedAchievements = data.map((achievement) => {
          let requiredImage;
          try {
            requiredImage = require(`@/assets/success/${achievement.name}.png`);
          } catch (e) {
            console.error(`Erreur de chargement d'image pour ${achievement.name}:`, e.message);
            requiredImage = achievement.image || null;
          }

          return {
            ...achievement,
            image: requiredImage,
            unlocked: false,
            displayed: false
          };
        });
        
        achievements.value = processedAchievements;
        emit('achievements-loaded', processedAchievements);
        return processedAchievements;
      } catch (err) {
        console.error("Erreur de chargement des achievements:", err);
        error.value = "Erreur lors du chargement des succès";
        return [];
      }
    };

    // Chargement des données du jeu
    const loadGameData = async () => {
      try {
        const elementEmojis = { ...FUNDAMENTAL_EMOJIS };
        const categories = {};
        const craftingRecipes = {};

        // Conserver les catégories existantes si présentes
        if (props.existingData.categories) {
          Object.assign(categories, props.existingData.categories);
        }

        // S'assurer que les éléments fondamentaux sont toujours présents
        categories["Elements Fondamentaux"] = categories["Elements Fondamentaux"] || [];
        
        FUNDAMENTAL_ELEMENTS.forEach(element => {
          if (!categories["Elements Fondamentaux"].includes(element)) {
            categories["Elements Fondamentaux"].push(element);
          }
        });

        // Charger tous les fichiers de données
        const loadPromises = filesToLoad.value.map(async (filename) => {
          try {
            let data;
            try {
              data = await gameService.loadFile(filename);
            } catch (apiErr) {
              console.warn(`Impossible de charger ${filename} via l'API`, apiErr);
              return null;
            }

            // Traiter les données
            processFileData(data, elementEmojis, categories, craftingRecipes);
            return data;
          } catch (err) {
            console.warn(`Erreur lors du chargement des données ${filename}:`, err);
            return null;
          }
        });

        // Attendre que tous les fichiers soient chargés
        await Promise.all(loadPromises);

        const loadedData = {
          elementEmojis,
          categories,
          craftingRecipes
        };

        emit('data-loaded', loadedData);
        return loadedData;
      } catch (err) {
        error.value = "Erreur lors du chargement des données depuis l'API";
        throw err;
      }
    };

    // Fonction utilitaire pour traiter les données d'un fichier
    const processFileData = (data, elementEmojis, categories, craftingRecipes) => {
      if (!data) return;

      // Tableau des clés potentielles pour les emojis
      const emojiSources = ['animaux', 'humains', 'elements', 'items'];

      emojiSources.forEach(source => {
        if (data[source]) {
          Object.entries(data[source]).forEach(([category, categoryData]) => {
            categories[category] = categories[category] || [];

            // Support de différents formats de données d'emojis
            Object.entries(categoryData).forEach(([name, emojiOrObject]) => {
              const trimmedName = name.trim();
              const emoji = typeof emojiOrObject === 'object' 
                ? (emojiOrObject.emoji || emojiOrObject.icon || '❓')
                : emojiOrObject;

              elementEmojis[trimmedName] = emoji;

              if (!categories[category].includes(trimmedName)) {
                categories[category].push(trimmedName);
              }
            });
          });
        }
      });

      // Traitement des règles
      if (data.rules) {
        Object.entries(data.rules).forEach(([key, value]) => {
          craftingRecipes[key.split("+").sort().join("+")] = value;
          craftingRecipes[key] = value;
        });
      }
    };

    // Chargement des questions du Timer
    const loadTimerQuestions = async () => {
      // Ignorer complètement si on n'est pas en mode Timer
      if (!props.isTimerMode) {
        // Réinitialiser l'erreur en cas de changement de mode
        if (error.value && error.value.includes('timerQuestions')) {
          error.value = null;
        }
        return null;
      }

      try {
        const data = await gameService.loadFile('timer-questions');
        
        if (!data || !data.levels) {
          throw new Error('Format de données incorrect pour les questions du Timer');
        }
        
        emit('timer-questions-loaded', data);
        return data;
      } catch (err) {
        console.error('Erreur lors du chargement des questions du Timer:', err);
        if (props.isTimerMode) {
          error.value = "Erreur lors du chargement des questions du Timer";
        }
        throw err;
      }
    };

    // Chargement de toutes les données
    const loadAllData = async () => {
      // Réinitialiser les erreurs avant de recharger
      error.value = null;
      
      try {
        // Charger les données de jeu et les achievements
        const promises = [
          loadSafely(loadGameData, 'gameData'),
          loadSafely(loadAchievements, 'achievements')
        ];
        
        // Ajouter le chargement des questions du Timer UNIQUEMENT si en mode Timer
        if (props.isTimerMode) {
          promises.push(loadSafely(loadTimerQuestions, 'timerQuestions'));
        }
        
        const results = await Promise.all(promises);
        
        // Filtrer les valeurs null (erreurs)
        const validResults = results.filter(r => r !== null);
        
        if (validResults.length === 0) {
          throw new Error("Aucune donnée n'a pu être chargée");
        }
        
        // Données complètes à recharger
        const fullLoadedData = {
          ...(validResults[0] || {}), // gameData
          achievements: validResults[1] || [], // loadedAchievements
          // Ajouter les questions du Timer si elles ont été chargées et si on est en mode Timer
          ...(props.isTimerMode && validResults.length > 2 ? { timerQuestions: validResults[2] } : {}),
          // Conserver les données existantes
          ...props.existingData
        };

        // Émettre un événement de rechargement forcé
        emit('force-reload', fullLoadedData);
        return fullLoadedData;
      } catch (err) {
        console.error('Erreur lors du rechargement forcé:', err);
        error.value = "Erreur lors du rechargement complet des données";
        throw err;
      }
    };

    // Vérification des achievements
    const checkAchievements = (elementsToCheck) => {
      if (props.isTimerMode) return;
      
      // Utiliser les éléments fournis ou les éléments découverts locaux
      const elements = elementsToCheck || discoveredElements.value;
      
      if (!achievements.value || achievements.value.length === 0) {
        console.warn("Tentative de vérification des achievements avant leur chargement");
        return;
      }
      
      let unlocked = [];
      
      achievements.value.forEach((achievement) => {
        if (!achievement.unlocked) {
          try {
            let expression = achievement.condition;
            expression = expression.replace(/this\.discoveredElements/g, 'elements');
            const conditionFn = new Function('elements', `return ${expression}`);
            
            if (conditionFn(elements)) {
              achievement.unlocked = true;
              achievement.unlockedAt = new Date().toISOString();
              unlocked.push(achievement);
              
              // Vérifier si cet achievement a déjà été affiché dans cette session
              if (!shownAchievements.value.has(achievement.name)) {
                shownAchievements.value.add(achievement.name);
                
                // Créer une copie sécurisée de l'achievement
                const safeAchievement = {
                  name: achievement.name,
                  description: achievement.description,
                  image: achievement.image,
                  unlocked: true,
                  unlockedAt: achievement.unlockedAt || new Date().toISOString()
                };
                
                emit('achievement-unlocked', safeAchievement);
              }
            }
          } catch (error) {
            console.error(`Erreur lors de l'évaluation de la condition pour ${achievement.name}:`, error);
          }
        }
      });
      
      // Mettre à jour les achievements après vérification
      emit('achievements-loaded', achievements.value);
      
      // Sauvegarder directement les achievements débloqués
      if (unlocked.length > 0 && window.saveAchievements) {
        const saveData = {};
        unlocked.forEach(achievement => {
          saveData[achievement.name] = {
            unlocked: true,
            unlockedAt: achievement.unlockedAt
          };
        });
        window.saveAchievements(saveData);
      }
    };
    
    // Gestion d'un nouveau craft
    const handleCraft = (newElement) => {
      if (props.isTimerMode) {
        emit('craft-success', newElement);
        return;
      }
      
      // Mise à jour de notre copie locale des éléments découverts
      if (!discoveredElements.value.includes(newElement)) {
        discoveredElements.value.push(newElement);
        
        // Vérifier si des achievements sont débloqués
        // Utiliser l'événement personnalisé comme dans le code original
        const achievementEvent = new CustomEvent('get-unlocked-achievements', {
          detail: { 
            callback: (unlockedAchievements) => {
              if (!Array.isArray(unlockedAchievements)) {
                console.warn("Format incorrect pour les achievements débloqués");
                unlockedAchievements = [];
              }
              
              // Récupérer les noms des achievements déjà débloqués
              const alreadyUnlockedNames = unlockedAchievements.map(a => a.name);
              
              // Vérifier spécifiquement les achievements liés à cet élément
              const specificAchievements = achievements.value.filter(achievement => 
                !achievement.unlocked && 
                !alreadyUnlockedNames.includes(achievement.name) &&
                achievement.condition && 
                achievement.condition.includes(`includes('${newElement}')`)
              );
              
              specificAchievements.forEach(achievement => {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                
                // Créer une copie sécurisée de l'achievement
                const safeAchievement = {
                  name: achievement.name,
                  description: achievement.description,
                  image: achievement.image,
                  unlocked: true,
                  unlockedAt: achievement.unlockedAt || new Date().toISOString()
                };
                
                emit('achievement-unlocked', safeAchievement);
              });
              
              // Vérifier aussi les achievements basés sur le nombre d'éléments
              achievements.value.forEach((achievement) => {
                // Ignorer les achievements déjà débloqués ou ceux dans la liste des débloqués
                if (achievement.unlocked || alreadyUnlockedNames.includes(achievement.name)) {
                  return;
                }
                
                try {
                  let expression = achievement.condition;
                  expression = expression.replace(/this\.discoveredElements/g, 'discoveredElements.value');
                  
                  // Vérifier uniquement les achievements basés sur le nombre d'éléments
                  if (expression.includes('.length >=')) {
                    const conditionFn = new Function('discoveredElements', `return ${expression}`);
                    
                    if (conditionFn({ value: discoveredElements.value })) {
                      achievement.unlocked = true;
                      achievement.unlockedAt = new Date().toISOString();
                      
                      // Créer une copie sécurisée de l'achievement
                      const safeAchievement = {
                        name: achievement.name,
                        description: achievement.description,
                        image: achievement.image,
                        unlocked: true,
                        unlockedAt: achievement.unlockedAt || new Date().toISOString()
                      };
                      
                      emit('achievement-unlocked', safeAchievement);
                    }
                  }
                } catch (error) {
                  console.error(`Erreur lors de l'évaluation de la condition pour ${achievement.name}:`, error);
                }
              });
            }
          }
        });
        
        // Déclencher l'événement pour obtenir les achievements débloqués
        window.dispatchEvent(achievementEvent);
      }
    };

    // Observer les changements dans les éléments découverts
    watch(() => props.existingData.discoveredElements, (newElements) => {
      if (newElements && Array.isArray(newElements)) {
        // Éviter les mises à jour inutiles
        if (!discoveredElements.value.length || 
            !discoveredElements.value.every(e => newElements.includes(e)) ||
            discoveredElements.value.length !== newElements.length) {
          discoveredElements.value = [...newElements];
        }
      }
    }, { immediate: true });

    // Surveiller les changements dans l'état de déblocage des achievements
    watch(() => props.existingData.achievements, (newAchievements) => {
      if (newAchievements && Array.isArray(newAchievements)) {
        newAchievements.forEach(achievement => {
          if (achievement.unlocked) {
            // Ajouter à la liste des achievements déjà affichés
            shownAchievements.value.add(achievement.name);
            
            // Mettre à jour la liste locale
            const existingIndex = achievements.value.findIndex(a => a.name === achievement.name);
            if (existingIndex >= 0) {
              achievements.value[existingIndex].unlocked = true;
              achievements.value[existingIndex].unlockedAt = achievement.unlockedAt;
            }
          }
        });
        
        // Émettre les achievements mis à jour
        emit('achievements-loaded', achievements.value);
      }
    }, { immediate: true });

    // Initialisation au montage du composant
    onMounted(async () => {
      try {
        // Initialiser la liste des achievements déjà affichés
        shownAchievements.value = new Set();
        
        // Réinitialiser les erreurs
        error.value = null;
        
        await Promise.all([
          loadSafely(loadGameData, 'gameData'),
          loadSafely(loadAchievements, 'achievements')
        ]);
        
        // Charger les questions du timer uniquement si on est en mode Timer
        if (props.isTimerMode) {
          await loadSafely(loadTimerQuestions, 'timerQuestions');
        }
        
        // Si des éléments découverts sont disponibles dans les props
        if (props.existingData.discoveredElements && Array.isArray(props.existingData.discoveredElements)) {
          discoveredElements.value = [...props.existingData.discoveredElements];
        }
        
        // Si des achievements débloqués sont disponibles dans les props
        if (props.existingData.achievements && Array.isArray(props.existingData.achievements)) {
          props.existingData.achievements.forEach(achievement => {
            if (achievement.unlocked) {
              // Ajouter à la liste des achievements déjà affichés
              shownAchievements.value.add(achievement.name);
              
              // Mettre à jour la liste locale
              const existingIndex = achievements.value.findIndex(a => a.name === achievement.name);
              if (existingIndex >= 0) {
                achievements.value[existingIndex].unlocked = true;
                achievements.value[existingIndex].unlockedAt = achievement.unlockedAt;
              }
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
      }
    });

    return {
      error,
      isLoading,
      achievements,
      discoveredElements,
      handleCraft,
      loadAllData,
      checkAchievements,
      previousMode
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

.loading-indicator {
  font-size: 0.9em;
  color: #2196f3;
  margin: 8px 0;
}
</style>