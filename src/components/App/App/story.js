// App : l'histoire. Le tutoriel (HISTOIRE.md, § 9 ; l'étape se déduit du jeu, game/prologue.js), les quêtes de Brume
// sur l'île, les veillées et Anya. Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App.

import playService from '@/services/playService';
import AuthService from '@/services/authService';
import * as storage from '@/utils/storage';
import { messageOf } from '@/utils/errors';
import { guide } from '@/game/guide';
import { loadPrologue, savePrologue, prologueStep, islandStep, islandLesson, inPrologue, resumedPrologue, upTo, bareGrimoire } from '@/game/prologue';

import { coach } from '@/game/coach';
import { bubbleFace, NAMES } from '@/world/faces';
import { vigilFrames, vigilDue, stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook, earlyWisp, EARLY_WISP } from '@/game/opus';
import { PRESENTIMENTS, revelationFrames, traceFrames, anyaSceneOf, tracesOf, seenOf } from '@/game/anya';
import { LINES as PROLOGUE_LINES } from '@/game/prologueScenes';
import { DEFAULT_LOOK } from '@/game/sceneArt';

// Un onglet s'ouvre pendant le tutoriel : Brume le dit (la barre fait briller l'onglet)
const TAB_OPENED = {
  world: 'Le vent a chassé la brume de la plage de Brumelune. Touche « Île », en bas : pour cette nuit, on reste près du rivage.',
  // (Brume ne lit pas l'interface : l'onglet qui s'allume suffit)
  sceau: 'Ton nom est écrit au Grimoire. Ton sceau t’attend, avec tout ce que tu accompliras.',
  timer: 'Les Défis s’ouvrent : des énigmes contre le sablier, pour gagner des écus. Touche « Défis » quand tu veux.'
};

// Ce que dit le coach quand la suite est sur un autre onglet
const TAB_CALLS = {
  world: 'La suite t’attend sur l’île : touche « Île ».',
  infinite: 'La suite se mélange dans l’Athanor du Grimoire : touche « Grimoire ».'
};

// Le tutoriel souffle (choix de l'auteur, 8 oct.) : après une récompense réclamée, après une quête accomplie (ms)
const BREATH_MS = 4000;
const DONE_MS = 1500;

