# Architecture du front — Brumelune

> Vérifié contre le code : front b47a53f2 (2026-10-09)
>
> Les références `chemin:ligne` sont relatives à la racine du dépôt du jeu. « (hypothèse) » marque une déduction
> non vérifiée à l'exécution. Rien ici ne remplace : `README.md` (démarrer), `DEPLOY.md` et `deploy/ovh/README.md`
> (déployer), `PASSATION.md` § 5 (architecture détaillée de l'île et du serveur), `ETAT_DES_LIEUX.md` (état du
> travail, bancs), `HISTOIRE.md` (bible du jeu), `src/styles/README.md` (styles), `design/conception/*` (design).

---

## 1. Pile technique

| Paquet | Demandé (`package.json`) | Résolu (`package-lock.json`) |
|---|---|---|
| vue | `^3.2.13` | 3.5.43 |
| axios | `^1.7.9` | 1.20.0 |
| mobile-drag-drop | `2.2.0` | 2.2.0 |
| vite / @vitejs/plugin-vue | `^6.4.4` / `^5.2.4` | 6.4.4 (rollup 4.63.6, esbuild 0.25.12) / 5.2.4 |
| vitest | `^4.1.11` | 4.1.11 |
| eslint, @eslint/js / eslint-plugin-vue / vue-eslint-parser | `^9.39.5` / `^10.11.1` / `^10.4.1` | 9.39.5 / 10.11.1 / 10.4.1 |
| postcss / autoprefixer | `^8.5.29` / `^10.6.1` | 8.5.29 / 10.6.1 |

- 3 dépendances d'exécution seulement : Vue, axios, mobile-drag-drop (`package.json:12-16`).
- Pas de routeur, pas de store, pas de TypeScript.
- `lockfileVersion` 3. Pas de champ `engines` ni de `.nvmrc`.

**Scripts** (`package.json:5-10`) : `serve` = `vite` (port 8080, `/api` → `localhost:3000`, `vite.config.mjs:35`) ;
`build` = `vite build` → `dist/` ; `preview` (même proxy, `:36`) ; `lint` = `eslint --max-warnings 0 src tests` ;
`test` = `vitest run`.

**CI** (`.github/workflows/ci.yml`) : Node 22, `npm ci` → `lint` → `test` → `build`, sur PR et push `master`.
`keep-alive.yml` réveille l'API Render toutes les 10 min (sans lien avec le front).

**Configs**
- `eslint.config.mjs` : `js.configs.recommended` + `pluginVue.configs['flat/essential']`, globals navigateur + Node,
  `no-unused-vars` avec `caughtErrors: 'none'` (`eslint.config.mjs:7-19`). `outils/` n'est pas linté.
- `vitest.config.mjs` : alias `@`, `include: ['tests/**/*.test.js']`, environnement par défaut (Node, pas de DOM).
- `postcss.config.cjs` : autoprefixer seul, cible `browserslist` (`package.json:29-34`).
- `vite.config.mjs` : pas de `build.target` (cible par défaut de Vite).

## 2. Démarrage

### index.html
- Viewport `width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover` (`index.html:5`).
- Polices Google Fraunces + Nunito, `display=swap`, avec preconnect (`index.html:16-18`).
- **Splash en ligne** (CSS `index.html:20-54`, balisage `:57-77`) : 3 étapes `code`, `fonts`, `carnet`.
- Garde-fou sans module : à 30 s, si `code` n'est pas coché → `is-failed` + bouton « Réessayer » (`index.html:78-88`).
- Pilotage côté code : `src/utils/splash.js` (effacement à 6 s si le carnet est revenu, `splash.js:36,74-80`).

### src/main.js

| Ligne | Ce qui est installé |
|---|---|
| `:10` | `splashDeadline()` |
| `:15-25` | `vite:preloadError` → rechargement, au plus 1/min (`sessionStorage` `oc_reloaded_at`) |
| `:29-32` | polyfill `mobile-drag-drop` (`holdToDrag: 200`) |
| `:34` | écouteur `touchmove` **non passif** sur `window` (iOS) |
| `:36-45` | `createApp(App)` ; en prod : `silent`, `errorHandler = null`, `warnHandler = null` ; `mount('#app')` |
| `:46-49` | étapes splash `code` puis `fonts` (`document.fonts.ready`) |
| `:52-56` | enregistrement de `/sw.js` (prod seulement, au `load`) |
| `:61` | export `API_URL` (doublon de `src/config.js:4`, voir § 15) |

