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
                <rect x="55" y="55" width="290" height="90" rx="15" fill="none" stroke="#304968" stroke-width="2" class="glow-border"/>
                
                <!-- Texte TIMER avec la nouvelle police -->
                <text 
                    x="200" 
                    y="115" 
                    font-family="BenjaminFranklin, Arial" 
                    font-size="40" 
                    font-weight="bold" 
                    fill="#2D96A4" 
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
                // Si le timer n'est pas actif OU qu'aucun niveau n'est sélectionné,
                // on montre le modal de sélection
                await this.startTimer();
            } else {
                // Sinon, on montre le modal de confirmation d'arrêt
                this.showStopConfirmModal = true;
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
  }
  </script>