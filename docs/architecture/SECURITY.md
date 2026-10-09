# Sécurité — BRUMELUNE (front, API, VPS OVH)

Vérifié contre le code : backend 9cc7bfe, front b47a53f2 (2026-10-09)

- `back/` = dépôt Og-create-backend, `front/` = dépôt frontend (ce dépôt).
- Seuls les fichiers des dépôts ont été lus : ni la config réelle du VPS, ni les secrets, ni la base.
- « (hypothèse) » = déduction non vérifiée sur une machine en marche.

---

## 1. Périmètre et modèle de menace

### Ce qu'on protège

| Bien | Où il vit | Pourquoi c'est important |
|---|---|---|
| Comptes (e-mail, empreinte bcrypt, sessions) | `users`, `auth_sessions` (`back/db/schema.sql:15-57`) | Prise de compte |
| Intégrité des écus et de la progression | `progress`, `coin_ledger` (`back/db/schema.sql:232-240`) | Triche, économie du jeu |
| E-mails / données perso (RGPD) | `users.email`, `email_changes`, export | Fuite, énumération |
| Disponibilité | 1 process Node, 1 Postgres, 1 VPS partagé avec MemoCat (`front/deploy/ovh/README.md:3`) | Le jeu tombe |

### Acteurs

| Acteur | Ce qu'il peut faire |
|---|---|
| Anonyme | Routes publiques : `/api/health`, `/api/achievements`, `/api/game-data`, contact, mot de passe oublié |
| Invité | Cookie `oc_guest` (`back/src/services/players.js:9-49`) : carnet de l'Infini, Épreuve |
| Joueur | Cookies `oc_access` / `oc_refresh` : île, Grimoire, écus, réglages du compte |
| Tricheur | Modifie le client, rejoue/forge des requêtes avec sa propre session |
| Attaquant | Force brute, vol de session, CSRF, énumération, déni de service, attaque du VPS |

### Frontières de confiance

```
Navigateur ──HTTPS──> Nginx (TLS, fichiers, /api) ──HTTP 127.0.0.1:3000──> Node/Express ──> PostgreSQL local
                                                                         └──SMTP──> Gmail
```

- Même origine pour le site et `/api` : obligatoire pour les cookies `SameSite=Strict` (`front/deploy/ovh/nginx/brumelune.eu.conf:1-2`, `front/render.yaml:12-20`).
- Tout ce qui vient du navigateur est non fiable ; seul le serveur décide des gains (`back/src/services/players.js:1-2`, `back/src/services/ledger.js:1-3`).

---

## 2. Protections en place (vérifiées)