### Service worker (`public/sw.js`)
- Cache unique `origins-v3` (`sw.js:7`) ; `skipWaiting` + `clients.claim` (`:10`, `:25-31`).
- Navigation : **réseau d'abord**, copie en `/` pour le hors-ligne ; repli `caches.match('/')` (`:38-55`).
- `/js/ /css/ /img/ /fonts/ /icons/` : **cache d'abord** (`:8`, `:58-71`) ; jamais une réponse `text/html` (`:64`).
- Ménage : supprime l'ancienne version d'un fichier **cité par la nouvelle page** ; un chunk chargé à la demande
  reste (`:12-23`).
- Non interceptés : API, autres origines (Google Fonts), `version.json` (`:4`, `:36`).

### Détection de nouvelle version
- Build : empreinte `Date.now().toString(36)` → `VITE_APP_VERSION` + `version.json` (`vite.config.mjs:12-19`).
- `watchVersion` relit `/version.json?t=…` (`no-store`) toutes les 10 min et au retour sur l'onglet
  (`utils/newVersion.js:4-29`) ; `update.js` (prod, `:22-24`) fait dire « Actualiser » à Brume hors partie,
  scène et Épreuve (`:13-19`).

## 3. Carte des dossiers (`src/`)

| Dossier | Rôle | Fichiers |
|---|---|---|
| `src/` | `main.js`, `config.js` (base API) | 2 |
| `assets/` | `creatures/` PNG (§ 15 : jamais trouvés), `success/` PNG (`achievementsService.js:6`), `fonts/` | 36 + 17 + 5 |
| `book/` | moteur du Grimoire (WebGL + Canvas 2D) | 8 |
| `components/` | 76 `.vue`, 11 domaines | 179 |
| `directives/` | `longpress.js` | 1 |
| `game/` | règles, tutoriel, guide, coach, mini-jeux | 20 |
| `services/` | client HTTP et appels API | 10 |
| `styles/` (+`base/`, `tokens/`) | jetons et base CSS | 2 + 10 + 12 |
| `utils/` | fonctions pures et petits outils | 21 |
| `world/` (+`tiers/`, `view/`, `view/draw/`) | logique et dessins de l'île ; paliers III-VII ; caméra, gestes, boucle | 62 + 9 + 5 + 8 |

Composants par domaine (`.vue`) : World 39, Prologue 7, ui 6, Account 4, App 4, Book 4, Trial 4, Guide 3,
Codex 2, Settings 2, Craft 1.

**Convention** : `components/<Domaine>/<Comp>/<Comp>.vue` + `<Comp>.css` (`<style scoped src>`) +
éventuellement `<Comp>.global.css` (non scoped). Règle détaillée : `src/styles/README.md` § 3.
Exceptions vérifiées : `BoardingCard` (`<style scoped>` en ligne), `GModal` et `App` (global seul),
`components/World/island-ui.css` partagé, chargé par `WorldView.vue`.

## 4. Coque et navigation

- `App.vue` : orchestre tout, sans routeur. 593 lignes.
- `currentMode` calculé (`App.vue:354-358`) : `sceau` | `world` | `timer` | `infinite`.
- Changement de mode : `handleModeSelect` (`App.vue:565-587`) ; l'Épreuve bloque l'accès à l'île et au Sceau.
- Rendu : `SceauView` / `WorldView` / `BookView` / `TrialInventory` en `v-if` (`App.vue:21-95`).

- TabBar (`TabBar.vue:26-31`) : `infinite` Grimoire · `world` Île · `timer` Défis · `sceau` Sceau ; onglets
  fermés par le tutoriel : `lockedTabs` (`story.js:140`).

**Mixins d'App** (`App.vue:282`, dossier `src/components/App/App/`)
- `account.js` : session, écus, Cabinet, liens `?reset=` / `?email=`, retour de compte, déconnexion.
- `carnet.js` : carnet de l'Infini (compte ou invité), rechargé au retour si > 30 s (`carnet.js:10,80-86`).
- `achievements.js` : succès, file de popups, quête de Brume côté Grimoire.
- `story.js` : tutoriel, quêtes, veillées, Anya, onglets fermés, « Recommencer l'île ».
- `trial.js` : l'Épreuve (inventaire Infini mis de côté).
- `update.js` : annonce de mise à jour.

**Chargement à la demande** (`import()`)
- `WorldView.vue` : `defineAsyncComponent`, préchargé au repos (`requestIdleCallback`, repli 2 s)
  (`App.vue:272-273`, `:467-468`).
- Générateur d'avatar `design/bibliotheque/generateur/avatar.mjs` (`src/game/avatarKit.js:19`).
- Implicite : chaque SVG des `import.meta.glob(..., { query: '?raw' })` non eager devient un chunk (§ 10).
- Écran d'arrivée sur l'île : montré après 200 ms, jamais plus de 6 s (`App.vue:275-276`, `:430-445`).

