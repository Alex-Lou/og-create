// App : l'histoire. Le tutoriel (HISTOIRE.md, § 9 ; l'étape se déduit du jeu, game/prologue.js), les quêtes de Brume
// sur l'île, les veillées et Anya. Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App.

import playService from '@/services/playService';
import * as storage from '@/utils/storage';
import { messageOf } from '@/utils/errors';
import { guide } from '@/game/guide';
import { loadPrologue, savePrologue, prologueStep, islandStep, islandLesson } from '@/game/prologue';
import { coach } from '@/game/coach';
import { faceHref, NAMES } from '@/world/faces';
import { vigilFrames, vigilDue, stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook, earlyWisp, EARLY_WISP } from '@/game/opus';
import { PRESENTIMENTS, revelationFrames, traceFrames, anyaSceneOf, tracesOf, seenOf } from '@/game/anya';
import { LINES as PROLOGUE_LINES } from '@/game/prologueScenes';
import { DEFAULT_LOOK } from '@/game/sceneArt';

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
      // « Passer le tutoriel » attend sa confirmation
      skipAsk: false,
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
      return started && !skipped && !finished && (!this.isLoggedIn || registered);
    },
    // Le geste montré par le coach (game/coach.js) : une fois les répliques de Brume lues, jamais sous une scène, la
    // carte d'embarquement, la page de garde ou une confirmation ; sur l'onglet de sa cible
    coachLesson() {
      const lesson = coach.state.lesson;
      if (!lesson || this.prologueScene || this.prologueAvatar || this.prologueName || this.skipAsk || guide.current) return null;
      return lesson.mode === this.currentMode ? lesson : null;
    },
    // Les onglets s'ouvrent un à un pendant le tutoriel : le Grimoire seul, puis l'Île (le nom écrit, la Grève), puis
    // Défis et Sceau à la fin
    lockedTabs() {
      if (!this.prologueRunning) return [];
      return this.prologue.named ? ['timer', 'sceau'] : ['world', 'timer', 'sceau'];
    },
    // La couverture du Grimoire attend la scène d'arrivée (et, pour un invité, de savoir s'il est tout neuf)
    prologueHold() {
      const { skipped, started, seen } = this.prologue;
      if (this.isLoggedIn || skipped || seen.includes('arrivee')) return false;
      return !this.progressReady || started;
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
      if (coach.state.lesson?.mode === 'infinite') coach.show(null);
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
        if (step.scene === 'naufrage' || step.scene === 'arrivee') show();
        else this.prologueTimer = setTimeout(show, 2500);
      } else if (phase === 'avatar') {
        this.prologueAvatar = true;
      } else if (phase === 'vent') {
        const { name, face, text } = PROLOGUE_LINES.vent;
        guide.say({ id: 'prologue-vent', who: name, face, text, top: true });
        coach.show({ id: 'vent-air', target: '.book-view__shelf [data-name="Air"]', mode: 'infinite' });
      } else if (phase === 'pluie') {
        // La page de l'énigme suivante : le Grimoire s'y ouvre une fois, ses pages rechargées (Vent inscrit). Brume la
        // présente à sa façon : le mode d'emploi de la page à portée n'a plus lieu d'être
        guide.drop('reach');
        if (guide.say({ id: 'prologue-pluie', text: PROLOGUE_LINES.pluie })) {
          // Après la scène du vent, le Grimoire est déjà rechargé : il s'ouvre tout de suite sur l'énigme
          if (this.$refs.book?.engine) this.$refs.book.openReach('I');
          else this.prologueOpenReach = true;
        }
      } else if (phase === 'seul') {
        guide.say({ id: 'prologue-seul', text: PROLOGUE_LINES.seul });
      } else if (phase === 'name') {
        // Le nom écrit juste avant l'inscription (la page s'est rechargée) : il part sans redemander
        if (!step.account && this.prologue.name) this.namePlayer(this.prologue.name);
        else this.prologueName = { account: step.account };
      } else if (phase === 'greve') {
        guide.say({ id: 'prologue-greve', text: PROLOGUE_LINES.greve, action: { label: 'Courir sur la Grève', mode: 'world' } });
      }
    },
    // Étapes 2 (sur l'île) à 5 : la quête active de Brume
    onIslandQuest(brume) {
      const quest = brume && brume.quest;
      this.islandQuest = quest ? { id: quest.id, done: Boolean(quest.done) } : { id: null, done: true };
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
      if (this.actsKnown && earlyWisp(this.islandActs, this.discoveredElements)) guide.say(EARLY_WISP);
      if (this.actsKnown && this.discoveredElements.includes('Vie') && !(this.anya && this.anya.awake)) PRESENTIMENTS.vie.forEach(line => guide.say(line));
    },
    runIsland() {
      // (jamais par-dessus un coffre : la veillée l'attend, l'île la relance quand il se referme)
      if (this.prologueReplay || this.prologueScene || this.islandHold || !this.isWorldActive) return;
      const quest = this.islandQuest?.id ? this.islandQuest : null;
      const step = islandStep({ state: this.prologue, quest });
      // Le geste de l'étape (game/coach.js) : montré après les répliques, jamais pendant une scène
      coach.show(step && (step.phase === 'lines' || step.phase === 'harvest') ? islandLesson(quest) : null);
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
        // Anya : la trace d'un quartier tout juste libéré (la huitième avant la Révélation), puis la Révélation, une fois
        const scene = anyaSceneOf(this.anya, this.tracesSeen);
        if (scene) this.prologueScene = scene;
        return;
      }
      if (step.phase === 'scene') this.prologueScene = step.scene;
      else if (step.phase === 'lines') step.lines.forEach(line => this.sayPrologue(line));
      else if (step.phase === 'finish') {
        this.savePrologue({ finished: true });
        // Le chapitre II s'est ouvert pendant le prologue (3e page), juste avant la création du compte, qui recharge la
        // page : sa réplique, encore en attente, s'y perdait. Dite ici, une fois (rien si elle l'a déjà été)
        guide.tip('chapter-II');
      }
    },
    // Une réplique du tutoriel : de Brume, ou d'un membre de la troupe (son portrait dans la bulle)
    sayPrologue(line) {
      const entry = PROLOGUE_LINES[line];
      const { who, text } = typeof entry === 'string' ? { text: entry } : entry;
      guide.say({ id: `prologue-${line}`, text, ...(who ? { who: NAMES[who], face: faceHref(who, { castaway: !this.islandBuilt.includes(who) }) } : {}) });
    },
    // La carte d'embarquement : l'avatar et le nom, gardés sur l'appareil (le nom part au serveur avec le compte)
    chooseLook({ look, name }) {
      this.prologueAvatar = false;
      this.savePrologue({ look, name });
      this.runPrologue();
    },
    onBookLoaded() {
      if (!this.prologueOpenReach) return;
      this.prologueOpenReach = false;
      this.$refs.book?.openReach('I');
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
      this.prologueScene = null;
      this.prologueAvatar = false;
      this.prologueName = null;
      coach.show(null);
      this.savePrologue({ skipped: true });
    },
    replayPrologue() {
      this.prologueReplay = ['arrivee', 'souffle', 'sceau', 'recolte', 'cannelle', 'rivet', 'ondin', 'campement'];
      this.prologueScene = 'naufrage';
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
