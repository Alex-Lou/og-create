// Pastilles d'information empilées (en bas sur grand écran, en haut sur téléphone ; une seule fois la même à la fois)
import { createApp } from 'vue';
import ToastNotification from '@/components/ui/ToastNotification/ToastNotification.vue';

// Messages actuellement affichés (évite d'empiler plusieurs fois le même)
const visibleMessages = new Set();

const notificationService = {
  show(options) {
    const { message = '', duration = 3000, type = 'info', gains = [] } = options;
    // (une pastille de gain peut n'avoir que ses « +N »)
    const key = `${gains.map(g => g.text).join(' ')} ${message}`.trim();
    if (!key || visibleMessages.has(key)) return;
    visibleMessages.add(key);
    
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
      gains,
      showClose: true,
      onClose: () => {
        visibleMessages.delete(key);
        setTimeout(() => {
          notificationApp.unmount();
          mountPoint.remove();
        }, 300); // Attendre la fin de l'animation
      }
    });
    
    // Monter le composant sur le point de montage
    notificationApp.mount(mountPoint);
  },
  
  error(message, duration) {
    this.show({ message, duration, type: 'error' });
  },
  
  info(message, duration) {
    this.show({ message, duration, type: 'info' });
  }
};

export default notificationService;