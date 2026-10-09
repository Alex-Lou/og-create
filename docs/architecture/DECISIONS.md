# DECISIONS — Brumelune

Journal des décisions d'architecture et de méthode. Une entrée par décision, la plus récente en haut de chaque section.

**Statuts :** `Prise` (décidée avec l'auteur, datée) · `Constatée` (décision historique déduite du code et de
l'historique, sans trace écrite de sa justification : la justification donnée est la plus probable) · `Remplacée`.

Format : contexte → décision → conséquences → preuves.

---

## Décisions prises

### D-009 · « Recommencer » efface tout sauf le compte ; le tutoriel suivi pas à pas, fêté, et sans parole inutile — Prise, 2026-10-09
- **Contexte :** l'auteur : « ça doit TOUT effacer sauf mon compte et me permettre de revivre le tuto depuis le
  départ » ; chaque étape du tuto affichée et suivie dans le menu des quêtes ; la fête d'une tâche faite « plus lente,
  plus festive, lisible à l'œil » ; « chaque parole doit être utile avant tout au tuto et au joueur » (Brume disait
  « … merci » puis « Non… rien… » ; une tâche faite et sa récompense avant l'intro de l'île).
- **Décision :** serveur : `restartIsland` efface toutes les données de jeu du joueur (`DATABASE.md` § 6), garde
  `users` et les tables de session et de liens. Appareil : toutes les clés `oc_*`, `coins`, `userCustomization`
  oubliées, `oc_prologue` marqué `restarted` : l'ouverture (naufrage, carte, arrivée) se rejoue avant l'île
  (`story.js`, `openingReplay`). Vue de l'île : `brume.steps` (12 étapes) → suivi « Tutoriel · étape X/12 ». Pendant le
  tutoriel, le guide ne dit que ce qui sert l'étape (`guide.setTutorial` : aides générales en attente, sauf `fail`) ;
  pressentiments d'Anya et « Feu follet » après lui. Fête : bonds de Brume (1,8 s), anneaux, étincelles, confettis,
  bannière « Quête accomplie ! » (2,4 s), écus qui volent posément (0,95 s chacun).
- **Conséquences :** recommencer n'est plus un « nouveau départ de l'île » mais un nouveau compte de jeu sur la même
  adresse : écus, Grimoire, achats et coffres perdus (le texte de « Mon compte » le dit). Toute nouvelle réplique du
  tutoriel passe par `prologueScenes.js` (`LINES`) et reste sous 140 caractères (test).

### D-008 · Début d'île : la plage avec Brume, puis un personnage et un morceau d'île à la fois ; bâtiments déplaçables — Prise, 2026-10-09
- **Contexte :** l'auteur : plage vide (épave, petit feu, Brume) tant que les quêtes de Brume ne sont pas finies ; rien
  d'un personnage (ni camp ni bâtiment) avant lui ; l'île qui s'ouvre progressivement ; la cuisine de Cannelle à la
  place du feu et le feu près du bateau ; déplacer librement ses bâtiments ; les traces d'Anya mises de côté.
