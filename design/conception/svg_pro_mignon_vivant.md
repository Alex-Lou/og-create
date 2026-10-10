# Brumelune — Faire du SVG de jeu « pro, mignon et vivant »

*Guide de recherche, octobre 2026. Format : **règle → chiffres → code**. Les chiffres sont des valeurs de départ à calibrer à l'œil sur nos sprites (tuile 80×40 ×1.25 = 100×50 px à l'échelle finale). Quand une règle vient d'une source précise, elle est citée ; sinon c'est une pratique d'atelier courante (pixel art, motion design, jeux mobiles), traduite en nombres.*

---

## 0. Les trois principes qui pilotent tout le reste

1. **La lisibilité d'abord.** Matt McDaid (Blizzard) dit que s'il ne devait garder qu'un seul principe, ce serait la lisibilité, obtenue par l'échelle et les proportions, la silhouette, la lumière, la couleur, l'exagération et la composition. Blizzard, sur *Arclight Rumble* (mobile, caméra du dessus), a « réussi la silhouette » et a limité le nombre de matières sur une même surface (« material breakup »).
2. **Regrouper le détail fin en détail large.** Toujours McDaid : peindre « 2 gros clous plutôt que 4 petits, 3 nœuds de bois marqués plutôt que plein de nœuds pâles ». C'est notre règle n°1 pour les textures.
3. **Un même mécanisme pour tout, piloté par le code.** La cohérence vient d'une foule de petites décisions identiques. Chez nous, ces décisions doivent vivre dans le générateur (constantes `LIGHT`, `STROKE`, `PALETTE`), pas dans chaque bâtiment.

---

## 1. Un langage de formes « mignon »

### 1.1 Proportions de bébé (Kindchenschema)
**Règle.** Le « schéma du bébé » de Lorenz (1943) : grosse tête, front haut, grands yeux, petit nez, membres courts et épais, corps rond. Pour un bâtiment, ça donne : **gros toit = tête**, **murs courts et trapus = corps**, **ouvertures surdimensionnées = yeux**.

**Chiffres pour un bâtiment chibi :**
- Toit = **45–55 %** de la hauteur visible (hors cheminée). En dessous de 40 %, on obtient un bâtiment « réaliste ».
- Débord du toit : **8–15 %** de la largeur du mur de chaque côté. Un toit qui déborde lit « champignon / chapeau », donc mignon.
- Hauteur du mur ≤ **0.7 ×** la demi-largeur de l'emprise (pour 1 tuile, mur ≤ 35 px à ×1.25).
- Porte = **40–50 %** de la hauteur du mur ; fenêtres rondes ou à angles très arrondis, **1–2 par face** au maximum.
- Ratio de masses **grande / moyenne / petite ≈ 60 / 30 / 10** (le toit, le corps, puis les détails). On évite les masses de même taille, qui donnent un résultat monotone.

### 1.2 Coins arrondis et faces « gonflées »
**Règle.** Aucun angle vif sur la silhouette extérieure, sauf effet voulu (pointe de toit, flamme). Les grandes arêtes droites se bombent légèrement vers l'extérieur, ce qui donne un aspect de jouet en vinyle, d'objet « squashy ».

**Chiffres :**
- Rayon de coin = **10–20 %** du plus petit côté adjacent, avec un minimum de **1.5 px** à l'échelle finale (sinon l'arrondi ne se voit pas après anticrénelage).
- Trois rayons seulement dans tout le jeu (par exemple 2 / 4 / 8 px), comme on le ferait avec des tokens de design.
- Bombé d'une arête longue (> 20 px) : point de contrôle quadratique décalé de **2–4 %** de la longueur de l'arête, vers l'extérieur.

```js
// Polygone arrondi : chaque sommet devient une courbe Q de rayon r
function roundedPoly(pts, r) {
  const n = pts.length; let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n];
    const v = (a, b, t) => { const dx = b[0]-a[0], dy = b[1]-a[1], L = Math.hypot(dx, dy);
      const k = Math.min(t, L / 2) / L; return [a[0] + dx*k, a[1] + dy*k]; };
    const a = v(p1, p0, r), b = v(p1, p2, r);
    d += (i ? 'L' : 'M') + f(a) + 'Q' + f(p1) + ' ' + f(b);
  }
  return d + 'Z';
}
const f = p => p.map(x => +x.toFixed(2)).join(',');
```

