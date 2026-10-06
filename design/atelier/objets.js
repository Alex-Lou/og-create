// Les objets du décor refaits au niveau des PNJ, un par un, avec le trait et la lumière des arbres (arbres.js) : le nid.
// Cadre et ancrage des décors de deco.js (PROP, centre de la case en (0, 0)).
const { OUT, E, r2 } = require('./troupe');

const ombre = (x, y, rx, ry) => E(x, y, rx, ry, 'rgba(40,55,20,0.22)', 0);
const trait = (d, col, w) => `<path d="${d}" stroke="${col}" stroke-width="${r2(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const groupe = (x, y, s, svg, a = 0) => `<g transform="translate(${r2(x)} ${r2(y)})${a ? ` rotate(${a})` : ''} scale(${r2(s)})">${svg}</g>`;

// ——— Le nid : une coupe de paille tressée, trois œufs tachetés ; des poussins à la place, une plume parfois ———
const PAILLE = { light: '#EDD290', mid: '#D3AF64', dark: '#A67F40', creux: '#7A5A30' };
// les brins tressés sur le bord : de petits arcs le long de l'ellipse, clairs et sombres ; devant : la moitié avant
function brins(k, devant) {
  let o = '';
  for (let i = 0; i < 34; i++) {
    const a = (i / 34) * Math.PI * 2 + 0.05;
    if ((Math.sin(a) > 0) !== devant) continue;
    const rx = (10.8 - (i % 3) * 0.8) * k, ry = (5.3 - (i % 3) * 0.4) * k, x = Math.cos(a) * rx, y = Math.sin(a) * ry;
    const tx = -Math.sin(a) * 2.4 * k, ty = Math.cos(a) * 1.2 * k;
    o += trait(`M${r2(x - tx)},${r2(y - ty)} Q${r2(x + Math.cos(a) * 1 * k)},${r2(y + Math.sin(a) * 0.7 * k)} ${r2(x + tx)},${r2(y + ty)}`, i % 3 ? PAILLE.light : PAILLE.dark, 0.8 * k);
  }
  return o;
}
// quelques brindilles qui dépassent, détourées
const BRINDILLES = ['M-10.4,-1.6 L-14,-3.6 M-12.6,-2.8 L-13.4,-4.6', 'M10.8,2.6 L14,2 M12.6,2.3 L13.6,3.4'];
const brindilles = k => BRINDILLES.map(d => {
  const s = d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));
  return trait(s, OUT, 1.6 * k) + trait(s, PAILLE.dark, 0.6 * k);
}).join('');
// un œuf de mouette : pâle, tacheté de brun, un reflet
const oeuf = (x, y, k) => E(x, y, 2.6 * k, 3.2 * k, '#E4EEEA', 0.8)
  + [[0.9, -0.8, 0.5], [-1, 0.6, 0.45], [0.6, 1.4, 0.35], [-0.4, -1.8, 0.3]].map(([dx, dy, r]) => E(x + dx * k, y + dy * k, r * k, r * k, '#8C7458', 0)).join('')
  + E(x - 0.9 * k, y - 1.3 * k, 0.7 * k, 1 * k, '#FFFFFF', 0);
// un poussin de mouette : boule de duvet gris, trois mèches, deux yeux, le bec ouvert qui piaille
const poussin = (x, y, k, regard = 1) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(regard * k)} ${r2(k)})">`
  + E(0, -2.6, 3.4, 3, '#D9D5CD', 0.8) + E(-0.8, -3.4, 1.8, 1.2, '#F1EEE8', 0)
  + trait('M-0.2,-5.5 q-0.2,-0.9 0.5,-1.1 M0.6,-5.5 q0.3,-0.7 1,-0.6', OUT, 0.55)
  + E(-1.2, -3.2, 0.5, 0.55, OUT, 0) + E(1.2, -3.2, 0.5, 0.55, OUT, 0) + E(-1.35, -3.4, 0.17, 0.17, '#FFFFFF', 0) + E(1.05, -3.4, 0.17, 0.17, '#FFFFFF', 0)
  + `<path d="M-0.9,-2.3 L0,-1.2 L0.9,-2.3 L0,-2.8 Z" fill="#F2B33D" stroke="${OUT}" stroke-width="0.5" stroke-linejoin="round"/>`
  + E(-2.2, -2.3, 0.6, 0.35, '#F7A8B8', 0) + E(2.2, -2.3, 0.6, 0.35, '#F7A8B8', 0) + '</g>';