- **Décision :** places par joueur (`world_site_places`, ajout seul, accord de l'auteur) ; îles neuves ou recommencées
  « à la plage » (Feu près de l'épave, au bout du sentier) ; camp et chantiers liés à la présence du personnage
  (serveur) ; brume du cœur par cases autour de ce qui est arrivé (`world/reveal.js`) ; traces d'Anya cachées pour les
  comptes qui suivent l'histoire. Comptes d'avant la bible : inchangés.
- **Conséquences :** toute règle de position passe par `world/places.js` (jamais `worldMap.footprintOf` directement,
  sauf les anciennes cartes de `migrate.js`). Le quartier d'un bâtiment reste celui de la carte, où qu'il soit posé.

### D-006 · Plafond d'écus de la Récolte — Prise par délégation de l'auteur (« fais au mieux »), 2026-10-09
- **Contexte :** la Récolte n'avait aucun plafond (ni pour son bonus d'étoiles), alors que les mini-jeux sont plafonnés
  à 60 × le multiplicateur de palier (`minijeux_grille.md` § 2, § 8) ; la graine connue du client permet de calculer
  la partie parfaite. La Récolte n'a pas de bâtiment à elle.
- **Décision :** plafond = 60 × `multOf(plus haut palier de l'île)` : 60 en début d'île, 108 au palier VII ; les
  ressources ne sont pas plafonnées ; le bonus d'étoiles tient dans le même plafond.
- **Pourquoi pas 60 fixe :** une île avancée gagne, en jeu normal, de l'ordre de 100 écus par Récolte (estimation sur
  les règles : 25 coups, multiplicateurs jusqu'à ×6) ; 60 fixe l'aurait fortement réduite.
- **Conséquence à surveiller :** une île « tout acheté » (46 coups) pouvait atteindre ~250 écus par partie (estimation,
  `GAME_RULES.md`, constat 7) ; elle plafonne désormais à 108. Les articles qui donnent des coups gardent leur effet sur
  les ressources et les étoiles, mais plus sur les écus au-delà du plafond. À revoir avec l'auteur si les joueurs
  avancés le ressentent.
- **Réversible :** une seule fonction (`B:services/world.js` : `harvestCap`).

### D-007 · Un seul écran de chargement ; HUD en disposition de jeu mobile — Prise, 2026-10-09 (remplace la mise en page partagée de D-005)
- **Contexte :** l'auteur : « deux fois le splash au lancement, un troisième en revenant du Grimoire » ; « la barre des
  quêtes est trop large même repliée ; revoir le HUD comme les jeux mobiles AAA ».
- **Décision :** le splash attend l'île d'un compte (`splashExpect('ile')`) ; l'arrivée sur l'île devient une pastille
  discrète (`IslandLoader`), jamais sous le splash. HUD : en haut horloge, écus, « Tout ramasser », puis les réserves sur
  une ligne ; colonne de gauche (médaillon des quêtes, coffres, carnet, trouvailles, boussole) ; colonne de droite (zoom,
  plein écran, chemins) ; la Récolte en bas à droite, sous le pouce. Suivi replié = médaillon de 44 px.
- **Conséquences :** `IslandLoader` ne réutilise plus les classes `.splash__*` (D-005, mise en page partagée, n'a plus
  d'objet). La cible du coach `.world__play` est le bouton de la Récolte en bas à droite.

### D-005 · Écran de démarrage : 2,5 s au moins, une seule mise en page avec l'arrivée sur l'île — Prise, 2026-10-09 (mise en page partagée remplacée par D-007)
- **Contexte :** l'auteur : « le centrer, bien placer, durer deux ou trois secondes ». Le splash disparaissait en moins
  d'une seconde ; sur téléphone il était décalé et coupé à droite ; l'arrivée sur l'île en recopiait la mise en page
  (deux copies déjà divergentes).
- **Décision :** `SPLASH_MIN_MS = 2500` ; scène au format exact du dessin ; `IslandLoader` reprend les classes du splash.
- **Conséquences :** un changement du splash vaut pour les deux écrans ; ne pas renommer les classes `.splash__*`
  sans `IslandLoader.vue`.

### D-004 · L'île d'abord, compte provisoire, Grimoire à la quête Vent — Prise, 2026-10-09
- **Contexte :** l'auteur : « après le splash, directement l'île (tuto si nouveau compte), après le Grimoire et le
  reste se débloquent ». Le serveur exige un compte pour l'île (402 invité) ; il savait déjà ouvrir un compte provisoire
  (`/auth/provisional`, `/auth/claim`), inutilisé.
- **Décision (options validées par l'auteur) :** tout compte ouvre sur l'île ; nouveau visiteur : naufrage → carte →
  arrivée → compte provisoire en coulisse → île ; la quête Vent ouvre le Grimoire ; le vent levé, la page de garde
  signe le compte ; Sceau après la première nuit, Défis à la fin du tutoriel (inchangés). Si le compte provisoire est
  refusé : l'ancien chemin (le Grimoire d'abord).
- **Conséquences :** inverse l'ordre de `HISTOIRE.md` § 9 (Grimoire seul d'abord) : la bible narrative est à mettre à
  jour par l'auteur. Un invité qui a déjà une partie (sans compte) reste sur le Grimoire. Un compte provisoire jamais
  signé est effacé après 30 jours sans session (serveur). Aucun nouveau texte : consignes existantes.

### D-003 · Tests serveur sur le VPS : base Postgres jetable et isolée — Prise, 2026-10-09
- **Contexte :** le clone de travail est sur le VPS de production (API sur le port 3000, Postgres de production sur
  5432). Les tests serveur démarrent le vrai serveur et écrivent en base.
- **Décision :** tests uniquement sur un cluster Postgres temporaire (`initdb` dans `/tmp`, socket Unix, port 55432,
  `listen_addresses=''`), sous `nice`, avec `--test-concurrency=1`. Build front écrit hors du dépôt.
- **Conséquences :** aucun contact avec la base ni l'API de production ; charge CPU limitée (≈ 2 min pour 216 tests).
  Procédure dans `PROJECT_BIBLE.md` § 4.

### D-002 · Emplacement de la bible technique — Prise, 2026-10-09
- **Contexte :** deux dépôts indépendants ; la passation historique vit dans le front.
- **Décision :** chaque document vit près du code qu'il décrit. Front `docs/architecture/` : `PROJECT_BIBLE`,
  `FRONTEND`, `GAME_RULES`, `SECURITY`, `DECISIONS`, `CHANGELOG_TECH`. Back `docs/architecture/` : `BACKEND`,
  `API_CONTRACTS`, `DATABASE`. Les documents existants (`HISTOIRE`, `PASSATION`, `ETAT_DES_LIEUX`, `DEPLOY`,
  `db/README`) restent en place, référencés et non dupliqués ; leur réécriture se demande.
- **Conséquences :** un changement transversal met à jour les deux dépôts dans le même lot.

### D-001 · Protocole maître d'ingénierie — Prise, 2026-10-09 — remplace la règle « feu vert permanent »
- **Contexte :** `ETAT_DES_LIEUX.md` § 1 et `PASSATION.md` § 2 donnaient un accord permanent de push et de fusion sur
  CI verte, avec `git push --force-with-lease` après fusion.
- **Décision :** le protocole du 2026-10-09 prévaut. Aucun fichier modifié sans accord explicite ; aucun commit, push,
  merge, rebase ni push forcé sans accord explicite ; un accord de code n'autorise ni commit ni déploiement.
  Travail par lots séparés : comprendre → évaluer → demander → implémenter → vérifier → rendre compte.
- **Conséquences :** les sections « Processus par lot » de `ETAT_DES_LIEUX.md` et « Git, PR et fusion » de
  `PASSATION.md` sont caduques sur ce point (à corriger dans ces documents, avec accord).
- **Règles anciennes maintenues :** jamais d'écriture dans `design/` ; aucune migration de base sans demander ; un
  joueur existant ne recule jamais ; serveur fusionné avant le jeu ; jamais `pkill -f`.

---

## Décisions constatées (historiques)

### C-008 · Règles des jeux dupliquées à l'identique front/back
- **Décision :** `levels`, `harvest`, `minigames` (et quelques constantes) existent dans `src/game/` et
  `src/services/`, avec les mêmes vecteurs de test.
- **Pourquoi (probable) :** jeu fluide hors réseau pendant la partie, puis rejeu et validation par le serveur.
- **Conséquences :** toute règle change des deux côtés dans le même lot. Comparaison du 2026-10-09 : identiques une
  fois retirés commentaires et syntaxe d'export (`GAME_RULES.md` § 7). Constantes recopiées (encre, joker, bonus de
  record) : `API_CONTRACTS.md`, écart E8.

