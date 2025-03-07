<!-- ToastNotification.vue -->
<template>
    <transition name="toast-fade">
      <div v-if="isVisible" :class="['toast-notification', type]">
        <span class="toast-message">{{ message }}</span>
        <button v-if="showClose" @click="close" class="toast-close">×</button>
      </div>
    </transition>
  </template>
  
  <script>
  import '@/assets/ComponentsStyle/ExplorerStyle/ToastNotificationsStyle.css';

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
    data() {
      return {
        isVisible: true,
        timeout: null
      };
    },
    mounted() {
      this.timeout = setTimeout(() => {
        this.close();
      }, this.duration);
    },
    beforeUnmount() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    },
    methods: {
      close() {
        this.isVisible = false;
        this.$emit('close');
      }
    }
  };
  </script>