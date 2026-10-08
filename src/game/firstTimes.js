// Les dialogues de première fois (design/dialogues/chantiers.json) : bâtir (Ondin), faire évoluer (Rivet), ramasser
// (Cannelle), poser un champ (Mélisse), ramasser un gisement (Galet, que Brume traduit). Chaque moment se dit une fois,
// par celui qui le montre ; ses bulles marquées « apres » attendent que le joueur ait fait le geste
import DIALOGUES from '../../design/dialogues/chantiers.json';

const MOMENTS = Object.fromEntries(DIALOGUES.moments.map(m => [m.id, m]));

// Les bulles d'un moment : avant le geste, ou après (after) ; [{ id, who (bâtiment de qui parle, ou 'brume'), text }]
export function momentLines(id, after = false) {
  const moment = MOMENTS[id];
  return moment ? moment.bulles.filter(b => Boolean(b.apres) === after).map(b => ({ id: b.id, who: b.qui, text: b.texte })) : [];
}

// Les moments dus dans la vue de l'île, dans l'ordre : [{ id, after }]. island : { state, met (habitants là), ready
// (site → bâtir ou évoluer est payable), deposits (gisements prêts), said (id d'une bulle déjà dite) }
export function momentsDue({ state, met, ready, deposits, said }) {
  const out = [];
  const sites = state.sites || [];
  const site = id => sites.find(s => s.id === id);
  // Bâtir : le terrain du Puits prêt (le plan trouvé, de quoi payer), Ondin à côté ; puis le Puits bâti
  const puits = site('puits');
  if (met.has('puits') && puits && !puits.level && !puits.locked && ready(puits)) out.push({ id: 'premier-chantier' });
  if (puits && puits.level >= 1 && said('dlg-premier-chantier-1')) out.push({ id: 'premier-chantier', after: true });
  // Évoluer : un bâtiment fondé peut passer au palier suivant, Rivet est là ; puis un palier II atteint
  if (met.has('atelier') && sites.some(s => s.level >= 1 && !s.locked && s.next && ready(s))) out.push({ id: 'premiere-evolution' });
  if (sites.some(s => s.level >= 2) && said('dlg-premiere-evolution-1')) out.push({ id: 'premiere-evolution', after: true });
  // Ramasser : une première bulle de production, Cannelle est là (la suite se dit au ramassage : collected)
  if (met.has('foyer') && sites.some(s => s.pending && Object.values(s.pending).some(n => n > 0))) out.push({ id: 'premiere-production' });
  // Un champ : le Potager peut poser sa première annexe, Mélisse est là ; puis une annexe posée
  const potager = site('potager');
  if (met.has('potager') && potager && potager.level >= 2) out.push({ id: 'premier-champ' });
  if (potager && (potager.annexes || []).some(a => a.built > 0) && said('dlg-premier-champ-1')) out.push({ id: 'premier-champ', after: true });
  // Un gisement prêt dans un quartier à soi, Galet est là
  if (met.has('carriere') && deposits > 0) out.push({ id: 'premier-gisement' });
  return out;
}