### 1.3 Silhouette lisible à petite taille
**Test automatisable.** On rend chaque asset en aplat noir à **25 % de sa taille**, soit environ une tuile de 25 px. On doit encore distinguer la boulangerie du moulin. Si deux bâtiments ont la même tache, on agit sur la *silhouette* (cheminée, enseigne en drapeau, toit asymétrique), pas sur le détail intérieur.
- Chaque bâtiment a **un seul élément signature** qui dépasse de la masse : la roue, la cheminée ou l'enseigne.
- Les vides négatifs (espace entre deux pilotis, arche) font au moins **3 px** à l'échelle finale, sinon ils se bouchent.

### 1.4 Tangentes et chevauchements
**Règle.** Une tangente, c'est deux contours qui se touchent tout juste ou deux arêtes alignées par accident. Elle aplatit la profondeur et donne une image qui « cloche sans qu'on sache pourquoi » (Ctrl+Paint, The Informed Illustrator). On choisit l'une des deux options : **chevaucher franchement** ou **séparer clairement**.
- Chevauchement minimal : **≥ 3 px** (ou ≥ 15 % de la plus petite forme).
- Écart minimal : **≥ 2 px**.
- Jamais un faîtage aligné pile sur le haut de la cheminée, jamais un bord de fenêtre qui touche l'arête du mur. On laisse au moins **3 px** de marge interne.
- Dans le générateur, on fait un `assert` simple : la distance entre des points clés (coins des ouvertures et arêtes) doit être `0` (ancrage voulu) ou `≥ 2`.

### 1.5 Hiérarchie des traits
**Règle (Proko, dessin technique).** Le contour extérieur est le trait le plus épais, les lignes intérieures sont fines, et les petits détails n'ont pas de trait du tout (simple changement de couleur). Les traits épais avancent, les traits fins reculent.

| Niveau | Épaisseur finale | Couleur |
|---|---|---|
| Silhouette extérieure | **1.2–1.5 px** | `#3C2819` (notre brun) |
| Arêtes intérieures structurelles (mur/toit) | **0.6–0.8 px** | teinte foncée *de la face* |
| Détails (planches, tuiles, joints) | **0.4–0.5 px** ou aucun | teinte foncée, opacité 0.5–0.7 |

Le ratio entre l'extérieur et l'intérieur est d'environ **2:1**. Aujourd'hui, notre trait unique de 0.7 px rend tout plat. **C'est probablement le changement le plus rentable.**

**La technique de la « passe de contour arrière »** donne une silhouette épaisse sans doubler les traits internes. On dessine la silhouette fusionnée *derrière* tout le reste, avec un trait de 2× l'épaisseur voulue : seule la moitié extérieure reste visible.

```xml
<!-- 1. passe contour : silhouette fusionnée, trait 2.6 => 1.3 visible -->
<path d="M…Z" fill="#3C2819" stroke="#3C2819" stroke-width="2.6" stroke-linejoin="round"/>
<!-- 2. faces (sans trait, ou trait intérieur coloré fin) -->
<path d="…" fill="#E9B27A"/>
<path d="…" fill="#C98A5A" stroke="#8A5536" stroke-width=".7" stroke-linejoin="round"/>
```
On utilise toujours `stroke-linejoin="round"` et `stroke-linecap="round"` : les angles vifs des jointures en mitre trahissent le vectoriel « non fini ».

### 1.6 Traits colorés (selective outline, « selout »)
**Règle (Lospec).** Le trait est **une version plus foncée de la couleur qu'il entoure**. Un contour doit toujours être plus foncé que l'objet *et* que le fond. Pour un trait interne entre deux couleurs, on prend la couleur de la partie la plus proche du spectateur, ou la plus sombre si l'une est dans l'ombre. On peut aussi casser le trait pour qu'il n'apparaisse que du côté de l'ombre.

**Recette de couleur du trait interne** (en HSL ou, mieux, en OKLCH) : luminosité **−35 à −45 %**, saturation **+10 à +20 %**, teinte décalée de **10–20°** vers le rouge-violet (vers 330–20° en HSL). On obtient un brun-prune vivant plutôt qu'un gris sale. Le brun global `#3C2819` reste réservé à la silhouette extérieure, pour unifier le jeu (style Hay Day / AC).

---

## 2. Couleur et lumière

### 2.1 Palette limitée par objet
- **3 teintes de matière** au maximum par bâtiment (par exemple bois, tuile, pierre), plus **1 accent** (porte, enseigne, fleurs).
- Chaque teinte a **3 valeurs** : ombre, moyenne et lumière, plus éventuellement un éclat. Ça fait au plus ~13 couleurs par asset.
- Rester globalement dans les **valeurs claires** : McDaid rappelle qu'un style léger et fantaisiste vit surtout dans les valeurs claires. Notre plage de travail : L entre 35 et 95 %, avec le brun du contour comme seul noir.

