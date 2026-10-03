<template>
  <div class="oc-app" id="game-container">
    <LivingBackground ref="background" :era="era" :population="population" :palette="palette" />

    <div class="oc-app__shell">
      <AppHeader :found="discoveredCount" :total="totalElements" :eraLabel="eraLabel" :coins="coins" :timerActive="isTimerActive">
        <template #timer>
          <TimerModeButton
            ref="timerModeButton"
            :showTrigger="false"
            @timer-state-change="handleTimerStateChange"
            @timer-complete="handleTimerComplete"
            @show-question="showCurrentTimerQuestion"
            @force-stop="handleTimerForceStop"
          />
        </template>
        <template #actions>
          <!-- Raccourcis PC ; sur mobile, ils sont dans le menu du sceau -->
          <button type="button" class="g-icon-btn oc-desk-only" aria-label="Codex des succès" @click="showCodex = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M5 3h11l3 3v15H5z"></path><path d="M9 8h6M9 12h6M9 16h3"></path></svg>
          </button>
          <button type="button" class="g-icon-btn oc-desk-only" aria-label="Écrire aux créateurs" @click="showContact = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M3 6h18v12H3z"></path><path d="M3 6l9 7 9-7"></path></svg>
          </button>
          <AccountMenu
            ref="accountMenu"
            :isLoggedIn="isLoggedIn"
            :currentUser="currentUser"
            :shares="sigilShares"
            :rings="rings"
            :worn="worn"
            :eraLabel="eraLabel"
            :compact="isTimerActive"
            @open-sceau="showSceau = true"
            @open-cabinet="handleOpenCustomizeModal"
            @open-codex="showCodex = true"
            @open-contact="showContact = true"
            @logout="handleLogout"
          />
        </template>
        <template #modes>
          <ModeSwitcher :current="currentMode" @select="handleModeSelect" />
        </template>
      </AppHeader>

      <main id="main-content" ref="mainContent" :class="['oc-app__main', { 'oc-app__main--world': isWorldActive }]">
        <div class="oc-app__inventory">
          <!-- Le Monde : l'île du joueur -->
          <WorldView
            v-if="isWorldActive"
            :discoveredElements="discoveredElements"
            :elementEmojis="elementEmojis"
            :isLoggedIn="isLoggedIn"
            @coins-updated="handleCoinsUpdated"
            @show-alert="showAlert"
            @login="$refs.accountMenu?.openSeuil()"
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
            :revealing="isRevealing"
            @select="handleResourceSelection"
            @coins-updated="handleCoinsUpdated"
            @show-alert="showAlert"
            @aim="bookAim = $event"
          />
          <GameInventory
            v-else
            :categories="categories"
            :familyTotals="familyTotals"
            :discoveredElements="discoveredElements"
            :elementEmojis="elementEmojis"
            :isTimerMode="isTimerActive"
            :freshElement="freshElement"
            :unexplored="unexplored"
            :reachable="isTimerActive ? null : reachableCount"
            @selectResource="handleResourceSelection"
            @fuse="$refs.craftZone?.fuse()"
            @inspect="inspected = $event"
            @hint="useInfiniteHint"
          />
        </div>
        <div v-show="!isWorldActive" class="oc-app__craft">
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
          />
        </div>
      </main>
    </div>
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
    <ElementSheet
      v-if="inspected && sheetOrigins"
      :name="inspected"
      :emoji="elementEmojis[inspected]"
      :family="familyOf(inspected)"
      :origins="sheetOrigins.origins"
      :more="sheetOrigins.more"
      :pending="unexplored[inspected] || 0"
      @close="inspected = null"
      @use="inspected = null; handleResourceSelection($event)"
    />
    <ResetPasswordModal
      v-if="resetToken"
      :token="resetToken"
      @close="resetToken = null"
      @login="resetToken = null; $refs.accountMenu.openSeuil()"
    />
    <ContactModal v-if="showContact" @close="showContact = false" />
    <CodexModal v-if="showCodex" :achievements="achievements" @close="showCodex = false" />
    <SceauModal
      v-if="showSceau"
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
      @close="showSceau = false"
      @open-codex="showSceau = false; showCodex = true"
      @logout="handleLogout"
    />
    <TimerQuestions 
      v-show="isTimerActive"
      ref="timerQuestions"
      :isLoggedIn="isLoggedIn"
      :discoveredElements="discoveredElements"
      :answersFound="timerAnswersFound"
      @reset-timer="handleTimerReset"
      @show-level-selection="showLevelSelection"
      @pause-timer="handleTimerPause"
      @resume-timer="handleTimerResume"
      @stop-timer="handleTimerStop"
      @set-initial-inventory="handleSetInitialInventory"
      @reset-craft-zone="handleResetCraftZone"
      @level-selected="handleLevelSelected"
      @coins-earned="handleCoinsEarned"
      @add-emojis="elementEmojis = { ...$event, ...elementEmojis }"
      @timer-progress-updated="timerProgress = $event"
      @question-changed="timerQuestion = $event"
    />
    <CustomizeModal 
      v-if="isCustomizeModalOpen" 
      :currentFrame="selectedFrame"
      :currentAvatar="selectedAvatar"
      :userCoins="coins"
      :shares="sigilShares"
      :rings="rings"
      @close="handleCloseCustomizeModal" 
      @save="handleSaveCustomization"
      @coins-updated="handleCoinsUpdated" 
    />
  </div>
