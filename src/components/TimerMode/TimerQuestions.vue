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
            :class="['tq-choice', 'g-bevel', { 'tq-choice--done': isChapterDone(categoryName) }]"
            :disabled="isLoading"
            @click="selectCategory(categoryName)"
          >
            <span class="tq-choice__num">{{ roman(index + 1) }}</span>
            <span class="tq-choice__body">
              <span class="tq-choice__label">{{ categoryName }}</span>
              <span class="g-bar" aria-hidden="true"><span :style="{ width: `${Math.min(1, doneOf(categoryName) / totalOf(categoryName)) * 100}%` }"></span></span>
            </span>
            <span class="g-mono tq-choice__count">{{ doneOf(categoryName) }}/{{ totalOf(categoryName) }}</span>
          </button>
        </div>
        <p class="g-italic tq-hint">Achève chaque question d’un chapitre pour le sceller.</p>
      </GModal>

      <!-- Question en cours -->
      <GModal
        v-else
        key="question"
        :eyebrow="questionEyebrow"
        :title="currentQuestion.text"
        :width="500"
        @close="hide"
      >
        <div
          v-if="currentQuestion.initialElements?.validationMode === 'multiple' && currentQuestion.initialElements?.requiredCount"
          class="tq-row"
        >
          <span class="g-mono">Réponses trouvées</span>
          <span class="g-mono g-gold">{{ answersFound }} / {{ currentQuestion.initialElements.requiredCount }}</span>
        </div>
        <template #actions>
          <button type="button" class="g-btn" @click="hide">Compris</button>
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
      <!-- Ce qui a été créé, et avec quoi -->
      <div v-if="lastCreation" class="tq-creation">
        <span class="tq-creation__ink g-ink--glow" aria-hidden="true"><ElementGlyph :glyph="lastCreation.emoji || 'ui:spark'" /></span>
        <span class="tq-creation__name">{{ lastCreation.name }}</span>
        <span v-if="lastCreation.ingredients.length" class="tq-creation__from">
          <span class="g-mono">Créé avec</span>
          <span class="g-italic">{{ lastCreation.ingredients.join(' + ') }}</span>
        </span>
      </div>
      <svg v-else class="tq-seal" width="104" height="104" viewBox="0 0 120 120" aria-hidden="true">
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
          {{ nextChapter ? 'Quitter l’épreuve' : 'Choisir un sablier' }}
        </button>
        <button v-if="nextChapter" type="button" class="g-btn" @click="handleContinue">
          Chapitre suivant
        </button>
      </template>
    </GModal>
  </div>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import trialService from '@/services/trialService';
import notificationService from '@/services/notificationService';
import { sortFamilies } from '@/utils/eras';
import { roman } from '@/utils/roman';
import { LEVELS, doneCount, emptyProgress, isChapterDone, markDone } from '@/utils/trialProgress';

