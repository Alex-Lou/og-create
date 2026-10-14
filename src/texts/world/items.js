// Le mode d'emploi d'un article de la boutique (world/itemGuide.js ; carte d'aide au premier achat de chaque sorte) :
// comment s'en servir (HOW), pourquoi l'avoir (WHY), où il se trouve (WHERE). Clés : la sorte d'article (prod, coins,
// moves, charges, regen, compagnon, skin, teinte, rare).

// Comment s'en servir
export const HOW = {
  prod: 'Rien à faire : il travaille tout seul. Touche la bulle au-dessus du bâtiment pour encaisser.',
  coins: 'Rien à faire : les écus s’ajoutent à la production du bâtiment. Touche sa bulle pour les encaisser.',
  moves: 'Lance une Récolte (bouton Récolte, en haut de l’île) : chaque partie a des coups en plus.',
  charges: 'Une partie de Récolte de plus t’attend en réserve : tu peux en enchaîner davantage.',
  regen: 'Les parties de Récolte reviennent plus vite, même quand tu n’es pas là.',
  compagnon: 'Rien à faire : il vit sa vie près du bâtiment. Touche-le sur l’île pour le saluer.',
  skin: 'Porté dès l’achat. Pour changer : Boutique, puis Porter ou Ôter.',
  teinte: 'Portée dès l’achat. Pour changer : Boutique, puis Porter ou Ôter.',
  rare: 'Trouve-la dans un coffre légendaire (Récolte, coffre du jour, quêtes de Brume), puis porte-la depuis la Boutique (Porter ou Ôter).'
};
// Pièce rare offerte par un chapitre du Livre : son coffre attend dans les Coffres de l'île
export const CHAPTER_HOW = chapter => `Ouvre le chapitre ${chapter} du Grimoire : son coffre l’offre (bouton Coffres de l’île). Porte-la ensuite depuis la Boutique.`;
// Pourquoi l'avoir
export const WHY = {
  prod: 'Le bâtiment produit plus de ressources et d’écus, jusqu’à +100 %.',
  coins: 'Des écus en plus chaque heure, même quand tu ne joues pas.',
  moves: 'Plus de coups, ce sont de plus belles Récoltes.',
  charges: 'Jouer plus de Récoltes d’affilée.',
  regen: 'Attendre moins entre deux Récoltes.',
  compagnon: 'Pour la compagnie : il anime ton île.',
  skin: 'Pour le plaisir des yeux : l’apparence change, pas la production.',
  teinte: 'Pour le plaisir des yeux : la teinte vaut pour tous les paliers du bâtiment.',
  rare: 'Une pièce rare : un accessoire animé que peu d’îles ont.'
};
// Où il se trouve (name : le nom du bâtiment entre guillemets, ou « son bâtiment ») : une teinte ou une apparence, une
// pièce rare, un autre article
export const WHERE = {
  named: siteName => `« ${siteName} »`,
  unnamed: 'son bâtiment',
  skin: name => `Sur ${name} lui-même, à tous ses paliers.`,
  rare: name => `Sur ${name} : sa teinte et son accessoire animé.`,
  other: name => `Posé à côté de ${name}, sur ton île.`
};
