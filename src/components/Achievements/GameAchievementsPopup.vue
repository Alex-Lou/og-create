<template>
  <div>
    <!-- Menu déroulant des succès (quand aucun 'achievement' n'est sélectionné) -->
    <div id="achievements-menu" v-if="!achievement">
      <div id="achievements-content">
        <ul>
          <li
            v-for="(ach, index) in achievements"
            :key="ach.id || index"
            :class="{ unlocked: ach.unlocked }"
            v-memo="[ach.unlocked, ach.name]"
          >
            <img
              v-if="ach.image"
              :src="ach.image"
              alt=""
              class="achievement-icon"
              loading="lazy"
            />
            <span v-once>{{ ach.name }} - {{ ach.description }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div
      v-if="achievement"
      ref="achievementPopup"
      id="achievement-popup"
      class="xyz-in"
      xyz="appear-front-5 fade flip-down-50% duration-5 ease-elastic-out-10"
    >
      <div ref="particleContainer" class="gsap-particles-container"></div>
      <div class="popup-content">
        <button class="close-button" @click="closePopup">&times;</button>
        <img
          v-if="achievement.image"
          :src="achievement.image"
          :alt="achievement.name"
          class="xyz-nested"
          xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back"
        />
        <div class="achievement-text xyz-nested" xyz="fade up small-75% delay-3">
          <h3>{{ achievement.name }}</h3>
          <p>{{ achievement.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { gsap } from 'gsap';
import "@/assets/ComponentsStyle/AchievementsStyle/SuccessPopupStyle.css";

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
  emits: ["close", "achievement-popup-opened"],
  data() {
    return {
      particles: [],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FFD93D'],
      particleCount: 15, // Réduit de 30 à 15
      autoCloseTimer: null,
      animationTimelines: [],
    };
  },
  mounted() {
    if (this.achievement) {
      this.$nextTick(this.handleAchievementPopup);
    }
  },
  watch: {
    achievement(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(this.handleAchievementPopup);
      } else if (!newVal && oldVal) {
        this.clearAutoCloseTimer();
      }
    },
  },
  methods: {
    handleAchievementPopup() {
      // Regrouper l'initialisation du popup pour éviter les répétitions de code
      this.initParticles();
      this.$emit("achievement-popup-opened");
      this.startAutoCloseTimer();
    },
    
    startAutoCloseTimer() {
      this.clearAutoCloseTimer();

      this.autoCloseTimer = setTimeout(() => {
        this.fadeOutAndClose();
      }, 5000); // 5 secondes
    },

    clearAutoCloseTimer() {
      if (this.autoCloseTimer) {
        clearTimeout(this.autoCloseTimer);
        this.autoCloseTimer = null;
      }
    },

    closePopup() {
      this.clearAutoCloseTimer();
      this.fadeOutAndClose();
    },

    fadeOutAndClose() {
      const popupEl = this.$refs.achievementPopup;
      if (!popupEl) {
        this.cleanupParticles();
        this.$emit("close");
        return;
      }
      
      const tl = gsap.to(popupEl, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          this.cleanupParticles();
          this.$emit("close");
          gsap.set(popupEl, { opacity: 1 });
        },
      });
      
      this.animationTimelines.push(tl);
    },

    initParticles() {
      // Utiliser requestAnimationFrame pour aligner avec le cycle de rendu du navigateur
      requestAnimationFrame(() => {
        this.createParticles();
        this.animateParticles();
      });
    },

    createParticles() {
      const container = this.$refs.particleContainer;
      if (!container) return;

      this.cleanupParticles();

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Créer un fragment de document pour améliorer les performances lors de l'ajout d'éléments
      const fragment = document.createDocumentFragment();
      
      // Réduire le nombre de particules pour améliorer les performances
      const totalParticles = Math.min(this.particleCount + 20, 35);

      for (let i = 0; i < totalParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        Object.assign(particle.style, {
          backgroundColor: this.colors[Math.floor(Math.random() * this.colors.length)],
          position: 'absolute',
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          left: `${centerX}px`,
          top: `${centerY}px`,
          transform: 'translate(-100%, -100%)',
          opacity: 1
        });

        fragment.appendChild(particle);
        this.particles.push(particle);
      }
      
      // Ajouter toutes les particules en une seule opération DOM
      container.appendChild(fragment);
    },

    animateParticles() {
      // Utiliser une seule timeline GSAP pour toutes les particules
      const masterTimeline = gsap.timeline();
      this.animationTimelines.push(masterTimeline);
      
      // Regrouper les animations par lot pour améliorer les performances
      const batchSize = 10;
      const particleBatches = [];
      
      for (let i = 0; i < this.particles.length; i += batchSize) {
        particleBatches.push(this.particles.slice(i, i + batchSize));
      }
      
      particleBatches.forEach((batch, batchIndex) => {
        batch.forEach((particle) => {
          const angle = Math.random() * Math.PI * 2;
          const initialDistance = 70 + Math.random() * 100;
          const arcHeight = 100 + Math.random() * 50;
          const duration = 1.5 + Math.random() * 0.5;
          const delay = Math.random() * 0.01 + (batchIndex * 0.02);

          const startX = Math.cos(angle) * initialDistance;
          const startY = Math.sin(angle) * initialDistance;

          const tl = gsap.timeline({delay});
          tl.to(particle, {
            duration: duration / 2,
            x: startX,
            y: startY - arcHeight,
            ease: "power1.out",
          })
          .to(particle, {
            duration: duration / 2,
            x: startX + (Math.random() - 0.5) * 80,
            y: startY + 50 + Math.random() * 100,
            scale: 0,
            opacity: 0,
            ease: "power2.in",
            onComplete: () => {
              if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
              }
            }
          });
          
          masterTimeline.add(tl, delay);
        });
      });
    },

    cleanupParticles() {
      // Arrêter toutes les animations actives
      this.animationTimelines.forEach(timeline => {
        if (timeline && timeline.kill) {
          timeline.kill();
        }
      });
      this.animationTimelines = [];
      
      // Nettoyer les particules
      this.particles.forEach(particle => {
        if (particle && particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
      this.particles = [];
    },
  },
  beforeUnmount() {
    this.clearAutoCloseTimer();
    this.cleanupParticles();
  },
};
</script>