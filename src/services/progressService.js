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
      const response = await axiosInstance.post('save', {
        discoveredElements: progressData.discoveredElements,
        discoveredCategories: progressData.discoveredCategories,
        categoryProgress: progressData.categoryProgress
      });
      return response.data;
    } catch (error) {
      console.error('Erreur dans saveGameProgress:', error);
      throw error;
    }
  }

  async loadGameProgress() {
    try {
      const response = await axiosInstance.get('load');
      return response.data;
    } catch (error) {
      console.error('Erreur dans loadGameProgress:', error);
      throw error;
    }
  }

  async loadProgress() {
    return this.loadGameProgress();
  }

  // Nouvelle méthode pour sauvegarder un achievement
  async saveAchievement(achievementData) {
    try {
      // Charger d'abord la progression existante
      const progress = await this.loadProgress();
      
      // Créer une copie des achievements existants
      const currentAchievements = progress.achievements || {};
      
      // Ajouter ou mettre à jour l'achievement
      currentAchievements[achievementData.name] = {
        unlocked: true,
        unlockedAt: achievementData.unlockedAt || new Date().toISOString()
      };

      // Sauvegarder la progression mise à jour
      const response = await axiosInstance.post('save', {
        discoveredElements: progress.discoveredElements,
        discoveredCategories: progress.discoveredCategories,
        achievements: currentAchievements,
        categoryProgress: progress.categoryProgress
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du succès:', error);
      throw error;
    }
  }
}

export default new ProgressService();