<template>
  <div v-if="isVisible" class="map-transition-modal">
    <div class="transition-content">
      <!-- En-tête avec animation de victoire -->
      <div class="transition-header">
        <div class="victory-animation">
          <div class="victory-effect">
            <span class="victory-star">⭐</span>
            <span class="victory-text">VICTOIRE!</span>
          </div>
        </div>
        <h1 class="transition-title">Nouvelle Région Découverte!</h1>
      </div>
  
      <!-- Corps du message narratif -->
      <div class="transition-message">
        <p class="narrative">
          Félicitations, aventurier! Après avoir vaincu {{ effectiveBossName }}, un nouveau territoire s'ouvre à vous. 
          Cette terre inexplorée regorge de mystères et de défis qui attendent votre expertise en alchimie élémentaire.
        </p>
          
        <!-- Affichage de la nouvelle carte -->
        <div class="new-map-preview">
          <img 
            :src="mapPreviewImage" 
            alt="Nouvelle carte" 
            class="map-preview-img" 
          />
          <div class="map-name">{{ mapName }}</div>
        </div>
          
        <p class="quest-teaser">
          De nouveaux alliés vous attendent, et de nouvelles combinaisons d'éléments seront nécessaires pour surmonter les obstacles sur votre chemin.
        </p>
      </div>
  
      <!-- Récompenses et bonus spéciaux -->
      <div class="special-rewards">
        <h3>Récompenses Spéciales</h3>
        <div class="rewards-grid">
          <div class="reward-item">
            <span class="reward-icon">💰</span>
            <span class="reward-value">{{ safeRewards.coins }} Pièces</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">✨</span>
            <span class="reward-value">{{ safeRewards.xp }} XP</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">⚡</span>
            <span class="reward-value">{{ safeRewards.energy }} Énergie</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">🗺️</span>
            <span class="reward-value">Nouvelle région débloquée!</span>
          </div>
        </div>
      </div>
  
      <!-- Bouton pour continuer -->
      <button @click="continueToNewMap" class="continue-btn">
        Explorer la nouvelle région
      </button>
    </div>
  </div>
</template>
  
<script>
import explorerService from '@/services/explorerService';

