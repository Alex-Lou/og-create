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

// Un serveur qui dort (hébergement gratuit : jusqu'à une minute pour se réveiller) ou qui peine (serveur partagé) :
// une lecture (GET) restée sans réponse, ou répondue 502, 503 ou 504, est refaite après 1, 2, 4, 8 puis 15 s, tant
// que RETRY_BUDGET_MS n'est pas écoulé depuis la première demande. Une écriture (POST…) n'est jamais refaite : rien ne
// dit que le serveur ne l'a pas déjà faite.
const RETRY_DELAYS = [1000, 2000, 4000, 8000, 15000];
const RETRY_BUDGET_MS = 90000;
const UNREACHABLE = new Set([502, 503, 504]);
const unreachable = error => (error.response ? UNREACHABLE.has(error.response.status) : error.code !== 'ERR_CANCELED');

async function retried(request, error) {
  request._since = request._since || Date.now();
  const tries = request._tries || 0;
  const delay = RETRY_DELAYS[Math.min(tries, RETRY_DELAYS.length - 1)];
  if (Date.now() - request._since + delay > RETRY_BUDGET_MS) throw error;
  request._tries = tries + 1;
  await new Promise(resolve => setTimeout(resolve, delay));
  return http(request);
}

// Les calques de la carte (relief, sol, quartiers, grille : 85 Ko) restent en mémoire : le navigateur envoie leur clé
// (X-Map-Key) et le serveur ne les renvoie plus tant qu'elle ne change pas ; ils sont remis dans chaque vue reçue sans
// eux. Une vue de l'île arrive seule ({ map }) ou dans une réponse d'action ({ world })
const MAP_LAYERS = ['grid', 'height', 'ground', 'region'];
let mapLayers = null;
function fillMap(view) {
  const map = view && view.map;
  if (!map || !map.key) return;
  if (map.ground) mapLayers = { key: map.key, layers: Object.fromEntries(MAP_LAYERS.map(k => [k, map[k]])) };
  else if (mapLayers && mapLayers.key === map.key) Object.assign(map, mapLayers.layers);
}
http.interceptors.request.use(config => {
  if (mapLayers) config.headers['X-Map-Key'] = mapLayers.key;
  return config;
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
  response => {
    const data = response.data;
    if (data && typeof data === 'object') {
      fillMap(data);
      fillMap(data.world);
    }
    return response;
  },
  async error => {
    const request = error.config;
    if (request && request.method === 'get' && unreachable(error)) return retried(request, error);
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
