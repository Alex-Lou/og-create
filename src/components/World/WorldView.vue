<template>
  <section class="world" aria-label="Le Monde">
    <header class="world__head">
      <div>
        <span class="world__eyebrow">Ton île<span v-if="state" class="world__phase" :title="`Sur ton île, c’est le moment : ${phaseLabel}`"> · {{ phaseGlyph }} {{ phaseLabel }}</span></span>
        <span class="world__title">Le Monde</span>
      </div>
      <!-- Écus produits par l'île, à récolter (le solde reste dans l'en-tête) -->
      <button
        v-if="state && state.pending > 0"
        type="button"
        class="world__coins is-ready"
        :disabled="busy"
        :aria-label="`Récolter ${state.pending} écus`"
        @click="collect"
      >
        <span class="world__coin" aria-hidden="true"></span>+{{ state.pending }}<span class="world__coins-note">à récolter</span>
      </button>
    </header>

    <!-- Invité : l'île demande un compte (ses ressources et écus sont gardés par le serveur) -->
    <div v-if="guest" class="world__guest">
      <p class="world__guest-title">Ton île t’attend.</p>
      <p class="world__guest-text">Crée un compte pour bâtir ton île : chantiers, récoltes et décorations y sont gardés pour toi.</p>
      <button type="button" class="world__btn" @click="$emit('login')">Se connecter · créer un compte</button>
    </div>

    <template v-else>
      <!-- Réserves de l'île et Récolte -->
      <div v-if="state" class="world__hud">
        <ul class="world__stock" aria-label="Réserves">
          <li v-for="r in RESOURCES" :key="r.id" class="world__res" :title="r.label">
            <span aria-hidden="true">{{ r.glyph }}</span><strong>{{ state.stock[r.id] }}</strong><span class="oc-sr-only">{{ r.label }}</span>
          </li>
        </ul>
        <button type="button" class="world__play" :disabled="busy || !state.charges.count" @click="startHarvest">
          <span class="world__play-label">Récolte</span>
          <span class="world__play-sub">{{ chargesText }}</span>
        </button>
      </div>

      <div ref="stage" class="world__stage">
        <canvas
          ref="canvas"
          class="world__canvas"
          role="img"
          :aria-label="canvasLabel"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onCancel"
          @wheel.prevent="onWheel"
        ></canvas>
        <div v-if="state" class="world__zoom">
          <button type="button" aria-label="Zoomer" @click="zoomBy(1.25)">+</button>
          <button type="button" aria-label="Dézoomer" @click="zoomBy(0.8)">−</button>
        </div>
        <p v-if="loadError" class="world__error" role="alert">
          L’île ne répond pas.
          <button type="button" class="world__btn world__btn--small" @click="load">Réessayer</button>
        </p>
        <p v-else-if="moving" class="world__banner" role="status">
          Touche une case libre pour y poser {{ moving }}.
          <button type="button" class="world__link" @click="moving = null">Annuler</button>
        </p>

        <!-- Appui long sur une décoration : déplacer ou retirer -->
        <div v-if="selected && !moving" class="world__menu" :style="menuStyle" role="dialog" :aria-label="`${selected.element}`">
          <span class="world__menu-name">{{ selected.element }}</span>
          <button type="button" class="world__menu-btn" @click="startMove">Déplacer</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="removeSelected">Retirer</button>
        </div>
      </div>

      <p v-if="state" class="world__note">
        Tes bâtiments produisent ressources et écus, la Récolte aussi. Les décorations s’achètent pour embellir l’île.
      </p>
    </template>

    <!-- Fiches de l'île : rendues dans le document (au-dessus de la barre d'onglets) -->
    <teleport to="body">
      <!-- Fiche d'un bâtiment : aperçu (production, récolte) et évolution (tous les paliers) -->
      <transition name="world-sheet">
        <div v-if="site" class="world__sheet-backdrop" @click.self="site = null">
          <div class="world__sheet world__sheet--site" role="dialog" :aria-label="site.name">
            <div class="world__site-head">
              <img class="world__site-art" :src="artOf(site)" alt="" />
              <div class="world__site-id">
                <span class="world__eyebrow">{{ zoneName(site.zone) }}</span>
                <span class="world__sheet-title">{{ site.level ? site.name : `${site.name} · à bâtir` }}</span>
                <span class="world__pips" :aria-label="`Niveau ${site.level} sur ${site.maxLevel}`">
                  <span v-for="k in site.maxLevel" :key="k" :class="['world__pip', { 'is-on': k <= site.level }]"></span>
                </span>
              </div>
              <button type="button" class="world__link" @click="site = null">Fermer</button>
            </div>
            <div class="world__tabs" role="tablist">
              <button type="button" role="tab" :aria-selected="String(siteTab === 'overview')" :class="['world__tab', { 'is-on': siteTab === 'overview' }]" @click="siteTab = 'overview'">Aperçu</button>
              <button type="button" role="tab" :aria-selected="String(siteTab === 'evolution')" :class="['world__tab', { 'is-on': siteTab === 'evolution' }]" @click="siteTab = 'evolution'">
                Évolution<span v-if="canBuild(site)" class="world__tab-dot" aria-label="prête"></span>
              </button>
              <button v-if="site.shop && site.shop.length" type="button" role="tab" :aria-selected="String(siteTab === 'shop')" :class="['world__tab', { 'is-on': siteTab === 'shop' }]" @click="siteTab = 'shop'">Boutique</button>
            </div>

            <div v-if="siteTab === 'overview'" class="world__panel">
              <p v-if="site.effect" class="world__site-effect">{{ site.effect }}</p>
              <p v-else class="world__site-effect">{{ site.levels[0].effect }}</p>
              <div v-if="site.produce && site.level" class="world__prod">
                <div class="world__prod-row">
                  <span>Par heure</span>
                  <strong>+{{ num(perHourOf(site).amount) }} {{ GLYPH[site.produce] }} · +{{ num(perHourOf(site).coins) }} écus</strong>
                </div>
                <div v-if="site.bonus" class="world__prod-row">
                  <span>Bonus de la boutique</span>
                  <strong>+{{ site.bonus }} % de production</strong>
                </div>
                <div class="world__prod-row">
                  <span>Réserve</span>
                  <strong>{{ state.capHours }} h de production au plus</strong>
                </div>
                <div class="world__prod-row is-pending">
                  <span>À récolter</span>
                  <strong>+{{ site.pending ? site.pending[site.produce] : 0 }} {{ GLYPH[site.produce] }} · +{{ site.pending ? site.pending.coins : 0 }} écus</strong>
                </div>
                <button type="button" class="world__btn" :disabled="busy || !state.pending" @click="collect">Récolter l’île</button>
              </div>
              <div v-else-if="!site.level" class="world__sheet-actions">
                <button type="button" class="world__btn" @click="siteTab = 'evolution'">Voir ce qu’il faut pour bâtir</button>
              </div>
            </div>

            <!-- Boutique : outils et objets (effets), pièces rares, skins et teintes (apparence), rangés par palier ; un toucher
                 sur le prix achète (annulable 4 s), un toucher sur le dessin ou un appui long sur le prix ouvre la fiche -->
            <div v-else-if="siteTab === 'shop'" class="world__panel">
              <p v-if="!site.level" class="world__site-effect">Bâtis d’abord ce bâtiment pour ouvrir sa boutique.</p>
              <p v-else-if="site.produce" class="world__shop-note">
                Bonus de production : <strong>+{{ site.bonus || 0 }} %</strong> <span>(jusqu’à +100 %)</span>
              </p>
              <section v-for="group in shopGroups(site)" :key="group.kind" class="world__shop-group" :aria-label="group.label">
                <h3 class="world__shop-title">{{ group.label }}</h3>
                <ul class="world__cards">
                  <li
                    v-for="item in group.items"
                    :key="item.id"
                    :class="['world__card', { 'is-owned': item.owned, 'is-worn': site.skin === item.id, 'is-locked': !item.owned && site.level < item.minLevel, 'is-rare': item.rare }]"
                  >
                    <button type="button" class="world__card-open" :aria-label="`Fiche : ${item.name}`" @click="describeItem(site, item)">
                      <span class="world__card-art">
                        <img :src="itemArt(site, item)" alt="" />
                        <span v-if="item.rare" class="world__card-palier world__card-palier--rare">Rare</span>
                        <span v-else class="world__card-palier" :aria-label="`Palier ${roman(item.minLevel)}`">{{ roman(item.minLevel) }}</span>
                        <span v-if="site.skin === item.id" class="world__card-badge">Porté</span>
                        <span v-else-if="item.owned && item.kind !== 'skin'" class="world__card-badge">✓</span>
                      </span>
                      <span class="world__card-name">{{ item.name }}</span>
                    </button>
                    <span class="world__card-effect">{{ itemNote(site, item) }}</span>
                    <button
                      v-if="!item.owned"
                      v-longpress="() => describeItem(site, item)"
                      type="button"
                      class="world__card-btn"
                      :disabled="busy || !canBuy(site, item)"
                      :aria-label="buyLabel(site, item)"
                      @click="buyItem(site, item, $event)"
                    >
                      <template v-if="lockOf(site, item)">{{ lockOf(site, item) }}</template>
                      <template v-else>{{ item.price }}<span class="world__coin world__coin--small" aria-hidden="true"></span></template>
                    </button>
                    <button v-else-if="item.kind === 'skin' && site.skin !== item.id" type="button" class="world__card-btn world__card-btn--quiet" :disabled="busy" @click="wearSkin(site, item.id)">Porter</button>
                    <button v-else-if="item.kind === 'skin'" type="button" class="world__card-btn world__card-btn--quiet" :disabled="busy" @click="wearSkin(site, '')">Ôter</button>
                    <span v-else class="world__card-owned">Sur ton île</span>
                  </li>
                </ul>
              </section>
              <transition name="world-undo">
                <div v-if="undoable" class="world__undo" role="status">
                  <span>{{ undoable.name }} : acheté</span>
                  <button type="button" class="world__undo-btn" :disabled="busy" @click="undoItem">Annuler</button>
                </div>
              </transition>
            </div>

            <ol v-else class="world__steps">
              <li v-for="(step, i) in site.levels" :key="step.name" :class="['world__step', `is-${stepState(site, i)}`]">
                <span class="world__step-mark" aria-hidden="true">{{ stepState(site, i) === 'done' ? '✓' : i + 1 }}</span>
                <div class="world__step-body">
                  <span class="world__step-name">{{ step.name }}</span>
                  <span class="world__step-effect">{{ step.effect }}</span>
                  <ul v-if="stepState(site, i) !== 'done'" class="world__needs">
                    <li v-if="step.chapter" :class="['world__need', step.chapterOpen ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true">📖</span>
                      <span>Chapitre <strong>{{ step.chapter }}</strong> du Livre</span>
                      <em>{{ step.chapterOpen ? 'ouvert' : 'encore scellé' }}</em>
                    </li>
                    <li v-if="step.plan" :class="['world__need', step.planOwned ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true"><ElementGlyph :glyph="step.planEmoji || '📜'" /></span>
                      <span>Plan : <strong>{{ step.plan }}</strong></span>
                      <em>{{ step.planOwned ? 'trouvé' : 'à découvrir dans le Livre' }}</em>
                    </li>
                    <li v-for="(n, r) in step.cost" :key="r" :class="['world__need', state.stock[r] >= n ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true">{{ GLYPH[r] }}</span>
                      <span><strong>{{ state.stock[r] }}</strong> / {{ n }} {{ LABEL[r] }}</span>
                    </li>
                    <li v-if="step.coins" :class="['world__need', coinsOk(step.coins) ? 'is-ok' : 'is-missing']">
                      <span class="world__need-glyph" aria-hidden="true">🪙</span>
                      <span><strong>{{ step.coins }}</strong> écus</span>
                      <em v-if="!coinsOk(step.coins)">il en manque {{ step.coins - coins }}</em>
                    </li>
                  </ul>
                  <div v-if="stepState(site, i) === 'next'" class="world__sheet-actions">
                    <button type="button" class="world__btn" :disabled="!canBuild(site) || busy" @click="build(site)">
                      {{ site.level ? `Faire évoluer : ${step.name}` : `Bâtir : ${step.name}` }}
                    </button>
                    <button v-if="!affordable(site) && state.charges.count" type="button" class="world__btn world__btn--quiet" :disabled="busy" @click="startHarvest">
                      Jouer une Récolte
                    </button>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </transition>

      <!-- Quartier à acheter : prix en écus et chapitre du Livre -->
      <!-- Brume : sa réplique, la quête active, son avancée, sa récompense -->
      <transition name="world-sheet">
        <div v-if="questOpen && state && state.brume" class="world__sheet-backdrop" @click.self="questOpen = false">
          <div class="world__sheet" role="dialog" aria-label="Brume, l’esprit de la brume">
            <div class="world__sheet-head">
              <span class="world__sheet-title world__brume-title"><BrumeWisp :size="30" :ready="Boolean(quest && quest.done)" /> Brume</span>
              <button type="button" class="world__link" @click="questOpen = false">Fermer</button>
            </div>
            <template v-if="quest">
              <span class="world__eyebrow world__quest-eyebrow">Acte {{ quest.act }} · quête {{ quest.step }} sur {{ quest.total }}</span>
              <p class="world__brume-say">« {{ quest.say }} »</p>
              <div class="world__quest">
                <span class="world__quest-label">{{ quest.label }}</span>
                <span class="world__quest-count">{{ quest.have }}/{{ quest.need }}</span>
                <span class="world__quest-bar" role="progressbar" :aria-valuenow="quest.have" aria-valuemin="0" :aria-valuemax="quest.need">
                  <i :style="{ width: `${(100 * quest.have) / quest.need}%` }"></i>
                </span>
                <span class="world__quest-reward">Récompense : <strong>{{ quest.coins }} écus</strong></span>
              </div>
              <div class="world__sheet-actions">
                <button v-if="quest.done" type="button" class="world__btn" :disabled="busy" @click="claimQuest">Réclamer · {{ quest.coins }} écus</button>
                <button v-else-if="quest.target" type="button" class="world__btn" @click="showQuestTarget">Montrer</button>
                <button v-else-if="quest.kind === 'runs'" type="button" class="world__btn" :disabled="busy || !state.charges.count" @click="questHarvest">
                  {{ state.charges.count ? 'Lancer une Récolte' : `Récolte : ${chargesText}` }}
                </button>
              </div>
            </template>
            <p v-else class="world__brume-say">« {{ state.brume.rested }} »</p>
          </div>
        </div>
      </transition>
      <transition name="world-sheet">
        <div v-if="zone" class="world__sheet-backdrop" @click.self="zone = null">
          <div class="world__sheet" role="dialog" :aria-label="zone.name">
            <div class="world__sheet-head">
              <span class="world__sheet-title">🗺️ {{ zone.name }}</span>
              <button type="button" class="world__link" @click="zone = null">Fermer</button>
            </div>
            <p class="world__site-effect">
              Agrandis ton île<template v-if="sitesIn(zone).length"> : ce quartier abrite {{ sitesIn(zone).join(', ') }}</template>, et de la place pour décorer.
            </p>
            <ul class="world__needs">
              <li v-if="zone.chapter" :class="['world__need', zone.open ? 'is-ok' : 'is-missing']">
                <span class="world__need-glyph" aria-hidden="true">📖</span>
                <span>Chapitre <strong>{{ zone.chapter }}</strong> du Livre</span>
                <em>{{ zone.open ? 'ouvert' : 'encore scellé' }}</em>
              </li>
              <li class="world__need">
                <span class="world__need-glyph" aria-hidden="true">🪙</span>
                <span><strong>{{ zone.price }}</strong> écus</span>
              </li>
            </ul>
            <div class="world__sheet-actions">
              <button type="button" class="world__btn" :disabled="!zone.open || busy" @click="buyZone(zone)">Acheter · {{ zone.price }} écus</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Choix de la décoration à poser -->
      <transition name="world-sheet">
        <div v-if="picking" class="world__sheet-backdrop" @click.self="picking = null">
          <div class="world__sheet" role="dialog" aria-label="Choisir une décoration">
            <div class="world__sheet-head">
              <span class="world__sheet-title">Décorer</span>
              <button type="button" class="world__link" @click="picking = null">Fermer</button>
            </div>
            <p class="world__pick-note">Une décoration s’achète une fois ; son prix dépend du chapitre de l’élément. La déplacer ensuite est gratuit.</p>
            <input v-model="query" class="world__search" type="search" :placeholder="`Chercher parmi ${available.length}…`" aria-label="Chercher un élément" />
            <div class="world__grid">
              <ElementTile
                v-for="name in pickList"
                :key="name"
                :name="name"
                :glyph="elementEmojis[name]"
                :family="familyOf[name]"
                :price="decoPriceOf(name)"
                :aria-label="`Poser ${name}${decoPriceOf(name) ? ` pour ${decoPriceOf(name)} écus` : ''}`"
                @click="place(name, picking.x, picking.y)"
              />
              <p v-if="!pickList.length" class="world__empty">{{ available.length ? 'Aucun élément ne ressemble à cette recherche.' : 'Toutes tes découvertes sont déjà sur l’île.' }}</p>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <ShopItemSheet
      v-if="sheetItem"
      :site="site"
      :item="sheetItem"
      :art="itemArt(site, sheetItem)"
      :lock="lockOf(site, sheetItem)"
      :busy="busy"
      :max-moves="state.harvest.maxMoves"
      :max-charges="state.charges.max"
      @buy="buyFromSheet"
      @wear="skin => wearSkin(site, skin)"
      @close="sheetId = null"
    />

    <HarvestGame
      v-if="run"
      :run="run"
      :sending="sending"
      :result="runResult"
      :error="runError"
      @finish="finishHarvest"
      @close="closeHarvest"
    />
  </section>
