// Les cultures par étapes (les chantiers du potager) : une parcelle d'une case qu'on bêche, où l'on trace les sillons,
// qu'on sème, puis où les plants poussent et grandissent ; à la fin, c'est le champ mûr de l'annexe (decor/annexes/champ,
// épouvantail compris), qui prend le relais sans rien déplacer : même cadre, mêmes rangs, même terre. Trois cultures :
// blé, carottes, citrouilles. Chaque étape tourne en 3 images (le vent dans les plants, le ruban du piquet, le ver,
// le moineau). Géométrie et lumière de world/iso.js, mêmes rangs que le champ (annexSprites.js) ; dessins en pixels du
// jeu (preview_cultures.mjs les agrandit × 1,25).
import { P, face, box, EDGE } from './port/src/world/iso.js';
import { WOOD, WOOD_DARK } from './port/src/world/palette.js';

const OUT = '#3C2819';
const f2 = n => Math.round(n * 100) / 100;
const ln = (a, b, color, w = 1) => `<line x1="${f2(a[0])}" y1="${f2(a[1])}" x2="${f2(b[0])}" y2="${f2(b[1])}" stroke="${color}" stroke-width="${f2(w)}" stroke-linecap="round"/>`;
const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}"${extra}/>`;
const dot = (x, y, r, fill) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}"/>`;
const chemin = (d, stroke, w, fill = 'none') => `<path d="${d}" stroke="${stroke}" stroke-width="${f2(w)}" fill="${fill}" stroke-linecap="round" stroke-linejoin="round"/>`;
const wave = (f, n, amp = 1, phase = 0) => Math.sin((f / n) * Math.PI * 2 + phase) * amp;

export const CADRE = [-34, -30, 68, 48]; // le cadre du champ (annexSprites.js), en pixels du jeu
// le blé, les carottes, les citrouilles finissent en champ mûr (l'annexe) ; les cultures du potager ont leur propre étape
// « mur » (laitues, choux, tomates, haricots, fraises, pommes de terre)
export const CULTURES = ['ble', 'carottes', 'citrouilles', 'laitues', 'choux', 'tomates', 'haricots', 'fraises', 'pommes_de_terre'];
export const ETAPES = ['bechage', 'sillons', 'semis', 'pousses', 'croissance'];
export const ETAPES_POTAGER = [...ETAPES, 'mur'];
export const etapesDe = culture => (POTAGER[culture] ? ETAPES_POTAGER : ETAPES);
export const IMAGES = 3;

/* ---------- la terre, les rangs ---------- */
const COLS = [-0.31, -0.155, 0, 0.155, 0.31];
const ROWS = [-0.28, -0.14, 0, 0.14, 0.28];
const TERRE = { bord: '#8A5A36', dedans: '#9B6A42', creux: '#6E4528', crete: '#B07E54', motte: '#7E5232', clair: '#B98A5E' };
const HERBE = { fond: '#8FC060', clair: '#A9D67E', brin: '#5E9A3E' };
const LEAF = '#5FA04A';
const LEAF_LIGHT = '#8FCB6A';
const carre = (r, fill, extra = EDGE) => face([[-r, -r, 0], [r, -r, 0], [r, r, 0], [-r, r, 0]], fill, extra);
const sillons = () => ROWS.map(dv => ln(P(-0.4, dv, 0), P(0.4, dv, 0), TERRE.creux, 2.6) + ln(P(-0.4, dv - 0.03, 0.6), P(0.4, dv - 0.03, 0.6), TERRE.crete, 1)).join('');
// les plants, rangés du fond vers le devant
const plants = () => ROWS.flatMap((dv, r) => COLS.map((du, c) => ({ du, dv, k: r * 5 + c }))).sort((a, b) => a.du + a.dv - (b.du + b.dv));
// une touffe d'herbe
const touffe = (x, y, s = 1) => [-1.2, 0, 1.2].map((o, i) => ln([x + o * 0.5 * s, y], [x + o * s, y - (2.4 + (i === 1 ? 1 : 0)) * s], HERBE.brin, 0.7)).join('');

/* ---------- le bornage : les trois piquets du champ, sa ficelle, un ruban au vent ---------- */
// les mêmes que le champ (annexSprites.js) : poteaux de bois carrés à gauche, à droite et devant, ficelle tendue devant
const piquet = (u, v) => box(u - 0.022, v - 0.022, u + 0.022, v + 0.022, 0, 8, WOOD);
function bornage(f, devant) {
  if (!devant) return piquet(0.44, -0.44) + piquet(-0.44, 0.44);
  const [rx, ry] = P(0.44, -0.44, 7.4), s = wave(f, IMAGES, 1.2);
  return piquet(0.44, 0.44) + ln(P(0.44, -0.44, 7), P(0.44, 0.44, 7), 'rgba(235,225,200,.8)', 0.5) + ln(P(-0.44, 0.44, 7), P(0.44, 0.44, 7), 'rgba(235,225,200,.8)', 0.5)
    + chemin(`M${f2(rx)},${f2(ry)} q${f2(2 + s * 0.5)},${f2(0.6 + s)} ${f2(4 + s)},${f2(0.2 + s * 1.4)}`, '#E2574C', 1.1);
}

