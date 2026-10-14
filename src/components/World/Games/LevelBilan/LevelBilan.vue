<template>
  <!-- Le bilan d'un niveau : le coffret (ses pierres disent les étoiles), les trois étoiles qui claquent l'une après
       l'autre dans une gerbe d'or (immobiles en mouvement réduit), ce que l'objectif a donné, le bonus des étoiles
       nouvelles. Les étincelles et le mot de la dernière étoile vivent sur la scène commune (game/bilanFx.js) -->
  <div ref="root" class="bilan" role="status" :style="{ '--done': `${doneMs}ms` }">
    <img ref="box" :class="['bilan__box', { 'is-won': level.stars > 0 }]" :src="box" alt="" width="128" height="96" />
    <p class="bilan__stars" :aria-label="`${level.stars} étoile${level.stars > 1 ? 's' : ''} sur 3`">
      <img v-for="k in 3" :key="k" ref="stars" :src="starArt(k)" alt="" width="40" height="40" />
    </p>
    <p class="bilan__line">
      <strong>Niveau {{ level.level }}</strong> · {{ level.goal.text }}
    </p>
    <p class="bilan__verdict">{{ verdict }}</p>
    <p v-if="level.bonus" ref="bonus" class="bilan__bonus">+{{ level.bonus }} écus pour tes nouvelles étoiles</p>
    <p v-if="opened" ref="open" class="bilan__open">{{ opened }}</p>
    <canvas ref="fx" class="bilan__fx" aria-hidden="true"></canvas>
  </div>
</template>

<script>
import { openOf, seasonOf, LEVELS } from '@/game/levels';
import { gamePiece, gameFrame, gameSuiteMs } from '@/game/minigameArt';
import { STAR_MS, clapAt, tierOfStars, starBurst, goldRain, coinsPop, seasonSparkle } from '@/game/bilanFx';
import { createStage } from '@/game/stage/stage';
import { reducedMotion, vibrate } from '@/utils/fx';

export default {
  name: 'LevelBilan',
  props: {
    // Ce qu'a dit le serveur : { level, goal: { need, text }, stars, best, bonus } ; stages : les étoiles du jeu après
    // la partie (ce qui s'ouvre)
    level: { type: Object, required: true },
    stages: { type: Array, default: () => [] }
  },
  data() {
    return { t: reducedMotion() ? Infinity : 0 };
  },
  computed: {
    box() {
      return gamePiece('filon', `coffret_${Math.min(4, this.level.stars)}`);
    },
    verdict() {
      const { stars, best } = this.level;
      if (!stars) return best ? `Objectif manqué cette fois : ton record reste ${best} étoile${best > 1 ? 's' : ''}.` : 'Objectif manqué cette fois… La prochaine sera la bonne.';
      const said = ['', 'Objectif rempli !', 'Bien joué : de la marge !', 'Parfait : trois étoiles !'][stars];
      return stars < best ? `${said} (Ton record : ${best} étoiles.)` : said;
    },
    // L'instant où la dernière étoile gagnée claque (le coffret saute alors)
    doneMs() {
      return clapAt(Math.max(1, Math.min(3, this.level.stars)));
    },
    // Le niveau suivant ouvert par cette partie, ou la saison suivante
    opened() {
      const n = this.level.level;
      if (!this.level.stars || n >= LEVELS || this.level.best > this.level.stars) return '';
      if (openOf(this.stages).max <= n) return '';
      return seasonOf(n + 1) > seasonOf(n) ? `La saison ${seasonOf(n + 1)} s’ouvre !` : `Le niveau ${n + 1} t’attend.`;
    }
  },
  created() {
    this.timers = [];
  },
  mounted() {
    if (this.t === Infinity) return;
    this.party();
    const start = performance.now();
    const end = STAR_MS * 3 + gameSuiteMs('filon', 'etoile-gagnee');
    const tick = () => {
      this.t = performance.now() - start;
      if (this.t < end) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf);
    this.timers.forEach(clearTimeout);
    this.fx && this.fx.destroy();
  },
  methods: {
    starArt(k) {
      if (k > this.level.stars) return gamePiece('filon', 'etoile_vide');
      const ms = this.t - (k - 1) * STAR_MS;
      return ms < 0 ? gamePiece('filon', 'etoile_vide') : gameFrame('filon', 'etoile-gagnee', ms);
    },
    later(fn, ms) {
      this.timers.push(setTimeout(fn, ms));
    },
    // Le centre d'un élément, dans la scène
    spot(el) {
      const r = el.getBoundingClientRect(), o = this.$refs.root.getBoundingClientRect();
      return { x: r.left - o.left + r.width / 2, y: r.top - o.top + r.height / 2, w: r.width, h: r.height };
    },
    // La fête : chaque étoile gagnée claque dans sa gerbe, la dernière dit son palier (trois : la pluie d'or), puis les
    // écus des étoiles nouvelles tintent et la saison qui s'ouvre scintille
    party() {
      const stars = Math.min(3, this.level.stars);
      if (!stars) return;
      this.fx = createStage(this.$refs.fx, () => false);
      for (let k = 1; k <= stars; k++) {
        this.later(() => {
          const star = this.$refs.stars && this.$refs.stars[k - 1];
          if (!star) return;
          vibrate(k === stars ? [10, 30, 14] : 8);
          const box = this.spot(this.$refs.box);
          starBurst(this.fx, { ...this.spot(star), k, last: k === stars, word: tierOfStars(stars), at: { x: box.x, y: box.y - box.h * 0.3 } });
          if (k === 3) goldRain(this.fx);
        }, clapAt(k));
      }
      const end = clapAt(stars);
      this.later(() => this.$refs.bonus && coinsPop(this.fx, this.spot(this.$refs.bonus)), end + 320);
      this.later(() => this.$refs.open && seasonSparkle(this.fx, this.spot(this.$refs.open)), end + 560);
    }
  }
};
</script>

<style scoped src="./LevelBilan.css"></style>
