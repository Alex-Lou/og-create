# Passation — agent logistique, Brumelune (10 octobre 2026)

Ce document est pour l'agent qui reprend la **logistique** du jeu (dépôt `Alex-Lou/og-create`, défaut `master`) et de son
serveur (`Alex-Lou/Og-create-backend`, défaut `main`) : il travaille comme l'agent précédent, étape par étape, avec
l'auteur. Il dit ce qui est fait, ce qui est en cours, ce qui a été poussé sans lui depuis, ce qui reste, et comment.

**À lire, dans l'ordre :**
1. ce document, en entier ;
2. `ETAT_DES_LIEUX.md` (racine du jeu, sur `master`) : règles de l'auteur, repères dans le code, bancs, pièges.
   Son § 5 (« travail en cours ») est **terminé et fusionné** ; son § 6 (priorités P2 à P7) reste valable, derrière
   ce qui est écrit ici ;
3. `HISTOIRE.md` § 9 (le tutoriel, la bible) ;
4. côté serveur : `docs/architecture/*.md` (écrits le 9 octobre par l'autre outil, à vérifier contre le code).

---

## 1. Les règles de l'auteur (inchangées, à respecter mot pour mot)

Elles sont dans `ETAT_DES_LIEUX.md`, § 1. Les plus importantes :
- répondre **en français** ; **demander, ne pas supposer** : tout choix structurant passe par une question à choix
  (2 à 4 options, la recommandée en premier avec « (Recommandé) », chacune expliquée) ;
- **avant de réécrire un texte existant** (répliques, quêtes, documents), le proposer et attendre son « oui » ;
- ne toucher qu'au code de la tâche ; **jamais `design/`** ; **aucune migration de base** ; jamais `pkill -f` ;
  jamais `git reset --hard` sans copie ; aucun identifiant de modèle dans les commits ou les PR ; aucun commentaire de
  PR au nom de l'auteur ; aucune branche supprimée sans demander ; bancs avec un **compte local** seulement ;
- le serveur fait autorité ; les règles des jeux à grille sont identiques dans `src/game/` et le serveur ;
  **aucune fuite, aucun coût répété inutile** (minuteries et écouteurs arrêtés au démontage) ;
- fin de chaque tâche : **Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés /
  Suivi nécessaire** ;
- « feu vert permanent » : pushes et fusions sur CI verte. Pas les changements de règles, de textes ou d'ordre du
  tutoriel.

**Comment l'auteur parle** : court, parfois en colère, souvent depuis un téléphone. Lire chaque réponse en entier :
une réponse à une question contient souvent une vision plus large (voir § 4). « Enchaine » veut dire continue.

---

## 2. La méthode décidée avec l'auteur (8 octobre)

1. **Une étape du tutoriel à la fois.** Pour chaque étape : mesurer l'existant au banc (chronologie seconde par
   seconde, nombre de touchers, captures en 390 × 844), diagnostiquer selon six critères (**rythme, contenu, qualité,
   jouabilité, ergonomie, clarté**), proposer des choix multiples complets, coder, puis rendre à l'auteur **les
   captures, la chronologie et chaque réplique**. Il valide ou annote. Sans son oui, on retravaille.
