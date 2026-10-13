<template>
  <TransitionGroup name="toast-pop" tag="div" class="toast-stack" role="status" aria-live="polite">
    <ToastNotification
      v-for="t in toasts"
      :key="t.id"
      :message="t.message"
      :type="t.type"
      :gains="t.gains"
      :duration="t.duration"
      :stamp="t.stamp"
      @close="onClose(t.id)"
    />
  </TransitionGroup>
</template>

<script>
import ToastNotification from './ToastNotification.vue';

// La pile des notifications (services/notificationService.js : ce qu'elle montre, dans l'ordre d'arrivée)
export default {
  name: 'ToastStack',
  components: { ToastNotification },
  props: {
    toasts: { type: Array, required: true },
    onClose: { type: Function, required: true }
  }
};
</script>
