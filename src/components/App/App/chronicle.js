// App : la chronique de l'île, hors du tutoriel. Les scènes de l'arc du Phare (le conseil de la première veillée et son
// vol de caméra, la traversée manquée : le compte les retient, serveur), les veillées des actes finis (game/vigils.js),
// Anya et ses traces (bible, § 6.14), Brume qui se reconnaît dans Feu follet ; ce que cet appareil en a déjà vu. Mixin
// d'App.vue.

import playService from '@/services/playService';
import * as storage from '@/utils/storage';
import { guide } from '@/game/guide';
import { vigilFrames, vigilDue, stageOf as civilizationOf } from '@/game/vigils';
import { brumeLook, earlyWisp, EARLY_WISP } from '@/game/opus';
import { PRESENTIMENTS, revelationFrames, traceFrames, anyaSceneOf, tracesOf, seenOf } from '@/game/anya';
import { arcSceneOf } from '@/world/arc';

// Veillées déjà vues sur cet appareil (game/vigils.js)
const VIGILS_KEY = 'oc_vigils';
// Les traces d'Anya déjà montrées sur cet appareil (bible, § 6.14)
const TRACES_KEY = 'oc_traces';
// Les scènes de l'arc du Phare (serveur : brume.scenes) ; le conseil se joue en deux temps, la caméra vole entre eux, et
// se retient à la fin du second
const ARC_SCENES = new Set(['conseil', 'conseil-suite', 'traversee', 'phare', 'navire']);
const ARC_SEEN = { 'conseil-suite': 'conseil', traversee: 'traversee', phare: 'phare', navire: 'navire' };

