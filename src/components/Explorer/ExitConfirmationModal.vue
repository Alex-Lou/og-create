<template>
  <GModal
    v-if="visible"
    eyebrow="L'Expédition"
    title="Quitter l'Expédition ?"
    :width="460"
    @close="$emit('cancel')"
  >
    <p class="exit-confirm__text">Les régions déjà explorées restent inscrites au Carnet de route.</p>
    <template #actions>
      <button type="button" class="g-btn g-btn--ghost" @click="$emit('cancel')">Rester</button>
      <button type="button" class="g-btn g-btn--danger" @click="$emit('confirm')">Quitter</button>
    </template>
  </GModal>
</template>

<script>
import GModal from '@/components/ui/GModal.vue';

export default {
  name: 'ExitConfirmationModal',
  components: { GModal },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'cancel']
};
</script>

<style scoped>
.exit-confirm__text {
  margin: 0;
  font-size: 18px;
  line-height: 1.55;
  color: var(--oc-text);
}
</style>
