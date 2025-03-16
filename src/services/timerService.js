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

  async loadTimerProgress() {
    try {
      const response = await apiInstance.get('/timer/load-progress');
      
      // Construction explicite de l'objet pour s'assurer de la structure correcte
      const formattedResponse = {
        completedQuestions: response.data.completedQuestions || {},
        unlockedCategories: response.data.unlockedCategories || {},
        bestScores: response.data.bestScores || { 
          Facile: 0, 
          Moyen: 0, 
          Difficile: 0 
        }
      };
      
      return formattedResponse;
    } catch (error) {
      console.error('Erreur lors du chargement de la progression du Timer:', error);
      return {
        completedQuestions: {},
        unlockedCategories: {},
        bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
      };
    }
  }
  
  async loadTimerElements() {
    try {
      const response = await apiInstance.get('/timer/load-elements');
      return response.data.timerElements || [];
    } catch (error) {
      return [];
    }
  }

  // Nouvelle méthode pour mettre à jour la progression du timer
  async updateTimerProgress(timerProgress) {
    try {      
      // S'assurer que l'objet a la structure correcte avant l'envoi
      const safeTimerProgress = {
        completedQuestions: timerProgress.completedQuestions || {},
        unlockedCategories: timerProgress.unlockedCategories || {},
        bestScores: timerProgress.bestScores || { 
          Facile: 0, 
          Moyen: 0, 
          Difficile: 0 
        }
      };
      
      const response = await apiInstance.post('/timer/update-timer-progress', {
        timerProgress: safeTimerProgress
      });
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la progression du timer:', error);
      throw error;
    }
  }

  // Méthode spécifique pour débloquer une catégorie
  async unlockCategory(difficulty, categoryName) {
    try {
      // D'abord charger la progression actuelle
      const currentProgress = await this.loadTimerProgress();
      
      // S'assurer que les structures nécessaires existent
      if (!currentProgress.unlockedCategories) {
        currentProgress.unlockedCategories = {};
      }
      
      if (!currentProgress.unlockedCategories[difficulty]) {
        currentProgress.unlockedCategories[difficulty] = [];
      }
      
      // Vérifier si la catégorie est déjà débloquée
      if (!currentProgress.unlockedCategories[difficulty].includes(categoryName)) {
        // Ajouter la catégorie à la liste des catégories débloquées
        currentProgress.unlockedCategories[difficulty].push(categoryName);
        
        // Enregistrer la mise à jour
        await this.updateTimerProgress(currentProgress);
        
        return true;
      }
      
      return false; // La catégorie était déjà débloquée
    } catch (error) {
      console.error('Erreur lors du déblocage de la catégorie:', error);
      throw error;
    }
  }
}

export default new TimerService();