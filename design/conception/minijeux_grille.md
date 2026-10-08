# Les jeux à grille : refonte, et un nouveau jeu de rangement

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

## 6. Nouveau : l'Arrimage, le jeu de rangement de l'île

**L'idée.** Le bateau d'Aster charge sa cale avant de partir. Sur le quai, des marchandises de l'île attendent : sacs, tonneaux, caisses, planches, filets, coffres. Le joueur les range dans la cale, une par une, en gardant le bateau droit. Une rangée pleine est **sanglée** : elle est arrimée pour le voyage, et sa cargaison part en ressources dans les réserves de l'île.

**Le plateau.** Une cale de 8 colonnes sur 14 rangées, au format téléphone. Au-dessus, le **quai** montre 3 marchandises qui attendent. Le **manifeste du jour** (la liste de tout ce qu'il faut charger) se voit à l'avance.

**Les gestes.** On choisit une marchandise sur le quai, on la glisse à gauche ou à droite, on la tourne en la touchant, puis on la lâche : elle descend jusqu'à se poser. **Tout se joue au tour par tour** : rien ne tombe tout seul, et il n'y a pas de chronomètre de chute.

**Les marchandises.** Elles ont de 2 à 6 cases, et chacune a la forme de ce qu'elle est :

| Marchandise | Cases | Forme | Poids |
| --- | --- | --- | --- |
| Sac | 2 | deux cases côte à côte | 1 |
| Tonneau couché | 3 | trois en ligne | 2 |
| Caisse | 4 | un carré de 2 × 2 | 1 |
| Filet | 4 | un L | 1 |
| Planches | 5 | cinq en ligne | 1 |
| Coffre long | 6 | 2 × 3 | 1 |
| Lest (pierre) | 2 à 4 | selon le niveau | 3 |

**Les règles :**

- **Le manifeste** vient de la graine : la liste du jour, dans un ordre connu à l'avance. Le quai en montre toujours 3, et le joueur choisit laquelle poser.
- **Une rangée pleine est sanglée** : elle se fige, compte pour la cargaison, et ne disparaît pas. Le plancher de travail remonte d'une rangée : la cale se remplit vraiment. Le niveau gagne quand on a sanglé le nombre de rangées demandé.
- **L'équilibre** : le bateau gîte si un côté de la cale est plus lourd que l'autre (somme des poids, colonnes 1 à 4 contre 5 à 8). Une jauge de gîte le montre. Au-delà d'un seuil, la marchandise posée glisse d'une case vers le côté bas.
- **La marée compte les tours** : le bateau part au bout de N marchandises posées (selon le niveau). À la fin, les cases restées vides sous la ligne d'eau ne comptent pas.
- **Le gain** : chaque rangée sanglée donne la ressource majoritaire de ses cases (bois des caisses, des planches et des coffres, nourriture des sacs et des filets, eau des tonneaux, pierre du lest). Un bonus si le bateau part droit (gîte nulle), et un autre si tout le manifeste est chargé.
- **Saison 2** : des **marchandises fragiles** (verre, œufs) : rien ne doit être posé dessus avant qu'elles soient sanglées. **Saison 3** : une **vague** frappe une fois par partie et décale la rangée du haut ; une alerte la précède.

**Le serveur.** Le jeu envoie la liste des coups (la marchandise choisie, sa colonne, sa rotation), et le serveur rejoue la partie coup par coup. Il n'y a pas de temps réel : le rejeu au pas fixe n'est plus nécessaire.

**Ce qui distingue l'Arrimage des jeux de blocs connus**, et doit le rester : pas de chute continue ni de vitesse qui monte, des marchandises de tailles variées tirées d'un manifeste visible, des rangées qui se figent au lieu de disparaître, l'équilibre du bateau, et la marée qui compte les tours. Le nom d'un jeu de blocs existant ne doit jamais être utilisé, ni dans le jeu, ni dans le code, ni dans les textes.

**Ce qu'il faut dessiner** (✓ : déjà dans la bibliothèque) :

- la cale en bois, sa lanterne qui balance ✓ ;
- les cases des marchandises, qui se raccordent à leurs voisines de la même pièce ✓ (caisse, tonneau, sac, lest) ; les nouvelles sortes : planches, filet, coffre long ;
- le quai à 3 places et le manifeste ;
- l'aperçu de pose sous la marchandise tenue ✓ (l'ombre) ;
- la rangée sanglée (les sangles qui se serrent, la rangée qui se fige) ;
- la jauge de gîte et le bateau qui penche ;
- la marée ✓, la vague et son alerte ✓ ;
- la marque fragile ✓ ;
- l'écran de bilan : le bateau d'Aster chargé ✓, l'écrin et les étoiles ✓.

## 7. L'ordre de travail proposé

1. **Côté design**, une planche d'essai par jeu, à valider avant toute PR :
   - Récolte : gerbe, graine, rocher, ronce, commande ;
   - Filon : lanterne, eau, boue, éboulement, album ;
   - Cueillette : jauge, papillon, pie, nid, saisons ;
   - Arrimage : cale, marchandises, quai, rangée sanglée, gîte, marée.
2. **Côté logistique**, pour chaque jeu, dans le moteur du jeu et dans celui du serveur, et avec leurs tests :
   - la saison 1 ;
   - puis la saison 2 ;
   - puis la saison 3.
3. **Pour l'Arrimage**, le jeu se joue au tour par tour : le serveur rejoue la liste des coups, sans pas fixe.

## 8. Décisions

- **Les étoiles** donnent un petit bonus d'écus **la première fois seulement**, dans le plafond par partie (§ 2). Ensuite, elles servent à progresser : elles débloquent les outils (les pioches du Filon) et les saisons suivantes. Les cases d'album, elles, se remplissent avec les trouvailles, pas avec les étoiles. Ainsi, rejouer un niveau ne crée pas d'écus en plus, et l'économie de l'île ne bouge pas.
- **L'Arrimage se joue au Ponton**, avec le bateau d'Aster : c'est lui qui charge sa cale. Il s'ouvre à un palier plus haut du Ponton que la Pêche. Ensuite, la fiche du Ponton propose les deux jeux.
- **Pas de classement entre amis pour l'instant.** Ce sera pour plus tard.
