<template>
  <div>
    <div v-if="isVisible" class="questions-container">
      <div class="questions-box">
        <!-- Cadre ornemental -->
        <div class="question-frame">
          <div class="frame-corner corner-tl">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-tl">✧</div>
          </div>
          <div class="frame-corner corner-tr">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-tr">✧</div>
          </div>
          <div class="frame-corner corner-bl">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-bl">✧</div>
          </div>
          <div class="frame-corner corner-br">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-br">✧</div>
          </div>
          
          <!-- Ligne de séparation pour le titre -->
          <div class="title-separator"></div>
        </div>
        
        <!-- Effet de fumée -->
        <div class="smoke-container">
          <div class="smoke smoke1"></div>
          <div class="smoke smoke2"></div>
          <div class="smoke smoke-top"></div>
        </div>
        
        <!-- Champ d'étoiles -->
        <div class="star-field">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        
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
 
    <!-- Modal de succès style mystique -->
    <div v-if="showSuccessPopup" class="victory-modal">
      <div class="victory-content">
        <!-- Cadre ornemental pour la victoire -->
        <div class="victory-frame">
          <div class="frame-corner corner-tl">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-tl">✧</div>
          </div>
          <div class="frame-corner corner-tr">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-tr">✧</div>
          </div>
          <div class="frame-corner corner-bl">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-bl">✧</div>
          </div>
          <div class="frame-corner corner-br">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-br">✧</div>
          </div>
        </div>
        
        <!-- Effets visuels -->
        <div class="star-field-victory">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        
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
    
    <!-- Modal de complétion style mystique -->
    <div v-if="showCompletionPopup" class="victory-modal">
      <div class="victory-content">
        <!-- Cadre ornemental pour la complétion -->
        <div class="victory-frame">
          <div class="frame-corner corner-tl">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-tl">✧</div>
          </div>
          <div class="frame-corner corner-tr">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-tr">✧</div>
          </div>
          <div class="frame-corner corner-bl">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-bl">✧</div>
          </div>
          <div class="frame-corner corner-br">
            <div class="corner-dot"></div>
            <div class="frame-symbol symbol-br">✧</div>
          </div>
        </div>
        
        <!-- Effets visuels -->
        <div class="star-field-victory">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        
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
import gameService from '@/services/gameService';
import notificationService from '@/services/notificationService';
 