// Veillées déjà vues sur cet appareil (game/vigils.js)
const VIGILS_KEY = 'oc_vigils';
// Les traces d'Anya déjà montrées sur cet appareil (bible, § 6.14)
const TRACES_KEY = 'oc_traces';

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
      guidedVisit: false,
      // La quête active de Brume sur l'île ({ id, done }), pour les étapes 2 à 5 ; les actes finis et le nom du peuple
      // (veillées, étape de civilisation) ; les veillées déjà vues ici
      islandQuest: null,
      islandActs: [],
      // Les actes finis sont connus (le serveur a répondu) : Brume peut réagir à Feu follet écrit tôt
      actsKnown: false,
      // Anya (serveur : { traces, awake, revealed, visit, breathed }), et les traces déjà montrées sur cet appareil (en
      // numéros ; celles d'avant la v6, nommées par terre, sont converties)
      anya: null,
      tracesSeen: seenOf(storage.load(TRACES_KEY, [])),
      // Un coffre est ouvert sur l'île (ou va s'ouvrir) : les veillées et les scènes attendent qu'il se referme
      islandHold: false,
      people: null,
      // L'avatar gardé par le compte (serveur), ou null tant qu'il n'y est pas
      islandAvatar: null,
      // Les maîtres dont le bâtiment est fondé (les autres paraissent en naufragés : bulles, veillées)
      islandBuilt: [],
      vigilsSeen: storage.load(VIGILS_KEY, [])
    };
  },
  computed: {
    isVigil() {
      return Boolean(this.prologueScene && this.prologueScene.startsWith('veillee-'));
    },
    // La Révélation d'Anya et ses traces (bible, § 6.14) : des scènes de l'histoire, hors du tutoriel
    isStory() {
      return this.prologueScene === 'revelation' || Boolean(this.prologueScene && this.prologueScene.startsWith('trace-'));
    },
    // Une veillée se compose de ses images (le nom du peuple y figure) ; la Révélation (selon le Phare) et les traces
    // aussi ; les autres scènes ont les leurs
    sceneFrames() {
      const scene = this.prologueScene;
      if (this.isVigil) return vigilFrames(scene.slice(8), { people: this.people });
      if (scene === 'revelation') return revelationFrames({ lit: this.islandActs.includes('VII') });
      if (this.isStory) return traceFrames(scene.slice(6), tracesOf(this.anya).length);
      return null;
    },
    // L'étape de civilisation (bible, § 6.10) : l'Ex libris du Grimoire l'affiche
    civStage() {
      return civilizationOf(this.islandActs, this.people);
    },
    // Le stade de Brume (bible, § 13), pour la couleur du guide ; avant que le serveur ait répondu, sa couleur de toujours
    brumeStage() {
      return this.actsKnown ? brumeLook({ acts: this.islandActs, quest: this.islandQuest, elements: this.discoveredElements }).stage : null;
    },
    // L'avatar du joueur dans les scènes : celui que garde son compte, sinon celui de sa carte d'embarquement (avant le
    // compte, il n'est que sur l'appareil)
    prologueLook() {
      return this.islandAvatar || this.prologue.look || DEFAULT_LOOK;
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
    coachLesson() {
      const lesson = coach.state.lesson;
      if (!lesson || this.prologueScene || this.prologueAvatar || this.prologueName || this.skipAsk || guide.current || guide.state.resting) return null;
      if (lesson.mode === this.currentMode) return lesson;
      if (!TAB_CALLS[lesson.mode] || this.lockedTabs.includes(lesson.mode)) return null;
      return { id: `${lesson.id}@onglet`, mode: this.currentMode, steps: [{ target: `.tabbar__item[data-tab="${lesson.mode}"]`, text: TAB_CALLS[lesson.mode], free: true }] };
    },
    // Les onglets s'ouvrent au rythme de Brume. Le livre d'abord : avant lui (les scènes du début, le compte ouvert en
    // coulisse), tout attend ; puis le Grimoire seul (la page du Vent), et l'Île une fois le vent levé (sa scène vue).
    // Sans compte possible (noProvisional), l'ancien chemin : le Grimoire seul, puis l'Île après le Vent. Le Sceau
    // attend que la Récolte d'Aster soit réclamée (une chose à la fois) ; les Défis restent fermés pendant le tutoriel.
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
    // Qui attend dans les vagues qu'on le touche (le matin d'Aster, avant sa scène) : WorldView le dessine dans l'eau
    islandWaiting() {
      const quest = this.islandQuest && this.islandQuest.id;
      return this.prologueRunning && quest === 'recolte' && !this.tutorialState.seen.includes('recolte') ? ['ponton'] : [];
    },
    // La couverture du Grimoire attend la scène d'arrivée (et, pour un invité, de savoir s'il est tout neuf)
    prologueHold() {
      const { skipped, started, seen } = this.prologue;
      if (this.isLoggedIn || skipped || seen.includes('arrivee')) return false;
      return !this.progressReady || started;
    }
  },
  watch: {
    // Le tutoriel en cours : Brume ne dit que ce qui sert l'étape (game/guide.js) ; fini, ce qui attendait peut venir
    prologueRunning: {
      immediate: true,
      handler(now) {
        guide.setTutorial(now);
        if (!now) this.checkEarlyWisp();
      }
    },
    // La partie est revenue : l'étape du tutoriel se lit sur le compte
    progressReady(now) {
      if (now) this.loadAccountTutorial();
    },
    // Sur l'île : l'invitation à y venir (« greve ») n'a plus lieu d'être, même si elle attendait son tour
    isWorldActive(now) {
      if (now) guide.drop('prologue-greve');
    },
    'discoveredElements.length'() {
      this.checkPlanWritten();
    },
    // Suivi pendant cette visite : il le reste jusqu'au Campement, même quand la quête sort du prologue
    accountGuided(now) {
      if (now && inPrologue(this.islandQuest.id)) this.guidedVisit = true;
    },
    // Un onglet s'ouvre : Brume le dit (une fois) ; jamais au chargement. (L'Île, sur l'appareil qui a suivi le
    // tutoriel depuis le naufrage : Brume l'annonce déjà, « Courir vers la plage »)
    lockedTabs(now, before) {
      if (!this.progressReady) return;
      // (l'île d'abord : le joueur y est conduit, l'onglet n'a pas à être annoncé)
      const said = tab => TAB_OPENED[tab] && !(tab === 'world' && (!this.accountGuided || this.prologue.provisional));
      before.filter(tab => !now.includes(tab) && said(tab)).forEach(tab => guide.say({ id: `onglet-${tab}`, text: TAB_OPENED[tab] }));
    }
  },
  methods: {
    // ----- Le tutoriel (HISTOIRE.md, § 9) : l'étape se déduit du jeu (game/prologue.js) -----
    savePrologue(changes) {
      this.prologue = { ...this.prologue, ...changes };
      savePrologue(this.prologue);
    },
    runPrologue() {
      if (this.prologueReplay) return;
      const step = prologueStep({ state: this.prologue, loggedIn: this.isLoggedIn, elements: this.discoveredElements });
      // (le geste de l'Air, une fois le Vent écrit ; les leçons de l'île, dont celle du Grimoire, restent à runIsland)
      coach.clear('vent-air');
      if (!step) return;
      const { phase } = step;
      if (phase === 'start') {
        // Brume se présente dans la scène : sa présentation du Grimoire n'a plus lieu d'être
        guide.drop('welcome');
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
        if (guide.say({ id: 'prologue-vent', who: name, face, text, top: true })) {
          if (this.$refs.book?.engine) this.$refs.book.openReach('I');
          else this.prologueOpenReach = true;
        }
        coach.show({ id: 'vent-air', target: '.book-view__shelf [data-name="Air"]', text: 'Touche l’Air, deux fois : il va dans l’Athanor, et le livre fait le mélange.', mode: 'infinite' });
      } else if (phase === 'name') {
        // Le nom écrit juste avant l'inscription (la page s'est rechargée) : il part sans redemander
        if (!step.account && this.prologue.name) this.namePlayer(this.prologue.name);
        else this.prologueName = { account: step.account };
      } else if (phase === 'greve') {
        // (déjà sur l'île, par exemple au retour de la page de garde : l'invitation n'a plus lieu d'être)
        if (this.isWorldActive) guide.drop('prologue-greve');
        else guide.say({ id: 'prologue-greve', text: PROLOGUE_LINES.greve, action: { label: 'Aller sur l’île', mode: 'world' } });
      }
    },
    // Étapes 2 (sur l'île) à 5 : la quête active de Brume
    onIslandQuest(brume) {
      const quest = brume && brume.quest;
      // Laisser respirer (choix de l'auteur, 8 oct.) : une récompense réclamée, la quête suivante attend BREATH_MS (le
      // temps de la fête : rien ne s'affiche) ; une quête accomplie, DONE_MS (le temps de voir ce qu'on a fait)
      const before = this.islandQuest;
      if (quest && before && before.id && this.prologueRunning) {
        if (quest.id !== before.id) this.breathe(BREATH_MS);
        else if (quest.done && !before.done) this.breathe(DONE_MS);
      }
      this.islandQuest = quest ? { id: quest.id, done: Boolean(quest.done), short: Boolean(brume.short), plan: brume.plan || null } : { id: null, done: true };
      if (brume && brume.tutorial !== undefined) this.accountTutorial = { tutorial: Boolean(brume.tutorial), skipped: Boolean(brume.skipped) };
      this.islandHold = Boolean(brume && brume.hold);
      if (brume) {
        this.islandActs = brume.acts || [];
        this.people = brume.people || null;
        this.islandBuilt = brume.built || [];
        this.islandAvatar = brume.avatar || null;
        if (!brume.avatar) this.keepAvatar();
        // La Révélation vue reste vue, même si une réponse du serveur partie avant son envoi arrive après
        this.anya = brume.anya ? { ...brume.anya, revealed: brume.anya.revealed || Boolean(this.anya && this.anya.revealed) } : this.anya;
        this.actsKnown = true;
        this.checkEarlyWisp();
      }
      this.runIsland();
    },
    // L'avatar de la carte d'embarquement, choisi avant le compte (gardé sur l'appareil), rejoint le compte créé par la
    // page de garde : une tentative par chargement ; en cas d'échec, l'appareil le garde et le prochain chargement réessaie
    keepAvatar() {
      const { look, registered } = this.prologue;
      if (!look || !registered || !this.isLoggedIn || this.avatarSent) return;
      this.avatarSent = true;
      playService.worldAvatar(look).then(world => {
        this.islandAvatar = world.avatar || null;
      }).catch(() => {});
    },
    // Feu follet écrit avant l'acte VII (bible, § 10) : Brume se reconnaît, une seule fois ; la finale reste au Phare.
    // La Vie écrite : le premier pressentiment d'Anya (§ 10, acte I), une voix sans visage
    checkEarlyWisp() {
      // (jamais pendant le tutoriel : rien qui ne serve l'étape)
      if (this.prologueRunning) return;
      if (this.actsKnown && earlyWisp(this.islandActs, this.discoveredElements)) guide.say(EARLY_WISP);
      if (this.actsKnown && this.discoveredElements.includes('Vie') && !(this.anya && this.anya.awake)) PRESENTIMENTS.vie.forEach(line => guide.say(line));
    },
    // Le tutoriel souffle ms : ni geste ni réplique d'étape, puis il reprend
    breathe(ms) {
      clearTimeout(this.breathTimer);
      coach.show(null);
      this.breathTimer = setTimeout(() => {
        this.breathTimer = 0;
        this.runIsland();
      }, ms);
    },
    runIsland() {
      // (le tutoriel souffle : il reprendra de lui-même)
      if (this.breathTimer) return;
      // Hors de l'île : le geste de l'étape quand même (au Grimoire, la page à écrire ; sinon, l'onglet « Île »)
      if (!this.isWorldActive) {
        if (!this.prologueReplay && !this.prologueScene) this.coachOffIsland();
        return;
      }
      // (jamais par-dessus un coffre : la veillée l'attend, l'île la relance quand il se referme)
      if (this.prologueReplay || this.prologueScene || this.islandHold) return;
      const quest = this.islandQuest?.id ? this.islandQuest : null;
      const step = islandStep({ state: this.tutorialState, quest });
      // Le geste de l'étape (game/coach.js) : montré après les répliques, jamais pendant une scène
      coach.show(step && ['lines', 'harvest', 'sleep'].includes(step.phase) ? islandLesson(step.lesson ? { id: step.lesson, done: false } : this.lessonQuest(quest)) : null);
      if (!step) {
        // Hors du tutoriel : la veillée du dernier acte fini, si elle n'a pas encore été vue ici
        // (jamais pendant le tutoriel d'un compte créé par la page de garde)
        const { registered, finished, skipped } = this.prologue;
        if (registered && !finished && !skipped) return;
        const act = vigilDue(this.islandActs, this.vigilsSeen);
        if (act) {
          this.prologueScene = `veillee-${act}`;
          return;
        }
        // Anya : la trace d'un quartier tout juste libéré (la huitième avant la Révélation), puis la Révélation, une fois.
        // (Pas pour un compte qui suit l'histoire de Brume : ses traces seront retravaillées, choix de l'auteur, 9 oct.)
        if (this.accountTutorial && this.accountTutorial.tutorial) return;
        const scene = anyaSceneOf(this.anya, this.tracesSeen);
        if (scene) this.prologueScene = scene;
        return;
      }
      if (step.phase === 'scene') this.prologueScene = step.scene;
      else if (step.phase === 'lines' || step.phase === 'harvest') (step.lines || []).forEach(line => this.sayPrologue(line));
      else if (step.phase === 'sleep') [...(step.lines || []), step.line || 'dormir'].forEach(line => this.sayPrologue(line));
      else if (step.phase === 'finish') {
        this.savePrologue({ finished: true });
        guide.setTutorial(false);
        // Si le chapitre II s'est ouvert pendant les leçons suivantes, sa réplique peut avoir été coupée par une scène.
        // Dite ici une fois ; guide.tip ne fait rien si elle a déjà été lue.
        guide.tip('chapter-II');
      }
    },
    // Le tutoriel, loin de l'île (le Grimoire, le Sceau) : la leçon de l'étape si elle se joue au Grimoire ; si elle se
    // joue sur l'île (une scène, des répliques, un geste), la main montre l'onglet « Île » (le coach le fait : mode world)
    coachOffIsland() {
      const quest = this.islandQuest?.id ? this.islandQuest : null;
      const step = this.prologueRunning ? islandStep({ state: this.tutorialState, quest }) : null;
      if (!step || step.phase === 'finish') return;
      // La première quête, au Grimoire : sa consigne (dite une fois), puis l'Air, deux fois
      if (quest && quest.id === 'pages' && !quest.done && this.currentMode === 'infinite') {
        const { name, face, text } = PROLOGUE_LINES.vent;
        guide.say({ id: 'prologue-vent', who: name, face, text, top: true });
      }
      const lesson = ['lines', 'harvest', 'sleep'].includes(step.phase) ? islandLesson(step.lesson ? { id: step.lesson, done: false } : this.lessonQuest(quest)) : null;
      coach.show(lesson || { id: 'vers-ile', mode: 'world', steps: [{ target: 'île:brume', text: 'Brume t’attend sur l’île.' }] });
    },
    // La quête telle que la leçon la lit : son plan seulement s'il n'est pas encore écrit (le Grimoire l'apprend avant l'île)
    lessonQuest(quest) {
      if (!quest || !quest.plan) return quest;
      return { ...quest, plan: this.discoveredElements.includes(quest.plan) ? null : quest.plan };
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
      const then = quest.id === 'achat-source' ? 'la brume de La Source peut se lever' : 'le chantier peut se bâtir';
      guide.say({ id: `prologue-plan-${quest.plan}`, text: `Tu as fait naître « ${quest.plan} » dans l’Athanor ! Retourne sur l’île : ${then}.`, action: { label: 'Aller sur l’île', mode: 'world' } });
      coach.show(islandLesson(this.lessonQuest(quest)));
    },
    // Une réplique du tutoriel : de Brume, ou d'un membre de la troupe (son portrait dans la bulle)
    sayPrologue(line) {
      const entry = PROLOGUE_LINES[line];
      const { who, text, mood, action, look } = typeof entry === 'string' ? { text: entry } : entry;
      guide.say({ id: `prologue-${line}`, text, ...(action ? { action } : {}), ...(look ? { look } : {}), ...(who ? { who: NAMES[who], ...bubbleFace(who, { castaway: !this.islandBuilt.includes(who), mood }) } : {}) });
    },
    // Le joueur a touché Aster dans les vagues : sa scène (puis elle débarque : WorldView, arrivées)
    meetIsland(id) {
      if (id === 'ponton' && this.islandWaiting.includes(id) && !this.prologueScene) this.prologueScene = 'recolte';
    },
    // Le livre est chargé : la page du Vent s'ouvre, si elle attendait
    onBookLoaded() {
      if (!this.prologueOpenReach) return;
      this.prologueOpenReach = false;
      this.$refs.book?.openReach('I');
    },
    // La carte d'embarquement : l'avatar et le nom, gardés sur l'appareil (le nom part au serveur avec le compte)
    chooseLook({ look, name }) {
      this.prologueAvatar = false;
      this.savePrologue({ look, name });
      this.runPrologue();
    },
    // Chronique : revoir une veillée, ou la Révélation (rien ne change à la partie)
    replayVigil(act) {
      this.prologueReplay = [];
      this.prologueScene = `veillee-${act}`;
    },
    replayRevelation() {
      this.prologueReplay = [];
      this.prologueScene = 'revelation';
    },
    prologueSceneDone(scene) {
      if (scene === 'revelation' && !this.prologueReplay) {
        // Vue une fois pour toutes, d'un appareil à l'autre : le serveur le retient (la gemme du Grimoire s'allume)
        this.prologueScene = null;
        this.anya = { ...this.anya, revealed: true };
        // L'île se met à jour tout de suite (Anya au Cercle, le Cercle fleuri)
        playService.anyaReveal().then(({ anya, world }) => {
          this.anya = anya;
          if (world && this.$refs.world) this.$refs.world.apply(world);
        }).catch(() => {});
        this.runIsland();
        return;
      }
      if (scene.startsWith('trace-') && !this.prologueReplay) {
        // Les traces déjà trouvées sont toutes tenues pour vues : les plus anciennes se lisent dans la Chronique
        this.prologueScene = null;
        this.tracesSeen = seenOf([...this.tracesSeen, ...tracesOf(this.anya)]);
        storage.save(TRACES_KEY, this.tracesSeen);
        this.runIsland();
        return;
      }
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
      this.prologueReplay = ['arrivee', 'souffle', 'nuit', 'recolte', 'cannelle', 'rivet', 'ondin', 'campement'];
      this.prologueScene = 'naufrage';
    },
    // L'île d'abord : le compte s'ouvre en coulisse (le carnet invité le rejoint), sans rechargement ; s'il ne peut pas
    // s'ouvrir (serveur injoignable, trop de comptes depuis cette adresse), l'ancien chemin reprend (le Grimoire d'abord)
    async openProvisional() {
      if (this.opening) return;
      this.opening = true;
      try {
        const user = await AuthService.provisional();
        this.currentUser = { userId: user.userId, username: user.username };
        this.isLoggedIn = true;
        this.savePrologue({ registered: true, provisional: true });
        this.loadAccount();
      } catch {
        this.savePrologue({ noProvisional: true });
      } finally {
        this.opening = false;
      }
      this.runPrologue();
    },
    // La page de garde a signé le compte ouvert en coulisse : il a son adresse (et son nouveau nom de compte)
    prologueSigned() {
      this.currentUser = AuthService.getCurrentUser();
      this.prologueName = null;
      this.savePrologue({ signed: true });
      this.runPrologue();
    },
    // Page de garde : l'inscription recharge la page ; le nom attend sur l'appareil, puis part au serveur
    prologueSigning(name) {
      this.savePrologue({ name, registered: true });
    },
    // L'inscription a échoué : le nom de la carte reste écrit sur la page de garde
    prologueUnsigned() {
      this.savePrologue({ registered: false });
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
    }
  }
};
