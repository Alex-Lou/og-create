// explorerService.js
import api from './api';


/**
 * Service centralisant toutes les opérations liées au mode Explorer
 * Cette version mise à jour utilise uniquement les API backend
 * et évite tout hardcoding de valeurs
 * 
 * Optimisations pour éviter les erreurs 429:
 * - Mise en cache des résultats avec durée de validité
 * - Backoff exponentiel pour les requêtes échouées
 * - Limitation des requêtes simultanées
 * - Mutualisation des requêtes identiques
 */
const explorerService = {
  // Cache pour stocker les informations des boss
  _bossInfoCache: {},
  // Cache pour stocker les informations des maps
  _mapInfoCache: {},
  // Cache pour les régions avec durée de validité
  _regionsCache: {
    data: {},
    timestamp: {},
    validity: 60000 // 60 secondes en millisecondes
  },
  // Cache pour les détails des régions
  _regionDetailsCache: {
    data: {},
    timestamp: {},
    validity: 60000 // 60 secondes
  },
  // Cache pour les données d'initialisation
  _initCache: {
    data: null,
    timestamp: 0,
    validity: 30000 // 30 secondes
  },
  // Cache pour l'énergie du joueur
  _energyCache: {
    data: null,
    timestamp: 0,
    validity: 10000 // 10 secondes
  },
  // Indicateur de requêtes en cours pour mutualiser les appels multiples
  _pendingRequests: {},

  /**
   * Utilitaire pour exécuter une requête avec backoff exponentiel en cas d'erreur 429
   * @private
   * @param {Function} requestFn - Fonction qui effectue la requête
   * @param {string} requestId - Identifiant unique de la requête pour mutualisation
   * @param {number} maxRetries - Nombre maximum de tentatives
   * @param {number} initialDelay - Délai initial en ms
   */
  async _executeWithBackoff(requestFn, requestId = null, maxRetries = 3, initialDelay = 300) {
    // Si un requestId est fourni et qu'une requête avec cet ID est déjà en cours, on la réutilise
    if (requestId && this._pendingRequests[requestId]) {
      try {
        return await this._pendingRequests[requestId];
      } catch (error) {
        // Si la promesse en attente échoue, on continue avec une nouvelle requête
        console.warn(`Requête en attente ${requestId} a échoué, nouvelle tentative...`);
      }
    }

    let retries = 0;
    let delay = initialDelay;

    // Créer une promesse pour la requête
    const requestPromise = (async () => {
      while (retries <= maxRetries) {
        try {
          // Ajouter un petit délai aléatoire pour éviter les burst de requêtes
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
          
          return await requestFn();
        } catch (error) {
          if (error.response && error.response.status === 429 && retries < maxRetries) {
            retries++;
            console.warn(`Erreur 429 reçue, attente de ${delay}ms avant réessai (${retries}/${maxRetries})...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // Backoff exponentiel
          } else {
            throw error; // Propager les autres erreurs ou après trop de tentatives
          }
        }
      }
    })();

    // Si un ID est fourni, stocker la promesse en cours d'exécution
    if (requestId) {
      this._pendingRequests[requestId] = requestPromise;
      
      // Nettoyer après avoir terminé
      requestPromise.finally(() => {
        delete this._pendingRequests[requestId];
      });
    }

    return requestPromise;
  },

  /**
   * Initialise le mode Explorer et récupère les données de base
   */
  async initExplorer() {
    const now = Date.now();
    if (this._initCache.data && (now - this._initCache.timestamp < this._initCache.validity)) {
      console.log('Utilisation des données d\'initialisation en cache');
      return {
        ...this._initCache.data,
        currentMap: await this.getCurrentMap()
      };
    }

    try {
      const response = await api.get('/explorer/init');
      
      console.log('Initialisation Explorer réussie:', response.data);
      
      this._initCache.data = response.data;
      this._initCache.timestamp = now;
      
      this._energyCache.data = {
        energy: response.data.energy,
        max_energy: response.data.max_energy,
        next_energy_in: response.data.next_energy_in
      };
      this._energyCache.timestamp = now;
      
      return {
        ...response.data,
        currentMap: await this.getCurrentMap()
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du mode Explorer:', error);
      
      if (this._initCache.data) {
        console.warn('Utilisation des données d\'initialisation en cache périmées suite à une erreur');
        return {
          ...this._initCache.data,
          currentMap: await this.getCurrentMap()
        };
      }
      
      return {
        energy: 10, 
        max_energy: 20,
        next_energy_in: 0,
        currentMap: 1
      };
    }
  },
  
  /**
   * Récupère toutes les régions ou celles d'une carte spécifique
   * @param {number|null} mapId - ID de la carte à filtrer (facultatif)
   * @param {boolean} forceRefresh - Forcer le rafraîchissement du cache
   */
  async getRegions(mapId = null, forceRefresh = false) {
    const cacheKey = mapId ? `map_${mapId}` : 'all';
    const now = Date.now();
    
    if (!forceRefresh && 
        this._regionsCache.data[cacheKey] && 
        (now - this._regionsCache.timestamp[cacheKey] < this._regionsCache.validity)) {
      console.log(`Utilisation des régions en cache pour ${cacheKey}`);
      return this._regionsCache.data[cacheKey];
    }

    try {
      const url = mapId ? `/explorer/regions?mapId=${mapId}` : '/explorer/regions';
      const response = await api.get(url);
      
      console.log(`Régions récupérées (${mapId ? 'map ' + mapId : 'toutes'}):`, response.data.length);
      
      const regions = response.data.map(region => ({
        ...region,
        explorerMapBackground: `world-map${region.map_id || '1'}.png`
      }));
      
      this._regionsCache.data[cacheKey] = regions;
      this._regionsCache.timestamp[cacheKey] = now;
      
      this._updateBossCache(regions);
      this._updateMapCache(regions);
      
      return regions;
    } catch (error) {
      console.error("Erreur lors de la récupération des régions:", error);
      
      if (this._regionsCache.data[cacheKey]) {
        console.warn(`Utilisation des régions en cache périmées pour ${cacheKey} suite à une erreur`);
        return this._regionsCache.data[cacheKey];
      }
      
      return [];
    }
  },
  
  /**
   * Met à jour le cache des informations des boss
   * @private
   * @param {Array} regions - Liste des régions
   */
  _updateBossCache(regions) {
    // Identifie les boss dans la liste des régions
    const bosses = regions.filter(region => region.is_boss);
    
    // Met à jour le cache
    bosses.forEach(boss => {
      this._bossInfoCache[boss.id] = {
        id: boss.id,
        name: boss.name,
        map_id: boss.map_id,
        trigger_after_region: boss.parent_region_id,
        is_final_boss: this._isFinalBossInMap(boss, regions)
      };
    });
    
    console.log('Cache des boss mis à jour:', Object.keys(this._bossInfoCache).length, 'boss');
  },
  
  /**
   * Détermine si un boss est le boss final de sa carte
   * @private
   * @param {Object} boss - Informations du boss
   * @param {Array} regions - Liste des régions
   * @returns {boolean} - True si c'est le boss final de sa carte
   */
  _isFinalBossInMap(boss, regions) {
    const bossesInMap = regions.filter(r => r.is_boss && r.map_id === boss.map_id);
    const maxBossId = Math.max(...bossesInMap.map(b => b.id));
    return boss.id === maxBossId;
  },
  
  /**
   * Met à jour le cache des informations des maps
   * @private
   * @param {Array} regions - Liste des régions
   */
  _updateMapCache(regions) {
    // Identifie les maps uniques
    const mapIds = [...new Set(regions.map(region => region.map_id))];
    
    // Pour chaque map, identifie le boss final et la région parent
    mapIds.forEach(mapId => {
      const bossesInMap = regions.filter(r => r.is_boss && r.map_id === mapId);
      const maxBossId = bossesInMap.length > 0 ? Math.max(...bossesInMap.map(b => b.id)) : null;
      const finalBoss = bossesInMap.find(b => b.id === maxBossId);
      
      this._mapInfoCache[mapId] = {
        id: mapId,
        finalBossId: maxBossId,
        nextMapId: mapId + 1,
        unlockCondition: finalBoss ? finalBoss.id : null
      };
    });
    
    console.log('Cache des maps mis à jour:', Object.keys(this._mapInfoCache).length, 'maps');
  },
  
  /**
   * Visite une région (dépense de l'énergie)
   * @param {number} regionId - ID de la région à visiter
   * @param {number} energyCost - Coût en énergie de la visite
   */
  async visitRegion(regionId, energyCost = 2) {
    try {
      const regionDetails = await this.getRegionDetails(regionId);
      const isBoss = regionDetails.is_boss || false;
      
      const actualEnergyCost = isBoss ? 0 : energyCost;
      
      const response = await api.post(`/explorer/visit/${regionId}`, { energyCost: actualEnergyCost });
      
      console.log('Visite de région réussie:', response.data);
      
      this._initCache.timestamp = 0;
      this._energyCache.timestamp = 0;
      
      if (this._regionDetailsCache.data[regionId]) {
        this._regionDetailsCache.data[regionId] = {
          ...this._regionDetailsCache.data[regionId],
          visited: true
        };
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la visite de la région ${regionId}:`, error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la visite de la région');
    }
  },
  
  /**
   * Marque une région comme complétée et obtient des récompenses
   * @param {number} regionId - ID de la région à compléter
   * @param {Object} rewards - Récompenses personnalisées (facultatif)
   */
  async completeRegion(regionId, rewards = {}) {
    try {
      const completeRewards = {
        coins: typeof rewards.coins !== 'undefined' ? rewards.coins : 50,
        energy: typeof rewards.energy !== 'undefined' ? rewards.energy : 5,
        xp: typeof rewards.xp !== 'undefined' ? rewards.xp : 100,
        isBossVictory: false
      };
      
      console.log(`Complétion de la région ${regionId} avec récompenses:`, completeRewards);
      
      const response = await api.post(`/explorer/complete/${regionId}`, completeRewards);
      
      console.log('Complétion de région réussie:', response.data);
      
      this._initCache.timestamp = 0;
      this._energyCache.timestamp = 0;
      
      delete this._regionDetailsCache.data[regionId];
      
      Object.keys(this._regionsCache.timestamp).forEach(key => {
        this._regionsCache.timestamp[key] = 0;
      });
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion de la région ${regionId}:`, error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la complétion de la région');
    }
  },
  
  /**
   * Complète un combat de boss
   * @param {number} regionId - ID de la région où le boss a été vaincu
   * @param {Object} options - Options supplémentaires
   */
  async completeBoss(regionId, options = {}) {
    try {
      const isFinalBoss = await this._isRegionFinalBoss(regionId);
      
      let defaultRewards = {
        coins: 500,
        energy: 10,
        xp: 1000
      };
      
      if (isFinalBoss) {
        defaultRewards = {
          coins: 1000,
          energy: 15,
          xp: 2000
        };
      }
      
      const completeOptions = {
        coins: typeof options.coins !== 'undefined' ? options.coins : defaultRewards.coins,
        energy: typeof options.energy !== 'undefined' ? options.energy : defaultRewards.energy,
        xp: typeof options.xp !== 'undefined' ? options.xp : defaultRewards.xp,
        isBossVictory: true,
        bossId: options.bossId || regionId,
        bossRegionId: options.bossRegionId || regionId
      };
      
      console.log(`Complétion du boss ${regionId} avec options:`, completeOptions);
      
      const response = await api.post(`/explorer/complete/${regionId}`, completeOptions);
      
      console.log('Boss vaincu:', response.data);
      
      this._initCache.timestamp = 0;
      this._energyCache.timestamp = 0;
      
      delete this._regionDetailsCache.data[regionId];
      
      Object.keys(this._regionsCache.timestamp).forEach(key => {
        this._regionsCache.timestamp[key] = 0;
      });
      
      if (isFinalBoss && response.data.bossDefeated) {
        await this.refreshUnlockedMaps();
      }
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion du boss dans la région ${regionId}:`, error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la complétion du boss');
    }
  },
  
  /**
   * Vérifie si une région est un boss final
   * @private
   * @param {number} regionId - ID de la région à vérifier
   * @returns {boolean} - True si c'est un boss final
   */
  async _isRegionFinalBoss(regionId) {
    try {
      // Si le boss est dans le cache, utiliser cette information
      if (this._bossInfoCache[regionId]) {
        return this._bossInfoCache[regionId].is_final_boss;
      }
      
      // Sinon, récupérer les détails de la région
      const regionDetails = await this.getRegionDetails(regionId);
      
      if (!regionDetails || !regionDetails.is_boss) {
        return false;
      }
      
      // Récupérer toutes les régions de la même carte
      const mapId = regionDetails.map_id;
      const regions = await this.getRegions(mapId);
      
      const bossesInMap = regions.filter(r => r.is_boss && r.map_id === mapId);
      const maxBossId = Math.max(...bossesInMap.map(b => b.id));
      return regionId === maxBossId;
    } catch (error) {
      console.error(`Erreur lors de la vérification si la région ${regionId} est un boss final:`, error);
      return false;
    }
  },
  
  /**
   * Vérifie si un boss a été vaincu
   * @param {number} bossId - ID du boss à vérifier
   */
  async isBossDefeated(bossId) {
    try {
      // Récupérer les détails de la région (utilise le cache)
      const regionDetails = await this.getRegionDetails(bossId);
      return regionDetails.boss_defeated || regionDetails.completed || false;
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut du boss ${bossId}:`, error);
      return false;
    }
  },
  
  /**
   * Rafraîchit les informations sur les cartes débloquées
   */
  async refreshUnlockedMaps() {
    try {
      // Récupère toutes les régions (utilise le cache si possible)
      const regions = await this.getRegions(null, true); // Forcer la mise à jour
      const unlockedMaps = { 1: true }; // La carte 1 est toujours débloquée
      
      // Identifier toutes les maps disponibles
      const mapIds = [...new Set(regions.map(region => region.map_id))].sort();
      
      // Pour chaque map (sauf la première qui est toujours débloquée)
      for (let i = 1; i < mapIds.length; i++) {
        const currentMapId = mapIds[i];
        const previousMapId = mapIds[i-1];
        
        // Trouver le boss final de la map précédente
        const bossesInPreviousMap = regions.filter(r => r.is_boss && r.map_id === previousMapId);
        
        if (bossesInPreviousMap.length > 0) {
          const maxBossId = Math.max(...bossesInPreviousMap.map(b => b.id));
          const finalBoss = regions.find(r => r.id === maxBossId);
          
          // Si le boss final de la map précédente est vaincu, débloquer cette map
          if (finalBoss && (finalBoss.completed || finalBoss.boss_defeated)) {
            unlockedMaps[currentMapId] = true;
          }
        }
      }
      
      localStorage.setItem('unlocked_maps', JSON.stringify(unlockedMaps));
      console.log('Cartes débloquées mises à jour:', unlockedMaps);
      
      return unlockedMaps;
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des cartes débloquées:", error);
      return { 1: true }; // Par défaut, seule la carte 1 est débloquée
    }
  },
  
  /**
   * Vérifie si une carte est débloquée
   * @param {number} mapId - ID de la carte à vérifier
   */
  async isMapUnlocked(mapId) {
    // La carte 1 est toujours débloquée
    if (mapId === 1) return true;
    
    try {
      // Récupérer les informations des cartes si pas encore disponibles
      if (Object.keys(this._mapInfoCache).length === 0) {
        await this.getRegions(); // Mettra à jour le cache des maps
      }
      
      // Si la map n'existe pas dans le cache, elle n'est pas débloquée
      if (!this._mapInfoCache[mapId - 1]) {
        return false;
      }
      
      // Vérifier si le boss final de la map précédente a été vaincu
      const previousMapFinalBossId = this._mapInfoCache[mapId - 1].finalBossId;
      
      if (!previousMapFinalBossId) {
        return false;
      }
      
      return await this.isBossDefeated(previousMapFinalBossId);
    } catch (error) {
      console.error(`Erreur lors de la vérification du statut de la carte ${mapId}:`, error);
      return mapId === 1; // Seule la carte 1 est garantie
    }
  },
  
  /**
   * Récupère l'ID de la carte active
   */
  async getCurrentMap() {
    try {
      const currentMap = localStorage.getItem('current_map');
      let mapId = currentMap ? parseInt(currentMap) : 1;
      
      // Vérifier si la map est débloquée, sinon revenir à la map 1
      const isUnlocked = await this.isMapUnlocked(mapId);
      return isUnlocked ? mapId : 1;
    } catch (error) {
      console.error("Erreur lors de la récupération de la carte active:", error);
      return 1;
    }
  },
  
  /**
   * Définit la carte active
   * @param {number} mapId - ID de la carte à activer
   */
  async setCurrentMap(mapId) {
    try {
      // Vérifie si la carte est débloquée
      const isUnlocked = await this.isMapUnlocked(mapId);
      
      if (!isUnlocked) {
        console.warn(`Tentative de définir une carte non débloquée: ${mapId}`);
        return false;
      }
      
      localStorage.setItem('current_map', mapId.toString());
      console.log(`Carte active changée pour: ${mapId}`);
      return true;
    } catch (error) {
      console.error("Erreur lors du changement de carte:", error);
      return false;
    }
  },
  
 /**
 * Achète de l'énergie avec des pièces avec un verrouillage pour éviter les achats multiples accidentels
 * @param {number} amount - Quantité d'énergie à acheter
 */
_isEnergyPurchaseInProgress: false,
_lastPurchaseTimestamp: 0,

async buyEnergy(amount = 1) {
  // Éviter les achats multiples si une transaction est en cours
  if (this._isEnergyPurchaseInProgress) {
    console.warn('Achat d\'énergie en cours, veuillez patienter...');
    return { alreadyInProgress: true };
  }
  
  // Éviter les achats trop rapprochés
  const now = Date.now();
  if (now - this._lastPurchaseTimestamp < 300) {
    console.warn('Achat trop rapproché du précédent, ignoré');
    return { tooSoon: true };
  }
  
  try {
    this._isEnergyPurchaseInProgress = true;
    this._lastPurchaseTimestamp = now;
    
    // Appel à l'API
    const response = await api.post('/explorer/buy-energy', { 
      amount,
      client_timestamp: now
    });
    
    console.log('Achat d\'énergie réussi:', response.data);
    
    // Mise à jour directe des caches
    this._energyCache.data = {
      energy: response.data.energy,
      max_energy: response.data.max_energy || this._energyCache.data?.max_energy || 20,
      next_energy_in: 30 // Valeur par défaut
    };
    this._energyCache.timestamp = now;
    
    if (this._initCache.data) {
      this._initCache.data.energy = response.data.energy;
      this._initCache.data.max_energy = response.data.max_energy || this._initCache.data.max_energy;
    }
    
    // Forcer un rafraîchissement lors du prochain check
    this._forceEnergyRefresh = true;
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'achat d\'énergie:', error);
    throw error;
  } finally {
    // Débloquer les achats après un court délai
    setTimeout(() => {
      this._isEnergyPurchaseInProgress = false;
    }, 200);
  }
},

/**
 * Rafraîchit toutes les données après un achat
 */
async refreshAfterPurchase() {
  // Invalider complètement les caches
  this._initCache.data = null;
  this._initCache.timestamp = 0;
  this._energyCache.data = null;
  this._energyCache.timestamp = 0;
  this._forceEnergyRefresh = true;
  
  // Forcer un rechargement des données
  return await this.checkEnergy();
},

  async checkEnergy() {
    const now = Date.now();
    
    // Toujours éviter d'utiliser le cache après une opération d'achat ou d'abandon
    if (this._energyCache.data && 
        (now - this._energyCache.timestamp < this._energyCache.validity) && 
        !this._forceEnergyRefresh) {
      console.log('Utilisation des données d\'énergie en cache');
      return this._energyCache.data;
    }
    
    // Réinitialiser le flag de rafraîchissement forcé
    this._forceEnergyRefresh = false;
    
    try {
      // Ajouter un petit délai aléatoire pour éviter les requêtes simultanées
      await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
      
      const response = await this._executeWithBackoff(
        async () => await api.get('/explorer/init'),
        'check-energy',
        3,
        1000
      );
      
      const energyData = {
        energy: response.data.energy,
        max_energy: response.data.max_energy,
        next_energy_in: response.data.next_energy_in
      };
      
      this._energyCache.data = energyData;
      this._energyCache.timestamp = now;
      
      this._initCache.data = response.data;
      this._initCache.timestamp = now;
      
      return energyData;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'énergie:', error);
      
      if (this._energyCache.data) {
        return this._energyCache.data;
      }
      
      return { energy: 0, max_energy: 20, next_energy_in: 30 };
    }
  },
  
  
  
  /**
   * Synchronise les régions depuis le fichier JSON vers la base de données
   * (Fonction d'administration)
   */
  async syncRegions() {
    try {
      const response = await api.post('/explorer/sync-regions');
      
      console.log('Synchronisation des régions réussie:', response.data);
      
      Object.keys(this._regionsCache.timestamp).forEach(key => {
        this._regionsCache.timestamp[key] = 0;
      });
      
      await this.getRegions(null, true);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des régions:', error);
      throw new Error('Impossible de synchroniser les régions');
    }
  },

  async abandonChallenge(regionId, energyCost = 0) {
    try {
      // Assurer que le coût d'énergie est positif
      const actualEnergyCost = Math.max(0, energyCost);
      
      console.log(`Abandon du défi pour la région ${regionId} avec un coût d'énergie de ${actualEnergyCost}`);
      
      // Appel à l'API pour abandonner le défi
      const response = await api.post(`/explorer/abandon/${regionId}`, { 
        energyCost: actualEnergyCost 
      });
      
      console.log('Défi abandonné:', response.data);
      
      // IMPORTANT: Mettre à jour directement l'énergie dans le cache
      if (response.data && response.data.energy !== undefined) {
        this._energyCache.data = {
          energy: response.data.energy,
          max_energy: this._energyCache.data?.max_energy || 20,
          next_energy_in: this._energyCache.data?.next_energy_in || 30
        };
        this._energyCache.timestamp = Date.now(); // Mettre à jour le timestamp
        
        // Si le cache init existe aussi, le mettre à jour
        if (this._initCache.data) {
          this._initCache.data.energy = response.data.energy;
        }
      }
      
      // Forcer une actualisation globale lors du prochain contrôle
      this._forceEnergyRefresh = true;
      
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'abandon du défi dans la région ${regionId}:`, error);
      
      // En cas d'erreur, forcer un rechargement complet des données d'énergie
      await this.checkEnergy();
      
      return null;
    }
  },
  
  /**
   * Synchronise les éléments découverts par les utilisateurs
   * (Fonction d'administration)
   */
  async syncRequiredElements() {
    try {
      const response = await api.post('/explorer/sync-discovered-elements');
      
      console.log('Synchronisation des éléments requis réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des éléments requis:', error);
      throw new Error('Impossible de synchroniser les éléments requis');
    }
  },
  
  /**
   * Découvre un élément dans une région
   * @param {number} regionId - ID de la région
   * @param {string} elementName - Nom de l'élément découvert
   */
  async discoverElement(regionId, elementName) {
    try {
      const response = await api.post(`/explorer/discover/${regionId}/${elementName}`);
      
      console.log(`Élément ${elementName} découvert dans la région ${regionId}:`, response.data);
      
      delete this._regionDetailsCache.data[regionId];
      
      return {
        ...response.data,
        required_elements: response.data.required_elements
      };
    } catch (error) {
      console.error(`Erreur lors de la découverte de l'élément ${elementName}:`, error);
      throw new Error(error.response?.data?.message || `Erreur lors de la découverte de l'élément ${elementName}`);
    }
  },
  
  /**
   * Récupère les détails d'une région spécifique
   * @param {number} regionId - ID de la région
   */
  async getRegionDetails(regionId) {
    const now = Date.now();
    if (this._regionDetailsCache.data[regionId] && 
        (now - this._regionDetailsCache.timestamp[regionId] < this._regionDetailsCache.validity)) {
      console.log(`Utilisation des détails de la région ${regionId} en cache`);
      return this._regionDetailsCache.data[regionId];
    }
    
    try {
      const response = await api.get(`/explorer/regions/${regionId}`);
      
      const regionDetails = {
        ...response.data,
        explorerMapBackground: `world-map${response.data.map_id || '1'}.png`
      };
      
      this._regionDetailsCache.data[regionId] = regionDetails;
      this._regionDetailsCache.timestamp[regionId] = now;
      
      return regionDetails;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails de la région ${regionId}:`, error);
      throw new Error(`Impossible de récupérer les détails de la région ${regionId}`);
    }
  }
};

export default explorerService;