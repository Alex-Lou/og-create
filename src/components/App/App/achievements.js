// App : les succès (chargement, vérification après une découverte, une fenêtre à la fois) et la quête de Brume
// accomplie dans le Grimoire. Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App.

import achievementsService from '@/services/achievementsService';
import playService from '@/services/playService';
import { findNewlyUnlocked } from '@/utils/achievementChecker';
import { guide } from '@/game/guide';
import { questTip, questHelp } from '@/texts/guide/tips';
import { coach } from '@/game/coach';
import { islandLesson } from '@/game/prologue';

// La pause entre deux succès (ms)
const ACHIEVEMENT_REST_MS = 1500;

export default {
  data() {
    return {
      achievements: [],
      // Succès débloqués en attente d'affichage (un popup à la fois)
      achievementQueue: [],
      // Le temps de souffler entre deux succès
      achievementRest: false
    };
  },
  computed: {
    // Le succès à montrer, ou null. Jamais pendant le tutoriel (choix de l'auteur, 12 oct. : ils attendent sa fin, puis
    // passent un à un), ni tant que le compte n'a pas dit où il en est (son étape revient du serveur après le chargement)
    achievementShown() {
      const known = !this.isLoggedIn || Boolean(this.accountTutorial && this.islandQuest);
      if (this.achievementRest || this.isRevealing || this.prologueRunning || !known) return null;
      return this.achievementQueue[0] || null;
    }
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
        // (la première page du tutoriel a sa propre invitation, après la scène du Vent : texts/tutorial/scenes.js, « greve »)
        if (quest && quest.done && ['stars', 'element'].includes(quest.kind) && !(quest.id === 'pages' && this.prologueRunning) && guide.say(questTip(quest))) this.showAlert(questHelp(quest));
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
      if (!this.achievementQueue.length) return;
      this.achievementRest = true;
      setTimeout(() => { this.achievementRest = false; }, ACHIEVEMENT_REST_MS);
    },
    // Succès débloqué : une gerbe de particules au centre de l'écran
    handleAchievementPopupOpened() {
      this.$refs.background?.burst(window.innerWidth / 2, window.innerHeight / 2);
    }
  }
};
