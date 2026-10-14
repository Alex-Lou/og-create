<template>
  <div class="harvest" role="dialog" aria-modal="true" aria-label="Récolte">
    <div class="harvest__card">
      <header class="harvest__head">
        <div>
          <span class="harvest__eyebrow">Récolte<template v-if="run.level"> · Niveau {{ run.level }}</template></span>
          <span class="harvest__title">{{ finished ? 'Récolte rentrée' : `${movesLeft} coup${movesLeft > 1 ? 's' : ''}` }}</span>
        </div>
        <button v-if="!finished" type="button" class="harvest__end" :disabled="sending || animating || quitting" @click="end">
          {{ moves.length ? 'Rentrer la récolte' : 'Quitter' }}
        </button>
      </header>

      <!-- Quitter sans un coup : la partie est perdue (elle ne compte ni pour les quêtes ni pour les visiteurs) -->
      <div v-if="quitting" class="harvest__quit" role="alertdialog" aria-label="Quitter la Récolte">
        <p>Quitter sans jouer ? La partie est perdue et ne compte pas.</p>
        <div class="harvest__quit-actions">
          <button type="button" class="harvest__btn harvest__btn--ghost" @click="quitting = false">Jouer</button>
          <button type="button" class="harvest__btn" @click="finish">Quitter quand même</button>
        </div>
      </div>

      <!-- Gains de la partie : estimés pendant le jeu, ceux du serveur à la fin -->
      <ul class="harvest__tally" aria-label="Gains">
        <li v-for="r in RESOURCES" :key="bump.id === r.id ? `${r.id}:${bump.n}` : r.id" :class="['harvest__res', { 'is-boost': run.boosts[r.id], 'is-bump': bump.id === r.id }]">
          <span aria-hidden="true"><ElementGlyph :glyph="r.glyph" /></span>
          <strong>{{ shown[r.id] }}</strong>
          <span class="oc-sr-only">{{ r.label }}</span>
          <em v-if="run.boosts[r.id]" class="harvest__boost" :title="`×${run.boosts[r.id]} ${BOOSTED_BY[r.id]}`">×{{ run.boosts[r.id] }}<span class="oc-sr-only"> {{ BOOSTED_BY[r.id] }}</span></em>
        </li>
      </ul>

      <!-- L'objectif du niveau (game/levels.js) ; la première fois, ce que sont les niveaux et les étoiles -->
      <p v-if="run.goal && !finished" class="harvest__goal">
        {{ run.goal.text }} · <strong>{{ Math.min(total, run.goal.need) }} / {{ run.goal.need }}</strong>
      </p>
      <p v-if="run.goal && !finished && !moves.length && firstTime" class="harvest__tip">
        Chaque partie a un objectif. Rempli, il donne 1 à 3 étoiles selon les coups qu’il te reste ; une étoile ouvre le niveau suivant.
      </p>
      <div v-if="!finished" class="harvest__hint" aria-live="polite">
        <template v-if="path.length >= MIN_CHAIN">Chaîne de {{ path.length }} : +{{ preview.amount }} <ElementGlyph :glyph="GLYPH[preview.kind]" /></template>
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
        <!-- La scène : les tuiles, la chaîne, les éclats et les mots du coup (harvestScene.js), débordant un peu du plateau -->
        <canvas ref="stage" class="harvest__stage" :style="{ '--m': `${MARGIN}px` }" aria-hidden="true"></canvas>
      </div>

      <div v-else class="harvest__result">
        <p v-if="error" class="harvest__error" role="alert">{{ error }}</p>
        <p v-else-if="sending" class="harvest__wait">Le serveur pèse ta récolte…</p>
        <p v-else-if="!moves.length" class="harvest__done">Partie quittée sans jouer : elle est perdue.</p>
        <p v-else class="harvest__done">Ta récolte rejoint les réserves de l’île.</p>
        <p v-if="earned && !error && !sending" class="harvest__coins">
          +{{ earned }} <ElementGlyph glyph="ui:coin" /> <span>{{ earned > 1 ? 'écus' : 'écu' }} : un pour chaque dizaine de ressources</span>
        </p>
        <p v-if="chest && !error && !sending" class="harvest__chest">Un coffre {{ chestLabel }} est tombé ! Il s’ouvre au retour sur l’île.</p>
        <LevelBilan v-if="level && !error && !sending" :level="level" :stages="stages" />
        <!-- (une partie de la réserve ; un coffre tombé s'ouvre d'abord au retour sur l'île) -->
        <div v-if="level && charges && !chest && !sending" class="harvest__again">
          <!-- (pendant le tutoriel, grisés : la main ramène à l'île, où Brume attend avec la récompense) -->
          <button v-if="nextLevel" type="button" :class="['harvest__btn', { 'is-locked': tutorial }]" :disabled="tutorial" @click="$emit('again', nextLevel)">Niveau {{ nextLevel }}</button>
          <button type="button" :class="['harvest__btn', 'harvest__btn--ghost', { 'is-locked': tutorial }]" :disabled="tutorial" @click="$emit('again', level.level)">Rejouer ce niveau</button>
        </div>
        <button type="button" class="harvest__btn" data-coach="harvest-close" :disabled="sending" @click="$emit('close')">Retour à l’île</button>
      </div>
    </div>
  </div>
</template>

<script>
import { SIZE, MIN_CHAIN, MOON, MOON_FROM, create, play, gainOf, kindOfPath, streakAfter, streakOf as streakBonus } from '@/game/harvest';
import { vibrate, reducedMotion } from '@/utils/fx';
import { GLYPH, RESOURCES } from '@/game/resources';
import { BOOSTED_BY } from '@/texts/village';
import { RARITY } from '@/world/chest';
import ElementGlyph from '@/components/ui/ElementGlyph/ElementGlyph.vue';
import LevelBilan from '../LevelBilan/LevelBilan.vue';
import { openOf } from '@/game/levels';
import holdsGuide from '@/game/holdsGuide';
import { tierOf, wordOf, streakOf } from '@/game/harvestFx';
import { createHarvestScene, MARGIN } from './harvestScene';

// Après un coup, le doigt reprend la main dès que les colonnes commencent à tomber (ms)
const UNLOCK_MS = 140;
// La pression d'un coup dans la main, selon son palier (game/harvestFx.js)
const HAPTICS = [12, 12, [14, 30, 14], [14, 30, 14, 30, 22], [16, 30, 16, 30, 16, 30, 28], [20, 30, 20, 30, 20, 30, 40]];

// Récolte : le plateau vient de la graine du serveur ; les coups joués lui sont renvoyés à la fin,
// il les rejoue et décide seul du gain (result). Le moteur est partagé avec le serveur.
export default {
  name: 'HarvestGame',
  mixins: [holdsGuide],
  components: { ElementGlyph, LevelBilan },
  props: {
    run: { type: Object, required: true },
    sending: { type: Boolean, default: false },
    // Rareté du coffre tombé pendant la partie ('' : aucun)
    chest: { type: String, default: '' },
    result: { type: Object, default: null },
    // Écus de la partie (1 par tranche de 10 ressources), donnés par le serveur à la fin
    earned: { type: Number, default: 0 },
    error: { type: String, default: '' },
    // Le niveau joué, vu du serveur à la fin ({ level, goal, stars, best, bonus }) ; les étoiles des 30 niveaux ; les
    // parties en réserve (pour rejouer depuis le bilan)
    level: { type: Object, default: null },
    stages: { type: Array, default: () => [] },
    charges: { type: Number, default: 0 },
    // Le tutoriel est en cours : ni niveau suivant ni partie rejouée depuis le bilan
    tutorial: { type: Boolean, default: false }
  },
  emits: ['finish', 'again', 'close'],
  data() {
    return {
      MIN_CHAIN, GLYPH, RESOURCES, MARGIN, BOOSTED_BY,
      path: [],
      moves: [],
      gains: { stone: 0, wood: 0, water: 0, food: 0 },
      animating: false,
      finished: false,
      // « Quitter » touché sans avoir joué : on demande d'abord
      quitting: false,
      // La ressource dont le compteur vient de bondir (n : pour rejouer son bond)
      bump: { id: null, n: 0 },
      // Le rang du dernier coup dans sa série (règles 2 : game/harvest.js), 0 hors série
      streak: 0
    };
  },
  computed: {
    chestLabel() {
      return (RARITY[this.chest] || RARITY.commun).label.toLowerCase();
    },
    movesLeft() {
      return this.run.maxMoves - this.moves.length;
    },
    // Les ressources de la partie (l'objectif du niveau)
    total() {
      return Object.values(this.gains).reduce((a, b) => a + b, 0);
    },
    // Aucune étoile encore : la bulle qui explique les niveaux
    firstTime() {
      return !openOf(this.stages).stars;
    },
    nextLevel() {
      const done = this.level;
      if (!done || !done.best) return null;
      return done.level + 1 <= openOf(this.stages).max ? done.level + 1 : null;
    },
    picked() {
      return new Set(this.path.map(([x, y]) => y * SIZE + x));
    },
    // Les règles de la partie (celles que le serveur rejouera ; 1 sans elles)
    rules() {
      return this.run.rules || 1;
    },
    // Ce que la chaîne en cours rapporterait (la lune et la série comprises : comme le serveur le trouvera)
    preview() {
      const kind = this.path.length ? kindOfPath(this.game.board, this.path) : null;
      return kind ? { kind, amount: this.chainGain(this.path).amount } : { amount: 0, kind: 'stone' };
    },
    shown() {
      return this.result || this.gains;
    }
  },
  watch: {
    // (la scène suit la chaîne en cours)
    path(next) {
      if (this.scene) this.scene.setPath(next);
    },
    // Le bilan remplace le plateau : la scène s'arrête
    finished(done) {
      if (done) this.stopScene();
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
  },
  mounted() {
    // (règles 2 : la lune aussi, dessinée dans la bibliothèque comme les autres sortes ; tant qu'elle n'y est pas, la scène
    // la peint en case pâle)
    const kinds = [...new Set(this.run.kinds), ...(this.rules >= 2 ? [MOON] : [])];
    this.scene = createHarvestScene(this.$refs.stage, { kinds, reduced: reducedMotion() });
    this.scene.set(this.layout());
    this.scene.bake();
  },
  beforeUnmount() {
    clearTimeout(this.timer);
    this.stopScene();
  },
  methods: {
    stopScene() {
      if (this.scene) this.scene.destroy();
      this.scene = null;
    },
    // Les tuiles du plateau : [{ id, kind, x, y }]
    layout() {
      const out = [];
      for (let y = 0; y < SIZE; y++) for (let x = 0; x < SIZE; x++) out.push({ id: this.ids[y][x], kind: this.game.board[y][x], x, y });
      return out;
    },
    // La case sous le doigt (seul le cœur d'une case compte : les diagonales se prennent sans accrocher les voisines)
    cellAt(event) {
      return this.scene ? this.scene.cellAt(event.clientX, event.clientY) : null;
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
      // (la sorte de la chaîne : sa première tuile qui n'est pas une lune ; une lune va dans toute chaîne)
      const kind = kindOfPath(this.game.board, this.path);
      const tile = this.game.board[y][x];
      const sameKind = tile === MOON || kind === null || tile === kind;
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
    // Le gain d'une chaîne, comme le moteur le compte (streak : son rang dans la série si elle était jouée)
    chainGain(path, streak = streakAfter(this.streak, path.length)) {
      const board = this.game.board;
      const moons = path.filter(([x, y]) => board[y][x] === MOON).length;
      return gainOf(kindOfPath(board, path), path.length, this.run.boosts, { moons, streak, rules: this.rules });
    },
    // Coup joué : les tuiles éclatent une à une et le coup dit son mot, puis les colonnes tombent et le haut se remplit
    commit(path) {
      const kind = kindOfPath(this.game.board, path);
      if (!kind) {
        this.path = [];
        return;
      }
      const gain = this.chainGain(path);
      this.streak = streakAfter(this.streak, path.length);
      // (règles 2 : le multiplicateur de la série que ce coup a compté, ×1 hors série)
      const bonus = this.rules >= 2 ? streakBonus(this.streak) : 1;
      // (règles 2 : une longue chaîne laisse une lune sur sa dernière case, qui reste et tombe avec les tuiles gardées)
      const moon = this.rules >= 2 && path.length >= MOON_FROM ? path[path.length - 1] : null;
      this.moves.push(path.map(([x, y]) => [x, y]));
      this.path = [];
      this.animating = true;
      vibrate(HAPTICS[tierOf(path.length).rank]);
      const popMs = this.scene.pop({ path, kind, word: wordOf(kind, this.moves.length - 1), amount: gain.amount, streak: streakOf(this.moves.map(m => m.length)), moon, bonus });
      this.timer = setTimeout(() => {
        // le compteur de la ressource bondit quand le gain y arrive
        this.gains = { ...this.gains, [gain.resource]: this.gains[gain.resource] + gain.amount };
        this.bump = { id: gain.resource, n: this.bump.n + 1 };
        const removed = new Set(path.filter(cell => cell !== moon).map(([x, y]) => y * SIZE + x));
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
        play(this.game, path, this.rules);
        if (this.game.shuffled) {
          for (let y = 0; y < SIZE; y++) {
            for (let x = 0; x < SIZE; x++) {
              this.ids[y][x] = this.nextId++;
              fresh.add(this.ids[y][x]);
            }
          }
          for (let x = 0; x < SIZE; x++) drops[x] = SIZE;
        }
        const fallMs = this.scene ? this.scene.fall(this.layout(), fresh, drops, this.game.shuffled) : 0;
        // (le doigt reprend la main dès que les colonnes tombent : le plateau, lui, est déjà joué)
        this.timer = setTimeout(() => {
          this.animating = false;
          if (this.movesLeft <= 0) this.finish();
        }, Math.min(fallMs, UNLOCK_MS));
      }, popMs);
    },
    // Rentrer la récolte ; sans un coup joué, on demande d'abord (la partie serait perdue)
    end() {
      if (this.moves.length) this.finish();
      else this.quitting = true;
    },
    finish() {
      if (this.finished) return;
      this.finished = true;
      this.quitting = false;
      this.$emit('finish', this.moves);
    }
  }
};
</script>

<style scoped src="./HarvestGame.css"></style>
