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
            :openPage="bookOpenPage"
            :hold="prologueHold"
            :stage="civStage"
            @loaded="onBookLoaded"
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
    <TabBar :current="currentMode" :dots="isLoggedIn ? [] : ['sceau']" @select="handleModeSelect" />
    <BrumeGuide :stage="brumeStage" @go="handleModeSelect" />
    <!-- Le tutoriel (HISTOIRE.md, § 9) : scènes, page de garde du Grimoire, main qui montre où toucher -->
    <PrologueScene
      v-if="prologueScene"
      :key="prologueScene"
      :scene="prologueScene"
      :frames="sceneFrames"
      :skippable="!prologueReplay"
      :skip-label="isVigil ? 'Passer la veillée' : 'Passer le prologue'"
      @done="prologueSceneDone"
      @skip="isVigil ? prologueSceneDone(prologueScene) : skipPrologue()"
    />
    <PrologueName
      v-if="prologueName"
      :account="prologueName.account"
      @named="namePlayer"
      @signing="prologueSigning"
      @unsigned="prologueUnsigned"
      @signed-in="prologueSignedIn"
      @skip="skipPrologue"
    />
    <TutorialHand v-if="prologueHand && currentMode === prologueHand.mode && !prologueScene" :key="prologueHand.target" :target="prologueHand.target" />
    <GameAchievementsPopup
      v-if="achievementQueue.length && !isRevealing"
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
import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import trialService from '@/services/trialService';
import achievementsService from '@/services/achievementsService';
import playService from '@/services/playService';
import customizationService from '@/services/customizationService';
import notificationService from '@/services/notificationService';
import * as storage from '@/utils/storage';
import { messageOf } from '@/utils/errors';
import { readCarnet, writeCarnet, clearCarnet } from '@/utils/carnet';
import { failLine } from '@/utils/failLine';
import { findNewlyUnlocked } from '@/utils/achievementChecker';
import { BASE_ELEMENTS, BASE_CATEGORY } from '@/utils/gameConstants';
import { DEFAULT_FRAME, DEFAULT_EMBLEM } from '@/utils/cabinet';
import { FREE_JOKERS, JOKER_TIME } from '@/utils/hints';
import { ringsFor } from '@/utils/sigil';
import { roman } from '@/utils/roman';
import { emptyProgress } from '@/utils/trialProgress';
import { ERA_NAMES, familyColor, familyIndex, discoveredFamilies, eraOf, slotCountForEra, sortFamilies, stageOf, populationFor } from '@/utils/eras';
import AppHeader from '../Game/AppHeader.vue';
import CraftZone from '../Game/CraftZone.vue';
import LivingBackground from '../Game/LivingBackground.vue';
import BookView from '../Book/BookView.vue';
import WorldView from '../World/WorldView.vue';
import SceauView from '../Account/SceauView.vue';
import SeuilModal from '../Account/SeuilModal.vue';
import ResetPasswordModal from '../Account/ResetPasswordModal.vue';
import ContactModal from '../Header/ContactModal.vue';
import CustomizeModal from '../Header/CustomizeModal.vue';
import CodexModal from '../Achievements/CodexModal.vue';
import GameAchievementsPopup from '../Achievements/GameAchievementsPopup.vue';
import TimerModeButton from '../TimerMode/TimerModeButton.vue';
import TimerQuestions from '../TimerMode/TimerQuestions.vue';
import TimerBrief from '../TimerMode/TimerBrief.vue';
import TrialInventory from '../TimerMode/TrialInventory.vue';
import GModal from '../ui/GModal.vue';
import TabBar from '../ui/TabBar.vue';
import BrumeGuide from '../Game/BrumeGuide.vue';
import PrologueScene from '../Game/PrologueScene.vue';
import PrologueName from '../Game/PrologueName.vue';
import TutorialHand from '../Game/TutorialHand.vue';
import { guide } from '@/game/guide';
import { questTip } from '@/game/guideTips';
import { loadPrologue, savePrologue, prologueStep, islandStep } from '@/game/prologue';
import { faceHref, NAMES } from '@/world/faces';
import { vigilFrames, vigilDue, stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook, earlyWisp, EARLY_WISP } from '@/game/opus';

