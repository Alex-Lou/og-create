# Les jeux à grille : refonte, et un nouveau jeu « type Tetris »

Document de conception (règles, niveaux, difficulté, visuel). Le visuel est fait côté design (`design/`, famille `minijeux`). Les règles sont à coder par l'agent logistique dans `src/game/` **et** dans le moteur du serveur.

## 1. Ce qui ne change pas

- **Le serveur décide du gain.** Une partie vient d'une graine du serveur. Le jeu renvoie les gestes, et le serveur rejoue la partie. Toute règle ci-dessous doit donc rester **déterministe** : le hasard vient de la graine, et l'ordre des gestes suffit à rejouer.
- **Les parties** : 3 en réserve, une de plus toutes les 2 h. Les écus sont plafonnés par partie, et le palier du bâtiment multiplie le gain (règles actuelles de `minigames.js`).
- **Le format** : une partie dure 1 à 2 minutes. On joue au doigt, d'une main, sur un téléphone en portrait.
- **L'accessibilité** : chaque animation a sa version calme (`prefers-reduced-motion`). Les couleurs ne sont jamais le seul signe : chaque sorte a aussi sa forme.

## 2. Ce qui change pour tous : les niveaux et les étoiles

- **Un niveau par partie.** Chaque jeu a une suite de niveaux (30 au départ, en 3 « saisons » de 10). Le niveau atteint est gardé par le serveur.
- **Un objectif clair par niveau**, affiché avant de jouer : « Récolte 20 bois et 10 eau », « Trouve 2 rubis », etc.
- **1 à 3 étoiles** selon la marge (coups ou secondes restants). Elles se voient sur l'écran de bilan (le coffret et les étoiles du Filon servent de modèle à tous les jeux).
- **Le gain** : les écus d'aujourd'hui, plus un bonus par étoile **la première fois** seulement. Le plafond par partie ne bouge pas.
- **La difficulté monte doucement.** Chaque saison ajoute **une seule** idée nouvelle, expliquée par une bulle au premier niveau qui l'utilise.

## 3. La Récolte (plateau 6 × 6)

Aujourd'hui, on relie 3 tuiles identiques ou plus (diagonales comprises). Elles disparaissent et d'autres tombent. Le gain dépend de la longueur, et le nombre de coups est limité.

**Ce que j'ajoute :**

| Saison | Idée nouvelle | Règle |
| --- | --- | --- |
| 1 (niv. 1-10) | **Les commandes** | Chaque niveau demande des ressources précises. Les coups restants à la fin donnent les étoiles. |
| 1 | **La gerbe** | Une chaîne de 6 ou plus laisse une **gerbe** à la place de la dernière tuile. Reliée dans une chaîne, la gerbe vide sa ligne et sa colonne. |
| 2 (niv. 11-20) | **La graine dorée** | Une chaîne de 9 ou plus laisse une graine dorée. Elle compte comme n'importe quelle sorte, et elle double la chaîne qui la prend. |
| 2 | **Les rochers** | Des cases sont prises par un rocher. Il se fend quand une chaîne passe à côté, puis casse la deuxième fois et donne de la pierre. |
| 3 (niv. 21-30) | **Les ronces** | Une ronce gagne une case voisine à chaque coup où on ne la touche pas. Une chaîne qui passe à côté la coupe. |
| 3 | **Les cascades** | Quand des tuiles qui tombent forment seules une chaîne de 3, elle part toute seule (bonus ×1,5). |

**Ce qu'il faut dessiner :** la gerbe, la graine dorée, le rocher (intact, fendu, qui casse), la ronce (qui pousse, coupée), l'onde de la gerbe sur sa ligne et sa colonne, l'éclat d'une cascade, le panneau de la commande, et les tuiles qui se raccordent pendant la chaîne (le fil doré entre les tuiles).

## 4. Le Filon (paroi 6 × 7)

Aujourd'hui, on creuse en partant du haut. Un bloc demande 1 à 3 coups, les coups sont comptés, et des pierres précieuses dorment le long d'un filon. Les ✦ disent combien il y en a autour.

**Ce que j'ajoute :**

| Saison | Idée nouvelle | Règle |
| --- | --- | --- |
| 1 | **La profondeur** | La paroi défile : quand la rangée du bas est ouverte, une nouvelle rangée apparaît. Le fond change selon la couche (terre, roche, roche sombre et cristaux, déjà dessinés). Les pierres rares sont plus profondes. |
| 1 | **Les outils** | La pioche de bois (règle d'aujourd'hui), de fer (un bloc dur cède en 1 coup de moins), d'or (un coup ouvre aussi un bloc voisin au hasard de la graine). L'outil se gagne avec les étoiles. |
| 2 | **Les trouvailles** | Fossiles et objets des Anciens (déjà dessinés). Ils ne rapportent pas d'écus, ils remplissent un **album** (une collection à compléter, par saison). |
| 2 | **La lanterne** | Trois fois par partie, elle montre pendant 1 seconde les blocs voisins du filon. |
| 3 | **Les poches d'eau** | Un bloc marqué d'humidité inonde ses voisins si on le casse sans précaution : ils deviennent de la boue (2 coups). |
| 3 | **L'éboulement** | Casser trois blocs tendres d'affilée dans une colonne fait tomber la colonne : elle s'ouvre, mais les pierres qu'elle cachait sont perdues. |

**Ce qu'il faut dessiner :** la lanterne et son halo, le bloc humide et la boue, l'éboulement, l'album des trouvailles (page, cases vides et remplies), le changement d'outil, la rangée qui apparaît en bas.

