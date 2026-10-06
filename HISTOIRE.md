# Brumelune — Les Naufragés de la Brume

> **Bible narrative et plan de game design** (v6, 6 octobre 2026, sur la base de la v5 du 5 octobre). Elle remplace toutes les versions précédentes. Pour commencer à construire : § 19.
> - Rien de ce document n'était codé à sa rédaction. L'état du jeu décrit ici est celui d'après le lot 9e (12 bêtes des climats) et le compteur `?perf`.
> - Chaque fait sur le jeu actuel est vérifié dans le code ou dans la base de test (`B/` = serveur, `F/` = front).
> - **Chaque recette citée est une vraie recette de la base** (calculée le 5 octobre 2026).

> **Mises à jour depuis la v5** (règle du § 19 : la bible change avant le code).
> - **Le jeu s'appelle désormais Brumelune** (choix de l'auteur, 5 octobre 2026) : le nom visible partout ; les identifiants techniques (dépôts, base, clés de sauvegarde) ne changent pas.
> - **Lots livrés** : H0 (la troupe et les textes), H1 (la colonne vertébrale), H2 (le fil d'Ariane : 2 à 7 ms par calcul), H3 (dormeurs, naufrages, souvenirs), H4 (le tutoriel), H5 (veillées et civilisation), H6 (Savoirs et Bestiaire), H7 (le Grand Œuvre et la finale), H8 (Anya).
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
> - **Lot H4, choix de l'auteur** : scènes illustrées plein écran (un toucher avance, « Passer le prologue » toujours là) ; à l'étape 2, on écrit son nom sur la page de garde du Grimoire, puis e-mail et mot de passe sur la même page ; le prologue se revoit depuis le Sceau en attendant la Chronique.
> - **Lot H4, en deux temps** :
>   - livré d'abord : les étapes 1 et 2 jusqu'au compte (tempête, Grève, Brume, Grimoire ; Vent avec une main qui montre l'Air, Pluie, Brasier ; le sceau de Saturne ; Aster ; la page de garde) ; le nom du joueur est gardé par le serveur ; la toute première Récolte est généreuse (sans l'eau, 4 coups de plus) ;
>   - puis, sur l'île, la quête active de Brume dit l'étape : Aster et la Récolte (une main sur le bouton), Cannelle et sa soupe, Rivet et l'établi, La Source, Ondin, le Puits, et « Le Campement » ; une réplique ajoutée, faute de texte dans la bible : « Quand je brille, touche-moi : ce que tu as accompli t'attend. » (les récompenses se réclament auprès de Brume).
> - **Lot H5** :
>   - une veillée se joue sur l'île quand un acte est fini (sa dernière quête réclamée), dans les scènes du tutoriel : le cercle autour du feu, les nouveaux venus (leur réplique du premier jour), le rite et sa recette en lumière, les liens, les répliques du § 10, puis l'étape ; sur un autre appareil, seule la veillée du dernier acte fini peut encore attendre ;
>   - rites ajoutés faute de recette dans le § 10 : « Pierre qui chante » (II), « Vent » (IV), « Feu follet » (VII) ; les veillées III, V et VI n'ont pas de rite ;
>   - l'étape de civilisation (dernier acte fini, et le nom du peuple pour « Le peuple de « … » ») s'affiche dans la fiche de Brume, la fiche du Foyer et l'Ex libris du Grimoire ;
>   - la Chronique est un onglet du Carnet d'explorateur : veillées (à revoir), liens et leurs recettes, souvenirs retrouvés ; le Bestiaire, les mots d'Héliane et les ruines y viendront avec leurs lots.
> - **Lot H6** :
>   - le Savoir d'un maître porte sur les pages de son chapitre (Aster : Éléments fondamentaux et Phénomènes naturels ; Sylve et Mélisse se partagent le Vivant) ; Brume, maîtresse du sceau ☉ qu'elle révèle à la fin, souffle le sien (Légendes, un ingrédient) une fois le Phare allumé, depuis sa fiche ; s'il n'y a aucune page des Légendes à portée, rien n'est compté ;
>   - la famille ne se souffle que sur une page à énigme pas encore essayée (ailleurs, la page écrit déjà ses familles) ; l'ingrédient est celui que l'Encre révélerait ; l'appareil dit au serveur ce qu'il sait déjà, pour ne pas recevoir deux fois le même indice ; « Voir dans le Grimoire » ouvre la page soufflée ;
>   - le Bestiaire s'ajoute aux bêtes déjà là pour tous (la mer : poissons, dauphins, baleine, méduses ; les bois : cerf, renard, hérisson, écureuil), qui ne changent pas : écrire ces bêtes-là fait venir les familiers (Bulle, Mousse) et compte au Bestiaire de la Chronique ; les bêtes nouvelles : mésanges et hibou dans les arbres, papillons et abeilles le jour, lucioles la nuit, grenouille et tortue au bord de l'eau douce ; à la ferme, une variante (poules blanche et grise, vache rousse, mouton noir, cochon tacheté, chèvre brune) si le palier montre déjà la bête ; le Chat et le Chien attendent (ils sont déjà dans la boutique du Foyer) ;
>   - Tic-Tac (un automate) et le bocal d'Ondin sont là dès le début ; Bulle revient dans le bocal quand Poisson est écrit, et Rivet fabrique une amie à Tic-Tac quand Abeille l'est ; Lunette est un papillon de nuit (variante du Papillon) ;
>   - Sylve présente le Bestiaire dès la première bête écrite (sa grammaire du moment), Brume si Sylve n'est pas encore là ;
>   - la suite des bêtes de `PASSATION.md` (§ 7, point 1 : compagnons d'atelier dans la boutique, quêtes de rencontre) n'est pas faite : elle reste à confirmer avec l'auteur.
> - **Lot H7** :
>   - la lumière du Grand Œuvre est une touche sur l'heure, jamais un filtre : nuits plus bleues et brume du matin plus épaisse (noir), aube argentée (blanc), aube dorée et fenêtres allumées plus tôt (jaune), couchant rouge et or (rouge) ;
>   - les huit stades de Brume s'ajoutent l'un à l'autre (étoiles, feuille, cœur ambré, runes, couronne) ; à l'acte VI, elle pâlit dès que l'Écriture est réclamée (Galet a lu la rune : Galet et Brume le disent une fois), jusqu'au Phénix écrit (l'éclat) ; après le Phare, elle n'est plus qu'une petite flamme dorée, des rayons autour ;
>   - la finale se joue juste avant la veillée VII (qui porte l'épilogue) : la lentille, le reflet, le soleil du phare, « Je reste avec toi. » ; elle se revoit depuis la Chronique ; le Phare de l'île garde son dessin (la flamme de Brume y brûle déjà) ;
>   - le mot d'Héliane d'un acte est dans la première bouteille ouverte pendant cet acte (le prologue n'en a pas) ; tout se déduit des quêtes réclamées et des bouteilles ouvertes, avec leurs heures ; un joueur qui a passé un acte sans ouvrir de bouteille n'aura pas son mot ; la Chronique garde les mots trouvés ;
>   - Feu follet écrit avant l'acte VII : « C'est… moi ? Comme c'est étrange. », une seule fois.
> - **Lot H8** :
>   - la Révélation se joue à la visite de l'île qui suit la condition remplie (dans une scène à l'aube), une seule fois d'un appareil à l'autre : le serveur la retient dans `world_friends` (cible `anya`, sans points), comme le Souffle du jour ;
>   - la Bénédiction s'applique dès que la condition est remplie, sans attendre la scène ;
>   - une trace se montre une fois, celle de la dernière terre explorée ; les plus anciennes se lisent dans la Chronique (« Traces d'Anya : n / 12 ») ;
>   - les pressentiments : la voix quand la Vie est écrite ; la rune de Galet et le murmure de Sylve quand le Cercle de menhirs est découvert ; les bêtes tournées vers la Lande dès la première bête écrite ; l'aveu de Brume (lot H7) ;
>   - les créatures : les lapins, hérons, koïs et mouettes, déjà là pour tous, ne changent pas (personne ne perd rien) ; Anya ajoute les loutres, son cerf blanc et son halo de lucioles ;
>   - Anya est au Cercle autour du lever et du coucher du soleil ; un toucher donne son Souffle ; le Cercle fleurit ;
>   - le bol de soupe « pour la Dame » apparaît le soir au bord du Foyer dès que le Cercle est découvert ou qu'une trace est trouvée.
> - **Relecture des lots H5 à H8** :
>   - une veillée ou une scène d'Anya ne se joue jamais par-dessus un coffre : à la fin d'un acte, le coffre d'abord, puis la veillée, puis le naufrage de l'acte suivant ;
>   - la douzième trace (« un cœur qui s'éveille ») se montre avant la Révélation ; l'île montre Anya et le Cercle fleuri dès la fin de la scène ;
>   - plus de pressentiment une fois Anya éveillée ; une veillée ou la Révélation revue depuis la Chronique peut se passer ;
>   - le Souffle d'Anya ne compte que s'il y a une page à souffler (sinon on peut revenir plus tard dans la journée), et seulement après la Révélation.

> **Version 6 (6 octobre 2026) : le nouveau tutoriel, l'avatar, les créatures de la brume** (choix de l'auteur ; la bible change avant le code : rien de la v6 n'est encore codé).
> - **Le joueur a un avatar**, qu'il choisit et personnalise. On le voit partout : sur l'île, dans les scènes, aux veillées (§ 6.17). La règle D11 (« joueur jamais montré ») est supprimée.
> - **Le joueur arrive seul** : *l'Hirondelle*, un petit navire de croisière, s'est brisée dans la brume ; il échoue seul sur la Grève, la nuit, dans le froid (§ 7.1).
> - **D'où viennent les camarades** (« mélange ») :
>   - Cannelle, Rivet, Aster et Ondin étaient sur la même croisière ; le feu du joueur les attire un à un ;
>   - Sylve et Galet sont d'anciens naufragés, sur l'île depuis des années : on les trouve, sans naufrage (§ 6.7) ;
>   - Mélisse arrive avec un nouveau naufrage (§ 8, § 10).
> - **Le tutoriel est réécrit** : 13 étapes en 3 parties, chacune née d'un besoin du joueur ; toutes les mécaniques y passent (§ 9). Il remplace les 5 étapes de la v5 et le lot H4 déjà livré.
> - **La faim et le froid** sont narratifs : Brume en parle, les premières tâches s'y rattachent, sans jauge ni mort.
> - **Les créatures de la brume** : la nuit, de petites créatures perdues sortent de la brume. Des défenses posées protègent le camp, le joueur peut en repousser une d'un toucher, et les camarades aident ; un bâtiment atteint est embrumé jusqu'à sa réparation, et rien n'est perdu (§ 6.15). Cela remplace la règle « aucun ennemi ».
> - **Anya, la déesse de l'île** : elle se révèle quand le cœur de l'île est libéré (les 9 quartiers, sans les 12 terres lointaines). Ensuite, elle erre, et on la croise rarement ; elle défend l'île et apprend au peuple à la respecter, à la comprendre et à la soigner (§ 6.14).
> - **L'écriture** : les dialogues suivent une méthode de scénariste (§ 7.4) : les personnages ne lisent plus l'interface, chaque scène a un enjeu, le non-dit plutôt que l'explication. Les répliques du tutoriel sont réécrites ainsi.
> - **Les bêtes de ferme** ont une fiche, se nourrissent et produisent (§ 6.16).
> - **Le premier palier offert** : le tutoriel fait évoluer le Puits au palier II, par exception à la règle des chapitres (§ 9, étape 12). Le Foyer II reste l'Abri, sommet de l'acte II.
> - **Le compte** se crée à la fin de la partie 1 du tutoriel (étape 6), sur la page de garde du Grimoire ; le nom s'écrit avec l'avatar.
> - **Données nouvelles** : l'avatar, les nuits de créatures, les pannes, la production des bêtes et le soin d'Anya en cours en demanderont sans doute. Garde-fou 1 (§ 19) : le lot H9 (§ 16) s'arrête et demande à l'auteur avant toute migration.

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
5. **Anya, l'Âme de l'Île** (version 5) : l'esprit le plus respecté et le plus puissant de l'île. On la devine trace après trace, et elle se révèle quand le cœur de l'île est libéré (v6 ; § 4.5, § 6.14, § 8).

**Décisions déjà prises par l'auteur, reprises telles quelles.**
- **Tutoriel** (v6) : 13 étapes en 3 parties ; le joueur seul après le naufrage d'une croisière ; Brume, puis le feu qui attire Cannelle, Rivet, Aster et Ondin.
- **Arrivées** (v6, « mélange ») : les quatre premiers viennent de la même croisière ; Sylve et Galet sont d'anciens naufragés ; Mélisse vient **d'un autre naufrage, sur besoin** ; puis les voyageurs.
- **Se découvrir** : entre eux et eux-mêmes.
- **Brume** : solitaire ; sa brume égare les bateaux ; elle devient le Phare.
- **Civilisation** : étapes, veillées, nom du peuple.
- **Compte et public** : le compte à la fin de la partie 1 du tutoriel (v6) ; tout public.
- **Décisions D1 à D16** : Brume est *elle* ; chapitre II à 3 découvertes ; palier I de l'établi à 10 découvertes ; « Grimoire » partout ; 8 stades ; *l'Hirondelle* ; frère d'Aster pour plus tard. (D11, « joueur jamais montré », est supprimée en v6 : le joueur a un avatar.)

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
9. Le tutoriel « Le Naufrage de l'Hirondelle », en 13 étapes
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
- *L'Hirondelle*, un petit navire de croisière, se brise dans la brume. Tu te réveilles **seul** sur la Grève, la nuit, dans le froid.
- **Brume**, un feu follet curieux, te fait d'abord un peu peur, puis devient ton amie. Elle te confie le **Grimoire** : ce qu'on y écrit renaît sur l'île, et revient dans les mémoires.
- **Le tutoriel part de tes besoins** (§ 9) : le froid, la faim, puis la solitude. Tu allumes un feu, et ce feu attire un à un les quatre fondateurs, rescapés de la même croisière. Chacun porte un des quatre Souffles et apprend une chose au joueur :

  | Étapes | Personnage | Souffle | Ce qu'il ou elle apprend |
  |---|---|---|---|
  | 2 à 6 | **Brume**, le feu follet | — | le Grimoire, ramasser, la Récolte, le feu, l'heure, les écus, l'interface |
  | 7 et 8 | **Cannelle**, la cuisinière-guérisseuse | Feu | les camarades (fiche, besoins, amitié) et les bêtes |
  | 9 | **Rivet**, l'horloger-artificier | Terre | créer, et se défendre |
  | 10 | **Aster**, la navigatrice | Air | les morceaux de l'île et les coffres |
  | 11 et 12 | **Ondin**, petit sourcier endormi | Eau | bâtir : le Grimoire lui rend son don, le Puits sort de terre, puis grandit |

- **La première nuit de garde** (étape 12) : de petites créatures sortent de la brume ; tes lumières et tes clôtures les arrêtent, et ta main repousse celles qui passent (§ 6.15).

- **Acte I : la Vie.** Quand le joueur écrit pour la première fois **Vie = Air + Eau + Feu + Terre**, Brume dit : *« Aster, Ondin, Cannelle, Rivet. Ensemble, la Vie. »*

**Ensuite, chaque manque amène un maître de plus**, trouvé dans la brume ou jeté par un naufrage. Chaque maître garde un **sceau** du Grimoire et souffle chaque jour un **Savoir** sur ses pages :
- **Sylve**, la sauvageonne des bois, quand le bois manque : une ancienne naufragée, seule dans la forêt depuis des années ;
- **Galet**, le vieux tailleur de runes, quand l'orage menace : un ancien naufragé, qui vit près des pierres des Anciens ;
- **Mélisse**, la jardinière des lunes, quand la faim gagne : un nouveau naufrage la jette sur la côte ;
- puis les **voyageurs**, qui ne se brisent plus : ils ont vu vos lanternes.

**Le récit en recettes.**
- **Les étapes de civilisation** : le camp devient village (la recette *Village*), peuple (qui se nomme), puis *Civilisation* (Ville + Écriture), quand le peuple réapprend à écrire grâce aux runes de Galet.
- **Les bêtes** naissent sur l'île à mesure qu'on les écrit : le Bestiaire vivant.
- **Les nuits** (v6) : la brume laisse sortir de petites créatures perdues (petits fantômes, petits zombies tout mous, bêtes égarées), toujours choupies. On s'en protège avec des défenses posées, et d'un toucher (§ 6.15).
- **Le secret de Brume (acte VI)** : sa solitude fait la brume qui brise les bateaux. Le peuple la fait renaître : **Phénix = Feu + Vie**, sa flamme et leur vie.
- **Acte VII** : on écrit **Feu follet = Feu + Marais**, la recette de Brume. Ce qui est écrit ne s'oublie plus : Brume ne sera plus jamais seule. Elle devient la flamme du **Phare de Brume**, dont le plan est justement « Feu follet ».

**Anya, l'Âme de l'Île** (ajout de la version 5).
- C'est la déesse de l'île : l'esprit de sa vie, le plus respecté et le plus puissant. Elle la comprend et la défend. C'est aussi la gemme au centre de la couverture du Grimoire, entourée des sept sceaux.
- **On ne la voit pas, on la devine**, trace après trace :
  - une voix quand on écrit la Vie ;
  - une rune lue par Galet ;
  - les bêtes qui se tournent toutes du même côté ;
  - huit traces, une par quartier du cœur libéré.
- **Elle se révèle quand le cœur de l'île est libéré** (les 9 quartiers ; v6). Au Cercle de menhirs, chaque maître se place devant sa pierre, les sept sceaux s'allument, et Anya se lève.
- **Ensuite, elle erre**, et on la croise rarement. Elle défend l'île, apprend au peuple à la respecter, à la comprendre et à la soigner, et apporte sa Bénédiction, son Souffle et ses propres créatures.
- **Brume**, née de sa dernière pensée avant le sommeil, retrouve enfin sa famille.

**L'arc de l'île** suit le Grand Œuvre des alchimistes : la nuit de la brume, puis l'argent de la lune, puis l'aube dorée, puis le rouge-or du Soleil.

**Sans risque pour les données** (v5) : aucune migration de base. Une seule donnée nouvelle, le nom du peuple, dans une table qui existe déjà. La v6 (l'avatar, les créatures, les bêtes de ferme) en demandera sans doute d'autres : à voir avec l'auteur avant le lot H9 (§ 16, § 19).

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
| G1 | Le jeu s'ouvre sur le Grimoire, sans arrivée ; l'île demande un compte | tutoriel sur la Grève ; compte à la fin de la partie 1 (§ 9) |
| G2 | Brume se présente deux fois ; son genre change | une rencontre, *elle* (§ 13) |
| G3 | Le chapitre II est ouvert d'emblée | ouvert à 3 découvertes, à l'étape 11 (§ 9) |
| G4 | **21 plans sur 48** appartiennent à un chapitre pas encore ouvert quand leur palier s'ouvre ; aucune énigme ne les propose | **fil d'Ariane** (§ 6.1) |
| G5 | La quête 1 demande 8 bois avec 0 bois | ramasser et Récolte (étape 4) avant le feu (étape 5) et la Clôture (étape 9) |
| G6 | Le 1er besoin de Paulette (3 créations) est un échec d'office | 1er besoin : la soupe ; « créations » vient plus tard (§ 6.6) |
| G7 | Palier I de l'établi au chapitre I fini (61 pages) | 10 découvertes |
| G8 | Les chapitres s'ouvrent bien plus vite que l'histoire n'avance | les veillées suivent les **actes** (quêtes), les sceaux suivent les découvertes (§ 6.8) |
| G9 | Aucun geste guidé | 13 étapes, une chose à la fois |
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
6. **Doux, drôle, jamais punitif** (tout public). Personne ne part ; l'échec donne un indice. Les créatures de la brume (v6) restent choupies : ni sang, ni mort ; un bâtiment embrumé se répare, et rien n'est perdu (§ 6.15).
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
  NUITS (la brume) → lumières, clôtures, défenses posées, toucher → le camp tient (§ 6.15)
```

En une phrase pour le joueur : **« Le Grimoire rend la mémoire, invente et fait naître ; la Récolte donne de quoi bâtir ; l'île rend des écus ; et les naufragés en font un peuple. »**

| Système | Pourquoi | Qui l'enseigne | Quand | Geste |
|---|---|---|---|---|
| Avatar et nom | se reconnaître | l'écran d'avatar | étape 0 | choisir |
| Grimoire, Athanor | savoir, souvenirs, inventions, bêtes | **Brume** | étape 3 | 2 à 4 éléments |
| Ramasser, sac, Récolte | les matières, des écus, des coffres | Brume | étape 4 | toucher ; relier au moins 3 cases pareilles |
| Fabriquer et poser (le feu) | se réchauffer ; le Foyer | Brume | étape 5 | fabriquer, puis poser sur une case dorée |
| Heure, tâches, écus, appui long, interface, compte | le temps qui passe, les récompenses, les achats | Brume | étape 6 | toucher, appui long |
| Camarades : fiche, besoins, humeur, production, amitié, cadeaux | la vie des naufragés ; ±10 % | **Cannelle** | étape 7 | donner ce qui manque, bavarder, offrir |
| Bêtes : fiche, nourrir, ramasser ; Bestiaire | le vivant | Cannelle, Brume | étape 8 | nourrir, ramasser |
| Établi, puzzle, pose, effet | embellir, protéger, défendre, combler des besoins | **Rivet** | étape 9 | assembler, puis poser sur une case dorée |
| Coffres, carte, morceaux de l'île, expéditions | l'horizon ; la première dépense | **Aster** | étape 10 | ouvrir, acheter, lancer |
| Réveil, souvenir, fil d'Ariane, énigme, Encre, bâtiment, ramasser | le métier d'un naufragé, la production | **Ondin**, Brume | étape 11 | réveiller, suivre le ruban, deviner, bâtir, ramasser |
| Évolutions, chantier, annexes, boutique | produire plus, embellir | Ondin, Brume, Aster | étape 12 | faire évoluer, acheter |
| Défense : lumières, clôtures, toucher, réparation | protéger le camp la nuit | Brume, Rivet, Cannelle | étapes 6, 9 et 12 | poser sur le chemin, toucher une créature, réparer |
| Annexes, palier I de l'établi, lumières | produire plus, éclairer | **Sylve**, Brume | acte I | poser autour du bâtiment |
| Savoirs | un indice par jour, par maître | chaque maître | dès son arrivée | bavarder |
| Pose « près de », Épreuve | créations avancées ; autre clé de l'établi | **Galet** | acte II | — |
| Expéditions, ruines, Chronique, outils, mini-jeux | l'horizon, le passé, la forge | **Mélisse**, **Rivet**, Galet | acte III | boussole |
| Bestiaire, visiteurs, cœurs, gisements, climat | le vivant, les autres | Sylve, **Aster** | acte IV | écrire une bête ; combler |
| Maisons, installation, enseignes, nom du peuple | le peuple grandit | **Cannelle** | acte V | poser une maison ; nommer |
| Bâtiments de défense | des nuits plus coriaces à chaque acte | à concevoir (§ 17, V18) | après le tutoriel | poser |

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
- **Si l'élément est déjà écrit**, il se souvient tout de suite. Mélisse, à l'acte III : « Mes graines se souviennent avant moi. Tu as écrit quelque chose, n'est-ce pas ? »

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
- **Les bêtes de ferme** suivent toujours le palier du Potager ; l'élément (Poule, Vache…) leur ajoute une variante. Elles se nourrissent et produisent (§ 6.16) ; les poules de Cannelle sont là dès le tutoriel (étape 8).
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
| L'avatar (le joueur) | l'étape 0 | vit sur l'île comme les habitants (§ 6.17) |
| Cannelle | l'étape 7 : la quête « Allume un feu » (T4) réclamée | le Foyer est déjà là : c'est le feu de camp du joueur |
| Rivet | l'étape 9 : la quête « Nourris les poules » (T6) réclamée | vit au camp ; c'est lui qui tient l'établi |
| Aster | l'étape 10 : la quête « Pose ta première création » (T7) réclamée | vit au camp de la Grève, parle, reçoit des cadeaux, a faim |
| Ondin, Mélisse | leur quartier à soi : **endormis** jusqu'au réveil (amitié > 0) | — |
| Sylve, Galet (v6) | leur quartier à soi : **cachés** jusqu'au premier bavardage (amitié > 0), qui compte comme un réveil | — |

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
- **Les anciens naufragés** (v6) : Sylve et Galet sont sur l'île depuis des années. Pas de naufrage pour eux ; à la place, une **découverte** :
  - Sylve : une lueur dans les arbres de La Lisière, et la queue rousse de Mousse qui guide le joueur ;
  - Galet : un ciseau qu'on entend tailler la pierre, du côté de La Colline ; le sceau de Saturne, brisé au tutoriel, l'attendait.
  - Puis le même chemin : libérer le quartier, **apprivoiser** (le premier bavardage, le même objectif `wake`), rendre le souvenir, bâtir. Proposition à valider (§ 17, V21).

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

### 6.14 Anya : les Traces, la Révélation, l'errance

**Qui elle est** (précisé par l'auteur en v6) : la déesse de l'île. Elle la comprend et la défend ; elle aide le peuple à la respecter, à la comprendre et à la soigner. Elle erre, et on la voit rarement.

**La condition de la Révélation** (v6) : **le cœur de l'île est libéré**.
- Les **9 quartiers du cœur sont à soi** : Source, Lisière, Colline, Jardins, Faubourg, Hauteurs, Crique, Grande Forêt, Hameau. Il ne reste alors plus aucune brume sur le cœur de l'île.
- Les 12 terres lointaines et les îlots n'en font pas partie : on les explore avant ou après.
- **Ce que ça demande** (d'après la carte, `B/src/services/worldMap.js`) : environ **6 100 écus de quartiers**. Le Hameau s'achète à l'acte V : la Révélation tombe donc **au plus tôt vers l'acte V**, souvent avant le Phare.
- **Rien à stocker** : la condition se déduit des quartiers à soi.
- **Changement de code** : la condition livrée au lot H8 (les 12 terres explorées et les 9 quartiers) devient celle-ci (lot H9). Un joueur qui remplit déjà la nouvelle condition voit la Révélation à sa prochaine visite : personne ne perd rien.

**Les Traces d'Anya (la découverte progressive).**
- **Quatre pressentiments dans l'histoire** (§ 10) :
  - la voix quand on écrit la Vie (acte I) ;
  - la rune de Galet (acte III) ;
  - les bêtes qui se tournent vers les menhirs (acte IV) ;
  - l'aveu de Brume (acte VI), ou sa variante si Anya est déjà éveillée.
- **Huit traces, une par quartier du cœur libéré après La Source** (v6 ; elles suivaient les 12 terres). Elles viennent **dans l'ordre**, quel que soit le quartier, de la plus discrète à la plus forte : quand la brume se lève sur le quartier, une image de 2 secondes, et une ligne dans la Chronique (« Traces d'Anya : 5 / 8 »). La huitième précède la Révélation.

| # | Trace |
|---|---|
| 1 | Les pierres sont tièdes, comme une main. |
| 2 | Les herbes s'inclinent toutes du même côté. Il n'y a pas de vent. |
| 3 | Une plume d'or, bien trop grande pour un oiseau. |
| 4 | Une empreinte de cerf, faite de lumière. |
| 5 | Une fleur a poussé pendant la nuit, là où tu dormais. |
| 6 | Les lucioles dessinent un visage, puis s'éparpillent. |
| 7 | Le vent chante deux syllabes : « A… nya ». |
| 8 | Sous tes pieds, un battement : un cœur qui s'éveille. |

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

**Ensuite, elle erre** (v6 : plus de rendez-vous fixe au Cercle).
- **Rarement** : elle apparaît n'importe où sur l'île découverte, à l'aube ou au crépuscule, pour un court moment (proposition : deux ou trois fois par semaine ; à équilibrer, § 17, V22).
- **Des signes l'annoncent** : les bêtes se tournent toutes du même côté, des fleurs s'ouvrent sur son chemin, les lucioles se rassemblent.
- **Elle défend l'île** : là où elle passe, les égarés fuient, et un bâtiment embrumé guérit.
- **Elle apprend à respecter l'île, à la comprendre et à la soigner.** La croiser, c'est :
  - l'entendre dire une phrase sur l'île ;
  - recevoir son **Souffle** : un ingrédient révélé sur une page ouverte ou marquée ;
  - recevoir un **soin** à faire : replanter là où elle le montre ; apaiser une bête (la nourrir, rester près d'elle) ; chasser la brume d'un lieu (un lieu remarquable, une source). Un seul soin à la fois ; un soin fait fait fleurir l'endroit et rapporte des écus (à équilibrer).
- **Ce qu'elle dit en passant** (exemples) :
  - « La source du nord a soif. Va la voir. »
  - « Cet arbre a vu ceux d'avant. Laisse-le vieillir. »
  - « Les égarés ne sont pas méchants. Ils ont oublié leur chemin, comme ceux d'avant. »
  - « Tu marches plus doucement, maintenant. L'île le sent. »
- **La Bénédiction d'Anya** : un effet durable, comme ceux des lieux remarquables.
  - Les gisements de climat repoussent en **4 h au lieu de 6 h**.
  - L'humeur des naufragés ne descend plus sous « content » : plus de malus.
  - Équilibrage à confirmer.
- **Les créatures d'Anya** : les bêtes qui **n'existent pas** dans le Grimoire (lapins, hérons, mouettes, loutres, koïs) n'apparaissent qu'avec elle, car ce sont les siennes. Le Bestiaire dépasse alors le Grimoire.
- **Le Cercle fleuri** : le dessin du lieu remarquable change (des fleurs, une lueur au centre). Elle y revient parfois, comme ailleurs.

**Technique** :
- la condition et les traces sont déduites dans la vue de l'île (`anya: { traces, awake }`), à partir des quartiers à soi ;
- la Bénédiction passe par :
  - la chaîne des bonus, comme `landmarks.bonusesOf` ;
  - `finds.readyIn`, avec la durée de repousse en paramètre ;
  - l'humeur dans `villagers.js` ;
- l'errance : le serveur tire d'une graine (le jour, l'île) où et quand elle apparaît ; le Souffle passe par la route de bavardage (cible `anya`), une fois par apparition, retenue dans `world_friends` ;
- **le soin en cours** est une donnée nouvelle (lot H9, garde-fou 1) ;
- la scène, la gemme, les créatures, les signes et le Cercle fleuri sont côté front.

### 6.15 Les créatures de la brume et la défense (v6)

- **Qui** : des créatures nées de la brume : petits fantômes, petits zombies tout mous, bêtes égarées (selon le climat du morceau d'île). Ce sont des choses oubliées, perdues, grognonnes plus que méchantes ; Brume les appelle **les égarés**. Repoussées, elles se changent en lucioles ou retournent dans la brume.
- **Quand et d'où** : la nuit seulement, depuis les morceaux d'île encore dans la brume, au bord de ce qu'on a libéré. Chaque morceau a les siennes, plus coriaces à chaque acte. Le jour est calme.
- **Se défendre : des défenses posées, et la main** (réponse corrigée par l'auteur le 6 octobre).
  - Les défenses agissent seules, comme dans un *tower defense* : tout est dans leur placement.
  - Les **lumières** (le feu, les torches, les lanternes) les repoussent, et les changent en lucioles.
  - Les **clôtures** leur barrent le passage.
  - Plus tard viendront des **bâtiments de défense** (à concevoir, § 17, V18).
  - Les cases dorées montrent où une défense sert le plus ; le soir, des pointillés montrent par où les créatures viendront.
  - **Le toucher** : le joueur peut toucher une créature pour la repousser. Elle boude, recule et retourne dans la brume ; jamais de coup, jamais de mal.
  - **Les camarades aident**, chacun à sa façon (Cannelle et sa louche, par exemple).
- **Si une créature passe** : le bâtiment qu'elle atteint est **embrumé**. Il ne produit plus jusqu'à ce qu'on le **répare**, depuis sa fiche, avec un peu de pierre ou de bois. Rien n'est détruit, aucun progrès n'est perdu, personne ne part.
- **Dans le tutoriel**, en trois temps (§ 9) :
  - étape 6 : le feu tient un petit fantôme à distance ;
  - étape 9 : la Clôture barre le passage ;
  - étape 12 : la première nuit de garde : les défenses, le toucher, une panne, une réparation.
- **Le ton** : choupi ; ni sang, ni mort. Une créature qui recule boude, puis s'envole en luciole.
- **Technique** : tout se décide au serveur (les nuits, les chemins, ce qui passe, ce qu'un toucher repousse, la panne, la réparation) ; le front ne fait que montrer. Ce sont des données nouvelles (§ 15, § 16).
- Cette règle remplace « aucun ennemi » (dans la bible et dans la bibliothèque de dessins).

### 6.16 Les bêtes de ferme (v6)

- **Chaque bête a sa fiche** (appui long) : ce qu'elle aime, son humeur, ce qu'elle donne.
- **Nourrir** : depuis sa fiche, avec de la nourriture. Une bête nourrie est contente.
- **Produire et ramasser** : une bête contente produit (les poules, des œufs ; les autres, selon leur fiche, à fixer au lot H9). Une bulle apparaît au-dessus d'elle, et l'on ramasse comme la production d'un bâtiment.
- **Les poules de Cannelle** : trois poules de la cuisine du navire, sauvées à l'étape 8. Elles vivent au camp, près du feu. Les autres bêtes de ferme suivent toujours le palier du Potager (§ 6.5).
- **Ce qui ne change pas** : les bêtes déjà là pour tous restent ; personne ne perd rien.

### 6.17 L'avatar (v6)

- **Le choix** (étape 0) : silhouette, peau, yeux, sourcils, taches de rousseur, coupe et couleur de cheveux, haut, bas, couleurs, un accessoire ; ou « Au hasard ». L'aperçu tourne et s'anime. Le nom s'écrit sous l'aperçu.
- **Partout** : sur l'île, dans les scènes, aux veillées (il s'assoit dans le cercle). Il remplace la règle D11 (« joueur jamais montré »).
- **Sur l'île** : il vit seul comme les habitants (il se promène, se repose) et vient vers ce qu'on touche pour agir. Aucun nouveau geste.
- **Sa tenue** : la version naufragée de la tenue choisie (délavée, déchirée, pieds nus) jusqu'au Campement, où Cannelle recoud ses habits ; puis la tenue choisie. On peut changer son avatar plus tard, depuis le menu.
- **Il ne parle pas** : ses pensées s'écrivent en italique dans les scènes. Les autres l'appellent par son nom, puis « Alchimiste » (veillée V).
- **Les joueurs qui ont déjà une île** : l'écran d'avatar s'ouvre à leur prochaine visite, sans refaire le tutoriel, avec un mot d'accueil de Brume (proposé) : « Toi qui lis… Tout ce temps, je n'ai connu que tes mains. » / « Montre-moi ton visage ? »
- **Technique** : l'avatar est gardé par le serveur avec le compte (donnée nouvelle) ; avant le compte, avec le carnet invité.

---

## 7. L'histoire

### 7.1 Synopsis

> *L'Hirondelle*, un petit navire de croisière, voguait de port en port quand une brume épaisse s'est levée sur la mer.
>
> Tu te réveilles seul sur la Grève, la nuit, trempé et transi. Une flamme bleue erre dans la brume, approche, et tu as peur. Elle aussi : c'est **Brume**, qui n'a vu personne depuis des siècles. Elle te confie le livre qu'elle garde sans savoir le lire : le **Grimoire**. Ce qu'on y écrit renaît sur l'île.
>
> Tu écris le Vent, et il chasse la brume de la plage. Tu ramasses de quoi manger, tu allumes un feu. Ce feu, d'autres rescapés de la croisière le voient. À l'aube, **Cannelle**, la cuisinière, sort de la brume et demande à se joindre à toi ; ses poules ont survécu. Leurs caquets attirent **Rivet**, l'horloger, qui triait ses vis sous une voile. À midi, **Aster**, la navigatrice, repêche une caisse dans les vagues et aperçoit, dans la brume, de l'eau qui brille. À La Source, **Ondin** dort contre un rocher, sa baguette de sourcier à la main. Il ne sait plus trouver l'eau, jusqu'à ce que tu écrives le Puits. La nuit venue, de petites créatures sortent de la brume, grognonnes et perdues : vos lumières les changent en lucioles.
>
> Un jour, tu poses dans l'Athanor l'Air, l'Eau, le Feu et la Terre ensemble, et tu écris la **Vie**. *« Aster, Ondin, Cannelle, Rivet. Ensemble, la Vie. »* Les arbres renaissent, et une lueur dans la forêt mène à **Sylve**, une sauvageonne échouée là sur un radeau, il y a des années. Puis l'orage approche, et l'on entend un ciseau sur la pierre : c'est **Galet**, vieux tailleur de runes, qui vit seul près des pierres des Anciens. Enfin, la faim amène **Mélisse**, jardinière des lunes, jetée sur la côte par un nouveau naufrage.
>
> Vous allumez des lanternes. Un soir, une barque approche, et elle ne se brise pas : ses passagers ont vu vos lumières. Le camp devient village, puis un peuple qui se choisit un nom. Sous la brume dorment les ruines des **Anciens**, des naufragés d'autrefois. Ils ont cessé d'écrire, et la brume les a effacés. Galet déchiffre leurs runes ; le peuple réapprend à écrire, et devient une **civilisation**.
>
> Alors Brume comprend : sa solitude fait la brume de la mer, et c'est elle qui a brisé tous ces bateaux. Elle s'éteint presque. Autour du feu, chacun lui tend son Souffle : *« Ta flamme, notre vie. »* Brume renaît en **Phénix**.
>
> Au dernier chapitre, guidés par le Passeur jusqu'à l'Île des Légendes, vous lisez le dernier mot d'**Héliane**, la dernière alchimiste. Tu écris enfin **Feu follet** : Feu + Marais, la recette de Brume. Ce qui est écrit ne s'oublie plus. Brume ne sera plus jamais seule : elle devient la flamme du **Phare de Brume**, et les navires n'y meurent plus. Ils y arrivent.
>
> Plus tard, quand plus aucune brume ne couvre le cœur de l'île, les traces se rejoignent : une plume d'or, une empreinte de lumière, un nom chanté par le vent. À l'aube, au Cercle de menhirs, chaque maître se place devant sa pierre, et les sept sceaux s'allument. Au centre se lève **Anya**, l'Âme de l'Île, celle qui vous avait choisis. *« Vous m'avez écrite bien avant de me voir. »* Brume, née de sa dernière pensée avant le sommeil, n'est plus seule : elle a retrouvé sa famille. Depuis, Anya erre sur l'île. On la croise rarement ; là où elle passe, les égarés fuient et les fleurs s'ouvrent.

### 7.2 L'univers

- **L'île** : elle « choisit » ceux qui y échouent. Elle vit tant qu'on se souvient d'elle.
- **La brume** :
  - sur l'île, c'est l'oubli ; elle endort sans faire de mal, et c'est pourquoi les naufragés dorment ;
  - sur la mer, c'est le chagrin de Brume ; elle égare les bateaux ;
  - la nuit, elle laisse sortir de petites **créatures** (v6) : des choses que l'île a oubliées, perdues, qui errent sans savoir où aller. Grognonnes plus que méchantes, elles embrument ce qu'elles touchent ; la lumière les change en lucioles (§ 6.15).
  - Les lumières, les découvertes et les amitiés la repoussent.
- **Anya, l'Âme de l'Île** : la déesse de l'île, l'esprit de sa vie (les bêtes, les plantes, les saisons), le plus ancien et le plus puissant.
  - C'est elle qui « choisit » les naufragés.
  - Elle s'est endormie quand les Anciens ont cessé d'écrire la vie.
  - Elle se réveille quand le cœur de l'île est de nouveau libéré (§ 6.14).
  - Éveillée, elle erre, et on la voit rarement. Elle comprend l'île et la défend ; elle apprend au peuple à la respecter, à la comprendre, à la soigner.
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
- **La méthode** (v6, choisie par l'auteur) :
  - **les personnages ne lisent jamais l'interface**. Le mode d'emploi passe par l'écran (une main, un halo, une ligne d'aide sans nom) ; les personnages parlent de ce qu'ils vivent ;
  - **chaque scène a un enjeu et un basculement** : quelqu'un veut quelque chose, quelque chose s'y oppose ;
  - **le non-dit** : on montre plutôt qu'on dit (Brume ne dit jamais qu'elle est seule) ; un secret se prépare longtemps avant d'être révélé ;
  - **simple, jamais simpliste** : on écrit pour les adultes autant que pour les enfants ; pas de « Bravo ! », pas de ton de maîtresse d'école ;
  - les pensées du joueur sont rares, concrètes, sensorielles.

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
- **Première réplique** : « Tu me vois. » / « … Tu me vois vraiment ? »

---

#### Aster — la navigatrice · Souffle de l'Air · ☿ Mercure (chapitre I)
- **Bâtiment** : Ponton (La Crique). **Arrivée** : tutoriel, étape 10, à midi, quand tout le monde a soif ; elle repêche une caisse dans les vagues.
- **Apparence** (générateur) : ciré jaune, foulard rouge, longue-vue à la ceinture, cheveux noués par le vent, taches de rousseur, bottes trop grandes.
- **Personnalité** : intrépide, impatiente, rieuse, incapable de rester assise ; elle donne un nom à chaque nuage.
- **Voix** : phrases courtes, impératives, pleines de marine. « Par tous les alizés ! » « Cap au nord ! »
- **Sa magie** : **lire le vent**. Elle sent le temps qu'il fera (la météo de l'île existe déjà), et un sifflement fait tourner la brise.
- **Familier** : **Bosco**, un petit macareux bougon (élément **Oiseau**, profondeur 4 ; le dessin du macareux existe depuis le lot 9e).
- **Ce qu'elle apprend au joueur** : les **morceaux de l'île** (la carte, libérer, explorer) et les **coffres** ; plus tard, les **visiteurs**.
- **Savoir** : Phénomènes naturels.
- **Souvenir** : **Bateau** (Bois + Eau), retrouvé à l'acte IV. Elle n'a pas perdu son métier, elle a perdu son **courage** : « Je ne sais plus tenir une barre. »
- **Secret et arc** : elle était à la barre quand *l'Hirondelle* s'est brisée, et elle se croit coupable. À l'acte VI, elle comprend que c'était la brume, et c'est **la première à pardonner à Brume** : « Moi aussi, je croyais que c'était ma faute. »
- **Son passé, cœur après cœur** :
  1. sa grand-mère gardait un phare, et lui a appris les vents ;
  2. le tour du monde qu'elle voulait faire ;
  3. un frère perdu dans une brume, il y a des années (idée gardée pour plus tard) ;
  4. la nuit du naufrage ;
  5. « Je reste. La mer peut attendre. »
- **Première réplique** : « Ho, du camp ! Vous étiez sur l'Hirondelle ? Alors souquez, elle pèse un âne mort ! »

---

#### Cannelle — la cuisinière-guérisseuse · Souffle du Feu · ♂ Mars (chapitre V)
- **Bâtiment** : Foyer. **Arrivée** : tutoriel, étape 7, à l'aube : elle a vu le feu depuis les rochers et demande à se joindre au joueur.
- **Apparence** : grande et ronde, tablier constellé de taches, louche de cuivre géante en bandoulière, chignon piqué d'une cuillère, joues rouges.
- **Personnalité** : tonitruante, superstitieuse, généreuse jusqu'à l'excès, jamais d'accord, très tendre au fond. Elle veut nourrir tout le monde, Brume comprise (« Tu manges, toi ? »).
- **Voix** : proverbes de cuisine qu'elle invente (« Ce qui mijote ne se presse pas ! ») et surnoms (« mon caneton », « ma brindille »).
- **Sa magie** : **ses soupes sont des potions** : elles soignent l'humeur. C'est elle qui donne leur sens aux besoins et à l'humeur.
- **Familier** : **Bouillon**, une grenouille dodue qui goûte tout (élément **Grenouille** = Marais + Vie ; dessin du lot 9e).
- **Ce qu'elle apprend au joueur** : les **camarades** (fiche, besoins, humeur, amitié, cadeaux) et les **bêtes**, avec ses poules ; plus tard, les **maisons**.
- **Ses poules** : trois poules de la cuisine du navire, sauvées dans leur cage (étape 8).
- **Savoir** : Corps et esprit, Créations humaines.
- **Souvenir** : le **Feu**. Elle se souvient tout de suite devant le feu de camp.
- **Ce qu'elle a perdu d'elle-même** : **le goût**, dans le naufrage. Il lui revient à l'acte V avec la **Potion**.
- **Lien de sang** : **grand-tante d'Ondin**. Dès l'étape 7 : « Mon Ondin… Il sait nager, hein ? » Ils se retrouvent à l'étape 11.
- **Son passé, cœur après cœur** :
  1. son auberge sur un port ;
  2. pourquoi elle emmenait Ondin (« ses parents l'attendent de l'autre côté ») ;
  3. elle a eu peur des feux follets toute sa vie, et maintenant elle en aime un ;
  4. l'aveu du goût perdu ;
  5. « Une cuillère pour le corps, une pour l'âme… et une pour toi. »
- **Première réplique** : « Un feu ! J'ai cru que je rêvais. Toute la nuit, je l'ai regardé depuis les rochers. » Puis, devant Brume : « Un feu follet ! … Oh. Il a des yeux de chiot, celui-là. » (Brume : « Elle. »)

---

#### Rivet — l'horloger-artificier · Souffle de la Terre · ♃ Jupiter (chapitre VI)
- **Bâtiment** : établi du Foyer, puis Atelier (Le Faubourg). **Arrivée** : tutoriel, étape 9, le matin ; il trie ses vis sous une voile tendue, et n'en revient pas d'entendre des poules.
- **Apparence** : lunettes à quatre loupes empilées, tablier de cuir aux mille poches, mèche grise rebelle, un crayon derrière chaque oreille.
- **Personnalité** : perfectionniste et distrait, enthousiaste, parle trop vite ; il démonte tout pour comprendre ; ses jeux de mots tombent toujours à plat.
- **Voix** : il s'interrompt pour une idée (« Attends… Non. Si ! Si ! ») et ponctue de bruits mécaniques (« clic », « tac »).
- **Sa magie** : **l'artifice**. Il donne un peu de vie aux objets ; les créations de l'île s'animent déjà, et c'est lui.
- **Familier** : **Tic-Tac**, une abeille mécanique à remontoir qui s'arrête au mauvais moment. C'est sa création ; quand on écrit **Abeille**, il lui fabrique une amie.
- **Ce qu'il apprend au joueur** : **créer** (établi, puzzle, pose, effet) et la première défense, la Clôture ; plus tard, les **outils**.
- **Savoir** : Histoire, Technologie.
- **Souvenir** : **Four** (Brique + Feu), pour sa vraie forge, à l'acte III.
- **Secret et arc** : un de ses automates a mis le feu à son atelier, jadis. Depuis, il n'ose plus rien créer de grand. À l'acte VII, il construit le **mécanisme du Phare** (la lentille qui tourne).
- **Son passé, cœur après cœur** :
  1. l'horloge de son village, qu'il a réparée enfant ;
  2. ses automates ;
  3. l'incendie ;
  4. pourquoi il est parti ;
  5. « Presque tout peut se réparer. Même moi. »
- **Première réplique** : « Des poules. J'entends des poules. Sur une île déserte. »

---

#### Ondin — le petit sourcier · Souffle de l'Eau · ☾ Lune (chapitre III)
- **Bâtiment** : Puits (La Source). **Arrivée** : tutoriel, étape 11 ; il dort à La Source.
- **Apparence** : 10 ans, ciré bleu trop grand aux manches retroussées, bonnet de nuit, pieds nus, baguette de noisetier fourchue, bocal en verre vide.
- **Personnalité** : rêveur, toujours à moitié endormi (la brume le tient encore), il pose des questions étranges et profondes et parle à la lune et à l'eau. Drôle sans le vouloir.
- **Voix** : il chuchote (« Chut… l'eau parle. ») et raconte ses rêves comme s'ils étaient vrais.
- **Sa magie** : **la sourcellerie**. Sa baguette trouve l'eau, et les choses perdues : c'est lui qui trouve la **clé du phare** à l'acte VI.
- **Familier** : **Bulle**, un petit poisson. Au début, son bocal est vide : « Bulle est retourné dans la mer. » Quand on écrit **Poisson** (Eau + Vie), Bulle revient : c'est la première preuve que ce qu'on écrit renaît.
- **Ce qu'il apprend au joueur** : **bâtir** (réveil, souvenir, bâtiment, ramasser), le **fil d'Ariane**, puis les **évolutions** (le Puits au palier II).
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
- **Bâtiment** : Bosquet (La Lisière). **Arrivée** : acte I, quand **le bois manque**. **Ancienne naufragée** : son radeau de bois flotté s'est brisé il y a des années, et elle vit seule dans la forêt depuis ; c'est pour ça que ses mots reviennent peu à peu. Une lueur dans les arbres et la queue rousse de Mousse mènent le joueur jusqu'à elle.
- **Apparence** : 17 ans, cape de feuilles cousues, cheveux pleins de brindilles et d'une plume, pieds nus, traits verts peints sur les joues.
- **Personnalité** :
  - farouche : elle se cache, se méfie des humains, puis s'apprivoise ;
  - vive et rieuse une fois en confiance ;
  - elle parle aux arbres et aux bêtes plus qu'aux gens ;
  - elle **a peur du feu**.
- **Voix** : au début, des phrases sans articles (« Bois. Toi. Ami ? »). **Sa grammaire revient avec les cœurs** : ses répliques s'écrivent mieux à chaque niveau d'amitié.
- **Sa magie** : elle chante aux graines pour les faire pousser, et comprend les bêtes.
- **Familier** : **Mousse**, un renardeau qui se cache (élément **Renard**, profondeur 9). Il ne se montre que très tard : un beau but à long terme. À l'acte I, on n'aperçoit que sa queue rousse, qui guide le joueur vers Sylve.
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
- **Bâtiment** : Carrière (La Colline). **Arrivée** : acte II, quand **il faut de la pierre avant l'orage**. **Ancien naufragé** : son caboteur chargé de pierres s'est brisé il y a longtemps ; il vit depuis dans la fissure de La Colline, près des pierres des Anciens. On l'entend tailler la pierre avant de le voir.
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
- **Bâtiment** : Potager (Les Jardins). **Arrivée** : acte III, quand **la nourriture ne suffit plus** ; sa barque de graines s'est brisée : le premier nouveau naufrage depuis *l'Hirondelle*.
- **Apparence** : 35 ans, chapeau de paille à larges bords orné de fleurs séchées, châle couleur nuit brodé de lunes, sabots, mains toujours terreuses, une boîte à graines en fer serrée contre elle.
- **Personnalité** : calme absolu, lente, mystérieuse, drôle pince-sans-rire. Elle répond par des questions et ne se presse jamais.
- **Voix** : « Chaque chose en sa lune. » Elle parle des plantes comme de personnes.
- **Sa magie** : **le jardinage lunaire**. Ses plantes poussent au rythme de la lune ; elle prépare les herbes médicinales qui vont dans les potions de Cannelle.
- **Familier** : **Lunette**, un papillon de nuit (élément **Papillon** = Air + Chenille).
- **Ce qu'elle apprend au joueur** : la nourriture, la ferme ; c'est elle qui trouve les **premières ruines**.
- **Savoir** : Flore, Biologie.
- **Souvenir** : **Plante**, déjà écrite depuis l'acte I. Elle se souvient dès son réveil : « Mes graines se souviennent avant moi. Tu as écrit quelque chose, n'est-ce pas ? »
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
  - la déesse de l'île : l'esprit de sa vie (les bêtes, les plantes, les saisons), la présence la plus ancienne et la plus puissante ; elle comprend l'île et la défend ;
  - c'est elle qui « choisit » les naufragés : « l'île a fait son choix », écrivait Héliane, et c'était Anya ;
  - elle s'est endormie quand les Anciens ont cessé d'écrire la vie ;
  - sa dernière pensée avant le sommeil fut une petite flamme pour veiller : **Brume**.
- **Arrivée** : la **Révélation**, quand le cœur de l'île est libéré (§ 6.14). Avant, seulement des traces.
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
- **Ensuite** : ce n'est pas une habitante comme les autres (pas de cœurs, pas de besoins). **Elle erre**, et on la croise rarement, à l'aube ou au crépuscule. Là où elle passe, les égarés fuient et les bâtiments embrumés guérissent. Elle apprend au peuple à respecter l'île, à la comprendre et à la soigner (un soin à faire) ; elle apporte son Souffle, sa Bénédiction et ses créatures (§ 6.14).

---

#### Le Passeur (acte VII)
Grand, silencieux, une cape de plumes grises, une lanterne au bout d'une perche, une barque qui vole. Il parle en énigmes, comme le Grimoire. Il a mené les derniers Anciens, et Héliane.
- **Réplique** : « Une seule traversée. Monte, ou reste. »

#### Héliane, la dernière alchimiste (absente)
Drôle, distraite, généreuse. Elle signe « H. » dans les bouteilles ; son prénom se découvre dans sa maison (acte V) et son dernier mot sur l'Île des Légendes (acte VII).

#### Les voyageurs
Les 24 visiteurs actuels gardent leurs prénoms et leurs histoires. Dans le récit, ce sont ceux qui ont vu les lanternes.

#### Toi, le joueur (v6)
Tu voyageais sur *l'Hirondelle*, et tu te réveilles seul sur la Grève. Ton avatar, tu le choisis et le personnalises (§ 6.17). Tu ne parles pas : tes pensées s'écrivent en italique pendant les scènes. Les autres t'appellent par ton nom, puis « Alchimiste » à la veillée V.

---

## 9. Le tutoriel « Le Naufrage de l'Hirondelle », en 13 étapes

**Le cadre** (version 6, choisie par l'auteur le 6 octobre 2026 ; elle remplace les 5 étapes de la v5).
- **Le principe** : chaque étape part d'un besoin du joueur (le froid, la faim, la solitude, le vent, la soif, la nuit), lui apprend une seule chose pour y répondre, puis le récompense. Toutes les mécaniques du jeu y passent, chacune au moment où l'histoire en a besoin. L'interface n'ouvre un bouton que le jour où il sert.
- **Trois parties**, avec une pause possible entre elles : « Seul » (étapes 0 à 6), « La troupe » (7 à 9), « L'île » (10 à 12). **Durée visée** : 35 à 45 minutes.
- **Passable** : chaque scène d'un toucher, tout le tutoriel par « Passer ». **Rejouable** dans la Chronique. Avec le mouvement réduit, les scènes deviennent des images fixes.
- **Le temps avance toujours** : la nuit du naufrage (étapes 1 à 6), l'aube (7 et 8), le matin (9), midi (10), l'après-midi (11), le soir et la nuit (12). Pendant le tutoriel, l'île suit le récit ; à la fin, elle rejoint l'heure réelle.
- **Brume** reste au stade 0 (pâle et tremblante) pendant tout le tutoriel (§ 13).
- **La faim et le froid** du joueur sont narratifs : Brume en parle et les tâches s'y rattachent, sans jauge ni mort.
- **Le compte** : le nom s'écrit avec l'avatar (étape 0) ; le compte se crée sur la page de garde du Grimoire à la fin de la partie 1 (étape 6), avant la première pause.
- **Avant le compte** (étapes 0 à 6), le joueur est invité, comme à l'étape 1 de la v5 : son carnet invité garde le Grimoire, et sa partie le suit au compte (`PrologueName.vue`). Mais aujourd'hui l'île demande un compte, et les étapes 4 et 5 s'y jouent (ramasser, la Récolte, le feu) : le serveur doit ouvrir l'île du tutoriel au carnet invité. **À vérifier au lot H9** ; si c'est trop lourd, en parler à l'auteur avant de déplacer le compte.
- **Les joueurs qui ont déjà une île** ne jouent pas le tutoriel : ils créent leur avatar à leur prochaine visite, avec un mot d'accueil de Brume (§ 6.17).
- **Ce qui ne peut pas exister le premier jour** (les mini-jeux, au palier III ; les visiteurs, avec le port ; les îlots, avec un bateau) est présenté le jour où il arrive, par une petite étape guidée (Brume ou le camarade concerné).
- **Ce qui arrive en route** : le chapitre II s'ouvre à la 3e découverte (Brique, étape 11) ; le 3e emplacement de l'Athanor s'ouvre avec Boue (3 familles), le 4e avec Puits (4 familles). Ainsi l'acte I peut écrire **Vie**.
- **L'écriture** suit le § 7.4, et en particulier :
  - **les personnages ne lisent jamais l'interface**. Le mode d'emploi passe par l'écran : une main, un halo, ou une ligne d'aide sans nom en bas de l'écran, notée *[aide : …]* dans la colonne du joueur. Les personnages parlent de ce qu'ils vivent ;
  - **chaque étape a un enjeu et un basculement**, notés en tête d'étape ;
  - **le non-dit** : Brume ne dit jamais qu'elle est seule, on le voit ; son secret (sa tristesse fait la brume qui brise les bateaux, acte VI) se prépare dès la première nuit, sans être dit ;
  - une barre « / » sépare deux bulles ; les pensées du joueur sont rares et concrètes.

### Partie 1 — « Seul »

#### Étape 0 — Ton avatar

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 0a | Ta carte d'embarquement de *l'Hirondelle* : la photo se compose, tourne et s'anime (face, trois quarts, marche, salut) | choisir silhouette, peau, yeux, sourcils, taches de rousseur, coupe et couleur de cheveux, haut, bas, couleurs, un accessoire ; ou « Au hasard » | — |
| 0b | Sous la photo, une ligne « Nom » | écrire son nom | — |
| 0c | Un tampon : « Embarqué ». Le vent du large emporte la carte | toucher | Légende : « Troisième nuit de croisière. » |

Après le naufrage, l'avatar porte la version naufragée de sa tenue (délavée, déchirée, pieds nus) jusqu'au Campement.

#### Étape 1 — Le naufrage

**L'enjeu** : survivre. **Le basculement** : tu te réveilles seul.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 1a | Le pont de *l'Hirondelle*, la nuit ; des guirlandes qui battent, la pluie à l'horizontale ; l'avatar agrippé au bastingage | rien (passable) | Un haut-parleur grésille : « Mesdames et messieurs, le commandant vous prie de regagner vos cabines… » |
| 1b | Une vague énorme couvre l'écran. Le noir ; la mer, très loin | — | — |
| 1c | La Grève, la nuit, dans la brume ; des débris, une chaise longue retournée. L'avatar se redresse et grelotte | toucher pour se relever | *(pensée)* « Du sable dans la bouche. La mer. Rien d'autre. » |
| 1d | Un gilet de sauvetage s'échoue à ses pieds, « L'HIRONDELLE » au pochoir. Seule la mer répond | toucher | *(pensée)* « Ohé ? … Quelqu'un ? » |

**Ce que ça apprend** : un toucher fait avancer.

#### Étape 2 — Brume

**L'enjeu** : ne pas rester seul dans le froid. **Le basculement** : ce qui fait peur est ce qui sauve.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 2a | Une lueur pâle erre dans la brume, s'arrête, repart, comme si elle cherchait quelque chose | toucher | *(pensée)* « Une lanterne. On me cherche ! » |
| 2b | Elle approche d'un coup : une flamme, deux grands yeux. L'avatar recule d'un pas | « Reculer » ou « Ne pas bouger » (les deux font avancer) | *(pensée)* « Ce n'est pas une lanterne. Les marins disent que les feux follets égarent les voyageurs. » |
| 2c | Brume sursaute aussi, file derrière un rocher et passe la tête | toucher Brume | « Tu me vois. » / « … Tu me vois vraiment ? » |
| 2d | Elle sort, tourne autour de l'avatar, bien trop près, et l'examine | toucher | « Tu trembles. Vous tremblez tous comme ça ? J'ai oublié comment vous étiez faits. » |
| 2e | Elle se pose à hauteur de ses yeux | toucher | « Brume. C'est ainsi qu'ils m'appelaient, ceux d'avant. » / « Je crois que c'est mon nom. Personne ne l'a dit depuis longtemps. » |
| 2f | Sa lueur s'avive et perce la brume : des murs effondrés, un puits sec, une porte sans maison | toucher | « Là, il y avait un village. Des rires, le soir. De la soupe. » / « Puis ils ont cessé d'écrire, et la brume a tout pris. » |
| 2g | Elle se tourne vers la mer ; l'épave est à peine visible | toucher | « Ton bateau… Pardon. La brume est épaisse, ces temps-ci. » |
| 2h | Elle revient près de l'avatar, toute petite | toucher | « Reste près de moi. Je ne suis pas bien chaude, mais je brille. » / « Et demain, on cherchera les autres. La mer rend parfois ce qu'elle prend. » |

**Ce que ça apprend** : où l'on est (une île autrefois habitée, que la brume a recouverte), qui est Brume, et ce qu'il faut faire : passer la nuit, puis chercher les autres. Le but grandit avec le tutoriel. **Le non-dit** : Brume s'excuse du naufrage sans savoir pourquoi ; l'acte VI dira que sa tristesse fait la brume de la mer.

#### Étape 3 — Le Grimoire

**L'enjeu** : le livre que Brume garde sans savoir le lire. **Le basculement** : il s'ouvre pour toi, et l'île répond.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 3a | Brume file vers un creux de rocher et en tire, à grand-peine, un livre lourd fermé de sept sceaux | toucher le livre | « Je le garde depuis toujours. Je n'ai jamais su le lire. » / « Eux savaient. » |
| 3b | Le livre s'ouvre sous la main de l'avatar (l'animation d'ouverture existante). Brume recule | — | « Il ne s'est jamais ouvert pour moi. Jamais. » |
| 3c | La première page, à l'encre pâlie ; en bas, l'Air, l'Eau, le Feu, la Terre ; au milieu, le chaudron (l'Athanor) | *[aide : glisse l'Air deux fois dans le chaudron.]* **Air + Air = Vent** | *(tu lis)* « Mêle l'Air à l'Air, et nomme ce qui naît. » |
| 3d | La page Vent s'écrit toute seule, lettre après lettre | toucher | Brume, tout bas : « … Qu'est-ce que tu as écrit ? » |
| 3e | Sur la plage, un vent se lève pour de vrai et chasse la brume : la Grève, l'épave, le bois flotté, les rochers | toucher | « Ils faisaient ça, ceux d'avant. Ils écrivaient, et l'île répondait. » / « Tout ce que tu écriras reviendra. Les arbres, les bêtes… tout ce que la brume a pris. » |

**Ce que ça apprend** : le but du craft (mélanger pour découvrir ; ce qu'on écrit revient sur l'île) et le geste. Les énigmes et l'Encre viennent à la première page qui en a besoin (étape 11).

#### Étape 4 — Ne mourir ni de faim ni de froid

**L'enjeu** : le froid, la faim. **Le basculement** : la mer donne, à qui ramasse vite.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 4a | L'avatar grelotte ; son ventre gargouille. Brume sursaute | toucher | Brume : « Qu'est-ce que c'était ? » / *(pensée)* « Mon ventre. Rien depuis le dîner du bord. » |
| 4b | Brume éclaire la plage : du bois flotté, des coquillages, des galets | *[aide : touche ce que tu veux ramasser.]* ramasser | « Le bois, là. Ça brûle, le bois. Je m'en souviens. » / « Et ça, dans les coquilles… vous mangez ça, non ? » |
| 4c | Le sac apparaît en haut de l'écran et se remplit | *[aide : ce que tu ramasses va dans ton sac. Ça repousse avec le temps.]* toucher le sac | — |
| 4d | La marée monte d'un coup et dépose une foule d'objets | *[aide : relie au moins trois objets pareils avant que la marée reparte.]* lancer la Récolte | « Oh ! La mer vide ses poches. Vite, avant qu'elle les reprenne ! » |
| 4e | La Récolte guidée (plateau généreux) | relier au moins 3 objets pareils | Après une longue chaîne : « Tu as vu ce qu'elle t'a donné ? Elle ne fait pas ça pour tout le monde. » |
| 4f | L'avatar avale quelques coquillages crus | toucher | *(pensée)* « Ça va mieux. Mais je ne sens plus mes doigts. » |

**Ce que ça apprend** : ramasser sur l'île (et que ça repousse), le sac, la Récolte et ses longues chaînes.

#### Étape 5 — Le premier craft : le feu

**L'enjeu** : avoir chaud. **Le basculement** : un feu, ça se voit de loin.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 5a | Brume tourne autour du bois et des galets du sac | *[aide : ouvre « Fabriquer ».]* | « Ceux d'avant faisaient un cercle de pierres, et le bois au milieu. » / « Moi, je n'ai jamais pu. Je ne brûle rien. » |
| 5b | Le feu de camp : du bois flotté et des galets, cochés | *[aide : tout se fabrique avec ce que tu as ramassé.]* fabriquer | — |
| 5c | Des cases dorées à l'abri de l'épave | *[aide : pose-le sur une case dorée : c'est là qu'il sert le plus.]* poser le feu | « Là. L'épave arrêtera le vent. » |
| 5d | Scène : Brume souffle, le feu prend, la brume recule d'un cercle ; l'avatar tend les mains vers les flammes | toucher | *(pensée)* « Enfin. » / Brume, les yeux dans les flammes : « On le verra de loin, ton feu. » |

**Ce que ça apprend** : fabriquer, poser, et que l'endroit compte (les cases dorées). Ce feu est le Foyer au palier I : c'est lui qui attire les autres.

#### Étape 6 — L'heure, l'interface et les écus

**L'enjeu** : tenir jusqu'au matin. **Le basculement** : la brume a des habitants.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 6a | L'horloge apparaît ; le ciel de l'île est celui de la nuit | *[aide : l'heure de l'île est la tienne. Elle vit même quand tu n'es pas là : ce qu'on ramasse repousse, le feu brûle.]* toucher l'horloge | « Le matin viendra. Il vient toujours. Je les ai comptés. » / « Trois cent mille, à peu près. » |
| 6b | Brume brille, une coche au-dessus d'elle | *[aide : quand Brume brille, une tâche est faite : touche-la.]* toucher Brume | « Tu as fait du feu. Ça mérite quelque chose. » |
| 6c | Des écus tombent dans le compteur | *[aide : les écus récompensent les tâches. Ils libèrent des morceaux de l'île, font grandir les bâtiments, remplissent la boutique.]* toucher le compteur | « Ceux d'avant les appelaient des écus. Je les gardais. Pour qui, je ne savais pas. » / « Pour toi, on dirait. » |
| 6d | Appui long sur Brume : sa fiche de tâche | *[aide : toucher, c'est agir. Garder le doigt appuyé, c'est en savoir plus.]* appui long | — |
| 6e | Les boutons du bas s'allument un à un : le Grimoire, le sac, les tâches, le menu (l'avatar, les réglages) | *[aide : une ligne par bouton.]* toucher chacun | — |
| 6f | La page de garde du Grimoire, le nom déjà écrit, une plume | signer, puis e-mail et mot de passe (le compte) | « Signe. Le livre se souviendra de toi, même si tu pars. » / « … Tu ne pars pas, hein ? » |
| 6g | Un petit fantôme sort de la brume, glisse vers le camp, s'arrête au bord de la lueur du feu, fronce les sourcils et repart en boudant | regarder | *(pensée)* « C'était quoi, ça ? » / Brume : « Un égaré. La brume en garde beaucoup. Ils ont peur de la lumière : reste près du feu. » |
| 6h | Scène : la nuit autour du feu ; au loin, sur les rochers, une silhouette regarde la lueur. Fin de la partie 1 | toucher, ou reprendre plus tard | Brume, tout bas : « Tu as vu ? Là-bas, sur les rochers. Quelqu'un. » |

**Ce que ça apprend** : l'heure et l'île qui vit sans lui, les tâches de Brume, les écus (les gagner, les dépenser), toucher et appui long, l'interface, le compte, et que la nuit amène des créatures que la lumière tient à distance (§ 6.15). **Le non-dit** : Brume compte les matins ; elle a peur qu'on parte.

### Partie 2 — « La troupe »

#### Étape 7 — Cannelle a vu le feu : les camarades

**L'enjeu** : quelqu'un d'autre a survécu. **Le basculement** : les autres ont besoin de toi autant que toi d'eux.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 7a | L'aube ; Cannelle (naufragée, une couverture de pont sur les épaules, sa louche serrée contre elle) sort de la brume | « Bien sûr ! » ou « Viens te réchauffer » | « Un feu ! J'ai cru que je rêvais. Toute la nuit, je l'ai regardé depuis les rochers. » / « Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine. » |
| 7b | Elle tend les mains vers le feu ; un éclat doré : son souvenir revient, et sa tenue de cuisinière | toucher | « Les marmites, la cuisine du bord… Cannelle ! Je m'appelle Cannelle. Cuisinière, et pas des pires. » |
| 7c | Elle aperçoit Brume, brandit sa louche… puis la baisse | toucher | « Un feu follet ! … Oh. Il a des yeux de chiot, celui-là. » / Brume : « Elle. » |
| 7d | Sur l'île, elle s'installe au feu ; une bulle « manger » au-dessus d'elle | *[aide : garde le doigt sur un camarade pour lire sa fiche.]* appui long sur Cannelle | — |
| 7e | Sa fiche : son métier, son humeur, ses besoins, ses goûts, ce qu'elle produit | *[aide : la fiche dit ce qui lui manque, ce qu'elle aime et ce qu'elle fait pour le camp.]* lui donner de la nourriture | « Des coquillages ? Crus ? Ma brindille, on n'est pas des sauvages. » / « Donne. Je vais t'en faire une soupe. » |
| 7f | Son humeur remonte ; le Foyer produit : une bulle de soupe | *[aide : un camarade content travaille mieux. Ramasse ce qu'il produit.]* ramasser la soupe | « Une cuillère pour le corps, une pour l'âme. » *(Elle goûte, hésite, et ne dit rien du goût.)* |
| 7g | Un toucher sur elle : elle bavarde, un cœur se remplit | *[aide : bavarde chaque jour avec tes camarades, offre-leur ce qu'ils aiment : ils te raconteront leur histoire.]* toucher, puis lui offrir un coquillage | « Un coquillage nacré… pour moi ? Toi, tu sais parler aux cuisinières. » |
| 7h | Elle regarde le Grimoire, ouvert sur les genoux de l'avatar | toucher | « Un livre de recettes ? … Non ? Dommage. Un jour, je t'apprendrai les miennes. » |
| 7i | Elle se tourne vers la mer ; son sourire tombe | toucher | « Mon Ondin… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… » / « Il sait nager. Il sait nager, hein ? » |

**Ce que ça apprend** : accueillir un camarade, sa fiche (et pourquoi la lire), ses besoins et son humeur (±10 %), la production à ramasser, l'amitié et les cadeaux. Chaque camarade connaît aussi des secrets du Grimoire (les Savoirs) : Cannelle les promet, son chapitre n'est pas encore ouvert. **Le non-dit** : elle a perdu le goût (acte V). L'image 7i mène à l'étape 11.

#### Étape 8 — Les bêtes

**L'enjeu** : nourrir un camp qui grandit. **Le basculement** : la mer n'a pas tout pris.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 8a | Des caquets sous les rochers : la cage aux poules de la cuisine du navire, coincée | *[aide : touche la cage pour l'ouvrir.]* | Cannelle : « Mes filles ! Elles ont tenu le coup, mes filles ! » |
| 8b | Trois poules sortent, ébouriffées, et picorent le sable | toucher une poule | Cannelle : « Brioche, Paprika et Madame. » / « Madame ne pond pas. Elle juge. » |
| 8c | Appui long : la fiche de la poule (ce qu'elle aime, son humeur, ce qu'elle donne) | *[aide : les bêtes aussi ont une fiche.]* lire | — |
| 8d | Nourries, elles pondent | *[aide : nourris-les, puis ramasse ce qu'elles donnent.]* nourrir, ramasser l'œuf | Cannelle : « Avec un œuf, je fais une omelette. Avec deux, un miracle. » |
| 8e | Le Carnet s'ouvre sur le Bestiaire | *[aide : chaque bête rencontrée s'inscrit au Bestiaire ; une bête écrite dans le Grimoire revient sur l'île.]* toucher le Carnet | Brume : « Avant, il y avait des oiseaux partout. Des chèvres sur la colline. » / « Elles reviendront, si tu les écris. » |
| 8f | Une mouette sur l'épave, un crabe entre les galets | les toucher (ils réagissent) | — |

**Ce que ça apprend** : toucher une bête, sa fiche, la nourrir, ramasser ce qu'elle donne (§ 6.16), le Bestiaire.

#### Étape 9 — Les créations

**L'enjeu** : le vent veut éteindre le feu, et la nuit reviendra. **Le basculement** : l'homme qui répare tout n'ose plus rien construire de grand.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 9a | Le matin ; une rafale couche les flammes | toucher | Cannelle : « Pas mon feu ! Pas ma soupe ! » / Brume : « Et cette nuit, sans lumière, les égarés reviendront. » |
| 9b | Sous une voile tendue sur un aviron, Rivet (naufragé) trie ses vis par taille, sur une valise ouverte | toucher Rivet | « Des poules. J'entends des poules. Sur une île déserte. » / « Soit j'ai pris un coup sur la tête, soit… Non. J'ai pris un coup sur la tête. » |
| 9c | Il voit le feu, les poules, les gens ; il se lève | « Bienvenue ! » | « Rivet. Horloger. Je répare ce qui se répare. » / « Ton feu tousse. Le vent entre par là, et par là. Tic, tac : je m'en occupe. » |
| 9d | Il monte un établi avec une porte de cabine et deux caisses ; Tic-Tac, son abeille mécanique, bourdonne, puis s'arrête net | ouvrir l'établi | « Un établi, et tout devient possible. Attends… Non. Si ! » / « Commençons petit : une clôture. Le petit, je sais encore faire. » |
| 9e | Le puzzle de la Clôture | *[aide : tourne et assemble les pièces.]* assembler | À la dernière pièce : « Clic. Tu entends ? Le plus joli bruit du monde. » |
| 9f | Des cases dorées côté brume, là où passaient le vent et le petit fantôme | *[aide : pose la Clôture sur une case dorée.]* poser la Clôture | Rivet : « Là. Elle coupe le vent… » / Brume : « … et la route aux égarés. » |
| 9g | La fiche de la Clôture : abri du vent, barrière | *[aide : chaque création a un effet : protéger, défendre, rendre heureux, faire produire plus.]* lire | — |

**Ce que ça apprend** : l'établi, le puzzle, la pose et les cases dorées, l'effet d'une création, et qu'une création peut défendre. Rivet reste naufragé : son souvenir, le Four, revient à l'acte III. **Le non-dit** : « Le petit, je sais encore faire » annonce son secret (l'incendie de son atelier).

### Partie 3 — « L'île »

#### Étape 10 — Les morceaux de l'île

**L'enjeu** : l'eau douce. **Le basculement** : celle qui sait lire la mer n'ose plus y retourner.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 10a | Midi ; tout le monde a soif ; Cannelle secoue une gourde vide | toucher | Cannelle : « L'eau de mer, pour la soupe, passe encore. Pour boire… » / Rivet : « Dessaler, je sais faire. En trois semaines. » |
| 10b | Dans les vagues jusqu'à la taille, Aster (naufragée) tire une caisse au bout d'une corde | toucher Aster | « Ho, du camp ! Vous étiez sur l'Hirondelle ? Alors souquez, elle pèse un âne mort ! » |
| 10c | La caisse sur le sable ; Aster s'essuie le front | *[aide : ouvre la caisse.]* ouvrir la caisse (premier coffre, commun) | « Aster, navigatrice. Officier de quart, pour être exacte. » / « La mer rend toujours quelque chose. Cette fois, c'est pour toi. » |
| 10d | Sur la dune, elle déplie sa longue-vue | toucher | « De l'eau douce ? Attends… Cap au nord-ouest : ça brille, dans la brume. » / « Et ça ronfle. Une source qui ronfle, c'est nouveau. » |
| 10e | La carte : la Grève libérée, les morceaux proches dans la brume (dont La Source), les terres inconnues, des îlots au large | *[aide : l'île est faite de morceaux. Ceux qu'on devine dans la brume se libèrent avec des écus.]* toucher La Source | « Une île en morceaux. On prend le plus proche. » |
| 10f | La fiche de La Source : son prix | *[aide : tes écus des tâches suffisent.]* acheter La Source | — |
| 10g | Les terres inconnues, plus loin | *[aide : ce qu'on ne voit pas s'explore : une expédition part, puis revient raconter.]* lancer une première expédition, vers la forêt | « Là-bas, on ne voit rien. Alors on envoie quelqu'un voir. » |
| 10h | Les îlots au large ; Aster baisse sa longue-vue | toucher | « Et là-bas, au large… Il faudrait un bateau. » / « Et quelqu'un pour le mener. Pas moi. Plus moi. » |

**Ce que ça apprend** : les coffres, la carte, les morceaux de l'île (libérer avec des écus, explorer avec une expédition, les îlots pour plus tard), la première vraie dépense. L'expédition revient après le tutoriel : elle dévoile une terre voisine et rapporte une lueur aperçue dans les arbres de La Lisière ; l'acte I commence (Sylve). Aster reste naufragée : son souvenir, le Bateau, revient à l'acte IV. **Le non-dit** : « Pas moi. Plus moi. » Elle tenait la barre la nuit du naufrage.

#### Étape 11 — Les bâtiments

**L'enjeu** : l'eau, et l'enfant que Cannelle cherche. **Le basculement** : le petit sourcier ne sent plus l'eau ; le Grimoire s'en souvient pour lui.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 11a | À La Source, tout juste libérée : un enfant endormi contre un rocher, des « z », un bocal vide | toucher le dormeur | Brume : « Chut. Celui-là, la brume l'a bercé longtemps. » |
| 11b | Ondin s'étire, les yeux lourds | toucher | « J'ai dormi combien de temps ? L'eau a un goût de nuage. » |
| 11c | Cannelle arrive en courant, les bras grands ouverts | toucher | Cannelle : « Mon caneton ! » / Ondin, écrasé dans ses bras : « Tatie… tu m'étouffes un peu. » |
| 11d | Sa baguette fourchue pend, inerte | toucher | « Avant, ma baguette tirait vers l'eau. Là, plus rien. » / « Comme si quelqu'un avait éteint la lumière, dedans. » |
| 11e | Dans le Grimoire, un ruban : « Vers : Puits — 3 pages » ; la page Boue et son énigme | *[aide : suis le ruban : il mène, page après page, à ce qui manque. Chaque page cache une énigme ; l'Encre aide quand on bloque.]* **Eau + Terre = Boue** ; **Boue + Feu = Brique** ; **Brique + Eau = Puits** | Brume : « La mer lui a pris son savoir. Le livre, lui, s'en souvient. » |
| 11f | À la Brique, le sceau de Saturne se brise : le chapitre II s'ouvre | toucher | Brume : « Un sceau… Celui-là attend son gardien. Quelqu'un, quelque part. » |
| 11g | Un éclat doré : Ondin se souvient, sa tenue revient ; sa baguette plonge vers le sol | toucher | « Elle tire ! Elle tire ! L'eau est là-dessous, elle chante ! » |
| 11h | Le plan du Puits, son prix en pierre | *[aide : chaque camarade a son bâtiment.]* bâtir le Puits | — |
| 11i | Le Puits sort de terre ; une bulle d'eau au-dessus | *[aide : un bâtiment produit tout seul. Reviens ramasser ce qu'il a fait.]* ramasser l'eau ; ouvrir le coffre rare | Ondin : « Chut… elle arrive. » / Cannelle boit, ferme les yeux : « Ça, mon caneton, c'est de l'eau. » |

**Ce que ça apprend** : réveiller un dormeur, le souvenir et le fil d'Ariane, l'énigme et l'Encre, bâtir un bâtiment, ramasser sa production. Le sceau de Saturne brisé annonce Galet (acte II).

#### Étape 12 — Les évolutions, la nuit de garde, le Campement

**L'enjeu** : la première vraie nuit, à cinq. **Le basculement** : on ne gagne pas tout, mais rien n'est perdu.

| # | Ce qu'on voit | Ce que fait le joueur | Répliques |
|---|---|---|---|
| 12a | Le soir ; cinq gobelets pour un seul seau | toucher | Ondin : « Mon puits pourrait donner plus. Il me l'a dit. » / Rivet : « Les puits ne parlent pas. … Enfin. Celui-là, peut-être. » |
| 12b | La fiche du Puits, onglet « Évolution » : le palier II, son prix en pierre et en écus | *[aide : les bâtiments grandissent par paliers ; à chaque palier, ils produisent plus.]* faire évoluer le Puits (offert : sans chapitre) | — |
| 12c | Le chantier, puis le Puits agrandi (margelle, poulie, deux seaux) | toucher | Ondin : « Chut… il y en aura pour tout le monde. » |
| 12d | Un nouvel onglet s'allume dans sa fiche : « Annexes » | *[aide : un bâtiment qui a grandi peut s'étendre. Ses annexes produisent le plus, et c'est toi qui les poses.]* regarder (ou poser une première annexe) | — |
| 12e | La boutique s'ouvre : objets et décorations à acheter avec des écus | *[aide : la boutique vend de quoi embellir et défendre l'île.]* acheter une torche | Aster : « Une torche ? Bien vu. Un camp éclairé, ça se voit du large. » / « Et ça se défend. » |
| 12f | La nuit tombe ; des pointillés montrent par où les égarés viendront, de la brume vers le Puits ; des cases dorées où défendre | *[aide : pose tes lumières et tes clôtures sur leur chemin.]* poser la torche et une deuxième clôture | Brume : « Ils viendront de là. Ils ne sont pas méchants, tu sais. Juste perdus. » / « Mais ils embrument tout ce qu'ils touchent. » |
| 12g | Petits fantômes et petits zombies tout mous sortent de la brume ; la torche en change un en luciole ; la clôture arrête les autres | regarder | Rivet : « Clic ! Elle tient ! » |
| 12h | Un petit zombie contourne la clôture et trottine vers le Puits ; Cannelle en chasse un autre à coups de louche | *[aide : touche une créature pour la repousser.]* toucher le petit zombie | Cannelle : « Ouste ! Et dis à tes cousins que la soupe, c'est demain ! » |
| 12i | Pendant ce temps, un petit fantôme passe par le côté sans défense et se pose sur le Puits : une brume grise le couvre, l'eau s'arrête | regarder | Ondin : « Il s'est tu. Mon puits s'est tu. » |
| 12j | La fiche du Puits propose « Réparer » (un peu de pierre) | *[aide : un bâtiment embrumé ne produit plus jusqu'à sa réparation. Rien n'est perdu.]* réparer : la brume se dissipe, l'eau revient | Rivet : « Tout se répare. Presque tout. » / Brume : « La prochaine fois, une lumière de ce côté-là. » |
| 12k | Scène : la nuit, autour du feu, cinq visages et Brume : l'avatar (dans ses habits recousus), Cannelle, Rivet, Aster, Ondin ; les poules endormies, la torche, des lucioles au bord de la brume | toucher | Brume : « Un, deux, trois, quatre, cinq… » / « Je n'avais jamais compté plus loin qu'un. » |
| 12l | La même scène ; Cannelle tend à l'avatar ses habits recousus | toucher : étape « Le Campement », fin du tutoriel | Cannelle : « Tiens. On ne reconstruit pas une île en guenilles. » / Brume : « Le feu, l'eau, des lumières pour veiller… Il manque un toit. Demain, on reconstruit l'île. » |

**Ce que ça apprend** : les évolutions (le palier II du Puits, offert par le tutoriel ; celui du Foyer, l'Abri, reste le sommet de l'acte II), le chantier, les annexes, la boutique, la défense (poser, toucher, les camarades qui aident) et la réparation (§ 6.15). La première lanterne reste le grand moment de l'acte I : ici, c'est une torche. **Le non-dit** : « Presque tout » ; « jamais plus loin qu'un ».

### Les quêtes du tutoriel

Elles remplacent T1 à T8 de la v5. Les récompenses sont une proposition, à équilibrer : les sept premières rapportent 110 écus, de quoi libérer La Source (100).

| # | Quête | Objectif | Récompense |
|---|---|---|---|
| T1 | Écris ta première page | `element` Vent | 10 écus |
| T2 | Ramasse ce que la mer a rendu | ramasser 3 fois sur l'île (nouveau) | 10 |
| T3 | Termine une Récolte | `runs` 1 | 15 |
| T4 | Allume un feu | le feu de camp (Foyer I) | 20 |
| T5 | Une soupe pour Cannelle | `need` (« manger » du Foyer) | 20 |
| T6 | Nourris les poules | une bête nourrie, un œuf ramassé (nouveau, § 6.16) | 15 |
| T7 | Pose ta première création | `craft` Clôture | 20 |
| T8 | Libère La Source | `zone` (100 écus) | 30 |
| T9 | Lance une expédition | `expedition` partie, pas encore revenue (nouveau sens ; à vérifier : une terre voisine doit être à portée) | 10 |
| T10 | Réveille Ondin | `wake` puits | 10 |
| T11 | Rends son souvenir à Ondin | `element` Puits | 20 |
| T12 | Construis le Puits | `level` puits 1 | 40 — coffre rare |
| T13 | Fais grandir le Puits | `level` puits 2 (offert, sans chapitre) | 30 |
| T14 | Passe ta première nuit de garde | défenses posées, une créature repoussée, une réparation (nouveau, § 6.15) | 30 |

La caisse d'Aster (étape 10) est un coffre commun offert par la scène, hors quête.

---

## 10. Les sept actes

**Pour chaque acte** : le manque, qui arrive, les recettes du récit, les quêtes (objectif et récompense proposée), la veillée, l'étape, Brume, le mot d'Héliane et le Bestiaire.

**Les récompenses** sont une proposition : elles suivent la progression actuelle, de 20 à 500 écus, et sont à équilibrer.

### Acte I — « Les Premiers Souffles » · ☿ · construire
- **Le manque** : **le bois** (le feu, l'établi, bientôt un toit).
- **La découverte** (v6 : pas de naufrage) : l'expédition du tutoriel rapporte une lueur dans les arbres de La Lisière. Une fois le quartier libéré, la queue rousse de Mousse guide le joueur jusqu'à **Sylve**, cachée là depuis des années.
- **Recettes du récit** :
  - **Vie** (Air + Eau + Feu + Terre), la grande scène ; puis Plante et **Arbre** (le souvenir de Sylve) ;
  - **Lumière** (Feu + Éclair) pour la première **Lanterne** (création Lanterne = Feu + Lumière).
- **Quêtes** :
  1. acheter La Lisière (`zone`, 50) ;
  2. apprivoiser Sylve (`wake` : le premier bavardage, 10) ;
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
  - Brume compte les lumières : « Une. Hier, il n'y en avait aucune. » / « Allumons-les toutes. Que la mer sache qu'on est là. »
  - Étape : **Le Camp des naufragés**.
- **Brume** : stade 1 (pâle, ravie).
- **Mot d'Héliane** : « Si tu lis ceci, l'île a fait son choix. Allume les lumières : toutes. — H. »
- **Bestiaire** : Poisson (Eau + Vie) devient possible ; s'il est écrit, **Bulle revient** dans le bocal d'Ondin.

### Acte II — « La Matière » · ♄ · s'abriter
- **Le manque** : **la pierre**. L'orage approche, et l'Abri (Foyer II) demande 20 bois et 10 pierre.
- **La découverte** (v6 : pas de naufrage) : le sceau de Saturne attend son gardien depuis le tutoriel. Un soir, on entend un ciseau sur la pierre, du côté de La Colline : **Galet** vit là depuis des années, assis dans la fissure, son maillet à la main.
- **Recettes du récit** :
  - **Pierre** (Air + Lave), le souvenir de Galet ;
  - **Bois** (Arbre + Métal ; Métal = Feu + Pierre), le plan de l'Abri et le lien de Sylve et Galet.
- **Quêtes** :
  1. acheter La Colline (`zone`, 80) ;
  2. apprivoiser Galet (`wake` : le premier bavardage, 10) ;
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
  - **Étoile** (Feu + Lumière + Énergie) : Aster peut guider les **expéditions** par les étoiles ;
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
  - Mélisse : « Deux naufrages en une saison, et d'autres naufragés, là depuis des années… Il y a quelque chose, avec cette île. » Brume baisse les yeux.
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
  - **le secret de Brume** : Galet déchiffre la dernière rune des Anciens ; Brume comprend que son chagrin fait la brume de la mer : « … parce que l'île est seule. Parce qu'Elle dort. » C'est le **quatrième pressentiment d'Anya**. Si Anya est déjà éveillée (v6 : la Révélation peut venir dès l'acte V), Brume dit : « … parce que l'île a dormi si longtemps. Et moi, j'ai pleuré pour deux. » Brume pâlit, mais **les quêtes continuent**.
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

- **La Révélation d'Anya** (§ 6.14) arrive quand le cœur de l'île est libéré : au plus tôt vers l'acte V, souvent avant le Phare (v6). C'est le grand moment de ceux qui libèrent l'île ; sa dernière réplique suit le Phare.
  - La troupe au complet est au Cercle, les sept sceaux s'allument, Anya se lève.
  - La gemme du Grimoire s'allume.
  - Ensuite, Anya erre : on la croise rarement ; viennent la Bénédiction, le Souffle, les soins et ses créatures.

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
| Tutoriel, partie 1 « Seul » (étapes 0 à 6) | le froid, la faim | Brume | Vent | avatar, Grimoire, ramasser, Récolte, feu, heure, écus, interface, compte | — | noir | — |
| Partie 2 « La troupe » (7 à 9) | la solitude, le vent | Cannelle, Rivet | — | camarades, bêtes, établi, puzzle, pose, défense | — | | — |
| Partie 3 « L'île » (10 à 12) | l'eau, la nuit | Aster, Ondin | Boue, Brique, **Puits** | coffres, carte, morceaux de l'île, expédition, souvenir, fil d'Ariane, énigme, bâtir, évolutions, boutique, nuit de garde | Le Campement | | rare |
| I | le bois | Sylve | **Vie**, Arbre, **Lumière** | annexes, palier I, lanternes, Savoirs | Le Camp | noir | rare |
| II | la pierre | Galet | Pierre, **Bois** | « près de », Épreuve | Le Hameau | noir | rare |
| III | la nourriture | Mélisse (+ forge de Rivet) | Four, **Étoile**, **Village** | expédition, ruines, Chronique, outils, mini-jeux | Le Village | blanc | épique |
| IV | la mer | bêtes, voyageurs | **Bateau**, une bête | Bestiaire, visiteurs, cœurs, gisements | Le Bourg | blanc | épique |
| V | la place | voyageurs installés | **Potion** | maisons, enseignes, nom | Le peuple | jaune | légendaire |
| VI | la mémoire | — | **Écriture**, **Civilisation**, **Phénix** | grandes annexes, clé du phare | La Civilisation | jaune | légendaire |
| VII | la lumière | le Passeur | **Feu follet** | finale | La Légende | rouge | épilogue |
| **Révélation** (le cœur de l'île libéré ; au plus tôt vers l'acte V) | — | **Anya** | (Vie, écrite à l'acte I, l'avait appelée) | errance, soins, Bénédiction, Souffle d'Anya, créatures d'Anya | le peuple sous le regard d'Anya | or (la gemme) | — |

**Rythme visé** (à vérifier ; **aucune mesure réelle n'existe**) :

| Étape | Moment visé |
|---|---|
| Tutoriel | 35 à 45 min, en trois parties |
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
  | 0 | rencontre et tout le tutoriel | pâle et tremblante |
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
- **Partage de la parole** : dès l'étape 7, chaque personnage présente sa mécanique. Brume garde le Grimoire, le fil d'Ariane, les quêtes et les naufrages.
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
- **L'avatar** (v6, § 6.17) : un kit de pièces au trait de la troupe (silhouettes, peaux, yeux, sourcils, taches de rousseur, coupes, couleurs, hauts, bas, accessoires) ; trois vues, toutes les poses, au grand et au petit format ; et sa version naufragée.
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
- **Anya** : la seule figure « majestueuse » du jeu. Il faut aussi ses signes (bêtes tournées, fleurs qui s'ouvrent, lucioles rassemblées) et son passage parmi les égarés qui fuient.
  - Deux fois la taille d'un naufragé, animation lente (elle respire, son manteau ondule), lueur dorée, lucioles.
  - Son apparition ralentit tout (et baisse la musique, si le son arrive un jour). Palette or et vert.
  - Il lui faut son propre dessin, hors du générateur de personnages, ainsi que celui du cerf blanc et du Cercle fleuri.
- **Les rencontres** : un plan d'entrée par personnage (Cannelle qui sort de la brume, une couverture sur les épaules ; Rivet sous sa voile ; Aster dans les vagues, une caisse au bout d'une corde ; Ondin qui ronfle), puis une **carte** : prénom, rôle, sceau, Souffle, ce qu'il aime.
- **Les naufrages** : une image de nuit d'une seconde (une épave au loin, la brume), puis le dormeur dans le quartier. Sylve et Galet, anciens naufragés, n'en ont pas : on les découvre (§ 6.7).
- ***L'Hirondelle*** : un petit navire de croisière.
- **Les créatures de la brume** (v6, § 6.15) : petites, rondes, choupies, grognonnes plus que méchantes ; petits fantômes, petits zombies tout mous, bêtes égarées selon le climat du morceau d'île ; leur marche, leur bouderie quand on les touche, et leur passage en lucioles.
- **Les défenses** : torches, lanternes, clôtures ; plus tard, les bâtiments de défense. **Le bâtiment embrumé** : une brume grise posée dessus, sa production arrêtée, « Réparer » dans sa fiche.
- **Les veillées** : le feu au centre, la troupe en cercle avec l'avatar (vues de profil et de trois quarts), Brume au-dessus ; le rite dessine la recette en lumière au-dessus des flammes.
- **Le souvenir retrouvé** : un éclat doré du Grimoire vers le naufragé ; son sceau s'allume ; il se lève, outil en main.
- **La scène de la Vie** : les quatre Souffles en traînées de couleur (bleu, rouge, ocre, blanc) qui se rejoignent dans l'Athanor.
- **Main qui montre** : seulement pendant le tutoriel.

---

## 15. Impacts techniques (fichiers, règles, invariants)

**Principe** : tout est déduit de l'état existant (quêtes réclamées, quartiers, bâtiments, amitié, éléments possédés).
- Aucune migration de base.
- Une seule donnée nouvelle : la cible `peuple` dans la table de noms existante.
- **La v6 change ce principe** : l'avatar, les nuits de créatures et les pannes, la production des bêtes, le feu bâti par le joueur et le soin d'Anya en cours demanderont sans doute des données nouvelles. À chiffrer, et à faire valider par l'auteur avant le lot H9 (garde-fou 1).

| Élément | Serveur | Front | Invariant et tests |
|---|---|---|---|
| **Nouvelle troupe** | `villagers.js` : prénoms, rôles, cadeaux (§ 8.1) ; `test/play.test.js` : prénoms attendus | `friends.js` (passé par cœurs, grammaire de Sylve qui revient) ; `village.js` (répliques de travail) ; `villagers.js` (looks, pose endormi) | les identifiants ne changent pas ; aucune donnée en base ne porte de prénom (vérifié : `world_friends.villager` est l'identifiant du bâtiment) |
| **Présence dès la rencontre** (§ 6.6) | `world.js` (`livesHere`, vue des habitants) et `villagers.js` (besoins « créations » et « outils ») | personnages au camp, dormeurs | **les joueurs actuels gardent tous leurs habitants** ; tests sur la production et l'humeur sans bâtiment |
| **Objectifs de quête nouveaux** | `quests.js` : `element`, `need`, `wake`, `craft` (création précise), `annex`, `expedition`, `landmark`, `gather`, `visitor`, `heart`, `house`, `settle`, `name` ; faits dans `world.js`, lus dans des tables existantes (vérifié : `world_visitors.satisfied_at` et `settled_at` existent pour `visitor` et `settle` ; `world_friends.points` pour `wake` et `heart`) | actions de la fiche de quête | **une quête placée avant la plus avancée déjà réclamée compte comme faite** ; le tutoriel paie 100 écus avant La Source |
| **Fil d'Ariane** (§ 6.1) | `bookPages.js` : cible, chemin le plus court, page marquée ; s'appuie sur les recettes déjà chargées par `recipeBook.js` | ruban, « Vers : X — n pages », « Voir dans le Grimoire » | la page marquée ne révèle rien de plus qu'une autre ; **temps de calcul à mesurer** (recherche sur 2 986 recettes) |
| **Savoirs** (§ 6.4) | route de bavardage : indice renvoyé seulement quand le bavardage compte (une fois par jour) | réplique d'indice ; indice gardé sur l'appareil | pas d'indice hors de l'Art du maître ; équilibrage face à l'Encre |
| **Bestiaire vivant** (§ 6.5) | aucun, sauf si la vue de l'île doit porter les éléments possédés (à vérifier) | `animals.js`, `village.js` : apparition selon les éléments | les bêtes de ferme gardent la règle du Potager |
| Chapitre II à 3, palier I de l'établi à 10 | `bookPages.js`, `crafts.js` et tests | textes | — |
| **Tutoriel** (v6, § 9) | quêtes T1 à T14 dans le nouvel ordre (`quests.js`) ; objectifs nouveaux : ramasser, nourrir une bête, nuit de garde ; le feu de camp bâti par le joueur ; le Puits II offert ; l'île ouverte au carnet invité jusqu'au compte (à vérifier) ; plateau de 1re Récolte généreux (`harvest.js`) | `prologue.js`, `prologueScenes.js`, `PrologueArt.vue` : scènes, déroulé, saut, reprise, trois parties ; l'interface qui s'ouvre étape par étape ; l'île qui suit le récit (l'heure) ; la réplique de Mélisse à la veillée III (`vigils.js`) | **joueurs actuels** : jamais le tutoriel, l'écran d'avatar à leur prochaine visite ; **invité** : bascule vers le compte à l'étape 6 ; une quête déjà réclamée ne revient pas |
| **Avatar** (§ 6.17) | gardé avec le compte (donnée nouvelle) ; demandé une fois aux joueurs qui ont déjà une île | écran d'avatar ; l'avatar sur l'île (il vient vers ce qu'on touche), dans les scènes et aux veillées ; tenue naufragée jusqu'au Campement | un joueur existant ne perd rien ; l'avatar ne change aucun gain |
| **Créatures et défense** (§ 6.15) | les nuits (quand, d'où, combien), les défenses posées, le toucher qui repousse, le bâtiment embrumé (production arrêtée), la réparation : tout se décide au serveur (données nouvelles) | chemins depuis la brume, créatures, lucioles, état embrumé, « Réparer » | rien n'est détruit, aucun progrès perdu ; pas de nuit de créatures avant l'étape 6 |
| **Bêtes de ferme** (§ 6.16) | nourrir, produire, ramasser (comme la production d'un bâtiment) | fiche de la bête, bulle de production | les bêtes déjà là ne changent pas ; la règle du Potager reste |
| **Veillées, étapes, Chronique** | aucun | scène scriptée, Carnet | la veillée passe dans la file de Brume, jamais par-dessus un coffre |
| **Nom du peuple** | route et service des noms : cible `peuple` | champ à la veillée V | même validation que les autres noms |
| Brume : stades, Phénix | aucun | `brume.js` | les quêtes ne sont jamais bloquées |
| Mots d'Héliane | `loot.js` : choix du mot selon l'acte | `chest.js` | — |
| Phare, épilogue | quête finale | cinématique | — |
| **Anya : condition et traces** (v6) | vue de l'île : `anya: { traces, awake }`, déduit des quartiers à soi (les 9 quartiers du cœur ; 8 traces dans l'ordre) | Chronique (Traces), images de trace, scène de la Révélation, gemme du Grimoire | condition testée sur la carte (9 quartiers) ; rien de stocké ; un joueur qui la remplit déjà voit la Révélation à sa prochaine visite |
| **Anya : Bénédiction** | chaîne des bonus (comme les lieux) ; `finds.readyIn` (repousse en paramètre) ; humeur plancher (`villagers.js`) | textes | tests : repousse en 4 h et humeur sans malus quand Anya est éveillée ; rien ne change sinon |
| **Anya : errance, Souffle, soins** (v6) | où et quand elle apparaît, tiré d'une graine (le jour, l'île) ; route de bavardage : cible `anya`, une fois par apparition (`world_friends`) ; le soin en cours (donnée nouvelle) | Anya qui erre, ses signes, les égarés qui fuient, le bâtiment qui guérit, le soin | un Souffle par apparition au plus ; un soin à la fois |
| **Anya : créatures, Cercle fleuri, dessin** | aucun | dessin d'Anya (hors générateur), créatures (dans le style des bêtes du lot 9e), lieu remarquable fleuri | — |

---

## 16. Plan de livraison en lots (avec critères d'acceptation)

| Lot | Contenu | Accepté quand… | Dépend de |
|---|---|---|---|
| **H0 — La troupe et les textes** | prénoms, rôles, cadeaux ; répliques de passé par cœurs ; Brume (*elle*, une présentation) ; les Anciens et Héliane ; « Grimoire » partout ; quêtes réécrites | tous les tests passent avec les nouveaux prénoms ; aucune réplique ne cite un ancien prénom ou « le dernier alchimiste » | — |
| **H1 — La colonne vertébrale** | présence dès la rencontre ; chaîne de quêtes T1 à VII (§ 9 et 10) et objectifs nouveaux ; invariant des joueurs en cours ; chapitre II à 3 ; palier I à 10 | un nouveau compte suit toute la chaîne ; un compte existant ne recule jamais ; tests de chaque objectif | H0 |
| **H2 — Le fil d'Ariane** | page marquée et chemin le plus court | Puits, Arbre, Bateau, Livre et Feu follet marquent la bonne étape suivante ; temps de calcul mesuré | H1 |
| **H3 — Dormeurs, naufrages, souvenirs** | pose endormi, réveil, annonce des naufrages, scène du souvenir retrouvé | Ondin, Sylve, Galet et Mélisse s'éveillent et se souviennent dans le bon ordre | H2 |
| **H4 — Le tutoriel** (livré en v5 ; refait par H9) | les 5 étapes de la v5 | un invité joue l'étape 1, crée son compte à l'étape 2, finit à l'étape 5 en 15 à 20 min ; passable et rejouable | H0 à H3 |
| **H5 — Veillées et civilisation** | veillées et rites, liens-recettes, étapes, Chronique, nom du peuple | 7 veillées jouables ; nom enregistré et affiché | H3 |
| **H6 — Savoirs et Bestiaire** | indices des maîtres ; bêtes qui naissent quand on les écrit ; familiers | un indice par jour et par maître ; Bulle revient quand on écrit Poisson | H1 ; suite des bêtes (`PASSATION.md` § 7, point 1) |
| **H7 — Le Grand Œuvre et la finale** | stades de Brume, palettes par acte, acte VI (pâlir, Phénix), Phare de Brume, épilogue, mots d'Héliane | la finale se joue de bout en bout ; Feu follet écrit tôt donne la réplique spéciale | H5, H6 |
| **H8 — Anya** | traces (4 pressentiments, 12 traces), Révélation, gemme du Grimoire, Bénédiction, Souffle, créatures, Cercle fleuri | un compte qui découvre toute l'île principale voit la Révélation une seule fois, avant ou après le Phare (deux répliques) ; la Bénédiction s'applique ; un Souffle par jour au plus | H5, H6 (créatures) ; H7 conseillé |
| **H9 — Tutoriel v6, avatar, créatures, bêtes, Anya** | l'avatar (§ 6.17) ; les 13 étapes et les quêtes T1 à T14 (§ 9) ; les créatures et la défense (§ 6.15) ; les bêtes de ferme (§ 6.16) ; Anya v6 : condition, traces, errance, soins (§ 6.14) ; les dessins de la bibliothèque (avatar, créatures, défenses, scènes) | un invité crée son avatar, joue la partie 1, crée son compte à l'étape 6 et finit au Campement en 35 à 45 min ; passable, rejouable, avec des pauses ; un joueur existant crée son avatar sans refaire le tutoriel et ne recule jamais ; une nuit de garde embrume un bâtiment sans défense, qui se répare ; une créature touchée recule ; Anya se révèle quand les 9 quartiers du cœur sont à soi, puis erre | H0 à H8 ; **données nouvelles probables : demander à l'auteur avant toute migration** (garde-fou 1) |

---

## 17. Décisions

### Prises (le 5 octobre 2026)
- **Tutoriel** : 5 étapes, un personnage chacune ; Brume, puis les fondateurs de l'Air, du Feu, de la Terre et de l'Eau (remplacé en v6).
- **Arrivées** : d'autres naufrages, sur besoin (complété en v6).
- **Se découvrir** : entre eux et eux-mêmes.
- **Brume solitaire** et le Phare ; **civilisation** avec étapes, veillées et nom.
- **Compte et public** : le compte au moment du nom (Aster, étape 2 ; déplacé en v6) ; tout public.
- **D1** *elle* ; **D4** chapitre II à 3 ; **D7** palier I à 10 ; **D8** « Grimoire » ; **D10** 8 stades ; ~~**D11** joueur jamais montré~~ (supprimée en v6) ; **D13** *l'Hirondelle* ; **D16** le frère d'Aster, plus tard.
- **Les noms et les personnalités sont à changer** : demande de l'auteur, appliquée dans cette version.

### Prises (le 6 octobre 2026, version 6)
- **Le joueur est visible** : un avatar choisi et personnalisé, partout (remplace D11).
- **Le tutoriel** : 13 étapes en 3 parties (« Seul », « La troupe », « L'île »), dans l'ordre voulu par l'auteur (§ 9).
- **D'où viennent les camarades** : un mélange (la même croisière ; d'anciens naufragés ; de nouveaux naufrages).
- **La faim et le froid** : narratifs seulement.
- **Les dix questions** :
  1. *l'Hirondelle* garde son nom : un petit navire de croisière ;
  2. l'ordre des camarades : Cannelle (le feu), Rivet (les poules), Aster (la soif), Ondin (La Source) ;
  3. la tenue du joueur : naufragée jusqu'au Campement, où Cannelle la recoud ;
  4. les joueurs qui ont déjà une île : l'écran d'avatar à leur prochaine visite, sans refaire le tutoriel ;
  5. l'heure : pendant le tutoriel, l'île suit le récit ; à la fin, elle rejoint l'heure réelle ;
  6. l'avatar sur l'île : il vit seul et vient vers ce qu'on touche ; aucun nouveau geste ;
  7. la durée : trois parties, avec une pause possible entre elles ; « Passer » reste proposé ;
  8. mini-jeux, visiteurs, îlots : présentés le jour où ils arrivent ;
  9. les bêtes de ferme : fiche, nourrir, produire, ramasser ;
  10. le premier palier : le tutoriel offre l'évolution du Puits, par exception ; la règle des chapitres ne change pas pour le reste.
- **Les créatures de la brume** : des créatures perdues et choupies ; des défenses posées, et le toucher : le joueur peut repousser une créature, les camarades aident (réponse corrigée par l'auteur) ; un bâtiment atteint est embrumé jusqu'à sa réparation ; la nuit, depuis la brume voisine ; réparti dans le tutoriel (étapes 6, 9 et 12).
- **Le compte** : à la fin de la partie 1 (étape 6).
- **Le premier palier offert** : celui du Puits (le Foyer II reste l'Abri, sommet de l'acte II).
- **Anya** : la déesse de l'île. Elle se révèle quand le cœur de l'île est libéré (les 9 quartiers) ; ensuite, elle erre, et on la croise rarement ; elle défend l'île (les égarés fuient, les bâtiments embrumés guérissent) et apprend à la respecter, à la comprendre, à la soigner (son Souffle et ses soins).
- **L'écriture** : les dialogues suivent la méthode du § 7.4 (les personnages ne lisent pas l'interface ; un enjeu par scène ; le non-dit).

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
| V9 | La condition de la Révélation d'Anya | **tranché en v6** : les 9 quartiers du cœur à soi (le « noyau principal »), sans les 12 terres |
| V10 | Brume est née de la dernière pensée d'Anya avant son sommeil | **oui** : ça prolonge « Brume solitaire » et donne une famille à Brume |
| V11 | La Bénédiction d'Anya : gisements en 4 h, humeur jamais triste | **oui**, à équilibrer |
| V12 | Le Souffle d'Anya | **tranché en v6** : un ingrédient par apparition ; elle erre, on la croise rarement (§ 6.14) |
| V13 | Les créatures d'Anya : les bêtes absentes du Grimoire (lapins, hérons, mouettes, loutres, koïs) | **oui** |

### À valider (version 6)

| # | Question | Ma recommandation |
|---|---|---|
| V14 | Les récompenses des quêtes T1 à T14 (§ 9) | à équilibrer ; les sept premières paient La Source |
| V15 | Rivet n'a pas de moment de souvenir avant l'acte III (le Four) | garder ainsi : d'ici là, il tient l'établi |
| V16 | Le phare éteint des Anciens (acte VI), à côté du Phare de Brume | à préciser avec l'auteur |
| V17 | Le look du Passeur | grand et silencieux (§ 8), à dessiner |
| V18 | Les bâtiments de défense : lesquels, quand, à quel prix | à concevoir avec l'auteur |
| V19 | Les nuits pendant l'absence du joueur | au plus une panne par nuit, et seulement d'un côté sans défense ; à équilibrer |
| V20 | L'île du tutoriel avant le compte (le joueur est encore invité aux étapes 4 et 5) | ouvrir l'île au carnet invité jusqu'à l'étape 6 ; à vérifier dans le code |
| V21 | Sylve et Galet, anciens naufragés : cachés plutôt qu'endormis | **oui** : « réveiller » devient « apprivoiser », avec le même objectif `wake` (premier bavardage) |
| V22 | La fréquence des apparitions d'Anya, et la récompense d'un soin | deux ou trois fois par semaine ; des écus et un endroit qui fleurit ; à équilibrer |

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
- C'est la bible de référence (**v6, 6 octobre 2026**, sur la base de la v5) pour tous les lots H0 à H9.
- Les décisions du § 17 sont prises.
- Les points **V1 à V22 sont retenus par défaut** : ce sont les recommandations (sauf V16 et V18, à préciser, et V20, à vérifier). L'auteur peut revenir sur chacun ; dans ce cas, **mettre la bible à jour avant de coder** (et le noter en tête du fichier).

**Ce que le jeu devient, en trois phrases.**
1. Des naufragés retrouvent la mémoire et réinventent une civilisation grâce au Grimoire, où chaque moment de l'histoire est une vraie recette.
2. Brume, le feu follet solitaire dont la brume brisait les bateaux, devient la flamme du Phare.
3. Anya, la déesse de l'île, se révèle à ceux qui en libèrent le cœur, puis erre et la garde.

**L'ordre de construction.**
- H0 → H1 → H2 → H3 → H4 → H5 → H6 → H7 → H8 (livrés), puis H9 (la v6) ; dépendances et critères d'acceptation au § 16.
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
- (v6) L'île peut-elle s'ouvrir au carnet invité pour les étapes 4 et 5 du tutoriel (§ 9, V20) ?
- (v6) Une expédition est-elle possible à l'étape 10 : une terre voisine de la Grève ou de La Source, et son prix (§ 9, T9) ?
- (v6) Quelles données nouvelles pour l'avatar, les nuits, les pannes, les bêtes et les soins d'Anya ? Faut-il une migration ? Demander à l'auteur avant de coder.
- L'équilibrage :
  - des Savoirs face à l'Encre (§ 6.4) ;
  - des récompenses (§ 9 et 10) ;
  - de la Bénédiction d'Anya (§ 6.14).

**Le premier pas : le lot H0 (la troupe et les textes).** Avant de coder, présenter à l'auteur :
- la liste des fichiers touchés ;
- les nouveaux prénoms, rôles et cadeaux (§ 8.1) ;
- les répliques de chaque personnage, pour qu'il les valide.

Ensuite, livrer H0 en une paire de PR (serveur, puis front).
