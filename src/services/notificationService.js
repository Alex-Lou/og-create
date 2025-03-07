// services/notificationService.js
import { createApp } from 'vue';
import ToastNotification from '@/components/Explorer/ToastNotification.vue';

const notificationService = {
  show(options) {
    const { message, duration = 3000, type = 'info' } = options;
    
    // Créer un élément pour contenir la notification
    const mountPoint = document.createElement('div');
    document.body.appendChild(mountPoint);
    
    // Créer l'instance du composant
    const notificationApp = createApp(ToastNotification, {
      message,
      duration,
      type,
      showClose: true,
      onClose: () => {
        setTimeout(() => {
          notificationApp.unmount();
          document.body.removeChild(mountPoint);
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