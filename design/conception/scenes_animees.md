# Les scènes du tutoriel en animation continue : comment les dessiner

Ce document s'adresse à l'agent qui dessine les scènes plein écran du tutoriel. Il ne touche qu'au design : le
dossier `design/`. Jamais `src/`, `tests/` ni le serveur. Ce qui change dans le jeu se demande à l'agent logistique,
par un message que l'utilisateur transmet lui-même.

## 1. Ce qui a été fait, et pourquoi

Les scènes étaient des suites de 2 à 4 images qui tournaient toutes les 160 à 1 200 ms. Le résultat était lent et
saccadé (« niveau maternelle »). Les scènes 00 à 06 sont maintenant en **animation continue** : chaque calque est
**un seul SVG** qui bouge de lui-même grâce au SMIL (`<animate>`, `<animateTransform>`, `<animateMotion>`). La pluie
tombe, la mer roule, la brume dérive, Brume flotte, le feu danse, tout en douceur et sans fin.

Les scènes où l'avatar est avec les autres personnages (07_cannelle, 07_souvenir, 09_rivet, 10_aster, 11_ondin,
11_reveil, 12_chantier, 12_veillee, 12_habits) **ne sont pas à refaire** : elles vont disparaître.

## 2. Où est le code

| Fichier | Rôle |
| --- | --- |
| `design/atelier/scenes7.js` | Les 19 scènes animées et leurs outils (ciel, étoiles, mer, sable, brume, pluie, halo, Brume, feu, épave, rocher). C'est le fichier à travailler. |
| `design/atelier/scenes6.js` | Les scènes à images (07 à 12) et les décors partagés (carte, tampon, texte, planche, chaise longue, ruines, grimoire). À la fin, il appelle `scenes7.js` et remplace ses scènes 00 à 06 : une image (`images: 1`), les mêmes titres, étapes et places d'avatar. |
| `design/atelier/generateur_scenes.mjs` | Le générateur publié (`bibliotheque/generateur/scenes.mjs`). Pour une scène à une image, `ms_par_image` vaut `null`. |
| `design/atelier/preview_scenes6.mjs` | Écrit les fichiers dans `atelier/lib/scenes/tutoriel/`, l'index `scenes.json` et les planches. |

## 3. Les règles de dessin

1. **Un seul SVG par calque.** Le fond est derrière l'avatar, le devant passe devant lui (pluie, brume, Brume quand
   elle s'approche). Le carré fait 400 × 400.
2. **Les places d'avatar ne bougent pas.** Ce sont `x`, `y`, `echelle`, `vue` et `pose` dans `scenes6.js`. Le jeu y
   pose l'avatar du joueur. On dessine autour de lui.
3. **Tout mouvement continu est doux.** Un aller-retour s'écrit avec `vaVient(type, a, b, durée)` : `calcMode="spline"`,
   `keySplines="0.45 0 0.55 1;0.45 0 0.55 1"`, `additive="sum"`. Un défilement sans fin (vagues, pluie, vent) s'écrit
   avec `defile(de, à, durée)`, et sa longueur est exactement une période du motif, pour ne pas voir de saut.
4. **Les moments uniques se jouent une fois**, au chargement, avec `uneFois(...)` ou `fondu(...)` (`fill="freeze"`).
   Exemples : le tampon qui claque, la vague qui monte, le gilet déposé, Brume qui approche, le feu qui prend, le vent
   qui chasse la brume. Ensuite, la scène reste vivante en boucle.
5. **Piège de l'échelle en double.** Avec `additive="sum"`, une animation `scale` se **multiplie** avec le `transform`
   déjà posé sur le même `<g>`. Ne mettez jamais `transform="scale(0.3)"` sur le groupe qui porte
   `uneFois('scale', '0.3;…;1', …)` : l'élément finirait à 0,3. Laissez ce groupe sans `transform`.
6. **Rien ne clignote.** Pas d'opacité qui saute de 0 à 1 sur une grande surface. L'éclair est rare (une fois toutes les
   9 s), bref, et son voile ne dépasse pas une opacité de 0,22. Les scintillements restent petits (étoiles, lueurs).
7. **Dégradés, reflets et profondeur, toujours.** Le plat a été refusé. Le style est chibi, propre, « choupi pas bébé ».
   Chaque dégradé porte un identifiant **propre à la scène** (préfixe de la scène : `po`, `fe`, `gc`…). Un dégradé ne
   s'applique pas au contour d'une ligne de hauteur nulle : utilisez un `rect` rempli.
8. **Durées décalées.** Deux éléments voisins n'ont pas la même durée, sinon tout bat ensemble comme un métronome. Le
   générateur de hasard `rnd(graine)` donne des valeurs fixes : le même dessin à chaque construction.
9. **Poids.** Restez sous 40 Ko par calque. Pas de filtre (`feGaussianBlur`…) : c'est lourd sur téléphone. Le flou se
   fait avec des dégradés radiaux.

## 4. Construire et vérifier

```sh
cd design/atelier
node preview_scenes6.mjs          # lib/scenes/tutoriel/, scenes.json, planches
node build_bundle.js              # toute la bibliothèque (design/bibliotheque/)
# restaurer les planches qu'on n'a pas touchées (le rendu les réécrit à l'identique, au bruit près)
cd ../bibliotheque/planches && for f in $(git diff --name-only . | xargs -n1 basename | grep -v -E "^(scenes_tutoriel_1|scenes_tutoriel_2)\.png$"); do git checkout HEAD -- "$f"; done
cd ../../atelier && node verif_generateurs.mjs   # doit dire « identiques » et couvrir tous les SVG
```

Avant tout envoi :

- Validez chaque SVG (`xmllint --noout`), et vérifiez qu'aucun identifiant n'est en double dans un calque.
- Faites des instantanés à 0,6 s et à 3 s (Playwright, Chromium dans `/opt/pw-browsers`) : on doit voir l'avant et
  l'après de chaque moment unique.
- Montrez à l'utilisateur un **avant/après animé** (une page HTML : l'ancienne suite d'images à gauche, le SVG animé à
  droite, avec l'avatar d'exemple à sa place) avant d'envoyer une série.
- Si vous ajoutez ou retirez des fichiers, énumérez-les à l'utilisateur et attendez son accord.

## 5. Ce que le jeu doit savoir (pour l'agent logistique)

- Une scène dont `images` vaut 1 n'a pas d'images qui tournent. Son SVG s'affiche en `<img>` ou en `<object>` et bouge
  de lui-même. Il ne faut jamais le copier en dessin figé (canvas), sinon il s'arrête.
- L'avatar tourne alors ses propres images à `ms_par_image` de la scène : 320 ms pour grelotter, 900 ms au repos.
  C'est la scène qui est fluide ; l'avatar, lui, reste calme (des images qui changent vite font cligner ses yeux).
- Les images de l'avatar restent toutes posées, et on bascule seulement leur `visibility` (comme le fait déjà
  `SceneArt.vue`). Jamais de fondu d'opacité ni de changement de `src` : il en sort un clignotement, surtout sur
  téléphone.
- Les moments uniques recommencent chaque fois que le SVG est rechargé. Il faut donc le charger une fois à l'entrée de
  la scène, et ne pas le recharger à chaque réplique.
