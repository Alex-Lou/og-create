# BRUMELUNE — Référence technique des règles de jeu

Vérifié contre le code : backend 9cc7bfe, front b47a53f2 (2026-10-09)

- Ce document donne **les chiffres, les formules et l'endroit où ils sont codés**. Le récit, les personnages et les
  intentions sont dans `HISTOIRE.md` (bible) : on n'en recopie rien ici. Voir aussi `design/conception/minijeux_grille.md`,
  `ETAT_DES_LIEUX.md`, `PASSATION.md`.
- **Le serveur fait autorité.** Le front ne fait que montrer ou prédire.
- Abréviations des chemins :
  - `B:` = `Og-create-backend/src/`
  - `F:` = `frontend/src/`
  - `seed` = `Og-create-backend/db/seed.sql`
- « (hypothèse) » : une déduction ou une estimation, sans exécution réelle.
- Tous les montants en écus passent par `coin_ledger`. Un gain est unique par `(user_id, reason, ref)`
  (`B:services/ledger.js:8-20`). Un débit refuse un solde négatif (`ledger.js:24-33`). La contrainte
  `chk_progress_coins >= 0` est dans `db/schema.sql:536-537`.

---

## 1. Vue d'ensemble des boucles

### 1.1 Les trois boucles

| Boucle | Ce qu'on y fait | Ce qu'on en tire | Code |
|---|---|---|---|
| **Grimoire** (mode Infini) | Mêler 2 à 4 éléments en main. Pages et chapitres, Encre, pendu. | Éléments : plans des bâtiments, objectifs des quêtes, savoir-faire des créations. **Aucun écu.** | `B:routes/play/index.js:48-73`, `B:services/bookPages.js`, `B:routes/play/book.js` |
| **Épreuve** (mode Timer) | Questions chronométrées (300/240/180 s), jokers, records. | Écus : points par question (une fois) et bonus de record. | `B:services/trial.js`, `B:routes/play/trial.js` |
| **Île** (le Monde, compte obligatoire) | Récolte et mini-jeux, bâtiments, quartiers, annexes, créations, chemins, habitants, visiteurs, bêtes, nuits, expéditions, coffres, quêtes de Brume. | Ressources, écus, objets. | `B:services/world.js` et `B:services/world/*` |

- L'île exige un compte : `withAccount` répond 402 `ACCOUNT` à un invité (`B:routes/play/shared.js:46-49`).

### 1.2 Flux des ressources et des écus

```
 GRIMOIRE ──éléments──▶ plans des paliers · quêtes · savoir-faire des créations
    ▲  ▲                                      │
    │  └── Encre 50 · pendu 20 (écus) ◀───────┤
    │                                         ▼
 ÉPREUVE ──écus (points, record)──▶ [ ÉCUS ] ◀── quêtes · étoiles · coffres · cœurs · visiteurs
                                      │  ▲
   quartiers · paliers III+ ◀─────────┤  └── production des bâtiments (écus/h)
   annexes · boutique · enseignes     │  └── Récolte (1 écu / 10 ress.) · mini-jeux (plafonnés)
   cabinet (cadres, avatars)          ▼
 RÉCOLTE / plage / coffres / bêtes ─▶ [ RESSOURCES pierre·bois·eau·vivres ] ─▶ paliers · annexes
 production des bâtiments ─────────▶                                       ─▶ créations · chemins
                                                                           ─▶ besoins · cadeaux
                                                                           ─▶ expéditions · réparations
 gisements de climat ─▶ [ TROUVAILLES ] ─▶ annexes et créations de climat
```

---

## 2. Économie

### 2.1 Sources d'écus

| Source (`reason` du grand livre) | Montant | Unicité, plafond | Code |
|---|---|---|---|
| Quête de Brume (`quete`) | 10 à 500 par quête ; **5 155** pour les 60 quêtes | Une fois par quête | `B:services/quests.js:27-161`, `B:services/world.js:541` |
| Récolte (`recolte`) | `floor(ressources gagnées / 10)` | **Aucun plafond** par partie | `B:services/world.js:659-660`, `B:services/world/rules.js:35` |
| Mini-jeu (`jeu:<id>`) | `min(round(brut × mult), round(60 × mult))` | Plafond 60 × mult (60 à 108) | `B:services/minigames.js:10,266-267` |
| Étoile de niveau (`etoile`) | 5 / 5 / 10 (1re, 2e, 3e étoile) | Une fois. Mini-jeux : dans `plafond − gain` ; Récolte : sans plafond (`room = Infinity`) | `B:services/levels.js:13`, `B:services/world/stars.js:25-46`, `B:services/world.js:662,737` |
| Production (`monde`) | 2 écus/h par niveau, plus les annexes et la boutique | Réserve plafonnée à 8 h (+ réserves) | `B:services/world/rules.js:10,48,210-239` |
| Coffre (`butin`) | Commun 15–30 ; rare 50–90 ; épique 200–300 ; légendaire 600 | Un par source | `B:services/loot.js:20-21,76-93` |
| Cœur d'amitié (`ami`) | Cœur 1 : 40 ; cœur 3 : 120 (cœurs 2, 4, 5 : coffres) | Une fois par habitant et par cœur | `B:services/villagers.js:25-31`, `B:services/world/people.js:204-218` |
| Visiteur comblé (`visiteur`) | `30 + 15 × palier du Ponton` (45 à 135) | Une fois par visiteur | `B:services/visitors.js:25`, `people.js:345` |
| Question de l'Épreuve (`timer-question`) | 10 / 20-25 / 30-35 (Facile/Moyen/Difficile) ; **1 955** pour les 96 | Une fois par question | `seed:31-221`, `B:services/trial.js:92` |
| Record de l'Épreuve (`timer-record`) | `score × 5`, versé **en entier** à chaque nouveau record | ref `niveau:score` | `B:services/trial.js:11,102-108` |
| Annulation d'un achat (`boutique-annulee`) | Prix remboursé | Dans les 6 s | `B:services/world.js:801-818`, `rules.js:37` |
| Héritage (`remboursement`, `monde/carte-v2`) | Anciennes décorations, anciennes cartes | Une fois | `B:services/world.js:745-759`, `B:services/world/migrate.js:48` |

