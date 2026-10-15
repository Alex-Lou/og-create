// Les nuits des égarés (world/strays.js, recapOf) : ce que Brume dit au matin d'une nuit finie, une ligne par sort
// (sortis de la brume, changés en lucioles, barrés par une clôture, endormis contre elle, chassés par le coq, renvoyés
// par un camarade, renvoyés d'un toucher), puis le camp, embrumé (siteName : le nom du bâtiment) ou non. Le singulier et
// le pluriel s'écrivent en entier (choix de l'auteur, 15 oct. : ecriture/lots/03_egares.md)

// Le nom d'un bâtiment avec son article (choix de l'auteur, 15 oct.) : « la Mine », « l’Atelier », « le Puits ». Les noms
// féminins de ses paliers (services/world/rules.js du serveur) ; devant une voyelle, l'article s'élide
const FEMININE = new Set(['Cabane', 'Maison de l’alchimiste', 'Tour d’étude', 'Grande tour', 'Fissure', 'Carrière', 'Mine',
  'Galerie', 'Mine de cristal', 'Cité minière', 'Clairière aux fagots', 'Chênaie', 'Menuiserie', 'Forêt enchantée', 'Fontaine',
  'Fontaine de jouvence', 'Serre', 'Ferme', 'Forge', 'Fonderie', 'Grande forge', 'Manufacture', 'Usine', 'Criée']);
const theSite = name => (/^[aeiouyéèêâîôû]/i.test(name) ? `l’${name}` : `${FEMININE.has(name) ? 'la' : 'le'} ${name}`);

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
  panne: siteName => `Un égaré s’est posé sur ${theSite(siteName)}. Il a oublié son travail : il faudra le réparer.`,
  held: 'Rien n’a été embrumé. Le camp a tenu.'
};
