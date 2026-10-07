<template>
  <section :class="['world', { 'world--immersive': immersive }]" aria-label="Le Monde">
    <!-- Invité : l'île demande un compte (ses ressources et écus sont gardés par le serveur) -->
    <div v-if="guest" class="world__guest">
      <p class="world__guest-title">Ton île t’attend.</p>
      <p class="world__guest-text">Crée un compte pour bâtir ton île : chantiers, récoltes et créations y sont gardés pour toi.</p>
      <button type="button" class="world__btn" @click="$emit('login')">Se connecter · créer un compte</button>
    </div>

    <template v-else>
      <!-- L'île de bord à bord : en haut, une barre qui flotte par-dessus (horloge, écus, réserves, Récolte) ;
           masquée en plein écran -->
      <div ref="top" class="world__top">
        <IslandHud
          :clock="state ? skyClock : null"
          :warping="warping"
          :coins="coins"
          :harvestable="harvestable"
          :stock="state ? state.stock : null"
          :charges="state ? state.charges.count : 0"
          :charges-text="chargesText"
          :busy="busy"
          @warp="toggleWarp"
          @collect="collect"
          @harvest="startHarvest"
        />
      </div>
      <div ref="stage" class="world__stage">
        <!-- Les gestes passent par les pointeurs ; touchend annulé : pas de clic fantôme après un toucher au doigt (il
             tomberait sur le fond de la fiche qui vient de s'ouvrir et la refermerait aussitôt) -->
        <canvas
          ref="canvas"
          class="world__canvas"
          role="img"
          :aria-label="canvasLabel"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onCancel"
          @touchend.prevent
          @wheel.prevent="onWheel"
        ></canvas>
        <!-- Compteur d'images (« ?perf ») -->
        <p v-if="perfText" class="world__perf" aria-hidden="true">{{ perfText }}</p>
        <IslandButtons
          v-if="state"
          :chests="Boolean(state.chests)"
          :chest-count="chestCount"
          :landmarks="shownLandmarks.length > 0"
          :waiting-landmarks="waitingLandmarks"
          :finds="Boolean(shownDeposits.length || ownedFinds)"
          :ready-deposits="readyDeposits"
          :trip-left="state.expedition ? tripLeft : ''"
          :immersive="immersive"
          @chests="chestsOpen = true"
          @log="openLog()"
          @finds="findsOpen = true"
          @trip="showExpedition"
          @zoom="zoomBy"
          @immersive="toggleImmersive"
        />
        <p v-if="loadError" class="world__error" role="alert">
          L’île ne répond pas.
          <button type="button" class="world__btn world__btn--small" @click="load">Réessayer</button>
        </p>
        <p v-else-if="craftPlacing && placingCraft" class="world__banner" role="status">
          {{ craftBanner }}
          <button type="button" class="world__link" @click="cancelCraft">Annuler</button>
        </p>
        <p v-else-if="annexPlacing && placingAnnex" class="world__banner" role="status">
          {{ annexBanner }}
          <button type="button" class="world__link" @click="cancelAnnex">Annuler</button>
        </p>

        <!-- Appui long ailleurs : une bulle dit ce que c'est et ce que fait un toucher -->
        <transition name="world-tip">
          <div v-if="tip" :class="['world__tip', { 'is-below': tip.below }]" role="status" :style="{ left: `${tip.x}px`, top: `${tip.y}px` }">
            <strong class="world__tip-title">{{ tip.title }}</strong>
            <span v-if="tip.text" class="world__tip-text">{{ tip.text }}</span>
            <span v-if="tip.hint" class="world__tip-hint">{{ tip.hint }}</span>
            <button v-if="tip.action" type="button" class="world__tip-btn" @click="runPick">{{ tip.action }}</button>
          </div>
        </transition>

        <!-- Appui long sur une création d'île : la déplacer ou la ranger dans la réserve de l'établi -->
        <div v-if="craftMenu && !craftPlacing" class="world__menu" :style="menuStyle" role="dialog" :aria-label="craftName(craftMenu.craft)">
          <span class="world__menu-name">{{ craftName(craftMenu.craft) }}</span>
          <button type="button" class="world__menu-btn" @click="moveFromMenu">Déplacer</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" :disabled="busy" @click="storeFromMenu">Ranger</button>
        </div>

        <!-- Pose d'une création : la case dorée choisie ; poser ici ou choisir une autre case -->
        <div v-if="craftConfirm && placingCraft" class="world__menu" :style="craftConfirmStyle" role="dialog" :aria-label="`Poser ${placingCraft.name}`">
          <span class="world__menu-name">{{ placingCraft.name }}</span>
          <button type="button" class="world__menu-btn" :disabled="busy" @click="confirmCraft">Poser ici</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="craftConfirm = null">Autre case</button>
        </div>

        <!-- Pose d'une annexe : la case dorée choisie, son prix ; poser ici ou choisir une autre case -->
        <div v-if="annexConfirm && placingAnnex && placingAnnex.next" class="world__menu" :style="annexConfirmStyle" role="dialog" :aria-label="`Poser ${placingAnnex.name}`">
          <span class="world__menu-name">{{ placingAnnex.name }} · {{ placingAnnex.next.coins }}<span class="world__coin world__coin--small" aria-hidden="true"></span></span>
          <button type="button" class="world__menu-btn" :disabled="busy" @click="confirmAnnex">Poser ici</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" @click="annexConfirm = null">Autre case</button>
        </div>
      </div>

      <p v-if="state" class="world__note">
        Tes bâtiments produisent ressources et écus, la Récolte aussi. À l’établi du Foyer, assemble des créations pour embellir l’île.
      </p>
    </template>

    <!-- Fiches de l'île : rendues dans le document (au-dessus de la barre d'onglets) -->
    <teleport to="body">
      <!-- Fiche d'un bâtiment : aperçu (production, récolte) et évolution (tous les paliers) -->
      <transition name="world-sheet">
        <SiteSheet
          v-if="site"
          :site="site"
          :tab="siteTab"
          :art="artOf(site)"
          :zone-name="zoneName(site.zone)"
          :build-ready="Boolean(canBuild(site))"
          :annex-ready="annexReady(site, stockAll, coins)"
          @tab="tab => (siteTab = tab)"
          @rename="startRename"
          @close="site = null"
        >
          <SiteOverview
            v-if="siteTab === 'overview'"
            :site="site"
            :rates="state.rates"
            :cap-hours="state.capHours"
            :pending="state.pending"
            :friend="friendAt(site.id)"
            :civ-stage="civStage"
            :villagers="state.villagers || []"
            :needs="state.needs || null"
            :portraits="villagerPortraits()"
            :visitor="state.visitor || null"
            :visitor-art="state.visitor ? visitorPortrait(state.visitor) : ''"
            :crafts="state.crafts || null"
            :games="state.games || []"
            :busy="busy"
            @collect="collect"
            @villager="openVillager"
            @visitor="openVisitor"
            @fill-all="fillAllNeeds"
            @bench="openBench"
            @game="openGame"
            @evolution="siteTab = 'evolution'"
          />

          <!-- Boutique : outils et objets (effets), pièces rares, skins et teintes (apparence), rangés par palier ; un toucher
               sur le prix achète (annulable 4 s), un toucher sur le dessin ou un appui long sur le prix ouvre la fiche -->
          <SiteShop
            v-else-if="siteTab === 'shop'"
            ref="shop"
            :site="site"
            :signs="state.signs || null"
            :coins="coins"
            :busy="busy"
            :undoable="undoable"
            @describe="item => describeItem(site, item)"
            @buy="(item, event) => buyItem(site, item, event)"
            @wear="skin => wearSkin(site, skin)"
            @sign="look => chooseSign(site, look)"
            @rename="renameSigns"
            @undo="undoItem"
          />

          <!-- Annexes : champs, filons, viviers… à poser autour du bâtiment (la case se choisit sur la carte) -->
          <AnnexPanel v-else-if="siteTab === 'annexes'" :site="site" :stock="stockAll" :coins="coins" :busy="busy" @place="annex => startAnnex(site, annex)" />

          <SiteSteps v-else :site="site" :stock="state.stock" :charges="state.charges.count" :coins="coins" :busy="busy" @build="build(site)" @harvest="startHarvest" />
        </SiteSheet>
      </transition>

      <!-- Naufrage (bible, § 6.7 et § 14) : une nuit, une épave au loin, la brume, et Brume ; un toucher pour continuer -->
      <transition name="world-wreck">
        <WreckScene v-if="wreck" :wreck="wreck" @close="closeWreck" />
      </transition>
      <!-- Brume : sa réplique, la quête active, son avancée, sa récompense -->
      <transition name="world-sheet">
        <BrumeSheet
          v-if="questOpen && state && state.brume"
          v-model:people-name="peopleName"
          :brume="state.brume"
          :quest="quest"
          :civ-stage="civStage"
          :stage="brumeState.stage"
          :charges="state.charges.count"
          :charges-text="chargesText"
          :action="questAction ? questAction.label : ''"
          :savoir="state.brumeSavoir || null"
          :said="brumeSaid"
          :hint="Boolean(brumeHint)"
          :busy="busy"
          @claim="claimQuest"
          @harvest="questHarvest"
          @name="namePeople"
          @action="runQuestAction"
          @talk="talkBrume"
          @grimoire="openBrumeSavoir"
          @close="questOpen = false"
        />
      </transition>
      <!-- Quartier à acheter : prix en écus et chapitre du Livre -->
      <transition name="world-sheet">
        <ZoneSheet
          v-if="zone"
          :zone="zone"
          :sites="sitesIn(zone)"
          :stock="state.stock"
          :charges="state.charges.count"
          :expedition="state.expedition || null"
          :trip-left="tripLeft"
          :busy="busy"
          @explore="explore(zone)"
          @buy="buyZone(zone)"
          @close="zone = null"
        />
      </transition>

    </teleport>

    <ShopItemSheet
      v-if="sheetItem"
      :site="sheetSite"
      :item="sheetItem"
      :art="itemArt(sheetSite, sheetItem)"
      :lock="lockOf(sheetSite, sheetItem)"
      :busy="busy"
      :max-moves="state.harvest.maxMoves"
      :max-charges="state.charges.max"
      @buy="buyFromSheet"
      @wear="skin => wearSkin(sheetSite, skin)"
      @close="sheet = null"
    />

    <!-- Établi (créations d'île) et assemblage d'une création -->
    <CraftBench
      v-if="benchOpen && state && state.crafts"
      :crafts="state.crafts"
      :stock="stockAll"
      :element-emojis="elementEmojis"
      :busy="busy || craftStarting"
      @assemble="assemble"
      @place="placeFromBench"
      @close="benchOpen = false"
    />
    <CraftPuzzle
      v-if="craftRun"
      :run="craftRun"
      :name="craftName(craftRun.craft)"
      :sending="craftSending || craftStarting"
      :error="craftError"
      :made="craftMade"
      @finish="finishCraft"
      @restart="assemble(craftRun.craft)"
      @place="placeFromPuzzle"
      @close="closePuzzle"
    />

    <!-- Fiche d'une annexe posée (appui long) : la déplacer, ou ouvrir son bâtiment -->
    <AnnexSheet v-if="sheetAnnex" v-bind="sheetAnnex" :busy="busy" @close="annexSheet = null" @move="moveFromSheet" @site="siteFromSheet" />

    <!-- Premier achat d'une sorte d'article : son mode d'emploi, et de quoi aller le voir sur l'île -->
    <GModal v-if="guideItem" eyebrow="Mode d’emploi" :title="guideItem.name" :width="400" @close="closeGuide">
      <dl class="world__guide">
        <div><dt>Où</dt><dd>{{ guideText.where }}</dd></div>
        <div><dt>Comment</dt><dd>{{ guideText.how }}</dd></div>
        <div><dt>Pourquoi</dt><dd>{{ guideText.why }}</dd></div>
      </dl>
      <template #actions>
        <button type="button" class="g-btn g-btn--ghost" @click="closeGuide">Compris</button>
        <button type="button" class="g-btn" @click="showGuideOnIsland">Voir sur l’île</button>
      </template>
    </GModal>

    <!-- Renommer un bâtiment ou un quartier -->
    <RenameSheet
      v-if="renameTarget"
      :key="`${renaming.kind}:${renaming.id}`"
      :eyebrow="renameTarget.eyebrow"
      :title="renameTarget.title"
      :current="renameTarget.current"
      :base="renameTarget.base"
      :busy="busy"
      @save="saveName"
      @close="renaming = null"
    />
    <!-- Habitant : sa fiche (bavarder, offrir) ; un coffre gagné s'ouvre par-dessus -->
    <VillagerSheet
      v-if="villagerView && state"
      :villager="villagerView"
      :rules="state.friendship"
      :need-rules="state.needs"
      :stock="state.stock"
      :site-name="villagerSiteName"
      :portrait="portraitOf(villagerView.id)"
      :said="villagerSaid"
      :popped="villagerPopped"
      :busy="busy"
      :art="savoirOf(villagerView.id)"
      :savoir="villagerSavoir"
      @talk="talkVillager"
      @gift="giftVillager"
      @fill="fillNeed"
      @grimoire="openSavoir"
      @close="villagerId = null"
    />
    <!-- Bête de ferme : sa fiche (bible, § 6.16) ; la nourrir, ramasser les bulles -->
    <BeastSheet
      v-if="beastView && state"
      :beast="beastView"
      :cost="state.beasts.cost"
      :stock="state.stock"
      :portrait="beastPortrait(beastView.id)"
      :busy="busy"
      @feed="feedBeast"
      @collect="collectBeasts()"
      @close="beastId = null"
    />
    <!-- Visiteur arrivé en bateau : sa fiche (demande, récompense) -->
    <VisitorSheet
      v-if="visitorOpen && state && state.visitor"
      :visitor="state.visitor"
      :stock="state.stock"
      :charges="state.charges.count"
      :houses="state.houses || undefined"
      :work-name="siteName(state.visitor.site)"
      :portrait="visitorPortrait(state.visitor)"
      :said="visitorSaid"
      :busy="busy"
      @satisfy="satisfyVisitor"
      @harvest="visitorHarvest"
      @settle="settleVisitor"
      @close="visitorOpen = false"
    />
    <!-- Coffres : la liste (jour, en attente), puis l'ouverture d'un coffre, ou de tous d'un coup -->
    <ChestList v-if="chestsOpen && state" :chests="state.chests" :busy="busy" @open="openChest" @open-all="openAllChests" @close="chestsOpen = false" />
    <FindsSheet v-if="findsOpen && state" :finds="state.finds || []" :deposits="state.deposits || []" :zones="state.map.zones" :elapsed="clock - loadedAt" @close="findsOpen = false" />
    <ExplorerLog
      v-if="logOpen && state"
      :landmarks="state.landmarks || []"
      :zones="state.map.zones"
      :focus="logFocus"
      :acts="(state.brume && state.brume.acts) || []"
      :people="state.people || null"
      :elements="elements"
      :heliane="(state.heliane && state.heliane.found) || []"
      :anya="state.anya || null"
      @show="showLandmark"
      @replay="act => { logOpen = false; $emit('replay-vigil', act); }"
      @replay-anya="logOpen = false; $emit('replay-anya')"
      @close="logOpen = false"
    />
    <ChestReveal v-if="reveal" v-bind="reveal" :busy="busy" @wear="wearRevealed" @close="reveal = null" />
    <ChestHaul v-if="haul && state" :items="haulItems" :note="haulNote" :busy="busy" @wear="wearHauled" @close="haul = null" />

    <MiniGame
      v-if="gameId && gameView"
      :game="gameView"
      :site-name="gameSiteName"
      :run="gameRun"
      :starting="gameStarting"
      :sending="gameSending"
      :result="gameResult"
      :error="gameError"
      @start="startGame"
      @finish="finishGame"
      @close="closeGame"
    />
    <HarvestGame
      v-if="run"
      :run="run"
      :sending="sending"
      :result="runResult"
      :error="runError"
      :chest="runChest ? runChest.rarity : ''"
      @finish="finishHarvest"
      @close="closeHarvest"
    />
  </section>
</template>

<script>
import playService from '@/services/playService';
import HarvestGame from '../Games/HarvestGame/HarvestGame.vue';
import ShopItemSheet from '../Sites/ShopItemSheet/ShopItemSheet.vue';
import ChestList from '../Chests/ChestList/ChestList.vue';
import ChestReveal from '../Chests/ChestReveal/ChestReveal.vue';
import ChestHaul from '../Chests/ChestHaul/ChestHaul.vue';
import AnnexPanel from '../Sites/AnnexPanel/AnnexPanel.vue';
import AnnexSheet from '../Sites/AnnexSheet/AnnexSheet.vue';
import MiniGame from '../Games/MiniGame/MiniGame.vue';
import VillagerSheet from '../Folk/VillagerSheet/VillagerSheet.vue';
import BeastSheet from '../Folk/BeastSheet/BeastSheet.vue';
import VisitorSheet from '../Folk/VisitorSheet/VisitorSheet.vue';
import RenameSheet from '../Sites/RenameSheet/RenameSheet.vue';
import CraftBench from '../Workshop/CraftBench/CraftBench.vue';
import CraftPuzzle from '../Workshop/CraftPuzzle/CraftPuzzle.vue';
import ExplorerLog from '../Explore/ExplorerLog/ExplorerLog.vue';
import FindsSheet from '../Explore/FindsSheet/FindsSheet.vue';
import WreckScene from '../Explore/WreckScene/WreckScene.vue';
import BrumeSheet from '../Explore/BrumeSheet/BrumeSheet.vue';
import ZoneSheet from '../Sites/ZoneSheet/ZoneSheet.vue';
import SiteShop from '../Sites/SiteShop/SiteShop.vue';
import SiteSteps from '../Sites/SiteSteps/SiteSteps.vue';
import SiteOverview from '../Sites/SiteOverview/SiteOverview.vue';
import SiteSheet from '../Sites/SiteSheet/SiteSheet.vue';
import IslandHud from '../Hud/IslandHud/IslandHud.vue';
import IslandButtons from '../Hud/IslandButtons/IslandButtons.vue';
import { missingOf } from '@/world/needs';
import { landmarksShown, landmarksWaiting } from '@/world/landmarks';
import { depositsShown, depositsReady } from '@/world/finds';
import { CLIMATE_NAMES } from '@/world/climates';
import { variantsOf } from '@/world/annexes';
import GModal from '@/components/ui/GModal/GModal.vue';
import { villageOf } from '@/world/village';
import { clearDrawings } from '@/book/painter';
import { reducedMotion } from '@/utils/fx';
import { clearSprites } from '@/world/spriteCache';
import { islandOf, liveOf, TerrainCache } from '@/world/terrain';
import { FLOATING_ZONE, isletsOf } from '@/world/islets';
import { seaOf } from '@/world/sea';
import { stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook, secretDue, secretOf } from '@/game/opus';
import { faceHref, builtOf } from '@/world/faces';
import { guide } from '@/game/guide';
import { forcedPhase } from '@/world/scene';
import { perfWanted, perfMeter } from '@/world/perf';
import cameraMethods from '@/world/view/camera';
import drawMethods from '@/world/view/draw';
import gestureMethods from '@/world/view/gestures';
import { memory } from '@/world/view/memory';
import folk from './folk';
import games from './games';
import chests from './chests';
import workshop from './workshop';
import sites from './sites';
import annexes from './annexes';
import explore from './explore';
import terrain from './terrain';
import sky from './sky';

// Le Monde : l'île du joueur en isométrique (Canvas 2D), avec une caméra qu'on fait glisser et zoomer.
// L'état vient du serveur (chantiers, réserves, parties, créations d'île) ; le dessin, la caméra et la boucle
// d'animation sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.
export default {
  name: 'WorldView',
  // Chaque sujet de l'île vit dans son fichier, à côté (mixins) : les gens, les jeux, les coffres, l'établi, les
  // bâtiments, les annexes, l'exploration, la carte, le ciel ; le moteur du canvas (caméra, dessin, gestes) dans
  // world/view/. L'île garde ce qui les relie : le chargement, la quête, le plein écran, les observateurs, le cycle
  // de vie
  mixins: [folk, games, chests, workshop, sites, annexes, explore, terrain, sky],
  components: { HarvestGame, ShopItemSheet, GModal, ChestList, ChestReveal, ChestHaul, AnnexPanel, AnnexSheet, MiniGame, VillagerSheet, BeastSheet, VisitorSheet, RenameSheet, CraftBench, CraftPuzzle, ExplorerLog, FindsSheet, WreckScene, BrumeSheet, ZoneSheet, SiteShop, SiteSteps, SiteOverview, SiteSheet, IslandHud, IslandButtons },
  props: {
    // Glyphes des éléments du Livre (savoir-faire demandé à l'établi)
    elementEmojis: { type: Object, required: true },
    // Éléments écrits dans le Grimoire : le Bestiaire vivant et les familiers (bible, § 6.5)
    elements: { type: Array, default: () => [] },
    isLoggedIn: { type: Boolean, default: false },
    // Solde d'écus (en-tête) : grise les articles hors de portée ; le serveur reste seul juge
    coins: { type: Number, default: null }
  },
  emits: ['coins-updated', 'show-alert', 'login', 'go', 'quest', 'replay-vigil', 'replay-anya', 'loading', 'loaded'],
  data() {
    return {
      state: null,
      guest: false,
      loadError: false,
      busy: false,
      // Bulle d'info de l'appui long : { x, y, below, title, text, hint }
      tip: null,
      // Texte du compteur d'images (« ?perf »)
      perfText: '',
      // Plein écran : l'île seule, sans la barre du haut ni la barre d'onglets
      immersive: false,
      clock: Date.now(),
      // Fiche de Brume (quête active) ouverte
      questOpen: false,
      // Nom du peuple en cours de saisie (quête « peuple »)
      peopleName: ''
    };
  },
  computed: {
    // Ce que propose Brume pour la quête active pas encore faite (hors Récolte et nom du peuple) : { label, run } ou null
    questAction() {
      const quest = this.quest;
      const state = this.state;
      if (!quest || quest.done || !state) return null;
      const target = quest.target || {};
      const grimoire = { label: quest.ariane ? 'Voir dans le Grimoire' : 'Ouvrir le Grimoire', run: () => this.$emit('go', 'infinite') };
      const sheetOf = id => ({ label: 'Fiche du Foyer', run: () => this.openSiteSheet(id, 'annexes') });
      const look = (label, cell) => (cell ? { label, run: () => this.lookAtCell(cell.x, cell.y) } : null);
      if (quest.chapter || quest.ariane || quest.kind === 'stars' || quest.kind === 'element') return grimoire;
      if (quest.kind === 'need' || quest.kind === 'wake') {
        const who = (state.villagers || []).find(v => v.id === target.villager);
        return who ? { label: `Voir ${who.name}`, run: () => this.openVillager(who.id) } : null;
      }
      if (quest.kind === 'heart') {
        const best = (state.villagers || []).reduce((a, b) => (!a || b.points > a.points ? b : a), null);
        return best ? { label: `Voir ${best.name}`, run: () => this.openVillager(best.id) } : null;
      }
      if (quest.kind === 'crafts' || quest.kind === 'craft') return { label: 'Ouvrir l’établi', run: () => this.openBench() };
      if (quest.kind === 'annex' || quest.kind === 'house') return sheetOf('foyer');
      if (quest.kind === 'visitor' || quest.kind === 'settle') {
        return state.visitor ? { label: 'Voir le voyageur', run: () => this.openVisitor() } : look('Montrer le Ponton', state.sites.find(s => s.id === 'ponton'));
      }
      if (quest.kind === 'expedition') {
        const zone = state.map.zones.find(z => z.known === false && z.explorable && z.anchor);
        return look('Montrer une terre à explorer', zone && zone.anchor);
      }
      if (quest.kind === 'landmark' && !target.landmark) return look('Montrer un lieu', landmarksWaiting(state)[0]);
      if (quest.kind === 'gather') return look('Montrer un gisement', depositsReady(state)[0]);
      return quest.target ? { label: 'Montrer', run: () => this.showQuestTarget() } : null;
    },
    // Ressources et trouvailles de climat ensemble (ce que coûtent créations et annexes de climat)
    stockAll() {
      return this.state ? { ...this.state.stock, ...Object.fromEntries((this.state.finds || []).map(f => [f.id, f.amount])) } : {};
    },
    // Quête active de Brume (null : toutes faites)
    // L'étape de civilisation (bible, § 6.10) : déduite des actes finis et du nom du peuple
    civStage() {
      return this.state && this.state.brume ? civilizationOf(this.state.brume.acts, this.state.people) : null;
    },
    quest() {
      return this.state && this.state.brume ? this.state.brume.quest : null;
    },
    // Les actes finis (Brume) : le Grand Œuvre, la lumière de l'île et le stade de Brume (game/opus.js)
    actsDone() {
      return (this.state && this.state.brume && this.state.brume.acts) || [];
    },
    brumeState() {
      return brumeLook({ acts: this.actsDone, quest: this.quest, elements: this.elements });
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
      const names = this.crafted.map(c => this.craftName(c.craft));
      const annexes = (this.state.annexes || []).length;
      return `Ton île : ${built.join(', ')} bâtis${annexes ? ` ; ${annexes} annexe${annexes > 1 ? 's' : ''}` : ''}${names.length ? ` ; créations : ${names.join(', ')}` : ''}.`;
    }
  },
  watch: {
    isLoggedIn() {
      this.load();
    },
    // La quête qui ouvre un acte annonce son naufrage, une fois par appareil ; jamais par-dessus un coffre : il attend
    // que le coffre se referme
    'quest.id'() {
      this.checkWreck();
    },
    // Un coffre refermé : le naufrage, puis la veillée qui l'attendait (App.vue)
    reveal(open) {
      if (open) return;
      this.checkWreck();
      this.emitQuest();
    },
    haul(open) {
      if (open) return;
      this.checkWreck();
      this.emitQuest();
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
    // Bulles de besoin au-dessus des habitants (pour le toucher)
    this.needBubbles = [];
    // Bateau du visiteur : case de mer où il s'amarre, arrivée en cours ({ id, at })
    this.visitorDock = null;
    this.boatArrival = null;
    this.signs = [];
    this.shore = [];
    // Sol en relief : calques lus (M), carrés d'images (terrain), eau animée (live), cases de chaque quartier
    this.M = null;
    this.terrain = null;
    this.live = null;
    this.zoneTiles = new Map();
    this.mistKey = null;
    // Climat(s) visé(s) par la caméra et leur poids (fondu d'un climat à l'autre), instant du dernier dessin
    this.climateMix = {};
    this.climateT = 0;
    // Mer vivante : eaux de l'île (sea), mouettes posées (perches), passages en cours des dauphins et de la baleine,
    // animaux qui ont réagi à un toucher (clé → { at, … }), et ce qu'on peut toucher dans la dernière image
    this.sea = null;
    this.perches = [];
    // Plage où la bouteille à la mer s'est échouée (case), si elle attend
    this.bottleSpot = null;
    this.passages = {};
    this.scared = new Map();
    this.seaHits = [];
    // Brume dans la dernière image (pour le toucher) ; appui long en cours sur l'île ; barque du passeur
    this.brumeHit = null;
    this.ferry = null;
    this.holdTimer = 0;
    this.moreRaf = 0;
    // Heure ou temps imposés (essais), journée jouée en accéléré, ciel de la dernière image
    this.forced = forcedPhase();
    // Compteur d'images (« ?perf » dans l'adresse) : mesure du temps de dessin, pour les essais sur téléphone
    this.perf = perfWanted() ? perfMeter() : null;
    this.warp = null;
    this.phase = null;
    this.clockAt = 0;
    // Ce qu'on peut toucher dans la dernière image : bêtes sur l'île, articles posés, enseignes ; ronds dans l'eau ;
    // bulle d'info
    this.landHits = [];
    this.itemHits = [];
    this.nameSignHits = [];
    // Variante de chaque annexe posée (« x,y » → n° d'exemplaire : ce qui pousse dans un champ…)
    this.annexVariants = new Map();
    // Vie ambiante (village.js) et lanternes des habitants dans la dernière image
    this.village = null;
    this.villageLights = [];
    this.ripples = [];
    this.tipTimer = 0;
    // Chose choisie par un premier toucher : { key, run, ring } (voir pick)
    this.picked = null;
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
    // Écran qui change de hauteur (rotation, barre du navigateur) : l'île reprend toute la place
    window.addEventListener('resize', () => {
      this.setup();
      this.draw(performance.now());
    }, { signal: this.ac.signal });
    // Plein écran quitté par l'appareil (geste ou touche Échap) : l'île retrouve ses barres
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && this.immersive) this.setImmersive(false);
    }, { signal: this.ac.signal });
    this.syncPhase();
    this.tick = setInterval(() => {
      this.clock = Date.now();
      this.syncPhase();
      const charges = this.state && this.state.charges;
      const trip = this.state && this.state.expedition;
      const due = (charges && charges.nextIn !== null && this.clock - this.loadedAt > charges.nextIn + 2000) || (trip && this.clock - this.loadedAt > trip.endsIn + 2000);
      if (due && !this.busy && !this.run) this.load();
    }, 20000);
    // Arrivée sur l'île : App.vue montre où en est la première vue tant qu'elle n'est pas prête (draw/loading.js)
    this.startLoading();
    await this.load();
  },
  beforeUnmount() {
    this.gone = true;
    this.endLoading();
    if (this.immersive) this.setImmersive(false);
    clearTimeout(this.undoTimer);
    clearTimeout(this.holdTimer);
    clearTimeout(this.tipTimer);
    if (this.ac) this.ac.abort();
    if (this.observer) this.observer.disconnect();
    clearInterval(this.tick);
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.moreRaf);
    this.raf = this.moreRaf = 0;
    // Sortie de l'île : la vue est gardée pour le retour, la mémoire libérée (sol en carrés, images, décor)
    if (this.cam) memory.view = { cam: { ...this.cam }, site: this.site ? this.site.id : null, siteTab: this.siteTab };
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
        // Premier bâtiment au palier II : ses annexes s'ouvrent
        if (state.sites.some(s => s.level >= 2 && !s.locked)) guide.tip('annexes');
        // Deux habitants ou plus : ils ont un prénom, on peut s'en faire des amis
        if ((state.villagers || []).length >= 2) guide.tip('friends');
        // Un habitant à qui il manque quelque chose : ses besoins et son humeur
        if ((state.villagers || []).some(v => missingOf(v).length)) guide.tip('needs');
        // Un visiteur vient d'accoster
        if (state.visitor) guide.tip('visitor');
        // Premier mini-jeu ouvert (Ponton, Carrière ou Bosquet au palier III)
        if ((state.games || []).some(g => g.open)) guide.tip('games');
        this.bestiaryTips(state);
        // Acte VI : Galet a lu la dernière rune ; Brume comprend (dit une fois)
        if (secretDue(state.brume && state.brume.acts, state.brume && state.brume.quest)) {
          const built = builtOf(state.villagers);
          secretOf(Boolean(state.anya && state.anya.awake)).forEach(line => guide.say({ id: line.id, text: line.text, ...(line.who ? { who: line.who, face: faceHref(line.face, { castaway: !built.includes(line.face) }) } : {}) }));
        }
      } catch (error) {
        if (this.gone) return;
        // (rien à attendre : l'île montre son invitation ou son erreur)
        this.endLoading();
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
      // Les décorations de l'ancienne règle viennent d'être remboursées (une seule fois) : le solde suit, l'île le dit
      if (state.refund) {
        const { count, coins, balance } = state.refund;
        this.$emit('coins-updated', balance);
        this.$emit('show-alert', `Les décorations laissent place aux créations d’île : ${count} décoration${count > 1 ? 's' : ''} remboursée${count > 1 ? 's' : ''}, ${coins} écus. Assemble tes créations à l’établi du Foyer.`);
      }
      // Un dormeur qu'on vient de réveiller (bible, § 6.7) : l'île le dit
      if (this.state) {
        const slept = new Set((this.state.villagers || []).filter(v => v.asleep).map(v => v.id));
        (state.villagers || []).filter(v => slept.has(v.id) && !v.asleep).forEach(v => this.$emit('show-alert', `${v.name} se réveille !`));
      }
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
      if (!this.terrain) this.terrain = new TerrainCache(M, (x, y) => this.veilAt(x, y), (ctx, x, y) => this.standAt(ctx, x, y));
      this.M = M;
      this.live = liveOf(M);
      // Cases de lave : elles luisent la nuit
      this.lavaCells = [];
      for (let y = 0; y < state.size; y++) for (let x = 0; x < state.size; x++) if (M.ground(x, y) === 'o') this.lavaCells.push(this.ground(x, y));
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
      if (!this.state && memory.view && memory.view.site) {
        this.site = state.sites.find(s => s.id === memory.view.site) || null;
        this.siteTab = memory.view.siteTab || 'overview';
      }
      this.annexVariants = variantsOf(state.annexes || []);
      this.props = this.natureOf(state);
      // Décor par case, cuit dans le sol sauf de près ; celui qui entoure ce qui se tient debout reste dessiné à part
      // (liveProps), pour passer devant dans l'ordre du relief. Si le décor cuit a changé, ses carrés seront refaits
      const live = this.liveCellsOf(state);
      this.liveProps = this.props.filter(prop => live.has(prop.y * state.size + prop.x));
      this.propsAt = new Map();
      for (const prop of this.props) {
        const key = prop.y * state.size + prop.x;
        if (live.has(key)) continue;
        this.propsAt.set(key, [...(this.propsAt.get(key) || []), prop]);
      }
      const propsKey = [...this.propsAt.values()].flat().map(p => `${p.kind}${p.x},${p.y}`).join(';');
      if (this.propsKey !== undefined && propsKey !== this.propsKey) this.terrain.restand();
      this.propsKey = propsKey;
      this.perches = this.perchesOf(state);
      this.bottleSpot = this.bottleSpotOf(state);
      this.shore = this.shoreOf(state);
      // Habitants et bêtes : ils vivent dans les quartiers à soi, autour des bâtiments bâtis
      this.village = villageOf({
        n: state.size, M, sites: state.sites, crafts: state.crafts ? state.crafts.placed : [], props: this.props, annexes: state.annexes || [],
        owned: new Set(state.map.zones.map((z, i) => (z.owned ? i : -1)).filter(i => i >= 0)), visitor: state.visitor || null,
        settlers: (state.villagers || []).filter(v => v.seed !== undefined),
        climates: state.map.zones.map(z => z.climate || null), avoid: [...landmarksShown(state), ...depositsShown(state)],
        // La troupe rencontrée (serveur) : bâtie, au camp, ou endormie
        troupe: (state.villagers || []).filter(v => v.seed === undefined).map(v => ({ id: v.id, built: v.built !== false, asleep: Boolean(v.asleep) })),
        written: this.elements,
        // Anya révélée : elle erre (son passage du jour, tiré par le serveur) ; le bol de la Dame, dès qu'on la pressent
        // (le Cercle trouvé, une trace)
        anya: state.anya && state.anya.revealed ? { visit: state.anya.visit || null } : null,
        dame: Boolean((state.landmarks || []).some(l => l.id === 'menhirs' && l.found) || (state.anya && state.anya.traces.length))
      });
      // Visiteur : son bateau s'amarre près du Ponton ; un visiteur jamais vu sur cet appareil arrive sous les yeux
      this.visitorDock = state.visitor ? this.dockOf(state, M) : null;
      if (state.visitor && this.visitorDock && !this.reduced()) {
        let seen = null;
        try { seen = localStorage.getItem('oc_visitor_seen'); } catch (e) { seen = null; }
        if (seen !== String(state.visitor.id)) {
          this.boatArrival = { id: state.visitor.id, at: performance.now() / 1000 };
          try { localStorage.setItem('oc_visitor_seen', String(state.visitor.id)); } catch (e) { /* stockage indisponible */ }
        }
      }
      // Expédition revenue : le quartier qu'elle a découvert se dévoile (nom, climat, relief)
      if (this.state) {
        const unknown = new Set(this.state.map.zones.filter(z => z.known === false).map(z => z.id));
        const found = state.map.zones.filter(z => unknown.has(z.id) && z.known !== false);
        if (found.length) {
          found.forEach(z => this.unveils.set(z.id, performance.now()));
          this.$emit('show-alert', found.map(z => `Expédition revenue : ${z.name} découvert (${CLIMATE_NAMES[z.climate] || 'climat inconnu'}) !`).join(' '));
        }
      }
      this.state = state;
      this.emitQuest();
      // Brume et sol d'un quartier : à soi (o), connu (k), inconnu (u) ; un changement refait ses carrés de sol
      const mistKey = state.map.zones.map(z => `${z.id}:${z.owned ? 'o' : z.known === false ? 'u' : 'k'}`).join();
      if (this.mistKey !== null && mistKey !== this.mistKey) {
        const before = new Set(this.mistKey.split(',')), after = new Set(mistKey.split(','));
        const changed = [...new Set([...before, ...after].map(k => k.split(':')[0]))].filter(id => [...before].find(k => k.startsWith(`${id}:`)) !== [...after].find(k => k.startsWith(`${id}:`)));
        this.terrain.invalidate(changed.flatMap(id => this.zoneTiles.get(id) || []));
      }
      this.mistKey = mistKey;
      this.loadedAt = Date.now();
      this.clock = this.loadedAt;
      if (this.site) this.site = state.sites.find(s => s.id === this.site.id) || null;
      // Pose d'annexe en cours : abandonnée si le bâtiment n'a plus de case libre ; de même pour une création
      if (this.annexPlacing && !(this.placingSite && this.placingSite.spots.length)) this.cancelAnnex();
      if (this.craftPlacing && !this.craftSpots.length) this.cancelCraft();
      if (this.craftMenu && !this.crafted.some(c => c.x === this.craftMenu.x && c.y === this.craftMenu.y)) this.craftMenu = null;
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
        this.syncLoop();
      });
    },

    /* ---------- Plein écran ---------- */
    toggleImmersive() {
      this.setImmersive(!this.immersive);
    },
    // L'île seule : la barre du haut et la barre d'onglets se cachent ; l'écran entier quand l'appareil le permet
    // (pas sur iPhone : l'île garde alors toute la fenêtre)
    setImmersive(on) {
      this.immersive = on;
      document.documentElement.classList.toggle('oc-immersive', on);
      try {
        if (on && document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        if (!on && document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
      } catch (e) {
        // Plein écran refusé : la fenêtre suffit
      }
      this.dropPick();
      this.$nextTick(() => {
        this.setup();
        this.draw(performance.now());
      });
    },

    ...cameraMethods,

    ...drawMethods,

    ...gestureMethods,
    screenRectOf(x, y) {
      const rect = this.$refs.canvas.getBoundingClientRect();
      const c = this.ground(x, y);
      const sp = this.toScreen(c.x, c.y);
      return { left: rect.left + sp.x - 30, top: rect.top + sp.y - 40, width: 60, height: 60 };
    }
  }
};
</script>

<!-- Styles de l'île, globaux : toutes les classes sont préfixées world__, et les fiches peuvent devenir des composants
     enfants qui s'en servent (un style « scoped » n'atteint pas l'intérieur d'un composant enfant) -->
<style scoped src="./WorldView.css"></style>
<style src="../island-ui.css"></style>

<style src="./WorldView.global.css"></style>
