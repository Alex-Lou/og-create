<template>
  <!-- L'arrivée sur l'île : Brume veille pendant que la première vue se prépare (sol, décor, bâtiments, habitants), avec
       ce qui est déjà prêt ; App.vue l'efface quand la vue l'est (6 s au plus) -->
  <!-- (une barre de progression, et non une zone annoncée : les comptes changent plusieurs fois par seconde) -->
  <div class="island-loader">
    <BrumeWisp class="island-loader__wisp" :size="64" :stage="stage" />
    <p id="island-loader-title" class="island-loader__title">L’île sort de la brume…</p>
    <div class="island-loader__bar" role="progressbar" aria-labelledby="island-loader-title" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent">
      <span :style="{ width: `${percent}%` }"></span>
    </div>
    <ul class="island-loader__steps">
      <li v-for="step in steps" :key="step.id" :class="['island-loader__step', { 'is-done': step.done }]">
        <span class="island-loader__label">{{ step.label }}</span>
        <span v-if="step.count" class="island-loader__count">{{ step.count[0] }}/{{ step.count[1] }}</span>
        <span v-else class="island-loader__mark" aria-hidden="true">{{ step.done ? '✓' : '…' }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
import BrumeWisp from '@/components/Guide/BrumeWisp/BrumeWisp.vue';
import { islandSteps, islandShare } from '@/game/loading';

export default {
  name: 'IslandLoader',
  components: { BrumeWisp },
  props: {
    // Ce que l'île a déjà prêt (WorldView : loading ; game/loading.js)
    progress: { type: Object, default: () => ({}) },
    // Stade de Brume (sa couleur)
    stage: { type: Number, default: null }
  },
  computed: {
    steps() {
      return islandSteps(this.progress);
    },
    percent() {
      return Math.round(islandShare(this.progress) * 100);
    }
  }
};
</script>

<style scoped src="./IslandLoader.css"></style>
