import axios from 'axios';

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
  _initializeAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      // Mettre à jour toutes les instances d'Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
      apiInstance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }

  constructor() {
    this._initializeAuthHeader();
    this._setupInterceptors();
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
            error.response.data.message === 'Le token a expiré. Veuillez vous reconnecter.') {
          
          originalRequest._retry = true;
          console.log('Token expiré, tentative de rafraîchissement...');
          
          try {
            // Récupérer le token actuel
            const user = this.getCurrentUser();
            if (!user || !user.token) {
              throw new Error('Pas de token disponible');
            }
            
            // Appeler l'endpoint de rafraîchissement
            const response = await axiosInstance.post('refresh-token', {
              token: user.token
            });
            
            // Stocker le nouveau token
            const { token, userId, username } = response.data;
            
            // Mettre à jour les informations utilisateur
            localStorage.setItem('user', JSON.stringify({
              token,
              userId,
              username
            }));
            
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

  async login(email, password) {
    try {
      console.group('Tentative de connexion');
      console.log('Données:', { email, password });
      
      const response = await axiosInstance.post('login', { 
        email, 
        password 
      });
      
      console.log('Réponse complète:', response);
      console.log('Données de réponse:', response.data);
      console.groupEnd();
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        this._initializeAuthHeader();
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
      console.log('Données:', { email, password });
      
      const response = await axiosInstance.post('register', { 
        email, 
        password 
      });
      
      console.log('Réponse complète:', response);
      console.log('Données de réponse:', response.data);
      console.groupEnd();
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        this._initializeAuthHeader();
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
      if (!user || !user.token) {
        throw new Error('Pas de token disponible pour le rafraîchissement');
      }
      
      const response = await axiosInstance.post('refresh-token', {
        token: user.token
      });
      
      console.log('Réponse de rafraîchissement:', response.data);
      console.groupEnd();
      
      if (response.data.token) {
        // Mettre à jour le stockage local avec le nouveau token
        localStorage.setItem('user', JSON.stringify({
          token: response.data.token,
          userId: response.data.userId,
          username: response.data.username
        }));
        
        // Réinitialiser les en-têtes d'autorisation
        this._initializeAuthHeader();
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

  logout() {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    delete axiosInstance.defaults.headers.common['Authorization'];
    delete apiInstance.defaults.headers.common['Authorization'];
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    const isAuth = !!user && !!user.token;
    console.log('Authentification vérifiée:', isAuth);
    return isAuth;
  }
}

export default new AuthService();