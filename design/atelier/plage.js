// La plage refaite au niveau des PNJ, un élément à la fois, avec le trait et la lumière des arbres (arbres.js) : les
// coquillages, le bois flotté. Cadre et ancrage des décors de deco.js (PROP, centre de la case en (0, 0)).
const { OUT, E, r2 } = require('./troupe');

// une ombre douce posée sur le sable
const ombre = (x, y, rx, ry) => E(x, y, rx, ry, 'rgba(120,90,40,0.2)', 0);
const sc = (d, k) => d.replace(/-?\d+(\.\d+)?/g, n => r2(n * k));
const groupe = (x, y, s, svg) => `<g transform="translate(${r2(x)} ${r2(y)}) scale(${r2(s)})">${svg}</g>`;

// ——— Les coquillages : une coquille Saint-Jacques, une conque, des coques ; une étoile de mer s'y mêle parfois ———
// coloris : la coquille, ses stries, la Saint-Jacques et ses côtes, l'intérieur de la conque
const COLORIS = {
  chauds: { coq: '#FBE3CC', strie: '#DDAA84', sj: '#F6B2BE', cote: '#D27C90', dedans: '#F29AA8' },
  nacres: { coq: '#EFE6F6', strie: '#B9A3D2', sj: '#DCCBF0', cote: '#9D84C2', dedans: '#C9B2E6' }
};
// la Saint-Jacques couchée : l'éventail aplati, les oreilles au talon, les côtes en rayons, le côté droit dans l'ombre
function saintJacques(id, c) {
  const d = 'M0,0 L-1.8,-0.2 L-1.6,-1.2 Q-5.8,-1.8 -5.8,-3.8 Q-3.4,-6.4 0,-6.6 Q3.4,-6.4 5.8,-3.8 Q5.8,-1.8 1.6,-1.2 L1.8,-0.2 Z';
  return `<path d="${d}" fill="${c.sj}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<path d="M1.2,-8 L8,-8 L8,1 L1.2,1 Z" fill="${c.cote}" opacity="0.35"/>` + E(-2.4, -4.6, 2, 0.9, '#FFFFFF', 0).replace('/>', ' opacity="0.55"/>') + '</g>'
    + [-4.2, -2.4, -0.8, 0.8, 2.4, 4.2].map(x => `<path d="M0,-1.2 L${r2(x)},${r2(-5.6 + Math.abs(x) * 0.28)}" stroke="${c.cote}" stroke-width="0.5" stroke-linecap="round"/>`).join('');
}
// la conque couchée, pointe à gauche : les tours de la spirale qui grossissent vers la droite, l'ouverture rosée
function conque(id, c) {
  const d = 'M-7.4,-3.6 L-5.2,-3.4 Q-4.4,-4.8 -2.8,-4 Q-1.6,-5.8 0.6,-4.8 Q3,-6.4 5.2,-4.4 Q7.4,-2.2 5.6,0.2 Q3.4,1.8 0,0.8 Q-3.4,-0.4 -7.4,-3.6 Z';
  return `<path d="${d}" fill="${c.coq}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<path d="M-8,-2 Q0,1 8,-1.4 L8,3 L-8,3 Z" fill="${c.strie}" opacity="0.4"/>` + '</g>'
    + `<path d="M-5.2,-3.4 Q-4.4,-2.6 -3.6,-1.8 M-2.8,-4 Q-2,-2.4 -1,-0.6 M0.6,-4.8 Q1.4,-2.4 2.4,0.4" stroke="${c.strie}" stroke-width="0.6" fill="none" stroke-linecap="round"/>`
    + E(4, -1.6, 1.9, 1.3, c.dedans, 0.6) + E(3.6, -1.9, 0.8, 0.5, '#FFFFFF', 0).replace('/>', ' opacity="0.6"/>');
}
// une coque : ronde, détourée, deux stries, un reflet
const coque = (x, y, r, c) => E(x, y, r, r * 0.7, c.coq, 0.7)
  + `<path d="M${r2(x - r * 0.4)},${r2(y + r * 0.5)} Q${r2(x - r * 0.5)},${r2(y - r * 0.2)} ${r2(x - r * 0.2)},${r2(y - r * 0.6)} M${r2(x + r * 0.3)},${r2(y + r * 0.55)} Q${r2(x + r * 0.4)},${r2(y - r * 0.1)} ${r2(x + r * 0.15)},${r2(y - r * 0.62)}" stroke="${c.strie}" stroke-width="0.45" fill="none" stroke-linecap="round"/>`
  + E(x - r * 0.35, y - r * 0.25, r * 0.3, r * 0.18, '#FFFFFF', 0);
