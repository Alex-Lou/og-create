// services/gameDataService.js
import api from './api';
import AuthService from './authService'; // Importez le service d'authentification

class GameDataService {
  constructor() {
    this.cache = {};
    this.loadingPromises = {};
  }
  
  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} - True si l'utilisateur est authentifié
   */
  isAuthenticated() {
    // Vérifier si on est en état de déconnexion
    if (window.isLoggedOut) {
      return false;
    }
    
    // Utiliser le service d'authentification
    return AuthService && typeof AuthService.isAuthenticated === 'function' 
      ? AuthService.isAuthenticated() 
      : false;
  }
  
  /**
   * Charge un fichier JSON depuis le serveur
   * @param {string} filename - Nom du fichier sans extension
   * @returns {Promise<Object>} - Le contenu du fichier JSON
   */
  async loadFile(filename) {
    // Ne pas essayer de charger si l'utilisateur n'est pas authentifié
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
    // Si le fichier est déjà en cache, le retourner
    if (this.cache[filename]) {
      return this.cache[filename];
    }
    
    // Si le fichier est déjà en cours de chargement, retourner la promesse existante
    if (this.loadingPromises[filename]) {
      return this.loadingPromises[filename];
    }
  
    
    try {
      // Créer une promesse pour ce chargement et la stocker
      this.loadingPromises[filename] = api.get(`/game-data/${filename}`)
        .then(response => {
          // Une fois chargé, mettre en cache et supprimer la promesse
          this.cache[filename] = response.data;
          delete this.loadingPromises[filename];
          return response.data;
        })
        .catch(error => {
          // En cas d'erreur, supprimer la promesse
          delete this.loadingPromises[filename];
          console.error(`Erreur lors du chargement de ${filename}:`, error);
          throw error;
        });
      
      return this.loadingPromises[filename];
    } catch (error) {
      console.error(`Erreur lors du chargement de ${filename}:`, error);
      throw error;
    }
  }
  
  /**
   * Vérifie une combinaison d'éléments
   * @param {Array<string>} elements - Tableau des éléments à combiner
   * @returns {Promise<Object>} - Résultat de la combinaison
   */
  async checkCombination(elements) {
    // Ne pas essayer si l'utilisateur n'est pas authentifié
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }
    
    try {
      const response = await api.post('/game-data/combine', { elements });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de la combinaison:', error);
      throw error;
    }
  }
  
  /**
   * Vide le cache côté client
   */
  clearCache() {
    this.cache = {};
    this.loadingPromises = {}; // Annuler également toutes les promesses en cours
  }
}

// Exporter une instance unique du service
export default new GameDataService();