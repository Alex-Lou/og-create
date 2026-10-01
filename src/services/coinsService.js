// Écus d'un compte : le serveur tient le grand livre et renvoie le solde après chaque mouvement
import http from './http';

export default {
  async balance() {
    return (await http.get('/coins/balance')).data.coins;
  }
  // Les gains (Épreuve) et les aides payantes passent par le serveur de jeu (playService)
};
