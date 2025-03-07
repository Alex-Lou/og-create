<template>
  <div class="explorer-container">
    <div class="energy-info">
      <MapSelector
        :current-map-id="currentMapId"
        :unlocked-maps="unlockedMaps"
        :regions="regions"
        @map-change="handleMapChange"
      />

      <!-- Close Button with Tooltip -->
      <button 
        class="back-btn-explorer back-btn-explorer-tooltip" 
        @click="showExitConfirmationModal = true"
      >
        X
        <span class="tooltip">Quitter le mode Explorer</span>
      </button>

      <EnergyDisplayExplorer 
        :energy="energy"
        :maxEnergy="maxEnergy"
        :nextEnergyIn="nextEnergyIn"
        :userCoins="userCoins"
        :showBuyButton="true"
        :energyCost="10"
        @energy-updated="handleEnergyUpdated"
        @coins-updated="handleCoinsUpdated"
        @show-alert="showAlert"
      />
    </div>
    
    <ExitConfirmationModal
      :visible="showExitConfirmationModal"
      @confirm="confirmExit"
      @cancel="showExitConfirmationModal = false"
    />

    <div class="map-container">
      <img :src="getCurrentMapImage()" alt="Carte d'exploration" class="map-image" />
      
      <RegionMarker
        v-for="region in regions"
        :key="region.id"
        :region="region"
        :isUnlocked="isRegionUnlocked(region)"
        @region-click="selectRegion(region)"
      />
    </div>
    
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

    <ExplorerVictoryModal
      :showModal="showVictoryModal"
      :victoryRewards="victoryRewards"
      :regionName="selectedRegion ? selectedRegion.name : ''"
      :boss="currentBoss"
      :bossDefeatedImage="currentBoss ? getBossDefeatedImage(currentBoss.id) : ''"
      :hasUnlockedRegions="hasUnlockedRegions"
      @close="closeVictoryModal"
    />

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
import mapUtils from '@/utils/mapUtils';
import NpcDialog from './NpcDialog.vue';
import ExplorerCraftModal from './ExplorerCraftModal.vue';
import MapTransitionModal from './MapTransitionModal.vue';
import RegionMarker from './RegionMarker.vue';
import EnergyDisplayExplorer from './EnergyDisplayExplorer.vue';
import ExplorerVictoryModal from './ExplorerVictoryModal.vue';
import MapSelector from './MapSelector.vue';
import ExitConfirmationModal from './ExitConfirmationModal.vue';
import axios from 'axios';

