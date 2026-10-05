# La troupe des Naufragés : sprites SVG des PNJ

Kit de dessin des PNJ, dans l'esprit des PNJ de Pokémon et de Stardew Valley, généré par code comme le reste du jeu.
Les personnages et leurs fiches sont dans `HISTOIRE.md` (§ 8).

- Repère 48 × 64, pieds en bas au centre (24, 62).
- Vues : face, trois quarts avant, trois quarts dos ; le miroir horizontal donne les deux autres directions.
- Poses : repos (2 images, clignement), marche (4), salut (2), action propre au personnage (2).
- Expressions : neutre (visage par défaut, selon le caractère), content, rire, surpris, triste, fâché, gêné, endormi.
  Chacune se combine avec n'importe quelle pose (de dos, le visage ne se voit pas).

## Fichiers

- `troupe.js` : le kit commun (trait, yeux, bras à coude, marche, ombres, expressions).
- `aster.js`, `cannelle.js`, `rivet.js` : un fichier par personnage (couleurs, pièces, action).
- `svg/<nom>/` : 30 SVG par personnage (poses, action, et chaque expression en face au repos).
- `planches/` : planches d'essai (poses, expressions) ; `troupe_apercu.html` : aperçu animé.

## Régénérer

```
node design/personnages/apercu.js
```

Les planches PNG demandent Playwright (sinon, seuls les SVG et la page animée sont écrits) ;
`CHROMIUM_PATH` désigne un Chromium précis si besoin.
