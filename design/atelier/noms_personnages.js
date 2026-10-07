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
    const m = base.match(/^cerf_(?:(avant|dos)_)?([a-z]+)(?:_(\d+))?$/);
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

// La vitesse d'une animation des vivants ou des personnages (id rangé, sans le numéro d'image), d'après sa pose
function vitessePersonnage(id, pose) {
  const [top, a] = id.split('/');
  if (top === 'vivants') {
    if (a === 'brume') return /expr/.test(id) ? 600 : 220;
    if (a === 'cerf-blanc') return pose === 'repos' ? [1800, 180] : 300;
    if (pose === 'marche') return a === 'anya' ? 260 : 200;
    return pose === 'repos' ? (a === 'anya' ? 1200 : [900, 160]) : [700, 900];
  }
  if (top === 'personnages') {
    if (/^(marche|lanterne|parapluie)$/.test(pose)) return 170;
    if (pose === 'repos') return [900, 160];
    if (pose === 'salut') return 260;
    if (pose === 'dort' || pose === 'couche') return 900;
    if (pose === 'expr') return 800;
    if (pose === 'grelotter') return 140; // un frisson
    if (pose === 'lire') return [1400, 900];
    if (pose === 'ramasser') return [500, 800];
    return [700, 1100];
  }
  return undefined;
}

module.exports = { nomPersonnage, MIROIR_KIT, miroir, vitessePersonnage };
