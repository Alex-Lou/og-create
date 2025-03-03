<template>
  <div v-if="isVisible" class="map-transition-modal">
    <div class="transition-content">
      <!-- En-tête avec animation de victoire -->
      <div class="transition-header">
        <div class="victory-animation">
          <div class="victory-effect">
            <span class="victory-star">{{ config.victoryStarSymbol }}</span>
            <span class="victory-text">{{ config.victoryText }}</span>
          </div>
        </div>
        <h1 class="transition-title">{{ config.transitionTitle }}</h1>
      </div>
  
      <!-- Corps du message narratif -->
      <div class="transition-message">
        <p class="narrative">
          {{ narrative }}
        </p>
          
        <!-- Affichage de la nouvelle carte -->
        <div class="new-map-preview">
          <img 
            :src="mapPreviewImage" 
            alt="Nouvelle carte" 
            class="map-preview-img" 
          />
          <div class="map-name">{{ mapName }}</div>
        </div>
          
        <p class="quest-teaser">
          {{ config.questTeaser }}
        </p>
      </div>
  
      <!-- Récompenses et bonus spéciaux -->
      <div class="special-rewards">
        <h3>{{ config.specialRewardsTitle }}</h3>
        <div class="rewards-grid">
          <div class="reward-item">
            <span class="reward-icon">{{ config.rewardIcons.coins }}</span>
            <span class="reward-value">{{ safeRewards.coins }} {{ config.rewardText.coins }}</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">{{ config.rewardIcons.xp }}</span>
            <span class="reward-value">{{ safeRewards.xp }} {{ config.rewardText.xp }}</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">{{ config.rewardIcons.energy }}</span>
            <span class="reward-value">{{ safeRewards.energy }} {{ config.rewardText.energy }}</span>
          </div>
          <div class="reward-item">
            <span class="reward-icon">{{ config.rewardIcons.regionUnlocked }}</span>
            <span class="reward-value">{{ config.rewardText.regionUnlocked }}</span>
          </div>
        </div>
      </div>
  
      <!-- Bouton pour continuer -->
      <button @click="continueToNewMap" class="continue-btn">
        {{ config.continueButtonText }}
      </button>
    </div>
  </div>
</template>
  
<script>
// Importations statiques des images de cartes pour éviter les erreurs
import worldMap from '@/assets/maps/world-map.png';
import worldMap2 from '@/assets/maps/world-map2.png';

export default {
  name: 'MapTransitionModal',
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
    },
    // Possibilité de passer une configuration externe
    config: {
      type: Object,
      default: () => ({
        transitionTitle: 'Nouvelle Région Découverte!',
        victoryText: 'VICTOIRE!',
        victoryStarSymbol: '⭐',
        narrativeTemplate: "Félicitations, aventurier! Après avoir vaincu le {bossName}, un nouveau territoire s'ouvre à vous. Cette terre inexplorée regorge de mystères et de défis qui attendent votre expertise en alchimie élémentaire.",
        questTeaser: "De nouveaux alliés vous attendent, et de nouvelles combinaisons d'éléments seront nécessaires pour surmonter les obstacles sur votre chemin.",
        specialRewardsTitle: 'Récompenses Spéciales',
        rewardText: {
          coins: 'Pièces',
          xp: 'XP',
          energy: 'Énergie',
          regionUnlocked: 'Nouvelle région débloquée!'
        },
        rewardIcons: {
          coins: '💰',
          xp: '✨',
          energy: '⚡',
          regionUnlocked: '🗺️'
        },
        continueButtonText: 'Explorer la nouvelle région',
        mapNames: {
          1: 'Forêt Primordiale',
          2: 'Désert des Illusions',
          3: 'Royaume Céleste',
          4: 'Terres Volcaniques',
          5: 'Îles Flottantes',
          // Autres maps futures
        }
      })
    }
  },
  computed: {
    // S'assurer que les récompenses sont toujours valides, même si props.rewards est null
    safeRewards() {
      return this.rewards || { coins: 0, xp: 0, energy: 0 };
    },
    effectiveBossName() {
      return this.bossName || 'Gardien des Ténèbres';
    },
    narrative() {
      return this.config.narrativeTemplate.replace('{bossName}', this.effectiveBossName);
    },
    mapPreviewImage() {
      // Utiliser une approche plus robuste pour le chargement des images
      const mapId = this.newMapId || 2; // Par défaut, map 2
      
      try {
        // Utiliser les imports statiques pour les cas connus
        if (mapId === 1) {
          return worldMap;
        } else if (mapId === 2) {
          return worldMap2;
        } else {
          // Pour les autres maps, tenter le require dynamique
          return require(`@/assets/maps/world-map${mapId}.png`);
        }
      } catch (e) {
        console.error(`Impossible de charger l'image pour la map ${mapId}:`, e);
        // Fallback sur la première map
        return worldMap;
      }
    },
    mapName() {
      const mapId = this.newMapId || 2;
      return (this.config.mapNames && this.config.mapNames[mapId]) || `Carte ${mapId}`;
    }
  },
  methods: {
    continueToNewMap() {
      console.log("Émission de l'événement continue-to-new-map avec mapId:", this.newMapId);
      this.$emit('continue-to-new-map', this.newMapId);
    }
  }
};
</script>
  