| Menace | Protection | Où | Limite |
|---|---|---|---|
| Vol de jeton par XSS | Cookies `httpOnly`, aucun jeton lisible en JS ; le front ne garde que `userId`/`username` | `back/src/services/authSession.js:19-27`, `front/src/services/session.js:14-16` | Un XSS peut quand même agir *avec* la session |
| Cookie envoyé hors du site | `SameSite=Strict` ; `secure` si `NODE_ENV=production` | `back/src/services/authSession.js:22-23` | `secure` dépend de `NODE_ENV` |
| Portée du refresh | `oc_access` sur `/api`, `oc_refresh` sur `/api/auth` seulement | `back/src/services/authSession.js:75-76` | — |
| Vol du refresh | Rotation à chaque usage, empreinte SHA-256 seule en base, réutilisation ⇒ toute la famille supprimée | `back/src/services/authSession.js:86-111`, `back/src/utils/crypto.js:5-7` | Fenêtre de 10 s tolérée (`AUTH_RACE_SECONDS`, l. 14) |
| JWT forgé / `alg` | HS256 imposé à la signature et à la vérification, `typ: 'access'` vérifié, 15 min | `back/src/services/authSession.js` (`signAccess`, `verifyAccess`, `checkAccess`) | Session vérifiée en base à chaque accès depuis le lot R4 (3.4) |
| Force brute / fuite d'empreintes | bcrypt coût 12 ; 8 car. min, 72 octets max | `back/src/services/accounts.js:6,15-20` | — |
| Énumération par la durée au login | Comparaison bcrypt contre une empreinte factice si l'e-mail est inconnu | `back/src/services/accounts.js:7-8,38-43` | Pas au mot de passe oublié (voir 3.5) |
| CSRF | SameSite=Strict + en-tête `X-Requested-With: origins` exigé sur toute écriture `/api` | `back/src/app.js:43-47`, `front/src/services/http.js:7-11` | Les GET ne sont protégés que par SameSite |
| CORS | `CORS_ORIGIN` = l'origine du jeu en prod | `back/src/app.js:29-35`, `front/deploy/ovh/api.env.example:14` | Défaut `*` si absent (3.13) |
| En-têtes API | helmet (CSP, nosniff, anti-framing…) | `back/src/app.js:18-27` | Ne couvre que les réponses JSON, pas les pages |
| Corps énormes | `express.json` / `urlencoded` limités à 10 ko | `back/src/app.js:49-53` | — |
| Injection SQL | Requêtes paramétrées (`$1…`) ; les 13 interpolations `${}` repérées sont des constantes ou des listes fermées (détail ci-dessous) | `back/src/config/db.js:35-63` | À revérifier à chaque nouvelle requête |
| Triche sur le jeu | Le serveur calcule les mélanges ; ingrédients exigés « en main » | `back/src/routes/play/index.js:47-73` (l. 58) | Progression de l'Épreuve : voir 3.1 |
| Double gain / course | `coin_ledger` UNIQUE `(user_id, reason, ref)` + `ON CONFLICT DO NOTHING` ; débits conditionnels en transaction | `back/db/schema.sql:239`, `back/src/services/ledger.js:8-49` | Les débits sans `ref` ne sont pas dédupliqués (voulu) |
| Achat concurrent | Transaction : `user_items` puis débit `coins >= prix` | `back/src/services/customization.js:47-59` | — |
| Succès forgés | Recalculés côté serveur depuis le carnet, ligne verrouillée `FOR UPDATE` | `back/src/services/achievementService.js:38-60` | Seule la date vient du client |
| Exécution de code | Conditions de succès lues par regex, jamais `eval` | `back/src/utils/achievementCondition.js:6-23` | — |
| Liens par e-mail | Jetons 32 octets aléatoires, empreinte seule, usage unique (`DELETE … RETURNING` en transaction), 30 min (mot de passe) / 60 min (adresse) | `back/src/services/passwordReset.js:10,20-26,38-49`, `back/src/services/accountSettings.js:12,75-79,101-113` | Jeton visible dans l'URL du mail |
| Énumération au mot de passe oublié | Réponse identique, erreurs avalées, rien pour les comptes provisoires | `back/src/routes/passwordReset.js:11,17-27`, `back/src/services/passwordReset.js:16-18` | Durée de réponse différente (3.5) |
| Reset ⇒ sessions | Le reset et le changement de mot de passe ferment toutes les sessions | `back/src/services/passwordReset.js:45`, `back/src/services/accountSettings.js:58-63` | Le JWT d'accès tombe aussitôt (lot R4) |
| Actions sensibles | Mot de passe actuel exigé (mot de passe, adresse, suppression) | `back/src/services/accountSettings.js:57,71,133` | Pause du compte : sans mot de passe |
| RGPD : export | Toutes les tables à `user_id`, sans empreintes ni tables de jetons ; nom de table filtré par regex | `back/src/services/accountSettings.js:18,164-178` | — |
| RGPD : effacement | Suppression à J+7, balayage horaire, `ON DELETE CASCADE` ; invités purgés à 30 j | `back/src/services/accountSettings.js:13,129-161`, `back/src/server.js:24-28`, `back/src/services/players.js:42` | Sauvegardes gardées 14 j (3.2) |
| Jeton du lien dans l'URL | Le front vérifie `^[a-f0-9]{64}$` et efface `?reset` / `?email` de l'URL | `front/src/components/App/App/account.js:28-36` | — |
| Fuite par Referer | `Referrer-Policy: strict-origin-when-cross-origin` | `front/deploy/ovh/nginx/brumelune.eu.conf:51` | — |
| HTTP en clair | Redirection 301 vers HTTPS, HSTS 1 an, TLS 1.2/1.3 | `front/deploy/ovh/nginx/brumelune.eu.conf:16-18,40,49` | Pas de `includeSubDomains`/preload |
| IP du joueur | Nginx ajoute `$remote_addr` à X-Forwarded-For ; `TRUST_PROXY_HOPS=1` | `front/deploy/ovh/nginx/brumelune.eu.conf:61-69`, `front/deploy/ovh/api.env.example:17-18` | Voir 3.3 |
| Compromission du process Node | systemd : utilisateur dédié, `NoNewPrivileges`, `ProtectSystem=strict`, `ProtectHome`, `PrivateTmp`, `MemoryMax=512M` | `front/deploy/ovh/systemd/brumelune-api.service:10-23` | Pas de `CapabilityBoundingSet`, `RestrictAddressFamilies`, `SystemCallFilter` |
| Fichier de secrets | `/etc/brumelune/api.env` en `root:brumelune 640` | `front/deploy/ovh/README.md:186-189` | (hypothèse) appliqué tel quel sur le VPS |
| Code du VPS | Clés de déploiement GitHub en lecture seule, une par dépôt | `front/deploy/ovh/README.md:152-173` | — |
| Perte de données | `pg_dump` quotidien, dossier `700`, 14 jours | `front/deploy/ovh/backup.sh:7-11`, `front/deploy/ovh/README.md:236-237` | Même machine (3.2) |
| Cache partagé | Le service worker n'intercepte ni l'API ni les autres origines | `front/public/sw.js:4,36` | — |

