// Les bâtiments et les quartiers de l'île (components/World/Sites) : la fiche d'un bâtiment (SiteOverview, SiteShop,
// ShopItemSheet, NameSignPanel, AnnexPanel), d'une annexe posée (AnnexSheet), d'un quartier (ZoneSheet), et le
// renommage (RenameSheet).

// La règle des noms, sous le champ d'un nom à changer (NameSignPanel : le nom des enseignes ; RenameSheet : un bâtiment,
// un quartier)
export const NAME_RULE = max => `2 à ${max} lettres ou chiffres ; un espace, un tiret ou une apostrophe entre deux.`;

// L'aperçu d'un bâtiment (SiteOverview). (« <strong>Embrumé</strong> : un égaré l’a atteint cette nuit, il ne produit
// plus. » reste dans le gabarit, à cause de sa balise.)
export const SITE_FULL = 'Sa réserve est pleine : ramasse pour que la production reprenne.';

// La boutique d'un bâtiment pas encore bâti (SiteShop)
export const SHOP_UNBUILT = 'Bâtis d’abord ce bâtiment pour ouvrir sa boutique.';

// La fiche d'un article de la boutique (ShopItemSheet) : le palier qui manque ; une pièce rare, où elle se trouve
export const SHOP_ITEM = {
  needLevel: (palier, current) => `Il faut le palier ${palier} : ce bâtiment est au palier ${current}.`,
  rareFrom: chapter => `Offerte par le chapitre ${chapter}`,
  rareChests: 'Dans les coffres légendaires'
};

// L'enseigne d'un bâtiment, avant son palier (NameSignPanel)
export const SIGN_TEASER = level => `Au palier ${level}, ce bâtiment portera une enseigne à ton nom, dans le style de ton choix.`;

// Les annexes d'un bâtiment (AnnexPanel) : avant le palier II, puis comment elles se posent
export const ANNEX_PANEL = {
  closed: 'Les annexes s’ouvrent au palier II de ce bâtiment.',
  open: 'Pose-les toi-même sur une case libre de son quartier, où tu veux. Elles travaillent dès leur pose, et se déplacent gratuitement.'
};

// Une annexe posée (AnnexSheet) : son numéro d'exemplaire (s'il y en a plusieurs), puis ce qu'elle fait
export const ANNEX_SHEET = {
  copy: (n, max) => `Exemplaire ${n} sur ${max}. `,
  works: site => `Elle travaille pour ${site} depuis sa pose. Tu peux la déplacer gratuitement sur une autre case libre autour du bâtiment.`
};

// La fiche d'un quartier (ZoneSheet) : une terre inconnue (ce qu'emporte l'expédition, où elle en est, ce qui
// l'empêche), puis un quartier à acheter
export const ZONE_SHEET = {
  unknown: 'Une brume légère couvre cette terre : on devine son relief. Une expédition révélera son climat et ce qu’elle cache. Elle emporte :',
  tripMine: left => `Ton expédition est en route : retour dans ${left}.`,
  tripElsewhere: 'Une expédition est déjà en route ailleurs : attends son retour.',
  closed: 'Les terres alentour s’ouvrent quand le cœur de l’île est à toi.',
  coreLeft: names => ` Il te manque : ${names}.`,
  far: 'Une expédition part d’un quartier à toi, vers un quartier voisin : achète d’abord un quartier qui touche celui-ci.',
  // (une seule phrase, en trois morceaux : le milieu, seulement si le quartier abrite des bâtiments)
  grow: 'Agrandis ton île',
  growSites: names => ` : ce quartier abrite ${names}`,
  growEnd: ', et de la place pour tes créations.'
};
