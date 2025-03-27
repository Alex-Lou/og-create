<template>
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch } from 'vue'; // Suppression de computed non utilisé
  import gameService from '@/services/gameService';
  
  export default {
    name: 'TimerQuestionsLoader',
    props: {
      isTimerMode: {
        type: Boolean,
        default: false
      }
    },
    emits: ['timer-questions-loaded', 'error'],
  
    setup(props, { emit }) {
      const error = ref(null);
      const timerQuestions = ref(null);
      const isLoading = ref(false);
  
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
  
        isLoading.value = true;
        error.value = null;
  
        try {
          const data = await gameService.loadFile('timer-questions');
          
          if (!data || !data.levels) {
            throw new Error('Format de données incorrect pour les questions du Timer');
          }
          
          timerQuestions.value = data;
          emit('timer-questions-loaded', data);
          return data;
        } catch (err) {
          console.error('Erreur lors du chargement des questions du Timer:', err);
          if (props.isTimerMode) {
            error.value = "Erreur lors du chargement des questions du Timer";
            emit('error', error.value);
          }
          throw err;
        } finally {
          isLoading.value = false;
        }
      };
  
      // Observer les changements de mode
      watch(() => props.isTimerMode, (newValue, oldValue) => {
        if (newValue && !oldValue) {
          // Si on passe en mode Timer, charger les questions
          loadTimerQuestions();
        } else if (!newValue && oldValue) {
          // Si on quitte le mode Timer, réinitialiser les erreurs
          if (error.value && error.value.includes('timerQuestions')) {
            error.value = null;
          }
        }
      }, { immediate: true });
  
      // Initialisation
      onMounted(() => {
        if (props.isTimerMode) {
          loadTimerQuestions();
        }
      });
  
      // Ajouter une méthode setQuestions pour la compatibilité
      const setQuestions = (questions) => {
        console.log("TimerQuestionsLoader: setQuestions appelé", questions);
        // Émettre un événement pour permettre à App.vue de gérer les questions
        emit('questions-set', questions);
        return true;
      };
  
      // Exposer les méthodes
      return {
        timerQuestions,
        error,
        isLoading,
        loadTimerQuestions,
        setQuestions // Exposer la méthode setQuestions pour compatibilité
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