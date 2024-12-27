<template>
    <div class="firework-container" :style="{ left: offsetX + 'px' }">
      <div class="firework" :style="{ animationDelay: delay + 's' }"></div>
      <div class="explosion">
        <div class="particle" v-for="n in 12" :key="n" :style="getParticleStyle(n)"></div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FireworkAnimation',
    props: {
      delay: {
        type: Number,
        default: 0,
      },
      offsetX: {
        type: Number,
        default: 0,
      },
    },
    methods: {
      getParticleStyle(n) {
        const angle = (n * 30) % 360; // 30 degrés entre chaque particule
        const distance = 150; // Distance de dispersion
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;
        const hue = (n * 30) % 360; // Couleur HSL différente pour chaque particule
        return {
          '--x': `${x}px`,
          '--y': `${y}px`,
          '--hue': `${hue}`,
          '--delay': `${this.delay}s`,
        };
      },
    },
  };
  </script>
  
  <style scoped>
  .firework-container {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0;
    animation: container-appear 2s ease-out forwards;
  }
  
  .firework {
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: #ffeb3b;
    border-radius: 50%;
    box-shadow: 0 0 10px 2px rgba(255, 235, 59, 0.8);
    animation: launch 1s ease-out forwards;
  }
  
  .explosion {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .particle {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: hsl(var(--hue), 100%, 60%);
    box-shadow: 0 0 10px 2px hsla(var(--hue), 100%, 60%, 0.8);
    opacity: 0;
    animation: explode 0.8s ease-out forwards;
    animation-delay: calc(1s + var(--delay));
  }
  
  @keyframes container-appear {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
  
  @keyframes launch {
    0% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
    50% {
      transform: translateY(-50vh) scale(0.8);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-70vh) scale(0);
      opacity: 0;
    }
  }
  
  @keyframes explode {
    0% {
      transform: translate(0, 0) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(var(--x), var(--y)) scale(0);
      opacity: 0;
    }
  }
  </style>
  