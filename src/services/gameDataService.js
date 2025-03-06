// services/gameDataService.js
import api from './api'; // Assure-toi que ce fichier existe et exporte une instance axios configurée

class GameDataService {
  constructor() {
    this.cache = {};
    this.loadingPromises = {};
  }
  
  /**
   * Charge un fichier JSON depuis le serveur
   * @param {string} filename - Nom du fichier sans extension
   * @returns {Promise<Object>} - Le contenu du fichier JSON
   */
  async loadFile(filename) {
    // Si le fichier est déjà en cache, le retourner
    if (this.cache[filename]) {
      return this.cache[filename];
    }
    
    // Si le fichier est déjà en cours de chargement, retourner la promesse existante
    if (this.loadingPromises[filename]) {
      return this.loadingPromises[filename];
    }
    
    // Sinon, charger le fichier
    console.log(`Chargement du fichier ${filename}...`);
    
    try {
      // Créer une promesse pour ce chargement et la stocker
      this.loadingPromises[filename] = api.get(`/game-data/${filename}`)
        .then(response => {
          // Une fois chargé, mettre en cache et supprimer la promesse
          this.cache[filename] = response.data;
          delete this.loadingPromises[filename];
          console.log(`Fichier ${filename} chargé avec succès`);
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
    console.log('Cache local vidé');
  }
}

// Exporter une instance unique du service
export default new GameDataService();