// Les objets du décor refaits au niveau des PNJ, un par un, avec le trait et la lumière des arbres (arbres.js) : le nid,
// la lanterne, le banc, le bonhomme de neige. Cadre et ancrage des décors de deco.js (PROP, centre de la case en (0, 0)).
const { OUT, E, r2 } = require('./troupe');
const { box } = require('./deco');

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

// ——— La lanterne : un poteau, sa potence, la lanterne vitrée pendue ; de fer ou de bois, du lierre, éteinte ou allumée ———
const POTEAUX = {
  bois: { light: '#C98E58', mid: '#9C6638', dark: '#6E4424' },
  fer: { light: '#6A7078', mid: '#454B53', dark: '#2C3036' }
};
const FER = { mid: '#3E4248', light: '#5C626A' };
// la feuille de lierre : un cœur pointu détouré, la nervure
const feuilleLierre = (x, y, a) => groupe(x, y, 0.8, `<path d="M0,0 Q-2.4,-1.2 -1.8,-3 Q-0.8,-3.8 0,-2.8 Q0.8,-3.8 1.8,-3 Q2.4,-1.2 0,0 Z" fill="#5E9E48" stroke="${OUT}" stroke-width="0.55" stroke-linejoin="round"/>` + trait('M0,-0.4 L0,-2.4', '#3E7A34', 0.4), a);
const LIERRE = [[-2.4, -6, -40], [2.4, -11, 35], [-2.4, -16, -30], [2.2, -21, 40], [-2.2, -26, -35], [2, -31, 30]];

