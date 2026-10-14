// Le pendu d'une page du Grimoire (components/Book/HangmanSheet ; les alertes : components/Book/BookView/hangman.js) :
// ce que dit la feuille après chaque lettre, la partie perdue, et les cases pour les lecteurs d'écran. Les libellés
// (« Devine le nom », « Mot trouvé », « Partie perdue », les erreurs permises, « Voir la page », « Rejouer ») restent
// dans le code ; « <strong>nom</strong> rejoint ton registre ! » aussi (une balise dans la phrase).
export const HANGMAN = {
  // Le verdict d'une lettre : ailleurs dans le mot, absente
  elsewhere: letter => `«\u00a0${letter}\u00a0» est dans le mot, mais pas ici.`,
  miss: letter => `Pas de «\u00a0${letter}\u00a0» dans ce mot.`,
  // Partie perdue : quand le pendu se rouvre (aujourd'hui, demain), et sans compte
  lost: when => `Toutes les gouttes sont tombées\u00a0: le pendu se rouvre ${when}.`,
  today: time => `à ${time}`,
  tomorrow: time => `demain à ${time}`,
  noAccount: 'Avec un compte, tu peux rejouer tout de suite contre des écus.',
  // (lecteurs d'écran) le mot, chaque case (k : son rang, à partir de 1), les erreurs permises
  word: (n, cells) => `Mot de ${n} lettres : ${cells.map(c => c || 'vide').join(', ')}`,
  cell: (k, char) => `Case ${k} : ${char}`,
  cellEmpty: k => `Case ${k}, vide`,
  lives: (left, max) => `${left} erreur(s) permise(s) sur ${max}`,
  // Les alertes : une lettre, puis rejouer, en échec
  letterFailed: 'Cette lettre n’a pas pu être jouée.',
  retryFailed: 'Impossible de rejouer pour l’instant.'
};
