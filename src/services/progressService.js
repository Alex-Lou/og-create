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
  async saveGameProgress(progressData) {
    try {
      console.log('saveGameProgress - Données reçues:', progressData);
      console.log('timerProgress à sauvegarder:', progressData.timerProgress);

      // S'assurer que timerProgress a la bonne structure
      const safeTimerProgress = {
        completedQuestions: progressData.timerProgress?.completedQuestions || {},
        unlockedCategories: progressData.timerProgress?.unlockedCategories || {},
        bestScores: {
          Facile: progressData.timerProgress?.bestScores?.Facile || 0,
          Moyen: progressData.timerProgress?.bestScores?.Moyen || 0,
          Difficile: progressData.timerProgress?.bestScores?.Difficile || 0
        }
      };

      const dataToSend = {
        discoveredElements: progressData.discoveredElements,
        discoveredCategories: progressData.discoveredCategories,
        categoryProgress: progressData.categoryProgress,
        achievements: progressData.achievements,
        coins: progressData.totalCoins,
        timerProgress: safeTimerProgress
      };

      console.log('Données formatées à envoyer:', dataToSend);

      const response = await axiosInstance.post('save', dataToSend);
      console.log('Réponse de sauvegarde:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée dans saveGameProgress:', error.response || error);
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
        coins: progress.totalCoins,
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
      const response = await axiosInstance.post('update-coins', { coins });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des pièces:', error);
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