- Un compte commence avec 0 écu (`db/schema.sql:120`). Une Encre offerte s'inscrit comme gain de 0
  (`B:routes/play/book.js:41`).

### 2.2 Dépenses en écus

| Dépense (`reason`) | Prix | Code |
|---|---|---|
| Quartier (`quartier:<id>`) | 100 à 5 000 (§ 3.3) ; La Source gratuite au tutoriel | `B:services/worldMap.js:21-46`, `B:services/world.js:547-567` |
| Palier de bâtiment (`chantier:<site>:<n>`) | Paliers I-II : 0 ; III : 150 ; IV : 300 ; V : 600 ; VI : 1 000 ; VII : 1 800 (**3 850 par bâtiment**, 26 950 pour les 7) | `B:services/world/rules.js:52-137`, `world.js:592-595` |
| Annexe (`annexe:<id>:<n>`) | Petite : 100/250/600/1 200/2 000/3 000 ; réserve 400 ; grande 1 200 ; climat 500 ; maisons 80/200/400/800 | `B:services/annexes.js:14-19,69-74` |
| Boutique (`boutique:<id>`) | Outils et objets 80 à 2 400 ; skins 60 à 80 ; teintes 60 à 900 ; pièces rares : pas en vente | `B:services/worldShop.js:14-139`, `world.js:763-785` |
| Style d'enseigne (`enseigne`) | 0 / 150 / 300 / 300 / 450 / 600 (palier V) | `B:services/signs.js:8-16` |
| Encre (`encre`, réf. = la page) | 50, une fois par page ; offerte après 3 (chap. I-IV) ou 5 (V-VII) essais ratés différents, ou au tutoriel | `B:routes/play/shared.js:13,59-64`, `bookPages.js:23-31`, `book.js:38-41` |
| Joker de l'Épreuve (`joker`) | 50 après 2 jokers offerts à chaque lancement | `B:routes/play/shared.js:52-56`, `trial.js:9` |
| Pendu rejoué (`pendu`) | 20, ou gratuit après 24 h | `B:services/bookLetters.js:7,48-50`, `B:services/hangman.js:6` |
| Cabinet (`cabinet:<id>`) | Cadres 100 à 450 ; avatars 150 à 500 ; 4 pièces se gagnent par succès | `seed:329-361`, `B:services/customization.js:41-58` |

### 2.3 Ressources (pierre, bois, eau, vivres)

| Source | Quantité | Code |
|---|---|---|
| Récolte | Chaîne de L tuiles : `L + (L ≥ 5 ? floor(L/2) : 0)` × poids (poisson : 3 vivres) × multiplicateur du bâtiment (×1 à ×6) | `B:services/harvest.js:9,84-88`, `rules.js:45` |
| Production | 3/h par niveau ; annexes +3, +5 ou +8/h ; boutique jusqu'à +100 %, puis humeur ±10 % et lieux +10 % | `rules.js:47,210-239`, `annexes.js:23-27`, `worldShop.js:9` |
| Plage (6 trouvailles) | 2 bois, 2 vivres ou 2 pierres par toucher ; repousse en 3 h | `B:services/pickups.js:7-20`, `B:services/world/lands.js:112-134` |
| Coffres | Commun : 15–30 d'une ressource ; rare : 25–40 de deux ressources | `loot.js:85-92` |
| Bêtes de ferme | Poules 4/j (Madame 0), vache 8, moutons 4, cochon 6, chèvre 6 (vivres) | `B:services/beasts.js:13-22` |

| Dépense | Coût | Code |
|---|---|---|
| Paliers (7 × 7) | § 3.2 ; total par bâtiment ≈ 1 600 à 2 000 ressources | `rules.js:52-137` |
| Chemin | **1 pierre par case** ; **12 offertes** ; **80 cases au plus** par tracé (et 80 effacées) ; une case payée effacée rend sa pierre, une case offerte effacée redevient offerte | `B:services/world/paths.js:16,18,125-163` |
| Expédition | `trip × { vivres 10, bois 5 }` et une partie de Récolte | `rules.js:29`, `lands.js:19,46-56` |
| Créations d'île | 6 à 60 par création (et des trouvailles pour celles de climat) | `B:services/crafts.js:34-66` |
| Besoins | Manger : 10 vivres (24 h) ; Outils : 5 pierres + 5 bois (48 h) | `B:services/villagers.js:54-58` |
| Cadeau | 15 d'une ressource, un par jour et par habitant | `villagers.js:20`, `people.js:245-251` |
| Bête nourrie | 2 vivres | `beasts.js:10` |
| Réparation après une nuit | `3 + 2 × (palier − 1)` en pierre (Carrière, Puits, Atelier, Foyer) ou en bois (les autres) | `B:services/nights.js:178-179` |
| Livraison à un visiteur | 20 à 110 selon le palier du Ponton | `visitors.js:23` |

- **Encaissement automatique :** avant toute dépense, la production en attente est encaissée et compte pour
  payer (`B:services/world/produce.js:45-67`). Les fractions sont gardées dans `world_stock.carry`
  (`rules.js:288-302`).

### 2.4 Coffres

| Coffre | Rareté | Code |
|---|---|---|
| Fin de Récolte | Au moins 5 coups : 1 chance sur 3. Une chaîne de 8 ou plus : sûr, rare au minimum. Poids 60/28/10/2 | `loot.js:10,39-45` |
| Coffre du jour | Série : jours 1-2 commun, 3-6 rare, 7 épique, tous les 28 jours légendaire ; un jour manqué remet à 1 | `loot.js:49-53`, `B:services/world/chests.js:25` |
| Bouteille | Une par tranche de 6 h (heure de Paris), poids 75/22/3 | `loot.js:12,96-100` |
| Chapitre ouvert | Légendaire, avec la pièce rare de ce chapitre (II à VII) | `loot.js:15-18`, `worldShop.js:30-45` |
| Quête | 3 rares, 2 épiques, 3 légendaires, plus les anciennes quêtes | `quests.js:53-160,179-182` |
| Lieu remarquable | Rare ou légendaire | `B:services/landmarks.js:12-63` |
| Cœurs 2, 4, 5 | Rare, épique, légendaire | `villagers.js:25-31` |

