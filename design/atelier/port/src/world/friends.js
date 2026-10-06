// Amitié des habitants (lot 6d) : ce qu'ils disent quand on bavarde avec eux, selon leurs cœurs (0 à 5), et quand on
// leur offre ce qu'ils adorent. Les prénoms, les goûts, les points et les récompenses viennent du serveur
// (services/villagers.js, mêmes identifiants : le bâtiment où chacun travaille).
// Leurs voix et leur passé, raconté cœur après cœur, suivent la bible (HISTOIRE.md, § 8.2).

const TALKS = {
  // Mélisse, jardinière des lunes : calme, répond par des questions, parle des plantes comme de personnes
  potager: [
    'Une graine, ça a de la mémoire. Plus que nous.',
    'Le jardin de ma grand-mère avait des fèves boudeuses. Tu savais que les fèves boudent ?',
    'Cette boîte ? Des graines. Chaque chose en sa lune : celles-ci attendent depuis longtemps. Elles savent pourquoi.',
    'Certaines de mes graines ne ressemblent à rien de connu. Pourtant, ici, elles se sentent chez elles. Curieux, non ?',
    'La nuit, je parle à la lune. Elle ne répond pas. Les radis, si. Tu veux savoir ce qu’ils disent ?',
    'Je suis revenue planter ici ce qui en était parti.'
  ],
  // Galet, tailleur de runes : « Hm. », et Brume traduit
  carriere: [
    'Hm. (Brume : “Il dit bonjour. Je crois.”)',
    'Hm. Mon village avait une carrière. J’y ai taillé des marches. Cinquante ans. Hm. Belles marches.',
    'Ma grand-mère avait une pierre qui chantait. Je la cherche. Hm. Pas pressé.',
    'Pourquoi je parle peu ? Hm. Les mots s’usent. La pierre, non.',
    'Ma femme parlait pour deux. Depuis, je me tais pour deux. Hm.',
    'Galet, c’est un surnom. Mon vrai nom ? … Pâquerette. Hm.'
  ],
  // Sylve, gardienne des bois : sa grammaire revient avec les cœurs
  bosquet: [
    'Chut ! Arbres… réveillent. Toi entends ?',
    'Ma forêt. Grande. Verte. Arbres parlaient. Toi… écoute aussi, un peu.',
    'Le feu a mangé ma forêt. Tout. Moi, courir jusqu’à la mer. Le feu… méchant.',
    'Radeau de bois flotté, je l’ai fait. Il s’est cassé ici. Les arbres de l’île m’ont attrapée.',
    'Je me cache parce que les gens font du bruit, coupent, brûlent. Toi, non. Toi, tu écoutes.',
    'Ici, c’est ma forêt. Et vous, ma meute.'
  ],
  // Ondin, petit sourcier : chuchote, raconte ses rêves comme s'ils étaient vrais
  puits: [
    'J’ai dormi combien de temps ? L’eau a un goût de nuage.',
    'Cette nuit, j’ai rêvé que la mer était un grand bain. Les poissons me prêtaient leurs bulles. C’était vrai, je crois.',
    'Chut… La lune m’a parlé. Elle dit que tu ne dors pas assez. Elle a raison, non ?',
    'J’ai peur de l’eau profonde. C’est bête, pour un sourcier. Aster dit que c’est normal. Elle aussi, des fois.',
    'Mes parents m’attendent de l’autre côté de la mer. Quand ma baguette tremble vers l’ouest, je crois que c’est eux.',
    'Je trouverai toujours ce que tu as perdu.'
  ],
  // Aster, navigatrice : phrases courtes, pleines de marine ; elle nomme les nuages
  ponton: [
    'Ohé ! Ce nuage-là, je l’appelle Grognon. Cap au nord : il pleuvra avant midi !',
    'Ma grand-mère gardait un phare. Elle m’a appris les vents. Celui-ci, c’est Zéphyr : il ment toujours un peu.',
    'Je voulais faire le tour du monde. Cap à l’ouest, toujours ! L’île, c’était pas prévu. Mais j’aime l’imprévu.',
    'Il y a des années, une brume m’a pris quelqu’un. Je t’en parlerai. Pas aujourd’hui.',
    'J’étais à la barre, la nuit de l’Hirondelle. La brume est venue d’un coup. Depuis, je ne sais plus tenir une barre.',
    'Par tous les alizés… Je reste. La mer peut attendre.'
  ],
  // Rivet, horloger-artificier : s'interrompt pour une idée, « clic », « tac », jeux de mots à plat
  atelier: [
    'Montre-moi tes mains. Hum. On va arranger ça. Clic !',
    'Enfant, j’ai réparé l’horloge de mon village. Elle avançait de dix minutes. Moi aussi, j’avance. Tac ! … Non ?',
    'Mes automates servaient le thé. Attends… Non. Si ! Si ! Ils le renversaient aussi. Clic, clic.',
    'Un de mes automates a mis le feu à mon atelier. Depuis, je n’ose plus rien faire de grand. Juste des vis.',
    'Je suis parti quand plus personne n’a osé me confier une horloge. Ici, tu me confies tout. Tac.',
    'Presque tout peut se réparer. Même moi.'
  ],
  // Cannelle, cuisinière-guérisseuse : proverbes de cuisine inventés, surnoms
  foyer: [
    'Mon caneton ! Tu as mangé ? Non ? Ce qui mijote ne se presse pas, mais toi, assieds-toi !',
    'J’avais une auberge sur un port. Douze tables, une marmite, et des marins qui chantaient faux. Tu aurais aimé.',
    'Mon Ondin, je l’emmenais chez ses parents, de l’autre côté de la mer. Ils l’attendent. En attendant, je le garde au chaud.',
    'Toute ma vie, j’ai eu peur des feux follets. Et voilà que j’en aime un. Brume, tu manges, toi ?',
    'Un secret, ma brindille. Depuis le naufrage, je ne sens plus le goût de rien. Chut, pas un mot.',
    'Une cuillère pour le corps, une pour l’âme… et une pour toi.'
  ]
};
// Ce qu'ils disent d'un cadeau qu'ils adorent, qu'ils aiment, ou d'un autre
const LOVED = {
  potager: 'De l’eau de pluie ? Mes laitues vont te remercier elles-mêmes. Écoute-les.',
  carriere: 'Hm ! (Brume : “Il dit que c’est son plat préféré.”) Hm !',
  bosquet: 'Eau ! Arbres boivent. Merci… ami.',
  puits: 'De l’eau ! Chut… elle dit merci. Moi aussi.',
  ponton: 'Du bois ! Par tous les alizés, de quoi radouber ma barque. Cap sur le ponton !',
  atelier: 'De la pierre ! Attends… Non. Si ! Si ! Une meule pour mes engrenages. Clic !',
  foyer: 'Des provisions ! Ce qui se partage ne se perd pas. Merci, mon caneton !'
};
const LIKED = 'Oh, merci ! C’est gentil d’avoir pensé à moi.';
const OTHER = 'C’est… pour moi ? Merci, c’est l’intention qui compte !';