</template>

<script>
import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import ElementGlyph from '@/components/ui/ElementGlyph.vue';
import ElementTile from '@/components/ui/ElementTile.vue';
import BrumeWisp from '@/components/ui/BrumeWisp.vue';
import { familyIndex } from '@/utils/eras';
import HarvestGame from './HarvestGame.vue';
import ShopItemSheet from './ShopItemSheet.vue';
import { search } from '@/utils/search';
import { glyph, clearDrawings } from '@/book/painter';
import { burst, ring, vibrate, center, reducedMotion } from '@/utils/fx';
import { GLYPH, LABEL, RESOURCES } from '@/game/resources';
import { BUILDINGS, NATURE } from '@/world/sprites';
import { lookAt, boatOffset, boatOf, artMake } from '@/world/looks';
import { itemLayers, itemLight, itemThumb } from '@/world/shopSprites';
import { rareLights } from '@/world/rareSprites';
import { tintOf } from '@/world/tints';
import { NATURE2, CRITTERS, PLINTH, SIGN } from '@/world/nature';
import { drawSprite, spriteUrl, clearSprites } from '@/world/spriteCache';
import { islandOf, liveOf, drawLive, drawCell, TerrainCache, HS, SEA_Z, worldOf, lampGlowOf } from '@/world/terrain';
import { FLOATING_ZONE, COLONY_ZONE, isletsOf, ferryPose, drawFloatBelow, drawSpring } from '@/world/islets';
import { ISLET_SPRITES, ISLET_NATURE } from '@/world/isletSprites';
import {
  seaOf, seaGuests, spread, nearestOpen, drawShallows, drawSparkles, drawWaves, drawPlankton, schoolFish, drawSchools, podAt, whaleAt, drawRings,
  drawSpout, jelliesAt, drawJellies, circling, crossing, drawGullShadow, drawFlyingGull, DOLPHIN_EVERY, DOLPHIN_FOR, WHALE_EVERY, WHALE_FOR
} from '@/world/sea';
import { SEA_SPRITES, FISH_SPECIES } from '@/world/seaSprites';
import { drawBrume, floatOf, BRUME_ALT, BRUME_REACH } from '@/world/brume';
import { guide } from '@/game/guide';
import longpress, { HOLD_MS } from '@/directives/longpress';
import { chapterOfFamily } from '@/book/chapters';
import { roman } from '@/utils/roman';
import { P } from '@/world/iso';
import { phaseAt, forcedPhase, drawSea, drawCloudShadows, drawClouds, drawTint, glow, fireflies, hash } from '@/world/scene';

const FRAME_MS = 33; // ~30 images/s : l'île respire, sans user la batterie
const TW = 64; // largeur d'une case à l'échelle 1 (unités du monde)
const TH = TW / 2;
const DEPTH = 30;
const MAX_SCALE = 1.8;
// Ce qui vit à la surface de la mer (posé au niveau de l'eau, jamais caché par la terre : eau libre)
const SEA_KINDS = new Set(['fish', 'dolphin', 'whale', 'fluke', 'spout']);
// Mouettes posées effrayées : envol (s), puis retour
const FLY_OFF = 2.6;
const GULL_BACK = 30;
// Construction ou amélioration : le chantier tremble dans la poussière, puis le bâtiment s'élève (ms)
const RAISE_MS = 2400;
// Achat d'un quartier : la brume se dissipe (ms)
const UNVEIL_MS = 1600;
// Un toucher reste un toucher tant que le doigt bouge de moins de 14 px (au-delà : on fait glisser la carte)
const TAP_SLOP = 14;
// Boutique d'un atelier : rubriques dans l'ordre de la fiche
const SHOP_GROUPS = [['outil', 'Outils'], ['objet', 'Objets'], ['rare', 'Pièces rares'], ['skin', 'Skins'], ['teinte', 'Teintes']];
// Rubrique d'un article : les skins se partagent entre pièces rares, skins dessinés et teintes
const groupOf = item => (item.rare ? 'rare' : item.kind === 'skin' && tintOf(item.id) ? 'teinte' : item.kind);
// Achat en un toucher : « Annuler » reste proposé 4 s (le serveur accepte l'annulation un peu plus longtemps)
const UNDO_MS = 4000;
// Ce qui plie au vent, et de combien
const SWAY = { tree: 0.04, palm: 0.05, bush: 0.03, tuft: 0.09, flowers: 0.06, birch: 0.05, apple: 0.03, autumn: 0.035, reeds: 0.08 };
// Tous les décors naturels (planches 1 et 2), et ce qui pousse où, avec sa fréquence cumulée
const ALL_NATURE = { ...NATURE, ...NATURE2, ...ISLET_NATURE };
const BEACH_MIX = [['palm', 0.1], ['mossy', 0.15], ['shells', 0.2], ['driftwood', 0.23]];
const ROCK_MIX = [['rock', 0.3], ['rocks', 0.55], ['crag', 0.72], ['mossy', 1]];
const GRASS_MIX = [['tuft', 0.1], ['flowers', 0.16], ['bush', 0.185], ['mushrooms', 0.205], ['stump', 0.22], ['birch', 0.235], ['apple', 0.245], ['autumn', 0.255], ['log', 0.265]];
// Forêt : deux arbres par case (sapins en hauteur) ; au bord de l'eau douce, roseaux et nénuphars
const FOREST_LOW = ['tree', 'birch', 'pine', 'autumn'];
const FOREST_HIGH = ['pine', 'pine', 'tree'];
// Vue de l'île gardée d'une visite à l'autre de l'onglet (caméra, fiche ouverte) : la mémoire est libérée à la
// sortie, la progression reste
let lastView = null;

