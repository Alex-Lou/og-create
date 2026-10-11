// App : la mise en scène de l'île pendant le tutoriel. La quête de Brume (étapes 2 et suivantes), qui attend dans les
// vagues, qui se tient sur notre plage, ce qu'un toucher sur la cible marquée lance, le souffle entre deux quêtes et les
// récompenses qui arrivent seules. Mixin d'App.vue (story.js : le tutoriel).

import { guide } from '@/game/guide';
import { prologueStep, islandStep, islandLesson, inPrologue, CLAIM_TAUGHT } from '@/game/prologue';
import { coach } from '@/game/coach';
import { LINES as PROLOGUE_LINES } from '@/texts/tutorial/scenes';


// Le tutoriel souffle (choix de l'auteur, 8 oct.) : après une récompense réclamée, après une quête accomplie (ms)
const BREATH_MS = 4000;
const DONE_MS = 1500;

// Ce qu'un toucher sur la cible marquée lance, selon la leçon du coach (game/prologue.js ; WorldView : acts) : la caisse
// d'Aster s'ouvre ; Aster choisit son camp à la longue-vue, mène à la Récolte, ou ouvre l'établi sur ses piquets
const ACTS = {
  'quest-aster-caisse': 'habitant:ponton',
  'quest-caisse': 'caisse',
  'quest-longue-vue': 'habitant:ponton',
  'quest-recolte': 'habitant:ponton',
  'short-premier-ponton': 'habitant:ponton',
  'quest-clotures': 'habitant:ponton'
};

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
      // Les maîtres dont le bâtiment est fondé (les autres paraissent en naufragés : bulles, veillées)
      islandBuilt: [],
      // Le tutoriel souffle (breathe) ; la récompense que Brume n'a pas pu remettre seule (on va la toucher)
      breathing: false,
      claimFailed: null
    };
  },
  computed: {
    // Le jour d'Aster (choix de l'auteur, 11 oct.) : avant sa scène, elle n'a pas encore paru (ni elle, ni son coin, ni sa
    // zone) ; sa scène vue, elle se tient sur notre plage jusqu'à ce que sa longue-vue choisisse son camp (WorldView)
    // Rivet de même, jusqu'à sa scène (choix de l'auteur, 11 oct. : rien d'un personnage ne se voit avant de l'avoir
    // rencontré)
    islandWaiting() {
      if (!this.prologueRunning) return [];
      const quest = this.islandQuest && this.islandQuest.id;
      const { seen } = this.tutorialState;
      return [...(quest === 'caisse' && !seen.includes('recolte') ? ['ponton'] : []), ...(seen.includes('rivet') ? [] : ['atelier'])];
    },
    // Les chantiers cachés d'un personnage déjà là, pas encore rencontré : Ondin dort contre son rocher (on le trouve),
    // son Puits attend sa scène (WorldView : unbuilt)
    islandUnbuilt() {
      return this.prologueRunning && !this.tutorialState.seen.includes('ondin') ? ['puits'] : [];
    },
    islandAshore() {
      const quest = this.islandQuest && this.islandQuest.id;
      const { seen } = this.tutorialState;
      if (!this.prologueRunning || !seen.includes('recolte') || seen.includes('longue-vue')) return [];
      return quest === 'caisse' || quest === 'recolte' ? ['ponton'] : [];
    },
    // Où Aster se tient jusqu'à la fin de sa Récolte : sur notre plage, même son camp choisi (choix de l'auteur, 11 oct. :
    // elle ne traverse pas l'île sous nos yeux) ; au retour de la Récolte, elle est à son Ponton (WorldView : staying)
    islandStaying() {
      const quest = this.islandQuest && this.islandQuest.id;
      return this.prologueRunning && (quest === 'caisse' || quest === 'recolte') ? ['ponton'] : [];
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
      // Le geste de l'étape (game/coach.js) : montré après les répliques, jamais pendant une scène ; une récompense qui
      // arrive seule n'a pas de geste (sauf si elle n'a pas pu arriver : toucher Brume)
      const handed = quest && quest.done && quest.id !== CLAIM_TAUGHT && this.claimFailed !== quest.id;
      coach.show(step && ['lines', 'harvest', 'sleep'].includes(step.phase) && (step.lesson || !handed) ? islandLesson(step.lesson ? { id: step.lesson, done: false } : this.lessonQuest(quest)) : null);
      // Hors du tutoriel : la chronique (chronicle.js) a peut-être une scène à montrer
      if (!step) {
        this.nextStoryScene();
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
      coach.show(lesson || { id: 'vers-ile', mode: 'world', steps: [{ target: 'île:brume', text: 'Brume t’attend sur l’île.' }] });
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
      if (lesson.id === 'quest-aster-caisse') {
        this.savePrologue({ seen: [...new Set([...this.prologue.seen, 'aster-caisse'])] });
        this.runIsland();
      } else if (lesson.id === 'quest-caisse') world.openChest('caisse:aster');
      else if (lesson.id === 'quest-longue-vue') this.lookOut();
      else if (lesson.id === 'quest-recolte' || lesson.id === 'short-premier-ponton') world.startHarvest();
      else if (lesson.id === 'quest-clotures') world.openBench();
    },
    // La longue-vue d'Aster choisit son camp : elle le dit, la caméra suit son regard (sa réplique : look), et elle s'y
    // rend ; son coin et sa zone se découvrent (WorldView : ashore)
    lookOut() {
      this.savePrologue({ seen: [...new Set([...this.prologue.seen, 'longue-vue'])] });
      this.sayPrologue('installe');
      this.runIsland();
    },
    // Une création déplacée (WorldView : moved) : la leçon du déplacement est faite
    onCraftMoved() {
      const lesson = coach.state.lesson;
      if (!lesson || lesson.id !== 'quest-deplacer') return;
      this.savePrologue({ seen: [...new Set([...this.prologue.seen, 'deplace'])] });
      this.runIsland();
    }
  }
};
