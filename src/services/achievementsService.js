// src/services/achievementsService.js
import http from './http';

function achievementImage(name) {
  try {
    return require(`@/assets/success/${name}.png`);
  } catch {
    return null;
  }
}

class AchievementsService {
  // Liste complète des succès avec leur statut pour l'utilisateur courant
  async loadAchievements() {
    const [all, user] = await Promise.all([
      http.get('/achievements'),
      http.get('/achievements/user')
    ]);
    const unlockedByName = user.data || {};
    return (all.data || []).map(achievement => ({
      ...achievement,
      image: achievementImage(achievement.name) || achievement.image || null,
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
