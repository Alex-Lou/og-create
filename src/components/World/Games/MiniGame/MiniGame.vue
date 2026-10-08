<template>
  <div class="mini" role="dialog" aria-modal="true" :aria-label="game.name">
    <div class="mini__card">
      <header class="mini__head">
        <div>
          <span class="mini__eyebrow">{{ game.name }} · {{ playing && run && run.stage ? `Niveau ${run.stage} · ${progress} / ${run.goal.need}` : siteName }}</span>
          <span class="mini__title" aria-live="polite">{{ title }}</span>
        </div>
        <button v-if="phase === 'play'" type="button" class="mini__end" @click="stop">Arrêter</button>
        <button v-else-if="phase !== 'count'" type="button" class="mini__end mini__end--quiet" :disabled="sending" @click="$emit('close')">Fermer</button>
      </header>

      <!-- Avant la partie : la règle, les parties en réserve, ce que la partie peut rapporter -->
      <div v-if="phase === 'intro'" class="mini__intro">
        <div class="mini__art" aria-hidden="true">
          <span v-if="gesture" class="mini__master">
            <img v-for="(src, k) in gesture" :key="src" :src="src" alt="" :class="{ 'is-off': k !== gestureFrame }" />
          </span>
          <GameIcon v-for="(kind, k) in ART[game.id]" :key="kind" :kind="kind" :size="k === 1 ? 64 : 46" />
        </div>
        <p class="mini__rule">{{ game.text }}</p>
        <ul class="mini__rules">
          <li v-for="line in RULES[game.id]" :key="line">{{ line }}</li>
        </ul>
        <!-- Les jeux à grille : le niveau de la partie et son objectif (design/conception/minijeux_grille.md) -->
        <LevelPicker v-if="grid" v-model="chosen" :game="game.id" :stages="stages" />
        <p class="mini__regen">Une partie revient toutes les {{ regenHours }} h, {{ game.max }} au plus.</p>
        <ul class="mini__facts">
          <li>
            <span>Parties</span>
            <strong>{{ game.plays }} / {{ game.max }}<template v-if="game.plays && nextText"> · une de plus {{ nextText }}</template></strong>
          </li>
          <li><span>Gains du palier</span><strong>×{{ multText }} · jusqu’à {{ game.cap }} écus</strong></li>
        </ul>
        <p v-if="error" class="mini__error" role="alert">{{ error }}</p>
        <button type="button" class="mini__btn" :disabled="starting || !game.plays" @click="$emit('start', grid ? chosen : null)">
          {{ game.plays ? (starting ? 'Un instant…' : 'Commencer') : `Prochaine partie ${nextText}` }}
        </button>
      </div>

      <!-- La partie (compte à rebours d'abord pour les jeux chronométrés) -->
      <div v-else-if="phase === 'count' || phase === 'play'" class="mini__stage">
        <component :is="BOARDS[game.id]" ref="board" :seed="run.seed" :playing="phase === 'play'" @tally="onTally" @end="onEnd" />
        <div v-if="phase === 'count'" class="mini__count" aria-live="assertive"><span :key="count">{{ count || 'Partez !' }}</span></div>
      </div>

      <!-- Le résultat, pesé par le serveur -->
      <div v-else class="mini__result">
        <p v-if="error" class="mini__error" role="alert">{{ error }}</p>
        <p v-else-if="sending || !result" class="mini__wait">Le serveur compte tes prises…</p>
        <template v-else>
          <LevelBilan v-if="result.level" :level="result.level" :stages="stages" />
          <p class="mini__earned"><span class="mini__coin" aria-hidden="true"></span>+{{ result.earned }} écus</p>
          <ul v-if="haul.length" class="mini__haul" aria-label="Prises">
            <li v-for="h in haul" :key="h.kind"><GameIcon :kind="h.kind" :size="30" /><strong>×{{ h.n }}</strong></li>
          </ul>
          <p v-else class="mini__wait">Rien cette fois… La prochaine sera la bonne.</p>
          <p class="mini__note">
            Prises : {{ result.raw }}<template v-if="run.level > 3"> · ×{{ multText }} au palier {{ roman(run.level) }}</template><template v-if="capped"> · plafond de la partie atteint</template>
          </p>
        </template>
        <div class="mini__actions">
          <button v-if="!sending && game.plays && nextLevel" type="button" class="mini__btn" :disabled="starting" @click="$emit('start', nextLevel)">Niveau {{ nextLevel }}</button>
          <button v-if="!sending && game.plays" type="button" class="mini__btn mini__btn--quiet" :disabled="starting" @click="$emit('start', run && run.stage ? run.stage : null)">Rejouer · {{ game.plays }}</button>
          <button type="button" class="mini__btn" :disabled="sending" @click="$emit('close')">Retour à l’île</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameIcon from '../GameIcon/GameIcon.vue';
import LevelPicker from '../LevelPicker/LevelPicker.vue';
import LevelBilan from '../LevelBilan/LevelBilan.vue';
import { GAMES as GRID, openOf } from '@/game/levels';
import FishingBoard from '../FishingBoard/FishingBoard.vue';
import VeinBoard from '../VeinBoard/VeinBoard.vue';
import PickingBoard from '../PickingBoard/PickingBoard.vue';
import { earnedOf, multOf, PLAY_REGEN_MS } from '@/game/minigames';
import { roman } from '@/utils/roman';
import { reducedMotion } from '@/utils/fx';
import { masterGesture } from '@/world/masterArt';

const BOARDS = { peche: FishingBoard, filon: VeinBoard, cueillette: PickingBoard };
const TIMED = new Set(['peche', 'cueillette']);
const ART = { peche: ['gardon', 'dore', 'truite'], filon: ['amethyste', 'diamant', 'rubis'], cueillette: ['fraise', 'cepe', 'mure'] };
const RULES = {
  peche: ['45 secondes, trois couloirs d’eau.', 'Gardon 2, truite 4, poisson doré 10 ; la vieille botte ne vaut rien.', 'Après un lancer, la ligne reste un instant à l’eau.'],
  filon: ['26 coups de pioche ; les blocs sombres sont plus durs.', 'On creuse depuis le haut, à côté d’un bloc ouvert.', 'Quartz 3, améthyste 5, rubis 8, diamant 16.'],
  cueillette: ['40 secondes, seize buissons.', 'Mûre 1, fraise et myrtille 2, cèpe doré 6.', 'Un buisson vide fait perdre un instant, les guêpes bien plus.']
};
const COUNT_MS = 650;
// Le maître du bâtiment fait le geste du jeu (bibliothèque, quotidien.json) : ses deux images, 700 puis 1 100 ms
const GESTURE = { peche: ['ponton', 'pecher'], filon: ['carriere', 'piocher'], cueillette: ['bosquet', 'cueillir'] };
const GESTURE_MS = [700, 1100];

// Mini-jeu d'un bâtiment : la règle, puis la partie (graine du serveur, plateau du jeu), puis le gain que le serveur a
// pesé en rejouant les gestes. L'île lance (start) et rend (finish) la partie ; cette fenêtre ne fait que jouer et montrer.
export default {
  name: 'MiniGame',
  components: { GameIcon, LevelPicker, LevelBilan },
  props: {
    // Vue du serveur : { id, name, text, plays, max, nextIn, mult, cap }
    game: { type: Object, required: true },
    // Temps passé depuis cette vue du serveur (ms) : le compte à rebours avance
    elapsed: { type: Number, default: 0 },
    siteName: { type: String, default: '' },
    run: { type: Object, default: null },
    starting: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
    result: { type: Object, default: null },
    error: { type: String, default: '' },
    // Les étoiles des 30 niveaux de ce jeu, s'il est à grille (vue du serveur : stages)
    stages: { type: Array, default: () => [] }
  },
  emits: ['start', 'finish', 'close'],
  data() {
    // chosen : le niveau choisi (le plus haut ouvert d'abord)
    return { BOARDS, ART, RULES, phase: 'intro', count: 3, tally: { raw: 0, detail: [] }, gestureFrame: 0, chosen: openOf(this.stages).max };
  },
  computed: {
    grid() {
      return GRID.includes(this.game.id);
    },
    playing() {
      return this.phase === 'play' || this.phase === 'count';
    },
    // L'objectif en cours : les pierres trouvées, les cueillettes (sans les guêpes)
    progress() {
      return this.tally.detail.filter(kind => kind !== 'guepes').length;
    },
    // Le niveau suivant, s'il vient de s'ouvrir ou l'était déjà (après une partie réussie)
    nextLevel() {
      const done = this.result && this.result.level;
      if (!done || !done.best) return null;
      return done.level + 1 <= openOf(this.stages).max ? done.level + 1 : null;
    },
    gesture() {
      const g = GESTURE[this.game.id];
      return g ? masterGesture(...g) : null;
    },
    multText() {
      return String(this.run ? multOf(this.run.level) : this.game.mult).replace('.', ',');
    },
    estimate() {
      return this.run ? earnedOf(this.tally.raw, this.run.level) : 0;
    },
    title() {
      if (this.phase === 'intro') return this.game.plays ? 'Prêt ?' : 'Plus de partie';
      if (this.phase === 'count') return 'Attention…';
      if (this.phase === 'play') return `${this.estimate} écu${this.estimate > 1 ? 's' : ''}`;
      return this.result ? `+${this.result.earned} écus` : 'Partie finie';
    },
    regenHours() {
      return PLAY_REGEN_MS / 3600000;
    },
    nextText() {
      if (this.game.nextIn === null) return '';
      const min = Math.max(1, Math.ceil((this.game.nextIn - this.elapsed) / 60000));
      return min >= 60 ? `dans ${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}` : `dans ${min} min`;
    },
    // Prises regroupées, dans l'ordre des valeurs
    haul() {
      const counts = new Map();
      for (const kind of this.result ? this.result.detail : []) counts.set(kind, (counts.get(kind) || 0) + 1);
      return [...counts].map(([kind, n]) => ({ kind, n }));
    },
    capped() {
      return this.result && this.run && Math.round(this.result.raw * multOf(this.run.level)) > this.result.earned;
    }
  },
  watch: {
    // Partie lancée par le serveur : compte à rebours (jeux chronométrés), puis le jeu
    run(run, before) {
      if (!run || (before && before.id === run.id)) return;
      this.tally = { raw: 0, detail: [] };
      if (!TIMED.has(this.game.id) || reducedMotion()) {
        this.phase = 'play';
        return;
      }
      this.phase = 'count';
      this.count = 3;
      const tick = () => {
        this.count -= 1;
        if (this.count >= 0) this.countTimer = setTimeout(tick, COUNT_MS);
        else this.phase = 'play';
      };
      this.countTimer = setTimeout(tick, COUNT_MS);
    }
  },
  mounted() {
    // (en mouvement réduit, il reste sur sa première image)
    if (!this.gesture || reducedMotion()) return;
    const tick = () => {
      this.gestureFrame = 1 - this.gestureFrame;
      this.gestureTimer = setTimeout(tick, GESTURE_MS[this.gestureFrame]);
    };
    this.gestureTimer = setTimeout(tick, GESTURE_MS[0]);
  },
  beforeUnmount() {
    clearTimeout(this.countTimer);
    clearTimeout(this.gestureTimer);
  },
  methods: {
    roman,
    onTally(tally) {
      this.tally = tally;
    },
    onEnd(input) {
      this.phase = 'done';
      this.$emit('finish', input);
    },
    stop() {
      if (this.$refs.board) this.$refs.board.stop();
    }
  }
};
</script>

<style scoped src="./MiniGame.css"></style>