### 2.2 Ombrage des faces iso piloté par une lumière globale
**Règle.** Une seule direction de lumière dans tout le jeu, en haut à gauche, comme la plupart des jeux iso. Chaque face reçoit sa valeur selon son orientation, *calculée* par le générateur et non choisie à la main.

| Face | Luminosité relative | Teinte |
|---|---|---|
| Dessus (toit plat, sol) | 100 % | +5° vers le jaune |
| Face gauche (SO, éclairée) | **88–92 %** | neutre |
| Face droite (SE, ombre) | **68–75 %** | **−10 à −18°** vers le bleu-violet, saturation **+8 à +15 %** |
| Dessous / débord de toit | 55–60 % | même règle que l'ombre, renforcée |

### 2.3 Ombres froides, lumières chaudes (hue shifting)
**Règle (Construct « Hue Shifting », CG Cookie, pixel art).** Pour dériver une couleur d'une autre, on bouge la **teinte** en plus de la luminosité. Les ombres tirent vers le bleu, le violet ou le vert, les lumières vers le jaune ou l'orange. On ne fonce jamais avec du noir et on n'éclaircit jamais avec du blanc.

```js
// Décale la teinte vers une cible (250° = bleu-violet, 60° = jaune) — HSL suffisant ici
function shade(hex, { dl = 0, ds = 0, toward = null, amt = 0 }) {
  let [h, s, l] = hexToHsl(hex);
  if (toward !== null) { let d = ((toward - h + 540) % 360) - 180; h = (h + Math.sign(d) * Math.min(Math.abs(d), amt) + 360) % 360; }
  return hslToHex(h, clamp(s + ds, 0, 100), clamp(l + dl, 0, 100));
}
const ramp = base => ({
  hi:   shade(base, { dl: +10, ds: -5,  toward: 60,  amt: 8  }),
  mid:  base,
  sh:   shade(base, { dl: -18, ds: +10, toward: 250, amt: 14 }),
  line: shade(base, { dl: -40, ds: +15, toward: 340, amt: 15 }),
});
```
La nuit, on applique un multiplicateur global au rendu (canvas `globalCompositeOperation='multiply'` avec un aplat `#4B4C8C` à ~35 %) plutôt que de redessiner les assets.

### 2.4 Occlusion ambiante et ombre de contact
**Règle.** C'est ce qui « pose » un objet au sol. Elle a deux composantes :
1. **Ombre portée au sol** : un losange iso (ou une ellipse aplatie 2:1) sous l'emprise, **débordant de 6–10 %**, **décalée de +3 px en x et +1.5 px en y** (côté opposé à la lumière). Couleur prune foncée `#3C2819`, opacité **0.18–0.25**, avec un **noyau** plus dense (0.30–0.35) à 60 % de la taille, collé à la base.
2. **Bande d'AO en pied de mur** : un dégradé vertical sur les **10–15 % du bas** de chaque mur, qui fonce de **8–12 %**. Même chose sous les débords de toit : une bande d'ombre de **2–4 px** sous l'avant-toit, *c'est elle qui donne le volume du toit*.

Pas de `feGaussianBlur` : on utilise un `radialGradient`, qui ne coûte rien et se met en cache.
```xml
<radialGradient id="ao" cx=".5" cy=".5" r=".5">
  <stop offset="0"   stop-color="#3C2819" stop-opacity=".32"/>
  <stop offset=".6"  stop-color="#3C2819" stop-opacity=".2"/>
  <stop offset="1"   stop-color="#3C2819" stop-opacity="0"/>
</radialGradient>
<ellipse cx="3" cy="1.5" rx="56" ry="28" fill="url(#ao)"/>
```

### 2.5 Dégradés : subtils et à 2 arrêts
- **2 arrêts**, ΔL ≤ **8–12 %**, et toujours dans le sens de la lumière. Sur un mur, le haut est plus clair et le bas reçoit l'AO. Sur un toit, le faîtage est plus clair.
- Pas de dégradé à plus de 2 arrêts sur une face plane : au-delà, on retombe dans le « clip-art 2008 ».
- On mutualise les `<linearGradient>` par matière dans le `<defs>`, avec des identifiants préfixés par asset pour éviter les collisions d'`id` quand plusieurs SVG sont inlinés.

### 2.6 Liseré de lumière (rim) et éclats
- **Rim light** : un trait de **0.6–1 px**, couleur `hi` +10 % L, sur les arêtes **supérieures tournées vers la lumière** (faîtage, haut du mur gauche, bord de puits), avec `stroke-linecap="round"`. Il s'interrompt avant les coins (à **70–85 %** de la longueur de l'arête). Le trait « peint à la main » ne court jamais d'un bout à l'autre.
- **Éclats spéculaires** : **1 à 2 par objet**, pas plus.
  - Vitre : une bande diagonale blanche à 60–75 % d'opacité, plus un point de 1–1.5 px.
  - Métal ou cloche : une petite ellipse sur le côté lumière.
  - Eau : 2–3 tirets clairs qui s'animent (voir §4).
