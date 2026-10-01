# Déploiement (gratuit) : Render + Neon

| Brique | Hébergeur | Remarque |
|---|---|---|
| Front (Vue, statique) | Render Static Site | gratuit, pas de mise en veille |
| API (Express) | Render Web Service (free) | s'endort après 15 min d'inactivité, ~1 min pour se réveiller |
| PostgreSQL | Neon (ou Supabase) | gratuit sans expiration (la base gratuite Render est supprimée après 30 j) |

## 1. Base de données (Neon)

1. Créer un projet sur neon.tech (seul « Postgres database » activé), copier la chaîne de connexion
   jusqu'à `?sslmode=require` (retirer `&channel_binding=require`).
2. Rien d'autre : l'API applique schéma + contenu du jeu à chaque build Render (`npm run db:setup`,
   idempotent, sans toucher aux comptes ni à la progression).
   Manuellement si besoin (depuis `og-create-backend`) : `DATABASE_URL="…" npm run db:setup`.

## 2. Render (Blueprint)

1. Render → **New → Blueprint** → choisir ce dépôt (`render.yaml` est à la racine).
2. Renseigner les variables demandées :
   - `DATABASE_URL` : la chaîne Neon.
   - `CORS_ORIGIN` : l'URL du front, ex. `https://og-create.onrender.com` (sans slash final, jamais `*`).
   - `EMAIL_USER` / `EMAIL_PASSWORD` : facultatifs (formulaire de contact).
   - `JWT_SECRET` est généré par Render (32 caractères au moins).
3. **Le site relaie l'API** : la règle de réécriture `/api/*` → `https://<api>.onrender.com/api/*` (dans
   `render.yaml`, avant la règle `/*`) fait que le navigateur ne parle qu'à l'adresse du site. Les sessions
   reposent sur des cookies httpOnly `SameSite=Strict` : une API appelée depuis une autre adresse ne
   recevrait pas ces cookies. Si le service du site n'est pas géré par le Blueprint, ajouter cette règle à
   la main (Dashboard → site → **Redirects/Rewrites**, en première position) et mettre `VUE_APP_API_URL=/api`
   (**relancer un build** : la variable est injectée au build).
4. Si l'URL de l'API diffère, corriger la destination de la règle `/api/*`.

## Garder l'API éveillée

Faire pointer votre pinger habituel (UptimeRobot, cron-job.org…) sur `https://<api>.onrender.com/api/health`
toutes les 10 min (< 15 min de mise en veille). Cet endpoint ne touche pas la base.

En secours, le workflow GitHub `.github/workflows/keep-alive.yml` fait la même chose : définir la variable
de dépôt `API_HEALTH_URL` (Settings → Secrets and variables → Actions → **Variables**) avec l'URL ci-dessus.
GitHub peut retarder ces exécutions et les coupe après 60 jours sans activité sur le dépôt : le pinger externe reste le principal.

⚠️ Render offre **750 h d'instance gratuite par mois et par workspace**, partagées entre tous les
services gratuits. Un service éveillé en continu en consomme ~720-744 h : avec d'autres apps déjà
maintenues éveillées dans le même workspace, le quota sera dépassé et Render suspend **tous** les
services gratuits jusqu'au mois suivant. Utiliser un workspace séparé ou ne pinger que sur des plages horaires.

## Vérifier

- `https://<api>.onrender.com/api/health` → `{"status":"OK"}`
- Le front s'ouvre, l'inscription fonctionne, un craft Eau + Feu donne Vapeur.

## En local

```bash
# API (dans og-create-backend, avec son .env ou DATABASE_URL)
npm run dev
# Front : /api est relayé à http://localhost:3000 par le serveur de développement (vue.config.js)
npm run serve
```
