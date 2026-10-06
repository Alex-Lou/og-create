# Styles

Trois étages, du plus général au plus local. Un style ne vit qu'à un seul endroit.

## 1. Les jetons (`tokens/`)

La seule source des valeurs de design, en variables CSS (`--nom`). Un fichier par famille :

| Fichier | Contenu |
|---|---|
| `colors.css` | la palette (vélin, encre, cuir, noyer, or, encres secondaires, le brun des liserés), le fond et le texte posé dessus |
| `typography.css` | les deux familles (Fraunces, Nunito), et IM Fell (Grimoire, prologue) |
| `shapes.css` | arrondis (de `--r-xs` à `--r-pill`, et `--r-round` pour un cercle), tranche « papier », ombres portées |
| `roles.css` | les rôles des composants (`--oc-*`), branchés sur la palette |
| `motion.css` | courbes et durées |
| `layout.css` | marges, dock, barre d'onglets, rail |
| `depth.css` | profondeurs (`z-index`) : l'ordre des couches de la page, de la coque de l'application et de l'île |
| `dark.css` | Veillée, le thème sombre : il redéfinit la palette, donc il vient en dernier |

`tokens/index.css` les lit dans cet ordre.

## 2. La base (`base/`)

Ce qui vaut pour toute la page, et les primitives `g-*` (boutons, champs, panneaux, onglets…), sans
dépendre d'aucun composant. `base/index.css` lit les fichiers dans un ordre qui compte : les adaptations aux petits
écrans (`responsive.css`) viennent après les primitives qu'elles ajustent.

## 3. Le style d'un composant

Il vit à côté de son composant, dans son dossier, et ne s'applique qu'à lui (`<style scoped>`). Il ne lit que des
jetons pour les couleurs, polices, arrondis, ombres, profondeurs et durées ; les marges et tailles restent des nombres.
Un composant ne stylise jamais l'intérieur d'un autre.

Une valeur que plusieurs composants partagent devient un rôle global (`tokens/`) ; une valeur propre à un composant
devient un jeton local, nommé en tête de son CSS. Restent écrits en place : le noir et le blanc translucides (ombres,
reflets, voiles : des lumières, pas des couleurs de la palette), le noir des masques, et les couleurs des dessins
(SVG, canvas).

`index.css` (ce dossier) est le seul fichier importé par `main.js` : les jetons, puis la base.
