<template>
  <button 
    class="reset-crafting-button" 
    style="--content: 'Clean';"
    @click="resetCraftingBoard"
  >
    <div class="clean-button-aura"></div>
    
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
    
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">

      <!-- Bordure extérieure avec lueur améliorée -->
      <rect x="54" y="54" width="292" height="92" rx="16" fill="none" stroke="url(#craftBrdGradient)" stroke-width="2" class="craft-glow-border" />
            

      <!-- Couche de brillance subtile -->
      <rect x="54" y="54" width="292" height="46" rx="27" fill="url(#cleanShineGradient)" opacity="0.08" class="clean-inner-shine" />
      
      <!-- Bordure intérieure avec pulsation -->
      <rect x="60" y="60" width="280" height="80" rx="24" fill="none" stroke="url(#cleanInnerBrdGradient)" stroke-width="1" class="clean-inner-border" />
      

      <!-- Effet de particules/étoiles scintillantes -->
      <circle cx="80" cy="90" r="0.7" fill="#dea17e" class="clean-star-particle clean-star1" />
      <circle cx="320" cy="70" r="0.7" fill="#dea17e" class="clean-star-particle clean-star2" />
      <circle cx="100" cy="130" r="0.7" fill="#dea17e" class="clean-star-particle clean-star3" />

      
      <!-- Effet de fumée subtile -->
      <rect x="60" y="130" width="280" height="15" rx="7" fill="url(#cleanSmkGradient)" opacity="0.3" class="clean-smoke-effect" />
      
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
      
      <!-- Définitions de dégradés et filtres -->
      <defs>
        <!-- Dégradé principal du bouton avec plus de profondeur -->
        <linearGradient id="cleanBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2d1d18" />
          <stop offset="25%" stop-color="#221512" />
          <stop offset="50%" stop-color="#1a110e" />
          <stop offset="75%" stop-color="#221512" />
        </linearGradient>
        
        <!-- Dégradé pour la bordure avec couleurs plus vives -->
        <linearGradient id="cleanBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(222, 161, 126, 0.9)" />
          <stop offset="50%" stop-color="rgba(138, 92, 173, 0.6)" />
        </linearGradient>
        
        <!-- Dégradé pour la bordure intérieure -->
        <linearGradient id="cleanInnerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(222, 161, 126, 0.2)" />
          <stop offset="50%" stop-color="rgba(202, 141, 106, 0.4)" />
          <stop offset="100%" stop-color="rgba(222, 161, 126, 0.2)" />
        </linearGradient>

        
        <!-- Filtre pour l'effet de lueur du texte amélioré -->
        <filter id="cleanTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
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
  src: url('~@/assets/fonts/BenjaminFranklin.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'White Storm';
  src: url('~@/assets/fonts/White Storm.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.reset-crafting-button {
  position: fixed;  /* Gardez cette ligne */
  bottom: -10px;
  left: 1300px;
  background: none;
  border: none !important;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 170px;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 8px rgba(222, 161, 126, 0.3));
  outline: 0 !important;
  box-shadow: none !important;
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

/* Cadre ornemental AJUSTÉ */
.button-frame {
  position: absolute;
  top: 13px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 40px);
  pointer-events: none;
  z-index: 5;
  border: 1px solid rgba(222, 161, 126, 0.3);
  border-radius: 30px;
  box-shadow: 
    inset 0 0 15px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(222, 161, 126, 0.2);
}

/* Coins ornementaux ajustés */
.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  pointer-events: none;
  z-index: 6;
}

.corner-tl {
  top: 0;
  left: 0;
  border-top: 2px solid rgba(222, 161, 126, 0.7);
  border-left: 2px solid rgba(222, 161, 126, 0.7);
  border-top-left-radius: 30px;
  width: 18px;
  height: 18px;
}

.corner-tr {
  top: 0;
  right: 0;
  border-top: 2px solid rgba(222, 161, 126, 0.7);
  border-right: 2px solid rgba(222, 161, 126, 0.7);
  border-top-right-radius: 30px;
  width: 18px;
  height: 18px;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid rgba(222, 161, 126, 0.7);
  border-left: 2px solid rgba(222, 161, 126, 0.7);
  border-bottom-left-radius: 30px;
  width: 18px;
  height: 18px;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid rgba(222, 161, 126, 0.7);
  border-right: 2px solid rgba(222, 161, 126, 0.7);
  border-bottom-right-radius: 30px;
  width: 18px;
  height: 18px;
}

