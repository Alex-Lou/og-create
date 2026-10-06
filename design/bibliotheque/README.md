# Bibliothèque d'assets SVG de l'île

4 669 dessins SVG au trait de la troupe : personnages, avatar du joueur, naufragés, égarés, animaux, plantes, décor, camp, ruines,
bâtiments, météo et les scènes du tutoriel. Chaque dessin est calé sur les cadres et les ancres du jeu, pour se poser tel quel.

**Par où commencer** :
- `index.html` montre tout, chapitre après chapitre, dans l'ordre du parcours du joueur (`HISTOIRE.md`, version 6). Survoler ou toucher un dessin l'anime.
- `catalogue.json` en donne la liste complète, une entrée par dessin : fichiers dans l'ordre des images, cadre, vitesse, vue, sens, chapitre du parcours, statut.
- Les planches (`planches/`) montrent chaque lot, les pages `apercus/` les montrent en mouvement.

## Le catalogue

Chaque entrée de `catalogue.json` est un dessin, fixe ou animé :

| Champ | Ce qu'il dit |
| --- | --- |
| `id` | le chemin du dessin sans le numéro d'image, par exemple `animaux/ferme/poule-rousse/poule-rousse_avant_marche` |
| `titre` | son nom en clair : « Poule rousse, trois quarts avant, marche » |
| `fichiers` | les images, dans l'ordre (chemins relatifs à ce dossier) |
| `images`, `ms_par_image` | le nombre d'images, et la durée de chacune (un nombre, ou une durée par image) |
| `cadre` | le `viewBox` : x, y, largeur, hauteur autour de l'ancre (0, 0) |
| `vue`, `regarde`, `miroir` | pour les personnages et les bêtes : la vue, où le dessin regarde, et si le miroir donne l'autre côté |
| `parcours` | le chapitre où il sert d'abord : `tuto-1` à `tuto-3`, `acte-1` à `acte-7`, `revelation`, `epilogue`, `evolutions`, `partout` |
| `statut`, `note` | `ok`, ou `a-revoir` avec la raison (les corrections prévues) |