</template>

<script>
import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import achievementsService from '@/services/achievementsService';
import playService from '@/services/playService';
import { readCarnet, writeCarnet, clearCarnet } from '@/utils/carnet';
import { failLine } from '@/utils/failLine';
import { findNewlyUnlocked } from '@/utils/achievementChecker';
import { BASE_ELEMENTS, BASE_CATEGORY } from '@/utils/gameConstants';
import timerService from '@/services/timerService';
import customizationService from '@/services/customizationService';
import notificationService from '@/services/notificationService';
import ContactModal from '../Header/ContactModal.vue';
import GameAchievementsPopup from '../Achievements/GameAchievementsPopup.vue';
import GameInventory from '../Inventory/GameInventory.vue';
import CodexModal from '../Achievements/CodexModal.vue';
import AccountMenu from '../Account/AccountMenu.vue';
import SceauModal from '../Account/SceauModal.vue';
import GModal from '../ui/GModal.vue';
import { ringsFor } from '@/utils/sigil';
import { roman } from '@/utils/roman';
import TimerModeButton from '../TimerMode/TimerModeButton.vue';
import TimerQuestions from '../TimerMode/TimerQuestions.vue';
import TimerBrief from '../TimerMode/TimerBrief.vue';
import ElementSheet from '../Inventory/ElementSheet.vue';
import ResetPasswordModal from '../Account/ResetPasswordModal.vue';
import { FREE_JOKERS, JOKER_TIME } from '@/utils/hints';

