<template>
  <div class="timer-container">
    <button 
      class="timer-mode-button" 
      @click="handleTimerButtonClick"
      :class="{ 'active': isTimerActive }"
    >
      <div class="timer-button-aura"></div>
      
      <!-- Structure du cadre ornemental -->
      <div class="button-frame">
        <!-- Coins ornementaux -->
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
      
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100">
     
        <!-- Effet de particules/étoiles scintillantes -->
        <circle cx="40" cy="40" r="0.7" fill="#8a5cad" class="star-particle star1" />
        <circle cx="260" cy="30" r="0.7" fill="#8a5cad" class="star-particle star2" />
        <circle cx="60" cy="70" r="0.7" fill="#8a5cad" class="star-particle star3" />
        <circle cx="240" cy="60" r="0.7" fill="#8a5cad" class="star-particle star4" />
        <circle cx="150" cy="20" r="0.7" fill="#8a5cad" class="star-particle star5" />
        <circle cx="110" cy="40" r="0.7" fill="#8a5cad" class="star-particle star6" />
        <circle cx="190" cy="45" r="0.7" fill="#8a5cad" class="star-particle star7" />
        <circle cx="85" cy="25" r="0.7" fill="#8a5cad" class="star-particle star8" />
        <circle cx="220" cy="35" r="0.7" fill="#8a5cad" class="star-particle star9" />
        
        <!-- Effet de fumée subtile -->
        <rect x="20" y="70" width="260" height="15" rx="7" fill="url(#timerSmkGradient)" opacity="0.3" class="smoke-effect smoke1" />
        <rect x="20" y="65" width="260" height="12" rx="6" fill="url(#timerSmkGradient)" opacity="0.2" class="smoke-effect smoke2" />
        
        <!-- Lignes séparatrices -->
        <line x1="60" y1="50" x2="100" y2="50" stroke="url(#timerSeparatorGradient)" stroke-width="1" class="separator-line" />
        <line x1="200" y1="50" x2="240" y2="50" stroke="url(#timerSeparatorGradient)" stroke-width="1" class="separator-line" />
        
        <!-- Symboles mystiques dans les coins -->
        <text x="30" y="30" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol1">✧</text>
        <text x="270" y="30" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol2">✧</text>
        <text x="30" y="70" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol3">✧</text>
        <text x="270" y="70" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol4">✧</text>
        
        <!-- Texte TIMER avec effet de lueur -->
        <text 
          x="150" 
          y="58" 
          font-family="BenjaminFranklin, Arial" 
          font-size="30" 
          font-weight="bold" 
          text-anchor="middle"
          letter-spacing="6"
          class="timer-text"
        >TIMER</text>
        
        <!-- Définitions de dégradés et filtres -->
        <defs>
          <!-- Dégradé principal du bouton avec plus de profondeur -->
          <linearGradient id="timerBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2a1c38" />
            <stop offset="25%" stop-color="#1d1428" />
            <stop offset="50%" stop-color="#150f1f" />
            <stop offset="75%" stop-color="#1d1428" />
            <stop offset="100%" stop-color="#2a1c38" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure avec couleurs plus vives -->
          <linearGradient id="timerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(178, 132, 213, 0.9)" />
            <stop offset="50%" stop-color="rgba(138, 92, 173, 0.6)" />
            <stop offset="100%" stop-color="rgba(178, 132, 213, 0.9)" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure intérieure -->
          <linearGradient id="timerInnerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0.1)" />
            <stop offset="50%" stop-color="rgba(158, 112, 193, 0.3)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0.1)" />
          </linearGradient>
          
          <!-- Dégradé pour l'effet de brillance -->
          <linearGradient id="timerShineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
          </linearGradient>
          
          <!-- Dégradé pour la ligne séparatrice -->
          <linearGradient id="timerSeparatorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(158, 112, 193, 0.5)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
          
          <!-- Filtre pour l'effet de lueur du texte amélioré -->
          <filter id="timerTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <!-- Dégradé pour l'effet de fumée plus visible -->
          <linearGradient id="timerSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(178, 132, 213, 0.1)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
          
          <!-- Dégradé pour l'effet de brume énergétique -->
          <radialGradient id="timerEnergyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="rgba(178, 132, 213, 0.15)" />
            <stop offset="70%" stop-color="rgba(138, 92, 173, 0.05)" />
            <stop offset="100%" stop-color="rgba(90, 60, 120, 0)" />
          </radialGradient>
          
          <!-- Dégradé de bordure -->
          <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(178, 132, 213, 0.9)" />
            <stop offset="50%" stop-color="rgba(138, 92, 173, 0.6)" />
            <stop offset="100%" stop-color="rgba(178, 132, 213, 0.9)" />
          </linearGradient>
          
          <!-- Filtre pour le texte -->
          <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
      
      <!-- Conteneur d'étoiles scintillantes -->
      <div class="star-field">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
      </div>
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
    showLevelSelection() {
      // Assurez-vous que le timer est actif mais que le niveau n'est pas sélectionné
      this.isTimerActive = true;  
      this.selectedLevel = null;
      
      // Forcer l'affichage du menu de sélection
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