<template>
  <button
    type="button"
    :class="['island-clock', { 'is-warping': warping, 'is-night': night }]"
    :aria-label="ariaLabel"
    :aria-pressed="warping ? 'true' : 'false'"
    @click="$emit('warp')"
  >
    <!-- Cadran (dessin de la bibliothèque) : le ciel, la mer, l'arc du jour ; le soleil (ou la lune) à sa place -->
    <span :class="['island-clock__dial', { 'is-night': night }]" aria-hidden="true">
      <span :class="['island-clock__body', night ? 'is-moon' : 'is-sun']" :style="{ left: `${body.x - 6}px`, top: `${body.y - 6}px` }"></span>
    </span>
    <span class="island-clock__time">{{ time }}</span>
    <!-- Temps qu'il fait -->
    <svg class="island-clock__weather" viewBox="0 0 20 16" aria-hidden="true">
      <template v-if="weather === 'clair'">
        <g v-if="night"><path d="M12.5,3.2 A5.2,5.2 0 1 0 15.8,11.6 A4.2,4.2 0 1 1 12.5,3.2 Z" fill="#F4ECD0" stroke="#8C80C4" stroke-width=".8" /></g>
        <g v-else>
          <circle cx="10" cy="8" r="3.4" fill="#F2B23C" />
          <path d="M10,1.4 V3 M10,13 V14.6 M3.4,8 H5 M15,8 H16.6 M5.3,3.3 L6.4,4.4 M13.6,11.6 L14.7,12.7 M5.3,12.7 L6.4,11.6 M13.6,4.4 L14.7,3.3" stroke="#F2B23C" stroke-width="1.3" stroke-linecap="round" />
        </g>
      </template>
      <template v-else-if="weather === 'brume'">
        <path d="M3,5 H15 M5,8 H17 M3,11 H14" stroke="#9BA3AE" stroke-width="1.6" stroke-linecap="round" />
      </template>
      <template v-else>
        <circle v-if="weather === 'voile' && !night" cx="13.5" cy="5" r="3" fill="#F2B23C" />
        <path d="M5.2,11.5 A3,3 0 0 1 5.6,5.6 A4.2,4.2 0 0 1 13.6,6.4 A2.6,2.6 0 0 1 14.6,11.5 Z" :fill="weather === 'orage' ? '#8C93A3' : '#D6DCE4'" stroke="#7D8696" stroke-width=".8" stroke-linejoin="round" />
        <path v-if="weather === 'pluie'" d="M7,13 L6.2,15 M10,13 L9.2,15 M13,13 L12.2,15" stroke="#5AAED7" stroke-width="1.2" stroke-linecap="round" />
        <path v-if="weather === 'orage'" d="M10.6,11.2 L8.6,14 H10.6 L9.4,16 L12.6,12.6 H10.6 L11.8,11.2 Z" fill="#F2C04B" />
      </template>
    </svg>
    <span class="island-clock__label">{{ label }}</span>
  </button>
</template>

<script>
// Horloge de l'île : heure, soleil ou lune sur l'arc du jour, temps qu'il fait, moment de la journée. Son cadre de bois,
// son cadran, le soleil et la lune : la bibliothèque (design/bibliotheque/svg/hud).
// Un toucher fait défiler toute la journée en accéléré (l'île la joue), un autre la rend à l'heure.
export default {
  name: 'IslandClock',
  props: {
    time: { type: String, required: true },
    label: { type: String, required: true },
    // Temps : clair, voile, brume, pluie, orage ; weatherLabel : son nom
    weather: { type: String, default: 'clair' },
    weatherLabel: { type: String, default: '' },
    // Avancée du soleil (0 : lever, 1 : coucher) ou de la lune la nuit
    progress: { type: Number, default: 0.5 },
    night: { type: Boolean, default: false },
    warping: { type: Boolean, default: false }
  },
  emits: ['warp'],
  computed: {
    // Sur l'arc du cadran (40 × 24 : centre 20 ; 19,6, rayon 14,4), de l'est (lever) à l'ouest (coucher)
    body() {
      const a = Math.PI * Math.max(0, Math.min(1, this.progress));
      return { x: 20 - 14.4 * Math.cos(a), y: 19.6 - 14.4 * Math.sin(a) };
    },
    ariaLabel() {
      const now = `Sur ton île : ${this.time}, ${this.label.toLowerCase()}${this.weatherLabel ? `, ${this.weatherLabel.toLowerCase()}` : ''}.`;
      return this.warping ? `${now} La journée défile ; toucher pour revenir à l’heure.` : `${now} Toucher pour voir la journée défiler.`;
    }
  }
};
</script>

<style scoped src="./IslandClock.css"></style>
