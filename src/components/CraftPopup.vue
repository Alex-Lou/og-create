<template>
  <div id="crafted-popup" ref="craftedPopup" :class="{ show: craftedElement.name }">
    <!-- Container de particules avant le contenu du popup -->
    <div class="gsap-particles-container">
      <div v-for="n in 20" :key="n" 
           class="particle"
           :style="{
             backgroundColor: getRandomColor(),
             width: '10px',
             height: '10px'
           }"
           ref="particles">
      </div>
    </div>
    <div class="popup-content">
      <img v-if="craftedElement.image" :src="craftedElement.image" :alt="craftedElement.name" />
      <p>{{ craftedElement.name }}</p>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';

export default {
  name: 'CraftPopup',
  props: {
      craftedElement: {
          type: Object,
          required: true,
          default: () => ({
              name: '',
              image: null
          })
      },
  },
  methods: {
      showPopup() {
          console.log("Showing popup"); // Debug
          const popup = this.$refs.craftedPopup;
          popup.classList.add("show");
          
          // Déclencher l'animation des particules
          this.$nextTick(() => {
              console.log("Animating particles"); // Debug
              this.animateParticles();
          });

          setTimeout(() => {
              popup.classList.remove("show");
              this.$emit('reset-crafted-element');
          }, 2500);
      },
      
      animateParticles() {
          if (!this.$refs.particles) {
              console.log("No particles found"); // Debug
              return;
          }

          const particles = this.$refs.particles;
          console.log("Number of particles:", particles.length); // Debug

          particles.forEach((particle, index) => {
              console.log("Animating particle", index); // Debug
              
              // Reset initial position
              gsap.set(particle, {
                  top: '50%',
                  left: '50%',
                  xPercent: -50,
                  yPercent: -50,
                  scale: 0.5,
                  opacity: 1
              });

              // Animate
              gsap.to(particle, {
                  duration: 1,
                  xPercent: () => -50 + (Math.random() - 0.5) * 400,
                  yPercent: () => -50 + (Math.random() - 0.5) * 400,
                  scale: 0,
                  opacity: 0,
                  ease: "power2.out"
              });
          });
      },

      getRandomColor() {
          const colors = [
              '#FFD700', // Gold
              '#FFA500', // Orange
              '#FF6B6B', // Light red
              '#4DD0E1', // Light blue
              '#81C784'  // Light green
          ];
          return colors[Math.floor(Math.random() * colors.length)];
      }
  },
  watch: {
      'craftedElement.name'(newValue) {
          if (newValue) {
              console.log("Crafted element changed:", newValue); // Debug
              this.showPopup();
          }
      }
  },
  mounted() {
      console.log("Component mounted"); // Debug
  }
};
</script>