### Limites de requêtes (express-rate-limit, mémoire du process)

| Route | Plafond | Clé | Où |
|---|---|---|---|
| Tout `/api` | 1000 / 15 min | IP | `back/src/app.js:39-41` |
| `/progress`, `/achievements`, `/coins`, `/game-data` | 200 / min | IP | `back/src/app.js:40,58-64` |
| `POST /auth/login` | 10 / 15 min | IP **et** e-mail visé | `back/src/routes/auth.js:20-27` |
| `/auth/register`, `/provisional`, `/claim` | 10 / h (compteur partagé) | IP | `back/src/routes/auth.js:29` |
| `/auth/refresh` | 60 / 15 min | IP | `back/src/routes/auth.js:30` |
| Mot de passe oublié / reset | 5 et 10 / 15 min | IP | `back/src/routes/passwordReset.js:15-29` |
| Compte : mot de passe, adresse, suppression, export | 10 / 15 min | compte | `back/src/routes/account.js:16` |
| Confirmation d'adresse | 10 / 15 min | IP | `back/src/routes/account.js:17` |
| Contact | 5 / h | IP | `back/src/routes/contact.js:13` |
| `/timer`, `/progress` | 120 / min | compte | `back/src/routes/timer.js:9`, `back/src/routes/progress.js:9` |
| `/play` | 600 / min IP ; 120 / min joueur ; 20 invités / h IP | mixte | `back/src/routes/play/shared.js:19-27`, `back/src/routes/play/index.js:12` |

### SQL : interpolations `${}` auditées

| Fichier:ligne | Valeur interpolée | Sûr ? |
|---|---|---|
| `back/src/services/accountSettings.js:174` | nom de table d'`information_schema`, filtré `^[a-z_]+$` (l. 173) | Oui |
| `back/src/services/world/migrate.js:100-112` | liste de tables en dur | Oui |
| `back/src/services/world/nights.js:143` | `'stone'`/`'wood'` (`back/src/services/nights.js:179`) | Oui |
| `back/src/services/world/people.js:250` | `resource` vérifié par liste (l. 225) | Oui |
| `back/src/services/world/people.js:339` | `r.resource` vérifié par liste (l. 334) | Oui |
| `back/src/services/world/people.js:164`, `reads.js:92,157` | constante `PLAYED` (`reads.js:155`), `' FOR UPDATE'` | Oui |
| `back/src/services/world.js:228,683` | `ISLAND_TABLES` (l. 212), fragment constant | Oui |

Aucune concaténation de saisie utilisateur dans du SQL n'a été trouvée.

---

## 3. Faiblesses connues (classées)

Échelle : **Moyenne** = exploitable par un joueur ou risque de perte réelle ; **Faible** = impact limité ou conditions rares ; **Info** = à savoir.

### 3.1 Moyenne — Progression de l'Épreuve écrite par le client (b : confirmé)

