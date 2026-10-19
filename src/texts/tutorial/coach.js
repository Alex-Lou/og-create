// Ce que dit la bulle du coach pendant le tutoriel (game/prologue.js : LESSONS, SHORT, CLAIM, les gestes du Grimoire),
// rangé par quête puis par geste ; les gestes communs une seule fois. Le code ne garde que les cibles (où va la main).

export const COACH = {
  book: {
    page: 'Voici la page qui manque : son énigme dit ce qu’il faut mêler. Touche ici les bons éléments, ils iront dans l’Athanor.',
    inked: 'L’Encre a révélé cet ingrédient : touche-le, il va dans l’Athanor.',
    next: 'Encore un : touche-le, il rejoint le premier dans l’Athanor.',
    // (une page à leurres, l'Encre ayant parlé : le second ingrédient, le joueur le trouve dans l'énigme)
    guess: 'Un ingrédient révélé. Le second se lit dans l’énigme.',
    // (une page sans Encre dont l'unique ingrédient entre deux fois : le Brasier, Feu + Feu)
    twice: 'L’énigme dit quoi mêler : touche cet élément, il va dans l’Athanor. Il en faut deux : touche-le encore.',
    ink: why => `Son énigme dit ce qu’il faut mêler : touche ces éléments en bas. Bloqué ? L’Encre est offerte ${why} : elle révèle un ingrédient.`,
    plans: {
      feu: plan => `Le feu de camp naît d’un mélange : écris « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`,
      'puits-ondin': plan => `Le Puits naît d’un mélange : écris « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`
    },
    why: {
      default: 'pour ce chantier',
      // (le Brasier, Feu + Feu : pas d'Encre, l'énigme suffit)
      feu: null
    },
    plan: plan => `Ce chantier naît d’un mélange : écris « ${plan} » dans l’Athanor. Suis le ruban.`
  },
  fuse: 'Les éléments sont dans l’Athanor : touche « Transmuer ». Si ce n’est pas le bon mélange, l’Athanor te le dit : essaie un autre élément.',
  ramasser: {
    trouvaille: 'La mer a rendu du bois flotté et un galet : touche-en un.',
    ramasser: 'Touche « Ramasser » : il rejoint tes réserves, en haut.'
  },
  sleep: 'Touche Brume pour dormir : elle veille sur le feu.',
  // La page de garde, quand on y écrit son nom (PrologueName ; choix de l'auteur, 14 oct.)
  nom: 'Écris ton nom : il garde ton île, et tu la retrouveras sur tous tes appareils.',
  // (le tutoriel, loin de l'île, sans geste à montrer ailleurs : App, islandStory.js)
  'vers-ile': 'Brume t’attend sur l’île.',
  // (l'énigme du Vent, ouverte : App, story.js)
  'vent-air': 'Touche l’Air, deux fois : il va dans l’Athanor, et le livre fait le mélange.',
  // (elle nage au pied de son Ponton : on ne la connaît pas encore ; choix de l'auteur, 12 oct.)
  'aster-eau': {
    aster: 'Quelqu’un dans l’eau. Va l’aider.'
  },
  'aster-caisse': {
    aster: 'Lorena a quelque chose à te dire : va la voir.'
  },
  caisse: {
    caisse: 'Ouvre la caisse de Lorena, avec elle.'
  },
  'longue-vue': {
    aster: 'Lorena cherche où planter son camp : va la voir.'
  },
  recolte: {
    aster: 'Va voir Lorena : elle t’emmène à la Récolte.'
  },
  'premier-ponton': {
    site: 'Le chantier du Ponton : touche-le.',
    build: 'Vingt-cinq bois : bâtis le Ponton.'
  },
  build: 'Touche « Bâtir ».',
  road: 'Touche ce bouton : il ouvre le tracé des chemins.',
  'chemin-aster': {
    cells: 'Touche les cases en pointillés, une à une, du Ponton jusqu’au Feu. Glisse pour bouger l’île ; un appui long puis glisse trace tout un trait.',
    trace: 'Le Ponton rejoint le Feu : touche « Tracer ». Les premières pierres sont offertes.'
  },
  clotures: {
    aster: 'Va voir Lorena : ses piquets t’attendent.',
    reserve: 'Tes clôtures attendent dans la réserve : touche « Poser ».',
    // (la barrière du nord : choix de l'auteur, 19 oct., textes validés)
    cells: 'Plante tes premiers piquets sur les cases dorées, au nord du feu.',
    confirm: 'Touche « Poser ici ».',
    trace: 'Appui long sur une case dorée, puis glisse le long de la ligne : un piquet par case, jusqu’au bout.',
    go: 'La barrière est complète : touche « Valider ».'
  },
  feu: {
    site: 'Le chantier du feu de camp : touche-le.',
    build: 'Quatre bois flottés, deux galets : bâtis le feu de camp.'
  },
  'cannelle-parle': {
    cannelle: 'Agathe a quelque chose à te dire : va la voir.'
  },
  soupe: {
    coquillage: 'Les coquillages sont sur le rivage : touche-en un.',
    bulle: 'Agathe a hâte de recevoir tes ingrédients pour cuisiner avec toi : touche sa bulle.'
  },
  'cage-vue': {
    aster: 'Va voir Lorena : sa longue-vue a repéré quelque chose sur l’eau.'
  },
  cage: {
    cage: 'Ouvre la cage avec Agathe.'
  },
  attraper: {
    poule: 'Touche une poule pour l’attraper.'
  },
  poules: {
    hungry: 'Nourris une poule : sa bulle, deux vivres.'
  },
  poulailler: {
    site: 'Touche le Feu de camp : ses annexes s’y construisent.',
    sheet: 'Touche « Sa fiche ».',
    tab: 'Touche « Annexes ».',
    // (il s'assemble avant de se poser : choix de l'auteur, 15 oct. ; texte validé)
    annex: 'Le Poulailler est offert : touche « Assembler ».',
    cells: 'Touche une case dorée, près du coin d’Agathe.',
    confirm: 'Touche « Poser ici ».'
  },
  // (le jour de Nathan : il sort de la brume, on ne le connaît pas encore ; puis sa lanterne, geste par geste ; choix de
  // l'auteur, 13 oct.)
  'rivet-brume': {
    rivet: 'Quelqu’un sort de la brume : va voir.'
  },
  // (puis son coin, son abri : choix de l'auteur, 18 oct., textes validés ; les gestes du casse-tête, ceux de ses
  // torches et du poulailler d’Agathe)
  deco: {
    coin: 'Le coin de Nathan : touche-le.',
    build: 'Vingt bois, dix pierres : bâtis son abri.',
    rivet: 'Va voir Nathan : son établi t’attend.',
    take: 'Prends cette pièce.',
    turn: 'Touche-la encore : elle tourne.',
    drop: 'Pose-la là, dans le gabarit.',
    done: 'Tout est en place : touche « Assembler ».'
  },
  // Les trois torches de Nathan (choix de l'auteur, 13 oct. ; textes validés), d'un coup (18 oct.)
  'torches-rivet': {
    assemble: 'Choisis « Ce qu’il faut · 3 », puis « Assembler » : trois torches d’un coup, six bois.',
    place: 'Tes torches sont prêtes : touche « Poser ».',
    cells: 'Plante-la sur la case dorée, du côté d’où venaient les égarés.'
  },
  // Son premier outil, à la boutique du Ponton (choix de l'auteur, 18 oct. ; textes validés)
  'outil-rivet': {
    site: 'Touche le Ponton de Lorena.',
    sheet: 'Ouvre sa fiche.',
    tab: 'Onglet « Boutique ».',
    buy: 'La Canne à pêche : touche son prix.'
  },
  'planche-vue': {
    aster: 'Va voir Lorena : elle a vu quelque chose sur la vague.'
  },
  'eveil-ondin': {
    ondin: 'Un enfant dort sur la planche : va le réveiller doucement.',
    wake: 'Touche « Le réveiller » : parle-lui doucement.'
  },
  'puits-ondin': {
    site: 'Le chantier du Puits : touche-le.',
    build: 'Tout est réuni : bâtis le Puits.'
  },
  chemin: {
    cells: 'Touche les cases en pointillés, une à une, du Puits jusqu’au sentier. Glisse pour bouger l’île ; un appui long puis glisse trace tout un trait.',
    trace: 'Le Puits rejoint le Feu : touche « Tracer ». Les premières pierres sont offertes.'
  },
  short: {
    feu: 'Il manque du bois ou des galets pour le feu : ramasse les trouvailles encore visibles sur la plage de Brumelune.',
    soupe: 'Pas assez de vivres pour sa soupe : lance une Récolte, l’île en donne.',
    poules: 'Deux vivres pour nourrir une poule : lance une Récolte, ou ramasse des coquillages sur le rivage.',
    'puits-ondin': 'Il manque de quoi bâtir le Puits : lance une Récolte, l’île en donne.',
    deco: 'Il manque de quoi bâtir l’abri de Nathan : lance une Récolte, l’île en donne.',
    'torches-rivet': 'Il manque du bois pour les torches : lance une Récolte, l’île en donne.',
    'premier-ponton': 'Il manque du bois pour le Ponton : touche Lorena, une autre Récolte en donnera.',
    'abri-cannelle': 'Il manque de quoi bâtir l’abri : lance une Récolte, l’île en donne.'
  },
  // L'abri d’Agathe (choix de l'auteur, 13 oct.)
  'abri-cannelle': {
    coin: 'Le coin d’Agathe : touche-le.',
    build: 'Vingt bois, dix pierres : bâtis son abri.'
  },
  claim: {
    brume: 'Ta récompense t’attend auprès de Brume.',
    sheet: 'Referme cette fiche : Brume t’attend avec ta récompense.',
    harvest: 'Retourne sur l’île : Brume t’attend avec ta récompense.'
  },
  // (les torches de Nathan plantées : en déplacer une, puis la pivoter ; choix de l'auteur, 18 oct., textes validés)
  move: 'Appui long sur une torche : « Déplacer », puis une autre case dorée.',
  pivoter: 'Appui long sur ta torche : « Pivoter ».',
  'souvenir-ondin': {
    ariane: 'Le ruban mène à la page qui manque : la Pluie.',
    why: 'pendant que tu aides Léo',
    // (la page de la Pluie garde ses leurres : l'Encre s'y apprend, avec ce qu'elle coûtera ensuite)
    ink: 'Deux leurres se cachent parmi ces éléments. L’Encre révèle un ingrédient : offerte cette fois, ensuite 50 écus, ou gratuite après trois essais manqués.'
  }
};

