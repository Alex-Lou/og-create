<template>
  <div id="crafted-popup" ref="craftedPopup" :class="{ show: isPopupVisible }">
    <!-- Cadre décoratif interne -->
    <div class="crafted-popup-frame">
      <div class="frame-corner corner-tl">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-tl">✧</div>
      </div>
      <div class="frame-corner corner-tr">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-tr">✧</div>
      </div>
      <div class="frame-corner corner-bl">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-bl">✧</div>
      </div>
      <div class="frame-corner corner-br">
        <div class="corner-dot"></div>
        <div class="frame-symbol symbol-br">✧</div>
      </div>
    </div>
    
    <!-- Animation de particules -->
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
    
    <!-- Contenu du popup -->
    <div class="popup-content">
      <div class="image-container">
        <template v-if="currentDisplayedElement && currentDisplayedElement.image">
          <img :src="currentDisplayedElement.image" :alt="currentDisplayedElement.name" />
        </template>
        <template v-else-if="currentDisplayedElement">
          <div class="emoji-fallback">
            {{ elementEmojis[currentDisplayedElement.name] }}
          </div>
        </template>
      </div>
      <p>{{ currentDisplayedElement ? currentDisplayedElement.name : '' }}</p>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';
import '@/assets/ComponentsStyle/CraftStyle/CraftPopup.css';

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
  data() {
    return {
      elementsQueue: [],       // File d'attente pour les éléments
      isPopupVisible: false,   // État contrôlé par le code plutôt que directement par craftedElement.name
      popupTimer: null,        // Référence au timer pour pouvoir l'annuler
      currentDisplayedElement: null // Élément actuellement affiché
    };
  },
  methods: {
    // Ajouter un élément à la file d'attente
    queueElement(element) {
      if (!element || !element.name) return;
      
      // Ajouter à la file d'attente
      this.elementsQueue.push({...element});
      
      // Si aucun popup n'est actuellement affiché, traiter la file
      if (!this.isPopupVisible) {
        this.processQueue();
      }
    },
    
    // Traiter le prochain élément dans la file
    processQueue() {
      // S'il n'y a rien à traiter, sortir
      if (this.elementsQueue.length === 0) return;
      
      // Annuler le timer existant si présent
      if (this.popupTimer) {
        clearTimeout(this.popupTimer);
        this.popupTimer = null;
      }
      
      // Définir l'élément courant
      this.currentDisplayedElement = this.elementsQueue.shift();
      this.isPopupVisible = true;
      
      // Animer les particules
      this.$nextTick(() => {
        console.log("Animating particles");
        this.animateParticles();
      });
      
      // Configurer le timer pour fermer le popup
      this.popupTimer = setTimeout(() => {
        this.isPopupVisible = false;
        this.$emit('reset-crafted-element');
        
        // Après une courte pause pour l'animation de fermeture, vérifier s'il y a d'autres éléments
        setTimeout(() => {
          if (this.elementsQueue.length > 0) {
            this.processQueue();
          }
        }, 300); // Délai pour l'animation de fermeture
      }, 2500);
    },
    
    showPopup() {
      // Ajouter l'élément actuel à la file d'attente
      this.queueElement(this.craftedElement);
    },
    
    animateParticles() {
      if (!this.$refs.particles) {
        return;
      }
      
      const particles = this.$refs.particles;
      
      particles.forEach((particle) => { // Supprimé 'index' pour éviter l'avertissement ESLint
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
    // Vérifier si un élément est déjà présent au montage
    if (this.craftedElement && this.craftedElement.name) {
      this.showPopup();
    }
  }
};
</script>