## 5. État et mémoire de l'appareil

**Où vit l'état**
- `App.vue` `data()` (`:310-336`) + `data()` des 6 mixins : source unique côté interface.
- Props/événements vers les enfants ; `$refs` pour les appels directs (`craftZone`, `book`, `world`, `timerModeButton`).
- Modules `reactive()` partagés : `game/guide.js:17` (file de Brume), `game/coach.js:11` (leçon du coach),
  `game/avatarKit.js:10`, vignettes `world/{decorArt,objectArt,creations,buildingArt,beastArt}.js`.
- `WorldView` : `state` (vue serveur) réactif ; caméra, géométrie, pointeurs, caches non réactifs posés dans
  `created()` (`WorldView.vue:648-725`).
- Aucun `markRaw`/`shallowRef` dans `src/` (grep).

**localStorage** (via `src/utils/storage.js`, qui ne lève jamais, sauf mention)

| Clé | Rôle | Écrit par | « Recommencer l'île » |
|---|---|---|---|
| `user` | indice de session `{userId, username}` | `services/session.js:6` | garde |
| `oc_carnet` | dernier carnet du compte | `utils/carnet.js:4` (accès direct) | garde (rechargé du serveur) |
| `coins` | écus du compte | `account.js:18` | garde |
| `userCustomization` | cadre/emblème portés | `account.js:19` | garde |
| `oc_back` | retour de compte en pause | `authService.js:6` | — |
| `oc_prologue` | état du tutoriel | `game/prologue.js:9` | **partiel** : `skipped/finished=false`, `seen` réduit à naufrage/arrivee/souffle |
| `oc_guide_seen` | répliques de Brume dites | `game/guide.js:8` | **vidé** (`guide.forget`) |
| `oc_brume_born` | naissance de Brume jouée | `game/guide.js:9` | garde (voulu, `guide.js:73`) |
| `oc_coach_seen` | gestes du coach faits | `game/coach.js:9` | **vidé** (`coach.forget`) |
| `oc_arrived` | naufragés vus débarquer | `world/story.js:6` | **vidé** (`[]`) |
| `oc_vigils` | veillées vues | `story.js:37` | garde |
| `oc_traces` | traces d'Anya vues | `story.js:39` | garde |
| `oc_book_ink` | Encre (ingrédients révélés) | `BookView.vue:190`, `game/savoirs.js:8` | garde |
| `oc_book_savoirs` | Savoirs soufflés | `game/savoirs.js:9` | garde |
| `oc_wrecks` | naufrages annoncés | `world/view/draw/brume.js:87-91` (direct) | garde |
| `oc_night_told` | dernier bilan de nuit | `WorldView/nights.js:14` (direct) | garde |
| `oc_item_guides` | modes d'emploi d'articles vus | `WorldView/sites.js:18` (direct) | garde |
| `oc_visitor_seen` | arrivée du visiteur jouée | `WorldView.vue:944-947` (direct) | garde |

- `sessionStorage` : `oc_reloaded_at` (`main.js:15`).
- Reset : `islandRestarted` (`story.js:421-429`) puis `location.reload()`.
- Déconnexion : efface `oc_carnet`, `coins`, `userCustomization`, `user` (`account.js:108-114`,
  `authService.js:37-41`) ; les clés `oc_*` du tutoriel restent.
- (hypothèse) `oc_wrecks`, `oc_vigils`, `oc_traces` ne sont pas oubliés : après un recommencement, les naufrages
  déjà annoncés ne le seraient plus. À confirmer avec le serveur (`players.V6_SINCE`).

## 6. Communication serveur

Détail des routes : `Og-create-backend/docs/architecture/API_CONTRACTS.md`.

**`services/http.js`** — client axios unique

| Comportement | Réf. |
|---|---|
| `baseURL` = `API_URL` (`/api` par défaut, même origine) | `:10`, `src/config.js:4` |
| En-tête anti-CSRF `X-Requested-With: origins` | `:7`, `:11` |
| Délai 20 s | `:12` |
| GET sans réponse / 502-504 : réessais 1-2-4-8-15 s, budget 90 s ; jamais un POST | `:19-32`, `:75` |
| Calques de carte (85 Ko) gardés ; clé `X-Map-Key` ; remis dans les vues reçues sans eux | `:37-48`, `:64-71` |
| 401 avec session : un seul `/auth/refresh` partagé (409 → `/auth/me`) ; échec → `clearSession` + reload | `:52-62`, `:76-88` |

**Services**

