// src/services/progressService.js
// Progression du joueur : chargement, et sauvegarde regroupée (debounce) avec envoi final à la fermeture.
import http from './http';
import { API_URL } from '@/config';
import { getSession } from './session';

const SAVE_DELAY = 2000; // regroupe les sauvegardes rapprochées

let pending = null;   // dernière progression à envoyer (fusionnée)
let saveTimer = null;
let loading = null;   // chargement en cours, partagé entre appelants

function union(a = [], b = []) {
  return [...new Set([...a, ...b])];
}

// Fusionne deux sauvegardes : les listes s'additionnent, le reste prend la valeur la plus récente
function merge(previous, next) {
  if (!previous) return { ...next };
  const merged = { ...previous, ...next };
  if (previous.discoveredElements && next.discoveredElements) {
    merged.discoveredElements = union(previous.discoveredElements, next.discoveredElements);
  }
  if (previous.discoveredCategories && next.discoveredCategories) {
    merged.discoveredCategories = union(previous.discoveredCategories, next.discoveredCategories);
  }
  return merged;
}

class ProgressService {
  loadGameProgress() {
    if (!loading) {
      loading = http.get('/progress/load')
        .then(response => response.data)
        .finally(() => { loading = null; });
    }
    return loading;
  }

  // Met la progression en attente ; elle part SAVE_DELAY ms après le dernier appel
  saveGameProgress(progressData) {
    // Invité : rien n'est sauvegardé
    if (!getSession()?.token) return Promise.resolve();
    if (!progressData || Object.keys(progressData).length === 0) return Promise.resolve();
    pending = merge(pending, progressData);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => this.flush(), SAVE_DELAY);
    return Promise.resolve();
  }

  async flush() {
    clearTimeout(saveTimer);
    if (!pending) return;
    const data = pending;
    pending = null;
    try {
      await http.post('/progress/save', data);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la progression:', error);
      // Conserver les données pour la prochaine tentative
      pending = merge(data, pending || {});
    }
  }

  // Envoi de dernière chance quand l'onglet se ferme (keepalive survit au déchargement)
  flushOnExit() {
    const token = getSession()?.token;
    if (!pending || !token) return;
    fetch(`${API_URL}/progress/save`, {
      method: 'POST',
      keepalive: true,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(pending)
    }).catch(() => {});
    pending = null;
  }

  async updateDiscoveredElements(discoveredElements, gameMode = 'infinite') {
    if (!Array.isArray(discoveredElements)) return null;
    const response = await http.post('/progress/update-discovered-elements', { discoveredElements, gameMode });
    return response.data;
  }

  updateTimerProgress(timerProgress) {
    return this.saveGameProgress({
      timerProgress: {
        completedQuestions: timerProgress?.completedQuestions || {},
        unlockedCategories: timerProgress?.unlockedCategories || {},
        bestScores: {
          Facile: timerProgress?.bestScores?.Facile || 0,
          Moyen: timerProgress?.bestScores?.Moyen || 0,
          Difficile: timerProgress?.bestScores?.Difficile || 0
        }
      }
    });
  }
}

const progressService = new ProgressService();

// 'pagehide' est plus fiable que 'beforeunload' (mobile, bfcache)
window.addEventListener('pagehide', () => progressService.flushOnExit());

export default progressService;
