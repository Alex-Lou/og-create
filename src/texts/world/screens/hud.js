// Ce que les commandes posées sur l'île disent aux lecteurs d'écran (components/World/Hud : leurs aria-label qui sont
// des phrases) : les boutons de l'île (IslandButtons), l'horloge (IslandClock), la barre du haut (IslandHud), le suivi
// des quêtes (QuestTracker), les bandeaux du trait et des chemins (LineBar, RoadBar).

// Les boutons de l'île (IslandButtons) : ce qui attend dans les coffres, le carnet, les trouvailles ; la boussole ; le
// plein écran et le tracé des chemins
export const ISLAND_BUTTONS = {
  chests: n => `Coffres : ${n} à ouvrir`,
  landmarks: n => `Carnet d’explorateur : ${n} lieu${n > 1 ? 'x' : ''} à découvrir`,
  deposits: n => `Trouvailles : ${n} gisement${n > 1 ? 's' : ''} prêt${n > 1 ? 's' : ''}`,
  trip: left => `Expédition en route : retour dans ${left}`,
  compass: 'Boussole : envoyer une expédition',
  leaveFull: 'Quitter le plein écran',
  leaveRoad: 'Quitter le tracé des chemins',
  road: 'Tracer un chemin'
};

// L'horloge (IslandClock) : le jour (le compteur des jours vécus sur l'île), l'heure, le moment et le temps qu'il fait ;
// puis ce que fait un toucher (la journée défile, ou elle est rendue à l'heure)
export const CLOCK = {
  day: n => `Jour ${n}`,
  now: (time, moment, weather, day) => `Sur ton île${day ? `, jour ${day}` : ''} : ${time}, ${moment}${weather ? `, ${weather}` : ''}.`,
  warping: now => `${now} La journée défile ; toucher pour revenir à l’heure.`,
  still: now => `${now} Toucher pour voir la journée défiler.`
};

// « Tout ramasser », dans la barre du haut (IslandHud) : ce que tous les bâtiments ont produit
export const COLLECT_ALL = gains => `Tout ramasser : ${gains.map(g => `${g.n} ${g.label}`).join(', ')}`;

// Une quête faite : prendre sa récompense (QuestTracker)
export const CLAIM = label => `Prendre la récompense : ${label}`;

// Le bouton ↶ des bandeaux du trait et des chemins (LineBar, RoadBar)
export const UNDO_CELL = 'Retirer la dernière case';
