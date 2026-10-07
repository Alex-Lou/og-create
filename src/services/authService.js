import http from './http';
import { getSession, saveSession, clearSession } from './session';
import * as storage from '@/utils/storage';

// Retour d'un compte en pause ou en partance (réponse de connexion : back) : Brume l'accueille après le rechargement
export const BACK_KEY = 'oc_back';

class AuthService {
  async login(email, password) {
    return this._authenticate('login', email, password);
  }

  async register(email, password) {
    return this._authenticate('register', email, password);
  }

  async _authenticate(endpoint, email, password) {
    const response = await http.post(`/auth/${endpoint}`, { email, password });
    if (response.data.userId) {
      saveSession(response.data);
      if (response.data.back) storage.save(BACK_KEY, response.data.back);
      // Recharger la page pour repartir sur un état connecté propre
      window.location.reload();
    }
    return response.data;
  }

  // Mot de passe oublié : le serveur répond toujours la même chose, que l'adresse existe ou non
  async forgotPassword(email) {
    return (await http.post('/auth/forgot-password', { email })).data;
  }

  async resetPassword(token, password) {
    return (await http.post('/auth/reset-password', { token, password })).data;
  }

  async logout() {
    // Révoque la session côté serveur et efface les cookies (best effort)
    await http.post('/auth/logout').catch(() => {});
    clearSession();
  }

  getCurrentUser() {
    return getSession();
  }

  // L'indice de session suffit : si la session a expiré, le client HTTP le découvre au premier 401
  isAuthenticated() {
    return !!getSession();
  }
}

export default new AuthService();