// Veillées déjà vues sur cet appareil (game/vigils.js)
const VIGILS_KEY = 'oc_vigils';
import { LINES as PROLOGUE_LINES } from '@/game/prologueScenes';

// Retour sur l'application (PWA remise au premier plan) : carnet rechargé s'il date de plus de 30 s
const STATE_RELOAD_AFTER_MS = 30000;
// Copies sur l'appareil pour un affichage immédiat (le serveur reste la référence)
const COINS_KEY = 'coins';
const CUSTOMIZATION_KEY = 'userCustomization';

// Lit le jeton de réinitialisation dans l'adresse puis l'efface (historique, partage d'écran)
function takeResetToken() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('reset');
  if (!token) return null;
  url.searchParams.delete('reset');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export default {
  name: 'App',
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
    TutorialHand
  },
  data() {
    const user = AuthService.getCurrentUser();
    const worn = (user && storage.load(CUSTOMIZATION_KEY)) || {};
    return {
      isLoggedIn: !!user,
      currentUser: user,
      // Éléments de base affichés tout de suite, avant la réponse du serveur
      elementEmojis: { Eau: 'svg:eau', Feu: 'svg:feu', Terre: 'svg:terre', Air: 'svg:air' },
      // Familles : éléments connus du joueur seulement ; leur taille vient du serveur (familyTotals)
      categories: { [BASE_CATEGORY]: [...BASE_ELEMENTS] },
      familyTotals: {},
      // Recettes encore inexplorées par élément du carnet (calculées par le serveur)
      unexploredCounts: {},
      // Éléments posés dans l'Athanor, dans l'ordre des emplacements
      athanorPicked: [],
      discoveredElements: [...BASE_ELEMENTS],
      // Dernier chargement du carnet, et éléments appris pendant un chargement en cours
      stateLoadedAt: 0,
      learnedDuringLoad: null,
      // Écus : gardés par le serveur pour un compte ; un invité n'a qu'un solde de session
      coins: user ? storage.load(COINS_KEY, 0) : 0,
      achievements: [],
      // Succès débloqués en attente d'affichage (un popup à la fois)
      achievementQueue: [],
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
      showSeuil: false,
      isCustomizeModalOpen: false,
      // Le Monde (île du joueur) et le Sceau (le joueur, son compte) remplacent le Livre et l'Athanor
      isWorldActive: false,
      isSceauActive: false,
      // L'Épreuve : inventaire du défi, l'inventaire Infini étant mis de côté (null hors Épreuve)
      isTimerActive: false,
      timerSnapshot: null,
      selectedTimerLevel: null,
      timerModeDiscoveries: 0,
      showTimerEndModal: false,
      timerProgress: emptyProgress(),
      // Question affichée en consigne, jokers offerts restants
      timerQuestion: null,
      freeJokers: FREE_JOKERS,
      // Indice de joker affiché ({ kind, text }), jusqu'à la prochaine découverte
      timerHint: null,
      // Verdict du serveur sur le dernier mélange de l'Épreuve, et bonnes réponses réunies (« 2 / 3 »)
      timerVerdict: null,
      timerAnswersFound: 0,
      // Épreuve lancée côté serveur (les jokers offerts ne se donnent qu'au lancement)
      timerLaunched: false,
      // Jeton du lien « mot de passe oublié » (?reset=…)
      resetToken: takeResetToken(),
      selectedFrame: worn.frame || DEFAULT_FRAME,
      selectedAvatar: worn.avatar || DEFAULT_EMBLEM,
      // Le tutoriel : ce que l'appareil en retient (game/prologue.js), la scène jouée, la page de garde ({ account }),
      // l'élément montré du doigt (sélecteur), les scènes rejouées depuis le Sceau
      prologue: loadPrologue(),
      prologueScene: null,
      prologueName: null,
      prologueHand: null,
      prologueReplay: null,
      // La quête active de Brume sur l'île ({ id, done }), pour les étapes 2 à 5 ; les actes finis et le nom du peuple
      // (veillées, étape de civilisation) ; les veillées déjà vues ici
      islandQuest: null,
      islandActs: [],
      // Les actes finis sont connus (le serveur a répondu) : Brume peut réagir à Feu follet écrit tôt
      actsKnown: false,
      people: null,
      vigilsSeen: storage.load(VIGILS_KEY, [])
    };
  },
  async created() {
    if (!this.isLoggedIn) storage.remove(COINS_KEY);
    // Compte : le dernier carnet connu s'affiche tout de suite, le serveur le remplace dès qu'il répond
    const cached = this.isLoggedIn && readCarnet(this.currentUser?.userId);
    if (cached && cached.families && Object.keys(cached.families).length) this.applyPlayState(cached);
    // Sans compte, le serveur tient un carnet invité
    await Promise.all([this.loadPlayState(), this.isLoggedIn ? this.loadAccount() : null]);
    await this.loadAchievements();
    this.progressReady = true;
  },
  computed: {
    isVigil() {
      return Boolean(this.prologueScene && this.prologueScene.startsWith('veillee-'));
    },
    // Une veillée se compose de ses images (le nom du peuple y figure) ; les autres scènes ont les leurs
    sceneFrames() {
      return this.isVigil ? vigilFrames(this.prologueScene.slice(8), { people: this.people }) : null;
    },
    // L'étape de civilisation (bible, § 6.10) : l'Ex libris du Grimoire l'affiche
    civStage() {
      return civilizationOf(this.islandActs, this.people);
    },
    // Le stade de Brume (bible, § 13), pour la couleur du guide ; avant que le serveur ait répondu, sa couleur de toujours
    brumeStage() {
      return this.actsKnown ? brumeLook({ acts: this.islandActs, quest: this.islandQuest, elements: this.discoveredElements }).stage : null;
    },
    // La couverture du Grimoire attend la scène d'arrivée (et, pour un invité, de savoir s'il est tout neuf)
    prologueHold() {
      const { skipped, started, seen } = this.prologue;
      if (this.isLoggedIn || skipped || seen.includes('arrivee')) return false;
      return !this.progressReady || started;
    },
    currentMode() {
      if (this.isSceauActive) return 'sceau';
      if (this.isWorldActive) return 'world';
      return this.isTimerActive ? 'timer' : 'infinite';
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
    progressReady(now) {
      if (now) this.runPrologue();
    },
    'discoveredElements.length'() {
      if (this.progressReady) this.runPrologue();
      this.checkEarlyWisp();
    },
    isWorldActive(now) {
      if (now) this.runIsland();
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
  },
  beforeUnmount() {
    this.overlays?.disconnect();
    document.removeEventListener('visibilitychange', this.handleVisibility);
    clearTimeout(this.prologueTimer);
  },
  methods: {
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

    // ----- Compte -----
    // Écus, records de l'Épreuve et pièces portées (le Cabinet les garde sur le serveur, d'un appareil à l'autre)
    async loadAccount() {
      // Les actes finis et le nom du peuple : l'étape de civilisation de l'Ex libris (l'île les redonne ensuite)
      playService.brume().then(board => {
        if (!this.islandActs.length) this.islandActs = board.acts || [];
        if (!this.people) this.people = board.people || null;
        this.actsKnown = true;
        this.checkEarlyWisp();
      }).catch(() => {});
      const [progress, selections] = await Promise.all([
        progressService.load().catch(() => null),
        customizationService.getUserSelections()
      ]);
      if (progress) {
        this.handleCoinsUpdated(progress.coins);
        this.timerProgress = { ...emptyProgress(), ...progress.timerProgress };
      }
      if (selections?.selectedFrame) this.selectedFrame = selections.selectedFrame;
      if (selections?.selectedAvatar) this.selectedAvatar = selections.selectedAvatar;
      storage.save(CUSTOMIZATION_KEY, { frame: this.selectedFrame, avatar: this.selectedAvatar });
    },
    handleCoinsUpdated(coins) {
      this.coins = coins;
      if (this.isLoggedIn) storage.save(COINS_KEY, coins);
    },
    handleSaveCustomization({ frame, avatar }) {
      this.selectedFrame = frame;
      this.selectedAvatar = avatar;
      storage.save(CUSTOMIZATION_KEY, { frame, avatar });
      this.isCustomizeModalOpen = false;
    },
    async handleLogout() {
      await AuthService.logout();
      clearCarnet();
      storage.remove(COINS_KEY);
      storage.remove(CUSTOMIZATION_KEY);
      window.location.reload();
    },

    // ----- Carnet de l'Infini (compte ou invité) : ce qu'il faut pour l'afficher, aucune recette -----
    async loadPlayState() {
      // Un élément créé pendant le chargement peut manquer à la réponse : il est gardé
      const learned = new Map();
      this.learnedDuringLoad = learned;
      this.stateLoadedAt = Date.now();
      try {
        const state = await playService.state();
        this.applyPlayState({
          ...state,
          elements: [...new Set([...state.elements, ...learned.keys()])],
          known: { ...state.known, ...Object.fromEntries(learned) }
        });
        this.stateLoadedAt = Date.now();
        this.rememberCarnet();
      } catch (error) {
        console.error('Erreur lors du chargement du carnet:', error);
      } finally {
        if (this.learnedDuringLoad === learned) this.learnedDuringLoad = null;
      }
    },
    applyPlayState(state) {
      this.familyTotals = state.families || {};
      const categories = Object.fromEntries(Object.keys(this.familyTotals).map(family => [family, []]));
      this.applyKnown(state.known, categories);
      this.categories = sortFamilies(categories);
      this.unexploredCounts = state.unexplored || {};
      if (this.timerSnapshot) this.timerSnapshot = state.elements;
      else this.discoveredElements = state.elements;
    },
    // Copie du carnet sur l'appareil (compte seulement, hors Épreuve)
    rememberCarnet() {
      if (!this.isLoggedIn || !this.currentUser || this.timerSnapshot || this.isTimerActive) return;
      // Rien d'utile tant que le serveur n'a pas encore décrit les familles
      if (!Object.keys(this.familyTotals).length) return;
      const owned = new Set(this.discoveredElements);
      const known = {};
      Object.entries(this.categories).forEach(([family, names]) => names.forEach(name => {
        if (owned.has(name)) known[name] = { emoji: this.elementEmojis[name], family };
      }));
      writeCarnet(this.currentUser.userId, {
        elements: [...this.discoveredElements],
        known,
        families: this.familyTotals,
        unexplored: this.unexploredCounts
      });
    },
    // Application mise de côté : copie à jour ; de retour au premier plan : carnet rechargé (autre appareil)
    handleVisibility() {
      if (document.visibilityState === 'hidden') {
        this.rememberCarnet();
        return;
      }
      if (!this.isLoggedIn || this.timerSnapshot || this.isTimerActive) return;
      if (Date.now() - this.stateLoadedAt > STATE_RELOAD_AFTER_MS) this.loadPlayState();
    },
    // Emoji et famille d'éléments connus ({ nom: { emoji, family } })
    applyKnown(known, categories = this.categories) {
      const emojis = { ...this.elementEmojis };
      Object.entries(known || {}).forEach(([name, { emoji, family }]) => {
        emojis[name] = emoji;
        if (!family) return;
        if (!categories[family]) categories[family] = [];
        if (!categories[family].includes(name)) categories[family].push(name);
      });
      this.elementEmojis = emojis;
    },
    // Résultat d'un mélange réussi, renvoyé par le serveur
    learnElement({ result, emoji, family, unexplored, trial }) {
      this.applyKnown({ [result]: { emoji, family } });
      if (!this.isTimerActive) this.learnedDuringLoad?.set(result, { emoji, family });
      if (unexplored) this.unexploredCounts = unexplored;
      // Épreuve : verdict lu juste après, à la révélation (handleCraftSuccess)
      this.timerVerdict = trial || null;
    },

    // ----- Succès -----
    async loadAchievements() {
      try {
        this.achievements = await achievementsService.loadAchievements();
        // Rattrapage : succès déjà mérités mais jamais enregistrés. Un invité n'a pas de succès enregistrés :
        // ceux de son carnet ont déjà été montrés à leur découverte, on les coche sans les rejouer.
        this.checkAchievements({ announce: this.isLoggedIn });
      } catch (error) {
        console.error('Erreur lors du chargement des succès:', error);
      }
    },
    // Seul point de vérification des succès : après une découverte en mode Infini
    checkAchievements({ announce = true } = {}) {
      const unlocked = findNewlyUnlocked(this.achievements, this.discoveredElements);
      if (!unlocked.length) return;
      const unlockedAt = new Date().toISOString();
      unlocked.forEach(achievement => {
        achievement.unlocked = true;
        achievement.unlockedAt = unlockedAt;
      });
      if (announce) this.achievementQueue.push(...unlocked);
      if (this.isLoggedIn) {
        achievementsService.saveUnlocked(unlocked)
          .catch(error => console.error('Erreur lors de la sauvegarde des succès:', error));
      }
    },
    // Brume apporte la quête : une quête accomplie dans le Grimoire (découvertes, élément écrit) est annoncée (comptes)
    async checkQuest() {
      if (!this.isLoggedIn) return;
      try {
        const { quest } = await playService.brume();
        if (quest && quest.done && ['stars', 'element'].includes(quest.kind)) guide.say(questTip(quest));
      } catch {
        // Le guide n'est qu'un confort : la quête reste visible sur l'île
      }
    },
    closeAchievementPopup() {
      this.achievementQueue.shift();
    },
    // Succès débloqué : une gerbe de particules au centre de l'écran
    handleAchievementPopupOpened() {
      this.$refs.background?.burst(window.innerWidth / 2, window.innerHeight / 2);
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

    // ----- Le tutoriel (HISTOIRE.md, § 9) : l'étape se déduit du jeu (game/prologue.js) -----
    savePrologue(changes) {
      this.prologue = { ...this.prologue, ...changes };
      savePrologue(this.prologue);
    },
    runPrologue() {
      if (this.prologueReplay) return;
      const step = prologueStep({ state: this.prologue, loggedIn: this.isLoggedIn, elements: this.discoveredElements });
      if (this.prologueHand?.mode === 'infinite') this.prologueHand = null;
      if (!step) return;
      const { phase } = step;
      if (phase === 'start') {
        // Brume se présente dans la scène : sa présentation du Grimoire n'a plus lieu d'être
        guide.drop('welcome');
        this.savePrologue({ started: true });
        this.runPrologue();
      } else if (phase === 'scene') {
        // Jamais par-dessus l'ouverture d'un chapitre (le sceau qui se brise après la 3e page, qui arrive un peu
        // après la page inscrite) : la scène attend qu'elle ait commencé puis fini
        clearTimeout(this.prologueTimer);
        const show = () => {
          if (document.querySelector('.book-unlock')) this.prologueTimer = setTimeout(show, 700);
          else this.prologueScene = step.scene;
        };
        if (step.scene === 'arrivee') show();
        else this.prologueTimer = setTimeout(show, 2500);
      } else if (phase === 'vent') {
        guide.say({ id: 'prologue-vent', text: PROLOGUE_LINES.vent, top: true });
        this.prologueHand = { target: '.book-view__shelf [data-name="Air"]', mode: 'infinite' };
      } else if (phase === 'pluie') {
        // La page de l'énigme suivante : le Grimoire s'y ouvre une fois, ses pages rechargées (Vent inscrit)
        if (guide.say({ id: 'prologue-pluie', text: PROLOGUE_LINES.pluie })) this.prologueOpenReach = true;
      } else if (phase === 'seul') {
        guide.say({ id: 'prologue-seul', text: PROLOGUE_LINES.seul });
      } else if (phase === 'name') {
        // Le nom écrit juste avant l'inscription (la page s'est rechargée) : il part sans redemander
        if (!step.account && this.prologue.name) this.namePlayer(this.prologue.name);
        else this.prologueName = { account: step.account };
      } else if (phase === 'greve') {
        guide.say({ id: 'prologue-greve', text: PROLOGUE_LINES.greve, action: { label: 'Aller sur l’île', mode: 'world' } });
      }
    },
    // Étapes 2 (sur l'île) à 5 : la quête active de Brume
    onIslandQuest(brume) {
      const quest = brume && brume.quest;
      this.islandQuest = quest ? { id: quest.id, done: Boolean(quest.done) } : { id: null, done: true };
      if (brume) {
        this.islandActs = brume.acts || [];
        this.people = brume.people || null;
        this.actsKnown = true;
        this.checkEarlyWisp();
      }
      this.runIsland();
    },
    // Feu follet écrit avant l'acte VII (bible, § 10) : Brume se reconnaît, une seule fois ; la finale reste au Phare
    checkEarlyWisp() {
      if (this.actsKnown && earlyWisp(this.islandActs, this.discoveredElements)) guide.say(EARLY_WISP);
    },
    runIsland() {
      if (this.prologueReplay || this.prologueScene || !this.isWorldActive) return;
      const step = islandStep({ state: this.prologue, quest: this.islandQuest?.id ? this.islandQuest : null });
      if (this.prologueHand?.mode === 'world') this.prologueHand = null;
      if (!step) {
        // Hors du tutoriel : la veillée du dernier acte fini, si elle n'a pas encore été vue ici
        // (jamais pendant le tutoriel d'un compte créé par la page de garde)
        const { registered, finished, skipped } = this.prologue;
        const act = vigilDue(this.islandActs, this.vigilsSeen);
        if (act && !(registered && !finished && !skipped)) this.prologueScene = `veillee-${act}`;
        return;
      }
      if (step.phase === 'scene') this.prologueScene = step.scene;
      else if (step.phase === 'harvest') this.prologueHand = { target: '.world__play', mode: 'world' };
      else if (step.phase === 'lines') step.lines.forEach(line => this.sayPrologue(line));
      else if (step.phase === 'finish') this.savePrologue({ finished: true });
    },
    // Une réplique du tutoriel : de Brume, ou d'un membre de la troupe (son portrait dans la bulle)
    sayPrologue(line) {
      const entry = PROLOGUE_LINES[line];
      const { who, text } = typeof entry === 'string' ? { text: entry } : entry;
      guide.say({ id: `prologue-${line}`, text, ...(who ? { who: NAMES[who], face: faceHref(who) } : {}) });
    },
    onBookLoaded() {
      if (!this.prologueOpenReach) return;
      this.prologueOpenReach = false;
      this.$refs.book?.openReach('I');
    },
    // Chronique : revoir une veillée (rien ne change à la partie)
    replayVigil(act) {
      this.prologueReplay = [];
      this.prologueScene = `veillee-${act}`;
    },
    prologueSceneDone(scene) {
      if (scene.startsWith('veillee-') && !this.prologueReplay) {
        this.prologueScene = null;
        this.vigilsSeen = [...new Set([...this.vigilsSeen, scene.slice(8)])];
        storage.save(VIGILS_KEY, this.vigilsSeen);
        this.runIsland();
        return;
      }
      if (this.prologueReplay) {
        // Revoir le prologue : les scènes s'enchaînent, sans rien changer à la partie
        const next = this.prologueReplay.shift();
        this.prologueScene = next || null;
        if (!next) this.prologueReplay = null;
        return;
      }
      this.prologueScene = null;
      this.savePrologue({ seen: [...new Set([...this.prologue.seen, scene])] });
      this.runPrologue();
      this.runIsland();
    },
    skipPrologue() {
      this.prologueScene = null;
      this.prologueName = null;
      this.prologueHand = null;
      this.savePrologue({ skipped: true });
    },
    replayPrologue() {
      this.prologueReplay = ['aster', 'recolte', 'cannelle', 'rivet', 'ondin', 'campement'];
      this.prologueScene = 'arrivee';
    },
    // Page de garde : l'inscription recharge la page ; le nom attend sur l'appareil, puis part au serveur
    prologueSigning(name) {
      this.savePrologue({ name, registered: true });
    },
    prologueUnsigned() {
      this.savePrologue({ name: null, registered: false });
    },
    // Un compte existant retrouvé : c'est un joueur qui a déjà sa partie, le tutoriel s'arrête
    prologueSignedIn() {
      this.savePrologue({ registered: false });
    },
    async namePlayer(name) {
      try {
        await playService.worldPlayer(name);
        this.prologueName = null;
        this.savePrologue({ named: true, name: null });
        this.runPrologue();
      } catch (error) {
        this.prologueName = { account: false };
        this.showAlert(messageOf(error, 'Le nom n’a pas pu être écrit.'));
      }
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
    },

    // ----- L'Épreuve : le sablier (TimerModeButton) et les questions (TimerQuestions) passent par ici -----
    handleTimerStateChange(isActive) {
      // Le sablier peut émettre plusieurs fois « actif » : on n'agit que sur les transitions
      const wasActive = this.isTimerActive;
      this.isTimerActive = isActive;
      if (isActive && !wasActive) {
        this.resetCraftBoard();
        this.enterTimerMode();
        this.timerModeDiscoveries = 0;
        this.selectedTimerLevel = null;
        this.$refs.timerQuestions?.show();
      } else if (!isActive) {
        this.resetCraftBoard();
        // selectedTimerLevel est conservé pour la fenêtre de fin (handleTimerComplete)
        this.exitTimerMode();
        this.$refs.timerQuestions?.resetQuestions();
      }
    },
    // Met de côté l'inventaire Infini au début de l'Épreuve
    enterTimerMode() {
      if (!this.timerSnapshot) this.timerSnapshot = [...this.discoveredElements];
    },
    // Restaure l'inventaire Infini à la fin de l'Épreuve
    exitTimerMode() {
      if (!this.timerSnapshot) return;
      this.discoveredElements = this.timerSnapshot;
      this.timerSnapshot = null;
    },
    showLevelSelection() {
      this.$refs.timerModeButton?.showLevelSelection();
    },
    showCurrentTimerQuestion() {
      this.$refs.timerQuestions?.show();
    },
    handleLevelSelected(levelData) {
      this.selectedTimerLevel = levelData.level;
      this.freeJokers = FREE_JOKERS;
      this.timerLaunched = false;
      this.$refs.timerModeButton?.handleLevelSelected(levelData);
    },
    handleTimerPause() {
      this.$refs.timerModeButton?.pauseTimer();
    },
    handleTimerResume() {
      this.$refs.timerModeButton?.resumeTimer();
    },
    handleTimerStop() {
      this.$refs.timerModeButton?.confirmStopTimer();
    },
    handleTimerReset() {
      this.$refs.timerModeButton?.resetTimer();
    },
    handleTimerForceStop() {
      this.isTimerActive = false;
      this.selectedTimerLevel = null;
      this.exitTimerMode();
      this.timerModeDiscoveries = 0;
      this.$refs.timerQuestions?.resetQuestions();
    },
    // Éléments de départ d'une question : le serveur les pose aussi en main (les mélanges y sont vérifiés)
    handleSetInitialInventory(elements, questionId) {
      if (!this.isTimerActive) return;
      this.startTimerRun(questionId);
      this.resetCraftBoard();
      this.discoveredElements = [...new Set([...BASE_ELEMENTS, ...(Array.isArray(elements) ? elements : [])])];
    },
    async startTimerRun(questionId) {
      if (!Number.isInteger(questionId)) return;
      try {
        const run = await playService.startRun('timer', { questionId, launch: !this.timerLaunched });
        this.timerLaunched = true;
        this.freeJokers = run.freeJokers;
        this.applyKnown(run.known);
      } catch (error) {
        this.showAlert(messageOf(error, 'L’épreuve n’a pas pu démarrer, réessaie.'));
      }
    },
    // Joker : le serveur compte les jokers offerts, débite les suivants et calcule l'indice
    async useJoker(kind) {
      try {
        const reply = await playService.joker(kind);
        this.freeJokers = reply.freeJokers;
        if (reply.coins !== undefined) this.handleCoinsUpdated(reply.coins);
        if (kind === 'time') this.$refs.timerModeButton?.addTime(JOKER_TIME);
        else if (kind === 'step') this.timerHint = { kind, text: `Essaie ${reply.ingredients.join(' + ')}.` };
        else this.timerHint = { kind, text: `Pense à ${reply.ingredient}…` };
      } catch (error) {
        this.showAlert(messageOf(error, 'Le joker n’a pas pu être utilisé.'));
      }
    },
    // Un compte est payé par le serveur au moment de la réussite (verdict) ; un invité garde un solde de session
    handleCoinsEarned({ points }) {
      if (!this.isLoggedIn) this.handleCoinsUpdated(this.coins + points);
    },
    // Fin du sablier : score compté par le serveur, qui verse le bonus si le record du niveau monte (compte)
    async handleTimerComplete() {
      let end = null;
      try {
        end = await playService.finishTimer();
      } catch (error) {
        console.error('Fin d’épreuve non enregistrée:', error);
      }
      const score = end ? end.score : this.timerModeDiscoveries;
      if (end?.coins !== undefined) this.handleCoinsUpdated(end.coins);
      const level = this.selectedTimerLevel;
      if (level && score > (this.timerProgress.bestScores?.[level] || 0)) {
        if (!this.isLoggedIn) this.handleCoinsUpdated(this.coins + score * 5);
        this.timerProgress = { ...this.timerProgress, bestScores: { ...this.timerProgress.bestScores, [level]: score } };
        trialService.saveProgress({ bestScores: { [level]: score } })
          .then(saved => { if (saved) this.timerProgress = saved; })
          .catch(error => console.error('Record non enregistré:', error));
      }
      this.exitTimerMode();
      this.showTimerEndModal = true;
    },
    // Questions et chapitres réussis (TimerQuestions) ; les records restent les meilleurs connus ici
    handleTimerProgress(progress) {
      const best = { ...this.timerProgress.bestScores };
      Object.entries(progress.bestScores || {}).forEach(([level, score]) => { best[level] = Math.max(best[level] || 0, score || 0); });
      this.timerProgress = { ...progress, bestScores: best };
    },
    handleTimerEndModalClose() {
      this.showTimerEndModal = false;
      this.exitTimerMode();
      this.selectedTimerLevel = null;
      this.$refs.timerQuestions?.resetQuestions();
    }
  }
};
</script>

<style>
/* Mise en page : PC en 2 colonnes (registre | Athanor), mobile en registre plein écran + dock */
.oc-app {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: var(--oc-text);
  font-family: var(--oc-font-body);
}
.oc-app__shell {
  position: relative;
  z-index: 1;
  max-width: 1480px;
  margin: 0 auto;
  /* Mobile : la place des panneaux fixés en bas (dock et consigne mesurés, puis la barre d'onglets) */
  padding: 0 var(--oc-gutter) calc(var(--oc-overlay, var(--oc-dock-height)) + var(--oc-tabbar-h) + 24px);
}
/* Le Monde et le Sceau n'ont pas de dock : seule la barre d'onglets prend de la place */
.oc-app__shell:has(.oc-app__main--world) { padding-bottom: calc(var(--oc-tabbar-h) + 24px); }
.oc-app__main { display: block; }
.oc-app__main--world { display: block !important; max-width: 760px; margin: 0 auto; }
.oc-app__inventory { min-width: 0; }
@media (min-width: 860px) {
  /* PC : le rail d'onglets à gauche */
  .oc-app__shell, .oc-app__shell:has(.oc-app__main--world) { padding: 0 28px 32px calc(var(--oc-rail-w) + 28px); }
  .oc-app__main {
    display: grid;
    /* La liste prend la place disponible et grandit avec les découvertes ; la zone reste à droite */
    grid-template-columns: minmax(0, 1fr) 420px;
    gap: 28px;
    align-items: start;
  }
  /* La zone reste en vue pendant qu'on fait défiler l'inventaire */
  .oc-app__craft { position: sticky; top: 16px; }
}

/* Fin d'épreuve (fenêtre de l'App) */
.timer-end { display: flex; gap: 48px; justify-content: center; }
.timer-end__stat { display: flex; flex-direction: column; gap: 4px; align-items: center; }
.timer-end__big { font-size: 56px; line-height: 1; }
</style>