| Fichier | Rôle |
|---|---|
| `playService.js` | jeu : carnet, mélanges, Livre, île (~50 méthodes `/play/*`) |
| `authService.js` | login/register (reload après succès), mot de passe oublié, logout |
| `accountService.js` | `/account/*` (profil, mot de passe, e-mail, pause, suppression, export) |
| `achievements`, `customization`, `progress`, `trialService.js` | succès (+ `/user` si session), Cabinet, `/progress/load`, Épreuve |
| `notificationService.js` | toasts (monte un mini `createApp` par message) |

**Invités**
- `session.js` : indice `user` seulement ; un 401 révèle une session expirée (`session.js:1-3`).
- Routes du carnet enveloppées par `asPlayer` : sur `NO_PLAYER`, `POST /play/guest` puis un seul rejeu
  (`playService.js:6-22`).
- Routes de l'île non enveloppées : 401/402 → `WorldView.guest = true`, invitation (`WorldView.vue:818-822`).
- Sans session, un 401 remonte tel quel à l'appelant (`http.js:77-78`).

## 7. Moteur de l'île

- `WorldView.vue` (1035 lignes ; gabarit 1-421, script 423-1028) + 12 mixins voisins (`WorldView.vue:500`) :
  `folk games chests workshop sites annexes explore terrain sky nights coach roads`.
- Méthodes du moteur étalées depuis `world/view/` : `camera.js`, `draw.js` (index de `draw/*`), `gestures.js`,
  `constants.js`, `memory.js`. Détail par fichier : `PASSATION.md` § 5 « Front ».

**Boucle** (`world/view/draw/loop.js`)

| Fonction | Usage | Réf. |
|---|---|---|
| `syncLoop` | RAF seulement si : onglet visible, **pas de mouvement réduit**, état chargé, pas invité, pas de partie | `:29-36` |
| `frame` | ~30 img/s (`FRAME_MS = 33`) ; 4 img/s pendant le chargement | `:14`, `:18`, `:37-50` |
| `drawSoon` | gestes : un seul dessin à l'image suivante | `:53-60` |
| `repaintSoon` | dessin arrivé : un redessin, si la boucle ne tourne pas | `:64-70` |
| `draw` | dessin complet d'une image | `:79` |

Règle : dans un geste, `drawSoon()` et non `draw()` (gestes : `gestures.js:103-137`, zoom : `camera.js:88-98`).
`draw()` direct reste au resize et au ResizeObserver (`WorldView.vue:730-733`, `camera.js:18-22`).

**Couches, dans l'ordre de `draw`** (`loop.js:93-315`) : mer plein écran → sol en carrés d'images
(`TerrainCache`, 8 ms max par image) et eau vive → chantiers, cases de pose, chemins → ombres de nuages → **ce qui
se tient debout, trié par profondeur** (`:226-247`) → fumée, nuages, teinte, météo, climat, lumières → Brume,
noms, balises, bulles, sélection.

**Caméra et gestes**
- `dpr` plafonné à 2 (`camera.js:31`) ; zoom max 1,8 (`camera.js:8`) ; vue gardée entre visites (`memory.js`).
- Pointer Events + `setPointerCapture` (`gestures.js:45-50`), pincement, molette (`:160-164`), appui long 450 ms
  (`directives/longpress.js:4`), `touch-action: none` sur le canvas (`WorldView.css:22`), `@touchend.prevent`
  contre le clic fantôme (`WorldView.vue:28-42`).
- Au-dessous de `FAR_SCALE` 0,45 : petits décors omis ; au-dessus de `NEAR_SCALE` 0,9 : décor vivant, sinon cuit
  dans le sol (`loop.js:21-25`).

**Caches mémoire**
- Sprites (`world/spriteCache.js`) : 5 détails (4 à ¼ px/unité), 6 lectures à la fois, 6 ms de rastérisation par
  image, budget `16e6` px ≈ 64 Mo, purge après 10 s sans usage (`:16-25`).
- Sol (`world/terrain.js`) : carrés 512 px, 24 gardés hors écran, résolution max 2, vue d'ensemble à 0,25
  (`:17-21`).
- Tout est vidé au démontage : `clearSprites`, `clearDrawings`, `terrain.clear` (`WorldView.vue:777-785`).

**Déterminisme**
- `hash(a, b)` à base de `Math.sin` (`world/scene.js:207-210`), recopié dans `world/sky.js:10` et
  `world/village.js:54`.
- **Aucun `Math.random` dans `src/world/`** (grep). Ailleurs, seulement le décoratif ou l'interface :
  `utils/livingBackground.js`, `utils/fx.js:54-65`, `book/painter.js:161-162` (grain du papier),
  `TimerQuestions.vue:283`, `PrologueAvatar.vue:60`, `AvatarMaker.vue:161`, `utils/failLine.js:67` (injectable).
