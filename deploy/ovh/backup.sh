#!/usr/bin/env bash
# Sauvegarde quotidienne de la base de Brumelune : un fichier compressé par jour dans /var/backups/brumelune, gardé
# 14 jours. Copié en /usr/local/sbin/brumelune-backup et lancé chaque nuit par cron (deploy/ovh/README.md).
# Restaurer : sudo -u postgres pg_restore --clean --if-exists -d brumelune /var/backups/brumelune/<fichier>.dump
set -euo pipefail

DIR=/var/backups/brumelune
mkdir -p "$DIR"
chmod 700 "$DIR"
runuser -u postgres -- pg_dump --format=custom brumelune > "$DIR/brumelune-$(date +%F).dump"
find "$DIR" -name 'brumelune-*.dump' -mtime +14 -delete
