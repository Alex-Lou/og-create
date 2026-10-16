<template>
  <section :class="['world', { 'world--immersive': immersive }]" aria-label="Le Monde">
    <!-- Invité : l'île demande un compte (ses ressources et écus sont gardés par le serveur) -->
    <div v-if="guest" class="world__guest">
      <p class="world__guest-title">{{ GUEST.title }}</p>
      <p class="world__guest-text">{{ GUEST.text }}</p>
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
          :busy="busy"
          :locked="Boolean(taught)"
          @warp="toggleWarp"
          @collect="collect"
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
        <!-- Le jour passe (tutoriel : l'étape suivante est plus tard le même jour, sky.js) : un voile de crépuscule -->
        <div v-if="dayPass" class="world__day-pass" aria-hidden="true" @animationend="dayPass = false"></div>
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
          :explore="Boolean(explorableZone)"
          :immersive="immersive"
          :road="roadMode !== null"
          :harvest="Boolean(state.stock)"
          :charges="state.charges.count"
          :charges-max="state.charges.max"
          :charges-text="chargesText"
          :busy="busy"
          :taught="taught"
          @chests="chestsOpen = true"
          @log="openLog()"
          @finds="findsOpen = true"
          @trip="showExpedition"
          @zoom="zoomBy"
          @immersive="toggleImmersive"
          @road="roadMode ? cancelRoad() : startRoad()"
          @harvest="startHarvest"
        >
          <!-- Le suivi des quêtes, en tête de la colonne de gauche -->
          <template #quests>
            <QuestTracker
              v-if="!immersive && !roadMode"
              :main="trackerMain"
              :action="questAction ? questAction.label : ''"
              :todo="trackerAll.slice(0, MAX_TODO)"
              :more="Math.max(0, trackerAll.length - MAX_TODO)"
              :open="trackerOpen"
              @toggle="toggleTracker"
              @close="trackerOpen = false"
              @main="pointQuest"
              @claim="claimQuest"
              @act="questAction && questAction.run()"
              @go="trackerGo"
            />
            <!-- La leçon du tutoriel refermée d'une croix : un « ! », sous le suivi, la rappelle (la caméra y retourne) -->
            <button v-if="coachHidden" type="button" class="world__recall" :aria-label="RECALL" @click="recallLesson">!</button>
          </template>
        </IslandButtons>
        <p v-if="loadError" class="world__error" role="alert">
          {{ LOAD_ERROR }}
          <button type="button" class="world__btn world__btn--small" @click="load">Réessayer</button>
        </p>
        <!-- Mode chemin : ce que fait le doigt et le compte ; retirer la dernière case, la gomme, annuler, tracer -->
        <RoadBar
          v-else-if="roadMode"
          :text="roadBanner"
          :eraser="roadMode.eraser"
          :cells="(roadMode.eraser ? roadMode.erase : roadMode.lay).length"
          :linked="roadLinked"
          :ready="roadReady"
          :busy="busy"
          @undo="undoRoad"
          @eraser="toggleEraser"
          @cancel="cancelRoad"
          @confirm="confirmRoad"
        />
        <CancelBanner v-else-if="siteMoving && movingSite" :text="BANNERS.move(movingSite.name)" @cancel="cancelSiteMove" />
        <!-- Une création qui se pose d'un trait (clôture, muret) : le compte, retirer la dernière case, annuler, poser -->
        <LineBar
          v-else-if="lineCraft"
          :text="lineBanner"
          :cells="craftTrace ? craftTrace.cells.length : 0"
          :undo="canUndoLine()"
          :lesson="Boolean(fenceLesson())"
          :full="lineFull"
          :busy="busy"
          @undo="undoLine"
          @cancel="cancelCraft"
          @confirm="confirmLine"
        />
        <CancelBanner v-else-if="craftPlacing && placingCraft" :text="craftBanner" @cancel="cancelCraft" />
        <!-- Un enclos vient de se fermer, ou presque : sa porte, avec son verrou ou sans, ou plus tard (enclosures.js) -->
        <DoorOffer
          v-else-if="doorOffer"
          :missing="doorOffer.missing"
          :lock-cost="doorCosts.lock"
          :plain-cost="doorCosts.plain"
          :busy="busy"
          :later="!doorLesson"
          @choose="startDoorPlace"
          @later="doorOffer = null"
        />
        <CancelBanner v-else-if="annexPlacing && placingAnnex" :text="annexBanner" @cancel="cancelAnnex" />

        <!-- Appui long ailleurs : une bulle dit ce que c'est et ce que fait un toucher -->
        <transition name="world-tip">
          <div v-if="tip" :class="['world__tip', { 'is-below': tip.below }]" role="status" :style="{ left: `${tip.x}px`, top: `${tip.y}px` }">
            <strong class="world__tip-title">{{ tip.title }}</strong>
            <span v-if="tip.text" :class="['world__tip-text', { 'is-didascalie': tipDidascalie }]">{{ tip.text }}</span>
            <span v-if="tip.hint" class="world__tip-hint">{{ tip.hint }}</span>
            <button v-if="tip.action" type="button" class="world__tip-btn" :data-pick="tip.pick" @click="runPick">{{ tip.action }}</button>
          </div>
        </transition>

        <!-- Déplacement d'un bâtiment : la place choisie (son emprise en transparence) ; l'y poser, ou en choisir une autre -->
        <PoseMenu
          v-if="siteMoveConfirm && movingSite"
          :name="movingSite.name"
          :label="`Déplacer ${movingSite.name}`"
          :place="siteMoveStyle"
          confirm="Le poser ici"
          :busy="busy"
          @confirm="confirmSiteMove"
          @other="siteMoveConfirm = null"
        />

        <!-- Appui long sur une création d'île : la déplacer, la pivoter ou la ranger dans la réserve de l'établi -->
        <div v-if="craftMenu && !craftPlacing" class="world__menu" :style="menuStyle" role="dialog" :aria-label="craftName(craftMenu.craft)">
          <span class="world__menu-name">{{ craftName(craftMenu.craft) }}</span>
          <button type="button" class="world__menu-btn" data-coach="craft-move" @click="moveFromMenu">Déplacer</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" :disabled="busy" @click="turnFromMenu">Pivoter</button>
          <button type="button" class="world__menu-btn world__menu-btn--quiet" :disabled="busy" @click="storeFromMenu">Ranger</button>
          <!-- (une porte : son verrou) -->
          <template v-if="craftMenu.craft === 'porte'">
            <button v-if="placedAt(craftMenu).locked" type="button" class="world__menu-btn world__menu-btn--quiet" :disabled="busy" @click="lockFromMenu(false)">{{ DOOR_MENU.unlock }}</button>
            <button v-else-if="doorCard && doorCard.lock" type="button" class="world__menu-btn" :disabled="busy" @click="lockFromMenu(true)">{{ DOOR_MENU.lock(lockPrice) }}</button>
          </template>
        </div>

        <!-- Pose d'une création : la case dorée choisie (aperçu dessus) ; pivoter, poser ici ou choisir une autre case -->
        <PoseMenu
          v-if="craftConfirm && placingCraft"
          :name="placingCraft.name"
          :label="`Poser ${placingCraft.name}`"
          :place="craftConfirmStyle"
          coach="craft-confirm"
          :busy="busy"
          @confirm="confirmCraft"
          @other="craftConfirm = null"
        >
          <PoseChoice v-if="!craftPlacing.door" :flip="craftFlip" @turn="turnPlacingCraft" />
        </PoseMenu>

        <!-- Pose d'une annexe : la case dorée choisie (aperçu dessus), son prix ; sa couleur et son sens, poser ici ou
             choisir une autre case -->
        <PoseMenu
          v-if="annexConfirm && placingAnnex && placingAnnex.next"
          :name="placingAnnex.name"
          :label="`Poser ${placingAnnex.name}`"
          :place="annexConfirmStyle"
          coach="annex-confirm"
          :busy="busy"
          @confirm="confirmAnnex"
          @other="annexConfirm = null"
        >
          <!-- (son prix en écus, s'il en a un : le poulailler d’Agathe est offert) -->
          <template #name>{{ placingAnnex.name }}<template v-if="placingAnnex.next.coins"> · {{ placingAnnex.next.coins }}<span class="world__coin world__coin--small" aria-hidden="true"></span></template></template>
          <PoseChoice :id="placingAnnex.id" :looks="placingAnnex.looks || 1" :look="annexPose.look" :flip="annexPose.flip" @look="lookPlacingAnnex" @turn="turnPlacingAnnex" />
        </PoseMenu>
      </div>

      <p v-if="state" class="world__note">
        {{ ISLAND_NOTE }}
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
          :annex-ready="annexReady(site, stockPaid, coinsPaid)"
          @tab="tab => (siteTab = tab)"
          @rename="startRename"
          @close="site = null"
          @move="startSiteMove"
        >
          <SiteOverview
            v-if="siteTab === 'overview'"
            :site="site"
            :rates="state.rates"
            :cap-hours="state.capHours"
            :pending="harvestable.length"
            :elapsed="clock - loadedAt"
            :friend="friendAt(site.id)"
            :civ-stage="civStage"
            :villagers="state.villagers || []"
            :needs="state.needs || null"
            :portraits="villagerPortraits()"
            :visitor="state.visitor || null"
            :visitor-art="state.visitor ? visitorPortrait(state.visitor) : ''"
            :crafts="state.crafts || null"
            :games="state.games || []"
            :blight="blightOf(site)"
            :busy="busy"
            @repair="repairSite(site)"
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
            :coins="coinsPaid"
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
          <AnnexPanel v-else-if="siteTab === 'annexes'" :site="site" :stock="stockPaid" :coins="coinsPaid" :busy="busy" @place="annex => startAnnex(site, annex)" />

          <SiteSteps v-else :site="site" :stock="stockPaid" :charges="state.charges.count" :coins="coinsPaid" :busy="busy" :followable="!thickMist()" @build="build(site)" @harvest="startHarvest" @follow="plan => $emit('follow', plan)" />
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
          :stock="stockPaid"
          :charges="state.charges.count"
          :expedition="state.expedition || null"
          :trip-left="tripLeft"
          :core-left="state.map.coreLeft || []"
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
      :stock="stockPaid"
      :element-emojis="elementEmojis"
      :busy="busy || craftStarting"
      :followable="!thickMist()"
      :needs="benchNeeds"
      @follow="name => $emit('follow', name)"
      @assemble="assemble"
      @place="placeFromBench"
      @close="benchOpen = false"
    />
    <!-- Le casse-tête d'une annexe qui s'assemble (le poulailler d’Agathe) : assemblé, sa pose suit (annexes.js) -->
    <CraftPuzzle
      v-if="annexRun"
      :run="annexRun"
      :name="annexRun.name"
      eyebrow="Assemblage"
      :picture="annexRunPicture"
      :guided="annexGuided"
      @finish="annexAssembledDone"
      @close="closeAnnexPuzzle"
    />
    <CraftPuzzle
      v-if="craftRun"
      :run="craftRun"
      :name="craftName(craftRun.craft)"
      :sending="craftSending || craftStarting"
      :error="craftError"
      :made="craftMade"
      :guided="craftGuided"
      @finish="finishCraft"
      :count="craftCount"
      @restart="assemble(craftRun.craft, craftCount)"
      @place="placeFromPuzzle"
      @close="closePuzzle"
    />

    <!-- Fiche d'une annexe posée (appui long) : la déplacer, ou ouvrir son bâtiment -->
    <!-- Brume et les nuits : leur présentation, le bilan du matin -->
    <NightSheet v-if="nightSheet" :mode="nightSheet.mode" :lines="nightSheet.lines || []" :stage="brumeState.stage" @close="closeNightSheet" />
    <AnnexSheet v-if="sheetAnnex" v-bind="sheetAnnex" :busy="busy" @close="annexSheet = null" @move="moveFromSheet" @site="siteFromSheet" @pose="poseFromSheet" />

    <!-- Premier achat d'une sorte d'article : son mode d'emploi, et de quoi aller le voir sur l'île -->
    <GModal sheet v-if="guideItem" eyebrow="Mode d’emploi" :title="guideItem.name" :width="400" @close="closeGuide">
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
      :elapsed="clock - loadedAt"
      :stock="stockPaid"
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
      :stock="stockPaid"
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
      :elapsed="clock - loadedAt"
      :stock="stockPaid"
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
      :anya="anyaHeld ? null : state.anya || null"
      :goal="(state.brume && state.brume.goal) || null"
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
      :elapsed="clock - loadedAt"
      :site-name="gameSiteName"
      :run="gameRun"
      :starting="gameStarting"
      :sending="gameSending"
      :result="gameResult"
      :error="gameError"
      :stages="(state.stages && state.stages[gameId]) || []"
      @start="startGame"
      @finish="finishGame"
      @close="closeGame"
    />
    <!-- La chasse aux poules d’Agathe (tutoriel : une scène à part, hens.js) -->
    <HenChase
      v-if="henChase"
      :hens="henChase"
      :built="chaseBuilt"
      @caught="onChaseCaught"
      @close="closeChase"
    />
    <!-- La marmite d’Agathe (tutoriel : sa soupe, une scène à part, cooking.js) -->
    <CookingPot
      v-if="cooking"
      :built="chaseBuilt"
      :pay="serveCooking"
      @close="closeCooking"
    />
    <HarvestGame
      v-if="run"
      :run="run"
      :sending="sending"
      :result="runResult"
      :earned="runEarned"
      :error="runError"
      :chest="runChest ? runChest.rarity : ''"
      :level="runLevel"
      :stages="(state && state.stages && state.stages.recolte) || []"
      :charges="state ? state.charges.count : 0"
      :tutorial="Boolean(taught)"
      @finish="finishHarvest"
      @again="againHarvest"
      @close="closeHarvest"
    />

    <!-- La première nuit : une teinte de nuit pendant l'exploration, puis le fondu au noir quand on dort -->
    <div aria-hidden="true" class="world__night-tint" :class="{ 'is-on': nightTint }"></div>
    <div aria-hidden="true" class="world__night-fade" :class="{ 'is-on': nightFade }"></div>
  </section>
</template>

<script>
import ShopItemSheet from '../Sites/ShopItemSheet/ShopItemSheet.vue';
import ChestList from '../Chests/ChestList/ChestList.vue';
import ChestReveal from '../Chests/ChestReveal/ChestReveal.vue';
import ChestHaul from '../Chests/ChestHaul/ChestHaul.vue';
import AnnexPanel from '../Sites/AnnexPanel/AnnexPanel.vue';
import AnnexSheet from '../Sites/AnnexSheet/AnnexSheet.vue';
import NightSheet from '../Explore/NightSheet/NightSheet.vue';
import PoseChoice from '../Sites/PoseChoice/PoseChoice.vue';
import VillagerSheet from '../Folk/VillagerSheet/VillagerSheet.vue';
import BeastSheet from '../Folk/BeastSheet/BeastSheet.vue';
import VisitorSheet from '../Folk/VisitorSheet/VisitorSheet.vue';
import RenameSheet from '../Sites/RenameSheet/RenameSheet.vue';
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
import QuestTracker from '../Hud/QuestTracker/QuestTracker.vue';
import DoorOffer from '../Hud/DoorOffer/DoorOffer.vue';
import PoseMenu from '../Hud/PoseMenu/PoseMenu.vue';
import CancelBanner from '../Hud/CancelBanner/CancelBanner.vue';
import RoadBar from '../Hud/RoadBar/RoadBar.vue';
import LineBar from '../Hud/LineBar/LineBar.vue';
import GModal from '@/components/ui/GModal/GModal.vue';
import { clearDrawings } from '@/book/painter';
import { reducedMotion } from '@/utils/fx';
import { clearSprites } from '@/world/spriteCache';
import { onPathsLoaded } from '@/world/pathArt';
import { stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook } from '@/game/opus';
import cameraMethods from '@/world/view/camera';
import drawMethods from '@/world/view/draw';
import gestureMethods from '@/world/view/gestures';
import { memory } from '@/world/view/memory';
import { viewFields } from '@/world/view/fields';
import { GUEST, LOAD_ERROR, ISLAND_NOTE, CANVAS_LABEL, BANNERS, RECALL, DOOR_MENU } from '@/texts/world/screens/island';
import folk from './folk';
import castaways from './castaways';
import demos from './demos';
import hens from './hens';
import cooking from './cooking';
import games from './games';
import chests from './chests';
import workshop from './workshop';
import siteMove from './siteMove';
import poseLevel from './poseLevel';
import sites from './sites';
import annexes from './annexes';
import nights from './nights';
import coach from './coach';
import explore from './explore';
import terrain from './terrain';
import sky from './sky';
import roads from './roads';
import serve from './serve';
import questHud from './questHud';
import enclosures from './enclosures';
import walls from './walls';
import phare from './phare';
import { defineAsyncComponent } from 'vue';
import PanelLoading from '../PanelLoading/PanelLoading.vue';

// Les mini-jeux et l'établi (leur code, leurs dessins et leurs listes d'adresses) se chargent à leur première
// ouverture, pas avec l'île ; d'ici là, leur cadre et une goutte qui pulse (au-delà de 100 ms seulement : pas d'éclair)
const onOpen = loader => defineAsyncComponent({ loader, loadingComponent: PanelLoading, delay: 100 });
const HarvestGame = onOpen(() => import('../Games/HarvestGame/HarvestGame.vue'));
const MiniGame = onOpen(() => import('../Games/MiniGame/MiniGame.vue'));
const HenChase = onOpen(() => import('../Games/HenChase/HenChase.vue'));
const CookingPot = onOpen(() => import('../Games/CookingPot/CookingPot.vue'));
const CraftBench = onOpen(() => import('../Workshop/CraftBench/CraftBench.vue'));
const CraftPuzzle = onOpen(() => import('../Workshop/CraftPuzzle/CraftPuzzle.vue'));

// Le Monde : l'île du joueur en isométrique (Canvas 2D), avec une caméra qu'on fait glisser et zoomer.
// L'état vient du serveur (chantiers, réserves, parties, créations d'île) ; le dessin, la caméra et la boucle
// d'animation sont non réactifs et s'arrêtent quand l'onglet est caché ou le composant démonté.

export default {
  name: 'WorldView',
  // Chaque sujet de l'île vit dans son fichier, à côté (mixins) : les gens, les naufragés du tutoriel, ce que montrent
  // les répliques, la cage et les poules d’Agathe, les jeux,
  // les coffres, l'établi, les bâtiments, les annexes, l'exploration, la carte, le ciel ; le moteur du canvas (caméra,
  // dessin, gestes) dans world/view/. L'île garde ce qui les relie : le chargement, la quête, le plein écran, les
  // observateurs, le cycle de vie
  mixins: [folk, castaways, demos, hens, cooking, games, chests, workshop, siteMove, poseLevel, sites, annexes, explore, terrain, sky, nights, coach, roads, serve, questHud, enclosures, walls, phare],
  components: { HarvestGame, HenChase, CookingPot, ShopItemSheet, GModal, ChestList, ChestReveal, ChestHaul, AnnexPanel, AnnexSheet, NightSheet, PoseChoice, MiniGame, VillagerSheet, BeastSheet, VisitorSheet, RenameSheet, CraftBench, CraftPuzzle, ExplorerLog, FindsSheet, WreckScene, BrumeSheet, ZoneSheet, SiteShop, SiteSteps, SiteOverview, SiteSheet, IslandHud, IslandButtons, QuestTracker, PoseMenu, CancelBanner, RoadBar, LineBar, DoorOffer },
  props: {
    // Glyphes des éléments du Livre (savoir-faire demandé à l'établi)
    elementEmojis: { type: Object, required: true },
    // Éléments écrits dans le Grimoire : le Bestiaire vivant et les familiers (bible, § 6.5)
    elements: { type: Array, default: () => [] },
    isLoggedIn: { type: Boolean, default: false },
    // Solde d'écus (en-tête) : grise les articles hors de portée ; le serveur reste seul juge
    coins: { type: Number, default: null },
    // Le tutoriel : où en est chaque personnage à cette étape (App : islandStage ; game/stages.js, le fil conducteur des
    // dévoilements) ; ce qu'un toucher sur une cible marquée lance à cette étape ({ 'habitant:ponton': vrai, caisse:
    // vrai } : l'île le renvoie, act)
    stage: { type: Object, default: () => ({}) },
    acts: { type: Object, default: () => ({}) },
    // Une scène plein écran la couvre (App : prologueScene) : l'île, cachée, ne se redessine pas (draw/loop.js)
    covered: { type: Boolean, default: false }
  },
  emits: ['act', 'caught', 'chase-closed', 'moved', 'coins-updated', 'show-alert', 'login', 'go', 'follow', 'quest', 'replay-vigil', 'replay-anya', 'loading', 'loaded', 'playing'],
  data() {
    return {
      GUEST,
      LOAD_ERROR,
      RECALL,
      DOOR_MENU,
      ISLAND_NOTE,
      BANNERS,
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
      peopleName: '',
      // La première nuit : fondu au noir pendant qu'on dort (true : noir)
      nightFade: false
    };
  },
  computed: {
    // La bulle d'info dit un geste, pas une parole (« (Elle meugle.) » : une bête, un familier) : en italique (choix de
    // l'auteur, 15 oct. : décision 24)
    tipDidascalie() {
      return Boolean(this.tip && /^\(.*\)$/.test(this.tip.text || ''));
    },
    // Une partie en cours sur l'île : Récolte, mini-jeu ou assemblage à l'établi
    playing() {
      return Boolean(this.run || this.gameRun || this.craftRun);
    },
    // Les traces d'Anya attendent (choix de l'auteur, 9 oct. : retravaillées plus tard) pour un compte qui suit l'histoire
    // de Brume
    anyaHeld() {
      return Boolean(this.state && this.state.brume && this.state.brume.tutorial);
    },
    // Ressources et trouvailles de climat ensemble (ce que coûtent créations et annexes de climat)
    stockAll() {
      return this.state ? { ...this.state.stock, ...Object.fromEntries((this.state.finds || []).map(f => [f.id, f.amount])) } : {};
    },
    // Ce qui paie une dépense (chantier, annexe, besoin, expédition, création, bête, cadeau, voyageur, boutique) : les
    // réserves et ce qui attend dans les bâtiments, que le serveur encaisse d'abord ; les écus de même (solde inconnu :
    // null)
    stockPaid() {
      const pending = (this.state && this.state.pendingStock) || {};
      return Object.fromEntries(Object.entries(this.stockAll).map(([k, n]) => [k, n + (pending[k] || 0)]));
    },
    coinsPaid() {
      return this.coins === null || !this.state ? this.coins : this.coins + (this.state.pending || 0);
    },
    // Quête active de Brume (null : toutes faites)
    // L'étape de civilisation (bible, § 6.10) : déduite des actes finis et du nom du peuple
    civStage() {
      return this.state && this.state.brume ? civilizationOf(this.state.brume.acts, this.state.people) : null;
    },
    quest() {
      return this.state && this.state.brume ? this.state.brume.quest : null;
    },
    // La première nuit, pendant l'exploration (avant de dormir) : l'île baigne dans une lumière de nuit
    nightTint() {
      return Boolean(this.quest && this.quest.kind === 'sleep' && !this.nightFade);
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
      // (espaces insécables : sur deux lignes, la coupure tombe après « · »)
      return `${count}/${max} · +1\u00a0dans\u00a0${minutes}\u00a0min`;
    },
    canvasLabel() {
      if (!this.state) return 'Ton île';
      const built = this.state.sites.filter(s => s.level).map(s => s.name);
      const names = this.crafted.map(c => this.craftName(c.craft));
      const annexes = (this.state.annexes || []).length;
      return CANVAS_LABEL(built, annexes, names);
    }
  },
  watch: {
    isLoggedIn() {
      this.load();
    },
    // (découverte : la boucle reprend ; en mouvement réduit, sans boucle, un dessin)
    covered(now) {
      this.syncLoop();
      if (!now) this.drawSoon();
    },
    // Une partie en cours (Récolte, mini-jeu, assemblage à l'établi) : l'application n'y glisse aucune annonce
    playing(now) {
      this.$emit('playing', now);
    },
    // La quête qui ouvre un acte annonce son naufrage, une fois par appareil ; jamais par-dessus un coffre : il attend
    // que le coffre se referme
    'quest.id'(id, before) {
      // (une quête nouvelle, pas la première de l'île : Brume sursaute, puis glisse vers sa nouvelle place)
      if (before) this.brumeQuestAt = performance.now() / 1000;
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
    // Non réactifs (world/view/fields.js) : le dessin les lit à chaque image
    Object.assign(this, viewFields());
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
      // (en mouvement réduit, l'île ne se redessine pas d'elle-même : sa lumière suit l'heure ici)
      if (this.reduced()) this.drawSoon();
      // L'île a changé d'elle-même (une partie revient, un besoin, la production…) : elle se recharge, à l'écran
      const due = this.dueIn !== null && this.clock - this.loadedAt > this.dueIn + 2000;
      if (due && !this.busy && !this.run && !this.reloading && !document.hidden) {
        this.reloading = true;
        this.load().finally(() => {
          this.reloading = false;
        });
      }
    }, 20000);
    // Arrivée sur l'île : App.vue montre où en est la première vue tant qu'elle n'est pas prête (draw/loading.js)
    this.startLoading();
    await this.load();
  },
  beforeUnmount() {
    this.gone = true;
    if (this.playing) this.$emit('playing', false);
    this.endLoading();
    if (this.immersive) this.setImmersive(false);
    clearTimeout(this.undoTimer);
    clearTimeout(this.holdTimer);
    clearTimeout(this.tipTimer);
    if (this.ac) this.ac.abort();
    if (this.observer) this.observer.disconnect();
    document.documentElement.style.removeProperty('--oc-toast-top');
    clearInterval(this.tick);
    cancelAnimationFrame(this.raf);
    cancelAnimationFrame(this.moreRaf);
    // (et les dessins demandés pour l'image suivante : rien ne se dessine plus sur une île quittée)
    cancelAnimationFrame(this.soonRaf);
    cancelAnimationFrame(this.repaintRaf);
    // (la caméra qui glisse ou file sur son élan, le bord qui fait défiler pendant un tracé)
    cancelAnimationFrame(this.glideRaf);
    cancelAnimationFrame(this.edgeRaf);
    cancelAnimationFrame(this.elanRaf);
    this.raf = this.moreRaf = this.soonRaf = this.repaintRaf = this.glideRaf = this.edgeRaf = this.elanRaf = 0;
    // Sortie de l'île : la vue est gardée pour le retour, la mémoire libérée (sol en carrés, images, décor)
    if (this.cam) memory.view = { cam: { ...this.cam }, site: this.site ? this.site.id : null, siteTab: this.siteTab };
    if (this.terrain) this.terrain.clear();
    // (le rappel des chemins tenait l'île quittée en mémoire)
    onPathsLoaded(null);
    this.terrain = null;
    this.props = [];
    this.live = null;
    this.geoKey = null;
    clearSprites();
    clearDrawings();
  },
  methods: {
    reduced() {
      return reducedMotion();
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
