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
    try {
      const response = await this.loadGameProgress();
      return response;
    } catch (error) {
      console.error('Erreur lors du chargement des progrès:', error);
      throw error;
    }
  }

  async saveAchievement(achievementData) {
    try {
      const response = await axiosInstance.post('save-achievement', achievementData);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du succès:', error);
      throw error;
    }
  }
}

export default new ProgressService();