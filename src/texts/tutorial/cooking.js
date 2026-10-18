// La marmite d’Agathe (choix de l'auteur, 13 oct. : B4 ; textes validés) : Agathe ouvre et ferme la scène, la
// consigne dit le geste de chaque temps (game/cooking.js). La fin pose, sans l'expliquer, le goût qu'elle a perdu
// (bible, § 8 : il lui revient à l'acte V)
export const COOKING = {
  title: 'La marmite d’Agathe',
  open: 'Des coquillages, des algues, un fond d’eau de mer… Ce n’est pas la cuisine du bord. Mais regarde bien, et retiens.',
  rule: {
    mettre: 'Glisse chaque ingrédient dans la marmite.',
    touiller: 'Touille : fais tourner ton doigt sur la marmite, sans te presser.',
    servir: 'Glisse la louche jusqu’au bol.'
  },
  // (le joueur n'a encore rien fait de ce temps : la main montre le geste)
  hint: {
    mettre: 'Glisse',
    touiller: 'Tourne',
    servir: 'Jusqu’au bol'
  },
  items: {
    coquillages: 'Coquillages',
    algues: 'Algues',
    eau: 'Eau de mer'
  },
  // (un bruit de mini-jeu, gardé : choix de l'auteur, 15 oct., décision 23)
  plouf: 'Plouf !',
  fast: 'Doucement !',
  // (l'en-tête : les ingrédients mis, puis les tours, puis le service)
  count: (n, total) => `Agathe · ${n} / ${total}`,
  turn: (n, total) => `Agathe · tour ${n} / ${total}`,
  serve: 'Agathe · servir',
  end: 'Goûte, toi. Moi, je sale toujours un peu plus… On n’est jamais certain.',
  go: 'Commencer',
  later: 'Plus tard',
  next: 'Continuer'
};
