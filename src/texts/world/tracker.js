// Le suivi des quêtes (world/tracker.js ; Hud/QuestTracker) : les lignes « à faire aussi », ce qui attend le joueur
// ailleurs sur l'île (name : le nom d'un bâtiment, d'un habitant, d'un voyageur, d'une bête ou d'une création). Les
// paires [un, plusieurs] suivent un nombre (« 2 coffres à ouvrir »).

export const TODO = {
  // (le bâtiment en panne, quand on ne trouve pas son nom)
  someSite: 'un bâtiment',
  repair: name => `Répare ${name}`,
  hungry: name => `${name} a faim`,
  needs: name => `${name} a besoin de toi`,
  visitorReady: name => `${name} attend sa demande`,
  visitorSettles: name => `${name} peut s’installer`,
  beastsHungry: ['bête a faim', 'bêtes ont faim'],
  gifts: 'Tes bêtes ont quelque chose pour toi',
  chests: ['coffre à ouvrir', 'coffres à ouvrir'],
  grow: name => `${name} peut grandir`,
  place: name => `Pose : ${name}`,
  landmarks: ['lieu à découvrir', 'lieux à découvrir'],
  deposits: ['gisement prêt', 'gisements prêts']
};
