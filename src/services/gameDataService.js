import api from './http';
import AuthService from './authService';
import achievementsService from './achievementsService';

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
    // Note: achievements retiré de la liste car géré par achievementsService
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
      'elements',
      'timer_questions'
    ];
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns {boolean} - True si l'utilisateur est authentifié
   */
  isAuthenticated() {
    return AuthService.isAuthenticated();
  }

  /**
   * Charge tous les fichiers de données du jeu en parallèle
   * @returns {Promise<Object>} - Données complètes du jeu
   */
  async loadAllGameData() {
    if (!this.isAuthenticated()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

    try {
      // Chargement en parallèle : fichiers standard et achievements
      const [standardData, achievements] = await Promise.all([
        this.loadStandardFiles(),
        this.loadAchievements()
      ]);

      // Combiner les données
      const allData = {
        ...standardData,
        achievements
      };

      return allData;
    } catch (error) {
      console.error('Erreur lors du chargement groupé des données:', error);
      throw error;
    }
  }

  /**
   * Charge tous les fichiers standard (sauf achievements)
   * @returns {Promise<Object>} - Données des fichiers standards
   */
  async loadStandardFiles() {
    // Vérifier si tous les fichiers sont déjà en cache
    if (this.requiredFiles.every(file => this.cache[file])) {
      // Créer un objet combiné avec tous les fichiers en cache
      const cachedData = {};
      this.requiredFiles.forEach(file => {
        cachedData[file] = this.cache[file];
      });
      return cachedData;
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
          // Mettre à jour le cache individuel
          this.cache[filename] = result.value;
        }
      });

      return gameData;
    } catch (error) {
      console.error('Erreur lors du chargement des fichiers standards:', error);
      throw error;
    }
  }

  /**
   * Charge les achievements via le service dédié
   * @returns {Promise<Array>} - Liste des achievements
   */
  async loadAchievements() {
    try {
      // Utiliser le service dédié pour récupérer les achievements
      const achievements = await achievementsService.getAllAchievements();
      
      // Mettre en cache
      this.cache['achievements'] = achievements;
      
      return achievements;
    } catch (error) {
      console.error('Erreur lors du chargement des achievements:', error);
      
      // En cas d'erreur, essayer de récupérer depuis le cache
      if (this.cache['achievements']) {
        return this.cache['achievements'];
      }
      
      // Si pas de cache, essayer de charger via l'ancienne méthode
      try {
        const data = await this.loadFile('achievements');
        return data || [];
      } catch (fallbackError) {
        console.error('Échec complet du chargement des achievements:', fallbackError);
        return []; // Renvoyer un tableau vide en dernier recours
      }
    }
  }

  /**
   * Charge un fichier JSON spécifique
   * @param {string} filename - Nom du fichier à charger
   * @returns {Promise<Object>} - Données du fichier
   */
  async loadFile(filename) {
    // Cas spécial pour les achievements
    if (filename === 'achievements') {
      return this.loadAchievements();
    }

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
    
    // Invalider également le cache des achievements
    achievementsService.invalidateCache();
  }

  /**
   * Récupère un élément spécifique du cache
   * @param {string} filename - Nom du fichier
   * @returns {Object|null} - Données du fichier ou null
   */
  getCachedFile(filename) {
    // Utiliser le mapping si nécessaire
    const mappedFilename = this.filenameMapping[filename] || filename;
    
    // Cas spécial pour les achievements
    if (mappedFilename === 'achievements') {
      // Essayer de récupérer depuis le cache du service d'achievements
      // Note: Ceci est une solution approximative car le service d'achievements 
      // n'expose pas directement son cache de cette façon
      return this.cache['achievements'] || null;
    }
    
    return this.cache[mappedFilename] || null;
  }
}

// Exporter une instance unique du service
export default new GameDataService();