# Lot 05 — Le village

> Ce lot reprend tout le texte du village qui n'est pas aux maîtres : Brume aux moments clés, les voyageurs, Anya, Héliane, le secret de Brume, les lieux remarquables, les familiers, les fêtes, les bruits des mini-jeux, les cris des bêtes, le camp et les mélanges ratés.
> - Chemins : `src/texts/` (rangement de l'autre agent).
> - Décisions appliquées : `ton.md` § 0, en particulier 3 (ce qui dort sous l'île), 11, 12, 18, et les deux décisions du 15 octobre : **23** (mini-jeux : bruits gardés, interjections retirées) et **24** (cris des bêtes sur l'île : une didascalie sobre).
> - Règle constante du lot : quand Brume disait le mode d'emploi, sa réplique garde ce qu'elle voit, et **une ligne d'aide** (sans nom) dit le geste (ton § 3.3). Ces lignes d'aide sont nouvelles : l'autre agent les affiche sous la bulle de Brume.
> - **Validé par l'auteur le 15 octobre**, avec les cinq recommandations du § 13 (« Plouf ! » et « Cot ! » rétablis, les voyageurs vouvoient, la dernière rune, la dernière lettre d'Héliane, les lignes d'aide sous Brume).

---

## 1. Brume aux moments clés (`src/texts/guide/tips.js`)

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| grimoire | Brume | Sept chapitres… et presque tout dort encore. Les pages qui frémissent, tu sais déjà les écrire. Cherche-les. | (inchangée) | Validée le 13 oct. |
| reach | Brume | Oh… cette page frémit. Ce qu'elle cache, tu le connais déjà un peu. Lis l'indice, puis dépose les bons éléments dans l'Athanor. | Oh… cette page frémit. Ce qu'elle cache, tu le connais déjà un peu. | Elle remarque ; l'aide dit le geste. |
| **reach (aide)** | aide | — | Lis l'énigme, puis dépose les bons éléments dans l'Athanor. | — |
| fail | Brume | Pas encore… Moi aussi, je cherche longtemps mes mots. Les familles notées sur la page montrent la voie ; l'Encre révèle un ingrédient, et le nom se devine lettre par lettre. | Pas encore… Moi aussi, je cherche longtemps mes mots. | La meilleure phrase reste seule. |
| **fail (aide)** | aide | — | Les familles notées sur la page montrent la voie ; l'Encre révèle un ingrédient ; le nom se devine lettre par lettre. | — |
| annexes | Brume | Ton bâtiment a grandi… il déborde presque ! Autour de lui, il y a de la place pour des champs, des filons, des viviers. Ouvre sa fiche, onglet Annexes, et pose-les toi-même : ce sont eux qui produisent le plus. | Ton bâtiment a grandi. Il déborde presque. Autour de lui, il y a de la place pour des champs, des filons, des viviers. | Brume voit ; elle ne nomme plus l'onglet. |
| **annexes (aide)** | aide | — | Fiche du bâtiment, onglet « Annexes » : pose-les toi-même. Ce sont elles qui produisent le plus. | — |
| friends | Brume | Ils ont tous un prénom, tu as vu ? Et des goûts, et des manies. Bavarde avec eux chaque jour… Garde le doigt appuyé sur l'un d'eux pour ouvrir sa fiche. | Ils ont tous un prénom, tu as vu ? Et des goûts, et des manies. | La remarque de Brume, juste. |
| **friends (aide)** | aide | — | Bavarde avec eux chaque jour, offre-leur ce qu'ils aiment : un cœur de plus, une histoire de plus. Appui long : leur fiche. | — |
| savoirs | Brume | Les maîtres se souviennent de choses que j'ai oubliées. Au premier bavardage du jour, chacun souffle un indice… Plus vous êtes proches, plus il est précis. | Les maîtres se souviennent de choses que j'ai oubliées. | Le non-dit : Brume a oublié. |
| **savoirs (aide)** | aide | — | Au premier bavardage du jour, un maître souffle un indice sur une page de son chapitre. Plus vous êtes proches, plus il est précis. | — |
| bulle | Brume | Regarde le bocal de Pierrot… Bulle est revenu ! Tu vois ? Ce qu'on écrit renaît vraiment. | Regarde le bocal de Pierrot. / … Bulle est revenu. | La morale part : le joueur la tire seul. Deux bulles, un temps entre les deux. |
| bestiaire | Brume | Quelque chose bouge, là-bas… La bête que tu as écrite vit maintenant sur l'île. Cherche-la ! Le Carnet d'explorateur garde le Bestiaire. | Quelque chose bouge, là-bas… C'est la bête que tu as écrite. | — |
| bestiaireSylve | Freya | Bêtes… réveillées ! Bête fabriquée, bête vit. Arbres, eau, ciel : regarde. Le Carnet garde le Bestiaire. | Elle est là. Celle que tu as écrite. Elle boit au ruisseau. | Décisions 12 et 15. |
| **bestiaire (aide)** | aide | — | Le Carnet d'explorateur garde le Bestiaire. | Pour les deux répliques ci-dessus. |
| needs | Brume | Quelqu'un a besoin de toi : regarde la bulle au-dessus de sa tête… heureux, il travaille mieux (+10 % de production) ; négligé, moins bien. | Quelqu'un a besoin de toi. Ça se voit, si on regarde bien. | « +10 % » sort de la bouche de Brume. |
| **needs (aide)** | aide | — | La bulle d'un habitant dit ce qui lui manque. Comblé depuis sa fiche, il travaille mieux (+10 %) ; négligé, moins bien. | — |
| visitor | Brume | Une voile ! Un bateau accoste au Ponton… entier. Son voyageur reste quelques jours… des écus t'attendent. | Une voile ! Un bateau accoste au Ponton… entier. | « Entier » : le premier bateau qui ne se brise pas. Tout est dit. |
| **visitor (aide)** | aide | — | Un voyageur reste quelques jours, avec une demande (sa bulle dorée). Appui long : sa fiche. Comblé, il paie en écus. | — |
| expedition | Brume | Ton expédition s'enfonce dans la brume… N'aie pas peur : je la connais, ma brume. À son retour, la terre explorée se dévoile… | Ils sont entrés dans ma brume. Elle ne leur fera rien… je crois. | « Ma brume », et le doute : depuis la décision 3, une ironie douloureuse. |
| **expedition (aide)** | aide | — | À son retour, la terre explorée se dévoile et s'achète. Une seule à la fois : la boussole, en haut à gauche, dit quand. | — |
| finds | Brume | Une trouvaille de climat… montre-moi ! Chaque climat a la sienne… elle sert aux créations et annexes de climat. | Une trouvaille de climat… Montre-moi. | — |
| **finds (aide)** | aide | — | Chaque climat a sa trouvaille ; ses gisements repoussent en quelques heures. Le sac, en haut à gauche, la garde à part. | — |
| games | Brume | Un jeu s'est ouvert ! Au palier III, le Ponton pêche… chaque partie rapporte des écus. Je regarderai, moi. | Un jeu s'est ouvert. Je regarderai, moi. | — |
| **games (aide)** | aide | — | Au palier III, « Jouer » s'ouvre dans la fiche du Ponton, de la Carrière, du Bosquet. Chaque partie rapporte des écus. | — |
| chapter-V | Brume | Le Foyer : là où l'on invente et bâtit, ensemble. Le Hameau sort de la brume. | Le Foyer : là où l'on invente et où l'on bâtit. Le Hameau sort de la brume. | « Ensemble » soulignait la morale. |
| chapter-II, III, IV, VI, VII | Brume | (les autres chapitres) | (inchangées) | Gardées. |
| **brumeNoPage** (`world/screens/island.js`) | Brume | Aucune page des Légendes n'est encore à portée : écris encore, et reviens me voir. | Rien pour moi dans le livre, pas encore. Écris encore, et reviens me voir. | Une réplique de Brume cachée dans un écran (trouvée au lot 05). |

---

## 2. Les voyageurs

### 2.1 De passage (`src/texts/world/visitors.js`)

Les voyageurs vouvoient le joueur et parlent de « votre île » : ce sont des inconnus, qui s'adressent au peuple (point à trancher n° 2).

| Identifiant | Métier | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| STORIES.potager | graines | Je collectionne les graines des îles. Les vôtres poussent si bien… | Je ramasse des graines d'île en île. Les vôtres ont l'air de savoir où elles sont. | Un détail étrange au lieu d'un compliment ; un écho des graines de Flore. |
| STORIES.carriere | roches | J'étudie les roches. Votre île cache des veines superbes. | J'étudie les roches. Les vôtres sont plus vieilles que la mer, je crois. | Le menhir « plus vieux que l'île » (bible § 1.4). |
| STORIES.bosquet | bois | Je travaille le bois rare. On m'a parlé de vos arbres. | Je travaille le bois rare. On parle de vos arbres, de l'autre côté de l'eau. | L'île a une réputation : elle existe de nouveau pour le monde. |
| STORIES.puits | sources | Je suis les sources d'île en île. La vôtre chante joliment. | Je suis les sources d'île en île. La vôtre chante juste. | « Joliment » était fade. |
| STORIES.ponton | cartes | Je dessine les côtes. Votre crique n'est sur aucune carte ! | Je dessine les côtes. Votre crique n'est sur aucune carte. Elle le sera. | Être sur une carte, c'est être écrit. |
| STORIES.atelier | bijoux | Je façonne des bijoux. Il me faut de belles pierres. | Je taille des bijoux. Il me faut des pierres qui ont une histoire. | — |
| STORIES.foyer | poèmes | J'écris des poèmes sur les îles. La vôtre m'inspire déjà. | J'écris des poèmes sur les îles. La vôtre ne se laisse pas écrire facilement. | Le thème de l'écriture, en passant. |
| ASK.satisfied | — | Merci encore ! Je profite de votre île avant de repartir. | Merci encore. Je profite de l'île avant de reprendre la mer. | — |
| ASK.deliver | — | Il me faudrait ${amount} ${what} pour la suite de mon voyage. Vous pourriez m'aider ? | (inchangée) | Gardée. |
| ASK.harvested | — | Quelles Récoltes ! C'est exactement ce que je voulais voir. | Quelles Récoltes. C'est exactement ce que je voulais voir. | — |
| ASK.harvest | — | J'aimerais voir vos Récoltes : ${count} pendant mon séjour ! | J'aimerais voir vos Récoltes : ${count} pendant mon séjour. | — |
| THANKS | — | Merci infiniment ! Voici pour vous, de bon cœur. | Merci. Prenez ceci : là où je vais, ça ne me servira pas. | Une formule creuse devient un geste. |
| REQUEST.* | aide | (la demande en clair) | (inchangée) | Gardée. |

### 2.2 Installés (`src/texts/world/friends.js`, `SETTLER_TALKS`, selon les cœurs)

| Cœur | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| 0 | Bonjour ! Je m'habitue à ma nouvelle maison, elle est charmante. | La porte grince. Je ne la répare pas : ça me rappelle que j'en ai une. | Un détail concret à la place de « charmante ». |
| 1 | Je n'aurais jamais cru rester. Votre île a quelque chose de spécial. | J'ai défait une valise. Rien que ça, pour moi, c'est rester. | — |
| 2 | J'ai défait mes malles. Cette fois, c'est décidé : je suis d'ici. | Je devais repartir au printemps. Il est passé, le printemps. | L'attachement dit par le temps qui passe. |
| 3 | Le soir, je regarde la mer depuis ma fenêtre. Je ne repartirais pour rien au monde. | Le soir, je compte vos lanternes depuis ma fenêtre. Il y en a toujours une de plus. | Le motif des lumières (Brume compte, elle aussi). |
| 4 | Merci de m'avoir gardé une place. Je me sens chez moi. | On m'a gardé une place. Personne ne m'avait jamais gardé une place. | La gratitude par un fait. |
| 5 | Tu es la meilleure raison qui m'ait fait poser mes valises ici. | Si un jour je repars, je dirai que j'ai vécu ici. Pas que j'ai fait escale. | Une phrase de fin, sans formule ; sans accord de genre (le genre du voyageur n'est pas connu des textes). |

