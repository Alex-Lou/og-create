// stores/authStore.js
import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user?.token && (!state.user.expiresAt || Date.now() < state.user.expiresAt),
    username: (state) => state.user?.username,
    userId: (state) => state.user?.userId,
    tokenExpiresAt: (state) => state.user?.expiresAt
  },
  
  actions: {
    initialize() {
      this.user = authService.getCurrentUser();
      
      // Configurer le rafraîchissement automatique du token
      this.setupTokenRefresh();
    },
    
    async login(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await authService.login(email, password);
        this.user = {
          token: response.token,
          refreshToken: response.refreshToken,
          userId: response.userId,
          username: response.username,
          expiresAt: Date.now() + (response.expiresIn || 3600) * 1000
        };
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur de connexion';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async register(email, password) {
      this.isLoading = true;
      this.error = null;
      
      try {
        const response = await authService.register(email, password);
        this.user = {
          token: response.token,
          refreshToken: response.refreshToken,
          userId: response.userId,
          username: response.username,
          expiresAt: Date.now() + (response.expiresIn || 3600) * 1000
        };
        return response;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur d\'inscription';
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    
    async refreshToken() {
      if (!this.user?.refreshToken) {
        throw new Error('Pas de refresh token disponible');
      }
      
      try {
        const response = await authService.refreshToken();
        
        this.user = {
          ...this.user,
          token: response.token,
          expiresAt: Date.now() + (response.expiresIn || 3600) * 1000
        };
        
        return response;
      } catch (error) {
        this.logout();
        throw error;
      }
    },
    
    async logout() {
      await authService.logout();
      this.user = null;
    },
    
    setupTokenRefresh() {
      if (!this.user?.token || !this.user?.expiresAt) {
        return;
      }
      
      const timeUntilExpiry = this.user.expiresAt - Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      // Si le token expire dans moins de 5 minutes, le rafraîchir maintenant
      if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
        this.refreshToken();
      }
      
      // Programmer un rafraîchissement 5 minutes avant l'expiration
      const refreshIn = Math.max(timeUntilExpiry - fiveMinutes, 0);
      
      if (refreshIn > 0 && refreshIn < 2147483647) { // Éviter les délais trop longs
        setTimeout(() => {
          if (this.isAuthenticated) {
            this.refreshToken();
          }
        }, refreshIn);
      }
    }
  }
});