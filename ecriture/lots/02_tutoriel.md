# Lot 02 — Le reste du tutoriel : Hermine, Marcelle, Jovin, Pierrot, le Campement

> Ce lot reprend le tutoriel du premier matin jusqu'au Campement, dans l'ordre où le jeu le joue (`src/game/prologue.js`, `islandStep`).
> - Décisions appliquées : `ton.md` § 0 (en particulier 1, 5, 10, 12, 14, 16, 17, 20, 21).
> - **Hors de ce lot** : les répliques sur les égarés et la veillée de la deuxième nuit (`egares-nuit`, `egares-nord`, `cachons`, `egare-la`, `visiteurs`, `cloture-voyez`, `cuisines`). Elles viennent au lot 03, avec les égarés.
> - Beaucoup de répliques de ce lot sont **déjà au bon niveau** (validées par l'auteur les 11, 13 et 14 octobre) : elles sont listées et gardées, pour que le lot soit complet.
> - Dans les tableaux, la barre des deux formes s'écrit `\|` (contrainte du Markdown) ; dans le jeu, c'est une barre simple : « naufragé|naufragée ».
> - Rien n'est final sans un « oui » de l'auteur. **Trois points à trancher** sont en fin de document.

---

## 1. Le déroulé

| Jour | Quêtes (dans l'ordre) | Scène | Ce que le lot change surtout |
|---|---|---|---|
| Le matin d'Hermine (jour 2) | `caisse`, `recolte`, `premier-ponton`, `chemin-aster`, `clotures`, `veille` | `recolte` | L'épave contre les rochers (décision 10) ; les règles de la Récolte et les chiffres passent à l'aide. |
| Le jour de Marcelle (jour 3) | `soupe`, `cage`, `poules`, `poulailler`, `abri-cannelle`, `enclos-cannelle`, `nuit-cannelle` | `cannelle` | « Deux nuits » ; le folklore des feux follets ; les surnoms rares (décision 17). |
| Le jour de Jovin (jour 4) | `deco`, `torches-rivet`, `nuit-rivet` | `rivet` | Plus de « clic, tac » en ponctuation (décision 16). |
| Le matin de Pierrot (jour 5) | `eveil-ondin`, `souvenir-ondin`, `puits-ondin`, `chemin` | `ondin` | « La brume l'a gardé » ; Pierrot chuchote. |
| Le soir | (fin de la chaîne) | `campement` | La dernière réplique annonce le manque de l'acte I (le bois). |

Une image nouvelle :

| Image | Où | Ce qu'on voit | Statut |
|---|---|---|---|
| **`10_epave`** | scène `recolte`, en ouverture | Le premier matin, gris et doux. Contre les rochers au bout de la plage, un morceau de *l'Hirondelle* : une moitié de pont, un canot retourné, des caisses prises dans les cordages. Dans l'eau, au pied de l'épave, quelqu'un nage vers la plage (Hermine). | **nouvelle** |

---

## 2. Le matin d'Hermine

### 2.1 La scène `recolte`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| **recolte.0** | pensée | **`10_epave`** | — | *L'épave est venue jusqu'aux rochers, cette nuit. Mes affaires sont quelque part là-dedans… ou au fond.* | La promesse de la veille (epave.1) se tient, à moitié : l'épave est là, les affaires peut-être pas (décision 10). |
| recolte.0 → **recolte.1** | Hermine | `10_aster` | Ho, toi ! Tu étais sur l'Hirondelle ? Alors donne-moi la main : la mer m'a lessivée ! | Ho, du feu ! Tu étais sur l'Hirondelle ? Alors donne-moi la main. La mer ne m'a pas lâchée de la nuit. | Un appel de marin ; la fatigue dite par une image, sans point d'exclamation à chaque phrase. Humeur : soulagée. |
| recolte.2 | Hermine | `10_aster` | Hermine, navigatrice. Officier de quart, pour être exacte. J'ai nagé vers ton feu toute la nuit. | Hermine, navigatrice. Officier de quart, pour être exacte. J'ai nagé vers ton feu toute la nuit. | Gardée. Elle était une des silhouettes (décision 5). |
| recolte.3 | Hermine | `10_aster` | La mer rend ce qu'elle a pris. Un ponton, une ligne, et je te montre ce qu'elle garde encore ! | La mer rend ce qu'elle a pris. Un ponton, une ligne, et je te montre ce qu'elle garde encore. | Le point d'exclamation ôté : elle l'affirme, elle ne le vend pas. Humeur : décidée. |

### 2.2 Sa caisse, sa longue-vue, sa Récolte

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| COACH.aster-eau.aster | aide | elle nage au pied du Ponton | Quelqu'un dans l'eau ! Va l'aider. | Quelqu'un dans l'eau. Va l'aider. | L'aide ne s'exclame pas (ton § 3.3). |
| LINES.caisse | Hermine | sa caisse échouée | Ma caisse ! Elle a nagé moins vite que moi. Aide-moi à l'ouvrir. | Ma caisse ! Elle a nagé moins vite que moi. Aide-moi à l'ouvrir. | Gardée. Elle vient de l'épave (décision 10). |
| LINES.tresors | Hermine | la caisse ouverte | Ma longue-vue… intacte. Et mon filet ! Le reste, on le gagnera. | Ma longue-vue… intacte. Et mon filet ! Le reste, on le gagnera. | Gardée. |
| LINES.rend | Brume | idem | La mer rend ce qu'elle a pris. C'est toi qui l'as dit. | La mer rend ce qu'elle a pris. C'est toi qui l'as dit. | Gardée : Brume le rend à Hermine. |
| LINES.installe | Hermine | la longue-vue choisit son camp | Là, face à la mer : c'est là que je m'installe. | Là, face à la mer : c'est là que je m'installe. | Gardée. |
| LINES.rivage | Hermine | avant la Récolte | Viens au rivage. Relie ce qui se ressemble, vite, avant la marée. | Viens au rivage. La marée laisse des choses, et elle les reprend vite. | La règle (relier) passe à l'aide ; Hermine parle de la mer, qu'elle connaît. |
| **COACH.recolte.regle** | aide | la Récolte s'ouvre | — | Relie au moins trois objets pareils avant que la marée reparte. | La règle, dans l'aide (reprise de la bible v6, 4d). *À brancher seulement si la Récolte n'affiche pas déjà sa règle.* |
| LINES.chaine | Brume | la Récolte finie | Plus la chaîne est longue, plus l'île te donne. Elle aime ça, je crois. | L'île donne plus à ceux qui vont loin. Elle aime ça, je crois. | La règle dite comme un caractère de l'île ; « Elle aime ça, je crois » gardé. |
| LINES.bois-ponton | Hermine | idem | Pas mal, pour un naufragé. Il nous faut vingt-cinq bois pour mon ponton. | Pas mal, pour un naufragé\|une naufragée. Pour mon ponton, il en faudra bien plus. | Les deux formes (décision 20). Le chiffre reste dans l'aide (COACH.premier-ponton.build : « Vingt-cinq bois : bâtis le Ponton. »). Humeur : malicieuse. |

### 2.3 Son ponton, le chemin, les piquets

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.ponton-bois | Hermine | le chantier du Ponton | Un ponton, et la mer devient un chemin. | Un ponton, et la mer devient un chemin. | Gardée. |
| LINES.ponton-tient | Hermine | le Ponton bâti | Il tient ! Mon premier ponton à moi. | Il tient. Ma grand-mère aurait tapé du talon dessus, pour voir. | « À moi » était enfantin. La grand-mère gardienne de phare entre dans le jeu dès le premier jour (son premier cœur, bible § 8.2). Humeur : rire. |
| LINES.ponton-promesse | Brume | idem | Il brille dans la brume… comme une promesse. | Une lumière de plus sur la plage. Ça fait deux. | Brume compte les lumières (ton § 4.1). *Suppose que le Ponton porte un fanal, comme le dit la réplique actuelle (à vérifier sur le dessin).* |
| LINES.chemin-camps | Hermine | le chemin entre les deux camps | Deux camps, un seul feu. Un chemin, et plus personne ne se mouille les pieds. | Deux camps, un seul feu. Un chemin, et plus personne ne se mouille les pieds. | Gardée. |
| LINES.chemin-pieds | Brume | idem | Un chemin ! Les pieds le retrouvent, même dans la brume. | Un chemin. Les pieds le retrouvent, même dans la brume. | Le point d'exclamation ôté. |
| LINES.voisins | Hermine | le chemin tracé | Voilà. Deux pas, et on est voisins. | Voilà. Deux pas, et on est voisins. | Gardée. |
| LINES.joli-camp | Hermine | ses piquets | Naufragés, d'accord. Mais rien n'interdit d'avoir un joli camp. | Naufragés, d'accord. Mais rien n'interdit d'avoir un joli camp. | Gardée. |
| LINES.cloture-deux | Brume | idem | Une clôture, ça décore… ou ça protège. Bien placée, les deux à la fois. Plante-la tout autour du feu. | Une clôture, ça décore. Bien placée, ça protège aussi. Tout autour du feu, alors. | Le mode d'emploi s'efface ; les cases dorées restent dans l'aide (COACH.clotures, inchangée). |
| LINES.chez-nous | Brume | l'enclos bouclé | Ça ressemble à un chez-nous. | Ça ressemble à un chez-nous. | Gardée. |

### 2.4 Le soir à deux (`veille`)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.aster-dormir | Hermine | le soir | Je dormirai mieux, ce soir. | Je dormirai mieux, ce soir. | Gardée. |
| LINES.cuisiner | Hermine | idem | On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner. | On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner. | Gardée. |
| LINES.manger | Brume | idem | Moi, je ne mange pas. Ça n'aide pas, je sais. | Moi, je ne mange pas. Ça n'aide pas, je sais. | Gardée : l'humour sec de Brume. |
| LINES.debrouiller | Hermine | idem | Demain, on se débrouillera. Ou quelqu'un viendra, qui sait faire. | Demain, on se débrouillera. Ou quelqu'un viendra, qui sait faire. | Gardée : elle annonce Marcelle sans le savoir. |
| LINES.soir | Brume | la deuxième nuit | Deux, ce soir, autour du feu. Dors : je veille. | Deux, ce soir, autour du feu. Dors : je veille. | Gardée. |

---

## 3. Le jour de Marcelle

### 3.1 La scène `cannelle`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| cannelle.0 | Marcelle | `07_cannelle` | Trois nuits que je regarde ton feu depuis les rochers. Je n'osais pas… à cause de lui. | Deux nuits que je regarde ton feu depuis les rochers. Je n'osais pas… à cause de lui. | Elle arrive après deux nuits (« Trois autour du feu. Hier encore, on était deux. »). La silhouette de la première nuit (décision 5). |
| cannelle.1 | Marcelle | `07_cannelle` | Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine. | Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine. | Gardée. |
| cannelle.2 | Marcelle | `07_souvenir` | Les marmites, la cuisine du bord… Marcelle ! Je m'appelle Marcelle. Cuisinière, et pas des pires. | Les marmites, la cuisine du bord… Marcelle ! Je m'appelle Marcelle. Cuisinière, et pas des pires. | Gardée. |
| cannelle.3 | Marcelle | `07_souvenir` | Un feu follet ! … Oh. Il a des yeux de chiot, celui-là. | Un feu follet… Ma mère disait qu'ils mènent les gens dans les marais, et qu'on ne les revoit jamais. | « Des yeux de chiot » était une mignonnerie. Le folklore des marais, ôté de l'ouverture (arrivee.1), revient ici : la peur de toute une vie (son troisième cœur, bible § 8.2). Humeur : méfiante. |
| **cannelle.3b** | Marcelle | `07_souvenir` | — | … Celui-là a l'air plus perdu que nous. | La peur tombe d'un coup : elle la regarde vraiment. « Celui-là » amène la réplique de Brume. Humeur : radoucie. |
| cannelle.4 | Brume | `07_souvenir` | Elle. | Elle. | Gardée : le même aplomb que « VivantE ! ». |

### 3.2 La faim, la soupe, la brume

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.faim-aster | Hermine | Marcelle s'installe | Une cuisinière ! Brume, dis-moi que je ne rêve pas. | Une cuisinière ! Brume, dis-moi que je ne rêve pas. | Gardée. |
| LINES.faim-cannelle | Marcelle | idem | Moi, c'est ton ventre qui me fait rêver, ma brindille. On l'entend crier famine jusqu'aux rochers. | Ton ventre, je l'entends depuis les rochers. Assieds-toi. Un ventre vide ne bâtit rien. | Le surnom part (décision 17), le gag aussi ; un proverbe de cuisine à sa façon. Humeur : malicieuse. |
| LINES.faim-bulle | Brume | idem | Elle a raison. Regarde au-dessus d'elle : quand quelqu'un a besoin de toi, une bulle te le dit. | Elle a raison. Et elle aussi a faim : regarde-la. | Brume ne parle plus de bulle ; elle remarque, c'est tout. |
| **COACH.bulle-besoin** | aide | idem | — | Une bulle au-dessus de quelqu'un dit ce qui lui manque. | La bulle, dans l'aide (ton § 3.3). |
| LINES.bulle | Marcelle | ses coquillages | Des coquillages crus ? Ma brindille, on n'est pas des sauvages. Donne : je te fais une soupe. | Des coquillages crus ? Ma brindille, on n'est pas des sauvages. Donne : je te fais une soupe. | Gardée : la première « brindille », moqueuse (décision 17). |
| LINES.soupe | Marcelle | la soupe | Une soupe… Une cuillère pour le corps, une pour l'âme. | Une soupe… Une cuillère pour le corps, une pour l'âme. | Gardée. |
| LINES.bulles-reviennent | Brume | idem | Les bulles reviennent, tu sais. On a toujours un peu faim, ou froid, ou envie de parler. | Ça revient, tu sais. On a toujours un peu faim, ou froid, ou envie de parler. | « Les bulles » était un mot d'interface ; la phrase reste. |
| LINES.brume-avale | Marcelle | idem | Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d'autres naufragés ? | Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d'autres naufragés ? | Gardée : la faute grandit (décision 7 bis). |
| LINES.brume-retient | Brume | idem | Peut-être. Je ne la retiens plus très bien. Ce qui y entre, je ne le vois pas toujours ressortir. | Peut-être. Je ne la retiens plus très bien. Ce qui y entre, je ne le vois pas toujours ressortir. | Gardée : depuis la décision 3, elle dit plus vrai qu'elle ne croit. |

### 3.3 La marmite (validée le 13 oct.)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| COOKING.open | Marcelle | la marmite | Des coquillages, des algues, un fond d'eau de mer… Ce n'est pas la cuisine du bord, mais regarde bien, ma brindille. | Des coquillages, des algues, un fond d'eau de mer… Ce n'est pas la cuisine du bord. Mais regarde bien. | Seul le surnom part : les « brindille » qu'on garde sont ailleurs (décision 17). |
| COOKING.plouf | — | un ingrédient tombe | Plouf ! | *(supprimée)* | Onomatopée : l'éclaboussure à l'image suffit. |
| COOKING.go | bouton | l'écran d'entrée | C'est parti ! | Commencer | Le ton d'animatrice. |
| COOKING.end | Marcelle | la fin | Goûte, toi. Moi, je sale toujours trop… à ce qu'on dit. | Goûte, toi. Moi, je sale toujours trop… à ce qu'on dit. | Gardée : le goût perdu, sans le dire. |
| COOKING (le reste) | consignes | — | (title, rule, hint, items, fast, later, next) | (inchangés) | Gardés. |

### 3.4 Les poules

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.caquets-eau | Hermine | des caquets sur l'eau | Chut ! Des caquets… sur l'eau ! Prends ma longue-vue. | Chut. Des caquets… sur l'eau ! Prends ma longue-vue. | Un seul point d'exclamation, sur la surprise. |
| LINES.mes-filles | Marcelle | la cage repérée | Mes filles ! Caramel, Flocon, Réglisse ! Elles ont tenu bon ! | Mes filles ! Caramel, Flocon, Réglisse… Elles ont tenu bon. | Un seul cri ; la voix qui se brise sur les noms. Humeur : émue. |
| HENS_FREED (`village.js`) | Marcelle | la cage ouverte | Mes filles ! Elles ont tenu bon ! | Mes filles… Elles ont tenu bon. | Idem. |
| LINES.doucement | Marcelle | idem | Doucement, mes jolies ! Attrape-les, ma brindille, elles ont eu peur. | Doucement. Elles ont vu la mer de trop près, elles aussi. | Ni diminutif ni surnom ; « elles aussi » : comme nous. |
| HEN_CHASE (le reste) | Marcelle, cartes | la chasse aux poules | (title, open, rule, cards, later, next, hint) | (inchangés) | Gardés : « Réglisse fait ce qu'elle veut », « elle te pardonnera. Peut-être. » |
| HEN_CHASE.squawk | — | une poule s'esquive | Cot ! / Cot cot ! | *(supprimée)* | Onomatopée : les plumes à l'image suffisent. |
| HEN_CHASE.end | Marcelle | les trois prises | Les voilà toutes ! | Les voilà toutes. | Le soulagement, sans le crier. |
| HEN_CHASE.go | bouton | l'écran d'entrée | C'est parti ! | Commencer | Idem COOKING.go. |
| LINES.tout-le-monde | Marcelle | les poules attrapées | Caramel, Flocon, Réglisse… Tout le monde est là. | Caramel, Flocon, Réglisse… Tout le monde est là. | Gardée. |
| LINES.deux-vivres | Marcelle | les nourrir | Elles ont faim, les pauvres. Deux vivres chacune. | Elles ont faim. Une nuit en mer dans une cage, ça creuse. | « Les pauvres » part ; le chiffre reste dans l'aide (COACH.poules.hungry : « Nourris une poule : sa bulle, deux vivres. »). |
| LINES.recolte-nourrit | Marcelle | pas assez de vivres | La Récolte nourrit aussi, ma brindille. | La marée nourrit aussi. Demande à Hermine. | Le surnom part ; elle renvoie à la Récolte par la personne qui la mène. L'aide dit le geste (COACH.short.poules). |
| LINES.un-toit | Marcelle | le poulailler | Il leur faut un toit. Un petit poulailler, là, dans l'herbe, près de ma cuisine. | Il leur faut un toit. Un petit poulailler, là, dans l'herbe, près de ma cuisine. | Gardée. |
| LINES.un-coq | Marcelle | le poulailler posé | Un toit, du grain… Il ne leur manque qu'un coq, à mes filles. Un jour. | Un toit, du grain… Il ne leur manque qu'un coq, à mes filles. Un jour. | Gardée. |
| LINES.village | Brume | idem | Un toit pour les poules, un feu pour nous. Ça devient un village, tu sais. | Un toit pour les poules, un feu pour nous. Ça devient un village, tu sais. | Gardée. |

### 3.5 Son abri, son enclos, le soir à trois (validés le 13 oct.)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.marmite | Marcelle | son abri | Mes filles ont un toit. Moi, je dors sur une marmite renversée… mais je ne me plains pas. | (inchangée) | Gardée. |
| LINES.se-plaint | Brume | idem | Elle se plaint un peu. Bâtis-lui un abri, à côté de sa cuisine. | (inchangée) | Gardée. |
| LINES.toit-a-moi | Marcelle | l'abri bâti | Un toit à moi… Ma brindille, tu vas me faire pleurer dans la soupe. | (inchangée) | Gardée : la deuxième « brindille », émue (décision 17). |
| LINES.casseroles | Marcelle | son enclos | Et pas de piquet dans mes casseroles, hein. | (inchangée) | Gardée. |
| LINES.en-ville | Marcelle | l'enclos posé | Une cuisine avec une clôture. On se croirait en ville ! | (inchangée) | Gardée. |
| LINES.a-table | Marcelle | le soir | À table ! Ce soir, on mange chaud. | (inchangée) | Gardée. |
| LINES.trois-feu | Hermine | idem | Trois autour du feu. Hier encore, on était deux. | (inchangée) | Gardée. |
| LINES.chaise | Marcelle | idem | Il manque une chaise… celle de mon Pierrot. Mangez, avant que ça refroidisse. | (inchangée) | Gardée : la peine dite par un plat. |
| LINES.soir-trois | Brume | la troisième nuit | Trois, ce soir. Dors : je veille. | (inchangée) | Gardée. |

---

## 4. Le jour de Jovin

### 4.1 La scène `rivet`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| rivet.0 | Jovin | `09_rivet` | Une soupe. Je sens une soupe. Sur une île déserte. | Une soupe. Je sens une soupe. Sur une île déserte. | Gardée. |
| rivet.1 | Jovin | `09_rivet` | Soit j'ai pris un coup sur la tête, soit… Non. J'ai pris un coup sur la tête. | Soit j'ai pris un coup sur la tête, soit… Non. J'ai pris un coup sur la tête. | Gardée. |
| rivet.2 | Jovin | `09_rivet` | Jovin. Horloger. Je répare ce qui se répare. Ton feu tousse : le vent entre par là, et par là. | Jovin. Horloger. Je répare ce qui se répare. Ton feu tousse : le vent entre par là, et par là. | Gardée. |
| rivet.3 | Jovin | `09_rivet` | Je monte un établi près du feu : avec lui, tout devient possible. Ou presque. | Une porte de cabine sur deux caisses, près du feu. Ce n'est pas un atelier. C'est un début. | Plus de slogan ; l'établi décrit par celui qui le monte (la bible v6, 9d). |
| rivet.4 | Jovin | `09_rivet` | Commençons petit : une lanterne. Le petit, je sais encore faire. | Commençons petit : une lanterne. Le petit, je sais encore faire. | Gardée : le non-dit de l'incendie. |

### 4.2 La lanterne, les torches, le soir à quatre

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| COACH.rivet-brume.rivet | aide | il sort de la brume | Quelqu'un sort de la brume : va voir. | Quelqu'un sort de la brume : va voir. | Gardée. |
| LINES.puzzle | Jovin | l'établi | Chaque pièce a sa place. Tourne, essaie. Clic ! | Chaque pièce a sa place. Tourne, essaie. Elle te dira quand c'est la bonne. | Le « clic » en ponctuation part (décision 16) ; la pièce qui s'emboîte fera le bruit elle-même. |
| LINES.or | Jovin | la lanterne à poser | Ta clôture dit « pas par ici ». Une lanterne dit « viens, petite luciole ». Pose-la là où l'île brille d'or. | Une clôture leur barre la route. Une lumière… je ne sais pas encore ce qu'elle leur fait. On verra cette nuit. | « Petite luciole » et « là où l'île brille d'or » (les cases dorées) partent. La lumière qui libère les égarés devient une question : la menace douce, le mystère. Les cases restent dans l'aide (COACH.deco.cells). |
| LINES.torches-idee | Jovin | ses torches | Hier soir, ils sont venus de trois côtés. Trois torches, une par côté. Clic, clic, clic. | Hier soir, ils sont venus de trois côtés. Trois torches, une par côté. Ce n'est pas du génie, c'est de l'arithmétique. | Les trois « clic » partent ; son humour sur lui-même. |
| LINES.torches-tiennent | Jovin | les torches posées | Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient. | Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient. | Gardée : son tic, juste. |
| LINES.quatre-feu | Jovin | le soir | Quatre autour d'un feu. Tac. Il nous faudra une plus grande marmite. | Quatre autour d'un feu. Il nous faudra une plus grande marmite. Ou un plus petit Jovin. | Le « Tac » part ; un jeu de mots qui tombe à plat, comme il se doit. |
| LINES.souci | Marcelle | idem | Mon Pierrot… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Il sait nager, hein ? | (inchangée) | Gardée. |
| LINES.soir-quatre | Brume | la quatrième nuit | Quatre, ce soir. Dors : je veille. | (inchangée) | Gardée. |

---

## 5. Le matin de Pierrot

### 5.1 La planche

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.planche-vue | Hermine | sa longue-vue | Ohé ! Là, sur la vague… une planche ! Et quelqu'un dessus ! | Ohé ! Là, sur la vague… une planche. Et quelqu'un dessus. | Un seul cri ; la découverte se dit plus bas. |
| LINES.planche-dort | Hermine | la planche échouée | Un enfant… Il dort ! La vague l'a posé tout doucement sur le sable. | Un enfant… Il dort. La vague l'a posé sur le sable, tout doucement. | Le point ôté ; la phrase finit sur la douceur. « La vague » reste : ce ne sont pas les racines (point à trancher n° 2). |
| COACH.eveil-ondin.* | aide | le réveiller | Un enfant dort sur la planche : va le réveiller doucement. / Touche « Le réveiller » : parle-lui doucement. | (inchangées) | Gardées. |

### 5.2 La scène `ondin`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| ondin.0 | Brume | `11_ondin` | Chut. Celui-là, la brume l'a bercé longtemps. | Chut. Celui-là, la brume l'a gardé longtemps. | « Bercé » était trop doux : la brume garde, et on ne sait pas pourquoi (décision 3). |
| ondin.1 | Pierrot | `11_reveil` | J'ai dormi combien de temps ? L'eau a un goût de nuage. | J'ai dormi combien de temps ? L'eau a un goût de nuage. | Gardée. |
| ondin.2 | Marcelle | `11_reveil` | Mon caneton ! Mon caneton ! | Mon caneton. | Une fois, la voix brisée : c'est plus fort que le cri répété. Humeur : émue. |
| ondin.3 | Pierrot | `11_reveil` | Tatie ? … C'est toi, Tatie ? | Tatie ? … Tu sens la soupe. Alors c'est vrai. | « Tatie », une seule fois (ton § 4.6) ; un détail concret à la place de la répétition. L'enfant qui vérifie qu'il ne rêve plus. |

### 5.3 Sa baguette, la Pluie, le Puits, le chemin

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.baguette | Pierrot | avant la Pluie | Avant, ma baguette tirait vers l'eau. Là, plus rien. Comme si on avait éteint la lumière, dedans. | (inchangée) | Gardée. |
| LINES.ruban | Brume | idem | La brume lui a pris son savoir. Le livre, lui, s'en souvient. | (inchangée) | Gardée. |
| COACH.souvenir-ondin.* | aide | la page de la Pluie | (le ruban, l'Encre offerte, les leurres) | (inchangées) | Gardées. |
| COACH.book.plans.puits-ondin | aide | le plan du Puits | Le Puits naît d'un mélange : fais naître « ${plan} » dans l'Athanor. Le ruban du Grimoire te montre quoi mêler. | Le Puits naît d'un mélange : écris « ${plan} » dans l'Athanor. Le ruban du Grimoire te montre quoi mêler. | « Écris » (décision 12). |
| COACH.book.plan | aide | un plan de chantier | Ce chantier naît d'un mélange : fais naître « ${plan} » dans l'Athanor. Suis le ruban. | Ce chantier naît d'un mélange : écris « ${plan} » dans l'Athanor. Suis le ruban. | Idem. |
| LINES.pluie-brume | Brume | la Pluie écrite | Ta Pluie tombe sur l'île. Regarde Pierrot. | (inchangée) | Gardée. |
| LINES.pluie-ondin | Pierrot | idem | Elle a frémi. Là. … Elle n'avait plus bougé depuis que j'ai rêvé de la mer. | (inchangée) | Gardée. |
| MEMORY_LINES.souvenir-ondin (`story.js`) | Pierrot | son souvenir rendu | Là ! Ça tire ! L'eau est là-dessous ! Ma baguette se souvient. | Là… Elle tire. L'eau est là-dessous. Ma baguette se souvient. | Pierrot chuchote (ton § 4.6) : la joie à voix basse, plus forte que trois cris. |
| LINES.chut | Pierrot | le Puits bâti | Chut… l'eau arrive. | (inchangée) | Gardée. |
| LINES.produit | Marcelle | idem | Ça, mon caneton, c'est de l'eau. | (inchangée) | Gardée : le surnom de Pierrot, à sa place. |
| LINES.athanor-trois | Brume | le Puits réclamé | L'Athanor s'élargit. Une place de plus. Ceux d'avant y mêlaient trois souffles, parfois… je l'avais oublié. | (inchangée) | Gardée. |
| LINES.glisse | Pierrot | les seaux | L'eau, je la porte jusqu'au feu… mais l'herbe mouillée, ça glisse ! Mes seaux se renversent. Il me faudrait un chemin. | L'eau arrive jusqu'au feu à moitié. L'autre moitié reste dans l'herbe. Elle aime bien l'herbe. | Un enfant rêveur ne décrit pas le mécanisme : il raconte l'eau comme une personne. Le besoin se comprend sans être dit. Humeur : rêveur. |
| LINES.pierres | Brume | idem | Un chemin, ça se trace : du Puits jusqu'au sentier du Feu. Les premières pierres sont offertes. | Un chemin, du Puits jusqu'au feu. L'eau arrivera entière, et l'herbe s'en remettra. | Le mode d'emploi part ; « les premières pierres sont offertes » est déjà dans l'aide (COACH.chemin.trace). |
| LINES.sentier | Pierrot | le chemin tracé | Un vrai chemin ! Mes seaux arrivent pleins. Les autres, tu les traceras où tu veux. | Un vrai chemin. Mes seaux arrivent pleins, maintenant. L'herbe va s'ennuyer. | La seconde phrase (mode d'emploi) passe à l'aide ; Pierrot, drôle sans le vouloir. |
| **COACH.chemin.libre** | aide | idem | — | Les autres chemins, trace-les où tu veux. | La liberté du tracé, dans l'aide. |
| LINES.source | Marcelle | (aucun appel trouvé dans le code) | De l'eau douce, il nous faudrait… Là-bas, au nord-ouest, une région brille encore dans la brume. Fais-la naître, et elle sera à nous. | *(supprimée)* | Plus appelée nulle part depuis que Pierrot arrive sur sa planche (vérifié dans `src/`). Si elle doit revenir (La Source à libérer), elle sera réécrite : « Fais-la naître » veut dire « achète-la ». |

---

## 6. Le Campement

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| campement.0 | Marcelle | `12_habits` | Tiens. On ne reconstruit pas une île en guenilles. | (inchangée) | Gardée. |
| campement.1 | Brume | `12_veillee` | Un, deux, trois, quatre, cinq… | (inchangée) | Gardée. |
| campement.2 | Brume | `12_veillee` | Je n'avais jamais compté plus loin qu'un. | (inchangée) | Gardée : le meilleur non-dit du jeu. |
| campement.3 | Brume | `12_veillee` | Le feu, l'eau… Il manque un toit. Et le bois flotté s'épuise déjà. | Le feu, l'eau, des lumières… Il manque un toit. Et la mer ne rendra pas du bois éternellement. | Le manque de l'acte I (le bois, bible § 10) reste annoncé, mais par une image et non par une jauge. |

---

## 7. Les bouteilles (à la fin du tutoriel)

Toutes gardées : elles sont déjà au niveau.

| Identifiant | Qui parle | Texte actuel | Verdict |
|---|---|---|---|
| LINES.bouteille-ecume | Hermine | Là, dans l'écume ! Une bouteille. La mer rend ce qu'elle a pris. | Gardée. |
| LINES.bouteille-courant | Hermine | Le courant tourne quatre fois par jour. À chaque fois, il laisse quelque chose sur nos plages. Guette-les. | Gardée. |
| LINES.bouteille-brume | Brume | Ma brume avale les navires… Ce qu'elle ne sait pas garder, la mer le recrache. Du verre, des caisses. Des mots, parfois. | Gardée : la faute (décision 7 bis). |
| LINES.bouteille-h | Brume | « H. »… Ce H, je l'ai sur le bout de la flamme. | Gardée. |
| LINES.bouteille-phare | Hermine | « Allume les lumières. » Ma grand-mère gardait un phare : elle disait pareil. | Gardée. |

---

## 8. L'onglet Défis

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| TAB_OPENED.timer | Brume | l'onglet Défis s'allume | Les Défis s'ouvrent : des énigmes contre le sablier, pour gagner des écus. Touche « Défis » quand tu veux. | Le livre a d'autres jeux. Des énigmes, contre le temps. | Brume ne nomme plus l'onglet ni les écus. |
| **COACH.tab-defis** | aide | idem | — | Les Défis : des énigmes contre le sablier, pour gagner des écus. Touche « Défis » quand tu veux. | Le mode d'emploi, dans l'aide. |

---

## 9. Les points à trancher

1. **Le folklore de Marcelle** (cannelle.3) : « Ma mère disait qu'ils mènent les gens dans les marais, et qu'on ne les revoit jamais. » C'est une ombre de plus sur Brume au moment où elle arrive ; elle se dissipe tout de suite (cannelle.3b). **Recommandé : oui.** Sinon, je garde l'idée de la réplique actuelle (« elle baisse sa louche ») sans « yeux de chiot ».
2. **La planche de Pierrot** : « La vague l'a posé sur le sable, tout doucement. » Depuis la décision 3, on pourrait faire deviner une racine sous la planche. **Je recommande non** : les racines appartiennent à ce qui dort sous l'île, et une racine qui sauve un enfant brouillerait la menace. La vague reste une vague.
3. **Le fanal du Ponton** (ponton-promesse : « Une lumière de plus sur la plage. Ça fait deux. ») suppose que le Ponton porte une lumière. Si le dessin n'en a pas, je propose : « Un ponton. La mer a un chemin pour revenir, maintenant. »

---

## 10. Pour l'autre agent (rien n'est à intégrer avant le « oui » de l'auteur)

- Une image nouvelle (`10_epave`) et une bulle nouvelle en tête de la scène `recolte` (une pensée).
- Une bulle nouvelle dans la scène `cannelle` (cannelle.3b).
- Des lignes d'aide nouvelles : `COACH.recolte.regle` (si la Récolte n'affiche pas déjà sa règle), `COACH.bulle-besoin`, `COACH.chemin.libre`, `COACH.tab-defis`.
- Supprimées : `COOKING.plouf`, `HEN_CHASE.squawk`, `LINES.source` (déjà sans appel).
- Les boutons « C'est parti ! » deviennent « Commencer ».
- Une forme double : `bois-ponton` (« naufragé|naufragée »).
