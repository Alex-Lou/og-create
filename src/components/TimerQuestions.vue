<template>
  <div v-if="isVisible" class="questions-container">
    <div class="questions-box">
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
</template>

<script>
export default {
  name: 'TimerQuestions',
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [], 
      isVisible: false,
      isTimeUp: false,
      recipesData: null,
      currentScore: 0
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || { 
        text: '',
        validAnswers: [],
        initialElements: {
          validationMode: 'any',
          required: [
            "Félin", "Chaleur", "Mammifère", "Griffe", 
            "Agilité", "Force", "Rugissement", "Territoire"
          ]
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
    this.loadQuestions();
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

    loadQuestions() {
      fetch('/data/timer-questions.json')
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (process.env.NODE_ENV !== 'production') {
            console.log("Questions chargées:", data);
          }
          this.questions = data.questions;
          this.shuffleQuestions();
        })
        .catch(error => {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Erreur lors du chargement des questions:', error);
          }
          this.questions = [{
            text: "Créez le roi de la savane",
            validAnswers: ["Lion"],
            points: 10,
            initialElements: {
              validationMode: "any",
              required: [
                "Félin", "Chaleur", "Mammifère", "Griffe", 
                "Agilité", "Force", "Territoire", "Rugissement"
              ]
            }
          }];
        });
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
      
      const startingElements = this.currentQuestion.initialElements.required || [
        "Félin", "Chaleur", "Mammifère", "Griffe", 
        "Agilité", "Force", "Rugissement", "Territoire"
      ];
      
      if (process.env.NODE_ENV !== 'production') {
        console.log("Éléments à émettre:", startingElements);
      }
      this.$emit('set-initial-inventory', startingElements);
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
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.show();
      } else {
        this.currentQuestionIndex = 0;
        this.show();
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
          setTimeout(() => {
            this.nextQuestion();
          }, 1000);
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
          setTimeout(() => {
            this.nextQuestion();
          }, 1000);
        }
      }
    },

    resetQuestions() {
      this.currentQuestionIndex = 0;
      this.currentScore = 0;
      this.shuffleQuestions();
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
</style>