// poteau : 'bois' ou 'fer' ; lierre : du lierre grimpe au poteau ; allumee : la flamme brûle, la lanterne luit
function lanterne({ poteau = 'bois', lierre = false, allumee = false } = {}) {
  const c = POTEAUX[poteau], fer = poteau === 'fer';
  const id = `lan${poteau[0]}${lierre ? 'l' : ''}${allumee ? 'a' : ''}`;
  const w = fer ? 1.6 : 2.2;
  // le poteau, son pied, la potence et sa jambe de force (une volute pour le fer)
  const pied = fer ? `<path d="M-4,0.6 Q-3.6,-2.4 -${w},-4 L${w},-4 Q3.6,-2.4 4,0.6 Z" fill="${c.mid}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
    : `<path d="M-3.6,0.8 L-3,-1.6 L3,-1.6 L3.6,0.8 Z" fill="#9A9488" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`;
  const poteauSvg = `<rect x="${-w}" y="-41" width="${2 * w}" height="${fer ? 37 : 39.4}" rx="${fer ? 0.8 : 1}" fill="${c.mid}" stroke="${OUT}" stroke-width="1"/>`
    + `<rect x="${r2(w * 0.25)}" y="-40.4" width="${r2(w * 0.65)}" height="${fer ? 36 : 38.6}" fill="${c.dark}"/>` + `<rect x="${r2(-w * 0.7)}" y="-40.4" width="${r2(w * 0.4)}" height="${fer ? 36 : 38.6}" fill="${c.light}"/>`
    + (fer ? '' : trait('M-0.6,-34 l0,4 M0.4,-20 l0,5 M-0.4,-9 l0,3', c.dark, 0.5));
  const potence = trait('M0,-41 L9.4,-41', OUT, 3.4) + trait('M0,-41 L9.4,-41', c.mid, 1.8)
    + (fer ? trait('M0,-35 Q5.4,-35.4 5.4,-41 Q2.6,-41 3,-38.4', OUT, 2.2) + trait('M0,-35 Q5.4,-35.4 5.4,-41 Q2.6,-41 3,-38.4', c.mid, 0.9)
      : trait('M0,-35 L5.4,-41', OUT, 2.6) + trait('M0,-35 L5.4,-41', c.mid, 1.2))
    + E(0, -41.6, w * 0.9, 1, c.mid, 0.9);
  // la lanterne : crochet, chapeau, vitres et croisillons, plateau, la flamme quand elle brûle
  const vitre = allumee ? '#FFE27A' : '#DCE7EB';
  const lumiere = allumee ? `<defs><radialGradient id="${id}g"><stop offset="0" stop-color="#FFE08A" stop-opacity="0.7"/><stop offset="0.5" stop-color="#FFE08A" stop-opacity="0.26"/><stop offset="1" stop-color="#FFE08A" stop-opacity="0"/></radialGradient></defs>`
    + `<circle cx="8.6" cy="-31.6" r="17" fill="url(#${id}g)"/>` + E(8.6, 1.4, 9, 3, 'rgba(255,224,138,0.32)', 0) : '';
  const lanterneSvg = trait('M8.6,-41 L8.6,-38.4', OUT, 0.9)
    + `<path d="M5.4,-35.6 L6.6,-38.6 L10.6,-38.6 L11.8,-35.6 Z" fill="${FER.mid}" stroke="${OUT}" stroke-width="0.9" stroke-linejoin="round"/>` + E(8.6, -39.2, 1, 0.8, FER.mid, 0.7)
    + `<rect x="5.6" y="-35.6" width="6" height="7.8" fill="${vitre}" stroke="${OUT}" stroke-width="0.9"/>`
    + (allumee ? `<path d="M8.6,-30 Q6.8,-31.6 8.6,-34.4 Q10.4,-31.6 8.6,-30 Z" fill="#F29A4A"/>` + `<path d="M8.6,-30.4 Q7.8,-31.4 8.6,-32.8 Q9.4,-31.4 8.6,-30.4 Z" fill="#FFF6C8"/>`
      : `<path d="M6.4,-29.2 L8.4,-34.8" stroke="#FFFFFF" stroke-width="0.8" stroke-linecap="round" opacity="0.8"/>`)
    + trait('M8.6,-35.6 L8.6,-27.8 M5.6,-31.7 L11.6,-31.7', FER.mid, 0.6)
    + `<path d="M5,-27.8 L12.2,-27.8 L11,-26.4 L6.2,-26.4 Z" fill="${FER.mid}" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`;
  return ombre(1, 0.8, 8, 3) + lumiere + pied + poteauSvg
    + (lierre ? trait('M0.6,-1 Q-2.6,-6 0.4,-11 Q3,-16 -0.4,-21 Q-2.8,-26 0.4,-31', '#3E7A34', 0.8) + LIERRE.map(([x, y, a]) => feuilleLierre(x, y, a)).join('') : '')
    + potence + lanterneSvg;
}

// Les 8 lanternes : [fichier, libellé, options] ; « lanterne » (poteau de bois, sans lierre, éteinte) est celle par défaut,
// « lanterne_allumee » la même allumée, comme avant
const LANTERNES = [];
for (const poteau of ['bois', 'fer']) for (const li of [false, true]) for (const al of [false, true]) {
  const fichier = ['lanterne', poteau === 'fer' && 'fer', li && 'lierre', al && 'allumee'].filter(Boolean).join('_');
  const libelle = `Lanterne sur pied (${[poteau === 'fer' ? 'poteau de fer' : 'poteau de bois', li && 'du lierre', al ? 'allumée' : 'éteinte'].filter(Boolean).join(', ')})`;
  LANTERNES.push([fichier, libelle, { poteau, lierre: li, allumee: al }]);
}

// ——— Le banc : un banc à lattes le long de la case, son dossier ; peint en vert, un chat y dort parfois ———
const BANCS = {
  naturel: { lattes: { top: '#E8B97E', left: '#C78D55', right: '#9C6438' }, pieds: { top: '#A9703F', left: '#8B5631', right: '#6A3F22' } },
  peint: { lattes: { top: '#A6D690', left: '#74B366', right: '#518E4C' }, pieds: { top: '#5E8C56', left: '#4A7444', right: '#365A33' } }
};
// le chat qui dort en boule : roux, rayé, la queue autour, les yeux fermés, le nez rose
const chat = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + E(0, -2.8, 5.4, 3.4, '#F2A35A', 0.8) + E(-1, -3.8, 3.2, 1.6, '#F7C08A', 0)
  + `<path d="M-2.4,-5.4 Q-1.8,-3.4 -2.6,-1.4 M0,-5.9 Q0.6,-3.6 -0.2,-0.8" stroke="#D27E3A" stroke-width="0.6" fill="none" stroke-linecap="round"/>`
  + `<path d="M-5,-1.4 Q-2,1.4 3.4,0.4 Q5.6,-0.2 5.4,-1.6" stroke="${OUT}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-5,-1.4 Q-2,1.4 3.4,0.4 Q5.6,-0.2 5.4,-1.6" stroke="#F2A35A" stroke-width="1.2" fill="none" stroke-linecap="round"/>`
  + `<path d="M1.6,-6.2 L2.2,-8.6 L3.6,-6.8 Z M4.4,-6.6 L5.8,-8.4 L6,-6 Z" fill="#F2A35A" stroke="${OUT}" stroke-width="0.7" stroke-linejoin="round"/>`
  + E(3.8, -4.8, 2.8, 2.3, '#F2A35A', 0.8) + E(3.4, -5.4, 1.4, 0.8, '#F7C08A', 0)
  + `<path d="M2.4,-4.8 q0.6,0.5 1.2,0 M4.4,-4.8 q0.6,0.5 1.2,0" stroke="${OUT}" stroke-width="0.5" fill="none" stroke-linecap="round"/>`
  + E(4, -3.9, 0.4, 0.3, '#F29AA8', 0) + E(2.2, -3.9, 0.55, 0.32, '#F7A8B8', 0) + E(5.8, -3.9, 0.55, 0.32, '#F7A8B8', 0) + '</g>';

// petit : un banc à deux places ; peint : peint en vert ; chat : un chat roux endormi dessus
function banc({ petit = false, peint = false, chat: avecChat = false } = {}) {
  const c = BANCS[peint ? 'peint' : 'naturel'], L = petit ? 0.21 : 0.31;
  const pied = (u, v, z1) => box(u - 0.022, v - 0.022, u + 0.022, v + 0.022, 0, z1, c.pieds, 0.8);
  // le dossier : deux montants, deux lattes ; puis les pieds, du fond vers l'avant ; puis les trois lattes de l'assise
  const dossier = pied(-L + 0.04, -0.088, 22) + pied(L - 0.04, -0.088, 22)
    + box(-L, -0.105, L, -0.078, 13.6, 16.4, c.lattes, 0.9) + box(-L, -0.105, L, -0.078, 18.4, 21.2, c.lattes, 0.9);
  const pieds = pied(-L + 0.04, 0.066, 9) + pied(L - 0.04, 0.066, 9);
  const assise = [[-0.092, -0.036], [-0.028, 0.028], [0.036, 0.092]].map(([v0, v1]) => box(-L, v0, L, v1, 9, 10.8, c.lattes, 0.9)).join('');
  const [cx, cy] = require('./deco').pt(0.06, 0, 10.8);
  return E(0, 3, (petit ? 17 : 24), 7.5, 'rgba(40,55,20,0.22)', 0) + dossier + pieds + assise + (avecChat ? chat(cx, cy) : '');
}

// Les 8 bancs : [fichier, libellé, options] ; « banc » (trois places, bois naturel, sans chat) est celui par défaut
const BANCS_LISTE = [];
for (const petit of [false, true]) for (const peint of [false, true]) for (const ch of [false, true]) {
  const fichier = ['banc', petit && 'petit', peint && 'peint', ch && 'chat'].filter(Boolean).join('_');
  const libelle = `Banc (${[petit ? 'deux places' : 'trois places', peint ? 'peint en vert' : 'bois naturel', ch && 'un chat endormi'].filter(Boolean).join(', ')})`;
  BANCS_LISTE.push([fichier, libelle, { petit, peint, chat: ch }]);
}

// ——— Le bonhomme de neige (l'hiver) : deux boules de neige détourées et ombrées comme la troupe, un visage chibi
// (yeux de charbon, joues roses, nez-carotte, sourire), des bras de brindilles, des boutons de charbon, une écharpe
// rayée à franges, un haut-de-forme ou un bonnet tricoté ; un rouge-gorge se pose parfois sur son bras ———
const NEIGE = { light: '#FFFFFF', mid: '#EEF4FA', dark: '#CFDDEB', creux: '#B7C9DC' };
// une boule de neige détourée : l'aplat, l'ombre en croissant en bas à droite, le reflet en haut à gauche
function bouleDeNeige(id, x, y, r) {
  return `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}" fill="${NEIGE.mid}" stroke="${OUT}" stroke-width="1.1"/>`
    + `<defs><clipPath id="${id}"><circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(r)}"/></clipPath></defs><g clip-path="url(#${id})">`
    + `<circle cx="${r2(x + r * 0.32)}" cy="${r2(y + r * 0.36)}" r="${r2(r * 0.95)}" fill="${NEIGE.dark}"/>`
    + `<circle cx="${r2(x - r * 0.06)}" cy="${r2(y - r * 0.06)}" r="${r2(r * 0.9)}" fill="${NEIGE.mid}"/>`
    + `<circle cx="${r2(x - r * 0.36)}" cy="${r2(y - r * 0.42)}" r="${r2(r * 0.36)}" fill="${NEIGE.light}"/></g>`;
}
// bras de brindille : du corps vers le bout, une fourche à deux doigts
const brasBrindille = (x0, y0, x1, y1, s) => {
  const fx = x0 + (x1 - x0) * 0.62, fy = y0 + (y1 - y0) * 0.62;
  const d = `M${r2(x0)},${r2(y0)} L${r2(x1)},${r2(y1)} M${r2(fx)},${r2(fy)} l${r2(2.4 * s)},${r2(-3.2)} M${r2(x1)},${r2(y1)} l${r2(-0.6 * s)},-2.6 M${r2(x1)},${r2(y1)} l${r2(2.4 * s)},-0.6`;
  return trait(d, OUT, 2.9) + trait(d, '#8A5A32', 1.2);
};
// l'écharpe : le tour du cou (bande rayée), un pan qui tombe sur le côté, ses franges
function echarpe(id, y, couleur, raie) {
  const tour = `M-11,${y - 1.6} Q0,${y + 2.4} 11,${y - 1.6} L11.2,${y + 2.2} Q0,${y + 6.4} -11.2,${y + 2.2} Z`;
  const pan = `M4,${y + 2} L9.4,${y + 1} L11.6,${y + 11} L6.4,${y + 12} Z`;
  return `<path d="${pan}" fill="${couleur}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
    + [0.35, 0.7].map(t => trait(`M${r2(4.6 + 2.1 * t)},${r2(y + 2 + 10 * t)} L${r2(9.8 + 2.1 * t)},${r2(y + 1 + 10 * t)}`, raie, 1.1)).join('')
    + [6.8, 8.4, 10, 11.4].map(x => trait(`M${x},${r2(y + 12 - (x - 6.4) * 0.2)} l0.3,2`, couleur, 1)).join('')
    + `<path d="${tour}" fill="${couleur}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
    + `<defs><clipPath id="${id}"><path d="${tour}"/></clipPath></defs><g clip-path="url(#${id})">`
    + [-7, -2.5, 2, 6.5].map(x => trait(`M${x},${y - 3} l1.4,10`, raie, 1.2)).join('')
    + `<path d="M-12,${y + 3.6} Q0,${y + 7.6} 12,${y + 3.6} L12,${y + 8} L-12,${y + 8} Z" fill="rgba(0,0,0,.18)"/></g>`;
}
// le haut-de-forme noir au ruban, posé un peu de travers ; le bonnet tricoté à pompon
const hautDeForme = (y, ruban) => `<g transform="rotate(-8 0 ${y})">`
  + E(0, y, 9.6, 2.6, '#3A3440', 1) + `<path d="M-6,${y} L-5.4,${y - 11} Q0,${y - 12.4} 5.4,${y - 11} L6,${y} Q0,${y + 1.8} -6,${y} Z" fill="#3A3440" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
  + `<path d="M-5.9,${y - 2.6} Q0,${y - 1} 5.9,${y - 2.6} L5.8,${y - 4.6} Q0,${y - 3} -5.8,${y - 4.6} Z" fill="${ruban}"/>` + trait(`M-3.6,${y - 9.6} L-3.8,${y - 5.4}`, '#5E5868', 1) + '</g>';
const bonnetTricote = (y, c, revers) => `<path d="M-9.4,${y} Q-9.6,${y - 11} 0,${y - 12.4} Q9.6,${y - 11} 9.4,${y} Z" fill="${c}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
  + [-5, -1.6, 1.8, 5.2].map(x => trait(`M${x},${y - 1} Q${x * 1.05},${y - 6} ${x * 0.8},${y - 10.4}`, 'rgba(0,0,0,.16)', 0.8)).join('')
  + `<path d="M-10.2,${y + 0.6} Q0,${y - 2.6} 10.2,${y + 0.6} L10,${y - 3.2} Q0,${y - 6.2} -10,${y - 3.2} Z" fill="${revers}" stroke="${OUT}" stroke-width="1" stroke-linejoin="round"/>`
  + [-7, -3.5, 0, 3.5, 7].map(x => trait(`M${x},${y - 0.6 - Math.abs(x) * 0.02} l0,-3`, 'rgba(0,0,0,.14)', 0.7)).join('')
  + E(1, y - 13.4, 3.2, 3, revers, 1) + E(0.1, y - 14.4, 1.2, 1, '#FFFFFF', 0);
