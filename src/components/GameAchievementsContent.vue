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
import progressService from '@/services/progressService';
import authService from '@/services/authService';

export default {
  name: "GameAchievementsContent",
  props: {
    achievements: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      isHovered: false,
      isListHovered: false,
      savedAchievementIds: []
    };
  },
  async created() {
    if (authService.isAuthenticated()) {
      try {
        const progress = await progressService.loadProgress();
        if (progress && progress.achievements) {
          this.savedAchievementIds = Object.keys(progress.achievements);
          // Mettre à jour l'état des achievements en fonction des données sauvegardées
          this.achievements.forEach(achievement => {
            if (this.savedAchievementIds.includes(achievement.name)) {
              achievement.unlocked = true;
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des succès:", error);
      }
    }
  },
  watch: {
    achievements: {
      immediate: true,
      deep: true,
      handler(newAchievements) {
        if (authService.isAuthenticated()) {
          newAchievements.forEach(achievement => {
            if (achievement.unlocked && !this.savedAchievementIds.includes(achievement.name)) {
              this.saveAchievement(achievement);
            }
          });
        }
      }
    }
  },
  methods: {
    handleMouseLeave() {
      setTimeout(() => {
        if (!this.isListHovered) {
          this.isHovered = false;
        }
      }, 100);
    },
    async saveAchievement(achievement) {
      if (!authService.isAuthenticated()) {
        console.log('Utilisateur non connecté, impossible de sauvegarder le succès');
        return;
      }

      try {
        const achievementData = {
          name: achievement.name,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };

        await progressService.saveAchievement(achievementData);
        this.savedAchievementIds.push(achievement.name);
        this.$emit('achievement-saved', achievement);
      } catch (error) {
        console.error("Erreur lors de l'enregistrement du succès :", error);
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/SuccessContentStyle.css";
</style>