- Lot épique : 70 % une teinte encore manquante, sinon des écus. Lot légendaire : une pièce rare manquante, sinon
  600 écus (`loot.js:76-84`).

---

## 3. Progression

### 3.1 Grimoire

- **827 éléments**, dont 4 de base ; **823 à découvrir** (`Og-create-backend/db/content/elements.py`, compté).
- Les chapitres s'ouvrent au nombre de **découvertes** (sans les 4 de base) : `bookPages.js:11-19,283-286`.

| Chap. | Ouvre à | Éléments | Leurres | Pages ouvertes | 1re lettre | Encre offerte après | Erreurs au pendu |
|---|---|---|---|---|---|---|---|
| I | 0 | 61 | 2 | 3 | oui | 3 | 3 |
| II | 3 (vétéran : 0) | 134 | 3 | 3 | oui | 3 | 3 |
| III | 5 | 75 | 4 | 3 | oui | 3 | 3 |
| IV | 12 | 162 | 6 | 3 | oui | 3 | 3 |
| V | 25 | 265 | 8 | 3 | non | 5 | 2 |
| VI | 45 | 85 | 10 | 3 | non | 5 | 2 |
| VII | 70 | 45 | 12 | 3 | non | 5 | 2 |

- Difficulté : `bookPages.js:23-31`. Pendu : `hangman.js:9`. Exception vétéran : `bookPages.js:34`.
- Pendu : une lettre absente coûte une seule fois ; une lettre présente ailleurs ne coûte rien. Une partie perdue
  bloque 24 h (ou 20 écus). Les lettres posées restent (`bookLetters.js:17-41`).
- Mélange : 2 à 4 ingrédients, tous en main. Seul le serveur ajoute le résultat (`B:routes/play/index.js:51-66`).

### 3.2 Bâtiments : 7 chantiers × 7 paliers

- Le palier N demande : le chapitre N ouvert, le **plan** (un élément) découvert, les ressources, et des écus dès le
  palier III (`B:services/world.js:572-602`).
- L'emprise passe de 2 × 2 à **3 × 3 au palier IV** (`B:services/worldMap.js:73-79`).
- On peut renommer un bâtiment dès le palier III (`rules.js:13`) ; l'enseigne vient au palier V (`signs.js:8`).

| Chantier | Produit | Effet par palier n | Coût du palier VII (exemple) |
|---|---|---|---|
| Foyer | — | `2 + n` parties en réserve | 300 pierre, 240 bois, 140 eau, 120 vivres, 1 800 écus |
| Atelier | — | `[0,3,5,6,7,8,9,10][n]` coups en plus | 330/250/120/100, 1 800 |
| Carrière | pierre | `3n`/h, `2n` écus/h, Récolte ×`[1,2,3,4,4,5,5,6][n]` | bois 300, pierre 250, eau 130, vivres 120 |
| Bosquet | bois | idem | — |
| Puits | eau | idem | — |
| Potager | vivres | idem | — |
| Ponton | vivres | `3n`/h, `2n` écus/h ; tuiles poisson ; +2 coups dès le palier II (pas de multiplicateur) | — |

- Tous les coûts : `B:services/world/rules.js:52-137`. Effets : `rules.js:141-150,180-193`.
- Palier I : 2 à 25 ressources (Feu de camp : 4 bois, 2 pierres, plan « Brasier »).

### 3.3 Quartiers (24)

- Brumelune (`coeur`) est offert. 11 quartiers du cœur s'achètent : **13 400 écus** au total. 12 terres lointaines
  demandent d'abord une expédition : **19 800 écus** au total (`worldMap.js:21-46`).
- Les expéditions ne partent que si les 7 quartiers de `map.CORE` sont à soi (coeur, source, lisière, colline,
  jardins, est, hauteurs), et seulement vers un quartier voisin (`worldMap.js:50`, `lands.js:28,43-45`).

| Quartier | Prix | Chap. | | Terre lointaine | Prix | Chap. | Voyage |
|---|---|---|---|---|---|---|---|
| La Source | 100 | I | | Menhirs | 350 | II | 2 h |
| La Lisière | 150 | I | | Roselières | 400 | II | 2 h |
| La Colline | 250 | II | | Falaises | 500 | II | 3 h |
| Les Jardins | 400 | III | | Bayou | 550 | II | 3 h |
| Le Faubourg | 600 | III | | Contreforts | 1 000 | IV | 3 h |
| Les Hauteurs | 700 | III | | Oasis | 1 100 | IV | 4 h |
| La Crique | 900 | IV | | Neiges | 1 500 | IV | 5 h |
| La Grande Forêt | 1 200 | IV | | Dunes d'Or | 1 600 | IV | 5 h |
| Le Hameau | 1 800 | V | | Canopée | 2 000 | V | 6 h |
| Îlot aux Mouettes | 2 800 | VI | | Cascade | 2 600 | V | 7 h |
| Île des Légendes | 4 500 | VII | | Coulées noires | 3 200 | VI | 8 h |
| | | | | Cratère | 5 000 | VI | 9 h |

### 3.4 Jeux à grille : niveaux et étoiles

Code : `B:services/levels.js`, copié dans `F:game/levels.js` (voir § 7).

- **3 jeux** : Récolte, Filon, Cueillette. La Pêche n'a pas de niveaux (`levels.js:16`, `world.js:701-702`).
- **30 niveaux**, en 3 saisons de 10 (`levels.js:8-10`).
- Objectif qui monte en ligne droite, `ramp(n, a, b) = a + round((n−1)(b−a)/29)` (`levels.js:19-24`) :

| Jeu | Niveau 1 | Niveau 10 | Niveau 20 | Niveau 30 | Unité |
|---|---|---|---|---|---|
| Récolte | 30 | 49 | 69 | 90 | ressources |
| Filon | 2 | 4 | 5 | 7 | pierres précieuses |
| Cueillette | 6 | 12 | 18 | 24 | cueillettes |

