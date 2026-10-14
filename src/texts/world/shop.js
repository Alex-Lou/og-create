// La boutique d'un bâtiment (world/shop.js ; SiteShop.vue) : la note d'un skin du Foyer qui ne se voit pas encore ; ce
// dit un article aux lecteurs d'écran (name : son nom ; lock : ce qui l'empêche de s'acheter, le texte de son bouton ;
// price : son prix).

export const SKIN_LATER = 'Se voit dès l’Abri.';
export const BUY_LABEL = {
  locked: (name, lock) => `${name} : ${lock} (toucher : sa fiche)`,
  buy: (name, price) => `Acheter ${name} pour ${price} écus (appui long : sa fiche)`
};
