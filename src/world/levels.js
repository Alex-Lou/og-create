// Paliers d'un bâtiment côté navigateur (le serveur reste seul juge de la construction) : où en est chaque palier, et
// si le suivant peut se bâtir. stock : réserves de l'île ; coins : solde connu, ou null (le serveur tranchera)

// Palier i (0 = premier niveau) d'un bâtiment : atteint, prochain ou à venir
export function stepState(site, i) {
  if (i < site.level) return 'done';
  return i === site.level ? 'next' : 'later';
}

// Ressources du palier suivant réunies
export function levelAffordable(site, stock) {
  return Boolean(site.next) && Object.entries(site.next.cost).every(([r, n]) => stock[r] >= n);
}

// Écus suffisants (solde inconnu : le serveur tranchera)
export function coinsEnough(price, coins) {
  return !price || coins === null || coins >= price;
}

// Le palier suivant peut se bâtir : plan trouvé, chapitre ouvert, ressources et écus réunis
export function levelReady(site, stock, coins) {
  const next = site.next;
  return Boolean(next) && next.planOwned && next.chapterOpen !== false && levelAffordable(site, stock) && coinsEnough(next.coins, coins);
}
