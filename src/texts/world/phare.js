// L'arc du Phare sur l'île (choix de l'auteur, 15 oct. : ecriture/arc_phare.md ; répliques : ecriture/lots/08_charnieres.md,
// validé) : l'objectif de fond dans le Carnet et la fiche de Brume (PhareGoal ; son titre et ses étapes viennent du
// serveur), la Route des feux (WorldView, phare.js : lightFire), ce que disent les lieux quand leur feu se rallume.

// L'objectif de fond (Hud : PhareGoal) : au-dessus de son titre ; l'acte en cours
export const PHARE_GOAL = {
  eyebrow: 'Objectif de fond',
  act: act => `Objectif de fond · Acte ${act}`
};

// La Route des feux : le geste sur un lieu découvert (sa bulle, gestures.js), et l'annonce
export const FIRE = {
  action: 'Rallumer le feu',
  done: name => `Un feu brûle de nouveau : ${name}.`
};

// Ce que disent les lieux quand leur feu se rallume (lot 08, § 7.2) : [{ who, text }] par lieu ; who : un bâtiment (le
// maître qui parle, world/faces.js), 'brume', ou un nom écrit (un carnet). before / after : deux variantes, selon
// l'acte fini qui les sépare (act)
export const FIRE_LINES = {
  grotte: [{ who: 'brume', text: 'Dans la glace… une lumière qui tombe.' }],
  lac: [{ who: 'brume', text: 'Dans la glace… une lumière qui tombe.' }],
  col: [{ who: 'ponton', text: 'Rouge, blanc, rouge : « passe fermée ». Ma grand-mère m’avait appris ces signaux. Je croyais qu’elle les inventait.' }],
  arche: [{ who: 'ponton', text: 'La passe. Les navires entraient par là, sous l’arche. Quelqu’un leur montrait le chemin, dans la brume.' }],
  saule: {
    act: 'VII',
    before: [{ who: 'brume', text: 'Pas par là. … Je ne sais pas pourquoi. Pas encore.' }],
    after: [{ who: 'brume', text: 'C’est là que je me suis cachée. Sa lanterne. Elle ne savait pas qu’elle me sauvait.' }]
  },
  pilotis: [{ who: 'Le carnet du pêcheur', text: '« Cette nuit-là, une étoile est tombée au large. Le phare a clignoté, puis plus rien. Je n’ai plus jamais pêché là-bas. »' }],
  oasis: [{ who: 'puits', text: 'Chut. Toutes les étoiles sont dans l’eau. Quand le phare dormait, ils lisaient la route là-dedans.' }],
  pyramide: [
    { who: 'carriere', text: 'Hm.' },
    { who: 'brume', text: 'Il dit qu’ils sont arrivés naufragés, comme nous. Et qu’ils sont restés.' }
  ],
  arbre: [{ who: 'ponton', text: 'Une vigie. D’ici, on voyait les voiles avant la brume. Il suffisait de crier.' }],
  cascade: {
    act: 'VI',
    before: [{ who: 'brume', text: 'J’aime cet endroit. Je ne sais pas pourquoi.' }],
    after: [{ who: 'brume', text: 'C’est ici que je naissais, chaque matin. Je montais avec l’eau, et je couvrais l’île.' }]
  },
  geyser: [{ who: 'atelier', text: 'Les Anciens ont essayé le feu de la terre, pour leur phare. Des tuyaux partout. Ça s’est éteint aussi.' }]
};

// Le premier feu de la route rallumé, ailleurs que sur la plage (lot 08, § 7.1 : Brumelune) : Brume s'en souvient
export const FIRST_FIRE = { who: 'brume', text: 'Notre feu était le premier de la route. On l’allumait pour ceux que la mer rejetait… je crois.' };