// Un onglet qui s'ouvre (App, story.js : sayTab) : la ligne d'aide le montre, après ce qu'en dit Brume (TAB_OPENED)
// (choix de l'auteur, 14 oct. : ecriture/lots/01 et 02)
export const TAB_HELP = {
  world: 'Touche « Île », en bas.',
  sceau: 'Le Sceau garde ce que tu accomplis.',
  timer: 'Les Défis : des énigmes contre le sablier, pour gagner des écus. Touche « Défis » quand tu veux.'
};

// Une ligne d'aide qui suit une réplique de l'île, en annonce (App, story.js : sayPrologue) : ce que la réplique ne dit
// plus de l'interface (choix de l'auteur, 14 oct. : ecriture/lots/02_tutoriel.md)
export const LINE_HELP = {
  'faim-bulle': 'Une bulle au-dessus de quelqu’un dit ce qui lui manque.',
  sentier: 'Les autres chemins, trace-les où tu veux.'
};

// Une ligne d'aide qui suit un souvenir retrouvé, en annonce (WorldView, draw/brume.js : showMemory) : ce que la réplique
// du maître ne dit plus de la règle (choix de l'auteur, 15 oct. : ecriture/lots/04_maitres.md)
export const MEMORY_HELP = {
  bosquet: 'À la Récolte, le bois compte double.'
};

