// src/utils/mapUtils.js
import explorerService from '@/services/explorerService';

/**
 * Utilitaires pour la gestion de la carte et des régions dans le mode Explorer
 */
export default {
  /**
   * Vérifie si une région est débloquée
   * @param {Object} region - L'objet région à vérifier
   * @param {Array} regions - Toutes les régions disponibles
   * @returns {Boolean} - True si la région est débloquée
   */
  isRegionUnlocked(region, regions) {
    if (region.is_default || region.visited || region.completed) {
      return true;
    }
    if (region.parent_region_id) {
      const parentRegion = regions.find(r => r.id === region.parent_region_id);
      if (parentRegion && parentRegion.completed) {
        const childRegions = regions.filter(r => 
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

  /**
   * Récupère le style CSS pour positionner une région sur la carte
   * @param {Object} region - L'objet région
   * @returns {Object} - Style CSS pour la région
   */
  getRegionStyle(region) {
    const x = region.position_x || 50;
    const y = region.position_y || 50;
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      display: 'block',
      zIndex: 10
    };
  },

  /**
   * Détermine à quelle carte appartient une région
   * @param {Object} region - L'objet région
   * @returns {Number} - L'ID de la carte
   */
  getRegionMapId(region) {
    return region.map_id || 1;
  },

  /**
   * Récupère l'image de la carte en fonction de son ID
   * @param {Number} mapId - L'ID de la carte
   * @returns {String} - Le chemin vers l'image de la carte
   */
  getMapImage(mapId) {
    try {
      // Déterminer le nom du fichier en fonction de l'ID
      let mapFileName = mapId === 1 ? 'world-map.png' : `world-map${mapId}.png`;
      
      // Utiliser require pour charger l'image
      return require(`@/assets/maps/${mapFileName}`);
    } catch (error) {
      console.error("Erreur lors du chargement de l'image de carte:", error);
      
      // Fallback sur la carte par défaut
      try {
        return require('@/assets/maps/world-map.png');
      } catch (fallbackError) {
        console.error("Fallback également échoué:", fallbackError);
        return ''; // Chaîne vide si tout échoue
      }
    }
  },

  /**
   * Récupère le nom de la carte en fonction de son ID et des régions disponibles
   * @param {Number} mapId - L'ID de la carte
   * @param {Array} regions - Toutes les régions disponibles
   * @returns {String} - Le nom de la carte
   */
  getMapName(mapId, regions) {
    // Trouver une région de cette carte
    const regionInMap = regions.find(region => {
      const regionMapId = this.getRegionMapId(region);
      return regionMapId === mapId;
    });
    
    if (regionInMap) {
      // Retourner le nom de la première région "is_default" de cette carte ou le premier nom de région
      const defaultRegion = regions.find(r => r.is_default && this.getRegionMapId(r) === mapId);
      return defaultRegion ? defaultRegion.name : regionInMap.name;
    }
    
    // Fallback si aucune région n'est trouvée
    return `Carte ${mapId}`;
  },

  /**
   * Récupère l'image d'un boss vaincu
   * @param {Number} bossId - L'ID du boss
   * @param {Array} regions - Toutes les régions disponibles
   * @param {Object} regionChallenges - Les défis des régions
   * @param {Object} defaultImages - Images par défaut
   * @returns {String} - Le chemin vers l'image du boss vaincu
   */
  getBossDefeatedImage(bossId, regions, regionChallenges, defaultImages) {
    try {
      // D'abord, chercher dans les données de la région
      const boss = regions.find(r => r.id === bossId && r.is_boss);
      if (boss && boss.bossDefeatedImage) {
        return require(`@/assets/explorer-boss/${boss.bossDefeatedImage}`);
      }
      
      // Ensuite, chercher dans les challenges
      const bossChallenge = regionChallenges[bossId];
      if (bossChallenge && bossChallenge.bossDefeatedImage) {
        return require(`@/assets/explorer-boss/${bossChallenge.bossDefeatedImage}`);
      }
      
      // Fallback sur l'image par défaut
      console.warn(`Image de boss vaincu non trouvée pour le boss ${bossId}, utilisation de l'image par défaut`);
      return require(`@/assets/explorer-boss/${defaultImages.bossDefeated}`);
    } catch (error) {
      console.error(`Erreur lors du chargement de l'image du boss vaincu:`, error);
      // Essayer un autre fallback
      try {
        return require(`@/assets/explorer-boss/${defaultImages.bossDefeated}`);
      } catch (fallbackError) {
        console.error("Fallback également échoué:", fallbackError);
        return ''; // Chaîne vide si tout échoue
      }
    }
  },

  /**
   * Récupère l'image de fond par défaut pour une carte
   * @param {Number} mapId - L'ID de la carte
   * @returns {String} - Le nom du fichier d'image de fond
   */
  getDefaultMapBackground(mapId) {
    return `world-map${mapId > 1 ? mapId : ''}.png`;
  },

  /**
   * Vérifie si un boss est déclenché après la complétion d'une région
   * @param {Number} regionId - L'ID de la région
   * @param {Array} regions - Toutes les régions disponibles
   * @param {Object} regionChallenges - Les défis des régions
   * @returns {Object|null} - L'objet boss si un boss est déclenché, null sinon
   */
  checkBossTrigger(regionId, regions, regionChallenges) {
    const bossRegion = regions.find(r => r.is_boss && r.trigger_after_region === regionId);
    if (bossRegion) {
      // Pour compatibilité avec le code existant, créer un objet "boss" à partir de la région
      return {
        id: bossRegion.id,
        name: bossRegion.name,
        trigger_after_region: bossRegion.trigger_after_region,
        bossImage: bossRegion.bossImage || regionChallenges[bossRegion.id]?.bossImage,
        bossDefeatedImage: bossRegion.bossDefeatedImage || regionChallenges[bossRegion.id]?.bossDefeatedImage,
        bossPosition: bossRegion.bossPosition || regionChallenges[bossRegion.id]?.bossPosition || 'center',
        dialog: bossRegion.dialog,
        requiredElements: bossRegion.requiredElements,
        availableElements: bossRegion.availableElements,
        elementsWithGifs: bossRegion.elementsWithGifs,
        actionText: bossRegion.actionText,
        rewardCoins: bossRegion.rewardCoins,
        rewardXp: bossRegion.rewardXp,
        damagePerElement: regionChallenges[bossRegion.id]?.damagePerElement,
        bossCombatRules: regionChallenges[bossRegion.id]?.bossCombatRules,
        explorerMapBackground: bossRegion.explorerMapBackground || regionChallenges[bossRegion.id]?.explorerMapBackground
      };
    }
    return null;
  },

  /**
   * Retourne une configuration de défi par défaut
   * @param {Number} mapId - L'ID de la carte
   * @returns {Object} - Configuration de défi par défaut
   */
  getDefaultChallengeConfig(mapId) {
    return {
      npcImage: 'npc1.png',
      npcPosition: 'left',
      dialog: [
        "Bienvenue, explorateur !",
        "Un problème est survenu lors du chargement des défis. Veuillez réessayer."
      ],
      requiredElements: ["DefaultElement"],
      availableElements: ["Element1", "Element2"],
      elementsWithGifs: ["Element1", "Element2"],
      background: null,
      explorerMapBackground: this.getDefaultMapBackground(mapId),
      actionText: "Commencer",
      energyCost: 2,
      energyReward: 5,
      rewardCoins: 50,
      rewardXp: 100,
      unlockHint: "Essayez de combiner différents éléments"
    };
  },

  /**
   * Formate le temps en minutes vers un format plus lisible
   * @param {Number} minutes - Le temps en minutes
   * @returns {String} - Le temps formaté
   */
  formatTime(minutes) {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs > 0 ? hrs + 'h ' : ''}${mins}m`;
  },

  /**
   * Charge les cartes débloquées
   * @returns {Array} - Les IDs des cartes débloquées
   */
  loadUnlockedMaps() {
    try {
      const unlockedMapsStr = localStorage.getItem('unlocked_maps');
      let maps = [];
      if (unlockedMapsStr) {
        const mapsObj = JSON.parse(unlockedMapsStr);
        maps = Object.keys(mapsObj).map(Number).filter(id => mapsObj[id]);
      }
      // La première map est toujours débloquée
      if (!maps.includes(1)) maps.push(1);
      maps.sort((a, b) => a - b);
      return maps;
    } catch (error) {
      console.error('Erreur lors du chargement des cartes débloquées:', error);
      return [1];
    }
  },

  /**
   * Met en évidence les régions disponibles
   * @param {Array} regions - Toutes les régions disponibles
   * @param {Number} currentMapId - L'ID de la carte actuelle
   * @returns {Array} - Les régions disponibles
   */
  highlightAvailableRegions(regions, currentMapId) {
    // Trouver les régions débloquées mais pas encore complétées
    const availableRegions = regions.filter(r => 
      this.isRegionUnlocked(r, regions) && 
      !r.completed && 
      r.map_id === currentMapId
    );
    
    console.log("Régions disponibles dans la nouvelle map:", availableRegions);
    
    return availableRegions;
  },

  /**
   * Détermine si un boss est le boss final de sa carte
   * @param {Object} bossRegion - La région du boss
   * @param {Array} regions - Toutes les régions disponibles
   * @param {Number} currentMapId - L'ID de la carte actuelle
   * @returns {Boolean} - True si le boss est le boss final
   */
  async isFinalBoss(bossRegion, regions, currentMapId) {
    if (!bossRegion) return false;
    
    const bossId = bossRegion.id;
    
    // 1ère méthode: vérifier si c'est le boss avec l'ID le plus élevé dans sa map
    const bossesInCurrentMap = regions.filter(r => r.is_boss && r.map_id === currentMapId);
    if (bossesInCurrentMap.length > 0) {
      const maxBossId = Math.max(...bossesInCurrentMap.map(b => b.id));
      const isFinalByID = bossId === maxBossId;
      
      // 2ème méthode: vérifier si la map suivante est débloquée après la victoire
      try {
        const nextMapId = currentMapId + 1;
        await explorerService.refreshUnlockedMaps();
        const nextMapUnlocked = await explorerService.isMapUnlocked(nextMapId);
        
        return isFinalByID || nextMapUnlocked;
      } catch (e) {
        console.error("Erreur lors de la vérification des maps débloquées:", e);
        return isFinalByID;
      }
    }
    
    return false;
  }
};