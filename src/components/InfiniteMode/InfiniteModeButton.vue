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
import '@/assets/ComponentsStyle/InfiniteStyle/InfiniteModeButtonStyle.css';
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

</style>
