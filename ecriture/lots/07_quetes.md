# Lot 07 — Les quêtes (le serveur)

> Les quêtes de Brume vivent dans le dépôt du serveur, `Alex-Lou/og-create-backend`, fichier `src/texts/quests.js` (rangé par l'autre agent, sans changer un mot). Chaque quête a un **titre** (`label` : le suivi des quêtes, la fiche de Brume) et **ce que Brume en dit** (`say`).
> - J'ai lu ce dépôt en lecture seule (accord de l'auteur, 15 oct.) ; je n'y écris rien. L'autre agent intégrera ce lot dans le serveur.
> - **La règle du lot** : le titre est de l'aide, il dit la tâche (« Écris la Vie ») ; ce que dit Brume est sa voix, sans mode d'emploi (le geste est déjà dit par le titre et par la ligne d'aide du coach).
> - Décisions appliquées : `ton.md` § 0 (5, 7 bis, 10, 12, 15, 17), lots 01 à 06 validés, en particulier : Freya et Saturnin **se cachent**, ils ne dorment pas (bible V21, lot 04) ; Pierrot arrive **sur sa planche** (lot 06) ; on **écrit** au Grimoire.
> - Rien n'est final sans un « oui » de l'auteur. **Trois points à trancher** sont en fin de document.

---

## 1. Les titres

Un titre reste une consigne : impératif, court, sans voix. Les changements sont de trois sortes : « Fais naître » devient « Écris » pour une page du Grimoire (décision 12) ; « Réveille » devient « Apprivoise » ou « Va trouver » pour Freya et Saturnin ; quelques titres s'accordent au récit validé.

| Quête | Titre actuel | Titre proposé | Raison |
|---|---|---|---|
| pages | Découvre ta première recette : le Vent | Écris ta première page : le Vent | Décision 12 ; « recette » est un mot de cuisine. |
| ramasser | Ramasse les trois trouvailles du rivage | Ramasse ce que la mer a rendu | Le chiffre est dans le suivi ; le titre dit le geste du lot 01. |
| feu | Allume le Feu de camp | Rallume le feu de ceux d'avant | Le cercle de flammes (lot 01). |
| recolte | Termine une Récolte avec Hermine | Fais une Récolte avec Hermine | Plus simple. |
| chemin-aster | Relie le Ponton au Feu | Relie le Ponton au feu | « feu » en minuscule : c'est un feu, pas un bâtiment, dans une phrase. |
| deco | Fabrique ta première lanterne | Assemble ta première lanterne | Le verbe de l'établi. |
| souvenir-ondin | Fais naître la Pluie | Écris la Pluie | Décision 12. |
| puits-ondin | Construis le Puits | Bâtis le Puits | Le verbe des autres bâtiments. |
| chemin | Relie le Puits au Feu | Relie le Puits au feu | Idem chemin-aster. |
| eveil-sylve | Réveille Freya | Apprivoise Freya | Elle se cache, elle ne dort pas (bible V21). |
| vie | Fais naître la Vie | Écris la Vie | Décision 12. |
| souvenir-sylve | Rends son souvenir à Freya : fais naître l'Arbre | Rends son souvenir à Freya : écris l'Arbre | Idem. |
| lumiere | Fais naître la Lumière | Écris la Lumière | Idem. |
| eveil-galet | Réveille Saturnin | Va trouver Saturnin | Il vit dans la fissure, il ne dort pas (bible V21). |
| souvenir-galet | Rends son souvenir à Saturnin : fais naître la Pierre | Rends son souvenir à Saturnin : écris la Pierre | Décision 12. |
| bois | Fais naître le Bois | Écris le Bois | Idem. |
| etoile | Fais naître l'Étoile | Écris l'Étoile | Idem. |
| village | Fais naître le Village | Écris le Village | Idem. |
| souvenir-aster | Rends son courage à Hermine : fais naître le Bateau | Rends son courage à Hermine : écris le Bateau | Idem. |
| bete | Fais naître une bête | Écris une bête | Idem. |
| potion | Rends le goût à Marcelle : fais naître le Remède | Rends le goût à Marcelle : écris le Remède | Idem. |
| ecriture | Fais naître l'Écriture | Réapprends l'Écriture | « Écris l'Écriture » sonnerait faux ; c'est ce que dit l'histoire (le peuple réapprend à écrire). |
| civilisation | Fais naître la Civilisation | Écris la Civilisation | Décision 12. |
| phenix | Fais naître le Phénix | Écris le Phénix | Idem. |
| feu-follet | Fais naître le Feu follet | Écris le Feu follet | Idem. |
| (les 47 autres) | (Ouvre la caisse d'Hermine, Achète La Lisière, Bâtis l'Atelier, Passe ta deuxième nuit…) | (inchangés) | Déjà clairs. |
| LEGACY_LABELS.* | (les titres des anciennes quêtes à coffre) | (inchangés) | Gardés pour les comptes d'avant la bible. |

---

## 2. Ce que dit Brume (`say`)

Une bulle de 140 caractères au plus. Ce que la réplique actuelle disait du geste (« Touche la bulle… », « dans sa fiche, l'onglet Annexes », « Vingt-cinq bois ») est déjà porté par le titre et par le coach : il part.

### 2.1 Le tutoriel

| Quête | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| pages | Le Grimoire s'est ouvert pour toi. Mêle l'Air à l'Air dans l'Athanor : que le Vent chasse la brume du rivage. | Il s'est ouvert pour toi. Ceux d'avant savaient en faire sortir le vent… Essaie. | Brume ne connaît pas encore le mot « écrire » (décision 12) ; le geste est dans l'énigme du Grimoire. |
| ramasser | Deux bois flottés, un galet : ramasse les trois trouvailles, de quoi bâtir notre premier feu. | Ce que la mer rend, on le garde. Ce soir, on en fera un feu. | — |
| feu | Ceux d'avant faisaient un cercle de pierres, et le bois au milieu. Bâtis le feu ici, sur la plage de Brumelune : tes trouvailles suffiront. | C'est ici qu'ils dansaient, autour des flammes. Rallume-les. | Le cercle du lot 01. |
| nuit | Le feu tient. La nuit tombe sur Brumelune, qui ne s'éveille que pour toi. Explore à ta guise… puis dors : demain, nous ne serons plus seuls. | Le feu tient. Va voir la plage, si tu veux. Quand tu auras sommeil, je veillerai. | La phrase fleurie et la promesse partent ; « Explore » était un mot d'interface. |
| caisse | Sa caisse a échoué près du camp. Ouvre-la avec elle : la mer rend ce qu'elle a pris. | Une caisse est venue avec l'épave. Hermine dit qu'elle est à elle. | L'épave au matin (décision 10). |
| recolte | Hermine a rejoint le camp au matin. Suis-la au rivage : relie ce qui se ressemble, vite, avant la marée. | Hermine connaît la marée. Suis-la au rivage. | La règle de la Récolte est dans l'aide (lot 02). |
| premier-ponton | Vingt-cinq bois, et la mer nous ouvre ses portes. Bâtis le Ponton avec Hermine. | Un ponton, dit-elle, et la mer devient un chemin. Elle a l'air d'y croire. | — |
| chemin-aster | Deux camps, un seul chemin : trace-le du Ponton jusqu'au Feu. Les premières pierres sont offertes. | Deux camps, un seul feu. Il leur faut un chemin. | — |
| clotures | Brume l'a dit : les égarés rôdent la nuit. Plante les piquets tout autour du feu, jusqu'à boucler l'enclos. | La nuit, des égarés sortent de ma brume. Une clôture autour du feu… et ils s'arrêtent, je crois. | Brume parlait d'elle-même à la troisième personne ; « ma brume » (décision 7 bis). |
| veille | Deux, ce soir, autour du feu. Dors : je veille. | (inchangée) | Gardée. |
| soupe | Marcelle grelotte… Touche la bulle au-dessus d'elle : un repas chaud, et elle reprend des couleurs. | Marcelle a faim, et froid. Deux nuits sur les rochers, ça creuse. | — |
| cage | Des caquets sur l'eau… La cage du navire s'est échouée au bout de la plage. Ouvre-la avec Marcelle. | Des caquets, sur l'eau… La cage du navire est venue jusqu'au bout de la plage. | — |
| poules | Caramel, Flocon et Réglisse ont faim : deux vivres chacune, depuis la bulle au-dessus d'elles. | Elles ont faim. Marcelle les regarde comme si c'étaient ses filles. Ce sont ses filles. | L'humour de Brume, qui se corrige. |
| poulailler | Il leur faut un toit : touche le Feu de camp, puis « Annexes », et pose le poulailler dans l'herbe, près de la cuisine de Marcelle. | Il leur faut un toit, dans l'herbe, près de la cuisine. Marcelle a déjà choisi l'endroit. | — |
| abri-cannelle | Marcelle dort sur la cuisine de l'épave. Touche son coin : vingt bois, dix pierres, et elle a un toit. | Elle dort sur une marmite renversée. Elle ne se plaint pas. Enfin, un peu. | L'écho de sa réplique validée (« je ne me plains pas »). |
| enclos-cannelle | Ses piquets, cette fois, c'est toi qui les fais : glisse autour de son abri, huit bois le piquet. | Une cuisine brille toute la nuit. Les égarés le savent aussi. | Lot 03. |
| nuit-cannelle | Trois, ce soir, autour du feu. Dors : je veille. | (inchangée) | Gardée. |
| deco | Jovin a monté un établi près du feu. Assemble une Lanterne, puis pose-la au bord d'un chemin, là où l'île brille d'or. | Jovin a monté un établi : une porte de cabine, deux caisses. Il dit que c'est un début. | Lot 02 (rivet.3). |
| torches-rivet | Jovin a une idée pour la nuit : trois torches, une par côté d'où venaient les égarés. Assemble-les à l'établi, puis plante-les. | Ils sont venus de trois côtés, hier soir. Jovin a compté. Il compte tout. | — |
| nuit-rivet | Quatre, ce soir, autour du feu. Dors : je veille. | (inchangée) | Gardée. |
| eveil-ondin | Un petit dort contre un rocher, sa baguette à la main. Parle-lui doucement : la brume endort, sans faire de mal. | Un enfant dort sur une planche. La vague l'a posé là. Doucement. | Pierrot arrive sur sa planche (lot 06) ; « sans faire de mal » rassurait trop, depuis la décision 3. |
| souvenir-ondin | La source s'est tue sous ses pieds. Sans pluie, la terre oublie l'eau. Écris-la : sa baguette aura de nouveau quelque chose à chercher. | Sans pluie, la terre oublie l'eau. Et Pierrot aussi. | La phrase juste de l'actuelle, gardée et poussée d'un cran. |
| puits-ondin | Pierrot sent l'eau sous ses pieds. Creuse le Puits avec la pierre de la Récolte : l'eau ne manquera plus. | Pierrot sent l'eau sous ses pieds. Il chuchote qu'elle chante. | — |
| chemin | Pierrot porte l'eau à travers l'herbe mouillée… Trace un chemin du Puits jusqu'au Feu : les premières pierres sont offertes. | Pierrot porte l'eau dans l'herbe mouillée. Les seaux arrivent à moitié vides. | — |

### 2.2 Les actes

| Quête | Texte actuel | Texte proposé | Intention |
|---|---|---|---|
| lisiere | Le bois flotté s'épuise. À l'ouest, des arbres dorment sous la brume… et quelqu'un avec eux. Achète La Lisière. | Le bois flotté ne suffira pas. À l'ouest, des arbres dorment sous la brume. Et une lueur, entre eux. | La lueur de Freya (lot 04). |
| eveil-sylve | Une sauvageonne dort roulée en boule, près d'un radeau brisé. Approche sans bruit, et parle-lui. | Quelqu'un vit dans ces arbres, et se cache. Une queue rousse t'a montré le chemin. Approche sans bruit. | Freya se cache (bible V21) ; la queue de Mousse (bible § 6.7). |
| vie | Air, Eau, Feu, Terre… Les quatre Souffles ensemble, dans l'Athanor. Je crois que c'est ça, la Vie. | Air, Eau, Feu, Terre… Les quatre Souffles ensemble. Je crois que c'est ça, la Vie. | Gardée, sans « dans l'Athanor ». |
| souvenir-sylve | De la Vie naît la Plante, et de la Plante, l'Arbre. Fais-le naître : Freya se souviendra de sa forêt. | De la Vie naît la Plante, et de la Plante, l'Arbre. Freya se souviendra de sa forêt. | — |
| bosquet | Freya se souvient ! Plante le Bosquet : elle ramassera le bois mort, sans abattre un seul arbre. | Freya ramassera le bois mort. Pas un arbre ne tombera : elle y veille. | Le bois mort (choix de l'auteur, 14 oct.). |
| lumiere | Une lumière repousse la brume. Le Feu, et l'Éclair d'un orage… Le Grimoire te mettra sur la voie. | Le Feu, et l'Éclair d'un orage… Une lumière qui ne s'éteint pas. | — |
| lanterne | Assemble une Lanterne à l'établi et pose-la au bord d'un chemin. Une lumière… Je les compterai toutes. | Une lumière de plus. Je les compterai toutes. | Brume compte. |
| colline | L'orage approche, et l'Abri demande de la pierre. Au nord-est, une fissure… Achète La Colline. | L'orage approche, et l'Abri demandera de la pierre. Du côté de la Colline, quelqu'un taille la pierre. | Saturnin, entendu avant d'être vu (lot 04). |
| eveil-galet | Un vieil homme dort dans la fissure, son maillet à la main. Il ronfle comme une pierre qui roule. | Il vit dans la fissure depuis des années. Il ne parle pas beaucoup. Il ne parle pas du tout, en fait. | Il ne dort pas (bible V21) ; l'humour sec. |
| souvenir-galet | Saturnin a oublié la pierre. Le Feu et la Terre font la Lave ; l'Air la refroidit… Fais naître la Pierre. | Le Feu et la Terre font la Lave ; l'Air la refroidit… Saturnin, lui, a oublié. | — |
| carriere | « Hm. » Il dit qu'il est prêt à tailler. Ouvre la Fissure : la pierre de l'Abri viendra de là. | « Hm. » Il dit qu'il est prêt à tailler. Je crois. | Le « Je crois » de sa première traduction (bible § 8.2). |
| bois | Pour l'Abri, il faut du bois… sans faire pleurer Freya. L'Arbre et le Métal, peut-être ? | (inchangée) | Gardée. |
| cabane | Le ciel gronde déjà. Dresse l'Abri près du feu de camp : il faut tenir, tous ensemble. | Le ciel gronde déjà. Un toit, avant la pluie. | « Tous ensemble » soulignait la morale. |
| annexe | L'Abri tient ! Un bâtiment grandit aussi par ce qu'on pose autour de lui : dans sa fiche, l'onglet Annexes. | L'Abri tient. Autour de lui, il y a de la place pour autre chose. | L'onglet part. |
| jardins | Sept bouches, et la Récolte ne suffit plus. Au nord, une terre noire… et une barque de graines. Achète Les Jardins. | Sept bouches, et la marée ne suffit plus. Au nord, une terre noire, et une barque de graines échouée. | — |
| eveil-melisse | Une jardinière dort sur sa boîte en fer. Réveille-la : ses graines ont de la mémoire, dit-elle. | Une jardinière dort sur sa boîte en fer. Elle la serre comme on serre un secret. | Son secret (acte VI), en graine. |
| potager | Tes pages l'ont réveillée avant toi : elle se souvient déjà de la Plante. Bâtis le Potager. | Tes pages l'ont réveillée avant toi : elle se souvient déjà de la Plante. | — |
| faubourg | Jovin rêve d'une vraie forge. « Attends… Non. Si ! » À l'est, Le Faubourg l'attend. | Jovin rêve d'une vraie forge. Il n'ose pas le dire. Il le dit quand même. | L'incendie en non-dit. |
| atelier | Le Métal et la Terre font le Fer. Bâtis l'Atelier : Jovin forgera les outils de tous. | Le Métal et la Terre font le Fer. Jovin forgera les outils de tous. | — |
| etoile | Hermine veut explorer, mais la nuit, il faut un guide. Fais naître l'Étoile : elle tracera la route. | Hermine veut un guide, pour la nuit. Une étoile. … Oui. Une étoile. | Écrire l'Étoile trouble Brume (bible § 10, acte III) : elle se répète, sans savoir pourquoi. |
| hauteurs | Des Hauteurs, on voit tout le cœur de l'île… et ce qui dort au-delà, dans la brume. C'est de là-haut qu'on partira. | De là-haut, on voit tout le cœur de l'île… et ce qui dort au-delà, dans la brume. | « Ce qui dort » prend un double sens depuis la décision 3 : gardé. |
| expedition | Au-delà de nos quartiers, des terres dorment dans la brume. La boussole, en haut : envoie une expédition. | Au-delà de nos quartiers, des terres dorment dans la brume. Quelqu'un doit aller voir. | — |
| ruine | D'autres ont vécu ici, avant nous. Achète une terre explorée, et touche ce qui y luit. | D'autres ont vécu ici, avant nous. Il reste des pierres qui luisent. | — |
| village | Des maisons, des voisins… Notre camp devient un village. Fais-le naître dans le Grimoire. | Des maisons, des voisins… Notre camp devient un village. | — |
| crique | Hermine veut reprendre la mer. Au nord-est, une crique abritée : on dit que des dauphins y viennent. | Hermine veut reprendre la mer. Elle ne le dit pas. Elle regarde la crique. | Montré plutôt que dit. |
| souvenir-aster | « Je ne sais plus tenir une barre », dit Hermine. Le Bois et l'Eau… Fais naître le Bateau : rends-lui la mer. | « Je ne tiens plus une barre », dit Hermine. Le Bois et l'Eau… | Sa réplique validée (lot 04, cœur 4). |
| ponton-aster | Cap sur la crique ! Agrandis le Ponton : la mer devient un chemin. | Cap sur la crique, dit-elle. Ses mains ne tremblent plus. | L'écho de son souvenir (lot 04). |
| bete | Ce qu'on fabrique renaît. Une bête, dans le Grimoire : Poisson, Oiseau, Grenouille… Freya dit qu'elles attendent. | Freya dit que les bêtes attendent qu'on se souvienne d'elles. | « Fabrique » et la morale partent. |
| voyageur | Une barque approche… et ne se brise pas ! Ils ont vu nos lanternes. Comble la demande du voyageur. | Une barque approche… et elle ne se brise pas. Ils ont vu nos lanternes. | — |
| coeur | Bavarde avec la troupe, offre-leur ce qu'ils aiment. Un cœur, et ils te diront un peu de leur passé. | Ils ont tous un passé. Ils le racontent à qui revient les voir. | — |
| trouvaille | Les terres nouvelles ont leurs trésors : glace, laine, sel… Achète-en une, et ramasse un gisement. | Les terres nouvelles ont leurs trésors : glace, laine, sel… | — |
| serre | Sous le verre, tout pousse plus vite. Fais de ton Potager une Serre : Flore y sèmera ses graines étranges. | Sous le verre, tout pousse plus vite. Flore y sèmera ses graines étranges. | — |
| maison | Notre camp devient un foyer. Bâtis la Cabane : on y verra de la lumière la nuit. | Une cabane, avec une fenêtre. On y verra de la lumière, la nuit. Une de plus. | Brume compte. |
| une-maison | Des voyageurs voudraient rester. Une maison autour du Foyer, et quelqu'un pourra s'installer. | Des voyageurs voudraient rester. Il leur faut un toit. | — |
| installe | Comble un voyageur, puis propose-lui de rester : une maison l'attend. | Quelqu'un hésite à repartir. Une maison l'attend. | — |
| hameau | Des toits dorment sous la brume, à l'est. Achète Le Hameau : une baleine passe parfois au large. | Des toits dorment sous la brume, à l'est. Une baleine passe parfois au large. | — |
| potion | Marcelle repose sa cuillère. « Plus rien n'a de goût… Ce n'est pas la brume, c'est moi. » Le Grimoire se souvient du Remède : écris-le. | Marcelle repose sa cuillère. « Plus rien n'a de goût… Ce n'est pas la brume, c'est moi. » Le livre se souvient du Remède. | Validée en substance (choix de l'auteur, 12 oct.) ; seule la consigne finale part. |
| alchimiste | Le Remède est le plan d'une maison très ancienne. Bâtis-la : quelqu'un y a laissé son bureau. | Le Remède est le plan d'une maison très ancienne. Quelqu'un y a laissé son bureau. | — |
| peuple | Une table, une soupe, un nom : c'est comme ça que tout commence. Comment s'appelle notre peuple ? | Une table pour tous, et pas encore de nom. Comment s'appelle notre peuple ? | La première phrase est le mot d'Héliane de l'acte V : Brume ne le répète pas avant qu'on l'ait lu. |
| phare | Sur l'Îlot aux Mouettes dort le phare éteint des Anciens. Achète-le : je dois savoir ce qui s'est passé. | Sur l'Îlot aux Mouettes dort le phare éteint des Anciens. Je dois savoir ce qui s'est passé. | — |
| ecriture | Saturnin lit les runes des Anciens. Le Langage et la Pierre : réapprenons à écrire, nous aussi. | Saturnin lit les runes des Anciens. Le Langage et la Pierre… Réapprenons, nous aussi. | — |
| cle | « J'ai laissé la clé du phare sous une pierre », écrivait H. Le Cercle de menhirs… Pierrot, ta baguette ? | (inchangée) | Gardée. |
| tour | Pour lire tout ce qui revient, il faut une tour. Bâtis la Tour d'étude : son plan, c'est le Livre. | Pour lire tout ce qui revient, il faut une tour. | — |
| civilisation | Une ville, et l'écriture : nous ne sommes plus des naufragés. Fais naître la Civilisation. | Une ville, et l'écriture. Nous ne sommes plus des naufragés. | — |
| phenix | J'ai froid, tout à coup… Le Feu et la Vie. Fais naître le Phénix, s'il te plaît. | J'ai froid, tout à coup… Le Feu et la Vie. S'il te plaît. | Elle pâlit (acte VI) ; elle n'a plus la force de finir sa phrase. |
| ile-legendes | Le Passeur attend avec sa barque qui vole. Sur L'Île des Légendes, Héliane a laissé son dernier mot. | (inchangée) | Gardée. |
| feu-follet | Le Feu et le Marais… C'est ma recette, n'est-ce pas ? Fais-moi naître. Ce qui est né ne s'oublie plus. | Le Feu et le Marais… C'est moi, n'est-ce pas ? Écris-moi. Ce qui est écrit ne s'oublie plus. | Le thème, dit une seule fois, au bon moment : la fin (décision 12). |
| phare-brume | Jovin a monté la lentille. Il ne manque que la flamme… Allume le Phare : je serai sa lumière. | (inchangée) | Gardée. |

---

## 3. Les autres textes du serveur

Le reste de `src/texts/` du serveur est de l'interface (erreurs, refus, règles de pose) : hors audit (décision 13), sauf ce qui suit.

| Fichier, identifiant | Texte actuel | Verdict | Texte proposé | Raison |
|---|---|---|---|---|
| `lands.js`, `LANDMARK_TEXTS` | (les treize descriptions des lieux) | Garder | — | Le bon registre (« immobiles comme des souvenirs »). |
| `brume.js`, `RESTED` | La brume s'est levée sur toute l'île. Merci, alchimiste : elle est de nouveau vivante. | Élever | La brume s'est levée sur toute l'île. Elle est de nouveau vivante. Merci, Alchimiste. | « Alchimiste » prend la majuscule du nom que la troupe donne au joueur (veillée V) ; le merci en dernier pèse plus. |
| `nights.js`, `ALREADY_SULKING` | Celui-là boude déjà dans la brume. | Réécrire | Celui-là est déjà rentré dans la brume. | Les égarés ne boudent pas (lot 03). |
| `chests.js`, `HERMINE_KEEPSAKES` | Longue-vue, Filet, Carnet de quart (le plan du Ponton), piquets | Garder | — | — |
| le reste (`account`, `errors`, `villagers`, `world`, `beasts`…) | (interface) | hors audit | — | — |

---

## 4. Les points à trancher

1. **Le titre garde la consigne, Brume garde sa voix** (§ 2) : ce que dit Brume ne répète plus le geste. Si le coach ne le montre pas toujours, le joueur a encore le titre. **Recommandé : oui.**
2. **Les titres des quartiers gardent « Achète »** (Achète La Lisière, Achète Les Jardins…). C'est la règle du jeu, et un titre est de l'aide. L'autre choix serait « Libère La Lisière », plus juste dans le monde (bible : « libérer le quartier »), mais moins clair sur le prix. **Recommandé : garder « Achète ».**
3. **Le serveur est un autre dépôt** : je n'y écris rien (je n'en ai que la lecture). L'autre agent intègre ce lot dans `og-create-backend/src/texts/quests.js` ; le front n'a rien à changer pour ces textes, il les reçoit du serveur. **Recommandé : oui.**
