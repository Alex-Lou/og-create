// Les pièces d'interface communes (components/ui) : ce que la tuile d'élément dit aux lecteurs d'écran (ElementTile,
// après son nom), l'invitation à fermer une pastille (ToastNotification), et celle à poursuivre une scène illustrée
// (PrologueScene, WreckScene). (components/Guide : rien à ranger, ses répliques viennent de game/guide.js et de
// texts/tutorial.)

// Une scène illustrée (le prologue, un naufrage) : sous la bulle, ou seule quand l'image n'a pas de texte
export const TOUCH_TO_GO_ON = 'Toucher pour continuer';

// La tuile d'élément : ce qui suit son nom, séparé par des virgules
export const TILE = {
  slot: numeral => `dans l’Athanor, emplacement ${numeral}`,
  ink: 'révélé par l’Encre',
  isNew: 'nouveau',
  fertile: n => `${n} mélange${n > 1 ? 's' : ''} encore inexploré${n > 1 ? 's' : ''}`,
  spent: 'tout exploré'
};

// Une pastille (ToastNotification), sous son message
export const TOAST_CLOSE = '(toucher pour fermer)';