## 5. La Cueillette (16 buissons, 40 s)

Aujourd'hui, les fruits mûrissent un instant. Un buisson vide fait perdre un instant, et les guêpes font perdre davantage.

**Ce que j'ajoute :**

| Saison | Idée nouvelle | Règle |
| --- | --- | --- |
| 1 | **La série** | Cueillir trois fois de suite la même sorte remplit une **jauge de panier**. Quand elle est pleine, les 3 secondes suivantes valent double. |
| 1 | **La commande du panier** | « 8 fraises, 5 myrtilles » : l'objectif du niveau. |
| 2 | **Le papillon doré** | Il se pose une fois par partie sur un buisson. Le toucher fait mûrir tous les buissons voisins. |
| 2 | **Les saisons des fruits** | Printemps : fraises. Été : myrtilles. Automne : mûres et cèpes. Les niveaux suivent la saison. |
| 3 | **La pie** | Elle vient voler le fruit le plus cher. La toucher la fait fuir et rend le fruit. |
| 3 | **Le nid qui grossit** | Les guêpes reviennent sur le même buisson et leur nid grossit. Au troisième retour, le buisson est perdu pour 5 secondes. |

**Ce qu'il faut dessiner :** la jauge de panier et son « double », le papillon doré, la pie (arrivée, vol, fuite), le nid à trois tailles, les buissons de saison (fleuris, d'été, d'automne).

## 6. Nouveau : l'Arrimage (le vrai « Tetris » de l'île)

**L'idée.** Le bateau d'Aster charge sa cale avant de partir. Les marchandises de l'île arrivent par le haut : caisses, tonneaux, sacs, filets, en formes de 4 cases (les 7 formes classiques). On les arrime au fond de la cale. Une rangée pleine est **arrimée** : elle part en ressources dans les réserves de l'île.

**Le plateau.** Une cale de 8 colonnes sur 14 rangées, au format téléphone. On voit la marchandise suivante, et une case de « mise de côté » permet d'en garder une.

**Les gestes.** On glisse à gauche ou à droite pour déplacer, on touche pour tourner, et on glisse vers le bas pour poser d'un coup.

**Les règles :**

- **L'ordre des formes** vient de la graine, par « sacs » de 7 : chaque forme sort une fois par sac, sans série injuste.
- **Une rangée arrimée** donne la ressource majoritaire de ses cases (bois des caisses, nourriture des sacs, eau des tonneaux, pierre du lest). Arrimer 2, 3 ou 4 rangées d'un coup multiplie le gain par 1,5, 2 ou 3.
- **La marée** : toutes les 10 rangées arrimées, la marée monte et la vitesse augmente d'un cran (10 crans).
- **La partie s'arrête** quand une marchandise ne peut plus entrer, ou au bout de 2 minutes.
- **Saison 2** : des **marchandises fragiles** (verre, œufs) doivent être arrimées sans rien poser dessus pendant 3 rangées. **Saison 3** : une **vague** secoue la cale une fois par partie et décale la rangée du haut.

**Le serveur.** Le jeu envoie la liste des gestes avec leur instant, et le serveur rejoue avec un pas fixe (60 pas par seconde). C'est le seul jeu temps réel sous la gravité : ce point est **à valider** avec l'agent logistique avant de coder. Une variante sans chute automatique (tour par tour) reste possible si le rejeu au pas fixe pose problème.

**Ce qu'il faut dessiner :**

- la cale en bois (bordage, membrures, une lanterne qui balance) ;
- les 7 formes en 4 sortes de marchandise (caisse, tonneau, sac, lest), chacune avec un dessin par case qui se raccorde à ses voisines ;
- l'ombre de pose ;
- la rangée arrimée (les cordes qui se serrent, puis les marchandises qui filent vers les réserves) ;
- la marée qui monte, la vague ;
- la marchandise fragile et la case de mise de côté ;
- l'écran de bilan.

## 7. L'ordre de travail proposé

1. **Côté design**, une planche d'essai par jeu, à valider avant toute PR :
   - Récolte : gerbe, graine, rocher, ronce, commande ;
   - Filon : lanterne, eau, boue, éboulement, album ;
   - Cueillette : jauge, papillon, pie, nid, saisons ;
   - Arrimage : cale, formes, rangée arrimée, marée.
2. **Côté logistique**, pour chaque jeu, dans le moteur du jeu et dans celui du serveur, et avec leurs tests :
   - la saison 1 ;
   - puis la saison 2 ;
   - puis la saison 3.
3. **Pour l'Arrimage**, valider d'abord le rejeu au pas fixe côté serveur.

## 8. Décisions

- **Les étoiles** donnent un petit bonus d'écus **la première fois seulement**, dans le plafond par partie (§ 2). Ensuite, elles servent à progresser : elles débloquent les outils (les pioches du Filon) et les saisons suivantes. Les cases d'album, elles, se remplissent avec les trouvailles, pas avec les étoiles. Ainsi, rejouer un niveau ne crée pas d'écus en plus, et l'économie de l'île ne bouge pas.
- **L'Arrimage se joue au Ponton**, avec le bateau d'Aster : c'est lui qui charge sa cale. Il s'ouvre à un palier plus haut du Ponton que la Pêche. Ensuite, la fiche du Ponton propose les deux jeux.
- **Pas de classement entre amis pour l'instant.** Ce sera pour plus tard.
