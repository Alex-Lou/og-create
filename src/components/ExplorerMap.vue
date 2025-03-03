<template>
  <div class="explorer-container">
    <!-- Affichage de l'énergie -->
    <div class="energy-info">
      <!-- Left side: Map Selector -->
      <div class="map-selector" v-if="unlockedMaps.length > 1">
        <span class="map-selector-label">Carte:</span>
        <select v-model="currentMapId" @change="changeMap" class="map-select">
          <option v-for="mapId in unlockedMaps" :key="mapId" :value="mapId">
            {{ getMapName(mapId) }}
          </option>
        </select>
      </div>

      <!-- Middle: Close Button with Tooltip -->
      <button 
        class="back-btn-explorer back-btn-explorer-tooltip" 
        @click="showExitConfirmationModal = true"
      >
        X
        <span class="tooltip">Quitter le mode Explorer</span>
      </button>

      <!-- Right side: Energy Display and Timer -->
      <div class="energy-timer-container">
        <div class="energy-timer" v-if="nextEnergyIn > 0">
          Recharge dans {{ formatTime(nextEnergyIn) }}
        </div>
        <div class="energy-display">
          <span class="energy-icon">⚡</span>
          <span class="energy-value">{{ energy }}/{{ maxEnergy }}</span>
        </div>
      </div>
    </div>
    
    <!-- Modal de confirmation de sortie -->
    <div 
      v-if="showExitConfirmationModal" 
      class="exit-confirmation-modal"
    >
      <div class="exit-confirmation-content">
        <h2>Confirmer la sortie</h2>
        <p>Êtes-vous sûr de vouloir quitter le mode Explorer ?</p>
        <div class="exit-confirmation-actions">
          <button 
            class="exit-confirmation-btn exit-confirmation-btn-yes"
            @click="confirmExit"
          >
            Oui
          </button>
          <button 
            class="exit-confirmation-btn exit-confirmation-btn-no"
            @click="showExitConfirmationModal = false"
          >
            Non
          </button>
        </div>
      </div>
    </div>
    
    <!-- Conteneur de la carte avec positions relatives -->
    <div class="map-container">
      <img :src="getCurrentMapImage()" alt="Carte d'exploration" class="map-image" />
      
      <!-- Points représentant les régions -->
      <div 
        v-for="region in regions" 
        :key="region.id"
        :class="['region-marker', { 
          'visited': region.visited, 
          'completed': region.completed,
          'locked': !isRegionUnlocked(region),
          'partially-completed': region.partiallyCompleted
        }]"
        :style="getRegionStyle(region)"
        @click="selectRegion(region)"
      >
        <!-- SVG pour régions en cours (point d'interrogation) -->
        <svg 
          v-if="isRegionUnlocked(region) && !region.completed"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 30 30" 
          width="30" 
          height="30" 
          style="position: absolute; top: 0; left: 0;"
        >
          <circle cx="15" cy="15" r="14" fill="#FFD700" stroke="#B8860B" stroke-width="2"/>
          <text x="15" y="22" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#8B4513">
            ?
          </text>
        </svg>
        
        <!-- SVG pour régions complétées (coche verte) -->
        <svg 
          v-if="region.completed"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 30 30" 
          width="30" 
          height="30" 
          style="position: absolute; top: 0; left: 0;"
        >
          <circle cx="15" cy="15" r="14" fill="#2ecc71" stroke="#27ae60" stroke-width="2"/>
          <path d="M9 15 L13 19 L21 11" stroke="white" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
        <div class="region-name">{{ region.name }}</div>
        
        <!-- SVG pour régions verrouillées (cadenas) -->
        <div class="region-lock" v-if="!isRegionUnlocked(region)">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            width="24" 
            height="24"
            style="fill: #FF6B6B; stroke: #FF4757; stroke-width: 1.5;"
          >
            <path d="M12 2C8.692 2 6 4.692 6 8v2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-8c0-1.103-.897-2-2-2h-2V8c0-3.308-2.692-6-6-6zm4 10H8V8c0-2.206 1.794-4 4-4s4 1.794 4 4v4zm-4-4c-1.103 0-2 .897-2 2v4h4V8c0-1.103-.897-2-2-2z"/>
          </svg>
        </div>
      </div>
    </div>
    
    <!-- Dialogue NPC -->
    <NpcDialog 
      v-if="showNpcDialog"
      :npcImage="currentNpc.image"
      :npcPosition="currentNpc.position || 'left'"
      :dialogContent="currentNpc.dialog"
      :regionData="selectedRegion"
      :actionButtonText="currentNpc.actionText"
      :energyCost="getCurrentEnergyCost()"
      :currentEnergy="energy"
      @close="closeNpcDialog"
      @action="startCraftChallenge"
    />

    <!-- Modal de Craft pour le mode Explorer -->
    <ExplorerCraftModal 
      v-if="showCraftModal"
      :isVisible="showCraftModal"
      :region="selectedRegion"
      :challenge="currentChallenge"
      :craftingRecipes="$parent.craftingRecipes"
      :elementEmojis="$parent.elementEmojis"
      :discoveredElements="$parent.discoveredElements"
      @close="closeCraftModal"
      @craft-success="handleCraftSuccess"
      @target-element-created="handleTargetElementCreated"
      @challenge-completed="handleChallengeCompleted"
      @show-alert="$emit('show-alert', $event)"
    />

    <!-- Modal de Victoire -->
<div v-if="showVictoryModal">
  <!-- Modal pour victoire de boss -->
  <div v-if="victoryRewards?.isBossReward" class="boss-victory-modal">
    <div class="boss-victory">
      <div class="boss-victory-header">
        <!-- Image/Animation du boss vaincu avec chargement dynamique -->
        <img
          v-if="currentBoss"
          :src="getBossDefeatedImage(currentBoss.id)"
          alt="Boss vaincu"
          class="boss-image"
        />
        <h2>Boss Vaincu !</h2>
      </div>
      
      <!-- Message narratif -->
      <p class="victory-message">
        <span v-if="victoryRewards?.alreadyDefeated">
          Vous avez à nouveau triomphé de <strong>{{ currentBoss ? currentBoss.name : 'le boss' }}</strong>. 
          <br><span class="already-defeated-message">Ce boss avait déjà été vaincu, aucune récompense n'est attribuée cette fois-ci.</span>
        </span>
        <span v-else>
          Félicitations ! Vous avez triomphé de <strong>{{ currentBoss ? currentBoss.name : 'le boss' }}</strong> après un combat épique.
        </span>
      </p>
      
      <!-- Récompenses obtenues (uniquement affichées si le boss n'avait pas été vaincu auparavant) -->
      <div class="rewards-container" v-if="!victoryRewards?.alreadyDefeated">
        <h3>Récompenses Obtenues :</h3>
        <div class="reward-item" v-if="victoryRewards?.coins">
          <span class="reward-icon">💰</span>
          <span class="reward-value">{{ victoryRewards.coins }} Pièces</span>
        </div>
        <div class="reward-item" v-if="victoryRewards?.xp">
          <span class="reward-icon">✨</span>
          <span class="reward-value">{{ victoryRewards.xp }} XP</span>
        </div>
        <div class="reward-item" v-if="victoryRewards?.energy">
          <span class="reward-icon">⚡</span>
          <span class="reward-value">{{ victoryRewards.energy }} Énergie</span>
        </div>
        <div class="reward-item" v-if="victoryRewards?.bonus">
          <span class="reward-icon">🎁</span>
          <span class="reward-value">{{ victoryRewards.bonus }}</span>
        </div>
      </div>
      
      <!-- Message pour les nouvelles régions débloquées -->
      <div class="next-steps" v-if="hasUnlockedRegions && !victoryRewards?.alreadyDefeated">
        <p>
          De nouvelles régions ont été débloquées ! Préparez-vous à explorer de nouveaux territoires et relever d'autres défis.
        </p>
      </div>
      
      <!-- Bouton pour continuer -->
      <button class="continue-btn" @click="closeVictoryModal">Continuer</button>
    </div>
  </div>
  
  <!-- Modal pour victoire normale (régions non-boss) -->
  <div v-else class="victory-modal">
    <div class="victory-content">
      <h2>Victoire !</h2>
      
      <!-- Affichage différent selon que la région a déjà été complétée ou non -->
      <p v-if="victoryRewards?.alreadyCompleted">
        Vous avez réussi le défi de {{ selectedRegion.name }} une nouvelle fois !
        <br><span class="already-completed-message">Cette région avait déjà été complétée, aucune récompense n'a été attribuée.</span>
      </p>
      <p v-else>
        Félicitations, vous avez complété la quête: {{ selectedRegion.name }} !
      </p>
      
      <div class="rewards-container" v-if="!victoryRewards?.alreadyCompleted">
        <h3>Récompenses obtenues :</h3>
        <div class="reward-item" v-if="victoryRewards?.coins">
          <span class="reward-icon">💰</span>
          <span class="reward-value">{{ victoryRewards.coins }} Pièces</span>
        </div>
        <div class="reward-item" v-if="victoryRewards?.xp">
          <span class="reward-icon">✨</span>
          <span class="reward-value">{{ victoryRewards.xp }} XP</span>
        </div>
        <div class="reward-item" v-if="victoryRewards?.energy">
          <span class="reward-icon">⚡</span>
          <span class="reward-value">{{ victoryRewards.energy }} Énergie</span>
        </div>
      </div>
      
      <p class="unlock-message" v-if="hasUnlockedRegions && !victoryRewards?.alreadyCompleted">
        Vous avez débloqué de nouvelles régions ! Partez les explorer !
      </p>
      
      <button class="continue-btn" @click="closeVictoryModal">Continuer</button>
    </div>
  </div>
</div>

    <!-- Modal de transition entre cartes -->
    <MapTransitionModal
      v-if="showMapTransitionModal"
      :isVisible="showMapTransitionModal"
      :bossName="lastDefeatedBoss?.name || 'Gardien des Ténèbres'"
      :oldMapId="currentMapId - 1"
      :newMapId="currentMapId"
      :rewards="mapTransitionRewards"
      @continue-to-new-map="continueToNewMap"
    />
  </div>
</template>

<script>
import '@/assets/ExplorerMapStyle.css';
import explorerService from '@/services/explorerService';
import NpcDialog from './NpcDialog.vue';
import ExplorerCraftModal from './ExplorerCraftModal.vue';
import MapTransitionModal from './MapTransitionModal.vue';
import axios from 'axios';

export default {
  name: 'ExplorerMap',
  components: {
    NpcDialog,
    ExplorerCraftModal,
    MapTransitionModal
  },
  props: {
    userCoins: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      regions: [],
      energy: 0,
      maxEnergy: 20,
      nextEnergyIn: 0,
      energyTimer: null,
      selectedRegion: null,
      loading: true,
      currentMapId: 1,
      unlockedMaps: [1],
      showExitConfirmationModal: false,
      
       // Propriétés pour le dialogue NPC (valeurs par défaut dynamiques)
      showNpcDialog: false,
      currentNpc: {
        image: null,
        position: null,
        dialog: [],
        actionText: null
      },
      // Utilisation du JSON importé pour les défis des régions
      regionChallenges: {},
      
      // Propriétés pour le modal de craft
      showCraftModal: false,
      currentChallenge: null,
      
      // Propriétés pour la modal de victoire
      showVictoryModal: false,
      victoryRewards: null,
      
      // Propriétés pour les boss
      bosses: [],
      currentBoss: null,
      lastDefeatedBoss: null,
      
      // Propriétés pour la transition entre cartes
      showMapTransitionModal: false,
      mapTransitionRewards: null,
      showTransitionAfterVictory: false
    };
  },
  computed: {
    hasUnlockedRegions() {
      return this.regions.some(region => 
        !region.visited && 
        !region.completed && 
        this.isRegionUnlocked(region)
      );
    }
  },
  methods: {
    
    formatTime(minutes) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
    },

    getCurrentEnergyCost() {
      if (!this.selectedRegion || !this.selectedRegion.id) return 2;
      const challenge = this.regionChallenges[this.selectedRegion.id];
      // Utiliser la valeur du challenge s’il existe, sinon celle de la région ou 2 par défaut
      return (challenge && challenge.energyCost !== undefined)
        ? challenge.energyCost
        : (this.selectedRegion.energyCost || 2);
    },


    confirmExit() {
      // Ferme le mode Explorer
      this.$emit('close');
      // Réinitialise la modal de confirmation
      this.showExitConfirmationModal = false;
    },
    
    isRegionUnlocked(region) {
      if (region.is_default || region.visited || region.completed) {
        return true;
      }
      if (region.parent_region_id) {
        const parentRegion = this.regions.find(r => r.id === region.parent_region_id);
        if (parentRegion && parentRegion.completed) {
          const childRegions = this.regions.filter(r => 
            r.parent_region_id === parentRegion.id && 
            !r.visited && 
            !r.completed
          );
          if (childRegions.length > 0) {
            const sortedChildren = [...childRegions].sort((a, b) => a.id - b.id);
            return region.id === sortedChildren[0].id;
          }
        }
      }
      return false;
    },
    
    getRegionStyle(region) {
  const x = region.position_x || 50;
  const y = region.position_y || 50;
  
  // Log pour déboguer
  console.log(`Style pour région ${region.id} (${region.name}): x=${x}, y=${y}`);
  
  return {
    left: `${x}%`,
    top: `${y}%`,
    display: 'block', // Force l'affichage
    zIndex: 10 // S'assurer que le point est au-dessus de la carte
  };
},
    
    async loadExplorerData() {
      try {
        this.loading = true;
        
        // Essayer de synchroniser les données des régions avant tout
        try {
          await explorerService.syncRegions();
          console.log('Synchronisation des régions effectuée');
        } catch (syncError) {
          console.warn('Synchronisation des régions échouée, utilisation des données existantes', syncError);
        }
        
        // Charger les données initiales et la carte active
        const initData = await explorerService.initExplorer();
        this.energy = initData.energy;
        this.maxEnergy = initData.max_energy || 20;
        this.nextEnergyIn = initData.next_energy_in;
        this.currentMapId = initData.currentMap || 1;
        
        // Charger les cartes débloquées
        this.loadUnlockedMaps();
        
        // Charger les régions pour la carte active
        await this.loadRegionsForCurrentMap();
        
        // Charger les défis des régions
        await this.loadRegionChallenges();
        
        this.startEnergyTimer();
      } catch (error) {
        console.error('Erreur lors du chargement des données Explorer:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Méthode pour charger les cartes débloquées
    loadUnlockedMaps() {
  try {
    const unlockedMapsStr = localStorage.getItem('unlocked_maps');
    let maps = [];
    if (unlockedMapsStr) {
      // On suppose que l'objet stocké ressemble à { "2": true, "3": true, ... }
      const mapsObj = JSON.parse(unlockedMapsStr);
      maps = Object.keys(mapsObj).map(Number).filter(id => mapsObj[id]);
    }
    // La première map est toujours débloquée
    if (!maps.includes(1)) maps.push(1);
    maps.sort((a, b) => a - b);
    this.unlockedMaps = maps;
    console.log('Cartes débloquées:', this.unlockedMaps);
  } catch (error) {
    console.error('Erreur lors du chargement des cartes débloquées:', error);
    this.unlockedMaps = [1];
  }
},

    
    // Correction de loadRegionsForCurrentMap()
async loadRegionsForCurrentMap() {
  try {
    console.log(`Chargement des régions pour la map ${this.currentMapId}...`);
    
    // Appeler le service pour récupérer les régions filtrées par map
    const regionsData = await explorerService.getRegions(this.currentMapId);
    
    console.log(`${regionsData.length} régions récupérées pour la map ${this.currentMapId}`);
    
    if (regionsData.length === 0) {
      console.warn(`Aucune région trouvée pour la map ${this.currentMapId}, vérifiez le serveur et le filtre de map`);
    }
    
    // Traiter les régions reçues
    const processedRegions = regionsData.map(region => {
      // S'assurer que chaque région a une propriété map_id
      if (!region.map_id) {
        console.warn(`Région sans map_id: ${region.id} (${region.name})`);
        region.map_id = this.currentMapId;
      }
      
      // Marquer la première région comme default si nécessaire
      if (this.currentMapId > 1 && region.id === this.currentMapId * 5 + 1) {
        console.log(`Région ${region.id} (${region.name}) marquée comme default pour la map ${this.currentMapId}`);
        region.is_default = true;
      }
      
      // Ajouter d'autres traitements si nécessaire
      return region;
    });
    
    // Mettre à jour les régions
    this.regions = processedRegions;
    
    // Afficher un log détaillé des régions chargées
    console.log("Détails des régions chargées:");
    this.regions.forEach(r => {
      console.log(`- ID: ${r.id}, Nom: ${r.name}, Default: ${r.is_default}, Map: ${r.map_id}, Pos: (${r.position_x}, ${r.position_y})`);
    });
    
    // Rechercher le boss de cette map
    const bossesInMap = this.regions.filter(r => r.is_boss && r.map_id === this.currentMapId);
    if (bossesInMap.length > 0) {
      console.log(`Boss dans la map ${this.currentMapId}:`, bossesInMap.map(b => b.name));
    } else {
      console.log(`Aucun boss dans la map ${this.currentMapId}`);
    }
    
    return this.regions;
  } catch (error) {
    console.error(`Erreur lors du chargement des régions pour la carte ${this.currentMapId}:`, error);
    this.regions = [];
    return [];
  }
},
    
    // Amélioration de la méthode changeMap() dans ExplorerMap.vue
async changeMap() {
  this.loading = true;
  
  try {
    console.log(`Changement vers la map ${this.currentMapId}...`);
    
    // Sauvegarder le changement de carte
    explorerService.setCurrentMap(this.currentMapId);
    
    // Recharger les régions pour la nouvelle carte
    await this.loadRegionsForCurrentMap();
    
    // Recharger les défis pour la nouvelle carte
    await this.loadRegionChallenges();
    
    // Afficher un log pour le débogage
    console.log(`Régions chargées pour la map ${this.currentMapId}:`, this.regions);
    
    // Mettre en évidence les régions disponibles
    this.highlightAvailableRegions();
  } catch (error) {
    console.error(`Erreur lors du changement à la carte ${this.currentMapId}:`, error);
  } finally {
    this.loading = false;
  }
},

// Méthode pour mettre en évidence les régions disponibles
highlightAvailableRegions() {
  // Trouver les régions débloquées mais pas encore complétées
  const availableRegions = this.regions.filter(r => 
    this.isRegionUnlocked(r) && 
    !r.completed && 
    r.map_id === this.currentMapId
  );
  
  console.log("Régions disponibles dans la nouvelle map:", availableRegions);
  
  // Vous pouvez ajouter ici une animation visuelle pour mettre en évidence ces régions
  // Par exemple, en ajoutant temporairement une classe CSS spéciale
  
  // Pour cet exemple, nous allons simplement logger les régions disponibles
  if (availableRegions.length > 0) {
    const firstRegion = availableRegions[0];
    console.log(`Première région disponible: ${firstRegion.name} (ID: ${firstRegion.id})`);
    
    // Option: sélectionner automatiquement la première région disponible
    // setTimeout(() => this.selectRegion(firstRegion), 1000);
  }
},

    
getCurrentMapImage() {
    try {
      // Obtenir le nom de fichier en fonction de l'ID de map
      let mapFileName = '';
      
      // La seule convention à respecter est la suivante:
      // - Map 1: world-map.png
      // - Map 2 et plus: world-map{ID}.png
      if (this.currentMapId === 1) {
        mapFileName = 'world-map.png';
      } else {
        mapFileName = `world-map${this.currentMapId}.png`;
      }
      
      // Utiliser la méthode globale require pour importer dynamiquement
      return require(`@/assets/maps/${mapFileName}`);
    } catch (error) {
      console.error("Erreur lors du chargement de l'image de carte:", error);
      
      // Fallback sur une image par défaut
      try {
        return require('@/assets/maps/world-map.png');
      } catch (fallbackError) {
        console.error("Fallback également échoué:", fallbackError);
        return ''; // Chaîne vide si tout échoue
      }
    }
  },
  
getDefaultMapBackground(mapId) {
  // Cette configuration pourrait provenir d'un fichier de config ou d'une API
  const mapBackgrounds = {
    1: 'world-map.png',
    2: 'world-map2.png',
    3: 'world-map3.png'
  };
  return mapBackgrounds[mapId] || 'default-map.png';
},


// Méthode pour forcer le rechargement des régions
async forceRegionsReload() {
  // Vider l'array de régions
  this.regions = [];
  
  // Attendre le prochain cycle de rendu
  await this.$nextTick();
  
  // Recharger les régions pour la carte actuelle
  try {
    const regionData = await explorerService.getRegions(this.currentMapId);
    console.log(`Régions rechargées (${regionData.length}) pour carte ${this.currentMapId}`);
    
    // S'assurer que les régions par défaut sont correctement marquées
    const processedRegions = regionData.map(r => {
      // Pour la carte 2, marquer la première région comme défaut si nécessaire
      if (this.currentMapId === 2 && r.id === 6) {
        return { ...r, is_default: true };
      }
      return r;
    });
    
    // Mettre à jour les régions
    this.regions = processedRegions;
    
    // Recharger les défis des régions
    await this.loadRegionChallenges();
  } catch (error) {
    console.error("Erreur lors du rechargement forcé des régions:", error);
  }
},
    
    // Méthode pour obtenir le nom de la carte actuelle
    getMapName(mapId) {
      // Utiliser l'ID de map fourni ou l'ID de map actuel si non fourni
      const currentMapId = mapId || this.currentMapId;
      
      // Trouver une région de cette carte
      const regionInMap = this.regions.find(region => {
        const regionMapId = this.getRegionMapId(region);
        return regionMapId === currentMapId;
      });
      
      if (regionInMap) {
        // Retourner le nom de la première région "is_default" de cette carte ou le premier nom de région
        const defaultRegion = this.regions.find(r => r.is_default && this.getRegionMapId(r) === currentMapId);
        return defaultRegion ? defaultRegion.name : regionInMap.name;
      }
      
      // Fallback si aucune région n'est trouvée
      return `Carte ${currentMapId}`;
    },
    
    // Méthode utilitaire pour déterminer à quelle carte appartient une région
    getRegionMapId(region) {
  return region.map_id || 1;
},

    
    // Méthode pour obtenir l'image d'un boss vaincu de manière dynamique
    getBossDefeatedImage(bossId) {
      try {
        const boss = this.regions.find(r => r.id === bossId && r.is_boss);
        if (boss && boss.bossDefeatedImage) {
          return require(`@/assets/explorer-boss/${boss.bossDefeatedImage}`);
        } else {
          // Fallback pour la compatibilité
          const bossDefeatedImageFromChallenge = this.regionChallenges[bossId]?.bossDefeatedImage;
          if (bossDefeatedImageFromChallenge) {
            return require(`@/assets/explorer-boss/${bossDefeatedImageFromChallenge}`);
          }
          return require('@/assets/explorer-boss/boss-1-dead.png');
        }
      } catch (error) {
        console.warn(`Erreur lors du chargement de l'image du boss vaincu, utilisation de l'image par défaut:`, error);
        return require('@/assets/explorer-boss/boss-1-dead.png');
      }
    },
    
    async loadRegionChallenges() {
  try {
    const response = await axios.get('/data/regionChallenges.json');
    const regionChallengesData = response.data;
    const challenges = {};
    
    // Traiter toutes les régions (normales et boss) ensemble
    regionChallengesData.regions.forEach(region => {
      challenges[region.id] = {
        npcImage: region.is_boss ? region.bossImage : region.npcImage,
        npcPosition: region.npcPosition || 'left',
        dialog: region.dialog,
        interactions: region.interactions || [],
        requiredElements: region.requiredElements,
        background: region.background,
        explorerMapBackground: region.explorerMapBackground,
        bossDefeatedImage: region.bossDefeatedImage,
        availableElements: region.availableElements || [],
        elementsWithGifs: region.elementsWithGifs || [],
        actionText: region.actionText,
        rewardCoins: region.rewardCoins,
        rewardXp: region.rewardXp,
        energyCost: region.energyCost || 2,
        energyReward: region.energyReward || 5,
        unlockHint: region.unlockHint,
        // Propriétés spécifiques au boss
        is_boss: region.is_boss || false,
        bossCombatRules: region.bossCombatRules || null,
        maxHealth: region.maxHealth || null,
        damagePerElement: region.damagePerElement || null,
        bossImage: region.bossImage || null,
        bossPosition: region.bossPosition || 'center',
        trigger_after_region: region.trigger_after_region || null
      };
      
      // Si c'est un boss, l'ajouter aussi à this.bosses pour la compatibilité avec le code existant
      if (region.is_boss) {
        if (!this.bosses) this.bosses = [];
        this.bosses.push({
          id: region.id,
          name: region.name,
          trigger_after_region: region.trigger_after_region,
          bossImage: region.bossImage,
          bossDefeatedImage: region.bossDefeatedImage,
          bossPosition: region.bossPosition,
          dialog: region.dialog,
          requiredElements: region.requiredElements,
          availableElements: region.availableElements,
          elementsWithGifs: region.elementsWithGifs,
          actionText: region.actionText,
          rewardCoins: region.rewardCoins,
          rewardXp: region.rewardXp,
          energyReward: region.energyReward || 10,
          damagePerElement: region.damagePerElement,
          bossCombatRules: region.bossCombatRules,
          explorerMapBackground: region.explorerMapBackground
        });
      }
    });
    
    this.regionChallenges = challenges;
  } catch (error) {
    console.error('Erreur lors du chargement des défis de régions:', error);
    this.setupDefaultChallenges();
  }
},
    
setupDefaultChallenges() {
  // Charge une configuration par défaut de challenge de façon dynamique
  const defaultChallengeConfig = this.getDefaultChallengeConfig();
  this.regionChallenges = {
    1: defaultChallengeConfig
  };
},
getDefaultChallengeConfig() {
  // Cette configuration pourrait être issue d'un fichier de config ou d'une API
  return {
    npcImage: 'npc1.png', // Ce chemin pourra être ajusté dynamiquement
    npcPosition: 'left',
    dialog: [
      "Bienvenue, explorateur !",
      "Un problème est survenu lors du chargement des défis. Veuillez réessayer."
    ],
    requiredElements: ["DefaultElement"],
    availableElements: ["Element1", "Element2"],
    elementsWithGifs: ["Element1", "Element2"],
    background: null,
    explorerMapBackground: this.getDefaultMapBackground(1),
    actionText: "Commencer",
    energyCost: 2,
    energyReward: 5,
    rewardCoins: 50,
    rewardXp: 100,
    unlockHint: "Essayez de combiner différents éléments"
  };
},

    
    startEnergyTimer() {
      if (this.energyTimer) {
        clearInterval(this.energyTimer);
      }
      this.energyTimer = setInterval(() => {
        if (this.nextEnergyIn > 0) {
          this.nextEnergyIn -= 1;
        } else {
          if (this.energy < this.maxEnergy) {
            this.energy += 1;
            this.nextEnergyIn = 30;
          }
        }
      }, 60000);
    },
    
    // Modification de la méthode selectRegion() dans ExplorerMap.vue
selectRegion(region) {
  if (!this.isRegionUnlocked(region)) {
    alert('Cette région est verrouillée. Complétez les régions précédentes pour la débloquer.');
    return;
  }
  
  this.selectedRegion = region;
  this.showNpcDialog = true;
  
  // Vérifier si la région est déjà complétée
  const isCompleted = region.completed === true;
  
  // Vérifier si c'est un boss déjà vaincu
  const isBossDefeated = region.is_boss && region.boss_defeated;
  
  if (this.regionChallenges[region.id]) {
    const challenge = this.regionChallenges[region.id];
    
    // Construire le dialogue en fonction de l'état de la région
    let dialog = [...challenge.dialog]; // Copier le dialogue original
    
    // Ajouter un message spécifique si la région est déjà complétée
    if (isCompleted || isBossDefeated) {
      const completionMessage = isBossDefeated
        ? "Vous avez déjà vaincu ce boss. Vous pouvez l'affronter à nouveau, mais vous ne recevrez aucune récompense."
        : "Vous avez déjà complété ce défi. Vous pouvez le refaire, mais vous ne recevrez aucune récompense.";
      
      dialog.push(completionMessage);
    }
    
    if (challenge.interactions && challenge.interactions.length > 0) {
      this.selectedRegion = {
        ...region,
        interactions: challenge.interactions
      };
      this.currentNpc = {
        image: challenge.npcImage,
        position: challenge.npcPosition || 'left',
        dialog: dialog,
        actionText: challenge.actionText
      };
    } else {
      this.currentNpc = {
        image: challenge.npcImage,
        position: challenge.npcPosition || 'left',
        dialog: dialog,
        actionText: challenge.actionText
      };
    }
  } else {
    // Fallback si aucun challenge n'est trouvé dans regionChallenges
    let defaultDialog = [
      `Bienvenue dans ${region.name}, explorateur !`,
      "Cette région est pleine de mystères à découvrir.",
      "Essaie de combiner les éléments fondamentaux pour découvrir les secrets de cet endroit."
    ];
    
    // Ajouter un message spécifique si la région est déjà complétée
    if (isCompleted || isBossDefeated) {
      const completionMessage = isBossDefeated
        ? "Vous avez déjà vaincu ce boss. Vous pouvez l'affronter à nouveau, mais vous ne recevrez aucune récompense."
        : "Vous avez déjà complété ce défi. Vous pouvez le refaire, mais vous ne recevrez aucune récompense.";
      
      defaultDialog.push(completionMessage);
    }
    
    this.currentNpc = {
      image: 'npc1.png',
      position: 'left',
      dialog: defaultDialog,
      actionText: "Commencer à crafter"
    };
  }
},
    
    checkBossTrigger(regionId) {
      const bossRegion = this.regions.find(r => r.is_boss && r.trigger_after_region === regionId);
      if (bossRegion) {
        // Pour compatibilité avec le code existant, créer un objet "boss" à partir de la région
        return {
          id: bossRegion.id,
          name: bossRegion.name,
          trigger_after_region: bossRegion.trigger_after_region,
          bossImage: bossRegion.bossImage || this.regionChallenges[bossRegion.id]?.bossImage,
          bossDefeatedImage: bossRegion.bossDefeatedImage || this.regionChallenges[bossRegion.id]?.bossDefeatedImage,
          bossPosition: bossRegion.bossPosition || this.regionChallenges[bossRegion.id]?.bossPosition || 'center',
          dialog: bossRegion.dialog,
          requiredElements: bossRegion.requiredElements,
          availableElements: bossRegion.availableElements,
          elementsWithGifs: bossRegion.elementsWithGifs,
          actionText: bossRegion.actionText,
          rewardCoins: bossRegion.rewardCoins,
          rewardXp: bossRegion.rewardXp,
          damagePerElement: this.regionChallenges[bossRegion.id]?.damagePerElement,
          bossCombatRules: this.regionChallenges[bossRegion.id]?.bossCombatRules,
          explorerMapBackground: bossRegion.explorerMapBackground || this.regionChallenges[bossRegion.id]?.explorerMapBackground
        };
      }
      return null;
    },
    
    closeNpcDialog() {
      this.showNpcDialog = false;
    },
    
    // ExplorerMap.vue - dans la méthode startCraftChallenge
async startCraftChallenge(region) {
  try {
    // Cas spécial: si c'est une région marquée comme boss
    if (region.is_boss || region.id === 5 || region.id === 10) {
      // S'il s'agit directement du boss
      this.currentBoss = {
        id: region.id,
        name: region.name,
        bossImage: region.bossImage || this.regionChallenges[region.id]?.bossImage,
        bossDefeatedImage: region.bossDefeatedImage || this.regionChallenges[region.id]?.bossDefeatedImage,
        bossPosition: region.bossPosition || this.regionChallenges[region.id]?.bossPosition,
        dialog: region.dialog,
        requiredElements: region.requiredElements,
        availableElements: region.availableElements,
        elementsWithGifs: region.elementsWithGifs,
        actionText: region.actionText,
        rewardCoins: region.rewardCoins,
        rewardXp: region.rewardXp,
        damagePerElement: this.regionChallenges[region.id]?.damagePerElement,
        bossCombatRules: this.regionChallenges[region.id]?.bossCombatRules,
        explorerMapBackground: region.explorerMapBackground || this.regionChallenges[region.id]?.explorerMapBackground
      };
      this.currentChallenge = this.regionChallenges[region.id] || this.currentBoss;
      this.showNpcDialog = false;
      this.showCraftModal = true;
      
      // Marquer la région du boss comme visitée si elle ne l'est pas déjà
      if (!region.visited) {
        region.visited = true;
        try {
          await explorerService.visitRegion(region.id);
        } catch (err) {
          console.error("Erreur lors de la visite de la région du boss:", err);
        }
      }
      return;
    }
    
    // Récupérer le coût d'énergie dynamique pour cette région
    const energyCost = this.regionChallenges[region.id]?.energyCost || 2;
    
    // Traitement normal pour les régions standards
    const result = await explorerService.visitRegion(region.id, energyCost);
    
    // Mettre à jour l'énergie (si la région est déjà complétée, aucun changement ne sera effectué)
    this.energy = result.energy;
    
    // Mettre à jour le challenge actuel
    this.currentChallenge = this.regionChallenges[region.id] || {
      requiredElements: [],
      dialog: [],
      unlockHint: "Essayez de combiner différents éléments pour découvrir le secret."
    };
    
    // Enregistrer si la région était déjà complétée (pour la gestion des récompenses)
    if (result.alreadyCompleted) {
      this.currentChallenge.alreadyCompleted = true;
    }
    
    this.showNpcDialog = false;
    this.showCraftModal = true;
  } catch (error) {
    console.error('Erreur lors du démarrage du défi:', error);
    alert(error.response?.data?.message || 'Une erreur est survenue lors du défi');
  }
},


handleCraftSuccess(craftedItem) {
  this.$emit('element-discovered', craftedItem);
},

// ExplorerMap.vue - dans la méthode handleChallengeCompleted
handleChallengeCompleted({ region, isBoss }) {
  // Fermeture du modal de craft
  this.showCraftModal = false;
  
  // Si le défi concernait un boss, déclencher la victoire du boss
  if (isBoss) {
    this.handleBossVictory();
    return;
  }
  
  // Pour une région normale, mettre à jour son statut
  const regionData = this.regions.find(r => r.id === region.id);
  if (regionData) {
    const triggeredBoss = this.checkBossTrigger(region.id);
    const hasBoss = triggeredBoss !== null;
    
    if (hasBoss) {
      regionData.visited = true;
      regionData.progress = 75;
    } else {
      regionData.completed = true;
      regionData.progress = 100;
    }
    
    // Vérifier si la région était déjà complétée
    const wasAlreadyCompleted = this.currentChallenge.alreadyCompleted;
    
    // Définir les récompenses, mais 0 si déjà complété
    const rewardCoins = wasAlreadyCompleted ? 0 : (this.regionChallenges[region.id]?.rewardCoins || 50);
    const rewardXp = wasAlreadyCompleted ? 0 : (this.regionChallenges[region.id]?.rewardXp || 100);
    const rewardEnergy = wasAlreadyCompleted ? 0 : (this.regionChallenges[region.id]?.energyReward || 5);
    
    // Mettre à jour l'énergie seulement si la région n'était pas déjà complétée
    if (!wasAlreadyCompleted) {
      this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
    }
    
    // Préparer les récompenses à afficher
    this.victoryRewards = {
      coins: rewardCoins,
      xp: rewardXp,
      energy: rewardEnergy,
      hasBoss: hasBoss,
      alreadyCompleted: wasAlreadyCompleted
    };
    
    // Mettre à jour les pièces seulement si la région n'était pas déjà complétée
    if (!wasAlreadyCompleted) {
      this.$emit('coins-updated', this.userCoins + rewardCoins);
    }
    
    if (triggeredBoss) {
      this.currentBoss = triggeredBoss;
      this.showVictoryModal = true;
      this.victoryRewards.triggerBoss = true;
    } else {
      this.victoryRewards.unlockedRegions = [];
      const childRegions = this.regions.filter(r => 
        r.parent_region_id === regionData.id && 
        !r.visited && 
        !r.completed
      );
      
      let unlockedRegion = null;
      if (childRegions.length > 0) {
        const sortedChildren = [...childRegions].sort((a, b) => a.id - b.id);
        const nextRegion = sortedChildren[0];
        unlockedRegion = nextRegion;
        nextRegion.is_default = true;
      }
      
      if (unlockedRegion) {
        this.victoryRewards.unlockedRegions.push(unlockedRegion.id);
      }
      
      this.showVictoryModal = true;
    }
    
    // Appeler le service pour enregistrer la complétion de la région
    explorerService.completeRegion(regionData.id, {
      coins: rewardCoins,
      energy: rewardEnergy,
      xp: rewardXp,
      hasBoss: hasBoss,
      bossDefeated: false
    }).then(response => {
      console.log('Réponse du service pour complétion de région:', response);
      
      // Si le serveur a retourné des récompenses, utiliser ces valeurs
      if (response && response.rewards) {
        if (response.rewards.coins !== undefined && !wasAlreadyCompleted) {
          this.$emit('coins-updated', response.rewards.coins);
        }
        
        if (response.rewards.energy !== undefined) {
          this.energy = response.rewards.energy;
        }
      }
    }).catch(error => {
      console.error(`Erreur lors de la complétion de la région ${regionData.id}:`, error);
    });
  }
},

// Dans ExplorerMap.vue, modifiez handleBossVictory() et closeVictoryModal()

// handleBossVictory avec ajout de logs de débogage
handleBossVictory() {
  if (!this.currentBoss) return;
  
  console.log("=== DÉBUT TRAITEMENT VICTOIRE DE BOSS ===");
  
  // Sauvegarder les informations du boss vaincu
  this.lastDefeatedBoss = { ...this.currentBoss };
  console.log("Boss vaincu:", this.lastDefeatedBoss);
  
  const bossId = this.currentBoss.id;
  console.log("ID du boss:", bossId);
  
  // Vérifier si le boss est déjà vaincu
  const bossRegion = this.regions.find(r => r.id === bossId);
  const isAlreadyDefeated = bossRegion && bossRegion.boss_defeated;
  
  console.log("Boss déjà vaincu:", isAlreadyDefeated);
  console.log("Map actuelle:", this.currentMapId);
  
  // Définir les récompenses (0 si déjà vaincu)
  const rewardCoins = isAlreadyDefeated ? 0 : (this.currentBoss.rewardCoins || 500);
  const rewardXp = isAlreadyDefeated ? 0 : (this.currentBoss.rewardXp || 1000);
  const rewardEnergy = isAlreadyDefeated ? 0 : (this.regionChallenges[this.currentBoss.id]?.energyReward || 10);
  const regionId = this.currentBoss.trigger_after_region;
  
  console.log("Récompenses:", { coins: rewardCoins, xp: rewardXp, energy: rewardEnergy });
  console.log("Région déclencheuse:", regionId);
  
  // Ajouter de l'énergie uniquement si le boss n'a pas déjà été vaincu
  if (!isAlreadyDefeated) {
    this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
  }
  
  // Marquer la région associée comme complétée
  const associatedRegion = this.regions.find(r => r.id === regionId);
  if (associatedRegion) {
    associatedRegion.completed = true;
    associatedRegion.progress = 100;
    console.log("Région associée marquée complétée:", associatedRegion.name);
  }
  
  // Créer ou mettre à jour la région du boss
  if (bossRegion) {
    bossRegion.completed = true;
    bossRegion.visited = true;
    bossRegion.progress = 100;
    bossRegion.boss_defeated = true; // Marquer le boss comme vaincu
    console.log("Région du boss marquée complétée:", bossRegion.name);
  }
  
  // Préparer les récompenses
  this.victoryRewards = {
    coins: rewardCoins,
    xp: rewardXp,
    energy: rewardEnergy,
    isBossReward: true,
    alreadyDefeated: isAlreadyDefeated
  };
  
  // Mettre à jour les pièces de l'utilisateur uniquement si le boss n'a pas déjà été vaincu
  if (!isAlreadyDefeated) {
    this.$emit('coins-updated', this.userCoins + rewardCoins);
  }
  
  // Déterminer la map suivante
  const nextMapId = this.currentMapId + 1;
  console.log("Map suivante potentielle:", nextMapId);
  
  // Vérifier si le boss est de la map actuelle
  const isBossFromCurrentMap = bossRegion && bossRegion.map_id === this.currentMapId;
  console.log("Boss de la map actuelle:", isBossFromCurrentMap);
  
  // Déterminer si c'est un boss final
  let isFinalBoss = false;
  if (bossRegion) {
    const bossesInCurrentMap = this.regions.filter(r => r.is_boss && r.map_id === bossRegion.map_id);
    const maxBossId = Math.max(...bossesInCurrentMap.map(b => b.id));
    isFinalBoss = bossId === maxBossId;
    console.log("Boss final de sa map:", isFinalBoss);
  }
  
  // Toujours montrer la transition après un boss final, même s'il a déjà été vaincu
  if (isFinalBoss && isBossFromCurrentMap) {
    console.log("Préparation de la transition vers map", nextMapId);
    // Valider que la map suivante existe
    const mapExists = explorerService.isMapUnlocked(nextMapId);
    
    if (mapExists) {
      console.log("Map suivante existe/débloquée");
      this.showTransitionAfterVictory = true;
      this.nextMapToUnlock = nextMapId;
      this.mapTransitionRewards = {
        coins: rewardCoins,
        xp: rewardXp,
        energy: rewardEnergy
      };
    } else {
      console.log("Map suivante n'existe pas ou n'est pas débloquée");
      this.showTransitionAfterVictory = false;
    }
  } else {
    console.log("Pas de transition prévue");
    this.showTransitionAfterVictory = false;
  }
  
  // Afficher la modale de victoire standard
  this.showVictoryModal = true;
  
  // Enregistrer la victoire sur le boss via le service UNIQUEMENT si le boss n'était pas déjà vaincu
  if (!isAlreadyDefeated) {
    explorerService.completeBoss(bossId, {
      coins: rewardCoins,
      energy: rewardEnergy,
      xp: rewardXp,
      regionId: regionId,
      bossRegionId: bossId
    }).then(response => {
      console.log('Boss vaincu - réponse du serveur:', response);
      
      // Si c'est le boss final, déverrouiller la map suivante
      if (isFinalBoss && isBossFromCurrentMap) {
        explorerService.unlockNextMap(nextMapId);
        this.loadUnlockedMaps(); // Actualiser la liste des cartes débloquées
      }
      
      this.refreshRegions();
    }).catch(error => {
      console.error(`Erreur lors de l'enregistrement de la victoire du boss ${bossId}:`, error);
    });
  } else {
    // Même si on n'envoie pas de données au serveur, on rafraîchit les régions
    this.refreshRegions();
  }
  
  console.log("=== FIN TRAITEMENT VICTOIRE DE BOSS ===");
},


async refreshRegions() {
  try {
    const regionsData = await explorerService.getRegions(this.currentMapId);
    this.regions = regionsData.map(updatedRegion => {
      const existingRegion = this.regions.find(r => r.id === updatedRegion.id);
      if (existingRegion) {
        return {
          ...existingRegion,
          completed: updatedRegion.completed || existingRegion.completed,
          visited: updatedRegion.visited || existingRegion.visited,
          progress: updatedRegion.progress || existingRegion.progress || 0
        };
      }
      return updatedRegion;
    });
    
    // Force la réinitialisation du rendu des régions
    this.$nextTick(() => {
      const temp = [...this.regions];
      this.regions = [];
      this.$nextTick(() => {
        this.regions = temp;
      });
    });
  } catch (error) {
    console.error('Erreur lors du rafraîchissement des régions:', error);
  }
},

closeCraftModal() {
  this.showCraftModal = false;
},

// 2. Dans ExplorerMap.vue - Gérer les événements de ExplorerCraftModal correctement
handleTargetElementCreated(element) {
  console.log(`Élément cible créé: ${element}`);
  // Ne rien faire de plus ici - ExplorerCraftModal vérifiera lui-même si le défi est terminé
},

// Correction de closeVictoryModal() pour ExplorerMap.vue
closeVictoryModal() {
  console.log("=== DÉBUT FERMETURE MODAL DE VICTOIRE ===");
  const isBossVictory = this.victoryRewards?.isBossReward;
  const triggerBoss = this.victoryRewards?.triggerBoss;
  
  console.log("Victoire de boss:", isBossVictory);
  console.log("Déclenche un boss:", triggerBoss);
  console.log("Transition vers nouvelle map prévue:", this.showTransitionAfterVictory);
  console.log("ID de map à débloquer:", this.nextMapToUnlock);
  
  // Fermer le modal de victoire
  this.showVictoryModal = false;
  
  // Gérer la transition vers la map suivante
  if (this.showTransitionAfterVictory && this.nextMapToUnlock) {
    console.log("Affichage du modal de transition vers map", this.nextMapToUnlock);
    // Attendre un peu avant d'afficher la modal de transition pour éviter les problèmes de rendu
    setTimeout(() => {
      this.showMapTransitionModal = true;
      this.showTransitionAfterVictory = false;
    }, 300);
  } 
  // Gérer le déclenchement d'un boss normal
  else if (triggerBoss && this.currentBoss) {
    console.log("Préparation du dialogue pour le boss", this.currentBoss.id);
    setTimeout(() => {
      this.showNpcDialog = true;
      this.selectedRegion = {
        id: `boss-${this.currentBoss.id}`,
        name: this.currentBoss.name
      };
      this.currentNpc = {
        image: this.currentBoss.bossImage || 'boss-1-anim.gif',
        position: this.currentBoss.bossPosition || 'center',
        dialog: this.currentBoss.dialog,
        actionText: this.currentBoss.actionText || "Affronter le boss"
      };
    }, 500);
  } 
  // Sinon, rafraîchir simplement les régions
  else {
    console.log("Rafraîchissement simple des régions");
    this.refreshRegions();
  }
  console.log("=== FIN FERMETURE MODAL DE VICTOIRE ===");
},

// Correction de continueToNewMap()
async continueToNewMap() {
  console.log("=== DÉBUT TRANSITION VERS NOUVELLE MAP ===");
  console.log("Transition vers map:", this.nextMapToUnlock);
  
  // Fermer le modal de transition
  this.showMapTransitionModal = false;
  this.loading = true;
  
  try {
    if (this.nextMapToUnlock) {
      // Sauvegarder l'ancienne map pour référence
      const oldMapId = this.currentMapId;
      
      // Changer la map actuelle
      this.currentMapId = this.nextMapToUnlock;
      console.log("Map changée de", oldMapId, "à", this.currentMapId);
      
      // Sauvegarder la préférence de map
      explorerService.setCurrentMap(this.currentMapId);
      
      // Charger les régions de la nouvelle map
      await this.loadRegionsForCurrentMap();
      console.log("Régions de la nouvelle map chargées:", this.regions.length);
      
      // Charger les défis pour la nouvelle map
      await this.loadRegionChallenges();
      console.log("Défis de la nouvelle map chargés");
      
      // Trouver la première région disponible
      const defaultRegion = this.regions.find(r => r.is_default && r.map_id === this.currentMapId);
      const firstRegion = defaultRegion || this.regions.find(r => r.map_id === this.currentMapId);
      
      if (firstRegion) {
        console.log("Première région de la nouvelle map identifiée:", firstRegion.name);
        
        // Sélectionner automatiquement la première région après un court délai
        setTimeout(() => {
          console.log("Sélection automatique de la première région");
          this.selectRegion(firstRegion);
        }, 1000);
      } else {
        console.warn("Aucune région trouvée dans la nouvelle map");
      }
    } else {
      console.warn("Aucune map de destination spécifiée");
    }
  } catch (error) {
    console.error("Erreur lors de la transition vers la nouvelle map:", error);
  } finally {
    this.loading = false;
    console.log("=== FIN TRANSITION VERS NOUVELLE MAP ===");
  }
},


// Ajouter cette méthode à ExplorerMap.vue
debugRegions() {
  console.log("DÉBOGAGE DES RÉGIONS:");
  console.log(`Carte active: ${this.currentMapId}`);
  console.log(`Nombre de régions: ${this.regions.length}`);
  
  if (this.regions.length > 0) {
    console.log("Détails des régions:");
    this.regions.forEach(r => {
      console.log(`- ID: ${r.id}, Nom: ${r.name}, Visité: ${r.visited}, Complété: ${r.completed}, Default: ${r.is_default}, Background: ${r.explorerMapBackground}`);
    });
  } else {
    console.log("AUCUNE RÉGION CHARGÉE!");
  }
},

async buyEnergy() {
  if (this.userCoins < 10) {
    alert('Vous n\'avez pas assez de pièces ! 10 pièces sont nécessaires pour acheter 1 point d\'énergie.');
    return;
  }
  try {
    const result = await explorerService.buyEnergy(1);
    this.energy = result.energy;
    this.$emit('coins-updated', result.coins_remaining);
    alert(`Vous avez acheté 1 point d'énergie pour 10 pièces.`);
  } catch (error) {
    console.error('Erreur lors de l\'achat d\'énergie:', error);
    alert(error.response?.data?.message || 'Une erreur est survenue lors de l\'achat d\'énergie');
  }
}
},
mounted() {
  this.loadExplorerData();
},
beforeUnmount() {
  if (this.energyTimer) {
    clearInterval(this.energyTimer);
  }
}
};
</script>