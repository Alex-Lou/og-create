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
  
  <style scoped>
  .toast-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #333;
    color: white;
    padding: 12px 20px;
    border-radius: 4px;
    z-index: 9999;
    display: flex;
    align-items: center;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
    max-width: 90%;
  }
  
  .toast-message {
    flex-grow: 1;
  }
  
  .toast-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    margin-left: 10px;
    cursor: pointer;
    padding: 0 5px;
  }
  
  .success {
    background-color: #4caf50;
  }
  
  .warning {
    background-color: #ff9800;
  }
  
  .error {
    background-color: #f44336;
  }
  
  .info {
    background-color: #082339;
  }
  
  .toast-fade-enter-active,
  .toast-fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .toast-fade-enter-from,
  .toast-fade-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  </style>