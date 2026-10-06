<template>
  <GModal eyebrow="Établi · assemblage" :title="name" :width="460" align="center" @close="$emit('close')">
    <div class="puzzle">
      <!-- Fabriquée : la poser tout de suite, ou revenir à l'établi -->
      <template v-if="made">
        <span class="puzzle__art puzzle__art--done"><img :src="art" alt="" /></span>
        <p class="puzzle__done" role="status">{{ name }} : c’est assemblé ! Elle t’attend dans la réserve de l’établi.</p>
        <div class="puzzle__actions">
          <button type="button" class="puzzle__btn puzzle__btn--quiet" @click="$emit('close')">Retour à l’établi</button>
          <button type="button" class="puzzle__btn" @click="$emit('place')">Poser sur l’île</button>
        </div>
      </template>

      <template v-else>
        <p class="puzzle__hint">
          Glisse chaque pièce dans le gabarit, ou touche une pièce puis une case.
          <template v-if="run.turned"> Les pièces arrivent tournées : touche encore une pièce prise pour la tourner.</template>
          <template v-else> Touche encore une pièce prise pour la tourner.</template>
        </p>

        <!-- Gabarit : ses cases (boutons, pour poser la pièce prise) et les pièces déjà posées -->
        <div ref="board" class="puzzle__board" :style="boardStyle" aria-label="Gabarit">
          <span class="puzzle__ghost-art" aria-hidden="true"><img :src="art" alt="" /></span>
          <button
            v-for="[x, y] in cells"
            :key="`c${x},${y}`"
            type="button"
            :class="['puzzle__cell', { 'is-hint': hinted.has(`${x},${y}`), 'is-bad': refused.has(`${x},${y}`) }]"
            :style="at(x, y)"
            :aria-label="`Case ${x + 1}, ${y + 1}${selected !== null ? ' : y poser la pièce prise' : ''}`"
            :disabled="sending"
            @click="dropSelected(x, y)"
          ></button>
          <button
            v-for="step in layout"
            :key="`p${step.piece}`"
            type="button"
            class="puzzle__placed"
            :style="{ ...at(step.x, step.y), ...sizeStyle(step.piece, step.rot, CELL) }"
            :aria-label="`Pièce ${step.piece + 1} posée : la reprendre`"
            :disabled="sending"
            @pointerdown="grab($event, step.piece, true)"
            @click="tapPiece(step.piece, true)"
          >
            <span v-for="([cx, cy], k) in shapeOf(step.piece, step.rot)" :key="k" class="puzzle__bit" :style="bitStyle(cx, cy, CELL, step.piece)"></span>
          </button>
        </div>

        <!-- Pièces à poser -->
        <div class="puzzle__tray" aria-label="Pièces à poser">
          <button
            v-for="i in loose"
            :key="`t${i}`"
            type="button"
            :class="['puzzle__piece', { 'is-on': selected === i, 'is-dragged': drag && drag.moved && drag.piece === i }]"
            :style="sizeStyle(i, rots[i], TRAY)"
            :aria-label="`Pièce ${i + 1} (${run.pieces[i].length} cases)${selected === i ? ', prise : toucher pour la tourner' : ''}`"
            :aria-pressed="String(selected === i)"
            :disabled="sending"
            @pointerdown="grab($event, i, false)"
            @click="tapPiece(i, false)"
          >
            <span v-for="([cx, cy], k) in shapeOf(i, rots[i])" :key="k" class="puzzle__bit" :style="bitStyle(cx, cy, TRAY, i)"></span>
          </button>
          <p v-if="!loose.length" class="puzzle__full">{{ complete ? 'Tout est en place !' : 'Il reste des trous : reprends une pièce.' }}</p>
        </div>

        <p v-if="error" class="puzzle__error" role="alert">{{ error }}</p>
        <div class="puzzle__actions">
          <button v-if="error" type="button" class="puzzle__btn puzzle__btn--quiet" :disabled="sending" @click="$emit('restart')">Recommencer</button>
          <button v-else type="button" class="puzzle__btn puzzle__btn--quiet" :disabled="sending || !layout.length" @click="reset">Tout reprendre</button>
          <button type="button" class="puzzle__btn" :disabled="sending || !complete || Boolean(error)" @click="$emit('finish', layout.map(s => ({ ...s })))">
            {{ sending ? 'Un instant…' : 'Assembler' }}
          </button>
        </div>
      </template>
    </div>

    <!-- Pièce qu'on glisse, sous le doigt -->
    <teleport to="body">
      <div v-if="drag && drag.moved" class="puzzle__drag" :style="dragStyle" aria-hidden="true">
        <span v-for="([cx, cy], k) in shapeOf(drag.piece, rots[drag.piece])" :key="k" class="puzzle__bit" :style="bitStyle(cx, cy, CELL, drag.piece)"></span>
      </div>
    </teleport>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal/GModal.vue';
