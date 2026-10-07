// App : le compte du joueur (écus, pièces du Cabinet portées, liens « mot de passe oublié » et « nouvelle adresse »,
// retour d'un compte en pause ou en partance, déconnexion).
// Mixin d'App.vue : ses données et méthodes s'ajoutent à celles d'App, qui les lit dans son gabarit.

import AuthService, { BACK_KEY } from '@/services/authService';
import accountService from '@/services/accountService';
import { guide } from '@/game/guide';
import { messageOf } from '@/utils/errors';
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

// Ce que dit Brume au retour d'un compte (serveur : accountSettings.welcomeBack) et au lien d'une nouvelle adresse
export const BACK_LINES = {
  suspendu: 'Te revoilà ! L’île a dormi sous la brume en t’attendant. On s’y remet ?',
  suppression: 'Te revoilà… J’ai déchiré la page du départ. Ton île reste à toi, tout entière.'
};
export const EMAIL_LINE = 'C’est noté dans le Grimoire : les lettres de l’île iront à ta nouvelle adresse.';

// Lit un jeton d'un lien reçu par e-mail (?reset=… ou ?email=…) dans l'adresse puis l'efface (historique, partage d'écran)
function takeToken(name) {
  const url = new URL(window.location.href);
  const token = url.searchParams.get(name);
  if (!token) return null;
  url.searchParams.delete(name);
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
      resetToken: takeToken('reset'),
      // Jeton du lien « confirme ta nouvelle adresse » (?email=…)
      emailToken: takeToken('email'),
      selectedFrame: worn.frame || DEFAULT_FRAME,
      selectedAvatar: worn.avatar || DEFAULT_EMBLEM
    };
  },
  mounted() {
    // Un compte revenu de sa pause, ou qui ne part plus : Brume l'accueille
    const back = storage.load(BACK_KEY);
    if (back) {
      storage.remove(BACK_KEY);
      if (BACK_LINES[back]) guide.say({ id: `retour:${Date.now()}`, text: BACK_LINES[back], top: true });
    }
    if (this.emailToken) this.confirmEmail(this.emailToken);
  },
  methods: {
    // ----- Compte -----
    // Le lien « nouvelle adresse » ouvert (sur n'importe quel appareil, connecté ou non)
    async confirmEmail(token) {
      this.emailToken = null;
      try {
        await accountService.confirmEmail(token);
        guide.say({ id: `adresse:${token.slice(0, 12)}`, text: EMAIL_LINE, top: true });
      } catch (error) {
        this.showAlert(messageOf(error, 'Ce lien ne marche plus : redemande-en un depuis ton Sceau.'));
      }
    },
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