---

## 3. Anya

### 3.1 Les pressentiments et la Révélation (`src/texts/game/anya.js`)

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| vieVoix | Une voix | « … Merci. » | (inchangée) | Gardée. |
| vieBrume | Brume | Tu l'as entendue ? Une voix, quand tu as fait naître la Vie… Elle venait de l'île elle-même. Écoute bien : elle reviendra. | Tu as entendu ? / … Non. Rien. | La version de la bible : l'indice posé, jamais expliqué (§ 7.4). |
| runeGalet, runeSylve, betes | Saturnin, Freya, Brume | (les deux pressentiments suivants) | (inchangées) | Gardées. |
| traces 1 à 8 | légende | (les huit traces) | (inchangées) | Gardées : le registre exact. |
| aube, sceaux, centre, gemme | narration | (la Révélation) | (inchangées) | Gardées. |
| anyaATous | Anya | Vous m'avez fait naître bien avant de me voir. Air, Eau, Feu, Terre… Vous êtes la Vie que j'attendais. | Vous m'avez écrite bien avant de me voir. Air, Eau, Feu, Terre… Vous êtes la Vie que j'attendais. | Décision 12. |
| anyaAuLecteur | Anya | Toi qui lis. Continue de fabriquer. Tant qu'on fait naître la vie, je ne dors pas. | Toi qui lis. Continue d'écrire. Tant qu'on écrit la vie, je ne dors pas. | Le seul « toi qui lis » du jeu (décision 18). |
| (les autres répliques) | Anya, Brume, Saturnin | « Ma petite flamme… », « … Tu es revenue. », « Saturnin. Petit Sat. », les deux fins selon le Phare | (inchangées) | Gardées. |

