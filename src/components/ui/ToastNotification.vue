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

<style scoped>
.toast {
  --toast-tone: var(--oc-text-muted);
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  padding: 12px 8px 12px 18px;
  background: var(--oc-surface-strong);
  box-shadow: inset 0 0 0 1px var(--oc-line), var(--oc-shadow);
  color: var(--oc-text);
  font-size: 16px;
  line-height: 1.4;
}
.toast--success { --toast-tone: var(--oc-verdigris); }
.toast--warning { --toast-tone: var(--oc-gold); }
.toast--error { --toast-tone: var(--oc-danger); }

.toast__tag {
  flex: none;
  min-width: 64px;
  padding-top: 5px;
  font-family: var(--oc-font-mono);
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--toast-tone);
}
.toast__message { flex: 1; padding-top: 1px; }
.toast__close {
  appearance: none;
  flex: none;
  width: 44px;
  height: 44px;
  margin: -12px 0 -12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: none;
  cursor: pointer;
  color: var(--oc-text-faint);
}
.toast__close:hover { color: var(--oc-text-strong); }

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: opacity 250ms var(--oc-ease-out), transform 250ms var(--oc-ease-out);
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>

<style>
/* Pile créée par notificationService ; sur mobile, styles/base/responsive.css la place en haut */
.toast-stack {
  position: fixed;
  left: 50%;
  z-index: var(--z-toast);
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(calc(100vw - 32px), 460px);
  transform: translateX(-50%);
  pointer-events: none;
}
@media (min-width: 860px) {
  .toast-stack {
    bottom: 24px;
    flex-direction: column-reverse;
  }
}
</style>
