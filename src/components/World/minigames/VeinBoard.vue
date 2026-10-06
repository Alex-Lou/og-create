<template>
  <div class="vein">
    <div class="vein__bar">
      <span class="vein__strokes" aria-live="polite">
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M4,20 L14,10" stroke="#7A5230" stroke-width="2.6" stroke-linecap="round" />
          <path d="M8,4 C12,3 18,6 20,11 C17,8 13,7 9,7 Z" fill="#8C939A" stroke="#3E4448" stroke-width="1.2" stroke-linejoin="round" />
        </svg>
        <strong>{{ strokesLeft }}</strong> coup{{ strokesLeft > 1 ? 's' : '' }}
      </span>
      <ul class="vein__found" aria-label="Pierres trouvées">
        <li v-for="(gem, k) in found" :key="k"><GameIcon :kind="gem" :size="22" /></li>
        <li v-if="!found.length" class="vein__none">Aucune pierre encore</li>
      </ul>
    </div>
    <div class="vein__wall" :style="{ '--cols': VEIN.cols }">
      <button
        v-for="cell in cells"
        :key="cell.i"
        type="button"
        :class="['vein__block', `is-h${cell.hard}`, { 'is-open': cell.open, 'is-reach': cell.reach, 'is-hit': hit === cell.i, 'is-no': refused === cell.i }]"
        :style="{ '--crack': cell.crack }"
        :disabled="!playing || ended"
        :aria-label="labelOf(cell)"
        @click="strike(cell.i)"
      >
        <template v-if="cell.open">
          <GameIcon v-if="cell.gem" :kind="cell.gem" :size="30" class="vein__gem" />
          <span v-if="cell.glint" class="vein__glint" aria-hidden="true">{{ cell.glint > 3 ? `✦×${cell.glint}` : '✦'.repeat(cell.glint) }}</span>
        </template>
      </button>
    </div>
    <p class="vein__hint">Creuse depuis le haut, bloc par bloc. ✦ : une pierre précieuse dort tout près.</p>
  </div>
</template>

<script>
import GameIcon from './GameIcon.vue';
import { VEIN, GEMS, veinOf, reachable, glintOf } from '@/game/minigames';
import { vibrate } from '@/utils/fx';

const HARD_NAMES = ['', 'tendre', 'dur', 'très dur'];
const GEM_NAMES = { quartz: 'quartz', amethyste: 'améthyste', rubis: 'rubis', diamant: 'diamant' };

// Filon : la paroi vient de la graine du serveur ; les coups de pioche (bloc frappé, dans l'ordre) lui sont renvoyés à la
// fin (end) et il les rejoue. On creuse depuis le haut ; chaque bloc ouvert montre ses éclats (pierres voisines).
export default {
  name: 'VeinBoard',
  components: { GameIcon },
  props: {
    seed: { type: Number, required: true },
    playing: { type: Boolean, default: false }
  },
  emits: ['tally', 'end'],
  data() {
    const { hard, gems } = veinOf(this.seed);
    return { VEIN, hard, gems, left: hard.slice(), broken: hard.map(() => false), taps: [], found: [], hit: -1, refused: -1, ended: false };
  },
  computed: {
    strokesLeft() {
      return VEIN.strokes - this.taps.length;
    },
    cells() {
      return this.hard.map((hard, i) => ({
        i,
        hard,
        open: this.broken[i],
        reach: !this.broken[i] && reachable(this.broken, i),
        crack: this.broken[i] ? 0 : (hard - this.left[i]) / hard,
        gem: this.broken[i] ? this.gems[i] : null,
        glint: this.broken[i] ? glintOf(this.gems, i) : 0
      }));
    }
  },
  beforeUnmount() {
    clearTimeout(this.hitTimer);
    clearTimeout(this.endTimer);
  },
  methods: {
    labelOf(cell) {
      const x = (cell.i % VEIN.cols) + 1;
      const y = Math.floor(cell.i / VEIN.cols) + 1;
      const where = `Rangée ${y}, colonne ${x}`;
      if (cell.open) return `${where} : ouvert${cell.gem ? `, ${GEM_NAMES[cell.gem]}` : ''}${cell.glint ? `, ${cell.glint} pierre${cell.glint > 1 ? 's' : ''} autour` : ''}`;
      return `${where} : bloc ${HARD_NAMES[cell.hard]}${cell.reach ? '' : ', hors d’atteinte'}`;
    },
    // Un coup de pioche : seulement sur un bloc à portée (le serveur applique la même règle)
    strike(i) {
      if (!this.playing || this.ended || this.broken[i]) return;
      clearTimeout(this.hitTimer);
      if (!reachable(this.broken, i)) {
        this.refused = i;
        this.hitTimer = setTimeout(() => { this.refused = -1; }, 320);
        vibrate(4);
        return;
      }
      this.taps.push(i);
      this.left.splice(i, 1, this.left[i] - 1);
      this.hit = i;
      this.hitTimer = setTimeout(() => { this.hit = -1; }, 200);
      if (this.left[i] === 0) {
        this.broken.splice(i, 1, true);
        if (this.gems[i]) {
          this.found.push(this.gems[i]);
          this.$emit('tally', { raw: this.found.reduce((s, g) => s + GEMS[g].value, 0), detail: this.found.slice() });
          vibrate(this.gems[i] === 'diamant' ? [14, 40, 20] : [10, 30, 12]);
        } else vibrate(8);
      } else vibrate(5);
      if (this.strokesLeft <= 0) this.endTimer = setTimeout(() => this.finish(), 650);
    },
    finish() {
      if (this.ended) return;
      this.ended = true;
      this.$emit('end', this.taps.slice());
    },
    stop() {
      clearTimeout(this.endTimer);
      this.finish();
    }
  }
};
</script>

