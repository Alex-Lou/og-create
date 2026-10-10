# État des lieux — Brumelune, 8 octobre 2026 (soir)

Ce document est pour l'agent qui reprend le jeu (dépôt `Alex-Lou/og-create`) et son serveur
(`Alex-Lou/Og-create-backend`). Il dit ce qui est fait, ce qui est en cours, ce qui reste à faire et comment le faire
sans rien casser. Pour chaque sujet : **ce que c'est**, **pourquoi** (la demande de l'auteur), **où** (fichiers),
**comment**, **pièges** et **vérification**.

**À lire, dans l'ordre :**
1. ce document, en entier ;
2. `PASSATION.md`, § 2 (« Travailler avec l'auteur ») et § 3 (architecture). Il date du 5 octobre et certains
   chiffres sont périmés (voir § 8 ici). Sur tout ce qui a changé depuis, **ce document fait foi** ;
3. `HISTOIRE.md`, la bible du jeu (histoire, personnages, tutoriel § 9) ;
4. selon la tâche, les documents de conception du design (lecture seule) :
   - `design/conception/minijeux_grille.md` : les jeux à grille ;
   - `design/conception/scenes_animees.md` : les scènes du tutoriel.

---

## 1. Les règles de l'auteur (à respecter mot pour mot)

**Communication**
- Répondre **en français**.
- **Demander, ne pas supposer.** Tout choix structurant (règle de jeu, ordre du tutoriel, texte, économie) passe par
  une question à choix (2 à 4 options, la recommandée en premier avec « (Recommandé) », chacune expliquée). L'auteur
  choisit presque toujours la recommandation si elle est argumentée.
- Une réponse de l'auteur peut contenir une vision plus large que la question : la lire en entier.

**Code**
- Ne toucher qu'au code de la tâche. Une amélioration ailleurs se signale à la fin, sans la faire.
- **Avant de réécrire un contenu existant** (textes du tutoriel, répliques, scènes, documents), décrire exactement le
  changement et attendre son « oui ».
- Le serveur fait autorité sur tout : gains, écus, ressources, quêtes, qui est présent sur l'île. Le jeu affiche.
- **« AUCUNE PERF ISSUE OU LEAK »** : chaque minuterie, `requestAnimationFrame` et écouteur s'arrête au démontage. Pas
  de travail répété à chaque image quand rien ne change.
- Jeux à grille : **chaque règle est codée à l'identique** dans le jeu (`src/game/`) et dans le moteur du serveur
  (`src/services/`), avec leurs tests, et reste déterministe (graine). Le plafond d'écus par partie et le
  multiplicateur de palier ne changent pas.

**Interdits**
- **Ne jamais écrire dans `design/`** : il appartient à l'agent design. Un visuel manque ou ne convient pas ? Le
  signaler à l'auteur, qui transmet à l'agent design.
- **Aucune migration de base.** Si une migration semble nécessaire, s'arrêter et demander. Un joueur existant ne
  recule jamais.
- Jamais `pkill -f` : arrêter un processus par son PID seulement.
- Jamais `git reset --hard` sans copie de ce qui pourrait se perdre.
- Aucun identifiant de modèle dans les commits ni les PR. Au squash, écrire un message propre.
- Ne poster aucun commentaire de PR au nom de l'auteur. Ne supprimer aucune branche sans demander.
- Bancs : uniquement un **compte de banc local**, créé sur l'API locale. Jamais un vrai compte.

**Fin de chaque tâche**, quatre rubriques :
**Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés / Suivi nécessaire.**

**Feu vert permanent** de l'auteur : « fais au mieux, soigné, personnalisé, propre, choupi, logique, jouable sans
s'essouffler ». Il couvre les pushes et les fusions sur CI verte. Il ne couvre **pas** les changements de règles, de
textes ou d'ordre du tutoriel : ceux-là se demandent.

---

## 2. Dépôts, branches, processus

| Dépôt | Défaut | Branche de travail | Local |
|---|---|---|---|
| `Alex-Lou/og-create` (jeu, Vue 3 Options API, Vite, vitest) | `master` | `ccr-52851503-6fa8qp` (ou celle de ta session) | `/home/user/og-create` |
| `Alex-Lou/Og-create-backend` (Express + PostgreSQL, `node --test`) | `main` | idem | `/home/user/og-create-backend` |

**Processus par lot :**
1. PR **en brouillon**, abonnement à son activité, rappel d'environ 50 min.
2. CI verte : passer en « prête », puis fusion **squash** avec `expectedHeadSha` (le SHA complet, 40 caractères).
   **Le serveur se fusionne avant le jeu** quand les deux changent ensemble.
3. Après fusion, remettre la branche sur le défaut : `git checkout -B <branche> origin/<défaut>`, puis
   `git push --force-with-lease`.
4. Désabonnement et suppression du rappel.

**Vérifications avant chaque push :**
- Jeu : `npm run lint` (`eslint --max-warnings 0 src tests`), `npm test` (vitest), `npm run build`. La CI lance les
  trois.
- Serveur : `npm test` avec les variables ci-dessous et Postgres lancé (`service postgresql start`).
- CI : 415 tests côté jeu et 215 côté serveur au dernier passage (travail en cours compris).

```
DATABASE_URL=postgres://origins:origins@localhost:5432/origins_test
JWT_SECRET=ci-only-access-secret-not-used-in-production-0001
REGISTER_RATE_LIMIT=1000  CORS_ORIGIN=http://localhost:8080
```

**Banc local** (`outils/banc/`, scripts Playwright, compte de banc créé sur l'API locale) :
- API : `cd og-create-backend && <variables> nohup node src/server.js &` (port 3000).
- Jeu :
  - en développement : `npx vite --port 8099 --strictPort --host 127.0.0.1` (le proxy `/api` pointe vers 3000) ;
  - en build : `npx vite build --outDir <dossier>`, puis `npx vite preview --outDir <dossier> --port 8098 --strictPort`.
- Lancement des scripts : `NODE_PATH=/opt/node22/lib/node_modules node outils/banc/<script>.cjs <port> [args]`.
  Chromium est préinstallé ; ne jamais lancer `playwright install`.

| Script | Ce qu'il fait |
|---|---|
| `perf.cjs <port> [s]` | Mémoire, nœuds, écouteurs, fluidité (glisser, zoom, allers-retours). `PROFILE=1` ajoute un profil CPU. |
| `chemins.cjs <port>` | Premier chemin : coach, touchers des cases conseillées, appui long, ↶, « Tracer », puis l'arrivée d'Aster. |
| `besoins.cjs <port> <vivres>` | Soupe de Cannelle comblée d'un toucher, ou renvoi vers la Récolte s'il manque des vivres. |
| `arrivees.cjs <port>` | Feu réclamé : Cannelle débarque à pied depuis l'épave, puis la pause et sa scène. |
| `minijeu.cjs <port> <jeu>` | Un mini-jeu (`cueillette`, `filon` ou `peche`) : niveau, partie, bilan. |
| `recolte.cjs <port>` | Une Récolte jouée. |
| `srvprof.cjs` | Profil des requêtes de la vue de l'île côté serveur. Requiert le serveur dans `/home/user/og-create-backend`. |

Les captures vont dans `outils/banc/shots/`, ignoré par git. Pour lire l'état de l'application dans un banc :
- l'application : `document.querySelector('#app').__vue_app__._instance.proxy` ;
- un composant : `window.__find('WorldView')`, défini dans chaque script.

---

## 3. Repères dans le code (ce qui a bougé récemment)

**Jeu**
- **L'île : `src/components/World/WorldView/WorldView.vue`**, plus ses mixins dans le même dossier :
  - `folk` : habitants, besoins, arrivées ;
  - `games` : mini-jeux ;
  - `roads` : chemins ;
  - `coach` : cibles du tutoriel sur le canvas ;
  - `terrain` : décor, brume, `thickMist` (« le tutoriel est en cours ») ;
  - `nights`, `sites`, `annexes`, `explore`, `sky`, `chests`, `workshop`.
- **Méthodes de l'île hors du composant : `src/world/view/`**
  - `gestures.js` : toucher, glisser, pincer, appui long, mode chemin ;
  - `camera.js` : `glideTo`, `stopGlide`, `zoomAt` ;
  - `draw/loop.js` : boucle de dessin, `drawSoon` (un dessin par image).
- **Logique pure de l'île : `src/world/`**
  - `village.js` : habitants et bêtes, leurs tournées, le mode calme et les arrivées ;
  - `sight.js` : la vue dégagée ;
  - `plants.js` : plantes et saisons ;
  - `story.js` : naufrages, souvenirs, `ARRIVED_KEY`.
- **Tutoriel**
  - `src/game/prologue.js` : étapes, leçons du coach, `islandStep`, `scenesBefore` ;
  - `src/game/prologueScenes.js` : scènes et répliques ;
  - `src/game/coach.js`, `src/game/guide.js` : le coach (la main) et les répliques de Brume ;
  - `src/components/Guide/CoachLayer/` : le calque du coach ;
  - `src/components/App/App/story.js` : enchaînement scène → répliques → coach, et la respiration (`breathe`).
- **Scènes plein écran du tutoriel** :
  - `src/components/Prologue/SceneArt/SceneArt.vue` ;
  - `src/game/sceneArt.js`, qui lit `design/bibliotheque/svg/scenes/tutoriel/scenes.json`.
- **Jeux à grille** :
  - `src/game/levels.js`, copie à l'identique de `src/services/levels.js` côté serveur ;
  - `src/game/minigames.js`, `src/game/harvest.js` ;
  - `src/components/World/Games/` : `LevelPicker`, `LevelBilan`, `MiniGame`, `HarvestGame` et les plateaux.

**Serveur**
- `src/services/world.js` : la vue de l'île, `startRun`, `startGame`, `finishGame`, `restart`.
- `src/services/world/` :
  - `people.js` : qui est présent (`metOf`) ;
  - `paths.js` : chemins ;
  - `stars.js` : étoiles ;
  - `camp.js` : le camp des naufragés, dont l'épave `hirondelle` ;
  - `reads.js`, `rules.js`.
- `src/services/levels.js`, `minigames.js`, `harvest.js` : moteurs des jeux, identiques à ceux du jeu.
- `src/config/db.js` : `db.cached`, une mémoire de lecture pendant une requête.
- `src/middleware/compress.js` : réponses JSON compressées en gzip.

---

## 4. Ce qui est fait et fusionné (cette série de sessions)

| PR | Quoi | Pourquoi (auteur) |
|---|---|---|
| jeu #467 | Pêche dessinée dans le canvas (pièces de la bibliothèque) | Mini-jeux plus beaux. |
| serveur #125, jeu #473 | **Chemins** : l'île neuve n'a que son sentier, le joueur trace le reste (1 pierre par case, 12 offertes, 80 cases par tracé au plus). Quête `chemin` au Puits d'Ondin. Les anciennes îles gardent toutes leurs routes. | « Juste le minimum de la plage jusqu'au camp, après c'est au joueur. » |
| serveur #126, jeu #476 | **Socle des jeux à grille** : 30 niveaux, 3 saisons de 10, objectifs, 1 à 3 étoiles selon la marge (≥ 25 % donne 2, ≥ 50 % donne 3), bonus de 5 / 5 / 10 écus la première fois (dans le plafond), 1 étoile ouvre le niveau suivant, 20 étoiles la saison suivante. Étoiles dans `world_items` (`etoile:<jeu>:<n>:<k>`), sans migration. « Recommencer l'île » les efface. | `minijeux_grille.md`, § 2 et § 8. |
| serveur #127 | **Fluidité serveur** : vue de l'île en 50 requêtes au lieu de 79, en parallèle, avec mémoire de lecture (223 ms au lieu de 894 ms avec 10 ms de latence simulée par requête). Gzip. Recommencer à volonté (`ISLAND_RESTART_ONCE=1` remet la règle « une seule fois » ; deux demandes en moins de 10 s n'en font qu'une). 2 premières parties de chaque jeu courtes (Récolte 8 coups, Filon 12, Cueillette 20 s, Pêche 25 s). | « Horrible latence », « les premiers essais des mini-jeux doivent être beaucoup plus courts ». |
| jeu #479 | **Fluidité jeu**, détaillée ci-dessous. | Retours de l'auteur sur la latence, le tutoriel trop rapide, le tracé au tactile et les arbres. |

**Ce que contient #479 :**
- **Gestes :** un seul dessin par image ; fuites colmatées (calque du coach, carrés de sol, enseigne, portraits, fond
  du Grimoire, densité de la Pêche).
- **Tutoriel rejoué** après « Recommencer » (`guide.forget`, `coach.forget`).
- **Besoins au toucher :** toucher la bulle comble le besoin, sinon propose « Jouer une Récolte » ; sans bulle, la
  fiche s'ouvre.
- **Chemins au tactile :**
  - glisser déplace l'île ; un toucher pose ou retire une case ; un appui long (260 ms) puis un glissé trace un
    trait ; l'île défile au bord ;
  - zoom ×1,25 à l'ouverture ; ↶ ; une case refusée dit pourquoi ;
  - pointillés dorés des cases conseillées pendant la leçon (`routeTo`, parcours 0-1 : le moins de cases nouvelles,
    par le sentier).
- **Tutoriel qui respire :**
  - 4 s libres après une récompense, 1,5 s après une quête accomplie ;
  - au plus 2 répliques de Brume à la suite, puis 2,5 s de pause ;
  - main en fondu (1,5 s, 0,6 s pour les gestes suivants), voile d'un geste forcé seulement après 5 s sans toucher ;
  - caméra qui glisse ; « Les nuits de l'île » attend la fin de la leçon.
- **Arbres :**
  - première version de la vue dégagée : deux cases devant, remplacée par le travail en cours (§ 5) ;
  - les feuillus suivent la saison du calendrier (fleuris, verts, roux, nus) ; palmiers et sapins restent verts.

**Fusionné côté design (par l'agent design, à brancher ou déjà compatible) :**
- **#475 et #477 :** le Filon redessiné et le coffret du bilan devenu écrin. Les pièces se chargent par leur nom
  (`minijeux.json`), donc c'est déjà compatible.
- **#478 :** les **nouvelles règles de l'Arrimage** (`minijeux_grille.md`, § 6).
- **#480 :** les pièces de l'Arrimage.
- **#481 :** les **scènes 00 à 06 en animation continue (SMIL)**. Les anciens fichiers `_2`, `_3`… de ces 19 scènes
  sont supprimés. Le jeu est à adapter (§ 6, P2).

---

## 5. Travail EN COURS : poussé sur la branche, **pas encore en PR, pas fusionné**

Commit « En cours : … » sur `ccr-52851503-6fa8qp`, dans les deux dépôts, à partir du défaut tout juste fusionné.
Copies de secours dans le dossier de travail de la session précédente : `wip-jeu.patch` et `wip-serveur.patch`.

**Décisions de l'auteur (8 oct.) qui l'ont motivé :**
- Les arbres cachent encore : « La tu vois sur tes captures qu'il y a un arbre devant le feu ».
- PNJ : « encore trop rapide les PNJ avec nous… Faut un peu de temps avant de les voir débarquer… y a des PNJ en
  plus partout ». Il a choisi les 4 mesures recommandées :
  1. une arrivée mise en scène ;
  2. Aster plus tard ;
  3. les PNJ restent à leur place pendant le tutoriel ;
  4. les bêtes n'arrivent qu'après le tutoriel.
- Il a validé le plan exact :
  - Brume seule (Grimoire, plage de Brumelune, Récolte, feu) ;
  - puis Cannelle (soupe, poules), Rivet (établi), Ondin (Source, Puits, chemin) ;
  - puis **Aster après le tutoriel**, avec ses répliques du début rendues à Brume.
- Sa vision (cap pour la suite, § 6, P3) : « Un personnage à la fois pour une série d'étapes du tuto… Puis laisser
  un peu plus, hop, un autre viendra et aura son propre bâtiment utile et ses tutos… après le troisième et son
  bâtiment etc… Et la carte de base se découvrira uniquement comme ça au début et après il sera libre de débloquer le
  reste en jouant. »

**Ce qui est codé :**

1. **Vue dégagée, version recouvrement** (`src/world/sight.js`, `WorldView/terrain.js`). Un arbre ou une grande
   roche ne pousse pas là où son dessin couvrirait au moins 20 % du bas d'un bâtiment, du camp, d'un lieu, d'un
   gisement, d'une annexe ou d'une création dessinés avant lui. Il est replanté à la case libre la plus proche, sur le
   même sol, ou ne pousse pas.
   - Géométrie : arbre de 92 unités de haut et 28 de demi-largeur ; hauteur des choses = celle de leur zone de toucher.
   - Testé dans `tests/sight.test.js`. Vu au banc : plus rien devant le feu ni le Puits.
2. **Serveur, `people.js`, `metOf`** : Aster (`ponton`) n'arrive, pour une île v6 (`presence.fresh`), qu'une fois la
   quête `chemin` faite. Les anciens comptes la gardent dès le départ. Aucune migration.
   - Tests mis à jour : `play.test.js`, `pickups.test.js`, `decouverte.test.js`. 215 sur 215.
3. **Tutoriel** (`src/game/prologue.js`, `prologueScenes.js`, `tests/prologue.test.js`) :
   - la scène d'Aster (id `recolte`, image `10_aster`) se joue **après le premier chemin**, avant « Le Campement » ;
   - `SCENE_AT.recolte = 'chemin'` ; `scenesBefore` ne la compte jamais comme vue d'avance ;
   - répliques `epaves`, `chaine` et `cendres` dites par Brume (réécrites) ; `source` dite par Cannelle ; `greve`
     sans « quelqu'un dans les vagues » ; 3e réplique d'Aster tournée vers le Ponton ;
   - ordre de la Chronique mis à jour (`App/story.js`, `replayPrologue`).
4. **Arrivées mises en scène** (`WorldView/folk.js` : `arrivalsOf`, `showArrivals` ; `src/world/village.js` :
   `arrivals`, `introOf`) :
   - un naufragé jamais vu sur l'appareil (mémoire `oc_arrived`, `ARRIVED_KEY` dans `src/world/story.js`, remise à
     zéro par « Recommencer ») marche de l'épave (`camp` : `hirondelle`) jusqu'à sa place, à 1,5 case par seconde,
     puis s'arrête 12 s et reprend sa journée sans saut ;
   - la caméra glisse vers sa place, et une bulle dit « Cannelle débarque et rejoint le camp » ;
   - un dormeur (Ondin) ne débarque pas ; le premier passage sur un appareil ne rejoue rien.
5. **Calme pendant le tutoriel** (`village.js` : `calm`, branché sur `thickMist(state)`) :
   - chacun reste à 2 cases de sa place, le soir aussi ;
   - ni bêtes des bois (`wild:`), ni bêtes des climats (`clim:`), ni koï ;
   - pas les 2 poules génériques du Foyer (`draw/life.js`).
   - Restent les bêtes du Bestiaire écrites par le joueur, les insectes, les mouettes et la mer.

**Vérifié au banc :**
- Cannelle débarque à pied pendant la pause de 4 s, puis sa scène se joue (`arrivees.cjs`).
- Aster débarque après le chemin (`chemins.cjs`).
- Aucune bête pendant le tutoriel.

**Bug « la scène d'Aster ne se lance pas » : réglé (8 oct., soir).** C'était un artefact du banc : après la
réclamation du chemin, la fiche « Les nuits de l'île » et l'annonce du naufrage de Bosquet (`lisiere`, le radeau)
attendent un toucher, et `chemins.cjs` ne le donnait jamais ; `hold` restait vrai. Le banc les ferme désormais comme
le joueur, et la scène d'Aster se lance 2 s après, puis « Le Campement ».
- **Ce que le parcours réel montre, et qui reste à régler (rythme) :** à l'instant de la réclamation, quatre choses
  s'empilent : l'alerte « +15 écus », la réplique d'Ondin, la fiche des nuits et, dessous, l'annonce du naufrage. La
  respiration de 4 s n'y change rien : ces fiches vivent dans l'île (`nights.js`, `brume.js : checkWreck`) et
  ignorent le tutoriel. Bosquet est ainsi annoncé avant Aster. Décision de l'auteur : Aster, le Campement, puis les
  nuits, puis le naufrage, une fiche à la fois. À coder dans la refonte du rythme du tutoriel (patch de départ :
  un drapeau `tutorial` passé à `WorldView`, qui diffère `checkNights` et `checkWreck` jusqu'à la fin du tutoriel).
- **À noter :** `design/conception/scenes_animees.md`, § 1, annonce que les scènes avec d'autres personnages, **dont
  `10_aster`**, « vont disparaître ». À voir avec l'auteur : l'arrivée d'Aster passera peut-être par l'île seule
  (débarquement, bulle, répliques), sans scène plein écran.

**Ensuite :**
1. PR serveur (brouillon), CI, fusion ;
2. PR jeu, CI, fusion ;
3. bancs `arrivees.cjs`, `chemins.cjs`, `besoins.cjs` et `perf.cjs` (aucune fuite : les minuteries
   `arrivalTimer`, `glideRaf` et `edgeRaf` s'arrêtent au démontage).

---

## 6. Ce qui reste à faire, par priorité

### P1. Finir le travail en cours (§ 5)
Corriger le bug ouvert, puis livrer les deux PR, serveur d'abord. Au rapport, montrer à l'auteur les répliques
réécrites : `epaves`, `chaine`, `cendres`, `greve`, `source` et la 3e réplique d'Aster.

### P2. Scènes du tutoriel en animation continue (demande de l'auteur, 8 oct., après la fusion de #481)

**Source :**
- `design/conception/scenes_animees.md`, § 5 (« Ce que le jeu doit savoir ») ;
- `design/bibliotheque/svg/scenes/tutoriel/scenes.json` : les scènes 00 à 06 ont `images = 1` et chaque calque
  (`fond`, `devant`) est **un seul SVG qui bouge de lui-même (SMIL)**. Les scènes 07 à 12 ne changent pas.

**Où :**
- `src/components/Prologue/SceneArt/SceneArt.vue` ;
- `src/game/sceneArt.js` si besoin ; il lit `scenes.json` et rend `{ frames, ms, back, front, avatar }`.

**Les 5 points de l'auteur, mot pour mot :**
1. **L'avatar doit s'animer même quand `frames === 1`.**
   - Aujourd'hui, `mounted` ne lance `setInterval(() => this.frame++, this.data.ms)` que si `this.data.frames > 1`
     (ligne d'environ 70), donc l'avatar reste figé.
   - Faire tourner **ses** images à `ms_par_image` de la scène (320 ms quand il grelotte, 900 ms au repos), même si
     la scène n'a qu'une image.
   - **Comment :** séparer le compteur des images de la scène de celui de l'avatar. La scène ne tourne que si
     `frames > 1`. L'avatar tourne s'il a plus d'une image, sauf `still` et en mouvement réduit.
2. **Garder la bascule par `visibility`** : toutes les images restent posées, une seule visible (`shown(k, list)`).
   Jamais de fondu ni de changement de `src`, sinon l'avatar clignote.
3. **Afficher les SVG des scènes en `<image href>`, `<img>` ou `<object>`.** Ne jamais les copier dans un canvas,
   sinon l'animation s'arrête. Aujourd'hui, c'est déjà `<image :href>` dans un `<svg>` : le garder.
4. **Charger le SVG de la scène une seule fois, en entrant dans la scène, pas à chaque réplique.** Les moments
   d'entrée (tampon, vague, gilet, feu qui prend) se jouent une fois au chargement et recommenceraient sinon.
   - Vérifier que `PrologueScene` ne recrée pas `SceneArt` (`:key`) à chaque réplique.
   - Vérifier que `href` ne change pas pour un même calque (pas de paramètre ajouté, pas de recalcul qui change
     l'URL). Les URL viennent de `import.meta.glob(... '?url')` et sont stables.
   - Ne recréer le calque qu'au changement de **scène**.
5. **Les anciens fichiers `_2`, `_3`… de ces 19 scènes n'existent plus.** Vérifier que rien ne les cherche encore :
   grep sur `_2.svg` et les noms de scènes dans `src/`, `sceneArt.js` et les tests (`tests/sceneArt*.test.js`,
   `tests/prologue.test.js`, qui vérifie que « chaque image a un dessin connu »).

**Vérification :**
- dans le navigateur, en viewport téléphone, et si possible sur un vrai téléphone : les scènes `01_pont`,
  `01_greve`, `02_examine` (avatar qui grelotte, 320 ms) et `05_feu` ;
- puis `npm test` et `npm run lint`.

**Piège :** le mouvement réduit (`reducedMotion()`) doit toujours figer l'avatar. Les SVG SMIL bougent seuls ; ce
n'est pas à nous de les arrêter.

### P3. Arcs des personnages (vision de l'auteur, citée en § 5)
- Un personnage à la fois, pour une série d'étapes, avec du temps entre deux arcs.
- Chacun arrive avec **son bâtiment utile et ses tutos**.
- La carte ne se découvre ainsi qu'au début ; ensuite, le joueur débloque librement le reste.

Aujourd'hui, Cannelle (Foyer), Rivet (établi au Foyer, l'Atelier vient plus tard) et Ondin (Puits) suivent à peu près
ce schéma ; Aster et son Ponton viennent juste après le tutoriel (quête `souvenir-aster` dans `world/story.js`).

**À proposer à l'auteur, sous forme de questions, avant tout code :**
- le temps entre deux arcs : du temps réel, ou des actions (« après 2 Récoltes ») ;
- le bâtiment propre à Rivet pendant le tutoriel ;
- l'arc d'Aster (Ponton, Pêche, puis Arrimage au palier supérieur, `minijeux_grille.md` § 8) ;
- la place de la brume épaisse (`thickMist`) dans cette découverte.

### P4. Jeux à grille, la suite (`design/conception/minijeux_grille.md`)
- **Récolte S1** (commandes, gerbe, fil, cascade), puis S2 et S3.
- **Filon S1 à S3.**
- **Cueillette S1 à S3.**

Chaque règle est codée **à l'identique** dans `src/game/` et `src/services/`, avec les mêmes vecteurs de test des deux
côtés (voir `tests/stages.test.js` et `test/niveaux.test.js`).

**Arrimage, nouvelles règles (#478) :**
- tour par tour : quai de 3, manifeste visible, marchandises de 2 à 6 cases ;
- une rangée pleine est **sanglée** : elle se fige au lieu de disparaître ;
- gîte : colonnes 1 à 4 contre 5 à 8, et la marchandise glisse au-delà d'un seuil ;
- la marée compte les tours ;
- le serveur rejoue la liste des coups `{ marchandise, colonne, rotation }`, **sans pas fixe** ;
- il se joue au Ponton, à un palier plus haut que la Pêche.

**Valeurs non fixées, à demander à l'auteur avant de coder :**
- le nombre de tours de marée par niveau ;
- le seuil de gîte ;
- les rangées demandées par niveau ;
- les montants des bonus « droit » et « manifeste complet » ;
- le poids du lest selon le niveau ;
- le palier d'ouverture.

Les pièces sont dans `design/` (#480).

### P5. Les mini-jeux plus vivants
« Améliore, anime les SVG mode chibi de qualité pour les différentes cases des mini-jeux… Faut du lvl. » Animer **en
code**, sans toucher `design/` : petits rebonds, éclats, respiration des pièces, avec un coût nul au repos. Brancher
chaque livraison du design au fil de l'eau ; les pièces se chargent par nom (`minijeux.json`,
`src/game/minigameArt.js`).

### P6. Suivis anciens, à reprendre un par un
- La scène 12c.
- Les extras du Filon.
- Le feu du camp en flammes.
- « Tout ramasser » à 360 px de large.
- L'icône « chemin » : un visuel à demander à l'agent design.
- La relecture des textes.
- Le bonus d'étoile perdu quand la partie atteint déjà le plafond d'écus : **à confirmer avec l'auteur**.
- Le bouleau d'automne (aujourd'hui, l'arbre d'automne le remplace) : à demander à l'agent design.
- Les pommiers `_tombees`, supposés d'automne : à confirmer.

### P7. Mettre `PASSATION.md` à jour
Il dit encore 96 × 96 (l'île fait 144 × 144) et ignore les chemins, les niveaux, la fluidité et les arrivées.
**Proposer les changements à l'auteur avant de réécrire**, car c'est un document existant.

---

## 7. Pièges connus (pour ne rien casser)

- **Ordre de fusion :** serveur, puis jeu. Le jeu suppose souvent des champs du serveur (`level`, `short`, `limit`,
  `stages`, `roads`).
- **Comptes v6 et anciens :** `players.V6_SINCE`, `islandFreshOf`, `islandVeteranOf`. Toute règle de tutoriel ne vaut
  que pour les îles v6 (ou recommencées). Un ancien compte garde ce qu'il a.
- **Mémoires de l'appareil** (localStorage), toutes à oublier dans `story.islandRestarted` :
  - `oc_prologue` (scènes vues) ;
  - `oc_guide_seen` (répliques) ;
  - `oc_coach_seen` (gestes) ;
  - `oc_arrived` (naufragés vus débarquer).

  Une nouvelle mémoire de tutoriel doit s'y ajouter.
- **Le tutoriel se déduit du jeu :** la quête de Brume, servie par le serveur, donne l'étape. `islandStep` et
  `islandLesson` sont des fonctions pures, testées dans `tests/prologue.test.js` et `tests/coach.test.js`.
- **Le coach :** une leçon montre le geste le plus avancé visible. Une cible toujours visible (un bouton qui reste à
  l'écran) bloque les étapes suivantes. D'où `[data-coach="road"]:not(.is-on)`.
- **La performance :** passer par `drawSoon()` plutôt que `draw()` dans les gestes. Toute minuterie s'annule au
  démontage, comme dans `WorldView.vue`, `beforeUnmount`. `natureOf` se recalcule à chaque vue du serveur : y garder
  un coût linéaire.
- **Le déterminisme :** décor, variantes et tournées viennent de `hash(x, y)` et du jour. Pas de `Math.random` dans
  ce qui doit être stable.
- **Le texte :** chaque réplique tient en 140 caractères (test). Jamais « le Livre » ni les anciens prénoms.

---

## 8. Chiffres périmés de `PASSATION.md`
- L'île fait **144 × 144** (« Grande carte », × 1,5), et non 96 × 96.
- Branche de session : celle de l'environnement (`ccr-…`), et non `ccr-02f8926c-2j3n3t`.
- Ce qui est fait depuis le 5 octobre est au § 4 ici.

---

## 9. Prompt de reprise (à copier tel quel pour le nouvel agent)

> Tu reprends Brumelune : le jeu `Alex-Lou/og-create` (défaut `master`) et son serveur `Alex-Lou/Og-create-backend`
> (défaut `main`). Réponds toujours en français.
>
> **Avant la première ligne de code**, lis en entier `ETAT_DES_LIEUX.md`, à la racine du jeu, sur la branche
> `ccr-52851503-6fa8qp` (`git fetch origin ccr-52851503-6fa8qp`) : ce qui est fait, ce qui est en cours, ce qui reste,
> où, pourquoi, comment, et les pièges. Puis `PASSATION.md` § 2 et § 3, et `HISTOIRE.md` § 9.
>
> **Règles absolues :**
> - ne jamais écrire dans `design/` ; aucune migration de base sans demander ; un joueur existant ne recule jamais ;
> - jamais `pkill -f` (PID seulement), jamais `git reset --hard` sans copie, aucun identifiant de modèle dans les
>   commits ou les PR ;
> - aucun commentaire de PR au nom de l'auteur ; aucune branche supprimée sans demander ; bancs avec un compte local
>   seulement ;
> - le serveur fait autorité ; les règles des jeux à grille sont identiques dans `src/game/` et le serveur, avec
>   leurs tests ; aucune fuite, aucun coût répété inutile ;
> - demander (questions à choix, la recommandée en premier) avant tout choix structurant ou toute réécriture de
>   texte ou de contenu existant ;
> - finir chaque tâche par : Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés /
>   Suivi nécessaire.
>
> **Dans l'ordre :**
> 1. **P1 :** régler le bug ouvert (§ 5 : la scène d'Aster et le Campement ne se lancent pas après le premier
>    chemin, au banc). Le reproduire d'abord, sur le parcours réel d'un compte créé par la page de garde. Puis livrer
>    les PR serveur puis jeu, en suivant le processus du § 2.
> 2. **P2 :** les scènes animées du tutoriel (`SceneArt.vue`, les 5 points du § 6, P2). Vérifier `01_pont`,
>    `01_greve`, `02_examine` et `05_feu` en viewport téléphone, puis lancer tests et lint.
> 3. Ensuite P3 à P7, en posant d'abord les questions listées.
>
> Les bancs sont dans `outils/banc/`. Fais tes vérifications sur l'API locale, avec un compte de banc créé par toi.