// une plume de mouette : le tuyau, la barbe blanche, la pointe grise
const plume = (x, y, s, a) => groupe(x, y, s, `<path d="M0,0 Q-1.8,-3.6 -0.6,-8 Q0.4,-9.6 1.2,-8 Q2,-3.6 0,0 Z" fill="#F4F6F6" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + `<path d="M-0.6,-8 Q0.4,-9.6 1.2,-8 Q0.6,-6.6 -0.4,-6.8 Z" fill="#9AA4AA"/>` + trait('M0,0.6 L0.3,-8.4', '#9AA4AA', 0.5), a);

// petit : × 0,75 ; poussins : deux poussins à la place des œufs ; plume : une plume piquée dans le bord, une autre au sol
function nid({ petit = false, poussins = false, plume: avecPlume = false } = {}) {
  const k = petit ? 0.75 : 1;
  return ombre(1, 2.4 * k, 15 * k, 6.4 * k)
    + `<path d="M${r2(-12 * k)},0 L${r2(-11.2 * k)},${r2(3.4 * k)} A${r2(11.2 * k)} ${r2(5.6 * k)} 0 0 0 ${r2(11.2 * k)},${r2(3.4 * k)} L${r2(12 * k)},0 Z" fill="${PAILLE.dark}" stroke="${OUT}" stroke-width="1.1" stroke-linejoin="round"/>`
    + trait(`M${r2(-10 * k)},${r2(4.6 * k)} Q0,${r2(8.4 * k)} ${r2(10 * k)},${r2(4.6 * k)} M${r2(-11 * k)},${r2(2.4 * k)} Q0,${r2(6.6 * k)} ${r2(11 * k)},${r2(2.4 * k)}`, PAILLE.mid, 0.7 * k)
    + E(0, 0, 12 * k, 6 * k, PAILLE.mid, 1.1)
    + E(0, -0.4 * k, 8 * k, 3.8 * k, PAILLE.creux, 0.7) + E(0.6 * k, 0.2 * k, 6 * k, 2.6 * k, '#5E4424', 0)
    + brins(k, false) + brindilles(k)
    + (poussins ? poussin(-3 * k, 1.2 * k, k, -1) + poussin(2.8 * k, 1.6 * k, k * 0.92)
      : oeuf(-3 * k, -1.8 * k, k) + oeuf(2.6 * k, -1.4 * k, k) + oeuf(-0.2 * k, 0, k))
    + brins(k, true)
    + (avecPlume ? plume(10 * k, -1 * k, 0.9 * k, 28) + plume(-15 * k, 6 * k, 0.75 * k, -68) : '');
}

// Les 8 nids : [fichier, libellé, options] ; « nid » (grand, des œufs, sans plume) est celui par défaut
const NIDS = [];
for (const petit of [false, true]) for (const po of [false, true]) for (const pl of [false, true]) {
  const fichier = ['nid', petit && 'petit', po && 'poussins', pl && 'plume'].filter(Boolean).join('_');
  const libelle = `Nid de mouettes (${[petit ? 'petit' : 'grand', po ? 'deux poussins' : 'trois œufs', pl && 'une plume'].filter(Boolean).join(', ')})`;
  NIDS.push([fichier, libelle, { petit, poussins: po, plume: pl }]);
}

module.exports = { nid, NIDS };
