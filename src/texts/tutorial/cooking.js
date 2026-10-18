// La marmite d’Agathe (choix de l'auteur, 13 oct. : B4 ; refaite le 18 oct. en quatre gestes ; textes validés) : Agathe
// ouvre et ferme la scène, la consigne dit le geste de chaque temps (game/cooking.js). La fin pose, sans l'expliquer, le
// goût qu'elle a perdu (bible, § 8 : il lui revient à l'acte V)
export const COOKING = {
  title: 'La marmite d’Agathe',
  open: 'Des coquillages, des algues, un fond d’eau de mer… Ce n’est pas la cuisine du bord. Mais regarde bien, et retiens.',
  rule: {
    verser: 'Glisse le seau au-dessus de la marmite et garde-le : l’eau coule jusqu’au trait doré.',
    jeter: 'Glisse chaque ingrédient dans la marmite.',
    touiller: 'Touille : fais tourner ton doigt sur la marmite, sans te presser.',
    servir: 'Plonge la louche, porte-la au-dessus du bol et garde-la : la soupe coule.'
  },
  // (le joueur n'a encore rien fait de ce temps : la main montre le geste)
  hint: {
    verser: 'Garde-le',
    jeter: 'Glisse',
    touiller: 'Tourne',
    servir: 'Garde-la'
  },
  items: {
    coquillages: 'Coquillages',
    algues: 'Algues',
    eau: 'Eau de mer'
  },
  // (un bruit de mini-jeu, gardé : choix de l'auteur, 15 oct., décision 23)
  plouf: 'Plouf !',
  fast: 'Doucement !',
  // (l'en-tête : l'eau, les ingrédients mis, puis les tours, puis le service)
  water: 'Agathe · l’eau',
  count: (n, total) => `Agathe · ${n} / ${total}`,
  turn: (n, total) => `Agathe · tour ${n} / ${total}`,
  serve: 'Agathe · servir',
  // Les trois étoiles de la fin (game/cooking.js : starsOf)
  stars: { line: 'Pile au trait', gentle: 'Sans éclabousser', clean: 'Sans en perdre une goutte' },
  end: 'Goûte, toi. Moi, je sale toujours un peu plus… On n’est jamais certain.',
  go: 'Commencer',
  later: 'Plus tard',
  next: 'Continuer'
};
