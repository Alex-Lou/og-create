<template>
  <div class="contact-icon-container">
    <button 
      class="contact-icon-button"
      @click="toggleModal"
      :class="{ 'dark': isDarkMode, 'clicked': isClicked }"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      ref="contactButton"
    >
      <div class="image-container">
        <!-- SVG d'enveloppe amélioré avec animation de rabat plus visible -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="100%" height="100%" ref="envelopeSvg">
          <!-- Définitions des dégradés et filtres -->
          <defs>
            <!-- Dégradé principal mauve foncé -->
            <linearGradient id="envelopeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#2a1c38" />
              <stop offset="50%" stop-color="#3a2a4d" />
              <stop offset="100%" stop-color="#2a1c38" />
            </linearGradient>
            
            <!-- Dégradé pour la bordure -->
            <linearGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#b284d5" />
              <stop offset="50%" stop-color="#8a5cad" />
              <stop offset="100%" stop-color="#b284d5" />
            </linearGradient>
            
            <!-- Dégradé pour l'intérieur du rabat -->
            <linearGradient id="flapInnerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3a2a4d" />
              <stop offset="100%" stop-color="#231630" />
            </linearGradient>
            
            <!-- Filtre pour l'effet de lueur -->
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            <!-- Filtre pour l'effet de lueur interne -->
            <filter id="innerGlow" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          <!-- Groupe pour l'animation de l'enveloppe -->
          <g class="envelope">
            <!-- Ombre de l'enveloppe -->
            <rect x="5" y="15" width="90" height="60" rx="4" ry="4" fill="#1a1020" opacity="0.3" transform="translate(2 2)" />
            
            <!-- Fond de l'enveloppe -->
            <rect x="5" y="15" width="90" height="60" rx="4" ry="4" fill="url(#envelopeGradient)" stroke="url(#borderGradient)" stroke-width="1.5" />
            
            <!-- Corps de l'enveloppe avec effet de pli -->
            <path d="M5,15 L50,45 L95,15 L95,75 Q95,75 95,75 L5,75 Q5,75 5,75 L5,15 Z" fill="none" stroke="#8a5cad" stroke-width="0.5" stroke-dasharray="2,1" opacity="0.7" />
            
            <!-- Ombre du rabat soulevé -->
            <path d="M5,15 L50,45 L95,15" fill="none" stroke="#1a1020" stroke-width="3" stroke-opacity="0.2" filter="url(#glow)" opacity="0" class="flap-shadow">
              <animate id="shadowAppear" attributeName="opacity" begin="indefinite" dur="0.3s" from="0" to="0.7" fill="freeze" />
              <animate id="shadowDisappear" attributeName="opacity" begin="indefinite" dur="0.3s" from="0.7" to="0" fill="freeze" />
            </path>
            
            <!-- Rabat supérieur (fermé par défaut) -->
            <path d="M5,15 L50,45 L95,15 L95,15 Q95,15 95,15 L5,15 Q5,15 5,15 Z" fill="url(#flapInnerGradient)" stroke="url(#borderGradient)" stroke-width="1" class="flap">
              <animate id="flapOpen" attributeName="d" begin="indefinite" dur="0.3s" fill="freeze" 
                from="M5,15 L50,45 L95,15 L95,15 Q95,15 95,15 L5,15 Q5,15 5,15 Z" 
                to="M5,15 L50,-10 L95,15 L95,15 Q95,15 95,15 L5,15 Q5,15 5,15 Z" />
              <animate id="flapClose" attributeName="d" begin="indefinite" dur="0.3s" fill="freeze" 
                from="M5,15 L50,-10 L95,15 L95,15 Q95,15 95,15 L5,15 Q5,15 5,15 Z" 
                to="M5,15 L50,45 L95,15 L95,15 Q95,15 95,15 L5,15 Q5,15 5,15 Z" />
            </path>
            
            <!-- Ligne de pli du rabat -->
            <line x1="5" y1="15" x2="95" y2="15" stroke="#8a5cad" stroke-width="0.5" stroke-dasharray="2,1" />
            
            <!-- Effet de sceau magique -->
            <circle cx="50" cy="45" r="5" fill="#3a2a4d" filter="url(#innerGlow)" class="seal">
              <animate id="sealFade" attributeName="opacity" begin="indefinite" dur="0.3s" from="1" to="0" fill="freeze" />
              <animate id="sealAppear" attributeName="opacity" begin="indefinite" dur="0.3s" from="0" to="1" fill="freeze" />
            </circle>
            
            <!-- Symbole mystique sur le sceau -->
            <path d="M48,45 L52,45 M50,43 L50,47 M47,42 L53,48 M47,48 L53,42" stroke="#b284d5" stroke-width="0.5" opacity="0.9" filter="url(#glow)" class="symbol">
              <animate id="symbolFade" attributeName="opacity" begin="indefinite" dur="0.3s" from="0.9" to="0" fill="freeze" />
              <animate id="symbolAppear" attributeName="opacity" begin="indefinite" dur="0.3s" from="0" to="0.9" fill="freeze" />
            </path>
            
            <!-- Effet de particules/étoiles scintillantes -->
            <g class="particles">
              <circle cx="30" cy="35" r="0.5" fill="#b284d5" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="70" cy="35" r="0.5" fill="#b284d5" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.9;0.5" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="20" cy="55" r="0.5" fill="#b284d5" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="80" cy="55" r="0.5" fill="#b284d5" opacity="0.4">
                <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="25" r="0.5" fill="#b284d5" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.4;0.8" dur="1.7s" repeatCount="indefinite" />
              </circle>
              <circle cx="50" cy="65" r="0.5" fill="#b284d5" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
            
            <!-- Effet de lueur émanant de l'intérieur quand ouvert -->
            <ellipse cx="50" cy="45" rx="40" ry="15" fill="url(#borderGradient)" opacity="0" filter="url(#glow)" class="inner-glow">
              <animate id="glowAppear" attributeName="opacity" begin="indefinite" dur="0.4s" from="0" to="0.3" fill="freeze" />
              <animate id="glowDisappear" attributeName="opacity" begin="indefinite" dur="0.3s" from="0.3" to="0" fill="freeze" />
            </ellipse>
          </g>
        </svg>
      </div>
    </button>

    <ContactModal 
      v-if="isModalOpen"
      :isDarkMode="isDarkMode"
      @close="closeModal"
    />
  </div>
