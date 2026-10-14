// Le Bestiaire vivant (HISTOIRE.md, § 6.5) : une bête dessinée apparaît dans les quartiers à soi dès que son élément
// est écrit dans le Grimoire ; les familiers (§ 8.2 et § 14) suivent leur maître dès que le leur l'est. Purement
// visuel : tout se déduit des éléments écrits. Les bêtes déjà là (bois, mer, ferme, climats) gardent leur règle : un
// joueur ne perd rien, le Bestiaire s'y ajoute.

import { FAMILIAR_TEXTS, PLACE, PLACE_SOON } from '@/texts/world/bestiary';

// Les bêtes du Grimoire (§ 1.2), du plus proche au plus lointain (serveur : services/quests.js, BEASTS)
export const BEASTS = ['Poisson', 'Méduse', 'Grenouille', 'Oiseau', 'Tortue', 'Papillon', 'Poule', 'Luciole', 'Abeille', 'Hibou', 'Renard',
  'Hérisson', 'Écureuil', 'Cerf', 'Vache', 'Cochon', 'Chèvre', 'Dauphin', 'Baleine', 'Mouton', 'Chat', 'Chien'];

// Où vit chaque bête écrite : nouvelle sur l'île (dans l'air, les arbres, au bord de l'eau, autour du Foyer), déjà là
// pour tous (la mer, les bois), variante de la ferme
const WHERE = {
  Poisson: 'mer', Méduse: 'mer', Dauphin: 'mer', Baleine: 'mer',
  Grenouille: 'eau', Tortue: 'eau',
  Oiseau: 'air', Papillon: 'air', Luciole: 'air', Abeille: 'air', Hibou: 'air',
  Renard: 'bois', Hérisson: 'bois', Écureuil: 'bois', Cerf: 'bois',
  Poule: 'ferme', Vache: 'ferme', Cochon: 'ferme', Chèvre: 'ferme', Mouton: 'ferme',
  Chat: 'foyer', Chien: 'foyer'
};
// La variante qu'un élément de la ferme ajoute aux bêtes que le palier du Potager montre déjà
const FARM = { Poule: [['hen', 'blanche'], ['hen', 'grise']], Vache: [['cow', 'rousse']], Mouton: [['sheep', 'noir']], Cochon: [['pig', 'tachete']], Chèvre: [['goat', 'brune']] };

// Les familiers : le maître (identifiant de son bâtiment), le nom, la bête dessinée, l'élément qui le fait venir
// (null : Tic-Tac est un automate, il est toujours là ; le bocal de Bulle aussi, vide tant que Poisson n'est pas écrit)
export const FAMILIARS = {
  ponton: { name: 'Bosco', species: 'puffin', element: 'Oiseau', ...FAMILIAR_TEXTS.ponton },
  foyer: { name: 'Bouillon', species: 'frog', element: 'Grenouille', ...FAMILIAR_TEXTS.foyer },
  atelier: { name: 'Tic-Tac', species: 'tictac', element: null, ...FAMILIAR_TEXTS.atelier },
  puits: { name: 'Bulle', species: 'bowl', element: null, ...FAMILIAR_TEXTS.puits },
  bosquet: { name: 'Mousse', species: 'kit', element: 'Renard', ...FAMILIAR_TEXTS.bosquet },
  carriere: { name: 'Basalte', species: 'tortoise', element: 'Tortue', ...FAMILIAR_TEXTS.carriere },
  potager: { name: 'Lunette', species: 'butterfly', variant: 'lune', element: 'Papillon', ...FAMILIAR_TEXTS.potager }
};

// Ce que les éléments écrits font vivre sur l'île : has(nom) (élément écrit), farm (variantes à ajouter : [sorte,
// variante]), familiars (maîtres dont le familier est là), bulle (Bulle est revenu dans son bocal), friend (Jovin a
// fabriqué une amie à Tic-Tac : Abeille écrite)
export function bestiaryOf(elements) {
  const written = new Set(elements || []);
  return {
    has: name => written.has(name),
    farm: Object.entries(FARM).filter(([name]) => written.has(name)).flatMap(([, variants]) => variants),
    familiars: new Set(Object.entries(FAMILIARS).filter(([, f]) => !f.element || written.has(f.element)).map(([id]) => id)),
    bulle: written.has('Poisson'),
    friend: written.has('Abeille')
  };
}

// La Chronique : les bêtes écrites, et où elles vivent
export const beastsOf = elements => {
  const written = new Set(elements || []);
  return BEASTS.filter(name => written.has(name)).map(name => ({ name, where: PLACE[WHERE[name]] || PLACE_SOON }));
};
// Les familiers déjà venus (la Chronique) ; Bulle, une fois revenu dans son bocal
export const familiarsOf = elements => {
  const life = bestiaryOf(elements);
  return [...life.familiars].filter(id => id !== 'puits' || life.bulle).map(id => ({ id, ...FAMILIARS[id] }));
};
