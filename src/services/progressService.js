// src/services/progressService.js
import { apiInstance } from './authService';

// Créer une instance plus spécifique qui utilise l'apiInstance partagée
// Cela nous permet de conserver le point de terminaison spécifique tout en bénéficiant des intercepteurs
const progressInstance = {
  async get(endpoint) {
    return apiInstance.get(`/progress/${endpoint}`);
  },
  async post(endpoint, data, retryCount = 0) {
    try {
      return await apiInstance.post(`/progress/${endpoint}`, data);
    } catch (error) {
      // Gestion des erreurs 429 (Too Many Requests) avec retry
      if (error.response && error.response.status === 429 && retryCount < 3) {
        const waitTime = 1000 * Math.pow(2, retryCount); // Attente exponentielle: 1s, 2s, 4s
        console.warn(`Trop de requêtes (${endpoint}), nouvelle tentative dans ${waitTime/1000}s...`);
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return progressInstance.post(endpoint, data, retryCount + 1);
      }
      throw error;
    }
  }
};

// Variable de verrouillage pour éviter les sauvegardes concurrentes
let isSaving = false;
// File d'attente pour les sauvegardes
let saveQueue = [];
// Variable pour suivre le dernier état connu des pièces
let lastKnownCoins = null;

class ProgressService {
  // Méthode utilitaire pour exécuter la file d'attente de sauvegarde
  async processSaveQueue() {
    if (isSaving || saveQueue.length === 0) return;
    
    isSaving = true;
    
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
        
        return acc;
      }, {});
      
      // Vider la file d'attente
      saveQueue = [];
      
      // Sauvegarder les données fusionnées
      await this.saveGameProgressDirectly(mergedData);
      
    } catch (error) {
      console.error('Erreur lors du traitement de la file d\'attente de sauvegarde:', error);
    } finally {
      isSaving = false;
      
      // S'il y a de nouvelles données à sauvegarder, traiter la file d'attente à nouveau
      if (saveQueue.length > 0) {
        setTimeout(() => this.processSaveQueue(), 1000); // Petite pause avant de continuer
      }
    }
  }
  
  // Méthode interne pour sauvegarder directement sans file d'attente
  async saveGameProgressDirectly(progressData) {
    try {
      // D'abord, récupérer les données existantes si nécessaire
      let existingProgress;
      
      try {
        existingProgress = await this.loadGameProgress();
      } catch (err) {
        console.warn('Impossible de charger les données existantes, utilisation des valeurs par défaut');
        existingProgress = {
          discoveredElements: [],
          discoveredCategories: [],
          categoryProgress: {},
          achievements: {},
          coins: lastKnownCoins !== null ? lastKnownCoins : 0,
          timerProgress: {
            completedQuestions: {},
            unlockedCategories: {},
            bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
          }
        };
      }
      
      // Fusionner avec les nouvelles données de manière robuste
      const dataToSend = {
        // Pour les tableaux, on fait une union (sans doublons)
        discoveredElements: Array.isArray(progressData.discoveredElements) 
          ? [...new Set([...existingProgress.discoveredElements, ...progressData.discoveredElements])]
          : existingProgress.discoveredElements,
          
        discoveredCategories: Array.isArray(progressData.discoveredCategories)
          ? [...new Set([...existingProgress.discoveredCategories, ...progressData.discoveredCategories])]
          : existingProgress.discoveredCategories,
        
        // Pour les objets, on fusionne récursivement
        categoryProgress: {
          ...existingProgress.categoryProgress,
          ...(progressData.categoryProgress || {})
        },
        
        // Pour les achievements, on s'assure de ne pas perdre ceux déjà acquis
        achievements: {
          ...existingProgress.achievements,
          ...(progressData.achievements || {})
        },
        
        // Pour les valeurs numériques, on prend la nouvelle valeur si définie
        coins: progressData.coins !== undefined ? progressData.coins : existingProgress.coins,
        
        // Pour les structures complexes, fusion récursive
        timerProgress: {
          completedQuestions: {
            ...existingProgress.timerProgress?.completedQuestions,
            ...(progressData.timerProgress?.completedQuestions || {})
          },
          unlockedCategories: {
            ...existingProgress.timerProgress?.unlockedCategories,
            ...(progressData.timerProgress?.unlockedCategories || {})
          },
          bestScores: {
            Facile: Math.max(
              existingProgress.timerProgress?.bestScores?.Facile || 0,
              progressData.timerProgress?.bestScores?.Facile || 0
            ),
            Moyen: Math.max(
              existingProgress.timerProgress?.bestScores?.Moyen || 0,
              progressData.timerProgress?.bestScores?.Moyen || 0
            ),
            Difficile: Math.max(
              existingProgress.timerProgress?.bestScores?.Difficile || 0,
              progressData.timerProgress?.bestScores?.Difficile || 0
            )
          }
        }
      };
      
      // Mettre à jour notre cache de pièces
      if (dataToSend.coins !== undefined) {
        lastKnownCoins = dataToSend.coins;
      }
      
      const response = await progressInstance.post('save', dataToSend);
      return response.data;
      
    } catch (error) {
      console.error('Erreur critique dans saveGameProgressDirectly:', error);
      throw error;
    }
  }
  
  // Méthode publique pour sauvegarder avec file d'attente
  async saveGameProgress(progressData) {
    // Ajouter à la file d'attente
    saveQueue.push(progressData);
    
    // Traiter la file d'attente
    this.processSaveQueue();
    
    // Renvoyer une promesse qui se résout immédiatement
    // L'opération de sauvegarde réelle se fera en arrière-plan
    return Promise.resolve({ status: 'queued', message: 'La sauvegarde a été ajoutée à la file d\'attente' });
  }

  async loadGameProgress() {
    try {
      const response = await progressInstance.get('load');
      
      // Mettre à jour notre cache de pièces
      if (response.data && response.data.coins !== undefined) {
        lastKnownCoins = response.data.coins;
      }
      
      return response.data;
    } catch (error) {
      console.error('Erreur dans loadGameProgress:', error);
      throw error;
    }
  }

  async loadProgress() {
    return this.loadGameProgress();
  }

  async saveAchievement(achievementData) {
    try {
      // Utiliser la file d'attente de sauvegarde
      return this.saveGameProgress({
        achievements: {
          [achievementData.name]: {
            unlocked: true,
            unlockedAt: achievementData.unlockedAt || new Date().toISOString()
          }
        }
      });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du succès:', error);
      throw error;
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
      
      // Sauvegarde spécifique des pièces (prioritaire)
      const response = await progressInstance.post('update-coins', { coins: coinsToSave });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des pièces:', error);
      
      // En cas d'erreur, on essaie via la file d'attente
      return this.saveGameProgress({ coins: coins });
    }
  }

  async updateDiscoveredElements(discoveredElements) {
    try {
      // S'assurer que discoveredElements est un tableau
      if (!Array.isArray(discoveredElements)) {
        console.error('Elements découverts invalides:', discoveredElements);
        return null;
      }
      
      // Utiliser la file d'attente de sauvegarde
      return this.saveGameProgress({ discoveredElements });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des éléments découverts:', error);
      throw error;
    }
  }

  async updateAchievements(achievementsData) {
    try {
      // Utiliser la file d'attente de sauvegarde
      return this.saveGameProgress({ achievements: achievementsData });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des achievements:", error);
      throw error;
    }
  }

  async updateTimerProgress(timerProgress) {
    try {
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
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression du timer:', error);
      throw error;
    }
  }
  
  // Méthode pour récupérer le dernier nombre de pièces connu (cache local)
  getLastKnownCoins() {
    return lastKnownCoins;
  }
}

export default new ProgressService();