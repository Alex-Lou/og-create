<template>
  <GModal sheet eyebrow="Établi · assemblage" :title="T.title(name, count)" :width="460" align="center" @close="$emit('close')">
    <div ref="root" class="puzzle">
      <!-- L'atelier de Nathan, le soir : ses engrenages dans l'ombre, des braises qui montent -->
      <span v-for="g in ['a', 'b', 'c']" :key="`g${g}`" :class="['puzzle__gear', `puzzle__gear--${g}`]" aria-hidden="true"></span>
      <span v-for="k in 5" :key="`e${k}`" class="puzzle__ember" aria-hidden="true"></span>
      <!-- Fabriquée : la poser tout de suite, ou revenir à l'établi -->
      <template v-if="made">
        <span ref="done" class="puzzle__art puzzle__art--done">
          <span class="puzzle__rays" aria-hidden="true"></span>
          <span class="puzzle__burst puzzle__burst--big" aria-hidden="true"><i v-for="k in 12" :key="k" :style="{ '--a': `${k * 30}deg` }"></i></span>
          <img v-if="shownArt" :src="shownArt" alt="" :style="doneStyle" />
        </span>
        <p class="puzzle__done" role="status">{{ count > 1 ? T.madeMany(name, count) : T.made(name) }}</p>
        <div class="puzzle__actions">
          <button type="button" class="world__btn world__btn--quiet puzzle__btn" @click="$emit('close')">Retour à l’établi</button>
          <button type="button" class="world__btn puzzle__btn" data-coach="puzzle-place" @click="$emit('place')">Poser sur l’île</button>
        </div>
      </template>

      <template v-else>
        <p class="puzzle__hint">
          {{ T.hint }}
          <template v-if="run.turned">{{ T.hintTurned }}</template>
          <template v-else>{{ T.hintTurn }}</template>
        </p>

        <!-- Gabarit : ses cases (boutons, pour poser la pièce prise) et les pièces déjà posées -->
        <div ref="board" :class="['puzzle__board', { 'is-welded': welded }]" :style="boardStyle" aria-label="Gabarit">
          <span class="puzzle__ghost-art" aria-hidden="true"><img v-if="shownArt" :src="shownArt" alt="" :style="fitStyle" /></span>
          <span v-for="k in 6" :key="`m${k}`" class="puzzle__mote" aria-hidden="true"></span>
          <button
            v-for="[x, y] in cells"
            :key="`c${x},${y}`"
            type="button"
            :class="['puzzle__cell', { 'is-hint': hinted.has(`${x},${y}`), 'is-bad': refused.has(`${x},${y}`) }]"
            :data-coach="guide && guide.drop && guide.drop[0] === x && guide.drop[1] === y ? 'puzzle-drop' : null"
            :style="at(x, y)"
            :aria-label="`Case ${x + 1}, ${y + 1}${selected !== null ? ' : y poser la pièce prise' : ''}`"
            :disabled="sending"
            @click="dropSelected(x, y)"
          ></button>
          <button
            v-for="step in layout"
            :key="`p${step.piece}:${step.x},${step.y},${step.rot}`"
            type="button"
            class="puzzle__placed"
            :style="{ ...at(step.x, step.y), ...sizeStyle(step.piece, step.rot, CELL) }"
            :aria-label="`Pièce ${step.piece + 1} posée : la reprendre`"
            :disabled="sending"
            @pointerdown="grab($event, step.piece, true)"
            @click="tapPiece(step.piece, true)"
          >
            <PuzzleBits :cells="run.pieces[step.piece]" :rot="step.rot" :home="homeOf(step.piece)" :size="CELL" :art="shownArt" :fit="fit" />
          </button>
          <!-- Rempli : le dessin entier se pose sur les pièces soudées, sans rien de rogné par les creux du gabarit -->
          <span class="puzzle__whole" aria-hidden="true"><img v-if="shownArt" :src="shownArt" alt="" :style="fitStyle" /></span>
        </div>

        <!-- Pièces à poser -->
        <div class="puzzle__tray" aria-label="Pièces à poser">
          <button
            v-for="i in loose"
            :key="`t${i}`"
            type="button"
            :class="['puzzle__piece', { 'is-on': selected === i, 'is-dragged': drag && drag.moved && drag.piece === i, 'is-refused': refusedPiece === i }]"
            :data-coach="guide && guide.piece === i && !guide.drop ? (selected === i ? 'puzzle-turn' : 'puzzle-take') : null"
            :style="sizeStyle(i, rots[i], TRAY)"
            :aria-label="`Pièce ${i + 1} (${run.pieces[i].length} cases)${selected === i ? ', prise : toucher pour la tourner' : ''}`"
            :aria-pressed="String(selected === i)"
            :disabled="sending"
            @pointerdown="grab($event, i, false)"
            @click="tapPiece(i, false)"
          >
            <PuzzleBits :cells="run.pieces[i]" :rot="rots[i]" :home="homeOf(i)" :size="TRAY" :art="shownArt" :fit="fit" />
          </button>
          <p v-if="!loose.length" class="puzzle__full">{{ complete ? T.complete : T.holes }}</p>
        </div>

        <p v-if="error" class="puzzle__error" role="alert">{{ error }}</p>
        <div class="puzzle__actions">
          <button v-if="error" type="button" class="world__btn world__btn--quiet puzzle__btn" :disabled="sending" @click="$emit('restart')">Recommencer</button>
          <button v-else type="button" class="world__btn world__btn--quiet puzzle__btn" :disabled="sending || !layout.length" @click="reset">Tout reprendre</button>
          <button type="button" class="world__btn puzzle__btn" data-coach="puzzle-done" :disabled="sending || !complete || Boolean(error)" @click="$emit('finish', layout.map(s => ({ ...s })))">
            {{ sending ? WAIT : 'Assembler' }}
          </button>
        </div>
      </template>

      <!-- Les étincelles, les copeaux et les mots : sur la scène commune (game/stage), par-dessus, sans toucher au doigt -->
      <canvas ref="fx" class="puzzle__fx" aria-hidden="true"></canvas>
    </div>

    <!-- Pièce qu'on glisse, sous le doigt -->
    <teleport to="body">
      <div v-if="drag && drag.moved" class="puzzle__drag" :style="dragStyle" aria-hidden="true">
        <PuzzleBits :cells="run.pieces[drag.piece]" :rot="rots[drag.piece]" :home="homeOf(drag.piece)" :size="CELL" :art="shownArt" :fit="fit" />
      </div>
    </teleport>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import PuzzleBits from '../PuzzleBits/PuzzleBits.vue';
