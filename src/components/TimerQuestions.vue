<template>
  <div>
    <div v-if="isVisible" class="questions-container">
      <div class="questions-box">
        <!-- Modal de sélection du niveau -->
        <div v-if="!selectedLevel" class="level-selection">
          <button @click="cancelLevelSelection" class="close-modal-btn">&times;</button>
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

        <!-- Modal de sélection de la catégorie -->
        <div v-else-if="!selectedCategory" class="category-selection">
          <button @click="cancelCategorySelection" class="close-modal-btn">&times;</button>
          <h2 class="level-title">Choisissez une catégorie</h2>
          <div class="level-buttons">
            <button 
              v-for="(category, categoryName) in availableCategories" 
              :key="categoryName"
              @click="selectCategory(categoryName)"
              class="level-button"
            >
              {{ categoryName }} 
              <span class="questions-count">
                {{ getCompletedQuestionsCount(categoryName) }}/{{ category.questions.length }}
              </span>
            </button>
          </div>
        </div>
 
        <!-- Affichage des questions -->
        <div v-else>
          <p class="question-text">
            {{ isTimeUp ? "Temps épuisé !" : currentQuestion.text }}
          </p>
          
          <div v-if="currentQuestion.initialElements?.validationMode === 'multiple' && currentQuestion.initialElements?.requiredCount" class="discovery-counter">
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
        <p class="points-earned">+{{ currentQuestion.points || 10 }} pièces</p>
      </div>
    </div>
  </div>
</template>
 
<script>
import '@/assets/TimerQuestionsStyle.css';
import progressService from '@/services/progressService';
 