- **Étoiles** : 0 si l'objectif n'est pas atteint. Sinon `marge = (limite − instant) / limite`, et
  `1 + [marge ≥ 0,25] + [marge ≥ 0,5]` étoiles (`levels.js:15,34-38`).
- La limite est la partie elle-même : coups de la Récolte, 26 coups du Filon, ms de la Cueillette. Elle est réduite
  pour les premières parties courtes (`world.js:662,737`).
- **Déblocage** : une étoile ouvre le niveau suivant. **20 étoiles** dans une saison ouvrent la suivante
  (`levels.js:11,58-66`). Un niveau non ouvert est refusé en 403 (`world.js:606-611`).
- Étoiles gardées dans `world_items` (`etoile:<jeu>:<n>:<rang>`). « Recommencer l'île » les efface, et leur bonus se
  regagne une fois (réf. `:bis`) (`B:services/world/stars.js:9,34-41`).

### 3.5 Succès

- 50 succès (`seed:227-325`). Une condition est une chaîne parsée, jamais exécutée : `includes('X')` ou
  `length >= N`, combinées par `&&` / `||` ; toute autre clause est fausse (`B:utils/achievementCondition.js:6-23`).
- Le serveur évalue sur `progress.infinite_elements` à chaque nouvelle découverte, sous verrou
  (`B:services/achievementService.js:38-59`, `B:routes/play/shared.js:73`). Le client ne donne que la date
  affichée.
- `length` compte les **4 éléments de base** (valeur par défaut de la colonne : `db/schema.sql:117`). Ainsi
  « Découvre 15 éléments » = 11 découvertes, « Eurêka » (≥ 5) = 1 découverte, « Dieu Omniscient » (≥ 827) = tout.

### 3.6 Créations d'île : paliers

| Palier | S'ouvre quand | Code |
|---|---|---|
| start | D'emblée | `B:services/crafts.js:166-172` |
| I | 10 découvertes, **ou** chapitre I fini, **ou** 10 questions de l'Épreuve réussies | `crafts.js:20-21` |
| II, III | Chapitre II ou III entièrement trouvé | |
| climat | D'emblée (coûte des trouvailles, se pose dans son climat) | |

---

## 4. Mini-jeux

| Jeu | Lieu, ouverture | Règle | Valeurs | Limite (courte) |
|---|---|---|---|---|
| **Récolte** | Toujours, une partie de la réserve | Relier ≥ 3 tuiles identiques voisines (diagonales comprises) sur 6 × 6 ; les colonnes tombent ; plateau rebattu s'il est bloqué | § 2.3 | 15 coups + bonus (**8** pour les 2 premières) |
| **Pêche** | Ponton palier III | 3 couloirs ; toucher quand un poisson passe sous l'hameçon (portée 0,08) ; 700 ms entre deux lancers ; 150 lancers au plus | gardon 2, truite 4, doré 10, botte 0 | 45 s (**25 s**) |
| **Filon** | Carrière palier III | Paroi 6 × 7, blocs de 1 à 3 coups ; filon de 10 pierres + 2 isolées ; on creuse depuis le haut ou à côté d'un bloc ouvert | quartz 3, améthyste 5, rubis 8, diamant 16 | 26 coups (**12**) |
| **Cueillette** | Bosquet palier III | 16 buissons ; une baie mûre un instant ; un geste raté étourdit 350 ms, des guêpes 1 500 ms ; 220 gestes au plus | mûre 1, fraise 2, myrtille 2, cèpe 6, guêpes 0 | 40 s (**20 s**) |
| **Arrimage** | — | **Absent du code** (spécification seule : `minijeux_grille.md` § 6 ; `ETAT_DES_LIEUX.md` P4) | — | — |

- Code de la Récolte : `B:services/harvest.js` ; ses limites : `rules.js:17,21-23`, `world.js:627-631`.
- Code des mini-jeux : `B:services/minigames.js:42-48,108-114,187-194,253-255`.
- Réserve des mini-jeux : **3 parties, une de plus toutes les 2 h**, par jeu (`minigames.js:7-9`).
- Multiplicateur : `1 + 0,2 × (palier − 3)` ; le plafond par partie le suit : III 60, IV 72, V 84, VI 96, VII 108
  (`minigames.js:266-267`).
- Partie courte : il y a moins de 2 parties de ce jeu avant celle-ci (`world.js:682-686`). Pour la première
  Récolte : pas de tuile d'eau (`rules.js:23`, `world.js:629`).

### 4.1 Déterminisme et validation par le serveur

- **Graine** : `crypto.randomInt(1, 2^31−1)`, tirée par le serveur au départ et envoyée au client
  (`world.js:626,706`). Générateur mulberry32, le même des deux côtés (`harvest.js:12-21`, `minigames.js:19-28`).
- **Rejeu** : à la fin, le client envoie ses gestes. Le serveur les rejoue et calcule seul le gain
  (`world.js:642-669,718-740`). Une partie ne se rend qu'une fois, même refusée (`FOR UPDATE` + `finished_at`).
- **Garde-fous :**

| Contrôle | Récolte | Mini-jeux |
|---|---|---|
| Durée de vie | 24 h (`rules.js:12`) | 15 min (`rules.js:14`) |
| Gestes valides | Chaîne contiguë, même tuile, ≥ 3, pas plus que `maxMoves` | Bornes, ordre croissant, nombre maximal (`minigames.js:84-104,162-184,221-247`) |
| Horloge | Aucune | Dernier geste ≤ temps écoulé + 3 s (`world.js:732`, `rules.js:15`) ; le Filon renvoie `last: 0`, donc non contrôlé |
| Configuration | Figée dans `world_runs.config` au départ (`world.js:634-636`) | Niveau et palier dans `world_game_runs.level = niveau × 10 + palier` (`world.js:680,708-709`) |

- Limite de fréquence : 120 requêtes/min par joueur, 600/min par adresse (`B:routes/play/shared.js:24-26`).

