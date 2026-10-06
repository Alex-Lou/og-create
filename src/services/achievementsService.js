// src/services/achievementsService.js
import http from './http';
import { getSession } from './session';

// Images des succès (src/assets/success), par nom ; null s'il n'y en a pas
const SUCCESS = import.meta.glob('../assets/success/*.png', { eager: true, import: 'default' });
function achievementImage(name) {
  return SUCCESS[`../assets/success/${name}.png`] || null;
}

class AchievementsService {
  // Liste publique ; statut de déblocage seulement si connecté
  async loadAchievements() {
    const [all, user] = await Promise.all([
      http.get('/achievements'),
      getSession() ? http.get('/achievements/user') : Promise.resolve({ data: {} })
    ]);
    const unlockedByName = user.data || {};
    return (all.data || []).map(achievement => ({
      ...achievement,
      // Illustration embarquée si elle existe ; sinon le Codex affiche le sceau gravé
      image: achievementImage(achievement.name),
      unlocked: !!unlockedByName[achievement.name]?.unlocked,
      unlockedAt: unlockedByName[achievement.name]?.unlockedAt || null
    }));
  }

  // Enregistre des succès débloqués : [{ name, unlockedAt }]
  async saveUnlocked(achievements) {
    if (!achievements.length) return null;
    const payload = Object.fromEntries(achievements.map(a => [
      a.name,
      { unlocked: true, unlockedAt: a.unlockedAt || new Date().toISOString() }
    ]));
    const response = await http.post('/achievements/update', { achievements: payload });
    return response.data;
  }
}

export default new AchievementsService();
