// Le Bestiaire des animaux rencontrés (choix de l'auteur, 18 oct.) : les 45 créatures qu'on peut croiser sur l'île et
// dans sa mer, dans l'ordre du livre (numéro, catégorie), avec leur dessin et leur rareté : les bêtes, le Géant des
// profondeurs et le Kraken (légendaires), les égarés des nuits. Leur « où et quand » se tire des règles qui les font
// vivre (village/wildLife.js : WILD_LIFE ; sea.js : SEA_RULES), ou d'un lieu qui n'est pas une zone (le Potager, les
// plages, la mer, le bord de la brume) : une seule source décide. Le premier toucher d'une créature sur l'île l'inscrit
// au Bestiaire ; un égaré, quand on le repousse (serveur : services/animals.js, la même liste).
import { WILD_LIFE } from './village/wildLife';
import { SEA_RULES } from './sea';
import { CREATURE_TEXTS, CATEGORY_TITLES, WHEN } from '@/texts/world/creatures';

export const CATEGORIES = Object.keys(CATEGORY_TITLES);
// Le dessin de chaque créature (sorte et variante : beastArt.js ; un égaré, stray et son dessin : nightArt.js ; le Géant
// et le Kraken, legend : faune/portraits.js), sa catégorie ; celles qui ne vivent pas par WILD_LIFE disent leur rareté et
// leur règle (les égarés, d'où ils sortent : serveur, services/nights.js ; la bête de brume, du climat de sa terre)
const LIST = [
  ['lapin', 'bois', 'rabbit'], ['ecureuil', 'bois', 'squirrel'], ['mesange', 'bois', 'bird'], ['renard', 'bois', 'fox'],
  ['herisson', 'bois', 'hedgehog'], ['cerf', 'bois', 'deer'], ['hibou', 'bois', 'owl'],
  ['papillon', 'fleurs', 'butterfly', 'jaune'], ['papillon-lune', 'fleurs', 'butterfly', 'lune'], ['luciole', 'fleurs', 'firefly'],
  ['abeille', 'fleurs', 'bee', '', { rarity: 'commun', place: 'potager', hours: ['jour'], weather: ['clair', 'voile', 'brume'], element: 'Abeille' }],
  ['grenouille', 'eau', 'frog'], ['tortue', 'eau', 'tortoise'], ['heron', 'eau', 'heron'],
  ['koi', 'eau', 'koi', '#F08A3A', { rarity: 'commun', place: 'eau', hours: ['toujours'] }],
  ['loutre', 'eau', 'otter', '', { rarity: 'rare', place: 'anya', hours: ['jour'], weather: ['clair', 'voile', 'brume'] }],
  ['crabe', 'mer', 'crab'],
  ['mouette', 'mer', 'gull', '', { rarity: 'commun', place: 'plages', hours: ['jour'] }],
  ['sardines', 'mer', 'fish', 'sardine', { rarity: 'commun', place: 'mer', hours: ['toujours'] }],
  ['dauphin', 'mer', 'dolphin', '', { rarity: 'peu commun', ...seaRule('dolphins') }],
  ['baleine', 'mer', 'whaleBack', '', { rarity: 'peu commun', ...seaRule('whale') }],
  ['geant', 'mer', 'legend', '', { rarity: 'légendaire', place: 'large', hours: ['toujours'] }],
  ['kraken', 'mer', 'legend', '', { rarity: 'légendaire', place: 'large', hours: ['nuit'] }],
  ['macareux', 'lointain', 'puffin'], ['poney', 'lointain', 'pony'], ['bouquetin', 'lointain', 'ibex'], ['renard-polaire', 'lointain', 'snowFox'],
  ['chameau', 'lointain', 'camel'], ['fennec', 'lointain', 'fennec'], ['toucan', 'lointain', 'toucan'], ['cameleon', 'lointain', 'chameleon'],
  ['corbeau', 'lointain', 'crow'], ['salamandre', 'lointain', 'salamander'],
  stray('fantome', 'commun', 'voile'), stray('zombie', 'peu commun', 'voile'), stray('noye', 'peu commun', 'rivage'),
  stray('racine', 'peu commun', 'lisiere'), stray('esprit', 'rare', 'voile'),
  stray('lapin-de-brume', 'peu commun', 'tempere'), stray('bouquetin-de-brume', 'rare', 'cimes'), stray('poney-de-brume', 'rare', 'landes'),
  stray('grenouille-de-brume', 'rare', 'marais'), stray('fennec-de-brume', 'rare', 'dunes'), stray('cameleon-de-brume', 'rare', 'jungle'),
  stray('salamandre-de-brume', 'rare', 'volcan')
];
// Un égaré des nuits : son dessin (nightArt.js), sa rareté, d'où il sort
function stray(id, rarity, place) {
  return [id, 'brume', 'stray', id, { rarity, place, hours: ['nuit'] }];
}
function seaRule(name) {
  const rule = SEA_RULES[name];
  return { zones: [rule.zone], hours: [rule.night ? 'nuit' : 'jour'], weather: rule.weather };
}
// La règle d'une créature qui vit par WILD_LIFE : ses zones réunies (la grenouille des berges et celle des marais), le
// reste de sa première entrée
function wildRule(id) {
  const entries = WILD_LIFE.filter(b => (b.animal || b.id) === id);
  const [first] = entries;
  return { rarity: first.rarity, zones: [...new Set(entries.flatMap(b => b.zones))], hours: first.hours, weather: first.weather, moon: Boolean(first.moon), act: first.act || null, element: first.element || null };
}