export default {
  name: 'ExplorerMap',
  components: {
    NpcDialog,
    ExplorerCraftModal,
    MapTransitionModal,
    RegionMarker,
    EnergyDisplayExplorer,
    ExplorerVictoryModal,
    MapSelector,
    ExitConfirmationModal 
  },
  props: {
    userCoins: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      mapUtils, // Fournir les utilitaires de carte au template
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
      defaultImages: {
        bossDefeated: 'boss-1-dead.png'
      },
      
      showNpcDialog: false,
      currentChallengeCost: 0,
      currentNpc: {
        image: null,
        position: null,
        dialog: [],
        actionText: null
      },
      regionChallenges: {},
      
      showCraftModal: false,
      currentChallenge: null,
      
      showVictoryModal: false,
      victoryRewards: null,

      currentRegionId: null,     // ID de la région actuellement visitée
      currentEnergyCost: 0, 
      
      bosses: [],
      currentBoss: null,
      lastDefeatedBoss: null,
      
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
    isRegionUnlocked(region) {
      return mapUtils.isRegionUnlocked(region, this.regions);
    },

    handleEnergyUpdated(newEnergy) {
      this.energy = newEnergy;
    },
    
    getRegionStyle(region) {
      return mapUtils.getRegionStyle(region);
    },

    showAlert(message) {
      alert(message);
    },
    
    getCurrentMapImage() {
      return mapUtils.getMapImage(this.currentMapId);
    },
    
    getBossDefeatedImage(bossId) {
      return mapUtils.getBossDefeatedImage(bossId, this.regions, this.regionChallenges, this.defaultImages);
    },
    
    getCurrentEnergyCost() {
      if (!this.selectedRegion) return 2;
      
      if (this.selectedRegion.is_boss) {
        return 0;
      }
      
      const challenge = this.regionChallenges[this.selectedRegion.id];
      return challenge?.energyCost !== undefined ? challenge.energyCost : 2;
    },

    handleCoinsUpdated(newCoins) {
      this.coins = newCoins;
      this.$emit('coins-updated', newCoins);
    },

    async confirmExit() {
  // Si on est en train d'abandonner un défi qui coûte de l'énergie
  if (this.currentRegionId && !this.selectedRegion?.is_boss && this.currentEnergyCost > 0) {
    try {
      // Rafraîchir l'énergie pour s'assurer que la valeur affichée est correcte
      const energyData = await explorerService.checkEnergy();
      this.energy = energyData.energy;
      
      // Émettre un événement pour mettre à jour le parent
      this.$emit('energy-updated', this.energy);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'énergie:', error);
    }
  }

  // Fermer tous les modaux
  this.showCraftModal = false;
  this.showNpcDialog = false;
  this.showVictoryModal = false;
  this.showMapTransitionModal = false;
  this.showExitConfirmationModal = false;
  
  // Réinitialiser les trackers de région et d'énergie
  this.currentRegionId = null;
  this.currentEnergyCost = 0;
  
  // Réinitialiser les autres variables d'état
  this.selectedRegion = null;
  this.currentBoss = null;
  this.currentChallenge = null;
  
  // Émettre l'événement de fermeture
  setTimeout(() => {
    this.$emit('close');
  }, 50);
},
    
    async loadExplorerData() {
      try {
        this.loading = true;
        
        try {
          await explorerService.syncRegions();
        } catch (syncError) {
          console.warn('Synchronisation des régions échouée, utilisation des données existantes', syncError);
        }
        
        const initData = await explorerService.initExplorer();
        this.energy = initData.energy;
        this.maxEnergy = initData.max_energy || 20;
        this.nextEnergyIn = initData.next_energy_in;
        this.currentMapId = initData.currentMap || 1;
        
        this.loadUnlockedMaps();
        
        await this.loadRegionsForCurrentMap();
        
        await this.loadRegionChallenges();
        
        this.startEnergyTimer();
      } catch (error) {
        console.error('Erreur lors du chargement des données Explorer:', error);
      } finally {
        this.loading = false;
      }
    },
    
    // Charge les cartes débloquées depuis explorerService
    loadUnlockedMaps() {
      this.unlockedMaps = mapUtils.loadUnlockedMaps();
    },
    
    // Charge les régions pour la carte actuelle
    async loadRegionsForCurrentMap() {
      try {
        // Appeler le service pour récupérer les régions filtrées par map
        const regionsData = await explorerService.getRegions(this.currentMapId);
        
        if (regionsData.length === 0) {
          console.warn(`Aucune région trouvée pour la map ${this.currentMapId}`);
        }
        
        // Traiter les régions reçues pour s'assurer que chaque région a les propriétés nécessaires
        const processedRegions = regionsData.map(region => {
          if (!region.map_id) {
            region.map_id = this.currentMapId;
          }
          
          // Identification de la première région de la carte
          let firstRegionInMap = null;
          if (regionsData.length > 0) {
            const regionsInMap = regionsData.filter(r => r.map_id === this.currentMapId);
            if (regionsInMap.length > 0) {
              firstRegionInMap = regionsInMap.reduce((prev, curr) => (prev.id < curr.id) ? prev : curr);
            }
          }
          
          // Si c'est la première région et que la carte n'est pas la première
          if (firstRegionInMap && region.id === firstRegionInMap.id && this.currentMapId > 1) {
            return { ...region, is_default: true };
          }
          
          return region;
        });
        
        this.regions = processedRegions;
        
        return this.regions;
      } catch (error) {
        console.error(`Erreur lors du chargement des régions pour la carte ${this.currentMapId}:`, error);
        this.regions = [];
        return [];
      }
    },
    
    // Change la carte active
    async handleMapChange(newMapId) {
      this.currentMapId = newMapId;
      this.loading = true;
      
      try {
        // Sauvegarder le changement de carte
        explorerService.setCurrentMap(this.currentMapId);
        
        // Recharger les régions pour la nouvelle carte
        await this.loadRegionsForCurrentMap();
        
        // Recharger les défis pour la nouvelle carte
        await this.loadRegionChallenges();
        
        // Mettre en évidence les régions disponibles
        this.highlightAvailableRegions();
      } catch (error) {
        console.error(`Erreur lors du changement à la carte ${this.currentMapId}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    // Mise en évidence des régions disponibles
    highlightAvailableRegions() {
      mapUtils.highlightAvailableRegions(this.regions, this.currentMapId);
    },
    
    // Force le rechargement des régions
    async forceRegionsReload() {
      // Vider l'array de régions
      this.regions = [];
      
      // Attendre le prochain cycle de rendu
      await this.$nextTick();
      
      try {
        const regionData = await explorerService.getRegions(this.currentMapId, true);
        
        // Trouver la première région de la carte actuelle
        if (regionData.length > 0) {
          const regionsInCurrentMap = regionData.filter(r => r.map_id === this.currentMapId);
          if (regionsInCurrentMap.length > 0) {
            const sortedRegions = [...regionsInCurrentMap].sort((a, b) => a.id - b.id);
            const firstRegion = sortedRegions[0];
            
            // Marquer la première région comme default
            const processedRegions = regionData.map(r => {
              if (r.id === firstRegion.id) {
                return { ...r, is_default: true };
              }
              return r;
            });
            
            this.regions = processedRegions;
          } else {
            this.regions = regionData;
          }
        } else {
          this.regions = regionData;
        }
        
        // Recharger les défis des régions
        await this.loadRegionChallenges();
        
      } catch (error) {
        console.error("Erreur lors du rechargement forcé des régions:", error);
      }
    },
    
    // Charge les défis des régions
    async loadRegionChallenges() {
      try {
        // Charger le fichier JSON
        const response = await axios.get('/data/regionChallenges.json');
        const regionChallengesData = response.data;
        const challenges = {};
        
        // Traiter toutes les régions
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
          
          // Si c'est un boss, l'ajouter à this.bosses
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
    
    // Configuration des défis par défaut
    setupDefaultChallenges() {
      const defaultChallengeConfig = mapUtils.getDefaultChallengeConfig(this.currentMapId);
      this.regionChallenges = {
        1: defaultChallengeConfig
      };
    },
    
    // Démarrage du timer d'énergie
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
    
    // Sélection d'une région
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
        // Fallback si aucun challenge n'est trouvé
        let defaultDialog = [
          `Bienvenue dans ${region.name}, explorateur !`,
          "Cette région est pleine de mystères à découvrir.",
          "Essaie de combiner les éléments fondamentaux pour découvrir les secrets de cet endroit."
        ];
        
        this.currentNpc = {
          image: 'npc1.png',
          position: 'left',
          dialog: defaultDialog,
          actionText: "Commencer à crafter"
        };
      }
    },
    
    // Vérifie si un boss est déclenché
    checkBossTrigger(regionId) {
      return mapUtils.checkBossTrigger(regionId, this.regions, this.regionChallenges);
    },
    
    // Ferme le dialogue NPC
    closeNpcDialog() {
      this.showNpcDialog = false;
    },
    
    // Démarre un défi de craft
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
    
    // Vérifier si l'utilisateur a assez d'énergie avant de commencer
    if (this.energy < energyCost) {
      alert(`Vous n'avez pas assez d'énergie pour explorer cette région (coût: ${energyCost} ⚡)`);
      return;
    }
    
    // Stocker la région et le coût pour référence en cas d'abandon
    this.currentRegionId = region.id;
    this.currentEnergyCost = energyCost;
    
    // Traitement normal pour les régions standards
    const result = await explorerService.visitRegion(region.id, energyCost);
    
    // Mettre à jour l'énergie
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

    // Gère la création d'un élément
// Gère la création d'un élément
handleCraftSuccess(craftedItem) {
      this.$emit('element-discovered', craftedItem);
    },

    // Gère la complétion d'un défi
    async handleChallengeCompleted({ region, isBoss }) {
      // Fermeture du modal de craft
      this.showCraftModal = false;
      
      // Si le défi concernait un boss, déclencher la victoire du boss
      if (isBoss) {
        await this.handleBossVictory();
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
        
        try {
          // Appeler le service pour enregistrer la complétion de la région
          const response = await explorerService.completeRegion(regionData.id, {
            coins: rewardCoins,
            energy: rewardEnergy,
            xp: rewardXp,
            hasBoss: hasBoss,
            bossDefeated: false
          });
          
          // Si le serveur a retourné des récompenses, utiliser ces valeurs
          if (response && response.rewards) {
            if (response.rewards.coins !== undefined && !wasAlreadyCompleted) {
              this.$emit('coins-updated', response.rewards.coins);
            }
            
            if (response.rewards.energy !== undefined) {
              this.energy = response.rewards.energy;
            }
          }
          
          // Si le serveur a retourné des régions débloquées, les ajouter
          if (response && response.unlockedRegions && response.unlockedRegions.length > 0) {
            this.victoryRewards.unlockedRegions = response.unlockedRegions;
          }
          
        } catch (error) {
          console.error(`Erreur lors de la complétion de la région ${regionData.id}:`, error);
        }
      }
    },

    // Gère la victoire contre un boss
    async handleBossVictory() {
      if (!this.currentBoss) return;
      
      console.log("=== DÉBUT TRAITEMENT VICTOIRE DE BOSS ===");
      
      this.lastDefeatedBoss = { ...this.currentBoss };
      const bossId = this.currentBoss.id;
      
      const isAlreadyDefeated = await explorerService.isBossDefeated(bossId);
      
      const rewardCoins = isAlreadyDefeated ? 0 : (this.currentBoss.rewardCoins || 500);
      const rewardXp = isAlreadyDefeated ? 0 : (this.currentBoss.rewardXp || 1000);
      const rewardEnergy = isAlreadyDefeated ? 0 : (this.regionChallenges[this.currentBoss.id]?.energyReward || 10);
      const regionId = this.currentBoss.trigger_after_region;
      
      if (!isAlreadyDefeated) {
        this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
      }
      
      const associatedRegion = this.regions.find(r => r.id === regionId);
      if (associatedRegion) {
        associatedRegion.completed = true;
        associatedRegion.progress = 100;
      }
      
      const bossRegion = this.regions.find(r => r.id === bossId);
      if (bossRegion) {
        bossRegion.completed = true;
        bossRegion.visited = true;
        bossRegion.progress = 100;
        bossRegion.boss_defeated = true; // Marquer le boss comme vaincu
      }
      
      this.victoryRewards = {
        coins: rewardCoins,
        xp: rewardXp,
        energy: rewardEnergy,
        isBossReward: true,
        alreadyDefeated: isAlreadyDefeated
      };
      
      if (!isAlreadyDefeated) {
        this.$emit('coins-updated', this.userCoins + rewardCoins);
      }
      
      const nextMapId = this.currentMapId + 1;
      
      const isFinalBoss = await mapUtils.isFinalBoss(bossRegion, this.regions, this.currentMapId);
      
      if (isFinalBoss) {
        try {
          const mapExists = await explorerService.isMapUnlocked(nextMapId);
          
          if (mapExists) {
            this.showTransitionAfterVictory = true;
            this.nextMapToUnlock = nextMapId;
            this.mapTransitionRewards = {
              coins: rewardCoins,
              xp: rewardXp,
              energy: rewardEnergy
            };
          } else {
            this.showTransitionAfterVictory = false;
          }
        } catch (e) {
          console.error("Erreur lors de la vérification de la map suivante:", e);
          this.showTransitionAfterVictory = true;
          this.nextMapToUnlock = nextMapId;
        }
      } else {
        this.showTransitionAfterVictory = false;
      }
      
      this.showVictoryModal = true;
      
      if (!isAlreadyDefeated) {
        try {
          const response = await explorerService.completeBoss(bossId, {
            coins: rewardCoins,
            energy: rewardEnergy,
            xp: rewardXp,
            regionId: regionId,
            bossRegionId: bossId
          });
          
          // Si le serveur a retourné des récompenses, utiliser ces valeurs
          if (response && response.rewards) {
            if (response.rewards.coins !== undefined) {
              this.$emit('coins-updated', response.rewards.coins);
            }
            
            if (response.rewards.energy !== undefined) {
              this.energy = response.rewards.energy;
            }
          }
          await this.forceRegionsReload();
          
          if (isFinalBoss) {
            setTimeout(async () => {
              await explorerService.refreshUnlockedMaps();
              await this.loadUnlockedMaps();
            }, 500);
          }
          
        } catch (error) {
          console.error(`Erreur lors de l'enregistrement de la victoire du boss ${bossId}:`, error);
        }
      } else {
        await this.refreshRegions();
      }
    },

    async forceUnlockedMapsRefresh() {      
      try {
        await explorerService.refreshUnlockedMaps();
        await this.loadUnlockedMaps();
        console.log("Cartes débloquées après rafraîchissement:", this.unlockedMaps);
        return this.unlockedMaps;
      } catch (error) {
        console.error("Erreur lors du rafraîchissement forcé des cartes débloquées:", error);
        return this.unlockedMaps;
      }
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

    // Ferme le modal de craft
    async closeCraftModal() {
      // Vérifier si on est en train d'abandonner un défi qui coûte de l'énergie
      if (this.currentRegionId && !this.selectedRegion?.is_boss && this.currentEnergyCost > 0) {
        try {
          // Rafraîchir l'énergie pour s'assurer que la valeur affichée est correcte
          const energyData = await explorerService.checkEnergy();
          this.energy = energyData.energy;
          
          // Émettre un événement pour mettre à jour le parent
          this.$emit('energy-updated', this.energy);
          
          console.log(`Défi abandonné pour la région ${this.currentRegionId}. Énergie actuelle: ${this.energy}`);
        } catch (error) {
          console.error('Erreur lors de la fermeture du modal de craft:', error);
        }
      }
      
      // Réinitialiser les trackers de région et d'énergie
      this.currentRegionId = null;
      this.currentEnergyCost = 0;
      
      // Fermer le modal
      this.showCraftModal = false;
    },


    // Gère la création d'un élément cible
    handleTargetElementCreated(element) {
      console.log(`Élément cible créé: ${element}`);
    },

    // Ferme le modal de victoire
    closeVictoryModal() {
      
      // Fermer le modal de victoire
      this.showVictoryModal = false;
      
      const triggerBoss = this.victoryRewards?.triggerBoss;
      
      if (this.showTransitionAfterVictory && this.nextMapToUnlock) {
        console.log("Affichage du modal de transition vers map", this.nextMapToUnlock);
        setTimeout(() => {
          this.showMapTransitionModal = true;
          this.showTransitionAfterVictory = false;
        }, 300);
      } 
      // Gérer le déclenchement d'un boss normal
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
      else {
        this.refreshRegions();
      }
    },

    async refreshEnergy() {
      try {
        const energyData = await explorerService.checkEnergy();
        if (energyData && energyData.energy !== undefined) {
          this.energy = energyData.energy;
          this.$emit('energy-updated', this.energy);
        }
        return this.energy;
      } catch (error) {
        console.error('Erreur lors du rafraîchissement de l\'énergie:', error);
        return this.energy;
      }
    },

    // Modifier la méthode continueToNewMap :

    async continueToNewMap() {
      this.showMapTransitionModal = false;
      this.loading = true;
      
      try {
        if (this.nextMapToUnlock) {
          // Utiliser oldMapId pour du logging ou le supprimer si non nécessaire
          const oldMapId = this.currentMapId;
          console.log(`Passage de la carte ${oldMapId} à la carte ${this.nextMapToUnlock}`);
          
          this.currentMapId = this.nextMapToUnlock;
          
          explorerService.setCurrentMap(this.currentMapId);
          
          await this.loadRegionsForCurrentMap();
          
          await this.loadRegionChallenges();
          
          const defaultRegion = this.regions.find(r => r.is_default && r.map_id === this.currentMapId);
          const firstRegion = defaultRegion || this.regions.find(r => r.map_id === this.currentMapId);
          
          if (firstRegion) {
            console.log("Première région de la nouvelle map identifiée:", firstRegion.name);
            
            setTimeout(() => {
              this.selectRegion(firstRegion);
            }, 1000);
          } else {
            console.warn("Aucune région trouvée dans la nouvelle map");
          }
        } else {
          console.warn("Aucune map de destination spécifiée");
        }
      } catch (error) {
        // Ne pas laisser le bloc catch vide
        console.error("Erreur lors du passage à la nouvelle carte:", error);
      } finally {
        this.loading = false;
      }
    },

    // Pour déboguer les régions
    debugRegions() {
      
      if (this.regions.length > 0) {
        console.log("Détails des régions:");
        this.regions.forEach(r => {
          console.log(`- ID: ${r.id}, Nom: ${r.name}, Visité: ${r.visited}, Complété: ${r.completed}, Default: ${r.is_default}, Background: ${r.explorerMapBackground}`);
        });
      } else {
        console.log("AUCUNE RÉGION CHARGÉE!");
      }
    },
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