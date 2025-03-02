<template>
    <div class="timer-container">
      <button 
        class="timer-mode-button" 
        :style="{ '--content': 'Timer' }"
        @click="handleTimerButtonClick"
        :class="{ 'active': isTimerActive }"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
          <!-- Fond du bouton -->
          <rect x="50" y="50" width="300" height="100" rx="20" fill="#1a1d24" />
          
          <!-- Bordure lumineuse -->
          <rect x="55" y="55" width="290" height="90" rx="15" fill="none" stroke="#D8D8D8" stroke-width="2" class="glow-border"/>
          
          <!-- Texte TIMER -->
          <text 
            x="200" 
            y="115" 
            font-family="BenjaminFranklin, Arial" 
            font-size="40" 
            font-weight="bold" 
            text-anchor="middle"
            letter-spacing="6"
            class="timer-text"
          >TIMER</text>
          
          <!-- Effet de lueur -->
          <rect x="50" y="50" width="300" height="100" rx="20" fill="url(#glow)" opacity="0.3" class="glow-effect"/>
          
          <!-- Définition du dégradé pour la lueur -->
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="80%" stop-color="#304968" stop-opacity="0"/>
              <stop offset="100%" stop-color="#304968" stop-opacity="0.5"/>
            </radialGradient>
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
  import '@/assets/TimerModeButtonStyle.css';
  
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
  
  <style scoped>
  @font-face {
    font-family: 'BenjaminFranklin';
    src: url('@/assets/BenjaminFranklin.ttf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  
  /* Les styles appliqués ici reprennent l'apparence (couleurs, transitions, effets de hover, etc.)
     de InfiniteModeButton, sans modifier la position initiale propre au TimerModeButton */
  .timer-mode-button {
    /* La position initiale n'est pas modifiée ici pour conserver celle définie dans le fichier CSS d'origine */
    background: none;
    border: none !important;
    cursor: pointer;
    padding: 0;
    margin: 0;
    width: 150px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 2px rgba(52, 62, 72, 0.838));
    outline: 0 !important;
    box-shadow: none !important;
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
    user-select: none;  
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  .timer-mode-button:focus,
  .timer-mode-button:active,
  .timer-mode-button:focus-visible {
    outline: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: none !important;
  }
  
  .timer-mode-button:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 12px rgba(52, 52, 52, 0.808));
  }
  
  .timer-mode-button:hover .glow-border {
    stroke-width: 3;
    stroke: #323439;
  }
  
  .timer-mode-button:hover .glow-effect {
    opacity: 0.5;
  }
  
  /* Texte TIMER en état normal en gris foncé similaire à InfiniteModeButton */
  .timer-text {
    fill: #d6ccbe;
  }
  
  .timer-mode-button:hover .timer-text {
    fill: #b8d4f5;
    transition: fill 0.3s ease;
  }
  
  .timer-mode-button:active {
    transform: scale(0.95);
    filter: drop-shadow(0 0 4px rgb(69, 84, 102));
  }
  
  /* Styles du modal identiques */
  .stop-timer-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }
  
  .stop-timer-modal-content {
    background-color: #1a1d24;
    padding: 2rem;
    border-radius: 15px;
    border: 2px solid #304968;
    text-align: center;
    color: #2D96A4;
    max-width: 400px;
    width: 90%;
  }
  
  .stop-timer-modal-buttons {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }
  
  .stop-timer-confirm-btn, 
  .stop-timer-cancel-btn {
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
  
  .stop-timer-confirm-btn:hover, 
  .stop-timer-cancel-btn:hover {
    background-color: #1a7c8a;
    transform: scale(1.05);
  }
  
  .stop-timer-confirm-btn:active, 
  .stop-timer-cancel-btn:active {
    transform: scale(0.95);
  }
  </style>
  