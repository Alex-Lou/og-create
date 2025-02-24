// src/services/progressService.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/progress/',
  headers: { 'Content-Type': 'application/json' },
});

// Ajouter l'intercepteur pour le token
axiosInstance.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

class ProgressService {
  // Remplacez la méthode saveGameProgress existante par celle-ci
async saveGameProgress(progressData) {
  try {
    // D'abord, récupérer les données existantes
    const existingProgress = await this.loadGameProgress();
    
    // Fusionner avec les nouvelles données, en préservant les existantes si non spécifiées
    const dataToSend = {
      discoveredElements: progressData.discoveredElements || existingProgress.discoveredElements,
      discoveredCategories: progressData.discoveredCategories || existingProgress.discoveredCategories,
      categoryProgress: progressData.categoryProgress || existingProgress.categoryProgress,
      achievements: progressData.achievements || existingProgress.achievements,
      coins: progressData.coins !== undefined ? progressData.coins : existingProgress.coins,
      timerProgress: progressData.timerProgress || existingProgress.timerProgress
    };
    
    console.log('Données fusionnées à envoyer:', dataToSend);
    
    const response = await axiosInstance.post('save', dataToSend);
    return response.data;
  } catch (error) {
    console.error('Erreur dans saveGameProgress:', error);
    throw error;
  }
}

  async loadGameProgress() {
    try {
      const response = await axiosInstance.get('load');
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

      const response = await axiosInstance.post('save', {
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
        const response = await axiosInstance.post('update-coins', { coins: coinsToSave });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de la mise à jour des pièces:', error);
        throw error;
    }
}

async updateDiscoveredElements(discoveredElements) {
  try {
    const response = await axiosInstance.post('update-discovered-elements', { 
      discoveredElements: discoveredElements 
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des éléments découverts:', error);
    throw error;
  }
}

async updateAchievements(achievements) {
  try {
    const response = await axiosInstance.post('update-achievements', { 
      achievements: achievements 
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des achievements:', error);
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

      const response = await axiosInstance.post('update-timer-progress', { 
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