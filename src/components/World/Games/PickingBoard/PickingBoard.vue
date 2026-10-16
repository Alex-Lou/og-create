<template>
  <div :class="['picking', { 'is-stung': stung, 'is-slip': slipped }]">
    <div class="picking__bar">
      <span class="picking__time" aria-hidden="true"><strong>{{ secondsLeft }}</strong> s</span>
      <span class="picking__meter" aria-hidden="true"><span :style="{ width: `${(1 - now / span) * 100}%` }"></span></span>
      <span class="picking__basket" aria-live="polite"><img v-if="basketArt" class="picking__basket-art" :src="basketArt" alt="" /><strong>{{ got.length }}</strong> cueillie{{ got.length > 1 ? 's' : '' }}</span>
    </div>
    <!-- Le carré : la scène dessine les buissons, ce qui y mûrit et les cueillettes (pickScene.js) ; par-dessus, un bouton
         invisible par buisson, pour le doigt et le clavier -->
    <div class="picking__patch" :style="{ '--cols': PICKING.cols, '--m': `${MARGIN}px` }">
      <canvas ref="stage" class="picking__stage" aria-hidden="true"></canvas>
      <button
        v-for="cell in CELLS"
        :key="cell"
        type="button"
        class="picking__bush"
        :disabled="!playing || ended"
        :aria-label="`Buisson ${cell + 1}`"
        @pointerdown.prevent="pick(cell)"
        @keydown.enter.prevent="pick(cell)"
        @keydown.space.prevent="pick(cell)"
      ></button>
    </div>
    <p class="picking__hint">{{ PICKING_HINT }}</p>
  </div>
</template>

<script>
import { PICKING, BERRIES, pickingOf, ripeAt } from '@/game/minigames';
import { vibrate, reducedMotion } from '@/utils/fx';
import { PICKING_HINT } from '@/texts/world/screens/games';
import { gamePiece } from '@/game/minigameArt';
import { BERRY_FX, FALL_WORDS, nth, nextPick, tierOfPicks } from '@/game/pickFx';
import { horlogeDePartie } from '@/game/stage/horloge';
import { createPickScene, MARGIN } from './pickScene';

const CELLS = Array.from({ length: PICKING.cols * PICKING.rows }, (_, i) => i);

// Cueillette : ce qui mûrit vient de la graine du serveur ; les gestes [t, buisson] lui sont renvoyés à la fin (end) et
// il les rejoue. Un buisson vide fait perdre un instant, les guêpes davantage (mêmes règles des deux côtés). La scène
// (pickScene.js) dessine le carré au temps de la partie ; chaque cueillette dit son mot (game/pickFx.js), les
// cueillettes d'affilée sans baie perdue montent les paliers féeriques.
export default {
  name: 'PickingBoard',
  props: {
    seed: { type: Number, required: true },
    playing: { type: Boolean, default: false },
    // la durée (ms) de la partie (les premières sont courtes : game/minigames.js, SHORT), sinon celle d'une partie normale
    limit: { type: Number, default: null }
  },
  emits: ['tally', 'end'],
  data() {
    // now : le temps de la partie, en secondes entières pour la barre (la scène lit le temps exact elle-même)
    return { PICKING, CELLS, MARGIN, PICKING_HINT, now: 0, got: [], stung: false, slipped: false, ended: false };
  },
  computed: {
    // La durée (ou les coups) de cette partie
    span() {
      return this.limit || PICKING.duration;
    },
    secondsLeft() {
      return Math.ceil((this.span - this.now) / 1000);
    },
    // Le panier de la bibliothèque : vide, à moitié, plein
    basketArt() {
      const n = this.got.filter(k => k !== 'guepes').length;
      return gamePiece('cueillette', n ? (n < 20 ? 'panier_a-moitie' : 'panier_plein') : 'panier_vide');
    }
  },
  watch: {
    playing(on) {
      if (on && !this.horloge.started) {
        this.horloge.start();
        this.scene.wake();
      }
    }
  },
  created() {
    // Non réactifs : la partie, ce qui est cueilli, les gestes, la série, ce que chaque mot a déjà dit
    this.events = pickingOf(this.seed, this.span);
    this.picked = new Set();
    this.picks = [];
    this.stunned = 0;
    // (le temps de jeu : en pause quand la page est cachée)
    this.horloge = horlogeDePartie();
    this.streak = 0;
    this.said = {};
  },
  mounted() {
    this.scene = createPickScene(this.$refs.stage, {
      reduced: reducedMotion(),
      model: () => this.frame(),
      onLost: e => {
        this.streak = nextPick(this.streak, null);
        this.scene.lost(e.cell, nth(FALL_WORDS, 0));
      }
    });
  },
  beforeUnmount() {
    this.horloge.stop();
    clearTimeout(this.fxTimer);
    if (this.scene) this.scene.destroy();
  },
  methods: {
    elapsed() {
      return Math.min(this.span, Math.round(this.horloge.elapsed()));
    },
    // Ce que la scène dessine à cette image ; la barre (les secondes) ne se met à jour qu'une fois par seconde
    frame() {
      const t = this.elapsed();
      if (Math.floor(t / 1000) !== Math.floor(this.now / 1000) || t >= this.span) this.now = t;
      if (this.horloge.started && !this.ended && t >= this.span) this.finish();
      return { now: t, events: this.events, picked: this.picked, playing: this.horloge.started && !this.ended };
    },
    pick(cell) {
      if (!this.playing || this.ended) return;
      const t = this.elapsed();
      if (t < this.stunned || this.picks.length >= PICKING.maxPicks) return;
      this.picks.push([t, cell]);
      const e = ripeAt(this.events, this.picked, t, cell);
      clearTimeout(this.fxTimer);
      if (!e) {
        this.stunned = t + PICKING.slip;
        this.slipped = true;
        this.fxTimer = setTimeout(() => { this.slipped = false; }, PICKING.slip);
        vibrate(4);
        return;
      }
      this.picked.add(e.id);
      this.got.push(e.kind);
      const before = tierOfPicks(this.streak).rank;
      this.streak = nextPick(this.streak, e.kind);
      const reached = tierOfPicks(this.streak);
      this.said[e.kind] = (this.said[e.kind] || 0) + 1;
      this.scene.pick(cell, { kind: e.kind, t, word: nth(BERRY_FX[e.kind].words, this.said[e.kind] - 1), tier: reached.rank > before ? reached : null });
      if (e.kind === 'guepes') {
        this.stunned = t + PICKING.stun;
        this.stung = true;
        this.fxTimer = setTimeout(() => { this.stung = false; }, PICKING.stun);
        vibrate([30, 40, 30]);
      } else vibrate(e.kind === 'cepe' ? [12, 30, 16] : 8);
      this.$emit('tally', { raw: this.got.reduce((s, k) => s + BERRIES[k].value, 0), detail: this.got.slice() });
    },
    finish() {
      if (this.ended) return;
      this.ended = true;
      this.now = this.span;
      this.$emit('end', this.picks.slice());
    },
    stop() {
      this.finish();
    }
  }
};
</script>

<style scoped src="./PickingBoard.css"></style>
