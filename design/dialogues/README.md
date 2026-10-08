# Dialogues

Les répliques des personnages, prêtes à brancher dans les bulles du guide (`src/game/guide.js`, `BrumeGuide.vue`). Rien à dessiner : la tête vient de `faceHref(qui)`, le prénom de `NAMES[qui]` (`src/world/faces.js`).

| Fichier | Contenu |
| --- | --- |
| `chantiers.json` | Les premières fois : bâtir (Ondin), faire évoluer (Rivet), ramasser (Cannelle), poser un champ (Mélisse), ramasser un gisement (Galet, traduit par Brume), et la curiosité : presque tout ce qui vit réagit sur l'île |

## Règles

- **Une seule fois.** Chaque bulle a un `id` unique, retenu dans `oc_guide_seen` : elle ne revient pas.
- **Le joueur fait le geste.** La bulle dit quoi toucher ; une bulle `apres` attend que ce soit fait.
- **Rien de faux.** Chaque réaction promise existe dans le jeu ; un champ est une annexe qui produit seule, on ne plante ni ne récolte à la main.
- **La voix de chacun** (`HISTOIRE.md`, § 8.2) : Ondin chuchote, Rivet fait « clic », Cannelle invente des proverbes de cuisine, Mélisse parle des plantes comme de personnes, Galet dit « Hm » et Brume traduit, Sylve parle sans articles, Aster parle marine.
- **Quêtes** : `existante` renvoie à une quête du serveur (`og-create-backend`, `services/quests.js`), `null` veut dire pas de quête.
