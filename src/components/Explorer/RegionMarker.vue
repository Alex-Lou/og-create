<template>
  <div 
    class="region-marker" 
    :class="markerClasses" 
    :style="markerStyle"
    @click="$emit('region-click')"
  >
    <!-- Icône spécifique pour les boss -->
    <img 
      v-if="region.is_boss"
      src="@/assets/Svgs/map-boss-icon.png" 
      alt="Boss" 
      class="boss-icon"
    />
    
    <!-- SVG pour régions en cours (point d'interrogation) -->
    <svg 
      v-else-if="isUnlocked && !region.completed"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 30 30" 
      width="30" 
      height="30" 
      style="position: absolute; top: 0; left: 0;"
    >
      <circle cx="15" cy="15" r="14" fill="#FFD700" stroke="#B8860B" stroke-width="2"/>
      <text x="15" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#8B4513">
        ?
      </text>
    </svg>
    
    <!-- SVG pour régions complétées (coche verte) -->
    <svg 
      v-if="region.completed"
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 30 30" 
      width="30" 
      height="30" 
      style="position: absolute; top: 0; left: 0;"
    >
      <circle cx="15" cy="15" r="14" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
      <path d="M9 15 L13 19 L21 11" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    
    <div class="region-name">{{ region.name }}</div>
    
    <!-- SVG pour régions verrouillées (cadenas) -->
    <div class="region-lock" v-if="!isUnlocked">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        width="24" 
        height="24"
        style="fill: #FF6B6B; stroke: #FF4757; stroke-width: 1.5;"
      >
        <path d="M12 2C8.692 2 6 4.692 6 8v2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-2V8c0-3.308-2.692-6-6-6zm4 10H8V8c0-2.206 1.794-4 4-4s4 1.794 4 4v4zm-4-4c-1.103 0-2 .897-2 2v4h4V8c0-1.103-.897-2-2-2z"/>
      </svg>
    </div>
  </div>
</template>

<script>
import '@/assets/ComponentsStyle/ExplorerStyle/RegionMakerStyle.css';

export default {
  name: 'RegionMarker',
  props: {
    region: {
      type: Object,
      required: true
    },
    isUnlocked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    markerClasses() {
      return {
        'visited': this.region.visited, 
        'completed': this.region.completed,
        'locked': !this.isUnlocked,
        'partially-completed': this.region.partiallyCompleted,
        'boss-region': this.region.is_boss
      };
    },
    markerStyle() {
      const x = this.region.position_x || 50;
      const y = this.region.position_y || 50;
      
      return {
        left: `${x}%`,
        top: `${y}%`,
        display: 'block',
        zIndex: 10
      };
    }
  }
}
</script>
