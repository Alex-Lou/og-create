#!/usr/bin/env bash
# Met Brumelune à jour sur le VPS : récupère les deux dépôts, construit le jeu, le publie dans /var/www/brumelune,
# met l'API à jour (dépendances, schéma et contenu de la base : db/setup.js, sans toucher aux comptes ni aux
# parties) et la redémarre. À lancer par l'utilisateur d'administration (pas root) :
#   /srv/brumelune/og-create/deploy/ovh/deploy.sh
# Installation et premier lancement : deploy/ovh/README.md.
set -euo pipefail

SRV=/srv/brumelune
WEB=/var/www/brumelune
FRONT=$SRV/og-create
API=$SRV/og-create-backend

echo "→ Récupération des dépôts"
git -C "$FRONT" pull --ff-only
git -C "$API" pull --ff-only

echo "→ Construction du jeu"
cd "$FRONT"
npm ci --no-audit --no-fund
npm run build

echo "→ Publication du jeu"
# Les fichiers du build d'abord, la page et le service worker en dernier : un joueur qui ouvre le jeu pendant la
# copie ne demande jamais un fichier pas encore arrivé. Les anciens fichiers restent, un jeu encore ouvert peut les
# demander ; ceux qu'aucune version n'a publiés depuis 14 jours partent
rsync -a --exclude index.html --exclude sw.js dist/ "$WEB/"
rsync -a dist/index.html dist/sw.js "$WEB/"
find "$WEB/js" "$WEB/css" "$WEB/img" "$WEB/fonts" -type f -mtime +14 -delete

echo "→ API : dépendances, base, redémarrage"
cd "$API"
npm ci --omit=dev --no-audit --no-fund
# Le schéma et le contenu du jeu, avec les réglages de l'API (/etc/brumelune/api.env), sous son utilisateur
sudo systemd-run --quiet --wait --pipe --uid=brumelune --gid=brumelune \
  --property=EnvironmentFile=/etc/brumelune/api.env --working-directory="$API" \
  /usr/bin/node db/setup.js
sudo systemctl restart brumelune-api

# L'API répond-elle ? (quelques secondes pour démarrer)
for _ in $(seq 1 15); do
  if curl -fsS http://127.0.0.1:3000/api/health > /dev/null; then
    echo "✓ Brumelune est à jour"
    exit 0
  fi
  sleep 1
done
echo "✗ L'API ne répond pas : sudo journalctl -u brumelune-api -n 50" >&2
exit 1
