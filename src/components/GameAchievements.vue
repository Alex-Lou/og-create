<template>
    <div>
      <!-- Menu déroulant des succès -->
      <div id="achievements-menu">
        <p>Succès</p>
        <div id="achievements-content">
          <ul>
            <li
              v-for="(achievement, index) in achievements"
              :key="index"
              :class="{ unlocked: achievement.unlocked }"
            >
              <img
                v-if="achievement.image"
                :src="achievement.image"
                alt=""
                class="achievement-icon"
              />
              {{ achievement.name }} - {{ achievement.description }}
            </li>
          </ul>
        </div>
      </div>
  
      <!-- Popup pour les succès -->
      <XyzTransition appear duration="auto" mode="out-in">
        <div
          v-if="newAchievement"
          id="achievement-popup"
          class="xyz-in"
          xyz="appear-front-5 fade flip-down-50% duration-5 ease-elastic-out-10"
        >
          <div ref="particleContainer" class="gsap-particles-container"></div>
          <div class="popup-content">
            <button class="close-button" @click="closeAchievementPopup">×</button>
            <img
              v-if="newAchievement?.image"
              :src="newAchievement.image"
              :alt="newAchievement.name"
              class="xyz-nested"
              xyz="fade small flip-down-50% duration-10 delay-2 ease-out-back"
            />
            <div class="achievement-text xyz-nested" xyz="fade up small-75% delay-3">
              <h3>{{ newAchievement?.name }}</h3>
              <p>{{ newAchievement?.description }}</p>
            </div>
          </div>
        </div>
      </XyzTransition>
    </div>
  </template>
  
  <script>
  import { gsap } from "gsap";
  
  export default {
    props: {
      achievements: {
        type: Array,
        required: true,
      },
      discoveredElements: {
        type: Array,
        required: true,
      },
    },
    data() {
      return {
        newAchievement: null,
      };
    },
    methods: {
      checkAchievements() {
        this.achievements.forEach((achievement) => {
          if (
            !achievement.unlocked &&
            achievement.condition(this.discoveredElements)
          ) {
            achievement.unlocked = true;
            this.$emit("achievement-unlocked", achievement);
            this.showAchievementPopup(achievement);
          }
        });
      },
      showAchievementPopup(achievement) {
        if (achievement) {
          this.newAchievement = achievement;
          this.spawnParticles();
        }
      },
      closeAchievementPopup() {
        this.newAchievement = null;
      },
      spawnParticles() {
        const container = this.$refs.particleContainer;
        if (!container) return;
  
        container.innerHTML = "";
  
        const shapes = ["circle", "square", "triangle", "star"];
        const colors = ["#FF8B8B", "#FFD93D", "#2DCDDF", "#FF6464", "#FFC436"];
        const particleCount = 150;
  
        for (let i = 0; i < particleCount; i++) {
          const particle = document.createElement("div");
          particle.className = "particle";
  
          const shape = shapes[Math.floor(Math.random() * shapes.length)];
          particle.classList.add(`particle-${shape}`);
          particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  
          container.appendChild(particle);
  
          gsap.set(particle, {
            x: "50%",
            y: "50%",
            scale: 0.1,
            opacity: 1,
          });
  
          const angle = Math.random() * Math.PI * 2;
          const velocity = 120 + Math.random() * 180;
          const rotationSpeed = (Math.random() - 0.5) * 720;
  
          const tl = gsap.timeline();
  
          tl.to(particle, {
            duration: 0.8 + Math.random() * 0.4,
            x: `+=${Math.cos(angle) * velocity}%`,
            y: `+=${Math.sin(angle) * velocity}%`,
            scale: 0.6 + Math.random() * 0.8,
            rotation: rotationSpeed,
            ease: "power2.out",
          }).to(
            particle,
            {
              duration: 1 + Math.random() * 0.5,
              y: "+=100",
              x: `+=${(Math.random() - 0.5) * 50}`,
              scale: 0.2,
              opacity: 0,
              rotation: `+=${rotationSpeed * 0.5}`,
              ease: "power1.in",
            },
            "-=0.2"
          );
        }
      },
    },
  };
  </script>
  