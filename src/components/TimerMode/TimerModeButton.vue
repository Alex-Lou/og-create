<template>
  <div class="sand">
    <!-- Pastille du sablier dans l'en-tête : temps restant + relecture de la question -->
    <div v-if="isTimerActive" :class="['sand__chip', 'g-bevel', { 'sand__chip--low': isLow }]">
      <svg class="sand__glass" width="14" height="22" viewBox="0 0 40 64" aria-hidden="true">
        <path d="M4 2h32M4 62h32M8 2c0 16 12 20 12 30S8 46 8 62M32 2c0 16-12 20-12 30s12 14 12 30" fill="none" stroke="currentColor" stroke-width="3" stroke-opacity=".8"></path>
        <path :d="sandTop" fill="var(--oc-gold)"></path>
        <path :d="sandBottom" fill="var(--oc-gold)" fill-opacity=".55"></path>
      </svg>
      <span class="sand__time" role="timer" aria-label="Temps restant">{{ formatTime(timeRemaining) }}</span>
      <button type="button" class="g-icon-btn sand__help" aria-label="Revoir la question" title="Revoir la question" @click="showCurrentQuestion">?</button>
    </div>

    <!-- Confirmation avant de quitter l'Épreuve -->
    <GModal
      v-if="showStopConfirmModal"
      eyebrow="L’Épreuve"
      title="Briser le sablier ?"
      :width="460"
      @close="cancelStopTimer"
    >
      <p class="sand__text">La question en cours ne sera pas gardée. Tes épreuves déjà réussies le restent.</p>
      <template #actions>
        <button type="button" class="g-btn g-btn--ghost" @click="cancelStopTimer">Continuer</button>
        <button type="button" class="g-btn g-btn--danger" @click="confirmStopTimer">Quitter</button>
      </template>
    </GModal>
  </div>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
  
export default {
  name: 'TimerModeButton',
  components: { GModal },
  data() {
    return {
      isTimerActive: false,
      timeRemaining: 5 * 60,
      timerInterval: null,
      showStopConfirmModal: false,
      selectedLevel: null,
      // Durée du sablier du niveau choisi (fixée par le serveur avec les questions)
      levelTime: 5 * 60
    };
  },
  computed: {
    // Part du temps restant (1 = sablier plein), pour le sable de la pastille
    sandRatio() {
      return Math.max(0, Math.min(1, this.timeRemaining / this.levelTime));
    },
    // Sable du haut : triangle qui se vide vers le col (y = 30)
    sandTop() {
      const y = 30 - 10 * this.sandRatio;
      const half = 1 + 5 * this.sandRatio;
      return `M${20 - half} ${y}L20 30L${20 + half} ${y}z`;
    },
    // Sable du bas : tas qui monte depuis la base (y = 60)
    sandBottom() {
      const y = 60 - 20 * (1 - this.sandRatio);
      return `M9 60L20 ${y}L31 60z`;
    },
    // Dernière demi-minute : le temps passe à l'encre d'alerte
    isLow() {
      return this.timeRemaining <= 30;
    }
  },
  watch: {
    isTimerActive: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$emit('timer-state-change', true);
          });
        }
      }
    }
  },
  methods: {
    pauseTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },
    showLevelSelection() {
      // Retour au choix du sablier sans quitter l'Épreuve
      this.isTimerActive = true;  
      this.selectedLevel = null;
      this.$emit('show-question');
    },
    resumeTimer() {
      if (this.isTimerActive && !this.timerInterval) {
        this.startTicking();
      }
    },
    // Un seul intervalle à la fois (évite un chrono qui accélère)
    startTicking() {
      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.timeRemaining > 0) {
          this.timeRemaining--;
        } else {
          this.stopTimer();
          this.$emit('timer-complete');
        }
      }, 1000);
    },
    confirmStopTimer() {
      this.stopTimer();
      this.showStopConfirmModal = false;
      this.$emit('force-stop');
      this.selectedLevel = null;
    },
    // Demande de quitter le Timer depuis l'extérieur (barre de modes) : confirmation d'abord
    requestStop() {
      if (this.isTimerActive) this.showStopConfirmModal = true;
    },
    cancelStopTimer() {
      this.showStopConfirmModal = false;
    },
    async handleLevelSelected({ level, timer }) {
      this.selectedLevel = level;
      this.levelTime = timer;
      this.timeRemaining = timer;
      await this.startTimerWithTime(timer);
    },
    async startTimerWithTime(time) {
      this.isTimerActive = true;
      this.timeRemaining = time;
      await this.$nextTick();
      this.$emit('timer-state-change', true);
      this.startTicking();
    },
    async startTimer() {
      this.isTimerActive = true;
      await this.$nextTick();
      this.$emit('timer-state-change', true);
    },
    stopTimer() {
      this.isTimerActive = false;
      clearInterval(this.timerInterval);
      this.timerInterval = null;
      this.$emit('timer-state-change', false);
      this.selectedLevel = null;
    },
    formatTime(seconds) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    // Joker : du sable en plus pour la question en cours
    addTime(seconds) {
      if (this.isTimerActive) this.timeRemaining += seconds;
    },
    resetTimer() {
      if (this.isTimerActive && this.selectedLevel) this.timeRemaining = this.levelTime;
    },
    async showCurrentQuestion() {
      await this.$nextTick();
      this.$emit('show-question');
    }
  },
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
};
</script>

<style scoped>
.sand {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Pastille compacte : tient dans une rangée d'en-tête (44 px) */
.sand__chip {
  --oc-bevel: 6px;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding-left: 12px;
  color: var(--oc-text);
  background: var(--oc-surface);
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
}
.sand__glass {
  flex-shrink: 0;
  color: var(--oc-text);
}
.sand__time {
  min-width: 4ch;
  font-family: var(--oc-font-mono);
  font-size: 14px;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  color: var(--oc-text-strong);
}
.sand__chip--low .sand__time { color: var(--oc-danger); }

/* Le « ? » partage la bordure de la pastille */
.sand__help {
  box-shadow: inset 1px 0 0 var(--oc-line-strong);
  clip-path: none;
  font-family: var(--oc-font-display);
  font-size: 19px;
  color: var(--oc-gold);
}

.sand__text {
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: var(--oc-text);
}

@media (max-width: 859px) {
  .sand__chip { gap: 6px; padding-left: 10px; }
  .sand__time { font-size: 13px; }
}
</style>
