# Brumelune sur le VPS OVH (Ubuntu 24.04, 4 Go)

Le jeu sur **https://brumelune.eu**, sur le même VPS que MemoCat (**memocat.fr**, dépôt Usy2), chacun sur son
domaine, derrière un seul Nginx.

| Quoi | Où | Mémoire |
|---|---|---|
| Nginx, la porte d'entrée (ports 80 et 443) | les deux domaines | ~20 Mo |
| Le jeu (fichiers du build) | `/var/www/brumelune` | — |
| L'API de Brumelune (service `brumelune-api`) | `127.0.0.1:3000` | 512 Mo au plus (~100 Mo réels) |
| PostgreSQL | `localhost:5432`, base `brumelune` | ~150 Mo |
| MemoCat (Java) | port 8080, fermé à l'extérieur | 768 Mo au plus conseillés |
| Construction du jeu, pendant `deploy.sh` seulement | — | ~1,7 Go quelques minutes |

Environ 1,2 Go en continu ; 2 Go de swap servent de filet pendant la construction.

Les fichiers de ce dossier :

- `nginx/brumelune.eu.conf` : le site (HTTPS, `www` → sans `www`, l'API sous `/api`, cache et compression) ;
- `nginx/memocat.fr.conf` : MemoCat derrière le même Nginx, si ce n'est pas déjà le cas ;
- `systemd/brumelune-api.service` : l'API, relancée seule si elle tombe ;
- `api.env.example` : les réglages et secrets de l'API ;
- `deploy.sh` : la mise à jour du jeu ;
- `backup.sh` : la sauvegarde quotidienne de la base.

Toutes les commandes se lancent en SSH sur le VPS (Termius), avec l'utilisateur d'administration (`ubuntu` chez
OVH), jamais en root directement.

## 0. L'état du VPS (lecture seule)

Coller ce bloc en entier. Il ne modifie rien, n'affiche aucun secret, et garde tout dans `~/diagnostic-vps.txt` :

```bash
{
echo "== système"; . /etc/os-release; echo "$PRETTY_NAME"; free -h | head -2; df -h / | tail -1; swapon --show; nproc
echo "== ip"; ip -4 addr show scope global | grep inet; ip -6 addr show scope global | grep inet6; ip -6 route | grep default
echo "== ports"; sudo ss -ltnp
echo "== docker"
if command -v docker > /dev/null; then
  sudo docker ps -a --format '{{.Names}} | {{.Image}} | {{.Status}} | {{.Ports}}'
  for c in $(sudo docker ps -q); do sudo docker inspect --format '{{.Name}} réseau={{.HostConfig.NetworkMode}} mémoire={{.HostConfig.Memory}} redémarrage={{.HostConfig.RestartPolicy.Name}} ports={{json .HostConfig.PortBindings}} volumes={{range .Mounts}}{{.Source}}->{{.Destination}} {{end}}' "$c"; done
  sudo docker compose ls 2>/dev/null
else echo "pas de docker"; fi
echo "== serveurs web"; for s in nginx caddy apache2 traefik; do echo "$s : $(systemctl is-active $s 2>/dev/null)"; done
ls -l /etc/nginx/sites-enabled/ 2>/dev/null
sudo grep -rn -E "server_name|listen|proxy_pass|ssl_certificate |default_server" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/ 2>/dev/null
[ -f /etc/caddy/Caddyfile ] && sudo grep -v -i -E "basic|password|secret|token" /etc/caddy/Caddyfile
echo "== certificats"; sudo certbot certificates 2>/dev/null | grep -E "Certificate Name|Domains|Expiry"; systemctl list-timers 2>/dev/null | grep -i certbot
echo "== services"; systemctl list-units --type=service --state=running --no-pager --no-legend | awk '{print $1}' | grep -i -E "memo|java|docker|nginx|caddy|apache|postgres|node|pm2"
echo "== postgresql"; command -v psql > /dev/null && psql --version; sudo -u postgres psql -Atc "select datname from pg_database where not datistemplate" 2>/dev/null; pg_lsclusters 2>/dev/null
echo "== pare-feu"; sudo ufw status verbose 2>/dev/null | head -25
echo "== netplan"; ls -l /etc/netplan/
echo "== dns"; for d in memocat.fr www.memocat.fr brumelune.eu www.brumelune.eu; do echo "$d : $(getent ahosts $d | awk '{print $1}' | sort -u | tr '\n' ' ')"; done
echo "== node"; node -v 2>/dev/null || echo "pas de node"
} 2>&1 | tee ~/diagnostic-vps.txt
```

Le relire (ou me l'envoyer) : il dit comment MemoCat est servie aujourd'hui (voir « MemoCat » plus bas, cas A, B ou
C) et ce qui occupe déjà les ports 80, 443, 3000, 5432 et 8080.

## 1. Le domaine brumelune.eu

OVH Manager → Web Cloud → Noms de domaine → brumelune.eu → **Zone DNS** :

1. supprimer les entrées **A** et **AAAA** de `brumelune.eu` et de `www` (elles pointent vers la page d'attente d'OVH) ;
2. ajouter une entrée **A**, sous-domaine vide, vers l'IPv4 du VPS (ligne `inet` de « == ip » dans le diagnostic) ;
3. ajouter une entrée **AAAA**, sous-domaine vide, vers `2001:41d0:801:2000::3834` (après l'étape 2, si l'IPv6 n'est
   pas encore active) ;
4. ajouter une entrée **CNAME**, sous-domaine `www`, vers `brumelune.eu.`

Attendre que ce soit pris en compte (de quelques minutes à quelques heures) : `getent ahosts brumelune.eu` doit
afficher les adresses du VPS.

## 2. L'IPv6 du VPS

Si la ligne `inet6 2001:41d0:801:2000::3834/…` apparaît déjà dans « == ip » du diagnostic : rien à faire. Sinon,
regarder le nom de l'interface réseau dans le fichier d'OVH (souvent `ens3` ou `eth0`, la clé sous `ethernets:`) :

```bash
sudo cat /etc/netplan/50-cloud-init.yaml
```

Puis, en remplaçant `ens3` par ce nom :

```bash
sudo tee /etc/netplan/51-ipv6.yaml > /dev/null <<'EOF'
network:
  version: 2
  ethernets:
    ens3:
      addresses:
        - "2001:41d0:801:2000::3834/128"
      routes:
        - to: "::/0"
          via: "2001:41d0:801:2000::1"
          on-link: true
EOF
sudo chmod 600 /etc/netplan/51-ipv6.yaml
sudo netplan try
```

`netplan try` applique la configuration et attend Entrée : sans réponse dans les 120 secondes (connexion perdue),
tout revient comme avant. Vérifier : `ping -6 -c 3 2606:4700:4700::1111`.

## 3. Paquets, pare-feu, swap

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx postgresql certbot git rsync
# Node 22, comme la CI
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

Pare-feu (si « == pare-feu » le dit inactif) : SSH d'abord, sinon la connexion se coupe.

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

Attention : un port publié par Docker (`-p 8080:8080`, `0.0.0.0:8080` dans « == docker ») est ouvert à tout internet
**malgré** le pare-feu. Voir « MemoCat ».

Swap de 2 Go (sauter si « == système » en montre déjà un) :

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

## 4. La base de données

```bash
pg_lsclusters      # le port de PostgreSQL : 5432 en principe
openssl rand -hex 24      # le mot de passe de la base : le noter
sudo -u postgres createuser --pwprompt brumelune
sudo -u postgres createdb --owner=brumelune brumelune
```

Si le port 5432 était déjà pris avant (la base de MemoCat dans un conteneur Docker, par exemple), PostgreSQL s'est
installé sur le suivant (5433) : `pg_lsclusters` l'indique, et ce port va dans `DATABASE_URL` (étape 6).

Les joueurs actuels (Render + Neon) ne suivent pas tout seuls : voir « Reprendre les joueurs actuels » **avant**
l'étape 7.

## 5. Les dépôts (privés)

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

## 6. L'API

```bash
sudo cp /srv/brumelune/og-create/deploy/ovh/api.env.example /etc/brumelune/api.env
openssl rand -hex 32      # le JWT_SECRET
sudo nano /etc/brumelune/api.env      # remplir les deux « À REMPLACER »
sudo chown root:brumelune /etc/brumelune/api.env && sudo chmod 640 /etc/brumelune/api.env
sudo cp /srv/brumelune/og-create/deploy/ovh/systemd/brumelune-api.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable brumelune-api
```

## 7. Premier déploiement

```bash
/srv/brumelune/og-create/deploy/ovh/deploy.sh
```

Le script construit le jeu (quelques minutes), le publie, prépare la base et démarre l'API. Il finit par
« ✓ Brumelune est à jour ».

## 8. Le certificat HTTPS, puis le site

Le domaine doit déjà pointer vers le VPS (étape 1), et Nginx tenir les ports 80 et 443 (cas A ou C de « MemoCat »,
ou cas B une fois MemoCat passée derrière Nginx). D'abord un site qui ne répond qu'à la preuve de Let's Encrypt :

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

## 9. Sauvegarde quotidienne

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
étapes 6 et 8.

## MemoCat (memocat.fr), déjà sur le VPS

Le diagnostic (étape 0) dit dans quel cas elle est :

- **A. Nginx sert déjà memocat.fr** (`nginx : active`, et `server_name memocat.fr` dans « == serveurs web ») : ne rien
  changer pour elle. Brumelune s'installe à côté ; `nginx/memocat.fr.conf` ne sert pas.
- **B. Autre chose tient les ports 80 et 443** (Caddy, Apache, ou un conteneur Docker publié sur `0.0.0.0:80` /
  `0.0.0.0:443` dans « == ports ») : il faut d'abord la passer derrière Nginx. Cela coupe MemoCat quelques minutes, et
  les commandes exactes dépendent de son installation : m'envoyer `~/diagnostic-vps.txt` avant.
- **C. Elle écoute sur 8080 et rien ne tient 80 ni 443** : lui donner son site, comme à l'étape 8, avec
  `memocat.fr` à la place de `brumelune.eu` et `nginx/memocat.fr.conf` comme vrai site.

Dans tous les cas :

- si « == docker » montre `0.0.0.0:8080` (ou `8080:8080`), le port de MemoCat est ouvert à tout internet malgré le
  pare-feu : le republier sur `127.0.0.1:8080` seulement ;
- si `mémoire=0` dans « == docker », son Java peut prendre jusqu'à 60 % des 4 Go (2,4 Go) : lui donner une limite de
  768 Mo (`--memory 768m`, ou `mem_limit: 768m` avec docker compose).

## Reprendre les joueurs actuels (Render + Neon) : à décider

La base du VPS part vide. Pour garder les comptes, la copier depuis Neon **avant** l'étape 7 :

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

## En cas de souci

- L'API : `sudo systemctl status brumelune-api`, `sudo journalctl -u brumelune-api -n 50`
- Nginx : `sudo nginx -t`, `sudo tail -n 50 /var/log/nginx/error.log`
- « 502 Bad Gateway » sur le jeu : l'API ne tourne pas (voir ci-dessus).
- Le jeu affiche « Le serveur se réveille… » longtemps : même chose.
- Nginx refuse de démarrer avec « Address family not supported » : l'IPv6 est coupée sur la machine ; retirer les
  lignes `listen [::]…` des fichiers Nginx.