// Le Monde : l'île du joueur en isométrique (Canvas 2D), avec une caméra qu'on fait glisser et zoomer.
// L'état vient du serveur (chantiers, réserves, parties, décorations) ; le dessin, la caméra et la boucle
// d'animation sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.
export default {
  name: 'WorldView',
  components: { ElementGlyph, ElementTile, HarvestGame, ShopItemSheet, BrumeWisp },
  directives: { longpress },
  props: {
    discoveredElements: { type: Array, required: true },
    elementEmojis: { type: Object, required: true },
    isLoggedIn: { type: Boolean, default: false },
    // Familles des éléments connus ({ famille: [noms] }) : teinte des tuiles
    categories: { type: Object, default: () => ({}) },
    // Solde d'écus (en-tête) : grise les articles hors de portée ; le serveur reste seul juge
    coins: { type: Number, default: null }
  },
  emits: ['coins-updated', 'show-alert', 'login'],
  data() {
    return {
      GLYPH, LABEL, RESOURCES,
      state: null,
      guest: false,
      loadError: false,
      busy: false,
      picking: null,
      selected: null,
      moving: null,
      site: null,
      // Onglet de la fiche d'un bâtiment : aperçu ou évolution
      siteTab: 'overview',
      // Quartier dont la fiche d'achat est ouverte
      zone: null,
      // Dernier achat de la boutique, encore annulable : { id, name }
      undoable: null,
      // Article de la boutique dont la fiche est ouverte (id, dans la boutique du bâtiment ouvert)
      sheetId: null,
      query: '',
      menuPos: { x: 0, y: 0 },
      run: null,
      sending: false,
      runResult: null,
      runError: '',
      clock: Date.now(),
      phaseLabel: '',
      phaseGlyph: '',
      // Fiche de Brume (quête active) ouverte
      questOpen: false
    };
  },
  computed: {
    sheetItem() {
      return this.site && this.sheetId ? this.site.shop.find(item => item.id === this.sheetId) || null : null;
    },
    // Quête active de Brume (null : toutes faites)
    quest() {
      return this.state && this.state.brume ? this.state.brume.quest : null;
    },
    familyOf() {
      return familyIndex(this.categories);
    },
    placedNames() {
      return new Set(this.state ? this.state.tiles.map(t => t.element) : []);
    },
    available() {
      return [...this.discoveredElements].reverse().filter(name => !this.placedNames.has(name));
    },
    pickList() {
      return this.query.trim() ? search(this.available, this.query) : this.available;
    },
    menuStyle() {
      return { left: `${this.menuPos.x}px`, top: `${this.menuPos.y}px` };
    },
    chargesText() {
      if (!this.state) return '';
      const { count, max, nextIn } = this.state.charges;
      if (count >= max || nextIn === null) return `${count}/${max} parties`;
      const minutes = Math.max(1, Math.ceil((nextIn - (this.clock - this.loadedAt)) / 60000));
      return `${count}/${max} · +1 dans ${minutes} min`;
    },
    canvasLabel() {
      if (!this.state) return 'Ton île';
      const built = this.state.sites.filter(s => s.level).map(s => s.name);
      const names = this.state.tiles.map(t => t.element);
      return `Ton île : ${built.join(', ')} bâtis${names.length ? ` ; décorations : ${names.join(', ')}` : ''}.`;
    }
  },
  watch: {
    isLoggedIn() {
      this.load();
    },
    // Changer de fiche ou d'onglet retire le bandeau d'annulation
    'site.id'() {
      this.undoable = null;
    },
    siteTab() {
      this.undoable = null;
    }
  },
  created() {
    // Non réactifs : géométrie, caméra, pointeurs, horloge, animations de pose
    this.geo = null;
    this.cam = null;
    this.pointers = new Map();
    this.gesture = null;
    this.raf = 0;
    this.lastFrame = 0;
    this.pops = new Map();
    // Bâtiments en train de s'élever : id → { at, from } ; décor naturel des cases libres
    this.raises = new Map();
    this.props = [];
    // Quartiers qui viennent d'être achetés (brume qui se dissipe), bulles de production et panneaux dessinés (pour le toucher)
    this.unveils = new Map();
    this.bubbles = [];
    this.signs = [];
    this.shore = [];
    // Sol en relief : calques lus (M), carrés d'images (terrain), eau animée (live), cases de chaque quartier
    this.M = null;
    this.terrain = null;
    this.live = null;
    this.zoneTiles = new Map();
    this.mistKey = null;
    // Mer vivante : eaux de l'île (sea), mouettes posées (perches), passages en cours des dauphins et de la baleine,
    // animaux qui ont réagi à un toucher (clé → { at, … }), et ce qu'on peut toucher dans la dernière image
    this.sea = null;
    this.perches = [];
    this.passages = {};
    this.scared = new Map();
    this.seaHits = [];
    // Brume dans la dernière image (pour le toucher) ; appui long en cours sur l'île ; barque du passeur
    this.brumeHit = null;
    this.ferry = null;
    this.holdTimer = 0;
    this.moreRaf = 0;
    this.forced = forcedPhase();
    this.ac = null;
    this.observer = null;
    this.loadedAt = Date.now();
    this.tick = 0;
    // L'île peut quitter l'écran pendant un chargement (changement d'onglet) : la réponse est alors ignorée
    this.gone = false;
  },
  async mounted() {
    this.ac = new AbortController();
    document.addEventListener('visibilitychange', () => this.syncLoop(), { signal: this.ac.signal });
    this.syncPhase();
    this.tick = setInterval(() => {
      this.clock = Date.now();
      this.syncPhase();
      const charges = this.state && this.state.charges;
      if (charges && charges.nextIn !== null && this.clock - this.loadedAt > charges.nextIn + 2000 && !this.busy && !this.run) this.load();
    }, 20000);
    await this.load();
  },
  beforeUnmount() {
    this.gone = true;
    clearTimeout(this.undoTimer);
    clearTimeout(this.holdTimer);
    if (this.ac) this.ac.abort();
    if (this.observer) this.observer.disconnect();
    clearInterval(this.tick);
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.moreRaf);
    this.raf = this.moreRaf = 0;
    // Sortie de l'île : la vue est gardée pour le retour, la mémoire libérée (sol en carrés, images, décor)
    if (this.cam) lastView = { cam: { ...this.cam }, site: this.site ? this.site.id : null, siteTab: this.siteTab };
    if (this.terrain) this.terrain.clear();
    this.terrain = null;
    this.props = [];
    this.live = null;
    clearSprites();
    clearDrawings();
  },
  methods: {
    reduced() {
      return reducedMotion();
    },
    async load() {
      try {
        const state = await playService.world();
        if (this.gone) return;
        this.apply(state);
        this.guest = false;
        this.loadError = false;
        guide.tip('island');
      } catch (error) {
        if (this.gone) return;
        if ([401, 402].includes(error.response?.status)) {
          this.guest = true;
          this.state = null;
          return;
        }
        console.error('Erreur lors du chargement de l’île:', error);
        this.loadError = true;
      }
    },
    apply(state) {
      // Un niveau gagné depuis le dernier état : le bâtiment s'élève sous les yeux du joueur
      if (this.state && !this.reduced()) {
        const before = new Map(this.state.sites.map(site => [site.id, site.level]));
        state.sites.forEach(site => {
          const from = before.get(site.id);
          if (from !== undefined && site.level > from) this.raises.set(site.id, { at: performance.now(), from });
        });
      }
      // Calques du sol ; la brume est peinte dans les carrés du sol : un quartier acheté fait refaire les siens
      const M = islandOf(state.map, state.size, state.map.zones.findIndex(z => z.id === FLOATING_ZONE));
      if (!this.terrain) this.terrain = new TerrainCache(M, (x, y) => this.veilAt(x, y));
      this.M = M;
      this.live = liveOf(M);
      // Îlots des chapitres VI et VII : île flottante, colonie de mouettes, barque du passeur, lanternes du pont
      this.islets = isletsOf(M, (x, y) => (state.map.zones[M.zone(x, y)] || {}).id);
      if (!this.sea) this.sea = seaOf(M);
      this.zoneTiles = new Map();
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          const zone = state.map.zones[M.zone(x, y)];
          if (zone) this.zoneTiles.set(zone.id, [...(this.zoneTiles.get(zone.id) || []), [x, y]]);
        }
      }
      // Retour sur l'île : la fiche qui était ouverte se rouvre
      if (!this.state && lastView && lastView.site) {
        this.site = state.sites.find(s => s.id === lastView.site) || null;
        this.siteTab = lastView.siteTab || 'overview';
      }
      this.props = this.natureOf(state);
      this.perches = this.perchesOf(state);
      this.shore = this.shoreOf(state);
      this.state = state;
      const mistKey = state.map.zones.filter(z => z.owned).map(z => z.id).join();
      if (this.mistKey !== null && mistKey !== this.mistKey) {
        const before = new Set(this.mistKey.split(',')), after = new Set(mistKey.split(','));
        const changed = [...new Set([...before, ...after])].filter(id => before.has(id) !== after.has(id));
        this.terrain.invalidate(changed.flatMap(id => this.zoneTiles.get(id) || []));
      }
      this.mistKey = mistKey;
      this.loadedAt = Date.now();
      this.clock = this.loadedAt;
      if (this.site) this.site = state.sites.find(s => s.id === this.site.id) || null;
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
        this.syncLoop();
      });
    },
    syncPhase() {
      const phase = phaseAt(this.forced || new Date());
      this.phaseLabel = phase.label;
      this.phaseGlyph = phase.glyph;
    },
    // Décor naturel, fixe pour une île donnée, selon le sol : arbres des forêts, arbres isolés, rochers, touffes des
    // dunes ; roseaux et nénuphars au bord de l'eau douce ; palmiers et coquillages sur le sable, touffes et fleurs
    // dans l'herbe libre. Une décoration posée le remplace, et il ne gêne aucun toucher.
    natureOf(state) {
      const n = state.size;
      const M = this.M;
      const taken = new Set(state.tiles.map(t => t.y * n + t.x));
      state.sites.forEach(site => {
        for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) taken.add((site.y + dy) * n + site.x + dx);
      });
      const props = [];
      const add = (kind, x, y, dx = 0, dy = 0) => {
        const c = this.world(x + dx, y + dy);
        props.push({ kind, x, y, dx, dy, depth: x + y + (dx + dy) * 0.5, wx: c.x, wy: c.y - this.liftAt(x, y) });
      };
      const wet = (x, y) => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => M.ground(x + a, y + b) === 'w');
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          if (taken.has(y * n + x)) continue;
          const g = M.ground(x, y);
          const roll = hash(x, y);
          if (g === 'f') {
            const kinds = M.height(x, y) >= 2 ? FOREST_HIGH : FOREST_LOW;
            add(kinds[Math.floor(roll * kinds.length)], x, y, -0.2, -0.16);
            add(kinds[Math.floor(hash(y, x) * kinds.length)], x, y, 0.18, 0.22);
          } else if (g === 't') add(roll < 0.55 ? 'tree' : roll < 0.8 ? 'apple' : 'birch', x, y);
          else if (g === 'r') add(ROCK_MIX.find(([, upTo]) => roll < upTo)[0], x, y);
          else if (g === 'd') add('tuft', x, y);
          else if ((g === 'g' || g === 'm') && wet(x, y) && roll < 0.45) add(roll < 0.3 ? 'reeds' : 'lily', x, y);
          else if (g === 's' || g === 'g' || g === 'm') {
            const kind = ((g === 's' ? BEACH_MIX : GRASS_MIX).find(([, upTo]) => roll < upTo) || [null])[0];
            if (kind) add(kind, x, y);
          }
        }
      }
      // Îlot aux Mouettes acheté : les nids de la colonie, sur l'herbe libre
      if (this.owns(state, COLONY_ZONE)) {
        const free = this.islets.colony.filter(c => M.ground(c.x, c.y) === 'g' && !taken.has(c.y * n + c.x) && !props.some(p => p.x === c.x && p.y === c.y));
        spread(free, 2, 3).forEach(c => add('nest', c.x, c.y, 0.08, -0.06));
      }
      return props;
    },
    owns(state, zoneId) {
      return Boolean(state.map.zones.find(z => z.id === zoneId && z.owned));
    },
    /* ---------- Carte : terre, plage, quartiers ---------- */
    // Case de terre (calques du serveur : sol, relief, quartier)
    landAt(x, y) {
      return Boolean(this.M) && this.M.land(x, y);
    },
    zoneAt(x, y) {
      return this.M && this.state ? this.state.map.zones[this.M.zone(x, y)] || null : null;
    },
    // Voile de brume d'une case (quartier à acheter), peint dans les carrés du sol
    veilAt(x, y) {
      const zone = this.state && this.state.map.zones[this.M.zone(x, y)];
      return zone && !zone.owned ? 0.62 : 0;
    },
    // Hauteur (unités du monde) du sol d'une case : ce qui s'y tient debout est remonté d'autant
    liftAt(x, y) {
      return this.M ? Math.max(0, this.M.surface(Math.round(x), Math.round(y))) * HS : 0;
    },
    // Point du monde au sol d'une case (ou d'un point fractionnaire), relief compris
    ground(x, y) {
      const c = this.world(x, y);
      c.y -= this.liftAt(x, y);
      return c;
    },
    lockedAt(x, y) {
      const zone = this.zoneAt(x, y);
      return Boolean(zone && !zone.owned);
    },
    // Opacité de la brume d'un quartier : pleine s'il est à acheter, qui s'efface juste après l'achat
    mistOf(zone, now) {
      if (!zone) return 0;
      if (!zone.owned) return 1;
      const start = this.unveils.get(zone.id);
      if (start === undefined) return 0;
      const k = (now - start) / UNVEIL_MS;
      if (k >= 1) {
        this.unveils.delete(zone.id);
        return 0;
      }
      return 1 - k;
    },
    // Cases de mer au bord de la terre (devant elle) : le poisson saute là
    shoreOf(state) {
      const out = [];
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          if (this.M.ground(x, y) === '~' && [[1, 0], [0, 1]].some(([dx, dy]) => this.landAt(x - dx, y - dy))) out.push({ x, y });
        }
      }
      return out;
    },
    // Place du panneau d'un quartier : choisie par le serveur (sol libre, au bord d'un chemin, près du centre)
    signPlaceOf(zone) {
      return zone.anchor || null;
    },
    decoPriceOf(name) {
      const prices = this.state && this.state.decoPrices;
      return prices ? prices[chapterOfFamily(this.familyOf[name])] ?? null : null;
    },
    // Chantier : 0 = plan à trouver, 1 = plan trouvé, 2 = tout est prêt
    stageOf(site) {
      if (!site.next || !site.next.planOwned) return 0;
      return this.affordable(site) ? 2 : 1;
    },
    // Vent : rafales lentes et frémissement, différents d'un point à l'autre de l'île
    windAt(t, x) {
      const gust = 0.55 + 0.45 * Math.sin(t * 0.21);
      return (Math.sin(t * 1.1 + x * 0.35) * 0.65 + Math.sin(t * 2.6 + x) * 0.25) * gust;
    },
    // Dessine un sprite ancré en (x, y) du monde, plié par le vent (cisaillement depuis sa base)
    swayed(ctx, key, make, x, y, skew, repaint) {
      if (!skew) {
        drawSprite(ctx, key, make, x, y, repaint);
        return;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.transform(1, 0, -skew, 1, 0, 0);
      drawSprite(ctx, key, make, 0, 0, repaint);
      ctx.restore();
    },
    // Bouffées de poussière autour d'une emprise de chantier, k de 0 à 1 ; span : demi-largeur de l'emprise en cases
    dust(ctx, x, y, k, count = 9, span = 1) {
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2 + hash(i, 3);
        const d = TW * (0.45 + 0.5 * k) * span;
        const px = x + Math.cos(a) * d;
        const py = y + Math.sin(a) * d * 0.5 - k * 14;
        const r = 7 + k * 16 * (0.6 + hash(i, 9));
        ctx.fillStyle = `rgba(214,190,150,${(0.55 * (1 - k)).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fill();
      }
    },
    // Ressources du palier suivant réunies
    affordable(site) {
      return Boolean(site.next) && Object.entries(site.next.cost).every(([r, n]) => this.state.stock[r] >= n);
    },
    // Écus suffisants (solde inconnu : le serveur tranchera)
    coinsOk(price) {
      return !price || this.coins === null || this.coins >= price;
    },
    canBuild(site) {
      const next = site.next;
      return Boolean(next) && next.planOwned && next.chapterOpen !== false && this.affordable(site) && this.coinsOk(next.coins);
    },

    /* ---------- Géométrie et caméra ---------- */
    setup() {
      const stage = this.$refs.stage;
      const canvas = this.$refs.canvas;
      if (!stage || !canvas || !this.state) return;
      if (!this.observer) {
        this.observer = new ResizeObserver(() => {
          this.setup();
          this.draw(performance.now());
        });
        this.observer.observe(stage);
      }
      const width = stage.clientWidth;
      const height = Math.round(Math.min(Math.max(width * 1.1, 360), window.innerHeight * 0.62, 640));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      const n = this.state.size;
      const fit = Math.min(width / (n * TW + TW), height / (n * TH + DEPTH + 3 * HS + TW * 1.6));
      this.geo = { width, height, dpr, n, minScale: Math.min(fit, 1) };
      // Première vue : celle qu'on avait en quittant l'île, sinon le Foyer au centre, à taille confortable pour le pouce
      if (!this.cam && lastView) this.cam = { ...lastView.cam };
      if (!this.cam) {
        const foyer = this.state.sites.find(s => s.id === 'foyer');
        const c = foyer ? this.centerOf(foyer) : this.world(n / 2, n / 2);
        this.cam = { s: Math.max(this.geo.minScale, Math.min(1, width / (TW * 6.5))), x: c.x, y: c.y };
      }
      this.clampCam();
    },
    // Centre d'une case (ou d'un point fractionnaire) dans le monde
    world(x, y) {
      return { x: ((x - y) * TW) / 2, y: ((x + y) * TH) / 2 };
    },
    toScreen(wx, wy) {
      const { s, x, y } = this.cam;
      return { x: (wx - x) * s + this.geo.width / 2, y: (wy - y) * s + this.geo.height / 2 };
    },
    toWorld(px, py) {
      const { s, x, y } = this.cam;
      return { x: (px - this.geo.width / 2) / s + x, y: (py - this.geo.height / 2) / s + y };
    },
    // Case sous un point de l'écran : la plus en avant dont le dessus (relevé par le relief) contient le point ;
    // à défaut, la case à plat (la mer)
    tileAt(px, py) {
      const w = this.toWorld(px, py);
      const a = w.x / (TW / 2);
      const b = w.y / (TH / 2);
      const x0 = Math.round((a + b) / 2);
      const y0 = Math.round((b - a) / 2);
      const n = this.state.size;
      let best = null;
      for (let y = y0 - 1; y <= y0 + 5; y++) {
        for (let x = x0 - 1; x <= x0 + 5; x++) {
          if (!this.landAt(x, y)) continue;
          const c = this.ground(x, y);
          if (Math.abs(w.x - c.x) / (TW / 2) + Math.abs(w.y - c.y) / (TH / 2) > 1) continue;
          if (!best || x + y > best.x + best.y) best = { x, y };
        }
      }
      if (best) return best;
      return x0 >= 0 && y0 >= 0 && x0 < n && y0 < n ? { x: x0, y: y0 } : null;
    },
    clampCam() {
      const n = this.state.size;
      const cam = this.cam;
      cam.s = Math.max(this.geo.minScale, Math.min(MAX_SCALE, cam.s));
      cam.x = Math.max(-(n * TW) / 2, Math.min((n * TW) / 2, cam.x));
      cam.y = Math.max(0, Math.min(n * TH, cam.y));
    },
    // Zoom autour d'un point de l'écran (le point du monde sous le doigt ne bouge pas)
    zoomAt(px, py, factor) {
      const before = this.toWorld(px, py);
      this.cam.s *= factor;
      this.clampCam();
      const after = this.toWorld(px, py);
      this.cam.x += before.x - after.x;
      this.cam.y += before.y - after.y;
      this.clampCam();
      this.draw(performance.now());
    },
    zoomBy(factor) {
      if (this.geo) this.zoomAt(this.geo.width / 2, this.geo.height / 2, factor);
    },

    /* ---------- Boucle et dessin ---------- */
    syncLoop() {
      const run = !document.hidden && !this.reduced() && this.state && !this.guest && !this.run;
      if (run && !this.raf) this.raf = requestAnimationFrame(this.frame);
      if (!run && this.raf) {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
      }
    },
    frame(now) {
      this.raf = 0;
      if (now - this.lastFrame >= FRAME_MS) {
        this.lastFrame = now;
        this.draw(now);
      }
      this.syncLoop();
    },
    diamond(ctx, cx, cy, w, h) {
      ctx.beginPath();
      ctx.moveTo(cx, cy - h / 2);
      ctx.lineTo(cx + w / 2, cy);
      ctx.lineTo(cx, cy + h / 2);
      ctx.lineTo(cx - w / 2, cy);
      ctx.closePath();
    },
    draw(now) {
      const canvas = this.$refs.canvas;
      if (!canvas || !this.geo || !this.state || !this.cam) return;
      const ctx = canvas.getContext('2d');
      const { width, height, dpr, n } = this.geo;
      const { s } = this.cam;
      const t = this.reduced() ? 0 : now / 1000;
      const phase = phaseAt(this.forced || new Date());
      // Mer, selon l'heure
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawSea(ctx, width, height, t, phase);
      // Monde : unités du monde, caméra appliquée
      const o = this.toScreen(0, 0);
      ctx.setTransform(dpr * s, 0, 0, dpr * s, dpr * o.x, dpr * o.y);
      // Monde visible : seuls les carrés de sol et ce qui s'y tient, à l'écran, sont dessinés
      const tl = this.toWorld(0, 0);
      const br = this.toWorld(width, height);
      const view = { x: tl.x, y: tl.y, w: br.x - tl.x, h: br.y - tl.y };
      // Sous le sol : reflets, vagues qui arrivent derrière l'île, bancs de poissons, puis les eaux peu profondes par-dessus
      // (la terre les recouvre)
      drawSparkles(ctx, view, t, phase.night, s);
      drawWaves(ctx, this.live.back, view, t, false);
      drawSchools(ctx, schoolFish(this.sea.schools, t), view, phase.night);
      drawShallows(ctx, this.sea.shallow, view, phase.night);
      drawFloatBelow(ctx, this.islets.float, view, t, phase.night);
      // Sol en relief, en carrés gardés en images (les nouveaux dans un budget de 8 ms) ; puis l'eau douce qui bouge,
      // les vagues et l'écume devant l'île, les ronds dans l'eau des dauphins et de la baleine
      const missing = this.terrain.draw(ctx, view, s * dpr, 8);
      drawLive(ctx, this.M, this.live, view, t);
      if (this.owns(this.state, FLOATING_ZONE)) drawSpring(ctx, this.islets.spring, view, t);
      drawWaves(ctx, this.live.shore, view, t, true);
      const life = this.seaLife(t, view, phase);
      drawRings(ctx, life.rings);
      // Sol des chantiers : terre battue (bâti) ou chantier ; cases libres pendant un déplacement ; case choisie
      const plots = new Map();
      for (const site of this.state.sites) {
        for (let dy = 0; dy < site.h; dy++) for (let dx = 0; dx < site.w; dx++) plots.set((site.y + dy) * n + site.x + dx, site);
      }
      for (const [k, plot] of plots) {
        const x = k % n, y = Math.floor(k / n);
        const c = this.ground(x, y);
        const shade = (x + y) % 2;
        this.diamond(ctx, c.x, c.y, TW, TH);
        ctx.fillStyle = plot.level ? (shade ? '#D9C49A' : '#E0CCA4') : (shade ? '#B89468' : '#C09C70');
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, .16)';
        ctx.lineWidth = 1 / s;
        ctx.stroke();
      }
      if (this.moving) {
        const occupied = new Set(this.state.tiles.map(tile => tile.y * n + tile.x));
        ctx.setLineDash([4 / s, 3 / s]);
        ctx.strokeStyle = 'rgba(255, 250, 220, .9)';
        ctx.lineWidth = 1.5 / s;
        for (let y = 0; y < n; y++) {
          for (let x = 0; x < n; x++) {
            if (plots.has(y * n + x) || occupied.has(y * n + x) || !'gsm'.includes(this.M.ground(x, y)) || this.lockedAt(x, y)) continue;
            const c = this.ground(x, y);
            if (c.x < view.x - TW || c.x > view.x + view.w + TW || c.y < view.y - TW || c.y > view.y + view.h + TW) continue;
            this.diamond(ctx, c.x, c.y, TW, TH);
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);
      }
      for (const cell of [this.selected, this.picking]) {
        if (!cell) continue;
        const c = this.ground(cell.x, cell.y);
        this.diamond(ctx, c.x, c.y, TW, TH);
        ctx.strokeStyle = '#F2C04B';
        ctx.lineWidth = 2.5 / s;
        ctx.stroke();
      }
      // Contour des chantiers : pointillés à bâtir, doré quand tout est prêt
      for (const site of this.state.sites) {
        if (site.locked) continue;
        const c = this.centerOf(site);
        this.diamond(ctx, c.x, c.y, TW * site.w, TH * site.h);
        const ready = this.canBuild(site);
        if (ready || !site.level) {
          ctx.setLineDash(ready ? [] : [6, 5]);
          ctx.strokeStyle = ready ? `rgba(245, 195, 68, ${0.6 + 0.4 * Math.sin(t * 3)})` : 'rgba(90, 60, 30, .55)';
          ctx.lineWidth = ready ? 3 : 2;
          ctx.stroke();
          ctx.setLineDash([]);
        }
        if (this.site && this.site.id === site.id) {
          ctx.strokeStyle = '#F2C04B';
          ctx.lineWidth = 3.5;
          ctx.stroke();
        }
      }
      // Brume qui se lève sur le quartier qu'on vient d'acheter (la brume des autres est peinte dans le sol)
      for (const id of [...this.unveils.keys()]) {
        const mist = this.mistOf(this.state.map.zones.find(z => z.id === id), now);
        if (!mist) continue;
        ctx.fillStyle = `rgba(236, 238, 242, ${(0.62 * mist).toFixed(3)})`;
        for (const [x, y] of this.zoneTiles.get(id) || []) {
          const c = this.ground(x, y);
          this.diamond(ctx, c.x, c.y, TW + 1, TH + 1);
          ctx.fill();
        }
      }
      // Carrés de sol encore à préparer : une image de plus, même sans boucle d'animation
      if (missing && !this.raf && !this.moreRaf) {
        this.moreRaf = requestAnimationFrame(() => {
          this.moreRaf = 0;
          this.draw(performance.now());
        });
      }
      const worldTransform = ctx.getTransform();
      // Ombres des nuages et des mouettes qui glissent sur la mer et le relief
      drawCloudShadows(ctx, this.terrain.bounds, t, phase);
      for (const g of life.gulls) drawGullShadow(ctx, g, s);
      // Ce qui se tient debout (bâtiments, décorations, nature), du plus loin au plus proche
      // (seulement ce qui est à l'écran ; un grand sprite dépasse vers le haut de son pied)
      const seenAt = (wx, wy) => wx > view.x - TW * 2.5 && wx < view.x + view.w + TW * 2.5 && wy > view.y - TW * 0.6 && wy < view.y + view.h + TW * 3.2;
      const seen = (x, y) => { const c = this.ground(x, y); return seenAt(c.x, c.y); };
      const standing = [
        ...this.state.sites.map(site => ({ depth: site.x + site.y + site.w, site })),
        ...this.state.tiles.filter(tile => seen(tile.x, tile.y)).map(tile => ({ depth: tile.x + tile.y, tile })),
        ...this.props.filter(prop => seenAt(prop.wx, prop.wy)).map(prop => ({ depth: prop.depth, prop })),
        ...[...this.critters(t), ...life.standing].filter(critter => seen(critter.x, critter.y))
          .map(critter => ({ depth: critter.depth ?? critter.x + critter.y, critter })),
        ...this.ferryItems(t),
        ...this.state.map.zones.filter(zone => !zone.owned).map(zone => ({ zone, at: this.signPlaceOf(zone) }))
          .filter(sign => sign.at && seen(sign.at.x, sign.at.y)).map(sign => ({ depth: sign.at.x + sign.at.y, sign }))
      ].sort((p, q) => p.depth - q.depth);
      this.signs = [];
      const repaint = () => this.draw(performance.now());
      for (const item of standing) {
        if (item.site) this.drawSite(ctx, item.site, t, now, repaint);
        else if (item.tile) {
          this.drawTile(ctx, item.tile, now, t, repaint);
          this.occlude(ctx, item.tile.x, item.tile.y);
        } else if (item.prop) {
          this.drawProp(ctx, item.prop, t, repaint, now);
          this.occlude(ctx, item.prop.x, item.prop.y);
        } else if (item.sign) this.drawSign(ctx, item.sign, t, repaint);
        else if (item.ferry) this.drawFerry(ctx, item.ferry, repaint);
        else {
          this.drawCritter(ctx, item.critter, repaint);
          if (!SEA_KINDS.has(item.critter.kind)) this.occlude(ctx, Math.round(item.critter.x), Math.round(item.critter.y));
        }
      }
      // Volutes de brume qui dérivent au-dessus des quartiers à acheter
      this.drawWisps(ctx, t, now);
      this.drawSmoke(ctx, t, phase);
      // Ciel : mouettes en vol, nuages haut au-dessus de l'île, puis la teinte de l'heure sur toute la scène
      for (const g of life.gulls) drawFlyingGull(ctx, g, t, s);
      drawClouds(ctx, this.terrain.bounds, t, phase, s);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawTint(ctx, width, height, phase);
      ctx.setTransform(worldTransform);
      this.drawLights(ctx, t, phase);
      // La nuit, le plancton s'allume dans l'écume et les méduses luisent
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      drawPlankton(ctx, this.live.shore, view, t, phase.night);
      if (life.jellies) drawJellies(ctx, life.jellies, view, t, phase.night);
      ctx.restore();
      // Brume flotte au-dessus de tout (et luit la nuit)
      this.drawBrume(ctx, t, s);
      // Les noms des lieux passent par-dessus tout : aucune décoration ne les cache
      if (this.cam.s >= 0.55) this.state.sites.filter(site => !site.locked).forEach(site => this.drawLabel(ctx, site));
      // Bulles de production à toucher, au-dessus de tout
      this.drawBubbles(ctx, t);
    },
    // Ce qui se tient derrière une case plus haute : cette case est repeinte par-dessus (le relief cache le pied)
    occlude(ctx, x, y) {
      const M = this.M;
      const h = M.surface(x, y);
      for (const [dx, dy] of [[1, 0], [0, 1], [1, 1]]) {
        const nx = x + dx, ny = y + dy;
        if (M.land(nx, ny) && M.surface(nx, ny) > h + 0.01) drawCell(ctx, M, nx, ny, this.veilAt(nx, ny));
      }
    },
    drawSite(ctx, site, t, now, repaint) {
      // Sous la brume : à peine visible, comme une promesse
      const mist = this.mistOf(this.zoneAt(site.x, site.y), now);
      if (mist) {
        ctx.save();
        ctx.globalAlpha = 1 - 0.55 * mist;
        this.paintSite(ctx, site, t, now, repaint);
        ctx.restore();
        return;
      }
      this.paintSite(ctx, site, t, now, repaint);
    },
    paintSite(ctx, site, t, now, repaint) {
      const c = this.centerOf(site);
      const raise = this.raises.get(site.id);
      const k = raise ? Math.min(1, (now - raise.at) / RAISE_MS) : 1;
      if (raise && k >= 1) this.raises.delete(site.id);
      if (!site.level) {
        // Chantier, dans sa phase ; tout prêt, un peu de poussière de temps en temps
        const stage = this.stageOf(site);
        drawSprite(ctx, `chantier-${stage}`, BUILDINGS.chantier[stage], c.x, c.y, repaint);
        if (stage === 2 && !site.locked) {
          const puff = (t * 0.5) % 1;
          if (puff < 0.4) this.dust(ctx, c.x, c.y + 6, puff / 0.4, 3);
        }
        if (!site.locked && site.next && site.next.planEmoji) glyph(ctx, site.next.planEmoji, c.x, c.y - TW * 1.02 + Math.sin(t * 2) * 2, TW * 0.46, repaint, site.next.planOwned ? 0.95 : 0.4);
        return;
      }
      const look = lookAt(site.id, site.level);
      const skin = site.skin || '';
      const key = `${site.id}-${site.level}-${skin}`;
      const make = () => look.make(skin || undefined);
      const span = site.w / 2;
      if (k < 1) {
        // 1. L'ancien état tremble dans la poussière ; 2. le nouveau bâtiment s'élève depuis le sol ; 3. petit rebond.
        // (Au palier IV, l'emprise grandit : l'ancien bâtiment, plus petit, est dessiné au centre de la nouvelle.)
        const before = raise.from || 0;
        const beforeKey = before ? `${site.id}-${before}-${skin}` : 'chantier-2';
        const beforeMake = before ? () => lookAt(site.id, before).make(skin || undefined) : BUILDINGS.chantier[2];
        if (k < 0.35) {
          const shake = Math.sin(now / 28) * 1.6 * (1 - k / 0.35);
          drawSprite(ctx, beforeKey, beforeMake, c.x + shake, c.y, repaint);
        } else {
          const r = Math.min(1, (k - 0.35) / 0.5);
          const rise = 1 - Math.pow(1 - r, 3);
          const pop = k > 0.85 ? 1 + Math.sin(((k - 0.85) / 0.15) * Math.PI) * 0.05 : 1;
          ctx.save();
          // Le bâtiment sort de terre : découpé au ras du sol (bas de l'emprise), il monte de 96 px (plus s'il est grand)
          ctx.beginPath();
          ctx.rect(c.x - TW * (span + 0.4), c.y - TW * (2 * span + 1.2), TW * (2 * span + 0.8), TW * (2 * span + 1.2) + TH * (span + 0.05));
          ctx.clip();
          ctx.translate(c.x, c.y + (1 - rise) * 96 * span);
          ctx.scale(pop, pop);
          drawSprite(ctx, key, make, 0, 0, repaint);
          ctx.restore();
        }
        this.dust(ctx, c.x, c.y + 6, k, 9, span);
        return;
      }
      // Articles de la boutique : ceux de derrière avant le bâtiment, les autres après lui
      this.drawItems(ctx, site, c, t, repaint, true);
      this.swayed(ctx, key, make, c.x, c.y, look.sway * this.windAt(t, site.x + site.y), repaint);
      // Parties vivantes du palier (flamme, jets d'eau, ailes de moulin, roue…), puis le voilier bercé du Ponton
      look.anims.forEach((anim, i) => {
        if (anim.skip && anim.skip(skin)) return;
        const frame = Math.floor(t * anim.fps) % anim.n;
        drawSprite(ctx, `${site.id}-${site.level}-a${i}-${frame}-${anim.skinned ? skin : ''}`, () => anim.frame(frame, skin || undefined), c.x, c.y, repaint);
      });
      if (look.boat) {
        const [bx, by] = P(...look.boat, 0);
        const [ox, oy] = boatOffset(look.boat);
        ctx.save();
        ctx.translate(c.x + bx, c.y + by + Math.sin(t * 1.4) * 1.6);
        ctx.rotate(Math.sin(t * 1.1) * 0.035);
        drawSprite(ctx, `boat-${skin}`, () => boatOf(skin || undefined), ox - bx, oy - by, repaint);
        ctx.restore();
      }
      this.drawItems(ctx, site, c, t, repaint, false);
    },
    // Centre de l'emprise d'un bâtiment (2 × 2 ou 3 × 3 cases) dans le monde, à la hauteur de son sol (plat)
    centerOf(site) {
      const c = this.world(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2);
      c.y -= this.liftAt(site.x, site.y);
      return c;
    },
    covers(site, x, y) {
      return x >= site.x && x < site.x + site.w && y >= site.y && y < site.y + site.h;
    },
    // Articles possédés d'un bâtiment (outils, objets, accessoire de la pièce rare portée), dessinés et animés autour de lui
    drawItems(ctx, site, c, t, repaint, back) {
      for (const item of site.shop || []) {
        if (!item.owned || (item.kind === 'skin' && site.skin !== item.id)) continue;
        for (const layer of itemLayers(item.id, site.level, t)) {
          if (layer.back === back) drawSprite(ctx, layer.key, layer.make, c.x + layer.offset[0], c.y + layer.offset[1], repaint);
        }
      }
    },
    drawProp(ctx, prop, t, repaint, now) {
      const c = { x: prop.wx, y: prop.wy };
      const mist = this.mistOf(this.zoneAt(prop.x, prop.y), now);
      if (mist) {
        ctx.save();
        ctx.globalAlpha = 1 - 0.5 * mist;
      }
      this.swayed(ctx, `nature-${prop.kind}`, ALL_NATURE[prop.kind], c.x, c.y, (SWAY[prop.kind] || 0) * this.windAt(t, prop.x * 0.7 + prop.y), repaint);
      if (mist) ctx.restore();
    },
    // Panneau d'un quartier à acheter : prix, ou chapitre du Livre encore fermé ; il se balance un peu
    drawSign(ctx, { zone, at }, t, repaint) {
      const c = this.ground(at.x, at.y);
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate(Math.sin(t * 1.3 + at.x) * 0.02);
      drawSprite(ctx, 'sign', SIGN, 0, 0, repaint);
      ctx.font = '900 7.5px Nunito, system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#4A3426';
      ctx.fillText(zone.open ? `${zone.price} écus` : `Chap. ${zone.chapter}`, 0, -31.5);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
      this.signs.push({ zone, x: c.x, y: c.y - 30, r: 26 });
    },
    // Volutes de brume (monde) : ellipses claires qui dérivent lentement sur les quartiers à acheter
    drawWisps(ctx, t, now) {
      for (const zone of this.state.map.zones) {
        const mist = this.mistOf(zone, now);
        if (!mist || !zone.anchor) continue;
        for (let k = 0; k < 4; k++) {
          const ax = zone.anchor.x + Math.sin(t * 0.13 + k * 1.9 + zone.anchor.y) * 1.6;
          const ay = zone.anchor.y + Math.cos(t * 0.11 + k * 2.3 + zone.anchor.x) * 1.6;
          const c = this.world(ax, ay);
          c.y -= this.liftAt(zone.anchor.x, zone.anchor.y);
          const g = ctx.createRadialGradient(c.x, c.y - 14, 0, c.x, c.y - 14, TW * 1.3);
          g.addColorStop(0, `rgba(248, 249, 252, ${(0.42 * mist).toFixed(3)})`);
          g.addColorStop(1, 'rgba(248, 249, 252, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(c.x, c.y - 14, TW * 1.3, TH * 1.1, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    // Bulles de production au-dessus des bâtiments : ressource et écus à récolter, d'un toucher
    drawBubbles(ctx, t) {
      this.bubbles = [];
      for (const site of this.state.sites) {
        const made = site.pending;
        if (!made || site.locked || this.raises.has(site.id)) continue;
        const amount = made[site.produce] || 0;
        if (!amount && !made.coins) continue;
        const c = this.centerOf(site);
        const k = 1 / Math.min(1, this.cam.s);
        const bob = Math.sin(t * 2.2 + site.x) * 2.5;
        const x = c.x;
        const y = c.y - TW * (1.55 + (site.w - 2) * 0.8) + bob;
        const w = 46 * k;
        const h = 22 * k;
        ctx.save();
        ctx.shadowColor = 'rgba(60, 40, 25, .3)';
        ctx.shadowBlur = 6 * k;
        ctx.shadowOffsetY = 2 * k;
        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2);
        else ctx.rect(x - w / 2, y - h / 2, w, h);
        ctx.fill();
        ctx.restore();
        // Pointe vers le bâtiment
        ctx.fillStyle = '#FFFDF8';
        ctx.beginPath();
        ctx.moveTo(x - 5 * k, y + h / 2 - 1);
        ctx.lineTo(x, y + h / 2 + 6 * k);
        ctx.lineTo(x + 5 * k, y + h / 2 - 1);
        ctx.fill();
        ctx.font = `${13 * k}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(GLYPH[site.produce] || '✨', x - 11 * k, y + 0.5);
        ctx.font = `900 ${11 * k}px Nunito, system-ui, sans-serif`;
        ctx.fillStyle = '#4A3426';
        ctx.fillText(`+${amount}`, x + 9 * k, y + 0.5);
        ctx.textBaseline = 'alphabetic';
        this.bubbles.push({ site, x, y, w, h });
      }
    },
    // Petite vie de l'île, déterministe dans le temps : où est chaque animal, dans quelle image, de quel côté il regarde.
    // Poules autour du Foyer, papillons et abeilles sur les fleurs (le jour), grenouille aux nénuphars, poisson près de la côte.
    critters(t) {
      if (!this.state) return [];
      const phase = phaseAt(this.forced || new Date());
      const out = [];
      const foyer = this.state.sites.find(s => s.id === 'foyer');
      if (foyer) {
        for (let k = 0; k < 2; k++) {
          const a = t * 0.22 + k * 2.4;
          const r = foyer.w / 2;
          const x = foyer.x + r + Math.cos(a) * (r + 0.55) + Math.sin(t * 0.9 + k) * 0.08;
          const y = foyer.y + r + Math.sin(a * 1.3) * (r + 0.35);
          const pecking = Math.sin(t * 0.7 + k * 3) > 0.55;
          out.push({ kind: 'chicken', x, y, z: 0, frame: pecking && Math.sin(t * 9) > 0 ? 1 : 0, flip: Math.sin(a) > 0 });
        }
      }
      if (phase.night < 0.5) {
        const flowers = this.props.filter(p => p.kind === 'flowers' || p.kind === 'bush').slice(0, 4);
        flowers.forEach((p, k) => {
          const a = t * (0.6 + k * 0.1) + k;
          const kind = k % 2 ? 'bee' : 'butterfly';
          out.push({ kind, x: p.x + Math.cos(a) * 0.35, y: p.y + Math.sin(a * 1.4) * 0.3, z: 6 + Math.sin(t * 2 + k) * 3, frame: Math.floor(t * (kind === 'bee' ? 20 : 8) + k) % 2, flip: Math.cos(a) < 0 });
        });
      }
      const pond = this.props.find(p => p.kind === 'lily' || p.kind === 'reeds');
      if (pond) out.push({ kind: 'frog', x: pond.x + 0.12, y: pond.y + 0.1, z: 0, frame: (t % 4) < 0.35 ? 1 : 0, flip: false });
      // Poisson : un saut toutes les 7 s, à un endroit différent du rivage (sardine, daurade) ; le poisson volant plane
      // vers le large
      const cycle = Math.floor(t / 7);
      const into = (t % 7) / 7;
      const species = FISH_SPECIES[Math.floor(hash(cycle, 5) * FISH_SPECIES.length)];
      const span = species === 'volant' ? 0.2 : 0.12;
      if (into < span && this.shore.length) {
        const spot = this.shore[Math.floor(hash(cycle, 2) * this.shore.length)];
        if (species === 'volant') {
          const k = into / span, alongX = hash(cycle, 3) < 0.5;
          out.push({ kind: 'fish', species, x: spot.x + 0.2 + (alongX ? k * 1.4 : 0), y: spot.y + 0.2 + (alongX ? 0 : k * 1.4), z: 0, frame: 0, flip: !alongX });
        } else out.push({ kind: 'fish', species, x: spot.x + 0.2, y: spot.y + 0.2, z: 0, frame: into < 0.06 ? 0 : 1, flip: hash(cycle, 3) < 0.5 });
      }
      // Mouettes posées sur les plages (envolées après un toucher, elles reviennent plus tard)
      for (const perch of this.perches) {
        const fled = this.scared.get(`perch:${perch.id}`);
        if (fled && t - fled.at < GULL_BACK) continue;
        for (let i = 0; i < perch.count; i++) {
          out.push({ kind: 'gull', x: perch.x + i * 0.32 - 0.1, y: perch.y + 0.1 - i * 0.18, z: 0, frame: Math.sin(t * 0.7 + i * 2 + perch.x) > 0.75 ? 1 : 0, flip: (i + Math.floor(t / 9 + perch.y)) % 2 === 1 });
        }
      }
      return out;
    },
    drawCritter(ctx, critter, repaint) {
      // À la surface de la mer : poissons, dauphins, baleine ; les autres vivent sur le sol de leur case
      if (critter.kind === 'spout') {
        drawSpout(ctx, critter);
        return;
      }
      const atSea = SEA_KINDS.has(critter.kind);
      const c = atSea ? this.world(critter.x, critter.y) : this.ground(critter.x, critter.y);
      if (atSea) c.y -= SEA_Z * HS;
      ctx.save();
      ctx.translate(c.x, c.y - critter.z);
      if (critter.flip) ctx.scale(-1, 1);
      // Ce qui sort de l'eau peu à peu (dos, queue de la baleine) : e de 0 à 1
      if (critter.e !== undefined) {
        ctx.globalAlpha = critter.e;
        ctx.translate(0, (1 - critter.e) * 8);
      }
      const [key, make] = this.critterSprite(critter);
      drawSprite(ctx, key, make, 0, 0, repaint);
      ctx.restore();
    },
    // Barque du passeur et son ponton (Îlot aux Mouettes à soi) : elle fait la navette une fois l'île flottante à soi
    ferryItems(t) {
      const route = this.islets.route;
      this.ferry = null;
      if (!route || !this.owns(this.state, COLONY_ZONE)) return [];
      const pose = ferryPose(route, t, this.owns(this.state, FLOATING_ZONE));
      this.ferry = pose;
      return [
        { depth: route.dock.x + route.dock.y - 0.05, ferry: { landing: true, ...route.dock } },
        { depth: pose.x + pose.y, ferry: { ...pose, frame: pose.moving ? Math.floor(t * 2) % 2 : 0 } }
      ];
    },
    drawFerry(ctx, item, repaint) {
      const c = worldOf(item.x, item.y, item.z);
      ctx.save();
      ctx.translate(c.x, c.y);
      if (item.landing) drawSprite(ctx, 'islet-landing', ISLET_SPRITES.landing, 0, 0, repaint);
      else {
        if (item.flip) ctx.scale(-1, 1);
        drawSprite(ctx, `islet-ferry-${item.frame}`, ISLET_SPRITES.ferry[item.frame], 0, 0, repaint);
      }
      ctx.restore();
    },
    critterSprite(c) {
      if (c.kind === 'fish') return [`fish-${c.species}-${c.frame}`, SEA_SPRITES.fish[c.species][c.frame]];
      if (c.kind === 'dolphin') return [`dolphin-${c.frame}`, SEA_SPRITES.dolphin[c.frame]];
      if (c.kind === 'whale') return ['whale-back', SEA_SPRITES.whaleBack];
      if (c.kind === 'fluke') return ['whale-fluke', SEA_SPRITES.whaleFluke];
      if (c.kind === 'gull') return [`gull-${c.frame}`, SEA_SPRITES.gull[c.frame]];
      return [`${c.kind}-${c.frame}`, CRITTERS[c.kind][c.frame]];
    },
    // La mer à cet instant (lot 5b) : ce qui se montre à la surface (dauphins, baleine), les ronds dans l'eau, les
    // mouettes en vol, les méduses ; et ce qu'on peut toucher (seaHits). Les visiteurs arrivent avec les quartiers
    // achetés ; en mouvement réduit, seuls restent ceux qui ne passent pas
    seaLife(t, view, phase) {
      const out = { standing: [], rings: [], gulls: [], jellies: null };
      const hits = [];
      const still = this.reduced();
      const guests = seaGuests(new Set(this.state.map.zones.filter(z => z.owned).map(z => z.id)));
      const center = this.cellAt(view.x + view.w / 2, view.y + view.h / 2);
      const surface = (x, y) => { const c = this.world(x, y); return { x: c.x, y: c.y - SEA_Z * HS }; };
      if (!still && guests.dolphins) {
        const go = this.passageOf('pod', t, DOLPHIN_EVERY, DOLPHIN_FOR, 3, center);
        const fled = go && this.scared.get(go.key);
        if (go && !fled) {
          const pod = podAt(go.spot, go.dir, go.τ);
          out.rings.push(...pod.rings);
          for (const d of pod.dolphins) {
            out.standing.push({ kind: 'dolphin', ...d });
            const c = surface(d.x, d.y);
            hits.push({ key: go.key, kind: 'pod', x: c.x, y: c.y - d.z - 4, r: 26, where: pod.dolphins.map(p => ({ x: p.x, y: p.y })) });
          }
        } else if (fled && t - fled.at < 1.2) fled.where.forEach(p => out.rings.push({ x: p.x, y: p.y, k: (t - fled.at) / 1.2 }));
      }
      if (!still && guests.whale) {
        const go = this.passageOf('whale', t, WHALE_EVERY, WHALE_FOR, 5, center);
        if (go) {
          const w = whaleAt(go.spot, go.dir, go.τ);
          const tapped = this.scared.get(go.key);
          if (tapped && t - tapped.at < 1.8) w.spouts.push({ x: tapped.x, y: tapped.y, k: (t - tapped.at) / 1.8 });
          out.rings.push(...w.rings);
          if (w.back) {
            const depth = w.back.x + w.back.y;
            out.standing.push({ kind: 'whale', x: w.back.x, y: w.back.y, z: 0, e: w.back.e, flip: w.flip });
            w.spouts.forEach(sp => out.standing.push({ kind: 'spout', ...sp, depth: depth + 0.5 }));
            const c = surface(w.back.x, w.back.y);
            hits.push({ key: go.key, kind: 'whale', x: c.x, y: c.y - 6, r: 44, at: { x: w.back.x, y: w.back.y } });
          }
          if (w.fluke) out.standing.push({ kind: 'fluke', x: w.fluke.x, y: w.fluke.y, z: 0, e: w.fluke.e, flip: w.flip });
        }
      }
      if (guests.jellies && phase.night > 0.3) out.jellies = jelliesAt(this.sea.open, t);
      // Mouettes : un vol tourne au-dessus du ponton (ou de la Grève), un autre traverse l'île de temps en temps ; la nuit,
      // elles dorment
      if (!still && phase.night < 0.6) {
        const harbor = this.state.sites.find(site => site.id === 'ponton' && site.level);
        const greve = this.state.map.zones.find(z => z.id === 'coeur');
        const home = harbor ? this.centerOf(harbor) : greve && greve.anchor ? this.ground(greve.anchor.x, greve.anchor.y) : null;
        if (home) out.gulls.push(...circling(home.x, home.y, t, 1));
        out.gulls.push(...crossing(this.terrain.bounds, t));
        const colony = this.islets.colony;
        if (colony.length && this.owns(this.state, COLONY_ZONE)) {
          const c = this.ground(colony.reduce((sum, p) => sum + p.x, 0) / colony.length, colony.reduce((sum, p) => sum + p.y, 0) / colony.length);
          out.gulls.push(...circling(c.x, c.y, t, 3, 5));
        }
      }
      // Mouettes posées : on peut les toucher ; celles qu'on vient d'effrayer s'envolent vers le large
      for (const perch of this.perches) {
        const key = `perch:${perch.id}`;
        const fled = this.scared.get(key);
        const c = this.ground(perch.x, perch.y);
        if (!fled || t - fled.at >= GULL_BACK) hits.push({ key, kind: 'perch', x: c.x, y: c.y - 8, r: 16 });
        else if (t - fled.at < FLY_OFF) {
          const k = (t - fled.at) / FLY_OFF;
          for (let i = 0; i < perch.count; i++) out.gulls.push({ wx: c.x + (60 + i * 14) * k, wy: c.y + i * 4 - 20 * k, alt: 6 + 90 * k * k, flip: false, phase: i });
        }
      }
      this.seaHits = hits;
      return out;
    },
    // Passage en cours des dauphins ou de la baleine : où (l'eau libre la plus proche de la caméra au début du
    // passage) et dans quelle direction ; null entre deux passages
    passageOf(name, t, every, length, far, center) {
      const cycle = Math.floor(t / every), τ = t - cycle * every;
      if (τ >= length) return null;
      let p = this.passages[name];
      if (!p || p.cycle !== cycle) {
        const spot = nearestOpen(this.sea.open, center.x, center.y, far);
        if (!spot) return null;
        p = { cycle, spot, dir: spot.dirs[Math.floor(hash(cycle, name.length) * spot.dirs.length)], key: `${name}:${cycle}` };
        this.passages[name] = p;
      }
      return { ...p, τ };
    },
    // Case (fractionnaire) sous un point du monde, au niveau de la mer
    cellAt(wx, wy) {
      const a = (2 * (wy + SEA_Z * HS)) / TH, b = (2 * wx) / TW;
      return { x: (a + b) / 2, y: (a - b) / 2 };
    },
    // Où flotte Brume (point au sol) : à côté du bâtiment ou du panneau du quartier que vise la quête active, sinon près
    // du Foyer
    brumeSpot() {
      const target = this.quest && this.quest.target;
      const zone = target && target.zone && this.state.map.zones.find(z => z.id === target.zone);
      if (zone && zone.anchor) {
        const g = this.ground(zone.anchor.x, zone.anchor.y);
        return { x: g.x + TW * 0.45, y: g.y - TH * 0.2 };
      }
      const site = this.state.sites.find(s => s.id === ((target && target.site) || 'foyer'));
      if (!site) return null;
      const c = this.centerOf(site);
      return { x: c.x - TW * 0.42 * site.w, y: c.y - TH * 0.15 };
    },
    drawBrume(ctx, t, s) {
      const spot = this.brumeSpot();
      if (!spot) {
        this.brumeHit = null;
        return;
      }
      const { dx, dy } = floatOf(t);
      const x = spot.x + dx, y = spot.y - BRUME_ALT + dy;
      drawBrume(ctx, x, y, spot, t, Boolean(this.quest && this.quest.done), s);
      this.brumeHit = { x, y, r: BRUME_REACH * Math.max(1, 0.6 / s) };
    },
    // La caméra va vers l'objectif de la quête
    showQuestTarget() {
      const spot = this.brumeSpot();
      this.questOpen = false;
      if (!spot) return;
      this.cam.x = spot.x;
      this.cam.y = spot.y;
      this.clampCam();
      this.draw(performance.now());
    },
    // Un toucher sur Brume : réclamer si la récompense attend, sinon mener vers l'objectif ou lancer la Récolte ; sans
    // action possible, sa fiche (l'appui long l'ouvre toujours)
    questAct() {
      const quest = this.quest;
      if (quest && quest.done) this.claimQuest();
      else if (quest && quest.target) {
        this.showQuestTarget();
        this.$emit('show-alert', `Brume : ${quest.label}.`);
      } else if (quest && quest.kind === 'runs' && this.state.charges.count) this.questHarvest();
      else this.questOpen = true;
    },
    // La quête demande une Récolte : la fiche se ferme, la Récolte commence
    questHarvest() {
      this.questOpen = false;
      this.startHarvest();
    },
    // Récompense de la quête active : versée par le serveur ; la fiche reste ouverte sur la quête suivante
    async claimQuest() {
      if (!this.quest || this.busy) return;
      this.busy = true;
      try {
        const hit = this.brumeHit;
        const { gained, coins, world } = await playService.worldQuest(this.quest.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (hit) {
          const sp = this.toScreen(hit.x, hit.y);
          const at = this.canvasPoint(sp.x, sp.y);
          ring(at, 90);
          burst(at, 24, 80);
        }
        vibrate([12, 30, 16]);
        this.$emit('show-alert', `Brume : +${gained} écus\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La récompense n’a pas pu être reçue.'));
      } finally {
        this.busy = false;
      }
    },
    // Un toucher sur un animal : les dauphins plongent, la baleine souffle, les mouettes posées s'envolent
    scare(animal) {
      if (this.reduced()) return;
      const t = performance.now() / 1000;
      for (const [key, was] of this.scared) if (t - was.at > 2 * GULL_BACK) this.scared.delete(key);
      if (animal.kind === 'pod') this.scared.set(animal.key, { at: t, where: animal.where });
      else if (animal.kind === 'whale') this.scared.set(animal.key, { at: t, ...animal.at });
      else this.scared.set(animal.key, { at: t });
      vibrate(6);
      this.draw(performance.now());
    },
    // Mouettes posées : quelques plages au bord de la mer (côté large), dans les quartiers à soi, libres (ni
    // chantier, ni décoration, ni arbre ou rocher)
    perchesOf(state) {
      const M = this.M;
      const owned = new Set(state.map.zones.filter(z => z.owned).map(z => z.id));
      const busy = new Set([...state.tiles, ...this.props].map(c => `${c.x},${c.y}`));
      const cells = [];
      for (let y = 0; y < state.size; y++) {
        for (let x = 0; x < state.size; x++) {
          if (M.ground(x, y) !== 's' || busy.has(`${x},${y}`)) continue;
          const zone = state.map.zones[M.zone(x, y)];
          if (!zone || !owned.has(zone.id) || state.sites.some(site => this.covers(site, x, y))) continue;
          if ([[1, 0], [0, 1]].some(([dx, dy]) => M.ground(x + dx, y + dy) === '~')) cells.push({ x, y });
        }
      }
      // La colonie de l'Îlot aux Mouettes : trois groupes plus nombreux au bord de l'îlot
      const colony = owned.has(COLONY_ZONE)
        ? this.islets.colony.filter(c => !busy.has(`${c.x},${c.y}`) && [[1, 0], [0, 1], [-1, 0], [0, -1]].some(([dx, dy]) => !M.land(c.x + dx, c.y + dy)))
        : [];
      return [
        ...spread(cells, 5, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 1 + (k % 2) })),
        ...spread(colony, 2, 3).map((c, k) => ({ id: `${c.x},${c.y}`, x: c.x, y: c.y, count: 2 + (k % 2) }))
      ];
    },
    // Fumée des cheminées : bouffées qui montent, grossissent, s'effacent et partent avec le vent
    drawSmoke(ctx, t, phase) {
      for (const site of this.state.sites) {
        if (!site.level || this.raises.has(site.id)) continue;
        const c = this.centerOf(site);
        lookAt(site.id, site.level).smoke.forEach((at, j) => {
          const [sx, sy] = P(...at);
          for (let i = 0; i < 4; i++) {
            const k = (t * 0.32 + i / 4 + j * 0.13) % 1;
            const x = c.x + sx + k * 16 + this.windAt(t, i + j) * 4 * k;
            const y = c.y + sy - k * 46;
            const tone = phase.night > 0.5 ? '170,175,200' : '236,232,224';
            ctx.fillStyle = `rgba(${tone},${(0.5 * (1 - k)).toFixed(3)})`;
            ctx.beginPath();
            ctx.arc(x, y, 3.5 + k * 9, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }
    },
    // Lumières : fenêtres et feux s'allument au crépuscule ; lucioles la nuit
    drawLights(ctx, t, phase) {
      const lit = Math.min(1, phase.night * 1.1 + phase.warm * 0.45);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const site of this.state.sites) {
        if (!site.level || this.raises.has(site.id)) continue;
        const look = lookAt(site.id, site.level);
        const lights = look.lights;
        const c = this.centerOf(site);
        const fire = look.fire;
        lights.forEach(([u, v, z, r], i) => {
          const [lx, ly] = P(u, v, z);
          const flicker = fire ? 0.85 + 0.15 * Math.sin(t * 13 + i) * Math.sin(t * 7.3) : 0.95 + 0.05 * Math.sin(t * 2 + i);
          glow(ctx, c.x + lx, c.y + ly, r, (fire ? Math.max(0.3, lit) : lit) * flicker);
        });
        for (const item of site.shop || []) {
          const light = item.owned && itemLight(item.id, site.level);
          if (!light) continue;
          const [lx, ly] = P(light[0], light[1], light[2]);
          glow(ctx, c.x + lx, c.y + ly, light[3], lit * (0.9 + 0.1 * Math.sin(t * 3 + light[0])), light[4]);
        }
        // Pièce rare portée : lampions, lucioles, lave…
        for (const [x, y, r, color, strength] of rareLights(site.skin, site.level, t)) {
          glow(ctx, c.x + x, c.y + y, r, lit * strength * (0.9 + 0.1 * Math.sin(t * 3 + x)), color);
        }
      }
      // Lanternes du pont de l'Îlot aux Mouettes, lanterne de la barque du passeur
      for (const lamp of this.islets.lamps) {
        const p = lampGlowOf(lamp);
        glow(ctx, p.x, p.y, 16, lit * (0.92 + 0.08 * Math.sin(t * 2 + lamp.x)));
      }
      if (this.ferry) {
        const c = worldOf(this.ferry.x, this.ferry.y, this.ferry.z);
        glow(ctx, c.x + (this.ferry.flip ? 19 : -19), c.y - 18, 16, lit);
      }
      if (phase.night > 0.35) {
        const strength = (phase.night - 0.35) / 0.65;
        for (const fly of fireflies(t, this.state.size)) {
          const p = this.ground(fly.x, fly.y);
          glow(ctx, p.x, p.y - fly.z, 9, strength * fly.a, '255,236,140');
          ctx.fillStyle = `rgba(255,250,200,${(strength * fly.a).toFixed(3)})`;
          ctx.fillRect(p.x - 1, p.y - fly.z - 1, 2, 2);
        }
      }
      ctx.restore();
    },
    // Nom du lieu, lisible dès qu'on est assez près
    drawLabel(ctx, site) {
      const c = this.centerOf(site);
      const k = 1 / Math.min(1, this.cam.s);
      ctx.font = `800 ${12 * k}px Nunito, system-ui, sans-serif`;
      const w = ctx.measureText(site.name).width + 14 * k;
      const h = 18 * k;
      const y = c.y + TH * (0.62 + (site.w - 2) * 0.5);
      ctx.fillStyle = site.level ? 'rgba(251, 246, 234, .92)' : 'rgba(74, 52, 38, .82)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(c.x - w / 2, y - h / 2, w, h, h / 2);
      else ctx.rect(c.x - w / 2, y - h / 2, w, h);
      ctx.fill();
      ctx.fillStyle = site.level ? '#4A3426' : '#FBF6EA';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(site.name, c.x, y + 0.5);
      ctx.textBaseline = 'alphabetic';
    },
    drawTile(ctx, tile, now, t, repaint) {
      const c = this.ground(tile.x, tile.y);
      const started = this.pops.get(tile.element);
      let scale = 1;
      if (started) {
        const k = Math.min(1, (now - started) / 450);
        const back = 1.7;
        scale = 1 + (back + 1) * Math.pow(k - 1, 3) + back * Math.pow(k - 1, 2);
        if (k >= 1) this.pops.delete(tile.element);
      }
      const bob = Math.sin(t * 1.6 + tile.x * 0.8 + tile.y * 1.3) * TW * 0.025;
      // Socle de pierre et de bois ; l'élément flotte au-dessus et respire
      drawSprite(ctx, 'plinth', PLINTH, c.x, c.y, repaint);
      ctx.fillStyle = '#000';
      glyph(ctx, tile.emoji, c.x, c.y - TW * 0.42 + bob, TW * 0.56 * scale, repaint);
    },

    /* ---------- Gestes : glisser, pincer, toucher ---------- */
    point(event) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    },
    onDown(event) {
      if (!this.state) return;
      this.$refs.canvas.setPointerCapture(event.pointerId);
      this.pointers.set(event.pointerId, this.point(event));
      clearTimeout(this.holdTimer);
      if (this.pointers.size === 1) {
        this.gesture = { start: this.point(event), moved: 0, at: performance.now() };
        this.holdTimer = setTimeout(() => this.onHold(), HOLD_MS);
      } else this.gesture = { pinch: this.pinchOf(), moved: Infinity };
    },
    // Appui long sans bouger : la fiche de Brume, le menu d'une décoration ; ailleurs, le toucher garde son action
    onHold() {
      const gesture = this.gesture;
      if (!gesture || !gesture.start || gesture.moved > TAP_SLOP || this.moving || this.busy) return;
      const hit = this.hitAt(gesture.start.x, gesture.start.y);
      if (hit && hit.brume) this.questOpen = true;
      else if (hit && hit.tile) this.openTileMenu(hit.tile);
      else return;
      gesture.held = true;
      vibrate(12);
      this.draw(performance.now());
    },
    pinchOf() {
      const [a, b] = [...this.pointers.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    },
    onMove(event) {
      if (!this.pointers.has(event.pointerId) || !this.gesture) return;
      const prev = this.pointers.get(event.pointerId);
      const p = this.point(event);
      this.pointers.set(event.pointerId, p);
      if (this.pointers.size >= 2 && this.gesture.pinch) {
        const next = this.pinchOf();
        const last = this.gesture.pinch;
        if (last.d > 0) this.zoomAt(next.mx, next.my, next.d / last.d);
        this.cam.x -= (next.mx - last.mx) / this.cam.s;
        this.cam.y -= (next.my - last.my) / this.cam.s;
        this.clampCam();
        this.gesture.pinch = next;
        this.draw(performance.now());
        return;
      }
      this.gesture.moved = Math.max(this.gesture.moved, Math.hypot(p.x - this.gesture.start.x, p.y - this.gesture.start.y));
      if (this.gesture.moved > TAP_SLOP) {
        clearTimeout(this.holdTimer);
        this.selected = null;
        this.cam.x -= (p.x - prev.x) / this.cam.s;
        this.cam.y -= (p.y - prev.y) / this.cam.s;
        this.clampCam();
        this.draw(performance.now());
      }
    },
    onCancel(event) {
      clearTimeout(this.holdTimer);
      this.pointers.delete(event.pointerId);
      if (!this.pointers.size) this.gesture = null;
    },
    onUp(event) {
      clearTimeout(this.holdTimer);
      const gesture = this.gesture;
      const p = this.point(event);
      this.pointers.delete(event.pointerId);
      if (this.pointers.size) {
        // Un doigt reste après un pincement : on reprend un glissement sans toucher
        const [rest] = [...this.pointers.values()];
        this.gesture = { start: rest, moved: Infinity };
        return;
      }
      this.gesture = null;
      if (!gesture || gesture.held || gesture.moved > TAP_SLOP || this.busy) return;
      this.tap(p.x, p.y);
    },
    onWheel(event) {
      if (!this.geo) return;
      const p = this.point(event);
      this.zoomAt(p.x, p.y, event.deltaY < 0 ? 1.12 : 0.89);
    },
    // Ce qui est sous le doigt : bâtiment, décoration, puis case
    // Ce qui est sous le doigt : bulle de production, panneau de quartier, bâtiment, décoration, puis case
    hitAt(px, py) {
      const w = this.toWorld(px, py);
      if (this.brumeHit && Math.hypot(w.x - this.brumeHit.x, w.y - this.brumeHit.y) < this.brumeHit.r) return { brume: true };
      const bubble = this.bubbles.find(b => Math.abs(w.x - b.x) < b.w / 2 + 6 && Math.abs(w.y - b.y) < b.h / 2 + 8);
      if (bubble) return { bubble };
      const sign = this.signs.find(sg => Math.hypot(w.x - sg.x, (w.y - sg.y) * 1.2) < sg.r);
      if (sign) return { zone: sign.zone };
      // Animaux de la mer et mouettes posées : un toucher les fait réagir
      const animal = this.seaHits.find(h => Math.hypot(w.x - h.x, w.y - h.y) < h.r);
      if (animal) return { animal };
      // Zones de toucher généreuses : tout le volume dessiné du bâtiment, pas seulement sa base
      const candidates = [
        ...this.state.sites.map(site => ({ site, depth: site.x + site.y + site.w, c: this.centerOf(site), r: TW * 0.49 * site.w, h: TW * 0.875 * site.w, below: TH * 0.525 * site.w })),
        ...this.state.tiles.map(tile => ({ tile, depth: tile.x + tile.y, c: this.ground(tile.x, tile.y), r: TW * 0.4, h: TW * 0.95 }))
      ].sort((p, q) => q.depth - p.depth);
      const hit = candidates.find(o => Math.abs(w.x - o.c.x) < o.r && w.y > o.c.y - o.h && w.y < o.c.y + (o.site ? o.below : TH * 0.3));
      if (hit) return hit;
      const tile = this.tileAt(px, py);
      if (!tile || !this.landAt(tile.x, tile.y)) return null;
      const site = this.state.sites.find(s => this.covers(s, tile.x, tile.y));
      if (site) return { site };
      return this.lockedAt(tile.x, tile.y) ? { zone: this.zoneAt(tile.x, tile.y) } : { cell: tile };
    },
    tap(px, py) {
      const hit = this.hitAt(px, py);
      if (this.moving) {
        const cell = hit && hit.cell;
        if (!cell) {
          this.$emit('show-alert', hit && hit.zone ? 'Achète d’abord ce quartier pour y décorer.' : 'Choisis une case d’herbe libre.');
          return;
        }
        const name = this.moving;
        this.moving = null;
        this.place(name, cell.x, cell.y);
        return;
      }
      this.selected = null;
      if (!hit) {
        this.draw(performance.now());
        return;
      }
      if (hit.bubble) {
        const sp = this.toScreen(hit.bubble.x, hit.bubble.y);
        this.collect(this.canvasPoint(sp.x, sp.y));
        vibrate(8);
      } else if (hit.brume) {
        this.questAct();
        vibrate(6);
      } else if (hit.animal) {
        this.scare(hit.animal);
        return;
      } else if (hit.zone) {
        this.zone = hit.zone;
        vibrate(6);
      } else if (hit.site) {
        if (hit.site.locked) {
          this.zone = this.zoneAt(hit.site.x, hit.site.y);
        } else {
          this.site = hit.site;
          this.siteTab = hit.site.level ? 'overview' : 'evolution';
        }
        vibrate(6);
      } else if (hit.tile) {
        // Un toucher soulève la décoration : un toucher sur une case libre la pose (appui long : son menu)
        this.moving = hit.tile.element;
        vibrate(6);
      } else {
        this.query = '';
        this.picking = hit.cell;
      }
      this.draw(performance.now());
    },
    // Point de l'écran (page) d'un point du canvas
    canvasPoint(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      return { x: rect.left + x, y: rect.top + y };
    },
    // Vignette d'un bâtiment (son dessin actuel) pour sa fiche
    artOf(site) {
      if (!site.level) return spriteUrl(`chantier-${this.stageOf(site)}`, BUILDINGS.chantier[this.stageOf(site)]);
      return spriteUrl(`art-${site.id}-${site.level}-${site.skin || ''}`, artMake(site.id, site.level, site.skin));
    },
    /* ---------- Boutique d'un atelier ---------- */
    roman,
    // Rubriques de la boutique ; dans chacune, les articles du premier palier au dernier
    shopGroups(site) {
      const byPalier = (a, b) => a.minLevel - b.minLevel || a.price - b.price;
      return SHOP_GROUPS.map(([kind, label]) => ({ kind, label, items: site.shop.filter(item => groupOf(item) === kind).sort(byPalier) })).filter(group => group.items.length);
    },
    // Niveau auquel montrer un article ou un skin : celui du bâtiment, ou celui qu'il demande (le toit du Foyer se voit dès l’Abri)
    previewLevel(site, item) {
      const level = Math.max(site.level, item.minLevel, 1);
      return site.id === 'foyer' && groupOf(item) === 'skin' ? Math.max(level, 2) : level;
    },
    itemArt(site, item) {
      const level = this.previewLevel(site, item);
      if (item.kind === 'skin') return spriteUrl(`art-${site.id}-${level}-${item.id}`, artMake(site.id, level, item.id));
      return spriteUrl(`thumb-${item.id}-${level}`, () => itemThumb(item.id, level));
    },
    itemNote(site, item) {
      if (groupOf(item) === 'skin' && site.id === 'foyer' && site.level < 2) return 'Se voit dès l’Abri.';
      return item.effect;
    },
    // Raison pour laquelle un article ne s'achète pas encore (texte du bouton), ou ''
    lockOf(site, item) {
      if (item.rare) return 'Dans les butins';
      if (!site.level) return 'Bâtis d’abord';
      if (site.level < item.minLevel) return `Palier ${roman(item.minLevel)}`;
      if (this.coins !== null && this.coins < item.price) return `Il manque ${item.price - this.coins}`;
      return '';
    },
    canBuy(site, item) {
      return !item.owned && !this.lockOf(site, item);
    },
    buyLabel(site, item) {
      const lock = this.lockOf(site, item);
      if (lock) return `${item.name} : ${lock}`;
      return `Acheter ${item.name} pour ${item.price} écus (appui long : sa fiche)`;
    },
    perHourOf(site) {
      return site.perHour || { amount: this.state.rates.produce * site.level, coins: this.state.rates.coins * site.level };
    },
    num(n) {
      return Number(n).toLocaleString('fr-FR', { maximumFractionDigits: 1 });
    },
    zoneName(id) {
      return this.state.map.zones.find(z => z.id === id)?.name || '';
    },
    sitesIn(zone) {
      return this.state.sites.filter(s => s.zone === zone.id).map(s => s.name);
    },
    // Palier i (0 = premier niveau) d'un bâtiment : atteint, prochain ou à venir
    stepState(site, i) {
      if (i < site.level) return 'done';
      return i === site.level ? 'next' : 'later';
    },
    screenRectOf(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const c = this.ground(x, y);
      const sp = this.toScreen(c.x, c.y);
      return { left: rect.left + sp.x - 30, top: rect.top + sp.y - 40, width: 60, height: 60 };
    },

    /* ---------- Actions ---------- */
    async build(site) {
      this.busy = true;
      try {
        const { built, coins, world } = await playService.worldBuild(site.id);
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        this.site = null;
        this.$nextTick(() => {
          const at = center(this.screenRectOf(site.x + (site.w - 1) / 2, site.y + (site.h - 1) / 2));
          ring(at, 120);
          burst(at, 26, 90);
          vibrate([14, 40, 20]);
        });
        this.$emit('show-alert', `Nouveau sur ton île : ${built}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le chantier n’a pas pu être bâti.'));
      } finally {
        this.busy = false;
      }
    },
    async startHarvest() {
      this.busy = true;
      try {
        this.site = null;
        this.runResult = null;
        this.runError = '';
        this.run = await playService.harvestStart();
        this.syncLoop();
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La Récolte n’a pas pu commencer.'));
        this.load();
      } finally {
        this.busy = false;
      }
    },
    async finishHarvest(moves) {
      this.sending = true;
      try {
        const { gains, coins, world } = await playService.harvestFinish(this.run.id, moves);
        this.runResult = gains;
        this.apply(world);
        if (coins !== undefined) this.$emit('coins-updated', coins);
        vibrate([12, 40, 18]);
      } catch (error) {
        this.runError = messageOf(error, 'Le serveur n’a pas pu peser ta récolte.');
        this.load();
      } finally {
        this.sending = false;
      }
    },
    closeHarvest() {
      this.run = null;
      this.syncLoop();
    },
    async place(name, x, y) {
      this.picking = null;
      this.busy = true;
      try {
        this.pops.set(name, performance.now());
        const world = await playService.worldPlace(name, x, y);
        this.apply(world);
        // Une nouvelle décoration s'achète : le solde suit (absent pour un simple déplacement)
        if (world.coins !== undefined) this.$emit('coins-updated', world.coins);
        this.$nextTick(() => {
          burst(center(this.screenRectOf(x, y)), 14, 50);
          vibrate([10, 30, 10]);
        });
      } catch (error) {
        this.pops.delete(name);
        this.$emit('show-alert', messageOf(error, 'L’objet n’a pas pu être posé.'));
      } finally {
        this.busy = false;
      }
    },
    // Menu d'une décoration (appui long) : déplacer, retirer
    openTileMenu(tile) {
      const c = this.ground(tile.x, tile.y);
      const sp = this.toScreen(c.x, c.y);
      this.menuPos = { x: Math.max(80, Math.min(this.geo.width - 80, sp.x)), y: Math.max(8, sp.y - TW * this.cam.s * 1.05) };
      this.selected = tile;
    },
    startMove() {
      this.moving = this.selected.element;
      this.selected = null;
      this.draw(performance.now());
    },
    async removeSelected() {
      const tile = this.selected;
      this.selected = null;
      this.busy = true;
      try {
        this.apply(await playService.worldRemove(tile.x, tile.y));
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’objet n’a pas pu être retiré.'));
      } finally {
        this.busy = false;
      }
    },
    // Récolte de la production des bâtiments ; at = point de l'écran d'où partent les éclats
    async collect(at = null) {
      if (this.busy) return;
      const from = at && at.currentTarget ? center(at.currentTarget.getBoundingClientRect()) : at;
      this.busy = true;
      try {
        const { gained, stock, coins, world } = await playService.worldCollect();
        this.apply(world);
        this.$emit('coins-updated', coins);
        const goods = Object.entries(stock || {}).filter(([, n]) => n > 0).map(([r, n]) => `+${n} ${GLYPH[r]}`);
        if (gained > 0 || goods.length) {
          if (from) {
            ring(from, 90);
            burst(from, 20, 70);
          }
          vibrate([12, 40, 18]);
          this.$emit('show-alert', `Récolte de l’île : ${[...goods, ...(gained ? [`+${gained} écu${gained > 1 ? 's' : ''}`] : [])].join(' · ')}`);
        }
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'La récolte n’a pas pu se faire.'));
      } finally {
        this.busy = false;
      }
    },
    // Achat d'un quartier : la brume se dissipe, le panneau éclate
    async buyZone(zone) {
      this.busy = true;
      try {
        const sign = this.signs.find(sg => sg.zone.id === zone.id);
        const { bought, coins, world } = await playService.worldZone(zone.id);
        this.unveils.set(zone.id, performance.now());
        this.zone = null;
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (sign) {
          const sp = this.toScreen(sign.x, sign.y);
          const at = this.canvasPoint(sp.x, sp.y);
          ring(at, 140);
          burst(at, 30, 110);
        }
        vibrate([14, 40, 20]);
        this.$emit('show-alert', `Nouveau quartier : ${bought}\u00a0!`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le quartier n’a pas pu être acheté.'));
      } finally {
        this.busy = false;
      }
    },
    // Achat d'un article en un toucher ; « Annuler » reste proposé UNDO_MS
    async buyItem(site, item, event) {
      const from = event && event.currentTarget ? center(event.currentTarget.getBoundingClientRect()) : null;
      this.busy = true;
      try {
        const { bought, coins, world } = await playService.worldItem(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        if (from) {
          ring(from, 80);
          burst(from, 18, 60);
        }
        vibrate([12, 40, 18]);
        this.$emit('show-alert', item.kind === 'skin' ? `Skin porté : ${bought}\u00a0!` : `Nouveau sur ton île : ${bought}\u00a0!`);
        clearTimeout(this.undoTimer);
        this.undoable = { id: item.id, name: bought };
        this.undoTimer = setTimeout(() => { this.undoable = null; }, UNDO_MS);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’achat n’a pas pu se faire.'));
      } finally {
        this.busy = false;
      }
    },
    // « Annuler » juste après un achat : l'article est rendu, ses écus remboursés par le serveur
    async undoItem() {
      const item = this.undoable;
      if (!item || this.busy) return;
      clearTimeout(this.undoTimer);
      this.undoable = null;
      this.busy = true;
      try {
        const { undone, coins, world } = await playService.worldItemUndo(item.id);
        this.apply(world);
        this.$emit('coins-updated', coins);
        this.$emit('show-alert', `Achat annulé : ${undone}.`);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'L’achat n’a pas pu être annulé.'));
      } finally {
        this.busy = false;
      }
    },
    // Fiche d'un article (toucher sur son dessin, appui long sur son prix)
    describeItem(site, item) {
      vibrate(10);
      this.sheetId = item.id;
    },
    // Achat depuis la fiche : elle se ferme, l'achat reste annulable depuis la boutique
    buyFromSheet(event) {
      const item = this.sheetItem;
      this.sheetId = null;
      if (item) this.buyItem(this.site, item, event);
    },
    // Skin porté par un bâtiment ('' : apparence d'origine)
    async wearSkin(site, skin) {
      this.busy = true;
      try {
        this.apply(await playService.worldSkin(site.id, skin));
        vibrate(8);
      } catch (error) {
        this.$emit('show-alert', messageOf(error, 'Le skin n’a pas pu être changé.'));
      } finally {
        this.busy = false;
      }
    }
  }
};
</script>