export default {
  name: 'TimerQuestions',
  emits: [
    'reset-timer', 
    'set-initial-inventory', 
    'reset-craft-zone', 
    'level-selected',
    'coins-earned'
  ],
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [], 
      isVisible: false,
      isTimeUp: false,
      recipesData: null,
      currentScore: 0,
      selectedLevel: null,
      selectedCategory: null,
      questionsData: null,
      showSuccessPopup: false,
      isLoading: false,
      completedQuestions: {
        Facile: {},
        Moyen: {},
        Difficile: {}
      }
    }
  },
  computed: {
    isLoggedIn() {
      return this.$parent.isLoggedIn;
    },
    availableCategories() {
      if (!this.selectedLevel || !this.questionsData?.levels[this.selectedLevel]?.categories) {
        return {};
      }
      return this.questionsData.levels[this.selectedLevel].categories;
    },
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
  async created() {
    await this.loadQuestionsData();
    await this.loadRecipes();
    if (this.isLoggedIn) {
      await this.loadProgress();
    }
  },
  methods: {
    async loadProgress() {
      try {
        console.log('Chargement de la progression...');
        const progress = await progressService.loadGameProgress();
        if (progress?.timerProgress?.completedQuestions) {
          console.log('Progression chargée:', progress.timerProgress);
          this.completedQuestions = {
            Facile: progress.timerProgress.completedQuestions.Facile || {},
            Moyen: progress.timerProgress.completedQuestions.Moyen || {},
            Difficile: progress.timerProgress.completedQuestions.Difficile || {}
          };
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la progression du timer:', error);
      }
    },

    getCompletedQuestionsCount(categoryName) {
      if (!this.selectedLevel || !this.completedQuestions[this.selectedLevel]) return 0;
      const questionsForCategory = this.completedQuestions[this.selectedLevel][categoryName];
      return Array.isArray(questionsForCategory) ? questionsForCategory.length : 0;
    },

    async saveProgress() {
      if (!this.isLoggedIn) {
        console.log('Utilisateur non connecté, pas de sauvegarde');
        return;
      }

      try {
        console.log('Sauvegarde de la progression timer...');
        console.log('État actuel completedQuestions:', this.completedQuestions);

        const timerProgress = {
          completedQuestions: this.completedQuestions,
          unlockedCategories: {
            Facile: Object.keys(this.completedQuestions.Facile || {}),
            Moyen: Object.keys(this.completedQuestions.Moyen || {}),
            Difficile: Object.keys(this.completedQuestions.Difficile || {})
          },
          bestScores: {
            Facile: this.currentScore,
            Moyen: this.currentScore,
            Difficile: this.currentScore
          }
        };

        console.log('Tentative de sauvegarde avec:', timerProgress);
        await progressService.updateTimerProgress(timerProgress);
        console.log('Sauvegarde réussie');
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la progression:', error);
      }
    },

    cancelLevelSelection() {
      this.hide();
      this.loadQuestionsAndReset();
      this.$parent.$emit('force-stop');
    },

    cancelCategorySelection() {
      this.selectedLevel = null;
      this.selectedCategory = null;
      this.questions = [];
      this.$parent.$emit('force-stop');
    },

    async loadRecipes() {
      try {
        const response = await fetch('/data/animaux.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.recipesData = await response.json();
      } catch (error) {
        // Gestion silencieuse de l'erreur sans log en production
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
              categories: {
                "Règne Animal": {
                  questions: []
                }
              }
            }
          }
        };
      }
    },
 
    async selectLevel(level) {
      if (this.isLoading) return;
      this.isLoading = true;
 
      try {
        this.selectedLevel = level;
        this.selectedCategory = null;
        
        this.$emit('level-selected', {
          level,
          timer: this.questionsData.levels[level].timer
        });
 
        await this.$nextTick();
      } finally {
        this.isLoading = false;
      }
    },

    async selectCategory(category) {
      if (this.isLoading) return;
      this.isLoading = true;
 
      try {
        this.selectedCategory = category;
        this.questions = this.questionsData.levels[this.selectedLevel].categories[category].questions;
        this.shuffleQuestions();
        await this.show();
      } finally {
        this.isLoading = false;
      }
    },

    markQuestionAsCompleted(questionId) {
      if (!this.selectedLevel || !this.selectedCategory) return;
      
      console.log('Marquage de la question comme complétée:', {
        level: this.selectedLevel,
        category: this.selectedCategory,
        questionId
      });

      if (!this.completedQuestions[this.selectedLevel]) {
        this.completedQuestions[this.selectedLevel] = {};
      }
      if (!this.completedQuestions[this.selectedLevel][this.selectedCategory]) {
        this.completedQuestions[this.selectedLevel][this.selectedCategory] = [];
      }
      
      if (!this.completedQuestions[this.selectedLevel][this.selectedCategory].includes(questionId)) {
        this.completedQuestions[this.selectedLevel][this.selectedCategory].push(questionId);
        this.saveProgress();
      }
    },
 
    loadQuestionsAndReset() {
      this.currentQuestionIndex = 0;
      this.selectedLevel = null;
      this.selectedCategory = null;
      this.questions = [];
    },
 
    shuffleQuestions() {
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
      }
    },
 
    async show() {
      this.isVisible = true;
      this.isTimeUp = false;
      
      if (!this.selectedLevel || !this.selectedCategory) return;
 
      await this.$nextTick();
      
      if (!this.$parent.currentTimerElements.length) {
        if (this.currentQuestion && this.currentQuestion.initialElements) {
          const requiredElements = this.currentQuestion.initialElements.required || [];
          const additionalElements = this.currentQuestion.initialElements.additional || [];
          const startingElements = [...new Set([...requiredElements, ...additionalElements])];
          
          this.$emit('set-initial-inventory', startingElements);
          await this.$nextTick();
          await new Promise(resolve => setTimeout(resolve, 50));
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
 
    async nextQuestion() {      
      this.$parent.currentTimerElements = [];
      this.$parent.discoveredElements = ["Eau", "Feu", "Terre", "Air"];
 
      if (this.$parent.$refs.craftSystem) {
        this.$parent.$refs.craftSystem.resetCraftingBoard();
      }
 
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.show();
      } else {
        this.currentQuestionIndex = 0;
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.show();
      }
    },
 
    async answerCorrect() {
      const currentQuestion = this.currentQuestion;
      const validationMode = currentQuestion.initialElements?.validationMode || 'any';
      const points = currentQuestion.points || 10;

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
 
          this.currentScore += points;
          this.$emit('coins-earned', points);
          const questionId = currentQuestion.id || `${this.selectedCategory}_${this.currentQuestionIndex}`;
          console.log('Question réussie, ID:', questionId);
          this.markQuestionAsCompleted(questionId);
          this.hide();
          
          this.showSuccessPopup = true;
          this.$emit('reset-craft-zone');
          await new Promise(resolve => setTimeout(resolve, 1500));
          this.showSuccessPopup = false;
          await this.nextQuestion();
        }
      } else if (validationMode === 'multiple') {
        const requiredCount = currentQuestion.initialElements.requiredCount || 1;
        
        if (this.discoveredValidAnswersCount >= requiredCount) {
          currentQuestion.initialElements.required.forEach(element => {
            if (!this.$parent.discoveredElements.includes(element)) {
              this.$parent.discoveredElements.push(element);
            }
          });
 
          this.currentScore += points;
          this.$emit('coins-earned', points);
          const questionId = currentQuestion.id || `${this.selectedCategory}_${this.currentQuestionIndex}`;
          console.log('Question réussie (multiple), ID:', questionId);
          this.markQuestionAsCompleted(questionId);
          this.hide();
          
          this.showSuccessPopup = true;
          this.$emit('reset-craft-zone');
          await new Promise(resolve => setTimeout(resolve, 1500));
          this.showSuccessPopup = false;
          await this.nextQuestion();
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

.level-selection, .category-selection {
  position: relative;
}

.close-modal-btn {
  position: absolute;
  top: -25px;
  right: -25px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #304968;
  border: none;
  color: white;
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-modal-btn:hover {
  background-color: #1a7c8a;
  transform: scale(1.1);
}

.close-modal-btn:active {
  transform: scale(0.95);
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

.questions-count {
  margin-left: 8px;
  opacity: 0.8;
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