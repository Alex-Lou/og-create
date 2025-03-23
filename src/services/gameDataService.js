import api from './api';
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
    
    // Liste des fichiers à charger lors de l'initialisation
    this.requiredFiles = [
      'animaux', 
      'biologie', 
      'créations_humaines', 
      'elements_data', 
      'formations_naturelles', 
      'geologie', 
      'materiaux_elementaires', 
      'phénomènes_naturels', 
      'magie', 
      'achievements', 
      'elements',
      'timer_questions'
    ];
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} - True si l'utilisateur est authentifié
   */
  isAuthenticated() {
    if (window.isLoggedOut) {
      return false;
    }
    
    return AuthService && typeof AuthService.isAuthenticated === 'function' 
      ? AuthService.isAuthenticated() 
      : false;
  }

  /**
   * Charge tous les fichiers de données du jeu en parallèle
   * @returns {Promise<Object>} - Données complètes du jeu
   */
  async loadAllGameData() {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

    // Vérifier si tous les fichiers sont déjà en cache
    if (this.requiredFiles.every(file => this.cache[file])) {
      return this.cache;
    }

    try {
      // Charger tous les fichiers en parallèle avec gestion des erreurs
      const loadPromises = this.requiredFiles.map(filename => 
        this.loadFile(filename).catch(error => {
          console.warn(`Chargement partiel de ${filename} échoué`, error);
          return null; // Ne pas bloquer tout le chargement
        })
      );

      const results = await Promise.allSettled(loadPromises);

      // Construire un objet de résultats
      const gameData = {};
      results.forEach((result, index) => {
        const filename = this.requiredFiles[index];
        if (result.status === 'fulfilled' && result.value) {
          gameData[filename] = result.value;
        }
      });

      // Mettre à jour le cache complet
      this.cache = { ...this.cache, ...gameData };

      return gameData;
    } catch (error) {
      console.error('Erreur lors du chargement groupé des données:', error);
      throw error;
    }
  }

  /**
   * Charge un fichier JSON spécifique
   * @param {string} filename - Nom du fichier à charger
   * @returns {Promise<Object>} - Données du fichier
   */
  async loadFile(filename) {
    // Vérifier l'authentification
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

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
   * Vérifie une combinaison d'éléments
   * @param {Array<string>} elements - Tableau des éléments à combiner
   * @returns {Promise<Object>} - Résultat de la combinaison
   */
  async checkCombination(elements) {
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
   * Vide complètement le cache côté client
   */
  clearCache() {
    this.cache = {};
    this.loadingPromises = {};
  }

  /**
   * Récupère un élément spécifique du cache
   * @param {string} filename - Nom du fichier
   * @returns {Object|null} - Données du fichier ou null
   */
  getCachedFile(filename) {
    // Utiliser le mapping si nécessaire
    const mappedFilename = this.filenameMapping[filename] || filename;
    return this.cache[mappedFilename] || null;
  }
}

// Exporter une instance unique du service
export default new GameDataService();