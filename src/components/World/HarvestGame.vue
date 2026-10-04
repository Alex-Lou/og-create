<template>
  <div class="harvest" role="dialog" aria-modal="true" aria-label="Récolte">
    <div class="harvest__card">
      <header class="harvest__head">
        <div>
          <span class="harvest__eyebrow">Récolte</span>
          <span class="harvest__title">{{ finished ? 'Récolte rentrée' : `${movesLeft} coup${movesLeft > 1 ? 's' : ''}` }}</span>
        </div>
        <button v-if="!finished" type="button" class="harvest__end" :disabled="sending || animating" @click="finish">
          {{ moves.length ? 'Rentrer la récolte' : 'Quitter' }}
        </button>
      </header>

      <!-- Gains de la partie : estimés pendant le jeu, ceux du serveur à la fin -->
      <ul class="harvest__tally" aria-label="Gains">
        <li v-for="r in RESOURCES" :key="r.id" :class="['harvest__res', { 'is-boost': run.boosts[r.id] }]">
          <span aria-hidden="true">{{ r.glyph }}</span>
          <strong>{{ shown[r.id] }}</strong>
          <span class="oc-sr-only">{{ r.label }}</span>
          <em v-if="run.boosts[r.id]" class="harvest__boost">×2</em>
        </li>
      </ul>

      <div v-if="!finished" class="harvest__hint" aria-live="polite">
        <template v-if="path.length >= MIN_CHAIN">Chaîne de {{ path.length }} : +{{ preview.amount }} {{ GLYPH[preview.kind] }}</template>
        <template v-else-if="path.length">Encore {{ MIN_CHAIN - path.length }}…</template>
        <template v-else>Relie au doigt 3 tuiles identiques voisines ou plus.</template>
      </div>

      <div
        v-if="!finished"
        ref="board"
        class="harvest__board"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="onUp"
        @pointercancel="onUp"
      >
        <div
          v-for="tile in tiles"
          :key="tile.id"
          :class="['harvest__tile', `is-${tile.kind}`, { 'is-picked': picked.has(tile.y * SIZE + tile.x), 'is-gone': gone.has(tile.y * SIZE + tile.x), 'is-fresh': tile.from !== null }]"
          :style="{ '--x': tile.x, '--y': tile.y, '--from': tile.from === null ? tile.y : tile.from }"
        >
          <span aria-hidden="true">{{ GLYPH[tile.kind] }}</span>
        </div>
        <svg class="harvest__path" viewBox="0 0 6 6" aria-hidden="true">
          <polyline v-if="path.length > 1" :points="pathPoints" />
        </svg>
      </div>

      <div v-else class="harvest__result">
        <p v-if="error" class="harvest__error" role="alert">{{ error }}</p>
        <p v-else-if="sending" class="harvest__wait">Le serveur pèse ta récolte…</p>
        <p v-else class="harvest__done">Ta récolte rejoint les réserves de l’île.</p>
        <button type="button" class="harvest__btn" :disabled="sending" @click="$emit('close')">Retour à l’île</button>
      </div>
    </div>
  </div>
</template>

<script>
import { SIZE, MIN_CHAIN, create, play, gainOf } from '@/game/harvest';
import { vibrate } from '@/utils/fx';
import { GLYPH, RESOURCES } from '@/game/resources';

const GONE_MS = 170;

