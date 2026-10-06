// Coffres de l'île (lot 4g) : raretés, texte d'un lot, bouteille à la mer et ses mots. Le serveur tire les lots
// (services/loot.js) ; ici, seulement ce qui se montre.
import { sprite } from './iso';
import { GLYPH, LABEL } from '@/game/resources';

export const RARITY = {
  commun: { label: 'Commun', color: '#9DBB6E' },
  rare: { label: 'Rare', color: '#4C8FE8' },
  epique: { label: 'Épique', color: '#A86BE8' },
  legendaire: { label: 'Légendaire', color: '#F2C04B' }
};

// Ce que contient un coffre, en une ligne : « 25 écus », « 20 bois · 30 eau », « Teinte Craie », « Papillons »
export function prizeText(prize) {
  if (prize.kind === 'coins') return `${prize.amount} écus`;
  if (prize.kind === 'stock') return stockOf(prize).map(s => `${s.n} ${s.label}`).join(' · ');
  if (prize.kind === 'tint') return `Teinte ${prize.name}`;
  return prize.name;
}

// Ressources d'un lot, avec leur icône : [{ glyph, n, label }]
export function stockOf(prize) {
  return Object.entries(prize.stock || {}).map(([r, n]) => ({ glyph: GLYPH[r], n, label: LABEL[r] }));
}

// Coffres qu'ouvre « Tout ouvrir » (vue du serveur) : celui du jour s'il attend, ceux des chapitres et des quêtes, la
// bouteille échouée
export function openableOf(chests) {
  return (chests.daily.available ? 1 : 0) + chests.pending.length + (chests.bottle.available ? 1 : 0);
}

// Bilan d'une ouverture en rafale : écus et ressources additionnés, nombre de teintes et pièces rares
export function haulOf(chests) {
  const stock = {};
  let coins = 0;
  let items = 0;
  for (const { prize } of chests) {
    if (prize.kind === 'coins') coins += prize.amount;
    else if (prize.kind === 'stock') for (const [r, n] of Object.entries(prize.stock)) stock[r] = (stock[r] || 0) + n;
    else items++;
  }
  return { coins, stock: stockOf({ stock }), items };
}

// D'où vient un coffre (titre de l'ouverture)
export function sourceText(source, streak) {
  if (source.startsWith('jour')) return streak ? `Coffre du jour · jour ${streak}` : 'Coffre du jour';
  if (source.startsWith('recolte')) return 'Coffre de la Récolte';
  if (source.startsWith('bouteille')) return 'Bouteille à la mer';
  if (source.startsWith('chapitre:')) return `Coffre du chapitre ${source.slice(9)}`;
  if (source.startsWith('lieu:')) return 'Trésor de l’explorateur';
  return 'Coffre de Brume';
}

// Mots d'Héliane, la dernière alchimiste des Anciens, glissés dans les bouteilles (un par bouteille, toujours le même
// pour une bouteille). Elle signe « H. » : son prénom ne se découvre que plus tard (HISTOIRE.md, § 6.13).
const SIGN = ' — H.';
const NOTES = [
  'Si tu lis ceci, l’île t’a choisi. Prends soin des poules : elles savent tout.',
  'J’ai caché des choses dans la brume. Pas toutes : il fallait bien te laisser des surprises.',
  'Le vent tourne toujours à l’heure du thé. Je n’ai jamais su pourquoi.',
  'Brume parle beaucoup, mais elle a raison presque à chaque fois.',
  'Une longue chaîne à la Récolte, et la mer se montre généreuse.',
  'J’ai planté le premier pommier de travers. Il a poussé droit quand même.',
  'Les dauphins reviennent quand on chante faux. J’ai essayé.',
  'Un jour, la baleine m’a saluée. Je crois. Ou elle éternuait.',
  'Garde un œil sur les plages : la mer rend toujours ce qu’on lui confie.',
  'Le Grimoire n’aime pas qu’on le brusque. Mélange doucement.',
  'J’ai laissé la clé du phare sous une pierre. Laquelle ? Bonne question.',
  'Chaque lumière allumée sur l’île repousse un peu la brume. Allume-les toutes.'
];
// Les mots d'histoire (HISTOIRE.md, § 6.13 et § 10) : un par acte, dans la première bouteille ouverte pendant l'acte
// (le serveur le dit : chest.story). Signés « H. », puis « Héliane » à partir de l'acte V, où l'on découvre son prénom
export const HELIANE = {
  I: 'Si tu lis ceci, l’île t’a choisi. Allume les lumières : toutes. — H.',
  II: 'Le Grimoire n’aime pas qu’on le brusque. Mélange doucement. — H.',
  III: 'Nous aussi, nous étions des naufragés. L’île nous a gardés longtemps. — H.',
  IV: 'Prends soin des poules : elles savent tout. Et des dauphins : ils savent le reste. — H.',
  V: 'Une table, une soupe, un nom : c’est comme ça que tout commence. — Héliane.',
  VI: 'Nous avons cessé d’écrire, et la brume nous a effacés. Ne cessez jamais. — Héliane.',
  VII: 'Brume n’est pas une malédiction. C’est ce qui reste d’une île quand on l’oublie. Écrivez-la, et elle ne sera plus jamais seule. Et si un jour la Dame s’éveille, dites-lui que nous l’aimions. — Héliane.'
};
// Le mot d'une bouteille : celui de l'acte (story), ou l'un des mots drôles, toujours le même pour une bouteille
export function noteOf(key, story = null) {
  if (story && HELIANE[story]) return HELIANE[story];
  let h = 0;
  for (const c of String(key)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return NOTES[h % NOTES.length] + SIGN;
}

// Bouteille échouée : verre vert, bouchon, rouleau de papier ; frame 1 : penchée par la vague
const BOTTLE_BOX = { x: -16, y: -28, w: 32, h: 32 };
function bottle(frame) {
  const tilt = frame ? -14 : -6;
  return sprite(`<ellipse cx="0" cy="0" rx="9" ry="2.4" fill="rgba(30,50,60,.25)"/>`
    + `<g transform="rotate(${tilt}) translate(0,-4)">`
    + `<rect x="-9" y="-5" width="15" height="9" rx="4.2" fill="#5FA77A" stroke="#2F6B4A" stroke-width="0.9"/>`
    + `<rect x="5.5" y="-2.4" width="5" height="3.8" rx="1" fill="#5FA77A" stroke="#2F6B4A" stroke-width="0.8"/>`
    + `<rect x="10" y="-2.2" width="3.2" height="3.4" rx="0.8" fill="#B8875A"/>`
    + `<rect x="-6" y="-2.6" width="9" height="4.4" rx="1.6" fill="#F3E6C4" opacity=".92"/>`
    + `<path d="M-8,-3.6 Q-2,-5.2 4,-3.8" stroke="rgba(255,255,255,.6)" stroke-width="1.1" fill="none"/>`
    + `</g>`, BOTTLE_BOX);
}
export const BOTTLE = [0, 1].map(f => () => bottle(f));
