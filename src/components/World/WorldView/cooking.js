// L'île : la marmite d’Agathe (choix de l'auteur, 13 oct. : B4). Au jour d’Agathe, sa bulle de faim (la quête
// « soupe », pas encore servie) ouvre sa marmite, une scène à part comme la chasse aux poules (Games/CookingPot) ; servir
// paie la soupe au serveur (son besoin « Manger », 10 vivres : il juge seul). Ensuite, sa faim de chaque jour se comble
// toujours d'un toucher. Mixin de WorldView.vue.

import { messageOf } from '@/utils/errors';
import playService from '@/services/playService';
import { coach } from '@/game/coach';
import { FAILED } from '@/texts/world/screens/alerts';

export default {
  data() {
    return {
      // La marmite ouverte (CookingPot.vue)
      cooking: false
    };
  },
  methods: {
    // Ce besoin ouvre-t-il la marmite ? (la faim d’Agathe, à sa soupe du tutoriel)
    cooksNow(villagerId, needId) {
      return villagerId === 'foyer' && needId === 'manger' && Boolean(this.quest && this.quest.id === 'soupe' && !this.quest.done);
    },
    openCooking() {
      if (this.cooking) return;
      this.cooking = true;
      this.cookWorld = null;
      // (l'île, sous la scène, ne se redessine plus, draw/loop.js ; la main du coach se met en veille)
      this.syncLoop();
      this.cookLesson = coach.state.lesson;
      if (this.cookLesson) coach.clear(this.cookLesson.id);
    },
    // Servir : le serveur prend les vivres et comble la faim d’Agathe. Ce qu'il renvoie attend la fermeture de la scène
    // (la quête faite, le tutoriel passerait à ses répliques par-dessus : une chose à la fois). true : c'est servi
    async serveCooking() {
      if (this.busy) return false;
      this.busy = true;
      try {
        this.cookWorld = await playService.villagerNeed('foyer', 'manger');
        return true;
      } catch (error) {
        this.$emit('show-alert', messageOf(error, FAILED.need), 'error');
        return false;
      } finally {
        this.busy = false;
      }
    },
    // La marmite se ferme (servie, ou « Plus tard ») : l'île reprend ce que le serveur a dit ; rien de servi, la main
    // revient sur la bulle
    closeCooking() {
      this.cooking = false;
      const served = this.cookWorld;
      this.cookWorld = null;
      if (served) {
        this.apply(served.world);
        if (served.coins !== undefined) this.$emit('coins-updated', served.coins);
      }
      this.syncLoop();
      this.drawSoon();
      if (this.cookLesson && !served && !coach.state.lesson) coach.show(this.cookLesson);
      this.cookLesson = null;
    }
  }
};
