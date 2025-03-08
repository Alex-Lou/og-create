<template>
  <div>
    <div v-if="isVisible" class="questions-container">
      <div class="questions-box">
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

        <div v-else-if="!selectedCategory" class="category-selection">
          <button @click="cancelCategorySelection" class="close-modal-btn">&times;</button>
          <h2 class="level-title">Choisissez une catégorie</h2>
          <div class="level-buttons">
            <button 
              v-for="(category, categoryName) in availableCategories" 
              :key="categoryName"
              @click="selectCategory(categoryName)"
              :class="['level-button', {
                'completed': isCategoryCompleted(categoryName)
              }]"
            >
              {{ categoryName }} 
              <span class="questions-count">
                {{ getCompletedQuestionsCount(categoryName) }}
              </span>
            </button>
          </div>
        </div>
 
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
 
    <!-- Modal de succès style "victoire" -->
    <div v-if="showSuccessPopup" class="victory-modal">
      <div class="victory-content">
        <h2>Correct !</h2>
        
        <div class="rewards-container">
          <h3>Récompenses obtenues :</h3>
          <div class="reward-item" v-if="isNewQuestion">
            <span class="reward-icon">💰</span>
            <span class="reward-value">{{ currentQuestion.points || 10 }} Pièces</span>
          </div>
          <div class="reward-item" v-else>
            <span class="reward-icon">✨</span>
            <span class="reward-value">Question déjà complétée</span>
          </div>
        </div>
        
        <button class="continue-btn" @click="closeSuccessPopup">Continuer</button>
      </div>
    </div>

    <!-- Modal de complétion style "victoire" -->
    <div v-if="showCompletionPopup" class="victory-modal">
      <div class="victory-content">
        <h2>{{ completionMessage }}</h2>
        <p>{{ completionSubMessage }}</p>
        
        <div class="completion-buttons">
          <button 
            v-if="getNextUncompletedCategory()"
            @click="handleContinue" 
            class="continue-btn"
          >
            Continuer
          </button>
          <button 
            @click="handleCompletionClose" 
            class="cancel-btn"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 

 
