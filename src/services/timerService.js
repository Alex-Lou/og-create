// src/services/timerService.js
import apiInstance from './http';
import AuthService from './authService';

class TimerService {
  constructor() {
    // Stockage local des emojis pour éviter les accès répétés à la variable globale
    this.elementEmojis = {
      "Eau": "💧",
      "Feu": "🔥",
      "Terre": "🌎",
      "Air": "💨"
    };
  }
  
  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} - True si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return AuthService.isAuthenticated();
  }
  
  /**
   * Sauvegarde les éléments du mode Timer
   * @param {Array<string>} elements - Éléments à sauvegarder
   * @returns {Promise<Object>} - Confirmation de la sauvegarde
   */
  async saveTimerElements(elements) {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
    try {
      const response = await apiInstance.post('/timer/save-elements', { elements });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des éléments du mode Timer:', error);
      throw error;
    }
  }

  /**
   * Charge la progression du Timer
   * @returns {Promise<Object>} - Progression du Timer
   */
  async loadTimerProgress() {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
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
  
  /**
   * Charge les éléments disponibles pour le mode Timer
   * @param {number} questionId - ID de la question (optionnel)
   * @returns {Promise<Array<string>>} - Liste des éléments disponibles
   */
  async loadTimerElements(questionId = null) {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
    try {
      let url = '/timer/load-elements';
      
      // Ajouter l'ID de question comme paramètre si fourni
      if (questionId) {
        url += `?questionId=${questionId}`;
      }
      
      const response = await apiInstance.get(url);
      
      // Si nous avons reçu les emojis du backend, les stocker
      if (response.data.elementEmojis) {
        console.log(`Emojis chargés depuis le backend: ${Object.keys(response.data.elementEmojis).length}`);
        
        // Mettre à jour notre collection d'emojis locale
        this.elementEmojis = { ...this.elementEmojis, ...response.data.elementEmojis };
        
        // Maintenir aussi la variable globale pour la compatibilité
        if (typeof window.timerElementEmojis === 'undefined') {
          window.timerElementEmojis = {};
        }
        Object.assign(window.timerElementEmojis, response.data.elementEmojis);
      }
      
      // Si nous avons des éléments enrichis, les utiliser
      if (response.data.enrichedTimerElements && Array.isArray(response.data.enrichedTimerElements)) {
        console.log(`Utilisation des elements enrichis: ${response.data.enrichedTimerElements.length}`);
        
        // Extraire les noms d'éléments
        const elements = response.data.enrichedTimerElements.map(item => item.name);
        
        // Mettre à jour notre collection d'emojis avec ceux fournis
        response.data.enrichedTimerElements.forEach(item => {
          if (item.name && item.emoji) {
            this.elementEmojis[item.name] = item.emoji;
            
            // Maintenir aussi la variable globale
            if (typeof window.timerElementEmojis === 'undefined') {
              window.timerElementEmojis = {};
            }
            window.timerElementEmojis[item.name] = item.emoji;
          }
        });
        
        return elements;
      }
      
      return response.data.timerElements || [];
    } catch (error) {
      console.error('Erreur lors du chargement des éléments du Timer:', error);
      return [];
    }
  }

  /**
   * Met à jour la progression du timer
   * @param {Object} timerProgress - Nouvelle progression
   * @returns {Promise<Object>} - Confirmation de la mise à jour
   */
  async updateTimerProgress(timerProgress) {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
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

  /**
   * Débloque une catégorie dans le mode Timer
   * @param {string} difficulty - Niveau de difficulté ('Facile', 'Moyen', 'Difficile')
   * @param {string} categoryName - Nom de la catégorie à débloquer
   * @returns {Promise<boolean>} - True si la catégorie a été débloquée
   */
  async unlockCategory(difficulty, categoryName) {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
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
  
  /**
   * Récupère l'emoji pour un élément donné
   * @param {string} elementName - Nom de l'élément
   * @returns {string} - Emoji correspondant ou un emoji par défaut
   */
  getElementEmoji(elementName) {
    // Chercher d'abord dans notre collection locale
    if (this.elementEmojis[elementName]) {
      return this.elementEmojis[elementName];
    }
    
    // Ensuite dans la variable globale pour compatibilité
    if (window.timerElementEmojis && window.timerElementEmojis[elementName]) {
      // Synchroniser avec notre collection locale pour les prochains appels
      this.elementEmojis[elementName] = window.timerElementEmojis[elementName];
      return window.timerElementEmojis[elementName];
    }
    
    // Emoji par défaut si non trouvé
    return "❓";
  }
}

export default new TimerService();