// L'exploration de l'île (components/World/Explore) : la fiche de Brume (BrumeSheet), le Carnet d'explorateur
// (ExplorerLog), les trouvailles de climat (FindsSheet), Brume qui présente les nuits (NightSheet). (La consigne d'un
// naufrage, WreckScene : texts/ui/common.js.)

// La fiche de Brume (BrumeSheet). (Le fil d'Ariane, « Vers : <strong>…</strong> — … », reste dans le gabarit, à cause
// de sa balise ; seule sa première phrase est ici.)
export const BRUME_SHEET = {
  locked: chapter => `Ouvre d’abord le chapitre ${chapter} du Grimoire : écris de nouvelles découvertes.`,
  known: 'Le Grimoire connaît cette invention. '
};

// Le Carnet d'explorateur (ExplorerLog) : la Chronique, puis les lieux remarquables
export const EXPLORER_LOG = {
  noVigil: 'Rien encore : la première veillée se tient à la fin de l’acte I.',
  revealed: 'Anya s’est levée au Cercle de menhirs.',
  noBeast: 'Aucune bête écrite : ce qu’on écrit dans le Grimoire renaît sur l’île.',
  // (après « n / m lieux découverts »)
  waiting: n => `· ${n} t’attend${n > 1 ? 'ent' : ''} sur l’île`,
  unknown: 'Une expédition révélera ce lieu.',
  foundOn: date => `Découvert le ${date}`,
  toFind: 'À découvrir : touche-le sur l’île.',
  toBuy: zone => `Achète ${zone} pour le découvrir.`
};

// Les trouvailles de climat (FindsSheet) : ce qu'elles sont, puis où sont les gisements de chacune
export const FINDS = {
  note: 'Chaque climat a sa trouvaille. Elle se ramasse sur les gisements de ses quartiers, une fois à toi ; un gisement repousse en quelques heures. Les trouvailles paient les créations de climat (établi, onglet Climats) et les annexes de climat (fiche d’un bâtiment, dès le palier III). Chaque création de climat posée dans un quartier y fait rendre une trouvaille de plus à chaque ramassage (jusqu’à +3).',
  nowhere: name => `${name} : dans les quartiers de ce climat, une fois à toi.`,
  ready: (name, ready, total) => `${name} : ${ready} prêt${ready > 1 ? 's' : ''} sur ${total}.`
};

// Ce que Brume présente des nuits, à la fin du prologue (NightSheet ; HISTOIRE.md § 6.15)
export const NIGHT_INTRO = [
  'La nuit, des égarés sortent de la brume. Ils cherchent ce qui brille, et ce qu’ils touchent oublie son travail.',
  'Tes lumières les arrêtent à leur bord ; les plus téméraires s’y brûlent. Tes clôtures les arrêtent, et ta main peut en renvoyer un.',
  'Un bâtiment embrumé se répare, et rien ne se perd. La première nuit vient demain.'
];
