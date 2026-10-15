// App : le tutoriel (HISTOIRE.md, § 9 ; l'étape se déduit du jeu, game/prologue.js) : ce que l'appareil et le compte en
// retiennent, les onglets qui s'ouvrent, les scènes vues, passer ou rejouer. Mixin d'App.vue, avec islandStory.js (la
// mise en scène de l'île), chronicle.js (veillées, Anya) et signing.js (le compte du tutoriel).

import playService from '@/services/playService';
import * as storage from '@/utils/storage';
import { guide } from '@/game/guide';
import { loadPrologue, savePrologue, prologueStep, islandLesson, inPrologue, resumedPrologue, upTo, bareGrimoire } from '@/game/prologue';
import { coach } from '@/game/coach';
import { bubbleFace, NAMES } from '@/world/faces';
import { LINES as PROLOGUE_LINES } from '@/texts/tutorial/scenes';
import { DEFAULT_LOOK } from '@/game/sceneArt';
import { setPlayer } from '@/game/accord';
import { TAB_OPENED, TAB_CALLS, PLAN_WRITTEN } from '@/texts/tutorial/tabs';
import { COACH, TAB_HELP, LINE_HELP, TIP_HELP } from '@/texts/tutorial/coach';

// Les répliques dont la ligne d'aide a déjà été annoncée (guideShown)
const helped = new Set();

