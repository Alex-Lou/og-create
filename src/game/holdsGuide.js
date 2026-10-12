// Une fenêtre ouverte (mixin) : tant qu'elle est là, Brume et les autres ne disent que le scénario (game/guide.js : hold)
import { guide } from './guide';

export default {
  mounted() {
    this.releaseGuide = guide.hold();
  },
  beforeUnmount() {
    this.releaseGuide();
  }
};
