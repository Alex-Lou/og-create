// L'Épreuve côté navigateur : les questions (publiques) et la progression (compte seulement).
// Les réponses, le chrono, le score et les écus sont tenus par le serveur (playService).
import http from './http';
import { getSession } from './session';
import { emptyProgress } from '@/utils/trialProgress';

let questions = null;

export default {
  // { levels: { niveau: { timer, categories: { chapitre: { questions: [...] } } } } }, chargé une fois
  questions() {
    if (!questions) {
      questions = http.get('/game-data/timer-questions').then(response => response.data).catch(error => {
        questions = null;
        throw error;
      });
    }
    return questions;
  },
  async loadProgress() {
    if (!getSession()) return emptyProgress();
    try {
      return { ...emptyProgress(), ...(await http.get('/timer/load-progress')).data };
    } catch {
      return emptyProgress();
    }
  },
  // Envoie une partie de la progression ; le serveur la fusionne et renvoie la progression complète (null pour un invité)
  async saveProgress(part) {
    if (!getSession()) return null;
    return (await http.post('/timer/update-timer-progress', { timerProgress: part })).data.timerProgress;
  }
};
