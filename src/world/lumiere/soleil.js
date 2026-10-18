// Où est le soleil à l'écran : une seule convention pour toute la lumière de l'île (choix de l'auteur, 18 oct.). La lune
// se lève au nord-ouest, en haut à gauche (ombres.js : PLACE_LUNE) : le haut de l'écran est le nord. Le soleil se lève à
// l'est (à droite), passe au sud à midi (vers nous, en bas) et se couche à l'ouest (à gauche). Les ombres, l'heure dorée
// et son liseré, la lueur du soleil bas, son chemin sur la mer et les éclats qu'il y pose, les rayons : tous la lisent ici.
// sun : celui du ciel (sky.js : skyAt), sur l'horloge de l'île ou celle du tutoriel. Le relief du terrain et le modelé des
// dessins, eux, gardent leur lumière fixe en haut à gauche (terrain.js, iso.js) ; l'horloge du HUD se lit de gauche à
// droite (IslandClock.vue)

// est : de 1 au lever (à droite) à -1 au coucher (à gauche) ; sud : 0 à l'horizon, 1 à midi (vers nous) ; cote : 1 le
// matin (le soleil à droite), -1 l'après-midi (à gauche)
export function soleilOf(sun) {
  const p = sun.progress;
  return { est: Math.cos(Math.PI * p), sud: Math.sin(Math.PI * p), cote: p < 0.5 ? 1 : -1 };
}
