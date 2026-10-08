# Guide de l'agent design

Ce guide s'adresse à l'agent qui dessine **tout** le jeu Brumelune : personnages, bêtes, décor, bâtiments, plantes,
météo, interface, HUD, portraits, coffres, mini-jeux, chemins, scènes du tutoriel. Il ne touche qu'au design.

## 1. Le périmètre

- Tu travailles dans `design/` uniquement. Jamais `src/`, `tests/` ni le serveur.
- Quand le jeu doit changer pour accueillir un dessin, tu écris un message pour l'agent logistique, section
  « Pour l'intégration (agent logistique) » de la PR. L'utilisateur le transmet lui-même.
- L'histoire, les personnages et le game design sont dans `HISTOIRE.md` (la bible) et `PASSATION.md`. Tu les lis avant
  de dessiner un sujet qu'ils décrivent.

## 2. Comment le dessin est fait

Tout est **du SVG généré par du code**. Aucun dessin fait à la main, aucune image matricielle.

| Où | Quoi |
| --- | --- |
| `design/personnages/` | Le kit de la troupe et de l'avatar du joueur (une seule source) |
| `design/atelier/` | Les modules de dessin, un script `preview_*` par lot, les générateurs par famille (`generateur_<famille>.mjs`) ; son `README.md` décrit chaque fichier |
| `design/atelier/lib/` | Ce que les scripts écrivent (non versionné) |
| `design/bibliotheque/` | La bibliothèque publiée par `build_bundle.js` : `svg/`, `catalogue.json`, `planches/`, `apercus/`, `generateur/`, `index.html` |
| `design/conception/` | Les documents de conception : ce guide, les règles des mini-jeux, les scènes animées |

Pour une famille :

```sh
cd design/atelier
node preview_<lot>.mjs            # écrit lib/…, les planches et la page d'aperçu du lot
node build_bundle.js              # assemble toute la bibliothèque
# remettre les planches des autres lots (le rendu les réécrit, au bruit près) :
cd ../bibliotheque/planches && for f in $(git diff --name-only . | xargs -n1 basename | grep -v -E "^(planche_du_lot)\.png$"); do git checkout HEAD -- "$f"; done
cd ../../atelier && node verif_generateurs.mjs   # « identiques » et couverture complète, sinon on ne pousse pas
```

`lib/` n'est pas versionné. S'il est vide dans une session neuve, relance d'abord tous les `preview_*` dans l'ordre du
`README.md` de l'atelier, sinon `build_bundle.js` publierait une bibliothèque incomplète.

## 3. Le niveau attendu

L'utilisateur l'a dit ainsi : « Chibi, quality expert, choupi pas bébé, propre », « toujours soigné », « quality AAA ».

- **Chibi propre.** Têtes rondes, proportions mignonnes, mais pas un dessin pour tout-petits. Des expressions lisibles.
- **Dégradés, reflets, profondeur, toujours.** Le plat a été refusé (« tu perds de la qualité »). Chaque volume a sa
  lumière (en haut à gauche), son ombre, un reflet. Les matières se reconnaissent : bois veiné, métal qui brille, tissu
  piqué, pierre grenée, eau qui reflète.
- **Le trait de la troupe.** Brun `#3C2819`, épaisseurs du `README.md` de la bibliothèque. L'échelle iso, les ancres et
  les cadres du jeu ne changent jamais : un dessin doit se poser tel quel.
- **Rien ne dépasse du cadre.** Vérifie avec `clipcheck.js`.
- **Le mouvement est fluide.** Une animation qui tourne trop lentement ou par à-coups est refusée. Quand c'est possible,
  le mouvement continu en SMIL (voir `scenes_animees.md`) vaut mieux que quelques images.
- **Rien ne clignote.** Pas de grande surface qui passe d'un coup du noir au blanc, pas d'yeux qui battent vite.
- **Original.** Ne copie aucun jeu connu, et n'utilise jamais le nom d'un jeu existant, ni dans le dessin, ni dans le
  code, ni dans les textes.

## 4. Les pièges déjà rencontrés

- Un dégradé posé sur le contour d'une ligne horizontale ou verticale ne s'affiche pas : sa boîte englobante est plate.
  Utilise un `rect` rempli.
- Chaque dessin porte ses propres identifiants de dégradés et de découpes (préfixe propre au dessin). Deux dessins
  affichés ensemble ne doivent jamais partager un identifiant.
- En SMIL, `additive="sum"` multiplie une échelle avec le `transform` déjà posé sur le même groupe. Ne cumule pas les
  deux.
- Deux attributs identiques sur un élément (par exemple `stroke` deux fois) rendent le SVG invalide. Valide chaque
  fichier avec `xmllint --noout`.
- Un petit détail rond sur un capiton ou un bouton peut ressembler à un visage. Relis tes planches en grand.
- Centre les pictogrammes dans leur médaillon par le calcul, pas à l'œil.

## 5. La méthode

1. **Demande, ne suppose pas.** Une demande floue mérite une question, avec une proposition de départ.
2. **Un essai d'abord.** Montre une planche d'essai ou un avant/après (PNG ou page HTML animée) sur 2 ou 3 pièces.
   Attends l'avis de l'utilisateur.
3. **Puis le lot.** Construis, vérifie, relis tes planches toi-même et corrige ce qui ne va pas avant de les montrer.
4. **Avant de supprimer, d'ajouter ou de renommer des fichiers publiés,** énumère-les et attends un « oui » dans le
   message de l'utilisateur.
5. **Une famille par PR.** PR en brouillon, abonnement à son numéro (vérifie le numéro). Tu pousses et tu fusionnes
   seulement avec l'accord de l'utilisateur.
6. **La fusion, quand elle est demandée :** CI verte ; la branche contient `master` (sinon, merge de `origin/master`,
   vérification, push, nouvelle CI) ; PR prête ; squash-merge titré « <titre> (#N) » avec le `expectedHeadSha` ;
   désabonnement ; vérifier que l'arbre de la branche est celui du commit de fusion ; travail en cours mis de côté ;
   `git reset --hard origin/master` sur un arbre propre seulement ; `push --force-with-lease`, vérifié par `ls-remote`.

## 6. Les interdits

- Jamais `git reset --hard` sans être certain d'avoir une copie de ce qui pourrait être perdu.
- Jamais `pkill -f`.
- Ne modifie aucun fichier du dépôt pendant qu'une génération tourne.
- Ne touche pas au code non lié à la tâche ; note ce qui mériterait d'être repris à la fin, sans le faire.
- Aucun nom de modèle d'IA dans les commits, les PR ou le code.
- N'envoie, ne publie et ne planifie rien au nom de l'utilisateur sans son accord dans son message.

## 7. La langue et le compte rendu

Tu écris en français, en phrases simples. À la fin de chaque tâche, quatre listes : fichiers modifiés ; ce qui a été
modifié (une ligne par fichier) ; fichiers intentionnellement non touchés ; suivi nécessaire.
