<template>
  <div>
    <template v-if="isVisible">
      <!-- Étape I : durée du sablier -->
      <GModal
        v-if="!selectedLevel"
        key="level"
        eyebrow="L’Épreuve · Étape I"
        title="Choisis la durée du sablier"
        @close="cancelLevelSelection"
      >
        <div class="tq-list">
          <button
            v-for="(level, index) in levels"
            :key="level"
            type="button"
            class="tq-choice g-bevel"
            :disabled="isLoading"
            @click="selectLevel(level)"
          >
            <svg class="tq-glass" width="30" height="48" viewBox="0 0 40 64" aria-hidden="true">
              <path d="M4 2h32M4 62h32M8 2c0 16 12 20 12 30S8 46 8 62M32 2c0 16-12 20-12 30s12 14 12 30" fill="none" stroke="currentColor" stroke-opacity=".8"></path>
              <path :d="levelSand[index]" fill="var(--oc-gold)" fill-opacity=".85"></path>
            </svg>
            <span class="tq-choice__body">
              <span class="tq-choice__name">{{ level }}</span>
              <span class="g-mono">{{ levelDetails(level) }}</span>
            </span>
          </button>
        </div>
      </GModal>

      <!-- Étape II : chapitre (catégorie) -->
      <GModal
        v-else-if="!selectedCategory"
        key="category"
        :eyebrow="`Étape II · ${selectedLevel}`"
        title="Choisis le chapitre"
        @close="cancelCategorySelection"
      >
        <div class="tq-list">
          <button
            v-for="(category, categoryName, index) in availableCategories"
            :key="categoryName"
            type="button"
            :class="['tq-choice', 'g-bevel', { 'tq-choice--done': isCategoryCompleted(categoryName) }]"
            :disabled="isLoading"
            @click="selectCategory(categoryName)"
          >
            <span class="tq-choice__num">{{ roman(index + 1) }}</span>
            <span class="tq-choice__body">
              <span class="tq-choice__label">{{ categoryName }}</span>
              <span class="g-bar" aria-hidden="true"><span :style="{ width: `${categoryRatio(categoryName) * 100}%` }"></span></span>
            </span>
            <span class="g-mono tq-choice__count">{{ getCompletedQuestionsCount(categoryName) }}</span>
          </button>
        </div>
        <p class="g-italic tq-hint">Achève chaque question d’un chapitre pour le sceller.</p>
      </GModal>

      <!-- Question en cours, ou sablier vide -->
      <GModal
        v-else
        key="question"
        :eyebrow="isTimeUp ? 'Le sablier est vide' : questionEyebrow"
        :title="isTimeUp ? 'Temps écoulé' : currentQuestion.text"
        :width="500"
        @close="handleButtonClick"
      >
        <div
          v-if="!isTimeUp && currentQuestion.initialElements?.validationMode === 'multiple' && currentQuestion.initialElements?.requiredCount"
          class="tq-row"
        >
          <span class="g-mono">Réponses trouvées</span>
          <span class="g-mono g-gold">{{ discoveredValidAnswersCount }} / {{ currentQuestion.initialElements.requiredCount }}</span>
        </div>
        <template #actions>
          <button type="button" class="g-btn" @click="handleButtonClick">
            {{ isTimeUp ? 'D’accord' : 'Compris' }}
          </button>
        </template>
      </GModal>
    </template>

    <!-- Réussite d'une question -->
    <GModal
      v-if="showSuccessPopup"
      title="Épreuve réussie"
      eyebrow="Le sablier est en pause"
      align="center"
      :width="460"
      @close="closeSuccessPopup"
    >
      <svg class="tq-seal" width="104" height="104" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" stroke-opacity=".5"></circle>
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-dasharray="2 5"></circle>
        <path d="M40 62l14 14 28-32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="square"></path>
      </svg>
      <hr class="g-rule tq-full" />
      <div class="tq-row tq-full">
        <span class="g-mono">Récompense</span>
        <span v-if="isNewQuestion" class="tq-reward">+{{ currentQuestion.points || 10 }} écus</span>
        <span v-else class="g-mono">Question déjà réussie</span>
      </div>
      <template #actions>
        <button type="button" class="g-btn" @click="closeSuccessPopup">Épreuve suivante</button>
      </template>
    </GModal>

    <!-- Chapitre achevé -->
    <GModal
      v-if="showCompletionPopup"
      title="Chapitre achevé"
      :eyebrow="selectedCategory || 'L’Épreuve'"
      align="center"
      :width="500"
      @close="handleCompletionClose"
    >
      <p class="g-italic tq-lead">{{ completionMessage }}</p>
      <hr class="g-rule tq-full" />
      <p class="g-mono">{{ completionSubMessage }}</p>
      <template #actions>
        <button type="button" class="g-btn g-btn--ghost" @click="handleCompletionClose">
          {{ getNextUncompletedCategory() ? 'Quitter l’épreuve' : 'Choisir un sablier' }}
        </button>
        <button v-if="getNextUncompletedCategory()" type="button" class="g-btn" @click="handleContinue">
          Chapitre suivant
        </button>
      </template>
    </GModal>
  </div>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';
