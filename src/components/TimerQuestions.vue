<template>
  <div v-if="isVisible" class="questions-container">
    <div class="questions-box">
      <!-- Modal de sélection du niveau -->
      <div v-if="!selectedLevel" class="level-selection">
        <h2 class="level-title">Choisissez votre niveau</h2>
        <div class="level-buttons">
          <button 
            v-for="level in ['Facile', 'Moyen', 'Difficile']" 
            :key="level"
            @click="selectLevel(level)"
            class="level-button"
          >
            {{ level }}
          </button>
        </div>
      </div>

      <!-- Affichage des questions -->
      <div v-else>
        <p class="question-text">
          {{ isTimeUp ? "Temps épuisé !" : currentQuestion.text }}
        </p>
        
        <div v-if="currentQuestion.initialElements?.validationMode === 'multiple'" class="discovery-counter">
          {{ discoveredValidAnswersCount }}/{{ currentQuestion.initialElements.requiredCount }}
        </div>
        
        <button 
          class="next-question-button"
          @click="handleButtonClick"
        >
          {{ isTimeUp ? "Ok" : "Compris !" }}
        </button>
      </div>
    </div>
  </div>

  <!-- Popup de succès -->
  <div v-if="showSuccessPopup" class="success-popup">
    <div class="success-content">
      <p>Correct !</p>
    </div>
  </div>
</template>

<script>
import '@/assets/TimerQuestionsStyle.css';

export default {
  name: 'TimerQuestions',
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [], 
      isVisible: false,
      isTimeUp: false,
      recipesData: null,
      currentScore: 0,
      selectedLevel: null,
      questionsData: null,
      showSuccessPopup: false
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || { 
        text: '',
        validAnswers: [],
        initialElements: {
          validationMode: 'any',
          required: [],
          additional: []
        }
      };
    },
    discoveredValidAnswersCount() {
      if (!this.currentQuestion?.validAnswers) return 0;
      
      return this.currentQuestion.validAnswers.filter(answer => 
        this.$parent.discoveredElements.includes(answer)
      ).length;
    }
  },
  created() {
    this.loadQuestionsData();
    this.loadRecipes();
  },
  methods: {
    async loadRecipes() {
      try {
        const response = await fetch('/data/animaux.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.recipesData = await response.json();
        if (process.env.NODE_ENV !== 'production') {
          console.log("Recettes chargées:", this.recipesData);
        }
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erreur lors du chargement des recettes:', error);
        }
      }
    },

    async loadQuestionsData() {
      try {
        const response = await fetch('/data/timer-questions.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.questionsData = await response.json();
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Erreur lors du chargement des questions:', error);
        }
        this.questionsData = {
          levels: {
            "Facile": {
              timer: 300,
              questions: []
            }
          }
        };
      }
    },

    selectLevel(level) {
      this.selectedLevel = level;
      const levelData = this.questionsData.levels[level];
      this.questions = levelData.questions;
      this.shuffleQuestions();
      this.$emit('level-selected', {
        level,
        timer: levelData.timer
      });
      this.show();
    },

    loadQuestionsAndReset() {
      this.currentQuestionIndex = 0;
      this.selectedLevel = null;
      this.questions = [];
    },

    shuffleQuestions() {
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
      }
    },

    show() {
      this.isVisible = true;
      this.isTimeUp = false;
      
      if (!this.selectedLevel) return;
      
      if (!this.$parent.currentTimerElements.length) {
        if (this.currentQuestion && this.currentQuestion.initialElements) {
          const requiredElements = this.currentQuestion.initialElements.required || [];
          const additionalElements = this.currentQuestion.initialElements.additional || [];
          const startingElements = [...new Set([...requiredElements, ...additionalElements])];
          
          if (process.env.NODE_ENV !== 'production') {
            console.log("Éléments initiaux à ajouter:", startingElements);
          }
          
          this.$emit('set-initial-inventory', startingElements);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          console.log("Réaffichage de la question, conservation de l'inventaire actuel:", this.$parent.currentTimerElements);
        }
      }
    },

    hide() {
      this.isVisible = false;
    },

    handleButtonClick() {
      this.hide();
    },

    getCurrentQuestion() {
      return this.currentQuestion;
    },

    showTimeUp() {
      this.isTimeUp = true;
      this.isVisible = true;
    },

    nextQuestion() {      
      this.$parent.currentTimerElements = [];
      this.$parent.discoveredElements = ["Eau", "Feu", "Terre", "Air"];

      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        setTimeout(() => {
          this.show();
        }, 100);
      } else {
        this.currentQuestionIndex = 0;
        setTimeout(() => {
          this.show();
        }, 100);
      }
    },

    answerCorrect() {
      const currentQuestion = this.currentQuestion;
      const validationMode = currentQuestion.initialElements?.validationMode || 'any';

      if (validationMode === 'any') {
        const isValidAnswer = currentQuestion.validAnswers.some(answer => 
          this.$parent.discoveredElements.includes(answer)
        );
        
        if (isValidAnswer) {
          currentQuestion.initialElements.required.forEach(element => {
            if (!this.$parent.discoveredElements.includes(element)) {
              this.$parent.discoveredElements.push(element);
            }
          });

          this.currentScore += currentQuestion.points || 10;
          this.hide();
          
          // Afficher le popup de succès
          this.showSuccessPopup = true;
          setTimeout(() => {
            this.showSuccessPopup = false;
            this.nextQuestion();
          }, 1500);
        }
      } else if (validationMode === 'multiple') {
        const requiredCount = currentQuestion.initialElements.requiredCount || 1;
        
        if (this.discoveredValidAnswersCount >= requiredCount) {
          currentQuestion.initialElements.required.forEach(element => {
            if (!this.$parent.discoveredElements.includes(element)) {
              this.$parent.discoveredElements.push(element);
            }
          });

          this.currentScore += currentQuestion.points || 10;
          this.hide();
          
          // Afficher le popup de succès
          this.showSuccessPopup = true;
          setTimeout(() => {
            this.showSuccessPopup = false;
            this.nextQuestion();
          }, 1500);
        }
      }
    },

    resetQuestions() {
      this.loadQuestionsAndReset();
      this.currentScore = 0;
    }
  }
}
</script>

