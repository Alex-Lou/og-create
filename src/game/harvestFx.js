// Le spectacle de la Récolte (choix de l'auteur, 14 oct. : « pas trop, mais waouh ») : ce que dit et fait chaque coup,
// selon la ressource cueillie et la longueur de la chaîne. Rien ici ne change le jeu : les gains restent ceux du moteur
// (game/harvest.js), que le serveur rejoue.

// Chaque ressource : ses onomatopées (une par coup, à tour de rôle), sa matière (forme et couleurs des éclats), sa couleur
export const KIND_FX = {
  wood: { words: ['CRAC !', 'TOC TOC !', 'CROC !'], shape: 'splinter', colors: ['#C98A4A', '#E2BD8C', '#8E5A2B', '#F2DEC0'], fill: ['#FFE1A8', '#E09A45'] },
  stone: { words: ['TCHAC !', 'CLONK !', 'TOC !'], shape: 'chip', colors: ['#A9A296', '#D9D2C5', '#7E776C', '#EFEAE0'], fill: ['#F4F1EA', '#A9A296'] },
  water: { words: ['PLOUF !', 'SPLASH !', 'FLOC !'], shape: 'drop', colors: ['#6FB8E6', '#A9DBF1', '#3E8FD0', '#E4F6FF'], fill: ['#D8F2FF', '#4FA3E0'] },
  food: { words: ['MIAM !', 'SCRONCH !', 'CROUNCH !'], shape: 'leaf', colors: ['#E8604C', '#F7C1A5', '#7DB46E', '#F2B33D'], fill: ['#FFD7C4', '#E8604C'] },
  fish: { words: ['FLIP !', 'FLOP !', 'SPLOUCH !'], shape: 'bubble', colors: ['#9CCBE6', '#E4F6FF', '#5E9CC8', '#F2B33D'], fill: ['#E4F6FF', '#5E9CC8'] }
};

// Les paliers d'une chaîne, du plus petit au plus grand : son mot (null : l'onomatopée suffit), ses couleurs, et la
// force du coup (secousse en px, éclats par tuile, éclair, arrêt sur image en ms)
export const TIERS = [
  { min: 3, label: null, fill: null, shake: 2, bits: 6, flash: null, freeze: 0, rank: 0 },
  { min: 4, label: 'Bien !', fill: ['#FFF3C4', '#F2B33D'], shake: 3, bits: 7, flash: null, freeze: 0, rank: 1 },
  { min: 5, label: 'Super !', fill: ['#FFF3C4', '#F08A3A'], shake: 5, bits: 8, flash: null, freeze: 0, rank: 2 },
  { min: 7, label: 'Génial !', fill: ['#E6F8D2', '#5FB34E'], shake: 7, bits: 9, flash: 'rgba(255, 244, 205, 1)', freeze: 0, rank: 3 },
  { min: 9, label: 'Fabuleux !', fill: ['#F3E2FF', '#A86BE8'], shake: 9, bits: 10, flash: 'rgba(240, 225, 255, 1)', freeze: 90, rank: 4 },
  { min: 12, label: 'LÉGENDAIRE !', fill: ['#FFF6D6', '#E9A23B'], shake: 12, bits: 11, flash: 'rgba(255, 236, 170, 1)', freeze: 160, rank: 5 }
];

// Le palier d'une chaîne de n tuiles
export function tierOf(n) {
  let tier = TIERS[0];
  for (const t of TIERS) if (n >= t.min) tier = t;
  return tier;
}

// L'onomatopée d'un coup : celle de sa ressource, à tour de rôle (moveIndex : le rang du coup dans la partie)
export const wordOf = (kind, moveIndex) => {
  const words = (KIND_FX[kind] || KIND_FX.stone).words;
  return words[moveIndex % words.length];
};

// La série en cours : combien de coups d'affilée, jusqu'au dernier, ont fait une belle chaîne (au moins `min` tuiles)
export function streakOf(lengths, min = 5) {
  let n = 0;
  for (let i = lengths.length - 1; i >= 0 && lengths[i] >= min; i--) n++;
  return n;
}
