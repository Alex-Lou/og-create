<template>
  <!-- Pendant qu'un mini-jeu ou l'établi se charge (à sa première ouverture) : son cadre, une goutte de Brume qui pulse -->
  <div class="panel-loading" role="status" aria-live="polite">
    <div class="panel-loading__card">
      <span class="panel-loading__drop" aria-hidden="true"></span>
      <span class="panel-loading__text">Un instant…</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PanelLoading'
};
</script>

<style scoped src="./PanelLoading.css"></style>
