<template>
  <div class="craft-button" @click="$emit('click')">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
      <!-- Fond du bouton -->
      <rect x="50" y="50" width="300" height="100" rx="20" fill="#1a1d24" />
      
      <!-- Bordure lumineuse -->
      <rect x="55" y="55" width="290" height="90" rx="15" fill="none" stroke="#304968" stroke-width="2" class="glow-border"/>
      
      <!-- Texte CRAFT avec BenjaminFranklin -->
      <text 
        x="200" 
        y="115" 
        font-family="BenjaminFranklin, Arial" 
        font-size="40" 
        font-weight="bold" 
        fill="#D8D8D8"
        text-anchor="middle"
        letter-spacing="6"
        class="craft-text"
      >CRAFT</text>
      
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
  </div>
</template>

<script>
export default {
  name: 'CraftButton'
}
</script>

<style scoped>
@font-face {
  font-family: 'BenjaminFranklin';
  src: url('@/assets/BenjaminFranklin.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.craft-button {
  cursor: pointer;
  width: 170px;
  transition: all 0.3s ease;
  margin-top: -75px;
  margin-left: -30px;
  filter: drop-shadow(0 0 2px rgba(48, 73, 104, 0.1));
}

.craft-button:hover {
  transform: scale(1.05);
  filter: drop-shadow(0 0 8px rgba(48, 73, 104, 0.5));
}

.craft-button:hover .glow-border {
  stroke-width: 3;
  stroke: #3a5a82;
}

.craft-button:hover .glow-effect {
  opacity: 0.5;
}

.craft-button:hover .craft-text {
  fill: #ebebeb; /* Couleur plus claire au survol */
  transition: fill 0.3s ease;
}

.craft-button:active {
  transform: scale(0.95);
  filter: drop-shadow(0 0 4px rgba(48, 73, 104, 0.3));
}

.craft-text {
  transition: fill 0.3s ease;
}
</style>