// Retour sur l'application (PWA remise au premier plan) : carnet rechargé s'il date de plus de 30 s
const STATE_RELOAD_AFTER_MS = 30000;
import CustomizeModal from '../Header/CustomizeModal.vue';
import AppHeader from '../Game/AppHeader.vue';
import ModeSwitcher from '../Game/ModeSwitcher.vue';
import CraftZone from '../Game/CraftZone.vue';
import BookView from '../Book/BookView.vue';
import WorldView from '../World/WorldView.vue';
import LivingBackground from '../Game/LivingBackground.vue';
import { ERA_NAMES, familyColor, discoveredFamilies, eraOf, slotCountForEra, sortFamilies, stageOf, populationFor } from '@/utils/eras';

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
    ModeSwitcher,
    CraftZone,
    BookView,
    WorldView,
    LivingBackground,
    ContactModal,
    GameAchievementsPopup,
    GameInventory,
    CodexModal,
    AccountMenu,
    SceauModal,
    GModal,
    TimerModeButton,
    TimerQuestions,
    TimerBrief,
    ElementSheet,
    ResetPasswordModal,
    CustomizeModal
  },
  data() {
    return {
      // Éléments de base affichés tout de suite, avant la réponse du serveur
      elementEmojis: { Eau: '💧', Feu: '🔥', Terre: '🌎', Air: '💨' },
      // Familles : éléments connus du joueur seulement ; leur taille vient du serveur (familyTotals)
      categories: { [BASE_CATEGORY]: [...BASE_ELEMENTS] },
      familyTotals: {},
      // Recettes encore inexplorées par élément du carnet (calculées par le serveur)
      unexploredCounts: {},
      // Nombre d'éléments inconnus créables tout de suite (calculé par le serveur)
      reachableCount: null,
      // Dernier chargement du carnet, et éléments appris pendant un chargement en cours
      stateLoadedAt: 0,
      learnedDuringLoad: null,
      discoveredCategories: [BASE_CATEGORY],
      discoveredElements: [...BASE_ELEMENTS],
      achievements: [],
      saveInterval: null,
      // Succès débloqués en attente d'affichage (un popup à la fois)
      achievementQueue: [],
      // Dernière découverte, mise en valeur dans l'inventaire
      freshElement: null,
      // Page à portée ouverte dans le Livre (visée par l'Athanor)
      bookAim: null,
      // Révélation d'une création en cours : les popups de succès attendent
      isRevealing: false,
      isLoggedIn: false,
      currentUser: null,
      categoryProgress: {},
      showCodex: false,
      showContact: false,
      showSceau: false,
      isTimerActive: false,
      // Le Monde (île du joueur) affiché à la place du Livre et de l'Athanor
      isWorldActive: false,
      showTimerEndModal: false,
      timerModeDiscoveries: 0,
      // Inventaire Infini mis de côté pendant une session Timer (null hors Timer)
      timerSnapshot: null,
      currentTimerElements: [],
      selectedTimerLevel: null,
      coins: parseInt(localStorage.getItem('coins')) || 0,
      // Épreuve : question affichée en consigne, jokers offerts restants
      timerQuestion: null,
      freeJokers: FREE_JOKERS,
      // Indice de joker affiché ({ kind, text }), jusqu'à la prochaine découverte
      timerHint: null,
      // Verdict du serveur sur le dernier mélange de l'Épreuve, et bonnes réponses réunies (« 2 / 3 »)
      timerVerdict: null,
      timerAnswersFound: 0,
      // Épreuve lancée côté serveur (les jokers offerts ne se donnent qu'au lancement)
      timerLaunched: false,
      // Élément dont la fiche est ouverte, et ses recettes (chargées au serveur)
      inspected: null,
      sheetOrigins: null,
      // Jeton du lien « mot de passe oublié » (?reset=…)
      resetToken: takeResetToken(),
      timerProgress: {
        completedQuestions: {
          Facile: {},
          Moyen: {},
          Difficile: {}
        },
        unlockedCategories: {
          Facile: [],
          Moyen: [],
          Difficile: []
        },
        bestScores: {
          Facile: 0,
          Moyen: 0,
          Difficile: 0
        },
        lastPlayedLevel: null,
        lastPlayedCategory: null
      },
      isCustomizeModalOpen: false,
      selectedFrame: 'basicCadre.png',
      selectedAvatar: 'coin.png'
    };
  },
  async created() {
  this.checkAuth();
  // Compte : le dernier carnet connu s'affiche tout de suite, le serveur le remplace dès qu'il répond
  const cached = this.isLoggedIn && readCarnet(this.currentUser?.userId);
  if (cached && cached.families && Object.keys(cached.families).length) this.applyPlayState(cached);
  // Sans compte, le serveur tient un carnet invité
  const progress = this.isLoggedIn ? this.loadGameProgress().catch(() => {}) : null;
  await Promise.all([this.loadPlayState(), progress]);
  await this.loadAchievements();
  // Désormais, un changement d'ère vient d'une découverte (pas du chargement)
  this.progressReady = true;
  if (this.isLoggedIn) {
    this.loadSavedCustomization();
    // Démarrer la sauvegarde périodique
    this.startPeriodicSave();
  }
},
computed: {
  currentMode() {
    if (this.isWorldActive) return 'world';
    return this.isTimerActive ? 'timer' : 'infinite';
  },
  // La progression (ère, fond) suit toujours l'inventaire Infini, même pendant un Timer
  infiniteElements() {
    return this.timerSnapshot ? this.timerSnapshot.elements : this.discoveredElements;
  },
  families() {
    return discoveredFamilies(this.categories, this.infiniteElements);
  },
  // Ère affichée et fond vivant : lente, au fil des découvertes
  era() {
    return stageOf(this.discoveredCount);
  },
  // Recettes encore inexplorées par élément découvert (Registre et fiches)
  unexplored() {
    return this.isTimerActive ? {} : this.unexploredCounts;
  },
  // Pièces du Cabinet portées sur le sceau
  worn() {
    return { frame: this.selectedFrame, emblem: this.selectedAvatar };
  },
  eraLabel() {
    return `Ère ${roman(this.era)} · ${ERA_NAMES[this.era - 1]}`;
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
  // Emplacements de fusion : 4 en Timer, sinon débloqués au fil des ères
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
  }
},
watch: {
  // Les panneaux fixés en bas changent avec le mode : on remesure la place à leur réserver
  isTimerActive() {
    this.$nextTick(this.trackOverlays);
  },
  timerQuestion() {
    this.timerHint = null;
    this.timerAnswersFound = 0;
    this.$nextTick(this.trackOverlays);
  },
  // Fiche d'élément : ses recettes à portée viennent du serveur
  inspected(name) {
    this.sheetOrigins = null;
    if (!name) return;
    playService.origins(name)
      .then(reply => { if (this.inspected === name) this.sheetOrigins = reply; })
      .catch(() => { if (this.inspected === name) this.sheetOrigins = { origins: [], more: 0 }; });
  },
  // Un emplacement de plus : on le dit (hors Timer, où il y en a toujours 4)
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
  clearInterval(this.saveInterval);
  
  // Sauvegarde finale avant de quitter
  if (this.isLoggedIn) {
    this.saveGameProgress();
  }
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
    loadSavedCustomization() {
      if (this.isLoggedIn) {
        const savedCustomization = localStorage.getItem('userCustomization');
        if (savedCustomization) {
          try {
            const customization = JSON.parse(savedCustomization);
            this.selectedFrame = customization.frame || 'basicCadre.png';
            this.selectedAvatar = customization.avatar || 'coin.png';
          } catch (error) {
            console.error("Erreur lors du chargement de la personnalisation:", error);
          }
        }
        // Le Cabinet enregistre les pièces portées sur le serveur : elles suivent le compte d'un appareil à l'autre
        customizationService.getUserSelections().then(({ selectedFrame, selectedAvatar } = {}) => {
          if (selectedFrame) this.selectedFrame = selectedFrame;
          if (selectedAvatar) this.selectedAvatar = selectedAvatar;
        }).catch(() => {});
      } else {
        this.selectedFrame = 'basicCadre.png';
        this.selectedAvatar = 'coin.png';
      }
    },
    showLevelSelection() {
    // Cette méthode va réafficher le menu de sélection de difficulté
    if (this.$refs.timerModeButton) {
      this.$refs.timerModeButton.showLevelSelection();
    }
  },

    saveDiscoveredElement(element, gameMode = 'infinite') {
  // Ignorer un élément déjà dans la liste spécifique au mode
  if (gameMode === 'timer') {
    // Pour le mode Timer, utiliser la liste timerElements
    if (!this.currentTimerElements.includes(element)) {
      this.currentTimerElements.push(element);
    } else {
      return; // Déjà dans la liste
    }
  } else {
    // Mode Infinite (par défaut)
    if (!this.discoveredElements.includes(element)) {
      this.discoveredElements.push(element);
      
      // Déterminer la catégorie de l'élément
      const targetCategory = Object.keys(this.categories).find((category) =>
        this.categories[category].includes(element)
      );
      
      // Ajouter la catégorie si elle n'existe pas déjà
      if (targetCategory && !this.discoveredCategories.includes(targetCategory)) {
        console.log(`Ajout de la catégorie: ${targetCategory}`);
        this.discoveredCategories.push(targetCategory);
      }
      
      // Mettre à jour les statistiques de progression des catégories
      this.updateCategoryProgress();
    } else {
      return; // Déjà dans la liste
    }
  }
  
  // Sauvegarder dans localStorage uniquement en mode infinite
  if (gameMode === 'infinite') {
    localStorage.setItem('discoveredElements', JSON.stringify(this.discoveredElements));
    localStorage.setItem('discoveredCategories', JSON.stringify(this.discoveredCategories));
    this.checkAchievements();
  }
  
  // La découverte est déjà inscrite par le serveur (mélange réussi) ; reste l'avancement des familles
  if (this.isLoggedIn && gameMode === 'infinite') {
    this.saveGameProgress();
  }
},

    handleCoinsUpdated(newCoins) {
      this.coins = newCoins;
      // Sauvegarder en localStorage aussi
      localStorage.setItem('coins', newCoins.toString());
    },
    handleInfiniteModeActivation() {
      // Arrêter le Timer : handleTimerStateChange(false) restaure l'inventaire Infini
      if (this.isTimerActive && this.$refs.timerModeButton) {
        this.$refs.timerModeButton.confirmStopTimer();
      }
      this.resetCraftBoard();
    },
    handleLevelSelected(levelData) {
      this.selectedTimerLevel = levelData.level;
      this.freeJokers = FREE_JOKERS;
      this.timerLaunched = false;
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.handleLevelSelected(levelData);
      }
    },

    handleTimerPause() {
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.pauseTimer();
      }
    },

    handleTimerResume() {
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.resumeTimer();
      }
    },

    handleTimerStop() {
      if (this.$refs.timerModeButton) {
        this.$refs.timerModeButton.confirmStopTimer();
      }
    },

    startPeriodicSave() {
  if (this.saveInterval) {
    clearInterval(this.saveInterval);
  }
  
  // Augmenter l'intervalle à 10 minutes au lieu de 2
  this.saveInterval = setInterval(() => {
    if (this.isLoggedIn) {
      // Vérifier s'il y a des changements à sauvegarder
      const currentGameState = JSON.stringify({
        elements: this.discoveredElements,
        categories: this.discoveredCategories,
        coins: this.coins
      });
      
      // Stocker l'état actuel pour comparaison future
      const previousState = localStorage.getItem('previousGameState');
      
      // Ne sauvegarder que si l'état a changé
      if (previousState !== currentGameState) {
        console.log('Changements détectés, sauvegarde périodique...');
        localStorage.setItem('previousGameState', currentGameState);
        this.saveGameProgress();
      } else {
        console.log('Aucun changement, sauvegarde périodique ignorée.');
      }
    }
  }, 600000); // 10 minutes au lieu de 2
},

    handleResetCraftZone() {
      this.resetCraftBoard();
    },
    handleSetInitialInventory(elements, questionId) {
  if (!this.isTimerActive) return;
  this.startTimerRun(questionId);
  
  this.resetCraftBoard();
  
  // Réinitialiser à juste les éléments fondamentaux
  this.discoveredElements = [...BASE_ELEMENTS];
  
  if (Array.isArray(elements)) {
    // Ajouter les éléments requis pour cette question à l'inventaire temporaire
    this.currentTimerElements = [...new Set(elements)];
    this.currentTimerElements.forEach(element => {
      if (!this.discoveredElements.includes(element)) {
        this.discoveredElements.push(element);
      }
    });
    
    // Sauvegarde non bloquante des éléments de la question
    if (this.isLoggedIn) {
      timerService.saveTimerElements(this.currentTimerElements)
        .catch(error => console.warn('Erreur non bloquante lors de la sauvegarde des éléments Timer:', error));
    }
  }
  
  this.updateCategoryProgress();
},


