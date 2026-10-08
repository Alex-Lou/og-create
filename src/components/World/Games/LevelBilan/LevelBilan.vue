<template>
  <!-- Le bilan d'un niveau : le coffret (ses pierres disent les étoiles), les trois étoiles qui claquent l'une après
       l'autre (immobiles en mouvement réduit), ce que l'objectif a donné, le bonus des étoiles nouvelles -->
  <div class="bilan" role="status">
    <img class="bilan__box" :src="box" alt="" width="128" height="96" />
    <p class="bilan__stars" :aria-label="`${level.stars} étoile${level.stars > 1 ? 's' : ''} sur 3`">
      <img v-for="k in 3" :key="k" :src="starArt(k)" alt="" width="40" height="40" />
    </p>
    <p class="bilan__line">
      <strong>Niveau {{ level.level }}</strong> · {{ level.goal.text }}
    </p>
    <p class="bilan__verdict">{{ verdict }}</p>
    <p v-if="level.bonus" class="bilan__bonus">+{{ level.bonus }} écus pour tes nouvelles étoiles</p>
    <p v-if="opened" class="bilan__open">{{ opened }}</p>
  </div>
</template>

<script>
import { openOf, seasonOf, LEVELS } from '@/game/levels';
import { gamePiece, gameFrame, gameSuiteMs } from '@/game/minigameArt';
import { reducedMotion } from '@/utils/fx';

// Une étoile claque toutes les 450 ms
const STEP_MS = 450;

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
    // Le niveau suivant ouvert par cette partie, ou la saison suivante
    opened() {
      const n = this.level.level;
      if (!this.level.stars || n >= LEVELS || this.level.best > this.level.stars) return '';
      if (openOf(this.stages).max <= n) return '';
      return seasonOf(n + 1) > seasonOf(n) ? `La saison ${seasonOf(n + 1)} s’ouvre !` : `Le niveau ${n + 1} t’attend.`;
    }
  },
  mounted() {
    if (this.t === Infinity) return;
    const start = performance.now();
    const end = STEP_MS * 3 + gameSuiteMs('filon', 'etoile-gagnee');
    const tick = () => {
      this.t = performance.now() - start;
      if (this.t < end) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.raf);
  },
  methods: {
    starArt(k) {
      if (k > this.level.stars) return gamePiece('filon', 'etoile_vide');
      const ms = this.t - (k - 1) * STEP_MS;
      return ms < 0 ? gamePiece('filon', 'etoile_vide') : gameFrame('filon', 'etoile-gagnee', ms);
    }
  }
};
</script>

<style scoped src="./LevelBilan.css"></style>
