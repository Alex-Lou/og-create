<template>
  <transition name="toast-fade">
    <div v-if="isVisible" :class="['toast', `toast--${type}`]">
      <span class="toast__tag">{{ tag }}</span>
      <span class="toast__message">{{ message }}</span>
      <button v-if="showClose" type="button" class="toast__close" aria-label="Fermer la notification" @click="close">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19"></path>
        </svg>
      </button>
    </div>
  </transition>
</template>

<script>
// Étiquette affichée selon le type de notification
const TAGS = {
  info: 'info',
  success: 'réussite',
  warning: 'prudence',
  error: 'échec'
};

// Notification éphémère montée par notificationService
export default {
  name: 'ToastNotification',
  props: {
    message: {
      type: String,
      required: true
    },
    duration: {
      type: Number,
      default: 3000
    },
    type: {
      type: String,
      default: 'info',
      validator: (value) => ['info', 'success', 'warning', 'error'].includes(value)
    },
    showClose: {
      type: Boolean,
      default: true
    }
  },
  emits: ['close'],
  data() {
    return {
      isVisible: true,
      timeout: null
    };
  },
  computed: {
    tag() {
      return TAGS[this.type] || TAGS.info;
    }
  },
  mounted() {
    this.timeout = setTimeout(this.close, this.duration);
  },
  beforeUnmount() {
    clearTimeout(this.timeout);
  },
  methods: {
    close() {
      if (!this.isVisible) return;
      clearTimeout(this.timeout);
      this.isVisible = false;
      this.$emit('close');
    }
  }
};
</script>

<style scoped src="./ToastNotification.css"></style>

<style src="./ToastNotification.global.css"></style>