export default {
  data() {
    return {
      // Anya (serveur : { traces, awake, revealed, visit, breathed }), et les traces déjà montrées sur cet appareil (en
      // numéros ; celles d'avant la v6, nommées par terre, sont converties)
      anya: null,
      tracesSeen: seenOf(storage.load(TRACES_KEY, [])),
      vigilsSeen: storage.load(VIGILS_KEY, []),
      // Les scènes de l'arc du Phare (serveur : { seen, due }), et celles jouées ici en attendant que le serveur le sache
      arcScenes: { seen: [], due: [] },
      arcPlayed: [],
      // Le vol de la caméra du conseil en cours (rien d'autre ne se joue d'ici là)
      arcFlight: false,
      // Une scène de l'arc attend que les répliques de l'île soient lues (la bulle de Léo avant la porte du phare)
      arcWaiting: false
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
    }
  },
  methods: {
    // Hors du tutoriel : la veillée du dernier acte fini, si elle n'a pas encore été vue ici (jamais pendant le tutoriel
    // d'un compte créé par la page de garde) ; puis Anya : la trace d'un quartier tout juste libéré (la huitième avant la
    // Révélation), puis la Révélation, une fois (pas pour un compte qui suit l'histoire de Brume : ses traces seront
    // retravaillées, choix de l'auteur, 9 oct.)
    nextStoryScene() {
      const { registered, finished, skipped } = this.prologue;
      if ((registered && !finished && !skipped) || this.arcFlight) return;
      // (l'arc du Phare d'abord : le conseil suit de près le Campement, la traversée le Bateau écrit, le phare la clé ;
      // le navire, la veillée VII), une fois lues les répliques de l'île qui l'annoncent
      const arc = arcSceneOf(this.arcScenes.due, this.arcPlayed, this.vigilsSeen);
      if (arc) {
        // (tant qu'une réplique de l'arc attend d'être lue : la bulle de Léo avant la porte du phare)
        if (guide.state.queue.some(line => line.id.startsWith('arc-'))) {
          this.arcWaiting = true;
          return;
        }
        this.prologueScene = arc;
        return;
      }
      const act = vigilDue(this.islandActs, this.vigilsSeen);
      if (act) {
        this.prologueScene = `veillee-${act}`;
        return;
      }
      if (this.accountTutorial && this.accountTutorial.tutorial) return;
      const scene = anyaSceneOf(this.anya, this.tracesSeen);
      if (scene) this.prologueScene = scene;
    },
    // Une scène de la chronique finie (hors d'une relecture) : vrai si elle en était une (retenue, l'île reprend)
    storySceneDone(scene) {
      if (ARC_SCENES.has(scene)) {
        this.prologueScene = null;
        if (scene === 'conseil') {
          this.arcFlight = true;
          this.flyToLighthouse({ rain: true }).then(() => {
            this.arcFlight = false;
            this.prologueScene = 'conseil-suite';
          });
          return true;
        }
        // (vue une fois pour toutes, d'un appareil à l'autre : le serveur la retient)
        const id = ARC_SEEN[scene];
        this.arcPlayed = [...new Set([...this.arcPlayed, id])];
        playService.sceneSeen(id).catch(() => {});
        this.runIsland();
        return true;
      }
      if (scene === 'revelation') {
        // Vue une fois pour toutes, d'un appareil à l'autre : le serveur le retient (la gemme du Grimoire s'allume)
        this.prologueScene = null;
        this.anya = { ...this.anya, revealed: true };
        // L'île se met à jour tout de suite (Anya au Cercle, le Cercle fleuri)
        playService.anyaReveal().then(({ anya, world }) => {
          this.anya = anya;
          if (world && this.$refs.world) this.$refs.world.apply(world);
        }).catch(() => {});
        this.runIsland();
        return true;
      }
      if (scene.startsWith('trace-') ) {
        // Les traces déjà trouvées sont toutes tenues pour vues : les plus anciennes se lisent dans la Chronique
        this.prologueScene = null;
        this.tracesSeen = seenOf([...this.tracesSeen, ...tracesOf(this.anya)]);
        storage.save(TRACES_KEY, this.tracesSeen);
        this.runIsland();
        return true;
      }
      if (scene.startsWith('veillee-') ) {
        this.prologueScene = null;
        this.vigilsSeen = [...new Set([...this.vigilsSeen, scene.slice(8)])];
        storage.save(VIGILS_KEY, this.vigilsSeen);
        // (le soir de la veillée V, près du feu : la question de Brume, et ton silence ; lot 08 § 4)
        if (scene === 'veillee-V') this.$refs.world?.askPhareQuestion?.();
        this.runIsland();
        return true;
      }
      return false;
    },
    // Feu follet écrit avant l'acte VII (bible, § 10) : Brume se reconnaît, une seule fois ; la finale reste au Phare.
    // La Vie écrite : le premier pressentiment d'Anya (§ 10, acte I), une voix sans visage
    checkEarlyWisp() {
      // (jamais pendant le tutoriel : rien qui ne serve l'étape)
      if (this.prologueRunning) return;
      if (this.actsKnown && earlyWisp(this.islandActs, this.discoveredElements)) guide.say(EARLY_WISP);
      if (this.actsKnown && this.discoveredElements.includes('Vie') && !(this.anya && this.anya.awake)) PRESENTIMENTS.vie.forEach(line => guide.say(line));
    },
    // Le vol de la caméra du conseil, sur l'île (WorldView, phare.js) ; tout de suite si l'île n'est pas à l'écran.
    // options : { rain } (la pluie jusqu'au matin : le conseil joué, pas revu)
    flyToLighthouse(options) {
      const world = this.isWorldActive && this.$refs.world;
      return world && world.flyToLighthouse ? world.flyToLighthouse(options) : Promise.resolve();
    },
    // La scène du conseil s'ouvre : l'île prépare le trajet du vol pendant qu'on la lit
    prepareLighthouse() {
      const world = this.isWorldActive && this.$refs.world;
      if (world && world.prepareLighthouse) world.prepareLighthouse();
    },
    // Chronique : revoir une veillée, ou la Révélation (rien ne change à la partie)
    replayVigil(act) {
      this.prologueReplay = [];
      this.prologueScene = `veillee-${act}`;
    },
    replayRevelation() {
      this.prologueReplay = [];
      this.prologueScene = 'revelation';
    }
  }
};
