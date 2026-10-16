// Les paroles du village (world/village.js) : ce que disent les habitants qu'on touche, les poules d’Agathe, les
// cris des bêtes de la ferme et le nom de chaque bête avec sa fiche courte ; Agathe quand sa cage s'ouvre, Anya qui
// a déjà soufflé.

// Paroles des habitants (toucher), par métier et selon le moment
export const WORK_LINES = {
  potager: ['Chaque chose en sa lune. Les carottes aussi.', 'Les courges ne se parlent plus depuis mardi. Tu sais ce qu’elles ont ?'],
  carriere: ['Hm.', 'Hm. Belle pierre.'],
  bosquet: ['Chut. L’arbre dort.', 'Allez. Pousse. Je t’écoute.'],
  puits: ['Chut… l’eau parle.', 'Ma baguette tremble. Il y a de l’eau là-dessous.'],
  ponton: ['Vent d’ouest. Ça mord, aujourd’hui.', 'Mer d’huile. Je n’aime pas ça. Elle prépare quelque chose.'],
  atelier: ['Attends. Voilà. … Non. Attends.', 'Encore une vis et ça tourne. … Clic.'],
  foyer: ['Ce qui mijote ne se presse pas.', 'Goûte-moi ça. Alors ? Dis-moi franchement.']
};
// Les poules d’Agathe (serveur : services/beasts.js) : ce que dit leur fiche
export const HEN_LINES = {
  'poule-rousse': 'La meneuse : ses poussins la suivent partout.',
  'poule-blanche': 'Douce comme une mie de pain, elle picore près du feu.',
  'poule-noire': 'Réglisse ne pond pas. Elle juge.',
  // (le coq et sa couvée : choix de l'auteur, 14 oct., textes validés)
  coq: 'Il chante à l’aube. Et à midi. Et quand ça lui chante.',
  'poulette-muscade': 'Née sur l’île. Elle ne connaît que le sable et le feu.',
  'poulette-praline': 'Née sur l’île. Elle ne connaît que le sable et le feu.',
  'poulette-noisette': 'Née sur l’île. Elle ne connaît que le sable et le feu.'
};
// Agathe et son poulailler (WorldView, hens.js) : le coq échoué, le premier œuf ramassé (bible, étape 8d), le premier
// poussin
export const COOP_LINES = {
  coq: 'Un coq ! Échoué sur une caisse, la crête rouge comme un coquelicot. Mes filles, tenez-vous droites.',
  oeuf: 'Avec un œuf, je fais une omelette. Avec deux, un miracle.',
  poussin: 'Un poussin ! Regarde-le : il a déjà mon caractère.'
};
// Agathe, sa cage ouverte (WorldView, hens.js)
export const HENS_FREED = 'Mes filles… Elles ont tenu bon.';
// Anya, son Souffle déjà donné pour ce passage (WorldView, folk.js)
export const ANYA_RESTED = 'Va. La terre se repose, elle aussi.';
// Les cris des bêtes de la ferme, sur l'île : une didascalie sobre (choix de l'auteur, 15 oct. : décision 24)
export const SOUNDS = { hen: '(Elle caquette.)', rooster: '(Il chante.)', chick: '(Il pépie.)', cow: '(Elle meugle.)', sheep: '(Il bêle.)', pig: '(Il grogne.)', goat: '(Elle bêle.)' };
export const BEAST_NAMES = {
  hen: ['Poule', 'Elle picore au camp, près du feu.'], chick: ['Poussin', 'Il suit sa mère partout.'],
  cow: ['Vache', 'Elle broute près du Potager et dort couchée la nuit.'], sheep: ['Mouton', 'Il broute en troupeau près du Potager.'],
  pig: ['Cochon', 'Il fouille la terre du bout du groin.'], goat: ['Chèvre', 'Elle grimpe partout où elle peut.'],
  deer: ['Cerf', 'Il sort du bois à l’aube et au crépuscule.'], fox: ['Renard', 'Il rôde au crépuscule et la nuit.'],
  rabbit: ['Lapin', 'Il gambade près du bois le jour.'], hedgehog: ['Hérisson', 'Il renifle les buissons la nuit.'],
  squirrel: ['Écureuil', 'Il saute d’arbre en arbre.'], koi: ['Carpe koï', 'Elle nage dans l’eau douce.'], heron: ['Héron', 'Il pêche au bord de l’eau le matin.'],
  snowFox: ['Renard des neiges', 'Il trotte sur la neige des Cimes.'], ibex: ['Bouquetin', 'Il broute entre les rochers des Cimes.'],
  puffin: ['Macareux', 'Il bat des ailes au bord des Landes.'], pony: ['Poney', 'Il broute la bruyère des Landes.'],
  frog: ['Grenouille', 'Elle saute dans le Marais, même sous la pluie.'], tortoise: ['Tortue', 'Elle avance tout doucement dans le Marais.'],
  fennec: ['Fennec', 'Il dort le jour et trotte la nuit dans les Dunes.'], camel: ['Dromadaire', 'Il traverse les Dunes à pas lents.'],
  chameleon: ['Caméléon', 'Il change de teinte sous les feuilles de la Jungle.'], toucan: ['Toucan', 'Il penche la tête sous les feuilles de la Jungle.'],
  salamander: ['Salamandre', 'Elle sort la nuit et sous la pluie, sur les cendres du Volcan.'], crow: ['Corbeau des cendres', 'Il croasse sur les pentes du Volcan.'],
  otter: ['Loutre', 'Une créature d’Anya : elle joue au bord de l’eau douce.'],
  bird: ['Mésange', 'Elle sautille dans les arbres, le jour.'], butterfly: ['Papillon', 'Il volette au bord des bois, le jour.'],
  firefly: ['Luciole', 'Elle s’allume la nuit, près de l’eau.'], bee: ['Abeille', 'Elle butine autour du Potager.'], owl: ['Hibou', 'Il veille la nuit, perché dans un arbre.']
};