// le visage : deux yeux de charbon et leur reflet, les joues roses, le nez-carotte, un sourire de charbon
const visageBonhomme = y => E(-3.7, y - 1.2, 1.35, 1.75, '#2A2420', 0) + E(3.3, y - 1.2, 1.35, 1.75, '#2A2420', 0)
  + E(-4.1, y - 1.9, 0.5, 0.55, '#FFFFFF', 0) + E(2.9, y - 1.9, 0.5, 0.55, '#FFFFFF', 0)
  + E(-6.4, y + 2.4, 1.9, 1.1, '#F7B6C8', 0) + E(6.4, y + 4, 1.7, 1, '#F7B6C8', 0)
  + `<path d="M-0.6,${y + 0.4} Q3.6,${y + 0.6} 8.2,${y + 2.2} Q3.4,${y + 2.8} -0.6,${y + 2.6} Z" fill="#F08A3A" stroke="${OUT}" stroke-width="0.8" stroke-linejoin="round"/>`
  + trait(`M2.2,${y + 0.9} l0.3,1.3 M4.6,${y + 1.3} l0.3,1.1`, '#C8622A', 0.5)
  + [-3.2, -1.6, 0.2, 2, 3.6].map((x, i) => E(x, y + 4.6 + [0.2, 0.9, 1.2, 0.9, 0.2][i], 0.55, 0.55, '#2A2420', 0)).join('');