import { spriteUrl } from '@/world/spriteCache';
import { craftThumb } from '@/world/craftSprites';
import { creationThumb } from '@/world/creations';
import { cellsOf, turn, sizeOf, fits, covered, coverOf } from '@/world/crafts';
import { vibrate } from '@/utils/fx';

const CELL = 44; // taille d'une case du gabarit (px)
const TRAY = 24; // taille d'une case d'une pièce à poser
const SLOP = 6; // au-delà, un appui devient un glissement
const COLORS = ['#E8A25A', '#7DB46E', '#6FA3D9', '#D97A8A', '#B48AE0', '#E2C66E', '#5FB3A8', '#C98A4A', '#8E9AA8', '#F08A3A'];

// Puzzle d'assemblage d'une création : le gabarit (silhouette de la création) et ses pièces, découpées par le serveur.
// Chaque pièce se glisse (ou se prend puis se pose sur une case) et se tourne d'un quart de tour ; quand le gabarit est
// exactement rempli, « Assembler » envoie la disposition, que le serveur vérifie avant de prendre les ressources.
// Un toucher (souris, doigt, clavier : Entrée) passe par le clic ; l'appui ne sert qu'à commencer un glissement.
export default {
  name: 'CraftPuzzle',
  components: { GModal },
  props: {
    // { id, craft, shape, pieces, turned } (serveur)
    run: { type: Object, required: true },
    name: { type: String, required: true },
    sending: { type: Boolean, default: false },
    error: { type: String, default: '' },
    // Vrai une fois l'assemblage accepté
    made: { type: Boolean, default: false }
  },
  emits: ['finish', 'restart', 'place', 'close'],
  data() {
    return {
      CELL,
      TRAY,
      rots: this.run.pieces.map(() => 0),
      layout: [],
      selected: null,
      drag: null,
      // Cases surlignées pendant un glissement : là où la pièce tomberait (refused : elle n'y tient pas)
      hinted: new Set(),
      refused: new Set()
    };
  },
  computed: {
    cells() {
      return cellsOf(this.run.shape);
    },
    boardStyle() {
      const w = Math.max(...this.run.shape.map(r => r.length));
      return { width: `${w * CELL}px`, height: `${this.run.shape.length * CELL}px` };
    },
    loose() {
      return this.run.pieces.map((p, i) => i).filter(i => !this.layout.some(s => s.piece === i));
    },
    complete() {
      return covered(this.run.shape, this.run.pieces, this.layout);
    },
    art() {
      return creationThumb(this.run.craft) ?? spriteUrl(`craft-thumb-${this.run.craft}`, () => craftThumb(this.run.craft));
    },
    dragStyle() {
      const d = this.drag;
      return { left: `${d.x - (d.gx + 0.5) * CELL}px`, top: `${d.y - (d.gy + 0.5) * CELL}px`, ...this.sizeStyle(d.piece, this.rots[d.piece], CELL) };
    }
  },
  watch: {
    // Nouvel assemblage (Recommencer) : tout se remet à zéro
    'run.id'() {
      this.rots = this.run.pieces.map(() => 0);
      this.reset();
    }
  },
  beforeUnmount() {
    this.unlisten();
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
    bitStyle(cx, cy, size, i) {
      return { left: `${cx * size}px`, top: `${cy * size}px`, width: `${size}px`, height: `${size}px`, background: COLORS[i % COLORS.length] };
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
      vibrate(8);
      return true;
    },
    // Pièce prise puis case touchée : la première case de la pièce (en haut à gauche) va sur la case touchée
    dropSelected(x, y) {
      if (this.selected === null) return;
      const i = this.selected;
      const [fx, fy] = this.shapeOf(i, this.rots[i])[0];
      if (this.put(i, this.rots[i], x - fx, y - fy)) this.selected = null;
      else vibrate([6, 30, 6]);
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
      // Lâchée à côté (ou là où elle ne tient pas) : la pièce revient parmi les pièces à poser
      if (d.fromBoard) this.layout = this.layout.filter(s => s.piece !== d.piece);
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
