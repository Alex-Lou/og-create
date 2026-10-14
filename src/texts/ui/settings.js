// Les réglages du joueur (components/Settings) : le Cabinet (CustomizeModal : essayer, acquérir, porter une pièce) et
// « Écrire aux créateurs » (ContactModal)

// Le Cabinet : la note sous l'aperçu, puis les messages passagers
export const CABINET = {
  ready: 'Prêt à être gravé.',
  touch: 'Touche une pièce pour l’essayer.',
  trialEarned: (name, achievement) => `À l’essai : ${name} se mérite par le succès « ${achievement} ».`,
  trialLocked: name => `À l’essai : ${name} n’est pas encore à toi.`,
  unopened: 'Le cabinet n’a pas pu être ouvert.',
  missing: n => `Il te manque ${n} écus.`,
  bought: name => `${name} est à toi.`,
  buyFailed: 'L’achat n’a pas abouti.',
  notEngraved: 'Le sceau n’a pas pu être gravé.'
};

// Écrire aux créateurs
export const CONTACT = {
  placeholder: 'Une idée, un bug, une recette qui manque…',
  sent: 'Message envoyé. Merci.',
  failed: 'Le message n’a pas pu partir. Réessaie dans un instant.'
};
