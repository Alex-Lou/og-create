// Ce que dit Brume, le feu follet guide, aux moments clés du jeu (une seule fois chacun) : le Grimoire ouvert seul, la
// première page à portée, le premier mélange raté sur une page visée, chaque chapitre qui s'ouvre, le premier bâtiment
// qui peut s'étendre (annexes), le deuxième habitant (amitié), le premier besoin d'un habitant, le premier visiteur, le premier mini-jeu ouvert, la première expédition, la première trouvaille.
// Les quêtes accomplies (questTip) ont leur propre réplique.
export const TIPS = {
  // Le Grimoire ouvert seul pour la première fois, après le tutoriel (choix de l'auteur, 13 oct. : texte validé)
  grimoire: 'Sept chapitres… et presque tout dort encore. Les pages qui frémissent, tu sais déjà les écrire. Cherche-les.',
  reach: 'Oh… cette page frémit. Ce qu’elle cache, tu le connais déjà un peu. Lis l’indice, puis dépose les bons éléments dans l’Athanor.',
  fail: 'Pas encore… Moi aussi, je cherche longtemps mes mots. Les familles notées sur la page montrent la voie ; l’Encre révèle un ingrédient, et le nom se devine lettre par lettre.',
  annexes: 'Ton bâtiment a grandi… il déborde presque ! Autour de lui, il y a de la place pour des champs, des filons, des viviers. Ouvre sa fiche, onglet Annexes, et pose-les toi-même : ce sont eux qui produisent le plus.',
  friends: 'Ils ont tous un prénom, tu as vu ? Et des goûts, et des manies. Bavarde avec eux chaque jour, offre-leur ce qu’ils aiment : un cœur de plus, et ils voudront te faire un cadeau. Garde le doigt appuyé sur l’un d’eux pour ouvrir sa fiche.',
  savoirs: 'Les maîtres se souviennent de choses que j’ai oubliées. Au premier bavardage du jour, chacun souffle un indice sur une page de son chapitre. Plus vous êtes proches, plus il est précis.',
  bulle: 'Regarde le bocal d’Ondin… Bulle est revenu ! Tu vois ? Ce qu’on écrit renaît vraiment.',
  bestiaire: 'Quelque chose bouge, là-bas… La bête que tu as écrite vit maintenant sur l’île. Cherche-la ! Le Carnet d’explorateur garde le Bestiaire.',
  // La même, dite par Sylve (sa grammaire revient peu à peu : bible, § 8.2)
  bestiaireSylve: 'Bêtes… réveillées ! Bête fabriquée, bête vit. Arbres, eau, ciel : regarde. Le Carnet garde le Bestiaire.',
  needs: 'Quelqu’un a besoin de toi : regarde la bulle au-dessus de sa tête. Manger, des outils, quelques créations autour de son bâtiment… Comble-le depuis sa fiche : heureux, il travaille mieux (+10 % de production) ; négligé, moins bien.',
  visitor: 'Une voile ! Un bateau accoste au Ponton… entier. Son voyageur reste quelques jours, avec une demande : la bulle dorée au-dessus de sa tête. Garde le doigt appuyé sur lui pour ouvrir sa fiche : sa demande comblée, des écus t’attendent.',
  expedition: 'Ton expédition s’enfonce dans la brume… N’aie pas peur : je la connais, ma brume. À son retour, la terre explorée se dévoile, et tu pourras l’acheter. Une seule à la fois : la boussole, en haut à gauche, dit quand elle revient.',
  finds: 'Une trouvaille de climat… montre-moi ! Chaque climat a la sienne : glace, laine, roseau, sel, fruits, obsidienne, et ses gisements repoussent en quelques heures. Le sac, en haut à gauche, la garde à part : elle sert aux créations et annexes de climat.',
  games: 'Un jeu s’est ouvert ! Au palier III, le Ponton pêche, la Carrière creuse son filon, le Bosquet se cueille. Touche le bâtiment : « Jouer » est dans sa fiche, et chaque partie rapporte des écus. Je regarderai, moi.',
  'chapter-II': 'La Matière s’ouvre. Pétrir, fondre, forger… j’ai déjà vu des mains faire ça, il me semble. Sur l’île, La Colline peut sortir de la brume.',
  'chapter-III': 'Ciel et Terre. Lève les yeux… il manque une étoile, là-haut. Je ne sais plus laquelle. Les Jardins, le Faubourg et les Hauteurs t’attendent.',
  'chapter-IV': 'Le Vivant s’éveille. Ça pousse, ça respire, ça bat… comme toi. La Crique et la Grande Forêt peuvent renaître.',
  'chapter-V': 'Le Foyer : là où l’on invente et bâtit, ensemble. Le Hameau sort de la brume.',
  'chapter-VI': 'Les Âges tournent leurs pages. Tant de siècles… et moi, toujours là. L’Îlot aux Mouettes se laisse enfin approcher.',
  'chapter-VII': 'Les Légendes… Il ne reste qu’un voile. Lève-le, et l’île sera entière. Moi aussi, peut-être.'
};

// Quête accomplie hors de l'île (dans le Grimoire) : Brume invite à venir réclamer la récompense
export function questTip(quest) {
  return {
    id: `quest-${quest.id}`,
    text: `« ${quest.label} » : c’est fait ! Je l’ai senti d’ici. Viens sur l’île : j’ai ${quest.coins} écus pour toi.`,
    action: { label: 'Aller sur l’île', mode: 'world' }
  };
}
