# Lot 04 — Les maîtres

> Ce lot donne à chaque maître sa voix partout où il parle : son arrivée, son souvenir, son passé cœur par cœur, ses cadeaux, son Savoir, ses paroles de travail et de temps, ses besoins, et les liens joués aux veillées.
> - Le lot 04 prévu (« les maîtres et le village ») est **coupé en deux** pour rester lisible : ce lot-ci (les maîtres), puis le **lot 05, le village** (voyageurs, Anya, Héliane, lieux, familiers, Brume aux moments clés, onomatopées, fêtes). La bible devient le lot 06.
> - Les textes ont été rangés par l'autre agent dans `src/texts/` (sans changer un mot, vérifié pour `world/friends.js`). Les chemins de ce lot sont les nouveaux.
> - Décisions appliquées : `ton.md` § 0 (15, 16, 17, 20), les fiches de voix (`ton.md` § 4.3 à § 4.9), et le lot 03 validé (point 2 : Robby reconnaît les mots du Dormeur).
> - **Validé par l'auteur le 15 octobre**, avec les trois recommandations du § 10 : une voix par maître dans les répliques communes, « Hm. Morte. Pas finie. », et « Jamais. ».

---

## 1. Les arrivées (`src/texts/story.js`, `WRECK_TEXTS`)

Brume les dit quand s'ouvre la quête de l'acte. Maerys et Robby sont d'anciens naufragés : pas de naufrage pour eux (bible § 6.7 ; accord de l'auteur, 14 oct.).

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| WRECK_TEXTS.lisiere | Brume | l'acte I s'ouvre | Cette nuit, un autre bateau s'est brisé… Un radeau de bois flotté, à l'ouest. | Là-bas, à la lisière, une lueur entre les arbres. Pas une lanterne. Quelqu'un vit là, je crois. | Contre la v6, il n'y a pas de naufrage : une découverte. La lueur annonce Maerys ; la queue rousse de Mousse fera le reste. |
| WRECK_TEXTS.colline | Brume | l'acte II s'ouvre | Cette nuit, un autre bateau s'est brisé… Un caboteur chargé de pierres, au nord-est. | Écoute… Du côté de la Colline. Quelqu'un taille la pierre. Il y a longtemps qu'on n'entendait plus ça. | On l'entend avant de le voir (bible § 8.2). « Il y a longtemps » : Brume se souvient d'avant, sans savoir quoi. |
| WRECK_TEXTS.jardins | Brume | l'acte III s'ouvre | Cette nuit, un autre bateau s'est brisé… Une barque pleine de graines, au nord. | Cette nuit, un autre bateau s'est brisé dans ma brume. Une barque pleine de graines, au nord. | Le seul vrai naufrage (Maggy). « Dans ma brume » : la faute grandit (décision 7 bis). |

---

## 2. Les souvenirs (`src/texts/story.js`, `MEMORY_LINES`)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| souvenir-sylve | Maerys | l'Arbre écrit | Arbre… Je me souviens. Ma forêt. Mes mains savent planter. | (inchangée) | Gardée : déjà « peu de mots, jamais faux ». |
| bosquet | Maerys | son Bosquet planté | Mon Bosquet garde le bois mort pour toi. À la Récolte, chaque bûche comptera double. | Mon Bosquet garde le bois mort pour toi. | Validée le 14 oct. ; seule la règle part, dans l'aide. |
| **COACH.bosquet-recolte** | aide | idem | — | À la Récolte, le bois compte double. | La règle, dans l'aide. |
| souvenir-galet | Robby | la Pierre écrite | Hm. (Brume : “Il dit qu'il se souvient de la pierre. Et qu'il a faim.”) Hm ! | Hm. *(Brume : « Il dit qu'il se souvient de la pierre. Et qu'il a faim. »)* Hm. | La forme de la traduction partout la même : didascalie, guillemets français. Le second « Hm » sans point d'exclamation : il proteste à voix basse. |
| eveil-melisse | Maggy | son réveil | Tes pages m'ont réveillée avant toi. La Plante… je m'en souviens. | (inchangée) | Gardée. |
| souvenir-aster | Lorena | le Bateau écrit (acte IV) | Un bateau… Par tous les alizés, je sais encore tenir une barre ! | Un bateau. *(Elle pose les mains sur la barre.)* Elles ne tremblent pas. | Le courage qui revient, montré et non dit. C'est l'un des grands moments de l'acte IV. |