.corner-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(222, 161, 126, 0.9);
  border-radius: 50%;
  filter: drop-shadow(0 0 3px rgba(222, 161, 126, 0.8));
}

/* Ajustement des positions des dots */
.corner-tl .corner-dot { top: 5px; left: 5px; }
.corner-tr .corner-dot { top: 5px; right: 5px; }
.corner-bl .corner-dot { bottom: 5px; left: 5px; }
.corner-br .corner-dot { bottom: 5px; right: 5px; }

.frame-symbol {
  position: absolute;
  font-size: 8px;
  color: rgba(222, 161, 126, 0.6);
  filter: drop-shadow(0 0 2px rgba(222, 161, 126, 0.4));
}

/* Ajustement des positions des symboles */
.symbol-tl { top: 2px; left: 10px; }
.symbol-tr { top: 2px; right: 10px; }
.symbol-bl { bottom: 2px; left: 10px; }
.symbol-br { bottom: 2px; right: 10px; }



/* Ajustement du SVG pour le centrer au sein du cadre */
.reset-crafting-button svg {
  transform: scale(0.95);
  margin-top: -10px;
}

/* Conteneur d'étoiles scintillantes */
.star-field {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

.title-separator {
  display: none;
}

/* Style pour les étoiles */
.star-field .star {
  position: absolute;
  width: .7px;
  height:.7px;
  border-radius: 50%;
  opacity: 0;
  animation: twinkle 3s infinite ease-in-out;
  box-shadow: 0 0 4px 1px currentColor;
}

/* Positionnement des étoiles */
.star-field .star:nth-child(1) {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
  background: #dea17e;
}

.star-field .star:nth-child(2) {
  top: 30%;
  left: 50%;
  animation-delay: 0.3s;
  background: #2E2C43;
}

.star-field .star:nth-child(3) {
  top: 70%;
  left: 30%;
  animation-delay: 0.6s;
  background: #dea17e;
}

.star-field .star:nth-child(4) {
  top: 20%;
  left: 80%;
  animation-delay: 0.9s;
  background: #603639;
}

.star-field .star:nth-child(5) {
  top: 80%;
  left: 60%;
  animation-delay: 1.2s;
  background: #dea17e;
}

.star-field .star:nth-child(6) {
  top: 15%;
  left: 40%;
  animation-delay: 0.1s;
  background: #583436;
}

.star-field .star:nth-child(7) {
  top: 50%;
  left: 10%;
  animation-delay: 0.4s;
  background: #dea17e;
}

.star-field .star:nth-child(8) {
  top: 60%;
  left: 70%;
  animation-delay: 0.7s;
  background: #2E2C43;
}

@keyframes twinkle {
  0% {
    opacity: 0.3;
    transform: scale(.5);
  }
  50% {
    opacity: 1;
    transform: scale(.7);
  }
  100% {
    opacity: 0.3;
    transform: scale(.5);
  }
}

.clean-button-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 100px;
  border-radius: 30px;
  background: radial-gradient(circle, rgba(222, 161, 126, 0.08) 0%, rgba(138, 92, 173, 0) 70%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
  animation: cleanAuraPulse 3s infinite ease-in-out;
}

@keyframes cleanAuraPulse {
  0% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.05);
  }
  100% {
    opacity: 0.1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.reset-crafting-button:hover .clean-button-aura {
  opacity: 1;
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
  transform: translateY(-3px) scale(1.05);
  filter: drop-shadow(0 0 15px rgba(222, 161, 126, 0.6));
}

.clean-glow-border {
  transition: all 0.3s ease;
  animation: cleanBorderPulse 4s infinite ease-in-out;
  filter: drop-shadow(0 0 3px rgba(222, 161, 126, 0.4));
}

@keyframes cleanBorderPulse {
  0% {
    stroke-width: 2;
    filter: drop-shadow(0 0 2px rgba(222, 161, 126, 0.3));
  }
  50% {
    stroke-width: 2.5;
    filter: drop-shadow(0 0 4px rgba(222, 161, 126, 0.5));
  }
  100% {
    stroke-width: 2;
    filter: drop-shadow(0 0 2px rgba(222, 161, 126, 0.3));
  }
}

.reset-crafting-button:hover .clean-glow-border {
  stroke-width: 3;
  stroke: url(#cleanBrdGradient);
  filter: drop-shadow(0 0 6px rgba(222, 161, 126, 0.8));
  animation: none;
}

.clean-inner-border {
  transition: all 0.3s ease;
  animation: cleanInnerBorderPulse 3s infinite ease-in-out;
}

@keyframes cleanInnerBorderPulse {
  0% {
    opacity: 0.3;
    stroke-width: 1;
  }
  50% {
    opacity: 0.7;
    stroke-width: 1.2;
  }
  100% {
    opacity: 0.3;
    stroke-width: 1;
  }
}

.reset-crafting-button:hover .clean-inner-border {
  opacity: 1;
  stroke-width: 1.5;
}

.clean-inner-shine {
  transition: all 0.3s ease;
}

.reset-crafting-button:hover .clean-inner-shine {
  opacity: 0.15;
}

.clean-star-particle {
  opacity: 0;
  animation: cleanTwinkle 3s infinite ease-in-out;
  filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.7));
}

