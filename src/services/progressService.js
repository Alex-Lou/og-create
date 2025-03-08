// src/services/progressService.js
import { apiInstance } from './authService';
import AuthService from './authService';

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
  console.warn(`Cooldown global activé jusqu'à ${new Date(globalCooldownUntil).toLocaleTimeString()}`);
}

// Créer une instance plus spécifique qui utilise l'apiInstance partagée
const progressInstance = {
  async get(endpoint) {
    // Vérifier l'authentification avant chaque requête
    ensureAuthentication();
    
    // Vérifier le cooldown global
    if (isInGlobalCooldown()) {
      console.warn(`Requête GET ${endpoint} bloquée par le cooldown global. Attente...`);
      await new Promise(resolve => setTimeout(resolve, globalCooldownUntil - Date.now()));
    }
    
    await enforceRateLimit();
    try {
      return await apiInstance.get(`/progress/${endpoint}`);
    } catch (error) {
      // Si erreur d'authentification, essayer de rafraîchir le token
      if (error.response && error.response.status === 401) {
        try {
          console.log("Tentative de rafraîchissement du token...");
          await AuthService.refreshToken();
          ensureAuthentication();
          return await apiInstance.get(`/progress/${endpoint}`);
        } catch (refreshError) {
          console.error("Échec du rafraîchissement du token:", refreshError);
          throw error; // Propager l'erreur originale
        }
      }
      
      if (error.response && error.response.status === 429) {
        console.warn(`Rate limit atteint pour GET ${endpoint}, activation du cooldown global...`);
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
      console.warn(`Requête POST ${endpoint} bloquée par le cooldown global. Attente...`);
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
          console.log("Tentative de rafraîchissement du token...");
          await AuthService.refreshToken();
          ensureAuthentication();
          return await apiInstance.post(`/progress/${endpoint}`, data);
        } catch (refreshError) {
          console.error("Échec du rafraîchissement du token:", refreshError);
          throw error; // Propager l'erreur originale
        }
      }
      
      if (error.response && error.response.status === 429) {
        activateGlobalCooldown();
        const waitTime = RATE_LIMIT.initialBackoff * Math.pow(2, retryCount);
        console.warn(`Trop de requêtes (${endpoint}), nouvelle tentative dans ${waitTime/1000}s...`);
        
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
    console.log(`Limitation de débit: attente de ${waitTime}ms avant la prochaine requête`);
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
      console.log(`Traitement de la file d'attente suspendu pendant le cooldown global`);
      setTimeout(() => this.processSaveQueue(), globalCooldownUntil - Date.now() + 5000);
      return;
    }
    
    // Vérifier si le dernier enregistrement était récent
    const now = Date.now();
    const timeSinceLastSave = now - lastSaveTime;
    
    if (timeSinceLastSave < MIN_SAVE_INTERVAL) {
      console.log(`Trop tôt pour sauvegarder (${timeSinceLastSave/1000}s), attente...`);
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
      console.log("Mode économie de requêtes actif: regroupement des sauvegardes");
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
        console.log("Retour au mode normal de sauvegarde");
        conservativeMode = false;
      }
      
      // Mettre à jour l'horodatage de la dernière sauvegarde
      lastSaveTime = Date.now();
      
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
        console.warn("Trop d'erreurs consécutives, passage en mode économie de requêtes");
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
    
    return Promise.resolve({ status: 'queued', message: 'La sauvegarde a été ajoutée à la file d\'attente' });
  }

  async loadGameProgress() {
    // Si nous avons des données en cache récentes, les utiliser
    const now = Date.now();
    if (progressCache && (now - lastProgressLoad < CACHE_DURATION)) {
      console.log('Utilisation du cache pour loadGameProgress', { 
        cacheAge: Math.round((now - lastProgressLoad) / 1000) + 's' 
      });
      return Promise.resolve({...progressCache}); // Renvoyer une copie pour éviter les mutations
    }
    
    // Si un chargement est déjà en cours, mettre en file d'attente
    if (isLoading) {
      console.log('Chargement déjà en cours, mise en file d\'attente');
      return new Promise((resolve, reject) => {
        pendingLoadRequests.push({ resolve, reject });
      });
    }
    
    // Vérifier si nous sommes en cooldown global
    if (isInGlobalCooldown()) {
      console.log('Demande de chargement pendant un cooldown global, utilisation du cache ou attente');
      if (progressCache) {
        return Promise.resolve({...progressCache});
      }
      // Si pas de cache, attendre la fin du cooldown
      await new Promise(resolve => setTimeout(resolve, globalCooldownUntil - Date.now()));
    }
    
    // Verrouiller pour éviter les appels simultanés
    isLoading = true;
    
    try {
      console.log('Chargement des données depuis le serveur');
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
    console.log('Cache de progression invalidé');
  }

  async saveAchievement(achievementData) {
    // Utiliser la file d'attente de sauvegarde
    return this.saveGameProgress({
      achievements: {
        [achievementData.name]: {
          unlocked: true,
          unlockedAt: achievementData.unlockedAt || new Date().toISOString()
        }
      }
    });
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
        const response = await progressInstance.post('update-coins', { coins: coinsToSave });
        
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

  async updateAchievements() {
    if (!this.isLoggedIn || !this.achievements) {
      console.log("Pas de mise à jour des achievements: utilisateur non connecté ou pas d'achievements");
      return;
    }
    
    try {
      const achievementsData = {};
      this.achievements.forEach(achievement => {
        if (achievement.unlocked) {
          achievementsData[achievement.name] = {
            unlocked: true,
            unlockedAt: achievement.unlockedAt || new Date().toISOString()
          };
        }
      });
      
      console.log("Sauvegarde des achievements:", Object.keys(achievementsData).length, "achievements débloqués");
      
      await this.updateAchievements(achievementsData);
      console.log("Achievements sauvegardés avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour des achievements:", error);
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
    
    // Utiliser la file d'attente de sauvegarde
    return this.saveGameProgress({ timerProgress: safeTimerProgress });
  }
  
  // Méthode pour récupérer le dernier nombre de pièces connu (cache local)
  getLastKnownCoins() {
    return lastKnownCoins;
  }
  
  // Méthode pour forcer le traitement de la file d'attente
  forceSaveQueueProcessing() {
    // Ne pas forcer le traitement pendant un cooldown global
    if (isInGlobalCooldown()) {
      console.log('Impossible de forcer le traitement pendant un cooldown global');
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
    console.log('Cooldown global réinitialisé');
  }
}

export default new ProgressService();