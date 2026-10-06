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
      :skippable="!prologueReplay || isVigil || isStory"
      :skip-label="isVigil ? 'Passer la veillée' : isStory ? 'Passer' : 'Passer le prologue'"
      @done="prologueSceneDone"
      @skip="isVigil || isStory ? prologueSceneDone(prologueScene) : skipPrologue()"
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
import notificationService from '@/services/notificationService';
import * as storage from '@/utils/storage';
import { readCarnet } from '@/utils/carnet';
import { failLine } from '@/utils/failLine';
import { ringsFor } from '@/utils/sigil';
import { roman } from '@/utils/roman';
import { ERA_NAMES, familyColor, familyIndex, discoveredFamilies, eraOf, slotCountForEra, stageOf, populationFor } from '@/utils/eras';
import account, { COINS_KEY } from './account';
import carnet from './carnet';
import achievements from './achievements';
import story from './story';
import trial from './trial';
import AppHeader from '../AppHeader/AppHeader.vue';
import CraftZone from '../../Craft/CraftZone/CraftZone.vue';
import LivingBackground from '../LivingBackground/LivingBackground.vue';
import BookView from '../../Book/BookView/BookView.vue';
import WorldView from '../../World/WorldView/WorldView.vue';
import SceauView from '../../Account/SceauView/SceauView.vue';
import SeuilModal from '../../Account/SeuilModal/SeuilModal.vue';
import ResetPasswordModal from '../../Account/ResetPasswordModal/ResetPasswordModal.vue';
import ContactModal from '../../Settings/ContactModal/ContactModal.vue';
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
import TutorialHand from '../../Guide/TutorialHand/TutorialHand.vue';

export default {
  name: 'App',
  // Le compte, le carnet, les succès, l'histoire et l'Épreuve vivent chacun dans leur fichier, à côté (mixins) ;
  // App garde ce qui les relie : les modes, l'Athanor, l'ère et les familles, le cycle de vie
  mixins: [account, carnet, achievements, story, trial],
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
      showSeuil: false,
      isCustomizeModalOpen: false,
      // Le Monde (île du joueur) et le Sceau (le joueur, son compte) remplacent le Livre et l'Athanor
      isWorldActive: false,
      isSceauActive: false
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

