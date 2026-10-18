<template>
  <SceneCard
    class="cook"
    :title="T.title"
    :eyebrow="eyebrow"
    :later="phase !== 'fin' && !paying ? T.later : ''"
    :rule="T.rule[phase] || ''"
    speaker="Agathe"
    :face="face"
    :say="phase === 'intro' ? T.open : phase === 'fin' ? T.end : ''"
    :action="phase === 'intro' ? T.go : T.next"
    :live="live"
    @later="$emit('close')"
    @act="phase === 'intro' ? start() : $emit('close')"
  >
    <!-- Le coin cuisine d’Agathe, au soir, au feu : elle, sa marmite, la planche ; tout ce qui bouge se dessine sur la
         scène (cookScene.js). Les boutons, transparents, sont les prises du doigt (et du clavier) sur chaque pièce -->
    <div ref="arena" :class="['cook__arena', { 'is-hot': hot }]" :data-phase="phase">
      <!-- Le feu sous la marmite (la bibliothèque : ses trois images en boucle), la vapeur et les bulles de la soupe
           chaude : le compositeur les anime, la scène n'a pas à se repeindre -->
      <span class="cook__fire" aria-hidden="true"><img v-for="(src, i) in FIRE" :key="i" :src="src" :style="{ '--i': i }" alt="" draggable="false" /></span>
      <span :key="pose" :class="['cook__cannelle', `is-n${cannelleArt.length}`, { 'is-playing': playing }]" aria-hidden="true">
        <img v-for="(src, i) in cannelleArt" :key="i" :src="src" :style="{ '--i': i }" alt="" draggable="false" />
      </span>
      <canvas ref="fx" class="cook__fx" aria-hidden="true"></canvas>
      <span v-if="hot" class="cook__bubbles" aria-hidden="true"><i v-for="k in 4" :key="k" :style="{ '--k': k }"></i></span>
      <span v-if="hot" class="cook__steam" aria-hidden="true"><i v-for="k in 3" :key="k" :style="{ '--k': k }"></i></span>

      <!-- La marmite : on y touille (le doigt tourne autour de son centre) ; au clavier, un appui fait un tour -->
      <button
        type="button"
        :class="['cook__hit', 'cook__pot', { 'is-stirring': stirring }]"
        :aria-label="phase === 'touiller' ? T.rule.touiller : T.title"
        @pointerdown="onPotDown"
        @pointermove="onPotMove"
        @pointerup="onPotUp"
        @pointercancel="onPotUp"
        @click="onPotKey"
      ></button>

      <!-- La planche : le seau d'eau de mer, puis les ingrédients ; chacun se glisse (ou se touche) jusqu'à la marmite -->
      <button
        v-for="piece in plank"
        :key="piece.id"
        type="button"
        :class="['cook__hit', 'cook__piece', `cook__piece--${piece.id}`]"
        :style="box(piece.box)"
        :aria-label="piece.id === 'seau' ? T.rule.verser : T.items[piece.id]"
        @pointerdown="onHold(piece.id, $event)"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onCancel"
        @click="onPieceKey(piece.id, $event)"
      >
        <span class="cook__name">{{ T.items[piece.id === 'seau' ? 'eau' : piece.id] }}</span>
      </button>

      <!-- Au service : la louche, dans la marmite, se tient au-dessus du bol -->
      <button
        v-if="phase === 'servir'"
        type="button"
        :class="['cook__hit', 'cook__ladle']"
        :style="box(LADLE_BOX)"
        :disabled="paying && !holding"
        :aria-label="T.rule.servir"
        @pointerdown="onHold('louche', $event)"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onCancel"
        @click="onLadleKey"
      ></button>

      <!-- La fin : les trois étoiles, gagnées ou non (jamais un échec) -->
      <ul v-if="phase === 'fin' && stars" class="cook__stars">
        <li v-for="(won, key, i) in stars" :key="key" :class="{ 'is-won': won }" :style="{ '--i': i }">
          <span class="cook__star" aria-hidden="true">★</span>{{ T.stars[key] }}
        </li>
      </ul>

      <!-- Rien fait depuis un moment : la main montre le geste -->
      <span v-if="hint && hintAt" :class="['cook__hint', `is-${phase}`]" :style="at(hintAt)" aria-hidden="true"><span class="cook__ring"></span>{{ T.hint[phase] }}</span>
    </div>
  </SceneCard>
</template>

