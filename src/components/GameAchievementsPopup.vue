<template>
  <div>
    <!-- Menu déroulant des succès (quand aucun 'achievement' n'est sélectionné) -->
    <div id="achievements-menu" v-if="!achievement">
      <div id="achievements-content">
        <ul>
          <li
            v-for="(ach, index) in achievements"
            :key="index"
            :class="{ unlocked: ach.unlocked }"
          >
            <img
              v-if="ach.image"
              :src="ach.image"
              alt=""
              class="achievement-icon"
            />
            {{ ach.name }} - {{ ach.description }}
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
          v-if="achievement?.image"
          :src="achievement.image"
          :alt="achievement.name"
          class="xyz-nested"
          xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back"
        />
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
  emits: ["close", "achievement-popup-opened"],
  data() {
    return {
      particles: [],
      colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#FFD93D'],
      particleCount: 30,
      autoCloseTimer: null,
    };
  },
  mounted() {
    if (this.achievement) {
      this.initParticles();
      this.$emit("achievement-popup-opened");
      this.startAutoCloseTimer();
    }
  },
  watch: {
    achievement(newVal, oldVal) {
      if (newVal) {
        this.$nextTick(() => {
          this.initParticles();
          this.$emit("achievement-popup-opened");
          this.startAutoCloseTimer();
        });
      } else if (!newVal && oldVal) {
        this.clearAutoCloseTimer();
      }
    },
  },
  methods: {

    startAutoCloseTimer() {
      this.clearAutoCloseTimer();

      this.autoCloseTimer = setTimeout(() => {
        this.fadeOutAndClose();
      }, 20000);
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
      gsap.to(popupEl, {
        opacity: 0,
        duration: 0.6,
        onComplete: () => {
          this.cleanupParticles();
          this.$emit("close");

          gsap.set(popupEl, { opacity: 1 });
        },
      });
    },


    initParticles() {
      setTimeout(() => {
        this.createParticles();
        this.animateParticles();
      }, 20);
    },
    createParticles() {
      const container = this.$refs.particleContainer;
      if (!container) return;

      this.cleanupParticles();

      const rect = container.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      for (let i = 0; i < this.particleCount + 200; i++) {
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

        container.appendChild(particle);
        this.particles.push(particle);
      }
    },
    animateParticles() {
      this.particles.forEach((particle) => {
        const angle = Math.random() * Math.PI * 2;
        const initialDistance = 70 + Math.random() * 100;
        const arcHeight = 100 + Math.random() * 50;
        const duration = 1.5 + Math.random() * 0.5;
        const delay = Math.random() * 0.01;

        const startX = Math.cos(angle) * initialDistance;
        const startY = Math.sin(angle) * initialDistance;

        gsap.to(particle, {
          duration: duration / 2,
          x: startX,
          y: startY - arcHeight,
          ease: "power1.out",
          delay: delay,
          onComplete: () => {
            gsap.to(particle, {
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
    this.clearAutoCloseTimer();
    this.cleanupParticles();
  },
};
</script>

<style scoped>
@import "@/assets/SuccessPopupStyle.css";


</style>