---

## 3. Le passé, cœur par cœur (`src/texts/world/friends.js`, `TALKS`)

Une réplique par cœur (0 à 5). Celles qui ne changent pas sont listées en bas de chaque tableau.

### 3.1 Maggy

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 2 | Cette boîte ? Des graines. Chaque chose en sa lune : celles-ci attendent depuis longtemps. Elles savent pourquoi. | Cette boîte ? Des graines. Elles attendent depuis longtemps. Elles savent pourquoi, elles. | Le proverbe plaqué part ; « elles, » laisse entendre que Maggy, elle, ne sait pas encore (son secret, acte VI). |

Gardées : 0 (« Une graine, ça a de la mémoire. Plus que nous. »), 1 (les fèves boudeuses), 3 (les graines étranges), 4 (la lune et les radis), 5 (« Je suis revenue planter ici ce qui en était parti. »).

### 3.2 Robby

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 0 | Hm. (Brume : “Il dit bonjour. Je crois.”) | Hm. *(Brume : « Il dit bonjour. Je crois. »)* | La forme seulement. |

Gardées : 1 à 5, le meilleur du jeu.

### 3.3 Maerys (décision 15 : peu de mots, jamais faux ; ses phrases s'allongent avec les cœurs)

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 0 | Chut ! Arbres… réveillent. Toi entends ? | Chut. Les arbres se réveillent. Tu entends ? | Sa première réplique, juste. |
| 1 | Ma forêt. Grande. Verte. Arbres parlaient. Toi… écoute aussi, un peu. | Ma forêt était grande. Les arbres y parlaient. Toi, tu écoutes un peu, déjà. | Deux phrases au lieu de mots jetés : la parole revient. |
| 2 | Le feu a mangé ma forêt. Tout. Moi, courir jusqu'à la mer. Le feu… méchant. | Ma forêt a brûlé. J'ai couru jusqu'à la mer. *(Elle ne regarde pas le feu.)* | « Méchant » était enfantin ; la peur se voit dans le regard qu'elle détourne. |
| 3 | Radeau de bois flotté, je l'ai fait. Il s'est cassé ici. Les arbres de l'île m'ont attrapée. | J'ai fait un radeau de bois flotté. Il s'est cassé ici. Les arbres de l'île m'ont attrapée. | « M'ont attrapée » reste : les arbres de l'île, du côté d'Anya, pas les racines noires (décision 3, lot 03). |
| 4 | Je me cache parce que les gens font du bruit, coupent, brûlent. Toi, non. Toi, tu écoutes. | Les gens font du bruit. Ils coupent, ils brûlent. *(Un temps.)* Toi, tu écoutes. | Elle n'explique plus pourquoi elle se cache : elle dit les faits, et le silence fait le reste. |

