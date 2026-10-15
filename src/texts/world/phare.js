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