handleTimerForceStop() {
  this.isTimerActive = false;
  this.selectedTimerLevel = null;
  this.exitTimerMode();
  this.timerModeDiscoveries = 0;
  
  if (this.$refs.timerQuestions) {
    this.$refs.timerQuestions.resetQuestions();
  }
},


    showCurrentTimerQuestion() {
      if (this.$refs.timerQuestions) {
        this.$refs.timerQuestions.show();
      }
    },
    loadGameProgress() {
  if (!this.isLoggedIn) return Promise.resolve();

  // Variables pour suivre les chargements
  if (!this._lastLoadTimestamp) {
    this._lastLoadTimestamp = 0;
    this._progressCache = null;
  }

  // Eviter les chargements trop fréquents (pas plus d'une fois toutes les 30 secondes)
  const now = Date.now();
  if (this._progressCache && now - this._lastLoadTimestamp < 30000) {
    console.log('Utilisation du cache pour loadGameProgress');
    return Promise.resolve(this._progressCache);
  }

  try {
    return progressService.loadGameProgress()
      .then(progress => {
        // Mettre à jour le cache
        this._lastLoadTimestamp = now;
        this._progressCache = progress;

        if (progress) {
          if (progress.coins !== undefined) {
            this.coins = parseInt(progress.coins);
            localStorage.setItem('coins', this.coins.toString());
          }

          if (progress.discoveredElements) {
            try {
              let elementsToSet = [];
              
              if (typeof progress.discoveredElements === 'string') {
                const parsed = JSON.parse(progress.discoveredElements);
                elementsToSet = Array.isArray(parsed) 
                  ? parsed.map(element => element.replace(/^"|"$/g, ''))
                  : [...BASE_ELEMENTS];
              } else if (Array.isArray(progress.discoveredElements)) {
                elementsToSet = progress.discoveredElements;
              } else {
                console.warn('DEBUG - Format des éléments découverts invalide');
                elementsToSet = [...BASE_ELEMENTS];
              }

              // Session Timer en cours : la progression chargée va dans l'inventaire mis de côté
              if (this.timerSnapshot) {
                this.timerSnapshot.elements = elementsToSet;
              } else {
                this.discoveredElements = elementsToSet;
              }
              localStorage.setItem('discoveredElements', JSON.stringify(elementsToSet));
            } catch (e) {
              console.error("DEBUG - Erreur parsing discoveredElements:", e);
              this.discoveredElements = [...BASE_ELEMENTS];
            }
          } else {
            console.warn('DEBUG - Aucun élément découvert dans la progression');
            this.discoveredElements = [...BASE_ELEMENTS];
          }

          if (progress.discoveredCategories) {
            try {
              let categoriesToSet = [];
              
              if (typeof progress.discoveredCategories === 'string') {
                const parsed = JSON.parse(progress.discoveredCategories);
                categoriesToSet = Array.isArray(parsed)
                  ? parsed.map(cat => cat.replace(/^"|"$/g, ''))
                  : [BASE_CATEGORY];
              } else if (Array.isArray(progress.discoveredCategories)) {
                categoriesToSet = progress.discoveredCategories;
              } else {
                console.warn('DEBUG - Format des catégories découvertes invalide');
                categoriesToSet = [BASE_CATEGORY];
              }

              if (this.timerSnapshot) {
                this.timerSnapshot.categories = categoriesToSet;
              } else {
                this.discoveredCategories = categoriesToSet;
              }
              localStorage.setItem('discoveredCategories', JSON.stringify(categoriesToSet));
            } catch (e) {
              console.error("DEBUG - Erreur parsing discoveredCategories:", e);
              this.discoveredCategories = [BASE_CATEGORY];
            }
          } else {
            console.warn('DEBUG - Aucune catégorie découverte dans la progression');
            this.discoveredCategories = [BASE_CATEGORY];
          }

          if (progress.categoryProgress) {
            try {
              this.categoryProgress = typeof progress.categoryProgress === 'string'
                ? JSON.parse(progress.categoryProgress)
                : progress.categoryProgress;
            } catch (e) {
              console.error("DEBUG - Erreur parsing categoryProgress:", e);
              this.categoryProgress = {};
            }
          }

          if (progress.timerProgress) {
            this.timerProgress = progress.timerProgress;
          }

          if (progress.customization) {
            this.selectedFrame = progress.customization.frame || 'basicCadre.png';
            this.selectedAvatar = progress.customization.avatar || 'coin.png';
            
            localStorage.setItem('userCustomization', JSON.stringify({
              frame: this.selectedFrame,
              avatar: this.selectedAvatar
            }));
          }

          if (this.categories && Object.keys(this.categories).length > 0) {
            this.repairGameData();
          } else {
            setTimeout(() => {
              if (this.categories && Object.keys(this.categories).length > 0) {
                this.repairGameData();
              }
            }, 2000);
          }

          this.updateCategoryProgress();
        }
        
        return progress;
      })
      .catch(error => {
        console.error("Erreur lors du chargement de la progression:", error);
        
        const localElements = localStorage.getItem('discoveredElements');
        const localCategories = localStorage.getItem('discoveredCategories');
        
        console.log('DEBUG - Fallback sur localStorage:', {
          localElements,
          localCategories
        });
        
        if (localElements) {
          try {
            this.discoveredElements = JSON.parse(localElements);
          } catch (e) {
            console.error('DEBUG - Erreur parsing localStorage elements:', e);
            this.discoveredElements = [...BASE_ELEMENTS];
          }
        } else {
          this.discoveredElements = [...BASE_ELEMENTS];
        }
        
        if (localCategories) {
          try {
            this.discoveredCategories = JSON.parse(localCategories);
          } catch (e) {
            console.error('DEBUG - Erreur parsing localStorage categories:', e);
            this.discoveredCategories = [BASE_CATEGORY];
          }
        } else {
          this.discoveredCategories = [BASE_CATEGORY];
        }

        this.categoryProgress = {};
        this.coins = parseInt(localStorage.getItem('coins')) || 0;
        this.timerProgress = {
          completedQuestions: { Facile: {}, Moyen: {}, Difficile: {} },
          unlockedCategories: {},
          bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
        };
        this.selectedFrame = 'basicCadre.png';
        this.selectedAvatar = 'coin.png';
        
        throw error;
      });
  } catch (error) {
    console.error("Erreur lors du chargement de la progression:", error);
    this.discoveredElements = [...BASE_ELEMENTS];
    this.discoveredCategories = [BASE_CATEGORY];
    this.categoryProgress = {};
    this.coins = 0;
    localStorage.setItem('coins', '0');
    this.timerProgress = {
      completedQuestions: { Facile: {}, Moyen: {}, Difficile: {} },
      unlockedCategories: {},
      bestScores: { Facile: 0, Moyen: 0, Difficile: 0 }
    };
    this.selectedFrame = 'basicCadre.png';
    this.selectedAvatar = 'coin.png';
    
    return Promise.reject(error);
  }
},

