<template>
  <canvas ref="canvas" class="living-bg" aria-hidden="true"></canvas>
</template>

<script>
import { reducedMotion } from '@/utils/fx';
import LivingBackground from '@/utils/livingBackground';

// Fond vivant plein écran, piloté par la progression (ère, population, couleurs)
export default {
  name: 'LivingBackground',
  props: {
    era: { type: Number, default: 1 },
    population: { type: Number, default: 40 },
    palette: { type: Array, default: () => [] }
  },
  watch: {
    era: 'configure',
    population: 'configure',
    palette: 'configure'
  },
  mounted() {
    this.engine = new LivingBackground(this.$refs.canvas, { reducedMotion: reducedMotion() });
    this.configure();
    this.engine.start();
    this.onResize = () => this.engine.resize();
    // En arrière-plan (onglet caché) : aucune animation
    this.onVisibility = () => (document.hidden ? this.engine.stop() : this.engine.start());
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);
  },
  beforeUnmount() {
    this.engine.stop();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  },
  methods: {
    configure() {
      this.engine?.configure({ era: this.era, population: this.population, palette: this.palette });
    },
    // Coordonnées écran (clientX/clientY)
    burst(x, y) {
      this.engine?.burst(x, y);
    }
  }
};
</script>

<style scoped>
.living-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
  z-index: 0;
  /* Un filigrane sur le vélin : présent, jamais au premier plan */
  opacity: 0.3;
}
</style>