- `POST /timer/update-timer-progress` et `POST /progress/save` fusionnent l'objet envoyé tel quel (`back/src/routes/timer.js:19-27`, `back/src/services/progress.js:19-23`, `back/src/services/timerProgress.js:9-17,34-43`).
- Aucune vérification des clés, des identifiants de questions ni de la taille ; rien n'est jamais retiré (fusion).
- Impact jeu : le nombre de questions « réussies » ouvre le palier I des créations (`back/src/services/world/creations.js:59-63,105,133`, `back/src/services/crafts.js:20,168`). Un tricheur l'ouvre sans jouer.
- Impact disponibilité : jusqu'à 10 ko ajoutés par requête, 120 req/min par compte ⇒ JSONB qui grossit sans fin, relu et réécrit à chaque appel (hypothèse sur l'ampleur).
- Une valeur non itérable dans `unlockedCategories` ⇒ `TypeError` ⇒ 500 (`timerProgress.js:13-14`).
- Les écus et records, eux, restent serveur (`back/src/services/trial.js:92,107-108`).

### 3.2 Moyenne — Sauvegardes et déploiement (m : confirmé)

- Les dumps restent sur le VPS (`front/deploy/ovh/backup.sh:7,10`) : pas de copie ailleurs, pas de chiffrement. Disque perdu = tout perdu.
- Les comptes effacés restent jusqu'à 14 jours dans les dumps (`backup.sh:11`) : à mentionner dans la politique RGPD (hypothèse juridique).
- `deploy.sh` applique `db/setup.js` à chaque déploiement, sans sauvegarde préalable (`front/deploy/ovh/deploy.sh:31-38`) ; `schema.sql` contient des `DROP TABLE` (`back/db/schema.sql:40`).
- L'utilisateur de l'API possède la base (`front/deploy/ovh/README.md:141`) : le process en ligne a les droits DDL (hypothèse : même `DATABASE_URL` pour les deux, `deploy.sh:35-36`).
- `npm ci` + build lancés par l'administrateur sudoer (`deploy.sh:20-21,33`) : un paquet compromis s'exécute avec ses droits (hypothèse).

### 3.3 Moyenne (selon pare-feu) — IP du joueur falsifiable (m : confirmé dans le code)