.clean-star1 { animation-delay: 0.1s; }
.clean-star2 { animation-delay: 0.7s; }
.clean-star3 { animation-delay: 1.3s; }
.clean-star4 { animation-delay: 1.9s; }
.clean-star5 { animation-delay: 2.5s; }
.clean-star6 { animation-delay: 0.4s; }
.clean-star7 { animation-delay: 1.7s; }

@keyframes cleanTwinkle {
  0% {
    opacity: 0.1;
    r: 0.5;
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.5));
  }
  50% {
    opacity: 0.9;
    r: 1.5;
    filter: drop-shadow(0 0 3px rgba(222, 161, 126, 0.8));
  }
  100% {
    opacity: 0.1;
    r: 0.5;
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.5));
  }
}

.reset-crafting-button:hover .clean-star-particle {
  animation-duration: 2s;
}

.clean-energy-mist {
  animation: cleanEnergyPulse 8s infinite alternate ease-in-out;
}

@keyframes cleanEnergyPulse {
  0% {
    opacity: 0.1;
    transform: scale(0.95) translateY(2px);
  }
  100% {
    opacity: 0.25;
    transform: scale(1.05) translateY(-2px);
  }
}

.reset-crafting-button:hover .clean-energy-mist {
  opacity: 0.35;
  animation-duration: 4s;
}

.clean-smoke-effect {
  animation: cleanSmokeMove 8s infinite linear;
  transform-origin: center;
}

@keyframes cleanSmokeMove {
  0% {
    opacity: 0.15;
    transform: translateX(-20px) scaleX(0.9);
  }
  50% {
    opacity: 0.35;
    transform: translateX(20px) scaleX(1.1);
  }
  100% {
    opacity: 0.15;
    transform: translateX(-20px) scaleX(0.9);
  }
}

.reset-crafting-button:hover .clean-smoke-effect {
  animation-duration: 5s;
  opacity: 0.5;
}

.clean-text {
  fill: #dea17e !important;
  filter: url(#cleanTxtGlow);
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(222, 161, 126, 0.4);
  animation: cleanTextPulse 4s infinite alternate ease-in-out;
}

@keyframes cleanTextPulse {
  0% {
    fill-opacity: 0.9;
    text-shadow: 0 0 5px rgba(222, 161, 126, 0.3);
  }
  100% {
    fill-opacity: 1;
    text-shadow: 0 0 8px rgba(222, 161, 126, 0.5);
  }
}

.reset-crafting-button:hover .clean-text {
  fill: #f4d2af !important;
  filter: drop-shadow(0 0 8px rgba(242, 181, 146, 0.9));
  text-shadow: 0 0 12px rgba(242, 181, 146, 0.7);
  animation: none;
}

.reset-crafting-button:active {
  transform: scale(0.96);
  filter: drop-shadow(0 0 3px rgba(222, 161, 126, 0.4));
}

.reset-crafting-button:active .clean-text {
  fill: #c98e6e !important;
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