<style scoped>
/* Les styles restent inchangés */
.map-transition-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.5s ease-in-out;
}
.transition-content {
  background-color: #2c3e50;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(255, 223, 0, 0.6);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 30px;
  color: #ecf0f1;
  border: 3px solid #f39c12;
  position: relative;
}
.transition-header {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}
.victory-animation {
  margin: 0 auto 20px;
  text-align: center;
}
.victory-effect {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounce 1s ease infinite alternate;
}
.victory-star {
  font-size: 48px;
  color: #f1c40f;
  text-shadow: 0 0 15px rgba(241, 196, 15, 0.8);
  margin-bottom: 10px;
  animation: rotate 3s linear infinite;
}
.victory-text {
  font-size: 32px;
  font-weight: bold;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.8);
  letter-spacing: 2px;
}
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes bounce {
  from { transform: translateY(0); }
  to { transform: translateY(-10px); }
}
.transition-title {
  font-size: 2.5rem;
  color: #f1c40f;
  text-shadow: 0 0 10px rgba(241, 196, 15, 0.5);
  margin: 0;
  animation: pulse 2s infinite;
}
.transition-message {
  margin: 30px 0;
  font-size: 1.1rem;
  line-height: 1.6;
}
.narrative {
  text-align: center;
  margin-bottom: 20px;
}
.new-map-preview {
  position: relative;
  margin: 30px auto;
  text-align: center;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  overflow: hidden;
  max-width: 600px;
}
.map-preview-img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px;
  transition: transform 0.5s ease;
}
.map-preview-img:hover {
  transform: scale(1.03);
}
.map-name {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: #fff;
  padding: 15px;
  font-size: 1.5rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}
.quest-teaser {
  text-align: center;
  font-style: italic;
  color: #bdc3c7;
  margin-top: 20px;
}
.special-rewards {
  background-color: rgba(52, 73, 94, 0.7);
  border-radius: 8px;
  padding: 20px;
  margin: 30px 0;
}
.special-rewards h3 {
  text-align: center;
  color: #e67e22;
  margin-top: 0;
  font-size: 1.5rem;
}
.rewards-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}
.reward-item {
  background-color: rgba(44, 62, 80, 0.7);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1 0 40%;
  min-width: 180px;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}
.reward-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.2);
}
.reward-icon {
  font-size: 24px;
  min-width: 30px;
  text-align: center;
}
.reward-value {
  font-weight: bold;
  font-size: 1.1rem;
}
.continue-btn {
  display: block;
  margin: 30px auto 0;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(231, 76, 60, 0.4);
}
.continue-btn:hover {
  background-color: #c0392b;
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(231, 76, 60, 0.6);
}
.continue-btn:active {
  transform: translateY(1px);
  box-shadow: 0 3px 10px rgba(231, 76, 60, 0.4);
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes pulse {
  0% { text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
  50% { text-shadow: 0 0 20px rgba(241, 196, 15, 0.8), 0 0 30px rgba(241, 196, 15, 0.3); }
  100% { text-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
}
@media (max-width: 768px) {
  .transition-title {
    font-size: 2rem;
  }
  .reward-item {
    flex: 1 0 100%;
  }
}
</style>