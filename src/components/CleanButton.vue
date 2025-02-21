<template>
  <button 
    class="reset-crafting-button" 
    style="--content: 'Clean';"
    @click="resetCraftingBoard"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
      <!-- Fond du bouton -->
      <rect x="50" y="50" width="300" height="100" rx="20" fill="#1a1d24" />
      
      <!-- Bordure lumineuse -->
      <rect x="55" y="55" width="290" height="90" rx="15" fill="none" stroke="#304968" stroke-width="2" class="glow-border"/>
      
      <!-- Texte CLEAN avec la nouvelle police -->
      <text 
        x="200" 
        y="115" 
        font-family="BenjaminFranklin, Arial" 
        font-size="40" 
        font-weight="bold" 
        fill="#2D96A4" 
        text-anchor="middle"
        letter-spacing="6"
        class="clean-text"
      >CLEAN</text>
      
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
  name: 'CleanButton',
  methods: {
    resetCraftingBoard() {
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

.reset-crafting-button {
  position: absolute;
  bottom: -20px;
  left: 865px;
  background: none;
  border: none !important;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 170px;
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

.reset-crafting-button:focus,
.reset-crafting-button:active,
.reset-crafting-button:focus-visible {
  outline: 0 !important;
  border: none !important;
  box-shadow: none !important;
  background: none !important;
}

.reset-crafting-button:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(48, 73, 104, 0.7));
}

.reset-crafting-button:hover .glow-border {
  stroke-width: 3;
  stroke: #5a7294;
}

.reset-crafting-button:hover .glow-effect {
  opacity: 0.5;
}

.reset-crafting-button:hover .clean-text {
  fill: #b8d4f5; /* Couleur plus claire au survol */
  transition: fill 0.3s ease;
}

.reset-crafting-button:active {
  transform: scale(0.95);
  filter: drop-shadow(0 0 4px rgba(48, 73, 104, 0.3));
}

.reset-crafting-button::before {
  content: var(--content);
  display: none;
}

.clean-text {
  transition: fill 0.3s ease;
}

*:focus {
  outline: none !important;
  box-shadow: none !important;
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
}
</style>