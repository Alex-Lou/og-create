<template>
  <div class="mini" role="dialog" aria-modal="true" :aria-label="game.name">
    <div class="mini__card">
      <header class="mini__head">
        <div>
          <span class="mini__eyebrow">{{ game.name }} · {{ siteName }}</span>
          <span class="mini__title" aria-live="polite">{{ title }}</span>
        </div>
        <button v-if="phase === 'play'" type="button" class="mini__end" @click="stop">Arrêter</button>
        <button v-else-if="phase !== 'count'" type="button" class="mini__end mini__end--quiet" :disabled="sending" @click="$emit('close')">Fermer</button>
      </header>

      <!-- Avant la partie : la règle, les parties en réserve, ce que la partie peut rapporter -->
      <div v-if="phase === 'intro'" class="mini__intro">
        <div class="mini__art" aria-hidden="true">
          <GameIcon v-for="(kind, k) in ART[game.id]" :key="kind" :kind="kind" :size="k === 1 ? 64 : 46" />
        </div>
        <p class="mini__rule">{{ game.text }}</p>
        <ul class="mini__rules">
          <li v-for="line in RULES[game.id]" :key="line">{{ line }}</li>
        </ul>
        <ul class="mini__facts">
          <li><span>Parties</span><strong>{{ game.plays }} / {{ game.max }}</strong></li>
          <li><span>Gains du palier</span><strong>×{{ multText }} · jusqu’à {{ game.cap }} écus</strong></li>
        </ul>
        <p v-if="error" class="mini__error" role="alert">{{ error }}</p>
        <button type="button" class="mini__btn" :disabled="starting || !game.plays" @click="$emit('start')">
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
          <button v-if="!sending && game.plays" type="button" class="mini__btn mini__btn--quiet" :disabled="starting" @click="$emit('start')">Rejouer · {{ game.plays }}</button>
          <button type="button" class="mini__btn" :disabled="sending" @click="$emit('close')">Retour à l’île</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameIcon from './GameIcon.vue';
import FishingBoard from './FishingBoard.vue';
import VeinBoard from './VeinBoard.vue';
import PickingBoard from './PickingBoard.vue';
import { earnedOf, multOf } from '@/game/minigames';
import { roman } from '@/utils/roman';
import { reducedMotion } from '@/utils/fx';

const BOARDS = { peche: FishingBoard, filon: VeinBoard, cueillette: PickingBoard };
const TIMED = new Set(['peche', 'cueillette']);
const ART = { peche: ['gardon', 'dore', 'truite'], filon: ['amethyste', 'diamant', 'rubis'], cueillette: ['fraise', 'cepe', 'mure'] };
const RULES = {
  peche: ['45 secondes, trois couloirs d’eau.', 'Gardon 2, truite 4, poisson doré 10 ; la vieille botte ne vaut rien.', 'Après un lancer, la ligne reste un instant à l’eau.'],
  filon: ['26 coups de pioche ; les blocs sombres sont plus durs.', 'On creuse depuis le haut, à côté d’un bloc ouvert.', 'Quartz 3, améthyste 5, rubis 8, diamant 16.'],
  cueillette: ['40 secondes, seize buissons.', 'Mûre 1, fraise et myrtille 2, cèpe doré 6.', 'Un buisson vide fait perdre un instant, les guêpes bien plus.']
};
const COUNT_MS = 650;