/* ---------- les outils, les petites bêtes ---------- */
// La bêche plantée dans la terre : le fer gris, le manche, la poignée en T
function beche(u, v) {
  const [x, y] = P(u, v, 0);
  return `<polygon points="${f2(x - 2)},${f2(y - 4)} ${f2(x + 2)},${f2(y - 4.4)} ${f2(x + 1.7)},${f2(y + 0.6)} ${f2(x - 1.6)},${f2(y + 1)}" fill="#A9AFB8"${EDGE}/>`
    + ln([x + 0.1, y - 4.2], [x + 1.2, y - 15], OUT, 2.4) + ln([x + 0.1, y - 4.2], [x + 1.2, y - 15], WOOD.left, 1.3)
    + ln([x - 0.8, y - 15.1], [x + 3.2, y - 15.5], OUT, 2.2) + ln([x - 0.8, y - 15.1], [x + 3.2, y - 15.5], WOOD.top, 1.1);
}
// Le râteau couché au bord de la parcelle
function rateau(u, v) {
  const a = P(u, v, 0.6), b = P(u + 0.3, v - 0.12, 0.6);
  let out = ln(a, b, OUT, 2.2) + ln(a, b, WOOD.left, 1.2);
  const [hx, hy] = b;
  out += ln([hx - 1.4, hy + 2.4], [hx + 1.6, hy - 2.2], OUT, 2) + ln([hx - 1.4, hy + 2.4], [hx + 1.6, hy - 2.2], '#8A8F98', 1);
  for (let k = 0; k < 5; k++) { const t = k / 4, x = hx - 1.4 + t * 3, y = hy + 2.4 - t * 4.6; out += ln([x, y], [x + 1.4, y + 0.4], '#6E737C', 0.6); }
  return out;
}
// Le ver de terre qui ondule hors d'une motte
function ver(u, v, f) {
  const [x, y] = P(u, v, 0), s = wave(f, IMAGES, 1);
  return chemin(`M${f2(x - 2.4)},${f2(y)} q${f2(1)},${f2(-1.4 + s)} ${f2(2.2)},${f2(-0.4)} q${f2(1.2)},${f2(1 - s)} ${f2(2.2)},${f2(-1.2 - s * 0.4)}`, OUT, 1.9)
    + chemin(`M${f2(x - 2.4)},${f2(y)} q${f2(1)},${f2(-1.4 + s)} ${f2(2.2)},${f2(-0.4)} q${f2(1.2)},${f2(1 - s)} ${f2(2.2)},${f2(-1.2 - s * 0.4)}`, '#E9A0A0', 1);
}
// Le moineau qui picore les graines : tête levée, baissée, levée
function moineau(u, v, f) {
  const [x, y] = P(u, v, 0), t = f === 1 ? 2.2 : 0; // t : la tête baissée vers les graines
  return ell(x, y + 0.5, 3.4, 0.9, 'rgba(40,55,20,.25)')
    + ln([x - 0.5, y - 0.2], [x - 0.8, y - 1.8], '#C8862A', 0.6) + ln([x + 0.7, y - 0.2], [x + 0.5, y - 1.8], '#C8862A', 0.6)
    + `<path d="M${f2(x - 4.6)},${f2(y - 3.2)} Q${f2(x - 1.4)},${f2(y - 6.6)} ${f2(x + 2.6)},${f2(y - 4)} Q${f2(x + 1.6)},${f2(y - 1.2)} ${f2(x - 2.6)},${f2(y - 1.6)} Z" fill="#B88352"${EDGE}/>`
    + `<path d="M${f2(x - 2.8)},${f2(y - 2.2)} Q${f2(x)},${f2(y - 1.4)} ${f2(x + 1.6)},${f2(y - 2.4)}" fill="none" stroke="#F0DEC0" stroke-width="0.9" stroke-linecap="round"/>`
    + chemin(`M${f2(x - 3.4)},${f2(y - 3.6)} q2,-1.4 4,-0.6`, '#7A5232', 0.7)
    + `<circle cx="${f2(x + 3)}" cy="${f2(y - 5.6 + t)}" r="2" fill="#9A6A42"${EDGE}/>`
    + ell(x + 3.1, y - 6.5 + t, 1.4, 0.6, '#6E4A2E')
    + dot(x + 3.7, y - 5.9 + t, 0.42, '#1E1410')
    + `<polygon points="${f2(x + 4.8)},${f2(y - 5.6 + t)} ${f2(x + 6.4)},${f2(y - 5 + t)} ${f2(x + 4.8)},${f2(y - 4.8 + t)}" fill="#E8B04A"${EDGE}/>`;
}
// Le sachet de graines, appuyé au piquet de devant : papier crème, le dessin de la culture
const DESSIN = { ble: '#EBC85E', carottes: '#F08A3A', citrouilles: '#E8862E' };
const dessinDe = culture => DESSIN[culture] || POTAGER[culture].dessin;
function sachet(u, v, culture) {
  const [x, y] = P(u, v, 0);
  return `<polygon points="${f2(x - 2.6)},${f2(y)} ${f2(x + 2.6)},${f2(y - 0.6)} ${f2(x + 2.8)},${f2(y - 7)} ${f2(x - 2.4)},${f2(y - 6.6)}" fill="#F4E6C8"${EDGE}/>`
    + ln([x - 2.4, y - 5.6], [x + 2.8, y - 6], '#C9B48A', 0.6)
    + ell(x + 0.2, y - 3, 1.5, 1.7, dessinDe(culture), ` stroke="${OUT}" stroke-width="0.4"`)
    + ln([x + 0.2, y - 4.6], [x + 0.6, y - 5.6], LEAF, 0.7);
}

