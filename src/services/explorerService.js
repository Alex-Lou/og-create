// services/explorerService.js
import { apiInstance } from './authService';

class ExplorerService {
  async initExplorer() {
    try {
      const response = await apiInstance.get('/explorer/init');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du mode Explorer:', error);
      throw error;
    }
  }

  async getRegions() {
    try {
      const response = await apiInstance.get('/explorer/regions');
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
      throw error;
    }
  }

  async visitRegion(regionId) {
    try {
      const response = await apiInstance.post(`/explorer/visit/${regionId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la visite de la région ${regionId}:`, error);
      throw error;
    }
  }

  // Fonction simplifiée sans appel réseau
  async completeRegion(regionId) {
    console.log(`Complétion de la région ${regionId} (simulée)`);
    
    const reponseSimulee = {
      message: `Région ${regionId} complétée avec succès (simulation)`,
      completed: true,
      rewards: {
        coins: 50,
        xp: 100,
        energy: 5
      },
      unlockedRegions: []
    };
    
    return reponseSimulee;
  }

  async discoverElement(regionId, elementName) {
    try {
      const response = await apiInstance.post(`/explorer/discover/${regionId}/${elementName}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la découverte de l'élément ${elementName} dans la région ${regionId}:`, error);
      throw error;
    }
  }

  async buyEnergy(amount = 1) {
    try {
      const response = await apiInstance.post('/explorer/buy-energy', { amount });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'achat d\'énergie:', error);
      throw error;
    }
  }

  async getRegionDetails(regionId) {
    try {
      const response = await apiInstance.get(`/explorer/regions/${regionId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des détails de la région ${regionId}:`, error);
      throw error;
    }
  }

  async unlockRegion(regionId) {
    try {
      const response = await apiInstance.post(`/explorer/unlock/${regionId}`);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors du déblocage de la région ${regionId}:`, error);
      throw error;
    }
  }
}

export default new ExplorerService();