import progressService from '@/services/progressService';
import gameService from '@/services/gameService';
import notificationService from '@/services/notificationService';
 
export default {
  name: 'TimerQuestions',
  components: { GModal },
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
      },
      levels: ['Facile', 'Moyen', 'Difficile'],
      // Sable dessiné dans le sablier de chaque niveau (plein, à mi-course, presque vide)
      levelSand: ['M13 22L20 30L27 22z', 'M15 30L20 24L25 30z', 'M15 38L20 30L25 38z']
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
    // Repère de la question : rang dans le chapitre et nom du chapitre
    questionEyebrow() {
      const rank = `Épreuve ${this.currentQuestionIndex + 1} / ${this.questions.length}`;
      return this.selectedCategory ? `${rank} · ${this.selectedCategory}` : rank;
    },
    remainingCategories() {
      return Object.keys(this.availableCategories).filter(cat => !this.isCategoryCompleted(cat));
    }
  },
  async created() {
    // Questions et recettes sont publiques ; la progression Timer n'existe que pour un compte
    await this.loadQuestionsData();
    await this.loadRecipes();
    if (this.isLoggedIn) await this.loadProgress();
  },
  methods: {
    // Durée du sablier et record du niveau, pour l'écran de choix
    levelDetails(level) {
      const seconds = this.questionsData?.levels?.[level]?.timer;
      const parts = [];
      if (seconds) parts.push(`${Math.round(seconds / 60)} minutes`);
      const best = this.timerProgress?.bestScores?.[level];
      if (best) parts.push(`record ${best}`);
      return parts.join(' · ') || level;
    },
    // Avancement d'un chapitre entre 0 et 1, lu depuis le compteur « x/y »
    categoryRatio(categoryName) {
      const [done, total] = this.getCompletedQuestionsCount(categoryName).split('/').map(Number);
      return total ? Math.min(1, done / total) : 0;
    },
    roman(n) {
      const map = [[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
      let out = '';
      for (const [value, sign] of map) {
        while (n >= value) {
          out += sign;
          n -= value;
        }
      }
      return out;
    },
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
        this.completionMessage = `Tu as achevé le chapitre ${this.selectedCategory}.`;
        
        const nextCategory = this.getNextUncompletedCategory();
        this.completionSubMessage = nextCategory 
          ? `Chapitre suivant : ${nextCategory}`
          : 'Tous les chapitres sont achevés';

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
      // Les fenêtres sont téléportées dans body : le v-show du parent ne les masque plus
      this.isVisible = false;
      this.showSuccessPopup = false;
      this.showCompletionPopup = false;
      this.currentScore = 0;
      
      // Nettoyer les données
      this.cleanupTimerData();
    }
  }
}
</script>

<style scoped>
.tq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Choix biseauté : niveau ou chapitre */
.tq-choice {
  appearance: none;
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  min-height: 64px;
  padding: 14px 18px;
  border: 0;
  cursor: pointer;
  text-align: left;
  color: var(--oc-text);
  background: transparent;
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
  transition: background var(--oc-fast), box-shadow var(--oc-fast);
}
.tq-choice:hover:not(:disabled),
.tq-choice:focus-visible {
  background: var(--oc-gold-soft);
  box-shadow: inset 0 0 0 1px var(--oc-accent-line);
}
.tq-choice:focus-visible { outline: none; }
.tq-choice:disabled { opacity: 0.5; cursor: progress; }

.tq-glass {
  flex-shrink: 0;
  color: var(--oc-text);
}
.tq-choice__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tq-choice__name {
  font-family: var(--oc-font-display);
  font-size: 24px;
  line-height: 1.1;
  color: var(--oc-text-strong);
}
.tq-choice__num {
  min-width: 26px;
  font-family: var(--oc-font-display);
  font-size: 16px;
  color: var(--oc-gold);
}
.tq-choice__label {
  font-size: 18px;
  line-height: 1.25;
  color: var(--oc-text-strong);
  overflow-wrap: anywhere;
}
.tq-choice__count { white-space: nowrap; }

/* Chapitre scellé : barre et compteur à l'or */
.tq-choice--done .g-bar > span { background: var(--oc-gold); }
.tq-choice--done .tq-choice__count { color: var(--oc-gold); }

.tq-hint {
  margin: 0;
  font-size: 16px;
  color: var(--oc-text-faint);
}

.tq-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}
.tq-full { align-self: stretch; }

.tq-seal { color: var(--oc-gold); }
.tq-reward {
  font-family: var(--oc-font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  color: var(--oc-gold);
}
.tq-lead {
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: var(--oc-text);
}

@media (max-width: 859px) {
  .tq-choice { gap: 12px; padding: 12px 14px; }
  .tq-choice__name { font-size: 21px; }
  .tq-choice__label { font-size: 17px; }
}
</style>
