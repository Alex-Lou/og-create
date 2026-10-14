# Passation design — Brumelune

Pour l'agent design suivant. **À lire en entier avant la première ligne.** Ce fichier dit :
- ce que doit être le jeu (son essence) et le niveau de qualité que l'auteur accepte ;
- ce que l'auteur a refusé, et ses décisions déjà prises (ne pas les redemander) ;
- ce qui a été fait, pourquoi et comment ;
- ce qui reste à faire, et comment travailler ;
- le prompt à donner au prochain agent (§ 11).

Il complète deux documents de la racine :
- `PASSATION.md` : le projet, l'architecture, le serveur, la mise en route, les pièges ;
- `HISTOIRE.md` : la bible (histoire, personnages, game design).

État au 14 octobre 2026. Tout ce qui est décrit ici est fusionné sur `master` (PR #556 à #564, puis #566 à #594).

---

## 1. L'essence du jeu (ce qu'on doit ressentir)

**Brumelune — Les Naufragés de la Brume.**
- *L'Hirondelle*, un petit navire de croisière, se brise dans la brume. Tu te réveilles seul, la nuit, dans le froid, sur la plage de Brumelune.
- **Brume**, un feu follet curieux, devient ton amie et te confie le **Grimoire** : ce qu'on y écrit (des éléments mêlés dans l'Athanor) renaît sur l'île, et revient dans les mémoires.
- Un feu attire les autres naufragés, puis les **sept maîtres** : Aster, Cannelle, Rivet, Ondin, Sylve, Galet, Mélisse. Le camp devient village, puis peuple, puis civilisation.
- **Anya**, l'Âme de l'Île, se devine trace après trace avant de se lever.
- Le thème : *une civilisation, ce sont des gens qui se souviennent ensemble et qui s'entraident.*

Ce que le joueur doit sentir à chaque écran :
- **Doux, drôle, jamais punitif.** La peur dure cinq secondes. Les créatures de la brume restent choupies : ni sang, ni mort.
- **Chaleureux et vivant.** C'est une île qu'on fait renaître : lumière peinte, vent dans l'herbe, fumée, lucioles la nuit, la mer qui respire. Chaque geste du joueur a une réponse (un éclat, un son de matière, un rebond).
- **Gratifiant.** Bâtir, évoluer ou trouver est un *moment*. L'anticipation, l'impact, la récompense : jamais un simple changement d'image.
- **Lisible sur téléphone.** Le doigt ne doit jamais hésiter. Rien de ce qu'on doit toucher n'est caché par une bulle, une étiquette ou un autre niveau.
- **Artisanal, en bois, parchemin et or.** C'est la charte du HUD et des bulles : des objets fabriqués à la main sur l'île, pas des panneaux d'application.

Règles d'écriture (HISTOIRE.md § 7.4) :
- toujours « tu », 140 caractères au plus par bulle ;
- les personnages ne lisent jamais l'interface : le mode d'emploi passe par une main, un halo ou une ligne d'aide ;
- simple, jamais simpliste, sans ton de maîtresse d'école.
- **Ne jamais citer de jeu existant**, ni dans le code ni dans les textes.

## 2. Le niveau de qualité accepté