/* ---------- les graines et les plants de chaque culture ---------- */
// Les graines semées dans un sillon, autour du point d'un plant
function graine(culture, x, y, k) {
  if (culture === 'ble') return [-1.6, 0, 1.6].map((o, i) => ell(x + o, y - 0.4 + (i % 2) * 0.3, 0.7, 0.4, '#E2C66E', ` stroke="#A8823A" stroke-width="0.3" transform="rotate(${(k * 37 + i * 50) % 180} ${f2(x + o)} ${f2(y - 0.4)})"`)).join('');
  if (culture === 'carottes') return [-1.4, -0.4, 0.6, 1.5].map((o, i) => dot(x + o, y - 0.3 + (i % 2) * 0.3, 0.32, '#5A3A22')).join('');
  return k % 2 ? '' : ell(x - 0.6, y - 0.3, 0.9, 0.55, '#F4E6C0', ' stroke="#B8A47A" stroke-width="0.3"') + ell(x + 0.8, y - 0.1, 0.9, 0.55, '#F4E6C0', ' stroke="#B8A47A" stroke-width="0.3"');
}
// Les pousses : le blé en brins fins, les carottes en petites plumes, les citrouilles en deux cotylédons ronds
function pousse(culture, x, y, f, k) {
  const s = wave(f, IMAGES, 0.6, k * 0.9);
  if (culture === 'ble') return [-0.8, 0, 0.8].map((o, i) => ln([x + o * 0.4, y], [x + o + s, y - 3 - (i === 1 ? 1 : 0)], '#7CBF4E', 0.6)).join('');
  if (culture === 'carottes') return [-1, 1].map(o => chemin(`M${f2(x)},${f2(y)} q${f2(o * 0.4 + s * 0.3)},-1.4 ${f2(o + s * 0.4)},-2.8`, LEAF_LIGHT, 0.8) + dot(x + o + s * 0.4, y - 2.9, 0.6, LEAF_LIGHT)).join('');
  if (k % 2) return '';
  return ln([x, y], [x + s * 0.3, y - 2.2], '#6FA84A', 0.6)
    + ell(x - 1.3 + s * 0.3, y - 2.6, 1.3, 0.8, LEAF_LIGHT, ` stroke="#4F8F3A" stroke-width="0.3"`)
    + ell(x + 1.3 + s * 0.3, y - 2.7, 1.3, 0.8, LEAF, ` stroke="#4F8F3A" stroke-width="0.3"`);
}
// La croissance : le blé haut et vert (des épis encore verts), les fanes des carottes et le haut orange qui affleure,
// les citrouilles en tiges rampantes, grandes feuilles, une fleur jaune et une petite courge verte
function croissance(culture, x, y, f, k) {
  const s = wave(f, IMAGES, 1.2, k * 0.9);
  if (culture === 'ble') {
    return [-1.2, 0, 1.2].map((o, i) => {
      const tx = x + o + s * (0.7 + i * 0.15), ty = y - 8 - (i === 1 ? 1.2 : 0);
      return ln([x + o * 0.4, y], [tx, ty], '#6FA84A', 0.8)
        + `<ellipse cx="${f2(tx)}" cy="${f2(ty - 1.3)}" rx="0.9" ry="2" fill="#A9CF6A" stroke="#6F9A3E" stroke-width="0.35" transform="rotate(${f2(s * 6)} ${f2(tx)} ${f2(ty)})"/>`;
    }).join('');
  }
  if (culture === 'carottes') {
    return ell(x, y, 1.2, 0.6, '#F08A3A', ' stroke="#C8622A" stroke-width="0.3"')
      + [-1.8, -0.6, 0.6, 1.8].map((o, i) => chemin(`M${f2(x)},${f2(y - 0.3)} q${f2(o * 0.5 + s * 0.3)},-2.4 ${f2(o * 0.8 + s * 0.5)},-${f2(4.6 + (i % 2))}`, i % 2 ? LEAF_LIGHT : LEAF, 1)).join('');
  }
  if (k % 2) return chemin(`M${f2(x - 3)},${f2(y - 0.4)} q${f2(2 + s * 0.3)},-1.6 ${f2(5)},-0.4`, '#5E9A3E', 0.7);
  const fleur = k % 4 === 0;
  return ell(x, y + 0.2, 4, 1.1, 'rgba(40,55,20,.2)')
    + `<circle cx="${f2(x - 1.8)}" cy="${f2(y - 2)}" r="2" fill="${LEAF}" stroke="#3F7A2E" stroke-width="0.35"/>`
    + `<circle cx="${f2(x + 1.6 + s * 0.3)}" cy="${f2(y - 2.5)}" r="2.2" fill="${LEAF_LIGHT}" stroke="#4F8F3A" stroke-width="0.35"/>`
    + (fleur
      ? [0, 72, 144, 216, 288].map(a => ell(x + 0.2 + s * 0.3 + Math.cos(a * Math.PI / 180) * 0.9, y - 4.6 + Math.sin(a * Math.PI / 180) * 0.6, 0.8, 0.55, '#F7C83A')).join('') + dot(x + 0.2 + s * 0.3, y - 4.6, 0.45, '#E08A1E')
      : ell(x + 0.4, y - 0.8, 1.6, 1.2, '#7FB24A', ' stroke="#4F7A2E" stroke-width="0.35"'));
}

