// Annexes côté navigateur (le serveur reste seul juge de la pose) : état de leur carte dans la fiche d'un bâtiment,
// variante de chaque annexe posée (ce qui pousse dans un champ…), production qu'elles ajoutent.
import { roman } from '@/utils/roman';

export const KIND_LABEL = { small: 'Petite annexe', reserve: 'Réserve', grand: 'Grande annexe', house: 'Logement', climate: 'Annexe de climat' };

// État d'une annexe du catalogue d'un bâtiment (site.annexes) : done (tous ses exemplaires posés), locked (palier du
// bâtiment), poor (ressources, trouvailles ou écus manquants), full (plus de case libre autour), ready ; text : ce que
// dit son bouton. stock : ressources et trouvailles de climat ; coins : solde connu, ou null (le serveur tranchera)
export function annexState(annex, site, stock, coins) {
  if (!annex.next) return { state: 'done', text: annex.max > 1 ? 'Toutes posées' : 'Posée' };
  if (site.level < annex.next.level) return { state: 'locked', text: `Palier ${roman(annex.next.level)}` };
  if (Object.entries(annex.next.cost).some(([r, n]) => (stock[r] || 0) < n)) return { state: 'poor', text: 'Ressources' };
  if (Object.entries(annex.next.finds || {}).some(([f, n]) => (stock[f] || 0) < n)) return { state: 'poor', text: 'Trouvailles' };
  if (coins !== null && coins < annex.next.coins) return { state: 'poor', text: `Il manque ${annex.next.coins - coins}` };
  if (!site.spots || !site.spots.length) return { state: 'full', text: 'Plus de place' };
  return { state: 'ready', text: 'Poser' };
}

// Une annexe de ce bâtiment peut se poser tout de suite (pastille de l'onglet)
export const annexReady = (site, stock, coins) => (site.annexes || []).some(a => annexState(a, site, stock, coins).state === 'ready');

// Rang de chaque annexe posée parmi celles du même nom, dans l'ordre de pose (le serveur les range ainsi). Clé « x,y »
// → n° d'exemplaire (0, 1, 2…)
export function ranksOf(annexes) {
  const count = {};
  const out = new Map();
  for (const a of annexes) {
    out.set(`${a.x},${a.y}`, count[a.annex] || 0);
    count[a.annex] = (count[a.annex] || 0) + 1;
  }
  return out;
}
// Variante dessinée de chaque annexe posée : la couleur choisie (look), sinon son rang, comme avant le choix des
// couleurs. Clé « x,y » → n°
export function variantsOf(annexes) {
  const ranks = ranksOf(annexes);
  return new Map(annexes.map(a => {
    const key = `${a.x},${a.y}`;
    return [key, Number.isInteger(a.look) ? a.look : ranks.get(key)];
  }));
}

// Ce que rapportent les annexes posées d'un bâtiment, par heure, avant les bonus de la boutique : { count, rate, earn }
export function annexYield(site) {
  const list = site.annexes || [];
  return {
    count: list.reduce((sum, a) => sum + a.built, 0),
    rate: list.reduce((sum, a) => sum + a.built * (a.gain.rate || 0), 0),
    earn: list.reduce((sum, a) => sum + a.built * (a.gain.earn || 0), 0)
  };
}