<style scoped>
.vein { display: grid; gap: 10px; font-family: var(--font-ui); }
.vein__bar { display: flex; align-items: center; justify-content: space-between; gap: 10px; min-height: 34px; }
.vein__strokes { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 800; color: var(--ink-700); white-space: nowrap; }
.vein__strokes strong { font-size: 18px; font-weight: 900; color: var(--ink-900); font-variant-numeric: tabular-nums; }
.vein__found { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 2px; margin: 0; padding: 0; list-style: none; }
.vein__found li { animation: vein-pop .35s cubic-bezier(.3, 1.6, .5, 1); }
.vein__none { font-size: 12px; font-weight: 700; color: var(--ink-500); animation: none !important; }
.vein__wall {
  display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 3px; padding: 6px; border-radius: var(--r-board);
  background: linear-gradient(#5E5850, #3E3934); box-shadow: inset 0 3px 8px rgba(0, 0, 0, .35);
  touch-action: manipulation; user-select: none; -webkit-user-select: none;
}
.vein__block {
  position: relative; aspect-ratio: 1; border: 0; border-radius: 9px; padding: 0; cursor: pointer;
  display: grid; place-items: center; overflow: hidden; -webkit-tap-highlight-color: transparent;
  background: var(--stone); box-shadow: inset 0 -3px 0 rgba(0, 0, 0, .22), inset 0 2px 0 rgba(255, 255, 255, .22);
  transition: filter .15s ease, transform .1s ease;
}
.vein__block.is-h1 { --stone: linear-gradient(145deg, #C2B8A8, #A39887); }
.vein__block.is-h2 { --stone: linear-gradient(145deg, #9E958A, #7E766C); }
.vein__block.is-h3 { --stone: linear-gradient(145deg, #77716B, #57524D); }
/* Fissures selon les coups déjà portés */
.vein__block::after {
  content: ''; position: absolute; inset: 0; opacity: calc(var(--crack) * 1.4); pointer-events: none;
  background:
    linear-gradient(118deg, transparent 46%, rgba(30, 22, 16, .7) 47%, transparent 50%),
    linear-gradient(62deg, transparent 58%, rgba(30, 22, 16, .6) 59%, transparent 61%),
    linear-gradient(170deg, transparent 30%, rgba(30, 22, 16, .5) 31%, transparent 33%);
}
.vein__block:not(.is-reach):not(.is-open) { filter: brightness(.72) saturate(.8); }
.vein__block.is-reach { box-shadow: inset 0 -3px 0 rgba(0, 0, 0, .22), inset 0 2px 0 rgba(255, 255, 255, .3), 0 0 0 2px rgba(242, 192, 75, .55); }
.vein__block.is-open { background: radial-gradient(circle at 50% 40%, #2E2A26, #1A1714); box-shadow: inset 0 3px 6px rgba(0, 0, 0, .6); cursor: default; }
.vein__block.is-hit { animation: vein-hit .2s ease; }
.vein__block.is-no { animation: vein-no .3s ease; }
.vein__block:disabled { cursor: default; }
.vein__gem { animation: vein-pop .4s cubic-bezier(.3, 1.6, .5, 1); filter: drop-shadow(0 0 6px rgba(255, 240, 200, .55)); }
.vein__glint { position: absolute; right: 3px; bottom: 2px; color: #FFE07A; font-size: 10px; font-weight: 900; letter-spacing: -.05em; text-shadow: 0 0 4px rgba(255, 210, 90, .8); }
.vein__hint { margin: 0; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink-500); }
@keyframes vein-hit { 0%, 100% { transform: none; } 30% { transform: translate(-2px, 1px) rotate(-2deg); } 60% { transform: translate(2px, -1px) rotate(2deg); } }
@keyframes vein-no { 0%, 100% { transform: none; } 25% { transform: translateX(-3px); } 75% { transform: translateX(3px); } }
@keyframes vein-pop { from { transform: scale(.2); opacity: 0; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .vein__block.is-hit, .vein__block.is-no, .vein__gem, .vein__found li { animation: none; }
}
</style>
