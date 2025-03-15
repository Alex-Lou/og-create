<template>
  <div class="craft-button" @click="$emit('click')">
    <div class="craft-button-aura"></div>
    
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
      <!-- Fond du bouton avec dégradé plus intense -->
      <rect x="50" y="50" width="300" height="100" rx="18" fill="url(#craftBtnGradient)" />
      
      <!-- Bordure extérieure avec lueur améliorée -->
      <rect x="54" y="54" width="292" height="92" rx="16" fill="none" stroke="url(#craftBrdGradient)" stroke-width="2" class="craft-glow-border" />
      
      <!-- Couche de brillance subtile -->
      <rect x="54" y="54" width="292" height="46" rx="16" fill="url(#craftShineGradient)" opacity="0.08" class="craft-inner-shine" />
      
      <!-- Bordure intérieure avec pulsation -->
      <rect x="60" y="60" width="280" height="80" rx="12" fill="none" stroke="url(#craftInnerBrdGradient)" stroke-width="1" class="craft-inner-border" />
      
      <!-- Effet de brume énergétique -->
      <rect x="75" y="70" width="250" height="60" rx="12" fill="url(#craftEnergyGradient)" opacity="0.15" class="craft-energy-mist" />
      
      <!-- Effet de particules/étoiles scintillantes -->
      <circle cx="80" cy="90" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star1" />
      <circle cx="320" cy="70" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star2" />
      <circle cx="100" cy="130" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star3" />
      <circle cx="300" cy="120" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star4" />
      <circle cx="200" cy="60" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star5" />
      <circle cx="150" cy="80" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star6" />
      <circle cx="250" cy="95" r="0.7" fill="#8a5cad" class="craft-star-particle craft-star7" />
      
      <!-- Effet de fumée subtile -->
      <rect x="60" y="130" width="280" height="15" rx="7" fill="url(#craftSmkGradient)" opacity="0.3" class="craft-smoke-effect" />
      
      <!-- Texte CRAFT avec effet de lueur -->
      <text 
        x="200" 
        y="112" 
        font-family="BenjaminFranklin, Arial" 
        font-size="40" 
        font-weight="bold" 
        text-anchor="middle"
        letter-spacing="6"
        class="craft-text"
      >CRAFT</text>
      
      <!-- Définitions de dégradés et filtres -->
      <defs>
        <!-- Dégradé principal du bouton avec plus de profondeur -->
        <linearGradient id="craftBtnGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a1c38" />
          <stop offset="25%" stop-color="#1d1428" />
          <stop offset="50%" stop-color="#150f1f" />
          <stop offset="75%" stop-color="#1d1428" />
          <stop offset="100%" stop-color="#2a1c38" />
        </linearGradient>
        
        <!-- Dégradé pour la bordure avec couleurs plus vives -->
        <linearGradient id="craftBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(178, 132, 213, 0.9)" />
          <stop offset="50%" stop-color="rgba(138, 92, 173, 0.6)" />
          <stop offset="100%" stop-color="rgba(178, 132, 213, 0.9)" />
        </linearGradient>
        
        <!-- Dégradé pour la bordure intérieure -->
        <linearGradient id="craftInnerBrdGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="rgba(138, 92, 173, 0.1)" />
          <stop offset="50%" stop-color="rgba(158, 112, 193, 0.3)" />
          <stop offset="100%" stop-color="rgba(138, 92, 173, 0.1)" />
        </linearGradient>
        
        <!-- Dégradé pour l'effet de brillance -->
        <linearGradient id="craftShineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="rgba(255, 255, 255, 0.2)" />
          <stop offset="100%" stop-color="rgba(255, 255, 255, 0)" />
        </linearGradient>
        
        <!-- Dégradé pour la ligne séparatrice -->
        <linearGradient id="craftSeparatorGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
          <stop offset="50%" stop-color="rgba(158, 112, 193, 0.5)" />
          <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
        </linearGradient>
        
        <!-- Filtre pour l'effet de lueur du texte amélioré -->
        <filter id="craftTxtGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <!-- Dégradé pour l'effet de fumée plus visible -->
        <linearGradient id="craftSmkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(138, 92, 173, 0)" />
          <stop offset="50%" stop-color="rgba(178, 132, 213, 0.1)" />
          <stop offset="100%" stop-color="rgba(138, 92, 173, 0)" />
        </linearGradient>
        
        <!-- Dégradé pour l'effet de brume énergétique -->
        <radialGradient id="craftEnergyGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
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
  </div>
