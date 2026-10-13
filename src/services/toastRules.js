// Les règles des notifications (services/notificationService.js ; choix de l'auteur, 13 oct.), à part pour être testées

export const MAX_TOASTS = 3;

// Deux listes de gains ([{ glyph, text: '+N' }]) en une : les mêmes icônes s'additionnent, les nouvelles s'ajoutent
export function addGains(a, b) {
  const out = a.map(g => ({ ...g }));
  for (const g of b) {
    const same = out.find(o => o.glyph === g.glyph);
    const n = parseInt(g.text, 10);
    if (same && Number.isFinite(n)) same.text = `+${parseInt(same.text, 10) + n}`;
    else out.push({ ...g });
  }
  return out;
}

// Celle qui laisse sa place quand il y en a trop : la plus ancienne qui n'est pas une erreur (une erreur dit ce qui
// n'a pas marché : elle reste), sinon la plus ancienne ; null s'il y a la place
export function toEvict(list, max = MAX_TOASTS) {
  if (list.length <= max) return null;
  return list.find(t => t.type !== 'error') || list[0];
}