export default {
  name: 'TimerQuestions',
  props: {
    isLoggedIn: { type: Boolean, default: false },
    // Inventaire courant (éléments de la question + créations)
    discoveredElements: { type: Array, default: () => [] }
  },
  emits: [
    'reset-timer', 'show-level-selection', 'pause-timer', 'resume-timer', 'stop-timer',
    'set-initial-inventory', 'reset-craft-zone', 'level-selected', 'coins-earned',
    'add-recipes', 'add-emojis', 'timer-progress-updated'
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
      timerProgress: null,
      completedQuestions: {
        Facile: {},
        Moyen: {},
        Difficile: {}
      }
    }
  },
  computed: {
    availableCategories() {
      if (!this.selectedLevel || !this.questionsData || !this.questionsData.levels || !this.questionsData.levels[this.selectedLevel] || !this.questionsData.levels[this.selectedLevel].categories) {
        console.warn(`Données de catégories non disponibles pour le niveau ${this.selectedLevel}:`, this.questionsData);
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
        this.discoveredElements.includes(answer)
      ).length;
    },
    remainingCategories() {
      return Object.keys(this.availableCategories).filter(cat => !this.isCategoryCompleted(cat));
    }
  },
  async created() {
    await this.loadQuestionsData();
    await this.loadRecipes();
    
    // Chargement de la progression ici, que l'utilisateur soit connecté ou non
    await this.loadProgress();
  },
  methods: {
    cleanupTimerData() {
      // Réinitialiser les variables locales (l'inventaire est géré par App)
      this.currentQuestionIndex = 0;
      
      console.log("TimerQuestions: Nettoyage des données du timer effectué");
    },
    isCategoryCompleted(categoryName) {
      if (!this.selectedLevel || !this.completedQuestions[this.selectedLevel]) return false;
      
      // Si la catégorie est explicitement débloquée dans timerProgress
      if (this.timerProgress && 
          this.timerProgress.unlockedCategories && 
          this.timerProgress.unlockedCategories[this.selectedLevel] &&
          this.timerProgress.unlockedCategories[this.selectedLevel].includes(categoryName)) {
        return true;
      }
      
      // Sinon, vérifier les questions complétées
      const questionsForCategory = this.completedQuestions[this.selectedLevel][categoryName];
      if (!questionsForCategory) return false;

      const totalQuestions = this.questionsData.levels[this.selectedLevel].categories[categoryName].questions.length;
      return Array.isArray(questionsForCategory) && questionsForCategory.length >= totalQuestions;
    },
    loadRecipesFromQuestions() {
      if (!this.questionsData || !this.selectedLevel || !this.selectedCategory) return;
      const categoryQuestions = this.questionsData.levels[this.selectedLevel].categories[this.selectedCategory].questions;
      const recipes = {};
      categoryQuestions.forEach(question => {
        // Structure simple ou imbriquée (initialElements.initialElements)
        const initial = question.initialElements?.recipes
          ? question.initialElements
          : question.initialElements?.initialElements;
        Object.entries(initial?.recipes || {}).forEach(([result, recipe]) => {
          recipes[recipe] = result;
          recipes[recipe.split('+').sort().join('+')] = result;
        });
      });
      if (Object.keys(recipes).length) this.$emit('add-recipes', recipes);
    },
    async loadProgress() {
      try {
        const progress = await gameService.loadTimerProgress();
        
        // Vérifier si nous avons des données complètes et plus récentes
        if (progress && progress.completedQuestions) {
          // Fusion des données au lieu de remplacement
          for (const level in progress.completedQuestions) {
            if (!this.completedQuestions[level]) {
              this.completedQuestions[level] = {};
            }
            
            for (const category in progress.completedQuestions[level]) {
              const serverCount = Array.isArray(progress.completedQuestions[level][category]) 
                ? progress.completedQuestions[level][category].length : 0;
              
              const localCount = Array.isArray(this.completedQuestions[level][category])
                ? this.completedQuestions[level][category].length : 0;
              
              if (serverCount >= localCount) {
                this.completedQuestions[level][category] = progress.completedQuestions[level][category];
              } else {
                console.log(`Données locales conservées pour ${level}/${category}: ${localCount} > ${serverCount}`);
              }
            }
          }
          
          // Stocker également la structure complète
          this.timerProgress = progress;
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement de la progression du timer:', error);
      }
    },
    getCompletedQuestionsCount(categoryName) {
      if (!this.selectedLevel || !this.completedQuestions[this.selectedLevel]) return '0/0';
      
      const questionsForCategory = this.completedQuestions[this.selectedLevel][categoryName];
      const totalQuestions = this.questionsData.levels[this.selectedLevel].categories[categoryName].questions.length;
      
      let completedCount = Array.isArray(questionsForCategory) ? questionsForCategory.length : 0;
      
      // Si la catégorie est dans unlockedCategories, considérer qu'elle est complétée
      if (completedCount === 0 && this.timerProgress && 
          this.timerProgress.unlockedCategories && 
          this.timerProgress.unlockedCategories[this.selectedLevel] &&
          this.timerProgress.unlockedCategories[this.selectedLevel].includes(categoryName)) {
        completedCount = totalQuestions;
      }
      
      return `${completedCount}/${totalQuestions}`;
    },
    isCategoryUnlocked(categoryName) {
      return this.timerProgress && 
             this.timerProgress.unlockedCategories && 
             this.timerProgress.unlockedCategories[this.selectedLevel] && 
             this.timerProgress.unlockedCategories[this.selectedLevel].includes(categoryName);
    },
    async saveProgress() {
      if (!this.isLoggedIn) return;
      try {
        // Si timerProgress n'est pas initialisé, créer une structure par défaut
        if (!this.timerProgress) {
          this.timerProgress = {
            completedQuestions: this.completedQuestions,
            unlockedCategories: {},
            bestScores: {
              Facile: 0,
              Moyen: 0,
              Difficile: 0
            }
          };
        }
        
        // S'assurer que la structure des catégories débloquées est correcte
        if (!this.timerProgress.unlockedCategories) {
          this.timerProgress.unlockedCategories = {};
        }
        
        // Pour chaque niveau, s'assurer que les catégories complétées sont bien dans unlockedCategories
        for (const level in this.completedQuestions) {
          if (!this.timerProgress.unlockedCategories[level]) {
            this.timerProgress.unlockedCategories[level] = [];
          }
          
          for (const category in this.completedQuestions[level]) {
            const questionsCompleted = this.completedQuestions[level][category] || [];
            const totalQuestions = this.questionsData?.levels[level]?.categories[category]?.questions?.length || 0;
            
            if (questionsCompleted.length >= totalQuestions && 
                !this.timerProgress.unlockedCategories[level].includes(category)) {
              this.timerProgress.unlockedCategories[level].push(category);
            }
          }
        }
        
        // Mettre à jour les scores
        // Meilleur score du niveau joué uniquement
        const bestScores = { Facile: 0, Moyen: 0, Difficile: 0, ...this.timerProgress.bestScores };
        if (this.selectedLevel) {
          bestScores[this.selectedLevel] = Math.max(bestScores[this.selectedLevel] || 0, this.currentScore);
        }
        this.timerProgress.bestScores = bestScores;
        
        // Utiliser le service gameService pour une mise à jour
        try {
          await gameService.updateTimerProgress(this.timerProgress);
        } catch (error) {
          console.error("Erreur lors de la mise à jour directe:", error);
          // En cas d'échec, essayer via progressService
          await progressService.updateTimerProgress(this.timerProgress);
        }
        
        this.$emit('timer-progress-updated', this.timerProgress);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde de la progression:', error);
      }
    },
    getNextUncompletedCategory() {
      let notCompleted = [];
      
      for (const category in this.availableCategories) {
        if (!this.isCategoryCompleted(category)) {
          notCompleted.push(category);
        }
      }
      
      return notCompleted.length > 0 ? notCompleted[0] : null;
    },
    async handleContinue() {
      this.showCompletionPopup = false;
      
      const nextCategory = this.getNextUncompletedCategory();
      if (nextCategory) {
        // Nettoyer les données avant de passer à la prochaine catégorie
        this.cleanupQuestionData();
        
        this.selectedCategory = nextCategory;
        this.questions = this.questionsData.levels[this.selectedLevel].categories[nextCategory].questions;
        this.currentQuestionIndex = 0;
        this.shuffleQuestions();
        
        // Charger explicitement les recettes avant d'afficher la question
        this.loadRecipesFromQuestions();
        
        // Réinitialiser le timer et le redémarrer
        this.$emit('reset-timer');
        this.$emit('resume-timer');
        
        await this.show();
      }
    },
    cleanupQuestionData() {
      // L'inventaire de la question suivante est posé par App (set-initial-inventory)
      this.$emit('reset-craft-zone');
    },
    // Modification de la méthode handleCompletionClose pour revenir correctement à la sélection de niveau
    handleCompletionClose() {
      // Fermer le popup
      this.showCompletionPopup = false;
      
      // Nettoyer les données
      this.cleanupQuestionData();
      
      // Réinitialiser catégorie et index
      this.selectedCategory = null;
      this.currentQuestionIndex = 0;
      
      // Si toutes les catégories sont complétées
      if (this.remainingCategories.length === 0) {
        // Retourner au choix de niveau (premier palier) sans quitter le mode Timer
        this.selectedLevel = null;
        
        // NOUVEAU: Émettre un événement pour indiquer qu'on doit réafficher 
        // le menu de sélection
        this.$emit('show-level-selection');
        
        // Ne pas appeler force-stop ni confirmStopTimer
      } else {
        // Comportement normal pour les catégories non complétées
        this.$emit('stop-timer');
      }
    },
    async closeSuccessPopup() {
      this.showSuccessPopup = false;
      await this.nextQuestion();
    },
    cancelLevelSelection() {
      // Nettoyer les données
      this.cleanupQuestionData();
      this.cleanupTimerData();
      
      this.hide();
      this.loadQuestionsAndReset();
      this.$emit('stop-timer');
    },
    cancelCategorySelection() {
      // Nettoyer les données
      this.cleanupQuestionData();
      
      this.selectedLevel = null;
      this.selectedCategory = null;
      this.questions = [];
      this.$emit('stop-timer');
    },
    async loadRecipes() {
      try {
        this.recipesData = await gameService.loadFile('animaux');
      } catch (error) {
        console.error('Erreur lors du chargement des recettes:', error);
      }
    },
    async loadQuestionsData() {
      try {
        
        // Essayer de charger depuis l'API
        const data = await gameService.loadFile('timer-questions');
        
        // Vérifier si la structure attendue est présente
        if (data && data.levels) {
          // Emojis des éléments propres au Timer
          if (data.allEmojis) {
            this.$emit('add-emojis', data.allEmojis);
          }
          
          this.questionsData = data;
          return this.questionsData;
        } else {
          console.warn("Structure incorrecte depuis l'API:", data);
          
          // Données par défaut en cas d'échec
          this.questionsData = {
            levels: {
              "Facile": { 
                timer: 300,
                categories: { 
                  "Règne Animal": { 
                    questions: [
                      {
                        id: "default_easy_1",
                        text: "Créez un animal marin",
                        validAnswers: ["Poisson", "Baleine", "Dauphin"],
                        points: 10,
                        initialElements: {
                          validationMode: "any",
                          required: ["Eau", "Animal"],
                          additional: []
                        }
                      }
                    ] 
                  } 
                }
              },
              "Moyen": { 
                timer: 240,
                categories: { 
                  "Règne Animal": { 
                    questions: [
                      {
                        id: "default_medium_1",
                        text: "Créez un mammifère volant",
                        validAnswers: ["Chauve-souris"],
                        points: 20,
                        initialElements: {
                          validationMode: "any",
                          required: ["Animal", "Air"],
                          additional: ["Aile"]
                        }
                      }
                    ] 
                  } 
                }
              },
              "Difficile": { 
                timer: 180,
                categories: { 
                  "Règne Animal": { 
                    questions: [
                      {
                        id: "default_hard_1",
                        text: "Créez un animal marin intelligent",
                        validAnswers: ["Dauphin", "Baleine", "Pieuvre"],
                        points: 30,
                        initialElements: {
                          validationMode: "any",
                          required: ["Eau", "Animal", "Intelligence"],
                          additional: []
                        }
                      }
                    ] 
                  } 
                }
              }
            }
          };
        }
        
        return this.questionsData;
      } catch (error) {
        console.error("Erreur lors du chargement des questions:", error);
        
        // Données par défaut en cas d'échec
        this.questionsData = {
          levels: {
            "Facile": { 
              timer: 300,
              categories: { 
                "Règne Animal": { 
                  questions: [
                    {
                      id: "default_easy_1",
                      text: "Créez un animal marin",
                      validAnswers: ["Poisson", "Baleine", "Dauphin"],
                      points: 10,
                      initialElements: {
                        validationMode: "any",
                        required: ["Eau", "Animal"],
                        additional: []
                      }
                    }
                  ] 
                } 
              }
            },
            "Moyen": { 
              timer: 240,
              categories: { 
                "Règne Animal": { 
                  questions: [
                    {
                      id: "default_medium_1",
                      text: "Créez un mammifère volant",
                      validAnswers: ["Chauve-souris"],
                      points: 20,
                      initialElements: {
                        validationMode: "any",
                        required: ["Animal", "Air"],
                        additional: ["Aile"]
                      }
                    }
                  ] 
                } 
              }
            },
            "Difficile": { 
              timer: 180,
              categories: { 
                "Règne Animal": { 
                  questions: [
                    {
                      id: "default_hard_1",
                      text: "Créez un animal marin intelligent",
                      validAnswers: ["Dauphin", "Baleine", "Pieuvre"],
                      points: 30,
                      initialElements: {
                        validationMode: "any",
                        required: ["Eau", "Animal", "Intelligence"],
                        additional: []
                      }
                    }
                  ] 
                } 
              }
            }
          }
        };
        
        return this.questionsData;
      }
    },
    async selectLevel(level) {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        // Nettoyer les données avant de changer de niveau
        this.cleanupQuestionData();
        
        // Attendre que les données soient chargées avant de continuer
        if (!this.questionsData || !this.questionsData.levels) {
          console.log("Chargement des questions avant sélection du niveau");
          await this.loadQuestionsData();
        }
        
        // Vérifier que les données sont maintenant disponibles
        if (!this.questionsData || !this.questionsData.levels || !this.questionsData.levels[level]) {
          console.error(`Données de niveau ${level} non disponibles:`, this.questionsData);
          throw new Error(`Données de niveau ${level} non disponibles`);
        }

        this.selectedLevel = level;
        this.selectedCategory = null;
        
        // Charger la progression ici après avoir sélectionné le niveau
        if (this.isLoggedIn) {
          await this.loadProgress();
        }
        
        this.$emit('level-selected', {
          level,
          timer: this.questionsData.levels[level].timer
        });

        await this.$nextTick();
      } catch (error) {
        console.error("Erreur lors de la sélection du niveau:", error);
        notificationService.error("Erreur lors du chargement des données. Veuillez réessayer.");
      } finally {
        this.isLoading = false;
      }
    },
    async selectCategory(category) {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        // Nettoyer les données avant de changer de catégorie
        this.cleanupQuestionData();
        
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
      
      // S'assurer que la structure est correctement initialisée
      if (!this.completedQuestions[this.selectedLevel]) {
        this.completedQuestions[this.selectedLevel] = {};
      }
      if (!this.completedQuestions[this.selectedLevel][this.selectedCategory]) {
        this.completedQuestions[this.selectedLevel][this.selectedCategory] = [];
      }
      
      const existingQuestions = this.completedQuestions[this.selectedLevel][this.selectedCategory];
      
      // Vérifier si la question n'est pas déjà dans la liste
      this.isNewQuestion = !existingQuestions.includes(questionId);
      
      if (this.isNewQuestion) {
        existingQuestions.push(questionId);
        
        // Vérifier si toutes les questions sont complétées
        const totalQuestions = this.questionsData.levels[this.selectedLevel].categories[this.selectedCategory].questions.length;
        
        // Si toutes les questions sont complétées, ajouter la catégorie à unlockedCategories
        if (existingQuestions.length >= totalQuestions) {
          if (!this.timerProgress) {
            this.timerProgress = {
              completedQuestions: this.completedQuestions,
              unlockedCategories: {
                Facile: [],
                Moyen: [],
                Difficile: []
              },
              bestScores: {
                Facile: 0,
                Moyen: 0,
                Difficile: 0
              }
            };
          }
          
          // S'assurer que la structure des catégories débloquées existe
          if (!this.timerProgress.unlockedCategories) {
            this.timerProgress.unlockedCategories = {};
          }
          
          if (!this.timerProgress.unlockedCategories[this.selectedLevel]) {
            this.timerProgress.unlockedCategories[this.selectedLevel] = [];
          }
          
          // Ajouter la catégorie aux catégories débloquées si elle n'y est pas déjà
          if (!this.timerProgress.unlockedCategories[this.selectedLevel].includes(this.selectedCategory)) {
            this.timerProgress.unlockedCategories[this.selectedLevel].push(this.selectedCategory);
            
            // Appeler directement le service gameService pour s'assurer que la catégorie est débloquée
            if (this.isLoggedIn) {
              gameService.updateTimerProgress(this.timerProgress)
                .catch(error => {
                  console.error("Erreur lors de la mise à jour des catégories débloquées:", error);
                });
            }
          }
        }
        
        // Sauvegarder la progression générale
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
      
      // Vérifier si la question existe et imprimer sa structure
      if (this.currentQuestion) {
        console.log("Structure de la question actuelle:", JSON.stringify(this.currentQuestion));
        
        // Initialiser les tableaux d'éléments
        let requiredElements = [];
        let additionalElements = [];
        
        // Corriger l'accès aux éléments requis et additionnels en tenant compte de la structure imbriquée
        if (this.currentQuestion.initialElements) {
          // Vérifier si la structure est double (initialElements.initialElements)
          if (this.currentQuestion.initialElements.initialElements) {
            requiredElements = this.currentQuestion.initialElements.initialElements.required || [];
            additionalElements = this.currentQuestion.initialElements.initialElements.additional || [];
          } else {
            // Structure simple
            requiredElements = this.currentQuestion.initialElements.required || [];
            additionalElements = this.currentQuestion.initialElements.additional || [];
          }
        }
        
        // Combiner et dédupliquer
        const startingElements = [...new Set([...requiredElements, ...additionalElements])];
        
        console.log("Éléments requis:", requiredElements);
        console.log("Éléments additionnels:", additionalElements);
        console.log("Éléments de la question définis:", startingElements);
        
        this.$emit('set-initial-inventory', startingElements);
        
        await this.$nextTick();
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    },
    debugQuestionData() {
      console.log("--------- DEBUGGING QUESTION DATA ---------");
      console.log("Question actuelle:", this.currentQuestion);
      
      if (this.currentQuestion && this.currentQuestion.initialElements) {
        console.log("initialElements (type):", typeof this.currentQuestion.initialElements);
        console.log("initialElements (contenu):", this.currentQuestion.initialElements);
        
        if (typeof this.currentQuestion.initialElements === 'string') {
          try {
            const parsed = JSON.parse(this.currentQuestion.initialElements);
            console.log("initialElements (parsé):", parsed);
          } catch (e) {
            console.error("Erreur de parsing:", e);
          }
        }
        
        // Tenter d'accéder aux propriétés required et additional
        const required = this.currentQuestion.initialElements.required || 
                         (typeof this.currentQuestion.initialElements === 'string' ? 
                          JSON.parse(this.currentQuestion.initialElements).required : []);
                          
        const additional = this.currentQuestion.initialElements.additional || 
                           (typeof this.currentQuestion.initialElements === 'string' ? 
                            JSON.parse(this.currentQuestion.initialElements).additional : []);
        
        console.log("Éléments requis:", required);
        console.log("Éléments additionnels:", additional);
      }
      
      console.log("----------------------------------------");
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
    setQuestions(questionsData) {
  console.log("TimerQuestions: setQuestions appelé", questionsData);
  if (questionsData && questionsData.levels) {
    this.questionsData = questionsData;
    return true;
  }
  return false;
},
    showTimeUp() {
      this.isTimeUp = true;
      this.isVisible = true;
    },
    async nextQuestion() {
      // Réinitialiser les éléments pour la nouvelle question
      this.cleanupQuestionData();
      
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        
        // Charger les recettes pour la nouvelle question
        this.loadRecipesFromQuestions();
        
        await new Promise(resolve => setTimeout(resolve, 100));
        await this.show();
        this.$emit('resume-timer');
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
    // Appelée par App après validation de la réponse (modes 'any', 'multiple' et 'all')
    async answerCorrect() {
      const currentQuestion = this.currentQuestion;
      const points = currentQuestion.points || 10;
      const questionId = currentQuestion.id || `${this.selectedCategory}_${this.currentQuestionIndex}`;

      this.markQuestionAsCompleted(questionId);
      if (this.isNewQuestion) {
        this.currentScore += points;
        this.$emit('coins-earned', points);
      }

      this.hide();
      // Mettre le chrono en pause pendant le popup de réussite
      this.$emit('pause-timer');
      this.showSuccessPopup = true;
      this.$emit('reset-craft-zone');
      // L'utilisateur devra cliquer lui-même sur "Continuer"
    },
    resetQuestions() {
      this.loadQuestionsAndReset();
      this.currentScore = 0;
      
      // Nettoyer les données
      this.cleanupTimerData();
    }
  }
}
</script>