</template>

<script>
export default {
  name: 'CraftButton'
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

.craft-button {
  cursor: pointer;
  width: 170px;
  margin-top: -75px;
  margin-left: -10px;
  background: none;
  border: none !important;
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 8px rgba(25, 16, 36, 0.6));
  outline: 0 !important;
  box-shadow: none !important;
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  position: fixed;
  border-radius: 18px;
}

/* Cadre ornemental AJUSTÉ */
.button-frame {
  position: absolute;
  /* Ajuster les dimensions pour un cadre plus proche du bouton */
  top: 12px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 40px);
  pointer-events: none;
  z-index: 5;
  border: 1px solid rgba(138, 92, 173, 0.3);
  border-radius: 18px;
  box-shadow: 
    inset 0 0 15px rgba(0, 0, 0, 0.5),
    0 0 8px rgba(138, 92, 173, 0.2);
}

/* Coins ornementaux ajustés */
.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  pointer-events: none;
  z-index: 6;
}

.corner-tl {
  top: 0;
  left: 0;
  border-top: 2px solid rgba(138, 92, 173, 0.7);
  border-left: 2px solid rgba(138, 92, 173, 0.7);
  border-top-left-radius: 18px;
}

.corner-tr {
  top: 0;
  right: 0;
  border-top: 2px solid rgba(138, 92, 173, 0.7);
  border-right: 2px solid rgba(138, 92, 173, 0.7);
  border-top-right-radius: 18px;
}

.corner-bl {
  bottom: 0;
  left: 0;
  border-bottom: 2px solid rgba(138, 92, 173, 0.7);
  border-left: 2px solid rgba(138, 92, 173, 0.7);
  border-bottom-left-radius: 18px;
}

.corner-br {
  bottom: 0;
  right: 0;
  border-bottom: 2px solid rgba(138, 92, 173, 0.7);
  border-right: 2px solid rgba(138, 92, 173, 0.7);
  border-bottom-right-radius: 18px;
}

.corner-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(138, 92, 173, 0.9);
  border-radius: 50%;
  filter: drop-shadow(0 0 3px rgba(138, 92, 173, 0.8));
}

/* Ajustement des positions des dots */
.corner-tl .corner-dot { top: 6px; left: 6px; }
.corner-tr .corner-dot { top: 6px; right: 6px; }
.corner-bl .corner-dot { bottom: 6px; left: 6px; }
.corner-br .corner-dot { bottom: 6px; right: 6px; }

.frame-symbol {
  position: absolute;
  font-size: 8px;
  color: rgba(138, 92, 173, 0.6);
  filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.4));
}

/* Ajustement des positions des symboles */
.symbol-tl { top: 3px; left: 12px; }
.symbol-tr { top: 3px; right: 12px; }
.symbol-bl { bottom: 3px; left: 12px; }
.symbol-br { bottom: 3px; right: 12px; }



/* Ajustement du SVG pour le centrer au sein du cadre */
.craft-button svg {
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
  background: #8a5cad;
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
  background: #8a5cad;
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
  background: #8a5cad;
}

.star-field .star:nth-child(6) {
  top: 15%;
  left: 40%;
  animation-delay: 0.1s;
  background: #8a5cad;
}

