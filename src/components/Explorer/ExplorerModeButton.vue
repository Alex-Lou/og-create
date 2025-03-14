<template>
  <button 
    class="explorer-mode-button" 
    :style="{ '--content': 'Explorer' }"
    @click="activateExplorerMode"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
      <!-- Fond du bouton avec dégradé -->
      <rect x="50" y="50" width="300" height="100" rx="15" fill="url(#expBtnGradient)" />
      
      <!-- Bordure extérieure avec lueur -->
      <rect x="54" y="54" width="292" height="92" rx="12" fill="none" stroke="url(#expBrdGradient)" stroke-width="2" class="glow-border" />
      
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
      
      <!-- Texte EXPLORER avec effet de lueur -->
      <text 
        x="200" 
        y="112" 
        font-family="BenjaminFranklin, Arial" 
        font-size="36" 
        font-weight="bold" 
        text-anchor="middle"
        letter-spacing="6"
        class="explorer-text"
      >EXPLORER</text>
      
      <!-- Effet de particules/étoiles scintillantes -->
      <circle cx="80" cy="90" r="0.7" fill="#8a5cad" class="star-particle star1" />
      <circle cx="320" cy="70" r="0.7" fill="#8a5cad" class="star-particle star2" />
      <circle cx="100" cy="130" r="0.7" fill="#8a5cad" class="star-particle star3" />
      <circle cx="300" cy="120" r="0.7" fill="#8a5cad" class="star-particle star4" />
      <circle cx="200" cy="60" r="0.7" fill="#8a5cad" class="star-particle star5" />
      
      <!-- Effet de fumée subtile -->
      <rect x="60" y="130" width="280" height="15" fill="url(#expSmkGradient)" opacity="0.2" class="smoke-effect" />
      
      <!-- Définitions de dégradés et filtres -->
      <defs>
        <!-- Dégradé principal du bouton -->
        <linearGradient id="expBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1a1524" />
          <stop offset="50%" stop-color="#171420" />
          <stop offset="100%" stop-color="#15121d" />
        </linearGradient>
        
        <!-- Dégradé pour la bordure -->
        <linearGradient id="expBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(138, 92, 173, 0.8)" />
          <stop offset="50%" stop-color="rgba(138, 92, 173, 0.5)" />
          <stop offset="100%" stop-color="rgba(138, 92, 173, 0.8)" />
        </linearGradient>
        
        <!-- Filtre pour l'effet de lueur du texte -->
        <filter id="expTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <!-- Dégradé pour l'effet de fumée -->
        <linearGradient id="expSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
          <stop offset="50%" stop-color="rgba(138, 92, 173, 0.05)" />
          <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
        </linearGradient>
      </defs>
    </svg>
  </button>
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