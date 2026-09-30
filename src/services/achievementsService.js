// src/services/achievementsService.js
import apiInstance from './http';
import AuthService from './authService';

// Cache pour les achievements
let achievementsCache = {
  all: null,        // Tous les achievements (structure et description)
  user: null,       // Achievements de l'utilisateur (avec statut de déblocage)
  timestamp: 0,     // Horodatage du dernier chargement
  loading: false    // Indicateur de chargement en cours
};

// Durée de validité du cache (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

// Délai minimum entre les vérifications d'achievements
const MIN_CHECK_INTERVAL = 10 * 1000; // 10 secondes
let lastCheckTime = 0;

// File d'attente pour les requêtes pendant le chargement
let pendingRequests = {
  all: [],
  user: []
};

/**
 * Service pour gérer les achievements du jeu
 */
class AchievementsService {
  /**
   * Vérifie si l'utilisateur est authentifié (le token est ajouté par le client HTTP)
   * @returns {boolean} - True si l'utilisateur est authentifié
   */
  ensureAuthentication() {
    // Vérifier si l'utilisateur est connecté et a un token valide
    return AuthService.isAuthenticated();
  }

  /**
   * Récupère tous les achievements (structure et description)
   * @param {boolean} forceRefresh - Forcer le rafraîchissement du cache
   * @returns {Promise<Array>} - Liste des achievements
   */
  async getAllAchievements(forceRefresh = false) {
    // Vérifier si l'utilisateur est authentifié
    if (!this.ensureAuthentication()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

    // Vérifier le cache si le rafraîchissement n'est pas forcé
    const now = Date.now();
    if (!forceRefresh && achievementsCache.all && (now - achievementsCache.timestamp < CACHE_DURATION)) {
      return Promise.resolve([...achievementsCache.all]); // Renvoyer une copie
    }

    // Si un chargement est déjà en cours, mettre en file d'attente
    if (achievementsCache.loading) {
      return new Promise((resolve, reject) => {
        pendingRequests.all.push({ resolve, reject });
      });
    }

    // Marquer comme en cours de chargement
    achievementsCache.loading = true;

    try {
      // Appeler l'API pour récupérer tous les achievements
      const response = await apiInstance.get('/achievements');
      
      // Mettre à jour le cache
      achievementsCache.all = response.data;
      achievementsCache.timestamp = now;
      achievementsCache.loading = false;
      
      // Résoudre toutes les promesses en attente
      pendingRequests.all.forEach(request => request.resolve([...achievementsCache.all]));
      pendingRequests.all = [];
      
      return [...response.data]; // Renvoyer une copie
    } catch (error) {
      console.error('Erreur lors de la récupération des achievements:', error);
      
      // Marquer comme non chargé
      achievementsCache.loading = false;
      
      // Rejeter toutes les promesses en attente
      pendingRequests.all.forEach(request => request.reject(error));
      pendingRequests.all = [];
      
      throw error;
    }
  }

  /**
   * Récupère les achievements de l'utilisateur (avec statut de déblocage)
   * @param {boolean} forceRefresh - Forcer le rafraîchissement du cache
   * @returns {Promise<Object>} - Achievements de l'utilisateur avec statut
   */
  async getUserAchievements(forceRefresh = false) {
    // Vérifier si l'utilisateur est authentifié
    if (!this.ensureAuthentication()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

    // Vérifier le cache si le rafraîchissement n'est pas forcé
    const now = Date.now();
    if (!forceRefresh && achievementsCache.user && (now - achievementsCache.timestamp < CACHE_DURATION)) {
      return Promise.resolve({...achievementsCache.user}); // Renvoyer une copie
    }

    // Si un chargement est déjà en cours, mettre en file d'attente
    if (achievementsCache.loading) {
      return new Promise((resolve, reject) => {
        pendingRequests.user.push({ resolve, reject });
      });
    }

    // Marquer comme en cours de chargement
    achievementsCache.loading = true;

    try {
      // Appeler l'API pour récupérer les achievements de l'utilisateur
      const response = await apiInstance.get('/achievements/user');
      
      // Mettre à jour le cache
      achievementsCache.user = response.data;
      achievementsCache.timestamp = now;
      achievementsCache.loading = false;
      
      // Résoudre toutes les promesses en attente
      pendingRequests.user.forEach(request => request.resolve({...achievementsCache.user}));
      pendingRequests.user = [];
      
      return {...response.data}; // Renvoyer une copie
    } catch (error) {
      console.error('Erreur lors de la récupération des achievements utilisateur:', error);
      
      // Marquer comme non chargé
      achievementsCache.loading = false;
      
      // Rejeter toutes les promesses en attente
      pendingRequests.user.forEach(request => request.reject(error));
      pendingRequests.user = [];
      
      throw error;
    }
  }

  /**
   * Vérifie si de nouveaux achievements peuvent être débloqués
   * @param {Array} discoveredElements - Éléments découverts par l'utilisateur
   * @returns {Promise<Object>} - Résultat avec les nouveaux achievements débloqués
   */
  async checkAchievements(discoveredElements) {
    // Vérifier si l'utilisateur est authentifié
    if (!this.ensureAuthentication()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

    // Limiter la fréquence des vérifications
    const now = Date.now();
    if (now - lastCheckTime < MIN_CHECK_INTERVAL) {
      // Si une vérification a été faite récemment, ne pas refaire de requête API
      // mais utiliser la logique côté client pour une estimation
      return this.checkAchievementsLocally(discoveredElements);
    }

    // Mettre à jour le timestamp de dernière vérification
    lastCheckTime = now;

    try {
      // Appeler l'API pour vérifier les achievements
      const response = await apiInstance.post('/achievements/check', {
        discoveredElements
      });
      
      // Invalider le cache utilisateur car des achievements ont pu être débloqués
      achievementsCache.user = null;
      
      return {
        achievements: response.data.achievements,
        newlyUnlocked: response.data.newlyUnlocked || []
      };
    } catch (error) {
      console.error('Erreur lors de la vérification des achievements:', error);
      
      // En cas d'erreur, essayer quand même de vérifier localement
      return this.checkAchievementsLocally(discoveredElements);
    }
  }

  /**
   * Vérifie les achievements localement (côté client) si l'API n'est pas disponible
   * @param {Array} discoveredElements - Éléments découverts par l'utilisateur
   * @returns {Promise<Object>} - Résultat de la vérification locale
   */
  async checkAchievementsLocally(discoveredElements) {
    try {
      // Récupérer tous les achievements et les achievements utilisateur
      const [allAchievements, userAchievements] = await Promise.all([
        this.getAllAchievements(),
        this.getUserAchievements()
      ]);
      
      // Créer un tableau avec le statut de déblocage actuel
      const achievementsWithStatus = allAchievements.map(achievement => {
        const userAchievement = userAchievements[achievement.name];
        return {
          ...achievement,
          unlocked: userAchievement ? userAchievement.unlocked : false,
          unlockedAt: userAchievement ? userAchievement.unlockedAt : null
        };
      });
      
      // Utiliser l'utilitaire existant pour vérifier les achievements
      const { checkAchievements } = await import('../utils/achievementChecker');
      const result = checkAchievements(achievementsWithStatus, discoveredElements);
      
      // Mettre à jour les achievements nouvellement débloqués
      if (result.newlyUnlocked && result.newlyUnlocked.length > 0) {
        // Créer un objet de mise à jour
        const achievementsToUpdate = {};
        result.newlyUnlocked.forEach(achievement => {
          achievementsToUpdate[achievement.name] = {
            unlocked: true,
            unlockedAt: achievement.unlockedAt
          };
        });
        
        // Mettre à jour côté serveur (mais ne pas attendre la réponse)
        this.updateAchievements(achievementsToUpdate).catch(error => {
          console.error('Erreur lors de la mise à jour des achievements:', error);
        });
      }
      
      return result;
    } catch (error) {
      console.error('Erreur lors de la vérification locale des achievements:', error);
      return { achievements: [], newlyUnlocked: [] };
    }
  }

  /**
   * Met à jour les achievements de l'utilisateur
   * @param {Object} achievements - Objet avec les achievements à mettre à jour
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */
  async updateAchievements(achievements) {
    // Vérifier si l'utilisateur est authentifié
    if (!this.ensureAuthentication()) {
      return Promise.reject(new Error('Utilisateur non authentifié'));
    }

    try {
      // Appeler l'API pour mettre à jour les achievements
      const response = await apiInstance.post('/achievements/update', {
        achievements
      });
      
      // Invalider le cache utilisateur
      achievementsCache.user = null;
      
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour des achievements:', error);
      throw error;
    }
  }

  /**
   * Débloque un achievement spécifique
   * @param {string} achievementName - Nom de l'achievement à débloquer
   * @returns {Promise<Object>} - Résultat de la mise à jour
   */
  async unlockAchievement(achievementName) {
    const achievements = {
      [achievementName]: {
        unlocked: true,
        unlockedAt: new Date().toISOString()
      }
    };
    
    return this.updateAchievements(achievements);
  }

  /**
   * Vérifie si un nouvel élément débloque un achievement
   * @param {string} newElement - Nouvel élément découvert
   * @param {Array} discoveredElements - Liste des éléments déjà découverts
   * @returns {Promise<Object|null>} - Achievement débloqué ou null
   */
  async checkNewElementAchievement(newElement, discoveredElements) {
    try {
      // D'abord, vérifier si c'est un achievement spécifique à cet élément
      const [allAchievements, userAchievements] = await Promise.all([
        this.getAllAchievements(),
        this.getUserAchievements()
      ]);
      
      // Créer un tableau avec le statut de déblocage actuel
      const achievementsWithStatus = allAchievements.map(achievement => {
        const userAchievement = userAchievements[achievement.name];
        return {
          ...achievement,
          unlocked: userAchievement ? userAchievement.unlocked : false,
          unlockedAt: userAchievement ? userAchievement.unlockedAt : null
        };
      });
      
      // Utiliser l'utilitaire existant pour vérifier les achievements
      const { checkNewElementAchievement } = await import('../utils/achievementChecker');
      const unlockedAchievement = checkNewElementAchievement(
        achievementsWithStatus, 
        discoveredElements,
        newElement
      );
      
      // Si un achievement a été débloqué, le mettre à jour côté serveur
      if (unlockedAchievement) {
        await this.unlockAchievement(unlockedAchievement.name);
      }
      
      return unlockedAchievement;
    } catch (error) {
      console.error('Erreur lors de la vérification d\'un nouvel élément:', error);
      return null;
    }
  }

  /**
   * Invalide le cache des achievements
   */
  invalidateCache() {
    achievementsCache.all = null;
    achievementsCache.user = null;
    achievementsCache.timestamp = 0;
  }

  /**
   * Convertit les achievements du format objet au format tableau
   * @param {Object} achievementsObject - Achievements au format objet
   * @returns {Array} - Achievements au format tableau
   */
  convertToArray(achievementsObject) {
    if (!achievementsObject) return [];
    
    return Object.keys(achievementsObject).map(key => ({
      name: key,
      ...achievementsObject[key]
    }));
  }

  /**
   * Convertit les achievements du format tableau au format objet
   * @param {Array} achievementsArray - Achievements au format tableau
   * @returns {Object} - Achievements au format objet
   */
  convertToObject(achievementsArray) {
    if (!Array.isArray(achievementsArray)) return {};
    
    return achievementsArray.reduce((acc, achievement) => {
      acc[achievement.name] = {
        unlocked: achievement.unlocked || false,
        unlockedAt: achievement.unlockedAt || null
      };
      return acc;
    }, {});
  }
}

// Exporter une instance unique du service
export default new AchievementsService();