saveGameProgress() {
  if (!this.isLoggedIn) return;

  try {
    // En mode Timer, on sauvegarde l'inventaire Infini mis de côté, pas l'inventaire temporaire
    const elements = this.timerSnapshot ? this.timerSnapshot.elements : this.discoveredElements;
    const categories = this.timerSnapshot ? this.timerSnapshot.categories : this.discoveredCategories;
    const progressData = {
      discoveredElements: Array.isArray(elements) 
        ? elements 
        : [...BASE_ELEMENTS],
      discoveredCategories: Array.isArray(categories)
        ? categories
        : [BASE_CATEGORY],
      categoryProgress: this.categoryProgress || {},
      coins: this.coins,
      timerProgress: this.timerProgress,
      customization: {
        frame: this.selectedFrame,
        avatar: this.selectedAvatar
      }
    };

    // Sauvegarder dans localStorage pour récupération rapide
    localStorage.setItem('discoveredElements', JSON.stringify(progressData.discoveredElements));
    localStorage.setItem('discoveredCategories', JSON.stringify(progressData.discoveredCategories));

    // Sauvegarder dans la base de données
    return progressService.saveGameProgress(progressData);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la progression:", error);
    return Promise.reject(error);
  }
},


    updateCategoryProgress() {
      // Pendant une session Timer, la progression reflète l'inventaire Infini (recalculée à la sortie)
      if (this.timerSnapshot) return;
      Object.keys(this.categories).forEach(category => {
        const totalElements = this.familyTotals[category] || this.categories[category].length;
        const discoveredCount = this.categories[category].filter(element => 
          this.discoveredElements.includes(element)
        ).length;
        this.categoryProgress[category] = (discoveredCount / totalElements) * 100;
      });
    },
    // Dans App.vue, méthode checkAuth()
