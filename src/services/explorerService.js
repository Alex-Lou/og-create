// explorerService.js
import axios from 'axios';

const explorerService = {
  // Initialiser le mode Explorer
  async initExplorer() {
    try {
      const response = await axios.get('/api/progress/explorer/init');
      console.log('Initialisation Explorer réussie:', response.data);
      
      // Vérifier s'il y a des informations sur la map active
      const currentMap = localStorage.getItem('current_map') || '1';
      return {
        ...response.data,
        currentMap: parseInt(currentMap)
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du mode Explorer:', error);
      
      // Valeurs par défaut en cas d'erreur
      return {
        energy: 10, 
        max_energy: 20,
        next_energy_in: 0,
        currentMap: 1
      };
    }
  },
  
  async getRegions(mapId = null) {
    try {
      const response = await axios.get('/api/explorer/regions');
      console.log('Toutes les régions récupérées de la BDD:', response.data.length);
      
      const filteredRegions = mapId 
        ? response.data.filter(region => region.map_id === mapId)
        : response.data;
      
      const regionsWithBackground = filteredRegions.map(region => ({
        ...region,
        explorerMapBackground: `world-map${region.map_id}.png`,
        is_default: region.is_default
      }));
      
      return regionsWithBackground;
    } catch (error) {
      try {
        const jsonResponse = await axios.get('/data/regionChallenges.json');
        const filteredRegions = jsonResponse.data.regions
          .filter(region => mapId ? region.map_id === mapId : true);
        
        return filteredRegions.map(region => ({
          ...region,
          visited: false,
          completed: false,
          progress: 0,
          explorerMapBackground: `world-map${region.map_id}.png`
        }));
      } catch (jsonError) {
        console.error("Erreur lors du fallback sur JSON:", jsonError);
        return [];
      }
    }
  },
  
  // Visiter une région (dépenser de l'énergie)
async visitRegion(regionId, energyCost = 2, retryCount = 0) {
  try {
    const response = await axios.post(`/api/explorer/visit/${regionId}`, {
      energyCost: energyCost
    });
    console.log('Visite de région réussie, réponse:', response.data);
    
    // Si le backend indique que la région est déjà complétée, on ne dépense pas d'énergie
    if (response.data.alreadyCompleted || (response.data.message && response.data.message.includes("déjà complétée"))) {
      console.log('Région déjà complétée, pas de coût d\'énergie');
      return { 
        energy: response.data.energy, 
        message: response.data.message, 
        region: response.data.region,
        alreadyCompleted: true 
      };
    }
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retryCount < 3) {
      const waitTime = 1000 * (retryCount + 1);
      console.warn(`Trop de requêtes, nouvelle tentative dans ${waitTime / 1000} secondes...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.visitRegion(regionId, energyCost, retryCount + 1);
    }
    console.error(`Erreur lors de la visite de la région ${regionId}:`, error);
    throw new Error(error.response?.data?.message || 'Erreur lors de la visite de la région');
  }
},
  
  // Compléter une région (obtenir des récompenses)
async completeRegion(regionId, rewards = {}) {
  try {
    console.log(`Tentative de complétion de la région ${regionId} avec récompenses:`, rewards);
    const response = await axios.post(`/api/explorer/complete/${regionId}`, {
      coins: rewards.coins || 50,
      energy: rewards.energy || 5,
      xp: rewards.xp || 100,
      hasBoss: rewards.hasBoss || false,
      bossDefeated: rewards.bossDefeated || false,
      isBossRegion: rewards.isBossRegion || false
    });
    
    console.log('Complétion de région réussie, réponse:', response.data);
    
    // Si la région était déjà complétée, renvoyer les valeurs actuelles sans récompense
    if (response.data.alreadyCompleted || (response.data.message && response.data.message.includes("déjà complétée"))) {
      return {
        message: response.data.message,
        rewards: response.data.rewards || { coins: 0, energy: 0, xp: 0 },
        alreadyCompleted: true
      };
    }
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la complétion de la région ${regionId}:`, error);
    const simulatedResponse = {
      message: `Région ${regionId} complétée (simulation en cas d'erreur)`,
      rewards: {
        coins: rewards.coins || 50,
        energy: rewards.energy || 5,
        xp: rewards.xp || 100
      }
    };
    console.log('Utilisation d\'une réponse simulée:', simulatedResponse);
    return simulatedResponse;
  }
},
  
  // Compléter un boss (obtenir des récompenses)
  async completeBoss(bossId, rewards = {}) {
    try {
      console.log(`Tentative de complétion du boss ${bossId} avec récompenses:`, rewards);
      const bossRegionId = rewards.bossRegionId || bossId;
      const response = await axios.post(`/api/explorer/complete/${bossRegionId}`, {
        coins: rewards.coins || 500,
        energy: rewards.energy || 10,
        xp: rewards.xp || 1000,
        isBossVictory: true,
        isBossRegion: true,
        bossDefeated: true
      });
      
      this.saveBossDefeatedStatus(bossRegionId);
      if (bossRegionId === 5) {
        this.unlockNextMap(2);
      }
      
      console.log('Complétion de boss réussie, réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion du boss ${bossId}:`, error);
      const simulatedResponse = {
        message: `Boss ${bossId} vaincu (simulation en cas d'erreur)`,
        rewards: {
          coins: rewards.coins || 500,
          energy: rewards.energy || 10,
          xp: rewards.xp || 1000
        },
        region_completed: rewards.regionId,
        boss_defeated: true
      };
      if (bossId === 5 || rewards.bossRegionId === 5) {
        this.unlockNextMap(2);
      }
      console.log('Utilisation d\'une réponse simulée pour le boss:', simulatedResponse);
      return simulatedResponse;
    }
  },

  saveBossDefeatedStatus(bossId) {
    try {
      const existingStatus = localStorage.getItem('bosses_defeated');
      const defeatedBosses = existingStatus ? JSON.parse(existingStatus) : {};
      defeatedBosses[bossId] = true;
      localStorage.setItem('bosses_defeated', JSON.stringify(defeatedBosses));
      console.log(`Boss ${bossId} marqué comme vaincu dans le localStorage`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du statut du boss:", error);
    }
  },
  
  isBossDefeated(bossId) {
    try {
      const defeatedBosses = localStorage.getItem('bosses_defeated');
      if (!defeatedBosses) return false;
      const parsed = JSON.parse(defeatedBosses);
      return !!parsed[bossId];
    } catch (error) {
      console.error("Erreur lors de la vérification du statut du boss:", error);
      return false;
    }
  },
  
  unlockNextMap(mapId) {
    try {
      localStorage.setItem('current_map', mapId.toString());
      const unlockedMaps = localStorage.getItem('unlocked_maps');
      const maps = unlockedMaps ? JSON.parse(unlockedMaps) : {};
      maps[mapId] = true;
      localStorage.setItem('unlocked_maps', JSON.stringify(maps));
      console.log(`Map ${mapId} débloquée et activée`);
      return true;
    } catch (error) {
      console.error("Erreur lors du déblocage de la map:", error);
      return false;
    }
  },
  
  isMapUnlocked(mapId) {
    try {
      const unlockedMaps = localStorage.getItem('unlocked_maps');
      const maps = unlockedMaps ? JSON.parse(unlockedMaps) : {};
      return mapId === 1 || !!maps[mapId];
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de la map:", error);
      return mapId === 1;
    }
  },
  
  getCurrentMap() {
    try {
      const currentMap = localStorage.getItem('current_map');
      return currentMap ? parseInt(currentMap) : 1;
    } catch (error) {
      console.error("Erreur lors de la récupération de la map active:", error);
      return 1;
    }
  },
  
  setCurrentMap(mapId) {
    try {
      if (!this.isMapUnlocked(mapId)) {
        console.warn(`Tentative de définir une map non débloquée: ${mapId}`);
        return false;
      }
      localStorage.setItem('current_map', mapId.toString());
      console.log(`Map active changée pour: ${mapId}`);
      return true;
    } catch (error) {
      console.error("Erreur lors du changement de map:", error);
      return false;
    }
  },
  
  async buyEnergy(amount = 1, costPerEnergy = 10) {
    try {
      console.log(`Tentative d'achat de ${amount} point(s) d'énergie pour ${amount * costPerEnergy} pièces`);
      const response = await axios.post('/api/explorer/buy-energy', {
        amount: amount,
        costPerEnergy: costPerEnergy
      });
      console.log('Achat d\'énergie réussi, nouvelle énergie:', response.data.energy);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'achat d\'énergie:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'achat d\'énergie');
    }
  },
  
  async checkEnergy() {
    try {
      const response = await axios.get('/api/progress/explorer/energy');
      console.log('Énergie actuelle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'énergie:', error);
      return { energy: 0, max_energy: 20 };
    }
  },
  
  async syncRegions() {
    try {
      console.log('Tentative de synchronisation des régions avec le JSON');
      const response = await axios.post('/api/explorer/sync-regions');
      console.log('Synchronisation des régions réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des régions:', error);
      throw new Error('Impossible de synchroniser les régions');
    }
  },

  async syncDiscoveredElements() {
    try {
      console.log('Tentative de synchronisation des éléments découverts');
      const response = await axios.post('/api/explorer/sync-discovered-elements');
      console.log('Synchronisation des éléments découverts réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des éléments découverts:', error);
      throw new Error('Impossible de synchroniser les éléments découverts');
    }
  },
  
  async refreshRegionStatus(mapId = null) {
    try {
      console.log('Rafraîchissement du statut des régions');
      const response = await axios.get('/api/explorer/regions/status');
      const currentMapId = mapId || this.getCurrentMap();
      const mapRegions = response.data.filter(region => {
        if (currentMapId === 1) return region.id >= 1 && region.id <= 5;
        if (currentMapId === 2) return region.id >= 6 && region.id <= 10;
        return true;
      });
      
      const updatedStatus = mapRegions.map(region => {
        if (region.is_boss && this.isBossDefeated(region.id)) {
          return {
            ...region,
            completed: true,
            visited: true
          };
        }
        return region;
      });
      
      console.log('Statut des régions rafraîchi:', updatedStatus);
      return updatedStatus;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du statut des régions:', error);
      return [];
    }
  }
};

export default explorerService;
