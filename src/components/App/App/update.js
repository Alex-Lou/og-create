// Une mise à jour en ligne (utils/newVersion.js) : Brume l'annonce, dans un moment calme, jamais pendant une partie de
// l'île, une scène du prologue ou l'Épreuve ; « Actualiser » recharge la page, qui arrive dans sa nouvelle version
import { watchVersion } from '@/utils/newVersion';
import { guide } from '@/game/guide';

export const UPDATE_LINE = 'Psst… L’île a changé pendant que tu regardais ailleurs. Viens voir ?';

export default {
  data() {
    return { newVersion: null, islandPlaying: false };
  },
  computed: {
    updateDue() {
      return Boolean(this.newVersion) && !this.prologueRunning && !this.prologueScene && !this.isTimerActive && !this.islandPlaying;
    }
  },
  watch: {
    updateDue(due) {
      if (due) guide.say({ id: `maj:${this.newVersion}`, text: UPDATE_LINE, action: { label: 'Actualiser', reload: true }, top: true });
    }
  },
  mounted() {
    if (import.meta.env.PROD) this.stopVersionWatch = watchVersion(version => { this.newVersion = version; });
  },
  beforeUnmount() {
    if (this.stopVersionWatch) this.stopVersionWatch();
  }
};
