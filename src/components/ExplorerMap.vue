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
            Félicitations ! Vous avez triomphé de <strong>{{ currentBoss ? currentBoss.name : 'le boss' }}</strong> après un combat épique.
          </p>
          
          <!-- Récompenses obtenues -->
          <div class="rewards-container">
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
          <div class="next-steps" v-if="hasUnlockedRegions">
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
          <p>Félicitations, vous avez complété la quête: {{ selectedRegion.name }} !</p>
          
          <div class="rewards-container">
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
          
          <p class="unlock-message" v-if="hasUnlockedRegions">
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
      
      // Propriétés pour le dialogue NPC
      showNpcDialog: false,
      currentNpc: {
        image: 'npc1.png',
        position: 'left',
        dialog: [],
        actionText: 'Commencer à crafter'
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
  if (!this.selectedRegion || !this.selectedRegion.id) return 2; // Valeur par défaut
  
  // Vérifier si c'est un boss (qui ne coûte pas d'énergie)
  if (this.selectedRegion.is_boss || this.selectedRegion.id === 5 || this.selectedRegion.id === 10) {
    return 0;
  }
  
  // Obtenir le coût d'énergie du challenge si disponible
  const challenge = this.regionChallenges[this.selectedRegion.id];
  return challenge?.energyCost || 2; // Utiliser 2 comme valeur par défaut si non spécifié
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
        // La première carte est toujours débloquée
        const maps = [1];
        
        // Vérifier les autres cartes
        for (let i = 2; i <= 3; i++) {
          if (explorerService.isMapUnlocked(i)) {
            maps.push(i);
          }
        }
        
        this.unlockedMaps = maps;
        console.log('Cartes débloquées:', this.unlockedMaps);
      } catch (error) {
        console.error('Erreur lors du chargement des cartes débloquées:', error);
        this.unlockedMaps = [1]; // Par défaut, seulement la première carte
      }
    },
    
    // Méthode pour charger les régions de la carte active
    async loadRegionsForCurrentMap() {
      try {
        const regionsData = await explorerService.getRegions(this.currentMapId);
        this.regions = regionsData;
        console.log(`Régions chargées pour la carte ${this.currentMapId}:`, this.regions.length);
      } catch (error) {
        console.error(`Erreur lors du chargement des régions pour la carte ${this.currentMapId}:`, error);
        this.regions = [];
      }
    },
    
    // Méthode pour changer de carte
    async changeMap() {
      this.loading = true;
      
      try {
        // Sauvegarder le changement de carte
        explorerService.setCurrentMap(this.currentMapId);
        
        // Recharger les régions pour la nouvelle carte
        await this.loadRegionsForCurrentMap();
        
        // Recharger les défis pour la nouvelle carte
        await this.loadRegionChallenges();
      } catch (error) {
        console.error(`Erreur lors du changement à la carte ${this.currentMapId}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    // Méthode pour obtenir l'image de la carte actuelle de manière dynamique
getCurrentMapImage() {
  console.log("Récupération de l'image de la carte", this.currentMapId);
  console.log("Régions disponibles:", this.regions.length);
  
  try {
    // Si nous avons des régions pour cette carte
    if (this.regions.length > 0) {
      // Trouver une région avec une explorerMapBackground définie
      const regionWithBackground = this.regions.find(r => r.explorerMapBackground);
      
      if (regionWithBackground) {
        console.log("Fond de carte trouvé:", regionWithBackground.explorerMapBackground);
        return require(`@/assets/maps/${regionWithBackground.explorerMapBackground}`);
      }
      
      // Si aucune région n'a de background explicite, utiliser un nom par défaut basé sur l'ID de la carte
      console.log("Utilisation du fond de carte par défaut pour l'ID:", this.currentMapId);
      return require(`@/assets/maps/world-map${this.currentMapId}.png`);
    } else {
      // Si pas de régions, utiliser l'ID de carte pour déterminer l'image
      console.log("Pas de régions, utilisation du fond de carte par défaut pour l'ID:", this.currentMapId);
      return require(`@/assets/maps/world-map${this.currentMapId}.png`);
    }
  } catch (error) {
    console.error("Erreur lors du chargement de l'image de carte:", error);
    return require('@/assets/maps/world-map.png');
  }
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
      if (!region) return 1;
      
      // Vérifier si la région a une propriété explorerMapBackground
      if (region.explorerMapBackground) {
        if (region.explorerMapBackground.includes('world-map2')) {
          return 2;
        } else {
          return 1;
        }
      }
      
      // Sinon utiliser l'ID (≤ 5 = carte 1, > 5 = carte 2)
      return region.id <= 5 ? 1 : 2;
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
  this.regionChallenges = {
    1: {
      npcImage: 'npc1.png',
      npcPosition: 'left',
      dialog: [
        "Bienvenue, explorateur !",
        "Je crains que nous ayons rencontré un problème pour charger les défis.",
        "Essaie de combiner les éléments fondamentaux pour avancer."
      ],
      requiredElements: ["Vie"],
      availableElements: ["Eau", "Feu", "Terre", "Air"],
      elementsWithGifs: ["Eau", "Feu", "Terre", "Air"],
      background: null,
      explorerMapBackground: "world-map.png",
      actionText: "Commencer",
      energyCost: 2,
      energyReward: 5,
      rewardCoins: 50,
      rewardXp: 100,
      unlockHint: "Essayez de combiner différents éléments"
    }
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
    
    selectRegion(region) {
      if (!this.isRegionUnlocked(region)) {
        alert('Cette région est verrouillée. Complétez les régions précédentes pour la débloquer.');
        return;
      }
      this.selectedRegion = region;
      this.showNpcDialog = true;
      if (this.regionChallenges[region.id]) {
        const challenge = this.regionChallenges[region.id];
        if (challenge.interactions && challenge.interactions.length > 0) {
          this.selectedRegion = {
            ...region,
            interactions: challenge.interactions
          };
          this.currentNpc = {
            image: challenge.npcImage,
            position: challenge.npcPosition || 'left',
            dialog: challenge.dialog,
            actionText: challenge.actionText
          };
        } else {
          this.currentNpc = {
            image: challenge.npcImage,
            position: challenge.npcPosition || 'left',
            dialog: challenge.dialog,
            actionText: challenge.actionText
          };
        }
      } else {
        this.currentNpc = {
          image: 'npc1.png',
          position: 'left',
          dialog: [
            `Bienvenue dans ${region.name}, explorateur !`,
            "Cette région est pleine de mystères à découvrir.",
            "Essaie de combiner les éléments fondamentaux pour découvrir les secrets de cet endroit."
          ],
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
        const energyCost = this.regionChallenges[region.id]?.energyCost || 2;
console.log(`Région: ${region.id}, Coût d'énergie: ${energyCost}`);
        explorerService.visitRegion(region.id).catch(err => {
          console.error("Erreur lors de la visite de la région du boss:", err);
        });
      }
      return;
    }
    
    // Récupérer le coût d'énergie dynamique pour cette région
    const energyCost = this.regionChallenges[region.id]?.energyCost || 2;
    
    // Traitement normal pour les régions standards
    const result = await explorerService.visitRegion(region.id, energyCost);
    this.energy = result.energy;
    this.currentChallenge = this.regionChallenges[region.id] || {
      requiredElements: [],
      dialog: [],
      unlockHint: "Essayez de combiner différents éléments pour découvrir le secret."
    };
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

handleTargetElementCreated(element) {
  console.log(`Élément cible créé: ${element}`);
},

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
    const rewardCoins = this.regionChallenges[region.id]?.rewardCoins || 50;
    const rewardXp = this.regionChallenges[region.id]?.rewardXp || 100;
    const rewardEnergy = this.regionChallenges[region.id]?.energyReward || 5;
    this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
    this.victoryRewards = {
      coins: rewardCoins,
      xp: rewardXp,
      energy: rewardEnergy,
      hasBoss: hasBoss
    };
    this.$emit('coins-updated', this.userCoins + rewardCoins);
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
    explorerService.completeRegion(regionData.id, {
      coins: rewardCoins,
      energy: rewardEnergy,
      xp: rewardXp,
      hasBoss: hasBoss,
      bossDefeated: false
    }).then(response => {
      console.log('Réponse du service pour complétion de région:', response);
      if (response && response.rewards) {
        if (response.rewards.coins !== undefined && response.rewards.coins !== this.userCoins + rewardCoins) {
          this.$emit('coins-updated', response.rewards.coins);
        }
        if (response.rewards.energy !== undefined && response.rewards.energy !== this.energy) {
          this.energy = response.rewards.energy;
        }
      }
    }).catch(error => {
      console.error(`Erreur lors de la complétion de la région ${regionData.id}:`, error);
    });
  }
},

