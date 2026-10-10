# Passation design — personnages, kit, splash

Pour l'agent design suivant. Ce fichier dit ce qui a été fait sur la branche `claude/brumelune-design-agent-1ssmbf` (PR #482), le niveau de qualité que l'utilisateur accepte, les règles à suivre et ce qui reste à faire. Le prompt à donner au prochain agent est à la fin.

## 1. Le niveau de qualité accepté

- **Chibi AAA, « choupi », jamais bébé** : mignon mais pas enfantin ni niais. L'esprit est celui d'un RPG d'artisanat, riche et varié, sans perdre la qualité. Ne jamais citer de jeu existant, ni dans le code ni dans les textes.
- **Jamais plat** : chaque matière porte un dégradé de lumière (clair en haut à gauche, ombre en bas à droite), avec des reflets, du volume et une ombre au sol. Les contours sont teintés (une nuance plus sombre de la matière), pas noirs.
- **Animations fluides** : du SMIL adouci (keySplines), avec des durées et des départs décalés d'un élément à l'autre. On fait respirer, flotter, se balancer. **Jamais de clignotement** : pas d'images qui s'échangent sèchement, pas de flash. Un clignement des yeux se fait par une paupière qui descend en douceur ou un fondu bref.
- **Rien ne sort du cadre** : à vérifier avec `verif_avatar.mjs` et `clipcheck`.
- **Pas de filtre SVG** (`feDropShadow`, flou) : le flou et les lueurs se font avec des dégradés radiaux.
- **Mobile d'abord** : téléphone en portrait (390 × 844). Tout ce qui compte tient dans la bande visible au centre.

## 2. Ce que l'utilisateur a refusé (à ne pas refaire)

- **Redessiner un personnage existant dans un autre style.** Mon buste d'Anya refait « façon anime » a été jugé « dégueulasse ». La règle : **on garde la forme, le visage et les couleurs du dessin du jeu, et on pousse seulement le rendu** (lumière, contre-jour, modelé, reflets, animations).
- **Préférer mes dessins improvisés aux dessins du jeu.** Le jeu a déjà de beaux dessins (campement, cultures, verger, bêtes) : on les prend et on les éclaire, plutôt que de les refaire en moins bien.
- **Les manches coupées droit** (« barre droite », « moignons »). La manche suit le tissu : bord arrondi redessiné par-dessus l'avant-bras, ombre courbe, bras devant le corps, `enfoncer` à 1,1 px.
- **Les vêtements mal alignés sur les épaules** (naufragés en marche).
- **Les compositions avec du vide, à plat, loin.** Pour une affiche, le sujet doit être très proche et très grand, les couches doivent se chevaucher, avec de la profondeur.
- **Pousser sans montrer.** Toujours montrer les SVG et les animations (captures téléphone et ordinateur, plusieurs instants), puis attendre un oui explicite avant tout push.

## 3. Le kit des personnages (fait)

Source : `design/personnages/troupe.js`, utilisé par `avatar.js`, les 7 maîtres (`aster.js` … `sylve.js`), les naufragés, les visiteurs, Anya (`atelier/anya.js`) et le Passeur.

- **Images par pose** : `IMAGES = { repos: 4, marche: 8, salut: 4, action: 2 }`. La marche se fait de trois quarts (vues `se` et `ne`), avec une vraie foulée.
- **Lumière** : `lumiere(c, id, k)` et `peindre(s, table)` posent un dégradé par couleur. Les habits partagent un même champ de lumière (userSpace), pour que la lumière soit continue d'une pièce à l'autre.
- **Bras** : `arm(c, a, b, elbow, main, partie)`. Les manches (`c.sleeves`) peuvent être :
  - `court` : ourlet à 0,77 de la longueur du bras, bout arrondi, ombre courbe ;
  - `roll` : retroussée, avec un bourrelet fin et courbe ;
  - `torn` : arrachée au coude, bord en dents.
- **Avatar** : `avatar.js`, `avatar_choix.js`, `avatar_accessoires.js`. Le genre et la barbe, la moustache et le bouc viennent de master et ont été fusionnés avec le kit éclairé. `auHasard(graine)` tire un avatar.
- **Anya** : `anyaFrame(view, pose, n, expr, saison)`, cadre 80 × 128, pieds en (40, 125). Poses `face_repos`, `avant_marche`, `dos_marche`, `face_benediction`, `face_eveil` (bras ouverts).
- **Brume** : `brumeFrame(stade, n, expr)`, cadre 40 × 48, stades s0 à s7, flamme de y 13,5 à 41.

### Régénérer et vérifier

- `npm ci` à la racine (pour esbuild), puis les `preview_*` dans l'ordre du README de l'atelier, puis `build_bundle.js`.
- Après une régénération complète, restaurer les planches que la régénération n'a pas à toucher (`git checkout`) : batiments_objets, batiments_paliers, batiments_pieces_rares, batiments_skins, batiments_teintes, camp_grandit, coffres, decor_enseignes, meteo_moments, minijeux, ruines_anciens, planche_brume, planche_cerf.
- Vérifications :
  - `verif_generateurs.mjs` : les générateurs donnent exactement les mêmes fichiers ;
  - `verif_generateur.mjs` : le module de l'avatar ;
  - `verif_avatar.mjs` : aucun choix ne casse le dessin ni ne sort du cadre ;
  - `npx vitest run` et `npm run lint`.
- Le test `tests/masterArt.test.js` attend 8 images de marche (`aster_dos_marche_6`).

## 4. Le splash (écran de démarrage) — état actuel, poussé

