<template>
  <!-- L'île se prépare (un retour depuis le Grimoire, un débarquement) : une pastille discrète sous la barre du haut,
       jamais un second écran de chargement (le seul est celui du démarrage, index.html) ; l'île se dessine derrière. -->
  <div class="island-loader" role="status" aria-live="polite">
    <BrumeWisp class="island-loader__wisp" :size="20" :stage="stage" />
    <span class="island-loader__label">{{ currentLabel }}</span>
    <span class="island-loader__bar" aria-hidden="true"><span :style="{ width: `${percent}%` }"></span></span>
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
    percent() {
      return Math.round(islandShare(this.progress) * 100);
    },
    currentLabel() {
      const current = islandSteps(this.progress).find(step => !step.done);
      return current ? `${current.label}…` : 'L’île est prête.';
    }
  }
};
</script>

<style scoped src="./IslandLoader.css"></style>