### C-007 · Schéma rejouable, sans outil de migration
- **Décision :** `db/schema.sql` idempotent (`IF NOT EXISTS`, `ALTER … IF NOT EXISTS`), appliqué par `db/setup.js` à
  chaque déploiement ; contenu régénéré (`db/seed.sql`, scripts Python).
- **Conséquences :** pas de retour arrière formel ; nouveaux états souvent rangés dans `world_items` pour éviter une
  migration ; `db:setup` rejoue des `ALTER` à chaque déploiement (`DATABASE.md`).

### C-006 · Sessions en cookies httpOnly avec rotation (B #10-11 ↔ F #15, 2026-10-01)
- **Décision :** `oc_access` (JWT 15 min ; depuis le lot R4, lié à sa session par `sid` et revérifié en base),
  `oc_refresh` (opaque 30 j, haché, rotation, révocation de la famille en cas
  de réutilisation), `oc_guest` pour les invités ; SameSite=Strict + en-tête `X-Requested-With` contre le CSRF.
- **Conséquences :** aucun jeton lisible par JavaScript ; front et API doivent rester sur la même origine.

### C-005 · Serveur qui fait autorité (B #12-13 ↔ F #16, #18, 2026-10-01)
- **Décision :** recettes, écus, ressources, île, scores décidés côté serveur ; chaque action de l'île en transaction
  verrouillée, réponse avec la vue complète.
- **Exception constatée puis corrigée :** progression de l'Épreuve écrite par le client (lot R2, `SECURITY.md` 3.1).
  (L'Épreuve n'a pas d'ordre de chapitres à imposer : aucun verrou de chapitre ni de niveau n'existe dans le jeu (vérifié le 2026-10-09 : `TimerQuestions.vue`, `availableCategories` ; `unlockedCategories` = « scellé ») ; `/play/run` qui accepte toute question est conforme.)

### C-004 · SQL brut, pas d'ORM
- **Décision :** `pg` avec requêtes paramétrées ; aucune entrée utilisateur concaténée (vérifié, `SECURITY.md`).

### C-003 · Pas de routeur ni de store côté front
- **Décision :** `App.vue` choisit l'écran (`currentMode`) ; état dans `App.vue`, ses mixins et quelques modules
  `reactive()`.
- **Conséquences :** simple, mais `App.vue` et `WorldView.vue` concentrent beaucoup de responsabilités.

### C-002 · Vue CLI → Vite (F #128, #149, #150, 2026-10-06)
- **Conséquences :** préfixe `VUE_APP_` conservé (`envPrefix`) ; dossiers de sortie `js/ css/ img/ fonts/` conservés.

### C-001 · Hébergement : Render + Neon, puis VPS OVH (2026-09-30 → 2026-10-08)
- **État :** les deux configurations coexistent dans le dépôt (`render.yaml`, `deploy/ovh/`) avec des valeurs
  différentes (`TRUST_PROXY_HOPS` 2 contre 1). Décision à prendre : retirer ou garder Render (non tranché).

---

## Décisions en attente (à trancher avec l'auteur)

| # | Sujet | Où c'est décrit |
|---|---|---|
| A-1 | Garder ou retirer la configuration Render (keep-alive, retries 90 s) | C-001 |
| A-2 | Routes exposées mais inutilisées : `/auth/provisional`, `/auth/claim`, `/coins/balance`, `/progress/save` | `API_CONTRACTS.md` § 5 |
| A-3 | « Recommencer l'île » : illimité ou une fois (`ISLAND_RESTART_ONCE`) | `GAME_RULES.md` |
