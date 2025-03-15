<template>
  <div v-if="isVisible" class="map-transition-modal">
    <div class="transition-content">
      <!-- Cadre décoratif avec coins ornementés -->
      <div class="transition-frame">
        <div class="frame-corner corner-tl">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-tl">✧</div>
        </div>
        <div class="frame-corner corner-tr">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-tr">✧</div>
        </div>
        <div class="frame-corner corner-bl">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-bl">✧</div>
        </div>
        <div class="frame-corner corner-br">
          <div class="corner-dot"></div>
          <div class="frame-symbol symbol-br">✧</div>
        </div>
      </div>
      
      <!-- En-tête avec animation de victoire -->
      <div class="transition-header">
        <div class="victory-animation">
          <!-- Particules de célébration -->
          <div class="victory-particles">
            <div class="victory-particle" v-for="n in 8" :key="n"
                :style="{
                  '--x': `${Math.random() * 100 - 50}px`,
                  '--y': `${Math.random() * 100 - 50}px`,
                  '--dx': `${Math.random() * 150 - 75}px`,
                  '--dy': `${Math.random() * 150 - 75}px`,
                  'animation-delay': `${Math.random() * 3}s`
                }">
            </div>
          </div>
          
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
import '@/assets/ComponentsStyle/ExplorerStyle/MapTransitionModalStyle.css';

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