// Récolte : le plateau vient de la graine du serveur ; les coups joués lui sont renvoyés à la fin,
// il les rejoue et décide seul du gain (result). Le moteur est partagé avec le serveur.
export default {
  name: 'HarvestGame',
  props: {
    run: { type: Object, required: true },
    sending: { type: Boolean, default: false },
    result: { type: Object, default: null },
    error: { type: String, default: '' }
  },
  emits: ['finish', 'close'],
  data() {
    return {
      SIZE, MIN_CHAIN, GLYPH, RESOURCES,
      tiles: [],
      path: [],
      gone: new Set(),
      moves: [],
      gains: { stone: 0, wood: 0, water: 0, food: 0 },
      animating: false,
      finished: false
    };
  },
  computed: {
    movesLeft() {
      return this.run.maxMoves - this.moves.length;
    },
    picked() {
      return new Set(this.path.map(([x, y]) => y * SIZE + x));
    },
    pathPoints() {
      return this.path.map(([x, y]) => `${x + 0.5},${y + 0.5}`).join(' ');
    },
    preview() {
      if (!this.path.length) return { amount: 0, kind: 'stone' };
      const [x, y] = this.path[0];
      const kind = this.game.board[y][x];
      return { kind, amount: gainOf(kind, this.path.length, this.run.boosts).amount };
    },
    shown() {
      return this.result || this.gains;
    }
  },
  created() {
    // Non réactifs : moteur et identifiants stables des tuiles (pour animer les chutes)
    this.game = create(this.run.seed, this.run.kinds);
    this.ids = this.game.board.map(row => row.map(() => 0));
    this.nextId = 1;
    this.timer = 0;
    this.pointer = null;
    for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) this.ids[y][x] = this.nextId++;
    this.tiles = this.layout(new Set());
  },
  beforeUnmount() {
    clearTimeout(this.timer);
  },
  methods: {
    // Tuiles à afficher ; fresh : cases tombées du haut (avec leur hauteur de départ)
    layout(fresh, drops = {}) {
      const out = [];
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          const isFresh = fresh.has(this.ids[y][x]);
          out.push({ id: this.ids[y][x], kind: this.game.board[y][x], x, y, from: isFresh ? y - (drops[x] || SIZE) : null });
        }
      }
      return out;
    },
    cellAt(event) {
      const rect = this.$refs.board.getBoundingClientRect();
      const fx = ((event.clientX - rect.left) / rect.width) * SIZE;
      const fy = ((event.clientY - rect.top) / rect.height) * SIZE;
      const x = Math.floor(fx), y = Math.floor(fy);
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return null;
      // Seul le cœur de la case compte : les diagonales se prennent sans accrocher les voisines
      const near = Math.hypot(fx - x - 0.5, fy - y - 0.5) < 0.44;
      return near ? [x, y] : null;
    },
    onDown(event) {
      if (this.animating || this.finished || this.movesLeft <= 0) return;
      const cell = this.cellAt(event);
      if (!cell) return;
      this.pointer = event.pointerId;
      this.$refs.board.setPointerCapture(event.pointerId);
      this.path = [cell];
      vibrate(5);
    },
    onMove(event) {
      if (this.pointer !== event.pointerId || !this.path.length) return;
      const cell = this.cellAt(event);
      if (!cell) return;
      const [x, y] = cell;
      const last = this.path[this.path.length - 1];
      if (last[0] === x && last[1] === y) return;
      // Retour sur la case précédente : la chaîne recule
      const before = this.path[this.path.length - 2];
      if (before && before[0] === x && before[1] === y) {
        this.path.pop();
        return;
      }
      const [fx, fy] = this.path[0];
      const sameKind = this.game.board[y][x] === this.game.board[fy][fx];
      const touching = Math.max(Math.abs(last[0] - x), Math.abs(last[1] - y)) === 1;
      if (sameKind && touching && !this.picked.has(y * SIZE + x)) {
        this.path.push([x, y]);
        vibrate(this.path.length >= MIN_CHAIN ? 8 : 5);
      }
    },
    onUp(event) {
      if (this.pointer !== event.pointerId) return;
      this.pointer = null;
      const path = this.path;
      if (path.length < MIN_CHAIN) {
        this.path = [];
        return;
      }
      this.commit(path);
    },
    // Coup joué : les tuiles s'envolent, puis les colonnes tombent et le haut se remplit
    commit(path) {
      const kind = this.game.board[path[0][1]][path[0][0]];
      const gain = gainOf(kind, path.length, this.run.boosts);
      this.gains = { ...this.gains, [gain.resource]: this.gains[gain.resource] + gain.amount };
      this.moves.push(path.map(([x, y]) => [x, y]));
      this.gone = new Set(path.map(([x, y]) => y * SIZE + x));
      this.path = [];
      this.animating = true;
      vibrate(path.length >= 5 ? [14, 30, 14] : 12);
      this.timer = setTimeout(() => {
        const removed = this.gone;
        const fresh = new Set();
        const drops = {};
        // Mêmes chutes que le moteur : par colonne, les tuiles gardées descendent, les nouvelles arrivent au-dessus
        for (let x = 0; x < SIZE; x++) {
          const kept = [];
          for (let y = 0; y < SIZE; y++) if (!removed.has(y * SIZE + x)) kept.push(this.ids[y][x]);
          const added = Array.from({ length: SIZE - kept.length }, () => this.nextId++);
          added.forEach(id => fresh.add(id));
          drops[x] = added.length;
          [...added, ...kept].forEach((id, y) => { this.ids[y][x] = id; });
        }
        play(this.game, path);
        if (this.game.shuffled) {
          for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
              this.ids[y][x] = this.nextId++;
              fresh.add(this.ids[y][x]);
            }
          }
          for (let x = 0; x < SIZE; x++) drops[x] = SIZE;
        }
        this.gone = new Set();
        this.tiles = this.layout(fresh, drops);
        this.timer = setTimeout(() => {
          this.animating = false;
          if (this.movesLeft <= 0) this.finish();
        }, 300);
      }, GONE_MS);
    },
    finish() {
      if (this.finished) return;
      this.finished = true;
      this.$emit('finish', this.moves);
    }
  }
};
</script>

