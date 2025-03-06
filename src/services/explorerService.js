// explorerService.js
import axios from 'axios';

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
    // Vérifier si les données en cache sont toujours valides
    const now = Date.now();
    if (this._initCache.data && (now - this._initCache.timestamp < this._initCache.validity)) {
      console.log('Utilisation des données d\'initialisation en cache');
      return {
        ...this._initCache.data,
        currentMap: await this.getCurrentMap() // Toujours obtenir la carte active
      };
    }

    try {
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.get('/api/explorer/init'),
        'init_explorer'
      );
      
      console.log('Initialisation Explorer réussie:', response.data);
      
      // Mettre en cache les données
      this._initCache.data = response.data;
      this._initCache.timestamp = now;
      
      // Mettre à jour aussi le cache d'énergie
      this._energyCache.data = {
        energy: response.data.energy,
        max_energy: response.data.max_energy,
        next_energy_in: response.data.next_energy_in
      };
      this._energyCache.timestamp = now;
      
      return {
        ...response.data,
        currentMap: await this.getCurrentMap() // Obtient la carte active
      };
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du mode Explorer:', error);
      
      // Si on a des données en cache, même expirées, on les utilise en cas d'erreur
      if (this._initCache.data) {
        console.warn('Utilisation des données d\'initialisation en cache périmées suite à une erreur');
        return {
          ...this._initCache.data,
          currentMap: await this.getCurrentMap()
        };
      }
      
      // Valeurs par défaut en dernier recours
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
    
    // Vérifier si les données en cache sont toujours valides et non forcées à rafraîchir
    if (!forceRefresh && 
        this._regionsCache.data[cacheKey] && 
        (now - this._regionsCache.timestamp[cacheKey] < this._regionsCache.validity)) {
      console.log(`Utilisation des régions en cache pour ${cacheKey}`);
      return this._regionsCache.data[cacheKey];
    }

    try {
      // Utiliser le système de backoff pour la requête
      const url = mapId ? `/api/explorer/regions?mapId=${mapId}` : '/api/explorer/regions';
      const response = await this._executeWithBackoff(
        () => axios.get(url),
        `get_regions_${cacheKey}`
      );
      
      console.log(`Régions récupérées (${mapId ? 'map ' + mapId : 'toutes'}):`, response.data.length);
      
      // Ajoute le chemin d'accès au fond de carte pour chaque région
      const regions = response.data.map(region => ({
        ...region,
        explorerMapBackground: `world-map${region.map_id || '1'}.png`
      }));
      
      // Mettre en cache les données
      this._regionsCache.data[cacheKey] = regions;
      this._regionsCache.timestamp[cacheKey] = now;
      
      // Met à jour le cache des informations des boss
      this._updateBossCache(regions);
      
      // Met à jour le cache des informations des maps
      this._updateMapCache(regions);
      
      return regions;
    } catch (error) {
      console.error("Erreur lors de la récupération des régions:", error);
      
      // Si on a des données en cache, même expirées, on les utilise en cas d'erreur
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
      // Récupérer les détails de la région (utilise le cache)
      const regionDetails = await this.getRegionDetails(regionId);
      const isBoss = regionDetails.is_boss || false;
      
      // Pour les boss, on force le coût à 0
      const actualEnergyCost = isBoss ? 0 : energyCost;
      
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.post(`/api/explorer/visit/${regionId}`, { energyCost: actualEnergyCost }),
        `visit_region_${regionId}`
      );
      
      console.log('Visite de région réussie:', response.data);
      
      // Invalider les caches impactés
      this._initCache.timestamp = 0; // Forcer le rafraîchissement du cache d'initialisation
      this._energyCache.timestamp = 0; // Forcer le rafraîchissement du cache d'énergie
      
      // Mettre à jour les détails de la région dans le cache
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
      // S'assurer que toutes les propriétés de récompense sont définies
      const completeRewards = {
        coins: typeof rewards.coins !== 'undefined' ? rewards.coins : 50,
        energy: typeof rewards.energy !== 'undefined' ? rewards.energy : 5,
        xp: typeof rewards.xp !== 'undefined' ? rewards.xp : 100,
        isBossVictory: false
      };
      
      console.log(`Complétion de la région ${regionId} avec récompenses:`, completeRewards);
      
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.post(`/api/explorer/complete/${regionId}`, completeRewards),
        `complete_region_${regionId}`
      );
      
      console.log('Complétion de région réussie:', response.data);
      
      // Invalider les caches impactés
      this._initCache.timestamp = 0; // Forcer le rafraîchissement du cache d'initialisation
      this._energyCache.timestamp = 0; // Forcer le rafraîchissement du cache d'énergie
      
      // Invalider le cache de détails pour cette région
      delete this._regionDetailsCache.data[regionId];
      
      // Invalider tous les caches de régions pour les forcer à se rafraîchir
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
      // Vérifier directement si c'est un boss final sans stocker le résultat dans une variable inutilisée
      const isFinalBoss = await this._isRegionFinalBoss(regionId);
      
      // Déterminer les récompenses par défaut en fonction du boss
      let defaultRewards = {
        coins: 500,
        energy: 10,
        xp: 1000
      };
      
      // Si c'est un boss final, augmenter les récompenses
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
      
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.post(`/api/explorer/complete/${regionId}`, completeOptions),
        `complete_boss_${regionId}`
      );
      
      console.log('Boss vaincu:', response.data);
      
      // Invalider les caches impactés
      this._initCache.timestamp = 0; // Forcer le rafraîchissement du cache d'initialisation
      this._energyCache.timestamp = 0; // Forcer le rafraîchissement du cache d'énergie
      
      // Invalider le cache de détails pour cette région
      delete this._regionDetailsCache.data[regionId];
      
      // Invalider tous les caches de régions pour les forcer à se rafraîchir
      Object.keys(this._regionsCache.timestamp).forEach(key => {
        this._regionsCache.timestamp[key] = 0;
      });
      
      // Si c'est un boss final, débloquer la carte suivante
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
   * Achète de l'énergie avec des pièces
   * @param {number} amount - Quantité d'énergie à acheter
   */
  async buyEnergy(amount = 1) {
    try {
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.post('/api/explorer/buy-energy', { amount }),
        'buy_energy'
      );
      
      console.log('Achat d\'énergie réussi:', response.data);
      
      // Invalider les caches impactés
      this._initCache.timestamp = 0; // Forcer le rafraîchissement du cache d'initialisation
      this._energyCache.timestamp = 0; // Forcer le rafraîchissement du cache d'énergie
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'achat d\'énergie:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'achat d\'énergie');
    }
  },
  
  /**
   * Vérifie l'énergie actuelle du joueur
   */
  async checkEnergy() {
    // Vérifier si les données en cache sont toujours valides
    const now = Date.now();
    if (this._energyCache.data && (now - this._energyCache.timestamp < this._energyCache.validity)) {
      console.log('Utilisation des données d\'énergie en cache');
      return this._energyCache.data;
    }
    
    try {
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.get('/api/explorer/init'),
        'check_energy'
      );
      
      const energyData = {
        energy: response.data.energy,
        max_energy: response.data.max_energy,
        next_energy_in: response.data.next_energy_in
      };
      
      // Mettre à jour le cache
      this._energyCache.data = energyData;
      this._energyCache.timestamp = now;
      
      // Mettre à jour aussi le cache d'initialisation
      this._initCache.data = response.data;
      this._initCache.timestamp = now;
      
      return energyData;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'énergie:', error);
      
      // Si on a des données en cache, même expirées, on les utilise en cas d'erreur
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
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.post('/api/explorer/sync-regions'),
        'sync_regions'
      );
      
      console.log('Synchronisation des régions réussie:', response.data);
      
      // Invalider tous les caches de régions
      Object.keys(this._regionsCache.timestamp).forEach(key => {
        this._regionsCache.timestamp[key] = 0;
      });
      
      // Forcer le rechargement des régions
      await this.getRegions(null, true);
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des régions:', error);
      throw new Error('Impossible de synchroniser les régions');
    }
  },
  
  /**
   * Synchronise les éléments découverts par les utilisateurs
   * (Fonction d'administration)
   */
  async syncRequiredElements() {
    try {
      // Notez que l'endpoint lui-même reste le même car nous n'avons pas modifié les routes Express
      const response = await this._executeWithBackoff(
        () => axios.post('/api/explorer/sync-discovered-elements'),
        'sync_required_elements'
      );
      
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
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.post(`/api/explorer/discover/${regionId}/${elementName}`),
        `discover_element_${regionId}_${elementName}`
      );
      
      console.log(`Élément ${elementName} découvert dans la région ${regionId}:`, response.data);
      
      // Invalider le cache de détails pour cette région
      delete this._regionDetailsCache.data[regionId];
      
      // Mettre à jour cette partie - changer required_elements au lieu de discovered_elements
      return {
        ...response.data,
        required_elements: response.data.required_elements // cette ligne remplace discovered_elements
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
    // Vérifier si les données en cache sont toujours valides
    const now = Date.now();
    if (this._regionDetailsCache.data[regionId] && 
        (now - this._regionDetailsCache.timestamp[regionId] < this._regionDetailsCache.validity)) {
      console.log(`Utilisation des détails de la région ${regionId} en cache`);
      return this._regionDetailsCache.data[regionId];
    }
    
    try {
      // Utiliser le système de backoff pour la requête
      const response = await this._executeWithBackoff(
        () => axios.get(`/api/explorer/regions/${regionId}`),
        `get_region_details_${regionId}`
      );
      
      // Ajouter les détails au cache
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