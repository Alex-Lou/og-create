// services/api.js
import axios from 'axios';
import authService from './authService'; // Assure-toi que ce fichier existe

// Créer une instance axios avec une configuration de base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Ajuste ceci selon ton environnement
  headers: {
    'Content-Type': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(
  config => {
    const user = authService.getCurrentUser();
    
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

export default api;