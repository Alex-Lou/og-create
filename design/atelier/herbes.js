// L'herbe refaite au niveau des PNJ, avec les verts de l'arbre (arbres.js) : la touffe d'herbe. Des brins dodus à pointe
// arrondie, chacun détouré (ceux du fond dans le vert du fond), plus sombres au pied, une nervure claire. Deux formes :
// les brins sortent du sol, ou d'une motte basse et sombre. Même cadre et même ancrage que les plantes de deco.js (le jeu
// fait balancer le dessin depuis sa base). Variantes : avec motte, petite, vert profond, fleurie (deux fleurettes sur tige).
const { OUT, E, r2 } = require('./troupe');
const { VERTS, TEINTES, fleurette, congere } = require('./arbres');

const W = 1.1;
// Un brin : pied (x, 0) large de w, pointe arrondie en (tx, ty), courbure b
function brinD(x, w, tx, ty, b) {
  const mx = (x + tx) / 2 + b, my = ty * 0.5, n = 0.9;
  return `M${r2(x - w / 2)},0.5 Q${r2(mx - w * 0.45)},${r2(my)} ${r2(tx - n)},${r2(ty + n * 1.2)} Q${r2(tx)},${r2(ty - n * 0.6)} ${r2(tx + n)},${r2(ty + n * 1.2)} Q${r2(mx + w * 0.45)},${r2(my)} ${r2(x + w / 2)},0.5 Q${r2(x)},1.7 ${r2(x - w / 2)},0.5 Z`;
}
function brin(id, [x, w, tx, ty, b], c) {
  const d = brinD(x, w, tx, ty, b);
  const mx = (x + tx) / 2 + b, my = ty * 0.5;
  return `<path d="${d}" fill="${c.mid}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<ellipse cx="${r2(x + 0.8)}" cy="1.4" rx="${r2(w * 1.1)}" ry="${r2(Math.abs(ty) * 0.34)}" fill="${c.dark}"/>`
    + `<path d="M${r2(x - w * 0.14)},${r2(ty * 0.22)} Q${r2(mx - w * 0.2)},${r2(my)} ${r2(tx - 0.15)},${r2(ty + 2.4)}" stroke="${c.light}" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>`;
}
// La motte : trois bosses sombres au pied des brins, un peu de lumière sur le dessus
function motte(id, c, s) {
  const d = `M${r2(-7.5 * s)},0.8 Q${r2(-8 * s)},${r2(-2.2 * s)} ${r2(-4.8 * s)},${r2(-2.4 * s)} Q${r2(-2.8 * s)},${r2(-3.8 * s)} 0,${r2(-3.3 * s)} Q${r2(2.8 * s)},${r2(-4 * s)} ${r2(4.8 * s)},${r2(-2.3 * s)} Q${r2(8 * s)},${r2(-2.2 * s)} ${r2(7.5 * s)},0.8 Q0,${r2(2.6 * s)} ${r2(-7.5 * s)},0.8 Z`;
  return `<path d="${d}" fill="${c.dark}" stroke="${OUT}" stroke-width="${W}" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})"><ellipse cx="${r2(-1.5 * s)}" cy="${r2(-3 * s)}" rx="${r2(5 * s)}" ry="${r2(1.5 * s)}" fill="${c.mid}"/></g>`;
}
const tige = (x0, y0, x1, y1) => {
  const d = `M${r2(x0)},${r2(y0)} Q${r2((x0 + x1) / 2 + 0.8)},${r2((y0 + y1) / 2)} ${r2(x1)},${r2(y1)}`;
  return `<path d="${d}" stroke="${OUT}" stroke-width="2.3" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#7BB352" stroke-width="1" fill="none" stroke-linecap="round"/>`;
};

// [x du pied, largeur, x et y de la pointe, courbure] : trois brins au fond, quatre devant
const FOND = [[-3.5, 5, -8, -12.5, -1.2], [1, 5.4, 2, -16, 0.8], [4.5, 5, 9.5, -11.5, 1.6]];
const DEVANT = [[-5.5, 4.8, -11, -8, -1.6], [-1.5, 5.4, -3.6, -13, -1], [2.5, 5, 6, -10.5, 1.2], [6, 4.4, 11.5, -6.5, 1.6]];