// l'étoile de mer à plat : cinq bras arrondis, orange, des points clairs, aplatie par la vue
function etoile(x, y, s) {
  const bras = [0, 1, 2, 3, 4].map(i => {
    const a = -Math.PI / 2 + i * 2 * Math.PI / 5, b = a + Math.PI / 5;
    const p = (ang, r) => `${r2(x + Math.cos(ang) * r * s)},${r2(y + Math.sin(ang) * r * 0.62 * s)}`;
    return `${i ? 'L' : 'M'}${p(a - 0.12, 4.6)} Q${p(a, 5.6)} ${p(a + 0.12, 4.6)} L${p(b, 1.9)}`;
  }).join(' ') + ' Z';
  return `<path d="${bras}" fill="#F29A4A" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
    + E(x, y, 1.3 * s, 0.8 * s, '#F7B877', 0)
    + [0, 1, 2, 3, 4].map(i => { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; return E(x + Math.cos(a) * 3 * s, y + Math.sin(a) * 1.86 * s, 0.4 * s, 0.3 * s, '#FFE1B8', 0); }).join('');
}

// coloris : 'chauds' ou 'nacres' ; petits : × 0,75 ; etoile : une étoile de mer parmi les coquillages
function coquillages({ coloris = 'chauds', petits = false, etoile: avecEtoile = false } = {}) {
  const c = COLORIS[coloris], k = petits ? 0.75 : 1;
  const id = `coq${petits ? 'p' : 'g'}${coloris[0]}${avecEtoile ? 'e' : ''}`;
  return ombre(12 * k, 5.4 * k, 6.6 * k, 2 * k) + ombre(-11.6 * k, 2.4 * k, 7 * k, 1.8 * k)
    + groupe(12 * k, 5 * k, 1.5 * k, saintJacques(`${id}a`, c))
    + groupe(-11.6 * k, 2 * k, 1.5 * k, conque(`${id}b`, c))
    + coque(0, 8.6 * k, 2.4 * k, c) + coque(21 * k, -2.6 * k, 1.9 * k, c) + coque(-21 * k, -4 * k, 1.6 * k, c)
    + (avecEtoile ? etoile(1 * k, -8 * k, 1.3 * k) : '');
}

// Les 8 coquillages : [fichier, libellé, options] ; « coquillages » (grands, coloris chauds, sans étoile) par défaut
const COQUILLAGES = [];
for (const petits of [false, true]) for (const coloris of ['chauds', 'nacres']) for (const et of [false, true]) {
  const fichier = ['coquillages', petits && 'petits', coloris === 'nacres' && 'nacres', et && 'etoile'].filter(Boolean).join('_');
  const libelle = `Coquillages (${[petits ? 'petits' : 'grands', coloris === 'nacres' ? 'nacrés' : 'coloris chauds', et && 'une étoile de mer'].filter(Boolean).join(', ')})`;
  COQUILLAGES.push([fichier, libelle, { coloris, petits, etoile: et }]);
}

// ——— Le bois flotté : une branche couchée, lisse, deux fourches ; des algues s'y accrochent parfois ———
const BOIS = {
  blanchi: { light: '#F3ECDE', mid: '#D9CEBB', dark: '#B0A38D' },
  sombre: { light: '#BE9E7E', mid: '#97795D', dark: '#6F5641' }
};
// [tracé, épaisseur] : la branche, puis ses deux fourches
const BRANCHE = [['M-22,5 Q-10,-1 4,1 Q14,2 22,-3', 6], ['M-2,0.6 Q2,-6 8,-9', 3], ['M13,1.6 Q16,-3.6 20,-5', 2.2]];
const trait = (d, col, w, dy = 0) => `<path d="${d}" stroke="${col}" stroke-width="${r2(w)}" fill="none" stroke-linecap="round" stroke-linejoin="round"${dy ? ` transform="translate(0 ${r2(dy)})"` : ''}/>`;
// une algue qui pend par-dessus la branche : ruban plat détouré, ondulé, sa nervure
const algue = (d, nervure, col, k) => `<path d="${sc(d, k)}" fill="${col}" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>` + trait(sc(nervure, k), '#4E8A3A', 0.45);
const ALGUES = [
  ['M-9,-1.6 Q-10.6,2 -9,4.6 Q-7.8,6.6 -9.4,8.6 Q-6.4,7.6 -6.8,4.8 Q-7.2,2 -6.6,-1.4 Z', 'M-7.8,-1 Q-8.6,2.4 -7.8,4.8 Q-7.4,6.4 -8.4,7.8', '#6FAE4E'],
  ['M-6,-1.4 Q-4,1.6 -5.4,4 Q-3.2,3 -3.4,0.4 Q-3.6,-1 -4.4,-1.8 Z', 'M-5,-1.2 Q-4,1 -4.6,3', '#8CC45A'],
  ['M9,0 Q7.6,3 9,5.8 Q10.4,4.6 10.6,2 Q10.8,0.6 10.6,-0.4 Z', 'M9.8,0 Q9,2.6 9.4,4.8', '#6FAE4E']
];

// bois : 'blanchi' ou 'sombre' (mouillé) ; petit : × 0,75 ; algues : des algues accrochées et un coquillage
function boisFlotte({ bois = 'blanchi', petit = false, algues = false } = {}) {
  const c = BOIS[bois], k = petit ? 0.75 : 1;
  const tr = BRANCHE.map(([d, w]) => [sc(d, k), w * k]);
  return ombre(0, 4.6 * k, 24 * k, 4.6 * k)
    + tr.map(([d, w]) => trait(d, OUT, w + 2.2)).join('')
    + tr.map(([d, w]) => trait(d, c.mid, w)).join('')
    + tr.map(([d, w]) => trait(d, c.dark, w * 0.42, w * 0.22)).join('')
    + tr.map(([d, w]) => trait(d, c.light, w * 0.36, -w * 0.2)).join('')
    + trait(sc('M-16,3.2 Q-9,0.2 -3,0.4 M6,1.4 Q12,1.8 17,-0.2', k), c.dark, 0.5)
    + E(-8 * k, 1.6 * k, 1.2 * k, 0.7 * k, c.dark, 0.5)
    + (algues ? ALGUES.map(([d, n, col]) => algue(d, n, col, k)).join('') + coque(-17 * k, 9 * k, 2 * k, COLORIS.chauds) : '');
}

// Les 8 bois flottés : [fichier, libellé, options] ; « bois_flotte » (grand, blanchi, sans algues) est celui par défaut
const BOIS_FLOTTES = [];
for (const petit of [false, true]) for (const bois of ['blanchi', 'sombre']) for (const al of [false, true]) {
  const fichier = ['bois_flotte', petit && 'petit', bois === 'sombre' && 'sombre', al && 'algues'].filter(Boolean).join('_');
  const libelle = `Bois flotté (${[petit ? 'petit' : 'grand', bois === 'sombre' ? 'bois mouillé sombre' : 'bois blanchi', al && 'des algues accrochées'].filter(Boolean).join(', ')})`;
  BOIS_FLOTTES.push([fichier, libelle, { bois, petit, algues: al }]);
}

module.exports = { coquillages, COQUILLAGES, boisFlotte, BOIS_FLOTTES };
