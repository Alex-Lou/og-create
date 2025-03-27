<template>
  <!-- Complètement supprimer l'affichage des erreurs liées aux questions du Timer -->
  <div v-if="error && !error.includes('timerQuestions')" class="error-message">
    {{ error }}
  </div>
  
  <!-- Composants de chargement spécialisés -->
  <DataLoadingCategories
    ref="categoriesLoaderRef"
    :filesToLoad="filesToLoad"
    :existingData="existingData"
    @data-loaded="handleDataLoaded"
    @error="handleError"
  />
  
  <AchievementsLoader
    ref="achievementsLoaderRef"
    :discoveredElements="discoveredElements"
    :existingAchievements="existingData.achievements || []"
    @achievements-loaded="handleAchievementsLoaded"
    @achievement-unlocked="handleAchievementUnlocked"
    @error="handleError"
  />
  
  <TimerQuestionsLoader
    ref="timerQuestionsLoaderRef"
    :isTimerMode="isTimerMode"
    @timer-questions-loaded="handleTimerQuestionsLoaded"
    @error="handleError"
  />
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';
import DataLoadingCategories from './DataLoadingCategories.vue';
import AchievementsLoader from './AchievementsLoader.vue';
import TimerQuestionsLoader from './TimerQuestionsLoader.vue';

export default {
  name: 'DataLoading',
  components: {
    DataLoadingCategories,
    AchievementsLoader,
    TimerQuestionsLoader
  },
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
    const discoveredElements = ref([]);
    const isLoading = ref({
      gameData: false,
      achievements: false,
      timerQuestions: false
    });
    const previousMode = ref(props.isTimerMode);
    
    // Références aux composants enfants
    const categoriesLoaderRef = ref(null);
    const achievementsLoaderRef = ref(null);
    const timerQuestionsLoaderRef = ref(null);

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

    // Gestionnaires d'événements pour les sous-composants
    const handleDataLoaded = (data) => {
      emit('data-loaded', data);
    };
    
    const handleAchievementsLoaded = (achievements) => {
      emit('achievements-loaded', achievements);
    };
    
    const handleAchievementUnlocked = (achievement) => {
      emit('achievement-unlocked', achievement);
    };
    
    const handleTimerQuestionsLoaded = (data) => {
      emit('timer-questions-loaded', data);
    };
    
    const handleError = (errorMessage) => {
      error.value = errorMessage;
    };

    // Chargement de toutes les données
    const loadAllData = async () => {
      // Réinitialiser les erreurs avant de recharger
      error.value = null;
      
      try {
        // Charger les données en parallèle depuis les composants spécialisés
        let gameData, achievementsData, timerQuestionsData;
        
        if (props.isTimerMode) {
          // Si en mode Timer, charger les trois types de données
          const results = await Promise.all([
            categoriesLoaderRef.value.loadGameData(),
            achievementsLoaderRef.value.loadAchievements(),
            timerQuestionsLoaderRef.value.loadTimerQuestions()
          ]);
          
          gameData = results[0];
          achievementsData = results[1];
          timerQuestionsData = results[2];
        } else {
          // Sinon, ne charger que les données de jeu et les achievements
          const results = await Promise.all([
            categoriesLoaderRef.value.loadGameData(),
            achievementsLoaderRef.value.loadAchievements()
          ]);
          
          gameData = results[0];
          achievementsData = results[1];
        }
        
        // Construire l'objet de données complet
        const fullLoadedData = {
          ...(gameData || {}),
          achievements: achievementsData || [],
          ...(props.isTimerMode && timerQuestionsData ? { timerQuestions: timerQuestionsData } : {}),
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

    // Traiter un nouvel élément découvert (craft)
    const handleCraft = (newElement) => {
      if (props.isTimerMode) {
        emit('craft-success', newElement);
        return;
      }
      
      // Mise à jour de notre copie locale des éléments découverts
      if (!discoveredElements.value.includes(newElement)) {
        discoveredElements.value.push(newElement);
        
        // Utiliser le composant d'achievements pour vérifier si de nouveaux achievements sont débloqués
        if (achievementsLoaderRef.value) {
          achievementsLoaderRef.value.handleNewElement(newElement);
        }
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

    // Initialisation au montage du composant
    onMounted(async () => {
      try {
        // Réinitialiser les erreurs
        error.value = null;
        
        // S'assurer que les références sont disponibles avant de les utiliser
        await new Promise(resolve => setTimeout(resolve, 0));
        
        // Charger les données du jeu
        if (categoriesLoaderRef.value) {
          await categoriesLoaderRef.value.loadGameData();
        }
        
        // Charger les achievements
        if (achievementsLoaderRef.value) {
          await achievementsLoaderRef.value.loadAchievements();
        }
        
        // Charger les questions du timer uniquement si on est en mode Timer
        if (props.isTimerMode && timerQuestionsLoaderRef.value) {
          await timerQuestionsLoaderRef.value.loadTimerQuestions();
        }
        
        // Si des éléments découverts sont disponibles dans les props
        if (props.existingData.discoveredElements && Array.isArray(props.existingData.discoveredElements)) {
          discoveredElements.value = [...props.existingData.discoveredElements];
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
      }
    });

    return {
      error,
      isLoading,
      discoveredElements,
      handleCraft,
      loadAllData,
      handleDataLoaded,
      handleAchievementsLoaded,
      handleAchievementUnlocked,
      handleTimerQuestionsLoaded,
      handleError,
      previousMode,
      filesToLoad,
      categoriesLoaderRef,
      achievementsLoaderRef,
      timerQuestionsLoaderRef
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