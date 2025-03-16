<template>
  <div>
    <button 
      class="infinite-mode-button" 
      @click="activateInfiniteMode"
    >
      <div class="infinite-button-aura"></div>
      
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
        <circle cx="40" cy="40" r="0.7" fill="#8a5cad" class="infinite-star-particle star1" />
        <circle cx="260" cy="30" r="0.7" fill="#8a5cad" class="infinite-star-particle star2" />
        <circle cx="60" cy="70" r="0.7" fill="#8a5cad" class="infinite-star-particle star3" />
        <circle cx="240" cy="60" r="0.7" fill="#8a5cad" class="infinite-star-particle star4" />
        
        <!-- Effet de fumée subtile -->
        <rect x="20" y="70" width="260" height="15" rx="7" fill="url(#infiniteSmkGradient)" opacity="0.3" class="infinite-smoke-effect" />
        
        <!-- Texte INFINITE avec effet de lueur -->
        <text 
          x="150" 
          y="58" 
          font-family="BenjaminFranklin, Arial" 
          font-size="30" 
          font-weight="bold" 
          text-anchor="middle"
          letter-spacing="6"
          class="infinite-text"
        >INFINITE</text>
        
        <!-- Définitions de dégradés et filtres -->
        <defs>
          <!-- Dégradé principal du bouton avec plus de profondeur -->
          <linearGradient id="infiniteBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2a1c38" />
            <stop offset="25%" stop-color="#1d1428" />
            <stop offset="50%" stop-color="#150f1f" />
            <stop offset="75%" stop-color="#1d1428" />
            <stop offset="100%" stop-color="#2a1c38" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure avec couleurs plus vives -->
          <linearGradient id="infiniteBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(178, 132, 213, 0.9)" />
            <stop offset="50%" stop-color="rgba(138, 92, 173, 0.6)" />
            <stop offset="100%" stop-color="rgba(178, 132, 213, 0.9)" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure intérieure -->
          <linearGradient id="infiniteInnerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0.1)" />
            <stop offset="50%" stop-color="rgba(158, 112, 193, 0.3)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0.1)" />
          </linearGradient>
          
          <!-- Dégradé pour l'effet de brillance -->
          <linearGradient id="infiniteShineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
          </linearGradient>
          
          <!-- Dégradé pour la ligne séparatrice -->
          <linearGradient id="infiniteSeparatorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(158, 112, 193, 0.5)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
          
          <!-- Filtre pour l'effet de lueur du texte amélioré -->
          <filter id="infiniteTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <!-- Dégradé pour l'effet de fumée plus visible -->
          <linearGradient id="infiniteSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(178, 132, 213, 0.1)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
          
          <!-- Dégradé pour l'effet de brume énergétique -->
          <radialGradient id="infiniteEnergyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stop-color="rgba(178, 132, 213, 0.15)" />
            <stop offset="70%" stop-color="rgba(138, 92, 173, 0.05)" />
            <stop offset="100%" stop-color="rgba(90, 60, 120, 0)" />
          </radialGradient>
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