- La lumière des fenêtres la nuit : remplissage `#FFD27A` et halo en `radialGradient`, opacité 0.25 et rayon 2× la fenêtre. Le halo est un sprite séparé, mis en cache.

### 2.7 Textures : budget de densité
**Règle.** La texture *suggère*, elle ne décrit pas. On consolide le détail fin en détail large (McDaid), et Blizzard limite le « material breakup » pour la lecture mobile.
- **3–7 marques par face**, regroupées près des **coins et des arêtes** (jamais au centre). On garde **≥ 60 %** de chaque face en « zone de repos » vide.
- Longueur d'une marque = **15–30 %** de la largeur de la face. Opacité **0.25–0.45** de la couleur `sh` ou `line`, jamais le brun du contour.
- Une marque ne touche jamais le contour : marge ≥ **1.5 px**.
- Recettes :
  - **Bois** : 2–3 lignes de planche, chacune cassée en 2 segments, plus 1 nœud (petite ellipse) par grande face.
  - **Pierre** : 2–4 « éclats » en forme de L ou de V aux coins, plus 1–2 pierres dessinées en entier.
  - **Chaume** : rangées d'écailles (arcs) en bas de toit uniquement, 3–4 brins par écaille, plus 1 rangée plus claire près du faîtage.
  - **Tuiles** : on ne dessine qu'une ligne de rangées sur deux et on laisse le dégradé faire le reste.