Gardée : 5 (« Ici, c'est ma forêt. Et vous, ma meute. »).

### 3.4 Léo

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 2 | Chut… La lune m'a parlé. Elle dit que tu ne dors pas assez. Elle a raison, non ? | La lune m'a parlé, cette nuit. Elle dit que tu ne dors pas. Je ne lui ai pas répondu non plus. | Plus étrange, plus juste (ton § 4.6). |

Gardées : 0, 1, 3, 4, 5.

### 3.5 Lorena

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 0 | Ohé ! Ce nuage-là, je l'appelle Grognon. Cap au nord : il pleuvra avant midi ! | Ce nuage-là, ma grand-mère l'appelait le Voleur. Il prend la lumière et il la garde. Pluie avant midi. | « Grognon » était une mignonnerie ; les noms des nuages viennent de sa grand-mère, la gardienne de phare. |
| 2 | Je voulais faire le tour du monde. Cap à l'ouest, toujours ! L'île, c'était pas prévu. Mais j'aime l'imprévu. | Je voulais faire le tour du monde. Cap à l'ouest, toujours. L'île n'était pas sur ma route. … Elle y est, maintenant. | La formule finale part ; le silence dit qu'elle s'attache. |
| 4 | J'étais à la barre, la nuit de l'Hirondelle. La brume est venue d'un coup. Depuis, je ne sais plus tenir une barre. | J'étais de quart, cette nuit-là. La brume est venue d'un coup. *(Elle regarde ses mains.)* Je ne tiens plus une barre. | Montré plutôt que dit. Ses mains reviennent à l'acte IV (souvenir-aster). |

Gardées : 1 (Zéphyr qui ment), 3 (le frère perdu), 5 (« Je reste. La mer peut attendre. »).

### 3.6 Nathan (décision 16 : un « clic » rare)

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 0 | Montre-moi tes mains. Hum. On va arranger ça. Clic ! | Montre-moi tes mains. … Des mains d'horloger. Il ne leur manque que la patience. | Le « Clic ! » part ; un regard d'artisan à la place. |
| 1 | Enfant, j'ai réparé l'horloge de mon village. Elle avançait de dix minutes. Moi aussi, j'avance. Tac ! … Non ? | Enfant, j'ai réparé l'horloge de mon village. Elle avançait de dix minutes. Moi aussi, j'avance. … Non ? | Le jeu de mots raté reste, sans le « Tac ! » qui le soulignait. |
| 2 | Mes automates servaient le thé. Attends… Non. Si ! Si ! Ils le renversaient aussi. Clic, clic. | Mes automates servaient le thé. Attends… Non. Si. Ils le renversaient aussi. Mais avec élégance. | Son tic (« Attends… Non. Si. ») reste ; la chute est une phrase, pas un bruit. |
| 4 | Je suis parti quand plus personne n'a osé me confier une horloge. Ici, tu me confies tout. Tac. | Je suis parti quand plus personne n'a osé me confier une horloge. Ici, tu me confies tout. | Le « Tac. » part. |

Gardées : 3 (l'incendie), 5 (« Presque tout peut se réparer. Même moi. »).

### 3.7 Agathe (décision 17 : « mon caneton » pour Léo seul)

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 0 | Mon caneton ! Tu as mangé ? Non ? Ce qui mijote ne se presse pas, mais toi, assieds-toi ! | Tu as mangé ? Non ? Ce qui mijote ne se presse pas. Toi, si : assieds-toi. | « Mon caneton » est à Léo ; le proverbe retourné garde son humour. |

Gardées : 1 (l'auberge), 2 (Léo et ses parents), 3 (les feux follets), 4 (le goût perdu, avec la troisième « brindille », émue), 5.

---

## 4. Les cadeaux (`src/texts/world/friends.js`, `LOVED`, `LIKED`, `OTHER`)

Aujourd'hui, `LIKED` et `OTHER` sont une seule phrase pour tout le monde. Je propose une phrase par maître (point à trancher n° 1), et une phrase commune réécrite pour les voyageurs installés.

### 4.1 Ce qu'ils adorent (`LOVED`)

| Maître | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| Maggy | De l'eau de pluie ? Mes laitues vont te remercier elles-mêmes. Écoute-les. | (inchangée) | Gardée. |
| Robby | Hm ! (Brume : “Il dit que c'est son plat préféré.”) Hm ! | Hm ! *(Brume : « Il dit que c'est son plat préféré. »)* Hm. | La forme ; le second « Hm » plus bas. |
| Maerys | Eau ! Arbres boivent. Merci… ami. | De l'eau. Les arbres vont boire. … Merci. | Décision 15 ; « ami » retiré : le merci, après un temps, suffit. |
| Léo | De l'eau ! Chut… elle dit merci. Moi aussi. | (inchangée) | Gardée. |
| Lorena | Du bois ! Par tous les alizés, de quoi radouber ma barque. Cap sur le ponton ! | Du bois ! Par tous les alizés, de quoi radouber ma barque. | Un tic par bulle suffit. |
| Nathan | De la pierre ! Attends… Non. Si ! Si ! Une meule pour mes engrenages. Clic ! | De la pierre ! Attends… Non. Si. Une meule pour mes engrenages. | Le « Clic ! » part. |
| Agathe | Des provisions ! Ce qui se partage ne se perd pas. Merci, mon caneton ! | Des provisions ! Ce qui se partage ne se perd pas. Merci. | « Mon caneton » est à Léo. |

### 4.2 Ce qu'ils aiment (`LIKED`, une par maître)

| Maître | Texte actuel (commun) | Texte proposé | Intention |
|---|---|---|---|
| Maggy | Oh, merci ! C'est gentil d'avoir pensé à moi. | Merci. Je vais lui trouver une place. Tout a sa place, même ce qu'on n'attendait pas. | Sa lenteur, son jardin. |
| Robby | idem | Hm. *(Brume : « Il dit merci. Vraiment. »)* | — |
| Maerys | idem | Pour moi ? … Merci. | La surprise de quelqu'un qu'on n'a pas gâté depuis longtemps. |
| Léo | idem | Merci. Je le mettrai à côté de mon bocal. | Le bocal vide de Bulle. |
| Lorena | idem | Merci ! Ça ira dans la caisse. Tout finit dans la caisse. | Sa caisse repêchée. |
| Nathan | idem | Merci ! Je ne sais pas encore à quoi ça sert. C'est le meilleur moment. | Sa curiosité. |
| Agathe | idem | Merci. Ça ira dans la soupe. Tout va dans la soupe. | Son tic. |
| voyageurs (commun) | idem | Merci. C'est gentil d'avoir pensé à moi. | Le même sens, sans les deux exclamations. |

### 4.3 Un autre cadeau (`OTHER`, une par maître)

| Maître | Texte actuel (commun) | Texte proposé | Intention |
|---|---|---|---|
| Maggy | C'est… pour moi ? Merci, c'est l'intention qui compte ! | Curieux cadeau. J'aime les choses curieuses. | Pince-sans-rire. |
| Robby | idem | Hm ? *(Brume : « Il se demande ce qu'il va en faire. Il te remercie quand même. »)* | — |
| Maerys | idem | … Merci. *(Elle le pose sans savoir quoi en faire.)* | — |
| Léo | idem | C'est pour moi ? Je vais le montrer à la lune. | — |
| Lorena | idem | Ça ? Bon. On trouvera bien à quoi ça sert, en mer. | — |
| Nathan | idem | Je vais le démonter. Pour comprendre. Tu ne m'en veux pas ? | Il démonte tout pour comprendre (bible § 8.2). |
| Agathe | idem | C'est l'intention qui compte. L'intention, ça ne se mange pas, mais je la garde. | La formule commune reprise, à sa façon. |
| voyageurs (commun) | idem | Pour moi ? Merci. | Sobre. |

---

## 5. Les Savoirs (`src/texts/game/savoirs.js`)

Au premier bavardage du jour, le maître souffle un indice. La phrase se compose ainsi : « *ouverture* sur une page du chapitre I, *ce qui est soufflé*. C'est noté au Grimoire. » Seules les ouvertures portent la voix ; le reste est de l'aide, et reste tel quel.

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| openers.ponton | Lorena | Le vent me l'a soufflé : | Le vent me l'a dit : | « Soufflé » se répète avec le Souffle. |
| openers.foyer | Agathe | Goûte-moi ça, ma brindille : | Une recette, rien que pour toi : | Le surnom part ; le Savoir dit comme une recette. |
| openers.atelier | Nathan | Tac ! Calcul fait : | Attends… Si. J'ai trouvé : | Son tic, sans le « Tac ! ». |
| openers.puits | Léo | Chut… l'eau me dit : | (inchangée) | Gardée. |
| openers.bosquet | Maerys | Feuilles disent : | Les feuilles disent : | Décision 15. |
| openers.carriere | Robby | Hm. (Brume traduit :) | Hm. *(Brume traduit :)* | La forme. |
| openers.potager | Maggy | La lune me souffle : | La lune me l'a dit, cette nuit : | Idem Lorena ; « cette nuit » : sa vie la nuit. |
| openers.brume | Brume | Psst… le Grimoire me l'a dit : | Le livre m'a soufflé quelque chose : | « Psst » part. Brume ne sait pas lire : le livre lui « souffle », il ne lui « dit » pas. |
| opener, art, ingredient, family, line | aide | (les consignes) | (inchangées) | Gardées. |

---

## 6. Au travail, et le temps qu'il fait (`src/texts/village.js`)

### 6.1 Les paroles de travail (`WORK_LINES`)

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| potager.0 | Maggy | Chaque chose en sa lune. Les carottes aussi. | (inchangée) | Gardée. |
| potager.1 | Maggy | Tu entends ? Les courges se disputent encore. | Les courges ne se parlent plus depuis mardi. Tu sais ce qu'elles ont ? | Plus sec, et une question (ton § 4.9). |
| carriere.* | Robby | Hm. / Hm. Belle pierre. | (inchangées) | Gardées. |
| bosquet.0 | Maerys | Chut. Arbre dort. | Chut. L'arbre dort. | Décision 15. |
| bosquet.1 | Maerys | Graine, pousse… pousse… | Allez. Pousse. Je t'écoute. | Elle chante aux graines (bible § 8.2) ; mièvrerie et grammaire cassée retirées. |
| puits.* | Léo | Chut… l'eau parle. / Ma baguette tremble. Il y a de l'eau là-dessous. | (inchangées) | Gardées. |
| ponton.0 | Lorena | Vent d'ouest ! Ça mord, aujourd'hui ! | Vent d'ouest. Ça mord, aujourd'hui. | Les deux points d'exclamation partent. |
| **ponton.1** | Lorena | — | Mer d'huile. Je n'aime pas ça. Elle prépare quelque chose. | Lorena n'avait qu'une réplique. Celle-ci : la menace douce, dite par quelqu'un qui connaît la mer. |
| atelier.0 | Nathan | Clic… tac… Attends. Voilà ! | Attends. Voilà. … Non. Attends. | Les bruits partent ; il ne finit jamais. |
| atelier.1 | Nathan | Encore une vis et ça tourne. Tac ! | Encore une vis et ça tourne. … Clic. | Le seul « clic » permis : la pièce qui tient (décision 16). |
| foyer.0 | Agathe | Ce qui mijote ne se presse pas ! | Ce qui mijote ne se presse pas. | Un proverbe se dit sans s'exclamer. |
| foyer.1 | Agathe | Goûte-moi ça, ma brindille. Alors ? | Goûte-moi ça. Alors ? Dis-moi franchement. | Le surnom part ; « Dis-moi franchement » : elle ne sent plus rien, et elle a besoin qu'on le lui dise (le goût perdu, sans le dire). |

### 6.2 Le temps qu'il fait (`VILLAGER_SAYS`)

Aujourd'hui, une réplique commune à tous les habitants efface leurs voix. Je propose une réplique par maître pour chaque temps (point à trancher n° 1), et une réplique commune réécrite pour les voyageurs.

| Maître | Orage | Pluie | Soir | Aube |
|---|---|---|---|---|
| **actuel (commun)** | L'orage gronde, mieux vaut rentrer ! | Quel temps ! Heureusement, j'ai mon parapluie. | Belle soirée… je rentre au Foyer. / Les étoiles sont de sortie. | Bonjour ! Le jour se lève sur l'île. |
| Lorena | Celui-là vient de loin. Rentre tes affaires, on aura un coup de vent. | Pluie de mer. Elle sent le sel et la route. | Le vent tombe avec le soleil. Il reviendra au matin, il revient toujours. | Ciel rouge au matin… Ma grand-mère n'aurait pas pris la mer. |
| Agathe | Ferme les volets de ma cuisine, tu veux ? L'orage, ça fait tourner le lait. | Il pleut. Tant mieux : la soupe a meilleur goût sous la pluie. On me l'a dit. | Ce soir, on mange chaud. Comme tous les soirs. | Debout. La marmite n'attend personne. |
| Nathan | Un orage, c'est de l'énergie gaspillée. Si seulement… Attends. Non. | La pluie rouille tout. Sauf mes idées. | Le soir, je démonte. Le matin, je remonte. Entre les deux, je rêve. | Le soleil se lève à l'heure. C'est bien le seul. |
| Léo | L'eau du ciel est en colère. Elle se calmera dans mon puits. | Chut… Tu entends ? Tout le ciel tombe dans mon puits. | La lune arrive. Elle va me raconter sa journée. | J'ai rêvé d'un poisson qui savait lire. … C'était peut-être vrai. |
| Maerys | Les arbres ont peur. Je reste avec eux. | La pluie. Les racines boivent. Écoute. | La forêt s'endort. Moi, pas encore. | Les oiseaux d'abord. Puis moi. |
| Robby | Hm. Orage. *(Il ne bouge pas d'un pouce.)* | Hm. La pierre aime la pluie. | Hm. Bonne journée de pierre. | Hm. |
| Maggy | L'orage arrose sans demander. Mes laitues n'aiment pas qu'on les brusque. | Il pleut. Mes radis vont être insupportables. | La lune monte. C'est l'heure des choses qui poussent sans qu'on les regarde. | Le matin, les plantes sont honnêtes. Après, elles font semblant. |
| voyageurs (commun) | L'orage arrive. Mieux vaut se mettre à l'abri. | Il pleut sur toute l'île. | Le soir tombe. Les lanternes s'allument. | Le jour se lève. |

Intentions : chaque réplique tient le caractère (ton § 4) ; Agathe, « On me l'a dit » : elle ne goûte plus, elle répète ce qu'on lui dit (le non-dit de l'acte V) ; Lorena, « Ciel rouge au matin » : sa grand-mère, encore ; plus de parapluie sur une île de naufragés.

| Identifiant | Qui | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| VILLAGER_SAYS.asleep | habitant endormi | Zzz… | *(supprimée)* | Onomatopée ; la pose « endormi » et les « z » dessinés suffisent. |

---

## 7. Les besoins (`src/texts/world/needs.js`, `ASKS`, `THANKS`)

Même défaut : une phrase commune (« J'ai un petit creux… »). Je propose une phrase par maître (point à trancher n° 1). Les états de la fiche (`NEED_STATE`) sont de l'aide : gardés.

| Maître | Manger | Outils | Créations autour | Merci (manger) | Merci (outils) |
|---|---|---|---|---|---|
| **actuel (commun)** | J'ai un petit creux… Tu n'aurais pas de quoi manger ? | Mes outils sont tout usés. Il m'en faudrait des neufs. | C'est un peu triste, autour de chez moi. Quelques créations de l'établi ? | Merci ! Ça tombait bien, j'avais un creux. | Des outils neufs ! Le travail va filer tout seul. |
| Lorena | On ne navigue pas le ventre vide. Tu as quelque chose ? | Mes nœuds lâchent, mes outils aussi. Il me faudrait du neuf. | Mon ponton est tout nu. Un peu d'allure autour ? Pour les bateaux qui passent. | Merci. Cap sur la suite. | Du neuf ! La mer n'a qu'à bien se tenir. |
| Agathe | La cuisinière a faim. Ça arrive, figure-toi. | Ma louche a rendu l'âme. Pas ma meilleure, mais quand même. | Une cuisine, ça se soigne. Quelques jolies choses autour, tu veux bien ? | Merci. Ce qui se partage ne se perd pas. | Une louche neuve. Je vais faire des miracles. Des petits, mais des miracles. |
| Nathan | Mon estomac fait un bruit de roue voilée. Tu aurais quelque chose ? | Mes outils sont usés jusqu'à l'âme. On ne répare rien avec rien. | Un atelier sans rien autour, c'est triste. Même les vis s'ennuient. | Merci. La machine repart. | Des outils neufs. Attends… Si. Je vais tout refaire. |
| Léo | Mon ventre fait le bruit de l'eau dans un puits vide. | Ma corde s'effiloche. Le seau va finir au fond. | Autour du puits, c'est vide. L'eau aimerait avoir de la compagnie. | Merci. Chut… mon ventre dit merci aussi. | Une corde neuve. Le seau ne tombera plus. Enfin, moins. |
| Maerys | J'ai faim. Tu as quelque chose ? | Mon couteau ne coupe plus le bois mort. | Autour de mon bosquet, rien ne fleurit. Tu m'aides ? | Merci. *(Elle mange en regardant les arbres.)* | Il coupe de nouveau. Le bois mort, seulement. |
| Robby | Hm. *(Brume : « Il a faim. Il ne le dira pas deux fois. »)* | Hm. *(Brume : « Son ciseau est usé. Il en voudrait un neuf. »)* | Hm. *(Brume : « Il trouve ça nu, autour de sa carrière. Il ne se plaint pas. Il constate. »)* | Hm. | Hm ! *(Brume : « Ça, c'est un vrai merci. »)* |
| Maggy | Mes plantes mangent bien. Moi, moins. Curieux, non ? | Ma bêche est fatiguée. On l'est tous un peu, en fin de saison. | Un jardin, ça a besoin de voisins. Quelques belles choses autour ? | Merci. Je vais manger lentement. Chaque chose en sa lune. | Une bêche neuve. Les vers de terre vont m'en vouloir. |
| voyageurs (commun) | J'ai faim. Tu aurais de quoi manger ? | Mes outils sont usés. Il m'en faudrait des neufs. | C'est un peu nu, autour de chez moi. Quelques créations, peut-être ? | Merci, ça tombait bien. | Des outils neufs. Merci. |

Intention : « petit creux » part (diminutif) ; chaque besoin dit le caractère. Robby a besoin de Brume pour se plaindre, et il ne se plaint pas.

---

## 8. Les veillées (`src/texts/game/vigils.js`)

### 8.1 Les liens, joués et non plus résumés

Aujourd'hui, chaque lien n'est qu'une phrase de narration (`LINKS.*.text`). Je propose de garder cette phrase comme légende de l'image, et d'y ajouter deux à cinq répliques (`lines`), comme le font déjà « La Vie à quatre », « L'enclume » et « Le pardon ». Chaque lien tient en six bulles au plus.

| Lien | Acte | Légende (texte actuel, gardé) | Répliques proposées | Intention |
|---|---|---|---|---|
| La soupe et la source (Agathe, Léo) | I | Agathe gronde Léo parce qu'il dort debout ; il lui promet l'eau la plus claire de l'île. | Agathe : « Léo. Tu dors debout. » / Léo : « Je ne dors pas. J'écoute l'eau. » / Léo : « Demain, je te trouverai l'eau la plus claire de l'île. Pour ta soupe. » / Agathe : « … Va dormir, mon caneton. » | Il veut lui rendre ce qu'elle lui donne ; elle ne sait pas répondre à la tendresse autrement qu'en l'envoyant au lit. |
| La feuille et la flamme (Maerys, Agathe) | II | Maerys a peur du feu ; Agathe lui montre le feu qui nourrit. | Agathe : « Approche. Il ne mord pas. Il cuit. » / Maerys : « Ma forêt, il l'a mangée. » / Agathe : « Celui-là, il nourrit. » *(Elle lui tend un bol.)* / *(Maerys le prend, sans regarder les flammes.)* | La peur ne part pas d'un coup : elle prend le bol, pas encore le feu. À l'acte VI, c'est elle qui allumera la flamme. |
| Le bois et la pierre (Maerys, Robby) | II | Maerys refuse qu'on coupe ses arbres ; Robby lui montre le bois mort et le métal qui l'aide : l'Abri tient. | Maerys : « On ne coupe pas mes arbres. » / Robby, une branche tombée à la main : « Hm. » / Maerys : « … Celle-là est morte depuis l'hiver. » / Robby : « Hm. Morte. Pas finie. » | Robby parle peu, et sa seule phrase est la clé (le bois mort, choix de l'auteur du 14 oct.). |
| L'enclume (Robby, Nathan) | III | Nathan forge le premier vrai ciseau de Robby. | (gardées) Robby : « Hm. » / Brume : « Il dit merci. » | Gardé. |
| Le premier fruit (Maerys, Maggy) | III | La forêt et le jardin plantent ensemble. | Maggy : « Ton arbre a des fleurs. Mon jardin a des abeilles. Tu crois qu'ils se connaissent ? » / Maerys : « Pas encore. » / Maggy : « Chaque chose en sa lune. Celle-ci est la bonne. » | Deux silences qui se comprennent ; le proverbe de Maggy, enfin à sa place. |
| Apprendre à nager (Lorena, Léo) | IV | Léo a peur de l'eau profonde ; Lorena lui apprend. | Léo : « L'eau profonde, elle ne me parle pas. Elle se tait. » / Lorena : « Alors on va lui parler, nous. Donne-moi la main. » / Léo : « Tu ne me lâches pas ? » / Lorena : « Jamais. » | « Jamais » : celle qui croit avoir lâché la barre promet de ne plus rien lâcher. Le non-dit de sa faute. |
| La grande tablée (Agathe et tous) | V | Une table pour tous ; on y choisit le nom du peuple. | Agathe : « Une table. Douze places, comme à mon auberge. On en ajoutera. » / Lorena : « Il lui faudrait un nom, à cette table. » / Maggy : « À ce peuple, plutôt. Non ? » | Le nom du peuple vient de la table, et c'est Maggy qui pose la question. Suit le choix du nom. |
| Le pardon (tous, Brume) | VI | Chacun tend son Souffle vers Brume. | (gardée) Tous : « Ta flamme, notre vie. » | Gardé. |

### 8.2 Les autres répliques des veillées

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| LINES.I | Brume | Chaque lumière repousse la brume. Allumons-les toutes. | Une. Hier, il n'y en avait aucune. / Allumons-les toutes. Que la mer sache qu'on est là. | La version de la bible : Brume compte. |
| LINES.III (Maggy) | Maggy | Trois naufrages en une saison… Il y a quelque chose, avec cette île. | Deux naufrages en une saison. Et des naufragés d'avant, qui vivaient déjà là. Ça ne vous étonne pas ? | Juste avec la v6 (l'Hirondelle et la barque de Maggy ; Maerys et Robby, déjà là). Suivie de « Brume baisse les yeux. » (gardé). |
| FINALE.phare | narration | Tout en haut du phare, Nathan monte la lentille. « Tac ! Elle tient. » | Tout en haut du phare, Nathan monte la lentille. « Clic. Elle tient. » | Le « clic » le plus juste du jeu (décision 16). |

---

## 9. Robby et les mots du Dormeur (nouveau ; lot 03, point 2 validé)

| Identifiant | Qui parle | Où | Texte proposé | Intention |
|---|---|---|---|---|
| **LINES.dormeur-runes** (1) | Robby | au matin d'une nuit où un Dormeur s'est endormi contre une clôture, Robby présent, acte III ou plus ; une seule fois | Hm. Celui qui dort contre tes piquets. Il parle en dormant. | Robby parle sans Brume : c'est rare, donc ça pèse. |
| **LINES.dormeur-runes** (2) | Robby | idem | Hm. Ce sont les mots des pierres. | Il reconnaît la langue des runes des Anciens : la graine de l'acte VI (le Voile a pris les mots des Anciens). Rien d'autre n'est expliqué. |

---

## 10. Les points tranchés (15 octobre : oui aux trois recommandations)

1. **Une voix par maître dans les répliques communes** (cadeaux, temps qu'il fait, besoins : § 4.2, § 4.3, § 6.2, § 7). Aujourd'hui, une phrase commune sert à tous et efface les voix. Brancher une phrase par maître demande à l'autre agent de choisir la phrase selon le personnage (la phrase commune reste pour les voyageurs). **Recommandé : oui.** Sinon, je garde seulement les phrases communes réécrites.
2. **Le bois mort de Robby** : « Hm. Morte. Pas finie. » est la seule phrase entière de Robby dans un lien. **Recommandé : oui** ; elle donne son sens au choix de l'auteur du 14 octobre (le bois mort, jamais un arbre abattu).
3. **« Jamais. »** (Lorena, « Apprendre à nager ») touche à sa faute avant l'acte VI, sans la dire. **Recommandé : oui.** Sinon : « Promis. »

---

## 11. Pour l'autre agent (rien n'est à intégrer avant le « oui » de l'auteur)

- `WRECK_TEXTS.lisiere` et `.colline` ne parlent plus de naufrage.
- Une ligne d'aide nouvelle : `COACH.bosquet-recolte`.
- Si le point 1 est validé : `LIKED`, `OTHER`, `VILLAGER_SAYS` et `ASKS` / `THANKS` deviennent des tables par maître (la clé du bâtiment, comme `TALKS`), avec la phrase commune en repli.
- Une réplique de travail de plus pour Lorena (`ponton.1`) ; `VILLAGER_SAYS.asleep` supprimée.
- Les liens des veillées reçoivent des `lines` (§ 8.1) ; leur `text` reste comme légende.
- Une réplique nouvelle, `dormeur-runes` (§ 9), avec sa condition.
