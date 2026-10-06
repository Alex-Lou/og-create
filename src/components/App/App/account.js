// App : le compte du joueur (écus, pièces du Cabinet portées, lien « mot de passe oublié », déconnexion).
// Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App, qui les lit dans son gabarit.

import AuthService from '@/services/authService';
import progressService from '@/services/progressService';
import playService from '@/services/playService';
import customizationService from '@/services/customizationService';
import * as storage from '@/utils/storage';
import { clearCarnet } from '@/utils/carnet';
import { DEFAULT_FRAME, DEFAULT_EMBLEM } from '@/utils/cabinet';
import { emptyProgress } from '@/utils/trialProgress';

// Copies sur l'appareil pour un affichage immédiat (le serveur reste la référence)
export const COINS_KEY = 'coins';
const CUSTOMIZATION_KEY = 'userCustomization';

// Lit le jeton de réinitialisation dans l'adresse puis l'efface (historique, partage d'écran)
function takeResetToken() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get('reset');
  if (!token) return null;
  url.searchParams.delete('reset');
  window.history.replaceState(null, '', url.pathname + url.search + url.hash);
  return /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export default {
  data() {
    const user = AuthService.getCurrentUser();
    const worn = (user && storage.load(CUSTOMIZATION_KEY)) || {};
    return {
      isLoggedIn: !!user,
      currentUser: user,
      // Écus : gardés par le serveur pour un compte ; un invité n'a qu'un solde de session
      coins: user ? storage.load(COINS_KEY, 0) : 0,
      // Jeton du lien « mot de passe oublié » (?reset=…)
      resetToken: takeResetToken(),
      selectedFrame: worn.frame || DEFAULT_FRAME,
      selectedAvatar: worn.avatar || DEFAULT_EMBLEM
    };
  },
  methods: {
    // ----- Compte -----
    // Écus, records de l'Épreuve et pièces portées (le Cabinet les garde sur le serveur, d'un appareil à l'autre)
    async loadAccount() {
      // Les actes finis et le nom du peuple : l'étape de civilisation de l'Ex libris (l'île les redonne ensuite)
      playService.brume().then(board => {
        if (!this.islandActs.length) this.islandActs = board.acts || [];
        if (!this.people) this.people = board.people || null;
        if (!this.anya) this.anya = board.anya || null;
        this.actsKnown = true;
        this.checkEarlyWisp();
      }).catch(() => {});
      const [progress, selections] = await Promise.all([
        progressService.load().catch(() => null),
        customizationService.getUserSelections()
      ]);
      if (progress) {
        this.handleCoinsUpdated(progress.coins);
        this.timerProgress = { ...emptyProgress(), ...progress.timerProgress };
      }
      if (selections?.selectedFrame) this.selectedFrame = selections.selectedFrame;
      if (selections?.selectedAvatar) this.selectedAvatar = selections.selectedAvatar;
      storage.save(CUSTOMIZATION_KEY, { frame: this.selectedFrame, avatar: this.selectedAvatar });
    },
    handleCoinsUpdated(coins) {
      this.coins = coins;
      if (this.isLoggedIn) storage.save(COINS_KEY, coins);
    },
    handleSaveCustomization({ frame, avatar }) {
      this.selectedFrame = frame;
      this.selectedAvatar = avatar;
      storage.save(CUSTOMIZATION_KEY, { frame, avatar });
      this.isCustomizeModalOpen = false;
    },
    async handleLogout() {
      await AuthService.logout();
      clearCarnet();
      storage.remove(COINS_KEY);
      storage.remove(CUSTOMIZATION_KEY);
      window.location.reload();
    }
  }
};
