// Où mène un objectif (choix de l'auteur, 15 oct. : toucher un objectif du suivi des quêtes amène la caméra exactement
// sur ce qu'il faut toucher, et la main du coach le montre). La cible du coach (game/coach.js : « île:<nom> » sur l'île,
// WorldView coach.js : coachWorld ; ou un sélecteur), ou null. quest : la quête active (serveur : kind, target
// { site | zone | villager | landmark }, done) ; near : ce que l'île sait trouver ({ villager, cell } : l'habitant le plus
// proche du cœur, la case d'un lieu, d'un gisement ou d'une terre à explorer). [cibles] : la première est celle où va la
// caméra ; le coach montre la plus avancée qui est à l'écran (la bulle d'un besoin, plutôt que l'habitant)

const GRIMOIRE = '.tabbar__item[data-tab="infinite"]';
const HARVEST = '.world__play--fab';
// Les objectifs qui se font à un endroit fixe de l'île
const FIXED = {
  sleep: ['île:brume'], name: ['île:brume'], pickup: ['île:trouvaille'], crate: ['île:caisse'], cage: ['île:cage'],
  hens: ['île:poule'], shelter: ['île:coin:cannelle'], fence: ['île:coin:cannelle'], runs: [HARVEST],
  annex: ['île:site:foyer'], coop: ['île:site:foyer'], house: ['île:site:foyer'],
  // (l'établi s'ouvre depuis la fiche de l'Atelier ; les voyageurs accostent au Ponton)
  craft: ['île:site:atelier'], crafts: ['île:site:atelier'], visitor: ['île:site:ponton'], settle: ['île:site:ponton']
};

export function questPointOf(quest, near = {}) {
  if (!quest) return [];
  // (faite : la récompense attend auprès de Brume)
  if (quest.done) return ['île:brume'];
  const target = quest.target || {};
  if (quest.kind === 'element' || quest.kind === 'stars' || quest.chapter || quest.ariane) return [GRIMOIRE];
  if (FIXED[quest.kind]) return FIXED[quest.kind];
  const villager = target.villager || near.villager;
  if (quest.kind === 'need' && villager) return [`île:habitant:${villager}`, `île:besoin:${villager}`];
  if ((quest.kind === 'wake' || quest.kind === 'heart') && villager) return [`île:habitant:${villager}`];
  if (['expedition', 'landmark', 'gather'].includes(quest.kind) && near.cell) return [`île:case:${near.cell.x}:${near.cell.y}`];
  if (target.site) return [`île:site:${target.site}`];
  if (target.zone) return [`île:quartier:${target.zone}`];
  if (villager) return [`île:habitant:${villager}`];
  return [];
}