---

## 5. Quêtes et tutoriel

### 5.1 La chaîne de Brume

- Une seule chaîne de **60 quêtes**, une active à la fois. L'avancée se lit dans l'état du jeu : seule la
  réclamation s'écrit (`world_quests`) (`B:services/quests.js:1-20,205-266`).

| Acte | Quêtes | Écus | Coffres |
|---|---|---|---|
| T (prologue) | 11 | 200 | puits-ondin : rare |
| I | 8 | 275 | lanterne : rare |
| II | 6 | 260 | cabane : rare |
| III | 11 | 710 | village : épique |
| IV | 8 | 640 | serre : épique |
| V | 7 | 970 | peuple : légendaire |
| VI | 6 | 1 100 | phénix : légendaire |
| VII | 3 | 1 000 | phare-brume : légendaire |

- Types d'objectif : 21 lecteurs dans `HAVE` (`quests.js:219-241`). Une quête est réclamée sous transaction, avec
  409 si elle n'est pas la quête active et 403 si elle n'est pas faite (`world.js:533-544`).
- Anciennes quêtes (`LEGACY`) : rangées à leur place ; tout ce qui précède la plus avancée compte comme fait, sans
  récompense (`quests.js:166-197`).
- `GUIDED_INK` = feu, achat-source, souvenir-ondin : la page marquée a son Encre offerte (`quests.js:217`,
  `book.js:38-40`).
- Au tutoriel, La Source s'obtient **sans écus**, en écrivant l'élément « Source » (`world.js:145,555-563`).

### 5.2 Prologue (front) et première nuit

- Les quêtes du prologue sont listées dans `F:game/prologue.js:57` : les 11 de l'acte T, puis `chemin`. Cette liste
  suit l'ordre de `quests.js`.
- Avant l'île (`prologueStep`, `prologue.js:27-53`) : naufrage, avatar, arrivée, le Vent, souffle, puis le compte et
  le nom. Seul un invité tout neuf commence.
- Sur l'île, `islandStep` (`prologue.js:222-259`) se déduit de la quête active : scènes nuit, Récolte, Cannelle,
  Rivet, Ondin, puis « campement » à la fin.
- La première nuit est validée quand la quête `recolte` est réclamée (`quests.js:201-203`). Passer le tutoriel n'est
  possible qu'après (`world.js:197-203`).

### 5.3 Comptes v6, vétérans, île recommencée

| Constante | Valeur | Code |
|---|---|---|
| `VETERAN_BEFORE` | 2026-10-06T06:00:00Z | `B:services/players.js:59` |
| `V6_SINCE` | 2026-10-08T12:00:00Z | `players.js:68` |
| `RESTARTED` | `ile:recommencee` (world_items) | `players.js:76` |

- `islandModeOf` (`players.js:80-88`) :
  - `veteran` = compte créé avant `VETERAN_BEFORE`, île non recommencée, et première nuit faite ;
  - `fresh` = compte créé depuis `V6_SINCE`, ou île recommencée, ou première nuit pas faite.
- Lecture : `islandVeteranOf` et `islandFreshOf` (`players.js:104-105`).

### 5.4 Arrivées des personnages (`metOf`, `B:services/world/people.js:41-48`)

| Habitant | Arrive quand |
|---|---|
| Aster (Ponton) | Quête `feu` faite (île v6) ; d'emblée sinon |
| Cannelle (Foyer) | Quête `recolte` faite. Elle arrive affamée jusqu'à la `soupe` (`people.js:68-69`) |
| Rivet (Atelier) | Quête `poules` faite (v6) ou `soupe` (ancienne île) |
| Ondin, Sylve, Galet, Mélisse | Les dormeurs : leur quartier est à soi (`SLEEPERS`) |
| Vétéran | Tout habitant dont le bâtiment est bâti |

- Épave et camp : la place des éléments du camp est fixe et leurs cases sont réservées. La cage des poules est
  « coincée » dès que Cannelle est là (`B:services/world/camp.js`, `B:services/world/beasts.js:29-50`).

---

## 6. Mécaniques liées au temps

