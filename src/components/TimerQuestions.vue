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
    questions: [], // Tableau qui sera rempli depuis le JSON
    isVisible: false,
    isTimeUp: false,
    recipesData: null, // Pour stocker les recettes/éléments
    currentScore: 0
  }
},
computed: {
  currentQuestion() {
    return this.questions[this.currentQuestionIndex] || { 
      text: '',
      validAnswers: [],
      initialElements: [
        "Félin", "Chaleur", "Mammifère", "Griffe", 
        "Agilité", "Force", "Rugissement", "Territoire"
      ]
    };
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
      console.log("Recettes chargées:", this.recipesData);
    } catch (error) {
      console.error('Erreur lors du chargement des recettes:', error);
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
        console.log("Questions chargées:", data);
        this.questions = data.questions;
        this.shuffleQuestions();
      })
      .catch(error => {
        console.error('Erreur lors du chargement des questions:', error);
        // Questions par défaut si le chargement échoue
        this.questions = [{
          text: "Créez le roi de la savane",
          validAnswers: ["Lion"],
          points: 10,
          initialElements: [
            "Félin", "Chaleur", "Mammifère", "Griffe", 
            "Agilité", "Force", "Rugissement", "Territoire"
          ]
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
  // Récupérez les éléments depuis la question courante
  const startingElements = this.currentQuestion.initialElements.required
    .concat(this.currentQuestion.initialElements.additional);
  
  console.log("Éléments à émettre pour le Timer:", startingElements);
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
    this.currentScore += this.currentQuestion.points || 10;
    this.hide();
    setTimeout(() => {
      this.nextQuestion();
    }, 1000);
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