### 3.2 Anya sur l'île (`src/texts/world/anya.js`, `village.js`, `world/screens/island.js`)

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| dame.says | Anya | La forêt se souvient de toi. | (inchangée) | Gardée. |
| cerf.says | fiche | Il incline ses bois. | *(Il incline ses bois.)* | Une didascalie, puisque c'est un geste (décision 24). |
| bol, luciole, sheets, hints | fiche, aide | (le bol « pour la Dame », le halo, les fiches) | (inchangées) | Gardées. |
| ANYA_RESTED | Anya | Va. La terre se repose aussi. Je repasserai. | Va. La terre se repose, elle aussi. | « Je repasserai » était trop familier pour elle. |
| BREATH_LINE | Anya | Ce que la terre sait, je te le souffle. | (inchangée) | Gardée. |
| anyaNoPage (`island.js`) | Anya | Le Grimoire n'a pas de page qui m'attende. Écris encore. | (inchangée) | Gardée : déjà sa voix. |

---

## 4. Le secret de Brume (`src/texts/game/opus.js`, acte VI)

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| galet | Saturnin, Brume | Hm. Hm… (Brume traduit : « La dernière rune. Le ciel est tombé dans la mer. Le Voile en est sorti, et la brume vivante a reculé. ») | Hm. Hm… *(Brume traduit : « La dernière rune. Le ciel est tombé dans la mer. Ce qui est tombé dort encore. Le Voile est son souffle. »)* | La décision 3, dite une seule fois et au bon moment : la chose dort, le Voile est son souffle. Où elle dort reste tu (point à trancher n° 3). |
| brume | Brume | La brume vivante… c'était moi ? Je ne brisais pas les bateaux. Je les gardais. J'étais l'île, le matin. | (inchangée) | Gardée. |
| brumeAnyaEveillee | Brume | La brume vivante… c'était moi. Son souffle. Elle s'est endormie, et je me suis faite toute petite, pour qu'on n'oublie pas qu'on existait. | (inchangée) | Gardée. |
| suite | Brume | Je pâlis, je sais. Ce n'est rien : continuons. Les quêtes, elles, ne s'arrêtent pas. | Je pâlis, je sais. Ce n'est rien. … Il reste des lumières à allumer. | « Les quêtes » parlait du jeu ; les lumières disent la même chose dans le monde. |
| EARLY_WISP_LINE | Brume | C'est… moi ? Comme c'est étrange. | (inchangée) | Gardée. |

