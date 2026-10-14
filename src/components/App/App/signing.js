// App : le compte du tutoriel. L'île d'abord (le compte s'ouvre en coulisse), la carte d'embarquement (l'avatar et le
// nom), la page de garde qui le signe ; un compte existant retrouvé arrête le tutoriel. Mixin d'App.vue.

import playService from '@/services/playService';
import AuthService from '@/services/authService';
import { messageOf } from '@/utils/errors';
import { NAME_NOT_WRITTEN } from '@/texts/ui/account';

export default {
  methods: {
    // L'avatar de la carte d'embarquement, choisi avant le compte (gardé sur l'appareil), rejoint le compte créé par la
    // page de garde : une tentative par chargement ; en cas d'échec, l'appareil le garde et le prochain chargement réessaie
    keepAvatar() {
      const { look, registered } = this.prologue;
      if (!look || !registered || !this.isLoggedIn || this.avatarSent) return;
      this.avatarSent = true;
      playService.worldAvatar(look).then(world => {
        this.islandAvatar = world.avatar || null;
      }).catch(() => {});
    },
    // La carte d'embarquement : l'avatar et le nom, gardés sur l'appareil (le nom part au serveur avec le compte)
    chooseLook({ look, name }) {
      this.prologueAvatar = false;
      this.savePrologue({ look, name });
      this.runPrologue();
    },
    // L'île d'abord : le compte s'ouvre en coulisse (le carnet invité le rejoint), sans rechargement ; s'il ne peut pas
    // s'ouvrir (serveur injoignable, trop de comptes depuis cette adresse), l'ancien chemin reprend (le Grimoire d'abord)
    async openProvisional() {
      if (this.opening) return;
      this.opening = true;
      try {
        const user = await AuthService.provisional();
        this.currentUser = { userId: user.userId, username: user.username };
        this.isLoggedIn = true;
        this.savePrologue({ registered: true, provisional: true });
        this.loadAccount();
      } catch {
        this.savePrologue({ noProvisional: true });
      } finally {
        this.opening = false;
      }
      this.runPrologue();
    },
    // La page de garde a signé le compte ouvert en coulisse : il a son adresse (et son nouveau nom de compte)
    prologueSigned() {
      this.currentUser = AuthService.getCurrentUser();
      this.prologueName = null;
      this.savePrologue({ signed: true });
      this.runPrologue();
    },
    // Page de garde : l'inscription recharge la page ; le nom attend sur l'appareil, puis part au serveur
    prologueSigning(name) {
      this.savePrologue({ name, registered: true });
    },
    // L'inscription a échoué : le nom de la carte reste écrit sur la page de garde
    prologueUnsigned() {
      this.savePrologue({ registered: false });
    },
    // Un compte existant retrouvé : c'est un joueur qui a déjà sa partie, le tutoriel s'arrête
    prologueSignedIn() {
      this.savePrologue({ registered: false });
    },
    async namePlayer(name) {
      try {
        await playService.worldPlayer(name);
        this.prologueName = null;
        this.savePrologue({ named: true, name: null });
        this.runPrologue();
      } catch (error) {
        this.prologueName = { account: false };
        this.showAlert(messageOf(error, NAME_NOT_WRITTEN), 'error');
      }
    }
  }
};