.star-field .star:nth-child(7) {
  top: 50%;
  left: 10%;
  animation-delay: 0.4s;
  background: #8a5cad;
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

.title-separator {
  display: none;
}

.craft-button-aura {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 100px;
  border-radius: 18px;
  background: radial-gradient(circle, rgba(138, 92, 173, 0.08) 0%, rgba(138, 92, 173, 0) 70%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.5s ease;
  animation: craftAuraPulse 3s infinite ease-in-out;
}

@keyframes craftAuraPulse {
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

.craft-button:hover .craft-button-aura {
  opacity: 1;
}

.craft-button:focus,
.craft-button:active,
.craft-button:focus-visible {
  outline: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: none !important;
}

.craft-button:hover {
  transform: translateY(-3px) scale(1.05);
  filter: drop-shadow(0 0 15px rgba(138, 92, 173, 0.5));
}

.craft-glow-border {
  transition: all 0.3s ease;
  animation: craftBorderPulse 4s infinite ease-in-out;
}

@keyframes craftBorderPulse {
  0% {
    stroke-width: 2;
    filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.3));
  }
  50% {
    stroke-width: 2.5;
    filter: drop-shadow(0 0 4px rgba(138, 92, 173, 0.5));
  }
  100% {
    stroke-width: 2;
    filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.3));
  }
}

.craft-button:hover .craft-glow-border {
  stroke-width: 3;
  stroke: url(#craftBrdGradient);
  filter: drop-shadow(0 0 5px rgba(158, 112, 193, 0.7));
  animation: none;
}

.craft-inner-border {
  transition: all 0.3s ease;
  animation: craftInnerBorderPulse 3s infinite ease-in-out;
}

@keyframes craftInnerBorderPulse {
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

.craft-button:hover .craft-inner-border {
  opacity: 1;
  stroke-width: 1.5;
}

.craft-inner-shine {
  transition: all 0.3s ease;
}

.craft-button:hover .craft-inner-shine {
  opacity: 0.15;
}

.craft-star-particle {
  opacity: 0;
  animation: craftTwinkle 3s infinite ease-in-out;
  filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.7));
}

.craft-star1 { animation-delay: 0.1s; }
.craft-star2 { animation-delay: 0.7s; }
.craft-star3 { animation-delay: 1.3s; }
.craft-star4 { animation-delay: 1.9s; }
.craft-star5 { animation-delay: 2.5s; }
.craft-star6 { animation-delay: 0.4s; }
.craft-star7 { animation-delay: 1.7s; }

@keyframes craftTwinkle {
  0% {
    opacity: 0.1;
    r: 0.5;
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.5));
  }
  50% {
    opacity: 0.9;
    r: 1.5;
    filter: drop-shadow(0 0 3px rgba(178, 132, 213, 0.8));
  }
  100% {
    opacity: 0.1;
    r: 0.5;
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.5));
  }
}

.craft-button:hover .craft-star-particle {
  animation-duration: 2s;
}

.craft-energy-mist {
  animation: craftEnergyPulse 8s infinite alternate ease-in-out;
}

@keyframes craftEnergyPulse {
  0% {
    opacity: 0.1;
    transform: scale(0.95) translateY(2px);
  }
  100% {
    opacity: 0.25;
    transform: scale(1.05) translateY(-2px);
  }
}

.craft-button:hover .craft-energy-mist {
  opacity: 0.35;
  animation-duration: 4s;
}

.craft-smoke-effect {
  animation: craftSmokeMove 8s infinite linear;
  transform-origin: center;
}

@keyframes craftSmokeMove {
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

.craft-button:hover .craft-smoke-effect {
  animation-duration: 5s;
  opacity: 0.5;
}

.craft-text {
  fill: #f1e7ff !important;
  filter: url(#craftTxtGlow);
  transition: all 0.3s ease;
  text-shadow: 0 0 8px rgba(138, 92, 173, 0.4);
  animation: craftTextPulse 4s infinite alternate ease-in-out;
}

@keyframes craftTextPulse {
  0% {
    fill-opacity: 0.9;
    text-shadow: 0 0 5px rgba(138, 92, 173, 0.3);
  }
  100% {
    fill-opacity: 1;
    text-shadow: 0 0 8px rgba(138, 92, 173, 0.5);
  }
}

.craft-button:hover .craft-text {
  fill: #ffffff !important;
  filter: drop-shadow(0 0 8px rgba(178, 132, 213, 0.9));
  text-shadow: 0 0 12px rgba(178, 132, 213, 0.7);
  animation: none;
}

.craft-button:active {
  transform: scale(0.96);
  filter: drop-shadow(0 0 3px rgba(138, 92, 173, 0.4));
}

.craft-button:active .craft-text {
  fill: #d8c7ff !important;
}
</style>