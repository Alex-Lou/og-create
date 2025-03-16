<template>
  <div class="creation-zone-title">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 150" 
      class="animated-title"
    >
      <defs>
        <!-- Dégradé principal pour le texte - plus subtil -->
        <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#aa82cc;stop-opacity:0.9" />
          <stop offset="50%" style="stop-color:#d4c0f0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#aa82cc;stop-opacity:0.9" />
        </linearGradient>
        
        <!-- Effet de lueur néon réduit -->
        <filter id="subtleNeonEffect">
          <feGaussianBlur class="blur" stdDeviation="1" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Coins ornementaux uniquement -->
      <path d="M65,25 L50,25 L50,40" fill="none" stroke="rgba(158, 109, 190, 0.8)" stroke-width="2.5" class="corner-decoration corner1" />
      <path d="M535,25 L550,25 L550,40" fill="none" stroke="rgba(158, 109, 190, 0.8)" stroke-width="2.5" class="corner-decoration corner2" />

      <!-- Points lumineux aux coins -->
      <circle cx="50" cy="25" r="2.5" fill="rgba(158, 109, 190, 0.9)" class="corner-dot dot1" />
      <circle cx="550" cy="25" r="2.5" fill="rgba(158, 109, 190, 0.9)" class="corner-dot dot2" />


      <!-- Texte principal avec effet néon subtil -->
      <text 
        x="300" 
        y="85" 
        text-anchor="middle" 
        font-family="BenjaminFranklin, Arial, sans-serif" 
        font-size="55" 
        font-weight="bold" 
        fill="url(#titleGradient)"
        filter="url(#subtleNeonEffect)"
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

/* Animation des coins ornementaux */
.corner-decoration {
  stroke-dasharray: 30;
  stroke-dashoffset: 30;
  animation: drawCorner 4s infinite alternate;
}



/* Animation des points aux coins */
.corner-dot {
  animation: dotPulse 4s infinite alternate;
}

.dot1 { animation-delay: 0s; }
.dot2 { animation-delay: 1s; }
.dot3 { animation-delay: 2s; }
.dot4 { animation-delay: 3s; }

@keyframes dotPulse {
  0% {
    r: 2;
  }
  50% {
    r: 3;
  }
  100% {
    r: 2;
  }
}

/* Animation du texte principal avec effet néon minimal */
.title-text-main {
  animation: subtleTextGlow 6s infinite alternate;
}

@keyframes subtleTextGlow {
  0% {
    fill-opacity: 0.9;
    filter: url(#subtleNeonEffect);
  }
  50% {
    fill-opacity: 1;
    filter: url(#subtleNeonEffect) drop-shadow(0 0 3px rgba(158, 109, 190, 0.3));
  }
  100% {
    fill-opacity: 0.9;
    filter: url(#subtleNeonEffect);
  }
}
</style>