// Mini-jeu d'un bâtiment : la règle, puis la partie (graine du serveur, plateau du jeu), puis le gain que le serveur a
// pesé en rejouant les gestes. L'île lance (start) et rend (finish) la partie ; cette fenêtre ne fait que jouer et montrer.
export default {
  name: 'MiniGame',
  components: { GameIcon },
  props: {
    // Vue du serveur : { id, name, text, plays, max, nextIn, mult, cap }
    game: { type: Object, required: true },
    siteName: { type: String, default: '' },
    run: { type: Object, default: null },
    starting: { type: Boolean, default: false },
    sending: { type: Boolean, default: false },
    result: { type: Object, default: null },
    error: { type: String, default: '' }
  },
  emits: ['start', 'finish', 'close'],
  data() {
    return { BOARDS, ART, RULES, phase: 'intro', count: 3, tally: { raw: 0, detail: [] } };
  },
  computed: {
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
    nextText() {
      if (this.game.nextIn === null) return '';
      const min = Math.ceil(this.game.nextIn / 60000);
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
  beforeUnmount() {
    clearTimeout(this.countTimer);
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

<style scoped>
.mini {
  position: fixed; inset: 0; z-index: 80; display: flex; align-items: center; justify-content: center;
  padding: 16px; background: rgba(10, 8, 6, .72); font-family: var(--font-ui);
}
.mini__card {
  width: min(100%, 440px); max-height: 100%; overflow-y: auto; padding: 16px; border-radius: 26px;
  background: var(--vellum-100); color: var(--ink-900); box-shadow: 0 24px 60px rgba(0, 0, 0, .5);
}
.mini__head { display: flex; align-items: flex-end; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.mini__eyebrow { display: block; font-size: 11px; font-weight: 900; letter-spacing: .16em; text-transform: uppercase; color: var(--ink-500); }
.mini__title { display: block; font-family: var(--font-display); font-size: 24px; font-weight: 700; line-height: 1.1; font-variant-numeric: tabular-nums; }
.mini__end {
  min-height: 38px; padding: 6px 14px; border: 0; border-radius: 999px; background: var(--ink-900); color: var(--vellum-50);
  font: inherit; font-weight: 900; font-size: 13px; cursor: pointer;
}
.mini__end--quiet { background: var(--vellum-200); color: var(--ink-900); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .18); }
.mini__end:disabled { opacity: .5; cursor: default; }
.mini__intro { display: grid; gap: 12px; }
.mini__art { display: flex; align-items: flex-end; justify-content: center; gap: 4px; padding: 14px 0 10px; border-radius: 18px; background: radial-gradient(circle at 50% 70%, #FFF4D6, var(--vellum-200) 72%); }
.mini__rule { margin: 0; font-weight: 800; font-size: 15px; line-height: 1.4; text-align: center; }
.mini__rules { margin: 0; padding-left: 18px; display: grid; gap: 4px; color: var(--ink-700); font-size: 13px; font-weight: 700; line-height: 1.4; }
.mini__facts { margin: 0; padding: 0; list-style: none; display: grid; gap: 6px; }
.mini__facts li { display: flex; justify-content: space-between; gap: 10px; padding: 8px 12px; border-radius: 12px; background: var(--vellum-50); font-size: 13px; font-weight: 700; }
.mini__facts strong { font-weight: 900; }
.mini__btn {
  min-height: 48px; padding: 10px 22px; border: 0; border-radius: 999px; cursor: pointer;
  background: linear-gradient(180deg, var(--gold-300), var(--gold-500)); color: var(--ink-900);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .6), 0 3px 0 var(--gold-600);
  font: inherit; font-weight: 900; font-size: 16px;
}
.mini__btn--quiet { background: var(--vellum-200); box-shadow: inset 0 0 0 1px rgba(74, 52, 38, .18); }
.mini__btn:disabled { opacity: .5; cursor: default; }
.mini__stage { position: relative; }
.mini__count { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
.mini__count span {
  font-family: var(--font-display); font-size: 64px; font-weight: 800; color: #FFFFFF;
  text-shadow: 0 4px 0 rgba(0, 0, 0, .25), 0 0 24px rgba(0, 0, 0, .35); animation: mini-count .65s ease both;
}
.mini__result { display: grid; justify-items: center; gap: 12px; padding: 10px 0 2px; text-align: center; }
.mini__earned { display: inline-flex; align-items: center; gap: 10px; margin: 0; font-family: var(--font-display); font-size: 36px; font-weight: 800; animation: mini-count .5s ease both; }
.mini__coin { width: 30px; height: 30px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #FFE7A0, #E9AE2E 70%); box-shadow: inset 0 0 0 2px rgba(59, 42, 32, .5); }
.mini__haul { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 14px; margin: 0; padding: 0; list-style: none; }
.mini__haul li { display: inline-flex; align-items: center; gap: 4px; font-size: 15px; font-weight: 900; }
.mini__note, .mini__wait { margin: 0; color: var(--ink-500); font-size: 13px; font-weight: 700; }
.mini__wait { font-style: italic; }
.mini__error { margin: 0; color: #A2412B; font-weight: 800; }
.mini__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; }
@keyframes mini-count { from { transform: scale(1.6); opacity: 0; } 40% { opacity: 1; } to { transform: none; opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .mini__count span, .mini__earned { animation: none; }
}
</style>
