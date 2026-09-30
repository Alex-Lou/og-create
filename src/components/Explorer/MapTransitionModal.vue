<template>
  <GModal
    v-if="isVisible"
    :width="560"
    align="center"
    :dismissible="false"
    label="Nouvelle carte"
  >
    <div class="xt">
      <span class="g-mono g-gold">Gardien vaincu</span>
      <h2 class="g-title xt__title">{{ mapName }} s'ouvre</h2>
      <p class="g-italic xt__story">
        {{ effectiveBossName }} est vaincu. Au-delà, une nouvelle carte se dessine : d'autres alliés,
        d'autres alliages à découvrir.
      </p>

      <figure class="xt__preview">
        <img :src="mapPreviewImage" :alt="`Aperçu de la carte ${toRoman(newMapId)}`" class="xt__img" />
        <figcaption class="g-mono xt__caption">Carte {{ toRoman(newMapId) }} — {{ mapName }}</figcaption>
        <span v-if="isLoading" class="xt__spin" aria-hidden="true"></span>
      </figure>

      <dl class="xt__rewards">
        <div><dt class="g-mono">écus</dt><dd class="g-display g-gold">+{{ safeRewards.coins }}</dd></div>
        <div><dt class="g-mono">savoir</dt><dd class="g-display">+{{ safeRewards.xp }}</dd></div>
        <div><dt class="g-mono">souffle</dt><dd class="g-display">+{{ safeRewards.energy }}</dd></div>
        <div><dt class="g-mono">carte ouverte</dt><dd class="g-display">{{ toRoman(newMapId) }}</dd></div>
      </dl>

      <button type="button" class="g-btn" @click="continueToNewMap">Explorer la nouvelle carte</button>
    </div>
  </GModal>
</template>

<script>
// Seulement les images : un require(`@/assets/${…}`) embarquait aussi toutes les anciennes
// feuilles CSS du dossier dans le build de production (elles écrasaient la nouvelle interface)
const assetImages = require.context('@/assets', true, /\.(png|jpe?g|gif|webp|svg)$/);
import explorerService from '@/services/explorerService';
import GModal from '@/components/ui/GModal.vue';
import { toRoman } from './explorerFormat';

export default {
  name: 'MapTransitionModal',
  components: { GModal },
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
  emits: ['continue-to-new-map'],
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
            return assetImages(`./${defaultRegion.image_path}`);
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
    toRoman,

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
.xt {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}
.xt__title { font-size: 38px; }
.xt__story { margin: 0; font-size: 18px; line-height: 1.5; color: var(--oc-text); }
.xt__preview {
  position: relative;
  margin: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  max-height: 220px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px var(--oc-line-strong);
  background: var(--oc-surface-strong);
}
.xt__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.35) saturate(0.75) brightness(0.8);
}
.xt__caption {
  position: absolute;
  left: 12px;
  bottom: 10px;
  color: var(--oc-text);
  text-shadow: 0 1px 6px var(--oc-bg);
}
/* Indicateur d'attente pendant le chargement de la carte */
.xt__spin {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 12px;
  height: 12px;
  border: 1px solid var(--oc-line-strong);
  border-top-color: var(--oc-gold);
  animation: xt-spin 0.9s linear infinite;
}
@keyframes xt-spin {
  from { transform: rotate(45deg); }
  to { transform: rotate(405deg); }
}
.xt__rewards {
  margin: 4px 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.xt__rewards > div { display: flex; flex-direction: column-reverse; gap: 4px; }
.xt__rewards dd { margin: 0; font-size: 26px; line-height: 1.1; }

@media (max-width: 520px) {
  .xt__title { font-size: 30px; }
  .xt__rewards { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .xt .g-btn { align-self: stretch; }
}
</style>