<style scoped>
.harvest {
  position: fixed; inset: 0; z-index: 80;
  display: flex; align-items: center; justify-content: center;
  padding: 16px; background: rgba(10, 8, 6, .72);
  font-family: var(--font-ui);
}
.harvest__card {
  width: min(100%, 440px); max-height: 100%; overflow-y: auto;
  padding: 16px; border-radius: 26px;
  background: var(--vellum-100); color: var(--ink-900);
  box-shadow: 0 24px 60px rgba(0, 0, 0, .5);
}
.harvest__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; }
.harvest__eyebrow { display: block; font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-500); }
.harvest__title { display: block; font-family: var(--font-display); font-size: 24px; font-weight: 700; line-height: 1.1; }
.harvest__end {
  min-height: 38px; padding: 6px 14px; border: 0; border-radius: 999px;
  background: var(--ink-900); color: var(--vellum-50); font: inherit; font-weight: 900; font-size: 13px; cursor: pointer;
}
.harvest__end:disabled { opacity: .5; cursor: default; }
.harvest__tally { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 12px 0 8px; padding: 0; list-style: none; }
.harvest__res {
  position: relative; display: flex; align-items: center; justify-content: center; gap: 5px;
  min-height: 38px; border-radius: 12px; background: var(--vellum-50);
  box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .08); font-size: 18px;
}
.harvest__res strong { font-size: 16px; font-weight: 900; font-variant-numeric: tabular-nums; }
.harvest__res.is-boost { box-shadow: inset 0 0 0 2px #E7B648; }
.harvest__boost { position: absolute; top: -7px; right: -4px; padding: 0 5px; border-radius: 8px; background: #E7B648; color: var(--ink-900); font-size: 10px; font-style: normal; font-weight: 900; }
.harvest__hint { min-height: 22px; margin-bottom: 8px; text-align: center; font-size: 14px; font-weight: 800; color: #8A5A1C; }

.harvest__board {
  position: relative; width: 100%; aspect-ratio: 1;
  border-radius: 18px; background: #E9DDC4;
  box-shadow: inset 0 2px 6px rgba(74, 52, 38, .18);
  touch-action: none; user-select: none; -webkit-user-select: none;
  overflow: hidden;
}
.harvest__tile {
  position: absolute; top: 0; left: 0; width: calc(100% / 6); height: calc(100% / 6);
  display: flex; align-items: center; justify-content: center;
  transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%));
  transition: transform .28s cubic-bezier(.3, 1.25, .55, 1);
  font-size: clamp(22px, 7vw, 32px);
}
.harvest__tile::before {
  content: ''; position: absolute; inset: 7%;
  border-radius: 14px; background: var(--tile, var(--vellum-50));
  box-shadow: 0 3px 0 rgba(74, 52, 38, .18), inset 0 0 0 1px rgba(255, 255, 255, .5);
  transition: transform .12s ease, box-shadow .12s ease;
}
.harvest__tile span { position: relative; transition: transform .12s ease; }
.harvest__tile.is-stone { --tile: #D9D2C5; }
.harvest__tile.is-wood { --tile: #E2BD8C; }
.harvest__tile.is-water { --tile: #A9DBF1; }
.harvest__tile.is-food { --tile: #F7C1A5; }
.harvest__tile.is-fish { --tile: #9CCBE6; }
.harvest__tile.is-picked::before { transform: scale(1.08); box-shadow: 0 0 0 3px #F2B53C, 0 4px 10px rgba(242, 181, 60, .5); }
.harvest__tile.is-picked span { transform: scale(1.12); }
.harvest__tile.is-gone { animation: harvest-gone .17s ease-in forwards; }
.harvest__tile.is-fresh { animation: harvest-drop .34s cubic-bezier(.3, 1.25, .55, 1); }
@keyframes harvest-gone { to { opacity: 0; transform: translate(calc(var(--x) * 100%), calc(var(--y) * 100%)) scale(.2); } }
@keyframes harvest-drop { from { transform: translate(calc(var(--x) * 100%), calc(var(--from) * 100%)); } }
.harvest__path { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }
.harvest__path polyline { fill: none; stroke: rgba(242, 181, 60, .85); stroke-width: .12; stroke-linecap: round; stroke-linejoin: round; }

.harvest__result { padding: 18px 4px 6px; text-align: center; }
.harvest__done, .harvest__wait { margin: 0 0 14px; color: var(--ink-500); font-style: italic; }
.harvest__error { margin: 0 0 14px; color: #A2412B; font-weight: 800; }
.harvest__btn { min-height: 46px; padding: 10px 22px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50); font: inherit; font-weight: 900; font-size: 15px; cursor: pointer; }
.harvest__btn:disabled { opacity: .5; }
@media (prefers-reduced-motion: reduce) {
  .harvest__tile, .harvest__tile.is-fresh, .harvest__tile.is-gone { transition: none; animation: none; }
}
</style>
