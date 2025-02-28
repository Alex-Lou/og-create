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
      <div v-if="showVictoryModal" class="victory-modal">
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
  </template>
  
  <script>
import '@/assets/ExplorerMapStyle.css';
import explorerService from '@/services/explorerService';
import NpcDialog from './NpcDialog.vue';
import ExplorerCraftModal from './ExplorerCraftModal.vue';
import axios from 'axios'; // Assurez-vous d'avoir installé axios

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
      // Une région est débloquée si elle est par défaut ou déjà visitée/complétée
      if (region.is_default || region.visited || region.completed) {
        return true;
      }
      
      // Sinon, il faut que sa région parente soit complétée
      // ET qu'elle soit la prochaine dans la séquence
      if (region.parent_region_id) {
        const parentRegion = this.regions.find(r => r.id === region.parent_region_id);
        
        if (parentRegion && parentRegion.completed) {
          // Trouver toutes les régions enfants de ce parent qui ne sont pas encore visitées/complétées
          const childRegions = this.regions.filter(r => 
            r.parent_region_id === parentRegion.id && 
            !r.visited && 
            !r.completed
          );
          
          // S'il y a des régions enfants
          if (childRegions.length > 0) {
            // Trier par ID pour avoir la première dans l'ordre
            const sortedChildren = [...childRegions].sort((a, b) => a.id - b.id);
            
            // Ne débloquer que la première
            return region.id === sortedChildren[0].id;
          }
        }
      }
      
      return false;
    },
    
    getRegionStyle(region) {
      // Positionne le marqueur sur la carte en fonction des coordonnées de la région
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
        
        // Charger en parallèle l'initialisation, les régions, et les défis
        const [initData, regionsData] = await Promise.all([
          explorerService.initExplorer(),
          explorerService.getRegions()
        ]);
        
        // Mise à jour des données d'énergie
        this.energy = initData.energy;
        this.maxEnergy = initData.max_energy || 20;
        this.nextEnergyIn = initData.next_energy_in;
        
        // Mise à jour des régions
        this.regions = regionsData;
        
        // Charger les défis depuis le fichier JSON
        await this.loadRegionChallenges();
        
        // Démarrer le timer pour le décompte d'énergie
        this.startEnergyTimer();
      } catch (error) {
        console.error('Erreur lors du chargement des données Explorer:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadRegionChallenges() {
      try {
        // Charger le fichier JSON depuis le dossier public
        const response = await axios.get('/data/regionChallenges.json');
        const regionChallengesData = response.data;
        
        // Convertir le tableau des régions du JSON en un objet avec l'ID comme clé
        const challenges = {};
        regionChallengesData.regions.forEach(region => {
          challenges[region.id] = {
            npcImage: region.npcImage,
            dialog: region.dialog,
            requiredElements: region.requiredElements,
            background: region.background || 'forrest-bg.gif',
            availableElements: region.availableElements || [],
            elementsWithGifs: region.elementsWithGifs || [],
            actionText: region.actionText,
            rewardCoins: region.rewardCoins,
            rewardXp: region.rewardXp,
            unlockHint: region.unlockHint
          };
        });
        
        this.regionChallenges = challenges;
        
        // Charger les boss si présents
        if (regionChallengesData.bosses && regionChallengesData.bosses.length > 0) {
          this.bosses = regionChallengesData.bosses;
        }
      } catch (error) {
        console.error('Erreur lors du chargement des défis de régions:', error);
        // Définir des défis par défaut en cas d'échec
        this.setupDefaultChallenges();
      }
    },
    
    // Méthode de secours pour définir des défis par défaut
    setupDefaultChallenges() {
      this.regionChallenges = {
        1: {
          npcImage: 'npc1.png',
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
      // Nettoyer le timer existant si présent
      if (this.energyTimer) {
        clearInterval(this.energyTimer);
      }
      
      // Mettre à jour le décompte chaque minute
      this.energyTimer = setInterval(() => {
        if (this.nextEnergyIn > 0) {
          this.nextEnergyIn -= 1;
        } else {
          // Si le compteur atteint zéro et que l'énergie n'est pas au max,
          // ajouter un point d'énergie et réinitialiser le compteur
          if (this.energy < this.maxEnergy) {
            this.energy += 1;
            this.nextEnergyIn = 30; // 30 minutes pour le prochain point
          }
        }
      }, 60000); // Toutes les minutes (60000 ms)
    },
    
    selectRegion(region) {
      // Ne permet pas de sélectionner une région verrouillée
      if (!this.isRegionUnlocked(region)) {
        alert('Cette région est verrouillée. Complétez les régions précédentes pour la débloquer.');
        return;
      }
      
      this.selectedRegion = region;
      this.showNpcDialog = true;
      
      // Configurer le NPC en fonction de la région
      if (this.regionChallenges[region.id]) {
        const challenge = this.regionChallenges[region.id];
        this.currentNpc = {
          image: challenge.npcImage,
          dialog: challenge.dialog,
          actionText: challenge.actionText
        };
      } else {
        // Dialogue par défaut si aucun défi spécifique n'est défini
        this.currentNpc = {
          image: 'npc1.png',
          dialog: [
            `Bienvenue dans ${region.name}, explorateur !`,
            "Cette région est pleine de mystères à découvrir.",
            "Essaie de combiner les éléments fondamentaux pour découvrir les secrets de cet endroit."
          ],
          actionText: "Commencer à crafter"
        };
      }
    },
    
    // Vérifier si un boss devrait être déclenché après avoir complété une région
    checkBossTrigger(regionId) {
      if (!this.bosses || this.bosses.length === 0) return null;
      
      return this.bosses.find(boss => boss.trigger_after_region === regionId);
    },
    
    closeNpcDialog() {
      this.showNpcDialog = false;
    },
    
    async startCraftChallenge(region) {
      try {
        // Vérifier si c'est un ID de boss (chaîne commençant par "boss-")
        const isBoss = typeof region.id === 'string' && region.id.startsWith('boss-');
        
        if (isBoss) {
          const bossId = parseInt(region.id.split('-')[1]);
          const bossData = this.bosses.find(b => b.id === bossId);
          
          if (bossData) {
            this.currentBoss = bossData;
            this.currentChallenge = {
              ...bossData,
              bossImage: bossData.bossImage
            };
            
            // Fermer le dialogue NPC
            this.showNpcDialog = false;
            
            // Ouvrir le modal de craft pour le boss
            this.showCraftModal = true;
          }
        } else {
          // C'est une région normale, continuer comme avant
          const result = await explorerService.visitRegion(region.id);
          
          // Mettre à jour l'énergie
          this.energy = result.energy;
          
          // Définir le défi actuel et ouvrir le modal
          this.currentChallenge = this.regionChallenges[region.id] || {
            requiredElements: [],
            dialog: [],
            unlockHint: "Essayez de combiner différents éléments pour découvrir le secret."
          };
          
          // Fermer le dialogue NPC
          this.showNpcDialog = false;
          
          // Ouvrir le modal de craft
          this.showCraftModal = true;
        }
      } catch (error) {
        console.error('Erreur lors du démarrage du défi:', error);
        alert(error.response?.data?.message || 'Une erreur est survenue lors du défi');
      }
    },
    
    handleCraftSuccess(craftedItem) {
      // Ajoute l'élément créé à la liste des éléments découverts
      this.$emit('element-discovered', craftedItem);
    },
    
    handleTargetElementCreated(element) {
      // Notification ou effet spécial quand un élément cible est créé
      console.log(`Élément cible créé: ${element}`);
      // Vous pourriez ajouter un effet sonore ou visuel ici
    },
    
    handleChallengeCompleted({ region, isBoss }) {
      // Fermer le modal de craft
      this.showCraftModal = false;
      
      // Si c'est un boss
      if (isBoss) {
        this.handleBossVictory();
        return;
      }
      
      // Sinon, c'est une région normale
      const regionData = this.regions.find(r => r.id === region.id);
      if (regionData) {
        // Marquer la région comme complétée
        regionData.completed = true;
        
        // Définir les récompenses
        const rewardCoins = this.regionChallenges[region.id]?.rewardCoins || 50;
        const rewardXp = this.regionChallenges[region.id]?.rewardXp || 100;
        const rewardEnergy = 5;
        
        // Mise à jour de l'énergie locale (ajout de la récompense)
        this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
        
        // Préparer les récompenses pour affichage
        this.victoryRewards = {
          coins: rewardCoins,
          xp: rewardXp,
          energy: rewardEnergy
        };
        
        // Émettre l'événement de mise à jour des pièces vers le parent (App.vue)
        this.$emit('coins-updated', this.userCoins + rewardCoins);
        
        // Vérifier si un boss doit être déclenché après cette région
        const triggeredBoss = this.checkBossTrigger(region.id);
        
        if (triggeredBoss) {
          // Enregistrer le boss pour une utilisation ultérieure
          this.currentBoss = triggeredBoss;
          
          // Afficher la fenêtre de victoire d'abord
          this.showVictoryModal = true;
          
          // Après la fermeture de la modal de victoire, déclencher le boss
          this.victoryRewards.triggerBoss = true;
        } else {
          // IMPORTANT: Mettre à jour les régions enfants - ne débloquer que la première
          // 1. Trouver toutes les régions enfants
          const childRegions = this.regions.filter(r => 
            r.parent_region_id === regionData.id && 
            !r.visited && 
            !r.completed
          );
          
          let unlockedRegion = null;
          
          // 2. S'il y a des régions enfants
          if (childRegions.length > 0) {
            console.log(`La région ${regionData.name} (${regionData.id}) a ${childRegions.length} enfants.`);
            
            // 3. Trier par ID pour avoir la prochaine région dans l'ordre
            const sortedChildren = [...childRegions].sort((a, b) => a.id - b.id);
            
            // 4. Ne débloquer que la première région
            const nextRegion = sortedChildren[0];
            unlockedRegion = nextRegion;
            
            console.log(`Débloquage UNIQUEMENT de la région: ${nextRegion.name} (ID: ${nextRegion.id})`);
            
            // 5. Verrouiller toutes les régions qui ne sont pas complétées/visitées
            this.regions.forEach(r => {
              if (!r.completed && !r.visited) {
                r.is_default = false;
              }
            });
            
            // 6. Débloquer spécifiquement la prochaine région
            nextRegion.is_default = true;
          }
          
          // 7. Mettre à jour le message de récompense
          if (unlockedRegion) {
            this.victoryRewards.unlockedRegions = [unlockedRegion.id];
          }
          
          // 8. Afficher la fenêtre de victoire
          this.showVictoryModal = true;
        }
        
        // 9. Appeler le service avec TOUTES les récompenses
        explorerService.completeRegion(regionData.id, {
          coins: rewardCoins,
          energy: rewardEnergy,
          xp: rewardXp
        }).then(response => {
          console.log('Réponse du service pour complétion de région:', response);
          
          // Si tu veux utiliser les valeurs retournées par le backend pour mettre à jour l'interface
          if (response && response.rewards) {
            // Mise à jour des pièces si le backend retourne une valeur différente
            if (response.rewards.coins !== undefined && response.rewards.coins !== this.userCoins + rewardCoins) {
              this.$emit('coins-updated', response.rewards.coins);
            }
            
            // Mise à jour de l'énergie si le backend retourne une valeur différente
            if (response.rewards.energy !== undefined && response.rewards.energy !== this.energy) {
              this.energy = response.rewards.energy;
            }
          }
        }).catch(error => {
          console.error(`Erreur lors de la complétion de la région ${regionData.id}:`, error);
        });
      }
    },
    
    // Méthode pour gérer la victoire contre un boss
    handleBossVictory() {
      if (!this.currentBoss) return;
      
      // Définir les récompenses (plus importantes pour un boss)
      const rewardCoins = this.currentBoss.rewardCoins || 500;
      const rewardXp = this.currentBoss.rewardXp || 1000;
      const rewardEnergy = 10;
      
      // Mise à jour de l'énergie locale
      this.energy = Math.min(this.energy + rewardEnergy, this.maxEnergy);
      
      // Préparer les récompenses pour affichage
      this.victoryRewards = {
        coins: rewardCoins,
        xp: rewardXp,
        energy: rewardEnergy,
        isBossReward: true
      };
      
      // Émettre l'événement de mise à jour des pièces
      this.$emit('coins-updated', this.userCoins + rewardCoins);
      
      // Afficher la fenêtre de victoire
      this.showVictoryModal = true;
      
      // Enregistrer la victoire contre le boss
      explorerService.completeBoss(this.currentBoss.id, {
        coins: rewardCoins,
        energy: rewardEnergy,
        xp: rewardXp
      }).catch(error => {
        console.error(`Erreur lors de l'enregistrement de la victoire contre le boss ${this.currentBoss.id}:`, error);
      });
    },
    
    async refreshRegions() {
      try {
        // Au lieu de remplacer complètement this.regions, mettre à jour seulement les propriétés importantes
        const regionsData = await explorerService.getRegions();
        
        // Conserver les propriétés visuelles tout en mettant à jour l'état
        this.regions = this.regions.map(existingRegion => {
          const updatedRegion = regionsData.find(r => r.id === existingRegion.id);
          if (updatedRegion) {
            return {
              ...existingRegion,
              completed: updatedRegion.completed,
              visited: updatedRegion.visited,
              // Autres propriétés à mettre à jour si nécessaire
            };
          }
          return existingRegion;
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
      
      // Si un boss doit être déclenché après la fermeture
      if (triggerBoss && this.currentBoss) {
        setTimeout(() => {
          this.showNpcDialog = true;
          this.selectedRegion = {
            id: `boss-${this.currentBoss.id}`,
            name: this.currentBoss.name
          };
          this.currentNpc = {
            image: 'boss-1-anim.gif', // Image générique du boss
            dialog: this.currentBoss.dialog,
            actionText: this.currentBoss.actionText || "Affronter le boss"
          };
        }, 500);
      } else {
        // Astuce: forcer une mise à jour visuelle des régions
        this.$nextTick(() => {
          // Une légère modification pour forcer la mise à jour du DOM
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
        const result = await explorerService.buyEnergy(1); // Acheter 1 point d'énergie
        
        // Mettre à jour l'énergie et les pièces
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
    // Charger les données au montage du composant
    this.loadExplorerData();
  },
  beforeUnmount() {
    // Nettoyer le timer lorsque le composant est détruit
    if (this.energyTimer) {
      clearInterval(this.energyTimer);
    }
  }
}
</script>