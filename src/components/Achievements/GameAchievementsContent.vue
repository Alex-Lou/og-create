<template>
  <div
    id="achievements-menu-container"
    @mouseover="isHovered = true"
    @mouseleave="handleMouseLeave"
  >
    <div 
      id="achievements-content" 
      v-if="isHovered || isListHovered"
      @mouseenter="isListHovered = true"
      @mouseleave="isListHovered = false"
    >
      <!-- Cadre décoratif pour le contenu -->
      <div class="content-frame">
        <div class="frame-corner corner-tl"><div class="corner-dot"></div></div>
        <div class="frame-corner corner-tr"><div class="corner-dot"></div></div>
      </div>
      
      <!-- Effet d'étoiles -->
      <div class="achievements-star-field">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
      </div>
      
      <ul>
        <li v-for="achievement in achievements"
            :key="achievement.name"
            :class="{ unlocked: achievement.unlocked }">
          <img v-if="achievement.image"
               :src="achievement.image"
               alt=""
               class="achievement-icon" />
          {{ achievement.name }} - {{ achievement.description }}
        </li>
      </ul>
    </div>
    
    <div id="achievements-menu" :class="{ expanded: isHovered }">
      <!-- Cadre décoratif pour le bouton -->
      <div class="menu-frame">
        <div class="frame-corner corner-tl"><div class="corner-dot"></div></div>
        <div class="frame-corner corner-tr"><div class="corner-dot"></div></div>
        <div class="frame-corner corner-bl"><div class="corner-dot"></div></div>
        <div class="frame-corner corner-br"><div class="corner-dot"></div></div>
      </div>
      
      <img src="@/assets/Svgs/Trophy.png" alt="Trophy Icon" class="menu-icon" />
      <span v-if="isHovered">Succès</span>
    </div>
  </div>
</template>

<script>
import "@/assets/ComponentsStyle/AchievementsStyle/SuccessContentStyle.css";

// Liste des succès (affichage seul : App possède l'état et la vérification)
export default {
  name: "GameAchievementsContent",
  props: {
    achievements: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isHovered: false,
      isListHovered: false
    };
  },
  methods: {
    handleMouseLeave() {
      setTimeout(() => {
        if (!this.isListHovered) {
          this.isHovered = false;
        }
      }, 100);
    }
  }
};
</script>