---

## 5. Héliane (`src/texts/world/chests.js`)

Héliane est partie **avant** que la brume vivante ne se réfugie dans sa lanterne : elle a connu Brume la brume (qui chantait dans les roseaux), jamais Brume la flamme.

| Identifiant | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| NOTES.4 | Brume parle beaucoup, mais elle a raison presque à chaque fois. | Écoute la brume, le matin. Avant, elle chantait dans les roseaux. Elle chantera peut-être encore. | Héliane ne pouvait pas connaître le feu follet. Une ironie pour qui relira après l'acte VI. |
| NOTES.5 | Une longue chaîne à la Récolte, et la mer se montre généreuse. | La mer donne à ceux qui ramassent vite. Elle n'aime pas qu'on hésite. Moi, j'hésite toujours. | La règle devient une confidence. |
| NOTES.12 | Chaque lumière allumée sur l'île repousse un peu la brume. Allume-les toutes. | Une lumière, c'est peu. Deux, c'est un chemin. Trois, c'est un village. | Le mot de l'acte I le dit déjà ; celui-ci dit autre chose. |
| NOTES (les autres), HELIANE.I à VI | (les mots drôles, les mots d'histoire) | (inchangés) | Gardés. |
| HELIANE.VII | (la lettre de la lanterne) … Une brume est venue s'y abriter. — Héliane. | (la même lettre, avec une phrase de plus avant la signature :) Ce qui est tombé dort encore. Gardez vos lumières allumées. | La fin garde sa menace douce : le Phare n'est pas une victoire, c'est une veille (point à trancher n° 4). |

---

## 6. Les lieux remarquables (`src/texts/world/landmarks.js`)

La phrase de Brume garde l'image ; le bonus passe à l'aide. `LANDMARK_TIP` (« Sa page s'ajoute à ton Carnet d'explorateur. ») passe aussi à l'aide.

| Lieu | Texte actuel | Brume (proposé) | Aide (proposée) |
|---|---|---|---|
| grotte | La glace chante, entends-tu ? Ce souffle-là gardera une partie de Récolte de plus au chaud pour toi. | La glace chante, entends-tu ? | Une partie de Récolte de plus, gardée en réserve. |
| lac | Sous la glace, le temps dort. Tes bâtiments garderont leur production plus longtemps. | Sous la glace, le temps dort. | Tes bâtiments gardent leur production plus longtemps. |
| col | Le vent du col te poussera dans le dos : tes parties de Récolte reviendront plus vite. | Le vent du col pousse dans le dos. Il ne s'arrête jamais. | Tes parties de Récolte reviennent plus vite. |
| menhirs | Les pierres te reconnaissent. Leur force guidera ta main : deux coups de plus à chaque Récolte. | Les pierres te reconnaissent. … Je ne sais pas pourquoi j'ai dit ça. | Deux coups de plus à chaque Récolte. |
| arche | La mer a taillé cette pierre pendant mille ans. Ta Carrière en tirera profit. | La mer a taillé cette pierre pendant mille ans. Elle n'a pas fini. | Ta Carrière produit davantage. |
| saule | Ce vieux saule connaît chaque graine de l'île. Ton Potager poussera mieux. | Ce vieux saule connaît chaque graine de l'île. Il se tait sur la plupart. | Ton Potager produit davantage. |
| pilotis | Les lucioles t'ont ouvert la porte du vieux pêcheur. Ton Ponton pêchera davantage. | Les lucioles t'ont ouvert la porte du vieux pêcheur. Lui n'est plus là. Ses filets, si. | Ton Ponton produit davantage. |
| oasis | Une eau si pure, au milieu du sable… Ton Puits en profitera. | Une eau si pure, au milieu du sable… Pierrot va vouloir la goûter. | Ton Puits produit davantage. |
| pyramide | Les signes de la pyramide parlent de mains habiles : deux coups de plus à chaque Récolte. | Des signes, sur la pyramide. Des mains les ont gravés. Des mains comme les tiennes. | Deux coups de plus à chaque Récolte. |
| arbre | Le cœur de la jungle bat dans ce tronc. Ton Bosquet en sera plus généreux. | Le cœur de la jungle bat dans ce tronc. Pose ta main. Tu sens ? | Ton Bosquet produit davantage. |
| cascade | L'arc-en-ciel ne quitte jamais ses embruns. Tes bâtiments garderont leur production plus longtemps. | L'arc-en-ciel ne quitte jamais ses embruns. | Tes bâtiments gardent leur production plus longtemps. |
| geyser | La terre respire ici. Son souffle ramènera tes parties de Récolte plus vite. | La terre respire, ici. | Tes parties de Récolte reviennent plus vite. |
| cratere | Le cœur brûlant de l'île… Sa chaleur gardera une partie de Récolte de plus pour toi. | Le cœur brûlant de l'île… Ne t'approche pas trop. | Une partie de Récolte de plus, gardée en réserve. |
| LANDMARK_TIP | (ajouté à la fin de la réplique de Brume) Sa page s'ajoute à ton Carnet d'explorateur. | — | Sa page s'ajoute à ton Carnet d'explorateur. |

Intentions : « Les pierres te reconnaissent. … Je ne sais pas pourquoi j'ai dit ça. » : le Cercle de menhirs est la place d'Anya, et Brume en est le souffle sans le savoir. « Des mains comme les tiennes » : les Anciens étaient des naufragés, eux aussi (acte III).

---

## 7. Les familiers (`src/texts/world/bestiary.js`, `village.js`)

| Identifiant | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| ponton.says (Bosco) | Krrr… | *(Il gonfle ses plumes, vexé.)* | Décision 24 : une didascalie. |
| foyer.says (Bouillon) | Croâ ! (Il goûte ta manche.) | *(Elle goûte ta manche.)* | Sa fiche dit « elle » : accordé. |
| atelier.says (Tic-Tac) | Tic… tac… tic… clac. | *(Son ressort se déroule, puis s'arrête net.)* | Le bruit dit par le geste. |
| puits.says (le bocal) | Blub ! | *(Une bulle remonte. Il n'y a personne dedans.)* | Le bocal vide de Bulle, tant que Poisson n'est pas écrit. |
| bosquet, carriere, potager (says) | (Mousse, Basalte, Lunette) | (inchangées) | Déjà des didascalies. |
| *.text (fiches) | (les sept fiches) | (inchangées) | Gardées. |
| PET_SAYS.amie.short | Bzz ! | *(Elle tourne autour de Tic-Tac.)* | — |
| PET_SAYS.amie.long | Une vraie abeille : Jovin l'a fabriquée pour Tic-Tac quand Abeille a été écrite. | Une abeille de laiton : Jovin l'a fabriquée pour Tic-Tac quand Abeille a été écrite. | « Une vraie abeille » fabriquée se contredisait. |
| PET_SAYS.bocal.long | Vide : « Bulle est retourné dans la mer. » Ce qu'on fabrique renaît… | Vide. « Bulle est retourné dans la mer. » | La morale et « fabrique » partent. |
| PET_SAYS.bulle.short | Blub ! | *(Il fait le tour du bocal.)* | — |
| PET_SAYS.bulle.long | Le petit poisson de Pierrot, revenu quand Poisson a été fabriqué : ce qu'on fabrique renaît. | Le petit poisson de Pierrot, revenu quand Poisson a été écrit. | Décision 12 ; la morale part. |

---

## 8. Les cris des bêtes sur l'île (`src/texts/village.js`, `SOUNDS` ; décision 24)

| Bête | Texte actuel | Texte proposé |
|---|---|---|
| poule | Cot cot ! | *(Elle caquette.)* |
| coq | Cocorico ! | *(Il chante.)* |
| poussin | Piou piou ! | *(Il pépie.)* |
| vache | Meuh ! | *(Elle meugle.)* |
| mouton | Bêêê ! | *(Il bêle.)* |
| cochon | Groin groin ! | *(Il grogne.)* |
| chèvre | Mêêê ! | *(Elle bêle.)* |

Le coq qui chasse un égaré (au-dessus du poulailler) dit *(Il chante.)* ; le bilan du matin garde « Coquelicot a chanté : un égaré a filé dans la brume. »

---

## 9. Les bruits des mini-jeux (`src/texts/game/onomatopees.js` ; décision 23)

Le système de votre choix du 14 octobre reste : les bruits de matière, les ratés en points de suspension, les paliers (« Joli ! → Clair de lune ! »). Seules les interjections qui ne sont pas des bruits changent.

| Jeu, geste | Mot actuel | Mot proposé | Pourquoi |
|---|---|---|---|
| Récolte, blé | Miam ! | Crac ! | Le bruit du blé, pas la gourmandise. |
| Pêche, vieille botte | Bof ! | Splotch… | Un bruit mouillé ; le raté reste gentil. |
| Pêche, lancer à vide | Zut… | Plouf… | Idem. |
| Filon, diamant | Tadaaa ! | Clinnng ! | Le bruit du cristal. |
| Cueillette, fraise | Miam ! | Pic ! | — |
| Cueillette, cèpe | Ooh ! | Crac ! | — |
| Cueillette, guêpes | Ouille ! | Zzzt ! | Garde « Bzzz ! », qui est un bruit. |
| Marmite, prêt | Mmmh ! | Blop ! | — |
| Marmite, servi | Slurp ! | Glou ! | — |
| Marmite, fin | Miam ! | Fumant ! | Un mot court, pas un cri. |
| Établi, pièce qui ne tient pas | Hmm ? | Clonk… | — |
| Établi, gabarit rempli | Tadam ! | Clac-clac ! | — |
| (tous les autres mots) | Toc, Plic, Cloc, Bloup, Flip-flap, Ting, Diling, Pop, Hop, Attrapée, Au nid, Ziiing… | (inchangés) | Ce sont des bruits, ou des mots justes. |

**Une correction du lot 02** (point à trancher n° 1) : le lot 02 supprimait « Plouf ! » (la marmite) et « Cot ! / Cot cot ! » (la chasse aux poules) comme onomatopées. Ce sont des bruits de mini-jeu : la décision 23 les garde.

---

## 10. Les fêtes

| Identifiant | Qui parle | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|
| `game/fete.js` (Brume, à la récompense) | Brume | Youpi ! / Hourra ! / On l'a fait ! / Ça brille ! | On l'a fait. / Ça brille ! / Une de plus. / Tu as vu ? | Décision 11 (la joie sans le mot), prise après le choix du 13 oct. « Ça brille ! » reste : c'est elle. |
| `world/fetes.js` (les mots dorés) | — | Debout ! / Ça tient ! / Bel ouvrage ! / Du solide ! / Une merveille ! / L'île s'en souviendra ! / La brume recule ! / Trouvé ! | (inchangés) | Gardés : la voix d'un artisan, et « L'île s'en souviendra ! » dit le thème. |

---

## 11. Le camp (`src/texts/world/camp.js`)

| Identifiant | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| hirondelle | Ce qu'il reste de l'Hirondelle, le navire de croisière. | Ce qu'il reste de l'Hirondelle. | Le joueur le sait ; la phrase s'arrête sur le nom. |
| (les autres) | (la cuisine, l'abri, le cabanon, les coins, la tente, le hamac, le SOS, les caisses, le filet, les rondins, la cage) | (inchangés) | Gardés : sobres. « Un grand SOS de galets, pour qui passerait au large » est déjà juste. |

---

## 12. Les mélanges ratés (`src/texts/game/failLine.js`)

La voix de l'Athanor : une image, sobre. La plupart restent.

| Clé | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| brut+nature (1) | La nature hausse les épaules. | La nature reste indifférente. | Le clin d'œil facile part. |
| humain+matiere (1) | L'artisan se gratte la tête. | L'établi reste froid. | Idem ; la seconde (« Il manque un savoir-faire. ») reste. |
| mythe+mythe (1) | Les légendes se disputent la vedette. | Deux légendes, et aucune ne cède. | — |
| mythe+mythe (2) | Trop de magie tue la magie. | Trop de magie, et plus rien ne prend. | Le proverbe tout fait, retourné. |
| generic (1) | Rien ne se passe… Essaie une autre combinaison. | Rien ne se passe. Pas avec ceux-là. | Le conseil part ; le constat suffit. |
| (les autres) | (les autres images, l'indice) | (inchangées) | Gardées : « L'outil reste un outil. », « Ils se regardent… et chacun repart de son côté. » |

---

## 13. Les points tranchés (15 octobre : oui aux cinq recommandations)

1. **Rétablir « Plouf ! » et « Cot ! »** dans la marmite et la chasse aux poules (lot 02 validé), puisque la décision 23 garde les bruits des mini-jeux. **Recommandé : oui**, pour que la règle soit la même partout.
2. **Les voyageurs vouvoient** le joueur et disent « votre île » : ce sont des inconnus qui parlent au peuple ; les naufragés tutoient. C'est une exception à « toujours tu » (ton § 2.3), qui vise le jeu, pas les personnages. **Recommandé : oui.**
3. **La dernière rune (acte VI) en dit un peu plus** : « Ce qui est tombé dort encore. Le Voile est son souffle. » C'est la décision 3 révélée au joueur, une fois, sans dire où la chose dort. **Recommandé : oui.** Sinon, la rune reste comme aujourd'hui et la chose n'est jamais nommée.
4. **La dernière lettre d'Héliane** finit sur « Ce qui est tombé dort encore. Gardez vos lumières allumées. » : le Phare devient une veille, pas une victoire, et la porte reste ouverte (bible § 7.5). **Recommandé : oui**, si le point 3 l'est.
5. **Les lignes d'aide sous les répliques de Brume** (§ 1, § 6) : il en faut une quinzaine de nouvelles, affichées sous sa bulle. **Recommandé : oui** ; c'est la règle « les personnages ne lisent pas l'interface » (bible § 7.4), appliquée jusqu'au bout.

---

## 14. Pour l'autre agent (rien n'est à intégrer avant le « oui » de l'auteur)

- Les lignes d'aide nouvelles (§ 1, § 6), sous la bulle de Brume.
- `brumeNoPage` et `anyaNoPage` vivent dans `world/screens/island.js`, la fiche des nuits du lot 03 dans `world/screens/explore.js`.
- Les didascalies (`SOUNDS`, `says` des familiers, `cerf.says`) s'affichent en italique.
- Le secret de l'acte VI et la lettre VII, si les points 3 et 4 sont validés.
