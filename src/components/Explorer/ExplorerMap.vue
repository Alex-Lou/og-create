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
      v-if="showVictoryModal"
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
      :newMapId="nextMapToUnlock || currentMapId"
      :rewards="mapTransitionRewards"
      @continue-to-new-map="continueToNewMap"
    />
  </div>
</template>

<script>
import '@/assets/ComponentsStyle/ExplorerStyle/ExplorerMapStyle.css';
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
import notificationService from '@/services/notificationService';
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
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mapUtils,
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

      currentRegionId: null,
      currentEnergyCost: 0, 
      
      bosses: [],
      currentBoss: null,
      lastDefeatedBoss: null,
      
      showMapTransitionModal: false,
      mapTransitionRewards: null,
      showTransitionAfterVictory: false,
      
      dataLoaded: false
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
  watch: {
    active(newValue) {
      if (newValue) {
        this.resumeActivity();
      } else {
        this.suspendActivity();
      }
    }
  },
  methods: {
    suspendActivity() {
      if (this.energyTimer) {
        clearInterval(this.energyTimer);
        this.energyTimer = null;
      }
    },
    
    resumeActivity() {
      if (!this.dataLoaded) {
        this.loadExplorerData();
      } else if (!this.energyTimer) {
        this.startEnergyTimer();
        this.refreshData();
      }
    },
    
    refreshData() {
      this.refreshEnergy();
      this.refreshRegions();
    },
    
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
      notificationService.info(message);
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
      if (this.currentRegionId && !this.selectedRegion?.is_boss && this.currentEnergyCost > 0) {
        try {
          const energyData = await explorerService.checkEnergy();
          this.energy = energyData.energy;
          
          this.$emit('energy-updated', this.energy);
        } catch (error) {
          console.error('Erreur lors du rafraîchissement de l\'énergie:', error);
        }
      }

      this.showCraftModal = false;
      this.showNpcDialog = false;
      this.showVictoryModal = false;
      this.showMapTransitionModal = false;
      this.showExitConfirmationModal = false;
      
      this.currentRegionId = null;
      this.currentEnergyCost = 0;
      
      this.selectedRegion = null;
      this.currentBoss = null;
      this.currentChallenge = null;
      
      setTimeout(() => {
        this.$emit('close');
      }, 50);
    },
    
    async loadExplorerData() {
      if (!this.active) return;
      
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
        this.dataLoaded = true;
      } catch (error) {
        console.error('Erreur lors du chargement des données Explorer:', error);
      } finally {
        this.loading = false;
      }
    },
    
    loadUnlockedMaps() {
      this.unlockedMaps = mapUtils.loadUnlockedMaps();
    },
    
    async loadRegionsForCurrentMap() {
      if (!this.active) return [];
      
      try {
        const regionsData = await explorerService.getRegions(this.currentMapId);
        
        if (regionsData.length === 0) {
          console.warn(`Aucune région trouvée pour la map ${this.currentMapId}`);
        }
        
        const processedRegions = regionsData.map(region => {
          if (!region.map_id) {
            region.map_id = this.currentMapId;
          }
          
          let firstRegionInMap = null;
          if (regionsData.length > 0) {
            const regionsInMap = regionsData.filter(r => r.map_id === this.currentMapId);
            if (regionsInMap.length > 0) {
              firstRegionInMap = regionsInMap.reduce((prev, curr) => (prev.id < curr.id) ? prev : curr);
            }
          }
          
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
    
    async handleMapChange(newMapId) {
      if (!this.active) return;
      
      this.currentMapId = newMapId;
      this.loading = true;
      
      try {
        explorerService.setCurrentMap(this.currentMapId);
        
        await this.loadRegionsForCurrentMap();
        
        await this.loadRegionChallenges();
        
        this.highlightAvailableRegions();
      } catch (error) {
        console.error(`Erreur lors du changement à la carte ${this.currentMapId}:`, error);
      } finally {
        this.loading = false;
      }
    },
    
    highlightAvailableRegions() {
      mapUtils.highlightAvailableRegions(this.regions, this.currentMapId);
    },
    
    async forceRegionsReload() {
      if (!this.active) return;
      
      this.regions = [];
      
      await this.$nextTick();
      
      try {
        const regionData = await explorerService.getRegions(this.currentMapId, true);
        
        if (regionData.length > 0) {
          const regionsInCurrentMap = regionData.filter(r => r.map_id === this.currentMapId);
          if (regionsInCurrentMap.length > 0) {
            const sortedRegions = [...regionsInCurrentMap].sort((a, b) => a.id - b.id);
            const firstRegion = sortedRegions[0];
            
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
        
        await this.loadRegionChallenges();
        
      } catch (error) {
        console.error("Erreur lors du rechargement forcé des régions:", error);
      }
    },
    
    async loadRegionChallenges() {
      if (!this.active) return;
      
      try {
        const response = await axios.get('/data/regionChallenges.json');
        const regionChallengesData = response.data;
        const challenges = {};
        
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
            is_boss: region.is_boss || false,
            bossCombatRules: region.bossCombatRules || null,
            maxHealth: region.maxHealth || null,
            damagePerElement: region.damagePerElement || null,
            bossImage: region.bossImage || null,
            bossPosition: region.bossPosition || 'center',
            trigger_after_region: region.trigger_after_region || null
          };
          
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
      const defaultChallengeConfig = mapUtils.getDefaultChallengeConfig(this.currentMapId);
      this.regionChallenges = {
        1: defaultChallengeConfig
      };
    },
    
    startEnergyTimer() {
      if (!this.active) return;
      
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
      if (!this.active) return;
      
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
    
    checkBossTrigger(regionId) {
      return mapUtils.checkBossTrigger(regionId, this.regions, this.regionChallenges);
    },
    
    closeNpcDialog() {
      this.showNpcDialog = false;
    },
    
    async startCraftChallenge(region) {
      if (!this.active) return;
      
      try {
        if (region.is_boss || region.id === 5 || region.id === 10) {
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
        
        const energyCost = this.regionChallenges[region.id]?.energyCost || 2;
        
        if (this.energy < energyCost) {
          alert(`Vous n'avez pas assez d'énergie pour explorer cette région (coût: ${energyCost} ⚡)`);
          return;
        }
        
        this.currentRegionId = region.id;
        this.currentEnergyCost = energyCost;
        
        const result = await explorerService.visitRegion(region.id, energyCost);
        
        this.energy = result.energy;
        
        this.currentChallenge = this.regionChallenges[region.id] || {
          requiredElements: [],
          dialog: [],
          unlockHint: "Essayez de combiner différents éléments pour découvrir le secret."
        };
        
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

    async handleChallengeCompleted({ region, isBoss }) {
      if (!this.active) return;
      
      this.showCraftModal = false;
      
      if (isBoss) {
        await this.handleBossVictory();
        return;
      }
      
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
        
        const wasAlreadyCompleted = this.currentChallenge.alreadyCompleted;
        
        const rewardCoins = wasAlreadyCompleted ? 0 : (this.regionChallenges[region.id]?.rewardCoins || 50);
        const rewardXp = wasAlreadyCompleted ? 0 : (this.regionChallenges[region.id]?.rewardXp || 100);
        const rewardEnergy = wasAlreadyCompleted ? 0 : (this.regionChallenges[region.id]?.energyReward || 5);
        
        if (!wasAlreadyCompleted) {
          this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
        }
        
        this.victoryRewards = {
          coins: rewardCoins,
          xp: rewardXp,
          energy: rewardEnergy,
          hasBoss: hasBoss,
          alreadyCompleted: wasAlreadyCompleted
        };
        
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
          const response = await explorerService.completeRegion(regionData.id, {
            coins: rewardCoins,
            energy: rewardEnergy,
            xp: rewardXp,
            hasBoss: hasBoss,
            bossDefeated: false
          });
          
          if (response && response.rewards) {
            if (response.rewards.coins !== undefined && !wasAlreadyCompleted) {
              this.$emit('coins-updated', response.rewards.coins);
            }
            
            if (response.rewards.energy !== undefined) {
              this.energy = response.rewards.energy;
            }
          }
          
          if (response && response.unlockedRegions && response.unlockedRegions.length > 0) {
            this.victoryRewards.unlockedRegions = response.unlockedRegions;
          }
          
        } catch (error) {
          console.error(`Erreur lors de la complétion de la région ${regionData.id}:`, error);
        }
      }
    },

    async handleBossVictory() {
      if (!this.active || !this.currentBoss) return;
  
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
        bossRegion.boss_defeated = true;
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
      
      this.showTransitionAfterVictory = false;
      this.nextMapToUnlock = null;
      
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
      if (!this.active) return this.unlockedMaps;
      
      try {
        await explorerService.refreshUnlockedMaps();
        await this.loadUnlockedMaps();
        return this.unlockedMaps;
      } catch (error) {
        console.error("Erreur lors du rafraîchissement forcé des cartes débloquées:", error);
        return this.unlockedMaps;
      }
    },

    async refreshRegions() {
      if (!this.active) return;
      
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

    async closeCraftModal() {
      if (!this.active) return;
      
      try {
        if (this.currentRegionId && !this.selectedRegion?.is_boss && this.currentEnergyCost > 0) {
          const abandonResult = await explorerService.abandonChallenge(
            this.currentRegionId, 
            this.currentEnergyCost
          );
          
          if (abandonResult && abandonResult.energy !== undefined) {
            this.energy = abandonResult.energy;
            this.$emit('energy-updated', this.energy);
            
            this.$nextTick(() => {
              const tempEnergy = this.energy;
              this.energy = -1;
              setTimeout(() => {
                this.energy = tempEnergy;
              }, 50);
            });
          }
          
          setTimeout(async () => {
            const energyData = await explorerService.checkEnergy();
            if (energyData && energyData.energy !== undefined && 
                energyData.energy !== this.energy) {
              this.energy = energyData.energy;
              this.$emit('energy-updated', this.energy);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Erreur lors de la fermeture du modal de craft:', error);
        
        try {
          const energyData = await explorerService.checkEnergy();
          if (energyData) {
            this.energy = energyData.energy;
            this.$emit('energy-updated', this.energy);
          }
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement de l\'énergie:', refreshError);
        }
      } finally {
        this.currentRegionId = null;
        this.currentEnergyCost = 0;
        this.showCraftModal = false;
      }
    },

    handleTargetElementCreated(element) {
      console.log(`Élément cible créé: ${element}`);
    },

    closeVictoryModal() {
      if (!this.active) return;
  
      const triggerBoss = this.victoryRewards?.triggerBoss;




      const shouldTransition = this.showTransitionAfterVictory && this.nextMapToUnlock;
      
      this.showVictoryModal = false;
      
      if (shouldTransition) {
        setTimeout(() => {
          this.showMapTransitionModal = true;
          this.showTransitionAfterVictory = false;
        }, 300);
      } 
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
      if (!this.active) return this.energy;
      
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

    async continueToNewMap() {
      if (!this.active) return;
      
      this.showMapTransitionModal = false;
      this.loading = true;
      
      try {
        if (this.nextMapToUnlock) {
          this.currentMapId = this.nextMapToUnlock;
          
          explorerService.setCurrentMap(this.currentMapId);
          
          await this.loadRegionsForCurrentMap();
          
          await this.loadRegionChallenges();
          
          const defaultRegion = this.regions.find(r => r.is_default && r.map_id === this.currentMapId);
          const firstRegion = defaultRegion || this.regions.find(r => r.map_id === this.currentMapId);
          
          if (firstRegion) {
            setTimeout(() => {
              this.selectRegion(firstRegion);
            }, 1000);
          }
        }
      } catch (error) {
        console.error("Erreur lors du passage à la nouvelle carte:", error);
      } finally {
        this.loading = false;
      }
    },

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
    if (this.active) {
      this.loadExplorerData();
    }
  },
  beforeUnmount() {
    this.suspendActivity();
  }
};
</script>