<script>
import { guide } from '@/game/guide';
import { vibrate, reducedMotion } from '@/utils/fx';
import { bubbleFace } from '@/world/faces';
import {
  potOf, overPot, pour, setDown, pourAll, addItem, inPot, stir, lift, stirOnce, overBowl, dip, fill, letGo, serve, starsOf,
  ITEMS, TURNS, POT
} from '@/game/cooking';
import { COOKING as T } from '@/texts/tutorial/cooking';
import { IN_WORDS, SERVE_WORD, END_WORD, LINE_WORD, OVER_WORD, SPILL_WORD, STARS, FILLS, stirWord, soupAt } from '@/game/cookFx';
import { createCookScene, REST, LADLE_REST } from './cookScene';
import SceneCard from '../SceneCard/SceneCard.vue';

// Agathe, naufragée puis cuisinière (la bibliothèque) : ses poses de la scène (elle salue, tend les mains vers les
// ingrédients, touille, applaudit) et ses expressions en pied, louche en main (contente, rieuse, surprise, gênée)
const CANNELLE = import.meta.glob('/design/bibliotheque/svg/personnages/{maitres/cannelle/cannelle,naufrages/cannelle/cannelle-naufrage}_{face_louche,face_salut,face_mains-tendues,face_applaudir,expr_content,expr_rire,expr_surpris,expr_gene}_[1-4].svg', { query: '?url', import: 'default', eager: true });
// Les images d'une pose (pose : 'face_salut', 'expr_rire'…), dans l'ordre
const cannelleOf = (castaway, pose) => Object.keys(CANNELLE).filter(path => path.includes(`${castaway ? 'cannelle-naufrage' : '/cannelle'}_${pose}_`)).sort().map(path => CANNELLE[path]);
// Le feu sous la marmite : ses trois images (minijeux.json : suites.feu, 110 ms chacune)
const FIRE = Object.values(import.meta.glob('/design/bibliotheque/svg/minijeux/cuisine/feu_[1-3].svg', { query: '?url', import: 'default', eager: true }));
// Une réaction d’Agathe dure MOOD_MS, puis elle reprend la pose du moment
const MOOD_MS = 1300;
// Les prises du doigt sur la planche et la louche (unités de la largeur : x, y, le coin ; w, h)
const BOXES = { seau: { x: 8, y: 89, w: 24, h: 30 }, coquillages: { x: 38, y: 98, w: 24, h: 21 }, algues: { x: 67, y: 91, w: 22, h: 28 } };
const LADLE_BOX = { x: 58, y: 34, w: 16, h: 26 };
// La marmite : son anneau pour touiller (unités : le rayon où le doigt compte un tour, game/cooking.js : stir)
const STIR_R = 19;
// Un toucher sans glisser (px) ; la main revient après HINT_MS sans geste
const SLOP = 8;
const HINT_MS = 4000;
// Le seau et la louche se penchent jusqu'à tant (rad), et versent au-delà de tant ; un ingrédient tombe en FALL_MS,
// une pièce lâchée revient à sa place en BACK_MS
const BUCKET_TILT = 1.25;
const BUCKET_POURS = 0.9;
const LADLE_TILT = 0.95;
const LADLE_POURS = 0.6;
const FALL_MS = 420;
const BACK_MS = 240;
// Des gouttes là où tombe un filet, toutes les tant de ms
const DRIP_MS = 90;

