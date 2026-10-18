// L'écran de démarrage en papier néon (choix de l'auteur, 18 oct. : « néonifie le splash, dans tous ses aspects ») :
// les mêmes dessins (splash.js, splash_survie.js, splash_orage.js), passés dans la palette des cinématiques
// (neon_naufrage.js, neon_reveil.js). La nuit indigo et son horizon magenta, la mer sarcelle aux crêtes cyan, une lune
// blanc cyan, des nuages violets ; Anya, l'île, les maîtres et Brume ravivés sans changer de teinte (leurs visages et
// leurs habits restent les leurs, leurs ombres deviennent froides) ; l'orage aux éclairs vert acide, le démon en feu néon.
const { fond, affiche, brume, demon, fixe } = require('./splash');
const { fondSurvie, afficheSurvie, ileSurvie } = require('./splash_survie');
const { nuages, eclairs, aura, souffle } = require('./splash_orage');
const { anyaVeille } = require('./splash_anya');
const { ileVivante } = require('./splash_ile');
const { ravivee, recolore } = require('./neon_reveil');

// Le ciel, la mer, la lune, les nuages et la brume du fond : leur couleur d'avant → la couleur néon
const NUIT = {
  // le ciel, de l'indigo à l'horizon magenta ; la lueur d'aube devient une floraison magenta
  '#050C22': '#03021A', '#0F2246': '#12063E', '#2A4874': '#3E0E6E', '#5B789E': '#9A2082',
  '#FFC9A0': '#FF6AA0', '#E89A7A': '#FF3FA8',
  // la lune blanc cyan, son halo violet et cyan, l'aura d'Anya rose
  '#FFFDF2': '#FFFFFF', '#F7E7B0': '#E8FFFA', '#D9B060': '#5CF2E6', '#FFF0B6': '#B8FFF4', '#D2A458': '#7FE8E0',
  '#FFF2B8': '#E8FFFA', '#DCEBFF': '#C88AFF', '#B9E2F0': '#9A5AF0', '#F4F0E0': '#FFD0EC', '#D2E2F2': '#C88AFF',
  '#FFE9B0': '#FFB8D8', '#FFE0A0': '#FF8AC8', '#030814': '#03020A',
  // les étoiles, les rayons, les poussières de lumière
  '#FFF6DC': '#E8FFFA', '#FFF6D8': '#B8FFF4', '#FFF0C8': '#9AFFF0', '#FFF4C8': '#D4FF7A', '#DDF2FF': '#5CF2E6',
  // les nuages violets, la brume lilas
  '#C9DDF0': '#C88AFF', '#8FB0D2': '#6A2AB0', '#5E7FA8': '#2A0A50', '#DCEAF6': '#C8A8FF', '#C4D8EC': '#9A6AE0',
  // la mer, en couches de profondeur, et les îlots du lointain
  '#2E5878': '#0A4458', '#081A35': '#03141E', '#3E719A': '#136A7A', '#CFE6F2': '#5CF2E6', '#24405F': '#1E0A40', '#203A58': '#180838'
};
// (les mêmes, écrites en r,g,b dans les nappes de brume et le reflet de la lune sur la mer)
const NUIT_RGB = { '255,236,180': '255,120,200', '210,226,242': '160,120,230', '214,232,244': '170,130,240', '200,220,238': '150,110,220' };
const passe = (svg, carte, rgb) => svg.replace(/#[0-9A-Fa-f]{6}\b/g, c => carte[c.toUpperCase()] || c).replace(/\d{1,3},\d{1,3},\d{1,3}/g, c => rgb[c] || c);

// Le fond : Anya et l'île ravivées, mises à l'abri pendant que le reste passe dans la nuit néon
function enNuit(svg, ile = ileVivante) {
  // (et leurs versions figées : le fond de l'orage est figé avant de passer dans la nuit)
  const garde = [...new Set([anyaVeille(), ile()].flatMap(g => [g, fixe(g)]))];
  let s = svg;
  garde.forEach((g, i) => { s = s.split(g).join(`<!--garde${i}-->`); });
  s = passe(s, NUIT, NUIT_RGB);
  garde.forEach((g, i) => { s = s.split(`<!--garde${i}-->`).join(ravivee(g)); });
  return s;
}
const fondNeon = () => fixe(enNuit(fond()));
// (l'orage : le même fond et ses tentacules, déjà figé)
const tempeteNeon = () => enNuit(fondSurvie(), ileSurvie);
// L'affiche et les guerriers : la colonne de lumière du Grimoire et son sol lumineux passent du jaune au cyan et au
// magenta, les rayons derrière Brume au cyan pâle, le voile de la nuit sur les maîtres à l'indigo ; puis tout est ravivé
// (les maîtres gardent leurs couleurs)
const AFFICHE = {
  '#FFF6C8': '#E8FFFA', '#FFF0B0': '#9AFFF0', '#FFE8A0': '#5CF2E6', '#FFE69A': '#FF8AD0', '#FFC860': '#FF3FA8', '#FFE6A0': '#9AFFF0',
  '#DFF6FF': '#B8FFF4', '#D8ECFA': '#C88AFF', '#152A50': '#1E0A40', '#020817': '#03020A', '#CFEFFF': '#9AFFF0'
};
const afficheNeon = () => ravivee(passe(affiche(), AFFICHE, {}));
const guerriersNeon = () => ravivee(passe(afficheSurvie(), AFFICHE, {}));
const brumeNeon = () => ravivee(brume());
const demonNeon = () => recolore(demon());
// Le feu de l'orage (l'aura et le souffle du démon) et ses nuages : dans la palette néon complète
const auraNeon = () => recolore(aura());
const souffleNeon = () => recolore(souffle());
const nuagesNeon = () => recolore(nuages());
// Les éclairs : vert acide, comme ceux du naufrage (halo, trait, cœur blanc)
const ECLAIR = { '#8FB8FF': '#9AFF3A', '#B8D4FF': '#C8FF6A', '#DCEAFF': '#ECFFC0' };
const eclairsNeon = () => eclairs().replace(/#(8FB8FF|B8D4FF|DCEAFF)\b/g, c => ECLAIR[c]);

module.exports = { fondNeon, tempeteNeon, afficheNeon, guerriersNeon, brumeNeon, demonNeon, auraNeon, souffleNeon, nuagesNeon, eclairsNeon, NUIT };
