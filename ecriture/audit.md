# Brumelune — l'audit du texte

> Chaque réplique que lit le joueur aujourd'hui (décision 13 : le périmètre complet), avec un verdict et sa raison.
> - **Garder** : on ne touche à rien.
> - **Élever** : même idée, même place ; on resserre la langue ou on retire un défaut précis.
> - **Réécrire** : l'idée reste, le texte change.
> - **Supprimer** : la réplique disparaît ; la raison dit ce qui la remplace, s'il y a quelque chose.
>
> La colonne « Lot » dit où la réécriture sera proposée (`lots/NN_nom.md`). Les références « ton § » renvoient à `ton.md`, et les décisions de l'auteur à `ton.md` § 0.
>
> **Hors périmètre de cet audit** : les libellés d'interface (boutons, menus, réglages, messages d'erreur), sauf quand un personnage les dit ; les libellés des quêtes, qui viennent du serveur et ne sont pas dans ce dépôt (voir « Suivi » à la fin).

> **Les chemins ont changé le 14 octobre** : l'autre agent a rangé tous les textes du jeu dans `src/texts/`, sans changer un mot. Correspondance pour les fichiers cités ci-dessous :
>
> | Avant | Maintenant |
> |---|---|
> | `src/game/vigils.js`, `anya.js`, `opus.js`, `minigames.js` | `src/texts/game/vigils.js`, `anya.js`, `opus.js`, `minigames.js` |
> | `src/world/chest.js` (les mots d'Héliane) | `src/texts/world/chests.js` |
> | `src/world/friends.js` | `src/texts/world/friends.js` |
> | `src/world/strays.js` (le bilan du matin) | `src/texts/world/nights.js` |
> | `src/world/bestiary.js`, `landmarks.js`, `climates.js` | `src/texts/world/bestiary.js`, `landmarks.js`, `climates.js` |
> | `src/utils/failLine.js` | `src/texts/game/failLine.js` |
> | `NightSheet.vue`, `SiteOverview.vue` | (à retrouver dans `src/texts/world/screens/`) |

## Bilan

| Verdict | Lignes de tableau |
|---|---|
| Garder | 135 |
| Élever | 90 |
| Réécrire | 83 |
| Supprimer | 14 |

Ce sont des lignes de tableau, pas des répliques : certaines lignes regroupent plusieurs répliques au même verdict (les gestes de l'aide gardés, les 33 fiches de bêtes, les traces d'Anya…).

Les défauts les plus fréquents :
1. **Les personnages lisent l'interface** (Brume surtout) : boutons, onglets, chiffres, « +10 % ».
2. **Le verbe du Grimoire** : « fabriquer », « faire naître » au lieu d'« écrire » (décision 12).
3. **Le registre « choupi » des égarés** : « petit », « tout mou », « ont boudé ».
4. **Les onomatopées** : « Zzz… », « Blub ! », « Bzz ! », « Cot cot ! », « Meuh ! », « Plouf ! », et les « clic, tac » de Jovin.
5. **La grammaire cassée de Freya** (décision 15).
6. **Les surnoms de Marcelle** à chaque phrase (décision 17).
7. **Des scènes résumées, pas jouées** : les liens des veillées ne sont qu'une phrase de narration.

Ce qui est déjà au bon niveau, et qu'on garde : les traces d'Anya, la plupart des répliques de Saturnin, Marcelle et sa chaise vide (« Il manque une chaise… »), Brume qui compte (« Je n'avais jamais compté plus loin qu'un. »), Jovin et ses poules (« J'ai pris un coup sur la tête »), Réglisse qui juge, les mots drôles d'Héliane.

---

## 1. `src/texts/tutorial/scenes.js` — les scènes (`SCENES`)

### 1.1 `naufrage`

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| naufrage.0 | légende | L'Hirondelle, troisième nuit de croisière. | Garder | Le lieu et le temps, sans un mot de trop. | 01 |
| naufrage.1 | Le haut-parleur | Mesdames et messieurs, le commandant vous prie de regagner… krrr… vos cabines… | Réécrire | Remplacé par l'annonce du capitaine (décision 2). | 01 |
| naufrage.2–3 | images | (la vague, le noir) | Élever | On y ajoute les racines sous l'eau (décision 3). | 01 |
| naufrage.4 | pensée | Du sable dans la bouche. La mer. Rien d'autre. | Élever | La sensation reste ; s'y ajoute « Où suis-je ? », le réveil de l'auteur. | 01 |
| naufrage.5 | pensée | Ohé ? … Quelqu'un ? | Supprimer | L'ouverture de l'auteur passe par les débris et « Oh non… » ; l'absence des autres vient plus tard (« Je ne vois personne »). | 01 |
| naufrage.6 | pensée | Seule la mer répond. Dans ma poche, un carton trempé : ma carte d'embarquement. | Réécrire | La carte est sur le sable, aperçue au loin ; « Super… » (décision 4). | 01 |

### 1.2 `arrivee`

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| arrivee.0 | pensée | Une lumière, là-bas ! Une lanterne… On me cherche ! | Réécrire | Le joueur crie à voix haute et prend Brume pour une étoile (décisions 1 et 6). | 01 |
| arrivee.1 | pensée | Ce n'est pas une lanterne. Les marins disent que les feux follets égarent les voyageurs. | Supprimer | Absent de l'ouverture de l'auteur. Le folklore revient avec Marcelle, qui a peur des feux follets (lot 02). | 01 |
| arrivee.2 | Brume | Tu me vois. … Tu me vois vraiment ? | Élever | Devient la réplique de l'auteur : « Tu… Tu peux me voir ? Et me parler ?! » | 01 |
| arrivee.3 | Brume | Brume. C'est ainsi qu'ils m'appelaient, ceux d'avant. | Réécrire | Remplacé par « VivantE ! Je suis une fille, et je m'appelle Brume. » La graine de « Qui est Brume ? » (bible § 7.5) passe par « Avant, j'étais autre chose ». | 01 |
| arrivee.4 | Brume | Là, il y avait un village. Des rires, le soir. De la soupe. | Supprimer | Son contenu passe dans le souvenir du cercle de flammes (« Ils parlaient, dansaient, chantaient, riaient »). | 01 |
| arrivee.5 | Brume | Puis le ciel a brûlé, une nuit. Après… ils ont oublié, et la brume a tout pris. | Réécrire | Remplacé par le blanc de l'auteur : « Quel jour ? » — elle regarde le ciel sans rien dire. C'est plus fort, parce que rien n'est dit (bible § 7.5 à corriger). | 01 |
| arrivee.6 | Brume | Ton bateau… Pardon. Je crois que c'est ma faute. Je ne sais pas pourquoi. | Supprimer | Contraire à la décision 7 bis : elle nie d'abord ; le doute vient le soir. | 01 |
| arrivee.7 | Brume | Reste près de moi. Je ne suis pas bien chaude, mais je brille. | Réécrire | Devient la réplique de l'auteur, à sa place (« Je ne réchauffe pas beaucoup, mais je brille »). | 01 |
| arrivee.8 | Brume | Je le garde depuis toujours. Je n'ai jamais su le lire. Eux savaient. | Réécrire | Devient « Moi, je ne le comprends pas. Je le garde pour celui qui doit le recevoir », après le Vent. | 01 |
| arrivee.9 | Brume | Il ne s'est jamais ouvert pour moi. Jamais. … Toi, peut-être ? | Réécrire | Devient « Regarde. Peut-être que toi, tu comprendras. » | 01 |

### 1.3 `souffle`

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| souffle.0 | Brume | … Qu'est-ce que tu as fait naître ? | Réécrire | Devient « Toi aussi, tu sais commander aux éléments ?! » (l'auteur). | 01 |
| souffle.1 | Brume | Ils faisaient ça, ceux d'avant. Ils fabriquaient, et l'île répondait. | Réécrire | « Fabriquaient » (décision 12) ; devient « Tu es comme eux ! » | 01 |
| souffle.2 | Brume | Tout ce que tu feras naître reviendra. Les arbres, les bêtes… tout ce que la brume a pris. | Supprimer | Elle explique la règle du jeu. L'auteur dit mieux : « Il y a d'autres choses dans ce livre, mais il faudra être patient. » | 01 |

### 1.4 `nuit`

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| nuit.0 | Brume | Je n'ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n'ai pas froid. | Garder | Le non-dit juste ; un écho de « Je ne réchauffe pas beaucoup ». | 01 |
| nuit.1 | pensée | Le feu tient. Pour cette nuit, cette plage suffira. | Garder | Concret, sobre. | 01 |
| nuit.2 | pensée | Une étoile file. Brume détourne les yeux. | Élever | Le texte reste ; c'est une didascalie, pas une pensée : à montrer comme légende. | 01 |
| nuit.3 | Brume | Dors. Je surveille la brume. | Garder | Prend un double sens avec la décision 3 (la brume regarde, Brume la regarde aussi). Déplacée en fin de scène. | 01 |
| nuit.4 | Brume | Là-bas, quelqu'un… n'ose pas venir. La nuit fait peur, quand on est seul. | Réécrire | La seconde phrase dit la morale, et Brume y parle d'elle-même. | 01 |
| nuit.5 | Brume | Je veille sur nous deux ; demain, on lui fera une place près du feu. | Élever | Plus court ; « Dors » ferme la scène. | 01 |

### 1.5 `recolte` (Hermine)

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| recolte.0 | Hermine | Ho, toi ! Tu étais sur l'Hirondelle ? Alors donne-moi la main : la mer m'a lessivée ! | Élever | Un appel de marin (« Ho, du feu ! ») ; elle vient de l'épave poussée sur les rochers (décision 10). | 02 |
| recolte.1 | Hermine | Hermine, navigatrice. Officier de quart, pour être exacte. J'ai nagé vers ton feu toute la nuit. | Garder | Sa voix, et la silhouette de la décision 5 confirmée. | 02 |
| recolte.2 | Hermine | La mer rend ce qu'elle a pris. Un ponton, une ligne, et je te montre ce qu'elle garde encore ! | Élever | Un point d'exclamation de trop ; le motif « La mer rend » revient trois fois dans la journée. | 02 |

### 1.6 `cannelle` (Marcelle)

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| cannelle.0 | Marcelle | Trois nuits que je regarde ton feu depuis les rochers. Je n'osais pas… à cause de lui. | Élever | Elle arrive après deux nuits (« Trois autour du feu. Hier encore, on était deux. ») : « Deux nuits ». | 02 |
| cannelle.1 | Marcelle | Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine. | Garder | L'humour sec, la voix entière. | 02 |
| cannelle.2 | Marcelle | Les marmites, la cuisine du bord… Marcelle ! Je m'appelle Marcelle. Cuisinière, et pas des pires. | Garder | Le souvenir qui revient, avec aplomb. | 02 |
| cannelle.3 | Marcelle | Un feu follet ! … Oh. Il a des yeux de chiot, celui-là. | Réécrire | « Des yeux de chiot » est une mignonnerie. Elle porte plutôt le folklore des marais (repris de arrivee.1). | 02 |
| cannelle.4 | Brume | Elle. | Garder | L'aplomb vexé, le même que « VivantE ! ». | 02 |

### 1.7 `rivet` (Jovin)

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| rivet.0 | Jovin | Une soupe. Je sens une soupe. Sur une île déserte. | Garder | — | 02 |
| rivet.1 | Jovin | Soit j'ai pris un coup sur la tête, soit… Non. J'ai pris un coup sur la tête. | Garder | Son humour, à plat et assumé. | 02 |
| rivet.2 | Jovin | Jovin. Horloger. Je répare ce qui se répare. Ton feu tousse : le vent entre par là, et par là. | Garder | — | 02 |
| rivet.3 | Jovin | Je monte un établi près du feu : avec lui, tout devient possible. Ou presque. | Élever | « Tout devient possible » sonne comme un slogan. | 02 |
| rivet.4 | Jovin | Commençons petit : une lanterne. Le petit, je sais encore faire. | Garder | Le non-dit de l'incendie (bible § 8.2). | 02 |

### 1.8 `ondin` (Pierrot)

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| ondin.0 | Brume | Chut. Celui-là, la brume l'a bercé longtemps. | Élever | « Bercé » est trop doux depuis la décision 3 : la brume « garde », elle ne berce pas. | 02 |
| ondin.1 | Pierrot | J'ai dormi combien de temps ? L'eau a un goût de nuage. | Garder | — | 02 |
| ondin.2 | Marcelle | Mon caneton ! Mon caneton ! | Élever | Une fois suffit ; la voix qui se brise vaut mieux que le cri. | 02 |
| ondin.3 | Pierrot | Tatie ? … C'est toi, Tatie ? | Élever | Le mot d'enfant reste une fois ; on ajoute un détail concret au lieu de la répétition. | 02 |

### 1.9 `campement`

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| campement.0 | Marcelle | Tiens. On ne reconstruit pas une île en guenilles. | Garder | — | 02 |
| campement.1 | Brume | Un, deux, trois, quatre, cinq… | Garder | — | 02 |
| campement.2 | Brume | Je n'avais jamais compté plus loin qu'un. | Garder | Le meilleur non-dit du jeu. | 02 |
| campement.3 | Brume | Le feu, l'eau… Il manque un toit. Et le bois flotté s'épuise déjà. | Élever | La seconde phrase est de la logique de jeu ; la fin doit retomber doucement. | 02 |

---

## 2. `src/texts/tutorial/scenes.js` — les répliques sur l'île (`LINES`)

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| vent | Le Grimoire | « Mêle l'Air à l'Air, et nomme ce qui naît. » | Garder | La voix du livre, juste (ton § 4.15). | 01 |
| nom | Brume | Signe le Grimoire : ton île sera gardée, et tu la retrouveras sur n'importe quel appareil. | Réécrire | Brume lit l'interface (« appareil ») ; la partie technique passe à l'aide. | 01 |
| greve | Brume | Le Vent a chassé la brume du rivage ! Viens voir la plage de Brumelune : ta première page mérite sa récompense. | Réécrire | « Récompense », mode d'emploi ; la trouée (décision 8). | 01 |
| greve-feu | Brume | Le Vent et le Brasier sont écrits ! Viens sur la plage avant la nuit : tes pages méritent leur récompense, et le feu nous attend. | Réécrire | Idem ; la scène de l'épave fait déjà le lien. | 01 |
| ile | Brume | Voici Brumelune, notre île. La brume a tout endormi… Pour la réveiller, fabrique : le Grimoire garde les recettes. La première t'attend ! | Réécrire | « Fabrique » (décision 12), mode d'emploi, « Voici » de guide touristique. | 01 |
| claim | Brume | Je brille ! Touche-moi : ce que tu as fait mérite quelque chose. | Élever | Le geste reste, la phrase devient la sienne. | 01 |
| dormir | Brume | La nuit est à nous. Explore tant que tu veux ; quand tu voudras dormir, viens près de moi : je veillerai. | Élever | « Explore » est un mot d'interface. | 01 |
| caisse | Hermine | Ma caisse ! Elle a nagé moins vite que moi. Aide-moi à l'ouvrir. | Garder | Humour sec. La caisse vient de l'épave (décision 10). | 02 |
| tresors | Hermine | Ma longue-vue… intacte. Et mon filet ! Le reste, on le gagnera. | Garder | — | 02 |
| rend | Brume | La mer rend ce qu'elle a pris. C'est toi qui l'as dit. | Garder | Le rappel tendre. | 02 |
| installe | Hermine | Là, face à la mer : c'est là que je m'installe. | Garder | — | 02 |
| rivage | Hermine | Viens au rivage. Relie ce qui se ressemble, vite, avant la marée. | Élever | « Relie ce qui se ressemble » est la règle de la Récolte : elle passe à l'aide. | 02 |
| bois-ponton | Hermine | Pas mal, pour un naufragé. Il nous faut vingt-cinq bois pour mon ponton. | Élever | Le chiffre passe à l'aide. | 02 |
| ponton-bois | Hermine | Un ponton, et la mer devient un chemin. | Garder | — | 02 |
| ponton-tient | Hermine | Il tient ! Mon premier ponton à moi. | Élever | « À moi » est enfantin pour une officière. | 02 |
| ponton-promesse | Brume | Il brille dans la brume… comme une promesse. | Réécrire | Comparaison toute faite ; Brume compte les lumières (ton § 4.1). | 02 |
| chemin-camps | Hermine | Deux camps, un seul feu. Un chemin, et plus personne ne se mouille les pieds. | Garder | — | 02 |
| chemin-pieds | Brume | Un chemin ! Les pieds le retrouvent, même dans la brume. | Élever | Le point d'exclamation de trop. | 02 |
| voisins | Hermine | Voilà. Deux pas, et on est voisins. | Garder | — | 02 |
| joli-camp | Hermine | Naufragés, d'accord. Mais rien n'interdit d'avoir un joli camp. | Garder | — | 02 |
| egares-nuit | Brume | Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils ne sont pas méchants : ils cherchent ce qui brille, et marchent tout droit. | Réécrire | « Ils ne sont pas méchants » explique ; le registre des égarés (ton § 4.13). | 03 |
| egares-nord | Brume | Ils viennent de la brume, de partout. Un enclos autour du feu, et ils font demi-tour. | Élever | Mode d'emploi ; moins sûr d'elle. | 03 |
| cachons | Brume | Chut… Cachons-nous. Ne bouge plus. | Garder | La peur vraie, en quatre mots. | 03 |
| egare-la | Brume | Chut… Là, au bord de la brume. Un égaré. | Garder | — | 03 |
| visiteurs | Brume | Ils viennent parfois, quand le feu baisse. Des égarés… Mieux vaut ne pas trop s'en approcher. | Élever | Le conseil passe ; reste le constat. | 03 |
| cloture-voyez | Brume | Vous voyez ? Une clôture ne fait de mal à personne. Elle dit seulement : pas par ici. | Réécrire | La morale dite tout haut. | 03 |
| aster-dormir | Hermine | Je dormirai mieux, ce soir. | Garder | — | 03 |
| cloture-deux | Brume | Une clôture, ça décore… ou ça protège. Bien placée, les deux à la fois. Plante-la tout autour du feu. | Réécrire | Le mode d'emploi. | 02 |
| chez-nous | Brume | Ça ressemble à un chez-nous. | Garder | — | 02 |
| cuisiner | Hermine | On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner. | Garder | — | 02 |
| manger | Brume | Moi, je ne mange pas. Ça n'aide pas, je sais. | Garder | Humour sec. | 02 |
| debrouiller | Hermine | Demain, on se débrouillera. Ou quelqu'un viendra, qui sait faire. | Garder | — | 02 |
| soir | Brume | Deux, ce soir, autour du feu. Dors : je veille. | Garder | Brume compte. | 02 |
| epaves | Brume | La mer a rendu deux bois flottés et un galet. Ramasse tout : ce sera notre premier feu. | Réécrire | Les chiffres passent à l'aide ; les galets sont les pierres du vieux cercle. | 01 |
| chaine | Brume | Plus la chaîne est longue, plus l'île te donne. Elle aime ça, je crois. | Élever | La règle passe à l'aide ; « Elle aime ça, je crois » reste. | 02 |
| brasier-brume | Brume | La brume s'est levée du rivage… C'est la mienne, tu sais. Je la laisse filer depuis si longtemps que j'ai oublié comment la retenir. | Supprimer | Remplacé par la scène de l'épave (le doute, décision 7 bis). | 01 |
| brasier-nuit | Brume | La nuit tombe : il nous faudra un feu. Le Brasier dort dans ce livre, lui aussi. | Supprimer | Remplacé par la scène du cercle de flammes. | 01 |
| feu-pret | Brume | Le Brasier est écrit, le bois et le galet ramassés : bâtissons le feu, là, avant la nuit. | Réécrire | Une liste de cases cochées. | 01 |
| cendres | Brume | Il nous faut un feu pour la nuit. Le Brasier du Grimoire, le bois et les galets ramassés : de quoi bâtir un feu qui tiendra. | Réécrire | Idem (ancien parcours). | 01 |
| flambe | Brume | Il flambe ! Avec lui, la nuit peut venir. | Élever | L'écho du cercle : « les flammes orange ». | 01 |
| faim-aster | Hermine | Une cuisinière ! Brume, dis-moi que je ne rêve pas. | Garder | — | 02 |
| faim-cannelle | Marcelle | Moi, c'est ton ventre qui me fait rêver, ma brindille. On l'entend crier famine jusqu'aux rochers. | Réécrire | Le surnom (décision 17) ; le gag du ventre. | 02 |
| faim-bulle | Brume | Elle a raison. Regarde au-dessus d'elle : quand quelqu'un a besoin de toi, une bulle te le dit. | Réécrire | Brume lit l'interface : la bulle passe à l'aide. | 02 |
| bulle | Marcelle | Des coquillages crus ? Ma brindille, on n'est pas des sauvages. Donne : je te fais une soupe. | Garder | La première « brindille », moqueuse : celle-ci reste (décision 17). | 02 |
| soupe | Marcelle | Une soupe… Une cuillère pour le corps, une pour l'âme. | Garder | — | 02 |
| bulles-reviennent | Brume | Les bulles reviennent, tu sais. On a toujours un peu faim, ou froid, ou envie de parler. | Élever | « Les bulles » est un mot d'interface ; la seconde phrase est belle. | 02 |
| brume-avale | Marcelle | Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d'autres naufragés ? | Garder | La faute qui grandit (décision 7 bis). | 02 |
| brume-retient | Brume | Peut-être. Je ne la retiens plus très bien. Ce qui y entre, je ne le vois pas toujours ressortir. | Garder | Le doute, juste ; plus inquiétant depuis la décision 3. | 02 |
| caquets-eau | Hermine | Chut ! Des caquets… sur l'eau ! Prends ma longue-vue. | Élever | Deux points d'exclamation. | 02 |
| mes-filles | Marcelle | Mes filles ! Caramel, Flocon, Réglisse ! Elles ont tenu bon ! | Élever | Trois points d'exclamation. | 02 |
| doucement | Marcelle | Doucement, mes jolies ! Attrape-les, ma brindille, elles ont eu peur. | Réécrire | Diminutif et surnom. | 02 |
| tout-le-monde | Marcelle | Caramel, Flocon, Réglisse… Tout le monde est là. | Garder | — | 02 |
| deux-vivres | Marcelle | Elles ont faim, les pauvres. Deux vivres chacune. | Réécrire | « Les pauvres » ; le chiffre passe à l'aide. | 02 |
| recolte-nourrit | Marcelle | La Récolte nourrit aussi, ma brindille. | Élever | Le surnom. | 02 |
| un-toit | Marcelle | Il leur faut un toit. Un petit poulailler, là, dans l'herbe, près de ma cuisine. | Garder | — | 02 |
| un-coq | Marcelle | Un toit, du grain… Il ne leur manque qu'un coq, à mes filles. Un jour. | Garder | — | 02 |
| village | Brume | Un toit pour les poules, un feu pour nous. Ça devient un village, tu sais. | Garder | — | 02 |
| marmite | Marcelle | Mes filles ont un toit. Moi, je dors sur une marmite renversée… mais je ne me plains pas. | Garder | Validé le 13 oct. ; l'humour juste. | 02 |
| se-plaint | Brume | Elle se plaint un peu. Bâtis-lui un abri, à côté de sa cuisine. | Garder | — | 02 |
| toit-a-moi | Marcelle | Un toit à moi… Ma brindille, tu vas me faire pleurer dans la soupe. | Garder | La deuxième « brindille », émue : elle reste. | 02 |
| cuisines | Brume | Les égarés aiment les cuisines. Un enclos autour de la sienne, et elle dormira tranquille. | Élever | « Aiment » : ils cherchent ce qui brille, le feu de la cuisine (ton § 4.13). | 03 |
| casseroles | Marcelle | Et pas de piquet dans mes casseroles, hein. | Garder | — | 02 |
| en-ville | Marcelle | Une cuisine avec une clôture. On se croirait en ville ! | Garder | — | 02 |
| a-table | Marcelle | À table ! Ce soir, on mange chaud. | Garder | — | 02 |
| trois-feu | Hermine | Trois autour du feu. Hier encore, on était deux. | Garder | — | 02 |
| chaise | Marcelle | Il manque une chaise… celle de mon Pierrot. Mangez, avant que ça refroidisse. | Garder | Parfait : la peine dite par un plat. | 02 |
| soir-trois | Brume | Trois, ce soir. Dors : je veille. | Garder | — | 02 |
| puzzle | Jovin | Chaque pièce a sa place. Tourne, essaie. Clic ! | Élever | « Clic » en ponctuation (décision 16). | 02 |
| torches-idee | Jovin | Hier soir, ils sont venus de trois côtés. Trois torches, une par côté. Clic, clic, clic. | Réécrire | Les trois « clic ». | 02 |
| torches-tiennent | Jovin | Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient. | Garder | Son tic juste. | 02 |
| quatre-feu | Jovin | Quatre autour d'un feu. Tac. Il nous faudra une plus grande marmite. | Élever | Le « Tac ». | 02 |
| soir-quatre | Brume | Quatre, ce soir. Dors : je veille. | Garder | — | 02 |
| or | Jovin | Ta clôture dit « pas par ici ». Une lanterne dit « viens, petite luciole ». Pose-la là où l'île brille d'or. | Réécrire | « Petite luciole » ; « là où l'île brille d'or », ce sont les cases dorées (interface). | 02 |
| souci | Marcelle | Mon Pierrot… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Il sait nager, hein ? | Garder | — | 02 |
| planche-vue | Hermine | Ohé ! Là, sur la vague… une planche ! Et quelqu'un dessus ! | Élever | Trois points d'exclamation. | 02 |
| planche-dort | Hermine | Un enfant… Il dort ! La vague l'a posé tout doucement sur le sable. | Élever | « Il dort ! » : la surprise suffit sans le point. Et « la vague » : les racines ? (décision 3 ; à trancher au lot 02) | 02 |
| source | Marcelle | De l'eau douce, il nous faudrait… Là-bas, au nord-ouest, une région brille encore dans la brume. Fais-la naître, et elle sera à nous. | Supprimer | Plus appelée nulle part (vérifié au lot 02) ; « Fais-la naître » voulait dire « achète-la ». | 02 |
| baguette | Pierrot | Avant, ma baguette tirait vers l'eau. Là, plus rien. Comme si on avait éteint la lumière, dedans. | Garder | — | 02 |
| ruban | Brume | La brume lui a pris son savoir. Le livre, lui, s'en souvient. | Garder | — | 02 |
| chut | Pierrot | Chut… l'eau arrive. | Garder | — | 02 |
| produit | Marcelle | Ça, mon caneton, c'est de l'eau. | Garder | Le surnom de Pierrot, à sa place. | 02 |
| glisse | Pierrot | L'eau, je la porte jusqu'au feu… mais l'herbe mouillée, ça glisse ! Mes seaux se renversent. Il me faudrait un chemin. | Réécrire | Il énonce le mécanisme ; un enfant rêveur dirait autre chose. | 02 |
| pierres | Brume | Un chemin, ça se trace : du Puits jusqu'au sentier du Feu. Les premières pierres sont offertes. | Réécrire | Le mode d'emploi passe à l'aide. | 02 |
| sentier | Pierrot | Un vrai chemin ! Mes seaux arrivent pleins. Les autres, tu les traceras où tu veux. | Élever | La seconde phrase est du mode d'emploi. | 02 |
| pluie-brume | Brume | Ta Pluie tombe sur l'île. Regarde Pierrot. | Garder | — | 02 |
| pluie-ondin | Pierrot | Elle a frémi. Là. … Elle n'avait plus bougé depuis que j'ai rêvé de la mer. | Garder | — | 02 |
| athanor-trois | Brume | L'Athanor s'élargit. Une place de plus. Ceux d'avant y mêlaient trois souffles, parfois… je l'avais oublié. | Garder | — | 02 |
| athanor-quatre | Brume | Quatre places, maintenant. Air, Eau, Feu, Terre… Il ne manquait que quelqu'un pour les tenir ensemble. | Garder | — | 04 |
| bouteille-ecume | Hermine | Là, dans l'écume ! Une bouteille. La mer rend ce qu'elle a pris. | Garder | — | 02 |
| bouteille-courant | Hermine | Le courant tourne quatre fois par jour. À chaque fois, il laisse quelque chose sur nos plages. Guette-les. | Garder | Une règle de jeu dite comme un savoir de marin : c'est permis. | 02 |
| bouteille-brume | Brume | Ma brume avale les navires… Ce qu'elle ne sait pas garder, la mer le recrache. Du verre, des caisses. Des mots, parfois. | Garder | La faute (décision 7 bis). | 02 |
| bouteille-h | Brume | « H. »… Ce H, je l'ai sur le bout de la flamme. | Garder | — | 02 |
| bouteille-phare | Hermine | « Allume les lumières. » Ma grand-mère gardait un phare : elle disait pareil. | Garder | — | 02 |

---

## 3. `src/texts/tutorial/coach.js` — la ligne d'aide

Le registre de l'aide (ton § 3.3) : il est presque partout respecté. Les lignes non citées sont **à garder** telles quelles (gestes purs : « Touche « Bâtir ». », « Prends cette pièce. », etc.).

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| book.plans.feu | Le feu de camp naît d'un mélange : fais naître « ${plan} » dans l'Athanor. Le ruban du Grimoire te montre quoi mêler. | Élever | « Écris » (décision 12). | 01 |
| book.plans.puits-ondin | Le Puits naît d'un mélange : fais naître « ${plan} » dans l'Athanor. Le ruban du Grimoire te montre quoi mêler. | Élever | Idem. | 02 |
| book.plan | Ce chantier naît d'un mélange : fais naître « ${plan} » dans l'Athanor. Suis le ruban. | Élever | Idem. | 02 |
| aster-eau.aster | Quelqu'un dans l'eau ! Va l'aider. | Élever | L'aide ne s'exclame pas. | 02 |
| nom (nouvelle ligne) | — | Réécrire | Reçoit la partie technique de « nom » (Brume) : le nom garde l'île sur tous les appareils. | 01 |
| (nouvelles lignes) | — | Réécrire | Reçoivent les règles retirées aux personnages : la Récolte (relier), les chiffres (bois, vivres), les bulles de besoin, les cases dorées. | 02 |

---

## 4. `src/texts/tutorial/cooking.js` — la marmite de Marcelle (validée le 13 oct.)

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| title, rule.*, hint.*, items.*, later, next | (consignes) | Garder | — | — |
| open | Des coquillages, des algues, un fond d'eau de mer… Ce n'est pas la cuisine du bord, mais regarde bien, ma brindille. | Élever | Le surnom : les deux qu'on garde sont ailleurs (décision 17). | 02 |
| plouf | Plouf ! | Supprimer | Onomatopée : l'éclaboussure à l'image suffit. | 02 |
| fast | Doucement ! | Garder | — | — |
| end | Goûte, toi. Moi, je sale toujours trop… à ce qu'on dit. | Garder | Le goût perdu, sans le dire : parfait. | — |
| go | C'est parti ! | Élever | Le ton d'animatrice : « Commencer ». | 02 |

## 5. `src/texts/tutorial/henChase.js` — la chasse aux poules (validée le 13 oct.)

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| title, open, rule, cards.*, later, next, hint | (validés) | Garder | « Réglisse fait ce qu'elle veut », « elle te pardonnera. Peut-être. » : le bon niveau. | — |
| squawk | Cot ! / Cot cot ! | Supprimer | Onomatopée : des plumes à l'image. | 02 |
| end | Les voilà toutes ! | Élever | « Les voilà toutes. » | 02 |
| go | C'est parti ! | Élever | « Commencer ». | 02 |

## 6. `src/texts/tutorial/tabs.js` — les onglets

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| TAB_OPENED.world | Brume | Le vent a chassé la brume de la plage de Brumelune. Touche « Île », en bas : pour cette nuit, on reste près du rivage. | Réécrire | Brume nomme l'onglet : il passe à l'aide. | 01 |
| TAB_OPENED.sceau | Brume | Ton nom est écrit au Grimoire. Ton sceau t'attend, avec tout ce que tu accompliras. | Élever | « Ton sceau t'attend » parle de l'onglet. | 01 |
| TAB_OPENED.timer | Brume | Les Défis s'ouvrent : des énigmes contre le sablier, pour gagner des écus. Touche « Défis » quand tu veux. | Réécrire | Le mode d'emploi en entier. | 02 |
| PLAN_WRITTEN.text | Brume | Tu as fait naître « ${plan} » dans l'Athanor ! Retourne sur l'île : le chantier peut se bâtir. | Réécrire | « Fait naître » (décision 12), mode d'emploi. | 01 |
| PLAN_WRITTEN.action, TAB_CALLS.* | aide | (boutons, consignes) | Garder | — | — |

## 7. `src/texts/story.js` — les naufrages et les souvenirs

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| WRECK_TEXTS.lisiere | Brume | Cette nuit, un autre bateau s'est brisé… Un radeau de bois flotté, à l'ouest. | Réécrire | **Contraire à la v6** : Freya est une ancienne naufragée, sans naufrage (bible § 6.7). Devient la lueur dans les arbres. | 04 |
| WRECK_TEXTS.colline | Brume | Cette nuit, un autre bateau s'est brisé… Un caboteur chargé de pierres, au nord-est. | Réécrire | Idem pour Saturnin : le ciseau qu'on entend tailler la pierre. | 04 |
| WRECK_TEXTS.jardins | Brume | Cette nuit, un autre bateau s'est brisé… Une barque pleine de graines, au nord. | Élever | Le seul vrai naufrage (Flore) ; Brume y dit « ma brume » (la faute). | 04 |
| MEMORY_LINES.souvenir-ondin | Pierrot | Là ! Ça tire ! L'eau est là-dessous ! Ma baguette se souvient. | Élever | Trois points d'exclamation ; Pierrot chuchote. | 02 |
| MEMORY_LINES.souvenir-sylve | Freya | Arbre… Je me souviens. Ma forêt. Mes mains savent planter. | Garder | Déjà « peu de mots, jamais faux » (décision 15). | 04 |
| MEMORY_LINES.bosquet | Freya | Mon Bosquet garde le bois mort pour toi. À la Récolte, chaque bûche comptera double. | Élever | La règle passe à l'aide (validé le 14 oct. : seule la seconde phrase bouge). | 04 |
| MEMORY_LINES.souvenir-galet | Saturnin | Hm. (Brume : “Il dit qu'il se souvient de la pierre. Et qu'il a faim.”) Hm ! | Élever | La forme de la traduction (guillemets, didascalie) ; le second « Hm » sans point d'exclamation. | 04 |
| MEMORY_LINES.eveil-melisse | Flore | Tes pages m'ont réveillée avant toi. La Plante… je m'en souviens. | Garder | — | 04 |
| MEMORY_LINES.souvenir-aster | Hermine | Un bateau… Par tous les alizés, je sais encore tenir une barre ! | Réécrire | Le grand moment de l'acte IV (son courage revient) mérite mieux qu'une exclamation. | 04 |

## 8. `src/texts/village.js` — le village

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| WORK_LINES.potager.0 | Flore | Chaque chose en sa lune. Les carottes aussi. | Garder | — | 04 |
| WORK_LINES.potager.1 | Flore | Tu entends ? Les courges se disputent encore. | Élever | Plus sec (ton § 4.9). | 04 |
| WORK_LINES.carriere.* | Saturnin | Hm. / Hm. Belle pierre. | Garder | — | — |
| WORK_LINES.bosquet.0 | Freya | Chut. Arbre dort. | Réécrire | Grammaire cassée (décision 15). | 04 |
| WORK_LINES.bosquet.1 | Freya | Graine, pousse… pousse… | Réécrire | Idem, et mièvre. | 04 |
| WORK_LINES.puits.* | Pierrot | Chut… l'eau parle. / Ma baguette tremble. Il y a de l'eau là-dessous. | Garder | — | — |
| WORK_LINES.ponton.0 | Hermine | Vent d'ouest ! Ça mord, aujourd'hui ! | Élever | Deux points d'exclamation ; une réplique seule pour Hermine : en proposer une deuxième. | 04 |
| WORK_LINES.atelier.0 | Jovin | Clic… tac… Attends. Voilà ! | Réécrire | Les onomatopées (décision 16). | 04 |
| WORK_LINES.atelier.1 | Jovin | Encore une vis et ça tourne. Tac ! | Élever | Le « Tac ». | 04 |
| WORK_LINES.foyer.0 | Marcelle | Ce qui mijote ne se presse pas ! | Élever | Un proverbe se dit sans point d'exclamation. | 04 |
| WORK_LINES.foyer.1 | Marcelle | Goûte-moi ça, ma brindille. Alors ? | Élever | Le surnom part ; l'idée reste et devient un non-dit (elle demande parce qu'elle ne sent plus rien). | 04 |
| HEN_LINES.* | fiche | (les sept fiches des poules) | Garder | Validées le 14 oct. ; « Réglisse ne pond pas. Elle juge. » est le bon ton. | — |
| COOP_LINES.* | Marcelle | (le coq, l'œuf, le poussin) | Garder | — | — |
| HENS_FREED | Marcelle | Mes filles ! Elles ont tenu bon ! | Élever | Comme mes-filles. | 02 |
| ANYA_RESTED | Anya | Va. La terre se repose aussi. Je repasserai. | Élever | « Je repasserai » est trop familier pour elle. | 04 |
| SOUNDS.* | bulles | Cot cot ! / Cocorico ! / Piou piou ! / Meuh ! / Bêêê ! / Groin groin ! / Mêêê ! | Supprimer | Onomatopées enfantines ; le son (s'il vient) et l'animation suffisent. | 04 |
| BEAST_NAMES.* | fiche | (les 33 bêtes, nom et ligne) | Garder | Sobres et justes (ton § 3.4). | — |
| BOOSTED_BY.* | aide | grâce au Bosquet… | Garder | — | — |
| VILLAGER_SAYS.asleep | habitant | Zzz… | Supprimer | Onomatopée : la pose « endormi » suffit, ou une didascalie *(Il dort.)*. | 04 |
| VILLAGER_SAYS.storm | habitant | L'orage gronde, mieux vaut rentrer ! | Réécrire | Une réplique commune à tous, qui efface les voix ; à écrire par personnage. | 04 |
| VILLAGER_SAYS.rain | habitant | Quel temps ! Heureusement, j'ai mon parapluie. | Réécrire | Personne n'a de parapluie sur une île de naufragés ; même défaut. | 04 |
| VILLAGER_SAYS.evening | habitant | Belle soirée… je rentre au Foyer. / Les étoiles sont de sortie. | Réécrire | Idem. | 04 |
| VILLAGER_SAYS.dawn | habitant | Bonjour ! Le jour se lève sur l'île. | Réécrire | Idem. | 04 |
| VILLAGER_SHEETS.*, TOUCH_HINTS.* | fiche, aide | (fiches courtes, gestes) | Garder | — | — |
| PET_SAYS.amie.short | familier | Bzz ! | Supprimer | Onomatopée. | 04 |
| PET_SAYS.amie.long | fiche | Une vraie abeille : Jovin l'a fabriquée pour Tic-Tac quand Abeille a été écrite. | Élever | « Une vraie abeille » qu'on fabrique : la phrase se contredit. | 04 |
| PET_SAYS.bocal.short | fiche | « Bulle est retourné dans la mer. » | Garder | — | — |
| PET_SAYS.bocal.long | fiche | Vide : « Bulle est retourné dans la mer. » Ce qu'on fabrique renaît… | Réécrire | « Fabrique » (décision 12) ; la morale. | 04 |
| PET_SAYS.bulle.short | familier | Blub ! | Supprimer | Onomatopée. | 04 |
| PET_SAYS.bulle.long | fiche | Le petit poisson de Pierrot, revenu quand Poisson a été fabriqué : ce qu'on fabrique renaît. | Réécrire | Idem. | 04 |
| UNKNOWN_BEAST | fiche | Une bête | Garder | — | — |

## 9. `src/texts/guide/tips.js` — Brume aux moments clés

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| grimoire | Sept chapitres… et presque tout dort encore. Les pages qui frémissent, tu sais déjà les écrire. Cherche-les. | Garder | Validé le 13 oct. ; le bon niveau. | — |
| reach | Oh… cette page frémit. Ce qu'elle cache, tu le connais déjà un peu. Lis l'indice, puis dépose les bons éléments dans l'Athanor. | Élever | La seconde moitié passe à l'aide. | 04 |
| fail | Pas encore… Moi aussi, je cherche longtemps mes mots. Les familles notées sur la page montrent la voie ; l'Encre révèle un ingrédient, et le nom se devine lettre par lettre. | Élever | « Moi aussi, je cherche longtemps mes mots » est parfait ; le reste passe à l'aide. | 04 |
| annexes | Ton bâtiment a grandi… il déborde presque ! Autour de lui, il y a de la place pour des champs, des filons, des viviers. Ouvre sa fiche, onglet Annexes, et pose-les toi-même : ce sont eux qui produisent le plus. | Réécrire | Brume lit l'interface. | 04 |
| friends | Ils ont tous un prénom, tu as vu ? Et des goûts, et des manies. Bavarde avec eux chaque jour, offre-leur ce qu'ils aiment : un cœur de plus, et ils voudront te faire un cadeau. Garde le doigt appuyé sur l'un d'eux pour ouvrir sa fiche. | Réécrire | Idem. | 04 |
| savoirs | Les maîtres se souviennent de choses que j'ai oubliées. Au premier bavardage du jour, chacun souffle un indice sur une page de son chapitre. Plus vous êtes proches, plus il est précis. | Élever | La première phrase reste ; le reste passe à l'aide. | 04 |
| bulle | Regarde le bocal de Pierrot… Bulle est revenu ! Tu vois ? Ce qu'on écrit renaît vraiment. | Réécrire | La morale dite tout haut. | 04 |
| bestiaire | Quelque chose bouge, là-bas… La bête que tu as écrite vit maintenant sur l'île. Cherche-la ! Le Carnet d'explorateur garde le Bestiaire. | Élever | Explication et interface. | 04 |
| bestiaireSylve | Bêtes… réveillées ! Bête fabriquée, bête vit. Arbres, eau, ciel : regarde. Le Carnet garde le Bestiaire. | Réécrire | Grammaire cassée (décision 15), « fabriquée » (décision 12). | 04 |
| needs | Quelqu'un a besoin de toi : regarde la bulle au-dessus de sa tête. Manger, des outils, quelques créations autour de son bâtiment… Comble-le depuis sa fiche : heureux, il travaille mieux (+10 % de production) ; négligé, moins bien. | Réécrire | « +10 % » dans la bouche de Brume. | 04 |
| visitor | Une voile ! Un bateau accoste au Ponton… entier. Son voyageur reste quelques jours, avec une demande : la bulle dorée au-dessus de sa tête. Garde le doigt appuyé sur lui pour ouvrir sa fiche : sa demande comblée, des écus t'attendent. | Réécrire | « Une voile ! … entier » reste ; le mode d'emploi part. | 04 |
| expedition | Ton expédition s'enfonce dans la brume… N'aie pas peur : je la connais, ma brume. À son retour, la terre explorée se dévoile, et tu pourras l'acheter. Une seule à la fois : la boussole, en haut à gauche, dit quand elle revient. | Réécrire | Mode d'emploi ; « N'aie pas peur » ; mais « je la connais, ma brume » est un beau mensonge involontaire (décision 3) à garder. | 04 |
| finds | Une trouvaille de climat… montre-moi ! Chaque climat a la sienne : glace, laine, roseau, sel, fruits, obsidienne, et ses gisements repoussent en quelques heures. Le sac, en haut à gauche, la garde à part : elle sert aux créations et annexes de climat. | Réécrire | Mode d'emploi. | 04 |
| games | Un jeu s'est ouvert ! Au palier III, le Ponton pêche, la Carrière creuse son filon, le Bosquet se cueille. Touche le bâtiment : « Jouer » est dans sa fiche, et chaque partie rapporte des écus. Je regarderai, moi. | Réécrire | Idem ; « Je regarderai, moi. » reste. | 04 |
| chapter-II | La Matière s'ouvre. Pétrir, fondre, forger… j'ai déjà vu des mains faire ça, il me semble. Sur l'île, La Colline peut sortir de la brume. | Garder | — | — |
| chapter-III | Ciel et Terre. Lève les yeux… il manque une étoile, là-haut. Je ne sais plus laquelle. Les Jardins, le Faubourg et les Hauteurs t'attendent. | Garder | L'indice de l'étoile, juste (bible § 7.5). | — |
| chapter-IV | Le Vivant s'éveille. Ça pousse, ça respire, ça bat… comme toi. La Crique et la Grande Forêt peuvent renaître. | Garder | — | — |
| chapter-V | Le Foyer : là où l'on invente et bâtit, ensemble. Le Hameau sort de la brume. | Élever | « Ensemble » souligne la morale. | 04 |
| chapter-VI | Les Âges tournent leurs pages. Tant de siècles… et moi, toujours là. L'Îlot aux Mouettes se laisse enfin approcher. | Garder | — | — |
| chapter-VII | Les Légendes… Il ne reste qu'un voile. Lève-le, et l'île sera entière. Moi aussi, peut-être. | Garder | — | — |
| questTip | « ${label} » : c'est fait ! Je l'ai senti d'ici. Viens sur l'île : j'ai ${coins} écus pour toi. | Réécrire | « C'est fait ! » et les chiffres chez Brume ; le chiffre passe à l'aide. | 01 |

---

## 10. Hors de `src/texts/`

### 10.1 `src/game/vigils.js` — les veillées

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| (cadre) | narration | La nuit, le feu du Foyer. La troupe se rassemble en cercle ; Brume veille au-dessus. | Garder | — | — |
| LINKS.vie | Brume | Hermine, Pierrot, Marcelle, Jovin. Air, Eau, Feu, Terre. Ensemble… la Vie. | Garder | — | — |
| LINKS.soupe | narration | Marcelle gronde Pierrot parce qu'il dort debout ; il lui promet l'eau la plus claire de l'île. | Réécrire | Une scène résumée, pas jouée : deux ou trois répliques. | 04 |
| LINKS.bois | narration | Freya refuse qu'on coupe ses arbres ; Saturnin lui montre le bois mort et le métal qui l'aide : l'Abri tient. | Réécrire | Idem. | 04 |
| LINKS.flamme | narration | Freya a peur du feu ; Marcelle lui montre le feu qui nourrit. | Réécrire | Idem. | 04 |
| LINKS.enclume | narration, Saturnin, Brume | Jovin forge le premier vrai ciseau de Saturnin. / Hm. / Il dit merci. | Garder | — | — |
| LINKS.fruit | narration | La forêt et le jardin plantent ensemble. | Réécrire | Idem. | 04 |
| LINKS.nager | narration | Pierrot a peur de l'eau profonde ; Hermine lui apprend. | Réécrire | Idem. | 04 |
| LINKS.tablee | narration | Une table pour tous ; on y choisit le nom du peuple. | Réécrire | Idem. | 04 |
| LINKS.pardon | narration, Tous | Chacun tend son Souffle vers Brume. / Ta flamme, notre vie. | Garder | — | — |
| RITES.* | narration | (les quatre rites) | Garder | — | — |
| LINES.I | Brume | Chaque lumière repousse la brume. Allumons-les toutes. | Réécrire | La version de la bible est meilleure (Brume compte) : « Une. Hier, il n'y en avait aucune. » / « Allumons-les toutes. Que la mer sache qu'on est là. » | 04 |
| LINES.III | Flore, narration | Trois naufrages en une saison… Il y a quelque chose, avec cette île. / Brume baisse les yeux. | Élever | « Trois naufrages » contredit la v6 (deux naufrages, et deux anciens naufragés). | 04 |
| LINES.V | narration, Marcelle | Les autres t'appellent « Alchimiste ». / Du sel ! Je sens le sel ! | Garder | La récompense d'un fil long. | — |
| LINES.VI | Hermine, narration | (« Moi aussi, je croyais que c'était ma faute. » …) | Garder | — | — |
| LINES.VII | Brume | La brume s'est levée. {peuple} veille sur la mer. | Garder | — | — |
| FINALE.phare | narration | Tout en haut du phare, Jovin monte la lentille. « Tac ! Elle tient. » | Élever | Le « Tac » ; c'est le moment d'un « clic » juste (décision 16). | 04 |
| FINALE.* (autres) | narration, Brume | (le reflet, le soleil, la flammèche, « Je reste avec toi. ») | Garder | — | — |

### 10.2 `src/game/anya.js` — Anya

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| TRACES.1–8 | légende | (les huit traces) | Garder | Le registre exact : l'image, sans explication. | — |
| PRESENTIMENTS.anya-vie-voix | Une voix | « … Merci. » | Garder | — | — |
| PRESENTIMENTS.anya-vie-brume | Brume | Tu l'as entendue ? Une voix, quand tu as fait naître la Vie… Elle venait de l'île elle-même. Écoute bien : elle reviendra. | Réécrire | Elle explique l'indice au moment où il est posé ; « fait naître ». La bible disait mieux : « Tu as entendu ? … Non. Rien. » | 04 |
| PRESENTIMENTS.anya-rune-galet | Saturnin | (Il ôte son bonnet.) Ici dort Celle-qui-donne-souffle. Ne l'éveillez qu'ensemble. | Garder | — | — |
| PRESENTIMENTS.anya-rune-sylve | Freya | (Tout bas.) Elle. La Dame. Les bêtes savent. | Garder | — | — |
| PRESENTIMENTS.anya-betes | Brume | Tu as vu ? Toutes les bêtes ont tourné la tête vers la Lande aux Menhirs. Puis plus rien. | Garder | — | — |
| revelation (narration) | narration | (le Cercle, les sigles, Anya se lève, la gemme) | Garder | — | — |
| revelation.naitre | Anya | Vous m'avez fait naître bien avant de me voir. Air, Eau, Feu, Terre… Vous êtes la Vie que j'attendais. | Élever | « Écrite » (décision 12). | 04 |
| revelation.flamme, .brume, .sat, .saturnin, .freya, .marcelle | Anya, Brume, Saturnin | (« Ma petite flamme… », « … Tu es revenue. », « Saturnin. Petit Sat. »…) | Garder | — | — |
| revelation.joueur | Anya | Toi qui lis. Continue de fabriquer. Tant qu'on fait naître la vie, je ne dors pas. | Élever | « Écrire » ; c'est le seul « toi qui lis » du jeu (décision 18). | 04 |
| revelation.fin | Anya | (les deux répliques selon le Phare) | Garder | — | — |
| BREATH_LINE | Anya | Ce que la terre sait, je te le souffle. | Garder | — | — |

### 10.3 `src/game/opus.js` — l'aveu de Brume

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| secret-galet | Saturnin, Brume | Hm. Hm… (Brume traduit : « La dernière rune. Le ciel est tombé dans la mer. Le Voile en est sorti, et la brume vivante a reculé. ») | Élever | À accorder à la décision 3 (ce qui est tombé dort sous l'île et voit par le Voile). | 05 |
| secret-brume | Brume | La brume vivante… c'était moi ? Je ne brisais pas les bateaux. Je les gardais. J'étais l'île, le matin. | Garder | — | — |
| secret-suite | Brume | Je pâlis, je sais. Ce n'est rien : continuons. Les quêtes, elles, ne s'arrêtent pas. | Réécrire | « Les quêtes » : Brume parle du jeu. | 05 |
| secretOf (variante) | Brume | La brume vivante… c'était moi. Son souffle. Elle s'est endormie, et je me suis faite toute petite, pour qu'on n'oublie pas qu'on existait. | Garder | — | — |
| EARLY_WISP | Brume | C'est… moi ? Comme c'est étrange. | Garder | — | — |

### 10.4 `src/world/chest.js` — les mots d'Héliane

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| NOTES.1 | Si tu lis ceci, l'île t'a choisi. Prends soin des poules : elles savent tout. | Garder | — | — |
| NOTES.2 | J'ai caché des choses dans la brume. Pas toutes : il fallait bien te laisser des surprises. | Garder | — | — |
| NOTES.3 | Le vent tourne toujours à l'heure du thé. Je n'ai jamais su pourquoi. | Garder | — | — |
| NOTES.4 | Brume parle beaucoup, mais elle a raison presque à chaque fois. | Élever | Héliane connaissait la brume vivante, pas encore le feu follet : « la petite lumière du marais ». | 04 |
| NOTES.5 | Une longue chaîne à la Récolte, et la mer se montre généreuse. | Réécrire | Une règle du jeu. | 04 |
| NOTES.6–11 | (le pommier, les dauphins, la baleine, les plages, le Grimoire, la clé du phare) | Garder | L'humour d'Héliane, au bon niveau. | — |
| NOTES.12 | Chaque lumière allumée sur l'île repousse un peu la brume. Allume-les toutes. | Élever | Redit le mot de l'acte I. | 04 |
| HELIANE.I–V | (les cinq premiers mots d'histoire) | Garder | — | — |
| HELIANE.VI | Nous avons cessé d'écrire, et la brume nous a effacés. Ne cessez jamais. | Garder | Ce qu'elle croyait ; la rune de l'acte VI corrige. | — |
| HELIANE.VII | (la lettre de la lanterne) | Élever | À accorder à la décision 3 ; c'est une lettre, la longueur est permise. | 05 |

### 10.5 `src/world/friends.js` — le passé, cœur par cœur

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| TALKS.potager.0, 1, 3, 4, 5 | Flore | (la graine, les fèves, les graines étranges, la lune et les radis, « Je suis revenue planter ici… ») | Garder | Sa voix est juste. | — |
| TALKS.potager.2 | Flore | Cette boîte ? Des graines. Chaque chose en sa lune : celles-ci attendent depuis longtemps. Elles savent pourquoi. | Élever | Le proverbe, plaqué ici, tombe mal. | 04 |
| TALKS.carriere.0–5 | Saturnin | (les six) | Garder | Le meilleur du jeu. Le 0 : forme de la traduction seulement. | — |
| TALKS.bosquet.0 | Freya | Chut ! Arbres… réveillent. Toi entends ? | Réécrire | Décision 15. | 04 |
| TALKS.bosquet.1 | Freya | Ma forêt. Grande. Verte. Arbres parlaient. Toi… écoute aussi, un peu. | Réécrire | Idem. | 04 |
| TALKS.bosquet.2 | Freya | Le feu a mangé ma forêt. Tout. Moi, courir jusqu'à la mer. Le feu… méchant. | Réécrire | Idem, et « méchant » est enfantin. | 04 |
| TALKS.bosquet.3 | Freya | Radeau de bois flotté, je l'ai fait. Il s'est cassé ici. Les arbres de l'île m'ont attrapée. | Élever | Presque juste ; « m'ont attrapée » est beau (un écho des racines ? à trancher au lot 04). | 04 |
| TALKS.bosquet.4 | Freya | Je me cache parce que les gens font du bruit, coupent, brûlent. Toi, non. Toi, tu écoutes. | Réécrire | Elle explique ce qu'elle ressent. | 04 |
| TALKS.bosquet.5 | Freya | Ici, c'est ma forêt. Et vous, ma meute. | Garder | — | — |
| TALKS.puits.0, 1, 3, 4, 5 | Pierrot | (les rêves, l'eau profonde, ses parents, « Je trouverai toujours… ») | Garder | — | — |
| TALKS.puits.2 | Pierrot | Chut… La lune m'a parlé. Elle dit que tu ne dors pas assez. Elle a raison, non ? | Élever | Plus étrange (ton § 4.6). | 04 |
| TALKS.ponton.0 | Hermine | Ohé ! Ce nuage-là, je l'appelle Grognon. Cap au nord : il pleuvra avant midi ! | Réécrire | « Grognon » est une mignonnerie. | 04 |
| TALKS.ponton.1, 3, 5 | Hermine | (Zéphyr, le frère perdu, « Je reste. ») | Garder | — | — |
| TALKS.ponton.2 | Hermine | Je voulais faire le tour du monde. Cap à l'ouest, toujours ! L'île, c'était pas prévu. Mais j'aime l'imprévu. | Élever | La dernière phrase est une formule. | 04 |
| TALKS.ponton.4 | Hermine | J'étais à la barre, la nuit de l'Hirondelle. La brume est venue d'un coup. Depuis, je ne sais plus tenir une barre. | Élever | Montrer plutôt que dire (ton § 4.3). | 04 |
| TALKS.atelier.0 | Jovin | Montre-moi tes mains. Hum. On va arranger ça. Clic ! | Élever | « Clic ! » (décision 16). | 04 |
| TALKS.atelier.1 | Jovin | Enfant, j'ai réparé l'horloge de mon village. Elle avançait de dix minutes. Moi aussi, j'avance. Tac ! … Non ? | Élever | Le « Tac ! » ; le jeu de mots raté reste. | 04 |
| TALKS.atelier.2 | Jovin | Mes automates servaient le thé. Attends… Non. Si ! Si ! Ils le renversaient aussi. Clic, clic. | Élever | « Clic, clic. » | 04 |
| TALKS.atelier.3, 5 | Jovin | (l'incendie, « Presque tout peut se réparer. Même moi. ») | Garder | — | — |
| TALKS.atelier.4 | Jovin | Je suis parti quand plus personne n'a osé me confier une horloge. Ici, tu me confies tout. Tac. | Élever | Le « Tac. » | 04 |
| TALKS.foyer.0 | Marcelle | Mon caneton ! Tu as mangé ? Non ? Ce qui mijote ne se presse pas, mais toi, assieds-toi ! | Réécrire | « Mon caneton » dit au joueur (décision 17 : c'est le nom de Pierrot). | 04 |
| TALKS.foyer.1, 2, 3, 5 | Marcelle | (l'auberge, Pierrot, les feux follets, « Une cuillère pour le corps… ») | Garder | — | — |
| TALKS.foyer.4 | Marcelle | Un secret, ma brindille. Depuis le naufrage, je ne sens plus le goût de rien. Chut, pas un mot. | Garder | La troisième « brindille », émue : elle reste. | — |
| LOVED.potager, puits | Flore, Pierrot | (les laitues, l'eau qui dit merci) | Garder | — | — |
| LOVED.carriere | Saturnin | Hm ! (Brume : “Il dit que c'est son plat préféré.”) Hm ! | Élever | La forme de la traduction. | 04 |
| LOVED.bosquet | Freya | Eau ! Arbres boivent. Merci… ami. | Réécrire | Décision 15. | 04 |
| LOVED.ponton | Hermine | Du bois ! Par tous les alizés, de quoi radouber ma barque. Cap sur le ponton ! | Élever | Deux exclamations, deux tics dans la même bulle. | 04 |
| LOVED.atelier | Jovin | De la pierre ! Attends… Non. Si ! Si ! Une meule pour mes engrenages. Clic ! | Élever | « Clic ! » | 04 |
| LOVED.foyer | Marcelle | Des provisions ! Ce qui se partage ne se perd pas. Merci, mon caneton ! | Élever | « Mon caneton » (décision 17). | 04 |
| LIKED | tous | Oh, merci ! C'est gentil d'avoir pensé à moi. | Réécrire | La même phrase pour sept voix différentes. | 04 |
| OTHER | tous | C'est… pour moi ? Merci, c'est l'intention qui compte ! | Réécrire | Idem. | 04 |
| SETTLER_TALKS.0–5 | voyageur | (les six répliques des voyageurs installés) | Réécrire | Formules creuses (ton § 4.17). | 04 |

### 10.6 Les égarés : `src/world/strays.js`, `src/world/nightArt.js`, `src/components/World/Sites/SiteOverview/SiteOverview.vue`, `design/bibliotheque/svg/egares/egares.json`

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| recapOf.total | Cette nuit, ${total} égaré(s) est/sont sorti(s) de la brume. | Élever | Juste, à resserrer. | 03 |
| recapOf.luciole | ${n} est devenu luciole / sont devenus des lucioles près de tes lumières. | Élever | « Libérés » : ce qu'ils sont, sans le dire (ton § 4.13). | 03 |
| recapOf.barre | ${n} a boudé / ont boudé devant une clôture. | Réécrire | « Bouder » est le registre « choupi » ; le Dormeur endormi compte ici, il lui faut sa ligne. | 03 |
| recapOf.coq | Coquelicot a chanté : un égaré a filé dans la brume. | Garder | Validé le 14 oct. | — |
| recapOf.camarade | Tes camarades en ont renvoyé ${n}. | Garder | — | — |
| recapOf.touche | Tu en as repoussé ${n} toi-même. | Garder | — | — |
| recapOf.panne | Un bâtiment est embrumé (${site}) : répare-le depuis sa fiche. / Rien n'a été embrumé : le camp a tenu. | Élever | Le mode d'emploi passe à l'aide ; « le camp a tenu » reste. | 03 |
| (nouvelles lignes) | — | Réécrire | Une ligne propre à chaque égaré (le Sans-Nom, le Dormeur, le Noyé, la Racine, l'Esprit revenu) : demandée par le commit du 14 oct. | 03 |
| SiteOverview (embrumé) | **Embrumé** : un égaré l'a atteint cette nuit, il ne produit plus. | Élever | Correct ; à accorder au registre. | 03 |
| nightArt.strayName (repli) | Un égaré | Garder | — | — |
| egares.json, noms | Petit fantôme ; Petit zombie tout mou ; Lapin de brume (tempéré) ; … | Réécrire | « Petit », « tout mou » ; les noms de l'auteur (le Sans-Nom, le Dormeur…). Fichier dans `design/` : à changer par l'autre agent. | 03 |
| nights.js (erreur) | Cet égaré n'a pas pu être repoussé. | Garder | Message d'erreur. | — |

### 10.7 `src/world/bestiary.js` — les familiers

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| ponton (Bosco) | Le macareux bougon d'Hermine. Il ne la quitte pas d'une plume. / « Krrr… » | Élever | La fiche reste ; le cri devient une didascalie. | 04 |
| foyer (Bouillon) | La grenouille dodue de Marcelle : elle goûte tout. / « Croâ ! (Il goûte ta manche.) » | Élever | Onomatopée et gag : une didascalie suffit. « Elle » puis « Il » : à accorder. | 04 |
| atelier (Tic-Tac) | L'abeille mécanique de Jovin. Elle s'arrête toujours au mauvais moment. / « Tic… tac… tic… clac. » | Élever | Le bruit du mécanisme, en didascalie. | 04 |
| puits (Bulle) | Le bocal de Pierrot. / « Blub ! » | Élever | Onomatopée. | 04 |
| bosquet, carriere, potager | (Mousse, Basalte, Lunette) | Garder | Déjà des didascalies. | — |

### 10.8 `src/world/landmarks.js` — les lieux remarquables

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| BRUME_LINES.* (13) | ex. « Les pierres te reconnaissent. Leur force guidera ta main : deux coups de plus à chaque Récolte. » | Élever | La première phrase de chacune est belle et reste ; le bonus (« deux coups de plus », « Ton Puits en profitera ») passe à l'aide. | 04 |

### 10.9 `src/game/minigames.js` et `src/world/climates.js`

| Identifiant | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|
| GAMES.*.text | (les consignes des trois mini-jeux) | Garder | Registre de l'aide. | — |
| CLIMATE_LINES.* | (les six phrases de climat) | Garder | Sobres, justes. | — |

### 10.10 Oublis de la première passe (relevés au lot 03)

| Identifiant | Qui | Texte actuel | Verdict | Raison | Lot |
|---|---|---|---|---|---|
| `NightSheet.vue`, INTRO (3 lignes) | Brume | La nuit, de petites créatures perdues sortent de la brume. Grognonnes plus que méchantes : elles embrument ce qu'elles touchent. / Tes lumières les changent en lucioles, tes clôtures les arrêtent, et d'un toucher tu en repousses une. / Rien n'est jamais perdu : un bâtiment embrumé se répare. La première nuit vient demain. | Réécrire | « Petites », « grognonnes » : le registre « choupi » (ton § 4.13). | 03 |
| `src/utils/failLine.js` (les mélanges ratés) | l'Athanor | ex. « La nature hausse les épaules. », « Trop de magie tue la magie. », « Rien ne se passe… Essaie une autre combinaison. » | Élever | La plupart sont justes (« L'outil reste un outil. ») ; quelques-unes sont des clins d'œil faciles, et la dernière lit l'interface. À reprendre une par une. | 04 |

### 10.11 Les fichiers de récit apparus au rangement (deuxième passe, lot 04)

Le rangement a rendu visibles des textes que ma première passe n'avait pas trouvés (ils vivaient dans des composants).

| Fichier (`src/texts/`) | Ce qu'il contient | Verdict | Raison | Lot |
|---|---|---|---|---|
| `game/savoirs.js` | les ouvertures des Savoirs, par maître | Élever | « ma brindille », « Tac ! », « Feuilles disent », « Psst ». | 04 |
| `world/needs.js` (`ASKS`, `THANKS`) | les besoins des habitants | Réécrire | Une phrase commune à tous ; « un petit creux ». `NEED_STATE` (aide) : gardé. | 04 |
| `world/visitors.js` | les voyageurs de passage : leur histoire, leur demande, leur merci | Réécrire | Formules creuses (« Merci infiniment ! … de bon cœur »), points d'exclamation. `REQUEST` (aide) : gardé. | 05 |
| `world/camp.js` | ce que dit chaque élément du camp | Élever | Sobre dans l'ensemble ; quelques fiches à resserrer. | 05 |
| `world/anya.js` | Anya, son cerf, le bol, les loutres, les lucioles | Élever | Juste ; « Il incline ses bois » dit deux fois. | 05 |
| `game/fete.js` | les mots de joie de Brume à la récompense | Réécrire | « Youpi ! », « Hourra ! » : contraires à la décision 11 (prise après le choix du 13 oct.). | 05 |
| `world/fetes.js` | les mots dorés au-dessus d'un bâtiment, d'un quartier | Élever | « La brume recule ! » est juste ; quelques-uns sont des slogans. | 05 |
| `game/onomatopees.js` | les bruits et mots de fanfare des mini-jeux et des coffres | **À trancher** | Un système dessiné (`design/conception/onomatopees.md`) : bruits d'objets (« Toc ! », « Plic ! ») et interjections enfantines (« Miam ! », « Slurp ! », « Tadaaa ! »). | 05 |
| `world/farm.js` | les fiches des bêtes de ferme | Garder | Sobres ; « Réglisse ne pond pas. Elle juge. » | — |
| `world/brume.js`, `items.js`, `tracker.js`, `shop.js`, `finds.js`, `crafts.js`, `game/levels.js`, `game/roads.js`, `game/loading.js` | alertes, modes d'emploi, suivi, verrous | hors audit | Interface ; registre de l'aide déjà respecté. | — |
| `book/*`, `ui/*`, `world/screens/*` | le Grimoire et les écrans | hors audit | Interface, sauf réplique de personnage : à signaler au lot 05 si j'en trouve. | — |

---

## Suivi

- **Les libellés des quêtes** : audités le 15 octobre dans le dépôt du serveur (`Alex-Lou/og-create-backend`, `src/texts/quests.js`, lu en lecture seule) : 72 quêtes, un titre et une réplique de Brume chacune. Voir `lots/07_quetes.md` : 25 titres changent, 65 répliques sur 72 changent ou se resserrent ; Freya et Saturnin ne « dorment » plus, Pierrot arrive sur sa planche.
- **Les libellés d'interface** (boutons, menus, réglages, erreurs) : hors audit, sauf demande de l'auteur.
- **`WRECK_TEXTS.lisiere` et `.colline` contredisent la v6** (Freya et Saturnin sans naufrage) : c'est un défaut de fond, pas seulement de ton. Proposé au lot 04.
- **La bouderie des égarés** existe aussi à l'image (`SULK_MS` dans `src/world/strays.js`) : si l'auteur valide « ni grimace », l'animation sera à revoir par l'autre agent.
