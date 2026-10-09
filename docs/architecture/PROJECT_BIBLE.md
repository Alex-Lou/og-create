# PROJECT_BIBLE — Brumelune

Point d'entrée de la documentation technique. Vérifié contre le code : front `b47a53f2`, back `9cc7bfe` (2026-10-09).

**Règle d'or :** le code vérifié fait foi. Toute contradiction entre un document et le code se signale avant d'agir,
puis se corrige dans le document concerné et se note dans `DECISIONS.md` si elle change une règle.

---

## 1. Le système en une page

Jeu d'alchimie en français, mobile d'abord (PWA). Au lancement : l'écran de démarrage (2,5 s), puis l'île (un nouveau
visiteur y débarque après les scènes du naufrage ; `DECISIONS.md` D-004). Trois boucles : le **Grimoire** (mélanges, 827 éléments), l'**Épreuve**
(questions chronométrées), l'**Île** (île isométrique 144 × 144, bâtiments, quêtes, mini-jeux, habitants).

| Dépôt | Rôle | Défaut | Clone de travail |
|---|---|---|---|
| `Alex-Lou/og-create` | Jeu : Vue 3 (Options API), Vite 6, Canvas 2D, WebGL, PWA | `master` | `~/projects/og-create/frontend` |
| `Alex-Lou/Og-create-backend` | API : Express 4, PostgreSQL (SQL brut via `pg`) | `main` | `~/projects/og-create/Og-create-backend` |

```
Navigateur (PWA, sw.js)
   │  HTTPS, même origine, cookies httpOnly SameSite=Strict
   ▼
nginx (brumelune.eu) ── /            → fichiers statiques (/var/www/brumelune)
                     └─ /api/        → 127.0.0.1:3000
                                         │
                              Node / Express (systemd brumelune-api)
                                         │  SQL paramétré, transactions
                                         ▼
                                   PostgreSQL 16 (local au VPS, hypothèse : config non lue)
                              Gmail SMTP (contact, mot de passe, changement d'e-mail)
```

- **Le serveur fait autorité** sur tout gain : écus, ressources, recettes, île, coffres, scores. Le jeu affiche.
  La progression de l'Épreuve, autrefois écrite par le navigateur, est vérifiée depuis le lot R2 (`SECURITY.md` 3.1).
- Des règles sont **dupliquées à l'identique** front/back (jeux à grille, Récolte, mini-jeux) : voir
  `GAME_RULES.md` § 7 et `Og-create-backend/docs/architecture/BACKEND.md` § 6.
- Hébergement : VPS OVH (`deploy/ovh/`). Une configuration Render + Neon existe encore (`render.yaml`, `DEPLOY.md`).

## 2. Index de la documentation

**Bible technique (ce dossier et son jumeau côté serveur)**

| Document | Dépôt | Contenu |
|---|---|---|
| `PROJECT_BIBLE.md` | front | Ce fichier : vue d'ensemble, conventions, procédures sûres |
| `FRONTEND.md` | front | Structure Vue, état, localStorage, moteur de l'île, rendu, perf, tests |
| `GAME_RULES.md` | front | Règles chiffrées, économie, progression, leviers d'équilibrage, failles |
| `SECURITY.md` | front | Menaces, protections, faiblesses classées, secrets |
| `DECISIONS.md` | front | Décisions d'architecture et de méthode, justifiées |
| `CHANGELOG_TECH.md` | front | Changements techniques des deux dépôts |
| `BACKEND.md` | back | Couches, middlewares, limites, auth, services, configuration, tests |
| `API_CONTRACTS.md` | back | Les 92 routes, formats, erreurs, écarts front/back |
| `DATABASE.md` | back | 43 tables, contraintes, JSONB, cycle de vie des données |

**Documents existants (non dupliqués, toujours utiles)**

| Document | Contenu | État |
|---|---|---|
| `HISTOIRE.md` | Bible du game design : histoire, personnages, tutoriel | Référence design |
| `ETAT_DES_LIEUX.md` | État au 8 oct., feuille de route P1–P7, pièges | Partiellement périmé (voir § 5) |
| `PASSATION.md` | Passation, règles de travail historiques | Chiffres périmés (voir § 5) |
| `DEPLOY.md` | Render + Neon | Mentionne `vue.config.js` (n'existe plus) |
| `deploy/ovh/README.md` | Installation et mise à jour du VPS | Référence déploiement |
| `src/styles/README.md` | Organisation CSS | — |
| `design/conception/*.md` | Conception (mini-jeux, scènes) | **Lecture seule** (agent design) |
| `Og-create-backend/db/README.md` | Base, variables | À jour (règle JWT corrigée au lot R1) |

## 3. Conventions de code (constatées)

- **Front :** Options API + mixins ; un dossier par composant (`<Comp>/<Comp>.vue` + `.css`) ; logique pure dans
  `src/game`, `src/world`, `src/utils` (testée par Vitest) ; un seul client HTTP (`src/services/http.js`).
- **Back :** routes fines → services (SQL et règles) → `config/db.js` ; modules de règles purs, testables sans base ;
  chaque action de l'île en transaction avec verrou `stockOf(userId, conn, true)` (exceptions listées dans
  `BACKEND.md`).
- **Déterminisme :** décor et tournées via `hash(x, y)` et le jour ; graines pour les jeux ; aucun `Math.random` dans
  `src/world` (vérifié).
- **Perf :** `drawSoon()` plutôt que `draw()` ; toute minuterie, `requestAnimationFrame` et écouteur s'arrête au
  démontage.
