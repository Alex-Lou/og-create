# Demandes à l'agent logistique : les règles des combos des mini-jeux

Choix de l'auteur (14 oct.) : chaque mini-jeu refait gagne aussi des **règles de combo**, « contrôlé, pas trop, mais
waouh ». Ces règles changent ce que le serveur rejoue, donc elles sont du domaine de l'agent logistique. Il est pris
ailleurs : les demandes **attendent ici**, une section par jeu, ajoutée à chaque jeu refait côté spectacle. À lui
transmettre quand il sera libre, dans l'ordre.

Les règles communes à toutes les demandes :
- **Règles versionnées.** Chaque partie neuve porte `rules: 2` dans sa configuration, le rejeu suit la version de sa
  partie, une partie sans `rules` se rejoue à l'identique d'aujourd'hui.
- **Le moteur reste partagé**, conforme des deux côtés (le jeu et le serveur), avec un vecteur de tests commun.
- **Rien d'autre ne change** : écus, plafonds, coffres, objectifs et étoiles des niveaux.
- **Ne pas toucher au spectacle** : `src/game/stage/`, les fichiers `*Fx.js`, les scènes des jeux. Le design suit
  ensuite (nouvelles tuiles, mots, effets).

---

## 1. La Récolte (spectacle fait : #574, #575)

### Le contexte

