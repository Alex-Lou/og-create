# B4 — La marmite de Cannelle (spec à valider, 13 octobre 2026)

Statut : **choix validés par l'auteur le 13 octobre** (Q1 soupe du matin, Q2 mettre-touiller-servir, Q3 économie
inchangée, Q4 le Grimoire au Foyer III, lot suivant). Textes validés (fin A, l'indice du goût). **Codé le 13 octobre** : `src/game/cooking.js`, `Games/CookingPot/`, `WorldView/cooking.js` ; banc `tuto-jour.cjs` (DEPART=soupe FIN_AT=cage CPU=4). La marmite ne s'ouvre
qu'à la quête `soupe` ; la faim quotidienne de Cannelle, ensuite, se comble toujours d'un toucher.

---

## 1. Ce qui existe (lu dans le code, pas supposé)

- **La soupe d'aujourd'hui** (quête `soupe`, jour 3) : on ramasse deux coquillages (5 vivres chacun,
  `B/src/services/pickups.js`), Cannelle dit « Des coquillages crus ? Ma brindille, on n'est pas des sauvages. Donne :
  je te fais une soupe. », puis **un toucher sur sa bulle de faim** comble le besoin « Manger » (10 vivres,
  `B/src/services/villagers.js : NEEDS.manger`). La soupe est **dite**, jamais **faite** : le geste est celui d'un
  paiement. C'est la leçon des bulles (« quand quelqu'un a besoin de toi, une bulle te le dit »), à garder.
- **La chasse aux poules** (le modèle technique) : une scène plein écran à part (`Games/HenChase/`), règles pures
  testées (`src/game/henChase.js`), boucle rAF qui écrit `translate3d`, dessins superposés, l'île en pause dessous,
  le coach en veille, bouton « Plus tard ». Pas de rejeu serveur : le serveur ne juge que la quête. ~60 images/s
  processeur ralenti 4×.
- **Les mini-jeux des bâtiments** (`B/src/services/minigames.js`) : Pêche (Ponton), Filon (Carrière), Cueillette
  (Bosquet), au palier III, moteurs déterministes rejoués par le serveur, réserve de 3 parties, écus plafonnés.
  **Le Foyer n'en a pas** : la marmite est sa place naturelle.
- **Le Grimoire et la cuisine** (`B/db/content/`) : Soupe = Eau + Légume, Eau + Feu + Poisson, Légume + Eau + Feu ;
  Pain = Eau + Farine + Feu, Farine + Four ; Crêpe = Farine + Lait ; Gâteau = Farine + Sucre ; Remède = Eau + Herbe
  médicinale + Feu… Tout est au chapitre V « Le Foyer » (25 découvertes).
- **La contrainte qui décide du lien Grimoire** : au jour 3, seuls les chapitres I et II sont ouverts, l'eau douce
  n'existe pas (elle vient avec la Pluie, au jour d'Ondin) et le Poisson demande la Vie (4 places dans l'Athanor).
  **Écrire la Soupe au tutoriel est impossible sans casser la chaîne « jamais d'impasse ».**
- **Dessins disponibles** (lecture seule de `design/`) : Cannelle « face_louche » 1-2 (elle touille), bols 1-3,
  coquillages (nacrés, étoile, petits), bois flotté aux algues, calques de la cuisine du Foyer. **Manquent** : une
  marmite seule en gros plan (avec son bouillon à 3 états), une louche seule. Repli prévu en code (comme
  `ABRI_CANNELLE`), et demande à transmettre à l'agent design.

---

## 2. La proposition (recommandations)

### 2.1 Où (Q1)
Au matin du jour 3, **à la place du paiement muet** : la bulle de faim de Cannelle ouvre sa marmite. La leçon des
bulles reste (on touche la bulle), mais ce qu'on fait ensuite est un vrai geste de cuisine, avec elle. La soirée
« À table ! Ce soir, on mange chaud. » reste telle quelle.

### 2.2 Le geste (Q2) : trois temps courts, une scène de 30 à 45 secondes
1. **Mettre** : les ingrédients attendent sur la planche (au tutoriel : les deux coquillages ramassés, une poignée
   d'algues, l'eau de mer… liste exacte à valider) ; on les **glisse** dans la marmite, un par un. Chacun fait
   « plouf », le bouillon change de teinte.
2. **Touiller** : on **trace des cercles** sur la marmite (comme Cannelle avec sa louche) ; un compteur discret
   (3 tours), des bulles montent, le fumet se lève. « Ce qui mijote ne se presse pas » : tourner trop vite éclabousse
   (un effet, jamais un échec).
3. **Servir** : on **glisse la louche** de la marmite au bol ; Cannelle goûte (réplique), la scène se ferme sur le
   bol fumant.

**Aucun échec possible au tutoriel** (le joueur n'est jamais lâché) : la main du coach montre chaque geste ; un
mauvais geste ne fait que rater son effet. « Plus tard » ferme la scène comme la chasse ; la bulle la rouvre.

### 2.3 L'économie (Q3)
**Inchangée au tutoriel** : la soupe coûte les 10 vivres du besoin « Manger » et le comble, payés **au moment de
« Servir »**, par l'appel serveur qui existe déjà (aucune règle nouvelle, aucune migration). Si le stock manque, le
coach renvoie à la Récolte avant d'ouvrir la marmite (`questShort` le fait déjà).

### 2.4 Le lien Grimoire (Q4)
Au tutoriel, c'est **la soupe de coquillages de Cannelle, sa recette à elle, sans page** (impossible autrement, § 1).
Le lien vient au **lot suivant** : le jeu du Foyer au palier III (comme la Pêche ou le Filon), où **chaque recette
écrite au Grimoire** (Soupe, Pain, Crêpe, Gâteau, Remède…) devient une commande de la marmite, avec ses ingrédients
réels. Le Grimoire reste la clé ; la marmite en est l'usage visible (« UTILISER TOUT ! »).

### 2.5 La fluidité (pas de question : même technique que la chasse)
Règles pures dans `src/game/cooking.js` (testées : ordre des ingrédients, tours de louche, fin), scène
`Games/Cooking/Cooking.vue` en plein écran, boucle rAF seulement pendant un geste (rien par image au repos), écrits
directs de `transform`, l'île en pause dessous (`syncLoop`), le coach en veille, tout arrêté au démontage. Mesure au
banc : 60 images/s visées, processeur ralenti 4×.

---

## 3. Ce que ça touche (si les recommandations passent)

- **Jeu** : `src/game/cooking.js` (+ test), `Games/Cooking/` (scène + CSS), `WorldView` (ouvrir la scène depuis la
  bulle de faim de Cannelle pendant la quête `soupe`), `game/prologue.js` (leçon de la soupe : un geste de plus),
  `texts/tutorial/` (répliques et consignes, **après validation**), repli de dessin pour la marmite.
- **Serveur** : rien (le besoin « Manger » et la quête `soupe` restent).
- **Hors périmètre** : `design/`, la barre d'onglets, toute migration.
- **Banc** : `tuto-jour.cjs` avec `DEPART=soupe`, captures des trois temps, mesure CPU 4×.

## 4. Textes à écrire (après les réponses, en tableau)
Les répliques de Cannelle pendant les trois temps (au plus deux à la suite, 140 caractères), les consignes du coach
(une par geste, non répétées), le titre et le bouton de la scène.
