# Brumelune sur le VPS OVH (Ubuntu 24.04, 4 Go)

Le jeu sur **https://brumelune.eu**, sur le même VPS que l'autre app (MemoCat, dépôt Usy2), chacune sur son domaine,
derrière un seul Nginx.

| Quoi | Où | Mémoire |
|---|---|---|
| Nginx, la porte d'entrée (ports 80 et 443) | les deux domaines | ~20 Mo |
| Le jeu (fichiers du build) | `/var/www/brumelune` | — |
| L'API de Brumelune (service `brumelune-api`) | `127.0.0.1:3000` | 512 Mo au plus (~100 Mo réels) |
| PostgreSQL 16 | `localhost:5432`, bases `brumelune` (et `memocat`) | ~150 Mo |
| MemoCat (Docker) | port 8080, fermé à l'extérieur | 768 Mo au plus |
| Construction du jeu, pendant `deploy.sh` seulement | — | ~1,7 Go quelques minutes |

Environ 1,2 Go en continu ; 2 Go de swap servent de filet pendant la construction.

Les fichiers de ce dossier :

- `nginx/brumelune.eu.conf` : le site (HTTPS, `www` → sans `www`, l'API sous `/api`, cache et compression) ;
- `nginx/memocat.conf.example` : le modèle pour l'autre app ;
- `systemd/brumelune-api.service` : l'API, relancée seule si elle tombe ;
- `api.env.example` : les réglages et secrets de l'API ;
- `deploy.sh` : la mise à jour du jeu ;
- `backup.sh` : la sauvegarde quotidienne de la base.

Toutes les commandes se lancent en SSH sur le VPS, avec l'utilisateur d'administration (`ubuntu` chez OVH).

## 0. Regarder ce qui tourne déjà

```bash
sudo ss -ltnp | grep -E ':(80|443|3000|5432|8080) '
docker ps 2>/dev/null
ip -6 addr show scope global
```

- Si les ports 80 ou 443 sont pris par autre chose que `nginx` (MemoCat publiée directement, Caddy, Apache) : passer
  d'abord par « L'autre app » plus bas. Nginx doit être seul sur 80 et 443.
- Si la dernière commande n'affiche rien (pas d'IPv6) : retirer les lignes `listen [::]…` des fichiers Nginx.

## 1. Le domaine brumelune.eu

OVH Manager → Web Cloud → Noms de domaine → brumelune.eu → **Zone DNS** :

1. supprimer les entrées **A** et **AAAA** de `brumelune.eu` et de `www` (elles pointent vers la page d'attente d'OVH) ;
2. ajouter une entrée **A**, sous-domaine vide, vers l'IPv4 du VPS (`ip -4 addr show scope global`) ;
3. ajouter une entrée **AAAA**, sous-domaine vide, vers l'IPv6 du VPS (s'il en a une) ;
4. ajouter une entrée **CNAME**, sous-domaine `www`, vers `brumelune.eu.`

Attendre que ce soit pris en compte (de quelques minutes à quelques heures) :
`dig +short brumelune.eu` et `dig +short www.brumelune.eu` doivent afficher l'adresse du VPS.

## 2. Paquets, pare-feu, swap

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx postgresql certbot git rsync dnsutils
# Node 22, comme la CI
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

Pare-feu : SSH d'abord, sinon la connexion se coupe.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Swap de 2 Go (sauter si `swapon --show` en affiche déjà un) :

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 3. La base de données

```bash
openssl rand -hex 24      # le mot de passe de la base : le noter
sudo -u postgres createuser --pwprompt brumelune
sudo -u postgres createdb --owner=brumelune brumelune
```

Les joueurs actuels (Render + Neon) ne suivent pas tout seuls : voir « Reprendre les joueurs actuels » **avant**
l'étape 6.

## 4. Les dépôts (privés)

GitHub n'accepte une clé de déploiement que sur un seul dépôt : une clé par dépôt, en lecture seule.

