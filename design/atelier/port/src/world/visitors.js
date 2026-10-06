// Visiteurs (lot 7d) : ce qu'ils disent, comment dire leur demande et leur départ, leur allure (d'après la graine du
// serveur) et le bateau qui les amène au Ponton. Prénom, métier, demande et récompense viennent du serveur
// (services/visitors.js, mêmes identifiants de bâtiments).
import { personOf } from './villagers.js';
import { sprite } from './iso.js';

// Allure d'un visiteur : un adulte (jamais d'enfant), sac de voyage souvent
export function visitorLook(seed, role = 'Visiteur') {
  const look = personOf(seed, { label: role });
  return look.build === 'child' ? { ...look, build: 'slim' } : look;
}

// Ce qu'il raconte de lui, selon son métier (le bâtiment où il travaillerait)
const STORIES = {
  potager: 'Je collectionne les graines des îles. Les vôtres poussent si bien…',
  carriere: 'J’étudie les roches. Votre île cache des veines superbes.',
  bosquet: 'Je travaille le bois rare. On m’a parlé de vos arbres.',
  puits: 'Je suis les sources d’île en île. La vôtre chante joliment.',
  ponton: 'Je dessine les côtes. Votre crique n’est sur aucune carte !',
  atelier: 'Je façonne des bijoux. Il me faut de belles pierres.',
  foyer: 'J’écris des poèmes sur les îles. La vôtre m’inspire déjà.'
};
export const storyOf = visitor => STORIES[visitor.site] || STORIES.foyer;

// Ressources au pluriel, dans les demandes
const WORDS = { stone: 'pierres', wood: 'bûches', water: 'seaux d’eau', food: 'vivres' };

// La demande en clair : « Livrer 30 vivres », « Faire 2 Récoltes (1/2) »
export function requestText(request) {
  if (request.kind === 'livrer') return `Livrer ${request.amount} ${WORDS[request.resource] || request.resource}`;
  return `Faire ${request.count} Récolte${request.count > 1 ? 's' : ''} pendant son séjour (${request.have || 0}/${request.count})`;
}
// Ce qu'il demande quand on lui parle, puis quand c'est fait
export function askLine(visitor) {
  if (visitor.satisfied) return 'Merci encore ! Je profite de votre île avant de repartir.';
  const r = visitor.request;
  if (r.kind === 'livrer') return `Il me faudrait ${r.amount} ${WORDS[r.resource] || r.resource} pour la suite de mon voyage. Vous pourriez m’aider ?`;
  return (r.have || 0) >= r.count ? 'Quelles Récoltes ! C’est exactement ce que je voulais voir.' : `J’aimerais voir vos Récoltes : ${r.count} pendant mon séjour !`;
}
export const THANKS = 'Merci infiniment ! Voici pour vous, de bon cœur.';
// La demande peut être comblée maintenant (le serveur vérifie de nouveau)
export function readyOf(visitor, stock) {
  if (visitor.satisfied) return false;
  const r = visitor.request;
  return r.kind === 'livrer' ? (stock[r.resource] || 0) >= r.amount : (r.have || 0) >= r.count;
}
// Départ en clair : « dans 2 j », « dans 5 h », « dans 20 min »
export function leavesText(ms) {
  const hours = ms / 3600000;
  if (hours >= 24) return `dans ${Math.round(hours / 24)} j`;
  if (hours >= 1) return `dans ${Math.floor(hours)} h`;
  return `dans ${Math.max(1, Math.ceil(ms / 60000))} min`;
}

// Bateau du visiteur, amarré près du Ponton : coque, cabine, malle, voile et fanion. Ancrage : la ligne de flottaison,
// en unités du monde ; il regarde vers la droite. frame 0 ou 1 : le fanion claque au vent
const BOAT_BOX = { x: -30, y: -56, w: 62, h: 64 };
export function visitorBoat(frame = 0) {
  const flag = frame ? 'M3,-50 L13,-47.6 L3,-45.2 Z' : 'M3,-50 L12,-48.6 L13,-46 L3,-45.2 Z';
  return sprite('<ellipse cx="0" cy="4" rx="27" ry="5" fill="rgba(30,70,110,.25)"/>'
    + '<path d="M-26,-6 L26,-6 Q22,4 10,6 L-14,6 Q-24,4 -26,-6 Z" fill="#8C5A34" stroke="#3C2819" stroke-width="0.8"/>'
    + '<path d="M-26,-6 L26,-6 L23,-2 L-23,-2 Z" fill="#FBF6EA"/>'
    + '<path d="M-24,0.5 L24,0.5" stroke="#3E6E9C" stroke-width="1.4"/>'
    + '<path d="M-18,-6 L-18,-15 L-6,-15 L-6,-6 Z" fill="#E9D3A8" stroke="#3C2819" stroke-width="0.7"/>'
    + '<path d="M-19.5,-15 L-12,-19 L-4.5,-15 Z" fill="#C9473A"/>'
    + '<rect x="-15.6" y="-12.6" width="3.6" height="3.4" rx="0.6" fill="#7FC4E8"/>'
    + '<rect x="9" y="-11" width="9" height="5" rx="1" fill="#6B4A2E"/><path d="M9,-8.6 L18,-8.6" stroke="#E2B347" stroke-width="1"/>'
    + '<line x1="2" y1="-6" x2="2" y2="-50" stroke="#5A3A20" stroke-width="2"/>'
    + '<path d="M3,-44 L3,-9 L22,-11 Z" fill="#FFFDF8" stroke="rgba(60,40,25,.5)" stroke-width="0.8"/>'
    + '<path d="M3,-30 L14.6,-29 L17,-21 L3,-21 Z" fill="#6FA3D9" opacity=".55"/>'
    + `<path d="${flag}" fill="#E2483A"/>`, BOAT_BOX);
}