<script>
import '@/assets/ComponentsStyle/TimerStyle/TimerQuestionsStyle.css';
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
      showCompletionPopup: false,
      completionMessage: '',
      completionSubMessage: '',
      isLoading: false,
      isNewQuestion: true,
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
    },
    remainingCategories() {
      return Object.keys(this.availableCategories).filter(cat => !this.isCategoryCompleted(cat));
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
    isCategoryCompleted(categoryName) {
      if (!this.selectedLevel || !this.completedQuestions[this.selectedLevel]) return false;
      
      const questionsForCategory = this.completedQuestions[this.selectedLevel][categoryName];
      if (!questionsForCategory) return false;

      const totalQuestions = this.questionsData.levels[this.selectedLevel].categories[categoryName].questions.length;
      return Array.isArray(questionsForCategory) && questionsForCategory.length >= totalQuestions;
    },
    loadRecipesFromQuestions() {
  if (this.questionsData && this.selectedLevel && this.selectedCategory) {
    const categoryQuestions = this.questionsData.levels[this.selectedLevel].categories[this.selectedCategory].questions;
    
    categoryQuestions.forEach(question => {
      if (question.initialElements && question.initialElements.recipes) {
        console.log('Recettes trouvées dans la question:', Object.keys(question.initialElements.recipes));
        
        // Ajouter les recettes au système principal
        Object.entries(question.initialElements.recipes).forEach(([result, recipe]) => {
          console.log(`Ajout de la recette Timer: ${recipe} => ${result}`);
          
          // Ajouter à craftingRecipes sous forme non triée
          this.$parent.craftingRecipes[recipe] = result;
          
          // Et aussi ajouter sous forme triée pour compatibilité
          const sortedRecipe = recipe.split('+').sort().join('+');
          this.$parent.craftingRecipes[sortedRecipe] = result;
        });
      }
    });
  }
},

    async loadProgress() {
      try {
        const progress = await progressService.loadGameProgress();
        if (progress?.timerProgress?.completedQuestions) {
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
      if (!this.selectedLevel || !this.completedQuestions[this.selectedLevel]) return '0/0';
      
      const questionsForCategory = this.completedQuestions[this.selectedLevel][categoryName];
      const totalQuestions = this.questionsData.levels[this.selectedLevel].categories[categoryName].questions.length;
      
      const completedCount = Array.isArray(questionsForCategory) ? questionsForCategory.length : 0;
      return `${completedCount}/${totalQuestions}`;
    },

    async saveProgress() {
      if (!this.isLoggedIn) return;

      try {
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

        await progressService.updateTimerProgress(timerProgress);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la progression:', error);
      }
    },

    getNextUncompletedCategory() {
      return this.remainingCategories[0];
    },

    async handleContinue() {
      const nextCategory = this.getNextUncompletedCategory();
      this.showCompletionPopup = false;
      
      if (nextCategory) {
        this.selectedCategory = nextCategory;
        this.questions = this.questionsData.levels[this.selectedLevel].categories[nextCategory].questions;
        this.currentQuestionIndex = 0;
        this.shuffleQuestions();
        
        // Réinitialiser le timer et le redémarrer
        this.$emit('reset-timer');
        this.$emit('resume-timer');
        
        await this.show();
      }
    },

    handleCompletionClose() {
      this.showCompletionPopup = false;
      this.selectedCategory = null;
      this.currentQuestionIndex = 0;
      
      // Déjà géré par force-stop, mais pour être sûr
      this.$emit('stop-timer');
      
      this.$parent.$emit('force-stop');
      // Réinitialiser aussi le timer dans le bouton TimerMode
      if (this.$parent.$refs.timerModeButton) {
        this.$parent.$refs.timerModeButton.confirmStopTimer();
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
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.recipesData = await response.json();
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
      }
    },

    async loadQuestionsData() {
      try {
        const response = await fetch('/data/timer-questions.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        this.questionsData = await response.json();
      } catch (error) {
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
    this.currentQuestionIndex = 0;
    
    // Ajouter cette ligne pour charger les recettes
    this.loadRecipesFromQuestions();
    
    await this.show();
  } finally {
    this.isLoading = false;
  }
},

    markQuestionAsCompleted(questionId) {
      if (!this.selectedLevel || !this.selectedCategory) return;
      
      if (!this.completedQuestions[this.selectedLevel]) {
        this.completedQuestions[this.selectedLevel] = {};
      }
      if (!this.completedQuestions[this.selectedLevel][this.selectedCategory]) {
        this.completedQuestions[this.selectedLevel][this.selectedCategory] = [];
      }
      
      const existingQuestions = this.completedQuestions[this.selectedLevel][this.selectedCategory];
      this.isNewQuestion = !existingQuestions.includes(questionId);
      
      if (this.isNewQuestion) {
        existingQuestions.push(questionId);
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
        // Catégorie terminée
        this.showCompletionPopup = true;
        this.completionMessage = `Félicitations ! Vous avez complété la catégorie ${this.selectedCategory}!`;
        
        const nextCategory = this.getNextUncompletedCategory();
        this.completionSubMessage = nextCategory 
          ? `Prochaine catégorie disponible : ${nextCategory}`
          : 'Toutes les catégories sont complétées !';

        // Émettre un événement pour mettre le timer en pause
        this.$emit('pause-timer');

        await this.saveProgress();
      }
    },
 
    async answerCorrect() {
      const currentQuestion = this.currentQuestion;
      const validationMode = currentQuestion.initialElements?.validationMode || 'any';
      const points = currentQuestion.points || 10;
      const questionId = currentQuestion.id || `${this.selectedCategory}_${this.currentQuestionIndex}`;

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

          this.markQuestionAsCompleted(questionId);
          if (this.isNewQuestion) {
            this.currentScore += points;
            this.$emit('coins-earned', points);
          }

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

          this.markQuestionAsCompleted(questionId);
          if (this.isNewQuestion) {
            this.currentScore += points;
            this.$emit('coins-earned', points);
          }

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