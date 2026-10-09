<template>
  <div class="oc-app" id="game-container">
    <LivingBackground ref="background" :era="era" :population="population" :palette="palette" :paused="isWorldActive" />

    <div class="oc-app__shell">
      <AppHeader :found="discoveredCount" :total="totalElements" :era="era" :eraName="eraName" :coins="coins" :timerActive="isTimerActive" @open-sceau="handleModeSelect('sceau')" @open-shop="openShop">
        <template #timer>
          <TimerModeButton
            ref="timerModeButton"
            @timer-state-change="handleTimerStateChange"
            @timer-complete="handleTimerComplete"
            @show-question="showCurrentTimerQuestion"
            @force-stop="handleTimerForceStop"
          />
        </template>
      </AppHeader>

      <main id="main-content" ref="mainContent" :class="['oc-app__main', { 'oc-app__main--world': isWorldActive || isSceauActive }]">
        <div class="oc-app__inventory">
          <!-- Le Sceau : le joueur et son compte -->
          <SceauView
            v-if="isSceauActive"
            :isLoggedIn="isLoggedIn"
            :username="currentUser?.username || currentUser?.email || 'Alchimiste'"
            :eraLabel="eraLabel"
            :families="familyShares.filter(f => f.share > 0)"
            :rings="rings"
            :worn="worn"
            :found="discoveredCount"
            :total="totalElements"
            :unlocked="unlockedAchievements"
            :achievementsTotal="achievements.length"
            :bestScores="timerProgress.bestScores || {}"
            @open-account="showAccount = true"
            @open-cabinet="isCustomizeModalOpen = true"
            @open-codex="showCodex = true"
            @open-contact="showContact = true"
            @replay-prologue="replayPrologue"
            @login="showSeuil = true"
            @logout="handleLogout"
          />
          <!-- Le Monde : l'île du joueur -->
          <WorldView
            v-else-if="isWorldActive"
            ref="world"
            :elementEmojis="elementEmojis"
            :elements="discoveredElements"
            :isLoggedIn="isLoggedIn"
            :coins="coins"
            @coins-updated="handleCoinsUpdated"
            @show-alert="showAlert"
            @login="showSeuil = true"
            @go="openFromWorld"
            @quest="onIslandQuest"
            @replay-vigil="replayVigil"
            @replay-anya="replayRevelation"
            @loading="onIslandLoading"
            @loaded="islandLoaded"
            @playing="playing => (islandPlaying = playing)"
          />
          <!-- Mode principal : le Livre ; l'Épreuve garde son inventaire -->
          <BookView
            v-else-if="!isTimerActive"
            ref="book"
            :discoveredElements="discoveredElements"
            :elementEmojis="elementEmojis"
            :isLoggedIn="isLoggedIn"
            :freshElement="freshElement"
            :categories="categories"
            :unexplored="unexploredCounts"
            :picked="athanorPicked"
            :revealing="isRevealing"
            :openMarked="bookOpenMarked"
            :anyaAwake="Boolean(anya && anya.revealed)"
            :openPage="bookOpenPage"
            :hold="prologueHold"
            :stage="civStage"
            @marked-opened="bookOpenMarked = false; bookOpenPage = null"
            @select="handleResourceSelection"
            @coins-updated="handleCoinsUpdated"
            @show-alert="showAlert"
            @aim="bookAim = $event"
            @inscribed="handleInscribed"
            @seal="$refs.craftZone?.fuse()"
          />
          <TrialInventory
            v-else
            :categories="categories"
            :discoveredElements="discoveredElements"
            :elementEmojis="elementEmojis"
            :freshElement="freshElement"
            :picked="athanorPicked"
            @selectResource="handleResourceSelection"
            @fuse="$refs.craftZone?.fuse()"
          />
        </div>
        <div v-show="!isWorldActive && !isSceauActive" class="oc-app__craft">
          <TimerBrief
            v-if="isTimerActive && timerQuestion?.text"
            :question="timerQuestion"
            :hint="timerHint"
            :coins="coins"
            :freeJokers="freeJokers"
            @joker="useJoker"
          />
          <CraftZone
            ref="craftZone"
            :slotCount="slotCount"
            :mode="currentMode"
            :elementEmojis="elementEmojis"
            :failText="currentMode === 'infinite' ? infiniteFailLine : null"
            :aimPage="currentMode === 'infinite' ? bookAim : null"
            @aimed="$refs.book?.onAim($event)"
            @learned="learnElement"
            @craft-success="handleCraftSuccess"
            @discovery="handleDiscovery"
            @show-alert="showAlert"
            @revealing="isRevealing = $event"
            @picked="athanorPicked = $event"
          />
        </div>
      </main>
    </div>
    <TabBar :current="currentMode" :dots="isLoggedIn ? [] : ['sceau']" :locked="lockedTabs" @select="handleModeSelect" />
    <!-- L'arrivée sur l'île : seulement si sa première vue n'est pas prête tout de suite -->
    <transition name="island-loader">
      <IslandLoader v-if="islandCovered" :progress="islandLoad.progress" :stage="brumeStage" />
    </transition>
    <!-- (pendant ce chargement, Brume est sur l'écran de chargement : sa bulle attend que l'île se montre) -->
    <!-- Brume attend : l'écran de démarrage, l'arrivée sur l'île, la révélation d'une création (sa réplique vient après) -->
    <BrumeGuide v-if="splashGone && !islandCovered && !isRevealing" :stage="brumeStage" @go="handleModeSelect" />
    <!-- Le tutoriel (HISTOIRE.md, § 9) : scènes, carte d'embarquement, page de garde du Grimoire, main qui montre où toucher -->
    <PrologueScene
      v-if="prologueScene"
      :key="prologueScene"
      :scene="prologueScene"
      :frames="sceneFrames"
      :built="islandBuilt"
      :look="prologueLook"
      :skippable="!prologueReplay || isVigil || isStory"
      :skip-label="isVigil ? 'Passer la veillée' : isStory ? 'Passer' : 'Passer la scène'"
      @done="prologueSceneDone"
      @skip="prologueSceneDone(prologueScene)"
    />
    <PrologueAvatar v-if="prologueAvatar" @chosen="chooseLook" />
    <PrologueName
      v-if="prologueName"
      :account="prologueName.account"
      :claim="Boolean(prologueName.claim)"
      :initial-name="prologue.name || ''"
      @named="namePlayer"
      @signing="prologueSigning"
      @unsigned="prologueUnsigned"
      @signed-in="prologueSignedIn"
      @signed="prologueSigned"
    />
    <!-- Le coach du tutoriel (game/coach.js) : le geste de l'étape, une fois les répliques lues, jamais sous une scène -->
    <CoachLayer v-if="coachLesson" :key="coachLesson.id" :lesson="coachLesson" />
    <!-- « Passer le tutoriel » : une confirmation -->
    <GModal v-if="skipAsk" eyebrow="Tutoriel" title="Passer le tutoriel ?" :width="360" align="center" @close="skipAsk = false">
      <p class="app__skip-text">Brume ne te montrera plus chaque geste. Tu pourras tout découvrir seul : ses bulles t’aideront encore.</p>
      <template #actions>
        <button type="button" class="g-btn g-btn--ghost" @click="confirmSkip">Passer</button>
        <button type="button" class="g-btn" @click="skipAsk = false">Continuer le tutoriel</button>
      </template>
    </GModal>
    <GameAchievementsPopup
      v-if="achievementQueue.length && !isRevealing && !prologueRunning"
      :key="achievementQueue[0].name"
      :achievement="achievementQueue[0]"
      @close="closeAchievementPopup"
      @achievement-popup-opened="handleAchievementPopupOpened"
    />
    <GModal
      v-if="showTimerEndModal"
      eyebrow="Le sablier est vide"
      title="Temps écoulé"
      align="center"
      :width="480"
      @close="handleTimerEndModalClose"
    >
      <div class="timer-end">
        <div class="timer-end__stat"><span class="g-display timer-end__big">{{ timerModeDiscoveries }}</span><span class="g-mono">réussies</span></div>
        <div class="timer-end__stat"><span class="g-display timer-end__big g-gold">{{ timerProgress.bestScores?.[selectedTimerLevel] || 0 }}</span><span class="g-mono">record</span></div>
      </div>
      <p v-if="selectedTimerLevel" class="g-italic">Niveau {{ selectedTimerLevel }}</p>
      <template #actions>
        <button type="button" class="g-btn" @click="handleTimerEndModalClose">Retour au registre</button>
      </template>
    </GModal>
    <ResetPasswordModal
      v-if="resetToken"
      :token="resetToken"
      @close="resetToken = null"
      @login="resetToken = null; showSeuil = true"
    />
    <AccountModal v-if="showAccount" @close="showAccount = false" @look="islandAvatar = $event" @left="handleLogout" @restarted="islandRestarted" />
    <ContactModal v-if="showContact" @close="showContact = false" />
    <CodexModal v-if="showCodex" :achievements="achievements" @close="showCodex = false" />
    <SeuilModal v-if="showSeuil" @close="showSeuil = false" />
    <TimerQuestions
      v-show="isTimerActive"
      ref="timerQuestions"
      :isLoggedIn="isLoggedIn"
      :answersFound="timerAnswersFound"
      @reset-timer="handleTimerReset"
      @show-level-selection="showLevelSelection"
      @pause-timer="handleTimerPause"
      @resume-timer="handleTimerResume"
      @stop-timer="handleTimerStop"
      @set-initial-inventory="handleSetInitialInventory"
      @reset-craft-zone="resetCraftBoard"
      @level-selected="handleLevelSelected"
      @coins-earned="handleCoinsEarned"
      @timer-progress-updated="handleTimerProgress"
      @question-changed="timerQuestion = $event"
    />
    <CustomizeModal
      v-if="isCustomizeModalOpen"
      :currentFrame="selectedFrame"
      :currentAvatar="selectedAvatar"
      :userCoins="coins"
      :shares="sigilShares"
      :rings="rings"
      @close="isCustomizeModalOpen = false"
      @save="handleSaveCustomization"
      @coins-updated="handleCoinsUpdated"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import notificationService from '@/services/notificationService';