</template>

<script>
import ContactModal from './ContactModal.vue'
import '@/assets/ComponentsStyle/HeaderStyle/ContactIconStyle.css'

export default {
  name: 'ContactIcon',
  components: {
    ContactModal
  },
  props: {
    isDarkMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isModalOpen: false,
      isClicked: false,
      isEnvelopeOpen: false
    }
  },
  methods: {
    toggleModal() {
      // Animer l'enveloppe
      this.toggleEnvelopeAnimation();
      
      // Décalage pour que l'animation commence avant d'ouvrir/fermer le modal
      setTimeout(() => {
        this.isModalOpen = !this.isModalOpen;
      }, 150);
    },
    closeModal() {
      this.isModalOpen = false;
      
      // Fermer l'enveloppe quand on ferme le modal
      if (this.isEnvelopeOpen) {
        this.toggleEnvelopeAnimation();
      }
    },
    toggleEnvelopeAnimation() {
      // Accéder au SVG
      const svg = this.$refs.envelopeSvg;
      if (!svg) return;
      
      // Trouver les éléments d'animation
      const flapOpen = svg.getElementById('flapOpen');
      const flapClose = svg.getElementById('flapClose');
      const sealFade = svg.getElementById('sealFade');
      const sealAppear = svg.getElementById('sealAppear');
      const symbolFade = svg.getElementById('symbolFade');
      const symbolAppear = svg.getElementById('symbolAppear');
      const shadowAppear = svg.getElementById('shadowAppear');
      const shadowDisappear = svg.getElementById('shadowDisappear');
      const glowAppear = svg.getElementById('glowAppear');
      const glowDisappear = svg.getElementById('glowDisappear');
      
      if (!this.isEnvelopeOpen) {
        // Ouvrir l'enveloppe
        flapOpen.beginElement();
        sealFade.beginElement();
        symbolFade.beginElement();
        shadowAppear.beginElement();
        glowAppear.beginElement();
      } else {
        // Fermer l'enveloppe
        flapClose.beginElement();
        sealAppear.beginElement();
        symbolAppear.beginElement();
        shadowDisappear.beginElement();
        glowDisappear.beginElement();
      }
      
      this.isEnvelopeOpen = !this.isEnvelopeOpen;
    },
    handleMouseDown() {
      this.isClicked = true;
    },
    handleMouseUp() {
      this.isClicked = false;
    }
  }
}
</script>

<style scoped>
/* Ces styles seront ajoutés aux styles existants de votre fichier CSS */
.image-container {
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: visible; /* Permet au rabat de dépasser légèrement */
}

.contact-icon-button:hover .envelope .particles circle {
  animation-duration: 1s;
}

.contact-icon-button:active .envelope {
  transform: scale(0.95);
  transition: transform 0.1s;
}

.dark .envelope .seal {
  fill: #4a3a5d;
}
</style>