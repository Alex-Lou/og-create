// Client HTTP unique de l'application : base URL, token Bearer, rafraîchissement du token sur 401.
import axios from 'axios';
import { API_URL } from '@/config';
import { getSession, saveSession, clearSession } from './session';

const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 20000
});

http.interceptors.request.use(config => {
  const session = getSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// Un seul rafraîchissement à la fois, partagé par toutes les requêtes en 401
let refreshing = null;

export function refreshSession() {
  if (!refreshing) {
    const session = getSession();
    refreshing = (session?.refreshToken
      ? axios.post(`${API_URL}/auth/refresh-token`, { refreshToken: session.refreshToken }, { withCredentials: true })
          .then(response => saveSession(response.data, session.refreshToken))
      : Promise.reject(new Error('Pas de refresh token disponible'))
    ).finally(() => { refreshing = null; });
  }
  return refreshing;
}

http.interceptors.response.use(
  response => response,
  async error => {
    const request = error.config;
    const isAuthCall = request?.url?.includes('/auth/');
    // Sans session (invité), un 401 est simplement renvoyé à l'appelant
    if (error.response?.status === 401 && request && !request._retry && !isAuthCall && getSession()?.token) {
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