// À la Récolte, d'où vient le multiplicateur d'une ressource (HarvestGame.vue : harvest__boost ; serveur : le bâtiment
// qui la produit double sa Récolte, puis davantage à chaque palier)
export const BOOSTED_BY = { wood: 'grâce au Bosquet', stone: 'grâce à la Carrière', water: 'grâce au Puits', food: 'grâce au Potager' };

// Un habitant qu'on touche (sa bulle : world/village.js, say) : selon le temps et l'heure (sinon ses paroles de métier,
// WORK_LINES) ; une réplique par maître, et la commune (common) pour les voyageurs installés. Endormi, il ne dit rien :
// sa pose et ses « z » suffisent (choix de l'auteur, 15 oct. : ecriture/lots/04_maitres.md)
export const VILLAGER_SAYS = {
  storm: {
    ponton: 'Celui-là vient de loin. Rentre tes affaires, on aura un coup de vent.',
    foyer: 'Ferme les volets de ma cuisine, tu veux ? L’orage, ça fait tourner le lait.',
    atelier: 'Un orage, c’est de l’énergie gaspillée. Si seulement… Attends. Non.',
    puits: 'L’eau du ciel est en colère. Elle se calmera dans mon puits.',
    bosquet: 'Les arbres ont peur. Je reste avec eux.',
    carriere: 'Hm. Orage. (Il ne bouge pas d’un pouce.)',
    potager: 'L’orage arrose sans demander. Mes laitues n’aiment pas qu’on les brusque.',
    common: 'L’orage arrive. Mieux vaut se mettre à l’abri.'
  },
  rain: {
    ponton: 'Pluie de mer. Elle sent le sel et la route.',
    foyer: 'Il pleut. Tant mieux : la soupe a meilleur goût sous la pluie. On me l’a dit.',
    atelier: 'La pluie rouille tout. Sauf mes idées.',
    puits: 'Chut… Tu entends ? Tout le ciel tombe dans mon puits.',
    bosquet: 'La pluie. Les racines boivent. Écoute.',
    carriere: 'Hm. La pierre aime la pluie.',
    potager: 'Il pleut. Mes radis vont être insupportables.',
    common: 'Il pleut sur toute l’île.'
  },
  evening: {
    ponton: 'Le vent tombe avec le soleil. Il reviendra au matin, il revient toujours.',
    foyer: 'Ce soir, on mange chaud. Comme tous les soirs.',
    atelier: 'Le soir, je démonte. Le matin, je remonte. Entre les deux, je rêve.',
    puits: 'La lune arrive. Elle va me raconter sa journée.',
    bosquet: 'La forêt s’endort. Moi, pas encore.',
    carriere: 'Hm. Bonne journée de pierre.',
    potager: 'La lune monte. C’est l’heure des choses qui poussent sans qu’on les regarde.',
    common: 'Le soir tombe. Les lanternes s’allument.'
  },
  dawn: {
    ponton: 'Ciel rouge au matin… Ma grand-mère n’aurait pas pris la mer.',
    foyer: 'Debout. La marmite n’attend personne.',
    atelier: 'Le soleil se lève à l’heure. C’est bien le seul.',
    puits: 'J’ai rêvé d’un poisson qui savait lire. … C’était peut-être vrai.',
    bosquet: 'Les oiseaux d’abord. Puis moi.',
    carriere: 'Hm.',
    potager: 'Le matin, les plantes sont honnêtes. Après, elles font semblant.',
    common: 'Le jour se lève.'
  }
};
// Sa fiche courte (appui long : world/village.js, describe) ; site : le nom de son bâtiment
// La vie des habitants (lot B, choix de l'auteur, 16 oct. : textes validés ; world/village/agenda.js) : ce que dit un
// maître qu'on touche pendant son rituel, au repas de midi, en visite chez un camarade ; selon son humeur ; l'hiver.
// Clés : le bâtiment où chacun travaille
export const RITUAL_SAYS = {
  ponton: 'Chut. L’îlot sort de la brume, un peu, le matin. Je le regarde avant qu’il se cache.',
  foyer: 'Pas le temps, mon cœur, ça attache. Reviens à table, tu goûteras.',
  atelier: 'Tard ? Non. Les rouages travaillent mieux quand tout le monde dort. Moi aussi.',
  puits: 'Le matin, l’eau dit où elle est allée cette nuit. Il faut écouter avant que le soleil la fasse taire.',
  bosquet: 'Les bêtes rentrent. Je compte. (Un temps.) Toutes là.',
  carriere: 'Hm. La pierre est froide le matin. Elle dit la vérité.',
  potager: 'La lune passe voir le potager. Je lui présente les nouveaux.'
};
export const MEAL_SAYS = {
  ponton: 'On mange à l’heure, comme à bord. Sinon l’équipage râle.',
  atelier: 'Agathe a encore changé la recette. Je ne dis rien. Je reprends.',
  puits: 'Tatie dit que je dois finir mon assiette. L’assiette n’a rien dit, elle.',
  bosquet: 'Manger ensemble. Comme la meute. (Elle s’assoit un peu plus près.)',
  carriere: 'Hm. Bonne soupe. (Il tend son bol.)',
  potager: 'Ces carottes viennent de chez moi. Elles sont un peu timides, sois gentil.'
};
export const VISIT_SAYS = {
  ponton: 'Je passe voir si tout tient. Vieille habitude de quart.',
  foyer: 'J’apporte de quoi grignoter. Chez moi, personne ne travaille le ventre vide.',
  atelier: 'Je viens emprunter un outil. Et rendre celui de la dernière fois. … Plus tard.',
  puits: 'Je suis venu dire bonjour. Et voir s’il y a de l’eau par ici. Il y en a toujours.',
  bosquet: 'Je suis venue voir. Juste voir.',
  carriere: 'Hm. Visite.',
  potager: 'Je viens prendre des nouvelles. Des gens, et de leurs plantes.'
};
export const MOOD_SAYS = {
  triste: {
    ponton: 'Pas grand vent en moi, aujourd’hui. Ça passera. Ça passe toujours.',
    foyer: 'Je cuisine quand même. Mais sans chanter. Tu as remarqué ?',
    atelier: 'Rien ne tourne rond aujourd’hui. Même pas moi.',
    puits: 'Ma baguette ne tremble plus. Je crois qu’elle est triste aussi.',
    bosquet: 'La forêt est lourde, aujourd’hui. Moi aussi.',
    carriere: 'Hm. … Hm.',
    potager: 'Même les radis ne me parlent plus. C’est mauvais signe, tu crois ?'
  },
  heureux: {
    ponton: 'Vent arrière, ciel clair, l’équipage au complet. Que demander de plus ?',
    foyer: 'Tout le monde a mangé, personne ne s’est brûlé. Une belle journée.',
    atelier: 'Tout s’emboîte aujourd’hui. … Clic.',
    puits: 'Je suis content. L’eau aussi, je crois. Elle fait des ronds.',
    bosquet: 'Les arbres chantent. Je chante un peu avec eux.',
    carriere: 'Hm ! (Brume : « C’est un bon “hm”. »)',
    potager: 'Tout pousse, tout le monde rit. Je n’ai rien semé de tout ça. Curieux, non ?'
  }
};
export const WINTER_SAYS = {
  ponton: 'Mer d’hiver. Elle mord. On reste à quai.',
  foyer: 'L’hiver, la soupe épaissit et les gens se rapprochent. Les deux me vont.',
  atelier: 'Le froid ralentit les ressorts. Les miens aussi.',
  puits: 'L’eau dort sous la glace. Je lui chuchote quand même.',
  bosquet: 'Les arbres dorment. Je veille pour eux.',
  carriere: 'Hm. Le gel fend la pierre. Patience.',
  potager: 'En hiver, tout pousse en dessous. On ne voit rien. C’est le meilleur moment.'
};
// Les autres saisons (lot C, choix de l'auteur, 16 oct.), comme l'hiver : elles s'ajoutent à ce qu'il peut dire
export const SEASON_SAYS = {
  printemps: {
    ponton: 'Les vents tournent au printemps. Ils ne savent pas encore où ils vont. Moi non plus, et ça me va.',
    foyer: 'Les premières herbes ! Une poignée dans la soupe et tout le monde rajeunit.',
    atelier: 'Au printemps, tout se dérègle : les oiseaux, les fleurs, mes horloges. J’adore.',
    puits: 'La neige fond dans mon puits. L’eau a un goût de montagne.',
    bosquet: 'Les bourgeons. Chut. Ils se décident.',
    carriere: 'Hm. La pierre se réchauffe. Moi aussi. Un peu.',
    potager: 'Tout le monde se réveille en même temps. Tu imagines le bruit, sous la terre ?'
  },
  ete: {
    ponton: 'Mer d’été, mer de menteuse. Belle le matin, grosse le soir.',
    foyer: 'Trop chaud pour la soupe ? Il n’est jamais trop chaud pour la soupe.',
    atelier: 'La chaleur dilate les métaux. Mes calculs aussi. Tout est un peu plus grand.',
    puits: 'L’eau se cache plus profond, l’été. Elle a chaud, elle aussi.',
    bosquet: 'L’ombre est un cadeau des arbres. Remercie-les.',
    carriere: 'Hm. La pierre brûle. Je travaille tôt.',
    potager: 'Les tomates rougissent. On ne leur a rien dit, pourtant.'
  },
  automne: {
    ponton: 'Les oiseaux partent vers le sud. Ils connaissent la route, eux.',
    foyer: 'Les courges, les champignons, les pommes… L’automne, c’est ma saison. Et celle de ma marmite.',
    atelier: 'Les feuilles tombent une à une. Comme des secondes. Je les compte, parfois.',
    puits: 'Les feuilles flottent sur l’eau. Ce sont des petits bateaux. Ils vont où, tu crois ?',
    bosquet: 'Les arbres se dépouillent. Ils n’ont pas peur. Ils savent revenir.',
    carriere: 'Hm. Le brouillard. Il polit la pierre.',
    potager: 'On récolte, on range, on dit merci. Et on garde des graines. Toujours.'
  }
};
// Les voyageurs installés (lot C) : leur voix, selon le métier qui les a fait rester (clé : le bâtiment où ils
// travaillent ; serveur : services/visitors.js, ROLES) ; à la place des répliques de métier des maîtres
export const SETTLER_SAYS = {
  potager: ['Une fleur que je n’ai jamais vue. Encore une. Cette île n’en finit pas.', 'Maggy parle à ses plantes. Je commence à comprendre ce qu’elles répondent.'],
  carriere: ['Ces roches ont des couches que je ne sais pas lire. Robby, si. Il ne dit rien.', 'Une île jeune sur un socle très vieux. Curieux mélange.'],
  bosquet: ['Je ne coupe que ce que l’arbre me donne. Maerys y veille.', 'Ce bois chante quand on le travaille. Je n’en avais jamais entendu.'],
  puits: ['L’eau d’ici remonte d’on ne sait où. Léo dit qu’elle vient des nuages d’en dessous.', 'J’ai mesuré la source trois fois. Trois débits différents. Elle se moque de moi.'],
  ponton: ['Cette île n’est sur aucune carte. Je la dessine. Elle bouge un peu entre deux traits.', 'Lorena me dicte les courants. Je n’ai jamais eu de meilleure boussole.'],
  atelier: ['Nathan m’a montré un rouage plus fin qu’un cheveu. Je n’ai rien dit. J’étais jaloux.', 'L’or ne vaut rien ici. Le bon outil, si.'],
  foyer: ['La soupe d’Agathe mérite un poème. Elle dit qu’elle mérite surtout qu’on la mange chaude.', 'Une île, un feu, des gens. Il ne manquait que les mots. Je suis venu pour ça.']
};

