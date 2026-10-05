// Amitié des habitants (lot 6d) : ce qu'ils disent quand on bavarde avec eux, selon leurs cœurs (0 à 5), et quand on
// leur offre ce qu'ils adorent. Les prénoms, les goûts, les points et les récompenses viennent du serveur
// (services/villagers.js, mêmes identifiants : le bâtiment où chacun travaille).

const TALKS = {
  potager: [
    'Bonjour ! Fais attention où tu mets les pieds, les radis dorment.',
    'Tu reviens me voir ? Les tomates vont rougir de plaisir.',
    'Un secret : je parle aux salades. Elles poussent deux fois plus vite.',
    'Tiens, sens ce basilic… Voilà, c’est ça, le bonheur.',
    'Quand tu passes, j’ai l’impression que le soleil brille un peu plus fort.',
    'Ma meilleure amie de l’île, c’est toi. Après les citrouilles. Non, je plaisante : c’est toi.'
  ],
  carriere: [
    'Hm. Bonjour. Recule un peu, ça peut tomber.',
    'Tiens, encore toi. La pierre est bonne aujourd’hui.',
    'Tu vois cette veine bleue ? Elle va loin sous l’île. Très loin.',
    'Je t’ai gardé un caillou qui brille. Ne le dis à personne.',
    'Je ne suis pas bavard, mais avec toi, ça va.',
    'S’il te faut une montagne déplacée, tu sais où me trouver. Mon amie.'
  ],
  bosquet: [
    'Salut ! Attention, j’abats celui-là… Ah non, c’était une blague !',
    'Encore toi ! Viens, on fait la course jusqu’au grand chêne ?',
    'Les écureuils m’ont montré une cachette de noisettes. Je te la montrerai.',
    'J’ai gravé ton nom sur un arbre. Un petit, pour qu’il grandisse avec toi.',
    'Le bois chante quand tu es là. Si, si, écoute !',
    'Tu es ma personne préférée de toute la forêt. Et j’en connais, des arbres !'
  ],
  puits: [
    'Bonjour. L’eau est claire ce matin. Ça promet une belle journée.',
    'Ah, te voilà. Prends le temps de boire, rien ne presse.',
    'Si tu écoutes le fond du puits, tu entends la mer. Je ne sais pas pourquoi.',
    'L’eau prend la forme de ce qui la porte. Les amis aussi, un peu.',
    'Chaque seau que je remonte, je pense : voilà pour l’île, et pour toi.',
    'Il y a des sources qui ne tarissent jamais. Notre amitié en est une.'
  ],
  ponton: [
    'Ohé ! Tu veux voir ma prise du jour ? Elle était grande comme ça !',
    'Te revoilà ! Les mouettes t’ont reconnu avant moi.',
    'Au large, il y a une île qui flotte. Je l’ai vue, une nuit de brume.',
    'Je t’ai gardé la meilleure place au bout du ponton. Elle porte bonheur.',
    'Quand la mer est calme, je pense à nos histoires. Ça me fait sourire.',
    'Tu es mon phare, tu sais. Sans toi, je me perdrais en mer.'
  ],
  atelier: [
    'Bonjour. Ne touche pas à l’enclume, elle est encore chaude.',
    'Ah, tu reviens. Tu as l’œil, je l’ai vu tout de suite.',
    'Un bon outil, c’est un ami : il ne te lâche jamais. Comme une vraie amitié.',
    'J’ai forgé une petite clé. Elle n’ouvre rien… à part mon cœur. Bon, tiens.',
    'Mon père disait : on reconnaît le bon fer au son. Le tien sonne juste.',
    'Mon plus bel ouvrage, ce n’est pas un outil : c’est notre amitié.'
  ],
  foyer: [
    'Bonjour mon petit ! Tu as mangé, au moins ?',
    'Te voilà ! J’ai mis une part de tarte de côté, juste au cas où.',
    'Le dernier alchimiste adorait ma soupe. Il disait qu’elle réchauffait la brume.',
    'Viens t’asseoir près du feu, tu me raconteras ta journée.',
    'Tu es comme de la famille, maintenant. La porte est toujours ouverte.',
    'Mon petit, tu as rempli ce Foyer de rires. C’est le plus beau des trésors.'
  ]
};
// Ce qu'ils disent d'un cadeau qu'ils adorent, qu'ils aiment, ou d'un autre
const LOVED = {
  potager: 'De l’eau fraîche ! Mes plantes vont danser de joie. Merci, merci !',
  carriere: 'Un bon repas… Ça, c’est un cadeau de mineur. Merci, vraiment.',
  bosquet: 'À manger ! J’avais un creux de bûcheronne. Tu es la meilleure !',
  puits: 'Du bois… pour réparer la margelle. Tu penses à tout. Merci.',
  ponton: 'Du bois ! De quoi réparer ma barque. Tu es un trésor !',
  atelier: 'De la belle pierre ! Je vais en faire une meule digne de ce nom. Merci.',
  foyer: 'Oh, des provisions ! Je vais te mitonner quelque chose. Merci mon petit !'
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
