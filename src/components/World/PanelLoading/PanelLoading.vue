<template>
  <!-- Pendant qu'un mini-jeu ou l'établi se charge (à sa première ouverture) : son cadre, une goutte de Brume qui pulse -->
  <div class="panel-loading" role="status" aria-live="polite">
    <div class="panel-loading__card">
      <span class="panel-loading__drop" aria-hidden="true"></span>
      <span class="panel-loading__text">{{ WAIT }}</span>
    </div>
  </div>
</template>

<script>
import { WAIT } from '@/texts/world/screens/island';

export default {
  name: 'PanelLoading',
  data() {
    return { WAIT };
  }
};
</script>

<style scoped src="./PanelLoading.css"></style>
