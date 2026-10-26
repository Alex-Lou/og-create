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
| 3 | **Agathe** | la faim | cuisiner, attraper et nourrir des bêtes, loger un PNJ (son abri) | Marmite, Poules | la nourriture du groupe | codé, **trop chargé** |
| 4 | **Nathan** | la nuit | l'établi (assembler), poser, déplacer, pivoter, acheter un outil, défendre (torches, barrière) | — | les outils, la défense | codé |
| 5 | **Léo** | l'eau | réveiller un PNJ, un souvenir (suivre le ruban du Grimoire), un bâtiment qui produit (Puits) | — | l'eau | codé |
| 6 | **Maerys** | le bois | explorer (ouvrir un quartier, la brume recule), apprivoiser (un cadeau, l'amitié) | Cueillette | la forêt, les bêtes | **à faire** |
| 7 | **Robby** | l'abri (l'orage) | faire évoluer un bâtiment (palier II) | Filon | la pierre, les évolutions | **à faire** |
| 8 | **Maggy** | durer | cultiver, les rôles (récolteur, artisan, guerrier : § 6), les réserves pour la nuit | Moisson | les cultures | **à faire** |

Le soir du jour 8 : **le conseil**. Les sept et Brume autour du feu ; Léo voit le phare. Fin du chapitre 0.

### Le détail par jour

- **Jour 1, Brume** (quêtes : `pages`, `ramasser`, `feu`, `nuit`). La nuit est calme : Brume veille.
- **Jour 2, Lorena** (`caisse`, `recolte`, `premier-ponton`, `chemin-aster`, `veille`).
- **Jour 3, Agathe** (`soupe`, `cage`, `poules`, `poulailler`, `abri-cannelle`, `barriere`, `nuit-cannelle`) : 7
  quêtes, c'est trop. **Proposition** : la barrière passe au jour 4, avec les torches ; le jour de Nathan devient
  celui de la nuit et de la défense.
- **Jour 4, Nathan** (`deco`, `torches-rivet`, `outil-rivet`, `nuit-rivet`, et la barrière si on la déplace).
- **Jour 5, Léo** (`eveil-ondin`, `souvenir-ondin`, `puits-ondin`, `chemin`).
- **Jour 6, Maerys** (proposition) : suivre une lueur dans les arbres (explorer La Lisière) ; l'apprivoiser (elle a peur
  du feu : un cadeau) ; son souvenir, l'Arbre, au Grimoire ; son Bosquet ; la nuit.
- **Jour 7, Robby** (proposition) : un bruit de ciseau du côté de la Colline, on le trouve ; son souvenir, la Pierre ;
  la Carrière ; faire évoluer l'abri pour tenir l'orage ; la nuit d'orage.
- **Jour 8, Maggy** (proposition) : une barque de graines s'échoue, on la réveille ; le Potager ; donner un rôle à
  chacun pour la nuit ; les réserves ; le conseil.

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

### Encore ouvert

1. **Recommencer, le reste** : tout repart-il à zéro, le Grimoire et ses pages écrites compris ?
2. **Le délai de grâce dans le jeu** : à quoi il ressemble (un PNJ affaibli, puis à bout, puis mort ? Brume qui
   prévient ?) et combien de temps il dure.
3. **Les rôles** : le joueur choisit-il librement le rôle de chacun, ou chaque PNJ a-t-il le sien ? Un PNJ est-il
   meilleur dans un rôle (Nathan artisan, par exemple) ? Change-t-on de rôle ?
4. **Le jour 3** : il compte 7 quêtes ; déplacer la barrière au jour 4 (avec les torches) l'allégerait.

## 8. Écarts avec le code actuel (relevés, rien touché)

- Le conseil se joue aujourd'hui après le jour de Léo (le Campement) ; il passe au soir du jour 8.
- Les mini-jeux Pêche, Filon et Cueillette s'ouvrent au palier III de leur bâtiment, et leurs parties reviennent toutes
  les 2 h réelles (`src/game/minigames.js`) : à revoir pour les apprendre pendant le tutoriel.
- Les rôles (récolteur, artisan, guerrier) n'existent pas : chacun travaille seul à son bâtiment
  (`src/world/village/residents.js`).
- Il n'y a aucune défaite ; les besoins des PNJ (manger, outils, déco) ont des minuteurs de plusieurs heures, côté
  serveur.
- L'objectif de fond s'affiche par acte (« Objectif de fond · Acte N », `PhareGoal.vue`) : les actes deviennent des
  chapitres.
- Les quêtes vivent sur le serveur (`Og-create-backend`, `services/quests.js`), hors de ce dépôt.
