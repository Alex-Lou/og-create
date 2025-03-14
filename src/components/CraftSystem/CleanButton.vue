<template>
  <button 
    class="reset-crafting-button" 
    style="--content: 'Clean';"
    @click="resetCraftingBoard"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
      <!-- Fond du bouton avec dégradé -->
      <rect x="50" y="50" width="300" height="100" rx="15" fill="url(#cleanBtnGradient)" />
      
      <!-- Bordure extérieure avec lueur -->
      <rect x="54" y="54" width="292" height="92" rx="12" fill="none" stroke="url(#cleanBrdGradient)" stroke-width="2" class="clean-glow-border" />
      
      <!-- Coins ornementaux -->
      <!-- Coin supérieur gauche -->
      <path d="M65,54 L54,54 L54,65" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="clean-corner-decoration" />
      <!-- Coin supérieur droit -->
      <path d="M335,54 L346,54 L346,65" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="clean-corner-decoration" />
      <!-- Coin inférieur gauche -->
      <path d="M65,146 L54,146 L54,135" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="clean-corner-decoration" />
      <!-- Coin inférieur droit -->
      <path d="M335,146 L346,146 L346,135" fill="none" stroke="rgba(138, 92, 173, 0.8)" stroke-width="2.5" class="clean-corner-decoration" />
      
      <!-- Points lumineux aux coins -->
      <circle cx="54" cy="54" r="2" fill="rgba(138, 92, 173, 0.9)" class="clean-corner-dot" />
      <circle cx="346" cy="54" r="2" fill="rgba(138, 92, 173, 0.9)" class="clean-corner-dot" />
      <circle cx="54" cy="146" r="2" fill="rgba(138, 92, 173, 0.9)" class="clean-corner-dot" />
      <circle cx="346" cy="146" r="2" fill="rgba(138, 92, 173, 0.9)" class="clean-corner-dot" />
      
      <!-- Texte CLEAN avec effet de lueur -->
      <text 
        x="200" 
        y="112" 
        font-family="BenjaminFranklin, Arial" 
        font-size="40" 
        font-weight="bold" 
        text-anchor="middle"
        letter-spacing="6"
        class="clean-text"
      >CLEAN</text>
      
      <!-- Effet de particules/étoiles scintillantes -->
      <circle cx="80" cy="90" r="0.7" fill="#8a5cad" class="clean-star-particle clean-star1" />
      <circle cx="320" cy="70" r="0.7" fill="#8a5cad" class="clean-star-particle clean-star2" />
      <circle cx="100" cy="130" r="0.7" fill="#8a5cad" class="clean-star-particle clean-star3" />
      <circle cx="300" cy="120" r="0.7" fill="#8a5cad" class="clean-star-particle clean-star4" />
      <circle cx="200" cy="60" r="0.7" fill="#8a5cad" class="clean-star-particle clean-star5" />
      
      <!-- Effet de fumée subtile -->
      <rect x="60" y="130" width="280" height="15" fill="url(#cleanSmkGradient)" opacity="0.2" class="clean-smoke-effect" />
      
      <!-- Définitions de dégradés et filtres -->
      <defs>
        <!-- Dégradé principal du bouton -->
        <linearGradient id="cleanBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1826" />
          <stop offset="50%" stop-color="#171420" />
          <stop offset="100%" stop-color="#1c152a" />
        </linearGradient>
        
        <!-- Dégradé pour la bordure -->
        <linearGradient id="cleanBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(158, 112, 193, 0.8)" />
          <stop offset="50%" stop-color="rgba(138, 92, 173, 0.5)" />
          <stop offset="100%" stop-color="rgba(158, 112, 193, 0.8)" />
        </linearGradient>
        
        <!-- Filtre pour l'effet de lueur du texte -->
        <filter id="cleanTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <!-- Dégradé pour l'effet de fumée -->
        <linearGradient id="cleanSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
          <stop offset="50%" stop-color="rgba(158, 112, 193, 0.07)" />
          <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
        </linearGradient>
      </defs>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'CleanButton',
  methods: {
    resetCraftingBoard() {
      this.$emit('click');
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'BenjaminFranklin';
  src: url('@/assets/fonts/BenjaminFranklin.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.reset-crafting-button {
  position: absolute;
  bottom: -20px;
  left: 865px;
  background: none;
  border: none !important;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 170px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 5px rgba(25, 16, 36, 0.5));
  outline: 0 !important;
  box-shadow: none !important;
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.reset-crafting-button:focus,
.reset-crafting-button:active,
.reset-crafting-button:focus-visible {
  outline: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: none !important;
}

.reset-crafting-button:hover {
  transform: translateY(-2px) scale(1.03);
  filter: drop-shadow(0 0 10px rgba(138, 92, 173, 0.4));
}

.clean-glow-border {
  transition: all 0.3s ease;
}

.reset-crafting-button:hover .clean-glow-border {
  stroke-width: 2.5;
  stroke: url(#cleanBrdGradient);
  filter: drop-shadow(0 0 3px rgba(138, 92, 173, 0.5));
}

/* Coins ornementaux animation avec effet plus prononcé */
.clean-corner-decoration {
  transition: all 0.3s ease;
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
}

.reset-crafting-button:hover .clean-corner-decoration {
  stroke: rgba(158, 112, 193, 1);
  stroke-width: 3;
  stroke-dashoffset: 0;
}

/* Points lumineux aux coins avec plus d'éclat */
.clean-corner-dot {
  filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.7));
  transition: all 0.4s ease;
}

.reset-crafting-button:hover .clean-corner-dot {
  r: 2.8;
  filter: drop-shadow(0 0 6px rgba(158, 112, 193, 1));
}

/* Animation des particules étoiles plus dynamiques */
.clean-star-particle {
  opacity: 0;
  animation: cleanTwinkle 3s infinite ease-in-out;
}

.clean-star1 { animation-delay: 0.1s; }
.clean-star2 { animation-delay: 0.7s; }
.clean-star3 { animation-delay: 1.3s; }
.clean-star4 { animation-delay: 1.9s; }
.clean-star5 { animation-delay: 2.5s; }

@keyframes cleanTwinkle {
  0% {
    opacity: 0.1;
    r: 0.5;
  }
  50% {
    opacity: 0.8;
    r: 1.2;
  }
  100% {
    opacity: 0.1;
    r: 0.5;
  }
}

/* Effet de fumée animation plus prononcée */
.clean-smoke-effect {
  animation: cleanSmokeMove 8s infinite linear;
  transform-origin: center;
}

@keyframes cleanSmokeMove {
  0% {
    opacity: 0.1;
    transform: translateX(-15px);
  }
  50% {
    opacity: 0.25;
    transform: translateX(15px);
  }
  100% {
    opacity: 0.1;
    transform: translateX(-15px);
  }
}

/* Texte avec effet de lueur amélioré */
.clean-text {
  fill: #dea17e;
  filter: url(#cleanTxtGlow);
  transition: all 0.3s ease;
  text-shadow: 0 0 5px rgba(138, 92, 173, 0.3);
}

.reset-crafting-button:hover .clean-text {
  fill: #f4d2af;
  filter: drop-shadow(0 0 5px rgba(158, 112, 193, 0.8));
}

.reset-crafting-button:active {
  transform: scale(0.97);
  filter: drop-shadow(0 0 3px rgba(138, 92, 173, 0.4));
}

/* Masquer le contenu défini via --content */
.reset-crafting-button::before {
  content: var(--content);
  display: none;
}

*:focus {
  outline: none !important;
  box-shadow: none !important;
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
}
</style>