import * as storage from '@/utils/storage';
import { readCarnet } from '@/utils/carnet';
import { splashStep, splashFailed, whenSplashGone } from '@/utils/splash';
import { setErrorMode } from '@/utils/errorReport';
import { failLine } from '@/utils/failLine';
import { ringsFor } from '@/utils/sigil';
import { roman } from '@/utils/roman';
import { ERA_NAMES, familyColor, familyIndex, discoveredFamilies, eraOf, slotCountForEra, stageOf, populationFor } from '@/utils/eras';
import account, { COINS_KEY } from './account';
import carnet from './carnet';
import achievements from './achievements';
import story from './story';
import trial from './trial';
import update from './update';
import AppHeader from '../AppHeader/AppHeader.vue';
import CraftZone from '../../Craft/CraftZone/CraftZone.vue';
import LivingBackground from '../LivingBackground/LivingBackground.vue';
import BookView from '../../Book/BookView/BookView.vue';
import SceauView from '../../Account/SceauView/SceauView.vue';
import SeuilModal from '../../Account/SeuilModal/SeuilModal.vue';
import ResetPasswordModal from '../../Account/ResetPasswordModal/ResetPasswordModal.vue';
import ContactModal from '../../Settings/ContactModal/ContactModal.vue';
import AccountModal from '../../Account/AccountModal/AccountModal.vue';
import CustomizeModal from '../../Settings/CustomizeModal/CustomizeModal.vue';
import CodexModal from '../../Codex/CodexModal/CodexModal.vue';
import GameAchievementsPopup from '../../Codex/GameAchievementsPopup/GameAchievementsPopup.vue';
import TimerModeButton from '../../Trial/TimerModeButton/TimerModeButton.vue';
import TimerQuestions from '../../Trial/TimerQuestions/TimerQuestions.vue';
import TimerBrief from '../../Trial/TimerBrief/TimerBrief.vue';
import TrialInventory from '../../Trial/TrialInventory/TrialInventory.vue';
import GModal from '../../ui/GModal/GModal.vue';
import TabBar from '../TabBar/TabBar.vue';
import BrumeGuide from '../../Guide/BrumeGuide/BrumeGuide.vue';
import PrologueScene from '../../Prologue/PrologueScene/PrologueScene.vue';
import PrologueName from '../../Prologue/PrologueName/PrologueName.vue';
import PrologueAvatar from '../../Prologue/PrologueAvatar/PrologueAvatar.vue';
import CoachLayer from '../../Guide/CoachLayer/CoachLayer.vue';
import IslandLoader from '../../World/IslandLoader/IslandLoader.vue';

