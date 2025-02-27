// src/services/progressService.js
import { apiInstance } from './authService';
import axios from 'axios';

// Créer une instance plus spécifique qui utilise l'apiInstance partagée
// Cela nous permet de conserver le point de terminaison spécifique tout en bénéficiant des intercepteurs
const progressInstance = {
  async get(endpoint) {
    return apiInstance.get(`/progress/${endpoint}`);
  },
  async post(endpoint, data) {
    return apiInstance.post(`/progress/${endpoint}`, data);
  }
};

class ProgressService {
  // Remplacez la méthode saveGameProgress existante par celle-ci
  async saveGameProgress(progressData) {
    try {
      // Ajouter un log pour voir ce qu'on veut sauvegarder
      console.log('Données de progression à sauvegarder:', JSON.stringify(progressData, null, 2));
      
      // D'abord, récupérer les données existantes
      const existingProgress = await this.loadGameProgress().catch(err => {
        console.error('Erreur lors du chargement des données existantes:', err);
        return {
          discoveredElements: [],
          discoveredCategories: [],
          categoryProgress: {},
          achievements: {},
          coins: 0,
          timerProgress: {
            completedQuestions: {},
            unlockedCategories: {},
            bestScores: {
              Facile: 0,
              Moyen: 0,
              Difficile: 0
            }
          }
        };
      });
      
      // S'assurer que les tableaux d'éléments sont bien des tableaux
      const discoveredElements = Array.isArray(progressData.discoveredElements) 
        ? [...new Set([...existingProgress.discoveredElements, ...progressData.discoveredElements])]
        : existingProgress.discoveredElements;
      
      const discoveredCategories = Array.isArray(progressData.discoveredCategories)
        ? [...new Set([...existingProgress.discoveredCategories, ...progressData.discoveredCategories])]
        : existingProgress.discoveredCategories;
      
      // Fusionner avec les nouvelles données de manière plus robuste
      const dataToSend = {
        // Pour les tableaux, on fait une union (sans doublons)
        discoveredElements,
        discoveredCategories,
        
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
      
      console.log('Données fusionnées prêtes à sauvegarder:', JSON.stringify(dataToSend, null, 2));
      
      // Ajouter un timeout pour s'assurer que l'interface utilisateur se met à jour
      const response = await progressInstance.post('save', dataToSend);
      
      // En cas de succès, programmer une autre sauvegarde après quelques secondes
      // pour s'assurer que les données sont bien enregistrées
      setTimeout(() => {
        progressInstance.post('update-discovered-elements', { 
          discoveredElements: dataToSend.discoveredElements 
        }).catch(err => console.error('Erreur dans la sauvegarde de secours des éléments:', err));
        
        progressInstance.post('update-achievements', { 
          achievements: dataToSend.achievements 
        }).catch(err => console.error('Erreur dans la sauvegarde de secours des achievements:', err));
      }, 5000);
      
      return response.data;
    } catch (error) {
      console.error('Erreur critique dans saveGameProgress:', error);
      throw error;
    }
  }

  async loadGameProgress() {
    try {
      const response = await progressInstance.get('load');
      console.log('Données chargées:', response.data);
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
      console.log('Sauvegarde achievement:', achievementData);
      const progress = await this.loadProgress();
      const currentAchievements = progress.achievements || {};
      
      currentAchievements[achievementData.name] = {
        unlocked: true,
        unlockedAt: achievementData.unlockedAt || new Date().toISOString()
      };

      // S'assurer que timerProgress existe et a la bonne structure
      const safeTimerProgress = {
        completedQuestions: progress.timerProgress?.completedQuestions || {},
        unlockedCategories: progress.timerProgress?.unlockedCategories || {},
        bestScores: {
          Facile: progress.timerProgress?.bestScores?.Facile || 0,
          Moyen: progress.timerProgress?.bestScores?.Moyen || 0,
          Difficile: progress.timerProgress?.bestScores?.Difficile || 0
        }
      };

      const response = await progressInstance.post('save', {
        discoveredElements: progress.discoveredElements,
        discoveredCategories: progress.discoveredCategories,
        achievements: currentAchievements,
        categoryProgress: progress.categoryProgress,
        coins: progress.coins,
        timerProgress: safeTimerProgress
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du succès:', error);
      throw error;
    }
  }

  async updateCoins(coins) {
    try {
      console.log('Mise à jour des pièces:', coins);
      // S'assurer que coins est un nombre
      const coinsToSave = parseInt(coins);
      
      if (isNaN(coinsToSave)) {
        throw new Error('Le montant des pièces doit être un nombre valide');
      }

      // Uniquement mettre à jour les pièces, pas la progression complète
      const response = await progressInstance.post('update-coins', { coins: coinsToSave });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des pièces:', error);
      throw error;
    }
  }

  async updateDiscoveredElements(discoveredElements) {
    try {
      // S'assurer que discoveredElements est un tableau
      if (!Array.isArray(discoveredElements)) {
        console.error('Elements découverts invalides:', discoveredElements);
        return null;
      }
      
      // S'assurer que nous envoyons une copie des données (éviter les mutations)
      const elementsCopy = [...discoveredElements];
      
      console.log('Mise à jour des éléments découverts:', elementsCopy.length);
      
      const response = await progressInstance.post('update-discovered-elements', { 
        discoveredElements: elementsCopy 
      });
      
      console.log('Réponse mise à jour éléments:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des éléments découverts:', error);
      throw error;
    }
  }

  async updateAchievements(achievementsData) {
    if (!this.isLoggedIn) return;
    
    try {
      console.time('Mise à jour des achievements');
      const response = await axios.post('/api/progress/update-achievements', { 
        achievements: achievementsData 
      });
      console.timeEnd('Mise à jour des achievements');
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour des achievements:", error);
      throw error;
    }
  }

  async updateTimerProgress(timerProgress) {
    try {
      console.log('Mise à jour timerProgress - Données reçues:', timerProgress);

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

      console.log('Données formatées à envoyer:', safeTimerProgress);

      const response = await progressInstance.post('update-timer-progress', { 
        timerProgress: safeTimerProgress 
      });
      console.log('Réponse de mise à jour:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée lors de la mise à jour de la progression du timer:', error.response || error);
      throw error;
    }
  }
}

export default new ProgressService();