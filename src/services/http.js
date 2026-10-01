// Client HTTP unique de l'application. La session voyage dans des cookies httpOnly (même origine : /api),
// chaque requête porte l'en-tête de l'application (anti-CSRF), et un 401 déclenche un renouvellement unique.
import axios from 'axios';
import { API_URL } from '@/config';
import { getSession, saveSession, clearSession } from './session';

export const APP_HEADER = { 'X-Requested-With': 'origins' };

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json', ...APP_HEADER },
  timeout: 20000
});

// Un seul renouvellement à la fois, partagé par toutes les requêtes en 401.
// 409 : un autre onglet vient de renouveler la session, le navigateur a déjà le nouveau cookie.
let refreshing = null;

export function refreshSession() {
  if (!refreshing) {
    refreshing = http.post('/auth/refresh')
      .catch(error => (error.response?.status === 409 ? http.get('/auth/me') : Promise.reject(error)))
      .then(response => saveSession(response.data))
      .finally(() => { refreshing = null; });
  }
  return refreshing;
}

http.interceptors.response.use(
  response => response,
  async error => {
    const request = error.config;
    const isAuthCall = request?.url?.includes('/auth/');
    // Sans session (invité), un 401 est simplement renvoyé à l'appelant
    if (error.response?.status === 401 && request && !request._retry && !isAuthCall && getSession()) {
      request._retry = true;
      try {
        await refreshSession();
        return http(request);
      } catch {
        // Session irrécupérable : on repart en invité
        clearSession();
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

export default http;
