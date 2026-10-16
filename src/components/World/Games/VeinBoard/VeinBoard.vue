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
    <!-- La paroi : la scène dessine les blocs, les trous, les pierres et les coups (veinScene.js) ; par-dessus, un bouton
         invisible par bloc, pour le doigt et le clavier -->
    <div ref="wall" :class="['vein__wall', { 'has-art': Boolean(WALL) }]" :style="{ '--cols': VEIN.cols, '--m': `${MARGIN}px`, ...(WALL ? { '--vein-fond': `url(${WALL})` } : {}) }">
      <canvas ref="stage" class="vein__stage" aria-hidden="true"></canvas>
      <button
        v-for="cell in cells"
        :key="cell.i"
        type="button"
        class="vein__block"
        :disabled="!playing || ended || strokesLeft <= 0"
        :aria-label="labelOf(cell)"
        @click="strike(cell.i)"
      ></button>
    </div>
    <p class="vein__hint">{{ VEIN_HINT }}</p>
  </div>
</template>

<script>
import GameIcon from '../GameIcon/GameIcon.vue';
import { VEIN, GEMS, veinOf, reachable, glintOf } from '@/game/minigames';
import { vibrate, reducedMotion } from '@/utils/fx';
import { gamePiece } from '@/game/minigameArt';
import { HIT_WORDS, BREAK_WORDS, HINT_WORDS, EMPTY_WORDS, GEM_FX, nth, nextFind, tierOfFinds } from '@/game/veinFx';
import { createVeinScene, MARGIN } from './veinScene';
import { VEIN_HINT } from '@/texts/world/screens/games';

// Le fond de la paroi (il se répète)
const WALL = gamePiece('filon', 'fond-surface');
const HARD_NAMES = ['', 'tendre', 'dur', 'très dur'];
const GEM_NAMES = { quartz: 'quartz', amethyste: 'améthyste', rubis: 'rubis', diamant: 'diamant' };
// La pression d'un coup dans la main : un coup, un bloc qui cède, une pierre, le diamant
const HAPTIC = { hit: 5, broke: 8, gem: [10, 30, 12], diamant: [14, 40, 20] };

// Filon : la paroi vient de la graine du serveur ; les coups de pioche (bloc frappé, dans l'ordre) lui sont renvoyés à la
// fin (end) et il les rejoue. On creuse depuis le haut ; chaque bloc ouvert montre ses éclats (pierres voisines). La
// scène (veinScene.js) dessine la paroi et ses coups, avec leurs mots (game/veinFx.js) ; les pierres trouvées
// d'affilée montent les paliers féeriques.
export default {
  name: 'VeinBoard',
  components: { GameIcon },
  props: {
    seed: { type: Number, required: true },
    playing: { type: Boolean, default: false },
    // les coups de la partie (les premières sont courtes : game/minigames.js, SHORT), sinon celle d'une partie normale
    limit: { type: Number, default: null }
  },
  emits: ['tally', 'end'],
  data() {
    const { hard, gems } = veinOf(this.seed);
    return { VEIN, WALL, MARGIN, VEIN_HINT, hard, gems, left: hard.slice(), broken: hard.map(() => false), taps: [], found: [], ended: false };
  },
  computed: {
    // La durée (ou les coups) de cette partie
    span() {
      return this.limit || VEIN.strokes;
    },
    strokesLeft() {
      return this.span - this.taps.length;
    },
    cells() {
      return this.hard.map((hard, i) => ({
        i,
        hard,
        open: this.broken[i],
        reach: !this.broken[i] && reachable(this.broken, i),
        gem: this.broken[i] ? this.gems[i] : null,
        glint: this.broken[i] ? glintOf(this.gems, i) : 0
      }));
    }
  },
  created() {
    // Non réactifs : ce que chaque mot a déjà dit (à tour de rôle), les pierres d'affilée
    this.said = { hit: 0, empty: 0, hint: 0 };
    this.streak = 0;
  },
  mounted() {
    this.scene = createVeinScene(this.$refs.stage, {
      reduced: reducedMotion(),
      model: () => ({ hard: this.hard, left: this.left, broken: this.broken, gems: this.gems, reach: new Set(this.cells.filter(c => c.reach).map(c => c.i)), glint: i => glintOf(this.gems, i) })
    });
  },
  beforeUnmount() {
    clearTimeout(this.endTimer);
    if (this.scene) this.scene.destroy();
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
      // (plus aucun coup après le dernier : la partie se rend dans un instant, et un coup de trop la ferait refuser)
      if (!this.playing || this.ended || this.strokesLeft <= 0 || this.broken[i]) return;
      if (!reachable(this.broken, i)) {
        this.scene.refuse(i);
        vibrate(4);
        return;
      }
      this.taps.push(i);
      this.left.splice(i, 1, this.left[i] - 1);
      const hard = this.hard[i];
      const broke = this.left[i] === 0;
      const gem = broke ? this.gems[i] : null;
      // (un mot par coup, pas plus : le coup de pioche, le bloc qui cède, ou la pierre trouvée)
      const words = broke ? {} : { hit: nth(HIT_WORDS, this.said.hit++) };
      let tier = null;
      if (broke) {
        this.broken.splice(i, 1, true);
        if (hard === 3) words.burst = nth(BREAK_WORDS[hard], 0);
        const before = tierOfFinds(this.streak).rank;
        this.streak = nextFind(this.streak, gem);
        if (gem) {
          this.found.push(gem);
          words.gem = nth(GEM_FX[gem].words, this.found.filter(g => g === gem).length - 1);
          const reached = tierOfFinds(this.streak);
          tier = reached.rank > before ? reached : null;
          this.$emit('tally', { raw: this.found.reduce((s, g) => s + GEMS[g].value, 0), detail: this.found.slice() });
        } else words.empty = glintOf(this.gems, i) ? nth(HINT_WORDS, this.said.hint++) : nth(EMPTY_WORDS, this.said.empty++);
      }
      this.scene.strike(i, { hard, broke, gem, words, tier });
      vibrate(gem === 'diamant' ? HAPTIC.diamant : gem ? HAPTIC.gem : broke ? HAPTIC.broke : HAPTIC.hit);
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
