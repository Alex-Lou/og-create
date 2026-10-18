// L'amitié des habitants (world/friends.js) : ce qu'ils disent quand on bavarde avec eux, selon leurs cœurs (0 à 5),
// et quand on leur offre un cadeau ; les visiteurs installés. Leurs voix et leur passé, raconté cœur après cœur, suivent
// la bible (HISTOIRE.md, § 8.2). Clés : le bâtiment où chacun travaille (serveur : services/villagers.js).

export const TALKS = {
  // Maggy, jardinière des lunes : calme, répond par des questions, parle des plantes comme de personnes
  potager: [
    'Une graine, ça a de la mémoire. Plus que nous.',
    'Le jardin de ma grand-mère avait des fèves boudeuses. Tu savais que les fèves boudent ?',
    'Cette boîte ? Des graines. Elles attendent depuis longtemps. Elles savent pourquoi, elles.',
    'Certaines de mes graines ne ressemblent à rien de connu. Pourtant, ici, elles se sentent chez elles. Curieux, non ?',
    'La nuit, je parle à la lune. Elle ne répond pas. Les radis, si. Tu veux savoir ce qu’ils disent ?',
    'Je suis revenue planter ici ce qui en était parti.'
  ],
  // Robby, tailleur de runes : « Hm. », et Brume traduit
  carriere: [
    'Hm. (Brume : « Il dit bonjour. Je crois. »)',
    'Hm. Mon village avait une carrière. J’y ai taillé des marches. Cinquante ans. Hm. Belles marches.',
    'Ma grand-mère avait une pierre qui chantait. Je la cherche. Hm. Pas pressé.',
    'Pourquoi je parle peu ? Hm. Les mots s’usent. La pierre, non.',
    'Ma femme parlait pour deux. Depuis, je me tais pour deux. Hm.',
    // (Saturnin devenu Robby, choix de l'auteur, 15 oct. : son petit nom suit ; texte validé)
    'Robby. Ma grand-mère disait « Rob ». Personne d’autre. Hm.'
  ],
  // Maerys, gardienne des bois : sa grammaire revient avec les cœurs
  bosquet: [
    'Chut. Les arbres se réveillent. Tu entends ?',
    'Ma forêt était grande. Les arbres y parlaient. Toi, tu écoutes un peu, déjà.',
    'Ma forêt a brûlé. J’ai couru jusqu’à la mer. (Elle ne regarde pas le feu.)',
    'J’ai fait un radeau de bois flotté. Il s’est cassé ici. Les arbres de l’île m’ont attrapée.',
    'Les gens font du bruit. Ils coupent, ils brûlent. (Un temps.) Toi, tu écoutes.',
    'Ici, c’est ma forêt. Et vous, ma meute.'
  ],
  // Léo, petit sourcier : chuchote, raconte ses rêves comme s'ils étaient vrais
  puits: [
    // (son réveil a sa propre réplique : choix de l'auteur, 18 oct.)
    'Tatie dit que je dors debout. Moi, je dis que j’écoute.',
    'Cette nuit, j’ai rêvé que la mer était un grand bain. Les poissons me prêtaient leurs bulles. C’était vrai, je crois.',
    'La lune m’a parlé, cette nuit. Elle dit que tu ne dors pas. Je ne lui ai pas répondu non plus.',
    'J’ai peur de l’eau profonde. C’est bête, pour un sourcier. Lorena dit que c’est normal. Elle aussi, des fois.',
    'Mes parents m’attendent de l’autre côté de la mer. Quand ma baguette tremble vers l’ouest, je crois que c’est eux.',
    'Je trouverai toujours ce que tu as perdu.'
  ],
  // Lorena, navigatrice : phrases courtes, pleines de marine ; elle nomme les nuages
  ponton: [
    'Ce nuage-là, ma grand-mère l’appelait le Voleur. Il prend la lumière et il la garde. Pluie avant midi.',
    'Ma grand-mère gardait un phare. Elle m’a appris les vents. Celui-ci, c’est Zéphyr : il ment toujours un peu.',
    'Je voulais faire le tour du monde. Cap à l’ouest, toujours. L’île n’était pas sur ma route. … Elle y est, maintenant.',
    'Il y a des années, une brume m’a pris quelqu’un. Je t’en parlerai. Pas aujourd’hui.',
    'J’étais de quart, cette nuit-là. La brume est venue d’un coup. (Elle regarde ses mains.) Je ne tiens plus une barre.',
    'Par tous les alizés… Je reste. La mer peut attendre.'
  ],
  // Nathan, horloger-artificier : s'interrompt pour une idée, jeux de mots à plat ; « clic », rarement, quand une pièce
  // s'emboîte vraiment (choix de l'auteur, 14 oct. : décision 16)
  atelier: [
    'Montre-moi tes mains. … Des mains d’horloger. Il ne leur manque que la patience.',
    'Enfant, j’ai réparé l’horloge de mon village. Elle avançait de dix minutes. Moi aussi, j’avance. … Non ?',
    'Mes automates servaient le thé. Attends… Non. Si. Ils le renversaient aussi. Mais avec élégance.',
    'Un de mes automates a mis le feu à mon atelier. Depuis, je n’ose plus rien faire de grand. Juste des vis.',
    'Je suis parti quand plus personne n’a osé me confier une horloge. Ici, tu me confies tout.',
    'Presque tout peut se réparer. Même moi.'
  ],
  // Agathe, cuisinière-guérisseuse : proverbes de cuisine inventés ; un surnom par personne, et rare (choix de l'auteur,
  // 14 oct. : décision 17)
  foyer: [
    'Tu as mangé ? Non ? Ce qui mijote ne se presse pas. Toi, si : assieds-toi.',
    'J’avais une auberge sur un port. Douze tables, une marmite, et des marins qui chantaient faux. Tu aurais aimé.',
    'Mon Léo, je l’emmenais chez ses parents, de l’autre côté de la mer. Ils l’attendent. En attendant, je le garde au chaud.',
    'Toute ma vie, j’ai eu peur des feux follets. Et voilà que j’en aime un. Brume, tu manges, toi ?',
    'Un secret, ma brindille. Depuis le naufrage, je ne sens plus le goût de rien. Chut, pas un mot.',
    'Une cuillère pour le corps, une pour l’âme… et une pour toi.'
  ]
};
// Ce qu'ils disent d'un cadeau qu'ils adorent, qu'ils aiment, ou d'un autre : une phrase par maître, et la phrase
// commune (common) pour les voyageurs installés (choix de l'auteur, 15 oct. : ecriture/lots/04_maitres.md)
export const LOVED = {
  potager: 'De l’eau de pluie ? Mes laitues vont te remercier elles-mêmes. Écoute-les.',
  carriere: 'Hm ! (Brume : « Il dit que c’est son plat préféré. ») Hm.',
  bosquet: 'De l’eau. Les arbres vont boire. … Merci.',
  puits: 'De l’eau ! Chut… elle dit merci. Moi aussi.',
  ponton: 'Du bois ! Par tous les alizés, de quoi radouber ma barque.',
  atelier: 'De la pierre ! Attends… Non. Si. Une meule pour mes engrenages.',
  foyer: 'Des provisions ! Ce qui se partage ne se perd pas. Merci.'
};
export const LIKED = {
  potager: 'Merci. Je vais lui trouver une place. Tout a sa place, même ce qu’on n’attendait pas.',
  carriere: 'Hm. (Brume : « Il dit merci. Vraiment. »)',
  bosquet: 'Pour moi ? … Merci.',
  puits: 'Merci. Je le mettrai à côté de mon bocal.',
  ponton: 'Merci ! Ça ira dans la caisse. Tout finit dans la caisse.',
  atelier: 'Merci ! Je ne sais pas encore à quoi ça sert. C’est le meilleur moment.',
  foyer: 'Merci. Ça ira dans la soupe. Tout va dans la soupe.',
  common: 'Merci. C’est gentil d’avoir pensé à moi.'
};
export const OTHER = {
  potager: 'Curieux cadeau. J’aime les choses curieuses.',
  carriere: 'Hm ? (Brume : « Il se demande ce qu’il va en faire. Il te remercie quand même. »)',
  bosquet: '… Merci. (Elle le pose sans savoir quoi en faire.)',
  puits: 'C’est pour moi ? Je vais le montrer à la lune.',
  ponton: 'Ça ? Bon. On trouvera bien à quoi ça sert, en mer.',
  atelier: 'Je vais le démonter. Pour comprendre. Tu ne m’en veux pas ?',
  foyer: 'C’est l’intention qui compte. L’intention, ça ne se mange pas, mais je la garde.',
  common: 'Pour moi ? Merci.'
};

// Visiteurs installés (id 'v<n>') : ce qu'ils disent selon les cœurs (ils vouvoient : des inconnus qui parlent au
// peuple ; choix de l'auteur, 15 oct. : ecriture/lots/05_village.md)
export const SETTLER_TALKS = [
  'La porte grince. Je ne la répare pas : ça me rappelle que j’en ai une.',
  'J’ai défait une valise. Rien que ça, pour moi, c’est rester.',
  'Je devais repartir au printemps. Il est passé, le printemps.',
  'Le soir, je compte vos lanternes depuis ma fenêtre. Il y en a toujours une de plus.',
  'On m’a gardé une place. Personne ne m’avait jamais gardé une place.',
  'Si un jour je repars, je dirai que j’ai vécu ici. Pas que j’ai fait escale.'
];