// La marmite d’Agathe (choix de l'auteur, 13 oct. : B4 ; refaite le 18 oct. : quatre gestes vivants, cadre de la
// Récolte au coin du feu) : plein écran. built : les bâtiments fondés (Agathe naufragée ou non) ; pay : () =>
// Promise<boolean>, la soupe payée au serveur quand la louche commence à verser dans le bol (le besoin « Manger »
// d’Agathe). Émet close à la fin ou pour plus tard. Le jeu avance à chaque image de la scène (cookScene.js : frame) ;
// Vue ne suit que les changements de temps
export default {
  name: 'CookingPot',
  props: {
    built: { type: Array, default: () => [] },
    pay: { type: Function, required: true }
  },
  components: { SceneCard },
  emits: ['close'],
  data() {
    return { T, LADLE_BOX, FIRE, phase: 'intro', added: [], turns: 0, stirring: false, holding: null, paying: false, hint: false, live: '', mood: null, stars: null };
  },
  computed: {
    castaway() {
      return !this.built.includes('foyer');
    },
    // La pose du moment : une réaction passagère (mood) l'emporte ; à la fin, elle applaudit
    pose() {
      if (this.phase === 'fin') return 'face_applaudir';
      if (this.mood) return this.mood;
      if (this.phase === 'intro') return 'face_salut';
      if (this.phase === 'verser' || this.phase === 'jeter') return 'face_mains-tendues';
      if (this.phase === 'touiller') return 'face_louche';
      return 'expr_content';
    },
    cannelleArt() {
      return cannelleOf(this.castaway, this.pose);
    },
    // (la louche ne tourne que quand on touille ; les autres poses vivent toujours)
    playing() {
      return this.pose !== 'face_louche' || this.stirring;
    },
    face() {
      return bubbleFace('foyer', { castaway: this.castaway, mood: this.phase === 'fin' ? 'malicieux' : 'determine' });
    },
    // La soupe chauffe : elle fume et frémit
    hot() {
      return this.turns >= 1 || this.phase === 'servir' || this.phase === 'fin';
    },
    eyebrow() {
      if (this.phase === 'touiller') return T.turn(this.turns, TURNS);
      if (this.phase === 'servir' || this.phase === 'fin') return T.serve;
      if (this.phase === 'jeter') return T.count(this.added.length, ITEMS.length);
      return T.water;
    },
    // Les prises de la planche à ce temps-ci : le seau pour verser, puis les ingrédients pas encore jetés
    plank() {
      if (this.phase === 'verser' || this.phase === 'intro') return [{ id: 'seau', box: BOXES.seau }];
      if (this.phase === 'jeter') return ITEMS.filter(id => !this.added.includes(id)).map(id => ({ id, box: BOXES[id] }));
      return [];
    },
    // Où la main montre le geste
    hintAt() {
      if (this.phase === 'verser') return REST.seau;
      if (this.phase === 'jeter') return REST[ITEMS.find(id => !this.added.includes(id))];
      if (this.phase === 'touiller') return POT;
      if (this.phase === 'servir') return LADLE_REST;
      return null;
    }
  },
  watch: {
    // (un temps qui change redessine la scène : elle dort quand rien ne bouge)
    phase() {
      if (this.fx) this.fx.wake();
    }
  },
  created() {
    this.pot = potOf();
    this.reduced = reducedMotion();
    // (non réactifs, lus par la scène à chaque image : ce que tient le doigt, ce qui tombe, ce qui revient, la louche,
    // la traînée du doigt qui touille)
    this.hold = null;
    this.falling = [];
    this.back = [];
    this.ladle = { ...LADLE_REST, tilt: 0, rest: true, from: null, at: 0 };
    this.points = [];
    this.flow = null;
    this.dripAt = 0;
    this.payState = null;
    this.payBlocked = false;
    this.overSaid = false;
    this.poured = false;
    this.served = false;
    this.stirId = null;
    this.hintTimer = 0;
    this.moodTimer = 0;
    this.alive = true;
  },
  mounted() {
    // (pendant la marmite, ni Brume ni les aides ne parlent par-dessus : game/guide.js, hold)
    this.release = guide.hold();
    // (toutes les images d’Agathe, chargées et décodées d'avance : une pose qui change ne laisse pas de trou)
    this.preload = Object.values(CANNELLE).map(src => {
      const img = new Image();
      img.src = src;
      img.decode().catch(() => {});
      return img;
    });
    this.scene = createCookScene(this.$refs.fx, { view: this.viewOf(), frame: dt => this.frame(dt), soup: soupAt(ITEMS.length + TURNS), reduced: this.reduced });
    this.fx = this.scene.stage;
  },
  beforeUnmount() {
    this.alive = false;
    clearTimeout(this.hintTimer);
    clearTimeout(this.moodTimer);
    this.release && this.release();
    this.scene && this.scene.destroy();
  },
  methods: {
    // Une place de l'aire de jeu (unités) en style ; une prise (x, y, w, h) en style
    at(p) {
      return { left: `${p.x}%`, top: `${p.y / 1.25}%` };
    },
    box(b) {
      return { left: `${b.x}%`, top: `${b.y / 1.25}%`, width: `${b.w}%`, height: `${b.h / 1.25}%` };
    },
    start() {
      this.phase = this.pot.phase;
      this.armHint();
    },
    // La main revient si rien ne se passe pendant HINT_MS
    armHint() {
      clearTimeout(this.hintTimer);
      this.hint = false;
      if (['verser', 'jeter', 'touiller', 'servir'].includes(this.phase)) this.hintTimer = setTimeout(() => { this.hint = true; }, HINT_MS);
    },
    quiet() {
      clearTimeout(this.hintTimer);
      this.hint = false;
    },
    // Le point du doigt, en unités de l'aire de jeu (rect : l'aire de jeu, lue au début du geste)
    unitOf(event, rect) {
      return { x: ((event.clientX - rect.left) / rect.width) * 100, y: ((event.clientY - rect.top) / rect.width) * 100 };
    },
    // Agathe réagit un instant (une de ses expressions, 'expr_rire'…), puis reprend la pose du moment
    react(mood) {
      this.mood = mood;
      clearTimeout(this.moodTimer);
      this.moodTimer = setTimeout(() => { this.mood = null; }, MOOD_MS);
    },
    // Ce que montre la scène (cookScene.js), lu à chaque image
    viewOf() {
      const pot = this.pot;
      return {
        level: () => pot.level,
        hot: () => pot.turns >= 1 || pot.phase === 'servir' || pot.phase === 'fin',
        soup: () => soupAt(pot.added.length + pot.turns),
        swirl: () => ['touiller', 'servir', 'fin'].includes(pot.phase),
        angle: () => pot.angle,
        line: () => pot.phase === 'verser',
        floating: () => pot.added.filter(id => !this.falling.some(f => f.id === id)).map((id, i) => ({ id, a: 0.6 + i * Math.PI })),
        pieces: () => this.piecesNow(),
        held: () => (this.hold && this.hold.kind !== 'louche' ? { id: this.hold.id, x: this.hold.at.x, y: this.hold.at.y, tilt: this.hold.tilt } : null),
        falling: () => this.falling,
        bowl: () => (pot.phase === 'servir' || pot.phase === 'fin' ? { fill: pot.bowl } : null),
        ladle: () => (pot.phase === 'servir' || pot.phase === 'fin' ? this.ladleNow() : null),
        pour: () => this.flow,
        trail: () => this.points
      };
    },
    // Les pièces posées sur la planche (celles qu'on ne tient pas, et ne sont pas déjà dans la marmite) ; une pièce
    // lâchée revient à sa place en glissant (moving : la scène la dessine à chaque image, hors de son calque)
    piecesNow() {
      const now = performance.now();
      const ids = ['seau', ...ITEMS.filter(id => !this.pot.added.includes(id))];
      return ids.filter(id => !(this.hold && this.hold.id === id)).map(id => {
        const back = this.back.find(b => b.id === id);
        if (!back) return { id, ...REST[id], moving: false };
        const a = Math.min(1, (now - back.at) / BACK_MS);
        const e = 1 - (1 - a) ** 3;
        return { id, x: back.from.x + (REST[id].x - back.from.x) * e, y: back.from.y + (REST[id].y - back.from.y) * e, tilt: back.tilt * (1 - e), moving: true };
      });
    },
    // La louche : tenue (sa place, son penché), revenant à la marmite, ou au repos
    ladleNow() {
      const l = this.ladle;
      const full = this.pot.ladle > 0;
      if (this.hold && this.hold.kind === 'louche') return { x: this.hold.at.x, y: this.hold.at.y, tilt: this.hold.tilt, full, rest: false };
      if (l.from) {
        const a = Math.min(1, (performance.now() - l.at) / BACK_MS);
        if (a < 1) {
          const e = 1 - (1 - a) ** 3;
          return { x: l.from.x + (LADLE_REST.x - l.from.x) * e, y: l.from.y + (LADLE_REST.y - l.from.y) * e, tilt: l.tilt * (1 - e), full, rest: false };
        }
        l.from = null;
      }
      return { ...LADLE_REST, tilt: 0, full, rest: true };
    },

    /* ---------- À chaque image : le seau et la louche versent ---------- */
    frame(dt) {
      const s = dt / 1000;
      const now = performance.now();
      const h = this.hold;
      this.flow = null;
      // (ce qui est tombé dans la marmite : plouf, puis il flotte ; ce qui est revenu à sa place)
      if (this.falling.length) {
        const landed = this.falling.filter(f => now - f.at >= f.ms);
        if (landed.length) {
          this.falling = this.falling.filter(f => now - f.at < f.ms);
          landed.forEach(f => this.fxLand(f));
        }
      }
      if (this.back.length) this.back = this.back.filter(b => now - b.at < BACK_MS);
      if (this.points.length) this.points = this.points.filter(p => now - p.t < 500);
      if (h && (h.kind === 'seau' || h.kind === 'louche')) {
        const over = h.kind === 'seau' ? overPot(h.at) : overBowl(h.at);
        const target = !over ? 0 : h.kind === 'seau' ? (h.at.x > POT.x ? -BUCKET_TILT : BUCKET_TILT) : -LADLE_TILT;
        h.tilt += (target - h.tilt) * Math.min(1, s * 10);
        if (h.kind === 'seau' && over && Math.abs(h.tilt) > BUCKET_POURS) this.pourWater(s, now);
        if (h.kind === 'louche' && over && Math.abs(h.tilt) > LADLE_POURS) this.pourSoup(s, now);
      }
      return Boolean(h || this.falling.length || this.back.length || this.points.length || this.ladle.from);
    },
    // Le seau verse : l'eau monte ; la première fois, son bruit ; pleine, elle déborde
    pourWater(s, now) {
      const pot = this.pot;
      const r = pour(pot, s);
      const lip = this.scene.bucketLip(this.hold.at, this.hold.tilt);
      const surf = this.scene.surface(pot.level);
      const m = this.scene.mouth();
      const to = { x: Math.max(m.x - m.rx * 0.7, Math.min(m.x + m.rx * 0.7, lip.x)), y: surf.y };
      this.flow = { from: lip, to, color: soupAt(0), width: 1.5 };
      if (!this.poured) {
        this.poured = true;
        this.word(IN_WORDS.eau, m, FILLS.in);
        vibrate(8);
      }
      if (r.overflow && !this.overSaid) {
        this.overSaid = true;
        this.react('expr_surpris');
        this.word(OVER_WORD, { x: m.x, y: m.y - 8 }, FILLS.fast);
        vibrate([10, 30, 10]);
      }
      this.drip(to, soupAt(0), now, r.overflow);
    },
    // La louche verse : le bol se remplit (le serveur paie au premier filet ; tant qu'il n'a pas dit oui, le bol attend
    // au bord) ; plein et payé, c'est servi
    pourSoup(s, now) {
      const pot = this.pot;
      if (this.payBlocked || pot.ladle <= 0 || this.served) return;
      if (!this.payState) this.startPay();
      const full = fill(pot, s, this.payState === 'ok');
      const lip = this.scene.ladleLip(this.hold.at, this.hold.tilt);
      const surf = this.scene.bowlSurface(pot.bowl);
      this.flow = { from: lip, to: { x: surf.x - 2, y: surf.y }, color: soupAt(ITEMS.length + TURNS), width: 1.1 };
      this.drip(this.flow.to, this.flow.color, now, false);
      if (full && this.payState === 'ok') this.serveDone();
    },
    // Là où tombe un filet : des gouttes, de temps en temps (et par-dessus le bord, si ça déborde)
    drip(at, color, now, over) {
      if (now - this.dripAt < DRIP_MS || this.reduced) return;
      this.dripAt = now;
      const p = this.scene.px(at);
      const w = this.fx.w / 100;
      this.fx.particles.burst(p.x, p.y, { n: over ? 5 : 3, shape: 'drop', colors: [color, color, '#FFFFFF'], speed: [w * 6, w * (over ? 22 : 12)], angle: -Math.PI / 2, spread: over ? Math.PI * 1.4 : Math.PI * 0.8, size: [w * 0.4, w * 0.8], gravity: w * 90, life: [260, 420] });
    },

    /* ---------- Tenir : le seau, un ingrédient, la louche ---------- */
    onHold(id, event) {
      if (this.phase === 'intro') this.start();
      const ok = (id === 'seau' && this.phase === 'verser') || (ITEMS.includes(id) && this.phase === 'jeter') || (id === 'louche' && this.phase === 'servir' && !this.served);
      if (this.hold || !ok) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      const rect = this.$refs.arena.getBoundingClientRect();
      const p = this.unitOf(event, rect);
      const home = id === 'louche' ? LADLE_REST : REST[id];
      this.hold = { kind: id === 'louche' ? 'louche' : id === 'seau' ? 'seau' : 'item', id, rect, pointer: event.pointerId, x0: event.clientX, y0: event.clientY, moved: false, off: { x: home.x - p.x, y: home.y - p.y }, at: { ...home }, tilt: 0 };
      this.back = this.back.filter(b => b.id !== id);
      this.holding = id;
      this.overSaid = false;
      this.quiet();
      // (la louche plonge : elle se remplit)
      if (id === 'louche') {
        this.payBlocked = false;
        this.ladle.from = null;
        if (dip(this.pot)) this.fxDip();
      }
      this.fx.wake();
    },
    onMove(event) {
      const h = this.hold;
      if (!h || event.pointerId !== h.pointer) return;
      if (!h.moved && Math.hypot(event.clientX - h.x0, event.clientY - h.y0) < SLOP) return;
      h.moved = true;
      const p = this.unitOf(event, h.rect);
      h.at = { x: p.x + h.off.x, y: p.y + h.off.y };
      this.fx.wake();
    },
    // Lâché : le seau reposé (assez d'eau : on passe aux ingrédients), l'ingrédient dans la marmite (ou touché sans
    // glisser), la louche (hors du bol, pleine : elle se renverse). Le reste revient à sa place
    onUp(event) {
      const h = this.hold;
      if (!h || event.pointerId !== h.pointer) return;
      this.hold = null;
      this.holding = null;
      if (h.kind === 'seau') {
        this.home(h);
        if (setDown(this.pot)) this.waterDone();
      } else if (h.kind === 'item') {
        if (!h.moved || inPot(h.at)) this.putIn(h.id, h.moved ? h.at : REST[h.id]);
        else this.home(h);
      } else {
        const onBowl = overBowl(h.at);
        if (!this.served && letGo(this.pot, onBowl)) this.fxSpill(h.at);
        this.ladle = { ...LADLE_REST, tilt: h.tilt, rest: false, from: { ...h.at }, at: performance.now() };
      }
      this.armHint();
      this.fx.wake();
    },
    onCancel(event) {
      const h = this.hold;
      if (!h || event.pointerId !== h.pointer) return;
      this.hold = null;
      this.holding = null;
      if (h.kind === 'louche') {
        letGo(this.pot, true);
        this.ladle = { ...LADLE_REST, tilt: h.tilt, rest: false, from: { ...h.at }, at: performance.now() };
      } else this.home(h);
      this.armHint();
    },
    // Une pièce lâchée revient à sa place, en glissant
    home(h) {
      if (h.moved) this.back.push({ id: h.id, from: { ...h.at }, tilt: h.tilt, at: performance.now() });
    },
    // Au clavier (un clic sans pointeur) : le seau verse juste au trait, l'ingrédient tombe
    onPieceKey(id, event) {
      if (event.detail !== 0) return;
      if (this.phase === 'intro') this.start();
      if (id === 'seau' && pourAll(this.pot)) this.waterDone();
      else if (ITEMS.includes(id) && this.phase === 'jeter') this.putIn(id, REST[id]);
    },
    // Au clavier : la louche plonge et sert d'un coup (une fois la soupe payée)
    async onLadleKey(event) {
      if (event.detail !== 0 || this.phase !== 'servir' || this.paying) return;
      dip(this.pot);
      const ok = this.payState === 'ok' || (await this.startPay());
      if (!ok || !this.alive) return;
      fill(this.pot, 10, true);
      this.serveDone();
    },

    /* ---------- Les temps du jeu ---------- */
    // L'eau est versée : au trait, une étoile et Agathe rit ; puis les ingrédients
    waterDone() {
      const m = this.scene.mouth();
      if (this.pot.line) {
        this.word(LINE_WORD, { x: m.x, y: m.y - 9 }, FILLS.stir, true);
        this.stars3(m);
        this.react('expr_rire');
        vibrate([8, 30, 12]);
      } else this.react('expr_content');
      this.live = T.rule.jeter;
      this.phase = this.pot.phase;
      this.armHint();
    },
    // Un ingrédient tombe dans la marmite depuis from (là où on l'a lâché, ou sa place sur la planche)
    putIn(id, from) {
      if (!addItem(this.pot, id)) return;
      this.added = [...this.pot.added];
      this.falling.push({ id, from: { ...from }, dx: (ITEMS.indexOf(id) - 0.5) * 6, at: performance.now(), ms: this.reduced ? 1 : FALL_MS });
      vibrate(10);
      this.react(this.added.length === ITEMS.length ? 'expr_rire' : 'expr_content');
      this.live = `${T.items[id]} : ${T.plouf}`;
      this.phase = this.pot.phase;
      this.armHint();
      this.fx.wake();
    },

    /* ---------- Touiller : le doigt tourne autour du centre de la marmite ---------- */
    potPoint(event) {
      const p = this.unitOf(event, this.potRect);
      const m = this.scene.mouth();
      return { unit: p, ring: { x: (p.x - m.x) / STIR_R, y: (p.y - m.y) / STIR_R } };
    },
    onPotDown(event) {
      if (this.phase === 'intro') this.start();
      if (this.phase !== 'touiller' || this.stirId !== null) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      this.potRect = this.$refs.arena.getBoundingClientRect();
      this.stirId = event.pointerId;
      this.stirring = true;
      this.quiet();
      const { unit, ring } = this.potPoint(event);
      this.points.push({ ...unit, t: performance.now() });
      stir(this.pot, ring, event.timeStamp / 1000);
      this.fx.wake();
    },
    onPotMove(event) {
      if (event.pointerId !== this.stirId) return;
      const { unit, ring } = this.potPoint(event);
      this.points.push({ ...unit, t: performance.now() });
      const { turned, splash } = stir(this.pot, ring, event.timeStamp / 1000);
      if (splash) {
        vibrate(6);
        this.react('expr_surpris');
        const m = this.scene.mouth();
        this.splash(m, 10, Math.PI * 1.3);
        this.word(T.fast, { x: m.x, y: m.y - 9 }, FILLS.fast);
      }
      if (turned) this.turnDone();
      this.fx.wake();
    },
    onPotUp(event) {
      if (event.pointerId !== this.stirId) return;
      this.stirId = null;
      this.stirring = false;
      lift(this.pot);
      this.armHint();
    },
    // Au clavier : un tour par appui
    onPotKey(event) {
      if (event.detail !== 0) return;
      if (this.phase === 'intro') this.start();
      if (stirOnce(this.pot)) this.turnDone();
    },
    // Un tour de plus : des bulles montent ; le dernier ouvre le service
    turnDone() {
      this.turns = this.pot.turns;
      vibrate(8);
      this.fxTurn();
      this.live = T.turn(this.turns, TURNS);
      if (this.pot.phase !== this.phase) {
        this.phase = this.pot.phase;
        this.stirring = false;
        this.stirId = null;
        this.live = T.rule.servir;
        this.react('expr_rire');
      }
      this.armHint();
    },

    /* ---------- Servir : la soupe se paie au serveur au premier filet ---------- */
    // Rend vrai si c'est payé ; un refus arrête la louche (Agathe est gênée), elle replongera
    async startPay() {
      if (this.payState) return this.payState === 'ok';
      this.payState = 'pending';
      this.paying = true;
      const ok = await this.pay();
      if (!this.alive) return false;
      this.paying = false;
      this.payState = ok ? 'ok' : null;
      if (!ok) {
        this.payBlocked = true;
        this.react('expr_gene');
        this.armHint();
      } else this.fxServe();
      return ok;
    },
    // Le bol est plein et payé : c'est servi
    serveDone() {
      if (this.served || !serve(this.pot)) return;
      this.served = true;
      // (la louche qu'on tenait revient à la marmite)
      const h = this.hold;
      if (h && h.kind === 'louche') this.ladle = { ...LADLE_REST, tilt: h.tilt, rest: false, from: { ...h.at }, at: performance.now() };
      this.hold = null;
      this.holding = null;
      this.stars = starsOf(this.pot);
      this.phase = this.pot.phase;
      this.quiet();
      vibrate([10, 40, 10, 40, 16]);
      this.live = T.end;
      this.fxEnd();
    },

    /* ---------- Le spectacle (game/cookFx.js) ---------- */
    // Un mot qui claque en p (unités) ; big : le grand mot, dans un halo à rayons
    word(text, p, fill, big = false) {
      const q = this.scene.px(p);
      if (big) this.fx.texts.add({ text, x: q.x, y: q.y, size: 30, fill, font: 'display', look: 'label', rays: true, life: 1400, rise: 16 });
      else this.fx.texts.add({ text, x: q.x, y: q.y, size: 22, fill, look: 'word', tilt: (Math.random() - 0.5) * 0.3, life: 950, rise: 20 });
      this.fx.wake();
    },
    stars3(p, n = 12) {
      const q = this.scene.px(p);
      const w = this.fx.w / 100;
      this.fx.particles.burst(q.x, q.y, { n, shape: 'star', colors: STARS, speed: [w * 30, w * 70], size: [w * 0.8, w * 1.6], gravity: w * 20, life: [700, 1100] });
    },
    // Des gouttes de bouillon qui giclent de la marmite (spread : leur éventail ; n : combien)
    splash(m, n, spread) {
      const q = this.scene.px(m);
      const w = this.fx.w / 100;
      const color = soupAt(this.pot.added.length + this.pot.turns);
      this.fx.particles.burst(q.x, q.y, { n, shape: 'drop', colors: [color, color, '#FFFFFF'], speed: [w * 15, w * 35], angle: -Math.PI / 2, spread, size: [w * 0.6, w * 1.2], gravity: w * 80, life: [450, 750] });
    },
    // Un ingrédient touche le bouillon : une onde, des gouttes, son bruit
    fxLand(f) {
      const m = this.scene.mouth();
      const p = this.scene.px({ x: m.x + f.dx, y: this.scene.surface(this.pot.level).y });
      const w = this.fx.w / 100;
      this.fx.particles.burst(p.x, p.y, { n: 1, shape: 'ring', colors: ['#FFFFFF'], speed: [0, 0], size: [w * 1.6, w * 1.6], size1: 3, gravity: 0, spin: 0, life: [480, 480], fade: 1 });
      this.splash({ x: m.x + f.dx, y: m.y }, 12, Math.PI * 0.9);
      this.word(IN_WORDS[f.id], { x: m.x, y: m.y - 9 }, FILLS.in);
      this.fx.shake(2);
    },
    // La louche plonge : une onde dans la soupe
    fxDip() {
      const p = this.scene.px(LADLE_REST);
      const w = this.fx.w / 100;
      this.fx.particles.burst(p.x, p.y, { n: 1, shape: 'ring', colors: ['#FFFFFF'], speed: [0, 0], size: [w * 1.2, w * 1.2], size1: 2.4, gravity: 0, spin: 0, life: [400, 400], fade: 1 });
    },
    // Un tour de louche : des bulles montent ; au dernier, le bouillon est prêt (son mot dans un halo, des étoiles)
    fxTurn() {
      const m = this.scene.mouth();
      const q = this.scene.px(m);
      const w = this.fx.w / 100;
      const color = soupAt(this.pot.added.length + this.pot.turns);
      this.fx.particles.burst(q.x, q.y, { n: 7, shape: 'bubble', colors: [color, '#FFFFFF'], speed: [w * 5, w * 14], angle: -Math.PI / 2, spread: 1.2, size: [w * 0.8, w * 1.5], size1: 1.3, gravity: -w * 10, drag: 1.5, spin: 0, life: [700, 1100], fade: 0.5 });
      const word = stirWord(this.turns, TURNS);
      if (this.turns < TURNS) {
        this.word(word, { x: m.x, y: m.y - 9 }, FILLS.stir);
        return;
      }
      this.word(word, { x: m.x, y: m.y - 11 }, FILLS.stir, true);
      this.stars3(m, 14);
      this.fx.shake(3);
    },
    // La soupe payée : le bruit du service, au-dessus du bol
    fxServe() {
      this.word(SERVE_WORD, { x: 80, y: 88 }, FILLS.stir);
    },
    // La louche pleine lâchée hors du bol : elle se renverse
    fxSpill(at) {
      const q = this.scene.px(at);
      const w = this.fx.w / 100;
      const color = soupAt(ITEMS.length + TURNS);
      this.fx.particles.burst(q.x, q.y, { n: 12, shape: 'drop', colors: [color, color, '#FFFFFF'], speed: [w * 8, w * 25], angle: Math.PI / 2, spread: Math.PI * 0.9, size: [w * 0.6, w * 1.2], gravity: w * 120, life: [450, 700] });
      this.word(SPILL_WORD, { x: at.x, y: at.y - 8 }, FILLS.fast);
      this.react('expr_gene');
      vibrate([12, 30, 12]);
    },
    // Servi : le grand mot de la fin, des rayons, une gerbe d'étoiles
    fxEnd() {
      const end = { x: 58, y: 30 };
      const q = this.scene.px(end);
      const w = this.fx.w / 100;
      this.fx.texts.add({ text: END_WORD, x: q.x, y: q.y, size: 40, fill: FILLS.end, font: 'display', look: 'label', rays: true, delay: 250, life: 1800, rise: 14 });
      setTimeout(() => {
        if (!this.alive) return;
        this.fx.particles.burst(q.x, q.y, { n: 22, shape: 'star', colors: STARS, speed: [w * 30, w * 70], size: [w * 0.8, w * 1.8], gravity: w * 20, life: [800, 1300] });
        this.fx.flash('rgba(255, 244, 205, 1)', 300);
        this.fx.wake();
      }, this.reduced ? 0 : 250);
    }
  }
};
</script>

<style scoped src="./CookingPot.css"></style>
