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
import GameIcon from '../GameIcon/GameIcon.vue';
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

<style scoped src="./VeinBoard.css"></style>
