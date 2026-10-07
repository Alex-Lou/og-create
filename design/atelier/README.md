# L'atelier : les générateurs de la bibliothèque

Les scripts qui dessinent et rangent tous les assets de `design/bibliotheque/`. Tout est généré par code, au trait de la
troupe. Relancer ces scripts redonne la bibliothèque à l'octet près : c'est vérifié.

## Ce qu'il faut

- Node 22.
- Playwright et Chromium, pour mesurer les cadres (`fit.mjs`), vérifier les débordements (`clipcheck.js`) et tirer
  les planches PNG (`planche.js`, `preview2.js`). Les chemins sont ceux du conteneur où l'atelier a tourné :
  `/opt/node-tools/node_modules/playwright` et `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. Ailleurs, les
  adapter dans ces quatre fichiers.

## Ce qu'il y a

| Fichier | Rôle |
| --- | --- |
| `troupe.js`, `aster2.js`, `cannelle.js`… | Renvois vers le kit de la troupe (`design/personnages/`), qui n'existe qu'en un exemplaire |
| `naufrage.js`, `naufrages.js` | La transformation en naufragé, et la tenue propre à chaque maître |
| `avatar_naufrage.js`, `preview_avatar.mjs`, `verif_avatar.mjs` | L'avatar du joueur en naufragé ; les exemples d'avatar et leur version naufragée, les planches (formes, nuanciers, accessoires, exemples) ; le test de fiabilité (aucun choix ne casse le dessin ni ne sort du cadre) |
| `dormeurs.js` | Les maîtres endormis |
| `brume.js`, `anya.js`, `cerf.js`, `passeur.js` | Les vivants |
| `betes.js`, `betes3.js` | Les animaux de profil ; les bêtes qui marchent de trois quarts avant et de dos |
| `betes_liste.js`, `noms_betes.js` | Les listes des bêtes, des bêtes orientées et des égarés (une seule source pour les planches et le générateur) ; leurs noms rangés et leurs vitesses dans la bibliothèque (la règle de `catalogue.js`, sans Node) |
| `crafts.js`, `deco.js`, `decor2.js`, `landmarks.js` | Décor : créations, annexes, lieux, gisements, îlots |
| `arbres.js` | Les arbres refaits au niveau des PNJ, un par un : l'arbre et ses 8 variantes (grand ou petit, vert doux ou profond, pied sobre ou fleuri), le pommier et ses 16 (en pommes ou en fleurs, pied sobre ou pommes ou pétales tombés), l'arbre d'automne et ses 8 (orange ou rouge, pied sobre ou feuilles tombées), le bouleau et ses 8 (comme l'arbre), le sapin et le sapin enneigé et leurs 8 chacun (pied sobre ou pommes de pin, ou congère en neige), le palmier et ses 8 (pied sobre ou noix de coco tombées), l'arbre mort et ses 8 (gris ou brun, pied sobre ou champignons) |
| `plantes.js` | Les autres plantes refaites, une par une, avec le trait et les verts des arbres : le buisson et ses 8 variantes (fleuri ou à baies, grand ou petit, vert doux ou profond), la bruyère et ses 8 (mauve ou rose, avec ou sans papillon), les fleurs et leurs 8 (bouquet mélangé ou marguerites, avec ou sans abeille), le cactus et ses 8 (cierge ou boule, fleuri ou non), la souche et ses 8 (écorce brune ou grise, une pousse ou des champignons), le rondin et ses 8 (de même), les champignons et leurs 8 (amanites ou cèpes, de jour ou la nuit, où ils luisent), les roseaux et leurs 8 (dans une mare ou sur la rive, avec ou sans libellule), les nénuphars et leurs 8 (fleurs roses ou blanches, avec ou sans grenouille) |
| `herbes.js` | L'herbe refaite, avec les verts de l'arbre : la touffe d'herbe et ses 16 variantes (avec ou sans motte, grande ou petite, vert doux ou profond, sobre ou fleurie) |
| `objets.js` | Les objets du décor refaits au niveau des PNJ, un par un, avec le trait et la lumière des arbres : le nid de mouettes et ses 8 variantes (trois œufs ou deux poussins, grand ou petit, avec ou sans plume), la lanterne sur pied et ses 8 (poteau de bois ou de fer, avec ou sans lierre, éteinte ou allumée), le banc et ses 8 (trois ou deux places, bois naturel ou peint en vert, avec ou sans chat endormi) |
| `plage.js` | La plage refaite au niveau des PNJ, un élément à la fois, avec le trait et la lumière des arbres : les coquillages et leurs 8 variantes (coloris chauds ou nacrés, grands ou petits, avec ou sans étoile de mer), le bois flotté et ses 8 (bois blanchi ou mouillé sombre, avec ou sans algues accrochées) |
| `rochers.js` | Les rochers refaits au niveau des PNJ, un par un, avec le trait et la lumière des arbres : le rocher et ses 8 variantes (granite gris ou grès ocre, grand ou petit, avec ou sans lézard au soleil), les rochers en tas et leurs 8 (granite gris ou pierre sombre, avec ou sans galets au pied), l'aiguille et ses 8 (seule ou double, avec ou sans oiseau perché), les rochers moussus et leurs 8 (mousse sobre ou fleurie, avec ou sans escargot) |
| `camp.mjs`, `ruines.mjs` | Le camp des naufragés, les ruines des Anciens |
| `meteo.js` | Météo, ciel, moments du jour |
| `coffres.mjs` | Les coffres des quatre raretés (fenêtre d'ouverture) |
| `gestes.js`, `preview_quotidien.mjs` | Le quotidien au grand format (lot L4) : lanterne, parapluie, valise, dormir couché ; toutes les poses du jeu pour les maîtres, leurs naufragés, 12 visiteurs et 8 nouveaux venus tirés du générateur de l'avatar |
| `lot_m.js`, `preview_lot_m.mjs` | La suite du lot M : le bâtiment embrumé (calque par emprise, guérison, nuage, icône « Réparer »), la cage aux poules et l'œuf, le crabe de la Grève, les signes d'Anya |
| `scenes6.js`, `preview_scenes6.mjs` | Les scènes plein écran du tutoriel v6 (lot J2, `HISTOIRE.md` § 9) : 27 scènes des étapes 0 à 12 dans le carré 400 × 400 du jeu, un fond et parfois un devant en petites boucles, la place de l'avatar du joueur notée dans l'index (le jeu l'y pose) |
| `generateur_betes.mjs` | Le générateur des bêtes : de profil, orientées (trois quarts avant et dos), les égarés ; chaque fonction rend le SVG complet du fichier de la bibliothèque, avec son cadre et sa vitesse ; `build_bundle.js` en fait `generateur/betes.mjs` |
| `generateur_chantiers.mjs` | Le générateur des chantiers (le montage) : chaque fonction rend le SVG complet du fichier de la bibliothèque ; `preview_montage.mjs` écrit la bibliothèque avec elles, `build_bundle.js` en fait `generateur/chantiers.mjs` |
| `generer.mjs`, `verif_generateurs.mjs` | L'outil du générateur en ligne de commande (lister, dessiner un fichier, toute une famille), avec les modules publiés ; la vérification qu'ils dessinent la bibliothèque à l'octet près |
| `montage.mjs`, `preview_montage.mjs` | Le montage d'un bâtiment par étapes (les chantiers) : piquets, terrassement, fondations, charpente, murs, toit, en 2 × 2 et 3 × 3 cases ; le dévoilement ; l'échafaudage des évolutions (derrière, devant) |
| `torche.js`, `preview_torche.mjs` | La torche de bois flotté (objet de la boutique, posé sur une case) : allumée, éteinte, son icône, sa lumière de nuit ; le même dessin sert le camp (`camp.mjs`) et la veillée (`scenes6.js`) |
| `interface.js`, `preview_interface.mjs` | Les icônes de l'interface (32 × 32) : la barre du bas, l'écu, les ressources, les boutons de l'île, les fiches, les trouvailles des climats ; une planche en vraie taille sur trois fonds, et en situation |
| `egares.js`, `preview_egares.mjs` | Les égarés (lot M, la nuit) : le petit fantôme, le petit zombie tout mou, une bête de brume par climat ; marche, bouderie au toucher, fuite devant Anya, passage en luciole, retour dans la brume |
| `port/src/world/` | Copie restylée du moteur de l'île du jeu (iso, palette, sprites, bâtiments), prise à un instant donné : le jeu a pu évoluer depuis |
| `planche.js`, `fit.mjs`, `clipcheck.js` | Outils : planches et pages animées, cadres ajustés, débordements |
| `preview*.js`, `preview*.mjs` | Un script par lot : il écrit les SVG dans `lib/`, ses planches dans `planches/`, sa page `*_apercu.html` |
| `catalogue.js` | La règle des noms (`<sujet>_<vue>_<pose>_<n>`), le parcours du joueur (chapitres), ce qui reste à revoir ou à dessiner |
| `build_bundle.js`, `bundle_README.md` | Assemble `../bibliotheque/` : SVG sous leur nom rangé, index des lots réécrits, `catalogue.json`, page `index.html`, planches, aperçus, README |

## Régénérer la bibliothèque

Depuis `design/atelier/` :

```
node preview2.js                     # les 7 maîtres → svg2/<prénom>/, planches, troupe_apercu.html
node preview_vivants.js              # Brume, Anya, le cerf, le Passeur
node preview_betes.js                # animaux de profil
node preview_betes3.mjs              # bêtes orientées (trois quarts avant et dos)
node preview_plantes.js              # plantes et rochers
node preview_decor.mjs               # décor
node preview_batiments.mjs           # bâtiments
node preview_meteo.js                # météo
node preview_naufrages.js            # naufragés (grand format), endormis, expressions en marche
node preview_quotidien.mjs           # le quotidien au grand format : maîtres, naufragés, visiteurs, nouveaux venus
node preview_camp.mjs                # le camp
node preview_ruines.mjs              # les ruines
node preview_coffres.mjs             # les coffres
node preview_egares.mjs              # les égarés : fantôme, zombie, bêtes de brume
node preview_lot_m.mjs               # le bâtiment embrumé, la cage aux poules, le crabe, les signes d'Anya
node preview_scenes6.mjs             # les scènes plein écran du tutoriel v6 (fonds, devants, place de l'avatar)
node preview_camp_grandit.mjs        # planche « le camp grandit »
node preview_avatar.mjs              # l'avatar du joueur : exemples, planches (formes, nuanciers, accessoires, exemples)
node verif_avatar.mjs                # l'avatar : 8 400 images au hasard et accessoire × coupe, rien de cassé ni hors cadre
node preview_interface.mjs           # les icônes de l'interface
node preview_torche.mjs              # la torche de bois flotté (objet de la boutique)
node preview_montage.mjs             # le montage des bâtiments (les chantiers par étapes)
for d in svg2/*/; do mkdir -p lib/personnages/maitres/$(basename $d) && cp $d*.svg lib/personnages/maitres/$(basename $d)/; done
node build_bundle.js                 # assemble ../bibliotheque/
node verif_generateurs.mjs           # les générateurs par famille dessinent la bibliothèque à l'octet près
node clipcheck.js lib/decor/camp     # (facultatif) vérifie qu'aucun dessin ne dépasse de son cadre
```

Les générateurs écrivent dans `lib/` avec leurs propres noms ; `build_bundle.js` les publie sous leur nom rangé
(`catalogue.js`, `renommer`) et réécrit les chemins des index de chaque lot. Il s'arrête si deux dessins prennent le même
nom, et chaque chemin des index doit pointer sur un fichier existant. Pour ranger un dessin dans le parcours, ou noter ce
qui reste à revoir ou à dessiner, c'est dans `catalogue.js` (`moment`, `A_REVOIR`, `MANQUANTS`).

`preview2.js` doit passer avant `preview_naufrages.js` (qui ajoute les endormis et les expressions en marche dans
`lib/personnages/maitres/`). Les sorties (`lib/`, `svg2/`, `planches/`, pages) ne sont pas versionnées : la
bibliothèque assemblée l'est, dans `../bibliotheque/`.
