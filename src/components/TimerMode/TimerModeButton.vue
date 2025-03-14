<template>
  <div class="timer-container">
    <button 
      class="timer-mode-button" 
      :style="{ '--content': 'Timer' }"
      @click="handleTimerButtonClick"
      :class="{ 'active': isTimerActive }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
        <!-- Fond du bouton avec dégradé -->
        <rect x="50" y="50" width="300" height="100" rx="15" fill="url(#timerBtnGradient)" />
        
        <!-- Bordure extérieure avec lueur -->
        <rect x="54" y="54" width="292" height="92" rx="12" fill="none" stroke="url(#timerBrdGradient)" stroke-width="2" class="glow-border" />
        
        <!-- Coins ornementaux -->
        <!-- Coin supérieur gauche -->
        <path d="M65,54 L54,54 L54,65" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="corner-decoration" />
        <!-- Coin supérieur droit -->
        <path d="M335,54 L346,54 L346,65" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="corner-decoration" />
        <!-- Coin inférieur gauche -->
        <path d="M65,146 L54,146 L54,135" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="corner-decoration" />
        <!-- Coin inférieur droit -->
        <path d="M335,146 L346,146 L346,135" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="corner-decoration" />
        
        <!-- Points lumineux aux coins -->
        <circle cx="54" cy="54" r="2" fill="rgba(138, 92, 173, 0.9)" class="corner-dot" />
        <circle cx="346" cy="54" r="2" fill="rgba(138, 92, 173, 0.9)" class="corner-dot" />
        <circle cx="54" cy="146" r="2" fill="rgba(138, 92, 173, 0.9)" class="corner-dot" />
        <circle cx="346" cy="146" r="2" fill="rgba(138, 92, 173, 0.9)" class="corner-dot" />
        
        <!-- Texte TIMER avec effet de lueur -->
        <text 
          x="200" 
          y="112" 
          font-family="BenjaminFranklin, Arial" 
          font-size="36" 
          font-weight="bold" 
          text-anchor="middle"
          letter-spacing="6"
          class="timer-text"
        >TIMER</text>
        
        <!-- Effet de particules/étoiles scintillantes -->
        <circle cx="80" cy="90" r="0.7" fill="#8a5cad" class="star-particle star1" />
        <circle cx="320" cy="70" r="0.7" fill="#8a5cad" class="star-particle star2" />
        <circle cx="100" cy="130" r="0.7" fill="#8a5cad" class="star-particle star3" />
        <circle cx="300" cy="120" r="0.7" fill="#8a5cad" class="star-particle star4" />
        <circle cx="200" cy="60" r="0.7" fill="#8a5cad" class="star-particle star5" />
        
        <!-- Effet de fumée subtile -->
        <rect x="60" y="130" width="280" height="15" fill="url(#timerSmkGradient)" opacity="0.2" class="smoke-effect" />
        
        <!-- Définitions de dégradés et filtres -->
        <defs>
          <!-- Dégradé principal du bouton -->
          <linearGradient id="timerBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1a1524" />
            <stop offset="50%" stop-color="#171420" />
            <stop offset="100%" stop-color="#15121d" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure -->
          <linearGradient id="timerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0.8)" />
            <stop offset="50%" stop-color="rgba(138, 92, 173, 0.5)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0.8)" />
          </linearGradient>
          
          <!-- Filtre pour l'effet de lueur du texte -->
          <filter id="timerTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <!-- Dégradé pour l'effet de fumée -->
          <linearGradient id="timerSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(138, 92, 173, 0.05)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
        </defs>
      </svg>
    </button>
    
    <!-- Timer display avec bouton d'aide -->
    <div v-if="isTimerActive" class="timer-display-group">
      <div class="timer-display">
        {{ formatTime(timeRemaining) }}
      </div>
      <button class="help-button" @click="showCurrentQuestion">?</button>
    </div>
  
    <!-- Modal de confirmation d'arrêt du timer -->
    <div v-if="showStopConfirmModal" class="stop-timer-modal">
      <div class="stop-timer-modal-content">
        <p>La question en cours ne sera pas sauvegardée. Voulez-vous fermer ?</p>
        <div class="stop-timer-modal-buttons">
          <button @click="confirmStopTimer" class="stop-timer-confirm-btn">Oui</button>
          <button @click="cancelStopTimer" class="stop-timer-cancel-btn">Non</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import '@/assets/ComponentsStyle/TimerStyle/TimerModeButtonStyle.css';
  
  export default {
    name: 'TimerModeButton',
    data() {
      return {
        isTimerActive: false,
        timeRemaining: 5 * 60,
        timerInterval: null,
        showStopConfirmModal: false,
        selectedLevel: null,
        defaultTimers: {
          'Facile': 300,    // 5 minutes
          'Moyen': 240,     // 4 minutes
          'Difficile': 180  // 3 minutes
        }
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
      async handleTimerButtonClick() {
        if (!this.isTimerActive || !this.selectedLevel) {
          await this.startTimer();
        } else {
          this.showStopConfirmModal = true;
        }
      },
      pauseTimer() {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
      },
      resumeTimer() {
        if (this.isTimerActive && !this.timerInterval) {
          this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
              this.timeRemaining--;
            } else {
              this.stopTimer();
              this.$emit('timer-complete');
            }
          }, 1000);
        }
      },
      confirmStopTimer() {
        this.stopTimer();
        this.showStopConfirmModal = false;
        this.$emit('force-stop');
        this.selectedLevel = null;
      },
      cancelStopTimer() {
        this.showStopConfirmModal = false;
      },
      async handleLevelSelected({ level, timer }) {
        this.selectedLevel = level;
        this.timeRemaining = timer;
        await this.startTimerWithTime(timer);
      },
      async startTimerWithTime(time) {
        this.isTimerActive = true;
        this.timeRemaining = time;
        await this.$nextTick();
        this.$emit('timer-state-change', true);
        this.timerInterval = setInterval(() => {
          if (this.timeRemaining > 0) {
            this.timeRemaining--;
          } else {
            this.stopTimer();
            this.$emit('timer-complete');
          }
        }, 1000);
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
      resetTimer() {
        if (this.isTimerActive && this.selectedLevel) {
          this.timeRemaining = this.defaultTimers[this.selectedLevel];
        }
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