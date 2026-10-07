// Les choix de l'avatar (HISTOIRE.md § 6.17) : nuanciers, formes, accessoires, et ce qui se gagne.
// Données seulement : le dessin est dans avatar.js (corps, tête, habits) et avatar_accessoires.js.
//
// Règles :
// - Les nuanciers de peau, d'yeux, de cheveux et de tissus sont tous libres, dès la création. La peau et les yeux ne se
//   gagnent jamais.
// - Se gagnent pour toujours, à la boutique (écus) ou dans les coffres : les accessoires marqués « boutique » ou
//   « coffre » et les teintures rares (TEINTURES), qui s'ajoutent aux nuanciers des tissus et des cheveux.
// - Tout est cosmétique : aucun choix ne donne d'avantage de jeu.
// - Raretés : celles des coffres du jeu (src/world/chest.js) : commun, rare, epique, legendaire.

// ---- couleurs ----
function hsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
function hex([h, s, l]) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return '#' + [r, g, b].map(v => Math.round(Math.min(1, Math.max(0, v + m)) * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
}
// mélange de deux couleurs (k = part de la seconde)
const mix = (a, b, k) => { const p = c => [0, 2, 4].map(i => parseInt(c.slice(1 + i, 3 + i), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * k).toString(16).padStart(2, '0')).join('').toUpperCase(); };
// plus sombre (k < 1) ou plus clair (k > 1), en gardant la teinte
const tone = (c, k) => { const [h, s, l] = hsl(c); return hex([h, s, k < 1 ? l * k : l + (1 - l) * (k - 1)]); };
// couleur délavée par la mer (même formule que design/atelier/naufrage.js)
const delave = (c, k = 1) => { const [h, s, l] = hsl(c); return hex([h, s * (1 - 0.45 * k), l + (0.74 - l) * 0.26 * k]); };
const clarte = c => hsl(c)[2];

// ---- les nuanciers : [clé, couleur, nom affiché] ----
const nuancier = list => Object.fromEntries(list.map(([k, c]) => [k, c]));
const noms = list => Object.fromEntries(list.map(([k, , n]) => [k, n]));

// Peau : du plus clair au plus foncé, sous-tons rosés, dorés et cuivrés (les six du jeu en font partie)
const PEAU = [
  ['nacre', '#FCE8D8', 'Nacre'], ['porcelaine', '#F6D3B3', 'Porcelaine'], ['rosee', '#F3C9B4', 'Rosée'], ['peche', '#F2C9A0', 'Pêche'],
  ['doree', '#EDC294', 'Dorée'], ['miel', '#E9B98F', 'Miel'], ['sable', '#DCAA7A', 'Sable'], ['ocre', '#D09A68', 'Ocre'],
  ['cannelle', '#C98B5E', 'Cannelle'], ['bronze', '#B47A4C', 'Bronze'], ['cuivre', '#A26A42', 'Cuivre'], ['cacao', '#8D5A3B', 'Cacao'],
  ['acajou', '#7C4C33', 'Acajou'], ['ebene', '#6B4430', 'Ébène'], ['ombre', '#5C3A28', 'Terre d\'ombre'], ['nuit', '#4A2E20', 'Nuit']
];
// Cheveux : les naturels (dont les huit du jeu), puis les fantaisie
const CHEVEUX = [
  ['jais', '#221B17', 'Noir de jais'], ['noir', '#3A2A1E', 'Noirs'], ['chocolat', '#5A3A26', 'Chocolat'], ['brun', '#7A4E2C', 'Bruns'],
  ['auburn', '#8E3B26', 'Auburn'], ['roux', '#B94E3A', 'Roux'], ['cuivre', '#C8642F', 'Cuivrés'], ['chatain', '#C9873E', 'Châtains'],
  ['venitien', '#D9935A', 'Blond vénitien'], ['blond', '#E8C46A', 'Blonds'], ['platine', '#F2E3B3', 'Blond platine'], ['gris', '#8A8F98', 'Gris'],
  ['blanc', '#D9D4CC', 'Blancs'], ['nuit', '#2E2E3A', 'Bleu nuit'],
  ['bonbon', '#F28AB2', 'Rose bonbon'], ['poudre', '#E8B4C0', 'Rose poudré'], ['cerise', '#C0304A', 'Cerise'], ['corail', '#F08A6E', 'Corail'],
  ['lilas', '#B79BDB', 'Lilas'], ['violet', '#7A4FB0', 'Violet'], ['ciel', '#8EC5E8', 'Bleu ciel'], ['turquoise', '#4FB8B0', 'Turquoise'],
  ['menthe', '#9ADBB8', 'Menthe'], ['sapin', '#3E6E4E', 'Vert sapin']
];
const YEUX = [
  ['brun', '#2A2420', 'Bruns'], ['chocolat', '#4A3020', 'Chocolat'], ['noisette', '#6B4A2A', 'Noisette'], ['ambre', '#A0682A', 'Ambre'],
  ['or', '#B8902F', 'Dorés'], ['olive', '#6B7A3A', 'Olive'], ['vert', '#3E6B3A', 'Verts'], ['emeraude', '#2E8A5A', 'Émeraude'],
  ['eau', '#4F9A92', 'Vert d\'eau'], ['azur', '#4E8FD0', 'Azur'], ['bleu', '#3A5C8C', 'Bleus'], ['grisbleu', '#6A7F96', 'Gris-bleu'],
  ['gris', '#4E5560', 'Gris'], ['violet', '#6E4E9E', 'Violets'], ['rose', '#C26A8E', 'Roses'], ['noir', '#1E1A18', 'Noirs']
];
// Tissus : un seul nuancier pour le haut, le bas, les chaussures et les accessoires
const TISSUS = [
  ['blanc', '#F8F4EA', 'Blanc'], ['creme', '#F1E6CC', 'Crème'], ['sable', '#C9B080', 'Sable'], ['caramel', '#B07A48', 'Caramel'],
  ['cuir', '#5E3A22', 'Cuir'], ['charbon', '#4A4E5C', 'Charbon'], ['noir', '#2E2A2A', 'Noir'],
  ['rosepale', '#F4C2CC', 'Rose pâle'], ['rose', '#E8879C', 'Rose'], ['framboise', '#C8466E', 'Framboise'], ['corail', '#E8705A', 'Corail'],
  ['rouge', '#C8463A', 'Rouge'], ['bordeaux', '#6E2E3A', 'Bordeaux'],
  ['abricot', '#F2A65A', 'Abricot'], ['soleil', '#F2C04B', 'Soleil'],
  ['menthe', '#7EC4A0', 'Menthe'], ['olive', '#6E7A44', 'Olive'], ['foret', '#4E7A4A', 'Forêt'],
  ['ciel', '#6FA3D9', 'Ciel'], ['lagon', '#3FA7A8', 'Lagon'], ['jean', '#3E5A8C', 'Jean'], ['marine', '#2E3E66', 'Marine'],
  ['lavande', '#A48CD6', 'Lavande'], ['prune', '#7A3E5E', 'Prune']
];
// Métaux : montures de lunettes, bijoux, diadème
const METAUX = [['or', '#E2B34A', 'Or'], ['argent', '#C9CED6', 'Argent'], ['orrose', '#E6A88E', 'Or rose'], ['cuivre', '#C77A4A', 'Cuivre'], ['sombre', '#4A3A30', 'Écaille sombre']];
// Lèvres teintées (« naturelles » : sans teinte)
const LEVRES = [['naturelles', null, 'Naturelles'], ['rose', '#E07A8A', 'Rosées'], ['corail', '#E8705A', 'Corail'], ['framboise', '#C8466E', 'Framboise'], ['nude', '#C98B7A', 'Nude'], ['prune', '#8E3E5E', 'Prune'], ['rouge', '#C8303A', 'Rouges']];
// Teintures rares : elles se gagnent (boutique, coffres) et s'ajoutent aux tissus et aux cheveux
const TEINTURES = [
  ['nacre', '#F3E6EE', 'Nacre', 'rare', 'boutique'], ['opale', '#BFE3E0', 'Opale', 'rare', 'coffre'], ['or', '#E2B34A', 'Or', 'epique', 'coffre'],
  ['argent', '#C9CED6', 'Argent', 'rare', 'boutique'], ['rubis', '#B0203A', 'Rubis', 'epique', 'coffre'], ['saphir', '#2A4FA8', 'Saphir', 'epique', 'boutique'],
  ['emeraude', '#1E7A4E', 'Émeraude', 'epique', 'coffre'], ['amethyste', '#7A3EA8', 'Améthyste', 'rare', 'coffre'], ['onyx', '#1E1A1C', 'Onyx', 'rare', 'boutique'],
  ['aurore', '#F7B7A3', 'Aurore', 'legendaire', 'coffre']
];

const NUANCIERS = {
  peau: nuancier(PEAU), cheveux: nuancier(CHEVEUX), yeux: nuancier(YEUX), tissus: nuancier(TISSUS), metaux: nuancier(METAUX),
  levres: nuancier(LEVRES), teintures: nuancier(TEINTURES)
};
const NOMS_NUANCIERS = {
  peau: noms(PEAU), cheveux: noms(CHEVEUX), yeux: noms(YEUX), tissus: noms(TISSUS), metaux: noms(METAUX), levres: noms(LEVRES), teintures: noms(TEINTURES)
};
const TEINTURES_GAINS = Object.fromEntries(TEINTURES.map(([k, , , rarete, source]) => [k, { rarete, source }]));

// ---- les formes ----
const FORMES = {
  taille: { petite: 'Petite', moyenne: 'Moyenne', grande: 'Grande' },
  silhouette: { fine: 'Fine', moyenne: 'Moyenne', large: 'Large', ronde: 'Ronde' },
  visage: { rond: 'Rond', ovale: 'Ovale', carre: 'Carré' },
  formeYeux: { ronds: 'Ronds', amande: 'En amande', grands: 'Grands', rieurs: 'Rieurs', paisibles: 'Paisibles' },
  cils: { sans: 'Sans', legers: 'Légers', recourbes: 'Recourbés' },
  sourcils: { fins: 'Fins', epais: 'Épais', doux: 'Doux' },
  bouche: { douce: 'Douce', sourire: 'Souriante', malice: 'Malicieuse', serieuse: 'Sérieuse' },
  rousseur: { non: 'Sans', legere: 'Quelques-unes', oui: 'Taches de rousseur' },
  joues: { roses: 'Roses', discretes: 'Discrètes' },
  grain: { non: 'Sans', joue: 'Sur la joue', levre: 'Au coin de la lèvre' },
  coupe: {
    courte: 'Courte', meche: 'Mèche', bataille: 'En bataille', carre: 'Carré', milongue: 'Mi-longue', longue: 'Longue',
    ondulee: 'Longue ondulée', queue: 'Queue de cheval', queueCote: 'Queue sur le côté', couettes: 'Couettes', chignon: 'Chignon',
    deuxChignons: 'Deux chignons', couronne: 'Couronne tressée', tresses: 'Tresses', bouclee: 'Bouclée', locks: 'Locks', rasee: 'Rasée'
  },
  meches: { sans: 'Une couleur', pointes: 'Pointes colorées', meches: 'Mèches' },
  haut: { tshirt: 'T-shirt', mariniere: 'Marinière', pull: 'Pull', sweat: 'Sweat à capuche', chemise: 'Chemise', veste: 'Veste ouverte' },
  // la robe d'une pièce remplace le haut (le choix du haut est gardé : il revient si l'on change de bas)
  bas: { pantalon: 'Pantalon', short: 'Short', jupe: 'Jupe', salopette: 'Salopette', robe: 'Robe chasuble', robeEntiere: 'Robe' }
};

// ---- les accessoires : un par emplacement ----
const EMPLACEMENTS = {
  tete: 'Tête', cheveux: 'Dans les cheveux', visage: 'Lunettes', joues: 'Sur les joues', oreilles: 'Oreilles', cou: 'Cou', dos: 'Dos', main: 'À la main',
  dessus: 'Par-dessus', pieds: 'Aux pieds', mains: 'Aux mains'
};
// a : [nom, emplacement, zones de couleur (« tissu » ou « metal »), couleurs par défaut, rareté, source, garde (naufragé),
// saison (facultatif)]
// garde : ce que la mer laisse au naufragé (les chapeaux, les sacs et ce qu'on tient sont perdus, le maquillage part)
// saison : une tenue de saison (« hiver » ou « pluie »), qu'on met par-dessus sa tenue ; elle ne se tire pas au hasard
const A = (nom, emplacement, zones, defaut, rarete, source, garde, saison) => ({ nom, emplacement, zones, defaut, rarete, source, garde, ...(saison ? { saison } : {}) });
const ACCESSOIRES = {
  bonnet: A('Bonnet', 'tete', ['tissu'], ['marine'], 'commun', 'gratuit', false),
  paille: A('Chapeau de paille', 'tete', ['tissu'], ['rouge'], 'commun', 'gratuit', false),
  casquette: A('Casquette', 'tete', ['tissu'], ['ciel'], 'commun', 'gratuit', false),
  bandana: A('Bandana', 'tete', ['tissu'], ['rouge'], 'commun', 'gratuit', true),
  couronneFleurs: A('Couronne de fleurs', 'tete', ['tissu'], ['rose'], 'commun', 'gratuit', false),
  beret: A('Béret', 'tete', ['tissu'], ['bordeaux'], 'commun', 'boutique', false),
  oreillesChat: A('Oreilles de chat', 'tete', ['tissu'], ['noir'], 'rare', 'boutique', false),
  oreillesLapin: A('Oreilles de lapin', 'tete', ['tissu'], ['blanc'], 'rare', 'coffre', false),
  diademe: A('Diadème', 'tete', ['metal'], ['or'], 'legendaire', 'coffre', false),
  noeud: A('Nœud', 'cheveux', ['tissu'], ['rose'], 'commun', 'gratuit', true),
  barrettes: A('Barrettes', 'cheveux', ['tissu'], ['soleil'], 'commun', 'gratuit', true),
  fleur: A('Fleur', 'cheveux', ['tissu'], ['corail'], 'commun', 'boutique', true),
  etoile: A('Barrette étoile', 'cheveux', ['metal'], ['or'], 'rare', 'coffre', true),
  lunettesRondes: A('Lunettes rondes', 'visage', ['metal'], ['sombre'], 'commun', 'gratuit', true),
  lunettesCarrees: A('Lunettes carrées', 'visage', ['tissu'], ['noir'], 'commun', 'gratuit', true),
  lunettesPapillon: A('Lunettes papillon', 'visage', ['tissu'], ['framboise'], 'commun', 'boutique', true),
  lunettesSoleil: A('Lunettes de soleil', 'visage', ['tissu'], ['noir'], 'commun', 'boutique', false),
  lunettesCoeur: A('Lunettes cœur', 'visage', ['tissu'], ['rose'], 'rare', 'coffre', false),
  coeurs: A('Petits cœurs', 'joues', ['tissu'], ['rose'], 'commun', 'gratuit', false),
  etoiles: A('Petites étoiles', 'joues', ['tissu'], ['soleil'], 'commun', 'boutique', false),
  pansement: A('Pansement', 'joues', ['tissu'], ['creme'], 'commun', 'gratuit', true),
  puces: A('Puces', 'oreilles', ['metal'], ['or'], 'commun', 'gratuit', true),
  anneaux: A('Anneaux', 'oreilles', ['metal'], ['or'], 'commun', 'gratuit', true),
  pendantsEtoile: A('Pendants étoile', 'oreilles', ['metal'], ['argent'], 'rare', 'boutique', true),
  foulard: A('Foulard', 'cou', ['tissu'], ['soleil'], 'commun', 'gratuit', true),
  echarpe: A('Écharpe rayée', 'cou', ['tissu', 'tissu'], ['rouge', 'creme'], 'commun', 'boutique', true),
  perles: A('Collier de perles', 'cou', ['metal'], ['argent'], 'rare', 'coffre', true),
  coquillage: A('Pendentif coquillage', 'cou', ['metal'], ['or'], 'commun', 'gratuit', true),
  papillon: A('Nœud papillon', 'cou', ['tissu'], ['rouge'], 'commun', 'boutique', true),
  sacDos: A('Sac à dos', 'dos', ['tissu'], ['abricot'], 'commun', 'gratuit', false),
  besace: A('Besace', 'dos', ['tissu'], ['caramel'], 'commun', 'gratuit', false),
  cape: A('Cape', 'dos', ['tissu'], ['bordeaux'], 'rare', 'boutique', false),
  ailes: A('Ailes en tissu', 'dos', ['tissu'], ['lavande'], 'epique', 'coffre', false),
  peluche: A('Peluche', 'main', ['tissu'], ['caramel'], 'rare', 'boutique', false),
  panier: A('Panier fleuri', 'main', ['tissu'], ['rose'], 'commun', 'boutique', false),
  ombrelle: A('Ombrelle', 'main', ['tissu'], ['rosepale'], 'epique', 'coffre', false),
  // les tenues de saison (la mer les prend : elles servent sur l'île, une fois la saison venue)
  manteau: A('Manteau d\'hiver', 'dessus', ['tissu', 'tissu'], ['marine', 'creme'], 'commun', 'gratuit', false, 'hiver'),
  cire: A('Ciré', 'dessus', ['tissu'], ['soleil'], 'commun', 'gratuit', false, 'pluie'),
  bottesPluie: A('Bottes de pluie', 'pieds', ['tissu'], ['rouge'], 'commun', 'gratuit', false, 'pluie'),
  bottesFourrees: A('Bottes fourrées', 'pieds', ['tissu', 'tissu'], ['caramel', 'creme'], 'commun', 'gratuit', false, 'hiver'),
  moufles: A('Moufles', 'mains', ['tissu', 'tissu'], ['rouge', 'creme'], 'commun', 'gratuit', false, 'hiver')
};

// ---- les choix ----
// Ce qu'on choisit, et dans quoi : un nuancier, des formes ; accessoires : { emplacement: { id, couleurs: [clé, …] } }
const CHOIX = {
  taille: 'formes', silhouette: 'formes', peau: 'peau', visage: 'formes', yeux: 'yeux', formeYeux: 'formes', cils: 'formes',
  sourcils: 'formes', bouche: 'formes', levres: 'levres', rousseur: 'formes', joues: 'formes', grain: 'formes',
  coupe: 'formes', cheveux: 'cheveux', meches: 'formes', couleurMeches: 'cheveux', haut: 'formes', couleurHaut: 'tissus',
  bas: 'formes', couleurBas: 'tissus', chaussures: 'tissus'
};
const DEFAUT = {
  taille: 'moyenne', silhouette: 'moyenne', peau: 'peche', visage: 'rond', yeux: 'brun', formeYeux: 'ronds', cils: 'sans', sourcils: 'fins',
  bouche: 'douce', levres: 'naturelles', rousseur: 'non', joues: 'roses', grain: 'non', coupe: 'courte', cheveux: 'brun', meches: 'sans',
  couleurMeches: 'blond', haut: 'tshirt', couleurHaut: 'corail', bas: 'pantalon', couleurBas: 'jean', chaussures: 'cuir', accessoires: {}
};
// Les nuanciers d'une zone de couleur : les tissus et les cheveux acceptent aussi les teintures rares
const accepte = (nom, cle) => (NUANCIERS[nom] && cle in NUANCIERS[nom]) || ((nom === 'tissus' || nom === 'cheveux') && cle in NUANCIERS.teintures);
const couleur = (nom, cle) => (NUANCIERS[nom] && NUANCIERS[nom][cle]) || NUANCIERS.teintures[cle];
const libelle = (cle, valeur) => {
  const nom = CHOIX[cle];
  if (nom === 'formes') return FORMES[cle][valeur];
  return (NOMS_NUANCIERS[nom] && NOMS_NUANCIERS[nom][valeur]) || NOMS_NUANCIERS.teintures[valeur];
};

// Un choix inconnu est une erreur (jamais un dessin silencieusement faux). Rend les choix complets, accessoires compris.
function verifier(choix = {}) {
  const o = { ...DEFAUT, ...choix, accessoires: { ...(choix.accessoires || {}) } };
  for (const [k, v] of Object.entries(o)) {
    if (k === 'accessoires') continue;
    const nom = CHOIX[k];
    if (!nom) throw new Error(`choix inconnu : ${k}`);
    if (nom === 'formes' ? !(v in FORMES[k]) : !accepte(nom, v)) throw new Error(`choix inconnu : ${k} = ${v}`);
  }
  for (const [place, a] of Object.entries(o.accessoires)) {
    if (!a) { delete o.accessoires[place]; continue; }
    const def = ACCESSOIRES[a.id];
    if (!def) throw new Error(`accessoire inconnu : ${a.id}`);
    if (def.emplacement !== place) throw new Error(`accessoire ${a.id} : il se porte en « ${def.emplacement} », pas en « ${place} »`);
    const cs = a.couleurs || def.defaut;
    if (cs.length !== def.zones.length) throw new Error(`accessoire ${a.id} : ${def.zones.length} couleur(s) attendue(s)`);
    cs.forEach((cle, i) => { if (!accepte(def.zones[i] === 'metal' ? 'metaux' : 'tissus', cle)) throw new Error(`accessoire ${a.id} : couleur inconnue ${cle}`); });
    o.accessoires[place] = { id: a.id, couleurs: cs };
  }
  return o;
}
// Les couleurs d'un accessoire porté, en hexadécimal
const couleursAccessoire = a => a.couleurs.map((cle, i) => couleur(ACCESSOIRES[a.id].zones[i] === 'metal' ? 'metaux' : 'tissus', cle));
// Le naufragé ne garde que ce que la mer laisse
const naufrageChoix = o => ({ ...o, accessoires: Object.fromEntries(Object.entries(o.accessoires || {}).filter(([, a]) => a && ACCESSOIRES[a.id].garde)) });

// ---- au hasard ----
// Un tirage harmonieux à partir d'une graine (le bouton « Au hasard », et plus tard les visiteurs) : cheveux naturels le
// plus souvent, un haut et un bas qui ne se confondent pas, deux accessoires au plus. gratuit : seulement ce qui est
// libre à la création (pas d'accessoire ni de teinture à gagner).
function graine(n) {
  let a = n >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function auHasard(n, { gratuit = true } = {}) {
  const r = graine(n);
  const un = list => list[Math.floor(r() * list.length) % list.length];
  const cles = obj => Object.keys(obj);
  const naturels = CHEVEUX.slice(0, 14).map(([k]) => k), fantaisie = CHEVEUX.slice(14).map(([k]) => k);
  const tissus = cles(NUANCIERS.tissus);
  const haut = un(cles(FORMES.haut)), couleurHaut = un(tissus);
  // le bas : assez loin du haut en clarté ou en teinte, pour que la tenue se lise
  const loin = c => { const [h1, , l1] = hsl(NUANCIERS.tissus[couleurHaut]), [h2, , l2] = hsl(NUANCIERS.tissus[c]); return Math.abs(l1 - l2) > 0.18 || Math.min(Math.abs(h1 - h2), 360 - Math.abs(h1 - h2)) > 50; };
  const bas = un(cles(FORMES.bas)), couleurBas = un(tissus.filter(loin));
  const o = {
    taille: un(cles(FORMES.taille)), silhouette: un(cles(FORMES.silhouette)), peau: un(cles(NUANCIERS.peau)), visage: un(cles(FORMES.visage)),
    yeux: un(cles(NUANCIERS.yeux)), formeYeux: un(cles(FORMES.formeYeux)), cils: un(cles(FORMES.cils)), sourcils: un(cles(FORMES.sourcils)),
    bouche: un(cles(FORMES.bouche)), levres: r() < 0.3 ? un(cles(NUANCIERS.levres).slice(1)) : 'naturelles',
    rousseur: r() < 0.25 ? un(['legere', 'oui']) : 'non', joues: un(cles(FORMES.joues)), grain: r() < 0.15 ? un(['joue', 'levre']) : 'non',
    coupe: un(cles(FORMES.coupe)), cheveux: r() < 0.8 ? un(naturels) : un(fantaisie), meches: r() < 0.2 ? un(['pointes', 'meches']) : 'sans',
    couleurMeches: un(cles(NUANCIERS.cheveux)), haut, couleurHaut, bas, couleurBas, chaussures: un(['cuir', 'caramel', 'noir', 'blanc', 'creme', 'rouge', 'jean', 'rose']),
    accessoires: {}
  };
  const permis = Object.entries(ACCESSOIRES).filter(([, a]) => !a.saison && (!gratuit || a.source === 'gratuit'));
  const nb = Math.floor(r() * 3);
  for (let i = 0; i < nb; i++) {
    const [id, a] = un(permis);
    if (o.accessoires[a.emplacement]) continue;
    o.accessoires[a.emplacement] = { id, couleurs: a.zones.map(z => (z === 'metal' ? un(cles(NUANCIERS.metaux)) : un(tissus))) };
  }
  return verifier(o);
}

module.exports = {
  NUANCIERS, NOMS_NUANCIERS, TEINTURES_GAINS, FORMES, EMPLACEMENTS, ACCESSOIRES, CHOIX, DEFAUT,
  verifier, libelle, couleur, couleursAccessoire, naufrageChoix, auHasard, graine,
  hsl, hex, mix, tone, delave, clarte
};
