<template>
  <div class="explorer-container">
    <!-- Affichage de l'énergie -->
    <div class="energy-info">
      <div class="energy-display">
        <span class="energy-icon">⚡</span>
        <span class="energy-value">{{ energy }}/{{ maxEnergy }}</span>
      </div>
      <!-- Bouton de retour -->
      <button class="back-btn" @click="$emit('close')">
        Retour au jeu principal
      </button>
      <div class="energy-timer" v-if="nextEnergyIn > 0">
        Prochain point d'énergie dans {{ formatTime(nextEnergyIn) }}
      </div>
    </div>
    
    <!-- Conteneur de la carte avec positions relatives -->
    <div class="map-container">
      <img src="@/assets/maps/world-map.png" alt="Carte d'exploration" class="map-image" />
      
      <!-- Points représentant les régions -->
<div 
  v-for="region in regions" 
  :key="region.id"
  :class="['region-marker', { 
    'visited': region.visited, 
    'completed': region.completed,
    'locked': !isRegionUnlocked(region)
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
      :energyCost="2"
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
        <!-- Image/Animation du boss vaincu -->
        <img
          v-if="currentBoss"
          :src="currentBoss.bossImage || require('@/assets/explorer-boss/boss-1-dead.png')"
          alt="Boss vaincu"
          class="boss-image"
        />
        <h2>Boss Vaincu !</h2>
      </div>
      
      <!-- Message narratif -->
      <p class="victory-message">
        Félicitations ! Vous avez triomphé de <strong>{{ currentBoss ? currentBoss.name : 'le boss' }}</strong> après un combat épique.
      </p>
      
      <!-- Résumé du combat (statistiques ou détails, à adapter selon vos données disponibles) -->
      <!-- <div class="battle-summary">
        <h3>Résumé du Combat :</h3>
        <p>Coups portés : <strong>{{ victoryRewards?.hits || 'N/A' }}</strong></p>
        <p>Dégâts infligés : <strong>{{ victoryRewards?.damage || 'N/A' }}</strong></p>
        <p>Dégâts reçus : <strong>{{ victoryRewards?.damageReceived || 'N/A' }}</strong></p>
      </div> -->
      
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

  </div>
</template>

<script>
import '@/assets/ExplorerMapStyle.css';
import explorerService from '@/services/explorerService';
import NpcDialog from './NpcDialog.vue';
import ExplorerCraftModal from './ExplorerCraftModal.vue';
import axios from 'axios';