// Une ligne d'aide qui suit une réplique de Brume à un moment clé (texts/guide/tips.js : TIPS ; la clé : celle de la
// réplique), en annonce quand sa bulle s'affiche (App, story.js) : le geste, que Brume ne dit plus (choix de l'auteur,
// 15 oct. : ecriture/lots/05_village.md)
export const TIP_HELP = {
  reach: 'Lis l’énigme, puis dépose les bons éléments dans l’Athanor.',
  fail: 'Les familles notées sur la page montrent la voie ; l’Encre révèle un ingrédient ; le nom se devine lettre par lettre.',
  annexes: 'Fiche du bâtiment, onglet « Annexes » : pose-les toi-même. Ce sont elles qui produisent le plus.',
  friends: 'Bavarde avec eux chaque jour, offre-leur ce qu’ils aiment : un cœur de plus, une histoire de plus. Appui long : leur fiche.',
  savoirs: 'Au premier bavardage du jour, un maître souffle un indice sur une page de son chapitre. Plus vous êtes proches, plus il est précis.',
  // (Brume, ou Maerys si elle est là)
  bestiaire: 'Le Carnet d’explorateur garde le Bestiaire.',
  needs: 'La bulle d’un habitant dit ce qui lui manque. Comblé depuis sa fiche, il travaille mieux (+10 %) ; négligé, moins bien.',
  visitor: 'Un voyageur reste quelques jours, avec une demande (sa bulle dorée). Appui long : sa fiche. Comblé, il paie en écus.',
  expedition: 'À son retour, la terre explorée se dévoile et s’achète. Une seule à la fois : la boussole, en haut à gauche, dit quand.',
  finds: 'Chaque climat a sa trouvaille ; ses gisements repoussent en quelques heures. Le sac, en haut à gauche, la garde à part.',
  games: 'Au palier III, « Jouer » s’ouvre dans la fiche du Ponton, de la Carrière, du Bosquet. Chaque partie rapporte des écus.'
};