```bash
ssh-keygen -t ed25519 -N "" -C vps-brumelune-jeu -f ~/.ssh/brumelune_jeu
ssh-keygen -t ed25519 -N "" -C vps-brumelune-api -f ~/.ssh/brumelune_api
cat >> ~/.ssh/config <<'EOF'
Host github-brumelune-jeu
  HostName github.com
  User git
  IdentityFile ~/.ssh/brumelune_jeu
  IdentitiesOnly yes
Host github-brumelune-api
  HostName github.com
  User git
  IdentityFile ~/.ssh/brumelune_api
  IdentitiesOnly yes
EOF
cat ~/.ssh/brumelune_jeu.pub ~/.ssh/brumelune_api.pub
```

Sur GitHub, dépôt **og-create** → Settings → Deploy keys → Add deploy key : coller `brumelune_jeu.pub`, sans cocher
« Allow write access ». Pareil sur **Og-create-backend** avec `brumelune_api.pub`. Puis :

```bash
sudo useradd --system --no-create-home --shell /usr/sbin/nologin brumelune
sudo mkdir -p /srv/brumelune /var/www/brumelune /var/www/letsencrypt /etc/brumelune
sudo chown "$USER": /srv/brumelune /var/www/brumelune
git clone github-brumelune-jeu:Alex-Lou/og-create.git /srv/brumelune/og-create
git clone github-brumelune-api:Alex-Lou/Og-create-backend.git /srv/brumelune/og-create-backend
```

## 5. L'API

```bash
sudo cp /srv/brumelune/og-create/deploy/ovh/api.env.example /etc/brumelune/api.env
openssl rand -hex 32      # le JWT_SECRET
sudo nano /etc/brumelune/api.env      # remplir les deux « À REMPLACER »
sudo chown root:brumelune /etc/brumelune/api.env && sudo chmod 640 /etc/brumelune/api.env
sudo cp /srv/brumelune/og-create/deploy/ovh/systemd/brumelune-api.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable brumelune-api
```

## 6. Premier déploiement

```bash
/srv/brumelune/og-create/deploy/ovh/deploy.sh
```

Le script construit le jeu (quelques minutes), le publie, prépare la base et démarre l'API. Il finit par
« ✓ Brumelune est à jour ».

## 7. Le certificat HTTPS, puis le site

Le domaine doit déjà pointer vers le VPS (étape 1). D'abord un site qui ne répond qu'à la preuve de Let's Encrypt :

```bash
sudo tee /etc/nginx/sites-available/brumelune.eu.conf > /dev/null <<'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name brumelune.eu www.brumelune.eu;
    location /.well-known/acme-challenge/ { root /var/www/letsencrypt; }
}
EOF
sudo ln -s /etc/nginx/sites-available/brumelune.eu.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot certonly --webroot -w /var/www/letsencrypt -d brumelune.eu -d www.brumelune.eu \
  --deploy-hook "systemctl reload nginx"
```

Certbot demande un mail (pour prévenir avant expiration) et l'accord à ses conditions. Puis le vrai site :

```bash
sudo cp /srv/brumelune/og-create/deploy/ovh/nginx/brumelune.eu.conf /etc/nginx/sites-available/brumelune.eu.conf
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run      # le renouvellement automatique marche
```

**https://brumelune.eu** ouvre le jeu.

## 8. Sauvegarde quotidienne

```bash
sudo install -m 750 /srv/brumelune/og-create/deploy/ovh/backup.sh /usr/local/sbin/brumelune-backup
echo '15 4 * * * root /usr/local/sbin/brumelune-backup' | sudo tee /etc/cron.d/brumelune-backup
sudo /usr/local/sbin/brumelune-backup && ls -lh /var/backups/brumelune
```

Une copie par nuit, gardée 14 jours, mais **sur le VPS** : s'il est perdu, elles le sont aussi. Activer l'option
« Sauvegarde automatisée » du VPS chez OVH, ou recopier ce dossier ailleurs de temps en temps.

## Mettre à jour le jeu

