// L'application autour du jeu (components/App) : les pastilles et l'aide d'App.vue, les noms accessibles du bandeau
// (AppHeader) et de la barre d'onglets (TabBar), ce que dit Brume au retour d'un compte et à une mise à jour (App/account.js,
// App/update.js)

// App.vue
export const APP = {
  // « Passer le tutoriel » : la confirmation
  skipTutorial: 'Brume ne te montrera plus chaque geste. Tu pourras tout découvrir seul : ses bulles t’aideront encore.',
  // L'Athanor grandit, sans réplique de Brume pour cette taille
  newSlot: 'Nouvel emplacement de fusion débloqué !',
  // Pendu gagné : l'élément est inscrit
  inscribed: name => `${name} rejoint ton registre\u00a0!`,
  // Épreuve : une réussite arrivée après la fin du sablier
  late: 'Le sablier était déjà vide : cette réussite ne compte pas.',
  // L'Épreuve en cours retient le joueur (vers l'île, vers le Sceau)
  trialWorld: 'Termine ou quitte l’Épreuve avant d’aller sur ton île.',
  trialSceau: 'Termine ou quitte l’Épreuve avant d’ouvrir ton sceau.'
};

// Le bandeau (AppHeader) : les noms accessibles de l'ère et des écus
export const HEADER = {
  era: (eraName, found, total) => `${eraName}, ${found} sur ${total} éléments : ouvrir ton sceau`,
  coins: coins => `${coins} écus : ouvrir le Cabinet`
};

// La barre d'onglets (TabBar) : un onglet encore fermé
export const TABBAR = {
  locked: label => `${label} (s’ouvre pendant le tutoriel)`
};

// Ce que dit Brume au retour d'un compte (serveur : accountSettings.welcomeBack) et au lien d'une nouvelle adresse
// (App/account.js)
export const BACK_LINES = {
  suspendu: 'Te revoilà ! L’île a dormi sous la brume en t’attendant. On s’y remet ?',
  suppression: 'Te revoilà… J’ai déchiré la page du départ. Ton île reste à toi, tout entière.'
};
export const EMAIL_LINE = 'C’est noté dans le Grimoire : les lettres de l’île iront à ta nouvelle adresse.';
// Le lien « nouvelle adresse » qui ne marche plus (App/account.js)
export const EMAIL_LINK_DEAD = 'Ce lien ne marche plus : redemande-en un depuis ton Sceau.';

// Une mise à jour en ligne : Brume l'annonce (App/update.js)
export const UPDATE_LINE = 'Psst… L’île a changé pendant que tu regardais ailleurs. Viens voir ?';