| Mécanique | Règle | Code |
|---|---|---|
| Parties de Récolte | Réserve `2 + palier du Foyer + bonus` ; une revient toutes les 30 min (jamais moins de 10 min) | `rules.js:11,169-174,187-191`, `annexes.js:20,94` |
| Production | Comptée depuis `max(built_at, collected_at)` ; réserve de 8 h (+2 h par lieu « cap », +4 h par réserve) | `rules.js:10,210-239`, `landmarks.js:18,54`, `annexes.js:24` |
| Ancien relevé | `progress.world_collected_at` sert à initialiser `world_stock.collected_at` | `B:services/world/reads.js:91-102` |
| Mini-jeux | +1 partie toutes les 2 h, 3 au plus | `minigames.js:8-9`, `world.js:70` |
| Expédition | `trip` heures (2 à 9), une à la fois | `lands.js:40-41,57` |
| Assemblage d'une création | Perdu au bout de 30 min | `rules.js:16` |
| Besoins | Manger 24 h, Outils 48 h ; renouvelables à mi-durée | `villagers.js:54-58,73-84` |
| Bêtes | Contentes 24 h ; on peut les nourrir quand il reste 12 h ; leur bulle se remplit au plus un jour | `beasts.js:8-10,33-48` |
| Amitié | Parler (+8) et un cadeau, une fois chacun par jour (Paris) | `people.js:235-252` |
| Visiteurs | Restent 1 à 3 jours ; le suivant arrive 4 h après le départ | `visitors.js:21,46`, `people.js:182-188` |
| Gisements de climat | Repoussent en 6 h (4 h sous la Bénédiction d'Anya) ; 2 à 4 trouvailles + 1 par création de climat (3 au plus) | `finds.js:19-22`, `anya.js:14`, `lands.js:96-98` |
| Plage | Repousse en 3 h | `pickups.js:20` |
| Bouteille, coffre du jour | Tranches de 6 h ; jour de Paris | `loot.js:12,96-100` |
| **Nuits** | 21 h à 6 h (Paris) ; première nuit 24 h après la présentation ; 2 à 6 égarés (`min(6, 2 + floor(actes/2))`) ; ils sortent dans la 1re moitié de la nuit et avancent d'une case toutes les 2 min | `nights.js:13-21,113-132`, `world/nights.js:21` |
| Défense de nuit | Lumière (feu du Foyer, lanterne, brasero) à ≤ 3 cases → luciole ; clôture ou muret → barré ; camarade non triste → repousse une fois ; toucher → repoussé | `nights.js:15-17,134-171` |
| Panne | Au plus 1 bâtiment embrumé à la fois ; production −100 % (annexes comprises) jusqu'à la réparation ou le passage d'Anya | `world/nights.js:83-90`, `people.js:128-134` |
| Anya (révélée) | Passe 2 à 3 jours par semaine (graine), à 10 h ou 23 h (Paris) ; guérit la panne | `anya.js:45-52`, `nights.js:175` |
| Saisons (décor) | Saison du calendrier : hiver déc.-fév., printemps mars-mai, été juin-août, automne sept.-nov. | `F:world/plants.js:31-36` |
| Jour et nuit (affichage) | Lever et coucher calculés à 46,5° N, sur l'**heure locale du navigateur** | `F:world/sky.js:6,35-44` |

---

## 7. Règles en double, client et serveur

Comparaison faite le 2026-10-09 avec `cmp`, `diff`, puis un diff normalisé (sans commentaires, indentation,
`export` ni `module.exports`).

| Serveur (`B:`) | Client (`F:`) | Résultat |
|---|---|---|
| `services/levels.js` (73 l.) | `game/levels.js` (71 l.) | **Logiquement identique.** Diffèrent : commentaire l. 5, `export`, indentation 4/2, ligne `module.exports` |
| `services/harvest.js` (129 l.) | `game/harvest.js` (129 l.) | **Logiquement identique.** Diffèrent : commentaire l. 3 et ligne d'export (l. 129) |
| `services/minigames.js` (272 l.) | `game/minigames.js` (273 l.) | **Logiquement identique.** Diffèrent : commentaire l. 4-5, indentation, export |
| `utils/achievementCondition.js:6-23` | `utils/achievementChecker.js:7-24` | **Identique** (le client ajoute `findNewlyUnlocked`) |
| `services/crafts.js:84-94` (`normal`, `turn`) | `world/crafts.js:19-29` | **Identique** |
| `services/world/paths.js:157-161` (cases offertes) | `game/roads.js:43-47` (`roadCost`) | **Équivalent** : `free + cases offertes effacées` |
| `services/recipeBook.js:5` `BASE_ELEMENTS` | `utils/gameConstants.js:2` | Identique |
| `routes/play/shared.js:13` `HELP_PRICE = 50` | `utils/hints.js:5` `JOKER_PRICE`, `components/Book/BookView/BookView.vue:189` `INK_PRICE` | 50 = 50 |
| `routes/play/trial.js:9` `JOKER_TIME = 30`, `services/trial.js:9` `FREE_JOKERS = 2` | `utils/hints.js:6-7` | 30 = 30, 2 = 2 |
| `services/bookLetters.js:7` `RETRY_PRICE = 20` | `components/Book/BookView/hangman.js:10` | 20 = 20 |
| `services/nights.js:19` `MS_PER_CELL` | `world/strays.js:8` | 2 min = 2 min |
| `services/loot.js:12` `BOTTLE.hours` | `world/due.js:9` `BOTTLE_HOURS` | 6 = 6 |

- **Aucune divergence de règle n'a été trouvée.** Les trois moteurs déterministes (niveaux, Récolte, mini-jeux)
  ne sont pas identiques à l'octet, à cause des commentaires et de la syntaxe de module. Ils ont les mêmes tests des
  deux côtés : `test/niveaux.test.js`, `test/harvest.test.js` et `test/minigames.test.js` côté serveur ;
  `tests/stages.test.js`, `tests/levels.test.js`, `tests/harvest.test.js` et `tests/minigames.test.js` côté client.
- Pour vérifier un jour : `diff -w` puis ignorer les lignes de commentaire et d'export.
- Sont seulement **montrés** au client, sans être recopiés : coûts, effets, quêtes, nuits, coffres, boutique. Ils
  arrivent dans la vue du serveur (`world.js:276-529`).

---

## 8. Leviers d'équilibrage

| Levier | Valeur | Fichier:ligne |
|---|---|---|
| `CAP_HOURS` (réserve de production) | 8 h | `B:services/world/rules.js:10` |
| `REGEN_MS` (retour d'une Récolte) | 30 min | `rules.js:11` |
| `REGEN_FLOOR_MS` | 10 min | `B:services/annexes.js:20` |
| `MOVES` / `SHORT_MOVES` / `SHORT_RUNS` | 15 / 8 / 2 | `rules.js:17,21-22` |
| `EXPEDITION_COST` par heure | vivres 10, bois 5 | `rules.js:29` |
| `HARVEST_COIN_EVERY` | 10 ressources = 1 écu | `rules.js:35` |
| `BOOST_BY_LEVEL` | [1,2,3,4,4,5,5,6] | `rules.js:45` |
| `ATELIER_MOVES` | [0,3,5,6,7,8,9,10] | `rules.js:46` |
| `PRODUCE_PER_LEVEL` / `COINS_PER_LEVEL` | 3 / 2 par heure | `rules.js:47-48` |
| `SITES` (coûts des 49 paliers) | — | `rules.js:52-137` |
| `MIN_CHAIN`, bonus dès 5, poisson ×3 | 3 ; `floor(L/2)` ; 3 | `B:services/harvest.js:6,9,86` |
| `GAME_LEVEL` / `PLAYS` / `PLAY_REGEN_MS` / `CAP` | III / 3 / 2 h / 60 | `B:services/minigames.js:7-10` |
| Multiplicateur des mini-jeux | +0,2 par palier | `minigames.js:266` |
| `SHORT` (mini-jeux) | Pêche 25 s, Cueillette 20 s, Filon 12 | `minigames.js:254` |
| `FISH`, `GEMS`, `BERRIES` (valeurs et poids) | § 4 | `minigames.js:43-48,109-114,188-194` |
| `STAR_BONUS` / `MARGINS` / `SEASON_STARS` | [5,5,10] / [0,25 ; 0,5] / 20 | `B:services/levels.js:11-15` |
| Objectifs des niveaux | 30→90, 2→7, 6→24 | `levels.js:20-24` |
| Prix des quartiers | 100 à 5 000 | `B:services/worldMap.js:21-46` |
| `FREE` / `MAX_CELLS` (chemins) | 12 / 80 | `B:services/world/paths.js:16,18` |
| Annexes : `SMALL_COINS`, `KIND_COINS`, `HOUSE_COINS`, effets | — | `annexes.js:14-27` |
| `PROD_CAP` (boutique) | +100 % | `B:services/worldShop.js:9` |
| `HARVEST`, `BOTTLE`, lots | — | `B:services/loot.js:10-21,76-93` |
| `TALK`, `GIFT`, `HEARTS`, `REWARDS` | 8 ; 15 → 30/15/6 ; 30/80/150/250/400 | `B:services/villagers.js:19-31` |
| `NEEDS`, `MOOD_STEP` | § 6 ; ±10 %, ±2 coups, ±3 min | `villagers.js:54-67` |
| `AMOUNTS`, `RUNS`, `rewardOf`, `GAP_HOURS` | — | `B:services/visitors.js:21-25` |
| `FEED_COST`, `daily` des bêtes | 2 vivres ; 0 à 8 par jour | `B:services/beasts.js:10-22` |
| Nuits : heures, `LIGHT_REACH`, `countOf`, `repairOf` | 21-6 h, 3, 2→6, 3+2n | `B:services/nights.js:13-21,179` |
| `GRACE_MS` (avant la 1re nuit) | 24 h | `B:services/world/nights.js:21` |
| `BLESSING` (Anya) | Repousse en 4 h, humeur ≥ content | `B:services/anya.js:14` |
| `GATHER`, `REGROW_MS`, `CRAFT_BONUS_MAX` | 2-4, 6 h, 3 | `B:services/finds.js:19-22` |
| Plage : `KINDS`, `REGROW_MS` | 2 par toucher, 3 h | `B:services/pickups.js:7-20` |
| Lieux remarquables (effets) | — | `B:services/landmarks.js:12-63` |
| Chapitres : `need`, `DIFFICULTY` | — | `B:services/bookPages.js:11-31` |
| `HELP_PRICE` / `RETRY_PRICE` / `RETRY_HOURS` | 50 / 20 / 24 h | `B:routes/play/shared.js:13`, `B:services/bookLetters.js:7`, `B:services/hangman.js:6` |
| `FREE_JOKERS` / `RECORD_BONUS` / `GRACE_SECONDS` | 2 / 5 / 5 s | `B:services/trial.js:8-11` |
| Quêtes : écus et coffres | 5 155 en tout | `B:services/quests.js:27-161` |
| Créations : `STARS` / `EPREUVES` | 10 / 10 | `B:services/crafts.js:20-21` |

---

## 9. Constats

Ce sont des faits relevés dans le code, avec leur référence. Ce ne sont pas des décisions.

### 9.1 Fonctions absentes ou à moitié faites

1. **L'Arrimage n'existe pas dans le code.** Aucune occurrence dans `B:` ni `F:`. Six valeurs « non fixées »
   attendent l'auteur : tours de marée, seuil de gîte, rangées par niveau, bonus « droit » et « manifeste »,
   poids du lest, palier d'ouverture (`ETAT_DES_LIEUX.md:354-360`).
2. **Les thèmes de saison des jeux à grille ne sont pas codés** (commandes de la Récolte, outils du Filon…,
   `minijeux_grille.md` § 3-5). Chaque niveau n'a qu'un objectif de quantité (`levels.js:20-24`). Les étoiles ne
   débloquent rien d'autre que des niveaux.
3. Climats : « plus tard, ses règles ». Aujourd'hui, un climat n'a que ses gisements et ses créations
   (`worldMap.js:13`).
4. À confirmer avec l'auteur : le bonus d'étoile perdu quand la partie touche déjà le plafond d'écus
   (`ETAT_DES_LIEUX.md:377`). C'est le comportement codé des mini-jeux (`world.js:737`).

### 9.2 Incohérences entre règles, commentaires et textes

1. **Récolte sans plafond d'écus.** `minijeux_grille.md` § 2 et § 8 placent le bonus d'étoile « dans le plafond par
   partie ». Pour la Récolte, `room = Infinity` (`world.js:662`), et ses écus n'ont pas de plafond
   (`world.js:659`).
2. **Portée des lumières la nuit :** le commentaire dit « 2 cases ou moins » (`nights.js:4`), le code compte
   `LIGHT_REACH = 3` (`nights.js:15,144`).
3. **`buyItem` applique le bonus avant l'encaissement.** Le commentaire dit que la production en cours est encaissée
   d'abord et que le bonus ne vaut que pour la suite (`world.js:762`). Mais l'article est inséré (l. 773) **avant**
   `gather` (l. 775), qui relit les articles dans la même transaction (`produce.js:24`). Le bonus s'applique donc à
   toute la production en attente.
4. **Deux « cœurs de l'île ».** `map.CORE` compte 7 quartiers et ouvre les expéditions (`worldMap.js:50`).
   `anya.CORE` en compte 9, dont La Crique, La Grande Forêt et Le Hameau ; il déclenche la Révélation et la
   Bénédiction (`anya.js:9`).
5. **Prix de La Source au tutoriel.** Le commentaire dit que les écus du prologue « en paient le prix (100), pas
   plus » (`quests.js:28-29`). Mais au tutoriel (compte non vétéran), La Source est gratuite (`world.js:555-563`) :
   il reste 100 écus de plus.
6. **Libellés des succès :** `length` compte les 4 éléments de base. « Découvre 15 éléments » demande donc 11
   découvertes (`seed:233`, `db/schema.sql:117`).
7. **Nuit de jeu et nuit affichée :** la nuit de jeu suit l'heure de Paris (`nights.js:24-47`), le ciel suit
   l'heure locale du navigateur (`F:world/sky.js:35-44`). (hypothèse : hors du fuseau de Paris, les égarés peuvent
   marcher en plein jour affiché)
8. (hypothèse) La première Récolte (8 coups, sans eau, sans bonus) doit rapporter 30 ressources pour une étoile au
   niveau 1, soit 3,75 par coup ; une chaîne de 3 ou 4 tuiles en donne 3 ou 4 (`rules.js:22`, `levels.js:21`).

### 9.3 Failles possibles dans l'économie

Toutes relevées par lecture du code ; aucune n'a été reproduite.

1. **Achat puis annulation de la boutique.** Il suffit de laisser la production s'accumuler (jusqu'à 8 h et plus),
   d'acheter un objet `prod` ou `coins`, puis de l'annuler dans les 6 s. Le bonus s'applique à toute la fenêtre
   (constat 9.2-3), et l'annulation rembourse le prix entier (`world.js:801-818`). Seuls les articles `moves`,
   `charges` et `regenMs` sont bloqués après une partie (`world.js:788,812`). Exemple : Golem (+5 écus/h) donne
   environ +40 écus sur 8 h, gratuitement. Cela se répète à chaque fenêtre et pour chaque article.