// Visiteurs installés (id 'v<n>') : ce qu'ils disent selon les cœurs
const SETTLER_TALKS = [
  'Bonjour ! Je m’habitue à ma nouvelle maison, elle est charmante.',
  'Je n’aurais jamais cru rester. Votre île a quelque chose de spécial.',
  'J’ai défait mes malles. Cette fois, c’est décidé : je suis d’ici.',
  'Le soir, je regarde la mer depuis ma fenêtre. Je ne repartirais pour rien au monde.',
  'Merci de m’avoir gardé une place. Je me sens chez moi.',
  'Tu es la meilleure raison qui m’ait fait poser mes valises ici.'
];
// Réplique quand on bavarde, selon les cœurs
export function talkLine(id, hearts) {
  const lines = TALKS[id] || (/^v\d+$/.test(id) ? SETTLER_TALKS : TALKS.foyer);
  return lines[Math.max(0, Math.min(lines.length - 1, hearts))];
}
// Réaction à un cadeau
export function giftLine(id, villager, resource) {
  if (resource === villager.loves) return LOVED[id] || LIKED;
  return resource === villager.likes ? LIKED : OTHER;
}
// Récompense d'un cœur, en clair : « 40 écus », « Coffre épique »
const RARITY_LABEL = { commun: 'commun', rare: 'rare', epique: 'épique', legendaire: 'légendaire' };
export function rewardText(reward) {
  return reward.kind === 'coins' ? `${reward.amount} écus` : `Coffre ${RARITY_LABEL[reward.rarity] || ''}`.trim();
}
// Un habitant attend une visite aujourd'hui : pas encore bavardé ou pas encore de cadeau
export const awaits = villager => !villager.talked || !villager.gifted;
