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
  
  async getRegions(mapId = 1) {
    try {
      // Toujours charger TOUTES les régions de la base de données
      const response = await axios.get('/api/explorer/regions');
      console.log('Toutes les régions récupérées de la BDD:', response.data.length);
      
      // Puis filtrer localement selon la carte active
      const filteredRegions = response.data.filter(region => {
        if (mapId === 1) return region.id >= 1 && region.id <= 5;
        if (mapId === 2) return region.id >= 6 && region.id <= 10;
        return true;
      });
      
      console.log(`Régions filtrées pour carte ${mapId}:`, filteredRegions.length);
      
      // Assurer que les régions ont les bonnes propriétés explorerMapBackground
      const regionsWithBackground = filteredRegions.map(region => {
        // Enrichir les données avec explorerMapBackground et is_default si nécessaire
        if (mapId === 1) {
          return {
            ...region,
            explorerMapBackground: "world-map.png",
            is_default: region.id === 1 ? true : region.is_default
          };
        } else if (mapId === 2) {
          return {
            ...region,
            explorerMapBackground: "world-map2.png",
            is_default: region.id === 6 ? true : region.is_default
          };
        }
        return region;
      });
      
      // Déboguer ce que nous avons obtenu
      console.log(`Infos des régions pour carte ${mapId}:`, 
        regionsWithBackground.map(r => ({ 
          id: r.id, 
          visited: r.visited, 
          completed: r.completed,
          is_default: r.is_default,
          explorerMapBackground: r.explorerMapBackground
        }))
      );
      
      return regionsWithBackground;
    } catch (error) {
      console.error(`Erreur lors de la récupération des régions pour la carte ${mapId}:`, error);
      
      // Fallback sur le JSON si la requête API échoue
      try {
        const jsonResponse = await axios.get('/data/regionChallenges.json');
        const allRegions = jsonResponse.data.regions;
        
        // Filtrer les régions du JSON selon la carte
        const jsonFilteredRegions = allRegions.filter(region => {
          if (mapId === 1) return region.id >= 1 && region.id <= 5;
          if (mapId === 2) return region.id >= 6 && region.id <= 10;
          return true;
        });
        
        // Enrichir avec les propriétés manquantes
        const processedRegions = jsonFilteredRegions.map(region => ({
          ...region,
          visited: false,
          completed: false,
          progress: 0,
          explorerMapBackground: mapId === 1 ? "world-map.png" : "world-map2.png",
          is_default: (mapId === 1 && region.id === 1) || (mapId === 2 && region.id === 6)
        }));
        
        return processedRegions;
      } catch (jsonError) {
        console.error("Erreur lors du fallback sur JSON:", jsonError);
        return [];
      }
    }
  },
  
  // Visiter une région (dépenser de l'énergie) avec gestion des erreurs 429
  async visitRegion(regionId, energyCost = 2, retryCount = 0) {
    try {
      // Vérifier si la région est un boss
      const isBoss = typeof regionId === 'number' && (regionId === 5 || regionId === 10);
      
      // Si c'est un boss, on ne dépense pas d'énergie
      if (isBoss) {
        return {
          energy: 10,
          message: "Combat de boss commencé"
        };
      }
      
      console.log(`Tentative de visite de la région ${regionId} (coût: ${energyCost})`);
      const response = await axios.post(`/api/explorer/visit/${regionId}`, {
        energyCost: energyCost
      });
      console.log('Visite de région réussie, énergie restante:', response.data.energy);
      return response.data;
    } catch (error) {
      // Vérifier si c'est une erreur 429 (trop de requêtes)
      if (error.response && error.response.status === 429 && retryCount < 3) {
        const waitTime = 1000 * (retryCount + 1); // Temps d'attente progressif
        console.warn(`Trop de requêtes, nouvelle tentative dans ${waitTime/1000} secondes...`);
        
        // Attendre et réessayer
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
      // Modifier cette ligne pour correspondre à la route backend '/complete/:regionId'
      const response = await axios.post(`/api/explorer/complete/${regionId}`, {
        coins: rewards.coins || 50,
        energy: rewards.energy || 5,
        xp: rewards.xp || 100,
        hasBoss: rewards.hasBoss || false,
        bossDefeated: rewards.bossDefeated || false,
        isBossRegion: rewards.isBossRegion || false
      });
      console.log('Complétion de région réussie, réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion de la région ${regionId}:`, error);
      
      // Retourner une réponse simulée en cas d'erreur
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
      
      // Dans le nouveau format, le bossId est l'ID de la région (typiquement 5 ou 10)
      const bossRegionId = rewards.bossRegionId || bossId;
      
      // Utiliser la route standard avec les paramètres boss
      const response = await axios.post(`/api/explorer/complete/${bossRegionId}`, {
        coins: rewards.coins || 500,
        energy: rewards.energy || 10,
        xp: rewards.xp || 1000,
        isBossVictory: true,  // Ce paramètre est crucial
        isBossRegion: true,   // Indiquer que c'est une région de boss
        bossDefeated: true    // Marquer le boss comme vaincu
      });
      
      // Sauvegarder le statut du boss vaincu dans le localStorage
      this.saveBossDefeatedStatus(bossRegionId);
      
      // Si c'est le boss de la première map (ID 5), activer la deuxième map
      if (bossRegionId === 5) {
        this.unlockNextMap(2);
      }
      
      console.log('Complétion de boss réussie, réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion du boss ${bossId}:`, error);
      
      // Retourner une réponse simulée en cas d'erreur
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
      
      // Si c'est le boss de la première map (ID 5), activer la deuxième map même en cas d'erreur
      if (bossId === 5 || rewards.bossRegionId === 5) {
        this.unlockNextMap(2);
      }
      
      console.log('Utilisation d\'une réponse simulée pour le boss:', simulatedResponse);
      return simulatedResponse;
    }
  },

  // Sauvegarder le statut vaincu d'un boss
  saveBossDefeatedStatus(bossId) {
    try {
      // Récupérer l'état actuel
      const existingStatus = localStorage.getItem('bosses_defeated');
      const defeatedBosses = existingStatus ? JSON.parse(existingStatus) : {};
      
      // Marquer ce boss comme vaincu
      defeatedBosses[bossId] = true;
      
      // Sauvegarder
      localStorage.setItem('bosses_defeated', JSON.stringify(defeatedBosses));
      
      console.log(`Boss ${bossId} marqué comme vaincu dans le localStorage`);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du statut du boss:", error);
    }
  },
  
  // Vérifier si un boss a été vaincu
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
  
  // Nouvelle fonction: Débloquer la carte suivante
  unlockNextMap(mapId) {
    try {
      // Sauvegarder la map active
      localStorage.setItem('current_map', mapId.toString());
      
      // Sauvegarder dans l'historique des maps débloquées
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
  
  // Nouvelle fonction: Vérifier si une map est débloquée
  isMapUnlocked(mapId) {
    try {
      // La première map est toujours débloquée
      if (mapId === 1) return true;
      
      const unlockedMaps = localStorage.getItem('unlocked_maps');
      if (!unlockedMaps) return false;
      
      const maps = JSON.parse(unlockedMaps);
      return !!maps[mapId];
    } catch (error) {
      console.error("Erreur lors de la vérification du statut de la map:", error);
      return mapId === 1; // La première map est toujours débloquée par défaut
    }
  },
  
  // Nouvelle fonction: Obtenir la map active
  getCurrentMap() {
    try {
      const currentMap = localStorage.getItem('current_map');
      return currentMap ? parseInt(currentMap) : 1;
    } catch (error) {
      console.error("Erreur lors de la récupération de la map active:", error);
      return 1; // Par défaut, retourner la première map
    }
  },
  
  // Nouvelle fonction: Changer la map active
  setCurrentMap(mapId) {
    try {
      // Vérifier d'abord si la map est débloquée
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
  
  // Acheter de l'énergie avec des pièces
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
  
  // Vérifier l'état actuel de l'énergie
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

  // Synchroniser les données des régions depuis le JSON vers la base de données
  async syncRegions() {
    try {
      console.log('Tentative de synchronisation des régions avec le JSON');
      const response = await axios.post('/api/explorer/sync-regions');
      console.log('Synchronisation des régions réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des régions:', error);
      // Rien à retourner en cas d'erreur, simplement logger l'erreur
      throw new Error('Impossible de synchroniser les régions');
    }
  },

  // Synchroniser les éléments découverts par les utilisateurs
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
  
  // Rafraîchir le statut des régions pour l'utilisateur actuel
  async refreshRegionStatus(mapId = null) {
    try {
      console.log('Rafraîchissement du statut des régions');
      const response = await axios.get('/api/explorer/regions/status');
      
      // Si mapId est spécifié, ne retourner que les régions de cette map
      const currentMapId = mapId || this.getCurrentMap();
      const mapRegions = response.data.filter(region => {
        if (currentMapId === 1) return region.id >= 1 && region.id <= 5;
        if (currentMapId === 2) return region.id >= 6 && region.id <= 10;
        return true; // Par défaut, montrer toutes les régions
      });
      
      // Ajouter des informations sur les boss vaincus
      const updatedStatus = mapRegions.map(region => {
        // Si c'est la région du boss et qu'il a été vaincu
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