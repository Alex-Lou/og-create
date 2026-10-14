// Le prologue (components/Prologue) : les pensées du joueur devant sa carte d'embarquement (PrologueAvatar), les
// consignes de la page de garde (PrologueName), des scènes (PrologueScene), de l'éditeur d'avatar (AvatarMaker) et le
// nom accessible de la carte (BoardingCard). (Les répliques des scènes : texts/tutorial/scenes.js.)

// Les pensées du joueur (PrologueAvatar) : en se composant (ou, depuis « Mon compte », en changeant d'apparence), puis
// devant la carte trempée
export const THOUGHTS = {
  editing: 'Un coup de peigne, une autre chemise… C’est toujours moi.',
  maker: '(Qui étais-je, déjà, avant la vague ? … Ça me revient.)',
  card: '(La photo a bu la mer. C’était moi, ça ? … Oui. Et mon nom…)'
};

// La page de garde (PrologueName) : au-dessus de l'e-mail (se connecter, ou créer le compte), et ses refus (l'e-mail ou
// le mot de passe refusé : texts/ui/account.js)
export const SIGN = {
  login: 'Retrouve ton Grimoire :',
  register: 'Pour que l’île te garde, d’un appareil à l’autre :',
  notCreated: 'Le compte n’a pas pu être créé.',
  notSigned: 'Le compte n’a pas pu être signé.'
};

// Une scène (PrologueScene) : sous la bulle, ou seule quand l'image n'a pas de texte
export const TOUCH_TO_GO_ON = 'Toucher pour continuer';

// L'éditeur d'avatar (AvatarMaker) : le personnage (texte de l'image), la photo qui se prépare
export const MAKER = {
  figure: 'Ton personnage, en pied',
  wait: 'La photo se compose…'
};

// La carte d'embarquement (BoardingCard) : son nom accessible, avec ou sans le nom du joueur
export const CARD = {
  named: name => `Ta carte d’embarquement, au nom de ${name}`,
  blank: 'Ta carte d’embarquement'
};
