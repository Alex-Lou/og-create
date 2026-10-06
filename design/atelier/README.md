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
| `dormeurs.js`, `arrivees.js` | Les maîtres endormis, les plans d'entrée du tutoriel |
| `brume.js`, `anya.js`, `cerf.js`, `passeur.js` | Les vivants |
| `betes.js`, `betes3.js` | Les animaux de profil ; les bêtes qui marchent de trois quarts avant et de dos |
| `crafts.js`, `deco.js`, `decor2.js`, `landmarks.js` | Décor : créations, annexes, lieux, gisements, îlots |
| `camp.mjs`, `ruines.mjs` | Le camp des naufragés, les ruines des Anciens |
| `meteo.js` | Météo, ciel, moments du jour |
| `coffres.mjs` | Les coffres des quatre raretés (fenêtre d'ouverture) |
| `port/src/world/` | Copie restylée du moteur de l'île du jeu (iso, palette, sprites, bâtiments, petit format), prise à un instant donné : le jeu a pu évoluer depuis |
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
node preview_gens.mjs                # petit format : habitants et visiteurs
node preview_naufrages.js            # naufragés (grand format), endormis, plans d'entrée, expressions en marche
node preview_gens_naufrages.mjs      # naufragés au petit format, épilogue
node preview_camp.mjs                # le camp
node preview_ruines.mjs              # les ruines
node preview_coffres.mjs             # les coffres
node preview_camp_grandit.mjs        # planche « le camp grandit »
node preview_avatar.mjs              # l'avatar du joueur : exemples, planches (formes, nuanciers, accessoires, exemples)
node verif_avatar.mjs                # l'avatar : 8 400 images au hasard et accessoire × coupe, rien de cassé ni hors cadre
for d in svg2/*/; do mkdir -p lib/personnages/maitres/$(basename $d) && cp $d*.svg lib/personnages/maitres/$(basename $d)/; done
node build_bundle.js                 # assemble ../bibliotheque/
node clipcheck.js lib/decor/camp     # (facultatif) vérifie qu'aucun dessin ne dépasse de son cadre
```

Les générateurs écrivent dans `lib/` avec leurs propres noms ; `build_bundle.js` les publie sous leur nom rangé
(`catalogue.js`, `renommer`) et réécrit les chemins des index de chaque lot. Il s'arrête si deux dessins prennent le même
nom, et chaque chemin des index doit pointer sur un fichier existant. Pour ranger un dessin dans le parcours, ou noter ce
qui reste à revoir ou à dessiner, c'est dans `catalogue.js` (`moment`, `A_REVOIR`, `MANQUANTS`).

`preview2.js` doit passer avant `preview_naufrages.js` (qui ajoute les endormis et les expressions en marche dans
`lib/personnages/maitres/`). Les sorties (`lib/`, `svg2/`, `planches/`, pages) ne sont pas versionnées : la
bibliothèque assemblée l'est, dans `../bibliotheque/`.
