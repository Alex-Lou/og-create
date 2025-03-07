<template>
    <div class="firework-container" :style="{ left: offsetX + 'px' }">
      <div class="firework" :style="{ animationDelay: delay + 's' }"></div>
      <div class="explosion">
        <div class="particle-work" v-for="n in 12" :key="n" :style="getParticleStyle(n)"></div>
        <div class="particle-work" v-for="n in 25" :key="n" :style="getParticleStyle(n)"></div>
        <div class="particle-work" v-for="n in 28" :key="n" :style="getParticleStyle(n)"></div>
        <div class="particle-work" v-for="n in 10" :key="n" :style="getParticleStyle(n)"></div>
      </div>
    </div>
  </template>
  
  <script>
  import "@/assets/ComponentsStyle/CraftStyle/FireWorkStyle.css";
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
  