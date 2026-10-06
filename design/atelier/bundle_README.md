# Bibliothèque d'assets SVG de l'île

3 404 dessins SVG au trait de la troupe : personnages, naufragés, animaux, plantes, décor, camp, ruines, bâtiments et
météo. Chaque dessin est
calé sur les cadres et les ancres du jeu, pour se poser tel quel.

Ouvrir `index.html` pour tout voir. Les planches (`planches/`) montrent chaque lot ; les pages `apercus/` les montrent
en mouvement.

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

- **Noms de fichiers** : `<nom>_<pose ou variante>_<n>.svg`. Le numéro d'image `n` commence à 1. Un dessin fixe n'a
  pas de numéro.
- **Directions** : les personnages ont trois vues (face, trois quarts avant, dos). Les animaux sont de profil, tournés
  vers la droite. Le miroir (`transform: scaleX(-1)`) donne l'autre sens.
- **Animation** : le JSON de chaque lot donne la vitesse (`ms_par_image`, ou `ips` = images par seconde du jeu).

## Contenu

| Dossier | Contenu | SVG |
| --- | --- | ---: |
| `svg/personnages/maitres/` | Les 7 maîtres : Aster, Cannelle, Rivet, Ondin, Sylve, Galet, Mélisse. 3 vues, marche, repos, salut, action, 8 expressions ; endormis (`dort`) ; expressions en marche propres à chacun (`avant_marche_<expression>`) | 308 |
| `svg/personnages/habitants/` | Les mêmes au petit format du jeu : marche, repos, salut, travail, sommeil, lanterne, parapluie | 280 |
| `svg/personnages/visiteurs/` | 12 visiteurs types, tirés d'une graine comme dans le jeu (`pnj_jeu.json`) | 408 |
| `svg/personnages/naufrages/<prénom>/` | Les maîtres tels qu'ils arrivent sur l'île : une tenue de naufragé à chacun, mêmes vues, poses et expressions, endormis, expressions en marche, plans d'entrée du tutoriel (Aster, Cannelle, Rivet, Ondin) (`naufrages.json`) | 316 |
| `svg/personnages/naufrages/petit_format/` | Les mêmes au petit format du jeu (`petit_format.json`) | 224 |
| `svg/personnages/naufrages/epilogue/` | 8 nouveaux naufragés de l'épilogue, tirés d'une graine | 208 |
| `svg/vivants/` | Brume (8 stades et ses variantes), Anya, le cerf blanc, le Passeur | 128 |
| `svg/animaux/` | Ferme, bois, eau douce, climats, bestiaire, familiers, mer | 240 |
| `svg/plantes/` | Arbres, buissons, fleurs, rochers, bois flotté, nid, lanterne, banc | 29 |
| `svg/decor/` | 30 créations d'île, 14 lieux remarquables, 6 gisements (prêt et ramassé), 28 annexes et leurs variantes, 6 enseignes, îlots, bateaux, épaves (`decor.json`) | 385 |
| `svg/decor/camp/` | Le camp des naufragés : l'épave de l'Hirondelle, le feu de débris, le coin de chaque maître (débris → abri → cabanon), les objets du camp, la tente et le hamac des voyageurs ; l'étape de l'histoire de chaque chose (`camp.json`) | 41 |
| `svg/decor/ruines/` | Ce qui reste des Anciens : maison en ruine, colonnade, pierre à runes (jour, nuit), colonne brisée, la clé du phare, le phare éteint (`ruines.json`) | 9 |
| `svg/batiments/` | 7 bâtiments × 7 paliers (images animées), chantier, 20 skins, 48 objets de la boutique (un fichier par calque), 14 pièces rares à chaque palier, outil de teintes (`batiments.json`) | 659 |
| `svg/meteo/` | Calques d'écran sans couture en boucle, nuages, arc-en-ciel, éclair, soleil bas, lumières, teintes des moments du jour, 19 icônes (`meteo.json`) | 169 |

## Mode d'emploi rapide

- **Un dessin** : `<img src="svg/plantes/arbre.svg">`, ou le SVG en ligne. Au canvas, `drawImage` d'une `Image` pointant
  vers le fichier, à la position de l'ancre moins le coin du `viewBox`.
- **Calques météo** (`svg/meteo/temps|climats|ciel`) : ce sont des tuiles. Les poser en `background-repeat`, puis
  enchaîner les images. Les fichiers marqués « étirer » se posent sur tout l'écran. Les teintes des moments se posent en
  `mix-blend-mode: multiply`, le soleil bas en `screen`.
- **Enseignes** : le nom du joueur n'est pas dessiné. Il s'écrit dans `cadre_du_nom` (`decor.json` : centre, largeur et
  hauteur max, corps et couleur de police du jeu).
- **Objets de la boutique** : chaque calque est ancré à sa place au sol. Sa `place` par palier (en cases, autour du
  centre du bâtiment) est dans `batiments.json`. Les calques marqués `derriere` se peignent avant le bâtiment.
- **Naufragés** : un maître garde le look du naufragé jusqu'à son souvenir retrouvé (son bâtiment fondé), puis prend celui
  de `maitres/`. Son coin du camp reste son toit ; `camp.json` dit à quelle étape chaque chose apparaît et ce qui lui
  succède (propositions tirées de `HISTOIRE.md`, à valider à l'intégration).
- **Teintes** (84 skins vendus = 12 teintes × 7 bâtiments) : on recolore, on ne redessine pas. Exemple :
  `import { tintSvg } from './svg/batiments/teintes/teinter.mjs'`, puis `tintSvg(svg, 'sakura')`.

## Ce qui n'est pas dessiné, et pourquoi

- **Mobs** : il n'y en a aucun dans le jeu (ton doux). Rien n'a été inventé.
- **Les 84 teintes en images** : elles se tirent du dessin avec l'outil de teintes, plutôt que 588 fichiers figés.
- **Relief, falaises, mer, île flottante** : le jeu les peint case par case au canvas. Ce ne sont pas des sprites.
- **Visiteurs** : le jeu en tire autant qu'il veut d'une graine. Les 12 fournis sont des exemples.
- **Le joueur et Héliane** : on ne les montre jamais (choix de l'histoire).
- **Le Cercle de menhirs** : il est déjà dans les lieux remarquables (`svg/decor/lieux/menhirs_*`), les ruines ne le
  refont pas.
