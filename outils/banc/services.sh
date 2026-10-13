#!/bin/bash
# Relance, pour les bancs, Postgres, l'API locale (port 3000) et Vite (port 8099) s'ils sont tombés (redémarrage du
# conteneur). Les journaux dans $LOGS (défaut /tmp). Arrêter l'API par son PID, jamais par « pkill -f » (on tue sa propre
# console) : for d in /proc/[0-9]*; do [ "$(tr '\0' ' ' < $d/cmdline)" = "node src/server.js " ] && kill ${d#/proc/}; done
# (à faire après chaque changement du serveur : l'API ne se recharge pas seule ; le limiteur des comptes invités, 20 par
# heure, repart à zéro aussi).
LOGS=${LOGS:-/tmp}
pg_isready -h localhost >/dev/null 2>&1 || pg_ctlcluster 16 main start
for i in 1 2 3 4 5; do pg_isready -h localhost >/dev/null 2>&1 && break; sleep 1; done
if ! curl -s -o /dev/null http://127.0.0.1:3000/api/health; then
  cd /home/user/og-create-backend && PORT=3000 CORS_ORIGIN=http://127.0.0.1:8099 REGISTER_RATE_LIMIT=1000 DATABASE_URL=postgres://origins:origins@localhost:5432/origins_test JWT_SECRET=ci-only-access-secret-not-used-in-production-0001 nohup node src/server.js > $LOGS/api.log 2>&1 &
fi
if ! curl -s -o /dev/null http://127.0.0.1:8099/; then
  cd /home/user/og-create && nohup npx vite --host 127.0.0.1 --port 8099 > $LOGS/vite.log 2>&1 &
fi
for i in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:3000/api/health && curl -s -o /dev/null http://127.0.0.1:8099/ && break; sleep 1; done
pg_isready -h localhost; curl -s -o /dev/null -w "api %{http_code}\n" http://127.0.0.1:3000/api/health; curl -s -o /dev/null -w "vite %{http_code}\n" http://127.0.0.1:8099/
