<template>
  <div 
    id="achievements-menu-container"
    @mouseover="isHovered = true" 
    @mouseleave="isHovered = false"
  >
    <!-- Liste des succès, visible uniquement au survol -->
    <div id="achievements-content" v-if="isHovered && achievements.length > 0">
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
      isHovered: false
    };
  }
};
</script>

<style scoped>
@import "@/assets/SuccessContentStyle.css"; /* Import du fichier CSS */
</style>
