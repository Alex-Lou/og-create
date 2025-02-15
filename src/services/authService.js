import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api/auth/',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

class AuthService {
  _initializeAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
    }
  }

  constructor() {
    this._initializeAuthHeader();
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

  logout() {
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
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