// Lot H4 (HISTOIRE.md, § 9 et § 16) : le tutoriel ne commence que pour un invité tout neuf, suit le jeu (pages
// écrites, compte, nom) et reprend toujours l'étape imposée par le serveur ; ses répliques tiennent en une bulle (§ 7.4).
import { describe, it, expect } from 'vitest';
import { prologueStep, islandStep, loadPrologue, scenesBefore, inPrologue, resumedPrologue, islandTaught, upTo, bareGrimoire, sceneDelayOf, VEILLEE, torchSpotsOf } from '@/game/prologue';
import { SCENES, LINES } from '@/texts/tutorial/scenes';
import { sceneOf } from '@/game/sceneArt';

const BASE = ['Eau', 'Feu', 'Terre', 'Air'];
const state = (over = {}) => ({ ...loadPrologue(), ...over });
const step = (over, loggedIn = false, elements = BASE) => prologueStep({ state: state(over), loggedIn, elements });

describe('le tutoriel', () => {
  it('ne commence que pour un invité qui n’a que les quatre Souffles', () => {
    expect(step({})).toEqual({ phase: 'start' });
    expect(step({}, true)).toBe(null);
    expect(step({}, false, [...BASE, 'Vent'])).toBe(null);
    expect(step({ skipped: true })).toBe(null);
  });
  it('étapes 1 à 3 : seul sur la plage de Brumelune, la carte d’embarquement (l’avatar), puis Brume et l’arrivée', () => {
    expect(step({ started: true })).toEqual({ phase: 'scene', scene: 'naufrage' });
    expect(step({ started: true, seen: ['naufrage'] })).toEqual({ phase: 'avatar' });
    expect(step({ started: true, seen: ['naufrage'], look: 'avatar-03' })).toEqual({ phase: 'scene', scene: 'arrivee' });
    // Un appareil qui a vu l'arrivée d'avant ne revient pas en arrière (ni naufrage ni carte)
    expect(step({ started: true, seen: ['arrivee'] })).toEqual({ phase: 'account' });
  });
  it('le livre d’abord : le compte s’ouvre en coulisse, le nom part, le Vent s’écrit au Grimoire nu, puis l’île', () => {
    const seen = ['naufrage', 'arrivee'];
    const open = { started: true, seen, registered: true, provisional: true };
    expect(step({ started: true, seen })).toEqual({ phase: 'account' });
    expect(step(open, true)).toEqual({ phase: 'name', account: false });
    expect(step({ ...open, named: true }, true)).toEqual({ phase: 'vent' });
    // Une autre page que Vent d'abord : la page du Vent, toujours (la première quête de Brume)
    expect(step({ ...open, named: true }, true, [...BASE, 'Boue'])).toEqual({ phase: 'vent' });
    // Le Grimoire nu : l'Air seul sur l'étagère jusqu'au Vent ; tout ensuite, jusqu'à la page du Brasier ; puis rien de nu
    expect(bareGrimoire({ state: { ...open, named: true }, loggedIn: true, elements: BASE })).toEqual({ shelf: ['Air'] });
    expect(bareGrimoire({ state: { ...open, named: true }, loggedIn: true, elements: [...BASE, 'Vent'] })).toEqual({ shelf: null });
    // (nu jusqu'à la page du Brasier : la page de garde, « Quel jour ? », le cercle ; le compte en coulisse avant le Vent)
    expect(bareGrimoire({ state: open, loggedIn: false, elements: BASE })).toEqual({ shelf: ['Air'] });
    expect(bareGrimoire({ state: { ...open, named: true, seen: [...seen, 'souffle'] }, loggedIn: true, elements: [...BASE, 'Vent'] })).toEqual({ shelf: null });
    expect(bareGrimoire({ state: { ...open, named: true, signed: true, seen: [...seen, 'souffle'] }, loggedIn: true, elements: [...BASE, 'Vent'] })).toEqual({ shelf: null });
    expect(bareGrimoire({ state: { ...open, named: true, signed: true, seen: [...seen, 'souffle', 'jour'] }, loggedIn: true, elements: [...BASE, 'Vent'] })).toEqual({ shelf: null });
    expect(bareGrimoire({ state: { ...open, named: true, signed: true, seen: [...seen, 'souffle', 'jour', 'cercle'] }, loggedIn: true, elements: [...BASE, 'Vent'] })).toBeNull();
    expect(bareGrimoire({ state: { ...open, named: true, signed: true, seen: [...seen, 'souffle', 'jour', 'cercle', 'epave'] }, loggedIn: true, elements: [...BASE, 'Vent', 'Brasier'] })).toBeNull();
    // (une scène attend seulement après une création, le temps de lire son inscription)
    expect(['naufrage', 'arrivee', 'jour', 'cercle'].map(sceneDelayOf)).toEqual([0, 0, 0, 0]);
    expect(['souffle', 'epave'].map(sceneDelayOf)).toEqual([2500, 2500]);
    // Le vent levé : la scène, puis la page de garde signe le compte, puis « Quel jour ? », le cercle de flammes, le
    // Brasier dans la même visite (choix de l'auteur, 11 et 14 oct.), l'épave, puis la plage
    const vent = [...BASE, 'Vent'];
    expect(step({ ...open, named: true }, true, vent)).toEqual({ phase: 'scene', scene: 'souffle' });
    expect(step({ ...open, named: true, seen: [...seen, 'souffle'] }, true, vent)).toEqual({ phase: 'sign' });
    const signed = { ...open, named: true, signed: true };
    expect(step({ ...signed, seen: [...seen, 'souffle'] }, true, vent)).toEqual({ phase: 'scene', scene: 'jour' });
    expect(step({ ...signed, seen: [...seen, 'souffle', 'jour'] }, true, vent)).toEqual({ phase: 'scene', scene: 'cercle' });
    expect(step({ ...signed, seen: [...seen, 'souffle', 'jour', 'cercle'] }, true, vent)).toEqual({ phase: 'brasier' });
    expect(step({ ...signed, seen: [...seen, 'souffle', 'jour', 'cercle'] }, true, [...vent, 'Brasier'])).toEqual({ phase: 'scene', scene: 'epave' });
    expect(step({ ...signed, seen: [...seen, 'souffle', 'jour', 'cercle', 'epave'] }, true, [...vent, 'Brasier'])).toEqual({ phase: 'greve' });
    // (un tutoriel commencé avant le cercle, le Brasier déjà écrit : la plage, sans l'épave)
    expect(step({ ...signed, seen: [...seen, 'souffle'] }, true, [...vent, 'Brasier'])).toEqual({ phase: 'greve' });
    // (un joueur déjà passé sur l'île, son feu à bâtir : son chantier le mène au Grimoire, pas le prologue)
    expect(prologueStep({ state: state({ ...open, named: true, signed: true, seen: [...seen, 'souffle'] }), loggedIn: true, elements: vent, quest: 'feu' })).toEqual({ phase: 'greve' });
  });
  it('sans compte possible : l’ancien chemin (une seule page avant l’île, Vent, puis la page de garde crée le compte)', () => {
    const seen = ['naufrage', 'arrivee'];
    expect(step({ started: true, seen, noProvisional: true })).toEqual({ phase: 'vent' });
    expect(step({ started: true, seen, noProvisional: true }, false, [...BASE, 'Boue'])).toEqual({ phase: 'vent' });
    expect(step({ started: true, seen, noProvisional: true }, false, [...BASE, 'Vent'])).toEqual({ phase: 'scene', scene: 'souffle' });
    seen.push('souffle');
    expect(step({ started: true, seen, noProvisional: true }, false, [...BASE, 'Vent'])).toEqual({ phase: 'name', account: true });
  });
  it('un compte créé par l’ancienne page de garde (Vent déjà écrit) : son nom, puis la plage', () => {
    const vent = [...BASE, 'Vent'];
    const seen = ['arrivee', 'souffle'];
    expect(step({ started: true, seen, registered: true }, true, vent)).toEqual({ phase: 'name', account: false });
    expect(step({ started: true, seen, registered: true, named: true }, true, [...vent, 'Brasier'])).toEqual({ phase: 'greve' });
  });
  it('un compte ouvert autrement que par la page de garde arrête le tutoriel', () => {
    expect(step({ started: true, seen: ['arrivee'] }, true, [...BASE, 'Vent'])).toBe(null);
  });
  it('étapes 2 à 5 sur l’île : chaque quête du prologue a sa scène, ses répliques, puis Le Campement', () => {
    const ready = { started: true, registered: true, named: true, seen: ['arrivee', 'souffle'] };
    const island = (quest, seen = []) => islandStep({ state: state({ ...ready, seen: [...ready.seen, ...seen] }), quest });
    // Pas avant le nom, ni après « Passer »
    expect(islandStep({ state: state({ ...ready, named: false }), quest: { id: 'recolte' } })).toBe(null);
    expect(islandStep({ state: state({ ...ready, skipped: true }), quest: { id: 'recolte' } })).toBe(null);
    // Brume seule au début : ramassage, Brasier, feu, première nuit. Lorena arrive ensuite au matin.
    expect(island({ id: 'pages', done: true })).toEqual({ phase: 'lines', lines: ['claim'] });
    expect(island({ id: 'ramasser', done: false })).toEqual({ phase: 'lines', lines: ['epaves'] });
    // (seule la première récompense se réclame auprès de Brume ; les suivantes arrivent seules)
    expect(island({ id: 'ramasser', done: true })).toEqual({ phase: 'lines', lines: [] });
    expect(island({ id: 'feu', done: false })).toEqual({ phase: 'lines', lines: ['feu-pret'] });
    expect(island({ id: 'feu', done: false, plan: 'Brasier' })).toEqual({ phase: 'lines', lines: ['cendres'] });
    expect(island({ id: 'feu', done: true })).toEqual({ phase: 'lines', lines: ['flambe'] });
    // La première nuit : sa scène, puis on explore seul avant de dormir ; Lorena n'arrive qu'au matin
    expect(island({ id: 'nuit', done: false })).toEqual({ phase: 'scene', scene: 'nuit' });
    expect(island({ id: 'nuit', done: false }, ['nuit'])).toEqual({ phase: 'sleep' });
    // Le jour de Lorena (choix de l'auteur, 11 et 12 oct.) : elle nage, on la touche, sa scène, puis sa caisse
    // (Lorena nage au pied de son Ponton, un « ! » au-dessus : la toucher lance sa scène)
    expect(island({ id: 'caisse', done: false })).toEqual({ phase: 'lines', lines: [], lesson: 'aster-eau' });
    // (sa scène vue : un « ! » sur elle ; touchée, elle parle de sa caisse)
    expect(island({ id: 'caisse', done: false }, ['recolte'])).toEqual({ phase: 'lines', lines: [], lesson: 'aster-caisse' });
    expect(island({ id: 'caisse', done: false }, ['recolte', 'aster-caisse'])).toEqual({ phase: 'lines', lines: ['caisse'] });
    expect(island({ id: 'caisse', done: true }, ['recolte'])).toEqual({ phase: 'lines', lines: ['tresors', 'rend'] });
    // Sa longue-vue choisit son camp, puis sa Récolte
    expect(island({ id: 'recolte', done: false }, ['recolte'])).toEqual({ phase: 'lines', lines: [], lesson: 'longue-vue' });
    expect(island({ id: 'recolte', done: false }, ['recolte', 'longue-vue'])).toEqual({ phase: 'harvest', lines: ['rivage'] });
    expect(island({ id: 'recolte', done: true }, ['recolte', 'longue-vue'])).toEqual({ phase: 'lines', lines: ['chaine', 'bois-ponton'] });
    // Son Ponton, le chemin entre les deux camps, ses quatre piquets en travers du passage des égarés (Brume dit à quoi
    // ils servent ; déplacer attend le jour de Nathan)
    expect(island({ id: 'premier-ponton', done: false }, ['recolte'])).toEqual({ phase: 'lines', lines: ['ponton-bois'] });
    expect(island({ id: 'premier-ponton', done: true }, ['recolte'])).toEqual({ phase: 'lines', lines: ['ponton-tient', 'ponton-promesse', 'ponton-moyens'] });
    expect(island({ id: 'chemin-aster', done: false }, ['recolte'])).toEqual({ phase: 'lines', lines: ['chemin-camps', 'chemin-pieds'] });
    expect(island({ id: 'chemin-aster', done: true }, ['recolte'])).toEqual({ phase: 'lines', lines: ['voisins'] });
    expect(island({ id: 'clotures', done: false }, ['recolte'])).toEqual({ phase: 'lines', lines: ['joli-camp', 'egares-nuit', 'egares-nord', 'cloture-deux'] });
    expect(island({ id: 'clotures', done: true }, ['recolte'])).toEqual({ phase: 'lines', lines: ['chez-nous'] });
    // Le soir : un égaré bute sur la clôture (Brume le montre), puis autour du feu personne ne sait cuisiner ; la deuxième
    // nuit près de Brume
    // (les égarés et la clôture : la scène de la veillée, quand on touche Brume pour dormir ; VEILLEE)
    expect(island({ id: 'veille', done: false }, ['recolte'])).toEqual({ phase: 'sleep', lines: ['cuisiner', 'manger', 'debrouiller'], line: 'soir' });
    for (const line of VEILLEE) expect(LINES[line], line).toBeTruthy();
    expect(LINES['egare-la']).toMatchObject({ look: 'barrage', demo: 'egare' });
    const all = ['nuit', 'recolte', 'longue-vue', 'cannelle', 'rivet', 'ondin'];
    expect(island({ id: 'pages', done: true }, all)).toEqual({ phase: 'lines', lines: ['claim'] });
    expect(island({ id: 'soupe', done: false }, ['recolte'])).toEqual({ phase: 'scene', scene: 'cannelle' });
    // Le jour d’Agathe : on va vers elle (« ! »), on fait connaissance, ses coquillages et sa soupe, un fil d'histoire
    expect(island({ id: 'soupe', done: false }, all)).toEqual({ phase: 'lines', lines: [], lesson: 'cannelle-parle' });
    expect(island({ id: 'soupe', done: false }, [...all, 'cannelle-parle'])).toEqual({ phase: 'lines', lines: ['faim-aster', 'faim-cannelle', 'faim-bulle', 'bulle'] });
    expect(island({ id: 'soupe', done: true }, all)).toEqual({ phase: 'lines', lines: ['soupe', 'soupe-aster', 'bulles-reviennent', 'brume-avale', 'brume-retient'] });
    // La longue-vue de Lorena voit la cage (sa réplique y mène la caméra) ; ouverte, les poules s'échappent
    expect(island({ id: 'cage', done: false }, all)).toEqual({ phase: 'lines', lines: ['caquets-eau'], lesson: 'cage-vue' });
    expect(island({ id: 'cage', done: false }, [...all, 'cage-vue'])).toEqual({ phase: 'lines', lines: ['mes-filles', 'fine-bouche'] });
    expect(LINES['mes-filles']).toMatchObject({ look: 'cage' });
    expect(island({ id: 'cage', done: true }, [...all, 'cage-vue'])).toEqual({ phase: 'lines', lines: ['doucement'] });
    // Les attraper une à une, puis les nourrir (la Récolte rappelée s'il manque des vivres) ; leur poulailler ; le soir
    const caught = ['poule:poule-rousse', 'poule:poule-blanche', 'poule:poule-noire'];
    expect(island({ id: 'poules', done: false }, [...all, ...caught.slice(0, 2)])).toEqual({ phase: 'lines', lines: [], lesson: 'attraper' });
    expect(island({ id: 'poules', done: false }, [...all, ...caught])).toEqual({ phase: 'lines', lines: ['deux-vivres'] });
    expect(island({ id: 'poules', done: false, short: true }, [...all, ...caught])).toEqual({ phase: 'lines', lines: ['deux-vivres', 'recolte-nourrit'] });
    expect(island({ id: 'poules', done: true }, [...all, ...caught])).toEqual({ phase: 'lines', lines: [] });
    expect(island({ id: 'poulailler', done: false }, all)).toEqual({ phase: 'lines', lines: ['un-toit'] });
    expect(island({ id: 'poulailler', done: true }, all)).toEqual({ phase: 'lines', lines: ['un-coq', 'village', 'cage-bois', 'cage-agathe'] });
    // Son abri, puis son enclos (choix de l'auteur, 13 oct.)
    expect(island({ id: 'abri-cannelle', done: false }, all)).toEqual({ phase: 'lines', lines: ['marmite', 'se-plaint', 'entends'] });
    expect(island({ id: 'abri-cannelle', done: true }, all)).toEqual({ phase: 'lines', lines: ['toit-a-moi'] });
    expect(island({ id: 'enclos-cannelle', done: false }, all)).toEqual({ phase: 'lines', lines: ['cuisines', 'casseroles'] });
    expect(island({ id: 'enclos-cannelle', done: true }, all)).toEqual({ phase: 'lines', lines: ['en-ville'] });
    for (const line of ['marmite', 'se-plaint', 'toit-a-moi', 'cuisines', 'casseroles', 'en-ville']) expect(LINES[line], line).toBeTruthy();
    expect(island({ id: 'nuit-cannelle', done: false }, all)).toEqual({ phase: 'sleep', lines: ['a-table', 'trois-feu', 'chaise'], line: 'soir-trois' });
    // (Nathan sort de la brume, un « ! » au-dessus : le toucher lance sa scène)
    expect(island({ id: 'deco', done: false }, ['recolte', 'cannelle'])).toEqual({ phase: 'lines', lines: [], lesson: 'rivet-brume' });
    expect(island({ id: 'deco', done: false }, all)).toEqual({ phase: 'lines', lines: ['puzzle', 'or'] });
    // Ses trois torches, puis le soir à quatre (choix de l'auteur, 13 oct.)
    expect(island({ id: 'torches-rivet', done: false }, all)).toEqual({ phase: 'lines', lines: ['torches-idee'] });
    expect(island({ id: 'torches-rivet', done: true }, all)).toEqual({ phase: 'lines', lines: ['torches-tiennent'] });
    for (const line of ['torches-idee', 'torches-tiennent']) expect(LINES[line], line).toBeTruthy();
    // Le soir à quatre, la quatrième nuit (choix de l'auteur, 13 oct.)
    expect(island({ id: 'nuit-rivet', done: false }, all)).toEqual({ phase: 'sleep', lines: ['quatre-feu', 'souci'], line: 'soir-quatre' });
    for (const line of ['quatre-feu', 'souci', 'soir-quatre']) expect(LINES[line], line).toBeTruthy();
    // Le matin de Léo (choix de l'auteur, 14 oct.) : Lorena voit une planche sur la vague ; vue, on le réveille
    expect(island({ id: 'eveil-ondin', done: false }, all)).toEqual({ phase: 'lines', lines: ['planche-vue'], lesson: 'planche-vue' });
    expect(island({ id: 'eveil-ondin', done: false }, [...all, 'planche'])).toEqual({ phase: 'lines', lines: [] });
    expect(island({ id: 'eveil-ondin', done: true }, all)).toEqual({ phase: 'lines', lines: [] });
    expect(LINES['planche-dort']).toMatchObject({ who: 'ponton', look: 'planche' });
    expect(island({ id: 'souvenir-ondin', done: false }, ['recolte', 'cannelle', 'rivet'])).toEqual({ phase: 'scene', scene: 'ondin' });
    expect(island({ id: 'souvenir-ondin', done: false }, all)).toEqual({ phase: 'lines', lines: ['baguette', 'ruban'] });
    // (la Pluie écrite, la clé du Puits : elle tombe sur l'île tant que ses répliques se lisent, la baguette de Léo frémit)
    expect(island({ id: 'souvenir-ondin', done: true }, all).lines.slice(0, 2)).toEqual(['pluie-brume', 'pluie-ondin']);
    expect([LINES['pluie-brume'].demo, LINES['pluie-ondin'].demo]).toEqual(['averse', 'averse']);
    expect(LINES['planche-vue']).toBeTruthy();
    expect(island({ id: 'puits-ondin', done: true }, all)).toEqual({ phase: 'lines', lines: ['chut', 'produit'] });
    // Puis le premier chemin, du Puits au Feu (l'île neuve n'a que son sentier)
    expect(island({ id: 'chemin', done: false }, all)).toEqual({ phase: 'lines', lines: ['glisse', 'pierres'] });
    expect(island({ id: 'chemin', done: true }, all)).toEqual({ phase: 'lines', lines: ['sentier'] });
    // Le premier chemin réclamé : Le Campement clôt l'ancien prologue global.
    expect(island({ id: 'lisiere', done: false }, all)).toEqual({ phase: 'scene', scene: 'campement' });
    expect(island({ id: 'lisiere', done: false }, [...all, 'campement'])).toEqual({ phase: 'finish' });
    // Chaque réplique nommée existe
    for (const line of ['caisse', 'tresors', 'rend', 'installe', 'rivage', 'bois-ponton', 'ponton-bois', 'ponton-tient', 'ponton-promesse', 'ponton-moyens', 'chemin-camps', 'chemin-pieds', 'voisins', 'joli-camp', 'egares-nuit', 'egares-nord', 'egare-la', 'cloture-voyez', 'aster-dormir', 'cloture-deux', 'chez-nous', 'cuisiner', 'manger', 'debrouiller', 'soir', 'feu-pret']) expect(LINES[line], line).toBeTruthy();
    for (const line of ['claim', 'chaine', 'bulle', 'soupe', 'puzzle', 'or', 'souci', 'baguette', 'ruban', 'chut', 'produit', 'epaves', 'cendres', 'flambe']) expect(LINES[line], line).toBeTruthy();
    for (const line of ['faim-aster', 'faim-cannelle', 'faim-bulle', 'bulles-reviennent', 'brume-avale', 'brume-retient', 'caquets-eau', 'mes-filles', 'doucement', 'tout-le-monde', 'deux-vivres', 'recolte-nourrit', 'un-toit', 'un-coq', 'village', 'cage-bois', 'a-table', 'trois-feu', 'chaise', 'soir-trois']) expect(LINES[line], line).toBeTruthy();
    // La séquence de Brume ne simule aucun lever du jour : le joueur campe sur la plage jusqu'au matin de Lorena.
    expect([LINES.greve, LINES.epaves, LINES.cendres.text, ...SCENES.nuit.map(frame => frame.text || '')].join(' ')).toContain('Brumelune');
    expect([LINES.greve, LINES.cendres.text].join(' ')).not.toMatch(/jour se lève|nuit approche/i);
  });
  it('repris par le compte : les scènes des étapes passées comptent comme vues, celle de l’étape en cours se joue', () => {
    expect(inPrologue('feu')).toBe(true);
    expect(inPrologue('lisiere')).toBe(false);
    const before = ['naufrage', 'arrivee', 'souffle', 'jour', 'cercle', 'epave'];
    expect(scenesBefore('ramasser')).toEqual(before);
    expect(scenesBefore('feu')).toEqual(before);
    expect(scenesBefore('nuit')).toEqual(before);
    expect(scenesBefore('caisse')).toEqual([...before, 'nuit']);
    expect(scenesBefore('recolte')).toEqual([...before, 'nuit', 'recolte']);
    expect(scenesBefore('soupe')).toEqual([...before, 'nuit', 'recolte']);
    expect(scenesBefore('souvenir-ondin')).toEqual([...before, 'nuit', 'recolte', 'cannelle', 'rivet']);
    expect(scenesBefore('chemin')).toEqual([...before, 'nuit', 'recolte', 'cannelle', 'rivet', 'ondin']);
    expect(scenesBefore('lisiere')).toEqual([...before, 'nuit', 'recolte', 'cannelle', 'rivet', 'ondin']);
    // Un appareil qui n'a rien retenu, à l'étape de la soupe : la nuit et l'arrivée de Lorena comptent comme vues.
    const resumed = { started: true, registered: true, named: true, seen: scenesBefore('soupe') };
    expect(islandStep({ state: state(resumed), quest: { id: 'soupe', done: false } })).toEqual({ phase: 'scene', scene: 'cannelle' });
    // Un état local d'un autre compte ou d'une ancienne version ne peut pas annuler la reprise serveur.
    const stale = resumedPrologue(state({ skipped: true, finished: true, seen: [] }), 'feu');
    expect(stale).toMatchObject({ started: true, skipped: false, registered: true, named: true, finished: false });
    expect(islandStep({ state: stale, quest: { id: 'feu', done: false, plan: 'Brasier' } })).toEqual({ phase: 'lines', lines: ['cendres'] });
  });
  it('les commandes de l’île pendant le tutoriel : grisées tant qu’aucune leçon ne les a montrées', () => {
    // Hors du tutoriel (passé, fini, ou quête d'un acte) : tout répond
    expect(islandTaught({ tutorial: false, quest: 'feu' })).toBeNull();
    expect(islandTaught({ tutorial: true, quest: 'lisiere' })).toBeNull();
    // Brume seule, puis la nuit : ni la Récolte ni le tracé
    expect(islandTaught({ tutorial: true, quest: 'pages' })).toEqual({ harvest: false, road: false });
    expect(islandTaught({ tutorial: true, quest: 'nuit' })).toEqual({ harvest: false, road: false });
    // La Récolte avec Lorena, et ensuite ; le tracé avec le chemin entre son camp et le nôtre, et ensuite
    expect(islandTaught({ tutorial: true, quest: 'recolte' })).toEqual({ harvest: true, road: false });
    expect(islandTaught({ tutorial: true, quest: 'premier-ponton' })).toEqual({ harvest: true, road: false });
    expect(islandTaught({ tutorial: true, quest: 'chemin-aster' })).toEqual({ harvest: true, road: true });
    expect(islandTaught({ tutorial: true, quest: 'chemin' })).toEqual({ harvest: true, road: true });
    expect([upTo('recolte', 'recolte'), upTo('soupe', 'recolte'), upTo('lisiere', 'recolte')]).toEqual([true, false, false]);
  });
  it('chaque réplique tient en une bulle et ne cite ni un ancien prénom ni le Livre', () => {
    const texts = [...Object.values(SCENES).flat().filter(frame => frame.text || frame.caption).map(frame => frame.text || frame.caption), ...Object.values(LINES).map(line => line.text || line)];
    for (const text of texts) {
      expect(text.length, text).toBeLessThanOrEqual(140);
      expect(text).not.toMatch(/Paulette|Marine|Ferdinand|Anatole|Léonie|Gaspard|\bRose\b|\bLivre\b|Codex/);
    }
    // Chaque image a un dessin connu : une scène de la bibliothèque, ou le sceau de PrologueArt
    for (const frame of Object.values(SCENES).flat()) expect(frame.scene ? sceneOf(frame.scene) : frame.art === 'seal', frame.scene || frame.art).toBeTruthy();
  });
});

