// Anya, la déesse de l'île (game/anya.js) : les huit traces, les pressentiments, la Révélation et ce qu'elle dit en
// soufflant. Qui parle reste dans le code (les noms) : la clé dit qui.

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

// Les pressentiments (§ 10) : la voix quand la Vie s'écrit (acte I), la rune de Saturnin au Cercle de menhirs (acte III),
// les bêtes qui se tournent vers la Lande (acte IV) ; le quatrième, l'aveu de Brume, est dans texts/game/opus.js
export const PRESENTIMENT_LINES = {
  // (une voix sans nom, puis Brume)
  vieVoix: '« … Merci. »',
  vieBrume: 'Tu as entendu ?',
  vieBrumeRien: '… Non. Rien.',
  // (Saturnin, puis Freya)
  runeGalet: '(Il ôte son bonnet.) Ici dort Celle-qui-donne-souffle. Ne l’éveillez qu’ensemble.',
  runeSylve: '(Tout bas.) Elle. La Dame. Les bêtes savent.',
  // (Brume)
  betes: 'Tu as vu ? Toutes les bêtes ont tourné la tête vers la Lande aux Menhirs. Puis plus rien.'
};

// La Révélation (§ 6.14), image par image : le récit, puis les répliques (la clé dit qui parle et à qui) ; la dernière
// dépend du Phare (allumé ou non)
export const REVELATION = {
  aube: 'À l’aube, Brume appelle toute la troupe au Cercle de menhirs.',
  sceaux: 'Chaque maître se place devant sa pierre. Les sept sigles s’allument, un à un.',
  lever: 'Le centre du cercle fleurit. Les bêtes arrivent de partout et se couchent. Anya se lève.',
  anyaATous: 'Vous m’avez écrite bien avant de me voir. Air, Eau, Feu, Terre… Vous êtes la Vie que j’attendais.',
  anyaABrume: 'Ma petite flamme. Tu as veillé seule si longtemps.',
  brume: '… Tu es revenue.',
  anyaASaturnin: 'Saturnin. Petit Sat.',
  saturnin: '(Écarlate.) Hm !',
  anyaAFreya: 'Freya. Ta forêt brûlée n’est pas perdue. Elle pousse ici.',
  anyaAMarcelle: 'Marcelle. Merci pour la soupe. Chaque soir.',
  anyaAuLecteur: 'Toi qui lis. Continue d’écrire. Tant qu’on écrit la vie, je ne dors pas.',
  gemme: 'Elle souffle sur le Grimoire : la gemme de la couverture s’allume, pour toujours.',
  // (Anya, le Phare allumé, puis pas encore)
  phareAllume: 'Ta lumière guide la mer. La mienne gardera la terre.',
  phareEteint: 'Allume ton phare, petite flamme. Je veillerai sur la terre.'
};

// Anya sur l'île, quand elle souffle ce que la terre sait
export const BREATH_LINE = 'Ce que la terre sait, je te le souffle.';