- **Base :** `db/schema.sql` rejouable (`IF NOT EXISTS`), aucun outil de migration ; les nouveaux états vont souvent
  dans `world_items` pour éviter une migration.
- **Textes :** français ; une réplique ≤ 140 caractères (test).

## 4. Procédures sûres

### Vérifications avant toute livraison
| Dépôt | Commandes |
|---|---|
| Front | `npm run lint` · `npm test` · build **hors dépôt** : `npx vite build --outDir "$(mktemp -d /tmp/brume-build.XXXX)"` |
| Back | `npm run db:setup` puis `npm test` sur une **base de test isolée** (ci-dessous) |

### ⚠ Cette machine est le VPS de production
- Production : API dans `/srv/brumelune/og-create-backend` (systemd `brumelune-api`, port 3000), site dans
  `/var/www/brumelune`, variables dans `/etc/brumelune/` (**ne jamais lire**), Postgres 16 sur le port 5432.
  Un autre site (MemoCat) tourne aussi sur ce VPS.
- Les clones de travail (`~/projects/og-create/…`) sont **distincts** de `/srv` : y travailler n'affecte pas la prod.
- **Jamais** de test, de `db:setup` ou de script contre le Postgres du port 5432.
- Tests serveur : cluster Postgres **jetable**, sans écoute réseau, à basse priorité :
  ```bash
  PGT=$(mktemp -d /tmp/brume-pg.XXXX)
  /usr/lib/postgresql/16/bin/initdb -D "$PGT/data" -U origins --auth=trust -E UTF8
  /usr/lib/postgresql/16/bin/pg_ctl -D "$PGT/data" -l "$PGT/log" \
    -o "-c listen_addresses='' -c unix_socket_directories=$PGT -p 55432" -w start
  psql -h "$PGT" -p 55432 -U origins -d postgres -c "create database origins_test"
  export DB_HOST=$PGT DB_PORT=55432 DB_USER=origins DB_NAME=origins_test JWT_SECRET=<secret de test public de la CI>
  npm run db:setup && nice -n 15 node --test --test-concurrency=1 test/*.test.js
  /usr/lib/postgresql/16/bin/pg_ctl -D "$PGT/data" stop     # à la fin
  ```
- Le serveur de test choisit un port libre (`test/helpers.js`) : il ne gêne pas le port 3000.
- Vérifier avant tout lancement qu'aucune variable `DATABASE_URL` / `DB_*` de production n'est dans l'environnement.

### Git
- Aucun commit, push, merge, rebase sans accord explicite (protocole du 2026-10-09, voir `DECISIONS.md` D-001).
- Ordre de fusion quand les deux dépôts changent : **serveur d'abord, puis jeu**.
- Jamais `git reset --hard`, `git clean -fd`, push forcé ; jamais d'écriture dans `design/`.

## 5. Écarts connus entre documents et code (au 2026-10-09)

| Document | Affirmation | Réalité (code) |
|---|---|---|
| `PASSATION.md` (front) | Île 96 × 96 ; `WorldView.vue` ~900 lignes, 9 mixins | 144 × 144 ; 1035 lignes, 12 mixins |
| `PASSATION.md` (back) | `world.js` ~1700 lignes, à découper | 952 lignes, déjà découpé (`services/world/`) |
| `PASSATION.md` / `ETAT_DES_LIEUX.md` | Chemins locaux `/home/user/…` | `~/projects/og-create/{frontend,Og-create-backend}` |
| `ETAT_DES_LIEUX.md` § 1-2 | Feu vert permanent push/fusion sur CI verte | Remplacé par le protocole (D-001) |
| `ETAT_DES_LIEUX.md` § 5 | Travail en cours non fusionné | Probablement fusionné (B #128-129, F #483-485) — hypothèse |
| `ETAT_DES_LIEUX.md` § 7 | Mémoires `oc_*` toutes oubliées au « Recommencer » | Vrai depuis D-009 (2026-10-09) : toutes les clés `oc_*` sont oubliées |
| Commentaires `world.js:205`, `players.js:73`, `playService.js:110` | « Recommencer » une fois par compte | Illimité sauf `ISLAND_RESTART_ONCE=1` |
| `world.js:762` (commentaire) | Le bonus d'un achat ne vaut que pour la suite | L'article est inséré avant l'encaissement (`world.js:773-775`) |
| `DEPLOY.md:57` | `vue.config.js` | `vite.config.mjs` |

## 6. Mesures de référence (2026-10-09)

- Front : lint OK ; Vitest 78 fichiers, **415/415** ; build OK. Chunks : `WorldView` 1,51 Mo (364 Ko gzip),
  `index` 1,24 Mo (268 Ko gzip) ; `dist` ≈ 79 Mo.
- Back : **216/216** (≈ 2 min, concurrence 1, Postgres jetable).
- Après les lots du 2026-10-09 : back **243/243** (branche `feat/journal-erreurs`, par-dessus `fix/jeu-economie`) ; front **426/426**, lint et build OK
  (branche `feat/journal-erreurs`, par-dessus `feat/splash-ile`).
- Voir les erreurs du jeu en production : `journalctl -u brumelune-api | grep -A8 "Erreur du jeu"`.
- Non mesuré : performances sur vrai téléphone, couverture de code, `npm audit`.

## 7. Entretien de cette bible

- Tout changement de route, de table, de règle chiffrée ou de sécurité met à jour le document concerné **dans le même
  lot**, avec son en-tête « Vérifié contre le code : <sha> ».
- Une entrée dans `CHANGELOG_TECH.md` par changement technique significatif ; une entrée dans `DECISIONS.md` par choix
  structurant.