- La Récolte a été refaite côté spectacle (#574, #575) :
  - un moteur de scène canvas ;
  - des onomatopées par ressource ;
  - des paliers selon la longueur de la chaîne : Joli ! (4), Superbe ! (5), Magique ! (7), Féerique ! (9), Clair de lune ! (12) ;
  - une « Série ×N » quand plusieurs belles chaînes (5 tuiles ou plus) s'enchaînent.
- Pour l'instant, tout cela est visuel. Les gains sont ceux du moteur partagé :
  - côté jeu : `src/game/harvest.js` ;
  - côté serveur : `services/harvest.js` (copie conforme), que le serveur rejoue à la fin de la partie.
- L'auteur veut que les combos aient aussi un effet de jeu : **« contrôlé, pas trop, mais waouh »**.
- Ces règles changent `replay`, donc le serveur : c'est ton domaine.

### Les deux règles

#### 1. La tuile de lune (un joker)

- **Naissance.**
  - Une chaîne d'au moins **7 tuiles** (palier « Magique ») laisse une **tuile de lune** sur sa **dernière case**, au lieu de la vider.
  - Les autres cases de la chaîne se vident comme aujourd'hui.
  - La lune reste dans sa colonne avec les tuiles gardées et tombe avec elles.
  - Le remplissage du haut ne change pas : on tire autant de tuiles neuves qu'il y a de cases vidées, une de moins dans la colonne de la lune. La suite tirée reste donc déterministe.
- **Son nom.** Dans le plateau, `'lune'`. Elle n'est jamais tirée au hasard.
- **Joker.**
  - Une lune peut prendre place dans n'importe quelle chaîne.
  - La sorte de la chaîne est celle de sa **première tuile qui n'est pas une lune**.
  - Toutes les autres tuiles sont de cette sorte, ou des lunes.
  - Une chaîne faite **seulement** de lunes est refusée.
  - Le minimum de 3 cases compte les lunes.
- **Son gain.** Une lune dans une chaîne compte comme une tuile de la sorte de la chaîne, **plus 2** de la même ressource. Ces 2 passent par le poids de la sorte (le poisson ×3) et par le bonus du bâtiment.
- **`hasChain`.** Les lunes comptent comme jokers. Un groupe de tuiles d'une sorte `k`, ou de lunes, reliées, d'au moins 3 cases, avec au moins une vraie `k`, est une chaîne possible.
- **Plateau rebattu** (`shuffled`) : on le refait entier, comme aujourd'hui. Les lunes disparaissent.

#### 2. La série (un multiplicateur doux)

- Les coups qui se suivent avec une chaîne d'**au moins 5 tuiles** forment une série. Le 1ᵉʳ coup de la série est `k = 1`.
- Le gain d'un coup de série vaut `floor(gain × (1 + 0,1 × min(k − 1, 5)))` :
  - +10 % au 2ᵉ coup de la série ;
  - +20 % au 3ᵉ ;
  - plafonné à **+50 %**.
- Le multiplicateur s'applique **après** les bonus de bâtiment et la lune.
- Un coup de moins de 5 tuiles casse la série.

Rien d'autre ne change : le minimum de 3, la diagonale, le nombre de coups, les écus (1 par 10 ressources, même plafond), les coffres, les objectifs et les étoiles des niveaux.

### La compatibilité : des règles versionnées

- **Les parties en cours ne doivent pas casser.**
  - Écris `rules: 2` dans `config` des **nouvelles** parties (`startRun`).
  - `replay(seed, kinds, moves, maxMoves, boosts, rules = 1)` rejoue avec les règles de la partie. Sans `rules`, ce sont les règles 1, celles d'aujourd'hui.
- **La partie envoyée au jeu porte `rules`** : `{ id, seed, kinds, maxMoves, boosts, level, goal, rules }`.
- **La copie du moteur côté jeu**, `src/game/harvest.js`, reste conforme à celle du serveur. `create`, `chainOk`, `gainOf`, `play` et `replay` prennent les mêmes règles.
  - Signature proposée pour le gain : `gainOf(kind, length, boosts, { moons, streak, rules })`.
  - `HarvestGame.vue` doit passer `run.rules` au moteur, pour que les gains affichés pendant la partie soient ceux que le serveur trouvera.
- **Tests.** Un vecteur commun, côté jeu et côté serveur, qui couvre :
  - une lune née d'une chaîne de 7 ;
  - une chaîne joker ;
  - une chaîne refusée faite seulement de lunes ;
  - une série de 3 coups (×1,1 puis ×1,2) ;
  - le plafond +50 % ;
  - une ancienne partie (`rules` absent) rejouée à l'identique.

### Ce que je ferai côté design, une fois ton lot fusionné

- La tuile de lune dans la bibliothèque (`design/bibliotheque/svg/minijeux/recolte/`) : au repos, choisie, cueillie.
- Son apparition sur la scène (elle naît dans un éclat de lune).
- Le « ×1,2 » de la série affiché avec le gain.

Dis-moi le nom exact que tu retiens pour la tuile (`'lune'` proposé) et la forme de `run.rules`.

### À ne pas faire

- Ne touche pas aux fichiers de la scène : `harvestScene.js`, `src/game/stage/`, `harvestFx.js`.
- Pas d'autres changements d'équilibrage que ces deux règles.

---

## 2. La Pêche (spectacle fait : #576)

### Le contexte
La Pêche a ses mots et ses paliers selon les **prises d'affilée** (un raté casse la série, une botte ne compte pas) :
Joli ! à 3, Superbe ! à 5, Magique ! à 7, Féerique ! à 10, Clair de lune ! à 14 (`src/game/fishingFx.js`, `nextStreak`).
Le serveur rejoue les lancers (`minigames.replay('peche', …)`).

### La règle : la série porte chance
- Chaque prise d'une série vaut un peu plus : à partir de la **3ᵉ prise d'affilée**, `valeur × (1 + 0,1 × min(k − 2, 5))`
  (k : le rang de la prise dans la série ; +10 % à la 3ᵉ, +20 % à la 4ᵉ… plafonné à **+50 %**), arrondi à l'entier
  inférieur. Le poisson doré en profite comme les autres.
- La série suit exactement `nextStreak` : un poisson l'allonge, une botte la laisse telle quelle, un lancer à vide la
  remet à zéro.
- Le plafond d'écus par partie ne change pas.

### Côté jeu
`FishingBoard.vue` émet `tally` avec `raw` (le total) : il doit compter avec la même règle, pour que le total affiché
pendant la partie soit celui que le serveur trouvera. Le design affichera le « ×1,2 » à côté du gain.

---

## 3. Le Filon (spectacle fait : cette PR)

### Le contexte
Le Filon a ses mots et ses paliers selon les **pierres trouvées d'affilée** : une pierre allonge la série, un bloc ouvert
vide la casse ; Joli ! à 2, Superbe ! à 3, Magique ! à 5, Féerique ! à 7, Clair de lune ! à 9 (`src/game/veinFx.js`,
`nextFind`). Le serveur rejoue les coups de pioche (`replayVein`).

### La règle : le coup de lune
- Dès **3 pierres d'affilée** (palier « Superbe »), le **prochain coup de pioche** est un coup de lune : il ouvre le bloc
  frappé **d'un seul coup**, quelle que soit sa dureté.
- Il ne sert qu'une fois : il est consommé par le coup suivant, même sur un bloc tendre. La série, elle, continue
  selon `nextFind`.
- Il se regagne à chaque nouveau multiple de 3 pierres d'affilée (3, 6, 9…).
- Un coup reste un coup : le nombre de coups de la partie ne change pas.

### Côté jeu
`VeinBoard.vue` applique la même règle (le bloc s'ouvre d'un coup), pour que la paroi affichée soit celle que le
serveur rejoue. Le design montrera la pioche qui s'illumine quand le coup de lune est prêt (pièces `pioche-or` et
`coup-or` de la bibliothèque).

---

## 4. La Cueillette (spectacle fait : cette PR)

### Le contexte
La Cueillette a ses mots et ses paliers selon les **cueillettes d'affilée** : une baie ou un cèpe allonge la série,
les guêpes ou une baie tombée sans être cueillie la cassent ; Joli ! à 3, Superbe ! à 6, Magique ! à 10, Féerique ! à
15, Clair de lune ! à 20 (`src/game/pickFx.js`, `nextPick` ; la baie perdue : celle dont la vie finit sans cueillette).
Le serveur rejoue les gestes (`replayPicking`).

### La règle : la main verte
- Dès **6 cueillettes d'affilée** (palier « Superbe »), chaque mûre, fraise ou myrtille cueillie vaut **+1**, tant que
  la série dure. Le cèpe garde sa valeur.
- La série suit exactement `nextPick`, avec la baie perdue comptée à l'instant où sa vie finit (`until`), dans l'ordre
  des gestes.
- Le plafond d'écus par partie ne change pas.

### Côté jeu
`PickingBoard.vue` émet `tally` avec `raw` : il doit compter avec la même règle. Le design montrera la main verte
(le panier qui luit, pièce `magie` de la bibliothèque).
