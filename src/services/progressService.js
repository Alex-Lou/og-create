// Progression d'un compte : écus et records de l'Épreuve ({ coins, timerProgress, ... }).
// Le carnet vient de playService.state(), la progression de l'Épreuve s'écrit par trialService.
import http from './http';

export default {
  async load() {
    return (await http.get('/progress/load')).data;
  }
};
