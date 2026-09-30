# Déploiement (gratuit) : Render + Neon

| Brique | Hébergeur | Remarque |
|---|---|---|
| Front (Vue, statique) | Render Static Site | gratuit, pas de mise en veille |
| API (Express) | Render Web Service (free) | s'endort après 15 min d'inactivité, ~1 min pour se réveiller |
| PostgreSQL | Neon (ou Supabase) | gratuit sans expiration (la base gratuite Render est supprimée après 30 j) |

## 1. Base de données (Neon)

1. Créer un projet sur neon.tech, copier la chaîne de connexion (elle contient `?sslmode=require`).
2. Depuis un clone de `og-create-backend` (psql requis) :
   ```bash
   export DATABASE_URL="postgresql://…?sslmode=require"
   npm run db:setup      # schéma + données de démo, rejouable
   ```

## 2. Render (Blueprint)

1. Render → **New → Blueprint** → choisir ce dépôt (`render.yaml` est à la racine).
2. Renseigner les variables demandées :
   - `DATABASE_URL` : la chaîne Neon.
   - `CORS_ORIGIN` : l'URL du front, ex. `https://og-create.onrender.com` (sans slash final, jamais `*`).
   - `VUE_APP_API_URL` : l'URL de l'API + `/api`, ex. `https://og-create-backend.onrender.com/api`.
   - `EMAIL_USER` / `EMAIL_PASSWORD` : facultatifs (formulaire de contact).
   - `JWT_SECRET` / `JWT_REFRESH_SECRET` sont générés par Render.
3. Les URL exactes ne sont connues qu'après création : si elles diffèrent, corriger `CORS_ORIGIN`
   (redémarre l'API) et `VUE_APP_API_URL` (**relancer un build** du front : la variable est injectée au build).

## Garder l'API éveillée

Faire pointer votre pinger habituel (UptimeRobot, cron-job.org…) sur `https://<api>.onrender.com/api/health`
toutes les 10 min (< 15 min de mise en veille). Cet endpoint ne touche pas la base.

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
# Front (VUE_APP_API_URL vaut http://localhost:3000/api par défaut)
npm run serve
```
En local aussi, définir `CORS_ORIGIN=http://localhost:8080` côté API.
