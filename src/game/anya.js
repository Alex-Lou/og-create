// Anya, la déesse de l'île (HISTOIRE.md, § 4.5, § 6.14, § 8 et § 10, v6) : les pressentiments, les traces, la Révélation
// et l'errance. Tout se déduit du serveur (vue de l'île : anya { traces, awake, revealed, visit, breathed }) ;
// l'appareil ne retient que les traces déjà montrées (oc_traces).

// Huit traces, une par quartier du cœur libéré après La Source, dans l'ordre (§ 6.14) : la huitième précède la Révélation
export const TRACES = [
  'Les pierres sont tièdes, comme une main.',
  'Les herbes s’inclinent toutes du même côté. Il n’y a pas de vent.',
  'Une plume d’or, bien trop grande pour un oiseau.',
  'Une empreinte de cerf, faite de lumière.',
  'Une fleur a poussé pendant la nuit, là où tu dormais.',
  'Les lucioles dessinent un visage, puis s’éparpillent.',
  'Le vent chante deux syllabes : « A… nya ».',
  'Sous tes pieds, un battement : un cœur qui s’éveille.'
];
export const TRACE_COUNT = TRACES.length;

// Les traces, en numéros (1 … n). Avant la v6, le serveur et l'appareil les nommaient par terre explorée : elles
// comptent alors une à une, sans aller jusqu'à la huitième, celle de la Révélation (comme au serveur)
function numbered(list) {
  const numbers = (list || []).filter(id => Number.isInteger(id) && id >= 1 && id <= TRACE_COUNT);
  const lands = new Set((list || []).filter(id => typeof id === 'string')).size;
  const before = Array.from({ length: Math.min(lands, TRACE_COUNT - 1) }, (_, i) => i + 1);
  return [...new Set([...before, ...numbers])].sort((a, b) => a - b);
}
export const tracesOf = anya => numbered(anya && anya.traces);
// Les traces déjà montrées sur cet appareil (oc_traces), en numéros
export const seenOf = saved => numbered(Array.isArray(saved) ? saved : []);

// La trace à montrer : la plus récente pas encore vue sur cet appareil (les plus anciennes, trouvées avant, se lisent
// dans la Chronique)
export function traceDue(traces, seen) {
  const shown = new Set(seenOf(seen));
  const fresh = numbered(traces).filter(n => !shown.has(n));
  return fresh.length ? fresh[fresh.length - 1] : null;
}
export const traceFrames = (n, count) => [{ art: 'trace', caption: `Traces d’Anya : ${count} / ${TRACE_COUNT}`, text: TRACES[Number(n) - 1] }];

// La scène d'Anya à jouer sur l'île : la trace d'un quartier tout juste libéré (la huitième passe avant la Révélation),
// puis la Révélation, une seule fois ; sinon null. anya : { traces, awake, revealed } (serveur) ; seen : traces vues ici
export function anyaSceneOf(anya, seen) {
  if (!anya) return null;
  const trace = traceDue(anya.traces, seen);
  if (trace) return `trace-${trace}`;
  return anya.awake && !anya.revealed ? 'revelation' : null;
}

// Les pressentiments (§ 10) : la voix quand la Vie s'écrit (acte I), la rune de Galet au Cercle de menhirs (acte III),
// les bêtes qui se tournent vers la Lande (acte IV) ; le quatrième, l'aveu de Brume, est dans game/opus.js
export const PRESENTIMENTS = {
  vie: [
    { id: 'anya-vie-voix', who: 'Une voix', text: '« … Merci. »' },
    { id: 'anya-vie-brume', text: 'Tu l’as entendue ? Une voix, quand tu as écrit la Vie… Elle venait de l’île elle-même. Écoute bien : elle reviendra.' }
  ],
  rune: [
    { id: 'anya-rune-galet', who: 'Galet', face: 'carriere', text: '(Il ôte son bonnet.) Ici dort Celle-qui-donne-souffle. Ne l’éveillez qu’ensemble.' },
    { id: 'anya-rune-sylve', who: 'Sylve', face: 'bosquet', text: '(Tout bas.) Elle. La Dame. Les bêtes savent.' }
  ],
  betes: [
    { id: 'anya-betes', text: 'Tu as vu ? Toutes les bêtes ont tourné la tête vers la Lande aux Menhirs. Puis plus rien.' }
  ]
};

// La Révélation (§ 6.14) : une seule fois ; sa dernière réplique dépend du Phare (lit : allumé)
export function revelationFrames({ lit = false } = {}) {
  const said = (who, text) => ({ art: 'anya', who, text });
  return [
    { art: 'cercle', caption: 'La Révélation', text: 'À l’aube, Brume appelle toute la troupe au Cercle de menhirs.' },
    { art: 'cercle-sceaux', caption: 'La Révélation', text: 'Chaque maître se place devant sa pierre. Les sept sigles s’allument, un à un.' },
    { art: 'anya', caption: 'La Révélation', text: 'Le centre du cercle fleurit. Les bêtes arrivent de partout et se couchent. Anya se lève.' },
    said('Anya', 'Vous m’avez écrite bien avant de me voir. Air, Eau, Feu, Terre… Vous êtes la Vie que j’attendais.'),
    said('Anya', 'Ma petite flamme. Tu as veillé seule si longtemps.'),
    said('Brume', '… Tu es revenue.'),
    said('Anya', 'Galet. Pâquerette.'),
    said('Galet', '(Écarlate.) Hm !'),
    said('Anya', 'Sylve. Ta forêt brûlée n’est pas perdue. Elle pousse ici.'),
    said('Anya', 'Cannelle. Merci pour la soupe. Chaque soir.'),
    said('Anya', 'Toi qui lis. Continue d’écrire. Tant qu’on écrit la vie, je ne dors pas.'),
    { art: 'gemme', caption: 'La Révélation', text: 'Elle souffle sur le Grimoire : la gemme de la couverture s’allume, pour toujours.' },
    said('Anya', lit ? 'Ta lumière guide la mer. La mienne gardera la terre.' : 'Allume ton phare, petite flamme. Je veillerai sur la terre.')
  ];
}

// Anya sur l'île, après la Révélation (v6 : elle erre) : le jour de son passage, autour du lever (slot 'aube') ou du
// coucher du soleil ('crepuscule'). Sans moment donné, l'un ou l'autre
const NEAR_SUN = 1.2;
export const anyaHere = (hour, rise, set, slot = null) =>
  (slot !== 'crepuscule' && Math.abs(hour - rise) < NEAR_SUN) || (slot !== 'aube' && Math.abs(hour - set) < NEAR_SUN);
export const BREATH_LINE = 'Ce que la terre sait, je te le souffle.';
