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
        <div class="frame-corner corner-bl"><div class="corner-dot"></div></div>
        <div class="frame-corner corner-br"><div class="corner-dot"></div></div>
      </div>
      
      <!-- Effet d'étoiles -->
      <div class="achievements-star-field">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
      </div>
      
      <ul>
        <li v-for="(achievement, index) in processedAchievements"
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
import progressService from '@/services/progressService';
import authService from '@/services/authService';
import "@/assets/ComponentsStyle/AchievementsStyle/SuccessContentStyle.css";

export default {
  name: "GameAchievementsContent",
  props: {
    achievements: {
      type: Array,
      required: true,
      default: () => []
    },
    forceReload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isHovered: false,
      isListHovered: false,
      savedAchievements: {},
      localUnlockedAchievements: {},
      processedAchievements: [],
      isLoading: true
    };
  },
  created() {
    // Cloner les achievements initiaux dans les achievements traités
    this.processedAchievements = JSON.parse(JSON.stringify(this.achievements));
    
    // Charger les achievements sauvegardés dès la création du composant
    this.loadSavedAchievements();
    
    // Écouter l'événement de rechargement global
    window.addEventListener('app-reloaded', this.handleAppReloaded);
    
    // Écouter l'événement de demande des achievements débloqués
    window.addEventListener('get-unlocked-achievements', this.handleGetUnlockedAchievements);
  },
  beforeUnmount() {
    // Supprimer l'écouteur d'événements lors de la destruction du composant
    window.removeEventListener('app-reloaded', this.handleAppReloaded);
    
    // Supprimer l'écouteur de demande des achievements
    window.removeEventListener('get-unlocked-achievements', this.handleGetUnlockedAchievements);
  },
  methods: {
    async loadSavedAchievements() {
      this.isLoading = true;
      try {
        // Attendre un court délai pour s'assurer que d'autres composants sont prêts
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (authService.isAuthenticated()) {
          const progress = await progressService.loadProgress();
          console.log("Achievements progress loaded:", progress);
          
          if (progress && progress.achievements) {
            this.savedAchievements = progress.achievements;
          }
        }
        
        // Toujours synchroniser les états après le chargement
        this.syncAchievementsState();
      } catch (error) {
        console.error("Erreur lors du chargement des succès:", error);
      } finally {
        this.isLoading = false;
        
        // Émettre un événement pour signaler que les achievements sont prêts
        this.$emit('achievements-loaded', this.processedAchievements);
        
        // Dispatche un événement global pour informer les autres composants
        window.dispatchEvent(new CustomEvent('achievements-loaded', {
          detail: { achievements: this.processedAchievements }
        }));
      }
    },

    handleGetUnlockedAchievements(event) {
      // Récupérer tous les achievements marqués comme débloqués dans ce composant
      const unlockedAchievements = this.processedAchievements.filter(a => a.unlocked);
      
      // Appeler le callback avec la liste
      if (event.detail && typeof event.detail.callback === 'function') {
        event.detail.callback(unlockedAchievements);
      }
    },

    handleAppReloaded() {
      console.log("App reloaded event detected in GameAchievementsContent");
      // Recharger les achievements après un court délai
      setTimeout(() => this.loadSavedAchievements(), 200);
    },
    
    handleForceReload(loadedData) {
      console.log("Force reload called with data:", loadedData);
      
      // Synchroniser les achievements avec les données chargées
      if (loadedData && loadedData.achievements) {
        this.processedAchievements = this.processedAchievements.map(achievement => {
          const loadedAchievement = loadedData.achievements.find(
            a => this.normalizeName(a.name) === this.normalizeName(achievement.name)
          );
          
          return {
            ...achievement,
            unlocked: loadedAchievement ? loadedAchievement.unlocked : achievement.unlocked
          };
        });
        
        // Mettre à jour les achievements sauvegardés
        if (Object.keys(loadedData.achievements).length > 0) {
          this.savedAchievements = loadedData.achievements;
        }
      }
      
      // Émettre un événement pour indiquer que les achievements ont été mis à jour
      this.$emit('achievements-updated', this.processedAchievements);
    },

    syncAchievementsState() {
      console.log("Syncing achievements state with saved data");
      
      // Mettre à jour les achievements traités au lieu des achievements d'origine
      this.processedAchievements = this.achievements.map(achievement => {
        return {
          ...achievement,
          unlocked: this.isAchievementUnlocked(achievement.name)
        };
      });
      
      console.log("Processed achievements after sync:", this.processedAchievements);
    },

    getAchievementKey(name) {
      // Cherche le nom exact de l'achievement dans la BDD
      return Object.keys(this.savedAchievements).find(key => 
        this.normalizeName(key) === this.normalizeName(name)
      );
    },

    isAchievementUnlocked(achievementName) {
      if (!authService.isAuthenticated()) {
        // Si non authentifié, vérifier dans les achievements locaux
        return this.localUnlockedAchievements[achievementName]?.unlocked || false;
      }

      const key = this.getAchievementKey(achievementName);
      return key ? this.savedAchievements[key].unlocked : false;
    },

    normalizeName(name) {
      if (!name) return '';
      
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
      console.log("Tentative de sauvegarde achievement:", achievement.name);
      
      if (!authService.isAuthenticated()) {
        console.log("Sauvegarde locale car non authentifié");
        // Sauvegarder localement si non authentifié
        this.localUnlockedAchievements[achievement.name] = {
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };
        return;
      }

      try {
        const achievementData = {
          name: achievement.name,
          unlocked: true,
          unlockedAt: new Date().toISOString()
        };

        console.log("Appel au service pour sauvegarder:", achievementData);
        await progressService.saveAchievement(achievementData);
        console.log("Achievement sauvegardé avec succès");
        
        this.savedAchievements[achievement.name] = achievementData;
        
        // Mettre à jour dans les processedAchievements
        const index = this.processedAchievements.findIndex(a => 
          this.normalizeName(a.name) === this.normalizeName(achievement.name)
        );
        
        if (index !== -1) {
          this.processedAchievements[index].unlocked = true;
        }
        
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
        console.log("Achievements prop changed:", newAchievements);
        
        // Mettre à jour les achievements traités avec les nouveaux achievements
        this.processedAchievements = JSON.parse(JSON.stringify(newAchievements));
        
        // Synchroniser avec les données sauvegardées
        this.syncAchievementsState();
        
        // Traitement des achievements débloqués
        newAchievements.forEach(achievement => {
          if (achievement.unlocked) {
            if (authService.isAuthenticated() && !this.isAchievementUnlocked(achievement.name)) {
              this.saveAchievement(achievement);
            } else if (!authService.isAuthenticated()) {
              this.localUnlockedAchievements[achievement.name] = {
                unlocked: true,
                unlockedAt: new Date().toISOString()
              };
            }
          }
        });
      }
    },
    forceReload: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          console.log("Force reload prop changed to true");
          this.loadSavedAchievements();
        }
      }
    },
    savedAchievements: {
      deep: true,
      handler() {
        console.log("Saved achievements changed, syncing state");
        this.syncAchievementsState();
      }
    }
  }
};
</script>