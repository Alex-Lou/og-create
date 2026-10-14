// Les pièces d'interface communes (components/ui) : ce que la tuile d'élément dit aux lecteurs d'écran (ElementTile,
// après son nom) et l'invitation à fermer une pastille (ToastNotification). (components/Guide : rien à ranger, ses
// répliques viennent de game/guide.js et de texts/tutorial.)

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