export default {
  name: 'MapTransitionModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    bossName: {
      type: String,
      default: null
    },
    oldMapId: {
      type: Number,
      default: null
    },
    newMapId: {
      type: Number,
      default: null
    },
    rewards: {
      type: Object,
      default: () => ({ coins: 0, xp: 0, energy: 0 })
    }
  },
  data() {
    return {
      mapInfo: null,
      regionsCache: {},
      isLoading: true
    };
  },
  computed: {
    // S'assurer que les récompenses sont toujours valides, même si props.rewards est null
    safeRewards() {
      return this.rewards || { coins: 0, xp: 0, energy: 0 };
    },
    
    effectiveBossName() {
      // Utiliser le boss passé en prop, ou chercher dans les données de la région actuelle
      if (this.bossName) {
        return this.bossName;
      }
      
      // Chercher la région du boss dans les régions de la carte précédente
      if (this.oldMapId && this.regionsCache[this.oldMapId]) {
        const bossRegion = this.regionsCache[this.oldMapId].find(r => r.is_boss);
        if (bossRegion) {
          return bossRegion.name;
        }
      }
      
      // Si aucun nom de boss n'est trouvé, renvoyer une valeur générique basée sur la carte
      const prevMapName = this.getMapNameById(this.oldMapId);
      return `Gardien de ${prevMapName || 'ce territoire'}`;
    },
    
    mapPreviewImage() {
      // Récupérer le mapId, ou utiliser la première carte disponible si aucune n'est spécifiée
      const mapId = this.newMapId || this.getFirstAvailableMapId();
      
      try {
        // Récupérer d'abord l'image depuis les données de la région si disponible
        const regions = this.regionsCache[mapId] || [];
        const defaultRegion = regions.find(r => r.is_default) || regions[0];
        
        if (defaultRegion && defaultRegion.image_path) {
          // Vérifier si l'image_path est une URL ou un chemin relatif
          if (defaultRegion.image_path.startsWith('http')) {
            return defaultRegion.image_path;
          } else {
            // Essayer de charger depuis les assets
            return require(`@/assets/${defaultRegion.image_path}`);
          }
        }
        
        // Fallback sur la convention de nommage standard
        return require(`@/assets/maps/world-map${mapId > 1 ? mapId : ''}.png`);
      } catch (e) {
        console.error(`Impossible de charger l'image pour la map ${mapId}:`, e);
        // Dernière solution de secours
        try {
          return require('@/assets/maps/default-map.png');
        } catch (e2) {
          return require('@/assets/maps/world-map.png');
        }
      }
    },
    
    mapName() {
      // Première source : mapInfo chargé depuis le service
      if (this.mapInfo && this.mapInfo.name) {
        return this.mapInfo.name;
      }
      
      // Deuxième source : explorer la liste des régions du parent
      const regions = this.$parent?.regions || [];
      if (regions.length > 0) {
        // Chercher une région par défaut dans la carte cible
        const defaultRegion = regions.find(r => r.is_default && r.map_id === this.newMapId);
        if (defaultRegion) {
          return defaultRegion.name;
        }
        
        // Sinon, prendre la première région de la carte cible
        const firstRegionInNewMap = regions.find(r => r.map_id === this.newMapId);
        if (firstRegionInNewMap) {
          return firstRegionInNewMap.name;
        }
      }
      
      // Troisième source : cache local des régions
      if (this.regionsCache[this.newMapId]) {
        const mapRegions = this.regionsCache[this.newMapId];
        
        // Chercher une région par défaut
        const defaultRegion = mapRegions.find(r => r.is_default);
        if (defaultRegion) {
          return defaultRegion.name;
        }
        
        // Sinon, prendre la première région
        if (mapRegions.length > 0) {
          return mapRegions[0].name;
        }
      }
      
      // Fallback générique sans hardcoding
      return `Nouvelle région ${this.newMapId}`;
    }
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.loadMapInfo();
      }
    },
    newMapId(newValue) {
      if (newValue && this.isVisible) {
        this.loadMapInfo();
      }
    }
  },
  methods: {
    async loadMapInfo() {
      if (!this.newMapId) return;
      
      this.isLoading = true;
      
      try {
        // Si les données sont déjà dans le cache, pas besoin de réinterroger l'API
        if (!this.regionsCache[this.newMapId]) {
          // Utiliser la route existante pour récupérer les régions de cette carte
          const regions = await explorerService.getRegions(this.newMapId);
          
          if (regions && regions.length > 0) {
            // Mettre en cache les données pour une utilisation future
            this.regionsCache[this.newMapId] = regions;
            
            // Chercher une région par défaut
            const defaultRegion = regions.find(r => r.is_default);
            
            // Ou prendre la première région
            const firstRegion = regions[0];
            
            const selectedRegion = defaultRegion || firstRegion;
            
            if (selectedRegion) {
              this.mapInfo = {
                id: this.newMapId,
                name: selectedRegion.name,
                description: selectedRegion.description || `Explorez les mystères de ${selectedRegion.name}`
              };
            }
          }
        } else {
          // Utiliser les données du cache
          const regions = this.regionsCache[this.newMapId];
          const defaultRegion = regions.find(r => r.is_default) || regions[0];
          
          if (defaultRegion) {
            this.mapInfo = {
              id: this.newMapId,
              name: defaultRegion.name,
              description: defaultRegion.description || `Explorez les mystères de ${defaultRegion.name}`
            };
          }
        }
      } catch (error) {
        console.error(`Erreur lors du chargement des informations pour la carte ${this.newMapId}:`, error);
      } finally {
        this.isLoading = false;
      }
    },
    
    // Préchargement de toutes les cartes disponibles
    async preloadAllMaps() {
      try {
        // Utiliser la route existante pour récupérer toutes les régions (sans filtre de map_id)
        const allRegions = await explorerService.getRegions();
        
        if (allRegions && allRegions.length > 0) {
          // Organiser les régions par map_id
          const mapGroups = {};
          
          allRegions.forEach(region => {
            if (region.map_id) {
              if (!mapGroups[region.map_id]) {
                mapGroups[region.map_id] = [];
              }
              mapGroups[region.map_id].push(region);
            }
          });
          
          // Mettre à jour le cache
          this.regionsCache = mapGroups;
        }
      } catch (error) {
        console.error('Erreur lors du préchargement des cartes:', error);
      }
    },
    
    getFirstAvailableMapId() {
      // Récupérer le premier mapId disponible dans le cache
      const mapIds = Object.keys(this.regionsCache).map(Number).sort((a, b) => a - b);
      return mapIds.length > 0 ? mapIds[0] : 1;
    },
    
    getMapNameById(mapId) {
      if (!mapId) return '';
      
      // Chercher dans le cache des régions
      const regions = this.regionsCache[mapId] || [];
      const defaultRegion = regions.find(r => r.is_default);
      
      if (defaultRegion) {
        return defaultRegion.name;
      }
      
      // Prendre la première région disponible
      if (regions.length > 0) {
        return regions[0].name;
      }
      
      // Si aucune information n'est disponible
      return `Région ${mapId}`;
    },
    
    continueToNewMap() {
      console.log("Émission de l'événement continue-to-new-map avec mapId:", this.newMapId);
      this.$emit('continue-to-new-map', this.newMapId);
    }
  },
  async created() {
    // Précharger toutes les cartes au démarrage du composant
    await this.preloadAllMaps();
    
    if (this.isVisible && this.newMapId) {
      this.loadMapInfo();
    }
  }
};
</script>
  