- (hypothèse) `Math.sin` n'est pas garanti bit à bit entre moteurs JS : le décor pourrait différer d'un navigateur
  à l'autre, pas d'une visite à l'autre.

**Nettoyage** (`WorldView.vue:755-786`) : `AbortController` des écouteurs (`:727-737`), `clearTimeout` ×3,
`clearInterval(tick)` (20 s, `:739-750`), `cancelAnimationFrame` ×6 (`raf`, `moreRaf`, `soonRaf`, `repaintRaf`,
`glideRaf`, `edgeRaf`), `observer.disconnect()`, `onPathsLoaded(null)`.

**Outils de mesure en prod** : `?perf` (compteur, `world/perf.js:6`), `?heure=`, `?meteo=`, `?oeuvre=`
(`world/scene.js:12-23`).

**Plus gros fichiers de `src/`** (`wc -l`, 348 fichiers js/vue/css, 44 252 lignes)

| Lignes | Fichier | Lignes | Fichier |
|---|---|---|---|
| 1802 | `world/shopSprites.js` | 638 | `world/landmarkSprites.js` |
| 1133 | `book/painter.js` | 594 | `world/rareSprites.js` |
| 1064 | `world/annexSprites.js` | 593 | `App/App/App.vue` |
| 1035 | `World/WorldView/WorldView.vue` | 562 | `world/view/gestures.js` |
| 851 | `world/terrain.js` | 555 | `Book/BookView/BookView.vue` |
| 850 | `world/village.js` | 544 | `World/Games/FishingBoard/FishingBoard.vue` |
| 830 | `world/craftSprites.js` | 499 | `World/WorldView/folk.js` |
| 802 | `book/curlBook.js` | | |

## 8. Moteur du Livre (`src/book`)

- `curlBook.js` : page tournée en **WebGL** (cylindre, shaders) ; repli Canvas 2D en fondu si `webgl` manque ou
  si le programme ne lie pas (`:167-190`) ; rendu seulement pendant un tour ; perte de contexte gérée (`:725-731`).
- Mouvement réduit ou sans WebGL : glissement sans courbure (`curlBook.js:587`, `:660`).
- `painter.js` : peinture Canvas 2D d'une page (`paintPage`, `:1122`) ; cache vidé par `clearDrawings` (`:111`).
- Autres : `grimoire.js` (sceaux, reliure), `chapters.js` (mêmes regroupements que `services/bookPages.js`),
  `spread.js`, `aim.js`, `patchwork.js`, `fx.js` ; `BookView.vue` + mixins `shelf`, `pages`, `effects`, `hangman`.

## 9. Logique de jeu (`src/game`)

- Jeux (**miroirs serveur**) : `harvest.js`, `minigames.js`, `levels.js`, `roads.js` ; dessins : `harvestArt.js`,
  `minigameArt.js` ; `resources.js`.
- Tutoriel : `prologue.js`, `prologueScenes.js`, `sceneArt.js`, `avatarKit.js`, `loading.js` (écran d'arrivée).
- Guide : `guide.js`, `guideTips.js`, `coach.js`, `firstTimes.js`.
- Récit : `vigils.js`, `opus.js`, `anya.js`, `savoirs.js` (tout se déduit du serveur, sauf le « déjà vu »).

**Ce qui doit rester identique au serveur**

| Front | Serveur | Garde-fou |
|---|---|---|
| `game/harvest.js` | `services/harvest.js` | même vecteur (`tests/harvest.test.js:4,22`) |
| `game/minigames.js` | `services/minigames.js` | graine 42, mêmes parties (`tests/minigames.test.js:4-6`) |
| `game/levels.js` | `services/levels.js` | mêmes vecteurs que `test/niveaux.test.js` (`tests/stages.test.js:1,37`) |
| `world/crafts.js` (`turn`) | `services/crafts.js` | mêmes vecteurs (`tests/crafts.test.js:8`) |
| `game/roads.js` | `services/world/paths.js` | règles reprises (`tests/roads.test.js:1`) |
| `utils/names.js` | `services/naming.js` | **aucun test front** |
| identifiants (annexes 28, trouvailles 6, lieux 13…) | catalogues serveur | `annexes/finds/landmarks.test.js` |

- Les vecteurs sont **recopiés à la main** dans les deux dépôts ; aucun test ne lit l'autre dépôt.
- Hors commentaires, `harvest.js` ne diffère du serveur que par `export` / `module.exports` (diff du 2026-10-09).
- (hypothèse) Une modification d'un seul côté, avec son test mis à jour, passe les deux CI.

## 10. Ressources graphiques

- Bibliothèque `design/bibliotheque/` (267 Mo, 14 026 SVG) importée par **21 fichiers js/vue** et citée en
  `url()` par 7 CSS de composants (ex. `AvatarMaker.css:14`).
- `import.meta.glob` (28 appels, dont 26 sur la bibliothèque ; comptes `tinyglobby` du 2026-10-09) :
  - `?raw` non eager → **2 648 SVG** (22,3 Mo) chargés à la demande, un chunk JS chacun (ex. `world/decorArt.js:13`) ;
  - `?url` eager → **1 438 SVG** (12,9 Mo) en fichiers sous `img/`, table d'URL dans le code (ex.
    `world/faces.js:27`, `utils/icons.js:120`).