- Node écoute sur toutes les interfaces (`back/src/server.js:12`, pas d'hôte), alors que Nginx vise `127.0.0.1:3000`.
- `trust proxy` vaut au moins 1 : `Number(...) || 1` empêche de mettre 0 (`back/src/app.js:11`).
- Si le port 3000 est joignable de l'extérieur, un client envoie son propre `X-Forwarded-For` ⇒ toutes les limites par IP sautent. Le README active `ufw` (`front/deploy/ovh/README.md:119-121`) ; état réel non vérifié.
- Render = 2 sauts (`front/render.yaml:45-47`), OVH = 1 (`api.env.example:18`). Copier 2 sur OVH rendrait l'IP falsifiable même via Nginx.
- express-rate-limit 7.5.0 (`back/package.json:20`, version installée) ne regroupe pas les adresses IPv6 par /64 ; Nginx écoute en IPv6 (`brumelune.eu.conf:35`) ⇒ contournement facile pour qui a un préfixe IPv6 (hypothèse sur l'exploitation).

### 3.4 Corrigé (lot R4, 2026-10-09) — JWT d'accès valable 15 min après coupure (d)

- Avant : `authMiddleware` et `players.resolve` ne vérifiaient que la signature ; après une déconnexion, un changement de mot de passe, une pause ou une suppression, un autre appareil (ou un voleur de cookie) gardait l'accès jusqu'à 15 min. Reproduit par 4 tests qui échouent sur l'ancien code.
- Maintenant : le jeton porte sa famille de session (`sid`) ; `checkAccess` (`back/src/services/authSession.js`) exige que cette session existe pour ce compte, non révoquée, non expirée. Branché sur `authMiddleware` et `players.resolve`. Coût : une requête indexée (`idx_auth_sessions_family`) par requête connectée (non mesuré en charge).
- Transition : un jeton sans `sid` n'est accepté que s'il a été signé avant le démarrage du processus (≤ 15 min de tolérance après un déploiement).
- Limite assumée : une rotation garde la famille ; l'ancien jeton d'accès de la même session vit jusqu'à son expiration. `verifyAccess` (sans base) ne sert plus qu'à nommer le joueur pour les limites de requêtes.
- Tests : `back/test/session.test.js` (5 tests ajoutés).

### 3.5 Faible à moyenne — Énumération des e-mails (m : confirmé)

- Inscription : « Email ou username déjà utilisé » si l'adresse existe (`back/src/routes/auth.js:50`, `back/src/services/accounts.js:28-29`). 10 essais/h/IP.
- Mot de passe oublié : la réponse attend l'écriture en base et l'envoi SMTP seulement si le compte existe (`back/src/routes/passwordReset.js:21`, `back/src/services/passwordReset.js:18-32`) ⇒ écart de durée mesurable (hypothèse sur l'ampleur).
- Changement d'adresse : 409 « déjà prise » (`back/src/services/accountSettings.js:73-74`), derrière mot de passe et limite par compte.

### 3.6 Faible à moyenne — Pages sans CSP ni anti-framing ; Google Fonts (j : confirmé)

- Nginx n'envoie que HSTS, nosniff, Referrer-Policy (`front/deploy/ovh/nginx/brumelune.eu.conf:49-51`) : ni `Content-Security-Policy`, ni `frame-ancestors` / `X-Frame-Options` sur la page du jeu.
- Pas de XSS repéré (un seul `innerHTML`, sur des données serveur, nom passé en `textContent` : `front/src/book/fx.js:24-29`), donc la CSP manque comme défense en profondeur.
- Clickjacking possible sur la page (hypothèse) ; les actions graves demandent le mot de passe, pas la pause (`back/src/routes/account.js:66`).
- Polices chargées depuis Google (`front/index.html:16-18`) : IP des joueurs transmise à un tiers (hypothèse RGPD) ; une future CSP devra autoriser ces domaines et le script en ligne (`front/index.html:78-88`).

### 3.7 Faible — Casse des e-mails incohérente (c : confirmé)

- Inscription et connexion : `email = $1` (`back/src/services/accounts.js:28,39`) ; contrainte `UNIQUE` sensible à la casse (`back/db/schema.sql:17`).
- Mot de passe oublié, changement d'adresse, signature : `LOWER()` (`back/src/services/passwordReset.js:16`, `back/src/services/accountSettings.js:73,107`, `back/src/services/accounts.js:74`).
- Conséquences : `Alice@x.fr` et `alice@x.fr` = deux comptes ; connexion refusée si la casse diffère ; le reset choisit une ligne au hasard parmi les doublons (`rows[0]`). La limite par compte, elle, met en minuscules (`back/src/routes/auth.js:25`).
- L'inscription ne fait pas `trim()` ni contrôle de longueur (> 255 ⇒ 500) (`back/src/routes/auth.js:43-45`).

### 3.8 Faible — Limites en mémoire (i : confirmé)

- Aucun `store` configuré (`back/src/middleware/rateLimit.js:5-14`) : compteurs perdus à chaque redémarrage (déploiement, `Restart=always` : `brumelune-api.service:15`).
- Une exception non rattrapée arrête le process (`back/src/server.js:30-38`) ⇒ remise à zéro.
- Un seul process aujourd'hui (`ExecStart` simple) : à revoir si on en lance plusieurs.

### 3.9 Corrigé (lot R1, 2026-10-09) — Amorçage du secret JWT (a)

- Avant : un secret généré n'était écrit que dans `.env`, pas dans `process.env` ⇒ connexions en 500 jusqu'au redémarrage (reproduit), pages du Livre sur la clé de secours ; un secret court chargé par dotenv servait pour l'exécution ; règles 32 / 64 incohérentes.
- Maintenant (`back/src/utils/jwt.js`) : 32 caractères minimum partout ; secret du `.env` repris s'il est valable, sinon régénéré ; `process.env.JWT_SECRET` toujours renseigné avant le démarrage. Tests : `back/test/jwt.test.js`.
- Inchangé : sans secret valable dans l'environnement ni `.env`, l'API refuse de démarrer (échec franc, cas OVH/Render).

### 3.10 Faible — Inscription concurrente et pseudo tiré au sort (f : confirmé)

- Vérification puis `INSERT` hors transaction (`back/src/services/accounts.js:26-34`) : deux inscriptions simultanées ⇒ violation d'unicité ⇒ 500 générique (`back/src/routes/auth.js:55-57` ; seul `/claim` traite `23505`, l. 92).
- Pseudo = début de l'e-mail + 4 chiffres (`accounts.js:23`) : collision fréquente pour `contact@…` etc. ⇒ refus « Email ou username déjà utilisé » trompeur.

### 3.11 Faible — Identifiants de pages liés à `JWT_SECRET` (g : confirmé)

- HMAC clé = `JWT_SECRET`, sinon la constante en dur du fichier (`back/src/services/bookPages.js:37`) : sans secret, les identifiants deviennent calculables (nom d'élément retrouvable).
- Changer `JWT_SECRET` change tous les identifiants : l'Encre déjà payée (`ref` = id de page, `back/src/routes/play/book.js:22,41`) et les essais (`back/src/services/bookTries.js:8`) ne correspondent plus (hypothèse : à re-payer).

### 3.12 Faible — Routes exposées sans usage dans le front (k : confirmé)

- Aucun appel front à `/auth/provisional`, `/auth/claim`, `/coins/balance`, `/progress/save` (recherche dans `front/src`, seul `/auth/${endpoint}` = login/register : `front/src/services/authService.js:17-18`).
- `/auth/provisional` crée de vrais comptes (bcrypt coût 12) à 10/h/IP (`back/src/routes/auth.js:62-74`) ; purge à 30 j (`back/src/services/accounts.js:85-95`).
- `/progress/save` est une seconde porte vers 3.1 (`back/src/services/progress.js:21`).
- L'inscription accepte une adresse `@provisoire.invalid` (pas de contrôle, `back/src/routes/auth.js:45`, contrairement à l. 80).

### 3.13 Faible — CORS `*` par défaut (e : confirmé, peu exploitable)

- `origin: CORS_ORIGIN || '*'` avec `credentials: true` (`back/src/app.js:30,33`).
- Les navigateurs refusent les cookies avec `*`, et SameSite=Strict les bloque déjà : seules les lectures publiques deviennent lisibles d'ailleurs. Piège de configuration (DEPLOY.md le signale : `front/DEPLOY.md:22`).

### 3.14 Faible — Autres points (m)

| Point | Où | Note |
|---|---|---|
| Blocage ciblé : 10 mauvais mots de passe sur l'e-mail d'un joueur bloquent sa connexion 15 min, depuis n'importe quelle IP | `back/src/routes/auth.js:22-27` | Déni de service ciblé |
| Limite par joueur contournée en inventant des cookies `oc_guest` (non vérifiés pour la clé) | `back/src/routes/play/shared.js:19-24` | Reste la limite par IP |
| Pas de durée maximale de session (chaque rotation repart pour 30 j) ; lignes `auth_sessions` révoquées/expirées jamais purgées | `back/src/services/authSession.js:12,70-76,108` | Table qui grossit |
| Changement d'adresse : pas d'avis à l'ancienne adresse, sessions gardées | `back/src/services/accountSettings.js:101-113` | — |
| Liens des mails vers l'ancien domaine Render si `APP_URL` manque | `back/src/services/passwordReset.js:12`, `back/src/services/accountSettings.js:16` | — |
| `secure` des cookies seulement si `NODE_ENV=production` | `back/src/services/authSession.js:22`, `back/src/services/players.js:16` | Mis dans `api.env.example:3` |
| Workflows sans bloc `permissions:`, actions par tag | `front/.github/workflows/ci.yml:1-20`, `back/.github/workflows/ci.yml:1-36` | — |

### 3.15 Info

- **(h) Conditions de succès publiques** (confirmé) : `GET /achievements` sans session renvoie `condition` (`back/src/routes/achievements.js:9-17`, `back/src/services/achievementService.js:13`) ⇒ noms d'éléments dévoilés. Le front s'en sert (`front/src/utils/achievementChecker.js:28`).
- **(l) `transporter.verify()` au chargement** (confirmé) : connexion SMTP Gmail à chaque démarrage, objet d'erreur complet dans le journal (`back/src/config/emailConfig.js:3-18`). Ne bloque pas le démarrage ; sans `EMAIL_*`, les mails échouent en silence (`back/src/routes/passwordReset.js:22-25`).
- **Journaux** : niveau `warn` par défaut en prod (`back/src/server.js:6`), identifiants seulement (`userId`). Mais `DB_LOG_LEVEL=DEBUG` écrit les paramètres SQL (e-mails, empreintes) (`back/src/config/db.js:51,60`) ; morgan écrit les URL ≥ 400 (`back/src/app.js:14-16`) ; chaque 404 est journalisé et renvoie le chemin (`app.js:72-73`) ; rejet non géré écrit en entier (`server.js:31`).
- **Fuites d'erreurs** : détail technique seulement en `development` (`back/src/utils/failure.js:6`, `back/src/app.js:80-83`). `/api/health` dit `NODE_ENV` (`app.js:68`).
- Nginx n'a pas `server_tokens off` (version affichée) ni de `limit_req` (`front/deploy/ovh/nginx/brumelune.eu.conf`, absent).
- Inscription sans vérification de l'adresse : on peut inscrire l'e-mail d'autrui (squat) (`back/src/routes/auth.js:42-58`).

---

## 4. Gestion des secrets

### Où ils vivent (noms seulement)

| Secret | Production OVH | Render (ancien) | Local / CI |
|---|---|---|---|
| `JWT_SECRET` | `/etc/brumelune/api.env` (`api.env.example:9-11`) | `generateValue` (`render.yaml:48-49`) | `.env` ignoré (`back/.gitignore:5`) ; secret de test public dans la CI |
| `DATABASE_URL` (mot de passe Postgres) | `api.env` (`api.env.example:6-7`) | `sync: false` (`render.yaml:40-41`) | `DB_*` ou `.env` (`back/src/config/db.js:11-19`) |
| `EMAIL_USER`, `EMAIL_PASSWORD` (Gmail) | `api.env`, facultatif (`api.env.example:20-22`) | `sync: false` (`render.yaml:51-54`) | — |
| Clé TLS | `/etc/letsencrypt/live/brumelune.eu/` (`brumelune.eu.conf:38-39`) | — | — |
| Clés de déploiement SSH | `~/.ssh/brumelune_*` de l'admin (`README.md:155-161`) | — | — |

- Chargement : systemd `EnvironmentFile` (`brumelune-api.service:13`), aussi passé à `db/setup.js` (`deploy.sh:35-37`).
- Le front n'a aucun secret : seule `VUE_APP_API_URL` (`front/.gitignore:6-9`, `front/render.yaml:14-15`).
- Changer `JWT_SECRET` déconnecte tout le monde (`api.env.example:9-10`) **et** change les identifiants de pages (3.11).

### Historique git (recherche en lecture seule, toutes branches locales)

Commandes : `git log --all -S<motif>` puis lecture masquée des lignes ; 228 commits (back), 1108 (front).
Motifs : `JWT_SECRET=`, `JWT_SECRET:`, `EMAIL_PASSWORD=`, `EMAIL_PASSWORD:`, `DB_PASSWORD=`, `postgres://`, `postgresql://`, `PRIVATE KEY`, `BEGIN RSA/OPENSSH`, `neon.tech`, `npg_`, `ghp_`, `github_pat_`, `AKIA`, `sk_live`, `supabase.co`, `pass: '…'`. Plus la liste de tous les fichiers jamais versionnés (`.env`, `*.pem`, `*.key`…).

| Dépôt | Commit | Fichier | Verdict |
|---|---|---|---|
| back | d216665 | `.github/workflows/ci.yml` | Secret de test CI + base de test locale : connus, sans valeur |
| back | fb3c32b | `PASSATION.md` | Même secret CI et même base de test |
| back | af2d45e | `db/README.md` | Exemple générique (`user:motdepasse@hote`) |
| back | 567e3ea | `src/utils/jwt.js` | Code (`JWT_SECRET=${...}`), pas de valeur |
| back | 26a61ec | `src/config/emailConfig.js` | `process.env.*`, pas de valeur |
| front | aac2b096, 8863637b, 9b942d1c | `PASSATION.md`, `ETAT_DES_LIEUX.md`, `outils/banc/*.cjs` | Secret CI identique à celui de la CI ; base de test locale |
| front | 39beadf0 | `deploy/ovh/api.env.example`, `README.md` | Gabarits « À REMPLACER » |
| front | dddcddd4, ca37331c | `DEPLOY.md`, `render.yaml` | Chaîne Neon élidée (`…`), noms de variables |
| front | 95c9b62a → 7e53dedd | `.env` | Versionné puis retiré : seulement `VUE_APP_API_URL` (public) |

**Résultat : aucun secret réel trouvé dans l'historique des deux dépôts.** Limites : branches distantes non récupérées et objets non référencés non examinés ; motifs non exhaustifs (pas d'outil type gitleaks).

---

## 5. Règles pour les futurs changements

- [ ] Toute nouvelle route qui écrit : sous `/api`, méthode non-GET (contrôle CSRF `back/src/app.js:44-47`), `authMiddleware` si compte requis.
- [ ] Pas d'effet de bord sensible sur un GET.
- [ ] SQL : toujours `$1…`. Un `${}` seulement pour une constante ou une valeur passée par une liste fermée, avec un commentaire.
- [ ] Le client ne fixe jamais un gain, un solde, un score ni un déblocage : le serveur recalcule. Ne pas reproduire le modèle `timerProgress` (3.1).
- [ ] Écus : passer par `ledger.credit/debit/debitOnce` avec une `ref` unique, dans la transaction de l'action.
- [ ] Lecture puis écriture d'une même ligne : transaction + `FOR UPDATE`.
- [ ] Valider type, longueur et liste blanche de chaque champ (modèle : `NAME`, `PAGE` de `back/src/routes/play/shared.js:14-15`).
- [ ] E-mails : normaliser (`trim` + minuscules) partout, ou index `UNIQUE (LOWER(email))` (3.7).
- [ ] Jetons : `newToken()` + `digest()` (`back/src/utils/crypto.js`), usage unique, durée courte, jamais en clair en base ni dans les logs.
- [ ] Toute route qui ouvre un accès passe par `authMiddleware` ou `players.resolve` (donc `checkAccess`) ; jamais `verifyAccess` seul (3.4).
- [ ] Nouvelle limite : choisir la clé (IP, compte) et vérifier l'effet de `TRUST_PROXY_HOPS`.
- [ ] Ne jamais logguer e-mail, mot de passe, jeton, corps de requête ; garder `log('info', …, { userId })`.
- [ ] Réponses d'erreur : message générique, détail seulement en `development` (`failure()`).
- [ ] Front : pas de `v-html` / `innerHTML` avec une donnée joueur ; `textContent` sinon.
- [ ] Nouvelle table liée au joueur : colonne `user_id` + `ON DELETE CASCADE` (export et effacement RGPD automatiques) ; si elle contient des jetons, l'ajouter à `SECRET_TABLES` (`back/src/services/accountSettings.js:18`).
- [ ] `schema.sql` : rien de destructif sans sauvegarde manuelle avant `deploy.sh` (3.2).
- [ ] Ne pas réutiliser `JWT_SECRET` pour autre chose ; un futur secret = une nouvelle variable.
- [ ] Nginx : tout `add_header` dans une `location` efface ceux du serveur (`brumelune.eu.conf:47-48`).
- [ ] Nouvelle dépendance : `npm audit` et lecture du changelog avant fusion.

---

## Non examiné

- Configuration réelle du VPS : `/etc/brumelune/api.env`, `/etc/nginx/*`, unités systemd installées, cron, `/srv`, `/var/www`.
- Pare-feu réel (`ufw`), ports ouverts (3000, 5432), conteneurs Docker de MemoCat et leur isolement.
- SSH (clés, mot de passe désactivé ?, fail2ban), comptes sudo, mises à jour automatiques de l'OS.
- Authentification Postgres sur le serveur (`pg_hba.conf`), droits réels de l'utilisateur `brumelune`, TLS local.
- Restauration effective d'une sauvegarde ; droits des fichiers `.dump`.
- Journaux réels (journald, `access.log` de Nginx : `?reset=` probablement écrit, hypothèse) et leur durée de garde.
- Compte Gmail (mot de passe d'application, 2FA), DNS (DNSSEC, CAA), renouvellement Let's Encrypt.
- Paramètres du dépôt GitHub (protection de branches, secrets Actions, droits du jeton).
- CVE des dépendances : **`npm audit` n'a pas été lancé** (ni back ni front).
- `back/src/services/world*.js` et `back/src/routes/play/world.js` : seulement l'usage SQL et l'écriture des écus ; la logique de jeu détaillée n'a pas été auditée.
- Composants Vue un par un (seule une recherche de `v-html`/`innerHTML`/`eval` a été faite) ; `front/deploy/ovh/nginx/memocat.fr.conf`.
- Tests automatiques (`back/test/*`, `front/tests/*`) : non lancés.
