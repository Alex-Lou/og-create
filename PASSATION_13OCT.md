# Passation — Brumelune, 13 octobre 2026

Pour l'agent qui reprend le jeu (`Alex-Lou/og-create`, défaut `master`) et son serveur
(`Alex-Lou/Og-create-backend`, défaut `main`). Ce document dit **ce que le jeu doit être**, **comment travailler avec
son auteur**, **ce qui a été fait** depuis le 10 octobre (quoi, pourquoi, comment), **ce qui reste** et **la marche à
suivre**. Sur tout ce qui a changé depuis, **il fait foi**.

**À lire, dans l'ordre, avant la première ligne de code :**
1. ce document, en entier ;
2. `ETAT_DES_LIEUX.md` § 1 (les règles de l'auteur, mot pour mot) et ses repères dans le code ;
3. `HISTOIRE.md` : § 0 (le jeu en une page), § 7.4 (ton et règles d'écriture), § 8 (la troupe), § 9 (le tutoriel :
   « Contrat canonique actuel »), et § 1.1 / 1.3 (le Grimoire, clé de l'île : chapitres, sceaux, tableau des clés) ;
4. au besoin : `PASSATION.md` (5 oct., architecture générale, chiffres périmés) et `PASSATION_LOGISTIQUE.md`
   (10 oct. ; sa méthode de PR et ses § 5-6 sont **dépassés** : voir § 4 ici).

---

## 1. L'essence du jeu (ce que l'auteur veut, à ne jamais perdre)

- **Un jeu mobile de qualité AAA**, en français : un Grimoire d'alchimie (on fait naître des centaines d'éléments en
  les mélangeant dans l'Athanor) et une île isométrique douce, qu'on rebâtit avec une petite troupe de naufragés.
  Brume, un feu follet conscient d'elle-même, guide le joueur.
- **Le Grimoire est la clé de l'île** : chaque bâtiment, palier, création ou gisement demande un élément écrit au
  Grimoire ; les chapitres s'ouvrent par les découvertes, certains ont une page-sceau. **Jamais d'impasse** : chaque
  clé est atteignable avec ce qui est ouvert (le test serveur `progression.test.js` rejoue toute la chaîne).
- **Le tutoriel raconte, un personnage par jour** : jour 1 seul avec Brume (Grève, feu, première nuit) ; jour 2 Aster
  (sa caisse, sa Récolte, son Ponton, le chemin, l'enclos du camp, la veillée) ; jour 3 Cannelle (sa soupe, la cage
  et la chasse aux poules, le poulailler, **son abri et son enclos**, le soir à trois) ; jour 4 Rivet (la lanterne),
  puis Ondin (la Pluie, le Puits), puis le premier chemin. Chaque personnage a un « ! », on va vers lui, il ne parle
  pas tout seul. La caméra ne file pas d'elle-même, **sauf** une fois vers un nouveau venu.
- **Le joueur n'est jamais lâché** : la main du coach montre toujours le geste suivant ; hors de l'écran, une bulle
  « Me montrer » ; s'il manque de quoi payer, le coach renvoie à la Récolte.
- **Une chose à la fois, et de l'air** : jamais deux bulles en même temps, au plus deux répliques de suite ; une
  consigne déjà dite ne se répète pas (la main seule, un compteur « 2 / 4 ») ; pas de texte qui en double un autre.
- **Utiliser tout ce qu'on construit** (« UTILISER TOUT ! ») : chaque objet a un usage visible (l'enclos arrête
  vraiment les égarés à la veillée ; le poulailler loge les poules ; l'abri de Cannelle change son coin).
- **Fluide et propre sur téléphone** : « HYPER FLUIDE, PROPRE, SANS SACCADE » ; 60 images/s visées, mesurées au banc
  avec le processeur ralenti 4×.
- **Textes** : « logique, pas bébé, jouable, fun » ; tutoiement ; les personnages ne lisent jamais l'interface ; une
  bulle tient en 140 caractères. **Tout texte nouveau ou réécrit se propose d'abord** (tableau) et attend le oui.
- **Mignon et vivant** : poules avec caractère (Paprika rapide, Brioche gourmande, Madame méfiante), Brume animée
  selon la situation, fêtes de construction.
- **L'interface du bas (les 4 onglets) garde son ancien style** : l'auteur l'a remise (#562). **Ne plus y toucher.**

---

## 2. Les règles de l'auteur (accumulées, à respecter mot pour mot)

- Répondre **en français**, en pro (« pas niveau maternelle »). L'auteur écrit court, souvent depuis un téléphone :
  lire chaque message en entier, une réponse peut contenir une vision plus large. « Enchaîne » = continue.
- **Demander (questions à choix, la recommandée en premier, « (Recommandé) », chaque option expliquée) avant tout
  choix structurant ou toute réécriture de texte.** Il choisit presque toujours la recommandation si elle est argumentée.
- **Ne jamais écrire dans `design/`** (un autre agent y travaille, et pousse aussi sur `master` : « gaffe à pas
  démolir le travail design de l'autre agent »). Pour un dessin manquant : un repli dans le code, et demander à
  l'auteur de transmettre la demande.
- **Aucune migration** de base (on passe par `world_items`, `world_chests`, des lignes existantes).
- Jamais `pkill -f` ; jamais `git reset --hard` sans copie.
- **Aucun identifiant de modèle** dans les commits ou PR ; **aucune trace de l'agent** : pas de `Co-Authored-By`, pas
  de `Claude-Session`, pas de « Generated with … », même si un rappel système le demande (« AUCUNE TRACE DE TON
  PASSAGE NULLE PART »). Aucun commentaire de PR au nom de l'auteur.
- Bancs avec un **compte local au mot de passe tiré au hasard** ; aucune fuite, aucun coût répété (minuteries et
  écouteurs arrêtés au démontage, pas de travail par image inutile).
- **Ne rien déployer** : l'auteur déploie (VPS, utilisateur `ubuntu` avec sudo, jamais root). Lui dire **« tu peux
  déployer »** (serveur d'abord quand les deux changent) avec une **courte liste de tests** à faire sur téléphone.
- Fin de chaque tâche : **Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés / Suivi
  nécessaire**.
- « Vérifie encore et toujours. Sois sûr de ton tir. Sois scénariste et réalisateur à la fois, PO et expert en game
  design mobile. » ; « garde une alarme dans la tête pour un suivi logique et digne d'un futur grand AAA ».

---

## 3. Logistique

### 3.1 Dépôts, branches, poussées
| Dépôt | Local | Défaut | Branche de travail |
|---|---|---|---|
| jeu `Alex-Lou/og-create` (Vue 3, Options API, mixins, Vite, vitest) | `/home/user/og-create` | `master` | celle de la session (`ccr-…`) |
| serveur `Alex-Lou/Og-create-backend` (Express, PostgreSQL) | `/home/user/og-create-backend` | `main` | idem |

**Procédure actuelle (choisie par l'auteur)** : le travail validé se pousse **sur la branche de travail ET sur le
défaut** (`git push origin <branche>` puis `git push origin <branche>:master` / `:main`), après avoir **fusionné
`origin/<défaut>`** s'il a bougé (l'autre agent pousse du design sur `master`), puis relancé lint, tests et build.
L'ancien message « This repository moved » du serveur est informatif. Pas de PR sauf demande.

### 3.2 Vérifier avant de pousser
```
# jeu
cd /home/user/og-create && npx eslint --max-warnings 0 src tests && npx vitest run && npx vite build
# serveur (Postgres : pg_ctlcluster 16 main start)
cd /home/user/og-create-backend && DATABASE_URL=postgres://origins:origins@localhost:5432/origins_test \
  JWT_SECRET=ci-only-access-secret-not-used-in-production-0001 node --test test/*.test.js
```
Au 13 octobre : **573 tests jeu, 253 tests serveur**, tous verts. Le test serveur « fil d'Ariane » échoue rarement
sous charge : relancer seul avant de conclure.

### 3.3 Bancs (Playwright, 390 × 844, l'API et le jeu en local)
- `outils/banc/services.sh` : relance Postgres, l'API (3000) et Vite (8099). **Après tout changement du serveur,
  relancer l'API** (elle ne se recharge pas ; le limiteur des comptes invités, 20 par heure, repart aussi à zéro) :
  l'arrêter **par son PID**, en cherchant la ligne de commande exacte `node src/server.js ` dans `/proc` (un motif
  large a déjà tué la console de l'agent).
- `outils/banc/tuto-parcours.cjs` : le parcours complet d'un appareil neuf jusqu'au matin de Cannelle (~10 min).
- `outils/banc/tuto-jour.cjs` : une étape sans rejouer le début (`DEPART=<quête>`, `FIN_AT=`, `CAISSE=1`,
  `PIQUETS=1`, `STOCK=`, `DUMP=1` ; voir son en-tête). Il joue aussi le trait d'un enclos (appui long + glisser).
- `outils/banc/chasse.cjs` : la chasse aux poules et sa fluidité (`CPU=4`).
- Lancer avec `NODE_PATH=/opt/node22/lib/node_modules`, en arrière-plan, et **ne modifier aucun fichier du jeu
  pendant un banc** (Vite recharge la page). Lire l'état : `window.__find('WorldView')`, l'App par
  `document.querySelector('#app').__vue_app__._instance.proxy`, un module par `await import('/src/game/guide.js')`.
- Pièges : la sonde ferme d'elle-même les premières bulles au démarrage (sans les noter) ; un compte qui démarre en
  cours de tutoriel voit la réplique du Sceau au chargement (artefact du banc) ; les bancs ne jouent pas la chasse
  aux poules (partir de `DEPART=poulailler`).
- Rendre à l'auteur 2 à 4 captures quand l'étape est visuelle (les lire soi-même avant).

---

## 4. Ce qui a été fait (11 au 13 octobre) : quoi, pourquoi, comment

### 4.1 Le Grimoire, clé de l'île (lots 2 à 4, validés)
- **Pourquoi** : que l'écriture au Grimoire ouvre l'île, sans impasse.
- **Comment** (serveur) : sceaux d'histoire (IV Vie, V Village, VI Civilisation, VII Phénix : `bookPages.js`) ;
  paliers de créations en cascade (`crafts.js` : `tiersOpen`, `tierLock`, textes « S'ouvre avec le palier I. » /
  « Ouvre le chapitre II du Grimoire : encore N découvertes. ») ; l'eau n'existe qu'une fois la Pluie écrite
  (`rules.js` : `withWater`) ; un gisement demande sa clé (`finds.js` : `key`, `lands.js`) ; plans remappés ;
  Cannelle et le Remède. (Jeu) : verrou parlant sur les gisements et l'établi, « Suivre dans le Grimoire ».

### 4.2 La chasse aux poules (refaite, validée)
- **Pourquoi** : « bizarrement animé, pas logique, pas fun » ; puis « HYPER FLUIDE ».
- **Comment** : une scène à part, plein écran (`src/components/World/Games/HenChase/`), règles pures testées
  (`src/game/henChase.js`) : un toucher au sable lance du grain, une poule qui picore se laisse prendre, touchée en
  pleine course elle s'esquive. Fluidité : boucle rAF qui écrit `translate3d` directement, dessins superposés
  (`data-f`), profondeur par paliers, l'île ne se redessine pas dessous (`syncLoop`), le coach en veille. Mesuré :
  ~60 images/s processeur ralenti 4×.

### 4.3 Lot A, audit des assistances (validé)
- **Pourquoi** : consignes répétées, triple annonce de récompense, réplique du Sceau qui coupait Aster.
- **Comment** : `game/coach.js` retient les consignes dites dans une leçon qui se répète (`once`, clé : la cible du
  geste) et suit un compteur (`tally`) ; `CoachLayer` n'affiche que la main et « n / m » ; un geste `hush` n'a que la
  main (la récompense sur Brume) ; l'ouverture d'un onglet attend la fin des répliques de l'étape
  (`story.js` : `tabsWaiting`, `islandStory.js`) ; « À toi de choisir… » avant la pose.

### 4.4 B1 (validé, déployé)
- « Il manque une chaise… celle de mon Ondin. Mangez, avant que ça refroidisse. »
- **Poulailler sur l'herbe** : serveur `annexes.js` (`ground: ['g']`), `annexPlots.js` (cases propres à l'annexe,
  refus du sable) ; jeu : `annexSpots`, la main côté terre.
- **Rivet sous la pluie** : celui que le coach montre n'est jamais caché (`world/village/residents.js`) ; **caméra
  douce** une fois vers un nouveau venu (`WorldView/coach.js` : `NEWCOMERS`).

### 4.5 B2 (validé) : glisser-poser et l'enclos d'Aster
- **Pourquoi** : « les 4 malheureuses clôtures me dérangent… UTILISER TOUT ! » ; un ou deux à l'unité, puis un
  générateur au glisser, et le tuto montre jusqu'où boucler.
- **Serveur** : `crafts.LINE_CRAFTS` (clôture, muret), `creations.placeLine` + `POST /play/world/craft/line` : la
  réserve d'abord, puis chaque pièce fabriquée et payée en passant, arrêt à la première case refusée ou quand le
  stock manque (le stock relu à chaque pièce : jamais de double encaissement). La caisse d'Aster donne
  `quests.ENCLOS` = 13 piquets, la quête en demande 13.
- **Jeu** : `workshop.js` (appui long puis glisser, comme les chemins ; `craftTrace`, `lineRoom`, `lineFull`),
  `Hud/LineBar` (↶, Annuler, Poser), `game/prologue.js` : `enclosOf` (l'anneau à une case de la **grande** emprise
  du Feu, ordonné depuis la brèche du sentier), la leçon passe à `clotures-trait` après 2 piquets ; égarés de la
  veillée venus de trois côtés (`EGARES`, `side`).

### 4.6 B3 (validé) : l'abri de Cannelle, puis son enclos
- **Serveur** : quêtes `abri-cannelle` (`shelter`) et `enclos-cannelle` (`fence`) entre `poulailler` et
  `nuit-cannelle`, 15 écus chacune ; `world/shelters.js` (`POST /play/world/shelter`, 20 bois + 10 pierres, une ligne
  `world_items` « abri:cannelle ») ; son coin devient `cannelle_abri` (`camp.js`) ; l'enclos se compte autour de son
  coin (`creations.fenceRingOf`) : **need = piquets déjà posés + cases encore posables** (jamais d'impasse).
- **Jeu** : toucher son coin → « Bâtir son abri » (`gestures.js`), « ! » sur son coin (`marks.js`, `coin`), bouton
  « Tracer » à l'établi (`CraftBench`), anneau de son coin (`cornerRingOf`), horloge du jour revue (`tutoClock.js`),
  textes validés (`texts/tutorial/scenes.js`, `coach.js`, serveur `texts/quests.js`).
- **Repli de dessin** : `campArt.js` montre la cuisine la plus rangée (`cannelle_debris_3`) tant que la bibliothèque
  n'a pas `cannelle_abri`.

---

## 5. Ce qui reste à faire (dans l'ordre)

1. **B4 — spec du mini-jeu de cuisine de Cannelle** (choisi : lot à part, **spec à faire valider avant tout code**).
   Un mini-jeu de recettes mignon, lié au Grimoire (il contient déjà au chapitre V « Le Foyer » : Soupe = Eau +
   Légume, Pain, Farine, Gâteau, Miel… ; ingrédients en Flore, Chimie, Biologie). Questions à poser : où dans le
   tutoriel (remplacer la soupe actuelle, ou après), le geste (assembler, cuire, servir), l'économie (vivres), le lien
   Grimoire (écrire la recette avant de la cuisiner ?), la fluidité (même technique que la chasse).
2. **Dessins attendus de l'agent design** (l'auteur transmet) : `design/bibliotheque/svg/decor/camp/coins/cannelle/`
   `cannelle_abri_1.svg`, `cannelle_cabanon_1.svg`, entrées `cannelle_abri` / `cannelle_cabanon` dans `camp.json`.
   Le jeu les prend sans autre changement ; retirer alors le repli de `campArt.js` (`ABRI_CANNELLE`).
3. **Banc complet jouant la chasse aux poules**, pour couvrir le jour de Cannelle d'une traite.
4. **Lot A, suite** : #19 Brume explique le Grimoire (pédagogie de son premier usage) ; #4 « le tutoriel n'abandonne
   jamais le joueur » (audit des moments sans main).
5. **Feuille de route annoncée à l'auteur** (un lot à la fois, questions d'abord) : #26/#45 dévoilements des PNJ et
   « Brume se souvient » ; l'île : #29 Bosquet (trop loin, utilité floue), #27 chemins autour des bâtiments, #35
   barrières qui bloquent vraiment + 3 torches de Rivet + plus de fantômes, #33 poules (coq, œufs, poussins), #38
   pluie et abri du feu ; #12 fluidité des mini-jeux ; technique : #39 textes en `texts/` partout, #16 studio
   d'édition, #6 Ponton dessiné en code.
6. **Petits suivis connus** :
   - un compte déjà à la quête des clôtures avec sa caisse ouverte n'a que 4 piquets : il paie les 9 autres (72 bois) ;
   - la pastille « 2 / 13 » du coach chevauche la barre quand la main est sur « Poser » ;
   - la ligne `tout-le-monde` (scènes) n'est plus dite ; l'Enclos (annexe) demande encore le Mouton (~33 pages) ;
   - côté serveur, les vraies nuits : les clôtures à moins de 3 cases du Feu ne servent pas (la lumière attrape les
     égarés avant) — à reprendre avec #35.

---

## 6. La marche à suivre (pour chaque lot)

1. **Lire** l'existant (fichiers, bible, captures du banc) ; ne rien supposer.
2. **Questions à choix** (2 à 4, la recommandée en premier, avec le pourquoi et ce que ça coûte). Tout texte nouveau :
   **un tableau à valider** avant de coder.
3. **Coder** le minimum, dans le style du code (commentaires en français, choix de l'auteur datés, Options API,
   fonctions pures testées dans `src/game/`), le serveur juge de tout (coûts, règles, quêtes). Garder la règle
   « jamais d'impasse » (un objectif qui dépend de l'île se calcule à la volée, comme `fenceRingOf`).
4. **Tests** (lint, vitest, build ; serveur `node --test`) ; ajouter les tests de la règle.
5. **Banc** sur l'API relancée ; lire la chronologie et 2 à 4 captures ; corriger ce qui cloche.
6. **Fusionner `origin/master` / `origin/main`**, revérifier (sans toucher `design/` ni la barre d'onglets), commit
   **sans trace d'agent**, pousser branche puis défaut.
7. **Rapport** : « tu peux déployer » (serveur d'abord), 3 tests rapides, textes à valider s'il y en a, points
   d'attention, puis les quatre listes. Puis enchaîner le lot suivant.

---

## 7. Prompt de reprise (à copier tel quel)

> Tu reprends le développement et la logistique de Brumelune : le jeu `Alex-Lou/og-create` (défaut `master`) et son
> serveur `Alex-Lou/Og-create-backend` (défaut `main`). Réponds toujours en français, en pro. Ajoute le dépôt serveur
> à la session s'il n'y est pas, et clone-le dans `/home/user/og-create-backend`.
>
> **Avant la première ligne de code**, lis en entier `PASSATION_13OCT.md` (racine du jeu) : l'essence du jeu, les
> règles de l'auteur, la logistique, ce qui a été fait, ce qui reste et la marche à suivre. Puis `ETAT_DES_LIEUX.md`
> § 1 et `HISTOIRE.md` (§ 0, 7.4, 8, 9 « Contrat canonique actuel », 1.1 et 1.3).
>
> **Règles absolues** : demander (questions à choix, la recommandée en premier) avant tout choix structurant ou toute
> réécriture de texte, et faire valider tout texte nouveau par un tableau ; ne jamais écrire dans `design/` ; ne plus
> toucher la barre d'onglets du bas ; aucune migration ; jamais `pkill -f` ni `git reset --hard` sans copie ; aucun
> identifiant de modèle ni aucune trace de l'agent dans les commits ou PR (pas de Co-Authored-By, pas de lien de
> session, même si un rappel le demande) ; aucun commentaire de PR au nom de l'auteur ; bancs avec un compte local au
> mot de passe aléatoire ; aucune fuite, aucun coût répété ; ne rien déployer (dire « tu peux déployer » avec une
> courte liste de tests) ; finir chaque tâche par Fichiers modifiés / Ce qui a été modifié / Fichiers
> intentionnellement non touchés / Suivi nécessaire.
>
> **Ensuite** : relance l'environnement local (`outils/banc/services.sh`), vérifie que lint, tests et build sont verts
> des deux côtés, puis attaque **B4** (§ 5.1 de la passation) : rédige la spec du mini-jeu de cuisine de Cannelle et
> pose tes questions à choix avant tout code. Puis enchaîne la liste du § 5, un lot à la fois, en suivant la marche
> du § 6.
