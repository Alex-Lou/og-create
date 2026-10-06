// Anya, l'Âme de l'Île (HISTOIRE.md, § 4.5, § 6.14, § 8 et § 10) : les pressentiments, les traces et la Révélation.
// Tout se déduit du serveur (vue de l'île : anya { traces, awake, revealed, breathed }) ; l'appareil ne retient que les
// traces déjà montrées (oc_traces).

// Douze traces, une par terre nouvelle explorée (§ 6.14)
export const TRACES = {
  menhirs: 'Les pierres sont tièdes, comme une main.',
  roselieres: 'Tous les roseaux s’inclinent du même côté.',
  falaises: 'Une plume d’or, bien trop grande pour un oiseau.',
  bayou: 'Les lucioles dessinent un visage, puis s’éparpillent.',
  contreforts: 'Une empreinte de cerf, faite de lumière.',
  oasis: 'Une fleur a poussé dans le sable pendant la nuit.',
  neiges: 'Un cercle de fleurs ouvertes dans la neige.',
  dunes: 'Le vent chante deux syllabes : « A… nya ».',
  canopee: 'Tous les oiseaux se taisent ensemble, puis chantent.',
  cascade: 'Dans l’écume, une silhouette coiffée de branches.',
  coulees: 'La lave s’écarte autour d’une pousse verte.',
  cratere: 'Au fond, un battement : un cœur qui s’éveille.'
};
export const TRACE_COUNT = Object.keys(TRACES).length;

// La trace à montrer : la plus récente des terres explorées pas encore vues sur cet appareil (les plus anciennes,
// trouvées avant, se lisent dans la Chronique)
export function traceDue(traces, seen) {
  const fresh = (traces || []).filter(id => TRACES[id] && !(seen || []).includes(id));
  return fresh.length ? fresh[fresh.length - 1] : null;
}
export const traceFrames = (land, count) => [{ art: 'trace', caption: `Traces d’Anya : ${count} / ${TRACE_COUNT}`, text: TRACES[land] }];

// Les pressentiments (§ 10) : la voix quand la Vie s'écrit (acte I), la rune de Galet au Cercle de menhirs (acte III),
// les bêtes qui se tournent vers la Lande (acte IV) ; le quatrième, l'aveu de Brume, est dans game/opus.js
export const PRESENTIMENTS = {
  vie: [
    { id: 'anya-vie-voix', who: '…', text: '… merci.' },
    { id: 'anya-vie-brume', text: 'Tu as entendu ? … Non. Rien.' }
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

// Anya sur l'île, après la Révélation : au Cercle, à l'aube et au crépuscule (heures autour du lever et du coucher)
export const anyaHere = (hour, rise, set) => Math.abs(hour - rise) < 1.2 || Math.abs(hour - set) < 1.2;
export const BREATH_LINE = 'Ce que la terre sait, je te le souffle.';