Après une fusion sur `master` (le jeu) ou `main` (l'API) :

```bash
/srv/brumelune/og-create/deploy/ovh/deploy.sh
```

Les anciens fichiers du jeu restent 14 jours : une partie encore ouverte les trouve toujours. Le script ne touche pas à
la configuration du système : une modification des fichiers `nginx/` ou `systemd/` se recopie à la main, comme aux
étapes 5 et 7.

## Reprendre les joueurs actuels (Render + Neon) : à décider

La base du VPS part vide. Pour garder les comptes, la copier depuis Neon **avant** l'étape 6 :

```bash
pg_dump "postgres://…(la chaîne Neon)…?sslmode=require" --format=custom --no-owner --no-acl -f neon.dump
sudo -u postgres pg_restore --no-owner --role=brumelune -d brumelune < neon.dump
```

- `pg_dump` doit être de la même version que le serveur Neon, ou plus récent : Ubuntu 24.04 fournit la 16. Si Neon est
  en 17, installer `postgresql-client-17` depuis apt.postgresql.org.
- Les comptes (mail et mot de passe) suivent ; chaque joueur se reconnecte une fois sur brumelune.eu.
- Les carnets **invités** (joueurs sans compte) ne suivent pas : ils tiennent à un cookie de og-create.onrender.com.
  Les inviter à créer un compte avant la bascule, ou laisser Render en place un moment.
- Après la copie, ce qui se joue encore sur Render est perdu : basculer d'un coup (par exemple, rediriger
  og-create.onrender.com vers brumelune.eu).

## L'autre app (MemoCat, dépôt Usy2)

À vérifier avec le dépôt Usy2 : ce passage n'a pas été essayé. Dans Docker, derrière le même Nginx, sur son domaine,
avec sa base dans le même PostgreSQL :

```bash
sudo -u postgres createuser --pwprompt memocat
sudo -u postgres createdb --owner=memocat memocat
# Dans un clone d'Usy2
docker build -t memocat .
sudo mkdir -p /etc/memocat && sudo nano /etc/memocat/env
docker run -d --name memocat --restart unless-stopped --network host --memory 768m \
  --env-file /etc/memocat/env -v memocat-uploads:/data/uploads memocat
```

`/etc/memocat/env` : `MEMOCAT_DB_HOST=localhost`, `MEMOCAT_DB_PORT=5432`, `MEMOCAT_DB_NAME=memocat`,
`MEMOCAT_DB_USER=memocat`, `MEMOCAT_DB_PASSWORD=…`, `MEMOCAT_JWT_SECRET=…` (`openssl rand -hex 32`),
`MEMOCAT_CORS_ORIGINS=https://AUTRE-DOMAINE.fr`, `MEMOCAT_STORAGE_PATH=/data/uploads`, et les six `MEMOCAT_USER1_*` /
`MEMOCAT_USER2_*`.

- `--network host` : elle joint PostgreSQL sur `localhost`, et son port 8080 reste fermé à l'extérieur par le
  pare-feu. Jamais `-p 8080:8080` : Docker ouvrirait ce port à tout internet, en passant outre le pare-feu.
- `--memory 768m` : son Java prend 60 % de la mémoire qu'il voit ; sans limite, il prendrait jusqu'à 2,4 Go des 4.
- Les fichiers envoyés vivent dans le volume `memocat-uploads` et survivent aux redémarrages (sur Render, ils
  disparaissaient).

Puis comme à l'étape 7, avec `nginx/memocat.conf.example` (remplacer `AUTRE-DOMAINE.fr` partout) et un certificat à
son nom.

## En cas de souci

- L'API : `sudo systemctl status brumelune-api`, `sudo journalctl -u brumelune-api -n 50`
- Nginx : `sudo nginx -t`, `sudo tail -n 50 /var/log/nginx/error.log`
- « 502 Bad Gateway » sur le jeu : l'API ne tourne pas (voir ci-dessus).
- Le jeu affiche « Le serveur se réveille… » longtemps : même chose.