<style scoped>
.world { position: relative; }
.world__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; padding: 4px 2px 8px; }
.world__eyebrow { display: block; font-family: var(--oc-font-mono); font-weight: 800; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--oc-on-bg-faint); }
.world__title { display: block; font-family: var(--oc-font-display); font-weight: 700; font-size: 24px; line-height: 1.1; color: var(--oc-on-bg); }
.world__coins {
  flex: none; display: inline-flex; align-items: center; gap: 7px;
  min-height: 38px; padding: 6px 14px;
  border: 1px solid rgba(224, 182, 84, .3); border-radius: 999px;
  background: rgba(224, 182, 84, .08); color: var(--oc-text-faint);
  font-family: var(--font-ui); font-weight: 900; font-size: 15px;
  cursor: pointer;
}
.world__coins.is-ready { background: var(--gold-400); border-color: var(--gold-400); color: var(--ink-900); box-shadow: 0 4px 0 var(--gold-600); animation: world-glow 2s ease-in-out infinite; }
.world__coins:disabled { cursor: default; }
.world__coins-note { font-size: 11px; font-weight: 800; letter-spacing: .02em; opacity: .8; }
@keyframes world-glow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
.world__coin { width: 16px; height: 16px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 1.5px rgba(59, 42, 32, .5); }

