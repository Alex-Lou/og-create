// La marmite de Cannelle (choix de l'auteur, 13 oct. : B4 ; textes validés) : Cannelle ouvre et ferme la scène, la
// consigne dit le geste de chaque temps (game/cooking.js). La fin pose, sans l'expliquer, le goût qu'elle a perdu
// (bible, § 8 : il lui revient à l'acte V)
export const COOKING = {
  title: 'La marmite de Cannelle',
  open: 'Des coquillages, des algues, un fond d’eau de mer… Ce n’est pas la cuisine du bord, mais regarde bien, ma brindille.',
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
  plouf: 'Plouf !',
  fast: 'Doucement !',
  // (l'en-tête : les ingrédients mis, puis les tours, puis le service)
  count: (n, total) => `Cannelle · ${n} / ${total}`,
  turn: (n, total) => `Cannelle · tour ${n} / ${total}`,
  serve: 'Cannelle · servir',
  end: 'Goûte, toi. Moi, je sale toujours trop… à ce qu’on dit.',
  go: 'C’est parti !',
  later: 'Plus tard',
  next: 'Continuer'
};
