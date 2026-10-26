# Brumelune — le fil rouge

26 octobre 2026. **Choix de l'auteur** : le jeu est recentré. Ce document dit la structure du jeu ; il passe avant
`HISTOIRE.md` pour tout ce qui suit le chapitre 1 (les anciens actes II à VII, Anya, les sceaux, le Grand Œuvre sont
mis de côté, archivés, pas supprimés). Rien n'est codé de ce qui est nouveau ici.

---

## 1. Le jeu en une phrase

**Un jeu mobile de survie : on échoue sur une île, on monte sa tribu puis son village, et on refait la civilisation
comme on peut.** Faussement choupi : mignon en surface, grave en dessous. Des chapitres, comme une série.

## 2. La structure

| Partie | Ce qu'on y fait | Le temps |
|---|---|---|
| **Chapitre 0 : le tutoriel** | 8 jours : Brume le premier soir, puis un PNJ principal par jour (7). Chaque jour apprend une vraie mécanique, qui sert tout le reste du jeu. Le soir du dernier jour, le conseil : on voit le phare. | accéléré, tenu par nous (`src/world/tutoClock.js`) |
| **Chapitre 1 : le phare** | Les PNJ croient que c'est la sortie : rallumer le phare, être vus, partir. Rebondissement : on ne peut pas partir. | à décider (§ 7) |
| **Chapitre 2 et la suite : survivre et rebâtir** | Le premier habitant arrive : l'accueillir, l'installer, lui donner un rôle. Il faut aussi trouver la clé du phare. Un compteur total de jours ; si le joueur perd, son score est gardé et il recommence (§ 7). | l'horloge de l'île : environ 1 h de jour et 15 min de nuit |

## 3. La règle d'un jour du tutoriel

**Le principe** : le tutoriel enseigne exactement ce qui gardera le joueur en vie ensuite. Chaque PNJ arrive avec un
besoin de survie, et repart avec un rôle permanent.

Chaque jour suit le même gabarit :