import { spriteUrl } from '@/world/spriteCache';
import { craftThumb } from '@/world/craftSprites';
import { creationThumb } from '@/world/creations';
import { artBody } from '@/world/artBody';
import { cellsOf, turn, sizeOf, fits, covered, coverOf, solve, homesOf, artFit, artFitStyle } from '@/world/crafts';
import { vibrate, reducedMotion } from '@/utils/fx';
import { createStage } from '@/game/stage/stage';
import { PLACE_WORDS, MISS_WORD, FULL_WORD, MADE_WORD, SPARKS, CHIPS, FILLS, nth } from '@/game/craftFx';
import { CRAFT_PUZZLE as T } from '@/texts/world/screens/workshop';
import { WAIT } from '@/texts/world/screens/island';

const CELL = 44; // taille d'une case du gabarit (px)
const TRAY = 32; // taille d'une case d'une pièce à poser (son morceau du dessin s'y lit)
const DONE_W = 150; // le cadre de la création fabriquée (px)
const DONE_H = 160;
const SLOP = 6; // au-delà, un appui devient un glissement
const REFUSED_MS = 420; // le tremblement d'une pièce qui ne tient pas

// Puzzle d'assemblage d'une création : le gabarit (silhouette de la création) et ses pièces, découpées par le serveur.
// Chaque pièce se glisse (ou se prend puis se pose sur une case) et se tourne d'un quart de tour ; quand le gabarit est
// exactement rempli, « Assembler » envoie la disposition, que le serveur vérifie avant de prendre les ressources.
// Un toucher (souris, doigt, clavier : Entrée) passe par le clic ; l'appui ne sert qu'à commencer un glissement.
// Chaque pièce porte son morceau du dessin de la création (choix de l'auteur, 14 oct. : on reconstitue l'image) : celui
// de sa place dans une solution (crafts.homesOf) ; la pose fait un clac et des étincelles, le gabarit rempli se soude
// (Tadam !), la création assemblée chante (Ziiing !) : leurs mots, game/craftFx.js.
export default {
  name: 'CraftPuzzle',
  components: { GModal, PuzzleBits },
  props: {
    // { id, craft, shape, pieces, turned } (serveur)
    run: { type: Object, required: true },
    name: { type: String, required: true },
    // Combien de pièces cet assemblage fait d'un coup
    count: { type: Number, default: 1 },
    sending: { type: Boolean, default: false },
    error: { type: String, default: '' },
    // Vrai une fois l'assemblage accepté
    made: { type: Boolean, default: false },
    // Au tutoriel : la main montre chaque pièce, son quart de tour et sa case (data-coach : puzzle-take, puzzle-turn,
    // puzzle-drop ; game/prologue.js, la lanterne de Nathan)
    guided: { type: Boolean, default: false }
  },
  emits: ['finish', 'restart', 'place', 'close'],
  data() {
    return {
      T,
      WAIT,
      CELL,
      TRAY,
      rots: this.run.pieces.map(() => 0),
      layout: [],
      selected: null,
      drag: null,
      // Cases surlignées pendant un glissement : là où la pièce tomberait (refused : elle n'y tient pas)
      hinted: new Set(),
      refused: new Set(),
      // La pièce qui tremble
      refusedPiece: null,
      // Le gabarit exactement rempli : un trait de lumière le parcourt, les pièces se fondent en un dessin
      welded: false
    };
  },
  computed: {
    cells() {
      return cellsOf(this.run.shape);
    },
    // Taille du gabarit, en cases
    board() {
      return { w: Math.max(...this.run.shape.map(r => r.length)), h: this.run.shape.length };
    },
    boardStyle() {
      return { width: `${this.board.w * CELL}px`, height: `${this.board.h * CELL}px` };
    },
    // La place de chaque pièce dans une solution : le morceau du dessin qu'elle porte (null : pièces sans dessin)
    homes() {
      return homesOf(this.run.shape, this.run.pieces);
    },
    loose() {
      return this.run.pieces.map((p, i) => i).filter(i => !this.layout.some(s => s.piece === i));
    },
    complete() {
      return covered(this.run.shape, this.run.pieces, this.layout);
    },
    // Guidé : la prochaine pièce à poser (piece) et, prise et bien tournée, la case où toucher (drop : [x, y]) ; la
    // solution part de ce qui est déjà posé (sinon d'un gabarit vide, ce qui est posé de travers se reprend), null sans
    // guide ou tout posé
    guide() {
      if (!this.guided || this.complete) return null;
      const plan = solve(this.run.shape, this.run.pieces, this.layout) || solve(this.run.shape, this.run.pieces);
      const next = plan && plan.find(step => !this.layout.some(s => s.piece === step.piece && s.rot === step.rot && s.x === step.x && s.y === step.y));
      if (!next) return null;
      const ready = this.selected === next.piece && this.rots[next.piece] % 4 === next.rot;
      const [fx, fy] = turn(this.run.pieces[next.piece], next.rot)[0];
      return { piece: next.piece, drop: ready ? [next.x + fx, next.y + fy] : null };
    },
    art() {
      return creationThumb(this.run.craft) ?? spriteUrl(`craft-thumb-${this.run.craft}`, () => craftThumb(this.run.craft));
    },
    // Le dessin, une fois son corps mesuré (avant, rien : il ne se pose pas une fois de travers puis ailleurs)
    shownArt() {
      return artBody(this.art) ? this.art : '';
    },
    // Où se pose le dessin sur le gabarit (en cases) : son corps calé sur le gabarit, son halo et son ombre autour
    fit() {
      return artFit(artBody(this.art), this.board.w, this.board.h);
    },
    // Fabriquée : le dessin dans son cadre (DONE_W × DONE_H px), son corps aussi grand que possible
    doneStyle() {
      return artFitStyle(artBody(this.art), DONE_W, DONE_H);
    },
    fitStyle() {
      const { x, y, w, h } = this.fit;
      return { left: `${x * CELL}px`, top: `${y * CELL}px`, width: `${w * CELL}px`, height: `${h * CELL}px` };
    },
    dragStyle() {
      const d = this.drag;
      return { left: `${d.x - (d.gx + 0.5) * CELL}px`, top: `${d.y - (d.gy + 0.5) * CELL}px`, ...this.sizeStyle(d.piece, this.rots[d.piece], CELL) };
    }
  },
  watch: {
    complete(done) {
      this.welded = done;
      if (done) {
        vibrate([10, 40, 18]);
        this.fxFull();
      }
    },
    // Assemblée : la création chante
    made(done) {
      if (done) this.$nextTick(() => this.fxMade());
    },
    // Nouvel assemblage (Recommencer) : tout se remet à zéro
    'run.id'() {
      this.rots = this.run.pieces.map(() => 0);
      this.reset();
    }
  },
  created() {
    // Les minuteries des tremblements, arrêtées au départ ; les pièces posées (le mot de la suivante)
    this.timers = [];
    this.placed = 0;
  },
  mounted() {
    this.fx = createStage(this.$refs.fx, () => false, { reduced: reducedMotion() });
  },
  beforeUnmount() {
    this.unlisten();
    this.timers.forEach(clearTimeout);
    this.fx && this.fx.destroy();
  },
  methods: {
    shapeOf(i, rot) {
      return turn(this.run.pieces[i], rot);
    },
    at(x, y) {
      return { left: `${x * CELL}px`, top: `${y * CELL}px` };
    },
    sizeStyle(i, rot, size) {
      const { w, h } = sizeOf(this.shapeOf(i, rot));
      return { width: `${w * size}px`, height: `${h * size}px` };
    },
    homeOf(i) {
      return this.homes ? this.homes[i] : null;
    },
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    // Un point du gabarit (px du gabarit) sur la scène (px de la scène), ou null sans gabarit
    onStage(x, y) {
      const board = this.$refs.board;
      if (!board || !this.$refs.root) return null;
      const b = board.getBoundingClientRect(), r = this.$refs.root.getBoundingClientRect();
      return { x: b.left - r.left + x, y: b.top - r.top + y, w: b.width, h: b.height };
    },
    // Des étincelles et des copeaux au centre de la pièce qu'on vient de poser, et son mot (Clac !, Tic !)
    sparkle(step) {
      const cells = this.shapeOf(step.piece, step.rot);
      const mid = k => (cells.reduce((sum, c) => sum + c[k], 0) / cells.length + 0.5) * CELL;
      const p = this.onStage(mid(0) + step.x * CELL, mid(1) + step.y * CELL);
      if (!p) return;
      this.fx.particles.burst(p.x, p.y, { n: 9, shape: 'star', colors: SPARKS, speed: [70, 170], size: [3, 6], gravity: 120, life: [450, 750] });
      this.fx.particles.burst(p.x, p.y, { n: 4, shape: 'splinter', colors: CHIPS, speed: [50, 120], size: [2, 3.5], gravity: 380, life: [400, 650] });
      this.fx.particles.burst(p.x, p.y, { n: 1, shape: 'ring', colors: ['#FFF3C4'], speed: [0, 0], size: [CELL * 0.35, CELL * 0.35], size1: 2.2, gravity: 0, spin: 0, life: [380, 380], fade: 1 });
      this.fx.texts.add({ text: nth(PLACE_WORDS, this.placed++), x: p.x, y: p.y - CELL * 0.7, size: 20, fill: FILLS.place, look: 'word', tilt: (Math.random() - 0.5) * 0.3, life: 750, rise: 16 });
      this.fx.wake();
    },
    // Le gabarit rempli : Tadam ! au-dessus, une gerbe d'étincelles tout autour
    fxFull() {
      const c = this.onStage(0, 0);
      if (!c) return;
      const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
      this.fx.texts.add({ text: FULL_WORD, x: cx, y: c.y - 6, size: 30, fill: FILLS.full, font: 'display', look: 'label', delay: 180, life: 1300, rise: 12 });
      this.fx.particles.burst(cx, cy, { n: 20, shape: 'star', colors: SPARKS, speed: [120, 260], size: [3, 6], gravity: 90, life: [600, 1000] });
      this.fx.flash('rgba(255, 244, 205, 1)', 220);
    },
    // La création assemblée : Ziiing ! dans ses rayons, une grande gerbe d'étoiles
    fxMade() {
      const done = this.$refs.done, root = this.$refs.root;
      if (!done || !root) return;
      const d = done.getBoundingClientRect(), r = root.getBoundingClientRect();
      const cx = d.left - r.left + d.width / 2, cy = d.top - r.top + d.height / 2;
      // (le mot au-dessus d'elle, dans la marge laissée pour lui : il ne la cache pas)
      this.fx.texts.add({ text: MADE_WORD, x: cx, y: d.top - r.top - 6, size: 38, fill: FILLS.made, font: 'display', look: 'label', rays: true, delay: 200, life: 1700, rise: 12 });
      this.fx.particles.burst(cx, cy, { n: 24, shape: 'star', colors: ['#FFF3C4', '#F2B33D', '#E6B8F2', '#FFFFFF'], speed: [130, 300], size: [3, 7], gravity: 80, life: [800, 1300] });
      this.fx.shake(3);
      this.fx.flash('rgba(255, 240, 250, 1)', 300);
    },
    // La pièce i ne tient pas là (cell : la case visée, [x, y], s'il y en a une) : elle tremble, Hmm ?
    refuse(i, cell) {
      this.refusedPiece = null;
      this.$nextTick(() => { this.refusedPiece = i; });
      this.later(() => { if (this.refusedPiece === i) this.refusedPiece = null; }, REFUSED_MS);
      vibrate([6, 30, 6]);
      const p = cell && this.onStage((cell[0] + 0.5) * CELL, (cell[1] + 0.5) * CELL);
      if (p) {
        this.fx.texts.add({ text: MISS_WORD, x: p.x, y: p.y - CELL * 0.5, size: 17, fill: FILLS.miss, life: 650, rise: 12 });
        this.fx.wake();
      }
    },
    reset() {
      this.layout = [];
      this.selected = null;
      this.clearHint();
    },
    // Pose de la pièce i tournée de rot, son coin haut-gauche en (x, y) : refusée si elle ne tient pas
    put(i, rot, x, y) {
      const step = { piece: i, rot, x, y };
      if (!fits(this.run.shape, this.run.pieces, this.layout, step)) return false;
      this.layout = [...this.layout.filter(s => s.piece !== i), step];
      this.sparkle(step);
      vibrate(8);
      return true;
    },
    // Pièce prise puis case touchée : la première case de la pièce (en haut à gauche) va sur la case touchée
    dropSelected(x, y) {
      if (this.selected === null) return;
      const i = this.selected;
      const [fx, fy] = this.shapeOf(i, this.rots[i])[0];
      if (this.put(i, this.rots[i], x - fx, y - fy)) this.selected = null;
      else this.refuse(i, [x, y]);
    },
    /* ---------- Glisser ---------- */
    grab(event, i, fromBoard) {
      if (this.sending || (event.pointerType === 'mouse' && event.button !== 0)) return;
      event.preventDefault();
      const rect = event.currentTarget.getBoundingClientRect();
      const size = fromBoard ? CELL : TRAY;
      const shape = this.shapeOf(i, this.rots[i]);
      // Case de la pièce sous le doigt (la plus proche si le doigt est dans un creux de la pièce)
      const px = (event.clientX - rect.left) / size - 0.5, py = (event.clientY - rect.top) / size - 0.5;
      const [gx, gy] = shape.reduce((a, b) => (Math.hypot(b[0] - px, b[1] - py) < Math.hypot(a[0] - px, a[1] - py) ? b : a));
      this.drag = { piece: i, fromBoard, gx, gy, x: event.clientX, y: event.clientY, sx: event.clientX, sy: event.clientY, moved: false };
      this.onMove = e => this.move(e);
      this.onUp = e => this.release(e);
      window.addEventListener('pointermove', this.onMove);
      window.addEventListener('pointerup', this.onUp);
      window.addEventListener('pointercancel', this.onUp);
    },
    unlisten() {
      if (!this.onMove) return;
      window.removeEventListener('pointermove', this.onMove);
      window.removeEventListener('pointerup', this.onUp);
      window.removeEventListener('pointercancel', this.onUp);
      this.onMove = this.onUp = null;
    },
    // Case du gabarit visée par le coin haut-gauche de la pièce glissée (d : le glissement), ou null hors du gabarit
    target(e, d) {
      const board = this.$refs.board;
      if (!board) return null;
      const rect = board.getBoundingClientRect();
      const cx = Math.floor((e.clientX - rect.left) / CELL), cy = Math.floor((e.clientY - rect.top) / CELL);
      if (e.clientX < rect.left - CELL || e.clientY < rect.top - CELL || e.clientX > rect.right + CELL || e.clientY > rect.bottom + CELL) return null;
      return { x: cx - d.gx, y: cy - d.gy };
    },
    move(e) {
      const d = this.drag;
      if (!d) return;
      d.x = e.clientX;
      d.y = e.clientY;
      if (!d.moved && Math.hypot(d.x - d.sx, d.y - d.sy) > SLOP) {
        d.moved = true;
        this.selected = null;
      }
      if (!d.moved) return;
      const spot = this.target(e, d);
      this.clearHint();
      if (!spot) return;
      const step = { piece: d.piece, rot: this.rots[d.piece], ...spot };
      const keys = coverOf(this.run.pieces, step);
      if (fits(this.run.shape, this.run.pieces, this.layout, step)) this.hinted = new Set(keys);
      else this.refused = new Set(keys);
    },
    release(e) {
      const d = this.drag;
      this.unlisten();
      this.clearHint();
      this.drag = null;
      // Sans glissement, c'est un toucher : le clic qui suit s'en charge
      if (!d || !d.moved) return;
      this.droppedAt = performance.now();
      const spot = e.type === 'pointerup' ? this.target(e, d) : null;
      if (spot && this.put(d.piece, this.rots[d.piece], spot.x, spot.y)) return;
      // Lâchée à côté (ou là où elle ne tient pas) : la pièce revient parmi les pièces à poser, en tremblant si elle
      // visait le gabarit
      if (d.fromBoard) this.layout = this.layout.filter(s => s.piece !== d.piece);
      if (spot) this.refuse(d.piece, [spot.x + d.gx, spot.y + d.gy]);
    },
    // Un toucher : sur le gabarit, la pièce revient parmi les pièces à poser ; parmi elles, la prendre, puis la tourner
    // (le clic qui suit un glissement est ignoré)
    tapPiece(i, fromBoard) {
      if (this.sending || performance.now() - (this.droppedAt || 0) < 350) return;
      if (fromBoard) {
        this.rots[i] = this.layout.find(s => s.piece === i).rot;
        this.layout = this.layout.filter(s => s.piece !== i);
        this.selected = i;
      } else if (this.selected === i) this.rots[i] = (this.rots[i] + 1) % 4;
      else this.selected = i;
      vibrate(4);
    },
    clearHint() {
      if (this.hinted.size) this.hinted = new Set();
      if (this.refused.size) this.refused = new Set();
    }
  }
};
</script>

<style scoped src="./CraftPuzzle.css"></style>
