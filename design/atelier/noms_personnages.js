// Les noms rangés, le miroir et les vitesses des vivants et des personnages dans la bibliothèque (les règles de
// catalogue.js), sans rien demander à Node : les générateurs nomment, tournent et animent leurs dessins comme la
// bibliothèque.

// Chemin d'un SVG dans lib/ (vivants/… ou personnages/…) -> chemin rangé
function nomPersonnage(rel) {
  const parts = rel.split('/');
  const base = parts.pop().replace(/\.svg$/, '');
  const [top, a, b] = parts;
  const out = (dirs, name) => [...dirs, name + '.svg'].join('/');

  if (top === 'vivants' && a === 'cerf') {
    const m = base.match(/^cerf_(?:(avant|dos|face)_)?([a-z]+)(?:_(\d+))?$/);
    return out([top, 'cerf-blanc'], ['cerf-blanc', m[1] || 'profil', m[2], m[3]].filter(Boolean).join('_'));
  }

  if (top === 'personnages') {
    if (a === 'naufrages') {
      if (base.startsWith(b + '_naufrage_')) return out([top, a, b], `${b}-naufrage_${base.slice(b.length + 10)}`);
      throw new Error('naufragé inattendu : ' + rel);
    }
  }
  return rel;
}

// Le kit du grand format (design/personnages/troupe.js, Anya, le Passeur) dessine son trois quarts avant tourné vers
// le bas à gauche ; le petit format, les bêtes et le jeu (vue « se ») le tournent vers le bas à droite. La bibliothèque
// publie donc ces vues-là en miroir : « avant » veut dire « vers le bas à droite » partout.
const MIROIR_KIT = /^(personnages\/maitres\/[a-z]+|personnages\/naufrages\/[a-z]+|personnages\/avatar\/avatar-\d+(?:-naufrage)?|personnages\/visiteurs\/visiteur-\d+|personnages\/epilogue\/arrivant-\d+|vivants\/(anya|passeur))\/[a-z0-9-]+_avant_/;
function miroir(svg) {
  const m = svg.match(/^(<svg[^>]*viewBox="([^"]+)"[^>]*>)([\s\S]*)(<\/svg>\s*)$/);
  if (!m) throw new Error('SVG inattendu pour le miroir');
  const [x, , w] = m[2].trim().split(/[\s,]+/).map(Number);
  return `${m[1]}<g transform="translate(${2 * x + w} 0) scale(-1 1)">${m[3]}</g>${m[4]}`;
}

const ANYA_MS = { voile: 1400, eveil: 320, repos: 600, expr: 600, marche: 160, benediction: 360, creer: 500, parler: 300, souffler: 400, murmure: 420, apparaitre: 260, disparaitre: 260 };
// La vitesse d'une animation des vivants ou des personnages (id rangé, sans le numéro d'image), d'après sa pose
function vitessePersonnage(id, pose) {
  const [top, a] = id.split('/');
  if (top === 'vivants') {
    if (a === 'brume') return /expr/.test(id) ? 600 : 220;
    // le cerf de lune et Anya refondus (vivants_refonte.js) : la cadence de leurs animations (anya_anims.js, cerf_lune.js)
    if (a === 'cerf-blanc') return { debout: 420, marche: 120, couche: 520, salut: 420 }[pose];
    if (a === 'anya') return ANYA_MS[pose.replace(/\d+$/, '')];
    if (pose === 'marche') return 100;
    if (a === 'passeur') return pose === 'repos' || pose === 'expr' ? [700, 600, 700, 160] : pose === 'salut' ? 190 : [700, 900];
    return pose === 'repos' ? (a === 'anya' ? 1200 : [900, 160]) : [700, 900];
  }
  if (top === 'personnages') {
    if (/^(marche|lanterne|parapluie)$/.test(pose)) return 85; // 8 images : un cycle en 680 ms
    if (pose === 'repos') return [700, 600, 700, 160]; // il respire, puis un clignement
    if (pose === 'salut') return 160;
    if (pose === 'dort' || pose === 'couche') return 900;
    if (pose === 'expr') return [700, 600, 700, 160];
    if (pose === 'grelotter') return 140; // un frisson
    if (pose === 'lire') return [1400, 900];
    if (pose === 'ramasser') return [500, 800];
    return [700, 1100];
  }
  return undefined;
}

module.exports = { nomPersonnage, MIROIR_KIT, miroir, vitessePersonnage };