// vert : 'doux' ou 'profond' ; motte : les brins sortent d'une motte ; petite : × 0,7 ; fleurie : deux fleurettes
function touffe({ vert = 'doux', motte: avecMotte = false, petite = false, fleurie = false } = {}) {
  const c = VERTS[vert], s = petite ? 0.7 : 1;
  const id = `tf${avecMotte ? 'm' : ''}${petite ? 'p' : 'g'}${vert[0]}${fleurie ? 'f' : ''}`;
  const S = l => l.map(([x, w, tx, ty, b]) => [x * s, w * Math.max(s, 0.8), tx * s, ty * s, b * s]);
  let o = E(1, 1, 12.5 * s, 4.2 * s, 'rgba(40,55,20,0.22)', 0);
  o += S(FOND).map((b, i) => brin(`${id}a${i}`, b, c.fond)).join('');
  if (fleurie) o += tige(-1 * s, -3, -2.6 * s, -17.5 * s);
  o += S(DEVANT).map((b, i) => brin(`${id}b${i}`, b, c.devant)).join('');
  if (fleurie) o += tige(4.5 * s, -3, 7 * s, -13.5 * s) + fleurette(-2.6 * s, -18 * s, '#FFFFFF') + fleurette(7 * s, -14 * s, '#F7B6C8');
  if (avecMotte) o += motte(`${id}m`, c.devant, s);
  return o;
}

// Les 16 touffes : [fichier, libellé, options] ; « touffe » (sans motte, grande, vert doux, sobre) est celle par défaut
const TOUFFES = [];
for (const motte of [false, true]) for (const petite of [false, true]) for (const vert of ['doux', 'profond']) for (const fleurie of [false, true]) {
  const fichier = ['touffe', motte && 'motte', petite && 'petite', vert === 'profond' && 'profond', fleurie && 'fleurie'].filter(Boolean).join('_');
  const libelle = `Touffe d'herbe (${[motte && 'avec motte', petite ? 'petite' : 'grande', `vert ${vert}`, fleurie && 'fleurie'].filter(Boolean).join(', ')})`;
  TOUFFES.push([fichier, libelle, { vert, motte, petite, fleurie }]);
}

// ——— La touffe au fil des saisons (au printemps et en été, ce sont les touffes vertes, fleuries ou non) ———
// automne : l'herbe blonde, sèche, quelques graines au bout des brins ; hiver : le vert froid, un peu de neige sur la
// pointe des brins et une petite congère au pied
const BLOND = { devant: { light: '#F6E6A8', mid: '#DDBD66', dark: '#A98A3E' }, fond: { light: '#E4CB86', mid: '#C4A052', dark: '#8E6F36' } };
function touffeSaison({ saison = 'automne', petite = false } = {}) {
  const hiver = saison === 'hiver', c = hiver ? TEINTES.hiver : BLOND, s = petite ? 0.7 : 1;
  const id = `tfs${saison[0]}${petite ? 'p' : 'g'}`;
  const S = l => l.map(([x, w, tx, ty, b]) => [x * s, w * Math.max(s, 0.8), tx * s, ty * s, b * s]);
  let o = E(1, 1, 12.5 * s, 4.2 * s, hiver ? 'rgba(60,80,110,0.22)' : 'rgba(40,55,20,0.22)', 0);
  o += S(FOND).map((b, i) => brin(`${id}a${i}`, b, c.fond)).join('');
  o += S(DEVANT).map((b, i) => brin(`${id}b${i}`, b, c.devant)).join('');
  // les pointes : de la neige (hiver) ou des épis de graines (automne)
  o += S([...FOND, ...DEVANT]).map(([, , tx, ty]) => hiver ? E(tx + 0.2, ty + 1.1, 1.15, 0.75, '#FFFFFF', 0.5) : E(tx, ty + 0.4, 0.9, 1.4, '#C9A04E', 0.6)).join('');
  if (hiver) o += congere(0.55 * s);
  return o;
}
const TOUFFES_SAISONS = [];
for (const saison of ['automne', 'hiver']) for (const petite of [false, true]) {
  TOUFFES_SAISONS.push([['touffe', saison, petite && 'petite'].filter(Boolean).join('_'), `Touffe d'herbe ${saison === 'hiver' ? 'd\'hiver' : 'd\'automne'} (${petite ? 'petite' : 'grande'}, ${saison === 'hiver' ? 'neige sur les pointes, congère au pied' : 'herbe blonde, épis de graines'})`, { saison, petite }]);
}

module.exports = { touffe, TOUFFES, touffeSaison, TOUFFES_SAISONS };
