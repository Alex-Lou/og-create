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
      feu: plan => `Le feu de camp naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`,
      'puits-ondin': plan => `Le Puits naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`
    },
    why: {
      default: 'pour ce chantier',
      // (le Brasier, Feu + Feu : pas d'Encre, l'énigme suffit)
      feu: null
    },
    plan: plan => `Ce chantier naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Suis le ruban.`
  },
  fuse: 'Les éléments sont dans l’Athanor : touche « Transmuer ». Si ce n’est pas le bon mélange, l’Athanor te le dit : essaie un autre élément.',
  ramasser: {
    trouvaille: 'La mer a rendu du bois flotté et un galet : touche-en un.',
    ramasser: 'Touche « Ramasser » : il rejoint tes réserves, en haut.'
  },
  sleep: 'Touche Brume pour dormir : elle veille sur le feu.',
  // (elle nage au pied de son Ponton : on ne la connaît pas encore ; choix de l'auteur, 12 oct.)
  'aster-eau': {
    aster: 'Quelqu’un dans l’eau ! Va l’aider.'
  },
  'aster-caisse': {
    aster: 'Aster a quelque chose à te dire : va la voir.'
  },
  caisse: {
    caisse: 'Ouvre la caisse d’Aster, avec elle.'
  },
  'longue-vue': {
    aster: 'Aster cherche où planter son camp : va la voir.'
  },
  recolte: {
    aster: 'Va voir Aster : elle t’emmène à la Récolte.'
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
    aster: 'Va voir Aster : ses piquets t’attendent.',
    reserve: 'Tes clôtures attendent dans la réserve : touche « Poser ».',
    cells: 'Plante tes premiers piquets sur les cases dorées, autour du feu.',
    confirm: 'Touche « Poser ici ».',
    trace: 'Appui long sur une case dorée, puis glisse le long de l’anneau : un piquet par case, jusqu’à boucler l’enclos.',
    go: 'L’enclos est bouclé : touche « Poser ».'
  },
  feu: {
    site: 'Le chantier du feu de camp : touche-le.',
    build: 'Quatre bois flottés, deux galets : bâtis le feu de camp.'
  },
  'cannelle-parle': {
    cannelle: 'Cannelle a quelque chose à te dire : va la voir.'
  },
  soupe: {
    coquillage: 'Les coquillages sont sur le rivage : touche-en un.',
    bulle: 'Cannelle a faim : sa bulle, au-dessus d’elle, lui donne à manger.'
  },
  'cage-vue': {
    aster: 'Va voir Aster : sa longue-vue a repéré quelque chose sur l’eau.'
  },
  cage: {
    cage: 'Ouvre la cage avec Cannelle.'
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
    annex: 'Le Poulailler est offert : touche « Poser ».',
    cells: 'Touche une case dorée, près du coin de Cannelle.',
    confirm: 'Touche « Poser ici ».'
  },
  // (le jour de Rivet : il sort de la brume, on ne le connaît pas encore ; puis sa lanterne, geste par geste ; choix de
  // l'auteur, 13 oct.)
  'rivet-brume': {
    rivet: 'Quelqu’un sort de la brume : va voir.'
  },
  deco: {
    rivet: 'Va voir Rivet : son établi t’attend.',
    assemble: 'Assemble la Lanterne : six bois, six pierres.',
    take: 'Prends cette pièce.',
    turn: 'Touche-la encore : elle tourne.',
    drop: 'Pose-la là, dans le gabarit.',
    done: 'Tout est en place : touche « Assembler ».',
    place: 'Ta lanterne est prête : touche « Poser ».',
    cells: 'Pose-la au bord du chemin, près du feu, sur une case dorée.'
  },
  'eveil-ondin': {
    ondin: 'Ondin dort contre son rocher : va le réveiller doucement.',
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
    deco: 'Il manque de quoi assembler la Lanterne : lance une Récolte, l’île en donne.',
    'premier-ponton': 'Il manque du bois pour le Ponton : touche Aster, une autre Récolte en donnera.',
    'abri-cannelle': 'Il manque de quoi bâtir l’abri : lance une Récolte, l’île en donne.',
    'enclos-cannelle': 'Il manque du bois pour l’enclos : lance une Récolte, l’île en donne.'
  },
  // L'abri de Cannelle, puis son enclos (choix de l'auteur, 13 oct.)
  'abri-cannelle': {
    coin: 'Le coin de Cannelle : touche-le.',
    build: 'Vingt bois, dix pierres : bâtis son abri.'
  },
  'enclos-cannelle': {
    cannelle: 'Va voir Cannelle : son enclos t’attend.',
    trace: 'Touche « Tracer » : les piquets se fabriquent en passant.',
    glide: 'Appui long sur une case dorée, puis glisse autour de son coin.'
  },
  claim: {
    brume: 'Ta récompense t’attend auprès de Brume.',
    sheet: 'Referme cette fiche : Brume t’attend avec ta récompense.',
    harvest: 'Retourne sur l’île : Brume t’attend avec ta récompense.'
  },
  move: 'Appui long sur une clôture : « Déplacer », puis une autre case.',
  'souvenir-ondin': {
    ariane: 'Le ruban mène à la page qui manque : la Pluie.',
    why: 'pendant que tu aides Ondin',
    // (la page de la Pluie garde ses leurres : l'Encre s'y apprend, avec ce qu'elle coûtera ensuite)
    ink: 'Deux leurres se cachent parmi ces éléments. L’Encre révèle un ingrédient : offerte cette fois, ensuite 50 écus, ou gratuite après trois essais manqués.'
  }
};