checkAuth() {
  const loggedInUser = AuthService.getCurrentUser();
  
  if (loggedInUser) {
    this.isLoggedIn = true;
    this.currentUser = loggedInUser;
    this.loadSavedCustomization();
  } else {
    this.isLoggedIn = false;
    this.currentUser = null;
    localStorage.removeItem('user');
    
    this.coins = 0;
    localStorage.removeItem('coins');
    
    this.selectedFrame = 'basicCadre.png';
    this.selectedAvatar = 'coin.png';
  }
},
    async handleLogout() {
      // Envoyer la progression en attente tant que la session est valide
      await progressService.flush();
      await AuthService.logout();
      clearCarnet();
      this.isLoggedIn = false;
      this.currentUser = null;
      window.location.reload();
    },
    // Carnet de l'Infini (compte ou invité) et ce qu'il faut pour l'afficher ; aucune recette
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
      this.reachableCount = state.reachable ?? null;
      if (this.timerSnapshot) this.timerSnapshot.elements = state.elements;
      else this.discoveredElements = state.elements;
      this.updateCategoryProgress();
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
        unexplored: this.unexploredCounts,
        reachable: this.reachableCount
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
    learnElement({ result, emoji, family, unexplored, reachable, trial }) {
      this.applyKnown({ [result]: { emoji, family } });
      if (!this.isTimerActive) this.learnedDuringLoad?.set(result, { emoji, family });
      if (unexplored) this.unexploredCounts = unexplored;
      if (typeof reachable === 'number') this.reachableCount = reachable;
      // Épreuve : verdict lu juste après, à la révélation (handleCraftSuccess)
      this.timerVerdict = trial || null;
    },
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
    handleResourceSelection(resource, fromRect) {
      this.$refs.craftZone?.add(resource, fromRect);
    },
    // Nouvelle découverte : le fond vivant réagit, la carte s'illumine dans l'inventaire
    handleDiscovery({ name, x, y }) {
      this.$refs.background?.burst(x, y);
      this.freshElement = name;
    },
    handleModeSelect(mode) {
      if (mode === this.currentMode) return;
      if (mode === 'world') {
        // L'Épreuve en cours se termine d'abord (elle a son propre inventaire)
        if (this.isTimerActive) {
          this.showAlert('Termine ou quitte l’Épreuve avant d’aller sur ton île.');
          return;
        }
        this.isWorldActive = true;
        return;
      }
      this.isWorldActive = false;
      if (mode === 'timer') {
        this.$refs.timerModeButton?.startTimer();
      } else if (this.isTimerActive) {
        // Quitter le Timer perd la question en cours : on confirme d'abord
        this.$refs.timerModeButton?.requestStop();
      } else {
        this.handleInfiniteModeActivation();
      }
    },

