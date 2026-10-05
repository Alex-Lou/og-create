# Origins Création — Les Naufragés de la Brume

> **Bible narrative et plan de game design : version finale** (v5, 5 octobre 2026). Elle remplace toutes les versions précédentes. Pour commencer à construire : § 19.
> - Rien de ce document n'était codé à sa rédaction. L'état du jeu décrit ici est celui d'après le lot 9e (12 bêtes des climats) et le compteur `?perf`.
> - Chaque fait sur le jeu actuel est vérifié dans le code ou dans la base de test (`B/` = serveur, `F/` = front).
> - **Chaque recette citée est une vraie recette de la base** (calculée le 5 octobre 2026).

> **Mises à jour depuis la v5** (règle du § 19 : la bible change avant le code).
> - **Lots livrés** : H0 (la troupe et les textes), H1 (la colonne vertébrale), H2 (le fil d'Ariane : 2 à 7 ms par calcul), H3 (dormeurs, naufrages, souvenirs).
> - **Lot H0, choix de l'auteur** :
>   - le mot d'Héliane de l'acte II dit « Grimoire » (§ 10) ;
>   - les familiers suivent le style des bêtes du lot 9e, et non plus « à plat, avec les gros yeux ronds » (§ 14) ;
>   - « Codex des succès » devient « Succès » : seul le livre s'appelle Grimoire (*Codex Mundi*).
> - **Lot H1** :
>   - la quête « poser une annexe » passe de l'acte II au début de l'acte III, juste après l'Abri : une annexe demande un bâtiment au palier II, et l'Abri (Foyer II) est le premier de la chaîne ; l'Abri reste la dernière quête de l'acte II (§ 10) ;
>   - « trouver la clé du phare » (acte VI) désigne le Cercle de menhirs (« sous une pierre », comme le dit la bouteille) ;
>   - un joueur d'avant la bible (compte créé avant le déploiement du lot H1) garde le chapitre II ouvert d'emblée, tous ses habitants, et Cannelle arrive comblée ; ses anciennes quêtes se rangent dans la nouvelle chaîne ;
>   - les quatre dormeurs attendent les yeux fermés à l'emplacement de leur bâtiment (la pose « endormi » vient en H3).
> - **Lot H3** :
>   - un dormeur est couché près de l'emplacement de son bâtiment ; réveillé, il y reste (Aster et Rivet, eux, vivent au camp) ;
>   - les naufrages s'annoncent quand s'ouvre la quête de leur acte (La Lisière, La Colline, Les Jardins), jamais par-dessus un coffre ;
>   - Galet retrouve la pierre en « Hm », que Brume traduit ; Aster retrouve son courage avec le Bateau.

**Ce que les versions 4 et 5 changent.**
1. **Une nouvelle troupe** : nouveaux noms, vraies personnalités, chacun avec une magie, une voix, un familier, un secret et un arc.
2. **Un système magique tiré du jeu lui-même** :
   - les **quatre Souffles** (Air, Eau, Feu, Terre), portés par les quatre fondateurs ;
   - les **sept Sceaux** planétaires, déjà dessinés sur le Grimoire, un par chapitre, chacun avec son maître ;
   - le **Grand Œuvre** comme arc de toute l'île.
3. **Tout est recette** : chaque moment fort de l'histoire est une vraie recette du Grimoire. Exemples :
   - Vie = Air + Eau + Feu + Terre, les quatre fondateurs ensemble ;
   - Bois = Arbre + Métal, le lien de deux personnages ;
   - Feu follet = Feu + Marais, Brume elle-même, et le plan du Phare de Brume.
4. **Quatre mécaniques précises** :
   - le **fil d'Ariane** (la page marquée suit la chaîne de recettes la plus courte) ;
   - les **Savoirs des maîtres** (un indice par jour en bavardant) ;
   - le **Bestiaire vivant** (une bête écrite apparaît sur l'île) ;
   - les **recettes du récit**.
5. **Anya, l'Âme de l'Île** (version 5) : l'esprit le plus respecté et le plus puissant de l'île. On la devine trace après trace, et elle se révèle quand toute l'île principale est découverte (§ 4.5, § 6.14, § 8).

**Décisions déjà prises par l'auteur, reprises telles quelles.**
- **Tutoriel** : 5 étapes, un personnage chacune (Grimoire, Récolte, besoins, créer, bâtir).
- **Arrivées** : les suivants viennent **d'autres naufrages, sur besoin**.
- **Se découvrir** : entre eux et eux-mêmes.
- **Brume** : solitaire ; sa brume égare les bateaux ; elle devient le Phare.
- **Civilisation** : étapes, veillées, nom du peuple.
- **Compte et public** : le compte au moment du nom ; tout public.
- **Décisions D1 à D16** : Brume est *elle* ; chapitre II à 3 découvertes ; palier I de l'établi à 10 découvertes ; « Grimoire » partout ; 8 stades ; joueur jamais montré ; *l'Hirondelle* ; frère d'Aster pour plus tard.

---

## Sommaire

0. En une page
1. Ce qui existe déjà (la recherche)
2. Ce qui casse le fil aujourd'hui
3. Les piliers
4. Le système magique : l'Art
5. La boucle de jeu : pourquoi chaque chose, qui l'enseigne
6. Les mécaniques (règles exactes)
7. L'histoire
8. La troupe (fiches complètes)
9. Le tutoriel « Le Naufrage de l'Hirondelle », en 5 étapes
10. Les sept actes
11. La Révélation d'Anya, et après
12. Le tableau maître
13. Brume, fiche du personnage
14. Direction artistique et mise en scène
15. Impacts techniques (fichiers, règles, invariants)
16. Plan de livraison en lots (avec critères d'acceptation)
17. Décisions
18. Notes hors périmètre
19. Conclusion et démarrage

---

## 0. En une page

**L'histoire.**
- *L'Hirondelle* se brise dans la brume. Tu te réveilles sur la Grève.
- **Brume**, un feu follet timide, te confie le **Grimoire** : ce qu'on y écrit renaît sur l'île, et revient dans les mémoires.
- **Le tutoriel avance d'une rencontre à l'autre**, avec les quatre fondateurs. Chacun porte un des quatre Souffles et apprend une chose au joueur :

  | Étape | Personnage | Souffle | Ce qu'il ou elle apprend |
  |---|---|---|---|
  | 2 | **Aster**, la navigatrice | Air | la Récolte |
  | 3 | **Cannelle**, la cuisinière-guérisseuse | Feu | les besoins |
  | 4 | **Rivet**, l'horloger-artificier | Terre | créer |
  | 5 | **Ondin**, petit sourcier endormi | Eau | bâtir : le Grimoire lui rend son don et le Puits sort de terre |

- **Acte I : la Vie.** Quand le joueur écrit pour la première fois **Vie = Air + Eau + Feu + Terre**, Brume dit : *« Aster, Ondin, Cannelle, Rivet. Ensemble, la Vie. »*

**Ensuite, chaque manque amène un naufrage** et un **maître** de plus. Chaque maître garde un **sceau** du Grimoire et souffle chaque jour un **Savoir** sur ses pages :
- **Sylve**, la sauvageonne des bois, quand le bois manque ;
- **Galet**, le vieux tailleur de runes, quand l'orage menace ;
- **Mélisse**, la jardinière des lunes, quand la faim gagne ;
- puis les **voyageurs**, qui ne se brisent plus : ils ont vu vos lanternes.

**Le récit en recettes.**
- **Les étapes de civilisation** : le camp devient village (la recette *Village*), peuple (qui se nomme), puis *Civilisation* (Ville + Écriture), quand le peuple réapprend à écrire grâce aux runes de Galet.
- **Les bêtes** naissent sur l'île à mesure qu'on les écrit : le Bestiaire vivant.
- **Le secret de Brume (acte VI)** : sa solitude fait la brume qui brise les bateaux. Le peuple la fait renaître : **Phénix = Feu + Vie**, sa flamme et leur vie.
- **Acte VII** : on écrit **Feu follet = Feu + Marais**, la recette de Brume. Ce qui est écrit ne s'oublie plus : Brume ne sera plus jamais seule. Elle devient la flamme du **Phare de Brume**, dont le plan est justement « Feu follet ».

**Anya, l'Âme de l'Île** (ajout de la version 5).
- C'est l'esprit de la vie de l'île, le plus respecté et le plus puissant : la gemme au centre de la couverture du Grimoire, entourée des sept sceaux.
- **On ne la voit pas, on la devine**, trace après trace :
  - une voix quand on écrit la Vie ;
  - une rune lue par Galet ;
  - les bêtes qui se tournent toutes du même côté ;
  - douze traces, une par terre nouvelle explorée.
- **Elle se révèle quand toute l'île principale est découverte.** Au Cercle de menhirs, chaque maître se place devant sa pierre, les sept sceaux s'allument, et Anya se lève.
- **Ce qu'elle apporte** : sa Bénédiction, son Souffle (un indice par jour) et ses propres créatures.
- **Brume**, née de sa dernière pensée avant le sommeil, retrouve enfin sa famille.

**L'arc de l'île** suit le Grand Œuvre des alchimistes : la nuit de la brume, puis l'argent de la lune, puis l'aube dorée, puis le rouge-or du Soleil.

**Sans risque pour les données** : aucune migration de base. Une seule donnée nouvelle, le nom du peuple, dans une table qui existe déjà.

---

## 1. Ce qui existe déjà (la recherche)

### 1.1 Le Grimoire

- **Les chapitres** (`B/src/services/bookPages.js:10-30`).
  - 7 chapitres de familles d'éléments ; un chapitre s'ouvre quand le nombre de **découvertes** atteint son seuil.
  - Une découverte est un élément possédé, hors Eau, Feu, Terre et Air.
- **Les sceaux** : le Grimoire dessine **un sceau planétaire par chapitre**, les sept métaux de l'alchimie (`F/src/book/grimoire.js:7-16`).

| Ch | Nom | Sceau (métal) | Familles (éléments) | Ouvre à |
|---|---|---|---|---|
| I | Les Premiers Souffles | ☿ Mercure (vif-argent) | Éléments fondamentaux 4, Phénomènes naturels 57 | 0 |
| II | La Matière | ♄ Saturne (plomb) | Matériaux 60, Chimie 35, Physique 39 | **0 (décidé : 3)** |
| III | Ciel et Terre | ☾ Lune (argent) | Cosmos 30, Formations naturelles 45 | 5 |
| IV | Le Vivant | ♀ Vénus (cuivre) | Flore 46, Biologie 32, Vie et créatures 84 | 12 |
| V | Le Foyer | ♂ Mars (fer) | Corps et esprit 42, Créations humaines 223 | 25 |
| VI | Les Âges | ♃ Jupiter (étain) | Histoire 28, Technologie 57 | 45 |
| VII | Les Légendes | ☉ Soleil (or) | Légendes 45 | 70 |

- **Les chiffres** : 827 éléments, 823 énigmes, 2 986 recettes.
- **Athanor** : 2 emplacements, un 3e à 3 familles découvertes, un 4e à 4 (`F/src/utils/eras.js:59-80`). La famille des éléments de base compte.
- **Le serveur accepte tout mélange de 2 à 4 ingrédients**, même pour un chapitre fermé.
- **Pages** : 3 ouvertes à la fois ; une page n'est « à portée » que si son élément peut naître de ce qu'on possède déjà.
- **Indices** : l'énigme ; les familles après un échec ; l'**Encre** (un ingrédient, 50 écus, ou offerte après 3 essais ratés aux chapitres I à IV, 5 ensuite) ; le **pendu des lettres**.
- **Économie** : le Grimoire ne fait que prendre des écus.

### 1.2 Les recettes qui portent l'histoire (vérifiées dans la base)

| Élément | Chapitre, famille | Profondeur | Recette la plus courte (chemin complet) |
|---|---|---|---|
| Vent | I, Phénomènes | 1 | Air + Air |
| Pluie | I, Phénomènes | 1 | Air + Eau |
| Brasier | I, Phénomènes | 1 | Feu + Feu |
| Boue | II, Matériaux | 1 | Eau + Terre |
| Brique | II, Matériaux | 2 | Boue + Feu |
| **Puits** | V, Créations humaines | 3 | Boue (Eau + Terre) → Brique (+ Feu) → **Brique + Eau** |
| **Vie** | IV | 1 | **Air + Eau + Feu + Terre** (4 ingrédients) |
| Plante | IV, Flore | 2 | Terre + Vie |
| **Arbre** | IV, Flore | 3 | Plante + Terre |
| **Lumière** | I, Phénomènes | 4 | Vapeur (Eau + Feu) → Nuage (Air + Vapeur) → Énergie (Feu + Vapeur) → Éclair (Nuage + Énergie) → **Feu + Éclair** |
| Lave | II | 1 | Feu + Terre |
| **Pierre** | II, Matériaux | 2 | **Air + Lave** |
| Métal | II | 3 | Feu + Pierre |
| **Bois** | IV, Flore | 4 | **Arbre + Métal** (aussi : Arbre + Hache) |
| **Four** | V | 3 | **Brique + Feu** |
| **Étoile** | III, Cosmos | 5 | **Feu + Lumière + Énergie** |
| **Village** | V | 4 | Maison + Maison, Famille + Famille, Cabane ×3 |
| **Bateau** | V | 5 | **Bois + Eau** |
| Poisson | IV, Vie et créatures | 2 | Eau + Vie |
| Grenouille | IV | 3 | Marais + Vie |
| Marais | III | 2 | Boue + Lac (Lac = Eau + Eau) |
| Magie | VII | 3 | Vie + Énergie |
| **Potion** | VII | 4 | **Eau + Magie + Plante** (aussi : Eau + Grimoire, Sorcier + Soupe) |
| Langage | V | 5 | Humain + Son |
| **Écriture** | V | 6 | **Langage + Pierre** (aussi : Argile + Langage, Encre + Plume) |
| **Livre** | V | 7 | Humain + Écriture |
| **Civilisation** | VI, Histoire | 5 | **Ville + Écriture**, Humain + Ville, Agriculture + Village |
| **Phénix** | VII | 2 | **Feu + Vie** |
| **Feu follet** | I, Phénomènes | 3 | **Feu + Marais** |
| Grimoire | VII | 5 | Livre + Magie |

**Le Bestiaire du Grimoire** (animaux qui existent comme éléments), du plus proche au plus lointain :
- Poisson (2), Méduse (2), Grenouille (3) ;
- Oiseau, Tortue, Papillon (4) ;
- Poule, Luciole, Abeille (5) ;
- Hibou (7) ;
- Renard, Hérisson, Écureuil, Cerf, Vache, Cochon, Chèvre, Dauphin, Baleine (9) ;
- Mouton, Chat, Chien (10).
- **N'existent pas** : Lapin, Héron, Mouette, Loutre, Koï. Ce seront **les créatures d'Anya** (§ 6.14).

### 1.3 L'île

- **Départ** (`B/src/services/world.js:419-447`) :
  - La Grève et son Feu de camp ;
  - ressources et écus à 0, 3 parties de Récolte ;
  - **compte obligatoire** (402 pour un invité).
- **Habitants** : un habitant « vit sur l'île quand son bâtiment est bâti » (`world.js:285`).
  - Les prénoms et les cadeaux préférés sont dans `B/src/services/villagers.js:7-15`, et sont cités par `B/test/play.test.js`.
  - Les répliques sont dans `F/src/world/friends.js` et `F/src/world/village.js`.

| Bâtiment | Quartier (chapitre, prix) | Habitant actuel | Plan du palier I | Coût du palier I |
|---|---|---|---|---|
| Foyer | La Grève | Paulette, cuisinière | — | — |
| Puits | La Source (I, 100) | Anatole, porteur d'eau | Puits | 10 pierre |
| Bosquet | La Lisière (I, 150) | Léonie, bûcheronne | Arbre | 5 pierre |
| Carrière | La Colline (II, 250) | Gaspard, mineur | Pierre | 5 bois |
| Potager | Les Jardins (III, 400) | Rose, jardinière | Plante | 8 eau |
| Atelier | Le Faubourg (III, 600) | Ferdinand, forgeron | Four | 15 pierre, 10 bois |
| Ponton | La Crique (IV, 900) | Marine, pêcheuse | Bateau | 25 bois |

- **Autres plans** : Abri = Bois (20 bois, 10 pierre) ; Maison de l'alchimiste = Potion ; Tour d'étude = Livre ; **Phare de Brume = Feu follet**.
- **Créations d'île** (`B/src/services/crafts.js`) :
  - 30 au catalogue ; palier « start » ouvert ; palier I au chapitre I fini (décidé : 10 découvertes) ;
  - chacune demande des éléments du Grimoire comme savoir-faire. Exemples : Lanterne = Feu + **Lumière** ; Longue-vue = Étoile + Lentille.
- **Quêtes de Brume** (`B/src/services/quests.js`) : 21 quêtes en 7 actes. Objectifs possibles : crafts, runs, stars, zone, level.

### 1.4 Le récit existant

- un « dernier alchimiste » parti ;
- 12 mots dans les bouteilles, dont « Si tu lis ceci, l'île t'a choisi » et « J'ai laissé la clé du phare sous une pierre » ;
- « chaque découverte repousse la brume » ;
- le menhir « plus vieux que l'île » ;
- **aucun naufrage**.

---

## 2. Ce qui casse le fil aujourd'hui

| # | Constat | Ce qui le règle (§) |
|---|---|---|
| G1 | Le jeu s'ouvre sur le Grimoire, sans arrivée ; l'île demande un compte | tutoriel sur la Grève ; compte quand Aster demande ton nom (§ 9) |
| G2 | Brume se présente deux fois ; son genre change | une rencontre, *elle* (§ 13) |
| G3 | Le chapitre II est ouvert d'emblée | ouvert à 3 découvertes, pendant l'étape 1 (§ 9) |
| G4 | **21 plans sur 48** appartiennent à un chapitre pas encore ouvert quand leur palier s'ouvre ; aucune énigme ne les propose | **fil d'Ariane** (§ 6.1) |
| G5 | La quête 1 demande 8 bois avec 0 bois | Récolte (étape 2) avant la création (étape 4) |
| G6 | Le 1er besoin de Paulette (3 créations) est un échec d'office | 1er besoin : la soupe ; « créations » vient plus tard (§ 6.6) |
| G7 | Palier I de l'établi au chapitre I fini (61 pages) | 10 découvertes |
| G8 | Les chapitres s'ouvrent bien plus vite que l'histoire n'avance | les veillées suivent les **actes** (quêtes), les sceaux suivent les découvertes (§ 6.8) |
| G9 | Aucun geste guidé | 5 étapes, une chose à la fois |
| G10 | Des habitants sans rencontre, sans passé, sans voix | la troupe (§ 8) |
| G11 | Livre / Codex / Grimoire | « Grimoire », vrai nom *Codex Mundi* |
| G12 | Le Grimoire ne rapporte pas d'écus ; démarrage à 0 | les quêtes du tutoriel paient La Source ; les Savoirs donnent des indices gratuits (§ 6.4) |

---

## 3. Les piliers

1. **Le Grimoire est le secret de tout.** Il rend la mémoire, invente, fait naître les bêtes. Quand on bloque, la réponse est une page.
2. **Tout est recette.** Chaque moment fort de l'histoire est une vraie recette. On ne regarde pas l'histoire : on l'écrit.
3. **Ce qu'on écrit renaît sur l'île.** Littéralement : un souvenir rend un métier, une invention fait un bâtiment, une bête écrite apparaît.
4. **Ensemble.**
   - La Vie, ce sont les quatre Souffles réunis.
   - Les liens entre naufragés sont des recettes à quatre mains.
   - Chaque acte se ferme autour du feu.
5. **Chaque nouveau venu répond à un manque** : un personnage = un besoin + une mécanique + un sceau.
6. **Doux, drôle, jamais punitif** (tout public). Personne ne part ; l'échec donne un indice.
7. **Le serveur reste seul juge.** Toute la mise en scène est déduite de l'état réel : quêtes, quartiers, bâtiments, éléments.

---

## 4. Le système magique : l'Art

### 4.1 Les quatre Souffles

- Le Grimoire commence par quatre éléments, l'**Eau**, le **Feu**, la **Terre** et l'**Air** : ce sont les quatre Souffles.
- Les quatre fondateurs venus de *l'Hirondelle* en portent chacun un, sans le savoir :

  | Souffle | Fondateur | Pourquoi |
  |---|---|---|
  | Air | Aster | les vents |
  | Feu | Cannelle | le foyer |
  | Terre | Rivet | le métal, la matière qu'on façonne |
  | Eau | Ondin | les sources |

- **La recette « Vie » = Air + Eau + Feu + Terre** demande les quatre ensemble. C'est le cœur du thème, et la première fois que le joueur l'écrit est une scène (acte I).

### 4.2 Les sept Sceaux et leurs maîtres

- Les sept chapitres sont scellés par les sept sceaux planétaires déjà dessinés.
- **Chaque sceau a un maître** : le personnage dont l'Art correspond aux familles du chapitre.
- Le maître souffle des **Savoirs** sur les pages de son chapitre (§ 6.4). Un sceau peut se briser avant l'arrivée de son maître : il « attend son gardien ».

| Sceau | Chapitre | Maître | Son Art (familles) |
|---|---|---|---|
| ☿ Mercure | I Les Premiers Souffles | **Aster** | Phénomènes naturels : vents, pluies, orages, lumières |
| ♄ Saturne | II La Matière | **Galet** | Matériaux, Chimie, Physique |
| ☾ Lune | III Ciel et Terre | **Ondin** | Cosmos, Formations naturelles : sources, rivières, astres |
| ♀ Vénus | IV Le Vivant | **Sylve** (la faune) et **Mélisse** (la flore) | Vie et créatures ; Flore, Biologie |
| ♂ Mars | V Le Foyer | **Cannelle** | Corps et esprit, Créations humaines |
| ♃ Jupiter | VI Les Âges | **Rivet** | Histoire, Technologie |
| ☉ Soleil | VII Les Légendes | **Brume** | Légendes |

Chaque personnage porte son sceau brodé ou gravé : c'est un repère visuel immédiat.

### 4.3 Le Grand Œuvre : l'arc de l'île

L'alchimie transforme la nuit en or en quatre étapes. L'île suit le même chemin :

| Étape alchimique | Actes | L'île | La lumière | Brume |
|---|---|---|---|---|
| **Œuvre au noir** (*nigredo*) | tutoriel, I, II | survivre dans la brume | nuits bleues, brume épaisse | pâle, bleutée |
| **Œuvre au blanc** (*albedo*) | III, IV | la lune, l'eau, le vivant qui revient | argent, aubes laiteuses | blanche, étoilée |
| **Œuvre au jaune** (*citrinitas*) | V, VI | le foyer, la mémoire | aube dorée, fenêtres allumées | ambrée |
| **Œuvre au rouge** (*rubedo*) | VII | le Phare | rouge et or | couronne, puis soleil |

### 4.4 Ce qu'on écrit renaît sur l'île : les quatre façons

| Ce qu'on écrit | Ce qui naît sur l'île | Règle (§) |
|---|---|---|
| Le **souvenir** d'un naufragé (plan du palier I) | son métier revient, son bâtiment peut sortir de terre | 6.2 |
| Une **invention** (plan des paliers suivants, savoir-faire d'une création) | le bâtiment ou la création devient possible | 6.3 |
| Une **bête** du Bestiaire | elle apparaît dans les quartiers à soi | 6.5 |
| Une **lumière** (Lumière, puis les Lanternes) | la brume recule, et les bateaux trouvent l'île | 10, actes I et IV |

### 4.5 Le Cœur du Grimoire : Anya

- **La gemme** : au centre de la couverture du Grimoire, entre les sept sceaux, il y a une gemme qui ne porte aucune planète. Elle « s'éveille » déjà dans l'animation d'ouverture (`F/src/components/Book/GrimoireBinding.vue:201-203`).
- **Ce qu'elle est** : pour les alchimistes, les sept planètes tournaient autour de la **Terre**. La gemme, c'est la Terre : **Anya, l'Âme de l'Île**, la vie de toute chose.
  - Les sept sceaux sont ses gardiens.
  - Les maîtres de la troupe en sont les héritiers, sans le savoir.
- **Le même dessin existe déjà sur l'île** : le **Cercle de menhirs**, « sept pierres dressées, plus vieilles que l'île ; leurs gravures luisent à la nuit tombée » (`B/src/services/landmarks.js:26`). Les sept pierres sont les sept sceaux ; le centre du cercle est la place d'Anya.
- **Son nom secret** : la recette **Vie** (Air + Eau + Feu + Terre). En l'écrivant à l'acte I, le joueur l'appelle sans le savoir.

---

## 5. La boucle de jeu : pourquoi chaque chose, qui l'enseigne

```
          ┌──── souvenirs, inventions, bêtes (ce qu'on écrit renaît) ────┐
          │                                                              ▼
  GRIMOIRE (l'esprit)  ◄── Savoirs des maîtres (indices) ──     ÎLE (bâtir)
  mélanger, deviner                                    bâtiments, quartiers, créations
          ▲                                                       │   ▲
          │ écus : Encre, lettres                     production  │   │ pierre, bois,
          │                                           et écus     ▼   │ eau, nourriture
          └──────────────── ÉCUS ◄─────────────────────────── RÉCOLTE (les mains)
                              ▲
  NAUFRAGÉS (le cœur) ────────┘ humeur ±10 %, amitié (passé raconté), liens, veillées
  EXPLORATION (l'horizon) → ruines des Anciens, trouvailles → créations de climat
```

En une phrase pour le joueur : **« Le Grimoire rend la mémoire, invente et fait naître ; la Récolte donne de quoi bâtir ; l'île rend des écus ; et les naufragés en font un peuple. »**

| Système | Pourquoi | Qui l'enseigne | Quand | Geste |
|---|---|---|---|---|
| Grimoire, Athanor, énigmes, Encre | savoir, souvenirs, inventions, bêtes | **Brume** | étape 1 | 2 à 4 éléments ; lire l'énigme |
| Récolte | les matières, des écus, des coffres | **Aster** | étape 2 | relier au moins 3 cases pareilles |
| Besoins, humeur, fiche | la vie des naufragés ; ±10 % | **Cannelle** | étape 3 | donner ce qui manque |
| Établi, puzzle, pose | embellir, protéger, combler des besoins | **Rivet** | étape 4 | assembler, puis poser sur une case dorée |
| Quartier, souvenir, bâtiment, ramasser | le métier d'un naufragé, la production | **Ondin** | étape 5 | acheter, réveiller, écrire, bâtir, ramasser |
| Fil d'Ariane | trouver les recettes profondes | Brume | étape 5 | suivre le ruban |
| Annexes, palier I de l'établi, lumières | produire plus, éclairer | **Sylve**, Brume | acte I | poser autour du bâtiment |
| Savoirs | un indice par jour, par maître | chaque maître | dès son arrivée | bavarder |
| Pose « près de », Épreuve | créations avancées ; autre clé de l'établi | **Galet** | acte II | — |
| Expéditions, ruines, Chronique, outils, mini-jeux | l'horizon, le passé, la forge | **Mélisse**, **Rivet**, Galet | acte III | boussole |
| Bestiaire, visiteurs, cœurs, gisements, climat | le vivant, les autres | Sylve, **Aster** | acte IV | écrire une bête ; combler |
| Maisons, installation, enseignes, nom du peuple | le peuple grandit | **Cannelle** | acte V | poser une maison ; nommer |

---

## 6. Les mécaniques (règles exactes)

### 6.1 Le fil d'Ariane (la page marquée)

- **Le problème** : une page n'est « à portée » que si ses ingrédients sont déjà possédés. Un plan profond, comme Bateau (profondeur 5) ou Livre (7), ne peut donc jamais apparaître.
- **La règle.**
  1. **La cible** est déduite de la quête active : l'élément qu'elle demande (`element`), ou le plan du palier qu'elle demande (`level`), ou le savoir-faire de la création qu'elle demande (`craft`).
  2. **Le chemin** : le serveur calcule le chemin de recettes le plus court depuis les éléments du joueur jusqu'à la cible. C'est une recherche en largeur sur les 2 986 recettes, qui se calcule en une fraction de seconde (à mesurer).
  3. **La page marquée** est la **première étape encore manquante dont les ingrédients sont tous possédés**. Exemple pour Puits sans rien d'autre que les quatre Souffles : d'abord Boue, puis Brique, puis Puits.
  4. Le ruban indique la cible et la distance : « Vers : Puits — encore 2 pages ».
  5. **Une seule page marquée à la fois.** Elle s'ajoute aux 3 pages ouvertes et s'ouvre **même si son chapitre est fermé**.
- **Ce qui ne change pas** : l'énigme, le plateau et les indices sont ceux de toute page. La page marquée ne révèle rien de plus.
- **Rien n'est stocké** : tout est recalculé depuis la quête active et les éléments possédés.

### 6.2 Les souvenirs (palier I)

- Le plan du palier I de chaque bâtiment est le **souvenir** de son maître : il a oublié son don dans le naufrage.
- Quand on le réveille, la quête active devient « Rends son souvenir à … » : un objectif `element`, avec le fil d'Ariane vers le plan.
- La découverte faite : courte scène, le sceau du personnage brille, il retrouve son don, et le palier I peut être bâti.
- **Si l'élément est déjà écrit**, il se souvient tout de suite : « Tes pages m'ont réveillée avant toi. » (cas de Mélisse, § 10, acte III).

### 6.3 Les inventions (paliers suivants et créations)

Même fil d'Ariane, déclenché par les quêtes `level` et `craft`. Le texte dit « Le Grimoire connaît cette invention ».

### 6.4 Les Savoirs des maîtres

- **Quand** : au premier bavardage de la journée avec un maître (la règle « une fois par jour » existe déjà pour les points d'amitié, dans `villagers.js`).
- **Ce que le maître fait** : il souffle un indice sur **une page ouverte ou marquée de son Art** (§ 4.2) :
  - moins de 2 cœurs : **la famille d'un ingrédient** encore manquant ;
  - 2 cœurs ou plus : **un ingrédient**, comme l'Encre.
- **Rien n'est stocké** :
  - l'indice est calculé et renvoyé **seulement** quand le bavardage compte (première fois du jour) ;
  - le front le garde sur l'appareil, comme l'Encre aujourd'hui (`oc_book_ink`) ;
  - s'il n'y a aucune page de son Art à portée, le maître dit une réplique normale.
- **Équilibrage à surveiller** : jusqu'à 8 indices par jour, alors que l'Encre coûte 50 écus et que c'est la seule dépense du Grimoire. Si c'est trop généreux : 2 cœurs pour la famille, 4 cœurs pour l'ingrédient.

### 6.5 Le Bestiaire vivant

- **Règle** : une bête **dessinée** apparaît dans les quartiers à soi dès que son élément est écrit dans le Grimoire.
  - Poisson, Méduse, Dauphin, Baleine : dans la mer.
  - Grenouille, Tortue : au bord de l'eau.
  - Papillon, Luciole, Abeille, Oiseau, Hibou : dans l'air ou les arbres.
  - Renard, Hérisson, Écureuil, Cerf : dans les bois.
- **Les bêtes de ferme** suivent toujours le palier du Potager ; l'élément (Poule, Vache…) leur ajoute une variante.
- **Les familiers** (§ 8) apparaissent auprès de leur maître quand leur élément est écrit.
- **Technique** :
  - c'est purement visuel, côté front ;
  - il faut que la vue de l'île connaisse les éléments possédés : **à vérifier** (le front les a pour le Grimoire ; sinon, les ajouter à la vue) ;
  - **Les 12 bêtes des climats** du lot 9e (renard des neiges, bouquetin, macareux, poney, grenouille, tortue, fennec, dromadaire, caméléon, toucan, salamandre, corbeau des cendres ; `F/src/world/animals.js`, `F/src/world/village.js`) **gardent leur règle** : une de chaque par quartier à soi de leur climat. Un joueur ne doit rien perdre. Le Bestiaire s'y **ajoute** pour les bêtes écrites dans le Grimoire.
  - La suite des bêtes (`PASSATION.md` § 7, point 1 : compagnons d'atelier, quêtes de rencontre) se range dans le Bestiaire et les familiers (H6) et dans les créatures d'Anya (H8). C'est à confirmer avec l'auteur. Les bêtes à dessiner en priorité sont au § 1.2.

### 6.6 La présence des personnages

- **Aujourd'hui** : un habitant n'existe qu'avec son bâtiment.
- **Demain** : un personnage est **présent dès sa rencontre**, et **travaille** dès que son bâtiment existe.

| Personnage | Présent à partir de | Avant son bâtiment |
|---|---|---|
| Aster | la création du compte (étape 2) | vit au camp de la Grève, parle, reçoit des cadeaux, a faim |
| Cannelle | la quête « Récolte » réclamée | le Foyer est déjà là |
| Rivet | la quête « soupe » réclamée | vit au camp ; c'est lui qui tient l'établi |
| Ondin, Sylve, Galet, Mélisse | leur quartier à soi : **endormis** jusqu'au réveil (amitié > 0) | — |

- L'humeur ne joue sur la production qu'une fois le bâtiment là.
- Le besoin « outils » commence avec l'Atelier (règle actuelle).
- Le besoin « créations » ne commence qu'après le tutoriel (corrige G6).
- **Joueurs actuels** : tous leurs bâtiments existent déjà, donc ils gardent tous leurs habitants (avec les nouveaux noms).

### 6.7 Les dormeurs et les arrivées sur besoin

- **Le schéma**, porté par la chaîne de quêtes :
  1. **le manque** : Brume ou un personnage le dit ;
  2. **le naufrage** : une image de nuit, une épave au loin, et Brume : « Cette nuit, un autre bateau s'est brisé… » ;
  3. **libérer le quartier**, **réveiller le dormeur**, **rendre son souvenir** (fil d'Ariane), **bâtir** ;
  4. **le manque se comble** : le bâtiment produit ce qui manquait.
- **Le dormeur** : il est dessiné côté front quand son quartier est à soi et son amitié à 0 ; il faut une pose « endormi » pour le générateur de personnages.

### 6.8 Les veillées et les recettes du récit

- **Les sceaux suivent les découvertes.** Ce sont des moments courts dans le Grimoire (effet de cire existant) ; s'il est là, le maître du chapitre réagit en une réplique.
- **Les veillées suivent les actes** : une veillée a lieu quand la dernière quête d'un acte est réclamée. Cette dernière quête est toujours une **recette du récit** (§ 10).
- **Le déroulé d'une veillée** (de 30 à 60 s, un toucher pour avancer, passable, rejouable dans la Chronique) :
  1. la nuit, le feu du Foyer, la troupe en cercle, Brume au-dessus ;
  2. les nouveaux venus se présentent ;
  3. le **rite** : chacun pose dans le feu un peu de son Art, et la recette du récit de l'acte s'y dessine en lumière ;
  4. une ou deux scènes de **lien** (§ 6.9) ;
  5. l'**étape de civilisation** est annoncée ;
  6. le nouvel horizon : la caméra survole les quartiers à libérer.
- « Déjà vue » est retenu sur l'appareil, et déduit des quêtes si l'on change d'appareil.

### 6.9 Les liens : des recettes à quatre mains

Chaque lien entre deux naufragés est **une recette qui réunit leurs Arts**. Sa scène se joue à la veillée, puis le lien et sa recette vont dans la Chronique.

| Lien | Naufragés | Recette du lien | Veillée | La scène |
|---|---|---|---|---|
| La soupe et la source | Cannelle et Ondin | Soupe = Eau + Feu + Poisson | I | elle le gronde parce qu'il dort debout ; il lui promet l'eau la plus claire de l'île |
| La Vie à quatre | Aster, Cannelle, Rivet, Ondin | Vie = Air + Eau + Feu + Terre | I | les quatre mains au-dessus du feu ; Brume dit le thème |
| La feuille et la flamme | Sylve et Cannelle | Phénix = Feu + Vie (annonce) | II | Sylve a peur du feu ; Cannelle lui montre le feu qui nourrit |
| Le bois et la pierre | Sylve et Galet | Bois = Arbre + Métal | II | elle refuse qu'on coupe ses arbres ; il lui montre le bois mort et le métal qui l'aide : l'Abri tient |
| L'enclume | Galet et Rivet | Marteau = Bois + Métal | III | Rivet forge le premier vrai ciseau de Galet ; « Hm. » (Brume traduit : « Il dit merci. ») |
| Le premier fruit | Sylve et Mélisse | Fruit = Arbre + Fleur | III | la forêt et le jardin plantent ensemble |
| Apprendre à nager | Aster et Ondin | Bateau = Bois + Eau | IV | Ondin a peur de l'eau profonde ; Aster lui apprend |
| La grande tablée | Cannelle et tous | Village = Maison + Maison | V | une table pour tous ; on y choisit le nom du peuple |
| Le pardon | tous et Brume | Phénix = Feu + Vie | VI | « Ta flamme, notre vie. » Brume renaît |

### 6.10 Les étapes de civilisation

| Étape | Atteinte à | Recette qui la marque |
|---|---|---|
| Le Campement | fin du tutoriel | — |
| Le Camp des naufragés | veillée I | Vie |
| Le Hameau | veillée II | Bois (l'Abri) |
| **Le Village** | veillée III | **Village** |
| Le Bourg | veillée IV | Bateau (le port s'ouvre) |
| **Le peuple de « … »** | veillée V | (le nom) |
| **La Civilisation** | veillée VI | **Civilisation** = Ville + Écriture |
| La Légende | veillée VII | Feu follet |

- **Calcul** : l'étape est déduite des actes faits ; rien à stocker.
- **Affichage** : la fiche du Foyer, l'Ex libris, le sous-titre de la quête.

### 6.11 Le nom du peuple

- **Quand** : à la veillée V, le joueur propose un nom de 22 caractères au plus.
- **Technique** : il se range dans la table `world_names` existante, avec la cible `peuple` (cible libre de 30 caractères, nom de 22), **sans migration**. La route et le service des noms doivent accepter cette cible, avec la même validation que les autres noms.

### 6.12 La Chronique

C'est un onglet du Carnet d'explorateur, la mémoire du peuple. Elle rassemble :
- les veillées (rejouables) ;
- les souvenirs retrouvés ;
- les liens et leurs recettes ;
- le Bestiaire ;
- les mots d'Héliane ;
- les ruines des Anciens.

### 6.13 Les mots d'Héliane (bouteilles)

- Un mot « d'histoire » par acte, dans la première bouteille ouverte après le début de l'acte. Les autres bouteilles gardent les mots drôles existants.
- Les mots sont signés **« H. »** ; le prénom, **Héliane**, se découvre à l'acte V.
- Les textes sont au § 10.

### 6.14 Anya : les Traces, la Révélation, la Bénédiction

**La condition de la Révélation** : toute l'île principale est découverte.
- Les **12 terres nouvelles sont explorées** (expédition revenue).
- Les **9 quartiers du cœur sont à soi** : Source, Lisière, Colline, Jardins, Faubourg, Hauteurs, Crique, Grande Forêt, Hameau. Il ne reste alors plus aucune brume sur l'île principale.
- Les îlots (L'Îlot aux Mouettes, L'Île des Légendes) n'en font pas partie.
- **Ce que ça demande vraiment** (vérifié sur la carte, `B/src/services/worldMap.js`, `NEIGHBORS`) :
  - seules Roselières et Contreforts touchent le cœur ;
  - pour explorer les 12 terres, il faut posséder en chaîne Roselières, Contreforts, Oasis, Canopée, Cascade et Coulées ;
  - soit environ **16 400 écus de quartiers** (6 100 pour le cœur, 10 300 pour ces six terres), et le chapitre VI ouvert ;
  - la Révélation tombe donc **au plus tôt vers l'acte VI**, et le plus souvent **après le Phare**.
- **Rien à stocker** : la condition se déduit des quartiers à soi et des expéditions revenues.

**Les Traces d'Anya (la découverte progressive).**
- **Quatre pressentiments dans l'histoire** (§ 10) :
  - la voix quand on écrit la Vie (acte I) ;
  - la rune de Galet (acte III) ;
  - les bêtes qui se tournent vers les menhirs (acte IV) ;
  - l'aveu de Brume (acte VI).
- **Douze traces, une par terre nouvelle explorée** : au retour de l'expédition, une image de 2 secondes et une ligne dans la Chronique (« Traces d'Anya : 5 / 12 »).

| Terre | Trace |
|---|---|
| Lande aux Menhirs | Les pierres sont tièdes, comme une main. |
| Roselières | Tous les roseaux s'inclinent du même côté. |
| Falaises du Couchant | Une plume d'or, bien trop grande pour un oiseau. |
| Bayou des Lucioles | Les lucioles dessinent un visage, puis s'éparpillent. |
| Contreforts | Une empreinte de cerf, faite de lumière. |
| Oasis cachée | Une fleur a poussé dans le sable pendant la nuit. |
| Neiges éternelles | Un cercle de fleurs ouvertes dans la neige. |
| Dunes d'Or | Le vent chante deux syllabes : « A… nya ». |
| Canopée | Tous les oiseaux se taisent ensemble, puis chantent. |
| Cascade des Brumes | Dans l'écume, une silhouette coiffée de branches. |
| Coulées noires | La lave s'écarte autour d'une pousse verte. |
| Cratère | Au fond, un battement : un cœur qui s'éveille. |

- **Le respect immense** : les personnages parlent d'elle à voix basse.
  - Sylve baisse les yeux.
  - Galet ôte son bonnet.
  - Cannelle pose chaque soir un bol de soupe « pour la Dame » au bord du Foyer : un détail visible la nuit.

**La Révélation** (une seule fois, à l'aube qui suit la condition remplie) :
1. Brume appelle toute la troupe au Cercle de menhirs.
2. **Chaque maître se place devant sa pierre** : Aster ☿, Galet ♄, Ondin ☾, Sylve et Mélisse ♀, Cannelle ♂, Rivet ♃, Brume ☉. Les sept sigles s'allument un à un, comme sur la couverture du Grimoire.
3. Le centre du cercle fleurit. Les bêtes du Bestiaire arrivent de partout et se couchent. **Anya se lève.**
4. Elle parle (sa fiche, § 8), puis elle souffle sur le Grimoire : **la gemme de la couverture s'allume pour toujours**.
5. Sa dernière réplique dépend du Phare :
   - Phare pas encore allumé : « Allume ton phare, petite flamme. Je veillerai sur la terre. »
   - Phare allumé : « Ta lumière guide la mer. La mienne gardera la terre. »

**Ce qu'Anya apporte ensuite.**
- **La Bénédiction d'Anya** : un effet durable, comme ceux des lieux remarquables.
  - Les gisements de climat repoussent en **4 h au lieu de 6 h**.
  - L'humeur des naufragés ne descend plus sous « content » : plus de malus.
  - Équilibrage à confirmer.
- **Le Souffle d'Anya** : elle apparaît au Cercle à l'aube et au crépuscule (l'horloge du jeu existe déjà). Un toucher, une fois par jour, révèle **un ingrédient** sur n'importe quelle page ouverte ou marquée.
- **Les créatures d'Anya** : les bêtes qui **n'existent pas** dans le Grimoire (lapins, hérons, mouettes, loutres, koïs) n'apparaissent qu'avec elle, car ce sont les siennes. Le Bestiaire dépasse alors le Grimoire.
- **Le Cercle fleuri** : le dessin du lieu remarquable change (des fleurs, une lueur au centre).

**Technique** (sans migration) :
- la condition et les traces sont déduites dans la vue de l'île (`anya: { traces, awake }`) ;
- la Bénédiction passe par :
  - la chaîne des bonus, comme `landmarks.bonusesOf` ;
  - `finds.readyIn`, avec la durée de repousse en paramètre ;
  - l'humeur dans `villagers.js` ;
- le Souffle passe par la route de bavardage, qui accepte la cible `anya` quand elle est éveillée. Le « une fois par jour » se range dans `world_friends` (la cible `anya` tient dans les 20 caractères de la colonne) ;
- la scène, la gemme, les créatures et le Cercle fleuri sont côté front.

---

## 7. L'histoire

### 7.1 Synopsis

> *L'Hirondelle* emmenait quatre voyageurs et toi vers une vie nouvelle, quand une brume épaisse s'est levée sur la mer.
>
> Tu te réveilles sur la Grève. Une flamme bleue te regarde, et tu as peur. Elle aussi : c'est **Brume**, qui n'a vu personne depuis des siècles. Elle allume un feu et te confie le livre qu'elle garde sans savoir le lire : le **Grimoire**. Ce qu'on y écrit renaît sur l'île.
>
> Tu écris le Vent. Il chasse la brume de la plage, où **Aster**, la navigatrice, repêche ce que la mer a pris. Derrière l'épave, **Cannelle**, la cuisinière, cherche son petit-neveu en grelottant. Sous une voile, **Rivet** compte ses vis. À la Source, **Ondin** dort contre un rocher, sa baguette de sourcier à la main. Il ne sait plus trouver l'eau, jusqu'à ce que tu écrives le Puits.
>
> Un jour, tu poses dans l'Athanor l'Air, l'Eau, le Feu et la Terre ensemble, et tu écris la **Vie**. *« Aster, Ondin, Cannelle, Rivet. Ensemble, la Vie. »* Les arbres renaissent, et avec eux **Sylve**, une sauvageonne échouée sur un radeau. Puis l'orage amène **Galet**, vieux tailleur de runes, et la faim amène **Mélisse**, jardinière des lunes.
>
> Vous allumez des lanternes. Un soir, une barque approche, et elle ne se brise pas : ses passagers ont vu vos lumières. Le camp devient village, puis un peuple qui se choisit un nom. Sous la brume dorment les ruines des **Anciens**, des naufragés d'autrefois. Ils ont cessé d'écrire, et la brume les a effacés. Galet déchiffre leurs runes ; le peuple réapprend à écrire, et devient une **civilisation**.
>
> Alors Brume comprend : sa solitude fait la brume de la mer, et c'est elle qui a brisé tous ces bateaux. Elle s'éteint presque. Autour du feu, chacun lui tend son Souffle : *« Ta flamme, notre vie. »* Brume renaît en **Phénix**.
>
> Au dernier chapitre, guidés par le Passeur jusqu'à l'Île des Légendes, vous lisez le dernier mot d'**Héliane**, la dernière alchimiste. Tu écris enfin **Feu follet** : Feu + Marais, la recette de Brume. Ce qui est écrit ne s'oublie plus. Brume ne sera plus jamais seule : elle devient la flamme du **Phare de Brume**, et les navires n'y meurent plus. Ils y arrivent.
>
> Bien plus tard, quand plus aucune brume ne couvre l'île principale, les traces se rejoignent : une plume d'or, une empreinte de lumière, un chant dans les dunes. À l'aube, au Cercle de menhirs, chaque maître se place devant sa pierre, et les sept sceaux s'allument. Au centre se lève **Anya**, l'Âme de l'Île, celle qui vous avait choisis. *« Vous m'avez écrite bien avant de me voir. »* Brume, née de sa dernière pensée avant le sommeil, n'est plus seule : elle a retrouvé sa famille.

### 7.2 L'univers

- **L'île** : elle « choisit » ceux qui y échouent. Elle vit tant qu'on se souvient d'elle.
- **La brume** :
  - sur l'île, c'est l'oubli ; elle endort sans faire de mal, et c'est pourquoi les naufragés dorment ;
  - sur la mer, c'est le chagrin de Brume ; elle égare les bateaux.
  - Les lumières, les découvertes et les amitiés la repoussent.
- **Anya, l'Âme de l'Île** : l'esprit de la vie de l'île (les bêtes, les plantes, les saisons), le plus ancien et le plus puissant.
  - C'est elle qui « choisit » les naufragés.
  - Elle s'est endormie quand les Anciens ont cessé d'écrire la vie.
  - Elle se réveille quand l'île principale est de nouveau toute découverte (§ 6.14).
- **Brume** : un feu follet (Feu + Marais), né de la **dernière pensée d'Anya** avant son sommeil : une petite flamme pour veiller. Seule depuis, elle garde le Grimoire, sans connaître son origine.
- **Le Grimoire (*Codex Mundi*)** : écrit par les Anciens. C'est le livre où le monde s'écrit et se souvient ; ses sept sceaux sont les sept planètes.
- **Les Anciens** : la civilisation d'avant, faite elle aussi de naufragés.
  - Ils ont cessé d'écrire ; la brume les a effacés ; les derniers sont partis avec le Passeur.
  - Leurs ruines sont les lieux remarquables.
- **Héliane** : la dernière alchimiste des Anciens, drôle et distraite. Ses mots dans les bouteilles traversent les siècles.
- **Le Passeur** : il mène les âmes et les barques jusqu'à l'Île des Légendes, île flottante.

### 7.3 Le thème

Une civilisation, ce sont des gens qui **se souviennent ensemble** et qui **s'entraident**. Les Anciens ont oublié : la brume les a effacés. Les naufragés écrivent, et ils vivent. Brume, qu'on écrit enfin, ne sera plus jamais seule.

### 7.4 Ton et règles d'écriture

- **Le registre** : toujours « tu » ; au plus **140 caractères par bulle**, deux bulles au plus avant de rendre la main.
- **Chaque personnage a sa voix** (§ 8). On doit le reconnaître sans voir son nom.
- **Le ton** : drôle par petites touches ; la peur dure 5 secondes, le chagrin de Brume une veillée.
- **Les mots** : pierre, bois, eau, nourriture (pas « ressources ») ; « sort de la brume » (pas « se débloque »).

---

## 8. La troupe (fiches complètes)

### 8.1 Le tableau de remplacement (anciens → nouveaux)

Les identifiants (bâtiments) ne changent pas, donc rien ne bouge en base.

| Bâtiment (id) | Ancien | Nouveau | Rôle | Cadeau adoré / apprécié (proposé) |
|---|---|---|---|---|
| foyer | Paulette, Cuisinière | **Cannelle** | Cuisinière-guérisseuse | nourriture / eau (inchangé) |
| ponton | Marine, Pêcheuse | **Aster** | Navigatrice | bois / nourriture (inchangé) |
| atelier | Ferdinand, Forgeron | **Rivet** | Horloger-artificier | pierre / bois (inchangé) |
| puits | Anatole, Porteur d'eau | **Ondin** | Petit sourcier | eau / nourriture (avant : bois / pierre ; il adore l'eau) |
| bosquet | Léonie, Bûcheronne | **Sylve** | Gardienne des bois | eau / nourriture (avant : nourriture / eau ; on n'offre pas du bois coupé à Sylve !) |
| carriere | Gaspard, Mineur | **Galet** | Tailleur de runes | nourriture / pierre (avant : nourriture / bois) |
| potager | Rose, Jardinière | **Mélisse** | Jardinière des lunes | eau / nourriture (inchangé) |

### 8.2 Les fiches

---

#### Brume — le feu follet ☉ (Soleil, à la fin)
- **Ce qu'elle est** : un feu follet (Feu + Marais), né de la solitude de l'île, en vérité de la dernière pensée d'Anya endormie, ce qu'elle ignore. C'est la gardienne du Grimoire.
- **Apparence** : une flamme bleutée avec deux grands yeux (le dessin actuel). Elle gagne un ornement par acte (§ 13).
- **Personnalité** : timide, puis tendre ; émerveillée par chaque découverte ; un peu bavarde ; ne gronde jamais.
- **Voix** : douce, avec des « … » ; elle t'appelle « toi qui lis » ; elle compte les lumières de l'île à voix haute. Running gag : elle **traduit les « Hm » de Galet**.
- **Ce qui lui fait peur** : être oubliée.
- **Arc** : flamme apeurée → amie → coupable (acte VI) → Phénix → Soleil du Phare.
- **Première réplique** : « Ah ! Tu… tu me vois ? Personne ne m'a vue depuis si longtemps. »

---

#### Aster — la navigatrice · Souffle de l'Air · ☿ Mercure (chapitre I)
- **Bâtiment** : Ponton (La Crique). **Arrivée** : tutoriel, étape 2 ; elle repêche les débris dans les vagues.
- **Apparence** (générateur) : ciré jaune, foulard rouge, longue-vue à la ceinture, cheveux noués par le vent, taches de rousseur, bottes trop grandes.
- **Personnalité** : intrépide, impatiente, rieuse, incapable de rester assise ; elle donne un nom à chaque nuage.
- **Voix** : phrases courtes, impératives, pleines de marine. « Par tous les alizés ! » « Cap au nord ! »
- **Sa magie** : **lire le vent**. Elle sent le temps qu'il fera (la météo de l'île existe déjà), et un sifflement fait tourner la brise.
- **Familier** : **Bosco**, un petit macareux bougon (élément **Oiseau**, profondeur 4 ; le dessin du macareux existe depuis le lot 9e).
- **Ce qu'elle apprend au joueur** : la **Récolte** ; plus tard, les **visiteurs**.
- **Savoir** : Phénomènes naturels.
- **Souvenir** : **Bateau** (Bois + Eau), retrouvé à l'acte IV. Elle n'a pas perdu son métier, elle a perdu son **courage** : « Je ne sais plus tenir une barre. »
- **Secret et arc** : elle était à la barre quand *l'Hirondelle* s'est brisée, et elle se croit coupable. À l'acte VI, elle comprend que c'était la brume, et c'est **la première à pardonner à Brume** : « Moi aussi, je croyais que c'était ma faute. »
- **Son passé, cœur après cœur** :
  1. sa grand-mère gardait un phare, et lui a appris les vents ;
  2. le tour du monde qu'elle voulait faire ;
  3. un frère perdu dans une brume, il y a des années (idée gardée pour plus tard) ;
  4. la nuit du naufrage ;
  5. « Je reste. La mer peut attendre. »
- **Première réplique** : « Toi aussi, tu étais sur l'Hirondelle ? Comment tu t'appelles ? »

---

#### Cannelle — la cuisinière-guérisseuse · Souffle du Feu · ♂ Mars (chapitre V)
- **Bâtiment** : Foyer. **Arrivée** : tutoriel, étape 3 ; elle grelotte derrière l'épave.
- **Apparence** : grande et ronde, tablier constellé de taches, louche de cuivre géante en bandoulière, chignon piqué d'une cuillère, joues rouges.
- **Personnalité** : tonitruante, superstitieuse, généreuse jusqu'à l'excès, jamais d'accord, très tendre au fond. Elle veut nourrir tout le monde, Brume comprise (« Tu manges, toi ? »).
- **Voix** : proverbes de cuisine qu'elle invente (« Ce qui mijote ne se presse pas ! ») et surnoms (« mon caneton », « ma brindille »).
- **Sa magie** : **ses soupes sont des potions** : elles soignent l'humeur. C'est elle qui donne leur sens aux besoins et à l'humeur.
- **Familier** : **Bouillon**, une grenouille dodue qui goûte tout (élément **Grenouille** = Marais + Vie ; dessin du lot 9e).
- **Ce qu'elle apprend au joueur** : les **besoins** ; plus tard, les **maisons**.
- **Savoir** : Corps et esprit, Créations humaines.
- **Souvenir** : le **Feu**. Elle se souvient tout de suite devant le feu de camp.
- **Ce qu'elle a perdu d'elle-même** : **le goût**, dans le naufrage. Il lui revient à l'acte V avec la **Potion**.
- **Lien de sang** : **grand-tante d'Ondin**. Dès l'étape 3 : « Où est mon Ondin ? » Ils se retrouvent à l'étape 5.
- **Son passé, cœur après cœur** :
  1. son auberge sur un port ;
  2. pourquoi elle emmenait Ondin (« ses parents l'attendent de l'autre côté ») ;
  3. elle a eu peur des feux follets toute sa vie, et maintenant elle en aime un ;
  4. l'aveu du goût perdu ;
  5. « Une cuillère pour le corps, une pour l'âme… et une pour toi. »
- **Première réplique** : « Un feu follet ! … Oh. Il est mignon. »

---

#### Rivet — l'horloger-artificier · Souffle de la Terre · ♃ Jupiter (chapitre VI)
- **Bâtiment** : établi du Foyer, puis Atelier (Le Faubourg). **Arrivée** : tutoriel, étape 4 ; il compte ses vis sous une voile échouée.
- **Apparence** : lunettes à quatre loupes empilées, tablier de cuir aux mille poches, mèche grise rebelle, un crayon derrière chaque oreille.
- **Personnalité** : perfectionniste et distrait, enthousiaste, parle trop vite ; il démonte tout pour comprendre ; ses jeux de mots tombent toujours à plat.
- **Voix** : il s'interrompt pour une idée (« Attends… Non. Si ! Si ! ») et ponctue de bruits mécaniques (« clic », « tac »).
- **Sa magie** : **l'artifice**. Il donne un peu de vie aux objets ; les créations de l'île s'animent déjà, et c'est lui.
- **Familier** : **Tic-Tac**, une abeille mécanique à remontoir qui s'arrête au mauvais moment. C'est sa création ; quand on écrit **Abeille**, il lui fabrique une amie.
- **Ce qu'il apprend au joueur** : **créer** (établi, puzzle, pose) ; plus tard, les **outils**.
- **Savoir** : Histoire, Technologie.
- **Souvenir** : **Four** (Brique + Feu), pour sa vraie forge, à l'acte III.
- **Secret et arc** : un de ses automates a mis le feu à son atelier, jadis. Depuis, il n'ose plus rien créer de grand. À l'acte VII, il construit le **mécanisme du Phare** (la lentille qui tourne).
- **Son passé, cœur après cœur** :
  1. l'horloge de son village, qu'il a réparée enfant ;
  2. ses automates ;
  3. l'incendie ;
  4. pourquoi il est parti ;
  5. « Presque tout peut se réparer. Même moi. »
- **Première réplique** : « Montre-moi tes mains. Hum. On va arranger ça. »

---

#### Ondin — le petit sourcier · Souffle de l'Eau · ☾ Lune (chapitre III)
- **Bâtiment** : Puits (La Source). **Arrivée** : tutoriel, étape 5 ; il dort à La Source.
- **Apparence** : 10 ans, ciré bleu trop grand aux manches retroussées, bonnet de nuit, pieds nus, baguette de noisetier fourchue, bocal en verre vide.
- **Personnalité** : rêveur, toujours à moitié endormi (la brume le tient encore), il pose des questions étranges et profondes et parle à la lune et à l'eau. Drôle sans le vouloir.
- **Voix** : il chuchote (« Chut… l'eau parle. ») et raconte ses rêves comme s'ils étaient vrais.
- **Sa magie** : **la sourcellerie**. Sa baguette trouve l'eau, et les choses perdues : c'est lui qui trouve la **clé du phare** à l'acte VI.
- **Familier** : **Bulle**, un petit poisson. Au début, son bocal est vide : « Bulle est retourné dans la mer. » Quand on écrit **Poisson** (Eau + Vie), Bulle revient : c'est la première preuve que ce qu'on écrit renaît.
- **Ce qu'il apprend au joueur** : **bâtir** (quartier, souvenir, bâtiment, ramasser) et le **fil d'Ariane**.
- **Savoir** : Cosmos, Formations naturelles.
- **Souvenir** : **Puits**, par Boue → Brique → Puits (Brique + Eau).
- **Arc** : du dormeur à celui qui retrouve ce qu'on a perdu. À l'acte VII, c'est lui qui voit le vrai visage de Brume dans le reflet de l'eau.
- **Son passé, cœur après cœur** :
  1. ses rêves d'eau ;
  2. la lune lui parle ;
  3. il a peur de l'eau profonde (le lien avec Aster) ;
  4. ses parents ;
  5. « Je trouverai toujours ce que tu as perdu. »
- **Première réplique** : « J'ai dormi combien de temps ? L'eau a un goût de nuage. »

---

#### Sylve — la gardienne des bois · ♀ Vénus, la faune (chapitre IV)
- **Bâtiment** : Bosquet (La Lisière). **Arrivée** : acte I, quand **le bois manque** ; son radeau de bois flotté s'est brisé.
- **Apparence** : 17 ans, cape de feuilles cousues, cheveux pleins de brindilles et d'une plume, pieds nus, traits verts peints sur les joues.
- **Personnalité** :
  - farouche : elle se cache, se méfie des humains, puis s'apprivoise ;
  - vive et rieuse une fois en confiance ;
  - elle parle aux arbres et aux bêtes plus qu'aux gens ;
  - elle **a peur du feu**.
- **Voix** : au début, des phrases sans articles (« Bois. Toi. Ami ? »). **Sa grammaire revient avec les cœurs** : ses répliques s'écrivent mieux à chaque niveau d'amitié.
- **Sa magie** : elle chante aux graines pour les faire pousser, et comprend les bêtes.
- **Familier** : **Mousse**, un renardeau qui se cache (élément **Renard**, profondeur 9). Il ne se montre que très tard : un beau but à long terme.
- **Ce qu'elle apprend au joueur** : les **annexes** ; plus tard, le **Bestiaire**.
- **Savoir** : Vie et créatures.
- **Souvenir** : **Arbre**. Le fil d'Ariane passe par **Vie** (4 ingrédients), puis Plante, puis Arbre : c'est la grande scène de l'acte I.
- **Arc** : la peur du feu → la scène de lien « La feuille et la flamme » avec Cannelle → à l'acte VI, c'est elle qui allume le feu du pardon pour Brume.
- **Son passé, cœur après cœur** :
  1. sa forêt ;
  2. l'incendie ;
  3. le radeau ;
  4. pourquoi elle se cache ;
  5. « Ici, c'est ma forêt. Et vous, ma meute. »
- **Première réplique** : « Chut ! Arbres… réveillent. Toi entends ? »

---

#### Galet — le tailleur de runes · ♄ Saturne (chapitre II)
- **Bâtiment** : Carrière (La Colline). **Arrivée** : acte II, quand **il faut de la pierre avant l'orage** ; son caboteur chargé de pierres s'est brisé.
- **Apparence** : 75 ans, tout petit, barbe de lichen jusqu'à la ceinture, bonnet de laine troué, ciseau et maillet, peau couleur granit.
- **Personnalité** : bourru, lent, taiseux, d'une patience infinie, humour sec, grand cœur caché.
- **Voix** : « **Hm.** » Un « Hm » pour tout. Brume les traduit (« Il dit qu'il t'aime bien. »), et il proteste : « Hm ! »
- **Sa magie** : il grave des runes qui font chanter et briller la pierre, et **lit les runes des Anciens**. C'est la clé des actes III et VI.
- **Familier** : **Basalte**, une tortue qui marche à son rythme (élément **Tortue** ; dessin du lot 9e).
- **Ce qu'il apprend au joueur** : la Carrière, la pose « près de », l'**Épreuve**.
- **Savoir** : Matériaux, Chimie, Physique.
- **Souvenir** : **Pierre** (Air + Lave, avec Lave = Feu + Terre).
- **Arc** : il cherche « la pierre qui chante » de sa grand-mère, et la trouve dans la **Mine de cristal** (palier VI de la Carrière). À l'acte VI, il déchiffre la dernière rune des Anciens : « Ils ont cessé d'écrire. »
- **Son passé, cœur après cœur** :
  1. la carrière de son village ;
  2. la pierre qui chante ;
  3. pourquoi il ne parle pas ;
  4. sa femme, qui parlait pour deux ;
  5. **son vrai prénom** : « Galet, c'est un surnom. Mon vrai nom ? … Pâquerette. Hm. »
- **Première réplique** : « Hm. » (Brume : « Il dit bonjour. Je crois. »)

---

#### Mélisse — la jardinière des lunes · ♀ Vénus, la flore (chapitre IV)
- **Bâtiment** : Potager (Les Jardins). **Arrivée** : acte III, quand **la nourriture ne suffit plus** ; sa barque de graines s'est brisée.
- **Apparence** : 35 ans, chapeau de paille à larges bords orné de fleurs séchées, châle couleur nuit brodé de lunes, sabots, mains toujours terreuses, une boîte à graines en fer serrée contre elle.
- **Personnalité** : calme absolu, lente, mystérieuse, drôle pince-sans-rire. Elle répond par des questions et ne se presse jamais.
- **Voix** : « Chaque chose en sa lune. » Elle parle des plantes comme de personnes.
- **Sa magie** : **le jardinage lunaire**. Ses plantes poussent au rythme de la lune ; elle prépare les herbes médicinales qui vont dans les potions de Cannelle.
- **Familier** : **Lunette**, un papillon de nuit (élément **Papillon** = Air + Chenille).
- **Ce qu'elle apprend au joueur** : la nourriture, la ferme ; c'est elle qui trouve les **premières ruines**.
- **Savoir** : Flore, Biologie.
- **Souvenir** : **Plante**, déjà écrite depuis l'acte I. Elle se souvient dès son réveil : « Tes pages m'ont réveillée avant toi. »
- **Secret** : certaines graines de sa boîte viennent **de cette île**. Son arrière-grand-mère descendait des Anciens partis. C'est le lien entre les deux civilisations, révélé à l'acte VI.
- **Son passé, cœur après cœur** :
  1. le jardin de sa grand-mère ;
  2. la boîte ;
  3. les graines étranges ;
  4. ses nuits à parler à la lune ;
  5. « Je suis revenue planter ici ce qui en était parti. »
- **Première réplique** : « Une graine, ça a de la mémoire. Plus que nous. »

---

#### Anya — l'Âme de l'Île · la gemme du Grimoire (la Terre, au centre des sept sceaux)
- **Ce qu'elle est** :
  - l'esprit de la vie de l'île (les bêtes, les plantes, les saisons), la présence la plus ancienne et la plus puissante de l'île ;
  - c'est elle qui « choisit » les naufragés : « l'île t'a choisi », écrivait Héliane, et c'était Anya ;
  - elle s'est endormie quand les Anciens ont cessé d'écrire la vie ;
  - sa dernière pensée avant le sommeil fut une petite flamme pour veiller : **Brume**.
- **Arrivée** : la **Révélation**, quand toute l'île principale est découverte (§ 6.14). Avant, seulement des traces.
- **Apparence** : deux fois la taille d'un naufragé, lente et lumineuse.
  - une couronne en bois de cerf, faite de branches en fleurs où nichent de petits oiseaux ;
  - une longue chevelure qui coule comme une cascade de feuilles et de lumière ;
  - une peau parcourue de veines lumineuses, comme des nervures de feuille ou des constellations ;
  - des yeux d'or vert, très doux ;
  - un manteau vivant de fourrures, de plumes et de papillons, qui change avec les saisons ;
  - pieds nus : des fleurs s'ouvrent à chacun de ses pas ;
  - à ses côtés, un grand cerf blanc (élément **Cerf**) et un halo de lucioles (élément **Luciole**).
  - Dans le style du jeu (à plat, rond, choupi) mais **majestueuse** : animation lente, lueur dorée, silhouette élancée.
- **Personnalité** :
  - calme, immense, chaleureuse ; elle parle peu, et chaque mot pèse ;
  - elle n'obéit à personne, ne se presse jamais, n'élève jamais la voix ;
  - elle appelle chacun par son **vrai nom**.
- **Voix** : des phrases très courtes. Elle parle de l'île comme d'elle-même (« La forêt se souvient de toi »), puis, peu à peu, dit « je ».
- **Sa puissance** : faire renaître et faire pousser, parler aux bêtes, tenir les saisons. Les naufragés s'inclinent à son passage, et les bêtes se couchent.
- **Le respect** : avant même la Révélation, tous parlent d'elle à voix basse (§ 6.14). Héliane : « Si un jour elle te regarde, incline-toi. Moi, je n'ai jamais osé lever les yeux. »
- **Son lien avec Brume** :
  - Anya : « Ma petite flamme. Tu as veillé seule si longtemps. »
  - Brume : « … Tu es revenue. »
- **Répliques de la Révélation** (brouillon) :
  - « Vous m'avez écrite bien avant de me voir. Air, Eau, Feu, Terre… Vous êtes la Vie que j'attendais. »
  - à Galet : « Pâquerette. » (Galet, écarlate : « Hm ! »)
  - à Sylve : « Ta forêt brûlée n'est pas perdue. Elle pousse ici. »
  - à Cannelle : « Merci pour la soupe. Chaque soir. »
  - au joueur : « Toi qui lis. Continue d'écrire. Tant qu'on écrit la vie, je ne dors pas. »
- **Ensuite** : ce n'est pas une habitante comme les autres (pas de cœurs, pas de besoins). On la trouve au Cercle à l'aube et au crépuscule ; elle apporte son Souffle, sa Bénédiction et ses créatures (§ 6.14).

---

#### Le Passeur (acte VII)
Grand, silencieux, une cape de plumes grises, une lanterne au bout d'une perche, une barque qui vole. Il parle en énigmes, comme le Grimoire. Il a mené les derniers Anciens, et Héliane.
- **Réplique** : « Une seule traversée. Tu es prêt·e ? »

#### Héliane, la dernière alchimiste (absente)
Drôle, distraite, généreuse. Elle signe « H. » dans les bouteilles ; son prénom se découvre dans sa maison (acte V) et son dernier mot sur l'Île des Légendes (acte VII).

#### Les voyageurs
Les 24 visiteurs actuels gardent leurs prénoms et leurs histoires. Dans le récit, ce sont ceux qui ont vu les lanternes.

---

## 9. Le tutoriel « Le Naufrage de l'Hirondelle », en 5 étapes

**Le cadre.**
- **Durée visée** : 15 à 20 minutes, en 5 étapes. On peut s'arrêter entre deux étapes.
- **Passable** : chaque cinématique d'un toucher, tout le tutoriel par « Passer ». **Rejouable** dans la Chronique.
- Avec le mouvement réduit, les cinématiques deviennent des images fixes.
- **Les joueurs actuels** ne le voient pas : ceux qui ont déjà une île ou des découvertes.
- **Les écus** : La Source coûte 100 écus, et les 4 premières quêtes en rapportent 25 chacune.
- **Ce qui arrive en route, et pourquoi c'est voulu** : le chapitre II s'ouvre à la 3e découverte, et le III à la 5e ; le 3e emplacement de l'Athanor s'ouvre avec Boue (3 familles), le 4e avec Puits (4 familles). Ainsi l'acte I peut écrire **Vie**.

### Étape 1 — **Brume** : la rencontre et le Grimoire
*En invité. L'île est une scène scriptée ; le Grimoire est le vrai.*

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 1a | *L'Hirondelle* dans la tempête : quatre silhouettes (un ciré jaune, une louche, des lunettes à loupes, une baguette fourchue), une vague, le noir. 20 s | rien (passable) | — |
| 1b | La Grève, la nuit, la brume | toucher pour se relever | *(pensée)* « Froid… Où sont les autres ? » |
| 1c | Une flamme bleue approche, deux yeux s'ouvrent | « Reculer » ou attendre | *(pensée)* « Un feu follet… Les marins disent qu'ils égarent les voyageurs. » |
| 1d | Brume sursaute, se cache derrière un rocher, puis passe la tête | toucher Brume | « Ah ! Tu… tu me vois ? Personne ne m'a vue depuis si longtemps. » |
| 1e | Brume souffle sur des débris : le Feu de camp s'allume, la brume recule | — | « Voilà, il fait moins froid. Je suis Brume. » |
| 1f | Brume apporte un livre fermé par sept sceaux, qui s'ouvre (animation existante) | toucher le livre | « Je le garde depuis toujours. Personne n'a su le lire. Toi, tu le peux. » / « Ce qu'on y écrit renaît sur l'île. C'est le secret de tout. » |
| 1g | Une main montre Air, puis Air | **Air + Air = Vent** | « Il ne reste que quatre Souffles. Mets deux fois l'Air ici. » |
| 1h | La page Pluie et son énigme, puis Brasier | **Air + Eau = Pluie** ; **Feu + Feu = Brasier** | « Lis l'énigme, puis devine. » / au 1er échec : « L'Encre t'aide ; elle est offerte après quelques essais. » / « À toi, sans moi. » |
| 1i | **Le premier sceau** : ♄ Saturne se brise, le chapitre II s'ouvre | — | « Le Grimoire te fait confiance. Le sceau de Saturne attend son gardien. » |

**Ce que ça apprend** : toucher ; le Grimoire ; l'Athanor ; l'énigme ; l'Encre.

### Étape 2 — **Aster** : la Récolte (et ton nom)

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 2a | Retour sur la Grève : le Vent a chassé la brume de la plage. Aster, dans l'eau jusqu'à la taille, tire des caisses | toucher Aster | Aster : « Toi aussi, tu étais sur l'Hirondelle ? Comment tu t'appelles ? » |
| 2b | La page de garde du Grimoire, une plume | écrire son nom (= **compte**) | Brume : « Écris-le dans le Grimoire : l'île saura qui la rebâtit. » |
| 2c | Première Récolte guidée (plateau généreux) | relier au moins 3 cases pareilles | Aster : « La mer rend ce qu'elle a pris. Ramasse ce qui se ressemble, vite, avant la marée ! » / après : « Longue chaîne, mer généreuse. Par tous les alizés ! » |

**Ce que ça apprend** : la Récolte ; les parties qui reviennent ; les longues chaînes.
**Quêtes** : T1 « Écris tes trois premières pages » (`stars` 3, faite au compte) ; T2 « Termine une Récolte » (`runs` 1). 25 écus chacune.

### Étape 3 — **Cannelle** : les besoins

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 3a | Derrière l'épave, Cannelle grelotte, louche serrée contre elle | la toucher | « Un feu follet ! … Oh. Il est mignon. » / « Où est mon Ondin ? Mon petit-neveu ! » |
| 3b | Devant le feu, elle se redresse | — | « Du feu… Je me souviens ! Cuisinière du bord, et fière de l'être ! » |
| 3c | Une bulle « manger » au-dessus de sa tête | lui donner 10 nourriture (fiche) | Brume : « Sa bulle dit ce qui lui manque. Comblé, on travaille mieux. » / Cannelle : « Une soupe… Une cuillère pour le corps, une pour l'âme. » *(elle goûte, hésite, et ne dit rien du goût)* |

**Ce que ça apprend** : les naufragés, leurs besoins, l'humeur, la fiche.
**Quête** : T3 « Une soupe pour Cannelle » (`need` : besoin « manger » du Foyer comblé). 25 écus.

### Étape 4 — **Rivet** : créer

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 4a | Sous une voile échouée, Rivet trie des vis par taille | le toucher | « Montre-moi tes mains. Hum. On va arranger ça. » |
| 4b | Il monte l'établi près du feu (courte scène, Tic-Tac bourdonne et s'arrête) | ouvrir l'établi | « Un établi, et tout devient possible. Attends… Non. Si ! Commençons simple. » |
| 4c | La Clôture, le puzzle | assembler | « Chaque pièce a sa place. Tourne, essaie. Clic ! » |
| 4d | Des cases dorées autour du feu | poser | « Le vent veut éteindre le feu. Pose-la là où l'île brille d'or : elle le protégera. » |

**Ce que ça apprend** : l'établi, le puzzle, la pose et le « pourquoi ici ».
**Quête** : T4 « Pose ta première création » (`crafts` 1). 25 écus (100 écus au total).

### Étape 5 — **Ondin** : bâtir

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 5a | Brume tend l'oreille vers le nord-ouest ; un panneau dans la brume | acheter La Source (100) | Brume : « J'entends de l'eau… et quelqu'un qui ronfle. » |
| 5b | La brume se lève sur La Source : un dormeur, des « z », un bocal vide | toucher le dormeur | Ondin : « J'ai dormi combien de temps ? L'eau a un goût de nuage. » / Cannelle accourt : « Mon caneton ! » / Ondin : « Ma baguette ne trouve plus rien… » |
| 5c | **Le fil d'Ariane** : Brume pose un ruban dans le Grimoire, « Vers : Puits — 3 pages » | **Eau + Terre = Boue** ; **Boue + Feu = Brique** ; **Brique + Eau = Puits** | Brume : « Le Grimoire s'en souvient pour lui. Suis le ruban. » / Ondin : « Là ! Ça tire ! L'eau est là-dessous ! » *(la baguette plonge vers le sol : c'est le « pourquoi ici » du Puits)* |
| 5d | Le Puits sort de terre (10 pierre, de la Récolte) | bâtir | Ondin : « Chut… l'eau arrive. » |
| 5e | Une bulle d'eau au-dessus du Puits | ramasser | Brume : « Ce qu'un bâtiment produit t'attend. Et il rend la Récolte plus généreuse. » |
| 5f | Fin : étape **Le Campement**. Le feu, l'eau, cinq visages | — | Brume : « Le feu, l'eau… Il manque un toit. Et le bois flotté s'épuise déjà. » |

**Ce que ça apprend** : acheter, réveiller, le souvenir et le fil d'Ariane, bâtir, ramasser.
**Quêtes** :
- T5 « Achète La Source » (`zone`, 30 écus) ;
- T6 « Réveille Ondin » (`wake` puits, 10) ;
- T7 « Rends son don à Ondin » (`element` Puits, 20) ;
- T8 « Construis le Puits » (`level` puits 1, 40) — **coffre rare**.

---

## 10. Les sept actes

**Pour chaque acte** : le manque, qui arrive, les recettes du récit, les quêtes (objectif et récompense proposée), la veillée, l'étape, Brume, le mot d'Héliane et le Bestiaire.

**Les récompenses** sont une proposition : elles suivent la progression actuelle, de 20 à 500 écus, et sont à équilibrer.

### Acte I — « Les Premiers Souffles » · ☿ · construire
- **Le manque** : **le bois** (le feu, l'établi, bientôt un toit).
- **Le naufrage** : un radeau de bois flotté. **Sylve** dort, roulée en boule, dans la brume de La Lisière.
- **Recettes du récit** :
  - **Vie** (Air + Eau + Feu + Terre), la grande scène ; puis Plante et **Arbre** (le souvenir de Sylve) ;
  - **Lumière** (Feu + Éclair) pour la première **Lanterne** (création Lanterne = Feu + Lumière).
- **Quêtes** :
  1. acheter La Lisière (`zone`, 50) ;
  2. réveiller Sylve (`wake`, 10) ;
  3. **écrire la Vie** (`element` Vie, 40) ;
  4. rendre son souvenir à Sylve (`element` Arbre, 20) ;
  5. Bosquet I (`level`, 40) ;
  6. écrire la Lumière (`element` Lumière, 40) ;
  7. **allumer la première lanterne** (`craft` lanterne posée, 60) — coffre rare.
- **La scène de la Vie** : la page s'illumine. Aster, Cannelle, Rivet et Ondin lèvent la tête, chacun touché par son Souffle. Brume : *« Aster, Ondin, Cannelle, Rivet. Air, Eau, Feu, Terre. Ensemble… la Vie. »* Les premières pousses percent le sable de la Grève.
- **Premier pressentiment d'Anya** : quand la Vie s'écrit, une voix sans visage murmure « … merci ». Brume : « Tu as entendu ? … Non. Rien. »
- **Veillée I** :
  - le rite : la première lanterne s'allume, et la brume recule d'un cran sur toute la côte ;
  - liens « La Vie à quatre » et « La soupe et la source » ;
  - Brume : « Chaque lumière repousse la brume. Allumons-les toutes. »
  - Étape : **Le Camp des naufragés**.
- **Brume** : stade 1 (pâle, ravie).
- **Mot d'Héliane** : « Si tu lis ceci, l'île t'a choisi. Allume les lumières : toutes. — H. »
- **Bestiaire** : Poisson (Eau + Vie) devient possible ; s'il est écrit, **Bulle revient** dans le bocal d'Ondin.

### Acte II — « La Matière » · ♄ · s'abriter
- **Le manque** : **la pierre**. L'orage approche, et l'Abri (Foyer II) demande 20 bois et 10 pierre.
- **Le naufrage** : un caboteur chargé de pierres. **Galet** dort, assis dans la fissure de La Colline, son maillet à la main.
- **Recettes du récit** :
  - **Pierre** (Air + Lave), le souvenir de Galet ;
  - **Bois** (Arbre + Métal ; Métal = Feu + Pierre), le plan de l'Abri et le lien de Sylve et Galet.
- **Quêtes** :
  1. acheter La Colline (`zone`, 80) ;
  2. réveiller Galet (`wake`, 10) ;
  3. rendre son souvenir à Galet (`element` Pierre, 20) ;
  4. Carrière I (`level`, 40) ;
  5. **écrire le Bois** (`element` Bois, 40) ;
  6. poser une annexe (`annex`, 50) ;
  7. **dresser l'Abri avant l'orage** (`level` foyer 2, 70) — coffre rare.
- **Veillée II** :
  - l'orage gronde, l'Abri tient ;
  - le rite : Galet grave sa première rune sur une pierre du foyer, qui chante ;
  - liens « Le bois et la pierre » et « La feuille et la flamme ».
  - Étape : **Le Hameau**.
- **Brume** : stade 2 (turquoise).
- **Mot d'Héliane** : « Le Grimoire n'aime pas qu'on le brusque. Mélange doucement. — H. »
- **Le Savoir de Galet** : à partir de maintenant, il souffle des indices sur la Matière (le sceau de Saturne a trouvé son gardien).

### Acte III — « Ciel et Terre » · ☾ · se nourrir, explorer
- **Le manque** : **la nourriture**. Sept bouches, un besoin « manger » chacun ; la Récolte ne suffit plus.
- **Le naufrage** : une barque de graines. **Mélisse** dort aux Jardins, sur sa boîte en fer.
  - Son souvenir **Plante** est déjà écrit : elle se souvient en s'éveillant.
- **En même temps, Rivet veut sa vraie forge** : Le Faubourg, souvenir **Four** (Brique + Feu), puis Atelier I. Le **besoin « outils »** commence.
- **Recettes du récit** :
  - **Étoile** (Feu + Lumière + Énergie) : Aster peut guider la première **expédition** par les étoiles ;
  - **Village** (Maison + Maison ; ou Cabane ×3) : l'étape.
- **Quêtes** :
  1. acheter Les Jardins (`zone`, 110) ;
  2. réveiller Mélisse (`wake`, 10) ;
  3. Potager I (`level`, 50) ;
  4. acheter Le Faubourg (`zone`, 120) ;
  5. Atelier I (`level`, 60) ;
  6. écrire l'Étoile (`element` Étoile, 50) ;
  7. une expédition (`expedition`, 60) ;
  8. une ruine des Anciens (`landmark`, 60) ;
  9. **écrire le Village** (`element` Village, 80) — coffre épique.
- **Les ruines** : Mélisse trouve les menhirs ; Galet lit leurs runes : « Nous aussi, nous étions des naufragés. » Ouverture de la **Chronique**.
- **Deuxième pressentiment d'Anya** : au centre du cercle, une rune plus grande. Galet ôte son bonnet : « Ici dort Celle-qui-donne-souffle. Ne l'éveillez qu'ensemble. » Sylve, tout bas : « Elle. La Dame. Les bêtes savent. »
- **Veillée III** :
  - liens « L'enclume » et « Le premier fruit » ;
  - Mélisse : « Trois naufrages en une saison… Il y a quelque chose, avec cette île. » Brume baisse les yeux.
  - Étape : **Le Village**.
- **Brume** : stade 3 (des étoiles tournent autour d'elle) ; l'*albedo* commence, la lumière devient argentée.
- **Mot d'Héliane** : « Nous aussi, nous étions des naufragés. L'île nous a gardés longtemps. — H. »

### Acte IV — « Le Vivant » · ♀ · s'ouvrir aux autres
- **Le manque** : **la mer**. Aster veut reprendre la barre.
- **Recettes du récit** :
  - **Bateau** (Bois + Eau), le souvenir d'Aster ;
  - **une première bête** du Bestiaire.
- **Ce qui se passe** :
  - La Crique, le Ponton I ;
  - **la première barque de voyageurs**. Aster : « Ceux-là ne se sont pas brisés. Ils ont vu nos lanternes. » C'est la récompense de l'acte I.
  - **Les bêtes se réveillent** : entrée du Bestiaire (les bêtes écrites, en plus des 12 bêtes des climats), présentée par Sylve ;
  - **troisième pressentiment d'Anya** : à peine écrites, les bêtes tournent toutes la tête vers la Lande aux Menhirs, puis reprennent leur chemin ;
  - les terres des cimes et des dunes : trouvailles et créations de climat.
- **Quêtes** :
  1. acheter La Crique (`zone`, 160) ;
  2. rendre son courage à Aster (`element` Bateau, 30) ;
  3. Ponton I (`level`, 80) ;
  4. écrire une bête (`element` dans le Bestiaire, 50) ;
  5. combler un voyageur (`visitor`, 80) ;
  6. un cœur d'amitié (`heart`, 60) ;
  7. une trouvaille de climat (`gather`, 60) ;
  8. **Serre** (`level` potager 2, plan Serre ; 120) — coffre épique.
- **Veillée IV** :
  - le rite : Aster siffle, le vent tourne, et les voiles des voyageurs se gonflent ;
  - lien « Apprendre à nager ».
  - Étape : **Le Bourg**.
- **Brume** : stade 4 (une feuille danse dans sa flamme).
- **Mot d'Héliane** : « Prends soin des poules : elles savent tout. Et des dauphins : ils savent le reste. — H. »

### Acte V — « Le Foyer » · ♂ · se nommer
- **Le manque** : **la place**. Des voyageurs veulent rester.
- **Recettes du récit** :
  - **Potion** (Eau + Magie + Plante ; Magie = Vie + Énergie) : le plan de la **Maison de l'alchimiste** ;
  - c'est aussi la première vraie potion de Cannelle : **son goût revient**.
- **Ce qui se passe** :
  - les maisons et les voyageurs qui s'installent ;
  - la Cabane ; Le Hameau ; la jungle ; les enseignes ;
  - dans la Maison de l'alchimiste : son bureau, ses mémoires, et son prénom, **Héliane**.
- **Quêtes** :
  1. Cabane (`level` foyer 3, 150) ;
  2. une maison (`house`, 100) ;
  3. un voyageur installé (`settle`, 120) ;
  4. acheter Le Hameau (`zone`, 220) ;
  5. **écrire la Potion** (`element` Potion, 80) ;
  6. Maison de l'alchimiste (`level` foyer 4, 200) ;
  7. **donner un nom au peuple** (`name`, 100) — coffre légendaire.
- **Veillée V** :
  - lien « La grande tablée » ; on **nomme le peuple** ;
  - les autres t'appellent « **Alchimiste** » ;
  - Cannelle goûte sa soupe et pleure de rire : « Du sel ! Je sens le sel ! »
  - Étape : **Le peuple de « … »**.
- **Brume** : stade 5 (un cœur ambré) ; *citrinitas*, l'aube dorée.
- **Mot d'Héliane** : « Une table, une soupe, un nom : c'est comme ça que tout commence. — Héliane. »

### Acte VI — « Les Âges » · ♃ · se souvenir
- **Le manque** : **la mémoire**. Que s'est-il passé ici ?
- **Recettes du récit** :
  - **Écriture** (Langage + Pierre) : les runes de Galet ; le peuple réapprend à écrire ;
  - **Civilisation** (Ville + Écriture) : l'étape ;
  - **Phénix** (Feu + Vie) : le rite du pardon.
- **Ce qui se passe** :
  - la Tour d'étude (plan Livre = Humain + Écriture), la Grande tour et son télescope, d'où l'on voit l'Île des Légendes flotter ;
  - l'Îlot aux Mouettes et le phare éteint des Anciens ;
  - **la clé du phare**, que la baguette d'Ondin trouve parmi les ruines ;
  - la Mine de cristal, où Galet trouve sa « pierre qui chante » ;
  - Mélisse comprend d'où viennent ses graines ;
  - **le secret de Brume** : Galet déchiffre la dernière rune des Anciens ; Brume comprend que son chagrin fait la brume de la mer : « … parce que l'île est seule. Parce qu'Elle dort. » C'est le **quatrième pressentiment d'Anya**. Brume pâlit, mais **les quêtes continuent**.
- **Quêtes** :
  1. acheter L'Îlot aux Mouettes (`zone`, 300) ;
  2. **écrire l'Écriture** (`element`, 100) ;
  3. trouver la clé du phare (`landmark` d'un lieu désigné, 100) ;
  4. Tour d'étude (`level` foyer 5, 250) ;
  5. **écrire la Civilisation** (`element`, 150) ;
  6. **écrire le Phénix** (`element`, 200) — coffre légendaire.
- **Veillée VI** :
  - lien « **Le pardon** » ;
  - Aster parle la première : « Moi aussi, je croyais que c'était ma faute. » ;
  - Sylve, qui avait peur du feu, allume la flamme ;
  - chacun tend son Souffle : « Ta flamme, notre vie. » **Phénix** : Brume renaît, plus vive que jamais.
  - Étape : **La Civilisation**.
- **Brume** : stade 6 (des runes autour d'elle, une teinte pâlie pendant l'acte, puis l'éclat).
- **Mot d'Héliane** : « Nous avons cessé d'écrire, et la brume nous a effacés. Ne cessez jamais. — Héliane. »

### Acte VII — « Les Légendes » · ☉ · guider
- **Le manque** : **la lumière** du large.
- **Ce qui se passe** :
  - Le Passeur et sa barque volante jusqu'à l'Île des Légendes.
  - **Le dernier mot d'Héliane** : « Brume n'est pas une malédiction. C'est ce qui reste d'une île quand on l'oublie. Écrivez-la, et elle ne sera plus jamais seule. Et si un jour la Dame s'éveille, dites-lui que nous l'aimions. »
- **Recette du récit** : **Feu follet** (Feu + Marais). C'est la recette de Brume, et le plan du **Phare de Brume** (Foyer VII).
- **Quêtes** :
  1. acheter L'Île des Légendes (`zone`, 300) ;
  2. **écrire Brume** (`element` Feu follet, 200) ;
  3. **allumer le Phare de Brume** (`level` foyer 7, 500) — coffre légendaire.
- **La finale** :
  - Rivet monte la lentille ;
  - Ondin voit le vrai visage de Brume dans l'eau ;
  - Brume entre dans la lanterne et devient le **Soleil** du phare ;
  - la brume se lève sur l'île et sur la mer ;
  - une petite flamme se détache et revient près de toi : « Je reste avec toi. »
- **Veillée VII, puis l'épilogue** :
  - un navire perdu voit la lumière et accoste : de nouveaux naufragés, cette fois accueillis ;
  - la réplique de fin : « La brume s'est levée. Le peuple de « … » veille sur la mer. »
  - Étape : **La Légende** (*rubedo*).
- **Le cas particulier** : si le joueur écrit Feu follet plus tôt (c'est un élément du chapitre I, profondeur 3), Brume réagit une seule fois (« C'est… moi ? Comme c'est étrange. »). La finale reste au Phare.

---

## 11. La Révélation d'Anya, et après

- **La Révélation d'Anya** (§ 6.14) arrive quand toute l'île principale est découverte : au plus tôt vers l'acte VI, le plus souvent après le Phare. C'est la **vraie fin**, la récompense de ceux qui explorent tout.
  - La troupe au complet est au Cercle, les sept sceaux s'allument, Anya se lève.
  - La gemme du Grimoire s'allume.
  - Ensuite viennent la Bénédiction, le Souffle et les créatures d'Anya.

- **Ouvrir ≠ finir** : plus de 750 pages restent à trouver. La maîtrise continue :
  - finir chaque sceau (paliers de l'établi, pièces rares) ;
  - les climats ;
  - le **Bestiaire complet** (Mousse le renardeau, le Chat, le Chien…) ;
  - la Chronique ;
  - les sceaux de l'Épreuve.
- **Les voyageurs continuent d'arriver**, guidés par le phare.
- **Plus tard, peut-être** : d'autres îles perdues dans la brume, comme cadre de saisons.

---

## 12. Le tableau maître

| Étape | Manque | Arrivée | Recettes du récit | Mécanique apprise | Étape de civilisation | Grand Œuvre | Coffre |
|---|---|---|---|---|---|---|---|
| T1 | — | Brume | Vent, Pluie, Brasier | Grimoire, Athanor, énigme, Encre | — | noir | — |
| T2 | — | Aster | — | Récolte, compte | — | | — |
| T3 | — | Cannelle | — | besoins, humeur | — | | — |
| T4 | — | Rivet | — | établi, puzzle, pose | — | | — |
| T5 | — | Ondin | Boue, Brique, **Puits** | quartier, souvenir, fil d'Ariane, bâtir, ramasser | Le Campement | | rare |
| I | le bois | Sylve | **Vie**, Arbre, **Lumière** | annexes, palier I, lanternes, Savoirs | Le Camp | noir | rare |
| II | la pierre | Galet | Pierre, **Bois** | « près de », Épreuve | Le Hameau | noir | rare |
| III | la nourriture | Mélisse (+ forge de Rivet) | Four, **Étoile**, **Village** | expédition, ruines, Chronique, outils, mini-jeux | Le Village | blanc | épique |
| IV | la mer | bêtes, voyageurs | **Bateau**, une bête | Bestiaire, visiteurs, cœurs, gisements | Le Bourg | blanc | épique |
| V | la place | voyageurs installés | **Potion** | maisons, enseignes, nom | Le peuple | jaune | légendaire |
| VI | la mémoire | — | **Écriture**, **Civilisation**, **Phénix** | grandes annexes, clé du phare | La Civilisation | jaune | légendaire |
| VII | la lumière | le Passeur | **Feu follet** | finale | La Légende | rouge | épilogue |
| **Révélation** (toute l'île principale découverte) | — | **Anya** | (Vie, écrite à l'acte I, l'avait appelée) | Bénédiction, Souffle d'Anya, créatures d'Anya | le peuple sous le regard d'Anya | or (la gemme) | — |

**Rythme visé** (à vérifier ; **aucune mesure réelle n'existe**) :

| Étape | Moment visé |
|---|---|
| Tutoriel | 15 à 20 min |
| Acte I | jour 1 |
| II à III | jours 2 à 4 |
| IV | 1re semaine |
| V à VII | semaines 2 à 5 |

Le prix des quartiers et des paliers décide du rythme : l'équilibrage reste à faire.

---

## 13. Brume, fiche du personnage

- **Nature** : feu follet (Feu + Marais), né de la solitude de l'île ; gardienne du Grimoire ; maîtresse du sceau ☉, qu'elle ne révèle qu'à la fin.
- **Genre** : *elle*.
- **Sa famille** : née de la dernière pensée d'Anya avant son sommeil (§ 6.14). Elle l'ignore jusqu'à la Révélation.
- **Les 8 stades**, déduits de l'acte ; ce sont des ajouts au dessin actuel (`F/src/world/brume.js`) :

  | Stade | Moment | Ce qui s'ajoute |
  |---|---|---|
  | 0 | rencontre | pâle et tremblante |
  | 1 | acte I | bleu clair, ravie |
  | 2 | acte II | turquoise |
  | 3 | acte III | des étoiles tournent autour d'elle |
  | 4 | acte IV | une feuille dans la flamme |
  | 5 | acte V | un cœur ambré |
  | 6 | acte VI | des runes ; pâlie pendant l'acte, puis l'éclat du Phénix |
  | 7 | acte VII | une couronne dorée, puis le soleil du phare |

- **Quand elle parle** :
  - aux moments clés : mécanique nouvelle, naufrage, dormeur, souvenir, sceau, quête, premier échec, veillée ;
  - une fois par moment, une bulle à la fois ;
  - jamais pendant une Récolte, un puzzle ou un mini-jeu.
- **Partage de la parole** : dès l'étape 2, chaque personnage présente sa mécanique. Brume garde le Grimoire, le fil d'Ariane, les quêtes et les naufrages.
- **Elle ramène toujours au Grimoire** quand on bloque.

---

## 14. Direction artistique et mise en scène

- **Le Grand Œuvre en couleurs** (§ 4.3) : chaque groupe d'actes a sa lumière (nuit bleue, argent, aube dorée, rouge-or).
  - Les teintes de jour et de nuit existent déjà (`scene.js`, `sky.js`) ; on décale leur palette selon l'acte.
- **Les personnages** : le générateur (`F/src/world/villagers.js`) doit gagner les pièces des fiches du § 8 :
  - le ciré et la longue-vue d'Aster ;
  - la louche et le chignon de Cannelle ;
  - les loupes et le tablier de Rivet ;
  - le bonnet de nuit, la baguette et le bocal d'Ondin ;
  - la cape de feuilles de Sylve ;
  - la barbe de lichen de Galet ;
  - le chapeau et le châle de Mélisse ;
  - le sceau de chacun, brodé ou gravé ;
  - plus une **pose « endormi »**.
- **Les familiers** (Bosco, Bouillon et Basalte réutilisent les dessins du lot 9e) :

  | Familier | Personnage | Élément |
  |---|---|---|
  | Bosco | Aster | Oiseau (dessin : macareux, lot 9e) |
  | Bouillon | Cannelle | Grenouille (dessin du lot 9e) |
  | Tic-Tac | Rivet | aucun : c'est un automate |
  | Bulle | Ondin | Poisson |
  | Mousse | Sylve | Renard |
  | Basalte | Galet | Tortue (dessin du lot 9e) |
  | Lunette | Mélisse | Papillon |

  Ils sont dans le style des bêtes du lot 9e (le style du jeu, un peu plus mignon, de profil).
- **Anya** : la seule figure « majestueuse » du jeu.
  - Deux fois la taille d'un naufragé, animation lente (elle respire, son manteau ondule), lueur dorée, lucioles.
  - Son apparition ralentit tout (et baisse la musique, si le son arrive un jour). Palette or et vert.
  - Il lui faut son propre dessin, hors du générateur de personnages, ainsi que celui du cerf blanc et du Cercle fleuri.
- **Les rencontres** : un plan d'entrée par personnage (Aster dans les vagues, Cannelle qui grelotte, Rivet sous la voile, Ondin qui ronfle), puis une **carte** : prénom, rôle, sceau, Souffle, ce qu'il aime.
- **Les naufrages** : une image de nuit d'une seconde (une épave au loin, la brume), puis le dormeur dans le quartier.
- **Les veillées** : le feu au centre, la troupe en cercle (vues de profil et de trois quarts), Brume au-dessus ; le rite dessine la recette en lumière au-dessus des flammes.
- **Le souvenir retrouvé** : un éclat doré du Grimoire vers le naufragé ; son sceau s'allume ; il se lève, outil en main.
- **La scène de la Vie** : les quatre Souffles en traînées de couleur (bleu, rouge, ocre, blanc) qui se rejoignent dans l'Athanor.
- **Main qui montre** : seulement pendant le tutoriel.

---

## 15. Impacts techniques (fichiers, règles, invariants)

**Principe** : tout est déduit de l'état existant (quêtes réclamées, quartiers, bâtiments, amitié, éléments possédés).
- Aucune migration de base.
- Une seule donnée nouvelle : la cible `peuple` dans la table de noms existante.

| Élément | Serveur | Front | Invariant et tests |
|---|---|---|---|
| **Nouvelle troupe** | `villagers.js` : prénoms, rôles, cadeaux (§ 8.1) ; `test/play.test.js` : prénoms attendus | `friends.js` (passé par cœurs, grammaire de Sylve qui revient) ; `village.js` (répliques de travail) ; `villagers.js` (looks, pose endormi) | les identifiants ne changent pas ; aucune donnée en base ne porte de prénom (vérifié : `world_friends.villager` est l'identifiant du bâtiment) |
| **Présence dès la rencontre** (§ 6.6) | `world.js` (`livesHere`, vue des habitants) et `villagers.js` (besoins « créations » et « outils ») | personnages au camp, dormeurs | **les joueurs actuels gardent tous leurs habitants** ; tests sur la production et l'humeur sans bâtiment |
| **Objectifs de quête nouveaux** | `quests.js` : `element`, `need`, `wake`, `craft` (création précise), `annex`, `expedition`, `landmark`, `gather`, `visitor`, `heart`, `house`, `settle`, `name` ; faits dans `world.js`, lus dans des tables existantes (vérifié : `world_visitors.satisfied_at` et `settled_at` existent pour `visitor` et `settle` ; `world_friends.points` pour `wake` et `heart`) | actions de la fiche de quête | **une quête placée avant la plus avancée déjà réclamée compte comme faite** ; le tutoriel paie 100 écus avant La Source |
| **Fil d'Ariane** (§ 6.1) | `bookPages.js` : cible, chemin le plus court, page marquée ; s'appuie sur les recettes déjà chargées par `recipeBook.js` | ruban, « Vers : X — n pages », « Voir dans le Grimoire » | la page marquée ne révèle rien de plus qu'une autre ; **temps de calcul à mesurer** (recherche sur 2 986 recettes) |
| **Savoirs** (§ 6.4) | route de bavardage : indice renvoyé seulement quand le bavardage compte (une fois par jour) | réplique d'indice ; indice gardé sur l'appareil | pas d'indice hors de l'Art du maître ; équilibrage face à l'Encre |
| **Bestiaire vivant** (§ 6.5) | aucun, sauf si la vue de l'île doit porter les éléments possédés (à vérifier) | `animals.js`, `village.js` : apparition selon les éléments | les bêtes de ferme gardent la règle du Potager |
| Chapitre II à 3, palier I de l'établi à 10 | `bookPages.js`, `crafts.js` et tests | textes | — |
| **Tutoriel** | plateau de 1re Récolte généreux (`harvest.js`, optionnel) | scènes, déroulé, saut, reprise | **joueurs actuels** : jamais le tutoriel ; **invité** : bascule vers le compte à l'étape 2 |
| **Veillées, étapes, Chronique** | aucun | scène scriptée, Carnet | la veillée passe dans la file de Brume, jamais par-dessus un coffre |
| **Nom du peuple** | route et service des noms : cible `peuple` | champ à la veillée V | même validation que les autres noms |
| Brume : stades, Phénix | aucun | `brume.js` | les quêtes ne sont jamais bloquées |
| Mots d'Héliane | `loot.js` : choix du mot selon l'acte | `chest.js` | — |
| Phare, épilogue | quête finale | cinématique | — |
| **Anya : condition et traces** | vue de l'île : `anya: { traces, awake }`, déduit des quartiers à soi et des expéditions revenues | Chronique (Traces), images de trace, scène de la Révélation, gemme du Grimoire | condition testée sur la carte (12 terres, 9 quartiers) ; rien de stocké |
| **Anya : Bénédiction** | chaîne des bonus (comme les lieux) ; `finds.readyIn` (repousse en paramètre) ; humeur plancher (`villagers.js`) | textes | tests : repousse en 4 h et humeur sans malus quand Anya est éveillée ; rien ne change sinon |
| **Anya : Souffle** | route de bavardage : cible `anya` quand elle est éveillée ; `world_friends` (cible `anya`) pour le « une fois par jour » | Anya au Cercle à l'aube et au crépuscule | un indice par jour au plus |
| **Anya : créatures, Cercle fleuri, dessin** | aucun | dessin d'Anya (hors générateur), créatures (dans le style des bêtes du lot 9e), lieu remarquable fleuri | — |

---

## 16. Plan de livraison en lots (avec critères d'acceptation)

| Lot | Contenu | Accepté quand… | Dépend de |
|---|---|---|---|
| **H0 — La troupe et les textes** | prénoms, rôles, cadeaux ; répliques de passé par cœurs ; Brume (*elle*, une présentation) ; les Anciens et Héliane ; « Grimoire » partout ; quêtes réécrites | tous les tests passent avec les nouveaux prénoms ; aucune réplique ne cite un ancien prénom ou « le dernier alchimiste » | — |
| **H1 — La colonne vertébrale** | présence dès la rencontre ; chaîne de quêtes T1 à VII (§ 9 et 10) et objectifs nouveaux ; invariant des joueurs en cours ; chapitre II à 3 ; palier I à 10 | un nouveau compte suit toute la chaîne ; un compte existant ne recule jamais ; tests de chaque objectif | H0 |
| **H2 — Le fil d'Ariane** | page marquée et chemin le plus court | Puits, Arbre, Bateau, Livre et Feu follet marquent la bonne étape suivante ; temps de calcul mesuré | H1 |
| **H3 — Dormeurs, naufrages, souvenirs** | pose endormi, réveil, annonce des naufrages, scène du souvenir retrouvé | Ondin, Sylve, Galet et Mélisse s'éveillent et se souviennent dans le bon ordre | H2 |
| **H4 — Le tutoriel** | les 5 étapes (§ 9) | un invité joue l'étape 1, crée son compte à l'étape 2, finit à l'étape 5 en 15 à 20 min ; passable et rejouable | H0 à H3 |
| **H5 — Veillées et civilisation** | veillées et rites, liens-recettes, étapes, Chronique, nom du peuple | 7 veillées jouables ; nom enregistré et affiché | H3 |
| **H6 — Savoirs et Bestiaire** | indices des maîtres ; bêtes qui naissent quand on les écrit ; familiers | un indice par jour et par maître ; Bulle revient quand on écrit Poisson | H1 ; suite des bêtes (`PASSATION.md` § 7, point 1) |
| **H7 — Le Grand Œuvre et la finale** | stades de Brume, palettes par acte, acte VI (pâlir, Phénix), Phare de Brume, épilogue, mots d'Héliane | la finale se joue de bout en bout ; Feu follet écrit tôt donne la réplique spéciale | H5, H6 |
| **H8 — Anya** | traces (4 pressentiments, 12 traces), Révélation, gemme du Grimoire, Bénédiction, Souffle, créatures, Cercle fleuri | un compte qui découvre toute l'île principale voit la Révélation une seule fois, avant ou après le Phare (deux répliques) ; la Bénédiction s'applique ; un Souffle par jour au plus | H5, H6 (créatures) ; H7 conseillé |

---

## 17. Décisions

### Prises (le 5 octobre 2026)
- **Tutoriel** : 5 étapes, un personnage chacune ; Brume, puis les fondateurs de l'Air, du Feu, de la Terre et de l'Eau.
- **Arrivées** : d'autres naufrages, sur besoin.
- **Se découvrir** : entre eux et eux-mêmes.
- **Brume solitaire** et le Phare ; **civilisation** avec étapes, veillées et nom.
- **Compte et public** : le compte au moment du nom (Aster, étape 2) ; tout public.
- **D1** *elle* ; **D4** chapitre II à 3 ; **D7** palier I à 10 ; **D8** « Grimoire » ; **D10** 8 stades ; **D11** joueur jamais montré ; **D13** *l'Hirondelle* ; **D16** le frère d'Aster, plus tard.
- **Les noms et les personnalités sont à changer** : demande de l'auteur, appliquée dans cette version.

### À valider (versions 4 et 5)

| # | Question | Ma recommandation |
|---|---|---|
| V1 | La troupe : **Aster, Cannelle, Rivet, Ondin, Sylve, Galet, Mélisse**, et les fiches du § 8 | à valider ; chaque nom est court, distinct (initiales différentes), et évoque son Art |
| V2 | Les quatre Souffles (fondateurs) et les sept Sceaux (maîtres de chapitre) | oui : ils s'appuient sur les sceaux déjà dessinés et sur la vraie recette Vie |
| V3 | Les Savoirs des maîtres : famille sous 2 cœurs, ingrédient à partir de 2 | oui, avec l'équilibrage du § 6.4 si c'est trop généreux |
| V4 | Le Bestiaire vivant (une bête écrite apparaît) | oui, en plus des 12 bêtes des climats (lot 9e), qui gardent leur règle |
| V5 | Les liens sont des recettes, et les veillées ont un rite | oui |
| V6 | La dernière alchimiste s'appelle **Héliane** | à valider |
| V7 | Galet s'appelle en vrai « Pâquerette » (5e cœur) | à valider, pour le sourire |
| V8 | Les récompenses proposées aux § 9 et 10 | à équilibrer plus tard ; elles servent de point de départ |
| V9 | La condition de la Révélation d'Anya : les 12 terres explorées **et** les 9 quartiers du cœur à soi (plus aucune brume sur l'île principale) | **oui**. Autre choix : les 12 terres explorées seulement (un peu plus tôt, mais il reste de la brume sur le cœur) |
| V10 | Brume est née de la dernière pensée d'Anya avant son sommeil | **oui** : ça prolonge « Brume solitaire » et donne une famille à Brume |
| V11 | La Bénédiction d'Anya : gisements en 4 h, humeur jamais triste | **oui**, à équilibrer |
| V12 | Le Souffle d'Anya : un ingrédient par jour, au Cercle, à l'aube et au crépuscule | **oui** |
| V13 | Les créatures d'Anya : les bêtes absentes du Grimoire (lapins, hérons, mouettes, loutres, koïs) | **oui** |

---

## 18. Notes hors périmètre (relevées, rien touché)

- **Épreuve et palier I de l'établi.**
  - Le nombre de questions réussies, qui sert à ouvrir le palier I de l'établi, est **envoyé par le navigateur** (`B/src/routes/timer.js:19-23`, lu par `B/src/services/world.js:703-708`) : le serveur ne le recoupe pas.
  - Faible enjeu, mais contraire au principe « serveur seul juge ».
- **L'Encre** achetée n'est retenue que sur l'appareil (`oc_book_ink`).
- **`db/README.md`** annonce 2 766 recettes ; la base en compte 2 986.
- **La réplique `chapter-II`** ne peut jamais jouer avec les règles actuelles.

---

## 19. Conclusion et démarrage

**Statut.**
- C'est la **version finale** de la bible (v5, 5 octobre 2026) : la référence pour tous les lots H0 à H8.
- Les décisions du § 17 sont prises.
- Les points **V1 à V13 sont retenus par défaut** : ce sont les recommandations. L'auteur peut revenir sur chacun ; dans ce cas, **mettre la bible à jour avant de coder** (et le noter en tête du fichier).

**Ce que le jeu devient, en trois phrases.**
1. Des naufragés retrouvent la mémoire et réinventent une civilisation grâce au Grimoire, où chaque moment de l'histoire est une vraie recette.
2. Brume, le feu follet solitaire dont la brume brisait les bateaux, devient la flamme du Phare.
3. Anya, l'Âme de l'Île, se révèle à ceux qui découvrent toute l'île.

**L'ordre de construction.**
- H0 → H1 → H2 → H3 → H4 → H5 → H6 → H7 → H8 ; dépendances et critères d'acceptation au § 16.
- Les **bêtes** : le lot 9e (12 bêtes des climats) est fait. La suite des bêtes (`PASSATION.md` § 7, point 1) alimente H6 (le Bestiaire, les familiers) et H8 (les créatures d'Anya). Les bêtes à dessiner en priorité sont au § 1.2 ; les familiers et Anya, au § 14.

**Les garde-fous, à relire avant chaque lot.**
1. **Aucune migration de base.** Si un lot semble en demander une : s'arrêter et demander à l'auteur.
2. **Un joueur existant ne recule jamais** : chaîne de quêtes, habitants, chapitres déjà ouverts.
3. **Tout ce qui se raconte se déduit de l'état du serveur** ; le front ne décide d'aucun gain.
4. **Les PR** : la PR serveur avant la PR front ; tests verts à chaque lot ; critères d'acceptation du § 16 vérifiés dans un vrai navigateur.
5. **Les textes** suivent le § 7.4 (140 caractères au plus, une idée par bulle) et la voix de chaque personnage (§ 8).
6. **Une seule source de vérité** : cette bible pour le récit et le game design, `PASSATION.md` pour les règles de travail et la technique.

**Les vérifications à faire d'abord** (les incertitudes connues).
- La vue de l'île connaît-elle les éléments du Grimoire ? Le Bestiaire en dépend (§ 6.5).
- Combien de temps prend le calcul du fil d'Ariane (§ 6.1) ?
- L'équilibrage :
  - des Savoirs face à l'Encre (§ 6.4) ;
  - des récompenses (§ 9 et 10) ;
  - de la Bénédiction d'Anya (§ 6.14).

**Le premier pas : le lot H0 (la troupe et les textes).** Avant de coder, présenter à l'auteur :
- la liste des fichiers touchés ;
- les nouveaux prénoms, rôles et cadeaux (§ 8.1) ;
- les répliques de chaque personnage, pour qu'il les valide.

Ensuite, livrer H0 en une paire de PR (serveur, puis front).