- `index.html` : plein écran en trois couches :
  - le fond `public/img/splash/fond.svg`, recadré au centre (`object-fit: cover`, `object-position: 50% 30%`) ;
  - l'affiche `public/img/splash/affiche.svg`, posée en bas ;
  - le titre, la progression et « Entrée » par-dessus.

  Les crochets de `src/utils/splash.js` (id, `data-step`, classes d'état) sont gardés. Qui demande moins de mouvement reçoit les versions `-fixe.svg`.
- `design/atelier/preview_splash.js` écrit les quatre SVG. `splash.js` compose les couches :
  - **fond** : ciel, lune, mer, Anya et l'île ;
  - **affiche** : Brume immense, les 7 maîtres en couches, le Grimoire ouvert, les sept sceaux qui tournent, des rayons, des ondes.
- `splash_anya.js` :
  - Anya = son dessin du jeu (« éveil ») avec un contre-jour doré, la lumière de ses mains, un reflet qui passe et un clignement en fondu ;
  - les outils partagés : `degrade`, `rayonne`, `forme`, `trait`, `balance` ;
  - `eclairer(corps, id, box, cote, force)` : **le passage de lumière commun**, à appliquer à tout dessin du jeu posé dans une scène (contre-jour, modelé vertical et latéral, découpé à la silhouette, les formes transparentes exclues).
- `splash_ile.js` : le terrain de l'île (falaise, plage, herbe) est dessiné, le reste vient du jeu et est éclairé :
  - les cabanons des maîtres, la cuisine de Cannelle (le feu), l'Hirondelle échouée ;
  - les cultures (blé, choux, carottes), le verger ;
  - les bêtes de la ferme.
- `splash_brume.js` : Brume = son dessin du jeu (s1) en très grand : flamme vitrée qui ondule (le tracé se déforme), cœur de lumière, reflets de verre, particules à l'intérieur, langues de feu sur les flancs, clignement par la paupière.

### Ce qui reste sur le splash

- Le Grimoire de l'affiche est un dessin improvisé. Il faut le remplacer par celui du jeu (le Grimoire fermé de sept sceaux de `scenes6.js` ou `interface/hd/grimoire_icone.svg`), éclairé et grand.
- Le terrain de l'île (herbe, falaise) reste un peu plat : il lui faut du relief, des textures d'herbe et de roche, et une transition avec la mer.
- Sur ordinateur, l'affiche ne couvre que le centre. Il faut habiller les côtés (brume, lucioles, rochers au premier plan) pour qu'il n'y ait plus de vide.

## 5. Ce qui reste à faire pour les personnages

1. **Rendu de près** : appliquer à toutes les illustrations grand format (scènes, cinématiques, portraits) le même passage de lumière que le splash (`eclairer`), sans changer les dessins.
2. **Les 16 autres scènes des étapes 00 à 06** (`scenes7.js`) : même traitement que 01_noir, 02_lueur et 02_rocher, qui ont été acceptées.
3. **Seconde passe sur les matières** des habits : tissu, cuir, laine, métal ont chacun leur reflet propre.
4. **Bêtes et plantes** : la même exigence de lumière et de volume (revue faite au début de la session, pas encore appliquée).
5. **Accessoires selon la posture et la rotation** : à contrôler à chaque nouvelle pose (lanterne, parapluie, outils).

## 6. Méthode et règles

- Rester dans `design/` (plus `index.html` et `public/img/splash/` pour le splash). Ne pas toucher au code sans lien avec la tâche.
- Ne jamais lancer `git reset --hard` sans copie de sûreté, ni `pkill -f`. Ne pas modifier de fichiers pendant qu'une génération tourne.
- Demander avant de supprimer ou d'ajouter un fichier publié, et avant tout push ou merge.
- Écrire en français, avec des commentaires dans le style de l'existant.
- Aucun nom de modèle d'IA dans les commits, la PR ou le code.
- Montrer d'abord : un serveur statique local et Playwright (chromium dans `/opt/pw-browsers`), des captures téléphone 390 × 844 et ordinateur 1440 × 900, plusieurs instants pour juger les animations.
- Terminer chaque tâche par quatre listes : Fichiers modifiés / Ce qui a été modifié / Fichiers intentionnellement non touchés / Suivi nécessaire.

## 7. Prompt pour le prochain agent

```
Tu es l'agent design de Brumelune (repo alex-lou/og-create). Lis d'abord design/PASSATION_DESIGN.md en entier, puis
design/atelier/README.md. Tout le design est du SVG généré par code (design/atelier, design/personnages).

Niveau exigé : chibi AAA « choupi », jamais bébé ; jamais plat (dégradés de lumière, reflets, volume, ombres) ;
animations SMIL fluides et décalées, jamais de clignotement ; rien hors cadre ; pas de filtre SVG ; mobile d'abord ;
ne jamais nommer de jeu existant.

Règle d'or : on ne change JAMAIS la forme, le visage ni les couleurs d'un personnage ou d'un dessin du jeu ; on pousse
seulement son rendu (utilise eclairer() de design/atelier/splash_anya.js). On préfère toujours les dessins du jeu à des
dessins improvisés.

Méthode : pose tes questions si quelque chose n'est pas clair ; montre des captures (téléphone 390×844 et ordinateur
1440×900, plusieurs instants) avant tout push et attends un oui explicite ; régénère et vérifie (verif_generateurs,
verif_generateur, verif_avatar, vitest, lint) ; termine par les quatre listes (Fichiers modifiés / Ce qui a été modifié /
Fichiers intentionnellement non touchés / Suivi nécessaire).

Première tâche : la section 4 « Ce qui reste sur le splash », puis la section 5.
```
