// App : la mise en scène de l'île pendant le tutoriel. La quête de Brume (étapes 2 et suivantes), qui attend dans les
// vagues, qui se tient sur notre plage, ce qu'un toucher sur la cible marquée lance, le souffle entre deux quêtes et les
// récompenses qui arrivent seules. Mixin d'App.vue (story.js : le tutoriel).

import { guide } from '@/game/guide';
import { prologueStep, islandStep, islandLesson, inPrologue, CLAIM_TAUGHT, VEILLEE } from '@/game/prologue';
import { coach } from '@/game/coach';
import { stageOf } from '@/game/stages';
import { LINES as PROLOGUE_LINES, SCENES } from '@/texts/tutorial/scenes';
import { COACH } from '@/texts/tutorial/coach';
import { lineFace } from '@/world/faces';


// Ce qu'un toucher sur la cible marquée fait seulement avancer (le moment vu : prologue.seen) : Lorena parle de sa caisse ;
// on fait connaissance d’Agathe ; la longue-vue de Lorena voit la cage dériver
const SEES = { 'quest-aster-caisse': 'aster-caisse', 'quest-cannelle-parle': 'cannelle-parle', 'quest-cage-vue': 'cage-vue' };
// Le tutoriel souffle (choix de l'auteur, 8 oct.) : après une récompense réclamée, après une quête accomplie (ms)
const BREATH_MS = 4000;
const DONE_MS = 1500;

// Ce qu'un toucher sur la cible marquée lance, selon la leçon du coach (game/prologue.js ; WorldView : acts) : la caisse
// de Lorena s'ouvre ; Lorena choisit son camp à la longue-vue, mène à la Récolte, ou ouvre l'établi sur ses piquets ; on fait
// connaissance d’Agathe ; la longue-vue de Lorena voit la cage, qu'on ouvre ; on attrape une poule (WorldView,
// henCatch.js : caught)
const ACTS = {
  'quest-aster-eau': 'habitant:ponton',
  'quest-aster-caisse': 'habitant:ponton',
  'quest-cannelle-parle': 'habitant:foyer',
  'quest-cage-vue': 'habitant:ponton',
  'quest-cage': 'cage',
  'quest-attraper': 'poule',
  'quest-caisse': 'caisse',
  'quest-longue-vue': 'habitant:ponton',
  'quest-recolte': 'habitant:ponton',
  'short-premier-ponton': 'habitant:ponton',
  'quest-clotures': 'habitant:ponton',
  // (son enclos : Agathe touchée ouvre l'établi, « Tracer »)
  'quest-enclos-cannelle': 'habitant:foyer',
  // (Jovin sort de la brume : sa scène ; puis il ouvre son établi sur la lanterne)
  'quest-rivet-brume': 'habitant:atelier',
  'quest-deco': 'habitant:atelier',
  // (puis ses trois torches : choix de l'auteur, 13 oct.)
  'quest-torches-rivet': 'habitant:atelier',
  // (la nuit de la veillée : toucher Brume pour dormir lance d'abord sa scène ; WorldView, draw/brume.js : sleep)
  'quest-veille': 'brume',
  // (le matin de Pierrot : Lorena a vu une planche sur la vague)
  'quest-planche-vue': 'habitant:ponton'
};

// Les scènes qui se jouent en bulles sur l'île, devant ce qu'on y voit (choix de l'auteur, 14 oct. : le réveil de Pierrot
// sur sa planche, en attendant ses images sur la plage) : leurs répliques (texts/tutorial/scenes.js), puis l'étape suivante
const ON_ISLAND = new Set(['ondin']);

// Les leçons où toucher le personnage ouvre l'établi (les clôtures de Lorena, la lanterne et les torches de Jovin,
// l'enclos d’Agathe)
const BENCH_LESSONS = new Set(['quest-clotures', 'quest-deco', 'quest-torches-rivet', 'quest-enclos-cannelle']);

