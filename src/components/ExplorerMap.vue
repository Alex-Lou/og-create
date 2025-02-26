<template>
    <div class="explorer-container">
      <!-- Affichage de l'énergie -->
      <div class="energy-info">
        <div class="energy-display">
          <span class="energy-icon">⚡</span>
          <span class="energy-value">{{ energy }}/{{ maxEnergy }}</span>
        </div>
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
          <svg 
            v-if="region.visited && !region.completed"
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
          <div class="region-name">{{ region.name }}</div>
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
      
      <!-- Bouton de retour -->
      <button class="back-btn" @click="$emit('close')">
        Retour au jeu principal
      </button>
  
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
    </div>
  </template>
  
  
  <script>
  import '@/assets/ExplorerMapStyle.css';
  import explorerService from '@/services/explorerService';
  import NpcDialog from './NpcDialog.vue';
  // Dans Vue, @/ pointe vers le dossier src, mais public est accessible directement
  import axios from 'axios'; // Assurez-vous d'avoir installé axios
  
  export default {
    name: 'ExplorerMap',
    components: {
      NpcDialog,
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
        regionChallenges: {}
      };
    },
    methods: {
      formatTime(minutes) {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
      },
      
      isRegionUnlocked(region) {
        // Une région est débloquée si elle est par défaut ou déjà visitée
        if (region.is_default || region.visited) return true;
        
        // Sinon, il faut que sa région parente soit complétée
        if (region.parent_region_id) {
          const parentRegion = this.regions.find(r => r.id === region.parent_region_id);
          return parentRegion && parentRegion.completed;
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
              actionText: region.actionText,
              rewardCoins: region.rewardCoins,
              rewardXp: region.rewardXp,
              unlockHint: region.unlockHint
            };
          });
          
          this.regionChallenges = challenges;
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
              "Bienvenue dans la Forêt Primordiale, voyageur !",
              "Notre forêt regorge de vie et d'énergie, mais elle est menacée par un déséquilibre mystérieux.",
              "Pour restaurer l'harmonie, tu dois créer l'essence de la forêt en combinant les éléments fondamentaux."
            ],
            requiredElements: ["Vie"],
            actionText: "Relever le défi"
          },
          // Ajoutez d'autres défis par défaut si nécessaire
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
      
      closeNpcDialog() {
        this.showNpcDialog = false;
      },
      
      async startCraftChallenge(region) {
        try {
          // Dépenser l'énergie via le service
          const result = await explorerService.visitRegion(region.id);
          
          // Mettre à jour l'énergie
          this.energy = result.energy;
          
          // Émettre un événement pour démarrer le défi de craft dans cette région
          this.$emit('start-craft-challenge', {
            region: region,
            challenge: this.regionChallenges[region.id] || {
              requiredElements: [],
              dialog: []
            }
          });
          
          // Fermer le dialogue NPC
          this.showNpcDialog = false;
        } catch (error) {
          console.error('Erreur lors du démarrage du défi:', error);
          alert(error.response?.data?.message || 'Une erreur est survenue lors du défi');
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