- `assetsInlineLimit` : jamais d'inline pour `/design/bibliotheque/` (`vite.config.mjs:44`).
- JSON de catalogue importés statiquement : 18 fichiers, 1,2 Mo bruts (ex. `quotidien.json` 426 Ko via
  `world/masterArt.js:9`, `avatar.json` 299 Ko via `game/avatarKit.js:6`).
- Noms de sortie : `js/`, `css/`, `fonts/`, `img/` + hash, pour le service worker (`vite.config.mjs:7,47-49`).
- `public/icons/` : PWA (`icon-180/192/512.png`, `icon.svg`) + **827 SVG d'éléments** (3,3 Mo), servis
  par `/icons/elements/<nom>.svg` (`utils/glyph.js:12`).
- Polices : Google Fonts Fraunces + Nunito (`index.html:16-18`), non gardées par le SW (`sw.js:4`) ;
  auto-hébergées IM Fell English (×3) et UnifrakturMaguntia, `swap` (`BookView.global.css:3-6`, `OFL.txt`).

## 11. Styles

- Trois étages jetons → base → composant : voir `src/styles/README.md` (ne pas dupliquer ici).
- `main.js:5` importe `styles/index.css` (`tokens/index.css` puis `base/index.css`).
- Thème sombre « Veillée » par `prefers-color-scheme: dark` (`tokens/dark.css:3`), sans bascule manuelle.
- 7 fichiers `*.global.css` ; `tests/tokens.test.js` vérifie les jetons `-rgb`.

## 12. Build (mesuré le 2026-10-09 par le lead)

| Mesure | Valeur |
|---|---|
| `npm run build` / `npm run lint` | OK / OK |
| Chunk `WorldView` · `index` · `avatar` | ~1,51 Mo (364 Ko gzip) · ~1,24 Mo (268 Ko gzip) · ~152 Ko |
| `dist/` total | ~79 Mo |
| `npm test` | 78 fichiers, 415 tests, tous verts |

- `chunkSizeWarningLimit: 4096` (`vite.config.mjs:41`) : Vite ne signale aucun de ces chunks.
- (hypothèse) `index` embarque des modules de l'île via `story.js:12` → `world/faces.js:4-5` →
  `world/masterArt.js:9` (`quotidien.json`).

## 13. Tests

78 fichiers `tests/*.test.js`, tous en Vitest, sans DOM.

| Domaine | Nb | Fichiers (exemples) |
|---|---|---|
| Île : logique (`src/world`) | 23 | `village`, `visitors`, `shop`, `levels`, `needs`, `story`, `troupe`, `pose` |
| Île : dessins / bibliothèque | 12 | `buildingArt`, `masterArt`, `decorArt`, `objectArt`, `plants`, `world` |
| Île : moteur de rendu | 9 | `terrain`, `strokeBatch`, `spriteCache`, `hitAt`, `sight`, `sea`, `perf` |
| Miroirs serveur | 5 | `harvest`, `minigames`, `stages`, `crafts`, `roads` |
| Tutoriel, guide, histoire (`src/game`) | 11 | `prologue`, `coach`, `guide`, `vigils`, `opus`, `anya`, `sceneArt` |
| Grimoire (`src/book`) | 3 | `grimoire`, `bookClue`, `patchwork` |
| Utilitaires (`src/utils`) | 10 | `carnet`, `eras` (`families`), `search`, `sigil`, `newVersion`, `typo` |
| HTTP / session | 3 | `http`, `mapLayers`, `welcomeBack` (importe le mixin `account.js`) |
| Directive / CSS | 2 | `longpress`, `tokens` |

- Des tests lisent `design/bibliotheque/**/*.json` (`buildingArt`, `chestArt`, `decorArt`…) : `design/` est requis.

