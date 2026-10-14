// L'île : ce que montrent les répliques (texts/tutorial/scenes.js : demo). La veillée (le feu baisse, les égarés
// butent sur la clôture, le feu repart), l'averse de la Pluie écrite, joués quand la réplique s'affiche, ou dès que
// l'île se montre si elle l'était déjà ; la caméra va vers ce que la réplique regarde. Mixin de WorldView.vue.

import { guide } from '@/game/guide';
import { lineOf } from '@/world/strays';
import { EGARES } from '@/game/prologue';

// L'égaré que Brume montre au tutoriel : son allure (ms par case), son nom (« demo » : un fantôme, qu'on ne touche pas)
const DEMO_CELL_MS = 650;
const DEMO_ID = 'tuto-egare';

export default {
  computed: {
    // Ce que la réplique en cours fait voir sur l'île (texts/tutorial/scenes.js : demo), ou null
    guideDemo() {
      const line = guide.current;
      return (line && line.demo) || null;
    }
  },
  watch: {
    // (une réplique déjà affichée quand l'île s'ouvre — la Pluie écrite au Grimoire, puis retour sur l'île — se joue
    // aussi, dès que l'île se montre : islandShown)
    guideDemo: {
      immediate: true,
      handler(name) {
        this.playDemo(name);
      }
    },
    // (sans écran de chargement : dès son état)
    state(now, before) {
      if (now && !before && !this.loadingSince) this.$nextTick(() => this.islandShown());
    }
  },
  created() {
    // Les égarés du tutoriel (draw/life.js les dessine à toute heure) : [{ id, kind, path, at, step, end, cellMs, demo, wakeAt? }]
    this.tutoStrays = [];
    // La nuit de la veillée (draw/veillee.js) : { from, end } en s, ou null
    this.veillee = null;
  },
  methods: {
    // Ce que la réplique en cours fait voir sur l'île (guideDemo) ; l'île pas encore montrée, il l'attend (islandShown)
    // (la nuit de la veillée : le feu baisse et la nuit se fait magie, les égarés, puis le feu repart ; draw/veillee.js)
    playDemo(name) {
      const shown = this.state && !this.loadingSince;
      this.demoWaiting = shown ? null : name;
      if (!shown) return;
      if (name === 'eteint') this.veillee = { from: performance.now() / 1000, end: 0 };
      else if (name === 'egare') this.strayDemo();
      else if (name === 'rallume' && this.veillee) {
        this.veillee = { ...this.veillee, end: performance.now() / 1000 };
        // (le feu repart : le Dormeur endormi contre l'enclos se réveille, boude et rentre)
        this.tutoStrays = this.tutoStrays.map(c => (c.end === 'dort' ? { ...c, wakeAt: Date.now() } : c));
      }
      // (la Pluie écrite : l'averse tombe sur l'île, tant que ses répliques se lisent ; sky.js : showerNow)
      else if (name === 'averse' && !this.shower) {
        this.shower = performance.now();
        this.showerLeave = null;
      }
      // (ses répliques toutes lues, plus aucune dans la file : elle s'éloigne)
      if (name !== 'averse' && this.shower && this.showerLeave === null && !guide.state.queue.some(line => line.demo === 'averse')) {
        this.showerLeave = (performance.now() - this.shower) / 1000;
      }
      this.drawSoon();
    },
    // L'île se montre (draw/loading.js : endLoading ; sinon son état arrivé) : ce que la réplique en cours fait voir se
    // joue, et la caméra va vers ce qu'elle montre (coach.js : lookAt)
    islandShown() {
      if (this.demoWaiting) this.playDemo(this.demoWaiting);
      if (this.guideLook) this.lookAt(this.guideLook);
    },
    // La nuit de la veillée, Brume montre la clôture (choix de l'auteur, 11 et 12 oct.) : les égarés sortent de la brume
    // au nord et sur les côtés, l'un après l'autre, et vont tout droit sur le feu de camp ; la première clôture sur leur trait les
    // barre (ils boudent, puis retournent dans la brume ; le Dormeur s'y endort), sinon le feu les change en lucioles au
    // bout (le Dormeur, que la lumière ne change pas, s'y fond) (game/prologue.js : BARRAGE, EGARES)
    strayDemo() {
      const foyer = this.state && this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
      if (!foyer) return;
      const now = Date.now();
      this.tutoStrays = EGARES.map((from, i) => {
        // (droit sur le feu : du nord, ou de côté)
        const path = lineOf(from, from.side === 'x' ? { x: foyer.x, y: from.y } : { x: from.x, y: foyer.y });
        const fence = path.findIndex(c => this.crafted.some(p => p.craft === 'cloture' && p.x === c.x && p.y === c.y));
        const barred = fence > 0;
        const sleeper = from.kind === 'zombie';
        const end = barred ? (sleeper ? 'dort' : 'barre') : (sleeper ? 'arrive' : 'luciole');
        return { id: `${DEMO_ID}-${i}`, kind: from.kind, demo: true, path, at: now + 400 + from.at * 1000, step: barred ? fence - 1 : path.length - 1, end, cellMs: DEMO_CELL_MS };
      });
      this.drawSoon();
    }
  }
};
