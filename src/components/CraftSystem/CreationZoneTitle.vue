<template>
  <div class="creation-zone-title">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 150" 
      class="animated-title"
    >
      <defs>
        <!-- Dégradé principal pour le texte - tons violets moins intenses -->
        <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#8a5cad;stop-opacity:0.6" />
          <stop offset="50%" style="stop-color:#b8a5d0;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#8a5cad;stop-opacity:0.6" />
        </linearGradient>
        
        <!-- Dégradé pour le contour - plus subtil -->
        <linearGradient id="outlineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3B1C59;stop-opacity:0.5" />
          <stop offset="50%" style="stop-color:#8a5cad;stop-opacity:0.3" />
          <stop offset="100%" style="stop-color:#3B1C59;stop-opacity:0.5" />
        </linearGradient>
        
        <!-- Effet de lueur néon réduit -->
        <filter id="neonEffect">
          <feGaussianBlur class="blur" stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Dégradé pour le cadre décoratif -->
        <linearGradient id="frameBorderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:rgba(138, 92, 173, 0.6);stop-opacity:1" />
          <stop offset="50%" style="stop-color:rgba(138, 92, 173, 0.3);stop-opacity:1" />
          <stop offset="100%" style="stop-color:rgba(138, 92, 173, 0.6);stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Cadre décoratif avec coins ornementaux -->
      <rect 
        x="50" 
        y="25" 
        width="500" 
        height="100" 
        rx="15" 
        fill="none" 
        stroke="url(#frameBorderGradient)" 
        stroke-width="2"
        opacity="0.5"
        class="title-frame"
      />
      
      <!-- Coins ornementaux -->
      <path d="M65,25 L50,25 L50,40" fill="none" stroke="rgba(138, 92, 173, 0.6)" stroke-width="2.5" class="corner-decoration" />
      <path d="M535,25 L550,25 L550,40" fill="none" stroke="rgba(138, 92, 173, 0.6)" stroke-width="2.5" class="corner-decoration" />
      <path d="M65,125 L50,125 L50,110" fill="none" stroke="rgba(138, 92, 173, 0.6)" stroke-width="2.5" class="corner-decoration" />
      <path d="M535,125 L550,125 L550,110" fill="none" stroke="rgba(138, 92, 173, 0.6)" stroke-width="2.5" class="corner-decoration" />
      
      <!-- Points lumineux aux coins -->
      <circle cx="50" cy="25" r="2" fill="rgba(138, 92, 173, 0.7)" class="corner-dot" />
      <circle cx="550" cy="25" r="2" fill="rgba(138, 92, 173, 0.7)" class="corner-dot" />
      <circle cx="50" cy="125" r="2" fill="rgba(138, 92, 173, 0.7)" class="corner-dot" />
      <circle cx="550" cy="125" r="2" fill="rgba(138, 92, 173, 0.7)" class="corner-dot" />
      
      <!-- Étoiles scintillantes -->
      <circle cx="150" cy="40" r="0.7" fill="#8a5cad" class="star-particle star1" />
      <circle cx="450" cy="40" r="0.7" fill="#8a5cad" class="star-particle star2" />
      <circle cx="200" cy="110" r="0.7" fill="#8a5cad" class="star-particle star3" />
      <circle cx="400" cy="110" r="0.7" fill="#8a5cad" class="star-particle star4" />
      <circle cx="300" cy="30" r="0.7" fill="#8a5cad" class="star-particle star5" />

      <!-- Texte de contour avec BenjaminFranklin - position ajustée plus bas -->
      <text 
        x="300" 
        y="92" 
        text-anchor="middle" 
        font-family="BenjaminFranklin, Arial, sans-serif" 
        font-size="60" 
        font-weight="bold" 
        fill="none"
        stroke="url(#outlineGradient)"
        stroke-width="2"
        filter="url(#neonEffect)"
        opacity="0.5"
        class="title-text-outline"
      >
        Creation Zone
      </text>

      <!-- Texte principal avec BenjaminFranklin - position ajustée plus bas -->
      <text 
        x="300" 
        y="92" 
        text-anchor="middle" 
        font-family="BenjaminFranklin, Arial, sans-serif" 
        font-size="60" 
        font-weight="bold" 
        fill="url(#titleGradient)"
        filter="url(#neonEffect)"
        class="title-text-main"
      >
        Creation Zone
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'CreationZoneTitle'
}
</script>

<style scoped>
@font-face {
  font-family: 'BenjaminFranklin';
  src: url('@/assets/fonts/BenjaminFranklin.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.creation-zone-title {
  margin-top: -2%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  left: 3%;
  font-family: 'BenjaminFranklin', sans-serif;
  letter-spacing: 2px;
  font-weight: bold;
  pointer-events: none;
}

.creation-zone-title svg {
  max-width: 35%;
  height: auto;
  transition: all 0.5s ease;
}

/* Animation des coins ornementaux - moins intense */
.corner-decoration {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: drawCorner 4s infinite alternate;
}

@keyframes drawCorner {
  0% {
    stroke-dashoffset: 20;
    stroke-width: 2;
  }
  50% {
    stroke-dashoffset: 0;
    stroke-width: 2.5;
  }
  100% {
    stroke-dashoffset: 20;
    stroke-width: 2;
  }
}

/* Animation des points aux coins - moins intense */
.corner-dot {
  animation: dotPulse 4s infinite alternate;
}

@keyframes dotPulse {
  0% {
    r: 1.5;
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.5));
  }
  50% {
    r: 2;
    filter: drop-shadow(0 0 2px rgba(138, 92, 173, 0.7));
  }
  100% {
    r: 1.5;
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.5));
  }
}

/* Animation des étoiles - moins vives */
.star-particle {
  opacity: 0;
  animation: starTwinkle 4s infinite ease-in-out;
}

.star1 { animation-delay: 0.1s; }
.star2 { animation-delay: 0.7s; }
.star3 { animation-delay: 1.3s; }
.star4 { animation-delay: 1.9s; }
.star5 { animation-delay: 2.5s; }

@keyframes starTwinkle {
  0% {
    opacity: 0.05;
    r: 0.4;
  }
  50% {
    opacity: 0.4;
    r: 0.8;
  }
  100% {
    opacity: 0.05;
    r: 0.4;
  }
}

/* Animation subtile du titre - réduite */
.animated-title {
  animation: titlePulse 6s infinite alternate;
}

@keyframes titlePulse {
  0% {
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.2));
  }
  50% {
    filter: drop-shadow(0 0 3px rgba(138, 92, 173, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 1px rgba(138, 92, 173, 0.2));
  }
}

/* Animation du texte qui brille - réduite */
.title-text-main {
  animation: textGlow 6s infinite alternate;
}

@keyframes textGlow {
  0% {
    filter: url(#neonEffect);
    opacity: 0.7;
  }
  50% {
    filter: url(#neonEffect) drop-shadow(0 0 2px rgba(138, 92, 173, 0.4));
    opacity: 0.8;
  }
  100% {
    filter: url(#neonEffect);
    opacity: 0.7;
  }
}

/* Animation du cadre - plus subtile */
.title-frame {
  animation: frameGlow 8s infinite alternate;
}

@keyframes frameGlow {
  0% {
    stroke-width: 1.5;
    opacity: 0.4;
  }
  50% {
    stroke-width: 2;
    opacity: 0.5;
  }
  100% {
    stroke-width: 1.5;
    opacity: 0.4;
  }
}
</style>