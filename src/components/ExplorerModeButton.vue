<template>
    <button 
      class="explorer-mode-button" 
      :style="{ '--content': 'Explorer' }"
      @click="activateExplorerMode"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
        <!-- Fond du bouton -->
        <rect x="50" y="50" width="300" height="100" rx="20" fill="#1a1d24" />
        
        <!-- Bordure lumineuse -->
        <rect x="55" y="55" width="290" height="90" rx="15" fill="none" stroke="#304968" stroke-width="2" class="glow-border"/>
        
        <!-- Texte EXPLORER avec la même police et dimensions -->
        <text 
          x="200" 
          y="115" 
          font-family="BenjaminFranklin, Arial" 
          font-size="40" 
          font-weight="bold" 
          fill="#2D96A4" 
          text-anchor="middle"
          letter-spacing="6"
          class="explorer-text"
        >EXPLORER</text>
        
        <!-- Effet de lueur -->
        <rect x="50" y="50" width="300" height="100" rx="20" fill="url(#glow)" opacity="0.3" class="glow-effect"/>
        
        <!-- Définition du dégradé pour la lueur -->
        <defs>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stop-color="#304968" stop-opacity="0"/>
            <stop offset="100%" stop-color="#304968" stop-opacity="0.5"/>
          </radialGradient>
        </defs>
      </svg>
    </button>
  </template>
  
  <script>
  import '@/assets/ExplorerModeButtonStyle.css';
  export default {
    name: 'ExplorerModeButton',
    methods: {
      activateExplorerMode() {
        this.$emit('click');
      }
    }
  }
  </script>
  