// src/services/customizationService.js
import apiInstance from './http';

// Créer une instance spécifique pour les appels d'API de personnalisation
const customizationInstance = {
  async get(endpoint) {
    return apiInstance.get(`/customization/${endpoint}`);
  },
  async post(endpoint, data) {
    return apiInstance.post(`/customization/${endpoint}`, data);
  }
};

class CustomizationService {
  // Récupérer tous les items disponibles
  async getAllItems() {
    try {
      const response = await customizationInstance.get('items');
      console.log('Tous les items récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des items:', error);
      throw error;
    }
  }

  // Récupérer les items déverrouillés par l'utilisateur
  async getUnlockedItems() {
    try {
      const response = await customizationInstance.get('unlocked');
      console.log('Items déverrouillés récupérés:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des items déverrouillés:', error);
      throw error;
    }
  }

  // Récupérer les sélections actuelles de l'utilisateur
  async getUserSelections() {
    try {
      const response = await customizationInstance.get('selections');
      console.log('Sélections utilisateur récupérées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des sélections utilisateur:', error);
      
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        selectedFrame: 'basicCadre.png',
        selectedAvatar: 'coin.png'
      };
    }
  }

  // Sauvegarder les sélections de l'utilisateur
  async saveUserSelections(selections) {
    try {
      const response = await customizationInstance.post('selections', selections);
      console.log('Sélections sauvegardées:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des sélections:', error);
      throw error;
    }
  }

  // Acheter un nouvel item
  async purchaseItem(itemId) {
    try {
      const response = await customizationInstance.post('purchase', { itemId });
      console.log('Item acheté:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'achat de l\'item:', error);
      throw error;
    }
  }

  // Helpers pour filtrer les items par type
  filterItemsByType(items, type) {
    return items.filter(item => item.type === type);
  }

  getFrames(items) {
    return this.filterItemsByType(items, 'frame');
  }

  getAvatars(items) {
    return this.filterItemsByType(items, 'avatar');
  }
}

export default new CustomizationService();