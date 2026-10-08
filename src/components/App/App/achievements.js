// App : les succès (chargement, vérification après une découverte, une fenêtre à la fois) et la quête de Brume
// accomplie dans le Grimoire. Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App.

import achievementsService from '@/services/achievementsService';
import playService from '@/services/playService';
import { findNewlyUnlocked } from '@/utils/achievementChecker';
import { guide } from '@/game/guide';
import { questTip } from '@/game/guideTips';
import { coach } from '@/game/coach';
import { islandLesson } from '@/game/prologue';

export default {
  data() {
    return {
      achievements: [],
      // Succès débloqués en attente d'affichage (un popup à la fois)
      achievementQueue: []
    };
  },
  methods: {
    // ----- Succès -----
    async loadAchievements() {
      try {
        this.achievements = await achievementsService.loadAchievements();
        // Rattrapage : succès déjà mérités mais jamais enregistrés. Un invité n'a pas de succès enregistrés :
        // ceux de son carnet ont déjà été montrés à leur découverte, on les coche sans les rejouer.
        this.checkAchievements({ announce: this.isLoggedIn });
      } catch (error) {
        console.error('Erreur lors du chargement des succès:', error);
      }
    },
    // Seul point de vérification des succès : après une découverte en mode Infini
    checkAchievements({ announce = true } = {}) {
      const unlocked = findNewlyUnlocked(this.achievements, this.discoveredElements);
      if (!unlocked.length) return;
      const unlockedAt = new Date().toISOString();
      unlocked.forEach(achievement => {
        achievement.unlocked = true;
        achievement.unlockedAt = unlockedAt;
      });
      if (announce) this.achievementQueue.push(...unlocked);
      if (this.isLoggedIn) {
        achievementsService.saveUnlocked(unlocked)
          .catch(error => console.error('Erreur lors de la sauvegarde des succès:', error));
      }
    },
    // Brume apporte la quête : une quête accomplie dans le Grimoire (découvertes, élément écrit) est annoncée (comptes)
    async checkQuest() {
      if (!this.isLoggedIn) return;
      try {
        const { quest } = await playService.brume();
        if (quest && quest.done && ['stars', 'element'].includes(quest.kind)) guide.say(questTip(quest));
        // Une page écrite au Grimoire peut accomplir la quête : le tutoriel le sait tout de suite (le coach montre
        // alors le chemin de la récompense, sans attendre le retour sur l'île)
        if (quest && this.islandQuest && quest.id === this.islandQuest.id && Boolean(quest.done) !== this.islandQuest.done) {
          this.islandQuest = { id: quest.id, done: Boolean(quest.done) };
          if (coach.state.lesson) coach.show(islandLesson(this.islandQuest));
          this.runIsland();
        }
      } catch {
        // Le guide n'est qu'un confort : la quête reste visible sur l'île
      }
    },
    closeAchievementPopup() {
      this.achievementQueue.shift();
    },
    // Succès débloqué : une gerbe de particules au centre de l'écran
    handleAchievementPopupOpened() {
      this.$refs.background?.burst(window.innerWidth / 2, window.innerHeight / 2);
    }
  }
};
