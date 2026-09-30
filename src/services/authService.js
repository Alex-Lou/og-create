import http, { refreshSession } from './http';
import { getSession, saveSession, clearSession } from './session';
import gameDataService from './gameDataService';

class AuthService {
  async login(email, password) {
    return this._authenticate('login', email, password);
  }

  async register(email, password) {
    return this._authenticate('register', email, password);
  }

  async _authenticate(endpoint, email, password) {
    const response = await http.post(`/auth/${endpoint}`, { email, password });
    if (response.data.token) {
      saveSession(response.data);
      // Recharger la page pour repartir sur un état connecté propre
      window.location.reload();
    }
    return response.data;
  }

  refreshToken() {
    return refreshSession();
  }

  async logout() {
    const session = getSession();
    // Révoquer le refresh token côté serveur (best effort)
    if (session?.refreshToken) {
      await http.post('/auth/logout', { refreshToken: session.refreshToken, userId: session.userId })
        .catch(() => console.warn('Erreur lors de la déconnexion côté serveur'));
    }
    gameDataService.clearCache?.();
    clearSession();
  }

  getCurrentUser() {
    return getSession();
  }

  // Un token présent suffit : s'il a expiré, le client HTTP le rafraîchit au premier 401
  isAuthenticated() {
    return !!getSession()?.token;
  }
}

export default new AuthService();
