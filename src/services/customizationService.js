// Le Cabinet : pièces de sceau disponibles, possédées, portées, et achat (prix et droits vérifiés par le serveur).
import http from './http';
import { DEFAULT_FRAME, DEFAULT_EMBLEM } from '@/utils/cabinet';

export default {
  async getAllItems() {
    return (await http.get('/customization/items')).data;
  },
  async getUnlockedItems() {
    return (await http.get('/customization/unlocked')).data;
  },
  // Pièces portées ; les pièces par défaut si le serveur ne répond pas
  async getUserSelections() {
    try {
      return (await http.get('/customization/selections')).data;
    } catch {
      return { selectedFrame: DEFAULT_FRAME, selectedAvatar: DEFAULT_EMBLEM };
    }
  },
  async saveUserSelections(selections) {
    return (await http.post('/customization/selections', selections)).data;
  },
  async purchaseItem(itemId) {
    return (await http.post('/customization/purchase', { itemId })).data;
  }
};
