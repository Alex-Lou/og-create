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
  import explorerService from '@/services/explorerService';
  import NpcDialog from './NpcDialog.vue';
  
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
        regionChallenges: {
          // Définir les défis par région
          // ID de région => dialogue et éléments à crafter
          1: {
            npcImage: 'npc1.png',
            dialog: [
              "Bienvenue dans la Forêt Primordiale, voyageur !",
              "Notre forêt regorge de vie et d'énergie, mais elle est menacée par un déséquilibre mystérieux.",
              "Pour restaurer l'harmonie, tu dois créer l'essence de la forêt en combinant les éléments fondamentaux.",
              "Essaie de combiner l'Eau et la Terre pour former de la Boue, puis ajoute de l'Air pour créer de la Vie."
            ],
            requiredElements: ["Vie"],
            actionText: "Relever le défi"
          },
          2: {
            npcImage: 'npc1.png',
            dialog: [
              "Ah, tu as trouvé la Rivière Cristalline !",
              "Ces eaux contiennent une énergie pure et régénératrice.",
              "Si tu pouvais créer un cristal en combinant la Terre et l'Eau de manière spéciale, cela nous aiderait beaucoup.",
              "Essaie de combiner différents éléments avec de l'Eau pour découvrir le secret."
            ],
            requiredElements: ["Cristal"],
            actionText: "Accepter la mission"
          },
          3: {
            npcImage: 'npc1.png',
            dialog: [
              "La Montagne Éternelle... peu de gens osent s'y aventurer.",
              "Les anciens racontent qu'un métal rare se trouve à son sommet.",
              "Pour le forger, tu devras combiner la Terre et le Feu d'une façon unique.",
              "Es-tu prêt à découvrir ce minerai légendaire ?"
            ],
            requiredElements: ["Métal"],
            actionText: "Commencer la forge"
          }
          // Ajoutez d'autres défis pour d'autres régions
        }
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
          
          // Charger en parallèle l'initialisation et les régions
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
          
          // Démarrer le timer pour le décompte d'énergie
          this.startEnergyTimer();
        } catch (error) {
          console.error('Erreur lors du chargement des données Explorer:', error);
        } finally {
          this.loading = false;
        }
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
  

<style scoped>
.explorer-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  color: white;
}

.energy-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px 15px;
  border-radius: 8px;
}

.energy-display {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.2rem;
  font-weight: bold;
}

.energy-icon {
  color: yellow;
}

.map-container {
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* Ratio 16:9 */
  margin-bottom: 20px;
}

.map-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.region-marker {
  position: absolute;
  width: 30px;
  height: 30px;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  background: none;
}

.region-marker svg {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}


.region-marker.completed {
  background-color: #9C27B0;
}

.region-marker.locked {

  cursor: not-allowed;
}

.region-name {
  position: absolute;
  top: -25px;
  width: max-content;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  visibility: hidden;
}

.region-marker:hover .region-name {
  visibility: visible;
}

.region-lock {
  font-size: 1.2rem;
}

.region-info {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 15px;
  border-radius: 8px;
}

.region-info h3 {
  margin-top: 0;
  margin-bottom: 10px;
}

.region-progress {
  margin: 15px 0;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background-color: #444;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.region-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
}

.explore-btn {
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.explore-btn:hover {
  background-color: #1976D2;
}

.explore-btn:disabled {
  background-color: #9E9E9E;
  cursor: not-allowed;
}

.back-btn {
  padding: 10px 20px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  align-self: center;
  margin-top: 20px;
}

.back-btn:hover {
  background-color: #d32f2f;
}
</style>