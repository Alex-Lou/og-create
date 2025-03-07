<template>
  <div class="creation-zone-title">
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 600 150" 
      class="animated-title"
    >
      <defs>
        <linearGradient id="darkTitleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#1a1d24;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#304968;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1a1d24;stop-opacity:1" />
        </linearGradient>

        <filter id="neonEffect">
          <feGaussianBlur class="blur" stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="shimmerEffect">
          <feTurbulence 
            type="fractalNoise" 
            baseFrequency="0.01" 
            numOctaves="3" 
            result="turbulence"
          />
          <feDisplacementMap 
            in2="turbulence" 
            in="SourceGraphic" 
            scale="3" 
            xChannelSelector="R" 
            yChannelSelector="G"
          />
        </filter>
      </defs>

      <rect 
        x="0" 
        y="50" 
        width="600" 
        height="100" 
        fill="url(#outlineGradient)" 
        opacity="0.2"
      />

      <!-- Texte de contour épais avec BenjaminFranklin -->
      <text 
        x="300" 
        y="100" 
        text-anchor="middle" 
        font-family="BenjaminFranklin, Arial, sans-serif" 
        font-size="80" 
        font-weight="bold" 
        fill="url(#outlineGradient)"
        stroke="url(#outlineGradient)"
        stroke-width="3"
        filter="url(#neonEffect)"
        opacity="0.7"
      >
        Creation Zone
      </text>

      <!-- Texte principal avec BenjaminFranklin -->
      <text 
        x="300" 
        y="100" 
        text-anchor="middle" 
        fill="url(#darkTitleGradient)"
        filter="url(#neonEffect)"
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
  font-size: 65px;
  font-weight: bold;
}

.creation-zone-title svg {
  max-width: 30%;
  height: auto;
  transition: all 0.3s ease;
}

.creation-zone-title svg:hover {
  transform: scale(1.03);
  filter: brightness(1.2) contrast(1.2);
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animated-title {
  animation: subtle-pulse 3s infinite alternate;
}

@keyframes subtle-pulse {
  0% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.01);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
}
</style>