export default {
  data() {
    return {
      // Le tutoriel : ce que l'appareil en retient (game/prologue.js), la scène jouée, la carte d'embarquement (l'avatar),
      // la page de garde ({ account }), les scènes rejouées depuis le Sceau (le geste montré : game/coach.js)
      prologue: loadPrologue(),
      prologueScene: null,
      prologueAvatar: false,
      prologueName: null,
      prologueReplay: null,
      // La page du Vent attend que le livre soit chargé pour s'ouvrir (le Grimoire nu)
      prologueOpenReach: false,
      // « Passer le tutoriel » attend sa confirmation
      skipAsk: false,
      // Le tutoriel du compte (serveur : { tutorial, skipped }) : un compte d'après la bible le reprend à son étape, sur
      // tout appareil ; guided : il a été suivi pendant cette visite (jusqu'au Campement)
      accountTutorial: null,
      guidedVisit: false
    };
  },
  computed: {
    // L'avatar du joueur dans les scènes : celui que garde son compte, sinon celui de sa carte d'embarquement (avant le
    // compte, il n'est que sur l'appareil)
    prologueLook() {
      return this.islandAvatar || this.prologue.look || DEFAULT_LOOK;
    },
    playerInLines() {
      return { look: this.prologueLook, name: this.prologue.name || this.islandPlayer };
    },
    // La réplique de Brume à l'écran (game/guide.js), ou null
    guideShown() {
      return guide.current;
    },
    // Le tutoriel est en cours : les succès attendent sa fin pour s'afficher (un « Sceau rompu » ne coupe pas le vent
    // qui se lève)
    prologueRunning() {
      const { started, skipped, finished, registered } = this.prologue;
      return this.accountGuided || (started && !skipped && !finished && (!this.isLoggedIn || registered));
    },
    // Le tutoriel suit le compte (sa quête de Brume), pas l'appareil : un compte d'après la bible, dont la quête est
    // dans le prologue (ou vient d'en sortir pendant cette visite : le Campement), le reprend à son étape, même sur un
    // appareil qui n'en a rien retenu ; « Passer » est retenu sur le compte
    accountGuided() {
      const account = this.accountTutorial;
      const quest = this.islandQuest && this.islandQuest.id;
      if (!this.isLoggedIn || !account || !account.tutorial || account.skipped || !quest) return false;
      return inPrologue(quest) || this.guidedVisit;
    },
    // Tout vient d'être recommencé (Mon compte) : l'ouverture (le naufrage, la carte, l'arrivée) se rejoue d'abord sur cet
    // appareil, l'île attend
    openingReplay() {
      return Boolean(this.prologue.restarted && !(this.prologue.seen || []).includes('arrivee'));
    },
    // Ce que le tutoriel sait de l'appareil, complété par le compte : le compte est créé et nommé, les scènes des étapes
    // déjà passées sont vues
    tutorialState() {
      if (!this.accountGuided || this.openingReplay) return this.prologue;
      return resumedPrologue(this.prologue, this.islandQuest.id);
    },
    // Le geste montré par le coach (game/coach.js) : une fois les répliques de Brume lues, jamais sous une scène, la
    // carte d'embarquement, la page de garde ou une confirmation ; sur l'onglet de sa cible
    // La leçon d'un autre onglet : le coach montre cet onglet (jamais de force : on peut regarder ailleurs)
    // Une leçon refermée d'une croix ne se montre plus (le « ! » du suivi la rappelle) ; sans leçon, l'objectif montré à la
    // demande (coach.point), sur son onglet, tout de suite (même pendant une bulle de Brume : on vient de le demander)
    coachLesson() {
      const { lesson: shown, hidden, pointer } = coach.state;
      const lesson = shown && shown.id !== hidden ? shown : pointer;
      if (!lesson || this.prologueScene || this.prologueAvatar || this.prologueName || this.skipAsk) return null;
      if (!lesson.pointer && (guide.current || guide.state.resting)) return null;
      if (lesson.mode === this.currentMode) return lesson;
      if (lesson.pointer) return null;
      if (!TAB_CALLS[lesson.mode] || this.lockedTabs.includes(lesson.mode)) return null;
      return { id: `${lesson.id}@onglet`, mode: this.currentMode, steps: [{ target: `.tabbar__item[data-tab="${lesson.mode}"]`, text: TAB_CALLS[lesson.mode], free: true }] };
    },
    // Les onglets s'ouvrent au rythme de Brume. Le livre d'abord : avant lui (les scènes du début, le compte ouvert en
    // coulisse), tout attend ; puis le Grimoire seul (la page du Vent), et l'Île une fois le vent levé (sa scène vue).
    // Sans compte possible (noProvisional), l'ancien chemin : le Grimoire seul, puis l'Île après le Vent. Le Sceau
    // attend que la Récolte d'Hermine soit réclamée (une chose à la fois) ; les Défis restent fermés pendant le tutoriel.
    lockedTabs() {
      if (!this.prologueRunning) return [];
      const locked = ['timer'];
      const quest = this.islandQuest && this.islandQuest.id;
      if (!this.isLoggedIn || !quest || upTo(quest, 'recolte')) locked.push('sceau');
      if (!this.isLoggedIn || !this.tutorialState.named) {
        if (!this.prologue.noProvisional) locked.push('infinite');
        locked.push('world');
      } else if (!this.tutorialState.seen.includes('souffle')) locked.push('world');
      return locked;
    },
    // Le Grimoire nu de la page du Vent (game/prologue.js) : { shelf } ou null
    bareBook() {
      if (this.prologueReplay || !this.progressReady) return null;
      return bareGrimoire({ state: this.prologue, loggedIn: this.isLoggedIn, elements: this.discoveredElements });
    },
    // La couverture du Grimoire attend la scène d'arrivée (et, pour un invité, de savoir s'il est tout neuf)
    prologueHold() {
      const { skipped, started, seen } = this.prologue;
      if (this.isLoggedIn || skipped || seen.includes('arrivee')) return false;
      return !this.progressReady || started;
    }
  },
  watch: {
    // Le joueur dans les répliques : son genre (celui de son avatar) et son nom (celui de sa carte d'embarquement, puis
    // celui que garde son compte) ; game/accord.js
    playerInLines: {
      immediate: true,
      handler(now) {
        setPlayer(now);
      }
    },
    // Une réplique de Brume s'affiche : sa ligne d'aide, en annonce, une fois — un moment clé (TIP_HELP), un lieu
    // remarquable (help) (choix de l'auteur, 15 oct. : ecriture/lots/05_village.md)
    guideShown(entry) {
      const help = entry && (entry.help || TIP_HELP[entry.id]);
      if (!help || helped.has(entry.id)) return;
      helped.add(entry.id);
      this.showAlert(help);
    },
    // Le tutoriel en cours : Brume ne dit que ce qui sert l'étape (game/guide.js) ; fini, ce qui attendait peut venir
    prologueRunning: {
      immediate: true,
      handler(now) {
        guide.setTutorial(now);
        if (now) return;
        this.checkEarlyWisp();
        // (fini sur l'île : ses conseils, refusés jusque-là, peuvent venir ; WorldView, serve.js)
        this.$nextTick(() => this.$refs.world?.islandTips?.());
      }
    },
    // La partie est revenue : l'étape du tutoriel se lit sur le compte
    progressReady(now) {
      if (now) this.loadAccountTutorial();
    },
    // Sur l'île : l'invitation à y venir (« greve ») n'a plus lieu d'être, même si elle attendait son tour
    isWorldActive: {
      handler(now) {
        // (les répliques de l'île n'y sont dites que là : game/guide.js, island)
        guide.setIsland(now);
        if (now) guide.drop('prologue-greve');
      },
      immediate: true
    },
    'discoveredElements.length'() {
      // Une réplique qui demandait ce qui vient d'être écrit n'a plus lieu d'être, même si elle attendait son tour
      // (l'énigme du Vent restée ouverte ressortait pendant le Brasier)
      const written = this.discoveredElements;
      if (written.includes('Vent')) guide.drop('prologue-vent');
      this.checkPlanWritten();
      // (le Brasier écrit dans la même visite que le Vent : la suite, la plage)
      if (this.prologueRunning && !this.isWorldActive) this.runPrologue();
    },
    // Suivi pendant cette visite : il le reste jusqu'au Campement, même quand la quête sort du prologue
    accountGuided(now) {
      if (now && inPrologue(this.islandQuest.id)) this.guidedVisit = true;
    },
    // Un onglet s'ouvre : Brume le dit (une fois) ; jamais au chargement. (L'Île, sur l'appareil qui a suivi le
    // tutoriel depuis le naufrage : Brume l'annonce déjà, « Courir vers la plage »). Sur l'île, pendant le tutoriel, elle
    // attend les répliques de l'étape (islandStory.js : runIsland ; choix de l'auteur, 13 oct. : le Sceau ne coupe plus
    // Hermine entre ses deux répliques)
    lockedTabs(now, before) {
      if (!this.progressReady) return;
      // (l'île d'abord : le joueur y est conduit, l'onglet n'a pas à être annoncé)
      const said = tab => TAB_OPENED[tab] && !(tab === 'world' && (!this.accountGuided || this.prologue.provisional));
      const opened = before.filter(tab => !now.includes(tab) && said(tab));
      if (this.prologueRunning && this.isWorldActive) this.tabsWaiting = [...(this.tabsWaiting || []), ...opened];
      else opened.forEach(tab => this.sayTab(tab));
    }
  },
  methods: {
    savePrologue(changes) {
      this.prologue = { ...this.prologue, ...changes };
      savePrologue(this.prologue);
    },
    runPrologue() {
      if (this.prologueReplay) return;
      const step = prologueStep({ state: this.prologue, loggedIn: this.isLoggedIn, elements: this.discoveredElements, quest: this.islandQuest && this.islandQuest.id });
      // (le geste de l'Air, une fois le Vent écrit ; les leçons de l'île, dont celle du Grimoire, restent à runIsland)
      coach.clear('vent-air');
      if (!step) return;
      const { phase } = step;
      if (phase === 'start') {
        this.savePrologue({ started: true });
        this.runPrologue();
      } else if (phase === 'scene') {
        // Jamais par-dessus l'ouverture d'un chapitre : la scène attend que son animation ait commencé puis fini.
        clearTimeout(this.prologueTimer);
        const show = () => {
          if (document.querySelector('.book-unlock')) this.prologueTimer = setTimeout(show, 700);
          else this.prologueScene = step.scene;
        };
        if (step.scene === 'naufrage' || step.scene === 'arrivee') show();
        else this.prologueTimer = setTimeout(show, 2500);
      } else if (phase === 'avatar') {
        this.prologueAvatar = true;
      } else if (phase === 'account') {
        this.openProvisional();
      } else if (phase === 'sign') {
        this.prologueName = { account: true, claim: true };
      } else if (phase === 'vent') {
        const { name, face, text } = PROLOGUE_LINES.vent;
        // Le livre s'ouvre sur la page du Vent, pas sur le sommaire (Grimoire nu) ; le mode d'emploi de la page à portée
        // n'a plus lieu d'être : l'énigme est dite
        guide.drop('reach');
        // (un compte qui relance le jeu s'ouvre sur l'île, App.vue : created ; le Vent s'écrit au Grimoire)
        if (this.isWorldActive || this.isSceauActive) this.handleModeSelect('infinite');
        guide.say({ id: 'prologue-vent', who: name, face, text, top: true });
        // (toujours, même si la réplique est déjà dite : l'app relancée à cette étape restait sur le sommaire, sans énigme)
        if (this.$refs.book?.engine) this.$refs.book.openReach('I');
        else this.prologueOpenReach = true;
        coach.show({ id: 'vent-air', target: '.book-view__shelf [data-name="Air"]', text: COACH['vent-air'], mode: 'infinite' });
      } else if (phase === 'name') {
        // Le nom écrit juste avant l'inscription (la page s'est rechargée) : il part sans redemander
        if (!step.account && this.prologue.name) this.namePlayer(this.prologue.name);
        else this.prologueName = { account: step.account };
      } else if (phase === 'brasier') {
        // Le Brasier dans la même visite que le Vent (choix de l'auteur, 11 oct.) : la scène « cercle » l'a demandé ; le
        // ruban mène à sa page (serveur : world.brasierFirst), Encre offerte
        if (this.isWorldActive || this.isSceauActive) this.handleModeSelect('infinite');
        if (this.$refs.book?.engine) this.$refs.book.goMarked();
        else this.bookOpenMarked = true;
        coach.show(islandLesson({ id: 'feu', done: false, plan: 'Brasier' }));
      } else if (phase === 'greve') {
        // (déjà sur l'île, par exemple au retour de la page de garde : l'invitation n'a plus lieu d'être)
        if (this.isWorldActive) guide.drop('prologue-greve');
        else guide.say({ id: 'prologue-greve', text: PROLOGUE_LINES[this.discoveredElements.includes('Brasier') ? 'greve-feu' : 'greve'], action: { label: 'Aller sur l’île', mode: 'world' } });
      }
    },
    // Le tutoriel du compte, dès que la partie est revenue : son étape (la quête de Brume), même sans passer par l'île
    async loadAccountTutorial() {
      if (!this.isLoggedIn) return;
      try {
        const brume = await playService.brume();
        this.accountTutorial = { tutorial: Boolean(brume.tutorial), skipped: Boolean(brume.skipped) };
        if (!this.islandQuest && brume.quest) this.islandQuest = { id: brume.quest.id, done: Boolean(brume.quest.done), short: false, plan: null };
        this.runIsland();
      } catch {
        // Le tutoriel attend l'île : sa vue dira la même chose
      }
    },
    // Un élément écrit au Grimoire : s'il était le plan du bâtiment de la quête, Brume le dit et la leçon retourne à l'île
    checkPlanWritten() {
      const quest = this.islandQuest;
      // La première quête (Vent) faite au Grimoire : la leçon retourne à l'île (Brume a sa récompense ; la vue de l'île
      // le confirmera)
      if (quest && quest.id === 'pages' && !quest.done && this.discoveredElements.includes('Vent')) {
        this.islandQuest = { ...quest, done: true };
        this.runIsland();
        return;
      }
      if (!quest || !quest.plan || !this.discoveredElements.includes(quest.plan) || !this.prologueRunning) return;
      // (le Brasier de l'ouverture : la scène « epave » puis l'invitation à la plage le disent déjà)
      const opening = quest.plan === 'Brasier' && this.prologue.seen.includes('cercle');
      if (!opening) guide.say({ id: `prologue-plan-${quest.plan}`, text: PLAN_WRITTEN.text, action: { label: PLAN_WRITTEN.action, mode: 'world' } });
      coach.show(islandLesson(this.lessonQuest(quest)));
    },
    // Un onglet s'ouvre : ce qu'en dit Brume (une réplique, ou plusieurs), puis la ligne d'aide le montre, si aucune
    // leçon n'est à l'écran
    sayTab(tab) {
      [].concat(TAB_OPENED[tab]).forEach((text, k) => guide.say({ id: k ? `onglet-${tab}-${k + 1}` : `onglet-${tab}`, text }));
      if (TAB_HELP[tab] && !coach.state.lesson) coach.show({ id: `onglet-${tab}`, mode: this.currentMode, steps: [{ target: `.tabbar__item[data-tab="${tab}"]`, text: TAB_HELP[tab], free: true }] });
    },
    // Les onglets ouverts pendant l'étape (lockedTabs) : dits après ses répliques
    sayTabsWaiting() {
      (this.tabsWaiting || []).forEach(tab => this.sayTab(tab));
      this.tabsWaiting = [];
    },
    // Une réplique du tutoriel : de Brume, ou d'un membre de la troupe (son portrait dans la bulle) ; extra : { top } (en
    // haut de l'écran, au Grimoire)
    // (et sa ligne d'aide, en annonce, la première fois : LINE_HELP)
    sayPrologue(line, extra = {}) {
      const entry = PROLOGUE_LINES[line];
      const { who, text, mood, action, look, demo } = typeof entry === 'string' ? { text: entry } : entry;
      const said = guide.say({ id: `prologue-${line}`, text, ...extra, ...(action ? { action } : {}), ...(look ? { look } : {}), ...(demo ? { demo } : {}), ...(who ? { who: NAMES[who], ...bubbleFace(who, { castaway: !this.islandBuilt.includes(who), mood }) } : {}) });
      if (said && LINE_HELP[line]) this.showAlert(LINE_HELP[line]);
    },
    // Le livre est chargé : la page du Vent s'ouvre, si elle attendait
    onBookLoaded() {
      if (!this.prologueOpenReach) return;
      this.prologueOpenReach = false;
      this.$refs.book?.openReach('I');
    },
    prologueSceneDone(scene) {
      // (une veillée, une trace d'Anya, la Révélation : la chronique les retient, chronicle.js)
      if (!this.prologueReplay && this.storySceneDone(scene)) return;
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
    // « Passer le tutoriel » (un seul, sur les scènes) : il demande d'abord confirmation
    skipPrologue() {
      this.skipAsk = true;
    },
    confirmSkip() {
      this.skipAsk = false;
      // Retenu sur le compte (tous ses appareils) ; l'appareil le retient aussi
      if (this.isLoggedIn) {
        this.accountTutorial = { ...(this.accountTutorial || { tutorial: true }), skipped: true };
        playService.prologueSkip().catch(() => {});
      }
      this.prologueScene = null;
      this.prologueAvatar = false;
      this.prologueName = null;
      coach.show(null);
      this.savePrologue({ skipped: true });
    },
    // Tout est recommencé (Mon compte ; serveur : restartIsland) : l'appareil oublie aussi tout ce qu'il retenait du jeu
    // (tutoriel, répliques, gestes, scènes vues, carnet, choix d'affichage) sauf la session ; le jeu reprend au naufrage,
    // pour ce compte (le tutoriel commencé et le compte déjà signé : il ne redemande ni adresse ni mot de passe)
    islandRestarted() {
      Object.keys(localStorage).filter(key => key.startsWith('oc_')).forEach(key => storage.remove(key));
      storage.remove('coins');
      storage.remove('userCustomization');
      savePrologue({ ...loadPrologue(), started: true, registered: true, provisional: true, signed: true, restarted: true });
      window.location.reload();
    },
    replayPrologue() {
      this.prologueReplay = ['arrivee', 'souffle', 'jour', 'cercle', 'epave', 'nuit', 'recolte', 'cannelle', 'rivet', 'ondin', 'campement'];
      this.prologueScene = 'naufrage';
    }
  }
};
