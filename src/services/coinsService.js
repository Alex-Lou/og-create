// Écus d'un compte : le serveur tient le grand livre et renvoie le solde après chaque mouvement
import http from './http';

export default {
  async balance() {
    return (await http.get('/coins/balance')).data.coins;
  },
  // Points d'une question de l'Épreuve (versés une seule fois par question)
  async claimTimerQuestion(questionId) {
    return (await http.post('/coins/claim/timer-question', { questionId })).data.coins;
  },
  // Bonus de fin d'Épreuve quand le record du niveau monte
  async claimTimerRecord(level, score) {
    return (await http.post('/coins/claim/timer-record', { level, score })).data.coins;
  },
  // Aide payante : 'joker' (Épreuve) ou 'piste' (Infini)
  async spend(reason) {
    return (await http.post('/coins/spend', { reason })).data.coins;
  }
};
