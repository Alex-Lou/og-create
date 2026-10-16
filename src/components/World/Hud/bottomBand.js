// Les bandeaux du bas de l'île (CancelBanner, RoadBar, LineBar, DoorOffer) : chacun dit la hauteur qu'il occupe depuis le
// bas de l'écran (px), et la bulle du guide se pose au-dessus du plus haut (Guide/BrumeGuide ; elle recouvrait le compte
// du mode chemin et les boutons d'une pose). Mesuré à l'ouverture et quand le bandeau change de taille, jamais à chaque
// image. Mixin de ces composants.
import { reactive } from 'vue';

// { id du bandeau : hauteur occupée (px) }
export const band = reactive({});
// La hauteur à laisser libre en bas de l'écran (0 : aucun bandeau)
export const bandHeight = () => Math.max(0, ...Object.values(band));

let uid = 0;

export default {
  mounted() {
    this.bandId = ++uid;
    if (typeof ResizeObserver !== 'undefined') {
      this.bandWatch = new ResizeObserver(() => this.measureBand());
      this.bandWatch.observe(this.$el);
    }
    this.measureBand();
  },
  beforeUnmount() {
    if (this.bandWatch) this.bandWatch.disconnect();
    delete band[this.bandId];
  },
  methods: {
    measureBand() {
      const r = this.$el && this.$el.getBoundingClientRect ? this.$el.getBoundingClientRect() : null;
      band[this.bandId] = r && r.height ? Math.round(window.innerHeight - r.top) : 0;
    }
  }
};
