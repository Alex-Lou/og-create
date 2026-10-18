# Lot 01 — L'ouverture : le naufrage, Brume, le Grimoire, le premier feu

> **Révision du 18 octobre 2026** : l'auteur a réécrit lui-même les répliques de ce lot ; le texte en jeu est celui de `lots/10_reecriture_auteur.md` (jour 1). Ce lot garde ses intentions, ses images et ses décisions ; ses tableaux de répliques sont une archive.

> Ce lot réécrit la séquence de Brume, du naufrage à la première nuit, **sur l'ouverture écrite par l'auteur**. La structure, les intentions et l'humour sont les siens ; la langue est corrigée ; quelques endroits sont élevés. Chaque écart à son texte est signalé dans la colonne « Intention ».
> - Décisions appliquées : `ton.md` § 0 (1, 2, 3, 4, 5, 6, 7, 7 bis, 8, 9, 10, 11, 12, 14).
> - **Validé par l'auteur le 14 octobre**, avec les quatre recommandations du § 4 (décisions 19 à 22 de `ton.md`). Seul changement depuis : arrivee.2 reprend le mot de l'auteur avec les deux formes (décision 20).

---

## 1. Le déroulé

Le jeu enchaîne aujourd'hui (`src/game/prologue.js`) : la scène `naufrage` → la carte d'embarquement (l'avatar, le nom) → la scène `arrivee` → la page du Vent → la scène `souffle` → la page de garde (la signature) → la page du Brasier, dans la même visite du Grimoire → la plage (les trouvailles, le feu) → la scène `nuit`.

Le lot garde cet ordre, et l'ouverture de l'auteur s'y pose presque exactement. Il demande **trois scènes nouvelles**, à brancher par l'autre agent :

| Ordre | Moment | Scène ou réplique | Statut |
|---|---|---|---|
| 1 | Le naufrage, le réveil, la carte | `naufrage` | réécrite |
| 2 | La carte d'embarquement : l'avatar et le nom | (écran existant) | inchangé |
| 3 | La plage au couchant, la lueur, Brume, le livre | `arrivee` | réécrite |
| 4 | La page du Vent | `LINES.vent` (le Grimoire) | gardée |
| 5 | La trouée, « Tu es comme eux », le livre à toi | `souffle` | réécrite |
| 6 | La page de garde : on écrit son nom ; Brume découvre le mot « écrire » | `LINES.nom`, `TAB_OPENED.sceau` | réécrites |
| 7 | « Quel jour ? » | **`jour`** | **nouvelle** |
| 8 | La nuit qui vient, le cercle de flammes | **`cercle`** | **nouvelle** |
| 9 | La page du Brasier | (page existante) | inchangé |
| 10 | L'épave, la brume, le doute | **`epave`** | **nouvelle** ; remplace `brasier-brume` et `brasier-nuit` |
| 11 | La plage : les trouvailles, le feu | `LINES.greve-feu`, `epaves`, `claim`, `feu-pret`, `flambe` | réécrites |
| 12 | La première nuit | `nuit`, puis `LINES.dormir` | réécrites |

**La règle des six bulles** (décision 14) : chaque scène s'arrête au plus tard à la sixième bulle sur un **geste réel** du joueur. Là où l'ouverture enchaîne plus longtemps, je propose un geste ciblé dans la scène (toucher un endroit précis, pas l'écran) : « Avancer », « T'approcher », « Lever les yeux », « Suivre Brume ». C'est le point à trancher n° 3.

---

## 2. Les images à montrer

Pour l'autre agent : ce que chaque image doit montrer. Les identifiants d'images existants sont gardés quand ils conviennent.

| Image | Où | Ce qu'on voit | Statut |
|---|---|---|---|
| `01_pont` | naufrage | Le pont de *l'Hirondelle*, la nuit ; des guirlandes qui battent, la pluie à l'horizontale. Les haut-parleurs du pont. | existe |
| `01_vague` | naufrage | Les vagues, des débris, des valises qui roulent dans l'écume. | existe, à enrichir |
| **`01_racines`** | naufrage | **Sous la surface**, dans le faisceau d'un projecteur qui tangue : des racines. Sombres, lentes, grandes comme le navire, elles bougent comme une ombre bouge, sans bruit. Elles ne frappent pas : elles sont là. L'animation doit être parfaite, fluide (le souhait de l'auteur). Trois secondes, puis le noir. | **nouvelle** |
| `01_noir` | naufrage | Le noir ; la mer, très loin. | existe |
| **`01_paupieres`** | naufrage | **Vue subjective** : des paupières qui battent (le noir qui s'ouvre et se referme deux fois), du flou, puis la plage. | **nouvelle** |
| `01_greve` | naufrage | **Vue subjective** : une plage paradisiaque au couchant, « même si rien ne l'est dans la situation » : galets, étoiles de mer, algues, l'horizon doré. Le regard glisse : des débris, des valises éventrées, des morceaux de coque. | existe, à refaire en vue subjective |
| **`01_carte`** | naufrage | **Vue subjective** : quelque chose de blanc sur le sable, au loin ; puis, de près, la carte d'embarquement trempée. | **nouvelle** (remplace `01_gilet`) |
| **`02_plage`** | arrivee | On se voit enfin : l'avatar, en tenue de naufragé, debout face à la mer, au couchant. | **nouvelle** |
| `02_lueur` | arrivee | Une lumière surgit tout près, d'un coup ; l'avatar recule (pose « grelotter »). | existe, à rapprocher |
| `02_approche` | arrivee | La lumière s'immobilise une seconde (l'écho muet de l'étoile), puis s'approche : une flamme, deux grands yeux. | existe |
| `02_rocher` | arrivee | Brume tout près de l'avatar ; sa flamme s'embrase de joie. | existe |
| `03_livre` | arrivee | Brume tire d'un creux de rocher, à grand-peine, un livre lourd fermé de sept sceaux. | existe |
| `03_vent` | souffle | Le vent se lève pour de vrai et ouvre une **trouée** dans la brume : la plage proche se découvre (le bois flotté, des pierres noircies) ; au large, la brume tient, et l'épave y reste cachée (décision 8). | existe, à préciser |
| **`03_ciel`** | jour | Brume lève les yeux vers le ciel, et ne dit rien. Le ciel du couchant, sans étoile encore. | **nouvelle** |
| **`05_cercle`** | cercle | Un cercle de pierres noircies, à moitié enfoui dans le sable, en haut de la plage. Brume au-dessus, toute petite. | **nouvelle** |
| `05_feu` | nuit | Le feu de camp, la nuit ; l'avatar tend les mains ; Brume tout près. | existe |
| `06_silhouette` | nuit | Au loin, sur les rochers, une silhouette regarde la lueur (c'est Agathe : décision 5). | existe |

---

## 3. Les textes

Colonnes : l'identifiant (existant, ou **nouveau** en gras) ; qui parle ; où dans le jeu ; le texte actuel ; le texte proposé ; l'intention. « Le joueur » s'affiche avec son nom (décision 1). Les pensées s'écrivent en italique. Les didascalies, entre parenthèses, se montrent par une humeur, une pose ou une image.

### 3.1 La scène `naufrage`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| naufrage.0 | légende | `01_pont`, auto | L'Hirondelle, troisième nuit de croisière. | L'Hirondelle, troisième nuit de croisière. | Gardée. |
| naufrage.1 → **naufrage.1a** | Le capitaine | `01_pont`, auto | Mesdames et messieurs, le commandant vous prie de regagner… krrr… vos cabines… | Attention, mesdames et messieurs, ici votre capitaine. Nous venons de percuter un élément inconnu : la coque est perforée. | Le texte de l'auteur ; « qui vous parle » retiré (redondant). « Un élément inconnu » est gardé : le mystère des racines (décision 3). |
| **naufrage.1b** | Le capitaine | `01_pont`, auto | — | Il nous reste assez de canots de sauvetage pour tout le monde. Je vous demande de vous organiser dans le calme. | Le calme professionnel. « Il faudra vous organiser » devient une consigne de capitaine. |
| **naufrage.1c** | Le capitaine | `01_pont`, auto | — | Nous rencontrons des difficultés à manœ… — krrr — Aaah ! — krrrr… shhh… | La voix se coupe sur le mot ; le cri est réel. Le « krrr » reste : c'est un bruit (décision 11). Un seul « Aaah », pas cinq : la peur, pas la caricature. |
| naufrage.2 | — | `01_vague`, auto | — | — | Les vagues, les débris, les valises. |
| **naufrage.2b** | — | **`01_racines`**, auto | — | — | Les racines sous l'eau (décision 3). Aucun texte : l'image suffit, et rien ne s'explique. |
| naufrage.3 | — | `01_noir`, auto | — | — | Gardée. |
| naufrage.4 | pensée | **`01_paupieres`** | Du sable dans la bouche. La mer. Rien d'autre. | *Du sable plein la bouche… Oh non. Où suis-je ?* | La sensation gardée ; « Oh non, où suis-je ?! » de l'auteur, sans le double signe : il vient de se réveiller, il n'a pas la force de crier. Geste : « Toucher pour ouvrir les yeux ». |
| naufrage.5 | pensée | `01_greve` | Ohé ? … Quelqu'un ? | *Des valises, des morceaux de coque… Oh mon… Qu'est-ce que je vais pouvoir faire ?* | L'auteur : le regard qui glisse sur les débris, « Oh mon… » qui ne finit pas. |
| **naufrage.6** | pensée | **`01_carte`** (de loin) | — | *Ah, il y a quelque chose, là-bas.* | L'auteur : « Ah, je vois quelque chose là-bas ! » ; le point d'exclamation ôté : une curiosité lasse, pas un espoir. |
| **naufrage.7** | pensée | **`01_carte`** (de près) | Seule la mer répond. Dans ma poche, un carton trempé : ma carte d'embarquement. | *C'est ma carte d'embarquement… Super…* | Le texte de l'auteur, intact : son humour. |
| **naufrage.8** | pensée | **`01_carte`** | — | *Je ne vois pas ce que je vais pouvoir en faire. Bon. Regardons quand même…* | L'auteur. Geste : « Toucher la carte » → la création du personnage. |

### 3.2 La scène `arrivee`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| **arrivee.0** | pensée | **`02_plage`** | — | *Bon. Maintenant que je me rappelle ma tête et mon nom, on va pouvoir voir où nous sommes.* | L'auteur. Le « nous » de quelqu’un de seul qui se parle : on le garde, il est drôle. |
| **arrivee.1** | pensée | `02_plage` | — | *Hm… Je crois que c'est bel et bien une île déserte.* | L'auteur. |
| **arrivee.2** | pensée | `02_plage` | — | *Si seulement j'étais arrivé\|arrivée ici sans naufrage, j'aurais peut-être aimé.* | L'auteur, intact, avec les deux formes (décision 20). |
| **arrivee.3** | pensée | `02_plage` | — | *Je ne vois personne. Pourtant, j'aurais juré voir des silhouettes nager vers le rivage…* | L'auteur. Les rescapés, en vrai (décision 5) : Lorena, Agathe, Léo le confirmeront un à un. |
| **arrivee.4** | pensée | `02_plage` | — | *Tant pis. D'abord, avançons.* | L'auteur. Geste : « Avancer ». |
| arrivee.0 → **arrivee.5** | le joueur | `02_lueur` (grelotte) | Une lumière, là-bas ! Une lanterne… On me cherche ! | Aaah ! Mais c'est quoi, ça ?! | L'auteur. Le seul « ?! » de la scène : la vraie surprise. La langue parlée est gardée : on ne crie pas en bon français. |
| **arrivee.6** | le joueur | `02_lueur` | — | Une étoile ? … C'est magique ? | L'auteur ; « C'est magique ?! » perd son « ! » : la peur retombe en question. L'écho muet de l'étoile (décision 6). |
| arrivee.1 → **arrivee.7** | — | `02_approche`, auto (1,4 s) | Ce n'est pas une lanterne. Les marins disent que les feux follets égarent les voyageurs. | — *(Elle s'immobilise une seconde.)* | Le blanc qui répond à « étoile » : Brume ne relève pas. Le folklore des feux follets passe à Agathe (lot 02). |
| arrivee.2 → **arrivee.8** | Brume | `02_rocher` | Tu me vois. … Tu me vois vraiment ? | Tu… Tu peux me voir ? Et me parler ?! *(Sa flamme s'embrase d'un coup.)* | L'auteur ; « Youhou !! » devient l'embrasement de la flamme (décision 11). Humeur : joie. |
| **arrivee.9** | le joueur | `02_rocher` | — | Quoi ? Tu es vivant ? | L'auteur. |
| arrivee.3 → **arrivee.10** | Brume | `02_rocher` | Brume. C'est ainsi qu'ils m'appelaient, ceux d'avant. | VivantE ! Je suis une fille, et je m'appelle Brume. | L'auteur, intact : l'aplomb vexé, et la majuscule qui le dit. Humeur : vexée. |
| **arrivee.11** | Brume | `02_rocher` | — | Cela faisait des lunes que je n'avais vu personne sur cette île. | L'auteur ; « vu de gens » devient « vu personne ». Geste : « T'approcher ». |
| **arrivee.12** | le joueur | `02_rocher` | — | Je ne comprends plus rien… Mais peu importe ! Qu'est-ce que tu es ? | L'auteur. |
| **arrivee.13** | le joueur | `02_rocher` | — | C'est toi qui nous as fait naufrager ? | L'auteur. |
| arrivee.6 → **arrivee.14** | Brume | `02_rocher` | Ton bateau… Pardon. Je crois que c'est ma faute. Je ne sais pas pourquoi. | Je suis Brume… Et non ! Comment peux-tu penser ça de moi ? Je suis gentille ! | L'auteur, intact sauf « cela » → « ça » (elle parle vite). Le déni (décision 7 bis). Humeur : outrée. |
| **arrivee.15** | Brume | `02_rocher` | — | Avant, j'étais autre chose. Maintenant, je ne suis plus remplie que de souvenirs flous… et de ce que je ressens. | L'auteur, langue corrigée (« ressentis » devient « ce que je ressens »). « Avant, j'étais autre chose » gardé (décision 7). Humeur : grave, plus bas. |
| arrivee.8 → **arrivee.16** | Brume | `03_livre` | Je le garde depuis toujours. Je n'ai jamais su le lire. Eux savaient. | Attends, regarde ! Tu pourras peut-être faire comme ceux d'avant. | L'auteur : elle se reprend d'un coup, sans transition (ton § 4.1). « Ceux d'avant » (décision 9). |
| arrivee.9 → **arrivee.17** | Brume | `03_livre` | Il ne s'est jamais ouvert pour moi. Jamais. … Toi, peut-être ? | Regarde. Peut-être que toi, tu comprendras. | L'auteur. Geste : « Toucher le livre ». |

### 3.3 La page du Vent

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.vent | Le Grimoire | la page du Vent | « Mêle l'Air à l'Air, et nomme ce qui naît. » | « Mêle l'Air à l'Air, et nomme ce qui naît. » | Gardée : la voix du livre. |
| COACH.vent-air | aide | la page du Vent | Touche l'Air, deux fois : il va dans l'Athanor, et le livre fait le mélange. | Touche l'Air, deux fois : il va dans l'Athanor, et le livre fait le mélange. | Gardée. |

### 3.4 La scène `souffle`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| **souffle.0** | — | `03_vent`, auto | — | — | La trouée : la plage proche se découvre, l'épave reste dans la brume (décision 8). |
| souffle.0 → **souffle.1** | Brume | `03_vent` | … Qu'est-ce que tu as fait naître ? | Oh ! Mais toi aussi, tu sais commander aux éléments ?! | L'auteur ; « Wouah ! » devient « Oh ! » (décision 11) ; « manipuler » devient « commander aux », le mot naïf et plus beau de Brume. |
| **souffle.2** | le joueur | `03_vent` | — | Je… J'ignore ce qui s'est passé. C'est moi qui ai fait ça ? | L'auteur ; « ?! » ramené à « ? ». |
| souffle.1 → **souffle.3** | Brume | `03_vent` | Ils faisaient ça, ceux d'avant. Ils fabriquaient, et l'île répondait. | Oui ! Tu es comme eux ! Tu peux créer, donner vie à ce qui dort dans ce livre. | L'auteur : « créer, donner vie », le verbe de Brume avant qu'elle connaisse le vrai (décision 12). « Manipuler » retiré : déjà dit. |
| souffle.2 → **souffle.4** | Brume | `03_vent` | Tout ce que tu feras naître reviendra. Les arbres, les bêtes… tout ce que la brume a pris. | Moi, je ne le comprends pas. Je le garde pour celui qui doit le recevoir… et on dirait que c'est toi. | L'auteur. Le livre change de mains : la page de garde suit naturellement. |

### 3.5 La page de garde

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.nom | Brume | la page de garde, avant la signature | Signe le Grimoire : ton île sera gardée, et tu la retrouveras sur n'importe quel appareil. | Ce livre est à toi, maintenant. Mets ton nom sur la première page. | Brume ne parle plus d'appareils : le livre devient le tien (la suite directe de souffle.4). |
| **COACH.nom** | aide | la page de garde | — | Écris ton nom : il garde ton île, et tu la retrouveras sur tous tes appareils. | La partie technique, dans l'aide (ton § 3.3). |
| TAB_OPENED.sceau (1) | Brume | après la signature | Ton nom est écrit au Grimoire. Ton sceau t'attend, avec tout ce que tu accompliras. | Tu écris… C'est ça qu'ils faisaient, ceux d'avant. Ils écrivaient. | **Le moment où Brume découvre le mot** (décision 12) : elle le voit faire. Désormais, elle dit « écrire ». |
| **TAB_OPENED.sceau (2)** | Brume | après la signature | — | Le livre se souviendra de toi, même si tu pars. … Tu ne pars pas, hein ? | Reprise de la bible v6 (étape 6f) : sa peur d'être laissée, sans la nommer. |
| **COACH.sceau** | aide | l'onglet Sceau s'allume | — | Le Sceau garde ce que tu accomplis. | L'onglet, dans l'aide. |

### 3.6 La scène `jour` (nouvelle)

Jouée juste après la page de garde (ou après `souffle`, si le compte est déjà signé : voir le point n° 3).

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| **jour.1** | le joueur | `03_vent` | — | Il y a déjà eu des gens, ici ? | L'auteur. Il ne répond pas à « Tu ne pars pas, hein ? » : il change de sujet, et ce silence-là dit quelque chose aussi. |
| **jour.2** | Brume | `03_vent` | (arrivee.5) Puis le ciel a brûlé, une nuit. Après… ils ont oublié, et la brume a tout pris. | Ceux d'avant savaient beaucoup. On s'apprenait tout, eux et moi… Mais depuis ce jour, je ne me rappelle plus rien. | L'auteur, resserré (« J'ignore presque tout » redit la fin). « On s'apprenait » est gardé : l'entraide, déjà. « Se rappeler de » corrigé. |
| **jour.3** | le joueur | `03_vent` | — | Quel jour ? | L'auteur. |
| **jour.4** | — | **`03_ciel`**, auto (2,2 s) | — | — *(Elle regarde le ciel sans rien dire.)* | Le blanc de l'auteur, tel quel. Il remplace « Puis le ciel a brûlé » : on pose la question, on ne dit rien (bible § 7.5 à corriger). |
| **jour.5** | Brume | `03_vent` | — | Peu importe. Ce livre a d'autres choses pour toi. Mais il faudra être patient : il est très gros… | L'auteur ; « que tu peux créer » ôté (le Grimoire n'est pas un catalogue). L'humour de « il est très gros » gardé. |
| **jour.6** | Brume | `03_vent` | — | … et ses pages ont l'air d'avoir oublié, elles aussi, ce qu'elles contenaient. | L'auteur ; « elles-mêmes » devient « elles aussi » : comme Brume, comme tout le monde ici. Geste : « Lever les yeux » (le joueur regarde le ciel à son tour ; la lumière baisse). |

### 3.7 La scène `cercle` (nouvelle)

Elle remplace `brasier-brume` et `brasier-nuit`, et amène la page du Brasier.

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| **cercle.1** | le joueur | `03_vent`, la lumière baisse | (brasier-nuit) La nuit tombe : il nous faudra un feu. Le Brasier dort dans ce livre, lui aussi. | Oh non… Je sens que la nuit va être froide. Je n'ai ni abri, ni nourriture, ni de quoi me réchauffer. *(Un soupir.)* | L'auteur. Le besoin vient du joueur, pas de Brume (bible § 9 : chaque étape naît d'un besoin). |
| **cercle.2** | Brume | `03_vent` | — | Non, non, ne t'en fais pas. Je ne réchauffe pas beaucoup, mais je brille. Je resterai près de toi jusqu'au matin. | L'auteur ; « jusqu'à ce que tu puisses passer la nuit » devient « jusqu'au matin ». Remplace « Je ne suis pas bien chaude, mais je brille » (bible § 7.5 : la graine de « D'où vient sa flamme ? » change de mots). |
| **cercle.3** | le joueur | `03_vent` | — | Bon… D'accord, Brume. On suit ton plan. Je n'ai pas d'autre choix, de toute façon. | L'auteur. |
| **cercle.4** | Brume | `03_vent` | — | C'est vrai ! Viens, par là. | L'auteur : elle approuve qu'il n'a pas le choix, le plus naturellement du monde. Geste : « Suivre Brume ». |
| **cercle.5** | Brume | **`05_cercle`** | — | Autrefois, il y avait ici un cercle de flammes, et ceux d'avant tout autour. | L'auteur ; « des créateurs » devient « ceux d'avant » (décision 9). |
| **cercle.6** | Brume | `05_cercle` | (arrivee.4) Là, il y avait un village. Des rires, le soir. De la soupe. | Ils parlaient, dansaient, chantaient, riaient. Ils discutaient sérieusement, aussi. Et parfois, plus tristement. | L'auteur, en trois temps : la joie, le sérieux, la peine. |
| **cercle.7** | Brume | `05_cercle` | — | C'était un vrai lieu de vie. Je m'en souviens si peu, et tellement à la fois… C'est étrange. | L'auteur ; « je m'en rappelle » corrigé. |
| **cercle.8** | Brume | `05_cercle` | — | Pas grave ! Regarde : c'est ici que dansaient les flammes orange. Tu pourrais peut-être les refaire ? | L'auteur : la mélancolie coupée net par « Pas grave ! ». Geste : la page du Brasier. |
| LINES.brasier-brume | Brume | (le Grimoire) | La brume s'est levée du rivage… C'est la mienne, tu sais. Je la laisse filer depuis si longtemps que j'ai oublié comment la retenir. | *(supprimée)* | Remplacée par la scène `epave`, qui pose le doute à sa place (décision 7 bis). |
| LINES.brasier-nuit | Brume | (le Grimoire) | La nuit tombe : il nous faudra un feu. Le Brasier dort dans ce livre, lui aussi. | *(supprimée)* | Remplacée par `cercle.1` à `cercle.8`. |
| COACH.book.plans.feu | aide | la page du Brasier | Le feu de camp naît d'un mélange : fais naître « ${plan} » dans l'Athanor. Le ruban du Grimoire te montre quoi mêler. | Le feu de camp naît d'un mélange : écris « ${plan} » dans l'Athanor. Le ruban du Grimoire te montre quoi mêler. | « Écris » (décision 12). |
| PLAN_WRITTEN.text | Brume | le Brasier écrit | Tu as fait naître « ${plan} » dans l'Athanor ! Retourne sur l'île : le chantier peut se bâtir. | Tu l'as écrit ! Viens : on va lui trouver sa place, sur la plage. | Brume dit « écrit », maintenant qu'elle a le mot. Plus de chantier ni d'onglet. Le bouton « Aller sur l'île » reste. *(À vérifier : si cette réplique tombe juste avant `epave`, elle n'a plus lieu d'être pour le Brasier.)* |

### 3.8 La scène `epave` (nouvelle)

Jouée le Brasier écrit, avant d'aller sur la plage.

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| **epave.1** | le joueur | `05_cercle` ; au large, la brume | — | Attends. Je pense que mon bateau va s'échouer sur la plage : je pourrai sans doute récupérer mes affaires. | L'auteur. La promesse se tiendra au matin, avec Lorena (décision 10). |
| **epave.2** | le joueur | `05_cercle` | — | Tu es Brume, non ? Tu ne pourrais pas, justement, faire s'en aller la brume ? | L'auteur ; « Tu ne peux pas » devient « Tu ne pourrais pas » (la politesse d'un inconnu). |
| **epave.3** | Brume | `05_cercle` | (brasier-brume) … C'est la mienne, tu sais. Je la laisse filer depuis si longtemps que j'ai oublié comment la retenir. | Oui… Pardon pour ça. Il y a longtemps que j'ai oublié comment la retenir. | L'auteur (« désolée pour ça ») : **le doute** (décision 7 bis). Elle s'excuse d'une brume qu'elle croit sienne, et qui ne l'est pas (décision 3). Humeur : la moue. |
| **epave.4** | Brume | `05_cercle` | — | J'ai perdu la mémoire. Et le reste avec. Avant, j'étais plus grande. Bien plus. | L'auteur, sauf « ma magie… mon essence », remplacés par une image (décision 7) : une graine de « Qui est Brume ? » (la brume vivante couvrait l'île). |
| **epave.5** | le joueur | `05_cercle` | — | Euh… D'accord. Écoute, ce n'est pas grave. Déjà, installons-nous. | L'auteur, intact. Il la console sans savoir de quoi : l'entraide, déjà. |

### 3.9 La plage

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.greve-feu | Brume | invitation vers l'île (Vent et Brasier écrits) | Le Vent et le Brasier sont écrits ! Viens sur la plage avant la nuit : tes pages méritent leur récompense, et le feu nous attend. | Viens. Il reste un peu de jour, et du bois sur la plage. | La suite de « installons-nous » ; plus de récompense dans sa bouche. |
| LINES.greve | Brume | invitation vers l'île (Vent seul, ancien parcours) | Le Vent a chassé la brume du rivage ! Viens voir la plage de Brumelune : ta première page mérite sa récompense. | Le vent a ouvert la plage. Viens voir. | La trouée (décision 8). |
| TAB_OPENED.world | Brume | l'onglet Île s'allume | Le vent a chassé la brume de la plage de Brumelune. Touche « Île », en bas : pour cette nuit, on reste près du rivage. | Le vent a ouvert la plage. Pour cette nuit, on reste près du rivage. | Brume ne nomme plus l'onglet. |
| **COACH.tab-ile** | aide | l'onglet Île s'allume | — | Touche « Île », en bas. | L'onglet, dans l'aide. |
| LINES.ile | Brume | sur l'île avant le Vent (ancien parcours) | Voici Brumelune, notre île. La brume a tout endormi… Pour la réveiller, fabrique : le Grimoire garde les recettes. La première t'attend ! | Elle dort, sous la brume. Ton livre saura peut-être la réveiller. | Plus de « fabrique » ni de « voici » ; le nom de l'île est gardé pour la nuit (nuit.2). |
| LINES.epaves | Brume | les trouvailles sur la plage | La mer a rendu deux bois flottés et un galet. Ramasse tout : ce sera notre premier feu. | Du bois flotté. Et là, les pierres du vieux cercle. Rassemble tout : on va le rallumer. | Les galets deviennent les pierres du cercle : on ne fait pas un feu, on rallume celui de ceux d'avant. Les chiffres restent dans l'aide (COACH.feu.build, inchangée). |
| LINES.claim | Brume | elle brille : une tâche faite | Je brille ! Touche-moi : ce que tu as fait mérite quelque chose. | Je brille plus fort, tu as vu ? Touche-moi : j'ai quelque chose pour toi. | Le geste, dit par elle ; plus de ton de récompense scolaire. |
| LINES.feu-pret | Brume | tout est réuni pour le feu | Le Brasier est écrit, le bois et le galet ramassés : bâtissons le feu, là, avant la nuit. | Tout y est. Là, au milieu des pierres. | Une liste cochée devient un geste. |
| LINES.cendres | Brume | ancien parcours : le Brasier pas écrit | Il nous faut un feu pour la nuit. Le Brasier du Grimoire, le bois et les galets ramassés : de quoi bâtir un feu qui tiendra. | Il faudra des flammes pour la nuit. Ton livre sait peut-être leur donner vie. | Le bouton « Ouvrir le Grimoire » reste. |
| LINES.flambe | Brume | le feu est bâti | Il flambe ! Avec lui, la nuit peut venir. | Les flammes orange… comme avant. Maintenant, la nuit peut venir. | L'écho du cercle (cercle.8) : la mélancolie, sans un mot de plus. |

### 3.10 La scène `nuit`

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| nuit.0 | Brume | `05_feu` | Je n'ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n'ai pas froid. | Je n'ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n'ai pas froid. | Gardée : l'écho de cercle.2, retourné. |
| nuit.1 | pensée | `05_feu` | Le feu tient. Pour cette nuit, cette plage suffira. | *Le feu tient. Pour cette nuit, cette plage suffira.* | Gardée. |
| **nuit.2** | Brume | `05_feu` | — | Brumelune. C'est ainsi qu'ils appelaient l'île, ceux d'avant. Je n'avais plus dit ce nom depuis longtemps. | Le joueur apprend le nom de l'île, de la bouche de Brume ; « depuis longtemps » dit sa solitude sans la nommer. |
| nuit.2 → **nuit.3** | légende | `05_feu` | Une étoile file. Brume détourne les yeux. *(affichée comme une pensée)* | Une étoile file. Brume détourne les yeux. | Gardée, mais en légende : c'est ce qu'on voit, pas ce que pense le joueur. L'écho de « Une étoile ? » (décision 6). |
| nuit.4 | Brume | `06_silhouette` | Là-bas, quelqu'un… n'ose pas venir. La nuit fait peur, quand on est seul. | Là-bas, sur les rochers. Quelqu'un regarde ton feu. | La morale retirée. Le joueur se souvient des silhouettes (arrivee.3). |
| nuit.5 (avec nuit.3) | Brume | `06_silhouette` | Je veille sur nous deux ; demain, on lui fera une place près du feu. / Dors. Je surveille la brume. | On lui fera une place, demain. Dors : je surveille la brume. | Deux répliques en une. « Je surveille la brume » prend son double sens (décision 3 : la brume regarde aussi). |
| LINES.dormir | Brume | sur l'île, la nuit | La nuit est à nous. Explore tant que tu veux ; quand tu voudras dormir, viens près de moi : je veillerai. | Va voir la plage, si tu veux. Quand tu auras sommeil, reviens près du feu : je veille. | Plus d'« Explore ». |
| COACH.sleep | aide | la nuit | Touche Brume pour dormir : elle veille sur le feu. | Touche Brume pour dormir : elle veille sur le feu. | Gardée. |

### 3.11 Les quêtes réussies loin de l'île (`questTip`)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| questTip (Brume) | Brume | une quête faite dans le Grimoire | « ${label} » : c'est fait ! Je l'ai senti d'ici. Viens sur l'île : j'ai ${coins} écus pour toi. | Je l'ai senti d'ici. Viens me voir sur l'île. | « Je l'ai senti d'ici » est gardé (beau) ; « C'est fait ! » et les chiffres partent. |
| **questTip (aide)** | aide | idem | — | « ${label} » : accomplie. ${coins} écus t'attendent auprès de Brume. | Le libellé et les écus, dans l'aide. |

---

## 4. Les points tranchés (14 octobre : oui aux quatre recommandations)

1. **L'heure du réveil.** Votre ouverture montre une plage « paradisiaque » et fait dire au joueur « je sens que la nuit va être froide » : il se réveille avant la nuit. La bible dit « la nuit, dans le froid ». **Je recommande le couchant** : le réveil dans la lumière dorée, la nuit qui tombe pendant la séquence (elle tombe au geste « Lever les yeux »). À reporter dans la bible (§ 7.1, § 9).
2. **Le genre du joueur.** L'avatar peut être un homme ou une femme, et le code ne dit pas lequel aux textes (à vérifier par l'autre agent). Je recommandais qu'aucune réplique ne l'accorde. **Tranché autrement** : le jeu connaît le genre ; on écrit les deux formes (« arrivé|arrivée »), et arrivee.2 reprend le mot de l'auteur.
3. **Les gestes dans les scènes.** Pour tenir la règle des six bulles, je propose quatre gestes ciblés : « Avancer » (arrivee.4), « T'approcher » (arrivee.11), « Lever les yeux » (jour.6), « Suivre Brume » (cercle.4). Ils comptent comme une reprise de main. Si le compte est déjà signé (pas de page de garde), `souffle` et `jour` s'enchaînent : je propose alors « Tourner la page » entre les deux. **Recommandé : oui à ces gestes.** Sinon, il faudra couper dans votre texte.
4. **« VivantE ! »** est gardé tel quel, majuscule comprise : c'est votre trait, et il se lit bien dans une bulle. Je le signale seulement parce que c'est la seule entorse typographique du jeu.

---

## 5. Pour l'autre agent (rien n'est à intégrer avant le « oui » de l'auteur)

- Trois scènes nouvelles (`jour`, `cercle`, `epave`) et leurs images (§ 2) ; deux répliques supprimées (`brasier-brume`, `brasier-nuit`).
- Le joueur parle : il faut un locuteur « le joueur », affiché avec son nom, à côté des pensées en italique (décision 1).
- Des lignes d'aide nouvelles : `COACH.nom`, `COACH.sceau`, `COACH.tab-ile`, `questTip` (aide).
- `TAB_OPENED.sceau` passe de une à deux bulles.