2. **Records de l'Épreuve versés en entier.** Chaque nouveau record paie `score × 5` en entier, pas la différence
   (`trial.js:107-108`). Une question déjà résolue compte encore dans le score d'un nouveau lancement
   (`trial.js:85-89`). Monter le record d'un point à la fois rapporte `5 × N(N+1)/2`, au lieu de `5N`. Avec 31 à 33
   questions par niveau, cela fait environ 7 900 écus pour les 3 niveaux, au lieu d'environ 480 (hypothèse,
   calculée).
3. **« Recommencer l'île » à volonté** (sauf si `ISLAND_RESTART_ONCE=1`, `world.js:222-227`). L'île efface les
   coffres `quete:*`, `lieu:*` et `recolte:*` (`world.js:229`), et les visiteurs installés. En rejouant la chaîne :
   - les lots en ressources, teintes et pièces rares des coffres se regagnent (les écus non, car le grand livre est
     unique) ;
   - les cœurs des nouveaux visiteurs installés repaient 40 + 120 écus et des coffres (nouvelles références
     `ami:v<id>`, `people.js:208`).
   Coût élevé (la chaîne entière). (hypothèse)
4. **Seuil de l'Épreuve écrit par le client — corrigé (lot R2, 2026-10-09).** `completedQuestions` n'accepte plus que
   les questions payées par le serveur (`timerProgress.js`), donc le palier I des créations (`creations.js:59-63`,
   `crafts.js:168`) demande de vraies réussites. Reste : `POST /play/run` accepte n'importe quelle question, chapitre
   ouvert ou non (`routes/play/trial.js:12-20`).