handleBossVictory() {
  if (!this.currentBoss) return;
  
  // Sauvegarder les informations du boss vaincu
  this.lastDefeatedBoss = { ...this.currentBoss };
  
  const rewardCoins = this.currentBoss.rewardCoins || 500;
  const rewardXp = this.currentBoss.rewardXp || 1000;
  const rewardEnergy = this.regionChallenges[this.currentBoss.id]?.energyReward || 10;
  const regionId = this.currentBoss.trigger_after_region;
  const bossId = this.currentBoss.id;
  
  console.log("Boss vaincu pour la région:", regionId);
  this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
  
  // Marquer la région associée comme complétée
  const associatedRegion = this.regions.find(r => r.id === regionId);
  if (associatedRegion) {
    associatedRegion.completed = true;
    associatedRegion.progress = 100;
    console.log("Région associée marquée complétée:", associatedRegion.name);
  }
  
  // Créer ou mettre à jour la région du boss
  const bossRegion = this.regions.find(r => r.id === bossId);
  if (bossRegion) {
    bossRegion.completed = true;
    bossRegion.visited = true;
    bossRegion.progress = 100;
    console.log("Région du boss marquée complétée:", bossRegion.name);
  }
  
  // Préparer les récompenses
  this.victoryRewards = {
    coins: rewardCoins,
    xp: rewardXp,
    energy: rewardEnergy,
    isBossReward: true
  };
  
  // Mettre à jour les pièces de l'utilisateur
  this.$emit('coins-updated', this.userCoins + rewardCoins);
  
  // Vérifier si c'est le boss de fin de la première map (ID 5)
  // pour montrer la modale de transition de carte après
  if (bossId === 5) {
    // Enregistrer la transition de carte à montrer après
    this.showTransitionAfterVictory = true;
    this.mapTransitionRewards = {
      coins: rewardCoins,
      xp: rewardXp,
      energy: rewardEnergy
    };
  } else {
    this.showTransitionAfterVictory = false;
  }
  
  // Afficher la modale de victoire standard
  this.showVictoryModal = true;
  
  // Enregistrer la victoire sur le boss via le service
  explorerService.completeBoss(bossId, {
    coins: rewardCoins,
    energy: rewardEnergy,
    xp: rewardXp,
    regionId: regionId,
    bossRegionId: bossId
  }).then(response => {
    console.log('Boss vaincu - réponse du serveur:', response);
    
    // Si c'est le boss de la première map (ID 5), débloquer la deuxième map
    if (bossId === 5) {
      explorerService.unlockNextMap(2);
      this.loadUnlockedMaps(); // Actualiser la liste des cartes débloquées
    }
    
    this.refreshRegions();
  }).catch(error => {
    console.error(`Erreur lors de l'enregistrement de la victoire du boss ${bossId}:`, error);
  });
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

closeVictoryModal() {
  const triggerBoss = this.victoryRewards?.triggerBoss;
  this.showVictoryModal = false;
  
  // Si la victoire était sur le boss de la première map et qu'on a prévu une transition
  if (this.showTransitionAfterVictory && this.lastDefeatedBoss && this.lastDefeatedBoss.id === 5) {
    // Afficher la modale de transition entre les cartes
    this.currentMapId = 2;
    this.showMapTransitionModal = true;
    this.showTransitionAfterVictory = false;
  } 
  // Sinon, gérer le boss normal s'il a été déclenché
  else if (triggerBoss && this.currentBoss) {
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
  // Sinon, rafraîchir simplement l'affichage des régions
  else {
    this.$nextTick(() => {
      const temp = [...this.regions];
      this.regions = [];
      this.$nextTick(() => {
        this.regions = temp;
      });
    });
  }
},

// Méthode appelée lorsque l'utilisateur continue vers la nouvelle carte
async continueToNewMap() {
  this.showMapTransitionModal = false;
  this.loading = true; // Activer l'indicateur de chargement
  
  try {
    console.log(`Transition vers la carte ${this.currentMapId}`);
    
    // Mise à jour de la carte active
    explorerService.setCurrentMap(this.currentMapId);
    
    // Vider les régions actuelles pour éviter les conflits
    this.regions = [];
    
    // Attendre que le DOM soit mis à jour
    await this.$nextTick();
    
    // Charger directement depuis le JSON pour s'assurer d'avoir toutes les régions
    const response = await axios.get('/data/regionChallenges.json');
    const allRegions = response.data.regions;
    
    // Filtrer les régions pour la carte active (2 dans ce cas)
    const filteredRegions = allRegions.filter(r => {
      if (this.currentMapId === 1) return r.id >= 1 && r.id <= 5;
      if (this.currentMapId === 2) return r.id >= 6 && r.id <= 10;
      return true;
    });
    
    console.log(`Régions filtrées pour carte ${this.currentMapId}:`, filteredRegions.length);
    
    // Ajouter les propriétés nécessaires à chaque région
    const processedRegions = filteredRegions.map(r => ({
      ...r,
      visited: r.id === (this.currentMapId === 1 ? 1 : 6), // Marquer la première région comme visitée
      completed: false,
      progress: 0,
      is_default: (this.currentMapId === 1 && r.id === 1) || (this.currentMapId === 2 && r.id === 6),
      explorerMapBackground: this.currentMapId === 1 ? "world-map.png" : "world-map2.png"
    }));
    
    // Définir les régions
    this.regions = processedRegions;
    
    // Charger les défis des régions
    await this.loadRegionChallenges();
    
    console.log(`${this.regions.length} régions chargées pour la carte ${this.currentMapId}`);
    
    // Imprimer les détails des régions pour débogage
    this.regions.forEach(region => {
      console.log(`Région: ${region.id} (${region.name}), Position: ${region.position_x},${region.position_y}, Default: ${region.is_default}`);
    });
    
    // Forcer un rafraîchissement de l'affichage
    const temp = [...this.regions];
    this.regions = [];
    await this.$nextTick();
    this.regions = temp;
    
    this.loading = false;
  } catch (error) {
    console.error(`Erreur lors de la transition vers la carte ${this.currentMapId}:`, error);
    this.loading = false;
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