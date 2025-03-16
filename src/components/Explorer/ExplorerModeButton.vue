<template>
  <div>
    <button 
      class="explorer-mode-button" 
      @click="activateExplorerMode"
    >
      <div class="explorer-button-aura"></div>
      
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
        
        <!-- Effet de fumée subtile -->
        <rect x="20" y="70" width="260" height="15" rx="7" fill="url(#explorerSmkGradient)" opacity="0.3" class="smoke-effect smoke1" />
        <rect x="20" y="65" width="260" height="12" rx="6" fill="url(#explorerSmkGradient)" opacity="0.2" class="smoke-effect smoke2" />
        
        <!-- Lignes séparatrices -->
        <line x1="60" y1="50" x2="100" y2="50" stroke="url(#explorerSeparatorGradient)" stroke-width="1" class="separator-line" />
        <line x1="200" y1="50" x2="240" y2="50" stroke="url(#explorerSeparatorGradient)" stroke-width="1" class="separator-line" />
        
        <!-- Symboles mystiques dans les coins -->
        <text x="30" y="30" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol1">✧</text>
        <text x="270" y="30" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol2">✧</text>
        <text x="30" y="70" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol3">✧</text>
        <text x="270" y="70" font-size="10" fill="rgba(138, 92, 173, 0.5)" class="mystic-symbol symbol4">✧</text>
        
        <!-- Texte EXPLORER avec effet de lueur -->
        <text 
          x="150" 
          y="58" 
          font-family="BenjaminFranklin, Arial" 
          font-size="30" 
          font-weight="bold" 
          text-anchor="middle"
          letter-spacing="6"
          class="explorer-text"
        >EXPLORER</text>
        
        <!-- Définitions de dégradés et filtres -->
        <defs>
          <!-- Dégradé principal du bouton avec plus de profondeur -->
          <linearGradient id="explorerBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2a1c38" />
            <stop offset="25%" stop-color="#1d1428" />
            <stop offset="50%" stop-color="#150f1f" />
            <stop offset="75%" stop-color="#1d1428" />
            <stop offset="100%" stop-color="#2a1c38" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure avec couleurs plus vives -->
          <linearGradient id="explorerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(178, 132, 213, 0.9)" />
            <stop offset="50%" stop-color="rgba(138, 92, 173, 0.6)" />
            <stop offset="100%" stop-color="rgba(178, 132, 213, 0.9)" />
          </linearGradient>
          
          <!-- Dégradé pour la bordure intérieure -->
          <linearGradient id="explorerInnerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0.1)" />
            <stop offset="50%" stop-color="rgba(158, 112, 193, 0.3)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0.1)" />
          </linearGradient>
          
          <!-- Dégradé pour l'effet de brillance -->
          <linearGradient id="explorerShineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
            <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
          </linearGradient>
          
          <!-- Dégradé pour la ligne séparatrice -->
          <linearGradient id="explorerSeparatorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(158, 112, 193, 0.5)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
          
          <!-- Filtre pour l'effet de lueur du texte amélioré -->
          <filter id="explorerTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <!-- Dégradé pour l'effet de fumée plus visible -->
          <linearGradient id="explorerSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
            <stop offset="50%" stop-color="rgba(178, 132, 213, 0.1)" />
            <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
          </linearGradient>
          
          <!-- Dégradé pour l'effet de brume énergétique -->
          <radialGradient id="explorerEnergyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
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
  </div>
</template>

<script>
import '@/assets/ComponentsStyle/ExplorerStyle/ExplorerModeButtonStyle.css';
export default {
  name: 'ExplorerModeButton',
  methods: {
    activateExplorerMode() {
      this.$emit('click');
    }
  }
};
</script>