// Les rencontres (« premier>second » : qui parle d'abord) : deux bulles, une fois par visite, si on les voit ; dans un
// sens de visite ou dans l'autre (lot C : une par paire de camarades)
export const MEETINGS = {
  'ponton>puits': ['Alors, moussaillon, l’eau t’a dit quoi ce matin ?', 'Qu’il y aura du vent. Tu le savais déjà.'],
  'foyer>carriere': ['Tu as mangé, au moins ?', 'Hm. … Non.'],
  'atelier>potager': ['Je t’ai fabriqué un arrosoir qui pleut tout seul.', 'Et qui s’arrête tout seul, aussi ?'],
  'bosquet>ponton': ['Ta mer fait du bruit.', 'Ta forêt aussi. On s’habitue.'],
  'ponton>foyer': ['Ta soupe sent la cambuse de mon premier bateau.', 'Je vais prendre ça pour un compliment.'],
  'atelier>ponton': ['J’ai réparé ta longue-vue. Elle voit plus loin. Enfin, plus flou, mais plus loin.', 'Plus loin, c’est tout ce que je demande.'],
  'carriere>ponton': ['Hm. Ton ponton penche.', 'Il penche vers la mer. Comme moi.'],
  'potager>ponton': ['Tu crois que les graines voyagent, elles aussi ?', 'Les meilleures, oui. Accrochées aux voiles.'],
  'atelier>foyer': ['Ta marmite, je peux lui ajouter un ressort ?', 'Touche à ma marmite et tu mangeras dehors.'],
  'foyer>puits': ['Mon caneton, tu as mis ton écharpe ?', 'L’eau dit qu’il fera doux. … Je la mets quand même.'],
  'foyer>bosquet': ['Je t’ai gardé une part. Sans feu, promis : froide.', '(Elle sourit.) Merci. La meute mange ensemble.'],
  'potager>foyer': ['Mes poireaux voudraient savoir ce que tu leur prépares.', 'Dis-leur : une soupe. Ils seront célèbres.'],
  'puits>atelier': ['Tu peux réparer un rêve ? Il s’est cassé au réveil.', 'Les rêves, non. Mais je peux t’apprendre à les remonter.'],
  'bosquet>atelier': ['Ta machine fait trop de bruit pour les oiseaux.', 'Je lui apprends à chuchoter. Elle est lente. Comme moi.'],
  'atelier>carriere': ['Robby, il me faut une pierre parfaitement plate.', 'Hm. Aucune pierre n’est plate. (Il en donne une.) Celle-là ment bien.'],
  'puits>bosquet': ['Les arbres boivent la même eau que mon puits ?', 'Oui. C’est pour ça qu’ils t’aiment bien.'],
  'puits>carriere': ['Ta pierre, elle a de l’eau dedans ?', 'Hm. Un peu. Elle se souvient de la pluie.'],
  'potager>puits': ['Tu veux arroser avec moi ? Les courges t’aiment bien.', 'Elles me l’ont dit. Enfin, je crois.'],
  'carriere>bosquet': ['Hm.', 'Hm. (Ils se comprennent.)'],
  'bosquet>potager': ['Tes plantes parlent fort.', 'Elles sont contentes. Les tiennes chuchotent, non ?'],
  'potager>carriere': ['Tu crois qu’une pierre peut pousser ?', 'Hm. Très lentement. Patience.']
};

