<template>
  <div class="chase" role="dialog" aria-modal="true" :aria-label="T.title">
    <div class="chase__card">
      <header class="chase__head">
        <div>
          <span class="chase__eyebrow">Cannelle · {{ caughtCount }} / {{ total }}</span>
          <span class="chase__title">{{ T.title }}</span>
        </div>
        <button v-if="phase !== 'end'" type="button" class="chase__later" @click="$emit('close')">{{ T.later }}</button>
      </header>

      <!-- L'enclos : le sable, la cage ouverte, les poules ; un toucher au sable lance du grain. Les poules bougent par
           transformations posées à chaque image (rien n'est redessiné par Vue pendant la course) -->
      <div ref="arena" class="chase__arena" @pointerdown="onArena">
        <img v-for="d in DECOR" :key="d.key" class="chase__decor" :src="d.src" alt="" :style="{ ...at(d), width: `${d.w}%`, zIndex: Math.round(d.y) }" draggable="false" />
        <img class="chase__cage" :src="CAGE_ART" alt="" :style="at(CAGE_AT)" draggable="false" />
        <span class="chase__cage-count" :style="at({ x: CAGE_AT.x, y: CAGE_AT.y - 13 })" aria-hidden="true">{{ caughtCount }} / {{ total }}</span>
        <span v-for="g in grains" :key="g.key" class="chase__grain" :style="at(g)" aria-hidden="true">
          <img v-for="k in g.amount" :key="k" :src="GRAIN_ART" alt="" :style="{ '--gx': `${SCATTER[k - 1][0]}px`, '--gy': `${SCATTER[k - 1][1]}px`, '--r': `${SCATTER[k - 1][2]}deg`, '--k': k }" draggable="false" />
        </span>
        <button
          v-for="h in henList"
          :key="h.id"
          :ref="el => (henEls[h.id] = el)"
          type="button"
          class="chase__hen"
          :aria-label="h.name"
          @pointerdown.stop.prevent="onHen(h.id, $event)"
        >
          <span class="chase__shadow" aria-hidden="true"></span>
          <!-- (la zone tactile : le corps seulement, pour qu'un grain semé juste à côté ne la fasse pas fuir) -->
          <span class="chase__hit" aria-hidden="true"></span>
          <!-- (ses trois dessins, décodés une fois et superposés : le jeu montre l'un ou l'autre, sans jamais recharger d'image) -->
          <span :ref="el => (imgEls[h.id] = el)" class="chase__body" data-f="1">
            <img v-for="f in FRAMES" :key="f" :class="`f${f}`" :src="artOf(`${h.id}_${FRAME_ART[f]}`)" alt="" draggable="false" decoding="sync" />
          </span>
          <span class="chase__bang" aria-hidden="true">!</span>
        </button>
        <span v-for="f in feathers" :key="f.key" class="chase__feather" :style="{ ...at(f), '--dx': `${f.dx}px`, '--dy': `${f.dy}px`, '--r': `${f.r}deg` }" aria-hidden="true" @animationend="drop('feathers', f.key)"></span>
        <span v-for="s in squawks" :key="s.key" class="chase__squawk" :style="at(s)" aria-hidden="true" @animationend="drop('squawks', s.key)">{{ s.text }}</span>
        <!-- Pas encore de grain lancé : la main montre le sable -->
        <span v-if="hint" class="chase__hint" aria-hidden="true"><span class="chase__ring"></span>{{ T.hint }}</span>
        <!-- La carte de la poule prise -->
        <transition name="chase-card">
          <p v-if="card" :key="card.id" class="chase__taken" role="status"><strong>{{ card.name }}</strong> — {{ card.line }}</p>
        </transition>
      </div>

      <p class="chase__rule">{{ T.rule }}</p>

      <!-- Cannelle ouvre la chasse, puis la ferme -->
      <div v-if="phase !== 'play'" class="chase__talk">
        <div class="chase__bubble">
          <img :class="['chase__face', { 'is-bust': face.bust }]" :src="face.face" alt="" />
          <p><strong>Cannelle</strong>{{ phase === 'intro' ? T.open : T.end }}</p>
        </div>
        <button type="button" class="chase__btn" @click="phase === 'intro' ? start() : $emit('close')">{{ phase === 'intro' ? T.go : T.next }}</button>
      </div>
      <p class="chase__sr" aria-live="polite">{{ live }}</p>
    </div>
  </div>
</template>

<script>
import { guide } from '@/game/guide';
import { vibrate, reducedMotion } from '@/utils/fx';
import { bubbleFace } from '@/world/faces';
import { chaseOf, stepChase, throwGrain, tapHen, caughtAt, chaseDone, CAGE, CATCH } from '@/game/henChase';
import { HEN_CHASE as T } from '@/texts/tutorial/henChase';

// Les dessins de la bibliothèque : les poules (de profil qui marche, de trois quarts en joie), la cage ouverte, la graine
const ART = import.meta.glob('/design/bibliotheque/svg/animaux/*/poule-*/poule-*_{profil_marche_1,profil_marche_2,avant_joie}.svg', { query: '?url', import: 'default', eager: true });
const artOf = name => Object.entries(ART).find(([path]) => path.endsWith(`/${name}.svg`))?.[1] || '';
const CAGE_ART = Object.values(import.meta.glob('/design/bibliotheque/svg/decor/camp/poules/cage_poules_ouverte.svg', { query: '?url', import: 'default', eager: true }))[0];
const GRAIN_ART = Object.values(import.meta.glob('/design/bibliotheque/svg/minijeux/recolte/graine.svg', { query: '?url', import: 'default', eager: true }))[0];
// Le décor de l'enclos (la bibliothèque : plantes) : herbe au fond, bois flotté et coquillages vers l'eau
const PLANTS = import.meta.glob('/design/bibliotheque/svg/plantes/{touffe_fleurie,touffe,touffe_petite,touffe_motte_petite,bois_flotte_petit,coquillages_petits}.svg', { query: '?url', import: 'default', eager: true });
const plant = name => PLANTS[`/design/bibliotheque/svg/plantes/${name}.svg`];
const DECOR = [
  ['touffe_fleurie', 12, 16, 40], ['touffe', 34, 10, 30], ['touffe_motte_petite', 54, 18, 24], ['touffe_petite', 6, 54, 22],
  ['bois_flotte_petit', 20, 96, 44], ['coquillages_petits', 86, 94, 24], ['touffe_petite', 95, 64, 20]
].map(([name, x, y, w], i) => ({ key: `${name}:${i}`, src: plant(name), x, y, w })).filter(d => d.src);
// Où tombent les graines d'une poignée, autour du point touché : [dx, dy, rotation]
const SCATTER = [[-10, 2, -20], [7, -5, 35], [2, 8, 80]];
// Les trois dessins de chaque poule : 1 et 2, les pas de marche (le 1 aussi pour picorer) ; 3, la joie
const FRAMES = [1, 2, 3];
const FRAME_ART = { 1: 'profil_marche_1', 2: 'profil_marche_2', 3: 'avant_joie' };
// Le pas de marche (s), deux fois plus vif en esquive ; la main revient après HINT_S sans grain lancé ; la carte d'une
// prise reste CARD_S
const STEP_S = 0.26;
const HINT_S = 4;
const CARD_S = 2.2;

// La chasse aux poules de Cannelle (choix de l'auteur, 13 oct. : une scène à part, fluide) : plein écran. hens : les
// poules encore échappées ([{ id, name }], lues une fois : une prise ne les retire pas en cours de partie) ; built : les
// bâtiments fondés (Cannelle naufragée ou non). Émet caught (id) à chaque prise, close à la fin ou pour plus tard.
// Fluidité : la course se calcule et se pose à chaque image directement sur les éléments (translate3d, composée par le
// GPU) ; Vue ne redessine qu'aux événements (grain, plumes, carte, prise)
export default {
  name: 'HenChase',
  props: {
    hens: { type: Array, required: true },
    built: { type: Array, default: () => [] }
  },
  emits: ['caught', 'close'],
  data() {
    return { T, CAGE_ART, GRAIN_ART, DECOR, SCATTER, FRAMES, FRAME_ART, CAGE_AT: CAGE, phase: 'intro', grains: [], feathers: [], squawks: [], card: null, live: '', caughtCount: 0, hint: false };
  },
  computed: {
    total() {
      return this.henList.length;
    },
    face() {
      return bubbleFace('foyer', { castaway: !this.built.includes('foyer'), mood: this.phase === 'end' ? 'adore' : 'effraye' });
    }
  },
  created() {
    this.henList = this.hens.map(h => ({ id: h.id, name: h.name }));
    this.names = new Map(this.henList.map(h => [h.id, h.name]));
    this.chase = chaseOf(this.henList.map(h => h.id));
    this.reduced = reducedMotion();
    // (non réactifs : les éléments des poules, ce qui y est déjà posé, la taille de l'enclos)
    this.henEls = {};
    this.imgEls = {};
    this.posed = {};
    this.size = { w: 0, h: 0 };
    this.grainSig = '';
    this.thrown = false;
    this.playedFor = 0;
  },
  mounted() {
    // (pendant la chasse, ni Brume ni les aides ne parlent par-dessus : game/guide.js, hold)
    this.release = guide.hold();
    const measure = () => {
      const r = this.$refs.arena.getBoundingClientRect();
      this.size = { w: r.width, h: r.height };
    };
    measure();
    this.resize = new ResizeObserver(measure);
    this.resize.observe(this.$refs.arena);
    this.last = performance.now();
    const loop = now => {
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (this.phase !== 'intro') this.advance(dt);
      this.pose();
      this.frame = requestAnimationFrame(loop);
    };
    this.frame = requestAnimationFrame(loop);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.frame);
    this.resize && this.resize.disconnect();
    this.release && this.release();
  },
  methods: {
    artOf,
    // Position dans l'enclos (pour cent) en style, pour ce qui ne bouge pas
    at(p) {
      return { left: `${p.x}%`, top: `${p.y}%` };
    },
    start() {
      this.phase = 'play';
      this.playedFor = 0;
    },
    // Une image de jeu : les règles avancent ; Vue n'est touché que si quelque chose change vraiment
    advance(dt) {
      stepChase(this.chase, dt);
      const sec = this.chase.time;
      if (this.phase === 'play') {
        this.playedFor += dt;
        const hint = !this.thrown && this.playedFor >= HINT_S;
        if (hint !== this.hint) this.hint = hint;
        if (chaseDone(this.chase)) {
          this.phase = 'end';
          vibrate([10, 40, 10, 40, 16]);
        }
      }
      if (this.card && sec - this.card.born > CARD_S) this.card = null;
      // (le grain : seulement quand une poignée naît, s'épuise ou disparaît)
      const sig = this.chase.grains.map(g => `${g.born}:${g.amount}`).join('|');
      if (sig !== this.grainSig) {
        this.grainSig = sig;
        this.grains = this.chase.grains.map(g => ({ key: `${g.born}`, x: g.x, y: g.y, amount: g.amount }));
      }
    },
    // Pose chaque poule à sa place : translate3d sur son bouton, son image (pas de marche, picorage, joie) ; rien n'est
    // réécrit s'il n'a pas changé
    pose() {
      const { w, h: height } = this.size;
      if (!w) return;
      const t = this.chase.time;
      for (const hen of this.chase.hens) {
        const el = this.henEls[hen.id];
        const img = this.imgEls[hen.id];
        if (!el || !img) continue;
        const was = this.posed[hen.id] || (this.posed[hen.id] = {});
        let x = hen.x;
        let y = hen.y;
        let frame;
        let look;
        if (hen.state === 'caught' || hen.state === 'home') {
          const p = caughtAt(hen);
          x = p.x;
          y = p.y;
          frame = '3';
          look = hen.state === 'home' ? 'scale(0)' : `scale(${hen.t < CATCH.joy ? 1.12 : 1 - p.k * 0.4})`;
        } else {
          const fast = hen.state === 'flee';
          const flip = hen.facing < 0 ? 'scaleX(-1) ' : '';
          const step = Math.floor(t / (fast ? STEP_S / 2 : STEP_S) + hen.x / 7) % 2 ? 2 : 1;
          frame = hen.state === 'peck' ? '1' : String(step);
          if (hen.state === 'peck') look = `${flip}rotate(${this.reduced ? 24 : (20 + Math.abs(Math.sin(t * 9)) * 14).toFixed(1)}deg)`;
          else look = this.reduced ? flip || 'none' : `${flip}translateY(${(-Math.abs(Math.sin(t * (fast ? 22 : 12) + hen.x)) * (fast ? 7 : 4)).toFixed(1)}px)`;
        }
        const move = `translate3d(${((x / 100) * w).toFixed(1)}px, ${((y / 100) * height).toFixed(1)}px, 0)`;
        if (move !== was.move) { el.style.transform = move; was.move = move; }
        // (la profondeur : par paliers de 4 %, elle ne change que quand l'ordre des poules change vraiment)
        const z = String(Math.round(y / 4) * 4);
        if (z !== was.z) { el.style.zIndex = z; was.z = z; }
        if (frame !== was.frame) { img.dataset.f = frame; was.frame = frame; }
        if (look !== was.look) { img.style.transform = look; was.look = look; }
        if (hen.state !== was.state) {
          el.className = `chase__hen is-${hen.state}`;
          el.setAttribute('aria-label', hen.state === 'peck' ? `${this.names.get(hen.id)} picore : attrape-la` : this.names.get(hen.id));
          was.state = hen.state;
        }
      }
    },
    // Le point touché, en pour cent de l'enclos
    pointOf(event) {
      const r = this.$refs.arena.getBoundingClientRect();
      return { x: ((event.clientX - r.left) / r.width) * 100, y: ((event.clientY - r.top) / r.height) * 100 };
    },
    // Un toucher au sable : du grain (pendant l'ouverture, il lance la chasse)
    onArena(event) {
      if (this.phase === 'intro') this.start();
      if (this.phase !== 'play') return;
      if (throwGrain(this.chase, this.pointOf(event))) {
        this.thrown = true;
        this.hint = false;
        vibrate(4);
      }
    },
    // Un toucher sur une poule : prise si elle picore, sinon elle s'esquive en caquetant (plumes, « Cot ! »)
    onHen(id, event) {
      if (this.phase === 'intro') this.start();
      if (this.phase !== 'play') return;
      const hen = this.chase.hens.find(h => h.id === id);
      const where = { x: hen.x, y: hen.y };
      const done = tapHen(this.chase, id, this.pointOf(event));
      const born = this.chase.time;
      if (done === 'caught') {
        vibrate([10, 30, 14]);
        this.caughtCount = this.chase.caught.length;
        this.card = { id, name: this.names.get(id), line: T.cards[id] || '', born };
        this.live = `${this.names.get(id)} est prise.`;
        this.$emit('caught', id);
        return;
      }
      if (done !== 'dodge') return;
      vibrate(8);
      const text = T.squawk[Math.floor(Math.random() * T.squawk.length)];
      this.squawks = [...this.squawks, { key: `${id}:${born}`, x: where.x, y: where.y - 14, text }];
      this.feathers = [...this.feathers, ...[0, 1, 2, 3].map(k => ({ key: `${id}:${born}:${k}`, x: where.x, y: where.y - 6, dx: (k - 1.5) * 14, dy: -18 - k * 6, r: k * 70 - 90 }))];
      this.live = `${this.names.get(id)} s’esquive.`;
    },
    // Une plume ou un « Cot ! » a fini son vol (leur animation CSS) : il s'en va
    drop(list, key) {
      this[list] = this[list].filter(item => item.key !== key);
    }
  }
};
</script>

<style scoped src="./HenChase.css"></style>
