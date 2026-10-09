<template>
  <!-- La même scène-signature accueille le joueur au démarrage et pendant la préparation des dessins de l'île. -->
  <div class="island-loader" :data-stage="stage">
    <div class="island-loader__card">
      <img class="island-loader__art" src="/img/brumelune-splash.svg" alt="Brumelune et ses naufragés autour du feu" />
      <div class="island-loader__brand">
        <span class="island-loader__eyebrow">Retour sur</span>
        <p id="island-loader-title" class="island-loader__title">Brumelune</p>
        <p class="island-loader__status">{{ currentLabel }}</p>
      </div>
      <div class="island-loader__bar" role="progressbar" aria-labelledby="island-loader-title" aria-valuemin="0" aria-valuemax="100" :aria-valuenow="percent">
        <span :style="{ width: `${percent}%` }"></span>
      </div>
      <p class="island-loader__percent" aria-hidden="true">{{ percent }} %</p>
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
import { islandSteps, islandShare } from '@/game/loading';

export default {
  name: 'IslandLoader',
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
    },
    currentLabel() {
      const current = this.steps.find(step => !step.done);
      return current ? `${current.label}…` : 'L’île est prête.';
    }
  }
};
</script>

<style scoped src="./IslandLoader.css"></style>
