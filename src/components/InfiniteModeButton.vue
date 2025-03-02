<template>
  <div>
    <button 
      class="infinite-mode-button" 
      :style="{ '--content': 'Infinite' }"
      @click="activateInfiniteMode"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
        <!-- Fond du bouton -->
        <rect x="50" y="50" width="300" height="100" rx="20" fill="#1a1d24" />
        
        <!-- Bordure lumineuse -->
        <rect x="55" y="55" width="290" height="90" rx="15" fill="none" stroke="#D8D8D8" stroke-width="2" class="glow-border"/>
        
        <!-- Texte INFINITE -->
        <text 
          x="200" 
          y="115" 
          font-family="BenjaminFranklin, Arial" 
          font-size="40" 
          font-weight="bold" 
          text-anchor="middle"
          letter-spacing="6"
          class="infinite-text"
        >INFINITE</text>
        
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

    <!-- Modal de confirmation d'arrêt du timer -->
    <div v-if="showStopConfirmModal" class="stop-timer-modal">
      <div class="stop-timer-modal-content">
        <p>La question en cours ne sera pas sauvegardée. Voulez-vous fermer ?</p>
        <div class="stop-timer-modal-buttons">
          <button @click="confirmInfiniteMode" class="stop-timer-confirm-btn">Oui</button>
          <button @click="cancelInfiniteMode" class="stop-timer-cancel-btn">Non</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfiniteModeButton',
  props: {
    isTimerActive: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showStopConfirmModal: false
    };
  },
  methods: {
    activateInfiniteMode() {
      if (this.isTimerActive) {
        this.showStopConfirmModal = true;
      } else {
        this.setInfiniteMode();
      }
    },
    confirmInfiniteMode() {
      this.$emit('force-stop');
      this.showStopConfirmModal = false;
      this.setInfiniteMode();
    },
    cancelInfiniteMode() {
      this.showStopConfirmModal = false;
    },
    setInfiniteMode() {
      localStorage.setItem('activateInfiniteMode', 'true');
      this.$emit('switch-to-infinite', { forceReload: true });
      setTimeout(() => {
        window.location.href = window.location.pathname + '?reload=' + new Date().getTime() + '&mode=infinite';
      }, 100);
    }
  },
  mounted() {
    if (localStorage.getItem('activateInfiniteMode') === 'true') {
      localStorage.removeItem('activateInfiniteMode');
      this.$nextTick(() => {
        this.$emit('switch-to-infinite', { forceReload: false });
        window.dispatchEvent(new CustomEvent('app-reloaded'));
      });
    }
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('mode') && urlParams.get('mode') === 'infinite') {
      this.$nextTick(() => {
        window.dispatchEvent(new CustomEvent('app-reloaded'));
      });
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

.infinite-mode-button {
  position: absolute;
  bottom: -15px;
  left: 775px;
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

.infinite-mode-button:focus,
.infinite-mode-button:active,
.infinite-mode-button:focus-visible {
  outline: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: none !important;
}

.infinite-mode-button:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(52, 52, 52, 0.808));
}

.infinite-mode-button:hover .glow-border {
  stroke-width: 3;
  stroke: #323439;
}

.infinite-mode-button:hover .glow-effect {
  opacity: 0.5;
}

/* Texte en état normal en gris foncé */
.infinite-text {
  fill: #d6ccbe;
}

.infinite-mode-button:hover .infinite-text {
  fill: #b8d4f5;
  transition: fill 0.3s ease;
}

.infinite-mode-button:active {
  transform: scale(0.95);
  filter: drop-shadow(0 0 4px rgb(69, 84, 102));
}

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
