// L'Épreuve (components/Trial et App/trial.js) : le lancement et les jokers (App/trial.js), la recherche de l'inventaire
// (TrialInventory), quitter (TimerModeButton), les jokers de la consigne (TimerBrief), les chapitres (TimerQuestions)

export const TRIAL = {
  // App/trial.js
  startFailed: 'L’épreuve n’a pas pu démarrer, réessaie.',
  // Les indices des jokers : une étape (les ingrédients, joints par « + »), un ingrédient
  stepHint: ingredients => `Essaie ${ingredients}.`,
  ingredientHint: name => `Pense à ${name}…`,
  jokerFailed: 'Le joker n’a pas pu être utilisé.',
  // TrialInventory : la recherche ne trouve rien
  noMatch: query => `Aucun élément ne répond à « ${query} ».`,
  empty: 'Le registre est encore vierge.',
  suggest: name => `Vouliez-vous dire « ${name} » ?`,
  // TimerModeButton : briser le sablier
  stop: 'La question en cours ne sera pas gardée. Tes épreuves déjà réussies le restent.',
  // TimerBrief : ce que montre chaque joker (au survol)
  jokers: {
    step: 'Montre la prochaine fusion utile',
    ingredient: 'Montre un des éléments à combiner',
    time: seconds => `Ajoute ${seconds} secondes au sablier`
  },
  // TimerQuestions
  chapterHint: 'Achève chaque question d’un chapitre pour le sceller.',
  unavailable: 'L’Épreuve ne répond pas pour l’instant. Réessaie dans un moment.',
  chapterDone: chapter => `Tu as achevé le chapitre ${chapter}.`,
  nextChapter: chapter => `Chapitre suivant : ${chapter}`,
  allDone: 'Tous les chapitres sont achevés'
};