// L'île et tout ce qu'elle dessine (bâtiments, boutique, décor, terrain) : chargés à part, pour que le Grimoire
// s'ouvre sans les attendre ; préchargés dès que l'application est au repos (mounted), l'île s'ouvre sans délai
const loadWorld = () => import('../../World/WorldView/WorldView.vue');
const WorldView = defineAsyncComponent(loadWorld);
// L'écran d'arrivée sur l'île : montré si la première vue n'est pas prête après ce délai, jamais plus longtemps que ça
const ISLAND_SHOW_MS = 200;
const ISLAND_MAX_MS = 6000;

export default {
  name: 'App',
  // Le compte, le carnet, les succès, l'histoire et l'Épreuve vivent chacun dans leur fichier, à côté (mixins) ;
  // App garde ce qui les relie : les modes, l'Athanor, l'ère et les familles, le cycle de vie
  mixins: [account, carnet, achievements, story, trial, update],
  components: {
    AppHeader,
    CraftZone,
    LivingBackground,
    BookView,
    WorldView,
    SceauView,
    SeuilModal,
    ResetPasswordModal,
    ContactModal,
    AccountModal,
    CustomizeModal,
    CodexModal,
    GameAchievementsPopup,
    TimerModeButton,
    TimerQuestions,
    TimerBrief,
    TrialInventory,
    GModal,
    TabBar,
    BrumeGuide,
    PrologueScene,
    PrologueName,
    PrologueAvatar,
    CoachLayer,
    IslandLoader
  },
  data() {
    return {
      // Éléments posés dans l'Athanor, dans l'ordre des emplacements
      athanorPicked: [],
      // Dernière découverte, mise en valeur dans l'inventaire
      freshElement: null,
      // Page à portée ouverte dans le Livre (visée par l'Athanor)
      bookAim: null,
      // Venu de la quête de l'île : le Grimoire s'ouvre sur la page marquée du fil d'Ariane
      bookOpenMarked: false,
      // Page à ouvrir en venant de l'île (un Savoir soufflé : bible, § 6.4), ou null
      bookOpenPage: null,
      // Révélation d'une création en cours : les popups de succès attendent
      isRevealing: false,
      // Une ère franchie pendant le jeu (pas au chargement) annonce son nouvel emplacement
      progressReady: false,
      showCodex: false,
      showContact: false,
      showAccount: false,
      showSeuil: false,
      isCustomizeModalOpen: false,
      // Le Monde (île du joueur) et le Sceau (le joueur, son compte) remplacent le Livre et l'Athanor
      isWorldActive: false,
      isSceauActive: false,
      // L'arrivée sur l'île : { progress, shown } tant que sa première vue n'est pas prête, sinon null
      islandLoad: null,
      // L'écran de démarrage est parti (utils/splash.js) : Brume parle, les scènes du tutoriel se jouent
      splashGone: false
    };
  },
  async created() {
    whenSplashGone().then(() => { this.splashGone = true; });
    // L'île d'abord (choix de l'auteur, 9 oct.) : un compte arrive sur son île ; elle se prépare sous l'écran de
    // démarrage, et l'arrivée sur l'île (même scène) prend le relais si elle tarde. (Un invité n'a pas d'île : le
    // serveur demande un compte ; un nouveau visiteur y débarque après les scènes du début, story.js)
    if (this.isLoggedIn) this.isWorldActive = true;
    if (!this.isLoggedIn) storage.remove(COINS_KEY);
    // Compte : le dernier carnet connu s'affiche tout de suite, le serveur le remplace dès qu'il répond
    const cached = this.isLoggedIn && readCarnet(this.currentUser?.userId);
    if (cached && cached.families && Object.keys(cached.families).length) this.applyPlayState(cached);
    // Sans compte, le serveur tient un carnet invité
    const [carnet] = await Promise.all([this.loadPlayState(), this.isLoggedIn ? this.loadAccount() : null]);
    // La partie n'est pas revenue (serveur injoignable, même après ses nouveaux essais) : l'écran de démarrage le dit et
    // propose de réessayer, plutôt qu'un Grimoire vide
    if (!carnet) splashFailed();
    await this.loadAchievements();
    this.progressReady = true;
    // La partie du joueur est revenue : l'écran de démarrage peut s'effacer (avec les polices)
    if (carnet) splashStep('carnet');
  },
  computed: {
    currentMode() {
      if (this.isSceauActive) return 'sceau';
      if (this.isWorldActive) return 'world';
      return this.isTimerActive ? 'timer' : 'infinite';
    },
    // L'écran de chargement de l'île est affiché
    islandCovered() {
      return Boolean(this.islandLoad && this.islandLoad.shown);
    },
    // La progression (ère, fond) suit toujours l'inventaire Infini, même pendant l'Épreuve
    infiniteElements() {
      return this.timerSnapshot || this.discoveredElements;
    },
    families() {
      return discoveredFamilies(this.categories, this.infiniteElements);
    },
    // Ère affichée et fond vivant : lente, au fil des découvertes
    era() {
      return stageOf(this.discoveredCount);
    },
    eraName() {
      return ERA_NAMES[this.era - 1];
    },
    eraLabel() {
      return `Ère ${roman(this.era)} · ${this.eraName}`;
    },
    // Pièces du Cabinet portées sur le sceau
    worn() {
      return { frame: this.selectedFrame, emblem: this.selectedAvatar };
    },
    // Part découverte de chaque famille, dans l'ordre du registre (sceau du joueur)
    familyShares() {
      const found = new Set(this.infiniteElements);
      return Object.entries(this.categories).map(([name, elements]) => {
        const total = this.familyTotals[name] || elements.length;
        return { name, share: total ? elements.filter(e => found.has(e)).length / total : 0 };
      });
    },
    sigilShares() {
      return this.familyShares.map(f => f.share);
    },
    unlockedAchievements() {
      return this.achievements.filter(a => a.unlocked).length;
    },
    rings() {
      return ringsFor(this.unlockedAchievements);
    },
    // Emplacements de fusion : 4 dans l'Épreuve, sinon débloqués au fil des ères
    slotCount() {
      return this.isTimerActive ? 4 : slotCountForEra(eraOf(this.families.length));
    },
    totalElements() {
      const totals = Object.values(this.familyTotals);
      return totals.length ? totals.reduce((sum, n) => sum + n, 0) : new Set(Object.values(this.categories).flat()).size;
    },
    discoveredCount() {
      return new Set(this.infiniteElements).size;
    },
    population() {
      return populationFor(this.discoveredCount);
    },
    palette() {
      return this.families.map(familyColor);
    },
    familyOf() {
      return familyIndex(this.categories);
    }
  },
  watch: {
    // L'écran affiché accompagne les rapports d'erreur (utils/errorReport.js)
    currentMode: {
      handler: setErrorMode,
      immediate: true
    },
    // Le tutoriel ne commence qu'une fois l'écran de démarrage parti : une scène ne se joue pas dessous
    progressReady(now) {
      if (now && this.splashGone) this.runPrologue();
    },
    splashGone(now) {
      if (now && this.progressReady) this.runPrologue();
    },
    'discoveredElements.length'() {
      if (this.progressReady && this.splashGone) this.runPrologue();
      this.checkEarlyWisp();
    },
    isWorldActive(now) {
      // (en quittant l'île aussi : la leçon de l'étape suit le joueur, au Grimoire ou vers l'onglet « Île »)
      this.runIsland();
      // Arrivée sur l'île : l'écran de chargement ne se montre que si la première vue tarde (ISLAND_SHOW_MS), et jamais
      // plus de ISLAND_MAX_MS ; il part dès que l'île dit sa vue prête (loaded), ou en la quittant
      this.islandLoaded();
      if (!now) return;
      this.islandLoad = { progress: {}, shown: false };
      this.islandShowTimer = setTimeout(() => {
        if (this.islandLoad) this.islandLoad.shown = true;
      }, ISLAND_SHOW_MS);
      // (l'île cesse aussi de compter : elle se redessine de nouveau à chaque image)
      this.islandMaxTimer = setTimeout(() => {
        this.$refs.world?.endLoading?.();
        this.islandLoaded();
      }, ISLAND_MAX_MS);
    },
    // Les panneaux fixés en bas changent avec le mode : on remesure la place à leur réserver
    isTimerActive() {
      this.$nextTick(this.trackOverlays);
    },
    timerQuestion() {
      this.timerHint = null;
      this.timerAnswersFound = 0;
      this.$nextTick(this.trackOverlays);
    },
    // Un emplacement de plus : on le dit (hors Épreuve, où il y en a toujours 4)
    slotCount(next, previous) {
      if (this.progressReady && !this.timerSnapshot && !this.isTimerActive && next > previous) {
        this.showAlert('Nouvel emplacement de fusion débloqué !');
      }
    }
  },
  mounted() {
    this.overlays = new ResizeObserver(() => this.measureOverlays());
    this.trackOverlays();
    document.addEventListener('visibilitychange', this.handleVisibility);
    // Le code de l'île, préchargé au repos (le navigateur le garde : l'île s'ouvre ensuite sans l'attendre)
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 2000));
    idle(() => loadWorld().catch(() => {}));
  },
  beforeUnmount() {
    this.islandLoaded();
    this.overlays?.disconnect();
    document.removeEventListener('visibilitychange', this.handleVisibility);
    clearTimeout(this.prologueTimer);
    clearTimeout(this.breathTimer);
  },
  methods: {
    // L'île dit où en est sa première vue (draw/loading.js), puis qu'elle est prête
    onIslandLoading(progress) {
      if (this.islandLoad) this.islandLoad.progress = progress;
    },
    islandLoaded() {
      clearTimeout(this.islandShowTimer);
      clearTimeout(this.islandMaxTimer);
      this.islandLoad = null;
    },
    // Mobile : hauteur réelle du dock et de la consigne, réservée sous la liste (et pour le défilement)
    trackOverlays() {
      this.overlays?.disconnect();
      this.$el.querySelectorAll('.athanor, .brief').forEach(el => this.overlays.observe(el));
      this.measureOverlays();
    },
    measureOverlays() {
      // Seuls les panneaux réellement fixés (mobile) prennent de la place sur la liste
      const height = selector => {
        const el = this.$el.querySelector(selector);
        return el && getComputedStyle(el).position === 'fixed' ? el.offsetHeight : 0;
      };
      this.$el.style.setProperty('--oc-dock-h', `${height('.athanor')}px`);
      this.$el.style.setProperty('--oc-overlay', `${height('.athanor') + height('.brief')}px`);
    },
    // Les écus du bandeau : le Cabinet pour un compte, le Sceau (et son invitation à créer un compte) pour un invité
    openShop() {
      if (this.isLoggedIn) this.isCustomizeModalOpen = true;
      else this.handleModeSelect('sceau');
    },
    showAlert(message) {
      notificationService.info(message);
    },

    // ----- Athanor -----
    handleResourceSelection(resource, fromRect) {
      this.$refs.craftZone?.add(resource, fromRect);
    },
    // Nouvelle découverte : le fond vivant réagit, la carte s'illumine dans l'inventaire
    handleDiscovery({ name, x, y }) {
      this.$refs.background?.burst(x, y);
      this.freshElement = name;
    },
    // Pendu gagné : l'élément est inscrit par le serveur, comme après un mélange
    handleInscribed(reply) {
      this.learnElement(reply);
      this.handleCraftSuccess(reply.result);
      this.freshElement = reply.result;
      notificationService.show({ message: `${reply.result} rejoint ton registre\u00a0!`, type: 'success' });
    },
    handleCraftSuccess(craftedItem, ingredients = []) {
      if (!this.discoveredElements.includes(craftedItem)) {
        this.discoveredElements.push(craftedItem);
        if (this.isTimerActive) this.timerHint = null;
        else {
          this.checkAchievements();
          this.checkQuest();
        }
      }
      if (!this.isTimerActive) return;
      // Le serveur seul connaît les réponses : il a jugé ce mélange (services/trial.js)
      const verdict = this.timerVerdict;
      this.timerVerdict = null;
      if (!verdict) return;
      this.timerAnswersFound = verdict.found || 0;
      if (verdict.late) this.showAlert('Le sablier était déjà vide : cette réussite ne compte pas.');
      if (verdict.solved) {
        if (verdict.coins !== undefined) this.handleCoinsUpdated(verdict.coins);
        this.timerModeDiscoveries++;
        // La fenêtre de réussite montre la création et ses ingrédients
        this.$refs.timerQuestions.answerCorrect({ name: craftedItem, emoji: this.elementEmojis[craftedItem], ingredients });
      }
    },
    // Mélange raté en Infini : une image selon les familles, et l'ingrédient qui cache encore des mélanges
    infiniteFailLine(ingredients) {
      return failLine(ingredients, { familyOf: name => (this.familyOf[name] || '').replace(/_/g, ' '), unexplored: this.unexploredCounts });
    },
    resetCraftBoard() {
      this.$refs.craftZone?.clear();
    },

    // ----- Modes -----
    // L'île mène ailleurs (la quête de Brume) : vers le Grimoire, il s'ouvre sur la page marquée
    openFromWorld(mode, page = null) {
      this.bookOpenMarked = mode === 'infinite';
      this.bookOpenPage = page;
      this.handleModeSelect(mode);
    },
    handleModeSelect(mode) {
      if (mode === this.currentMode) return;
      if (mode === 'world' || mode === 'sceau') {
        // L'Épreuve en cours se termine d'abord (elle a son propre inventaire)
        if (this.isTimerActive) {
          this.showAlert(mode === 'world' ? 'Termine ou quitte l’Épreuve avant d’aller sur ton île.' : 'Termine ou quitte l’Épreuve avant d’ouvrir ton sceau.');
          return;
        }
        this.isWorldActive = mode === 'world';
        this.isSceauActive = mode === 'sceau';
        return;
      }
      this.isWorldActive = false;
      this.isSceauActive = false;
      if (mode === 'timer') {
        this.$refs.timerModeButton?.startTimer();
      } else if (this.isTimerActive) {
        // Quitter l'Épreuve perd la question en cours : on confirme d'abord
        this.$refs.timerModeButton?.requestStop();
      } else {
        this.resetCraftBoard();
      }
    }
  }
};
</script>

<style src="./App.global.css"></style>

