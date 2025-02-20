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
  export default {
    name: 'ExplorerModeButton',
    methods: {
      activateExplorerMode() {
        this.$emit('click');
      }
    }
  }
  </script>
  
  <style scoped>
  @font-face {
    font-family: 'BenjaminFranklin';
    src: url('@/assets/BenjaminFranklin.ttf') format('opentype');
    font-weight: normal;
    font-style: normal;
  }
  
  /* Positionnement similaire au bouton Infinite, placé à côté du titre */
  .explorer-mode-button {
    position: absolute;
    bottom: -15px;
    background: none;
    left: 780px;
    border: none !important;
    cursor: pointer;
    padding: 0;
    margin: 0;
    width: 150px;
    transition: all 0.3s ease;
    filter: drop-shadow(0 0 2px rgba(48, 73, 104, 0.1));
    outline: 0 !important;
    box-shadow: none !important;
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  .explorer-mode-button:focus,
  .explorer-mode-button:active,
  .explorer-mode-button:focus-visible {
    outline: 0 !important;
    border: none !important;
    box-shadow: none !important;
    background: none !important;
  }
  
  .explorer-mode-button:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 0 12px rgba(48, 73, 104, 0.7));
  }
  
  .explorer-mode-button:hover .glow-border {
    stroke-width: 3;
    stroke: #5a7294;
  }
  
  .explorer-mode-button:hover .glow-effect {
    opacity: 0.5;
  }
  
  .explorer-mode-button:hover .explorer-text {
    fill: #b8d4f5;
    transition: fill 0.3s ease;
  }
  
  .explorer-mode-button:active {
    transform: scale(0.95);
    filter: drop-shadow(0 0 4px rgba(48, 73, 104, 0.3));
  }
  
  .explorer-mode-button::before {
    content: var(--content);
    display: none;
  }
  
  .explorer-text {
    transition: fill 0.3s ease;
  }
  
  *:focus {
    outline: none !important;
    box-shadow: none !important;
    -webkit-tap-highlight-color: transparent;
    -moz-tap-highlight-color: transparent;
  }
  </style>
  