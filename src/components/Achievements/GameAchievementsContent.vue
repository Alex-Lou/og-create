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
    // Initialiser les achievements
    this.processedAchievements = this.cloneAchievements(this.achievements);
    this.loadSavedAchievements();
    
    // Configurer les listeners d'événements
    this.setupEventListeners();
  },
  
  beforeUnmount() {
    // Nettoyer les listeners d'événements
    this.cleanupEventListeners();
  },
  
  methods: {
    // Initialisation et gestion des événements
    setupEventListeners() {
      window.addEventListener('app-reloaded', this.handleAppReloaded);
      window.addEventListener('get-unlocked-achievements', this.handleGetUnlockedAchievements);
    },
    
    cleanupEventListeners() {
      window.removeEventListener('app-reloaded', this.handleAppReloaded);
      window.removeEventListener('get-unlocked-achievements', this.handleGetUnlockedAchievements);
    },
    
    // Clonage et gestion des achievements
    cloneAchievements(achievements) {
      return JSON.parse(JSON.stringify(achievements));
    },
    
    // Chargement des achievements sauvegardés
    async loadSavedAchievements() {
      this.isLoading = true;
      
      try {
        // Délai court pour assurer la synchronisation
        await this.shortDelay(100);
        await this.fetchAchievementsFromService();
        
        // Synchroniser l'état des achievements
        this.syncAchievementsState();
        
        // Notifier que les achievements sont chargés
        this.notifyAchievementsLoaded();
      } 
      catch (error) {
        console.error("Erreur lors du chargement des succès:", error);
      } 
      finally {
        this.isLoading = false;
      }
    },
    
    async shortDelay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
    
    async fetchAchievementsFromService() {
  if (authService.isAuthenticated()) {
    try {
      const progress = await progressService.loadProgress();
      
      if (progress && progress.achievements) {
        // Vérifier si les achievements sont sous forme de chaîne et les parser si nécessaire
        if (typeof progress.achievements === 'string') {
          try {
            this.savedAchievements = JSON.parse(progress.achievements);
          } catch (e) {
            console.error("Erreur lors du parsing des achievements:", e);
            this.savedAchievements = {};
          }
        } else {
          this.savedAchievements = progress.achievements;
        }
        
        console.log("Achievements chargés:", this.savedAchievements);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des achievements:", error);
      this.savedAchievements = {};
    }
  }
},
    
    notifyAchievementsLoaded() {
      // Émettre un événement local
      this.$emit('achievements-loaded', this.processedAchievements);
      
      // Dispatcher un événement global
      window.dispatchEvent(new CustomEvent('achievements-loaded', {
        detail: { achievements: this.processedAchievements }
      }));
    },
    
    // Gestion des événements globaux
    handleGetUnlockedAchievements(event) {
      const unlockedAchievements = this.processedAchievements.filter(a => a.unlocked);
      
      if (event.detail && typeof event.detail.callback === 'function') {
        event.detail.callback(unlockedAchievements);
      }
    },
    
    handleAppReloaded() {
      setTimeout(() => this.loadSavedAchievements(), 200);
    },
    
    handleForceReload(loadedData) {
      if (loadedData && loadedData.achievements) {
        this.updateAchievementsFromLoadedData(loadedData);
      }
      
      this.$emit('achievements-updated', this.processedAchievements);
    },
    
    updateAchievementsFromLoadedData(loadedData) {
      this.processedAchievements = this.processedAchievements.map(achievement => {
        const loadedAchievement = loadedData.achievements.find(
          a => this.normalizeName(a.name) === this.normalizeName(achievement.name)
        );
        
        return {
          ...achievement,
          unlocked: loadedAchievement ? loadedAchievement.unlocked : achievement.unlocked
        };
      });
      
      if (Object.keys(loadedData.achievements).length > 0) {
        this.savedAchievements = loadedData.achievements;
      }
    },
    
    // Synchronisation et vérification des états des achievements
    syncAchievementsState() {
      this.processedAchievements = this.achievements.map(achievement => {
        return {
          ...achievement,
          unlocked: this.isAchievementUnlocked(achievement.name)
        };
      });
    },
    
    getAchievementKey(name) {
      return Object.keys(this.savedAchievements).find(key => 
        this.normalizeName(key) === this.normalizeName(name)
      );
    },
    
    isAchievementUnlocked(achievementName) {
  if (!authService.isAuthenticated()) {
    return this.localUnlockedAchievements[achievementName]?.unlocked || false;
  }
  
  // Vérifier si l'achievement existe directement dans savedAchievements
  if (this.savedAchievements[achievementName] && this.savedAchievements[achievementName].unlocked) {
    return true;
  }
  
  // Essayer avec la méthode de normalisation si la recherche directe échoue
  const key = this.getAchievementKey(achievementName);
  return key ? this.savedAchievements[key].unlocked : false;
},
    
    // Utilitaires et gestion de l'interface
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
    
    // Sauvegarde des achievements
    async saveAchievement(achievement) {
      if (!authService.isAuthenticated()) {
        this.saveAchievementLocally(achievement);
        return;
      }
      
      try {
        await this.saveAchievementToService(achievement);
      } catch (error) {
        console.error("Error saving achievement:", error);
      }
    },
    
    saveAchievementLocally(achievement) {
      this.localUnlockedAchievements[achievement.name] = {
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
    },
    
    async saveAchievementToService(achievement) {
      const achievementData = {
        name: achievement.name,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };

      await progressService.saveAchievement(achievementData);
      
      this.savedAchievements[achievement.name] = achievementData;
      
      // Mise à jour dans les processedAchievements
      this.updateProcessedAchievement(achievement.name);
      
      this.$emit('achievement-saved', achievement);
    },
    
    updateProcessedAchievement(achievementName) {
      const index = this.processedAchievements.findIndex(a => 
        this.normalizeName(a.name) === this.normalizeName(achievementName)
      );
      
      if (index !== -1) {
        this.processedAchievements[index].unlocked = true;
      }
    },
    
    // Traitement des nouveaux achievements débloqués
    processNewUnlockedAchievements(achievements) {
      achievements.forEach(achievement => {
        if (achievement.unlocked) {
          if (authService.isAuthenticated() && !this.isAchievementUnlocked(achievement.name)) {
            this.saveAchievement(achievement);
          } else if (!authService.isAuthenticated()) {
            this.saveAchievementLocally(achievement);
          }
        }
      });
    }
  },
  
  watch: {
    achievements: {
      immediate: true,
      deep: true,
      handler(newAchievements) {
        // Mettre à jour les achievements traités
        this.processedAchievements = this.cloneAchievements(newAchievements);
        this.syncAchievementsState();
        
        // Traiter les nouveaux achievements débloqués
        this.processNewUnlockedAchievements(newAchievements);
      }
    },
    
    forceReload: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.loadSavedAchievements();
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