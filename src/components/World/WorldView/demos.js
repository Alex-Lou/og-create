// L'île : ce que montrent les répliques (texts/tutorial/scenes.js : demo). La veillée (le feu baisse, les égarés
// butent sur la clôture, le feu repart), l'averse de la Pluie écrite, joués quand la réplique s'affiche, ou dès que
// l'île se montre si elle l'était déjà ; la caméra va vers ce que la réplique regarde. Mixin de WorldView.vue.

import { guide } from '@/game/guide';
import { lineOf } from '@/world/strays';
import { EGARES, lumieresOf } from '@/game/prologue';

// L'égaré que Brume montre au tutoriel : son allure (ms par case), son nom (« demo » : un fantôme, qu'on ne touche pas)
const DEMO_CELL_MS = 650;
const DEMO_ID = 'tuto-egare';
// Ce qui barre sa route : une clôture, un muret, une porte verrouillée (serveur : services/nights.js, barsOf)
const bars = p => p.craft === 'cloture' || p.craft === 'muret' || (p.craft === 'porte' && p.locked);
// La portée de la lumière du feu de camp (serveur : services/nights.js, LIGHT_REACH) ; l'écart (en cases) d'une case à
// l'emprise d'un bâtiment de la vue
const FIRE_REACH = 3;
const gapToSite = (c, site) => Math.max(Math.max(site.x - c.x, 0, c.x - (site.x + site.w - 1)), Math.max(site.y - c.y, 0, c.y - (site.y + (site.h || site.w) - 1)));
// Un égaré de démonstration : où il s'arrête (step), et ce qu'il y fait (end)
const stray = (i, from, path, step, end) => ({ id: `${DEMO_ID}-${i}`, kind: from.kind, demo: true, path, at: Date.now() + 400 + from.at * 1000, step, end, cellMs: DEMO_CELL_MS });

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
      else if (name === 'lumieres') this.lightDemo();
      // (le feu repart : le Dormeur, que la lumière ne réveille pas, reste endormi contre lui jusqu'à l'aube)
      else if (name === 'rallume' && this.veillee) this.veillee = { ...this.veillee, end: performance.now() / 1000 };
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
    // La nuit de la veillée (choix de l'auteur, 11 et 12 oct.) : les égarés sortent de la brume au nord et sur les côtés,
    // l'un après l'autre, et vont tout droit sur le feu de camp ; une clôture sur leur trait les barre (ils boudent, puis
    // retournent dans la brume ; le Dormeur s'y endort), sinon la lumière du feu les arrête à son bord ; le Dormeur, qui
    // ne la voit pas, vient s'endormir tout contre lui (choix de l'auteur, 19 oct. : pas de clôture encore, cette nuit-là)
    // (game/prologue.js : BARRAGE, EGARES)
    strayDemo() {
      const foyer = this.state && this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
      if (!foyer) return;
      this.tutoStrays = EGARES.map((from, i) => {
        // (droit sur le feu : du nord, ou de côté)
        const path = lineOf(from, from.side === 'x' ? { x: foyer.x, y: from.y } : { x: from.x, y: foyer.y });
        const fence = path.findIndex(c => this.crafted.some(p => bars(p) && p.x === c.x && p.y === c.y));
        const sleeper = from.kind === 'zombie';
        if (fence > 0) return stray(i, from, path, fence - 1, sleeper ? 'dort' : 'barre');
        // (la lumière du feu : FIRE_REACH cases autour de son emprise ; le Dormeur va jusqu'au bout, tout contre lui)
        const lit = path.findIndex(c => gapToSite(c, foyer) <= FIRE_REACH);
        return sleeper || lit < 0 ? stray(i, from, path, path.length - 1, sleeper ? 'dort' : 'repousse') : stray(i, from, path, lit, 'repousse');
      });
      this.drawSoon();
    },
    // La nuit des lumières (choix de l'auteur, 18 oct.) : un Sans-Nom de chaque côté voit la torche de Nathan, va vers
    // elle et s'arrête à son bord, sauf le téméraire, qui y entre et s'y brûle ; le Dormeur, les yeux fermés, s'endort
    // contre la barrière du nord (game/prologue.js : lumieresOf)
    lightDemo() {
      const foyer = this.state && this.state.sites.find(s => s.id === 'foyer' && s.level > 0);
      if (!foyer) return;
      const now = Date.now();
      this.tutoStrays = lumieresOf(foyer, this.crafted).map((c, i) => ({
        id: `${DEMO_ID}-${i}`, kind: c.kind, demo: true, path: c.path, at: now + 400 + c.at * 1000, step: c.step, end: c.end, cellMs: DEMO_CELL_MS
      }));
      this.drawSoon();
    }
  }
};
