import axios from 'axios';
import gameDataService from './gameDataService';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/auth/',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Instance API partagée que d'autres services peuvent utiliser
export const apiInstance = axios.create({
  baseURL: 'http://localhost:3000/api/',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

class AuthService {
  constructor() {
    // Initialiser les headers d'autorisation au démarrage
    this._initializeAuthHeader();
    // Configurer les intercepteurs pour la gestion des tokens expirés
    this._setupInterceptors();
  }

  _initializeAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      console.log('Initialisation des headers avec token:', user.token.substring(0, 10) + '...');
      // Mettre à jour toutes les instances d'Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      apiInstance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    } else {
      console.log('Pas de token disponible pour initialiser les headers');
      // S'assurer que les headers sont nettoyés si aucun token n'est disponible
      delete axios.defaults.headers.common['Authorization'];
      delete axiosInstance.defaults.headers.common['Authorization'];
      delete apiInstance.defaults.headers.common['Authorization'];
    }
  }

  // Configuration des intercepteurs pour gérer les tokens expirés
  _setupInterceptors() {
    apiInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;
        
        // Vérifier si l'erreur est due à un token expiré
        if (error.response && 
            error.response.status === 401 && 
            !originalRequest._retry && 
            (error.response.data.code === 'TOKEN_EXPIRED' || 
             error.response.data.message === 'Le token a expiré. Veuillez vous reconnecter.')) {
          
          originalRequest._retry = true;
          console.log('Token expiré, tentative de rafraîchissement...');
          
          try {
            // Récupérer les tokens actuels
            const user = this.getCurrentUser();
            if (!user || !user.refreshToken) {
              throw new Error('Pas de refresh token disponible');
            }
            
            // Appeler l'endpoint de rafraîchissement avec le refresh token
            const response = await axiosInstance.post('refresh-token', {
              refreshToken: user.refreshToken
            });
            
            // Stocker le nouveau token d'accès
            const { token, userId, username, expiresIn } = response.data;
            
            // Mettre à jour les informations utilisateur
            this._updateUserData({
              token,
              refreshToken: user.refreshToken, // Garder le même refresh token
              userId,
              username,
              expiresAt: Date.now() + (expiresIn || 3600) * 1000
            });
            
            // Mettre à jour les en-têtes pour toutes les instances
            this._initializeAuthHeader();
            
            // Mettre à jour le header de la requête originale et la réessayer
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return axios(originalRequest);
          } catch (refreshError) {
            console.error('Échec du rafraîchissement du token:', refreshError);
            
            // Si le rafraîchissement échoue, déconnecter l'utilisateur
            this.logout();
            
            // Rediriger vers la page de connexion
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  _updateUserData(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    this._initializeAuthHeader();
  }

  async login(email, password) {
    try {
      console.group('Tentative de connexion');
      console.log('Données:', { email, password: '******' });
      
      const response = await axiosInstance.post('login', { 
        email, 
        password 
      });
      
      console.log('Réponse complète:', response);
      console.log('Données de réponse:', response.data);
      console.groupEnd();
      
      if (response.data.token) {
        // Stocker le token, le refresh token et la date d'expiration
        const userData = {
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          userId: response.data.userId,
          username: response.data.username,
          expiresAt: Date.now() + (response.data.expiresIn || 3600) * 1000
        };
        
        this._updateUserData(userData);
        // Recharger la page après une connexion réussie
        window.location.reload();
      }
      
      return response.data;
    } catch (error) {
      console.group('Erreur de connexion');
      console.error('Détails de l\'erreur:', error);
      
      if (error.response) {
        console.error('Données de l\'erreur:', error.response.data);
        console.error('Statut de l\'erreur:', error.response.status);
        console.error('Headers de l\'erreur:', error.response.headers);
      } else if (error.request) {
        console.error('Requête sans réponse:', error.request);
      } else {
        console.error('Erreur de configuration:', error.message);
      }
      
      console.groupEnd();
      
      throw error;
    }
  }

  async register(email, password) {
    try {
      console.group('Tentative d\'inscription');
      console.log('Données:', { email, password: '******' });
      
      const response = await axiosInstance.post('register', { 
        email, 
        password 
      });
      
      console.log('Réponse complète:', response);
      console.log('Données de réponse:', response.data);
      console.groupEnd();
      
      if (response.data.token) {
        // Stocker le token, le refresh token et la date d'expiration
        const userData = {
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          userId: response.data.userId,
          username: response.data.username,
          expiresAt: Date.now() + (response.data.expiresIn || 3600) * 1000
        };
        
        this._updateUserData(userData);
        // Recharger la page après une inscription réussie également
        window.location.reload();
      }
      
      return response.data;
    } catch (error) {
      console.group('Erreur d\'inscription');
      console.error('Détails de l\'erreur:', error);
      
      if (error.response) {
        console.error('Données de l\'erreur:', error.response.data);
        console.error('Statut de l\'erreur:', error.response.status);
        console.error('Headers de l\'erreur:', error.response.headers);
      } else if (error.request) {
        console.error('Requête sans réponse:', error.request);
      } else {
        console.error('Erreur de configuration:', error.message);
      }
      
      console.groupEnd();
      
      throw error;
    }
  }

  async refreshToken() {
    try {
      console.group('Tentative de rafraîchissement de token');
      
      const user = this.getCurrentUser();
      if (!user || !user.refreshToken) {
        throw new Error('Pas de refresh token disponible pour le rafraîchissement');
      }
      
      const response = await axiosInstance.post('refresh-token', {
        refreshToken: user.refreshToken
      });
      
      console.log('Réponse de rafraîchissement:', response.data);
      console.groupEnd();
      
      if (response.data.token) {
        // Mettre à jour le stockage local avec le nouveau token
        const userData = {
          token: response.data.token,
          refreshToken: user.refreshToken, // Conserver le refresh token existant
          userId: response.data.userId,
          username: response.data.username,
          expiresAt: Date.now() + (response.data.expiresIn || 3600) * 1000
        };
        
        this._updateUserData(userData);
        return response.data;
      }
    } catch (error) {
      console.group('Erreur de rafraîchissement de token');
      console.error('Détails de l\'erreur:', error);
      
      if (error.response) {
        console.error('Données de l\'erreur:', error.response.data);
        console.error('Statut de l\'erreur:', error.response.status);
      }
      
      console.groupEnd();
      
      // En cas d'échec du rafraîchissement, déconnecter l'utilisateur
      this.logout();
      throw error;
    }
  }

  async logout() {
    try {
      const user = this.getCurrentUser();
      
      // Appeler l'API pour révoquer le refresh token côté serveur
      if (user && user.refreshToken) {
        await axiosInstance.post('logout', {
          refreshToken: user.refreshToken,
          userId: user.userId
        }).catch(err => console.warn('Erreur lors de la déconnexion côté serveur:', err));
      }
    } catch (error) {
      console.warn('Erreur lors de la déconnexion:', error);
    } finally {
      // Vider le cache des données du jeu avant de supprimer l'authentification
      if (gameDataService && typeof gameDataService.clearCache === 'function') {
        gameDataService.clearCache();
      }
      
      // Toujours nettoyer localement, même en cas d'erreur
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      delete axiosInstance.defaults.headers.common['Authorization'];
      delete apiInstance.defaults.headers.common['Authorization'];
  
      // Indiquer au système que les données ne sont plus accessibles
      window.isLoggedOut = true;
    }
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    
    // Vérifier si l'utilisateur existe et a un token
    if (!user || !user.token) {
      return false;
    }
    
    // Vérifier si le token est expiré
    if (user.expiresAt && Date.now() > user.expiresAt) {
      console.log('Token expiré, tentative de rafraîchissement automatique');
      
      // Tenter un rafraîchissement silencieux du token
      this.refreshToken().catch(err => {
        console.error('Échec du rafraîchissement automatique:', err);
        this.logout();
        return false;
      });
      
      // Considérer l'utilisateur comme non authentifié jusqu'à ce que le rafraîchissement réussisse
      return false;
    }
    
    const isAuth = true;
    console.log('Authentification vérifiée:', isAuth);
    return isAuth;
  }

  // Fonction qui vérifie périodiquement si le token est sur le point d'expirer
  // et le rafraîchit en avance pour éviter les interruptions
  setupTokenRefreshScheduler() {
    // Vérifier toutes les minutes
    const interval = setInterval(async () => {
      const user = this.getCurrentUser();
      
      // Si pas d'utilisateur ou pas de token, arrêter la vérification
      if (!user || !user.token || !user.expiresAt) {
        return;
      }
      
      // Rafraîchir si moins de 5 minutes avant expiration
      const timeUntilExpiry = user.expiresAt - Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
        console.log('Token bientôt expiré, rafraîchissement préventif');
        try {
          await this.refreshToken();
          console.log('Rafraîchissement préventif réussi');
        } catch (error) {
          console.error('Échec du rafraîchissement préventif:', error);
        }
      }
    }, 60000); // Vérifier chaque minute
    
    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(interval);
  }
}

export default new AuthService();