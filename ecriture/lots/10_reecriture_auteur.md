# Lot 10 — La réécriture de l'auteur : le tutoriel, du naufrage au conseil

> Ce lot donne **le texte du tutoriel tel qu'il est dans le jeu**, jour par jour, après la réécriture de l'auteur des 17 et 18 octobre 2026 (PR « Tutoriel : réécriture des trois premiers jours, et le joueur parle sur l'île »). Il **remplace, pour les répliques**, les lots 01 (l'ouverture), 02 (le tutoriel) et 03 (la veillée des égarés) ; ceux-ci gardent leurs intentions, leurs images et leurs décisions.
> - **Écrit par l'auteur**, corrigé seulement pour l'orthographe, la ponctuation et la limite de 140 caractères par bulle (une réplique trop longue est coupée en deux bulles, sans retirer un mot quand c'est possible).
> - **Source de vérité : le code.** `src/texts/tutorial/scenes.js` (scènes et répliques), `tabs.js`, `cooking.js`, `henChase.js`, `src/texts/story.js` (le souvenir de Léo), `design/dialogues/chantiers.json` (les bulles du Puits). Ce document en est tiré ; s'ils divergent, le code fait foi.
> - Les consignes du coach (💡) et les écrans (carte d'embarquement, page de garde, mini-jeux) ne changent pas : `src/texts/tutorial/coach.js`, `src/texts/ui/prologue.js`.

---

## 0. Ce qui change dans la manière d'écrire

Les règles de `ton.md` tiennent toutes ; la réécriture y ajoute quatre habitudes (décisions 25 à 28 de `ton.md`) :

1. **Le joueur parle, et répond.** Il ironise, s'inquiète, relance (« Bienvenue au club. Ici, personne ne dort beaucoup. »). Il parle dans les scènes plein écran, et désormais **aussi sur l'île** : une réplique `who: 'joueur'` s'affiche sous son nom, avec son avatar de naufragé (`sceneArt.playerFace`).
2. **Brume tient à ce qu'elle est.** On la prend pour un animal, un « il », une hallucination, un coup sur la tête : elle proteste à chaque fois (« Je ne suis PAS un animal ! »). Une seule fois, ça lui plaît : Léo la prend pour une fée.
3. **Brume se compte des amis.** Chaque soir, elle compte ceux qui sont arrivés depuis sa solitude (« Deux de plus qu'il y a deux jours… », « … Quatre personnes, après une éternité de solitude »), et finit par « Dormez, je veille sur vous ».
4. **Les fils d'un jour à l'autre.** Les racines et les baies (jour 2) reviennent chez Agathe ; les requins et le tentacule de Lorena reviennent aux poules ; « Et le grand ? … Une autre fois » (Nathan, jour 4) trouve son écho au Puits ; « S'est-il seulement réveillé ?! » (Agathe, jour 4) reçoit sa réponse au matin ; « … Ma brume » ferme le conseil.

Les moments de l'histoire, les quêtes et l'ordre des étapes ne changent pas (`src/game/prologue.js`).

---

## Jour 1 — Brume, du naufrage à la première nuit

### Le naufrage

**Scène « Le naufrage de l’Hirondelle »** (`naufrage`) :
- > *L’Hirondelle, troisième nuit de croisière.*
- **Le capitaine** : Attention, mesdames et messieurs, ici votre capitaine. Nous venons de percuter un élément inconnu : la coque est perforée.
- **Le capitaine** : Il nous reste assez de canots de sauvetage pour tout le monde. Je vous demande de vous organiser dans le calme.
- **Le capitaine** : Nous rencontrons des difficultés à manœ… — krrr — Aaah ! Mais que sont ces choses ?! — krrrr… shhh…
- *(pensée)* Du sable plein la bouche… Oh non. Où suis-je ?
  - `[Toucher pour ouvrir les yeux]`
- *(pensée)* Des valises, des morceaux de coque… Oh mon… Qu’est-ce que je vais pouvoir faire ?
- *(pensée)* Ah, il y a quelque chose, là-bas.
- *(pensée)* C’est ma carte d’embarquement… Super…
- *(pensée)* Je ne vois pas ce que je vais pouvoir en faire. Bon. Regardons quand même…
  - `[Toucher la carte]`

### La carte d’embarquement
- *(éditeur d’avatar, carte trempée, nom : texts/ui/prologue.js, inchangés)*

### L’arrivée

**Scène « Le naufrage de l’Hirondelle »** (`arrivee`) :
- *(pensée)* Bon. Maintenant que je me rappelle ma tête et mon nom, on va pouvoir voir où nous sommes.
- *(pensée)* Hm… Je crois que c’est bel et bien une île déserte.
- *(pensée)* Si seulement j’étais arrivé·arrivée ici sans naufrage, j’aurais peut-être aimé.
- *(pensée)* Je ne vois personne. Pourtant, j’aurais juré voir des silhouettes nager vers le rivage…
- *(pensée)* Tant pis. D’abord, avançons.
  - `[Avancer]`
- **Joueur** : Aaah ! Mais c’est quoi, ça ?!
- **Joueur** : Une étoile ? … C’est magique ? Ça veut me tuer ?
- **Brume** : Tu… Tu peux me voir ? Et me parler ?!
- **Joueur** : Quoi ? Tu es vivant ?
- **Brume** : VivantE ! Je suis une fille, et je m’appelle Brume.
- **Brume** : Cela faisait des lunes que je n’avais vu personne sur cette île.
  - `[T’approcher]`
- **Joueur** : Je ne comprends plus rien… Mais peu importe ! Qu’est-ce que tu es ?
- **Joueur** : C’est toi qui nous as fait naufrager ?
- **Brume** : Je suis Brume… Et non ! Comment peux-tu penser ça de moi ? Je suis gentille !
- **Brume** : Avant, j’étais autre chose. Maintenant, je ne suis plus remplie que de souvenirs flous… et de ce que je ressens.
- **Brume** : Attends, regarde ! Tu pourras peut-être faire comme ceux d’avant.
- **Brume** : Regarde. Peut-être que toi, tu comprendras.
  - `[Toucher le livre]`

### La page du Vent
- **Le Grimoire** : « Mêle l’Air à l’Air, et nomme ce qui naît. »

### Le souffle

**Scène** (`souffle`) :
- **Brume** : Oh ! Mais toi aussi, tu sais commander aux éléments ?!
- **Joueur** : Je… J’ignore ce qui s’est passé. C’est moi qui ai fait ça ?
- **Brume** : Oui ! Tu es comme eux ! Tu peux créer, donner vie à ce qui dort dans ce livre.
- **Brume** : Moi, je ne le comprends pas. Je le garde pour celui qui doit le recevoir… et on dirait que… c’est toi.
  - `[Tourner la page]`

### La page de garde
- **Brume** : Ce livre est à toi, maintenant. Mets ton nom sur la première page.

### « Quel jour ? »

**Scène** (`jour`) :
- **Joueur** : Il y a déjà eu des gens, ici ?
- **Brume** : Ceux d’avant savaient beaucoup. On s’apprenait tout, eux et moi… Mais depuis ce jour, je ne me rappelle plus rien.
- **Joueur** : Quel jour ?
- **Brume** : Peu importe. Ce livre a d’autres choses pour toi. Mais il faudra être patient·patiente : il est très gros…
- **Brume** : … et ses pages ont l’air d’avoir oublié, elles aussi, ce qu’elles contenaient.
  - `[Lever les yeux]`

### Le cercle de flammes

**Scène** (`cercle`) :
- **Joueur** : Oh non… Je sens que la nuit va être froide. Je n’ai ni abri, ni nourriture, ni de quoi me réchauffer.
- **Brume** : Non, non, ne t’en fais pas. Je ne réchauffe pas beaucoup, mais je brille. Je resterai près de toi jusqu’au matin.
- **Joueur** : Bon… D’accord, Brume. On suit ton plan. Je n’ai pas d’autre choix, de toute façon, mais je vais quand même mourir de froid !
- **Brume** : Ah… C’est vrai ! Viens, par là.
  - `[Suivre Brume]`
- **Brume** : Autrefois, il y avait ici un cercle de flammes, et ceux d’avant tout autour.
- **Brume** : Ils parlaient, dansaient, chantaient, riaient. Ils discutaient sérieusement, aussi. Et parfois, plus tristement.
- **Brume** : C’était un vrai lieu de vie. Je m’en souviens si peu, et tellement à la fois… C’est étrange.
- **Brume** : Pas grave ! Regarde : c’est ici que dansaient les flammes orange. Tu pourrais peut-être les refaire ?

### L’épave

**Scène** (`epave`) :
- **Joueur** : Attends. Je pense que mon bateau va s’échouer sur la plage : je pourrai sans doute récupérer mes affaires.
- **Joueur** : Tu es Brume, non ? Tu ne pourrais pas, justement, faire s’en aller la brume ?
- **Brume** : Oui… Pardon pour ça. Il y a longtemps que j’ai oublié comment la retenir.
- **Brume** : J’ai perdu la mémoire. Et le reste avec. Avant, j’étais plus grande. Bien plus forte aussi.
- **Joueur** : Euh… D’accord. Écoute, ce n’est pas grave. Déjà, installons-nous.

### Sur l’île
- **Brume** : Viens. Il reste un peu de jour, et du bois sur la plage.
- **Brume** : Je brille plus fort, tu as vu ? Touche-moi : j’ai quelque chose pour toi.
- **Brume** : Du bois flotté. Et là, les pierres du vieux cercle. Rassemble tout : on va le rallumer.
- **Brume** : Tout y est. Là, au milieu des pierres.
- **Brume** : Les flammes orange… comme avant. Maintenant, la nuit peut venir.

### La première nuit

**Scène** (`nuit`) :
- **Brume** : Je n’ai jamais rien réchauffé, moi. Mais ce soir, près de ton feu, je n’ai pas froid.
- *(pensée)* Le feu tient. Pour cette nuit, cette plage suffira.
- **Brume** : Brumelune. C’est ainsi qu’ils appelaient l’île, ceux d’avant. Je n’avais plus dit ce nom depuis longtemps.
- > *Une étoile file. Brume détourne les yeux.*
- **Brume** : Là-bas, sur les rochers. Quelqu’un regarde ton feu.
- **Brume** : On lui fera une place demain, si le cœur lui en dit. En attendant, dors : je veille sur nous.
- **Brume** : Va voir la plage, si tu veux. Quand tu auras sommeil, reviens près du feu : je veille.

## Jour 2 — Lorena

### L’arrivée de Lorena

**Scène** (`recolte`) :
- *(pensée)* L’épave est venue jusqu’aux rochers, cette nuit… Elle aurait pu nous rentrer dedans, j’ai rien entendu…
- *(pensée)* Mes affaires sont quelque part là-dedans… ou au fond.
- **Lorena** *(soulagée)* : Ho, du feu ! Toi aussi, tu étais sur le navire ? Alors donne-moi la main. La mer ne m’a pas lâchée de la nuit.
- **Lorena** *(soulagée)* : Lorena, navigatrice. Officier de quart, pour être exacte. J’ai nagé vers ton feu toute la nuit.
- **Lorena** *(soulagée)* : J’ai failli me faire attraper par deux requins, et j’ai cru voir un tentacule immense… Bref !
- **Joueur** : Un requin ? Un tentacule géant ? Mais tu es certaine de ne pas avoir halluciné ?
- **Lorena** *(pensive)* : J’aurais préféré, crois-moi.
- **Lorena** *(contente)* : En tout cas ! La mer rend ce qu’elle a pris. Un ponton, une ligne, et je te montre ce qu’on va pouvoir en faire.
- **Joueur** : On ? Parce que… tu t’installes avec nous ?
- **Lorena** *(décidée)* : Pourquoi ? Tu y vois un inconvénient ? Et ton animal domestique, il a quelque chose contre moi ?
- **Brume** : Je ne suis PAS un animal ! Et encore moins domestique ! Je suis Brume !
- **Lorena** *(surprise)* : Oh, mais ça parle ! Ça, par exemple ! Je n’avais encore jamais vu ça !
- **Joueur** : Ah, parce que survivre aux requins et voir un tentacule géant, ça va, mais la flammèche qui parle, c’est la goutte d’eau, c’est ça ?
- **Lorena** *(gênée)* : Je… Je n’avais juste jamais… parlé à une entité… magique !
- **Lorena** *(décidée)* : Quoi qu’il en soit ! On va devoir trouver un moyen de survivre. Cette île est étrange, croyez-en mon expérience.
- **Lorena** *(décidée)* : Construisons-nous un véritable abri de naufragés.
- **Brume** : Elle a raison. Ici, la nuit comme le jour, ce n’est pas toujours très calme… Il arrive des choses…
- **Joueur** : Euuh… Brume ? Ça va ? On devrait savoir quelque chose ?
- **Brume** : Oubliez ça. Je vous aiderai à bien tout comprendre.

### La caisse
- **Lorena** *(surprise)* : Mes affaires ! Je n’arrive pas à y croire ! Aidez-moi à l’attraper !
- **Lorena** *(émue)* : Ma longue-vue, mon compas… intacts. Et mon filet ! Tant pis pour le reste, on se débrouillera avec ce qu’on a déjà là !
- **Brume** : La mer rend ce qu’elle a pris. C’est toi qui l’as dit.

### La longue-vue, la Récolte
- **Lorena** *(fière)* : Là, face à la mer : c’est là que je m’installe !
- **Lorena** *(décidée)* : Viens au rivage. La marée laisse souvent des choses, mais elle les reprend vite aussi.
- **Brume** : L’île est du genre généreuse. Si tu t’appliques à récolter ou à produire, elle te le rendra.
- **Lorena** *(malicieuse)* : Pas mal, pour un·une naufragé·naufragée. Pour mon ponton, il en faudra bien plus.

### Le Sceau s’ouvre
- **Brume** : Tu écris… C’est ça qu’ils faisaient, ceux d’avant. Ils écrivaient.
- **Brume** : J’ignore si le livre se souviendra de toi si tu t’en vas… Tu ne pars pas, hein ?

### Le Ponton
- **Lorena** *(décidée)* : Un ponton, et la mer devient un chemin.
- **Lorena** *(rieuse)* : Il tient. C’est déjà ça… Ma grand-mère aurait tapé du talon dessus, pour voir.
- **Brume** : Un ponton ? J’ignorais ce que c’était, mais ça n’a pas l’air d’être bien grand.
- **Lorena** *(fâchée)* : Hé ! Je fais avec les moyens du bord, d’accord ?

### Le chemin entre les deux camps
- **Lorena** *(pensive)* : Avec deux camps, on sera d’abord moins serrés, mais on pourra aussi commencer à former une communauté de survivants.
- **Brume** : Un chemin. Ça commence à ressembler à un petit village… Comme avant.
- **Lorena** *(contente)* : Voilà. Deux pas, et on est voisins.

### Les clôtures
- **Lorena** *(malicieuse)* : Naufragés, d’accord. Mais rien n’interdit d’avoir un joli camp.
- **Brume** : Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils cherchent ce qui brille sans savoir pourquoi… et attaquent parfois ce qui bouge.
- **Brume** : Ils viennent de partout. Une clôture tout autour du feu… et ils s’arrêtent, je crois.
- **Brume** : Une clôture, ça décore. Bien placée, ça protège aussi. Tout autour du feu, alors.
- **Brume** : Ça ressemble à un chez-nous.

### Le soir, la deuxième nuit
- **Lorena** *(gênée)* : On a bâti, ramassé, cueilli… et pas un de nous ne sait cuisiner.
- **Brume** : Moi, je ne mange pas. Ça n’aide pas, je sais.
- **Lorena** *(pensive)* : Demain, on se débrouillera mieux. Ce soir, quelques baies et racines feront malheureusement l’affaire. J’espère ne pas être malade !
- **Brume** : Deux de plus qu’il y a deux jours… Je ne me sens enfin plus seule. Dormez, je veille sur vous.

### La veillée
- **Brume** : Chut… Cachons-nous. Ne bougez plus.
- **Brume** : Chut… Là, au bord de la brume. Des égarés.
- **Brume** : Celui-là marche les yeux fermés. Il ne regarde même pas le feu.
- **Brume** : Il s’est endormi contre les piquets. … Comme s’il n’attendait que ça… Étrange…
- **Brume** : Le feu repart. Ils rentrent dans la brume, sans un bruit, mais ils reviendront.
- **Lorena** *(effrayée)* : Je ne suis pas certaine de pouvoir fermer l’œil de la nuit, maintenant.

## Jour 3 — Agathe

### Agathe sort des rochers

**Scène** (`cannelle`) :
- **Agathe** : Deux nuits que je regarde ton feu depuis les rochers. Je n’osais pas approcher… à cause de lui.
- **Joueur** : Lui ? … Tu parles de Brume ?
- **Agathe** *(effrayée)* : Un feu follet ! Ma mère disait qu’ils mènent les gens dans les marais, et qu’on ne les revoit jamais.
- **Brume** : Je ne mène personne dans les marais ! Je ne sais même pas où ils sont, moi.
- **Brume** : Et d’abord, je suis une ELLE ! Arrêtez de me prendre pour un IL ! Je suis gentille, moi !
- **Agathe** *(gênée)* : Je… d’accord. J’ignorais que tu parlais. Et que fais-tu ici, au juste ?
- **Brume** : Je suis la gardienne de l’île et du Grimoire. Il est maintenant entre les mains de celui·celle qui devait le recevoir.
- **Brume** : Grâce à lui, vous pourrez redonner vie à l’île.
- **Agathe** *(surprise)* : Tu dis qu’on peut tout fabriquer avec ce livre ?
- **Brume** : Absolument tout !
- **Agathe** *(émerveillée)* : Mais ma parole ! C’est magnifique ! Je vais pouvoir cuisiner les saveurs du monde, et même en inventer de nouvelles !
- **Brume** : Attention ! Vous pouvez tout fabriquer… à condition d’avoir ce qu’il faut pour le faire.
- **Brume** : Les ingrédients ne sont pas toujours faciles à trouver, ni à atteindre. Il faudra traverser des endroits où même moi, j’ai peur d’aller.
- **Agathe** *(effrayée)* : C’est vrai… Je les ai vues. Et cette nuit, ces… choses, au bord de la brume. Je n’ai pas fermé l’œil.
- **Joueur** : Bienvenue au club. Ici, personne ne dort beaucoup.
- **Agathe** : Je peux ? Je ne prends pas de place. Enfin, si. Mais je cuisine.
- **Agathe** : Les marmites, la cheffe à bord… Agathe ! Je m’appelle Agathe. Adoratrice des saveurs en tous genres, et pas des pires.
- **Joueur** : Une cheffe ? Tu tombes à pic.
- **Lorena** *(contente)* : Depuis deux jours, on vit de baies et de racines !
- **Agathe** *(dégoûtée)* : Des racines ?! Ma pauvre brindille… Plus jamais ça tant que je serai là.
- **Agathe** *(décidée)* : Ensemble, nous serons plus forts. Mais avec l’estomac bien rempli, encore plus !
- **Agathe** *(émue)* : … Ton feu follet a l’air plus perdu que nous, finalement.
- **Brume** : Elle. Je suis une ELLE. … Mais merci de le comprendre.

### La faim
- **Lorena** *(surprise)* : Brume, dis-moi que je ne rêve pas…
- **Agathe** *(malicieuse)* : Ton ventre, je l’entends depuis les rochers. Assieds-toi. Un ventre vide ne bâtit rien.
- **Brume** : Elle a raison. Et elle aussi a faim : regarde-la.
- **Agathe** *(malicieuse)* : Des coquillages crus ? Ma brindille, on n’est pas des sauvages. Donne : je te fais une soupe.

### La marmite d’Agathe
- **Agathe** : Des coquillages, des algues, un fond d’eau de mer… Ce n’est pas la cuisine du bord. Mais regarde bien, et retiens.
- **Agathe** : Goûte, toi. Moi, je sale toujours un peu plus… On n’est jamais certain.

### Après la soupe
- **Agathe** *(contente)* : Une soupe… Une cuillère pour le corps, une pour l’âme.
- **Lorena** *(émue)* : Chaude, salée comme il faut… parfaite. Agathe, tu viens de me sauver la vie.
- **Brume** : Ça reviendra, tu sais. On a toujours un peu faim, ou froid… ou envie de parler. Ça, je connais.
- **Agathe** *(pensive)* : Ta brume, Brume… elle a avalé le navire. Elle a peut-être avalé d’autres naufragés ?
- **Brume** : Peut-être. Je ne la retiens plus très bien. Je ne sais même plus comment la rappeler… Elle ne m’écoute pas, et j’ai tout oublié.

### Des caquets sur l’eau
- **Lorena** *(surprise)* : Chut ! Des caquets… dans l’eau ? Prends ma longue-vue, vite.
- **Agathe** *(émue)* : Mes filles ! Caramel, Flocon, Réglisse… Elles ont tenu bon !
- **Lorena** *(malicieuse)* : Des poules en cage, au milieu des requins… Faut croire qu’ils ont fait la fine bouche.
- **Joueur** : Entre toi qui les as tous esquivés, Agathe qui est arrivée je ne sais comment, et les poules qui ont une chance divine…
- **Joueur** : … les miracles ont l’air courants, par ici.
- **Agathe** *(surprise)* : Doucement ! Elles ont vu la mer de trop près, elles aussi.

### La chasse aux poules
- **Agathe** : Mes filles ont filé ! Caramel court comme le vent, Flocon ne résiste pas au grain… et Réglisse fait ce qu’elle veut.
- **Agathe** : Les voilà toutes. … Réglisse, je t’ai vue. Ne fais pas l’innocente.

### Nourrir les poules
- **Agathe** *(triste)* : Elles ont faim. Une nuit en mer dans une cage, ça creuse.
- **Agathe** *(malicieuse)* : La marée nourrit aussi. Pas vrai ?

### Le poulailler
- **Agathe** *(décidée)* : Il leur faut un toit. Un petit poulailler, là, dans l’herbe, près de ma cuisine.
- **Agathe** *(pensive)* : Un toit, du grain… Il ne leur manque qu’un coq, à mes filles. Un jour.
- **Brume** : Un toit pour les poules, un feu pour nous… Ceux d’avant aussi avaient des… poules, c’est ça ? Je crois.
- **Lorena** *(malicieuse)* : Tes poules ont un vrai toit, maintenant. Cette vieille cage ? Démonte-la : du bois de navire, ça ne se jette pas.
- **Agathe** *(malicieuse)* : Prends-la. Mais si tu en fais un ponton, mes filles auront leur place dessus.

### L’abri, l’enclos
- **Agathe** *(fatiguée)* : Mes filles ont un toit. Moi, je dors comme je peux, mais ça fera l’affaire pour ce soir.
- **Brume** : Elle se plaint un peu. Bâtis-lui un abri, à côté de sa cuisine.
- **Agathe** *(boudeuse)* : Je t’entends, feu follet.
- **Agathe** *(contente)* : Un toit à moi… Ma brindille, tu vas me faire pleurer dans la soupe.
- **Brume** : Les égarés cherchent ce qui brille, et une cuisine brille toute la nuit. Il lui faut un enclos, à elle aussi.
- **Agathe** *(malicieuse)* : Et pas de piquet dans mes casseroles, hein.
- **Agathe** *(rieuse)* : Une cuisine avec une clôture. C’est tellement pittoresque.

### Le soir, la troisième nuit
- **Agathe** *(rieuse)* : À table ! Ce soir, on mange chaud.
- **Lorena** *(émue)* : Trois autour du feu. Hier encore, on dînait de racines.
- **Agathe** *(triste)* : Il manque une chaise… celle de mon Léo. Mangez, avant que ça refroidisse.
- **Brume** : Trois de plus qu’il y a trois jours… et une chaise vide. Dormez, je veille sur vous.

## Jour 4 — Nathan

### Quelqu’un sort de la brume

**Scène** (`rivet`) :
- **Nathan** *(étourdi)* : Une soupe. Je dois halluciner… Ça y est, je vais mourir sur une île déserte.
- **Nathan** *(étourdi)* : Soit j’ai pris un coup sur la tête, soit… Non. J’ai pris un coup sur la tête.
- **Joueur** : Ça dépend. Tu vois aussi une petite flamme qui flotte et qui parle ?
- **Nathan** *(surpris)* : … Oui. Bon. Alors c’est un gros coup.
- **Brume** : Je ne suis pas une hallucination ! Et encore moins un coup sur la tête !
- **Nathan** *(pensif)* : Une flamme sans mèche, sans huile, sans rien… Ça défie toutes les lois que je connais.
- **Brume** : Je ne défie personne, moi. Je suis polie.
- **Agathe** *(malicieuse)* : Laisse-la tranquille et viens manger, toi. Tu es tout gris.
- **Nathan** *(gêné)* : C’est la brume. Trois nuits dessous, sous une voile échouée. Elle m’en a fait voir de toutes les couleurs.
- **Nathan** *(gêné)* : J’ai cru que j’allais y passer à plus d’une reprise !
- **Lorena** *(malicieuse)* : Et il a un nom, le rescapé ?
- **Nathan** *(gêné)* : Veuillez m’excuser ! Nathan. Horloger. Je répare ce qui se répare. … Et attends… ton feu tousse : le vent entre par là, et par là.
- **Lorena** *(malicieuse)* : Deux minutes qu’il est là, et il critique déjà le camp.
- **Nathan** : Une porte de cabine sur deux caisses, près du feu. Ce n’est pas un atelier. Mais c’est un début.
- **Joueur** : Et tu pourrais nous construire quoi, avec ça ?
- **Nathan** *(gêné)* : Commençons petit : une lanterne. Le petit, je sais encore faire.
- **Brume** : Et le grand ?
- **Nathan** *(triste)* : … Une autre fois.
- **Agathe** *(fâchée)* : Hé ! Tu viens à peine d’arriver, et tu n’as encore rien mangé !
- **Nathan** *(gêné)* : Oh oui ! J’arrive, un instant !

### La lanterne
- **Nathan** *(décidé)* : Chaque pièce a sa place. Tourne, essaie. Elle te dira quand c’est la bonne.
- **Nathan** *(pensif)* : Une clôture leur barre la route. Une lumière… je ne sais pas encore ce qu’elle leur fait. On le saura cette nuit.
- **Nathan** *(fier)* : Elle brille. Pas très fort… mais elle brille.
- **Brume** : Elle me ressemble un peu.

### Les trois torches
- **Nathan** *(décidé)* : Cette nuit, depuis la brume, je les ai vus venir de trois côtés. Trois torches, une par côté. Pas du génie : de l’arithmétique.
- **Nathan** *(fier)* : Trois lumières qui tiennent la nuit. Attends… Non. Si ! Ça tient.
- **Lorena** *(rieuse)* : Il doute même de ce qu’il voit. Un vrai ingénieur.

### Le soir, la quatrième nuit
- **Nathan** *(rieur)* : Quatre autour d’un feu. Il nous faudra une plus grande marmite. Ou un plus petit Nathan.
- **Agathe** *(malicieuse)* : La marmite, je m’en charge. Toi, mange.
- **Agathe** *(triste)* : Mon Léo… Mon petit-neveu. Il était à côté de moi sur le pont, quand la vague… Sait-il nager, au moins ? S’est-il seulement réveillé ?!
- **Lorena** *(pensive)* : Les courants d’ici ramènent tout sur nos plages. Tout, Agathe. Nous finirons bien par le retrouver.
- **Lorena** *(décidée)* : S’il est comme toi, il a dû s’en sortir, pour sûr !
- **Brume** : Encore un nouveau visage… Quatre. Quatre personnes, après une éternité de solitude. Dormez, mes nouveaux amis : je veille sur vous.

## Jour 5 — Léo, la fin du tutoriel

### Une planche sur la vague
- **Lorena** *(surprise)* : Ohé ! Là, sur la vague… une planche. Et… quelqu’un dessus ?
- **Lorena** *(émue)* : Un enfant… Il dort. La vague l’a posé sur le sable, tout doucement. Décidément, on trouve de tout sur cette plage…
- **Joueur** : Il respire ? … Il respire.

### Le réveil (en bulles, sur l’île)
- **Brume** : Chut. Celui-là, ma brume l’a gardé longtemps. Mais attendez… Ne serait-ce pas… ?
- **Léo** : J’ai dormi combien de temps ? L’eau a un goût horrible, ici.
- **Léo** *(ensommeillé)* : T’es une fée ? Moi, je suis Léo.
- **Brume** : … Une fée. Oui. Ça, ça me plaît.
- **Agathe** *(émue)* : Mon caneton… Mon caneton !
- **Léo** : Tatie ? … Tu sens la soupe. Alors c’est vrai, je rêve plus… On est bien perdus sur une île, alors ?
- **Agathe** *(émue)* : Tu t’es réveillé… Tu t’es réveillé ! Je le savais, que tu savais nager.
- **Léo** *(surpris)* : Nager ? Je n’ai jamais su nager, Tatie… Je me suis réveillé sur une planche.
- **Léo** : Et ensuite, je me suis pris un coup sur la tête, et je me suis réveillé ici.
- **Joueur** : Encore un qui a eu une chance inouïe…
- **Nathan** *(gêné)* : … Bon. Quelqu’un a un mouchoir ? C’est pour… Agathe.

### La baguette, la Pluie
- **Léo** *(triste)* : Avant, ma baguette tirait vers l’eau. Ici, rien ne semble fonctionner normalement. Ni les baguettes, ni mes sens.
- **Brume** : Si Léo savait beaucoup de choses, ma brume lui en a peut-être pris une partie. On devra les retrouver dans le Grimoire.
- **Lorena** *(pensive)* : Cette histoire de brume et de Grimoire est des plus étranges. L’un fabrique tout, l’autre vole des connaissances.
- **Léo** *(pensif)* : C’est pas grave. Tu l’as pas fait exprès… hein ?
- **Brume** : Non… Il n’y a plus rien que je fasse exprès, depuis que j’ai tout oublié.
- **Brume** : La Pluie tombe sur l’île. Regarde Léo.
- **Léo** *(émerveillé)* : Je comprends mieux… Ce Grimoire a un vrai pouvoir. Mais ça ne me rend quand même pas mes sens de sourcier.
- **Léo** : Ah… Quoique… Là… ! Elle tire. L’eau est là-dessous. Je le ressens à nouveau !

### Le Puits
- **Léo** : Chut… Il y a quelque chose là-dessous. Je crois que… Oui ! C'est une source !
- **Lorena** *(surprise)* : Dis donc, il est doué, votre neveu…
- **Agathe** *(émue)* : Oui ! C'est mon caneton !
- **Léo** : Touche le chantier, puis « Bâtir ». On commence par le bas. Le toit, c'est pour la fête.
- **Léo** *(émerveillé)* : Oui… Voilà ! Ça y est ! Je pense pouvoir sentir la source, et même peut-être l’atteindre avec… des outils…
- **Nathan** *(fier)* : Attends ! Avec quelques ressources et mes instruments, on va pouvoir relier cette source à notre hameau…
- **Nathan** *(fier)* : … et même t’en faire un abri bien confortable !
- **Agathe** *(émue)* : Nous ressemblons de plus en plus à une communauté de naufragés.
- **Léo** *(rieur)* : Voilà ! L’eau arrive ! C’est génial. Même quand on dormira, elle viendra se stocker dans ce réservoir souterrain !
- **Brume** : Merci, Nathan ! Merci, Léo !
- **Nathan** *(gêné)* : … C’est trois fois rien !

### Le chemin du Puits
- **Léo** *(pensif)* : C’est très bien. Par contre, je suis pieds nus, et la terre n’est pas toujours très tendre. Il faudra des chemins entre nos abris.
- **Agathe** *(malicieuse)* : Et mes pieds aussi apprécieront le confort d’un chemin !
- **Brume** : Un chemin, un puits, de l’eau pour tous… Ça recommence. C’est comme avant.
- **Léo** *(content)* : Un vrai chemin. Mes seaux arrivent pleins, sans que j’aie à me ruiner les pieds !

### Le Campement

**Scène** (`campement`) :
- **Agathe** : Tiens. On ne reconstruit pas une île en guenilles.
- **Joueur** : Tu as recousu mes habits ? Quand ça ?
- **Agathe** *(malicieuse)* : Pendant que tu dormais. Moi, je ne dors pas beaucoup, ici. Personne, d’ailleurs. Pas avec ces… choses qui rôdent la nuit…
- **Brume** : Rassurez-vous : nous avons déjà de quoi nous défendre, même si vous ne le voyez pas encore.
- **Joueur** : C’est vrai que les ressources sont partout. Encore faut-il savoir les utiliser à notre avantage.
- **Lorena** : Le feu, l’eau, des lumières… Il manque un toit digne de ce nom. Et la mer ne rendra pas du bois éternellement.
- **Lorena** *(décidée)* : Il faudra vite trouver un autre moyen d’avoir du bois, et de s’en servir.

### Le conseil (la première veillée)

**Scène** (`conseil`) :
- `[Remettre une bûche dans le feu]`
- **Lorena** : Bon. On mange, et on tâche de ne pas finir trempés : ces nuages-là arrivent droit sur nous.
- **Lorena** : Et après… on trouve un moyen de quitter cette île.
- **Nathan** *(pensif)* : Quitter l’île… avec quoi ? Une porte de cabine et deux caisses ?
- **Agathe** : Et s’il y en a d’autres, de l’Hirondelle ? Le capitaine l’a dit : des canots pour tout le monde…
- **Joueur** : Oui, il l’a dit… Juste avant qu’on soit tous engloutis par je ne sais quoi, d’ailleurs.
- **Léo** : Là-bas, sur l’îlot. Une tour.
- *(la caméra vole jusqu’au phare)*

**Scène** (`conseil-suite`) :
- **Lorena** : Un phare. Éteint. S’il brillait, un navire nous verrait.
- **Brume** : Avant, il y avait des lumières partout. Je m’en souviens… un peu.
- **Joueur** : Et depuis ?
- **Brume** : … Il n’y a plus que la brume. Ma brume.
- *(pensée)* Alors on y va. Un pas après l’autre.
