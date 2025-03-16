<template>
  <div v-if="error" class="error-message">
    {{ error }}
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';

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
  emits: ['data-loaded', 'achievements-loaded', 'achievement-unlocked', 'force-reload'],

  setup(props, { emit }) {
    const error = ref(null);
    const achievements = ref([]);
    const discoveredElements = ref([]);
    // Garder trace des achievements déjà affichés dans cette session
    const shownAchievements = ref(new Set());

    const loadAchievements = async () => {
      try {
        const response = await fetch("/data/achievements.json");
        const data = await response.json();

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
        throw err;
      }
    };

    const loadGameData = async () => {
      try {
        const jsonFiles = [
          "/data/animaux.json",
          "/data/biologie.json",
          "/data/créations_humaines.json",
          "/data/elements_data.json",
          "/data/formations_naturelles.json",
          "/data/geologie.json",
          "/data/materiaux_elementaires.json",
          "/data/phénomènes_naturels.json",
          "/data/magie.json"
        ];

        const elementEmojis = {};
        const categories = {};
        const craftingRecipes = {};

        // Conserver les catégories existantes si présentes
        if (props.existingData.categories) {
          Object.assign(categories, props.existingData.categories);
        }

        for (const file of jsonFiles) {
          try {
            const response = await fetch(file);

            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            // Traitement des données animaux
            if (data.animaux) {
              Object.entries(data.animaux).forEach(([category, categoryData]) => {
                categories[category] = categories[category] || [];
                Object.entries(categoryData).forEach(([name, emoji]) => {
                  elementEmojis[name.trim()] = emoji;
                  if (!categories[category].includes(name.trim())) {
                    categories[category].push(name.trim());
                  }
                });
              });
            }

            // Traitement des données humains
            if (data.humains) {
              Object.entries(data.humains).forEach(([category, categoryData]) => {
                categories[category] = categories[category] || [];
                Object.entries(categoryData).forEach(([name, emoji]) => {
                  elementEmojis[name.trim()] = emoji;
                  if (!categories[category].includes(name.trim())) {
                    categories[category].push(name.trim());
                  }
                });
              });
            }

            // Traitement des données elements
            Object.entries(data.elements || {}).forEach(([category, elements]) => {
              categories[category] = categories[category] || [];
              Object.entries(elements).forEach(([name, emoji]) => {
                elementEmojis[name.trim()] = emoji;
                if (!categories[category].includes(name.trim())) {
                  categories[category].push(name.trim());
                }
              });
            });

            // Traitement des règles avec support de l'ordre original et trié
            if (data.rules) {
              Object.entries(data.rules).forEach(([key, value]) => {
                // Conserver la méthode actuelle pour compatibilité (éléments triés)
                craftingRecipes[key.split("+").sort().join("+")] = value;
                
                // Ajouter une nouvelle clé qui préserve l'ordre original
                craftingRecipes[key] = value;
              });
            }
          } catch (err) {
            console.warn(`Erreur lors du chargement du fichier ${file}:`, err);
          }
        }

        const loadedData = {
          elementEmojis,
          categories,
          craftingRecipes
        };

        emit('data-loaded', loadedData);
        return loadedData;
      } catch (err) {
        error.value = "Erreur lors du chargement des données depuis plusieurs fichiers";
        throw err;
      }
    };

    // Nouvelle méthode pour rechargement forcé
    const loadAllData = async () => {
      try {
        // Charger à la fois les données de jeu et les achievements
        const [gameData, loadedAchievements] = await Promise.all([
          loadGameData(), 
          loadAchievements()
        ]);

        // Données complètes à recharger
        const fullLoadedData = {
          ...gameData,
          achievements: loadedAchievements,
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

    function checkAchievements(elementsToCheck) {
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
    }
    
    function handleCraft(newElement) {
      if (props.isTimerMode) {
        emit('craft-success', newElement);
        return;
      }
      
      // Mise à jour de notre copie locale des éléments découverts
      if (!discoveredElements.value.includes(newElement)) {
        discoveredElements.value.push(newElement);
        
        // Vérifier si des achievements sont affichés comme débloqués dans le menu
        // Accéder à l'état global des achievements via un événement personnalisé
        const achievementEvent = new CustomEvent('get-unlocked-achievements', {
          detail: { callback: (unlockedAchievements) => {
            // Utiliser cette liste pour filtrer les achievements à vérifier
            const alreadyUnlockedNames = unlockedAchievements.map(a => a.name);
            
            // Vérifier spécifiquement les achievements liés à cet élément
            // qui ne sont pas déjà débloqués dans le menu
            const specificAchievements = achievements.value.filter(achievement => 
              !achievement.unlocked && 
              !alreadyUnlockedNames.includes(achievement.name) &&
              achievement.condition.includes(`includes('${newElement}')`)
            );
            
            if (specificAchievements.length > 0) {
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
            }
            
            // Vérifier tous les achievements (basés sur le nombre)
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
          }}
        });
        
        // Déclencher l'événement pour obtenir les achievements débloqués
        window.dispatchEvent(achievementEvent);
      }
    }

    // Observer les changements dans les éléments découverts
    watch(() => props.existingData.discoveredElements, (newElements) => {
      if (newElements && Array.isArray(newElements)) {
        discoveredElements.value = [...newElements];
      }
    }, { immediate: true });

    // Surveiller les changements dans l'état de déblocage des achievements
    watch(() => props.existingData.achievements, (newAchievements) => {
      if (newAchievements && Array.isArray(newAchievements)) {
        // Marquer les achievements déjà débloqués
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

    onMounted(async () => {
      try {
        // Initialiser la liste des achievements déjà affichés
        shownAchievements.value = new Set();
        
        await Promise.all([loadGameData(), loadAchievements()]);
        
        // Si des éléments découverts sont disponibles dans les props
        if (props.existingData.discoveredElements && Array.isArray(props.existingData.discoveredElements)) {
          discoveredElements.value = [...props.existingData.discoveredElements];
        }
        
        // Si des achievements débloqués sont disponibles dans les props
        if (props.existingData.achievements && Array.isArray(props.existingData.achievements)) {
          props.existingData.achievements.forEach(achievement => {
            if (achievement.unlocked) {
              // Ajouter à la liste des achievements déjà affichés pour éviter les popups redondants
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
      achievements,
      discoveredElements,
      handleCraft,
      loadAllData,
      checkAchievements
    };
  }
};
</script>