<style scoped>
.questions-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.questions-box {
  background-color: #1a1d24;
  border: 2px solid #304968;
  border-radius: 15px;
  padding: 2rem;
  width: 400px;
  text-align: center;
  box-shadow: 0 0 20px rgba(45, 150, 164, 0.3);
}

.level-title {
  color: #2D96A4;
  font-family: 'BenjaminFranklin', Arial;
  font-size: 24px;
  margin-bottom: 2rem;
}

.level-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.level-button {
  background-color: #2D96A4;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-family: 'BenjaminFranklin', Arial;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.level-button:hover {
  background-color: #1a7c8a;
  transform: scale(1.05);
}

.level-button:active {
  transform: scale(0.95);
}

.question-text {
  color: #2D96A4;
  font-family: 'BenjaminFranklin', Arial;
  font-size: 20px;
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.discovery-counter {
  font-size: 18px;
  color: #2D96A4;
  margin: 10px 0;
  font-weight: bold;
}

.next-question-button {
  background-color: #2D96A4;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-family: 'BenjaminFranklin', Arial;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.next-question-button:hover {
  background-color: #1a7c8a;
  transform: scale(1.05);
}

.next-question-button:active {
  transform: scale(0.95);
}

.success-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1100;
}

.success-content {
  background-color: #1a1d24;
  border: 2px solid #2D96A4;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  animation: popIn 0.3s ease-out;
}

.success-content p {
  color: #2D96A4;
  font-family: 'BenjaminFranklin', Arial;
  font-size: 24px;
  margin: 0;
}

@keyframes popIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>