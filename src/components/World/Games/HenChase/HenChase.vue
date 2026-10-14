<template>
  <SceneCard
    class="chase"
    :title="T.title"
    :eyebrow="`Marcelle · ${caughtCount} / ${total}`"
    :later="phase !== 'end' ? T.later : ''"
    :rule="T.rule"
    speaker="Marcelle"
    :face="face"
    :say="phase === 'intro' ? T.open : phase === 'end' ? T.end : ''"
    :action="phase === 'intro' ? T.go : T.next"
    :live="live"
    @later="$emit('close')"
    @act="phase === 'intro' ? start() : $emit('close')"
  >
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
      <!-- Les effets (game/stage) : plumes, étoiles et mots, par-dessus les poules -->
      <canvas ref="fx" class="chase__fx" aria-hidden="true"></canvas>
      <!-- Pas encore de grain lancé : la main montre le sable -->
      <span v-if="hint" class="chase__hint" aria-hidden="true"><span class="chase__ring"></span>{{ T.hint }}</span>
      <!-- La carte de la poule prise -->
      <transition name="chase-card">
        <p v-if="card" :key="card.id" class="chase__taken" role="status"><strong>{{ card.name }}</strong> — {{ card.line }}</p>
      </transition>
    </div>
  </SceneCard>
</template>

<script>
import { guide } from '@/game/guide';
import { vibrate, reducedMotion } from '@/utils/fx';
import { bubbleFace } from '@/world/faces';
import { chaseOf, stepChase, throwGrain, tapHen, caughtAt, chaseDone, CAGE, CATCH } from '@/game/henChase';
import { HEN_CHASE as T } from '@/texts/tutorial/henChase';
import { createStage } from '@/game/stage/stage';
import { CATCH_WORDS, HOME_WORD, FEATHERS, STARS, FILLS, nth } from '@/game/henFx';
import SceneCard from '../SceneCard/SceneCard.vue';

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

// La chasse aux poules de Marcelle (choix de l'auteur, 13 oct. : une scène à part, fluide) : plein écran. hens : les
// poules encore échappées ([{ id, name }], lues une fois : une prise ne les retire pas en cours de partie) ; built : les
// bâtiments fondés (Marcelle naufragée ou non). Émet caught (id) à chaque prise, close à la fin ou pour plus tard.
// Fluidité : la course se calcule et se pose à chaque image directement sur les éléments (translate3d, composée par le
// GPU) ; Vue ne redessine qu'aux événements (grain, carte, prise). Les plumes, les étoiles et les mots sont dessinés
// sur la scène des mini-jeux (game/stage, game/henFx.js), par-dessus l'enclos
export default {
  name: 'HenChase',
  props: {
    hens: { type: Array, required: true },
    built: { type: Array, default: () => [] }
  },
  components: { SceneCard },
  emits: ['caught', 'close'],
  data() {
    return { T, CAGE_ART, GRAIN_ART, DECOR, SCATTER, FRAMES, FRAME_ART, CAGE_AT: CAGE, phase: 'intro', grains: [], card: null, live: '', caughtCount: 0, hint: false };
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
    this.fx = createStage(this.$refs.fx, () => false, { reduced: this.reduced });
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
    this.fx && this.fx.destroy();
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
          this.celebrate();
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
        this.burst(where, 'catch');
        vibrate([10, 30, 14]);
        this.caughtCount = this.chase.caught.length;
        this.card = { id, name: this.names.get(id), line: T.cards[id] || '', born };
        this.live = `${this.names.get(id)} est prise.`;
        this.$emit('caught', id);
        return;
      }
      if (done !== 'dodge') return;
      vibrate(8);
      this.burst(where, 'squawk', T.squawk[Math.floor(Math.random() * T.squawk.length)]);
      this.live = `${this.names.get(id)} s’esquive.`;
    },
    // Les effets d'une poule (where : son point, en pour cent) : elle s'esquive (des plumes, son « Cot ! ») ou elle est
    // prise (des plumes, des étoiles, « Hop ! »)
    burst(where, kind, squawk) {
      const { w, h } = this.size;
      if (!w) return;
      const x = (where.x / 100) * w, y = (where.y / 100) * h - 40;
      this.fx.particles.burst(x, y, { n: kind === 'catch' ? 7 : 5, shape: 'leaf', colors: FEATHERS, speed: [40, 120], angle: -Math.PI / 2, spread: Math.PI * 1.4, size: [4, 7], gravity: 90, drag: 2.2, spin: 8, life: [700, 1100] });
      if (kind === 'catch') {
        this.caughtWords = (this.caughtWords || 0) + 1;
        this.fx.particles.burst(x, y, { n: 10, shape: 'star', colors: STARS, speed: [70, 170], size: [3, 6], gravity: 60, life: [600, 1000] });
        this.fx.texts.add({ text: nth(CATCH_WORDS, this.caughtWords - 1), x, y: y - 34, size: 26, fill: FILLS.catch, look: 'word', tilt: (Math.random() - 0.5) * 0.25, life: 1000, rise: 22 });
        this.fx.shake(3);
      } else this.fx.texts.add({ text: squawk, x, y: y - 30, size: 20, fill: FILLS.squawk, look: 'word', tilt: (Math.random() - 0.5) * 0.35, life: 850, rise: 26 });
      this.fx.wake();
    },
    // Toutes au nid : le mot de la fin, des rayons, une gerbe d'étoiles
    celebrate() {
      const { w, h } = this.size;
      if (!w) return;
      this.fx.texts.add({ text: HOME_WORD, x: w / 2, y: h * 0.42, size: 40, fill: FILLS.home, font: 'display', look: 'label', rays: true, delay: 250, life: 1800, rise: 14 });
      this.fx.particles.burst(w / 2, h * 0.42, { n: 22, shape: 'star', colors: STARS, speed: [120, 280], size: [3, 7], gravity: 80, life: [800, 1300] });
      this.fx.flash('rgba(255, 244, 205, 1)', 300);
    }
  }
};
</script>

<style scoped src="./HenChase.css"></style>