5. **Encre presque toujours gratuite.** Elle est offerte après 3 (ou 5) mélanges ratés **différents** sur la page,
   avec des éléments déjà en main (`book.js:40`, `bookTries.js:6-11`). Le prix de 50 écus ne retient presque
   personne.
6. **Parties résolues d'avance.** La graine est envoyée au client, qui peut donc calculer la partie parfaite :
   plateau et tirages de la Récolte, filon du Filon (`veinOf`), poissons et baies. Le serveur vérifie seulement la
   validité des gestes, et le temps pour la Pêche et la Cueillette. Le Filon n'a aucun contrôle de temps
   (`last: 0`, `minigames.js:183`). Les plafonds limitent les mini-jeux, pas la Récolte.
7. **Récolte en fin de jeu.** (hypothèse, calculée avec `effectsOf`, tout acheté) : 46 coups, ×6 sur les
   4 ressources, 17 parties en réserve, retour en 10 min. Une chaîne de 6 rapporte 54 ressources, donc environ
   2 500 ressources et 250 écus par partie, sans plafond. Pour comparaison, un mini-jeu rapporte au plus 108
   écus, et la Carrière au maximum environ 109 pierres et 84 écus par heure.

---

## Non examiné

- `B:services/world/migrate.js` (passage des anciennes cartes v1 à v5), `islandOuter.js`, `islandData.js`,
  `worldMapV2.js`, `worldMapV4.js` : seulement survolés pour les crédits `carte-v2`.
- `B:services/world/creations.js` : pose, déplacement, réserve (seuls `epreuvesOf` et le paiement ont été lus) ;
  `crafts.piecesOf` et `crafts.check` (découpe et vérification du puzzle) ; règles de pose `spotBlock`.
- `B:services/world/annexPlots.js` (cases permises), `world/camp.js` (au-delà des places), `world/reads.js`
  (au-delà de `stockOf` et `PLAYED`).
- `B:services/world/anyaBrume.js` et `B:services/anya.js` (Souffle, Savoir de Brume, lieux d'errance) : seuls les
  chiffres sont repris ; `B:services/avatarChoices.js`, `naming.js`, `accounts.js`, `authSession.js` et les routes
  hors `play/`.
- Contenu du Grimoire : recettes (`db/content/recipes_*.py`), énigmes (`riddles.py`), accessibilité de chaque
  élément, fil d'Ariane (`bookPages.arianeOf`), forme des recettes de page (`pageRecipe`).
- Côté front : l'affichage (`F:world/view/**`, composants Vue), `F:game/coach.js`, `guide.js`, `opus.js`,
  `vigils.js`, `savoirs.js`, la météo de `F:world/sky.js` (purement visuelle : hypothèse, rien côté serveur).
- Les jeux de tests n'ont pas été lancés. La base de production n'a pas été lue : les valeurs en base (questions,
  succès, cabinet) viennent de `db/seed.sql`, pas de la production.
- Les variables d'environnement de production (dont `ISLAND_RESTART_ONCE` et `JWT_SECRET`, qui sert à l'identifiant
  des pages) n'ont pas été consultées.