export const VILLAGER_SHEETS = {
  guest: 'De passage sur l’île : son bateau attend au Ponton.',
  plank: 'Il dort sur sa planche. Parle-lui pour le réveiller.',
  asleep: 'Il dort dans la brume. Parle-lui pour le réveiller.',
  camp: site => `Vit au camp, près de « ${site} », en attendant son bâtiment.`,
  waiting: site => `Attend que « ${site} » sorte de terre, tout près.`,
  work: site => `Travaille à « ${site} » le jour, rentre au Foyer le soir.`
};
// Ce que fait un toucher, sous une fiche courte
export const TOUCH_HINTS = {
  talk: 'Toucher : lui parler',
  greet: 'Toucher : le saluer',
  reactShe: 'Toucher : la faire réagir',
  reactHe: 'Toucher : le faire réagir',
  startle: 'Toucher : il sursaute'
};
// Les familiers qu'on touche (court) ou dont on lit la fiche (long) : l'amie de Tic-Tac, le bocal de Léo vide, Bulle
export const PET_SAYS = {
  amie: { title: 'L’amie de Tic-Tac', short: '(Elle tourne autour de Tic-Tac.)', long: 'Une abeille de laiton : Nathan l’a fabriquée pour Tic-Tac quand Abeille a été écrite.' },
  bocal: { title: 'Le bocal de Léo', short: '« Bulle est retourné dans la mer. »', long: 'Vide. « Bulle est retourné dans la mer. »' },
  bulle: { title: 'Bulle', short: '(Il fait le tour du bocal.)', long: 'Le petit poisson de Léo, revenu quand Poisson a été écrit.' }
};
// Une bête sans nom connu
export const UNKNOWN_BEAST = 'Une bête';
