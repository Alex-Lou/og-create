// Les nuits des égarés (world/strays.js, recapOf) : ce que Brume dit au matin d'une nuit finie, une ligne par sort
// (sortis de la brume, changés en lucioles, barrés par une clôture, endormis contre elle, chassés par le coq, renvoyés
// par un camarade, renvoyés d'un toucher), puis le camp, embrumé (siteName : le nom du bâtiment) ou non. Le singulier et
// le pluriel s'écrivent en entier (choix de l'auteur, 15 oct. : ecriture/lots/03_egares.md)

export const NIGHT_RECAP = {
  out: total => (total > 1 ? `Cette nuit, ${total} égarés sont sortis de la brume.` : 'Cette nuit, un égaré est sorti de la brume.'),
  luciole: luciole => (luciole > 1 ? `${luciole} se sont changés en lucioles, près de tes lumières.` : 'L’un s’est changé en luciole, près de tes lumières.'),
  barre: barre => (barre > 1 ? `${barre} se sont arrêtés au bord de tes clôtures, puis sont rentrés dans la brume.` : 'L’un s’est arrêté au bord de tes clôtures, puis il est rentré dans la brume.'),
  // (le Dormeur, endormi contre une clôture jusqu'au matin)
  dort: dort => (dort > 1 ? `${dort} Dormeurs se sont endormis contre tes clôtures. Ils sont repartis à l’aube.` : 'Le Dormeur s’est endormi contre tes clôtures. Il est reparti à l’aube, sans se réveiller tout à fait.'),
  // (le coq, une fois par nuit : choix de l'auteur, 14 oct., texte validé)
  coq: 'Coquelicot a chanté : un égaré a filé dans la brume.',
  camarade: camarade => (camarade > 1 ? `Tes camarades en ont renvoyé ${camarade}.` : 'Tes camarades en ont renvoyé un.'),
  touche: touche => (touche > 1 ? `Tu en as renvoyé ${touche} toi-même.` : 'Tu en as renvoyé un toi-même.'),
  panne: siteName => `Un égaré s’est posé sur ${siteName}. Il a oublié son travail : il faudra le réparer.`,
  held: 'Rien n’a été embrumé. Le camp a tenu.'
};