// le rouge-gorge posé sur une brindille, tourné vers la gauche
const rougeGorge = (x, y) => `<g transform="translate(${r2(x)} ${r2(y)})">`
  + `<path d="M3.4,-1.6 L6.6,-0.6 L4,0.8 Z" fill="#7A5236" stroke="${OUT}" stroke-width="0.6" stroke-linejoin="round"/>`
  + E(0.6, -2.6, 3.6, 2.9, '#9C6B44', 0.8) + E(-0.6, -1.8, 2.2, 2, '#F08A3A', 0) + E(-2.2, -4.6, 2.2, 2.1, '#9C6B44', 0.8)
  + E(-2.8, -4.2, 1.2, 1.1, '#F08A3A', 0) + E(-2.6, -5.4, 0.5, 0.55, '#2A2420', 0) + `<path d="M-4.2,-4.8 L-5.8,-4.4 L-4.2,-4 Z" fill="#E8B24A" stroke="${OUT}" stroke-width="0.4"/>`
  + trait('M-0.6,0 l-0.4,1.2 M1,0.2 l0.2,1.2', OUT, 0.5) + '</g>';
// le tas de neige au pied
const tasDeNeige = s => `<path d="M${r2(-16 * s)},1.6 Q${r2(-14 * s)},-2.6 ${r2(-8 * s)},-1.4 Q${r2(-3 * s)},-3.2 ${r2(2 * s)},-1.6 Q${r2(8 * s)},-3.4 ${r2(13 * s)},-1 Q${r2(17 * s)},0 ${r2(16 * s)},2.4 Q0,5.6 ${r2(-16 * s)},1.6 Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.9"/>`
  + trait(`M${r2(2 * s)},2.6 Q${r2(8 * s)},3.4 ${r2(13 * s)},1.8`, '#D6E4EE', 1.2);

