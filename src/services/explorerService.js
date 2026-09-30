// explorerService.js
// Mode Explorer : énergie, régions, boss et cartes.
// Une seule source pour les régions (cache court, invalidé après chaque action) ;
// boss final et cartes débloquées sont calculés à partir de cette liste.
import api from './http';

const REGIONS_TTL = 30000;
const DEFAULT_MAP = 1;

let regionsCache = null;   // { data, at } : toutes les régions de l'utilisateur
let regionsRequest = null; // requête en cours, partagée entre appelants
let purchaseInProgress = false;

function withBackground(region) {
  return { ...region, explorerMapBackground: `world-map${region.map_id || DEFAULT_MAP}.png` };
}

// Boss final d'une carte : le boss d'id le plus élevé
function finalBossOf(regions, mapId) {
  const bosses = regions.filter(r => r.is_boss && r.map_id === mapId);
  if (!bosses.length) return null;
  return bosses.reduce((max, boss) => (boss.id > max.id ? boss : max));
}

function isDefeated(region) {
  return !!(region && (region.boss_defeated || region.completed));
}

function energyFrom(data) {
  return { energy: data.energy, max_energy: data.max_energy, next_energy_in: data.next_energy_in };
}

const explorerService = {
  async initExplorer() {
    const response = await api.get('/explorer/init');
    return { ...response.data, currentMap: await this.getCurrentMap() };
  },

  // Toutes les régions, ou celles d'une carte
  async getRegions(mapId = null, forceRefresh = false) {
    const fresh = regionsCache && Date.now() - regionsCache.at < REGIONS_TTL;
    if (forceRefresh || !fresh) {
      if (!regionsRequest) {
        regionsRequest = api.get('/explorer/regions')
          .then(response => {
            regionsCache = { data: response.data.map(withBackground), at: Date.now() };
            return regionsCache.data;
          })
          .finally(() => { regionsRequest = null; });
      }
      await regionsRequest;
    }
    const regions = regionsCache?.data || [];
    return mapId ? regions.filter(r => r.map_id === mapId) : regions;
  },

  invalidateRegions() {
    regionsCache = null;
  },

  async findRegion(regionId) {
    const regions = await this.getRegions();
    return regions.find(r => r.id === regionId) || null;
  },

  async visitRegion(regionId, energyCost = 2) {
    const region = await this.findRegion(regionId);
    // Les boss ne coûtent pas d'énergie
    const cost = region?.is_boss ? 0 : energyCost;
    try {
      const response = await api.post(`/explorer/visit/${regionId}`, { energyCost: cost });
      this.invalidateRegions();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la visite de la région');
    }
  },

  async _complete(regionId, payload, errorMessage) {
    try {
      const response = await api.post(`/explorer/complete/${regionId}`, payload);
      this.invalidateRegions();
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || errorMessage);
    }
  },

  // Récompenses par défaut si la région n'en définit pas
  completeRegion(regionId, rewards = {}) {
    return this._complete(regionId, {
      coins: rewards.coins ?? 50,
      energy: rewards.energy ?? 5,
      xp: rewards.xp ?? 100,
      isBossVictory: false
    }, 'Erreur lors de la complétion de la région');
  },

  async completeBoss(regionId, options = {}) {
    const isFinal = await this._isFinalBoss(regionId);
    const defaults = isFinal
      ? { coins: 1000, energy: 15, xp: 2000 }
      : { coins: 500, energy: 10, xp: 1000 };
    const data = await this._complete(regionId, {
      coins: options.coins ?? defaults.coins,
      energy: options.energy ?? defaults.energy,
      xp: options.xp ?? defaults.xp,
      isBossVictory: true,
      bossId: options.bossId || regionId,
      bossRegionId: options.bossRegionId || regionId
    }, 'Erreur lors de la complétion du boss');
    if (isFinal && data.bossDefeated) {
      await this.refreshUnlockedMaps();
    }
    return data;
  },

  async _isFinalBoss(regionId) {
    const region = await this.findRegion(regionId);
    if (!region?.is_boss) return false;
    const regions = await this.getRegions();
    return finalBossOf(regions, region.map_id)?.id === regionId;
  },

  async isBossDefeated(bossId) {
    return isDefeated(await this.findRegion(bossId));
  },

  // Une carte est débloquée quand le boss final de la carte précédente est vaincu
  async isMapUnlocked(mapId) {
    if (mapId === DEFAULT_MAP) return true;
    const regions = await this.getRegions();
    if (!regions.some(r => r.map_id === mapId)) return false;
    return isDefeated(finalBossOf(regions, mapId - 1));
  },

  // Recalcule les cartes débloquées et les mémorise (lues par mapUtils.loadUnlockedMaps)
  async refreshUnlockedMaps() {
    const unlockedMaps = { [DEFAULT_MAP]: true };
    try {
      const regions = await this.getRegions(null, true);
      const mapIds = [...new Set(regions.map(r => r.map_id))].sort((a, b) => a - b);
      for (let i = 1; i < mapIds.length; i++) {
        if (isDefeated(finalBossOf(regions, mapIds[i - 1]))) {
          unlockedMaps[mapIds[i]] = true;
        }
      }
      localStorage.setItem('unlocked_maps', JSON.stringify(unlockedMaps));
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des cartes débloquées:', error);
    }
    return unlockedMaps;
  },

  async getCurrentMap() {
    const mapId = parseInt(localStorage.getItem('current_map')) || DEFAULT_MAP;
    try {
      return (await this.isMapUnlocked(mapId)) ? mapId : DEFAULT_MAP;
    } catch {
      return DEFAULT_MAP;
    }
  },

  async setCurrentMap(mapId) {
    if (!(await this.isMapUnlocked(mapId))) return false;
    localStorage.setItem('current_map', String(mapId));
    return true;
  },

  // Énergie actuelle (null si le serveur ne répond pas)
  async checkEnergy() {
    try {
      const response = await api.get('/explorer/init');
      return energyFrom(response.data);
    } catch (error) {
      console.error("Erreur lors de la vérification de l'énergie:", error);
      return null;
    }
  },

  refreshAfterPurchase() {
    return this.checkEnergy();
  },

  // Un seul achat à la fois (évite les doubles clics)
  async buyEnergy(amount = 1) {
    if (purchaseInProgress) return { alreadyInProgress: true };
    purchaseInProgress = true;
    try {
      const response = await api.post('/explorer/buy-energy', { amount, client_timestamp: Date.now() });
      return response.data;
    } finally {
      purchaseInProgress = false;
    }
  },

  async abandonChallenge(regionId, energyCost = 0) {
    try {
      const response = await api.post(`/explorer/abandon/${regionId}`, { energyCost: Math.max(0, energyCost) });
      return response.data;
    } catch (error) {
      console.error(`Erreur lors de l'abandon du défi dans la région ${regionId}:`, error);
      return null;
    }
  }
};

export default explorerService;
