<template>
  <div id="crafted-popup" ref="craftedPopup" :class="{ show: craftedElement.name }">
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
      <div class="image-container">
        <template v-if="craftedElement.image">
          <img :src="craftedElement.image" :alt="craftedElement.name" />
        </template>
        <template v-else>
          <div class="emoji-fallback">
            {{ elementEmojis[craftedElement.name] }}
          </div>
        </template>
      </div>
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
      elementEmojis: {
        type: Object,
        required: true
      }
    },
    methods: {
      showPopup() {
        const popup = this.$refs.craftedPopup;
        popup.classList.add("show");
        
        this.$nextTick(() => {
          console.log("Animating particles");
          this.animateParticles();
        });
  
        setTimeout(() => {
          popup.classList.remove("show");
          this.$emit('reset-crafted-element');
        }, 2500);
      },
      
      animateParticles() {
        if (!this.$refs.particles) {
          return;
        }
  
        const particles = this.$refs.particles;
  
        particles.forEach((particle, index) => {
          console.log("Animating particle", index);
          
          gsap.set(particle, {
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            scale: 0.5,
            opacity: 1
          });
  
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
          '#FFD700',
          '#FFA500',
          '#FF6B6B', 
          '#4DD0E1',
          '#81C784'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }
    },
    watch: {
      'craftedElement.name'(newValue) {
        if (newValue) {
          this.showPopup();
        }
      }
    },
    mounted() {
    }
  };
  </script>
  
<style scoped>
@import '@/assets/CraftPopup.css';


</style>