`catalogue.json` liste aussi les **chapitres** (dans l'ordre) et les **dessins qui manquent encore**, chapitre par
chapitre. Les index de chaque lot (`decor.json`, `batiments.json`, `orientees.json`…) restent la référence pour les
détails propres à un lot : places des objets de boutique, lumières des paliers, cadre du nom des enseignes, teintes.

## Conventions communes

- **Échelle** : celle du jeu × 1,25. Une case iso fait 80 × 40 px (2:1). Un point du sol (u, v), à la hauteur z, tombe
  en `x = (u − v) × 40`, `y = (u + v) × 20 − 1,25 × z`.
- **Lumière** : en haut à gauche. Le dessus est clair, la face gauche moyenne, la face droite sombre.
- **Trait** : brun `#3C2819` (1,1 px sur les silhouettes, 0,9 px sur les faces). Les teintes ne le changent pas.
- **Ancre (0, 0)** : le `viewBox` de chaque SVG est le cadre du jeu, placé autour de cette ancre.

  | Assets | Ancre |
  | --- | --- |
  | Personnages, animaux | les pieds |
  | Décor, plantes | le centre de la case |
  | Bâtiments | le centre de l'emprise (2 × 2 ou 3 × 3 cases) |
  | Enseignes | le pied |
  | Bateaux | la ligne de flottaison |

- **Noms des personnages et des bêtes** : `<sujet>_<vue>_<pose>[_<variante>]_<n>.svg`.
  - Le sujet n'a pas de « _ » : les mots se lient par « - » (`aster-naufrage`, `poule-rousse`, `visiteur-03`).
  - La vue est `face`, `avant` (trois quarts avant), `dos` (trois quarts dos) ou `profil`.
  - Le numéro d'image `n` commence à 1. Un dessin fixe n'a pas de numéro.
  - Exemples : `aster_avant_marche_content_2.svg`, `poule-rousse_profil_repos.svg`, `vache_dos_marche_1.svg`.
- **Noms des autres dessins** : `<sujet>_<état>_<n>.svg` (`coffre_rare_ouverture_3.svg`, `foyer_palier2_1.svg`).
- **Directions** : `avant` vient vers le bas à droite, `dos` s'éloigne vers le haut à droite, `profil` regarde à droite.
  Le miroir (`transform: scaleX(-1)`) donne l'autre côté. Les dessins de face n'ont pas de miroir. Le kit du grand
  format (maîtres, naufragés, Anya, le Passeur) dessine son trois quarts avant vers le bas à gauche : la bibliothèque
  publie ces vues en miroir, pour que la règle soit la même partout (et la même que dans le jeu).
- **Animation** : `ms_par_image` dans le catalogue (et `ips` = images par seconde du jeu dans certains index de lot).

## Contenu

| Dossier | Contenu | SVG |
| --- | --- | ---: |
| `svg/personnages/maitres/` | Les 7 maîtres : Aster, Cannelle, Rivet, Ondin, Sylve, Galet, Mélisse. 3 vues : marche, repos, salut, travail (le geste du métier), action, 8 expressions, expressions en marche ; lanterne et parapluie (avant et dos) ; endormis assis (`dort`) et couchés (`couche`) | 560 |
| `svg/personnages/visiteurs/` | 12 visiteurs tirés du générateur de l'avatar (leurs choix dans `quotidien.json`) : 3 vues, marche, repos, salut, lanterne, parapluie, couchés | 504 |
| `svg/personnages/naufrages/<prénom>/` | Les maîtres tels qu'ils arrivent sur l'île (`<prénom>-naufrage_…`) : une tenue de naufragé à chacun, mêmes vues, poses et expressions, endormis assis et couchés ; lanterne et parapluie pour Aster et Rivet (`naufrages.json`, `quotidien.json`) | 480 |
| `svg/personnages/avatar/` | L'avatar du joueur : 12 exemples tirés du générateur et leur version naufragée, poses, gestes du tutoriel (ramasser, grelotter, lire), expressions ; dans `avatar.json` : les formes, les nuanciers, les 36 accessoires (rareté, source) et les teintures rares | 448 |
| `svg/personnages/epilogue/` | 8 nouveaux venus de l'épilogue, tirés du générateur de l'avatar, en habits de voyage (valise à la main, bagage sur le dos) : 3 vues, marche, repos, salut | 192 |
| `svg/vivants/` | Brume (8 stades et ses variantes), Anya, le cerf blanc, le Passeur | 128 |
| `svg/animaux/` | Ferme, bois, eau douce, climats, bestiaire, familiers, mer : de profil, et de trois quarts avant et dos pour les 37 bêtes qui marchent (`orientees.json`) ; le crabe de la Grève (`mer/crabe/crabe.json`) | 541 |
| `svg/plantes/` | Arbres (l'arbre refait en 8 variantes : grand ou petit, vert doux ou profond, pied sobre ou fleuri ; `arbre` est celui par défaut), pommiers (16 variantes : en pommes ou en fleurs, pied sobre ou pommes ou pétales tombés, grand ou petit, vert doux ou profond ; `pommier` est celui par défaut), arbres d'automne (8 variantes : orange ou rouge, grand ou petit, pied sobre ou feuilles tombées ; `arbre_automne` est celui par défaut), bouleaux (8 variantes, comme l'arbre ; `bouleau` est celui par défaut), sapins et sapins enneigés (8 variantes chacun : grand ou petit, vert doux ou profond, pied sobre ou pommes de pin, ou congère en neige ; `sapin` et `sapin_neige` par défaut), palmiers (8 variantes : grand ou petit, vert doux ou profond, pied sobre ou noix de coco tombées ; `palmier` est celui par défaut), arbres morts (8 variantes : gris ou brun, grand ou petit, pied sobre ou champignons ; `arbre_mort` est celui par défaut), touffes d'herbe (16 variantes : avec ou sans motte, grande ou petite, vert doux ou profond, sobre ou fleurie ; `touffe` est celle par défaut), buissons (8 variantes : fleuris ou à baies, grand ou petit, vert doux ou profond ; `buisson`, fleuri, par défaut), bruyères (8 variantes : mauve ou rose, grande ou petite, avec ou sans papillon posé ; `bruyere` par défaut), fleurs (8 variantes : bouquet mélangé ou marguerites, grand ou petit, avec ou sans abeille ; `fleurs` par défaut), cactus (8 variantes : cierge à bras ou en boule, grand ou petit, fleuri ou non ; `cactus`, cierge fleuri, par défaut), souches (8 variantes : écorce brune ou grise, grande ou petite, une pousse ou des champignons ; `souche` par défaut), rondins (8 variantes : écorce brune ou grise, grand ou petit, mousse et pousse ou champignons ; `rondin` par défaut), champignons (8 variantes : amanites rouges ou cèpes bruns, grands ou petits, de jour ou la nuit, où ils luisent ; `champignons` et `champignons_nuit` gardent leurs noms), roseaux (8 variantes : dans une mare ou sur la rive, grands ou petits, avec ou sans libellule ; `roseaux` par défaut), nénuphars (8 variantes : fleurs roses ou blanches, grands ou petits, avec ou sans grenouille ; `nenuphars` par défaut), rocher (8 variantes : granite gris ou grès ocre, grand ou petit, avec ou sans lézard au soleil ; `rocher` par défaut), rochers en tas (8 variantes : granite gris ou pierre sombre, grands ou petits, avec ou sans galets au pied ; `rochers` par défaut), aiguilles de roche (8 variantes : seule ou double, grande ou petite, avec ou sans oiseau perché à la pointe ; `aiguille` par défaut), rochers moussus (8 variantes : grands ou petits, mousse sobre ou fleurie, avec ou sans escargot ; `rochers_moussus` par défaut), bois flotté, nid, lanterne sur pied, banc | 198 |
| `svg/decor/` | 30 créations d'île, 14 lieux remarquables, 6 gisements (prêt et ramassé), 28 annexes et leurs variantes, 6 enseignes, îlots, bateaux, épaves (`decor.json`) | 385 |
| `svg/decor/camp/` | Le camp des naufragés : l'épave de l'Hirondelle, les coins des maîtres, les objets du camp, la tente et le hamac des voyageurs (`camp.json`) ; la cage aux poules du navire (coincée, ouverte) et l'œuf avec son icône (`poules/poules.json`) | 46 |
| `svg/decor/embrume/` | Le bâtiment embrumé : un calque de brume par emprise (1 × 1, 2 × 2, 3 × 3) et sa guérison, le petit nuage grognon à poser au-dessus, l'icône « Réparer » (`embrume.json`) | 22 |
| `svg/decor/signes/` | Les signes d'Anya qui erre : des fleurs qui s'ouvrent, des lucioles rassemblées (`signes.json`) | 8 |
| `svg/decor/ruines/` | Ce qui reste des Anciens : maison en ruine, colonnade, pierre à runes (jour, nuit), colonne brisée, la clé du phare, le phare éteint (`ruines.json`) | 9 |
| `svg/egares/` | Les égarés, la nuit (`HISTOIRE.md` § 6.15) : petit fantôme, petit zombie tout mou, 7 bêtes de brume (une par climat) ; trois quarts avant et dos, marche, bouderie au toucher, fuite devant Anya, passage en luciole, retour dans la brume ; trait bleu nuit, celui de la famille de la brume (`egares.json`) | 171 |
| `svg/coffres/` | Les coffres des 4 raretés pour la fenêtre d'ouverture (cadre 120 × 100) : fermé, ouverture en 4 images, ouvert, rayons (calque facultatif), icône 32 × 32 (`coffres.json`) | 44 |
| `svg/batiments/` | 7 bâtiments × 7 paliers (images animées), chantier, 20 skins, 48 objets de la boutique (un fichier par calque), 14 pièces rares à chaque palier, outil de teintes (`batiments.json`) | 659 |
| `svg/scenes/tutoriel/` | Les 27 scènes plein écran du tutoriel v6 (`HISTOIRE.md` § 9, étapes 0 à 12) : la carte d'embarquement, le naufrage, Brume, le Grimoire, le feu, la silhouette, l'arrivée de Cannelle, Rivet, Aster et Ondin, la veillée. Carré 400 × 400, un fond et parfois un devant, en boucle ; la place de l'avatar dans `scenes.json` | 105 |
| `svg/meteo/` | Calques d'écran sans couture en boucle, nuages, arc-en-ciel, éclair, soleil bas, lumières, teintes des moments du jour, 19 icônes (`meteo.json`) | 169 |

## Mode d'emploi rapide

- **Un dessin** : `<img src="svg/plantes/arbre.svg">`, ou le SVG en ligne. Au canvas, `drawImage` d'une `Image` pointant
  vers le fichier, à la position de l'ancre moins le coin du `viewBox`.
- **Une animation** : prendre `fichiers` et `ms_par_image` dans `catalogue.json`, et enchaîner les images en boucle.
- **Calques météo** (`svg/meteo/temps|climats|ciel`) : ce sont des tuiles. Les poser en `background-repeat`, puis
  enchaîner les images. Les fichiers marqués « étirer » se posent sur tout l'écran. Les teintes des moments se posent en
  `mix-blend-mode: multiply`, le soleil bas en `screen`.
- **Enseignes** : le nom du joueur n'est pas dessiné. Il s'écrit dans `cadre_du_nom` (`decor.json` : centre, largeur et
  hauteur max, corps et couleur de police du jeu).
- **Objets de la boutique** : chaque calque est ancré à sa place au sol. Sa `place` par palier (en cases, autour du
  centre du bâtiment) est dans `batiments.json`. Les calques marqués `derriere` se peignent avant le bâtiment.
- **L'avatar** : il se compose à partir des choix du joueur, il ne se dessine pas à l'avance : `design/personnages/avatar.js`
  (`avatar(choix)`, à passer à `troupe.frame`), ses choix et ses accessoires dans `avatar_choix.js` (nuanciers, formes,
  accessoires avec leur rareté et leur source, teintures rares, `auHasard`, `verifier`) ; naufragé :
  `design/atelier/avatar_naufrage.js` (la mer garde les chapeaux, les sacs et ce qu'on tient). Les nuanciers sont libres ;
  les accessoires « boutique » ou « coffre » et les teintures rares se gagnent pour toujours ; tout est cosmétique. Les
  fichiers de `svg/personnages/avatar/` sont des exemples. `design/atelier/verif_avatar.mjs` vérifie qu'aucun choix ne
  casse le dessin ni ne sort du cadre.
- **Égarés** : en marche, `marche` en boucle (avant ou dos, le miroir pour les deux autres directions). Touché : `bouderie`
  (une fois), puis `brume` (une fois) : il retourne dans la brume. Une lumière à 2 cases : `luciole` (une fois) ; la
  luciole peut ensuite rejoindre les lumières de la nuit. Anya passe : `fuite` en boucle, en s'éloignant d'elle. La bête de
  brume est celle du climat du morceau d'île d'où vient la nuit (le lapin au cœur, tempéré).
- **Bâtiment embrumé** : griser le bâtiment (filtre CSS, par exemple `grayscale(.8)`), poser par-dessus le calque
  `embrume_<n>x<n>` de son emprise (même ancre que le bâtiment) et le petit nuage au-dessus, comme une bulle. À la
  réparation ou au passage d'Anya : `embrume_<n>x<n>_guerison` une fois, puis retirer le filtre.
- **Le quotidien** (`svg/personnages/quotidien.json`) : marche (face, avant, dos), repos et salut dans les trois vues,
  travail, lanterne et parapluie (avant et dos), dormir couché. Le parapluie a un cadre plus haut (`[0, -18, 48, 82]`,
  pieds toujours en (24, 62)), le couché un cadre 64 × 48 (la tête à gauche). Pour d'autres visiteurs : `avatar(choix)`
  et `auHasard(graine)` (`design/personnages/avatar.js`), les gestes dans `design/atelier/gestes.js`.
- **Scènes du tutoriel** (`svg/scenes/tutoriel/scenes.json`) : dans le carré 400 × 400 de PrologueArt (recadré au
  centre), peindre le fond, puis l'avatar du joueur à la place notée dans `avatar` (ses pieds en x, y ; son cadre
  48 × 64 agrandi `echelle` fois ; `vue`, `miroir`, `pose`, tenue naufragée ou non ; `cadre` : la photo de la carte
  d'embarquement, où il est découpé), puis le devant. Les images tournent en boucle à `ms_par_image`, l'avatar suit le
  même numéro d'image. Les répliques, le nom et la légende s'écrivent par le jeu.
- **Naufragés** : un maître garde le look du naufragé jusqu'à son souvenir retrouvé (`HISTOIRE.md` § 8 à 10 : Cannelle
  dès l'étape 7 du tutoriel, Ondin à l'étape 11, Sylve à l'acte I, Galet à l'acte II, Mélisse à son réveil, Rivet à
  l'acte III, Aster à l'acte IV), puis prend celui de `maitres/`.
- **Teintes** (84 skins vendus = 12 teintes × 7 bâtiments) : on recolore, on ne redessine pas. Exemple :
  `import { tintSvg } from './svg/batiments/teintes/teinter.mjs'`, puis `tintSvg(svg, 'sakura')`.

## Ce qui n'est pas encore dessiné, ou pas du tout

- **Le petit format n'existe plus** (choix de l'auteur, 6 octobre) : tout le monde est dessiné en détaillé (lot L4).

- **Ce qui manque encore** est listé dans `catalogue.json` (`manquants`) et en tête de chaque chapitre d'`index.html` :
  les bâtiments de défense (à concevoir), l'éclat du souvenir retrouvé…
- **Les 84 teintes en images** : elles se tirent du dessin avec l'outil de teintes, plutôt que 588 fichiers figés.
- **Relief, falaises, mer, île flottante** : le jeu les peint case par case au canvas. Ce ne sont pas des sprites.
- **Visiteurs** : le jeu en tire autant qu'il veut d'une graine. Les 12 fournis sont des exemples.
- **Héliane** : on ne la montre jamais (choix de l'histoire). Le joueur, lui, a désormais un avatar (`HISTOIRE.md` § 6.17).
- **Le Cercle de menhirs** : il est déjà dans les lieux remarquables (`svg/decor/lieux/menhirs_*`), les ruines ne le
  refont pas.
