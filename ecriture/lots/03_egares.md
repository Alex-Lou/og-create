# Lot 03 — Les égarés

> Ce lot donne leur voix, ou plutôt leur silence, aux égarés : ce que Brume en dit au tutoriel, la veillée de la deuxième nuit, la fiche des nuits, le bilan du matin, leurs noms, et leur histoire pour la bible.
> - Décisions appliquées : `ton.md` § 0 (3, 7 bis, 11, 12, 14, 21) et la fiche des égarés (`ton.md` § 4.13). L'agent du dessin a la consigne « sans grimace » (choix de l'auteur, 14 oct.).
> - Leurs manières de nuit, déjà dans le jeu, sont suivies à la lettre : le Sans-Nom dévie vers la lumière ; la lumière ne fait rien au Dormeur, une clôture l'endort ; le Noyé sort de la mer ; la Racine passe sous les clôtures ; l'Esprit, repoussé, revient une fois, et seule la lumière le libère.
> - **Validé par l'auteur le 15 octobre**, avec les cinq recommandations du § 9.
> - Depuis, l'agent du dessin a livré les égarés du Voile (#605) et les bêtes de brume (#606) : « corps de brume au trait bleu nuit, contre-jour de lune, un seul souvenir chaud qui devient la luciole ». Là où mes descriptions d'image (§ 1.2) diffèrent de ces dessins, **les dessins font foi** ; l'histoire et les textes du lot ne changent pas. Les noms des cinq égarés sont déjà dans `egares.json` ; ceux des bêtes de brume gardent encore leur parenthèse.
> - Le bilan du matin vit désormais dans `src/texts/world/nights.js` (rangement de l'autre agent).

---

## 1. Leur histoire, pour la bible

Proposition de fiche, pour remplacer le registre « petits fantômes, petits zombies tout mous, choupies » de la bible (§ 0, § 3 pilier 6, § 6.15, § 7.2, § 14). C'est la référence pour écrire ; le joueur n'en lit presque rien avant l'acte VI.

### 1.1 Ce qu'ils sont

- **Ce que le Voile a effacé.** Le Voile est le souffle de ce qui dort sous l'île (décision 3) : là où il passe, les noms, les mots, les visages s'effacent. Ce qu'il efface ne disparaît pas tout à fait : ça erre. La nuit, quand la brume s'avance, ces restes en sortent. Brume les appelle **les égarés**.
- **Ils ne sont pas les soldats de la chose.** Ils sont ce qu'elle a pris. Ils ne veulent pas de mal ; ils cherchent ce qui brille, parce que ce qui brille ressemble à ce qu'ils ont perdu.
- **La lumière les libère.** Changés en lucioles, ce sont des mémoires rendues. On ne le dit pas avant l'acte VI ; Anya le dira à demi-mot : « Ils ont oublié leur chemin, comme ceux d'avant. »
- **Ce qu'ils touchent oublie.** Un égaré qui atteint un bâtiment s'y pose et s'y dissout : le bâtiment est *embrumé*, il a oublié son travail. Le réparer, c'est le lui rappeler (un peu de pierre ou de bois). Rien n'est détruit.
- **Leur registre** : beaux et inquiétants, lents, silencieux ; jamais une grimace, jamais un gag. On ne les voit pas souffrir ; on ne les voit pas mourir. Une clôture les arrête, un toucher les renvoie, la lumière les délivre.

### 1.2 Chacun

| Égaré | Espèce (serveur) | Ce que le Voile a pris | Sa manière (déjà dans le jeu) | Ce qu'il laisse (proposé : point n° 2) | À l'image (pour l'agent du dessin) |
|---|---|---|---|---|---|
| **Le Sans-Nom** | `fantome` | un nom | il dévie vers la lumière ; la lumière le libère | la moitié d'un nom, murmurée en s'éteignant | une silhouette pâle, au visage lisse, qui tend la tête vers les lumières comme on tend l'oreille |
| **Le Dormeur** | `zombie` | les mots d'un Ancien | la lumière ne lui fait rien ; une clôture l'arrête, il s'y endort jusqu'au matin | des mots d'une langue oubliée, marmonnés en dormant (Saturnin les reconnaîtra : point n° 2) | une haute silhouette aux yeux clos qui marche en dormant, les bras ballants ; contre une clôture, il s'adosse et dort debout |
| **Le Noyé de l'Hirondelle** | `noye` | la nuit du naufrage | il sort de la mer, pas de la brume | le son d'une cloche de bord, très loin | une forme qui sort de l'eau, ruisselante de brume plutôt que d'eau ; une lanterne de pont éteinte à la main. **Ce n'est pas un mort** : c'est la nuit elle-même, que les rescapés ont oubliée (point n° 3) |
| **La Racine errante** | `racine` | le nom d'un arbre | elle passe sous les clôtures | un craquement de bois vert ; parfois, au matin, une pousse là où elle est passée | une racine pâle, couleur de bois écorcé, qui avance par vagues lentes et plonge sous la terre. **Pas noire** : elle n'est pas de la famille des racines du naufrage (point n° 1) |
| **L'Esprit sylvestre revenant** | `esprit` | la voix d'Anya | repoussé, il revient une fois ; seule la lumière le libère | un bruissement de feuillage qui ressemble à une voix | une forme de feuilles et de lueur verte, sans contour net, qui se défait et se refait en marchant |
| **Les bêtes de brume** | `bete` | des bêtes oubliées | elles sortent de la brume de leur climat | rien | la bête du climat, pâle, translucide, qui se défait en brume aux bords |

### 1.3 Ce qu'on ne dit jamais

- Avant l'acte VI : qu'ils sont des souvenirs effacés ; d'où ils viennent ; que la chose sous l'île regarde à travers la brume.
- Jamais : « petit », « tout mou », « bouder », « grognon », « choupi » ; « monstre », « ennemi », « tuer », « vaincre ».
- Brume ne sait pas ce qu'ils sont. Elle les observe ; elle se trompe parfois ; elle dit « ma brume » jusqu'à l'acte VI (décision 7 bis).

---

## 2. Les noms

Ils sont dans `design/bibliotheque/svg/egares/egares.json` (le champ `nom`), à changer par l'autre agent. Le jeu ne les affiche nulle part aujourd'hui (`strayName` n'est appelé par aucun écran : vérifié) ; ils serviront au bilan, à une fiche, à la Chronique.

| Espèce | Nom actuel | Nom proposé | Intention |
|---|---|---|---|
| `fantome` | Petit fantôme | Le Sans-Nom | Le nom choisi par l'auteur le 14 oct. |
| `zombie` | Petit zombie tout mou | Le Dormeur | Idem. |
| `noye` | (pas encore dessiné : le Sans-Nom en attendant) | Le Noyé de l'Hirondelle | Idem. |
| `racine` | (idem) | La Racine errante | Idem. |
| `esprit` | (idem) | L'Esprit sylvestre revenant | Idem. |
| `lapin-de-brume` | Lapin de brume (tempéré) | Le lapin de brume | La parenthèse est une note de dessin, pas un nom. |
| `bouquetin-de-brume` | Bouquetin de brume (les Cimes) | Le bouquetin de brume | Idem. |
| `poney-de-brume` | Poney de brume (les Landes) | Le poney de brume | Idem. |
| `grenouille-de-brume` | Grenouille de brume (le Marais) | La grenouille de brume | Idem. |
| `fennec-de-brume` | Fennec de brume (les Dunes) | Le fennec de brume | Idem. |
| `cameleon-de-brume` | Caméléon de brume (la Jungle) | Le caméléon de brume | Idem. |
| `salamandre-de-brume` | Salamandre de brume (le Volcan) | La salamandre de brume | Idem. |
| `nightArt.strayName` (repli) | Un égaré | Un égaré | Gardé. |

---

## 3. Brume les présente (le tutoriel, jour d'Hermine)

Quête `clotures` : Hermine plante ses piquets ; Brume dit à quoi ils servent. La caméra regarde le passage des égarés au nord (`look: 'barrage'`).

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.joli-camp | Hermine | ses piquets | Naufragés, d'accord. Mais rien n'interdit d'avoir un joli camp. | (inchangée, lot 02) | — |
| LINES.egares-nuit | Brume | idem | Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils ne sont pas méchants : ils cherchent ce qui brille, et marchent tout droit. | Joli, et sûr. La nuit, des égarés sortent de ma brume. Ils cherchent ce qui brille… sans savoir pourquoi. | « Ils ne sont pas méchants » expliquait ; il reste un fait, et une question. « Ma brume » reste : le doute de Brume (décision 7 bis), et une erreur que la décision 3 rend inquiétante. |
| LINES.egares-nord | Brume | la caméra sur le passage | Ils viennent de la brume, de partout. Un enclos autour du feu, et ils font demi-tour. | Ils viennent de partout. Une clôture tout autour du feu… et ils s'arrêtent, je crois. | Moins sûre d'elle : « je crois ». Elle n'a jamais vu ça de près. |
| LINES.cloture-deux | Brume | idem | (lot 02) | (lot 02) | — |

---

## 4. La veillée de la deuxième nuit (`VEILLEE`)

Quand on touche Brume pour dormir, le feu baisse (`demo: 'eteint'`), cinq égarés sortent de la brume l'un après l'autre (`demo: 'egare'` : trois Sans-Nom au nord, le Dormeur à l'ouest, l'Esprit à l'est) et butent sur l'enclos ; le Dormeur s'y endort ; le feu repart (`demo: 'rallume'`), le Dormeur se réveille et rentre.

Cette suite se joue sur l'île mais se lit comme une scène : je propose de lui appliquer la règle des scènes (six bulles au plus), puisqu'aucun geste n'est attendu pendant la démonstration.

| Identifiant | Qui parle | Démonstration | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.cachons | Brume | `eteint` | Chut… Cachons-nous. Ne bouge plus. | Chut… Cachons-nous. Ne bouge plus. | Gardée : la peur vraie, en quatre mots. |
| LINES.egare-la | Brume | `egare` | Chut… Là, au bord de la brume. Un égaré. | Chut… Là, au bord de la brume. Un égaré. | Gardée. |
| LINES.visiteurs | Brume | (en marche) | Ils viennent parfois, quand le feu baisse. Des égarés… Mieux vaut ne pas trop s'en approcher. | Celui-là marche les yeux fermés. Il ne regarde même pas le feu. | Au lieu d'un conseil, une chose vue : le Dormeur, que la lumière n'attire pas. Le joueur comprendra seul pourquoi le feu ne l'arrête pas. |
| **LINES.dormeur-pique** | Brume | (le Dormeur contre l'enclos) | — | Il s'est endormi contre les piquets. … Comme s'il n'attendait que ça. | La manière du Dormeur, montrée et à peine commentée. Une tendresse inquiète. |
| LINES.cloture-voyez | Brume | `rallume` | Vous voyez ? Une clôture ne fait de mal à personne. Elle dit seulement : pas par ici. | Le feu repart. Ils rentrent dans la brume, sans un bruit. Ils reviendront. | La morale part ; la menace douce reste (« Ils reviendront »). Plus de bouderie dans le texte. |
| LINES.aster-dormir | Hermine | après | Je dormirai mieux, ce soir. | (inchangée) | Gardée : elle se dit après la démonstration, et elle sonne mieux après. *(À vérifier : elle se dit aujourd'hui avant.)* |

---

## 5. La cuisine de Marcelle (jour 3)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| LINES.cuisines | Brume | son enclos | Les égarés aiment les cuisines. Un enclos autour de la sienne, et elle dormira tranquille. | Les égarés cherchent ce qui brille, et une cuisine brille toute la nuit. Un enclos autour de la sienne. | « Aiment » leur prêtait un goût ; c'est la braise qui les attire. Marcelle répond déjà (« Et pas de piquet dans mes casseroles, hein. »). |

---

## 6. Les nuits de l'île (`NightSheet.vue`, à la fin du tutoriel)

La fiche où Brume présente les nuits, le lendemain du Campement. Oubliée de la première passe de l'audit (ajoutée : `audit.md` § 10.10).

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| INTRO.1 | Brume | fiche « Les nuits de l'île » | La nuit, de petites créatures perdues sortent de la brume. Grognonnes plus que méchantes : elles embrument ce qu'elles touchent. | La nuit, des égarés sortent de la brume. Ils cherchent ce qui brille, et ce qu'ils touchent oublie son travail. | Ni « petites » ni « grognonnes ». L'embrumement dit par son effet (§ 1.1). |
| INTRO.2 | Brume | idem | Tes lumières les changent en lucioles, tes clôtures les arrêtent, et d'un toucher tu en repousses une. | Tes lumières les changent en lucioles. Presque tous. Tes clôtures les arrêtent, et ta main peut en renvoyer un. | « Presque tous » : le Dormeur, sans le nommer. La règle reste dite, parce que c'est Brume qui l'a vue faire. |
| INTRO.3 | Brume | idem | Rien n'est jamais perdu : un bâtiment embrumé se répare. La première nuit vient demain. | Un bâtiment embrumé se répare, et rien ne se perd. La première nuit vient demain. | Resserrée. |
| titre, boutons | — | idem | Les nuits de l'île / La nuit dernière / Je veillerai / Merci, Brume | (inchangés) | Gardés : « Je veillerai » est juste. |

---

## 7. Le bilan du matin (`recapOf`, `src/world/strays.js`)

Brume le dit au matin, dans la fiche « La nuit dernière ». Les données du serveur sont des totaux (`luciole`, `barre`, `dort`, `coq`, `camarade`, `touche`, `arrive`, et le bâtiment embrumé). Le singulier et le pluriel s'écrivent en entier.

### 7.1 Avec les données d'aujourd'hui

| Identifiant | Qui parle | Cas | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| recap.total | Brume | 1 / plusieurs | Cette nuit, 1 égaré est sorti de la brume. / Cette nuit, ${n} égarés sont sortis de la brume. | Cette nuit, un égaré est sorti de la brume. / Cette nuit, ${n} égarés sont sortis de la brume. | « Un » en toutes lettres. |
| recap.luciole | Brume | 1 / plusieurs | 1 est devenu luciole près de tes lumières. / ${n} sont devenus des lucioles près de tes lumières. | L'un s'est changé en luciole, près de tes lumières. / ${n} se sont changés en lucioles, près de tes lumières. | Le même geste, sans chiffre isolé en tête de phrase. |
| recap.barre | Brume | 1 / plusieurs | 1 a boudé devant une clôture. / ${n} ont boudé devant une clôture. | L'un s'est arrêté au bord de tes clôtures, puis il est rentré dans la brume. / ${n} se sont arrêtés au bord de tes clôtures, puis sont rentrés dans la brume. | « Bouder » part (sans grimace). **Le Dormeur n'est plus compté ici** : il a sa ligne (`recap.dort`). |
| **recap.dort** | Brume | 1 / plusieurs | (compté avec `barre`) | Le Dormeur s'est endormi contre tes clôtures. Il est reparti à l'aube, sans se réveiller tout à fait. / ${n} Dormeurs se sont endormis contre tes clôtures. Ils sont repartis à l'aube. | Le texte propre au Dormeur, demandé par le commit du 14 oct. Le serveur donne déjà `dort` à part. |
| recap.coq | Brume | — | Coquelicot a chanté : un égaré a filé dans la brume. | (inchangée) | Validée le 14 oct. |
| recap.camarade | Brume | 1 / plusieurs | Tes camarades en ont renvoyé ${n}. | Tes camarades en ont renvoyé un. / Tes camarades en ont renvoyé ${n}. | « Un » en toutes lettres. |
| recap.touche | Brume | 1 / plusieurs | Tu en as repoussé ${n} toi-même. | Tu en as renvoyé un toi-même. / Tu en as renvoyé ${n} toi-même. | « Renvoyer », le mot du toucher (ton § 4.13). |
| recap.panne | Brume | un bâtiment embrumé | Un bâtiment est embrumé (${site}) : répare-le depuis sa fiche. | Un égaré s'est posé sur ${site}. Il a oublié son travail : il faudra le réparer. | L'embrumement dit par son effet ; plus de « depuis sa fiche » (le bouton « Réparer » s'y voit). |
| recap.tenu | Brume | aucun bâtiment embrumé | Rien n'a été embrumé : le camp a tenu. | Rien n'a été embrumé. Le camp a tenu. | Deux phrases : la seconde pèse plus. |

### 7.2 Si le serveur dit qui était là (point n° 4)

Le commit du 14 octobre annonce « les textes propres à chacun ». Ils demandent que le serveur donne, pour la nuit, les espèces présentes et l'Esprit revenu : une donnée de plus, à la charge de l'autre agent. Je les écris pour qu'ils soient prêts ; chacune se dit une fois par nuit au plus, après la ligne du total.

| Identifiant | Qui parle | Cas | Texte proposé | Intention |
|---|---|---|---|---|
| **recap.sans-nom** | Brume | un Sans-Nom changé en luciole | Avant de s'éteindre, l'un a murmuré quelque chose. La moitié d'un nom, je crois. | Ce qu'il laisse (§ 1.2), sans dire ce qu'il est. |
| **recap.noye** | Brume | un Noyé cette nuit | L'un est sorti de la mer, pas de la brume. J'ai entendu une cloche, très loin. | La cloche de bord : l'Hirondelle, sans la nommer. |
| **recap.racine** | Brume | une Racine passée sous une clôture | L'une est passée sous tes clôtures, comme une racine sous un mur. Ce matin, il y a une pousse à cet endroit. | Sa manière, et la pousse qu'elle laisse. *(La pousse n'existe pas à l'image : à retirer si l'agent du dessin ne la fait pas.)* |
| **recap.esprit** | Brume | l'Esprit revenu | L'un est revenu, après que tu l'as renvoyé. Il voulait quelque chose, je crois. Seule la lumière l'a apaisé. | Sa manière (il revient une fois ; seule la lumière le libère), et la voix d'Anya qu'on ne nomme pas. |
| **recap.bete** | Brume | une bête de brume | Une bête est sortie de la brume, cette nuit. Une bête que plus personne n'a écrite. | Le Grimoire, en creux : ce qu'on n'écrit pas s'efface. |

---

## 8. Le bâtiment embrumé (`SiteOverview.vue`)

| Identifiant | Qui parle | Où | Texte actuel | Texte proposé | Intention |
|---|---|---|---|---|---|
| blight-text | fiche | la fiche d'un bâtiment embrumé | **Embrumé** : un égaré l'a atteint cette nuit, il ne produit plus. | **Embrumé** : un égaré s'y est posé cette nuit. Il a oublié son travail. | Le même fait, dans le registre des égarés (§ 1.1). Le bouton « Réparer » reste à côté. |
| nights.js, erreur | aide | un toucher refusé par le serveur | Cet égaré n'a pas pu être repoussé. | (inchangée) | Message d'erreur : gardé. |

---

## 9. Les points tranchés (15 octobre : oui aux cinq recommandations)

1. **La Racine errante n'est pas de la famille des racines du naufrage.** Les racines noires du naufrage sont celles de ce qui dort sous l'île ; la Racine errante est ce qui reste d'un arbre dont le Voile a effacé le nom. Je propose de les distinguer à l'image (pâle et noire) et de ne jamais les rapprocher dans le texte. **Recommandé : oui.** L'autre choix, en faire une racine de la chose, la changerait en sentinelle, contre « ils sont ce qu'elle a pris ».
2. **Ce que chaque égaré laisse** (§ 1.2) : la moitié d'un nom, des mots d'une langue oubliée, une cloche, un craquement, un bruissement. C'est un ajout à l'histoire. Il ouvre une porte : à l'acte III, Saturnin reconnaîtrait dans les mots du Dormeur la langue des runes des Anciens (« Hm. Ce sont les mots des pierres. »), ce qui prépare l'acte VI. **Recommandé : oui**, la porte de Saturnin comprise (elle s'écrira au lot 04, avec les maîtres).
3. **Le Noyé de l'Hirondelle et Hermine.** Le Noyé est la nuit du naufrage, que le Voile a prise aux rescapés ; or Hermine se croit coupable parce qu'elle ne se souvient pas du moment (« La brume est venue d'un coup »). Je propose une graine, sans un mot avant l'acte VI : quand un Noyé est sorti de la mer, Hermine ne regarde pas la mer le lendemain (une pose, pas une réplique). À l'acte VI, la vérité du Voile éclaire aussi ça. **Recommandé : oui, en graine muette.**
4. **Les lignes par espèce** (§ 7.2) demandent une donnée de plus au serveur (qui était là cette nuit, l'Esprit revenu). Je les ai écrites pour qu'elles soient prêtes. **Recommandé : les garder en réserve** ; l'autre agent dira si la donnée est simple à donner. Seul `recap.dort` sert dès aujourd'hui.
5. **L'embrumement, c'est l'oubli** : « il a oublié son travail », et réparer, c'est le lui rappeler. C'est cohérent avec le Voile qui efface, et ça ne change aucune règle. **Recommandé : oui**, et la bible (§ 6.15) le dira ainsi.

---

## 10. Pour l'autre agent (rien n'est à intégrer avant le « oui » de l'auteur)

- Les noms dans `design/bibliotheque/svg/egares/egares.json` (§ 2).
- Une réplique nouvelle dans `VEILLEE` (`dormeur-pique`, pendant que le Dormeur dort contre l'enclos), et `aster-dormir` à placer après la démonstration, si c'est simple.
- Dans `recapOf` : le Dormeur sort de la ligne `barre` et prend la sienne (`dort`) ; singuliers et pluriels en toutes lettres.
- En réserve : les lignes par espèce (§ 7.2), si le serveur peut dire qui était là.
- Pour l'agent du dessin : les descriptions du § 1.2 (la Racine pâle, le Noyé qui ruisselle de brume, une lanterne éteinte à la main), et la pousse de la Racine si on garde `recap.racine`.
- Le coq : `SOUNDS.rooster` (« Cocorico ! ») s'affiche au-dessus du poulailler quand il chasse un égaré. Les onomatopées des bêtes sont au lot 04 ; le coq y sera repris.
