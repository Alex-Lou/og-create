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
| `dormeurs.js`, `arrivees.js` | Les maîtres endormis, les plans d'entrée du tutoriel |
| `brume.js`, `anya.js`, `cerf.js`, `passeur.js` | Les vivants |
| `betes.js`, `betes3.js` | Les animaux de profil ; les bêtes qui marchent de trois quarts avant et de dos |
| `crafts.js`, `deco.js`, `decor2.js`, `landmarks.js` | Décor : créations, annexes, lieux, gisements, îlots |
| `camp.mjs`, `ruines.mjs` | Le camp des naufragés, les ruines des Anciens |
| `meteo.js` | Météo, ciel, moments du jour |
| `port/src/world/` | Copie restylée du moteur de l'île du jeu (iso, palette, sprites, bâtiments, petit format), prise à un instant donné : le jeu a pu évoluer depuis |
| `planche.js`, `fit.mjs`, `clipcheck.js` | Outils : planches et pages animées, cadres ajustés, débordements |
| `preview*.js`, `preview*.mjs` | Un script par lot : il écrit les SVG dans `lib/`, ses planches dans `planches/`, sa page `*_apercu.html` |
| `build_bundle.js`, `bundle_README.md` | Assemble `../bibliotheque/` (SVG, planches, aperçus, index, README) |

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
node preview_camp_grandit.mjs        # planche « le camp grandit »
for d in svg2/*/; do mkdir -p lib/personnages/maitres/$(basename $d) && cp $d*.svg lib/personnages/maitres/$(basename $d)/; done
node build_bundle.js                 # assemble ../bibliotheque/
node clipcheck.js lib/decor/camp     # (facultatif) vérifie qu'aucun dessin ne dépasse de son cadre
```

`preview2.js` doit passer avant `preview_naufrages.js` (qui ajoute les endormis et les expressions en marche dans
`lib/personnages/maitres/`). Les sorties (`lib/`, `svg2/`, `planches/`, pages) ne sont pas versionnées : la
bibliothèque assemblée l'est, dans `../bibliotheque/`.