// La croix d'une fenêtre ouverte (GModal) : la main y va quand une scène attend qu'on la ferme
const CLOSE_WINDOW = '.g-modal__close';

export default {
  data() {
    return {
      // La quête active de Brume sur l'île ({ id, done }), pour les étapes 2 à 5 ; les actes finis et le nom du peuple
      // (veillées, étape de civilisation)
      islandQuest: null,
      islandActs: [],
      // Les actes finis sont connus (le serveur a répondu) : Brume peut réagir à Feu follet écrit tôt
      actsKnown: false,
      // Un coffre est ouvert sur l'île (ou va s'ouvrir) : les veillées et les scènes attendent qu'il se referme
      islandHold: false,
      people: null,
      // L'avatar gardé par le compte (serveur), ou null tant qu'il n'y est pas
      islandAvatar: null,
      // Le nom du joueur, écrit sur la page de garde (serveur : world.player), ou null
      islandPlayer: null,
      // Les maîtres dont le bâtiment est fondé (les autres paraissent en naufragés : bulles, veillées)
      islandBuilt: [],
      // Le tutoriel souffle (breathe) ; la récompense que Brume n'a pas pu remettre seule (on va la toucher)
      breathing: false,
      claimFailed: null,
      // La scène de la nuit de la veillée se joue (veillee) : on dormira quand ses répliques seront lues
      veilleeOn: false,
      // Une scène de l'étape attend qu'on ferme la fenêtre ouverte (la fiche de Pierrot, qu'on vient de réveiller)
      sceneWaiting: false,
      // La scène qui se joue en bulles sur l'île (ON_ISLAND), ou null : vue quand ses répliques sont lues
      islandScene: null
    };
  },
  computed: {
    // Où en est chaque personnage à cette étape (game/stages.js : le fil conducteur des dévoilements ; WorldView : stage)
    islandStage() {
      return stageOf({ running: this.prologueRunning, quest: this.islandQuest && this.islandQuest.id, seen: this.tutorialState.seen });
    },
    // Les répliques qui attendent d'être lues (la scène de la veillée finit quand il n'y en a plus)
    guideWaiting() {
      return guide.state.queue.length;
    },
    // Les fenêtres ouvertes (game/guide.js : hold ; GModal, les mini-jeux)
    windowsOpen() {
      return guide.state.held;
    },
    // Ce qu'un toucher sur la cible marquée de l'étape lance (WorldView : acts)
    islandTaps() {
      const lesson = coach.state.lesson;
      const target = this.prologueRunning && lesson && ACTS[lesson.id];
      return target ? { [target]: true } : {};
    },
    // Les récompenses arrivent seules (choix de l'auteur, 11 oct.) : « Touche Brume » s'apprend à la première page ;
    // ensuite, la quête faite et ses répliques lues (rien ne parle, rien n'est ouvert), Brume la remet d'elle-même
    autoClaimDue() {
      const quest = this.islandQuest;
      if (!this.prologueRunning || !this.isWorldActive || !quest || !quest.id || !quest.done || quest.id === CLAIM_TAUGHT || !inPrologue(quest.id)) return false;
      if (this.claimFailed === quest.id || this.breathing || this.prologueScene || this.islandHold || this.islandPlaying || guide.current || guide.state.resting) return false;
      const step = islandStep({ state: this.tutorialState, quest });
      return Boolean(step && step.phase !== 'scene' && !step.hold);
    }
  },
  watch: {
    autoClaimDue(now) {
      if (now) this.autoClaim();
    },
    // La scène de la veillée lue jusqu'au bout : on dort, et le jour se lève
    guideWaiting(left) {
      if (!left && this.islandScene) this.sceneSaid();
      // (une scène de l'arc du Phare attendait que la réplique affichée soit lue : chronicle.js)
      if (this.arcWaiting) {
        this.arcWaiting = false;
        this.runIsland();
      }
      if (left || !this.veilleeOn) return;
      this.veilleeOn = false;
      if (this.$refs.world) this.$refs.world.sleep(true);
    },
    // La dernière fenêtre fermée : la scène qui attendait se joue
    windowsOpen(now) {
      // (une scène de l'arc du Phare attendait que la fête ou la fenêtre laisse parler : chronicle.js)
      if (!now && this.arcWaiting) {
        this.arcWaiting = false;
        this.runIsland();
      }
      if (now || !this.sceneWaiting) return;
      this.sceneWaiting = false;
      this.runIsland();
    }
  },
  methods: {
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
      this.islandQuest = quest ? { id: quest.id, done: Boolean(quest.done), short: Boolean(brume.short), plan: brume.plan || null, have: quest.have, need: quest.need } : { id: null, done: true };
      if (brume && brume.athanor) this.onAthanor(brume.athanor);
      if (brume && brume.tutorial !== undefined) this.accountTutorial = { tutorial: Boolean(brume.tutorial), skipped: Boolean(brume.skipped) };
      this.islandHold = Boolean(brume && brume.hold);
      if (brume) {
        this.islandActs = brume.acts || [];
        this.people = brume.people || null;
        this.islandBuilt = brume.built || [];
        this.islandAvatar = brume.avatar || null;
        this.islandPlayer = brume.player || null;
        if (!brume.avatar) this.keepAvatar();
        // La Révélation vue reste vue, même si une réponse du serveur partie avant son envoi arrive après
        this.anya = brume.anya ? { ...brume.anya, revealed: brume.anya.revealed || Boolean(this.anya && this.anya.revealed) } : this.anya;
        this.actsKnown = true;
        if (brume.scenes) this.arcScenes = brume.scenes;
        this.checkEarlyWisp();
      }
      this.runIsland();
    },
    // Le tutoriel souffle ms : ni geste ni réplique d'étape, puis il reprend
    breathe(ms) {
      clearTimeout(this.breathTimer);
      coach.show(null);
      this.breathing = true;
      this.breathTimer = setTimeout(() => {
        this.breathTimer = 0;
        this.runIsland();
        this.breathing = false;
      }, ms);
    },
    // La récompense remise d'elle-même (autoClaimDue) ; si elle ne passe pas, on retombe sur le geste appris : toucher
    // Brume
    async autoClaim() {
      const world = this.$refs.world;
      const id = this.islandQuest && this.islandQuest.id;
      if (!world || !id) return;
      await world.claimQuest();
      if (this.islandQuest && this.islandQuest.id === id && this.islandQuest.done) {
        this.claimFailed = id;
        this.runIsland();
      }
    },
    runIsland() {
      // (le tutoriel souffle, ou la scène de la veillée se joue : il reprendra de lui-même)
      if (this.breathTimer || this.veilleeOn) return;
      // Hors de l'île : le geste de l'étape quand même (au Grimoire, la page à écrire ; sinon, l'onglet « Île »)
      if (!this.isWorldActive) {
        if (!this.prologueReplay && !this.prologueScene) this.coachOffIsland();
        return;
      }
      // (jamais par-dessus un coffre : la veillée l'attend, l'île la relance quand il se referme)
      if (this.prologueReplay || this.prologueScene || this.islandHold) return;
      const quest = this.islandQuest?.id ? this.islandQuest : null;
      const step = islandStep({ state: this.tutorialState, quest });
      // Le geste de l'étape (game/coach.js) : montré après les répliques, jamais pendant une scène ; une récompense qui
      // arrive seule n'a pas de geste (sauf si elle n'a pas pu arriver : toucher Brume)
      const handed = quest && quest.done && quest.id !== CLAIM_TAUGHT && this.claimFailed !== quest.id;
      coach.show(step && ['lines', 'harvest', 'sleep'].includes(step.phase) && (step.lesson || !handed) ? islandLesson(step.lesson ? { id: step.lesson, done: false } : this.lessonQuest(quest)) : null);
      // Hors du tutoriel : la chronique (chronicle.js) a peut-être une scène à montrer
      if (!step) {
        this.sayTabsWaiting();
        this.nextStoryScene();
        return;
      }
      // (une scène ne se joue jamais sous une fenêtre ouverte : elle passait dessous, invisible, les touchers tombant sur la
      // fenêtre ; elle attend sa fermeture, windowsOpen)
      if (step.phase === 'scene') {
        if (!guide.state.held) {
          if (ON_ISLAND.has(step.scene)) this.sceneOnIsland(step.scene);
          else this.prologueScene = step.scene;
        } else {
          this.sceneWaiting = true;
          // (la main seule, sans consigne, sur la croix de la fenêtre : le joueur n'est jamais lâché)
          if (document.querySelector(CLOSE_WINDOW)) coach.show({ id: 'scene-attend', mode: 'world', steps: [{ target: CLOSE_WINDOW }] });
        }
      } else if (step.phase === 'lines' || step.phase === 'harvest') (step.lines || []).forEach(line => this.sayPrologue(line));
      else if (step.phase === 'sleep') [...(step.lines || []), step.line || 'dormir'].forEach(line => this.sayPrologue(line));
      else if (step.phase === 'finish') {
        this.savePrologue({ finished: true });
        guide.setTutorial(false);
        // Si le chapitre II s'est ouvert pendant les leçons suivantes, sa réplique peut avoir été coupée par une scène.
        // Dite ici une fois ; guide.tip ne fait rien si elle a déjà été lue.
        guide.tip('chapter-II');
        // (les conseils de l'île, refusés pendant le tutoriel : WorldView, serve.js)
        this.$refs.world?.islandTips?.();
      }
      // (un onglet ouvert pendant l'étape : après ses répliques, jamais pendant une scène)
      if (step.phase !== 'scene') this.sayTabsWaiting();
    },
    // Le tutoriel, loin de l'île (le Grimoire, le Sceau) : la leçon de l'étape si elle se joue au Grimoire ; si elle se
    // joue sur l'île (une scène, des répliques, un geste), la main montre l'onglet « Île » (le coach le fait : mode world)
    coachOffIsland() {
      // (le Grimoire avant l'île : le prologue mène, la page du Vent puis celle du Brasier)
      const before = prologueStep({ state: this.prologue, loggedIn: this.isLoggedIn, elements: this.discoveredElements, quest: this.islandQuest && this.islandQuest.id });
      if (before && before.phase !== 'greve') return;
      const quest = this.islandQuest?.id ? this.islandQuest : null;
      const step = this.prologueRunning ? islandStep({ state: this.tutorialState, quest }) : null;
      if (!step || step.phase === 'finish') return;
      // La première quête, au Grimoire : sa consigne (dite une fois), puis l'Air, deux fois
      if (quest && quest.id === 'pages' && !quest.done && this.currentMode === 'infinite') {
        const { name, face, text } = PROLOGUE_LINES.vent;
        guide.say({ id: 'prologue-vent', who: name, face, text, top: true });
      }
      const lesson = ['lines', 'harvest', 'sleep'].includes(step.phase) ? islandLesson(step.lesson ? { id: step.lesson, done: false } : this.lessonQuest(quest)) : null;
      coach.show(lesson || { id: 'vers-ile', mode: 'world', steps: [{ target: 'île:brume', text: COACH['vers-ile'] }] });
    },
    // La quête telle que la leçon la lit : son plan seulement s'il n'est pas encore écrit (le Grimoire l'apprend avant l'île)
    lessonQuest(quest) {
      if (!quest || !quest.plan) return quest;
      return { ...quest, plan: this.discoveredElements.includes(quest.plan) ? null : quest.plan };
    },
    // Un toucher sur la cible marquée de l'étape (WorldView : act) : ce que la leçon demande
    islandAct() {
      const lesson = coach.state.lesson;
      const world = this.$refs.world;
      if (!lesson || !world) return;
      if (SEES[lesson.id]) this.see(SEES[lesson.id]);
      // (Lorena a vu la planche : elle s'échoue, Pierrot endormi dessus ; la caméra la suit)
      else if (lesson.id === 'quest-planche-vue') this.see('planche', 'planche-dort');
      // (Lorena qui nage : sa scène)
      else if (lesson.id === 'quest-aster-eau') this.prologueScene = 'recolte';
      else if (lesson.id === 'quest-caisse') world.openChest('caisse:aster');
      else if (lesson.id === 'quest-cage') world.openCage();
      else if (lesson.id === 'quest-longue-vue') this.lookOut();
      else if (lesson.id === 'quest-recolte' || lesson.id === 'short-premier-ponton') world.startHarvest();
      else if (BENCH_LESSONS.has(lesson.id)) world.openBench();
      else if (lesson.id === 'quest-rivet-brume') this.prologueScene = 'rivet';
      else if (lesson.id === 'quest-veille') this.veillee();
    },
    // La nuit de la veillée (choix de l'auteur, 12 oct.) : Brume touchée pour dormir, sa scène se joue sur l'île — le
    // feu baisse, « cachons-nous », les égarés butent sur la clôture, le feu repart (game/prologue.js : VEILLEE ; WorldView,
    // draw/veillee.js) —, puis on dort (watch : guideWaiting). Vue une fois (« veillee ») : on dort tout de suite
    veillee() {
      const world = this.$refs.world;
      if (this.prologue.seen.includes('veillee')) {
        world.sleep(true);
        return;
      }
      this.savePrologue({ seen: [...new Set([...this.prologue.seen, 'veillee'])] });
      coach.show(null);
      this.veilleeOn = true;
      VEILLEE.forEach(line => this.sayPrologue(line));
    },
    // Une scène en bulles sur l'île (ON_ISLAND) : ses répliques, chacune avec le visage de qui parle ; vue quand elles
    // sont lues (sceneSaid), ou tout de suite si elles l'ont déjà été
    sceneOnIsland(scene) {
      if (this.islandScene) return;
      this.islandScene = scene;
      SCENES[scene].forEach((line, i) => {
        // (Brume parle sans visage : c'est elle, la voix des bulles)
        const face = lineFace(line, this.islandBuilt);
        guide.say({ id: `scene-${scene}-${i}`, text: line.text, ...(face ? { who: line.who, ...face } : {}) });
      });
      if (!guide.state.queue.length) this.sceneSaid();
    },
    sceneSaid() {
      const scene = this.islandScene;
      this.islandScene = null;
      this.see(scene);
    },
    // Ce moment de l'étape est vu (prologue.seen) : sa réplique (line) d'abord, puis l'étape suivante se joue
    see(id, line = null) {
      this.savePrologue({ seen: [...new Set([...this.prologue.seen, id])] });
      if (line) this.sayPrologue(line);
      this.runIsland();
    },
    // La longue-vue de Lorena choisit son camp : elle le dit, la caméra suit son regard (sa réplique : look), et elle s'y
    // rend ; son coin et sa zone se découvrent (game/stages.js)
    lookOut() {
      this.see('longue-vue', 'installe');
    },
    // Une poule attrapée (WorldView, henCatch.js) : elle rejoint les autres (game/stages.js : poule:<id>)
    onHenCaught(id) {
      this.see(`poule:${id}`);
    },
    // Une création déplacée (WorldView : moved) : la leçon du déplacement est faite
    onCraftMoved() {
      const lesson = coach.state.lesson;
      if (!lesson || lesson.id !== 'quest-deplacer') return;
      this.see('deplace');
    }
  }
};
