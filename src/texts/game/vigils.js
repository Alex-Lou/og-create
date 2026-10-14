// Les veillées (game/vigils.js) : le récit de chaque veillée autour du feu, les liens entre naufragés, les rites, les
// répliques propres à chaque acte et la finale du Phare. Les noms des liens, les recettes, les étapes de civilisation et
// qui parle restent dans le code (des libellés) : la clé dit qui parle.
export const VIGILS = {
  // L'ouverture de chaque veillée
  open: 'La nuit, le feu du Foyer. La troupe se rassemble en cercle ; Brume veille au-dessus.',
  // Les liens (§ 6.9), par lien : ce qui se passe
  links: {
    vie: 'Les quatre mains au-dessus du feu.',
    soupe: 'Marcelle gronde Pierrot parce qu’il dort debout ; il lui promet l’eau la plus claire de l’île.',
    bois: 'Freya refuse qu’on coupe ses arbres ; Saturnin lui montre le bois mort et le métal qui l’aide : l’Abri tient.',
    flamme: 'Freya a peur du feu ; Marcelle lui montre le feu qui nourrit.',
    enclume: 'Jovin forge le premier vrai ciseau de Saturnin.',
    fruit: 'La forêt et le jardin plantent ensemble.',
    nager: 'Pierrot a peur de l’eau profonde ; Hermine lui apprend.',
    tablee: 'Une table pour tous ; on y choisit le nom du peuple.',
    pardon: 'Chacun tend son Souffle vers Brume.'
  },
  // Les répliques d'un lien (vie : Brume ; enclume : Saturnin, puis Brume ; pardon : tous)
  linkLines: {
    vieBrume: 'Hermine, Pierrot, Marcelle, Jovin. Air, Eau, Feu, Terre. Ensemble… la Vie.',
    enclumeSaturnin: 'Hm.',
    enclumeBrume: 'Il dit merci.',
    pardonTous: 'Ta flamme, notre vie.'
  },
  // Le rite de chaque veillée qui en a un (§ 10)
  rites: {
    I: 'La première lanterne s’allume, et la brume recule d’un cran sur toute la côte.',
    II: 'L’orage gronde, l’Abri tient. Saturnin grave sa première rune sur une pierre du foyer, qui chante.',
    IV: 'Hermine siffle, le vent tourne, et les voiles des voyageurs se gonflent.',
    VII: 'Un navire perdu voit la lumière et accoste : de nouveaux naufragés, cette fois accueillis.'
  },
  // Les répliques propres à chaque veillée, dans l'ordre (récit : sans personne qui parle). {peuple} : le nom du peuple
  lines: {
    I: { brume: 'Chaque lumière repousse la brume. Allumons-les toutes.' },
    III: { flore: 'Trois naufrages en une saison… Il y a quelque chose, avec cette île.', recit: 'Brume baisse les yeux.' },
    V: { recit: 'Les autres t’appellent « Alchimiste ».', marcelle: 'Du sel ! Je sens le sel !' },
    VI: { hermine: 'Moi aussi, je croyais que c’était ma faute.', recit: 'Freya, qui avait peur du feu, allume la flamme.', phenix: 'Phénix : Brume renaît, plus vive que jamais.' },
    VII: { brume: 'La brume s’est levée. {peuple} veille sur la mer.' }
  },
  // La finale (§ 10, acte VII) : le Phare de Brume s'allume ; à la fin, Brume parle
  finale: {
    phare: 'Tout en haut du phare, Jovin monte la lentille. « Tac ! Elle tient. »',
    reflet: 'Pierrot se penche sur l’eau. Dans le reflet, il voit le vrai visage de Brume.',
    soleil: 'Brume entre dans la lanterne et devient le soleil du phare. La brume se lève sur l’île et sur la mer.',
    flammeche: 'Une petite flamme se détache de la lanterne et revient tout près de toi.',
    brume: 'Je reste avec toi.'
  }
};
