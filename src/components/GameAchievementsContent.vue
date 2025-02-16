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
            :class="{ unlocked: isAchievementUnlocked(achievement.name) }">
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
      savedAchievements: {},
      savedAchievementIds: [],
      localUnlockedAchievements: {}
    };
  },
  async created() {
    // Charger les achievements sauvegardés si connecté
    if (authService.isAuthenticated()) {
      await this.loadSavedAchievements();
    }
  },
  watch: {
    achievements: {
      immediate: true,
      deep: true,
      handler(newAchievements) {
        if (authService.isAuthenticated()) {
          // Logique pour utilisateurs connectés
          newAchievements.forEach(achievement => {
            if (achievement.unlocked && !this.isAchievementUnlocked(achievement.name)) {
              this.saveAchievement(achievement);
            }
          });
        } else {
          // Logique pour utilisateurs non connectés
          newAchievements.forEach(achievement => {
            if (achievement.unlocked) {
              // Simplement ajouter en mémoire
              this.localUnlockedAchievements[achievement.name] = {
                unlocked: true,
                unlockedAt: new Date().toISOString()
              };
            }
          });
        }
      }
    }
  },
  methods: {
    async loadSavedAchievements() {
      try {
        const progress = await progressService.loadProgress();
        if (progress && progress.achievements) {
          this.savedAchievements = progress.achievements;
          this.savedAchievementIds = Object.keys(this.savedAchievements);
          
          // Mettre à jour l'état des achievements
          this.achievements.forEach(achievement => {
            achievement.unlocked = this.isAchievementUnlocked(achievement.name);
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des succès:", error);
      }
    },

    isAchievementUnlocked(achievementName) {
      // Si connecté, vérifier dans les succès sauvegardés
      if (authService.isAuthenticated()) {
        const normalizedName = achievementName.replace(/\s+/g, ' ').trim().toLowerCase();
        const matchingKey = Object.keys(this.savedAchievements).find(
          key => key.replace(/\s+/g, ' ').trim().toLowerCase() === normalizedName
        );

        return matchingKey 
          ? this.savedAchievements[matchingKey].unlocked 
          : false;
      } 
      // Si non connecté, vérifier dans les succès locaux
      else {
        const normalizedName = achievementName.replace(/\s+/g, ' ').trim().toLowerCase();
        const matchingKey = Object.keys(this.localUnlockedAchievements).find(
          key => key.replace(/\s+/g, ' ').trim().toLowerCase() === normalizedName
        );

        return matchingKey ? this.localUnlockedAchievements[matchingKey].unlocked : false;
      }
    },

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
        
        // Mettre à jour directement savedAchievements
        this.savedAchievements[achievement.name] = {
          unlocked: true,
          unlockedAt: achievementData.unlockedAt
        };

        if (!this.savedAchievementIds.includes(achievement.name)) {
          this.savedAchievementIds.push(achievement.name);
        }
        
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