// Les jeux de l'île (components/World/Games) : les mini-jeux des bâtiments (MiniGame et leurs plateaux, PickingBoard,
// VeinBoard), les niveaux et leur bilan (LevelPicker, LevelBilan), la Récolte (HarvestGame, harvestScene.js), les
// poules d’Agathe (HenChase, pour un lecteur d'écran).

// Les règles de chaque mini-jeu, avant la partie (MiniGame)
export const MINI_RULES = {
  peche: ['45 secondes, trois couloirs d’eau.', 'Gardon 2, truite 4, poisson doré 10 ; la vieille botte ne vaut rien.', 'Après un lancer, la ligne reste un instant à l’eau.'],
  filon: ['26 coups de pioche ; les blocs sombres sont plus durs.', 'On creuse depuis le haut, à côté d’un bloc ouvert.', 'Quartz 3, améthyste 5, rubis 8, diamant 16.'],
  cueillette: ['40 secondes, seize buissons.', 'Mûre 1, fraise et myrtille 2, cèpe doré 6.', 'Un buisson vide fait perdre un instant, les guêpes bien plus.']
};

// Un mini-jeu (MiniGame) : avant la partie, le départ, le résultat
export const MINI_GAME = {
  short: 'Tes deux premières parties sont courtes, pour apprendre en douceur.',
  regen: (hours, max) => `Une partie revient toutes les ${hours} h, ${max} au plus.`,
  go: 'Partez !',
  counting: 'Le serveur compte tes prises…',
  nothing: 'Rien cette fois… La prochaine sera la bonne.'
};

// Les consignes sous les plateaux de la cueillette (PickingBoard) et du filon (VeinBoard)
export const PICKING_HINT = 'Mûres, fraises, myrtilles, cèpes : cueille-les avant qu’ils tombent. Gare aux guêpes !';
export const VEIN_HINT = 'Creuse depuis le haut, bloc par bloc. ✦ : une pierre précieuse dort tout près.';

// Le choix du niveau (LevelPicker) : ce qui manque pour la saison suivante ; la première fois, ce que sont les niveaux
export const LEVEL_PICKER = {
  nextSeason: (have, need, season) => `${have} / ${need} pour ouvrir la saison ${season}`,
  tip: 'Chaque partie a un objectif. Rempli, il donne 1 à 3 étoiles selon ce qu’il te reste ; une étoile ouvre le niveau suivant, et la première fois, chaque étoile rapporte quelques écus.'
};

// Le bilan d'un niveau (LevelBilan) : le verdict selon les étoiles (verdicts[n] : n étoiles), le bonus, ce qui s'ouvre
export const LEVEL_BILAN = {
  missedBest: best => `Objectif manqué cette fois : ton record reste ${best} étoile${best > 1 ? 's' : ''}.`,
  missed: 'Objectif manqué cette fois… La prochaine sera la bonne.',
  verdicts: ['', 'Objectif rempli !', 'Bien joué : de la marge !', 'Parfait : trois étoiles !'],
  withRecord: (said, best) => `${said} (Ton record : ${best} étoiles.)`,
  bonus: n => `+${n} écus pour tes nouvelles étoiles`,
  season: n => `La saison ${n} s’ouvre !`,
  next: n => `Le niveau ${n} t’attend.`
};

// La Récolte (HarvestGame) : quitter sans jouer, la consigne, le résultat
export const HARVEST = {
  quit: 'Quitter sans jouer ? La partie est perdue et ne compte pas.',
  tip: 'Chaque partie a un objectif. Rempli, il donne 1 à 3 étoiles selon les coups qu’il te reste ; une étoile ouvre le niveau suivant.',
  rule: 'Relie au doigt 3 tuiles identiques voisines ou plus.',
  weighing: 'Le serveur pèse ta récolte…',
  quitted: 'Partie quittée sans jouer : elle est perdue.',
  stored: 'Ta récolte rejoint les réserves de l’île.',
  perTen: n => `${n > 1 ? 'écus' : 'écu'} : un pour chaque dizaine de ressources`,
  chest: rarity => `Un coffre ${rarity} est tombé ! Il s’ouvre au retour sur l’île.`
};
// Les mots de la Récolte sur le plateau (harvestScene.js) : une série de coups, le plateau rebattu
export const HARVEST_WORDS = {
  streak: n => `Série ×${n} !`,
  shuffled: 'Tout se mélange !'
};

// Les poules d’Agathe, pour un lecteur d'écran (HenChase) : une poule qui picore, prise, qui s'esquive
export const HEN_CHASE_LIVE = {
  pecks: name => `${name} picore : attrape-la`,
  caught: name => `${name} est prise.`,
  dodged: name => `${name} s’esquive.`
};