.world__hud { display: flex; align-items: stretch; gap: 8px; margin-bottom: 8px; }
.world__stock { flex: 1; min-width: 0; display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 6px; margin: 0; padding: 0; list-style: none; }
.world__res {
  display: flex; align-items: center; justify-content: center; gap: 4px;
  min-height: 46px; border-radius: 14px; background: var(--vellum-100); color: var(--ink-900);
  font-family: var(--font-ui); font-size: 17px;
}
.world__res strong { font-size: 15px; font-weight: 900; font-variant-numeric: tabular-nums; }
.world__play {
  flex: none; display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-width: 108px; padding: 4px 12px; border: 0; border-radius: 16px;
  background: var(--gold-400); color: var(--ink-900); box-shadow: 0 4px 0 var(--gold-600);
  font-family: var(--font-ui); cursor: pointer;
}
.world__play:active { transform: translateY(2px); box-shadow: 0 2px 0 var(--gold-600); }
.world__play:disabled { background: #6E6253; color: #D8CCBA; box-shadow: none; cursor: default; }
.world__play-label { font-family: var(--font-display); font-size: 17px; font-weight: 700; line-height: 1.1; }
.world__play-sub { font-size: 11px; font-weight: 800; opacity: .85; white-space: nowrap; }

.world__stage { position: relative; border-radius: 22px; overflow: hidden; }
.world__canvas { display: block; width: 100%; touch-action: none; cursor: grab; }
.world__zoom { position: absolute; right: 10px; top: 10px; display: flex; flex-direction: column; gap: 6px; }
.world__zoom button {
  width: 38px; height: 38px; border: 0; border-radius: 12px;
  background: rgba(251, 246, 234, .92); color: var(--ink-900);
  font-size: 22px; font-weight: 900; line-height: 1; cursor: pointer;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .25);
}
.world__banner, .world__error {
  position: absolute; left: 50%; bottom: 10px; transform: translateX(-50%);
  width: max-content; max-width: 92%; margin: 0; padding: 8px 14px; border-radius: 14px;
  background: rgba(30, 22, 16, .82); color: #F6EEDD;
  font-family: var(--font-ui); font-size: 13px; font-weight: 700; text-align: center;
}
.world__link { margin-left: 6px; border: 0; background: none; color: #F2C04B; font: inherit; font-weight: 900; cursor: pointer; text-decoration: underline; }
.world__menu {
  position: absolute; transform: translate(-50%, -100%);
  display: flex; align-items: center; gap: 6px;
  padding: 6px 8px; border-radius: 16px;
  background: var(--vellum-100); color: var(--ink-900);
  box-shadow: 0 10px 26px rgba(0, 0, 0, .45);
  font-family: var(--font-ui);
  z-index: 2;
}
.world__menu-name { font-weight: 900; font-size: 13px; padding: 0 4px; white-space: nowrap; }
.world__menu-btn { min-height: 34px; padding: 4px 12px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font: inherit; font-weight: 800; font-size: 13px; cursor: pointer; }
.world__menu-btn--quiet { background: var(--vellum-200); color: var(--ink-500); }
.world__note { margin: 8px 2px 0; color: var(--oc-on-bg-faint); font-size: 13px; font-style: italic; }
.world__guest { padding: 28px 20px; border-radius: 22px; background: var(--vellum-100); color: var(--ink-900); text-align: center; font-family: var(--font-ui); }
.world__guest-title { margin: 0; font-family: var(--font-display); font-size: 26px; font-weight: 700; }
.world__guest-text { margin: 10px 0 18px; color: var(--ink-500); }
.world__btn { min-height: 46px; padding: 10px 22px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font-family: var(--font-ui); font-weight: 900; font-size: 15px; cursor: pointer; }
.world__btn:disabled { opacity: .45; cursor: default; }
.world__btn--small { min-height: 32px; padding: 4px 12px; font-size: 13px; margin-left: 6px; }
.world__btn--quiet { background: var(--vellum-200); color: var(--ink-900); }

.world__sheet-backdrop { position: fixed; inset: 0; z-index: 70; background: rgba(10, 8, 6, .55); display: flex; align-items: flex-end; justify-content: center; }
.world__sheet {
  width: min(100%, 560px); max-height: 74dvh; display: flex; flex-direction: column;
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom));
  border-radius: 24px 24px 0 0; background: var(--vellum-100); color: var(--ink-900);
  font-family: var(--font-ui); overflow-y: auto;
}
.world__sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 10px; }
.world__sheet-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; }
.world__sheet-title small { font-family: var(--font-ui); font-size: 12px; font-weight: 800; color: var(--ink-500); margin-left: 4px; }
.world__sheet .world__link { color: #8A5A1C; }
.world__site-effect { margin: 0 0 10px; padding: 8px 12px; border-radius: 12px; background: var(--vellum-200); font-weight: 700; }
/* Fiche d'un bâtiment : vignette, quartier, niveau en pastilles, onglets */
.world__site-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.world__site-art { width: 76px; height: 84px; flex: none; object-fit: contain; object-position: center bottom; border-radius: 16px; background: radial-gradient(circle at 50% 70%, #CFE8B8, var(--vellum-200) 70%); }
.world__site-id { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.world__site-id .world__eyebrow { color: var(--ink-500); }
.world__pips { display: flex; gap: 5px; margin-top: 4px; }
.world__pip { width: 16px; height: 6px; border-radius: 3px; background: var(--vellum-300); }
.world__pip.is-on { background: linear-gradient(90deg, var(--gold-400), var(--gold-600)); }
.world__tabs { display: flex; gap: 6px; padding: 4px; margin-bottom: 12px; border-radius: 999px; background: var(--vellum-200); }
.world__tab { flex: 1; min-height: 40px; border: 0; border-radius: 999px; background: transparent; color: var(--ink-700); font-family: var(--font-ui); font-weight: 900; font-size: 14px; cursor: pointer; position: relative; touch-action: manipulation; }
.world__tab.is-on { background: var(--vellum-50); color: var(--ink-900); box-shadow: 0 2px 0 var(--vellum-400); }
.world__tab-dot { position: absolute; top: 8px; right: 14px; width: 8px; height: 8px; border-radius: 50%; background: var(--gold-500); box-shadow: 0 0 0 2px var(--vellum-50); }
.world__panel { display: flex; flex-direction: column; gap: 10px; }
.world__prod { display: grid; gap: 6px; }
.world__prod-row { display: flex; justify-content: space-between; align-items: center; gap: 10px; min-height: 40px; padding: 6px 12px; border-radius: 12px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .08); font-size: 14px; }
.world__prod-row span { color: var(--ink-500); font-weight: 800; }
.world__prod-row.is-pending { background: var(--gold-200); }
/* Évolution : paliers en frise verticale (atteint, prochain, à venir) */
.world__steps { margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; }
.world__step { display: flex; gap: 12px; position: relative; }
.world__step:not(:last-child)::after { content: ''; position: absolute; left: 15px; top: 34px; bottom: -10px; width: 2px; background: var(--vellum-300); }
.world__step-mark { flex: none; width: 32px; height: 32px; display: grid; place-items: center; border-radius: 50%; background: var(--vellum-300); color: var(--ink-700); font-weight: 900; z-index: 1; }
.world__step.is-done .world__step-mark { background: #8FCB6B; color: #FFFFFF; }
.world__step.is-next .world__step-mark { background: linear-gradient(180deg, var(--gold-300), var(--gold-500)); color: var(--ink-900); box-shadow: 0 0 0 3px var(--gold-200); }
.world__step-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; padding-bottom: 4px; }
.world__step-name { font-family: var(--font-display); font-weight: 700; font-size: 18px; }
.world__step-effect { color: var(--ink-500); font-size: 13px; font-weight: 700; }
.world__step.is-later { opacity: .62; }
/* Boutique : rubriques, cartes en deux colonnes (vignette, nom, effet, bouton d'achat en deux touchers) */
.world__shop-note { margin: 0; padding: 8px 12px; border-radius: 12px; background: var(--gold-200); font-weight: 800; font-size: 14px; }
.world__shop-note span { color: var(--ink-500); font-weight: 700; font-size: 12px; }
.world__shop-group { display: flex; flex-direction: column; gap: 8px; }
.world__shop-title { margin: 4px 2px 0; font-family: var(--font-display); font-size: 17px; font-weight: 700; }
.world__cards { margin: 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
.world__card {
  display: flex; flex-direction: column; gap: 4px; min-width: 0;
  padding: 8px; border-radius: 16px; background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .1);
}
.world__card.is-worn { box-shadow: inset 0 0 0 2px var(--gold-500); }
.world__card.is-locked .world__card-art img { filter: grayscale(.7) opacity(.6); }
.world__card-open {
  appearance: none; display: flex; flex-direction: column; gap: 4px; padding: 0; border: 0; background: none;
  color: inherit; font: inherit; text-align: left; cursor: pointer; touch-action: manipulation;
}
.world__card-palier {
  position: absolute; top: 6px; left: 6px; min-width: 24px; padding: 1px 6px; border-radius: 999px;
  background: var(--ink-900); color: var(--gold-300); font-family: var(--font-display); font-weight: 700; font-size: 12px; text-align: center;
}
.world__card.is-locked .world__card-palier { background: var(--vellum-300); color: var(--ink-700); }
.world__card-palier--rare { background: linear-gradient(135deg, #F2C04B, #C9952A); color: var(--ink-900); }
.world__card.is-rare { box-shadow: inset 0 0 0 1px rgba(201, 149, 42, .55); }
.world__card.is-rare.is-worn { box-shadow: inset 0 0 0 2px var(--gold-500); }
.world__card-art {
  position: relative; display: grid; place-items: center; height: 78px; border-radius: 12px;
  background: radial-gradient(circle at 50% 72%, #CFE8B8, var(--vellum-200) 72%);
}
.world__card-art img { position: absolute; inset: 0; width: 100%; height: 100%; padding: 6px 10px; box-sizing: border-box; object-fit: contain; }
.world__card-badge {
  position: absolute; top: 6px; right: 6px; padding: 1px 7px; border-radius: 999px;
  background: #4E8A3A; color: #FFFFFF; font-size: 11px; font-weight: 900;
}
.world__card-name { font-weight: 900; font-size: 14px; line-height: 1.2; }
.world__card-effect { flex: 1; color: var(--ink-500); font-size: 12px; font-weight: 700; line-height: 1.3; }
.world__card-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 5px;
  min-height: 40px; padding: 6px 10px; border: 0; border-radius: 999px;
  background: var(--ink-900); color: var(--vellum-50);
  font-family: var(--font-ui); font-weight: 900; font-size: 14px; cursor: pointer; touch-action: manipulation;
}
.world__card-btn:disabled { background: var(--vellum-300); color: var(--ink-500); cursor: default; font-size: 12px; }
/* Bandeau d'annulation d'un achat (4 s) */
.world__undo {
  position: sticky; bottom: 0; margin-top: 10px; padding: 8px 8px 8px 14px; border-radius: 999px;
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  background: var(--ink-900); color: var(--vellum-50); font-weight: 800;
  box-shadow: 0 6px 18px rgba(40, 28, 18, .3);
}
.world__undo-btn { appearance: none; border: 0; cursor: pointer; min-height: 34px; padding: 4px 14px; border-radius: 999px; background: var(--gold-400); color: var(--ink-900); font-weight: 900; }
.world-undo-enter-active, .world-undo-leave-active { transition: opacity .2s ease, transform .2s ease; }
.world-undo-enter-from, .world-undo-leave-to { opacity: 0; transform: translateY(8px); }
.world__card-btn--quiet { background: var(--vellum-200); color: var(--ink-900); }
.world__card-owned { display: grid; place-items: center; min-height: 40px; color: #4E8A3A; font-size: 13px; font-weight: 900; }
.world__coin--small { width: 13px; height: 13px; }
.world__pick-note { margin: 0 0 8px; color: var(--ink-500); font-size: 13px; }
.world__needs { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
/* Fiche de Brume : sa réplique, puis l'objectif, son avancée et la récompense */
.world__quest-eyebrow { color: var(--ink-500); margin-bottom: 6px; }
.world__brume-title { display: inline-flex; align-items: center; gap: 8px; }
.world__brume-say { margin: 0 0 12px; font-family: var(--font-display); font-style: italic; font-size: 17px; line-height: 1.4; }
.world__quest { display: grid; grid-template-columns: 1fr auto; gap: 6px 10px; padding: 10px 12px; border-radius: 14px; background: var(--vellum-200); }
.world__quest-label { font-weight: 900; }
.world__quest-count { font-family: var(--oc-font-mono); font-weight: 800; }
.world__quest-bar { grid-column: 1 / -1; height: 8px; border-radius: 999px; background: var(--vellum-300, #E6D8B8); overflow: hidden; }
.world__quest-bar i { display: block; height: 100%; border-radius: inherit; background: var(--oc-gold); transition: width var(--oc-fast) var(--oc-ease-out); }
.world__quest-reward { grid-column: 1 / -1; font-size: 14px; color: var(--ink-500); }
.world__need { display: flex; align-items: center; gap: 10px; min-height: 44px; padding: 6px 12px; border-radius: 12px; background: var(--vellum-50); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .08); }
.world__need em { margin-left: auto; font-size: 12px; font-weight: 800; font-style: normal; }
.world__need.is-ok em, .world__need.is-ok strong { color: #4E8A3A; }
.world__need.is-missing em, .world__need.is-missing strong { color: #B0503A; }
.world__need-glyph { width: 28px; font-size: 22px; text-align: center; }
.world__sheet-actions { display: flex; flex-wrap: wrap; gap: 8px; }
.world__search { width: 100%; padding: 8px 12px; border-radius: 12px; border: 1px solid var(--vellum-300); background: var(--vellum-50); color: var(--ink-900); font: inherit; font-size: 15px; }
.world__grid { margin-top: 10px; overflow-y: auto; display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); gap: 14px 8px; padding: 8px 2px 10px; }
.world__empty { grid-column: 1 / -1; color: var(--ink-500); font-style: italic; text-align: center; }
.world-sheet-enter-active, .world-sheet-leave-active { transition: opacity .25s ease; }
.world-sheet-enter-active .world__sheet, .world-sheet-leave-active .world__sheet { transition: transform .3s cubic-bezier(.3, 1.2, .5, 1); }
.world-sheet-enter-from, .world-sheet-leave-to { opacity: 0; }
.world-sheet-enter-from .world__sheet, .world-sheet-leave-to .world__sheet { transform: translateY(100%); }
@media (prefers-reduced-motion: reduce) {
  .world__coins.is-ready { animation: none; }
}
</style>
