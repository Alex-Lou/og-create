import api from './http';
import AuthService from './authService';

/**
 * Service pour l'accès aux données du jeu avec chargement optimisé
 */
class GameDataService {
  constructor() {
    this.cache = {};
    this.loadingPromises = {};
    
    // Mapping des noms de fichiers
    this.filenameMapping = {
      'timer_questions': 'timer-questions'
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
   * Charge un fichier JSON spécifique
   * @param {string} filename - Nom du fichier à charger
   * @returns {Promise<Object>} - Données du fichier
   */
  async loadFile(filename) {
    // Contenu public : pas de session requise (mode invité)
    // Mapper le nom de fichier si nécessaire
    const mappedFilename = this.filenameMapping[filename] || filename;

    // Vérifier le cache avant toute requête
    if (this.cache[mappedFilename]) {
      return this.cache[mappedFilename];
    }

    // Éviter les requêtes multiples simultanées
    if (this.loadingPromises[mappedFilename]) {
      return this.loadingPromises[mappedFilename];
    }

    // Normaliser le nom de fichier pour la requête
    const normalizedFilename = mappedFilename
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');

    // Créer une promesse de chargement
    const promise = api.get(`/game-data/${normalizedFilename}`)
      .then(response => {
        // Mise en cache immédiate
        this.cache[mappedFilename] = response.data;
        return response.data;
      })
      .catch(error => {
        console.error(`Erreur de chargement pour ${mappedFilename}:`, error);
        
        // Gérer spécifiquement les erreurs 404
        if (error.response && error.response.status === 404) {
          console.warn(`Fichier ${mappedFilename} non trouvé`);
          return null;
        }
        
        throw error;
      })
      .finally(() => {
        // Nettoyer la promesse de chargement
        delete this.loadingPromises[mappedFilename];
      });

    // Stocker la promesse en cours
    this.loadingPromises[mappedFilename] = promise;

    return promise;
  }

  /**
   * Vide complètement le cache côté client
   */
  clearCache() {
    this.cache = {};
    this.loadingPromises = {};
  }
}

// Exporter une instance unique du service
export default new GameDataService();