**Non couvert**
- Aucun test de composant `.vue` (aucun import `.vue` dans `tests/`), pas de jsdom/happy-dom.
- Aucun test de bout en bout en CI (`ci.yml`).
- `outils/banc/*.cjs` (7 scripts) : manuels, `require('playwright')` alors que Playwright **n'est pas** dans
  `devDependencies` ; base `origins_test` locale (`arrivees.cjs:9`) ; mode d'emploi : `ETAT_DES_LIEUX.md:86-106`.
- `public/sw.js`, `index.html` (splash), `main.js` : non testés.

## 14. Accessibilité et mobile

**Mouvement réduit**
- CSS global : animations et transitions à 0,01 ms (`styles/base/motion.css:8-14`) ; 27 fichiers citent
  `prefers-reduced-motion`.
- JS : `reducedMotion()` (`utils/fx.js:6`) ; l'île n'anime plus (pas de RAF, `t = 0`, `loop.js:30,85`) et ne
  redessine qu'à la demande ; le Livre glisse sans courbure ; fond vivant ralenti (`livingBackground.js:71`) ;
  splash figé (`index.html:50-53`).

**Tactile**
- Glisser-déposer au doigt : `mobile-drag-drop` (`main.js:29-34`), utilisé par `TrialInventory.vue:35-36` →
  `CraftZone.vue:7-9`.
- Appui long : directive `v-longpress` (450 ms, seuil 10 px, `longpress.js:4-5`).
- Pas de sélection de texte ni de surlignage au toucher, sauf champs (`styles/base/reset.css:21-31`).
- Vibrations seulement après un geste (`utils/fx.js:18-24`).

**Écran** : zoom de page autorisé (pas de `user-scalable=no`, `index.html:5`) ; zones sûres
`env(safe-area-inset-*)` (`tokens/layout.css:6`, `base/responsive.css:10`) ; panneaux fixés mesurés par
`ResizeObserver` (`App.vue:463`, `:488-501`).

**ARIA vérifié**
- `lang="fr"` ; splash et toasts `role="status"` + `aria-live` (`index.html:57`, `notificationService.js:19-20`).
- Canvas de l'île `role="img"` + `aria-label` calculé (`WorldView.vue:34-35`, `:608-614`).
- `GModal` : `role="dialog"`, Échap, focus gardé puis rendu (`GModal.vue:8,13,35,54-60`) ; TabBar `aria-current`
  et onglets fermés `disabled` + libellé (`TabBar.vue:9-11`).

## 15. Dette technique et points d'attention (vérifiés)

| Point | Preuve | Effet |
|---|---|---|
| `app.config.silent` (option Vue 2) + `errorHandler/warnHandler = null` | `main.js:39-43` | `silent` sans effet en Vue 3 |
| `drop: ['console']` au build | `vite.config.mjs:38` | appliqué au minifieur, donc à tous les chunks, Vue compris (`resolveEsbuildTranspileOptions`, `node_modules/vite`) : aucune trace d'erreur en prod, aucune télémétrie |
| Glob des créatures cassé | `CraftZone.vue:102-104` | `../../assets` depuis `components/Craft/CraftZone/` vise `src/components/assets` (absent) : `creatureImage` rend toujours `null` depuis la refonte 4a (#173, `5c12eb4f`) ; 36 PNG (8,8 Mo) inutilisés |
| `API_URL` en double | `main.js:61` vs `config.js:4` | export de `main.js` lu par personne |
| `WorldView.vue` 1035 lignes, 12 mixins + 3 objets de méthodes | `WorldView.vue:500`, `:1015-1019` | un seul `this` partagé par ~20 fichiers (hypothèse : risque de collision de noms) |
| `jsconfig.json` hérité de vue-cli | `target: es5`, `lib: scripthost` | sans effet sur Vite ; trompeur |
| Commentaire Vitest périmé | `vitest.config.mjs:4` « (src/utils) » | les tests couvrent bien plus |
| `srvprof.cjs` chemins en dur | `outils/banc/srvprof.cjs:3-4` (`/home/user/og-create-backend`) | ne marche pas sur cette machine |
| `outils/` hors lint | `package.json:9` | scripts non vérifiés |
| Clé `oc_book_ink` définie deux fois | `BookView.vue:190`, `game/savoirs.js:8` | dérive possible |
| `localStorage` en direct, sans `utils/storage` | `nights.js:16`, `sites.js:21`, `WorldView.vue:944`, `draw/brume.js:87` | conventions mêlées |
| `hash` recopié 3 fois | `scene.js:207`, `sky.js:10`, `village.js:54` | dérive possible |
| Écouteur `touchmove` non passif global | `main.js:34` | (hypothèse) défilement lié au fil principal partout, pour un seul écran de glisser-déposer |
| Chunks à la demande jamais purgés du cache SW | `sw.js:12-14` | (hypothèse) cache qui grossit à chaque version (2 648 chunks SVG possibles) |
| Icônes à nom fixe en cache d'abord | `sw.js:5-8,58` | une icône modifiée n'arrive qu'en renommant `CACHE` |
| Paramètres d'essai actifs en prod | `perf.js:6`, `scene.js:12-23` | `?heure=nuit` etc. accessibles aux joueurs |
| Plage `vue ^3.2.13` | `package.json:15` | résolu 3.5.43 : plage bien plus large que testée |

## 16. Risques pour un objectif mobile « AAA »

- **Poids** : `WorldView` 364 Ko + `index` 268 Ko gzip à parser avant l'île (mesuré) ; 1,2 Mo de JSON statiques
  (§ 10) ; `index` tire des modules de l'île (hypothèse, § 12).
- **Coût de dessin** : chaque image redessine toute la scène ; tableau `standing` reconstruit et trié
  (`loop.js:226-247`), `Map` des chantiers recréée (`:126-129`) à chaque image, en lisant le `state` réactif de Vue
  (aucun `markRaw`). (hypothèse) pression sur le ramasse-miettes à 30 img/s.
- **Mesure** : `PASSATION.md:555-566` dit qu'aucune mesure sur vrai téléphone n'a été faite (19-37 ms/image en
  simulation ×4, budget 33 ms).
- **Mémoire** : jusqu'à ~64 Mo de sprites (`spriteCache.js:24`) + 24 carrés de sol 512² hors écran (≈ 25 Mo,
  hypothèse) + vue d'ensemble + canvas à dpr 2.