handleCraftSuccess(craftedItem, ingredients = []) {
  // Mode normal (hors Timer)
  if (!this.isTimerActive) {
    // Sauvegarder l'élément découvert
    this.saveDiscoveredElement(craftedItem);
  }
  
  // Gestion du mode Timer
  if (this.isTimerActive) {
    // Ajouter à l'inventaire local de la session Timer
    if (!this.discoveredElements.includes(craftedItem)) {
      this.discoveredElements.push(craftedItem);
      this.timerHint = null;
    }
    
    // Vérifier si l'élément fait partie des éléments initiaux de la question
    const currentQuestion = this.$refs.timerQuestions.getCurrentQuestion();
    const initialElements = [];
    
    if (currentQuestion && currentQuestion.initialElements) {
      initialElements.push(...(currentQuestion.initialElements.required || []));
      initialElements.push(...(currentQuestion.initialElements.additional || []));
    }
    
    // Ne sauvegarder dans timer_elements QUE si ce n'est pas un élément initial
    if (!initialElements.includes(craftedItem)) {
      // Ajouter aux éléments créés par l'utilisateur
      if (!this.currentTimerElements.includes(craftedItem)) {
        this.currentTimerElements.push(craftedItem);
        
        // Sauvegarder uniquement ce nouvel élément dans timer_elements
        if (this.isLoggedIn) {
          // Utiliser le service dédié au timer
          timerService.saveTimerElements([craftedItem])
            .then(() => {
              console.log(`Élément Timer ${craftedItem} sauvegardé avec succès`);
            })
            .catch(error => {
              console.error(`Erreur lors de la sauvegarde de l'élément Timer ${craftedItem}:`, error);
            });
        }
      }
    }
    
    // Le serveur seul connaît les réponses : il a jugé ce mélange (services/trial.js)
    const verdict = this.timerVerdict;
    this.timerVerdict = null;
    if (verdict) {
      this.timerAnswersFound = verdict.found || 0;
      if (verdict.late) this.showAlert('Le sablier était déjà vide : cette réussite ne compte pas.');
      if (verdict.solved) {
        if (verdict.coins !== undefined) this.handleCoinsUpdated(verdict.coins);
        this.timerModeDiscoveries++;
        // La fenêtre de réussite montre la création et ses ingrédients
        this.$refs.timerQuestions.answerCorrect({ name: craftedItem, emoji: this.elementEmojis[craftedItem], ingredients });
      }
    }
  }
},

    async repairGameData() {
      if (!this.isLoggedIn) return;
            
      const repairedCategories = [BASE_CATEGORY];
      
      for (const element of this.discoveredElements) {
        for (const category in this.categories) {
          if (this.categories[category] && this.categories[category].includes(element)) {
            if (!repairedCategories.includes(category)) {
              console.log(`Catégorie manquante détectée: ${category} pour l'élément ${element}`);
              repairedCategories.push(category);
            }
          }
        }
      }
      
      const currentCats = [...this.discoveredCategories].sort();
      const repairedCats = [...repairedCategories].sort();
      
      if (JSON.stringify(currentCats) !== JSON.stringify(repairedCats)) {
        
        this.discoveredCategories = repairedCategories;
        
        await this.saveGameProgress();
        console.log('Données réparées et sauvegardées avec succès');
      } else {
        console.log('Aucune réparation nécessaire, les données sont cohérentes');
      }
    },
    closeAchievementPopup() {
      this.achievementQueue.shift();
    },
    showAlert(message) {
      notificationService.info(message);
    },
    // Succès débloqué : une gerbe de particules au centre de l'écran
    handleAchievementPopupOpened() {
      this.$refs.background?.burst(window.innerWidth / 2, window.innerHeight / 2);
    },
    handleTimerStateChange(isActive) {
      // Le bouton Timer peut émettre plusieurs fois "true" : on n'agit que sur les transitions
      const wasActive = this.isTimerActive;
      
      this.isTimerActive = isActive;
  
      if (isActive && !wasActive) {
        this.resetCraftBoard();
        this.enterTimerMode();
        this.timerModeDiscoveries = 0;
        this.selectedTimerLevel = null;
        this.currentTimerElements = [];
        if (this.$refs.timerQuestions) {
          this.$refs.timerQuestions.show();
        }
      } else if (!isActive) {
        this.resetCraftBoard();
        // selectedTimerLevel est conservé pour le modal de fin (handleTimerComplete)
        this.exitTimerMode();
        this.currentTimerElements = [];
        if (this.$refs.timerQuestions) {
          this.$refs.timerQuestions.resetQuestions();
        }
      }
    },
    resetCraftBoard() {
      this.$refs.craftZone?.clear();
    },
    // Met de côté l'inventaire Infini au début d'une session Timer
    enterTimerMode() {
      if (this.timerSnapshot) return;
      this.timerSnapshot = {
        elements: [...this.discoveredElements],
        categories: [...this.discoveredCategories]
      };
    },
    // Restaure l'inventaire Infini à la fin d'une session Timer
    exitTimerMode() {
      if (!this.timerSnapshot) return;
      this.discoveredElements = this.timerSnapshot.elements;
      this.discoveredCategories = this.timerSnapshot.categories;
      this.timerSnapshot = null;
      this.updateCategoryProgress();
    },
    // Mélange raté en Infini : une image selon les familles, et l'ingrédient qui cache encore des mélanges
    infiniteFailLine(ingredients) {
      return failLine(ingredients, { familyOf: this.familyOf, unexplored: this.unexploredCounts });
    },
    familyOf(name) {
      const family = Object.keys(this.categories).find(key => this.categories[key].includes(name));
      return family ? family.replace(/_/g, ' ') : '';
    },
    // Piste de l'Infini (payante, compte requis) : le serveur choisit un élément inconnu à une seule fusion
    async useInfiniteHint() {
      try {
        const { name, coins } = await playService.hint();
        this.handleCoinsUpdated(coins);
        this.showAlert(`Une piste : « ${name} » n’est qu’à une fusion de toi.`);
      } catch (error) {
        this.showAlert(error.response?.data?.message || 'La piste n’a pas pu être achetée.');
      }
    },
    // Joker de l'Épreuve : le serveur compte les jokers offerts, débite les suivants et calcule l'indice
    async useJoker(kind) {
      try {
        const reply = await playService.joker(kind);
        this.freeJokers = reply.freeJokers;
        if (reply.coins !== undefined) this.handleCoinsUpdated(reply.coins);
        if (kind === 'time') this.$refs.timerModeButton?.addTime(JOKER_TIME);
        else if (kind === 'step') this.timerHint = { kind, text: `Essaie ${reply.ingredients.join(' + ')}.` };
        else this.timerHint = { kind, text: `Pense à ${reply.ingredient}…` };
      } catch (error) {
        this.showAlert(error.response?.data?.message || 'Le joker n’a pas pu être utilisé.');
      }
    },
    // Question de l'Épreuve : le serveur pose les éléments en main (les mélanges y sont vérifiés)
    async startTimerRun(questionId) {
      if (!Number.isInteger(questionId)) return;
      try {
        const run = await playService.startRun('timer', { questionId, launch: !this.timerLaunched });
        this.timerLaunched = true;
        this.freeJokers = run.freeJokers;
        this.applyKnown(run.known);
      } catch (error) {
        this.showAlert(error.response?.data?.message || 'L’épreuve n’a pas pu démarrer, réessaie.');
      }
    },
    // Un compte est payé par le serveur au moment de la réussite (verdict) ; un invité garde un solde local
    handleCoinsEarned({ points }) {
      if (!this.isLoggedIn) this.handleCoinsUpdated(this.coins + points);
    },
    async handleTimerComplete() {
  // Score compté par le serveur ; il verse le bonus si le record du niveau monte (compte)
  let end = null;
  try {
    end = await playService.finishTimer();
  } catch (error) {
    console.error('Fin d’épreuve non enregistrée:', error);
  }
  const currentScore = end ? end.score : this.timerModeDiscoveries;
  if (end?.coins !== undefined) this.handleCoinsUpdated(end.coins);

  if (this.selectedTimerLevel && currentScore > this.timerProgress.bestScores[this.selectedTimerLevel]) {
    if (!this.isLoggedIn) this.handleCoinsUpdated(this.coins + currentScore * 5);
    this.timerProgress.bestScores[this.selectedTimerLevel] = currentScore;
    
    if (this.isLoggedIn) {
      try {
        await progressService.updateTimerProgress(this.timerProgress);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du meilleur score:", error);
      }
    }
  }

  // Restaurer l'inventaire précédent (important!)
  this.exitTimerMode();
  
  this.showTimerEndModal = true;
},


    handleTimerEndModalClose() {
      this.showTimerEndModal = false;
      this.exitTimerMode();
      this.selectedTimerLevel = null;
      if (this.$refs.timerQuestions) {
        this.$refs.timerQuestions.resetQuestions();
      }
    },
    handleTimerReset() {
      this.$refs.timerModeButton.resetTimer();
    },
    handleOpenCustomizeModal() {
      this.isCustomizeModalOpen = true;
    },
    handleCloseCustomizeModal() {
      this.isCustomizeModalOpen = false;
    },
    handleSaveCustomization(customizationData) {
      this.selectedFrame = customizationData.frame;
      this.selectedAvatar = customizationData.avatar;
      
      // Sauvegarder dans localStorage
      localStorage.setItem('userCustomization', JSON.stringify({
        frame: this.selectedFrame,
        avatar: this.selectedAvatar
      }));
      
      // Si l'utilisateur est connecté, sauvegarder dans la base de données
      if (this.isLoggedIn) {
        this.saveGameProgress();
      }
      
      this.isCustomizeModalOpen = false;
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
  /* Mobile : la place des panneaux fixés en bas, mesurée (repli : hauteur nominale du dock) */
  padding: 0 var(--oc-gutter) calc(var(--oc-overlay, var(--oc-dock-height)) + 24px);
}
.oc-app__main { display: block; }
.oc-app__main--world { display: block !important; max-width: 760px; margin: 0 auto; }
.oc-app__inventory { min-width: 0; }
@media (min-width: 860px) {
  .oc-app__shell { padding-bottom: 32px; }
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

@media (max-width: 859px) {
  .oc-desk-only { display: none; }
}
</style>

