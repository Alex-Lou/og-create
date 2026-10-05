# Brumelune — le jeu (front)

Jeu d'alchimie en français : on découvre des éléments en les mélangeant dans l'Athanor pour remplir les pages du **Grimoire**, on relève **l'Épreuve** (questions chronométrées) et on bâtit son **île** (le Monde) avec les ressources de la Récolte.

Vue 3 (Options API), servi en site statique et installable (PWA). Le serveur de jeu ([Og-create-backend](https://github.com/Alex-Lou/Og-create-backend)) garde les recettes, les écus et l'île : le navigateur ne reçoit que des résultats.

## Développer

```
npm install
npm run serve      # http://localhost:8080, /api relayé vers le backend (localhost:3000)
npm run lint       # corrige ; la CI lance « npm run lint -- --no-fix »
npm test           # tests unitaires (vitest)
npm run build      # site statique dans dist/
```

## Où est quoi

- `src/components/` : les écrans et fenêtres (`General/App.vue` orchestre les modes).
- `src/services/` : appels à l'API (`http.js` est le seul client ; `playService` pour le jeu, `trialService` pour l'Épreuve).
- `src/book/` : moteur du Livre (pages tournées en WebGL, peinture des pages, cinématique de chapitre).
- `src/game/` : règles partagées avec le serveur (moteur de la Récolte, ressources de l'île).
- `src/utils/` : fonctions pures et petits outils (familles et ères, effets, stockage local, recherche…).
- `tests/` : tests unitaires des fonctions pures.

Déploiement (Render, base Neon) : voir `DEPLOY.md`.
