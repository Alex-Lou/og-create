// src/services/progressService.js
import { apiInstance } from './authService';
import AuthService from './authService';
import achievementsService from './achievementsService';

// Configuration pour le contrôle de débit
const RATE_LIMIT = {
  interval: 10000, // 10 secondes entre les requêtes
  maxRetries: 2,   // 2 tentatives maximum
  initialBackoff: 10000 // 10 secondes avant nouvelle tentative
};

// Horodatage de la dernière requête
let lastRequestTime = 0;

// Cache pour la progression
let progressCache = null;
let lastProgressLoad = 0;
const CACHE_DURATION = 60000;

// Verrouillage pour éviter les chargements simultanés
let isLoading = false;
let pendingLoadRequests = [];

// Variables pour contrôler la fréquence des sauvegardes
let debounceTimer = null;
const DEBOUNCE_DELAY = 15000; // 15 secondes entre les traitements de la file
let lastSaveTime = 0;
const MIN_SAVE_INTERVAL = 30000; // 30 secondes au lieu de 10

// Variable pour le cooldown global en cas d'erreur 429
let globalCooldownUntil = 0;
const GLOBAL_COOLDOWN_DURATION = 30000;

// Fonction pour s'assurer que l'authentification est correctement configurée
function ensureAuthentication() {
  // Vérifier si l'utilisateur est connecté et a un token valide
  const currentUser = AuthService.getCurrentUser();
  if (currentUser && currentUser.token) {
    // Mettre à jour le header d'autorisation
    apiInstance.defaults.headers.common['Authorization'] = `Bearer ${currentUser.token}`;
    return true;
  }
  return false;
}

// Vérifier si nous sommes en période de cooldown global
function isInGlobalCooldown() {
  return Date.now() < globalCooldownUntil;
}

// Activer le cooldown global
function activateGlobalCooldown() {
  globalCooldownUntil = Date.now() + GLOBAL_COOLDOWN_DURATION;
}

// Créer une instance plus spécifique qui utilise l'apiInstance partagée
const progressInstance = {
  async get(endpoint) {
    // Vérifier l'authentification avant chaque requête
    ensureAuthentication();
    
    // Vérifier le cooldown global
    if (isInGlobalCooldown()) {
      await new Promise(resolve => setTimeout(resolve, globalCooldownUntil - Date.now()));
    }
    
    await enforceRateLimit();
    try {
      return await apiInstance.get(`/progress/${endpoint}`);
    } catch (error) {
      // Si erreur d'authentification, essayer de rafraîchir le token
      if (error.response && error.response.status === 401) {
        try {
          await AuthService.refreshToken();
          ensureAuthentication();
          return await apiInstance.get(`/progress/${endpoint}`);
        } catch (refreshError) {
          console.error("Échec du rafraîchissement du token");
          throw error; // Propager l'erreur originale
        }
      }
      
      if (error.response && error.response.status === 429) {
        activateGlobalCooldown();
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT.initialBackoff));
        return this.get(endpoint); // Réessayer avec récursion limitée
      }
      throw error;
    }
  },
  
  async post(endpoint, data, retryCount = 0) {
    if (retryCount >= RATE_LIMIT.maxRetries) {
      console.error(`Nombre maximal de tentatives atteint pour ${endpoint}`);
      throw new Error(`Trop de requêtes (${endpoint}). Réessayez plus tard.`);
    }
    
    // Vérifier l'authentification avant chaque requête
    ensureAuthentication();
    
    // Vérifier le cooldown global
    if (isInGlobalCooldown()) {
      await new Promise(resolve => setTimeout(resolve, globalCooldownUntil - Date.now()));
    }
    
    await enforceRateLimit();
    
    try {
      const response = await apiInstance.post(`/progress/${endpoint}`, data);
      lastRequestTime = Date.now();
      return response;
    } catch (error) {
      // Si erreur d'authentification, essayer de rafraîchir le token
      if (error.response && error.response.status === 401) {
        try {
          await AuthService.refreshToken();
          ensureAuthentication();
          return await apiInstance.post(`/progress/${endpoint}`, data);
        } catch (refreshError) {
          console.error("Échec du rafraîchissement du token");
          throw error; // Propager l'erreur originale
        }
      }
      
      if (error.response && error.response.status === 429) {
        activateGlobalCooldown();
        const waitTime = RATE_LIMIT.initialBackoff * Math.pow(2, retryCount);
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.post(endpoint, data, retryCount + 1);
      }
      throw error;
    }
  }
};

