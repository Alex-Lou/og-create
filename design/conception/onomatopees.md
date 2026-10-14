# Les onomatopées des mini-jeux

Choix de l'auteur (14 oct.) : des mots doux d'île magique, justes pour ce qu'on fait, sympas, jamais de bagarre. Ce
sont de vraies onomatopées françaises, courtes, qu'un enfant lirait à voix haute. Elles s'affichent sur une étoile de
bande dessinée crème, en lettres à relief (game/stage/texts.js).

La règle commune :
- **un mot par geste réussi**, celui de la matière ou de la bête touchée ;
- les mots d'un même geste viennent **à tour de rôle** (pas deux fois le même d'affilée) ;
- **un raté reste gentil**, sur des points de suspension, sans moquerie ;
- **les paliers** sont les mêmes dans tous les jeux, féeriques, et le plus haut salue Brumelune :
  Joli ! → Superbe ! → Magique ! → Féerique ! → Clair de lune !

Pour chaque jeu, ci-dessous : le geste, puis ses mots.

## La Récolte (faite, game/harvestFx.js)

On relie des tuiles identiques ; chaque ressource a son bruit.

| Tuile | Mots |
|---|---|
| Bois | Toc ! · Toc toc ! · Cric-crac ! |
| Pierre | Cloc ! · Clic-clac ! · Tac ! |
| Eau | Plic ! · Ploc ! · Flic-floc ! |
| Blé | Frou-frou ! · Hop ! · Miam ! |
| Poisson | Bloup ! · Flip-flap ! · Plouf ! |

Palier selon la longueur de la chaîne : 4 Joli !, 5 Superbe !, 7 Magique !, 9 Féerique !, 12 Clair de lune !

## La Pêche (au Ponton)

On touche le couloir d'eau quand un poisson passe sous l'hameçon.

| Geste | Mots |
|---|---|
| L'hameçon plonge | Plouf ! · Ploc ! |
| Gardon | Flic ! · Hop ! · Frrt ! |
| Truite | Flip-flap ! · Splash ! |
| Poisson doré (rare) | Diling ! · Tilin-tilin ! |
| Vieille botte | Floc… · Bof ! |
| Raté | Plic… · Zut… |

Palier selon les prises d'affilée sans raté.

## Le Filon (à la Carrière)

On creuse la paroi bloc par bloc ; les éclats disent où dort le filon.

| Geste | Mots |
|---|---|
| Coup de pioche | Tic ! · Toc ! · Tac ! |
| Bloc très dur qui cède | Patatras ! |
| Éclat (un indice) | Crr… · Gling ! |
| Quartz | Ting ! · Gling ! |
| Améthyste | Ding ! · Dong ! |
| Rubis | Diling ! · Tilin ! |
| Diamant (rare) | Tadaaa ! · Diliiing ! |
| Bloc vide | Pof… · Fff… |

Un seul mot par coup : le coup de pioche, ou ce que le bloc ouvert cachait (Patatras ! en plus sur un très dur).
Palier selon les pierres trouvées d'affilée le long du filon.

## La Cueillette (au Bosquet)

On cueille les baies mûres avant qu'elles tombent, sans réveiller les guêpes.

| Geste | Mots |
|---|---|
| Mûre | Pop ! · Plop ! |
| Fraise | Miam ! · Hop ! |
| Myrtille | Pic ! · Tip ! |
| Cèpe (rare) | Ooh ! · Trouvé ! |
| Baie tombée | Ploc… |
| Guêpes réveillées | Bzzz ! · Ouille ! |

Palier selon les cueillettes d'affilée sans baie perdue.

## La chasse aux poules (chez Cannelle)

On attrape les poules échappées.

| Geste | Mots |
|---|---|
| Une poule attrapée | Hop ! · Attrapée ! · Cot cot ! |
| Une poule qui file | Frrt ! · Cot-codêêt ! |
| Plumes qui volent | Pfiou ! |
| Toutes rentrées | Au nid ! |

## La marmite (de Cannelle)

On remplit la marmite, on touille, on sert.

| Geste | Mots |
|---|---|
| Un ingrédient dans la marmite | Plouf ! · Ploc ! |
| Touiller | Flic-flac ! · Glou-glou ! |
| Le bouillon frémit | Blop blop ! |
| Le bouillon est prêt | Mmmh ! |
| Servir | Slurp ! · Miam ! |

## L'assemblage (à l'établi)

On pose les pièces d'une création dans son gabarit.

| Geste | Mots |
|---|---|
| Une pièce posée | Clac ! · Tic ! |
| Une pièce qui ne tient pas | Hmm ? |
| Le gabarit rempli | Tadam ! |
| La création assemblée | Ziiing ! |

(Fait pour la chasse aux poules : les « Cot ! » de l'esquive restent ceux des textes validés de la scène,
`texts/tutorial/henChase.js` ; Hop ! et Attrapée ! à la prise ; Au nid ! quand toutes sont rentrées.)
