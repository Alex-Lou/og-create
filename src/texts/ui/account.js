// Le compte du joueur (components/Account) : Mon compte (AccountModal), le Seuil (SeuilModal : connexion, inscription),
// le nouveau mot de passe (ResetPasswordModal) et l'onglet Sceau (SceauView). Quelques phrases servent aussi ailleurs :
// le nom pas écrit (App/signing.js), l'e-mail ou le mot de passe refusé (PrologueName).

// Les phrases communes à plusieurs fenêtres du compte
export const NAME_NOT_WRITTEN = 'Le nom n’a pas pu être écrit.';
export const LOGIN_FAILED = 'Email ou mot de passe incorrect.';
export const PASSWORDS_DIFFER = 'Les deux mots de passe ne sont pas identiques.';
export const PASSWORD_NOT_CHANGED = 'Le mot de passe n’a pas pu être changé.';

// « Mon compte » (AccountModal) : ce qui s'écrit dans la fenêtre, puis sous chaque rubrique
export const ACCOUNT = {
  since: date => `Échoué sur l’île le ${date}`,
  // Un compte ouvert en coulisse, pas encore signé
  provisional: 'Signe d’abord la page de garde du Grimoire : ton compte aura une adresse et un mot de passe, et tu pourras le mettre en pause ou le quitter.',
  pendingEmail: email => `Un lien attend d’être ouvert dans ${email}.`,
  otherDevices: 'Tes autres appareils seront déconnectés.',
  data: 'Ton compte, ton île, ton carnet, tes écus : tout ce que le jeu garde sur toi, dans un fichier à garder.',
  pause: 'Ton île reste exactement comme elle est, et aucun mail ne part. Tu es déconnecté partout ; pour revenir, reconnecte-toi, tout simplement.',
  // Sous le titre de chaque rubrique
  notes: {
    data: 'Tout ce que le jeu garde sur toi',
    restart: 'Tout repart de zéro, sauf ton compte ; le jeu reprend au naufrage',
    pause: 'Ton île t’attend, telle quelle',
    delete: days => `Effacé dans ${days} jours, sauf si tu reviens`
  },
  // Les réponses
  unread: 'Ton compte n’a pas pu être lu.',
  nameWritten: 'Ton nom est écrit dans le Grimoire.',
  lookKept: 'Nouvelle allure, même naufragé.',
  lookFailed: 'Ton apparence n’a pas pu être gardée.',
  emailFailed: 'L’adresse n’a pas pu être changée.',
  dataFailed: 'Tes données n’ont pas pu être préparées.',
  dataSent: 'Le fichier est parti dans tes téléchargements.',
  restartFailed: 'L’île n’a pas pu être recommencée.',
  // Le bouton du mode debug (App : DebugReset ; le libellé du bouton du compte)
  restartLabel: 'Recommencer l’île',
  pauseFailed: 'Le compte n’a pas pu être mis en pause.',
  deleteFailed: 'La suppression n’a pas pu être prévue.',
  // Parti (pause ou suppression) : le dernier mot avant la porte
  paused: 'Ton île s’endort sous la brume, telle quelle. Reconnecte-toi quand tu veux : Brume veille.',
  deleted: date => `Ton compte sera effacé le ${date}. D’ici là, te reconnecter suffit pour tout garder.`
};

// Le Seuil (SeuilModal) : connexion, inscription, mot de passe oublié
export const SEUIL = {
  lead: 'Sans compte, tu joues en invité : rien n’est gardé.',
  forgot: 'Un lien pour choisir un nouveau mot de passe te sera envoyé.',
  linkFailed: 'Le lien n’a pas pu être envoyé.'
};

// L'onglet Sceau (SceauView) : sous le sceau, et sous chaque rangée (le nombre de succès : texts/ui/codex.js)
export const SCEAU = {
  hint: 'Chaque découverte redessine ton sceau. Aucun joueur n’a le même.',
  notes: {
    account: 'Nom, photo, adresse, mot de passe, mes données',
    cabinet: 'Cadres et emblèmes de ton sceau',
    prologue: 'Le naufrage de l’Hirondelle et la rencontre de Brume',
    contact: 'Une idée, un souci : on lit tout'
  }
};
