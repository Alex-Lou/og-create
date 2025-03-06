<template>
  <div class="explorer-container">
    <!-- Affichage de l'énergie -->
    <div class="energy-info">
      <!-- Left side: Map Selector -->
      <div class="map-selector" v-if="unlockedMaps.length > 1">
        <span class="map-selector-label">Carte:</span>
        <select v-model="currentMapId" @change="changeMap" class="map-select">
          <option v-for="mapId in unlockedMaps" :key="mapId" :value="mapId">
            {{ mapUtils.getMapName(mapId, regions) }}
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
      <RegionMarker
        v-for="region in regions"
        :key="region.id"
        :region="region"
        :isUnlocked="isRegionUnlocked(region)"
        @region-click="selectRegion(region)"
      />
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
import mapUtils from '@/utils/mapUtils';
import NpcDialog from './NpcDialog.vue';
import ExplorerCraftModal from './ExplorerCraftModal.vue';
import MapTransitionModal from './MapTransitionModal.vue';
import RegionMarker from './RegionMarker.vue';
import EnergyDisplayExplorer from './EnergyDisplayExplorer.vue';
import axios from 'axios';

export default {
  name: 'ExplorerMap',
  components: {
    NpcDialog,
    ExplorerCraftModal,
    MapTransitionModal,
    RegionMarker,
    EnergyDisplayExplorer
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
    // Méthodes déléguées à mapUtils
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
      
      // Si c'est un boss, le coût est toujours 0
      if (this.selectedRegion.is_boss) {
        return 0;
      }
      
      // Sinon, récupérer la valeur du challenge ou une valeur par défaut
      const challenge = this.regionChallenges[this.selectedRegion.id];
      return challenge?.energyCost !== undefined ? challenge.energyCost : 2;
    },

    handleCoinsUpdated(newCoins) {
      this.coins = newCoins;
      this.$emit('coins-updated', newCoins);
    },

    // Méthodes de gestion des interactions utilisateur
    confirmExit() {
      // Désactiver toutes les modales d'abord
      this.showCraftModal = false;
      this.showNpcDialog = false;
      this.showVictoryModal = false;
      this.showMapTransitionModal = false;
      this.showExitConfirmationModal = false;
      
      // Réinitialiser les états importants
      this.selectedRegion = null;
      this.currentBoss = null;
      this.currentChallenge = null;
      
      // Attendre que Vue termine le cycle de rendu
      setTimeout(() => {
        // Fermer le mode Explorer
        this.$emit('close');
      }, 50);
    },
    
    // Méthodes de chargement des données
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
    
    // Charge les cartes débloquées depuis explorerService
    loadUnlockedMaps() {
      this.unlockedMaps = mapUtils.loadUnlockedMaps();
    },
    
    // Charge les régions pour la carte actuelle
    async loadRegionsForCurrentMap() {
      try {
        console.log(`Chargement des régions pour la map ${this.currentMapId}...`);
        
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
      
      // Sauvegarder les informations du boss vaincu
      this.lastDefeatedBoss = { ...this.currentBoss };
      const bossId = this.currentBoss.id;
      
      // Vérifier si le boss est déjà vaincu
      const isAlreadyDefeated = await explorerService.isBossDefeated(bossId);
      
      // Définir les récompenses (0 si déjà vaincu)
      const rewardCoins = isAlreadyDefeated ? 0 : (this.currentBoss.rewardCoins || 500);
      const rewardXp = isAlreadyDefeated ? 0 : (this.currentBoss.rewardXp || 1000);
      const rewardEnergy = isAlreadyDefeated ? 0 : (this.regionChallenges[this.currentBoss.id]?.energyReward || 10);
      const regionId = this.currentBoss.trigger_after_region;
      
      // Ajouter de l'énergie uniquement si le boss n'a pas déjà été vaincu
      if (!isAlreadyDefeated) {
        this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
      }
      
      // Marquer la région associée comme complétée
      const associatedRegion = this.regions.find(r => r.id === regionId);
      if (associatedRegion) {
        associatedRegion.completed = true;
        associatedRegion.progress = 100;
      }
      
      // Créer ou mettre à jour la région du boss
      const bossRegion = this.regions.find(r => r.id === bossId);
      if (bossRegion) {
        bossRegion.completed = true;
        bossRegion.visited = true;
        bossRegion.progress = 100;
        bossRegion.boss_defeated = true; // Marquer le boss comme vaincu
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
      
      // Déterminer si c'est un boss final
      const isFinalBoss = await mapUtils.isFinalBoss(bossRegion, this.regions, this.currentMapId);
      
      // Préparer la transition si c'est un boss final
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
          // Par précaution, on tente quand même la transition
          this.showTransitionAfterVictory = true;
          this.nextMapToUnlock = nextMapId;
        }
      } else {
        this.showTransitionAfterVictory = false;
      }
      
      // Afficher la modale de victoire standard
      this.showVictoryModal = true;
      
      // Enregistrer la victoire sur le boss via le service
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
          
          // Mettre à jour la liste des régions
          await this.forceRegionsReload();
          
          // Forcer une mise à jour des cartes débloquées
          if (isFinalBoss) {
            // Attendre un peu pour que le serveur traite les changements
            setTimeout(async () => {
              await explorerService.refreshUnlockedMaps();
              await this.loadUnlockedMaps();
            }, 500);
          }
          
        } catch (error) {
          console.error(`Erreur lors de l'enregistrement de la victoire du boss ${bossId}:`, error);
        }
      } else {
        // Même si on n'envoie pas de données au serveur, on rafraîchit les régions
        await this.refreshRegions();
      }
      
      console.log("=== FIN TRAITEMENT VICTOIRE DE BOSS ===");
    },

    // Force le rafraîchissement des cartes débloquées
    async forceUnlockedMapsRefresh() {
      console.log("Forçage du rafraîchissement des cartes débloquées...");
      
      try {
        // Assurer que le service met à jour les informations des cartes
        await explorerService.refreshUnlockedMaps();
        
        // Recharger les cartes débloquées dans le composant
        await this.loadUnlockedMaps();
        
        console.log("Cartes débloquées après rafraîchissement:", this.unlockedMaps);
        return this.unlockedMaps;
      } catch (error) {
        console.error("Erreur lors du rafraîchissement forcé des cartes débloquées:", error);
        return this.unlockedMaps;
      }
    },

    // Rafraîchit les régions
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

    // Ferme le modal de craft
    closeCraftModal() {
      this.showCraftModal = false;
    },

    // Gère la création d'un élément cible
    handleTargetElementCreated(element) {
      console.log(`Élément cible créé: ${element}`);
    },

    // Ferme le modal de victoire
    closeVictoryModal() {
  console.log("=== DÉBUT FERMETURE MODAL DE VICTOIRE ===");
  // Supprimer cette ligne qui crée l'erreur de lint
  // const isBossVictory = this.victoryRewards?.isBossReward;
  const triggerBoss = this.victoryRewards?.triggerBoss;
  
  // Fermer le modal de victoire
  this.showVictoryModal = false;
  
  // Gérer la transition vers la map suivante
  if (this.showTransitionAfterVictory && this.nextMapToUnlock) {
    console.log("Affichage du modal de transition vers map", this.nextMapToUnlock);
    // Attendre un peu avant d'afficher la modal de transition
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

    // Continue vers la nouvelle carte
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

    // Pour déboguer les régions
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

    // Achète de l'énergie
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