export default {
  name: 'ExplorerMap',
  components: {
    NpcDialog,
    ExplorerCraftModal,
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
      currentBoss: null
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
      return {
        left: `${x}%`,
        top: `${y}%`
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
    
    const [initData, regionsData] = await Promise.all([
      explorerService.initExplorer(),
      explorerService.getRegions()
    ]);
    this.energy = initData.energy;
    this.maxEnergy = initData.max_energy || 20;
    this.nextEnergyIn = initData.next_energy_in;
    this.regions = regionsData;
    await this.loadRegionChallenges();
    this.startEnergyTimer();
  } catch (error) {
    console.error('Erreur lors du chargement des données Explorer:', error);
  } finally {
    this.loading = false;
  }
},
    
    async loadRegionChallenges() {
      try {
        const response = await axios.get('/data/regionChallenges.json');
        const regionChallengesData = response.data;
        const challenges = {};
        regionChallengesData.regions.forEach(region => {
          challenges[region.id] = {
            npcImage: region.npcImage,
            npcPosition: region.npcPosition || 'left',
            dialog: region.dialog,
            interactions: region.interactions || [],
            requiredElements: region.requiredElements,
            background: region.background || 'forrest-bg.gif',
            availableElements: region.availableElements || [],
            elementsWithGifs: region.elementsWithGifs || [],
            actionText: region.actionText,
            rewardCoins: region.rewardCoins,
            rewardXp: region.rewardXp,
            unlockHint: region.unlockHint,
            // Possibilité d'ajouter d'autres propriétés, notamment pour les défis de boss
            bossCombatRules: region.bossCombatRules || null,
            maxHealth: region.maxHealth || null,
            damagePerElement: region.damagePerElement || null
          };
        });
        this.regionChallenges = challenges;
        if (regionChallengesData.bosses && regionChallengesData.bosses.length > 0) {
          this.bosses = regionChallengesData.bosses;
        }
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
          background: 'foret-bg.gif',
          actionText: "Commencer",
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
      if (!this.bosses || this.bosses.length === 0) return null;
      return this.bosses.find(boss => boss.trigger_after_region === regionId);
    },
    
    closeNpcDialog() {
      this.showNpcDialog = false;
    },
    
    async startCraftChallenge(region) {
  try {
    // Cas spécial: si on clique directement sur la région du boss (région 5)
    if (region.id === 5) {
      // On simule le même comportement que lorsqu'on termine la région 4
      const triggeredBoss = this.checkBossTrigger(4); // On utilise 4 car c'est la région qui trigger le boss
      
      if (triggeredBoss) {
        this.currentBoss = triggeredBoss;
        this.currentChallenge = triggeredBoss;
        this.showNpcDialog = false;
        this.showCraftModal = true;
        
        // Marquer la région du boss comme visitée
        const bossRegion = this.regions.find(r => r.id === 5);
        if (bossRegion && !bossRegion.visited) {
          bossRegion.visited = true;
          explorerService.visitRegion(bossRegion.id).catch(err => {
            console.error("Erreur lors de la visite de la région du boss:", err);
          });
        }
        return;
      }
    }
    
    // Traitement normal pour les régions standards ou les boss explicites
    const isBoss = typeof region.id === 'string' && region.id.startsWith('boss-');
    if (isBoss) {
      const bossId = parseInt(region.id.split('-')[1]);
      const bossData = this.bosses.find(b => b.id === bossId);
      if (bossData) {
        this.currentBoss = bossData;
        this.currentChallenge = bossData;
        this.showNpcDialog = false;
        this.showCraftModal = true;
      }
    } else {
      const result = await explorerService.visitRegion(region.id);
      this.energy = result.energy;
      this.currentChallenge = this.regionChallenges[region.id] || {
        requiredElements: [],
        dialog: [],
        unlockHint: "Essayez de combiner différents éléments pour découvrir le secret."
      };
      this.showNpcDialog = false;
      this.showCraftModal = true;
    }
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
        const rewardEnergy = 5;
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
  const rewardCoins = this.currentBoss.rewardCoins || 500;
  const rewardXp = this.currentBoss.rewardXp || 1000;
  const rewardEnergy = 10;
  const regionId = this.currentBoss.trigger_after_region;
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
  const bossRegionId = 5; // ID de la région du boss
  const bossRegion = this.regions.find(r => r.id === bossRegionId);
  if (bossRegion) {
    bossRegion.completed = true;
    bossRegion.visited = true;
    bossRegion.progress = 100;
    console.log("Région du boss marquée complétée:", bossRegion.name);
  }
  
  this.victoryRewards = {
    coins: rewardCoins,
    xp: rewardXp,
    energy: rewardEnergy,
    isBossReward: true
  };
  this.$emit('coins-updated', this.userCoins + rewardCoins);
  this.showVictoryModal = true;
  explorerService.completeBoss(this.currentBoss.id, {
    coins: rewardCoins,
    energy: rewardEnergy,
    xp: rewardXp,
    regionId: regionId,
    bossRegionId: bossRegionId // Ajouter l'ID de la région du boss
  }).then(response => {
    console.log('Boss vaincu - réponse du serveur:', response);
    this.refreshRegions();
  }).catch(error => {
    console.error(`Erreur lors de l'enregistrement de la victoire du boss ${this.currentBoss.id}:`, error);
  });
},
    
async refreshRegions() {
  try {
    const regionsData = await explorerService.getRegions();
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
      if (triggerBoss && this.currentBoss) {
        setTimeout(() => {
          this.showNpcDialog = true;
          this.selectedRegion = {
            id: `boss-${this.currentBoss.id}`,
            name: this.currentBoss.name
          };
          this.currentNpc = {
            image: 'boss-1-anim.gif',
            position: this.currentBoss.bossPosition || 'center',
            dialog: this.currentBoss.dialog,
            actionText: this.currentBoss.actionText || "Affronter le boss"
          };
        }, 500);
      } else {
        this.$nextTick(() => {
          const temp = [...this.regions];
          this.regions = [];
          this.$nextTick(() => {
            this.regions = temp;
          });
        });
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
}
</script>