// [{ id, no, category, species, variant, name, text, rarity, zones?, place?, hours, weather, moon, act, element }]
export const CREATURES = LIST.map(([id, category, species, variant = '', rule], k) => ({
  id, no: k + 1, category, species, variant, name: CREATURE_TEXTS[id][0], text: CREATURE_TEXTS[id][1],
  ...(rule ? { zones: null, place: null, weather: null, moon: false, act: null, element: null, ...rule } : wildRule(id))
}));
const BY_ID = new Map(CREATURES.map(c => [c.id, c]));
export const creatureOf = id => BY_ID.get(id) || null;

// La créature qu'un toucher sur l'île vise (gestures.js : hit.animal), ou null : une bête qui vit (« wild:<entrée>:… »),
// une carpe, une abeille, une loutre d'Anya ; en mer, les dauphins, la baleine, un banc, des mouettes posées, le Géant,
// le Kraken ; la nuit, un égaré (son dessin : art)
const WILD_ANIMAL = new Map(WILD_LIFE.map(b => [b.id, b.animal || b.id]));
const BY_PREFIX = { koi: 'koi', 'best:bee': 'abeille', 'anya:otter': 'loutre' };
const BY_KIND = { pod: 'dauphin', whale: 'baleine', school: 'sardines', perch: 'mouette', geant: 'geant', kraken: 'kraken' };
export function creatureOfHit(animal) {
  if (!animal) return null;
  if (BY_KIND[animal.kind]) return BY_KIND[animal.kind];
  if (animal.kind === 'stray') return BY_ID.has(animal.art) ? animal.art : null;
  const id = animal.who && animal.who.id;
  if (!id) return null;
  if (id.startsWith('wild:')) return WILD_ANIMAL.get(id.split(':')[1]) || null;
  const prefix = Object.keys(BY_PREFIX).find(p => id.startsWith(`${p}:`));
  return prefix ? BY_PREFIX[prefix] : null;
}

// Le « où et quand » d'une créature : « Les Jardins · la nuit · ciel clair · pleine lune ». zones : les quartiers de la
// vue de l'île (leur nom ; une terre pas encore connue ne se nomme pas)
export function whereWhen(creature, zones) {
  const named = id => {
    const zone = zones.find(z => z.id === id);
    return zone && zone.known !== false ? zone.name : WHEN.unknownZone;
  };
  const where = creature.place ? WHEN.places[creature.place] : [...new Set(creature.zones.map(named))].join(', ');
  const parts = [where, creature.hours.map(h => WHEN.hours[h]).join(', ')];
  if (creature.weather) parts.push(creature.weather.map(w => WHEN.weather[w]).join(', '));
  if (creature.moon) parts.push(WHEN.moon);
  return parts.join(' · ');
}

// Ce qui la fera venir sur l'île, si elle n'y est pas encore (un élément à écrire, un acte à finir), ou null
export function arrivalOf(creature, { elements = [], acts = [] }) {
  if (creature.element && !elements.includes(creature.element)) return WHEN.element(creature.element);
  if (creature.act && !acts.includes(creature.act)) return WHEN.act(creature.act);
  return null;
}