2. **Rien ne se déploie entre deux étapes** : le site `brumelune.eu` (VPS OVH, `deploy/ovh/deploy.sh`, lancé en SSH
   par l'auteur) n'est pas à l'agent.
3. **Ordre des étapes** : l'ouverture (fait, § 3) → l'île : Grève, Récolte, feu (fait en partie, § 3) → la première
   nuit seul avec Brume, le pré libre, Cannelle → les trois premières pages du Grimoire → puis chaque arc suivant.
4. **Une PR par lot validé**, brouillon, abonnement, rappel ; fusion squash sur CI verte ; serveur avant jeu quand les
   deux changent. Branche de session : celle de l'environnement (`ccr-…`), reposée sur le défaut après chaque fusion.

---

## 3. Ce qui est fait par l'agent précédent (8 octobre)

| Où | Quoi | État |
|---|---|---|
| serveur #128 | Aster (`ponton`) n'arrive, pour une île v6, qu'une fois la quête `chemin` faite | **fusionné** |
| jeu #483 | arrivées des PNJ à pied depuis l'épave, île calme pendant le tutoriel (ni bêtes des bois, ni koï, ni poules), vue dégagée par recouvrement, scène d'Aster après le chemin, bancs `outils/banc/`, `ETAT_DES_LIEUX.md` | **fusionné** |
| jeu #484 (brouillon, branche `ccr-ecae641e-al7lkx`, 2 commits, CI verte) | voir ci-dessous | **non fusionné, en retard sur `master`** |

**Commit 1 de #484 — « Tutoriel, étape 1 : l'ouverture »** (validée sur captures par l'auteur, sauf deux détails :
masquer le bouton « Encre » en mode nu, fait ; recentrer l'Athanor, non décidé) :
- scènes `src/game/prologueScenes.js` : naufrage en 5 images, arrivée en 7, Brume en 5 bulles (au lieu de 15) ;
  13 touchers et 42 s avant le premier geste de jeu (au lieu de 26 et 93 s) ;
- « Passer » (`PrologueScene.vue`, prop `skipDelay`) invisible les 20 premières secondes, puis un mot discret ;
- **Grimoire nu** (`bareGrimoire` dans `src/game/prologue.js`, testé) : des trois premières pages, ni en-tête, ni
  onglets, ni sommaire, ni filtres, ni Encre ; le livre s'ouvre sur la page de Vent ; l'étagère ne montre que l'Air.

**Commit 2 de #484 — « Tutoriel, l'île »** (captures envoyées, pas encore validées) :
- `islandShow` (`src/game/prologue.js`, testé) : l'interface de l'île masquée, chaque commande arrivant avec la leçon
  qui la montre (horloge d'abord ; bourse au premier écu ; réserves au premier ramassage ; Récolte avec sa leçon ;
  tracé avec `chemin` ; coffres, zoom, plein écran, carte, « Tout ramasser », onglets fermés après le tutoriel).
  Props `show` sur `IslandHud` et `IslandButtons`, prop `tutorial` sur `WorldView`, classe `oc-app--tuto` ;
- aucune mouette pendant le tutoriel (`draw/life.js`, gardé par `thickMist()`) ;
- Brume animée (`src/world/brume.js` : `moodOf`, `motionOf`, `glideStep`, testés ; `src/world/brumeArt.js` :
  `composeExpression`, les calques d'expression de la bibliothèque posés à la place des yeux du corps, testé ;
  `src/world/view/draw/brume.js`) : elle sautille avec des étincelles quand la récompense attend, bondit de joie
  (rire) quand on la touche, sursaute à une quête nouvelle puis **glisse** vers sa place, frémit gênée s'il manque de
  quoi payer, somnole la nuit, sourit par moments ;
- la récompense : plus d'alerte « INFO » ; « +N » monte au-dessus d'elle ; écus en vol lent (900 ms) vers la bourse,
  qui gonfle (`.world__purse.is-bump`) ; cible du coach ronde sur l'île (`round` dans `coachRect`, `CoachLayer`).

Ces deux commits sont une **référence de ce que l'auteur veut**. Ils ne s'appliquent plus tels quels (voir § 5).

---

## 4. Les décisions de l'auteur (8 octobre), toutes à garder

- **Rythme** : un jeu mobile « AAA » : 45 s et 12 touchers au plus avant le premier geste ; jamais plus de 3 ou 4
  bulles de suite ; une seule fiche à la fois, jamais deux déclencheurs dans la même seconde.
- **Interface masquée** : pendant le tutoriel, **seuls les boutons que le tutoriel a enseignés** existent. Masqués,
  pas grisés. Ils apparaissent le jour où ils servent, avec la main du coach.
- **Un personnage à la fois**, et des **prés libres** entre deux arcs : des actions comptées par le serveur
  (ex. « 2 Récoltes de plus »), pas du temps réel. Brume dit l'attente en une ligne. « Le joueur doit être un mouton
  dans un pré qu'on gère, sans qu'il le voie. »
- **Seul avec Brume d'abord** : la Grève, la Récolte, son propre feu de camp, **le temps de la première nuit**
  (une nuit jouée tout de suite, en 2 minutes, avec l'horloge accélérée de l'île ; les vraies nuits restent après
  le tutoriel). Puis un pré libre (trois Récoltes au total), **puis Cannelle, bien plus tard**, qui débarque à pied,
  s'arrête devant le feu, et seulement alors sa scène.
- **Brume** : « une vraie animation mignonne et variée selon la situation et le contexte ».
- **Île déserte et mystérieuse** pendant le tutoriel : aucune bête, pas même les mouettes.
- **Avatar** : l'atelier complet reste (5 onglets), tel quel.
- **Grimoire à l'arrivée** : le livre seul et l'Air ; chaque élément de l'écran arrive quand il sert.
- **Textes** : « logique, pas bébé, jouable, fun » ; les personnages ne lisent jamais l'interface.
- La quête « Termine une Récolte » dit encore « Aster t'attend au rivage » (serveur, `src/services/quests.js`) : à
  réécrire (proposition faite, § 6).

---

## 5. Ce qui a été poussé sans l'agent (9 et 10 octobre, outil OpenCode, auteur « CybWu »)

**45 commits sur `master`** et **28 sur `main`**, directement, sans PR. Messages en anglais technique
(`feat(...)`, `fix(...)`). L'auteur dit : « je pense avoir foiré… répare ce que j'ai fait ». Le code **linte, teste
(444 côté jeu) et compile** ; la casse est donc fonctionnelle ou de rythme, pas syntaxique. **Rien n'a été vérifié au
banc** par l'agent précédent : c'est la première chose à faire.

Ce que les messages annoncent (à vérifier dans le code, pas à croire) :
- **tutoriel** : « l'île d'abord ; le Grimoire s'ouvre à la première quête de Brume » ; « la plage seule avec Brume,
  l'île qui s'ouvre avec chaque personnage, déplacer ses bâtiments » ; « la première nuit se passe seul, avec un
  fondu au noir avant Aster » (serveur : « une première nuit seul, avant l'arrivée d'Aster ») ; « tout recommencer
  depuis le naufrage, les étapes au suivi, une fête lisible » ; « les bêtes des bois arrivent acte par acte » ;
  « au premier tutoriel, seule la plage du débarquement se voit » ; « la Source ne révèle plus Ondin » ;
- **interface** : « disposition de jeu mobile, suivi des quêtes en médaillon » ; « un suivi des quêtes toujours
  visible, pliable » ; « Tout ramasser sur la ligne des écus » ; un seul écran de chargement ; splash avec bouton
  « Entrée » et fondu au noir ;
- **carte** : grille « ?grid » numérotée, falaises en dégradé, pont chibi, mur de marches ; serveur : « La Source
  devient le Puits ; bâtiments et camp déplacés », « maisons des PNJ regroupées en campement autour du Feu »,
  « bâtiments déplaçables, Feu sur la plage, rien avant son personnage » ;
- **avatar** : genre à la création, barbe, moustache, accessoires masculins (serveur : accepte genre, barbe,
  moustache) ;
- **textes** : « écrire » devient « fabriquer / faire naître » partout ;
- **serveur** : erreurs du jeu envoyées au journal de l'API ; corrections auth (JWT, sessions, e-mails), Épreuve,
  boutique, 429 ; « Recommencer l'île » efface tout sauf le compte ; `brume.steps` ; docs `docs/architecture/`.

**Conflits probables avec #484 et avec les décisions du § 4** : la première nuit « avant Aster » (l'auteur veut
Aster à la fin, et Cannelle bien plus tard) ; le suivi des quêtes « toujours visible » (l'auteur veut l'interface
masquée) ; « l'île d'abord » (l'ouverture validée commence par le Grimoire après la Grève) ; les bêtes « acte par
acte » (l'auteur veut une île déserte tout le tutoriel) ; la grille visible en permanence.

**Le site `brumelune.eu` a été redéployé** entre-temps (empreinte du build changée). Ce que voit l'auteur sur son
téléphone, c'est `master` tel quel.

---

## 6. Ce qui reste à faire, dans l'ordre

### 6.1 Réparer (priorité absolue)
1. Lancer l'API locale sur `main` et le jeu sur `master` (procédure § 7), puis **rejouer le parcours complet d'un
   appareil neuf** : splash, ouverture, carte d'embarquement, Grimoire, île, Grève, Récolte, feu, nuit. Noter
   chaque blocage, chaque empilement de fiches, chaque bouton visible qui n'a pas été enseigné, le temps et les
   touchers. Bancs : `outils/banc/` (sur `master`) et, dans le scratchpad de la session précédente, `ouverture.cjs`,
   `brume.cjs`, `chemins2.cjs` (à recréer au besoin : voir `outils/banc/chemins.cjs` pour le modèle).
2. Rendre à l'auteur un **diagnostic court** (ce qui casse, où, pourquoi), avec captures, et **des choix** pour
   chaque conflit du § 5 : garder la version OpenCode, revenir à la décision du § 4, ou fusionner les deux.
   Recommander selon le § 4.
3. Réparer par lots validés, une PR chacun. Ne pas « revert » en bloc : une partie de ces commits est utile
   (auth, erreurs au journal, Épreuve, textes « faire naître »).

### 6.2 Réconcilier la PR #484
Reposer la branche sur `master` (`git checkout -B ccr-… origin/master`, puis reprendre les deux commits en
cherry-pick ou à la main, conflits à résoudre fichier par fichier). Ce qui est déjà couvert par OpenCode se garde
dans la version qui respecte le § 4. Puis bancs, CI, validation de l'auteur, fusion.

### 6.3 Le lot « première nuit, pré libre, Cannelle » (décidé, non codé)
- **Serveur** : une quête d'attente entre `feu` et `soupe`, ex. `veille` : `q('veille', 'T', { kind: 'runs',
  need: 3 }, 10, 'Trois Récoltes', '…')` dans `src/services/quests.js` (`runs` compte le total ; `recolte` en
  demande 1, d'où 3). Cannelle présente quand elle est faite : `people.js`, `metOf`, `foyer` →
  `presence.done.has(presence.fresh ? 'veille' : 'recolte')`. Tests : `test/quests.test.js` (nombre de quêtes,
  `total`), `pickups.test.js`, `play.test.js`, `worldBeasts.test.js` (ils posent `feu` pour faire venir Cannelle).
  Vérifier d'abord ce que les commits OpenCode « première nuit seul » ont déjà fait au serveur (`brume.steps`).
- **Jeu** : `PROLOGUE` (`src/game/prologue.js`) reçoit `veille` ; `islandStep` joue **une nuit** une fois
  (`seen` : `nuit`), via `WorldView` (`sky.js` : le `warp` existe pour la journée en 30 s ; prévoir une plage
  19 h 30 → 6 h 30 en 40 s), Brume somnole (`moodOf` : `night`), deux répliques (nuit, aube) ; puis l'arrivée de
  Cannelle **retient le tutoriel** tant qu'elle marche (`emitQuest` : `hold`, avec un `arrivalHold` posé dans
  `folk.js` `arrivalsOf` et levé après `introOf(...).total`) ; sa scène vient après.
- **Textes proposés** (en attente du oui de l'auteur, qui a demandé « corrige tout et améliorons ») :
  1. quête « Termine une Récolte » : « La marée a laissé des paires sur le sable. Relie ce qui se ressemble avant
     qu'elle revienne : l'île te le rendra. » ;
  2. quête d'attente : « Le feu tient. Prends ton temps : deux Récoltes encore, et ce que la mer rend. Je veille,
     va. » ;
  3. la nuit : « La nuit tombe. Reste près du feu : ici, elle ne prend rien. » ;
  4. l'aube : « Le jour se lève… Tu as dormi ? Moi, j'ai regardé la mer toute la nuit. Elle rend parfois ce
     qu'elle a pris. »

### 6.4 Ensuite
- Les trois premières pages du Grimoire (Vent, Pluie, Brasier) : même méthode (mesure, choix, captures).
- Chaque arc suivant (Cannelle, Rivet, Ondin, Aster), avec son pré libre.
- Les fiches de l'île différées pendant le tutoriel (nuits, naufrages) : un patch de départ existe
  (`lot1-nuits-naufrages.patch`, scratchpad de la session précédente ; idée : drapeau `tutorial` sur `WorldView`,
  `checkNights` et `checkWreck` attendent la fin du tutoriel, 1,5 s de pause, les nuits puis le naufrage).
- Puis `ETAT_DES_LIEUX.md` § 6 : P2 (scènes animées), P3 à P7.
- Un visuel manque : **le corps de Brume sans yeux** (la composition retire les yeux par expression régulière ;
  à demander à l'agent design) ; une silhouette de Cannelle sur les rochers à l'aube.

---

## 7. Comment travailler (procédures)

**Local** : `/home/user/og-create` (jeu) et `/home/user/og-create-backend` (serveur). Aujourd'hui sur des branches
d'évaluation `eval-master` et `eval-main` (= `origin/master` et `origin/main`), sans modification en attente.
La branche de travail est celle de la session (`ccr-…`). PostgreSQL : `service postgresql start`, rôle `origins`,
bases `origins_test` et `origins_dev` déjà créées.

```
# serveur (API locale sur 3000)
cd og-create-backend
export DATABASE_URL=postgres://origins:origins@localhost:5432/origins_test
export JWT_SECRET=ci-only-access-secret-not-used-in-production-0001 REGISTER_RATE_LIMIT=1000 CORS_ORIGIN=http://127.0.0.1:8099
npm run db:setup && npm test            # 215 tests le 8 oct. ; relancer sur main d'aujourd'hui
PORT=3000 nohup node src/server.js > api.log 2>&1 &   # noter le PID ; l'arrêter par son PID
# jeu
cd og-create && npm run lint && npm test && npm run build
npx vite --port 8099 --strictPort --host 127.0.0.1    # le proxy /api pointe sur 3000
NODE_PATH=/opt/node22/lib/node_modules node outils/banc/<script>.cjs 8099
```

**Bancs** : Playwright, viewport 390 × 844, compte créé sur l'API locale avec un mot de passe tiré au hasard
(jamais en dur : GitGuardian bloque la PR). `window.__find('WorldView')` et
`document.querySelector('#app').__vue_app__._instance.proxy` pour lire l'état. Captures dans le scratchpad ou
`outils/banc/shots/` (ignoré par git). Envoyer à l'auteur 2 à 4 captures par étape, pas plus.

**PR** : brouillon, `subscribe_pr_activity`, rappel `send_later` à 50 min ; CI verte → « prête » → squash avec le
SHA complet → branche reposée sur le défaut (`git checkout -B <branche> origin/<défaut>` puis
`git push --force-with-lease`) → désabonnement, rappel supprimé. GitGuardian scanne chaque commit : une chaîne qui
ressemble à un mot de passe dans l'historique rend la PR rouge ; reconstruire la branche en un commit propre si
besoin.

**Mémoires de l'appareil** (à oublier dans « Recommencer ») : `oc_prologue`, `oc_guide_seen`, `oc_coach_seen`,
`oc_arrived`, `oc_wrecks`. Comptes v6 et anciens : `players.V6_SINCE`, `islandFreshOf` ; un joueur existant ne
recule jamais.

---

## 8. Prompt de reprise (à copier tel quel)

> Tu reprends la logistique de Brumelune : le jeu `Alex-Lou/og-create` (défaut `master`) et son serveur
> `Alex-Lou/Og-create-backend` (défaut `main`). Réponds toujours en français. Ajoute le dépôt serveur à la session
> s'il n'y est pas.
>
> **Avant la première ligne de code**, lis en entier `PASSATION_LOGISTIQUE.md` (racine du jeu), puis
> `ETAT_DES_LIEUX.md` (règles de l'auteur, repères, bancs, pièges), puis `HISTOIRE.md` § 9.
>
> **Règles absolues** : demander (questions à choix, la recommandée en premier) avant tout choix structurant ou toute
> réécriture de texte ; ne jamais écrire dans `design/` ; aucune migration ; jamais `pkill -f` ni `git reset --hard`
> sans copie ; aucun identifiant de modèle dans les commits ou PR ; aucun commentaire de PR au nom de l'auteur ;
> bancs avec un compte local au mot de passe aléatoire ; aucune fuite, aucun coût répété ; ne rien déployer ; finir
> chaque tâche par Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés / Suivi
> nécessaire.
>
> **La méthode** : une étape du tutoriel à la fois. Mesurer au banc (390 × 844, chronologie, touchers, captures),
> diagnostiquer (rythme, contenu, qualité, jouabilité, ergonomie, clarté), proposer des choix multiples complets,
> coder, rendre captures et textes, attendre le oui de l'auteur. Les décisions déjà prises sont au § 4 de la
> passation : elles s'appliquent sans redemander.
>
> **Dans l'ordre** :
> 1. Réparer ce qui a été poussé les 9 et 10 octobre sans PR (§ 5) : rejouer le parcours complet d'un appareil neuf
>    sur l'API locale, diagnostiquer, proposer les choix pour chaque conflit avec le § 4, réparer par lots validés.
> 2. Réconcilier la PR #484 avec `master` (§ 6.2).
> 3. Le lot « première nuit, pré libre, Cannelle » (§ 6.3), textes soumis d'abord.
> 4. Les trois premières pages du Grimoire, puis chaque arc.