<style scoped>
.map-transition-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-in-out;
}
.transition-content {
  background-color: #2c3e50;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 223, 0, 0.6);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  color: #ecf0f1;
  border: 3px solid #f39c12;
  position: relative;
}
.transition-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}
.victory-animation {
  margin: 0 auto 20px;
  text-align: center;
}
.victory-effect {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 1s ease infinite alternate;
}
.victory-star {
  font-size: 48px;
  color: #f1c40f;
  text-shadow: 0 0 15px rgba(241, 196, 15, 0.8);
  margin-bottom: 10px;
  animation: rotate 3s linear infinite;
}
.victory-text {
  font-size: 32px;
  font-weight: bold;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.8);
  letter-spacing: 2px;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}
.transition-title {
  font-size: 2.5rem;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  margin: 0;
  animation: pulse 2s infinite;
}
.transition-message {
  margin: 30px 0;
  font-size: 1.1rem;
  line-height: 1.6;
}
.narrative {
  text-align: center;
  margin-bottom: 20px;
}
.new-map-preview {
  position: relative;
  margin: 30px auto;
  text-align: center;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  max-width: 600px;
}
.map-preview-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transition: transform 0.5s ease;
}
.map-preview-img:hover {
  transform: scale(1.03);
}
.map-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: #fff;
  padding: 15px;
  font-size: 1.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}
.quest-teaser {
  text-align: center;
  font-style: italic;
  color: #bdc3c7;
  margin-top: 20px;
}
.special-rewards {
  background-color: rgba(52, 73, 94, 0.7);
  border-radius: 8px;
  padding: 20px;
  margin: 30px 0;
}
.special-rewards h3 {
  text-align: center;
  color: #e67e22;
  margin-top: 0;
  font-size: 1.5rem;
}
.rewards-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}
.reward-item {
  background-color: rgba(44, 62, 80, 0.7);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 0 40%;
  min-width: 180px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}
.reward-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}
.reward-icon {
  font-size: 24px;
  min-width: 30px;
  text-align: center;
}
.reward-value {
  font-weight: bold;
  font-size: 1.1rem;
}
.continue-btn {
  display: block;
  margin: 30px auto 0;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}
.continue-btn:hover {
  background-color: #c0392b;
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(231, 76, 60, 0.6);
}
.continue-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse {
  0% { text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
  50% { text-shadow: 0 0 20px rgba(241, 196, 15, 0.8), 0 0 30px rgba(241, 196, 15, 0.3); }
  100% { text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
}
@media (max-width: 768px) {
  .transition-title {
    font-size: 2rem;
  }
  .reward-item {
    flex: 1 0 100%;
  }
}
</style>