/* ---------- les cultures du potager : chacune ses graines, ses pousses, sa croissance et son étape mûre ---------- */
const BOIS = { tuteur: '#A9794A', fonce: '#7A5232' };
const ROUGE = '#E2453A';
const tige = (a, b, color = '#5E9A3E', w = 0.7) => ln(a, b, color, w);
const feuille = (x, y, rx, ry, fill, rot = 0, edge = '#3F7A2E') => `<ellipse cx="${f2(x)}" cy="${f2(y)}" rx="${f2(rx)}" ry="${f2(ry)}" fill="${fill}" stroke="${edge}" stroke-width="0.35"${rot ? ` transform="rotate(${f2(rot)} ${f2(x)} ${f2(y)})"` : ''}/>`;
const fruit = (x, y, r, fill, edge) => `<circle cx="${f2(x)}" cy="${f2(y)}" r="${f2(r)}" fill="${fill}" stroke="${edge}" stroke-width="0.35"/>` + dot(x - r * 0.35, y - r * 0.35, r * 0.3, 'rgba(255,255,255,.55)');
const piquetTuteur = (x, y, h) => ln([x, y + 0.4], [x + 0.4, y - h], OUT, 1.9) + ln([x, y + 0.4], [x + 0.4, y - h], BOIS.tuteur, 1);
const trefle = (x, y, r, fill, s = 0) => [-60, 0, 60].map(a => feuille(x + Math.sin(a * Math.PI / 180) * r * 0.9 + s * 0.2, y - r * 0.8 - Math.cos(a * Math.PI / 180) * r * 0.6, r * 0.62, r * 0.48, fill, a)).join('');
const paille = (x, y) => [[-3, 0.6, 2.6, -0.2], [-2, -0.6, 3, 0.4], [-3.2, 1.2, 1.4, 1.6]].map(([a, b, c, d]) => ln([x + a, y + b], [x + c, y + d], '#E8C86A', 0.55)).join('');
const butte = (x, y) => ell(x, y + 0.2, 3.6, 1.6, TERRE.motte, ` stroke="${OUT}" stroke-width="0.35"`) + ell(x - 0.6, y - 0.3, 2, 0.7, TERRE.clair);
// les petites bêtes de l'étape mûre
function escargot(x, y, f) {
  const d = f * 0.8;
  return chemin(`M${f2(x - 3 + d)},${f2(y)} l3.6,0`, '#E8DCC8', 1.6) + `<circle cx="${f2(x - 1 + d)}" cy="${f2(y - 1.6)}" r="1.7" fill="#C98A4A" stroke="${OUT}" stroke-width="0.4"/>`
    + chemin(`M${f2(x - 1.6 + d)},${f2(y - 1.6)} a0.8,0.8 0 1,1 0.8,0.6`, '#8A5A2A', 0.4) + ln([x + 0.6 + d, y - 0.4], [x + 1.2 + d, y - 2.2], '#E8DCC8', 0.4) + ln([x + 0.9 + d, y - 0.4], [x + 1.8 + d, y - 1.9], '#E8DCC8', 0.4);
}
function papillonBlanc(x, y, f) {
  const o = [1, 0.35, 0.75][f % 3], h = [0, -1.2, -0.5][f % 3];
  return [-1, 1].map(s => `<path d="M${f2(x)},${f2(y + h - 0.4)} Q${f2(x + s * 3.2 * o)},${f2(y + h - 3.4)} ${f2(x + s * 2.6 * o)},${f2(y + h + 0.2)} Q${f2(x + s * 1.2 * o)},${f2(y + h + 1.2)} ${f2(x)},${f2(y + h - 0.4)} Z" fill="#FFFFFF" stroke="${OUT}" stroke-width="0.35"/>`
    + `<path d="M${f2(x + s * 2.3 * o)},${f2(y + h - 2.6)} Q${f2(x + s * 3.1 * o)},${f2(y + h - 2.9)} ${f2(x + s * 2.9 * o)},${f2(y + h - 1.4)} Z" fill="#3D3A36"/>`).join('') + ln([x, y + h - 1.2], [x, y + h + 0.6], OUT, 0.7);
}
function coccinelle(x, y) {
  return `<circle cx="${f2(x)}" cy="${f2(y)}" r="1.2" fill="${ROUGE}" stroke="${OUT}" stroke-width="0.35"/>` + ln([x, y - 1.2], [x, y + 1.2], OUT, 0.3) + dot(x - 0.5, y + 0.2, 0.25, OUT) + dot(x + 0.5, y - 0.2, 0.25, OUT) + dot(x + 1.1, y - 0.5, 0.45, OUT);
}
function abeille(x, y, f) {
  const dx = [0, 2.4, 1][f % 3], dy = [0, -1, 0.8][f % 3];
  return `<ellipse cx="${f2(x + dx)}" cy="${f2(y + dy)}" rx="1.4" ry="1" fill="#F2C04B" stroke="${OUT}" stroke-width="0.35"/>` + ln([x + dx - 0.2, y + dy - 0.9], [x + dx - 0.2, y + dy + 0.9], OUT, 0.4)
    + ell(x + dx - 0.2, y + dy - 1.4, 0.9, 0.6, 'rgba(255,255,255,.85)', ` stroke="${OUT}" stroke-width="0.3"`);
}
// ce qu'on pose au bord pour semer : le sachet, des godets de plants (fraises), un panier de pommes de terre germées
function godets(u, v) {
  const [x, y] = P(u, v, 0);
  return [[-2.4, 0], [2.2, -0.4]].map(([dx, dy]) => `<polygon points="${f2(x + dx - 1.6)},${f2(y + dy - 2.6)} ${f2(x + dx + 1.6)},${f2(y + dy - 2.6)} ${f2(x + dx + 1.1)},${f2(y + dy)} ${f2(x + dx - 1.1)},${f2(y + dy)}" fill="#C8704A"${EDGE}/>` + trefle(x + dx, y + dy - 2.6, 1.5, '#4F8F3A')).join('');
}
function panier(u, v, couleur) {
  const [x, y] = P(u, v, 0);
  return ell(x, y - 2.4, 3.4, 1.2, '#7A5232', ` stroke="${OUT}" stroke-width="0.4"`) + [[-1.4, -2.8], [0.6, -3], [1.8, -2.4], [-0.4, -2]].map(([a, b]) => fruit(x + a, y + b, 1, couleur, '#9A7040')).join('')
    + `<path d="M${f2(x - 3.4)},${f2(y - 2.4)} L${f2(x - 2.6)},${f2(y + 0.2)} Q${f2(x)},${f2(y + 1.2)} ${f2(x + 2.6)},${f2(y + 0.2)} L${f2(x + 3.4)},${f2(y - 2.4)} Q${f2(x)},${f2(y - 1.2)} ${f2(x - 3.4)},${f2(y - 2.4)} Z" fill="#B8864E"${EDGE}/>`
    + ln([x - 3, y - 1.2], [x + 3, y - 1.2], '#8A5E32', 0.5)
    + chemin(`M${f2(x - 3)},${f2(y - 2.6)} Q${f2(x)},${f2(y - 8)} ${f2(x + 3)},${f2(y - 2.6)}`, '#8A5E32', 0.9);
}