// Fonction pour appliquer la limitation de débit
async function enforceRateLimit() {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  
  if (elapsed < RATE_LIMIT.interval) {
    const waitTime = RATE_LIMIT.interval - elapsed;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

// Variable de verrouillage pour éviter les sauvegardes concurrentes
let isSaving = false;
// File d'attente pour les sauvegardes
let saveQueue = [];
// Variable pour suivre le dernier état connu des pièces
let lastKnownCoins = null;
// Compteur pour les erreurs consécutives
let consecutiveErrors = 0;
// Flag pour indiquer si on est en mode "économie de requêtes"
let conservativeMode = false;

class ProgressService {
  // Méthode utilitaire pour exécuter la file d'attente de sauvegarde
  async processSaveQueue() {
    if (isSaving || saveQueue.length === 0) return;
    
    // Vérifier si nous sommes en cooldown global
    if (isInGlobalCooldown()) {
      setTimeout(() => this.processSaveQueue(), globalCooldownUntil - Date.now() + 5000);
      return;
    }
    
    // Vérifier si le dernier enregistrement était récent
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTime;
    
    if (timeSinceLastSave < MIN_SAVE_INTERVAL) {
      setTimeout(() => this.processSaveQueue(), MIN_SAVE_INTERVAL - timeSinceLastSave + 2000);
      return;
    }
    
    // Si peu de données et pas urgent, attendre davantage
    if (saveQueue.length < 3 && !saveQueue.some(item => item.coins !== undefined)) {
      // Si seulement des données non critiques, attendre plus longtemps
      setTimeout(() => this.processSaveQueue(), MIN_SAVE_INTERVAL * 2);
      return;
    }
    
    // Si nous sommes en mode conservation, limiter la fréquence de traitement
    if (conservativeMode) {
      // Si la file n'est pas assez grande, attendre d'avoir plus d'éléments
      if (saveQueue.length < 5) {
        return;
      }
    }
    
    isSaving = true;
    
    // Sauvegarder la file d'attente actuelle en dehors du bloc try
    const currentQueue = [...saveQueue];
    
    try {
      // Fusionner toutes les données en attente de sauvegarde
      const mergedData = saveQueue.reduce((acc, curr) => {
        // Logique pour fusionner les données
        // Priorité au dernier état pour les valeurs simples comme coins
        if (curr.coins !== undefined) acc.coins = curr.coins;
        
        // Pour les tableaux, faire une union
        if (curr.discoveredElements) {
          acc.discoveredElements = [...new Set([...(acc.discoveredElements || []), ...curr.discoveredElements])];
        }
        if (curr.timerElements) {
          acc.timerElements = [...new Set([...(acc.timerElements || []), ...curr.timerElements])];
        }
        if (curr.explorerElements) {
          acc.explorerElements = [...new Set([...(acc.explorerElements || []), ...curr.explorerElements])];
        }
        if (curr.infiniteElements) {
          acc.infiniteElements = [...new Set([...(acc.infiniteElements || []), ...curr.infiniteElements])];
        }
        if (curr.discoveredCategories) {
          acc.discoveredCategories = [...new Set([...(acc.discoveredCategories || []), ...curr.discoveredCategories])];
        }
        
        // Pour les objets, fusion en profondeur
        if (curr.achievements) {
          acc.achievements = { ...(acc.achievements || {}), ...curr.achievements };
        }
        if (curr.categoryProgress) {
          acc.categoryProgress = { ...(acc.categoryProgress || {}), ...curr.categoryProgress };
        }
        if (curr.timerProgress) {
          acc.timerProgress = {
            completedQuestions: { ...(acc.timerProgress?.completedQuestions || {}), ...(curr.timerProgress.completedQuestions || {}) },
            unlockedCategories: { ...(acc.timerProgress?.unlockedCategories || {}), ...(curr.timerProgress.unlockedCategories || {}) },
            bestScores: {
              Facile: Math.max(acc.timerProgress?.bestScores?.Facile || 0, curr.timerProgress?.bestScores?.Facile || 0),
              Moyen: Math.max(acc.timerProgress?.bestScores?.Moyen || 0, curr.timerProgress?.bestScores?.Moyen || 0),
              Difficile: Math.max(acc.timerProgress?.bestScores?.Difficile || 0, curr.timerProgress?.bestScores?.Difficile || 0)
            }
          };
        }
        if (curr.customization) {
          acc.customization = { ...(acc.customization || {}), ...curr.customization };
        }
        
        return acc;
      }, {});
      
      // Vider la file d'attente avant de tenter la sauvegarde
      saveQueue = [];
      
      // Sauvegarder les données fusionnées
      await this.saveGameProgressDirectly(mergedData);
      
      // Réinitialiser le compteur d'erreurs si tout va bien
      consecutiveErrors = 0;
      
      // Si on était en mode conservation et tout va bien, on peut revenir en mode normal
      if (conservativeMode && consecutiveErrors === 0) {
        conservativeMode = false;
      }
      
      // Mettre à jour l'horodatage de la dernière sauvegarde
      lastSaveTime = Date.now();
      
      // Si des éléments ont été découverts, vérifier les achievements
      if (mergedData.discoveredElements && mergedData.discoveredElements.length > 0) {
        // Vérifier les achievements sans bloquer le processus de sauvegarde
        achievementsService.checkAchievements(mergedData.discoveredElements).catch(error => {
          console.error('Erreur lors de la vérification des achievements:', error);
        });
      }
      
    } catch (error) {
      console.error('Erreur lors du traitement de la file d\'attente de sauvegarde:', error);
      
      // Augmenter le compteur d'erreurs
      consecutiveErrors++;
      
      // Si on reçoit une erreur 429, activer le cooldown global
      if (error.response && error.response.status === 429) {
        activateGlobalCooldown();
      }
      
      // Remettre les éléments dans la file d'attente si l'erreur n'est pas liée à une limitation de débit
      if (!error.response || error.response.status !== 429) {
        saveQueue = [...saveQueue, ...currentQueue];
      } else {
        // En cas de 429, remettre les éléments en file d'attente mais avec un délai plus long
        setTimeout(() => {
          saveQueue = [...saveQueue, ...currentQueue];
          this.processSaveQueue();
        }, GLOBAL_COOLDOWN_DURATION);
      }
      
      // Si trop d'erreurs consécutives, passer en mode conservation
      if (consecutiveErrors >= 3) {
        conservativeMode = true;
      }
      
    } finally {
      isSaving = false;
      
      // S'il y a de nouvelles données à sauvegarder, traiter la file d'attente à nouveau
      // mais avec un délai plus important en cas d'erreurs
      if (saveQueue.length > 0) {
        const delay = conservativeMode ? 45000 : MIN_SAVE_INTERVAL;
        setTimeout(() => this.processSaveQueue(), delay);
      }
    }
  }
  
  // Méthode interne pour sauvegarder directement sans file d'attente
  async saveGameProgressDirectly(progressData) {
    try {
      // Mettre à jour notre cache de pièces si cette information est présente
      if (progressData.coins !== undefined) {
        lastKnownCoins = progressData.coins;
      }
      
      const response = await progressInstance.post('save', progressData);
      
      // Invalider le cache car les données ont changé
      progressCache = null;
      lastProgressLoad = 0;
      
      return response.data;
      
    } catch (error) {
      console.error('Erreur critique dans saveGameProgressDirectly:', error);
      throw error;
    }
  }

  async saveGameProgress(progressData) {
    // Éviter d'ajouter des objets vides à la file d'attente
    if (!progressData || Object.keys(progressData).length === 0) {
      return Promise.resolve({ status: 'skipped', message: 'Aucune donnée à sauvegarder' });
    }
    
    // Si un gameMode est spécifié, organiser les données par mode
    if (progressData.gameMode) {
      const mode = progressData.gameMode;
      delete progressData.gameMode; // Supprimer pour éviter la duplication
      
      if (mode === 'timer' && progressData.discoveredElements) {
        progressData.timerElements = progressData.discoveredElements;
      } else if (mode === 'explorer' && progressData.discoveredElements) {
        progressData.explorerElements = progressData.discoveredElements;
      } else if (mode === 'infinite' && progressData.discoveredElements) {
        progressData.infiniteElements = progressData.discoveredElements;
      }
    }
    
    if (saveQueue.length > 0) {
      const lastItem = saveQueue[saveQueue.length - 1];
      
      if (progressData.coins !== undefined) lastItem.coins = progressData.coins;
      if (progressData.discoveredElements) {
        lastItem.discoveredElements = [...new Set([...(lastItem.discoveredElements || []), ...progressData.discoveredElements])];
      }
      if (progressData.timerElements) {
        lastItem.timerElements = [...new Set([...(lastItem.timerElements || []), ...progressData.timerElements])];
      }
      if (progressData.explorerElements) {
        lastItem.explorerElements = [...new Set([...(lastItem.explorerElements || []), ...progressData.explorerElements])];
      }
      if (progressData.infiniteElements) {
        lastItem.infiniteElements = [...new Set([...(lastItem.infiniteElements || []), ...progressData.infiniteElements])];
      }
      if (progressData.discoveredCategories) {
        lastItem.discoveredCategories = [...new Set([...(lastItem.discoveredCategories || []), ...progressData.discoveredCategories])];
      }
      if (progressData.achievements) {
        lastItem.achievements = { ...(lastItem.achievements || {}), ...progressData.achievements };
      }
      if (progressData.categoryProgress) {
        lastItem.categoryProgress = { ...(lastItem.categoryProgress || {}), ...progressData.categoryProgress };
      }
      if (progressData.timerProgress) {
        lastItem.timerProgress = {
          completedQuestions: { ...(lastItem.timerProgress?.completedQuestions || {}), ...(progressData.timerProgress.completedQuestions || {}) },
          unlockedCategories: { ...(lastItem.timerProgress?.unlockedCategories || {}), ...(progressData.timerProgress.unlockedCategories || {}) },
          bestScores: {
            Facile: Math.max(lastItem.timerProgress?.bestScores?.Facile || 0, progressData.timerProgress?.bestScores?.Facile || 0),
            Moyen: Math.max(lastItem.timerProgress?.bestScores?.Moyen || 0, progressData.timerProgress?.bestScores?.Moyen || 0),
            Difficile: Math.max(lastItem.timerProgress?.bestScores?.Difficile || 0, progressData.timerProgress?.bestScores?.Difficile || 0)
          }
        };
      }
      if (progressData.customization) {
        lastItem.customization = { ...(lastItem.customization || {}), ...progressData.customization };
      }
      
      // Unique débounce timer
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      debounceTimer = setTimeout(() => this.processSaveQueue(), DEBOUNCE_DELAY);
      
      return Promise.resolve({ status: 'merged', message: 'La sauvegarde a été fusionnée avec une existante' });
    }
    
    // Sinon, ajouter à la file d'attente
    saveQueue.push(progressData);
    
    // Débounce pour éviter les sauvegardes trop fréquentes
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      this.processSaveQueue();
    }, DEBOUNCE_DELAY);
    
    // Invalider le cache uniquement si nécessaire
    if (progressData.coins !== undefined || 
        progressData.discoveredElements || 
        progressData.timerElements || 
        progressData.explorerElements || 
        progressData.infiniteElements) {
      progressCache = null;
      lastProgressLoad = 0;
    }
    
    // Si des éléments ont été découverts, vérifier si un nouvel achievement est débloqué
    if (progressData.discoveredElements && progressData.discoveredElements.length > 0) {
      const newElement = progressData.discoveredElements[progressData.discoveredElements.length - 1];
      // Vérifier les achievements sans bloquer
      this.loadGameProgress().then(progress => {
        if (progress && progress.discoveredElements) {
          achievementsService.checkNewElementAchievement(newElement, progress.discoveredElements).catch(error => {
            console.error('Erreur lors de la vérification d\'un nouvel élément pour les achievements:', error);
          });
        }
      }).catch(error => {
        console.error('Erreur lors du chargement des données pour vérifier les achievements:', error);
      });
    }
    
    return Promise.resolve({ status: 'queued', message: 'La sauvegarde a été ajoutée à la file d\'attente' });
  }

  async loadGameProgress() {
    // Si nous avons des données en cache récentes, les utiliser
    const now = Date.now();
    if (progressCache && (now - lastProgressLoad < CACHE_DURATION)) {
      return Promise.resolve({...progressCache}); // Renvoyer une copie pour éviter les mutations
    }
    
    // Si un chargement est déjà en cours, mettre en file d'attente
    if (isLoading) {
      return new Promise((resolve, reject) => {
        pendingLoadRequests.push({ resolve, reject });
      });
    }
    
    // Vérifier si nous sommes en cooldown global
    if (isInGlobalCooldown()) {
      if (progressCache) {
        return Promise.resolve({...progressCache});
      }
      // Si pas de cache, attendre la fin du cooldown
      await new Promise(resolve => setTimeout(resolve, globalCooldownUntil - Date.now()));
    }
    
    // Verrouiller pour éviter les appels simultanés
    isLoading = true;
    
    try {
      const response = await progressInstance.get('load');
      
      // Mettre à jour le cache
      progressCache = response.data;
      lastProgressLoad = now;
      
      // Mettre à jour notre cache de pièces
      if (response.data && response.data.coins !== undefined) {
        lastKnownCoins = response.data.coins;
      }
      
      // Résoudre toutes les promesses en attente
      pendingLoadRequests.forEach(request => request.resolve({...progressCache}));
      pendingLoadRequests = [];
      
      return {...response.data}; // Renvoyer une copie
    } catch (error) {
      console.error('Erreur dans loadGameProgress:', error);
      
      // Si on reçoit une erreur 429, activer le cooldown global
      if (error.response && error.response.status === 429) {
        activateGlobalCooldown();
      }
      
      // Rejeter toutes les promesses en attente
      pendingLoadRequests.forEach(request => request.reject(error));
      pendingLoadRequests = [];
      
      throw error;
    } finally {
      // Déverrouiller
      isLoading = false;
    }
  }

  async loadProgress() {
    return this.loadGameProgress();
  }
  
  // Méthode pour invalider explicitement le cache
  invalidateProgressCache() {
    progressCache = null;
    lastProgressLoad = 0;
  }

  // Méthode mise à jour pour utiliser le service d'achievements
  async saveAchievement(achievementData) {
    try {
      // Utiliser le nouveau service d'achievements pour débloquer un achievement
      return await achievementsService.unlockAchievement(achievementData.name);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde d\'un achievement:', error);
      
      // En cas d'erreur, fallback sur l'ancienne méthode
      return this.saveGameProgress({
        achievements: {
          [achievementData.name]: {
            unlocked: true,
            unlockedAt: achievementData.unlockedAt || new Date().toISOString()
          }
        }
      });
    }
  }

  // Méthode corrigée pour mettre à jour les achievements
  async updateAchievements(achievementsData) {
    try {
      // Utiliser le nouveau service d'achievements
      return await achievementsService.updateAchievements(achievementsData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des achievements:', error);
      
      // En cas d'erreur, fallback sur l'ancienne méthode
      return this.saveGameProgress({
        achievements: achievementsData
      });
    }
  }

  async updateCoins(coins) {
    try {
      // S'assurer que coins est un nombre
      const coinsToSave = parseInt(coins);
      
      if (isNaN(coinsToSave)) {
        throw new Error('Le montant des pièces doit être un nombre valide');
      }
      
      // Mettre à jour notre cache de pièces
      lastKnownCoins = coinsToSave;
      
      // En mode conservation ou pendant un cooldown, éviter les appels directs
      if (conservativeMode || isInGlobalCooldown()) {
        return this.saveGameProgress({ coins: coinsToSave });
      }
      
      // Sauvegarde spécifique des pièces (prioritaire)
      try {
        // Modifier cette ligne pour utiliser le bon endpoint
        const response = await progressInstance.post('coins/update', { coins: coinsToSave });
        
        // Invalider le cache
        progressCache = null;
        lastProgressLoad = 0;
        
        return response.data;
      } catch (error) {
        // En cas d'erreur 429, activer le cooldown global
        if (error.response && error.response.status === 429) {
          activateGlobalCooldown();
        }
        
        // En cas d'erreur, on essaie via la file d'attente
        return this.saveGameProgress({ coins: coinsToSave });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des pièces:', error);
      return this.saveGameProgress({ coins: coins });
    }
  }

  async updateDiscoveredElements(discoveredElements, gameMode = 'infinite') {
    // S'assurer que discoveredElements est un tableau
    if (!Array.isArray(discoveredElements)) {
      console.error('Elements découverts invalides:', discoveredElements);
      return null;
    }
    
    // En mode conservation ou pendant un cooldown, utiliser la file d'attente
    if (conservativeMode || isInGlobalCooldown()) {
      return this.saveGameProgress({ 
        discoveredElements,
        gameMode // Ajouter le mode pour que saveGameProgress puisse le traiter
      });
    }
    
    try {
      // Essayer d'utiliser l'API spécifique qui met à jour tous les modes
      const response = await progressInstance.post('update-discovered-elements', { 
        discoveredElements,
        gameMode 
      });
      
      // Invalider le cache
      progressCache = null;
      lastProgressLoad = 0;
      
      // Vérifier les achievements après la mise à jour des éléments découverts
      achievementsService.checkAchievements(discoveredElements).catch(error => {
        console.error('Erreur lors de la vérification des achievements après mise à jour des éléments:', error);
      });
      
      return response.data;
    } catch (error) {
      // En cas d'erreur 429, activer le cooldown global
      if (error.response && error.response.status === 429) {
        activateGlobalCooldown();
      }
      
      // En cas d'erreur, fallback sur la méthode générale
      return this.saveGameProgress({ 
        discoveredElements,
        gameMode 
      });
    }
  }

  async updateTimerProgress(timerProgress) {
    // S'assurer que la structure est correcte
    const safeTimerProgress = {
      completedQuestions: timerProgress?.completedQuestions || {},
      unlockedCategories: timerProgress?.unlockedCategories || {},
      bestScores: {
        Facile: timerProgress?.bestScores?.Facile || 0,
        Moyen: timerProgress?.bestScores?.Moyen || 0,
        Difficile: timerProgress?.bestScores?.Difficile || 0
      }
    };
    
    // Utiliser la file d'attente de sauvegarde avec priorité élevée
    return this.saveGameProgress({ 
      timerProgress: safeTimerProgress,
      priority: 'high'  // Ajouter cet indicateur si votre file d'attente gère les priorités
    });
  }
  
  // Méthode pour récupérer le dernier nombre de pièces connu (cache local)
  getLastKnownCoins() {
    return lastKnownCoins;
  }
  
  // Méthode pour forcer le traitement de la file d'attente
  forceSaveQueueProcessing() {
    // Ne pas forcer le traitement pendant un cooldown global
    if (isInGlobalCooldown()) {
      return;
    }
    
    // Réinitialiser l'état
    isSaving = false;
    consecutiveErrors = 0;
    conservativeMode = false;
    
    // Forcer le traitement
    this.processSaveQueue();
  }
  
  // Méthode pour connaître l'état de la file d'attente
  getQueueStatus() {
    return {
      queueLength: saveQueue.length,
      isSaving,
      conservativeMode,
      errorCount: consecutiveErrors,
      cacheStatus: {
        hasCachedData: !!progressCache,
        cacheAge: progressCache ? (Date.now() - lastProgressLoad) / 1000 : null,
        isLoading
      },
      lastSaveTime: lastSaveTime ? new Date(lastSaveTime).toISOString() : null,
      timeSinceLastSave: lastSaveTime ? Math.round((Date.now() - lastSaveTime) / 1000) : null,
      cooldownStatus: {
        isActive: isInGlobalCooldown(),
        remainingTime: isInGlobalCooldown() ? Math.round((globalCooldownUntil - Date.now()) / 1000) : 0,
        expiresAt: isInGlobalCooldown() ? new Date(globalCooldownUntil).toISOString() : null
      }
    };
  }
  
  // Méthode pour réinitialiser le cooldown global (à utiliser avec précaution)
  resetGlobalCooldown() {
    globalCooldownUntil = 0;
  }
}

export default new ProgressService();