## Écarts avec la documentation existante

| Document | Dit | Code |
|---|---|---|
| `DEPLOY.md:57` | proxy dans `vue.config.js` | `vite.config.mjs:35` (pas de `vue.config.js`) |
| `README.md:23` | `src/game/` = Récolte et ressources | 20 modules (tutoriel, guide, coach, mini-jeux…) ; `src/world/` (84 fichiers) absent du README |
| `README.md:25`, `vitest.config.mjs:4` | tests des fonctions pures (`src/utils`) | tests HTTP/axios, mixin `account.js`, cache de sprites simulé, CSS |
| `PASSATION.md:198`, `:282` | `WorldView.vue` ≈ 896-900 lignes, 9 mixins | 1035 lignes, 12 mixins (`+ nights, coach, roads`) |
| `PASSATION.md:185-188` | 5 mixins d'App | 6 (`update.js`, `App.vue:282`) |
| `PASSATION.md:111-113` | scripts de bout en bout perdus | `outils/banc/` (7 scripts) |
| `PASSATION.md:314` | dessins « générés par le code » | aussi 4 000+ SVG de `design/bibliotheque` (§ 10) |
| `PASSATION.md:162`, `src/styles/README.md:52` | `main.js` n'importe que `styles/index.css` | aussi `mobile-drag-drop/default.css` (`main.js:4`) |
| `ETAT_DES_LIEUX.md:393-399` | les 4 mémoires « toutes à oublier » | `oc_prologue` gardé en partie (`story.js:422-423`) ; 9 autres clés `oc_*` de récit/confort jamais oubliées (§ 5) |
| `HISTOIRE.md:1718` | l'Encre n'est que sur l'appareil | le serveur la renvoie (`pages.js:51`, `playService.ink`) ; `PASSATION.md:604` est à jour |
| `deploy/ovh/nginx/brumelune.eu.conf:53` | code principal ≈ 800 Ko → 200 Ko | `index` 1,24 Mo / 268 Ko gzip (mesuré) |

## Non examiné

- Contenu des 76 composants au-delà de ceux cités (gabarits, CSS, logique propre des fiches et mini-jeux).
- Les mixins de `WorldView` en détail (`folk`, `roads`, `workshop`…) et `world/view/draw/*` hors `loop.js`.
- Les modules de dessin `world/*Sprites.js`, `world/tiers/*` et le générateur `design/bibliotheque/generateur/*.mjs`.
- Le contenu de `dist/` (non construit ici) : répartition réelle des chunks, contenu du chunk `index`.
- Comportement réel à l'exécution (aucun navigateur lancé) : FPS, mémoire, service worker, WebGL.
- Les routes serveur et leurs réponses (contrats d'API), `deploy/ovh/*` hors en-têtes Nginx cités.
- `design/conception/*` lu en survol ; `HISTOIRE.md` cherché par mots-clés seulement.
- Dépendances transitives et audit de sécurité npm.
