<template>
  <div
    id="achievements-menu-container"
    @mouseover="isHovered = true"
    @mouseleave="handleMouseLeave"
  >
    <!-- Liste des succès, visible uniquement au survol -->
    <div 
      id="achievements-content" 
      v-if="isHovered || isListHovered"
      @mouseenter="isListHovered = true"
      @mouseleave="isListHovered = false"
    >
      <ul>
        <li v-for="(achievement, index) in achievements"
            :key="index"
            :class="{ unlocked: achievement.unlocked }">
          <img v-if="achievement.image"
               :src="achievement.image"
               alt=""
               class="achievement-icon" />
          {{ achievement.name }} - {{ achievement.description }}
        </li>
      </ul>
    </div>
    <!-- Menu principal -->
    <div id="achievements-menu" :class="{ expanded: isHovered }">
      <img src="@/assets/Svgs/Trophy.png" alt="Trophy Icon" class="menu-icon" />
      <span v-if="isHovered">Succès</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GameAchievementsContent",
  props: {
    achievements: {
      type: Array,
      required: true,
      default: () => [] // Par défaut, une liste vide
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
      // Délai pour permettre le survol de la liste
      setTimeout(() => {
        if (!this.isListHovered) {
          this.isHovered = false;
        }
      }, 100);
    }
  }
};
</script>

<style scoped>
@import "@/assets/SuccessContentStyle.css";
</style>