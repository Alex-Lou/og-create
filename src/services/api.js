// services/api.js
import axios from 'axios';
import authService from './authService';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  config => {
    // Vérifier si l'utilisateur est connecté
    const user = authService.getCurrentUser();
    
    if (user && user.token) {
      // Ajouter le token aux en-têtes
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs 401 (token expiré)
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Vérifier si c'est une erreur 401 et qu'on n'a pas déjà essayé de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tenter de rafraîchir le token
        await authService.refreshToken();
        
        // Réessayer la requête avec le nouveau token
        const user = authService.getCurrentUser();
        originalRequest.headers.Authorization = `Bearer ${user.token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, rediriger vers la page de connexion
        authService.logout();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;