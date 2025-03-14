// services/api.js
import axios from 'axios';
import authService from './authService';

// Cache pour stocker les requêtes récentes
const requestCache = new Map();

// Temps de validité du cache (en millisecondes)
const CACHE_DURATION = 30000; // 30 secondes

// Suivre les requêtes en cours
const activeRequests = new Map();

class ApiService {
  constructor() {
    // Créer une instance Axios avec configuration de base
    this.instance = axios.create({
      baseURL: 'http://localhost:3000/api', 
      headers: {
        'Content-Type': 'application/json'
      },
      // Délai de timeout plus généreux
      timeout: 10000
    });

    // Intercepteur de requête amélioré
    this.instance.interceptors.request.use(
      config => {
        // Générer une clé unique pour la requête
        const requestKey = this.generateRequestKey(config);

        // Vérifier si une requête identique est déjà en cours
        if (activeRequests.has(requestKey)) {
          // Annuler la requête en double
          const source = axios.CancelToken.source();
          config.cancelToken = source.token;
          source.cancel('Requête en double annulée');
          return config;
        }

        // Vérifier le cache
        const cachedResponse = requestCache.get(requestKey);
        if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_DURATION) {
          // Utiliser la réponse en cache
          return {
            ...config,
            adapter: () => Promise.resolve(cachedResponse.data)
          };
        }

        // Ajouter le token d'authentification à chaque requête
        const user = authService.getCurrentUser();
        if (user && user.token) {
          console.log(`Ajout du token à la requête ${config.url}`, user.token.substring(0, 10) + '...');
          config.headers.Authorization = `Bearer ${user.token}`;
        } else {
          console.log(`Pas de token disponible pour la requête ${config.url}`);
        }

        // Marquer la requête comme active
        activeRequests.set(requestKey, true);

        return config;
      },
      error => Promise.reject(error)
    );

    // Intercepteur de réponse pour gérer le cache et les requêtes actives
    this.instance.interceptors.response.use(
      response => {
        const requestKey = this.generateRequestKey(response.config);
        
        // Mettre en cache la réponse
        requestCache.set(requestKey, {
          data: response,
          timestamp: Date.now()
        });

        // Supprimer de la liste des requêtes actives
        activeRequests.delete(requestKey);

        return response;
      },
      error => {
        if (error.config) {
          const requestKey = this.generateRequestKey(error.config);
          activeRequests.delete(requestKey);
        }

        // Gérer spécifiquement les erreurs 401
        if (error.response && error.response.status === 401) {
          console.log('Erreur 401 interceptée:', error.response.data);
          // Tentative de rafraîchissement du token
          return this.handleUnauthorized(error);
        }

        return Promise.reject(error);
      }
    );
  }

  // Méthode pour générer une clé unique pour chaque requête
  generateRequestKey(config) {
    return JSON.stringify({
      url: config.url,
      method: config.method,
      // Exclure les données sensibles comme les tokens
      params: config.params,
      // Inclure uniquement les données non-sensibles
      data: typeof config.data === 'string' ? config.data : JSON.stringify(config.data || {})
    });
  }

  // Méthode pour gérer les erreurs 401
  async handleUnauthorized(error) {
    try {
      // Tentative de rafraîchissement du token
      await authService.refreshToken();
      
      // Réessayer la requête originale
      const originalRequest = error.config;
      
      // S'assurer que le nouveau token est utilisé
      const user = authService.getCurrentUser();
      if (user && user.token) {
        originalRequest.headers.Authorization = `Bearer ${user.token}`;
      }
      
      return this.instance(originalRequest);
    } catch (refreshError) {
      // Échec du rafraîchissement, déconnecter l'utilisateur
      authService.logout();
      return Promise.reject(refreshError);
    }
  }

  // Méthodes de requête avec gestion de cache et de requêtes
  async get(url, config = {}) {
    return this.instance.get(url, config);
  }

  async post(url, data, config = {}) {
    return this.instance.post(url, data, config);
  }

  async put(url, data, config = {}) {
    return this.instance.put(url, data, config);
  }

  async delete(url, config = {}) {
    return this.instance.delete(url, config);
  }

  // Méthode pour vider le cache manuellement
  clearCache() {
    requestCache.clear();
    activeRequests.clear();
  }
}

export default new ApiService();