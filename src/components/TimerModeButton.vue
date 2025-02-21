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
  export default {
    name: 'TimerModeButton',
    data() {
        return {
            isTimerActive: false,
            timeRemaining: 5 * 60, // 5 minutes en secondes
            timerInterval: null,
            showStopConfirmModal: false
        }
    },
    methods: {
        handleTimerButtonClick() {
            if (!this.isTimerActive) {
                this.startTimer();
            } else {
                this.showStopConfirmModal = true;
            }
        },
        
        confirmStopTimer() {
            this.stopTimer();
            this.showStopConfirmModal = false;
            this.$emit('force-stop');
        },
        
        cancelStopTimer() {
            this.showStopConfirmModal = false;
        },
        
        toggleTimer() {
            if (!this.isTimerActive) {
                this.startTimer();
            } else {
                this.stopTimer();
            }
        },
        
        startTimer() {
            this.isTimerActive = true;
            this.timeRemaining = 5 * 60;
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
        
        stopTimer() {
            this.isTimerActive = false;
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.$emit('timer-state-change', false);
        },
        
        formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        },
        
        resetTimer() {
            if (this.isTimerActive) {
                this.timeRemaining = 5 * 60; // Reset à 5 minutes
            }
        },
        
        showCurrentQuestion() {
            // Émet un événement pour afficher la question actuelle
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
  
  
  <style scoped>
  @font-face {
    font-family: 'BenjaminFranklin';
    src: url('@/assets/BenjaminFranklin.ttf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  
  .timer-mode-button {
    position: absolute;
    bottom: -15px;
    left: 1020px;
    background: none;
    border: none !important;
    cursor: pointer;
    padding: 0;
    margin: 0;
    width: 150px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 2px rgba(48, 73, 104, 0.1));
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
    filter: drop-shadow(0 0 12px rgba(48, 73, 104, 0.7));
  }
  
  .timer-mode-button:hover .glow-border {
    stroke-width: 3;
    stroke: #5a7294;
  }
  
  .timer-mode-button:hover .glow-effect {
    opacity: 0.5;
  }
  
  .timer-mode-button:hover .timer-text {
    fill: #b8d4f5;
    transition: fill 0.3s ease;
  }
  
  .timer-mode-button:active {
    transform: scale(0.95);
    filter: drop-shadow(0 0 4px rgba(48, 73, 104, 0.3));
  }
  
  .timer-mode-button::before {
    content: var(--content);
    display: none;
  }
  
  .timer-text {
    transition: fill 0.3s ease;
  }
  
  .timer-display-group {
      position: absolute;
      display: flex;
      align-items: center;
      gap: 10px;
      top: 5px;
      left: 1180px;
  }
  
  .timer-display {
      background-color: #1a1d24;
      color: #2D96A4;
      padding: 5px 15px;
      border-radius: 15px;
      font-family: 'BenjaminFranklin', Arial;
      font-size: 24px;
      border: 2px solid #304968;
      box-shadow: 0 0 10px rgba(45, 150, 164, 0.3);
      z-index: 1000;
      min-width: 80px;
      text-align: center;
  }
  
  .help-button {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #2D96A4;
      border: 2px solid #304968;
      color: white;
      font-family: 'BenjaminFranklin', Arial;
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: all 0.3s ease;
      box-shadow: 0 0 10px rgba(45, 150, 164, 0.3);
  }
  
  .help-button:hover {
      background-color: #1a7c8a;
      transform: scale(1.1);
  }
  
  .help-button:active {
      transform: scale(0.95);
  }
  
  *:focus {
    outline: none !important;
    box-shadow: none !important;
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
  }
  
  /* Nouveaux styles pour le modal de confirmation */
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