1. **Le matin, l'arrivée** : le PNJ, et le minimum à faire avec lui (le réveiller, l'aider, l'apprivoiser).
2. **Son besoin** : un besoin de survie réel (le froid, la faim, l'eau…).
3. **Une ou deux mécaniques vraies** pour y répondre, dont un mini-jeu quand il y en a un.
4. **Le soir autour du feu**, puis **la nuit**.

**La bonne dose** : 4 quêtes par jour, 5 au plus. Une seule notion neuve à la fois, une action réelle entre deux
explications (règle déjà posée dans `HISTOIRE.md`, § 9).

## 4. Les 8 jours du chapitre 0

| Jour | PNJ | Besoin | Ce qu'on apprend (mécaniques réelles) | Mini-jeu | Son rôle ensuite | État |
|---|---|---|---|---|---|---|
| 1 (soir) | **Brume** | le froid | combiner au Grimoire (Vent, Brasier), ramasser, bâtir (le feu) | — | le guide ; le Grimoire donne tous les plans | codé |
| 2 | **Lorena** | les matières | ouvrir un coffre, la Récolte, bâtir un bâtiment (Ponton), tracer un chemin | Récolte | la mer, plus tard le bateau | codé |
| 3 | **Agathe** | la faim | cuisiner, attraper et nourrir des bêtes, loger un PNJ (son abri) | Marmite, Poules | la nourriture du groupe | codé (la barrière passe au jour 4) |
| 4 | **Nathan** | la nuit | l'établi (assembler), poser, déplacer, pivoter, acheter un outil, défendre (torches, barrière) | — | les outils, la défense | codé |
| 5 | **Léo** | l'eau | réveiller un PNJ, un souvenir (suivre le ruban du Grimoire), un bâtiment qui produit (Puits) | — | l'eau | codé |
| 6 | **Maerys** | le bois | explorer (ouvrir un quartier, la brume recule), apprivoiser (un cadeau, l'amitié) | Cueillette | la forêt, les bêtes | **à faire** |
| 7 | **Robby** | la pierre (l'orage) | faire évoluer un bâtiment (palier II), monter la garde | Filon | la pierre, la défense | **à faire** |
| 8 | **Maggy** | durer | cultiver, les rôles (récolteur, artisan, guerrier : § 6), les réserves pour la nuit | — | les cultures | **à faire** |

Le soir du jour 8 : **le conseil**. Les sept et Brume autour du feu ; Léo voit le phare. Fin du chapitre 0.

### Le détail par jour

- **Jour 1, Brume** (quêtes : `pages`, `ramasser`, `feu`, `nuit`). La nuit est calme : Brume veille.
- **Jour 2, Lorena** (`caisse`, `recolte`, `premier-ponton`, `chemin-aster`, `veille`).
- **Jour 3, Agathe** (`soupe`, `cage`, `poules`, `poulailler`, `abri-cannelle`, `nuit-cannelle`) : 6 quêtes. La
  barrière passe au jour 4 (choix de l'auteur, 26 oct.), pour alléger son jour.
- **Jour 4, Nathan** (`deco`, `torches-rivet`, `barriere`, `outil-rivet`, `nuit-rivet`) : le jour de la nuit et des
  défenses qu'on fabrique.
- **Jour 5, Léo** (`eveil-ondin`, `souvenir-ondin`, `puits-ondin`, `chemin`).
- **Jours 6 à 8** : le détail, quête par quête, est au § 4 bis.

## 4 bis. Les jours 6 à 8, quête par quête (proposition, 26 oct.)

Ce qui existe déjà est repris : les arrivées de Brume (`ecriture/lots/04_maitres.md`, § 1), les souvenirs
`souvenir-sylve`, `souvenir-galet` et `eveil-melisse` (`src/texts/story.js`), les plans et les prix des bâtiments
(`HISTOIRE.md`, § 1.3), les nuits et le toucher qui repousse un égaré (`WorldView/nights.js`). Les répliques nouvelles
sont « à écrire » : seule leur intention est donnée ici.

**La montée du Grimoire** : le jour 5 apprend le ruban sur une page (la Pluie) ; le jour 6 en demande trois, le jour 7
trois aussi, mais en une seule chaîne (Lave, Pierre, Métal). Le jour 8 n'en demande aucune : c'est le jour des règles
de la survie.

### Jour 6, Maerys : le bois (5 quêtes)

| # | Quête | Ce qu'on fait | Mécanique apprise | Ce qu'elle sert ensuite |
|---|---|---|---|---|
| 1 | **La lueur** | Brume voit une lueur entre les arbres ; la queue rousse de Mousse guide jusqu'à La Lisière, qu'on ouvre. | explorer : ouvrir un quartier, la brume recule | agrandir l'île ; plus tard, les expéditions |
| 2 | **Apprivoiser Maerys** | Elle se cache, elle a peur du feu. On lui offre ce qu'elle aime. Elle s'approche : l'Athanor gagne sa 4e place (règle existante). | les cadeaux, l'amitié | le moral des PNJ, donc leur production et leur résistance |
| 3 | **Son souvenir : l'Arbre** | Vie (Air + Eau + Feu + Terre, la 4e place sert tout de suite), Plante, Arbre. | suivre le ruban sur plusieurs pages ; une recette à 4 éléments | toutes les longues chaînes du Grimoire |
| 4 | **Le Bosquet** | Le bâtir (plan Arbre, 5 pierres), puis **une partie de Cueillette offerte et guidée**. | un bâtiment de récolteur ; un mini-jeu de bâtiment | le bois, en continu |
| 5 | **La nuit** | Maerys dort à la lisière, pas au feu. | — | — |

À préparer : quand quelqu'un parle de partir, Maerys se tait, ou elle rit. *(à écrire)*

### Jour 7, Robby : la pierre avant l'orage (5 quêtes, allégé)

| # | Quête | Ce qu'on fait | Mécanique apprise | Ce qu'elle sert ensuite |
|---|---|---|---|---|
| 1 | **Le bruit de ciseau** | Brume l'entend du côté de la Colline ; on y va, on le trouve. Il dit « Hm. », Brume traduit. | bavarder (le minimum avec lui) | les Savoirs, les cœurs |
| 2 | **Son souvenir : la Pierre** | Lave (Feu + Terre), puis Pierre (Air + Lave). | le ruban, sans aide | — |
| 3 | **La Carrière** | La bâtir (plan Pierre, 5 bois), puis **une partie de Filon offerte et guidée**. | un deuxième mini-jeu de bâtiment | la pierre, en continu |
| 4 | **Plus de pierre avant l'orage** | La Carrière passe au palier II (plan Métal = Feu + Pierre). Il faudra de quoi réparer après l'orage. | **faire évoluer** un bâtiment : un plan plus des ressources, et il produit plus | toutes les évolutions du jeu ; le Métal sert ensuite (outils, Bois) |
| 5 | **La nuit d'orage : la garde** | Les égarés sortent de la brume. Robby et Maerys tiennent le camp ; le joueur en repousse d'un toucher. | **la défense active** ; les guerriers | les nuits de la survie |

À préparer : Robby, devant la mer, dit « Hm. » ; Brume ne traduit pas. *(à écrire)*

**Pourquoi c'est plus léger** (choix de l'auteur, 26 oct. : « alléger, mais propre ») :
- 3 pages au Grimoire au lieu de 4, et en une seule chaîne (Feu + Terre → Air + Lave → Feu + Pierre) au lieu de deux
  branches qui se rejoignent ;
- l'évolution porte sur le bâtiment qu'on vient de bâtir : pas d'aller-retour sur l'île ;
- l'Abri (Foyer II : Bois, 20 bois, 10 pierres) sort du tutoriel. Il devient un des premiers buts du chapitre 1,
  quand il faut tenir.

### Jour 8, Maggy : durer (5 quêtes, sans mini-jeu)

| # | Quête | Ce qu'on fait | Mécanique apprise | Ce qu'elle sert ensuite |
|---|---|---|---|---|
| 1 | **La barque de graines** | Une barque s'est brisée au nord ; Maggy dort sur sa boîte en fer. On la réveille : la Plante est déjà écrite, elle se souvient tout de suite (`eveil-melisse`). | réveiller ; un souvenir déjà écrit | — |
| 2 | **Le Potager** | Le bâtir (plan Plante, 8 seaux d'eau, du Puits de Léo). | un bâtiment qui dépend d'un autre | la nourriture, en continu |
| 3 | **La tribu** | Un écran montre les sept et leur rôle. On donne une tâche à chacun pour la nuit : les récolteurs rapportent, les artisans fabriquent, les guerriers veillent. | **les rôles** | tout le reste du jeu |
| 4 | **Les réserves** | Brume compte : huit bouches, combien de jours de vivres ? On remplit pour deux jours. | **la consommation** de chaque jour | la survie ; l'alerte « réserve vide » |
| 5 | **Le conseil** | Les sept et Brume autour du feu ; Léo voit le phare. Fin du chapitre 0. | — | le chapitre 1 |

### Ce que ces trois jours demandent au code (constat)

- **Le serveur** : les quêtes nouvelles (la lueur, la garde, la tribu, les réserves), l'ordre des quêtes, une partie
  offerte de Cueillette et de Filon pendant le tutoriel (aujourd'hui, ces jeux s'ouvrent au palier III).
- **Nouveau, à concevoir** : l'écran de la tribu (les rôles et leurs tâches), et la consommation de vivres par jour.
- **À vérifier à l'équilibrage** : le prix de La Lisière (150 écus aujourd'hui) pendant le tutoriel ; assez de bois et
  de pierres pour le Bosquet et la Carrière ; le coût de la Carrière II (il est sur le serveur, je ne l'ai pas lu).
- **La tribu** (validé par l'auteur, 26 oct.) : les rôles des 7 étant fixes, on apprend à leur donner une tâche, pas à
  choisir leur rôle.

**Préparer le rebondissement** : Maerys et Robby vivent sur l'île depuis des années. Ils savent qu'on ne part pas, et
ils se taisent. Une demi-phrase de chacun, les jours 6 et 7, suffit.

## 5. Chapitre 1 : le phare

- **Le but** (dit au conseil) : rallumer le phare, pour qu'un navire nous voie.
- **Le rebondissement, en deux temps** (choix de l'auteur) :
  - **B, on le vit** : Lorena ne tient plus et prend la mer. Elle ressort de la brume… sur la plage de Brumelune.
    L'île ne laisse sortir personne.
  - **C, on le comprend** : dans le phare, le journal des Anciens : « Nous aussi, nous voulions partir. » Ils sont
    tous restés, et pas par choix.
- **La fin du chapitre** : on ne partira pas. Alors on reste, et on tient. **Le phare n'est pas rallumé** : il est
  verrouillé par une étrange porte antique. Il faudra trouver la clé (le fil du chapitre 2).

## 6. Les rôles (idée de l'auteur, 26 oct.)

Chaque PNJ reçoit un rôle, parmi trois familles : **récolteur**, **artisan**, **guerrier**. Les rôles s'apprennent au
jour 8 ; au chapitre 2, le premier habitant reçoit le sien en arrivant.

- **Les habitants** (dès le chapitre 2) : le joueur choisit librement leur rôle ; chacun a un bonus dans son rôle
  naturel (choix de l'auteur).
- **Les 7 PNJ principaux** ont déjà leur rôle, varié, qui suit ce qu'ils enseignent au tutoriel, et **fixe pour toute
  la partie** (3 récolteurs, 2 artisans, 2 guerriers ; validé par l'auteur, 26 oct.) :

| PNJ | Rôle | Pourquoi (son jour du tutoriel) |
|---|---|---|
| Lorena | récolteuse | jour 2 : la Récolte, les matières ; la mer, plus tard la pêche |
| Agathe | artisane | jour 3 : la cuisine, transformer ce qu'on récolte en repas |
| Nathan | artisan | jour 4 : l'établi, les outils, les défenses qu'on fabrique (torches, barrière) |
| Léo | récolteur | jour 5 : l'eau, le Puits |
| Maerys | guerrière | jour 6 : l'exploration ; des années seule dans la forêt, elle chasse et éclaire la route |
| Robby | guerrier | jour 7 : la nuit d'orage ; des années seul près des pierres, il tient le camp avec son maillet |
| Maggy | récolteuse | jour 8 : les cultures |

Conséquence pour le jour 7 : Robby n'apprend plus seulement à faire évoluer l'abri, il apprend aussi à **monter la
garde** pendant l'orage (la première défense active ; le jour 4 reste celui des défenses qu'on fabrique).

## 6 bis. Ce qui vient plus tard (pas dans le chapitre 0)

Les armes, améliorer les personnages, les boutiques avancées : après le chapitre 1, une fois les bases en place.

## 7. La survie : décisions et questions ouvertes

### Décidé (choix de l'auteur, 26 oct.) : pour la fin du jeu, pas pour le tutoriel

- **On perd** quand :
  - les ressources manquent et plus rien ne produit ;
  - **plus de 3 PNJ sont morts**.
- **Le temps passe quand l'application est fermée** : le joueur laisse une vie tourner. Les PNJ vivent, doivent
  manger (il faut de quoi), et le camp doit avoir de quoi se défendre.
- **Les expéditions sont un risque** : envoyer des PNJ trop loin sans assez de ressources ni d'armes peut mal finir.
- La règle de la bible « jamais punitif, rien n'est perdu » ne vaut plus pour cette partie du jeu.

**Ce que ça veut dire pour le tutoriel** : il doit avoir appris tout ce qui garde en vie. Le tableau du § 4 le
couvre déjà : les matières (jour 2), la nourriture (jour 3), la défense (jour 4), la production (jour 5), l'exploration
(jour 6), les réserves et le travail (jour 8).

- **Le serveur calcule le temps écoulé** quand le joueur revient (le téléphone n'est pas cru).
- **Prévenir, puis un délai de grâce**, qui fait partie du jeu (pas un simple minuteur).
- **Les 7 PNJ principaux peuvent mourir**, plus difficilement que les autres : c'est la négligence qui les achève. Le
  délai de grâce existe surtout pour eux.
- **Recommencer** : on garde son look si on veut ; on saute le tutoriel si on veut, et l'on reçoit une caisse de
  ressources de son choix.
- **L'horloge** : l'île a sa propre heure (environ 1 h de jour et 15 min de nuit), au lieu de suivre l'heure du
  téléphone comme aujourd'hui après le tutoriel (`src/world/sky.js`).

- **Tout le reste repart à zéro** en recommençant, le Grimoire et ses pages écrites compris.
- **Les alertes du délai de grâce** : un PNJ affaibli, un PNJ blessé, une réserve de ressources vide.

### Encore ouvert

- **La durée du délai de grâce** : à fixer à l'équilibrage.

## 8. Écarts avec le code actuel (relevés, rien touché)

- Le conseil se joue aujourd'hui après le jour de Léo (le Campement) ; il passe au soir du jour 8.
- La barrière (`barriere`) est aujourd'hui une quête du jour 3 ; elle passe au jour 4 (`src/game/prologue.js`,
  `src/world/tutoClock.js`, et l'ordre des quêtes côté serveur).
- Les mini-jeux Pêche, Filon et Cueillette s'ouvrent au palier III de leur bâtiment, et leurs parties reviennent toutes
  les 2 h réelles (`src/game/minigames.js`) : à revoir pour les apprendre pendant le tutoriel.
- Les rôles (récolteur, artisan, guerrier) n'existent pas : chacun travaille seul à son bâtiment
  (`src/world/village/residents.js`).
- Il n'y a aucune défaite ; les besoins des PNJ (manger, outils, déco) ont des minuteurs de plusieurs heures, côté
  serveur.
- L'objectif de fond s'affiche par acte (« Objectif de fond · Acte N », `PhareGoal.vue`) : les actes deviennent des
  chapitres.
- Les quêtes vivent sur le serveur (`Og-create-backend`, `services/quests.js`), hors de ce dépôt.
