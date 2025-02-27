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
      localUnlockedAchievements: {}
    };
  },
  async created() {
    if (authService.isAuthenticated()) {
      await this.loadSavedAchievements();
    }
  },
  methods: {
    async loadSavedAchievements() {
      try {
        const progress = await progressService.loadProgress();
        console.log("Progress loaded:", progress);
        
        if (progress && progress.achievements) {
          this.savedAchievements = progress.achievements;
          this.syncAchievementsState();
        }
      } catch (error) {
        console.error("Erreur lors du chargement des succès:", error);
      }
    },

    handleForceReload(loadedData) {
    // Synchroniser les achievements avec les données chargées
    if (loadedData.achievements) {
      this.processedAchievements = this.processedAchievements.map(achievement => {
        const loadedAchievement = loadedData.achievements.find(
          a => this.normalizeName(a.name) === this.normalizeName(achievement.name)
        );
        
        return {
          ...achievement,
          unlocked: loadedAchievement ? loadedAchievement.unlocked : achievement.unlocked
        };
      });
    }
  },

    syncAchievementsState() {
      // Met à jour l'état de déblocage de tous les achievements
      this.achievements.forEach(achievement => {
        achievement.unlocked = this.isAchievementUnlocked(achievement.name);
      });
    },

    getAchievementKey(name) {
      // Cherche le nom exact de l'achievement dans la BDD
      return Object.keys(this.savedAchievements).find(key => 
        this.normalizeName(key) === this.normalizeName(name)
      );
    },

    isAchievementUnlocked(achievementName) {
      if (!authService.isAuthenticated()) return false;

      const key = this.getAchievementKey(achievementName);
      return key ? this.savedAchievements[key].unlocked : false;
    },

    normalizeName(name) {
      return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Enlève les accents
        .replace(/[^a-z0-9]+/g, "") // Garde uniquement les lettres et chiffres
        .trim();
    },

    handleMouseLeave() {
      setTimeout(() => {
        if (!this.isListHovered) {
          this.isHovered = false;
        }
      }, 100);
    },

    async saveAchievement(achievement) {
      if (!authService.isAuthenticated()) return;

      try {
        const achievementData = {
          name: achievement.name,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };

        await progressService.saveAchievement(achievementData);
        this.savedAchievements[achievement.name] = achievementData;
        achievement.unlocked = true;
        
        this.$emit('achievement-saved', achievement);
      } catch (error) {
        console.error("Error saving achievement:", error);
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
            if (achievement.unlocked && !this.isAchievementUnlocked(achievement.name)) {
              this.saveAchievement(achievement);
            }
          });
        } else {
          newAchievements.forEach(achievement => {
            if (achievement.unlocked) {
              this.localUnlockedAchievements[achievement.name] = {
                unlocked: true,
                unlockedAt: new Date().toISOString()
              };
            }
          });
        }
      }
    },
    savedAchievements: {
      deep: true,
      handler() {
        this.syncAchievementsState();
      }
    }
  }
};
</script>

<style scoped>
@import "@/assets/SuccessContentStyle.css";
</style>