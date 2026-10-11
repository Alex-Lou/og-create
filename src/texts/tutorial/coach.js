// Ce que dit la bulle du coach pendant le tutoriel (game/prologue.js : LESSONS, SHORT, CLAIM, les gestes du Grimoire),
// rangé par quête puis par geste ; les gestes communs une seule fois. Le code ne garde que les cibles (où va la main).

export const COACH = {
  book: {
    page: 'Voici la page qui manque : son énigme dit ce qu’il faut mêler. Touche ici les bons éléments, ils iront dans l’Athanor.',
    inked: 'L’Encre a révélé cet ingrédient : touche-le, il va dans l’Athanor.',
    next: 'Encore un : touche-le, il rejoint le premier dans l’Athanor.',
    ink: why => `Son énigme dit ce qu’il faut mêler : touche ces éléments en bas. Bloqué ? L’Encre est offerte ${why} : elle révèle un ingrédient.`,
    plans: {
      feu: plan => `Le feu de camp naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`,
      'puits-ondin': plan => `Le Puits naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Le ruban du Grimoire te montre quoi mêler.`,
      'achat-source': plan => `La Source dort sous la brume : mêle les bons éléments dans l’Athanor pour faire naître « ${plan} », et elle se lèvera. Suis le ruban.`
    },
    why: {
      'achat-source': 'pour la découvrir',
      default: 'pour ce chantier'
    },
    plan: plan => `Ce chantier naît d’un mélange : fais naître « ${plan} » dans l’Athanor. Suis le ruban.`
  },
  fuse: 'Les éléments sont dans l’Athanor : touche « Transmuer ». Si ce n’est pas le bon mélange, l’Athanor te le dit : essaie un autre élément.',
  ramasser: {
    trouvaille: 'La mer a rendu du bois flotté et un galet : touche-en un.',
    ramasser: 'Touche « Ramasser » : il rejoint tes réserves, en haut.'
  },
  sleep: 'Touche Brume pour dormir : elle veille sur le feu.',
  'aster-caisse': {
    aster: 'Touche Aster : elle a quelque chose à te dire.'
  },
  caisse: {
    caisse: 'Touche la caisse d’Aster : ouvrez-la ensemble.'
  },
  'longue-vue': {
    aster: 'Touche Aster : sa longue-vue cherche où planter son camp.'
  },
  recolte: {
    aster: 'Touche Aster : elle t’emmène à la Récolte.'
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
    aster: 'Touche Aster : ses piquets t’attendent.',
    reserve: 'Tes clôtures attendent dans la réserve : touche « Poser ».',
    cells: 'Plante les piquets en travers de leur passage, sur les cases dorées.',
    confirm: 'Touche « Poser ici ».'
  },
  feu: {
    site: 'Le chantier du feu de camp : touche-le.',
    build: 'Quatre bois flottés, deux galets : bâtis le feu de camp.'
  },
  soupe: {
    bulle: 'Cannelle a faim : touche la bulle au-dessus d’elle, tu lui donnes à manger.'
  },
  poules: {
    cage: 'Des caquets, sous les rochers : touche la cage.',
    open: 'Touche « L’ouvrir ».',
    hungry: 'Elles ont faim : touche la bulle d’une poule pour la nourrir (deux vivres). Nourrie, elle pondra.'
  },
  deco: {
    site: 'L’établi est au Foyer : touche-le.',
    sheet: 'Touche « Sa fiche » pour entrer au Foyer.',
    bench: 'L’établi de Rivet : ouvre-le pour assembler ta première création.'
  },
  'achat-source': {
    panneau: 'La Source est juste là : touche son panneau.',
    sheet: 'Touche « Voir le quartier ».',
    buy: 'Touche ce bouton : La Source s’ouvre.'
  },
  'eveil-ondin': {
    ondin: 'Ondin dort contre son rocher : touche-le.',
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
    soupe: 'Pas assez de vivres pour sa soupe : touche la Récolte, l’île en donne.',
    poules: 'Deux vivres pour nourrir une poule : touche la Récolte, ou ramasse des coquillages sur le rivage.',
    'puits-ondin': 'Il manque de quoi bâtir le Puits : touche la Récolte, l’île en donne.',
    'premier-ponton': 'Il manque du bois pour le Ponton : touche Aster, une autre Récolte en donnera.'
  },
  claim: {
    brume: 'Touche Brume : ta récompense t’attend.',
    sheet: 'Referme cette fiche : Brume t’attend avec ta récompense.',
    harvest: 'Retourne sur l’île : Brume t’attend avec ta récompense.'
  },
  move: 'Appui long sur une clôture : « Déplacer », puis une autre case.',
  'souvenir-ondin': {
    ariane: 'Le Puits naît de mélanges, page après page : suis le ruban, il te montre quoi mêler dans l’Athanor.',
    why: 'pendant que tu aides Ondin'
  }
};
