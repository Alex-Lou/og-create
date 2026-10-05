// Ce que dit Brume, le feu follet guide, aux moments clés du jeu (une seule fois chacun) : son arrivée et le Livre,
// la première page à portée, le premier mélange raté sur une page visée, chaque chapitre qui s'ouvre, la première
// visite de l'île, le premier bâtiment qui peut s'étendre (annexes), le deuxième habitant (amitié), le premier besoin
// d'un habitant, le premier mini-jeu ouvert. Les quêtes accomplies (questTip) ont leur propre réplique.
export const TIPS = {
  welcome: 'Je suis Brume, un souffle de la brume qui couvre ton île. Ce grimoire est le Codex : chaque élément que tu crées s’y inscrit. Glisse une page du doigt, ou touche son bord, pour le feuilleter.',
  reach: 'Cette page est à ta portée : son élément peut naître de ce que tu connais déjà. Lis l’indice, puis dépose les bons éléments dans l’Athanor.',
  fail: 'Pas encore… Les familles notées sur la page te mettent sur la voie. L’Encre révèle un ingrédient, et tu peux deviner le nom lettre par lettre.',
  island: 'Voici ton île, encore noyée de brume. Je t’y attendais : touche-moi, je te mènerai à ta prochaine tâche ; garde le doigt appuyé sur moi pour lire ma quête.',
  annexes: 'Ton bâtiment a grandi : il peut s’étendre. Dans sa fiche, l’onglet Annexes propose champs, filons, viviers… Pose-les toi-même autour de lui : ce sont eux qui produisent le plus.',
  friends: 'Tes habitants ont chacun un prénom et leurs goûts. Bavarde avec eux chaque jour, offre-leur ce qu’ils aiment : chaque cœur d’amitié leur donne envie de te faire un cadeau. Garde le doigt appuyé sur l’un d’eux, ou ouvre la fiche du Foyer.',
  needs: 'Un habitant a besoin de toi : la bulle au-dessus de sa tête dit quoi. Manger, des outils, quelques décorations autour de son bâtiment… Comble ses besoins depuis sa fiche : heureux, il travaille mieux (+10 % de production) ; négligé, moins bien.',
  games: 'Un mini-jeu s’est ouvert ! Au palier III, le Ponton pêche, la Carrière creuse son filon et le Bosquet se cueille. Touche le bâtiment : « Jouer » est dans sa fiche, et chaque partie rapporte des écus.',
  'chapter-II': 'La Matière s’ouvre : ce qui se pétrit, se fond, se forge. Sur l’île, La Colline peut sortir de la brume.',
  'chapter-III': 'Ciel et Terre : lève les yeux vers les astres. Les Jardins, le Faubourg et les Hauteurs t’attendent.',
  'chapter-IV': 'Le Vivant s’éveille. La Crique et la Grande Forêt peuvent renaître.',
  'chapter-V': 'Le Foyer : là où l’on invente et bâtit. Le Hameau sort de la brume.',
  'chapter-VI': 'Les Âges tournent leurs pages. L’Îlot aux Mouettes se laisse enfin approcher.',
  'chapter-VII': 'Les Légendes… Il ne reste qu’un voile. Lève-le, et l’île sera entière.'
};

// Quête accomplie hors de l'île (dans le Livre) : Brume invite à venir réclamer la récompense
export function questTip(quest) {
  return {
    id: `quest-${quest.id}`,
    text: `« ${quest.label} » : c’est fait ! Viens sur l’île, je t’y attends avec ${quest.coins} écus.`,
    action: { label: 'Aller sur l’île', mode: 'world' }
  };
}
