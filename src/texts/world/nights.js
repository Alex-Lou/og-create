// Les nuits des égarés (world/strays.js, recapOf) : ce que Brume dit au matin d'une nuit finie, une ligne par sort
// (sortis de la brume, changés en lucioles, barrés par une clôture, chassés par le coq, renvoyés par un camarade,
// repoussés d'un toucher), puis le camp, embrumé (siteName : le nom du bâtiment) ou non.

const s = n => (n > 1 ? 's' : '');
export const NIGHT_RECAP = {
  out: total => `Cette nuit, ${total} égaré${s(total)} ${total > 1 ? 'sont sortis' : 'est sorti'} de la brume.`,
  luciole: luciole => `${luciole} ${luciole > 1 ? 'sont devenus des lucioles' : 'est devenu luciole'} près de tes lumières.`,
  barre: barre => `${barre} ${barre > 1 ? 'ont boudé' : 'a boudé'} devant une clôture.`,
  // (le coq, une fois par nuit : choix de l'auteur, 14 oct., texte validé)
  coq: 'Coquelicot a chanté : un égaré a filé dans la brume.',
  camarade: camarade => `Tes camarades en ont renvoyé ${camarade}.`,
  touche: touche => `Tu en as repoussé ${touche} toi-même.`,
  panne: siteName => `Un bâtiment est embrumé (${siteName}) : répare-le depuis sa fiche.`,
  held: 'Rien n’a été embrumé : le camp a tenu.'
};