- On utilise un **RNG à graine** (graine = id de l'asset). Résultat déterministe, diffs git propres, et les variantes s'obtiennent en changeant la graine.

```js
const rng = s => () => (s = (s * 1664525 + 1013904223) >>> 0) / 2**32; // LCG
```

---

## 3. L'assemblage parfait en isométrique

### 3.1 Ancre, emprise, grille
- **Ancre unique** : `(0,0)` = **centre du losange d'emprise au sol**, pour tous les sprites, y compris les parties animées (flammes, roues, voiles) qui partagent le même repère. On évite ainsi tout « offset magique » par asset.
- L'emprise suit la grille : sommets en `(±50·n, 0)` et `(0, ±25·n)` à ×1.25. Le pied des murs **pose exactement** sur ces sommets, avec un **retrait de 2–4 px** vers l'intérieur pour ne pas toucher le voisin (pas de tangente entre bâtiments adjacents).
- Tri de profondeur : clé `(gx + gy)` du **coin avant** de l'emprise, puis `z`. Pour les multi-tuiles, on trie par le coin le plus proche de la caméra.

### 3.2 Le kit « pas de lévitation »
Chaque objet posé reçoit, dans l'ordre de dessin :
1. l'ombre de contact (§2.4) ;
2. un **socle** (fondation en pierre ou plinthe) de **3–5 px** de haut, **1–2 px plus large** que les murs ;
3. les murs, avec la bande d'AO en pied ;
4. **1–3 touffes d'herbe ou cailloux qui chevauchent** le socle sur les coins *avant*. Un chevauchement casse la ligne sol/mur et ancre l'objet bien mieux qu'une ombre seule.

### 3.3 Ordre des couches dans un sprite
`ombre sol → passe contour → faces arrière → socle → murs → AO → ouvertures → toit → ombre sous avant-toit → détails/texture → rim light → éclats`. Les sprites animés (flamme, eau, roue) s'insèrent à un **index de couche déclaré** dans les métadonnées, pas « par-dessus tout ».

### 3.4 Échelle de trait constante
- Tous les assets sont écrits dans la **même unité**, en px finaux à ×1.25. Si un groupe est mis à l'échelle (`transform="scale()"`), le trait grossit avec lui : on ajoute `vector-effect="non-scaling-stroke"` ou, mieux, on multiplie les coordonnées dans le générateur.
- Au rendu cache, on rasterise à `zoom × DPR` en gardant l'épaisseur *visuelle* constante. Il faut une règle explicite : « le contour fait 1.3 px écran au zoom 1 ». Sinon, au dézoom, les traits deviennent du duvet et, au zoom, de grosses lignes de BD.

### 3.5 Coutures (hairlines) entre formes adjacentes
**Cause.** Chaque bord anticrénelé se mélange au fond, et deux bords partiellement couverts laissent passer un filet de fond. Le comportement dépend du navigateur, car la spécification SVG ne définit pas l'anticrénelage.

**Solutions, de la plus robuste à la plus simple :**
1. **Sous-couche (underpaint)** : on remplit la silhouette fusionnée (déjà dessinée par la passe contour du §1.5) *sous* les faces. Les fentes laissent voir du brun foncé, pas le ciel, et le filet devient invisible. C'est gratuit puisqu'on a déjà ce chemin.
2. **Débord (bleed)** : la face du dessous déborde de **0.5–1 px** sous sa voisine. On peut aussi ajouter `stroke` de même couleur que le `fill` à **0.5 px** sur les faces internes. Attention : il ne faut pas l'utiliser sur des formes semi-transparentes, à cause de la double opacité.
3. **Fusionner** les faces de même couleur en un seul `<path>` (ce qui fait aussi moins de nœuds).
4. Précision : arrondir à **2 décimales**, pas moins. Un arrondi trop agressif à l'export crée des fentes (cas documenté pour Illustrator).
5. `shape-rendering="crispEdges"` n'aide que sur des bords purement horizontaux ou verticaux. En iso c'est à proscrire, car toutes nos arêtes sont diagonales.

### 3.6 Pavage du sol sans fentes
- On rasterise le **sol entier par chunk** (par exemple 8×8 tuiles) dans un canvas hors écran, plutôt que de dessiner tuile par tuile.
- Si on dessine tuile par tuile, les losanges de sol sont **agrandis de 1 px** (le chevauchement est caché par la tuile suivante) et `drawImage` reçoit des **coordonnées entières** (MDN : les coordonnées fractionnaires forcent un rendu sous-pixel plus coûteux et flou).
- Dans un atlas, on garde **2 px de marge** entre sprites et on extrude les bords si on utilise le lissage.

---

## 4. Rendre vivant avec de l'animation bon marché

### 4.1 Boucles d'idle
| Effet | Amplitude | Période | Détails |
|---|---|---|---|
| Respiration (bâtiment, PNJ, buisson) | scaleY **+1.5 à 3 %**, scaleX **−0.75 à −1.5 %** (volume conservé) | **2.5–4 s** | origine = ancre au sol |
| Balancement d'arbre | rotation **±1.5–3°** | **3–5 s** | pivot au pied ; la couronne a un déphasage de **+0.2 période** (mouvement secondaire) |
| Flottement (bateau, bouée) | translateY **±1–2 px** et rotation **±1.5°** | **3–4 s** | rotation déphasée de **90°** par rapport à Y |
| Herbes et fleurs | skewX **±2–4°** | **1.5–3 s** | piloté par le vent (§4.5) |
| Fumée, feuilles, lucioles | particules | — | §4.4 |

Courbe : sinus pur (`0.5 - 0.5*cos`) pour les boucles. Il n'y a jamais de linéaire, sauf pour une rotation continue (roue, moulin).

### 4.2 Désynchroniser (le détail qui fait « pro »)
Cent arbres qui balancent ensemble, ça fait « gif ». Pour chaque instance :
- **phase** = `hash(gx, gy)` ∈ [0,1[, ou une séquence au nombre d'or `(i * 0.618034) % 1`, qui répartit mieux qu'un tirage aléatoire ;
- **période** × `(0.85 + 0.3 * hash2)`, soit ±15 % ;
- **amplitude** × `(0.8 + 0.4 * hash3)`.
Pour les animations image par image : **image de départ aléatoire** par instance.

### 4.3 Animations image par image
- **Feu** : 6–8 images à **10–12 i/s** (« sur les deux », le rythme nerveux de l'animation 2D). On ajoute une variation d'opacité du halo de **0.85–1** à ~8 Hz, aléatoire.
- **Eau, cascade** : 4–6 images à **6–8 i/s**. L'eau calme peut descendre à 4 i/s.
- **Drapeaux, voiles** : 4–6 images à **8–10 i/s**, avec une fréquence proportionnelle au vent.
- **Roues, ailes de moulin** : pas d'images, une **rotation continue** par transform (fluide à 60 i/s, gratuite). Les images restent pour la déformation de la toile.
- Tenir les images à un rythme fixe (12 i/s) même si le jeu tourne à 60 : l'interpolation entre images identiques crée des saccades (constat sur le forum Unity).

### 4.4 Particules ambiantes (pool global, budget fixe)
- **Fumée de cheminée** : 1 bouffée toutes les **0.5–0.9 s** (avec du hasard), montée de **25–40 px** en **2–3 s**, scale **0.5 → 1.6**, opacité **0.55 → 0**, dérive x = vent. Ce sont des cercles en cache (sprite unique teinté).
- **Lucioles (nuit)** : **10–25** à l'écran, trajectoire = somme de 2 sinus (périodes non multiples, par exemple 3.7 s et 5.3 s), pulsation alpha **1.5–3 s**, halo en sprite pré-rendu.
- **Feuilles** : 1 toutes les **3–8 s** par arbre visible, chute en 3–5 s avec oscillation latérale ±8 px.
- **Oiseaux** : un vol de 3–5 oiseaux traverse l'écran toutes les **30–90 s**, battement à 8 i/s sur 2–3 images.
- **Papillons** : 1–2 près des massifs de fleurs, pauses de 1–3 s.
- **Budget** : ~**60 particules** max sur mobile, ~150 sur desktop, réduit automatiquement si le temps de frame dépasse 20 ms.

### 4.5 Un système de vent unique
```js
// vent global : deux sinus de périodes premières entre elles => jamais répétitif
const wind = t => 0.6 + 0.25*Math.sin(t*2*Math.PI/7.3) + 0.15*Math.sin(t*2*Math.PI/13.1);
// propagation spatiale : la rafale traverse l'île d'ouest en est
const localWind = (t, x) => wind(t - x / 180); // 180 px/s
// chaque arbre : angle = amp * localWind(t, x) * sin(2π(t/period + phase))
```
Tout ce qui bouge avec le vent (arbres, herbes, fumée, drapeaux, voiles) lit `localWind`. Une rafale qui *traverse* la scène est le détail que les joueurs perçoivent comme « vivant ».

### 4.6 Juice : pose, achat, récolte
Références : *Juice it or lose it* (Jonasson & Purho, GDC Europe 2012) avec easing, squash & stretch et réactions à chaque événement, et *The Art of Screenshake* (Nijman, 2013) : « remplissez votre jeu d'amour et de minuscules détails ».

**Pose d'un bâtiment (durée totale 350–450 ms) :**
1. Anticipation : scale (1.05, 0.92) pendant **60 ms**.
2. Chute de **−12 px** → 0 en **120 ms**, `easeInQuad`.
3. Impact : squash (1.15, 0.85) pendant **70 ms**, puis retour élastique `easeOutBack` (overshoot `s = 1.70158`) en **180 ms**.
4. Au moment de l'impact : **nuage de poussière** de 6–8 bouffées en couronne iso (ellipse 2:1), 350–500 ms, scale 0.6 → 1.4, alpha 0.7 → 0. Ajouter **3–5 étincelles** (étoiles à 4 branches) avec un pop de 400–600 ms et un délai décalé de 40 ms chacune.
5. Les voisins dans un rayon d'une tuile font un micro-rebond (scaleY 0.97, 120 ms), une onde décalée de 30 ms par tuile.

**Achat et récolte :** l'objet saute (scale 1.2, 100 ms, retour 150 ms). Les icônes de ressource volent vers le compteur sur un **arc** (Bézier quadratique, 500–700 ms, `easeInCubic`), décalées de **50–80 ms**. À chaque arrivée, le compteur fait un bump (scale 1.15, 120 ms) et le nombre défile au lieu de sauter.

**Survol et sélection :** scale **1.04**, 120 ms `easeOutCubic`, et un liseré clair pulsant (opacité 0.5 ↔ 1, 1.2 s).

```js
const easeOutBack = (t, s = 1.70158) => 1 + (s + 1) * (t - 1) ** 3 + s * (t - 1) ** 2;
const squash = k => [1 + k, 1 / (1 + k)];        // conserve l'aire
```

### 4.7 Vie nocturne et ambiante
- Les fenêtres s'allument en cascade au crépuscule : délai = `hash(id) * 4 s`.
- Scintillement rare : toutes les 10–30 s, une fenêtre baisse à 80 % pendant 80 ms.
- PNJ et animaux : micro-pauses aléatoires de 1–4 s (ce qu'on ne fait *pas* compte autant que le mouvement).
- Respecter `prefers-reduced-motion` : on coupe le vent et les particules et on garde les retours de pose, raccourcis.

### 4.8 Ce qui est bon marché ou cher (web, mobile)
| Bon marché | Moyen (à faire une fois) | Cher (à proscrire au runtime) |
|---|---|---|
| `drawImage` de bitmaps en cache avec `setTransform` (translation, rotation, échelle) et `globalAlpha` | Rasteriser un SVG vers bitmap (au chargement, ou par palier de zoom) | `feGaussianBlur`, `feTurbulence`, `filter: drop-shadow()` animé |
| CSS `transform` / `opacity` sur des éléments DOM peu nombreux (UI) | Dégradés et `radialGradient` (gratuits une fois en cache) | Morphing de chemins (`d` animé), SMIL `<animate>` à grande échelle |
| Changer d'image dans une feuille de sprites | Recolorer en `multiply` une couche entière (nuit) | `ctx.shadowBlur` (MDN : « à éviter autant que possible ») |
| | | Des milliers de nœuds DOM/SVG animés, `will-change` partout |

Le web le constate : les navigateurs composent `transform` et `opacity` sur le GPU sans repeindre. Les filtres SVG sont lents, surtout sur iOS (fils GreenSock). MDN recommande le pré-rendu hors écran, des coordonnées entières, des canvas en couches (fond statique, monde, UI) et de ne pas mettre à l'échelle dans `drawImage`.

**Règles mobiles pour Brumelune :**
- Cache par **palier de zoom** (par exemple 0.5 / 1 / 2) × `min(devicePixelRatio, 2)`, en `ImageBitmap` ou en canvas hors écran, plutôt que de re-rasteriser à chaque zoom continu.
- Le flou, si on en veut (halo, ombre douce), est **cuit dans le bitmap** à la génération.
- **Culling** : pas de mise à jour ni de dessin hors écran, ce qui inclut les horloges d'animation des bâtiments invisibles.
- Ambiance (vent, particules) à **30 i/s** si l'appareil peine, mais pose et UI toujours à 60.
- Le sol statique va dans une couche à part, redessinée seulement au déplacement de la caméra ou à une modification du terrain.

---

## 5. Ce qu'on applique à Brumelune en priorité

Classées par rapport impact/effort pour une bibliothèque existante de bâtiments et décors iso codés à la main :

1. **Hiérarchie des traits avec une passe de contour arrière.** Silhouette fusionnée dessinée derrière, trait 2.6 px (≈ 1.3 px visible) en `#3C2819`. Les traits internes descendent à 0.6–0.7 px. Joins et caps `round` partout.
2. **Traits internes colorés.** On remplace le brun unique des lignes intérieures par `ramp(fill).line` (L −40 %, S +15 %, teinte vers la prune). Le brun reste réservé à la silhouette.
3. **Ombrage automatique des faces avec décalage de teinte.** Une fonction `ramp()` dans le générateur : face gauche à 90 %, face droite à 70 % et décalée de −14° vers le bleu-violet, dessus à 100 % et +5° vers le jaune. On ne choisit plus aucune couleur d'ombre à la main.
4. **Ombre de contact, AO en pied de mur et ombre sous avant-toit** sur chaque asset posé (`radialGradient` décalé de +3/+1.5 px, opacité 0.2–0.32). C'est le meilleur remède à l'effet « collé sur la carte ».
5. **Kit d'ancrage.** Socle de 3–5 px un peu plus large que les murs, et 1–3 touffes ou cailloux qui chevauchent les coins avant. On vérifie que l'ancre `(0,0)` est au centre de l'emprise pour *tous* les sprites, parties animées comprises.
6. **Arrondis et faces bombées.** `roundedPoly()` sur les silhouettes (r = 10–20 % du petit côté, ≥ 1.5 px, 3 rayons standard), bombé de 2–4 % sur les arêtes longues. On relève la part du toit à 45–55 % de la hauteur, avec un débord de 8–15 %.
7. **Fin des coutures.** La sous-couche (underpaint) avec la silhouette de la passe contour, plus un débord de 0.5 px sur les faces adjacentes et 2 décimales de précision. Le sol est rasterisé par chunks, et `drawImage` reçoit des coordonnées entières.
8. **Budget de texture à graine.** 3–7 marques par face près des arêtes, ≥ 60 % de zone de repos, opacité 0.25–0.45, RNG déterministe par asset. Rim light de 0.6–1 px sur les arêtes hautes côté lumière, 1–2 éclats par objet au plus.
9. **Vent global et désynchronisation.** `localWind(t, x)` partagé par arbres, herbes, fumée et voiles, plus phase, période et amplitude hachées par instance et image de départ aléatoire pour les animations image par image. Les animations image par image passent à 10–12 i/s.
10. **Juice de pose et d'achat, avec des règles de performance strictes.** Anticipation → chute → squash (1.15/0.85) → `easeOutBack`, poussière en couronne iso et 3–5 étincelles, icônes en arc vers le compteur. En parallèle : aucun filtre SVG ni `shadowBlur` au runtime, cache par palier de zoom × DPR ≤ 2, culling et budget de particules (~60 sur mobile).

---

## Sources

- Martin Jonasson & Petri Purho, *Juice it or lose it*, GDC Europe 2012 : https://www.youtube.com/watch?v=Fy0aCDmgnxg (résumés : https://roblog.co.uk/2024/03/juicy-games/ , https://rpgplayground.com/research-making-a-juicy-game/)
- Jan Willem Nijman (Vlambeer), *The Art of Screenshake*, INDIGO 2013 : https://www.youtube.com/watch?v=AJdEqssNZ-U (notes : https://infovore.org/tag/feel/)
- Game Maker's Toolkit, *Secrets of Game Feel and Juice* : https://www.youtube.com/watch?v=216_5nu4aVQ
- Matt McDaid (Blizzard), règles de stylisation et de lisibilité, 80.lv : https://80.lv/articles/matt-mcdaid-mastering-the-stylized-art/
- Blizzard, *Arclight Rumble*, lisibilité mobile, PocketGamer.biz : https://www.pocketgamer.biz/translating-the-warcraft-aesthetic-to-mobile-arclight-rumble/
- Supercell, rétrospective sur la direction artistique de Hay Day : https://www.pocketgamer.biz/supercell-looking-back-10-years-of-hay-day-part-one/
- Supercell Helsinki, contenu stylisé (Clash) : https://www.adobe.com/products/substance3d/magazine/supercell-helsinki-creating-stylized-content-for-clash-of-clans-and-clash-royale.html
- Ken Wong / ustwo, art de Monument Valley (GDC 2015) : https://www.gamedeveloper.com/art/get-art-tips-from-ustwo-naughty-dog-and-the-remakers-of-i-halo-i-at-gdc ; « letting go » : https://www.killscreen.com/monument-valley-elegance/ ; MV2 (GDC 2018) : https://www.gdconf.com/news/speaker-qa-art-director-ustwo-games-david-fernandez-huerta-discusses-vision-monument-valley-2
- Animal Crossing, design et plaisir : https://uxdesign.cc/animal-crossing-delight-by-design-e2c0a1a4d462 ; contenu de pré-sortie / CEDEC 2020 : https://nookipedia.com/wiki/Prerelease_and_unused_content_in_New_Horizons
- GDC, *Art Directing VFX for Stylized Games* : https://gdcvault.com/play/1023999/Art-Directing-VFX-for-Stylized
- Kindchenschema (Lorenz), revue : https://pmc.ncbi.nlm.nih.gov/articles/PMC3260535/ ; https://www.frontiersin.org/articles/10.3389/fpsyg.2015.00970/full
- Lospec, *Pixel Art Outlines Part 2: Using Color* (selective outlining) : https://lospec.com/articles/pixel-art-outlines-part-2-using-color ; tutoriel selout : https://itch.io/t/2422252/pixel-tutorial-selective-outlines
- Hue shifting : https://www.construct.net/en/tutorials/game-art-hue-shifting-965 ; https://cgcookie.com/lessons/exercise-41-color-shifting
- Hiérarchie des traits, Proko : https://proko.com/course-lesson/how-to-draw-with-line-weight/notes ; https://proko.com/course-lesson/demo-hierarchy-of-importance-line-weight/notes
- Tangentes : https://ctrlpaint.com/videos/avoiding-visual-tangents ; https://www.theinformedillustrator.com/2013/10/off-on-tangent.html
- Coutures SVG et anticrénelage : https://lists.w3.org/Archives/Public/www-svg/2015May/0033.html ; https://community.adobe.com/t5/illustrator-discussions/apply-pathfinder-s-boolean-operations-to-multiple-objects-from-a-mask/m-p/10615711 ; https://junkangworld.com/blog/mastering-svg-seams-5-pro-fixes-for-flawless-shapes-2025
- MDN, *Optimizing canvas* : https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas
- Propriétés composées seulement (transform/opacity) : https://web.dev/articles/stick-to-compositor-only-properties-and-manage-layer-count ; B. Birtles, *Animations on Fire* : https://birtles.blog/pres/graphical-web-2014/pdf/Animations%20on%20Fire.pdf
- Coût des filtres SVG sur mobile (GreenSock) : https://greensock.com/forums/topic/33075-gsap-and-feturbulence-mobile-performance/
- Animation « sur les deux », 12 contre 24 i/s : https://blenderartists.org/t/rendering-12fps-for-anime-style/1469615 ; https://forum.unity.com/threads/3d-animation-on-twos-in-unity.707120/
- Principes de motion UI (UX in Motion, Willenskomer) : https://blog.adobe.com/en/publish/2016/11/08/redesigning-the-12-principles-of-animation-for-motion-design ; https://uxdesign.cc/a-guide-to-motion-design-principles-7f05f10ccd79
- Fonctions d'easing (easeOutBack, etc.) : https://easings.net/
- Illustration iso vectorielle (lumière, ombres, grille) : https://learn.corel.com/tutorials/how-to-create-an-isometric-illustration-in-corel-vector/
