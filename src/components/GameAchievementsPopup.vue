<template>
  <div>
    <!-- Menu déroulant des succès -->
    <div id="achievements-menu" v-if="!achievement">
      <div id="achievements-content">
        <ul>
          <li v-for="(achievement, index) in achievements" :key="index" :class="{ unlocked: achievement.unlocked }">
            <img v-if="achievement.image" :src="achievement.image" alt="" class="achievement-icon" />
            {{ achievement.name }} - {{ achievement.description }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Popup pour un succès spécifique -->
    <div v-if="achievement" id="achievement-popup" class="xyz-in"
      xyz="appear-front-5 fade flip-down-50% duration-5 ease-elastic-out-10">
      <div ref="particleContainer" class="gsap-particles-container"></div>
      <div class="popup-content">
        <button class="close-button" @click="closePopup">&times;</button>
        <img v-if="achievement?.image" :src="achievement.image" :alt="achievement.name" class="xyz-nested"
          xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back" />
        <div class="achievement-text xyz-nested" xyz="fade up small-75% delay-3">
          <h3>{{ achievement?.name }}</h3>
          <p>{{ achievement?.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';

export default {
  props: {
    achievement: {
      type: Object,
      default: null,
    },
    achievements: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["close"],
  data() {
    return {
      particles: [],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FFD93D'],
      particleCount: 30,
    };
  },
  mounted() {
    if (this.achievement) {
      this.initParticles();
    }
  },
  watch: {
    achievement(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initParticles();
        });
      }
    },
  },
  methods: {
    closePopup() {
      this.cleanupParticles();
      this.$emit("close");
    },
    initParticles() {
      // Attendre que le DOM soit complètement chargé
      setTimeout(() => {
        this.createParticles();
        this.animateParticles();
      }, 200);
    },
    createParticles() {
      const container = this.$refs.particleContainer;
      if (!container) return;

      // Nettoyage des anciennes particules
      this.cleanupParticles();

      // Récupérer les dimensions réelles du conteneur
      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      for (let i = 0; i < this.particleCount + 200; i++) { // Plus de particules
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Style initial des particules
        Object.assign(particle.style, {
          backgroundColor: this.colors[Math.floor(Math.random() * this.colors.length)],
          position: 'absolute',
          width: '6px', // Taille légèrement réduite pour plus de naturel
          height: '6px',
          borderRadius: '50%',
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-100%, -100%)',
          opacity: 1
        });

        container.appendChild(particle);
        this.particles.push(particle);
      }
    },
    animateParticles() {
      this.particles.forEach((particle) => {
        const angle = Math.random() * Math.PI * 2; // Direction aléatoire
        const initialDistance = 70 + Math.random() * 100; // Distance pour le jet initial
        const arcHeight = 100 + Math.random() * 50; // Hauteur de l'arc
        const duration = 1.5 + Math.random() * 0.5; // Durée totale de l'animation
        const delay = Math.random() * 0.01; // Délais aléatoires pour décaler les particules

        // Trajectoire parabolique
        const startX = Math.cos(angle) * initialDistance; // Déplacement horizontal initial
        const startY = Math.sin(angle) * initialDistance; // Déplacement vertical initial

        gsap.to(particle, {
          duration: duration / 2, // Première moitié de l'animation (montée)
          x: startX,
          y: startY - arcHeight, // Montée jusqu'au sommet de l'arc
          ease: "power1.out", // Accélération pour un mouvement naturel
          delay: delay,
          onComplete: () => {
            // Descente parabolique
            gsap.to(particle, {
              duration: duration / 2, // Deuxième moitié de l'animation (descente)
              x: startX + (Math.random() - 0.5) * 80, // Légère dispersion horizontale
              y: startY + 50 + Math.random() * 100, // Retombée vers le bas
              scale: 0, // Réduction progressive
              opacity: 0, // Disparition progressive
              ease: "power2.in", // Décélération pour un effet de gravité
              onComplete: () => {
                // Suppression de la particule après animation
                if (particle.parentNode) {
                  particle.parentNode.removeChild(particle);
                }
              }
            });
          }
        });
      });
    },
    cleanupParticles() {
      this.particles.forEach(particle => {
        if (particle && particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      this.particles = [];
    },
  },
  beforeUnmount() {
    this.cleanupParticles();
  },
};
</script>

<style scoped>
@import "@/assets/SuccessPopupStyle.css";
/* Chemin vers ton fichier CSS */
</style>
