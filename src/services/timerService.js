// src/services/timerService.js
import { apiInstance } from './authService';

class TimerService {
  async saveTimerElements(elements) {
    try {
      const response = await apiInstance.post('/timer/save-elements', { elements });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des éléments du mode Timer:', error);
      throw error;
    }
  }
  
  async loadTimerElements() {
    try {
      const response = await apiInstance.get('/timer/load-elements');
      return response.data.timerElements || [];
    } catch (error) {
      console.error('Erreur lors du chargement des éléments du mode Timer:', error);
      return [];
    }
  }
}

export default new TimerService();