describe('les torches de Nathan (choix de l’auteur, 13 oct.)', () => {
  // Le Feu au palier I (2 × 2) : sa grande emprise, 3 × 3, en (98, 92)
  const foyer = { x: 99, y: 93, w: 2, h: 2 };
  const spots = [];
  for (let y = 84; y <= 100; y++) for (let x = 90; x <= 108; x++) spots.push({ x, y });
  it('une case par côté d’où venaient les égarés : le nord, l’ouest, l’est, à trois cases de la grande emprise du Feu', () => {
    expect(torchSpotsOf(foyer, spots)).toEqual([{ x: 99, y: 89 }, { x: 95, y: 93 }, { x: 103, y: 93 }]);
  });
  it('un côté déjà gardé (une torche à deux cases de sa place) ne se propose plus ; une case prise : la plus proche', () => {
    expect(torchSpotsOf(foyer, spots, [{ x: 100, y: 88 }])).toEqual([{ x: 95, y: 93 }, { x: 103, y: 93 }]);
    const busy = spots.filter(sp => !(sp.x === 95 && sp.y === 93));
    expect(torchSpotsOf(foyer, busy, [{ x: 99, y: 89 }, { x: 103, y: 93 }])).toHaveLength(1);
    expect(torchSpotsOf(foyer, spots, [{ x: 99, y: 89 }, { x: 95, y: 93 }, { x: 103, y: 93 }])).toEqual([]);
  });
});
