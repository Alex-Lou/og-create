// Les fêtes de l'île (world/fetes.js) : le mot doré qui s'élève au-dessus d'un bâtiment construit ou qui gagne un
// palier (fete ; grand : le palier IV), d'un quartier acheté ou d'un lieu découvert.

// Le mot de la fête (le même pour un bâtiment et un palier donnés), et la ligne en dessous : il dit ce qui vient
// d'arriver, dans la voix d'un artisan de l'île (choix de l'auteur, 13 oct. ; jamais « Bravo ! », bible § 7.4). Une
// découverte prend le mot de sa sorte, le début de son id (« quartier:… », « lieu:… »)
export const FETE_WORDS = {
  fete: ['Debout !', 'Ça tient !', 'Bel ouvrage !', 'Du solide !'],
  grand: ['Une merveille !', 'L’île s’en souviendra !'],
  quartier: ['La brume recule !'],
  lieu: ['Trouvé !']
};
