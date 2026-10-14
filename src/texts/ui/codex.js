// Les succès (components/Codex) : la fenêtre des succès (CodexModal) ; le nombre de sceaux rompus sert aussi à sa rangée
// de l'onglet Sceau (SceauView)

export const SEALS_BROKEN = (unlocked, total) => `${unlocked} sceaux rompus sur ${total}`;

export const CODEX = {
  lead: 'Chaque palier de cinq sceaux ajoute un anneau à ton sceau.',
  // Un succès encore scellé
  sealed: 'Scellé — se déchiffre en progressant.'
};