- **Chibi AAA, « choupi », jamais bébé.** Mignon mais ni enfantin ni niais : l'esprit d'un RPG d'artisanat riche et varié.
- **Jamais plat.**
  - Chaque matière porte un dégradé de lumière : clair en haut à gauche, ombre en bas à droite.
  - Des reflets, du volume, une ombre au sol.
  - Des contours teintés (une nuance plus sombre de la matière, ou l'encre `#3C2819` du trait de la troupe), pas noirs.
- **Animations fluides**, à la manière d'un studio :
  - anticipation, élan, dépassement, rebond (squash & stretch), retombée ;
  - des départs décalés d'un élément à l'autre ;
  - jamais de clignotement sec ni de flash brutal (un clignement d'yeux est une paupière qui descend ou un fondu bref).
- **Rien ne sort du cadre.** Le vérifier avec `verif_avatar.mjs` et `clipcheck`.
- **Pas de filtre SVG** (`feDropShadow`, flou) dans les dessins de la bibliothèque : le flou et les lueurs se font avec des dégradés radiaux.
- **Mobile d'abord** : téléphone en portrait (390 × 844), puis tablette (1024 × 768). Tout ce qui compte tient au centre.
- **Aucun coût répété, aucune fuite.**
  - Dans le canvas de l'île, tout se déduit du temps écoulé et d'une graine : rien n'est gardé d'une image à l'autre.
  - Les sprites et les bouffées sont cachés une fois (`utils/vfx.js` : `sprite()`).
  - Une mesure du DOM se fait au plus toutes les 500 ms (`hudObstacles`).
- **Mouvement réduit** : chaque effet a sa version immobile, ou rien.

## 3. Ce que l'auteur a refusé (à ne pas refaire)

- **Redessiner un personnage ou un dessin du jeu dans un autre style.** Un buste d'Anya refait « façon anime » a été jugé « dégueulasse ». On garde la forme, le visage et les couleurs ; on pousse seulement le rendu (lumière, contre-jour, modelé, reflets, animations).
- **Préférer des dessins improvisés à ceux du jeu.** Le jeu a de beaux dessins : on les prend et on les éclaire.
- **La barre d'onglets en bois** (lot HUD 1, #560). Il l'a fait retirer (#562) : « j'aime pas du tout ». La barre du bas reste la sienne :
  - cuir oxblood et piqûre dorée ;
  - icônes au trait ;
  - grand médaillon doré rond de l'onglet ouvert.

  Les pièces `barre_onglets`, `rail_onglets` et `medaillon_*` restent dans la bibliothèque, mais rien ne s'en sert. **Ne pas y revenir sans lui montrer d'abord 2 ou 3 pistes en maquette.**
- **Les ourlets et déchirures posés par-dessus l'habit** : « grossier, mal coupé, ça suit pas du tout la courbe, ça se superpose mal ». Une déchirure fait partie du contour du vêtement (`dechirure()`, § 6.3).
- **Les mâchoires d'homme larges et carrées** : « fais plus régulier ».
- **L'herbe trop plate et les fleurs en pixels tape-à-l'œil.** Il veut une lumière peinte et des fleurs rares, dessinées, en massifs.
- **La lune au-dessus de l'île.** Elle vient de l'océan, côté joueur (derrière l'écran), vers l'île et ses rivages.
- **Les manches coupées droit**, les vêtements mal alignés sur les épaules.
- **Les compositions avec du vide**, à plat, loin : le sujet doit être proche et grand, en couches qui se chevauchent.
- **Pousser sans montrer.** Toujours une planche avant/après, puis un oui explicite.

## 4. Les décisions de l'auteur (ne pas les redemander)

- **Charte du HUD : la charte actuelle, poussée** (bois, vélin, cuir, laiton ; Nunito et Fraunces) :
  - de vraies pièces dessinées dans la bibliothèque, étirées en `border-image` ;
  - **le geste principal en bois doré** (la pièce `bouton_ramasser_*`) ;
  - **le geste secondaire en petit bouton de papier** (`bouton_papier_*`) ;
  - plus aucun lien souligné ni pilule noire sur l'île.
- **Validation : planche avant/après** (captures réelles du jeu, téléphone et tablette) avant de commiter.
- **Bulles de dialogue** : parchemin dessiné avec sa queue vers celui qui parle.
  - Le **nom de qui parle dans un ruban à sa couleur**, posé sur le bord haut ; son motif dans le coin, à sa couleur.
  - Le ruban **remplace** le liseré gauche et la nuance de fond.
  - Un hostile : bulle sombre aux coins irréguliers, à droite. Une pensée : bulle de nuit.
- **Poses sur l'île** (déplacer un bâtiment, poser une annexe ou une création) : un seul niveau de cases dorées à la fois.
  - Au départ, le niveau du bâtiment.
  - Un toucher prend une case dorée de ce niveau sous le doigt ; s'il n'y en a pas, il passe au niveau de la case touchée (sans message d'erreur).
  - Doré = touchable.
- **Fêtes des constructions** : chantier vivant, impact et rebond, secousse de caméra, confettis et ruban (§ 6.9).
- **Aster pendant le tutoriel** : les objets du camp bloquent le chemin, et son poste est devant le Ponton (elle n'est plus cachée derrière l'épave).
- **Aster dans la scène des vagues** : une 22ᵉ expression, « soulagée » (yeux fermés en arc, petit sourire, joues roses), et non plus un grand sourire.
- **Visages** :
  - homme : sourcils plus droits, bas et longs ; yeux un peu plus étroits ; bouche plus large et plate ; mâchoire régulière ;
  - femme : sourcils plus arqués et un peu plus hauts ;
  - **les cils et les sourcils suivent le corps choisi** (homme : sans cils, sourcils épais ; femme : cils légers, sourcils fins).
- **Le tutoriel** ne se touche que si on le demande.

## 5. La méthode qui marche avec lui

- **Lots courts**, un sujet par lot.
- Pour chaque lot :
  1. inventaire du code (un agent d'exploration pour les gros sujets) ;
  2. captures « avant » sur le banc ;
  3. questions à choix si un choix est structurant (2 à 4 options, **la recommandée en premier, avec « (Recommandé) »** ; il la prend presque toujours si elle est argumentée) ;
  4. code ;
  5. captures « après », puis une planche avant/après envoyée en image ;
  6. sa validation, puis commit, push, PR en brouillon, abonnement ;
  7. fusion sur CI verte, et « tu peux lancer `deploy.sh` » avec une liste de choses à tester.
- **Il veut un regard d'expert** en ambiance, VFX, animation, game design et level design :
  - proposer des améliorations argumentées (ce qui cloche, ce qu'on gagne) ;
  - lui donner des ingrédients à choisir (questions à choix multiples) ;
  - ne pas attendre qu'il dise tout.
- **Les chevauchements sont des bugs.** Une bulle, une étiquette, un menu ou un niveau qui en cache un autre : on le corrige dans le lot où on le voit, et on le signale.
- **Fin de chaque tâche** : Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés / Suivi nécessaire.

## 6. Ce qui a été fait (pourquoi, comment)

### 6.1 Herbe en lumière peinte, fleurs en massifs (#556)
- **Pourquoi** : l'herbe était plate et les fleurs en pixels tape-à-l'œil.
- **Comment** : `src/world/terrain.js`.
  - **Lumière** :
    - la lumière couple chaud et froid sur l'herbe (`HERB_WARM`, `HERB_COOL`, `HERB_LIGHT`, `HERB_SHADE`) ;
    - une ombre portée douce (`SUN_X/Y`, `CAST_*`) ;
    - un liseré clair (`RIM_*`) ;
    - une ombre au pied (`FOOT_SHADE`).
  - **Fleurs** :
    - `flowerBed()` dessine des massifs rares (marguerite, lavande, bouton d'or) là où un bruit déterministe dépasse un seuil ;
    - le seuil est `bloom` : 0,76 dans l'herbe, 0,44 dans la prairie.
  - Le sol est cuit une fois par carte (`groundField`) : rien n'est calculé par image.

### 6.2 Visages homme et femme, PNJ adaptés (#557)
- `design/personnages/troupe.js` : la table `TRAITS` (homme, garçon, femme) règle :
  - l'arc, la hauteur et la longueur des sourcils ;
  - les cils.
- Les sourcils de tout le kit lisent ces traits.
- `portraits.js` : sans cils, une paupière fine seulement (même fermée).
- `avatar.js` :
  - mâchoires régulières (`carre`, `anguleux`, `large`) et mentons revus ;
  - yeux d'homme à 0,94 ;
  - bouche d'homme plus large et plate ;
  - corps : épaules et hanches selon le genre.
- `avatar_choix.js` : `LIES_AU_CORPS = ['cils', 'sourcils']`, appliqué au changement de genre (`AvatarMaker.vue`).
- Les maîtres ont reçu leurs traits ; les yeux de Galet et d'Ondin ont été abaissés.

### 6.3 Coiffures de dos et déchirures intégrées (#558)
- **Coiffures** : `avatar.js` a des vues de dos (`*_DOS`) pour chaque coupe. Sous un chapeau, une coupe se change (`SOUS_CHAPEAU`).
- **Déchirures** :
  - `troupe.js` : `dechirure(a, q, b, seed)` trace l'ourlet comme une courbe de 40 points (deux langues, deux encoches, un léger tremblé) ;
  - `filPendant()` ajoute un fil qui pend ;
  - le haut, la jupe, la tunique de Sylve et le poncho de Galet s'en servent ;
  - la graine vient des choix (`avatar_naufrage.js` : `flags.dechire`).

### 6.4 La lune de la veillée sort de l'océan (#559)
- `src/world/view/draw/veillee.js` : la lune est sous le bas de l'écran, côté joueur.
- Son halo monte de la mer, un chemin d'argent court jusqu'au rivage, et ses rayons remontent en éventail vers l'île.

### 6.5 HUD lot 1 : les zones nues de l'île (#560, barre du bas annulée par #562)
- **Bibliothèque** (`design/atelier/hud.js`, publiée dans `design/bibliotheque/svg/hud/`, index `hud.json`) :
  - `bandeau` : bois sombre ;
  - `panneau` : parchemin cloué ;
  - `bouton_papier_{repos,appuye}` ;
  - `feuille` : le haut d'une feuille du bas ;
  - `sceau_quete_{repos,pret}`.
- Chaque pièce a sa **tranche** (9-slice) dans `hud.json` : `tranche`, et `tranche_fichier` = la tranche × 4 (les fichiers sont en haute définition × 4).
- **CSS commun** `src/components/World/island-ui.css` :
  - `.world__btn`, `.world__road-go` et `.world__menu-btn` prennent le bois doré ;
  - `.world__link`, `--quiet` et `.world__menu-btn--quiet` prennent le papier ;
  - les bandeaux, les menus et les feuilles prennent leurs pièces ;
  - **aucun gabarit de feuille ne change**.
- **Coach** (`CoachLayer.vue`) : ses bulles s'écartent du bouton Récolte, des bandeaux et du menu de pose (`DODGE`, `measureDodge`, `across`).
- **Bouton Récolte verrouillé** : son encre (`--island-play-off-ink`) se lit sur sa face beige.
- **Test** `tests/hudArt.test.js` : chaque pièce citée par le CSS existe et est découpée à sa tranche.

### 6.6 Un niveau de cases dorées à la fois (#561)
- **Pourquoi** : sur une île à plateaux, les cases dorées de deux niveaux se recouvraient, et on touchait la mauvaise.
- **Comment** :
  - `src/world/poseLevel.js` : la règle pure (`spotsOnLevel`, `startLevel`, `pickSpot`), testée dans `tests/world/poseLevel.test.js` ;
  - le mixin `WorldView/poseLevel.js` la branche à `siteMove.js`, `annexes.js` et `workshop.js` ;
  - le dessin (`draw/loop.js`) et la main du tuto (`coach.js`) ne voient que les cases du niveau allumé ;
  - `tileAt(px, py, keep)` accepte un filtre.

### 6.7 HUD lot 2 : les bulles de dialogue (#562)
- **Pièces** : `bulle`, `bulle_queue`, `bulle_sombre`, `bulle_sombre_queue` et `bulle_pensee`. Les coins d'une bulle peuvent avoir des rayons différents (`rr4`).
- **Où** :
  - `BrumeGuide.css` : les répliques de l'île ;
  - `CoachLayer` : la bulle du coach et « Me montrer » ;
  - `PrologueScene.css` : les scènes.
- **Ruban** : `clip-path` à encoches, fond à la couleur `--speaker` (`game/speakers.js`).
- **Place** : au téléphone, sur l'île, la réplique se pose au-dessus du bouton Récolte (`body:has(.world__play--fab)`).

### 6.8 Les noms des lieux ne passent plus sous le HUD (#563)
- `draw/sites.js` : `hudObstacles(now)` relit toutes les 500 ms les rectangles de la barre du haut, des colonnes, du suivi des quêtes et de la Récolte (`HUD_COVERS`), puis les ramène au monde.
- `labelShift` (lot A) les évite comme un habitant. Sans place libre, sous le HUD, le nom ne se dessine pas.

### 6.9 Les fêtes des constructions (#564)
- **Pourquoi** : le moment le plus gratifiant du jeu était mou : pas d'anticipation, une montée mécanique avec la coupe au sol visible, un éclair et un anneau génériques, un mot en fondu.
- **Comment** : `src/world/fetes.js` (fonctions pures du temps écoulé et d'une graine), appelé par `draw/sites.js` (`paintSite`) et `draw/loop.js`.
  1. **Anticipation**, jusqu'à `RAISE_MS × 0,35` :
     - un échafaudage se monte (`drawScaffold`, couches `back` et `front`, perches plus hautes que le bâtiment, écharpes en croix, trois étages) ;
     - l'ancien bâtiment tremble et se tasse ;
     - des coups de marteau en étincelles ;
     - des volutes de poussière (`drawBuildDust`, bouffée `fumee` de `utils/vfx.js`).
  2. **Élévation**, jusqu'à `BURST_MS` :
     - le bâtiment monte derrière un rideau de poussière, étiré, dépasse sa place et redescend (`raiseShape`) ;
     - son ombre grandit avec lui (`shadowOf`).
  3. **Impact** (`BURST_MS`), puis `SETTLE_MS` de ressort :
     - il s'écrase et rebondit ;
     - une onde de poussière file au sol, des éclats volent (deux bonds), l'échafaudage tombe ;
     - l'écran tremble (`shakeOf`, appliqué à la caméra dans la boucle), plus fort au palier IV ;
     - un éclair chaud et un anneau d'or au sol.
  4. **Fête** : des confettis qui tournent et se retournent, le mot qui entre en ressort, un ruban d'or « Nom · palier II » qui se déroule.
- **Inchangés** : le chef d'orchestre, les durées, le grand moment (projecteur, colonne, pluie d'étoiles, ralenti, caméra), Pétille et Éclat. En mouvement réduit, seuls le mot et le ruban, immobiles.

### 6.10 Avant ces sessions (pour mémoire)

Lots livrés par les sessions design précédentes ; le détail est dans l'historique git et dans les PR :
- **kit des personnages** : lumière, poses 4/8/4 images, maîtres, naufragés, Anya, Brume ;
- **avatar** : barbes, coupes d'homme et de femme, garde-robe, mentons, chapeaux ;
- **bêtes** refondues (profil, trois quarts, dos) ;
- **splash** ;
- **atelier** : toit de cuivre, alambic ;
- **monde** : sol peint, vraie brume, côtes ; perf du gros plan ;
- **textes de l'île** : charte, lanterne de nuit, noms qui s'écartent ;
- **ATH du tuto** ;
- les **scènes** 01_noir, 02_lueur et 02_rocher.

Le kit des personnages et son pipeline sont décrits au § 7.

### 6.11 Fin des fêtes, notifications, création du personnage (#566 à #568)
- **Fin des fêtes (#566)** : ce qu'on pose (annexe, création, bâtiment déplacé, article, lieu) tombe à sa place dans un
  cercle d'or, s'écrase et rebondit ; les découvertes ont leur geste (la brume aspirée puis ouverte en couronne). Les
  mots ne disent plus « Bravo ! » (bible § 7.4) : « Debout ! », « Ça tient ! », « Bel ouvrage ! », « Une merveille ! »…
  Une pop-up n'est jamais rognée ni posée sur le HUD (`utils/cadre.js` : `placer`, `garderDansLEcran`).
- **Notifications (#567)** : un billet de vélin dessiné (`hud/billet.svg`), son ruban à la couleur du ton ; au plus
  trois, les gains qui reviennent s'additionnent (`services/toastRules.js`, testé) ; jamais sur le HUD. Le compteur
  « 2 / 4 » du coach est un sceau de cire.
- **Création du personnage (#568)** : la loge (estrade, projecteur, rideau, carte), des vignettes vivantes, une rangée
  de choix à la fois ; cheveux attachés de dos.

### 6.12 Le coin de Cannelle, le sceau rompu, les fenêtres de l'île, l'assemblage (#569 à #573)
- **Le coin de Cannelle (#569)** : son abri (T3) et son cabanon (acte II), animés ; les pièces de la marmite du jour 3.
- **Sceau rompu (#570)** : la modale des succès devient un moment (le sceau tombe, se fend, le médaillon paraît).
- **Fenêtres de l'île (#572)** : `GModal` prend le drapeau `sheet` ; les quinze fenêtres de l'île deviennent la feuille
  qui monte du bas (`hud/feuille.svg`), boutons bois doré et papier, plus de pilule noire. Textes inchangés.
- **Assemblage (#573)** : chaque pièce porte son morceau du dessin de la création ; l'établi prend vie (gabarit gravé,
  lucioles, pose qui claque, création qui s'élève).

### 6.13 Les mini-jeux sur une scène commune (#574 à #581)
- **Pourquoi** : les plateaux étaient des dizaines de SVG en `<img>` redessinés à chaque image ; les coups n'avaient ni
  impact ni voix.
- **Le moteur** `src/game/stage/` : `createStage(canvas, draw, { reduced })` dessine tant que quelque chose bouge et
  s'endort sinon ; `particles.burst(x, y, spec)` (formes star, ring, circle, chip, splinter, drop, leaf, bubble) ;
  `texts.add({ text, x, y, size, fill, font, look: 'word' | 'label' | 'gain', rays, tilt, life, rise, delay })` (lettres
  précuites en relief, qui sautent une à une) ; `shake`, `flash`, `freeze`, `wake`, `destroy` ; `sprites.js` précuit
  les dessins de la bibliothèque à leur taille.
- **Les paliers féeriques** partagés (`stage/tiers.js`) : Joli !, Superbe !, Magique !, Féerique !, Clair de lune !
  Les onomatopées douces d'île magique sont écrites dans `design/conception/onomatopees.md`.
- **Chaque jeu** a sa scène et son fichier d'effets testé : Récolte (`harvestScene.js`, `harvestFx.js`), Pêche
  (`fishingFx.js`), Filon (`veinScene.js`, `veinFx.js`), Cueillette (`pickScene.js`, `pickFx.js`), poules (`henFx.js`),
  marmite (`cookFx.js`, et les poses de Cannelle selon le moment), assemblage (`craftFx.js`). Les boutons restent,
  invisibles, pour le doigt et le clavier. Règles, gains et textes validés inchangés.

### 6.14 Amiral, les coffres, la mer (#582 à #587)
- **Amiral, le coq de Cannelle (#582)** : `design/atelier/coq.js` (profil, trois quarts avant et dos, icône), au trait
  et aux pattes des poules ; rond et trapu, grande crête en dents arrondies (l'auteur a refusé une version « flippante »
  aux longues pattes, puis la plume de mouette : une crête de coq, rien d'autre). Bibliothèque `animaux/ferme/coq/`.
- **Les coffres (#583, #584, #586)** : les vrais coffres de la bibliothèque (fermé, ouverture en quatre images, ouvert
  qui respire, `world/chestArt.js`) dans « Tout ouvrir », l'ouverture d'un coffre et la fenêtre « Tes coffres » ; la
  gerbe et le mot de chaque rareté vivent dans `game/chestFx.js` (`chestBurst`, testé).
- **La mer (#585)** : le chemin de lumière du soleil et de la lune est accroché à la mer (`world/rivage.js`,
  `drawGlitter`), plus collé à la vitre quand on fait glisser l'île.
- **Atelier (#587)** : `reprendre_maitres.mjs` (voir § 7) ; le README de l'atelier donne l'ordre complet des lots.

### 6.15 La Récolte, règles 2, et les écrans des niveaux (#588 à #593)
- **La tuile de lune (#588)** : dessinée dans `minijeu_recolte.js` (une tuile de nuit, un croissant doré qui dort, sa
  lueur ; hors des sortes de la commande) ; sur la scène, elle naît sur la dernière case d'une longue chaîne dans une
  gerbe d'étoiles et tombe avec sa colonne ; chaque tuile cueillie éclate en sa sorte.
- **La série (#589)** : le multiplicateur que le coup compte (« ×1,1 » à « ×1,5 », celui du moteur) collé au gain.
  Le mot « Série ×N ! » est resté tel quel.
- **Trois pièces qui dépassaient (#590)** : le fil droit, l'onde, la ronce coupée.
- **Le bilan d'un niveau (#591)** : chaque étoile claque dans une gerbe d'or, la dernière dit son palier (Joli !,
  Superbe !, Clair de lune ! pour trois, avec la pluie d'or) ; `game/bilanFx.js`, testé.
- **Le choix du niveau (#592)** : la piste des 10 niveaux de la saison (cases dorées selon les étoiles, touchables),
  ce qui manque pour ouvrir la saison suivante, de vrais chevrons ; `game/levelTrack.js`, testé.
- **Les fenêtres de jeu (#593)** : sur téléphone, elles s'arrêtent au-dessus de la barre d'onglets (`--world-floor`
  dans `WorldView.css`) ; le bouton « Commencer » n'est plus caché.

### 6.16 L'arrivée d'Ondin (#594, demande de l'agent logistique)
- **La planche d'Ondin** (`decor/camp/objets/planche_1.svg`, `planche_2.svg`, entrée `planche` de `camp.json`) : un
  morceau du pont de l'Hirondelle. Deux **états**, pas une boucle (`etats` à la place de `ms` dans le manifeste) :
  1 posée sur le sable, 2 mouillée pour la dérive.
- **Les scènes 11_ondin et 11_reveil** redessinées sur la plage au petit matin (`scenes6.js`) : le Ponton d'Aster à
  droite, Ondin endormi sur sa planche, puis assis qui se frotte un œil ; l'avatar passe à gauche.


## 7. Où vit le design, et comment le régénérer

- **Tout le design est du SVG généré par code** :
  - `design/atelier/*.js`, les générateurs : `hud.js`, `troupe.js`, `avatar.js`, `portraits.js`, `naufrage.js`, les bâtiments, les bêtes… ;
  - `design/personnages/` ;
  - un `preview_*.mjs` par famille écrit les fichiers dans `design/atelier/lib/` et une planche PNG dans `design/atelier/planches/` ;
  - `build_bundle.js` publie le tout dans `design/bibliotheque/` (`svg/`, `generateur/*.mjs`, `catalogue.json`, `index.html`, `planches/`).
- **Le jeu lit `design/bibliotheque/`** : les SVG par URL (`/design/bibliotheque/svg/hud/…`), les icônes par `import.meta.glob` (`src/utils/icons.js`), les générateurs en ESM.
- **Régénérer une famille** : `node preview_<famille>.mjs`, puis `node reprendre_maitres.mjs`, puis
  `node build_bundle.js` (environ 40 s). `lib/` n'est pas versionné : sur un clone neuf, lancer d'abord tous les
  `preview_*` (ordre du README de l'atelier).
  - **`reprendre_maitres.mjs` est obligatoire** : `preview2.js` (les dessins de base des maîtres) n'existe plus ; le
    script les remet dans `lib/` depuis la bibliothèque publiée. Sans lui, `build_bundle.js` vide `design/bibliotheque/`
    puis s'arrête : la remettre avec `git checkout -- design/bibliotheque` avant de recommencer.
  - Le bundle réécrit aussi des planches et des pages sans rapport (au bruit près) : `camp_grandit`, `coffres`,
    `lot_m`, `montage`, `perso`, `quotidien_visiteurs`, `scenes_tutoriel_1`, `scenes_tutoriel_2`, `minijeux`,
    `camp_naufrages`, `apercus/lot_m_apercu.html`, `apercus/scenes_apercu.html`… **Remettre** avec
    `git checkout -- <fichier>` tout ce que le lot n'a pas touché, avant de commiter.
- **Régénérer tout** : lancer chaque `preview_*` dans l'ordre du README de l'atelier, puis `reprendre_maitres.mjs`,
  puis `build_bundle.js`.
  - Remettre ensuite les planches que la régénération n'a pas à toucher : `batiments_objets`, `batiments_paliers`, `batiments_pieces_rares`, `batiments_skins`, `batiments_teintes`, `camp_grandit`, `coffres`, `decor_enseignes`, `meteo_moments`, `minijeux`, `ruines_anciens`, `planche_brume`, `planche_cerf`.
- **Vérifier** :
  - `node verif_generateurs.mjs` : 16 389 dessins identiques à la bibliothèque, et la couverture complète ;
  - `verif_generateur.mjs` : le module de l'avatar ;
  - `verif_avatar.mjs` : aucun choix ne casse le dessin ni ne sort du cadre (des milliers d'images) ;
  - `node clipcheck.js <dossier> [filtre]` : rien ne dépasse du cadre (les fonds de scènes plein écran, recadrés au
    centre, débordent par construction) ; `xmllint --noout` sur chaque SVG neuf ; des identifiants propres à chaque dessin ;
  - à la racine : `npm run lint`, `npx vitest run` (639 tests), `npm run build`.
- **Le kit des personnages** (`design/personnages/troupe.js`) :
  - `frame(c, view, pose, n, expr)` ; vues `front`, `se`, `ne` ; `IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 }` ;
  - lumière par `lumiere` et `peindre` (un champ de lumière commun aux habits) ;
  - manches `court`, `roll`, `torn` ; `TRAITS` ; `dechirure` ; `filPendant` ;
  - 22 expressions (dont « soulagée ») ;
  - `eclairer(corps, id, box, cote, force)` dans `design/atelier/splash_anya.js` : le passage de lumière commun pour éclairer un dessin du jeu posé dans une scène, sans le redessiner.

## 8. Le banc (voir avant et après)

- **Serveurs** (les sessions cloud les perdent au redémarrage) :
  ```
  service postgresql start
  cd /home/user/og-create-backend && DATABASE_URL=postgres://origins:origins@localhost:5432/origins_test \
    JWT_SECRET=ci-only-access-secret-not-used-in-production-0001 REGISTER_RATE_LIMIT=1000 \
    CORS_ORIGIN=http://127.0.0.1:8099 PORT=3000 node src/server.js        # en tâche de fond
  cd /home/user/og-create && npx vite --port 8099 --host 127.0.0.1 --strictPort   # en tâche de fond
  ```
  Pour l'« avant » : un `git worktree` détaché sur `master` (ou sur le commit d'avant), servi sur le port 8098.
- **Playwright** : `require('/opt/node-tools/node_modules/playwright')`, Chromium `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
- **Un compte de banc à chaque fois**, mot de passe au hasard :
  1. `POST /api/auth/register` avec l'en-tête `X-Requested-With: origins` ;
  2. bâtiments et quartiers posés en SQL (`world_buildings`, `world_zones`, `progress.coins`) ;
  3. dans `localStorage`, `user`, `oc_brume_born` et `oc_prologue` (`{ skipped: true }` pour passer le tuto).
  - Cliquer « Entrée » au splash.
- **Atteindre l'île** : la fonction `__find` de `outils/banc/perf.cjs` parcourt l'arbre des vnodes. `window.__find('WorldView')` donne alors :
  - `openSiteSheet(id)` et `startRoad()` ;
  - `startSiteMove(id)` et `tapSiteSpot(px, py)` ;
  - `celebrate(site, from)` et `sparkle(kind, at)`.
- **Le temps figé** (pour filmer une fête image par image) :
  ```js
  cancelAnimationFrame(w.raf); w.raf = 0; window.requestAnimationFrame = () => 0;   // la boucle coupée
  w.celebrate(site, from); const start = w.fetes.playing[0].start;
  // puis, pour chaque instant : w.draw(start + dt), et une capture
  ```
  - **Sans** `reducedMotion: 'reduce'` dans le contexte du navigateur, sinon les fêtes ne jouent pas.
  - Dessiner une fois le bâtiment à son ancien palier, pour que son image soit chargée (en jeu, on le voyait juste avant).
- **Les captures** : téléphone 390 × 844 (× 2) et tablette 1024 × 768, assemblées en planche avec PIL (étiquettes AVANT en rouille, APRÈS en vert canard), envoyées en image.
- **Les mini-jeux** : `w.startHarvest()` ouvre la Récolte, `w.openGame('filon' | 'cueillette' | …)` la fenêtre d'un
  jeu. Pour forcer des règles d'une partie (règles 2 de la Récolte) sans toucher au serveur : `page.route` sur
  `**/play/world/harvest/start`, et réécrire `run.rules` dans la réponse. Jouer une chaîne : des `touchStart` /
  `touchMove` / `touchEnd` par CDP (`Input.dispatchTouchEvent`), en recalculant la boîte du plateau avant chaque coup.
  Pour une fenêtre (modale) seule : charger `island-ui.css` et cacher `body > *`.
- **Les bulles de l'île** : `const { guide } = await import('/src/game/guide.js'); guide.say({ id, text, who, face… })`, et `bubbleFace()` de `/src/world/faces.js` pour un portrait.

## 9. Ce qui reste à faire (dans l'ordre conseillé)

Fait depuis la passation précédente : les fenêtres de l'île (#572), les notifications et le compteur du coach
(#567), les autres fêtes et le mot « Bravo ! » (#566), les mini-jeux vivants (#574 à #581, #588 à #593).

1. **Les règles 2 des autres mini-jeux** (`design/conception/demandes_logistique.md`, § 2 à 4) : quand l'agent
   logistique les aura livrées, brancher leurs effets côté jeu, sans toucher aux règles :
   - Pêche, « la série porte chance » : le « ×1,2 » à côté du gain ;
   - Filon, « le coup de lune » : la pioche qui s'illumine (pièces `pioche-or`, `coup-or` de la bibliothèque) ;
   - Cueillette, « la main verte » : le panier qui luit (pièce `magie`).
2. **HUD, la barre du haut** (horloge, bourse, réserves, colonnes de boutons) : **2 ou 3 pistes en maquette d'abord**,
   vu le refus de la barre du bas en bois.
3. **Île vivante** : ambiance continue, sans coût par image :
   - vent en vagues dans l'herbe et les arbres ;
   - oiseaux et papillons le jour, lucioles et braises la nuit ;
   - écume et reflets sur la côte (le chemin de lumière est déjà accroché à la mer, #585).
4. **Météo, finition** :
   - le sol qui se mouille et luit sous la pluie, des flaques qui se forment puis sèchent ;
   - l'orage (éclairs qui éclairent l'île) ;
   - la brume du matin qui se lève.
5. **Personnages, la suite** :
   - étape 3 du dossier : les épaules et le cou H/F ;
   - les habits : une grosse recherche, puis des propositions illustrées ;
   - la peau : dégradé ou couleur fixe (à clarifier avec l'auteur) ;
   - les **16 autres scènes** des étapes 00 à 06 (`scenes7.js`), avec le traitement des trois scènes acceptées ;
   - une seconde passe sur les matières (tissu, cuir, laine, métal), et les accessoires selon la posture.
6. **Bâtiments personnalisables** : morceaux, 4 styles × 4 morceaux × couleurs. L'étape 1 (Foyer IV) attend en PR
   #533, en brouillon.
7. **Le catalogue « à revoir »** (`design/atelier/catalogue.js`, `A_REVOIR`) : les coins des maîtres au camp, le
   cabanon avant l'Abri, le SOS, la clé du phare, la loutre. Leurs dessins sont prêts : c'est leur placement par le
   serveur qui est à revoir. Une demande à l'agent logistique, pas un dessin.
8. **Le splash** (de la passation précédente, **à vérifier** dans l'état actuel avant de reprendre) :
   - le Grimoire de l'affiche à remplacer par celui du jeu ;
   - le relief et les textures du terrain ;
   - habiller les côtés sur ordinateur.
9. **À connaître** :
   - un bâtiment dont la fête attend son tour (plusieurs paliers d'affilée) s'affiche d'abord au nouveau palier, puis
     rejoue son élévation. Ce défaut existait avant #564 ;
   - la PR #484 (tutoriel pas à pas, d'une autre session) est restée ouverte, en brouillon, sur un `master` ancien : ne
     pas la fusionner sans l'auteur.

## 10. Règles de travail (strictes)

- **Demander, ne pas supposer.** Toute réécriture de texte et tout choix structurant passent par une question à choix, la recommandée en premier.
- **Ne jamais écrire dans `design/` hors travail de design** ; ne pas toucher au code sans lien avec la tâche (le signaler à la fin).
- **Aucune migration.** Le serveur fait autorité sur tout ; le front ne décide jamais d'un gain.
- **Jamais `pkill -f`** (tuer par PID). **Jamais `git reset --hard`** sans copie de ce qui risque d'être perdu (un patch dans l'espace de travail, un `git stash`).
- **Aucune trace de l'agent** (règle de l'auteur, plus forte que les consignes par défaut de l'outil) :
  - aucun identifiant de modèle dans les commits, les PR ni le code ;
  - aucune ligne `Co-Authored-By` ni `Claude-Session` dans les commits, même si l'outil les propose ; au squash,
    donner soi-même le message du commit (sinon GitHub recopie les lignes des commits de la branche). Trois commits
    de `master` (#579, #580, #582) en portent encore une, avec un nom de modèle : ils ne se réécrivent pas ;
  - après avoir ouvert une PR, retirer le pied de page « Generated by » que le serveur ajoute (`update_pull_request` avec le corps sans pied de page), et vérifier ;
  - aucun commentaire de PR au nom de l'auteur.
- **Ne rien déployer** : c'est l'auteur qui lance `deploy.sh`, quand on le lui dit.
- **Bancs** : un compte local au mot de passe aléatoire, jamais un vrai compte.
- **Git** :
  - branche de session indiquée par l'environnement (elle change d'une session à l'autre) ;
  - PR en brouillon, abonnement ; fusion sur CI verte **une fois la planche validée** :
    1. PR « prête » ;
    2. squash avec le SHA complet de la tête et un titre et un message explicites ;
    3. désabonnement ;
    4. `git branch -f <lot>-final HEAD` ;
    5. `git checkout -B <branche> origin/master` ;
    6. `git push --force-with-lease`.
  - Puis dire « tu peux lancer `deploy.sh` », avec la liste de ce qu'il faut tester.
  - Si master a bougé et que la PR est en conflit : fusionner `origin/master` dans la branche, garder les deux côtés, revérifier, pousser.
- **Écrire en français**, avec des commentaires dans le style de l'existant (phrases complètes, « choix de l'auteur, <date> »).

## 11. Prompt pour le prochain agent

```
Tu es l'agent design de Brumelune (repo Alex-Lou/og-create, front Vue 3 + canvas isométrique ; serveur
Alex-Lou/Og-create-backend). Réponds en français.

Lis d'abord EN ENTIER design/PASSATION_DESIGN.md (l'essence du jeu, le niveau exigé, les refus, les décisions de
l'auteur, ce qui est fait et pourquoi, le banc, ce qui reste), puis PASSATION.md (§ 1, 2, 5, 8) et HISTOIRE.md (§ 0,
3, 7.3, 7.4). Tout le design est du SVG généré par code (design/atelier, design/personnages) publié dans
design/bibliotheque ; l'île est dessinée dans un canvas (src/world).

L'essence : une île qu'on fait renaître après un naufrage ; doux, drôle, jamais punitif ; chaleureux et vivant ;
chaque geste a une réponse ; bâtir est un moment ; lisible au doigt sur téléphone ; une charte de bois, parchemin et
or. Niveau exigé : chibi AAA « choupi », jamais bébé ; jamais plat ; animations de studio (anticipation, élan,
rebond, retombée), jamais de clignotement ; rien hors cadre ; aucun coût répété ni fuite ; mouvement réduit respecté ;
mobile d'abord ; ne jamais nommer de jeu existant. Pense en expert ambiance, VFX, animation, game et level design :
propose, argumente, donne des ingrédients à choisir.

Règles d'or : on ne change jamais la forme, le visage ni les couleurs d'un dessin du jeu (on pousse son rendu) ; on
ne revient pas sur un refus du § 3 ; on demande avant tout choix structurant ou toute réécriture de texte (questions
à choix, la recommandée en premier) ; une planche avant/après (téléphone 390×844 et tablette 1024×768) avant tout
commit, puis un oui explicite ; aucune trace de l'agent dans les commits et les PR (§ 10) ; ne rien déployer.

Première tâche : propose à l'auteur le lot suivant parmi le § 9 (recommandé : les règles 2 des autres mini-jeux si
l'agent logistique les a livrées, sinon l'île vivante), avec une question à choix. Termine chaque tâche par : Fichiers modifiés / Ce qui a été
modifié / Fichiers intentionnellement non touchés / Suivi nécessaire.
```
