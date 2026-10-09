# CHANGELOG technique — Brumelune

Journal des changements **techniques** des deux dépôts : le jeu (`og-create`, branche `master`) et l'API
(`Og-create-backend`, branche `main`). On n'y trouve ni le contenu (recettes, dessins, textes) ni les retouches
visuelles.

**Règle : une entrée par changement technique significatif, la plus récente en haut ; chaque entrée cite les PR
front/back.**

Généré depuis l'historique Git le 2026-10-09 (front b47a53f2, back 9cc7bfe).

**Conventions**
- `F #n` : PR du front. `B #n` : PR du back. Un hash court quand le commit n'a pas de numéro de PR.
- `B #m ↔ F #n` : même lot (même jour, même titre ou même contrat d'API). Le serveur est fusionné avant le jeu.
- « (hypothèse) » : c'est une déduction, l'historique ne le dit pas tel quel.
- Sans doublon avec `HISTOIRE.md` (récit, game design), `PASSATION.md` (architecture § 5, lots § 6) et
  `ETAT_DES_LIEUX.md` (repères dans le code § 3, dernières PR en détail § 4).
- Volumes : 761 commits front (de déc. 2024 à oct. 2026, dont 541 en octobre 2026) et 227 commits back. Aucun commit
  entre le 2025-03-27 et le 2026-09-30.

---

## 2026-10-09 — Lots de sécurité (branche `fix/securite-auth`, non poussée)

- **Lot R1 · Secret JWT au démarrage** (back `src/utils/jwt.js`, `test/jwt.test.js`, `db/README.md`).
  - Bug : un secret généré n'était écrit que dans `.env` ; le processus en cours n'en avait pas ⇒ inscription et
    connexion en 500 jusqu'au redémarrage. Reproduit avant correctif (`register` 500), corrigé (201).
  - Règle unique 32 caractères ; ligne `JWT_SECRET=` ancrée (plus de confusion avec `OLD_JWT_SECRET=`) ; guillemets
    lus comme dotenv. Aucun effet en production (secret fourni par l'environnement).

## 2026-10-09 — Bible technique

- **10-09 · Création de `docs/architecture/` dans les deux dépôts.** Elle n'est pas encore commitée au moment de la
  génération (front b47a53f2, back 9cc7bfe), donc pas de PR à citer.
  - Front : `PROJECT_BIBLE`, `FRONTEND`, `GAME_RULES`, `SECURITY`, `DECISIONS`, `CHANGELOG_TECH` (ce fichier).
  - Back : `BACKEND`, `API_CONTRACTS`, `DATABASE`.
  - Base de référence mesurée ce jour-là :
    - front : lint OK, 415/415 tests (78 fichiers), build OK ;
    - back : 216/216 tests, sur un Postgres 16 temporaire et isolé.
  - Méthode : `npm ci` dans chaque dépôt (lockfiles inchangés) ; build front écrit hors du dépôt
    (`vite build --outDir /tmp/…`) ; tests back avec `node --test --test-concurrency=1` sous `nice`, sur un cluster
    Postgres jetable (socket Unix dans `/tmp`, port 55432, aucune écoute réseau). La machine est le VPS de
    production : le cluster Postgres de production (port 5432) et l'API (port 3000) n'ont jamais été touchés.
  - Aucun code applicatif modifié ; rien n'est commité.
- 10-09 · Le nom « Brumelune » est harmonisé dans les textes (45 fichiers côté front ; ce sont les deux HEAD) →
  F #486 ↔ B #130.

---

## Semaine 41 — du lundi 5 au vendredi 9 octobre 2026

### Jeudi 8 octobre

- **Fluidité serveur** → B #127 ↔ F #479.
  - Vue de l'île : 50 requêtes au lieu de 79, en parallèle. `db.cached` (`src/config/db.js`) garde les lectures le
    temps d'une requête. Mesure avec 10 ms de latence simulée : 894 → 223 ms.
  - Gzip des réponses JSON de plus de 1 Ko (`src/middleware/compress.js`).
  - Front : un seul dessin de l'île par image, fuites colmatées. Détail : `ETAT_DES_LIEUX.md` § 4.
- **Jeux à grille, le socle** → B #126 ↔ F #476.
  - `levels.js` est une copie conforme des deux côtés (30 niveaux par jeu).
  - Étoiles en lignes `world_items` (`etoile:<jeu>:<n>:<k>`) ; niveau codé dans `world_game_runs.level`. Aucune
    migration.
- **Chemins tracés par le joueur** → B #125 ↔ F #473.
  - `POST /play/world/paths` ; cases en lignes `world_items` « chemin:x:y » ; île neuve marquée `ile:sentiers`.
  - Front : seuls les carrés de sol touchés sont refaits.
- **Patron « drapeaux dans `world_items` »** (prologue passé, chemins, étoiles) : de nouveaux états sans
  `ALTER TABLE` → B #123, #125, #126 (hypothèse : choix délibéré pour éviter les migrations).
- **« Recommencer l'île »** → B #124 ↔ F #464.
  - `POST /play/world/restart` (confirmation `RECOMMENCER`). Une seule transaction efface l'île et garde le
    Grimoire, les écus et l'avatar.
  - `players.RESTARTED` applique ensuite les règles d'un compte neuf.
- **Tutoriel tenu par le compte, plus seulement par l'appareil** (`POST /play/world/prologue/skip` ; la vue de
  Brume expose `tutorial` et `skipped`) → B #123 ↔ F #463.
- **Comptes au tutoriel incomplet repris par le code** (sans changer le schéma), première nuit → B #129 ↔ F #485.
  - Aster arrive après le premier chemin, sur les îles v6 seulement → B #128 ↔ F #483.
- **Avatar composé, validé par le serveur** → B #120 ↔ F #444 (appariement : hypothèse).
  - Liste blanche `avatarChoices.js` (copie du kit front), objets gagnés vérifiés ; `world_avatars.choices JSONB`.
- **Pose en miroir et couleur des annexes** (`world_annexes.flip`, `world_annexes.look`, `world_crafts.flip`) →
  B #117 ↔ F #430.
- **L'interface lit `design/`** : HUD et écrans en pièces SVG HD ; icônes déclarées en 128 × 128 pour le canvas du
  Livre → F #446, #447, #449 à #451, #465, #467.
- **Bancs Playwright locaux** (`outils/banc/` : perf, chemins, mini-jeux…), avec un mot de passe tiré au hasard →
  F #483.

### Mercredi 7 octobre

- **Déploiement sur le VPS OVH (brumelune.eu)**, fichiers dans `deploy/ovh/` du front → F #384.
  - Nginx : HTTPS (Let's Encrypt), `/api` vers 127.0.0.1:3000, build gardé un an, page et service worker toujours
    revérifiés.
  - systemd : 512 Mo au plus, sans droit d'écriture. `deploy.sh` : build, `db/setup.js` du back, puis `/api/health`.
    `backup.sh` : sauvegarde quotidienne gardée 14 jours.
  - Joueurs repris depuis Neon. Aucune PR côté back (hypothèse : l'API est déployée telle quelle depuis `main`).
- **Démarrage robuste** → F #383 (écran de démarrage : F #382).
  - Les GET sans réponse ou reçus en 502 à 504 sont refaits (de 1 à 15 s d'écart, 90 s au plus) ; les écritures,
    jamais.
  - Le service worker ne garde plus une page HTML à la place d'un fichier du build (cache renommé).
  - Un morceau de code introuvable recharge la page.
- **Mise à jour en ligne** : le build écrit `version.json` (`VITE_APP_VERSION`), relu toutes les 10 min ; Brume
  propose « Actualiser » → F #394.
- **Perf 1 et 1b : rendu des sprites** → F #364, #369.
  - `spriteCache` rend au détail affiché (de 4 à ¼ px par unité), dans un budget de 16 Mpx ; il peint quelques SVG par
    image (6 ms au plus).
  - L'île est chargée à part (lazy), préchargée au repos. Chargement : 7,7 → 3,4 s. Mémoire des images : 163 → 73 à
    90 Mo.
  - 1b : une image part après 10 s sans usage et laisse une copie légère ; un sujet garde sa dernière image (`hold`).
- **Carte 144 × 144 (map v5)** → B #113 ↔ F #409.
  - Générée une fois par `scripts/scaleMap.js` depuis la v4 figée (`worldMapV4.js` → `islandV5.js`).
  - Migration v4 → v5 : positions en `round(1,5x + 0,25)`, portées agrandies.
  - Front : rafraîchissement 1 070 → 300 ms (CPU ×4).
- **`X-Map-Key` : les calques de la carte ne voyagent qu'une fois** → B #114 ↔ F #411.
  - Réponse : 155 → 70 Ko. Le front ne refait le relief et les eaux qu'au changement de clé (~300 → ~100 ms).
  - CORS autorise l'en-tête.
- **« Mon compte »** → B #112 ↔ F #402.
  - `/api/account` : profil, mot de passe (déconnecte les autres appareils), nouvelle adresse confirmée par lien,
    pause, suppression à J+7 (balayage horaire), export JSON.
  - Schéma : `users.suspended_at`, `users.delete_at`, table `email_changes`.
- **Production sans perte** → B #109, #110 ↔ F #389, #392.
  - `world_stock.carry` (JSONB) garde les fractions ; ce qui attend dans les bâtiments est encaissé avant de payer.
  - Front : `world/due.js` recharge l'île à l'échéance.
- **Avatar gardé avec le compte** (table `world_avatars`, `POST /play/world/avatar`) → B #108 ↔ F #350.
- **Générateur SVG en modules ESM** (esbuild depuis `design/atelier`, 6 457 comparaisons octet par octet ; un module
  par famille, qui rend `{ svg, cadre, ms_par_image }`) → F #386, #397 et les lots « Générateur » jusqu'à #413.

### Mardi 6 octobre — lot « santé », sécurité, refonte

- **vue-cli → Vite** → F #128.
  - `vite.config.mjs` (alias `@`, proxy `/api`, `envPrefix` qui garde `VUE_APP_API_URL`), `index.html` à la racine,
    `import.meta.env` et `import.meta.glob`.
  - Retirés : `@vue/cli-*`, Babel, core-js. Le build garde `js/`, `css/`, `img/`, `fonts/` (service worker inchangé).
- **Outillage du front**
  - Vite 6.4 et Vitest 4.1 (failles du serveur de dev et du mocker) → F #149.
  - ESLint 9 en flat config (`eslint.config.mjs`) ; `npm audit` à 0 → F #150. axios 1.20.0 → F #129.
- **Moteur de l'île hors de `WorldView.vue`** (5 014 → ~3 150 lignes) → F #127.
  - Dans `src/world/view/` : `camera`, `draw`, `gestures`, `constants`, `memory`.
  - Fiches et HUD en composants → F #126, #133 à #138.
- **Refonte CSS, sans rien changer à l'écran** → F #162, #163, #165 à #168, #170 à #172.
  - `src/styles/` : jetons et base par famille ; le CSS de chaque composant est à côté de lui (`<style scoped src>`).
  - Valeurs en dur → jetons (étapes 3a à 3d), vérifiées par `tests/tokens.test.js`.
  - Preuve : CSS compilé comparé et banc de captures identique au pixel.
- **Rangement par domaine et mixins par sujet** (preuve : relevé des membres identique avant et après).
  - Un dossier par composant, `<Domaine>/<Composant>/<Composant>.vue` et `.css` → F #173, #174, #176.
  - `App.vue` 1 117 → 517 lignes (F #179) ; `BookView.vue` (F #180) ; `WorldView.vue` 2 479 → 896 (F #182, #184).
  - `draw.js` découpé dans `world/view/draw/` → F #185.
- **`world.js` découpé dans `services/world/`** → B #90, #91.
  - Modules : `rules`, `reads`, `migrate`, `chests`, `people`, `produce`, `anyaBrume`, `lands`, `creations`,
    `annexPlots`.
  - Même API (53 exports) ; 1 914 → ~650 lignes.
- **Sécurité du back, dépendances** : alertes de production 14 → 0.
  - `npm audit fix` dans les plages (express 4.22.3…) → B #92 ; minimatch 3.1.5 (ReDoS) → B #94.
  - nodemailer 10.0.15 (injections SMTP et CRLF) → B #95.
  - bcrypt 6 (binaires précompilés, plus de tar ni de node-pre-gyp ; empreintes compatibles) → B #96.
- **Mots de passe de 72 octets au plus** (bcrypt n'en lit pas davantage), même règle à l'inscription et à la
  réinitialisation → B #100.
- **Courses (audit des routes d'écus)** → B #103.
  - Un achat déjà utilisé ne s'annule plus (`clock_timestamp` pris après le verrou) ; skin tenu en `FOR SHARE` ;
    succès recalculés sous verrou.
  - Helper de test `whileHeld` pour rejouer une course à coup sûr.
  - Verrous du Souffle d'Anya et du Savoir de Brume → B #89 ↔ F #125.
- **Encre retenue par le serveur** → B #102 ↔ F #148.
  - `ledger.debitOnce` s'appuie sur l'unicité motif + référence de `coin_ledger`, sans migration.
  - `PLAY_ADDRESS_RATE_LIMIT` devient réglable.
- **Production juste** : chaque heure compte avec l'humeur de son moment (`prodSteps`, `gatherBefore`) ; équivalence
  vérifiée sur 20 000 cas tirés au hasard → B #97 ↔ F #140.
- **Compte provisoire**, sans migration → B #105 (le front s'en sert dans le tutoriel v6 : hypothèse).
  - `POST /auth/provisional` (adresse réservée en `.invalid`, RFC 2606), puis `POST /auth/claim`, une seule fois.
  - Les comptes provisoires inactifs depuis 30 jours sont purgés.
- **Nuits et bêtes de ferme** (tables `world_nights` et `world_beasts`, réglées au passage suivant par `migrate`) →
  B #106, #107 ↔ F #160.
- **Tests du back** : chaque serveur de test demande un port libre au système, fin des `EADDRINUSE` en parallèle (134
  tests à cette date) → B #87.
- **Service worker** : les fichiers hachés d'une ancienne version sont purgés au chargement (sinon +1,3 Mo par
  version) ; `waitUntil` → F #153.
- **Perf** : `strokeBatch` regroupe les traits (vagues, écume) ; vue lointaine 73 → 37 ms à CPU ×4 → F #146.
- **`design/` dans le dépôt front**
  - 3 404 SVG et un atelier de générateurs qui les redonnent à l'octet près → F #121. Catalogue et nommage → F #155.
  - Le jeu lit `design/bibliotheque` sans jamais y écrire, fichier par fichier, à la demande (+3,7 Ko gzip au
    bundle) → F #195, puis les lots « Bibliothèque » 1b à 5g (de F #200 à F #381).
- **`VETERAN_BEFORE` ne doit pas avancer** (documenté) → B #99.

### Lundi 5 octobre

- **Colonne vertébrale de l'histoire (lots H0 à H8)** → B #79 à #86 ↔ F #112 à #123 (dont B #80 ↔ F #114).
  - Chaîne de 55 quêtes ; les anciennes y sont rangées (`LEGACY`).
  - Cohorte « vétéran » : `users.created_at < VETERAN_BEFORE`, sans migration.
- **Très grande île 96 × 96 (map v4)** → B #75 ↔ F #104.
  - `islandOuter.js` entoure le cœur `islandData.js` ; 24 quartiers, calques voilés.
  - Migration v3 → v4 ; expéditions (table `world_expeditions`).
- **Mini-jeux rejoués par le serveur** → B #68 ↔ F #95.
  - Moteurs déterministes à graine, vecteurs de test partagés entre navigateur et serveur.
  - Une partie se rend une fois ; refusée si elle a expiré ou si elle est datée du futur. Tables `world_games`,
    `world_game_runs`.
- **Une table par lot de l'île, ajouts seuls** (annexe B) → B #65, #67, #69 à #78 ↔ F #92, #94, #96, #98, #100 à
  #107.
- **Coffres « Tout ouvrir »** : une transaction sous le verrou de `world_stock` ; 409 si rien n'attend → B #66 ↔
  F #93.
- **Compteur `?perf`** (images par seconde, temps de dessin) → F #109.
- **Documents** : `PASSATION.md` → F #107 ; `HISTOIRE.md` → F #110.

---

## Semaine 40 — du mercredi 30 septembre au dimanche 4 octobre 2026

### Dimanche 4 octobre

- **Nettoyage du back** → B #38.
  - `app.js` construit l'application, `server.js` l'écoute. Outils communs : `db.transaction`, fabrique de limites,
    `utils/crypto`, un seul logger.
  - Le SQL quitte les routes pour `services/` ; `routes/play` est découpé (index, book, world, trial, shared).
  - Routes mortes retirées ; le journal SQL passe à ERROR par défaut.
- **Nettoyage du front** → F #45.
  - `App.vue` 1 394 → 811 lignes ; une seule source de progression ; outils partagés (`utils/fx`, `storage`,
    `errors`).
  - Le `.env` versionné est retiré (désormais ignoré).
- **Schéma : retrait de l'Explorer** → B #39.
  - Tables `explorer_regions`, `user_regions` et `game_settings`, plus 7 colonnes de `progress` ; contrainte
    `chk_progress_coins`.
  - Achats du Cabinet et records de l'Épreuve passent par `coin_ledger`.
- **Pendu tenu par le serveur** (`book_letters`, puis `revealed`) ; le front affiche la lettre tout de suite et le
  serveur confirme → B #43, #45 ↔ F #52, #54, #56.
- **Carte versionnée** (`world_stock.map_version`) : migration paresseuse, une fois par joueur, verrouillée, tout ou
  rien.
  - v2 20 × 20 et `world_zones` → B #46 ↔ F #62.
  - v3 48 × 48 en calques figés (`islandData.js` ; `worldMapV2.js` gelé) → B #50 ↔ F #67.
- **Économie de l'île** : `world_items` et `world_skins` (B #47 ↔ F #63) ; `world_quests` (B #51 ↔ F #71) ;
  `world_chests` et `world_items.source` (B #58 ↔ F #84).
- **Rendu de l'île**
  - Terrain par calques, en blocs de 8 × 8 gardés en image ; caches vidés en quittant → F #67.
  - Sol en carrés alignés sur l'écran, SVG rastérisés une fois : 80 → 9 ms par image à CPU ×4 → F #68.

### Samedi 3 octobre

- **Le Livre devient l'écran principal** → F #38, #39 ↔ B #33 (pages et Encre calculées par le serveur).
  - Pages tournées en WebGL : perte de contexte gérée, repli sans WebGL ou en mouvement réduit, `destroy()` libère le
    GPU.
- **Expédition retirée** (routes, combat, régions) → B #32 ↔ F #38. Ses tables partent avec B #39.
- **Le Monde, première île** : `world_tiles`, `progress.world_collected_at`, collecte sous verrou → B #34 ↔ F #41.
- **Monde v2** (île 14 × 14 = map v1) → B #37 ↔ F #44.
  - Tables `world_stock`, `world_buildings`, `world_runs`.
  - Récolte à graine rejouée par le serveur, avec le même vecteur de test des deux côtés.
- **Essais par page** (`book_tries`) → B #35 ↔ F #42.

### Jeudi 1er octobre

- **Sessions en cookies httpOnly** → B #10, #11 ↔ F #15.
  - JWT d'accès de 15 min et jeton de rafraîchissement opaque, en cookies `SameSite=Strict`.
  - Rotation à chaque usage, seule l'empreinte est gardée (`auth_sessions`, une famille par UUID). Un ancien jeton
    réutilisé révoque toute la famille (tolérance de 10 s entre onglets).
  - L'en-tête `Authorization` n'est plus accepté ; en-tête anti-CSRF ; `/auth/me`.
  - La connexion coûte autant que l'adresse existe ou non ; limite par compte en plus de la limite par IP.
  - B #11 supprime `refresh_tokens` et `tokenManager`.
  - Front : plus aucun jeton dans le navigateur ; l'API est servie sous `/api`, à la même origine.
- **API de jeu tenue par le serveur (`/play`)** → B #12 ↔ F #16 (`playService.js`).
  - Chaque mélange est vérifié contre l'inventaire ; les recettes ne quittent plus le serveur.
  - Carnet invité par cookie httpOnly (`guest_players`), parties en cours dans `play_runs`. Le carnet invité rejoint
    le compte à la connexion.
- **Épreuve tenue par le serveur** (sablier, réponses retirées des questions, points, record) → B #13 ↔ F #18.
  - De même pour l'Expédition → B #14 ↔ F #20. Routes de synchronisation mortes retirées → B #15.
- **Grand livre des écus (`coin_ledger`)** : seul le serveur fait varier le solde → B #9 ↔ F #13.
  - Succès recalculés sans évaluer de code.
  - Durcissement : trust proxy ; limites sur la connexion et l'inscription ; contact échappé ; TLS SMTP vérifié ; ni
    e-mail ni détail d'erreur dans les réponses ; contrainte « solde ≥ 0 ».
  - **CI** : back en `node:test` sur une vraie base (Postgres 16, Node 22) ; front en Vitest avec `ci.yml`.
  - Secrets de test assez longs, sortie du serveur visible en CI (faf3203, dans B #9).
- **Mot de passe oublié** : lien à usage unique, seule l'empreinte est gardée (`password_resets`) → B #7 ↔ F #11.
- **Cabinet** : `customization_items.achievement`, achat sûr → B #8.

### Mercredi 30 septembre — reprise du projet

- **P1 à P3 du front** → F #1.
  - Build réparé (dépendances manquantes ou inutiles). Client HTTP unique (`services/http.js`), rafraîchissement sur
    401 partagé.
  - `progressService` : 709 → ~110 lignes (sauvegardes groupées sur 2 s, keepalive). Moteur de craft partagé, fin de
    `window.*` et de `$parent`.
- **Déploiement Render** → F #1, #2 ↔ B #1, #2.
  - `render.yaml`, `VUE_APP_API_URL` ; pinger GitHub Actions toutes les 10 min (`keep-alive.yml`).
  - Base remplie au build, sur Neon (`DEPLOY.md` décrit la procédure Neon + Render).
- **Base versionnée** → B #1, #2.
  - `db/schema.sql` reconstruit depuis les requêtes de `src/` (idempotent, `IF NOT EXISTS`).
  - `db/seed.sql`, et `db/setup.js` en Node (sans psql) ; `DATABASE_URL` est prioritaire.
- **Contenu généré et vérifié** : `db/gen_seed.py` et `db/content/*.py`, avec un vérificateur d'atteignabilité →
  B #4, #5.
- **Mode invité** : les routes de contenu ne demandent plus de jeton → B #3 ↔ F #3.
- **PWA** : manifest et service worker minimal (pages en réseau d'abord, build en cache d'abord, API jamais
  interceptée), en production seulement → F #6.

---

## D'avril 2025 à août 2026

Aucun commit dans les deux dépôts : le dernier date du 2025-03-27, la reprise du 2026-09-30.

---

## Origines (de décembre 2024 à mars 2025)

Pas de PR à cette époque : les références sont des hashes courts, en « front / back ». Le schéma n'était pas
versionné ; il a été reconstruit le 2026-09-30 (B #1).

- **2024-12-18** · Front Vue 3 créé avec vue-cli 5, Babel et ESLint 7 → 9e8c865a.
  - Composants découpés (07ba5af0, 3fec28a4), GSAP et particules (91348be1), glisser-déposer (1d83bcb4).
- **2025-01** · Craft et succès sur des JSON locaux → 50c4fbb9, f9bce71a.
- **2025-02-15** · Back v1 : Express, pg, JWT, bcrypt, helmet, express-rate-limit → 567e3ea.
  - Côté front : connexion et sauvegarde de la progression → 95c9b62a, 3ac2a6af.
- **2025-02-17** · Envoi d'e-mails → bc43eb76 / 26a61ec.
- **2025-02-20 à 23** · Modes Timer et Infini → 67d24ab8, 70dcd120.
- **2025-02-26** · Rafraîchissement JWT : `tokenManager`, table `refresh_tokens` → 0f2562a6 / 402a3f3. Remplacé le
  2026-10-01 (B #10, #11).
- **2025-02-26 au 03-03** · Mode Explorer : régions, énergie, boss → c9486ebd / b3a0052, 1399a7c.
- **2025-03-06 et 07** · Correctifs des 429 et des appels répétés, réorganisation → 676ba3fb / 6195c90, f268600,
  bfb5ca3.
- **2025-03-14** · Inventaires séparés par mode → 1228e45a / ebd721b.
- **2025-03-21 à 23** · Succès lus en base, chargements réorganisés (`services/progressService.js`) → c02bc683,
  c1d5f6da / 79febc3, fb4bfd4.
- **2025-03-27** · `achievementService` (APIOptimized) → 46994da5 / 5eb1c8d. Fin de la première période.

---

## Annexe A — Versions de la carte (`world_stock.map_version`)

| v | Taille | Date | PR | Migration |
|---|---|---|---|---|
| 1 | 14 × 14 | 10-03 | B #37 ↔ F #44 | — |
| 2 | 20 × 20 | 10-04 | B #46 ↔ F #62 | décorations décalées, quartiers offerts |
| 3 | 48 × 48 | 10-04 | B #50 ↔ F #67 | décorations rangées par quartier |
| 4 | 96 × 96 | 10-05 | B #75 ↔ F #104 | décalage du cœur (34, 26) |
| 5 | 144 × 144 | 10-07 | B #113 ↔ F #409 | × 1,5 (`scripts/scaleMap.js`) |

« v6 » n'est **pas** une version de carte. Le mot désigne la bible `HISTOIRE.md` v6 (F #151) et les îles qui
suivent son tutoriel : comptes neufs ou îles recommencées (`players.RESTARTED`, B #124, #128). Le reste se règle
par cohorte (`VETERAN_BEFORE`, B #80, #99), sans migration.

## Annexe B — Commits qui touchent `db/schema.sql` (41, back)

Ajouts idempotents (`IF NOT EXISTS`), appliqués par `npm run db:setup`, sauf mention contraire.

- **09-30 · B #1** : schéma initial reconstruit (`users`, `refresh_tokens`, `progress`, `game_data`, `timer_questions`,
  `achievements_list`, `customization_items`, `user_items`, `explorer_regions`, `user_regions`, `game_settings`).
- **10-01**
  - B #7 : `password_resets`. B #8 : `customization_items.achievement`.
  - B #9 : `coin_ledger`, `explorer_regions.coin_reward`, contrainte de non-négativité.
  - B #10 : `auth_sessions`. B #11 : `DROP TABLE refresh_tokens`. B #12 : `guest_players`, `play_runs`.
  - B #13 : `play_runs` (`level`, `category`, `deadline`, `paused_at`, `solved`, `solved_ids`).
  - B #14 : `play_runs.boss_hp` et `player_hp` (retirés par B #39).
- **10-03** : B #34 `world_tiles`, `progress.world_collected_at` ; B #35 `book_tries` ; B #37 `world_stock`,
  `world_buildings`, `world_runs`.
- **10-04**
  - B #38 : commentaires seulement. B #39 : **suppressions** (Explorer, 7 colonnes de `progress`,
    `chk_progress_coins`).
  - B #43 : `book_letters` ; B #45 : `book_letters.revealed`.
  - B #46 : `world_stock.map_version`, `world_zones` ; B #47 : `world_items`, `world_skins`.
  - B #50 : commentaire sur `map_version` ; B #51 : `world_quests` ; B #58 : `world_chests`, `world_items.source`.
- **10-05**
  - B #65 `world_annexes` ; B #67 `world_sign_names`, `world_sign_styles`, `world_signs`.
  - B #68 `world_games`, `world_game_runs` ; B #69 `world_friends` ; B #70 `world_names` ; B #71 `world_needs`.
  - B #72 `world_visitors` (+ `settled_at`, B #73) ; B #74 `world_crafts` (unique par case), `world_craft_runs`.
  - B #75 `world_expeditions` ; B #76 `world_landmarks` ; B #77 `world_finds`, `world_deposits`.
- **10-06** : B #106 `world_nights` ; B #107 `world_beasts`.
- **10-07**
  - B #108 `world_avatars` ; B #109 `world_stock.carry`.
  - B #112 `users.suspended_at`, `users.delete_at`, `email_changes` ; B #113 commentaire sur `map_version` (v5).
- **10-08** : B #117 `world_annexes.flip` et `look`, `world_crafts.flip` ; B #120 `world_avatars.choices`.

À partir du 10-08, les nouveaux états passent par `world_items` plutôt que par le schéma (B #123, #125, #126).
