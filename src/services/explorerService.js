// explorerService.js
import axios from 'axios';

const explorerService = {
  // Initialiser le mode Explorer
  async initExplorer() {
    try {
      const response = await axios.get('/api/progress/explorer/init');
      console.log('Initialisation Explorer réussie:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation du mode Explorer:', error);
      
      // Valeurs par défaut en cas d'erreur
      return {
        energy: 10, 
        max_energy: 20,
        next_energy_in: 0
      };
    }
  },
  
  // Récupérer la liste des régions
  async getRegions() {
    try {
      const response = await axios.get('/api/explorer/regions');
      console.log('Régions récupérées:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error);
      
      // Retourner des régions par défaut en cas d'erreur
      return [
        {
          id: 1,
          name: "Forêt Primordiale",
          description: "Une forêt ancienne pleine de secrets.",
          position_x: 25,
          position_y: 30,
          is_default: true,
          visited: false,
          completed: false
        },
        // Ajoute d'autres régions par défaut si nécessaire
      ];
    }
  },
  
  // Visiter une région (dépenser de l'énergie) avec gestion des erreurs 429
  async visitRegion(regionId, energyCost = 2, retryCount = 0) {
    try {
      // Si c'est un ID de boss, pas besoin de faire une requête API
      if (typeof regionId === 'string' && regionId.startsWith('boss-')) {
        return {
          energy: 10, // On ne dépense pas d'énergie pour les boss
          message: "Combat de boss commencé"
        };
      }
      
      console.log(`Tentative de visite de la région ${regionId} (coût: ${energyCost})`);
      const response = await axios.post(`/api/explorer/visit/${regionId}`, {
        energyCost: energyCost
      });
      console.log('Visite de région réussie, énergie restante:', response.data.energy);
      return response.data;
    } catch (error) {
      // Vérifier si c'est une erreur 429 (trop de requêtes)
      if (error.response && error.response.status === 429 && retryCount < 3) {
        const waitTime = 1000 * (retryCount + 1); // Temps d'attente progressif
        console.warn(`Trop de requêtes, nouvelle tentative dans ${waitTime/1000} secondes...`);
        
        // Attendre et réessayer
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.visitRegion(regionId, energyCost, retryCount + 1);
      }
      
      console.error(`Erreur lors de la visite de la région ${regionId}:`, error);
      throw new Error(error.response?.data?.message || 'Erreur lors de la visite de la région');
    }
  },
  
  // Compléter une région (obtenir des récompenses)
  async completeRegion(regionId, rewards = {}) {
    try {
      console.log(`Tentative de complétion de la région ${regionId} avec récompenses:`, rewards);
      // Modifier cette ligne pour correspondre à la route backend '/complete/:regionId'
      const response = await axios.post(`/api/explorer/complete/${regionId}`, {
        coins: rewards.coins || 50,
        energy: rewards.energy || 5,
        xp: rewards.xp || 100,
        hasBoss: rewards.hasBoss || false,
        bossDefeated: rewards.bossDefeated || false
      });
      console.log('Complétion de région réussie, réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion de la région ${regionId}:`, error);
      
      // Retourner une réponse simulée en cas d'erreur
      const simulatedResponse = {
        message: `Région ${regionId} complétée (simulation en cas d'erreur)`,
        rewards: {
          coins: rewards.coins || 50,
          energy: rewards.energy || 5,
          xp: rewards.xp || 100
        }
      };
      console.log('Utilisation d\'une réponse simulée:', simulatedResponse);
      return simulatedResponse;
    }
  },
  
  // Compléter un boss (obtenir des récompenses)
  async completeBoss(bossId, rewards = {}) {
    try {
      console.log(`Tentative de complétion du boss ${bossId} avec récompenses:`, rewards);
      
      // Utiliser la route standard avec les paramètres boss
      const response = await axios.post(`/api/explorer/complete/${rewards.regionId}`, {
        coins: rewards.coins || 500,
        energy: rewards.energy || 10,
        xp: rewards.xp || 1000,
        isBossVictory: true,  // Ce paramètre est crucial
        bossId: bossId
      });
      
      console.log('Complétion de boss réussie, réponse:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de la complétion du boss ${bossId}:`, error);
      
      // Retourner une réponse simulée en cas d'erreur
      const simulatedResponse = {
        message: `Boss ${bossId} vaincu (simulation en cas d'erreur)`,
        rewards: {
          coins: rewards.coins || 500,
          energy: rewards.energy || 10,
          xp: rewards.xp || 1000
        },
        region_completed: rewards.regionId,
        boss_defeated: true
      };
      console.log('Utilisation d\'une réponse simulée pour le boss:', simulatedResponse);
      return simulatedResponse;
    }
  },
  
  // Acheter de l'énergie avec des pièces
  async buyEnergy(amount = 1, costPerEnergy = 10) {
    try {
      console.log(`Tentative d'achat de ${amount} point(s) d'énergie pour ${amount * costPerEnergy} pièces`);
      const response = await axios.post('/api/explorer/buy-energy', {
        amount: amount,
        costPerEnergy: costPerEnergy
      });
      console.log('Achat d\'énergie réussi, nouvelle énergie:', response.data.energy);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de l\'achat d\'énergie:', error);
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'achat d\'énergie');
    }
  },
  
  // Vérifier l'état actuel de l'énergie
  async checkEnergy() {
    try {
      const response = await axios.get('/api/progress/explorer/energy');
      console.log('Énergie actuelle:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'énergie:', error);
      return { energy: 0, max_energy: 20 };
    }
  },
  
  // Rafraîchir le statut des régions pour l'utilisateur actuel
  async refreshRegionStatus() {
    try {
      console.log('Rafraîchissement du statut des régions');
      const response = await axios.get('/api/explorer/regions/status');
      console.log('Statut des régions rafraîchi:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du statut des régions:', error);
      return [];
    }
  }
};

export default explorerService;