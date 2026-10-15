// Les veillées (game/vigils.js) : le récit de chaque veillée autour du feu, les liens entre naufragés, les rites, les
// répliques propres à chaque acte et la finale du Phare. Les noms des liens, les recettes, les étapes de civilisation et
// qui parle restent dans le code (des libellés) : la clé dit qui parle.
export const VIGILS = {
  // L'ouverture de chaque veillée
  open: 'La nuit, le feu du Foyer. La troupe se rassemble en cercle ; Brume veille au-dessus.',
  // Les liens (§ 6.9), par lien : ce qui se passe
  links: {
    vie: 'Les quatre mains au-dessus du feu.',
    soupe: 'Agathe gronde Léo parce qu’il dort debout ; il lui promet l’eau la plus claire de l’île.',
    bois: 'Freya refuse qu’on coupe ses arbres ; Saturnin lui montre le bois mort et le métal qui l’aide : l’Abri tient.',
    flamme: 'Freya a peur du feu ; Agathe lui montre le feu qui nourrit.',
    enclume: 'Jovin forge le premier vrai ciseau de Saturnin.',
    fruit: 'La forêt et le jardin plantent ensemble.',
    nager: 'Léo a peur de l’eau profonde ; Lorena lui apprend.',
    tablee: 'Une table pour tous ; on y choisit le nom du peuple.',
    pardon: 'Chacun tend son Souffle vers Brume.'
  },
  // Les répliques d'un lien, dans l'ordre (vie : Brume ; enclume : Saturnin, puis Brume ; pardon : tous). Les autres liens
  // se jouent aussi, en quelques répliques ; leur phrase reste comme légende (choix de l'auteur, 15 oct. :
  // ecriture/lots/04_maitres.md)
  linkLines: {
    vieBrume: 'Lorena, Léo, Agathe, Jovin. Air, Eau, Feu, Terre. Ensemble… la Vie.',
    soupeAgathe: 'Léo. Tu dors debout.',
    soupeLeo: 'Je ne dors pas. J’écoute l’eau.',
    soupeLeoSource: 'Demain, je te trouverai l’eau la plus claire de l’île. Pour ta soupe.',
    soupeAgatheNuit: '… Va dormir, mon caneton.',
    flammeAgathe: 'Approche. Il ne mord pas. Il cuit.',
    flammeFreya: 'Ma forêt, il l’a mangée.',
    flammeAgatheBol: 'Celui-là, il nourrit. (Elle lui tend un bol.)',
    flammeRecit: '(Freya le prend, sans regarder les flammes.)',
    boisFreya: 'On ne coupe pas mes arbres.',
    boisSaturnin: 'Hm.',
    boisFreyaMorte: '… Celle-là est morte depuis l’hiver.',
    boisSaturninFinie: 'Hm. Morte. Pas finie.',
    enclumeSaturnin: 'Hm.',
    enclumeBrume: 'Il dit merci.',
    fruitFlore: 'Ton arbre a des fleurs. Mon jardin a des abeilles. Tu crois qu’ils se connaissent ?',
    fruitFreya: 'Pas encore.',
    fruitFloreLune: 'Chaque chose en sa lune. Celle-ci est la bonne.',
    nagerLeo: 'L’eau profonde, elle ne me parle pas. Elle se tait.',
    nagerLorena: 'Alors on va lui parler, nous. Donne-moi la main.',
    nagerLeoMain: 'Tu ne me lâches pas ?',
    nagerLorenaJamais: 'Jamais.',
    tableeAgathe: 'Une table. Douze places, comme à mon auberge. On en ajoutera.',
    tableeLorena: 'Il lui faudrait un nom, à cette table.',
    tableeFlore: 'À ce peuple, plutôt. Non ?',
    pardonTous: 'Ta flamme, notre vie.'
  },
  // Le rite de chaque veillée qui en a un (§ 10)
  rites: {
    I: 'La première lanterne s’allume, et la brume recule d’un cran sur toute la côte.',
    II: 'L’orage gronde, l’Abri tient. Saturnin grave sa première rune sur une pierre du foyer, qui chante.',
    IV: 'Lorena siffle, le vent tourne, et les voiles des voyageurs se gonflent.',
    VII: 'Un navire perdu voit la lumière et accoste : de nouveaux naufragés, cette fois accueillis.'
  },
  // Les répliques propres à chaque veillée, dans l'ordre (récit : sans personne qui parle). {peuple} : le nom du peuple
  lines: {
    I: { brume: 'Une. Hier, il n’y en avait aucune.', brumeToutes: 'Allumons-les toutes. Que la mer sache qu’on est là.' },
    III: { flore: 'Deux naufrages en une saison. Et des naufragés d’avant, qui vivaient déjà là. Ça ne vous étonne pas ?', recit: 'Brume baisse les yeux.' },
    V: { recit: 'Les autres t’appellent « Alchimiste ».', agathe: 'Du sel ! Je sens le sel !' },
    VI: { lorena: 'Moi aussi, je croyais que c’était ma faute.', recit: 'Freya, qui avait peur du feu, allume la flamme.', phenix: 'Phénix : Brume renaît, plus vive que jamais.' },
    VII: { brume: 'La brume s’est levée. {peuple} veille sur la mer.' }
  },
  // La finale (§ 10, acte VII) : le Phare de Brume s'allume ; à la fin, Brume parle
  finale: {
    phare: 'Tout en haut du phare, Jovin monte la lentille. « Clic. Elle tient. »',
    reflet: 'Léo se penche sur l’eau. Dans le reflet, il voit le vrai visage de Brume.',
    soleil: 'Brume entre dans la lanterne et devient le soleil du phare. La brume se lève sur l’île et sur la mer.',
    flammeche: 'Une petite flamme se détache de la lanterne et revient tout près de toi.',
    brume: 'Je reste avec toi.'
  }
};