const POTAGER = {
  laitues: {
    dessin: '#8FCB6A',
    graine: (x, y) => [-1.2, 0, 1.2].map((o, i) => dot(x + o, y - 0.3 + (i % 2) * 0.3, 0.3, '#CDBB8E')).join(''),
    pousse: (x, y, s) => [-1, 0, 1].map((o, i) => feuille(x + o * 0.9 + s * 0.2, y - 1 - (i === 1 ? 0.5 : 0), 0.9, 0.6, LEAF_LIGHT, o * 30)).join(''),
    croissance: (x, y, s) => [0, 72, 144, 216, 288].map(a => feuille(x + Math.cos(a * Math.PI / 180) * 1.5 + s * 0.15, y - 1.4 + Math.sin(a * Math.PI / 180) * 0.8, 1.3, 0.9, LEAF_LIGHT, a)).join('') + feuille(x, y - 1.8, 1, 0.8, '#B8E07A'),
    mur: (x, y, s) => [0, 60, 120, 180, 240, 300].map(a => feuille(x + Math.cos(a * Math.PI / 180) * 2.2 + s * 0.15, y - 1.6 + Math.sin(a * Math.PI / 180) * 1.1, 1.8, 1.2, '#7CC25A', a)).join('')
      + [0, 90, 180, 270].map(a => feuille(x + Math.cos(a * Math.PI / 180) * 0.9, y - 2.4 + Math.sin(a * Math.PI / 180) * 0.5, 1.2, 0.9, '#A9D86E', a)).join('') + feuille(x, y - 2.8, 0.9, 0.7, '#CFEA92'),
    bete: f => { const [x, y] = P(0.08, 0.38, 0); return escargot(x, y, f); }
  },
  choux: {
    dessin: '#7FA894',
    espace: true,
    graine: (x, y) => dot(x - 0.6, y - 0.2, 0.4, '#3A2A22') + dot(x + 0.7, y - 0.1, 0.4, '#3A2A22'),
    pousse: (x, y, s) => tige([x, y], [x + s * 0.2, y - 1.8], '#6E9C88', 0.6) + feuille(x - 1.1 + s * 0.2, y - 2.2, 1.2, 0.8, '#9CC4B0', -20, '#4E7A68') + feuille(x + 1.1 + s * 0.2, y - 2.3, 1.2, 0.8, '#8FB8A0', 20, '#4E7A68'),
    croissance: (x, y, s) => [-130, -50, 30, 150].map(a => feuille(x + Math.cos(a * Math.PI / 180) * 2.2 + s * 0.2, y - 1.8 + Math.sin(a * Math.PI / 180) * 1.2, 2, 1.3, '#7FA894', a, '#4E7A68')).join('') + feuille(x, y - 2.4, 1.3, 1.1, '#A8CDB8', 0, '#4E7A68'),
    mur: (x, y, s) => [-150, -90, -30, 30, 90, 150].map(a => feuille(x + Math.cos(a * Math.PI / 180) * 3 + s * 0.2, y - 1.6 + Math.sin(a * Math.PI / 180) * 1.4, 2.2, 1.4, '#6E9C88', a, '#4E7A68')).join('')
      + `<circle cx="${f2(x)}" cy="${f2(y - 3)}" r="2.6" fill="#B5D6B0" stroke="#4E7A68" stroke-width="0.4"/>` + chemin(`M${f2(x - 1.6)},${f2(y - 3.6)} q1.6,-1 3.2,0 M${f2(x)},${f2(y - 5.4)} l0,2.6`, '#7FA894', 0.4),
    bete: f => { const [x, y] = P(0.05, 0.2, 9); return papillonBlanc(x, y, f); }
  },
  tomates: {
    dessin: ROUGE,
    espace: true,
    graine: (x, y) => ell(x - 0.6, y - 0.2, 0.6, 0.4, '#F0E2BE', ' stroke="#B8A47A" stroke-width="0.3"') + ell(x + 0.7, y - 0.1, 0.6, 0.4, '#F0E2BE', ' stroke="#B8A47A" stroke-width="0.3"'),
    pousse: (x, y, s) => tige([x, y], [x + s * 0.3, y - 3], '#6FA84A', 0.6) + feuille(x - 1 + s * 0.3, y - 2.6, 1, 0.55, '#6FA84A', -30) + feuille(x + 1 + s * 0.3, y - 3, 1, 0.55, LEAF, 30),
    croissance: (x, y, s) => piquetTuteur(x + 0.8, y, 11) + tige([x, y], [x + 0.6 + s * 0.2, y - 9], '#5E9A3E', 0.8)
      + [[-1.6, -3, -30], [1.8, -5, 30], [-1.6, -7, -30], [1.4, -8.6, 30]].map(([a, b, r]) => feuille(x + a + s * 0.3, y + b, 1.4, 0.7, LEAF, r)).join('')
      + [0, 72, 144, 216, 288].map(a => ell(x - 0.6 + Math.cos(a * Math.PI / 180) * 0.6 + s * 0.3, y - 5.8 + Math.sin(a * Math.PI / 180) * 0.4, 0.5, 0.35, '#F7C83A')).join('')
      + fruit(x + 1.2 + s * 0.3, y - 3.6, 0.9, '#8FC060', '#5E8A3A'),
    mur: (x, y, s) => piquetTuteur(x + 0.8, y, 11) + tige([x, y], [x + 0.6 + s * 0.2, y - 9], '#5E9A3E', 0.8)
      + [[-1.6, -3, -30], [1.8, -5, 30], [-1.6, -7.4, -30], [1.6, -8.8, 30]].map(([a, b, r]) => feuille(x + a + s * 0.3, y + b, 1.4, 0.7, LEAF, r)).join('')
      + [[1.4, -3.4, 1.2], [-1, -4.8, 1.1], [0.4, -6.2, 1], [-1.2, -2.4, 0.9]].map(([a, b, r], i) => fruit(x + a + s * 0.3, y + b, r, i === 3 ? '#F08A3A' : ROUGE, '#A8302A')).join(''),
    bete: () => { const [x, y] = P(0.155, 0, 0); return coccinelle(x - 1.6, y - 7.4); }
  },
  haricots: {
    dessin: '#7EC45B',
    espace: true,
    graine: (x, y) => ell(x - 0.7, y - 0.3, 1.1, 0.6, '#F2EBDD', ' stroke="#A89A80" stroke-width="0.3"') + dot(x - 0.7, y - 0.3, 0.25, '#5A3A22') + ell(x + 0.9, y - 0.1, 1.1, 0.6, '#C98A6A', ' stroke="#8A5A3A" stroke-width="0.3"'),
    pousse: (x, y, s) => tige([x, y], [x + s * 0.2, y - 2.6], '#7CBF4E', 0.8) + feuille(x - 1.1 + s * 0.2, y - 2.8, 1.3, 0.9, LEAF_LIGHT, -15) + feuille(x + 1.1 + s * 0.2, y - 2.9, 1.3, 0.9, LEAF, 15),
    croissance: (x, y, s) => piquetTuteur(x, y, 13) + chemin(`M${f2(x)},${f2(y)} q2,-2 0,-4 q-2,-2 0.2,-4 q2,-2 0.2,-3.4`, '#5E9A3E', 0.7)
      + [[-1.6, -2.4], [1.6, -5], [-1.4, -8], [1.4, -10.4]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 1, i % 2 ? LEAF_LIGHT : LEAF, a * 15)).join('')
      + [[1.2, -7], [-1, -11]].map(([a, b]) => dot(x + a + s * 0.3, y + b, 0.7, ROUGE)).join(''),
    mur: (x, y, s) => piquetTuteur(x, y, 13) + chemin(`M${f2(x)},${f2(y)} q2,-2 0,-4 q-2,-2 0.2,-4 q2,-2 0.2,-3.4`, '#5E9A3E', 0.7)
      + [[-1.6, -2.4], [1.6, -5], [-1.4, -8], [1.4, -10.4]].map(([a, b], i) => feuille(x + a + s * 0.3, y + b, 1.3, 1, i % 2 ? LEAF_LIGHT : LEAF, a * 15)).join('')
      + [[1, -3.4], [-1.2, -6.2], [1.2, -8.4]].map(([a, b]) => chemin(`M${f2(x + a + s * 0.3)},${f2(y + b)} q0.6,1.6 0,3.2`, '#3F7A2E', 1.5) + chemin(`M${f2(x + a + s * 0.3)},${f2(y + b)} q0.6,1.6 0,3.2`, '#9AD06A', 0.8)).join(''),
    bete: f => { const [x, y] = P(0.31, -0.14, 12); return abeille(x, y, f); }
  },
  fraises: {
    dessin: ROUGE,
    semoir: (u, v) => godets(u, v),
    graine: (x, y) => trefle(x, y, 1.2, '#4F8F3A'),
    pousse: (x, y, s, k) => trefle(x, y, 1.7, '#4F8F3A', s) + (k % 3 === 0 ? dot(x + 1.6, y - 1.2, 0.6, '#FFFFFF') + dot(x + 1.6, y - 1.2, 0.25, '#F2C04B') : ''),
    croissance: (x, y, s, k) => paille(x, y) + trefle(x - 1.2, y, 1.8, '#4F8F3A', s) + trefle(x + 1.3, y - 0.2, 1.8, LEAF, s)
      + (k % 2 ? dot(x + 0.2, y - 2.6, 0.7, '#FFFFFF') + dot(x + 0.2, y - 2.6, 0.3, '#F2C04B') : fruit(x + 0.4, y - 0.6, 0.7, '#B8D88A', '#6F9A3E')),
    mur: (x, y, s, k) => paille(x, y) + trefle(x - 1.2, y, 1.8, '#4F8F3A', s) + trefle(x + 1.3, y - 0.2, 1.8, LEAF, s)
      + [[0.4, -0.4], [-1.6, 0.2], ...(k % 2 ? [[1.8, 0.4]] : [])].map(([a, b]) => `<path d="M${f2(x + a - 0.9)},${f2(y + b - 0.6)} Q${f2(x + a)},${f2(y + b + 1.8)} ${f2(x + a + 0.9)},${f2(y + b - 0.6)} Z" fill="${ROUGE}" stroke="#A8302A" stroke-width="0.35"/>`
        + dot(x + a - 0.3, y + b, 0.15, '#F7E08A') + dot(x + a + 0.3, y + b + 0.3, 0.15, '#F7E08A') + ln([x + a - 0.7, y + b - 0.7], [x + a + 0.7, y + b - 0.7], '#4F8F3A', 0.6)).join(''),
    bete: () => ''
  },
  pommes_de_terre: {
    dessin: '#D9B27A',
    semoir: (u, v) => panier(u, v, '#D9B27A'),
    graine: (x, y, k) => (k % 2 ? '' : fruit(x, y - 0.6, 1.1, '#D9B27A', '#9A7040') + ln([x - 0.2, y - 1.6], [x - 0.6, y - 2.6], '#B07ACB', 0.6)),
    pousse: (x, y, s, k) => (k % 2 ? '' : butte(x, y) + trefle(x, y - 0.8, 1.4, '#4F8F3A', s)),
    croissance: (x, y, s, k) => (k % 2 ? '' : butte(x, y) + [[-1.6, -1.2], [1.4, -1.4], [0, -2.6]].map(([a, b]) => trefle(x + a, y + b, 1.6, a ? '#5E9A3E' : LEAF, s)).join('')
      + (k % 4 === 0 ? [0, 120, 240].map(a => dot(x + 0.4 + Math.cos(a * Math.PI / 180) * 0.6, y - 4.6 + Math.sin(a * Math.PI / 180) * 0.4, 0.45, '#ECE2F4')).join('') + dot(x + 0.4, y - 4.6, 0.25, '#F2C04B') : '')),
    mur: (x, y, s, k) => (k % 2 ? '' : butte(x, y) + [[-1.6, -1.2], [1.4, -1.4], [0, -2.6]].map(([a, b], i) => trefle(x + a, y + b, 1.6, i === 2 ? '#B9B24A' : '#9C9A3E', s)).join('')
      + fruit(x + 2.4, y + 0.6, 0.9, '#D9B27A', '#9A7040') + (k % 4 === 0 ? fruit(x - 2.6, y + 0.8, 0.8, '#D9B27A', '#9A7040') : '')),
    bete: () => ''
  }
};
// un plant du potager à son étape ; les cultures « espace » (choux, tomates, haricots) ne gardent qu'un plant sur deux
function plantDuPotager(culture, quoi, x, y, f, k) {
  const c = POTAGER[culture];
  if (c.espace && k % 2 && quoi !== 'semis') return '';
  const s = wave(f, IMAGES, quoi === 'pousses' ? 0.6 : 1.2, k * 0.9);
  return quoi === 'semis' ? c.graine(x, y, k) : c[quoi === 'pousses' ? 'pousse' : quoi](x, y, s, k);
}

