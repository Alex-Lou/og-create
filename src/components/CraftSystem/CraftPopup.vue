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
      <div v-for="(style, n) in particleStyles" :key="n" 
           class="particle"
           :style="style"
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
            {{ elementEmojis[currentDisplayedElement.name] || '✨' }}
          </div>
        </template>
      </div>
      <p>{{ currentDisplayedElement ? currentDisplayedElement.name : '' }}</p>
      <span v-if="currentDisplayedElement && currentDisplayedElement.isNew" class="new-badge">Nouveau !</span>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap';
import '@/assets/ComponentsStyle/CraftStyle/CraftPopup.css';

export default {
  name: 'CraftPopup',
  // Piloté par App via queueElement({ name, image, isNew }) : chaque craft s'affiche, même répété
  props: {
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
      currentDisplayedElement: null, // Élément actuellement affiché
      // Tirées une fois : les particules ne changent plus de couleur à chaque rendu
      particleStyles: Array.from({ length: 30 }, () => {
        const size = `${Math.random() * 6 + 4}px`;
        return { backgroundColor: this.getRandomColor(), width: size, height: size };
      })
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
        this.animateParticles();
      });
      
      // Configurer le timer pour fermer le popup
      this.popupTimer = setTimeout(() => {
        this.isPopupVisible = false;
        
        // Après une courte pause pour l'animation de fermeture, vérifier s'il y a d'autres éléments
        setTimeout(() => {
          if (this.elementsQueue.length > 0) {
            this.processQueue();
          }
        }, 300); // Délai pour l'animation de fermeture
      }, 2000);
    },
    
    animateParticles() {
    if (!this.$refs.particles) {
      return;
    }
    
    const particles = this.$refs.particles;
    
    particles.forEach((particle) => {
      // Positionnement initial au centre
      gsap.set(particle, {
        top: '50%',
        left: '50%',
        xPercent: -50,
        yPercent: -50,
        scale: 0.1,
        opacity: 0
      });
      
      // Animation de sortie avec trajectoire plus intéressante
      gsap.timeline()
        .to(particle, {
          duration: 0.3,
          scale: Math.random() * 0.5 + 0.5,
          opacity: 0.8,
          ease: "power2.out"
        })
        .to(particle, {
          duration: 1.5,
          xPercent: () => -50 + (Math.random() - 0.5) * 400,
          yPercent: () => -50 + (Math.random() - 0.5) * 400,
          scale: 0,
          opacity: 0,
          ease: "power3.out",
          rotation: () => Math.random() * 360
        }, "-=0.1");
    });
  },
    
  getRandomColor() {
    const colors = [
      'rgba(177, 136, 212, 0.8)',  // Violet clair
      'rgba(138, 92, 173, 0.8)',   // Violet principal
      'rgba(89, 48, 124, 0.8)',    // Violet foncé
      'rgba(210, 170, 230, 0.8)',  // Lavande
      'rgba(60, 30, 90, 0.8)'      // Indigo
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
},
  beforeUnmount() {
    clearTimeout(this.popupTimer);
  }
};
</script>