// App : l'Épreuve. Le sablier (TimerModeButton) et les questions (TimerQuestions) passent par ici ; l'inventaire Infini
// est mis de côté le temps de l'Épreuve. Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App.

import playService from '@/services/playService';
import trialService from '@/services/trialService';
import { messageOf } from '@/utils/errors';
import { BASE_ELEMENTS } from '@/utils/gameConstants';
import { FREE_JOKERS, JOKER_TIME } from '@/utils/hints';
import { emptyProgress } from '@/utils/trialProgress';

export default {
  data() {
    return {
      // L'Épreuve : inventaire du défi, l'inventaire Infini étant mis de côté (null hors Épreuve)
      isTimerActive: false,
      timerSnapshot: null,
      selectedTimerLevel: null,
      timerModeDiscoveries: 0,
      showTimerEndModal: false,
      timerProgress: emptyProgress(),
      // Question affichée en consigne, jokers offerts restants
      timerQuestion: null,
      freeJokers: FREE_JOKERS,
      // Indice de joker affiché ({ kind, text }), jusqu'à la prochaine découverte
      timerHint: null,
      // Verdict du serveur sur le dernier mélange de l'Épreuve, et bonnes réponses réunies (« 2 / 3 »)
      timerVerdict: null,
      timerAnswersFound: 0,
      // Épreuve lancée côté serveur (les jokers offerts ne se donnent qu'au lancement)
      timerLaunched: false
    };
  },
  methods: {
    // ----- L'Épreuve : le sablier (TimerModeButton) et les questions (TimerQuestions) passent par ici -----
    handleTimerStateChange(isActive) {
      // Le sablier peut émettre plusieurs fois « actif » : on n'agit que sur les transitions
      const wasActive = this.isTimerActive;
      this.isTimerActive = isActive;
      if (isActive && !wasActive) {
        this.resetCraftBoard();
        this.enterTimerMode();
        this.timerModeDiscoveries = 0;
        this.selectedTimerLevel = null;
        this.$refs.timerQuestions?.show();
      } else if (!isActive) {
        this.resetCraftBoard();
        // selectedTimerLevel est conservé pour la fenêtre de fin (handleTimerComplete)
        this.exitTimerMode();
        this.$refs.timerQuestions?.resetQuestions();
      }
    },
    // Met de côté l'inventaire Infini au début de l'Épreuve
    enterTimerMode() {
      if (!this.timerSnapshot) this.timerSnapshot = [...this.discoveredElements];
    },
    // Restaure l'inventaire Infini à la fin de l'Épreuve
    exitTimerMode() {
      if (!this.timerSnapshot) return;
      this.discoveredElements = this.timerSnapshot;
      this.timerSnapshot = null;
    },
    showLevelSelection() {
      this.$refs.timerModeButton?.showLevelSelection();
    },
    showCurrentTimerQuestion() {
      this.$refs.timerQuestions?.show();
    },
    handleLevelSelected(levelData) {
      this.selectedTimerLevel = levelData.level;
      this.freeJokers = FREE_JOKERS;
      this.timerLaunched = false;
      this.$refs.timerModeButton?.handleLevelSelected(levelData);
    },
    handleTimerPause() {
      this.$refs.timerModeButton?.pauseTimer();
    },
    handleTimerResume() {
      this.$refs.timerModeButton?.resumeTimer();
    },
    handleTimerStop() {
      this.$refs.timerModeButton?.confirmStopTimer();
    },
    handleTimerReset() {
      this.$refs.timerModeButton?.resetTimer();
    },
    handleTimerForceStop() {
      this.isTimerActive = false;
      this.selectedTimerLevel = null;
      this.exitTimerMode();
      this.timerModeDiscoveries = 0;
      this.$refs.timerQuestions?.resetQuestions();
    },
    // Éléments de départ d'une question : le serveur les pose aussi en main (les mélanges y sont vérifiés)
    handleSetInitialInventory(elements, questionId) {
      if (!this.isTimerActive) return;
      this.startTimerRun(questionId);
      this.resetCraftBoard();
      this.discoveredElements = [...new Set([...BASE_ELEMENTS, ...(Array.isArray(elements) ? elements : [])])];
    },
    async startTimerRun(questionId) {
      if (!Number.isInteger(questionId)) return;
      try {
        const run = await playService.startRun('timer', { questionId, launch: !this.timerLaunched });
        this.timerLaunched = true;
        this.freeJokers = run.freeJokers;
        this.applyKnown(run.known);
      } catch (error) {
        this.showAlert(messageOf(error, 'L’épreuve n’a pas pu démarrer, réessaie.'));
      }
    },
    // Joker : le serveur compte les jokers offerts, débite les suivants et calcule l'indice
    async useJoker(kind) {
      try {
        const reply = await playService.joker(kind);
        this.freeJokers = reply.freeJokers;
        if (reply.coins !== undefined) this.handleCoinsUpdated(reply.coins);
        if (kind === 'time') this.$refs.timerModeButton?.addTime(JOKER_TIME);
        else if (kind === 'step') this.timerHint = { kind, text: `Essaie ${reply.ingredients.join(' + ')}.` };
        else this.timerHint = { kind, text: `Pense à ${reply.ingredient}…` };
      } catch (error) {
        this.showAlert(messageOf(error, 'Le joker n’a pas pu être utilisé.'));
      }
    },
    // Un compte est payé par le serveur au moment de la réussite (verdict) ; un invité garde un solde de session
    handleCoinsEarned({ points }) {
      if (!this.isLoggedIn) this.handleCoinsUpdated(this.coins + points);
    },
    // Fin du sablier : score compté par le serveur, qui verse le bonus si le record du niveau monte (compte)
    async handleTimerComplete() {
      let end = null;
      try {
        end = await playService.finishTimer();
      } catch (error) {
        console.error('Fin d’épreuve non enregistrée:', error);
      }
      const score = end ? end.score : this.timerModeDiscoveries;
      if (end?.coins !== undefined) this.handleCoinsUpdated(end.coins);
      const level = this.selectedTimerLevel;
      const best = this.timerProgress.bestScores?.[level] || 0;
      if (level && score > best) {
        // (un invité : son solde de session suit la règle du serveur, services/trial.js : l'écart avec l'ancien record)
        if (!this.isLoggedIn) this.handleCoinsUpdated(this.coins + (score - best) * 5);
        this.timerProgress = { ...this.timerProgress, bestScores: { ...this.timerProgress.bestScores, [level]: score } };
        trialService.saveProgress({ bestScores: { [level]: score } })
          .then(saved => { if (saved) this.timerProgress = saved; })
          .catch(error => console.error('Record non enregistré:', error));
      }
      this.exitTimerMode();
      this.showTimerEndModal = true;
    },
    // Questions et chapitres réussis (TimerQuestions) ; les records restent les meilleurs connus ici
    handleTimerProgress(progress) {
      const best = { ...this.timerProgress.bestScores };
      Object.entries(progress.bestScores || {}).forEach(([level, score]) => { best[level] = Math.max(best[level] || 0, score || 0); });
      this.timerProgress = { ...progress, bestScores: best };
    },
    handleTimerEndModalClose() {
      this.showTimerEndModal = false;
      this.exitTimerMode();
      this.selectedTimerLevel = null;
      this.$refs.timerQuestions?.resetQuestions();
    }
  }
};