/* ---------- les étapes ---------- */
// Une étape d'une culture, image n (0 à 2)
export function etape(culture, quoi, n) {
  if (!CULTURES.includes(culture)) throw new Error(`culture inconnue : ${culture}`);
  const f = n % IMAGES;
  if (!etapesDe(culture).includes(quoi)) throw new Error(`étape inconnue : ${quoi} (${etapesDe(culture).join(', ')})`);
  let out;
  if (quoi === 'bechage') {
    // la moitié du fond est bêchée (mottes), le devant est encore en herbe ; le tas d'herbes arrachées, la bêche, le ver
    out = carre(0.45, HERBE.fond) + bornage(f, false)
      + face([[-0.41, -0.41, 0], [0.41, -0.41, 0], [0.41, 0.06, 0], [-0.41, 0.06, 0]], TERRE.dedans, ` stroke="${TERRE.bord}" stroke-width="0.8"`);
    for (const [du, dv] of [[-0.3, -0.3], [-0.1, -0.33], [0.12, -0.28], [0.3, -0.32], [-0.22, -0.12], [0.02, -0.14], [0.24, -0.1], [-0.34, 0.02], [0.1, 0.02], [0.32, 0.03]]) {
      const [x, y] = P(du, dv, 0);
      out += ell(x, y, 2.4, 1.2, TERRE.motte, ` stroke="${OUT}" stroke-width="0.4"`) + ell(x - 0.5, y - 0.4, 1.1, 0.5, TERRE.clair);
    }
    for (const [du, dv] of [[-0.25, 0.22], [0.05, 0.3], [0.28, 0.2], [-0.05, 0.16], [0.2, 0.36]]) { const [x, y] = P(du, dv, 0); out += touffe(x, y); }
    const [hx, hy] = P(-0.3, 0.3, 0);
    out += ell(hx, hy - 1, 4.4, 2.2, '#7DAF4E', ` stroke="#4F7A2E" stroke-width="0.4"`) + touffe(hx - 1.6, hy - 1.6, 0.9) + touffe(hx + 1.4, hy - 1.8, 0.9)
      + ver(-0.16, -0.24, f) + beche(0.2, 0.08);
  } else {
    out = carre(0.45, TERRE.bord) + carre(0.41, TERRE.dedans, '') + bornage(f, false) + sillons();
    if (quoi === 'sillons') out += rateau(-0.36, 0.42);
    else {
      const pot = POTAGER[culture];
      for (const p of plants()) {
        const [x, y] = P(p.du, p.dv, 0);
        out += pot ? plantDuPotager(culture, quoi, x, y, f, p.k)
          : quoi === 'semis' ? graine(culture, x, y, p.k) : quoi === 'pousses' ? pousse(culture, x, y, f, p.k) : croissance(culture, x, y, f, p.k);
      }
      if (quoi === 'semis') out += moineau(-0.08, 0.36, f) + (pot && pot.semoir ? pot.semoir(0.36, 0.47) : sachet(0.36, 0.47, culture));
      if (quoi === 'mur') out += pot.bete(f);
    }
  }
  return out + bornage(f, true);
}