// Les répliques de l'arc sur l'île (lot 08, validé ; leurs moments : choix de l'auteur, 15 oct.), deux bulles au plus à
// chaque fois. who : un bâtiment (le maître qui parle), 'brume', un nom écrit (le Passeur, un journal) ; aside : une
// didascalie (une bulle en italique, sans locuteur). Une fois par appareil, comme toutes les répliques (game/guide.js).
// quests : à la réclamation d'une quête ; levels : quand un bâtiment atteint ce palier ; zones : quand le quartier est
// acheté
export const ARC_LINES = {
  quests: {
    // (§ 2.1 : la première lanterne ; La Lisière, § 7.1)
    lanterne: [
      { who: 'ponton', text: 'La première. Ma grand-mère disait qu’on allume toujours la plus petite d’abord. En attendant le phare.' },
      { who: 'bosquet', text: 'Il y en a de vieilles, dans les branches. Pour les bêtes perdues. Celle-là ne mord pas. Je veux bien.' }
    ],
    // (§ 2.2 : la rune de la tour, sur les pierres de la Colline)
    carriere: [
      { who: 'carriere', text: 'Hm.' },
      { who: 'brume', text: 'La même rune, partout : une tour, et un œil ouvert. Il dit qu’ils veillaient.' }
    ],
    // (§ 2.3 : les Hauteurs, avec l'Étoile)
    hauteurs: [
      { who: 'ponton', text: 'Je la vois. La porte est close, avec une serrure de pierre au milieu. Quelqu’un a fermé à clé en partant.' },
      { who: 'brume', text: 'Fermée à clé. On ferme quand on compte revenir… non ?' }
    ],
    // (§ 7.1 : Le Faubourg, la forge des Anciens)
    atelier: [{ who: 'atelier', text: 'Un moule, dans les cendres. Une monture ronde, grande comme une roue. Pour quoi faire, hein ? … Je le garde.' }],
    // (§ 7.1 : La Crique, le fanal du Ponton)
    'ponton-aster': [{ who: 'ponton', text: 'Un fanal, au bout du ponton. Quand on part, il faut une lumière pour revenir.' }],
    // (§ 7.1 : Le Hameau, une fenêtre rallumée, une page retrouvée)
    hameau: [
      { who: 'Le journal d’Héliane', text: '« Troisième veille de la semaine. La lampe a bu toute l’huile, et moi tout le thé. — H. »' },
      { who: 'brume', text: 'Elle veillait sur le phare. Toutes les nuits.' }
    ],
    // (§ 7.1 : L'Îlot aux Mouettes, en y arrivant)
    phare: [{ who: 'ponton', text: 'Les mouettes n’ont pas peur de nous. On dirait qu’elles attendaient quelqu’un.' }],
    // (§ 7.2 : La Lande aux Menhirs, la clé ; l'intérieur du phare suit, scène « phare »)
    cle: [{ who: 'puits', text: 'Chut… Elle tire. Sous celle-là. Quelque chose de froid, et de lourd.' }],
    // (§ 9, point 3 : le moment du choix ; personne ne monte)
    'ile-legendes': [
      { who: 'Le Passeur', text: 'Une seule traversée. Monte, ou reste.' },
      { who: 'ponton', text: 'La mer peut attendre.' }
    ]
  },
  levels: {
    // (§ 7.1 : La Colline, la Mine de cristal, palier VI de la Carrière)
    carriere: {
      level: 6,
      lines: [
        { who: 'carriere', text: 'Hm.' },
        { who: 'brume', text: 'Le cristal renvoyait la lumière du phare jusqu’ici. Il dit que la pierre de sa grand-mère chantait pareil.' }
      ]
    },
    // (§ 7.1 : Les Jardins, le jardin de lune, palier III du Potager)
    potager: {
      level: 3,
      lines: [{ who: 'potager', text: 'Elles luisent, la nuit. Ma grand-mère disait que c’était une affaire de famille. Je n’avais jamais compris.' }]
    }
  },
  zones: {
    // (§ 7.1 : La Grande Forêt, l'allée de lanternes ; Freya parle tout bas)
    foret: [
      { who: 'bosquet', text: 'L’allée mène aux pierres dressées. Avant, on y venait la nuit. Pour chanter. Pour Elle.' },
      { who: 'brume', text: '… Je connais cet air. Je ne sais pas d’où.' }
    ],
    // (§ 7.2 : Le Cratère, en y arrivant)
    cratere: [
      { who: 'brume', text: 'Ne restons pas ici.' },
      { aside: true, text: '(Rien ne s’allume. La brume, ici, ne recule pas.)' }
    ]
  }
};

// La lanterne du Passeur (§ 7.1 : L'Île des Légendes) : au premier toucher de sa barque, après le moment du choix
export const PASSEUR_LANTERN = { who: 'Le Passeur', text: 'Ma lanterne mènera qui voudra partir. Elle ne ramènera personne.' };

// La question de Brume (§ 4), le soir de la veillée V, près du feu : elle demande ; tu ne réponds pas
export const PHARE_QUESTION = [
  { who: 'brume', text: 'Si le phare brille… tu partiras ?' },
  { aside: true, text: '(Tu ne réponds pas.)' }
];