// petit : × 0,78 ; bleu : écharpe bleue et bonnet tricoté (sinon écharpe rouge et haut-de-forme) ; oiseau : un
// rouge-gorge posé sur le bras
function bonhommeDeNeige({ petit = false, bleu = false, oiseau = false } = {}) {
  const s = petit ? 0.78 : 1;
  const id = `bdn${petit ? 'p' : 'g'}${bleu ? 'b' : 'r'}${oiseau ? 'o' : ''}`;
  const corps = bouleDeNeige(`${id}a`, 0, -14, 14.5) + [-19, -13, -7].map(y => E(-1.6, y, 1.2, 1.15, '#2A2420', 0) + E(-1.9, y - 0.4, 0.4, 0.35, '#7A7480', 0)).join('');
  const brasG = brasBrindille(-12.6, -21, -24, -29.5, -1), brasD = brasBrindille(12.4, -21, 23.6, -30, 1);
  const tete = bouleDeNeige(`${id}b`, 0, -37, 10.4) + visageBonhomme(-37);
  const coiffe = bleu ? bonnetTricote(-44.6, '#5C8FD6', '#F2EDE4') : hautDeForme(-45.4, '#D9443A');
  const ech = echarpe(`${id}c`, -28.6, bleu ? '#5C8FD6' : '#D9443A', '#F2EDE4');
  const body = brasG + brasD + corps + tete + ech + coiffe + (oiseau ? rougeGorge(21.4, -29.6) : '');
  return E(3, 1.5, 19 * s, 6.5 * s, 'rgba(60,80,110,0.22)', 0) + groupe(0, 0, s, tasDeNeige(1) + body);
}
const BONSHOMMES = [];
for (const petit of [false, true]) for (const bleu of [false, true]) for (const oiseau of [false, true]) {
  const fichier = ['bonhomme_de_neige', petit && 'petit', bleu && 'bleu', oiseau && 'rouge_gorge'].filter(Boolean).join('_');
  const libelle = `Bonhomme de neige (${[petit ? 'petit' : 'grand', bleu ? 'écharpe bleue et bonnet tricoté' : 'écharpe rouge et haut-de-forme', oiseau && 'un rouge-gorge sur le bras'].filter(Boolean).join(', ')})`;
  BONSHOMMES.push([fichier, libelle, { petit, bleu, oiseau }]);
}

module.exports = { nid, NIDS, lanterne, LANTERNES, banc, BANCS_LISTE, bonhommeDeNeige, BONSHOMMES };
