<template>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue';
  import achievementsService from '@/services/achievementsService';
  import gameService from '@/services/gameService'; // Ajout de l'import manquant
  
  export default {
    name: 'AchievementsLoader',
    props: {
      discoveredElements: {
        type: Array,
        default: () => []
      },
      existingAchievements: {
        type: Array,
        default: () => []
      }
    },
    emits: ['achievements-loaded', 'achievement-unlocked', 'error'],
  
    setup(props, { emit }) {
      const achievements = ref([]);
      const shownAchievements = ref(new Set());
      const isLoading = ref(false);
      const error = ref(null);
  
      // Reste du code inchangé...
      // Chargement des achievements
      const loadAchievements = async () => {
        try {
          isLoading.value = true;
          error.value = null;
          
          // Utiliser le service d'achievements pour récupérer tous les achievements
          let data = await achievementsService.getAllAchievements();
          
          // Si le service échoue, essayer le fallback
          if (!data || !Array.isArray(data) || data.length === 0) {
            console.log("Service d'achievements échoué, fallback sur fichier JSON local");
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
  
            // Vérifier si l'achievement est déjà débloqué dans les existingAchievements
            const existingAchievement = props.existingAchievements.find(a => a.name === achievement.name);
  
            return {
              ...achievement,
              image: requiredImage,
              unlocked: existingAchievement ? existingAchievement.unlocked : false,
              unlockedAt: existingAchievement ? existingAchievement.unlockedAt : null,
              displayed: false
            };
          });
          
          // Mettre à jour l'état local
          achievements.value = processedAchievements;
          
          // Émettre l'événement pour notifier le parent
          emit('achievements-loaded', processedAchievements);
          
          return processedAchievements;
        } catch (err) {
          console.error("Erreur de chargement des achievements:", err);
          error.value = "Erreur lors du chargement des succès";
          emit('error', error.value);
          return [];
        } finally {
          isLoading.value = false;
        }
      };
  
      // Vérification des achievements
      const checkAchievements = async (elementsToCheck) => {
        if (!Array.isArray(elementsToCheck) || elementsToCheck.length === 0) {
          return;
        }
        
        const elements = elementsToCheck || props.discoveredElements;
        
        if (!achievements.value || achievements.value.length === 0) {
          console.warn("Tentative de vérification des achievements avant leur chargement");
          return;
        }
        
        try {
          // Utiliser le service d'achievements
          const result = await achievementsService.checkAchievements(elements);
          
          if (result && result.newlyUnlocked && result.newlyUnlocked.length > 0) {
            // Traiter et émettre chaque achievement nouvellement débloqué
            result.newlyUnlocked.forEach(unlockedAchievement => {
              if (!shownAchievements.value.has(unlockedAchievement.name)) {
                shownAchievements.value.add(unlockedAchievement.name);
                
                // Rechercher l'image si nécessaire
                let image = unlockedAchievement.image;
                if (!image) {
                  const existingAchievement = achievements.value.find(a => a.name === unlockedAchievement.name);
                  if (existingAchievement) {
                    image = existingAchievement.image;
                  }
                }
                
                // Émettre l'événement
                emit('achievement-unlocked', {
                  ...unlockedAchievement,
                  image
                });
              }
            });
            
            // Mettre à jour la liste locale des achievements
            result.newlyUnlocked.forEach(unlockedAchievement => {
              const index = achievements.value.findIndex(a => a.name === unlockedAchievement.name);
              if (index !== -1) {
                achievements.value[index].unlocked = true;
                achievements.value[index].unlockedAt = unlockedAchievement.unlockedAt;
              }
            });
            
            // Émettre la liste mise à jour
            emit('achievements-loaded', achievements.value);
          }
        } catch (err) {
          console.error("Erreur lors de la vérification des achievements:", err);
          
          // Fallback à la vérification locale
          fallbackCheckAchievements(elements);
        }
      };
      
      // Fallback pour vérifier les achievements localement
      const fallbackCheckAchievements = (elements) => {
        if (!elements || !Array.isArray(elements) || elements.length === 0) {
          return;
        }
        
        const unlocked = [];
        
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
        
        // Émettre la liste mise à jour si des achievements ont été débloqués
        if (unlocked.length > 0) {
          emit('achievements-loaded', achievements.value);
          
          // Sauvegarder directement les achievements débloqués
          try {
            const updateData = {};
            unlocked.forEach(achievement => {
              updateData[achievement.name] = {
                unlocked: true,
                unlockedAt: achievement.unlockedAt
              };
            });
            
            achievementsService.updateAchievements(updateData).catch(error => {
              console.error('Erreur lors de la mise à jour des achievements:', error);
            });
          } catch (error) {
            console.error('Erreur lors de la sauvegarde des achievements:', error);
          }
        }
      };
  
      // Gestion d'un nouvel élément découvert
      const handleNewElement = async (newElement) => {
        if (!newElement) return null;
        
        try {
          const unlockedAchievement = await achievementsService.checkNewElementAchievement(
            newElement, 
            props.discoveredElements
          );
          
          if (unlockedAchievement && !shownAchievements.value.has(unlockedAchievement.name)) {
            shownAchievements.value.add(unlockedAchievement.name);
            
            // Rechercher l'image si nécessaire
            let image = unlockedAchievement.image;
            if (!image) {
              const existingAchievement = achievements.value.find(a => a.name === unlockedAchievement.name);
              if (existingAchievement) {
                image = existingAchievement.image;
              }
            }
            
            // Mettre à jour la liste locale
            const index = achievements.value.findIndex(a => a.name === unlockedAchievement.name);
            if (index !== -1) {
              achievements.value[index].unlocked = true;
              achievements.value[index].unlockedAt = unlockedAchievement.unlockedAt;
            }
            
            // Émettre l'événement
            const safeAchievement = {
              ...unlockedAchievement,
              image
            };
            
            emit('achievement-unlocked', safeAchievement);
            emit('achievements-loaded', achievements.value);
            
            return safeAchievement;
          }
          
          return null;
        } catch (err) {
          console.error("Erreur lors de la vérification du nouvel élément:", err);
          
          // Fallback à la vérification locale
          return fallbackCheckNewElement(newElement);
        }
      };
      
      // Fallback pour vérifier un nouvel élément localement
      const fallbackCheckNewElement = (newElement) => {
        if (!newElement) return null;
        
        // Vérifier spécifiquement les achievements liés à cet élément
        const specificAchievements = achievements.value.filter(achievement => 
          !achievement.unlocked && 
          achievement.condition && 
          achievement.condition.includes(`includes('${newElement}')`)
        );
        
        if (specificAchievements.length > 0) {
          const achievement = specificAchievements[0];
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          
          // Vérifier si cet achievement a déjà été affiché
          if (!shownAchievements.value.has(achievement.name)) {
            shownAchievements.value.add(achievement.name);
            
            // Créer une copie sécurisée de l'achievement
            const safeAchievement = {
              name: achievement.name,
              description: achievement.description,
              image: achievement.image,
              unlocked: true,
              unlockedAt: achievement.unlockedAt
            };
            
            emit('achievement-unlocked', safeAchievement);
            emit('achievements-loaded', achievements.value);
            
            // Sauvegarder l'achievement débloqué
            achievementsService.unlockAchievement(achievement.name).catch(error => {
              console.error(`Erreur lors du déblocage de l'achievement ${achievement.name}:`, error);
            });
            
            return safeAchievement;
          }
        }
        
        // Vérifier aussi les achievements basés sur le nombre d'éléments
        const countAchievements = achievements.value.filter(achievement => 
          !achievement.unlocked && 
          achievement.condition && 
          achievement.condition.includes('.length >=')
        );
        
        for (const achievement of countAchievements) {
          try {
            let expression = achievement.condition;
            expression = expression.replace(/this\.discoveredElements/g, 'props.discoveredElements');
            
            // Vérifier uniquement si la condition contient un nombre d'éléments
            const match = expression.match(/length\s*>=\s*(\d+)/);
            if (match) {
              const threshold = parseInt(match[1]);
              if (props.discoveredElements.length >= threshold) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                
                if (!shownAchievements.value.has(achievement.name)) {
                  shownAchievements.value.add(achievement.name);
                  
                  // Créer une copie sécurisée de l'achievement
                  const safeAchievement = {
                    name: achievement.name,
                    description: achievement.description,
                    image: achievement.image,
                    unlocked: true,
                    unlockedAt: achievement.unlockedAt
                  };
                  
                  emit('achievement-unlocked', safeAchievement);
                  emit('achievements-loaded', achievements.value);
                  
                  // Sauvegarder l'achievement débloqué
                  achievementsService.unlockAchievement(achievement.name).catch(error => {
                    console.error(`Erreur lors du déblocage de l'achievement ${achievement.name}:`, error);
                  });
                  
                  return safeAchievement;
                }
              }
            }
          } catch (error) {
            console.error(`Erreur lors de l'évaluation de la condition pour ${achievement.name}:`, error);
          }
        }
        
        return null;
      };
  
      // Initialisation au montage du composant
      onMounted(() => {
        loadAchievements();
        
        // Initialiser la liste des achievements déjà affichés
        shownAchievements.value = new Set(
          props.existingAchievements
            .filter(a => a.unlocked)
            .map(a => a.name)
        );
      });
  
      // Observer les changements dans les éléments découverts
      watch(() => props.discoveredElements, (newElements, oldElements) => {
        if (!oldElements || !Array.isArray(oldElements)) return;
        
        // Si un nouvel élément a été ajouté
        if (newElements.length > oldElements.length) {
          const newElement = newElements.find(e => !oldElements.includes(e));
          if (newElement) {
            handleNewElement(newElement);
          }
        } else if (newElements.length !== oldElements.length) {
          // Si la liste a été complètement modifiée
          checkAchievements(newElements);
        }
      }, { deep: true });
  
      // Observer les achievements existants
      watch(() => props.existingAchievements, (newAchievements) => {
        if (newAchievements && Array.isArray(newAchievements) && newAchievements.length > 0) {
          // Mettre à jour les attributs unlocked des achievements
          achievements.value.forEach((achievement, index) => {
            const existingAchievement = newAchievements.find(a => a.name === achievement.name);
            if (existingAchievement && existingAchievement.unlocked) {
              achievements.value[index].unlocked = true;
              achievements.value[index].unlockedAt = existingAchievement.unlockedAt;
              shownAchievements.value.add(achievement.name);
            }
          });
          
          emit('achievements-loaded', achievements.value);
        }
      }, { deep: true });
  
      return {
        achievements,
        isLoading,
        error,
        loadAchievements,
        checkAchievements,
        handleNewElement
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