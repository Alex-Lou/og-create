// L'horloge d'une partie chronométrée : le temps de jeu (ms) depuis son départ, en pause tant que la page est cachée
// (un appel, une notification : la partie attend le joueur au lieu de filer sans lui). Le temps de jeu ne dépasse donc
// jamais le temps réel, ce que le serveur vérifie (le dernier geste au plus tard à la durée écoulée).
// now : l'horloge du navigateur (remplaçable dans les tests)
export function horlogeDePartie(now = () => performance.now()) {
  let depart = null;
  let cacheeDepuis = null;
  let pause = 0;
  const onVisible = () => {
    if (document.hidden) cacheeDepuis = cacheeDepuis ?? now();
    else if (cacheeDepuis !== null) {
      pause += now() - cacheeDepuis;
      cacheeDepuis = null;
    }
  };
  return {
    get started() {
      return depart !== null;
    },
    start() {
      if (depart !== null) return;
      depart = now();
      if (document.hidden) cacheeDepuis = depart;
      document.addEventListener('visibilitychange', onVisible);
    },
    elapsed() {
      return depart !== null ? (cacheeDepuis ?? now()) - depart - pause : 0;
    },
    stop() {
      document.removeEventListener('visibilitychange', onVisible);
    }
  };
}
