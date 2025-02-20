<template>
    <div v-if="isVisible" class="questions-container">
      <div class="questions-box">
        <p class="question-text">
          {{ isTimeUp ? "Temps épuisé !" : currentQuestion.text }}
        </p>
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
        questions: [], // Tableau vide qui sera rempli depuis le JSON
        isVisible: false,
        isTimeUp: false
      }
    },
    computed: {
      currentQuestion() {
        return this.questions[this.currentQuestionIndex] || { text: '' };
      }
    },
    created() {
      this.loadQuestions();
    },
    methods: {
      loadQuestions() {
        fetch('/data/timer-questions.json')
          .then(response => response.json())
          .then(data => {
            this.questions = data.questions;
          })
          .catch(error => {
            console.error('Erreur lors du chargement des questions:', error);
          });
      },
      show() {
        this.isVisible = true;
        this.isTimeUp = false;
        this.currentQuestionIndex = 0;
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