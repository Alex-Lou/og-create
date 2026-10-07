// Les noms rangés des bêtes et des égarés dans la bibliothèque (la règle de catalogue.js, renommer), sans rien demander à
// Node : le générateur des bêtes (generateur_betes.mjs) nomme ses dessins comme la bibliothèque, à la même vitesse.
const hyph = s => s.replace(/_/g, '-');
const SANS_SENS = new Set(['hibou', 'meduse', 'papillon_bleu', 'papillon_jaune', 'papillon_lune']);

// Chemin d'un SVG dans lib/ (animaux/… ou egares/…) -> chemin rangé ; null pour les autres rubriques
function nomBete(rel) {
  const parts = rel.split('/');
  const base = parts.pop().replace(/\.svg$/, '');
  const [top, a, b] = parts;
  const out = (dirs, name) => [...dirs, name + '.svg'].join('/');

  if (top === 'animaux') {
    const sujet = b;
    const rest = base.slice(sujet.length + 1);
    if (!base.startsWith(sujet + '_')) throw new Error('bête inattendue : ' + rel);
    const S = hyph(sujet);
    const m = rest.match(/^(?:(avant|dos)_)?([a-z]+?)(\d+)?$/);
    if (!m) throw new Error('bête inattendue : ' + rel);
    const [, vue, pose, n] = m;
    if (pose === 'image' && a === 'familiers') return out([top, a, S], n ? `${S}_${n}` : S);
    const v = vue || (SANS_SENS.has(sujet) || a === 'familiers' && sujet.startsWith('bocal') ? 'face' : 'profil');
    const p = pose === 'image' ? 'nage' : pose;
    return out([top, a, S], [S, v, p, n].filter(Boolean).join('_'));
  }

  // Les égarés (lot M) : egares/<sujet>/<sujet>_<vue>_<pose><n> -> <sujet>_<vue>_<pose>_<n>
  if (top === 'egares') {
    const m = base.match(/^([a-z-]+)_(avant|dos)_([a-z]+?)(\d+)?$/);
    if (!m || m[1] !== a) throw new Error('égaré inattendu : ' + rel);
    return out([top, a], [m[1], m[2], m[3], m[4]].filter(Boolean).join('_'));
  }
  return null;
}

// La vitesse d'une animation de bête ou d'égaré (id : son chemin rangé, sans le numéro d'image ; pose : son nom rangé)
function vitesseBete(id, pose) {
  const [top, a] = id.split('/');
  if (top === 'animaux') return pose === 'vol' ? 120 : pose === 'nage' && /mer|familiers/.test(a) ? 420 : 260;
  if (top === 'egares') return { marche: 240, fuite: 160, bouderie: [500, 700], luciole: [300, 200, 200, 1000], brume: [220, 220, 900] }[pose];
  return undefined;
}

module.exports = { nomBete, vitesseBete };
