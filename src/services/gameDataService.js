import api from './http';
import AuthService from './authService';
import { BASE_ELEMENTS, BASE_CATEGORY } from '@/utils/gameConstants';
import { sortFamilies } from '@/utils/eras';

// Fichiers de contenu (éléments, catégories, recettes) chargés au démarrage
const GAME_FILES = [
  'animaux',
  'biologie',
  'créations_humaines',
  'elements_data',
  'formations_naturelles',
  'geologie',
  'materiaux_elementaires',
  'phénomènes_naturels',
  'magie'
];

const BASE_EMOJIS = { Eau: '💧', Feu: '🔥', Terre: '🌎', Air: '💨' };

// Construit emojis, catégories et recettes à partir des fichiers chargés
function buildGameContent(files) {
  const elementEmojis = { ...BASE_EMOJIS };
  const categories = { [BASE_CATEGORY]: [...BASE_ELEMENTS] };
  const craftingRecipes = {};

  files.filter(Boolean).forEach(data => {
    ['animaux', 'humains', 'elements', 'items'].forEach(source => {
      Object.entries(data[source] || {}).forEach(([category, entries]) => {
        categories[category] = categories[category] || [];
        Object.entries(entries).forEach(([rawName, value]) => {
          const name = rawName.trim();
          elementEmojis[name] = typeof value === 'object' ? (value.emoji || value.icon || '❓') : value;
          if (!categories[category].includes(name)) categories[category].push(name);
        });
      });
    });
    Object.entries(data.rules || {}).forEach(([key, result]) => {
      // Clé triée (utilisée pour la recherche) + clé d'origine
      craftingRecipes[key.split('+').sort().join('+')] = result;
      craftingRecipes[key] = result;
    });
  });

  return { elementEmojis, categories: sortFamilies(categories), craftingRecipes };
}

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
   * Charge tout le contenu du jeu (un fichier manquant n'empêche pas les autres)
   * @returns {Promise<{elementEmojis, categories, craftingRecipes}>}
   */
  async loadGameContent() {
    const files = await Promise.all(GAME_FILES.map(file =>
      this.loadFile(file).catch(error => {
        console.warn(`Impossible de charger ${file}`, error);
        return null;
      })
    ));
    return buildGameContent(files);
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
}

// Exporter une instance unique du service
export default new GameDataService();