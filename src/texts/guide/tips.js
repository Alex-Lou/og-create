// Ce que dit Brume, le feu follet guide, aux moments clés du jeu (une seule fois chacun) : le Grimoire ouvert seul, la
// première page à portée, le premier mélange raté sur une page visée, chaque chapitre qui s'ouvre, le premier bâtiment
// qui peut s'étendre (annexes), le deuxième habitant (amitié), le premier besoin d'un habitant, le premier visiteur, le premier mini-jeu ouvert, la première expédition, la première trouvaille.
// Les quêtes accomplies (questTip) ont leur propre réplique. Brume dit ce qu'elle voit ; le geste, la ligne d'aide le
// dit (texts/tutorial/coach.js : TIP_HELP) ; une réplique en plusieurs bulles est une liste (choix de l'auteur,
// 15 oct. : ecriture/lots/05_village.md)
export const TIPS = {
  // Le Grimoire ouvert seul pour la première fois, après le tutoriel (choix de l'auteur, 13 oct. : texte validé)
  grimoire: 'Sept chapitres… et presque tout dort encore. Les pages qui frémissent, tu sais déjà les écrire. Cherche-les.',
  reach: 'Oh… cette page frémit. Ce qu’elle cache, tu le connais déjà un peu.',
  fail: 'Pas encore… Moi aussi, je cherche longtemps mes mots.',
  annexes: 'Ton bâtiment a grandi. Il déborde presque. Autour de lui, il y a de la place pour des champs, des filons, des viviers.',
  friends: 'Ils ont tous un prénom, tu as vu ? Et des goûts, et des manies.',
  savoirs: 'Les maîtres se souviennent de choses que j’ai oubliées.',
  bulle: ['Regarde le bocal de Pierrot.', '… Bulle est revenu.'],
  bestiaire: 'Quelque chose bouge, là-bas… C’est la bête que tu as écrite.',
  // La même, dite par Freya (sa grammaire revient peu à peu : bible, § 8.2)
  bestiaireSylve: 'Elle est là. Celle que tu as écrite. Elle boit au ruisseau.',
  needs: 'Quelqu’un a besoin de toi. Ça se voit, si on regarde bien.',
  visitor: 'Une voile ! Un bateau accoste au Ponton… entier.',
  expedition: 'Ils sont entrés dans ma brume. Elle ne leur fera rien… je crois.',
  finds: 'Une trouvaille de climat… Montre-moi.',
  games: 'Un jeu s’est ouvert. Je regarderai, moi.',
  'chapter-II': 'La Matière s’ouvre. Pétrir, fondre, forger… j’ai déjà vu des mains faire ça, il me semble. Sur l’île, La Colline peut sortir de la brume.',
  'chapter-III': 'Ciel et Terre. Lève les yeux… il manque une étoile, là-haut. Je ne sais plus laquelle. Les Jardins, le Faubourg et les Hauteurs t’attendent.',
  'chapter-IV': 'Le Vivant s’éveille. Ça pousse, ça respire, ça bat… comme toi. La Crique et la Grande Forêt peuvent renaître.',
  'chapter-V': 'Le Foyer : là où l’on invente et où l’on bâtit. Le Hameau sort de la brume.',
  'chapter-VI': 'Les Âges tournent leurs pages. Tant de siècles… et moi, toujours là. L’Îlot aux Mouettes se laisse enfin approcher.',
  'chapter-VII': 'Les Légendes… Il ne reste qu’un voile. Lève-le, et l’île sera entière. Moi aussi, peut-être.'
};

// Quête accomplie hors de l'île (dans le Grimoire) : Brume invite à venir la voir ; la ligne d'aide dit la quête et ses
// écus (questHelp : une annonce, en même temps) (choix de l'auteur, 14 oct. : ecriture/lots/01_ouverture.md)
export function questTip(quest) {
  return {
    id: `quest-${quest.id}`,
    text: 'Je l’ai senti d’ici. Viens me voir sur l’île.',
    action: { label: 'Aller sur l’île', mode: 'world' }
  };
}
export const questHelp = quest => `« ${quest.label} » : accomplie. ${quest.coins} écus t’attendent auprès de Brume.`;
