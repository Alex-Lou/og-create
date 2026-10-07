// L'arrivée sur l'île (App.vue : IslandLoader). Tant que la première vue n'est pas prête, chaque image dit où en est son
// dessin (loading) : le sol (carrés prêts sur carrés à l'écran) et, par groupe, les dessins prêts sur les dessins
// demandés (le décor, les bâtiments, les habitants et les bêtes : spriteCount). Dès une image dessinée entière (un
// habitant qui change ensuite de pose garde son image d'avant le temps de lire la suivante), ou au bout de GIVE_UP_MS
// (App.vue peut aussi l'arrêter : endLoading), l'île le dit (loaded) et ne compte plus. Méthodes de WorldView.vue
// (this : le composant).
import { countSprites, spriteCount } from '@/world/spriteCache';

// L'île se montre de toute façon au bout de ce temps (App.vue compte le sien depuis l'entrée sur l'île)
const GIVE_UP_MS = 6000;

export default {
  startLoading() {
    this.loadingSince = performance.now();
    this.loadingReady = false;
    this.loadingSent = '';
    countSprites(true);
    this.$emit('loading', { code: true });
  },
  // Après chaque image : missing, carrés de sol encore à préparer ; tiles, carrés à l'écran
  watchLoading(missing, tiles) {
    if (!this.loadingSince) return;
    const groups = spriteCount();
    // (une image sans aucun dessin demandé : l'île n'est pas encore là, rien à dire)
    if (Object.keys(groups).length) {
      const progress = { code: true, map: true, sol: [tiles - missing, tiles], ...groups };
      this.loadingReady = missing === 0 && Object.values(groups).every(([done, asked]) => done === asked);
      const sent = JSON.stringify(progress);
      if (sent !== this.loadingSent) {
        this.loadingSent = sent;
        this.$emit('loading', progress);
      }
    }
    if (this.loadingReady || performance.now() - this.loadingSince > GIVE_UP_MS) this.endLoading();
  },
  // Fin du chargement (vue prête, île invitée ou en erreur, sortie de l'île) : le compte s'arrête
  endLoading() {
    if (!this.loadingSince) return;
    this.loadingSince = 0;
    countSprites(false);
    this.$emit('loaded');
  }
};
