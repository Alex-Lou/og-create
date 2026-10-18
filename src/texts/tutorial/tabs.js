// Les onglets pendant le tutoriel (App, story.js) : ce que dit Brume quand l'un s'ouvre, et ce que dit le coach quand la
// suite est sur un autre onglet

// Un onglet s'ouvre pendant le tutoriel : Brume le dit (une réplique, ou plusieurs à la suite), sans nommer l'interface ;
// la ligne d'aide montre l'onglet (texts/tutorial/coach.js : TAB_HELP) (choix de l'auteur, 14 oct. :
// ecriture/lots/01 et 02). Le Sceau : Brume découvre le mot « écrire » en voyant le joueur signer
export const TAB_OPENED = {
  world: 'Le vent a ouvert la plage. Pour cette nuit, on reste près du rivage.',
  sceau: ['Tu écris… C’est ça qu’ils faisaient, ceux d’avant. Ils écrivaient.', 'J’ignore si le livre se souviendra de toi si tu t’en vas… Tu ne pars pas, hein ?'],
  timer: 'Le livre a d’autres jeux. Des énigmes, contre le temps.'
};

// Le plan d'un chantier écrit dans l'Athanor : Brume renvoie sur l'île (App, story.js)
export const PLAN_WRITTEN = {
  text: 'Tu l’as écrit ! Viens : on va lui trouver sa place, sur la plage.',
  action: 'Aller sur l’île'
};

// Ce que dit le coach quand la suite est sur un autre onglet
export const TAB_CALLS = {
  world: 'La suite t’attend sur l’île : touche « Île ».',
  infinite: 'La suite se mélange dans l’Athanor du Grimoire : touche « Grimoire ».'
};