// L'Épreuve en trois étapes : durée du sablier (niveau), chapitre, puis questions tirées au hasard.
// Les réponses restent au serveur : App transmet son verdict par answerCorrect().
export default {
  name: 'TimerQuestions',
  components: { ElementGlyph, GModal },
  props: {
    isLoggedIn: { type: Boolean, default: false },
    // Bonnes réponses réunies, comptées par le serveur (les réponses ne sont pas envoyées au navigateur)
    answersFound: { type: Number, default: 0 }
  },
  emits: [
    'reset-timer', 'show-level-selection', 'pause-timer', 'resume-timer', 'stop-timer',
    'set-initial-inventory', 'reset-craft-zone', 'level-selected', 'coins-earned',
    'timer-progress-updated', 'question-changed'
  ],
  data() {
    return {
      currentQuestionIndex: 0,
      questions: [],
      isVisible: false,
      selectedLevel: null,
      selectedCategory: null,
      questionsData: null,
      showSuccessPopup: false,
      // Création qui a résolu la question : { name, emoji, ingredients }
      lastCreation: null,
      showCompletionPopup: false,
      completionMessage: '',
      completionSubMessage: '',
      isLoading: false,
      isNewQuestion: true,
      timerProgress: emptyProgress(),
      levels: LEVELS,
      // Sable dessiné dans le sablier de chaque niveau (plein, à mi-course, presque vide)
      levelSand: ['M13 22L20 30L27 22z', 'M15 30L20 24L25 30z', 'M15 38L20 30L25 38z']
    };
  },
  computed: {
    // Chapitres du niveau choisi, dans l'ordre du registre (les anciens chapitres hors famille à la fin)
    availableCategories() {
      const categories = this.questionsData?.levels?.[this.selectedLevel]?.categories;
      return categories ? sortFamilies(categories) : {};
    },
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || { text: '', initialElements: { validationMode: 'any', required: [], additional: [] } };
    },
    // Repère de la question : rang dans le chapitre et nom du chapitre
    questionEyebrow() {
      const rank = `Épreuve ${this.currentQuestionIndex + 1} / ${this.questions.length}`;
      return this.selectedCategory ? `${rank} · ${this.selectedCategory}` : rank;
    },
    nextChapter() {
      return Object.keys(this.availableCategories).find(chapter => !this.isChapterDone(chapter)) || null;
    }
  },
  watch: {
    // La consigne reste affichée hors de la fenêtre (TimerBrief, dans App)
    currentQuestion: {
      immediate: true,
      handler(question) {
        this.$emit('question-changed', question);
      }
    }
  },
  async created() {
    await this.loadQuestionsData();
    if (this.isLoggedIn) await this.loadProgress();
  },
  methods: {
    roman,
    totalOf(chapter) {
      return this.availableCategories[chapter]?.questions.length || 0;
    },
    doneOf(chapter) {
      return doneCount(this.timerProgress, this.selectedLevel, chapter, this.totalOf(chapter));
    },
    isChapterDone(chapter) {
      return isChapterDone(this.timerProgress, this.selectedLevel, chapter, this.totalOf(chapter));
    },
    // Durée du sablier et record du niveau, pour l'écran de choix
    levelDetails(level) {
      const seconds = this.questionsData?.levels?.[level]?.timer;
      const parts = [];
      if (seconds) parts.push(`${Math.round(seconds / 60)} minutes`);
      const best = this.timerProgress.bestScores?.[level];
      if (best) parts.push(`record ${best}`);
      return parts.join(' · ') || level;
    },
    async loadProgress() {
      this.timerProgress = await trialService.loadProgress();
    },
    async loadQuestionsData() {
      try {
        const data = await trialService.questions();
        if (data?.levels) this.questionsData = data;
      } catch {
        // Réessayé au choix du niveau
      }
      return this.questionsData;
    },
    async selectLevel(level) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.$emit('reset-craft-zone');
        if (!this.questionsData?.levels?.[level]) await this.loadQuestionsData();
        if (!this.questionsData?.levels?.[level]) throw new Error(`Niveau ${level} indisponible`);
        this.selectedLevel = level;
        this.selectedCategory = null;
        if (this.isLoggedIn) await this.loadProgress();
        this.$emit('level-selected', { level, timer: this.questionsData.levels[level].timer });
      } catch {
        notificationService.error('L’Épreuve ne répond pas pour l’instant. Réessaie dans un moment.');
      } finally {
        this.isLoading = false;
      }
    },
    async selectCategory(chapter) {
      if (this.isLoading) return;
      this.isLoading = true;
      try {
        this.startChapter(chapter);
        await this.show();
      } finally {
        this.isLoading = false;
      }
    },
    // Questions du chapitre dans un ordre tiré au hasard
    startChapter(chapter) {
      this.$emit('reset-craft-zone');
      this.selectedCategory = chapter;
      this.questions = [...this.availableCategories[chapter].questions];
      for (let i = this.questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.questions[i], this.questions[j]] = [this.questions[j], this.questions[i]];
      }
      this.currentQuestionIndex = 0;
    },
    async handleContinue() {
      this.showCompletionPopup = false;
      if (!this.nextChapter) return;
      this.startChapter(this.nextChapter);
      this.$emit('reset-timer');
      this.$emit('resume-timer');
      await this.show();
    },
    // Fin de chapitre : tout est achevé → retour au choix du sablier, sinon fin de l'Épreuve
    handleCompletionClose() {
      this.showCompletionPopup = false;
      this.$emit('reset-craft-zone');
      this.selectedCategory = null;
      this.currentQuestionIndex = 0;
      if (!this.nextChapter) {
        this.selectedLevel = null;
        this.$emit('show-level-selection');
      } else {
        this.$emit('stop-timer');
      }
    },
    async closeSuccessPopup() {
      this.showSuccessPopup = false;
      await this.nextQuestion();
    },
    cancelLevelSelection() {
      this.$emit('reset-craft-zone');
      this.hide();
      this.resetSelection();
      this.$emit('stop-timer');
    },
    cancelCategorySelection() {
      this.$emit('reset-craft-zone');
      this.resetSelection();
      this.$emit('stop-timer');
    },
    resetSelection() {
      this.currentQuestionIndex = 0;
      this.selectedLevel = null;
      this.selectedCategory = null;
      this.questions = [];
    },
    // Question réussie : enregistrée (compte), le chapitre scellé à la dernière
    async markQuestionAsCompleted(questionId) {
      const { progress, isNew } = markDone(this.timerProgress, this.selectedLevel, this.selectedCategory, questionId, this.totalOf(this.selectedCategory));
      this.isNewQuestion = isNew;
      if (!isNew) return;
      this.timerProgress = progress;
      try {
        const saved = await trialService.saveProgress({ completedQuestions: progress.completedQuestions, unlockedCategories: progress.unlockedCategories });
        if (saved) this.timerProgress = saved;
      } catch {
        // Gardée sur cet écran ; renvoyée avec la prochaine réussite
      }
      this.$emit('timer-progress-updated', this.timerProgress);
    },
    // Affiche la question en cours et pose ses éléments de départ (App les reçoit)
    async show() {
      this.isVisible = true;
      if (!this.selectedLevel || !this.selectedCategory) return;
      await this.$nextTick();
      const initial = this.currentQuestion.initialElements || {};
      const starting = [...new Set([...(initial.required || []), ...(initial.additional || [])])];
      this.$emit('set-initial-inventory', starting, this.currentQuestion.id);
    },
    hide() {
      this.isVisible = false;
    },
    getCurrentQuestion() {
      return this.currentQuestion;
    },
    async nextQuestion() {
      this.$emit('reset-craft-zone');
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        await this.show();
        this.$emit('resume-timer');
        return;
      }
      // Chapitre terminé : le sablier se met en pause
      this.completionMessage = `Tu as achevé le chapitre ${this.selectedCategory}.`;
      this.completionSubMessage = this.nextChapter ? `Chapitre suivant : ${this.nextChapter}` : 'Tous les chapitres sont achevés';
      this.showCompletionPopup = true;
      this.$emit('pause-timer');
    },
    // Appelée par App après le verdict du serveur (modes 'any', 'multiple' et 'all')
    async answerCorrect(creation = null) {
      this.lastCreation = creation ? { ...creation, ingredients: creation.ingredients || [] } : null;
      const question = this.currentQuestion;
      const points = question.points || 10;
      await this.markQuestionAsCompleted(question.id);
      if (this.isNewQuestion) this.$emit('coins-earned', { points, questionId: question.id });
      this.hide();
      // Le chrono reste en pause tant que la fenêtre de réussite est ouverte
      this.$emit('pause-timer');
      this.showSuccessPopup = true;
      this.$emit('reset-craft-zone');
    },
    resetQuestions() {
      this.resetSelection();
      // Les fenêtres sont téléportées dans body : le v-show du parent ne les masque plus
      this.isVisible = false;
      this.showSuccessPopup = false;
      this.showCompletionPopup = false;
    }
  }
};
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
.tq-creation { display: flex; flex-direction: column; align-items: center; gap: 6px; text-align: center; }
.tq-creation__ink { font-size: 72px; line-height: 1; animation: tq-rise 0.7s var(--oc-ease-spring) both; }
.tq-creation__name { font-family: var(--oc-font-display); font-size: 30px; line-height: 1.15; color: var(--oc-gold); }
.tq-creation__from { display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: 18px; color: var(--oc-text-strong); }
@keyframes tq-rise { from { opacity: 0; transform: translateY(8px) scale(0.85); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .tq-creation__ink { animation: none; } }
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
