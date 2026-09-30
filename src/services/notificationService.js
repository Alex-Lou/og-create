// services/notificationService.js
import { createApp } from 'vue';
import ToastNotification from '@/components/Explorer/ToastNotification.vue';

// Messages actuellement affichés (évite d'empiler plusieurs fois le même)
const visibleMessages = new Set();

const notificationService = {
  show(options) {
    const { message, duration = 3000, type = 'info' } = options;
    if (!message || visibleMessages.has(message)) return;
    visibleMessages.add(message);
    
    // Les notifications s'empilent dans un conteneur commun
    let stack = document.querySelector('.toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      document.body.appendChild(stack);
    }
    const mountPoint = document.createElement('div');
    stack.appendChild(mountPoint);
    
    // Créer l'instance du composant
    const notificationApp = createApp(ToastNotification, {
      message,
      duration,
      type,
      showClose: true,
      onClose: () => {
        visibleMessages.delete(message);
        setTimeout(() => {
          notificationApp.unmount();
          mountPoint.remove();
        }, 300); // Attendre la fin de l'animation
      }
    });
    
    // Monter le composant sur le point de montage
    notificationApp.mount(mountPoint);
  },
  
  success(message, duration) {
    this.show({ message, duration, type: 'success' });
  },
  
  error(message, duration) {
    this.show({ message, duration, type: 'error' });
  },
  
  warning(message, duration) {
    this.show({ message, duration, type: 'warning' });
  },
  
  info(message, duration) {
    this.show({ message, duration, type: 'info' });
  }
};

export default notificationService;