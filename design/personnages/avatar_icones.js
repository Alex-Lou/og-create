// Les icônes des objets du catalogue (la boutique, l'inventaire) : chaque objet seul, sans personnage, tracé par son
// dessin du générateur (avatar_accessoires.js) sur un mannequin invisible (l'avatar par défaut, de face), réduit dans
// un cadre de 32 × 32. Pas de dessin à part : une icône change avec l'objet.
// icone(id, couleurs) : le SVG de l'icône ; couleurs : en hexadécimal, celles de l'objet porté (par défaut, celles du
// catalogue).
const { limb, arm, poing } = require('./troupe');
const { avatar, ACCESSOIRES, couleursAccessoire } = require('./avatar');
const { DESSINS, PORTE } = require('./avatar_accessoires');

// Par objet : les couches dessinées, dans l'ordre (celles du générateur ; « manches » : les bras du mannequin, sans
// les mains ; « mains », « pieds » : la paire, sur le mannequin), et le carré qui contient le dessin [x, y, côté], dans
// le repère 48 × 64 du mannequin
const ICONES = {
  bonnet: { couches: ['tete'], carre: [9, -5.3, 30] },
  cacheOreilles: { couches: ['cheveux', 'tete'], carre: [8.1, 0.3, 31.9] },
  echarpe: { couches: ['cou'], carre: [13.4, 27.5, 21.1] },
  chale: { couches: ['derriere', 'surBras'], carre: [11.1, 26.4, 25.8] },
  pelerine: { couches: ['derriere', 'surBras'], carre: [11.2, 23.4, 25.6] },
  etole: { couches: ['derriere', 'surBras'], carre: [11.5, 22.2, 25.1] },
  manteau: { couches: ['derriere', 'dessus', 'manches'], carre: [10.4, 27.2, 27.2] },
  cire: { couches: ['derriere', 'dessus', 'manches'], carre: [10.4, 26.5, 27.2] },
  moufles: { couches: ['mains'], carre: [16, 35.7, 16] },
  bottesPluie: { couches: ['pieds'], carre: [16.2, 48.3, 15.7] },
  bottesFourrees: { couches: ['pieds'], carre: [15.4, 46.8, 17.2] }
};

// Le mannequin : l'avatar par défaut, qui porte l'objet (ses couleurs en hexadécimal) ; les manches et les mains
// changent comme sur un personnage (PORTE)
function mannequin(id, cols) {
  const place = ACCESSOIRES[id].emplacement, m = avatar({ haut: 'pull' }, { uid: `ic${id}` });
  Object.assign(m, { o: { ...m.o, accessoires: { [place]: { id } } }, acc: { [place]: cols } });
  if (PORTE[id]) Object.assign(m, PORTE[id](cols, m));
  return m;
}
function couche(m, id, nom, ctx, cols) {
  const [shL, shR] = m.shoulders, [hL, hR] = m.hands;
  if (nom === 'manches') return arm(m, shL, hL, null, '') + arm(m, shR, hR, null, '');
  // les moufles, côte à côte : le revers tricoté et la moufle, le pouce vers le milieu
  if (nom === 'mains') return [19.4, 28.6].map(x => limb([x, hL[1] - 2.5], [x, hL[1] - 0.9], m.armW, cols[1]) + poing(m, [x, hL[1]])).join('');
  if (nom === 'pieds') return m.legX.front.map(x => DESSINS[id].pieds(m, ctx, cols, [x, m.ground, 0, 0])).join('');
  const f = DESSINS[id][nom];
  return f ? f(m, { ...ctx, couche: nom }, cols) : '';
}

function icone(id, couleurs) {
  const a = ACCESSOIRES[id], I = ICONES[id];
  if (!a || !I) throw new Error(`icône inconnue : ${id}`);
  const cols = couleurs || couleursAccessoire({ id, couleurs: a.defaut });
  const m = mannequin(id, cols), ctx = { view: 'front', walk: false, n: 0 };
  const corps = I.couches.map(nom => couche(m, id, nom, ctx, cols)).join('');
  const [x, y, s] = I.carre, k = 30 / s, n = v => Math.round(v * 1e4) / 1e4;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><g transform="translate(${n(1 - x * k)} ${n(1 - y * k)}) scale(${n(k)})">${corps}</g></svg>`;
}

module.exports = { icone, ICONES };
