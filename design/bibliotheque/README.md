# Bibliothèque d'assets SVG de l'île

4 703 dessins SVG au trait de la troupe : personnages, avatar du joueur, naufragés, égarés, animaux, plantes, décor, camp, ruines,
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
| `svg/personnages/maitres/` | Les 7 maîtres : Aster, Cannelle, Rivet, Ondin, Sylve, Galet, Mélisse. 3 vues : marche, repos, salut, travail (le geste du métier), action, 8 expressions, expressions en marche ; lanterne et parapluie (avant et dos) ; endormis assis (`dort`) et couchés (`couche`) ; en hiver, chacun à son style, et sous la pluie (le ciré du catalogue, ouvert ; Aster et Ondin relèvent la capuche du leur ; bottes de pluie), repos et marche dans les 3 vues (`<prénom>_<vue>_<pose>_<hiver\|pluie>_<n>`) | 1400 |
| `svg/personnages/visiteurs/` | 12 visiteurs tirés du générateur de l'avatar (leurs choix dans `quotidien.json`) : 3 vues, marche, repos, salut, lanterne, parapluie, couchés | 504 |
| `svg/personnages/naufrages/<prénom>/` | Les maîtres tels qu'ils arrivent sur l'île (`<prénom>-naufrage_…`) : une tenue de naufragé à chacun, mêmes vues, poses et expressions, endormis assis et couchés ; lanterne et parapluie pour Aster et Rivet (`naufrages.json`, `quotidien.json`) | 480 |
| `svg/personnages/avatar/` | L'avatar du joueur : 12 exemples tirés du générateur et leur version naufragée, poses, gestes du tutoriel (ramasser, grelotter, lire), expressions ; dans `avatar.json` : les formes, les nuanciers, les 45 accessoires (rareté, source, prix ; saison des tenues de saison ; leur icône) et les teintures rares (avec leur prix) | 2464 |
| `svg/personnages/objets/` | Les icônes des objets de l'avatar, pour la boutique et l'inventaire (32 × 32, couleurs par défaut) : `<objet>_icone`, le chemin dans `avatar.json` (`icone`). Pour l'instant les tenues de saison, le bonnet et l'écharpe | 11 |
| `generateur/` | Les générateurs en modules ESM, pour le jeu et pour l'outil `generer.mjs` : l'avatar (`avatar.mjs`), les chantiers (`chantiers.mjs`), les bêtes (`betes.mjs`), les icônes de l'interface (`interface.mjs`), le HUD de l'île (`hud.mjs`), l'interface du joueur (`perso.mjs`), les objets de la boutique et la torche (`objets.mjs`), les plantes, rochers et petits décors (`plantes.mjs`), la météo (`meteo.mjs`), les coffres (`coffres.mjs`), le décor iso (`decor.mjs`), les bâtiments (`batiments.mjs`), les vivants (`vivants.mjs`), les scènes du tutoriel (`scenes.mjs`), les personnages au grand format (`personnages.mjs`), les exemples d'avatar et les icônes de ses objets (`exemples.mjs`) ; voir le mode d'emploi | — |
| `svg/interface/` | Les icônes de l'interface (32 × 32) : la barre du bas (Grimoire, Île, Défis, Sceau ; le sac, les tâches et le menu de la v6), l'écu, les ressources (pierre, bois, eau, nourriture, poisson), les boutons de l'île (Récolte, Tout ramasser, carnet, trouvailles, expédition) ; les fiches (outils, fleur, trois humeurs, cœur, verrou, inconnu, étincelle, chapitre, plan, carte, pousse) ; les trouvailles des climats (glace, laine, roseau, sel, fruits, obsidienne) ; les commandes en pastilles (fermer, retour, flèche, valider, zoom avant et arrière, plein écran, réglages, son, son coupé, musique) ; les actions des bâtiments (bâtir, faire évoluer, annexes, déplacer, tourner, temps) ; récompenses et boutique (étoile, cadeau, coffre, boutique, quête, succès, nouveau) ; le perso et les autres (profil, garde-robe, amis, visites, messages, notifications) ; où le jeu s'en sert dans `interface.json` | 67 |
| `svg/hud/` | Le HUD de l'île en bois et parchemin : la barre du haut (bourse d'écus, tuile d'une réserve, boutons Récolte et « Tout ramasser » au repos, appuyés, désactivés), les boutons posés sur l'île (bouton carré au repos, prêt, appuyé ; bouton de zoom ; étiquette de la boussole ; pastille de compte), l'horloge (cadre au repos et en accéléré, cadran de jour et de nuit, soleil, lune), la barre d'onglets (barre, médaillon au repos et actif, point « nouveau ») ; en haute définition (taille déclarée × 4) ; les cadres extensibles et leur tranche dans `hud.json` | 25 |
| `svg/perso/` | L'interface du joueur en bois et parchemin, comme le HUD : l'éditeur de l'avatar (estrade de l'aperçu, onglets au repos et actif, pastilles de choix, cadres des nuanciers, boutons « tourner », bouton « Au hasard », panneau), la page du Sceau (ruban du nom, tuile d'un compteur, ligne de menu au repos et appuyée, barre de progression), la carte d'embarquement de l'Hirondelle, un vrai billet (neuve, tamponnée « EMBARQUÉ », trempée par le naufrage) ; en haute définition (taille déclarée × 4) ; tranches et zones (photo, nom, pieds de l'avatar) dans `perso.json` | 21 |
| `svg/personnages/epilogue/` | 8 nouveaux venus de l'épilogue, tirés du générateur de l'avatar, en habits de voyage (valise à la main, bagage sur le dos) : 3 vues, marche, repos, salut | 192 |
| `svg/vivants/` | Brume (8 stades et ses variantes), Anya (son manteau vivant aux quatre saisons : `anya_<vue>_<pose>_<printemps\|automne\|hiver>_<n>`, l'été sans suffixe), le cerf blanc, le Passeur | 191 |
| `svg/animaux/` | Ferme, bois, eau douce, climats, bestiaire, familiers, mer : de profil, et de trois quarts avant et dos pour les 43 bêtes qui marchent (`orientees.json`) ; le chat et le chien en quatre pelages chacun (chat roux tigré, noir, gris tigré, blanc taché ; chien beige, noir et blanc, brun, roux), qui s'assoient et dorment aussi (assis et dodo, 2 images chacun, dans les trois vues) ; le crabe de la Grève (`mer/crabe/crabe.json`) ; la mouette en vol (`mer/mouette-vol` : envol en 3 images, vol battu en 4, plané) | 727 |
| `svg/plantes/` | Arbres (l'arbre refait en 8 variantes : grand ou petit, vert doux ou profond, pied sobre ou fleuri ; `arbre` est celui par défaut), pommiers (16 variantes : en pommes ou en fleurs, pied sobre ou pommes ou pétales tombés, grand ou petit, vert doux ou profond ; `pommier` est celui par défaut), arbres d'automne (8 variantes : orange ou rouge, grand ou petit, pied sobre ou feuilles tombées ; `arbre_automne` est celui par défaut), bouleaux (8 variantes, comme l'arbre ; `bouleau` est celui par défaut), sapins et sapins enneigés (8 variantes chacun : grand ou petit, vert doux ou profond, pied sobre ou pommes de pin, ou congère en neige ; `sapin` et `sapin_neige` par défaut), palmiers (8 variantes : grand ou petit, vert doux ou profond, pied sobre ou noix de coco tombées ; `palmier` est celui par défaut), arbres morts (8 variantes : gris ou brun, grand ou petit, pied sobre ou champignons ; `arbre_mort` est celui par défaut), touffes d'herbe (16 variantes : avec ou sans motte, grande ou petite, vert doux ou profond, sobre ou fleurie ; `touffe` est celle par défaut), buissons (8 variantes : fleuris ou à baies, grand ou petit, vert doux ou profond ; `buisson`, fleuri, par défaut), bruyères (8 variantes : mauve ou rose, grande ou petite, avec ou sans papillon posé ; `bruyere` par défaut), fleurs (8 variantes : bouquet mélangé ou marguerites, grand ou petit, avec ou sans abeille ; `fleurs` par défaut), cactus (8 variantes : cierge à bras ou en boule, grand ou petit, fleuri ou non ; `cactus`, cierge fleuri, par défaut), souches (8 variantes : écorce brune ou grise, grande ou petite, une pousse ou des champignons ; `souche` par défaut), rondins (8 variantes : écorce brune ou grise, grand ou petit, mousse et pousse ou champignons ; `rondin` par défaut), champignons (8 variantes : amanites rouges ou cèpes bruns, grands ou petits, de jour ou la nuit, où ils luisent ; `champignons` et `champignons_nuit` gardent leurs noms), roseaux (8 variantes : dans une mare ou sur la rive, grands ou petits, avec ou sans libellule ; `roseaux` par défaut), nénuphars (8 variantes : fleurs roses ou blanches, grands ou petits, avec ou sans grenouille ; `nenuphars` par défaut), rocher (8 variantes : granite gris ou grès ocre, grand ou petit, avec ou sans lézard au soleil ; `rocher` par défaut), rochers en tas (8 variantes : granite gris ou pierre sombre, grands ou petits, avec ou sans galets au pied ; `rochers` par défaut), aiguilles de roche (8 variantes : seule ou double, grande ou petite, avec ou sans oiseau perché à la pointe ; `aiguille` par défaut), rochers moussus (8 variantes : grands ou petits, mousse sobre ou fleurie, avec ou sans escargot ; `rochers_moussus` par défaut), coquillages (8 variantes : coloris chauds ou nacrés, grands ou petits, avec ou sans étoile de mer ; `coquillages` par défaut), bois flotté (8 variantes : bois blanchi ou mouillé sombre, grand ou petit, avec ou sans algues accrochées ; `bois_flotte` par défaut), nids de mouettes (8 variantes : trois œufs ou deux poussins, grand ou petit, avec ou sans plume ; `nid` par défaut), lanternes sur pied (8 variantes : poteau de bois ou de fer, avec ou sans lierre, éteinte ou allumée ; `lanterne` et `lanterne_allumee` gardent leurs noms), bancs (8 variantes : trois ou deux places, bois naturel ou peint en vert, avec ou sans chat endormi ; `banc` par défaut) ; les arbres de saison, trois essences par saison en trois tailles (grand, `_moyen`, `_petit`) et deux teintes : printemps (cerisier en fleurs, magnolia, saule tendre), été (chêne touffu, tilleul en fleurs, pin parasol), automne (érable rouge, ginkgo doré, chêne roux), hiver (bouleau nu, houx, sapin givré) ; `saisons.json` range chaque arbre de saison dans la sienne | 330 |
| `svg/decor/` | 30 créations d'île, 14 lieux remarquables, 6 gisements (prêt, ramassé et deux étapes de repousse), 28 annexes et leurs variantes, 6 enseignes, îlots, bateaux, épaves (`decor.json`) | 409 |
| `svg/decor/camp/` | Le camp des naufragés : l'épave de l'Hirondelle, les coins des maîtres, les objets du camp, la tente et le hamac des voyageurs (`camp.json`) ; la cage aux poules du navire (coincée, ouverte) et l'œuf avec son icône (`poules/poules.json`) | 46 |
| `svg/decor/defenses/` | La torche de bois flotté, objet de la boutique posé sur une case (étape 12) : allumée (3 images), éteinte, son icône, sa lumière de nuit (`defenses.json`) ; le même dessin que la torche du camp et celle de la veillée | 5 |
| `svg/decor/embrume/` | Le bâtiment embrumé : un calque de brume par emprise (1 × 1, 2 × 2, 3 × 3) et sa guérison, le petit nuage grognon à poser au-dessus, l'icône « Réparer » (`embrume.json`) | 22 |
| `svg/decor/signes/` | Les signes d'Anya qui erre : des fleurs qui s'ouvrent, des lucioles rassemblées (`signes.json`) | 8 |
| `svg/decor/ruines/` | Ce qui reste des Anciens : maison en ruine, colonnade, pierre à runes (jour, nuit), colonne brisée, la clé du phare, le phare éteint (`ruines.json`) | 9 |
| `svg/egares/` | Les égarés, la nuit (`HISTOIRE.md` § 6.15) : petit fantôme, petit zombie tout mou, 7 bêtes de brume (une par climat) ; trois quarts avant et dos, marche, bouderie au toucher, fuite devant Anya, passage en luciole, retour dans la brume ; trait bleu nuit, celui de la famille de la brume (`egares.json`) | 171 |
| `svg/coffres/` | Les coffres des 4 raretés pour la fenêtre d'ouverture (cadre 120 × 100) : fermé, ouverture en 4 images, ouvert, rayons (calque facultatif), icône 32 × 32 (`coffres.json`) | 44 |
| `svg/batiments/` | 7 bâtiments × 7 paliers (images animées), les mêmes l'hiver (toits enneigés), chantier, 20 skins, 48 objets de la boutique (un fichier par calque), 14 pièces rares à chaque palier, outil de teintes (`batiments.json`) | 793 |
| `svg/batiments/montage/` | Le montage d'un bâtiment, en 2 × 2 et 3 × 3 cases : six étapes en boucle (piquets, terrassement, fondations, charpente, murs, toit), le dévoilement par-dessus le bâtiment fini, l'échafaudage des évolutions en deux calques (`montage.json`) | 56 |
| `svg/batiments/reserves/` | Les réserves des 7 bâtiments (les récoltes), sur une case à côté d'eux : vide, à moitié, pleine (2 images, elle brille) (`reserves.json`) | 28 |
| `svg/decor/cultures/` | Les cultures par étapes, une case : le bêchage, les sillons, le semis, les pousses et la croissance, 3 images en boucle chacune ; puis le champ mûr de l'annexe (blé, carottes, citrouilles) ou l'étape mûre (laitues, choux, tomates, haricots, fraises, pommes de terre) (`cultures.json`) | 153 |
| `svg/decor/verger/` | Le verger par étapes, un arbre sur une case (pommier, poirier, cerisier, prunier, abricotier) : le trou, la plantation, le jeune arbre, la floraison, les fruits verts, les fruits mûrs, 3 images en boucle chacune (`verger.json`) | 90 |
| `svg/decor/lunaire/` | Le jardin lunaire de Mélisse, un carré rond sur une case (la mélisse, la lunaire, la fleur de lune, l'herbe des Anciens) : une étape par phase de la lune, de la nouvelle lune à la pleine lune, 3 images en boucle chacune (`lunaire.json`) | 60 |
| `svg/decor/climats/` | Une culture par climat, une case : myrtilles (cimes), sarrasin (landes), riz (marais), pastèques (dunes), ananas (jungle), piments (volcan), chacune son sol et son aménagement ; préparation, plantation, pousses, croissance, mûre, 3 images en boucle chacune (`climats.json`) | 90 |
| `svg/scenes/tutoriel/` | Les 28 scènes plein écran du tutoriel v6 (`HISTOIRE.md` § 9, étapes 0 à 12) : la carte d'embarquement, le naufrage, Brume, le Grimoire, le feu, la silhouette, l'arrivée de Cannelle, Rivet, Aster et Ondin, le chantier du Puits, la veillée. Carré 400 × 400, un fond et parfois un devant, en boucle ; la place de l'avatar dans `scenes.json` | 109 |
| `svg/meteo/` | Calques d'écran sans couture en boucle, nuages, arc-en-ciel, éclair, soleil bas, lumières, teintes des moments du jour ; les saisons : flocons, feuilles qui tombent, pétales, pollen, plein soleil, teintes, et le sol d'une case (neige, neige fondante, givre, flaques, eau gelée) ; 23 icônes (`meteo.json`) | 267 |

## Mode d'emploi rapide

- **Un dessin** : `<img src="svg/plantes/arbre.svg">`, ou le SVG en ligne. Au canvas, `drawImage` d'une `Image` pointant
  vers le fichier, à la position de l'ancre moins le coin du `viewBox`.
- **Une animation** : prendre `fichiers` et `ms_par_image` dans `catalogue.json`, et enchaîner les images en boucle.
- **Calques météo** (`svg/meteo/temps|climats|saisons|ciel`) : ce sont des tuiles. Les poser en `background-repeat`, puis
  enchaîner les images. Les fichiers marqués « étirer » se posent sur tout l'écran. Les teintes des moments se posent en
  `mix-blend-mode: multiply`, le soleil bas et le plein soleil en `screen`. Le sol des saisons (`svg/meteo/sol`) se pose
  case par case, ancre au centre de la case, sous le reste ; alterner les variantes a, b, c d'une case à l'autre.
- **Enseignes** : le nom du joueur n'est pas dessiné. Il s'écrit dans `cadre_du_nom` (`decor.json` : centre, largeur et
  hauteur max, corps et couleur de police du jeu).
- **Objets de la boutique** : chaque calque est ancré à sa place au sol. Sa `place` par palier (en cases, autour du
  centre du bâtiment) est dans `batiments.json`. Les calques marqués `derriere` se peignent avant le bâtiment.
- **L'hiver** : chaque palier a son double sous la neige (`svg/batiments/paliers_hiver/`, `paliers_hiver` dans
  `batiments.json`, son `ete` nomme le palier qu'il remplace). Même cadre, même ancre, mêmes images : on échange le fichier.
- **L'avatar** : il se compose à partir des choix du joueur, il ne se dessine pas à l'avance : `design/personnages/avatar.js`
  (`avatar(choix)`, à passer à `troupe.frame`), ses choix et ses accessoires dans `avatar_choix.js` (nuanciers, formes,
  accessoires avec leur rareté et leur source, teintures rares, `auHasard`, `verifier`) ; naufragé :
  `design/atelier/avatar_naufrage.js` (la mer garde les chapeaux, les sacs et ce qu'on tient). Les nuanciers sont libres ;
  les accessoires « boutique » ou « coffre » et les teintures rares se gagnent pour toujours ; tout est cosmétique. Les
  fichiers de `svg/personnages/avatar/` sont des exemples. `design/atelier/verif_avatar.mjs` vérifie qu'aucun choix ne
  casse le dessin ni ne sort du cadre. Les tenues de saison (manteau d'hiver et ciré « par-dessus », bottes « aux pieds »,
  moufles « aux mains » ; leur `saison` dans le catalogue : `hiver` ou `pluie`) se mettent par-dessus la tenue choisie ;
  elles ne se tirent pas au hasard. Le prix d'un objet ou d'une teinture (`prix`, en écus) suit sa rareté : commun 80,
  rare 200, épique 500, légendaire 1200 à la boutique ; 0 s'il est gratuit ; pas de prix s'il vient des coffres. Un seul
  dessin par objet : les maîtres portent les mêmes (`habiller`, dans `avatar_accessoires.js`). L'icône d'un objet aux
  couleurs choisies : `icone(id, couleurs)` (`design/personnages/avatar_icones.js`).
- **Le générateur dans le jeu** (`generateur/avatar.mjs`) : tout le générateur de l'avatar en un seul module ESM, à
  importer tel quel (Vite ne lit pas le CommonJS des sources) : `import { avatar, frame, svg } from
  '…/design/bibliotheque/generateur/avatar.mjs'`, puis `svg(frame(avatar(choix, { uid }), 'se', 'marche', n))`. Il
  exporte les choix (catalogue, nuanciers, prix, `verifier`, `auHasard`, `libelle`, `couleursAccessoire`), `avatar` et
  `avatarNaufrage`, `frame`, `svg` et les expressions, les gestes (`avec…`, `couche` et leurs cadres), `assis` et
  `SEAT`, `icone` ; la liste commentée est dans `design/atelier/generateur.mjs`. En SVG en ligne, un `uid` différent pour
  chaque personnage à l'écran : les découpes portent ce nom. Assemblé avec la bibliothèque, il dessine comme les sources
  à l'octet près (`design/atelier/verif_generateur.mjs`) ; ne pas le modifier à la main.
- **Les générateurs par famille** (`generateur/<famille>.mjs` : `chantiers.mjs`, `betes.mjs`, `interface.mjs`, `hud.mjs`, `perso.mjs`, `objets.mjs`, `plantes.mjs`, `meteo.mjs`, `coffres.mjs`, `decor.mjs`, `batiments.mjs`, `vivants.mjs`, `scenes.mjs`, `personnages.mjs`, `exemples.mjs`) : chaque fonction rend
  `{ svg, cadre, ms_par_image }`, le SVG complet, identique à l'octet au fichier de la bibliothèque (le fichier y ajoute
  un saut de ligne) : `import { etapeDuMontage } from '…/design/bibliotheque/generateur/chantiers.mjs'`, puis
  `etapeDuMontage('2x2', 'toit', 1).svg` ; les cultures : `etapeDeCulture(culture, etape, n)` (ex.
  `etapeDeCulture('citrouilles', 'croissance', 2)`), `CULTURES`, `PART_CULTURE` ; le verger : `etapeDuVerger(arbre, etape, n)`
  (ex. `etapeDuVerger('cerisier', 'floraison', 1)`), `VERGER`, `PART_VERGER` ; le jardin lunaire :
  `etapeLunaire(plante, etape, n)` (ex. `etapeLunaire('fleur_de_lune', 'pleine_lune', 2)`), `LUNAIRE`, `PART_LUNAIRE` ; les cultures des
  climats : `etapeDeClimat(climat, etape, n)` (ex. `etapeDeClimat('marais', 'mur', 1)`), `CLIMATS`, `PART_CLIMAT` ; les réserves :
  `reserveDuBatiment(batiment, etat, n)` (ex. `reserveDuBatiment('bosquet', 'plein', 2)`), `RESERVES`. `liste()` donne tout ce que la famille dessine, avec son fichier. Vérifiés à
  l'octet près (`design/atelier/verif_generateurs.mjs`). En ligne de commande, depuis `design/atelier/` :
  Les bêtes : `profil(bete, pose)`, `orientee(bete, vue, pose)` (vue `avant` ou `dos`), `egare(sujet, vue, pose)`, les noms
  et poses dans `BETES` (ex. `profil('renard', 'marche1')`, `egare('fantome', 'avant', 'luciole2')`).
  Les icônes : `icone(id, px)`, la liste dans `ICONES`. Les objets : `objet(id, calque, palier, image)` (ex.
  `objet('poulailler', 2, 3, 1)`, sa place et son calque derrière dans `batiments.json`), `torche(etat, image)`,
  `torcheIcone()`, la liste dans `OBJETS`.
  Les plantes : `plante(nom)`, le nom du fichier sans `.svg` (ex. `plante('sapin_neige')`), la liste et l'id du décor du
  jeu dans `PLANTES`.
  La météo : `tuile(id, n)` (les calques qui bouclent, à répéter), `sprite(id, n)` (ciel, nuages, lumières, sol),
  `teinte(sorte, id)` (`moments`, `climats`, `saisons`), `mer(moment)`, `icone(groupe, id)` ; tout est rangé dans `METEO`.
  Les coffres : `coffre(rarete, etat, n)` (`ferme`, `ouverture`, `ouvert`, `rayons`), `coffreIcone(rarete)`, `COFFRES`.
  Le décor : `decor(categorie, nom, n)` (`creations`, `lieux`, `gisements`, `annexes`, `enseignes`, `ilots` ; ex.
  `decor('annexes', 'champ_ble', 1)`), la liste et ce que dit `decor.json` dans `decors()`.
  Et `camp(objet, n)`, `ruine(objet, n)` (les objets de `camp.json` et `ruines.json`), `element(nom, n)` (le bâtiment
  embrumé, la cage aux poules, l'œuf, les signes d'Anya, l'éclat du souvenir, les sceaux : `ELEMENTS`), `crabe(pose)`.
  Les bâtiments : `palier(site, palier, n, hiver)` (ex. `palier('foyer', 4, 2, false)` ; `hiver` à `true`, les toits sous la
  neige), `chantier(phase)` (1, 2 ou 3), `skin(id, palier)`, `pieceRare(id, palier)` ; ce que dit `batiments.json` dans `BATIMENTS`.
  En ligne de commande, `true` et `false` deviennent des booléens.
  Les vivants : `brume(stade, n)`, `brumeExpression(expression, n)` (le calque des yeux seuls), `anya(posture, n, saison)`
  (ex. `anya('avant_marche', 2, 'hiver')` ; `saison` vaut `ete` par défaut), `anyaExpression(expression, n, saison)`,
  `cerf(vue, pose, n)` (ex. `cerf('profil', 'marche', 1)`, `cerf('dos', 'repos')`), `passeur(posture, n)`,
  `passeurExpression(expression, n)` ; les stades, postures, saisons et expressions dans `VIVANTS`. Le trois quarts avant
  d'Anya et du Passeur sort déjà en miroir, comme dans la bibliothèque.
  Les scènes du tutoriel : `scene(id, calque, n)` (calque `fond`, ou `devant` s'il y en a un ; ex.
  `scene('12_veillee', 'fond', 3)`) ; les étapes, images, vitesses, calques et la place de l'avatar dans `SCENES`.
  Les personnages : `maitre(nom, pose, n)`, `naufrage(nom, pose, n)` (nom sans accent : `aster`, `melisse`…),
  `visiteur(numero, pose, n)` (1 à 12), `arrivant(numero, pose, n)` (les nouveaux venus de l'épilogue, 1 à 8). La pose
  s'écrit comme dans le nom du fichier : `avant_pecher`, `dos_repos_hiver`, `avant_marche_content`, `expr_rire`, `couche`,
  `dort`… ; `poses(groupe, qui)` donne les poses d'un personnage et leurs images (ex. `poses('maitre', 'aster')`), `PERSONNAGES`
  la liste (avec les choix d'avatar des visiteurs et des nouveaux venus). Le trois quarts avant sort déjà en miroir. Le
  premier dessin d'un personnage prépare toutes ses poses (quelques dizaines de millisecondes).
  Les exemples d'avatar : `exemple(numero, pose, n)`, `exempleNaufrage(numero, pose, n)` (1 à 12 ; les poses dans `POSES`,
  et `expr_<expression>` pour l'exemple 1), `objetIcone(id)` (les icônes des objets de l'avatar, `ICONES`). Pour composer
  un avatar à partir de choix, c'est `avatar.mjs`. Ensemble, les générateurs par famille redessinent toute la bibliothèque.
  `node generer.mjs` (les familles), `node generer.mjs chantiers liste`, `node generer.mjs chantiers etapeDuMontage 2x2 toit 1
  --sortie toit.svg`, `node generer.mjs chantiers tout <dossier>`.
- **Icônes de l'interface** (`svg/interface/`, `interface.json`) : à afficher de 16 à 32 px, en `<img>` ou en SVG en
  ligne ; elles se lisent sur le papier comme sur le verre sombre des boutons de l'île. Un onglet inactif ou un cœur pas
  encore gagné s'éteint en CSS (`opacity`, `filter: saturate(.4)` ou `grayscale(1)`), sans autre dessin. Les commandes sont des pastilles
  rondes ; la flèche va vers la droite, la tourner en CSS pour les autres directions ; l'heure et la météo ont leurs icônes dans `svg/meteo/icones/`.
- **Le HUD** (`svg/hud/`, `hud.json`) : chaque fichier déclare une taille 4 fois plus grande que sa taille d'affichage
  (`taille`), pour rester net sur un canvas. Les cadres extensibles (bourse, tuile, boutons, étiquette, horloge, barre
  d'onglets) se posent en `border-image` : `border-width` = `tranche` (pixels d'affichage), découpe = `tranche_fichier`
  (la tranche × 4), `fill stretch` ; leurs coins ne bougent pas. Les autres pièces sont entières. Chiffres et libellés en
  CSS par-dessus, les icônes de `svg/interface/` aussi.
- **L'interface du joueur** (`svg/perso/`, `perso.json`) : mêmes règles que le HUD (haute définition, `border-image` pour les
  cadres extensibles). L'estrade se pose en `background-size: cover`, les pieds de l'avatar sur le plateau (`zones.pieds`) ; le
  cadre d'un nuancier a le centre vide (la couleur dessous, un rond de 22 px) ; les cartes d'embarquement donnent le tirage de la
  photo, penché (`zones.photo` : x, y, largeur, hauteur, angle) et la ligne du nom (`zones.nom`).
- **Le montage** (`svg/batiments/montage/`, `montage.json`) : ancre et échelle des paliers, un cadre fixe par emprise.
  Le spectacle : les six étapes défilent (`spectacle.ms_par_etape`), puis le palier paraît et le dévoilement se joue
  par-dessus lui, une fois. Le chantier qui dure : la dernière étape dont la `part` est atteinte. Une évolution qui dure :
  `echafaudage_*_derriere`, le bâtiment, puis `echafaudage_*_devant`.
- **Les cultures par étapes** (`svg/decor/cultures/`, `cultures.json`) : le cadre du champ (ancre au centre de la case), le
  même que l'annexe `champ` mûre, avec les mêmes piquets et les mêmes rangs. Le spectacle : les cinq étapes défilent
  (`spectacle.ms_par_etape`), puis le champ mûr (`decor/annexes/champ/champ_<culture>`) paraît ; les cultures du potager
  n'ont pas de champ dans les annexes (`mur` vaut `null`) : leur étape `mur` est la culture mûre, prête à cueillir. Une
  culture qui pousse : la dernière étape dont la `part` est atteinte ; à 1, le champ ou l'étape mûre.
- **Le verger par étapes** (`svg/decor/verger/`, `verger.json`) : à l'échelle de la troupe, dans le cadre d'un décor d'une
  case, comme les arbres de `svg/plantes/` (ancre au centre de la case). Le spectacle : les six étapes défilent
  (`spectacle.ms_par_etape`). Un arbre qui pousse : la dernière étape dont la `part` est atteinte ; à 1, les fruits mûrs.
- **Le jardin lunaire** (`svg/decor/lunaire/`, `lunaire.json`) : le cadre des cultures. Une étape par phase de la lune ; la
  pierre de lune, au fond du carré, montre la phase. Le jeu peut suivre la vraie lune de l'île (la phase donne l'étape) ou
  les parts du temps (`pousse_qui_dure`), comme les cultures.
- **Une culture par climat** (`svg/decor/climats/`, `climats.json`) : le cadre des cultures ; la culture de chaque climat
  dans `culture`. Le spectacle et la culture qui pousse comme les cultures ; à 1, la culture mûre.
- **Les réserves des bâtiments** (`svg/batiments/reserves/`, `reserves.json`) : le cadre des cultures, sur la case voisine
  du bâtiment. `vide` quand rien n'attend, `moitie` quand un peu attend, `plein` quand beaucoup attend ; ramasser la remet
  à `vide`.
- **La torche** (`svg/decor/defenses/`, `defenses.json`) : elle s'achète à la boutique et se pose sur une case, comme une
  création (ancre au centre de la case, le cadre des créations). La nuit, `torche_allumee` en boucle et sa `lumiere`
  (les valeurs de la lumière d'une création du jeu : `u`, `v`, `z`, `rayon`, `couleur`) ; le jour, `torche_eteinte`.
  Son icône pour la boutique : `torche_icone`.
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
  et `auHasard(graine)` (`design/personnages/avatar.js`), les gestes dans `design/atelier/gestes.js`. L'hiver, les maîtres
  ont leur tenue (`tenues.hiver`), et sous la pluie aussi (`tenues.pluie`) : on échange le fichier de repos ou de marche
  contre son `_hiver` ou son `_pluie`, même cadre, même vitesse.
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
