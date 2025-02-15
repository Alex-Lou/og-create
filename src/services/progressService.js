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
  async saveAchievement(achievement) {
    try {
      const response = await axiosInstance.post('achievement', { achievement });
      return response.data;
    } catch (error) {
      console.error('Erreur dans saveAchievement:', error);
      throw error;
    }
  }

  async loadProgress() {
    try {
      const response = await axiosInstance.get('load');
      return response.data;
    } catch (error) {
      console.error('Erreur dans loadProgress:', error);
      throw error;
    }
  }
}

export default new ProgressService();